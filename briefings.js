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
      date: "2026-09-05",
      time: "09:20 BST",
      lede: "Saturday morning's dominant thread is still Friday's blowout US payrolls (+162,000, unemployment steady at 4.1%), which reopened the September rate-hike debate, while UK retail investors piled into gilts this week after yields touched multi-decade highs; the credit desk's freshest deals remain Fortress's third European CLO and Golub Capital's European CLO platform build-out, and on the legal desk Kirkland advised Carlyle, Dynasty Equity and Sixth Street on their minority investments in the Seattle Seahawks.",
      bullets: [
        { html: "<strong>Macro &mdash; August payrolls beat triples consensus, unemployment holds at 4.1%</strong>: The US economy added 162,000 jobs in August, roughly triple consensus, keeping the 16 September Fed decision in play even as President Trump renewed pressure on the central bank to cut rates.", src: "https://www.cnbc.com/2026/09/04/jobs-report-august-2026.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK retail gilt buying jumps as yields touch multi-decade highs</strong>: British savers sharply increased purchases of UK government bonds this week as the sell-off lifted yields to their highest levels in decades, with retail-platform gilt buying surging to the year's highest level.", src: "https://www.bloomberg.com/news/articles/2026-09-03/retail-gilt-buying-jumps-after-yields-touch-highest-in-decades", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Fortress prices its third European CLO, a &euro;406m deal</strong>: Fortress Investment Group priced Fortress Credit Europe BSL 2026-3 DAC, a &euro;406m broadly-syndicated-loan CLO and its third European transaction.", src: "https://www.fortress.com/news/2026-08-14-fortress-investment-group-announces-pricing-of-third-european-clo-transaction", srcName: "Fortress" },
        { html: "<strong>Credit &mdash; Golub Capital expands its CLO platform to Europe</strong>: Golub Capital extended its broadly-syndicated-loan CLO business into Europe, hiring Tyler Wallace from Fair Oaks Capital to lead the build-out as an MD.", src: "https://golubcapital.com/news-insights/golub-capital-expands-broadly-syndicated-loan-clo-business-to-europe/", srcName: "Golub Capital" },
        { html: "<strong>Legal &mdash; Kirkland advises Carlyle, Dynasty Equity and Sixth Street on Seattle Seahawks minority stakes</strong>: Kirkland &amp; Ellis acted as legal counsel to the three minority investors in the Khosla family's $9.6bn acquisition of the NFL franchise, which closed 3 September; Sullivan &amp; Cromwell advised the Khosla ownership group.", src: "https://www.alternativeswatch.com/2026/09/03/khosla-family-closes-9-6bn-seahawks-purchase-sixth-street-carlyle-dynasty-equity-invest/", srcName: "Alternatives Watch" },
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
      time: "21:20 BST",
      lede: "US stocks fell and yields jumped into the close after August's payrolls surprise, with the Dow down roughly 272 points to 53,414, as Lululemon sank 18% on a Q2 outlook cut; London's FTSE 100 finished essentially flat and sterling trimmed its post-jobs losses. On the credit desk Aegon Asset Management launched three Luxembourg CLO funds spanning its European book, and on the legal desk A&amp;O Shearman flagged a busy summer of nine high-yield bond issuances led by this week's reopening deal for Boels.",
      bullets: [
        { html: "<strong>Macro &mdash; Wall Street falls and yields jump as the jobs-report surprise digests</strong>: US stocks closed lower and Treasury yields rose after the stronger-than-expected August payrolls report reopened the September rate-hike debate, with the Dow off roughly 0.51% to 53,414.25.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-04-2026", srcName: "TheStreet" },
        { html: "<strong>Macro &mdash; Lululemon sinks 18% after Q2 earnings and an outlook cut</strong>: Shares of Lululemon dropped 18% after the athletic-apparel retailer cut its full-year outlook alongside its second-quarter results.", src: "https://www.forbes.com/sites/fionariley/2026/09/04/lululemons-stock-sinks-18-after-q2-earnings-and-outlook-cut/", srcName: "Forbes" },
        { html: "<strong>Macro &mdash; FTSE 100 closes essentially flat as sterling trims its post-NFP losses</strong>: London's FTSE 100 ended the session little changed near 10,828 while the pound pared back the losses it took against the dollar during the volatile reaction to the US jobs report.", src: "https://247wallst.com/cards/london-finished-within-four-points-of-where-it-started-the-d-ftse-market-bell-01m1pgvv1nphasqyynhm8nhstx", srcName: "24/7 Wall St." },
        { html: "<strong>Credit &mdash; Aegon launches trio of Luxembourg funds targeting European CLOs</strong>: Aegon Asset Management launched three UCITS funds &mdash; Aegon European High Grade CLO, Aegon European CLO and Aegon European CLO Opportunities &mdash; giving daily-liquidity access across the AAA-to-sub-investment-grade European CLO spectrum, on top of the roughly &euro;4.5bn in European CLOs it already runs.", src: "https://alternativecreditinvestor.com/2026/09/04/aegon-launches-trio-of-funds-targeting-european-clos/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; A&amp;O Shearman: nine high-yield bond issuances drove a busy summer, market reopens with Boels</strong>: A&amp;O Shearman's high-yield team advised on nine issuances over summer 2026 amid tight spreads, reopening the market in September's first week with Boels' refinancing after deals for Vodafone Spain, Bit&eacute;, Verisure, Intrum, Iceland Foods, Aktor and HSE.", src: "https://www.aoshearman.com/en/news/ao-shearman-advises-on-nine-high-yield-bond-issuances-during-summer-wave", srcName: "A&O Shearman" },
      ],
    },
  },
};
