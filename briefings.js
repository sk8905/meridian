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
      date: "2026-08-13",
      time: "09:27 BST",
      lede: "UK Q2 GDP grew 0.4% q/q despite Iran-war disruption while Asian stocks rallied on soft US CPI and an AI-earnings boost, with the Strait of Hormuz standoff still unresolved; on the desks, CVC Credit priced its fourth new-issue US CLO of 2026, Weil advised Sunstream USA on a $1.1bn parallel restructuring of Parallel's cannabis assets, and HSF Kramer advised on both a SEVER Life Sciences disposal and a $2.7bn Squadron Energy renewables financing.",
      bullets: [
        { html: "<strong>UK &mdash; Q2 GDP</strong>: the ONS confirmed the UK economy grew 0.4% q/q (1.2% y/y) in Q2, with a June rebound offering a brighter signal despite disruption from the Iran war.", src: "https://www.bloomberg.com/news/articles/2026-08-13/uk-economy-weathers-early-months-of-iran-war-with-0-4-growth", srcName: "Bloomberg" },
        { html: "<strong>Markets &mdash; Asia/CPI</strong>: Asian stocks rose as the in-line July US CPI print dented September Fed rate-hike bets, with an AI-earnings rally adding to the gains.", src: "https://www.fxstreet.com/news/asian-stocks-rise-on-soft-us-cpi-ai-earnings-rally-202608130351", srcName: "FXStreet" },
        { html: "<strong>Markets &mdash; Hormuz</strong>: traffic through the Strait of Hormuz remained low as Trump asserted US control over the strait and tensions with Iran stayed elevated.", src: "https://www.cnn.com/2026/08/13/world/live-news/iran-war-trump", srcName: "CNN" },
        { html: "<strong>Credit &mdash; CVC Apidos LVIII</strong>: CVC Credit priced Apidos LVIII, a $550m US CLO and its fourth new-issue CLO globally this year, with Bank of America as lead arranger.", src: "https://www.cvc.com/media/news/2026/cvc-credit-prices-apidos-lviii-its-fourth-new-issue-clo-globally-of-2026/", srcName: "CVC" },
        { html: "<strong>Legal &mdash; Weil/Sunstream</strong>: Weil guided Sunstream USA through a $1.1bn parallel restructuring, extinguishing more than 90% of Parallel's cannabis-business debt via a foreclosure acquisition.", src: "https://www.weil.com/articles/weil-guides-sunstream-usa-through-1-1b-parallel-restructuring", srcName: "Weil" },
        { html: "<strong>Legal &mdash; HSF Kramer</strong>: HSF Kramer advised SEVER Life Sciences on its sale of Nordic Group to Alfasigma, and separately advised Squadron Energy on a $2.7bn renewable-energy portfolio project financing.", src: "https://www.mondaq.com/pressrelease/205110/herbert-smith-freehills-kramer-advises-squadron-energy-on-$27-billion-renewable-energy-portfolio-project-financing", srcName: "HSF Kramer" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-13",
      time: "12:31 BST",
      lede: "The FTSE 100 joined a global rally and sterling steadied after Q2 UK GDP grew an in-line 0.4% q/q, with US markets awaiting today's July PPI print &mdash; the last inflation read before the Fed's 16 September decision; on the desks, Churchill Asset Management launched a TIAA-backed capital solutions strategy, and White &amp; Case advised on Lakeshore Recycling Systems' $665m credit-facilities refinancing.",
      bullets: [
        { html: "<strong>UK &mdash; Q2 GDP</strong>: the ONS confirmed the UK economy grew 0.4% q/q (1.2% y/y) in Q2, weathering the early months of the Iran war, with a June rebound on hot weather and World Cup demand offsetting a softer April&ndash;May patch.", src: "https://www.bloomberg.com/news/articles/2026-08-13/uk-economy-weathers-early-months-of-iran-war-with-0-4-growth", srcName: "Bloomberg" },
        { html: "<strong>Markets &mdash; FTSE/pound</strong>: the FTSE 100 tracked a global rally and the pound steadied on the in-line GDP print, with traders still weighing gilts, the Hormuz standoff and Jaguar Land Rover headlines.", src: "https://www.bloomberg.com/news/live-blog/2026-08-13/ftse-100-live-uk-gdp-pound-gilts-trump-iran-oil-prices-hormuz-jlr-ai-stocks-what-s-moving-uk-markets-right-now-markets-today-msr3mc9u", srcName: "Bloomberg" },
        { html: "<strong>Markets &mdash; PPI ahead</strong>: economists expect a subdued July US PPI print later Thursday, the final inflation data point before the Fed's 16 September meeting, following Wednesday's in-line CPI.", src: "https://continuumeconomics.com/a/b6e8faf2/preview-due-august-13-us-july-ppi-prices-seen-subdued-when-data-was-surveyed", srcName: "Continuum Economics" },
        { html: "<strong>Credit &mdash; Churchill/TIAA</strong>: Churchill Asset Management launched a new capital solutions strategy backed by parent TIAA, led by Noah Charney and drawing on sister firm Arcmont's expertise via the ~$99bn Nuveen Private Capital platform.", src: "https://alternativecreditinvestor.com/2026/08/12/churchill-launches-capital-solutions-strategy-backed-by-tiaa/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; White &amp; Case/Lakeshore</strong>: White &amp; Case advised Lakeshore Recycling Systems on a $665m refinancing of its credit facilities.", src: "https://www.whitecase.com/news/press-release/white-case-advises-lakeshore-recycling-systems-us665-million-credit-facilities", srcName: "White & Case" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-13",
      time: "21:36 BST",
      lede: "US stocks closed at fresh records as July PPI undershot forecasts and Applied Materials beat estimates but slid after-hours on a free-cash-flow slump, while the FTSE 100 closed lower despite in-line UK Q2 growth; on the desks, TDR Capital is weighing a sale of private-credit manager Arrow Global, and Macfarlanes and Clifford Chance advised opposite sides of Apollo-managed funds' recommended £5.7bn takeover offer for easyJet.",
      bullets: [
        { html: "<strong>Markets &mdash; equity close</strong>: the S&amp;P 500 closed at a fresh record high as oil prices and producer-price inflation both eased, extending Wall Street's rally into the close.", src: "https://www.detroitnews.com/story/business/2026/08/13/sp-500-hits-record-high-as-oil-producer-inflation-weaken/91285508007/", srcName: "AP (Detroit News)" },
        { html: "<strong>Markets &mdash; Applied Materials</strong>: AMAT posted a sixth straight earnings beat (non-GAAP EPS $3.50, revenue $9.115bn vs $9.0bn est.) and raised its FY26 semiconductor-equipment growth outlook above 30%, but shares fell as much as 4% after-hours (settling near -2.5%) as free cash flow fell roughly 80% y/y to $210m against the record revenue.", src: "https://www.tradingkey.com/analysis/stocks/us-stocks/262098841-applied-materials-amat-q3-earnings-august-13-2026-semiconductor-equipment-ai-tradingkey", srcName: "TradingKey" },
        { html: "<strong>UK &mdash; FTSE close</strong>: the FTSE 100 closed 0.76% lower, giving back the session's earlier gains despite the in-line 0.4% q/q Q2 GDP print.", src: "https://tradingeconomics.com/united-kingdom/stock-market/news/525435", srcName: "TradingEconomics" },
        { html: "<strong>Credit &mdash; Arrow Global/TDR Capital</strong>: TDR Capital is exploring a sale of UK private-credit manager Arrow Global, according to people familiar with the matter.", src: "https://www.bloomberg.com/news/articles/2026-08-12/tdr-is-said-to-explore-sale-of-uk-private-credit-manager-arrow", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; Macfarlanes/Clifford Chance/easyJet</strong>: Macfarlanes advised Sir Stelios Haji-Ioannou and easyGroup on Apollo-managed funds' recommended £5.7bn takeover offer for easyJet, while Clifford Chance advised easyJet on the other side of the deal.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-easyjet-on-the-recommended-p5-7-billion-takeover.html", srcName: "Clifford Chance" },
      ],
    },
  },
};
