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
      date: "2026-08-29",
      time: "17:20 BST",
      lede: "The Fed/Trump tension from Kevin Warsh's hawkish Jackson Hole debut carried into Saturday, with the FT framing a looming collision between the Fed chair and the White House ahead of the midterms even as BoE Governor Andrew Bailey played down second-round UK inflation risk before September's MPC meeting; on the credit desk, RBC BlueBay and Fortress both priced fresh European CLOs this week, while the legal desk logged a Commercial Court ruling voiding a fund GP's transfer of a VC fund's entire portfolio into a continuation vehicle.",
      bullets: [
        { html: "<strong>Macro &mdash; Warsh sets Fed on collision course with Trump</strong>: The Financial Times reports Fed Chair Kevin Warsh's hawkish Jackson Hole keynote has put the central bank on a path that could clash with President Trump's preference for lower rates as the midterm elections approach.", src: "https://www.ft.com/content/69452aea-cee0-47de-be8a-dc790fed3db1", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; Bailey downplays second-round UK inflation risk</strong>: BoE Governor Andrew Bailey said the UK is not seeing significant second-round inflation effects ahead of the Bank's next rate decision, a dovish-leaning signal against the hawkish US mood.", src: "https://www.bloomberg.com/news/articles/2026-08-28/boe-s-bailey-downplays-second-round-effects-before-rate-decision", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; RBC BlueBay and Fortress price fresh European CLOs</strong>: RBC BlueBay priced a &euro;400m reset of its 2021-vintage BBAM Euro CLO II (its fifth CLO transaction of 2026), while Fortress Investment Group priced Fortress Credit Europe BSL 2026-3 DAC, its third European CLO, at &euro;406m.", src: "https://alternativecreditinvestor.com/2026/08/11/rbc-bluebay-prices-e400m-european-clo-reset/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Commercial Court voids continuation-fund transfer</strong>: In Cedar Mundi (Holding) SAL v Attieh &amp; Ors, the Commercial Court held that a fund director's transfer of substantially all of a Lebanese venture-capital fund's portfolio &mdash; ultimately into a continuation vehicle &mdash; breached his fiduciary duties and lacked proper governance authorisation, per Herbert Smith Freehills Kramer's banking-litigation note.", src: "https://www.hsfkramer.com/notes/bankinglitigation/2026-08/high-court-finds-transfer-of-assets-to-continuation-fund-to-be-void", srcName: "Herbert Smith Freehills Kramer" },
      ],
    },
  },
};
