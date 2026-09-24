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
// DESK FOCUS: the briefings cover the three MARKET desks — Macro, Equities and
// Fixed income — and ONLY those (no Credit or Legal; those have their own
// surfaces). Every slot touches all three, and each bullet's <strong> lead is
// tagged with its desk. The first four bullets are the ones the Home card renders
// (HB_MAX_BULLETS — one iPhone screen), so they carry the three-desk spread.
// ONE CONTINUOUS ITEM PER DESK: the card groups bullets by their desk lead, and a
// desk that carries two stories (e.g. two Macro items) is ALWAYS combined into a
// SINGLE continuous item — one "Macro" kicker, the two stories folded into one
// flowing run of prose, and both sources on one trailing line — never stacked as
// separate sub-bullets and never a repeated kicker. Author each item with its own
// desk lead and source as usual; the render strips the follow-on's kicker,
// re-capitalises its lead and folds it in, so each story should stand as its own
// self-contained sentence that reads cleanly when run on after the one before it.
// Equities & Fixed income bullets LEAD WITH THE MOVE AND ITS DRIVER — the index
// or yield change, then the specific catalyst behind it (a stock, a data print,
// an issuance event) — not a standing description.
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
      date: "2026-09-24",
      time: "10:26 BST",
      lede: "Trump and Xi are sitting down at the White House this morning with the trade-truce extension already banked, but the summit is proving a sideshow to a bond market still pinned at 2007-era highs, where a second hawkish Fed voice this week has joined the chorus flagging hotter inflation ahead.",
      bullets: [
        { html: "<strong>Macro &mdash; Donald Trump and Xi Jinping began their White House summit Thursday</strong>, with trade, tariffs, Taiwan and AI atop the agenda after Treasury Secretary Scott Bessent's confirmation that the two sides extended their trade truce to January 10th.", src: "https://www.nbcnews.com/world/asia/trump-xi-summit-meet-white-house-tensions-taiwan-trade-ai-rcna598073", srcName: "NBC News" },
        { html: "<strong>Macro &mdash; Boston Fed President Susan Collins warned inflation could run &lsquo;notably&rsquo; higher even as she backed this month's rate hike</strong>, adding a second hawkish voice this week alongside Governor Barr and Richmond's Barkin, who separately said inflation pressures may take time to pass.", src: "https://www.cnbc.com/2026/09/23/federal-reserve-inflation-interest-rates-ecb.html", srcName: "CNBC" },
        { html: "<strong>Equities &mdash; Wall Street closed broadly lower Wednesday, the S&amp;P 500 down 0.75% to 7,706.03, the Dow off 352 points (-0.68%) to 51,511.59 and the Nasdaq down 1.13% to 26,936.04</strong>, with only energy shares higher on the index as the yield spike and fresh AI-disruption worries weighed ahead of the Trump-Xi summit.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-23-2026", srcName: "TheStreet" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield held at 5.13%, its highest since July 2007, while GBP/USD hovered near $1.3240 &mdash; still close to a six-week low</strong> as the widening Fed-BoE policy divergence kept sterling capped heading into the summit.", src: "https://www.vantagemarkets.com/market-news/us-10-year-treasury-yield-2007-high-september-24-2026/", srcName: "Vantage Markets" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-24",
      time: "16:16 BST",
      lede: "The bond sell-off that has dogged this week broke through fresh milestones Thursday afternoon &mdash; the 30-year Treasury yield at its highest since 2004 and ECB hawk Isabel Schnabel's early departure to the IMF adding a fresh policy-uncertainty jolt &mdash; and equities gave ground even as Trump and Xi's trade truce extension held.",
      bullets: [
        { html: "<strong>Macro &mdash; Isabel Schnabel is to leave the ECB's executive board early to take up a senior role at the IMF</strong>, removing one of the central bank's most influential hawkish voices from the Governing Council at a delicate point in the global rate cycle.", src: "https://www.ft.com/content/2bf6bba0-a361-474b-b5d6-6461695ecc4a", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; Donald Trump and Xi Jinping confirmed their trade truce, previously due to expire 10 November, has been extended to 10 January</strong> as Xi's three-day Washington state visit got under way, with a wider deal on tariffs, Taiwan and rare earths still being negotiated.", src: "https://www.cnbc.com/2026/09/24/us-china-trade-truce-bessent-trump-xi.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; US long-term borrowing costs pushed to their highest level since 2004 Thursday</strong>, with the 30-year Treasury yield extending this week's broad-based rise as hawkish Fed commentary and elevated energy prices kept the whole curve outside the two-year above 5%.", src: "https://www.ft.com/content/2d87f8bf-d529-4997-90c5-393ef65d280c", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 fell 0.46% to 7,670.73, the Dow dropped 0.65% to 51,178.50 and the Nasdaq slid 0.73% to 26,738.40 in Thursday trading</strong>, as inflation fears and rising bond yields outweighed hopes for Middle East diplomacy.", src: "https://finance.yahoo.com/markets/live/stock-market-today-thursday-september-24-dow-sp-500-nasdaq-080352893.html", srcName: "Yahoo Finance" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-23",
      time: "22:29 BST",
      lede: "Wednesday closed the way its afternoon threatened &mdash; a scorching flash PMI and hawkish Fed signalling pushed every Treasury maturity but the two-year above 5% for the first time since 2007, dragging stocks into a broad-based decline hours before Thursday's Trump-Xi summit.",
      bullets: [
        { html: "<strong>Macro &mdash; the flash September S&amp;P Global Composite PMI jumped to 58.4 (from 56.0), a 62-month high</strong>, with manufacturing at 57.0 and services at 58.7 comfortably beating consensus; S&amp;P Global's Chris Williamson said &lsquo;US business continues to boom, with output growing at the fastest rate for over five years in September&rsquo;.", src: "https://www.fxstreet.com/news/sp-global-pmis-expected-to-show-resilient-us-economic-growth-in-september-202609230845", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; Fed Governor Michael Barr said further rate hikes will likely be needed for a timely return to 2% inflation</strong>, and CME FedWatch-implied odds of a 28 October hike surged to roughly 71&ndash;73% (from ~53% before the data).", src: "https://www.fxstreet.com/news/feds-barr-further-rate-hikes-needed-for-timely-return-to-2-inflation-202609231443", srcName: "FXStreet" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 closed down 0.75% at 7,706.03, the Dow fell 352 points (-0.68%) to 51,511.59 and the Nasdaq slid 1.13% to 26,936.04</strong>, with only energy shares higher on the S&amp;P 500 as the yield spike and fresh AI-disruption worries weighed broadly ahead of Thursday's summit.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-23-2026", srcName: "TheStreet" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield closed at 5.135%, its highest since July 2007, while the 5-year crossed 5% for the first time since 2007 and the 30-year touched 5.37%</strong>, after a weak 5-year note auction drew the lowest demand since 2018.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-23-2026", srcName: "TheStreet" },
      ],
    },
  },
};
