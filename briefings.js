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
      date: "2026-08-15",
      time: "09:27 BST",
      lede: "CVC Credit priced a $550m CLO and Apollo agreed a $2.6bn financing deal with the New York Yankees as the private-credit desk stayed busy into the weekend, ONS confirmed the UK economy grew 0.4% in Q2 despite Iran-war disruption, and Elliott escalated its activist campaign at Northern Star Resources.",
      bullets: [
        { html: "<strong>Credit &mdash; CVC</strong>: CVC Credit priced Apidos LVIII, a $550m CLO and its fourth new-issue CLO globally in 2026, with Bank of America as lead arranger, pricing at market tights with strong demand across the capital stack.", src: "https://alternativecreditinvestor.com/2026/08/13/cvc-credit-prices-550m-clo/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Apollo/Yankees</strong>: Apollo Sports Capital agreed a $2.6bn debt-and-equity financing with Yankee Global Enterprises, its largest US sports investment to date, with Apollo Sports Capital CEO Al Tylis joining YGE's board.", src: "https://www.bloomberg.com/news/articles/2026-08-11/apollo-inks-2-6-billion-financing-deal-with-new-york-yankees", srcName: "Bloomberg" },
        { html: "<strong>UK &mdash; GDP</strong>: ONS preliminary figures showed UK GDP up 0.4% q/q in Q2 2026 (1.2% y/y), a slowdown from Q1's 0.6% but a sign the economy has largely weathered the Iran-war energy shock and the political transition to PM Burnham.", src: "https://www.ons.gov.uk/economy/grossdomesticproductgdp/bulletins/gdpfirstquarterlyestimateuk/apriltojune2026", srcName: "ONS" },
        { html: "<strong>Markets &mdash; Elliott/Northern Star</strong>: Elliott Investment Management, a c.5.6% holder, escalated its activist campaign at Northern Star Resources, calling the board's response to its renewal and strategic-review demands \"entrenchment\".", src: "https://www.prnewswire.com/news-releases/elliott-management-sends-letter-to-northern-star-resources-ltd-board-of-directors-302849202.html", srcName: "PR Newswire" },
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
      date: "2026-08-14",
      time: "17:46 BST",
      lede: "US retail sales unexpectedly fell 0.6% in July and consumer sentiment slid to a three-month low, reinforcing bets the Fed holds at its 16 September meeting, while UK asset-swap spreads held steady less than three months before PM Andy Burnham's debut Budget; on the desks, HSF Kramer's daily FSR update covered the FCA's Early and High Growth Oversight pilot findings, and two UAE-flagged tankers were attacked transiting the Strait of Hormuz.",
      bullets: [
        { html: "<strong>US &mdash; retail sales</strong>: July retail sales fell 0.6% m/m to $763.6bn against a +0.1% consensus, the Census Bureau's advance estimate showed, as fading government tax refunds weighed on spending.", src: "https://www.cnn.com/2026/08/14/economy/us-retail-sales-july", srcName: "CNN" },
        { html: "<strong>US &mdash; consumer sentiment</strong>: the University of Michigan's preliminary August sentiment gauge fell to 51.0 (vs 54.5 expected) from July's final 55.2, with year-ahead inflation expectations rising to 4.3%.", src: "https://www.bloomberg.com/news/articles/2026-08-14/us-consumer-sentiment-declines-for-first-time-in-three-months", srcName: "Bloomberg" },
        { html: "<strong>UK &mdash; gilts/Burnham</strong>: UK asset-swap spreads have held steady less than three months before the Burnham government's debut Budget, a reversal from July's fiscal-flexibility scare.", src: "https://www.bloomberg.com/news/articles/2026-08-14/a-popular-uk-bond-trade-suggests-markets-trust-burnham-for-now", srcName: "Bloomberg" },
        { html: "<strong>Geopolitics &mdash; Hormuz</strong>: two UAE-flagged tankers, the Navig8 Messi and Tarif, were hit by UAVs on 13 August transiting the Strait of Hormuz, with the UAE and Bahrain attributing the attacks to Iran's IRGC.", src: "https://www.usnews.com/news/world/articles/2026-08-14/2-uae-tankers-attacked-while-transiting-strait-of-hormuz-and-other-news-from-the-middle-east", srcName: "Washington Post (via US News)" },
        { html: "<strong>Legal &mdash; HSF Kramer</strong>: HSF Kramer's Daily FSR Update covered the FCA's Early and High Growth Oversight pilot findings (15 asset-management, wealth-management and payments firms) and the pensions Value for Money Framework consultation, closing 15 September 2026.", src: "https://www.hsfkramer.com/notes/fsrandcorpcrime/2026-posts/daily-fsr-update-10-august-2027", srcName: "HSF Kramer" },
      ],
    },
  },
};
