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
      date: "2026-08-16",
      time: "05:25 BST",
      lede: "Pemberton took ownership of Danish contractor Nordstern after a lender-led restructuring, UK 10-year gilt yields hit a 14-month high on PM Burnham's fiscal-flexibility rhetoric, US markets are pricing a September Fed pause even as hawks eye Jackson Hole, and a weak US retail-sales print added to signs of cooling demand.",
      bullets: [
        { html: "<strong>Credit &mdash; Pemberton/Nordstern</strong>: Pemberton Asset Management, previously the main lender, took ownership of Danish construction and property group Nordstern from ActivumSG after a DKK 1.6bn asset writedown pushed the holding company's equity negative.", src: "https://byensejendom.dk/article/engelsk-laangiver-overtager-entreprenoren-nordstern---5-milliarder-44181", srcName: "Byens Ejendom" },
        { html: "<strong>UK &mdash; gilts</strong>: UK 10-year gilt yields climbed to a 14-month high as new PM Andy Burnham's looser approach to the fiscal rules and Middle East-driven energy costs weighed on the long end, ahead of his government's first Budget.", src: "https://tradingeconomics.com/united-kingdom/government-bond-yield/news/535078", srcName: "Trading Economics" },
        { html: "<strong>US &mdash; Fed outlook</strong>: cooling CPI and PPI prints have pushed markets toward pricing a September hold, but Fed Chair Kevin Warsh's Jackson Hole speech and the incoming August CPI print could still reopen the case for a hike, given three regional presidents dissented in favour of one in July.", src: "https://finance.yahoo.com/economy/policy/article/markets-bet-on-a-pause-for-september-but-fed-hawks-may-not-be-swayed-ahead-of-jackson-hole-175928197.html", srcName: "Yahoo Finance" },
        { html: "<strong>US &mdash; retail sales</strong>: July retail sales fell 0.6% m/m against a +0.1% consensus, the Census Bureau's advance estimate showed, as fading government tax refunds and softer discretionary spending weighed on the headline.", src: "https://www.fxstreet.com/news/united-states-retail-sales-contracted-by-06-mom-in-july-202608141235", srcName: "FXStreet" },
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
      date: "2026-08-15",
      time: "21:20 BST",
      lede: "Iran dismissed Trump's Strait-of-Hormuz \"territory\" claim as another tanker strike was reported, the High Court fast-tracked a shipping-benchmark dispute arising directly from the Hormuz closure, gilt positioning suggested markets are giving PM Burnham room to manoeuvre on fiscal policy, and BNP Paribas Asset Management joined Meridian Credit's tracked-manager roster on its European infrastructure-debt platform.",
      bullets: [
        { html: "<strong>Geopolitics &mdash; Hormuz</strong>: Iran rebuffed President Trump's claim that the Strait of Hormuz would become US territory, as a report emerged of another tanker being struck in the waterway.", src: "https://www.cnbc.com/2026/08/15/iran-rebuffs-trumps-claim-over-hormuz-amid-report-of-ship-strike.html", srcName: "CNBC" },
        { html: "<strong>Legal &mdash; Mercuria/Baltic Exchange</strong>: the High Court (Comm) fast-tracked <em>Mercuria Energy Trading SA v Baltic Exchange Information Services Limited</em> [2026] EWHC 1942, a dispute over the TD3C shipping-benchmark rate that stems directly from the Strait of Hormuz closure.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/comm/2026/1942", srcName: "National Archives" },
        { html: "<strong>UK &mdash; gilts</strong>: a popular UK bond trade suggests investors are for now giving PM Burnham the benefit of the doubt on fiscal policy, even as the energy-driven inflation shock complicates the growth outlook.", src: "https://www.bloomberg.com/news/articles/2026-08-14/a-popular-uk-bond-trade-suggests-markets-trust-burnham-for-now", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; BNP Paribas AM</strong>: BNP Paribas Asset Management's Private Debt &amp; Real Assets platform joined Meridian Credit's tracked-manager roster, with its European Junior Infra Debt Fund II's &euro;280m first close backfilled into the Fundraising Intelligence feed.", src: "https://alternativecreditinvestor.com/2024/10/09/second-bnpp-am-infrastructure-debt-fund-closes-with-e280m/", srcName: "Alternative Credit Investor" },
      ],
    },
  },
};
