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
      date: "2026-08-15",
      time: "17:13 BST",
      lede: "Trump said he will \"soon\" declare the Strait of Hormuz a US territory and Iran rejected the claim as \"delusions\" as a third UAE-flagged tanker was struck in as many days, while Fitch affirmed the UK at AA- but trimmed its growth forecasts on energy-driven inflation; on the desks, Kartesia backed another Matignon Group bolt-on and a Leeds insolvency judgment refused to halt a winding-up petition over a disputed construction cross-claim.",
      bullets: [
        { html: "<strong>Geopolitics &mdash; Hormuz</strong>: President Trump said he will \"soon\" declare the Strait of Hormuz a US territory once Iran is defeated; Iran's deputy foreign minister Kazem Gharibabadi rejected the claim as \"delusions\", saying the waterway \"cannot be seized with a tweet\".", src: "https://www.nbcnews.com/world/iran/iran-rejects-delusions-trump-strait-hormuz-us-territory-rcna592666", srcName: "NBC News" },
        { html: "<strong>Markets &mdash; oil/shipping</strong>: UAE-flagged ADNOC tankers were hit for a third consecutive day as Washington previewed a sweeping sanctions package, keeping the oil-driven inflation risk to Fed and BoE policy live into the weekend.", src: "https://www.bloomberg.com/news/articles/2026-08-15/hormuz-ship-attacks-mount-as-us-vows-to-cripple-iran-s-economy", srcName: "Bloomberg" },
        { html: "<strong>UK &mdash; sovereign rating</strong>: Fitch affirmed the UK at AA- but cut its growth forecasts to 0.9% for 2026 and 1.2% for 2027, and now sees inflation ending 2026 near 3.7% on Middle East energy costs, while expecting no near-term change to fiscal rules under PM Burnham.", src: "https://www.thenationalnews.com/business/economy/2026/08/15/uk-retains-high-fitch-rating-but-rising-energy-prices-set-to-tame-economic-growth/", srcName: "The National" },
        { html: "<strong>Credit &mdash; Kartesia</strong>: Kartesia provided additional debt financing for Rigeto-backed Matignon Group's acquisition of The Gentlemen's Clinic, a Swiss aesthetic-clinic chain, extending the buy-and-build platform it has backed since 2025.", src: "https://kartesia.com/news/kartesia-provides-additional-financing-for-matignon-groups-acquisition-of-the-gentlemens-clinic/", srcName: "Kartesia" },
        { html: "<strong>Legal &mdash; insolvency</strong>: in <em>Developstate v Alexander Luxury (Yorkshire)</em> [2026] EWHC 2170 (Ch), HHJ Richard Carter refused to restrain advertisement of a winding-up petition over &pound;27,341.80 of unpaid invoices, finding the debtor's defective-works cross-claim lacked credibility under the Construction Act's Pay Less notice regime.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2170", srcName: "National Archives" },
      ],
    },
  },
};
