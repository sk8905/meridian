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
      date: "2026-10-09",
      time: "10:13 BST",
      lede: "Pimco warned the US 10-year Treasury yield could reach 6% for the first time since 2000; AI-valuation and credit stress built as OpenAI revenues undershot; and the Iran conflict kept energy markets and oil majors in focus.",
      bullets: [
        { html: "<strong>Macro &mdash; the Iran conflict is reshaping what investors want from oil majors</strong>, after it snarled usually free-flowing energy markets and kept Brent elevated with the energy-shock risk still live.", src: "https://www.ft.com/content/7b354a5d-9702-407a-a4bc-8703c6ba7b72", srcName: "Financial Times", date: "2026-10-09" },
        { html: "<strong>Bonds &mdash; Pimco says the US 10-year Treasury yield risks hitting 6%</strong> for the first time since 2000, warning a further sharp rise in borrowing costs is &lsquo;feasible&rsquo; as market participants unwind losing bets.", src: "https://www.ft.com/content/a752a86c-cf05-4152-b842-2ae6b6bf3fe0", srcName: "Financial Times", date: "2026-10-09" },
        { html: "<strong>Equities &mdash; OpenAI&rsquo;s annualised revenues are running about $20bn below earlier signals</strong>, a fresh test for AI valuations as the S&amp;P 500 and Nasdaq trade near record highs.", src: "https://www.ft.com/content/b66a9858-f8fb-46cb-b506-44bfe26fca2a", srcName: "Financial Times", date: "2026-10-08" },
        { html: "<strong>Credit &mdash; the cost of credit-default swaps for AI companies looking to borrow is climbing</strong>, among a cluster of market-stress signals pointing to trouble ahead for leveraged tech credit.", src: "https://www.ft.com/content/7acb5862-cde5-49b4-a5f1-5f6e6977a9c7", srcName: "Financial Times", date: "2026-10-09" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-10-09",
      time: "16:17 BST",
      lede: "Pimco warned the US 10-year Treasury yield could reach 6%; Delta cut its full-year profit outlook as fuel costs bite; and AI-credit stress and OpenAI revenue doubts weighed on valuations.",
      bullets: [
        { html: "<strong>Macro &mdash; Delta cut its full-year profit outlook as higher fuel prices bite</strong>, the latest corporate sign of the energy shock from the Iran conflict feeding through, with Brent still elevated.", src: "https://www.ft.com/content/77d73223-3cfc-4892-a3c5-5502595f42d4", srcName: "Financial Times", date: "2026-10-09" },
        { html: "<strong>Bonds &mdash; Pimco says the US 10-year Treasury yield risks hitting 6%</strong> for the first time since 2000, warning a further sharp rise in borrowing costs is &lsquo;feasible&rsquo; as market participants unwind losing bets.", src: "https://www.ft.com/content/a752a86c-cf05-4152-b842-2ae6b6bf3fe0", srcName: "Financial Times", date: "2026-10-09" },
        { html: "<strong>Equities &mdash; OpenAI&rsquo;s annualised revenues are running about $20bn below earlier signals</strong>, a fresh test for AI valuations as the S&amp;P 500 and Nasdaq trade near record highs.", src: "https://www.ft.com/content/b66a9858-f8fb-46cb-b506-44bfe26fca2a", srcName: "Financial Times", date: "2026-10-08" },
        { html: "<strong>Credit &mdash; the cost of credit-default swaps for AI companies looking to borrow is climbing</strong>, among a cluster of market-stress signals pointing to trouble ahead for leveraged tech credit.", src: "https://www.ft.com/content/7acb5862-cde5-49b4-a5f1-5f6e6977a9c7", srcName: "Financial Times", date: "2026-10-09" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-10-10",
      time: "00:10 BST",
      lede: "Trump launched a committee to investigate Fed governor Lisa Cook; Pimco warned the US 10-year yield could reach 6%; US telcos lost $60bn of value on SpaceX's spectrum purchase; and AI-borrower CDS costs kept climbing.",
      bullets: [
        { html: "<strong>Macro &mdash; Trump launched a committee to investigate Fed governor Lisa Cook</strong>, escalating the White House&rsquo;s pressure on the central bank with the FOMC due to meet on 27&ndash;28 October.", src: "https://www.ft.com/content/d0c81cd2-f944-46b9-a859-abc3f0bd3516", srcName: "Financial Times", date: "2026-10-09" },
        { html: "<strong>Bonds &mdash; Pimco says the US 10-year Treasury yield risks hitting 6%</strong> for the first time since 2000, warning a further sharp rise in borrowing costs is &lsquo;feasible&rsquo; as market participants unwind losing bets.", src: "https://www.ft.com/content/a752a86c-cf05-4152-b842-2ae6b6bf3fe0", srcName: "Financial Times", date: "2026-10-09" },
        { html: "<strong>Equities &mdash; US telecom groups shed $60bn in market value</strong> after SpaceX announced a spectrum purchase, the day&rsquo;s sharpest sector repricing.", src: "https://www.ft.com/content/8c3f95ec-2428-4102-9f67-b707f1264c69", srcName: "Financial Times", date: "2026-10-09" },
        { html: "<strong>Credit &mdash; the cost of credit-default swaps for AI companies looking to borrow is climbing</strong>, among a cluster of market-stress signals pointing to trouble ahead for leveraged tech credit.", src: "https://www.ft.com/content/7acb5862-cde5-49b4-a5f1-5f6e6977a9c7", srcName: "Financial Times", date: "2026-10-09" },
      ],
    },
  },
};
