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
      time: "21:20 BST",
      lede: "US stocks closed out July higher as a blockbuster Amazon result &mdash; revenue past $200bn and AWS growth re-accelerating to ~37% &mdash; powered the Nasdaq, even as Apple slid on soft guidance and the 30-year Treasury yield hit its highest since 2007. In London the FTSE 100 gave back a fresh intraday record to finish lower, though still up 1.2% on the week.",
      bullets: [
        { html: "<strong>Wall Street</strong>: US stocks closed out July higher &mdash; the S&amp;P 500 up ~0.7%, the Dow ~0.4% and the Nasdaq more than 1% &mdash; as a blockbuster Amazon result powered big tech and investors looked past a renewed jump in long-dated bond yields.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-31-2026", srcName: "TheStreet" },
        { html: "<strong>Amazon</strong>: shares surged double digits &mdash; among their best single-session gains in years &mdash; after Q2 revenue rose 20% to $200.6bn and AWS grew 36.7% to $42.2bn (a fifth straight quarter of accelerating growth), with group operating income up 43% to $27.5bn.", src: "https://finance.yahoo.com/markets/stocks/articles/amazon-q2-2026-earnings-aws-204411872.html", srcName: "Yahoo Finance" },
        { html: "<strong>Apple</strong>: bucked the tech rally, sliding ~7% as a fiscal-Q3 beat (revenue $109.4bn, EPS $2.02, iPhone +22%) was overshadowed by September-quarter guidance of 9&ndash;11% growth &mdash; below the ~12% consensus &mdash; and a warning that rising memory costs will pressure margins.", src: "https://www.techtimes.com/articles/322442/20260731/apple-q3-2026-earnings-record-revenue-worsening-mac-supply-below-consensus-q4-outlook.htm", srcName: "TechTimes" },
        { html: "<strong>FTSE 100</strong>: ended a strong week 0.3% lower at 10,868.05, giving back an intraday record of 10,989.45 as investors locked in gains against rising yields; NatWest led the risers (+3.2%) on upgraded guidance while IG Group fell 14% on its $1.3bn Underdog deal. The index still rose 1.2% on the week.", src: "https://www.lbc.co.uk/article/14ce58be157c4ca0bcbdb229797c6481-5HjdfPy_2/", srcName: "LBC" },
        { html: "<strong>Rates</strong>: the 30-year Treasury yield hit around 5.26%, its highest since 2007, and the long bond sold off through the session on fears the Fed is behind the curve on inflation &mdash; a headwind that kept the day&rsquo;s equity gains in check ahead of next week&rsquo;s US payrolls.", src: "https://www.fxempire.com/forecasts/article/nasdaq-index-bond-yields-test-amazon-led-tech-rally-as-apple-slides-1614071", srcName: "FX Empire" },
      ],
    },
  },
};
