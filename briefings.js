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
      date: "2026-09-13",
      time: "08:19 BST",
      lede: "Markets head into a decisive central-bank week &mdash; the Fed on Wednesday, the BoE on Thursday &mdash; with Wall Street having clawed back most of last week's losses on in-line August CPI, Treasury yields pinned near a three-year high on ~90% odds of a Fed hike, and Gulf states reportedly weighing talks with Iran next week over the future of the Strait of Hormuz.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed-hike odds hold near a cycle-high ~90% into Wednesday's FOMC</strong>: interest-rate futures imply roughly a 90% probability of a quarter-point hike at the 16 September meeting after last Friday's hotter-than-forecast core CPI, which would be the Fed's first hike since 2023 under Chair Kevin Warsh.", src: "https://www.cnbc.com/2026/09/11/stock-market-next-week-outlook-for-sept-14-18-2026.html", srcName: "CNBC" },
        { html: "<strong>Equities &mdash; Wall Street heads into the week having snapped a four-session losing streak</strong>: stocks rallied Friday as August's headline CPI landed close to forecasts even with a hot core print, with the coming week's FOMC decision and August retail-sales data now the focus.", src: "https://www.washingtontimes.com/news/2026/sep/12/wall-street-federal-reserve-decision-interest-rates-retail-sales/", srcName: "Associated Press (via Washington Times)" },
        { html: "<strong>Fixed income &mdash; Treasuries sit near a three-year high as traders price two hikes by year-end</strong>: the 10-year yield held close to 4.97% &mdash; its highest since 2023 &mdash; after Friday's CPI surprise, with bond traders moving to price a second quarter-point Fed move on top of Wednesday's expected hike.", src: "https://www.bloomberg.com/news/articles/2026-09-11/treasuries-fall-as-higher-than-expected-cpi-boosts-fed-hike-odds", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Gulf states weigh talks with Iran next week over the future of Hormuz</strong>: Gulf Arab states are reported to be considering a meeting with Iran as soon as next week to discuss the status of the Strait of Hormuz, a fresh diplomatic angle on the oil-shipping chokepoint that has kept crude prices elevated.", src: "https://www.bloomberg.com/news/articles/2026-09-11/gulf-states-may-meet-iran-next-week-to-discuss-future-of-hormuz", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; UK gilts still pinned near 19-year highs into the Budget arithmetic</strong>: the 10-year gilt yield remains close to its recent peak after striking the highest level since 2007 last week, keeping pressure on Chancellor Healey's shrinking fiscal headroom ahead of the 28 October Budget.", src: "https://www.globalbankingandfinance.com/uk-10-year-gilt-yield-hits-new-19-year-high/", srcName: "Reuters (via Global Banking & Finance)" },
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
      date: "2026-09-12",
      time: "21:21 BST",
      lede: "Wall Street closed out a bruising week on a high note as an in-line headline August CPI print eased fears of a hotter surprise, even as the stickier-than-forecast 0.3% core reading pushed Fed-hike odds for Wednesday's FOMC to a cycle-high ~90% and left Treasury and gilt yields pinned near multi-decade highs.",
      bullets: [
        { html: "<strong>Equities &mdash; Wall Street snaps a four-session losing streak</strong>: the Dow rose 509.19 points (0.98%) to 52,573.29, the S&amp;P 500 gained 0.86% to 7,656.98 and the Nasdaq added 0.96% to 26,333.04 Friday, clawing back most of the week's losses as oil eased and August CPI landed close to forecasts.", src: "https://abcnews.com/Business/wireStory/major-us-stock-indexes-fared-friday-9112026-136375931", srcName: "Associated Press (via ABC News)" },
        { html: "<strong>Macro &mdash; hot core CPI keeps Fed-hike odds at a cycle-high ~90% into Wednesday's FOMC</strong>: headline CPI rose 0.4% m/m as expected while core CPI's 0.3% gain topped the 0.2% consensus, reinforcing the case for the Fed's first hike since 2023 at next week's meeting.", src: "https://www.cbsnews.com/news/august-cpi-report-inflation-fed-rates/", srcName: "CBS News" },
        { html: "<strong>Fixed income &mdash; Treasuries hold near cycle highs as traders price two hikes by year-end</strong>: the 10-year yield sat close to its highest level since 2007 after Friday's CPI surprise, with bond traders moving to price a second quarter-point Fed move on top of Wednesday's expected hike.", src: "https://www.bloomberg.com/news/articles/2026-09-11/treasuries-fall-as-higher-than-expected-cpi-boosts-fed-hike-odds", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; US consumer sentiment slides on record gas prices, trade tensions</strong>: the University of Michigan's preliminary September index fell to 47.8 from 51.7 &mdash; below every estimate in a Bloomberg survey &mdash; as record September pump prices and renewed trade friction weighed, with year-ahead inflation expectations rising to 4.6%.", src: "https://finance.yahoo.com/economy/articles/us-consumer-sentiment-slides-higher-140000478.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; UK gilt yields ease slightly but stay near 19-year highs</strong>: the 10-year gilt yield edged down toward 5.35% as the energy-price rally paused ahead of the CPI release, with the 30-year still hovering near 6% &mdash; a level last seen in 1998 &mdash; even after Friday's stronger-than-expected 0.4% UK July GDP print.", src: "https://www.fx.co/en/forex-news/3158765", srcName: "FX.co (via InstaForex)" },
      ],
    },
  },
};
