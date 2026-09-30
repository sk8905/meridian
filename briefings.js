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
      date: "2026-09-30",
      time: "08:13 BST",
      lede: "Wednesday&rsquo;s tape is about whether the bond sell-off has paused &mdash; a firmer UK growth revision and a US fuel-export row over energy costs frame the day ahead of the PCE and GDP prints.",
      bullets: [
        { html: "<strong>Macro &mdash; the ONS has revised UK second-quarter growth up</strong>, the FT reports, saying the economy grew faster than first estimated.", src: "https://www.ft.com/content/00d798b3-1579-4bc6-88bf-a1f99ba85a63", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; the White House is holding crunch talks on a diesel export ban as the US midterms near</strong>, the FT reports, putting fuel prices squarely in the political frame.", src: "https://www.ft.com/content/562f2988-0c04-4669-b0b7-2c16d3821926", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; bond markets steadied after the recent sell-off</strong>, the FT reports, with the UK energy price cap also forecast to rise to nearly &pound;2,000 as the Iran war lifts prices.", src: "https://www.ft.com/content/cd22d20a-3b65-4534-ac04-f5008810e10a", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 fell on Tuesday as easing oil prices and Treasury yields failed to lift sentiment</strong>, per TheStreet&rsquo;s market wrap.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-29-2026", srcName: "TheStreet" },
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
      date: "2026-09-30",
      time: "00:13 BST",
      lede: "Tuesday closed with the long end still setting the agenda: the US 30-year yield reached a 24-year high even as oil eased, leaving the week's PCE and payrolls prints to settle the October-hike argument.",
      bullets: [
        { html: "<strong>Fixed income &mdash; the US 30-year Treasury yield hit its highest level since 2002</strong>, the FT reported, extending the long-end selloff.", src: "https://www.ft.com/content/c8693313-7750-40c7-892a-101ab16dec70", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; UK gilts extended gains, the 10-year yield almost 7bp lower</strong> as oil and gas prices hit new lows on the day.", src: "https://www.bloomberg.com/news/articles/2026-09-29/gilts-lead-european-bonds-higher-as-energy-prices-retreat", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Middle Eastern oil exports rose to their highest level since the Iran war began</strong>, the FT reported, while mediators push to break the US-Iran deadlock.", src: "https://www.ft.com/content/26c54c8c-931c-4d84-9cf3-fd3e9b5e215d", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; UK bosses are left in the dark by the government&rsquo;s emphasis on &lsquo;cost of business&rsquo;</strong>, the FT reports, ahead of the 28 October Budget.", src: "https://www.ft.com/content/bd830daa-e4fe-4cd6-a145-40502652c0b2", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 fell as easing oil prices and Treasury yields failed to lift sentiment</strong>, per TheStreet&rsquo;s market wrap.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-29-2026", srcName: "TheStreet" },
      ],
    },
  },
};
