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
      date: "2026-09-04",
      time: "09:20 BST",
      lede: "Oil headed for its biggest weekly gain since July on renewed US-Iran hostilities near the Strait of Hormuz, even as the dollar held near its lowest since May and Asian equities tracked Wall Street higher after Fed Governor Waller signalled he would back a hold if disinflation continues, with Friday's US payrolls the next test; on the credit desk Blackstone again capped BCRED redemptions after 10% of investors sought to exit and Balyasny hired a natural-gas trader from DRW, while Ropes & Gray warned asset managers of AI-enabled phishing campaigns.",
      bullets: [
        { html: "<strong>Macro &mdash; Oil on track for biggest weekly gain since July on Hormuz risk</strong>: Crude headed for its largest weekly advance since July as renewed US-Iran hostilities heightened concern about prolonged disruption to energy flows through the Strait of Hormuz, with WTI up more than 9% on the week.", src: "https://www.bloomberg.com/news/articles/2026-09-03/latest-oil-market-news-and-analysis-for-sept-4", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Asian stocks track Wall Street higher as Fed hike bets ease</strong>: Equity-index futures for Japan, South Korea and Australia pointed higher and the dollar held near its lowest since May after Fed Governor Waller said he would support keeping rates steady if price pressures keep easing, with the 2-year Treasury yield easing 3bp to 4.34%.", src: "https://www.bloomberg.com/news/articles/2026-09-03/stock-market-today-dow-s-p-live-updates", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Blackstone's BCRED caps redemptions again after 10% seek to exit</strong>: Blackstone again limited redemptions from its $77bn flagship Blackstone Private Credit Fund, allowing only 5% of shares out after investors sought to pull 10% &mdash; an early glimpse of the lasting quarterly withdrawal pressure facing the roughly $1.8tn-$3tn private-credit market.", src: "https://www.bloomberg.com/news/articles/2026-09-03/blackstone-s-bcred-caps-redemptions-again-after-10-seek-to-exit", srcName: "Bloomberg" },
        { html: "<strong>Hedge funds &mdash; Balyasny hires natural-gas trader Sayan Palchowdhury from DRW</strong>: Balyasny Asset Management hired Palchowdhury to its New York office as hedge funds intensify the search for gas traders ahead of a potentially volatile European winter.", src: "https://www.hedgeweek.com/hedge-funds-step-up-hiring-of-natural-gas-traders/", srcName: "Hedgeweek" },
        { html: "<strong>Legal &mdash; Ropes &amp; Gray warns asset managers of AI-enabled phishing threats</strong>: The firm flagged coordinated intrusion campaigns against hedge funds and asset managers combining synthetic voice replicas of executives with adversary-in-the-middle credential-harvesting proxies, made cheaper and easier by commercially available generative-AI and voice-synthesis tools.", src: "https://www.ropesgray.com/en/insights/viewpoints/2026/09/102o04o/dont-take-the-bait-the-new-phishing-threats-to-asset-managers", srcName: "Ropes & Gray" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-04",
      time: "12:32 BST",
      lede: "The dollar slumped to start September as the yen extended its surge on fresh Bank of Japan rate-hike bets and Britain's services PMI hit a four-month high, with Friday's US payrolls (seen +53,000) the next test of Fed Governor Waller's CPI-contingent rate-hold framing ahead of the 16 September FOMC; on the credit desk Macquarie Asset Management priced its first European CLO since acquiring Spire Partners, a &euro;400m deal dubbed Aurium XVI.",
      bullets: [
        { html: "<strong>Macro &mdash; Dollar slumps as yen surges on fresh BoJ rate-hike bets</strong>: The dollar fell broadly to start September as the yen extended its rally on rising odds of another Bank of Japan hike, leaving Friday's US payrolls report as the next test of the diverging rate paths.", src: "https://www.bloomberg.com/news/articles/2026-09-04/us-dollar-slumps-to-start-september-as-yen-surges-on-rate-bets", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; UK services activity hits a four-month high</strong>: Britain's services PMI climbed to its strongest reading in four months in August, even as Reuters reported cost pressures intensifying &mdash; keeping a November/December Bank Rate hike in play ahead of Chancellor Healey's 28 October Budget.", src: "https://english.news.cn/europe/20260904/0198482770084ee28528946bd5c840d0/c.html", srcName: "Xinhua" },
        { html: "<strong>Macro &mdash; August payrolls seen rising 53,000 as the Fed weighs a CPI-contingent hold</strong>: Economists project Friday's August jobs report will show payrolls up 53,000, the next major data test before the 16 September FOMC after Governor Waller said his rate call hinges on the 11 September CPI print.", src: "https://www.cnbc.com/2026/09/03/august-2026-jobs-report-payrolls.html", srcName: "CNBC" },
        { html: "<strong>Credit &mdash; Macquarie prices &euro;400m European CLO, Aurium XVI</strong>: Macquarie Asset Management priced its first CLO from its European platform since acquiring London-based manager Spire Partners in July 2026, a &euro;400m deal arranged by Natixis, taking Macquarie's global CLO book to roughly &euro;7bn.", src: "https://alternativecreditinvestor.com/2026/09/04/macquarie-prices-e400m-european-clo/", srcName: "Alternative Credit Investor" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-04",
      time: "17:16 BST",
      lede: "August nonfarm payrolls jumped 162,000 &mdash; roughly triple the ~53-58,000 consensus, with unemployment holding at 4.1% &mdash; reopening the September rate-hike debate a day after Fed Governor Waller's conditional dovish framing; the Dow fell roughly 300 points and President Trump renewed pressure on Chair Warsh to cut rates, threatening to end trade with surplus countries. On the legal desk four Chancery/Commercial Court judgments landed today, including a sanctions/insolvency ruling on Petropavlovsk's liquidation and a Quincecare-duty claim against Barclays allowed to proceed to trial; on the credit desk Macquarie priced its first European CLO since acquiring Spire Partners.",
      bullets: [
        { html: "<strong>Macro &mdash; August payrolls smash consensus at +162,000, reopening the September hike debate</strong>: Nonfarm payrolls rose 162,000 in August &mdash; roughly triple the ~53-58,000 consensus &mdash; while unemployment held at 4.1%, a sharp upside surprise a day after Governor Waller's conditional dovish framing; the Dow fell roughly 300 points and the 2-year Treasury yield hit its highest since January 2025.", src: "https://www.cnbc.com/2026/09/04/jobs-report-august-2026.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Trump renews pressure on Warsh to cut rates, threatens trade cutoff</strong>: President Trump told the Fed to slash rates or he would end trade with countries running trade surpluses with the US, escalating his rate-policy pressure campaign hours after the stronger-than-expected payrolls print.", src: "https://www.cnbc.com/2026/09/04/trump-fed-rates-jobs-trade.html", srcName: "CNBC" },
        { html: "<strong>Legal &mdash; Quincecare claim against Barclays allowed to proceed to trial</strong>: The Business and Property Courts in Liverpool dismissed Barclays' strike-out application in a Ponzi-scheme liquidator's claim alleging dishonest assistance and breach of the Quincecare duty over transfers executed without proper director authority.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2266", srcName: "National Archives (BAILII)" },
        { html: "<strong>Legal &mdash; Sanctions/insolvency ruling clears Petropavlovsk liquidators' consent to Atlas JSC assignment</strong>: The Insolvency and Companies List held that rights assigned from sanctioned entity Atlas JSC to a Dubai buyer were an &lsquo;economic resource&rsquo; rather than a &lsquo;fund&rsquo; under the Russia sanctions regime, so the liquidators' consent would not unlawfully deal with sanctioned assets.", src: "https://www.bailii.org/ew/cases/EWHC/Ch/2026/2287.html", srcName: "BAILII" },
        { html: "<strong>Credit &mdash; Macquarie prices &euro;400m European CLO, Aurium XVI</strong>: Macquarie Asset Management priced Aurium XVI, its first European CLO since acquiring London-based manager Spire Partners in July 2026, arranged by Natixis and taking its global CLO book to roughly &euro;7bn.", src: "https://alternativecreditinvestor.com/2026/09/04/macquarie-prices-e400m-european-clo/", srcName: "Alternative Credit Investor" },
      ],
    },
  },
};
