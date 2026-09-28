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
      time: "08:24 BST",
      lede: "Monday's open widened Friday's Treasury-yield story into a global one &mdash; bond yields marching toward two-decade highs are now denting confidence in Europe's own equity rally, not just Wall Street's &mdash; as oil's climb on Trump's rejected Iran offer kept US futures on the back foot heading into Friday's cooler jobs test.",
      bullets: [
        { html: "<strong>Macro &mdash; oil gained over 1% Monday, with Brent above $106/bbl, after President Trump confirmed he rejected Iran's latest seven-day proposal to reopen the Strait of Hormuz</strong>, extending the near seven-month standoff into a new week and keeping oil-driven inflation risk squarely in view.", src: "https://www.cnbc.com/2026/09/28/oil-price-today-wti-brent-trump-iran.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; global bond yields marching toward levels not seen in two decades are now feeding doubts about Europe's own equity rally, Bloomberg reports, even as Chancellor Healey's fiscal headroom has roughly halved to about &pound;12bn</strong> under the sustained gilt sell-off ahead of his 28 October Budget.", src: "https://www.bloomberg.com/news/articles/2026-09-28/higher-bond-yields-are-raising-doubts-about-europe-s-stock-rally", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; US stock futures fell further Monday morning, Dow futures down around 180 points (-0.4%) and Nasdaq-100 futures off 0.7%, after last week's winning run on Wall Street</strong>, as the fresh Hormuz rejection pushed oil higher and dented early risk appetite heading into Friday's September jobs report.", src: "https://www.cnbc.com/2026/09/27/stock-market-today-live-updates.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; the rate-sensitive 2-year Treasury yield climbed a further 5bp to 4.90% and the 10-year added another 4bp Monday, building on last week's leap to 5.23%, its highest since 2007</strong>, with CME FedWatch-implied odds of an October Fed hike near 66% and markets still pricing roughly 66-81% odds of a 5 November BoE hike.", src: "https://www.cnbc.com/2026/09/27/stock-market-today-live-updates.html", srcName: "CNBC" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-25",
      time: "16:21 BST",
      lede: "Friday's data delivered two warring signals inside an hour &mdash; a hawkish nudge from Threadneedle Street collided with the gloomiest US consumer-sentiment reading in decades &mdash; yet equities shrugged both off while the week's defining bond sell-off keeps grinding higher into the close.",
      bullets: [
        { html: "<strong>Macro &mdash; Bank of England Governor Andrew Bailey told Oxford's Monetary Economics Conference it will &lsquo;get harder to maintain&rsquo; a rate hold the longer energy prices stay elevated</strong>, even as he said signs of second-round inflation effects remain &lsquo;quite subdued&rsquo; so far &mdash; markets now price roughly 80% odds of a November hike.", src: "https://www.investing.com/news/economy-news/boes-bailey-says-high-energy-prices-make-it-harder-to-leave-rates-on-hold-4917012", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Macro &mdash; the University of Michigan's final September sentiment index fell to 48.1, and the survey's four lowest-ever readings since 1952 have all landed within the past six months</strong> &mdash; worse than during wars, the 1970s oil crisis, 9/11 and the Great Recession &mdash; even as US durable goods orders were roughly flat in August, missing forecasts.", src: "https://www.cnn.com/2026/09/25/economy/us-consumer-sentiment-final-september", srcName: "CNN Business" },
        { html: "<strong>Equities &mdash; US stocks were little changed to modestly higher Friday afternoon, with the S&amp;P 500 edging up as Brent crude eased on hopes for a phased Strait of Hormuz reopening</strong>, capping a volatile week dominated by the Treasury-yield sell-off, while London's FTSE 100 was set for its own rebound with sterling holding close to $1.32.", src: "https://finance.yahoo.com/markets/stocks/articles/stock-market-today-sept-25-134126022.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield rose again to 5.209% and the 30-year climbed to 5.516% Friday, extending this week's global bond sell-off</strong> as Japanese, UK and eurozone yields all hit fresh highs on hawkish Fed commentary from Governor Michael Barr and elevated energy prices &mdash; volatility is on course for its biggest weekly jump since April's tariff shock.", src: "https://www.cnbc.com/2026/09/25/treasury-yields-bonds-debt.html", srcName: "CNBC" },
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
