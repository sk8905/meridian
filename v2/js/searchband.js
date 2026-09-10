// =============================================================================
// searchband.js — the shared "search + $1–15bn AUM focus" row that sits directly
// under each page's chips (Wire header → chips → this band → content).
//
// Two shapes:
//   • LIST pages (Profiles Managers/Hedge Funds, Transactions) render their OWN
//     .thead-search with a real filtering <input> + the AUM button merged in —
//     they don't use this helper.
//   • EVERY OTHER page renders bandHTML(): a search field that opens the global
//     command palette (data-open-search → palette.js) and the same orange
//     $1–15bn button, which here jumps to Profiles → Managers with that AUM focus
//     applied (a page with no list of its own to filter). One consistent row.
// =============================================================================

// The band markup for non-list pages. `ph` overrides the placeholder text.
export function bandHTML(ph) {
  return `<header class="tpanel-h thead-search wire-band">`
    + `<button type="button" class="tsearch wire-band-q" data-open-search aria-label="Search Wire">${ph || "Search everything…"}</button>`
    + `<button type="button" class="tfocus-btn tfocus-aum" data-aum-jump aria-label="AUM focus — $1–15bn managers" title="AUM focus — show $1–15bn AUM managers">$1–15bn</button>`
    + `</header>`;
}

// Global wiring, installed once. The $1–15bn button on a non-list page has no
// list of its own to filter, so it navigates to Profiles → Managers and asks that
// view to switch its AUM focus ON (via a sessionStorage handshake read on mount).
let _wired = false;
export function initSearchBand(navigate) {
  if (_wired) return; _wired = true;
  document.addEventListener("click", (e) => {
    const jump = e.target.closest("[data-aum-jump]");
    if (!jump) return;
    e.preventDefault();
    try { sessionStorage.setItem("wire.aumFocus", "1"); } catch { /* ignore */ }
    if (typeof navigate === "function") navigate("profiles", "#/?tab=managers");
    else { location.hash = "#/?tab=managers"; }
  });
}

// Read-and-clear the handshake — Profiles calls this on mount to decide whether to
// pre-apply the $1–15bn managers focus after an AUM-button jump from another page.
export function consumeAumFocus() {
  try { if (sessionStorage.getItem("wire.aumFocus") === "1") { sessionStorage.removeItem("wire.aumFocus"); return true; } } catch { /* ignore */ }
  return false;
}
