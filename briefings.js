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
      date: "2026-08-02",
      time: "09:26 BST",
      lede: "Trump says he is cancelling planned fresh strikes on Iran after Middle East allies helped broker &ldquo;the perimeters of a deal,&rdquo; Chancellor John Healey confirmed his first Budget for 28 October as UK petrol prices hit a fresh high, a private-credit trio led by CVC Credit and Apollo backed Bridgepoint&rsquo;s &euro;425m buyout financing for GBA Group, and Latham advised Westconnect on a &euro;1.2bn capital raise.",
      bullets: [
        { html: "<strong>Iran</strong>: Trump says the US is cancelling a planned new wave of strikes on Iranian targets, citing progress toward &ldquo;the perimeters of a deal&rdquo; to end the conflict after Middle East allies requested restraint &mdash; days after he had threatened further attacks.", src: "https://www.bloomberg.com/news/articles/2026-08-02/trump-says-us-to-cancel-iran-attack-subject-to-a-rapid-deal", srcName: "Bloomberg" },
        { html: "<strong>UK Budget</strong>: Chancellor John Healey&rsquo;s first Budget has been confirmed for 28 October, with households bracing for possible tax rises; the news lands alongside RAC data showing UK petrol prices hitting a fresh high of 160p a litre.", src: "https://www.gbnews.com/money/john-healey-s-first-budget-date-confirmed", srcName: "GB News" },
        { html: "<strong>Private credit</strong>: a trio of lenders led by CVC Credit, Apollo and Goldman Sachs Alternatives provided &euro;425m of unitranche financing backing Bridgepoint&rsquo;s acquisition of GBA Group, a specialist laboratory-testing platform.", src: "https://www.ifre.com/loans/2463332/private-credit-trio-backs-bridgepoints-gba-deal", srcName: "IFR" },
        { html: "<strong>Legal &mdash; funds</strong>: Latham &amp; Watkins advised Westconnect on a &euro;1.2bn capital raise, one of the largest European fund-formation mandates the firm has closed this quarter.", src: "https://www.lw.com/en/news/2026/07/latham-advises-westconnect-on-1-2-billion-capital-raise", srcName: "Latham &amp; Watkins" },
        { html: "<strong>Regulatory</strong>: Macfarlanes flagged the FCA&rsquo;s CP26/28 consultation proposing a new UK AIFM regime, a significant shake-up for how UK-based alternative-fund managers are authorised and supervised.", src: "https://www.macfarlanes.com/insights/102ndli/a-new-regime-for-uk-aifms-a-consultation-on-the-fcas-latest-proposals-in-cp26-2/", srcName: "Macfarlanes" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-02",
      time: "12:10 BST",
      lede: "Trump says the US is cancelling a planned new wave of strikes on Iran after &ldquo;the perimeters of a deal&rdquo; were agreed, Chancellor John Healey and Andy Burnham warned Labour ministers to prepare for budget cuts ahead of the 28 October Budget, Revolut added Apollo and Ares to its new European retail private-markets ELTIF, and Simmons &amp; Simmons advised on Europe&rsquo;s first tokenised securitisation.",
      bullets: [
        { html: "<strong>Iran</strong>: Trump says the US is cancelling a planned new wave of strikes on Iranian targets, citing progress toward &ldquo;the perimeters of a deal&rdquo; to end the conflict after Middle East allies requested restraint.", src: "https://www.bloomberg.com/news/articles/2026-08-02/trump-says-us-to-cancel-iran-attack-subject-to-a-rapid-deal", srcName: "Bloomberg" },
        { html: "<strong>UK Budget</strong>: Chancellor John Healey and Mayor Andy Burnham warned Labour ministers to prepare for spending cuts as departments brace for a tight 28 October Budget.", src: "https://www.gbnews.com/politics/john-healey-andy-burnham-labour-ministers-budget-cuts", srcName: "GB News" },
        { html: "<strong>UK housing</strong>: annual UK house-price growth slowed to 1.8% in July, Nationwide data showed, as affordability pressure continues to weigh on the market.", src: "https://www.mortgagesolutions.co.uk/mortgage-news/2026/07/31/slowdown-in-uk-annual-house-price-growth-to-1-8-in-july-nationwide/", srcName: "Mortgage Solutions" },
        { html: "<strong>Private credit</strong>: Revolut said it will offer EU retail customers access to private-markets funds for as little as &euro;1 via new ELTIF 2.0 feeder funds, with Apollo and Ares named among the managers selected alongside Partners Group and Hamilton Lane.", src: "https://www.bloomberg.com/news/articles/2026-07-27/revolut-to-offer-clients-apollo-ares-funds-for-as-little-as-1", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; banking</strong>: Simmons &amp; Simmons advised on what it says is Europe&rsquo;s first tokenised securitisation, a landmark deal for digital-asset structuring in the region.", src: "https://www.simmons-simmons.com/en/about-us/news/simmons-simmons-advises-on-europe-s-first-tokenised-securitisation", srcName: "Simmons &amp; Simmons" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-02",
      time: "17:21 BST",
      lede: "Trump says Iran agreed to a &ldquo;total&rdquo; reopening of the Strait of Hormuz, but Al Jazeera reports no concrete breakthrough on how transit will actually be managed as the IRGC keeps blocking vessels near Omani waters; Ares Management posted a record $36bn fundraising quarter led by its credit division; and Wall Street heads into next week bracing for the July jobs report after a blockbuster Amazon quarter.",
      bullets: [
        { html: "<strong>Iran</strong>: despite Trump's claim of Iranian agreement to an &ldquo;immediate, complete and total&rdquo; opening of the Strait of Hormuz, Iran's defence minister dismissed the US pullback from strikes as &ldquo;psychological operations,&rdquo; and mediators Pakistan, Qatar, Oman and Turkey have yet to produce a breakthrough on how shipping traffic will be managed.", src: "https://www.aljazeera.com/news/2026/8/2/no-breakthrough-on-strait-of-hormuz-as-trump-halts-attack-on-iran", srcName: "Al Jazeera" },
        { html: "<strong>Private credit</strong>: Ares Management raised $36.4bn in Q2 2026, its largest-ever quarter, with the credit division contributing $23.7bn of inflows and its flagship asset-based finance strategy adding $8.5bn.", src: "https://alternativecreditinvestor.com/2026/07/31/private-credit-drives-record-36bn-fundraising-quarter-for-ares/", srcName: "Alternative Credit Investor" },
        { html: "<strong>UK Budget</strong>: Chancellor John Healey confirmed his first Budget for 28 October, with economists including Julian Jessop calling sizeable tax rises &ldquo;pretty much guaranteed&rdquo; given an estimated &pound;22bn fiscal hole.", src: "https://www.gbnews.com/money/john-healey-s-first-budget-date-confirmed", srcName: "GB News" },
        { html: "<strong>Wall Street</strong>: investors head into next week bracing for the July jobs report (due 7 August, consensus +85,000) and a heavy earnings slate, with the S&amp;P 500 still digesting Amazon's blowout AWS-led quarter and Apple's softer guidance.", src: "https://www.investing.com/news/economy-news/teetering-us-stock-market-faces-jobs-report-big-earnings-week-4827318", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Rates</strong>: CNBC's read of Chair Warsh's press conference argues markets are underweighting how hawkish his own language was even as equities rallied on the Fed's hold &mdash; a reminder the September meeting is still genuinely contested after the FOMC's first three-way hawkish dissent since 2016.", src: "https://www.cnbc.com/2026/07/31/kevin-warsh-fed-inflation-rate-hike-markets.html", srcName: "CNBC" },
      ],
    },
  },
};
