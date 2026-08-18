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
      date: "2026-08-17",
      time: "12:42 BST",
      lede: "China's economy slowed further in July with retail sales, investment and industrial output all missing forecasts, Strait of Hormuz shipping ground to a halt as the US-Iran ceasefire memorandum expired, Partners Group secured a $1bn Asia private-credit mandate, Cleary Gottlieb advised Sixth Street on the &euro;3.75bn final close of its third European specialty-lending fund, and Latham advised Realty Income on a $1bn convertible notes offering.",
      bullets: [
        { html: "<strong>Macro &mdash; China</strong>: China's economy slowed further in July &mdash; retail sales barely grew, the investment slump steepened and urban unemployment ticked up to 5.2% &mdash; a broad-based miss weighing on Asian markets and global growth sentiment.", src: "https://www.cnbc.com/2026/08/17/china-economy-sales-investment-july-.html", srcName: "CNBC" },
        { html: "<strong>Geopolitics &mdash; Hormuz</strong>: Strait of Hormuz shipping ground to a halt &mdash; just five cargo ships transited on Saturday and none on Sunday, versus 31 the prior weekend &mdash; as the 60-day US-Iran memorandum of understanding on the Strait expired Monday with little sign of an extension.", src: "https://www.cnbc.com/2026/08/17/us-iran-war-trump-hormuz.html", srcName: "CNBC" },
        { html: "<strong>Credit &mdash; Partners Group</strong>: Partners Group secured a $1bn open-ended evergreen mandate to run Asia private credit, spanning senior and junior direct lending across the region.", src: "https://www.privateequitywire.co.uk/partners-group-secures-1bn-asia-private-credit-mandate/", srcName: "Private Equity Wire" },
        { html: "<strong>Legal &mdash; Cleary/Sixth Street</strong>: Cleary Gottlieb advised Sixth Street on the formation of Sixth Street Specialty Lending Europe III, which closed at its &euro;3.75bn hard cap.", src: "https://www.clearygottlieb.com/news-and-insights/news-listing/sixth-street-forms-sle-iii", srcName: "Cleary Gottlieb" },
        { html: "<strong>Legal &mdash; Latham/Realty Income</strong>: Latham &amp; Watkins advised Realty Income on its $1bn convertible senior notes offering, which closed 14 August.", src: "https://www.lw.com/en/news/2026/08/latham-advises-realty-income-on-convertible-senior-notes-offering", srcName: "Latham & Watkins" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-17",
      time: "21:19 BST",
      lede: "President Trump threatened to 'bomb' Oman if it 'gets in the way', as the 60-day US-Iran ceasefire memorandum expired Monday with no extension agreed, sending the 30-year Treasury yield to its highest level in decades and dragging the Dow, S&amp;P and Nasdaq lower; Kirkland &amp; Ellis advised Blackstone-backed NEC Group on a &pound;704m refinancing of its Birmingham venues; and UK strain deepened, with Rightmove reporting its steepest August asking-price drop in eight years and City AM warning of recession risk from rising US borrowing costs.",
      bullets: [
        { html: "<strong>Geopolitics &mdash; Iran/Oman</strong>: President Trump threatened to 'bomb' Oman if it 'gets in the way' of US-Iran negotiations, as the 60-day ceasefire memorandum on Strait of Hormuz shipping expired Monday with no extension agreed, renewing escalation risk.", src: "https://www.cnbc.com/2026/08/17/us-iran-war-trump-hormuz.html", srcName: "CNBC" },
        { html: "<strong>Markets &mdash; US equities</strong>: The Dow, S&amp;P 500 and Nasdaq all fell as the 30-year Treasury yield pushed to its highest level in decades on the renewed Iran/Oman escalation risk.", src: "https://finance.yahoo.com/markets/live/stock-market-today-monday-august-17-dow-sp-500-nasdaq-094421171.html", srcName: "Yahoo Finance" },
        { html: "<strong>Legal &mdash; Kirkland/NEC Group</strong>: Kirkland &amp; Ellis advised Blackstone-backed NEC Group on a &pound;704m refinancing of its Birmingham exhibition and arena venues (NEC, Vox, Utilita Arena, bp pulse LIVE, ICC) via a &pound;653m CMBS term facility plus a &pound;51m capex facility, signed 10 July and settled 24 July 2026.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advises-blackstone-backed-nec-on-refinancing-debt-with-704-m-facilities-agreement", srcName: "Kirkland & Ellis" },
        { html: "<strong>UK &mdash; housing</strong>: Rightmove reported the largest August drop in asking prices in eight years, as sellers cut prices to compete for a smaller pool of buyers.", src: "https://www.mortgagesolutions.co.uk/mortgage-news/2026/08/17/largest-august-asking-price-drop-in-eight-years-rightmove/", srcName: "Mortgage Solutions" },
        { html: "<strong>UK &mdash; rates</strong>: City AM warned the UK could face a recession an 'order of magnitude' greater than recent crises if US borrowing costs keep climbing, as US bond-market jitters spill into UK gilts.", src: "https://www.cityam.com/us-bond-market-jitters-spark-uk-economy-recession-warning/", srcName: "City AM" },
      ],
    },
  },
};
