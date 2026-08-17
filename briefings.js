// =============================================================================
// briefings.js — the tri-daily AI market briefings (Morning · Afternoon ·
// Evening) surfaced by the header "Briefing" button (v2/js/nav-actions.js).
//
// GENERATION (see docs/refresh-routines.md): these are written by the 5×/day
// refresh routine, NOT at runtime. Each run regenerates whichever slot the clock
// is in (morning < 12:00 · afternoon 12:00–17:00 · evening ≥ 17:00 BST), so the
// current slot is always freshest and every slot is refreshed at least once a day.
//
// GROUNDING (HOUSE_STYLE / non-negotiables): a briefing is a SUMMARY of items
// Wire already holds — every bullet carries a real `src` URL to the wire/desk item
// it compresses. No invented figures, no uncited claims. A thin news slot gets a
// short briefing, never padding. Served no-cache + tokenless (see _headers), so a
// routine refresh is picked up without a code token bump (HOUSE_STYLE T1).
// =============================================================================
export const BRIEFINGS = {
  tz: "BST",
  // Ordered for the slot chips; the view picks the current slot by clock.
  order: ["morning", "afternoon", "evening"],
  slots: {
    morning: {
      label: "Morning",
      date: "2026-08-17",
      time: "05:29 BST",
      lede: "Ropes &amp; Gray advised NEOS Investments on its up-to-$2.25bn sale to Goldman Sachs Asset Management, the 60-day US-Iran memorandum on reopening the Strait of Hormuz expired Monday with talks stalled and shipping traffic roughly halved, Eiffel Investment Group led a &euro;323m financing facility for Omnes-backed Power Capital Renewable Energy, Linklaters' Yunneng Wind Power plan stands as the first English restructuring process for a Taiwanese company, and UK gilt yields stay near 14-month highs even as sterling firms toward 1.36 against the dollar.",
      bullets: [
        { html: "<strong>Legal &mdash; Ropes &amp; Gray/NEOS Investments</strong>: Ropes &amp; Gray advised NEOS Investments, the ~$30bn option-income ETF platform, on its sale to Goldman Sachs Asset Management for up to $2.25bn.", src: "https://www.ropesgray.com/en/news-and-events/news/2026/08/ropes-gray-advised-neos-investments-in-sale-to-goldman-sachs", srcName: "Ropes & Gray" },
        { html: "<strong>Geopolitics &mdash; Hormuz</strong>: the 60-day US-Iran memorandum of understanding on reopening the Strait of Hormuz expired Monday with little sign of an extension &mdash; Foreign Minister Araghchi said Iran has 'not yet made a decision to restart negotiations' &mdash; as Hormuz shipping traffic fell from roughly 11 vessels a day to six over the weekend and Brent held near $89/bbl.", src: "https://www.aljazeera.com/news/2026/8/16/us-iran-mou-is-set-to-expire-what-to-know", srcName: "Al Jazeera" },
        { html: "<strong>Credit &mdash; Eiffel Investment Group</strong>: Eiffel Investment Group led a &euro;323m financing facility for Power Capital Renewable Energy, a portfolio company of Omnes Capital.", src: "https://www.omnescapital.com/press-release/eiffel-investment-group-leads-e323-million-financing-facility-for-omnes-portfolio-company-power-capital-renewable-energy", srcName: "Omnes Capital" },
        { html: "<strong>Restructuring &mdash; Yunneng Wind Power</strong>: the Part 26A restructuring plan for Taiwan's Yunneng offshore wind farm &mdash; convened before Michael Green J and advised on by Linklaters &mdash; stands as the first English restructuring process used for a Taiwanese company, restructuring roughly &euro;2.9bn of project debt.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2023/2111", srcName: "National Archives" },
        { html: "<strong>UK &mdash; rates &amp; sterling</strong>: UK 10-year gilt yields remain near 14-month highs on fiscal and energy-cost pressure even as yield support lifts sterling toward 1.36 against the dollar.", src: "https://www.exchangerates.org.uk/news/46876/2026-08-17-scotiabank-pound-to-dollar-forecast-yield-support-lifts-gbp-towards-1-36.html", srcName: "Exchange Rates UK" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-16",
      time: "12:26 BST",
      lede: "Iran struck another ship in the Strait of Hormuz as markets weigh a possible September Fed pause against hawkish risk into Jackson Hole, Sidley advised MarineMax on its $1.5bn take-private sale to Blackstone-backed Safe Harbor Marinas, Barings and Ardian each financed new mid-market deals for Investcorp and IK Partners, and the Court of Appeal shielded a jurisdiction-challenging defendant's procedural rights in Sucden Financial v TMT Metals.",
      bullets: [
        { html: "<strong>Geopolitics &mdash; Hormuz</strong>: Iran struck another ship in the Strait of Hormuz as Israel stepped up attacks in Lebanon, with the UAE accusing Iran of the latest attack on oil and gas shipping.", src: "https://www.cbsnews.com/live-updates/iran-war-donald-trump-strait-of-hormuz-uae-accuses-attacks-vance-oil-gas/", srcName: "CBS News" },
        { html: "<strong>Markets &mdash; Fed</strong>: markets are betting on a September pause, but Fed hawks may not be swayed ahead of the Jackson Hole symposium, with rate-hike odds still contested going into the 26 August core PCE print.", src: "https://finance.yahoo.com/economy/policy/article/markets-bet-on-a-pause-for-september-but-fed-hawks-may-not-be-swayed-ahead-of-jackson-hole-175928197.html", srcName: "Yahoo Finance" },
        { html: "<strong>Legal &mdash; Sidley/MarineMax</strong>: Sidley advised MarineMax on its roughly $1.5bn take-private sale to Safe Harbor Marinas, a Blackstone Infrastructure portfolio company, at $53.00/share in cash &mdash; a 96% premium to MarineMax's 30 January close.", src: "https://www.sidley.com/en/newslanding/newsannouncements/2026/08/sidley-represents-marinemax-in-its-sale-to-blackstone-infrastructure-portfolio-company-safe-harbor", srcName: "Sidley Austin" },
        { html: "<strong>Credit &mdash; Barings/Ardian</strong>: Barings led senior secured financing for Investcorp's acquisition of RIA Berger Financial Group, while Ardian Private Debt provided unitranche and acquisition financing backing IK Partners' investment in Dains Accountants.", src: "https://www.ardian.com/news-insights/press-releases/ardian-provides-financing-support-ik-partners-investment-dains", srcName: "Ardian" },
        { html: "<strong>Legal &mdash; Sucden Financial v TMT Metals</strong>: the Court of Appeal (Macfarlanes for respondent Sucden) held that a jurisdiction-challenging defendant's time to respond should run from final resolution of a live Supreme Court appeal, applying CPR Part 11 principles to protect his procedural position.", src: "https://caselaw.nationalarchives.gov.uk/ewca/civ/2026/1080", srcName: "National Archives" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-16",
      time: "21:20 BST",
      lede: "Iran struck another ship in the Strait of Hormuz as US markets head into a week framed by Wednesday's FOMC minutes, Weil advised The Hartford on a $1.9bn sale of Hartford Funds to Wellington Management, Sidley advised Castle Creek Capital on Tri-County Financial's $204.6m merger into HBT Financial, and Beechbrook Capital provided an &pound;8m senior debt facility to London advisory firm LAVA Advisory Partners.",
      bullets: [
        { html: "<strong>Geopolitics &mdash; Hormuz</strong>: Iran struck another ship in the Strait of Hormuz as Israel stepped up attacks on Lebanon, keeping the blockade and its oil-driven inflation risk live heading into the new week.", src: "https://www.cbsnews.com/live-updates/iran-war-donald-trump-strait-of-hormuz-uae-accuses-attacks-vance-oil-gas/", srcName: "CBS News" },
        { html: "<strong>Markets &mdash; week ahead</strong>: US stocks head into a week framed by Wednesday's FOMC minutes and Monday's Empire State manufacturing print, with markets still betting on a September Fed pause but hawks unswayed ahead of Jackson Hole.", src: "https://www.cnbc.com/2026/08/16/here-are-the-2-big-things-were-watching-in-the-stock-market-in-the-week-ahead.html", srcName: "CNBC" },
        { html: "<strong>Legal &mdash; Weil/The Hartford</strong>: Weil advised The Hartford on the sale of Hartford Funds, its wealth-management investment-solutions business, to Wellington Management for an estimated $1.9bn net present value; Hartford Funds will rebrand under the Wellington name.", src: "https://www.weil.com/articles/weil-advises-the-hartford-in-1-9b-sale-of-hartford-funds-to-wellington-management", srcName: "Weil" },
        { html: "<strong>Legal &mdash; Sidley/Castle Creek</strong>: Sidley advised Castle Creek Capital, lead shareholder of Tri-County Financial Group, on Tri-County's ~$204.6m cash-and-stock merger into HBT Financial, expanding HBT's footprint across central Illinois and greater Chicago.", src: "https://www.sidley.com/en/newslanding/newsannouncements/2026/08/sidley-represents-castle-creek-capital-in-tri-county-financial-groups-merger-with-hbt-financial", srcName: "Sidley Austin" },
        { html: "<strong>Credit &mdash; Beechbrook/LAVA</strong>: Beechbrook Capital, via its fourth UK SME Credit fund, provided an &pound;8m senior debt investment to LAVA Advisory Partners, a London M&amp;A advisory firm, supporting its next phase of growth while keeping it 100% employee-owned.", src: "https://www.beechbrookcapital.com/beechbrook-capital-completes-its-latest-uk-investment-in-lava-advisory-partners/", srcName: "Beechbrook Capital" },
      ],
    },
  },
};
