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
      date: "2026-08-05",
      time: "09:15 BST",
      lede: "Treasury Secretary Bessent said a US&ndash;Iran deal to reopen the Strait of Hormuz could land within days, sending Brent below $79/bbl and helping the Dow and S&amp;P 500 to fresh overnight records on AI-linked earnings strength, HSBC unveiled a fresh buyback and BP&rsquo;s profit doubled even as both flagged cost cuts, Freshfields advised on Hammerson&rsquo;s &pound;189m share placing while Latham logged four new US client-alert deals, and the High Court handed down fresh Chancery Division judgments in a restitution claim and a company dispute.",
      bullets: [
        { html: "<strong>Iran / oil</strong>: Treasury Secretary Bessent said on CNBC there is a chance of a US&ndash;Iran deal within a day or two to reopen the Strait of Hormuz, sending Brent below $79/bbl in a further leg of the two-session slide, though analysts caution Iran is unlikely to cede full control of the waterway.", src: "https://www.bloomberg.com/news/articles/2026-08-04/bessent-suggests-us-iran-hormuz-deal-possible-in-coming-days", srcName: "Bloomberg" },
        { html: "<strong>US data</strong>: the trade deficit narrowed to $73.3bn in June on declining imports, while JOLTS job openings came in at 7.359m &mdash; below the 7.4m estimate and down on the prior month &mdash; and Philadelphia Fed President Paulson said he remains content with rates at their current level.", src: "https://www.bloomberg.com/news/articles/2026-08-04/us-trade-deficit-narrows-to-73-3-billion-on-drop-in-imports", srcName: "Bloomberg" },
        { html: "<strong>UK earnings</strong>: HSBC profit jumped and the bank unveiled a fresh share buyback, while BP&rsquo;s underlying replacement-cost profit doubled year-on-year even as new CEO Meg O&rsquo;Neill announced job cuts and a $8&ndash;9bn divestment programme including Castrol.", src: "https://www.euronews.com/business/2026/08/04/hsbc-profit-jumps-as-bank-unveils-major-share-buyback-plan", srcName: "Euronews" },
        { html: "<strong>Legal &mdash; corporate/funds</strong>: Freshfields advised the underwriting banks on Hammerson&rsquo;s &pound;189m placing of new ordinary shares, while Latham &amp; Watkins logged four new client-alert deals overnight spanning FIA motorsport rights, pharma M&amp;A, an energy drop-down and a biotech growth financing.", src: "https://www.freshfields.com/en/our-thinking/news/news-search/2026/08/freshfields-advises-the-underwriting-banks-on-the-189m-placing-of-new-ordinary-shares-in-hammerson-plc", srcName: "Freshfields" },
        { html: "<strong>Legal &mdash; cases</strong>: the Chancery Division handed down judgment in Providence Gate Group Holdings v Crossbaron and in Stanford v Klotho Brands &amp; Ors, the latter a company-law dispute decided in late July.", src: "https://www.bailii.org/ew/cases/EWHC/Ch/2026/1917.html", srcName: "BAILII" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-05",
      time: "12:38 BST",
      lede: "US&ndash;Iran talks on reopening the Strait of Hormuz showed fresh signs of progress as the Nasdaq 100 extended a four-day, $3.5tn rally on AI-earnings strength, the UK&rsquo;s final July services PMI was revised up to 52.1 while Next and Glencore both beat on profit, Apollo and Ares both posted record Q2 fee-related earnings, Triple Point and Pemberton logged new private-credit financings alongside a Palmer Square CLO reset, and the High Court revisited liquidator remuneration in Float Capital&rsquo;s insolvency under the court&rsquo;s section 112 supervisory jurisdiction.",
      bullets: [
        { html: "<strong>Iran / markets</strong>: the US and Iran could reach a deal as soon as this week on a temporary arrangement to reopen the Strait of Hormuz, Treasury Secretary Bessent said, as the Nasdaq 100 extended its rally to a four-day, $3.5tn market-cap gain on AI-linked earnings strength.", src: "https://www.bloomberg.com/news/articles/2026-08-05/tech-melt-up-drives-3-5-trillion-nasdaq-100-rally-in-four-days", srcName: "Bloomberg" },
        { html: "<strong>UK data / earnings</strong>: the UK&rsquo;s final July services PMI was revised up to 52.1 from a 51.8 flash reading, even as Next raised its profit outlook on strong UK and Middle East sales and Glencore&rsquo;s H1 adjusted EBITDA surged 86% to $10.1bn on a trading boom and record copper prices.", src: "https://investinglive.com/news/uk-july-final-services-pmi-xx-vs-51-8-prelim/", srcName: "investingLive" },
        { html: "<strong>Credit &mdash; managers</strong>: Apollo&rsquo;s total AUM crossed $1.05tn with record fee-related earnings of $785m, and Ares&rsquo;s AUM topped $671bn with Q2 FRE of $491.1m, as Triple Point upsized a UK bridging-lender facility to &pound;50m and Pemberton&rsquo;s financing backed a minority stake sale at prepaid-funeral provider Pure Cremation.", src: "https://ir.apollo.com/news-events/press-releases/detail/640/apollo-reports-second-quarter-2026-results", srcName: "Apollo (IR)" },
        { html: "<strong>CLOs</strong>: Palmer Square Capital Management closed a $300m reset of Palmer Square BDC CLO 1, pricing $228m of AAA notes at SOFR+1.28% and $72m of AA notes at SOFR+1.75%, both due 2039.", src: "https://www.sec.gov/Archives/edgar/data/0001794776/000121390026078363/ea0298073-8k_palmer.htm", srcName: "SEC EDGAR" },
        { html: "<strong>Legal &mdash; restructuring</strong>: Chief ICC Judge Briggs revisited the joint liquidators&rsquo; remuneration in Float Capital&rsquo;s liquidation, using the court&rsquo;s section 112 supervisory jurisdiction after the Court of Appeal&rsquo;s Frost decision narrowed the usual Insolvency Rules route for increasing time-costs-based fees.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2077", srcName: "National Archives (Case Law)" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-04",
      time: "21:13 BST",
      lede: "AMD and SpaceX gave contrasting after-hours reactions to their Tuesday earnings, Prologis finalised terms for its $14bn/&pound;14bn takeover of Segro with Slaughter and May advising the target, US JOLTS job openings came in below estimate as Philadelphia Fed's Paulson signalled comfort with rates on hold, and law firms logged a fresh wave of M&amp;A advisory work including Clifford Chance on Bridgepoint&rsquo;s acquisition of Lansweeper and Kirkland on Park Square Capital&rsquo;s FIA commercial-rights deal.",
      bullets: [
        { html: "<strong>AMD</strong>: Q2 revenue of $11.536bn beat the ~$11.3bn Street estimate as Data Center revenue of $6.718bn (58% of sales) more than doubled year-on-year, though GAAP EPS of $1.38 missed the $1.62 consensus; shares rose about 5% after hours on a Q3 guide of ~$13bn.", src: "https://ir.amd.com/news-events/press-releases/detail/1295/amd-reports-second-quarter-2026-financial-results", srcName: "AMD (IR)" },
        { html: "<strong>SpaceX</strong>: in its first-ever quarterly report as a public company, revenue rose 92% year-on-year to $7.81bn and losses narrowed to $0.09/share, beating estimates on both lines, but shares fell roughly 15% after hours as investors focused on the imminent 6 August lock-up expiration.", src: "https://www.cnbc.com/2026/08/04/spacex-spcx-earnings-live-updates-q2-2026.html", srcName: "CNBC" },
        { html: "<strong>M&amp;A</strong>: Prologis agreed final terms for its roughly $14bn (&pound;14bn) takeover of Segro; Slaughter and May is advising Segro on the recommended share offer.", src: "https://www.bloomberg.com/news/articles/2026-08-04/prologis-agrees-final-terms-for-14-billion-segro-takeover", srcName: "Bloomberg" },
        { html: "<strong>US labour market</strong>: JOLTS job openings came in at 7.359m, below the 7.4m estimate and down on the prior month, as Philadelphia Fed President Paulson said he was content with rates at their current level while keeping an open mind.", src: "https://www.cnbc.com/2026/08/04/philadelphia-fed-president-paulson-content-with-current-rates-but-keeping-an-open-mind.html", srcName: "CNBC" },
        { html: "<strong>Legal &mdash; corporate</strong>: Clifford Chance advised Bridgepoint on its acquisition of Lansweeper, while Kirkland &amp; Ellis advised Park Square Capital on its acquisition of the commercial rights to the FIA World Rally and European Rally Championships.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-bridgepoint-on-acquisition-of-lansweeper.html", srcName: "Clifford Chance" },
      ],
    },
  },
};
