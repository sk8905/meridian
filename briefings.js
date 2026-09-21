// =============================================================================
// briefings.js — the AI market briefing surfaced at the head of the Home News
// wire (v2/js/home/glance.js renderHomeBriefing). Only the LATEST (freshest-
// stamped) slot is shown — there is no header button and no slot selector.
//
// GENERATION (see docs/refresh-routines.md): these are written by the 5×/day
// refresh routine, NOT at runtime. Three rolling slots are kept as the store;
// each run regenerates whichever slot the clock is in (morning < 12:00 · afternoon
// 12:00–17:00 · evening ≥ 17:00 BST) and restamps it, so the freshest slot — the
// one the reader sees — is renewed on every run (up to 5× a day).
//
// DESK FOCUS: the briefings cover the three MARKET desks — Macro, Equities and
// Fixed income — and ONLY those (no Credit or Legal; those have their own
// surfaces). Every slot touches all three, and each bullet's <strong> lead is
// tagged with its desk. The first four bullets are the ones the Home card renders
// (HB_MAX_BULLETS — one iPhone screen), so they carry the three-desk spread.
// ONE SECTION PER DESK: the card groups bullets by their desk lead, so a desk that
// carries two stories (e.g. two Macro items) shows a SINGLE "Macro" kicker with both
// items beneath it — never a repeated kicker. Author each item with its own desk
// lead and source; the render folds same-desk items into one section.
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
// bump (HOUSE_STYLE T1). The lede is a TOP-LINE SYNTHESIS of the day's arc — it must
// NOT restate the bullets: no bullet's lead sentence or specific claim is repeated
// verbatim in the lede. Keep it tight (the card shows it in full).
// =============================================================================
export const BRIEFINGS = {
  tz: "BST",
  // Ordered for the slot chips; the view picks the current slot by clock.
  order: ["morning", "afternoon", "evening"],
  slots: {
    morning: {
      label: "Morning",
      date: "2026-09-21",
      time: "05:18 BST",
      lede: "US-China talks in New York set the tone for a Trump-Xi summit week, with Wall Street parked in a cautious, range-bound holding pattern while sterling and UK equities are still nursing Friday's Hormuz-driven jolt.",
      bullets: [
        { html: "<strong>Macro &mdash; US and Chinese officials resumed trade talks in New York on Sunday</strong> ahead of Thursday's Trump-Xi summit in Washington, with AI guardrails, critical minerals and the expiring tariff truce among the open items.", src: "https://www.bloomberg.com/news/articles/2026-09-20/us-china-begin-trade-talks-in-new-york-ahead-of-trump-xi-summit", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; US stocks traded a mixed, range-bound session Monday</strong>, with the Nasdaq leading on tech strength while the Dow struggled to hold momentum, as the 10-year Treasury yield held near 5.00% and the VIX cooled.", src: "https://www.cnbc.com/2026/09/20/stock-market-today-live-updates.html", srcName: "CNBC" },
        { html: "<strong>Equities &mdash; the FTSE 100 closed 1.45% lower at 10,659.13 on Friday, its weakest session since July</strong>, after a tanker was struck by an unidentified projectile in the Strait of Hormuz, rattling energy-sensitive stocks.", src: "https://www.foreignpolicyjournal.com/2026/09/19/ftse-100-ftse-posts-worst-session-since-july-as-hormuz-attack-and-rate-fears-overwhelm-retail-strength/", srcName: "Foreign Policy Journal" },
        { html: "<strong>Fixed income &mdash; October Fed-hike odds sit near 58% on CME FedWatch</strong> after Governor Warsh rejected the 'neutral rate' framing in remarks last week, keeping traders split on how far the tightening cycle still has to run.", src: "https://www.cnbc.com/2026/09/18/three-words-from-kevin-warsh-have-wall-street-wondering-how-far-the-fed-will-go-with-rate-hikes.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; Barclays is sticking with its call for a November Bank of England hike</strong>, warning a wider Middle East conflict could spur further tightening, with sterling still on the back foot into Chancellor Healey's 28 October Budget.", src: "https://www.investing.com/news/economy-news/barclays-backs-november-boe-hike-warns-middle-east-conflict-could-spur-more-4906680", srcName: "Reuters (via Investing.com)" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-20",
      time: "12:20 BST",
      lede: "US-China talks in New York set up Thursday's Trump-Xi summit as the week's pivot, while a hawkish Fed dot plot and firmer Gulf oil flows underpin yields; Wall Street limps in from a third down week with Treasury yields near 5%.",
      bullets: [
        { html: "<strong>Macro &mdash; Treasury Secretary Bessent and China's He Lifeng opened talks on AI, trade and critical minerals in New York</strong>, at JPMorgan's Manhattan headquarters, teeing up potential agreements ahead of Thursday's Trump-Xi summit, with the expiring US-China trade truce and China's rare-earth supply among the key sticking points.", src: "https://www.cnbc.com/2026/09/20/bessent-chinas-he-to-hold-talks-on-ai-trade-minerals-reuters.html", srcName: "CNBC (Reuters)" },
        { html: "<strong>Equities &mdash; Wall Street closed a third straight losing week Friday</strong>: the S&amp;P 500 rose 0.17% to 7,650.50 and the Nasdaq gained 0.39% to 26,522.55, but the Dow slipped 0.18% to 51,682.64 in a ~$7tn triple-witching session, with the 10-year Treasury yield still near 5%.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-september-18-dow-sp-500-nasdaq-080504071.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the Fed's dot plot keeps a second 2026 hike live</strong>, with 16 of 19 FOMC participants pencilling in at least one further move after Wednesday's 25bp hike to 3.75&ndash;4.00%, Bloomberg's World Economy Latest round-up says.", src: "https://www.bloomberg.com/news/articles/2026-09-19/world-economy-latest-fed-boosts-interest-rates-signals-another-2026-hike", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Hormuz oil shipments hit a six-month high</strong>, a senior US commander said, even as the Strait's tanker traffic stays shadowed by the ongoing Iran standoff that has kept Brent elevated through September.", src: "https://www.bloomberg.com/news/articles/2026-09-19/hormuz-oil-shipments-hit-six-month-high-us-commander-says", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; Barclays now backs a November Bank of England hike</strong> and warned a wider Middle East conflict could spur further tightening, a day after the MPC's 6&ndash;3 hold at 3.75%; sterling has stayed on the back foot on rising UK fiscal worries into Chancellor Healey's 28 October Budget.", src: "https://www.investing.com/news/economy-news/barclays-backs-november-boe-hike-warns-middle-east-conflict-could-spur-more-4906680", srcName: "Reuters (via Investing.com)" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-20",
      time: "21:11 BST",
      lede: "Trade dominates the run-up to Thursday's Trump-Xi summit, with US-China officials back at the table in New York; underneath, a third straight down week for US stocks, soft consumer confidence and UK borrowing costs at multi-decade highs frame a cautious, tightening-tilted backdrop into the autumn Budget.",
      bullets: [
        { html: "<strong>Macro &mdash; US and Chinese officials resumed trade talks in New York on Sunday</strong> ahead of Thursday's Trump-Xi summit in Washington, with AI guardrails, critical minerals and the expiring tariff truce among the open items, Reuters reports.", src: "https://www.bloomberg.com/news/articles/2026-09-20/us-china-begin-trade-talks-in-new-york-ahead-of-trump-xi-summit", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; Wall Street closed a third straight losing week Friday in a ~$7tn triple-witching session</strong>: the S&amp;P 500 rose 0.17% to 7,650.50 and the Nasdaq gained 0.39% to 26,522.55, but the Dow slipped 0.18% to 51,682.64.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-september-18-dow-sp-500-nasdaq-080504071.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; Barclays is sticking with its call for a November Bank of England hike</strong>, warning a wider Middle East conflict could spur further tightening, with sterling still on the back foot into Chancellor Healey's 28 October Budget.", src: "https://www.investing.com/news/economy-news/barclays-backs-november-boe-hike-warns-middle-east-conflict-could-spur-more-4906680", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Macro &mdash; US consumer sentiment is stuck near multi-year lows despite a solid economy</strong>, with Goldman Sachs pointing to &ldquo;lower happiness&rdquo; rather than affordability as the driver of depressed confidence.", src: "https://www.cnbc.com/2026/09/19/goldman-sachs-happiness-struggling-consumer-sentiment.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; UK 30-year gilt yields near 5.89%, their highest since 1998, have roughly halved Chancellor Healey's fiscal headroom</strong> to about &pound;13.8bn from &pound;26bn, as he weighs widening the mansion-tax net ahead of his 28 October Budget.", src: "https://www.techtimes.com/articles/326996/20260908/uk-locks-priciest-30-year-gilt-yield-since-1998-tax-rises-october-budget-now-near-certain.htm", srcName: "Tech Times" },
      ],
    },
  },
};
