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
      date: "2026-08-13",
      time: "05:24 BST",
      lede: "Oil eased in early Asia trading on reports of a UAE&ndash;Iran asset transfer as markets awaited today's US PPI and UK Q2 GDP prints; on the desks, Tikehau and Nassau Global Credit both priced European CLO resets/new issues, Segantii alum Viridian Asset Management grew its hedge fund to $680m after a strong July, and Weil advised Apollo S3 on a continuation vehicle for Mountaintop Beverage.",
      bullets: [
        { html: "<strong>Markets &mdash; Asia/oil</strong>: oil eased in Asia-Pacific trading after reports of a UAE&ndash;Iran asset transfer, with investors also positioning ahead of today's US PPI print and UK Q2 GDP release.", src: "https://investinglive.com/news/investinglive-asia-pacific-market-news-oil-eases-as-uae-iran-asset-transfer-reported/", srcName: "investingLive" },
        { html: "<strong>Markets &mdash; gold</strong>: gold clings to its 100-day moving average with upside risks intact as the dollar consolidates ahead of the PPI print.", src: "https://www.fxstreet.com/analysis/gold-price-forecast-xau-usd-clings-to-100-day-sma-with-upside-risks-intact-202608130326", srcName: "FXStreet" },
        { html: "<strong>Credit &mdash; CLO resets</strong>: Tikehau Capital priced a reset of one of its 2021-vintage European CLOs following the end of its reinvestment period, while Nassau Global Credit printed its second new-issue euro CLO of 2026.", src: "https://www.globalcapital.com/securitization/article/2gqtgfcy3skw5knj2xwcg/securitization/clos-europe/nassau-prints-second-new-issue-euro-clo-this-year", srcName: "GlobalCapital" },
        { html: "<strong>Credit &mdash; Viridian</strong>: Viridian Asset Management, founded by a former Segantii Capital Management portfolio manager, grew assets to $680m after attracting a new client and returned 2.65% in July.", src: "https://www.bloomberg.com/news/articles/2026-08-12/segantii-alum-s-hedge-fund-firm-grew-assets-gained-in-july", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; Weil/Apollo S3</strong>: Weil advised Apollo S3 on a continuation vehicle for Mountaintop Beverage.", src: "https://www.weil.com/articles/weil-advises-apollo-s3-on-continuation-vehicle-for-mountaintop-beverage", srcName: "Weil" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-12",
      time: "12:39 BST",
      lede: "US futures held near record highs and the FTSE 100 fell for a third day into today's pivotal July CPI print, while the PM was set to chair an emergency Cobra meeting over an extreme-heat warning; on the desks, Aberdeen Investments picked up a commercial real-estate debt mandate from Utmost, Polar Asset Management struck a $215m first close for its second SRT fund, and Ropes &amp; Gray advised HarbourVest on the Advent-led acquisition of FNZ Bank.",
      bullets: [
        { html: "<strong>Markets &mdash; CPI day</strong>: US futures were muted and the Nasdaq ticked higher ahead of today's July CPI print, the swing factor for the Fed's 16 September decision, with gold awaiting the data for its next move.", src: "https://finance.yahoo.com/markets/live/stock-market-today-wednesday-august-12-dow-sp-500-nasdaq-cpi-report-091555133.html", srcName: "Yahoo Finance" },
        { html: "<strong>UK &mdash; FTSE/heatwave</strong>: the FTSE 100 fell for a third straight session on defensive-stock weakness as the PM prepared to chair an emergency Cobra meeting over an extreme-heat warning and wildfires, with sterling flat near 1.3500 ahead of the CPI print.", src: "https://www.itv.com/news/2026-08-12/pm-to-chair-emergency-cobra-meeting-amid-extreme-heat-warning-and-wildfires", srcName: "ITV News" },
        { html: "<strong>Credit &mdash; Aberdeen/Utmost mandate</strong>: Utmost Life and Pensions appointed Aberdeen Investments to manage a commercial real-estate debt mandate, one of Aberdeen's qualifying private-credit strategies alongside infrastructure debt and fund finance.", src: "https://alternativecreditinvestor.com/2026/08/12/utmost-appoints-aberdeen-to-manage-re-debt-mandate/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Polar SRT fund</strong>: Polar Asset Management struck a $215m first close for its second dedicated significant-risk-transfer fund, extending its franchise in bank-capital-relief trades.", src: "https://www.altassets.net/private-equity-news/by-news-type/fund-news/funds-closed/polar-asset-management-launches-second-srt-fund-strikes-215m-first-close.html", srcName: "AltAssets" },
        { html: "<strong>Legal &mdash; Ropes &amp; Gray/FNZ Bank</strong>: Ropes &amp; Gray advised HarbourVest Partners as part of the Advent-led consortium acquiring FNZ Bank.", src: "https://www.ropesgray.com/en/news-and-events/news/2026/08/ropes-gray-advises-harbourvest-on-acquisition-of-fnz-bank-as-part-of-a-consortium-led-by-advent", srcName: "Ropes & Gray" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-12",
      time: "21:24 BST",
      lede: "US stocks closed modestly higher after July CPI landed exactly in line with consensus (headline 0.1% m/m/3.4% y/y, core 0.2% m/m/2.5% y/y), pulling September Fed-hike odds back to roughly 38&ndash;42%, while new research put the UK heatwave's economic toll at &pound;4.4bn in lost output since May; on the desks, Fiera Capital's Q2 2026 results confirmed C$163.5bn total AUM despite a revenue miss, and Kirkland's advisory on KKR's NVIDIA financing partnership remains the day's headline legal mandate.",
      bullets: [
        { html: "<strong>Markets &mdash; CPI/Fed odds</strong>: CME FedWatch-implied odds of a 16 September Fed hike fell to roughly 38&ndash;42% (from near a coin flip the day before) as the in-line July CPI print eased the 10-year Treasury yield 3bp to 4.66%.", src: "https://www.bloomberg.com/news/articles/2026-08-12/bond-traders-keep-cointoss-wager-on-september-fed-hike-post-cpi", srcName: "Bloomberg" },
        { html: "<strong>Markets &mdash; equity close</strong>: the S&amp;P 500 gained 0.30%, the Dow 0.11% and the Nasdaq 0.59% in a session lifted by the tame CPI print and strong AI/cloud-infrastructure earnings from CoreWeave, Super Micro and Nebius.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-aug-12-2026", srcName: "TheStreet" },
        { html: "<strong>UK &mdash; heatwave costs</strong>: new research put the UK economy's lost output from this summer's heatwaves at &pound;4.4bn since May, with cumulative losses potentially reaching &pound;25.6bn by 2030, while Triodos Bank warned the extreme weather could shave roughly &euro;180bn off EU GDP.", src: "https://www.forbes.com/sites/jamiehailstone/2026/08/12/economic-cost-of-summer-heatwaves-highlighted-in-new-research/", srcName: "Forbes" },
        { html: "<strong>Credit &mdash; Fiera Capital Q2</strong>: Fiera Capital's Q2 2026 results confirmed total AUM of C$163.5bn (+2.1% q/q), though revenue of C$155.1m missed estimates and shares fell 4.54% on the print.", src: "https://www.newswire.ca/news-releases/fiera-capital-reports-second-quarter-2026-results-856336460.html", srcName: "Newswire (Fiera Capital)" },
        { html: "<strong>Legal &mdash; Kirkland/KKR/NVIDIA</strong>: Kirkland &amp; Ellis advised KKR on a strategic financing partnership with NVIDIA.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advising-kkr-in-strategic-financing-partnership-with-nvidia", srcName: "Kirkland & Ellis" },
      ],
    },
  },
};
