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
      time: "09:24 BST",
      lede: "Asian equities rallied hard and the dollar slid to a two-and-a-half-month low after the US Treasury doubled its long-bond buybacks, with Walmart's pre-market earnings today the next catalyst before Chair Warsh's 28 August Jackson Hole keynote; in credit, BlackRock's HPS and Brookfield's Oaktree seized control of Hollywood production-services supplier MBS Group in a restructuring wiping out up to $900m of debt, while Jefferies Credit Partners launched a &euro;1bn private-credit secondaries fund; and in legal, Kirkland advised Francisco Partners on its $650m take-private of Weave Communications.",
      bullets: [
        { html: "<strong>Macro &mdash; Asia/dollar</strong>: South Korea's Kospi surged as much as 6% (triggering a buy-side circuit breaker) and Japan's Nikkei gained around 1.2% as the Treasury's expanded long-bond buyback pulled global yields off their highs, with SK Hynix's $28.7bn buyback plan powering a sharp chip-stock rebound and the dollar index near a 2&frac12;-month low.", src: "https://www.fxstreet.com/news/asian-equities-rally-kospi-leads-gains-as-us-treasury-support-counters-fed-iran-risks-202608200357", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; Bessent/Warsh</strong>: Treasury Secretary Bessent's move to curb Treasury yields via the expanded buyback programme puts fresh pressure on incoming Fed Chair Kevin Warsh ahead of his 28 August Jackson Hole keynote and the 16 September FOMC decision.", src: "https://www.cnbc.com/2026/08/19/bessent-treasury-buybacks-yields-warsh-fed.html", srcName: "CNBC" },
        { html: "<strong>Credit &mdash; HPS/Oaktree/MBS Group</strong>: Creditors led by BlackRock's HPS Investment Partners and Brookfield-owned Oaktree Capital took over Hollywood production-services supplier MBS Group after it defaulted, converting up to $900m of debt into roughly $100m of equity and committing a further $40m, with former owners Hackman Capital Partners and Affinius Capital ousted.", src: "https://www.bloomberg.com/news/articles/2026-08-19/blackrock-oaktree-seize-movie-servicer-with-900-million-debt", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Jefferies secondaries fund</strong>: Jefferies Credit Partners is targeting around &euro;1bn ($1.16bn) for a new private-credit secondaries fund that will acquire loans from its existing direct-lending portfolio and provide fresh capital for new lending, extending its push into GP-led liquidity solutions.", src: "https://www.bloomberg.com/news/articles/2026-08-19/jefferies-targets-1-billion-for-private-credit-secondaries-fund", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; Francisco Partners/Weave</strong>: Kirkland &amp; Ellis advised Francisco Partners on its agreement to take Weave Communications private for approximately $650m in cash, with Weave stockholders to receive $7.40 a share &mdash; a c.34% premium &mdash; in a deal expected to close in Q4 2026.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advises-francisco-partners-on-acquisition-of-weave-communications", srcName: "Kirkland & Ellis" },
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
