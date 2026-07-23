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

  // Shared, session-long chrome features, reusing the existing modules verbatim:
  //   • ticker + briefing strip (brief.js → #wticker / #wbrief)
  //   • ⌘K / "/" command palette (palette.js) — one instance for every view
  //   • pull-to-refresh (ptr.js) — self-guards, touch-only
  // All are idempotent single inits; failures never block the shell.
  import("/brief.js?v=7").then((m) => m.initBrief()).catch(() => {});
  import("/palette.js?v=20260722-5").then((m) => m.mountPalette()).catch(() => {});
  import("/ptr.js?v=20260723-4").then((m) => m.initPullToRefresh()).catch(() => {});
  // Header action cluster + panels (Markets / Saved / Notifications / Search, the
  // notif bell, saved + markets loaders), ported from nav-actions with its own
  // tab bar / header-layout / swipe neutralised (the runtime owns those). Mounts
  // into .topbar-right.
  import("./nav-actions.js?v=v2-2").then((m) => m.initNavActions()).catch(() => {});
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
        <div id="data-status" class="data-status"></div>
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
  if (!el) return;
  fetch("/api/me", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (d && d.email) {
        el.innerHTML = `<span class="si-prefix">Signed in as </span><strong>${d.email.replace(/[<>&]/g, "")}</strong> · <a href="/cdn-cgi/access/logout">Sign out</a>`;
        try { localStorage.setItem("m_signed_in", "1"); } catch { /* ignore */ }
      }
    })
    .catch(() => { /* not behind Access */ });
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
