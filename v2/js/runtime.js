// =============================================================================
// runtime.js — the Wire single-page runtime (v2).
//
// ONE of these loads for the whole app. It owns:
//   • the router (History API; switches are an instant, constant-time show/hide —
//     NOT a view transition, whose snapshot capture of a heavy view is slow and
//     variable on iOS)
//   • the shared chrome (header + bottom tab bar), initialised ONCE
//   • an in-memory data cache (each dataset/API loaded once per session)
//   • view lifecycles (each tab is a lazy-loaded module, mounted once and then
//     kept alive — revisiting a tab shows its already-rendered DOM instantly,
//     with no re-render)
//
// This is the structural fix for the tab-change lag: there is no per-tab
// document, no bundle re-fetch, no re-parse of huge data on every switch. The
// first visit to a tab pays to load it; every visit after is a display toggle.
// =============================================================================

const BASE = "/v2";

// Cache-busting is Vite's job now: every module in the v2 chain is content-hashed
// at build (`npm run build`), so a changed module ships a new `/assets/*-[hash]`
// URL automatically — no runtime ?v= token to stamp, no vurl() helper. Imports are
// plain, statically-analysable specifiers so Rollup can trace and split the graph.

// The top-level tabs. `load` is a lazy import → the view's code (and, later, its
// heavy data) is fetched only when the tab is first opened, then cached by the
// browser's module map for the session (no nonce, so revisits never re-fetch).
const ROUTES = [
  { key: "home",   title: "Wire",        load: () => import("./views/home.js") },
  { key: "dashboard", title: "Wire Dashboard", load: () => import("./views/dashboard.js") },
  // The Credit / Legal / Macro DESKS are retired as destinations (News → Home, Data →
  // Dashboard, Entities → Profiles) — their URLs redirect (see LEGACY_REDIRECTS). Macro
  // is gone outright. Credit/Legal stay REGISTERED here (not as user destinations) only
  // because Profiles borrows their list/detail builders via ctx.view(); mountView()
  // bypasses the redirect, so the borrow keeps working while /v2/credit|legal redirect.
  { key: "credit", title: "Wire Credit", load: () => import("./views/credit.js") },
  { key: "legal",  title: "Wire Legal",  load: () => import("./views/legal.js") },
  { key: "profiles", title: "Wire Profiles", load: () => import("./views/profiles.js") },
  { key: "transactions", title: "Wire Transactions", load: () => import("./views/transactions.js") },
  { key: "menu",   title: "Wire Menu",   load: () => import("./views/menu.js") },
];
// Retired desk roots → their new home, so a typed URL, an old bookmark, or a stray
// in-app link lands sensibly instead of falling back to Home. Each target is a function
// of the incoming URL: Macro → the Dashboard macro section (hash dropped — its deep-dive
// hashes are gone); Credit/Legal → Profiles, PRESERVING the entity hash (#/manager/…,
// #/item/…, #/firm/…) since Profiles now owns those detail pages.
const LEGACY_REDIRECTS = [
  [/^\/v2\/macro(\/|$)/, () => "/v2/dashboard/rates"],
  [/^\/v2\/credit(\/|$)/, (u) => "/v2/profiles/" + (u.hash || "")],
  [/^\/v2\/legal(\/|$)/, (u) => "/v2/profiles/" + (u.hash || "")],
];
const ROUTE_BY_KEY = Object.fromEntries(ROUTES.map((r) => [r.key, r]));

// ---- URL <-> tab -----------------------------------------------------------
// /v2/ → home ; /v2/macro/… → macro ; etc. Everything after the tab segment is
// the sub-route (a view's own detail routing), handed to the view on enter.
function tabPath(key) { return key === "home" ? BASE + "/" : BASE + "/" + key + "/"; }
function parse(pathname) {
  let p = pathname;
  if (p.startsWith(BASE)) p = p.slice(BASE.length);
  p = p.replace(/^\/+/, "");                       // "macro/fund/x" | ""
  const seg = p.split("/");
  const key = ROUTE_BY_KEY[seg[0]] ? seg[0] : "home";
  const sub = key === "home" ? seg.slice(0).filter(Boolean) : seg.slice(1);
  return { key, sub };                             // sub = ["fund","x"] etc.
}

