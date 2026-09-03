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
      date: "2026-09-03",
      time: "05:21 BST",
      lede: "Sterling slid to a three-week low near $1.3475 and gold pushed back above $4,400/oz overnight as markets priced elevated odds of a 16 September Fed hike ahead of Friday's payrolls, while Asia-Pacific shares and bonds staged a relief rally after this week's global bond selloff; on the credit desk Arcmont Asset Management secured A$705m from Australian institutional investors for its European direct-lending strategy (advised by Kirkland &amp; Ellis, which separately advised ESR Group on a sustainability-linked refinancing exceeding its $2bn target) and Permira Credit priced two new CLOs.",
      bullets: [
        { html: "<strong>Macro &mdash; Sterling near three-week low as Fed hike bets and Iran tensions support the dollar</strong>: The pound held just under $1.3500 after a session low near $1.3475 as elevated CME-implied Fed hike odds and the renewed US-Iran conflict kept the dollar broadly bid despite this week's surge in UK gilt yields.", src: "https://www.fxstreet.com/news/british-pound-consolidates-near-three-week-low-as-fed-bets-and-iran-tensions-support-usd-202609030112", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; Gold extends gains above $4,400 as weak dollar meets Fed hike risk</strong>: Gold pushed back above $4,400 in the Asian session as retreating US bond yields undermined the dollar, even as CME FedWatch-implied odds of a 25bp September hike held near 62% on lingering US-Iran-driven energy-inflation risk.", src: "https://www.fxstreet.com/news/gold-extends-gains-above-4-400-as-sliding-bond-yields-and-soft-usd-counter-fed-hike-bets-202609030351", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; Asia-Pacific shares and bonds rally as markets await Fed signals</strong>: Regional shares and bonds staged a relief rally, with MSCI's Asia-Pacific index outside Japan up 0.5% and Japanese government bond yields sliding from their historic peaks, as investors awaited Friday's US payrolls report and Fed comments from Williams, Waller and Hammack.", src: "https://www.brecorder.com/news/40437725/shares-bonds-rally-as-markets-await-signals-for-fed-rates", srcName: "Business Recorder (Reuters)" },
        { html: "<strong>Credit &mdash; Arcmont secures A$705m from Australian investors for European direct-lending strategy</strong>: Queensland's Brighter Super, Jana Private Credit Trust and two other Australian institutional investors committed a combined A$705m to a dedicated European direct-lending portfolio managed by Arcmont Asset Management, the Nuveen affiliate; Kirkland &amp; Ellis advised Arcmont on the fund-formation side.", src: "https://alternativecreditinvestor.com/2026/09/01/australian-investors-commit-a705m-to-european-direct-lending/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Kirkland advises ESR on sustainability-linked refinancing exceeding $2bn target</strong>: Kirkland &amp; Ellis advised Asia-Pacific's largest real-asset manager on sustainability-linked refinancing facilities totalling more than $2bn-equivalent, consolidating several existing loan facilities into a single multi-currency structure after lender demand exceeded the initial target.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advises-esr-on-sustainability-linked-refinancing-exceeding-$2-billion-target", srcName: "Kirkland & Ellis" },
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
      date: "2026-09-02",
      time: "21:21 BST",
      lede: "The Fed's Beige Book showed modest growth and sticky prices across most districts, yet Wall Street closed higher (Dow +0.56%, S&amp;P 500 +0.46%, Nasdaq +0.45%) even as the 10-year Treasury yield's earlier push to 4.818% &mdash; its highest since November 2023 &mdash; and NY Fed's Williams framed the yield surge as reflecting economic strength; London closed lower as the UK 10-year gilt hit an 18-year high of 5.268%, while Treasury Secretary Bessent said a fresh Iran-bank sanction is likely this week; on the credit desk LACERA appointed Cheyne Capital to a $750m credit mandate, and the High Court dismissed a just-and-equitable winding-up petition in APL Holdco v Apple Properties.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed's Beige Book shows modest growth as prices rise</strong>: The Fed's latest regional survey found economic activity growing slightly to moderately in 10 of 12 districts since early July, with prices rising in eight on elevated energy, raw-material and transportation costs and contacts flagging heightened uncertainty from the Iran conflict.", src: "https://www.fxstreet.com/news/feds-beige-book-shows-modest-growth-as-prices-rise-202609021821", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; Wall Street closes higher as NY Fed's Williams ties yield surge to a strong economy</strong>: The Dow added 295.07 points (0.56%) to 53,061.95, the S&amp;P 500 rose 0.46% and the Nasdaq gained 0.45%, even as the 10-year Treasury yield hit 4.818% intraday; NY Fed President John Williams said the surge partly reflects strong economic prospects rather than dysfunction.", src: "https://www.cnbc.com/2026/09/02/new-york-feds-williams-says-yield-surge-due-to-strong-economic-prospects.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; London closes lower as UK 10-year gilt hits 18-year high</strong>: The FTSE 100 fell 0.3% to 10,756.45 as the UK 10-year gilt yield rose to 5.268% &mdash; its highest since 2008 &mdash; and oil pushed above $95/bbl on the US-Iran conflict, with sterling easing to $1.3527 at the close.", src: "https://www.brecorder.com/news/40437413/london-stocks-slide-as-rising-gilt-yields-weigh-reckitt-gains", srcName: "Business Recorder (Reuters)" },
        { html: "<strong>Credit &mdash; LACERA appoints Cheyne Capital to manage $750m credit mandate</strong>: The $93.9bn Los Angeles County pension fund approved a $750m allocation to a multi-asset credit hedge-fund strategy managed by Cheyne Capital through a dedicated managed account, part of its broader credit portfolio.", src: "https://alternativecreditinvestor.com/2026/09/02/lacera-appoints-cheyne-capital-to-manage-750m-credit-mandate/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; High Court dismisses winding-up petition in APL Holdco v Apple Properties</strong>: Deputy Judge Philip Rainey KC dismissed a just-and-equitable winding-up petition over an Isle of Man holding company despite finding a complete breakdown in trust between its two 50% owners, holding the petitioner bore sole responsibility for the breakdown and that alternative Isle of Man remedies remained available.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2245", srcName: "National Archives (BAILII)" },
      ],
    },
  },
};
