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
      date: "2026-08-22",
      time: "09:19 BST",
      lede: "The US flash composite PMI held near a four-year high and bitcoin headed for its best week in roughly three years even as bond-market volatility stayed in focus and the 30-year Treasury yield sits near a 19-year high, while UK July inflation ran at 2.9% on the Ofgem price-cap rise; in legal, Macfarlanes advised Canaccord Wealth on its acquisition of EFG Harris Allday and Kirkland advised noteholders on Fantasia Holdings' US$6.8bn restructuring; and in credit, Crestline closed its second European Capital Solutions fund at $625m while Urban Partners drew &euro;200m from Danish pension funds for a new real-estate credit vehicle.",
      bullets: [
        { html: "<strong>Macro &mdash; US PMI/markets</strong>: The US flash Composite PMI held near a four-year high in August (Manufacturing 53.2, Services strength intact) even as major indices closed out a losing week on bond-market volatility, with bitcoin on track for its best week in roughly three years.", src: "https://www.cnbc.com/video/2026/08/21/sp-global-flash-manufacturing-pmi-comes-in-at-53-point-2-in-august.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK inflation</strong>: UK CPI accelerated to 2.9% year-on-year in July (from 2.6% in June), driven by the Ofgem energy price-cap rise, with a hotter-than-forecast core reading keeping a Bank of England hold at the 17 September MPC the base case.", src: "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/july2026", srcName: "Office for National Statistics" },
        { html: "<strong>Legal &mdash; Macfarlanes/Canaccord</strong>: Macfarlanes advised Canaccord Wealth on its acquisition of the front-office teams and client assets of EFG Harris Allday, a Midlands-focused UK wealth manager with roughly &pound;3.1bn of client assets, from EFG International.", src: "https://www.macfarlanes.com/insights/102nqle/macfarlanes-advises-canaccord-wealth-on-acquisition-of-efg-harris-allday/", srcName: "Macfarlanes" },
        { html: "<strong>Legal &mdash; Kirkland/Fantasia</strong>: Kirkland advised an ad hoc group of offshore noteholders on Fantasia Holdings' US$6.8bn restructuring via parallel Hong Kong and Cayman Islands schemes of arrangement, approved by 99.67% of voting creditors by value.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advises-noteholders-on-fantasia-holdings-successful-us6-8-billion-restructuring", srcName: "Kirkland & Ellis" },
        { html: "<strong>Credit &mdash; Crestline/Urban Partners</strong>: Crestline closed its second European Capital Solutions fund at $625m (nearly 75% larger than its debut vehicle), while Urban Partners drew a &euro;200m first close from Danish pension funds Industriens and L&aelig;gernes for a new Nordic/German real-estate credit vehicle.", src: "https://alternativecreditinvestor.com/2026/08/20/crestline-records-strong-demand-for-second-european-fund/", srcName: "Alternative Credit Investor" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-22",
      time: "12:20 BST",
      lede: "Iran calls Washington's incoming sanctions package an assertion of 'extraterritorial sovereignty' as markets eye a heavy week ahead of PCE, Nvidia earnings and Jackson Hole; in legal, Freshfields advised Mobico on a proposed roughly &pound;102m sale of its West Midlands bus business to the West Midlands Combined Authority while Clifford Chance advised lenders on a roughly $1.7bn Taiwan offshore-wind financing; and in credit, Sona Asset Management is preparing to launch a &euro;400m European CLO (Sona Aclai CLO I DAC).",
      bullets: [
        { html: "<strong>Macro &mdash; Iran sanctions</strong>: Iran's foreign ministry called Washington's incoming sanctions package an assertion of 'extraterritorial sovereignty', days ahead of Treasury Secretary Bessent's Monday press conference detailing the coordinated economic-isolation campaign.", src: "https://www.cnbc.com/2026/08/22/iran-criticizes-us-sanctions-extraterritorial-sovereignty.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; week ahead</strong>: July core PCE and Nvidia's Q2 earnings both land 26 August, ahead of Fed Chair Kevin Warsh's Jackson Hole keynote on 28 August &mdash; the week's three key catalysts for rates and risk assets.", src: "https://www.cnbc.com/2026/08/21/stock-market-next-week-outlook-for-aug-24-28-2026.html", srcName: "CNBC" },
        { html: "<strong>Legal &mdash; Freshfields/Mobico</strong>: Freshfields advised Mobico Group on an agreed-in-principle sale of its West Midlands bus business (&pound;24m upfront plus &pound;5.5m deferred, valued at roughly &pound;102m before liability transfers) to the West Midlands Combined Authority, with completion expected in November 2026.", src: "https://www.freshfields.com/en/our-thinking/news/news-search/2026/08/freshfields-advises-mobico-on-proposed-sale-of-uk-bus-to-the-west-midlands-combined-authority", srcName: "Freshfields" },
        { html: "<strong>Legal &mdash; Clifford Chance/Hai Long</strong>: Clifford Chance advised lenders and export credit agencies on roughly NT$55bn (~US$1.7bn) of incremental financing for the ~1GW Hai Long offshore wind project in Taiwan, backed by 35 lenders including the National Credit Guarantee Administration.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-on-the-incremental-financing-of-hai-long-offshore-wind-project-in-taiwan.html", srcName: "Clifford Chance" },
        { html: "<strong>Credit &mdash; Sona/CLO</strong>: Sona Asset Management is preparing to launch Sona Aclai CLO I DAC, a &euro;400m multicurrency European CLO spanning 97 corporate obligors, per a preliminary KBRA rating announcement.", src: "https://alternativecreditinvestor.com/2026/08/21/sona-prepares-to-launch-e400m-european-clo/", srcName: "Alternative Credit Investor" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-22",
      time: "21:21 BST",
      lede: "China's Iranian crude imports were squeezed further by the US blockade around the Strait of Hormuz even as Treasury Secretary Bessent's bond-buyback rally faded and longer-dated yields resumed climbing, with a Reuters poll now showing economists expect the Bank of England to hold rates for the rest of the year; in credit, Sona Asset Management is preparing to launch a &euro;400m European CLO and Franklin Templeton closed its inaugural $1.5bn collateralised fund obligation; and in legal, the Court of Appeal gave further case-management directions in Sucden Financial v TMT Metals, with Macfarlanes acting for Sucden.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran/oil</strong>: China's Iranian oil imports fell to roughly 534,000 barrels a day in August as the US blockade around the Strait of Hormuz continues to squeeze Chinese refiners, keeping the oil-supply risk premium elevated ahead of Monday's US sanctions announcement.", src: "https://www.bloomberg.com/news/articles/2026-08-21/iranian-oil-supply-to-chinese-refiners-squeezed-by-us-blockade", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Treasury/Fed</strong>: Longer-dated Treasury yields resumed climbing as the relief from Treasury Secretary Bessent's expanded bond-buyback programme proved short-lived, with strategists warning the intervention does little to address the underlying deficit or term premium just as Fed Chair Kevin Warsh heads into his first Jackson Hole keynote on 28 August.", src: "https://www.cnbc.com/2026/08/21/treasury-yields-bonds-inflation-rates.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; BoE outlook</strong>: A Reuters poll of 64 economists found nearly 90% expect the Bank of England to hold its Bank Rate at 3.75% for the rest of 2026 despite upside inflation risks, ahead of the next MPC decision on 17 September.", src: "https://whbl.com/2026/08/18/bank-of-england-to-hold-rates-for-remainder-of-year-despite-inflation-risks-reuters-poll/", srcName: "Reuters (via WHBL)" },
        { html: "<strong>Credit &mdash; Sona/Franklin Templeton</strong>: Sona Asset Management is preparing to launch Sona Aclai CLO I DAC, a &euro;400m multicurrency European CLO spanning 97 corporate obligors, while Franklin Templeton closed its inaugural $1.5bn collateralised fund obligation spanning Lexington Partners secondaries and Benefit Street Partners US middle-market direct lending.", src: "https://alternativecreditinvestor.com/2026/08/21/sona-prepares-to-launch-e400m-european-clo/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Sucden/Macfarlanes</strong>: The Court of Appeal (Sir Geoffrey Vos MR, Laing and Foxton LJJ) gave further case-management directions in Sucden Financial's continuing fraud claim against TMT Metals and Prateek Gupta over an alleged nickel-cargo margin-debt shortfall exceeding $6.6m, with Macfarlanes acting for Sucden throughout.", src: "https://caselaw.nationalarchives.gov.uk/ewca/civ/2026/1080", srcName: "National Archives" },
      ],
    },
  },
};
