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
      date: "2026-09-02",
      time: "21:21 BST",
      lede: "The Fed's Beige Book showed modest growth and sticky prices across most districts, yet Wall Street closed higher (Dow +0.56%, S&amp;P 500 +0.46%, Nasdaq +0.45%) even as the 10-year Treasury yield's earlier push to 4.818% &mdash; its highest since November 2023 &mdash; and NY Fed's Williams framed the yield surge as reflecting economic strength; London closed lower as the UK 10-year gilt hit an 18-year high of 5.268%, while Treasury Secretary Bessent said a fresh Iran-bank sanction is likely this week; on the credit desk LACERA appointed Cheyne Capital to a $750m credit mandate, and the High Court dismissed a just-and-equitable winding-up petition in APL Holdco v Apple Properties.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed's Beige Book shows modest growth as prices rise</strong>: The Fed's latest regional survey found economic activity growing slightly to moderately in 10 of 12 districts since early July, with prices rising in eight on elevated energy, raw-material and transportation costs and contacts flagging heightened uncertainty from the Iran conflict.", src: "https://www.fxstreet.com/news/feds-beige-book-shows-modest-growth-as-prices-rise-202609021821", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; Wall Street closes higher as NY Fed's Williams ties yield surge to a strong economy</strong>: The Dow added 295.07 points (0.56%) to 53,061.95, the S&amp;P 500 rose 0.46% and the Nasdaq gained 0.45%, even as the 10-year Treasury yield hit 4.818% intraday; NY Fed President John Williams said the surge partly reflects strong economic prospects rather than dysfunction.", src: "https://www.cnbc.com/2026/09/02/new-york-feds-williams-says-yield-surge-due-to-strong-economic-prospects.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; London closes lower as UK 10-year gilt hits 18-year high</strong>: The FTSE 100 fell 0.3% to 10,756.45 as the UK 10-year gilt yield rose to 5.268% &mdash; its highest since 2008 &mdash; and oil pushed above $95/bbl on the US-Iran conflict, with sterling easing to $1.3527 at the close.", src: "https://www.brecorder.com/news/40437413/london-stocks-slide-as-rising-gilt-yields-weigh-reckitt-gains", srcName: "Business Recorder (Reuters)" },
        { html: "<strong>Credit &mdash; LACERA appoints Cheyne Capital to manage $750m credit mandate</strong>: The $93.9bn Los Angeles County pension fund approved a $750m allocation to a multi-asset credit hedge-fund strategy managed by Cheyne Capital through a dedicated managed account, part of its broader credit portfolio.", src: "https://alternativecreditinvestor.com/2026/09/02/lacera-appoints-cheyne-capital-to-manage-750m-credit-mandate/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; High Court dismisses winding-up petition in APL Holdco v Apple Properties</strong>: Deputy Judge Philip Rainey KC dismissed a just-and-equitable winding-up petition over an Isle of Man holding company despite finding a complete breakdown in trust between its two 50% owners, holding the petitioner bore sole responsibility for the breakdown and that alternative Isle of Man remedies remained available.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2245", srcName: "National Archives (BAILII)" },
      ],
    },
  },
};
