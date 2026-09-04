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
      date: "2026-09-03",
      time: "21:23 BST",
      lede: "Fed Governor Waller's CPI-contingent hold remarks kept pulling hike odds lower into the evening (CME FedWatch ~54.6%, down from ~66% Wednesday) as Broadcom's post-earnings slide underlined the market's narrow-leadership nerves; on the credit desk the Benetton family's Edizione launched 21 Next, a &euro;3bn pan-European platform with private-debt exposure via the Tages Credit Fund, while IFM Investors opened a Singapore office to grow its Asia diversified-credit book and Bloomberg's Nishant Kumar reported Jain Global made $1.8bn in trading profit before pivoting to run Millennium's capital exclusively; Herbert Smith Freehills Kramer advised Bodycote plc on its &pound;1.84bn recommended takeover by Veritas Capital.",
      bullets: [
        { html: "<strong>Macro &mdash; Waller's dovish CPI-contingent tone pulls hike odds to ~54.6%</strong>: Fed Governor Christopher Waller said his 15&ndash;16 September rate call is &ldquo;heavily influenced&rdquo; by the 11 September CPI report and he would back a hold if disinflation continues &mdash; the least-hawkish framing from any FOMC voter since Jackson Hole &mdash; pulling CME FedWatch-implied hike odds down roughly 12 points to ~54.6% (45.4% hold), from ~66% on Wednesday.", src: "https://www.bloomberg.com/news/articles/2026-09-03/fed-s-waller-says-september-rate-decision-hinges-on-august-cpi", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Broadcom falls despite Q3 beat as Q4 guide undershoots</strong>: Broadcom fell in premarket/midday trading despite beating on both lines (revenue $29.59bn, adjusted EPS $3.32) after its ~$34.8bn fiscal Q4 revenue guide missed the $35.03bn consensus &mdash; the market again judging an AI-capex bellwether on the size of the raise rather than the beat, even as the S&amp;P 500 and Nasdaq rallied on falling Treasury yields.", src: "https://www.fool.com/coverage/stock-market-today/2026/09/03/stock-market-midday-sept-3-stocks-rally-as-treasury-yields-fall-broadcom-falls-despite-earnings-beat/", srcName: "The Motley Fool" },
        { html: "<strong>Credit &mdash; Benetton family's Edizione launches 21 Next with &euro;3bn AUM</strong>: Edizione completed the launch of 21 Next, merging 21 Invest and Tages Capital into a pan-European platform spanning private equity, energy transition, infrastructure and private debt, with &euro;500m of seed capital and a target of &euro;10bn+ AUM by 2030; its private-debt exposure runs through the &euro;145m Tages Credit Fund financing Italian mid-sized companies.", src: "https://alternativecreditinvestor.com/2026/09/03/benetton-backed-21-next-launches-with-e3bn-aum/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Jain Global made $1.8bn in trading profit before pivoting to run Millennium's capital exclusively</strong>: Bobby Jain's Jain Global generated roughly $1.8bn in gross trading profit over its first two years managing outside capital before an April 2026 deal replaced more than $5bn of that money with capital from his former employer Millennium Management, per Bloomberg's Nishant Kumar.", src: "https://www.bloomberg.com/news/articles/2026-09-01/jain-s-hedge-fund-made-1-8-billion-as-millennium-cash-rolls-in", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; HSF Kramer advises Bodycote plc on &pound;1.84bn Veritas Capital takeover</strong>: Herbert Smith Freehills Kramer advised the FTSE 250 heat-treatment and metal-coatings group on its recommended &pound;1.84bn takeover by US private equity sponsor Veritas Capital at 940p/share in cash, after Veritas prevailed over rival bidder CVC in a competitive process.", src: "https://legaldesire.com/herbert-smith-freehills-kramer-advises-bodycote-plc-on-its-1-84-billion-takeover-by-veritas-capital", srcName: "Herbert Smith Freehills Kramer (via Legal Desire)" },
      ],
    },
  },
};
