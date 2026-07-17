// Shared header briefing strip for the Macro / Credit / Legal tabs — mirrors the
// Home briefing: a greeting, the single freshest premium TOP STORY, and the
// MARKETS + RATES & SPREADS one-liners. Self-contained (no app data imports); it
// reads the same server feeds Home uses (/api/pulse for the AI one-liners,
// /api/feed for the cross-desk premium headline).

const PREMIUM = new Set([
  "Financial Times", "FT Alphaville", "Bloomberg", "CNBC",
  "Reuters", "Reuters (via Investing.com)",
  "The Wall Street Journal", "WSJ", "The Economist",
]);

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const setV = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
const dayKey = (x) => `${String(x.date || "").slice(0, 10)} ${x.time || "12:00"}`;

export function initBrief() {
  const el = document.getElementById("wbrief");
  if (!el) return;
  const h = new Date().getHours();
  const greet = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  el.innerHTML =
    `<div class="wb-main">`
    + `<span class="wb-hello">${greet} — here's your briefing</span>`
    + `<span class="wb-brief" id="wb-brief"></span>`
    + `</div>`
    + `<div class="wb-glance">`
    + `<div class="wb-gl"><span class="wb-gl-l">Markets</span><span class="wb-gl-v" id="wb-markets">Loading…</span></div>`
    + `<div class="wb-gl"><span class="wb-gl-l">Rates &amp; spreads</span><span class="wb-gl-v" id="wb-rates">Loading…</span></div>`
    + `</div>`;

  // MARKETS / RATES one-liners — the AI "pulse" the Home page shows.
  let retried = false;
  const pulse = () => fetch("/api/pulse", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d) return;
      if (d.markets) setV("wb-markets", d.markets);
      if (d.rates) setV("wb-rates", d.rates);
      if (!d.markets && !retried) { retried = true; setTimeout(pulse, 15000); }
    })
    .catch(() => {});
  pulse();

  // TOP STORY — the freshest premium headline from the live cross-desk feed.
  fetch("/api/feed", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const items = (d && d.items) || [];
      const lead = items
        .filter((x) => x && x.title && x.url && PREMIUM.has(x.source))
        .sort((a, b) => dayKey(b).localeCompare(dayKey(a)))[0];
      const bl = document.getElementById("wb-brief");
      if (lead && bl) {
        bl.innerHTML = `<span class="wb-lbl">Top story</span> `
          + `<a class="wb-link" href="${esc(lead.url)}" target="_blank" rel="noopener noreferrer">${esc(lead.title)}</a>`;
      }
    })
    .catch(() => {});
}
