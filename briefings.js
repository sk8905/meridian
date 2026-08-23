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
      date: "2026-08-23",
      time: "12:11 BST",
      lede: "Brent holds near its best weekly close since 24 July with Iran's sanctions standoff unresolved and Fed Chair Kevin Warsh's first Jackson Hole keynote five days out; in credit, Polar Asset Management secured a $215m first close for its second Canadian significant-risk-transfer fund; and in legal, Clifford Chance advised on Standard Chartered's debut digitally native note issuance and on Paragon Partners' acquisition of quality-management software firm Babtec.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran/oil</strong>: A senior Iranian military commander vowed Tehran 'will not submit' as Washington finalises a sweeping new sanctions package Treasury Secretary Bessent will detail Monday, with Brent settling Friday at $94.39/bbl &mdash; its highest close since 24 July &mdash; keeping the Strait of Hormuz standoff unresolved.", src: "https://www.cnn.com/2026/08/22/world/live-news/iran-war-trump", srcName: "CNN" },
        { html: "<strong>Macro &mdash; Fed</strong>: Fed Chair Kevin Warsh will deliver his first Jackson Hole keynote on 28 August, with investors watching for any signal on the 16 September rate decision after the hawkish 19 August FOMC minutes.", src: "https://www.bloomberg.com/news/articles/2026-08-22/kevin-warsh-to-make-first-jackson-hole-speech-as-fed-chair", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Polar/SRT</strong>: Polar Asset Management Partners held a first close with more than $215m of commitments for CRS Fund-II, its second dedicated significant-risk-transfer vehicle, as Canadian banks increasingly turn to risk-sharing transactions amid regulatory capital constraints.", src: "https://www.privateequitywire.co.uk/polar-asset-secures-215m-first-close-for-canadian-credit-risk-transfer-fund/", srcName: "Private Equity Wire" },
        { html: "<strong>Legal &mdash; Clifford Chance/Standard Chartered</strong>: Clifford Chance advised on Standard Chartered's debut issuance of digitally native notes on Euroclear's D-FMI &mdash; the first global systemically important bank to issue on the platform &mdash; a US$200m three-year floating-rate note deal.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-on-landmark-digitally-native-note-issuance-for-standard-chartered.html", srcName: "Clifford Chance" },
        { html: "<strong>Legal &mdash; Clifford Chance/Paragon Partners</strong>: Clifford Chance advised Paragon Partners on its acquisition of 100% of Babtec Informationssysteme, a leading DACH-region quality-management software provider, with completion subject to regulatory approvals.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-paragon-partners-on-the-acquisition-of-babtec.html", srcName: "Clifford Chance" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-23",
      time: "17:18 BST",
      lede: "Iran criticised the 'extraterritorial sovereignty' of Washington's imminent sanctions package as Fed Chair Kevin Warsh's first Jackson Hole keynote nears and UK employment data show price pressures mounting; in credit, PGIM extended a ~$3bn asset-based forward-flow facility to home-improvement lender GreenSky and Guggenheim Investments launched an actively managed Investment Grade CLO ETF; and in legal, Freshfields advised toy-tech group tonies on a new syndicated revolving credit facility.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran/sanctions</strong>: Iran criticised the 'extraterritorial sovereignty' of the tough new US sanctions package Treasury Secretary Bessent is due to detail at a Monday press conference, keeping the Strait of Hormuz standoff unresolved.", src: "https://www.cnbc.com/2026/08/22/iran-criticizes-us-sanctions-extraterritorial-sovereignty.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Fed</strong>: Fed Chair Kevin Warsh will deliver his first Jackson Hole keynote on 28 August, with investors watching for any signal on the 16 September rate decision after the hawkish 19 August FOMC minutes.", src: "https://www.bloomberg.com/news/articles/2026-08-22/kevin-warsh-to-make-first-jackson-hole-speech-as-fed-chair", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; PGIM/GreenSky</strong>: PGIM Private Capital committed to a three-year, roughly $3bn asset-based forward-flow facility backing GreenSky, growing its asset-based finance pool as banks lean further on private credit for consumer/home-improvement lending.", src: "https://alternativecreditinvestor.com/2026/08/20/pgim-grows-abf-pool/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Guggenheim/CLO ETF</strong>: Guggenheim Investments expanded its active ETF platform with the launch of an actively managed Investment Grade CLO ETF (GCLO), adding to the wave of CLO-focused ETF launches this year.", src: "https://www.globenewswire.com/news-release/2026/08/20/3348515/16530/en/guggenheim-investments-expands-active-etf-platform-with-launch-of-two-new-etfs.html", srcName: "GlobeNewswire" },
        { html: "<strong>Legal &mdash; Freshfields/tonies</strong>: Freshfields advised toy-tech group tonies on a new syndicated revolving credit facility, the latest bank-club lending mandate captured in this run's alert sweep.", src: "https://www.freshfields.com/en/our-thinking/news/news-search/2026/08/freshfields-advises-tonies-on-syndicated-revolving-credit-facility", srcName: "Freshfields" },
      ],
    },
  },
};
