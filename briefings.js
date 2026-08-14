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
      date: "2026-08-14",
      time: "13:15 BST",
      lede: "Washington's threatened 'economic isolation' plan and an indefinite naval blockade of the Strait of Hormuz pushed oil higher and dragged the FTSE 100 lower on mining weakness even as the S&amp;P 500 held a fresh record close; on the desks, Fortress priced its third European CLO at &euro;406m, Star Mountain Capital closed its inaugural CFO with Evercore, and Kirkland advised Oaktree on a $2.05bn strategic capital partnership with the Ishbia family and UWM Holdings.",
      bullets: [
        { html: "<strong>US &mdash; Iran/Hormuz</strong>: oil moved higher as Washington pressed ahead with plans for 'economic isolation' of Iran and the Navy weighed an indefinite blockade of the Strait of Hormuz, with the standoff still unresolved.", src: "https://www.cnbc.com/2026/08/14/oil-prices-today-brent-wti-hormuz.html", srcName: "CNBC" },
        { html: "<strong>Markets &mdash; US/UK</strong>: the S&amp;P 500 held its fresh record close as rate-hike worries eased, while the FTSE 100 slipped as mining stocks dragged the index lower on Hormuz-driven oil-risk jitters.", src: "https://www.investing.com/news/stock-market-news/ftse-100-today-stocks-down-as-miners-drag-index-lower-hormuz-oil-risk-weighs-4859864", srcName: "Investing.com" },
        { html: "<strong>Credit &mdash; Fortress</strong>: Fortress Investment Group priced its third European CLO, the &euro;406m Fortress Credit Europe BSL 2026-3, backed by broadly syndicated senior secured loans with a reinvestment period to April 2031.", src: "https://alternativecreditinvestor.com/2026/08/14/fortress-prices-third-european-clo-at-e406m/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Star Mountain</strong>: Star Mountain Capital completed the final close of Star Mountain CFO I, its inaugural collateralised fund obligation partnered with Evercore, giving insurers investment-grade-rated access to its US lower middle-market lending funds.", src: "https://alternativecreditinvestor.com/2026/08/14/star-mountain-hails-strong-institutional-interest-at-final-close-of-cfo-i/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Kirkland/Oaktree</strong>: Kirkland advised Oaktree Capital Management on a $2.05bn strategic capital partnership with the Ishbia family and UWM Holdings Corporation.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advises-ocm-on-capital-partnership-with-the-ishbia-family-and-uwm-holdings", srcName: "Kirkland & Ellis" },
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
