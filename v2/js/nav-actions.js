// AUTO-PORTED from nav-actions.js for the v2 SPA. The HEADER cluster (Markets /
// Saved / Notifications / Search buttons + their panels, the notif bell and
// saved/markets loaders) is reused verbatim; only the parts that clash with the
// v2 runtime are neutralised: it no longer builds its own bottom tab bar, wires
// nav onto the bar, or enables swipe-tabs (the runtime owns all navigation).

// =============================================================================
// Shared section top-bar actions — one implementation, mounted identically on
// Credit / Macro / Legal (Home has its own equivalent in glance.js). Every page
// carries the same three buttons: Markets (live markets, key rates & a cross-
// asset ETF board), Saved (the unified cross-desk starred list — identical
// everywhere) and the existing per-app Notifications bell (contextual).
//
// On phones each opens as a FULL-SCREEN page below the sticky top bar, styled as
// terminal feed rows; on desktop they're compact dropdowns. Markets & Saved are
// owned here; the bell keeps its own per-app content/seen-state but is layered
// with the same full-screen presentation on mobile.
// =============================================================================
import { esc, MONTHS } from "/util.js?v=20260719-1";
const fmtNum = (v) => { v = +v; if (!isFinite(v)) return "—"; const a = Math.abs(v); if (a >= 1000) return v.toLocaleString(undefined, { maximumFractionDigits: a >= 10000 ? 0 : 1 }); if (a >= 100) return v.toFixed(1); if (a >= 1) return v.toFixed(2); return v.toFixed(4); };
const fmtRateVal = (v, unit) => { v = +v; if (!isFinite(v)) return "—"; if (unit === "bp") return v.toFixed(0) + " bp"; return v.toFixed(2) + "%"; };
function fmtDate(d) { if (!d) return ""; const s = /^\d{4}-\d{2}$/.test(d) ? d + "-01" : String(d).slice(0, 10); const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s); if (!m) return String(d); return `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}`; }

const DESK = { m: "Macro", c: "Credit", l: "Legal" };
const DESK_CLASS = { m: "macro", c: "credit", l: "legal", n: "newsletter", f: "ft", s: "substack", b: "brew", news: "news", bbg: "bbg", econ: "econ", comm: "comm", deal: "deal", fund: "fund", clo: "clo", alert: "alert", case: "case", scheme: "scheme", rp: "rp" };

const ICO_MKT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/></svg>';
const ICO_SAVED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
const ICO_MAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.6" y1="15.6" x2="21" y2="21"/></svg>';

const isPhone = () => matchMedia("(max-width:760px)").matches;
// Menu is a PAGE (/menu/) — reached through the tab bar exactly like the other
// pages, not an overlay. On that page the menu panel mounts permanently open.
const ON_MENU_PAGE = /^\/menu\/?$/.test(location.pathname);

// ---- Diagnostics ------------------------------------------------------------
// Build stamp (the premium.css token this document loaded — shown in the Menu
// footer so "am I on the current build?" is answerable at a glance) and a
// navigation detective: the last few input events are persisted across unload,
// and when a page load arrives via HISTORY traversal (back_forward — what the
// iOS edge swipe gestures produce, invisible to page code) a diagnostic toast
// says so, with the previous page and its final touches.
const BUILD_TOKEN = (() => {
  const link = document.querySelector('link[href*="premium.css"]');
  const m = String((link && link.getAttribute("href")) || "").match(/premium\.css\?v=([\w.-]+)/);
  return m ? m[1] : "dev";
})();
const NAV_TYPE = (() => {
  try { const e = performance.getEntriesByType("navigation")[0]; return e ? e.type : "unknown"; } catch { return "unknown"; }
})();
const _evLog = [];
function _logEv(e) {
  let t = e.target;
  if (t && t.closest) t = t.closest("button, a, .mtab, [data-open-menu]") || e.target;
  const cls = t && t.className != null && t.className.baseVal === undefined ? String(t.className).split(" ").slice(0, 2).join(".") : "";
  _evLog.push((Date.now() % 100000) + " " + e.type + " " + ((t && t.tagName) || "?") + (cls ? "." + cls : ""));
  if (_evLog.length > 30) _evLog.shift();
}
["pointerdown", "click"].forEach((k) => document.addEventListener(k, _logEv, true));
window.addEventListener("popstate", _logEv);
window.addEventListener("pagehide", (e) => {
  _logEv(e);
  try { sessionStorage.setItem("wire.lastPage", JSON.stringify({ url: location.href, at: Date.now(), ev: _evLog.slice(-8) })); } catch { /* private mode */ }
});
function navDiag() {
  if (NAV_TYPE !== "back_forward") return;
  let prev = null;
  try { prev = JSON.parse(sessionStorage.getItem("wire.lastPage") || "null"); } catch { /* none */ }
  const el = document.createElement("div");
  el.className = "wire-navdiag";
  el.innerHTML = "<strong>⚠ history navigation (back_forward)</strong><br>"
    + (prev
      ? "from " + esc(String(prev.url).replace(location.origin, "")) + " · " + Math.round((Date.now() - (prev.at || 0)) / 1000) + "s ago<br>" + (prev.ev || []).map((x) => esc(x)).join("<br>")
      : "no prior page record");
  document.body.appendChild(el);
  el.addEventListener("click", () => el.remove());
  setTimeout(() => { if (el.isConnected) el.remove(); }, 15000);
}


// ---- Markets rows -----------------------------------------------------------
// US regular session (NYSE/Nasdaq): Mon–Fri 09:30–16:00 America/New_York.
function usEquityOpen() {
  try {
    const p = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    const g = (t) => (p.find((x) => x.type === t) || {}).value;
    const dow = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[g("weekday")];
    if (dow === 0 || dow === 6) return false;
    let h = +g("hour"); if (h === 24) h = 0;
    const t = h * 60 + +g("minute"); return t >= 570 && t < 960;
  } catch { return false; }
}
// Top movers are all US-listed ETFs → always show a session dot: Yahoo's
// marketState when present, else the US-equity clock.
function naEtfDot(x) {
  const open = x && x.marketState ? x.marketState === "REGULAR" : usEquityOpen();
  const tip = open ? "Market open" : "Market closed";
  return ` <span class="na-dot ${open ? "open" : "closed"}" title="${esc(tip)}" aria-label="${esc(tip)}"></span>`;
}
// London Stock Exchange regular session: Mon–Fri 08:00–16:30 Europe/London.
function lseOpen() {
  try {
    const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    const g = (t) => (p.find((x) => x.type === t) || {}).value;
    const dow = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[g("weekday")];
    if (dow === 0 || dow === 6) return false;
    let h = +g("hour"); if (h === 24) h = 0;
    const t = h * 60 + +g("minute"); return t >= 480 && t < 990;
  } catch { return false; }
}
// ALWAYS-rendered session dot: Yahoo's marketState when present, otherwise an
// exchange clock (so LSE lines that fall back to Stooq — which carries no state —
// still show open/closed). Crypto trades 24/7. Used on Markets + Portfolio rows.
function sessDot(marketState, exch) {
  const open = marketState ? marketState === "REGULAR"
    : exch === "CRYPTO" ? true
    : exch === "LSE" ? lseOpen()
    : usEquityOpen();
  const tip = open ? "Market open" : "Market closed";
  return ` <span class="na-dot ${open ? "open" : "closed"}" title="${esc(tip)}" aria-label="${esc(tip)}"></span>`;
}
// Which exchange clock backs each Markets-tab row when marketState is missing.
const MKT_EXCH = { "S&P 500": "US", "NASDAQ": "US", "IGWD": "LSE", "EMEE": "LSE", "Bitcoin": "CRYPTO" };
const naSec = (title, tag) => `<div class="na-sec"><span>${esc(title)}</span><span class="na-sec-x">${esc(tag)}</span></div>`;

