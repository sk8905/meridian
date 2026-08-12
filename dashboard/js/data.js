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
  { id: "spx",  name: "S&P 500",         region: "US",     level: 7509.20,  ytd: 9.6,   asOf: "2026-07-21", stooq: "^spx",   source: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-20-2026", keyMoment: { text: "Closed at a fresh record 7,757.64 (+0.62%) as a shock 23,000 July payrolls decline was read as dovish, capping a second straight week of gains.", src: "https://www.bloomberg.com/news/articles/2026-08-07/us-employers-unexpectedly-shed-jobs-unemployment-rate-falls", srcName: "Bloomberg", date: "2026-08-07" } },
  { id: "ndq",  name: "Nasdaq Composite", region: "US",    level: 25837.21, ytd: 10.2,  asOf: "2026-07-21", stooq: "^ndq",   source: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-20-2026", keyMoment: { text: "Jumped 1.3% to 26,690.62 alongside the S&P 500's record close as traders read July's shock payrolls miss as taking a September Fed hike largely off the table.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-aug-7-2026", srcName: "TheStreet", date: "2026-08-07" } },
  { id: "dji",  name: "Dow Jones",        region: "US",     level: 52224.64, ytd: 9.4,   asOf: "2026-07-21", stooq: "^dji",   source: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-20-2026", keyMoment: { text: "Futures inched up even as the Nasdaq slipped, with earnings still rolling in and traders weighing jobless claims against the rates outlook.", src: "https://finance.yahoo.com/markets/live/stock-market-today-thursday-august-6-dow-sp-nasdaq-091620000.html", srcName: "Yahoo Finance", date: "2026-08-06" } },
  { id: "rut",  name: "Russell 2000",     region: "US",     level: 2987.40,  ytd: 20.1,  asOf: "2026-07-21", stooq: "^rut",   source: "https://finance.yahoo.com/quote/%5ERUT/" },
  { id: "sxxp", name: "Stoxx Europe 600", region: "Europe", level: 638.0,    ytd: null,  asOf: "2026-07-23", stooq: "^stoxx", source: "https://finance.yahoo.com/quote/%5ESTOXX/" },
  { id: "ukx",  name: "FTSE 100",         region: "Europe", level: 10573.67, ytd: 0.54,  asOf: "2026-07-17", stooq: "^ftse",  source: "https://www.nakitte.com/briefs/ftse-2026-07-20/", keyMoment: { text: "Fell for a third straight session on defensive-stock weakness as investors awaited the day's US July CPI print, with sterling flat near 1.3500 into the release.", src: "https://www.bloomberg.com/news/live-blog/2026-08-12/ftse-100-live-updates-pound-gilts-us-iran-trump-oil-prices-gold-ai-stocks-what-s-moving-uk-markets-right-now-markets-today-mspo1di9", srcName: "Bloomberg", date: "2026-08-12" } },
  { id: "dax",  name: "DAX",              region: "Europe", level: 25003.98, ytd: -0.34, asOf: "2026-07-23", stooq: "^dax",   source: "https://en.wikipedia.org/wiki/DAX" },
  { id: "cac",  name: "CAC 40",           region: "Europe", level: 8353.64,  ytd: -0.05, asOf: "2026-07-23", stooq: "^cac",   source: "https://en.wikipedia.org/wiki/CAC_40" },
  { id: "nkx",  name: "Nikkei 225",       region: "Asia",   level: 66514.0,  ytd: 38.5,  asOf: "2026-07-22", stooq: "^nkx",   source: "https://tradingeconomics.com/japan/stock-market", keyMoment: { text: "Fell over 2% at Monday's Asian open on a stronger yen after Japan and the US staged their first coordinated currency intervention since 2011, with Brent also down as much as 6% on Trump's cancelled Iran strikes and South Korea's Kospi dropping more than 4% as chip-sector weakness resumed.", src: "https://investinglive.com/news/market-moving-news-for-asian-trading-on-3-august-oil-slumps-on-trump-s-iran-claims/", srcName: "InvestingLive", date: "2026-08-03" } },
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

// ---------------------------------------------------------------------------
// World equity indices — major LOCAL benchmarks (not ETFs) grouped by
// jurisdiction, for the Equities dashboard heatmap (same 1W/1M/3M/6M/1Y windows
// as the ETF-flows heatmap). Each row: index name, latest level (points), the
// PRICE RETURN over each window (w1/m1/m3/m6/y1, %), as-of date and a source URL.
// This is the SEED + fallback: the live /api/worldindices computes the exact
// returns from Yahoo price history and overrides these at runtime. Every seed
// value is real + sourced (never fabricated); windows not cleanly publishable
// (3M/6M and many 1W) are null in the seed and filled live. Refreshed by the
// daily routine.
export const WORLD_INDICES = {
  asOf: "2026-07-29",
  regions: [
    { region: "US", rows: [
      { name: "S&P 500",          level: 7316.15,   w1: -0.6,  m1: -0.79,  m3: null, m6: null, y1: 17.9,  asOf: "2026-07-29", source: "https://tradingeconomics.com/united-states/stock-market" },
      { name: "Nasdaq Composite", level: 24442.94,  w1: null,  m1: -2.52,  m3: null, m6: null, y1: 17.39, asOf: "2026-07-29", source: "https://ycharts.com/indices/%5EIXIC" },
      { name: "Dow Jones",        level: 51594.14,  w1: null,  m1: null,   m3: null, m6: null, y1: 20.1,  asOf: "2026-07-29", source: "https://www.investing.com/indices/us-30-historical-data" },
      { name: "Russell 2000",     level: 2906.44,   w1: null,  m1: -3.45,  m3: null, m6: null, y1: 31.4,  asOf: "2026-07-29", source: "https://www.gurufocus.com/economic_indicators/4448/russell-2000-index" },
    ] },
    { region: "South America", rows: [
      { name: "Ibovespa",   level: 176565,  w1: null, m1: 1.88, m3: null, m6: null, y1: 32.95, asOf: "2026-07-29", source: "https://tradingeconomics.com/brazil/stock-market" },
      { name: "S&P Merval", level: 3305316, w1: null, m1: null, m3: null, m6: null, y1: null,  asOf: "2026-07-28", source: "https://www.riotimesonline.com/argentina-markets-merval-peso-tuesday-july-28-2026/" },
      { name: "IPSA",       level: 10880,   w1: null, m1: null, m3: null, m6: null, y1: null,  asOf: "2026-07-29", source: "https://www.riotimesonline.com/chile-markets-ipsa-peso-wednesday-july-29-2026/" },
    ] },
    { region: "UK", rows: [
      { name: "FTSE 100", level: 10908.41, w1: null, m1: 3.92, m3: null, m6: null, y1: 18.22, asOf: "2026-07-29", source: "https://tradingeconomics.com/united-kingdom/stock-market" },
      { name: "FTSE 250", level: 23996.81, w1: null, m1: null, m3: null, m6: null, y1: null,  asOf: "2026-07-29", source: "https://www.fidelity.co.uk/shares/ftse-250/" },
    ] },
    { region: "Europe", rows: [
      { name: "Euro Stoxx 50", level: 6260.83,  w1: -0.98, m1: -1.47, m3: null, m6: null, y1: 15.61, asOf: "2026-07-29", source: "https://tradingeconomics.com/euro-area/stock-market" },
      { name: "DAX",           level: 25411.08, w1: null,  m1: 3.21,  m3: null, m6: null, y1: 5.17,  asOf: "2026-07-29", source: "https://tradingeconomics.com/germany/stock-market" },
      { name: "CAC 40",        level: 8429.26,  w1: null,  m1: null,  m3: null, m6: null, y1: null,  asOf: "2026-07-29", source: "https://tradingeconomics.com/france/stock-market" },
      { name: "IBEX 35",       level: 19743,    w1: 2.0,   m1: null,  m3: null, m6: null, y1: null,  asOf: "2026-07-29", source: "https://tradingeconomics.com/spain/stock-market" },
      { name: "FTSE MIB",      level: 51710,    w1: -0.15, m1: null,  m3: null, m6: null, y1: null,  asOf: "2026-07-29", source: "https://tradingeconomics.com/italy/stock-market" },
      { name: "SMI",           level: 14576,    w1: null,  m1: null,  m3: null, m6: null, y1: 20.08, asOf: "2026-07-29", source: "https://finance.yahoo.com/quote/%5ESSMI/history/" },
      { name: "AEX",           level: 1093,     w1: null,  m1: 1.01,  m3: null, m6: null, y1: 19.70, asOf: "2026-07-29", source: "https://tradingeconomics.com/aex:ind" },
    ] },
    { region: "APAC", rows: [
      { name: "Nikkei 225",         level: 61434.19, w1: null, m1: -10.85, m3: null, m6: null, y1: 53.64, asOf: "2026-07-29", source: "https://tradingeconomics.com/japan/stock-market" },
      { name: "Hang Seng",          level: 25807.92, w1: null, m1: 12.22,  m3: null, m6: null, y1: 1.99,  asOf: "2026-07-29", source: "https://tradingeconomics.com/hong-kong/stock-market" },
      { name: "Shanghai Composite", level: 3828.5,   w1: null, m1: -6.49,  m3: null, m6: null, y1: 5.88,  asOf: "2026-07-29", source: "https://tradingeconomics.com/china/stock-market" },
      { name: "CSI 300",            level: 4549.72,  w1: null, m1: null,   m3: null, m6: null, y1: 23.63, asOf: "2026-07-29", source: "https://www.gurufocus.com/economic_indicators/4424/csi-300-index" },
      { name: "Nifty 50",           level: 24250.20, w1: -1.9, m1: 1.36,   m3: null, m6: null, y1: null,  asOf: "2026-07-29", source: "https://hdfcsky.com/news/market-close-report-july-29-2026-sensex-nifty-rise-1-percent-it-stocks" },
      { name: "BSE Sensex",         level: 77654.60, w1: null, m1: null,   m3: null, m6: null, y1: null,  asOf: "2026-07-29", source: "https://hdfcsky.com/news/market-close-report-july-29-2026-sensex-nifty-rise-1-percent-it-stocks" },
      { name: "S&P/ASX 200",        level: 9038.6,   w1: null, m1: 0.56,   m3: null, m6: null, y1: 3.21,  asOf: "2026-07-29", source: "https://tradingeconomics.com/australia/stock-market" },
      { name: "KOSPI",              level: 5593.56,  w1: null, m1: -31.56, m3: null, m6: null, y1: 75.10, asOf: "2026-07-29", source: "https://tradingeconomics.com/south-korea/stock-market" },
      { name: "TAIEX",              level: 40039.18, w1: null, m1: null,   m3: null, m6: null, y1: null,  asOf: "2026-07-29", source: "https://www.taiwannews.com.tw/news/6410537" },
    ] },
  ],
};

// Government bond benchmark yields (2Y/5Y/10Y/30Y, in %) for the major economies
// in each jurisdiction, for the Fixed Income dashboard heatmap. Each row: country,
// y2/y5/y10/y30, an as-of date and a source URL. This is the SEED + fallback: the
// live /api/govyields (Stooq keyless yield series) refreshes these at runtime.
// Every value is real + sourced (never fabricated). Nulls are genuine
// non-issuance / no-benchmark cases: Brazil has no liquid 30Y, Japan's late-July
// 30Y and China's 5Y had no consistent print. Refreshed by the daily routine.
export const GOVT_YIELDS = {
  asOf: "2026-07-29",
  tenors: ["2Y", "5Y", "10Y", "30Y"],
  regions: [
    { region: "US", rows: [
      { country: "United States", y2: 4.31, y5: 4.35, y10: 4.65, y30: 5.12, asOf: "2026-07-28", source: "https://www.worldgovernmentbonds.com/country/united-states/" },
    ] },
    { region: "South America", rows: [
      { country: "Brazil", y2: 14.07, y5: 14.98, y10: 14.86, y30: null, asOf: "2026-07-27", source: "https://tradingeconomics.com/brazil/government-bond-yield" },
      { country: "Mexico", y2: null,  y5: null,  y10: 9.16,  y30: null, asOf: "2026-07-24", source: "https://tradingeconomics.com/mexico/government-bond-yield" },
    ] },
    { region: "UK", rows: [
      { country: "United Kingdom", y2: 4.43, y5: 4.39, y10: 4.95, y30: 4.75, asOf: "2026-07-29", source: "https://tradingeconomics.com/united-kingdom/government-bond-yield" },
    ] },
    { region: "Europe", rows: [
      { country: "Germany",     y2: 2.62, y5: 2.71, y10: 3.19, y30: 3.48, asOf: "2026-07-27", source: "https://tradingeconomics.com/germany/government-bond-yield" },
      { country: "France",      y2: 2.79, y5: 3.11, y10: 3.94, y30: 4.49, asOf: "2026-07-24", source: "https://tradingeconomics.com/france/government-bond-yield" },
      { country: "Italy",       y2: 2.80, y5: 3.05, y10: 3.98, y30: 4.75, asOf: "2026-07-29", source: "https://tradingeconomics.com/italy/government-bond-yield" },
      { country: "Spain",       y2: 2.76, y5: 2.97, y10: 3.50, y30: 4.16, asOf: "2026-07-24", source: "https://tradingeconomics.com/spain/government-bond-yield" },
      { country: "Switzerland", y2: 0.09, y5: 0.14, y10: 0.36, y30: 0.66, asOf: "2026-07-20", source: "https://www.worldgovernmentbonds.com/country/switzerland/" },
    ] },
    { region: "APAC", rows: [
      { country: "Japan",       y2: 1.44, y5: 2.00, y10: 2.76, y30: null, asOf: "2026-07-28", source: "https://tradingeconomics.com/japan/government-bond-yield" },
      { country: "Australia",   y2: 4.61, y5: 4.61, y10: 4.90, y30: 5.39, asOf: "2026-07-29", source: "https://tradingeconomics.com/australia/government-bond-yield" },
      { country: "China",       y2: 1.62, y5: null, y10: 2.10, y30: 2.50, asOf: "2026-07-22", source: "https://centralbank.watch/tools/yield-curve/china-yield-curve/" },
      { country: "India",       y2: 6.41, y5: 6.91, y10: 6.80, y30: 7.81, asOf: "2026-07-27", source: "https://tradingeconomics.com/india/government-bond-yield" },
      { country: "South Korea", y2: 3.33, y5: 3.59, y10: 3.69, y30: 3.61, asOf: "2026-07-20", source: "https://www.worldgovernmentbonds.com/country/south-korea/" },
    ] },
  ],
};

// Curated government-bond-yield CHANGES (basis points) by country → tenor, for the
// Fixed Income yield-change heatmap. Trading Economics country pages publish the
// current level plus the trailing 1-month (m1) and 1-year (y1) change; 1W/3M/6M
// (w1/m3/m6) are not published there and stay null. The US full curve is
// additionally refreshed LIVE + all windows via /api/govyields (FRED daily CMT),
// which overrides these. Real + sourced; refreshed by the daily routine.
export const GOVT_YIELD_CHG = {
  "United States": { y2: { m1: 4, y1: 26 }, y5: { m1: 13, y1: 40 }, y10: { m1: 22, y1: 33 }, y30: { m1: 23, y1: 31 } },
  "Brazil":        { y10: { m1: 35, y1: 68 } },
  "Mexico":        { y10: { m1: 21, y1: 10 } },
  "United Kingdom": { y2: { m1: 13, y1: 45 }, y10: { m1: 23, y1: 42 }, y30: { m1: 22, y1: 33 } },
  "Germany":       { y2: { m1: 24, y1: 80 }, y10: { m1: 30, y1: 48 }, y30: { m1: 20, y1: 48 } },
  "France":        { y10: { m1: 40, y1: 62 }, y30: { m1: 22, y1: 59 } },
  "Italy":         { y10: { m1: 33, y1: 42 }, y30: { m1: 26, y1: 36 } },
  "Spain":         { y10: { m1: 21, y1: 29 } },
  "Switzerland":   { y10: { m1: 13, y1: 7 } },
  "Japan":         { y2: { m1: 9, y1: 65 }, y10: { m1: 10, y1: 125 }, y30: { m1: 1, y1: 88 } },
  "Australia":     { y2: { m1: 5, y1: 117 }, y10: { m1: 21, y1: 72 } },
  "China":         { y10: { m1: -3, y1: -1 } },
  "India":         { y10: { m1: 12, y1: 45 } },
  "South Korea":   { y10: { m1: 17, y1: 154 } },
};

// Private-credit pulse for the Credit dashboard — Fitch's U.S. Private Credit
// Default Rate (PCDR) and market-context metrics. Every figure is real + sourced
// (never fabricated); refreshed by the routine. PCDR is Fitch's "U.S. Private
// Credit and Middle Market Performance Monitor" (2Q26).
export const PRIVATE_CREDIT = {
  asOf: "2026-07",
  headline: "Fitch's U.S. Private Credit Default Rate (PCDR) hit a record 6.0% for the trailing 12 months ended 2Q26 — up from the prior high of 5.7% in 1Q26, and roughly double the ~3% broadly-syndicated loan default rate.",
  metrics: [
    { k: "Private Credit Default Rate", v: "6.0%", sub: "TTM 2Q26 · record · up from 5.7% (1Q26)", src: "https://www.fundssociety.com/en/news/alternatives/u-s-private-credit-default-rate-continues-to-climb/", srcName: "Fitch 2Q26 Monitor (via Funds Society)" },
    { k: "Defaults recorded (TTM)", v: "32", sub: "private-credit issuers, 2Q26", src: "https://www.tradingview.com/news/reuters.com,2026:newsml_FWN41V0W8:0-fitch-ratings-u-s-private-credit-default-rate-hits-a-high-of-6-0-in-april-2026/", srcName: "Fitch (via Reuters/TradingView)" },
    { k: "Broadly-syndicated loan default (fcst)", v: "3.0–3.5%", sub: "2026, Fitch — set to ease", src: "https://www.investmentexecutive.com/news/research-and-markets/u-s-leveraged-loan-defaults-to-ease-in-2026-fitch/", srcName: "Fitch (via Investment Executive)" },
    { k: "Market size (AUM)", v: "~$2.0tn", sub: "2026 est. · ~$4tn by 2030", src: "https://www.moodys.com/web/en/us/insights/credit-risk/outlooks/private-credit-2026.html", srcName: "Moody's" },
    { k: "BDC non-accruals", v: "~1.2%", sub: "of portfolios (Q2'25)", src: "https://www.withintelligence.com/insights/what-is-actually-going-on-in-bdc-portfolios/", srcName: "With Intelligence" },
  ],
};
