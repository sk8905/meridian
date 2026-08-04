// =============================================================================
// allocations.js — fund-flow heatmap data for the Dashboard ▸ Equities "ETF flows"
// card (v2/js/dashboard/app.js). Net ETF fund flows across time windows, in
// $ millions (+ = inflow, − = outflow).
//
// UNIVERSE: the SAME cross-asset ETF set as the home "Top Movers" board
// (`MOVERS_ETF` in src/index.js), in the same order — broad equity (SPY/QQQ/IWM),
// the equity sectors carried on that board (Tech/Semis/Financials/Health/Energy/
// Industrials/Staples/Discr./Utilities/Real Estate), plus bonds (TLT/HYG),
// commodities (GLD/USO) and crypto (IBIT). Keep this list aligned to MOVERS_ETF:
// if a ticker is added to / removed from the Top Movers board, mirror it here.
//
// SOURCING (non-negotiable): every figure is a real net-flow number from ETF
// Database (etfdb.com) per-fund flows pages — never invented. A window with no
// clean source is `null` (the cell renders blank). ETFdb publishes the 5-day
// (`w1`), 1-month, 3-month, 6-month and 1-year windows this card shows. There is
// NO 1-day column: no free, reachable source gives a same-date 1-day net flow for
// every instrument at once (etfdb/etf.com Cloudflare-block automated fetches;
// WebSearch returns only scattered single-fund figures on mixed dates). Do not
// re-add a `d1` window. The refresh routine re-sources all rows to one `asOf` snapshot each run.
//
// Served no-cache + tokenless (see _headers), like content.js — a routine refresh
// needs no `?v=` bump. Maintained by the refresh routine; see docs/refresh-routines.md.
// =============================================================================
export const SECTOR_FLOWS = {
  asOf: "2026-08-04",           // ETFdb snapshot date for the 1W–1Y windows
  unit: "$M",
  source: "https://etfdb.com/etf-fund-flows/",
  // [dataKey, columnLabel] in display order. (No 1-day column — see header.)
  windows: [["w1", "1W"], ["m1", "1M"], ["m3", "3M"], ["m6", "6M"], ["y1", "1Y"]],
  sectors: [
    // Broad equity
    { t: "SPY",  name: "S&P 500",      short: "S&P 500",     w1: 3640,    m1: 6660,    m3: 30480,  m6: 29710,  y1: 22790, src: "https://etfdb.com/etf/SPY/" },
    { t: "QQQ",  name: "Nasdaq 100",   short: "Nasdaq 100",  w1: -6230,   m1: -8770,   m3: 4450,   m6: 5100,   y1: 17990, src: "https://etfdb.com/etf/QQQ/" },
    { t: "IWM",  name: "Small caps",   short: "Small caps",  w1: -363.35, m1: -1240,   m3: -2320,  m6: -2790,  y1: -1830, src: "https://etfdb.com/etf/IWM/" },
    // Equity sectors (+ semiconductors)
    { t: "XLK",  name: "Technology",   short: "Tech",        w1: 702.89,  m1: 1390,    m3: 1510,   m6: 3160,   y1: 2690,  src: "https://etfdb.com/etf/XLK/" },
    { t: "SMH",  name: "Semis",        short: "Semis",       w1: 4260,    m1: 4210,    m3: 3830,   m6: 7160,   y1: 13070, src: "https://etfdb.com/etf/SMH/" },
    { t: "XLF",  name: "Financials",   short: "Financials",  w1: 1330,    m1: 3630,    m3: 1940,   m6: -644.91, y1: 1280, src: "https://etfdb.com/etf/XLF/" },
    { t: "XLV",  name: "Health Care",  short: "Health",      w1: 319.52,  m1: 476.64,  m3: -875.76, m6: -728.77, y1: 1520, src: "https://etfdb.com/etf/XLV/" },
    { t: "XLE",  name: "Energy",       short: "Energy",      w1: 249.2,   m1: 121.52,  m3: -1730,  m6: 1170,   y1: 2360,  src: "https://etfdb.com/etf/XLE/" },
    { t: "XLI",  name: "Industrials",  short: "Industrials", w1: -15.78,  m1: 470.54,  m3: 1770,   m6: 2430,   y1: 5180,  src: "https://etfdb.com/etf/XLI/" },
    { t: "XLP",  name: "Cons. Staples", short: "Staples",    w1: 181.53,  m1: 387.94,  m3: -136.88, m6: -1550, y1: -2020, src: "https://etfdb.com/etf/XLP/" },
    { t: "XLY",  name: "Cons. Discr.", short: "Cons Disc",   w1: 57.78,   m1: 333.96,  m3: 67.23,  m6: -352.81, y1: -768.26, src: "https://etfdb.com/etf/XLY/" },
    { t: "XLU",  name: "Utilities",    short: "Utilities",   w1: 262.48,  m1: 234.28,  m3: 272.57, m6: 375.43, y1: 1270,  src: "https://etfdb.com/etf/XLU/" },
    { t: "XLRE", name: "Real Estate",  short: "Real Est",    w1: 194.05,  m1: 215.61,  m3: 296.59, m6: 135,    y1: 315.06, src: "https://etfdb.com/etf/XLRE/" },
    // Bonds / rates
    { t: "TLT",  name: "Long Treasuries", short: "Long Tsy", w1: 972.14,  m1: 2230,    m3: 1240,   m6: -2670,  y1: -4580, src: "https://etfdb.com/etf/TLT/" },
    { t: "HYG",  name: "High Yield",   short: "High Yield",  w1: -461.03, m1: 244.07,  m3: -536.84, m6: -1820, y1: -648.9, src: "https://etfdb.com/etf/HYG/" },
    // Commodities
    { t: "GLD",  name: "Gold",         short: "Gold",        w1: -445.39, m1: 625.27,  m3: -3940,  m6: -11630, y1: 5800,  src: "https://etfdb.com/etf/GLD/" },
    { t: "USO",  name: "Oil",          short: "Oil",         w1: -47.61,  m1: 349.77,  m3: 244.12, m6: 323.83, y1: 304.83, src: "https://etfdb.com/etf/USO/" },
    // Crypto
    { t: "IBIT", name: "Bitcoin",      short: "Bitcoin",     w1: 154.5,   m1: -1830,   m3: -3910,  m6: -3070,  y1: 5140,  src: "https://etfdb.com/etf/IBIT/" },
  ],
};
