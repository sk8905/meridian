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
      time: "09:24 BST",
      lede: "Treasury Secretary Bessent detailed the 'toughest sanctions in history' on Iran at Monday's press conference, prompting Tehran to warn of Hormuz tanker seizures; a Bloomberg Opinion column argues Mayor Burnham's early poll bounce will collide with the hard fiscal arithmetic of the 28 October Budget; Jackson Hole (28 Aug) and Nvidia earnings (26 Aug) headline the week ahead; and in credit, doValue confirmed its Gardant unit's acquisition of Germany's coeo Group has now closed, extending the group into 13 European countries.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran/sanctions</strong>: Treasury Secretary Bessent detailed the 'toughest sanctions in history' on Iran and its trading partners at Monday's press conference, prompting Tehran to warn it may seize tankers transiting the Strait of Hormuz.", src: "https://www.cnbc.com/2026/08/24/us-iran-war-trump-hormuz-bessent-economic-sanctions-.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK Budget</strong>: With the 28 October Budget two months out, a Bloomberg Opinion column argues PM Burnham's early poll bounce will collide with the hard fiscal arithmetic Chancellor Healey must now navigate.", src: "https://www.bloomberg.com/opinion/articles/2026-08-24/uk-budget-burnham-s-poetic-beginning-will-soon-turn-to-prose", srcName: "Bloomberg Opinion" },
        { html: "<strong>Macro &mdash; Week ahead</strong>: Fed Chair Kevin Warsh's first Jackson Hole keynote (28 Aug) and Nvidia's Q2 FY27 results (26 Aug, ~$92bn revenue consensus) headline a pivotal week, alongside July core PCE (26 Aug, forecast steady ~3.3% y/y).", src: "https://www.fxstreet.com/analysis/the-week-ahead-jackson-hole-and-nvidia-results-to-take-focus-away-from-trump-202608240633", srcName: "FXStreet" },
        { html: "<strong>Credit &mdash; Gardant/doValue</strong>: doValue confirmed its Gardant unit's acquisition of Germany's coeo Group has closed (~€354.3m total consideration), extending the group's debt-servicing footprint into 13 European countries.", src: "https://dovalue.it/sites/default/files/PR%20-%20Acquisition%20of%20coeo%20-%20vSent.pdf", srcName: "doValue" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-24",
      time: "12:24 BST",
      lede: "Oil slipped and US futures traded mixed as markets awaited Treasury Secretary Bessent's 2pm ET press conference detailing new Iran sanctions, with Ottawa also vowing dollar-for-dollar retaliatory tariffs after US-Canada trade talks broke down; in credit, Royal London Asset Management's two European CLOs (Hambridge I and II) join the tracked roster; and in legal, Clifford Chance advised MUFG on a US$4.6bn structured-notes issuance programme.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran/oil</strong>: Brent slipped roughly 1.3% to about $93.16 and WTI fell to $85.70 as markets awaited Treasury Secretary Bessent's 2pm ET press conference detailing the 'toughest' US sanctions yet on Iran and its trading partners.", src: "https://www.cnbc.com/2026/08/24/oil-price-today-wti-brent-us-sanctions-iran.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Markets</strong>: US futures traded mixed to start the week as Ottawa vowed dollar-for-dollar retaliatory tariffs after US-Canada trade talks collapsed, ahead of a week headlined by Nvidia earnings (26 Aug) and the Jackson Hole symposium (27-29 Aug).", src: "https://finance.yahoo.com/markets/live/stock-market-today-monday-august-24-dow-sp-500-nasdaq-080306047.html", srcName: "Yahoo Finance" },
        { html: "<strong>Credit &mdash; Royal London/CLOs</strong>: Royal London Asset Management, the insurer-owned manager's £199bn asset-management arm, has built out a European leveraged-finance desk and priced two CLOs since September 2025 &mdash; the €434m debut Hambridge CLO I and a €500m upsized Hambridge CLO II in February, the largest European CLO priced year-to-date at launch.", src: "https://www.rlam.com/uk/institutional-investors/press-centre/2026/royal-london-asset-management-successfully-launches-500-million-hambridge-clo-ii--the-largest-european-clo-year-to-date/", srcName: "RLAM" },
        { html: "<strong>Legal &mdash; Clifford Chance/MUFG</strong>: Clifford Chance advised MUFG Bank and MUFG Securities EMEA on establishing and expanding structured-notes issuance programmes, including a US$4.6bn programme for MUFG Bank, supporting the group's push into investor bases beyond Japan and into EMEA and Asia.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-mufg-on-expansion-of-structured-notes-business.html", srcName: "Clifford Chance" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-24",
      time: "17:20 BST",
      lede: "Treasury Secretary Bessent's 'economic D-Day' Iran sanctions package dominates the desk into the close, alongside a fresh US-Canada tariff escalation and UK inflation running at a four-month high; in credit, PGIM's ~$3bn GreenSky forward-flow facility and Guggenheim's new Investment Grade CLO ETF (GCLO) remain the freshest prints; and in legal, Clifford Chance's advisory to MUFG on its structured-notes expansion is today's newest alert, alongside a new High Court ruling staying Hunkemöller noteholders' English claim in favour of parallel New York proceedings.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran/sanctions</strong>: Treasury Secretary Bessent is unveiling what the administration calls its toughest-ever sanctions package on Iran and its trading partners today, with oil markets already pricing in the escalation.", src: "https://www.npr.org/2026/08/24/g-s1-139743/treasury-secretary-scott-bessent-to-unveil-new-economic-sanctions-on-iran", srcName: "NPR" },
        { html: "<strong>Macro &mdash; US/Canada</strong>: Washington hit Canada with 50% tariffs after trade talks collapsed, with PM Mark Carney vowing dollar-for-dollar retaliation &mdash; adding a fresh trade-war front alongside the Iran standoff.", src: "https://www.bloomberg.com/news/articles/2026-08-22/us-canada-trade-talks-collapse-triggering-trump-s-50-tariffs", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; UK</strong>: UK CPI inflation jumped to a four-month high of 2.9% in July as energy bills rose roughly 13% on the Iran-war energy shock, complicating the BoE's 17 September rate decision.", src: "https://www.bloomberg.com/news/articles/2026-08-19/uk-inflation-climbs-to-four-month-high-as-energy-bills-rise", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; PGIM/GreenSky</strong>: PGIM committed to a three-year, roughly $3bn forward-flow facility with home-improvement lender GreenSky, growing its asset-based finance pool &mdash; the desk's most recent financing print.", src: "https://alternativecreditinvestor.com/2026/08/20/pgim-grows-abf-pool/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Clifford Chance/MUFG</strong>: Clifford Chance advised MUFG on the expansion of its structured notes business, today's newest legal alert, while the High Court stayed Hunkemöller noteholders' English claim against TMF Trustee pending parallel New York litigation over the same 2024 up-tiering.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-mufg-on-expansion-of-structured-notes-business.html", srcName: "Clifford Chance" },
      ],
    },
  },
};
