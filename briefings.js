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
      date: "2026-10-03",
      time: "10:12 BST",
      bullets: [
        { html: "<strong>Macro &mdash; the US economy added just 29,000 jobs in September</strong> as hiring slowed sharply, the FT reports, and the weak print is likely to keep Fed rate setters on the sidelines in October.", src: "https://www.ft.com/content/7fc80097-1926-4306-81e0-83d90a3d8a1d", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; eurozone inflation hit a three-year high of 3.8%</strong>, the FT reports, adding pressure on the ECB to tighten again.", src: "https://www.ft.com/content/6394fdc7-5fa5-4ec3-8bde-52633acd2b57", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the global bond market has steadied after a sharp sell-off</strong> that took 10-year Treasury yields to their highest since 2002, the FT reports, with investors also seeking refuge in German Bunds.", src: "https://www.ft.com/content/4f2ad4c1-22b0-497b-88c8-197d7f301f79", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the FT's Chart of the Week asks what is driving the global bond sell-off</strong> that has pushed long-dated yields to multi-decade highs.", src: "https://www.ft.com/content/f212d7b9-95e0-4aa0-84bf-4df7b43bc80a", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; rising gilt yields are attracting UK retail investors</strong> hunting for tax-efficient assets, the FT reports.", src: "https://www.ft.com/content/17a502a2-f8cb-4d79-996e-f2c7018585de", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; Wall Street rallied on Friday's soft jobs print</strong>, with the S&amp;P 500 up 0.89%, the Nasdaq 1.35% and the Dow around 300 points as weak payrolls pared Fed rate-hike bets and pulled Treasury yields back from multi-decade highs, Yahoo Finance reports.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-october-2-dow-sp-500-nasdaq-september-jobs-report-080623878.html", srcName: "Yahoo Finance" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-10-03",
      time: "16:14 BST",
      bullets: [
        { html: "<strong>Macro &mdash; the US economy added just 29,000 jobs in September</strong> as hiring slowed sharply, the FT reports, and the weak print is likely to keep Fed rate setters on the sidelines in October.", src: "https://www.ft.com/content/7fc80097-1926-4306-81e0-83d90a3d8a1d", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; eurozone inflation hit a three-year high of 3.8%</strong>, the FT reports, adding pressure on the ECB to tighten again.", src: "https://www.ft.com/content/6394fdc7-5fa5-4ec3-8bde-52633acd2b57", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the global bond market has steadied after a sharp sell-off</strong> that took 10-year Treasury yields to their highest since 2002, the FT reports, with investors also seeking refuge in German Bunds.", src: "https://www.ft.com/content/4f2ad4c1-22b0-497b-88c8-197d7f301f79", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; rising gilt yields are attracting UK retail investors</strong> hunting for tax-efficient assets, the FT reports.", src: "https://www.ft.com/content/17a502a2-f8cb-4d79-996e-f2c7018585de", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; Wall Street rallied on Friday's soft jobs print</strong>, with the S&amp;P 500 up 0.89%, the Nasdaq 1.35% and the Dow around 300 points as weak payrolls pared Fed rate-hike bets and pulled Treasury yields back from multi-decade highs, Yahoo Finance reports.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-october-2-dow-sp-500-nasdaq-september-jobs-report-080623878.html", srcName: "Yahoo Finance" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-10-03",
      time: "20:12 BST",
      bullets: [
        { html: "<strong>Macro &mdash; the US economy added just 29,000 jobs in September</strong> as hiring slowed sharply, the FT reports, and the weak print is likely to keep Fed rate setters on the sidelines in October.", src: "https://www.ft.com/content/7fc80097-1926-4306-81e0-83d90a3d8a1d", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; the G7 agreed to release 100mn barrels of oil</strong> as the US backed down from a fuel export ban threat, the FT reports.", src: "https://www.ft.com/content/97200b07-755c-40ce-a50b-b51666bd4b7e", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the FT's Chart of the Week asks what is driving the global bond sell-off</strong>, while rising gilt yields are drawing UK retail investors hunting for tax-efficient assets.", src: "https://www.ft.com/content/f212d7b9-95e0-4aa0-84bf-4df7b43bc80a", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; Wall Street rallied on Friday's soft jobs print</strong>, with the S&amp;P 500 up 0.89% and the Nasdaq 1.35% as weak payrolls pared Fed rate-hike bets, Yahoo Finance reports.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-october-2-dow-sp-500-nasdaq-september-jobs-report-080623878.html", srcName: "Yahoo Finance" },
      ],
    },
  },
};
