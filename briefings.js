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
      time: "10:16 BST",
      lede: "Wednesday opens with long-end yields still near multi-decade highs and consumer confidence at a 12-year low, while a firmer UK growth revision and softer energy prices offer a little relief ahead of the US GDP and PCE prints.",
      bullets: [
        { html: "<strong>Macro &mdash; the ONS has revised UK second-quarter growth up to 0.5% from 0.4%</strong>, and sterling rose on the news, keeping Bank of England hike bets alive. In the US, the Conference Board's consumer confidence index fell to its lowest since 2014.", src: "https://investinglive.com/news/uk-q2-final-gdp-0-5-vs-0-4-q-q-prelim/", srcName: "investingLive" },
        { html: "<strong>Macro &mdash; oil climbed after Trump denied he would ease sanctions on Iran</strong>, reversing part of Tuesday's slide, per CNBC.", src: "https://www.cnbc.com/2026/09/30/oil-climbs-after-trump-denies-he-is-willing-to-ease-sanctions-on-iran.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; the 30-year Treasury yield climbed to a 24-year high on Tuesday</strong>, and the FT reports bond markets steadied afterwards. UK gilts rallied as oil and gas prices hit new lows.", src: "https://finance.yahoo.com/markets/live/stock-market-today-tuesday-september-29-dow-sp-500-nasdaq-080526442.html", srcName: "Yahoo Finance" },
        { html: "<strong>Equities &mdash; the Dow, S&amp;P 500 and Nasdaq wobbled on Tuesday</strong> as the long-bond yield surge weighed on sentiment, per Yahoo Finance's market wrap.", src: "https://finance.yahoo.com/markets/live/stock-market-today-tuesday-september-29-dow-sp-500-nasdaq-080526442.html", srcName: "Yahoo Finance" },
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
