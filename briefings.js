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
      date: "2026-08-20",
      time: "05:22 BST",
      lede: "Dollar risks are seen mounting on softer US data and fiscal-deficit concern, while UK 10-year gilts remain pinned above 5% and July payrolls fell as vacancies hit a five-year low; in credit, Andalusian Credit Partners and Carlyle formed a $200m rated joint venture and Andalusian's BDC drew a $200m Goldman Sachs revolving facility; and in legal, Clifford Chance advised the Saverin family office in the Liverpool FC minority-stake consortium and White &amp; Case advised Providence Equity on its acquisition of Hometrack from ZPG.",
      bullets: [
        { html: "<strong>Macro &mdash; dollar risk</strong>: Currency strategists flag mounting risk to the dollar from growing fiscal concern, softer US data and uncertainty over the Fed's inflation reaction function, even after last week's yield-driven rally.", src: "https://www.cnbc.com/2026/08/19/inflation-dollar-risks-fed.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK gilts &amp; jobs</strong>: The 10-year gilt yield remains pinned above 5% for a second session, while UK payrolls fell and vacancies hit a five-year low, underscoring a weakening labour market even as long-end borrowing costs stay elevated.", src: "https://tradingeconomics.com/united-kingdom/government-bond-yield/news/535461", srcName: "TradingEconomics" },
        { html: "<strong>Credit &mdash; Andalusian/Carlyle</strong>: Andalusian Credit Company formed a $200m rated joint venture with Carlyle affiliates (Andalusian Credit Rated JV I LLC), combining up to $60m of equity with $140m of Morningstar DBRS-rated delayed-draw notes to invest in middle-market loan assets.", src: "https://alternativecreditinvestor.com/2026/03/27/andalusian-and-carlyle-form-200m-joint-venture/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Andalusian BDC</strong>: Andalusian's business development company secured a $200m revolving credit facility from Goldman Sachs Bank USA, maturing March 2031, after the manager's most active deployment quarter to date ($200m across 22 investments in Q2).", src: "https://www.abfjournal.com/andalusian-secures-200mm-revolving-credit-facility-from-goldman-sachs/", srcName: "ABF Journal" },
        { html: "<strong>Legal &mdash; Liverpool FC &amp; Hometrack</strong>: Clifford Chance advised EE Capital (the Saverin family office) in the 1892 Holdings consortium's minority-stake investment in Liverpool F.C. from Fenway Sports Group, while White &amp; Case advised Providence Equity Partners on its acquisition of proptech data provider Hometrack from ZPG.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-ee-capital-as-fenway-sports-group-agrees-strategic-minority-investment-in-liverpool-football-club.html", srcName: "Clifford Chance" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-19",
      time: "12:34 BST",
      lede: "UK July CPI accelerated to 2.9% y/y on the Ofgem energy-cap rise, nudging sterling higher, while the dollar drifted near multi-month lows and Treasury yields eased ahead of tonight's FOMC minutes; in credit, Northleaf Capital Partners closed its debut Asset-Based Specialty Finance Fund at ~$450m; and in legal, the High Court (Ch) handed down a further costs judgment in the Quidpay/OpenPayd reserve-account dispute.",
      bullets: [
        { html: "<strong>Macro &mdash; UK CPI reaction</strong>: July inflation's rise to a four-month high of 2.9% y/y, driven by the Ofgem energy-cap increase, left sterling edging higher within range as markets weighed the hotter core print against the BoE's rate path.", src: "https://www.fxstreet.com/news/british-pound-edges-up-within-range-following-hotter-uk-inflation-data-202608190631", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; dollar/Treasuries</strong>: The dollar drifted near multi-month lows and Treasury yields eased as markets awaited this evening's FOMC minutes for clues on the Fed's next move.", src: "https://www.cnbc.com/amp/2026/08/19/dollar-drifts-near-multi-month-low-as-yields-ease-fed-minutes-awaited.html", srcName: "Reuters (via CNBC)" },
        { html: "<strong>Credit &mdash; Northleaf</strong>: Northleaf Capital Partners closed its inaugural Asset-Based Specialty Finance Fund at approximately $450m, targeting entertainment royalties, legal assets, healthcare receivables and factoring across the US, Canada, Europe and Australia.", src: "https://alternativecreditinvestor.com/2026/08/18/northleaf-asset-based-specialty-finance-fund-secures-450m-at-final-close/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Quidpay/OpenPayd</strong>: The High Court (Ch) handed down a further costs judgment in the Quidpay/OpenPayd reserve-account dispute, ordering OpenPayd to pay over &euro;2.45m and &pound;7m held in the disputed reserve account plus interest, and apportioning costs between the parties issue-by-issue.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2199", srcName: "National Archives" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-19",
      time: "21:11 BST",
      lede: "The 28&ndash;29 July FOMC minutes showed the Fed's hawkish tilt runs beyond the three dissenters, keeping a 16 September hike live, though the Treasury's move to double long-bond buybacks pulled yields sharply lower into the close; oil extended a fourth day of gains on Strait of Hormuz uncertainty; and in credit, RBC BlueBay, Canyon Partners and Palmer Square all priced new CLOs while Man Group's head of CLO operations departed after 19 years.",
      bullets: [
        { html: "<strong>Macro &mdash; FOMC minutes</strong>: Minutes from the 28&ndash;29 July meeting showed hawkish sentiment running well beyond the three dissenting regional presidents, with 'many participants' saying tightening would likely be needed if inflation doesn't decline &mdash; keeping a 16 September hike genuinely live.", src: "https://www.cnbc.com/2026/08/19/fed-minutes-july-2026-officials-saw-need-for-rate-hike-if-inflation-doesnt-cool.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Treasury buyback</strong>: The US Treasury doubled long-bond buyback operations after the 30-year yield's fresh 19-year high, sending yields sharply lower into the close (30-year -7.8bp to 5.207%, 10-year -4.9bp to 4.65%) even as a Nasdaq/semiconductor-led selloff continued.", src: "https://www.bloomberg.com/news/articles/2026-08-19/long-dated-treasuries-rally-as-treasury-boosts-bond-buybacks", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; CLO pricings</strong>: RBC BlueBay priced its 16th CLO (BBAM US CLO VII, $400m) and Canyon Partners closed its fifth active European vehicle (Canyon Euro CLO 2026-1, &euro;400m), while Palmer Square issued 2026's first static European CLO earlier in the year &mdash; all newly added to Meridian's CLO tracker this run.", src: "https://alternativecreditinvestor.com/2026/05/21/rbc-bluebay-prices-16th-clo-at-400m/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Man Group</strong>: Man Group's Zug-based head of CLO operations, Niels van den Ouweland, departed after 19 years in the role, while the firm's credit platform separately held a first close on its third opportunistic credit fund, Man Opportunistic Credit Fund III.", src: "https://www.structuredcreditinvestor.com/market-moves/clos/84932/man-group's-clo-operations-head-departs", srcName: "Structured Credit Investor" },
      ],
    },
  },
};
