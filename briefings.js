// =============================================================================
// briefings.js — the tri-daily AI market briefings (Morning · Afternoon ·
// Evening) surfaced by the header "Briefing" button (v2/js/nav-actions.js).
//
// GENERATION (see docs/refresh-routines.md): these are written by the 5×/day
// refresh routine, NOT at runtime. Each run regenerates whichever slot the clock
// is in (morning < 12:00 · afternoon 12:00–17:00 · evening ≥ 17:00 BST), so the
// current slot is always freshest and every slot is refreshed at least once a day.
//
// DESK FOCUS: the briefings cover the three MARKET desks — Macro, Equities and
// Fixed income — and ONLY those (no Credit or Legal; those have their own
// surfaces). Every slot touches all three, and each bullet's <strong> lead is
// tagged with its desk. The first four bullets are the ones the panel renders
// (BRIEF_MAX_BULLETS — one iPhone screen), so they carry the three-desk spread.
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
// bump (HOUSE_STYLE T1); the lede is clamped to three lines, so lead with the arc.
// =============================================================================
export const BRIEFINGS = {
  tz: "BST",
  // Ordered for the slot chips; the view picks the current slot by clock.
  order: ["morning", "afternoon", "evening"],
  slots: {
    morning: {
      label: "Morning",
      date: "2026-09-13",
      time: "05:15 BST",
      lede: "Markets head into a decisive central-bank week &mdash; the Fed on Wednesday, the BoE on Thursday &mdash; with Wall Street having clawed back most of last week's losses on in-line August CPI, Treasury yields pinned near a three-year high on ~90% odds of a Fed hike, and UK gilts still close to 19-year highs into the Budget.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed-hike odds hold near a cycle-high ~90% into Wednesday's FOMC</strong>: interest-rate futures imply roughly a 90% probability of a quarter-point hike at the 16 September meeting after last Friday's hotter-than-forecast core CPI, which would be the Fed's first hike since 2023 under Chair Kevin Warsh.", src: "https://www.cnbc.com/2026/09/11/stock-market-next-week-outlook-for-sept-14-18-2026.html", srcName: "CNBC" },
        { html: "<strong>Equities &mdash; Wall Street enters the week having snapped its four-session losing streak</strong>: the Dow rose 1.15% to 53,414.25, the S&amp;P 500 gained 0.96% to 7,718.60 and the Nasdaq added 0.88% to 26,506.99 on Friday, clawing back most of the week's losses as oil eased and the CPI headline landed close to forecasts even with a hot core print.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-11-2026", srcName: "TheStreet" },
        { html: "<strong>Fixed income &mdash; Treasuries sit near a three-year high as traders price two hikes by year-end</strong>: the 10-year yield held close to 4.97% &mdash; its highest since 2023 &mdash; after Friday's CPI surprise, with bond traders moving to price a second quarter-point Fed move on top of Wednesday's expected hike.", src: "https://www.bloomberg.com/news/articles/2026-09-11/treasuries-fall-as-higher-than-expected-cpi-boosts-fed-hike-odds", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; BoE expected to hold on Thursday even as markets price hikes ahead</strong>: a Reuters poll of economists expects the Bank of England to leave Bank Rate at 3.75% on 17 September and show patience with war-driven inflation, even as market pricing leans toward further hikes into 2027.", src: "https://www.investing.com/news/economy-news/bank-of-england-to-hold-rates-show-patience-with-wardriven-inflation-reuters-poll-4891672", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Fixed income &mdash; UK gilts still pinned near 19-year highs into the Budget arithmetic</strong>: the 10-year gilt yield remains close to its recent peak after striking the highest level since 2007 last week, keeping pressure on Chancellor Healey's shrinking fiscal headroom ahead of the 28 October Budget.", src: "https://www.globalbankingandfinance.com/uk-10-year-gilt-yield-hits-new-19-year-high/", srcName: "Reuters (via Global Banking & Finance)" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-12",
      time: "12:11 BST",
      lede: "A four-way central-bank week &mdash; Fed and Bank of Canada Wednesday, Norges Bank and the BoE Thursday, the BoJ Friday &mdash; opens after Wall Street snapped a four-session losing streak on in-line inflation data, with Treasury yields still pinned near a three-year high and oil holding just below $100 despite a fresh IEA supply-outlook cut.",
      bullets: [
        { html: "<strong>Equities &mdash; Wall Street snaps its four-session losing streak</strong>: the Dow rose 0.98%, the S&amp;P 500 gained 0.86% and the Nasdaq added 0.96% on Friday as August inflation came in broadly in line and oil retreated, even as the 10-year Treasury yield held near 4.97% &mdash; its highest since 2023 &mdash; into next week's FOMC decision.", src: "https://www.riotimesonline.com/global-economy-briefing-september-12-2026/", srcName: "The Rio Times" },
        { html: "<strong>Fixed income &mdash; Treasury yields hold near a three-year high as traders price two Fed hikes</strong>: the 10-year sits close to 4.97% after Friday's hotter-than-forecast core CPI, with bond traders moving to price a second quarter-point Fed move on top of next Wednesday's expected hike.", src: "https://www.bloomberg.com/news/articles/2026-09-11/treasuries-fall-as-higher-than-expected-cpi-boosts-fed-hike-odds", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; a four-way central-bank week opens Wednesday</strong>: the Fed and Bank of Canada decide Wednesday, Norway's Norges Bank and the Bank of England follow Thursday and the Bank of Japan closes out the week Friday, with Friday's in-line US CPI print the last major test before the Fed's move.", src: "https://www.fxstreet.com/analysis/week-ahead-feds-boes-bojs-and-bocs-interest-rate-decisions-on-the-horizon-202509121051", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; oil steadies near $100 as the IEA cuts its 2026 supply outlook</strong>: Brent and WTI eased Friday as traders locked in profits after a sharp Middle East-driven weekly gain, even as the IEA trimmed its 2026 global oil-supply outlook by a further 1.4 million barrels a day and said normal Gulf flows are unlikely to return this year.", src: "https://www.riotimesonline.com/oil-markets-latam-saturday-september-12-2026/", srcName: "The Rio Times" },
        { html: "<strong>Fixed income &mdash; gold slips to $4,348/oz as yields and the dollar firm</strong>: bullion still gained 0.77% on the day, recovering part of Thursday's slide, as in-line August inflation left Treasury yields steady just below their cycle high.", src: "https://www.riotimesonline.com/gold-silver-precious-metals-saturday-september-12-2026/", srcName: "The Rio Times" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-12",
      time: "21:21 BST",
      lede: "Wall Street closed out a bruising week on a high note as an in-line headline August CPI print eased fears of a hotter surprise, even as the stickier-than-forecast 0.3% core reading pushed Fed-hike odds for Wednesday's FOMC to a cycle-high ~90% and left Treasury and gilt yields pinned near multi-decade highs.",
      bullets: [
        { html: "<strong>Equities &mdash; Wall Street snaps a four-session losing streak</strong>: the Dow rose 509.19 points (0.98%) to 52,573.29, the S&amp;P 500 gained 0.86% to 7,656.98 and the Nasdaq added 0.96% to 26,333.04 Friday, clawing back most of the week's losses as oil eased and August CPI landed close to forecasts.", src: "https://abcnews.com/Business/wireStory/major-us-stock-indexes-fared-friday-9112026-136375931", srcName: "Associated Press (via ABC News)" },
        { html: "<strong>Macro &mdash; hot core CPI keeps Fed-hike odds at a cycle-high ~90% into Wednesday's FOMC</strong>: headline CPI rose 0.4% m/m as expected while core CPI's 0.3% gain topped the 0.2% consensus, reinforcing the case for the Fed's first hike since 2023 at next week's meeting.", src: "https://www.cbsnews.com/news/august-cpi-report-inflation-fed-rates/", srcName: "CBS News" },
        { html: "<strong>Fixed income &mdash; Treasuries hold near cycle highs as traders price two hikes by year-end</strong>: the 10-year yield sat close to its highest level since 2007 after Friday's CPI surprise, with bond traders moving to price a second quarter-point Fed move on top of Wednesday's expected hike.", src: "https://www.bloomberg.com/news/articles/2026-09-11/treasuries-fall-as-higher-than-expected-cpi-boosts-fed-hike-odds", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; US consumer sentiment slides on record gas prices, trade tensions</strong>: the University of Michigan's preliminary September index fell to 47.8 from 51.7 &mdash; below every estimate in a Bloomberg survey &mdash; as record September pump prices and renewed trade friction weighed, with year-ahead inflation expectations rising to 4.6%.", src: "https://finance.yahoo.com/economy/articles/us-consumer-sentiment-slides-higher-140000478.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; UK gilt yields ease slightly but stay near 19-year highs</strong>: the 10-year gilt yield edged down toward 5.35% as the energy-price rally paused ahead of the CPI release, with the 30-year still hovering near 6% &mdash; a level last seen in 1998 &mdash; even after Friday's stronger-than-expected 0.4% UK July GDP print.", src: "https://www.fx.co/en/forex-news/3158765", srcName: "FX.co (via InstaForex)" },
      ],
    },
  },
};
