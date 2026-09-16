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
      date: "2026-09-16",
      time: "08:17 BST",
      lede: "Decision day: the Fed announces its rate call at 2pm ET (7pm BST) with hike odds near a cycle-high 92%, UK August CPI rose to 3.1% this morning ahead of Thursday's BoE meeting, and 30-year gilt yields hover near 6% &mdash; a level last seen in 1998.",
      bullets: [
        { html: "<strong>Macro &mdash; the Fed's rate call lands at 2pm ET (7pm BST) today</strong>, with CME FedWatch-implied odds of a quarter-point hike to 3.75-4.00% near a cycle-high 92% &mdash; which would be the first increase since July 2023 &mdash; alongside a fresh Summary of Economic Projections.", src: "https://www.kiplinger.com/investing/live/fed-meeting-updates-and-commentary-september-2026", srcName: "Kiplinger" },
        { html: "<strong>Equities &mdash; Wall Street fell for a second straight session Tuesday</strong>, with the Dow off 0.63% to 52,093.11, the S&amp;P 500 down 0.45% to 7,585.73 and the Nasdaq down 0.78% to 25,981.57, as traders braced for today's decision.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-sept-15-2026-dow-futures-slide-as-oil-prices-surge-and-treasury-yields-hit-2007-highs", srcName: "TheStreet" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield hit an intraday high of 5.041% Tuesday</strong>, its highest since 2007, before paring back into the close as money markets treat today's hike as an almost certain move.", src: "https://www.cnbc.com/2026/09/14/stock-market-today-live-updates.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK August CPI rose to 3.1% y/y this morning</strong> (up from 2.9% in July), with CPIH up 3.3% and core CPI flat at 2.6% &mdash; a hotter-than-hoped print the day before Thursday's BoE decision, where a hold at 3.75% remains the consensus.", src: "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/august2026", srcName: "ONS" },
        { html: "<strong>Fixed income &mdash; UK gilt yields remain near multi-decade highs</strong>, with the 2-year at 4.72% (highest since November 2023) and the 30-year approaching 6% &mdash; a level last seen in 1998 &mdash; as Goldman Sachs' latest BoE preview keeps its call for Thursday's hold but flags a November hike as the balance of risk.", src: "https://www.cityam.com/surge-in-borrowing-costs-could-force-healey-to-deliver-emergency-budget/", srcName: "CityAM" },
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
      date: "2026-09-15",
      time: "21:09 BST",
      lede: "Wall Street closed lower for a second straight session as the Dow fell 328 points and the 10-year Treasury yield touched a fresh 2007 high intraday, with oil and yields now moving in the tightest lockstep in seven years and sterling pinned near a five-week low a day before the Fed's decision.",
      bullets: [
        { html: "<strong>Equities &mdash; the Dow closed down 328.09 points (-0.63%) to 52,093.11</strong> on the last full session before Wednesday's Fed decision, with the S&amp;P 500 off 0.45% to 7,585.73 and the Nasdaq down 0.78% to 25,981.57.", src: "https://www.cnbc.com/2026/09/14/stock-market-today-live-updates.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield hit an intraday high of 5.041%</strong>, its highest since 2007, before paring back into the close as traders positioned for Wednesday's decision.", src: "https://www.cnbc.com/2026/09/14/stock-market-today-live-updates.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; a Reuters poll now finds 85% of economists expecting Wednesday's Fed hike</strong>, up from under a third a week earlier, after hotter-than-expected August CPI and PPI prints reversed the summer's disinflation narrative.", src: "https://en.sedaily.com/international/2026/09/15/us-inflation-flips-rate-outlook-as-85-percent-of-economists", srcName: "Seoul Economic Daily" },
        { html: "<strong>Macro &mdash; sterling held just above a five-week low near $1.3465</strong> as Tuesday's mixed UK jobs data (unemployment steady at 4.9%, but only +67,000 jobs vs +83,000 prior) failed to offset dollar strength from firming Fed-hike bets ahead of Thursday's BoE decision.", src: "https://www.fxstreet.com/news/british-pound-pushes-against-five-week-lows-following-mixed-uk-employment-data-202609150628", srcName: "FXStreet" },
        { html: "<strong>Fixed income &mdash; oil and Treasury yields are now moving in the tightest lockstep in seven years</strong>: the one-month rolling correlation between WTI crude and the 10-year yield has climbed to 0.96, meaning the energy shock and the bond selloff are moving as a single risk factor into the Fed.", src: "https://www.cnbc.com/2026/09/15/oil-us-treasurys-stocks-pressure.html", srcName: "CNBC" },
      ],
    },
  },
};
