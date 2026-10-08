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
      date: "2026-10-08",
      time: "08:15 BST",
      bullets: [
        { html: "<strong>Macro &mdash; September FOMC minutes</strong> show the unanimous 25bp hike was backed for differing reasons (energy-driven price pressure vs demand-led inflation), with broad agreement on another rise this year; the next decision is at the late-October meeting.", src: "https://www.reuters.com/business/fed-policymakers-divided-over-rate-hike-logic-september-minutes-show-2026-10-07/", srcName: "Reuters", date: "2026-10-07" },
        { html: "<strong>Bonds &mdash; the US 30-year Treasury yield hit a fresh 24-year high</strong> and the 10-year touched a 24-year high too, before a 10-year auction drawing the strongest demand since 2016 steadied the market; the French/German spread widened 10bp to 138bp.", src: "https://www.reuters.com/business/us-30-year-bond-yield-hits-fresh-24-year-high-2026-10-07/", srcName: "Reuters", date: "2026-10-07" },
        { html: "<strong>Equities &mdash; stocks slid on rising yields</strong>: the FTSE 100 fell 0.8% led by banks and Europe lost about 1%, while the S&amp;P 500&rsquo;s record run was questioned as the US term premium hit a 12-year high of 96bp.", src: "https://www.reuters.com/business/energy/banks-lead-ftse-100-lower-gilt-yields-oil-prices-climb-2026-10-07/", srcName: "Reuters", date: "2026-10-07" },
        { html: "<strong>Macro &mdash; sovereign borrowing is crowding out against AI capex</strong>: FT Alphaville argues rising government funding needs and the AI investment boom are now competing for the same pool of capital as bond yields hover near multi-decade highs.", src: "https://www.ft.com/content/bf40e0fb-9542-4ddf-9ac3-c216be55a5a6", srcName: "Financial Times", date: "2026-10-08" },
        { html: "<strong>Credit &mdash; London hedge fund Arini fell 16%</strong> on soured credit bets, extending its losses as private-credit and bond-market volatility continues.", src: "https://www.ft.com/content/b52c8acc-7ea5-4bd0-b26a-b9956e19867b", srcName: "Financial Times", date: "2026-10-07" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-10-08",
      time: "16:15 BST",
      lede: "Oil jumped on tanker attacks near the Strait of Hormuz, while repeated US Treasury interventions and the global bond sell-off kept sovereign credibility and UK public finances in focus.",
      bullets: [
        { html: "<strong>Macro &mdash; oil prices jumped</strong> on tanker attacks and slowing flows through the Strait of Hormuz, reviving the energy-shock theme behind this week&rsquo;s inflation and rate worries.", src: "https://www.ft.com/content/ec860f96-5a2b-461a-a897-a957860c3dba", srcName: "Financial Times", date: "2026-10-08" },
        { html: "<strong>Bonds &mdash; big investors are &lsquo;bottom fishing&rsquo; in Eurozone bonds</strong> after the France sell-off, with asset managers saying fears of a blow-up like the Eurozone debt crisis have been overdone.", src: "https://www.ft.com/content/9cf103ed-548e-4b06-baed-71632abca961", srcName: "Financial Times", date: "2026-10-08" },
        { html: "<strong>Macro &mdash; the Iran war has blown a near-&pound;12bn hole</strong> in Britain&rsquo;s public finances, adding to fiscal pressure ahead of the Autumn Budget.", src: "https://www.ft.com/content/2cb13aed-f6bf-4f45-b906-fa1194405a0c", srcName: "Financial Times", date: "2026-10-07" },
        { html: "<strong>Bonds &mdash; what is driving the global bond sell-off?</strong> The FT answers reader questions as French and US long-dated yields stay elevated.", src: "https://www.ft.com/content/d51a78a8-67d8-45bd-b32c-1eafe39a0794", srcName: "Financial Times", date: "2026-10-08" },
        { html: "<strong>Bonds &mdash; repeated US Treasury interventions</strong> risk eroding the credibility of Treasury market backstops, the FT argues, with the 30-year yield at a 24-year high after this week&rsquo;s global sell-off.", src: "https://www.ft.com/content/eec1e15d-78b9-4706-a518-2a9db4f37128", srcName: "Financial Times", date: "2026-10-08" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-10-08",
      time: "22:15 BST",
      lede: "Oil jumped on tanker attacks near the Strait of Hormuz before Trump said the US will not attack Iran before the midterms, while the global bond sell-off kept the US 30-year Treasury yield near a 24-year high.",
      bullets: [
        { html: "<strong>Macro &mdash; Donald Trump said the US &lsquo;will not be attacking Iran&rsquo;</strong> before the midterm elections, after oil prices jumped earlier on tanker attacks and slowing flows through the Strait of Hormuz.", src: "https://www.ft.com/content/e0cc2789-0e71-401d-8096-d58303970a37", srcName: "Financial Times", date: "2026-10-08" },
        { html: "<strong>Bonds &mdash; the US 30-year Treasury yield sits near the 24-year high</strong> set this week, while big investors are &lsquo;bottom fishing&rsquo; in Eurozone bonds after the France sell-off, judging blow-up fears overdone.", src: "https://www.ft.com/content/9cf103ed-548e-4b06-baed-71632abca961", srcName: "Financial Times", date: "2026-10-08" },
        { html: "<strong>Equities &mdash; OpenAI&rsquo;s annualised revenues are $20bn less than previously signalled</strong>, the FT reports, a fresh test for AI valuations as the S&amp;P 500 and Nasdaq trade near records.", src: "https://www.ft.com/content/b66a9858-f8fb-46cb-b506-44bfe26fca2a", srcName: "Financial Times", date: "2026-10-08" },
        { html: "<strong>Credit &mdash; London hedge fund Arini fell 16%</strong> on soured credit bets, extending its losses as private-credit and bond-market volatility continues.", src: "https://www.ft.com/content/b52c8acc-7ea5-4bd0-b26a-b9956e19867b", srcName: "Financial Times", date: "2026-10-07" },
      ],
    },
  },
};
