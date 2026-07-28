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
      time: "18:45 BST",
      lede: "Wall Street splits as a deepening AI-chip selloff caps the tape &mdash; the Dow edges higher on earnings while the Nasdaq lags &mdash; with oil still sliding and the FOMC decision now a day away.",
      bullets: [
        { html: "<strong>US stocks</strong>: the Dow rose about 0.5% to ~52,210 while the S&amp;P 500 finished roughly flat and the Nasdaq lagged, as semiconductors &mdash; Micron, AMD, Marvell and Nvidia &mdash; stayed under pressure through the session.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-28-2026", srcName: "TheStreet" },
        { html: "<strong>Chips</strong>: the rout traced to Chinese memory-maker CXMT&rsquo;s debut and a report of state-backed mass production of immersion DUV lithography machines, alongside renewed scrutiny of Nvidia&rsquo;s roughly $750bn of AI-infrastructure commitments and their circular financing.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-28-2026", srcName: "TheStreet" },
        { html: "<strong>Asia contagion</strong>: the day&rsquo;s risk-off tone was set overnight as the KOSPI plunged up to 10.9% &mdash; its 9th circuit breaker of the year &mdash; and the Nikkei dropped 3.95% on the same AI-capex-sustainability fears.", src: "https://www.barchart.com/story/news/3495886/nasdaq-futures-slump-as-chip-selloff-rages-on-fomc-meeting-and-earnings-on-tap", srcName: "Barchart" },
        { html: "<strong>Oil</strong> extended its decline as President Trump said the US is in talks with Iran to end the war, deepening the pullback from last week&rsquo;s $100+ spike and further easing the inflation-risk input into Wednesday&rsquo;s Fed decision.", src: "https://www.bloomberg.com/news/articles/2026-07-27/latest-oil-market-news-and-analysis-for-july-28", srcName: "Bloomberg" },
        { html: "<strong>Fed</strong>: with the FOMC decision due Wednesday 29 Jul and a hold the base case, focus is on whether the oil scare&rsquo;s reversal and this week&rsquo;s mega-cap AI-capex guidance reshape the September rate path.", src: "https://www.cnbc.com/2026/07/27/fed-interest-rates-july.html", srcName: "CNBC" },
      ],
    },
  },
};
