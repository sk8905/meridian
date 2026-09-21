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
      time: "08:22 BST",
      lede: "A Houthi strike near Riyadh has put a fresh geopolitical premium under oil just as this week's Trump-Xi summit and the Fed's sticky-inflation framing keep both sides of the Atlantic braced for more tightening.",
      bullets: [
        { html: "<strong>Macro &mdash; US and Chinese officials resumed trade talks in New York on Sunday</strong> ahead of Thursday's Trump-Xi summit in Washington, with AI guardrails, critical minerals and the expiring tariff truce among the open items.", src: "https://www.bloomberg.com/news/articles/2026-09-20/us-china-begin-trade-talks-in-new-york-ahead-of-trump-xi-summit", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; oil rose after a Houthi strike hit near the Saudi capital Riyadh</strong>, reviving the geopolitical risk premium in crude just as the Fed's own hike gets framed as a response to sticky inflation and faster growth.", src: "https://www.investing.com/news/commodities-news/oil-rises-after-houthi-attack-on-saudi-capital-4908199", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Fixed income &mdash; Barclays is sticking with its call for a November Bank of England hike</strong>, warning a wider Middle East conflict could spur further tightening, as sterling stays on the back foot into Chancellor Healey's 28 October Budget.", src: "https://www.investing.com/news/economy-news/barclays-backs-november-boe-hike-warns-middle-east-conflict-could-spur-more-4906680", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Equities &mdash; US stock futures edged higher Monday</strong> as Wall Street looked to steady itself after the Dow's third straight losing week, with the S&amp;P 500 and Nasdaq both pointing to modest early gains.", src: "https://www.cnbc.com/2026/09/20/stock-market-today-live-updates.html", srcName: "CNBC" },
        { html: "<strong>Equities &mdash; the FTSE 100 slid Friday as UK bond yields resumed their climb</strong>, with rate-sensitive stocks under pressure into a week thin on fresh UK data.", src: "https://uk.finance.yahoo.com/news/ftse-100-slides-bond-yields-162410268.html", srcName: "Yahoo Finance UK" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-21",
      time: "12:25 BST",
      lede: "Markets turn cautiously risk-on into the countdown to Thursday's Trump-Xi summit, with retreating oil and a steadier rates backdrop offsetting the hangover from last week's hawkish Fed hike and a still-pressured pound.",
      bullets: [
        { html: "<strong>Macro &mdash; Treasury Secretary Bessent hailed Sunday's New York talks with Vice Premier He Lifeng as &ldquo;very successful&rdquo;</strong>, with both sides giving upbeat readouts on trade, AI guardrails and critical minerals ahead of Thursday's Trump-Xi summit in Washington.", src: "https://www.bloomberg.com/news/articles/2026-09-21/bessent-hails-very-successful-china-talks-on-ai-threats-trade", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Brent slid roughly 1.7% toward $102/bbl and WTI fell almost 2%</strong> as traders watched for a recovery in Saudi shipments after the weekend's Houthi strikes, with JPMorgan noting Middle East oil flows have stayed &ldquo;surprisingly strong&rdquo; despite the disruption.", src: "https://www.cnbc.com/2026/09/21/iran-us-oil-prices-crude-saudi-arabia-.html", srcName: "CNBC" },
        { html: "<strong>Equities &mdash; US stock futures jumped Monday</strong>, with Dow futures up more than 400 points and S&amp;P 500/Nasdaq-100 futures rising 0.7%/1.1%, as retreating oil prices and Trump-Xi summit optimism lifted risk appetite after Wall Street's worst week since March.", src: "https://finance.yahoo.com/markets/live/stock-market-today-monday-september-21-dow-sp-500-nasdaq-080214605.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; UK 10-year gilt yields eased to around 5.24% Monday</strong> as markets steadied, even as sterling held below $1.34 &mdash; near six-week lows &mdash; with the dollar's advance since last week's hawkish Fed hike still weighing on the pound.", src: "https://www.bloomberg.com/news/live-blog/2026-09-21/ftse-100-stocks-gilts-pound-brent-latest-what-s-moving-uk-markets-right-now-markets-today", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; a Bloomberg markets column argues investors have digested last week's Fed hike to 3.75&ndash;4.00% well enough</strong>, with the real risk to the rally not a known, priced rate destination but genuine uncertainty over how much further the tightening cycle still has to run.", src: "https://www.bloomberg.com/news/articles/2026-09-21/markets-can-handle-a-hawkish-fed-not-uncertainty-taking-stock", srcName: "Bloomberg" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-21",
      time: "17:22 BST",
      lede: "Risk appetite firmed into the evening as a fourth straight day of retreating oil and upbeat noises from this week's US-China trade talks offset the hangover from last week's hawkish Fed hike, even as sterling stayed pinned near six-week lows ahead of Thursday's Trump-Xi summit.",
      bullets: [
        { html: "<strong>Macro &mdash; oil extended its retreat to a fourth straight session</strong>, with Brent back near $102/bbl as Saudi Arabia moves to restore roughly half its damaged East-West pipeline's capacity and hopes build for renewed US-Iran diplomacy.", src: "https://www.cnbc.com/2026/09/21/iran-us-oil-prices-crude-saudi-arabia-.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; MSCI's emerging-market stock gauge rose 1.1%</strong> after Treasury Secretary Bessent and China's Vice Premier He Lifeng described this week's New York trade talks as &ldquo;very successful&rdquo;, lifting risk appetite ahead of Thursday's Trump-Xi summit in Washington.", src: "https://www.bloomberg.com/news/articles/2026-09-21/emerging-market-stocks-currencies-gain-after-us-china-talks", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; the Nasdaq led Wall Street higher</strong> as chip stocks rallied (Intel +9.7% on a Micro LED packaging tie-up with AUO Optronics, AMD +9.2% on reported AI-accelerator price hikes) and bitcoin pushed past $85,000.", src: "https://finance.yahoo.com/markets/live/stock-market-today-monday-september-21-dow-sp-500-nasdaq-080214605.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield eased back toward 4.97%</strong>, down from Friday's near-5% high, as retreating oil and trade-talk optimism took some of the edge off last week's hawkish Fed hike.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-21-2026", srcName: "TheStreet" },
        { html: "<strong>Fixed income &mdash; UK 10-year gilt yields held near 5.24%</strong> as markets steadied, even as sterling stayed pinned below $1.34 &mdash; near six-week lows &mdash; on the dollar's continued advance since last week's hawkish Fed hike.", src: "https://www.bloomberg.com/news/live-blog/2026-09-21/ftse-100-stocks-gilts-pound-brent-latest-what-s-moving-uk-markets-right-now-markets-today", srcName: "Bloomberg" },
      ],
    },
  },
};
