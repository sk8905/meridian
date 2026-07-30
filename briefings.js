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
      time: "17:23 BST",
      lede: "US Q2 GDP grew a slower-than-expected 1.5% with core PCE inflation cooling to 3.3%, sending the S&amp;P 500 to a record on a 15% Microsoft surge, as the Bank of England held Bank Rate at 3.75% on a narrower 6&ndash;3 vote and the Supreme Court handed down a significant cross-border insolvency ruling.",
      bullets: [
        { html: "<strong>US GDP/PCE</strong>: Q2 growth came in at an annualised 1.5%, below the roughly 1.8% consensus, while June's core PCE inflation reading cooled to 3.3% from 3.4% &mdash; markets read it as a still-fragile disinflation story a day after the Fed's hawkish hold.", src: "https://www.bloomberg.com/news/articles/2026-07-30/us-economic-growth-misses-estimates-despite-robust-consumers", srcName: "Bloomberg" },
        { html: "<strong>Markets</strong>: Microsoft shares surged 15% on strong cloud/AI results and new data-centre leases, lifting the S&amp;P 500 to a fresh record even as the Nasdaq 100 stays in correction territory from its June peak.", src: "https://www.ft.com/content/da7c4472-cb30-4b82-b321-d82c1859419e", srcName: "Financial Times" },
        { html: "<strong>BoE</strong>: the MPC held Bank Rate at 3.75% on a narrower 6&ndash;3 vote (from 7&ndash;2 in June), with three members &mdash; Greene, Mann and Pill &mdash; favouring an immediate 25bp hike, alongside an updated Monetary Policy Report.", src: "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/july-2026", srcName: "Bank of England" },
        { html: "<strong>Private credit</strong>: Blackstone named David Cunningham &mdash; a Managing Director who joined via the 2012 Harbourmaster acquisition &mdash; head of its European CLOs and liquid loans business, succeeding Alex Leonard.", src: "https://www.structuredcreditinvestor.com/market-moves/clos/84993/blackstone-reshuffles-european-credit-leadership-after-leonard-departure", srcName: "Structured Credit Investor" },
        { html: "<strong>Legal</strong>: the Supreme Court ruled in Drelle v Servis-Terminal LLC that a sum due under an unrecognised, unregistrable foreign money judgment is still a &lsquo;debt&rsquo; under s.267 Insolvency Act 1986, reversing the Court of Appeal and letting creditors found a bankruptcy petition on it without separate English recognition proceedings.", src: "https://www.hsfkramer.com/notes/litigation/2026-07/supreme-court-allows-bankruptcy-petition-to-be-founded-on-unrecognised-and-unregistrable-foreign-judgment", srcName: "Herbert Smith Freehills Kramer" },
      ],
    },
  },
};
