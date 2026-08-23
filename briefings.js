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
      date: "2026-08-23",
      time: "09:18 BST",
      lede: "Brent held near its best weekly close since 24 July after Trump threatened sanctions on Iran's trading partners and Tehran vowed a 'devastating' response ahead of Bessent's Monday sanctions announcement, while Fed Chair Kevin Warsh prepares his first Jackson Hole keynote and UK data showed employment declining as price pressures mount; in credit, Hayfin priced the second reset of a 2020-vintage European CLO, widening the triple-A spread while tightening most mezzanine tranches; and in legal, White &amp; Case published an insight on the structural migration of corporate lending from banks to private credit, and the Court of Appeal's dismissal of FH Holding Moscow's anti-suit injunction appeal against UniCredit Bank surfaced in this run's case-law sweep.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran/oil</strong>: A senior Iranian military commander vowed Tehran 'will not submit' as Washington finalises a sweeping new sanctions package Treasury Secretary Bessent will detail Monday, with Brent settling Friday at $94.39/bbl (+0.65% on the day, +6.39% on the week) &mdash; its highest close since 24 July &mdash; keeping the Strait of Hormuz standoff unresolved.", src: "https://www.cnn.com/2026/08/22/world/live-news/iran-war-trump", srcName: "CNN" },
        { html: "<strong>Macro &mdash; Fed</strong>: Fed Chair Kevin Warsh will deliver his first Jackson Hole keynote on 28 August, with investors watching for any signal on the 16 September rate decision after the hawkish 19 August FOMC minutes.", src: "https://www.bloomberg.com/news/articles/2026-08-22/kevin-warsh-to-make-first-jackson-hole-speech-as-fed-chair", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; UK</strong>: UK employment declined while price pressures mounted, Bloomberg's World Economy Latest round-up showed, even as a Reuters poll continues to price a Bank of England hold at the 17 September MPC.", src: "https://www.bloomberg.com/news/articles/2026-08-22/world-economy-latest-uk-employment-declines-while-price-pressures-mount", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Hayfin/CLO</strong>: Hayfin Capital Management priced the second reset of one of its 2020-vintage European CLOs, widening the spread on the triple-A notes while tightening pricing across most mezzanine tranches.", src: "https://www.globalcapital.com/securitization/article/2gqyyctj738qmywle7d34/securitization/clos-europe/hayfin-prices-second-reset-of-2020-clo", srcName: "GlobalCapital" },
        { html: "<strong>Legal &mdash; White &amp; Case</strong>: White &amp; Case published an insight tracing the post-2008 structural migration of corporate lending from banks to private credit, including banks' growing indirect exposure via lending to credit intermediaries.", src: "https://www.whitecase.com/insight-alert/migration-corporate-lending-banks-private-credit-key-drivers-and-market-implications", srcName: "White & Case" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-22",
      time: "12:20 BST",
      lede: "Iran calls Washington's incoming sanctions package an assertion of 'extraterritorial sovereignty' as markets eye a heavy week ahead of PCE, Nvidia earnings and Jackson Hole; in legal, Freshfields advised Mobico on a proposed roughly &pound;102m sale of its West Midlands bus business to the West Midlands Combined Authority while Clifford Chance advised lenders on a roughly $1.7bn Taiwan offshore-wind financing; and in credit, Sona Asset Management is preparing to launch a &euro;400m European CLO (Sona Aclai CLO I DAC).",
      bullets: [
        { html: "<strong>Macro &mdash; Iran sanctions</strong>: Iran's foreign ministry called Washington's incoming sanctions package an assertion of 'extraterritorial sovereignty', days ahead of Treasury Secretary Bessent's Monday press conference detailing the coordinated economic-isolation campaign.", src: "https://www.cnbc.com/2026/08/22/iran-criticizes-us-sanctions-extraterritorial-sovereignty.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; week ahead</strong>: July core PCE and Nvidia's Q2 earnings both land 26 August, ahead of Fed Chair Kevin Warsh's Jackson Hole keynote on 28 August &mdash; the week's three key catalysts for rates and risk assets.", src: "https://www.cnbc.com/2026/08/21/stock-market-next-week-outlook-for-aug-24-28-2026.html", srcName: "CNBC" },
        { html: "<strong>Legal &mdash; Freshfields/Mobico</strong>: Freshfields advised Mobico Group on an agreed-in-principle sale of its West Midlands bus business (&pound;24m upfront plus &pound;5.5m deferred, valued at roughly &pound;102m before liability transfers) to the West Midlands Combined Authority, with completion expected in November 2026.", src: "https://www.freshfields.com/en/our-thinking/news/news-search/2026/08/freshfields-advises-mobico-on-proposed-sale-of-uk-bus-to-the-west-midlands-combined-authority", srcName: "Freshfields" },
        { html: "<strong>Legal &mdash; Clifford Chance/Hai Long</strong>: Clifford Chance advised lenders and export credit agencies on roughly NT$55bn (~US$1.7bn) of incremental financing for the ~1GW Hai Long offshore wind project in Taiwan, backed by 35 lenders including the National Credit Guarantee Administration.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-on-the-incremental-financing-of-hai-long-offshore-wind-project-in-taiwan.html", srcName: "Clifford Chance" },
        { html: "<strong>Credit &mdash; Sona/CLO</strong>: Sona Asset Management is preparing to launch Sona Aclai CLO I DAC, a &euro;400m multicurrency European CLO spanning 97 corporate obligors, per a preliminary KBRA rating announcement.", src: "https://alternativecreditinvestor.com/2026/08/21/sona-prepares-to-launch-e400m-european-clo/", srcName: "Alternative Credit Investor" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-22",
      time: "21:21 BST",
      lede: "China's Iranian crude imports were squeezed further by the US blockade around the Strait of Hormuz even as Treasury Secretary Bessent's bond-buyback rally faded and longer-dated yields resumed climbing, with a Reuters poll now showing economists expect the Bank of England to hold rates for the rest of the year; in credit, Sona Asset Management is preparing to launch a &euro;400m European CLO and Franklin Templeton closed its inaugural $1.5bn collateralised fund obligation; and in legal, the Court of Appeal gave further case-management directions in Sucden Financial v TMT Metals, with Macfarlanes acting for Sucden.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran/oil</strong>: China's Iranian oil imports fell to roughly 534,000 barrels a day in August as the US blockade around the Strait of Hormuz continues to squeeze Chinese refiners, keeping the oil-supply risk premium elevated ahead of Monday's US sanctions announcement.", src: "https://www.bloomberg.com/news/articles/2026-08-21/iranian-oil-supply-to-chinese-refiners-squeezed-by-us-blockade", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Treasury/Fed</strong>: Longer-dated Treasury yields resumed climbing as the relief from Treasury Secretary Bessent's expanded bond-buyback programme proved short-lived, with strategists warning the intervention does little to address the underlying deficit or term premium just as Fed Chair Kevin Warsh heads into his first Jackson Hole keynote on 28 August.", src: "https://www.cnbc.com/2026/08/21/treasury-yields-bonds-inflation-rates.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; BoE outlook</strong>: A Reuters poll of 64 economists found nearly 90% expect the Bank of England to hold its Bank Rate at 3.75% for the rest of 2026 despite upside inflation risks, ahead of the next MPC decision on 17 September.", src: "https://whbl.com/2026/08/18/bank-of-england-to-hold-rates-for-remainder-of-year-despite-inflation-risks-reuters-poll/", srcName: "Reuters (via WHBL)" },
        { html: "<strong>Credit &mdash; Sona/Franklin Templeton</strong>: Sona Asset Management is preparing to launch Sona Aclai CLO I DAC, a &euro;400m multicurrency European CLO spanning 97 corporate obligors, while Franklin Templeton closed its inaugural $1.5bn collateralised fund obligation spanning Lexington Partners secondaries and Benefit Street Partners US middle-market direct lending.", src: "https://alternativecreditinvestor.com/2026/08/21/sona-prepares-to-launch-e400m-european-clo/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Sucden/Macfarlanes</strong>: The Court of Appeal (Sir Geoffrey Vos MR, Laing and Foxton LJJ) gave further case-management directions in Sucden Financial's continuing fraud claim against TMT Metals and Prateek Gupta over an alleged nickel-cargo margin-debt shortfall exceeding $6.6m, with Macfarlanes acting for Sucden throughout.", src: "https://caselaw.nationalarchives.gov.uk/ewca/civ/2026/1080", srcName: "National Archives" },
      ],
    },
  },
};
