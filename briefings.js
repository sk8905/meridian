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
      date: "2026-09-25",
      time: "10:18 BST",
      lede: "Friday's Hormuz de-escalation signal held into mid-morning as the dollar consolidated its weekly gains, but sterling kept underperforming on doubts over the Bank of England's tightening follow-through, leaving the gilt-market repo strain flagged earlier in the week unresolved.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran's foreign minister offered to reopen the Strait of Hormuz within seven days if Washington lifts its naval blockade, unfreezes Iranian assets and restores oil-sanctions waivers</strong>, the clearest de-escalation signal yet after nearly seven months of conflict, floated on the sidelines of the UN General Assembly.", src: "https://investinglive.com/news/investinglive-asia-pacific-market-news-iran-offers-seven-day-hormuz-dea/", srcName: "investingLive" },
        { html: "<strong>Macro &mdash; sterling underperformed its major peers into Friday on doubts the Bank of England can follow through on further tightening</strong>, even as UK banks kept tapping billions of pounds in BoE repo-facility cash to profit on bond trades, a sign the gilt-market plumbing strain flagged earlier in the week has not eased.", src: "https://www.fxstreet.com/news/british-pound-underperforms-this-week-as-experts-doubt-boe-tightening-prospects-202609250806", srcName: "FXStreet" },
        { html: "<strong>Equities &mdash; Japan's Nikkei and Topix each rose around 1.2% in early Friday trade on chip-stock strength and dividend buying</strong>, even as Hong Kong's Hang Seng had closed 0.29% lower Thursday, with the region weighing the still-unresolved Hormuz standoff against a firmer global-yield backdrop.", src: "https://investinglive.com/news/investinglive-asia-pacific-market-news-iran-offers-seven-day-hormuz-dea/", srcName: "investingLive" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield held near 5.19% Friday morning as the dollar consolidated its weekly gains ahead of mid-tier US data</strong>, while the UK 2-year gilt yield stayed near 4.77% following this week's Fed and BoE moves.", src: "https://www.fxstreet.com/news/forex-today-us-dollar-consolidates-weekly-gains-ahead-of-mid-tier-data-202609250732", srcName: "FXStreet" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-25",
      time: "12:27 BST",
      lede: "Friday's Washington set-piece landed light on substance and the bond market has not been won over &mdash; Iran's Hormuz overture is doing more to calm nerves at midday than the Trump-Xi summit did, even as UK sentiment data quietly ticked up into the weekend.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran's offer to reopen the Strait of Hormuz within seven days is sitting against a Treasury sell-off that has kept deepening through the week</strong>, with the seven-month standoff's clearest de-escalation signal yet only partly easing the pressure that has driven yields broadly higher.", src: "https://investinglive.com/news/investinglive-asia-pacific-market-news-iran-offers-seven-day-hormuz-dea/", srcName: "investingLive" },
        { html: "<strong>Macro &mdash; Donald Trump and Xi Jinping's Washington summit went &lsquo;big on pomp but small on substance&rsquo;</strong>, Bloomberg reports, with the trade truce extension the only concrete outcome from Xi's first state visit to the US in over a decade &mdash; even as UK consumer confidence rose to a more than two-year high in September on GfK's measure.", src: "https://www.bloomberg.com/news/articles/2026-09-25/trump-xi-summit-goes-big-on-pomp-but-small-on-substance", srcName: "Bloomberg" },
        { html: "<strong>Equities &mdash; European cash markets are trading on the back foot into the weekend after the FTSE 100 closed 0.2% lower Thursday</strong>, pressured by rising government-bond yields and firmer crude, even as Asian peers extended a Friday-morning bounce led by chip stocks.", src: "https://www.fxstreet.com/news/forex-today-us-dollar-consolidates-weekly-gains-ahead-of-mid-tier-data-202609250732", srcName: "FXStreet" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield eased a basis point to around 5.19% Friday morning, clawing back only a sliver of the more than 20 basis points it added over the prior two sessions</strong>, while the UK 2-year gilt held near 4.77% with sterling still underperforming on doubts over the BoE's tightening follow-through.", src: "https://www.bloomberg.com/news/newsletters/2026-09-25/oil-prices-decline-on-hopes-of-a-hormuz-deal", srcName: "Bloomberg" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-24",
      time: "22:12 BST",
      lede: "By the closing bell, Thursday's bond-yield scare had faded into a mixed, calmer finish on Wall Street &mdash; hopes of a phased Hormuz reopening let stocks claw back most of an early bond-driven slide &mdash; even as a hawkish Bank of England afternoon chorus kept UK borrowing costs pinned at their highest since the late 1990s.",
      bullets: [
        { html: "<strong>Macro &mdash; Bank of England Deputy Governors Clare Lombardelli and Sarah Breeden both hardened their tone in separate speeches Thursday</strong>, with Breeden warning &lsquo;the more sparks we're throwing in the tinderbox, the more likely we might have to turn the hose on it&rsquo;, pushing market-implied odds of a 5 November BoE hike to roughly 75&ndash;81% from about 60% on Wednesday.", src: "https://www.investing.com/news/economy-news/bank-of-england-rate-setters-warn-of-sparks-in-the-tinderbox-4915841", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Macro &mdash; New York Fed President John Williams said it is &lsquo;reasonable&rsquo; to expect another rate hike by year-end</strong>, adding a fresh voice to the hawkish chorus that has built through the week alongside Governor Barr and Boston's Collins, even as US and Iranian negotiators explored a phased reopening of the Strait of Hormuz on the sidelines of the UN General Assembly.", src: "https://www.cnbc.com/2026/09/24/feds-williams-another-rate-hike-by-year-end.html", srcName: "CNBC" },
        { html: "<strong>Equities &mdash; Wall Street closed little changed Thursday, the Dow down 0.31% to 51,349.98, the S&amp;P 500 off a marginal 0.02% to 7,704.13 and the Nasdaq up 0.01% to 26,939.37</strong>, as hopes for a phased Hormuz reopening let stocks pare a much steeper bond-driven slide earlier in the session, even as China's Xi Jinping met Trump at the White House.", src: "https://finance.yahoo.com/markets/live/stock-market-today-thursday-september-24-dow-sp-500-nasdaq-080352893.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; the 10-year Treasury yield topped 5.15% intraday before easing back to around 5.10%, still its highest close since 2007</strong>, while the 30-year gilt yield held near 5.68%, its highest since May 1998, after the BoE deputy governors' hawkish afternoon shift.", src: "https://www.cnbc.com/2026/09/24/us-treasury-yields-bonds-fed-inflation.html", srcName: "CNBC" },
      ],
    },
  },
};
