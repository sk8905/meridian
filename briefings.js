// =============================================================================
// briefings.js — the tri-daily AI market briefings (Morning · Afternoon ·
// Evening) surfaced by the header "Briefing" button (v2/js/nav-actions.js).
//
// GENERATION (see docs/refresh-routines.md): these are written by the 5×/day
// refresh routine, NOT at runtime. Each run regenerates whichever slot the clock
// is in (morning < 12:00 · afternoon 12:00–17:00 · evening ≥ 17:00 BST), so the
// current slot is always freshest and every slot is refreshed at least once a day.
//
// GROUNDING (HOUSE_STYLE / non-negotiables): a briefing is a SUMMARY of items
// Wire already holds — every bullet carries a real `src` URL to the wire/desk item
// it compresses. No invented figures, no uncited claims. A thin news slot gets a
// short briefing, never padding. Served no-cache + tokenless (see _headers), so a
// routine refresh is picked up without a code token bump (HOUSE_STYLE T1).
// =============================================================================
export const BRIEFINGS = {
  tz: "BST",
  // Ordered for the slot chips; the view picks the current slot by clock.
  order: ["morning", "afternoon", "evening"],
  slots: {
    morning: {
      label: "Morning",
      date: "2026-08-19",
      time: "09:23 BST",
      lede: "UK July CPI accelerated to 2.9% y/y with a hotter-than-forecast core print, on a 14.7% jump in gas prices from the Ofgem cap rise, though sterling's reaction stayed muted; Asian equities and bonds sold off further overnight as bond-market anxiety hit AI-linked chip names; in legal, Sidley advised Accelerant's board on its &gt;$4bn take-private by Thoma Bravo and Simmons &amp; Simmons advised Lockhart Capital Management on a minority investment from Northcote Equity; and in credit, Bridgepoint and CIC Private Debt's CLO resets and Urban Partners' &euro;200m first close remain the desk's latest tracked deals.",
      bullets: [
        { html: "<strong>Macro &mdash; UK CPI</strong>: July inflation rose to 2.9% y/y (from 2.6%), a four-month high in line with consensus, with core CPI hotter than forecast at 2.6% on a 14.7% jump in gas prices from the Ofgem energy-cap rise; sterling's reaction was muted.", src: "https://finance.yahoo.com/economy/articles/uk-inflation-rate-rises-2-060931194.html", srcName: "Yahoo Finance UK" },
        { html: "<strong>Macro &mdash; Asia selloff</strong>: Japanese and Korean stocks slid further as bond-market anxiety hit AI-linked sentiment, with higher yields weighing heavily on chip stocks across the region ahead of today's FOMC minutes.", src: "https://www.bloomberg.com/news/articles/2026-08-19/japanese-stocks-slide-as-bond-market-anxiety-hits-ai-sentiment", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; Sidley/Accelerant</strong>: Sidley advised the board of Accelerant Holdings on its response to Thoma Bravo's all-cash take-private valued at more than $4bn, with Ropes &amp; Gray separately advising largest shareholder Altamont.", src: "https://www.sidley.com/en/newslanding/newsannouncements/2026/08/sidley-represents-board-of-directors-of-accelerant-in-us4-billion-acquisition-by-thoma-bravo", srcName: "Sidley Austin" },
        { html: "<strong>Legal &mdash; Simmons/Lockhart</strong>: Simmons &amp; Simmons advised UK wealth manager Lockhart Capital Management (&gt;&pound;1bn AUM) on a minority private-equity investment by Northcote Equity.", src: "https://www.simmons-simmons.com/en/about-us/news/simmons-simmons-advises-lockhart-on-investment-by-northcote-equity", srcName: "Simmons & Simmons" },
        { html: "<strong>Credit &mdash; CLO resets</strong>: Bridgepoint priced a &euro;307.85m reset of its debut CLO extending reinvestment to 2031, and CIC Private Debt closed a &euro;307.5m reset of Victory Street CLO I via Morgan Stanley with a roughly 90% investor roll rate.", src: "https://alternativecreditinvestor.com/2026/08/18/bridgepoint-prices-e307m-reset-of-debut-clo/", srcName: "Alternative Credit Investor" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-19",
      time: "12:34 BST",
      lede: "UK July CPI accelerated to 2.9% y/y on the Ofgem energy-cap rise, nudging sterling higher, while the dollar drifted near multi-month lows and Treasury yields eased ahead of tonight's FOMC minutes; in credit, Northleaf Capital Partners closed its debut Asset-Based Specialty Finance Fund at ~$450m; and in legal, the High Court (Ch) handed down a further costs judgment in the Quidpay/OpenPayd reserve-account dispute.",
      bullets: [
        { html: "<strong>Macro &mdash; UK CPI reaction</strong>: July inflation's rise to a four-month high of 2.9% y/y, driven by the Ofgem energy-cap increase, left sterling edging higher within range as markets weighed the hotter core print against the BoE's rate path.", src: "https://www.fxstreet.com/news/british-pound-edges-up-within-range-following-hotter-uk-inflation-data-202608190631", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; dollar/Treasuries</strong>: The dollar drifted near multi-month lows and Treasury yields eased as markets awaited this evening's FOMC minutes for clues on the Fed's next move.", src: "https://www.cnbc.com/amp/2026/08/19/dollar-drifts-near-multi-month-low-as-yields-ease-fed-minutes-awaited.html", srcName: "Reuters (via CNBC)" },
        { html: "<strong>Credit &mdash; Northleaf</strong>: Northleaf Capital Partners closed its inaugural Asset-Based Specialty Finance Fund at approximately $450m, targeting entertainment royalties, legal assets, healthcare receivables and factoring across the US, Canada, Europe and Australia.", src: "https://alternativecreditinvestor.com/2026/08/18/northleaf-asset-based-specialty-finance-fund-secures-450m-at-final-close/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Quidpay/OpenPayd</strong>: The High Court (Ch) handed down a further costs judgment in the Quidpay/OpenPayd reserve-account dispute, ordering OpenPayd to pay over &euro;2.45m and &pound;7m held in the disputed reserve account plus interest, and apportioning costs between the parties issue-by-issue.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2199", srcName: "National Archives" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-19",
      time: "17:26 BST",
      lede: "US retailers dominated the tape as Lowe's, Target, TJX and Est&eacute;e Lauder all beat Q2 estimates ahead of tonight's FOMC minutes, while UK CPI's jump to 2.9% fed forecasts of a further Ofgem price-cap rise this winter; in credit, Arini launched its first asset-based finance fund and Jefferies Credit Partners began raising &euro;1bn for a private-credit secondaries vehicle; and in legal, Freshfields advised THL Partners on its majority investment in Danish traffic-management platform Queue-it.",
      bullets: [
        { html: "<strong>Macro &mdash; US retail earnings</strong>: Target beat Q2 estimates but shares slipped as a $994m tariff refund supplied roughly 40% of the quarter's EPS, while TJX beat and raised full-year guidance yet fell on soft Q3 guidance and Lowe's and Est&eacute;e Lauder both rose on strong beats, with Fed minutes due later tonight.", src: "https://ts2.tech/en/target-stock-falls-3-as-tariff-refund-supplies-40-of-q2-eps/", srcName: "ts2.tech" },
        { html: "<strong>Macro &mdash; UK energy costs</strong>: Cornwall Insight projects Ofgem's October price cap will climb toward roughly &pound;1,729 a year for the average household as the Iran war pushes up wholesale gas and electricity prices, with a further rise expected in January &mdash; adding to the pressure behind today's 2.9% CPI print.", src: "https://www.bloomberg.com/news/articles/2026-08-19/uk-household-energy-costs-forecast-to-climb-to-a-three-year-high", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Arini</strong>: Arini Capital Management launched its first dedicated asset-based finance fund, extending the London credit manager's platform beyond its existing CLO, distressed and opportunistic-credit strategies as European ABF demand grows.", src: "https://www.9fin.com/insights/arini-first-abf-fund", srcName: "9fin" },
        { html: "<strong>Credit &mdash; Jefferies</strong>: Jefferies Credit Partners is seeking to raise around &euro;1bn from investors for a new private-credit secondaries fund that will acquire loans from its existing direct-lending portfolio and provide fresh capital for new lending.", src: "https://www.bloomberg.com/news/articles/2026-08-19/jefferies-targets-1-billion-for-private-credit-secondaries-fund", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; Freshfields/THL</strong>: Freshfields advised THL Partners on its majority investment, via THL's Automation Fund II, in Queue-it, a Danish online traffic-orchestration and bot-mitigation platform, acquiring the stake from selling shareholder GRO.", src: "https://www.freshfields.com/en/our-thinking/news/news-search/2026/08/freshfields-advises-thl-partners-on-majority-investment-in-queue-it", srcName: "Freshfields" },
      ],
    },
  },
};
