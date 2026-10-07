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
      date: "2026-10-07",
      time: "08:15 BST",
      bullets: [
        { html: "<strong>Macro &mdash; the energy shock has proved more manageable than feared</strong>: with Hormuz shut since February, about 11% of world oil supply is offline and Brent spiked near $120, yet analysts now see it averaging about $89 a barrel this year.", src: "https://www.ft.com/content/37e12a42-d473-4b1b-8fc5-4ea5f06d3bfb", srcName: "Financial Times", date: "2026-10-07" },
        { html: "<strong>Macro &mdash; India raised its repo rate 25bp to 5.50%</strong>, its first hike since February 2023, as a weak rupee and Middle East-driven imported inflation push the central bank to &lsquo;calibrated tightening&rsquo;.", src: "https://www.ft.com/content/713ccee6-855f-48d8-acf1-161265041ad8", srcName: "Financial Times", date: "2026-10-07" },
        { html: "<strong>Bonds &mdash; the US 10-year Treasury yield eased to 5.27%</strong> after touching 5.35% on Monday, its highest since 2002, while French spreads narrowed after Marine Le Pen vowed to cut the deficit.", src: "https://www.bloomberg.com/opinion/newsletters/2026-10-07/sesame-street-has-two-letters-for-the-record-us-stock-rally", srcName: "Bloomberg", date: "2026-10-07" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 rose 0.66% to a fresh record</strong>, its first all-time high since August, led by the AI mega-caps, with third-quarter earnings now forecast up 29.5% year on year.", src: "https://www.ft.com/content/7c38e8e3-8035-4036-8bc0-5fba2fbf77cb", srcName: "Financial Times", date: "2026-10-07" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-10-07",
      time: "14:22 BST",
      lede: "A renewed global bond sell-off has pushed the 30-year Treasury yield to its highest since 2002, with the energy shock and UK fiscal worries framing the afternoon.",
      bullets: [
        { html: "<strong>Macro &mdash; the Hormuz energy shock keeps biting</strong>: with Brent crude still elevated, ships&rsquo; captains are being paid $100,000 a month to transit the strait, while President Trump says he is considering suspending the federal petrol tax.", src: "https://www.ft.com/content/0d665e5b-d8c8-4f1e-acf5-bba7193b4e6e", srcName: "Financial Times", date: "2026-10-07" },
        { html: "<strong>Bonds &mdash; the global bond sell-off resumed</strong>, with the US 30-year Treasury yield at its highest since 2002 and the 10-year near 5.27%, as the Banque de France chief said ECB intervention is not needed to ease the rout.", src: "https://www.ft.com/content/33c67aa0-bfdb-457b-84bb-960b4fed94b6", srcName: "Financial Times", date: "2026-10-07" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 is holding at a record after a 0.66% gain</strong> on AI mega-cap strength, while Japan prepares a record revamp cutting hundreds of stocks from the Topix index.", src: "https://www.bloomberg.com/opinion/newsletters/2026-10-07/sesame-street-has-two-letters-for-the-record-us-stock-rally", srcName: "Bloomberg", date: "2026-10-07" },
        { html: "<strong>Credit &mdash; Arini raised $1.5 billion for its credit trading strategy</strong>, reopening it to new cash after two years even as its main hedge fund extended losses to a 13.5% decline.", src: "https://www.bloomberg.com/news/articles/2026-10-05/arini-raises-1-5-billion-even-as-its-main-fund-sees-13-5-loss", srcName: "Bloomberg", date: "2026-10-05" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-10-07",
      time: "18:11 BST",
      lede: "Markets held their lines into the close: the S&P 500 sat at a record on AI-mega-cap strength even as the long end of the Treasury curve stayed under pressure, with Brent elevated on the Hormuz shock.",
      bullets: [
        { html: "<strong>Macro &mdash; the Hormuz energy shock keeps biting</strong>, with Brent crude still elevated as ships&rsquo; captains are paid $100,000 a month to transit the strait, while President Trump says he is considering suspending the federal petrol tax.", src: "https://www.ft.com/content/0d665e5b-d8c8-4f1e-acf5-bba7193b4e6e", srcName: "Financial Times", date: "2026-10-07" },
        { html: "<strong>Bonds &mdash; the global bond sell-off resumed</strong>, with the US 30-year Treasury yield at its highest since 2002 and the 10-year near 5.27%, as the Banque de France chief said ECB intervention is not needed to ease the rout.", src: "https://www.ft.com/content/33c67aa0-bfdb-457b-84bb-960b4fed94b6", srcName: "Financial Times", date: "2026-10-07" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 is holding at a record after a 0.66% gain</strong> on AI mega-cap strength, while Japan prepares a record revamp cutting hundreds of stocks from the Topix index.", src: "https://www.bloomberg.com/opinion/newsletters/2026-10-07/sesame-street-has-two-letters-for-the-record-us-stock-rally", srcName: "Bloomberg", date: "2026-10-07" },
        { html: "<strong>Credit &mdash; Arini raised $1.5 billion for its credit trading strategy</strong>, reopening it to new cash after two years even as its main hedge fund extended losses to a 13.5% decline.", src: "https://www.bloomberg.com/news/articles/2026-10-05/arini-raises-1-5-billion-even-as-its-main-fund-sees-13-5-loss", srcName: "Bloomberg", date: "2026-10-05" },
      ],
    },
  },
};
