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
      date: "2026-09-20",
      time: "08:22 BST",
      lede: "Treasury Secretary Bessent and China's He Lifeng opened talks on AI, trade and critical minerals in New York ahead of Thursday's Trump-Xi summit, as Wall Street heads into the week still digesting the Fed's hike to 3.75&ndash;4.00% with 30-year mortgage rates near 7% and the 10-year Treasury yield still close to 5%, while the Bank of England's gilt-sale pause keeps easing repo-market pressure.",
      bullets: [
        { html: "<strong>Macro &mdash; Treasury Secretary Bessent and China's He Lifeng opened talks on AI, trade and critical minerals in New York</strong>, at JPMorgan's Manhattan headquarters, teeing up potential agreements ahead of Thursday's Trump-Xi summit, with the expiring US-China trade truce and China's rare-earth supply among the key sticking points.", src: "https://www.cnbc.com/2026/09/20/bessent-chinas-he-to-hold-talks-on-ai-trade-minerals-reuters.html", srcName: "CNBC (Reuters)" },
        { html: "<strong>Equities &mdash; Wall Street closed a third straight losing week Friday</strong>: the S&amp;P 500 rose 0.17% to 7,650.50 and the Nasdaq gained 0.39% to 26,522.55, but the Dow slipped 0.18% to 51,682.64 in a ~$7tn triple-witching session, with the 10-year Treasury yield still near 5%.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-september-18-dow-sp-500-nasdaq-080504071.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; 30-year mortgage rates sit near 7.01% heading into the week</strong>, MortgageDaily's outlook says, with long-term Treasury yields still elevated even as the Fed's first hike since 2023 is now behind the market.", src: "https://www.mortgagedaily.com/rates/mortgage-rates-week-ahead-2026-09-20/", srcName: "MortgageDaily" },
        { html: "<strong>Macro &mdash; the week ahead brings flash September PMIs and a heavy Fed-speaker slate</strong> alongside Thursday's Trump-Xi summit, CNBC's markets outlook says, as investors look for direction after the Fed's hike.", src: "https://www.cnbc.com/2026/09/18/stock-market-next-week-outlook-for-sept-21-25-2026.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; the Bank of England's gilt-sale pause is easing repo-market pressure</strong>, Barclays said, after Thursday's decision to halt long-dated sales and slow QT to about &pound;50bn a year, even as the BoE held Bank Rate at 3.75% this week.", src: "https://www.bloomberg.com/news/articles/2026-09-18/boe-s-balance-sheet-move-eases-repo-pressure-barclays-says", srcName: "Bloomberg" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-20",
      time: "12:20 BST",
      lede: "Treasury Secretary Bessent and China's He Lifeng are holding talks on AI, trade and critical minerals in New York, with Trump saying he expects &ldquo;a lot&rdquo; of deals at Thursday's Trump-Xi summit, as Hormuz oil shipments hit a six-month high and the Fed's dot plot keeps a second 2026 hike live; Wall Street heads into the new week nursing a third straight losing week and Treasury yields near 5%, while Barclays now backs a November Bank of England hike even as sterling stays pressured by UK fiscal worries.",
      bullets: [
        { html: "<strong>Macro &mdash; Treasury Secretary Bessent and China's He Lifeng opened talks on AI, trade and critical minerals in New York</strong>, at JPMorgan's Manhattan headquarters, teeing up potential agreements ahead of Thursday's Trump-Xi summit, with the expiring US-China trade truce and China's rare-earth supply among the key sticking points.", src: "https://www.cnbc.com/2026/09/20/bessent-chinas-he-to-hold-talks-on-ai-trade-minerals-reuters.html", srcName: "CNBC (Reuters)" },
        { html: "<strong>Equities &mdash; Wall Street closed a third straight losing week Friday</strong>: the S&amp;P 500 rose 0.17% to 7,650.50 and the Nasdaq gained 0.39% to 26,522.55, but the Dow slipped 0.18% to 51,682.64 in a ~$7tn triple-witching session, with the 10-year Treasury yield still near 5%.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-september-18-dow-sp-500-nasdaq-080504071.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the Fed's dot plot keeps a second 2026 hike live</strong>, with 16 of 19 FOMC participants pencilling in at least one further move after Wednesday's 25bp hike to 3.75&ndash;4.00%, Bloomberg's World Economy Latest round-up says.", src: "https://www.bloomberg.com/news/articles/2026-09-19/world-economy-latest-fed-boosts-interest-rates-signals-another-2026-hike", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Hormuz oil shipments hit a six-month high</strong>, a senior US commander said, even as the Strait's tanker traffic stays shadowed by the ongoing Iran standoff that has kept Brent elevated through September.", src: "https://www.bloomberg.com/news/articles/2026-09-19/hormuz-oil-shipments-hit-six-month-high-us-commander-says", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; Barclays now backs a November Bank of England hike</strong> and warned a wider Middle East conflict could spur further tightening, a day after the MPC's 6&ndash;3 hold at 3.75%; sterling has stayed on the back foot on rising UK fiscal worries into Chancellor Healey's 28 October Budget.", src: "https://www.investing.com/news/economy-news/barclays-backs-november-boe-hike-warns-middle-east-conflict-could-spur-more-4906680", srcName: "Reuters (via Investing.com)" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-20",
      time: "17:13 BST",
      lede: "Bessent, Greer and China's He Lifeng held final preparatory talks in New York on trade, AI and Iran ahead of Thursday's Trump-Xi summit in Washington, as Wall Street closes out a third straight losing week with Treasury yields still elevated, and UK 30-year gilts at their highest since 1998 squeeze Chancellor Healey's Budget headroom even as he weighs a wider mansion-tax net ahead of 28 October.",
      bullets: [
        { html: "<strong>Macro &mdash; Bessent, Greer and China's He Lifeng held final preparatory talks in New York</strong> on trade and investment, AI guardrails and the Iran war, working toward deliverables for Thursday's Trump-Xi summit in Washington, with the expiring November tariff truce and China's Boeing/agricultural purchase pledges among the open items.", src: "https://www.bloomberg.com/news/articles/2026-09-20/us-china-begin-trade-talks-in-new-york-ahead-of-trump-xi-summit", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; Wall Street closed a third straight losing week Friday in a ~$7tn triple-witching session</strong>: the S&amp;P 500 rose 0.17% to 7,650.50 and the Nasdaq gained 0.39% to 26,522.55, but the Dow slipped 0.18% to 51,682.64.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-september-18-dow-sp-500-nasdaq-080504071.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; UK 30-year gilt yields at 5.89%, their highest since 1998, have roughly halved Chancellor Healey's fiscal headroom</strong> to about &pound;13.8bn from &pound;26bn, driven by the global bond sell-off and rate-hike expectations, ahead of his 28 October Budget.", src: "https://www.techtimes.com/articles/326996/20260908/uk-locks-priciest-30-year-gilt-yield-since-1998-tax-rises-october-budget-now-near-certain.htm", srcName: "Tech Times" },
        { html: "<strong>Macro &mdash; Chancellor Healey is weighing lowering the UK mansion-tax threshold to homes worth over &pound;1.5m</strong>, sweeping roughly 271,000 properties into the surcharge as the Treasury hunts revenue ahead of the Autumn Budget.", src: "https://www.bloomberg.com/news/articles/2026-09-19/uk-mansion-tax-may-expand-to-homes-worth-over-1-5-million", srcName: "Bloomberg" },
      ],
    },
  },
};
