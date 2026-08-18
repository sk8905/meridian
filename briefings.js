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
      date: "2026-08-18",
      time: "09:25 BST",
      lede: "Oil and Treasury yields push higher while volatility stays low as the Iran/Oman standoff over the Strait of Hormuz drags on; UK payroll employment fell again in July with unemployment holding at 4.9%, reinforcing the case for a BoE hold; Kirkland & Ellis advised I Squared Capital on its investment in WhiteWater's Solitude Pipeline System joint venture and separately advised Brookfield on a $693.9m multifamily recapitalisation with Varia US Properties; and Park Square Capital, alongside Cosmobilis, completed its debt-and-equity-backed acquisition of the WRC and ERC rally championships' commercial rights.",
      bullets: [
        { html: "<strong>Markets &mdash; oil &amp; yields</strong>: Oil and Treasury yields pushed higher and volatility stayed low as the Iran/Oman standoff over Strait of Hormuz shipping continued into a new week.", src: "https://www.cnbc.com/2026/08/18/daily-open-oil-yields-volatility-iran-war.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK labour market</strong>: UK payroll employment fell again in July while unemployment held at 4.9%, data reinforcing expectations the Bank of England will keep rates on hold.", src: "https://www.actionforex.com/live-comments/650961-uk-payroll-employment-falls-as-uk-unemployment-holds-at-4-9/", srcName: "ActionForex" },
        { html: "<strong>Legal &mdash; Kirkland/I Squared Capital</strong>: Kirkland &amp; Ellis advised I Squared Capital on its investment alongside FIC Partners Management in WhiteWater's Solitude Pipeline System joint venture, a Permian-to-Gulf-Coast gas pipeline expected to begin operations in H2 2029.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-represents-i-squared-capital-on-investment-in-whitewater", srcName: "Kirkland & Ellis" },
        { html: "<strong>Legal &mdash; Kirkland/Brookfield</strong>: Kirkland &amp; Ellis advised Brookfield Asset Management on a recapitalisation and new joint venture with Varia US Properties covering 13 multifamily properties (~$693.9m gross asset value), with access to a further $200m of acquisition capital.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advises-brookfield-on-recapitalization-and-joint-venture-with-varia-us", srcName: "Kirkland & Ellis" },
        { html: "<strong>Credit &mdash; Park Square/Cosmobilis</strong>: Park Square Capital and Cosmobilis completed their acquisition of the commercial rights to the FIA World Rally Championship and European Rally Championship, with Park Square providing debt and equity financing &mdash; the FIA calls it the largest commercial deal in the championships' history.", src: "https://www.parksquarecapital.com/perspective/cosmobilis-and-park-square-capital-mark-the-beginning-of-a-new-era-for-the-fia-world-rally-championship/", srcName: "Park Square Capital" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-18",
      time: "12:25 BST",
      lede: "Long-dated bond yields kept climbing worldwide &mdash; the US 30-year hit its highest since 2007 &mdash; as oil and Middle East tension stayed elevated after Trump threatened to &quot;bomb&quot; Oman over the stalled Hormuz talks; in credit, Apollo Sports Capital agreed a $2.6bn financing deal with the New York Yankees, CVC Credit and RBC BlueBay each priced new CLOs, and Ninety One closed its third Africa Credit Opportunities Fund at $404m.",
      bullets: [
        { html: "<strong>Macro &mdash; bond yields</strong>: Long-term borrowing costs kept surging worldwide &mdash; the US 30-year Treasury yield hit its highest level since 2007 &mdash; as investors fret about inflation, government spending and weaker demand for duration.", src: "https://www.bloomberg.com/news/articles/2026-08-17/us-bond-selloff-drives-30-year-yields-to-the-highest-since-2007", srcName: "Bloomberg" },
        { html: "<strong>Geopolitics &mdash; Iran/Oman</strong>: President Trump threatened to &quot;bomb&quot; Oman if it &quot;gets in the way&quot; of US-Iran talks over Strait of Hormuz shipping, as Iran vowed to escalate the standoff.", src: "https://www.abc.net.au/news/2026-08-18/iran-us-memorandum-hormuz-strait/107048074", srcName: "ABC News (Australia)" },
        { html: "<strong>Credit &mdash; Apollo/Yankees</strong>: Apollo Sports Capital agreed to provide $2.6bn of debt-and-equity financing to Yankee Global Enterprises &mdash; Apollo's largest US sports investment to date &mdash; with CEO Al Tylis joining the Yankees' board while the Steinbrenner family retains full control.", src: "https://alternativecreditinvestor.com/2026/08/12/apollo-strikes-2-6bn-ny-yankees-financing-deal/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; CLOs</strong>: CVC Credit priced a $550m new-issue US CLO (Apidos LVIII) and RBC BlueBay priced a &euro;400m European CLO reset, extending its 2021-vintage BBAM Euro CLO II &mdash; both managers' several-th CLO transaction of 2026.", src: "https://alternativecreditinvestor.com/2026/08/13/cvc-credit-prices-550m-clo/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Ninety One</strong>: Ninety One held the final close of its third Africa Credit Opportunities Fund at $404m (including leverage), backed by development finance institutions, pension funds and family offices across Africa, Europe, the UK, the US and Canada.", src: "https://www.fundsglobalmena.com/ninety-one-makes-final-close-of-africa-credit-fund-at-404-million/", srcName: "Funds Global MENA" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-18",
      time: "21:29 BST",
      lede: "The US 30-year Treasury yield pushed to a fresh 19-year high above 5.33% on inflation and spending worries even as the FTSE 100 snapped its six-day losing streak on stronger oil stocks; in credit, Blackstone's BCRED and Blue Owl Technology Finance Corp both upsized investment-grade bond offerings on a pickup in BDC issuance, Barings Private Credit Corp priced $350m of notes due 2031, and Kirkland &amp; Ellis advised Vista Equity Partners on its acquisition of trust-services platform Quantios from Hg Capital and EQT.",
      bullets: [
        { html: "<strong>Macro &mdash; Treasury yields</strong>: The US 30-year Treasury yield topped 5.33%, a fresh 19-year high, as inflation and federal-spending concerns kept the global bond selloff running into the evening session.", src: "https://www.cnbc.com/2026/08/18/treasury-yields-.html", srcName: "CNBC" },
        { html: "<strong>Markets &mdash; UK equities</strong>: The FTSE 100 ended a six-day losing streak as oil stocks rallied, even as a &pound;4bn 10-year gilt auction cleared at a 5.156% yield and UK payrolls data confirmed a weakening jobs market.", src: "https://www.share-talk.com/ftse-100-ends-six-day-losing-streak-as-oil-stocks-rise/", srcName: "Reuters (via Share Talk)" },
        { html: "<strong>Credit &mdash; BDC bonds</strong>: Blackstone's BCRED priced an upsized $750m five-year investment-grade note offering (from a ~$500m target, on ~$2bn of orders) and Blue Owl Technology Finance Corp priced an upsized $400m offering at a tighter spread, one of the first tests of BDC bond appetite since the start of Q3.", src: "https://www.bloomberg.com/news/articles/2026-08-17/blackstone-blue-owl-private-credit-funds-offer-high-grade-bonds", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Barings</strong>: Barings Private Credit Corporation priced $350m of 6.500% senior notes due 2031 in a Rule 144A/Reg S offering, adding fixed-rate term debt to fund new portfolio investments and repay credit-facility borrowings.", src: "https://www.sec.gov/Archives/edgar/data/1859919/000114036126019204/ny20067676x6_424b3.htm", srcName: "SEC filing" },
        { html: "<strong>Legal &mdash; Kirkland/Vista</strong>: Kirkland &amp; Ellis advised Vista Equity Partners on its agreement to acquire Quantios, a trust and corporate-services SaaS platform serving 100+ jurisdictions, from Hg Capital and EQT, with completion expected in Q3 2026.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advises-vista-equity-partners-on-acquisition-of-quantios", srcName: "Kirkland & Ellis" },
      ],
    },
  },
};
