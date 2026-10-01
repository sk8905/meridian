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
      time: "05:10 BST",
      lede: "Thursday opens with the bond sell-off still the market's organising story, as softer inflation data takes some heat out of Fed hike pricing while energy costs keep the Bank of England leaning hawkish.",
      bullets: [
        { html: "<strong>Macro &mdash; the FT reports weak PCE inflation has eased pressure for Fed rate increases</strong>, a welcome pause after a run of hot prints. In the UK, the Bank of England warned that a surge in AI-related debt raises the risk of a sharp market correction.", src: "https://www.ft.com/content/97043be8-28f7-40c8-936f-617ebeec5d2b", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; the ONS revised UK second-quarter growth up to 0.5% from 0.4%</strong>, and the FT notes UK energy price cap forecasts have risen towards &pound;2,000 as the Iran war lifts prices.", src: "https://www.ft.com/content/00d798b3-1579-4bc6-88bf-a1f99ba85a63", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the FT reports a US government debt rout has triggered a &lsquo;vicious loop&rsquo; of selling</strong>, even as bond markets steadied after Tuesday's sell-off despite strong US data.", src: "https://www.ft.com/content/39de7709-7b5b-42f6-ad90-df50f1308ea2", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 slipped 0.17% on Tuesday</strong> as the 30-year Treasury yield touched 5.612%, its highest since June 2002; the Nikkei 225 rose 2.0% on Wednesday on chip-led strength.", src: "https://finance.yahoo.com/markets/live/stock-market-today-tuesday-september-29-dow-sp-500-nasdaq-080526442.html", srcName: "Yahoo Finance" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-30",
      time: "16:15 BST",
      lede: "Wednesday afternoon brings softer US PCE inflation that eases the case for Fed hikes, while the Bank of England warns that surging AI-related debt raises the risk of a sharp market correction.",
      bullets: [
        { html: "<strong>Macro &mdash; weak PCE inflation eased pressure for further Fed rate increases</strong>, the FT reports, while the ONS revised UK second-quarter growth up to 0.5% from 0.4%.", src: "https://www.ft.com/content/97043be8-28f7-40c8-936f-617ebeec5d2b", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; bond markets steadied after the sell-off despite strong US data</strong>, the FT reports, following Tuesday's 24-year high in the US 30-year Treasury yield.", src: "https://www.ft.com/content/cd22d20a-3b65-4534-ac04-f5008810e10a", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the Bank of England warned that an AI debt surge raises the risk of a sharp market correction</strong>, per the FT.", src: "https://www.ft.com/content/5c1ccafc-c3e6-49c1-8cdc-b9ed73627749", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; the Dow, S&amp;P 500 and Nasdaq wobbled on Tuesday</strong> as the long-bond yield surge weighed on sentiment, per Yahoo Finance's market wrap.", src: "https://finance.yahoo.com/markets/live/stock-market-today-tuesday-september-29-dow-sp-500-nasdaq-080526442.html", srcName: "Yahoo Finance" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-30",
      time: "00:10 BST",
      lede: "Wednesday ends with the US government bond rout still the dominant story, softer PCE inflation easing pressure for Fed hikes, and the Bank of England flagging AI-linked debt as a correction risk.",
      bullets: [
        { html: "<strong>Energy &mdash; Donald Trump said South Korea will invest $200bn in US energy projects</strong>, the FT reports.", src: "https://www.ft.com/content/f0cdc5bc-c07a-47cf-9602-064006176aef", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; weak PCE inflation eased pressure for further Fed rate increases</strong>, the FT reports, while the ONS revised UK second-quarter growth up to 0.5% from 0.4%.", src: "https://www.ft.com/content/97043be8-28f7-40c8-936f-617ebeec5d2b", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the US government debt rout is feeding a &lsquo;vicious loop&rsquo; of selling</strong>, the FT reports, as long-dated Treasury yields extend their climb after Tuesday&rsquo;s 24-year high in the 30-year.", src: "https://www.ft.com/content/39de7709-7b5b-42f6-ad90-df50f1308ea2", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the Bank of England warned that an AI debt surge raises the risk of a sharp market correction</strong>, per the FT.", src: "https://www.ft.com/content/5c1ccafc-c3e6-49c1-8cdc-b9ed73627749", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; the Dow, S&amp;P 500 and Nasdaq wobbled on Tuesday</strong> as the long-bond yield surge weighed on sentiment, per Yahoo Finance's market wrap.", src: "https://finance.yahoo.com/markets/live/stock-market-today-tuesday-september-29-dow-sp-500-nasdaq-080526442.html", srcName: "Yahoo Finance" },
      ],
    },
  },
};
