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
      date: "2026-08-19",
      time: "09:23 BST",
      lede: "UK July CPI accelerated to 2.9% y/y with a hotter-than-forecast core print, on a 14.7% jump in gas prices from the Ofgem cap rise, though sterling's reaction stayed muted; Asian equities and bonds sold off further overnight as bond-market anxiety hit AI-linked chip names; in legal, Sidley advised Accelerant's board on its &gt;$4bn take-private by Thoma Bravo and Simmons &amp; Simmons advised Lockhart Capital Management on a minority investment from Northcote Equity; and in credit, Bridgepoint and CIC Private Debt's CLO resets and Urban Partners' &euro;200m first close remain the desk's latest tracked deals.",
      bullets: [
        { html: "<strong>Macro &mdash; UK CPI</strong>: July inflation rose to 2.9% y/y (from 2.6%), a four-month high in line with consensus, with core CPI hotter than forecast at 2.6% on a 14.7% jump in gas prices from the Ofgem energy-cap rise; sterling's reaction was muted.", src: "https://finance.yahoo.com/economy/articles/uk-inflation-rate-rises-2-060931194.html", srcName: "Yahoo Finance UK" },
        { html: "<strong>Macro &mdash; Asia selloff</strong>: Japanese and Korean stocks slid further as bond-market anxiety hit AI-linked sentiment, with higher yields weighing heavily on chip stocks across the region ahead of today's FOMC minutes.", src: "https://www.bloomberg.com/news/articles/2026-08-19/japanese-stocks-slide-as-bond-market-anxiety-hits-ai-sentiment", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; Sidley/Accelerant</strong>: Sidley advised the board of Accelerant Holdings on its response to Thoma Bravo's all-cash take-private valued at more than $4bn, with Ropes &amp; Gray separately advising largest shareholder Altamont.", src: "https://www.sidley.com/en/newslanding/newsannouncements/2026/08/sidley-represents-board-of-directors-of-accelerant-in-us4-billion-acquisition-by-thoma-bravo", srcName: "Sidley Austin" },
        { html: "<strong>Legal &mdash; Simmons/Lockhart</strong>: Simmons &amp; Simmons advised UK wealth manager Lockhart Capital Management (&gt;&pound;1bn AUM) on a minority private-equity investment by Northcote Equity.", src: "https://www.simmons-simmons.com/en/about-us/news/simmons-simmons-advises-lockhart-on-investment-by-northcote-equity", srcName: "Simmons & Simmons" },
        { html: "<strong>Credit &mdash; CLO resets</strong>: Bridgepoint priced a &euro;307.85m reset of its debut CLO extending reinvestment to 2031, and CIC Private Debt closed a &euro;307.5m reset of Victory Street CLO I via Morgan Stanley with a roughly 90% investor roll rate.", src: "https://alternativecreditinvestor.com/2026/08/18/bridgepoint-prices-e307m-reset-of-debut-clo/", srcName: "Alternative Credit Investor" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-19",
      time: "12:34 BST",
      lede: "UK July CPI accelerated to 2.9% y/y on the Ofgem energy-cap rise, nudging sterling higher, while the dollar drifted near multi-month lows and Treasury yields eased ahead of tonight's FOMC minutes; in credit, Northleaf Capital Partners closed its debut Asset-Based Specialty Finance Fund at ~$450m; and in legal, the High Court (Ch) handed down a further costs judgment in the Quidpay/OpenPayd reserve-account dispute.",
      bullets: [
        { html: "<strong>Macro &mdash; UK CPI reaction</strong>: July inflation's rise to a four-month high of 2.9% y/y, driven by the Ofgem energy-cap increase, left sterling edging higher within range as markets weighed the hotter core print against the BoE's rate path.", src: "https://www.fxstreet.com/news/british-pound-edges-up-within-range-following-hotter-uk-inflation-data-202608190631", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; dollar/Treasuries</strong>: The dollar drifted near multi-month lows and Treasury yields eased as markets awaited this evening's FOMC minutes for clues on the Fed's next move.", src: "https://www.cnbc.com/amp/2026/08/19/dollar-drifts-near-multi-month-low-as-yields-ease-fed-minutes-awaited.html", srcName: "Reuters (via CNBC)" },
        { html: "<strong>Credit &mdash; Northleaf</strong>: Northleaf Capital Partners closed its inaugural Asset-Based Specialty Finance Fund at approximately $450m, targeting entertainment royalties, legal assets, healthcare receivables and factoring across the US, Canada, Europe and Australia.", src: "https://alternativecreditinvestor.com/2026/08/18/northleaf-asset-based-specialty-finance-fund-secures-450m-at-final-close/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Quidpay/OpenPayd</strong>: The High Court (Ch) handed down a further costs judgment in the Quidpay/OpenPayd reserve-account dispute, ordering OpenPayd to pay over &euro;2.45m and &pound;7m held in the disputed reserve account plus interest, and apportioning costs between the parties issue-by-issue.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2199", srcName: "National Archives" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-18",
      time: "21:29 BST",
      lede: "The US 30-year Treasury yield pushed to a fresh 19-year high above 5.33% on inflation and spending worries even as the FTSE 100 snapped its six-day losing streak on stronger oil stocks; in credit, Blackstone's BCRED and Blue Owl Technology Finance Corp both upsized investment-grade bond offerings on a pickup in BDC issuance, Barings Private Credit Corp priced $350m of notes due 2031, and Kirkland &amp; Ellis advised Vista Equity Partners on its acquisition of trust-services platform Quantios from Hg Capital and EQT.",
      bullets: [
        { html: "<strong>Macro &mdash; Treasury yields</strong>: The US 30-year Treasury yield topped 5.33%, a fresh 19-year high, as inflation and federal-spending concerns kept the global bond selloff running into the evening session.", src: "https://www.cnbc.com/2026/08/18/treasury-yields-.html", srcName: "CNBC" },
        { html: "<strong>Markets &mdash; UK equities</strong>: The FTSE 100 ended a six-day losing streak as oil stocks rallied, even as a &pound;4bn 10-year gilt auction cleared at a 5.156% yield and UK payrolls data confirmed a weakening jobs market.", src: "https://www.share-talk.com/ftse-100-ends-six-day-losing-streak-as-oil-stocks-rise/", srcName: "Reuters (via Share Talk)" },
        { html: "<strong>Credit &mdash; BDC bonds</strong>: Blackstone's BCRED priced an upsized $750m five-year investment-grade note offering (from a ~$500m target, on ~$2bn of orders) and Blue Owl Technology Finance Corp priced an upsized $400m offering at a tighter spread, one of the first tests of BDC bond appetite since the start of Q3.", src: "https://www.bloomberg.com/news/articles/2026-08-17/blackstone-blue-owl-private-credit-funds-offer-high-grade-bonds", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Barings</strong>: Barings Private Credit Corporation priced $350m of 6.500% senior notes due 2031 in a Rule 144A/Reg S offering, adding fixed-rate term debt to fund new portfolio investments and repay credit-facility borrowings.", src: "https://www.sec.gov/Archives/edgar/data/1859919/000114036126019204/ny20067676x6_424b3.htm", srcName: "SEC filing" },
        { html: "<strong>Legal &mdash; Kirkland/Vista</strong>: Kirkland &amp; Ellis advised Vista Equity Partners on its agreement to acquire Quantios, a trust and corporate-services SaaS platform serving 100+ jurisdictions, from Hg Capital and EQT, with completion expected in Q3 2026.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advises-vista-equity-partners-on-acquisition-of-quantios", srcName: "Kirkland & Ellis" },
      ],
    },
  },
};
