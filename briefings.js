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
      time: "05:26 BST",
      lede: "Markets stay caught between Mideast risk and AI optimism after Trump threatened to 'bomb' Oman as Iran vows to escalate over the Strait of Hormuz, having already sent the Dow down more than 270 points Monday on rising oil prices; a Reuters poll finds economists now agree the Fed will hold rates unchanged for the rest of the year; Clifford Chance advised Elaine and Eduardo Saverin's EE Capital in the Bezos-backed 1892 Holdings consortium's minority investment in Liverpool FC; and Clifford Chance separately advised lenders on a landmark PLN270m project financing for one of Poland's largest battery storage systems.",
      bullets: [
        { html: "<strong>Geopolitics &mdash; Iran/Oman</strong>: Markets remain caught between Mideast risk and AI optimism after President Trump threatened to 'bomb' Oman if it 'gets in the way', with Iran vowing to escalate over the Strait of Hormuz as the 60-day US-Iran ceasefire memorandum expired without an extension.", src: "https://www.cnbc.com/2026/08/18/cnbc-daily-open-trump-iran-war-nvidia-oil-markets.html", srcName: "CNBC" },
        { html: "<strong>Markets &mdash; US equities</strong>: The Dow lost more than 270 points Monday as rising oil prices, driven by the Iran/Hormuz tensions, pressured stocks.", src: "https://www.cnbc.com/2026/08/16/stock-market-today-live-updates-.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Fed</strong>: A Reuters poll of economists finds broad agreement the Fed will leave interest rates unchanged for the rest of the year.", src: "https://www.fxstreet.com/news/economists-agree-fed-to-leave-interest-rates-unchanged-this-year-reuters-poll-202608171145", srcName: "FXStreet" },
        { html: "<strong>Legal &mdash; Clifford Chance/Liverpool FC</strong>: Clifford Chance advised EE Capital &mdash; the family office of Elaine and Eduardo Saverin &mdash; on its role in the Bezos-backed 1892 Holdings consortium's strategic minority investment in Liverpool Football Club, with Fenway Sports Group retaining majority ownership and operational control.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-ee-capital-as-fenway-sports-group-agrees-strategic-minority-investment-in-liverpool-football-club.html", srcName: "Clifford Chance" },
        { html: "<strong>Legal &mdash; Clifford Chance/R.Power</strong>: Clifford Chance advised lenders Siemens Financial Services and Erste Group Bank on a PLN270m limited-recourse project-finance facility for R.Power's 150MW/300MWh Jedwabno battery storage system, the largest project-finance BESS deal completed in Poland to date.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-on-a-landmark-financing-for-one-of-the-largest-bess-projects-in-poland.html", srcName: "Clifford Chance" },
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
