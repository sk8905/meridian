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
      date: "2026-08-10",
      time: "21:26 BST",
      lede: "US equities held near record highs into the CPI-heavy week with Fed-hike odds for 16 September down near 44%, UK hiring data steadied and sterling firmed, and Wednesday's UK GDP print looms; the legal wire stayed quiet since the last run, so this pass focused Credit on manager-profile upkeep &mdash; H.I.G. Capital's AUM was reconciled to its own ~$75bn figure, Diameter Capital Partners' regulatory AUM was confirmed at $28.8bn via SEC Form ADV, NorthWall and Polus were re-checked with no material change, and a new CLO-issuing credit manager, Nassau Global Credit, was added to the roster.",
      bullets: [
        { html: "<strong>Markets &mdash; Fed odds/CPI week</strong>: US stocks sit near record highs (S&amp;P 500 7,757.64) heading into Wednesday's CPI and Thursday's PPI, with CME FedWatch-implied odds of a 16 September Fed hike down near 44% after Friday's soft payrolls print.", src: "https://www.investing.com/news/economy-news/five-things-to-watch-in-markets-in-the-week-ahead-4848255", srcName: "Investing.com (Reuters)" },
        { html: "<strong>UK &mdash; labour market</strong>: UK hiring held steady in July after a four-year slump, a tentative signal ahead of Wednesday's Q2 GDP estimate and this week's wider run of UK data.", src: "https://www.bloomberg.com/news/newsletters/2026-08-10/uk-hiring-holds-steady-in-july-after-four-year-slump", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; new manager</strong>: added Nassau Global Credit (New York; ~$7.0bn AUM across Total Return, Opportunistic and Securitized Credit) to the roster &mdash; a multi-strategy global credit manager and active US/euro CLO issuer, including its €406m NGC Euro CLO 5 close and $314m Kings Point CLO reset.", src: "https://ngc.nfg.com/about", srcName: "Nassau Global Credit" },
        { html: "<strong>Credit &mdash; manager profiles</strong>: this run's rotating re-verification reconciled H.I.G. Capital's AUM to its own reported ~$75bn (Jun 2026) and confirmed Diameter Capital Partners' $28.8bn regulatory AUM via SEC Form ADV; NorthWall Capital and Polus Capital Management were also re-checked, with no material change found for either.", src: "https://hig.com/news/h-i-g-capital-completes-the-sale-of-eci/", srcName: "H.I.G. Capital" },
        { html: "<strong>Legal &mdash; latest on record</strong>: the legal wire has been quiet since the last run; Kirkland's advisory to Bernhard Capital Partners on taking Bowman Consulting Group private (~$1.0bn enterprise value, 58% premium) remains the freshest tracked item.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advises-bernhard-capital-partners-on-acquisition-of-bowman-consulting-group", srcName: "Kirkland & Ellis" },
      ],
    },
  },
};
