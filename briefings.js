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
      date: "2026-08-04",
      time: "09:23 BST",
      lede: "BP&rsquo;s profit more than doubled and HSBC posted a $10.1bn quarterly profit while resuming share buybacks as both reported this morning, Amazon topped a $3tn market cap for the first time on its post-earnings rally, Travers Smith and Latham &amp; Watkins published fresh UK finance and corporate updates, and Friday&rsquo;s US nonfarm payrolls report remains the week&rsquo;s key data point.",
      bullets: [
        { html: "<strong>BP</strong>: underlying replacement-cost profit more than doubled year-on-year as Middle East-conflict-driven oil prices lifted results, even as President Trump accused major oil companies of profiteering from the crisis.", src: "https://www.cnbc.com/2026/08/04/bp-2q-earnings-oil-iran-war.html", srcName: "CNBC" },
        { html: "<strong>HSBC</strong>: quarterly pre-tax profit rose to $10.1bn, beating estimates, prompting the bank to resume share buybacks on continued strength in its Asian and wealth-management franchises.", src: "https://www.ft.com/content/0da95788-cde6-4e1a-af89-1faced91178e", srcName: "Financial Times" },
        { html: "<strong>Markets</strong>: Amazon joined the small club of $3tn-plus companies for the first time, extending its post-earnings rally on an AWS/cloud beat.", src: "https://www.bloomberg.com/news/articles/2026-08-03/amazon-joins-elite-list-of-stocks-to-top-3-trillion-in-value", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; banking</strong>: Travers Smith finance partner Ryan Ayrton argued in IFLR that defence-sector financing is converging with established infrastructure-lending practice as lenders treat defence assets as strategic infrastructure.", src: "https://www.traverssmith.com/knowledge/knowledge-container/from-niche-to-necessity-financing-defence-as-strategic-infrastructure/", srcName: "Travers Smith" },
        { html: "<strong>Week ahead</strong>: US and UK services PMIs land Wednesday, ahead of Friday&rsquo;s US nonfarm payrolls report, with US CPI following on 12 August.", src: "https://www.bls.gov/schedule/news_release/empsit.htm", srcName: "BLS" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-04",
      time: "12:19 BST",
      lede: "Trump called the Iran talks the region&rsquo;s &ldquo;last chance&rdquo; to end the war as oil ticked up and US stocks held near record highs, HSBC&rsquo;s profit beat drove London higher even as AstraZeneca kept dragging on the FTSE, Barings reset a private-credit CLO into a reinvesting structure while HPS priced tighter on its latest Aqueduct deal, Weil advised Brookfield on completing full ownership of Oaktree Capital Management, and the English court sanctioned Deutsche Glasfaser&rsquo;s &euro;7bn Part 26 restructuring plan.",
      bullets: [
        { html: "<strong>Iran</strong>: Trump warned the current round of talks is Iran&rsquo;s &ldquo;last chance&rdquo; to end the war as Tehran denied negotiations were under way, with oil prices rising on the renewed uncertainty even as US equities held near record highs.", src: "https://www.cnbc.com/2026/08/04/us-iran-war-trump-hormuz.html", srcName: "CNBC" },
        { html: "<strong>UK markets</strong>: London stocks opened higher as miners offset a renewed slide in AstraZeneca, with HSBC&rsquo;s profit beat and $1bn buyback helping sentiment even as the pharma group stayed under pressure on Bristol Myers Squibb tie-up reports.", src: "https://www.proactiveinvestors.co.uk/companies/news/1096469/ftse-100-live-london-stocks-open-higher-as-miners-offset-hsbc-slide-1096469.html", srcName: "Proactive Investors" },
        { html: "<strong>CLOs</strong>: Barings reset one of its static European private-credit CLOs into a reinvesting structure, adding a new sterling tranche and tightening pricing across most of the capital stack, while HPS priced its latest Aqueduct new-issue euro CLO tighter than its prior deal.", src: "https://www.globalcapital.com/securitization/article/2gpqxqd15vvpyrj8ruubk/securitization/clos-europe/barings-converts-static-private-credit-clo-to-reinvesting-deal-in-reset", srcName: "GlobalCapital" },
        { html: "<strong>Legal &mdash; corporate/funds</strong>: Weil advised Brookfield Asset Management on completing its roughly $3bn acquisition of the ~26% of Oaktree Capital Management it did not already own, giving Brookfield full ownership and expanding its global credit platform to c.$365bn.", src: "https://www.weil.com/articles/weil-advises-brookfield-in-the-completion-of-its-acquisition-of-oaktree", srcName: "Weil" },
        { html: "<strong>Legal &mdash; restructuring</strong>: the High Court sanctioned Deutsche Glasfaser&rsquo;s single-class Part 26 scheme of arrangement, bifurcating &euro;7bn of senior debt and adding a &euro;400m super-senior facility plus &euro;845m of new equity from EQT/OMERS affiliates &mdash; Freshfields acted for the company, Linklaters for the lender syndicate.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/1563", srcName: "National Archives (Case Law)" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-04",
      time: "17:33 BST",
      lede: "US stocks pushed back toward record highs on renewed US-Iran optimism and a tech rally while London's mid-cap FTSE 250 hit its own record, topping its 2021 peak, on strong HSBC and BP earnings and a mining rally even as AstraZeneca kept capping the FTSE 100, BP's underlying profit rose 78% quarter-on-quarter as new CEO Meg O'Neill unveiled roughly 700 job cuts and an $8-9bn divestment plan, Manulife | Comvest Credit Partners closed the largest fundraise in its history at $5.4bn, and Ropes &amp; Gray advised Lantheus Holdings on an up-to-$8bn take-private by Curium.",
      bullets: [
        { html: "<strong>Markets</strong>: the Nasdaq, Dow and S&amp;P 500 traded near record highs on renewed US-Iran de-escalation optimism and a broad tech rally, with the US JOLTs report the next data point in focus.", src: "https://finance.yahoo.com/markets/live/stock-market-today-tuesday-august-4-dow-sp-500-nasdaq-100140227.html", srcName: "Yahoo Finance" },
        { html: "<strong>UK</strong>: the mid-cap FTSE 250 closed at a fresh record, topping its 2021 peak, as strong HSBC and BP earnings and a mining-sector rally (Antofagasta, Anglo American, Rio Tinto all +2%+) lifted London sentiment even as the FTSE 100's advance stayed capped by AstraZeneca's continuing merger-talk slide.", src: "https://www.marketscreener.com/news/britain-s-ftse-250-index-hits-record-high-topping-2021-peak-ce7f50deda80f525", srcName: "MarketScreener" },
        { html: "<strong>BP</strong>: underlying replacement-cost profit rose 78% quarter-on-quarter to $5.7bn (more than doubling year-on-year) as new CEO Meg O'Neill unveiled plans to cut roughly 700 jobs and raise $8-9bn from divestments, including about $6bn from Castrol; shares fell as much as 4.4% intraday as Brent's pullback toward $80 offset the beat.", src: "https://www.bp.com/press-and-publications/press-releases/second-quarter-2026-results", srcName: "BP" },
        { html: "<strong>Private credit</strong>: Manulife | Comvest Credit Partners closed Comvest Credit Partners VII at $5.4bn &mdash; the largest fundraise in the platform's history &mdash; while Blackstone closed its flagship opportunistic credit fund COF V oversubscribed at its hard cap above $10bn, its largest opportunistic-credit vehicle to date.", src: "https://alternativecreditinvestor.com/2026/08/03/manulife-comvest-credit-partners-raises-5-4bn-for-largest-direct-lending-fund/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; corporate</strong>: Ropes &amp; Gray advised Lantheus Holdings on a take-private merger agreement with Curium valued at up to roughly $8bn ($102.50/share cash plus contingent value rights of up to $12.00/share), while Freshfields advised Sonae Sierra on a &euro;1.5bn joint venture with Norges Bank Investment Management to acquire eight Spanish shopping centres.", src: "https://www.ropesgray.com/en/news-and-events/news/2026/08/ropes-gray-advised-lantheus-holdings-in-take-private-merger-agreement-with-curium", srcName: "Ropes &amp; Gray" },
      ],
    },
  },
};
