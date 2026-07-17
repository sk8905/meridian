// =============================================================================
// Shared section top-bar actions — mirrors the Home command bar so every page
// carries the same three buttons: Markets (a dropdown of live markets & key
// rates, fetched from the same /api/markets + /api/rates feeds Home uses),
// Saved (deep-links to the section's own saved/watchlist view) and the existing
// notification bell. Loaded by Credit / Macro / Legal (Home has its own).
// =============================================================================
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtNum = (v) => { v = +v; if (!isFinite(v)) return "—"; const a = Math.abs(v); if (a >= 1000) return v.toLocaleString(undefined, { maximumFractionDigits: a >= 10000 ? 0 : 1 }); if (a >= 100) return v.toFixed(1); if (a >= 1) return v.toFixed(2); return v.toFixed(4); };
const fmtRateVal = (v, unit) => { v = +v; if (!isFinite(v)) return "—"; if (unit === "bp") return v.toFixed(0) + " bp"; return v.toFixed(2) + "%"; };

const SAVED_HREF = (() => {
  const p = location.pathname;
  if (p.startsWith("/credit/")) return "#/watchlist";
  if (p.startsWith("/legal/")) return "#/list?saved=1";
  if (p.startsWith("/macro/")) return "#/saved";
  return "#/";
})();

const ICO_MKT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/></svg>';
const ICO_SAVED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>';

function marketRow(x) {
  const c = typeof x.changePct === "number" && isFinite(x.changePct) ? x.changePct : null;
  const dir = c == null ? "flat" : c > 0 ? "up" : c < 0 ? "down" : "flat";
  const arw = c == null ? "·" : c > 0 ? "▲" : c < 0 ? "▼" : "·";
  return `<div class="na-row"><span class="na-l">${esc(x.label)}</span><span class="na-v">${x.value != null ? fmtNum(x.value) : "—"}</span><span class="na-c ${dir}">${c == null ? "" : arw + " " + Math.abs(c).toFixed(2) + "%"}</span></div>`;
}
function rateRow(x) {
  const bp = x.unit === "bp";
  const c = x.change == null ? null : (bp ? Math.round(x.change * 100) : +Number(x.change).toFixed(2));
  const dir = c == null ? "flat" : c > 0 ? "up" : c < 0 ? "down" : "flat";
  const arw = c == null ? "·" : c > 0 ? "▲" : c < 0 ? "▼" : "·";
  const mag = c == null ? "" : (bp ? Math.abs(c) + " bp" : Math.abs(c).toFixed(2));
  return `<div class="na-row"><span class="na-l">${esc(x.label)}</span><span class="na-v">${x.value != null ? fmtRateVal(x.value, x.unit) : "—"}</span><span class="na-c ${dir}">${arw} ${mag}</span></div>`;
}

let _loaded = false;
function loadPanel(panel) {
  panel.innerHTML = '<div class="na-load">Loading…</div>';
  Promise.all([
    fetch("/api/markets?v=9", { headers: { accept: "application/json" } }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
    fetch("/api/rates?v=9", { headers: { accept: "application/json" } }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
  ]).then(([m, rt]) => {
    const markets = (m && m.markets) || [];
    const rates = (rt && rt.rates) || [];
    if (!markets.length && !rates.length) { panel.innerHTML = '<div class="na-load">Markets unavailable right now.</div>'; return; }
    panel.innerHTML =
      (markets.length ? `<div class="na-sec">Markets</div>${markets.map(marketRow).join("")}` : "") +
      (rates.length ? `<div class="na-sec">Key rates</div>${rates.map(rateRow).join("")}` : "");
  });
}

export function initNavActions() {
  const run = () => {
    const notif = document.getElementById("notif");
    const bar = document.querySelector(".topbar-right");
    if (!notif && !bar) return;
    if (document.getElementById("na-mkt")) return; // already mounted
    const wrap = document.createElement("div");
    wrap.className = "na-actions";
    wrap.innerHTML =
      `<button type="button" class="na-btn" id="na-mkt" aria-label="Markets & key rates" aria-haspopup="true" aria-expanded="false" title="Markets & key rates">${ICO_MKT}</button>` +
      `<a class="na-btn" id="na-saved" href="${SAVED_HREF}" aria-label="Saved" title="Saved">${ICO_SAVED}</a>` +
      `<div class="na-panel" id="na-mkt-panel" role="menu" hidden></div>`;
    // Group Markets · Saved · Bell into ONE right-hand cluster (mirrors the Home
    // command bar). The section grid assigns the bell its own grid-area, so an
    // un-placed sibling wraps to a new row on the left — instead we drop the
    // cluster where the bell was and MOVE the existing #notif element inside it,
    // keeping its id/handlers intact.
    if (notif && notif.parentElement) {
      notif.parentElement.insertBefore(wrap, notif);
      wrap.appendChild(notif); // Markets · Saved · Bell, in one flex row
    } else if (bar) {
      bar.appendChild(wrap);
    }

    const btn = wrap.querySelector("#na-mkt");
    const panel = wrap.querySelector("#na-mkt-panel");
    // Lift the dropdown OUT of the sticky top bar to the document body. Inside the
    // sticky/position-context top bar iOS can demote this fixed panel below other
    // newly-stacked layers (e.g. the sticky filter-chip bar), so it renders behind
    // them; as a direct child of <body> it is a true top-level layer over the page.
    document.body.appendChild(panel);
    const close = () => { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); };
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open && !_loaded) { _loaded = true; loadPanel(panel); }
      if (open) { const r = btn.getBoundingClientRect(); panel.style.top = `${Math.round(r.bottom + 8)}px`; }
    });
    document.addEventListener("click", (e) => { if (panel.hidden) return; if (e.target.closest("#na-mkt-panel") || e.target.closest("#na-mkt")) return; close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  };
  if (document.readyState !== "loading") run(); else document.addEventListener("DOMContentLoaded", run);
}
