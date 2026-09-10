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
      date: "2026-09-10",
      time: "08:26 BST",
      lede: "A unanimous Reuters poll expects the BoE to hold on 17 September even as the market curve still prices hikes from November, while US equities closed lower for a third session and the UK's costliest 30-year gilt syndication since 1998 frames a jittery run into next week's back-to-back FOMC and MPC decisions.",
      bullets: [
        { html: "<strong>Macro &mdash; BoE holds firm as economists see no case for a hike</strong>: all 65 economists in Reuters' latest poll expect the MPC to hold Bank Rate at 3.75% on 17 September, a starker consensus than markets, which are still pricing hikes from November even as the Iran-driven oil shock keeps inflation risk elevated.", src: "https://cyprus-mail.com/2026/09/10/economists-predict-bank-of-england-will-hold-interest-rates-steady", srcName: "Reuters / Cyprus Mail" },
        { html: "<strong>Equities &mdash; US stocks sink for a third session as oil and yields jump</strong>: the Dow, S&amp;P 500 and Nasdaq all closed lower Wednesday as Brent's push above $100 and a 10-year Treasury yield rise to 4.84% &mdash; its highest since October 2023 &mdash; on the back of the Treasury's tripled buyback weighed on risk appetite.", src: "https://ca.finance.yahoo.com/news/stock-market-today-wednesday-september-9-dow-sp-500-nasdaq-futures-080411279.html", srcName: "Yahoo Finance / Reuters" },
        { html: "<strong>Fixed income &mdash; UK 30-year gilt yield hits its highest since the DMO's 1998 founding</strong>: Britain's syndication priced at 5.8168%, narrowing Chancellor Healey's fiscal headroom for tax rises ahead of the 28 October Budget just as food-price inflation is forecast to climb above 6% next year.", src: "https://www.investing.com/news/economy-news/uk-sells-30year-debt-at-record-yield-showing-pressure-on-public-finances-4891674", srcName: "Reuters" },
        { html: "<strong>Macro &mdash; Trump turns up pressure on the Fed as decisive CPI looms</strong>: the White House renewed pressure on Chair Warsh to cut ahead of Friday's August CPI and the 16 September FOMC, even as some economists argue consumers would be better served by a hike that keeps inflation contained.", src: "https://www.cnbc.com/2026/09/09/fed-interest-rates-consumers-benefit-rates-stay-higher.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; BoE's Bailey pushes back on hike-inevitability into the 17 September MPC</strong>: the Governor told the Treasury Committee the market curve already embeds an inflation risk premium, even as he kept the door open by describing risks as \"skewed to the upside\".", src: "https://www.fxstreet.com/news/risks-to-inflation-are-to-upside-boes-bailey-sounds-a-cautious-note-202609081449", srcName: "FXStreet / Reuters" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-10",
      time: "12:16 BST",
      lede: "Brent holds above $100 after President Trump said the Iran war 'won't end' until after the midterms, UK 10-year gilt yields touch a fresh 19-year high and Fed-hike odds surge past 60% into Thursday's PPI and Friday's decisive August CPI.",
      bullets: [
        { html: "<strong>Macro &mdash; Trump says Iran war and $100 oil won't ease until after the midterms</strong>: the President said the Iran war will 'end' only after November's US midterm elections and that oil prices, back above $100/bbl on renewed Houthi attacks near the Strait of Hormuz, are unlikely to fall until then, keeping the oil-driven inflation risk live into Friday's CPI.", src: "https://www.reuters.com/world/middle-east/trump-says-iran-war-end-after-us-midterm-elections-threatens-attack-pickaxe-2026-09-10/", srcName: "Reuters" },
        { html: "<strong>Fixed income &mdash; UK 10-year gilt yield hits a fresh 19-year high</strong>: the move extends the global bond selloff and adds to pressure on Chancellor Healey's fiscal headroom ahead of the 28 October Budget, as Brent's hold above $100 keeps an inflation premium priced into the curve.", src: "https://www.msn.com/en-gb/news/other/uk-10-year-gilt-yield-hits-new-19-year-high/ar-AA2bW9ZZ", srcName: "Reuters (via MSN)" },
        { html: "<strong>Equities &mdash; FTSE 100 dips as Trump's Iran remark weighs</strong>: London stocks slipped Thursday on the President's comments that the Iran war and elevated oil prices will persist past the midterms, with Brent still holding above $100/bbl.", src: "https://www.cityam.com/ftse-100-live-stocks-to-fall-trump-says-iran-war-will-end-after-midterms/", srcName: "CityAM" },
        { html: "<strong>Macro &mdash; Fed-hike odds surge past 60% into Friday's decisive CPI</strong>: CME FedWatch-implied odds of a 16 September quarter-point hike have jumped over 60%, sharply higher since Chair Warsh's hawkish Jackson Hole remarks, with Thursday's PPI and Friday's August CPI now the last inputs before the decision.", src: "https://finance.yahoo.com/economy/policy/articles/fomc-september-2026-odds-rate-163505675.html", srcName: "Yahoo Finance" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-10",
      time: "17:19 BST",
      lede: "August PPI ran hot and the ECB delivered its second hike of the year, pushing the 10-year Treasury yield above 4.9% and UK gilts to a fresh 19-year high as oil topped $100 and Wall Street slid into Friday's decisive CPI print.",
      bullets: [
        { html: "<strong>Macro &mdash; hot August PPI lifts Fed-hike odds to roughly 70%</strong>: producer prices rose 0.4% m/m and a hotter-than-expected 5.4% y/y on a 4.2% jump in energy costs, pushing CME FedWatch-implied odds of a 16 September hike from ~60% to roughly 70% ahead of Friday's decisive CPI print.", src: "https://www.cnbc.com/2026/09/10/the-likelihood-of-a-fed-interest-rate-hike-next-week-just-got-a-lot-higher.html", srcName: "CNBC" },
        { html: "<strong>Fixed income &mdash; 10-year Treasury yield tops 4.9%, its highest since November 2023</strong>: yields extended their climb as oil's fresh surge past $100 and the hot PPI print reinforced the inflation-risk premium priced into the curve ahead of the FOMC's 15-16 September meeting.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-sept-10-2026", srcName: "TheStreet" },
        { html: "<strong>Equities &mdash; Wall Street slides as WTI tops $100 and Brent clears $105</strong>: the Dow, S&amp;P 500 and Nasdaq all fell Thursday as the widening Iran war pushed oil to fresh multi-week highs, compounding the hawkish repricing from the PPI beat and the ECB's own hike.", src: "https://finance.yahoo.com/markets/live/stock-market-today-thursday-september-10-dow-sp-500-nasdaq-083717303.html", srcName: "Yahoo Finance" },
        { html: "<strong>Macro &mdash; ECB hikes 25bp to a 2.50% deposit rate, its second move this year</strong>: the Governing Council cited the Iran-war energy shock keeping euro-area inflation well above target, lifting its 2026 growth forecast to 0.9% even as it tightened policy.", src: "https://finance.yahoo.com/economy/policy/articles/ecb-raises-interest-rates-again-123331896.html", srcName: "Reuters (via Yahoo Finance)" },
        { html: "<strong>Fixed income &mdash; UK 10-year gilt yield strikes a fresh 19-year high of 5.295%</strong>: the 2-year gilt rose to 4.742%, its highest since November 2023, even as a &pound;5bn May-2030 gilt auction drew robust &pound;16.2bn in bids, with Reuters' poll still showing all 65 economists expecting the MPC to hold Bank Rate on 17 September.", src: "https://order-order.com/2026/09/10/british-10-year-gilt-yield-rises-to-19-year-high/", srcName: "Guido Fawkes" },
      ],
    },
  },
};
