// =============================================================================
// briefings.js — the AI market briefing surfaced at the head of the Home News
// wire (v2/js/home/glance.js renderHomeBriefing). Only the LATEST (freshest-
// stamped) slot is shown — there is no header button and no slot selector.
//
// GENERATION (see docs/refresh-routines.md): these are written by the 5×/day
// refresh routine, NOT at runtime. Three rolling slots are kept as the store;
// each run regenerates whichever slot the clock is in (morning < 12:00 · afternoon
// 12:00–17:00 · evening ≥ 17:00 BST) and restamps it, so the freshest slot — the
// one the reader sees — is renewed on every run (up to 5× a day).
//
// DESK FOCUS: the briefings cover the four MARKET desks — Macro, Bonds, Equities
// and Credit (private equity / private credit fund news) — and ONLY those (no
// Legal; it has its own surface). Each bullet's <strong> lead is tagged with its
// desk. The first four bullets are the ones the Home card renders
// (HB_MAX_BULLETS — one iPhone screen), so they carry the four-desk spread.
// ONE CONTINUOUS ITEM PER DESK: the card groups bullets by their desk lead, and a
// desk that carries two stories (e.g. two Macro items) is ALWAYS combined into a
// SINGLE continuous item — one "Macro" kicker, the two stories folded into one
// flowing run of prose, and both sources on one trailing line — never stacked as
// separate sub-bullets and never a repeated kicker. Author each item with its own
// desk lead and source as usual; the render strips the follow-on's kicker,
// re-capitalises its lead and folds it in, so each story should stand as its own
// self-contained sentence that reads cleanly when run on after the one before it.
// Equities & Bonds bullets LEAD WITH THE MOVE AND ITS DRIVER — the index
// or yield change, then the specific catalyst behind it (a stock, a data print,
// an issuance event) — not a standing description. ALWAYS carry a concrete PRICE
// REFERENCE: a Bonds bullet names a benchmark yield level (the US 10-year, Bund or
// gilt — a % or a bp move); an Equities bullet names an index level / % move (S&P
// 500, Nasdaq) or a mega-cap's price or market value. A Bonds/Equities bullet with
// no number is incomplete (enforced by tests/briefing-empty-bullet.mjs). Every
// figure is real + sourced (the `src` item or Wire's own live market data) — never
// invented; where a level isn't verifiable, quote the move or "record high" with the
// index named, not a made-up number. EVERY SLOT names at least one pillable benchmark —
// a Treasury yield, a major index, or a commodity (Brent/WTI/Gold) — so each brief carries
// an inline live ticker pill (enforced by tests/briefing-empty-bullet.mjs). Mentioning the
// benchmark by name (e.g. "Brent", "the US 10-year", "the S&P 500") is enough; the renderer
// detects it and injects the pill with the live move.
//
// HARD INFORMATION — GIVE THE NUMBERS, NOT A HEADLINE. Each bullet must deliver
// specific, quantified fact a professional can act on: the actual level/size and
// its move (a %, a bp count, a $ or £ amount, a multiple, a date), the named
// parties, and the mechanism or driver behind the move — never a bare qualitative
// characterisation. BAN empty headline phrases that carry no information unless the
// concrete figure is given in the SAME breath: "a big push into X", "surprisingly
// manageable", "in the spotlight", "under pressure", "a challenging picture",
// "weighs on", "eyes a deal", "ramping up". If a bullet would work as a newspaper
// headline — a claim with no number, size or mechanism — it is INCOMPLETE; add the
// figure or cut it. Prefer ONE fully-informative sentence over two thin ones, and
// never ship a one-clause stub (tests/briefing-empty-bullet.mjs flags a body that
// is headline-short). Example — NOT "Blue Owl is preparing a big push into
// insurance" but "Blue Owl ($319bn AUM) is pushing into insurance capital: CEO
// Ostrover wants a larger insurance balance sheet to fund bespoke private-credit
// deals, backing insurers rather than buying one outright."
// KEEP IT TIGHT — the desktop card lays the four desks out as side-by-side columns in
// a fixed quadrant, so an over-long bullet overflows/clips it. One or two sentences per
// desk, roughly 30–45 words: lead with the fact + its number, then the single most
// important qualifier, and stop. Pack the figure in; drop connective filler ("as demand
// cools and non-OPEC output fills the gap", "with near-term cuts now off the table").
// tests/briefing-empty-bullet.mjs flags a body that runs too long.
//
// ATTRIBUTION — STATE THE NEWS, DON'T NARRATE THE REPORTING. Each bullet states the
// news directly as fact; NEVER attribute it via the publication's act of reporting —
// no "the FT reports/explains", "Bloomberg notes", "according to …", "<name> says/
// writes/warns that". The source is the trailing srcName line and the src URL; the
// prose must not name the outlet or describe what it "reports"/"explains"/"notes". A
// bullet carries ONE src, so never fold a second outlet's claim into it ("… Bloomberg's
// Markets Daily notes …") — keep only what the bullet's own src supports, or drop it.
//
// GROUNDING (HOUSE_STYLE / non-negotiables): a briefing is a SUMMARY of items
// Wire already holds — every bullet carries a real `src` URL to the wire/desk item
// it compresses. No invented figures, no uncited claims. A thin news slot gets a
// short briefing, never padding.
// FRESHNESS — every bullet must be CURRENT as of the refresh. Each bullet carries a
// `date` (the cited item's real "YYYY-MM-DD"), and it must be within ~4 days of the
// slot date — the briefing never surfaces stale news. The Credit desk in particular
// goes quiet for days; when a desk has NO fresh, verified item this run, DROP that
// desk's bullet for the slot rather than back-filling a stale deal (Macro/Bonds/
// Equities stay — their daily market levels are always current; Credit is optional).
// Enforced on the committed data by tests/briefing-empty-bullet.mjs (a bullet older
// than 4 days, or with no date, fails the suite and blocks deploy). Both the `lede` and each bullet `html` are
// authored, trusted HTML (entities like &pound;/&mdash; render). Served no-cache +
// tokenless (see _headers), so a routine refresh is picked up without a code token
// bump (HOUSE_STYLE T1). The lede is a TOP-LINE SYNTHESIS of the day's arc — it must
// NOT restate the bullets: no bullet's lead sentence or specific claim is repeated
// verbatim in the lede. Keep it tight (the card shows it in full).
// =============================================================================
export const BRIEFINGS = {
  tz: "BST",
  // Ordered for the slot chips; the view picks the current slot by clock.
  order: ["morning", "afternoon", "evening"],
  slots: {
    morning: {
      label: "Morning",
      date: "2026-10-10",
      time: "10:10 BST",
      lede: "Slowing dealmaking added to equity-market warning signs, UK tracker-mortgage demand jumped as fixed rates rose, and Pimco's call that the US 10-year yield could reach 6% kept bond markets on edge.",
      bullets: [
        { html: "<strong>Macro &mdash; demand for UK tracker mortgages has jumped</strong> as rates on fixed-rate deals rise, the latest sign of higher borrowing costs feeding through to households.", src: "https://www.ft.com/content/08e41a4a-425b-4fcd-98e6-e2283faed94b", srcName: "Financial Times", date: "2026-10-10" },
        { html: "<strong>Bonds &mdash; Pimco says the US 10-year Treasury yield risks hitting 6%</strong> for the first time since 2000, warning a further sharp rise in borrowing costs is &lsquo;feasible&rsquo; as market participants unwind losing bets.", src: "https://www.ft.com/content/a752a86c-cf05-4152-b842-2ae6b6bf3fe0", srcName: "Financial Times", date: "2026-10-09" },
        { html: "<strong>Equities &mdash; slowing deal activity is another flashing red sign for equity markets</strong>, adding to a cluster of warning signals for stocks.", src: "https://www.ft.com/content/a7532546-d9b2-4889-b2a6-ff68658a1782", srcName: "Financial Times", date: "2026-10-10" },
        { html: "<strong>Credit &mdash; the cost of credit-default swaps for AI companies looking to borrow is climbing</strong>, among a cluster of market-stress signals pointing to trouble ahead for leveraged tech credit.", src: "https://www.ft.com/content/7acb5862-cde5-49b4-a5f1-5f6e6977a9c7", srcName: "Financial Times", date: "2026-10-09" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-10-10",
      time: "14:10 BST",
      lede: "Slowing dealmaking added to equity-market warning signs, Pimco said the US 10-year yield could reach 6%, UK tracker-mortgage demand jumped as fixed rates rose, and Partners Group launched an evergreen private credit income strategy.",
      bullets: [
        { html: "<strong>Equities &mdash; slowing deal activity is another flashing red sign for equity markets</strong>, adding to a cluster of warning signals for stocks.", src: "https://www.ft.com/content/a7532546-d9b2-4889-b2a6-ff68658a1782", srcName: "Financial Times" },
        { html: "<strong>Bonds &mdash; Pimco says the US 10-year Treasury yield risks hitting 6%</strong> for the first time since 2000.", src: "https://www.ft.com/content/a752a86c-cf05-4152-b842-2ae6b6bf3fe0", srcName: "Financial Times" },
        { html: "<strong>UK &mdash; demand for tracker mortgages has jumped</strong> as rates on fixed-rate deals rise.", src: "https://www.ft.com/content/08e41a4a-425b-4fcd-98e6-e2283faed94b", srcName: "Financial Times" },
        { html: "<strong>Credit &mdash; Partners Group launched an evergreen multi-sector private credit income strategy</strong> for institutional and private wealth investors, spanning direct lending, credit secondaries, fund financing and royalties.", src: "https://alternativecreditinvestor.com/2026/10/09/partners-group-launches-private-credit-income-fund/", srcName: "Alternative Credit Investor" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-10-10",
      time: "22:10 BST",
      lede: "AI borrowing slowed as investors grew wary of the debt binge, hurricane disruption hit US oil and gas output, Pimco warned the US 10-year yield could reach 6%, and slowing dealmaking added to equity warning signs.",
      bullets: [
        { html: "<strong>Macro &mdash; oil and gas production was disrupted as Hurricane Isaias hit the US</strong>, adding a fresh supply shock to an energy market already on edge.", src: "https://www.ft.com/content/f7d90625-0d78-44b2-927f-d63f4dbc5e8d", srcName: "Financial Times", date: "2026-10-10" },
        { html: "<strong>Bonds &mdash; Pimco says the US 10-year Treasury yield risks hitting 6%</strong> for the first time since 2000, warning a further sharp rise in borrowing costs is &lsquo;feasible&rsquo;.", src: "https://www.ft.com/content/a752a86c-cf05-4152-b842-2ae6b6bf3fe0", srcName: "Financial Times", date: "2026-10-09" },
        { html: "<strong>Equities &mdash; slowing deal activity is another flashing red sign for equity markets</strong>, adding to a cluster of warning signals for stocks.", src: "https://www.ft.com/content/a7532546-d9b2-4889-b2a6-ff68658a1782", srcName: "Financial Times", date: "2026-10-10" },
        { html: "<strong>Credit &mdash; AI borrowing is slowing</strong> as investors grow wary of the debt binge funding the build-out.", src: "https://www.ft.com/content/9c13d40e-d2b2-45d5-921c-a68cd4b308f9", srcName: "Financial Times", date: "2026-10-10" },
      ],
    },
  },
};
