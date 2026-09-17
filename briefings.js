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
      date: "2026-09-17",
      time: "08:19 BST",
      lede: "The Fed hiked 25bp to 3.75&ndash;4.00% Wednesday and Goldman Sachs now sees a second hike in October, Asian markets steadied overnight as oil eased toward $102/bbl, and sterling sank below $1.3400 ahead of the Bank of England's own decision at noon.",
      bullets: [
        { html: "<strong>Macro &mdash; Goldman Sachs abandoned its 'one-and-done' call overnight</strong>, now expecting a second 25bp Fed hike in October after Wednesday's dot plot showed a 16-to-2 majority for at least one more 2026 move.", src: "https://www.brecorder.com/news/40439917/goldman-sachs-now-sees-fed-hiking-again-in-october", srcName: "Business Recorder (Reuters)" },
        { html: "<strong>Equities &mdash; Asian markets rose Thursday</strong> (Nikkei, Topix, Kospi and Kosdaq all gained) as the widely-expected Fed hike removed uncertainty, though Tokyo tech lagged ahead of Friday's own BoJ decision.", src: "https://investinglive.com/news/investinglive-asia-pacific-market-news-fed-hike-fallout-dominates/", srcName: "investingLive" },
        { html: "<strong>Fixed income &mdash; sterling sank to just under $1.3400 overnight</strong>, as the Fed's hike lifted the midpoint of the US policy rate above the Bank of England's 3.75% for the first time this year, ahead of the BoE's own decision at 11:00 GMT today.", src: "https://www.fxstreet.com/news/pound-sterling-price-news-and-forecast-gbp-usd-sinks-as-the-fed-overtakes-the-boe-202609161939", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; the Bank of England is widely expected to hold Bank Rate at 3.75% at today's decision</strong>, a day after the Fed's own hike, though markets still price roughly an 80% chance of a follow-up BoE hike in November given the Iran-war energy shock.", src: "https://www.investing.com/news/economy-news/bank-of-england-to-hold-rates-but-energy-shock-stirs-talk-of-a-hike-4904677", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Fixed income &mdash; Brent crude eased toward $102/bbl overnight</strong>, pulling back further from Tuesday's $109 peak, on signs Saudi Arabia's damaged East-West pipeline will restart operations within days.", src: "https://www.cnbc.com/2026/09/16/oil-prices-today-brent-wti-hormuz-iran-war.html", srcName: "CNBC" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-16",
      time: "12:13 BST",
      lede: "Decision day has arrived: the 10-year Treasury yield still hovers above 5% (its highest since 2007) as traders await the Fed's 2pm ET call, UK CPI jumped to 3.1% in August &mdash; its first reading above 3% since March &mdash; a day ahead of Thursday's BoE meeting, and sterling stays pinned near two-month lows.",
      bullets: [
        { html: "<strong>Macro &mdash; the Fed's rate call lands at 2pm ET (7pm BST) today</strong>, with CME FedWatch pricing a quarter-point hike to 3.75-4.00% as the overwhelming favourite &mdash; the first increase since July 2023 &mdash; after a summer of oil-driven inflation surprises.", src: "https://www.cnbc.com/2026/09/16/treasury-yield-bond-market-fed-decision.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield still holds above the 5% threshold</strong> it crossed for the first time since 2007, with money markets treating today's hike as an almost certain move into this afternoon's decision.", src: "https://www.cnbc.com/2026/09/16/treasury-yield-bond-market-fed-decision.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK CPI jumped to 3.1% y/y in August</strong> &mdash; its first reading above 3% since March &mdash; as motor-fuel costs surged 23% y/y and household energy bills rose 6%, landing the morning before Thursday's Bank of England decision.", src: "https://www.cnbc.com/2026/09/16/uk-august-inflation-energy-gasoline.html", srcName: "CNBC" },
        { html: "<strong>Equities &mdash; Wall Street fell for a second straight session Tuesday</strong>, with the Dow off 0.63% to 52,093.11, the S&amp;P 500 down 0.45% to 7,585.73 and the Nasdaq down 0.78% to 25,981.57, as traders braced for today's Fed decision.", src: "https://finance.yahoo.com/markets/stocks/articles/stock-market-today-sept-15-133221036.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; sterling stayed pinned near two-month lows around $1.3465-1.3492</strong>, with the hot UK CPI print failing to lift the pound as elevated gilt yields continue to be read as a fiscal-stress signal rather than a hawkish-tightening one.", src: "https://www.fxstreet.com/news/british-pound-buckles-as-the-us-yields-rise-puts-fed-in-command-202609141655", srcName: "FXStreet" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-16",
      time: "21:22 BST",
      lede: "Decision day resolved: the Fed raised its target range 25bp to 3.75&ndash;4.00%, its first hike since 2023, as equities gave back an early rally, the 10-year Treasury yield held near 5% and sterling stayed pinned near two-month lows a day before the BoE's own decision.",
      bullets: [
        { html: "<strong>Macro &mdash; the FOMC hiked 25bp to 3.75&ndash;4.00%</strong>, its first increase since 2023, with the updated dot plot showing 16 of 19 participants pencilling in at least one more hike this year as Chair Warsh's committee cited the Iran-war energy shock and above-target inflation.", src: "https://www.bloomberg.com/news/articles/2026-09-16/fed-raises-rates-as-warsh-bucks-trump-to-contain-inflation", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; US stocks fell after the decision</strong>, giving back the morning's relief rally as Warsh's press conference struck a hawkish tone on the path ahead and traders priced in the risk of a further move this year.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-16-2026", srcName: "TheStreet" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield held near the 5% level</strong> it crossed for the first time since 2007, with oil near $109/barrel and higher rates together estimated to cost US households about $1,700 a year.", src: "https://www.cnbc.com/2026/09/16/oil-prices-treasury-yields-consumers-iran.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK CPI rose to 3.1% y/y in August</strong> (from 2.9% in July), its first reading above 3% since March, a day before Thursday's Bank of England decision where a hold at 3.75% remains the consensus even as hike odds have firmed.", src: "https://www.bloomberg.com/news/articles/2026-09-16/uk-inflation-rises-to-five-month-high-ahead-of-boe-rate-decision", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; sterling stayed pinned near two-month lows around $1.3465-1.3492</strong> after the Fed's hike widened the policy-rate gap with the BoE, with elevated gilt yields still read by traders as a fiscal-stress signal rather than a hawkish-tightening one.", src: "https://www.cnbc.com/2026/09/16/uk-august-inflation-energy-gasoline.html", srcName: "CNBC" },
      ],
    },
  },
};
