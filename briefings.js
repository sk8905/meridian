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
      date: "2026-09-19",
      time: "08:14 BST",
      lede: "Wall Street closed out a third straight losing week Friday with the 10-year Treasury yield still near 5%, two days after the Fed's hike to 3.75&ndash;4.00%, while attention turns to next week's Trump-Xi summit after Washington delayed excess-capacity tariffs; in the UK, the Bank of England held Bank Rate at 3.75% and its gilt-sale pause is easing repo-market pressure following August's surprise retail-sales bounce.",
      bullets: [
        { html: "<strong>Equities &mdash; Wall Street posted a third straight weekly loss</strong>: the S&amp;P 500 rose 0.17% to 7,650.50 and the Nasdaq gained 0.39% to 26,522.55 Friday, but the Dow slipped 0.18% to 51,682.64, with the 10-year Treasury yield still hovering near 5%.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-september-18-dow-sp-500-nasdaq-080504071.html", srcName: "Yahoo Finance" },
        { html: "<strong>Macro &mdash; the Fed raised its funds-rate target to 3.75&ndash;4.00% on Wednesday</strong>, its first hike since 2023, with markets now pricing further tightening into 2027.", src: "https://www.cnbc.com/2026/09/16/fed-rate-decision-september-2026.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; the Bank of England's gilt-sale pause is easing repo-market pressure</strong>, Barclays said, after Thursday's decision to halt long-dated sales and slow QT to about &pound;50bn a year, even as the BoE held Bank Rate at 3.75% this week.", src: "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/september-2026", srcName: "Bank of England" },
        { html: "<strong>Macro &mdash; Washington is delaying excess-capacity tariffs until after next week's Trump-Xi summit</strong>, where a possible $30bn trade deal is on the table alongside the tariff dispute.", src: "https://www.bloomberg.com/news/articles/2026-09-17/us-said-to-delay-excess-capacity-tariffs-until-after-xi-summit", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; UK retail sales rebounded in August as department stores recovered</strong>, a rare upside surprise in the same week the Bank of England held rates.", src: "https://www.investing.com/news/economic-indicators/uk-retail-sales-rebound-in-august-as-department-stores-recover-4906728", srcName: "Reuters (via Investing.com)" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-19",
      time: "12:20 BST",
      lede: "US and Chinese trade teams are set to huddle in New York on AI and Iran ahead of next week's Trump-Xi summit, while Goldman Sachs has dropped its &ldquo;one-and-done&rdquo; call and now sees a second Fed hike in October; sterling stayed on the back foot on rising UK fiscal worries even after the Bank of England reiterated Thursday's hold, with Wall Street still nursing a third straight losing week and the 10-year Treasury yield near 5%.",
      bullets: [
        { html: "<strong>Macro &mdash; US and Chinese trade teams are set to huddle in New York on AI and Iran</strong> ahead of next week's Trump-Xi summit, where a possible $30bn trade deal remains on the table.", src: "https://www.bloomberg.com/news/articles/2026-09-19/us-china-trade-teams-set-to-huddle-in-new-york-on-ai-iran", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; Goldman Sachs dropped its &ldquo;one-and-done&rdquo; call and now sees a second Fed hike in October</strong>, adding to Wall Street's debate &mdash; sparked by Fed governor Kevin Warsh's remarks this week &mdash; over how far the tightening cycle still has to run.", src: "https://investinglive.com/central-banks/goldman-ditches-one-and-done-call-now-sees-a-second-fed-hike-in-october/", srcName: "investingLive" },
        { html: "<strong>Macro &mdash; sterling stayed on the back foot on rising UK fiscal worries</strong>, even as UOB Group noted the Bank of England's reiterated Thursday hold at 3.75% left the door open to a later move.", src: "https://www.fxstreet.com/news/pound-sterling-price-news-and-forecast-gbp-declines-on-rising-uk-fiscal-worries-202509191207", srcName: "FXStreet" },
        { html: "<strong>Equities &mdash; Wall Street is still nursing a third straight losing week</strong>, with the S&amp;P 500 up just 0.17% and the Dow down 0.18% on Friday as the 10-year Treasury yield held near 5% heading into next week's Trump-Xi summit.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-september-18-dow-sp-500-nasdaq-080504071.html", srcName: "Yahoo Finance" },
        { html: "<strong>Macro &mdash; FXStreet's week-ahead flags Trump-Xi, oil, tariffs and PMIs</strong> as the catalysts to watch, with the excess-capacity tariff delay and the trade-team meeting setting the tone into the summit.", src: "https://www.fxstreet.com/analysis/forecasting-the-upcoming-week-trump-xi-oil-tariffs-and-pmis-202609181831", srcName: "FXStreet" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-18",
      time: "21:20 BST",
      lede: "US stocks closed mixed in the year's second-largest triple-witching session as Bitcoin surged past $80,000, capping a week of three G7 central-bank moves &mdash; the Fed's hike, the BoE's hold-and-slow-QT, and a Bank of Japan rise to a 31-year high &mdash; while UK retail sales' August rebound kept a November BoE hike in play.",
      bullets: [
        { html: "<strong>Equities &mdash; Wall Street closed a ~$7tn triple-witching session mixed</strong>: the S&amp;P 500 rose 0.17% to 7,650.50 and the Nasdaq gained 0.39% to 26,522.55, but the Dow slipped 0.18% to 51,682.64, a third straight losing week with the 10-year Treasury yield still near 5%.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-september-18-dow-sp-500-nasdaq-080504071.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the Bank of England's gilt-sale pause is easing repo-market pressure</strong>, Barclays said, sending 30-year gilt yields to their largest one-day fall since April after Thursday's decision to halt long-dated sales and slow QT to about &pound;50bn a year.", src: "https://www.bloomberg.com/news/articles/2026-09-18/boe-s-balance-sheet-move-eases-repo-pressure-barclays-says", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; the Bank of Japan hiked 25bp overnight to 1.25%</strong>, a 31-year high, flagging continued inflation concern as the third G7 central-bank move in three days after the Fed's hike and the BoE's hold &mdash; weakening the yen further.", src: "https://www.cnbc.com/2026/09/18/japan-raises-rates-30-year-high-yen-jgb.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK retail sales rose 0.5% in August</strong>, defying a forecast decline, and Barclays now backs a November BoE hike &mdash; though it warned a Middle East conflict could spur more tightening still.", src: "https://www.investing.com/news/economy-news/barclays-backs-november-boe-hike-warns-middle-east-conflict-could-spur-more-4906680", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Equities &mdash; Bitcoin surged past $80,000</strong>, its best day since the Fed's hike, as short-covering and returning spot-ETF inflows lifted crypto-linked stocks including Strategy, Coinbase and Robinhood.", src: "https://www.coindesk.com/tech/2026/09/18/live-updates-hype-leads-altcoin-rally-as-bitcoin-recovers-toward-usd78-000", srcName: "CoinDesk" },
      ],
    },
  },
};
