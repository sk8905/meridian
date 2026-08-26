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
  asOf: "2026-08-26",           // ETFdb snapshot date for the 1W–1Y windows
  unit: "$M",
  source: "https://etfdb.com/etf-fund-flows/",
  // [dataKey, columnLabel] in display order. (No 1-day column — see header.)
  windows: [["w1", "1W"], ["m1", "1M"], ["m3", "3M"], ["m6", "6M"], ["y1", "1Y"]],
  sectors: [
    // Broad equity
    { t: "SPY",  name: "S&P 500",      short: "S&P 500",     w1: 7680,    m1: 11860,   m3: 30640,  m6: 40580,  y1: 38110, src: "https://etfdb.com/etf/SPY/" },
    { t: "QQQ",  name: "Nasdaq 100",   short: "Nasdaq 100",  w1: 1420,    m1: 13540,   m3: 10550,  m6: 17050,  y1: 24070, src: "https://etfdb.com/etf/QQQ/" },
    { t: "IWM",  name: "Small caps",   short: "Small caps",  w1: -372.4,  m1: -720.7,  m3: -97.56, m6: -3730,  y1: -2230, src: "https://etfdb.com/etf/IWM/" },
    // Equity sectors (+ semiconductors)
    { t: "XLK",  name: "Technology",   short: "Tech",        w1: -840.6,  m1: 204,     m3: -311.1, m6: 3360,   y1: 1730,  src: "https://etfdb.com/etf/XLK/" },
    { t: "SMH",  name: "Semis",        short: "Semis",       w1: -2110,   m1: -1850,   m3: 1930,   m6: 2830,   y1: 10250, src: "https://etfdb.com/etf/SMH/" },
    { t: "XLF",  name: "Financials",   short: "Financials",  w1: -81.13,  m1: 3670,    m3: 1520,   m6: 105.57, y1: 1740,  src: "https://etfdb.com/etf/XLF/" },
    { t: "XLV",  name: "Health Care",  short: "Health",      w1: -416.03, m1: -266.92, m3: 154.71, m6: -865.14, y1: 2300, src: "https://etfdb.com/etf/XLV/" },
    { t: "XLE",  name: "Energy",       short: "Energy",      w1: 277.44,  m1: -142.82, m3: -2020,  m6: -1420,  y1: 2470,  src: "https://etfdb.com/etf/XLE/" },
    { t: "XLI",  name: "Industrials",  short: "Industrials", w1: -98.91,  m1: 369.82,  m3: 2290,   m6: 1380,   y1: 5400,  src: "https://etfdb.com/etf/XLI/" },
    { t: "XLP",  name: "Cons. Staples", short: "Staples",    w1: 26.7,    m1: 287.61,  m3: -378.7, m6: -1910,  y1: -2310, src: "https://etfdb.com/etf/XLP/" },
    { t: "XLY",  name: "Cons. Discr.", short: "Cons Disc",   w1: -222.16, m1: 41.08,   m3: 669.01, m6: 617.98, y1: -262.76, src: "https://etfdb.com/etf/XLY/" },
    { t: "XLU",  name: "Utilities",    short: "Utilities",   w1: -106.26, m1: -81.75,  m3: 448.26, m6: 628.44, y1: 1060,  src: "https://etfdb.com/etf/XLU/" },
    { t: "XLRE", name: "Real Estate",  short: "Real Est",    w1: -172.71, m1: -111.54, m3: 364.45, m6: 512.04, y1: 105.76, src: "https://etfdb.com/etf/XLRE/" },
    // Bonds / rates
    { t: "TLT",  name: "Long Treasuries", short: "Long Tsy", w1: 173.26,  m1: 2860,    m3: 1340,   m6: -1170,  y1: -4010, src: "https://etfdb.com/etf/TLT/" },
    { t: "HYG",  name: "High Yield",   short: "High Yield",  w1: -16.07,  m1: 988.1,   m3: 1230,   m6: 574.04, y1: -142.45, src: "https://etfdb.com/etf/HYG/" },
    // Commodities
    { t: "GLD",  name: "Gold",         short: "Gold",        w1: 3380,    m1: 6100,    m3: 1630,   m6: -4580,  y1: 11000, src: "https://etfdb.com/etf/GLD/" },
    { t: "USO",  name: "Oil",          short: "Oil",         w1: -123.6,  m1: -288.28, m3: 388.86, m6: -90.61, y1: 94.38, src: "https://etfdb.com/etf/USO/" },
    // Crypto
    { t: "IBIT", name: "Bitcoin",      short: "Bitcoin",     w1: 197.32,  m1: 958.31,  m3: -4930,  m6: -616.11, y1: 3230, src: "https://etfdb.com/etf/IBIT/" },
  ],
};
