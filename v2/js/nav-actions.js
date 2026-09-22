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
import { esc, MONTHS, setThemeColorMeta } from "/util.js?v=20260818-1";
import { mountAssistant } from "/v2/js/assistant.js?v=v2-22";
import { FX_KEYMOMENT, OUTLOOK } from "/macro/js/content.js";
import { nbNums } from "./nb-format.js?v=v2-2";
import { DESK_CLASS, DESK_CODE as NF_CODE } from "/feed.js?v=20260808-1";
const fmtNum = (v) => { v = +v; if (!isFinite(v)) return "—"; const a = Math.abs(v); if (a >= 1000) return v.toLocaleString(undefined, { maximumFractionDigits: a >= 10000 ? 0 : 1 }); if (a >= 100) return v.toFixed(1); if (a >= 1) return v.toFixed(2); return v.toFixed(4); };
// OAS/bp series carry `value` in PERCENT (0.77 → 77 bp), matching the desktop's
// fmtRate and rateRow's own change scaling — so bp values are ×100, not raw.
const fmtRateVal = (v, unit) => { v = +v; if (!isFinite(v)) return "—"; if (unit === "bp") return Math.round(v * 100) + " bp"; return v.toFixed(2) + "%"; };
function fmtDate(d) { if (!d) return ""; const s = /^\d{4}-\d{2}$/.test(d) ? d + "-01" : String(d).slice(0, 10); const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s); if (!m) return String(d); return `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}`; }

const ICO_MKT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/></svg>';
const ICO_ASK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6a8.5 8.5 0 0 1-.9-3.9A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></svg>';
const ICO_SAVED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';

const isPhone = () => matchMedia("(max-width:760px)").matches;

// ---- Diagnostics ------------------------------------------------------------
// Navigation detective: the last few input events are persisted across unload,
// and when a page load arrives via HISTORY traversal (back_forward — what the
// iOS edge swipe gestures produce, invisible to page code) a diagnostic toast
// says so, with the previous page and its final touches.
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


