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
// ONE CONTINUOUS ITEM PER DESK: the card groups bullets by their desk lead, and a
// desk that carries two stories (e.g. two Macro items) is ALWAYS combined into a
// SINGLE continuous item — one "Macro" kicker, the two stories folded into one
// flowing run of prose, and both sources on one trailing line — never stacked as
// separate sub-bullets and never a repeated kicker. Author each item with its own
// desk lead and source as usual; the render strips the follow-on's kicker,
// re-capitalises its lead and folds it in, so each story should stand as its own
// self-contained sentence that reads cleanly when run on after the one before it.
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
      date: "2026-09-29",
      time: "10:12 BST",
      lede: "Tuesday opens with the bond sell-off, not equities, setting the tone &mdash; oil-linked long-end yields at multi-decade highs are now the variable everything else is priced against, ahead of a data-heavy end to the week.",
      bullets: [
        { html: "<strong>Macro &mdash; the FT reports oil prices and US Treasury yields are now in their tightest relationship since 1990</strong>, underlining how the stalled US-Iran Hormuz talks are feeding directly into rates.", src: "https://www.ft.com/content/f894f69a-9e2b-4c3f-bf5d-c5c4dc0e6197", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; Bloomberg previews this week's US data (JOLTS, PCE, ISM, payrolls) as likely to bolster the case for an October Fed rate hike</strong>, with a negative surprise the most probable trigger for a bond turnaround.", src: "https://www.bloomberg.com/news/articles/2026-09-28/key-us-data-this-week-seen-bolstering-case-for-october-rate-hike", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 closed Monday down 0.77% at 7,683.69 and the Nasdaq lost 0.92%</strong> as the Treasury-yield jump weighed on stocks, with Boeing dropping nearly 7% after the FAA said it would not certify the 737 Max 10 until it assesses a new software glitch.", src: "https://www.cnbc.com/2026/09/27/stock-market-today-live-updates.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; Treasury yields extended their march to multiyear highs Monday, the 10-year climbing toward 5.2%</strong> as oil rose after Trump rejected Iran's Hormuz proposal.", src: "https://www.cnbc.com/2026/09/28/treasury-yields-bonds-selloff.html", srcName: "CNBC" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-28",
      time: "16:19 BST",
      lede: "Monday's Hormuz rejection turned a quiet pre-market into an afternoon risk-off session on both sides of the Atlantic, dragging equities lower even as one mega-cap buyback and a still-hawkish rate chorus kept the picture split rather than uniformly grim.",
      bullets: [
        { html: "<strong>Macro &mdash; Brent held above $106.79/bbl into Monday afternoon after President Trump confirmed he rejected Iran's latest seven-day proposal to reopen the Strait of Hormuz</strong>, extending the near seven-month standoff just as New York Fed President John Williams called a further hike &lsquo;reasonable&rsquo; by year-end.", src: "https://finance.yahoo.com/markets/live/stock-market-today-monday-september-28-dow-sp-500-nasdaq-080420627.html", srcName: "Yahoo Finance" },
        { html: "<strong>Macro &mdash; Bank of England Governor Andrew Bailey has warned it will &lsquo;get harder to maintain&rsquo; a rate hold the longer energy prices stay elevated, and Morgan Stanley has dropped its no-hike call for a two-hike path in November and February</strong>, with markets pricing roughly 80% odds of a November move.", src: "https://www.bloomberg.com/news/articles/2026-09-25/boe-s-bailey-warns-it-s-getting-harder-to-avoid-rate-hikes", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 fell 0.90% to 7,673.88, the Dow dropped 0.75% to 51,440.97 and the Nasdaq lost 1.14% to 26,760.68 in Monday afternoon trading</strong>, with Nvidia (+~1%) the rare bright spot after authorising a further $150bn buyback (total $235bn) even as chip peers AMD and Micron fell 4-5%.", src: "https://finance.yahoo.com/markets/live/stock-market-today-monday-september-28-dow-sp-500-nasdaq-080420627.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield held above 5.2% and the 30-year above 5.5% into Monday afternoon, both near multi-decade highs, while the 10-year gilt sits near 5.35%</strong> as hawkish Fed and BoE commentary keeps global long-end yields elevated into a week topped by Wednesday's US GDP/PCE and Friday's jobs report.", src: "https://www.cnbc.com/2026/09/25/treasury-yields-bonds-debt.html", srcName: "CNBC" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-28",
      time: "22:17 BST",
      lede: "Monday's Hormuz-driven risk-off mood hardened by evening into a genuine three-desk squeeze, with equities closing lower across the board even as Washington's rate-hike case and Westminster's Budget rhetoric both leaned into the same story of long-end yields stuck near multi-decade highs.",
      bullets: [
        { html: "<strong>Macro &mdash; a data-heavy week ahead &mdash; JOLTS, consumer confidence, ADP and Friday's jobs report &mdash; is shaping up to bolster the case some Fed officials have already made for another hike as soon as the 28 October FOMC</strong>, Bloomberg reported Monday evening, keeping October-hike pricing live into the new week.", src: "https://www.bloomberg.com/news/articles/2026-09-28/key-us-data-this-week-seen-bolstering-case-for-october-rate-hike", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Chancellor John Healey told Labour's Liverpool conference that fiscal discipline will sit &lsquo;at the core&rsquo; of his 28 October Budget, casting the cost of servicing Britain's elevated debt as money diverted from public services</strong>, his clearest framing yet of the Budget's stance as the gilt sell-off keeps squeezing his headroom.", src: "https://www.investing.com/news/economy-news/uk-finance-minister-says-fiscal-discipline-will-form-core-of-budget-4920059", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 finished down 0.77% at 7,683.69, the Dow 0.67% lower at 51,481.51 and the Nasdaq 0.92% lower at 26,820.38 on Monday as the stalled Strait of Hormuz standoff pushed Brent above $106.79/bbl</strong>, though Nvidia (+~1%) bucked the slide on a fresh $150bn buyback (total $235bn) even as chip peers AMD and Micron each fell 4-5%.", src: "https://finance.yahoo.com/markets/live/stock-market-today-monday-september-28-dow-sp-500-nasdaq-080420627.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; global bond yields marching toward levels not seen in two decades are now feeding doubts about Europe's own equity rally too, Bloomberg reports, with 30-year gilts near 5.9% and the 10-year Treasury yield holding above 5.2%</strong> as hawkish central-bank rhetoric on both sides of the Atlantic keeps the long end pinned near multi-decade highs.", src: "https://www.bloomberg.com/news/articles/2026-09-28/higher-bond-yields-are-raising-doubts-about-europe-s-stock-rally", srcName: "Bloomberg" },
      ],
    },
  },
};
