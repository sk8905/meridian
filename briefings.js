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
      date: "2026-08-24",
      time: "05:26 BST",
      lede: "Oil eased toward $86 WTI as markets awaited Bessent's Monday unveiling of the toughest Iran sanctions yet, Fed Chair Warsh's first Jackson Hole keynote is confirmed for Friday at 10am ET, Ofgem is due to confirm a roughly 4% energy price-cap rise this week, and in credit Manulife's CQS unit is marketing a fourth $1bn significant risk transfer fund.",
      bullets: [
        { html: "<strong>Macro &mdash; Oil/Iran</strong>: WTI slipped to roughly $85.93 and Brent to $93.22 as investors awaited Treasury Secretary Bessent's Monday unveiling of new Iran sanctions rather than pricing further escalation.", src: "https://www.cnbc.com/2026/08/24/oil-price-today-wti-brent-us-sanctions-iran.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Fed</strong>: Fed Chair Kevin Warsh's first Jackson Hole keynote as Chair is confirmed for 10:00am ET on Friday 28 August, three weeks ahead of the 16 September FOMC decision.", src: "https://www.kansascityfed.org/research/jackson-hole-economic-symposium/", srcName: "Kansas City Fed" },
        { html: "<strong>Macro &mdash; UK</strong>: Ofgem is due to confirm the October-December energy price cap on Wednesday, with forecasts pointing to a roughly 4% rise to around £1,729 a year for a typical household.", src: "https://www.itv.com/news/2026-08-23/ofgem-to-reveal-new-energy-price-cap-and-how-it-will-impact-household-bills", srcName: "ITV News" },
        { html: "<strong>Credit &mdash; Manulife | CQS</strong>: Manulife's CQS Investment Management is marketing a fourth significant/synthetic risk transfer (regulatory-capital relief) fund, targeting roughly $1bn and a low-double-digit target IRR investing in SRTs tied to corporate loans across Europe, North America and Asia.", src: "https://www.bloomberg.com/news/articles/2026-08-20/manulife-cqs-touts-double-digit-srt-returns-in-1-billion-pitch", srcName: "Bloomberg" },
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
      time: "21:09 BST",
      lede: "A quiet Sunday close leaves Iran's criticism of the 'extraterritorial sovereignty' of Washington's imminent sanctions package as the dominant overhang into Bessent's Monday press conference, with Fed Chair Kevin Warsh's first Jackson Hole keynote now five days out; in credit, Sona Asset Management's €400m Sona Aclai CLO I DAC and Guggenheim's new Investment Grade CLO ETF (GCLO) remain the freshest structured-credit prints on the desk; and in legal, Freshfields' advisory to toy-tech group tonies on a new syndicated revolving credit facility is still the latest bank-club lending mandate on file, with no fresh judgments handed down over the weekend (English courts do not sit Sundays).",
      bullets: [
        { html: "<strong>Macro &mdash; Iran/sanctions</strong>: Iran criticised the 'extraterritorial sovereignty' of the tough new US sanctions package Treasury Secretary Bessent is due to detail at a Monday press conference, keeping the Strait of Hormuz standoff unresolved heading into the new week.", src: "https://www.cnbc.com/2026/08/22/iran-criticizes-us-sanctions-extraterritorial-sovereignty.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Fed</strong>: Fed Chair Kevin Warsh will deliver his first Jackson Hole keynote on 28 August, with investors watching for any signal on the 16 September rate decision after the hawkish 19 August FOMC minutes.", src: "https://www.bloomberg.com/news/articles/2026-08-22/kevin-warsh-to-make-first-jackson-hole-speech-as-fed-chair", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; UK</strong>: UK employment continued to decline while price pressures mounted, Bloomberg's World Economy round-up showed, even as markets keep pricing a Bank of England hold at the 17 September MPC.", src: "https://www.bloomberg.com/news/articles/2026-08-22/world-economy-latest-uk-employment-declines-while-price-pressures-mount", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Sona/CLO</strong>: Sona Asset Management is preparing to price a €400m multicurrency European CLO, Sona Aclai CLO I DAC, spanning 97 corporate obligors with a five-year reinvestment period &mdash; still the desk's most recent structured-credit print.", src: "https://alternativecreditinvestor.com/2026/08/21/sona-prepares-to-launch-e400m-european-clo/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Freshfields/tonies</strong>: Freshfields advised toy-tech group tonies on a new syndicated revolving credit facility, still the latest bank-club lending mandate on file with no new alerts or judgments since Friday.", src: "https://www.freshfields.com/en/our-thinking/news/news-search/2026/08/freshfields-advises-tonies-on-syndicated-revolving-credit-facility", srcName: "Freshfields" },
      ],
    },
  },
};
