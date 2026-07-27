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
      date: "2026-07-27",
      time: "09:14 BST",
      lede: "Oil gaps lower as the US and Iran pause strikes into the weekend; a heavy FOMC week opens with a hold the base case but hike odds still elevated.",
      bullets: [
        { html: "<strong>Oil</strong> tumbled after US Central Command made no new strike announcement for the first time in nearly two weeks and Trump said Tehran is getting &lsquo;more serious&rsquo; in talks — Brent had settled 23 Jul up 7% at ~$100.70/bbl before easing back toward ~$97.", src: "https://www.bloomberg.com/news/articles/2026-07-26/oil-tumbles-as-us-and-iran-pause-military-strikes-markets-wrap", srcName: "Bloomberg" },
        { html: "<strong>FOMC week</strong>: the 28&ndash;29 Jul decision is the centrepiece of what Fed Chair Kevin Warsh has framed as a &lsquo;family feud&rsquo; meeting — a hold at 3.50&ndash;3.75% is the base case, but CME FedWatch hike odds sat near 37&ndash;38% after the oil shock.", src: "https://fortune.com/2026/07/25/fed-meeting-family-feud-rate-hike-inflation-kevin-warsh-hawks/", srcName: "Fortune" },
        { html: "<strong>Week ahead</strong> also brings the BoE (30 Jul), BoJ, US PCE and GDP and euro-area CPI — a dense macro slate alongside Big Tech earnings.", src: "https://www.newsquawk.com/daily/5685-week-in-focus-27-31st-july-2026-highlights-include-fomc-boe-boj-us-pce-us-gdp-and-ez-cpi", srcName: "Newsquawk" },
        { html: "<strong>UK</strong>: gilt yields hold near multi-week highs (10-year ~5.05&ndash;5.1%) into the 30 Jul MPC decision, the oil shock outweighing June&rsquo;s softer core CPI print.", src: "https://www.fxstreet.com/news/forecasting-the-upcoming-week-fed-boe-and-boj-decisions-take-center-stage-202607241928", srcName: "FXStreet" },
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
