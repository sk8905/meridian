// =============================================================================
// runtime.js — the Wire single-page runtime (v2).
//
// ONE of these loads for the whole app. It owns:
//   • the router (History API + same-document view transitions)
//   • the shared chrome (header + bottom tab bar), initialised ONCE
//   • an in-memory data cache (each dataset/API loaded once per session)
//   • view lifecycles (each tab is a lazy-loaded module, mounted once and then
//     kept alive — revisiting a tab shows already-rendered DOM, instantly)
//
// This is the structural fix for the tab-change lag: there is no per-tab
// document, no bundle re-fetch, no re-parse of huge data on every switch. The
// first visit to a tab pays to load it; every visit after is a display toggle.
// =============================================================================

const BASE = "/v2";

// The top-level tabs. `load` is a lazy import → the view's code (and, later, its
// heavy data) is fetched only when the tab is first opened, then cached by the
// browser's module map for the session (no nonce, so revisits never re-fetch).
const ROUTES = [
  { key: "home",   title: "Wire",        load: () => import("./views/home.js?v=v2-1") },
  { key: "macro",  title: "Wire Macro",  load: () => import("./views/macro.js?v=v2-1") },
  { key: "credit", title: "Wire Credit", load: () => import("./views/credit.js?v=v2-1") },
  { key: "legal",  title: "Wire Legal",  load: () => import("./views/legal.js?v=v2-1") },
  { key: "menu",   title: "Wire Menu",   load: () => import("./views/menu.js?v=v2-1") },
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
async function ensureView(key) {
  if (_views.has(key)) return _views.get(key);
  const route = ROUTE_BY_KEY[key];
  const mod = await route.load();
  // Per-view stylesheet(s), lazy-loaded once (a view declares `export const css`
  // as a string or an array of hrefs).
  if (mod.css) await Promise.all([].concat(mod.css).map(loadCss));
  const section = document.createElement("section");
  section.className = "v2-view";
  section.dataset.view = key;
  section.hidden = true;
  appEl().appendChild(section);
  // mount(host, ctx) renders the view's initial DOM and may return a controller
  // with optional enter(sub) / leave() hooks for its own sub-routing.
  const ctrl = (mod.mount ? await mod.mount(section, ctxFor()) : null) || {};
  const rec = { section, mod, ctrl };
  _views.set(key, rec);
  return rec;
}

function loadCss(href) {
  return new Promise((res) => {
    if ([...document.styleSheets].some((s) => s.href && s.href.endsWith(href))) return res();
    if (document.querySelector(`link[data-v2css="${href}"]`)) return res();
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = href; l.dataset.v2css = href;
    l.onload = l.onerror = () => res();
    document.head.appendChild(l);
  });
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
  if (same) { const r = _views.get(key); r && r.ctrl.enter && r.ctrl.enter(sub); setChromeActive(key); return; }
  _busy = true;

  const run = async () => {
    let rec;
    try { rec = await ensureView(key); }
    catch { _busy = false; return; }               // load failed — leave current view up
    // Hide the outgoing, show the incoming.
    if (_active && _views.has(_active)) {
      const prev = _views.get(_active);
      prev.ctrl.leave && prev.ctrl.leave();
      prev.section.hidden = true;
    }
    rec.section.hidden = false;
    // Mark the active tab BEFORE enter() so each view's event listeners (which
    // self-guard on this flag) know they're live. Ported apps keep their own
    // hash routing; only the active one reacts to global events.
    document.documentElement.dataset.v2tab = key;
    rec.ctrl.enter && rec.ctrl.enter(sub);
    _active = key;
    document.title = ROUTE_BY_KEY[key].title;
    setChromeActive(key);
    window.scrollTo(0, 0);
  };

  // Same-document view transition (iOS-supported); instant + crossfaded. If the
  // API is missing, just run the swap directly.
  if ("startViewTransition" in document) {
    const vt = document.startViewTransition(run);
    try { await vt.finished; } catch { /* transition interrupted — swap already applied */ }
  } else {
    await run();
  }
  _busy = false;
  // Drain a tap that arrived during the swap (latest wins).
  if (_pending) { const [p, o] = _pending; _pending = null; navigate(p, o); }
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
  const { initChrome } = await import("./chrome.js?v=v2-1");
  _setActive = initChrome({ onTab: (key) => navigate(tabPath(key), { push: true }) });
  window.addEventListener("popstate", onPop);
  await navigate(location.pathname + location.search + location.hash, { push: false, replace: true });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
