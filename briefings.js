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
      date: "2026-09-23",
      time: "05:23 BST",
      lede: "Both sides of the Atlantic hardened their hiking talk overnight &mdash; UBS now calls two more Bank of England moves and a St Louis Fed voter says the US may not be done either &mdash; leaving sterling and the dollar both bid into this morning's UK flash PMIs.",
      bullets: [
        { html: "<strong>Macro &mdash; UBS flipped its Bank of England call, now forecasting hikes to 4.25% in November and February 2027</strong>, joining Barclays and Deutsche Bank in a firming City consensus that the MPC's hawkish 6-3 hold last week was the start of a tightening path, not the end of one.", src: "https://www.investing.com/news/economy-news/ubs-flips-boe-call-sees-rate-hikes-to-425-in-november-and-february-2027-4906880", srcName: "Investing.com" },
        { html: "<strong>Macro &mdash; St Louis Fed president Alberto Musalem said more rate hikes may be needed to cool prices</strong>, adding to Richmond Fed's Barkin and Governor Waller in keeping alive the case for a further move at the 28 October FOMC.", src: "https://www.bloomberg.com/news/articles/2026-09-21/fed-s-musalem-says-more-rate-hikes-likely-needed-to-cool-prices", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; the Nasdaq Composite closed at a fresh record 27,244.28 Tuesday, up 0.45%, while the Dow and S&amp;P 500 slipped</strong> as a chipmaker-led AI rally offset a broader session weighed down by falling oil prices.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-22-2026", srcName: "TheStreet" },
        { html: "<strong>Fixed income &mdash; sterling stayed pinned near the $1.3350s, &lsquo;in limbo&rsquo; against the dollar,</strong> with today's UK flash composite PMI the next test of whether the hawkish BoE repricing has further to run.", src: "https://www.fxstreet.com/news/pound-sterling-price-news-and-forecast-gbp-usd-in-limbo-202609221131", srcName: "FXStreet" },
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
      time: "22:21 BST",
      lede: "A Fed hawk's warning that inflation pressures may linger is doing the dollar's work for it into the close &mdash; sterling stretches its slide and the broad market cedes ground even as chip-led AI strength and sub-5% Treasury yields keep the underlying story intact.",
      bullets: [
        { html: "<strong>Macro &mdash; Richmond Fed president Tom Barkin warned inflation pressures may take time to fade</strong>, saying repeated supply shocks are no longer proving temporary even as he called last week's 25bp hike a step that &ldquo;will help&rdquo; return inflation to the 2% target.", src: "https://www.bloomberg.com/news/articles/2026-09-22/fed-s-barkin-warns-inflation-pressures-will-take-time-to-pass", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; sterling slipped further to around $1.3354 as a hawkish Fed outlook lifted the dollar broadly</strong>, with markets pricing roughly a 56.5% chance of another US hike in October, compounding pressure from this week's larger-than-expected UK borrowing overshoot.", src: "https://www.investing.com/news/forex-news/sterling-today-pound-slips-as-hawkish-fed-outlook-lifts-dollar-broadly-4885441", srcName: "Investing.com" },
        { html: "<strong>Equities &mdash; the Dow and S&amp;P 500 slipped even as AI-driven strength kept the Nasdaq's chip-led record run intact</strong>, a split session in which falling oil prices weighed on the broader market while AI names continued to climb.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-22-2026", srcName: "TheStreet" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield held further below 5%, near 4.97%,</strong> as traders stayed on the sidelines ahead of Wednesday remarks from Fed governor Michael Barr, with Chicago Fed's Goolsbee separately flagging elevated services inflation as a risk to watch.", src: "https://www.cnbc.com/2026/09/22/treasury-yield-us-bond-market-trump.html", srcName: "CNBC" },
      ],
    },
  },
};
