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

let _wired = false, _busy = false;
// The path we currently have mounted. Used to tell a real cross-page history
// move (which WE must handle) apart from a same-page fragment change (which the
// destination app's own hash router owns) — the two are indistinguishable from
// popstate's target URL alone, and Chromium fires popstate for BOTH.
let _curPath = "";

export function initSpaNav() {
  if (_wired || typeof document === "undefined") return;
  _wired = true;
  _curPath = norm(location.pathname);
  // Only same-document transitions buy us anything; if the browser has neither
  // fetch nor startViewTransition, leave normal navigation alone (the hook below
  // just reports "not handled", so every caller falls back to a real load).
  const ok = ("startViewTransition" in document) && typeof fetch === "function";

  // The integration point: the shared nav (nav-actions' tab-bar act(), and any
  // link handler) calls window.__spaNavigate(dest) BEFORE navigating. If we
  // return true we've taken over with a same-document transition; false → the
  // caller does its normal location.replace/assign. Routing through the existing
  // handler means we inherit its tap/gesture detection (no event racing) and can
  // never double-fire. Only claim in-scope app↔app moves.
  window.__spaNavigate = (dest) => {
    if (!ok || _busy) return false;
    const from = norm(location.pathname), to = norm(dest);
    if (to === from) return false;                       // same page → let caller no-op
    if (!inScope(from) || !inScope(to)) return false;    // Home / off-scope → normal load
    go(dest, true);
    return true;
  };
  window.addEventListener("popstate", onPop);
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
    const res = await fetch(dest, { credentials: "same-origin", headers: { "x-spa-nav": "1" } });
    if (!res.ok || res.redirected) throw new Error("bad response");
    const ct = res.headers.get("content-type") || "";
    if (!/text\/html/.test(ct)) throw new Error("not html");
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const newApp = doc.getElementById("app");
    if (!newApp) throw new Error("no #app in destination");

    const commit = () => {
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
    };

    if (push) history.pushState({ spa: true }, "", dest);
    // Same-document view transition: iOS honours this; the crossfade is defined
    // in premium.css (::view-transition-*(root)).
    const vt = document.startViewTransition(commit);
    await vt.updateCallbackDone;              // DOM swapped
    // Re-run the destination's entry scripts so the new #app initialises. Done
    // AFTER the swap callback (they query the fresh DOM). Not inside the
    // transition callback: their async work shouldn't block the crossfade.
    runEntryScripts(doc);
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
// top-level render; a per-navigation nonce query forces a fresh evaluation that
// renders into the new DOM. The shared chrome modules imported transitively keep
// their existing (unnonced) URLs → cached → their init is a guarded no-op, so
// only the page app re-inits (no duplicate chrome). Inline module scripts are
// re-created verbatim (they run on insertion).
let _nav = 0;
function runEntryScripts(doc) {
  _nav++;
  for (const s of doc.querySelectorAll("script")) {
    // Only the page's own entry (js/app.js) + its inline boot; skip the shared
    // header boot (it re-mounts nothing — chrome persists) and cross-origin.
    const src = s.getAttribute("src");
    const el = document.createElement("script");
    for (const a of s.attributes) if (a.name !== "src") el.setAttribute(a.name, a.value);
    if (src) {
      if (/^https?:/i.test(src)) continue;           // external/CDN — skip
      if (/\/header\.js\b/.test(src)) continue;      // shared chrome — already live
      el.src = src + (src.includes("?") ? "&" : "?") + "_spa=" + _nav;   // force re-eval
    } else {
      if (/initHeader/.test(s.textContent || "")) continue; // inline header boot — skip
      el.textContent = s.textContent;
    }
    document.body.appendChild(el);
    el.remove();
  }
}