let _mktLoaded = false;
// Markets panel: Equities | Macro | Predictions chip tabs over one shared fetch.
// Byte-identical on every page (Home included) — the shared dropdown. Equities is
// the desktop LEFT rail (markets · top movers · FX); Macro is the desktop RIGHT
// rail bar its predictions (Key rates · Spreads · Volatility · Yield curve · Policy
// rate); Predictions is the prediction-market board.
let _mktTab = "equities";
// "Ask Wire" (B) + "Add a firm" (C) now live in the shared assistant module
// (v2/js/assistant.js), mounted both here (desktop header, Ask only) and in the
// Menu → Dialogue chip (Ask + Add). See mountAssistant().
function loadMarkets(body) {
  body.innerHTML = `<div class="na-chips">`
    + `<button type="button" class="na-chip" data-k="equities">Equities</button>`
    + `<button type="button" class="na-chip" data-k="macro">Macro</button>`
    + `<button type="button" class="na-chip" data-k="predict">Predictions</button>`
    + `</div><div class="na-tabbody"><div class="na-load">Loading…</div></div>`;
  const chips = body.querySelector(".na-chips");
  const tb = body.querySelector(".na-tabbody");
  let data = null, predict = null, predictLoading = false;
  const render = () => {
    chips.querySelectorAll(".na-chip").forEach((c) => c.classList.toggle("is-on", c.dataset.k === _mktTab));
    if (_mktTab === "predict") { tb.innerHTML = predictPane(predict, predictLoading); return; }
    if (!data) { tb.innerHTML = '<div class="na-load">Loading…</div>'; return; }
    tb.innerHTML = _mktTab === "macro" ? macroPane(data) : marketsPane(data);
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
    const ps = e.target.closest(".na-pred-fchip");     // predictions Macro/Politics/Finance
    if (ps && !ps.disabled) { e.preventDefault(); e.stopPropagation(); if (ps.dataset.ps !== _predSuper) { _predSuper = ps.dataset.ps; render(); } return; }
    const dir = e.target.closest(".na-pred-dir");      // Top Movers Up/Down
    if (dir) { e.preventDefault(); e.stopPropagation(); if (dir.dataset.dir !== _predMoveDir) { _predMoveDir = dir.dataset.dir; render(); } }
  });
  if (_mktTab === "predict") loadPredict();
  render();
  Promise.all([
    fetch("/api/markets?v=13", { headers: { accept: "application/json" } }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
    fetch("/api/rates?v=13", { headers: { accept: "application/json" } }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
  ]).then(([m, rt]) => {
    data = { markets: (m && m.markets) || [], movers: (m && m.moversEtf) || [], moversExtra: (m && m.moversExtra) || [], rates: (rt && rt.rates) || [] };
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
// A ~1-month trend sparkline for a markets-panel row — an inline SVG polyline from
// the row's OWN daily-close history (the feeds already carry it; no fabricated
// data, R7). Tinted by its net move over the window: up green, down red, flat
// muted. The cell always renders (empty when a row has too little history) so the
// value + change columns stay aligned. Mirrors glance.js's sparkCell.
function naSpark(hist) {
  const h = (Array.isArray(hist) ? hist : []).filter((v) => Number.isFinite(v));
  if (h.length < 3) return `<span class="na-spark" aria-hidden="true"></span>`;
  const n = h.length, min = Math.min(...h), max = Math.max(...h), rng = (max - min) || 1;
  const W = 100, H = 28, pad = 3;
  const pts = h.map((v, i) => `${((i / (n - 1)) * W).toFixed(1)},${(H - pad - ((v - min) / rng) * (H - 2 * pad)).toFixed(1)}`).join(" ");
  const net = h[n - 1] - h[0], dir = net > 0 ? "up" : net < 0 ? "down" : "flat";
  return `<span class="na-spark ${dir}" aria-hidden="true"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><polyline points="${pts}"/></svg></span>`;
}
// Element-wise difference of two daily histories, tail-aligned to the shorter — for
// the derived rows (HY−IG, CCC−HY, 2s10s). Both inputs share one daily source.
function naDiffHist(a, b) {
  const A = (Array.isArray(a) ? a : []).filter((v) => Number.isFinite(v));
  const B = (Array.isArray(b) ? b : []).filter((v) => Number.isFinite(v));
  const k = Math.min(A.length, B.length);
  if (k < 3) return [];
  const oa = A.length - k, ob = B.length - k, out = [];
  for (let i = 0; i < k; i++) out.push(A[oa + i] - B[ob + i]);
  return out;
}
const naDir = (c) => (c == null ? "flat" : c > 0 ? "up" : c < 0 ? "down" : "flat");
const naArw = (c) => (c == null ? "·" : c > 0 ? "▲" : c < 0 ? "▼" : "·");
// A generic sparkline data row: label · spark · value · change. `hist` opts the
// spark cell in (pass [] to reserve an empty cell and keep columns aligned).
function naDataRow(o) {
  const dir = o.dir || "flat";
  const chg = o.chg == null ? "" : `${naArw(dir === "up" ? 1 : dir === "down" ? -1 : 0)} ${o.chg}`;
  const tag = o.href ? "a" : "div";
  const attrs = o.href ? ` href="${esc(o.href)}" target="_blank" rel="noopener noreferrer"` : "";
  const spark = o.hist !== undefined ? naSpark(o.hist) : `<span class="na-spark"></span>`;
  return `<${tag} class="na-mrow na-srow${o.href ? " na-mrow-lnk" : ""}"${o.title ? ` title="${esc(o.title)}"` : ""}${attrs}>`
    + `<span class="na-l">${esc(o.label)}</span>${spark}<span class="na-v">${esc(o.val)}</span><span class="na-c ${dir}">${chg}</span></${tag}>`;
}
function marketRow(x) {
  const c = typeof x.changePct === "number" && isFinite(x.changePct) ? x.changePct : null;
  const dir = naDir(c), arw = naArw(c);
  return `<div class="na-mrow na-srow"><span class="na-l">${esc(x.label)}${sessDot(x.marketState, MKT_EXCH[x.label] || "US")}</span>${naSpark(x.history)}<span class="na-v">${x.value != null ? fmtNum(x.value) : "—"}</span><span class="na-c ${dir}">${c == null ? "" : arw + " " + Math.abs(c).toFixed(2) + "%"}</span></div>`;
}
function rateRow(x) {
  const bp = x.unit === "bp";
  const c = x.change == null ? null : (bp ? Math.round(x.change * 100) : +Number(x.change).toFixed(2));
  const dir = naDir(c), arw = naArw(c);
  const mag = c == null ? "" : (bp ? Math.abs(c) + " bp" : Math.abs(c).toFixed(2));
  return `<div class="na-mrow na-srow"><span class="na-l">${esc(x.label)}</span>${naSpark(x.history)}<span class="na-v">${x.value != null ? fmtRateVal(x.value, x.unit) : "—"}</span><span class="na-c ${dir}">${arw} ${mag}</span></div>`;
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
  return ` style="background:color-mix(in srgb, var(--t-${chg > 0 ? "up" : "down"}) ${(a * 100).toFixed(1)}%, transparent)"`;
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
  const km = (FX_KEYMOMENT && FX_KEYMOMENT.text)
    ? `<div class="na-fx-km"><span class="na-fx-km-l">Key moment</span> ${nbNums(esc(FX_KEYMOMENT.text))}${FX_KEYMOMENT.src ? ` <a class="na-brief-src" href="${esc(FX_KEYMOMENT.src)}" target="_blank" rel="noopener noreferrer">${esc(FX_KEYMOMENT.srcName || "source")}</a>` : ""}</div>`
    : "";
  return naSec("FX matrix", "1D cross") + `<div class="na-fx-wrap"><table class="na-fx-tbl"><thead>${head}</thead><tbody>${body}</tbody></table>${km}</div>`;
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
// Macro pane — the desktop RIGHT rail (bar its predictions): Key rates · Spreads ·
// Volatility · Yield curve · Policy rate, mirroring glance.js so the two surfaces
// read the same. Rates/spreads come from /api/rates, VIX/MOVE/CDX from the markets
// feed's moversExtra, the 2-year from /api/macro, and the policy snapshot from the
// OUTLOOK data. Every instrument-kind is its OWN section.
function macroPane(d) {
  const rates = d.rates || [], ex = d.moversExtra || [];
  if (!rates.length && !ex.length) return '<div class="na-load">Macro data unavailable right now.</div>';
  const find = (l) => rates.find((x) => x.label === l);
  const findEx = (l) => ex.find((x) => x.label === l);
  const bpTxt = (v) => `${Math.round(v * 100)} bp`;
  let html = "";

  // Key rates — benchmark yields only (US 2Y is a yield-curve input, not shown here).
  const keyRates = rates.filter((x) => !/OAS/i.test(x.label) && x.label !== "US 2Y");
  if (keyRates.length) html += naSec("Key rates", "%") + keyRates.map(rateRow).join("");

  // Spreads — the OAS levels plus the derived HY−IG (quality) / CCC−HY (distress).
  const oas = rates.filter((x) => /OAS/i.test(x.label));
  const hy = find("US HY OAS"), ig = find("US IG OAS"), ccc = find("US CCC OAS");
  const spreadRows = oas.map(rateRow);
  if (hy && ig && hy.value != null && ig.value != null) {
    const v = hy.value - ig.value, c = (hy.change != null && ig.change != null) ? hy.change - ig.change : null;
    spreadRows.push(naDataRow({ label: "HY − IG", val: bpTxt(v), dir: naDir(c), chg: c == null ? null : Math.abs(Math.round(c * 100)) + " bp", href: hy.href, hist: naDiffHist(hy.history, ig.history) }));
  }
  if (ccc && hy && ccc.value != null && hy.value != null) {
    const v = ccc.value - hy.value, c = (ccc.change != null && hy.change != null) ? ccc.change - hy.change : null;
    spreadRows.push(naDataRow({ label: "CCC − HY", val: bpTxt(v), dir: naDir(c), chg: c == null ? null : Math.abs(Math.round(c * 100)) + " bp", href: ccc.href, hist: naDiffHist(ccc.history, hy.history) }));
  }
  if (spreadRows.length) html += naSec("Spreads", "bp") + spreadRows.join("");

  // Volatility — VIX, MOVE (points) and CDX HY (price / %).
  const volRows = [];
  const volPts = (row, label, href, title) => {
    if (!row || row.value == null) return;
    const cp = typeof row.changePct === "number" ? row.changePct : null;
    const pts = cp == null ? null : +row.value - (+row.value) / (1 + cp / 100);
    volRows.push(naDataRow({ label, val: (+row.value).toFixed(2), dir: naDir(pts), chg: pts == null ? null : Math.abs(pts).toFixed(2) + " pt", href, title, hist: row.history || [] }));
  };
  volPts(findEx("VIX"), "VIX", "https://finance.yahoo.com/quote/%5EVIX", "CBOE Volatility Index — equity volatility");
  volPts(findEx("MOVE"), "MOVE", "https://finance.yahoo.com/quote/%5EMOVE", "ICE BofAML MOVE Index — the bond-market VIX");
  const cdx = findEx("CDX HY");
  if (cdx && cdx.value != null) {
    const cp = typeof cdx.changePct === "number" ? cdx.changePct : null;
    volRows.push(naDataRow({ label: "CDX HY", val: "$" + (+cdx.value).toFixed(2), dir: naDir(cp), chg: cp == null ? null : Math.abs(cp).toFixed(2) + "%", href: "https://finance.yahoo.com/quote/CDX", title: "Simplify High Yield ETF (CDX) — tracks CDX.NA.HY", hist: cdx.history || [] }));
  }
  if (volRows.length) html += naSec("Volatility", "vol") + volRows.join("");

  // Yield curve — 2Y, 10Y and the 2s10s slope.
  const t2 = find("US 2Y"), t10 = find("US 10Y");
  const ycRows = [];
  if (t2 && t2.value != null) ycRows.push(naDataRow({ label: "2Y", val: (+t2.value).toFixed(2) + "%", dir: naDir(t2.change), chg: t2.change == null ? null : Math.abs(t2.change).toFixed(2) + " pp", href: t2.href, hist: t2.history || [] }));
  if (t10 && t10.value != null) ycRows.push(naDataRow({ label: "10Y", val: (+t10.value).toFixed(2) + "%", dir: naDir(t10.change), chg: t10.change == null ? null : Math.abs(t10.change).toFixed(2) + " pp", href: t10.href, hist: t10.history || [] }));
  if (t2 && t10 && t2.value != null && t10.value != null) {
    const spBp = Math.round((+t10.value - +t2.value) * 100);
    const cBp = (t10.change != null && t2.change != null) ? Math.round((t10.change - t2.change) * 100) : null;
    ycRows.push(naDataRow({ label: "2s10s", val: `${spBp > 0 ? "+" : ""}${spBp} bp`, dir: naDir(cBp), chg: cBp == null ? null : Math.abs(cBp) + " bp", href: t10.href, hist: naDiffHist(t10.history, t2.history) }));
  }
  if (ycRows.length) html += naSec("Yield curve", "UST") + ycRows.join("");

  // Policy rate — the US · UK snapshot (rate · next meeting · forecast lean).
  html += naPolicy();
  return html || '<div class="na-load">Macro data unavailable right now.</div>';
}
// Compact policy-rate snapshot (label+rate · next · forecast), a link to the full
// Macro › Policy Rate page. The forecast lean reads muted, not an accent (matches
// the desktop rail's g-snap-mood).
function naPolicy() {
  if (!OUTLOOK || !OUTLOOK.us) return "";
  const MOOD = ["hawkish", "dovish", "neutral"];
  const row = (cc, o) => {
    if (!o) return "";
    const parts = String(o.stance || "").split("·");
    const fc = (parts[0] || o.stance || "").trim();
    const mood = MOOD.find((k) => parts.slice(1).join("·").toLowerCase().includes(k));
    const nx = String(o.next || "").replace(/\s*\((?:resolved|held?|decided)\b[^)]*\)/gi, "").trim();
    return `<a class="na-mrow na-pol" href="/macro/#/policy">`
      + `<span class="na-l">${esc(cc)} <span class="na-pol-rate">${esc(o.rate)}</span></span>`
      + `<span class="na-pol-nx">${esc(nx)}</span>`
      + `<span class="na-pol-fcw"><span class="na-pol-fc">${esc(fc)}</span>${mood ? ` <span class="na-pol-mood">· ${mood[0].toUpperCase()}${mood.slice(1)}</span>` : ""}</span></a>`;
  };
  return `<div class="na-sec"><span>Policy rate</span><span class="na-sec-x">US · UK</span></div>` + row("US", OUTLOOK.us) + row("UK", OUTLOOK.uk);
}

// ---- Saved rows — shared news-feed row (headline, then code · date · source) --
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
      const mod = await import("/saved.js?v=20260921-1");
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
// Theme preference plumbing — the CONTROL lives in the Menu → Settings segmented
// control (both surfaces); the nav bar no longer carries a theme button. These
// helpers stay because the runtime still owns the OS "system" follow (applied in
// initNavActions): "system" tracks the OS live; "light"/"dark" are concrete
// remembered choices in data-theme-choice (+ localStorage) that persist across
// OS changes and reloads.
const osDark = () => !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
// The stored preference: "system" | "light" | "dark".
const storedPref = () => { const c = document.documentElement.getAttribute("data-theme-choice"); return (c === "light" || c === "dark") ? c : "system"; };
// Resolve a preference to a concrete theme: system = OS setting, else itself.
const resolveTheme = (pref) => (pref === "system" ? (osDark() ? "dark" : "light") : pref);
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
async function ensureNotifs() {
  if (_notifItems) return _notifItems;
  const { buildNotifs } = await import("/saved.js?v=20260921-1");
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
// Pull each desk's server-side seen-state (KV, keyed on the Access email) and
// UNION it into localStorage, so a notification marked read on ONE device shows
// as read on every device. Mirrors the Bookmarks pull; markNotifSeen only ever
// PUT the local state, so without this each device tracked "read" independently.
// Runs before the baseline/badge on boot, so cross-device reads are respected
// and a later PUT can't clobber another device's reads. Returns true if changed.
async function hydrateSeen() {
  let changed = false;
  await Promise.all(["c", "l"].map(async (desk) => {
    try {
      const r = await fetch(NOTIF_API[desk], { headers: { accept: "application/json" } });
      if (!r.ok) return;
      const d = await r.json();
      const server = (d && Array.isArray(d.seen)) ? d.seen : [];
      if (!server.length) return;
      let local = []; try { const p = JSON.parse(localStorage.getItem(NOTIF_KEYS[desk]) || "[]"); if (Array.isArray(p)) local = p; } catch { /* */ }
      const set = new Set(local); const before = set.size;
      server.forEach((id) => { if (typeof id === "string") set.add(id); });
      if (set.size !== before) { try { localStorage.setItem(NOTIF_KEYS[desk], JSON.stringify([...set].slice(0, 4000))); changed = true; } catch { /* */ } }
    } catch { /* offline — local state stands */ }
  }));
  return changed;
}

// ---- shared full-screen shell (mobile) --------------------------------------
function setTopVar() {
  const t = document.querySelector(".topbar") || document.querySelector(".g-top");
  const h = t ? Math.round(t.getBoundingClientRect().bottom) : 54;
  document.documentElement.style.setProperty("--na-top-b", h + "px");
}
let _scrim = null;
function scrimOn(onClose) {
  // Backdrop for BOTH the phone full-screen sheet and the desktop centered modal.
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
    import("/rowmenu.js?v=20260724-2").then((m) => m.initRowMenu()).catch(() => {});
    // Swipe left/right on a chip-filtered pane to move between its chips.
    /* v2: swipe-tabs disabled — the runtime owns navigation. */
    let resizeQueued = false;
    addEventListener("resize", () => {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(() => { resizeQueued = false; setTopVar(); });
    });
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
      // Cluster order (left→right): Ask/Chat (desktop only) · Markets · Bookmarks ·
      // Briefing · Notifications. Ask (Chat) leads on desktop; on phones it lives
      // in the Menu → Chat chip, so the phone header stays Markets · Bookmarks ·
      // Notifications. The Theme toggle no longer lives here on EITHER
      // surface — it is reached via the Menu → Settings segmented control (the OS
      // "system" follow is still wired below). The refresh-countdown ring moved OUT
      // of this cluster (now beside the "Last refresh" marker, status.js), and
      // Search moved to the Menu → Chat chip on phones (desktop keeps the topbar
      // search pill), so there is no phone magnifier button here any more.
      (isPhone() ? "" : `<button type="button" class="na-btn" id="na-ask" aria-label="Ask Wire" aria-haspopup="true" aria-expanded="false" title="Ask Wire ( ' )">${ICO_ASK}</button>`) +
      `<button type="button" class="na-btn" id="na-mkt" aria-label="Markets & key rates" aria-haspopup="true" aria-expanded="false" title="Markets & key rates">${ICO_MKT}</button>` +
      `<button type="button" class="na-btn" id="na-saved" aria-label="Saved" aria-haspopup="true" aria-expanded="false" title="Saved">${ICO_SAVED}</button>` +
      `<button type="button" class="na-btn na-bell" id="na-notif" aria-label="Notifications" aria-haspopup="true" aria-expanded="false" title="Notifications">${ICO_BELL}<span class="na-badge" hidden></span></button>`;
    if (notif && notif.parentElement) {
      notif.parentElement.insertBefore(wrap, notif);
    } else if (bar) {
      bar.appendChild(wrap);
    }

    // Theme follows a remembered preference: "system" (track the OS) or a concrete
    // "light"/"dark". The pref is stored in localStorage (m_theme_pref) so the
    // inline head script applies it before paint on the next load. The theme
    // CONTROL now lives only in the Menu → Settings segmented control (both
    // surfaces) — there is no nav-bar theme button any more — but the OS "system"
    // follow is still owned here so a system-set choice tracks light/dark live.
    const applyThemeChoice = (pref) => {
      const r = document.documentElement;
      const t = resolveTheme(pref);
      r.setAttribute("data-theme", t);
      r.setAttribute("data-theme-choice", pref);
      try { localStorage.setItem("m_theme_pref", pref); } catch { /* */ }
      setThemeColorMeta(t);
    };
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
    //
    // The ring markup now lives beside the "Last refresh" marker (status.js
    // renders it into every [data-refresh-slot]), NOT in this cluster — so the
    // ticker queries the DOCUMENT each tick and drives every ring instance it
    // finds. Re-querying each tick also picks up rings that status.js (re)renders
    // after this init runs.
    {
      const RING_MS = 5 * 60 * 1000;
      const RING_C = 2 * Math.PI * 7;
      const ringAnchor = () => { try { return +localStorage.getItem("wire.live.anchor") || 0; } catch { return 0; } };
      const tickRing = () => {
        const a = ringAnchor();
        const p = ((((Date.now() - a) % RING_MS) + RING_MS) % RING_MS) / RING_MS;
        const off = (RING_C * p).toFixed(2);
        document.querySelectorAll(".na-ring-arc").forEach((arc) => { arc.style.strokeDashoffset = off; });
        // No successful feed fetch for >20 min → dim the ring instead of
        // pretending the cycle is alive (session expiry, offline, …).
        const stale = !!a && Date.now() - a > 20 * 60 * 1000;
        document.querySelectorAll(".na-ring").forEach((r) => r.classList.toggle("na-ring-stale", stale));
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
    const askPanel = mkPanel("na-ask-panel", "Ask Wire");
    const mktPanel = mkPanel("na-mkt-panel", "Markets");
    const savedPanel = mkPanel("na-saved-panel", "Bookmarks");
    const notifPanel = mkPanel("na-notif-panel", "Notifications");
    // Register/refresh the service worker on every visit — it carries Web Push
    // AND the app-shell cache that makes page switches paint instantly.
    if ("serviceWorker" in navigator) {
      // Self-heal a stuck installed PWA: if the page is already controlled by a
      // worker and a NEW one takes over (skipWaiting + clients.claim on deploy),
      // reload ONCE so stale in-memory modules (e.g. a pre-fix Profiles bundle) are
      // replaced by the fresh build. Guarded so it never loops and never fires on
      // the first-ever install (no prior controller).
      if (navigator.serviceWorker.controller) {
        let _swReloaded = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (_swReloaded) return; _swReloaded = true; location.reload();
        });
      }
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        // Force an update check every launch — iOS standalone PWAs otherwise let an
        // old worker linger for a day+. sw.js is no-cache, so this is a cheap 304
        // when unchanged; a changed sw.js installs → activates → claims → the
        // one-time reload above.
        try { reg.update(); } catch { /* */ }
      }).catch(() => {});
    }
    // BUILD-TOKEN SELF-HEAL (independent of the service worker). The SW reload
    // above only fires when sw.js itself changes; a module-only deploy (a fix to
    // a view's JS) does NOT change sw.js, so a resumed iOS PWA — which never
    // re-navigates and so never re-fetches the shell — keeps running the OLD
    // in-memory modules across many deploys. That is the "the fix never reaches
    // the phone" trap behind repeated 'still broken' reports. Fix: on launch and
    // on every foreground, fetch the shell fresh (no-store, bypasses the SW as a
    // non-navigation same-origin GET) and compare the runtime build token it
    // serves NOW against the one THIS document actually loaded. If they differ,
    // our code is stale — reload once to pull the new build.
    {
      const runningBuild = () => {
        const s = document.querySelector('script[src*="/v2/js/runtime.js"]');
        const m = s && /[?&]v=([^&"']+)/.exec(s.getAttribute("src") || "");
        return m ? m[1] : null;
      };
      let checking = false, reloaded = false, lastAt = 0;
      const checkFreshBuild = async () => {
        if (checking || reloaded) return;
        const mine = runningBuild(); if (!mine) return;
        const t = (typeof performance !== "undefined" && performance.now) ? performance.now() : 0;
        if (lastAt && t - lastAt < 15000) return;   // throttle rapid foregrounds
        lastAt = t; checking = true;
        try {
          const res = await fetch("/v2/", { cache: "no-store" });
          if (res && res.ok) {
            const m = /\/v2\/js\/runtime\.js\?v=([^"'&]+)/.exec(await res.text());
            if (m && m[1] && m[1] !== mine) { reloaded = true; location.reload(); return; }
          }
        } catch { /* offline / Access redirect — keep the working build */ }
        finally { checking = false; }
      };
      checkFreshBuild();
      document.addEventListener("visibilitychange", () => { if (!document.hidden) checkFreshBuild(); });
    }
    // Tidy the Access re-auth marker (?__net=1 forces the navigation past the
    // app-shell cache so Access can round-trip through login).
    if (/(^|[?&])__net=/.test(location.search)) {
      try { history.replaceState(null, "", location.pathname); } catch { /* */ }
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
          // The FIRST time new (unseen, orange) items are viewed they group at the
          // TOP under a "New" heading, ahead of everything else; the rest keep their
          // date order under "Earlier". Opening marks them seen, so on the next open
          // none are fresh — the grouping/headers drop and they assimilate into the
          // single date-sorted list. (items is already sorted newest-first, so each
          // group stays in date order.)
          const fresh = items.filter(isFresh);
          const rest = items.filter((x) => !isFresh(x));
          if (!items.length) {
            tb.innerHTML = '<div class="na-empty">Nothing yet.</div>';
          } else if (fresh.length) {
            tb.innerHTML = `<div class="nf-grp">New</div>` + fresh.map((x) => notifRow(x, true)).join("")
              + (rest.length ? `<div class="nf-grp nf-grp-earlier">Earlier</div>` + rest.map((x) => notifRow(x, false)).join("") : "");
          } else {
            tb.innerHTML = items.map((x) => notifRow(x, false)).join("");
          }
          markNotifSeen(items); clearBadge();
        } else {
          tb.innerHTML = '<div class="na-load">Loading…</div>';
          try {
            const mod = await import("/saved.js?v=20260921-1");
            const list = mod.resolveWatchlistNews();
            tb.innerHTML = list.length
              ? list.map(savedRow).join("")
              : '<div class="na-empty">No watchlist updates yet. Press and hold a manager, hedge-fund or law-firm profile (or story) to add it to your watchlist — their updates appear here.</div>';
          } catch { tb.innerHTML = '<div class="na-load">Unavailable right now.</div>'; }
        }
      };
      chips.addEventListener("click", (e) => { const c = e.target.closest(".na-chip"); if (c && c.dataset.k !== _ntTab) { _ntTab = c.dataset.k; paint(); } });
      paint();
    };

    // Ask Wire (feature B) in the desktop header: mounted from the shared
    // assistant module (Ask only — the "Add"/propose flow (C) lives in the Menu →
    // Dialogue chip). State persists across opens via _headerAskState so reopening
    // the panel shows the last answer. On phones there is no #na-ask button, so
    // this panel is simply never opened (mountAssistant is called from onOpen).
    const _headerAskState = {};

    const panels = [
      // Ask panel: desktop-only (no #na-ask button on phones), so include the rec
      // only when the button exists.
      ...(wrap.querySelector("#na-ask") ? [{ btn: wrap.querySelector("#na-ask"), panel: askPanel, onOpen: (p) => { mountAssistant(p.querySelector(".na-body"), { add: false, state: _headerAskState }); const i = p.querySelector(".na-ask-in"); if (i && !isPhone()) setTimeout(() => i.focus(), 40); } }] : []),
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
      // Desktop centers the panel as a modal via CSS (translate(-50%,-50%)); no
      // per-open anchoring under the button. Phones keep the full-screen sheet.
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
    // Keyboard: Escape closes any open panel; "'" opens the Chat (Ask) panel — the
    // keyboard twin of "/" for search. Ignore "'" while typing in a field or with a
    // modifier held, and only when the Ask panel exists (desktop; on phones Chat
    // lives in the Menu → Chat chip, not the header).
    const isTyping = (t) => { const tag = (t && t.tagName || "").toLowerCase(); return !!t && (t.isContentEditable || tag === "input" || tag === "textarea" || tag === "select"); };
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeAll(); return; }
      if (e.key === "'" && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(e.target)) {
        const askRec = panels.find((x) => x.btn && x.btn.id === "na-ask");
        if (!askRec) return;
        e.preventDefault();
        if (askRec.panel.hidden) openPanel(askRec); else closeAll();
      }
    });

    // Prime the cross-desk notifications + unread badge in the background. Hydrate
    // the server-side seen-state FIRST so notifications read on another device are
    // already reflected before the baseline is set and the badge is counted.
    hydrateSeen().finally(() => ensureNotifs().then((items) => {
      establishBaseline(items);
      const n = countUnread(items);
      const b = notifBtn.querySelector(".na-badge");
      if (b) { if (n) { b.textContent = n > 9 ? "9+" : String(n); b.hidden = false; } else { b.hidden = true; } }
    }).catch(() => {}));
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
