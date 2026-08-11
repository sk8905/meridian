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
      time: "17:38 BST",
      lede: "The Hormuz picture stayed mixed into the evening &mdash; Trump's hardened compensation demand on Iran was partly offset by Pakistan's defence minister telling Bloomberg the US and Iran are &lsquo;close to some sort of an arrangement&rsquo;, with oil paring an early gain even as the 30-year Treasury yield pushed back above 5% for the first time in about six weeks ahead of Wednesday's CPI; on the desks, Barings and Ares both backed StepStone's $3.1bn secondaries vehicle with structured financing, Coller Capital opened its secondaries funds to European wealth managers via Titanbay, and A&amp;O Shearman flagged the DOJ's withdrawal of a 1987 business-review letter that had cleared proxy adviser ISS.",
      bullets: [
        { html: "<strong>Markets &mdash; Hormuz/Fed odds</strong>: Pakistan's defence minister Khawaja Asif said the US and Iran are &lsquo;close to some sort of an arrangement&rsquo; on reopening the Strait of Hormuz, hours after Trump hardened his compensation demand on Tehran; WTI pared an earlier 3% gain on the comments while the dollar and the 30-year Treasury yield stayed firm, with Wednesday's CPI print still the week's decisive catalyst.", src: "https://www.bloomberg.com/news/articles/2026-08-11/pakistan-said-us-iran-are-close-to-some-arrangement-on-peace", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; StepStone secondaries financing</strong>: Barings provided a substantial portion of the rated financing, and Ares served as primary capital provider, on StepStone's $3.1bn structured secondaries vehicle &mdash; described as the largest of its kind to date, with Citi as structuring and placement agent.", src: "https://alternativecreditinvestor.com/2026/04/02/ares-backs-3-1bn-stepstone-structured-secondaries-vehicle/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Coller/Titanbay</strong>: Coller Capital partnered with fintech platform Titanbay to distribute its evergreen secondaries funds, including private-credit strategies, to European wealth managers via Titanbay's TradeEngine technology.", src: "https://alternativecreditinvestor.com/2026/08/11/coller-opens-secondaries-funds-to-european-wealth/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; A&amp;O Shearman/DOJ</strong>: the DOJ Antitrust Division withdrew its 1987 Business Review Letter to proxy adviser ISS, which had cleared its formation on the basis it would confine itself to proxy-voting advice &mdash; a signal of possible future scrutiny of ISS and Glass Lewis, which together control over 90% of the US proxy-advisory market.", src: "https://www.lit-antitrust.aoshearman.com/doj-withdraws-longstanding-business-review-letter-issued-to-institutional-shareholder-services", srcName: "A&amp;O Shearman" },
        { html: "<strong>Credit &mdash; Bain Capital Credit historical backfill</strong>: this run's watchlist/manager sweep added three of Bain Capital Credit's earlier Italian and Portuguese NPL/UTP portfolio acquisitions (2017&ndash;2018, roughly &euro;1.3bn combined face value) to its deal history.", src: "https://www.baincapital.com/news/bain-capital-credit-acquires-%E2%82%AC450-million-portfolio-italian-npls", srcName: "Bain Capital" },
      ],
    },
  },
};
