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
      date: "2026-09-15",
      time: "05:26 BST",
      lede: "Two days from the Fed's decision, Asian shares slipped and the 10-year Treasury touched 5% as oil and yields climbed together, while sterling drifted below $1.35 ahead of Wednesday's UK jobs data and Thursday's BoE decision.",
      bullets: [
        { html: "<strong>Macro &mdash; Asian shares slipped as oil and yields rose ahead of this week's Fed and BOJ meetings</strong>, with investors bracing for a Wednesday Fed decision now widely expected to bring a rate hike and a Bank of Japan meeting on its heels.", src: "https://www.business-standard.com/markets/news/asian-shares-slip-as-oil-and-yields-rise-ahead-of-fed-boj-meetings-126091500073_1.html", srcName: "Reuters (via Business Standard)" },
        { html: "<strong>Equities &mdash; Wall Street closed lower Monday</strong>: the S&amp;P 500 fell 0.48% to 7,619.98 and the Nasdaq Composite dropped 0.56% to 26,186.41 as chip and AI-linked names sold off following Anthropic's Dario Amodei's and OpenAI's Sam Altman's weekend calls for a slowdown in frontier AI development.", src: "https://finance.yahoo.com/markets/stocks/articles/stock-market-today-sept-14-133832281.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield reached 5% overnight</strong>, a level last touched in October 2023, with all eyes on Wednesday's Fed decision as the move tightens financial conditions just ahead of the meeting.", src: "https://asia.nikkei.com/business/markets/10-year-treasury-yield-reaches-5-as-all-eyes-on-fed", srcName: "Nikkei Asia" },
        { html: "<strong>Fixed income &mdash; sterling drifted below $1.3500 as Fed-hike bets firmed</strong>, with traders now looking to Wednesday's UK employment report and Thursday's Bank of England decision for the next catalyst.", src: "https://www.fxstreet.com/news/british-pound-drifts-lower-below-13500-as-fed-hike-bets-rise-uk-jobs-data-loom-202609150156", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; Goldman Sachs previews Thursday's BoE decision expecting a hold</strong>, while flagging hawkish risks worth watching in the accompanying minutes and vote split given the elevated-gilt-yield backdrop.", src: "https://investinglive.com/central-banks/boe-decision-preview-goldman-sees-hold-but-watches-for-hawkish-hints/", srcName: "investingLive" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-14",
      time: "12:25 BST",
      lede: "Markets push deeper into decisive Fed week: hike odds hold near 87% two days out as Brent tops $107 on Saudi Arabia's pipeline shutdown, the 10-year Treasury closes in on 5% and UK gilts sit near 19-year highs ahead of Thursday's BoE decision.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed-hike odds hold near 87% two days out</strong>: Goldman's David Mericle argues a surprise pause could shock markets more than a hike, since policymakers would worry about the reaction to not delivering the move recent Fed communication has guided the market to price.", src: "https://invezz.com/news/2026/09/14/fed-rate-decision-this-week-why-a-pause-could-shock-markets-more-than-a-hike/", srcName: "Invezz" },
        { html: "<strong>Equities &mdash; Asia-Pacific markets slid Monday</strong>: Japan's Nikkei fell 1.06% to 63,330.91 and South Korea's Kospi slumped 2.57% to 6,732.00 as chip and AI-linked names sold off on the weekend AI-slowdown warnings from Anthropic's Amodei and OpenAI's Altman, even as Brent jumped 2.3% to $107.04/bbl.", src: "https://www.kaohooninternational.com/markets/590596", srcName: "Kaohoon International" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield held just below 5% (~4.96%)</strong>, closing in on a level last touched in October 2023, with strategists saying how it gets there &mdash; growth optimism versus fiscal/inflation stress &mdash; matters more than the round number itself two days before the Fed's decision.", src: "https://www.cnbc.com/2026/09/14/10-year-us-treasury-is-closing-in-on-5percent.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Brent rose toward $108 and WTI neared $103</strong> after Saudi Arabia shut its East-West pipeline &mdash; a route used to bypass the Strait of Hormuz &mdash; following attacks, while European natural gas jumped as much as 3.8% on the deepening energy crunch two days before the FOMC decision.", src: "https://www.bloomberg.com/news/articles/2026-09-13/latest-oil-market-news-and-analysis-for-sept-14", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; UK gilts advanced toward a fresh 19-year high</strong>: the 10-year yield pushed toward 5.4% and the 30-year hovered near 6% as surging oil prices and the UK's exposure to energy shocks led investors to raise bets on further BoE hikes ahead of Thursday's meeting, even as Governor Bailey pushed back against an imminent move.", src: "https://www.fx.co/en/forex-news/3162023", srcName: "FX.co" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-14",
      time: "21:21 BST",
      lede: "Monday closed with the S&amp;P 500 down 0.48% and the Nasdaq off 0.56% as Amodei's and Altman's AI-slowdown warnings hit chip stocks and Saudi Arabia's pipeline shutdown pushed Brent past $107, while the 10-year Treasury's brush with 5% left Fed-hike odds at a fresh cycle-high ~90.7% two days before Wednesday's decision.",
      bullets: [
        { html: "<strong>Equities &mdash; Wall Street closed lower Monday</strong>: the S&amp;P 500 fell 0.48% to 7,619.98, the Nasdaq Composite dropped 0.56% to 26,186.41 and the Dow lost 0.29% to 52,421.20, as Anthropic's Dario Amodei and OpenAI's Sam Altman's weekend AI-slowdown warnings hit chip stocks alongside a fresh oil-driven inflation scare.", src: "https://finance.yahoo.com/markets/stocks/articles/stock-market-today-sept-14-133832281.html", srcName: "Yahoo Finance" },
        { html: "<strong>Macro &mdash; Saudi Arabia's East-West pipeline shutdown pushed Brent up 2.32% to $107.04/bbl</strong> after a drone strike launched from Iraq closed the key Hormuz-bypass route, keeping the oil-driven inflation channel live two days before the Fed's decision.", src: "https://www.clickondetroit.com/business/2026/09/14/us-futures-slide-on-ai-blowback-oil-and-gas-jump-after-houthis-intensify-campaign/", srcName: "Associated Press (via ClickOnDetroit)" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield crossed 5% intraday</strong>, its first move above that level since October 2023, as CME FedWatch-implied odds of a 16 September Fed hike firmed to a fresh cycle-high ~90.7% by Monday's close.", src: "https://247wallst.com/investing/2026/09/14/chances-of-first-fed-rate-hike-since-2023-now-over-90-markets-brace-for-the-warsh-era-shock/", srcName: "24/7 Wall St." },
        { html: "<strong>Fixed income &mdash; UK gilts held near 19-year highs</strong> (10-year ~5.3&ndash;5.4%) as sterling tested a five-week low of $1.3464 against a Fed-hike-firming dollar, even as the FTSE 100 bucked the wider selloff to close up around 0.4% on energy-stock strength ahead of Thursday's BoE decision.", src: "https://www.fxstreet.com/news/pound-sterling-price-news-forecast-gbp-usd-tests-five-week-lows-as-us-treasury-yields-surge-202609141818", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; Wall Street strategists say the rally survives a Fed hike</strong>: Morgan Stanley, JPMorgan and Goldman Sachs argue any hike-driven pullback should be short-lived given still-healthy corporate profits, even with the AI-slowdown warnings and oil-driven bond selloff testing the market's narrow leadership.", src: "https://www.bloomberg.com/news/articles/2026-09-14/wall-street-strategists-see-stock-rally-surviving-fed-rate-hike", srcName: "Bloomberg" },
      ],
    },
  },
};
