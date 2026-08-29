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
      date: "2026-08-29",
      time: "09:20 BST",
      lede: "Markets are still digesting Fed Chair Kevin Warsh's hawkish Jackson Hole debut &mdash; inflation still \"too high\" and the Fed has \"more work to do\" &mdash; which pushed fed-funds futures to a 57.5% chance of a 16 September hike and sent US stocks to a lower Friday close even as gilt/Treasury yields firmed. On the desks this morning: Crescent Capital closed its second CLO equity fund at $232m, private-credit lenders led by Antares, Apollo, Crescent, Blackstone and KKR completed a ~$1bn debt-reduction restructuring of dental group Affordable Care, and the legal desk logged a fresh High Court (Ch) ruling on shadow-director liability and unlawful preferences in a pre-2015 insolvency.",
      bullets: [
        { html: "<strong>Macro &mdash; Warsh's hawkish Jackson Hole debut</strong>: Fed Chair Kevin Warsh said this summer's cooler inflation readings \"do not tell me that underlying trends have meaningfully improved\" and that the Fed still has \"work to do\"; US stocks closed the week lower (S&amp;P 500 -0.25%, Nasdaq -0.52%, Dow -0.02%) as fed-funds futures priced a 57.5% chance of a September hike, up from 35.5% the prior day.", src: "https://www.cnbc.com/2026/08/28/kevin-warsh-jackson-hole-fed-inflation-rate-hike.html", srcName: "CNBC" },
        { html: "<strong>Credit &mdash; Crescent lands $232m for second CLO equity fund</strong>: Crescent Capital Group completed the final close of Crescent CLO Equity Funding II with $232m in commitments, more than double the $103m raised by its 2018 predecessor, taking control positions in Crescent CLOs and opportunistically in third-party CLO debt.", src: "https://alternativecreditinvestor.com/2026/08/28/crescent-lands-232m-for-second-clo-equity-fund/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Affordable Care's ~$1bn restructuring completes</strong>: Dental group Affordable Care completed a recapitalisation cutting debt by roughly 65% and providing $75m of new capital, with private-credit lenders Antares, Apollo and Crescent Capital alongside Blackstone and KKR (which took ownership control) extending maturities to 2031.", src: "https://finance.yahoo.com/healthcare/articles/affordable-care-completes-strategic-transaction-120000845.html", srcName: "Yahoo Finance" },
        { html: "<strong>Legal &mdash; Cavendish IP Solutions v On and On Consultants</strong>: The High Court (Ch) found an individual defendant was a de facto/shadow director despite no formal appointment, holding that payments to a company he controlled were unlawful preferences and that trading on while costs exceeded revenue was a fraudulent breach of fiduciary duty causing creditor losses over &pound;1m.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2247", srcName: "National Archives (Caselaw)" },
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
      date: "2026-08-28",
      time: "21:23 BST",
      lede: "Fed Chair Kevin Warsh's hawkish Jackson Hole debut sent stocks to a lower weekly close (S&amp;P -0.25%, Nasdaq -0.52%, Dow -0.02%) as fed-funds futures priced a 57.5% chance of a 16 September hike, up from 35.5% a day earlier, while sterling booked its own weekly loss on BoE hike bets pushed into 2027; in credit, LuminArx Capital Management and fintech lender Bridge launched a $500m direct-lending partnership for US retail suppliers and Ares disclosed the $7.1bn final close of its inaugural Credit Secondaries Fund, while the legal desk logged Latham's advisory roles on Nscale's US$790m Norway AI-data-centre financing and CVC's majority-stake partnership with UK proptech OpenRent.",
      bullets: [
        { html: "<strong>Macro &mdash; Warsh's Jackson Hole keynote resolves hawkish</strong>: Fed Chair Kevin Warsh's debut Jackson Hole speech said this summer's cooler inflation readings 'do not tell me that underlying trends have meaningfully improved' and that the Fed still has 'work to do'; stocks closed the week lower (S&amp;P 500 -0.25% to 7,711.76, Nasdaq -0.52%, Dow -0.02%) as fed-funds futures priced a 57.5% chance of a September hike, up from 35.5% the prior day.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-august-28-dow-sp-500-nasdaq-dip-fed-warsh-jackson-hole-speech-081514091.html", srcName: "Yahoo Finance" },
        { html: "<strong>Macro &mdash; sterling's weekly loss</strong>: Sterling was on track for its first weekly drop against the dollar in over a month as BoE hike expectations were pushed toward 2027, with LSEG data showing only ~24bp of tightening priced in by December.", src: "https://www.fxstreet.com/news/british-pound-edges-higher-despite-delaying-boe-rate-hike-expectations-202608280140", srcName: "FXStreet" },
        { html: "<strong>Credit &mdash; LuminArx/Bridge $500m retail-lending partnership</strong>: LuminArx Capital Management and fintech lending platform Bridge (a 2023 Citi spin-out) launched a $500m direct-lending partnership funding US consumer-packaged-goods brands and retail suppliers, with Bridge's AI-driven underwriting paired against LuminArx's credit capital.", src: "https://alternativecreditinvestor.com/2026/08/27/bridge-launches-500m-direct-lending-fund-for-us-retail-suppliers/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Ares' $7.1bn credit-secondaries final close</strong>: Ares Management disclosed the final close of its inaugural Ares Credit Secondaries Fund (ACS) at roughly $7.1bn including affiliated vehicles and leverage, doubling its $2bn target and marking what Ares calls the largest dedicated institutional credit-secondaries fund globally by LP commitments.", src: "https://ir.ares.com/news/ares-raises-over-dollar7-billion-for-leading-credit-secondaries-strategy/0a384df0-b0d7-4092-87e5-a0f0d9e71a25", srcName: "Ares Management" },
        { html: "<strong>Legal &mdash; Latham on Nscale's Norway data-centre financing</strong>: Latham &amp; Watkins advised AI-infrastructure hyperscaler Nscale on a US$790m senior secured project financing for a 108MW AI data centre in Narvik, Norway &mdash; the largest AI-infrastructure investment in the country &mdash; with Goldman Sachs International as sole structuring lead.", src: "https://www.lw.com/en/news/2026/08/latham-advises-on-nscale-usd790-million-norway-data-center-financing", srcName: "Latham & Watkins" },
      ],
    },
  },
};
