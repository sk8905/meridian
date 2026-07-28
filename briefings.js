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
      date: "2026-07-28",
      time: "05:28 BST",
      lede: "A chip-led selloff hits Asia as South Korea's KOSPI plunges 8% and trips its 8th circuit-breaker of the year on deepening AI-capex fatigue, while oil's slide continues and the FOMC decision looms Wednesday.",
      bullets: [
        { html: "<strong>Korea</strong>: the KOSPI plunged 8.02% to 6,213.51 &mdash; triggering a Level 1 circuit breaker, its 8th this year &mdash; as SK Hynix and Samsung Electronics fell 8&ndash;12% on contagion from Nvidia's OpenAI-financing jitters and deepening worries over AI-chip-spending sustainability.", src: "https://www.cnbc.com/2026/07/28/sk-hynix-plunges-semiconductor-selloff-deepens-samsung-softbank.html", srcName: "CNBC" },
        { html: "<strong>Oil</strong> extended its decline as Trump said the US is in talks with Iran to end the war, adding to the pullback from last week's $100+ spike and further easing the inflation-risk input into this week's Fed decision.", src: "https://www.bloomberg.com/news/articles/2026-07-27/latest-oil-market-news-and-analysis-for-july-28", srcName: "Bloomberg" },
        { html: "<strong>FOMC</strong>: the Fed is widely expected to hold rates steady on 29 Jul, with markets and economists reading a hold as the base case even after last week's oil-driven hike-odds spike.", src: "https://www.cnbc.com/2026/07/27/fed-interest-rates-july.html", srcName: "CNBC" },
        { html: "<strong>UK</strong>: the FTSE 100 opened higher as the tumbling oil price and strong results from Vodafone and AstraZeneca offset the overnight Asia selloff, with the BoE's own decision due 30 Jul.", src: "https://finance.yahoo.com/markets/world-indices/articles/ftse-100-live-strong-start-061600170.html", srcName: "Yahoo Finance" },
        { html: "<strong>Private credit</strong>: PGIM agreed to acquire the remaining 25% of Deerpath Capital, taking full ownership of the ~$16bn US direct lender, while M&amp;G priced its second euro CLO refinancing of 2026.", src: "https://alternativecreditinvestor.com/2026/07/27/pgim-acquires-remaining-stake-in-deerpath-capital/", srcName: "Alternative Credit Investor" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-07-28",
      time: "13:20 BST",
      lede: "European stocks steady after a brutal Asian session &mdash; the FTSE outperforms on tumbling oil and strong Vodafone and AstraZeneca results &mdash; while US chip names slip again ahead of Wednesday&rsquo;s FOMC decision and a Big Tech earnings gauntlet.",
      bullets: [
        { html: "<strong>Asia</strong>: the KOSPI plunged as much as 10.9% &mdash; tripping its 9th circuit breaker of 2026 &mdash; and the Nikkei fell 3.95% as the AI-chip selloff deepened on Nvidia circular-financing fears and fresh Chinese memory- and lithography-competition worries.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-28-2026", srcName: "TheStreet" },
        { html: "<strong>Chips</strong>: Micron, AMD and Marvell slid and Nvidia eased about 1% at the US open after Chinese memory-maker CXMT&rsquo;s blockbuster debut and a report that a state-backed firm began mass-producing immersion DUV lithography machines stoked competition fears.", src: "https://www.barchart.com/story/news/3495886/nasdaq-futures-slump-as-chip-selloff-rages-on-fomc-meeting-and-earnings-on-tap", srcName: "Barchart" },
        { html: "<strong>UK</strong>: the FTSE 100 outperformed, buoyed by the oil slide and strong earnings &mdash; Vodafone rose about 3.6% after guiding to the top end of its outlook and AstraZeneca gained about 1.6% on a Q2 beat (core EPS $2.63 vs $2.48 expected).", src: "https://uk.advfn.com/market-news/article/20238/market-open-vodafone-raises-guidance-astrazeneca-h1-growth", srcName: "ADVFN" },
        { html: "<strong>Earnings gauntlet</strong>: after Tesla and Alphabet flagged heavy AI spending, Microsoft and Amazon headline this week&rsquo;s mega-cap reports, with AI-capex guidance the market&rsquo;s main focus.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-28-2026", srcName: "TheStreet" },
        { html: "<strong>Fed</strong>: the FOMC&rsquo;s two-day meeting opens today with the decision due Wednesday 29 Jul; a hold is widely expected as oil&rsquo;s pullback from last week&rsquo;s $100+ spike eases the near-term inflation read.", src: "https://www.cnbc.com/2026/07/27/fed-interest-rates-july.html", srcName: "CNBC" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-07-28",
      time: "23:04 BST",
      lede: "Apple briefly touches a $5 trillion market cap even as chip names keep the Nasdaq under pressure, Trump and Netanyahu call their Oval Office meeting &ldquo;productive&rdquo;, and attention turns to tomorrow&rsquo;s FOMC decision and Thursday&rsquo;s BoE call.",
      bullets: [
        { html: "<strong>Apple</strong> touched a $5 trillion market capitalisation for the first time intraday, even as the broader chip-led selloff kept the Nasdaq under pressure.", src: "https://www.cnbc.com/2026/07/28/apple-touches-5-trillion-market-cap-for-first-time-.html", srcName: "CNBC" },
        { html: "<strong>US stocks</strong>: the Dow jumped about 520 points while the Nasdaq continued to struggle through the chip-stock panic that has weighed on Micron, AMD, Marvell and Nvidia this week.", src: "https://www.fool.com/investing/2026/07/28/dow-jumps-520-points-while-nasdaq-struggles/", srcName: "The Motley Fool" },
        { html: "<strong>Fed</strong>: the FOMC decision lands tomorrow, 29 Jul, with a hold still the consensus call even after last week&rsquo;s oil-driven wobble in hike odds.", src: "https://www.tradingkey.com/analysis/stocks/us-stocks/262054021-july-fomc-fed-oil-us-oil-tradingkey", srcName: "TradingKey" },
        { html: "<strong>Geopolitics</strong>: Trump and Netanyahu described their Oval Office meeting as &ldquo;productive&rdquo;, easing weeks of tension over the Iran war, ahead of a Bank of England decision due Thursday.", src: "https://www.axios.com/2026/07/28/trump-netanyahu-oval-office-iran-war", srcName: "Axios" },
        { html: "<strong>Legal</strong>: White &amp; Case advised Ionic Digital &mdash; the company that emerged from Celsius Mining&rsquo;s Chapter 11 &mdash; on its direct listing on Nasdaq (ticker IOND) at a $53/share reference price, implying a roughly $2.4bn post-money valuation.", src: "https://www.whitecase.com/news/press-release/white-case-advises-ionic-digital-direct-listing-nasdaq", srcName: "White & Case" },
      ],
    },
  },
};
