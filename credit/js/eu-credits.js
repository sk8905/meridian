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
//   { name, sector, rating, agency, asOf, source, jurisdiction, trend }
//     name         — issuer / borrower name
//     sector       — one of CREDIT_SECTORS (industry, not the transaction sub-category)
//     rating       — the agency's current issuer/corporate-family rating (e.g. "B+")
//     agency       — "S&P" | "Moody's" (matches EUR_CREDITS_META.agency)
//     asOf         — ISO date the rating was last verified
//     source       — a real URL for the rating (rating action / coverage)
//     jurisdiction — the borrower/issuer's country of domicile (full name)
//     trend        — net direction of the S&P rating over the trailing 12 months
//                    ("up" | "down" | "flat"): the current rating vs the rating
//                    ~12 months prior. "flat" when unchanged, or when the issuer
//                    was newly/initially rated with no comparable prior. Every
//                    up/down is backed by a real, verified 12-month rating change
//                    — never inferred without evidence (HOUSE_STYLE R7/R22).
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
  { name: "Action", sector: "Consumer & Retail", rating: "BB", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Netherlands", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3196745" },
  { name: "Afflelou", sector: "Consumer & Retail", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/11407052" },
  { name: "Allwyn International", sector: "Gaming & Leisure", rating: "BB", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Czech Republic", trend: "flat", source: "https://cbonds.com/news/3246431/" },
  { name: "Altice France", sector: "Telecom", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "down", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3452736" },
  { name: "Altice International", sector: "Telecom", rating: "CCC", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Luxembourg", trend: "down", source: "https://cbonds.com/news/3843659/" },
  { name: "Ardagh Group", sector: "Packaging", rating: "CCC+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Ireland", trend: "down", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3480477" },
  { name: "Axactor ASA", sector: "Financials", rating: "B-", agency: "S&P", asOf: "2025-11-27", jurisdiction: "Norway", trend: "flat", source: "https://www.tradingview.com/news/reuters.com,2025-11-28:newsml_ObiNY6Tva:0-axactor-asa-s-p-outlook-revised-to-stable-from-negative-b-ratings-is-affirmed" },
  { name: "Banijay", sector: "Media", rating: "B+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3533308" },
  { name: "Biscuit International", sector: "Food & Beverage", rating: "CCC-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "down", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3559952" },
  { name: "Boels Topholding", sector: "Business Services", rating: "BB", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Netherlands", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3448658" },
  { name: "Cerba HealthCare", sector: "Healthcare & Pharma", rating: "CCC-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "down", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3547297" },
  { name: "CeramTec", sector: "Healthcare & Pharma", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Germany", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/2821536" },
  { name: "Cheplapharm Arzneimittel", sector: "Healthcare & Pharma", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Germany", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3299614" },
  { name: "Cirsa", sector: "Gaming & Leisure", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Spain", trend: "up", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/101636696" },
  { name: "CMA CGM", sector: "Transport & Logistics", rating: "BB+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://cbonds.com/news/2605393/" },
  { name: "Constantia Flexibles", sector: "Packaging", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Austria", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3582307" },
  { name: "Curium", sector: "Healthcare & Pharma", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://pitchbook.com/news/articles/curium-acquisition-of-lantheus-backed-by-5-375b-of-debt-financing" },
  { name: "Dedalus", sector: "Technology & Software", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Italy", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/13267974" },
  { name: "Douglas", sector: "Consumer & Retail", rating: "B+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Germany", trend: "flat", source: "https://disclosure.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3178781" },
  { name: "Engineering Ingegneria Informatica", sector: "Technology & Software", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Italy", trend: "flat", source: "https://www.eng.it/en/news/press-releases/2026/06/s-p-global-ratings-conferma-i-rating-di-engineering-e-migliora-outlook" },
  { name: "Evoke (888)", sector: "Gaming & Leisure", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Gibraltar", trend: "flat", source: "https://cbonds.com/news/2562053/" },
  { name: "Fedrigoni", sector: "Packaging", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Italy", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3332226" },
  { name: "Forvia", sector: "Automotive", rating: "BB", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3557598" },
  { name: "Froneri International", sector: "Food & Beverage", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://cbonds.com/news/3483191/" },
  { name: "Garrett Motion", sector: "Automotive", rating: "BB", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Switzerland", trend: "up", source: "https://www.investing.com/news/stock-market-news/garrett-motion-upgraded-to-bb-by-sp-on-deleveraging-progress-93CH-4275425" },
  { name: "Golden Goose", sector: "Consumer & Retail", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Italy", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3544538" },
  { name: "Grifols", sector: "Healthcare & Pharma", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Spain", trend: "up", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/101662097" },
  { name: "Grupo Antolin", sector: "Automotive", rating: "CCC-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Spain", trend: "down", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3586460" },
  { name: "Guala Closures", sector: "Packaging", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Italy", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3189805" },
  { name: "Hapag-Lloyd", sector: "Transport & Logistics", rating: "BB+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Germany", trend: "flat", source: "https://cbonds.com/news/3468175/" },
  { name: "Iliad", sector: "Telecom", rating: "BB", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/2914358" },
  { name: "INEOS Quattro", sector: "Chemicals", rating: "BB", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3348272" },
  { name: "Intrum", sector: "Financials", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Sweden", trend: "up", source: "https://www.theglobeandmail.com/investing/markets/markets-news/Tipranks/2540298/intrum-wins-sp-rating-upgrade-after-sek-7-5bn-capital-raise/" },
  { name: "IVC Evidensia", sector: "Healthcare & Pharma", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "down", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3497710" },
  { name: "Kem One", sector: "Chemicals", rating: "CCC-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "down", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3442535" },
  { name: "Kloeckner Pentaplast", sector: "Packaging", rating: "D", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Germany", trend: "down", source: "https://cbonds.com/news/3768903/" },
  { name: "La Doria", sector: "Food & Beverage", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Italy", trend: "flat", source: "https://cbonds.com/news/3369293/" },
  { name: "Lottomatica Group", sector: "Gaming & Leisure", rating: "BB", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Italy", trend: "flat", source: "https://www.investing.com/news/stock-market-news/lottomatica-groups-credit-rating-raised-to-bb-at-sp-amid-robust-performance-93CH-3942276" },
  { name: "Loxam", sector: "Business Services", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://cbonds.com/news/2228778/" },
  { name: "Lutech", sector: "Technology & Software", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Italy", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/2926301" },
  { name: "Maxeda DIY Group", sector: "Consumer & Retail", rating: "CCC+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Netherlands", trend: "down", source: "https://cbonds.com/news/1212595/" },
  { name: "Neopharmed Gentili", sector: "Healthcare & Pharma", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Italy", trend: "flat", source: "https://cbonds.com/news/3878869/" },
  { name: "Nobian", sector: "Chemicals", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Netherlands", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3564372" },
  { name: "Nomad Foods", sector: "Food & Beverage", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3597198" },
  { name: "Nouryon", sector: "Chemicals", rating: "B+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Netherlands", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/13236095" },
  { name: "Novomatic", sector: "Gaming & Leisure", rating: "BB+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Austria", trend: "flat", source: "https://www.novomatic.com/en/explore-novomatic/investor-relations/credit-rating" },
  { name: "Pepco Group", sector: "Consumer & Retail", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Netherlands", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3486423" },
  { name: "Picard Groupe", sector: "Food & Beverage", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3590125" },
  { name: "Ramsay Générale de Santé", sector: "Healthcare & Pharma", rating: "B+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "down", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3585419" },
  { name: "Refresco", sector: "Food & Beverage", rating: "B+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Netherlands", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/101688745" },
  { name: "Rovensa", sector: "Chemicals", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Portugal", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3459538" },
  { name: "Schaeffler", sector: "Automotive", rating: "BB+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Germany", trend: "flat", source: "https://cbonds.com/news/3261513/" },
  { name: "SPCM (SNF)", sector: "Chemicals", rating: "BB+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://cbonds.com/news/3016411/" },
  { name: "STADA (Nidda Healthcare)", sector: "Healthcare & Pharma", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Germany", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3449395" },
  { name: "Synlab", sector: "Healthcare & Pharma", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Germany", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3097143" },
  { name: "Synthomer", sector: "Chemicals", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3565056" },
  { name: "TeamSystem", sector: "Technology & Software", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Italy", trend: "flat", source: "https://cbonds.com/news/3448861/" },
  { name: "Techem", sector: "Business Services", rating: "B+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Germany", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3568419" },
  { name: "Tele Columbus", sector: "Telecom", rating: "CCC+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Germany", trend: "flat", source: "https://cbonds.com/news/2814295/" },
  { name: "Telecom Italia", sector: "Telecom", rating: "BB+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Italy", trend: "up", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3577330" },
  { name: "Telenet Group Holding", sector: "Telecom", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Belgium", trend: "flat", source: "https://www2.telenet.be/content/dam/www-telenet-corp/en/investor-relations/kredietrating/report-s-and-p.pdf" },
  { name: "Tendam Brands", sector: "Consumer & Retail", rating: "BB+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Spain", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3411695" },
  { name: "TI Fluid Systems", sector: "Automotive", rating: "BB", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://cbonds.com/news/3351425/" },
  { name: "United Group", sector: "Telecom", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Netherlands", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/12241254" },
  { name: "United Petfood Group", sector: "Food & Beverage", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Belgium", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3314155" },
  { name: "Upfield (Sigma Holdco)", sector: "Food & Beverage", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Netherlands", trend: "flat", source: "https://cbonds.com/news/2946017/" },
  { name: "Verallia", sector: "Packaging", rating: "BB+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "down", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3530811" },
  { name: "Verisure", sector: "Business Services", rating: "BB+", agency: "S&P", asOf: "2025-10-08", jurisdiction: "Switzerland", trend: "up", source: "https://www.verisure.com/press-releases/verisure-credit-rating-upgraded-by-moody-s-and-s-p-following-initial-public-offering" },
  { name: "Virgin Media O2", sector: "Telecom", rating: "B+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3133700" },
  { name: "Vivalto Santé", sector: "Healthcare & Pharma", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3049406" },
  { name: "VodafoneZiggo", sector: "Telecom", rating: "B+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Netherlands", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/101626175" },
  { name: "Vue International", sector: "Media", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "up", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3542365" },
  { name: "ZF Friedrichshafen", sector: "Automotive", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Germany", trend: "flat", source: "https://cbonds.com/news/3362627/" },
  // —— Sector-sweep additions (2026-09-14): further verified S&P-rated European
  //    leveraged-finance issuers. Ordering is cosmetic (the UI re-sorts by sector
  //    or rating); kept as a marked block so the batch is auditable.
  { name: "Almaviva", sector: "Technology & Software", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Italy", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3600918" },
  { name: "Ammega Group", sector: "Industrials", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Netherlands", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3455583" },
  { name: "Betclic Everest Group", sector: "Gaming & Leisure", rating: "B+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3474117" },
  { name: "Birkenstock", sector: "Consumer & Retail", rating: "BB+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Germany", trend: "up", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3514083" },
  { name: "Boparan Holdings", sector: "Food & Beverage", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3284054" },
  { name: "Cyfrowy Polsat", sector: "Media", rating: "BB", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Poland", trend: "flat", source: "https://cbonds.com/news/2972833/" },
  { name: "Digi Communications", sector: "Telecom", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Romania", trend: "flat", source: "https://cbonds.com/news/3331159/" },
  { name: "eir", sector: "Telecom", rating: "B+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Ireland", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3337640" },
  { name: "Energean", sector: "Energy & Utilities", rating: "B+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3466002" },
  { name: "EnQuest", sector: "Energy & Utilities", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://cbonds.com/news/3325951/" },
  { name: "Eutelsat", sector: "Telecom", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://cbonds.com/news/3208899/" },
  { name: "Flutter Entertainment", sector: "Gaming & Leisure", rating: "BB+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Ireland", trend: "flat", source: "https://cbonds.com/news/3396887/" },
  { name: "Garfunkelux Holdco 2 (Lowell)", sector: "Financials", rating: "CC", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3303887" },
  { name: "Iceland Foods", sector: "Consumer & Retail", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://disclosure.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/11831346" },
  { name: "Idemia", sector: "Technology & Software", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/2925354" },
  { name: "INNIO Group", sector: "Industrials", rating: "B+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Austria", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3449311" },
  { name: "Ithaca Energy", sector: "Energy & Utilities", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://cbonds.com/news/3100237/" },
  { name: "Kiloutou", sector: "Industrials", rating: "B+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/13377991" },
  { name: "Merlin Entertainments", sector: "Gaming & Leisure", rating: "CCC+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/101640568" },
  { name: "Miller Homes", sector: "Building & Construction", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/101618330" },
  { name: "OCS Group", sector: "Business Services", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://disclosure.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3317722" },
  { name: "Ontex Group", sector: "Consumer & Retail", rating: "B+", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Belgium", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3497891" },
  { name: "Salt Mobile", sector: "Telecom", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Switzerland", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3442345" },
  { name: "Sarens", sector: "Business Services", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Belgium", trend: "flat", source: "https://cbonds.com/news/2537683/" },
  { name: "Selecta Group", sector: "Consumer & Retail", rating: "SD", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Switzerland", trend: "down", source: "https://cbonds.com/news/3402219/" },
  { name: "Sophos", sector: "Technology & Software", rating: "B-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3611224" },
  { name: "Sunrise Communications", sector: "Telecom", rating: "BB-", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Switzerland", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/13345290" },
  { name: "Theramex", sector: "Healthcare & Pharma", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "United Kingdom", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/11266057" },
  { name: "Unit4", sector: "Technology & Software", rating: "B", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Netherlands", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3324106" },
  { name: "Worldline", sector: "Financials", rating: "BB", agency: "S&P", asOf: "2026-09-14", jurisdiction: "France", trend: "flat", source: "https://investors.worldline.com/content/dam/investors-worldline-com/assets/documents/regulated-information/dept-and-rating/ratings-direct-research-update-worldline-s-a-downgraded-to-bb-following-weaker-than-expected-operating-performance-outlook-negative-3429307-aug-22-2025.pdf" },
  { name: "Zegona Communications", sector: "Telecom", rating: "BB", agency: "S&P", asOf: "2026-09-14", jurisdiction: "Spain", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3226235" },
  { name: "TITAN Cement Group", sector: "Building & Construction", rating: "BB+", agency: "S&P", asOf: "2025-11-07", jurisdiction: "Greece", trend: "up", source: "https://www.businesswire.com/news/home/20251107706563/en/TITAN-Groups-Credit-Rating-Improved-to-BB-with-Positive-Outlook-by-SP-Global-Ratings" },
  { name: "TK Elevator", sector: "Industrials", rating: "B", agency: "S&P", asOf: "2026-05-06", jurisdiction: "Germany", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3557474" },
  { name: "Aston Martin Lagonda", sector: "Automotive", rating: "CCC+", agency: "S&P", asOf: "2026-08-07", jurisdiction: "United Kingdom", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3607639" },
  // —— Sector-sweep additions (2026-09-20).
  { name: "Rexel", sector: "Industrials", rating: "BB+", agency: "S&P", asOf: "2025-07-08", jurisdiction: "France", trend: "flat", source: "https://cbonds.com/news/3483175/" },
  { name: "Aggreko (Albion Holdco)", sector: "Energy & Utilities", rating: "BB-", agency: "S&P", asOf: "2025-05-13", jurisdiction: "United Kingdom", trend: "flat", source: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/101623864" },
  { name: "Trivium Packaging", sector: "Packaging", rating: "B", agency: "S&P", asOf: "2024-11-14", jurisdiction: "Netherlands", trend: "flat", source: "https://cbonds.com/news/3166305/" },
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
