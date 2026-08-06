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
      date: "2026-08-05",
      time: "21:25 BST",
      lede: "Oil turned higher after Yemen's Houthi rebels claimed a fresh strike on a Saudi tanker, complicating the tentative truce that had been expected to reopen the Strait of Hormuz, even as US equities held near this week's record highs; insulation maker Alkegen filed a prepackaged Chapter 11 handing ownership to an Oak Hill Advisors/Apollo-led creditor group, Barings backed H2 Equity Partners' carve-out acquisition of ARRI's camera and lighting rental business, and Cleary Gottlieb advised Sixth Street on its acquisition of UK specialist lender Castle Trust Bank.",
      bullets: [
        { html: "<strong>Iran / oil</strong>: oil prices moved higher after Yemen's Iran-backed Houthi rebels claimed a strike on a Saudi tanker, complicating the tentative truce that had been expected to reopen the Strait of Hormuz.", src: "https://www.cnbc.com/2026/08/05/oil-prices-iran-war-houthis-saudi-tanker.html", srcName: "CNBC" },
        { html: "<strong>Credit &mdash; distress</strong>: insulation and filtration maker Alkegen commenced a prepackaged Chapter 11 eliminating roughly $2.9&ndash;3.1bn of funded debt and handing ownership to a first-lien creditor group including Oak Hill Advisors and Apollo Global Management, backed by $315m of new-money DIP financing.", src: "https://www.businesswire.com/news/home/20260726574083/en/Alkegen-Commences-Prepackaged-Chapter-11-Process-to-Implement-Previously-Announced-Restructuring-Support-Agreement", srcName: "Business Wire" },
        { html: "<strong>Credit &mdash; financings / managers</strong>: Barings provided financing backing H2 Equity Partners' carve-out acquisition of ARRI's global camera and lighting equipment rental business, while re-verification this run put Crescent Capital Group's AUM at roughly $53bn as of end-June, up from the ~$45bn estimate previously carried.", src: "https://www.barings.com/en-us/guest/contact/media/news/barings-supports-h2-equity-partners-acquisition-of-arri-rental-group", srcName: "Barings" },
        { html: "<strong>Legal &mdash; banking / funds</strong>: Cleary Gottlieb advised Sixth Street and Bayview Asset Management affiliates on their acquisition of UK specialist bank Castle Trust Bank from J.C. Flowers, while Mayer Brown published governance guidance for GP-led continuation-fund transactions amid tightening ILPA disclosure standards.", src: "https://www.clearygottlieb.com/news-and-insights/news-listing/sixth-street-in-acquisition-of-castle-trust-bank", srcName: "Cleary Gottlieb" },
      ],
    },
  },
};
