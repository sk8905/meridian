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
      time: "05:28 BST",
      lede: "Nvidia lined up $500bn in financing as CEO Jensen Huang called its chips an 'investable asset' heading into a CPI-heavy week, gold pushed higher and the dollar stayed soft on positioning ahead of Wednesday's US inflation print, and oil/sterling both carried a Strait-of-Hormuz risk premium as reopening talks with Iran stayed stalled; on the desks, BNPP AM Alts (AXA IM Alts) closed c.&euro;3bn for a new Enhanced CRE Debt strategy and Oaktree wrote SRT protection on a $2bn pbb US CRE loan book, while Simpson Thacher advised Teleflex on its $1.5bn OEM-business sale and Davis Polk flagged the CFTC's new proposal on vertically integrated trading-platform affiliations.",
      bullets: [
        { html: "<strong>Markets &mdash; Nvidia/AI financing</strong>: Nvidia has lined up roughly $500bn in financing commitments as CEO Jensen Huang told CNBC its chips are an &lsquo;investable asset&rsquo;, underscoring the scale of capital being marshalled for the AI buildout.", src: "https://www.cnbc.com/2026/08/10/nvidia-wall-street-asset-managers-500-billion-ai-push.html", srcName: "CNBC" },
        { html: "<strong>Markets &mdash; CPI week/gold-dollar</strong>: gold pushed toward the $4,500 level after Friday's shock negative nonfarm-payrolls print, while the dollar stayed positioning-driven soft (per BNY) ahead of Wednesday's US CPI and Thursday's PPI.", src: "https://www.tradingkey.com/analysis/commodities/metal/262091732-gold-price-forecast-nfp-cpi-ppi-4500-tradingkey", srcName: "TradingKey" },
        { html: "<strong>Markets &mdash; Hormuz/sterling</strong>: oil held a supply-risk premium and sterling climbed as talks on reopening the Strait of Hormuz stayed stalled ahead of Wednesday's US inflation print.", src: "https://www.fxstreet.com/news/british-pound-climbs-as-hormuz-talks-stall-us-cpi-up-next-202608101616", srcName: "FXStreet" },
        { html: "<strong>Credit &mdash; fundraising/SRT</strong>: BNPP AM Alts (AXA IM Alts) raised c.&euro;3bn for a dedicated Enhanced Commercial Real Estate Debt strategy, and Oaktree wrote significant-risk-transfer protection on a ~$2bn pbb US commercial real-estate loan portfolio (a buy-side SRT investment, not a franchise programme).", src: "https://alts.axa-im.com/media-centre/bnpp-am-alts-raises-ceur3-billion-its-dedicated-enhanced-cre-debt-strategy", srcName: "AXA IM Alts" },
        { html: "<strong>Legal &mdash; M&amp;A/derivatives</strong>: Simpson Thacher advised Teleflex on completing the $1.5bn sale of its OEM business (rebranded Ingenyx) to Montagu and Kohlberg, and Davis Polk published analysis of the CFTC's new proposal on conflicts of interest at vertically integrated exchange/broker/principal-trading affiliates.", src: "https://www.stblaw.com/about-us/news/view/2026/08/04/teleflex-completes-sale-of-oem-business-for-$1.5-billion", srcName: "Simpson Thacher" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-10",
      time: "12:36 BST",
      lede: "Wall Street enters a CPI-heavy week with gold above $4,300/oz and the dollar index below 100 as traders bet the Fed's tightening cycle is over, oil stayed bid on stalled Strait of Hormuz reopening talks, sterling eyed a push back above $1.35 on Wednesday's US inflation print, and with the credit wire quiet since last Friday the freshest desk item on record remains Onex's $500m opportunistic structured-credit raise.",
      bullets: [
        { html: "<strong>Markets &mdash; week ahead</strong>: Wednesday's July CPI and Thursday's PPI headline an inflation-heavy week that will test whether Friday's shock 23,000 nonfarm-payrolls miss marks a genuine dovish shift for the Fed or a one-report overreaction, with a fresh wave of megacap-tech earnings also due.", src: "https://www.investing.com/news/economy-news/five-things-to-watch-in-markets-in-the-week-ahead-4848255", srcName: "Investing.com (Reuters)" },
        { html: "<strong>Markets &mdash; rates/gold</strong>: gold vaulted 2.11% to $4,342/oz and the dollar index slipped below the 100 handle as the US 10-year Treasury yield eased to 4.651%, with bond traders positioning for the Fed's tightening cycle to be finished ahead of Wednesday's CPI.", src: "https://www.riotimesonline.com/global-economy-briefing-august-10-2026/", srcName: "Rio Times Online" },
        { html: "<strong>Markets &mdash; Iran/Hormuz</strong>: Brent and WTI ticked higher as talks on reopening the Strait of Hormuz stalled over Iran's conditions, keeping a supply-risk premium in crude into the CPI print.", src: "https://www.cnbc.com/2026/08/10/oil-prices-today-brent-wti-hormuz-trump-iran.html", srcName: "CNBC" },
        { html: "<strong>UK &mdash; sterling</strong>: GBP/USD could extend its recovery above $1.35 if US inflation cools further on Wednesday, though softer UK growth signalled ahead of the preliminary Q2 GDP estimate risks capping sterling's upside.", src: "https://www.exchangerates.org.uk/news/46765/2026-08-10-pound-to-dollar-week-ahead-forecast-gbp-eyes-move-beyond-1-35.html", srcName: "Exchange Rates UK" },
        { html: "<strong>Credit &mdash; structured credit</strong>: Onex closed its Structured Credit Opportunities Fund II at $500m, above target, on strong global investor demand &mdash; the fund invests globally in CLO equity and debt tranches as part of Onex's $32bn credit platform, and remains the freshest item on Credit's roster with the desk quiet since last Friday.", src: "https://alternativecreditinvestor.com/2026/08/07/onex-secures-500m-for-opportunistic-structured-credit-fund/", srcName: "Alternative Credit Investor" },
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
