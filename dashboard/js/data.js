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
  { id: "spx",  name: "S&P 500",         region: "US",     level: 7509.20,  ytd: 9.6,   asOf: "2026-07-21", stooq: "^spx",   source: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-20-2026", keyMoment: { text: "Sank as the FOMC held at 3.50–3.75% but three members dissented for a hike — the first three-way hawkish dissent since September 2016 — a more hawkish outcome than priced, on top of renewed Iranian strikes on US forces overnight that pushed Brent up 7.9%.", src: "https://finance.yahoo.com/markets/live/stock-market-today-wednesday-july-29-dow-sp-500-nasdaq-082009165.html", srcName: "Yahoo Finance", date: "2026-07-29" } },
  { id: "ndq",  name: "Nasdaq Composite", region: "US",    level: 25837.21, ytd: 10.2,  asOf: "2026-07-21", stooq: "^ndq",   source: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-20-2026", keyMoment: { text: "Nasdaq 100 closed down 1.8% and in correction territory — over 11% below its June peak — after the FOMC's hawkish hold (three dissents for a hike) and with Microsoft/Meta reporting into a market Bloomberg describes as 'growing skeptical of AI' on capex guidance.", src: "https://www.bloomberg.com/news/articles/2026-07-29/microsoft-meta-earnings-face-a-market-growing-skeptical-of-ai", srcName: "Bloomberg", date: "2026-07-29" } },
  { id: "dji",  name: "Dow Jones",        region: "US",     level: 52224.64, ytd: 9.4,   asOf: "2026-07-21", stooq: "^dji",   source: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-20-2026", keyMoment: { text: "Posted its worst session of the year after the FOMC held at 3.50–3.75% with three members dissenting for a hike — the first three-way hawkish dissent since September 2016.", src: "https://www.forbes.com/sites/antoniopequenoiv/2026/07/29/dow-posts-its-worst-day-of-the-year-after-federal-reserve-maintains-interest-rates/", srcName: "Forbes", date: "2026-07-29" } },
  { id: "rut",  name: "Russell 2000",     region: "US",     level: 2987.40,  ytd: 20.1,  asOf: "2026-07-21", stooq: "^rut",   source: "https://finance.yahoo.com/quote/%5ERUT/" },
  { id: "sxxp", name: "Stoxx Europe 600", region: "Europe", level: 638.0,    ytd: null,  asOf: "2026-07-23", stooq: "^stoxx", source: "https://finance.yahoo.com/quote/%5ESTOXX/" },
  { id: "ukx",  name: "FTSE 100",         region: "Europe", level: 10573.67, ytd: 0.54,  asOf: "2026-07-17", stooq: "^ftse",  source: "https://www.nakitte.com/briefs/ftse-2026-07-20/" },
  { id: "dax",  name: "DAX",              region: "Europe", level: 25003.98, ytd: -0.34, asOf: "2026-07-23", stooq: "^dax",   source: "https://en.wikipedia.org/wiki/DAX" },
  { id: "cac",  name: "CAC 40",           region: "Europe", level: 8353.64,  ytd: -0.05, asOf: "2026-07-23", stooq: "^cac",   source: "https://en.wikipedia.org/wiki/CAC_40" },
  { id: "nkx",  name: "Nikkei 225",       region: "Asia",   level: 66514.0,  ytd: 38.5,  asOf: "2026-07-22", stooq: "^nkx",   source: "https://tradingeconomics.com/japan/stock-market", keyMoment: { text: "Asian shares rebounded on 30 Jul, snapping a three-day slide, as the chip-led selloff eased &mdash; Samsung Electronics rose 4.3% on a 250-fold profit jump and SK Hynix erased earlier losses to rise over 2%, with South Korea's Kospi (a regional AI-trade bellwether) up 2.2% after the government unveiled measures to curb leveraged-ETF demand.", src: "https://www.swissinfo.ch/eng/us-stock-futures-rise%2C-long-bonds-drop-after-fed%3A-markets-wrap/91818948", srcName: "Bloomberg (via Swissinfo)", date: "2026-07-30" } },
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
// jurisdiction, for the Equities dashboard heatmap. Each row: index name, latest
// level (points), latest-session % change, as-of date and a source URL. Every
// value is real + sourced (never fabricated); unknown fields are null. Values are
// the 29 Jul 2026 session (the hawkish-Fed-hold selloff in the US + the Asian
// AI-chip rout — TAIEX -3.8%, Nikkei/KOSPI down, Hang Seng bucking it). The daily
// refresh routine keeps level/chgPct/asOf current.
export const WORLD_INDICES = {
  asOf: "2026-07-29",
  regions: [
    { region: "US", rows: [
      { name: "S&P 500",          level: 7316.15,   chgPct: -1.52, asOf: "2026-07-29", source: "https://247wallst.com/investing/2026/07/29/stock-market-live-july-29-2026-sp-500-spy-slightly-higher-as-markets-wait-on-the-fed/" },
      { name: "Nasdaq Composite", level: 24442.94,  chgPct: -1.74, asOf: "2026-07-29", source: "https://finance.yahoo.com/markets/live/stock-market-today-wednesday-july-29-dow-sp-500-nasdaq-082009165.html" },
      { name: "Dow Jones",        level: 51594.14,  chgPct: -2.19, asOf: "2026-07-29", source: "https://finance.yahoo.com/markets/live/stock-market-today-wednesday-july-29-dow-sp-500-nasdaq-082009165.html" },
      { name: "Russell 2000",     level: 2906.44,   chgPct: -1.60, asOf: "2026-07-29", source: "https://www.gurufocus.com/economic_indicators/4448/russell-2000-index" },
    ] },
    { region: "South America", rows: [
      { name: "Ibovespa",   level: 176565,  chgPct: 0.70,  asOf: "2026-07-29", source: "https://www.riotimesonline.com/brazil-markets-ibovespa-real-wednesday-july-29-2026/" },
      { name: "S&P Merval", level: 3305316, chgPct: 0.65,  asOf: "2026-07-28", source: "https://www.riotimesonline.com/argentina-markets-merval-peso-tuesday-july-28-2026/" },
      { name: "IPSA",       level: 10880,   chgPct: -0.77, asOf: "2026-07-29", source: "https://www.riotimesonline.com/chile-markets-ipsa-peso-wednesday-july-29-2026/" },
    ] },
    { region: "UK", rows: [
      { name: "FTSE 100", level: 10908.41, chgPct: 0.34,  asOf: "2026-07-29", source: "https://www.bbntimes.com/financial/ftse-100-hits-10-908-41-as-london-bucks-the-global-selloff" },
      { name: "FTSE 250", level: 23996.81, chgPct: -0.03, asOf: "2026-07-29", source: "https://sundayguardianlive.com/business/uk-stock-market-today-july-29-ftse-100-trades-near-10900-as-london-stocks-extend-rally-ftse-250-ftse-all-share-gain-check-top-gainers-top-losers-what-should-investors-know-248701/" },
    ] },
    { region: "Europe", rows: [
      { name: "Euro Stoxx 50", level: 6260.83,  chgPct: -0.46, asOf: "2026-07-29", source: "https://www.google.com/finance/beta/quote/SX5E:INDEXSTOXX" },
      { name: "DAX",           level: 25411.08, chgPct: -0.21, asOf: "2026-07-29", source: "https://tradingeconomics.com/germany/stock-market" },
      { name: "CAC 40",        level: 8429.26,  chgPct: null,  asOf: "2026-07-29", source: "https://en.wikipedia.org/wiki/CAC_40" },
      { name: "IBEX 35",       level: 19743,    chgPct: 0.01,  asOf: "2026-07-29", source: "https://tradingeconomics.com/spain/stock-market" },
      { name: "FTSE MIB",      level: 51710,    chgPct: -0.66, asOf: "2026-07-29", source: "https://www.chinatechnews.com/2026/07/29/126379-stocks-mixed-amid-ai-rout-as-oil-plummets-on-us-iran-optimism-newsquawk-us-market-wrap" },
      { name: "SMI",           level: 14576,    chgPct: 1.07,  asOf: "2026-07-29", source: "https://www.chinatechnews.com/2026/07/29/126379-stocks-mixed-amid-ai-rout-as-oil-plummets-on-us-iran-optimism-newsquawk-us-market-wrap" },
      { name: "AEX",           level: 1093,     chgPct: 1.05,  asOf: "2026-07-29", source: "https://www.chinatechnews.com/2026/07/29/126379-stocks-mixed-amid-ai-rout-as-oil-plummets-on-us-iran-optimism-newsquawk-us-market-wrap" },
    ] },
    { region: "APAC", rows: [
      { name: "Nikkei 225",         level: 61434.19, chgPct: -1.49, asOf: "2026-07-29", source: "https://invezz.com/en-ae/news/2026/07/29/hang-seng-index-is-soaring-as-kospi-and-nikkei-225-implode-heres-why/" },
      { name: "Hang Seng",          level: 25807.92, chgPct: 1.96,  asOf: "2026-07-29", source: "https://www.bbntimes.com/companies/hong-kong-stock-exchange-hang-seng-surges-to-25-807-92-as-tech-and-ai-stocks-rally" },
      { name: "Shanghai Composite", level: 3828.5,   chgPct: 0.40,  asOf: "2026-07-29", source: "https://tradingeconomics.com/china/stock-market" },
      { name: "CSI 300",            level: 4549.72,  chgPct: -1.10, asOf: "2026-07-29", source: "https://www.marketscreener.com/quote/index/CSI-300-180586427/" },
      { name: "Nifty 50",           level: 24250.20, chgPct: 1.10,  asOf: "2026-07-29", source: "https://hdfcsky.com/news/market-close-report-july-29-2026-sensex-nifty-rise-1-percent-it-stocks" },
      { name: "BSE Sensex",         level: 77654.60, chgPct: 1.16,  asOf: "2026-07-29", source: "https://hdfcsky.com/news/market-close-report-july-29-2026-sensex-nifty-rise-1-percent-it-stocks" },
      { name: "S&P/ASX 200",        level: 9038.6,   chgPct: 1.01,  asOf: "2026-07-29", source: "https://www.investing.com/news/stock-market-news/australia-stocks-higher-at-close-of-trade-spasx-200-up-101-4818651" },
      { name: "KOSPI",              level: 5593.56,  chgPct: -1.23, asOf: "2026-07-29", source: "https://invezz.com/en-ae/news/2026/07/29/hang-seng-index-is-soaring-as-kospi-and-nikkei-225-implode-heres-why/" },
      { name: "TAIEX",              level: 40039.18, chgPct: -3.76, asOf: "2026-07-29", source: "https://www.taiwannews.com.tw/news/6410537" },
    ] },
  ],
};

// Government bond benchmark yields (2Y/5Y/10Y/30Y, in %) for the major economies
// in each jurisdiction, for the Fixed Income dashboard heatmap + tenor toggle.
// Each row: country, y2/y5/y10/y30 (null where a late-July value could not be
// verified — the 10Y benchmark is populated for every economy shown), an as-of
// date and a live source (tradingeconomics country pages carry the full live
// curve). Economies with no verifiable curve at all (Mexico, Switzerland) are
// omitted rather than shown as empty. Real + sourced; refreshed by the routine.
export const GOVT_YIELDS = {
  asOf: "2026-07-29",
  tenors: ["2Y", "5Y", "10Y", "30Y"],
  regions: [
    { region: "US", rows: [
      { country: "United States", y2: 4.32, y5: null, y10: 4.64, y30: 5.12, asOf: "2026-07-29", source: "https://tradingeconomics.com/united-states/government-bond-yield" },
    ] },
    { region: "South America", rows: [
      { country: "Brazil", y2: null, y5: null, y10: 14.86, y30: null, asOf: "2026-07-27", source: "https://en.macromicro.me/series/1824/brazil-bond-10-year" },
    ] },
    { region: "UK", rows: [
      { country: "United Kingdom", y2: null, y5: null, y10: 4.95, y30: 4.75, asOf: "2026-07-29", source: "https://tradingeconomics.com/united-kingdom/government-bond-yield" },
    ] },
    { region: "Europe", rows: [
      { country: "Germany", y2: 2.80, y5: null, y10: 3.12, y30: null, asOf: "2026-07-29", source: "https://tradingeconomics.com/germany/government-bond-yield" },
      { country: "France",  y2: null, y5: null, y10: 3.94, y30: 4.69, asOf: "2026-07-29", source: "https://tradingeconomics.com/france/government-bond-yield" },
      { country: "Italy",   y2: null, y5: null, y10: 3.98, y30: 4.75, asOf: "2026-07-29", source: "https://tradingeconomics.com/italy/government-bond-yield" },
      { country: "Spain",   y2: null, y5: null, y10: 3.56, y30: null, asOf: "2026-07-28", source: "https://tradingeconomics.com/spain/government-bond-yield" },
    ] },
    { region: "APAC", rows: [
      { country: "Japan",       y2: 1.44, y5: 1.995, y10: 2.75, y30: null, asOf: "2026-07-29", source: "https://tradingeconomics.com/japan/government-bond-yield" },
      { country: "Australia",   y2: 4.61, y5: 4.61,  y10: 4.90, y30: null, asOf: "2026-07-29", source: "https://tradingeconomics.com/australia/government-bond-yield" },
      { country: "China",       y2: 1.62, y5: null,  y10: 2.10, y30: 2.50, asOf: "2026-07-22", source: "https://centralbank.watch/tools/yield-curve/china-yield-curve/" },
      { country: "India",       y2: null, y5: null,  y10: 6.82, y30: null, asOf: "2026-07-30", source: "https://tradingeconomics.com/india/government-bond-yield" },
      { country: "South Korea", y2: null, y5: null,  y10: 4.40, y30: null, asOf: "2026-07-15", source: "https://tradingeconomics.com/south-korea/government-bond-yield" },
    ] },
  ],
};
