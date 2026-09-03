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
      date: "2026-09-03",
      time: "09:22 BST",
      lede: "NY Fed's Williams tied the Treasury-yield surge to a strong US economy and sterling stayed pinned near a three-week low as gilt-yield gains failed to lend the pound support; on the credit desk KKR added two managing directors to its European Credit &amp; Markets team and Wire logged FitzWalter Capital's $120.8m win of the Mohawk Day Camp Chapter 11 auction, while Clifford Chance advised Prudential Financial and PGIM on a &pound;2bn strategic partnership with Standard Life.",
      bullets: [
        { html: "<strong>Macro &mdash; NY Fed's Williams ties Treasury-yield surge to a strong economy</strong>: NY Fed President John Williams said the 10-year Treasury yield's push to 4.818% &mdash; its highest since November 2023 &mdash; partly reflects strong economic prospects fuelled by AI and data-centre investment rather than market dysfunction, even as it remains unclear whether current policy is sufficient to return inflation to target.", src: "https://www.cnbc.com/2026/09/02/new-york-feds-williams-says-yield-surge-due-to-strong-economic-prospects.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Rising gilt yields are not saving the British Pound</strong>: Sterling has failed to draw support from the multi-decade-high climb in UK gilt yields, a divergence markets are reading as a fiscal and supply-driven repricing rather than a hawkish signal from the Bank of England, leaving the pound near its worst level in three weeks against the dollar.", src: "https://www.fxstreet.com/news/rising-gilt-yields-are-not-saving-the-british-pound-202609022154", srcName: "FXStreet" },
        { html: "<strong>Credit &mdash; KKR expands European Credit &amp; Markets team with two MD hires</strong>: KKR appointed Jonty Edwards (from J.P. Morgan) and Paula Weisshuber (from Bank of America, where she led EMEA Corporate Debt Capital Markets) as Managing Directors in its Credit &amp; Markets business, strengthening capital-solutions coverage of UK/European corporates and its presence across the DACH region; KKR's global Credit platform manages roughly $293bn.", src: "https://finance.yahoo.com/markets/stocks/articles/kkr-expands-global-credit-markets-060000178.html", srcName: "Yahoo Finance" },
        { html: "<strong>Credit &mdash; FitzWalter Capital wins $120.8m Chapter 11 auction for Mohawk Day Camp</strong>: FitzWalter Capital was selected as successful bidder for Mohawk Day Camp &amp; Mohawk Country Day School in White Plains, New York, in the Chapter 11 court-supervised sale of SIMAD Holdings, beating a rival bid from a vehicle tied to Warner Bros. Discovery CEO David Zaslav.", src: "https://www.manilatimes.net/2026/08/08/tmt-newswire/globenewswire/fitzwalter-capital-selected-as-successful-bidder-for-mohawk-day-camp/2401265", srcName: "Manila Times (GlobeNewswire)" },
        { html: "<strong>Legal &mdash; Clifford Chance advises Prudential Financial and PGIM on &pound;2bn Standard Life partnership</strong>: Clifford Chance advised Prudential Financial and its asset manager PGIM on a &pound;2bn strategic partnership with Standard Life, one of four new Clifford Chance mandates Wire tracked this run alongside deals for Calisen, Pemba Capital Partners and Mitsui/Nutrinova.", src: "https://www.cliffordchance.com/news/news/2026/09/clifford-chance-advises-prudential-financial-and-pgim-in-2-billion-strategic-partnership-with-standard-life.html", srcName: "Clifford Chance" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-03",
      time: "12:23 BST",
      lede: "European bond-market turmoil eased through Thursday morning as the final UK services PMI showed the sector growing at its fastest pace in months, while the yen surged to a one-month high on fresh Bank of Japan rate-hike bets and Reuters reported oil steadying ahead of Friday's US payrolls; on the credit desk Bain Capital Credit provided a $250m senior facility to Playfly Sports and ExodusPoint handed a former BlueCrest trader more than $1bn for a new macro pod, while Wire added the convening judgment in Waldorf Production's second Part 26A restructuring plan.",
      bullets: [
        { html: "<strong>Macro &mdash; Bond market turmoil eases as UK service-sector growth jumps</strong>: European government bonds steadied after this week's rout and the final S&amp;P Global/CIPS UK services PMI showed activity growing at its fastest pace in months, pulling gilt yields back from the multi-decade highs reached earlier in the week.", src: "https://www.theguardian.com/business/live/2026/sep/03/uk-mortgage-rates-set-to-rise-bond-sell-off-borrowing-costs-latest-news-updates", srcName: "The Guardian" },
        { html: "<strong>Macro &mdash; Yen soars as Bank of Japan is tipped to raise rates</strong>: The yen jumped to a one-month high as traders raised bets on another BoJ hike &mdash; with suspicions of fresh intervention adding to Wednesday's roughly 1% move &mdash; while Japanese government bond yields slid back from historic peaks.", src: "https://www.theguardian.com/business/2026/sep/03/yen-soars-bank-of-japan-tipped-to-raise-interest-rates", srcName: "The Guardian" },
        { html: "<strong>Macro &mdash; Calm returns to markets before Friday's payrolls</strong>: Reuters' Morning Bid reported oil steadying and Treasury yields easing from multi-year highs overnight, with Fed speakers Waller, Hammack and Goolsbee due on Thursday and the August employment report on Friday as the next tests of September hike pricing.", src: "https://www.investing.com/news/commodities-news/morning-bid-labor-days-4887462", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Credit &mdash; Bain Capital Credit provides $250m senior facility to Playfly Sports</strong>: The US sports revenue and media platform secured a $250m senior credit facility from Bain Capital Credit's private credit group to fund continued growth across its multimedia-rights management business.", src: "https://pulse2.com/playfly-sports-secures-250-million-senior-credit-facility-from-bain-capital-credit/", srcName: "Pulse 2.0" },
        { html: "<strong>Hedge funds &mdash; ExodusPoint backs ex-BlueCrest trader with more than $1bn</strong>: ExodusPoint Capital Management is giving former BlueCrest portfolio manager Ben Atlas an initial allocation of over $1bn for a new macro pod, Atlas Capital, expected to launch later this month as the firm also expands its Asia headcount by nearly 80% this year.", src: "https://www.hedgeweek.com/exoduspoint-gives-former-bluecrest-trader-more-than-1bn-for-new-macro-pod/", srcName: "Hedgeweek" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-03",
      time: "21:23 BST",
      lede: "Fed Governor Waller's CPI-contingent hold remarks kept pulling hike odds lower into the evening (CME FedWatch ~54.6%, down from ~66% Wednesday) as Broadcom's post-earnings slide underlined the market's narrow-leadership nerves; on the credit desk the Benetton family's Edizione launched 21 Next, a &euro;3bn pan-European platform with private-debt exposure via the Tages Credit Fund, while IFM Investors opened a Singapore office to grow its Asia diversified-credit book and Bloomberg's Nishant Kumar reported Jain Global made $1.8bn in trading profit before pivoting to run Millennium's capital exclusively; Herbert Smith Freehills Kramer advised Bodycote plc on its &pound;1.84bn recommended takeover by Veritas Capital.",
      bullets: [
        { html: "<strong>Macro &mdash; Waller's dovish CPI-contingent tone pulls hike odds to ~54.6%</strong>: Fed Governor Christopher Waller said his 15&ndash;16 September rate call is &ldquo;heavily influenced&rdquo; by the 11 September CPI report and he would back a hold if disinflation continues &mdash; the least-hawkish framing from any FOMC voter since Jackson Hole &mdash; pulling CME FedWatch-implied hike odds down roughly 12 points to ~54.6% (45.4% hold), from ~66% on Wednesday.", src: "https://www.bloomberg.com/news/articles/2026-09-03/fed-s-waller-says-september-rate-decision-hinges-on-august-cpi", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Broadcom falls despite Q3 beat as Q4 guide undershoots</strong>: Broadcom fell in premarket/midday trading despite beating on both lines (revenue $29.59bn, adjusted EPS $3.32) after its ~$34.8bn fiscal Q4 revenue guide missed the $35.03bn consensus &mdash; the market again judging an AI-capex bellwether on the size of the raise rather than the beat, even as the S&amp;P 500 and Nasdaq rallied on falling Treasury yields.", src: "https://www.fool.com/coverage/stock-market-today/2026/09/03/stock-market-midday-sept-3-stocks-rally-as-treasury-yields-fall-broadcom-falls-despite-earnings-beat/", srcName: "The Motley Fool" },
        { html: "<strong>Credit &mdash; Benetton family's Edizione launches 21 Next with &euro;3bn AUM</strong>: Edizione completed the launch of 21 Next, merging 21 Invest and Tages Capital into a pan-European platform spanning private equity, energy transition, infrastructure and private debt, with &euro;500m of seed capital and a target of &euro;10bn+ AUM by 2030; its private-debt exposure runs through the &euro;145m Tages Credit Fund financing Italian mid-sized companies.", src: "https://alternativecreditinvestor.com/2026/09/03/benetton-backed-21-next-launches-with-e3bn-aum/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Jain Global made $1.8bn in trading profit before pivoting to run Millennium's capital exclusively</strong>: Bobby Jain's Jain Global generated roughly $1.8bn in gross trading profit over its first two years managing outside capital before an April 2026 deal replaced more than $5bn of that money with capital from his former employer Millennium Management, per Bloomberg's Nishant Kumar.", src: "https://www.bloomberg.com/news/articles/2026-09-01/jain-s-hedge-fund-made-1-8-billion-as-millennium-cash-rolls-in", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; HSF Kramer advises Bodycote plc on &pound;1.84bn Veritas Capital takeover</strong>: Herbert Smith Freehills Kramer advised the FTSE 250 heat-treatment and metal-coatings group on its recommended &pound;1.84bn takeover by US private equity sponsor Veritas Capital at 940p/share in cash, after Veritas prevailed over rival bidder CVC in a competitive process.", src: "https://legaldesire.com/herbert-smith-freehills-kramer-advises-bodycote-plc-on-its-1-84-billion-takeover-by-veritas-capital", srcName: "Herbert Smith Freehills Kramer (via Legal Desire)" },
      ],
    },
  },
};
