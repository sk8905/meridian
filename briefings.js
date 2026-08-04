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
      date: "2026-08-03",
      time: "21:27 BST",
      lede: "Wall Street closed at a record as Trump's cancelled Iran strikes and the coordinated US-Japan yen intervention drove a broad risk-on session and US manufacturing expanded for a seventh straight month, AstraZeneca extended its slide on Bristol Myers Squibb tie-up reports to drag the FTSE 100 lower, Brookfield completed full ownership of Oaktree Capital Management, and Freshfields advised IG Group Holdings on a $1.3bn acquisition of prediction-markets operator Underdog Holdings.",
      bullets: [
        { html: "<strong>Markets</strong>: the Dow closed at a record 53,178.41 (+693.38, +1.32%), the S&amp;P 500 gained 1.48% to 7,600.50 and the Nasdaq jumped 2.13%, with Meta up 6% and Amazon topping a $3tn market cap, as oil's slide on Trump's cancelled Iran strikes drove the risk-on session.", src: "https://qz.com/dow-700-points-trump-iran-strikes-oil-prices-080326", srcName: "Quartz" },
        { html: "<strong>ISM</strong>: US manufacturing activity expanded for a seventh straight month &mdash; the headline index rose 2.3 points to 55.6%, its highest since May 2022, with New Orders up to 56.7% and Employment improving to 52.8% from 49.7%, beating the ~54% consensus.", src: "https://www.prnewswire.com/news-releases/manufacturing-pmi-at-55-6-july-2026-ism-manufacturing-pmi-report-302840669.html", srcName: "PR Newswire / ISM" },
        { html: "<strong>UK &amp; M&amp;A</strong>: the FTSE 100 closed down 0.1% at 10,857.70 &mdash; a third straight losing session &mdash; as AstraZeneca slumped 9.0% on a cautious reaction to reported $400bn tie-up talks with Bristol Myers Squibb, even as the mid-cap FTSE 250 rose almost 1%.", src: "https://www.marketscreener.com/news/ftse-100-slips-as-astrazeneca-drops-on-bristol-myers-merger-talks-ce7f50d9d989f024", srcName: "MarketScreener" },
        { html: "<strong>Private credit</strong>: Brookfield completed its roughly $3bn acquisition of the ~26% of Oaktree Capital Management it did not already own, taking full ownership and folding Oaktree into Brookfield's global credit platform (now $365bn combined) &mdash; the next step in a partnership dating to 2019.", src: "https://www.globenewswire.com/news-release/2026/08/03/3337342/0/en/Brookfield-Completes-Acquisition-of-Oaktree.html", srcName: "GlobeNewswire" },
        { html: "<strong>Legal &mdash; corporate</strong>: Freshfields advised IG Group Holdings on its agreed $1.3bn acquisition of Underdog Holdings, a US daily fantasy sports and prediction-markets operator, structured as $1.1bn upfront plus a $200m earnout and following IG's March 2026 strategic review.", src: "https://www.freshfields.com/en/our-thinking/news/news-search/2026/08/freshfields-advises-ig-group-holdings-plc-on-its-$1.3bn-acquisition-of-underdog-holdings-inc", srcName: "Freshfields" },
      ],
    },
  },
};
