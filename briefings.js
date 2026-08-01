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
      date: "2026-08-01",
      time: "09:25 BST",
      lede: "Washington is weighing a fresh wave of strikes on Iran as soon as this weekend even after the Senate blocked a war-powers resolution, UK house-price growth cooled to 1.8% in July, and Wall Street braces for a jobs report and a heavy earnings week &mdash; while Ardian extends unitranche financing to French software group Arche MC2 and Weil advises MarketAxess on its $6bn sale to Intercontinental Exchange.",
      bullets: [
        { html: "<strong>Iran</strong>: officials say the Trump administration is planning a further wave of strikes on Iranian targets as soon as this weekend, even as the Senate voted 50-49 to block a war-powers resolution that would have required congressional authorisation for further action.", src: "https://edition.cnn.com/2026/08/01/world/live-news/iran-war-trump", srcName: "CNN" },
        { html: "<strong>Congress</strong>: the Senate's war-powers resolution on Iran was blocked in a 50-49 vote as the conflict escalates, leaving the administration's strike planning unconstrained by a formal authorisation requirement.", src: "https://rollcall.com/2026/07/30/iran-war-powers-resolution-blocked-in-senate-as-conflict-heats-up/", srcName: "Roll Call" },
        { html: "<strong>UK housing</strong>: Nationwide reported annual house-price growth slowing to 1.8% in July, a cooling from June's pace as higher-for-longer rates continue to weigh on affordability.", src: "https://www.mortgagesolutions.co.uk/mortgage-news/2026/07/31/slowdown-in-uk-annual-house-price-growth-to-1-8-in-july-nationwide/", srcName: "Mortgage Solutions" },
        { html: "<strong>Private credit</strong>: Ardian renewed its backing of French software publisher Arche MC2 with new unitranche financing, extending an existing relationship as the firm continues to back the platform's growth.", src: "https://www.ardian.com/news-insights/press-releases/ardian-renews-its-backing-leading-software-publisher-arche-mc2-new", srcName: "Ardian" },
        { html: "<strong>M&amp;A</strong>: Weil advised MarketAxess on its agreed $6bn acquisition by Intercontinental Exchange, one of the week's largest announced financial-markets-infrastructure deals.", src: "https://www.weil.com/articles/weil-advises-marketaxess-in-its-6b-acquisition-by-intercontinental-exchange", srcName: "Weil" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-01",
      time: "12:18 BST",
      lede: "Spain&rsquo;s Pedro S&aacute;nchez hit out at EU critics over Madrid&rsquo;s migrant crisis as Fifa abandoned its $20bn plan to sell stakes in a World Cup venture after global backlash, US officials say fresh strikes on Iran could come as soon as this weekend, long-dated Treasury yields keep climbing in the wake of Fed Chair Warsh&rsquo;s hawkish hold, and Ares Management posted a record $36.4bn fundraising quarter led by private credit.",
      bullets: [
        { html: "<strong>Iran</strong>: US officials say the Trump administration is planning a further wave of strikes on Iranian energy targets as soon as this weekend, extending the conflict that has been unsettling oil and bond markets.", src: "https://edition.cnn.com/2026/08/01/world/live-news/iran-war-trump", srcName: "CNN" },
        { html: "<strong>Spain</strong>: Prime Minister Pedro S&aacute;nchez hit out at EU leaders&rsquo; criticism of Madrid&rsquo;s handling of the migrant crisis &mdash; over 50,000 migrants crossed into Ceuta in a single day, with at least 57 dead &mdash; calling for a meeting of the bloc&rsquo;s home affairs ministers as tensions over immigration policy mount.", src: "https://www.ft.com/content/1b3f09b5-897e-4b7a-9949-2c4d9a32929e", srcName: "FT" },
        { html: "<strong>Fifa</strong>: abandoned its $20bn plan to sell stakes in a World Cup commercial venture after global backlash, a setback for president Gianni Infantino&rsquo;s push to bring in outside investment.", src: "https://www.ft.com/content/58400cf0-20df-46ef-975b-7414806e09de", srcName: "FT" },
        { html: "<strong>Rates</strong>: long-dated Treasury yields extended their climb in FT&rsquo;s Chart of the Week, as investors keep reassessing Fed Chair Kevin Warsh&rsquo;s rate path after J.P. Morgan brought forward its call for a December hike following the Fed&rsquo;s hawkish July hold.", src: "https://www.ft.com/content/42257873-e801-49b8-967f-a15ea1129541", srcName: "FT" },
        { html: "<strong>Private credit</strong>: Ares Management raised a record $36.4bn in Q2, with its credit division contributing $23.7bn &mdash; the largest share of any strategy &mdash; as firmwide AUM climbed 17.3% year-on-year to $671.3bn.", src: "https://alternativecreditinvestor.com/2026/07/31/private-credit-drives-record-36bn-fundraising-quarter-for-ares/", srcName: "Alternative Credit Investor" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-07-31",
      time: "21:26 BST",
      lede: "US stocks closed out July higher as a blockbuster Amazon result &mdash; revenue past $200bn and AWS growth re-accelerating to ~37% &mdash; powered the Nasdaq, even as Apple slid on soft guidance and the 10-year Treasury yield hit its highest since January 2025. In London the FTSE 100 gave back a fresh intraday record to finish lower, though NatWest's upgraded guidance still left the index eyeing its biggest monthly rise since February.",
      bullets: [
        { html: "<strong>Wall Street</strong>: US stocks closed out July higher &mdash; the S&amp;P 500 up ~0.7%, the Dow ~0.4% and the Nasdaq more than 1% &mdash; as a blockbuster Amazon result powered big tech and investors looked past a renewed jump in long-dated bond yields.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-31-2026", srcName: "TheStreet" },
        { html: "<strong>Amazon</strong>: shares surged as much as 14% &mdash; its best single day since 2015, propelling Jeff Bezos past Sergey Brin to reclaim third-richest &mdash; after Q2 revenue topped $200bn and AWS growth accelerated to 37%, the fastest in 18 quarters.", src: "https://www.forbes.com/sites/tylerroush/2026/07/31/amazon-shares-surge-14-toward-best-day-in-a-decade-jeff-bezos-overtakes-brin-as-3rd-richest/", srcName: "Forbes" },
        { html: "<strong>Apple</strong>: bucked the tech rally, sliding as much as 8% as a fiscal-Q3 beat (revenue $109.4bn, EPS $2.02, iPhone +22%) was overshadowed by a soft Services print and cautious September-quarter guidance.", src: "https://247wallst.com/investing/2026/07/31/apple-sinks-8-amazon-soars-12-as-traders-pick-tech-earnings-winners-and-losers/", srcName: "247wallst.com" },
        { html: "<strong>FTSE 100</strong>: closed July's final session down 0.3% at 10,868.05, giving back a fresh intraday record, as NatWest led risers (+3.2%) after H1 pre-tax profit rose 22% to &pound;4.32bn on a 12.6% NII jump and an upgrade to &gt;19% RoTE guidance &mdash; leaving the index eyeing its biggest monthly rise since February.", src: "https://www.marketscreener.com/news/london-s-ftse-100-eyes-biggest-monthly-rise-since-feb-as-earnings-energy-provide-lift-ce7f50dbdf8df525", srcName: "MarketScreener" },
        { html: "<strong>Rates</strong>: the 10-year Treasury yield pushed to 4.7388%, its highest since January 2025, and the 30-year held above 5.2% &mdash; extending its longest stretch above 5% since 2007 &mdash; as post-FOMC repricing and the earnings-driven equity rally left long yields climbing even after the Fed's hold two days earlier.", src: "https://www.forbes.com/sites/tylerroush/2026/07/31/amazon-shares-surge-14-toward-best-day-in-a-decade-jeff-bezos-overtakes-brin-as-3rd-richest/", srcName: "Forbes" },
        { html: "<strong>Legal</strong>: Cleary Gottlieb advised LXP Industrial Trust on its $5.2bn sale to Brookfield and CPP Investments, one of the largest US industrial real-estate transactions of the year.", src: "https://www.clearygottlieb.com/news-and-insights/news-listing/lxps-5-2-billion-sale-to-brookfield-and-cpp-investments", srcName: "Cleary Gottlieb" },
      ],
    },
  },
};
