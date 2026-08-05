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
      date: "2026-08-05",
      time: "05:15 BST",
      lede: "Qatar signalled progress toward a short-term US&ndash;Iran de-escalation deal overnight as the US trade deficit narrowed to $73.3bn on falling imports, UK and US services PMIs are due later today ahead of Friday&rsquo;s nonfarm payrolls, Ares and PGIM both advanced private-credit fundraising (a real-estate debt fund and a first defined-contribution CIT respectively), and the Court of Appeal struck out a warranty counterclaim in a private-equity-backed vet-group SPA dispute for playing both sides of parallel proceedings.",
      bullets: [
        { html: "<strong>Iran</strong>: Qatar signalled progress toward a short-term de-escalation arrangement between the US and Iran, a tentative easing of the risk that has been driving oil-price swings through late July.", src: "https://www.bloomberg.com/news/articles/2026-08-04/qatar-signals-progress-toward-short-term-deal-between-us-iran", srcName: "Bloomberg" },
        { html: "<strong>US data</strong>: the trade deficit narrowed to $73.3bn in June on declining imports, while JOLTS job openings came in at 7.359m &mdash; below the 7.4m estimate and down on the prior month &mdash; and Philadelphia Fed President Paulson said he remains content with rates at their current level.", src: "https://www.bloomberg.com/news/articles/2026-08-04/us-trade-deficit-narrows-to-73-3-billion-on-drop-in-imports", srcName: "Bloomberg" },
        { html: "<strong>Credit</strong>: Ares Management raised roughly $850m toward a $1.5bn target for its inaugural US &amp; Europe real-estate debt fund, while PGIM launched its first private-credit collective investment trust to broaden defined-contribution retirement-plan access to its strategies.", src: "https://www.bloomberg.com/news/articles/2026-05-21/ares-raises-850-million-for-us-and-europe-real-estate-debt-fund", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; corporate</strong>: the Court of Appeal struck out a warranty counterclaim brought against IVC Evidensia&rsquo;s Independent Vetcare over an SPA dispute, holding the claimants had approbated and reprobated by taking inconsistent positions across parallel proceedings.", src: "https://caselaw.nationalarchives.gov.uk/ewca/civ/2026/1027", srcName: "National Archives (Case Law)" },
        { html: "<strong>Week ahead</strong>: UK and US services PMIs land later today, ahead of Friday&rsquo;s US nonfarm payrolls report and US CPI on 12 August.", src: "https://www.bls.gov/schedule/news_release/empsit.htm", srcName: "BLS" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-04",
      time: "12:19 BST",
      lede: "Trump called the Iran talks the region&rsquo;s &ldquo;last chance&rdquo; to end the war as oil ticked up and US stocks held near record highs, HSBC&rsquo;s profit beat drove London higher even as AstraZeneca kept dragging on the FTSE, Barings reset a private-credit CLO into a reinvesting structure while HPS priced tighter on its latest Aqueduct deal, Weil advised Brookfield on completing full ownership of Oaktree Capital Management, and the English court sanctioned Deutsche Glasfaser&rsquo;s &euro;7bn Part 26 restructuring plan.",
      bullets: [
        { html: "<strong>Iran</strong>: Trump warned the current round of talks is Iran&rsquo;s &ldquo;last chance&rdquo; to end the war as Tehran denied negotiations were under way, with oil prices rising on the renewed uncertainty even as US equities held near record highs.", src: "https://www.cnbc.com/2026/08/04/us-iran-war-trump-hormuz.html", srcName: "CNBC" },
        { html: "<strong>UK markets</strong>: London stocks opened higher as miners offset a renewed slide in AstraZeneca, with HSBC&rsquo;s profit beat and $1bn buyback helping sentiment even as the pharma group stayed under pressure on Bristol Myers Squibb tie-up reports.", src: "https://www.proactiveinvestors.co.uk/companies/news/1096469/ftse-100-live-london-stocks-open-higher-as-miners-offset-hsbc-slide-1096469.html", srcName: "Proactive Investors" },
        { html: "<strong>CLOs</strong>: Barings reset one of its static European private-credit CLOs into a reinvesting structure, adding a new sterling tranche and tightening pricing across most of the capital stack, while HPS priced its latest Aqueduct new-issue euro CLO tighter than its prior deal.", src: "https://www.globalcapital.com/securitization/article/2gpqxqd15vvpyrj8ruubk/securitization/clos-europe/barings-converts-static-private-credit-clo-to-reinvesting-deal-in-reset", srcName: "GlobalCapital" },
        { html: "<strong>Legal &mdash; corporate/funds</strong>: Weil advised Brookfield Asset Management on completing its roughly $3bn acquisition of the ~26% of Oaktree Capital Management it did not already own, giving Brookfield full ownership and expanding its global credit platform to c.$365bn.", src: "https://www.weil.com/articles/weil-advises-brookfield-in-the-completion-of-its-acquisition-of-oaktree", srcName: "Weil" },
        { html: "<strong>Legal &mdash; restructuring</strong>: the High Court sanctioned Deutsche Glasfaser&rsquo;s single-class Part 26 scheme of arrangement, bifurcating &euro;7bn of senior debt and adding a &euro;400m super-senior facility plus &euro;845m of new equity from EQT/OMERS affiliates &mdash; Freshfields acted for the company, Linklaters for the lender syndicate.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/1563", srcName: "National Archives (Case Law)" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-04",
      time: "21:13 BST",
      lede: "AMD and SpaceX gave contrasting after-hours reactions to their Tuesday earnings, Prologis finalised terms for its $14bn/&pound;14bn takeover of Segro with Slaughter and May advising the target, US JOLTS job openings came in below estimate as Philadelphia Fed's Paulson signalled comfort with rates on hold, and law firms logged a fresh wave of M&amp;A advisory work including Clifford Chance on Bridgepoint&rsquo;s acquisition of Lansweeper and Kirkland on Park Square Capital&rsquo;s FIA commercial-rights deal.",
      bullets: [
        { html: "<strong>AMD</strong>: Q2 revenue of $11.536bn beat the ~$11.3bn Street estimate as Data Center revenue of $6.718bn (58% of sales) more than doubled year-on-year, though GAAP EPS of $1.38 missed the $1.62 consensus; shares rose about 5% after hours on a Q3 guide of ~$13bn.", src: "https://ir.amd.com/news-events/press-releases/detail/1295/amd-reports-second-quarter-2026-financial-results", srcName: "AMD (IR)" },
        { html: "<strong>SpaceX</strong>: in its first-ever quarterly report as a public company, revenue rose 92% year-on-year to $7.81bn and losses narrowed to $0.09/share, beating estimates on both lines, but shares fell roughly 15% after hours as investors focused on the imminent 6 August lock-up expiration.", src: "https://www.cnbc.com/2026/08/04/spacex-spcx-earnings-live-updates-q2-2026.html", srcName: "CNBC" },
        { html: "<strong>M&amp;A</strong>: Prologis agreed final terms for its roughly $14bn (&pound;14bn) takeover of Segro; Slaughter and May is advising Segro on the recommended share offer.", src: "https://www.bloomberg.com/news/articles/2026-08-04/prologis-agrees-final-terms-for-14-billion-segro-takeover", srcName: "Bloomberg" },
        { html: "<strong>US labour market</strong>: JOLTS job openings came in at 7.359m, below the 7.4m estimate and down on the prior month, as Philadelphia Fed President Paulson said he was content with rates at their current level while keeping an open mind.", src: "https://www.cnbc.com/2026/08/04/philadelphia-fed-president-paulson-content-with-current-rates-but-keeping-an-open-mind.html", srcName: "CNBC" },
        { html: "<strong>Legal &mdash; corporate</strong>: Clifford Chance advised Bridgepoint on its acquisition of Lansweeper, while Kirkland &amp; Ellis advised Park Square Capital on its acquisition of the commercial rights to the FIA World Rally and European Rally Championships.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-bridgepoint-on-acquisition-of-lansweeper.html", srcName: "Clifford Chance" },
      ],
    },
  },
};
