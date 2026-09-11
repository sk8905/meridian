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
      date: "2026-09-10",
      time: "12:16 BST",
      lede: "Brent holds above $100 after President Trump said the Iran war 'won't end' until after the midterms, UK 10-year gilt yields touch a fresh 19-year high and Fed-hike odds surge past 60% into Thursday's PPI and Friday's decisive August CPI.",
      bullets: [
        { html: "<strong>Macro &mdash; Trump says Iran war and $100 oil won't ease until after the midterms</strong>: the President said the Iran war will 'end' only after November's US midterm elections and that oil prices, back above $100/bbl on renewed Houthi attacks near the Strait of Hormuz, are unlikely to fall until then, keeping the oil-driven inflation risk live into Friday's CPI.", src: "https://www.reuters.com/world/middle-east/trump-says-iran-war-end-after-us-midterm-elections-threatens-attack-pickaxe-2026-09-10/", srcName: "Reuters" },
        { html: "<strong>Fixed income &mdash; UK 10-year gilt yield hits a fresh 19-year high</strong>: the move extends the global bond selloff and adds to pressure on Chancellor Healey's fiscal headroom ahead of the 28 October Budget, as Brent's hold above $100 keeps an inflation premium priced into the curve.", src: "https://www.msn.com/en-gb/news/other/uk-10-year-gilt-yield-hits-new-19-year-high/ar-AA2bW9ZZ", srcName: "Reuters (via MSN)" },
        { html: "<strong>Equities &mdash; FTSE 100 dips as Trump's Iran remark weighs</strong>: London stocks slipped Thursday on the President's comments that the Iran war and elevated oil prices will persist past the midterms, with Brent still holding above $100/bbl.", src: "https://www.cityam.com/ftse-100-live-stocks-to-fall-trump-says-iran-war-will-end-after-midterms/", srcName: "CityAM" },
        { html: "<strong>Macro &mdash; Fed-hike odds surge past 60% into Friday's decisive CPI</strong>: CME FedWatch-implied odds of a 16 September quarter-point hike have jumped over 60%, sharply higher since Chair Warsh's hawkish Jackson Hole remarks, with Thursday's PPI and Friday's August CPI now the last inputs before the decision.", src: "https://finance.yahoo.com/economy/policy/articles/fomc-september-2026-odds-rate-163505675.html", srcName: "Yahoo Finance" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-10",
      time: "21:16 BST",
      lede: "Iran vowed a more intense war as fresh Strait of Hormuz attacks kept Brent above $100 into the evening, a unanimous Reuters poll found all 65 economists expecting the BoE to hold on 17 September, and Wall Street closed lower as the hot August PPI print pushed Fed-hike odds toward 70% ahead of Friday's decisive CPI.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran vows a more intense war as Hormuz disruption continues</strong>: fresh attacks near the Strait of Hormuz kept Brent above $100 into the evening, with Tehran signalling no near-term de-escalation just as the Fed heads into its blackout period before the 16 September decision.", src: "https://www.cnbc.com/2026/09/10/iran-us-oil-hormuz-supply-trump-military-brent-wti.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; unanimous Reuters poll expects a BoE hold even as gilts sit at a 19-year high</strong>: all 65 economists surveyed expect the MPC to hold Bank Rate at 3.75% on 17 September, a starker consensus than the market curve, which keeps pricing hikes from November after the 10-year gilt's fresh high of 5.295%.", src: "https://www.investing.com/news/economy-news/bank-of-england-to-hold-rates-show-patience-with-wardriven-inflation-reuters-poll-4891672", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Equities &mdash; Wall Street closes lower as oil's advance compounds the hawkish repricing</strong>: the S&amp;P 500 fell Thursday as WTI topped $100 and Brent cleared $105, extending losses on top of the hot August PPI print that pushed 16 September Fed-hike odds to roughly 70%.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-10-2026", srcName: "TheStreet" },
        { html: "<strong>Macro &mdash; oil's Iran-war premium keeps feeding the Fed's rate calculus</strong>: Bloomberg's rolling oil-market coverage ties crude's climb back above $100 directly to the odds of a hike at next Wednesday's FOMC meeting, with the conflict now the dominant swing factor into the decision.", src: "https://www.bloomberg.com/news/articles/2026-09-09/latest-oil-market-news-and-analysis-for-sept-10", srcName: "Bloomberg" },
      ],
    },
  },
};
