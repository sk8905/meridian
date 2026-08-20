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
  asOf: "2026-08-20",           // ETFdb snapshot date for the 1W–1Y windows
  unit: "$M",
  source: "https://etfdb.com/etf-fund-flows/",
  // [dataKey, columnLabel] in display order. (No 1-day column — see header.)
  windows: [["w1", "1W"], ["m1", "1M"], ["m3", "3M"], ["m6", "6M"], ["y1", "1Y"]],
  sectors: [
    // Broad equity
    { t: "SPY",  name: "S&P 500",      short: "S&P 500",     w1: -4810,   m1: 4770,    m3: 13090,  m6: 23620,  y1: 19590, src: "https://etfdb.com/etf/SPY/" },
    { t: "QQQ",  name: "Nasdaq 100",   short: "Nasdaq 100",  w1: 11140,   m1: 12570,   m3: 22480,  m6: 20870,  y1: 31100, src: "https://etfdb.com/etf/QQQ/" },
    { t: "IWM",  name: "Small caps",   short: "Small caps",  w1: 413.59,  m1: -2540,   m3: -626.53, m6: -4490, y1: -333.59, src: "https://etfdb.com/etf/IWM/" },
    // Equity sectors (+ semiconductors)
    { t: "XLK",  name: "Technology",   short: "Tech",        w1: -840.6,  m1: 204,     m3: -311.1, m6: 3360,   y1: 1730,  src: "https://etfdb.com/etf/XLK/" },
    { t: "SMH",  name: "Semis",        short: "Semis",       w1: -775.22, m1: 672.02,  m3: 4610,   m6: 5210,   y1: 12120, src: "https://etfdb.com/etf/SMH/" },
    { t: "XLF",  name: "Financials",   short: "Financials",  w1: -81.13,  m1: 3670,    m3: 1520,   m6: 105.57, y1: 1740,  src: "https://etfdb.com/etf/XLF/" },
    { t: "XLV",  name: "Health Care",  short: "Health",      w1: -3.89,   m1: 389.15,  m3: 734.26, m6: -848.75, y1: 2400, src: "https://etfdb.com/etf/XLV/" },
    { t: "XLE",  name: "Energy",       short: "Energy",      w1: 329.9,   m1: -113.68, m3: -2800,  m6: -356.13, y1: 2060, src: "https://etfdb.com/etf/XLE/" },
    { t: "XLI",  name: "Industrials",  short: "Industrials", w1: 92.2,    m1: 535.82,  m3: 1840,   m6: 2530,   y1: 6130,  src: "https://etfdb.com/etf/XLI/" },
    { t: "XLP",  name: "Cons. Staples", short: "Staples",    w1: 656.01,  m1: 816.69,  m3: 469.8,  m6: -587.71, y1: -1840, src: "https://etfdb.com/etf/XLP/" },
    { t: "XLY",  name: "Cons. Discr.", short: "Cons Disc",   w1: -19.36,  m1: 467.17,  m3: 954.92, m6: 682.87, y1: -5.27, src: "https://etfdb.com/etf/XLY/" },
    { t: "XLU",  name: "Utilities",    short: "Utilities",   w1: -106.26, m1: -81.75,  m3: 448.26, m6: 628.44, y1: 1060,  src: "https://etfdb.com/etf/XLU/" },
    { t: "XLRE", name: "Real Estate",  short: "Real Est",    w1: -9.03,   m1: 140.1,   m3: 605.66, m6: 855.52, y1: 462.81, src: "https://etfdb.com/etf/XLRE/" },
    // Bonds / rates
    { t: "TLT",  name: "Long Treasuries", short: "Long Tsy", w1: 173.26,  m1: 2860,    m3: 1340,   m6: -1170,  y1: -4010, src: "https://etfdb.com/etf/TLT/" },
    { t: "HYG",  name: "High Yield",   short: "High Yield",  w1: -16.07,  m1: 988.1,   m3: 1230,   m6: 574.04, y1: -142.45, src: "https://etfdb.com/etf/HYG/" },
    // Commodities
    { t: "GLD",  name: "Gold",         short: "Gold",        w1: 1220,    m1: 2820,    m3: -2010,  m6: -7580,  y1: 6940,  src: "https://etfdb.com/etf/GLD/" },
    { t: "USO",  name: "Oil",          short: "Oil",         w1: 299.56,  m1: -212.28, m3: 366.49, m6: 25.82,  y1: 115.02, src: "https://etfdb.com/etf/USO/" },
    // Crypto
    { t: "IBIT", name: "Bitcoin",      short: "Bitcoin",     w1: 197.32,  m1: 958.31,  m3: -4930,  m6: -616.11, y1: 3230, src: "https://etfdb.com/etf/IBIT/" },
  ],
};
