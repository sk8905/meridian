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
      date: "2026-09-12",
      time: "08:26 BST",
      lede: "A four-way central-bank week opens with Wall Street closing Friday on a high despite a hotter-than-forecast core CPI print, Goldman Sachs and Capital Economics both flipping to a Fed-hike call, and gilts still pinned near multi-decade highs into the Budget.",
      bullets: [
        { html: "<strong>Equities &mdash; Dow, S&amp;P 500 and Nasdaq end the losing week on a high note</strong>: the Dow rose 1.15% to 53,414.25, the S&amp;P 500 gained 0.96% to 7,718.60 and the Nasdaq added 0.88% to 26,506.99 on Friday, with falling oil prices offsetting a hot core CPI print and the resulting jump in Fed-hike bets.", src: "https://finance.yahoo.com/markets/live/stock-market-today-friday-september-11-dow-sp-500-nasdaq-cpi-inflation-082201751.html", srcName: "Yahoo Finance" },
        { html: "<strong>Macro &mdash; Goldman Sachs and Capital Economics both flip to expecting a Fed hike next week</strong>: Goldman's David Mericle and Capital Economics' Stephen Brown independently concluded a September hike is now all but guaranteed after Friday's hotter-than-forecast core CPI, narrowing the gap with JPMorgan's earlier hike call.", src: "https://www.cbsnews.com/news/fed-rate-hike-september-likelihood-cpi/", srcName: "CBS News" },
        { html: "<strong>Fixed income &mdash; Treasuries sell off as traders price two hikes by year-end</strong>: the 10-year yield held near its highest level since 2007 after Friday's CPI surprise, with bond traders moving to price a second quarter-point Fed move on top of Wednesday's expected hike.", src: "https://www.bloomberg.com/news/articles/2026-09-11/treasuries-fall-as-higher-than-expected-cpi-boosts-fed-hike-odds", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; a four-way central-bank week: Fed, BoE, BoJ and BoC all decide on rates</strong>: the week ahead brings the Fed's Wednesday decision, the BoE's Thursday MPC, plus the BoJ and BoC, all landing against the backdrop of Friday's hot US CPI and a University of Michigan consumer-sentiment reading that slid on higher gas prices and trade tensions.", src: "https://www.fxstreet.com/analysis/week-ahead-feds-boes-bojs-and-bocs-interest-rate-decisions-on-the-horizon-202509121051", srcName: "FXStreet" },
        { html: "<strong>Fixed income &mdash; UK gilts still pinned near 19-year highs into the Budget arithmetic</strong>: the 10-year gilt yield remains close to its recent peak after hitting the highest level since 2007 this week, keeping pressure on Chancellor Healey's shrinking fiscal headroom ahead of the 28 October Budget even as a Reuters poll expects the BoE to hold on 17 September.", src: "https://www.globalbankingandfinance.com/uk-10-year-gilt-yield-hits-new-19-year-high/", srcName: "Reuters (via Global Banking & Finance)" },
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
