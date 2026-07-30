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
      date: "2026-07-29",
      time: "22:40 BST",
      lede: "The Fed held rates at 3.50&ndash;3.75% but three officials dissented for a hike &mdash; the first three-way hawkish split since September 2016 &mdash; sending the Dow to its worst day of the year and the Nasdaq 100 into correction territory as Iran&rsquo;s renewed strikes on US forces pushed Brent up nearly 8%.",
      bullets: [
        { html: "<strong>Fed</strong>: the FOMC held its target range at 3.50&ndash;3.75%, but three members dissented in favour of a hike &mdash; the first three-way hawkish dissent since September 2016.", src: "https://www.cnbc.com/2026/07/29/fed-rate-decision-july-2026.html", srcName: "CNBC" },
        { html: "<strong>Markets</strong>: the Dow posted its worst session of the year on the hawkish hold, while the Nasdaq 100 closed down 1.8% and in correction territory, more than 11% below its June peak.", src: "https://www.forbes.com/sites/antoniopequenoiv/2026/07/29/dow-posts-its-worst-day-of-the-year-after-federal-reserve-maintains-interest-rates/", srcName: "Forbes" },
        { html: "<strong>Oil/Iran</strong>: Brent settled up 7.9% at $90.74/bbl after Iran&rsquo;s IRGC fired ballistic missiles at US forces overnight (intercepted; US/Saudi forces retaliated in Iraq), ending the brief US-Iran strike pause hours before the Fed&rsquo;s decision.", src: "https://www.cnbc.com/2026/07/29/oil-prices-today-brent-wti-iran-us-hormuz.html", srcName: "CNBC" },
        { html: "<strong>Private credit</strong>: Bank Leumi&rsquo;s ABL arm structured a &pound;20m revolving funding facility for leasing business Compass Business Finance.", src: "https://alternativecreditinvestor.com/2026/07/29/leumi-abl-structures-20m-revolving-funding-facility-for-compass-business-finance/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Private credit</strong>: Federated Hermes acquired ESR Group&rsquo;s LP interest in Penny Blue Capital&rsquo;s flagship European real-estate debt fund &mdash; its first European RE-debt secondaries investment.", src: "https://alternativecreditinvestor.com/2026/07/29/federated-hermes-invests-in-penny-blues-flagship-european-re-debt-fund/", srcName: "Alternative Credit Investor" },
      ],
    },
  },
};
