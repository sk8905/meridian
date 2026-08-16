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
      date: "2026-08-16",
      time: "09:19 BST",
      lede: "Clifford Chance advised Goldman Sachs on a &pound;280m secured bond backed by UK data centres, US markets head into a week framed by Wednesday's FOMC minutes and Home Depot/Walmart earnings, Iran's foreign minister said Hormuz's reopening still hinges on the US honouring June's MoU as Israeli strikes killed 11 in Lebanon, and UK 10-year gilt yields remain at a 14-month high on PM Burnham's fiscal-flexibility rhetoric.",
      bullets: [
        { html: "<strong>Legal &mdash; Clifford Chance/Goldman Sachs</strong>: Clifford Chance advised Goldman Sachs International, as sole arranger and lead manager, on a &pound;280m single-tranche fixed-rate secured bond issued by Equinix xScale Secured Funding 2026-1, backed by operational Equinix data centres in Slough, UK.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-goldman-sachs-on-gbp280-million-single-tranche-fixed-rate-secured-bond-issuance-secured-on-uk-data-centres.html", srcName: "Clifford Chance" },
        { html: "<strong>US &mdash; week ahead</strong>: Home Depot, Target, Lowe's and Walmart earnings plus Wednesday's minutes from the 28&ndash;29 July FOMC meeting headline the coming week, a key test of how consumers and the Fed are reading still-elevated inflation.", src: "https://abcnews.com/Business/wireStory/wall-street-week-ahead-home-depot-walmart-report-135668245", srcName: "AP News" },
        { html: "<strong>Geopolitics &mdash; Hormuz</strong>: Iran's foreign minister Araghchi said the Strait of Hormuz's reopening still hinges on the US honouring June's ceasefire memorandum, as Israeli strikes killed 11 people in Lebanon in the deadliest raid since the truce.", src: "https://www.aljazeera.com/news/liveblog/2026/8/16/iran-war-live-talks-on-hormuz-strait-continue-israel-kills-11-in-lebanon", srcName: "Al Jazeera" },
        { html: "<strong>UK &mdash; gilts</strong>: UK 10-year gilt yields remain at a 14-month high as new PM Andy Burnham's looser approach to the fiscal rules and Middle East-driven energy costs weigh on the long end, ahead of his government's first Budget.", src: "https://tradingeconomics.com/united-kingdom/government-bond-yield/news/535078", srcName: "Trading Economics" },
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
