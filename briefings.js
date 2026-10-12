// =============================================================================
// briefings.js — the AI market briefing surfaced at the head of the Home News
// wire (v2/js/home/glance.js renderHomeBriefing). There is ONE briefing (no
// morning/afternoon/evening slots, no selector) — the single latest edition is
// always what the reader sees.
//
// GENERATION (see docs/refresh-routines.md): this is written by the full-refresh
// routine, NOT at runtime. The routine fires every ~2 hours and REWRITES this whole
// briefing on EVERY run — new `date`+`time` stamp, fresh `lede` and `bullets` — so the
// "Updated …" stamp advances roughly every two hours and the briefing is never more
// than one run stale. (The client also re-fetches this module when the app is
// foregrounded and reloads once if a newer edition has landed.)
//
// DESK FOCUS: the briefing covers the four MARKET desks — Macro, Bonds, Equities
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
// EVERY DESK CARRIES A BENCHMARK + A MARKET SNAPSHOT (owner rule, all four — not just
// Bonds/Equities). Each bullet LEADS WITH THE MOVE AND ITS DRIVER — a benchmark level or
// yield, then the specific catalyst (a stock, a data print, an issuance/deal) — and reads
// as a helpful one-line snapshot of that market, not a standing description. Name a pillable
// benchmark in EACH desk so the renderer injects a live ticker pill:
//   • Macro → a macro-relevant benchmark: the US 10-year, the dollar/DXY, Brent/WTI/Gold, or
//     the S&P 500 as the risk gauge — with the data/policy catalyst.
//   • Bonds → a benchmark yield level (the US 10-year, Bund or gilt — a % or a bp move).
//   • Equities → an index level / % move (S&P 500, Nasdaq, FTSE) or a mega-cap's price /
//     market value, with the driver.
//   • Credit → an ACTUAL CREDIT metric: a high-yield or investment-grade spread / yield (US
//     HY ≈ HYG, IG ≈ LQD, a CDX/iTraxx level), a CLO or new-issue spread, or a specific
//     private-credit deal's SIZE and PRICING (e.g. "a $1.2bn unitranche at SOFR+525"). CREDIT
//     IS DEBT, NOT EQUITY: a private-EQUITY buyout, an M&A auction, or "PE puts X up for sale"
//     is an EQUITIES/M&A story, NOT Credit — file it under Equities and give the Credit desk a
//     real debt-market line instead. If there is genuinely no fresh credit story, the renderer
//     shows a live HY/IG proxy fallback — do not mislabel an equity story as Credit to fill it.
// A bullet with no number is incomplete (enforced by tests/briefing-empty-bullet.mjs). Every
// figure is real + sourced (the `src` item or Wire's own live market data) — never invented;
// where a level isn't verifiable, quote the move or "record high" with the benchmark named,
// not a made-up number. Mentioning the benchmark by name (e.g. "Brent", "the US 10-year",
// "the S&P 500", "US high-yield spreads") is enough; the renderer detects it and injects the
// pill with the live move.
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
// it compresses. No invented figures, no uncited claims. A thin news run gets a
// short briefing, never padding.
// FRESHNESS — every bullet must be CURRENT as of the refresh. Each bullet carries a
// `date` (the cited item's real "YYYY-MM-DD"), and it must be within ~4 days of the
// briefing `date` — the briefing never surfaces stale news. The Credit desk in
// particular goes quiet for days; when a desk has NO fresh, verified item this run,
// DROP that desk's bullet rather than back-filling a stale deal (Macro/Bonds/Equities
// stay — their daily market levels are always current; Credit is optional).
// Enforced on the committed data by tests/briefing-empty-bullet.mjs (a bullet older
// than 4 days, or with no date, fails the suite and blocks deploy). Both the `lede`
// and each bullet `html` are authored, trusted HTML (entities like &pound;/&mdash;
// render). Served no-cache + tokenless (see _headers), so a routine refresh is picked
// up without a code token bump (HOUSE_STYLE T1). The lede is a TOP-LINE SYNTHESIS of
// the day's arc — it must NOT restate the bullets: no bullet's lead sentence or
// specific claim is repeated verbatim in the lede. Keep it tight (the card shows it
// in full).
// =============================================================================
export const BRIEFINGS = {
  tz: "BST",
  date: "2026-10-12",
  time: "17:15 BST",
  lede: "Diesel prices slip after Trump's 'energy ceasefire' in Ukraine, Macron says a Franco-German deal on EU car policy is imminent, and Germany's labour minister resigns as Merz's coalition strains.",
  bullets: [
    { html: "<strong>Oil &mdash; diesel prices slipped after Trump claimed an &lsquo;energy ceasefire&rsquo; in the Ukraine war</strong>, easing pressure on Brent, though Zelenskyy says Putin is already breaching it.", src: "https://www.ft.com/content/a663781e-2709-41f2-99df-4fb5a6162e6b", srcName: "Financial Times", date: "2026-10-12" },
    { html: "<strong>Bonds &mdash; the US 10-year Treasury yield held near 5.24% ahead of Wednesday&rsquo;s September CPI</strong>, steadying after touching 5.36% on 7 October &mdash; its highest since 2002 &mdash; with the cash market shut Monday for the Columbus Day holiday.", src: "https://tradingeconomics.com/united-states/government-bond-yield/news/516491", srcName: "Trading Economics", date: "2026-10-12" },
    { html: "<strong>Equities &mdash; the S&amp;P 500&rsquo;s record-breaking run is set to cool</strong> after a streak of record highs left Wall Street near all-time peaks.", src: "https://www.ft.com/content/50bb9758-abf7-43a4-bd8b-0c1e5895b4c2", srcName: "Financial Times", date: "2026-10-12" },
    { html: "<strong>Macro &mdash; the Nobel prize for economics was awarded to Robert E Hall and Michael Woodford</strong>.", src: "https://www.ft.com/content/f4463a28-832d-4a2d-acc5-d83e258610cb", srcName: "Financial Times", date: "2026-10-12" },
    { html: "<strong>Europe &mdash; Germany&rsquo;s labour minister resigned as strains deepen in Chancellor Merz&rsquo;s coalition</strong>.", src: "https://www.ft.com/content/46b33d0d-274d-496e-9c42-1d4cf18b65cb", srcName: "Financial Times", date: "2026-10-12" },
  ],
};
