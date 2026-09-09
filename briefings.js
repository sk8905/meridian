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
      date: "2026-09-09",
      time: "09:13 BST",
      lede: "Brent breaks above $100 for the first time since July after Houthi strikes on Saudi energy sites, adding a fresh inflation scare just as Fed hike odds push past 50% and the UK sells 30-year debt at the highest yield since 1998 &mdash; a combustible backdrop for Thursday's PPI and Friday's decisive August CPI.",
      bullets: [
        { html: "<strong>Macro &mdash; Brent tops $100 for the first time since 24 July</strong>: crude jumped 2.2% to $100.07 after Yemen's Houthi rebels struck multiple Saudi energy facilities and Saudi Arabia retaliated, the sharpest flare-up yet in the six-month US-Iran conflict, keeping oil-driven inflation risk squarely in front of Thursday's PPI and Friday's CPI.", src: "https://finance.yahoo.com/news/brent-crude-rises-above-100-073722479.html", srcName: "Reuters" },
        { html: "<strong>Equities &mdash; Qualcomm and Corning lead an AI-infrastructure rally</strong>: Qualcomm jumped as much as 10% on a $60bn AWS custom-chip and networking partnership and Corning surged over 8% on a multi-billion-dollar Verizon fibre deal, pulling Intel (+9%), AMD (+6%) and HPE (+8%) higher with them.", src: "https://www.cnbc.com/2026/09/08/ai-infrastructure-stocks-rally-on-deal-from-qualcomm-and-corning.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; UK sells 30-year debt at the highest yield since 1998</strong>: Britain's £4.25bn syndication of a 5.375% 2056 gilt priced at a 5.8168% yield, the richest at any gilt auction or syndication since the DMO's creation, underscoring the fiscal pressure on Chancellor Healey ahead of the 28 October Budget.", src: "https://www.investing.com/news/economy-news/uk-sells-30year-debt-at-record-yield-showing-pressure-on-public-finances-4891674", srcName: "Reuters" },
        { html: "<strong>Macro &mdash; Fed-hike odds push past 50% for the first time this cycle</strong>: CME FedWatch-implied odds of a 16 September quarter-point hike rose to nearly 56% after Chair Warsh's hawkish Jackson Hole tone, up from roughly 30% before the speech, with Thursday's PPI and Friday's CPI now the decisive inputs.", src: "https://finance.yahoo.com/economy/policy/articles/fomc-september-2026-odds-rate-201618784.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; Sterling's G10 outperformance looks exposed into the BoE decision</strong>: the pound has been the G10's surprise star on resilient UK growth, but strategists say an imminent ECB hike and rising Fed-hike odds against a more cautious-sounding Bank of England could expose it heading into the 17 September MPC decision.", src: "https://www.cnbc.com/2026/09/09/fx-currencies-interest-rate-hikes.html", srcName: "CNBC" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-09",
      time: "12:34 BST",
      lede: "Brent holds above $100 into the New York open as US futures tread water and sterling firms on a hawkish Bailey warning ahead of next week's back-to-back Fed and BoE decisions, with Thursday's PPI and Friday's decisive August CPI still the week's pivot.",
      bullets: [
        { html: "<strong>Macro &mdash; Brent holds above $100 as the Gulf standoff enters a new phase</strong>: crude stayed elevated above the $100 mark first breached since 24 July after Houthi strikes on Saudi energy sites, keeping an oil-driven inflation premium squarely in front of Thursday's PPI and Friday's CPI.", src: "https://www.cnbc.com/2026/09/09/cnbc-daily-open-iran-war-oil-tankers-oil-sanctions-ai-qualcomm.html", srcName: "CNBC" },
        { html: "<strong>Equities &mdash; US futures hold steady even as oil nears $100</strong>: S&amp;P 500, Nasdaq and Dow futures were little changed heading into Wednesday's session, with investors weighing the Gulf oil shock against Tuesday's Qualcomm- and Corning-led AI-infrastructure rally.", src: "https://finance.yahoo.com/markets/live/stock-market-today-wednesday-september-9-dow-sp-500-nasdaq-futures-080411279.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; Sterling firms as Bailey's hawkish tone lifts the pound into the MPC</strong>: GBP found support after BoE Governor Bailey struck a more hawkish note, with strategists weighing whether the pound's G10 outperformance can hold against a Fed decision one day ahead of the 17 September MPC.", src: "https://www.fxstreet.com/analysis/sterling-finds-support-as-baileys-hawkish-warning-lifts-pound-ahead-of-mpc-decision-202609090927", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; Fed-hike odds hold above 50% for the first time this cycle</strong>: CME FedWatch-implied odds of a 16 September quarter-point hike remain near 56%, up sharply since Chair Warsh's hawkish Jackson Hole remarks, with Thursday's PPI and Friday's CPI now the decisive inputs before the decision.", src: "https://finance.yahoo.com/economy/policy/articles/fomc-september-2026-odds-rate-201618784.html", srcName: "Yahoo Finance" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-08",
      time: "21:24 BST",
      lede: "US stocks close sharply lower: the Dow sheds more than 600 points as mega-cap tech leads the fall and oil near $99 lifts inflation fear, while the post-Labor-Day investment-grade bond rush runs at a six-year low with the 10-year Treasury near 4.80% &mdash; and sterling holds around $1.35 into Thursday's PPI and Friday's decisive US CPI.",
      bullets: [
        { html: "<strong>Equities &mdash; Dow drops 600+ points as mega-cap tech leads the fall</strong>: the Dow fell more than 1.1% and the S&amp;P 500 and Nasdaq slid as Apple (-2.6%), Alphabet (-2.1%) and Microsoft (-2.1%) led losses, with oil near $99 and elevated Treasury yields sapping risk appetite; industrials bucked the drop, Caterpillar +1.7%.", src: "https://www.cnbc.com/2026/09/07/stock-market-tuesday-live-updates.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; Post-Labor-Day investment-grade bond rush runs at a six-year low</strong>: the normally-busy post-holiday window turned in its weakest showing since 2020 as rate volatility and a 10-year Treasury near multi-year highs kept borrowers sidelined &mdash; following a ~$130-145bn August and putting the ~$2tn full-year issuance target in question.", src: "https://www.bloomberg.com/news/articles/2026-09-08/volatility-limits-post-labor-day-us-bond-rush-to-six-year-low", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Brent holds near $98 after Houthi allies strike Saudi energy sites</strong>: crude stayed elevated after attacks on multiple Saudi energy facilities, keeping an oil-driven inflation premium on the tape days before the 11 September CPI print that markets see as decisive for the 16 September FOMC.", src: "https://www.cnbc.com/2026/09/08/oil-prices-today-brent-wti-hormuz-iran-war.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Sterling holds around $1.35 into a run of back-to-back central-bank events</strong>: GBP/USD held near 1.354, inside its August range, with traders focused on whether Friday's US CPI and the 17 September BoE decision &mdash; a day after the Fed's own call &mdash; can sustain sterling demand.", src: "https://tiomarkets.com/article/gbp-usd-market-analysis-technical-outlook-september-8-2026", srcName: "TIOmarkets" },
      ],
    },
  },
};
