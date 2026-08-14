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
      date: "2026-08-14",
      time: "09:54 BST",
      lede: "Washington is preparing an 'economic isolation' plan against Iran and weighing an indefinite naval blockade of the Strait of Hormuz, keeping markets on edge ahead of today's US retail-sales print; on the desks, Janus Henderson's JAAA CLO ETF passed $30bn of assets, Blackstone Credit & Insurance led a C$2.5bn minority investment in Air Canada's Aeroplan (White & Case advising the co-investors), and Freshfields published its analysis of the High Court's stay of the Hunkemöller noteholder claim behind parallel New York litigation.",
      bullets: [
        { html: "<strong>US &mdash; Iran</strong>: the Trump administration is preparing an 'economic isolation' plan for Iran and the Navy is weighing an indefinite naval blockade of the Strait of Hormuz, with the carrier USS Abraham Lincoln still working through operational trouble in the region.", src: "https://www.cnbc.com/2026/08/14/us-iran-war-trump-hormuz-carrier-abraham-lincoln-george-washington.html", srcName: "CNBC" },
        { html: "<strong>Markets &mdash; ahead</strong>: US retail sales and core retail sales for July are due later today, the next data point markets will weigh against the Fed's 16 September decision.", src: "https://www.investing.com/news/stock-market-news/retail-sales-and-core-retail-sales-among-economic-data-due-friday-93CH-4858936", srcName: "Investing.com" },
        { html: "<strong>Credit &mdash; Janus Henderson</strong>: Janus Henderson's JAAA AAA CLO ETF, launched in 2020, surpassed $30bn in assets under management after $5.7bn of 2026 inflows, cementing its lead as the largest CLO ETF in the market.", src: "https://alternativecreditinvestor.com/2026/08/13/janus-henderson-inks-30bn-for-clo-etf/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Blackstone/Aeroplan</strong>: Blackstone Credit & Insurance led a consortium (La Caisse, PSP Investments, BCI and others) in a C$2.5bn minority equity investment for a 25% stake in Air Canada's Aeroplan loyalty program, implying a C$10bn valuation.", src: "https://www.blackstone.com/news/press/air-canada-announces-2-5-billion-minority-equity-investment-in-aeroplan-led-by-blackstone-and-la-caisse/", srcName: "Blackstone" },
        { html: "<strong>Legal &mdash; Freshfields/Hunkemöller</strong>: Freshfields analysed the High Court's decision to stay the English claim by minority Hunkemöller noteholders over a 2024 'up-tiering' restructuring, pending the more advanced parallel proceedings in New York.", src: "https://www.freshfields.com/en/our-thinking/blogs/transactions/english-court-stays-hunkemoller-lme-claim-pending-new-york-litigation-102nh5l", srcName: "Freshfields" },
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
