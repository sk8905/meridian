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
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtNum = (v) => { v = +v; if (!isFinite(v)) return "—"; const a = Math.abs(v); if (a >= 1000) return v.toLocaleString(undefined, { maximumFractionDigits: a >= 10000 ? 0 : 1 }); if (a >= 100) return v.toFixed(1); if (a >= 1) return v.toFixed(2); return v.toFixed(4); };
const fmtRateVal = (v, unit) => { v = +v; if (!isFinite(v)) return "—"; if (unit === "bp") return v.toFixed(0) + " bp"; return v.toFixed(2) + "%"; };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(d) { if (!d) return ""; const s = /^\d{4}-\d{2}$/.test(d) ? d + "-01" : String(d).slice(0, 10); const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s); if (!m) return String(d); return `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}`; }

const DESK = { m: "Macro", c: "Credit", l: "Legal" };
const DESK_CLASS = { m: "macro", c: "credit", l: "legal" };

const ICO_MKT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/></svg>';
const ICO_SAVED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';

const isPhone = () => matchMedia("(max-width:760px)").matches;

// ---- Markets rows -----------------------------------------------------------
function marketRow(x) {
  const c = typeof x.changePct === "number" && isFinite(x.changePct) ? x.changePct : null;
  const dir = c == null ? "flat" : c > 0 ? "up" : c < 0 ? "down" : "flat";
  const arw = c == null ? "·" : c > 0 ? "▲" : c < 0 ? "▼" : "·";
  return `<div class="na-mrow"><span class="na-l">${esc(x.label)}</span><span class="na-v">${x.value != null ? fmtNum(x.value) : "—"}</span><span class="na-c ${dir}">${c == null ? "" : arw + " " + Math.abs(c).toFixed(2) + "%"}</span></div>`;
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
  const arw = c == null ? "·" : c > 0 ? "▲" : c < 0 ? "▼" : "·";
  const inner = `<span class="na-l">${esc(x.label)}</span><span class="na-v">${x.value != null ? fmtNum(x.value) : "—"}</span><span class="na-c ${dir}">${c == null ? "" : arw + " " + Math.abs(c).toFixed(2) + "%"}</span>`;
  return x.href
    ? `<a class="na-mrow" href="${esc(x.href)}" target="_blank" rel="noopener noreferrer">${inner}</a>`
    : `<div class="na-mrow">${inner}</div>`;
}

