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
      time: "09:19 BST",
      lede: "Clifford Chance advised Goldman Sachs on a &pound;280m secured bond backed by UK data centres, US markets head into a week framed by Wednesday's FOMC minutes and Home Depot/Walmart earnings, Iran's foreign minister said Hormuz's reopening still hinges on the US honouring June's MoU as Israeli strikes killed 11 in Lebanon, and UK 10-year gilt yields remain at a 14-month high on PM Burnham's fiscal-flexibility rhetoric.",
      bullets: [
        { html: "<strong>Legal &mdash; Clifford Chance/Goldman Sachs</strong>: Clifford Chance advised Goldman Sachs International, as sole arranger and lead manager, on a &pound;280m single-tranche fixed-rate secured bond issued by Equinix xScale Secured Funding 2026-1, backed by operational Equinix data centres in Slough, UK.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-goldman-sachs-on-gbp280-million-single-tranche-fixed-rate-secured-bond-issuance-secured-on-uk-data-centres.html", srcName: "Clifford Chance" },
        { html: "<strong>US &mdash; week ahead</strong>: Home Depot, Target, Lowe's and Walmart earnings plus Wednesday's minutes from the 28&ndash;29 July FOMC meeting headline the coming week, a key test of how consumers and the Fed are reading still-elevated inflation.", src: "https://abcnews.com/Business/wireStory/wall-street-week-ahead-home-depot-walmart-report-135668245", srcName: "AP News" },
        { html: "<strong>Geopolitics &mdash; Hormuz</strong>: Iran's foreign minister Araghchi said the Strait of Hormuz's reopening still hinges on the US honouring June's ceasefire memorandum, as Israeli strikes killed 11 people in Lebanon in the deadliest raid since the truce.", src: "https://www.aljazeera.com/news/liveblog/2026/8/16/iran-war-live-talks-on-hormuz-strait-continue-israel-kills-11-in-lebanon", srcName: "Al Jazeera" },
        { html: "<strong>UK &mdash; gilts</strong>: UK 10-year gilt yields remain at a 14-month high as new PM Andy Burnham's looser approach to the fiscal rules and Middle East-driven energy costs weigh on the long end, ahead of his government's first Budget.", src: "https://tradingeconomics.com/united-kingdom/government-bond-yield/news/535078", srcName: "Trading Economics" },
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
