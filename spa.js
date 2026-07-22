// =============================================================================
// spa.js — client-side tab navigation with SAME-document view transitions.
//
// Why: iOS WebKit implements same-document view transitions (Safari 18+) but NOT
// cross-document ones, so a full page load flashes the browser's white
// inter-document blank on every tab change (verified: Chromium fires the
// cross-document transition, iOS shows the blank). Fetching the destination and
// swapping it into the CURRENT document, wrapped in document.startViewTransition,
// removes the document load — so there is no blank, iOS included.
//
// Scope (deliberately narrow for safety): only the three app pages + menu, which
// share ONE shell — #wire-header (identical across them) + main#app + footer +
// the body-mounted .mobile-tabbar. We keep that shell MOUNTED and swap only
// #app's contents, then re-run the destination's entry module so it renders into
// the fresh #app. The shared chrome's init is idempotent (initHeader guards on
// #wire-header[data-ready]; initNavActions guards on #na-mkt), so it is NOT
// re-run — no duplicate/leaking chrome listeners. Home (/) is structurally
// different (#glance auth states), so navigations to/from it fall through to a
// normal load.
//
// HARD FALLBACK: any error, redirect, or off-scope route → location.assign, so a
// tab tap can never do worse than today's full navigation.
// =============================================================================

// The app shell we can swap within (NOT Home). Trailing-slash normalised.
const APP_ROUTES = ["/macro/", "/credit/", "/legal/", "/menu/"];
const norm = (u) => { try { return new URL(u, location.href).pathname.replace(/index\.html$/, ""); } catch { return u; } };
const inScope = (p) => APP_ROUTES.includes(norm(p));

let _wired = false, _busy = false, _ok = false;
// The path we currently have mounted. Used to tell a real cross-page history
// move (which WE must handle) apart from a same-page fragment change (which the
// destination app's own hash router owns) — the two are indistinguishable from
// popstate's target URL alone, and Chromium fires popstate for BOTH.
let _curPath = "";
// Prefetch cache: norm(dest) -> { nonce, docP }. Warmed on pointerdown (see
// below) so the destination HTML + its js/app.js are already fetched by the time
// the tap completes — the swap then renders from cache instead of blocking on
// two network round-trips inside the transition (the tab-change lag).
let _seq = 0;
const _pre = new Map();

export function initSpaNav() {
  if (_wired || typeof document === "undefined") return;
  _wired = true;
  _curPath = norm(location.pathname);
  // Only same-document transitions buy us anything; if the browser has neither
  // fetch nor startViewTransition, leave normal navigation alone (the hook below
  // just reports "not handled", so every caller falls back to a real load).
  _ok = ("startViewTransition" in document) && typeof fetch === "function";

  // The integration point: the shared nav (nav-actions' tab-bar act(), and any
  // link handler) calls window.__spaNavigate(dest) BEFORE navigating. If we
  // return true we've taken over with a same-document transition; false → the
  // caller does its normal location.replace/assign. Routing through the existing
  // handler means we inherit its tap/gesture detection (no event racing) and can
  // never double-fire. Only claim in-scope app↔app moves.
  window.__spaNavigate = (dest) => {
    if (!_ok || _busy) return false;
    const from = norm(location.pathname), to = norm(dest);
    if (to === from) return false;                       // same page → let caller no-op
    if (!inScope(from) || !inScope(to)) return false;    // Home / off-scope → normal load
    go(dest, true);
    return true;
  };
  window.addEventListener("popstate", onPop);

  // Warm the destination the instant a finger lands on a tab — navigation only
  // fires on pointerUP (nav-actions), so this buys the whole press duration
  // (~100-250ms) to fetch the HTML + its app.js before the swap needs them.
  // Capturing + passive so it never interferes with the tap; prefetch is
  // side-effect-free and self-dedupes.
  const onDown = (e) => {
    const t = e.target && e.target.closest && e.target.closest(".mobile-tabbar .mtab[data-nav], .platform-switch a.ps-btn[href]");
    if (!t) return;
    prefetch(t.getAttribute("data-nav") || t.getAttribute("href"));
  };
  document.addEventListener("pointerdown", onDown, { capture: true, passive: true });
  document.addEventListener("touchstart", onDown, { capture: true, passive: true });
}

