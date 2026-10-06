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
// DESK FOCUS: the briefings cover the four MARKET desks — Macro, Bonds, Equities
// and Credit (private equity / private credit fund news) — and ONLY those (no
// Legal; it has its own surface). Each bullet's <strong> lead is tagged with its
// desk. The first four bullets are the ones the Home card renders
// (HB_MAX_BULLETS — one iPhone screen), so they carry the four-desk spread.
// ONE CONTINUOUS ITEM PER DESK: the card groups bullets by their desk lead, and a
// desk that carries two stories (e.g. two Macro items) is ALWAYS combined into a
// SINGLE continuous item — one "Macro" kicker, the two stories folded into one
// flowing run of prose, and both sources on one trailing line — never stacked as
// separate sub-bullets and never a repeated kicker. Author each item with its own
// desk lead and source as usual; the render strips the follow-on's kicker,
// re-capitalises its lead and folds it in, so each story should stand as its own
// self-contained sentence that reads cleanly when run on after the one before it.
// Equities & Bonds bullets LEAD WITH THE MOVE AND ITS DRIVER — the index
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
      date: "2026-10-06",
      time: "10:15 BST",
      bullets: [
        { html: "<strong>Macro &mdash; France is being hit by a pre-election debt sell-off</strong> that many fear could shake the eurozone, the FT reports, while Brazil's Bovespa rallied to its highest in dollar terms since 2011 after Flavio Bolsonaro's first-round lead over Lula.", src: "https://www.ft.com/content/9b252b46-a87c-45e7-a09a-45a39ce077b8", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; the governor of the Banque de France has warned on rising rates</strong>, according to the FT&rsquo;s FirstFT morning briefing, as French and wider euro-area debt stays under pressure ahead of the Spanish snap election.", src: "https://www.ft.com/content/1d152b5b-decb-41c3-a197-8de1d1ca26fc", srcName: "Financial Times" },
        { html: "<strong>Bonds &mdash; the US 10-year Treasury yield has broken through its 2007 high</strong>, with Monday's ISM services report showing the share of managers citing rising prices at its highest since the post-pandemic surge, Bloomberg's John Authers notes.", src: "https://www.bloomberg.com/opinion/newsletters/2026-10-06/a-top-heavy-stocks-rally-is-daring-bond-yields-to-break-it", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Blackstone has agreed to sell its events business Clarion to Informa for &pound;2.2bn</strong>, the FT reports, in a sizeable exit for the private-equity group.", src: "https://www.ft.com/content/0c8c0122-cc24-4ea5-bc7f-09bfc95d3dd1", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; the Nasdaq-100 rose 0.9% on Monday to top 31,000 for the first time</strong>, a rally Authers says is increasingly narrow and dependent on a few mega-cap names even as long bond yields climb.", src: "https://www.bloomberg.com/opinion/newsletters/2026-10-06/a-top-heavy-stocks-rally-is-daring-bond-yields-to-break-it", srcName: "Bloomberg" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-10-06",
      time: "16:15 BST",
      bullets: [
        { html: "<strong>Macro &mdash; Chancellor Healey warns banks the UK faces a &lsquo;challenging&rsquo; fiscal picture</strong> but stays tight-lipped on tax ahead of the Budget, the FT reports; Vitol&rsquo;s chief separately warns of a tanker shortage and the risk of $200-a-barrel oil.", src: "https://www.ft.com/content/3cd5097b-b5ca-4b9f-83fd-f008bb2b72d3", srcName: "Financial Times" },
        { html: "<strong>Bonds &mdash; the global government-bond sell-off is the day&rsquo;s dominant theme</strong>, with the FT explaining why yields are so high and warning of a pre-election debt sell-off in France that many fear could shake the eurozone.", src: "https://www.ft.com/content/a6161dfd-bfb9-4bf5-866f-1ca0a0c8e6aa", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 hit a record high</strong> as AI-linked stocks shrugged off the bond-market slump, the FT reports.", src: "https://www.ft.com/content/1c1ee003-f041-4c66-a971-f08d488d11f7", srcName: "Financial Times" },
        { html: "<strong>Credit &mdash; debt is in the spotlight as Paramount closes its $111bn deal for Warner Bros</strong>, the FT reports; separately McKesson and CD&amp;R strike a $5.8bn deal to buy an infusion services provider.", src: "https://www.ft.com/content/93756433-eb78-422d-8ac3-30e8cc243a00", srcName: "Financial Times" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-10-06",
      time: "22:12 BST",
      bullets: [
        { html: "<strong>Macro &mdash; Spain&rsquo;s Pedro S&aacute;nchez is gambling on a snap election</strong>, the FT reports, while in France Marine Le Pen pledged to rein in public spending as euro-area political risk keeps markets on edge.", src: "https://www.ft.com/content/a7a19bb1-a1ba-4317-a191-c387bbc9f4b9", srcName: "Financial Times" },
        { html: "<strong>Bonds &mdash; the global government-bond sell-off remains the dominant theme</strong>: the FT explains why yields are so high, and reports France is caught between the bond market and the barricades ahead of its elections, after the euro fell to a 17-month low against the dollar on Monday.", src: "https://www.ft.com/content/9b252b46-a87c-45e7-a09a-45a39ce077b8", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 hit a record high</strong> as AI-linked stocks shrugged off the bond-market slump, the FT reports; Bloomberg&rsquo;s Markets Daily notes Nvidia nearing a $6 trillion market value.", src: "https://www.ft.com/content/1c1ee003-f041-4c66-a971-f08d488d11f7", srcName: "Financial Times" },
        { html: "<strong>Credit &mdash; Arini raised $1.5 billion for its credit trading strategy</strong>, reopening it to new cash after two years even as its main hedge fund extended losses to a 13.5% decline, Bloomberg reports.", src: "https://www.bloomberg.com/news/articles/2026-10-05/arini-raises-1-5-billion-even-as-its-main-fund-sees-13-5-loss", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Ion has told creditors it will not play hardball over its $11bn debt pile</strong>, the FT reports.", src: "https://www.ft.com/content/fba91434-70d3-40e6-adb1-8d0c5d6f4fe6", srcName: "Financial Times" },
      ],
    },
  },
};
