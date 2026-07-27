// =============================================================================
// allocations.js — sector allocation / fund-flow heatmap data for the Dashboard ▸
// Equities "Sector flows" card (v2/js/dashboard/app.js). Net ETF fund flows into the 11 SPDR select-
// sector funds across time windows, in $ millions (+ = inflow, − = outflow).
//
// SOURCING (non-negotiable): every figure is a real net-flow number from ETF
// Database (etfdb.com) per-fund flows pages — never invented. A window with no
// clean source is `null` (the cell renders blank). ETFdb publishes 5-day / 1-
// month / 3-month / 6-month / 1-year; the 1-DAY column (`d1`) is filled by the
// daily refresh routine from a single-date flows report so all 11 share one as-of
// date (left null here until that run — no date-mixing, no fabrication).
//
// Served no-cache + tokenless (see _headers), like content.js — a routine refresh
// needs no `?v=` bump. Maintained by the refresh routine; see docs/refresh-routines.md.
// =============================================================================
export const SECTOR_FLOWS = {
  asOf: "2026-07-24",           // ETFdb snapshot date for the 1W–1Y windows
  unit: "$M",
  source: "https://etfdb.com/etfs/sector/",
  // [dataKey, columnLabel] in display order.
  windows: [["d1", "1D"], ["w1", "1W"], ["m1", "1M"], ["m3", "3M"], ["m6", "6M"], ["y1", "1Y"]],
  sectors: [
    { t: "XLK",  name: "Technology",       short: "Tech",        d1: null, w1: 148.55,  m1: -648.88, m3: 1700,  m6: 961.64,  y1: 2490,  src: "https://etfdb.com/etf/XLK/" },
    { t: "XLF",  name: "Financials",       short: "Financials",  d1: null, w1: 768.48,  m1: 1890,    m3: 760.82, m6: -396.4,  y1: 1060,  src: "https://etfdb.com/etf/XLF/" },
    { t: "XLE",  name: "Energy",           short: "Energy",      d1: null, w1: -23.18,  m1: -965.76, m3: -1960, m6: 2580,    y1: 1620,  src: "https://etfdb.com/etf/XLE/" },
    { t: "XLV",  name: "Health Care",      short: "Health",      d1: null, w1: 319.52,  m1: 476.64,  m3: -875.76, m6: -728.77, y1: 1520, src: "https://etfdb.com/etf/XLV/" },
    { t: "XLY",  name: "Consumer Disc.",   short: "Cons Disc",   d1: null, w1: 256.6,   m1: 363.32,  m3: 260.99, m6: -280.43, y1: -1030, src: "https://etfdb.com/etf/XLY/" },
    { t: "XLP",  name: "Consumer Staples", short: "Staples",     d1: null, w1: -243.66, m1: -170.43, m3: -679.61, m6: -2370,  y1: -2460, src: "https://etfdb.com/etf/XLP/" },
    { t: "XLI",  name: "Industrials",      short: "Industrials", d1: null, w1: 26.45,   m1: 1720,    m3: 1680,  m6: 2830,    y1: 6220,  src: "https://etfdb.com/etf/XLI/" },
    { t: "XLB",  name: "Materials",        short: "Materials",   d1: null, w1: 79.1,    m1: 397.16,  m3: 1510,  m6: 2060,    y1: 2070,  src: "https://etfdb.com/etf/XLB/" },
    { t: "XLRE", name: "Real Estate",      short: "Real Est",    d1: null, w1: 194.05,  m1: 215.61,  m3: 296.59, m6: 135,    y1: 315.06, src: "https://etfdb.com/etf/XLRE/" },
    { t: "XLU",  name: "Utilities",        short: "Utilities",   d1: null, w1: -64.18,  m1: 361.25,  m3: -988.42, m6: 420.71, y1: 1590,  src: "https://etfdb.com/etf/XLU/" },
    { t: "XLC",  name: "Comm. Services",   short: "Comms",       d1: null, w1: -287.87, m1: -774.54, m3: -1290, m6: -2620,   y1: -1850, src: "https://etfdb.com/etf/XLC/" },
  ],
};
