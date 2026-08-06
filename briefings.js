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
      date: "2026-08-06",
      time: "09:27 BST",
      lede: "US weekly jobless claims rose to 226,000 and gold pushed toward a seven-week high as a softer dollar met a still-hawkish Fed chorus, Ares led a $2.2bn direct loan backing MedImpact&rsquo;s acquisition of Medical Card System, HSF Kramer&rsquo;s July UK public M&amp;A round-up logged nine new offer announcements including ABB&rsquo;s &pound;4.136bn bid for Rotork, and London shares looked to extend their record run on strong earnings and Hormuz optimism.",
      bullets: [
        { html: "<strong>US data</strong>: initial jobless claims for the week to 2 August rose to 226,000, above the 221,000 consensus, while continuing claims climbed to 1.974m &mdash; the highest since November 2021.", src: "https://in.investing.com/news/economic-indicators/weekly-us-initial-jobless-claims-rise-to-226000-4950376", srcName: "Investing.com" },
        { html: "<strong>Gold / markets</strong>: gold pushed toward a seven-week high near $4,300 as a slipping dollar offset another round of hawkish Fed commentary, extending a rally of roughly 6% on the week.", src: "https://www.fxleaders.com/news/2026/08/06/gold-price-surges-seven-week-high-xau-usd-eyes-4334-dollar-slides/", srcName: "FX Leaders" },
        { html: "<strong>Credit</strong>: Ares Management led a $2.2bn second-lien direct loan to MedImpact Holdings backing its acquisition of Puerto Rico healthcare/PBM business Medical Card System &mdash; one of the largest US private-credit loans of 2026.", src: "https://www.bloomberg.com/news/articles/2026-08-05/ares-eyes-2-billion-loan-deal-in-slow-year-for-private-credit", srcName: "Bloomberg" },
        { html: "<strong>Legal</strong>: HSF Kramer&rsquo;s UK Public M&amp;A Monthly Activity Update recorded nine Rule 2.7 firm offers and nine possible-offer approaches in July, led by ABB&rsquo;s &pound;4.136bn offer for Rotork, the &pound;3.1bn OCS/Mitie take-private and Arlington&rsquo;s &pound;345.6m take-private of Gooch &amp; Housego.", src: "https://www.hsfkramer.com/insights/2026-08/uk-public-ma-monthly-activity-update-july-2026", srcName: "HSF Kramer" },
        { html: "<strong>UK markets</strong>: the FTSE 100 looked to extend its record run, with gold miners providing a boost even as Prudential and HSBC came under pressure on a China tax-crackdown report.", src: "https://www.proactiveinvestors.com/companies/news/1096553/ftse-100-live-next-and-glencore-provide-results-boost-spacex-tumbles-1096553.html", srcName: "Proactive Investors" },
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
      time: "17:36 BST",
      lede: "US Treasury yields edged higher and the S&amp;P 500 slipped as traders weighed jobs data and earnings even as the FTSE 100 extended its record run, the High Court heard a case-management stay application in an &lsquo;up-tiering&rsquo; liability-management dispute between senior secured noteholders and a security agent, Freshfields advised CVC and Partners Group on the proposed $8.6bn sale of Polish convenience-store operator Żabka to Alimentation Couche-Tard, and Brookfield disclosed a record $77bn of Q2 fundraising including $51bn for private credit.",
      bullets: [
        { html: "<strong>US markets</strong>: Treasury yields edged higher and the S&amp;P 500 slipped as traders sharpened their focus on rates, weighing weekly jobless claims and the earnings calendar.", src: "https://www.cnbc.com/2026/08/06/treasury-yields-interest-rates-inflation-fed.html", srcName: "CNBC" },
        { html: "<strong>UK markets</strong>: the FTSE 100 extended its gains on strong corporate earnings, lower oil prices and improved sentiment.", src: "https://sundayguardianlive.com/business/ftse-100-today-uk-stocks-gain-on-strong-earnings-lower-oil-prices-and-improved-market-sentiment-what-should-investors-know-254937/", srcName: "Sunday Guardian Live" },
        { html: "<strong>Legal &mdash; restructuring</strong>: the High Court (Financial List) heard a case-management stay application in Cheyne European Special Situations Fund Investments v TMF Trustee, a dispute between senior secured noteholders and a security agent over an &lsquo;up-tiering&rsquo; transaction that elevated certain debtholders' priority, with parallel proceedings also on foot in New York.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2091", srcName: "National Archives" },
        { html: "<strong>Legal &mdash; M&amp;A</strong>: Freshfields is advising CVC Capital Partners and Partners Group on the proposed sale of their controlling stake in Warsaw-listed convenience-store operator Żabka to Alimentation Couche-Tard via a tender offer valuing the group's equity at roughly $8.6bn.", src: "https://www.freshfields.com/en/our-thinking/news/news-search/2026/08/freshfields-advises-cvc-and-partners-group-on-proposed-sale-of-abka-to-alimentation-couche-tard", srcName: "Freshfields" },
        { html: "<strong>Credit &mdash; fundraising</strong>: Brookfield Asset Management raised a record $77bn in Q2 2026, including $51bn of private-credit capital, taking fee-bearing capital to $672bn, up 19% year-on-year.", src: "https://alternativecreditinvestor.com/2026/08/05/brookfield-raises-record-77bn-in-q2/", srcName: "Alternative Credit Investor" },
      ],
    },
  },
};
