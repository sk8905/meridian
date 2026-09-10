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
// live sourcing allows). Empty until the first verified batch lands — the Credits
// sub-tab reflects that honestly rather than showing invented data.
export const EUR_CREDITS = [];

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
