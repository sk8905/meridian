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
      date: "2026-09-22",
      time: "05:24 BST",
      lede: "The overnight session has done nothing to loosen the dollar's grip, and with Wall Street's chip-led records already banked the day's real test is a thin calendar &mdash; a 7am UK borrowing print and a sell side that keeps pulling its next-hike date forward.",
      bullets: [
        { html: "<strong>Macro &mdash; Goldman Sachs has dropped its &lsquo;one-and-done&rsquo; view and now expects a second Fed hike at the 27&ndash;28 October FOMC</strong>, chief US economist David Mericle citing the Committee's framing of further tightening as supporting a &ldquo;timelier return&rdquo; to the 2% inflation target.", src: "https://investinglive.com/central-banks/goldman-ditches-one-and-done-call-now-sees-a-second-fed-hike-in-october/", srcName: "investingLive" },
        { html: "<strong>Macro &mdash; the ONS publishes August public sector finances at 07:00 this morning</strong>, the main UK data event of an otherwise thin week and the next borrowing read before the 28 October Budget.", src: "https://www.ons.gov.uk/releases/publicsectorfinancesukaugust2026", srcName: "ONS" },
        { html: "<strong>Equities &mdash; the Nasdaq Composite closed Monday at a record 27,122.09, up 2.26%</strong>, after AMD surged roughly 10% to an all-time high above $610 and crossed a $1 trillion market capitalisation for the first time on its fifth straight winning session.", src: "https://www.cnbc.com/2026/09/21/amd-stock-1-trillion-value.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield shed more than four basis points to 4.951% and the 30-year eased to 5.284%</strong> as another leg lower in oil took some heat out of the inflation story.", src: "https://www.cnbc.com/2026/09/20/stock-market-today-live-updates.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; sterling is consolidating above the mid-$1.3300s in Asian hours</strong>, within striking distance of last week's lowest level since 30 July, with the Fed&ndash;BoE split &mdash; one signalling at least one more hike this year, the other still on hold at 3.75% &mdash; keeping the bias bearish.", src: "https://www.fxstreet.com/news/british-pound-consolidates-vs-usd-bearish-bias-remains-amid-divergent-fed-boe-outlook-202609220220", srcName: "FXStreet" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-22",
      time: "12:21 BST",
      lede: "The UK's fiscal arithmetic just got harder five weeks out from the Budget, even as risk appetite carries over from Monday's chip-led Wall Street records and sterling stays pinned near its recent lows.",
      bullets: [
        { html: "<strong>Macro &mdash; UK public sector net borrowing came in at &pound;18.3bn in August</strong>, the second-highest August on record and &pound;2.9bn higher than a year earlier, taking the financial-year-to-date total to &pound;77.3bn &mdash; &pound;8.1bn above the OBR's forecast &mdash; a gap that has widened from &pound;2.3bn in July with five weeks left before Chancellor Healey's 28 October Budget.", src: "https://www.ons.gov.uk/economy/governmentpublicsectorandtaxes/publicsectorfinance/bulletins/publicsectorfinances/august2026", srcName: "ONS" },
        { html: "<strong>Macro &mdash; the dollar index needs a decisive break above 100.56 to open a fresh upside leg</strong>, FXStreet's technical read argues, as the greenback holds onto Monday's post-Fed gains into a week headlined by Wednesday's flash US/UK PMIs and Thursday's Trump-Xi summit.", src: "https://www.fxstreet.com/news/us-dollar-index-price-forecast-needs-a-decisive-move-above-10056-for-fresh-upside-leg-202609220317", srcName: "FXStreet" },
        { html: "<strong>Equities &mdash; the FTSE 100 rose as miners led Monday's gains</strong>, with Anglo American up 3.2% and Antofagasta up a similar margin as softer oil prices and US-China trade optimism lifted the index, even as BP lagged on the weaker crude backdrop.", src: "https://www.ad-hoc-news.de/boerse/news/corporate-news/anglo-american-stock-gains-as-ftse-100-rises-on-softer-oil-prices/70146175", srcName: "Ad Hoc News" },
        { html: "<strong>Fixed income &mdash; sterling broke below $1.3400 on Monday and traded flat-to-bearish into Tuesday</strong>, FXStreet's technical read says, with GBP/USD consolidating in the mid-$1.3300s as the Fed&ndash;BoE policy split &mdash; one signalling at least one more 2026 hike, the other on hold at 3.75% &mdash; keeps the bias against the pound.", src: "https://www.fxstreet.com/news/gbp-usd-price-forecast-turns-flat-after-breakdown-below-13400-202609220550", srcName: "FXStreet" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-21",
      time: "21:08 BST",
      lede: "Chip-stock euphoria powered Wall Street to fresh records into the close, with easing oil taking some of the edge off the rates story even as a hawkish-sounding but still-static Bank of England left the pound stuck near six-week lows.",
      bullets: [
        { html: "<strong>Macro &mdash; oil fell to a four-day low as US-China trade optimism built into Thursday's Trump-Xi summit</strong>, with November WTI down 4.25% to $92.00 and Brent near $101-102/bbl after Treasury Secretary Bessent's weekend talks with Vice Premier He Lifeng were described as &ldquo;very successful&rdquo;.", src: "https://finance.yahoo.com/markets/live/stock-market-today-monday-september-21-dow-sp-500-nasdaq-080214605.html", srcName: "Yahoo Finance" },
        { html: "<strong>Equities &mdash; the Nasdaq Composite jumped 2.26% to a fresh record 27,122.09</strong>, as AMD surged roughly 10% to an all-time high above $610 &mdash; crossing a $1 trillion market cap for the first time on its fifth straight winning session.", src: "https://www.cnbc.com/2026/09/21/amd-stock-1-trillion-value.html", srcName: "CNBC" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 added 1.49% to 7,764.70 and the Dow 0.71% to 52,048.83</strong>, a broad chip-led rally that lagged only the Nasdaq's AMD-driven surge, as Wall Street shrugged off last week's hawkish Fed hike.", src: "https://finance.yahoo.com/markets/live/stock-market-today-monday-september-21-dow-sp-500-nasdaq-080214605.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield slipped back under 5%</strong> as traders modestly trimmed Fed rate-hike bets, with CME FedWatch-tracked odds of a further 25bp move at the 28 October meeting running near 56&ndash;60%.", src: "https://www.bloomberg.com/news/articles/2026-09-21/us-stock-futures-climb-ahead-of-trump-xi-meeting-as-oil-slips", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; UK gilt yields held near 5.24% and sterling stayed pinned near $1.335</strong>, among its weakest levels since late July, even as a Monday analysis argued the Bank of England's hawkish tone since last week's hold points toward a likely &lsquo;insurance hike&rsquo; in November.", src: "https://www.fxstreet.com/analysis/boe-signals-insurance-hike-in-november-sterling-gets-little-help-from-hawkishness-202609211126", srcName: "FXStreet" },
      ],
    },
  },
};
