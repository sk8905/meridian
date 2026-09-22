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
      date: "2026-09-22",
      time: "18:15 BST",
      lede: "Diplomatic hopes over Iran did more for risk appetite this evening than the data calendar did, leaving Wall Street's AI-led records intact and Treasury yields becalmed even as a widening UK Budget hole kept sterling and gilts on edge.",
      bullets: [
        { html: "<strong>Macro &mdash; oil extended its retreat as the UN General Assembly week lifted hopes for US-Iran diplomacy</strong>, with Brent still trading below $100 a barrel after reversing some of Monday's steeper declines.", src: "https://www.cnbc.com/2026/09/22/oil-iran-us-bessent-un-crude.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK government borrowing overshot every forecast again in August</strong>, darkening the backdrop for Chancellor Healey's 28 October Budget five weeks out.", src: "https://www.investing.com/news/economy-news/uk-borrowing-overshoot-darkens-backdrop-for-healeys-budget-4909956", srcName: "Investing.com" },
        { html: "<strong>Equities &mdash; the Nasdaq, Dow and S&amp;P 500 traded little changed through the session as the AI trade kept powering the market</strong>, with the Nasdaq holding near Monday's chip-led record close.", src: "https://finance.yahoo.com/markets/live/stock-market-today-tuesday-september-22-nasdaq-dow-sp-500-080625961.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield slipped further below 5%, near 4.97%,</strong> as traders held off on fresh bets ahead of Wednesday remarks from Fed governor Michael Barr, with Chicago Fed's Goolsbee separately flagging elevated services inflation as a risk to watch.", src: "https://www.cnbc.com/2026/09/22/treasury-yield-us-bond-market-trump.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; UK gilts and stocks both firmed as Brent fell back below $100</strong>, while sterling stayed pinned in the mid-$1.33s, caught between the BoE's hawkish hold and this week's borrowing overshoot.", src: "https://www.bloomberg.com/news/live-blog/2026-09-22/ftse-100-stocks-oil-price-gilts-pound-what-s-moving-uk-markets-right-now-markets-today", srcName: "Bloomberg" },
      ],
    },
  },
};
