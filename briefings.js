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
// short briefing, never padding. Both the `lede` and each bullet `html` are
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
        { html: "<strong>Macro &mdash; the energy shock has proved more manageable than feared</strong>: with Hormuz shut since February, about 11% of world oil supply is offline and Brent spiked near $120, yet analysts now see it averaging about $89 a barrel this year.", src: "https://www.ft.com/content/37e12a42-d473-4b1b-8fc5-4ea5f06d3bfb", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; India raised its repo rate 25bp to 5.50%</strong>, its first hike since February 2023, as a weak rupee and Middle East-driven imported inflation push the central bank to &lsquo;calibrated tightening&rsquo;.", src: "https://www.ft.com/content/713ccee6-855f-48d8-acf1-161265041ad8", srcName: "Financial Times" },
        { html: "<strong>Bonds &mdash; the US 10-year Treasury yield eased to 5.27%</strong> after touching 5.35% on Monday, its highest since 2002, while French spreads narrowed after Marine Le Pen vowed to cut the deficit.", src: "https://www.bloomberg.com/opinion/newsletters/2026-10-07/sesame-street-has-two-letters-for-the-record-us-stock-rally", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 rose 0.66% to a fresh record</strong>, its first all-time high since August, led by the AI mega-caps, with third-quarter earnings now forecast up 29.5% year on year.", src: "https://www.ft.com/content/7c38e8e3-8035-4036-8bc0-5fba2fbf77cb", srcName: "Financial Times" },
        { html: "<strong>Credit &mdash; Blue Owl ($319bn AUM) is pushing into insurance capital</strong>: CEO Marc Ostrover wants a bigger insurance balance sheet to fund bespoke private-credit deals, backing insurers rather than buying one outright.", src: "https://www.ft.com/content/47c82e53-aa63-4b0d-95fd-ecc04d81e6ab", srcName: "Financial Times" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-10-06",
      time: "16:15 BST",
      bullets: [
        { html: "<strong>Macro &mdash; Chancellor Healey warns banks the UK faces a &lsquo;challenging&rsquo; fiscal picture</strong> but stays tight-lipped on tax ahead of the Budget; Vitol&rsquo;s chief separately warns of a tanker shortage and the risk of $200-a-barrel oil.", src: "https://www.ft.com/content/3cd5097b-b5ca-4b9f-83fd-f008bb2b72d3", srcName: "Financial Times" },
        { html: "<strong>Bonds &mdash; the global government-bond sell-off is the day&rsquo;s dominant theme</strong>, with a pre-election debt sell-off in France that many fear could shake the eurozone keeping the US 10-year yield near 5.3%.", src: "https://www.ft.com/content/a6161dfd-bfb9-4bf5-866f-1ca0a0c8e6aa", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 hit a record high, up about 0.6% to around 7,820,</strong> as AI-linked stocks shrugged off the bond-market slump.", src: "https://www.ft.com/content/1c1ee003-f041-4c66-a971-f08d488d11f7", srcName: "Financial Times" },
        { html: "<strong>Credit &mdash; debt is in the spotlight as Paramount closes its $111bn deal for Warner Bros</strong>; separately McKesson and CD&amp;R strike a $5.8bn deal to buy an infusion services provider.", src: "https://www.ft.com/content/93756433-eb78-422d-8ac3-30e8cc243a00", srcName: "Financial Times" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-10-07",
      time: "00:12 BST",
      bullets: [
        { html: "<strong>Macro &mdash; Spain&rsquo;s Pedro S&aacute;nchez is gambling on a snap election</strong>, while in France Marine Le Pen pledged to rein in public spending as euro-area political risk keeps markets on edge.", src: "https://www.ft.com/content/a7a19bb1-a1ba-4317-a191-c387bbc9f4b9", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; Donald Trump said he is considering suspending the federal petrol tax</strong> as energy costs stay elevated.", src: "https://www.ft.com/content/3fd43fc5-4973-4a26-9d9c-47b6361e6217", srcName: "Financial Times" },
        { html: "<strong>Bonds &mdash; the global government-bond sell-off remains the dominant theme</strong>, with the US 10-year Treasury yield at 5.27% and France caught between the bond market and the barricades ahead of its elections, after the euro fell to a 17-month low against the dollar on Monday.", src: "https://www.ft.com/content/9b252b46-a87c-45e7-a09a-45a39ce077b8", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 hit a record high, up 0.6% to around 7,820,</strong> as AI-linked stocks shrugged off the bond-market slump.", src: "https://www.ft.com/content/1c1ee003-f041-4c66-a971-f08d488d11f7", srcName: "Financial Times" },
        { html: "<strong>Credit &mdash; Arini raised $1.5 billion for its credit trading strategy</strong>, reopening it to new cash after two years even as its main hedge fund extended losses to a 13.5% decline.", src: "https://www.bloomberg.com/news/articles/2026-10-05/arini-raises-1-5-billion-even-as-its-main-fund-sees-13-5-loss", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Ion has told creditors it will not play hardball over its $11bn debt pile</strong>.", src: "https://www.ft.com/content/fba91434-70d3-40e6-adb1-8d0c5d6f4fe6", srcName: "Financial Times" },
      ],
    },
  },
};
