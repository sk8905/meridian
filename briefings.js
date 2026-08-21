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
      date: "2026-08-21",
      time: "09:20 BST",
      lede: "UK flash PMIs surprised firmly to the upside &mdash; the composite hit a one-year high of 53.0 as services jumped to 53.6, even as manufacturing slipped further to 47.3 &mdash; lifting the pound, with the US flash PMI due later today and Thursday's Treasury-buyback relief already fading as the 30-year yield resumes its climb; in credit, Crestline closed its second European Capital Solutions fund at $625m, up nearly 75% on its debut vehicle; and in legal, Clifford Chance advised Instone Real Estate on a joint venture with Ginkgo Fund to redevelop a 15-hectare Düsseldorf site.",
      bullets: [
        { html: "<strong>Macro &mdash; UK PMI</strong>: The flash UK Composite PMI climbed to 53.0 in August (from 51.5) &mdash; a one-year high &mdash; as the Services Business Activity Index leapt to 53.6 (vs 51.8 expected), even as Manufacturing slipped to 47.3, with sterling picking up bids on the surprise.", src: "https://www.fxstreet.com/news/uk-preliminary-services-pmi-leaps-to-536-in-august-vs-518-expected-202508210833", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; Treasury/bonds</strong>: Strategists call Treasury Secretary Bessent's expanded long-bond buyback programme at best a 'circuit breaker' for the global bond slump &mdash; it bought a day's relief on Wednesday before the 30-year yield resumed its climb toward 5.27% on Thursday, with Asian bonds and the dollar under renewed pressure into Friday.", src: "https://www.bloomberg.com/news/articles/2026-08-20/bessent-s-plan-at-best-circuit-breaker-for-global-bond-slump", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Crestline</strong>: Crestline recorded the final close of its second European Capital Solutions fund at $625m (&pound;458m) &mdash; up nearly 75% on its debut vehicle &mdash; financing tailored capital solutions from senior debt to structured equity for asset-backed and lower-middle-market businesses across North and Western Europe.", src: "https://alternativecreditinvestor.com/2026/08/20/crestline-records-strong-demand-for-second-european-fund/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; CLO resets</strong>: Bridgepoint priced a &euro;307.85m reset of its debut CLO (Bridgepoint CLO I) extending reinvestment to 2031, while CIC Private Debt closed a &euro;307.5m reset of its own debut vehicle, Victory Street CLO I, with a c.90% investor roll rate &mdash; both a sign of continued European CLO reset demand into late August.", src: "https://alternativecreditinvestor.com/2026/08/18/bridgepoint-prices-e307m-reset-of-debut-clo/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Instone/Ginkgo</strong>: Clifford Chance advised Instone Real Estate on a strategic joint venture with Ginkgo Fund to redevelop 'Benrather G&auml;rten', a 15-hectare former industrial site in D&uuml;sseldorf, into a mixed-use urban quarter of 800-1,000 apartments; deal value undisclosed.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-instone-on-strategic-joint-venture-with-ginkgo.html", srcName: "Clifford Chance" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-20",
      time: "12:30 BST",
      lede: "The dollar hovers near three-month lows as the Treasury leans on doubled long-bond buybacks to steady the market after US public debt topped $40 trillion, while JD Sports shares crater on a profit warning and Standard Life partners with Wall Street heavyweights on a &pound;2bn UK bulk-annuity push; in credit, Jefferies Credit Partners is targeting roughly &euro;1bn for a new private-credit secondaries vehicle; and in legal, Slaughter and May's corporate bulletin flags FCA changes to COBS 11A.1.4 disclosure rules and the AIM Rules.",
      bullets: [
        { html: "<strong>Macro &mdash; dollar/Treasury</strong>: The dollar is hugging three-month lows as the Treasury tries to steady the bond market with its doubled long-bond buyback programme, days after total US public debt surpassed $40 trillion for the first time.", src: "https://www.cnbc.com/amp/2026/08/20/dollar-hugs-three-month-lows-as-treasury-aims-to-sooth-the-bond-market.html", srcName: "Reuters (via CNBC)" },
        { html: "<strong>Macro &mdash; UK equities</strong>: JD Sports shares fell sharply after the retailer cut its profit outlook, citing a slower-than-expected turnaround under chief executive R&eacute;gis Schultz amid weak sneaker demand.", src: "https://www.cityam.com/jd-sports-cuts-profit-forecast-as-regis-shultz-turnaround-slows/", srcName: "CityAM" },
        { html: "<strong>Macro &mdash; Standard Life</strong>: Standard Life is teaming up with Wall Street partners on a &pound;2bn UK bulk-annuity drive, the latest sign of intensifying competition in the pension-risk-transfer market.", src: "https://www.proactiveinvestors.co.uk/companies/news/1097320/standard-life-teams-up-with-wall-street-heavyweights-for-2bn-uk-bulk-annuity-drive-1097320.html", srcName: "Proactive Investors" },
        { html: "<strong>Credit &mdash; Jefferies Credit Partners</strong>: Jefferies Credit Partners is seeking roughly &euro;1bn for a new evergreen private-credit secondaries vehicle, structured as a continuation-fund/staple transaction acquiring loans from its existing direct-lending portfolio to recycle capital into new origination.", src: "https://www.privateequitywire.co.uk/jefferies-eyes-e1bn-for-private-credit-secondaries-vehicle/", srcName: "Private Equity Wire" },
        { html: "<strong>Legal &mdash; Slaughter and May</strong>: Slaughter and May's latest corporate bulletin flags the FCA's removal of most COBS 11A.1.4 rules on analyst information access, the AIM Rules changes that took effect 5 August, and a new FCA form from 21 September requiring issuers to declare whether a draft prospectus or circular contains inside information.", src: "https://www.slaughterandmay.com/insights/corporate-update/corporate-update-bulletin-20-august-2026/", srcName: "Slaughter and May" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-20",
      time: "21:25 BST",
      lede: "Wall Street reversed Wednesday's buyback-driven relief as Walmart's soft outlook and a renewed climb in the 30-year Treasury yield toward 5.24% dragged the Dow down 703.84 points to 52,759.21 and the Nasdaq to 26,067.17, while London closed flat as JD Sports' profit warning offset mining/oil strength and Standard Life unveiled an up-to-&pound;2bn pension-risk-transfer partnership; in credit, PGIM grew its asset-based-finance pool via a roughly $3bn GreenSky forward-flow facility, building on Nvidia's six-firm, $500bn+ AI compute-financing push; and in legal, Freshfields advised lenders on thyssenkrupp's transformation financing.",
      bullets: [
        { html: "<strong>Macro &mdash; Wall Street</strong>: The Dow closed down 703.84 points (-1.32%) at 52,759.21 and the Nasdaq fell 1.00% to 26,067.17 as the 30-year Treasury yield resumed its climb toward 5.24% and Walmart's weak Q2 report &mdash; comparable sales +2.6% versus +3.7% expected, its softest in over six years &mdash; sent the stock down as much as 9.7%, erasing Wednesday's buyback-driven rally.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-aug-20-2026", srcName: "TheStreet" },
        { html: "<strong>Macro &mdash; UK</strong>: The FTSE 100 closed flat at 10,748.16 as mining and oil gains offset a 14.32% plunge in JD Sports &mdash; the index's biggest decliner &mdash; after the retailer cut FY27 profit guidance to &pound;700m-&pound;800m on a 3.1% like-for-like sales fall, while Standard Life launched a five-year, up-to-&pound;2bn UK pension-risk-transfer partnership with Goldman Sachs, MS&amp;AD, CVC and Prudential Financial.", src: "https://www.marketscreener.com/news/uk-s-ftse-100-flat-as-mining-and-oil-gains-counter-broader-weakness-ce7859d3dc8bf122", srcName: "Reuters (via MarketScreener)" },
        { html: "<strong>Credit &mdash; PGIM/GreenSky</strong>: PGIM committed to a three-year, roughly $3bn forward-flow facility with home-improvement lender GreenSky, purchasing future prime-credit consumer loans through its $175bn securitised-products platform to grow its asset-based-finance pool.", src: "https://alternativecreditinvestor.com/2026/08/20/pgim-grows-abf-pool/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Nvidia AI financing</strong>: Nvidia struck MOUs with Apollo, BlackRock, Blackstone, Brookfield, Goldman Sachs and KKR to build AI compute-infrastructure financing platforms aiming to mobilise over $500bn of third-party capital for customers building data centres and procuring GPUs.", src: "https://nvidianews.nvidia.com/news/nvidia-partners-with-apollo-blackrock-blackstone-brookfield-goldman-sachs-and-kkr-to-establish-ai-compute-infrastructure-financing-platforms-to-mobilize-over-500-billion-of-third-party-capital", srcName: "Nvidia" },
        { html: "<strong>Legal &mdash; thyssenkrupp</strong>: Freshfields advised a syndicate of lenders on a syndicated transformation financing for thyssenkrupp AG backing its ACES 2030 restructuring into a financial holding company, with the facilities heavily oversubscribed and increased in size during syndication.", src: "https://www.freshfields.com/en/our-thinking/news/news-search/2026/08/freshfields-advises-the-lenders-on-transformation-financing-for-thyssenkrupp-ag", srcName: "Freshfields" },
      ],
    },
  },
};