let _mktLoaded = false;
function loadMarkets(body) {
  body.innerHTML = '<div class="na-load">Loading…</div>';
  Promise.all([
    fetch("/api/markets?v=12", { headers: { accept: "application/json" } }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
    fetch("/api/rates?v=12", { headers: { accept: "application/json" } }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
  ]).then(([m, rt]) => {
    const markets = (m && m.markets) || [];
    const movers = (m && m.moversEtf) || [];
    const rates = (rt && rt.rates) || [];
    if (!markets.length && !rates.length && !movers.length) { body.innerHTML = '<div class="na-load">Markets unavailable right now.</div>'; return; }
    body.innerHTML =
      (markets.length ? `<div class="na-sec">Markets</div>${markets.map(marketRow).join("")}` : "") +
      (rates.length ? `<div class="na-sec">Key rates</div>${rates.map(rateRow).join("")}` : "") +
      (movers.length ? `<div class="na-sec">Cross-asset ETFs</div>${movers.map(moverRow).join("")}` : "");
  });
}

// ---- Saved rows -------------------------------------------------------------
function savedRow(x) {
  return `<a class="na-item" href="${esc(x.href)}"${x.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>`
    + `<span class="na-tag ${DESK_CLASS[x.desk]}">${esc(DESK[x.desk] || "")}</span>`
    + `<span class="na-itxt"><span class="na-it">${esc(x.title)}</span>`
    + `<span class="na-im">${x.src ? esc(x.src) : ""}${x.date ? (x.src ? " · " : "") + esc(fmtDate(x.date)) : ""}</span></span></a>`;
}
async function loadSaved(body, headCount) {
  body.innerHTML = '<div class="na-load">Loading…</div>';
  try {
    const { resolveSaved } = await import("/saved.js?v=20260717-1");
    const list = resolveSaved();
    if (headCount) headCount.textContent = list.length ? " · " + list.length : "";
    body.innerHTML = list.length
      ? list.map(savedRow).join("")
      : '<div class="na-empty">Nothing saved yet. Tap the ☆ on any item across Macro, Credit or Legal to keep it here.</div>';
  } catch {
    body.innerHTML = '<div class="na-load">Saved list unavailable right now.</div>';
  }
}

// ---- shared full-screen shell (mobile) --------------------------------------
function setTopVar() {
  const t = document.querySelector(".topbar");
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
function lockBody(on) { document.body.classList.toggle("na-menu-open", !!on); }

export function initNavActions() {
  const run = () => {
    const notif = document.getElementById("notif");
    const bar = document.querySelector(".topbar-right");
    if (!notif && !bar) return;
    if (document.getElementById("na-mkt")) return; // already mounted
    setTopVar();
    addEventListener("resize", setTopVar);
    addEventListener("orientationchange", () => setTimeout(setTopVar, 200));

    const wrap = document.createElement("div");
    wrap.className = "na-actions";
    wrap.innerHTML =
      `<button type="button" class="na-btn" id="na-mkt" aria-label="Markets & key rates" aria-haspopup="true" aria-expanded="false" title="Markets & key rates">${ICO_MKT}</button>` +
      `<button type="button" class="na-btn" id="na-saved" aria-label="Saved" aria-haspopup="true" aria-expanded="false" title="Saved">${ICO_SAVED}</button>`;
    // Group Markets · Saved · Bell into ONE right-hand cluster (mirrors the Home
    // command bar). Move the existing #notif element inside it, keeping its
    // id/handlers/seen-state intact.
    if (notif && notif.parentElement) {
      notif.parentElement.insertBefore(wrap, notif);
      wrap.appendChild(notif);
    } else if (bar) {
      bar.appendChild(wrap);
    }

    // Two full-screen/dropdown overlays, lifted to <body> so the sticky top bar's
    // stacking context can't demote them behind the filter-chip bar on iOS.
    const mkPanel = (id, title) => {
      const p = document.createElement("div");
      p.className = "na-panel";
      p.id = id;
      p.hidden = true;
      p.innerHTML = `<div class="na-head"><span class="na-h-t">${esc(title)}<span class="na-h-n"></span></span>`
        + `<button type="button" class="na-close" aria-label="Close" data-na-close>✕</button></div>`
        + `<div class="na-body"></div>`;
      document.body.appendChild(p);
      return p;
    };
    const mktPanel = mkPanel("na-mkt-panel", "Markets");
    const savedPanel = mkPanel("na-saved-panel", "Saved");

    const mktBtn = wrap.querySelector("#na-mkt");
    const savedBtn = wrap.querySelector("#na-saved");
    const panels = [
      { btn: mktBtn, panel: mktPanel, onOpen: (p) => { if (!_mktLoaded) { _mktLoaded = true; loadMarkets(p.querySelector(".na-body")); } } },
      { btn: savedBtn, panel: savedPanel, onOpen: (p) => { loadSaved(p.querySelector(".na-body"), p.querySelector(".na-h-n")); } },
    ];

    const closeNotifPanel = () => { const np = document.querySelector(".notif-panel:not([hidden])"); if (np) np.setAttribute("hidden", ""); const nb = document.getElementById("notif-bell"); if (nb) nb.setAttribute("aria-expanded", "false"); };
    const anyOpen = () => panels.some((x) => !x.panel.hidden) || !!document.querySelector(".notif-panel:not([hidden])");
    const closeAll = () => {
      panels.forEach((x) => { x.panel.hidden = true; x.btn.setAttribute("aria-expanded", "false"); });
      closeNotifPanel();
      lockBody(false); scrimOff();
    };
    const openPanel = (rec) => {
      panels.forEach((x) => { if (x !== rec) { x.panel.hidden = true; x.btn.setAttribute("aria-expanded", "false"); } });
      closeNotifPanel();
      rec.panel.hidden = false;
      rec.btn.setAttribute("aria-expanded", "true");
      rec.onOpen(rec.panel);
      if (!isPhone()) { const r = rec.btn.getBoundingClientRect(); rec.panel.style.top = `${Math.round(r.bottom + 8)}px`; }
      lockBody(isPhone());
      scrimOn(closeAll);
    };

    panels.forEach((rec) => {
      rec.btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (rec.panel.hidden) openPanel(rec); else closeAll();
      });
      rec.panel.addEventListener("click", (e) => { if (e.target.closest("[data-na-close]")) closeAll(); });
    });

    document.addEventListener("click", (e) => {
      if (!anyOpen()) return;
      if (e.target.closest(".na-panel") || e.target.closest(".na-actions")) return;
      closeAll();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

    // ---- Notifications bell: layer the same full-screen presentation on mobile
    // over the app's own bell without touching its content/seen-state logic. When
    // the app shows its .notif-panel, we lock the body + raise the scrim; when it
    // hides, we release. An observer keeps in sync across the panel's re-renders.
    const syncNotif = () => {
      const open = !!document.querySelector(".notif-panel:not([hidden])");
      if (open) {
        panels.forEach((x) => { if (!x.panel.hidden) { x.panel.hidden = true; x.btn.setAttribute("aria-expanded", "false"); } });
        lockBody(isPhone()); scrimOn(closeAll);
      } else if (!panels.some((x) => !x.panel.hidden)) {
        lockBody(false); scrimOff();
      }
    };
    const obs = new MutationObserver(syncNotif);
    obs.observe(notif, { attributes: true, subtree: true, attributeFilter: ["hidden"], childList: true });
  };
  if (document.readyState !== "loading") run(); else document.addEventListener("DOMContentLoaded", run);
}
