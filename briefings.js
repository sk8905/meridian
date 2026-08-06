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
      date: "2026-08-05",
      time: "12:38 BST",
      lede: "US&ndash;Iran talks on reopening the Strait of Hormuz showed fresh signs of progress as the Nasdaq 100 extended a four-day, $3.5tn rally on AI-earnings strength, the UK&rsquo;s final July services PMI was revised up to 52.1 while Next and Glencore both beat on profit, Apollo and Ares both posted record Q2 fee-related earnings, Triple Point and Pemberton logged new private-credit financings alongside a Palmer Square CLO reset, and the High Court revisited liquidator remuneration in Float Capital&rsquo;s insolvency under the court&rsquo;s section 112 supervisory jurisdiction.",
      bullets: [
        { html: "<strong>Iran / markets</strong>: the US and Iran could reach a deal as soon as this week on a temporary arrangement to reopen the Strait of Hormuz, Treasury Secretary Bessent said, as the Nasdaq 100 extended its rally to a four-day, $3.5tn market-cap gain on AI-linked earnings strength.", src: "https://www.bloomberg.com/news/articles/2026-08-05/tech-melt-up-drives-3-5-trillion-nasdaq-100-rally-in-four-days", srcName: "Bloomberg" },
        { html: "<strong>UK data / earnings</strong>: the UK&rsquo;s final July services PMI was revised up to 52.1 from a 51.8 flash reading, even as Next raised its profit outlook on strong UK and Middle East sales and Glencore&rsquo;s H1 adjusted EBITDA surged 86% to $10.1bn on a trading boom and record copper prices.", src: "https://investinglive.com/news/uk-july-final-services-pmi-xx-vs-51-8-prelim/", srcName: "investingLive" },
        { html: "<strong>Credit &mdash; managers</strong>: Apollo&rsquo;s total AUM crossed $1.05tn with record fee-related earnings of $785m, and Ares&rsquo;s AUM topped $671bn with Q2 FRE of $491.1m, as Triple Point upsized a UK bridging-lender facility to &pound;50m and Pemberton&rsquo;s financing backed a minority stake sale at prepaid-funeral provider Pure Cremation.", src: "https://ir.apollo.com/news-events/press-releases/detail/640/apollo-reports-second-quarter-2026-results", srcName: "Apollo (IR)" },
        { html: "<strong>CLOs</strong>: Palmer Square Capital Management closed a $300m reset of Palmer Square BDC CLO 1, pricing $228m of AAA notes at SOFR+1.28% and $72m of AA notes at SOFR+1.75%, both due 2039.", src: "https://www.sec.gov/Archives/edgar/data/0001794776/000121390026078363/ea0298073-8k_palmer.htm", srcName: "SEC EDGAR" },
        { html: "<strong>Legal &mdash; restructuring</strong>: Chief ICC Judge Briggs revisited the joint liquidators&rsquo; remuneration in Float Capital&rsquo;s liquidation, using the court&rsquo;s section 112 supervisory jurisdiction after the Court of Appeal&rsquo;s Frost decision narrowed the usual Insolvency Rules route for increasing time-costs-based fees.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2077", srcName: "National Archives (Case Law)" },
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
