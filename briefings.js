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
      date: "2026-09-17",
      time: "08:19 BST",
      lede: "The Fed hiked 25bp to 3.75&ndash;4.00% Wednesday and Goldman Sachs now sees a second hike in October, Asian markets steadied overnight as oil eased toward $102/bbl, and sterling sank below $1.3400 ahead of the Bank of England's own decision at noon.",
      bullets: [
        { html: "<strong>Macro &mdash; Goldman Sachs abandoned its 'one-and-done' call overnight</strong>, now expecting a second 25bp Fed hike in October after Wednesday's dot plot showed a 16-to-2 majority for at least one more 2026 move.", src: "https://www.brecorder.com/news/40439917/goldman-sachs-now-sees-fed-hiking-again-in-october", srcName: "Business Recorder (Reuters)" },
        { html: "<strong>Equities &mdash; Asian markets rose Thursday</strong> (Nikkei, Topix, Kospi and Kosdaq all gained) as the widely-expected Fed hike removed uncertainty, though Tokyo tech lagged ahead of Friday's own BoJ decision.", src: "https://investinglive.com/news/investinglive-asia-pacific-market-news-fed-hike-fallout-dominates/", srcName: "investingLive" },
        { html: "<strong>Fixed income &mdash; sterling sank to just under $1.3400 overnight</strong>, as the Fed's hike lifted the midpoint of the US policy rate above the Bank of England's 3.75% for the first time this year, ahead of the BoE's own decision at 11:00 GMT today.", src: "https://www.fxstreet.com/news/pound-sterling-price-news-and-forecast-gbp-usd-sinks-as-the-fed-overtakes-the-boe-202609161939", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; the Bank of England is widely expected to hold Bank Rate at 3.75% at today's decision</strong>, a day after the Fed's own hike, though markets still price roughly an 80% chance of a follow-up BoE hike in November given the Iran-war energy shock.", src: "https://www.investing.com/news/economy-news/bank-of-england-to-hold-rates-but-energy-shock-stirs-talk-of-a-hike-4904677", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Fixed income &mdash; Brent crude eased toward $102/bbl overnight</strong>, pulling back further from Tuesday's $109 peak, on signs Saudi Arabia's damaged East-West pipeline will restart operations within days.", src: "https://www.cnbc.com/2026/09/16/oil-prices-today-brent-wti-hormuz-iran-war.html", srcName: "CNBC" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-17",
      time: "12:00 BST",
      lede: "The Bank of England held Bank Rate at 3.75% by the same 6&ndash;3 vote as July and voted to slow QT to about &pound;50bn a year, a day after the Fed's own hike lifted the US policy midpoint above Bank Rate for the first time this year; sterling stays pinned near six-week lows and Goldman Sachs and Citigroup have both moved to explicit November hike calls.",
      bullets: [
        { html: "<strong>Macro &mdash; the MPC held Bank Rate at 3.75% today</strong>, by the same 6&ndash;3 vote as July (Greene, Mann and Pill again dissenting for a hike), and voted to slow quantitative tightening to roughly &pound;50bn a year from &pound;70bn.", src: "https://www.cnbc.com/2026/09/17/bank-of-england-interest-rate-decision-fed-rate-hike-uk-inflation.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; sterling stayed pinned near six-week lows around $1.3375-1.3400</strong>, as dollar strength from Wednesday's Fed hike outweighed today's widely-expected BoE hold.", src: "https://www.fxstreet.com/news/british-pound-languishes-near-late-july-lows-as-hawkish-fed-underpins-usd-ahead-of-boe-202609170104", srcName: "FXStreet" },
        { html: "<strong>Equities &mdash; the FTSE 100's early gains faded through the session</strong> after the MPC's hold, with Governor Bailey flagging upside energy-price risk even as two more sell-side houses moved to explicit November-hike calls.", src: "https://uk.finance.yahoo.com/news/ftse-100-early-promise-fades-162104275.html", srcName: "Yahoo Finance UK" },
        { html: "<strong>Macro &mdash; Goldman Sachs and Citigroup both hardened their BoE calls around today's decision</strong> &mdash; Goldman now sees a 25bp hike in November before a hold, Citi looks for hikes in both November 2026 and February 2027 &mdash; joining Deutsche Bank and Barclays in a firming hawkish consensus.", src: "https://www.kitco.com/news/off-the-wire/2026-09-14/goldman-sachs-sees-boe-rate-hike-november-amid-inflation-concerns", srcName: "Reuters (via Kitco)" },
        { html: "<strong>Macro &mdash; Fed Chair Warsh defended Wednesday's hike as a good-news, growth story</strong> rather than a concession to Trump's pressure for cuts, in his first extended remarks since the decision.", src: "https://www.bloomberg.com/news/articles/2026-09-17/trump-denied-rate-cut-as-federal-reserve-targets-war-stoked-inflation", srcName: "Bloomberg" },
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
