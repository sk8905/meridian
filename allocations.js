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
  asOf: "2026-09-14",           // ETFdb snapshot date for the 1W–1Y windows
  unit: "$M",
  source: "https://etfdb.com/etf-fund-flows/",
  // [dataKey, columnLabel] in display order. (No 1-day column — see header.)
  windows: [["w1", "1W"], ["m1", "1M"], ["m3", "3M"], ["m6", "6M"], ["y1", "1Y"]],
  sectors: [
    // Broad equity
    { t: "SPY",  name: "S&P 500",      short: "S&P 500",     w1: -1830,   m1: 7560,    m3: 5030,   m6: 43770,  y1: 30040, src: "https://etfdb.com/etf/SPY/" },
    { t: "QQQ",  name: "Nasdaq 100",   short: "Nasdaq 100",  w1: -5610,   m1: 1270,    m3: 10360,  m6: 21470,  y1: 27510, src: "https://etfdb.com/etf/QQQ/" },
    { t: "IWM",  name: "Small caps",   short: "Small caps",  w1: -691.45, m1: -293.79, m3: -832.91, m6: -706.91, y1: -3630, src: "https://etfdb.com/etf/IWM/" },
    // Equity sectors (+ semiconductors)
    { t: "XLK",  name: "Technology",   short: "Tech",        w1: -203.8,  m1: -1390,   m3: -394.89, m6: 2970,  y1: 1220,  src: "https://etfdb.com/etf/XLK/" },
    { t: "SMH",  name: "Semis",        short: "Semis",       w1: 1640,    m1: 527.43,  m3: 5270,   m6: 5230,   y1: 12460, src: "https://etfdb.com/etf/SMH/" },
    { t: "XLF",  name: "Financials",   short: "Financials",  w1: 546.59,  m1: -3690,   m3: 91.47,  m6: 915.14, y1: -2270, src: "https://etfdb.com/etf/XLF/" },
    { t: "XLV",  name: "Health Care",  short: "Health",      w1: -416.03, m1: -266.92, m3: 154.71, m6: -865.14, y1: 2300, src: "https://etfdb.com/etf/XLV/" },
    { t: "XLE",  name: "Energy",       short: "Energy",      w1: 585.57,  m1: 220.23,  m3: -1140,  m6: -2010,  y1: 2570,  src: "https://etfdb.com/etf/XLE/" },
    { t: "XLI",  name: "Industrials",  short: "Industrials", w1: -469.76, m1: -1220,   m3: 1050,   m6: 1250,   y1: 4620,  src: "https://etfdb.com/etf/XLI/" },
    { t: "XLP",  name: "Cons. Staples", short: "Staples",    w1: 26.7,    m1: 287.61,  m3: -378.7, m6: -1910,  y1: -2310, src: "https://etfdb.com/etf/XLP/" },
    { t: "XLY",  name: "Cons. Discr.", short: "Cons Disc",   w1: -133.8,  m1: 68.9,    m3: 15.26,  m6: 1.25,   y1: -705.25, src: "https://etfdb.com/etf/XLY/" },
    { t: "XLU",  name: "Utilities",    short: "Utilities",   w1: 130.86,  m1: 22.28,   m3: 629.84, m6: 352.65, y1: 885.68, src: "https://etfdb.com/etf/XLU/" },
    { t: "XLRE", name: "Real Estate",  short: "Real Est",    w1: -172.71, m1: -111.54, m3: 364.45, m6: 512.04, y1: 105.76, src: "https://etfdb.com/etf/XLRE/" },
    // Bonds / rates
    { t: "TLT",  name: "Long Treasuries", short: "Long Tsy", w1: 173.26,  m1: 2860,    m3: 1340,   m6: -1170,  y1: -4010, src: "https://etfdb.com/etf/TLT/" },
    { t: "HYG",  name: "High Yield",   short: "High Yield",  w1: -715.72, m1: -1540,   m3: -309.19, m6: -822.82, y1: -2070, src: "https://etfdb.com/etf/HYG/" },
    // Commodities
    { t: "GLD",  name: "Gold",         short: "Gold",        w1: -849.37, m1: 4670,    m3: 4460,   m6: -3270,  y1: 9150,  src: "https://etfdb.com/etf/GLD/" },
    { t: "USO",  name: "Oil",          short: "Oil",         w1: 288.78,  m1: -12.37,  m3: -92.56, m6: -355.39, y1: -152.76, src: "https://etfdb.com/etf/USO/" },
    // Crypto
    { t: "IBIT", name: "Bitcoin",      short: "Bitcoin",     w1: 197.32,  m1: 958.31,  m3: -4930,  m6: -616.11, y1: 3230, src: "https://etfdb.com/etf/IBIT/" },
  ],
};
