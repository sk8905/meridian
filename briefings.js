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
      date: "2026-09-05",
      time: "12:16 BST",
      lede: "Saturday's quiet in markets but not in debate: Friday's blowout August payrolls (+162,000) has hike odds for the 16 September FOMC holding near 58%, with Goldman Sachs pushing back that a hike is still \"very unlikely,\" while UK gilt yields at 28-year highs keep squeezing Chancellor Healey's Budget headroom; on the credit desk Greg Coffey's Kirkoswald is preparing a new emerging-market credit hedge fund, and law firms are already lining up tech mandates behind Nvidia's $13bn purchase of Hugging Face.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed hike odds hold near 58% after payrolls beat; Goldman Sachs pushes back</strong>: Futures still price roughly even-to-favoured odds of a 16 September rate hike after Friday's 162,000 August payrolls print, but Goldman Sachs' Jan Hatzius argues a hike remains \"very unlikely\" and expects the Fed to hold through 2026.", src: "https://finance.yahoo.com/economy/policy/articles/odds-fed-rate-hike-fall-083935313.html", srcName: "Yahoo Finance" },
        { html: "<strong>Macro &mdash; UK borrowing costs at a 28-year high squeeze Healey's Budget room</strong>: Deutsche Bank's Sanjay Raja estimates the gilt-yield surge could roughly halve Chancellor Healey's fiscal headroom to £13.8bn ahead of the 28 October Budget, with 30-year yields near their highest since 1998.", src: "https://www.easterneye.biz/uk-borrowing-costs-burnham-budget/", srcName: "Eastern Eye" },
        { html: "<strong>Credit &mdash; Kirkoswald to launch new EM credit hedge fund</strong>: Greg Coffey's Kirkoswald Asset Management is preparing a fund focused on emerging-market credit, capitalising on surging investor demand for hedge funds.", src: "https://www.bloomberg.com/news/articles/2026-09-04/coffey-s-kirkoswald-set-to-launch-new-em-credit-hedge-fund", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; Nvidia's $13bn Hugging Face deal drives a fresh wave of tech mandates</strong>: US firms are leading advisory work on Nvidia's purchase of AI platform Hugging Face, the latest in a run of blockbuster tech M&amp;A mandates this year.", src: "https://email.legalbusiness.co.uk/q/12H5apPMR0Krw1LgMOgvOiAc/wv", srcName: "Legal Business" },
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
