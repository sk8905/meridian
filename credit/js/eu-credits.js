// =============================================================================
// eu-credits.js — the European credit universe for the Transactions ▸ Credits
// sub-tab: the ~300 leveraged-loan / CLO obligors, organised by sector, each with
// its current issuer rating.
//
// Anchored to the **Morningstar European Leveraged Loan Index (ELLI)** (~300–410
// constituents) as the reference universe. The full constituent list and the
// per-issuer ratings are proprietary (Morningstar/LCD + the rating agencies), so
// this roster is compiled INCREMENTALLY from public rating actions and coverage —
// every row is REAL and SOURCED, never fabricated (HOUSE_STYLE R7/R21). The daily
// refresh routine verifies and extends it toward the full universe over time (see
// docs/refresh-routines.md).
//
// One agency, kept CONSISTENT across the roster (EUR_CREDITS_META.agency). Each
// entry:
//   { name, sector, rating, agency, asOf, source }
//     name   — issuer / borrower name
//     sector — one of CREDIT_SECTORS (industry, not the transaction sub-category)
//     rating — the agency's current issuer/corporate-family rating (e.g. "B+")
//     agency — "S&P" | "Moody's" (matches EUR_CREDITS_META.agency)
//     asOf   — ISO date the rating was last verified
//     source — a real URL for the rating (rating action / coverage)
// =============================================================================

// Canonical industry sectors, in display order. "Other" catches the long tail.
export const CREDIT_SECTORS = [
  "Telecom",
  "Technology & Software",
  "Healthcare & Pharma",
  "Chemicals",
  "Business Services",
  "Consumer & Retail",
  "Gaming & Leisure",
  "Media",
  "Industrials",
  "Packaging",
  "Automotive",
  "Building & Construction",
  "Energy & Utilities",
  "Transport & Logistics",
  "Food & Beverage",
  "Financials",
  "Other",
];

export const EUR_CREDITS_META = {
  index: "Morningstar European Leveraged Loan Index (ELLI)",
  agency: "S&P",          // one agency, kept consistent across the roster
  target: 300,
};

// The roster. Populated with sourced rows by the daily routine (and seeded as
// live sourcing allows). Every row carries a REAL, current S&P issuer rating tied
// to a specific public S&P rating action (or coverage of one) — never invented.
// `asOf` is the date the rating was last verified against its source. The routine
// extends this toward the full ELLI universe and re-checks ratings on new actions.
export const EUR_CREDITS = [
  { name: "Action", sector: "Consumer & Retail", rating: "BB", agency: "S&P", asOf: "2026-09-14", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3196745" },
  { name: "Altice France", sector: "Telecom", rating: "B-", agency: "S&P", asOf: "2026-09-14", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3452736" },
  { name: "Axactor ASA", sector: "Financials", rating: "B-", agency: "S&P", asOf: "2025-11-27", source: "https://www.tradingview.com/news/reuters.com,2025-11-28:newsml_ObiNY6Tva:0-axactor-asa-s-p-outlook-revised-to-stable-from-negative-b-ratings-is-affirmed" },
  { name: "Cerba HealthCare", sector: "Healthcare & Pharma", rating: "CCC-", agency: "S&P", asOf: "2026-09-14", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3547297" },
  { name: "Cirsa", sector: "Gaming & Leisure", rating: "BB-", agency: "S&P", asOf: "2026-09-14", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/101636696" },
  { name: "INEOS Quattro", sector: "Chemicals", rating: "BB", agency: "S&P", asOf: "2026-09-14", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3348272" },
  { name: "Kloeckner Pentaplast", sector: "Packaging", rating: "D", agency: "S&P", asOf: "2026-09-14", source: "https://cbonds.com/news/3768903/" },
  { name: "Rovensa", sector: "Chemicals", rating: "B-", agency: "S&P", asOf: "2026-09-14", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3459538" },
  { name: "STADA (Nidda Healthcare)", sector: "Healthcare & Pharma", rating: "B", agency: "S&P", asOf: "2026-09-14", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3449395" },
  { name: "Synlab", sector: "Healthcare & Pharma", rating: "B", agency: "S&P", asOf: "2026-09-14", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3097143" },
  { name: "TeamSystem", sector: "Technology & Software", rating: "B-", agency: "S&P", asOf: "2026-09-14", source: "https://cbonds.com/news/3448861/" },
  { name: "Techem", sector: "Business Services", rating: "B+", agency: "S&P", asOf: "2026-09-14", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3568419" },
  { name: "Verisure", sector: "Business Services", rating: "BB+", agency: "S&P", asOf: "2025-10-08", source: "https://www.verisure.com/press-releases/verisure-credit-rating-upgraded-by-moody-s-and-s-p-following-initial-public-offering" },
  { name: "VodafoneZiggo", sector: "Telecom", rating: "B+", agency: "S&P", asOf: "2026-09-14", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/101626175" },
];

// Group the roster by sector, in CREDIT_SECTORS order; unknown sectors fall to
// "Other". Returns [[sectorLabel, [entries…]], …] omitting empty sectors.
export function creditsBySector(list) {
  const known = new Set(CREDIT_SECTORS);
  const buckets = new Map(CREDIT_SECTORS.map((s) => [s, []]));
  for (const c of (list || EUR_CREDITS)) {
    const sec = known.has(c.sector) ? c.sector : "Other";
    buckets.get(sec).push(c);
  }
  for (const arr of buckets.values()) arr.sort((a, b) => a.name.localeCompare(b.name));
  return [...buckets.entries()].filter(([, arr]) => arr.length);
}