// The reader's ETF book, aggregated per ticker (accounts ignored — IGWD's two
// accounts fold into one line at their unit-weighted average cost, 639 units).
// `cost` is the average price paid PER UNIT in GBP-major, the SAME unit
// /api/markets returns (LSE lines are rescaled GBp→GBP there), so value/P&L
// compare like-for-like. The tiny EMEE/WMVG costs are real: penny-priced lines
// held in huge size — and their live quote arrives UNSCALED (raw pence), so they
// carry `pxScale: 0.01` to bring the price back to GBP-major before valuing.
const PORTFOLIO = [
  { ticker: "IGWD", qty: 639, cost: 118.2118, exch: "LSE", href: "https://uk.finance.yahoo.com/quote/IGWD.L" },   // 476 @ £115.99 + 163 @ £124.70
  { ticker: "CNX1", qty: 1, cost: 1269.17, exch: "LSE", href: "https://uk.finance.yahoo.com/quote/CNX1.L" },
  { ticker: "EMEE", qty: 303000, cost: 0.0596, pxScale: 0.01, exch: "LSE", href: "https://uk.finance.yahoo.com/quote/EMEE.L" },
  { ticker: "WMVG", qty: 363600, cost: 0.0823, pxScale: 0.01, exch: "LSE", href: "https://uk.finance.yahoo.com/quote/WMVG.L" },
  { ticker: "COMM", qty: 1424, cost: 6.6794, exch: "LSE", href: "https://uk.finance.yahoo.com/quote/COMM.L" },
  { ticker: "BTCGBP", label: "BTC", qty: 0.02204, cost: 64633.31, exch: "CRYPTO", href: "https://finance.yahoo.com/quote/BTC-GBP" },
];
// £ money: sign + thousands, always 2dp (so the portfolio value reads to the penny).
function fmtGBP(v, sign) {
  if (v == null || !isFinite(v)) return "—";
  const a = Math.abs(v);
  const s = a.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pre = sign && v > 0 ? "+£" : v < 0 ? "−£" : "£";
  return pre + s;
}

