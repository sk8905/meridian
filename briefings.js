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
      time: "17:27 BST",
      lede: "Canada struck back with retaliatory tariffs on US goods as the trade war escalated, even as the S&amp;P 500 climbed into Nvidia earnings and the Fed's Jackson Hole symposium and the FTSE's mid-caps outpaced blue chips on a housebuilder rally; in credit, Carlyle's credit arm backed Circuit of the Americas' theme-park and resort expansion while Partners Group exited its Gong cha stake; and in legal, Slaughter and May's newest alert covers its advice to INEOS Inovyn on acquiring the UK's only ethylene dichloride asset out of administration.",
      bullets: [
        { html: "<strong>Macro &mdash; Canada/US trade war</strong>: Canada announced retaliatory tariffs on roughly $27.6bn of US goods, escalating the trade dispute after Ottawa said it was 'not waiting by the phone' for a deal with Washington.", src: "https://www.mprnews.org/story/2026/08/25/canada-strikes-back-at-us-with-retaliatory-tariffs-as-trade-war-escalates", srcName: "AP via MPR News" },
        { html: "<strong>Macro &mdash; US markets</strong>: The S&amp;P 500 climbed ahead of Nvidia's earnings and the Fed's Jackson Hole symposium, with investors weighing a fresh Truflation read pointing to a benign July core-PCE print.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-aug-25-2026", srcName: "TheStreet" },
        { html: "<strong>Macro &mdash; UK markets</strong>: FTSE 100 mid-caps outpaced blue chips as housebuilders and industrials rallied, with Vistry shares surging on Burnham council housing-funding plans.", src: "https://www.cityam.com/vistry-shares-soar-on-burnham-council-housing-plans/", srcName: "CityAM" },
        { html: "<strong>Credit &mdash; Carlyle/Circuit of the Americas</strong>: Carlyle's credit arm backed an expansion of Circuit of the Americas' theme-park and resort development tied to Red Bull Racing, while Partners Group separately exited its Gong cha private-credit position following Bain Capital's acquisition of the bubble-tea chain.", src: "https://www.alternativeswatch.com/2026/08/24/carlyle-credit-cota-expansion-red-bull-racing/", srcName: "AlternativesWatch" },
        { html: "<strong>Legal &mdash; Slaughter and May/INEOS Inovyn</strong>: Slaughter and May advised INEOS Inovyn on its acquisition of the UK's only ethylene dichloride asset, bought out of the administration of Vynova Runcorn.", src: "https://www.slaughterandmay.com/recent-work/ineos-inovyn-on-the-acquisition-of-the-uk-s-only-ethylene-dichloride-asset-from-administration/", srcName: "Slaughter and May" },
      ],
    },
  },
};
