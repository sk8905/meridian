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
      date: "2026-07-29",
      time: "05:21 BST",
      lede: "Iran fired ballistic missiles at US forces in the Middle East overnight before US and Saudi forces struck back at Iranian proxies in Iraq, sending oil higher just hours before today's FOMC decision, where a hold is still the consensus call.",
      bullets: [
        { html: "<strong>Iran</strong> launched a surprise ballistic-missile attack on US forces in the Middle East overnight, intercepted by CENTCOM; US and Saudi forces conducted retaliatory strikes on Iranian proxies in Iraq.", src: "https://www.cnbc.com/2026/07/29/us-iran-war-hormuz-centcom.html", srcName: "CNBC" },
        { html: "<strong>Oil</strong> jumped as US-Iran strikes resumed after a brief pause, with WTI and Brent both bid on the escalation risk just as this week's Fed decision approaches.", src: "https://www.cnbc.com/2026/07/29/oil-prices-today-brent-wti-iran-us-hormuz.html", srcName: "CNBC" },
        { html: "<strong>FOMC</strong>: the Fed holds its rate decision today (29 Jul) with the target range at 3.50&ndash;3.75%; a Reuters poll of economists and futures markets overwhelmingly expect a hold despite the overnight Iran escalation.", src: "https://www.cnbc.com/2026/07/27/fed-interest-rates-july.html", srcName: "CNBC" },
        { html: "<strong>UK</strong>: the BoE's own rate decision looms Thursday (30 Jul), widely expected to be a hold, after Barclays' H1 results showed RoTE hitting 16.1% on raised income guidance.", src: "https://www.investing.com/news/company-news/barclays-h1-2026-slides-rote-hits-161-as-income-guidance-rises-93CH-4817338", srcName: "Investing.com" },
        { html: "<strong>Private credit</strong>: Barings and the North Carolina Investment Authority expanded their partnership with a fresh $2.1bn mandate spanning real-estate debt, CMBS and capital-solutions strategies.", src: "https://www.businesswire.com/news/home/20260724889653/en/Barings-and-North-Carolina-Investment-Authority-Expand-Partnership-with-$2.1-Billion-Mandate", srcName: "Businesswire" },
        { html: "<strong>Legal</strong>: Slaughter and May advised Serica Energy on its recommended &pound;145.7m takeover of Pharos Energy, while White &amp; Case advised Citibank and Nedbank on a $1.28bn financing for Harmony Gold.", src: "https://www.slaughterandmay.com/recent-work/serica-energy-plc-on-the-recommended-takeover-of-pharos-energy-plc/", srcName: "Slaughter and May" },
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
