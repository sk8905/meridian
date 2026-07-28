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
      date: "2026-07-27",
      time: "12:18 BST",
      lede: "Risk tone steadies through the European session as oil holds its weekend pullback; attention turns to a Big Tech earnings gauntlet and Tuesday&rsquo;s FOMC open.",
      bullets: [
        { html: "<strong>Crude</strong> holds lower on peace-talk hopes after topping $100 last week — the FOMC-week oil path is the swing factor for the Fed&rsquo;s inflation read.", src: "https://www.fxleaders.com/news/2026/07/25/crude-oil-weekly-recap-and-outlook-brent-tops-dollar100-then-retreats-on-peace-talk-hopes-fomc-week-ahead/", srcName: "FX Leaders" },
        { html: "<strong>Earnings gauntlet</strong>: Microsoft and Meta report Wed (29 Jul), Apple and Amazon Thu (30 Jul) — four of the most valuable companies inside a 48-hour window, with AI-capex guidance in focus.", src: "https://www.cnbc.com/2026/07/24/stock-market-next-week-outlook-for-july-27-31-2026.html", srcName: "CNBC" },
        { html: "<strong>Tariffs</strong>: new Section 301 duties (10&ndash;12.5% on 60 trading partners) took effect Friday, adding a tariff-passthrough inflation input for the Fed to weigh alongside the oil shock.", src: "https://www.bloomberg.com/news/articles/2026-07-25/trump-s-tariffs-are-likely-to-stick-around-despite-unpopularity", srcName: "Bloomberg" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-07-27",
      time: "21:10 BST",
      lede: "Oil's 8.7% slide to $88.36 as the US-Iran strike pause holds cools Fed hike odds to roughly one-in-three and eases UK gilts, even as Nvidia's near-5% drop on a reported $250bn OpenAI financing-guarantee deal renews AI-capex financing worries two days before the FOMC decision.",
      bullets: [
        { html: "<strong>Oil</strong>: Brent settled down 8.7% at $88.36/bbl &mdash; its lowest close since 17 July &mdash; as the US-Iran strike pause held for a second session, even as Saudi Arabia said it intercepted Iran-linked drones targeting its oil facilities and Iran&rsquo;s foreign ministry denied any active negotiations.", src: "https://www.cnbc.com/2026/07/27/oil-price-wti-brent-slide-as-iran-reportedly-may-halt-attacks.html", srcName: "CNBC" },
        { html: "<strong>Fed</strong>: CME FedWatch-implied odds of a 29 July hike eased to roughly a one-in-three (~33%) probability Monday &mdash; down from a peak near 40% last Thursday but still well above the ~12% seen a week earlier &mdash; as the oil-driven inflation case cooled; September-meeting odds hold near ~80%.", src: "https://www.techtimes.com/articles/321675/20260727/federal-reserve-july-meeting-oil-pullback-cuts-hike-odds-one-three-september-surges.htm", srcName: "Tech Times" },
        { html: "<strong>Nvidia</strong> fell almost 5% &mdash; its worst day since February &mdash; on reports it is in talks to provide up to $250bn in financing guarantees for OpenAI&rsquo;s planned Ohio data-centre buildout, alongside a separate $500bn AI deal with SK Group, reviving scrutiny of circular AI-capex financing.", src: "https://247wallst.com/investing/2026/07/27/ai-stocks-crash-after-nvidia-plans-to-finance-250-billion-openai-buildout-are-reported/", srcName: "24/7 Wall St" },
        { html: "<strong>UK gilts</strong> eased to ~4.98&ndash;5.0% (from a multi-week high near 5.1% on 23&ndash;24 July) as Brent&rsquo;s slide reduced the near-term oil-driven case for a BoE hike, with a Reuters poll of 70 economists unanimously expecting a hold at 3.75% on 30 July.", src: "https://tradingeconomics.com/united-kingdom/government-bond-yield/news/540076", srcName: "Trading Economics" },
        { html: "<strong>Private credit</strong>: Ares Management is organising the sale of roughly &euro;3bn of bundled LP interests in its flagship Ares Capital Europe IV fund to secondaries investors &mdash; one of the largest credit-secondaries transactions on record.", src: "https://www.bloomberg.com/news/articles/2026-07-27/ares-bundles-3-billion-of-private-credit-for-secondaries-sale", srcName: "Bloomberg" },
      ],
    },
  },
};
