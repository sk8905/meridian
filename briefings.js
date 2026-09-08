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
      date: "2026-09-08",
      time: "09:11 BST",
      lede: "Tuesday morning holds the same picture as the pre-dawn update: oil paring its advance as Iran signals a Hormuz-shipping deal with Oman is close, even as it stays unclear how Washington will respond after the weekend's US strikes on Iranian tankers; Treasury Secretary Bessent's latest remarks keep markets focused on the autumn issuance calendar into Thursday's PPI and Friday's decisive CPI, while Chancellor Healey's Coventry speech reaffirmed the fiscal rules without new Budget detail and sterling firmed as the dollar faded &mdash; the credit and legal desks logged nothing new since Monday's already-tracked items, and Arrow Global and CapMan's profiles were re-checked and confirmed unchanged in this run's rotation.",
      bullets: [
        { html: "<strong>Macro &mdash; Oil eases as Iran signals Hormuz deal with Oman is close</strong>: Brent held near $97 and WTI above $92 as traders awaited details of a reported Iran-Oman accord on managing Hormuz shipping, including a temporary safe route, with Washington's response to the weekend's US strikes on Iranian tankers still unclear.", src: "https://www.bloomberg.com/news/articles/2026-09-07/latest-oil-market-news-and-analysis-for-sept-8", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Treasury Secretary Bessent addresses yields and the fiscal outlook</strong>: Bessent's latest remarks on Treasury yields and markets came as investors continued weighing the odds of a 16 September Fed hike against a heavy autumn issuance calendar.", src: "https://www.cnbc.com/2026/09/07/us-treasury-yields-markets-scott-bessent.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Chancellor Healey keeps Budget detail under wraps in pre-Budget speech</strong>: Healey's Coventry address reaffirmed Labour's fiscal rules and a &ldquo;growth, growth, growth&rdquo; message but gave no new tax or spending detail for the 28 October Budget, leaving gilt investors focused on the arithmetic rather than the rhetoric.", src: "https://www.fxstreet.com/analysis/chancellor-keeps-budget-under-wraps-as-he-promotes-growth-growth-growth-202609071005", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; Sterling climbs as the dollar fades, Hormuz risk keeps the Fed in play</strong>: GBP/USD advanced as the dollar softened even with Strait of Hormuz risk still live, keeping the 16 September FOMC and 17 September BoE decisions &mdash; a day apart &mdash; squarely in view.", src: "https://www.fxstreet.com/news/british-pound-climbs-as-usd-fades-hormuz-risk-keeps-fed-in-play-202609071651", srcName: "FXStreet" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-08",
      time: "12:36 BST",
      lede: "Oil extends gains for a third straight session as the US-Iran clash keeps the Strait of Hormuz standoff live and Bloomberg flags a widening wall of political and economic risk into the 16 September FOMC, while UK gilt investors reckon Chancellor Healey's fiscal room has been roughly halved by the summer's bond sell-off ahead of the 28 October Budget; the credit desk adds a new UK real-estate lender in Pluto Finance and logs Bridgepoint Credit's &euro;1.2bn continuation-vehicle transfer to Pantheon, alongside a rotating re-verification lifting Schroders Capital's AUM to $113.7bn, while legal logs no new tracked-firm alerts this run.",
      bullets: [
        { html: "<strong>Macro &mdash; Oil extends gains for a third session as US-Iran conflict escalates</strong>: Brent rose to about $97 and WTI to roughly $92.50 after the US and Iran traded strikes over the weekend, with Goldman Sachs lifting its December 2026 Brent and WTI forecasts by $5 to $85 and $80 a barrel respectively.", src: "https://www.cnbc.com/2026/09/08/oil-prices-today-brent-wti-hormuz-iran-war.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Bloomberg: a widening wall of political and economic risk faces markets</strong>: equities are caught between resilient earnings and mounting macro risk &mdash; a possible September Fed hike, the escalating Middle East conflict and unresolved US midterm uncertainty &mdash; that together argue for portfolio protection into year-end.", src: "https://www.bloomberg.com/news/articles/2026-09-08/wall-of-political-and-economic-risks-is-growing-taking-stock", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Gilt sell-off has already halved Healey's fiscal room for tax rises</strong>: this summer's run-up in UK borrowing costs has cut the Chancellor's fiscal headroom to roughly &pound;13bn from &pound;23.6bn at the Spring Statement, sharply narrowing his margin of error ahead of the 28 October Budget.", src: "https://www.techtimes.com/articles/326863/20260907/uk-budget-2026-bond-market-has-already-halved-healeys-fiscal-room-tax-rises.htm", srcName: "Tech Times" },
        { html: "<strong>Credit &mdash; Bridgepoint Credit transfers &euro;1.2bn into a Pantheon-led continuation vehicle</strong>: loans from the 2017-vintage Bridgepoint Direct Lending II fund moved into an oversubscribed CV led by secondaries investor Pantheon, giving BDL II investors a liquidity option while Bridgepoint retains management of the European mid-market portfolio.", src: "https://alternativecreditinvestor.com/2026/09/08/bridgepoint-transfers-e1-2bn-into-pantheon-led-cv/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Pluto Finance tops &pound;500m and expands into continental Europe</strong>: the UK development and bridging lender's evergreen Lending Vehicle VIII passed &pound;500m of commitments and is expanding into Germany, the Netherlands, Ireland, Spain and Portugal, targeting roughly a fifth of financing from the continent.", src: "https://alternativecreditinvestor.com/2026/09/08/pluto-finance-targets-europe-as-flagship-fund-tops-500m/", srcName: "Alternative Credit Investor" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-08",
      time: "17:26 BST",
      lede: "Tuesday evening's new items come mostly from the legal desk &mdash; a Commercial Court ruling upholding a lender-side valuation that triggered a cash-trap event on a &euro;1.2bn Brussels office facility, Clifford Chance's advice to ICG on buying Westerleigh Group from Ontario Teachers' and USS, and Slaughter and May acting for Mediclinic on its recommended &pound;1.03bn cash offer for Spire Healthcare &mdash; while macro stays fixed on Canada's $27.6bn retaliatory tariffs taking effect and UK gilt investors digesting Chancellor Healey's insistence that borrowing remains too high after Tuesday's syndication priced at the highest yield premium since 1998; credit logs no new deals this run after a rotation re-verification of Rantum Capital, Alantra Private Debt and Penny Blue Capital found no material change.",
      bullets: [
        { html: "<strong>Legal &mdash; Commercial Court upholds lender's valuation in &euro;1.2bn Brussels cash-trap dispute</strong>: Robin Knowles J dismissed a borrower challenge to a JLL valuation that had triggered a Cash Trap Event on a &euro;1.2bn Brussels office-building facility; South Square acted for the successful lender defendant.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/comm/2026/2321", srcName: "National Archives" },
        { html: "<strong>Legal &mdash; Clifford Chance advises ICG on buying Westerleigh Group from Ontario Teachers' and USS</strong>: the firm acted for ICG on its agreement to acquire the crematoria and cemetery operator from the two pension-fund owners.", src: "https://www.cliffordchance.com/news/news/2026/09/clifford-chance-advises-icg-on-its-agreement-to-acquire-westerleigh-group-from-ontario-teachers-and-uss.html", srcName: "Clifford Chance" },
        { html: "<strong>Legal &mdash; Slaughter and May advises Mediclinic on &pound;1.03bn recommended cash offer for Spire Healthcare</strong>: the firm is acting for Mediclinic on the takeover of the London-listed hospital group.", src: "https://www.slaughterandmay.com/recent-work/mediclinic-in-connection-with-the-c-1bn-recommended-cash-offer-for-spire-healthcare-group-plc/", srcName: "Slaughter and May" },
        { html: "<strong>Macro &mdash; UK set to pay most since 1998 for borrowing after gilt sell-off</strong>: Tuesday's gilt syndication priced at the widest yield premium since 1998, a fresh sign of investor caution as Chancellor Healey said UK borrowing remains too high just weeks before the 28 October Budget.", src: "https://www.bloomberg.com/news/articles/2026-09-08/uk-set-to-pay-most-since-1998-for-borrowing-after-gilt-selloff", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Canada's $27.6bn retaliatory tariffs take effect as US trade rift deepens</strong>: Ottawa's countermeasures on hundreds of American products came into force, escalating the tit-for-tat that began with Washington's earlier tariffs on Canadian goods.", src: "https://www.cnbc.com/2026/09/08/canada-retaliatory-tariffs.html", srcName: "CNBC" },
      ],
    },
  },
};