let _mktLoaded = false;
// Markets panel: Markets | Macro | Portfolio chip tabs over one shared fetch.
// Byte-identical on every page (Home included) — the shared dropdown.
let _mktTab = "markets";
let _pfMode = "daily";   // portfolio holdings P&L column: daily (default) | total
function loadMarkets(body) {
  body.innerHTML = `<div class="na-chips">`
    + `<button type="button" class="na-chip" data-k="markets">Markets</button>`
    + `<button type="button" class="na-chip" data-k="macro">Macro</button>`
    + `<button type="button" class="na-chip" data-k="predict">Predictions</button>`
    + `<button type="button" class="na-chip" data-k="portfolio">Portfolio</button>`
    + `</div><div class="na-tabbody"><div class="na-load">Loading…</div></div>`;
  const chips = body.querySelector(".na-chips");
  const tb = body.querySelector(".na-tabbody");
  let data = null, predict = null, predictLoading = false;
  const render = () => {
    chips.querySelectorAll(".na-chip").forEach((c) => c.classList.toggle("is-on", c.dataset.k === _mktTab));
    if (_mktTab === "predict") { tb.innerHTML = predictPane(predict, predictLoading); return; }
    if (!data) { tb.innerHTML = '<div class="na-load">Loading…</div>'; return; }
    tb.innerHTML = _mktTab === "portfolio" ? portfolioPane(data) : _mktTab === "macro" ? macroPane(data) : marketsPane(data);
  };
  // Predictions load lazily on first view (their own upstream fetch).
  const loadPredict = () => {
    if (predict != null || predictLoading) return;
    predictLoading = true;
    fetch("/api/predict?v=8", { headers: { accept: "application/json" } }).then((r) => (r.ok ? r.json() : null)).catch(() => null)
      .then((p) => { predict = (p && p.markets) || []; predictLoading = false; if (_mktTab === "predict") render(); });
  };
  chips.addEventListener("click", (e) => { const c = e.target.closest(".na-chip"); if (c && c.dataset.k !== _mktTab) { _mktTab = c.dataset.k; if (_mktTab === "predict") loadPredict(); render(); } });
  // Delegated in-pane controls. stopPropagation is essential: render() replaces
  // tb's innerHTML, detaching the tapped button; without it the document-level
  // outside-click closer then sees a now-orphaned target (closest(".na-panel") ===
  // null) and dismisses the panel.
  tb.addEventListener("click", (e) => {
    const tgl = e.target.closest(".na-pf-tgl");        // portfolio Daily/Total
    if (tgl) { e.preventDefault(); e.stopPropagation(); if (tgl.dataset.m !== _pfMode) { _pfMode = tgl.dataset.m; render(); } return; }
    const ps = e.target.closest(".na-pred-fchip");     // predictions Macro/Politics/Finance
    if (ps && !ps.disabled) { e.preventDefault(); e.stopPropagation(); if (ps.dataset.ps !== _predSuper) { _predSuper = ps.dataset.ps; render(); } return; }
    const dir = e.target.closest(".na-pred-dir");      // Top Movers Up/Down
    if (dir) { e.preventDefault(); e.stopPropagation(); if (dir.dataset.dir !== _predMoveDir) { _predMoveDir = dir.dataset.dir; render(); } }
  });
  if (_mktTab === "predict") loadPredict();
  render();
  Promise.all([
    fetch("/api/markets?v=13", { headers: { accept: "application/json" } }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
    fetch("/api/rates?v=12", { headers: { accept: "application/json" } }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
  ]).then(([m, rt]) => {
    data = { markets: (m && m.markets) || [], movers: (m && m.moversEtf) || [], moversExtra: (m && m.moversExtra) || [], portfolio: (m && m.portfolio) || [], rates: (rt && rt.rates) || [] };
    render();
  });
}
// Prediction-market rows — matches the desktop rail: question + meta (venue ·
// close date) on the left; the implied YES odds pinned top-right with the daily
// odds change (percentage points) stacked directly beneath it.
// Market size = total money wagered (Polymarket USD volume), compacted.
function fmtVol(n) {
  n = +n || 0;
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + n;
}
function predictRow(m) {
  const yes = typeof m.yes === "number" ? m.yes : null;
  const cls = yes == null ? "" : yes >= 50 ? " hi" : " lo";
  let chg = '<span class="na-pred-chg flat">·</span>';
  if (typeof m.chg === "number" && isFinite(m.chg)) {
    const c = +m.chg.toFixed(1);
    const dir = c > 0 ? "up" : c < 0 ? "down" : "flat";
    chg = `<span class="na-pred-chg ${dir}">${c > 0 ? "▲" : c < 0 ? "▼" : "·"} ${Math.abs(c).toFixed(1)}</span>`;
  }
  return `<a class="nf-row na-pred" href="${esc(m.url || "#")}" target="_blank" rel="noopener noreferrer">`
    + `<span class="na-pred-main"><span class="nf-title">${esc(m.q)}</span>`
    + `<span class="nf-meta"><span class="nf-src">${esc(m.venue || "")}</span>`
    + (m.vol ? `<span class="nf-sep">·</span><span class="nf-time">${esc(fmtVol(m.vol))}</span>` : "")
    + (m.end ? `<span class="nf-sep">·</span><span class="nf-time">${esc(fmtDate(m.end))}</span>` : "")
    + `</span></span>`
    + `<span class="na-pred-nums"><span class="na-pred-yes${cls}">${yes == null ? "—" : yes + "%"}</span>${chg}</span></a>`;
}
const PRED_TYPE_ORDER = ["Fed & rates", "Economy", "Equities", "Crypto", "Trump", "Geopolitics", "Elections", "Other"];
// Largest (default) + Top Movers + the three type super-groups (as on desktop).
const NA_PRED_SUPERS = ["Largest", "Top Movers", "Macro", "Politics", "Finance"];
const NA_PRED_SUPER_TYPES = { Macro: ["Fed & rates", "Economy", "Other"], Politics: ["Trump", "Geopolitics", "Elections"], Finance: ["Equities", "Crypto"] };
const NA_PRED_SUPER_OF = {};
for (const s of ["Macro", "Politics", "Finance"]) for (const t of NA_PRED_SUPER_TYPES[s]) NA_PRED_SUPER_OF[t] = s;
const naPredSuperOf = (t) => NA_PRED_SUPER_OF[t] || "Macro";
// Movers = liquid markets whose implied odds actually MOVED today, ranked biggest
// daily-odds INCREASE → biggest DECREASE (unchanged markets are excluded here).
function naPredMovers(list) {
  return list.filter((m) => (m.vol || 0) >= 10000 && typeof m.chg === "number" && isFinite(m.chg) && m.chg !== 0)
    .sort((a, b) => (b.chg - a.chg) || ((b.vol || 0) - (a.vol || 0)))
    .slice(0, 40);
}
let _predSuper = "Largest", _predMoveDir = "up";
function predictPane(list, loading) {
  if (loading || list == null) return '<div class="na-load">Loading…</div>';
  if (!list.length) return '<div class="na-load">No prediction markets available right now.</div>';
  const supers = { Macro: {}, Politics: {}, Finance: {} };
  for (const m of list) { const t = m.type || "Other"; (supers[naPredSuperOf(t)][t] = supers[naPredSuperOf(t)][t] || []).push(m); }
  const movers = naPredMovers(list);
  const largest = list.slice().sort((a, b) => (b.vol || 0) - (a.vol || 0));
  const has = (s) => s === "Top Movers" ? movers.length > 0 : s === "Largest" ? list.length > 0 : Object.keys(supers[s]).length > 0;
  if (!has(_predSuper)) _predSuper = NA_PRED_SUPERS.find(has) || "Macro";
  const chips = `<div class="na-pred-chips" role="tablist">`
    + NA_PRED_SUPERS.map((s) => `<button type="button" class="na-pred-fchip${_predSuper === s ? " on" : ""}" data-ps="${esc(s)}"${has(s) ? "" : " disabled"}>${esc(s)}</button>`).join("")
    + `</div>`;
  let body;
  if (_predSuper === "Top Movers") {
    // Two views only: Up = increases (largest→smallest); Down = decreases
    // (largest magnitude→smallest). One is always selected.
    const rows = _predMoveDir === "down"
      ? movers.filter((m) => m.chg < 0).sort((a, b) => a.chg - b.chg)
      : movers.filter((m) => m.chg > 0);
    const tgl = `<span class="na-pf-tgl-wrap" role="tablist">`
      + `<button type="button" class="na-pred-dir${_predMoveDir === "up" ? " on" : ""}" data-dir="up">Up</button>`
      + `<button type="button" class="na-pred-dir${_predMoveDir === "down" ? " on" : ""}" data-dir="down">Down</button></span>`;
    const hdr = `<div class="na-sec na-sec-tgl"><span>Top movers</span>${tgl}</div>`;
    body = hdr + rows.map(predictRow).join("");
  } else if (_predSuper === "Largest") {
    body = naSec("Largest markets", "by size") + largest.map(predictRow).join("");
  } else {
    const active = supers[_predSuper] || {};
    const subTypes = PRED_TYPE_ORDER.filter((t) => active[t]).concat(Object.keys(active).filter((t) => !PRED_TYPE_ORDER.includes(t)));
    body = subTypes.map((t) => naSec(t, "implied YES %") + active[t].map(predictRow).join("")).join("");
  }
  return chips + body;
}
function marketRow(x) {
  const c = typeof x.changePct === "number" && isFinite(x.changePct) ? x.changePct : null;
  const dir = c == null ? "flat" : c > 0 ? "up" : c < 0 ? "down" : "flat";
  const arw = c == null ? "·" : c > 0 ? "▲" : c < 0 ? "▼" : "·";
  return `<div class="na-mrow"><span class="na-l">${esc(x.label)}${sessDot(x.marketState, MKT_EXCH[x.label] || "US")}</span><span class="na-v">${x.value != null ? fmtNum(x.value) : "—"}</span><span class="na-c ${dir}">${c == null ? "" : arw + " " + Math.abs(c).toFixed(2) + "%"}</span></div>`;
}
function rateRow(x) {
  const bp = x.unit === "bp";
  const c = x.change == null ? null : (bp ? Math.round(x.change * 100) : +Number(x.change).toFixed(2));
  const dir = c == null ? "flat" : c > 0 ? "up" : c < 0 ? "down" : "flat";
  const arw = c == null ? "·" : c > 0 ? "▲" : c < 0 ? "▼" : "·";
  const mag = c == null ? "" : (bp ? Math.abs(c) + " bp" : Math.abs(c).toFixed(2));
  return `<div class="na-mrow"><span class="na-l">${esc(x.label)}</span><span class="na-v">${x.value != null ? fmtRateVal(x.value, x.unit) : "—"}</span><span class="na-c ${dir}">${arw} ${mag}</span></div>`;
}
function moverRow(x) {
  const c = typeof x.changePct === "number" && isFinite(x.changePct) ? x.changePct : null;
  const dir = c == null ? "flat" : c > 0 ? "up" : c < 0 ? "down" : "flat";
  const pct = c == null ? "" : (c > 0 ? "+" : "") + c.toFixed(2) + "%";
  const w = c == null ? 0 : Math.max(3, Math.min(50, Math.abs(c) * 15));
  const inner = `<span class="na-l">${esc(x.label)}${naEtfDot(x)}</span>`
    + `<span class="na-bar"><span class="na-bar-f ${dir}" style="width:${w}%"></span></span>`
    + `<span class="na-c ${dir}">${pct}</span>`;
  return x.href
    ? `<a class="na-mrow na-mover" href="${esc(x.href)}" target="_blank" rel="noopener noreferrer">${inner}</a>`
    : `<div class="na-mrow na-mover">${inner}</div>`;
}
// FX daily matrix — USD/GBP/EUR/JPY cross rates derived from the three USD pairs
// already in the markets payload's extra-movers pool (no extra request). Mirrors
// the desktop right-rail grid; cell(row,col) = 1 unit of the row ccy in the col ccy.
const NA_FX_CCY = ["USD", "GBP", "EUR", "JPY"];
function naFxData(d) {
  const all = [...((d && d.markets) || []), ...((d && d.moversExtra) || [])];
  const find = (lbl) => all.find((x) => x.label === lbl);
  const g = find("GBP/USD"), e = find("EUR/USD"), j = find("USD/JPY");
  const v = (x) => (x && x.value != null ? +x.value : NaN);
  if (!(v(g) > 0) || !(v(e) > 0) || !(v(j) > 0)) return null;
  const chg = (x) => (x && typeof x.changePct === "number" && isFinite(x.changePct) ? x.changePct : 0);
  return { up: { USD: 1, GBP: v(g), EUR: v(e), JPY: 1 / v(j) }, dPct: { USD: 0, GBP: chg(g), EUR: chg(e), JPY: -chg(j) } };
}
const naFmtFx = (v) => (v >= 100 ? v.toFixed(1) : v >= 1 ? v.toFixed(3) : v.toFixed(4));
function naFxHeat(chg) {
  const a = Math.min(Math.abs(chg) / 1.0, 1) * 0.18;
  if (!(a > 0.015)) return "";
  return ` style="background:rgba(${chg > 0 ? "5,150,105" : "220,38,38"},${a.toFixed(3)})"`;
}
function naFxMatrix(d) {
  const fx = naFxData(d);
  if (!fx) return "";
  const { up, dPct } = fx;
  const head = `<tr><th></th>${NA_FX_CCY.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>`;
  const body = NA_FX_CCY.map((base) => {
    const cells = NA_FX_CCY.map((q) => {
      if (base === q) return `<td class="na-fx-diag">—</td>`;
      const chg = dPct[base] - dPct[q];
      const tip = `${base}/${q} ${chg > 0 ? "+" : ""}${chg.toFixed(2)}% today — source: Yahoo Finance`;
      const href = `https://finance.yahoo.com/quote/${base}${q}=X`;
      return `<td${naFxHeat(chg)}><a href="${esc(href)}" target="_blank" rel="noopener noreferrer" title="${esc(tip)}">${esc(naFmtFx(up[base] / up[q]))}</a></td>`;
    }).join("");
    return `<tr><th>${esc(base)}</th>${cells}</tr>`;
  }).join("");
  return naSec("FX matrix", "1D cross") + `<div class="na-fx-wrap"><table class="na-fx-tbl"><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
}
function marketsPane(d) {
  if (!d.markets.length && !d.movers.length) return '<div class="na-load">Markets unavailable right now.</div>';
  // Top movers ranked greatest increase → greatest decrease (signed, as on the
  // desktop movers board): biggest gainer first, biggest faller last.
  const movers = [...d.movers].sort((a, b) => (b.changePct || 0) - (a.changePct || 0));
  return (d.markets.length ? naSec("Markets", "live") + d.markets.map(marketRow).join("") : "")
    + (movers.length ? naSec("Top movers", "1D") + movers.map(moverRow).join("") : "")
    + naFxMatrix(d);
}
function macroPane(d) {
  if (!d.rates.length) return '<div class="na-load">Key rates unavailable right now.</div>';
  return naSec("Key rates & spreads", "bp · %") + d.rates.map(rateRow).join("");
}
// A markets-panel row (label · value · % change) — same grammar as marketRow.
function pfMrow(label, valueStr, pct, dot, href) {
  const c = typeof pct === "number" && isFinite(pct) ? pct : null;
  const dir = c == null ? "flat" : c > 0 ? "up" : c < 0 ? "down" : "flat";
  const arw = c == null ? "" : c > 0 ? "▲" : c < 0 ? "▼" : "·";
  // Holdings link out to the ticker's quote page; summary rows (no href) stay divs.
  const tag = href ? "a" : "div";
  const attrs = href ? ` href="${esc(href)}" target="_blank" rel="noopener noreferrer"` : "";
  return `<${tag} class="na-mrow${href ? " na-mrow-lnk" : ""}"${attrs}><span class="na-l">${esc(label)}${dot || ""}</span>`
    + `<span class="na-v">${valueStr}</span>`
    + `<span class="na-c ${dir}">${c == null ? "" : arw + " " + Math.abs(c).toFixed(2) + "%"}</span></${tag}>`;
}
function portfolioPane(d) {
  const q = {}; (d.portfolio || []).forEach((x) => { q[x.label] = x; });
  // Value each holding (some LSE lines quote unscaled → pxScale brings them to £).
  const rows = PORTFOLIO.map((h) => {
    const m = q[h.ticker];
    const px = m && m.value != null ? m.value * (h.pxScale || 1) : null;
    const val = px != null ? px * h.qty : null;
    const costBasis = h.cost * h.qty;
    const pnlPct = val != null && costBasis ? ((val - costBasis) / costBasis) * 100 : null;
    const day = (m && m.change != null) ? m.change * (h.pxScale || 1) * h.qty : 0;
    const dPct = m && typeof m.changePct === "number" && isFinite(m.changePct) ? m.changePct : null;
    return { h, m, val, costBasis, pnlPct, day, dPct };
  });
  let tVal = 0, tCost = 0, tDay = 0, priced = 0;
  for (const r of rows) { if (r.val != null) { tVal += r.val; tCost += r.costBasis; tDay += r.day; priced++; } }
  const tPnl = tVal - tCost;
  const tPnlPct = tCost ? (tPnl / tCost) * 100 : null;
  const priorVal = tVal - tDay;
  const tDayPct = priorVal ? (tDay / priorVal) * 100 : null;
  // Match the desktop left-rail portfolio: Total Value → holdings → single P&L,
  // every figure following the Daily/Total toggle (Total = each ticker's market
  // value, Daily = its daily £ change; the P&L row likewise).
  const daily = _pfMode === "daily";
  const sorted = rows.slice().sort((a, b) => (b.val == null ? -1 : b.val) - (a.val == null ? -1 : a.val));
  const tgl = `<span class="na-pf-tgl-wrap" role="tablist">`
    + `<button type="button" class="na-pf-tgl${daily ? " on" : ""}" data-m="daily">Daily</button>`
    + `<button type="button" class="na-pf-tgl${daily ? "" : " on"}" data-m="total">Total</button></span>`;
  return `<div class="na-sec"><span>Portfolio</span>${tgl}</div>`
    + pfMrow("Total Value", priced ? fmtGBP(tVal) : "—", priced ? (daily ? tDayPct : tPnlPct) : null)
    + sorted.map((r) => {
      const val = r.val == null ? "—" : daily ? fmtGBP(r.day, true) : fmtGBP(r.val);
      return pfMrow(r.h.label || r.h.ticker, val, daily ? r.dPct : r.pnlPct, sessDot(r.m && r.m.marketState, r.h.exch), r.h.href);
    }).join("")
    + pfMrow("P&L", priced ? (daily ? fmtGBP(tDay, true) : fmtGBP(tPnl, true)) : "—", daily ? tDayPct : tPnlPct);
}

// ---- Saved rows — shared news-feed row (headline, then code · date · source) --
const NF_CODE = { m: "MAC", c: "CRD", l: "LEX", n: "LTR", f: "FT", s: "SUBS", b: "BREW", news: "NEWS", bbg: "BBG", econ: "ECON", comm: "COMM", deal: "DEAL", fund: "FUND", clo: "CLO", alert: "ALERT", case: "CASE", scheme: "SCHEME", rp: "RP" };
function savedRow(x) {
  // Every saved story gets a desk code — general wire items (desk "news"/bbg/econ
  // /substack/…) used to fall through the old m/c/l/n/f-only map and show blank.
  const code = NF_CODE[x.desk] || "NEWS";
  const cls = DESK_CLASS[x.desk] || "news";
  return `<a class="nf-row" href="${esc(x.href)}"${x.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>`
    + `<span class="nf-title">${esc(x.title)}</span>`
    + `<span class="nf-meta"><span class="nf-code ${cls}">${esc(code)}</span>`
    + (x.date ? `<span class="nf-time">${esc(fmtDate(x.date))}</span>` : "")
    + (x.src ? `<span class="nf-sep">·</span><span class="nf-src">${esc(x.src)}</span>` : "")
    + `</span></a>`;
}
// Bookmarks panel: Saved | Watchlist chip tabs over one list. Watchlist is
// managers + law firms only (the follow store the Credit stars write; firms
// come from the Home row menu).
let _svTab = "saved";
async function loadSaved(body, headCount) {
  body.innerHTML = `<div class="na-chips">`
    + `<button type="button" class="na-chip" data-k="saved">Saved</button>`
    + `<button type="button" class="na-chip" data-k="watch">Watchlist</button>`
    + `</div><div class="na-tabbody"><div class="na-load">Loading…</div></div>`;
  const chips = body.querySelector(".na-chips");
  const tb = body.querySelector(".na-tabbody");
  const render = async () => {
    chips.querySelectorAll(".na-chip").forEach((c) => c.classList.toggle("is-on", c.dataset.k === _svTab));
    try {
      const mod = await import("/saved.js?v=20260724-1");
      // Watchlist tab = SAVED items that relate to a followed/starred profile
      // (the intersection), NOT all of a followed profile's news.
      const list = _svTab === "saved" ? mod.resolveSaved() : mod.resolveSavedWatchlist();
      if (headCount) headCount.textContent = list.length ? " · " + list.length : "";
      tb.innerHTML = list.length
        ? list.map(savedRow).join("")
        : (_svTab === "saved"
          ? '<div class="na-empty">Nothing saved yet. Tap the ☆ on any item — or press and hold a story on the Home wire — to keep it here.</div>'
          : '<div class="na-empty">Nothing here yet. This shows the items you’ve saved (☆) that belong to a manager or law firm you follow. Follow a profile (☆) and save one of its stories to see it here.</div>');
    } catch {
      tb.innerHTML = '<div class="na-load">Unavailable right now.</div>';
    }
  };
  chips.addEventListener("click", (e) => { const c = e.target.closest(".na-chip"); if (c && c.dataset.k !== _svTab) { _svTab = c.dataset.k; render(); } });
  render();
  // Pull the server's saved stores once per open and union them into the local
  // copies, so bookmarks made on another device show up here without visiting
  // each app first. Four stores: the three desk id-sets (macro/credit/legal ☆
  // stars) and the Home-wire snapshot store (press-and-hold saves on live
  // headlines / Letters / FT rows — the store resolveSaved folds in last).
  // Union-only, like the watchlist pull below: removals propagate via each
  // device's own PUT, which excludes what was removed there.
  const pulls = [
    ...[["/api/saved-macro", "meridian.macro.saved"], ["/api/saved-credit", "meridian.credit.saved"], ["/api/saved", "lexalert.saved"]]
      .map(([api, ls]) => fetch(api, { headers: { accept: "application/json" } })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          const server = (d && d.saved) || [];
          if (!server.length) return false;
          let local = [];
          try { const a = JSON.parse(localStorage.getItem(ls) || "[]"); if (Array.isArray(a)) local = a; } catch { /* */ }
          const set = new Set(local);
          const before = set.size;
          server.forEach((id) => { if (typeof id === "string") set.add(id); });
          if (set.size === before) return false;
          try { localStorage.setItem(ls, JSON.stringify([...set])); } catch { /* */ }
          return true;
        })
        .catch(() => false)),
    fetch("/api/saved-home", { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const server = (d && d.saved) || [];
        if (!server.length) return false;
        let local = [];
        try { const a = JSON.parse(localStorage.getItem("wire.home.saved") || "[]"); if (Array.isArray(a)) local = a; } catch { /* */ }
        const have = new Set(local.map((o) => o && o.k));
        let grew = false;
        server.forEach((o) => { if (o && o.k && !have.has(o.k)) { local.push(o); have.add(o.k); grew = true; } });
        if (grew) { try { localStorage.setItem("wire.home.saved", JSON.stringify(local.slice(0, 500))); } catch { /* */ } }
        return grew;
      })
      .catch(() => false),
  ];
  Promise.all(pulls).then((grew) => { if (grew.some(Boolean)) render(); });
  // Pull the server's follow list once per open and union it into the local
  // store, so follows made on another device (or in the Credit app) show up
  // here without a Credit visit first. Re-render if anything new arrived.
  fetch("/api/watchlist", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const server = (d && d.watchlist) || {};
      let local = {};
      try { local = JSON.parse(localStorage.getItem("meridian.follows") || "{}") || {}; } catch { /* */ }
      let grew = false;
      ["manager", "fund", "lp", "firm"].forEach((t) => {
        const set = new Set(Array.isArray(local[t]) ? local[t] : []);
        const before = set.size;
        (Array.isArray(server[t]) ? server[t] : []).forEach((x) => set.add(x));
        if (set.size !== before) grew = true;
        local[t] = [...set];
      });
      if (grew) {
        try { localStorage.setItem("meridian.follows", JSON.stringify(local)); } catch { /* */ }
        render();
      }
    })
    .catch(() => {});
}

// ---- Notifications — cross-desk, tagged by desk (MAC / CRD / LEX) -----------
const ICO_BELL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
const ICO_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></svg>';
const ICO_MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
// "System" = follow the OS. A small monitor glyph reads as "adapts to system".
const ICO_AUTO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 4v13" stroke-width="1.6"/><path d="M8 21h8M12 17v4"/></svg>';
// Two-option theme control (System | Other) over a REMEMBERED preference stored
// in data-theme-choice (+ localStorage): "system" follows the OS live, while
// "light"/"dark" are concrete, remembered choices that persist across OS changes
// and reloads — so "Other" sticks to the exact theme you picked. When switching
// INTO Other we pick the opposite of the current OS theme (a guaranteed switch),
// then remember that concrete value.
const osDark = () => !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
// The stored preference: "system" | "light" | "dark".
const storedPref = () => { const c = document.documentElement.getAttribute("data-theme-choice"); return (c === "light" || c === "dark") ? c : "system"; };
// UI mode for the two-option control.
const themeChoice = () => (storedPref() === "system" ? "system" : "other");
// Resolve a preference to a concrete theme: system = OS setting, else itself.
const resolveTheme = (pref) => (pref === "system" ? (osDark() ? "dark" : "light") : pref);
// The concrete theme "Other" should switch to: keep a remembered manual choice,
// else the opposite of the current OS theme.
const otherPref = () => { const p = storedPref(); return p === "system" ? (osDark() ? "light" : "dark") : p; };
// Button reflects the CURRENT state: the monitor glyph while following the
// system, otherwise the sun/moon of whatever theme is showing.
const themeIcon = () => (themeChoice() === "system" ? ICO_AUTO : (document.documentElement.getAttribute("data-theme") === "dark" ? ICO_MOON : ICO_SUN));
const THEME_TITLE = { system: "Theme: System — tap to override", other: "Theme: Manual — tap to follow system" };
// Phone /menu/ "Appearance" pill — TWO options only, System ↔ Other (same model
// as the nav-bar button), styled like the Push-notifications row's chip.
const themePillIco = () => (themeChoice() === "system" ? ICO_AUTO : (document.documentElement.getAttribute("data-theme") === "dark" ? ICO_MOON : ICO_SUN));
const themePillInner = () => `${themePillIco()}<span class="na-push-state">${themeChoice() === "system" ? "System" : "Other"}</span>`;
// Set by initNavActions so the /menu/ segmented control can drive the same
// apply logic as the nav-bar button.
let _applyThemeChoice = null;
// Two desks only: the bell is limited to Credit + Legal deal-flow (saved.js
// buildNotifs) — macro items no longer appear, so no macro seen-state to sync.
const NOTIF_KEYS = { c: "meridian.credit.notifSeen", l: "meridian.legal.notifSeen" };
const NOTIF_API = { c: "/api/notif-credit", l: "/api/notif-legal" };
function readSeen(desk) { try { const p = JSON.parse(localStorage.getItem(NOTIF_KEYS[desk]) || "null"); return Array.isArray(p) ? new Set(p) : null; } catch { return null; } }
function notifRow(x, fresh) {
  const cls = DESK_CLASS[x.desk] || "";
  const code = NF_CODE[x.desk] || "";
  return `<a class="nf-row${fresh ? " nf-new" : ""}" href="${esc(x.href)}"${x.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>`
    + `<span class="nf-title">${esc(x.title)}</span>`
    + `<span class="nf-meta"><span class="nf-code ${cls}">${esc(code)}</span>`
    + (x.date ? `<span class="nf-time">${esc(fmtDate(x.date))}</span>` : "")
    + (x.source ? `<span class="nf-sep">·</span><span class="nf-src">${esc(x.src || x.source)}</span>` : "")
    + `</span></a>`;
}
let _notifItems = null;
// Active notifications tab: "all" | "watch" (mirrors the Bookmarks panel).
let _ntTab = "all";
// Active /menu/ page tab: "search" | "notifs" | "display".
let _menuTab = "search";
async function ensureNotifs() {
  if (_notifItems) return _notifItems;
  const { buildNotifs } = await import("/saved.js?v=20260724-1");
  _notifItems = (await buildNotifs()).slice(0, 60);
  return _notifItems;
}
function countUnread(items) {
  const seen = { c: readSeen("c"), l: readSeen("l") };
  return items.filter((x) => { const s = seen[x.desk]; return s ? !s.has(x.id) : false; }).length;
}
// First time we see a desk's notifications we treat the current set as the
// baseline (all "seen") so the historical back-catalogue doesn't show as unread.
function establishBaseline(items) {
  ["c", "l"].forEach((desk) => {
    if (readSeen(desk) === null) {
      const ids = items.filter((x) => x.desk === desk).map((x) => x.id);
      try { localStorage.setItem(NOTIF_KEYS[desk], JSON.stringify(ids)); } catch { /* */ }
    }
  });
}
function markNotifSeen(items) {
  ["c", "l"].forEach((desk) => {
    const ids = items.filter((x) => x.desk === desk).map((x) => x.id);
    let prev = []; try { const p = JSON.parse(localStorage.getItem(NOTIF_KEYS[desk]) || "[]"); prev = Array.isArray(p) ? p : []; } catch { /* */ }
    const merged = [...new Set([...prev, ...ids])];
    try { localStorage.setItem(NOTIF_KEYS[desk], JSON.stringify(merged)); } catch { /* */ }
    fetch(NOTIF_API[desk], { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ seen: merged }) }).catch(() => {});
  });
}

// ---- shared full-screen shell (mobile) --------------------------------------
function setTopVar() {
  const t = document.querySelector(".topbar") || document.querySelector(".g-top");
  const h = t ? Math.round(t.getBoundingClientRect().bottom) : 54;
  document.documentElement.style.setProperty("--na-top-b", h + "px");
}
let _scrim = null;
function scrimOn(onClose) {
  if (!isPhone()) return;
  if (!_scrim) {
    _scrim = document.createElement("div");
    _scrim.className = "na-scrim";
    _scrim.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); if (_scrim._cb) _scrim._cb(); });
    document.body.appendChild(_scrim);
  }
  _scrim._cb = onClose;
  _scrim.hidden = false;
}
function scrimOff() { if (_scrim) { _scrim.hidden = true; _scrim._cb = null; } }
// iOS-safe scroll lock: overflow:hidden alone loses the scroll position on
// iOS Safari (the page "jumps" when a panel closes). Freeze the body with
// position:fixed at the captured offset and restore it exactly on unlock.
let _lockY = 0;
function lockBody(on) {
  const b = document.body;
  const locked = b.classList.contains("na-menu-open");
  if (on && !locked) {
    _lockY = window.scrollY || document.documentElement.scrollTop || 0;
    b.classList.add("na-menu-open");
    b.style.position = "fixed"; b.style.top = (-_lockY) + "px";
    b.style.left = "0"; b.style.right = "0"; b.style.width = "100%";
  } else if (!on && locked) {
    b.classList.remove("na-menu-open");
    b.style.position = ""; b.style.top = ""; b.style.left = ""; b.style.right = ""; b.style.width = "";
    window.scrollTo(0, _lockY);
  }
}

export function initNavActions() {
  const run = () => {
    // Idempotence guard FIRST: initNavActions can be invoked more than once, so
    // a second pass must be a no-op (the buttons are already mounted).
    if (document.getElementById("na-mkt")) return; // already mounted
    // v2: the runtime owns the tab bar and the header layout (a sticky top bar),
    // so nav-actions' own tab-bar / header-layout builder is omitted from this
    // port — only the header buttons + panels below are used.
    navDiag();
    const notif = document.getElementById("notif");
    // Apps mount into .topbar-right; Home (glance) mounts into .g-top .g-actions —
    // the SAME controller runs on all four pages.
    const bar = document.querySelector(".topbar-right") || document.querySelector(".g-top .g-actions");
    if (!notif && !bar) return;
    setTopVar();
    // Shared press-and-hold / right-click row options menu — every page.
    import("/rowmenu.js?v=20260721-1").then((m) => m.initRowMenu()).catch(() => {});
    // Swipe left/right on a chip-filtered pane to move between its chips.
    /* v2: swipe-tabs disabled — the runtime owns navigation. */
    addEventListener("resize", setTopVar);
    addEventListener("orientationchange", () => setTimeout(setTopVar, 200));

    // nav-actions owns all THREE buttons and panels so switching between them is
    // driven by one controller (no split ownership / observer races). The app's
    // own #notif bell is hidden — its background seen-state syncing still runs and
    // seeds localStorage, which our cross-desk badge reads.
    if (notif) notif.style.display = "none";
    // Home's legacy per-page menu mounts (markets / saved / bell) — retired in
    // favour of this shared controller.
    ["g-mkt", "g-saved"].forEach((lid) => { const el = document.getElementById(lid); if (el) el.style.display = "none"; });
    const wrap = document.createElement("div");
    wrap.className = "na-actions";
    wrap.innerHTML =
      // Thin donut countdown: drains over the 5-minute live-feed window, refills
      // on each refresh (Home dispatches wire:live-refresh; elsewhere it cycles
      // on the wall clock, matching the edge cache cadence).
      // Order (left→right): countdown ring · Markets · Bookmarks · Notifications ·
      // Search. Search sits LAST on phones; the desktop theme button takes the
      // trailing slot (search there is the topbar pill, not this cluster).
      `<span class="na-ring" title="Time to next live-feed refresh" aria-hidden="true"><svg viewBox="0 0 18 18"><circle class="na-ring-track" cx="9" cy="9" r="7"/><circle class="na-ring-arc" cx="9" cy="9" r="7"/></svg></span>` +
      `<button type="button" class="na-btn" id="na-mkt" aria-label="Markets & key rates" aria-haspopup="true" aria-expanded="false" title="Markets & key rates">${ICO_MKT}</button>` +
      `<button type="button" class="na-btn" id="na-saved" aria-label="Saved" aria-haspopup="true" aria-expanded="false" title="Saved">${ICO_SAVED}</button>` +
      `<button type="button" class="na-btn na-bell" id="na-notif" aria-label="Notifications" aria-haspopup="true" aria-expanded="false" title="Notifications">${ICO_BELL}<span class="na-badge" hidden></span></button>` +
      // Search — a magnifying-glass button on phones (the desktop search pill is
      // hidden there); opens the command palette via the shared [data-open-search].
      (isPhone() ? `<button type="button" class="na-btn" id="na-search" data-open-search aria-label="Search" title="Search">${ICO_MAG}</button>` : "") +
      // Theme toggle lives in the nav bar on desktop; on phones it moves into the
      // /menu/ page (see fillMenu) so the nav bar stays uncluttered.
      (isPhone() ? "" : `<button type="button" class="na-btn" id="na-theme" aria-label="Switch theme" title="${THEME_TITLE[themeChoice()] || "Switch theme"}">${themeIcon()}</button>`);
    if (notif && notif.parentElement) {
      notif.parentElement.insertBefore(wrap, notif);
    } else if (bar) {
      bar.appendChild(wrap);
    }

    // Theme toggle — two options over a remembered preference: "system" (follow
    // the OS) or a concrete "light"/"dark" ("Other"). The pref is stored in
    // localStorage (m_theme_pref) so the inline head script applies it before
    // paint on the next load. A concrete choice is remembered as-is and does NOT
    // drift with the OS. Shared across all pages (nav-bar button on desktop;
    // /menu/ segmented control on phones) via this controller.
    const themeBtn = wrap.querySelector("#na-theme");
    const applyThemeChoice = (pref) => {
      const r = document.documentElement;
      const t = resolveTheme(pref);
      r.setAttribute("data-theme", t);
      r.setAttribute("data-theme-choice", pref);
      try { localStorage.setItem("m_theme_pref", pref); } catch { /* */ }
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", t === "dark" ? "#05080f" : "#ffffff");
      if (themeBtn) { themeBtn.innerHTML = themeIcon(); themeBtn.setAttribute("title", THEME_TITLE[themeChoice()] || "Switch theme"); }
      // Keep the phone /menu/ theme chip in sync with the new state.
      const pill = document.getElementById("na-theme-pill");
      if (pill) pill.innerHTML = themePillInner();
    };
    _applyThemeChoice = applyThemeChoice;   // expose for the /menu/ segmented control
    if (themeBtn) themeBtn.addEventListener("click", () => {
      // System → Other (opposite of OS, then remembered); Other → System.
      applyThemeChoice(themeChoice() === "system" ? otherPref() : "system");
    });
    // Only re-apply on OS light/dark change when following the system; a
    // concrete choice is remembered and must not drift.
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onOS = () => { if (storedPref() === "system") applyThemeChoice("system"); };
      if (mq.addEventListener) mq.addEventListener("change", onOS);
      else if (mq.addListener) mq.addListener(onOS);
    }

    // Refresh-countdown ring. stroke-dashoffset walks 0 → circumference across
    // the 5-minute window (full ring draining to empty), then wraps. The phase
    // is anchored to the last live-feed payload's assembly time (asOf, written
    // to localStorage by Home) — NOT to page load — so the ring reads the same
    // on every page and survives navigation/reload. Before any anchor exists,
    // phase is computed against the epoch, which every page also agrees on.
    {
      const RING_MS = 5 * 60 * 1000;
      const RING_C = 2 * Math.PI * 7;
      const arc = wrap.querySelector(".na-ring-arc");
      const ringAnchor = () => { try { return +localStorage.getItem("wire.live.anchor") || 0; } catch { return 0; } };
      const ringEl = wrap.querySelector(".na-ring");
      const tickRing = () => {
        if (!arc) return;
        const a = ringAnchor();
        const p = ((((Date.now() - a) % RING_MS) + RING_MS) % RING_MS) / RING_MS;
        arc.style.strokeDashoffset = (RING_C * p).toFixed(2);
        // No successful feed fetch for >20 min → dim the ring instead of
        // pretending the cycle is alive (session expiry, offline, …).
        if (ringEl) ringEl.classList.toggle("na-ring-stale", !!a && Date.now() - a > 20 * 60 * 1000);
      };
      window.addEventListener("wire:live-refresh", tickRing);
      window.addEventListener("storage", (e) => { if (!e.key || e.key === "wire.live.anchor") tickRing(); });
      document.addEventListener("visibilitychange", () => { if (!document.hidden) tickRing(); });
      setInterval(tickRing, 2000);
      tickRing();
    }

    // Full-screen (mobile) / dropdown (desktop) overlays, lifted to <body> so the
    // sticky top bar's stacking context can't demote them behind other layers.
    const mkPanel = (id, title) => {
      const p = document.createElement("div");
      p.className = "na-panel";
      p.id = id;
      p.hidden = true;
      // No explicit close control — tapping the button again (or another button,
      // or outside / Escape) closes it; this keeps every menu consistent.
      p.innerHTML = `<div class="na-head"><span class="na-h-t">${esc(title)}<span class="na-h-n"></span></span></div>`
        + `<div class="na-body"></div>`;
      document.body.appendChild(p);
      return p;
    };
    const mktPanel = mkPanel("na-mkt-panel", "Markets");
    const savedPanel = mkPanel("na-saved-panel", "Bookmarks");
    const notifPanel = mkPanel("na-notif-panel", "Notifications");
    const menuPanel = ON_MENU_PAGE ? mkPanel("na-menu-panel", "Menu") : null;

    // Menu (bottom tab bar, phones): the search bar plus the account block
    // (Signed in as … · Sign out / Last refresh …) that used to sit in the page
    // footer. Content is re-read on every open so it reflects the live sign-in
    // state; the search row carries data-open-search, so the page's existing
    // search overlay opens over the menu unchanged.
    const ICO_SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.6" y1="15.6" x2="21" y2="21"/></svg>';
    const fillMenu = (p) => {
      const acct = document.getElementById("account-nav") || document.querySelector(".g-user");
      const stat = document.getElementById("data-status") || document.querySelector(".g-refresh");
      // Only show the account row once a verified email is present (Home's copy
      // omits the "Signed in as" prefix — add it so the row reads the same on
      // every page).
      let acctHtml = "";
      if (acct && acct.innerHTML.trim()) {
        const email = acct.querySelector("strong");
        const signed = /signed in/i.test(acct.textContent);
        if (signed || (email && email.textContent.trim())) {
          acctHtml = `<div class="na-menu-row na-menu-acct">${signed ? "" : "<span>Signed in as&nbsp;</span>"}${acct.innerHTML}</div>`;
        }
      }
      // Footer (account · refresh/build · push toggle) — shown under every tab.
      const foot = `<div class="na-menu-foot"><div class="na-menu-foot-l">`
        + acctHtml
        // One compact line: refresh date/time (prefix + year dropped) · build.
        // The sw/no-sw suffix answers "is the app-shell cache actually serving
        // this device?" at a glance.
        + (() => {
          const t = stat ? stat.textContent.trim().replace(/^Last refresh\s*/i, "").replace(/\s+\d{4}\b/, "") : "";
          const sw = "serviceWorker" in navigator && navigator.serviceWorker.controller ? "sw" : "no-sw";
          return `<div class="na-menu-row na-menu-stat">${t ? esc(t) + " · " : ""}Build ${esc(BUILD_TOKEN)} · ${sw}</div>`;
        })()
        + `</div></div>`;

      // Active pane — chosen by the menu bar chips (Search · Notifications · Display).
      let pane;
      if (_menuTab === "notifs") {
        // Just the push on/off toggle — NOT the notifications themselves.
        pane = `<div class="na-menu-recent-h">Notifications</div>`
          + `<div class="na-menu-row na-menu-pushrow"><span>Push notifications</span><button type="button" class="na-menu-push" id="na-push" title="Push notifications">${ICO_BELL}<span class="na-push-state">…</span></button></div>`;
      } else if (_menuTab === "display") {
        // Theme — a single labelled row with a chip on the right, mirroring the
        // Push-notifications row. The chip shows the current mode and cycles
        // System → Light → Dark on tap.
        pane = `<div class="na-menu-recent-h">Appearance</div>`
          + `<div class="na-menu-row na-menu-pushrow"><span>Theme</span>`
            + `<button type="button" class="na-menu-push na-theme-pill" id="na-theme-pill" aria-label="Theme — tap to change" title="Tap to change theme">${themePillInner()}</button>`
          + `</div>`;
      } else {
        // Search — the search launcher + recent searches (shared localStorage key).
        let recents = [];
        try { const a = JSON.parse(localStorage.getItem("wire.recentSearches") || "[]"); if (Array.isArray(a)) recents = a.filter((q) => typeof q === "string").slice(0, 8); } catch { /* */ }
        pane = `<button type="button" class="na-menu-row na-menu-search" data-open-search>${ICO_SEARCH}<span>Search everything…</span></button>`
          + (recents.length
            ? `<div class="na-menu-recent-h">Recent searches</div>`
              + recents.map((q) => `<button type="button" class="na-menu-row na-recent-row" data-q="${esc(q)}">${ICO_SEARCH}<span>${esc(q)}</span></button>`).join("")
            : "");
      }
      p.querySelector(".na-body").innerHTML = pane + foot;

      if (_menuTab === "display") {
        // Theme chip → cycle System → Light → Dark (persisted; the head script
        // applies it before paint on the next load).
        const pill = p.querySelector("#na-theme-pill");
        if (pill) pill.addEventListener("click", () => {
          if (!_applyThemeChoice) return;
          _applyThemeChoice(themeChoice() === "system" ? otherPref() : "system");
        });
      }
      wirePushRow(p);
    };

    // --- Push notifications (iOS 16.4+ Home-Screen web app / desktop) --------
    const pushB64ToU8 = (s) => {
      s = s.replace(/-/g, "+").replace(/_/g, "/");
      const pad = s.length % 4 ? "====".slice(s.length % 4) : "";
      const bin = atob(s + pad);
      const u = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
      return u;
    };
    const pushSupported = () => "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    const isStandalone = () => (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
    const pushState = async () => {
      if (!pushSupported()) {
        return /iphone|ipad|ipod/i.test(navigator.userAgent) && !isStandalone() ? "install" : "unsupported";
      }
      if (Notification.permission === "denied") return "denied";
      try {
        const reg = await navigator.serviceWorker.getRegistration("/");
        const sub = reg && (await reg.pushManager.getSubscription());
        return sub ? "on" : "off";
      } catch { return "off"; }
    };
    const pushEnable = async () => {
      const reg = await navigator.serviceWorker.register("/sw.js");
      if (await Notification.requestPermission() !== "granted") return "denied";
      const { publicKey } = await (await fetch("/api/push/vapid", { headers: { accept: "application/json" } })).json();
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: pushB64ToU8(publicKey) });
      await fetch("/api/push/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(sub.toJSON()) });
      return "on";
    };
    const pushDisable = async () => {
      const reg = await navigator.serviceWorker.getRegistration("/");
      const sub = reg && (await reg.pushManager.getSubscription());
      if (sub) {
        fetch("/api/push/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ unsubscribe: true, endpoint: sub.endpoint }) }).catch(() => {});
        await sub.unsubscribe();
      }
      return "off";
    };
    const PUSH_LABEL = { on: "On", off: "Enable", denied: "Blocked", install: "Add to Home Screen", unsupported: "N/A" };
    const wirePushRow = (p) => {
      const row = p.querySelector("#na-push");
      if (!row) return;
      const stateEl = row.querySelector(".na-push-state");
      const paint = (st) => { stateEl.textContent = PUSH_LABEL[st] || st; row.dataset.st = st; };
      pushState().then(paint);
      row.addEventListener("click", async () => {
        const st = row.dataset.st;
        if (st !== "on" && st !== "off") return;
        stateEl.textContent = "…";
        try { paint(st === "off" ? await pushEnable() : await pushDisable()); }
        catch { paint(await pushState()); }
      });
    };
    // Register/refresh the service worker on every visit — it carries Web Push
    // AND the app-shell cache that makes page switches paint instantly.
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    // Tidy the Access re-auth marker (?__net=1 forces the navigation past the
    // app-shell cache so Access can round-trip through login).
    if (/(^|[?&])__net=/.test(location.search)) {
      try { history.replaceState(null, "", location.pathname); } catch { /* */ }
    }
    // Tapping a recent search re-opens the page's search overlay seeded with it.
    if (menuPanel) {
      menuPanel.addEventListener("click", (e) => {
        const r = e.target.closest(".na-recent-row");
        if (r) document.dispatchEvent(new CustomEvent("wire:search", { detail: { q: r.dataset.q || "" } }));
      });
      // /menu/ = the panel permanently open: no scrim, no body lock, no close
      // paths — leaving happens through the tab bar like any other page.
      menuPanel.classList.add("na-menu-static");
      // The panel head is the same segmented chip strip the other pages pin
      // under the header — one chip for now (Search); tapping it opens search.
      const mh = menuPanel.querySelector(".na-head");
      const menuChip = (k, label) => `<button type="button" class="tchip${_menuTab === k ? " is-on" : ""}" data-menutab="${k}">${label}</button>`;
      if (mh) mh.outerHTML = `<div class="na-menu-bar"><div class="tchips">${menuChip("search", "Search")}${menuChip("notifs", "Notifications")}${menuChip("display", "Display")}</div></div>`;
      const menuBar = menuPanel.querySelector(".na-menu-bar");
      if (menuBar) menuBar.addEventListener("click", (e) => {
        const c = e.target.closest(".tchip[data-menutab]");
        if (!c || c.dataset.menutab === _menuTab) return;
        _menuTab = c.dataset.menutab;
        menuBar.querySelectorAll(".tchip").forEach((x) => x.classList.toggle("is-on", x.dataset.menutab === _menuTab));
        fillMenu(menuPanel);
      });
      fillMenu(menuPanel);
      menuPanel.hidden = false;
      const acct = document.getElementById("account-nav");
      const stat = document.getElementById("data-status");
      const jobs = [];
      if (acct) jobs.push(fetch("/api/me", { headers: { accept: "application/json" } }).then((r) => (r.ok ? r.json() : null)).then((d) => {
        if (d && d.email) { acct.innerHTML = `<span class="si-prefix">Signed in as </span><strong>${esc(d.email)}</strong> · <a href="/cdn-cgi/access/logout">Sign out</a>`; acct.hidden = false; }
      }).catch(() => {}));
      if (stat) jobs.push(import("/credit/js/data.js?v=20260718-9").then((m) => {
        stat.textContent = `Last refresh ${fmtDate(m.LAST_CHECKED)}${m.LAST_CHECKED_TIME ? `, ${m.LAST_CHECKED_TIME}` : ""}`;
      }).catch(() => {}));
      if (jobs.length) Promise.allSettled(jobs).then(() => fillMenu(menuPanel));
    }

    const notifBtn = wrap.querySelector("#na-notif");
    const clearBadge = () => { const b = notifBtn.querySelector(".na-badge"); if (b) b.hidden = true; };
    // Show ONLY what's genuinely new since last opened (matching the badge). When
    // caught up, a short note + the few most recent as muted context — so the
    // panel never dumps the whole 60-item back-catalogue as if it were all new.
    // Two tabs (mirrors the Bookmarks panel): All = every notification (fresh
    // updates, else a caught-up note + recent context); Watchlist = only the
    // followed managers'/firms' news (same source the Bookmarks Watchlist tab
    // uses). Each open re-defaults to All so the "new updates" get marked seen.
    const renderNotif = (body) => {
      const items = _notifItems || [];
      _ntTab = "all";
      body.innerHTML = `<div class="na-chips">`
        + `<button type="button" class="na-chip" data-k="all">All</button>`
        + `<button type="button" class="na-chip" data-k="watch">Watchlist</button>`
        + `</div><div class="na-tabbody"></div>`;
      const chips = body.querySelector(".na-chips");
      const tb = body.querySelector(".na-tabbody");
      const paint = async () => {
        chips.querySelectorAll(".na-chip").forEach((c) => c.classList.toggle("is-on", c.dataset.k === _ntTab));
        if (_ntTab === "all") {
          // Always list the notifications, the same on every open — reopening
          // must NOT empty the list (the old behaviour hid everything once
          // "seen", which read as the notifications vanishing). But the ones that
          // are genuinely NEW since last open (what the bell badge counts) get an
          // accent marker, captured BEFORE we mark them seen — so the badge and
          // the panel agree on what's new. Opening still clears the badge; on the
          // next open nothing is marked new, but the whole list stays visible.
          const seen = { c: readSeen("c"), l: readSeen("l") };
          const isFresh = (x) => { const s = seen[x.desk]; return s ? !s.has(x.id) : false; };
          tb.innerHTML = items.length ? items.map((x) => notifRow(x, isFresh(x))).join("") : '<div class="na-empty">Nothing yet.</div>';
          markNotifSeen(items); clearBadge();
        } else {
          tb.innerHTML = '<div class="na-load">Loading…</div>';
          try {
            const mod = await import("/saved.js?v=20260724-1");
            const list = mod.resolveWatchlistNews();
            tb.innerHTML = list.length
              ? list.map(savedRow).join("")
              : '<div class="na-empty">No watchlist updates yet. Press and hold a manager or law-firm story (or tap the ☆ on a manager in Credit) to follow it — their updates appear here.</div>';
          } catch { tb.innerHTML = '<div class="na-load">Unavailable right now.</div>'; }
        }
      };
      chips.addEventListener("click", (e) => { const c = e.target.closest(".na-chip"); if (c && c.dataset.k !== _ntTab) { _ntTab = c.dataset.k; paint(); } });
      paint();
    };

    const panels = [
      { btn: wrap.querySelector("#na-mkt"), panel: mktPanel, onOpen: (p) => { if (!_mktLoaded) { _mktLoaded = true; loadMarkets(p.querySelector(".na-body")); } } },
      { btn: wrap.querySelector("#na-saved"), panel: savedPanel, onOpen: (p) => { loadSaved(p.querySelector(".na-body"), p.querySelector(".na-h-n")); } },
      { btn: notifBtn, panel: notifPanel, onOpen: (p) => { const body = p.querySelector(".na-body"); if (_notifItems) renderNotif(body); else { body.innerHTML = '<div class="na-load">Loading…</div>'; ensureNotifs().then(() => renderNotif(body)).catch(() => { body.innerHTML = '<div class="na-load">Notifications unavailable right now.</div>'; }); } } },
    ];

    const anyOpen = () => panels.some((x) => !x.panel.hidden);
    let _openAt = 0;
    const closeAll = () => {
      panels.forEach((x) => { x.panel.hidden = true; x.btn.setAttribute("aria-expanded", "false"); });
      lockBody(false); scrimOff();
    };
    const openPanel = (rec) => {
      _openAt = Date.now();
      // Re-measure the top bar's bottom NOW (its height settles after the safe-
      // area/notch layout, which an init-time measurement can miss) so the full-
      // screen panel opens flush BELOW it instead of sliding up under it.
      if (isPhone()) setTopVar();
      panels.forEach((x) => { if (x !== rec) { x.panel.hidden = true; x.btn.setAttribute("aria-expanded", "false"); } });
      rec.panel.hidden = false;
      rec.btn.setAttribute("aria-expanded", "true");
      rec.onOpen(rec.panel);
      if (!isPhone()) { const r = rec.btn.getBoundingClientRect(); rec.panel.style.top = `${Math.round(r.bottom + 8)}px`; }
      lockBody(isPhone());
      scrimOn(closeAll);
    };

    panels.forEach((rec) => {
      rec.btn.addEventListener("click", (e) => {
        e.stopPropagation(); e.preventDefault();
        if (rec.panel.hidden) openPanel(rec); else closeAll();
      });
      rec.panel.addEventListener("click", (e) => { if (e.target.closest("[data-na-close]")) closeAll(); });
    });

    // ---- Bottom tab bar input ----------------------------------------------
    // A tap is confirmed with pointer events: down and up on the SAME button
    // with minimal movement. Page buttons navigate via location.replace — the
    // app keeps no cross-page history, so iOS's edge back/forward swipes (the
    // Menu button borders the right screen edge, where a tap with a tiny drag
    // can fire a SYSTEM history navigation no page code sees) have nowhere to
    // go. Raw clicks inside the bar are inert; keyboard activation (click
    // detail 0) still acts. A tap on the already-active tab is a no-op.
    {
      const tabbar = null;   // v2: the runtime handles tab navigation; do not wire nav-actions to its bar
      const act = (btn) => {
        const dest = btn.getAttribute("data-nav");
        if (!dest) return;
        if (btn.classList.contains("is-active")) {
          // Tapping the tab for the page you're already ON was a silent no-op —
          // which read as "the button is broken" whenever a full-screen overlay
          // (Markets / Saved / Notifications panel, or the search palette; both
          // layered UNDER the always-on-top tab bar) was covering the page.
          // Dismiss any such overlay so the tap always returns you to the page.
          if (anyOpen()) closeAll();
          const pal = document.querySelector(".mcmdk.open");
          if (pal) { pal.classList.remove("open"); if (document.activeElement && pal.contains(document.activeElement)) document.activeElement.blur(); }
          return;
        }
        // Client-side same-document transition when available (app↔app): avoids
        // the full page load that flashes a white inter-document blank on iOS
        // (which has no cross-document view transitions). Returns false for Home
        // / off-scope / unsupported → fall through to a normal navigation.
        if (typeof window.__spaNavigate === "function" && window.__spaNavigate(dest)) return;
        location.replace(dest);
      };
      if (tabbar) {
        let pBtn = null, pX = 0, pY = 0;
        tabbar.addEventListener("pointerdown", (e) => { pBtn = e.target.closest(".mtab"); pX = e.clientX; pY = e.clientY; }, { passive: true });
        tabbar.addEventListener("pointerup", (e) => {
          const b = e.target.closest(".mtab");
          const ok = b && b === pBtn && Math.hypot(e.clientX - pX, e.clientY - pY) <= 14;
          pBtn = null;
          if (ok) act(b);
        });
        tabbar.addEventListener("click", (e) => {
          e.preventDefault(); e.stopPropagation();
          const b = e.target.closest(".mtab");
          if (b && e.detail === 0) act(b);           // keyboard only
        }, true);
        tabbar.addEventListener("touchend", (e) => { if (e.cancelable) e.preventDefault(); }, { passive: false });
      }
    }

    document.addEventListener("click", (e) => {
      if (!anyOpen()) return;
      if (e.target.closest(".na-panel") || e.target.closest(".na-actions")) return;
      // Immunity window: iOS can deliver the opening tap's synthetic click a
      // beat AFTER a panel opened; hit-tested against the new layout it can
      // land outside and close it instantly. That soon after opening it can
      // only be the ghost — ignore it.
      if (Date.now() - _openAt < 700) return;
      closeAll();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

    // Prime the cross-desk notifications + unread badge in the background.
    ensureNotifs().then((items) => {
      establishBaseline(items);
      const n = countUnread(items);
      const b = notifBtn.querySelector(".na-badge");
      if (b && n) { b.textContent = n > 9 ? "9+" : String(n); b.hidden = false; }
    }).catch(() => {});
  };
  // First-paint reveal: the HTML boot script holds the content area invisible
  // (html.wire-boot) so a page switch never paints the half-built state — the
  // apps render synchronously before this module executes, so once run() has
  // injected the chrome the page is COMPLETE and appears in a single frame.
  // finally + the boot script's own timeout guarantee the page can never stay
  // hidden.
  const runR = () => { try { run(); } finally { document.documentElement.classList.remove("wire-boot"); } };
  if (document.readyState !== "loading") runR(); else document.addEventListener("DOMContentLoaded", runR);
}
