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
import { initNavActions } from "/nav-actions.js?v=20260721-4";
import { initBrief } from "/brief.js?v=7";

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

// Desktop: the identity (email/sign-out) + last-refresh lines don't belong in the
// top nav. Move them OUT of .topbar-right to the bottom of Home's right rail (the
// only page that has one); the app pages render a full-width wire with no right
// rail, so they fall back to the page footer. Phones are left alone — the /menu/
// page owns the block there (it's hidden in the bar via CSS), and the per-page
// inline relocation script already handles the footer copy. The elements keep
// their ids, so the async /api/me fill (getElementById) still finds them wherever
// they land. Idempotent: initHeader runs once per page (dataset.ready guard).
function placeAccountBlock() {
  if (typeof window === "undefined") return;
  if (window.matchMedia && window.matchMedia("(max-width: 760px)").matches) return;
  const acct = document.getElementById("account-nav");
  const stat = document.getElementById("data-status");
  if (!acct && !stat) return;
  const host = document.querySelector(".g-side2")            // Home: the real right rail
    || document.querySelector(".footer")                     // Macro / Credit / Legal / Menu
    || document.getElementById("g-footer");                  // last-resort fallback
  if (!host) return;
  let box = host.querySelector(":scope > .acct-foot");
  if (!box) { box = document.createElement("div"); box.className = "acct-foot"; host.appendChild(box); }
  if (acct) box.appendChild(acct);
  if (stat) box.appendChild(stat);
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
  // Desktop: lift the identity/refresh lines out of the top bar to the rail/footer.
  placeAccountBlock();
}
