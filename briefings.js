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
      date: "2026-07-31",
      time: "12:20 BST",
      lede: "London hit a fresh intraday record before fading as a renewed jump in long-dated bond yields &mdash; the 30-year US Treasury near its highest since 2007 &mdash; tempered a month-end rally, with euro-area inflation ticking up to 2.9% and Wall Street bracing to digest a blockbuster Amazon result and softer Apple guidance from after Thursday&rsquo;s closing bell.",
      bullets: [
        { html: "<strong>FTSE 100</strong>: London&rsquo;s blue-chip index hit a fresh intraday record of 10,989.45 before paring gains, with NatWest up ~3% after upgrading its 2026 guidance and Sainsbury&rsquo;s firmer on the agreed &pound;120m sale of Argos, while IG Group slumped ~14% &mdash; the worst performer &mdash; on its $1.3bn acquisition of US prediction-markets operator Underdog.", src: "https://www.lbc.co.uk/article/14ce58be157c4ca0bcbdb229797c6481-5HjdfPy_2/", srcName: "LBC" },
        { html: "<strong>Eurozone inflation</strong>: Eurostat&rsquo;s flash estimate put July annual CPI at 2.9% (from 2.8%), with core at 2.5% and energy inflation accelerating to 10.0%, complicating the ECB&rsquo;s September rate decision.", src: "https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-31072026-ap", srcName: "Eurostat" },
        { html: "<strong>Big Tech</strong>: Wall Street opened month-end split on Thursday night&rsquo;s mega-cap results &mdash; Amazon indicated sharply higher after AWS grew ~37% and group revenue topped $200bn, while Apple pointed lower despite a fiscal-Q3 beat as its September-quarter guidance of 9&ndash;11% growth fell short of the ~12% consensus.", src: "https://finance.yahoo.com/markets/stocks/articles/amazon-q2-2026-earnings-aws-204411872.html", srcName: "Yahoo Finance" },
        { html: "<strong>Rates</strong>: the 30-year US Treasury yield pushed to around 5.26% &mdash; its highest since 2007 &mdash; as investors worried the Fed is falling behind on inflation after Wednesday&rsquo;s hawkish hold, capping risk appetite into the last session of July.", src: "https://www.fxempire.com/forecasts/article/nasdaq-index-bond-yields-test-amazon-led-tech-rally-as-apple-slides-1614071", srcName: "FX Empire" },
        { html: "<strong>Private credit</strong>: Ares Management is marketing roughly $3.4bn of bundled interests in a flagship European direct-lending fund &mdash; one of the largest private-credit secondaries ever &mdash; as managers lean on the secondary market to return capital in a slower exit environment.", src: "https://www.benzinga.com/markets/private-markets/26/07/60711545/ares-3-4-billion-credit-secondaries-deal-largest-private-credit-sales-ever", srcName: "Benzinga" },
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
