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
      date: "2026-09-23",
      time: "10:16 BST",
      lede: "This morning's flash PMIs split the Atlantic story wide open &mdash; a sharp UK growth wobble undercuts the City's freshly-hardened case for a November BoE hike even as the US reading points to only a gentle, still-solid cooling, with oil's retreat on Iran-diplomacy hopes the one thing both sides of the pond share.",
      bullets: [
        { html: "<strong>Macro &mdash; the UK flash Composite PMI slumped to a four-month low of 51.0 in September (from 53.5, vs. 52.7 expected)</strong>, with services down to 51.9 and manufacturing to 46.2; S&amp;P Global's Chris Williamson cited &lsquo;weakening growth, slumping overseas trade, worsening business confidence and further steep job losses&rsquo;.", src: "https://www.fxstreet.com/news/when-is-the-uk-services-pmi-and-how-could-it-affect-gbp-usd-202509230600", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; the US flash Composite PMI eased to 53.6 (from 54.6), with manufacturing at 52 and services at 53.9</strong>, a second straight monthly cooling that Williamson said still rounds off the best quarter so far this year, consistent with roughly 2.2% annualised Q3 growth.", src: "https://www.fxstreet.com/news/sp-global-pmi-expected-to-highlight-us-economic-resilience-in-september-202509230800", srcName: "FXStreet" },
        { html: "<strong>Equities &mdash; the Nasdaq Composite closed at a fresh record 27,244.28 Tuesday, up 0.45%, while the Dow and S&amp;P 500 slipped</strong>, with US futures holding a muted, mixed range through the morning as investors digested the split flash-PMI verdict.", src: "https://www.fxstreet.com/news/dow-jones-futures-stay-muted-due-to-market-caution-ahead-of-us-pmi-data-202509230846", srcName: "FXStreet" },
        { html: "<strong>Fixed income &mdash; short-dated gilts firmed on the weak UK PMI print while sterling stayed pinned near six-week lows against the dollar</strong>, as Brent eased toward $98/bbl on hopes President Trump's &lsquo;very good&rsquo; three-hour meeting with Iranian officials points to a Strait of Hormuz de-escalation.", src: "https://www.cnbc.com/2026/09/23/iran-us-talks-crude-oil-un-wti.html", srcName: "CNBC" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-23",
      time: "16:20 BST",
      lede: "The morning's calm has broken &mdash; a hot flash-PMI read and a hawkish Fed governor have put the 10-year Treasury back above its post-2007 high just as Xi Jinping touches down in Washington, dragging risk appetite and sterling down together.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed Governor Michael Barr said further rate hikes will likely be needed for a timely return to 2% inflation</strong>, telling a Chicago Fed conference that 'risks to achieving our inflation target have increased, while risks to the labor market have receded' and calling last week's hike 'important action' against a policy stance that had been 'out of position'.", src: "https://www.fxstreet.com/news/feds-barr-further-rate-hikes-needed-for-timely-return-to-2-inflation-202609231443", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; a second read on Wednesday's UK flash PMI showed services prices rising at their fastest pace in four months even as growth cooled</strong>, a combination Pantheon Macroeconomics called 'hawkish for the MPC' and said 'keeps a November rate hike on track', even with the headline composite at a four-month low.", src: "https://www.investing.com/news/economic-indicators/uk-business-activity-cools-as-inflation-pressure-ramps-up-pmi-shows-4912300", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Equities &mdash; US stocks opened lower (Dow -0.2%, S&amp;P 500 -0.6%, Nasdaq -1%) as the yield surge combined with a fresh wave of AI-disruption worries hitting financial, travel and insurance names</strong> (Charles Schwab, JPMorgan, Booking Holdings), even after Tuesday's chip-led record Nasdaq close, with Trump-Xi summit headlines the next catalyst.", src: "https://finance.yahoo.com/markets/live/stock-market-today-wednesday-september-23-dow-sp-500-nasdaq-080556640.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield jumped to 5.058%, its highest since July 2007, and the 2-year rose nearly 10bp to 4.874%</strong>, while the UK 10-year gilt yield ticked up to around 5.23% and GBP/USD fell a further 0.41% to $1.3288 on broad dollar strength.", src: "https://www.exchangerates.org.uk/news/47257/2026-09-23-pound-sterling-today-pmi-slowdown-leaves-november-boe-hike-in-play.html", srcName: "Exchange Rates UK" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-23",
      time: "18:22 BST",
      lede: "A hawkish Fed and a hot run of data are doing the market's tightening for it &mdash; long yields broke out to a multi-decade high, equities and sterling both gave ground, and a wobbling UK flash PMI leaves the Bank of England's own path more contested heading into next month's Budget.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed Governor Michael Barr said further rate hikes will likely be needed for a timely return to 2% inflation</strong>, doubling down on the Fed's hawkish tilt barely a week after its latest hike.", src: "https://www.fxstreet.com/news/feds-barr-further-rate-hikes-needed-for-timely-return-to-2-inflation-202609231443", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; the UK's flash Composite PMI slumped to a four-month low of 51.0 in September</strong>, with services down to 51.9 and manufacturing to 46.2, complicating the case for a November BoE hike even as sterling extended its slide to $1.3288.", src: "https://www.exchangerates.org.uk/news/47257/2026-09-23-pound-sterling-today-pmi-slowdown-leaves-november-boe-hike-in-play.html", srcName: "Exchange Rates UK" },
        { html: "<strong>Equities &mdash; the S&amp;P 500 and Nasdaq both slipped at Wednesday's open</strong> as the yield-driven selloff was compounded by fresh AI-disruption worries hitting Charles Schwab, JPMorgan and Booking Holdings, even after Tuesday's fresh Nasdaq record close.", src: "https://finance.yahoo.com/markets/live/stock-market-today-wednesday-september-23-dow-sp-500-nasdaq-080556640.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield jumped to 5.058%, its highest since July 2007,</strong> and the 2-year rose nearly 10bp to 4.874% as hot flash PMI data and Barr's remarks reinforced bets on further tightening ahead of Thursday's Trump-Xi summit.", src: "https://www.fxstreet.com/news/feds-barr-further-rate-hikes-needed-for-timely-return-to-2-inflation-202609231443", srcName: "FXStreet" },
      ],
    },
  },
};
