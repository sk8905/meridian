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
      date: "2026-08-17",
      time: "09:28 BST",
      lede: "Goldman Sachs says markets are too hawkish betting on a Fed hike, with a September rate rise now 'very unlikely'; Clifford Chance advised a GIP/BlackRock fund on the sale of its 187MW Taiwan solar portfolio and separately advised on a $130m reopening of MSU Green Energy's Argentine notes; Canyon Partners closed its third CLO of 2026 at $500m; and UK gilt yields stay elevated even as sterling firms toward 1.36 against the dollar.",
      bullets: [
        { html: "<strong>Markets &mdash; Fed</strong>: Goldman Sachs argues traders have priced in too much chance of a Fed hike, with a September rate rise now 'very unlikely' given softer retail sales, weak payrolls and cooling inflation prints.", src: "https://www.bloomberg.com/news/articles/2026-08-17/goldman-says-markets-too-hawkish-on-betting-fed-will-hike-rates", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; Clifford Chance/GIP</strong>: Clifford Chance advised a fund managed by Global Infrastructure Partners, part of BlackRock, on the sale of its 187MW, 42-project operational solar portfolio in Taiwan to J&amp;V Energy Technology Co. Ltd.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-a-fund-managed-by-global-infrastructure-partners-a-part-of-blackrock-on-the-sale-of-a-solar-portfolio-in-taiwan.html", srcName: "Clifford Chance" },
        { html: "<strong>Legal &mdash; Clifford Chance/MSU Green Energy</strong>: Clifford Chance advised initial purchaser Santander US Capital Markets and DFI investors DEG and FinDev Canada on a $130m reopening of MSU Green Energy's senior secured notes.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-on-senior-secured-notes-issuance-by-arge.html", srcName: "Clifford Chance" },
        { html: "<strong>Credit &mdash; Canyon Partners</strong>: Canyon Partners closed Canyon CLO 2026-2 at $500m, its third CLO of the year and 30th active vehicle, taking its CLO platform to $13bn of AUM.", src: "https://alternativecreditinvestor.com/2026/08/13/canyon-partners-hits-500m-with-latest-clo/", srcName: "Alternative Credit Investor" },
        { html: "<strong>UK &mdash; rates &amp; sterling</strong>: UK gilt yields remain elevated on fiscal and energy-cost pressure even as yield support lifts sterling toward 1.36 against the dollar.", src: "https://www.exchangerates.org.uk/news/46876/2026-08-17-scotiabank-pound-to-dollar-forecast-yield-support-lifts-gbp-towards-1-36.html", srcName: "Exchange Rates UK" },
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
      time: "17:20 BST",
      lede: "New York's Empire State manufacturing survey smashed forecasts at 20.6, its best reading in over four years, adding a bright spot to Goldman Sachs' view that markets are too hawkish on a Fed hike; White &amp; Case advised China Chunlai Education on its $127.5m acquisition of Dublin Business School; Partners Group secured a $1bn Asia private-credit mandate; and City AM warned US bond-market jitters could push the UK into recession.",
      bullets: [
        { html: "<strong>Macro &mdash; US manufacturing</strong>: The NY Fed's Empire State index jumped to 20.6 in August (from 15.6 in July), crushing the roughly 11 consensus for its best reading in more than four years, with new orders and employment sub-indices both climbing.", src: "https://www.investing.com/news/economic-indicators/empire-state-manufacturing-index-surges-surpassing-expectations-93CH-4863068", srcName: "Investing.com" },
        { html: "<strong>Markets &mdash; Fed</strong>: Goldman Sachs argues traders have priced in too much chance of a September Fed hike, citing softer retail sales, weak payrolls and cooling inflation prints.", src: "https://www.bloomberg.com/news/articles/2026-08-17/goldman-says-markets-too-hawkish-on-betting-fed-will-hike-rates", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; White &amp; Case/China Chunlai</strong>: White &amp; Case advised Hong Kong-listed China Chunlai Education on its proposed $127.5m acquisition of Dublin Business School from Kaplan International UK Holdings, including assignment of the 'DBS' trademarks across Ireland, the UK and the EU.", src: "https://www.whitecase.com/news/press-release/white-case-advises-china-chunlai-education-acquisition-dublin-business-school", srcName: "White & Case" },
        { html: "<strong>Credit &mdash; Partners Group</strong>: Partners Group secured a $1bn open-ended evergreen mandate to run Asia private credit, spanning senior and junior direct lending across the region.", src: "https://www.privateequitywire.co.uk/partners-group-secures-1bn-asia-private-credit-mandate/", srcName: "Private Equity Wire" },
        { html: "<strong>UK &mdash; rates</strong>: City AM warned the UK could face a recession an 'order of magnitude' greater than recent crises if US borrowing costs keep climbing, after the 13 August 30-year Treasury auction cleared at 5.216%, its highest since 2001.", src: "https://www.cityam.com/us-bond-market-jitters-spark-uk-economy-recession-warning/", srcName: "City AM" },
      ],
    },
  },
};
