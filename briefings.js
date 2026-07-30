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
      date: "2026-07-30",
      time: "09:23 BST",
      lede: "Lloyds beat estimates and unveiled a new five-year plan this morning as UK banks kick off results day, with the Bank of England's own rate call at noon and US GDP and core PCE due at 13:30 BST following yesterday's hawkish Fed hold.",
      bullets: [
        { html: "<strong>UK banks</strong>: Lloyds Banking Group's Q2 pre-tax profit rose 14% y/y to &pound;2.27bn, beating the &pound;2.09bn consensus (H1 pre-tax &pound;4.3bn), as it unveiled a new five-year plan targeting ~20% RoTE by 2030.", src: "https://www.bloomberg.com/news/articles/2026-07-30/lloyds-profit-beats-estimates-as-lender-unveils-five-year-plan", srcName: "Bloomberg" },
        { html: "<strong>Today's calendar</strong>: the Bank of England's MPC decision lands at noon &mdash; economists polled by Reuters expect a 7-2 vote to hold Bank Rate at 3.75% &mdash; ahead of US Q2 GDP and June core PCE at 13:30 BST.", src: "https://ca.investing.com/news/economy-news/bank-of-england-to-keep-rates-steady-while-oil-prices-gyrate-4762016", srcName: "Reuters" },
        { html: "<strong>Asia/markets</strong>: shares rebounded for the first time in three days as the chip-led rout eased &mdash; Samsung rose 4.3% on a 250-fold profit jump and South Korea's Kospi gained 2.2% &mdash; even as long-dated Treasuries fell further on uncertainty over the Fed's post-hold policy path.", src: "https://www.swissinfo.ch/eng/us-stock-futures-rise%2C-long-bonds-drop-after-fed%3A-markets-wrap/91818948", srcName: "Bloomberg (via Swissinfo)" },
        { html: "<strong>Legal</strong>: Kirkland advised BlackRock, Global Infrastructure Partners and HPS Investment Partners on a strategic venture with Meta to develop a 1GW data-centre campus in El Paso, Texas, backed by $12.5bn of debt financing.", src: "https://www.kirkland.com/news/press-release/2026/07/kirkland-advises-blackrock-gip-and-hps-on-strategic-venture-with-meta-to-develop-data-center", srcName: "Kirkland & Ellis" },
        { html: "<strong>Private credit</strong>: Churchill Asset Management (Nuveen) and Seviora, Temasek's asset-management platform, closed an oversubscribed ~$400m collateralised fund obligation combining US and Asian private-capital strategies.", src: "https://www.businesswire.com/news/home/20260712336679/en/Churchill-Asset-Management-and-Seviora-Close-Approximately-$400-Million-Collateralized-Fund-Obligation-Combining-U.S.-and-Asian-Private-Capital-Strategies", srcName: "Business Wire" },
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
