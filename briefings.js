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
      date: "2026-09-29",
      time: "10:12 BST",
      lede: "Tuesday opens with the bond sell-off, not equities, setting the tone &mdash; oil-linked long-end yields at multi-decade highs are now the variable everything else is priced against, ahead of a data-heavy end to the week.",
      bullets: [
        { html: "<strong>Macro &mdash; the FT reports oil prices and US Treasury yields are now in their tightest relationship since 1990</strong>, underlining how the stalled US-Iran Hormuz talks are feeding directly into rates.", src: "https://www.ft.com/content/f894f69a-9e2b-4c3f-bf5d-c5c4dc0e6197", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; Bloomberg previews this week's US data (JOLTS, PCE, ISM, payrolls) as likely to bolster the case for an October Fed rate hike</strong>, with a negative surprise the most probable trigger for a bond turnaround.", src: "https://www.bloomberg.com/news/articles/2026-09-28/key-us-data-this-week-seen-bolstering-case-for-october-rate-hike", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 closed Monday down 0.77% at 7,683.69 and the Nasdaq lost 0.92%</strong> as the Treasury-yield jump weighed on stocks, with Boeing dropping nearly 7% after the FAA said it would not certify the 737 Max 10 until it assesses a new software glitch.", src: "https://www.cnbc.com/2026/09/27/stock-market-today-live-updates.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; Treasury yields extended their march to multiyear highs Monday, the 10-year climbing toward 5.2%</strong> as oil rose after Trump rejected Iran's Hormuz proposal.", src: "https://www.cnbc.com/2026/09/28/treasury-yields-bonds-selloff.html", srcName: "CNBC" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-29",
      time: "16:35 BST",
      lede: "Tuesday brings a tentative breather: easing oil and a modest pullback in long-end yields are giving risk assets room, but the week's jobs and inflation data still decide whether the October-hike case hardens.",
      bullets: [
        { html: "<strong>Macro &mdash; Bloomberg says this week's US data (JOLTS, consumer confidence, ADP, payrolls) is seen bolstering the case for another Fed hike at the 28 October FOMC</strong>, with core PCE and the third GDP estimate also due this week.", src: "https://www.bloomberg.com/news/articles/2026-09-28/key-us-data-this-week-seen-bolstering-case-for-october-rate-hike", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; UK gilts extended gains, with the 10-year yield almost 7bp lower</strong>, as oil and gas prices hit new lows on the day on reports of Qatar-brokered US&ndash;Iran contacts.", src: "https://www.bloomberg.com/news/articles/2026-09-29/gilts-lead-european-bonds-higher-as-energy-prices-retreat", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; US futures edged higher this morning as oil and Treasury yields eased</strong>, with tech leading, after Monday's selloff.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-29-2026", srcName: "TheStreet" },
        { html: "<strong>Fixed income &mdash; Treasury yields eased early Tuesday</strong>, with the 10-year around 5.2% and the 30-year near 5.55%, after recent moves to multiyear highs on inflation and policy concerns.", src: "https://www.cnbc.com/2026/09/29/treasury-yields-bonds.html", srcName: "CNBC" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-29",
      time: "18:12 BST",
      lede: "Tuesday closes on a bond-market wobble: the US 30-year yield touched its highest since 2002 while Middle Eastern oil exports climbed, keeping the October rate-hike debate live ahead of Wednesday's PCE and GDP prints.",
      bullets: [
        { html: "<strong>Fixed income &mdash; the US 30-year Treasury yield hit its highest level since 2002</strong> in afternoon trading, extending the long-end selloff.", src: "https://www.ft.com/content/c8693313-7750-40c7-892a-101ab16dec70", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; a low-hire, low-fire US labour market is being read by Fed rate-setters as no cause for worry</strong>, per the FT, as the week's payrolls data approaches.", src: "https://www.ft.com/content/525c4aa1-2d36-47e4-b3ec-2d8f6ebf9060", srcName: "Financial Times" },
        { html: "<strong>Energy &mdash; Middle Eastern oil exports rose to their highest level since the Iran war began</strong>, the FT reported this evening.", src: "https://www.ft.com/content/26c54c8c-931c-4d84-9cf3-fd3e9b5e215d", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; UK gilts extended gains, with the 10-year yield almost 7bp lower</strong> as oil and gas prices hit new lows on the day.", src: "https://www.bloomberg.com/news/articles/2026-09-29/gilts-lead-european-bonds-higher-as-energy-prices-retreat", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; the published Manchester City judgment lays bare the club&rsquo;s &ldquo;sham&rdquo; schemes</strong>, The Lawyer reports, after an initial judgment in the Premier League&rsquo;s case.", src: "https://www.thelawyer.com/published-manchester-city-judgment-lays-bare-clubs-sham-schemes/", srcName: "The Lawyer" },
      ],
    },
  },
};
