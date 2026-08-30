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
      date: "2026-08-30",
      time: "05:11 BST",
      lede: "A quiet weekend for data left markets still working through Fed Chair Kevin Warsh's hawkish Jackson Hole debut &mdash; inflation still \"too high\" and the Fed has \"more work to do\" &mdash; with the September hike odds hardening to a coin flip, while in Westminster Chancellor John Healey is aiming for a low-drama 28 October Budget even as political heat rises around Andy Burnham's higher-spending instincts. On the desks: BridgeInvest banked $612m for its US speciality real-estate credit fund, and the legal desk's latest alert has Travers Smith advising Peel Group on its &pound;582.88m cash offer for Harworth Group.",
      bullets: [
        { html: "<strong>Macro &mdash; Warsh's hawkish Jackson Hole debut still setting the tone</strong>: Fed Chair Kevin Warsh said this summer's cooler inflation readings \"do not tell me that underlying trends have meaningfully improved\" and that the Fed still has \"work to do\"; fed-funds futures closed the week pricing a 57.5% chance of a 16 September hike, up from 35.5% the day before, with US stocks finishing lower on the Friday session even as they closed the week higher.", src: "https://www.cnbc.com/2026/08/28/kevin-warsh-jackson-hole-fed-inflation-rate-hike.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Healey eyes a drama-free Autumn Budget</strong>: Chancellor John Healey is preparing his first Budget (28 October) around fiscal discipline as the Government's \"bedrock\", even as political heat builds around Health Secretary Andy Burnham's higher-spending instincts within the Labour Government.", src: "https://www.bloomberg.com/news/articles/2026-08-29/john-healey-seeks-drama-free-uk-budget-as-economic-heat-rises-on-burnham", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; BridgeInvest raises $612m for US speciality RE credit fund</strong>: Miami-based BridgeInvest held the second closing of its fifth vintage specialty credit fund at $612m of LP equity, targeting senior-secured, first-lien loans of $20-150m against US commercial real estate, with commitments expected to exceed $1bn by 2027.", src: "https://alternativecreditinvestor.com/2026/08/28/bridgeinvest-raises-612m-for-us-speciality-re-credit-fund/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Travers Smith advises Peel Group on &pound;582.88m Harworth offer</strong>: Travers Smith advised Peel Pepper (UK) Limited on a voluntary cash offer for LSE-listed Harworth Group plc at 172.5p/share &mdash; a c.36.0% premium to the three-month VWAP &mdash; valuing the regeneration and strategic-land company at approximately &pound;582.88m; Rothschild & Co acted as sole financial adviser to BidCo.", src: "https://www.traverssmith.com/knowledge/knowledge-container/travers-smith-advises-peel-group-on-its-cash-offer-for-harworth-group-plc/", srcName: "Travers Smith" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-29",
      time: "12:17 BST",
      lede: "Markets are still absorbing Fed Chair Kevin Warsh's hawkish Jackson Hole debut &mdash; inflation still \"too high\" and the Fed has \"more work to do\" &mdash; which pushed fed-funds futures to a 57.5% chance of a 16 September hike and left US stocks lower into the weekend even as UK gilt yields firmed on the same read-through; on the desks, Crescent Capital's second CLO equity fund closed at $232m, Clifford Chance advised lenders on a US$1bn KEXIM-backed copper-import financing, and the High Court (Comm) ordered an inquiry into freezing-injunction damages in Apollo XI v Nexedge Markets.",
      bullets: [
        { html: "<strong>Macro &mdash; Warsh's hawkish Jackson Hole debut</strong>: Fed Chair Kevin Warsh said this summer's cooler inflation readings \"do not tell me that underlying trends have meaningfully improved\" and that the Fed still has \"work to do\"; US stocks closed the week lower (S&amp;P 500 -0.25%, Nasdaq -0.52%, Dow -0.02%) as fed-funds futures priced a 57.5% chance of a September hike, up from 35.5% the prior day.", src: "https://www.cnbc.com/2026/08/28/kevin-warsh-jackson-hole-fed-inflation-rate-hike.html", srcName: "CNBC" },
        { html: "<strong>Credit &mdash; Crescent lands $232m for second CLO equity fund</strong>: Crescent Capital Group completed the final close of Crescent CLO Equity Funding II with $232m in commitments, more than double the $103m raised by its 2018 predecessor, taking control positions in Crescent CLOs and opportunistically in third-party CLO debt.", src: "https://alternativecreditinvestor.com/2026/08/28/crescent-lands-232m-for-second-clo-equity-fund/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Clifford Chance on $1bn KEXIM copper financing</strong>: Clifford Chance's Dubai team advised a lender group &mdash; KEXIM, KEXIM Global (Singapore), KEXIM Asia, JPMorgan Chase Bank (London) and Banco Santander &mdash; on a US$1bn export financing to a global diversified natural-resources company, structured to secure copper supply for Korean industry.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-lenders-on-a-us1-billion-kexim-backed-financing-supporting-copper-imports-to-south-korea.html", srcName: "Clifford Chance" },
        { html: "<strong>Legal &mdash; freezing-injunction damages inquiry</strong>: In Apollo XI Limited v Nexedge Markets Limited, the High Court (Comm) granted Nexedge's application to enforce Apollo's cross-undertaking in damages and ordered an inquiry into losses caused by a freezing injunction the court had earlier discharged for breach of the duty of full and frank disclosure.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/comm/2026/2240", srcName: "National Archives (Caselaw)" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-29",
      time: "21:17 BST",
      lede: "A quiet Saturday close saw the September Fed decision harden into a coin flip as rate-hike odds kept climbing after Warsh's hawkish Jackson Hole debut, while sterling held up despite the BoE's hike-back-into-2027 repricing; on the credit desk BridgeInvest banked $612m for its US speciality real-estate credit fund, and the legal desk logged Clifford Chance advising lenders on a $1bn KEXIM-backed copper-import financing for South Korea.",
      bullets: [
        { html: "<strong>Macro &mdash; September Fed decision now a coin flip</strong>: CNBC reports fed-funds futures imply a near-56% chance of a 16 September rate hike (up from ~35% pre-speech), with Kalshi and Polymarket traders near 48-49%, after Chair Warsh's hawkish Jackson Hole keynote.", src: "https://www.cnbc.com/2026/08/28/-september-fed-decision-now-a-coin-flip-as-rate-hike-odds-increase.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; sterling firms even as BoE hike bets fade</strong>: FXStreet notes the pound edged higher even as markets pushed the next Bank of England hike further into 2027, following Governor Bailey's comments that the UK isn't seeing significant second-round inflation.", src: "https://www.fxstreet.com/news/british-pound-edges-higher-despite-delaying-boe-rate-hike-expectations-202608280140", srcName: "FXStreet" },
        { html: "<strong>Credit &mdash; BridgeInvest raises $612m for US RE credit fund</strong>: The Miami manager's fifth vintage speciality credit fund held a $612m second closing, targeting first-lien loans against US commercial real estate with commitments expected past $1bn by 2027.", src: "https://alternativecreditinvestor.com/2026/08/28/bridgeinvest-raises-612m-for-us-speciality-re-credit-fund/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Clifford Chance advises on $1bn KEXIM-backed financing</strong>: Clifford Chance advised lenders on a US$1bn Korea Eximbank-backed financing supporting copper imports to South Korea.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-lenders-on-a-us1-billion-kexim-backed-financing-supporting-copper-imports-to-south-korea.html", srcName: "Clifford Chance" },
      ],
    },
  },
};
