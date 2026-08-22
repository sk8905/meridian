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
      time: "17:10 BST",
      lede: "Wall Street closed its worst week in over a month on bond-market volatility and rising oil prices even as Democratic lawmakers pressed new Fed Chair Kevin Warsh to disclose his calls with President Trump, while UK data showed employment declining as price pressures mount ahead of Chancellor Healey's 28 October Budget; in credit, Fortress priced its third European CLO at &euro;406m; and in legal, the High Court weighed a stay of proceedings testing a debt 'up-tiering' liability-management transaction in Cheyne European Special Situations Fund v TMF Trustee.",
      bullets: [
        { html: "<strong>Macro &mdash; US markets</strong>: Wall Street posted its worst week in over a month as Treasury-yield volatility and rising oil prices weighed on sentiment, even as the S&amp;P 500 and Russell 2000 jumped on Friday after a tumultuous week for Treasurys.", src: "https://www.investing.com/news/stock-market-news/us-stock-futures-steady-after-wall-st-slides-on-rising-treasury-yields-4870666", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Macro &mdash; Fed independence</strong>: Senate Democrats pressed Fed Chair Kevin Warsh to disclose the substance of his calls with President Trump, adding to scrutiny of central-bank independence just as Treasury Secretary Bessent's aggressive bond-buyback campaign blurs the line between fiscal and monetary policy ahead of Warsh's first Jackson Hole keynote on 28 August.", src: "https://www.bloomberg.com/news/articles/2026-08-20/democratic-lawmakers-urge-fed-s-warsh-to-disclose-trump-calls", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; UK</strong>: UK employment data showed a decline while price pressures continued to build, a mixed signal for the Bank of England ahead of its 17 September MPC decision and for Chancellor Healey as he heads into his first Autumn Budget on 28 October.", src: "https://www.bloomberg.com/news/articles/2026-08-22/world-economy-latest-uk-employment-declines-while-price-pressures-mount", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Fortress</strong>: Fortress Investment Group priced its third European CLO, the &euro;406m Fortress Credit Europe BSL 2026-3 DAC, backed by senior secured broadly-syndicated loans with reinvestment to April 2031 &mdash; its third since launching the European platform in November 2024.", src: "https://alternativecreditinvestor.com/2026/08/14/fortress-prices-third-european-clo-at-e406m/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Cheyne/TMF Trustee</strong>: The High Court (Mr Justice Leech) weighed a stay of English proceedings brought by funds holding &euro;71.3m of Hunkemöller senior secured notes who are challenging enforcement action taken after a debt 'up-tiering' transaction, pending parallel New York litigation on substantially the same issues &mdash; a live English test case on liability-management priming transactions.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2091", srcName: "National Archives" },
      ],
    },
  },
};
