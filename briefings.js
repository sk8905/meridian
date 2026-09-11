// =============================================================================
// briefings.js — the tri-daily AI market briefings (Morning · Afternoon ·
// Evening) surfaced by the header "Briefing" button (v2/js/nav-actions.js).
//
// GENERATION (see docs/refresh-routines.md): these are written by the 5×/day
// refresh routine, NOT at runtime. Each run regenerates whichever slot the clock
// is in (morning < 12:00 · afternoon 12:00–17:00 · evening ≥ 17:00 BST), so the
// current slot is always freshest and every slot is refreshed at least once a day.
//
// DESK FOCUS: the briefings cover the three MARKET desks — Macro, Equities and
// Fixed income — and ONLY those (no Credit or Legal; those have their own
// surfaces). Every slot touches all three, and each bullet's <strong> lead is
// tagged with its desk. The first four bullets are the ones the panel renders
// (BRIEF_MAX_BULLETS — one iPhone screen), so they carry the three-desk spread.
// Equities & Fixed income bullets LEAD WITH THE MOVE AND ITS DRIVER — the index
// or yield change, then the specific catalyst behind it (a stock, a data print,
// an issuance event) — not a standing description.
//
// GROUNDING (HOUSE_STYLE / non-negotiables): a briefing is a SUMMARY of items
// Wire already holds — every bullet carries a real `src` URL to the wire/desk item
// it compresses. No invented figures, no uncited claims. A thin news slot gets a
// short briefing, never padding. Both the `lede` and each bullet `html` are
// authored, trusted HTML (entities like &pound;/&mdash; render). Served no-cache +
// tokenless (see _headers), so a routine refresh is picked up without a code token
// bump (HOUSE_STYLE T1); the lede is clamped to three lines, so lead with the arc.
// =============================================================================
export const BRIEFINGS = {
  tz: "BST",
  // Ordered for the slot chips; the view picks the current slot by clock.
  order: ["morning", "afternoon", "evening"],
  slots: {
    morning: {
      label: "Morning",
      date: "2026-09-11",
      time: "08:15 BST",
      lede: "UK GDP surprises to the upside with 0.4% July growth and sterling jumps on the print, while a global bond selloff pushes 10-year Treasury yields toward 5% ahead of today's decisive US August CPI report.",
      bullets: [
        { html: "<strong>Macro &mdash; UK GDP grows 0.4% in July, beating the flat forecast</strong>: the ONS print put Britain on track for the fastest H1 2026 growth in the G7, a broad-based upside surprise across services, production and construction even as elevated gilt yields keep squeezing the Chancellor's fiscal headroom.", src: "https://www.investing.com/news/economic-indicators/uk-economy-grew-04-in-july-4897234", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Fixed income &mdash; global bond selloff pushes 10-year Treasury yields to the cusp of 5%</strong>: benchmark yields touched their highest since 2007 as bond bears price a growing chance of a Fed hike at next week's FOMC meeting, ahead of Friday's decisive August CPI print.", src: "https://www.bloomberg.com/news/articles/2026-09-11/global-bond-selloff-sends-10-year-treasury-yields-to-cusp-of-5", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; Asia-Pacific stocks sink as oil and yields spike</strong>: the Nikkei fell nearly 3% and the Kospi around 2.5% at Friday's open as surging oil and rising Treasury yields weighed on risk sentiment amid the widening Iran war and unconfirmed reports of a fresh strike on a Saudi pipeline.", src: "https://investinglive.com/news/investinglive-asia-pacific-market-news-oil-holds-near-highs/", srcName: "investingLive" },
        { html: "<strong>Fixed income &mdash; UK gilts still pinned near 19-year highs into the Budget arithmetic</strong>: the 10-year gilt yield remains close to Thursday's 5.295% peak, keeping pressure on Chancellor Healey's shrinking fiscal headroom ahead of the 28 October Budget even as a unanimous Reuters poll expects the BoE to hold on 17 September.", src: "https://order-order.com/2026/09/10/british-10-year-gilt-yield-rises-to-19-year-high/", srcName: "Guido Fawkes" },
        { html: "<strong>Macro &mdash; sterling jumps on the GDP beat as the dollar holds pre-CPI gains</strong>: GBP/USD extended gains after the July growth surprise reinforced the case for a hawkish BoE hold at next week's MPC meeting, while the US Dollar Index held onto Thursday's PPI-driven gains ahead of the decisive US inflation data.", src: "https://www.fxstreet.com/news/british-pound-jumps-after-strong-uk-monthly-gdp-data-202609110608", srcName: "FXStreet" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-11",
      time: "12:30 BST",
      lede: "Wall Street futures hold steady into the decisive August CPI print, the 10-year Treasury yield pushes toward the cusp of 5% and sterling extends Thursday's gains after Friday's UK GDP beat.",
      bullets: [
        { html: "<strong>Macro &mdash; US August CPI due this afternoon, the last input before the Fed's 16 September decision</strong>: markets are torn between an unyielding bond selloff and crude's return above $100, both keeping the inflation-and-rate calculus live into next week's FOMC.", src: "https://www.cnbc.com/2026/09/11/cnbc-daily-open-two-market-forces-battle-for-dominance.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; 10-year Treasury yield pushes to the cusp of 5%</strong>: the benchmark yield touched roughly 4.97%, its highest since 2007, as bond bears price a growing chance of a Fed hike at next week's FOMC meeting ahead of this afternoon's decisive CPI print.", src: "https://www.vantagemarkets.com/market-news/10-year-treasury-yield-news-cusp-of-5-percent-september-11-2026/", srcName: "Vantage Markets" },
        { html: "<strong>Equities &mdash; Nasdaq futures edge higher ahead of the inflation report</strong>: US futures ticked up after stocks fell for a fourth straight session on rising oil and Treasury yields, with the August CPI now the last major data point before the Fed decides.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-11-2026", srcName: "TheStreet" },
        { html: "<strong>Macro &mdash; sterling extends its gains after Thursday's UK GDP beat</strong>: GBP/USD rose to around 1.3522 after July growth of 0.4% — roughly half of it from IT and AI-linked investment, per ING &mdash; put Britain on track for the fastest H1 2026 growth in the G7 and reinforced the case for a hawkish BoE hold at next week's MPC meeting.", src: "https://www.exchangerates.org.uk/news/47159/2026-09-11-pound-sterling-rises-against-euro-dollar-after-uk-gdp-beats-forecast.html", srcName: "exchangerates.org.uk" },
        { html: "<strong>Fixed income &mdash; gold gains as oil softens, inflation data in focus</strong>: bullion advanced even as it headed for a third straight weekly loss, with the usual inflation-hedge appeal offset by the prospect of a near-term Fed rate hike once this afternoon's CPI lands.", src: "https://www.cnbc.com/2026/09/11/gold-on-track-for-third-weekly-loss-as-us-inflation-data-looms.html", srcName: "CNBC" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-11",
      time: "17:26 BST",
      lede: "Wall Street rose despite a hotter-than-expected August core CPI print that pushed Fed-hike odds for next week's FOMC to around 90%, while a surprise 0.4% UK GDP beat lifted the FTSE and sterling even as oil fell sharply off its weekly highs.",
      bullets: [
        { html: "<strong>Macro &mdash; hot August core CPI pushes Fed-hike odds to about 90%</strong>: core prices rose 0.3% m/m, a tenth above forecast, in the last major data point before next Wednesday's FOMC decision &mdash; bolstering the case for Chair Kevin Warsh's Fed to raise rates.", src: "https://www.bloomberg.com/news/articles/2026-09-11/us-core-cpi-rises-more-than-forecast-bolstering-case-for-hike", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; Treasuries sell off as traders price two hikes by year-end</strong>: the 10-year yield held near its highest level since 2007 after the CPI surprise, with bond traders moving to price a second quarter-point Fed move on top of next week's expected hike.", src: "https://www.bloomberg.com/news/articles/2026-09-11/treasuries-fall-as-higher-than-expected-cpi-boosts-fed-hike-odds", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; Dow, S&amp;P 500 and Nasdaq rise even as CPI runs hot</strong>: US stocks climbed Friday as falling oil prices offset the inflation surprise and the resulting jump in Fed-hike bets, a day after markets fell for a fourth straight session.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-september-11-dow-sp-500-nasdaq-cpi-inflation-082201751.html", srcName: "Yahoo Finance" },
        { html: "<strong>Macro &mdash; UK GDP beat puts Britain on track for the fastest H1 2026 growth in the G7</strong>: July output grew 0.4% m/m against a Reuters poll median of no growth, lifting the FTSE 100 roughly 0.5% and sterling on the day even as it lagged Frankfurt's DAX and Paris's CAC 40.", src: "https://www.cityam.com/ftse-100-live-stocks-to-drop-economic-growth-set-to-vanish/", srcName: "CityAM" },
        { html: "<strong>Fixed income &mdash; oil retreats sharply from its weekly highs</strong>: Brent and WTI fell back after Iranian state media said Tehran will meet Gulf states in Oman over the Strait of Hormuz standoff, even as crude stayed on track for a near-9% weekly gain and continued to feed the Fed's inflation calculus.", src: "https://www.cnbc.com/2026/09/11/oil-price-today-iran-brent-wti-trump.html", srcName: "CNBC" },
      ],
    },
  },
};
