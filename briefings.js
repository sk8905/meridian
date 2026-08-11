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
      date: "2026-08-11",
      time: "09:28 BST",
      lede: "Wall Street heads into CPI week with Nvidia's $500bn AI-financing push and Fed-hike odds still hovering near 44-56% for 16 September, while London opened softer on stalled Strait-of-Hormuz talks; on the desks, L&amp;G's H1 results showed private-markets AUM up over 20% to &pound;79bn and Coller Capital's head of credit flagged volatility as a tailwind for secondaries volume, while the legal wire stayed quiet since the last run.",
      bullets: [
        { html: "<strong>Markets &mdash; Nvidia/AI financing</strong>: Nvidia has lined up roughly $500bn in financing commitments as CEO Jensen Huang told CNBC its chips are an &lsquo;investable asset&rsquo;, underscoring the scale of capital being marshalled for the AI buildout ahead of Wednesday's CPI.", src: "https://www.cnbc.com/2026/08/10/nvidia-wall-street-asset-managers-500-billion-ai-push.html", srcName: "CNBC" },
        { html: "<strong>Markets &mdash; UK open</strong>: the FTSE 100 was set to dip as Middle East jitters added to a listless summer market, with sterling still carrying a Hormuz risk premium ahead of Wednesday's US inflation print.", src: "https://uk.finance.yahoo.com/news/ftse-100-live-stocks-set-060200099.html", srcName: "Yahoo Finance UK" },
        { html: "<strong>Markets &mdash; US futures</strong>: US index futures traded mixed into the open as investors positioned for a CPI-heavy week and a fresh wave of megacap-tech earnings.", src: "https://www.bloomberg.com/news/articles/2026-08-10/stock-market-today-dow-s-p-live-updates", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; private markets/AUM</strong>: Legal &amp; General's H1 2026 results showed core operating profit up 7% to &pound;918m and total private-markets AUM (private credit, real estate and infrastructure) up over 20% to &pound;79bn, with a target of &gt;&pound;85bn by 2028.", src: "https://group.legalandgeneral.com/newsroom/press-releases/2026/8/2026-half-year-results-simpler-more-focused-lg-delivers-11-core-operating-eps-growth/", srcName: "Legal & General" },
        { html: "<strong>Credit &mdash; secondaries</strong>: Coller Capital's head of credit, Michael Schad, said market volatility is a tailwind for secondaries investors, with continuation funds becoming a bigger share of credit secondaries after $53bn of opportunities seen since January 2024.", src: "https://ionanalytics.com/insights/debtwire/collers-head-of-credit-says-volatility-benefits-secondaries-market-growth/", srcName: "ionanalytics (Debtwire)" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-11",
      time: "12:44 BST",
      lede: "Oil held a three-day gain and the FTSE was set to slip as Trump's demand for Iranian compensation clouded the Strait-of-Hormuz reopening outlook, CME-implied odds of a 16 September Fed hike drifted back to roughly 50/50, Nvidia lined up Apollo, Blackstone, KKR and Goldman Sachs behind its $500bn+ AI-infrastructure financing push, Arini Capital and Silver Point moved to take control of Pfleiderer via debt restructuring, and A&amp;O Shearman advised on Adani Energy Solutions' $364m share placement.",
      bullets: [
        { html: "<strong>Markets &mdash; oil/Hormuz</strong>: Brent and WTI held a three-day gain as Trump's demand for Iranian compensation clouded hopes of reopening the Strait of Hormuz, keeping a supply-risk premium bid into the week's US inflation data.", src: "https://www.bloomberg.com/news/articles/2026-08-11/oil-holds-three-day-gain-as-trump-demands-cloud-hormuz-outlook", srcName: "Bloomberg" },
        { html: "<strong>Markets &mdash; Fed odds</strong>: CME FedWatch-implied odds of a 16 September Fed rate hike drifted back toward roughly 50/50 as traders weighed the softer jobs data against sticky inflation risk ahead of Wednesday's CPI.", src: "https://edition.cnn.com/business", srcName: "CNN Business" },
        { html: "<strong>UK &mdash; FTSE/sterling</strong>: the FTSE 100 was set to dip and sterling steadied as the Hormuz standoff and thin summer volumes kept London listless into the CPI print.", src: "https://www.bloomberg.com/markets/stocks", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Nvidia AI financing</strong>: Nvidia enlisted Apollo, BlackRock, Blackstone, Brookfield, Goldman Sachs and KKR to establish AI compute-infrastructure financing platforms aiming to mobilise over $500bn of third-party capital.", src: "https://nvidianews.nvidia.com/news/nvidia-partners-with-apollo-blackrock-blackstone-brookfield-goldman-sachs-and-kkr-to-establish-ai-compute-infrastructure-financing-platforms-to-mobilize-over-500-billion-of-third-party-capital", srcName: "Nvidia" },
        { html: "<strong>Credit &mdash; Pfleiderer restructuring</strong>: Arini Capital and Silver Point are among the bondholders set to take control of German building-materials group Pfleiderer through a debt-for-equity restructuring.", src: "https://www.bloomberg.com/news/articles/2026-08-05/arini-silver-point-among-lenders-set-to-take-over-pfleiderer", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; A&amp;O Shearman</strong>: A&amp;O Shearman advised the book-running lead managers on Adani Energy Solutions' $364m qualified institutions placement.", src: "https://www.aoshearman.com/en/news/investor-confidence-surges-with-adani-energy-solutions-limiteds", srcName: "A&O Shearman" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-11",
      time: "21:29 BST",
      lede: "Markets held near record highs into Wednesday's CPI print, with Treasury yields firming as oil jumped on a still-unresolved Strait-of-Hormuz standoff and UK gilts fell on reports PM Andy Burnham is weighing a &pound;25bn tax-raising first Budget; on the desks, Ares scaled back a ~&euro;1bn private-credit continuation vehicle after investor pushback on valuations, HPS priced its latest Aqueduct European CLO, Bridgepoint explored a &gt;&euro;1bn secondaries deal and Polar Asset Management closed $215m for its second dedicated SRT fund, while the High Court stayed a noteholder claim against Hunkem&ouml;ller's security agent pending New York litigation.",
      bullets: [
        { html: "<strong>Markets &mdash; CPI setup</strong>: Treasury yields firmed and oil jumped as investors awaited Wednesday's July CPI print, seen as pivotal for the Fed's rate path, while the Strait-of-Hormuz standoff between Washington and Tehran remained unresolved.", src: "https://www.cnbc.com/2026/08/11/an-inflation-report-wednesday-should-be-a-big-deal-for-the-fed-heres-what-to-expect.html", srcName: "CNBC" },
        { html: "<strong>UK &mdash; gilts/Budget</strong>: UK gilts fell as oil's rally revived inflation worries, alongside reports PM Andy Burnham is weighing a &pound;25bn tax-raising first Budget targeting pensioners and entrepreneurs.", src: "https://www.gbnews.com/money/andy-burnham-tax-raid-wealth-pensioners-entrepreneurs-budget", srcName: "GB News" },
        { html: "<strong>Credit &mdash; Ares continuation vehicle</strong>: Ares cut the target size of a continuation vehicle built from its 2018-vintage Ares Capital Europe IV fund from roughly &euro;700m to ~&euro;350-400m of fair market value, after prospective secondaries buyers pushed back on the loan valuations being asked.", src: "https://www.marketscreener.com/news/ares-scales-back-eur1-billion-private-credit-vehicle-after-investor-pushback-ft-reports-ce7f50dcde8ff522", srcName: "MarketScreener (FT)" },
        { html: "<strong>Credit &mdash; CLOs/secondaries/SRT</strong>: HPS priced its latest Aqueduct European CLO with tighter pricing across most of the stack, Bridgepoint explored selling &gt;&euro;1bn of private-credit stakes via a continuation vehicle, and Polar Asset Management struck a $215m first close for its second dedicated significant-risk-transfer fund.", src: "https://www.globalcapital.com/securitization/article/2gpq68fwew4pcbgyl5zi8/securitization/clos-europe/hps-prices-latest-aqueduct-new-issue-euro-clo", srcName: "GlobalCapital" },
        { html: "<strong>Legal &mdash; Cheyne v TMF Trustee</strong>: Mr Justice Leech stayed noteholder funds' English claim against security agent TMF Trustee and Hunkem&ouml;ller International, arising from a 2024 up-tiering restructuring, pending determination of parallel New York proceedings.", src: "https://www.bailii.org/ew/cases/EWHC/Ch/2026/2091.html", srcName: "BAILII" },
      ],
    },
  },
};