// ---- In-memory data cache --------------------------------------------------
// getData("macro", () => fetch(...).then(r=>r.json())) resolves once, then hands
// back the SAME promise forever — so a dataset (incl. the heavy ones) is fetched
// and parsed a single time per session, not on every visit.
const _data = new Map();
function getData(key, loader) {
  if (!_data.has(key)) _data.set(key, Promise.resolve().then(loader).catch((e) => { _data.delete(key); throw e; }));
  return _data.get(key);
}

// ---- View instances (keep-alive) -------------------------------------------
// One section per visited tab, cached. Mounted once; shown/hidden on nav.
const _views = new Map();      // key -> { section, mod, ctrl, cssLoaded }
let _active = null;            // currently-shown key
let _busy = false;

const appEl = () => document.getElementById("app");

function ctxFor() {
  return {
    base: BASE,
    data: getData,
    navigate: (path) => navigate(path, { push: true }),
    tabPath,
    // Mount another view (off-screen if not current) and hand back its control
    // object — used by Profiles to borrow Credit's / Legal's list builders so it
    // renders their EXACT panes rather than a second copy.
    view: (key) => mountView(key).then((rec) => rec.ctrl),
  };
}

// Ensure a view is loaded + mounted (once). Returns its record.
const SKELETON = '<div class="v2-loading" aria-hidden="true"><div class="v2-spin"></div></div>';

// The section SHELL — created instantly, no module load. This is what lets a
// switch paint immediately (a skeleton) instead of waiting on a heavy module.
function getShell(key) {
  let rec = _views.get(key);
  if (rec) return rec;
  const section = document.createElement("section");
  section.className = "v2-view";
  section.dataset.view = key;
  section.hidden = true;
  section.innerHTML = SKELETON;
  appEl().appendChild(section);
  rec = { section, mod: null, ctrl: null, mounted: false, loading: null };
  _views.set(key, rec);
  return rec;
}

// Load the view's module and mount it into its section — the heavy part (this is
// where a big data module parses). Idempotent; concurrent callers share one load.
// Runs OFF the transition, so it never blanks a switch. NOTE: view CSS is NOT
// loaded here — every view's stylesheet is declared up front in v2/index.html, so
// it is already applied before any content mounts. That removes the whole class
// of "content mounts, then its CSS arrives and it reformats" flashes on a tab
// switch, and keeps this path to just: import module → mount.
function mountView(key) {
  const rec = getShell(key);
  if (rec.mounted) return Promise.resolve(rec);
  if (rec.loading) return rec.loading;
  rec.loading = (async () => {
    const mod = await ROUTE_BY_KEY[key].load();
    rec.mod = mod;
    rec.ctrl = (mod.mount ? await mod.mount(rec.section, ctxFor()) : null) || {};
    rec.mounted = true;
    return rec;
  })();
  return rec.loading;
}


// ---- Navigation ------------------------------------------------------------
// Touch surfaces (the iPhone PWA is the primary one): NEVER stack history — every
// navigation REPLACES the entry. iOS's edge-swipe "back" gesture walks browser
// history, so with no per-page entries there is nothing to swipe through, which
// removes swipe-to-change-page. Navigation on touch is via the bottom tab bar and
// in-view controls only. Desktop keeps pushState so its Back button still steps
// through pages. Computed once — device class doesn't change within a session.
const TOUCH = (typeof navigator !== "undefined" && (navigator.maxTouchPoints || 0) > 0)
  || (typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches);
