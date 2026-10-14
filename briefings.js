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
  date: "2026-10-14",
  time: "14:05 BST",
  lede: "A hotter-than-expected US inflation print lands on a market already pricing higher-for-longer, with energy the common thread from the Iran war to the Houthi strike on Aramco and the IMF's warning on debt and yields.",
  bullets: [
    { html: "<strong>Macro &mdash; US inflation jumped to 3.7% y/y in September, above the 3.6% consensus,</strong> as the Iran war pushed up energy prices; Brent was trading around $105 earlier in the session after Houthi attacks hit Saudi Aramco&rsquo;s headquarters.", src: "https://www.ft.com/content/c1e4c8b1-8fe0-414d-b52f-c74a6d927b3d", srcName: "Financial Times", date: "2026-10-14" },
    { html: "<strong>Bonds &mdash; the US 10-year Treasury yield stood near 5.20% (30-year 5.549%) going into the September CPI print</strong>, while ECB Governing Council member Pierre Wunsch said the bank will &ldquo;probably have to hike again&rdquo; with euro-area inflation approaching 4%.", src: "https://www.cnbc.com/2026/10/14/us-treasury-yields-cpi-inflation-report.html", srcName: "CNBC", date: "2026-10-14" },
    { html: "<strong>Equities &mdash; S&amp;P 500 futures pointed to a modest rise (7,872, +0.2%)</strong> before the CPI release as ASML raised its full-year sales outlook for a third straight quarter on AI demand.", src: "https://www.bloomberg.com/news/articles/2026-10-14/asml-raises-full-year-sales-outlook-as-ai-boom-drives-demand", srcName: "Bloomberg", date: "2026-10-14" },
    { html: "<strong>Credit &mdash; redemption requests at perpetual non-traded BDCs fell quarter on quarter at 13 of 15 tracked vehicles</strong> but still averaged 9.8% of shares, above the 5% cap at nine, per Fitch; Fitch expects further declines in coming quarters.", src: "https://goto.fitchratings.com/v/NzMyLUNLSC03NjcAAAGk1Rb7mMWlAmc_OtJ58Ixz-D4naVC4G8VQQGmARJOZKvK_7Hs_WgDiZftmyZrOEi3XWC1L9BA=", srcName: "Fitch Ratings", date: "2026-10-13" },
  ],
};
