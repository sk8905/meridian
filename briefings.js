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
      date: "2026-09-09",
      time: "12:34 BST",
      lede: "Brent holds above $100 into the New York open as US futures tread water and sterling firms on a hawkish Bailey warning ahead of next week's back-to-back Fed and BoE decisions, with Thursday's PPI and Friday's decisive August CPI still the week's pivot.",
      bullets: [
        { html: "<strong>Macro &mdash; Brent holds above $100 as the Gulf standoff enters a new phase</strong>: crude stayed elevated above the $100 mark first breached since 24 July after Houthi strikes on Saudi energy sites, keeping an oil-driven inflation premium squarely in front of Thursday's PPI and Friday's CPI.", src: "https://www.cnbc.com/2026/09/09/cnbc-daily-open-iran-war-oil-tankers-oil-sanctions-ai-qualcomm.html", srcName: "CNBC" },
        { html: "<strong>Equities &mdash; US futures hold steady even as oil nears $100</strong>: S&amp;P 500, Nasdaq and Dow futures were little changed heading into Wednesday's session, with investors weighing the Gulf oil shock against Tuesday's Qualcomm- and Corning-led AI-infrastructure rally.", src: "https://finance.yahoo.com/markets/live/stock-market-today-wednesday-september-9-dow-sp-500-nasdaq-futures-080411279.html", srcName: "Yahoo Finance" },
        { html: "<strong>Fixed income &mdash; Sterling firms as Bailey's hawkish tone lifts the pound into the MPC</strong>: GBP found support after BoE Governor Bailey struck a more hawkish note, with strategists weighing whether the pound's G10 outperformance can hold against a Fed decision one day ahead of the 17 September MPC.", src: "https://www.fxstreet.com/analysis/sterling-finds-support-as-baileys-hawkish-warning-lifts-pound-ahead-of-mpc-decision-202609090927", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; Fed-hike odds hold above 50% for the first time this cycle</strong>: CME FedWatch-implied odds of a 16 September quarter-point hike remain near 56%, up sharply since Chair Warsh's hawkish Jackson Hole remarks, with Thursday's PPI and Friday's CPI now the decisive inputs before the decision.", src: "https://finance.yahoo.com/economy/policy/articles/fomc-september-2026-odds-rate-201618784.html", srcName: "Yahoo Finance" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-09",
      time: "21:11 BST",
      lede: "US stocks closed lower as Brent held above $100 and the 10-year Treasury yield climbed to 4.84%, its highest since October 2023, even as Meta rallied 6% on its new Muse AI agent &mdash; while a Reuters poll found all 65 economists expect the BoE to hold rates on 17 September, with Bailey insisting there is 'no secret plan' for hikes.",
      bullets: [
        { html: "<strong>Fixed income &mdash; 10-year Treasury yield closes at 4.84%, highest since October 2023</strong>: yields extended their climb even after Secretary Bessent tripled the long-bond buyback to $6bn, as the Iran-driven oil spike and the newly-effective Canadian import ban kept an inflation premium priced into the curve ahead of Thursday's PPI and Friday's decisive CPI.", src: "https://ca.finance.yahoo.com/news/stock-market-today-wednesday-september-9-dow-sp-500-nasdaq-futures-080411279.html", srcName: "Yahoo Finance / Reuters" },
        { html: "<strong>Equities &mdash; Meta rallies 6% on its new Muse AI agent while the broader market slips</strong>: Meta's paid-tier AI agent for email, travel booking and purchases drew bullish price-target raises from Mizuho ($750) and KeyBanc ($780) and pulled the stock up as much as 7%+, even as Alphabet fell 2% on the competitive read-through and the S&amp;P 500 (-0.24%), Dow (-0.58%) and Nasdaq (-0.35%) all closed lower.", src: "https://247wallst.com/investing/2026/09/09/meta-rises-6-as-muse-ai-agent-arrives-with-paid-subscription-tiers-alphabet-falls-2/", srcName: "24/7 Wall St." },
        { html: "<strong>Macro &mdash; Reuters poll: all 65 economists expect the BoE to hold on 17 September</strong>: 57 of 65 economists surveyed 4-8 September see no Bank Rate move for the rest of the year despite the Iran-war inflation risk, even as Governor Bailey told the Treasury Committee there is 'no secret plan' for further tightening.", src: "https://www.investing.com/news/economy-news/bank-of-england-to-hold-rates-show-patience-with-wardriven-inflation-reuters-poll-4891672", srcName: "Reuters" },
        { html: "<strong>Macro &mdash; CENTCOM denies Iran's claimed destroyer strikes after US sinks five tankers</strong>: Iran's IRGC claimed ballistic-missile strikes on the destroyers USS Delbert D. Black and USS John Paul Jones, a claim US Central Command called 'completely FALSE'; American forces destroyed five Iranian crude tankers in response, the latest escalation in the Strait of Hormuz standoff that has kept Brent above $100 since Tuesday.", src: "https://abcnews.com/International/live-updates/iran-live-updates-tehran-plans-new-restricted-zone/?id=136249116", srcName: "ABC News" },
        { html: "<strong>Fixed income &mdash; Sterling nears two-week highs as Bailey pushes back on a pre-set hiking path</strong>: the pound touched $1.3545-1.3546, its strongest since 28 August, after Bailey's Treasury Committee remarks, even as he kept inflation risks 'skewed to the upside' given the Iran war's effect on energy prices.", src: "https://www.globalbankingandfinance.com/pound-nears-two-week-highs-bailey-secret-plan-rate-hikes/", srcName: "Reuters (via GBAF)" },
      ],
    },
  },
};
