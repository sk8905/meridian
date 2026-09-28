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
      date: "2026-09-28",
      time: "12:31 BST",
      lede: "Monday's session is stitching Friday's Treasury story to a fresh UK strand &mdash; gilt yields grinding toward two-decade highs are now squeezing Chancellor Healey's Budget arithmetic directly, Goldman Sachs argues, even as US futures shrug off oil's Hormuz-driven climb to edge higher into Friday's jobs test.",
      bullets: [
        { html: "<strong>Macro &mdash; global bond yields marching toward levels not seen in two decades are now feeding doubts about Europe's own equity rally, Bloomberg reports, even as Chancellor Healey's fiscal headroom has roughly halved to about &pound;12bn</strong> under the sustained gilt sell-off ahead of his 28 October Budget &mdash; Goldman Sachs separately traces the move to a global long-end duration shock amplified by UK fiscal uncertainty, with 30-year gilts near 5.9%.", src: "https://www.goldmansachs.com/insights/articles/why-uk-gilt-yields-are-climbing", srcName: "Goldman Sachs" },
        { html: "<strong>Macro &mdash; oil gained over 1% Monday, with Brent above $106/bbl, after President Trump confirmed he rejected Iran's latest seven-day proposal to reopen the Strait of Hormuz</strong>, extending the near seven-month standoff into a new week and keeping oil-driven inflation risk squarely in view.", src: "https://www.cnbc.com/2026/09/28/oil-price-today-wti-brent-trump-iran.html", srcName: "CNBC" },
        { html: "<strong>Equities &mdash; US stock futures pushed higher Monday morning, the E-mini S&amp;P 500 up around 0.5% and Nasdaq futures ahead roughly 0.4%</strong>, shrugging off a University of Michigan sentiment reading near record lows as investors looked past the noise toward Friday's September jobs report.", src: "https://finance.yahoo.com/markets/stocks/articles/us-stock-market-today-p-080713612.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield held above 5% and the 30-year mortgage rate stayed above 7% Monday morning</strong>, keeping home-buying expensive and extending last week's multi-decade-high run even as equity futures found a bid.", src: "https://finance.yahoo.com/markets/stocks/articles/us-stock-market-today-p-080713612.html", srcName: "Yahoo Finance" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-28",
      time: "14:39 BST",
      lede: "Monday's session is a collision between hawkish central-bank rhetoric on both sides of the Atlantic and a fresh oil-driven inflation scare, with equities holding up so far even as Treasury and gilt yields sit pinned at multi-decade highs heading into a data-heavy week.",
      bullets: [
        { html: "<strong>Macro &mdash; WTI jumped over 4% to a session peak of $96.44/bbl Monday after President Trump confirmed he rejected Iran's latest seven-day proposal to reopen the Strait of Hormuz</strong>, extending the near seven-month standoff and keeping oil-driven inflation risk in view just as New York Fed President John Williams called a further hike &lsquo;reasonable&rsquo; by year-end.", src: "https://www.cnbc.com/2026/09/28/oil-price-today-wti-brent-trump-iran.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Bank of England Governor Andrew Bailey warned it will &lsquo;get harder to maintain&rsquo; a rate hold the longer energy prices stay elevated, and Morgan Stanley has now dropped its no-hike call for a two-hike path in November and February</strong>, with markets pricing roughly 80% odds of a November move as 10-year gilt yields hold near 5.35%.", src: "https://www.bloomberg.com/news/articles/2026-09-25/boe-s-bailey-warns-it-s-getting-harder-to-avoid-rate-hikes", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; S&amp;P 500 futures edged higher Monday even as investors braced for a jobs-data-heavy week and digested the weekend's Iran-Hormuz standoff</strong>, with markets looking past near-record-low consumer sentiment toward Friday's September payrolls report.", src: "https://finance.yahoo.com/markets/stocks/articles/us-stock-market-today-p-080713612.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield remains pinned above 5% (5.209% Friday) and the 30-year at 5.516%, both fresh multi-decade highs, while the 10-year gilt sits near 5.35%</strong> as hawkish Fed and BoE commentary keeps global long-end yields elevated into a week topped by Wednesday's US GDP/PCE and Friday's jobs report.", src: "https://www.cnbc.com/2026/09/25/treasury-yields-bonds-debt.html", srcName: "CNBC" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-27",
      time: "22:17 BST",
      lede: "Sterling's slide hardened into a fresh three-month low against the dollar over the weekend as gilt-market strain kept deepening, leaving traders to head into a data-heavy week still unsure whether last week's multi-decade Treasury sell-off was a turning point or a pause.",
      bullets: [
        { html: "<strong>Macro &mdash; the pound hit a three-month low against the dollar Sunday as the bond sell-off that has rattled gilts through the week showed no sign of easing</strong>, with GBP/EUR also slipping toward 1.16 and a separate survey consensus now seeing sterling ending Q2 2027 roughly 1.1% weaker against the euro.", src: "https://www.currencynews.co.uk/forecast/20260927-47288_pound-to-dollar-rate-hits-three-month-low-on-bond-sell-off.html", srcName: "Currency News UK" },
        { html: "<strong>Macro &mdash; the coming week's jobs report and inflation data are shaping up as the key test of whether US economic resilience can keep the Fed's current rate path intact</strong>, a Reuters preview said, with strategists split on whether a soft print revives near-term cut bets.", src: "https://www.investing.com/news/economy-news/jobs-report-inflation-data-to-test-us-rate-path-economic-strength-4918909", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Equities &mdash; CNBC's week-ahead preview flags a heavy US data and earnings slate as the catalyst that could break markets out of last week's holding pattern</strong>, with indices closed since Friday's muted advance and strategists still split on where the S&amp;P 500 and Nasdaq head into month-end.", src: "https://www.cnbc.com/2026/09/27/here-are-the-4-big-things-were-watching-in-the-stock-market-in-the-week-ahead.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; Treasury yields remain parked at post-2004 highs (10-year 5.209%, 30-year 5.516%) after Friday's blowout close, with the weekend's renewed sterling weakness underscoring that the UK leg of the global gilt sell-off has not stabilised</strong> heading into the new week's data run.", src: "https://www.cnbc.com/2026/09/25/treasury-yields-bonds-debt.html", srcName: "CNBC" },
      ],
    },
  },
};
