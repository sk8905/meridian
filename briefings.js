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
      date: "2026-09-15",
      time: "08:12 BST",
      lede: "One day from the Fed's decision, the 10-year Treasury climbed to its highest level since 2007 as oil extended its advance, while UK jobs data landed mixed and sterling held near a five-week low against a firming dollar.",
      bullets: [
        { html: "<strong>Macro &mdash; Asian shares slipped and US equity futures fell</strong> as oil extended its advance (Brent +1.2-1.8% toward $107/bbl) and a Reuters poll found 85% of economists now expect Wednesday's Fed hike, up from under a third a week earlier, with a Bank of Japan decision following Friday.", src: "https://www.investing.com/news/stock-market-news/shares-slip-in-asia-as-oil-climbs-rate-hikes-loom-4898763", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Equities &mdash; US stock futures fell ahead of the open</strong>: S&amp;P 500 futures were down 0.38%, Dow futures lost 240 points (-0.45%) and Nasdaq 100 futures dropped 0.46% as traders weighed the rising-oil, rising-yield backdrop one day before the Fed's decision.", src: "https://finance.yahoo.com/markets/stocks/articles/u-stock-futures-fall-oil-131447622.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield rose to its highest level since 2007</strong>, up more than 6bp to 5.025% (30-year 5.384%, 2-year 4.68%), as a deepening global bond selloff left money markets treating Wednesday's hike as an almost certain move.", src: "https://www.cnbc.com/2026/09/15/10-year-treasury-yield-rises-to-highest-since-2007.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK unemployment held at 4.9% in the three months to July</strong>, below the 5% forecast, though the economy added just 67,000 jobs (down from 83,000 prior) &mdash; a mixed ONS release the day before the BoE's own decision.", src: "https://www.fxstreet.com/news/british-pound-pushes-against-five-week-lows-following-mixed-uk-employment-data-202609150628", srcName: "FXStreet" },
        { html: "<strong>Fixed income &mdash; sterling held just above a five-week low near $1.3465</strong> as the mixed UK jobs data failed to offset dollar strength from firming Fed-hike bets, with Wednesday's FOMC and Thursday's BoE decision (widely expected to hold) the next catalysts.", src: "https://www.fxstreet.com/news/british-pound-drops-against-japanese-yen-after-uk-labor-market-data-202609150619", srcName: "FXStreet" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-15",
      time: "12:20 BST",
      lede: "One day from the Fed's decision, a Reuters poll now finds 85% of economists expecting Wednesday's hike as the 10-year Treasury sits at its highest since 2007 and Brent holds near $107/bbl, while Goldman Sachs adds a call for a BoE hike in November even as Thursday's meeting is still seen as a hold.",
      bullets: [
        { html: "<strong>Macro &mdash; a Reuters poll of 101 economists now finds 85% expecting Wednesday's Fed hike</strong>, up from under a third a week earlier, as the FOMC enters the final stretch of its blackout period before the decision.", src: "https://www.investing.com/news/economy-news/fed-rate-hike-on-wednesday-now-likely-say-economists-and-at-least-one-more-to-follow-4899032", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Equities &mdash; Asian stocks were set to fall and US futures softened</strong> as the AI-slowdown warnings from Anthropic's Amodei and OpenAI's Altman continued to weigh on chip names alongside the fresh yield surge, with Wednesday's Fed decision the next catalyst.", src: "https://www.bloomberg.com/news/articles/2026-09-14/asian-stocks-to-fall-on-ai-key-us-yield-tops-5-markets-wrap", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield rose to its highest level since 2007</strong>, up more than 6bp to 5.025% (30-year 5.384%, 2-year 4.68%), as a deepening global bond selloff left money markets treating Wednesday's hike as an almost certain move.", src: "https://www.bloomberg.com/news/articles/2026-09-14/us-10-year-yield-breaches-5-as-inflation-supply-worries-mount", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Goldman Sachs now sees the Bank of England hiking Bank Rate to 4% in November</strong>, even as Thursday's 17 September meeting is still widely expected to be a hold given the fragile labour market.", src: "https://www.kitco.com/news/off-the-wire/2026-09-14/goldman-sachs-sees-boe-rate-hike-november-amid-inflation-concerns", srcName: "Reuters (via Kitco)" },
        { html: "<strong>Fixed income &mdash; sterling held just above a five-week low near $1.3465</strong> as Tuesday's mixed UK jobs data (unemployment steady at 4.9%, but only +67,000 jobs vs +83,000 prior) failed to offset dollar strength from firming Fed-hike bets.", src: "https://www.fxstreet.com/news/british-pound-pushes-against-five-week-lows-following-mixed-uk-employment-data-202609150628", srcName: "FXStreet" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-15",
      time: "17:23 BST",
      lede: "Wall Street extended Monday's AI-slowdown selloff into Tuesday as the Dow fell more than 500 points and the 10-year Treasury yield climbed to its highest level since 2007, with global banks coalescing around a Wednesday Fed hike and sterling sliding toward a five-week low ahead of Thursday's Bank of England decision.",
      bullets: [
        { html: "<strong>Equities &mdash; Wall Street extended Monday's AI-driven slide</strong>: the Dow fell more than 500 points Tuesday as losses accelerated alongside the 10-year Treasury yield's move to a fresh 19-year high, one day before the Fed's decision.", src: "https://www.cnbc.com/2026/09/14/stock-market-today-live-updates.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield climbed to its highest level since 2007</strong>, near 5.03%, as a deepening global bond selloff left money markets treating Wednesday's Fed hike as an almost certain move.", src: "https://www.cnbc.com/2026/09/15/10-year-treasury-yield-rises-to-highest-since-2007.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; sterling held just above a five-week low near $1.3465</strong> as Tuesday's mixed UK jobs data (unemployment steady at 4.9%, but only +67,000 jobs vs +83,000 prior) failed to offset dollar strength from firming Fed-hike bets.", src: "https://www.fxstreet.com/news/british-pound-pushes-against-five-week-lows-following-mixed-uk-employment-data-202609150628", srcName: "FXStreet" },
        { html: "<strong>Equities &mdash; chip and AI-linked names stayed under pressure</strong> after Anthropic's Dario Amodei, OpenAI's Sam Altman and Elon Musk all called for a slowdown in frontier AI development over the weekend, extending Monday's selloff into Tuesday's session.", src: "https://www.cnbc.com/2026/09/14/ai-stocks-slowdown-amodei-altman.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; HSBC, Goldman Sachs and J.P. Morgan all now expect Wednesday's Fed decision to be a hike</strong>, with banks coalescing around the call as inflation continues to surprise to the upside ahead of the FOMC meeting.", src: "https://www.staradvertiser.com/2026/09/14/breaking-news/global-banks-coalesce-around-fed-hike-call-after-inflation-surprises/", srcName: "Reuters (via Honolulu Star-Advertiser)" },
      ],
    },
  },
};
