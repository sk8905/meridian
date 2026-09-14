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
      date: "2026-09-14",
      time: "08:22 BST",
      lede: "The Fed's call gets more one-sided two days out: Goldman Sachs flipped to expect Wednesday's hike, a view J.P. Morgan now shares, as the 10-year Treasury closes in on 5%, UK gilts sit at 19-year highs and Brent holds near $107 on the Hormuz standoff.",
      bullets: [
        { html: "<strong>Macro &mdash; Goldman Sachs flips to expect a quarter-point Fed hike at Wednesday's meeting</strong>, reversing its prior no-change call; J.P. Morgan's Michael Feroli holds the same view, adding to a market already pricing hike odds in the mid-to-high 80s two days before the decision.", src: "https://www.investing.com/news/economy-news/goldman-sachs-now-expects-fed-to-hike-rates-in-september-4898799", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Equities &mdash; Nasdaq 100 futures slid as much as 1.2% in Sunday-evening trading</strong> (S&amp;P 500 futures -0.6%, Dow futures -0.4%) after Anthropic's Dario Amodei and OpenAI's Sam Altman both published weekend calls for a slowdown in frontier AI development, an unusual industry-wide caution that hit sentiment before Asian markets even opened.", src: "https://finance.yahoo.com/markets/stocks/articles/amodeis-ai-slowdown-warning-rattles-020434313.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield held just below 5% (~4.96%) Monday</strong>, closing in on a level last touched in October 2023, with strategists saying how it gets there &mdash; growth optimism versus fiscal/inflation stress &mdash; matters more than the round number itself two days before the Fed's decision.", src: "https://www.cnbc.com/2026/09/14/10-year-us-treasury-is-closing-in-on-5percent.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; UK gilts sit at 19-year highs heading into Thursday's BoE decision</strong>, with sterling's own week-ahead outlook now framed around whether elevated yields force the MPC's hand, even as a unanimous Reuters poll of all 65 economists surveyed still expects a hold at 3.75%.", src: "https://www.currencynews.co.uk/forecast/20260914-47178_pound-to-dollar-week-ahead-forecast-19-year-high-gilt-yields-put-boe-in-focus.html", srcName: "Currency News UK" },
        { html: "<strong>Macro &mdash; Saudi Arabia's East-West pipeline shutdown keeps Brent near $107</strong> after a drone strike closed the key Hormuz-bypass route, with Oman's postponed Gulf-Iran talks and a further vessel strike near Qeshm Island leaving the oil-driven inflation channel behind the Fed's decision unresolved.", src: "https://www.cnbc.com/2026/09/14/cnbc-daily-open-peace-talks-amid-pipeline-shocks.html", srcName: "CNBC" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-13",
      time: "12:24 BST",
      lede: "Markets head into a decisive Fed week with the S&amp;P 500 having snapped a four-session losing streak on in-line inflation, Treasury yields pinned near a three-year high on ~90% odds of Wednesday's hike, and sterling firm after a surprise UK growth beat.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed-hike odds hold near a cycle-high ~90% into Wednesday's FOMC</strong>: markets enter the week bracing for a war of nerves between the Fed and the White House, with futures still pricing roughly a 90% chance of a quarter-point hike after last Friday's hotter-than-forecast core CPI.", src: "https://finance.yahoo.com/markets/article/a-highly-anticipated-fed-meeting-war-worries-and-an-unblinking-stock-market-what-to-watch-this-week-100000843.html", srcName: "Yahoo Finance" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 snapped a four-session losing streak Friday</strong>: stocks rose even as August core CPI came in hotter than forecast at 0.3% m/m, with falling oil prices offsetting the inflation surprise and Fed-hike odds for this week's FOMC holding near 90%.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-september-11-dow-sp-500-nasdaq-cpi-inflation-082201751.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; Treasuries sit near a three-year high as traders price two hikes by year-end</strong>: the 10-year yield is holding near its highest level since 2007 after Friday's CPI surprise, with bond traders moving to price a second quarter-point Fed move on top of Wednesday's expected hike.", src: "https://www.bloomberg.com/news/articles/2026-09-11/treasuries-fall-as-higher-than-expected-cpi-boosts-fed-hike-odds", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; sterling holds its gains after a surprise UK growth beat</strong>: the pound stayed firm following July GDP data showing 0.4% month-on-month growth, putting Britain on track for its fastest H1 2026 expansion in the G7 even as gilt yields sit near 19-year highs into the 17 September BoE decision.", src: "https://www.bloomberg.com/news/articles/2026-09-11/dollar-wavers-as-inflation-aids-fed-hike-bets-while-oil-falls", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; a unanimous Reuters poll expects the BoE to hold Bank Rate at 3.75%</strong>: all 65 economists surveyed see no change on 17 September even as the 2-year gilt yield sits at its highest since November 2023 and the 10-year holds near a 19-year high, a starker consensus than the market curve, which still prices hikes from November.", src: "https://www.investing.com/news/economy-news/bank-of-england-to-hold-rates-show-patience-with-wardriven-inflation-reuters-poll-4891672", srcName: "Reuters (via Investing.com)" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-13",
      time: "21:25 BST",
      lede: "The Fed entered its blackout period with hike odds still near a cycle-high ~90% after Oman postponed Monday's Iran-Gulf Hormuz talks and a fresh vessel strike near Qeshm Island, while a weak Asian session (Nikkei -1.93%) and Treasury yields near a three-year high set the tone for the most consequential central-bank week of the year.",
      bullets: [
        { html: "<strong>Macro &mdash; Oman postpones Monday's Iran-Gulf talks on the Strait of Hormuz</strong>: the delay, plus a further vessel struck near Qeshm Island overnight and a first-since-the-war Pezeshkian&ndash;UAE meeting at the BRICS summit, leaves the oil-driven inflation channel behind the Fed's decision unresolved as the FOMC enters its blackout period.", src: "https://www.bloomberg.com/news/articles/2026-09-13/hormuz-meeting-with-iran-and-gulf-nations-postponed-oman-says", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; the Nikkei slumped 1.93% to 64,011.34 Friday</strong>, its worst session in weeks, as renewed Fed-hike bets and oil above $108/bbl hit AI and chip names hardest even as traders braced for a possible Bank of Japan hike of its own next week.", src: "https://www.brecorder.com/news/40439037/japans-nikkei-slumps-as-fed-hike-bets-soaring-oil-weigh", srcName: "Business Recorder" },
        { html: "<strong>Fixed income &mdash; Treasuries sit near a three-year high as traders price two hikes by year-end</strong>: the 10-year yield held close to 4.97% into the weekend, with bond traders positioning for a second quarter-point Fed move on top of Wednesday's expected hike.", src: "https://www.bloomberg.com/news/articles/2026-09-11/treasuries-fall-as-higher-than-expected-cpi-boosts-fed-hike-odds", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; a rare G7 'rate-hike fever' week looms</strong>: the Fed, Bank of England and Bank of Japan all decide on three successive days, with Bloomberg Economics saying Chair Warsh looks set to raise rates 'probably in defiance of President Trump's wishes'.", src: "https://www.bloomberg.com/news/articles/2026-09-12/all-eyes-on-warsh-as-rate-hike-fever-spreads-across-g7-central-banks", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; UK gilts stay pinned near 19-year highs into the Budget arithmetic</strong>: with a unanimous Reuters poll still expecting Thursday's MPC meeting to hold at 3.75%, analysts say higher yields and softer growth assumptions keep narrowing Chancellor Healey's fiscal headroom ahead of the 28 October Budget.", src: "https://www.investing.com/news/economy-news/how-much-has-uk-fiscal-headroom-narrowed-ahead-of-autumn-budget-4897694", srcName: "Investing.com" },
      ],
    },
  },
};
