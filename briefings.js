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
      date: "2026-10-02",
      time: "08:30 BST",
      bullets: [
        { html: "<strong>Macro &mdash; a top Fed official has signalled the central bank will keep rates on hold in October</strong>, the FT reports, easing pressure for a further hike after the surge in long-dated yields.", src: "https://www.ft.com/content/e3a53272-385d-40a8-ac77-408f4c136f6f", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; US factory activity held steady in September</strong>, Reuters reports, with input prices jumping.", src: "https://www.reuters.com/business/us-manufacturing-steady-september-input-prices-increase-2026-10-01/", srcName: "Reuters" },
        { html: "<strong>Equities &mdash; Wall Street reversed an earlier selloff to close higher on Thursday</strong> as bond yields eased, with Micron and Accenture jumping on upbeat forecasts, while European stocks closed at three-month lows.", src: "https://www.reuters.com/business/dow-futures-hit-three-month-low-yields-surge-micron-earnings-offer-support-2026-10-01/", srcName: "Reuters" },
        { html: "<strong>Fixed income &mdash; the global bond market has steadied after a sharp sell-off</strong>, the FT reports, after yields hit multi-decade highs.", src: "https://www.ft.com/content/4f2ad4c1-22b0-497b-88c8-197d7f301f79", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; French bond spreads over Bunds are nearing the 2011 euro-crisis record</strong>, Bloomberg's John Authers writes, with the 10-year OAT yield at 4.92% even as Treasury yields eased.", src: "https://www.bloomberg.com/opinion/newsletters/2026-10-02/soaring-yields-find-europe-s-weak-spot-in-france", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; quant hedge funds have reaped big gains from the global bond sell-off</strong>, the FT reports.", src: "https://www.ft.com/content/75b0ab84-a252-4ea1-9058-c9ee7ca07f4f", srcName: "Financial Times" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-10-02",
      time: "15:29 BST",
      bullets: [
        { html: "<strong>Macro &mdash; the US economy added just 29,000 jobs in September</strong>, the FT reports, as hiring slowed sharply &mdash; well short of consensus and bolstering the case for a Fed hold in October.", src: "https://www.ft.com/content/7fc80097-1926-4306-81e0-83d90a3d8a1d", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; eurozone inflation hit a three-year high of 3.8% in September</strong>, the FT reports, above expectations, with analysts saying a December ECB move remains the base case after two consecutive rate rises.", src: "https://www.ft.com/content/6394fdc7-5fa5-4ec3-8bde-52633acd2b57", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; in the US, the housing market is frozen</strong>, an FT column argues, with homeowners staying put and affordability as stretched as in the housing bubble &mdash; a problem for the Fed.", src: "https://www.ft.com/content/9f960533-9cd7-4475-aed0-17f09fdc28fd", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the global bond market has steadied after a sharp sell-off</strong> that pushed 10-year US Treasury yields to their highest level since 2002, the FT reports.", src: "https://www.ft.com/content/4f2ad4c1-22b0-497b-88c8-197d7f301f79", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; French bond spreads over Bunds are nearing the 2011 euro-crisis record</strong>, Bloomberg's John Authers writes, with the 10-year OAT yield at 4.92%.", src: "https://www.bloomberg.com/opinion/newsletters/2026-10-02/soaring-yields-find-europe-s-weak-spot-in-france", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; investors are seeking refuge from the bond rout in German Bunds</strong>, the FT reports, as the global sell-off continues.", src: "https://www.ft.com/content/93028839-5f0e-43c4-8ee7-44990115ea57", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; diesel fell sharply as the EU considers releasing 50mn barrels of reserves</strong> under pressure from President Trump, who has threatened to ban US exports of the fuel, the FT reports.", src: "https://www.ft.com/content/97200b07-755c-40ce-a50b-b51666bd4b7e", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; Wall Street rallied on the soft jobs print</strong>, with the S&amp;P 500 up 0.89%, the Nasdaq 1.35% and the Dow around 300 points as the weak September payrolls pared Fed rate-hike bets and pulled Treasury yields back from multi-decade highs; Europe's Euro Stoxx 50 added 1.12% to 6,246 on tech strength, Yahoo Finance reports.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-october-2-dow-sp-500-nasdaq-september-jobs-report-080623878.html", srcName: "Yahoo Finance" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-10-02",
      time: "00:15 BST",
      bullets: [
        { html: "<strong>Macro &mdash; a top Fed official has signalled the central bank will keep rates on hold in October</strong>, the FT reports, easing pressure for a further hike despite the surge in long-dated yields.", src: "https://www.ft.com/content/e3a53272-385d-40a8-ac77-408f4c136f6f", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; US factory activity expansion held steady in September</strong>, Reuters reports, with input prices jumping.", src: "https://www.reuters.com/business/us-manufacturing-steady-september-input-prices-increase-2026-10-01/", srcName: "Reuters" },
        { html: "<strong>Equities &mdash; Wall Street reversed an earlier selloff to close higher</strong> as bond yields eased, with Micron and Accenture jumping on upbeat revenue forecasts, while European stocks closed at three-month lows.", src: "https://www.reuters.com/business/dow-futures-hit-three-month-low-yields-surge-micron-earnings-offer-support-2026-10-01/", srcName: "Reuters" },
        { html: "<strong>Fixed income &mdash; the benchmark US Treasury yield pulled back from a 24-year high</strong> as buyers stepped in, snapping a seven-session run of gains, after the worst quarter for Treasuries since 1994.", src: "https://www.reuters.com/business/bonds-teeter-after-us-treasuries-worst-quarter-since-1994-2026-10-01/", srcName: "Reuters" },
      ],
    },
  },
};
