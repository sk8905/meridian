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

// ONE build version for the whole v2 module chain. It's the ?v= the shell puts
// on runtime.js; runtime reads it from its own URL and stamps it onto every v2
// module it (transitively) loads — views, chrome, nav-actions, the ported apps.
// So a v2 change needs ONE token bump (runtime.js in v2/index.html) instead of
// hand-bumping each link in the import chain. (Per-view CSS, detail.js and the
// shared/data modules keep their own tokens — they change on their own cadence.)
const V = (() => { try { return new URL(import.meta.url).searchParams.get("v") || ""; } catch { return ""; } })();
export const vurl = (p) => p + (p.includes("?") ? "&" : "?") + "v=" + V;

// The top-level tabs. `load` is a lazy import → the view's code (and, later, its
// heavy data) is fetched only when the tab is first opened, then cached by the
// browser's module map for the session (no nonce, so revisits never re-fetch).
const ROUTES = [
  { key: "home",   title: "Wire",        load: () => import(vurl("./views/home.js")) },
  { key: "macro",  title: "Wire Macro",  load: () => import(vurl("./views/macro.js")) },
  { key: "credit", title: "Wire Credit", load: () => import(vurl("./views/credit.js")) },
  { key: "legal",  title: "Wire Legal",  load: () => import(vurl("./views/legal.js")) },
  { key: "menu",   title: "Wire Menu",   load: () => import(vurl("./views/menu.js")) },
];
const ROUTE_BY_KEY = Object.fromEntries(ROUTES.map((r) => [r.key, r]));

// ---- URL <-> tab -----------------------------------------------------------
// /v2/ → home ; /v2/macro/… → macro ; etc. Everything after the tab segment is
// the sub-route (a view's own detail routing), handed to the view on enter.
export function tabPath(key) { return key === "home" ? BASE + "/" : BASE + "/" + key + "/"; }
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

// Load the view's module (+ css) and mount it into its section — the heavy part
// (this is where a big data module parses). Idempotent; concurrent callers share
// one load. Runs OFF the transition, so it never blanks a switch.
function mountView(key) {
  const rec = getShell(key);
  if (rec.mounted) return Promise.resolve(rec);
  if (rec.loading) return rec.loading;
  rec.loading = (async () => {
    const mod = await ROUTE_BY_KEY[key].load();
    if (mod.css) await Promise.all([].concat(mod.css).map(loadCss));
    rec.mod = mod;
    rec.ctrl = (mod.mount ? await mod.mount(rec.section, ctxFor()) : null) || {};
    rec.mounted = true;
    return rec;
  })();
  return rec.loading;
}

function loadCss(href) {
  return new Promise((res) => {
    // Resolve only once the stylesheet is actually APPLIED, judged by `link.sheet`
    // (null until the sheet has loaded+parsed) — NOT by scanning document.styleSheets,
    // which on Safari lists a still-LOADING sheet, so a concurrent view could resolve
    // early and mount before its rules apply (the intermittent unstyled/mis-formatted
    // flash on tab change). A 3s timeout guards every wait so a mount never hangs.
    const wait = (l) => {
      if (l.sheet) return res();                       // loaded + applied
      l.addEventListener("load", () => res(), { once: true });
      l.addEventListener("error", () => res(), { once: true });
      setTimeout(res, 3000);
    };
    // Our own lazily-inserted <link>, or a globally-declared one (index.html) with
    // the same href — reuse either instead of inserting a duplicate.
    const own = document.querySelector(`link[data-v2css="${href}"]`);
    if (own) return wait(own);
    const global = [...document.querySelectorAll('link[rel="stylesheet"][href]')].find((l) => l.href.endsWith(href));
    if (global) return wait(global);
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = href; l.dataset.v2css = href;
    l.onload = l.onerror = () => res();
    setTimeout(res, 3000);                             // never hang a mount on a slow/404 sheet
    document.head.appendChild(l);
  });
}

