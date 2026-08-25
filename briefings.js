// =============================================================================
// briefings.js — the tri-daily AI market briefings (Morning · Afternoon ·
// Evening) surfaced by the header "Briefing" button (v2/js/nav-actions.js).
//
// GENERATION (see docs/refresh-routines.md): these are written by the 5×/day
// refresh routine, NOT at runtime. Each run regenerates whichever slot the clock
// is in (morning < 12:00 · afternoon 12:00–17:00 · evening ≥ 17:00 BST), so the
// current slot is always freshest and every slot is refreshed at least once a day.
//
// GROUNDING (HOUSE_STYLE / non-negotiables): a briefing is a SUMMARY of items
// Wire already holds — every bullet carries a real `src` URL to the wire/desk item
// it compresses. No invented figures, no uncited claims. A thin news slot gets a
// short briefing, never padding. Served no-cache + tokenless (see _headers), so a
// routine refresh is picked up without a code token bump (HOUSE_STYLE T1).
// =============================================================================
export const BRIEFINGS = {
  tz: "BST",
  // Ordered for the slot chips; the view picks the current slot by clock.
  order: ["morning", "afternoon", "evening"],
  slots: {
    morning: {
      label: "Morning",
      date: "2026-08-25",
      time: "09:28 BST",
      lede: "The dollar struggled for traction and gold held near a three-month high as markets weighed new Iran sanctions and Treasury's bond-buyback plans ahead of Fed governor Kevin Warsh's debut Jackson Hole speech on Friday, while UK papers speculated over which taxes Burnham and Healey will raise in the Autumn Budget; in legal, Latham & Watkins and Ropes & Gray/Simpson Thacher led a run of new capital-markets and M&A alerts, including Genstar Capital's acquisition of Oncourse Home Solutions from Apax-advised funds.",
      bullets: [
        { html: "<strong>Macro &mdash; Dollar/Iran sanctions</strong>: The dollar struggled for traction as markets weighed the latest US sanctions on Iran alongside Treasury's bond-buyback programme, with Fed governor Kevin Warsh's Friday Jackson Hole speech now the week's key catalyst.", src: "https://www.cnbc.com/2026/08/25/dollar-wobbles-as-markets-weigh-iran-sanctions-treasury-buybacks.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Gold</strong>: Gold held near a three-month high as traders weighed the Treasury's debt-management moves and positioned ahead of Jackson Hole.", src: "https://www.bloomberg.com/news/articles/2026-08-24/gold-holds-near-three-month-high-as-traders-weigh-treasury-moves", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Bonds/Jackson Hole</strong>: Bond-market anxiety is raising the stakes for Warsh's debut Jackson Hole speech, with investors looking for signals on the September rate path.", src: "https://www.investing.com/news/economy-news/bond-market-anxiety-raises-stakes-for-warshs-debut-jackson-hole-speech-4872977", srcName: "Investing.com" },
        { html: "<strong>Macro &mdash; UK Budget</strong>: Speculation intensified over which taxes Burnham and Healey will raise in the Autumn Budget, with CityAM running through the options facing the government.", src: "https://www.cityam.com/budget-2026-which-taxes-will-burnham-and-healey-hike/", srcName: "CityAM" },
        { html: "<strong>Legal &mdash; Genstar/Oncourse</strong>: Simpson Thacher and Ropes &amp; Gray advised on Genstar Capital's acquisition of Oncourse Home Solutions from Apax-advised funds, the latest in a run of new Latham &amp; Watkins- and Ropes &amp; Gray-led capital-markets alerts this week.", src: "https://www.ropesgray.com/en/news-and-events/news/2026/08/ropes-gray-advised-genstar-capital-on-acquisition-of-oncourse-home-solutions", srcName: "Ropes & Gray" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-25",
      time: "12:34 BST",
      lede: "Markets steadied into Wednesday's Nvidia earnings and this week's Jackson Hole symposium, with the dollar struggling for traction and gold near a three-month high as investors weighed new Iran sanctions and Treasury's bond-buyback plans, while UK papers speculated over which taxes Burnham and Healey will raise in the Autumn Budget; in credit, Carlyle Global Credit reset a 2025-vintage European CLO; and in legal, A&amp;O Shearman advised ENERCON on a &euro;1bn syndicated guarantee facility.",
      bullets: [
        { html: "<strong>Macro &mdash; Nvidia/Jackson Hole</strong>: US futures steadied in the countdown to Nvidia's earnings and the Fed's Jackson Hole symposium later this week.", src: "https://finance.yahoo.com/markets/live/stock-market-today-tuesday-august-25-dow-sp-500-nasdaq-080527092.html", srcName: "Yahoo Finance" },
        { html: "<strong>Macro &mdash; Dollar/gold</strong>: The dollar struggled for traction and gold held near a three-month high as markets weighed new Iran sanctions alongside Treasury's bond-buyback programme.", src: "https://www.cnbc.com/2026/08/25/dollar-wobbles-as-markets-weigh-iran-sanctions-treasury-buybacks.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK Budget</strong>: CityAM ran through the tax options facing Burnham and Healey ahead of the Autumn Budget.", src: "https://www.cityam.com/budget-2026-which-taxes-will-burnham-and-healey-hike/", srcName: "CityAM" },
        { html: "<strong>Credit &mdash; Carlyle/CLO reset</strong>: Carlyle Global Credit priced a reset of one of its 2025-vintage European CLOs, with pricing on the triple-A notes widening slightly while spreads tightened across most of the rest of the capital stack.", src: "https://www.globalcapital.com/securitization/article/2gq700er0sxji8ohobym8/securitization/clos-europe/carlyle-resets-2025-clo-tightening-mezzanine-spreads", srcName: "GlobalCapital" },
        { html: "<strong>Legal &mdash; A&amp;O Shearman/ENERCON</strong>: A&amp;O Shearman advised ENERCON on a &euro;1bn syndicated guarantee facility refinancing its existing facility and expanding the lender consortium from ten to eleven banks.", src: "https://www.aoshearman.com/en/news/ao-shearman-advises-enercon-on-eur1-billion-syndicated-guarantee-facility", srcName: "A&O Shearman" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-25",
      time: "21:16 BST",
      lede: "US Treasury yields eased and consumer confidence hit a seven-month low as oil's retreat gave Bessent's buyback strategy room ahead of Wednesday's PCE print and Friday's Warsh Jackson Hole keynote, while sterling hovered near six-month highs and Burnham said he would lobby Trump for Ukraine's access to Patriot missiles; in credit, Blue Owl Finance priced a $750m note to pay down its credit line; and in legal, Clifford Chance's latest weekly regulatory digest rounds up banking developments for 17-21 August.",
      bullets: [
        { html: "<strong>Macro &mdash; Treasuries/Bessent</strong>: Treasury yields eased as a pullback in oil prices took pressure off the inflation outlook, giving Bessent's buyback-driven yield-suppression strategy some breathing room into Wednesday's core-PCE print and Friday's Jackson Hole keynote.", src: "https://www.bloomberg.com/news/articles/2026-08-25/treasuries-gain-as-oil-drop-eases-pressure-on-inflation-bessent", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; US consumer confidence</strong>: The Conference Board's index fell to a seven-month low of 89.4 (from a revised 90.2), with the expectations sub-index sliding to 68.2 as households turned more pessimistic on business conditions and jobs.", src: "https://www.bloomberg.com/news/articles/2026-08-25/us-consumer-confidence-falls-on-outlook-for-business-and-jobs", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; UK/sterling</strong>: The pound hovered near six-month highs against the dollar as investors awaited this week's US data cluster and Fed Chair Warsh's Friday keynote, while Burnham said he would press Trump for UK access to Patriot missiles for Ukraine.", src: "https://www.fxstreet.com/news/british-pound-hovers-near-six-month-highs-with-investors-awaiting-key-us-events-202608251135", srcName: "FXStreet" },
        { html: "<strong>Credit &mdash; Blue Owl Finance</strong>: Blue Owl Finance, a financing subsidiary of Blue Owl Capital, priced a $750m offering of 10-year senior notes (upsized from an initial ~$500m target) to repay borrowings under its revolving credit facility.", src: "https://www.bloomberg.com/news/articles/2026-08-11/blue-owl-sets-500-million-bond-sale-to-pay-down-credit-lines", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; Clifford Chance</strong>: Clifford Chance's weekly Alerter: Finance Industry digest rounds up banking and investment-banking regulatory developments across the UK, EU and other major markets for the week of 17-21 August.", src: "https://www.cliffordchance.com/content/dam/cliffordchance/briefings/2026/08/IRU-17-21-August-2026.pdf", srcName: "Clifford Chance" },
      ],
    },
  },
};
