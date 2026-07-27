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
      date: "2026-07-26",
      time: "21:06 BST",
      lede: "Markets close the week with a fragile stabilisation: the Alphabet/Tesla earnings drag and the Red Sea oil shock ease, but the FOMC and Big Tech reports loom.",
      bullets: [
        { html: "<strong>Equities</strong>: the week&rsquo;s narrow-leadership wobble centred on Alphabet (-6%) and Tesla (-12%) after Wednesday&rsquo;s close — Alphabet on a higher AI-capex guide, Tesla on an EPS miss — dragging the Nasdaq to a 2.15% loss on 23 Jul before a partial Friday recovery.", src: "https://www.cnbc.com/2026/07/22/google-earnings-q2-goog-live-updates.html", srcName: "CNBC" },
        { html: "<strong>Geopolitics</strong>: the first CENTCOM strike gap in nearly two weeks over the weekend is a tentative de-escalation signal — still untested by price action with US and UK markets shut until Monday.", src: "https://www.cnn.com/2026/07/25/world/live-news/iran-war-trump", srcName: "CNN" },
        { html: "<strong>Next</strong>: the 28&ndash;29 Jul FOMC, the 30 Jul BoE, and the MSFT/META/AAPL/AMZN reports are the week&rsquo;s live catalysts.", src: "https://www.newsquawk.com/daily/5685-week-in-focus-27-31st-july-2026-highlights-include-fomc-boe-boj-us-pce-us-gdp-and-ez-cpi", srcName: "Newsquawk" },
      ],
    },
  },
};