// Make the ACTIVE view's stylesheets win. The pre-v2 per-view stylesheets each
// carry a full copy of the shared chrome/feed rules (.topbar-*, .nav-*, .chip,
// .breadcrumb …); in v2 every visited view's CSS stays loaded, so for equal
// specificity the winner is decided by <link> order in the <head>. Without this,
// the shared header + any shared-class element restyled to whichever tab was
// loaded LAST — the intermittent "wrong format on page change". Moving the shown
// view's own <link>s (data-v2css, in css-array order) to the end of <head> on
// every activation makes the cascade deterministic: the tab you're looking at
// always wins. Global head sheets (premium/tui/header/app) are untagged and stay
// put. Re-parenting an already-loaded <link> neither re-fetches nor flashes.
function promoteCss(rec) {
  const css = rec && rec.mod && rec.mod.css;
  if (!css) return;
  for (const href of [].concat(css)) {
    // href is our own token URL — no " or \ to escape inside the quoted selector.
    const l = document.querySelector(`link[data-v2css="${href}"]`);
    if (l) document.head.appendChild(l);
  }
}

// ---- Navigation ------------------------------------------------------------
let _pending = null;                               // latest tap requested mid-swap
export async function navigate(path, { push = true, replace = false } = {}) {
  const url = new URL(path, location.origin);
  const { key, sub } = parse(url.pathname);
  const same = key === _active;

  // A tap arriving mid-swap (a heavy view can hold the transition briefly) must
  // not be dropped — remember the LATEST request and run it when the swap ends,
  // so fast tab-mashing always lands on the last tab pressed.
  if (_busy && !same) { _pending = [path, { push, replace }]; return; }

  // Update the URL first so the view (and chrome) read the right location.
  if (!same || url.pathname !== location.pathname) {
    if (replace) history.replaceState({ v2: true }, "", url.pathname + url.search + url.hash);
    else if (push) history.pushState({ v2: true }, "", url.pathname + url.search + url.hash);
  }

  // Same tab, different sub-route → let the view handle it in place (no swap).
  if (same) { const r = _views.get(key); r && r.mounted && r.ctrl.enter && r.ctrl.enter(sub); setChromeActive(key); return; }
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
  promoteCss(rec);                                  // active view's CSS wins the cascade (no-op until mounted)
  rec.section.classList.remove("v2-fade"); void rec.section.offsetWidth; rec.section.classList.add("v2-fade");
  document.documentElement.dataset.v2tab = key;    // active-tab flag before any enter()
  _active = key;
  document.title = ROUTE_BY_KEY[key].title;
  setChromeActive(key);
  window.scrollTo(0, 0);
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
    try { await mountView(key); if (_active === key) promoteCss(rec); }  // now css is loaded → promote for real
    catch { if (_active === key) rec.section.innerHTML = '<div class="v2-loading">Could not load this view.</div>'; }
  }
  // NOTE: no background pre-mounting. It was tried and removed — parsing a heavy
  // data module in the background blocks the main thread and can lag the very
  // next tap. Keep-alive already makes every REVISIT instant, and the
  // instant-skeleton above makes every FIRST visit paint immediately, so a
  // preload only adds contention for no perceived win.
}

let _setActive = () => {};
function setChromeActive(key) { _setActive(key); }

function onPop() {
  const { key } = parse(location.pathname);
  // Tab changed → swap views. Same tab (a hash-only history move) → leave it to
  // the active view's own hash router; re-entering here would double-render.
  if (key !== _active) navigate(location.pathname + location.hash, { push: false });
}

// ---- Boot ------------------------------------------------------------------
async function boot() {
  const { initChrome } = await import(vurl("./chrome.js"));
  _setActive = initChrome({ onTab: (key) => navigate(tabPath(key), { push: true }) });
  window.addEventListener("popstate", onPop);
  await navigate(location.pathname + location.search + location.hash, { push: false, replace: true });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
