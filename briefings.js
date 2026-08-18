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
      time: "17:48 BST",
      lede: "The long-end bond sell-off deepened Tuesday &mdash; the US 30-year Treasury yield topped 5.33%, a fresh 19-year high, and the 10-year hit its highest since early 2025 &mdash; dragging the Dow, S&amp;P 500 and Nasdaq lower as chip stocks sold off; UK payroll employment fell again in July with vacancies at a five-year low, pushing sterling and gilts lower; Ares Management took control of UK broadband altnet Toob in a debt-for-equity restructuring; and English courts sanctioned New Fortress Energy's roughly $9.6bn Part 26A restructuring, believed the largest consensual Part 26A to date.",
      bullets: [
        { html: "<strong>Markets &mdash; bond sell-off</strong>: The US 30-year Treasury yield topped 5.33%, a fresh 19-year high, and the 10-year hit its highest level since early 2025, as inflation and spending concerns drove a deepening long-end sell-off that dragged the Dow, S&amp;P 500 and Nasdaq lower alongside a chip-stock sell-off.", src: "https://www.cnbc.com/2026/08/18/treasury-yields-.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK labour market</strong>: UK payroll employment fell again in July and job vacancies dropped to a five-year low, leaving sterling and gilts on the defensive and reinforcing expectations the Bank of England holds rates.", src: "https://www.bloomberg.com/news/articles/2026-08-18/uk-firms-shed-employees-wage-growth-slows-in-tepid-labor-market", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Ares/Toob</strong>: Ares Management is converting its roughly &pound;160m senior debt facility into control of UK fibre broadband altnet Toob, backed by the government-linked National Wealth Fund via the National Digital Infrastructure Fund, injecting fresh equity as existing shareholders cede control to the senior lender.", src: "https://www.bloomberg.com/news/articles/2026-08-17/ares-takes-control-of-uk-taxpayer-backed-fiber-company-toob", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; NFE Global Holdings</strong>: The English High Court (Cawson J) sanctioned New Fortress Energy's two inter-conditional Part 26A restructuring plans, extinguishing roughly $9.6bn of debt combined in what Freshfields' analysis calls the largest consensual restructuring implemented through Part 26A to date; all seven creditor classes voted in favour, avoiding a cross-class cram-down.", src: "https://www.freshfields.com/en/our-thinking/blogs/transactions/re-nfe-global-holdings-limited-english-court-sanctions-us9-6-billion-restructur-102n83q", srcName: "Freshfields" },
        { html: "<strong>Legal &mdash; Simpson Thacher/Sereni</strong>: Simpson Thacher advised funeral-services consolidator Sereni on a Pemberton Asset Management-provided unitranche financing backing its merger with and acquisition of Funeral Partners, creating a combined group of c.300 UK funeral homes operating across Belgium, the UK, Germany and Poland.", src: "https://www.stblaw.com/about-us/news/view/2026/08/10/simpson-thacher-represented-sereni-on-a-unitranche-financing-for-its-merger-with-and-acquisition-of-funeral-partners", srcName: "Simpson Thacher" },
      ],
    },
  },
};
