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
      date: "2026-10-01",
      time: "10:12 BST",
      lede: "Thursday's session opens with the global bond sell-off still deepening, as government borrowing costs reach multiyear highs and the pressure spills into UK housing and fiscal politics.",
      bullets: [
        { html: "<strong>Macro &mdash; the FT reports the 10-year Treasury yield has hit its highest since 2002</strong> as sovereign debt costs around the world return to multiyear highs. In the UK, house prices fell as higher mortgage rates &lsquo;subdue&rsquo; the market, with the prospect of rate rises weighing on demand.", src: "https://www.ft.com/content/e485a228-1efe-426b-addc-26069ba48bf3", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; the FT argues the rise in borrowing costs has raised justified alarm but brings four potential positives</strong>, while Unhedged sets out an optimist&rsquo;s case that it could be a lot worse.", src: "https://www.ft.com/content/96e004e0-43ab-46e6-9116-fabfc7251496", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; a US government debt rout has triggered a &lsquo;vicious loop&rsquo; of selling</strong>, the FT reported on Wednesday night, after bond markets had steadied following Tuesday&rsquo;s sell-off despite strong US data.", src: "https://www.ft.com/content/39de7709-7b5b-42f6-ad90-df50f1308ea2", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 slipped 0.17% on Tuesday</strong> as the 30-year Treasury yield touched 5.612%, its highest since June 2002; the Nikkei 225 rose 2.0% on Wednesday on chip-led strength.", src: "https://finance.yahoo.com/markets/live/stock-market-today-tuesday-september-29-dow-sp-500-nasdaq-080526442.html", srcName: "Yahoo Finance" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-10-01",
      time: "16:15 BST",
      lede: "Thursday's session closes in on the afternoon with bond markets still setting the tone for everything else, from Treasury yields to UK mortgage costs.",
      bullets: [
        { html: "<strong>Macro &mdash; the FT sets out four potential positives from higher bond yields</strong> even as the rise in borrowing costs has raised alarm. In the UK, house prices fell as higher mortgage rates &lsquo;subdue&rsquo; the market.", src: "https://www.ft.com/content/96e004e0-43ab-46e6-9116-fabfc7251496", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 slipped 0.17% on Tuesday</strong> as the 30-year Treasury yield touched 5.612%, its highest since June 2002.", src: "https://finance.yahoo.com/markets/live/stock-market-today-tuesday-september-29-dow-sp-500-nasdaq-080526442.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the global bond sell-off pushed the 10-year Treasury yield to its highest since 2002</strong>, the FT reports, with the US debt rout earlier described as a &lsquo;vicious loop&rsquo; of selling.", src: "https://www.ft.com/content/e485a228-1efe-426b-addc-26069ba48bf3", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; a US government debt rout triggered a &lsquo;vicious loop&rsquo; of selling</strong> on Wednesday night, per the FT.", src: "https://www.ft.com/content/39de7709-7b5b-42f6-ad90-df50f1308ea2", srcName: "Financial Times" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-10-02",
      time: "00:15 BST",
      lede: "Markets turn to Friday's US jobs report having ended Thursday with stocks recovering and Treasury yields easing back from a 24-year high.",
      bullets: [
        { html: "<strong>Macro &mdash; a top Fed official has signalled the central bank will keep rates on hold in October</strong>, the FT reports, easing pressure for a further hike despite the surge in long-dated yields.", src: "https://www.ft.com/content/e3a53272-385d-40a8-ac77-408f4c136f6f", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; US factory activity expansion held steady in September</strong>, Reuters reports, with input prices jumping.", src: "https://www.reuters.com/business/us-manufacturing-steady-september-input-prices-increase-2026-10-01/", srcName: "Reuters" },
        { html: "<strong>Equities &mdash; Wall Street reversed an earlier selloff to close higher</strong> as bond yields eased, with Micron and Accenture jumping on upbeat revenue forecasts, while European stocks closed at three-month lows.", src: "https://www.reuters.com/business/dow-futures-hit-three-month-low-yields-surge-micron-earnings-offer-support-2026-10-01/", srcName: "Reuters" },
        { html: "<strong>Fixed income &mdash; the benchmark US Treasury yield pulled back from a 24-year high</strong> as buyers stepped in, snapping a seven-session run of gains, after the worst quarter for Treasuries since 1994.", src: "https://www.reuters.com/business/bonds-teeter-after-us-treasuries-worst-quarter-since-1994-2026-10-01/", srcName: "Reuters" },
      ],
    },
  },
};
