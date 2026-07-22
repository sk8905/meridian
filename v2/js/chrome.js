// =============================================================================
// chrome.js — the shared chrome (top bar + bottom tab bar), built ONCE for the
// whole SPA session. It never re-renders on navigation; the runtime just calls
// the returned setActive(key) to move the highlight. Reuses the current app's
// classes and icons so the look is identical.
//
// Phase 0 keeps the header lean (brand + platform switch + search stub); the
// ticker, briefing, account block and command palette get wired in as their
// views are ported. The bottom tab bar is the full five-tab bar.
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
      <button class="nav-search" type="button" aria-label="Search Wire" data-search>
        <span class="ns-lbl">Search everything…</span><kbd>/</kbd>
      </button>
      <div class="topbar-right"><div id="account-nav" class="account-nav"></div></div>
    </div>
  </header>`;
  mount.addEventListener("click", (e) => {
    const b = e.target.closest("[data-key]");
    if (b) { e.preventDefault(); onTab(b.dataset.key); }
  });
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
  // Navigate on pointerup so a tap feels immediate but a scroll/drag doesn't
  // fire it; fall back to click for non-pointer environments.
  let downBtn = null, dx = 0, dy = 0;
  nav.addEventListener("pointerdown", (e) => { downBtn = e.target.closest(".mtab"); dx = e.clientX; dy = e.clientY; }, { passive: true });
  nav.addEventListener("pointerup", (e) => {
    const b = e.target.closest(".mtab");
    if (!b || b !== downBtn) return;
    if (Math.abs(e.clientX - dx) > 10 || Math.abs(e.clientY - dy) > 10) return;   // was a drag
    onTab(b.dataset.key);
  });
  nav.addEventListener("click", (e) => { if (!window.PointerEvent) { const b = e.target.closest(".mtab"); if (b) onTab(b.dataset.key); } });
  return nav;
}
