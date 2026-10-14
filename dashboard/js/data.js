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
  {
    "id": "spx",
    "name": "S&P 500",
    "region": "US",
    "level": 7805.45,
    "ytd": 14.02,
    "asOf": "2026-10-13",
    "stooq": "^spx",
    "source": "https://finance.yahoo.com/quote/%5EGSPC",
    "keyMoment": {
      "text": "The S&amp;P 500 gained 0.7% on Friday as a weaker-than-expected September jobs report (29,000 payrolls) cemented expectations that the Fed will hold in October, with tech leading.",
      "src": "https://finance.yahoo.com/markets/live/stock-market-today-friday-october-2-dow-sp-500-nasdaq-september-jobs-report-080623878.html",
      "srcName": "Yahoo Finance",
      "date": "2026-10-02"
    }
  },
  {
    "id": "ndq",
    "name": "Nasdaq Composite",
    "region": "US",
    "level": 27204.38,
    "ytd": 17.05,
    "asOf": "2026-10-13",
    "stooq": "^ndq",
    "source": "https://finance.yahoo.com/quote/%5EIXIC",
    "keyMoment": {
      "text": "The Nasdaq Composite surged 1.2% on Friday, the strongest of the three US benchmarks, as tech led the rally after the soft jobs report cooled Fed rate-hike expectations.",
      "src": "https://finance.yahoo.com/markets/live/stock-market-today-friday-october-2-dow-sp-500-nasdaq-september-jobs-report-080623878.html",
      "srcName": "Yahoo Finance",
      "date": "2026-10-02"
    }
  },
  {
    "id": "dji",
    "name": "Dow Jones",
    "region": "US",
    "level": 51670.1,
    "ytd": 7.5,
    "asOf": "2026-10-13",
    "stooq": "^dji",
    "source": "https://finance.yahoo.com/quote/%5EDJI",
    "keyMoment": {
      "text": "The Dow rose 0.5% on Friday as the weak September payrolls print (29,000 jobs) faded Fed rate-hike expectations.",
      "src": "https://finance.yahoo.com/markets/live/stock-market-today-friday-october-2-dow-sp-500-nasdaq-september-jobs-report-080623878.html",
      "srcName": "Yahoo Finance",
      "date": "2026-10-02"
    }
  },
  {
    "id": "rut",
    "name": "Russell 2000",
    "region": "US",
    "level": 2783.37,
    "ytd": 12.15,
    "asOf": "2026-10-13",
    "stooq": "^rut",
    "source": "https://finance.yahoo.com/quote/%5ERUT"
  },
  {
    "id": "sxxp",
    "name": "Stoxx Europe 600",
    "region": "Europe",
    "level": 638.09,
    "ytd": 7.64,
    "asOf": "2026-10-14",
    "stooq": "^stoxx",
    "source": "https://finance.yahoo.com/quote/%5ESTOXX"
  },
  {
    "id": "ukx",
    "name": "FTSE 100",
    "region": "Europe",
    "level": 10677.14,
    "ytd": 7.51,
    "asOf": "2026-10-14",
    "stooq": "^ftse",
    "source": "https://finance.yahoo.com/quote/%5EFTSE",
    "keyMoment": {
      "text": "The FTSE 100 slid to a two-week low on Tuesday, dragged down by heavyweight energy stocks as oil prices retreated, while British American Tobacco fell after issuing downbeat guidance.",
      "src": "https://live.euronext.com/en/financial-news/ftse-100-hits-two-week-low-energy-stocks-slide",
      "srcName": "Reuters (via Euronext)",
      "date": "2026-09-29"
    }
  },
  {
    "id": "dax",
    "name": "DAX",
    "region": "Europe",
    "level": 25368.04,
    "ytd": 3.58,
    "asOf": "2026-10-14",
    "stooq": "^dax",
    "source": "https://finance.yahoo.com/quote/%5EGDAXI"
  },
  {
    "id": "cac",
    "name": "CAC 40",
    "region": "Europe",
    "level": 7865.63,
    "ytd": -3.48,
    "asOf": "2026-10-14",
    "stooq": "^cac",
    "source": "https://finance.yahoo.com/quote/%5EFCHI"
  },
  {
    "id": "nkx",
    "name": "Nikkei 225",
    "region": "Asia",
    "level": 67744.29,
    "ytd": 34.57,
    "asOf": "2026-10-14",
    "stooq": "^nkx",
    "source": "https://finance.yahoo.com/quote/%5EN225",
    "keyMoment": {
      "text": "The Nikkei 225 rose 2.0% to 66,826 on Wednesday, extending the region's chip-led strength as investors looked to US PCE data later in the day.",
      "src": "https://nordfx.com/market-news/market-pulse-september-30-2026",
      "srcName": "NordFX",
      "date": "2026-09-30"
    }
  },
  {
    "id": "hsi",
    "name": "Hang Seng",
    "region": "Asia",
    "level": 24314.17,
    "ytd": -5.14,
    "asOf": "2026-10-14",
    "stooq": "^hsi",
    "source": "https://finance.yahoo.com/quote/%5EHSI",
    "keyMoment": {
      "text": "The Hang Seng declined 0.2% to 24,472 on Wednesday while the Shanghai Composite rose 0.3% to 3,840 and the Kospi fell 0.4% to 6,843.",
      "src": "https://nordfx.com/market-news/market-pulse-september-30-2026",
      "srcName": "NordFX",
      "date": "2026-09-30"
    }
  }
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
  { id: "vix",    name: "VIX",    level: 15.21, asOf: "2026-10-12", fred: "VIXCLS", source: "https://fred.stlouisfed.org/series/VIXCLS" },
  { id: "vstoxx", name: "VSTOXX", level: 20.60, asOf: "2026-07-10", fred: null,     source: "https://tradingeconomics.com/vstoxx:ind" },
];

