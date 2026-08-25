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
      time: "05:21 BST",
      lede: "Chip stocks sold off across Asia — South Korea's Kospi fell as much as 4.2% and Japan's Nikkei dropped over 800 points — ahead of Wednesday's Nvidia, Salesforce and CrowdStrike earnings, while Trump threatened to raise Canadian auto and steel tariffs to 50% from January 2027 and the 10-year Treasury yield eased to around 4.71% as markets look to Fed Chair Warsh's Friday Jackson Hole keynote.",
      bullets: [
        { html: "<strong>Macro &mdash; Asia tech selloff</strong>: South Korea's Kospi fell as much as 4.2% intraday and Japan's Nikkei dropped over 800 points as Samsung, SK Hynix and Kioxia all fell sharply, with risk aversion in chip names spreading ahead of Wednesday's Nvidia earnings.", src: "https://www.tradingkey.com/analysis/stocks/more/262128827-japan-south-korea-stocks-kospi-nikkei-softbank-skhynix-samsung-kioxia-tradingkey", srcName: "TradingKey" },
        { html: "<strong>Macro &mdash; Canada tariffs</strong>: Trump said tariffs on Canadian cars, trucks, auto parts and steel will rise to 50% from 1 January 2027, citing a $60bn trade deficit, after last week's breakdown in US-Canada trade talks.", src: "https://www.cnbc.com/2026/08/24/trump-canada-auto-tariffs-trade-war.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Treasury yields/Jackson Hole</strong>: The 10-year Treasury yield eased to around 4.71% on Monday as investors turned to Fed Chair Kevin Warsh's Friday Jackson Hole keynote, helped by a report that Treasury could tap its General Account to help fund bond buybacks.", src: "https://www.cnbc.com/2026/08/24/treasury-yields-warsh-jackson-hole.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Week ahead earnings</strong>: Nvidia, Salesforce and CrowdStrike all report after Wednesday's close (Nvidia consensus ~$92bn revenue), with Marvell Technology following Thursday &mdash; the results and guidance will be a key test of the AI trade heading into Jackson Hole.", src: "https://news.alphastreet.com/nvidia-nvda-q2-2027-preview-eps-est-2-09-reports-august-26/", srcName: "Alphastreet" },
        { html: "<strong>Macro &mdash; London open</strong>: The FTSE 100 traded in a narrow, mixed-to-firmer range in early Tuesday dealing, with copper miners and Airtel Africa among the early risers and no UK data due this week.", src: "https://www.proactiveinvestors.com/companies/news/1097456/ftse-100-live-london-flat-as-copper-miners-rise-1097456.html", srcName: "Proactive Investors" },
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
