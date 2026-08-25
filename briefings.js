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
      date: "2026-08-25",
      time: "09:28 BST",
      lede: "The dollar struggled for traction and gold held near a three-month high as markets weighed new Iran sanctions and Treasury's bond-buyback plans ahead of Fed governor Kevin Warsh's debut Jackson Hole speech on Friday, while UK papers speculated over which taxes Burnham and Healey will raise in the Autumn Budget; in legal, Latham & Watkins and Ropes & Gray/Simpson Thacher led a run of new capital-markets and M&A alerts, including Genstar Capital's acquisition of Oncourse Home Solutions from Apax-advised funds.",
      bullets: [
        { html: "<strong>Macro &mdash; Dollar/Iran sanctions</strong>: The dollar struggled for traction as markets weighed the latest US sanctions on Iran alongside Treasury's bond-buyback programme, with Fed governor Kevin Warsh's Friday Jackson Hole speech now the week's key catalyst.", src: "https://www.cnbc.com/2026/08/25/dollar-wobbles-as-markets-weigh-iran-sanctions-treasury-buybacks.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Gold</strong>: Gold held near a three-month high as traders weighed the Treasury's debt-management moves and positioned ahead of Jackson Hole.", src: "https://www.bloomberg.com/news/articles/2026-08-24/gold-holds-near-three-month-high-as-traders-weigh-treasury-moves", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Bonds/Jackson Hole</strong>: Bond-market anxiety is raising the stakes for Warsh's debut Jackson Hole speech, with investors looking for signals on the September rate path.", src: "https://www.investing.com/news/economy-news/bond-market-anxiety-raises-stakes-for-warshs-debut-jackson-hole-speech-4872977", srcName: "Investing.com" },
        { html: "<strong>Macro &mdash; UK Budget</strong>: Speculation intensified over which taxes Burnham and Healey will raise in the Autumn Budget, with CityAM running through the options facing the government.", src: "https://www.cityam.com/budget-2026-which-taxes-will-burnham-and-healey-hike/", srcName: "CityAM" },
        { html: "<strong>Legal &mdash; Genstar/Oncourse</strong>: Simpson Thacher and Ropes &amp; Gray advised on Genstar Capital's acquisition of Oncourse Home Solutions from Apax-advised funds, the latest in a run of new Latham &amp; Watkins- and Ropes &amp; Gray-led capital-markets alerts this week.", src: "https://www.ropesgray.com/en/news-and-events/news/2026/08/ropes-gray-advised-genstar-capital-on-acquisition-of-oncourse-home-solutions", srcName: "Ropes & Gray" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-24",
      time: "12:24 BST",
      lede: "Oil slipped and US futures traded mixed as markets awaited Treasury Secretary Bessent's 2pm ET press conference detailing new Iran sanctions, with Ottawa also vowing dollar-for-dollar retaliatory tariffs after US-Canada trade talks broke down; in credit, Royal London Asset Management's two European CLOs (Hambridge I and II) join the tracked roster; and in legal, Clifford Chance advised MUFG on a US$4.6bn structured-notes issuance programme.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran/oil</strong>: Brent slipped roughly 1.3% to about $93.16 and WTI fell to $85.70 as markets awaited Treasury Secretary Bessent's 2pm ET press conference detailing the 'toughest' US sanctions yet on Iran and its trading partners.", src: "https://www.cnbc.com/2026/08/24/oil-price-today-wti-brent-us-sanctions-iran.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Markets</strong>: US futures traded mixed to start the week as Ottawa vowed dollar-for-dollar retaliatory tariffs after US-Canada trade talks collapsed, ahead of a week headlined by Nvidia earnings (26 Aug) and the Jackson Hole symposium (27-29 Aug).", src: "https://finance.yahoo.com/markets/live/stock-market-today-monday-august-24-dow-sp-500-nasdaq-080306047.html", srcName: "Yahoo Finance" },
        { html: "<strong>Credit &mdash; Royal London/CLOs</strong>: Royal London Asset Management, the insurer-owned manager's £199bn asset-management arm, has built out a European leveraged-finance desk and priced two CLOs since September 2025 &mdash; the €434m debut Hambridge CLO I and a €500m upsized Hambridge CLO II in February, the largest European CLO priced year-to-date at launch.", src: "https://www.rlam.com/uk/institutional-investors/press-centre/2026/royal-london-asset-management-successfully-launches-500-million-hambridge-clo-ii--the-largest-european-clo-year-to-date/", srcName: "RLAM" },
        { html: "<strong>Legal &mdash; Clifford Chance/MUFG</strong>: Clifford Chance advised MUFG Bank and MUFG Securities EMEA on establishing and expanding structured-notes issuance programmes, including a US$4.6bn programme for MUFG Bank, supporting the group's push into investor bases beyond Japan and into EMEA and Asia.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-mufg-on-expansion-of-structured-notes-business.html", srcName: "Clifford Chance" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-24",
      time: "21:29 BST",
      lede: "Treasury Secretary Bessent's 'economic D-Day' sanctions push on Iran dragged the S&amp;P 500 and Nasdaq lower into the close on a chip-stock selloff, even as the FTSE 100 rallied 0.4% and sterling held near six-month highs; in credit, Castlelake's up-to-$4bn Upstart forward-flow deal and a new LGPS Central mandate into Invesco's €500m European real-estate debt fund are the freshest prints; and in legal, South Square's note on a Royal Court of Jersey summary judgment for c.£77m against former Gold &amp; General directors is today's newest alert, alongside three new High Court rulings across restructuring/insolvency and corporate-fraud disputes.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran sanctions</strong>: Treasury Secretary Bessent announced a campaign of 'economic onslaught' sanctions against Iran and its trading partners, framed by the administration as an economic 'D-Day', rattling markets already on edge over the Strait of Hormuz.", src: "https://www.axios.com/2026/08/24/bessent-dday-iran-secondary-sanctions", srcName: "Axios" },
        { html: "<strong>Macro &mdash; US close</strong>: The S&amp;P 500 and Nasdaq slipped as a chip-stock selloff compounded the Iran-sanctions jitters, testing markets in what's shaping up as a high-stakes week into Nvidia earnings and Jackson Hole.", src: "https://www.detroitnews.com/story/business/2026/08/24/sp-500-nasdaq-slip-as-iran-tensions-test-markets-in-high-stakes-week/91440717007/", srcName: "Reuters via Detroit News" },
        { html: "<strong>Macro &mdash; UK close</strong>: The FTSE 100 closed 0.4% higher even as the US-Iran standoff escalated, with sterling holding near six-month highs against the dollar.", src: "https://www.fxstreet.com/news/british-pound-holds-near-six-month-highs-as-debt-woes-keep-us-dollar-rallies-shallow-202608240737", srcName: "FXStreet" },
        { html: "<strong>Credit &mdash; Castlelake/Upstart</strong>: Castlelake-managed funds agreed a multi-year forward-flow deal to purchase up to $4bn of Upstart-originated consumer loans &mdash; the largest transaction yet in a relationship dating to 2023 &mdash; while LGPS Central separately backed Invesco's European real-estate debt fund as it reached &euro;500m.", src: "https://alternativecreditinvestor.com/2026/07/29/upstart-signs-4bn-forward-flow-agreement-with-castlelake/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; South Square/Jersey</strong>: South Square's note details a Royal Court of Jersey summary judgment of roughly &pound;77m against two former Gold &amp; General directors over an allegedly improper transfer of Metallon Corporation shares &mdash; today's newest legal alert, alongside fresh High Court rulings in a Leeds insolvency dispute and an API v Mazzagatti corporate-fraud claim.", src: "https://southsquare.com/summary-judgment-for-77m-against-former-directors-of-jersey-company-wood-adam-v-khumalo-and-ors-2026-jrc-202/", srcName: "South Square" },
      ],
    },
  },
};