// IPO / ECM pipeline — notable 2026 listings (curated, refreshed by the routine).
export const EQ_IPO = [
  { company: "SpaceX",       exchange: "Nasdaq",  size: "$75bn raised",   timing: "priced 2026-06",   status: "Priced",   source: "https://money.usnews.com/investing/articles/new-and-upcoming-ipos-in-2026" },
  { company: "SK hynix (US)", exchange: "Nasdaq", size: "$26.5bn",        timing: "priced 2026-07-10", status: "Priced",   source: "https://stockanalysis.com/ipos/2026/" },
  { company: "Quantinuum",   exchange: "Nasdaq",  size: "$1.68bn",        timing: "priced 2026-06",   status: "Priced",   source: "https://money.usnews.com/investing/articles/new-and-upcoming-ipos-in-2026" },
  { company: "Cerebras",     exchange: "Nasdaq",  size: "$5.55bn raised", timing: "priced 2026-05-13", status: "Priced",  source: "https://www.cnbc.com/2026/05/13/cerebras-prices-ipo-above-expected-range-wall-street-expects-ai-flood.html" },
  { company: "OpenAI",       exchange: "US (TBD)", size: "large-cap",     timing: "2026 H2",          status: "Filed",    source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
  { company: "Anthropic",    exchange: "US (TBD)", size: "~$965bn valn",  timing: "filed 2026-06",    status: "Filed",    source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
  { company: "Discord",      exchange: "US (TBD)", size: "confidential",  timing: "filed 2026-01",    status: "Filed",    source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
  { company: "Databricks",   exchange: "Nasdaq",  size: "$134bn valn",    timing: "2026 H2",          status: "Rumoured", source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
  { company: "Revolut",      exchange: "Nasdaq",  size: "~$75bn target",  timing: "2026 H2",          status: "Rumoured", source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
  { company: "Crusoe Energy", exchange: "US (TBD)", size: "~$13bn target", timing: "2026 Q4",         status: "Rumoured", source: "https://news.clateway.com/upcoming-ipos-2026-spacex-openai-10-more-to-watch-43090.html" },
  { company: "Stripe",       exchange: "US (TBD)", size: "$159bn valn",   timing: "2027+",            status: "Rumoured", source: "https://www.allocations.com/insights/spacex-openai-anthropic-stripe-databricks-ipo-timeline-2026" },
  { company: "Canva",        exchange: "US (TBD)", size: "$42bn valn",    timing: "2027",             status: "Rumoured", source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
];

// ---- Credit ---------------------------------------------------------------
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

export const DASH_ASOF = "2026-10-14";

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
  "asOf": "2026-10-14",
  "regions": [
    {
      "region": "US",
      "rows": [
        {
          "name": "S&P 500",
          "level": 7805.45,
          "w1": -0.17,
          "m1": 1.94,
          "m3": 3.47,
          "m6": 12.03,
          "y1": 17.48,
          "asOf": "2026-10-13",
          "source": "https://finance.yahoo.com/quote/%5EGSPC/"
        },
        {
          "name": "Nasdaq Composite",
          "level": 27204.38,
          "w1": -1.43,
          "m1": 3.31,
          "m3": 4.2,
          "m6": 15.08,
          "y1": 20.79,
          "asOf": "2026-10-13",
          "source": "https://finance.yahoo.com/quote/%5EIXIC/"
        },
        {
          "name": "Dow Jones",
          "level": 51670.1,
          "w1": 0.29,
          "m1": -1.72,
          "m3": -1.6,
          "m6": 6.46,
          "y1": 11.67,
          "asOf": "2026-10-13",
          "source": "https://finance.yahoo.com/quote/%5EDJI/"
        },
        {
          "name": "Russell 2000",
          "level": 2783.37,
          "w1": -1.66,
          "m1": -4.15,
          "m3": -6.12,
          "m6": 2.87,
          "y1": 11.54,
          "asOf": "2026-10-13",
          "source": "https://finance.yahoo.com/quote/%5ERUT/"
        }
      ]
    },
    {
      "region": "UK",
      "rows": [
        {
          "name": "FTSE 100",
          "level": 10677.16,
          "w1": 2.09,
          "m1": -0.19,
          "m3": 1.53,
          "m6": 1.11,
          "y1": 12.95,
          "asOf": "2026-10-14",
          "source": "https://finance.yahoo.com/quote/%5EFTSE/"
        },
        {
          "name": "FTSE 250",
          "level": 24500.88,
          "w1": 1.93,
          "m1": 2.8,
          "m3": 4.43,
          "m6": 8.1,
          "y1": 11.23,
          "asOf": "2026-10-14",
          "source": "https://finance.yahoo.com/quote/%5EFTMC/"
        }
      ]
    },
    {
      "region": "Europe",
      "rows": [
        {
          "name": "Euro Stoxx 50",
          "level": 6204.99,
          "w1": 0.4,
          "m1": -0.88,
          "m3": -0.97,
          "m6": 4.46,
          "y1": 11.76,
          "asOf": "2026-10-14",
          "source": "https://finance.yahoo.com/quote/%5ESTOXX50E/"
        },
        {
          "name": "DAX",
          "level": 25368.04,
          "w1": 1.05,
          "m1": -0.29,
          "m3": 1.47,
          "m6": 5.41,
          "y1": 4.67,
          "asOf": "2026-10-14",
          "source": "https://finance.yahoo.com/quote/%5EGDAXI/"
        },
        {
          "name": "CAC 40",
          "level": 7865.63,
          "w1": 1.24,
          "m1": -3.11,
          "m3": -6.17,
          "m6": -4.94,
          "y1": -0.68,
          "asOf": "2026-10-14",
          "source": "https://finance.yahoo.com/quote/%5EFCHI/"
        },
        {
          "name": "IBEX 35",
          "level": 19295.7,
          "w1": 0.93,
          "m1": -1.38,
          "m3": 0.1,
          "m6": 6.1,
          "y1": 23.8,
          "asOf": "2026-10-14",
          "source": "https://finance.yahoo.com/quote/%5EIBEX/"
        }
      ]
    },
    {
      "region": "APAC",
      "rows": [
        {
          "name": "Nikkei 225",
          "level": 67744.29,
          "w1": -3.27,
          "m1": 6.7,
          "m3": -1.47,
          "m6": 16.53,
          "y1": 44.61,
          "asOf": "2026-10-14",
          "source": "https://finance.yahoo.com/quote/%5EN225/"
        },
        {
          "name": "Hang Seng",
          "level": 24314.17,
          "w1": 0.76,
          "m1": -2.42,
          "m3": -1.49,
          "m6": -6.29,
          "y1": -4.43,
          "asOf": "2026-10-14",
          "source": "https://finance.yahoo.com/quote/%5EHSI/"
        },
        {
          "name": "Shanghai Composite",
          "level": 3767.23,
          "w1": -1.95,
          "m1": -3.04,
          "m3": -4.76,
          "m6": -6.46,
          "y1": -2.54,
          "asOf": "2026-10-14",
          "source": "https://finance.yahoo.com/quote/000001.SS/"
        },
        {
          "name": "KOSPI",
          "level": 6008.81,
          "w1": -11.69,
          "m1": -10.11,
          "m3": -17.51,
          "m6": -1.36,
          "y1": 68.7,
          "asOf": "2026-10-14",
          "source": "https://finance.yahoo.com/quote/%5EKS11/"
        }
      ]
    }
  ]
};

// Government bond benchmark yields (2Y/5Y/10Y/30Y, in %) for the major economies
// in each jurisdiction, for the Bonds dashboard heatmap. Each row: country,
// y2/y5/y10/y30, an as-of date and a source URL. This is the SEED + fallback: the
// live /api/govyields (Stooq keyless yield series) refreshes these at runtime.
// Every value is real + sourced (never fabricated). Nulls are genuine
// non-issuance / no-benchmark cases: Brazil has no liquid 30Y, Japan's late-July
// 30Y and China's 5Y had no consistent print. Refreshed by the daily routine.
export const GOVT_YIELDS = {
  "asOf": "2026-07-29",
  "tenors": [
    "2Y",
    "5Y",
    "10Y",
    "30Y"
  ],
  "regions": [
    {
      "region": "US",
      "rows": [
        {
          "country": "United States",
          "y2": 4.31,
          "y5": 4.35,
          "y10": 4.65,
          "y30": 5.12,
          "asOf": "2026-07-28",
          "source": "https://www.worldgovernmentbonds.com/country/united-states/"
        }
      ]
    },
    {
      "region": "South America",
      "rows": [
        {
          "country": "Brazil",
          "y2": 14.07,
          "y5": 14.98,
          "y10": 14.86,
          "y30": null,
          "asOf": "2026-07-27",
          "source": "https://tradingeconomics.com/brazil/government-bond-yield"
        },
        {
          "country": "Mexico",
          "y2": null,
          "y5": null,
          "y10": 9.16,
          "y30": null,
          "asOf": "2026-07-24",
          "source": "https://tradingeconomics.com/mexico/government-bond-yield"
        }
      ]
    },
    {
      "region": "UK",
      "rows": [
        {
          "country": "United Kingdom",
          "y2": 4.43,
          "y5": 4.39,
          "y10": 4.95,
          "y30": 4.75,
          "asOf": "2026-07-29",
          "source": "https://tradingeconomics.com/united-kingdom/government-bond-yield"
        }
      ]
    },
    {
      "region": "Europe",
      "rows": [
        {
          "country": "Germany",
          "y2": 2.62,
          "y5": 2.71,
          "y10": 3.19,
          "y30": 3.48,
          "asOf": "2026-07-27",
          "source": "https://tradingeconomics.com/germany/government-bond-yield"
        },
        {
          "country": "France",
          "y2": 2.79,
          "y5": 3.11,
          "y10": 3.94,
          "y30": 4.49,
          "asOf": "2026-07-24",
          "source": "https://tradingeconomics.com/france/government-bond-yield"
        },
        {
          "country": "Italy",
          "y2": 2.8,
          "y5": 3.05,
          "y10": 3.98,
          "y30": 4.75,
          "asOf": "2026-07-29",
          "source": "https://tradingeconomics.com/italy/government-bond-yield"
        },
        {
          "country": "Spain",
          "y2": 2.76,
          "y5": 2.97,
          "y10": 3.5,
          "y30": 4.16,
          "asOf": "2026-07-24",
          "source": "https://tradingeconomics.com/spain/government-bond-yield"
        },
        {
          "country": "Switzerland",
          "y2": 0.09,
          "y5": 0.14,
          "y10": 0.36,
          "y30": 0.66,
          "asOf": "2026-07-20",
          "source": "https://www.worldgovernmentbonds.com/country/switzerland/"
        }
      ]
    },
    {
      "region": "APAC",
      "rows": [
        {
          "country": "Japan",
          "y2": 1.44,
          "y5": 2,
          "y10": 2.76,
          "y30": null,
          "asOf": "2026-07-28",
          "source": "https://tradingeconomics.com/japan/government-bond-yield"
        },
        {
          "country": "Australia",
          "y2": 4.61,
          "y5": 4.61,
          "y10": 4.9,
          "y30": 5.39,
          "asOf": "2026-07-29",
          "source": "https://tradingeconomics.com/australia/government-bond-yield"
        },
        {
          "country": "China",
          "y2": 1.62,
          "y5": null,
          "y10": 2.1,
          "y30": 2.5,
          "asOf": "2026-07-22",
          "source": "https://centralbank.watch/tools/yield-curve/china-yield-curve/"
        },
        {
          "country": "India",
          "y2": 6.41,
          "y5": 6.91,
          "y10": 6.8,
          "y30": 7.81,
          "asOf": "2026-07-27",
          "source": "https://tradingeconomics.com/india/government-bond-yield"
        },
        {
          "country": "South Korea",
          "y2": 3.33,
          "y5": 3.59,
          "y10": 3.69,
          "y30": 3.61,
          "asOf": "2026-07-20",
          "source": "https://www.worldgovernmentbonds.com/country/south-korea/"
        }
      ]
    }
  ]
};

// Curated government-bond-yield CHANGES (basis points) by country → tenor, for the
// Bonds yield-change heatmap. Trading Economics country pages publish the
// current level plus the trailing 1-month (m1) and 1-year (y1) change; those two are
// curated here. The 10Y 3M/6M (m3/m6) are filled LIVE from FRED's OECD monthly series
// via /api/govyields, and the whole US curve (all windows, daily) too — both override
// these. Only 1W (needs daily non-US data) stays blank. Real + sourced.
export const GOVT_YIELD_CHG = {
  "United States": {
    "y2": {
      "m1": 4,
      "y1": 26
    },
    "y5": {
      "m1": 13,
      "y1": 40
    },
    "y10": {
      "m1": 22,
      "y1": 33
    },
    "y30": {
      "m1": 23,
      "y1": 31
    }
  },
  "Brazil": {
    "y10": {
      "m1": 35,
      "y1": 68
    }
  },
  "Mexico": {
    "y10": {
      "m1": 21,
      "y1": 10
    }
  },
  "United Kingdom": {
    "y2": {
      "m1": 13,
      "y1": 45
    },
    "y10": {
      "m1": 23,
      "y1": 42
    },
    "y30": {
      "m1": 22,
      "y1": 33
    }
  },
  "Germany": {
    "y2": {
      "m1": 24,
      "y1": 80
    },
    "y10": {
      "m1": 30,
      "y1": 48
    },
    "y30": {
      "m1": 20,
      "y1": 48
    }
  },
  "France": {
    "y10": {
      "m1": 40,
      "y1": 62
    },
    "y30": {
      "m1": 22,
      "y1": 59
    }
  },
  "Italy": {
    "y10": {
      "m1": 33,
      "y1": 42
    },
    "y30": {
      "m1": 26,
      "y1": 36
    }
  },
  "Spain": {
    "y10": {
      "m1": 21,
      "y1": 29
    }
  },
  "Switzerland": {
    "y10": {
      "m1": 13,
      "y1": 7
    }
  },
  "Japan": {
    "y2": {
      "m1": 9,
      "y1": 65
    },
    "y10": {
      "m1": 10,
      "y1": 125
    },
    "y30": {
      "m1": 1,
      "y1": 88
    }
  },
  "Australia": {
    "y2": {
      "m1": 5,
      "y1": 117
    },
    "y10": {
      "m1": 21,
      "y1": 72
    }
  },
  "China": {
    "y10": {
      "m1": -3,
      "y1": -1
    }
  },
  "India": {
    "y10": {
      "m1": 12,
      "y1": 45
    }
  },
  "South Korea": {
    "y10": {
      "m1": 17,
      "y1": 154
    }
  }
};

// Private-credit pulse for the Credit dashboard — Fitch's U.S. Private Credit
// Default Rate (PCDR), KBRA's middle-market surveillance and market-context
// metrics. Every figure is real + sourced (never fabricated); refreshed by the
// routine. `reports` tracks the recurring industry research the pulse draws on —
// KBRA's quarterly Middle Market Compendium and AIMA/ACC's Private Credit
// Performance & Valuation Trends — so each cycle rolls to the newest edition (see
// docs/refresh-routines.md, "Private-credit research").
export const PRIVATE_CREDIT = {
  asOf: "2026-09",
  headline: "Fitch's U.S. Private Credit Default Rate hit a fresh record 6.3% for the trailing 12 months ended August 2026 (across ~1,300 borrowers) — up from 6.1% in July and the prior quarterly record of 6.0% for TTM 2Q26, with 14 default events in August, the highest monthly total in a year. Defaults stayed amendment-led: stressed maturity extensions were 45% of August's events (a third straight month on top) and interest-deferral / cash-to-PIK swaps 47% of the trailing year's 89 defaults, rather than missed payments. Stress concentrated in healthcare and industrials/manufacturing (both 9.9%, up from 9.5% in July), while software stayed resilient at 0.6%. Fitch ties the climb to rate/inflation uncertainty crimping deal liquidity, leaving lenders unable to exit distressed borrowers before maturity.",
  metrics: [
    { k: "Private Credit Default Rate", v: "6.3%", sub: "TTM Aug 2026 · record · up from 6.1% (Jul 2026)", src: "https://www.fitchratings.com/research/corporate-finance/fitch-ratings-us-private-credit-default-rate-rose-to-6-3-in-august-2026-14-09-2026", srcName: "Fitch Ratings", prev: "6.0%", prevAsOf: "TTM 2Q26", prevSrc: "https://www.fundssociety.com/en/news/alternatives/u-s-private-credit-default-rate-continues-to-climb/" },
    { k: "Defaults recorded (TTM)", v: "89", sub: "TTM Aug 2026 · 14 in August (highest monthly in a year)", src: "https://www.fitchratings.com/research/corporate-finance/fitch-ratings-us-private-credit-default-rate-rose-to-6-3-in-august-2026-14-09-2026", srcName: "Fitch Ratings" },
    { k: "Top-stressed sectors", v: "9.9%", sub: "healthcare & industrials/mfg · Aug 2026 · up from 9.5% (Jul)", src: "https://www.fitchratings.com/research/corporate-finance/fitch-ratings-us-private-credit-default-rate-rose-to-6-3-in-august-2026-14-09-2026", srcName: "Fitch Ratings" },
    { k: "Software sector default", v: "0.6%", sub: "Aug 2026 · tech most resilient", src: "https://www.fitchratings.com/research/corporate-finance/fitch-ratings-us-private-credit-default-rate-rose-to-6-3-in-august-2026-14-09-2026", srcName: "Fitch Ratings" },
    { k: "Defaults via amendment", v: "45%", sub: "maturity extensions (Aug, 3rd mo.) · PIK/deferrals 47% of TTM · not missed payments", src: "https://www.fitchratings.com/research/corporate-finance/fitch-ratings-us-private-credit-default-rate-rose-to-6-3-in-august-2026-14-09-2026", srcName: "Fitch Ratings" },
    { k: "KBRA MM default monitor", v: "3.3%", sub: "by count, 2Q26 · first rise in a year · 2.4% by debt (record)", src: "https://www.kbra.com/publications/RWVsCVCX/kbra-releases-research-private-credit-q2-2026-middle-market-compendium-ebitda-s-fading-tailwinds", srcName: "KBRA Q2'26 MM Compendium" },
    { k: "MM debt assessed (KBRA)", v: "$1.2tn", sub: "2,785 borrowers, TTM 2Q26 · EBITDA growth fading", src: "https://www.kbra.com/publications/RWVsCVCX/kbra-releases-research-private-credit-q2-2026-middle-market-compendium-ebitda-s-fading-tailwinds", srcName: "KBRA Q2'26 MM Compendium" },
    { k: "US leveraged-loan default (Fitch fcst)", v: "4.5–5.0%", sub: "end-2026 forecast · US HY 2.5–3.0% · Europe institutional loans 3.0–3.5%", src: "https://www.investmentexecutive.com/news/research-and-markets/u-s-leveraged-loan-defaults-to-ease-in-2026-fitch/", srcName: "Fitch (via Investment Executive)" },
    { k: "Market size (AUM)", v: "~$2.0tn", sub: "2026 est. · ~$4tn by 2030", src: "https://www.moodys.com/web/en/us/insights/credit-risk/outlooks/private-credit-2026.html", srcName: "Moody's" },
    { k: "BDC non-accruals", v: "~1.2%", sub: "of portfolios (Q2'25)", src: "https://www.withintelligence.com/insights/what-is-actually-going-on-in-bdc-portfolios/", srcName: "With Intelligence" },
  ],
  // Recurring industry research the pulse tracks — refreshed to the newest edition each
  // cycle. Fitch's U.S. Private Credit Default Rate is a MONTHLY report; the refresh
  // routine rolls this entry (and the metrics above) to each new month's release and
  // watches for follow-on Fitch private-credit commentary. KBRA's MM Compendium is
  // quarterly and public; AIMA/ACC's quarterly is members' research, so it links the
  // ACC's public private-credit research hub.
  reports: [
    { title: "Fitch — U.S. Private Credit Default Rate Rose to 6.3% in August 2026 (monthly)", date: "2026-09-14", url: "https://www.fitchratings.com/research/corporate-finance/fitch-ratings-us-private-credit-default-rate-rose-to-6-3-in-august-2026-14-09-2026", srcName: "Fitch Ratings" },
    { title: "KBRA — Private Credit: Q2 2026 Middle Market Compendium (EBITDA's Fading Tailwinds)", date: "2026-07-28", url: "https://www.kbra.com/publications/RWVsCVCX/kbra-releases-research-private-credit-q2-2026-middle-market-compendium-ebitda-s-fading-tailwinds", srcName: "KBRA" },
    { title: "AIMA/ACC — Financing the Economy 2025: private credit reaches US$3.5tn (end-2024)", date: "2025", url: "https://www.aima.org/article/press-release-strong-growth-sees-private-credit-market-reach-us-3-5-trillion.html", srcName: "AIMA/ACC" },
  ],
};

// ---------------------------------------------------------------------------
// Europe — defaults & distress (Dashboard ▸ Credit). Curated from free public
// releases; every figure carries its source and the period it is AS OF (never
// fabricated, R7). Refreshed by the routine as each monthly/quarterly release
// lands (docs/refresh-routines.md → "Dashboard: European distress"). The EU
// bankruptcy index is LIVE from Eurostat via /api/eurates; `bankruptcyFallback`
// is its last verified reading, shown only when the live call fails.
export const EU_DISTRESS = {
  asOf: "2026-10-14",
  metrics: [
    { k: "Lev-loan default rate (ELLI, by count)", v: "1.47%", asOf: "Jun 2026", sub: "PitchBook LCD Morningstar European Leveraged Loan Index, rolling 12m · 1.23% by amount · 2.06% incl. distressed exchanges/LMEs (Q2)", src: "https://en.paperjam.lu/article/europes-loan-market-buys-time-not-safety", srcName: "PitchBook LCD (via Paperjam)" },
    { k: "Fitch European lev-loan default (TTM)", v: "2.4%", asOf: "Jul 2026", sub: "Fitch European Corporates Distressed and Default Monitor, Aug 2026", src: "https://x.com/FitchRatings/status/2093277482384298113", srcName: "Fitch Ratings" },
    { k: "Fitch European HY default (TTM)", v: "2.2%", asOf: "Jul 2026", sub: "Fitch European Corporates Distressed and Default Monitor, Aug 2026", src: "https://x.com/FitchRatings/status/2093277482384298113", srcName: "Fitch Ratings" },
    { k: "Fitch 2026 fcst — European inst. loans", v: "3.0–3.5%", asOf: "2026 fcst", sub: "European high-yield bonds 3.75–4.25%", src: "https://www.investmentexecutive.com/news/research-and-markets/u-s-leveraged-loan-defaults-to-ease-in-2026-fitch/", srcName: "Fitch (via Investment Executive)" },
    { k: "S&P European spec-grade default (TTM)", v: "3.3%", asOf: "Mar 2026", sub: "down from 4.0% at end-2025 · S&P via AFME Q1 2026 report", src: "https://www.afme.eu/publications/data-research/european-high-yield-leveraged-loan-and-private-credit-report-q1-2026/", srcName: "AFME (citing S&P)" },
    { k: "UK company insolvencies (E&W, month)", v: "1,946", asOf: "Aug 2026", sub: "seasonally adjusted · 2,007 in Aug 2025 · September release due 20 Oct 2026", src: "https://www.gov.uk/government/statistics/company-insolvencies-august-2026", srcName: "Insolvency Service" },
  ],
  bankruptcyFallback: { value: 195.9, asOf: "2026-Q2", yearAgo: 187.4, yearAgoAsOf: "2025-Q2", href: "https://ec.europa.eu/eurostat/databrowser/view/sts_rb_q/default/table" },
};

// ---------------------------------------------------------------------------
// Regulatory calendar (Dashboard ▸ Legal) — dated milestones for European / UK
// private-credit funds. Only dates verifiable from the instrument or the
// regulator; an undated file is `date: null` (shown "TBC"). Refreshed by the
// routine as dates are confirmed.
export const REG_CALENDAR = {
  asOf: "2026-10-14",
  items: [
    { date: "2026-04-16", item: "AIFMD II applies", note: "Transposition deadline of Directive (EU) 2024/927; loan-origination rules apply to new AIFs", src: "https://eur-lex.europa.eu/eli/dir/2024/927/oj", srcName: "EUR-Lex" },
    { date: "2026-10-14", item: "FCA CP26/28 — UK AIFM regime consultation closes", note: "Proposed three-tier UK AIFM regime; final rules expected 2027", src: "https://www.fca.org.uk/publications/consultation-papers/cp26-28-uk-aifm-regime", srcName: "FCA" },
    { date: "2027-01-01", item: "CRR3 output floor rises to 60%", note: "EU bank capital output floor steps up from 55% (2026)", src: "https://eur-lex.europa.eu/eli/reg/2024/1623/oj", srcName: "EUR-Lex" },
    { date: "2027-04-16", item: "AIFMD II revised supervisory reporting", note: "Annex IV reporting changes apply", src: "https://eur-lex.europa.eu/eli/dir/2024/927/oj", srcName: "EUR-Lex" },
    { date: "2029-04-16", item: "AIFMD II loan-origination grandfathering ends", note: "For AIFs constituted before 15 Apr 2024 that keep raising capital", src: "https://eur-lex.europa.eu/eli/dir/2024/927/oj", srcName: "EUR-Lex" },
    { date: "2024-10-26", item: "ELTIF 2.0 RTS apply", note: "Delegated Regulation (EU) 2024/2759 — redemptions, liquidity tools, cost disclosure", src: "https://eur-lex.europa.eu/eli/reg_del/2024/2759/oj", srcName: "EUR-Lex" },
    { date: null, item: "EU securitisation framework review", note: "In trilogue — no agreed application date", src: "https://www.europarl.europa.eu/legislative-train/theme-a-new-plan-for-europe-s-sustainable-prosperity-and-competitiveness/file-review-of-the-securitisation-framework", srcName: "European Parliament" },
  ],
};
