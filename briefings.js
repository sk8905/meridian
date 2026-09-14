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
      time: "17:15 BST",
      lede: "Monday set the final table before Wednesday's Fed decision: the 10-year Treasury crossed 5% for the first time since 2023 as Brent topped $109 on Saudi Arabia's pipeline shutdown, chip stocks slid on a weekend AI-slowdown warning from Amodei and Altman, and UK gilts held near 19-year highs into Thursday's BoE meeting.",
      bullets: [
        { html: "<strong>Equities &mdash; chip stocks slide after Amodei, Altman and Musk call for an AI slowdown</strong>: Micron fell around 7%, Intel 6% and Nvidia over 3% following Anthropic CEO Dario Amodei's essay urging the industry to 'pace the frontier', with OpenAI's Sam Altman and SpaceX's Musk both publicly agreeing.", src: "https://www.cnbc.com/2026/09/14/ai-stocks-slowdown-amodei-altman.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield crossed 5% intraday</strong>, its first move above that level since October 2023, as Brent's advance past $109/bbl and CME FedWatch-implied hike odds in the mid-to-high 80s kept inflation-risk pricing elevated two days before the FOMC.", src: "https://www.cnbc.com/2026/09/14/10-year-us-treasury-is-closing-in-on-5percent.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Brent tops $109 as Saudi Arabia's pipeline shutdown deepens the supply shock</strong>: Yanbu's Red Sea export hub reportedly has just five to seven days of stockpiled oil left after the East-West pipeline closure compounded the existing Strait of Hormuz disruptions.", src: "https://finance.yahoo.com/energy/articles/brent-hits-108-saudi-pipeline-053704663.html", srcName: "Yahoo Finance / Bloomberg" },
        { html: "<strong>Fixed income &mdash; UK gilts hold near 19-year highs</strong> (10-year ~5.3&ndash;5.4%, 30-year near 6%, last seen in 1998) as the fresh oil shock reinforces BoE-hike bets, even as the FTSE 100 bucked the wider selloff (+~0.5%) on its energy-heavy, low-tech composition ahead of Thursday's MPC decision.", src: "https://tradingeconomics.com/united-kingdom/government-bond-yield/news/540938", srcName: "TradingEconomics" },
        { html: "<strong>Macro &mdash; Wall Street strategists say the rally survives a Fed hike</strong>: Morgan Stanley, JPMorgan and Goldman Sachs argue any hike-driven pullback should be short-lived given still-healthy corporate profits, even with the AI-slowdown warnings and oil-driven bond selloff testing the market's narrow leadership.", src: "https://www.bloomberg.com/news/articles/2026-09-14/wall-street-strategists-see-stock-rally-surviving-fed-rate-hike", srcName: "Bloomberg" },
      ],
    },
  },
};
