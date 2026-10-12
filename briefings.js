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
      date: "2026-10-12",
      time: "05:15 BST",
      bullets: [
        { html: "<strong>Macro &mdash; &lsquo;worrying omens&rsquo; lurk over the global economy despite resilient growth</strong>, ahead of Wednesday&rsquo;s US September CPI print.", src: "https://www.ft.com/content/e0457dd5-8e75-4803-8ce8-6651157d2229", srcName: "Financial Times", date: "2026-10-12" },
        { html: "<strong>Bonds &mdash; the US 10-year Treasury yield held near 5.24% ahead of Wednesday&rsquo;s September CPI</strong>, steadying after touching 5.36% on 7 October &mdash; its highest since 2002 &mdash; with the cash market shut Monday for the Columbus Day holiday.", src: "https://tradingeconomics.com/united-states/government-bond-yield/news/516491", srcName: "Trading Economics", date: "2026-10-12" },
        { html: "<strong>Equities &mdash; Wall Street&rsquo;s record-breaking trading streak is set to cool</strong> after the S&amp;P 500&rsquo;s run of record highs.", src: "https://www.ft.com/content/50bb9758-abf7-43a4-bd8b-0c1e5895b4c2", srcName: "Financial Times", date: "2026-10-12" },
        { html: "<strong>Credit &mdash; the huge lurking leverage of AI hyperscalers</strong> is drawing scrutiny as debt-funded data-centre spending builds.", src: "https://www.ft.com/content/17a207f4-1563-48af-91e3-14bac89ab4b8", srcName: "Financial Times", date: "2026-10-12" },
        { html: "<strong>UK &mdash; the IFS warns Chancellor Healey&rsquo;s Budget (28 October) will be &lsquo;fiction&rsquo; without a plan for a &pound;35bn hole in spending</strong>.", src: "https://www.ft.com/content/619800ae-b2f2-46e3-b34e-23f0525637da", srcName: "Financial Times", date: "2026-10-12" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-10-11",
      time: "16:20 BST",
      lede: "Trump claims an energy ceasefire is in place as Ukraine's allies vow to pressure Moscow, Houthi missiles hit Riyadh, and Andy Burnham says Russia interfered in the 2016 Brexit vote.",
      bullets: [
        { html: "<strong>Macro &mdash; will September inflation cement US interest rate policy for the rest of the year?</strong> The FT previews the data and its implications for the Fed.", src: "https://www.ft.com/content/eae9d22f-3722-427f-a33b-aebc58fba2c4", srcName: "Financial Times", date: "2026-10-11" },
        { html: "<strong>Oil &mdash; Houthis showed their military reach with deadly missile strikes on Riyadh</strong>, a Gulf escalation that adds to energy-supply risk alongside the US strike on a tanker in the Gulf of Oman.", src: "https://www.ft.com/content/bd2c7385-184e-425e-997f-0f5a8c54184e", srcName: "Financial Times", date: "2026-10-11" },
        { html: "<strong>Geopolitics &mdash; Ukraine&rsquo;s allies vowed to pressure Moscow</strong> as Trump claimed an &lsquo;energy ceasefire&rsquo; is in place following the Trump-Putin diesel deal.", src: "https://www.ft.com/content/724ef0e2-4d50-49fd-aef8-abc0534f2f84", srcName: "Financial Times", date: "2026-10-11" },
        { html: "<strong>UK politics &mdash; Andy Burnham says Russia &lsquo;interfered&rsquo; in the 2016 Brexit vote</strong>, adding to the debate over the UK&rsquo;s EU relationship.", src: "https://www.ft.com/content/4fcbf57e-c73e-4ced-be4a-5ecc6f4874de", srcName: "Financial Times", date: "2026-10-11" },
        { html: "<strong>UK &mdash; John Healey ruled out cutting the &lsquo;mansion tax&rsquo; threshold to &pound;1.5mn</strong> in the UK Budget.", src: "https://www.ft.com/content/b1ff2ac0-843d-4b2a-b848-c840a2decfb8", srcName: "Financial Times", date: "2026-10-11" },
        { html: "<strong>Credit &mdash; Partners Group launched an evergreen multi-sector private credit income strategy</strong> for institutional and private wealth investors, spanning direct lending, credit secondaries, fund financing and royalties.", src: "https://alternativecreditinvestor.com/2026/10/09/partners-group-launches-private-credit-income-fund/", srcName: "Alternative Credit Investor" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-10-12",
      time: "00:15 BST",
      lede: "Oil chiefs pulled out of a Riyadh energy congress after a missile strike at the airport, the US threatens to block arms for Ukraine over refinery attacks, and the US September inflation print looms for Fed policy.",
      bullets: [
        { html: "<strong>Oil &mdash; oil chiefs pulled out of the Riyadh energy congress</strong> after a missile strike at the airport, following the Houthi strikes on the Saudi capital.", src: "https://www.ft.com/content/a01776ea-4a12-4195-8820-e43a885ba5fe", srcName: "Financial Times", date: "2026-10-11" },
        { html: "<strong>Geopolitics &mdash; the US threatened to block arms for Ukraine</strong> over its attacks on Russian refineries, even as Trump claimed an &lsquo;energy ceasefire&rsquo; is in place.", src: "https://www.ft.com/content/68fd8c4f-6f34-4f6e-a52c-76f635164031", srcName: "Financial Times", date: "2026-10-11" },
        { html: "<strong>Macro &mdash; will September inflation cement US interest rate policy for the rest of the year?</strong> The FT previews the data and its implications for the Fed.", src: "https://www.ft.com/content/eae9d22f-3722-427f-a33b-aebc58fba2c4", srcName: "Financial Times", date: "2026-10-11" },
        { html: "<strong>UK &mdash; John Healey ruled out cutting the &lsquo;mansion tax&rsquo; threshold to &pound;1.5mn</strong> in the UK Budget.", src: "https://www.ft.com/content/b1ff2ac0-843d-4b2a-b848-c840a2decfb8", srcName: "Financial Times", date: "2026-10-11" },
      ],
    },
  },
};
