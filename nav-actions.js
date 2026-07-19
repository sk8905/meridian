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
const DESK_CLASS = { m: "macro", c: "credit", l: "legal", n: "newsletter", f: "ft" };

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
// Top movers mirror the desktop rail: label, a centre-anchored bar (green right /
// red left, proportional to the move) and the % change.
function moverRow(x) {
  const c = typeof x.changePct === "number" && isFinite(x.changePct) ? x.changePct : null;
  const dir = c == null ? "flat" : c > 0 ? "up" : c < 0 ? "down" : "flat";
  const pct = c == null ? "" : (c > 0 ? "+" : "") + c.toFixed(2) + "%";
  const w = c == null ? 0 : Math.max(3, Math.min(50, Math.abs(c) * 15));
  const inner = `<span class="na-l">${esc(x.label)}</span>`
    + `<span class="na-bar"><span class="na-bar-f ${dir}" style="width:${w}%"></span></span>`
    + `<span class="na-c ${dir}">${pct}</span>`;
  return x.href
    ? `<a class="na-mrow na-mover" href="${esc(x.href)}" target="_blank" rel="noopener noreferrer">${inner}</a>`
    : `<div class="na-mrow na-mover">${inner}</div>`;
}
const naSec = (title, tag) => `<div class="na-sec"><span>${esc(title)}</span><span class="na-sec-x">${esc(tag)}</span></div>`;

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
      (markets.length ? naSec("Markets", "live") + markets.map(marketRow).join("") : "") +
      (rates.length ? naSec("Key rates & spreads", "bp · %") + rates.map(rateRow).join("") : "") +
      (movers.length ? naSec("Top movers", "1D") + movers.map(moverRow).join("") : "");
  });
}

