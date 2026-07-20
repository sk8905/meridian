// =============================================================================
// header.js — THE single source of truth for the Wire page header (top bar +
// markets ticker + briefing strip). Every page renders it from here into a
// <div id="wire-header"></div> mount, so a header change lands identically on
// all pages instead of being copy-pasted into each page's HTML.
//
// It owns only the header CHROME (markup + mounts). The shared button cluster
// and dropdowns come from nav-actions.js; the ticker + briefing text come from
// brief.js. This module wires all three together in the right order so the
// account block, buttons and briefing all find their mount points.
// =============================================================================
import { initNavActions } from "/nav-actions.js?v=20260719-45";
import { initBrief } from "/brief.js?v=6";

const TABS = [
  ["/", "Home"],
  ["/macro/", "Macro"],
  ["/credit/", "Credit"],
  ["/legal/", "Legal"],
];

// Build the canonical header markup. `active` is the href of the current page's
// tab (e.g. "/credit/") so the platform switch highlights the right one.
function headerHTML(active) {
  const tabs = TABS.map(([href, label]) => {
    const on = href === active;
    return `<a href="${href}" class="ps-btn${on ? " is-active" : ""}"${on ? ' aria-current="page"' : ""}>${label}</a>`;
  }).join("");
  return `
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="/" aria-label="Wire Home">
        <span class="logo" aria-hidden="true">/</span>
        <span class="brand-text"><strong>Wire</strong></span>
      </a>
      <div class="platform-switch" role="group" aria-label="Switch platform">${tabs}</div>
      <button class="nav-search" data-open-search type="button" aria-label="Search Wire">
        <span class="ns-lbl">Search everything…</span>
        <kbd>/</kbd>
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
}

// Render the header into #wire-header and boot the shared chrome. Safe to call
// once per page; a second call is a no-op (the header is already mounted).
export function initHeader(opts = {}) {
  const mount = document.getElementById("wire-header");
  if (!mount || mount.dataset.ready === "1") return;
  const active = opts.active || (location.pathname.startsWith("/macro/") ? "/macro/"
    : location.pathname.startsWith("/credit/") ? "/credit/"
    : location.pathname.startsWith("/legal/") ? "/legal/" : "/");
  mount.innerHTML = headerHTML(active);
  mount.dataset.ready = "1";
  // Buttons/dropdowns first (they mount into .topbar-right / #notif), then the
  // ticker + briefing text.
  initNavActions();
  initBrief();
  // If auth resolved before the header existed (a fast/cached /api/me can beat
  // this deferred module), reflect the signed-in identity now.
  if (typeof window !== "undefined" && typeof window.__fillAccount === "function") window.__fillAccount();
}
