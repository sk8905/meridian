// =============================================================================
// chrome.js — the shared chrome (top bar + bottom tab bar), built ONCE for the
// whole SPA session. It never re-renders on navigation; the runtime just calls
// the returned setActive(key) to move the highlight. Reuses the current app's
// classes and icons so the look is identical.
//
// It renders the header markup + the five-tab bar, then boots the shared
// session-long features once: the ticker + briefing (brief.js), the command
// palette (palette.js), pull-to-refresh (ptr.js), and the header action cluster
// + panels (the ported nav-actions — Markets / Saved / Notifications / Search).
// =============================================================================

// The build version (see runtime.js) — chrome is loaded with ?v=V, so it reads
// it back off its own URL and stamps it onto the v2 modules it loads.
const V = (() => { try { return new URL(import.meta.url).searchParams.get("v") || ""; } catch { return ""; } })();
const vurl = (p) => p + (p.includes("?") ? "&" : "?") + "v=" + V;

// The app-wide "Last refresh" reporter — same singleton the desks report into
// (its own leaf token, not V; see runtime.js), so chrome's boot-time value and a
// desk's real stamp share one monotonic keep-latest state.
import { reportRefresh } from "./status.js?v=v2-2";
import { esc } from "/util.js?v=20260719-1";

const TABS = [
  ["home", "Home"], ["macro", "Macro"], ["credit", "Credit"], ["legal", "Legal"], ["menu", "Menu"],
];
const PLATFORMS = [["home", "Home"], ["macro", "Macro"], ["credit", "Credit"], ["legal", "Legal"]];

const TAB_ICONS = {
  home: '<svg class="mtab-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11 12 4l8 7"/><path d="M6 9.5V20h12V9.5"/></svg>',
  macro: '<svg class="mtab-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 20V12"/><path d="M12 20V5"/><path d="M19 20V9"/></svg>',
  credit: '<svg class="mtab-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="7" width="19" height="10" rx="1.5"/><circle cx="12" cy="12" r="2.3"/></svg>',
  legal: '<svg class="mtab-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v15"/><path d="M8 19h8"/><path d="M4 7h16"/><path d="M4 7l-2 4.5h4z"/><path d="M20 7l-2 4.5h4z"/></svg>',
  menu: '<svg class="mtab-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>',
};