// ---- Saved rows — shared news-feed row (headline, then code · date · source) --
const NF_CODE = { m: "MAC", c: "CRD", l: "LEX", n: "LETTER", f: "FT" };
function savedRow(x) {
  const code = NF_CODE[x.desk] || "";
  const cls = DESK_CLASS[x.desk] || "";
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
      const mod = await import("/saved.js?v=20260718-6");
      const list = _svTab === "saved" ? mod.resolveSaved() : mod.resolveWatchlistNews();
      if (headCount) headCount.textContent = list.length ? " · " + list.length : "";
      tb.innerHTML = list.length
        ? list.map(savedRow).join("")
        : (_svTab === "saved"
          ? '<div class="na-empty">Nothing saved yet. Tap the ☆ on any item — or press and hold a story on the Home wire — to keep it here.</div>'
          : '<div class="na-empty">No watchlist news yet. Press and hold a manager or law-firm story (or tap the ☆ on a manager in Credit) to follow it — their deals, fundraising, alerts and matters appear here.</div>');
    } catch {
      tb.innerHTML = '<div class="na-load">Unavailable right now.</div>';
    }
  };
  chips.addEventListener("click", (e) => { const c = e.target.closest(".na-chip"); if (c && c.dataset.k !== _svTab) { _svTab = c.dataset.k; render(); } });
  render();
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
const NOTIF_KEYS = { c: "meridian.credit.notifSeen", l: "meridian.legal.notifSeen", m: "meridian.macro.notifSeen" };
const NOTIF_API = { c: "/api/notif-credit", l: "/api/notif-legal", m: "/api/notif-macro" };
function readSeen(desk) { try { const p = JSON.parse(localStorage.getItem(NOTIF_KEYS[desk]) || "null"); return Array.isArray(p) ? new Set(p) : null; } catch { return null; } }
function notifRow(x) {
  const cls = DESK_CLASS[x.desk] || "";
  const code = NF_CODE[x.desk] || "";
  return `<a class="nf-row" href="${esc(x.href)}"${x.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>`
    + `<span class="nf-title">${esc(x.title)}</span>`
    + `<span class="nf-meta"><span class="nf-code ${cls}">${esc(code)}</span>`
    + (x.date ? `<span class="nf-time">${esc(fmtDate(x.date))}</span>` : "")
    + (x.source ? `<span class="nf-sep">·</span><span class="nf-src">${esc(x.src || x.source)}</span>` : "")
    + `</span></a>`;
}
let _notifItems = null;
async function ensureNotifs() {
  if (_notifItems) return _notifItems;
  const { buildNotifs } = await import("/saved.js?v=20260718-6");
  _notifItems = (await buildNotifs()).slice(0, 60);
  return _notifItems;
}
function countUnread(items) {
  const seen = { c: readSeen("c"), l: readSeen("l"), m: readSeen("m") };
  return items.filter((x) => { const s = seen[x.desk]; return s ? !s.has(x.id) : false; }).length;
}
// First time we see a desk's notifications we treat the current set as the
// baseline (all "seen") so the historical back-catalogue doesn't show as unread.
function establishBaseline(items) {
  ["c", "l", "m"].forEach((desk) => {
    if (readSeen(desk) === null) {
      const ids = items.filter((x) => x.desk === desk).map((x) => x.id);
      try { localStorage.setItem(NOTIF_KEYS[desk], JSON.stringify(ids)); } catch { /* */ }
    }
  });
}
function markNotifSeen(items) {
  ["c", "l", "m"].forEach((desk) => {
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
    const notif = document.getElementById("notif");
    // Apps mount into .topbar-right; Home (glance) mounts into .g-top .g-actions —
    // the SAME controller runs on all four pages.
    const bar = document.querySelector(".topbar-right") || document.querySelector(".g-top .g-actions");
    if (!notif && !bar) return;
    if (document.getElementById("na-mkt")) return; // already mounted
    setTopVar();
    // Shared press-and-hold / right-click row options menu — every page.
    import("/rowmenu.js?v=20260718-1").then((m) => m.initRowMenu()).catch(() => {});
    // Swipe left/right on a chip-filtered pane to move between its chips.
    import("/swipetabs.js?v=20260718-3").then((m) => m.initSwipeTabs()).catch(() => {});
    addEventListener("resize", setTopVar);
    addEventListener("orientationchange", () => setTimeout(setTopVar, 200));

    // nav-actions owns all THREE buttons and panels so switching between them is
    // driven by one controller (no split ownership / observer races). The app's
    // own #notif bell is hidden — its background seen-state syncing still runs and
    // seeds localStorage, which our cross-desk badge reads.
    if (notif) notif.style.display = "none";
    // Home's legacy per-page menu mounts (markets / saved / bell) — retired in
    // favour of this shared controller.
    ["g-mkt", "g-saved", "g-notif"].forEach((lid) => { const el = document.getElementById(lid); if (el) el.style.display = "none"; });
    const wrap = document.createElement("div");
    wrap.className = "na-actions";
    wrap.innerHTML =
      // Thin donut countdown: drains over the 5-minute live-feed window, refills
      // on each refresh (Home dispatches wire:live-refresh; elsewhere it cycles
      // on the wall clock, matching the edge cache cadence).
      `<span class="na-ring" title="Time to next live-feed refresh" aria-hidden="true"><svg viewBox="0 0 18 18"><circle class="na-ring-track" cx="9" cy="9" r="7"/><circle class="na-ring-arc" cx="9" cy="9" r="7"/></svg></span>` +
      `<button type="button" class="na-btn" id="na-mkt" aria-label="Markets & key rates" aria-haspopup="true" aria-expanded="false" title="Markets & key rates">${ICO_MKT}</button>` +
      `<button type="button" class="na-btn" id="na-saved" aria-label="Saved" aria-haspopup="true" aria-expanded="false" title="Saved">${ICO_SAVED}</button>` +
      `<button type="button" class="na-btn na-bell" id="na-notif" aria-label="Notifications" aria-haspopup="true" aria-expanded="false" title="Notifications">${ICO_BELL}<span class="na-badge" hidden></span></button>`;
    if (notif && notif.parentElement) {
      notif.parentElement.insertBefore(wrap, notif);
    } else if (bar) {
      bar.appendChild(wrap);
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
    const menuPanel = mkPanel("na-menu-panel", "Menu");

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
      // Recent searches — recorded by both search palettes on every opened
      // result (shared localStorage key). Tapping one re-runs it in the search.
      let recents = [];
      try { const a = JSON.parse(localStorage.getItem("wire.recentSearches") || "[]"); if (Array.isArray(a)) recents = a.filter((q) => typeof q === "string").slice(0, 8); } catch { /* */ }
      p.querySelector(".na-body").innerHTML =
        `<button type="button" class="na-menu-row na-menu-search" data-open-search>${ICO_SEARCH}<span>Search everything…</span></button>`
        + (recents.length
          ? `<div class="na-menu-recent-h">Recent searches</div>`
            + recents.map((q) => `<button type="button" class="na-menu-row na-recent-row" data-q="${esc(q)}">${ICO_SEARCH}<span>${esc(q)}</span></button>`).join("")
          : "")
        + `<div class="na-menu-foot"><div class="na-menu-foot-l">`
        + acctHtml
        + (stat && stat.textContent.trim() ? `<div class="na-menu-row na-menu-stat">${esc(stat.textContent.trim())}</div>` : "")
        + `</div><button type="button" class="na-menu-push" id="na-push" title="Push notifications">${ICO_BELL}<span class="na-push-state">…</span></button></div>`;
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
    // Keep the service worker registered/updated on every visit where one
    // already exists (so sw.js changes ship without a Menu visit).
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration("/").then((reg) => { if (reg) navigator.serviceWorker.register("/sw.js").catch(() => {}); }).catch(() => {});
    }
    // Tapping a recent search re-opens the page's search overlay seeded with it.
    menuPanel.addEventListener("click", (e) => {
      const r = e.target.closest(".na-recent-row");
      if (r) document.dispatchEvent(new CustomEvent("wire:search", { detail: { q: r.dataset.q || "" } }));
    });

    const notifBtn = wrap.querySelector("#na-notif");
    const clearBadge = () => { const b = notifBtn.querySelector(".na-badge"); if (b) b.hidden = true; };
    const renderNotif = (body) => {
      const items = _notifItems || [];
      body.innerHTML = items.length ? items.map(notifRow).join("") : '<div class="na-empty">Nothing yet.</div>';
      if (items.length) { markNotifSeen(items); clearBadge(); }
    };

    const panels = [
      { btn: wrap.querySelector("#na-mkt"), panel: mktPanel, onOpen: (p) => { if (!_mktLoaded) { _mktLoaded = true; loadMarkets(p.querySelector(".na-body")); } } },
      { btn: wrap.querySelector("#na-saved"), panel: savedPanel, onOpen: (p) => { loadSaved(p.querySelector(".na-body"), p.querySelector(".na-h-n")); } },
      { btn: notifBtn, panel: notifPanel, onOpen: (p) => { const body = p.querySelector(".na-body"); if (_notifItems) renderNotif(body); else { body.innerHTML = '<div class="na-load">Loading…</div>'; ensureNotifs().then(() => renderNotif(body)).catch(() => { body.innerHTML = '<div class="na-load">Notifications unavailable right now.</div>'; }); } } },
    ];
    // The Menu opens from the bottom tab bar's Menu button (phones); it joins the
    // same controller so it swaps cleanly with the other three panels.
    const menuBtn = document.querySelector("[data-open-menu]");
    const menuRec = menuBtn ? { btn: menuBtn, panel: menuPanel, onOpen: fillMenu } : null;
    if (menuRec) panels.push(menuRec);

    const anyOpen = () => panels.some((x) => !x.panel.hidden);
    const closeAll = () => {
      panels.forEach((x) => { x.panel.hidden = true; x.btn.setAttribute("aria-expanded", "false"); });
      const tb = document.querySelector(".mobile-tabbar"); if (tb) tb.classList.remove("menu-open");
      lockBody(false); scrimOff();
    };
    const openPanel = (rec) => {
      panels.forEach((x) => { if (x !== rec) { x.panel.hidden = true; x.btn.setAttribute("aria-expanded", "false"); } });
      rec.panel.hidden = false;
      rec.btn.setAttribute("aria-expanded", "true");
      rec.onOpen(rec.panel);
      // Exactly ONE orange tab line at a time: while the Menu panel is open its
      // tab carries the line and the current page tab's yields (CSS .menu-open).
      const tb = document.querySelector(".mobile-tabbar");
      if (tb) tb.classList.toggle("menu-open", !!(rec.btn && rec.btn.hasAttribute("data-open-menu")));
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

    // The Menu tab sits BESIDE real navigation links in the bottom bar. iOS
    // hit-tests the tap's synthetic click AFTER our handler has closed the
    // panel — and the close (scroll restore → Safari toolbar shift) can move
    // the tab bar, landing that late click on a NEIGHBOURING tab link and
    // navigating away. Handle the Menu tap on touchend and consume the touch
    // (preventDefault stops the click from ever being synthesised).
    if (menuRec) {
      let mtX = 0, mtY = 0, menuTapAt = 0;
      menuBtn.addEventListener("touchstart", (e) => { const t = e.touches[0]; mtX = t.clientX; mtY = t.clientY; }, { passive: true });
      menuBtn.addEventListener("touchend", (e) => {
        const t = e.changedTouches && e.changedTouches[0];
        if (t && Math.hypot(t.clientX - mtX, t.clientY - mtY) > 12) return; // a drag, not a tap
        menuTapAt = Date.now();
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        if (menuRec.panel.hidden) openPanel(menuRec); else closeAll();
      }, { passive: false });
      // Belt and braces: whatever iOS does with the tap's synthetic click
      // (hit-test drift can land it on a NEIGHBOURING tab link and navigate),
      // no tab-bar LINK may accept a click in the wake of a Menu tap.
      document.addEventListener("click", (e) => {
        if (Date.now() - menuTapAt < 600 && e.target.closest(".mobile-tabbar a")) {
          e.preventDefault(); e.stopPropagation();
        }
      }, true);
    }

    // Tab-link interlock: on touch devices a tab-bar LINK only navigates when
    // the touch that produced the click actually STARTED on that link. A
    // synthetic click that drifted onto a link (from a tap on the Menu button
    // or anywhere else) began its touch elsewhere — discard it. Pure mouse
    // clicks (no recent touch) pass untouched.
    {
      let touchLink = null, lastTouchAt = 0;
      document.addEventListener("touchstart", (e) => {
        lastTouchAt = Date.now();
        touchLink = e.target.closest ? e.target.closest(".mobile-tabbar a") : null;
      }, { passive: true, capture: true });
      document.addEventListener("click", (e) => {
        const a = e.target.closest && e.target.closest(".mobile-tabbar a");
        if (!a) return;
        if (Date.now() - lastTouchAt < 1500 && touchLink !== a) {
          e.preventDefault(); e.stopPropagation();
        }
      }, true);
    }

    document.addEventListener("click", (e) => {
      if (!anyOpen()) return;
      if (e.target.closest(".na-panel") || e.target.closest(".na-actions")) return;
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
  if (document.readyState !== "loading") run(); else document.addEventListener("DOMContentLoaded", run);
}
