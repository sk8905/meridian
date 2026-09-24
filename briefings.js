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
      time: "08:15 BST",
      lede: "Xi Jinping's state visit is under way in Washington with the trade truce formally extended to January 10th, but that relief is doing little to calm bond markets, where October-hike odds near three-quarters keep Treasury yields pinned at their highest since 2007 and sterling near six-week lows.",
      bullets: [
        { html: "<strong>Macro &mdash; Treasury Secretary Scott Bessent confirmed the US-China trade truce has been extended by two months to January 10th as Xi Jinping began his state visit at Joint Base Andrews</strong>, with tariffs, rare-earth exports, Taiwan and Iran atop Thursday's summit agenda alongside a new AI-mishap notification system the two sides agreed to establish.", src: "https://www.cnbc.com/2026/09/24/us-china-trade-truce-bessent-trump-xi.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; a global bond sell-off spread further overnight, with markets now pricing roughly a 70% chance of an October Fed hike</strong> as investors weighed rising prices, volatile oil above $100 a barrel and Wednesday's blowout flash PMI (Composite 58.4, a 62-month high).", src: "https://www.ft.com/content/2d87f8bf-d529-4997-90c5-393ef65d280c", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; Wall Street closed broadly lower Wednesday, the S&amp;P 500 down 0.75% to 7,706.03, the Dow off 352 points (-0.68%) to 51,511.59 and the Nasdaq down 1.13% to 26,936.04</strong>, with only energy shares higher on the index as the yield spike and fresh AI-disruption worries weighed ahead of the Trump-Xi summit.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-23-2026", srcName: "TheStreet" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield remained pinned near 5.13&ndash;5.14%, its highest since July 2007, while GBP/USD held only modest gains near $1.3240 &mdash; still close to a six-week low</strong> as the Fed-BoE policy divergence and a stronger US PMI kept sterling on the back foot into the Trump-Xi summit.", src: "https://www.fxstreet.com/news/british-pound-holds-gains-despite-stronger-us-pmi-hawkish-fed-stance-202609240539", srcName: "FXStreet" },
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
