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
      date: "2026-07-29",
      time: "09:09 BST",
      lede: "Asian markets extended a historic rout &mdash; the Kospi and Kosdaq tripped circuit breakers for a second straight day as SK Hynix's sixfold profit jump still missed forecasts &mdash; while the Fed's rate decision lands later today with hold-odds wobbling after overnight Iran-Iraq strikes.",
      bullets: [
        { html: "<strong>Asia</strong>: South Korea's Kospi and Kosdaq tripped circuit breakers for a historic second straight day as SK Hynix's results disappointed despite a sixfold year-on-year profit jump, extending Tuesday's 10.8% Kospi rout.", src: "https://www.bloomberg.com/news/articles/2026-07-29/korean-stocks-tumble-a-second-day-as-sk-hynix-results-disappoint", srcName: "Bloomberg" },
        { html: "<strong>Fed</strong>: today's FOMC decision (target range 3.50&ndash;3.75%) is still expected to be a hold, though CME FedWatch hike odds ticked up to roughly 35% this morning after overnight Iran-Iraq strikes reignited an oil-driven inflation worry.", src: "https://www.france24.com/en/live-news/20260729-us-fed-expected-to-hold-rates-steady-as-inflation-hawks-circle", srcName: "France24 (AFP)" },
        { html: "<strong>UK</strong>: the FTSE 100 closed at a fresh five-month high (~10,876) on 28 Jul even as Barclays fell ~5.1% despite H1 pre-tax profit rising 17% to &pound;6.1bn, with the BoE's own decision due Thursday 30 Jul.", src: "https://www.investing.com/news/company-news/barclays-h1-2026-slides-rote-hits-161-as-income-guidance-rises-93CH-4817338", srcName: "Investing.com" },
        { html: "<strong>Private credit</strong>: Blackstone is marketing a $2bn+ collateralized fund obligation backed by stakes in its own leveraged-buyout funds, advised by Jefferies &mdash; a securitization aimed at unlocking liquidity for its Strategic Partners secondaries unit.", src: "https://www.bloomberg.com/news/articles/2026-06-08/blackstone-looks-to-sell-2-billion-of-fund-stakes-ft-says", srcName: "Bloomberg" },
        { html: "<strong>Legal</strong>: the High Court (Ch) dismissed Alexander Greensill's strike-out application in the Secretary of State's director-disqualification claim arising from the Greensill Capital insolvencies.", src: "https://www.bailii.org/ew/cases/EWHC/Ch/2026/639.html", srcName: "BAILII" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-07-29",
      time: "12:10 BST",
      lede: "Markets count down to today&rsquo;s FOMC decision under a cloud of fresh Middle East tension after Iran launched missiles at US forces overnight, with the Kospi and Kosdaq extending their historic rout and sterling firming ahead of the BoE&rsquo;s own call tomorrow.",
      bullets: [
        { html: "<strong>Fed</strong>: today&rsquo;s FOMC decision (2pm ET) is widely expected to be a hold, but uncertainty is unusually elevated after overnight Iran-Iraq strikes reignited an oil-driven inflation worry just hours before the announcement.", src: "https://www.cnn.com/2026/07/29/economy/fed-rate-decision-july", srcName: "CNN Business" },
        { html: "<strong>Geopolitics</strong>: Iran launched a surprise ballistic-missile attack on US forces in the Middle East, prompting a CENTCOM response and pushing oil and safe-haven flows higher into the Fed decision.", src: "https://www.cnbc.com/2026/07/29/us-iran-war-hormuz-centcom.html", srcName: "CNBC" },
        { html: "<strong>Asia</strong>: South Korea&rsquo;s Kospi tumbled nearly 7% for a second straight day and other Asian shares mostly fell after SK Hynix&rsquo;s results disappointed despite a sixfold profit jump, extending the region&rsquo;s worst rout of the year.", src: "https://www.bloomberg.com/news/articles/2026-07-29/korean-stocks-tumble-a-second-day-as-sk-hynix-results-disappoint", srcName: "Bloomberg" },
        { html: "<strong>Private credit</strong>: KKR priced a reset of Avoca CLO XIII within guidance, while a Blackstone-led group including Apollo and KKR agreed to invest $5.34bn for a 49% stake in Williams&rsquo; Power Innovation joint venture.", src: "https://www.globalcapital.com/securitization/article/2gonz8a0mhqtluseot24g/securitization/clos-europe/kkr-reset-for-avoca-clo-xiii-priced-within-guidance", srcName: "GlobalCapital" },
        { html: "<strong>Legal</strong>: A&amp;O Shearman advised Bank Gospodarstwa Krajowego on a EUR2bn dual-tranche guaranteed notes issuance.", src: "https://www.aoshearman.com/en/news/ao-shearman-advises-bank-gospodarstwa-krajowego-on-eur-2bn-dual-tranche-guaranteed-notes-issuance", srcName: "A&O Shearman" },
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
