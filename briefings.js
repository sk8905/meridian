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
      date: "2026-07-31",
      time: "05:20 BST",
      lede: "Amazon and Apple both beat on revenue and EPS after Thursday's close but split on reaction — Amazon up as much as 10% on a fastest-in-18-quarters AWS beat, Apple down over 6% on soft guidance — while the Bank of Japan held rates at 1% overnight and a historic Kospi rebound followed the eased AI-capex worries.",
      bullets: [
        { html: "<strong>Amazon</strong>: Q2 net sales rose 20% to $200.6bn (beating the $196.47bn consensus) and EPS of $5.75 tripled estimates, as AWS revenue of $42.2bn (+37% y/y, fastest growth in 18 quarters) sent shares up 7-10% after hours; FY26 capex guidance was raised to roughly $220bn from $200bn.", src: "https://finance.yahoo.com/markets/stocks/articles/amazon-q2-2026-earnings-aws-204411872.html", srcName: "Yahoo Finance" },
        { html: "<strong>Apple</strong>: fiscal Q3 revenue of $109.4bn (+16% y/y) and EPS of $2.02 (+29% y/y) both beat consensus with June-quarter records, but shares fell as much as 6.65% after hours on guidance for slower September-quarter growth (+9-11% y/y), a Services miss and softer Greater China revenue.", src: "https://www.tradingkey.com/analysis/stocks/us-stocks/262065111-apple-earnings-report-q3-2026-aapl-iphone-mac-tim-cook-china-services-tradingkey", srcName: "TradingKey" },
        { html: "<strong>Asia overnight</strong>: the Bank of Japan held its policy rate at 1% in an 8-1 vote and upgraded its FY2026 GDP forecast to 0.8%, while the Kospi spiked as much as 13% (triggering a sidecar halt) and the Nikkei rose over 4% as SK Hynix and Samsung rebounded sharply on the eased AI-capex fears.", src: "https://www.cnbc.com/2026/07/31/boj-rates-yen-intervention-inflation-japan.html", srcName: "CNBC" },
        { html: "<strong>Gilts</strong>: two-year gilt yields fell 11bp to 4.34% — the steepest drop since 12 June — after Governor Bailey told reporters not to read Thursday's 6&ndash;3 BoE hold as \"edging toward a hike\", with the 10-year yield down 6.1bp to 4.989%.", src: "https://www.bloomberg.com/news/articles/2026-07-30/short-gilts-surge-as-traders-slash-bets-on-boe-hike-in-september", srcName: "Bloomberg" },
        { html: "<strong>Today's calendar</strong>: NatWest Group's H1 2026 results and the US Employment Cost Index (Q2) are both due, rounding out a week that has already seen BoE, Fed and Big Tech earnings all land within 48 hours.", src: "https://www.bls.gov/schedule/news_release/eci.htm", srcName: "BLS" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-07-30",
      time: "12:20 BST",
      lede: "The Bank of England held Bank Rate at 3.75% by a narrower 6&ndash;3 vote at today&rsquo;s Super Thursday decision, echoing the Fed&rsquo;s own hawkish three-way dissent a day earlier, as UK banks&rsquo; results day continues and US Q2 GDP and core PCE loom at 13:30 BST.",
      bullets: [
        { html: "<strong>BoE</strong>: the MPC held Bank Rate at 3.75%, but the vote split narrowed to 6&ndash;3 (from 7&ndash;2 in June) as three members favoured an immediate 25bp hike to 4%, alongside a fresh quarterly Monetary Policy Report.", src: "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/july-2026", srcName: "Bank of England" },
        { html: "<strong>UK banks</strong>: Lloyds Banking Group&rsquo;s Q2 pre-tax profit rose 14% y/y to &pound;2.27bn, beating consensus, as it unveiled a new five-year plan targeting ~20% RoTE by 2030.", src: "https://www.bloomberg.com/news/articles/2026-07-30/lloyds-profit-beats-estimates-as-lender-unveils-five-year-plan", srcName: "Bloomberg" },
        { html: "<strong>US calendar</strong>: the 30-year Treasury yield touched its highest level since 2007 after Wednesday&rsquo;s hawkish Fed hold, with today&rsquo;s Q2 GDP advance estimate and June core PCE due at 13:30 BST the next test of the bond-market&rsquo;s skepticism.", src: "https://www.cnbc.com/2026/07/29/treasury-yields-fed-interest-rates.html", srcName: "CNBC" },
        { html: "<strong>Private credit</strong>: Tikehau Capital is in advanced talks to take control of Italian bottle-cap maker Tap&iacute; Group via a debt restructuring converting part of its ~&euro;150m bank debt into equity-like instruments, while Fortress agreed to buy up to $1.5bn of loans from Irish fintech Wayflyer under a three-year forward-flow deal.", src: "https://www.privateequitywire.co.uk/tikehau-poised-to-take-control-of-tapi-through-debt-restructuring-deal/", srcName: "Private Equity Wire" },
        { html: "<strong>Legal</strong>: the High Court (Ch) ruled on preliminary issues in QuidPay Finance v SettleGo Solutions (t/a OpenPayd), a payments-suspension dispute in which A&amp;O Shearman acted for the defendant, adjourning QuidPay&rsquo;s disclosure application &mdash; including a Suspicious Activity Report &mdash; to trial.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/1477", srcName: "National Archives (EWHC)" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-07-30",
      time: "21:21 BST",
      lede: "Microsoft posted its biggest one-day market-value gain since 2008 &mdash; up 17% and adding roughly $480bn &mdash; lifting the Nasdaq and S&amp;P 500 even as the FTSE 100 gave up an intraday record to close lower after the Bank of England's narrower 6&ndash;3 hold, while English case law added a Supreme Court-adjacent cross-border finance ruling and Legal Business fee reporting on the EQT/Intertek deal.",
      bullets: [
        { html: "<strong>Microsoft</strong>: shares jumped 17% on a cloud/Azure beat and ~$100bn revenue guide, the stock's biggest one-day gain since 2008 and the largest single-day market-cap gain on record (~$480bn), lifting the Dow, S&amp;P 500 and Nasdaq even as Meta fell on the same earnings day after weaker free cash flow.", src: "https://www.bloomberg.com/news/articles/2026-07-30/microsoft-eyes-history-with-490-billion-pop-in-market-value", srcName: "Bloomberg" },
        { html: "<strong>BoE / FTSE</strong>: the MPC held Bank Rate at 3.75% on a narrower 6&ndash;3 vote (Greene, Mann and Pill dissenting for an immediate 25bp hike) &mdash; the FTSE 100 touched a fresh intraday record of 10,979.60 on the news but faded after Governor Bailey's press conference to close down 0.1% at 10,897.27, with Rentokil Initial slumping 21%.", src: "https://www.lbc.co.uk/article/f91b468ec6824c8ea729fdab23903588-5HjdfMW_2/", srcName: "LBC" },
        { html: "<strong>US data</strong>: Q2 GDP grew an annualised 1.5%, below the roughly 1.8% consensus, while June's core PCE inflation reading cooled &mdash; markets read it as a still-fragile disinflation story a day after the Fed's hawkish hold.", src: "https://www.bloomberg.com/news/articles/2026-07-30/us-economic-growth-misses-estimates-despite-robust-consumers", srcName: "Bloomberg" },
        { html: "<strong>Private credit</strong>: Barings served as administrative agent on senior secured credit facilities backing Quad-C Management's investment in Armstrong Transport Group, a ~$1.5bn-revenue Charlotte logistics platform ranked among the top 15 US freight brokerages.", src: "https://www.businesswire.com/news/home/20260721136822/en/Barings-Provides-Financing-to-Back-Quad-Cs-Investment-in-Armstrong-Transport-Group", srcName: "Business Wire" },
        { html: "<strong>Legal</strong>: Mr Justice Michael Green granted Trafigura PTE Ltd a final anti-suit injunction against Soci&eacute;t&eacute; Nationale de Raffinage's Cameroonian court proceedings, holding they were designed to subvert an English-law letter-of-credit payment mechanism rather than obtain legitimate security.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/comm/2026/1914", srcName: "National Archives (EWHC)" },
      ],
    },
  },
};