let _pending = null;                               // latest tap requested mid-swap
// Per-TAB memory, so moving between sections never loses your place:
//   _lastUrl — the URL a tab was showing when you left it (a bottom-tab tap returns
//              there, not to the tab root; only re-tapping the ACTIVE tab resets it);
//   _scrollY — where that tab was scrolled (window on phone, the view section on the
//              fixed-viewport desktop), restored on return and on Back.
const _lastUrl = new Map();
const _scrollY = new Map();
let _activeTab = null;
let _curUrl = "";
const curUrl = () => location.pathname + location.search + location.hash;
const scrollEl = (rec) => { const s = rec && rec.section; return (s && s.scrollHeight > s.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(s).overflowY)) ? s : null; };
const getY = (rec) => { const s = scrollEl(rec); return s ? s.scrollTop : window.scrollY; };
const setY = (rec, y) => { const s = scrollEl(rec); if (s) s.scrollTo({ top: y, behavior: "instant" }); else window.scrollTo({ top: y, behavior: "instant" }); };
// Remember the outgoing tab's URL + scroll (called before any section swap).
function rememberActive(url) {
  if (!_activeTab || !_views.has(_active)) return;
  _lastUrl.set(_activeTab, url || _curUrl);
  _scrollY.set(_activeTab, getY(_views.get(_active)));
}
async function navigate(path, { push = true, replace = false, home = false, tabTap = false, fromPop = false } = {}) {
  const url = new URL(path, location.origin);
  // Retired desk roots → their new home (replace, so no dead history entry).
  for (const [re, to] of LEGACY_REDIRECTS) {
    if (re.test(url.pathname)) return navigate(to(url), { replace: true, home });
  }
  const { key, sub } = parse(url.pathname);
  // "news" is a bottom-tab that shares the HOME view (so the feed engine isn't
  // double-mounted): /v2/news/ parses to the home view with sub=["news"]. The TAB
  // identity (home vs news) drives the chrome highlight + the [data-v2tab] flag +
  // which mode method the view runs; the VIEW key ("home") drives the section swap.
  const tab = (key === "home" && sub[0] === "news") ? "news" : key;
  const same = key === _active;

  // A tap arriving mid-swap (a heavy view can hold the transition briefly) must
  // not be dropped — remember the LATEST request and run it when the swap ends,
  // so fast tab-mashing always lands on the last tab pressed.
  if (_busy && !same) { _pending = [path, { push, replace, home, tabTap, fromPop }]; return; }

  // Remember where the outgoing tab was BEFORE the URL changes (a popstate has
  // already moved the URL, so it hands over the pre-pop URL it captured).
  if (!same) rememberActive(fromPop ? _curUrl : curUrl());
  // Update the URL first so the view (and chrome) read the right location.
  // History: a drill-down (a link, a search result, a row → profile) is ALWAYS a new
  // entry — on iPhone too — so Back / the edge-swipe returns to the exact previous
  // view. Only bottom-tab taps on touch REPLACE the entry, so the edge-swipe never
  // pages between top-level tabs (the R34 iPhone tab model).
  const target = url.pathname + url.search + url.hash;
  if (!fromPop && target !== curUrl()) {
    if (replace || (TOUCH && tabTap)) history.replaceState({ v2: true }, "", target);
    else if (push) history.pushState({ v2: true }, "", target);
  }
  _curUrl = curUrl();

  // Same tab: a nav-bar tap (home) resets the section to its first part; any other
  // same-tab move is a sub-route the view handles in place (no swap).
  if (same) {
    const r = _views.get(key);
    if (r && r.mounted && r.ctrl) {
      if (tab === "news" && r.ctrl.showNews) r.ctrl.showNews();
      else if (home && r.ctrl.home) r.ctrl.home();
      else if (r.ctrl.enter) r.ctrl.enter(sub);
    }
    document.documentElement.dataset.v2tab = tab;   // keep the flag in sync on a same-view tab (home↔news)
    _activeTab = tab;
    setChromeActive(tab); return;
  }
  _busy = true;

  // INSTANT, CONSTANT-TIME swap. Deliberately NOT a view transition: capturing a
  // snapshot of a heavy outgoing view (Home/Legal) on iOS is slow AND variable —
  // that was the "sometimes quick, sometimes not". A plain show/hide is the same
  // few milliseconds every time. A kept-alive view shows its PRESERVED DOM (no
  // re-render → no flash, no variable cost); a first-visit shows a skeleton while
  // its module loads.
  const rec = getShell(key);
  if (_active && _views.has(_active)) {
    const prev = _views.get(_active);
    prev.mounted && prev.ctrl.leave && prev.ctrl.leave();
    prev.section.hidden = true;
  }
  rec.section.hidden = false;
  rec.section.classList.remove("v2-fade"); void rec.section.offsetWidth; rec.section.classList.add("v2-fade");
  document.documentElement.dataset.v2tab = tab;    // active-tab flag before any enter()
  _active = key;
  const prevUrlOfTab = _lastUrl.get(tab);
  _activeTab = tab;
  document.title = ROUTE_BY_KEY[key].title;
  setChromeActive(tab);
  // Restore where this tab was scrolled (0 on a first visit / a reset). A view's own
  // router may override it right after (a fresh profile opens at its top).
  setY(rec, home ? 0 : (_scrollY.get(tab) || 0));
  _busy = false;
  if (_pending) { const [p, o] = _pending; _pending = null; navigate(p, o); return; }

  // First visit → load + mount now (the skeleton is already on screen; its
  // spinner animates on the compositor, so it keeps moving even while a big data
  // module parses on the main thread). mount() renders the initial view itself
  // (ported apps via their boot, reading location.hash for deep links; the Menu
  // renders in its mount too), so nothing more is needed here. A kept-alive
  // revisit does NOTHING — its preserved DOM is already showing, which is what
  // makes revisits instant and flicker-free.
  if (!rec.mounted) {
    try { await mountView(key); }
    catch { if (_active === key) rec.section.innerHTML = '<div class="v2-loading">Could not load this view.</div>'; }
    // First visit to Home via the News tab: mount() rendered the Home default
    // (Briefing); flip it to news mode now.
    if (tab === "news" && rec.mounted && rec.ctrl && rec.ctrl.showNews) rec.ctrl.showNews();
  } else if (tab === "news" && rec.ctrl && rec.ctrl.showNews) {
    // A kept-alive Home shown via the News tab → news mode.
    rec.ctrl.showNews();
  } else if (home && rec.ctrl && rec.ctrl.home) {
    // A nav-bar tap onto a kept-alive view resets it to its first part (so, e.g.,
    // tapping Home from the X wire lands on the news wire, not the preserved tab).
    rec.ctrl.home();
  } else if (rec.ctrl && rec.ctrl.enter && (url.search + url.hash) !== ((prevUrlOfTab || "").replace(/^[^?#]*/, ""))) {
    // An ALREADY-mounted view is shown at a DIFFERENT sub-route from the one it was
    // left on (a cross-tab deep link, or Back to an earlier state): re-run the view's
    // router so it lands on that route instead of its preserved DOM. Returning to the
    // exact route it was left on skips this — the keep-alive fast path keeps the DOM
    // (and its scroll) as the reader left it.
    rec.ctrl.enter(sub);
  }
  // NOTE: no background pre-mounting. It was tried and removed — parsing a heavy
  // data module in the background blocks the main thread and can lag the very
  // next tap. Keep-alive already makes every REVISIT instant, and the
  // instant-skeleton above makes every FIRST visit paint immediately, so a
  // preload only adds contention for no perceived win.
}

let _setActive = () => {};
function setChromeActive(key) { _setActive(key); }
// In-app history depth — see "Back depth" in boot(). Mirrored onto <html
// data-can-back> so the chrome's header Back button shows only when it has
// somewhere in the app to go.
let _depth = 0;
function setBackDepth(d) { document.documentElement.toggleAttribute("data-can-back", d > 0); }

function onPop() {
  const { key, sub } = parse(location.pathname);
  // Tab changed → swap views. Same tab (a hash-only history move) → leave it to
  // the active view's own hash router; re-entering here would double-render.
  const tab = (key === "home" && sub[0] === "news") ? "news" : key;
  if (key !== _active || tab !== _activeTab) {
    // navigate() records the outgoing tab from _curUrl — still the URL we popped
    // AWAY from — before swapping, so a later tab tap can return to it.
    navigate(curUrl(), { push: false, fromPop: true });
  } else {
    _curUrl = curUrl();
  }
}

// In-app links: any same-origin <a href="/v2/…"> (a search result, a notification, a
// reader entity link, a manager-wire name) routes through the runtime instead of
// reloading the whole document. Runs in the BUBBLE phase so a view that handles its
// own anchors (and calls preventDefault) keeps precedence; new-tab / modified clicks
// and target=_blank links keep native behaviour.
function onLinkClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
  if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
  const href = a.getAttribute("href") || "";
  if (!href.startsWith("/")) return;
  const u = new URL(href, location.origin);
  if (u.origin !== location.origin || !(u.pathname === BASE || u.pathname.startsWith(BASE + "/"))) return;
  e.preventDefault();
  navigate(u.pathname + u.search + u.hash, { push: true });
}

// ---- Boot ------------------------------------------------------------------
async function boot() {
  // Real-user performance beacon — fire-and-forget, off the critical path, so it
  // never delays chrome/first view. Measures load on actual devices (see vitals.js).
  import("./vitals.js").then((m) => m.initVitals && m.initVitals()).catch(() => {});
  const { initChrome } = await import("./chrome.js");
  // Bottom-tab / header tab tap: re-tapping the ACTIVE tab resets that section to its
  // first part (nav-reset); tapping a DIFFERENT tab returns to wherever you left it.
  _setActive = initChrome({ onTab: (key) => {
    // Home and News share one view: switching between those two keeps the old
    // behaviour (Home → its Briefing default; News → news mode).
    if (key === _activeTab || (key === "home" && _activeTab === "news")) return navigate(tabPath(key), { push: true, home: true, tabTap: true });
    return navigate(_lastUrl.get(key) || tabPath(key), { push: true, tabTap: true });
  } });
  try { history.scrollRestoration = "manual"; } catch { /* older engines */ }
  // Back depth (R35f): every in-app history entry carries `wdepth` — 0 for the entry
  // the app booted on, +1 per pushed entry (a link, a row, a `location.hash =` drill
  // down). A REPLACE keeps the depth. The chrome's header Back button shows whenever
  // depth > 0, so after any internal link there is always a visible way back — the
  // iPhone home-screen app has no browser Back button of its own.
  const origReplace = history.replaceState.bind(history);
  const withDepth = (s, d) => Object.assign({}, (s && typeof s === "object") ? s : null, { wdepth: d });
  const syncDepth = () => {
    const s = history.state;
    if (s && typeof s.wdepth === "number") _depth = s.wdepth;
    else { _depth += 1; try { origReplace(withDepth(s, _depth), ""); } catch { /* keep */ } }   // a new hash entry
    setBackDepth(_depth);
  };
  window.addEventListener("popstate", syncDepth);
  window.addEventListener("hashchange", syncDepth);
  window.addEventListener("popstate", onPop);
  window.addEventListener("hashchange", () => { _curUrl = curUrl(); });
  // Views also rewrite their URL in place (a profile's sub-tab, a dropped ?focus=,
  // a Transactions filter) — keep the "current URL" in step so Back across tabs
  // returns to that exact state.
  for (const fn of ["replaceState", "pushState"]) {
    const orig = history[fn].bind(history);
    history[fn] = (s, ...a) => {
      const d = fn === "pushState" ? _depth + 1 : _depth;
      const r = orig(withDepth(s, d), ...a); _depth = d; setBackDepth(d); _curUrl = curUrl(); return r;
    };
  }
  { const s = history.state; _depth = (s && typeof s.wdepth === "number") ? s.wdepth : 0; origReplace(withDepth(s, _depth), ""); setBackDepth(_depth); }
  document.addEventListener("click", onLinkClick);
  // Non-anchor callers (the search palette) route through the same in-app path.
  window.__wireNavigate = (path) => navigate(path, { push: true });
  await navigate(location.pathname + location.search + location.hash, { push: false, replace: true });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