// onTab(key) is called for every tab / platform activation — the runtime routes.
export function initChrome({ onTab }) {
  buildHeader(onTab);
  const tabbar = buildTabBar(onTab);
  // Phone-only meta strip pinned directly above the bottom tab bar: signed-in
  // identity + the app-wide last-refresh. header.css hides #account-nav /
  // #data-status on phones (they live in the footer/rail on desktop), so on a
  // phone this strip is where that info surfaces. Status renders here via the
  // shared reporter (data-refresh-slot); account is filled by fillAccount().
  buildBottomMeta();
  // Desktop page footer: signed-in identity + app-wide last refresh.
  buildFooter();
  // Anchor the top bar so it never scrolls away (see initHeaderLock).
  initHeaderLock();
  // Show a "Last refresh" value immediately, whatever tab loads first — a desk's
  // real stamp supersedes it the moment one loads (see bootRefreshFallback).
  bootRefreshFallback();

  // Shared, session-long chrome features, reusing the existing modules verbatim:
  //   • ticker + briefing strip (brief.js → #wticker / #wbrief)
  //   • ⌘K / "/" command palette (palette.js) — one instance for every view
  //   • pull-to-refresh (ptr.js) — self-guards, touch-only
  // All are idempotent single inits; failures never block the shell.
  import("/brief.js?v=7").then((m) => m.initBrief()).catch(() => {});
  import("/palette.js?v=20260723-1").then((m) => m.mountPalette()).catch(() => {});
  import("/ptr.js?v=20260723-4").then((m) => m.initPullToRefresh()).catch(() => {});
  // Header action cluster + panels (Markets / Saved / Notifications / Search, the
  // notif bell, saved + markets loaders), ported from nav-actions with its own
  // tab bar / header-layout / swipe neutralised (the runtime owns those). Mounts
  // into .topbar-right.
  import(vurl("./nav-actions.js")).then((m) => m.initNavActions()).catch(() => {});
  fillAccount();

  // Update the active marker on both the bottom bar and the header switch.
  return function setActive(key) {
    tabbar.querySelectorAll(".mtab").forEach((b) => {
      const on = b.dataset.key === key;
      b.classList.toggle("is-active", on);
      if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    document.querySelectorAll("#wire-header .ps-btn").forEach((b) => {
      const on = b.dataset.key === key;
      b.classList.toggle("is-active", on);
      if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
  };
}

function buildHeader(onTab) {
  const mount = document.getElementById("wire-header");
  if (!mount) return;
  const pills = PLATFORMS.map(([k, l]) => `<button type="button" class="ps-btn" data-key="${k}">${l}</button>`).join("");
  mount.innerHTML = `
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="${location.origin}/v2/" aria-label="Wire Home" data-key="home">
        <span class="logo" aria-hidden="true">/</span>
        <span class="brand-text"><strong>Wire</strong></span>
      </a>
      <div class="platform-switch" role="group" aria-label="Switch platform">${pills}</div>
      <button class="nav-search" data-open-search type="button" aria-label="Search Wire">
        <span class="ns-lbl">Search everything…</span><kbd>/</kbd>
      </button>
      <div class="topbar-right">
        <div id="account-nav" class="account-nav"></div>
        <div id="data-status" class="data-status" data-refresh-slot></div>
      </div>
      <div id="notif" class="notif"></div>
    </div>
  </header>
  <div class="wticker" id="wticker"></div>
  <div class="wbrief" id="wbrief"></div>`;
  // Platform pills / brand route via the SPA; the search button is left for
  // palette.js (data-open-search) — don't treat it as a tab.
  mount.addEventListener("click", (e) => {
    const b = e.target.closest("[data-key]");
    if (b) { e.preventDefault(); onTab(b.dataset.key); }
  });
}

// Signed-in identity (behind Cloudflare Access), shared across all views — the
// same call each ported app makes, done once here so the header shows it
// regardless of which view is active.
function fillAccount() {
  const el = document.getElementById("account-nav");
  const bot = document.getElementById("account-nav-bot");
  const foot = document.getElementById("account-nav-foot");
  if (!el && !bot && !foot) return;
  fetch("/api/me", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (d && d.email) {
        // Escape (not strip) via the shared helper — same as nav-actions.js, so
        // one identity string, one escaper (T9/T10). esc() also handles quotes.
        const email = esc(d.email);
        const full = `<span class="si-prefix">Signed in as </span><strong>${email}</strong> · <a href="/cdn-cgi/access/logout">Sign out</a>`;
        // Header copy (present but hidden on desktop — the footer shows it there).
        if (el) el.innerHTML = full;
        // Desktop footer: full identity + sign-out.
        if (foot) foot.innerHTML = full;
        // Phone strip: compact — just the identity (sign-out lives in the Menu),
        // ellipsised so it shares the row with the last-refresh.
        if (bot) bot.innerHTML = `<span class="si-prefix">Signed in as </span><strong>${email}</strong>`;
        try { localStorage.setItem("m_signed_in", "1"); } catch { /* ignore */ }
      }
    })
    .catch(() => { /* not behind Access */ });
}

// The desktop page footer carries the signed-in identity + the app-wide last
// refresh (header.css/app.css hide the header copies on desktop). #data-status-
// foot is a refresh slot so status.js renders the shared value into it too.
function buildFooter() {
  const f = document.getElementById("v2-footer");
  if (!f) return;
  f.innerHTML = `<div id="account-nav-foot" class="v2-foot-acct"></div>`
    + `<div id="data-status-foot" class="v2-foot-status" data-refresh-slot></div>`;
}

// Populate the app-wide "Last refresh" right away, independent of which tab
// loads first. Wire's data lands on a fixed London schedule (05:00, 12:00,
// 17:00, 21:00), so the most recent slot is a good immediate value — and
// status.js keeps the LATEST report, so a desk's real stamp (e.g. "05:22 BST")
// supersedes this as soon as any desk mounts. This just closes the gap where a
// tab with no data (e.g. Menu) would otherwise show a blank refresh.
function bootRefreshFallback() {
  try {
    const slots = [5, 12, 17, 21];
    const partsIn = (d) => new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hour12: false }).formatToParts(d);
    const val = (p, t) => p.find((x) => x.type === t).value;
    const p = partsIn(new Date());
    let Y = +val(p, "year"), M = +val(p, "month"), D = +val(p, "day");
    const H = +val(p, "hour") % 24;
    let slot = null;
    for (let i = slots.length - 1; i >= 0; i--) { if (H >= slots[i]) { slot = slots[i]; break; } }
    if (slot === null) {
      // Before 05:00 London → the previous day's 21:00 slot. Step back ~12h and
      // re-read the London date (safe across month/year boundaries).
      const pp = partsIn(new Date(Date.UTC(Y, M - 1, D) - 12 * 3600 * 1000));
      Y = +val(pp, "year"); M = +val(pp, "month"); D = +val(pp, "day"); slot = 21;
    }
    const iso = `${Y}-${String(M).padStart(2, "0")}-${String(D).padStart(2, "0")}`;
    reportRefresh(iso, `${String(slot).padStart(2, "0")}:00`);
  } catch { /* leave it to the desks */ }
}

// Anchor the top bar so it stays put when the page scrolls. .topbar is
// position:sticky (header.css), but its sticky CONTAINER is the short
// #wire-header wrapper — scroll past that wrapper and the bar leaves with it
// (the "header not anchored" bug). On phones we pin it exactly the way the
// current app does: position:fixed via .wire-head-fixed (iOS keeps a fixed bar
// glued through momentum scroll, where sticky/compositor layers drift), padding
// the body by the measured header height so nothing hides behind it. That
// measured height (--wire-head-h) is also the offset every view's sticky sub-nav
// (the date/tabs strip, macro secbars…) pins beneath — so it sits flush under
// the bar instead of letting content bleed through the seam. On desktop the bar
// is left as native sticky, which works there because app.css gives #wire-header
// display:contents (so .topbar's sticky container becomes the tall body).
function initHeaderLock() {
  const head = document.querySelector("#wire-header .topbar");
  if (!head) return;
  const isPhone = () => matchMedia("(max-width: 760px)").matches;
  const lock = () => {
    if (isPhone()) {
      // Rect height (not offsetHeight): they can differ by a px on the fixed
      // bar, and the drift shows as a background seam under the chrome.
      document.documentElement.style.setProperty("--wire-head-h", head.getBoundingClientRect().height + "px");
      head.classList.add("wire-head-fixed");
      document.body.classList.add("wire-head-pad");
    } else {
      head.classList.remove("wire-head-fixed");
      document.body.classList.remove("wire-head-pad");
      document.documentElement.style.removeProperty("--wire-head-h");
    }
  };
  lock();
  // The first measure can run before fonts/late CSS settle; re-measure next
  // frame so --wire-head-h (hence every sub-nav offset) is pixel-accurate.
  requestAnimationFrame(lock);
  window.addEventListener("resize", lock);
}

// The phone-only bottom meta strip (identity + last refresh), pinned above the
// tab bar by app.css. Built once, like the tab bar; #data-status-bot is a
// refresh slot so status.js renders the app-wide last-refresh into it.
function buildBottomMeta() {
  document.querySelectorAll(".v2-botmeta").forEach((el) => el.remove());
  const bar = document.createElement("div");
  bar.className = "v2-botmeta";
  bar.innerHTML = `<div id="account-nav-bot" class="v2-botmeta-acct"></div>`
    + `<div id="data-status-bot" class="v2-botmeta-status" data-refresh-slot></div>`;
  document.body.appendChild(bar);
  return bar;
}

function buildTabBar(onTab) {
  document.querySelectorAll(".mobile-tabbar").forEach((el) => el.remove());
  const nav = document.createElement("nav");
  nav.className = "mobile-tabbar";
  nav.setAttribute("aria-label", "Platforms");
  nav.innerHTML = TABS.map(([k, l]) =>
    `<button type="button" class="mtab${k === "menu" ? " mtab-menu" : ""}" data-key="${k}">${TAB_ICONS[k]}<span class="mtab-lbl">${l}</span></button>`
  ).join("");
  document.body.appendChild(nav);
  // A tab tap dismisses any open header panel (Markets/Saved/Notifications) or
  // the search palette first — otherwise the overlay would linger over the new
  // view (nav-actions did this for its own bar; the runtime bar must too).
  const closeOverlays = () => {
    // Escape is the shared "close" signal both nav-actions (panels) and
    // palette.js (search) listen for — the most reliable way to dismiss either.
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    // Belt-and-braces for the panels in case a listener isn't bound yet.
    document.querySelectorAll(".na-panel.open, .na-panel:not([hidden])").forEach((p) => { p.classList.remove("open"); p.hidden = true; });
    document.querySelectorAll(".na-btn[aria-expanded='true']").forEach((btn) => btn.setAttribute("aria-expanded", "false"));
    const pal = document.querySelector(".mcmdk.open");
    if (pal) { pal.classList.remove("open"); if (document.activeElement && pal.contains(document.activeElement)) document.activeElement.blur(); }
  };
  const go = (key) => { closeOverlays(); onTab(key); };
  // Navigate on pointerup so a tap feels immediate but a scroll/drag doesn't
  // fire it; fall back to click for non-pointer environments.
  let downBtn = null, dx = 0, dy = 0;
  nav.addEventListener("pointerdown", (e) => { downBtn = e.target.closest(".mtab"); dx = e.clientX; dy = e.clientY; }, { passive: true });
  nav.addEventListener("pointerup", (e) => {
    const b = e.target.closest(".mtab");
    if (!b || b !== downBtn) return;
    if (Math.abs(e.clientX - dx) > 10 || Math.abs(e.clientY - dy) > 10) return;   // was a drag
    go(b.dataset.key);
  });
  nav.addEventListener("click", (e) => { if (!window.PointerEvent) { const b = e.target.closest(".mtab"); if (b) go(b.dataset.key); } });
  return nav;
}
