// =============================================================================
// Shared row options menu — press-and-hold (touch) / right-click (desktop) on
// any story row, on EVERY page: the Home wire (.g-feed-row, which carries
// data-sk/-sid/-mgr/-firm) and the app wires/minis (.tw-row / .tmini-row /
// .tui-li, resolved generically from the row's own DOM). Actions: Save/Remove
// Bookmark, Add/Remove Watchlist (manager & law-firm rows), Show all from
// <source>, Share, Cancel. Mounted once per page by nav-actions.js.
// =============================================================================
import { esc } from "/util.js?v=20260719-1";

const ROW_SEL = ".g-feed-row, .tw-row, .tmini-row, .tui-li, .ew-row";
// Resolve a row into a descriptor the actions understand.
function resolveRow(r) {
  if (r.classList.contains("ew-row")) {
    // Earnings-wall row (Macro dashboard): the menu offers the panel's source
    // list — read from the .ew-srcs links rendered in the same panel body.
    const srcs = [...(r.closest(".ew-body") || r.parentElement).querySelectorAll(".ew-srcs a")]
      .map((a) => ({ name: a.textContent.trim(), url: a.getAttribute("href") || "" }))
      .filter((s) => /^https?:\/\//i.test(s.url));
    const t = ((r.querySelector(".ew-t") || {}).textContent || "").trim();
    const n = ((r.querySelector(".ew-n") || {}).textContent || "").trim();
    return { kind: "earn", title: t && n ? `${t} — ${n}` : t || n, srcs };
  }
  if (r.classList.contains("g-feed-row")) {
    return {
      sk: r.getAttribute("data-sk") || "x",
      sid: r.getAttribute("data-sid") || "",
      mgr: r.getAttribute("data-mgr") || "",
      firm: r.getAttribute("data-firm") || "",
      desk: r.getAttribute("data-desk") || "m",
      title: ((r.querySelector(".g-feed-title") || {}).textContent || "").trim(),
      href: r.getAttribute("href") || "",
      ext: r.getAttribute("target") === "_blank",
      date: r.getAttribute("data-date") || "",
      time: r.getAttribute("data-time") || "",
      src: ((r.querySelector(".g-feed-src") || {}).textContent || "").trim(),
      srcEl: r.querySelector(".g-feed-src[data-src]"),
    };
  }
  // Generic app row: derive everything from the DOM.
  const head = r.querySelector(".tw-head, .tmini-t, .tui-li-t") || r.querySelector("a");
  const a = head && head.tagName === "A" ? head : (head ? head.querySelector("a") : null) || r.querySelector("a");
  const dateTxt = ((r.querySelector(".tw-date") || {}).textContent || "").trim();
  let iso = "";
  if (dateTxt) { const d = new Date(dateTxt); if (!isNaN(d)) iso = d.toISOString().slice(0, 10); }
  const mgrA = r.querySelector('a[href*="#/manager/"]');
  // firm links appear as profile links (#/firm/<id>) or filter links (?firm=<id>)
  const firmA = r.querySelector('a[href*="#/firm/"], a[href*="firm="]');
  const pick = (el, marker) => { try { return decodeURIComponent(el.getAttribute("href").split(marker)[1].split(/[?/]/)[0]); } catch { return ""; } };
  const path = location.pathname;
  return {
    sk: "x", sid: "",
    mgr: r.getAttribute("data-mgr") || (mgrA ? pick(mgrA, "#/manager/") : ""),
    firm: r.getAttribute("data-firm") || (firmA ? (firmA.getAttribute("href").includes("#/firm/") ? pick(firmA, "#/firm/") : pick(firmA, "firm=")) : ""),
    desk: path.startsWith("/credit") ? "c" : path.startsWith("/legal") ? "l" : "m",
    title: (head ? head.textContent : r.textContent).trim().slice(0, 300),
    href: a ? (a.getAttribute("href") || "") : "",
    ext: a ? a.getAttribute("target") === "_blank" : false,
    date: iso, time: "",
    src: ((r.querySelector(".tw-src") || {}).textContent || "").trim(),
    srcEl: r.querySelector("[data-srcfilter], .src-filter[data-srcfilter]"),
  };
}
// Toggles the story in Bookmarks. Desk items (macro/credit/legal) toggle the
// SAME saved store + API the apps' ☆ stars use, so state matches everywhere;
// rows with no app id (Letters, FT, live RSS headlines) toggle a Home-side
// store ("wire.home.saved") that the shared Saved panel also reads.
const SAVED_LS = { m: "meridian.macro.saved", c: "meridian.credit.saved", l: "lexalert.saved" };
const SAVED_API = { m: "/api/saved-macro", c: "/api/saved-credit", l: "/api/saved" };
function _readSet(k) { try { const a = JSON.parse(localStorage.getItem(k) || "[]"); return new Set(Array.isArray(a) ? a : []); } catch { return new Set(); } }
function _syncSaved(desk) {
  // Merge with the server copy before writing back, so another device's
  // bookmarks are never clobbered by this one's PUT.
  const ls = SAVED_LS[desk], api = SAVED_API[desk];
  fetch(api, { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const server = new Set((d && d.saved) || []);
      const local = _readSet(ls);
      const removedHere = (_unsavedRecently[desk] || new Set());
      server.forEach((id) => { if (!removedHere.has(id)) local.add(id); });
      localStorage.setItem(ls, JSON.stringify([...local]));
      return fetch(api, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ saved: [...local] }) });
    })
    .catch(() => {});
}
const _unsavedRecently = { m: new Set(), c: new Set(), l: new Set() };
// Home-wire snapshots (rows with no app saved-id) sync to their own per-user KV
// store (/api/saved-home) exactly like the desk id-sets above — merge the server
// copy in first (so another device's bookmarks are never clobbered), excluding
// keys removed on THIS device this session, then PUT the merged list back.
const _unsavedHome = new Set();
const _readHome = () => { try { const a = JSON.parse(localStorage.getItem("wire.home.saved") || "[]"); return Array.isArray(a) ? a : []; } catch { return []; } };
function _syncSavedHome() {
  fetch("/api/saved-home", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const local = _readHome();
      const have = new Set(local.map((o) => o && o.k));
      ((d && d.saved) || []).forEach((o) => {
        if (o && o.k && !have.has(o.k) && !_unsavedHome.has(o.k)) { local.push(o); have.add(o.k); }
      });
      try { localStorage.setItem("wire.home.saved", JSON.stringify(local.slice(0, 500))); } catch { /* */ }
      return fetch("/api/saved-home", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ saved: local.slice(0, 500) }) });
    })
    .catch(() => {});
}
function toggleRowBookmark(d) {
  const sk = d.sk;
  const title = d.title;
  let added;
  if (sk === "m" || sk === "c" || sk === "l") {
    const id = d.sid;
    if (!id) return;
    const set = _readSet(SAVED_LS[sk]);
    added = !set.has(id);
    if (added) { set.add(id); _unsavedRecently[sk].delete(id); } else { set.delete(id); _unsavedRecently[sk].add(id); }
    try { localStorage.setItem(SAVED_LS[sk], JSON.stringify([...set])); } catch { /* */ }
    _syncSaved(sk);
  } else {
    // Self-contained row snapshot, keyed on href|title.
    const key = ((d.href || "") + "|" + title).toLowerCase();
    const arr = _readHome();
    const i = arr.findIndex((o) => o && o.k === key);
    added = i < 0;
    if (added) {
      arr.unshift({ k: key, desk: d.desk || "m", title,
        href: d.href || "#", ext: !!d.ext, date: d.date || "", time: d.time || "", src: d.src || "" });
      _unsavedHome.delete(key);
    } else { arr.splice(i, 1); _unsavedHome.add(key); }
    try { localStorage.setItem("wire.home.saved", JSON.stringify(arr.slice(0, 500))); } catch { /* */ }
    _syncSavedHome();
  }
  wireToast(added ? "Saved to Bookmarks" : "Removed from Bookmarks");
}
// Watchlist toggle — the SAME follow store the Credit app's stars use
// ("meridian.follows"), extended with law firms; synced to /api/watchlist.
// The PUT merges with the server copy first: this device's store may be cold
// (user follows from another device / the Credit app) and a bare local PUT
// would wipe those. Removals made here are excluded from the merge-back.
const _unwatched = { manager: new Set(), fund: new Set(), lp: new Set(), firm: new Set() };
function toggleWatch(type, id) {
  let f = {};
  try { f = JSON.parse(localStorage.getItem("meridian.follows") || "{}") || {}; } catch { /* ignore */ }
  if (!Array.isArray(f[type])) f[type] = [];
  const i = f[type].indexOf(id);
  const added = i < 0;
  if (added) { f[type].push(id); _unwatched[type].delete(id); } else { f[type].splice(i, 1); _unwatched[type].add(id); }
  try { localStorage.setItem("meridian.follows", JSON.stringify(f)); } catch { /* ignore */ }
  fetch("/api/watchlist", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const server = (d && d.watchlist) || {};
      let local = {};
      try { local = JSON.parse(localStorage.getItem("meridian.follows") || "{}") || {}; } catch { /* ignore */ }
      const body = {};
      ["manager", "fund", "lp", "firm"].forEach((t) => {
        const merged = new Set(Array.isArray(local[t]) ? local[t] : []);
        (Array.isArray(server[t]) ? server[t] : []).forEach((x) => { if (!_unwatched[t].has(x)) merged.add(x); });
        body[t] = [...merged];
        local[t] = body[t];
      });
      try { localStorage.setItem("meridian.follows", JSON.stringify(local)); } catch { /* ignore */ }
      return fetch("/api/watchlist", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    })
    .catch(() => {});
  return added;
}
function isWatched(type, id) {
  try { const f = JSON.parse(localStorage.getItem("meridian.follows") || "{}") || {}; return Array.isArray(f[type]) && f[type].includes(id); } catch { return false; }
}
// Saved-state probe for the options menu label.
function isRowSaved(d) {
  if (d.sk === "m" || d.sk === "c" || d.sk === "l") {
    return !!d.sid && _readSet(SAVED_LS[d.sk]).has(d.sid);
  }
  const key = ((d.href || "") + "|" + d.title).toLowerCase();
  try { const a = JSON.parse(localStorage.getItem("wire.home.saved") || "[]"); return Array.isArray(a) && a.some((o) => o && o.k === key); } catch { return false; }
}
// The options menu the gesture opens: story title + Save/Remove + Cancel.
// Phone: bottom sheet above the tab bar; desktop: popover at the cursor.
const ICO_BM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
let _rmEl = null, _rmScrim = null;
function closeRowMenu() { if (_rmEl) { _rmEl.remove(); _rmEl = null; } if (_rmScrim) { _rmScrim.remove(); _rmScrim = null; } }
function openRowMenu(r, x, y) {
  closeRowMenu();
  const d = resolveRow(r);
  _rmScrim = document.createElement("div"); _rmScrim.className = "rowmenu-scrim";
  _rmScrim.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); closeRowMenu(); });
  document.body.appendChild(_rmScrim);
  // Earnings-wall rows: a compact sources menu (name → opens the source URL).
  if (d.kind === "earn") {
    const ICO_GO2 = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
    _rmEl = document.createElement("div"); _rmEl.className = "rowmenu"; _rmEl.setAttribute("role", "menu");
    _rmEl.innerHTML = `<div class="rowmenu-title">${esc(d.title)}</div>`
      + `<div class="rowmenu-sub">Sources</div>`
      + d.srcs.map((s, i) => `<button type="button" class="rowmenu-act" data-act="esrc" data-i="${i}">${ICO_GO2}<span>${esc(s.name)}</span></button>`).join("")
      + `<button type="button" class="rowmenu-act rowmenu-cancel" data-act="cancel"><span>Cancel</span></button>`;
    _rmEl.addEventListener("click", (e) => {
      const b = e.target.closest(".rowmenu-act"); if (!b) return;
      const i = +b.dataset.i;
      closeRowMenu();
      if (b.dataset.act === "esrc" && d.srcs[i]) window.open(d.srcs[i].url, "_blank", "noopener");
    });
    document.body.appendChild(_rmEl);
    if (!matchMedia("(max-width:760px)").matches) {
      const rect = _rmEl.getBoundingClientRect();
      _rmEl.style.left = Math.max(8, Math.min(x || 0, innerWidth - rect.width - 8)) + "px";
      _rmEl.style.top = Math.max(8, Math.min(y || 0, innerHeight - rect.height - 8)) + "px";
    }
    return;
  }
  const saved = isRowSaved(d);
  const title = d.title;
  const srcName = d.src || "";
  const mgr = d.mgr, firm = d.firm, href = d.href;
  const canShare = /^https?:\/\//i.test(href) && (!!navigator.share || !!(navigator.clipboard && navigator.clipboard.writeText));
  const ICO_SRC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>';
  const ICO_GO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
  const ICO_STAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2-5.6-3.1-5.6 3.1 1.2-6.2L3 9.5l6.3-.8z"/></svg>';
  const ICO_SHARE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M5 12v7h14v-7"/></svg>';
  _rmEl = document.createElement("div"); _rmEl.className = "rowmenu"; _rmEl.setAttribute("role", "menu");
  _rmEl.innerHTML = `<div class="rowmenu-title">${esc(title)}</div>`
    + `<button type="button" class="rowmenu-act" data-act="save">${ICO_BM}<span>${saved ? "Remove from Bookmarks" : "Save to Bookmarks"}</span></button>`
    + (mgr || firm ? `<button type="button" class="rowmenu-act" data-act="watch">${ICO_STAR}<span>${(mgr ? isWatched("manager", mgr) : isWatched("firm", firm)) ? "Remove from Watchlist" : "Add to Watchlist"}</span></button>` : "")
    + (srcName && d.srcEl ? `<button type="button" class="rowmenu-act" data-act="src">${ICO_SRC}<span>Show all from ${esc(srcName)}</span></button>` : "")
    + (mgr ? `<button type="button" class="rowmenu-act" data-act="mgr">${ICO_GO}<span>Open manager page</span></button>` : "")
    + (firm ? `<button type="button" class="rowmenu-act" data-act="firm">${ICO_GO}<span>Open firm page</span></button>` : "")
    + (canShare ? `<button type="button" class="rowmenu-act" data-act="share">${ICO_SHARE}<span>Share</span></button>` : "")
    + `<button type="button" class="rowmenu-act rowmenu-cancel" data-act="cancel"><span>Cancel</span></button>`;
  _rmEl.addEventListener("click", (e) => {
    const b = e.target.closest(".rowmenu-act"); if (!b) return;
    const act = b.dataset.act;
    closeRowMenu();
    if (act === "save") toggleRowBookmark(d);
    else if (act === "watch") {
      const added = mgr ? toggleWatch("manager", mgr) : toggleWatch("firm", firm);
      wireToast(added ? "Added to Watchlist" : "Removed from Watchlist");
    }
    else if (act === "src") { if (d.srcEl) d.srcEl.click(); }
    else if (act === "mgr") { window.location.href = "/credit/#/manager/" + encodeURIComponent(mgr); }
    else if (act === "firm") { window.location.href = "/legal/#/firm/" + encodeURIComponent(firm); }
    else if (act === "share") {
      if (navigator.share) navigator.share({ title, url: href }).catch(() => {});
      else navigator.clipboard.writeText(href).then(() => wireToast("Link copied")).catch(() => {});
    }
  });
  document.body.appendChild(_rmEl);
  if (!matchMedia("(max-width:760px)").matches) {
    const rect = _rmEl.getBoundingClientRect();
    _rmEl.style.left = Math.max(8, Math.min(x || 0, innerWidth - rect.width - 8)) + "px";
    _rmEl.style.top = Math.max(8, Math.min(y || 0, innerHeight - rect.height - 8)) + "px";
  }
}
let _toastEl = null, _toastT = null;
function wireToast(msg) {
  if (!_toastEl) { _toastEl = document.createElement("div"); _toastEl.className = "wire-toast"; document.body.appendChild(_toastEl); }
  _toastEl.textContent = msg;
  _toastEl.classList.add("on");
  clearTimeout(_toastT); _toastT = setTimeout(() => _toastEl.classList.remove("on"), 1600);
}
let _mounted = false;
export function initRowMenu() {
  if (_mounted) return; _mounted = true;
  let timer = null, sx = 0, sy = 0, fired = false;
  const findRow = (el) => (el && el.closest ? el.closest(ROW_SEL) : null);
  const cancel = () => { if (timer) { clearTimeout(timer); timer = null; } };
  document.addEventListener("touchstart", (e) => {
    const r = findRow(e.target); if (!r || e.touches.length !== 1) return;
    fired = false; sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    timer = setTimeout(() => { timer = null; fired = true; openRowMenu(r); if (navigator.vibrate) navigator.vibrate(10); }, 550);
  }, { passive: true });
  document.addEventListener("touchmove", (e) => {
    if (!timer) return;
    const t = e.touches[0];
    if (Math.abs(t.clientX - sx) > 10 || Math.abs(t.clientY - sy) > 10) cancel();
  }, { passive: true });
  // The eaten-click guard must only cover the GHOST click of the long-press
  // release itself (arrives within ~50ms of touchend when the browser emits one
  // at all — iOS often doesn't). Disarm shortly after the finger lifts so the
  // user's NEXT tap (e.g. on the scrim to dismiss) is never swallowed.
  let fireReset = null;
  const endPress = () => { cancel(); if (fired) { clearTimeout(fireReset); fireReset = setTimeout(() => { fired = false; }, 350); } };
  document.addEventListener("touchend", endPress, { passive: true });
  document.addEventListener("touchcancel", endPress, { passive: true });
  document.addEventListener("click", (e) => {
    if (fired) { e.preventDefault(); e.stopPropagation(); fired = false; clearTimeout(fireReset); }
  }, true);
  // Desktop: right-click opens the options menu instead of the browser one.
  document.addEventListener("contextmenu", (e) => {
    const r = findRow(e.target); if (!r) return;
    e.preventDefault(); openRowMenu(r, e.clientX, e.clientY);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeRowMenu(); });
}

