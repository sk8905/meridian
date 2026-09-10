// =============================================================================
// searchband.js — the shared search row that sits under a page's chips
// (Wire header → chips → this band → content) on pages that have NO list of their
// own to filter (Home, Dashboard, Macro, Newsletters).
//
// It is JUST a search field: a button styled like the .tsearch input that opens
// the global command palette (data-open-search → palette.js). The $1–15bn AUM
// button is NOT here — it only belongs on the pages that actually have an AUM
// list to filter (Profiles Managers/Hedge Funds, Transactions), which render
// their own .thead-search with the button merged in.
// =============================================================================

// The band markup for non-list pages. `ph` overrides the placeholder text.
export function bandHTML(ph) {
  return `<header class="tpanel-h thead-search wire-band">`
    + `<button type="button" class="tsearch wire-band-q" data-open-search aria-label="Search Wire">${ph || "Search everything…"}</button>`
    + `</header>`;
}
