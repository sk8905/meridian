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
      date: "2026-08-12",
      time: "05:24 BST",
      lede: "Asia-Pacific markets edged higher and Brent extended a sixth day of gains as investors positioned for Wednesday's July CPI print, the swing factor for the Fed's 16 September decision; on the desks, RBC BlueBay priced a &euro;400m European CLO reset and Castlelake committed up to &pound;500m to Funding Circle for UK SME lending, while the High Court sanctioned TG Jones High Street's Part 26A restructuring plan.",
      bullets: [
        { html: "<strong>Markets &mdash; Asia/CPI setup</strong>: MSCI's Asia-Pacific ex-Japan gauge rose 0.5% and Brent gained 0.3% to $89.10/bbl for a sixth straight day of gains as investors awaited Wednesday's July CPI print, with fresh Houthi shipping attacks and a North Korean missile launch adding to the risk backdrop.", src: "https://finance.yahoo.com/news/asia-stocks-edge-higher-oil-002532883.html", srcName: "Reuters" },
        { html: "<strong>Markets &mdash; Fed odds</strong>: CME-implied odds of a 16 September Fed hike sit near a coin flip ahead of Wednesday's CPI, with Wall Street split &mdash; BofA and PGIM expect hikes at each remaining 2026 meeting, while Barclays, Jefferies, Morgan Stanley, Truist and UBS see the Fed on hold.", src: "https://us.cnn.com/2026/08/11/business/fed-markets-kevin-warsh", srcName: "CNN Business" },
        { html: "<strong>Credit &mdash; RBC BlueBay CLO reset</strong>: RBC BlueBay priced a &euro;400m reset of its 2021-vintage BBAM Euro CLO II, its fifth CLO transaction of 2026, with its securitised credit and CLO platform AUM now above $28bn.", src: "https://alternativecreditinvestor.com/2026/08/11/rbc-bluebay-prices-e400m-european-clo-reset/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Castlelake/Funding Circle</strong>: Castlelake committed up to &pound;500m to fund UK small-business loans originated on Funding Circle's platform, becoming a new institutional investor in the SME lending marketplace.", src: "https://alternativecreditinvestor.com/2026/08/11/castlelake-backs-funding-circle-with-500m-for-uk-smes/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; TG Jones restructuring plan</strong>: Hildyard J sanctioned TG Jones High Street's Part 26A restructuring plan &mdash; the former WH Smith high-street chain &mdash; after landlord opposition led by British Land was withdrawn following concessions on rent-reduction terms.", src: "https://www.bailii.org/ew/cases/EWHC/Ch/2026/2079.html", srcName: "BAILII" },
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
