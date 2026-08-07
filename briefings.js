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
      date: "2026-08-07",
      time: "05:26 BST",
      lede: "Markets held a cautious, wait-and-see tone ahead of Friday's July jobs report as gold consolidated below its recent highs and oil jumped on Iran's restrictive draft plan for the Strait of Hormuz, TPG's Q2 results showed its credit platform's AUM climbing to $101bn, Clifford Chance advised easyJet on Apollo's recommended &pound;5.7bn takeover offer, and the High Court removed the administrators of an FCA-regulated hosting firm over a mishandled creditors' vote.",
      bullets: [
        { html: "<strong>US data watch</strong>: gold consolidated below its recent highs as dollar strength and Fed rate-hike bets capped further gains ahead of the July jobs report, due 13:30 BST, with nonfarm payrolls, the unemployment rate and average hourly earnings all in focus.", src: "https://www.fxstreet.com/news/gold-consolidates-below-recent-highs-as-usd-strength-and-fed-hike-bets-cap-ahead-of-us-nfp-202608070135", srcName: "FXStreet" },
        { html: "<strong>Oil / geopolitics</strong>: oil prices jumped after Iran published a restrictive draft plan for reopening the Strait of Hormuz, complicating hopes for a durable de-escalation deal with Oman mediating.", src: "https://www.cnbc.com/2026/08/06/oil-price-iran-war-strait-hormuz-oman-deal.html", srcName: "CNBC" },
        { html: "<strong>Credit</strong>: TPG's Q2 2026 results showed firm-wide AUM at $327bn (+25% y/y), with its Credit platform (TPG Angelo Gordon) the standout &mdash; AUM up to $101bn from $80bn a year earlier on $9.3bn raised for TPG Direct Lending and $2.3bn of TwinBrook originations in the quarter.", src: "https://www.tpg.com/news-and-insights/tpg-reports-second-quarter-2026-results", srcName: "TPG" },
        { html: "<strong>Legal &mdash; corporate</strong>: Clifford Chance advised easyJet on the recommended &pound;5.7bn takeover offer from Apollo-managed funds, after rival bidder Castlelake withdrew from the process.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-easyjet-on-the-recommended-p5-7-billion-takeover.html", srcName: "Clifford Chance" },
        { html: "<strong>Legal &mdash; restructuring &amp; insolvency</strong>: the High Court removed the administrators of Kession Capital, an FCA-regulated payments/hosting firm, after finding they mishandled a creditors' vote by applying nominal-value voting for unconnected creditors while using face value for connected ones.", src: "https://www.bailii.org/ew/cases/EWHC/Ch/2026/785.html", srcName: "BAILII" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-06",
      time: "12:31 BST",
      lede: "Gold held near a seven-week high and equities looked to extend their record run on a softer dollar and Hormuz de-escalation hopes even as a fresh chorus of hawkish Fed officials kept a rate-hike debate alive, Audax Private Debt priced a $541m reset of its ninth middle-market CLO, and the High Court struck out a litigant-in-person's negligence claim against a company's former administrators for breaching an unless order.",
      bullets: [
        { html: "<strong>Fed / markets</strong>: gold pushed toward a seven-week high near $4,300 (up roughly 6% on the week) as a slipping dollar met another round of hawkish Fed commentary from Kashkari, Schmid and Cook, all flagging a possible rate hike if inflation doesn't cool.", src: "https://www.fxleaders.com/news/2026/08/06/gold-price-surges-seven-week-high-xau-usd-eyes-4334-dollar-slides/", srcName: "FX Leaders" },
        { html: "<strong>Credit &mdash; CLOs</strong>: Audax Private Debt priced a $541m reset of Audax Senior Debt CLO 9, with the senior AAA tranche at SOFR+152bps, extending the vehicle's non-call period to October 2028 and reinvestment period to October 2030 ahead of an anticipated 6 August close.", src: "https://www.audaxprivatedebt.com/news/audax-private-debt-prices-541-million-clo-9-reset", srcName: "Audax Private Debt" },
        { html: "<strong>Credit &mdash; fund flows</strong>: the Financial Times reported Ares has scaled back the target for one of its blockbuster private-credit vehicles after investor pushback on valuations, one of several signs of a more cautious fundraising backdrop for the largest direct-lending platforms.", src: "https://www.ft.com/content/76646dc7-c24b-45fb-8667-9617714a122b", srcName: "Financial Times" },
        { html: "<strong>Legal &mdash; restructuring &amp; insolvency</strong>: the High Court struck out Mr Gladwin's professional negligence and fraud claim against the former administrators of Killean Estates after he failed to comply with an unless order requiring him to seek the statutory permission needed to sue former office-holders.", src: "https://www.bailii.org/ew/cases/EWHC/Ch/2026/1043.html", srcName: "BAILII" },
        { html: "<strong>UK markets</strong>: the FTSE 100 looked to extend its record run, with gold miners providing a boost even as Prudential and HSBC came under pressure on a China tax-crackdown report.", src: "https://www.proactiveinvestors.com/companies/news/1096553/ftse-100-live-next-and-glencore-provide-results-boost-spacex-tumbles-1096553.html", srcName: "Proactive Investors" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-06",
      time: "21:20 BST",
      lede: "Gold held near a seven-week high and Treasury yields edged higher as traders braced for Friday's US jobs report following a soft 44,000 ADP print, Carlyle said it raised $17bn in Q2 with credit strategies deploying $7bn as it called an H2 2026 fundraising &lsquo;supercycle&rsquo;, Golub Capital and Palmer Square's listed BDCs both reported softer Q2/Q3 numbers, and the UK confirmed its Autumn Budget for 28 October.",
      bullets: [
        { html: "<strong>US markets</strong>: gold held near a seven-week high and Treasury yields edged higher as traders sharpened their focus on rates ahead of Friday's July jobs report, after ADP's private-payrolls print of just 44,000 &mdash; the weakest since January and well below the ~70,000 consensus &mdash; revived Fed-cut speculation.", src: "https://www.cnbc.com/2026/08/05/private-companies-added-just-44000-workers-in-july-below-expectations-adp-reports.html", srcName: "CNBC" },
        { html: "<strong>Credit &mdash; fundraising</strong>: Carlyle raised $17bn in Q2 2026 (trailing-12-month inflows of $56bn, +10% YoY) and said its credit strategies &mdash; direct lending, liquid credit and opportunistic credit &mdash; deployed $7bn in the quarter, with chief executive Harvey Schwartz describing the firm as &lsquo;entering the supercycle&rsquo; for H2 2026.", src: "https://www.benzinga.com/markets/private-markets/26/08/60964417/carlyle-raises-17-billion-sees-private-credit-pe-growth-accelerating-into-fundraising-supercycle", srcName: "Benzinga" },
        { html: "<strong>Credit &mdash; BDCs</strong>: Golub Capital BDC's fiscal Q3 results showed credit quality improving (adjusted net income recovering to $0.22/share) even as NAV edged down to $14.25/share, while Palmer Square Capital BDC declared a $0.36/share Q3 dividend after Q2 total investment income softened to $27.3m from $31.7m a year earlier.", src: "https://www.palmersquarebdc.com/news-events/press-releases/detail/40/palmer-square-capital-bdc-inc-announces-second-quarter-2026-financial-results", srcName: "Palmer Square" },
        { html: "<strong>UK markets</strong>: the FTSE 100 extended its record run as gold miners provided a boost, even as Prudential and HSBC came under pressure on a China tax-crackdown report.", src: "https://www.proactiveinvestors.com/companies/news/1096553/ftse-100-live-next-and-glencore-provide-results-boost-spacex-tumbles-1096553.html", srcName: "Proactive Investors" },
        { html: "<strong>UK policy</strong>: Chancellor John Healey confirmed the Autumn Budget for Wednesday 28 October 2026, with the OBR to publish its accompanying economic and fiscal forecast the same day &mdash; now the key catalyst for gilt markets after the 30-year yield touched a two-month high on fiscal-flexibility rhetoric from PM Andy Burnham.", src: "https://www.gov.uk/government/publications/chancellor-letter-to-the-treasury-select-committee-tsc-budget-2026-date", srcName: "HM Treasury / GOV.UK" },
      ],
    },
  },
};
