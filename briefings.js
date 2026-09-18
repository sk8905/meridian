// =============================================================================
// briefings.js — the AI market briefing surfaced at the head of the Home News
// wire (v2/js/home/glance.js renderHomeBriefing). Only the LATEST (freshest-
// stamped) slot is shown — there is no header button and no slot selector.
//
// GENERATION (see docs/refresh-routines.md): these are written by the 5×/day
// refresh routine, NOT at runtime. Three rolling slots are kept as the store;
// each run regenerates whichever slot the clock is in (morning < 12:00 · afternoon
// 12:00–17:00 · evening ≥ 17:00 BST) and restamps it, so the freshest slot — the
// one the reader sees — is renewed on every run (up to 5× a day).
//
// DESK FOCUS: the briefings cover the three MARKET desks — Macro, Equities and
// Fixed income — and ONLY those (no Credit or Legal; those have their own
// surfaces). Every slot touches all three, and each bullet's <strong> lead is
// tagged with its desk. The first four bullets are the ones the Home card renders
// (HB_MAX_BULLETS — one iPhone screen), so they carry the three-desk spread.
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
      date: "2026-09-18",
      time: "08:34 BST",
      lede: "The Bank of Japan hiked 25bp to 1.25% &mdash; a 31-year high &mdash; in a 7&ndash;2 vote overnight, weakening the yen further, as Wall Street closed out Thursday with its best rally since Wednesday's Fed-hike selloff; a surprise 0.5% August bounce in UK retail sales added a bright spot in the G7 rate-hike week's aftermath.",
      bullets: [
        { html: "<strong>Macro &mdash; the Bank of Japan hiked 25bp to 1.25% overnight</strong>, the highest since 1995, in a 7&ndash;2 vote as two reflationist board members appointed by PM Takaichi dissented, flagging upside inflation risk &mdash; the third G7 central-bank move in three days after the Fed's hike and the BoE's hold.", src: "https://www.cnbc.com/2026/09/18/japan-raises-rates-30-year-high-yen-jgb.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; the yen weakened further after the BoJ's split-vote hike</strong>, while UK gilts extended Thursday's rally after the Bank of England paused long-dated gilt sales to ease pressure on yields.", src: "https://www.bloomberg.com/news/articles/2026-09-17/boe-scraps-long-end-gilt-sales-in-plan-to-unwind-qe-by-2034", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; Wall Street rebounded Thursday from Wednesday's Fed-hike selloff</strong>, with the S&amp;P 500 up 1.14% to 7,637.71, the Nasdaq up 1.69% to 26,418.29 and the Dow up 0.62% to 51,779.85, as Treasury yields eased and oil fell.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-17-2026", srcName: "TheStreet" },
        { html: "<strong>Macro &mdash; UK retail sales rose 0.5% in August</strong>, defying a Reuters-polled forecast for a 0.2% decline, as warm weather and a brighter mood lifted spending despite rising energy bills &mdash; a rare upside surprise following Thursday's BoE hold.", src: "https://www.bloomberg.com/news/articles/2026-09-18/uk-retail-sales-bounce-back-with-0-5-gain-in-august", srcName: "Bloomberg" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-18",
      time: "12:26 BST",
      lede: "The Bank of Japan hiked 25bp to a 31-year high of 1.25% overnight, weakening the yen further, as chip stocks led US futures higher and Treasury yields retreated; UK retail sales beat forecasts with a 0.5% August bounce, but sterling stayed on the back foot and the FTSE 100 retreated on banks and energy even as it eyes a weekly gain.",
      bullets: [
        { html: "<strong>Macro &mdash; the Bank of Japan hiked 25bp to 1.25% overnight</strong>, the highest since 1995, flagging continued concern over inflation as the yen weakened further on the move.", src: "https://www.cnbc.com/2026/09/18/japan-raises-rates-30-year-high-yen-jgb.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; sterling stayed on the back foot despite yesterday's BoE hold</strong>, with MUFG and Pantheon Macroeconomics both flagging that the door is open for a November hike even as the pound slipped against a broadly firm dollar.", src: "https://www.babypips.com/news/headline-why-the-british-pound-fell-after-the-boe-held-rates-at-3-75-percent-2026-09-18", srcName: "Babypips" },
        { html: "<strong>Equities &mdash; chip stocks led a rebound in US futures as Treasury yields retreated</strong>, with the market steadying after this week's Fed-hike volatility.", src: "https://www.home.saxo/content/articles/macro/market-quick-take---chips-lead-a-rebound-as-treasury-yields-retreat---18-september-2026-18092026", srcName: "Saxo Bank" },
        { html: "<strong>Equities &mdash; the FTSE 100 retreated as banks and energy stocks weighed</strong>, though the index still eyes a gain for the week.", src: "https://www.globalbankingandfinance.com/londons-ftse-100-retreats-banks-energy-weigh-eyes-weekly/", srcName: "Global Banking & Finance" },
        { html: "<strong>Macro &mdash; UK retail sales rose 0.5% in August, defying a forecast decline</strong>, a rare upside surprise in the same week the Bank of England held Bank Rate at 3.75%.", src: "https://www.bloomberg.com/news/articles/2026-09-18/uk-retail-sales-bounce-back-with-0-5-gain-in-august", srcName: "Bloomberg" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-17",
      time: "21:09 BST",
      lede: "The G7 rate-hike week's second decision landed as expected: the Bank of England held Bank Rate at 3.75% (6&ndash;3) and slowed QT to about &pound;50bn a year, with Governor Bailey warning a hike would follow if the Iran-war energy shock keeps inflation elevated &mdash; and the BoE's own bond-sales overhaul is now drawing as much market attention as the rate hold itself.",
      bullets: [
        { html: "<strong>Macro &mdash; the Bank of England held Bank Rate at 3.75% today</strong>, by the same 6&ndash;3 vote as July, and voted to slow quantitative tightening to roughly &pound;50bn a year &mdash; but warned a hike would be needed if the Iran-war energy shock keeps inflation elevated.", src: "https://www.bloomberg.com/news/articles/2026-09-17/bank-of-england-holds-rates-warns-of-hike-if-iran-war-persists", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; the BoE's slower QT pace may matter more for gilts than today's rate hold</strong>, with dealers flagging the &pound;50bn/year run-off rate as the real swing factor for bond-market supply into next year.", src: "https://www.bloomberg.com/news/articles/2026-09-17/boe-s-qt-plans-may-eclipse-rates-as-key-decision-for-bond-market", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Wall Street's major dealers have converged on at least one more 2026 Fed hike</strong> after Wednesday's hawkish dot plot, with Goldman Sachs pencilling in October and JPMorgan and Morgan Stanley looking to December.", src: "https://www.bnnbloomberg.ca/business/economics/2026/09/17/major-brokerages-see-one-more-fed-rate-hike-in-2026-after-policy-meeting/", srcName: "BNN Bloomberg" },
        { html: "<strong>Equities &mdash; US futures firmed into Thursday's close</strong> as investors looked to rebound from Wednesday's Fed-day slump, even as the S&amp;P 500 and Nasdaq stayed choppy on higher-for-longer rate positioning.", src: "https://www.bloomberg.com/news/articles/2026-09-17/us-stocks-primed-to-rebound-from-fed-day-slump-as-futures-rally", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; sterling stayed pinned near six-week lows around $1.3375-1.3400</strong>, as dollar strength from the Fed's own hike offset today's widely-expected BoE hold.", src: "https://www.fxstreet.com/news/british-pound-languishes-near-late-july-lows-as-hawkish-fed-underpins-usd-ahead-of-boe-202609170104", srcName: "FXStreet" },
      ],
    },
  },
};
