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
      date: "2026-10-05",
      time: "10:12 BST",
      bullets: [
        { html: "<strong>Macro &mdash; the euro hit a 17-month low against the dollar</strong> as political uncertainty in Spain and France rattled markets, while Spanish PM Pedro S&aacute;nchez called a snap general election for 29 November after Congress rejected his housing decrees.", src: "https://www.cnbc.com/2026/10/05/euro-dollar-spain-france-risk.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; BT has bought TalkTalk's consumer broadband and PXC wholesale businesses out of administration</strong>, Bloomberg reports, to save the UK provider from collapse.", src: "https://www.bloomberg.com/news/articles/2026-10-05/bt-buys-talktalk-to-save-uk-broadband-provider-from-collapse", srcName: "Bloomberg" },
        { html: "<strong>Fixed income &mdash; the US 10-year Treasury yield was around 5.26% on Monday</strong>, below last week's 24-year high, though the dollar held firm on still-lofty yields even after the soft jobs report dampened bets on a Fed hike this month.", src: "https://www.investing.com/news/economy-news/dollar-holds-firm-as-french-fiscal-woes-keep-euro-on-back-foot-4930983", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 gained 0.7% on Friday, the Nasdaq 1.2% and the Dow 0.5%</strong> as the weak September payrolls print (29,000 jobs) cemented expectations of a Fed hold in October, with tech leading.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-october-2-dow-sp-500-nasdaq-september-jobs-report-080623878.html", srcName: "Yahoo Finance" },
        { html: "<strong>Equities &mdash; Schneider Electric has agreed to buy US software group PTC for $205 a share in cash</strong>, an implied enterprise value of $23.7bn, Bloomberg reports.", src: "https://www.bloomberg.com/news/articles/2026-10-05/schneider-electric-to-acquire-ptc-for-more-than-20-billion", srcName: "Bloomberg" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-10-05",
      time: "12:25 BST",
      bullets: [
        { html: "<strong>Macro &mdash; an FT column argues bond turbulence means it&rsquo;s time for the ECB to put QT on hold</strong>, as the euro slid to a 17-month low against the dollar on Spanish and French political risk. Separately, Spanish prime minister Pedro S&aacute;nchez has called a snap election.", src: "https://www.ft.com/content/e0dfef01-4933-4ab9-8927-d08115f4822c", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; Flávio Bolsonaro has taken an early lead in Brazil&rsquo;s presidential election</strong>, the FT reports, in a stunning comeback for the Bolsonaro dynasty.", src: "https://www.ft.com/content/1ab64d24-0f32-4dc8-86b5-20d06e3b3588", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the euro fell to a 17-month low against the dollar</strong> as political uncertainty in Spain and France weighed on European assets, the FT reports.", src: "https://www.ft.com/content/8b19b9f7-9237-47bf-bc50-d8b78aa7fe24", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; Schneider Electric has agreed to buy US software group PTC for $23.7bn</strong>, the FT reports, while a top Monte dei Paschi investor has backed Intesa&rsquo;s sweetened &euro;34.5bn takeover bid.", src: "https://www.ft.com/content/2084f349-0829-4130-a5e6-b98929a6e633", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; Nvidia&rsquo;s $20bn licensing deal with Groq faces a lawsuit</strong> from jilted engineers, the FT reports.", src: "https://www.ft.com/content/93ee425d-9ac7-4543-8cc9-fef2e0670787", srcName: "Financial Times" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-10-05",
      time: "20:12 BST",
      bullets: [
        { html: "<strong>Macro &mdash; the Banque de France governor warns France is at risk of being &lsquo;strangled by interest rates&rsquo;</strong>, the FT reports, as euro-area political and bond-market stress builds.", src: "https://www.ft.com/content/74c3cc77-1593-4c49-90f9-0d92fa3a2418", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the euro slid to a 17-month low against the dollar</strong> as Spain&rsquo;s snap election and French fiscal worries rattled markets, the FT reports.", src: "https://www.ft.com/content/8b19b9f7-9237-47bf-bc50-d8b78aa7fe24", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; Badenoch&rsquo;s pitch goes some way to assuaging British business concerns</strong>, the FT reports, while it argues the Budget needs to tame spending and boost growth.", src: "https://www.ft.com/content/711333ba-67a9-480c-bf65-a3e484a6406b", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the FT asks what can revive the battered government bond market</strong> after the global sell-off, while rising gilt yields draw UK retail investors seeking tax-efficient assets.", src: "https://www.ft.com/content/1a94931f-421e-4d0e-888a-7727f15c3d5f", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; Schneider Electric has agreed to buy US software group PTC for $205 a share in cash</strong>, an implied enterprise value of $23.7bn, Bloomberg reports.", src: "https://www.bloomberg.com/news/articles/2026-10-05/schneider-electric-to-acquire-ptc-for-more-than-20-billion", srcName: "Bloomberg" },
      ],
    },
  },
};
