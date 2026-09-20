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
      date: "2026-09-19",
      time: "21:11 BST",
      lede: "Attention is turning to next week's Trump-Xi summit in Washington &mdash; tariffs, Taiwan and AI all on the table &mdash; as Wall Street closes out a third straight losing week following the Fed's hike to 3.75&ndash;4.00%, and the Bank of Japan followed with its own 25bp move to a 31-year-high 1.25%, the third G7 central-bank decision in three days; in the UK, gilt-market strain keeps easing on the Bank of England's paused sales even as Chancellor Healey weighs a wider mansion-tax band ahead of the 28 October Budget.",
      bullets: [
        { html: "<strong>Macro &mdash; next week's Trump-Xi summit in Washington will test tariffs, Taiwan and AI cooperation</strong>, with Beijing said to be weighing whether a pending Taiwan arms sale derails the visit and the expiring Busan tariff truce still unresolved.", src: "https://invezz.com/news/2026/09/19/trump-xi-summit-what-to-expect-on-tariffs-taiwan-iran-and-ai/", srcName: "Invezz" },
        { html: "<strong>Equities &mdash; Wall Street closed a third straight losing week Friday in a ~$7tn triple-witching session</strong>: the S&amp;P 500 rose 0.17% to 7,650.50 and the Nasdaq gained 0.39% to 26,522.55, but the Dow slipped 0.18% to 51,682.64.", src: "https://www.investing.com/news/stock-market-news/triple-witching-event-sees-7-trillion-in-us-options-expire-93CH-4907480", srcName: "Investing.com" },
        { html: "<strong>Fixed income &mdash; the Bank of Japan raised its policy rate 25bp to 1.25%</strong>, a 31-year high and the third G7 central-bank move this week after the Fed's hike and the Bank of England's hold, in a 7-2 vote flagging further upside inflation risk.", src: "https://www.cnbc.com/2026/09/18/japan-raises-rates-30-year-high-yen-jgb.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Chancellor Healey is weighing a wider mansion-tax band</strong>, on homes worth over &pound;1.5m, as the government hunts revenue ahead of the 28 October Autumn Budget.", src: "https://www.bloomberg.com/news/articles/2026-09-19/uk-mansion-tax-may-expand-to-homes-worth-over-1-5-million", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; the Bank of England's gilt-sale pause is easing repo-market pressure</strong>, Barclays said, sending 30-year gilt yields to their largest one-day fall since April after Thursday's decision to halt long-dated sales and slow QT to about &pound;50bn a year.", src: "https://www.bloomberg.com/news/articles/2026-09-18/boe-s-balance-sheet-move-eases-repo-pressure-barclays-says", srcName: "Bloomberg" },
      ],
    },
  },
};
