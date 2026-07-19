// Shared header briefing strip for the Macro / Credit / Legal tabs — a greeting
// plus the MARKETS + RATES & SPREADS one-liners. Top story is Home-only.
// Self-contained (no app data imports); reads the same server feeds Home uses
// (/api/pulse for the AI one-liners, /api/markets + /api/rates for the ticker).

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const setV = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };

// Short tickers for the markets strip (mirrors Home).
const TK_SHORT = { "S&P 500": "SPX", "NASDAQ": "NDX", "IGWD": "FTSE", "EMEE": "STOXX", "Oil": "BRENT", "Gold": "GOLD", "DXY": "DXY", "Bitcoin": "BTC" };
const fmtPrice = (v) => { const n = +v; if (!isFinite(n)) return String(v); return n >= 1000 ? n.toLocaleString("en-US", { maximumFractionDigits: 0 }) : n.toFixed(2); };
const fmtRateV = (v, unit) => (unit === "bp" ? `${Math.round(v * 100)}bp` : `${(+v).toFixed(2)}%`);
const sign = (n) => (n > 0 ? "up" : n < 0 ? "down" : "flat");

// The MKTS markets ticker — indices/commodities/crypto from /api/markets plus a
// couple of key rates from /api/rates, matching the Home strip.
function initTicker() {
  const el = document.getElementById("wticker");
  if (!el) return;
  el.innerHTML = `<div class="wtk-lbl">MKTS</div><div class="wtk-row" id="wtk-row"></div>`;
  Promise.all([
    fetch("/api/markets?v=9", { headers: { accept: "application/json" } }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
    fetch("/api/rates?v=9", { headers: { accept: "application/json" } }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
  ]).then(([m, rt]) => {
    const items = [];
    ((m && m.markets) || []).forEach((x) => {
      if (x.value == null) return;
      const eff = x.changePct != null ? +Number(x.changePct) : null;
      items.push({ s: TK_SHORT[x.label] || x.label, v: fmtPrice(x.value), chg: eff == null ? "" : `${eff > 0 ? "+" : ""}${eff.toFixed(2)}%`, dir: sign(eff || 0), href: x.href });
    });
    ((rt && rt.rates) || []).slice(0, 4).forEach((x) => {
      if (x.value == null) return;
      const bp = x.change != null ? Math.round(x.change * 100) : null;
      items.push({ s: x.label.replace(/ OAS$/, ""), v: fmtRateV(x.value, x.unit), chg: bp == null ? "" : `${bp > 0 ? "+" : ""}${bp}bp`, dir: sign(bp || 0), href: x.href });
    });
    const row = document.getElementById("wtk-row");
    if (!row || !items.length) return;
    row.innerHTML = items.map((it) => {
      const inner = `<span class="s">${esc(it.s)}</span><span class="v">${esc(it.v)}</span>${it.chg ? `<span class="${it.dir}">${esc(it.chg)}</span>` : ""}`;
      return it.href ? `<a class="wtk" href="${esc(it.href)}" target="_blank" rel="noopener noreferrer">${inner}</a>` : `<span class="wtk">${inner}</span>`;
    }).join("");
  });
}

export function initBrief() {
  initTicker();
  const el = document.getElementById("wbrief");
  if (!el) return;
  const h = new Date().getHours();
  const greet = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  // No Top story on the app pages — that's a Home-only element; here the strip
  // is just the greeting plus the Markets / Rates one-liners.
  el.innerHTML =
    `<div class="wb-main">`
    + `<span class="wb-hello">${greet} — here's your briefing</span>`
    + `</div>`
    + `<div class="wb-glance">`
    + `<div class="wb-gl"><span class="wb-gl-l">Markets</span><span class="wb-gl-v" id="wb-markets">Loading…</span></div>`
    + `<div class="wb-gl"><span class="wb-gl-l">Rates &amp; spreads</span><span class="wb-gl-v" id="wb-rates">Loading…</span></div>`
    + `</div>`;

  // MARKETS / RATES lines = the top live-feed story in each category (same as
  // Home). The AI "pulse" one-liner is only a fallback while the feed is empty.
  const MKT_RE = /\b(stocks?|equit\w*|shares?|S&P|Nasdaq|Dow|FTSE|Nikkei|oil|crude|Brent|gold|dollar|DXY|bitcoin|crypto|rally|sell-?off|futures|Wall Street|market)\b/i;
  const RATE_RE = /\b(treasur\w*|yields?|gilts?|bonds?|interest rates?|rate (cut|hike|rise|path)|Fed\b|FOMC|Bank of England|BoE|ECB|central bank|spreads?|credit|inflation|CPI|PCE)\b/i;
  const leads = { markets: false, rates: false };
  const setStory = (id, x) => {
    const el = document.getElementById(id);
    if (el && x) el.innerHTML = `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)}</a>`;
  };
  fetch("/api/feed", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const items = (d && d.items) || [];
      const mkt = items.find((x) => x && x.title && MKT_RE.test(x.title));
      const rt = items.find((x) => x && x.title && x !== mkt && RATE_RE.test(x.title));
      if (mkt) { leads.markets = true; setStory("wb-markets", mkt); }
      if (rt) { leads.rates = true; setStory("wb-rates", rt); }
    })
    .catch(() => {});
  let retried = false;
  const pulse = () => fetch("/api/pulse", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d) return;
      if (d.markets && !leads.markets) setV("wb-markets", d.markets);
      if (d.rates && !leads.rates) setV("wb-rates", d.rates);
      if (!d.markets && !retried) { retried = true; setTimeout(pulse, 15000); }
    })
    .catch(() => {});
  pulse();

}
