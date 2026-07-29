// =============================================================================
// dashboard/js/data.js — CURATED seed + reference data for the Dashboard tab
// (Macro / Equities / Credit overviews). Live figures (equity index closes,
// ICE BofA OAS credit spreads, VIX) are fetched at runtime from the Worker
// (/api/markets, FRED/Stooq, edge-cached) and OVERRIDE the `level`/`spread`
// seeds here; everything else (sources, as-of dates, IPO pipeline, the Stress
// tracker, sector list) is curated and refreshed by the routine. Never
// fabricate — every figure keeps a real source URL + asOf. Values verified
// July 2026.
// =============================================================================

// ---- Equities -------------------------------------------------------------
// Major global indices — seed close + YTD; the live feed refreshes `level`/`ytd`.
export const EQ_INDICES = [
  { id: "spx",  name: "S&P 500",         region: "US",     level: 7509.20,  ytd: 9.6,   asOf: "2026-07-21", stooq: "^spx",   source: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-20-2026", keyMoment: { text: "Futures dipped 0.12% pre-market on 29 Jul after Iran's intercepted missile attack on US forces sent oil about 5% higher, with today's FOMC decision still expected to be a hold.", src: "https://www.cnbc.com/2026/07/28/stock-market-today-live-updates.html", srcName: "CNBC", date: "2026-07-29" } },
  { id: "ndq",  name: "Nasdaq Composite", region: "US",    level: 25837.21, ytd: 10.2,  asOf: "2026-07-21", stooq: "^ndq",   source: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-20-2026", keyMoment: { text: "Nasdaq 100 futures fell 0.49% pre-market on 29 Jul as Iran's intercepted missile attack on US forces drove oil about 5% higher hours ahead of today's FOMC decision.", src: "https://www.cnbc.com/2026/07/28/stock-market-today-live-updates.html", srcName: "CNBC", date: "2026-07-29" } },
  { id: "dji",  name: "Dow Jones",        region: "US",     level: 52224.64, ytd: 9.4,   asOf: "2026-07-21", stooq: "^dji",   source: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-20-2026" },
  { id: "rut",  name: "Russell 2000",     region: "US",     level: 2987.40,  ytd: 20.1,  asOf: "2026-07-21", stooq: "^rut",   source: "https://finance.yahoo.com/quote/%5ERUT/" },
  { id: "sxxp", name: "Stoxx Europe 600", region: "Europe", level: 638.0,    ytd: null,  asOf: "2026-07-23", stooq: "^stoxx", source: "https://finance.yahoo.com/quote/%5ESTOXX/" },
  { id: "ukx",  name: "FTSE 100",         region: "Europe", level: 10573.67, ytd: 0.54,  asOf: "2026-07-17", stooq: "^ftse",  source: "https://www.nakitte.com/briefs/ftse-2026-07-20/" },
  { id: "dax",  name: "DAX",              region: "Europe", level: 25003.98, ytd: -0.34, asOf: "2026-07-23", stooq: "^dax",   source: "https://en.wikipedia.org/wiki/DAX" },
  { id: "cac",  name: "CAC 40",           region: "Europe", level: 8353.64,  ytd: -0.05, asOf: "2026-07-23", stooq: "^cac",   source: "https://en.wikipedia.org/wiki/CAC_40" },
  { id: "nkx",  name: "Nikkei 225",       region: "Asia",   level: 66514.0,  ytd: 38.5,  asOf: "2026-07-22", stooq: "^nkx",   source: "https://tradingeconomics.com/japan/stock-market", keyMoment: { text: "Fell 1.49% to 61,434.19 (a near two-month intraday low) on 29 Jul as South Korea's KOSPI and KOSDAQ triggered circuit breakers for a historic second straight day &mdash; the first back-to-back trigger ever &mdash; after SK Hynix (-9.6%) and Samsung (-5.2%) extended the region's AI-chip-driven rout despite SK Hynix's sixfold profit jump.", src: "https://www.koreajoongangdaily.com/business/circuit-breakers-halt-kospi-kosdaq-for-2nd-straight-day-as-benchmark-drops-below-6000/12797430", srcName: "Korea JoongAng Daily", date: "2026-07-29" } },
  { id: "hsi",  name: "Hang Seng",        region: "Asia",   level: 24892.66, ytd: -0.95, asOf: "2026-07-22", stooq: "^hsi",   source: "https://finance.yahoo.com/quote/%5EHSI/" },
];

// S&P 500 GICS sectors — YTD %, sorted best→worst by the view. asOf month-end.
export const EQ_SECTORS = {
  asOf: "2026-06-30",
  source: "https://www.spglobal.com/spdji/en/documents/performance-reports/dashboard-us-sector.pdf",
  rows: [
    { name: "Energy", ytd: 25.37 }, { name: "Materials", ytd: 16.2 }, { name: "Industrials", ytd: 16.0 },
    { name: "Health Care", ytd: 10.6 }, { name: "Financials", ytd: 9.4 }, { name: "Consumer Discretionary", ytd: 7.4 },
    { name: "Consumer Staples", ytd: null }, { name: "Real Estate", ytd: null }, { name: "Utilities", ytd: 1.3 },
    { name: "Communication Services", ytd: -1.1 }, { name: "Information Technology", ytd: -2.43 },
  ],
};

// Forward P/E of the majors (valuation) — percentile context computed in the view.
export const EQ_VALUATION = [
  { name: "S&P 500",         fwdPE: 22.2,  asOf: "2026-07-17", source: "https://insight.factset.com/sp-500-earnings-season-update-july-17-2026" },
  { name: "Stoxx Europe 600", fwdPE: 15.9, asOf: "2026-01-01", source: "https://siblisresearch.com/data/europe-pe-ratio/" },
  { name: "FTSE 100",        fwdPE: 13.35, asOf: "2026-01-01", source: "https://siblisresearch.com/data/ftse-100-cape-pe-yield/" },
  { name: "Nikkei 225",      fwdPE: 21.0,  asOf: "2026-04-30", source: "https://en.macromicro.me/charts/95007/japan-nikkei225" },
];

// Volatility gauges — VIX / VSTOXX. Live feed refreshes `level`; bands in the view.
export const EQ_VOL = [
  { id: "vix",    name: "VIX",    level: 16.64, asOf: "2026-07-22", fred: "VIXCLS", source: "https://convextrade.com/metrics/vixcls" },
  { id: "vstoxx", name: "VSTOXX", level: 20.60, asOf: "2026-07-10", fred: null,     source: "https://tradingeconomics.com/vstoxx:ind" },
];

// IPO / ECM pipeline — notable 2026 listings (curated, refreshed by the routine).
export const EQ_IPO = [
  { company: "SpaceX",       exchange: "Nasdaq",  size: "$75bn raised",   timing: "priced 2026-06",   status: "Priced",   source: "https://money.usnews.com/investing/articles/new-and-upcoming-ipos-in-2026" },
  { company: "SK hynix (US)", exchange: "Nasdaq", size: "$26.5bn",        timing: "priced 2026-07-10", status: "Priced",   source: "https://stockanalysis.com/ipos/2026/" },
  { company: "Quantinuum",   exchange: "Nasdaq",  size: "$1.68bn",        timing: "priced 2026-06",   status: "Priced",   source: "https://money.usnews.com/investing/articles/new-and-upcoming-ipos-in-2026" },
  { company: "OpenAI",       exchange: "US (TBD)", size: "large-cap",     timing: "2026 H2",          status: "Filed",    source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
  { company: "Anthropic",    exchange: "US (TBD)", size: "~$965bn valn",  timing: "filed 2026-06",    status: "Filed",    source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
  { company: "Databricks",   exchange: "Nasdaq",  size: "$134bn valn",    timing: "2026 H2",          status: "Rumoured", source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
  { company: "Revolut",      exchange: "Nasdaq",  size: "~$75bn target",  timing: "2026 H2",          status: "Rumoured", source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
  { company: "Crusoe Energy", exchange: "US (TBD)", size: "~$13bn target", timing: "2026 Q4",         status: "Rumoured", source: "https://news.clateway.com/upcoming-ipos-2026-spacex-openai-10-more-to-watch-43090.html" },
];

// ---- Credit ---------------------------------------------------------------
// ICE BofA OAS spread stack (bps) — seed values; the live feed (FRED) refreshes
// `bps`. `fred` is the FRED series id. Ordered IG→CCC (the credit stack).
export const CR_SPREADS = [
  { id: "ig",  name: "US IG",  fred: "BAMLC0A0CM",     bps: null, asOf: null, source: "https://fred.stlouisfed.org/series/BAMLC0A0CM" },
  { id: "hy",  name: "US HY",  fred: "BAMLH0A0HYM2",   bps: null, asOf: null, source: "https://fred.stlouisfed.org/series/BAMLH0A0HYM2" },
  { id: "bb",  name: "BB",     fred: "BAMLH0A1HYBB",   bps: null, asOf: null, source: "https://fred.stlouisfed.org/series/BAMLH0A1HYBB" },
  { id: "b",   name: "B",      fred: "BAMLH0A2HYB",    bps: null, asOf: null, source: "https://fred.stlouisfed.org/series/BAMLH0A2HYB" },
  { id: "ccc", name: "CCC",    fred: "BAMLH0A3HYC",    bps: null, asOf: null, source: "https://fred.stlouisfed.org/series/BAMLH0A3HYC" },
];

// "Stress" — high-profile distressed / stressed corporate debtors in focus.
// Each verified & sourced; refreshed by the routine. Ordered by prominence.
export const CR_STRESS = [
  { name: "Altice France (SFR)", sector: "Telecoms", hq: "Paris, FR", debt: "€15.5bn net", status: "In restructuring", note: "Europe's largest restructuring cut ~€8.6bn term debt via debt-for-equity (creditors 45%); Drahi retains control amid asset-shift tensions.", latest: "2025-12", source: "https://www.bloomberg.com/news/articles/2025-12-02/billionaire-drahi-strikes-back-with-moves-bashing-altice-lenders" },
  { name: "SpaceX", sector: "Aerospace", hq: "Hawthorne, US", debt: "$25bn bonds", status: "Bonds below issue", note: "Inaugural $25bn multi-tranche bond (post-June IPO, to repay a $20bn bridge) — all five tranches slipped below issue price; 2056s fell to ~94.5.", latest: "2026-07", source: "https://www.advisorperspectives.com/articles/2026/06/26/bond-traders-stunned-losses-spacexs-debt-growing" },
  { name: "Thames Water", sector: "Water utility", hq: "Reading, UK", debt: "~£19bn", status: "In restructuring", note: "UK's largest water utility recapitalised by senior creditors; write-offs of 25% Class A, all Class B and £2.5bn sub. RP2 looms; special administration the fallback.", latest: "2026-07", source: "https://know.creditsights.com/insights/emea-special-situations-thames-water-creditors-seek-in-principle-takeover-agreement-in-coming-weeks-rp2-could-slide-into-h2-2026/" },
  { name: "EchoStar (Dish DBS)", sector: "Satellite/Telecom", hq: "Englewood, US", debt: "~$10bn", status: "Chapter 11", note: "Prepackaged Chapter 11 on ~$10bn after delays to a $23bn AT&T spectrum sale left it unable to repay $2bn of 7.75% notes; 88%+ creditor support.", latest: "2026-07", source: "https://satnews.com/2026/07/01/echostars-dish-dbs-initiates-prepackaged-chapter-11-restructuring-to-resolve-impending-senior-note-maturities/" },
  { name: "New Fortress Energy", sector: "Energy / LNG", hq: "New York, US", debt: "~$9.3bn", status: "In restructuring", note: "Going-concern doubt amid covenant risk and springing maturities on $510.9m 2026 notes; entered forbearance after missing a 2028 TLB interest payment.", latest: "2026-06", source: "https://news.bloomberglaw.com/bankruptcy-law/new-fortress-energy-bonds-loan-tumble-on-refinancing-concerns" },
  { name: "Grifols", sector: "Healthcare", hq: "Barcelona, ES", debt: "€9.6bn", status: "Refinancing risk", note: "Blood-plasma group, leverage 4.2x, refinancing a 2027 maturity wall in stages; risk elevated after the 2024 short-seller episode and failed take-private.", latest: "2026-02", source: "https://www.stocktitan.net/sec-filings/GRFS/20-f-grifols-sa-files-annual-report-foreign-issuer-25ea80ea26f9.html" },
  { name: "Ardagh Group", sector: "Packaging", hq: "Luxembourg", debt: "$8.5bn net", status: "In restructuring", note: "Recapitalisation swapped ~$4.3bn senior unsecured & PIK for equity; unsecured bondholders took 92.5%; net leverage 6.0x from 7.4x.", latest: "2025-11", source: "https://www.kirkland.com/news/press-release/2025/11/kirkland-advises-ardagh-group-on-successful-recapitalization" },
  { name: "Casino Guichard", sector: "Retail / Grocery", hq: "Saint-Étienne, FR", debt: "€1.5bn net", status: "Scheme / safeguard", note: "Restructured in 2024, now seeking a fresh ~43% writedown and new shareholder capital; net debt rose €290m; TLB lenders refusing consent.", latest: "2026-07", source: "https://www.bloomberg.com/news/articles/2025-11-24/casino-eyes-43-debt-haircut-seeks-new-funds-from-shareholder" },
  { name: "Aston Martin Lagonda", sector: "Automotive", hq: "Gaydon, UK", debt: "£1.38bn net", status: "Refinancing risk", note: "Loss-making luxury carmaker with 10%+ 2029 senior secured notes; ad hoc bondholder group retained Jefferies amid mounting losses ahead of the 2029 wall.", latest: "2026-07", source: "https://www.bloomberg.com/news/articles/2026-07-21/blackrock-vs-blackrock-aston-martin-debt-revamp-risks-in-house-clash" },
  { name: "Wolfspeed", sector: "Semiconductors", hq: "Durham, US", debt: "$2.1bn", status: "Emerged from Ch.11", note: "Silicon-carbide chipmaker filed prepackaged Chapter 11 in Jul 2025, emerged after 91 days cutting debt ~70% and extending maturities to 2030.", latest: "2025-09", source: "https://investor.wolfspeed.com/news/news-details/2025/Wolfspeed-Successfully-Completes-Financial-Restructuring-Emerges-as-Financially-Stronger-Company-Well-Positioned-in-Silicon-Carbide-Market/default.aspx" },
];

export const DASH_ASOF = "2026-07-24";