// Fetch + parse the destination and warm its entry script's exact (nonce'd) URL,
// so go() can render from cache. Reserves the nonce here so the warmed request
// and the later <script src> are byte-identical URLs (a browser-cache hit).
function prefetch(dest) {
  if (!_ok || !dest) return;
  const to = norm(dest);
  if (!inScope(to) || to === norm(location.pathname) || _pre.has(to)) return;
  const base = new URL(dest, location.origin).href;
  const nonce = ++_seq;
  const docP = fetch(dest, { credentials: "same-origin", headers: { "x-spa-nav": "1" } })
    .then((r) => (r.ok && !r.redirected && /text\/html/.test(r.headers.get("content-type") || "")) ? r.text() : null)
    .then((html) => {
      if (!html) return null;
      const doc = new DOMParser().parseFromString(html, "text/html");
      const u = entryScriptUrl(doc, base, nonce);
      if (u) fetch(u, { credentials: "same-origin" }).catch(() => {});   // warm the app.js bytes
      return doc;
    })
    .catch(() => null);
  _pre.set(to, { nonce, docP });
}

// The destination's own entry module (js/app.js), as an absolute URL carrying the
// per-navigation re-eval nonce. Skips the shared header boot and cross-origin.
function entryScriptUrl(doc, base, nonce) {
  for (const s of doc.querySelectorAll("script[src]")) {
    const src = s.getAttribute("src");
    if (!src || /^https?:/i.test(src) || /\/header\.js\b/.test(src)) continue;
    try { const u = new URL(src, base); u.searchParams.set("_spa", String(nonce)); return u.href; } catch { /* skip */ }
  }
  return null;
}

function onPop() {
  const to = norm(location.pathname);
  // Same path as what's mounted → this is a fragment/hash change (e.g. the
  // credit/legal/macro apps route their detail views via location.hash, which
  // fires popstate in Chromium). That's the page's OWN router's job; if we
  // treated it as a page move we'd re-fetch and replace #app, wiping the very
  // view the app just rendered. Leave it entirely alone.
  if (to === _curPath) return;
  if (inScope(to) && ("startViewTransition" in document)) go(location.pathname, false);
  else location.reload();                     // popped to Home/other → full load
}

async function go(dest, push) {
  if (_busy) return;
  _busy = true;
  try {
    const to = norm(dest);
    // Use the pointerdown prefetch if we have one (the common path — a tapped
    // tab); otherwise fetch now (popstate / programmatic nav). Either way we end
    // with a parsed doc and the nonce its app.js was (or will be) warmed at.
    const pre = _pre.get(to); _pre.delete(to);
    let doc = null, nonce;
    if (pre) { doc = await pre.docP; nonce = pre.nonce; }
    if (!doc) {
      const res = await fetch(dest, { credentials: "same-origin", headers: { "x-spa-nav": "1" } });
      if (!res.ok || res.redirected) throw new Error("bad response");
      if (!/text\/html/.test(res.headers.get("content-type") || "")) throw new Error("not html");
      doc = new DOMParser().parseFromString(await res.text(), "text/html");
      nonce = ++_seq;
    }
    const newApp = doc.getElementById("app");
    if (!newApp) throw new Error("no #app in destination");

    const commit = async () => {
      // Title + page-specific stylesheets (each app has its own css/styles.css;
      // premium/tui/header/feed are shared and already present).
      if (doc.title) document.title = doc.title;
      reconcileStyles(doc, dest);
      // Swap ONLY the app content — the header, tab bar and footer persist.
      const curApp = document.getElementById("app");
      if (!curApp) throw new Error("no #app here");
      curApp.replaceWith(document.adoptNode(newApp));
      // The persistent chrome doesn't re-render, so move its active-tab marker to
      // the new route — otherwise the tab bar still thinks it's on the old page
      // and tapping the destination reads as "already here" (a dead no-op).
      updateActiveChrome(dest);
      _curPath = norm(dest);                  // now mounted here (keeps onPop honest)
      window.scrollTo(0, 0);
      // Render the destination INTO the fresh #app *inside* the update callback,
      // so the transition captures the "after" snapshot with content present.
      // Each app's entry (js/app.js) renders its skeleton synchronously on module
      // eval, so awaiting the script's onload (+ a frame to paint) means the
      // crossfade goes old→populated, not old→EMPTY #app — the latter shows the
      // bare body ground, which on a light theme reads as a white/blank flash
      // before the content pops in. Bounded by a timeout so a slow module can
      // never freeze the old frame indefinitely.
      await renderInto(doc, nonce);
    };

    if (push) history.pushState({ spa: true }, "", dest);
    // Same-document view transition: iOS honours this; the crossfade is defined
    // in premium.css (::view-transition-*(root)).
    const vt = document.startViewTransition(commit);
    await vt.updateCallbackDone;              // DOM swapped + destination rendered
  } catch (err) {
    // Never leave the user stuck: fall back to a real navigation.
    if (push) location.assign(dest); else location.reload();
  } finally {
    _busy = false;
  }
}

