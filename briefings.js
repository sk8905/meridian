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
      date: "2026-09-02",
      time: "09:28 BST",
      lede: "A fresh round of US-Iran strikes near the Strait of Hormuz pushed Brent above $96/bbl and deepened the global bond selloff &mdash; the US 2-year Treasury yield hit its highest since January 2025 and Japan's 10-year topped 3% for the first time in 30 years &mdash; with CME FedWatch-implied odds of a 16 September Fed hike firming to a cycle-high 66&ndash;68% ahead of today's ADP report; on the credit desk, Partners Group named co-CEOs Roberto Cagnati and Juri Jenkner as David Layton steps up to CIO amid H1 results showing performance fees down 39%.",
      bullets: [
        { html: "<strong>Macro &mdash; Brent tops $96/bbl as US and Iran trade fresh strikes near Hormuz</strong>: Oil jumped more than 2% after the US and Iran exchanged further attacks near the Strait of Hormuz, extending the bond selloff into a second session with the US 2-year Treasury yield at its highest since January 2025.", src: "https://www.cnbc.com/2026/09/02/brent-oil-us-iran-strikes.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Japan's 10-year yield tops 3% for first time in 30 years as UK gilts extend selloff</strong>: European government bonds fell further Wednesday as the Iran conflict and fiscal concerns kept pressure on long-dated debt; UK gilt yields stayed near their highest since the 2008 financial crisis as sterling firmed against a broadly weaker dollar.", src: "https://www.fxstreet.com/news/pound-sterling-price-news-and-forecast-gbp-usd-soaring-uk-gilt-yields-raise-fiscal-concerns-202509021213", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; Fed hike odds firm to cycle-high 66&ndash;68% as ADP report looms</strong>: CME FedWatch-implied odds of a 16 September hike firmed further overnight, with today's ADP employment report expected to show private payroll growth continuing to lose steam ahead of Friday's nonfarm payrolls.", src: "https://www.fxstreet.com/news/adp-employment-report-is-expected-to-show-a-moderate-increase-in-private-payrolls-in-august-202609020815", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; UK borrowing costs stay pinned near 2008 highs</strong>: Chancellor Rachel Reeves faces a widening fiscal hole as gilt yields remain near their highest since the financial crisis, with UK shop-price inflation also running at its fastest pace since 2024.", src: "https://www.cityam.com/healey-facing-6bn-hit-as-uk-borrowing-costs-reach-highest-point-since-financial-crisis/", srcName: "CityAM" },
        { html: "<strong>Credit &mdash; Partners Group names co-CEOs as David Layton steps up to CIO</strong>: The Swiss private-markets manager named Roberto Cagnati and Juri Jenkner co-CEOs effective 1 January 2027 after a surge in redemption requests hit its flagship evergreen fund; H1 2026 net profit fell 13% to CHF 502m and performance fees dropped 39% to CHF 216m.", src: "https://www.ft.com/content/0d5b67bd-a07f-47da-9e9b-505df1b4ff33", srcName: "Financial Times" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-02",
      time: "12:36 BST",
      lede: "Fresh US-Iran strikes near the Strait of Hormuz pushed Brent above $96/bbl and extended the global bond selloff into a third session &mdash; UK gilt yields hit their highest since 2008 and sterling slumped against the euro &mdash; while CME-implied odds of a 16 September Fed hike firmed to 66% after Fed Governor Barr backed tightening if inflation fails to cool; on the credit desk Sound Point Capital joins Meridian's roster on the back of its $1.5bn Strategic Capital Fund III final close and Blue Owl opened a Zurich office, while the High Court handed down judgment in Inner Mongolia King Deer Cashmere v Haian Ma.",
      bullets: [
        { html: "<strong>Macro &mdash; US-Iran strikes send oil and yields surging as Fed turns hawkish</strong>: Renewed US-Iran strikes near the Strait of Hormuz lifted Brent crude and extended the bond selloff, with Treasury Secretary Bessent and Fed Chair Warsh both at the G20 as markets repriced the September FOMC meeting.", src: "https://www.cnbc.com/2026/09/02/us-iran-trump-war-escalation-latest-fed-rate-g20-bessent-yen-.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK mid-caps hit one-month low and sterling slumps as gilt yields hit highest since 2008</strong>: The FTSE 250 fell to its lowest since early August and EUR/GBP pushed toward 0.8700 as the UK 10-year gilt yield extended its climb to levels last seen in June 2008 on renewed Iran-driven inflation fears.", src: "https://www.globalbankingandfinance.com/uks-midcaps-hit-nearly-one-month-low-gilt-yields-surge/", srcName: "Global Banking & Finance (Reuters)" },
        { html: "<strong>Macro &mdash; Fed's Barr backs rate hike if inflation fails to cool, September odds hit 66%</strong>: Fed Governor Michael Barr said he would back raising rates at or after the 15-16 September FOMC meeting if inflation fails to moderate sufficiently, pushing CME FedWatch-implied hike odds to 66% ahead of today's ADP employment report.", src: "https://ca.finance.yahoo.com/news/fed-barr-backs-rate-hike-140539893.html", srcName: "Investing.com (via Yahoo Finance)" },
        { html: "<strong>Credit &mdash; Sound Point Capital holds $1.5bn final close for Strategic Capital Fund III</strong>: The ~$43bn CLO, direct-lending, ABL and real-estate-credit manager closed its third asset-based capital-solutions fund at its $1.5bn hard cap, oversubscribed and double each of its two predecessor funds, and separately hired Faris AbiNader to lead capital formation for its growing commercial real-estate credit strategy.", src: "https://www.businesswire.com/news/home/20260305146288/en/Sound-Point-Capital-Holds-Final-Close-for-Oversubscribed-Strategic-Capital-Fund-III-Totaling-$1.5-Billion-in-Equity", srcName: "Business Wire" },
        { html: "<strong>Legal &mdash; High Court hands down judgment in Inner Mongolia King Deer Cashmere v Haian Ma</strong>: The Commercial Court delivered its ruling in the dispute today, the latest in a run of High Court (Comm) decisions Meridian is tracking across its four covered practice areas.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/comm/2026/2256", srcName: "National Archives (BAILII)" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-01",
      time: "21:21 BST",
      lede: "UK 10-year gilt yields pushed to their highest since 2008 and US JOLTS job openings missed estimates at 7.271m as the renewed US-Iran conflict and a global bond selloff kept risk assets under pressure into the New York close; on the credit desk Arcmont landed A$705m from Australian institutions for a European direct-lending mandate and Fortress pushed its private-wealth platform into EMEA and Japan, while Clifford Chance advised Calisen on a £500m infrastructure financing and the High Court dismissed a just-and-equitable winding-up petition in APL Holdco v Apple Properties.",
      bullets: [
        { html: "<strong>Macro &mdash; UK 10-year gilt yields hit highest since 2008 as Iran war reignites inflation fears</strong>: Gilts led a broader global bond selloff, with the UK 10-year yield climbing to levels last seen in 2008 as the renewed US-Iran conflict and stubborn inflation pressured fixed income on both sides of the Atlantic.", src: "https://www.brecorder.com/news/40437390/uk-10-year-gilt-yields-hit-highest-since-2008-as-iran-war-reignites-inflation-fears", srcName: "Business Recorder" },
        { html: "<strong>Macro &mdash; US JOLTS job openings miss at 7.271m versus 7.300m estimate</strong>: July job openings came in just below consensus, a modest cooling signal for the labour market that traders are weighing alongside the ISM Manufacturing PMI's dip to 54.6% ahead of the 16 September FOMC decision.", src: "https://investinglive.com/news/jolts-job-openings-7-271m-vs-7-300m-estimate/", srcName: "investingLive" },
        { html: "<strong>Credit &mdash; Arcmont wins A$705m from Australian institutions for European direct lending</strong>: The Nuveen-affiliated manager secured A$705m (&pound;372.6m) from Brighter Super, the Jana Private Credit Trust and two other Australian institutions for a dedicated portfolio of senior-secured, unitranche and subordinated loans to European mid-market companies in defensive sectors.", src: "https://alternativecreditinvestor.com/2026/09/01/australian-investors-commit-a705m-to-european-direct-lending/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Fortress expands private-wealth distribution into EMEA and Japan</strong>: Fortress Investment Group is taking its credit, real-estate and net-lease private-wealth products beyond the US and Latin America for the first time, naming Harry Bush (ex-Nuveen) to lead EMEA from London and Yuko Umino (ex-PIMCO Japan) to lead Japan from Tokyo.", src: "https://alternativecreditinvestor.com/2026/09/01/fortress-expands-private-wealth-business-into-emea-and-japan/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Clifford Chance advises Calisen on &pound;500m financing for smart-metering rollout</strong>: The firm advised the EQT/GIC/Equitix-backed UK energy-infrastructure business on a &pound;500m long-term financing facility, with Evercore and Santander acting as financial advisers, to fund continued smart-metering investment and expansion into complementary infrastructure sectors.", src: "https://www.cliffordchance.com/news/news/2026/09/clifford-chance-advises-calisen-on-500-million-financing-to-support-growth-of-leading-infrastructure-business.html", srcName: "Clifford Chance" },
      ],
    },
  },
};
