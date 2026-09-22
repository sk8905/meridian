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
      time: "16:25 BST",
      lede: "A quiet UN General Assembly week is doing more to move markets than the data calendar this afternoon, with oil's retreat and hopes for Iran-war diplomacy leaving Wall Street little changed and giving the Fed's Williams room to sound sanguine even as UK borrowing keeps squeezing the run-up to next month's Budget.",
      bullets: [
        { html: "<strong>Macro &mdash; oil pared its recent slide as the UN General Assembly week lifted hopes for Iran-war diplomacy</strong>, with Brent still trading below $100 a barrel even as it reversed some of Monday's declines.", src: "https://www.cnbc.com/2026/09/22/oil-iran-us-bessent-un-crude.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK government borrowing overshot again, darkening the backdrop for Chancellor Healey's Budget</strong>, with the August shortfall running ahead of the OBR's path five weeks before the 28 October statement.", src: "https://www.investing.com/news/economy-news/uk-borrowing-overshoot-darkens-backdrop-for-healeys-budget-4909956", srcName: "Investing.com" },
        { html: "<strong>Equities &mdash; the Nasdaq, Dow and S&amp;P 500 were little changed Tuesday afternoon as the AI trade continued to power the market</strong>, with the Nasdaq holding near Monday's chip-led record close after touching a fresh intraday high.", src: "https://finance.yahoo.com/markets/live/stock-market-today-tuesday-september-22-nasdaq-dow-sp-500-080625961.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; New York Fed president John Williams said the Fed's &lsquo;rate-control toolkit is working well&rsquo;</strong>, remarks at a Treasury-market conference that leaned into the Committee's still-hawkish framing after this month's hike.", src: "https://www.investing.com/news/economy-news/feds-williams-says-ratecontrol-toolkit-is-working-well-4911121", srcName: "Investing.com" },
        { html: "<strong>Fixed income &mdash; gilts and stocks both firmed as Brent fell back below $100</strong>, while sterling stayed in limbo against the dollar, caught between the BoE's hawkish hold and this week's UK borrowing overshoot.", src: "https://www.fxstreet.com/news/pound-sterling-price-news-and-forecast-gbp-usd-in-limbo-202609221131", srcName: "FXStreet" },
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