// Move the active-tab marker on the persistent chrome (bottom tab bar + header
// platform switch) to the new route.
function updateActiveChrome(dest) {
  const to = norm(dest);
  document.querySelectorAll(".mobile-tabbar .mtab[data-nav]").forEach((el) => {
    const on = norm(el.getAttribute("data-nav")) === to;
    el.classList.toggle("is-active", on);
    if (on) el.setAttribute("aria-current", "page"); else el.removeAttribute("aria-current");
  });
  document.querySelectorAll(".platform-switch a.ps-btn[href]").forEach((el) => {
    const on = norm(el.getAttribute("href")) === to;
    el.classList.toggle("is-active", on);
    if (on) el.setAttribute("aria-current", "page"); else el.removeAttribute("aria-current");
  });
}

// Add any page-specific stylesheet the destination declares that we don't have,
// and drop ones we have that it doesn't — keyed by pathname (token-agnostic), so
// e.g. /macro/css/styles.css is replaced by /credit/css/styles.css. Shared
// sheets (same path) are untouched, so no re-parse / FOUC for them.
function reconcileStyles(doc, destUrl) {
  const base = new URL(destUrl, location.origin).href;
  // Destination links: resolve their (possibly relative) href against the DEST
  // base, so /credit/css/styles.css is keyed correctly regardless of the current
  // URL. Value is the absolute href to load.
  const want = new Map();
  doc.querySelectorAll('link[rel="stylesheet"][href]').forEach((l) => {
    try { const u = new URL(l.getAttribute("href"), base); want.set(u.pathname, u.href); } catch { /* skip */ }
  });
  // Current links: use the resolved .href PROPERTY (absolute, from when they
  // loaded) — NOT getAttribute, whose relative value would now mis-resolve
  // against the pushed URL.
  const have = new Map();
  document.querySelectorAll('link[rel="stylesheet"][href]').forEach((l) => {
    try { have.set(new URL(l.href).pathname, l); } catch { /* skip */ }
  });
  for (const [p, el] of have) if (!want.has(p)) el.remove();          // drop old page's sheet
  for (const [p, href] of want) if (!have.has(p)) {                    // add new page's sheet
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = href;
    document.head.appendChild(link);
  }
}

// Re-execute the destination's entry scripts against the fresh #app. Module
// scripts are singletons keyed by URL, so a plain re-inject won't re-run the
// top-level render; the per-navigation `_spa` nonce (the SAME value the
// pointerdown prefetch warmed the bytes at) forces a fresh evaluation that
// renders into the new DOM — served from cache, not the network. The shared
// chrome modules imported transitively keep their existing (unnonced) URLs →
// cached → their init is a guarded no-op, so only the page app re-inits (no
// duplicate chrome). Inline module scripts are re-created verbatim.
function runEntryScripts(doc, nonce) {
  const loads = [];
  for (const s of doc.querySelectorAll("script")) {
    // Only the page's own entry (js/app.js) + its inline boot; skip the shared
    // header boot (it re-mounts nothing — chrome persists) and cross-origin.
    const src = s.getAttribute("src");
    const el = document.createElement("script");
    for (const a of s.attributes) if (a.name !== "src") el.setAttribute(a.name, a.value);
    if (src) {
      if (/^https?:/i.test(src)) continue;           // external/CDN — skip
      if (/\/header\.js\b/.test(src)) continue;      // shared chrome — already live
      el.src = src + (src.includes("?") ? "&" : "?") + "_spa=" + nonce;   // force re-eval
      // onload fires after the module (and its graph) evaluate — by then the
      // entry's synchronous top-level render has populated #app.
      loads.push(new Promise((res) => { el.onload = res; el.onerror = res; }));
      document.body.appendChild(el);
    } else {
      if (/initHeader/.test(s.textContent || "")) continue; // inline header boot — skip
      el.textContent = s.textContent;
      document.body.appendChild(el);
      el.remove();                                   // inline: ran on insert
    }
  }
  return Promise.all(loads);
}

// Load + evaluate the destination's entry scripts, then wait one painted frame
// so its synchronous skeleton is on screen before we resolve — but never hold
// the frozen old frame for more than a beat, so a slow module degrades to a
// brief skeleton rather than a stall.
function renderInto(doc, nonce) {
  const rendered = runEntryScripts(doc, nonce)
    .then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  return Promise.race([rendered, new Promise((r) => setTimeout(r, 600))]);
}
