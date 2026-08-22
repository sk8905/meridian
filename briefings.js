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
      date: "2026-08-21",
      time: "12:31 BST",
      lede: "Treasury Secretary Bessent pledges the 'toughest sanctions in history' on Iran as futures drift higher and gold breaks $4,525 on dollar weakness, while UK retail sales soften in July even as the flash composite PMI beats expectations; in credit, PGIM commits to a roughly $3bn three-year forward-flow facility with home-improvement lender GreenSky; and in legal, Sidley is representing Ridgeview Partners on its proposed &pound;545m scheme-of-arrangement acquisition of Pinewood Technologies, while Weil advised Foundever on a recapitalisation cutting its debt by nearly $900m.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran sanctions</strong>: Bessent vowed the 'toughest sanctions in history' on Iran and warned allies against providing it any economic lifeline, as US futures drifted higher despite persistent Treasury-yield pressure.", src: "https://www.cnbc.com/video/2026/08/21/bessent-vows-atoughest-sanctions-in-historya-on-iran-warns-allies.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; gold/dollar</strong>: Gold broke above $4,525/oz with bulls eyeing $4,625 as the dollar continued to slide, extending this week's debasement-trade narrative around the Treasury's bond-buyback intervention.", src: "https://www.fxleaders.com/news/2026/08/21/gold-breaks-4525-xau-usd-bulls-eye-4625-dollar-slides/", srcName: "FX Leaders" },
        { html: "<strong>Macro &mdash; UK retail/PMI</strong>: UK retail sales softened in July after June's World Cup-driven boost, per ONS data, even as the flash composite PMI beat expectations and business activity strengthened &mdash; a mixed picture that left the FTSE 100 higher on a metals rally.", src: "https://www.ons.gov.uk/releases/retailsalesgreatbritainjuly2026", srcName: "ONS" },
        { html: "<strong>Credit &mdash; PGIM/GreenSky</strong>: PGIM committed to a roughly $3bn, three-year forward-flow facility with home-improvement lender GreenSky, growing its asset-based-finance pool as ABF forward-flow deals continue to proliferate.", src: "https://alternativecreditinvestor.com/2026/08/20/pgim-grows-abf-pool/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Ridgeview/Pinewood</strong>: Sidley is representing Ridgeview Partners on its proposed &pound;545m recommended acquisition of London-listed Pinewood Technologies via a court-sanctioned Part 26 scheme of arrangement, a 43% premium to Pinewood's pre-announcement close.", src: "https://www.sidley.com/en/newslanding/newsannouncements/2026/08/sidley-represents-ridgeview-partners-in-its-proposed-545-million-acquisition", srcName: "Sidley" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-21",
      time: "21:25 BST",
      lede: "US flash composite PMI hit a four-year high as Services jumped to 56.8 (vs 54.0 expected) and equities extended their rebound with bitcoin near a three-year best week, while the UK's own flash Services PMI strengthened to a 6-month high (52.8, from 52.1) even as ONS data showed a surprise &pound;1.8bn July public-sector deficit alongside softer retail sales, a fresh headache for the Autumn Budget; in credit, Guggenheim Investments launched an actively managed Investment Grade CLO ETF; and in legal, the Supreme Court ruled in Drelle v Servis-Terminal that an unrecognised foreign money judgment can found an English bankruptcy petition, while Clifford Chance racked up advisory mandates on easyJet's &pound;5.7bn Apollo takeover and a &euro;500m Webuild financing.",
      bullets: [
        { html: "<strong>Macro &mdash; US PMI</strong>: The US flash S&amp;P Global Composite PMI hit a four-year high in August, with Services jumping to 56.8 (vs 54.0 expected, the fastest pace since December 2024) even as Manufacturing eased to 53.2; equities extended their stabilisation and bitcoin logged its best week in roughly three years.", src: "https://www.tradingview.com/news/reuters.com,2026:newsml_L6N44I0UZ:0-it-s-the-flash-us-composite-pmi-hits-four-year-high/", srcName: "Reuters (via TradingView)" },
        { html: "<strong>Macro &mdash; UK deficit</strong>: ONS data showed a surprise &pound;1.8bn July public-sector deficit &mdash; against an expected balance and more than &pound;2bn above the OBR's forecast &mdash; landing alongside a July retail-sales fall and complicating Chancellor Healey's run-up to the 28 October Autumn Budget, even as the flash UK Services PMI strengthened to a 6-month high of 52.8 (from 52.1, vs 51.8 expected).", src: "https://www.bloomberg.com/news/newsletters/2026-08-21/uk-posts-deficit-retail-sales-fall-ahead-of-labour-autumn-budget", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Guggenheim CLO ETF</strong>: Guggenheim Investments expanded its active ETF platform with the launch of the Guggenheim Investment Grade CLO ETF (NYSE: GCLO), which invests across the CLO capital structure from AAA to equity tranches.", src: "https://www.globenewswire.com/news-release/2026/08/20/3348515/16530/en/guggenheim-investments-expands-active-etf-platform-with-launch-of-two-new-etfs.html", srcName: "GlobeNewswire" },
        { html: "<strong>Legal &mdash; Supreme Court</strong>: In Drelle v Servis-Terminal LLC, the Supreme Court unanimously held that an unrecognised, unregistrable foreign money judgment (a RUB 2bn Russian judgment) can found an English bankruptcy petition, reversing the Court of Appeal and widening the route open to creditors pursuing debtors from non-reciprocal jurisdictions.", src: "https://caselaw.nationalarchives.gov.uk/uksc/2026/29", srcName: "National Archives (UKSC)" },
        { html: "<strong>Legal &mdash; easyJet/Apollo</strong>: Clifford Chance advised easyJet on the recommended &pound;5.7bn takeover offer from Apollo-managed funds, structured by way of a Part 26 scheme of arrangement.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-easyjet-on-the-recommended-p5-7-billion-takeover.html", srcName: "Clifford Chance" },
      ],
    },
  },
};
