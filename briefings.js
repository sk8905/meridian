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
      time: "09:25 BST",
      lede: "NatWest's H1 profit jump and a £2.2bn Evelyn Partners deal headline a busy UK morning as Sainsbury's agrees to sell Argos, while Wall Street splits on the Fed's next move — J.P. Morgan now sees a December hike, Goldman none this year — and China's factory PMI unexpectedly contracted in July.",
      bullets: [
        { html: "<strong>NatWest</strong>: H1 2026 pre-tax profit rose to £4.32bn (from £3.59bn) on a 12.6% jump in net interest income, prompting an upgrade to full-year return-on-tangible-equity guidance (&gt;19%, from &gt;17%) alongside a £2.2bn Evelyn Partners acquisition.", src: "https://uk.finance.yahoo.com/news/natwest-upgrades-outlook-buyback-plans-062900807.html", srcName: "Yahoo Finance (UK)" },
        { html: "<strong>Sainsbury's</strong>: agreed to sell its struggling Argos general-merchandise arm to a new vehicle backed by former Co-op boss Richard Pennycook, with completion targeted for February 2027, letting Sainsbury's focus fully on its core food business.", src: "https://www.bloomberg.com/news/articles/2026-07-31/sainsbury-s-agrees-to-sell-argos-division-to-swift-partners", srcName: "Bloomberg" },
        { html: "<strong>Fed path split</strong>: J.P. Morgan brought forward its Fed hike call to December 2026 (from H2 2027) on 30 July, arguing Chair Warsh's press conference cast doubt on his inflation-fighting resolve, while Goldman Sachs held its own call for no move through the rest of 2026.", src: "https://www.kitco.com/news/off-the-wire/2026-07-30/jpmorgan-brings-forward-fed-rate-hike-call-december-after-july-hold", srcName: "Kitco News" },
        { html: "<strong>China</strong>: the official manufacturing PMI fell to 49.2 in July (from June's 50.3) — its first contraction in five months — with new orders at their lowest since 2023, as domestic demand slumped and typhoons disrupted production even as electronics/AI-hardware exports held up.", src: "https://www.cnbc.com/2026/07/31/china-pmi-factory-activity-economic-growth-exports-.html", srcName: "CNBC" },
        { html: "<strong>Private credit</strong>: Blackstone signed a definitive agreement to acquire HSBC's A$36bn (~$25.3bn) Australian home loan portfolio — the largest home-loan-portfolio transaction globally — confirming the deal first reported as nearing completion on 27 July.", src: "https://www.hsbc.com/-/files/hsbc/investors/results-and-announcements/stock-exchange-announcements/2026/july/sea-310726-hsbc-to-sell-its-aud36-billion-australian-home-and-personal-loan-portfolio-to-blackstone.pdf", srcName: "HSBC" },
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
