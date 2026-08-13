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
      time: "09:27 BST",
      lede: "UK Q2 GDP grew 0.4% q/q despite Iran-war disruption while Asian stocks rallied on soft US CPI and an AI-earnings boost, with the Strait of Hormuz standoff still unresolved; on the desks, CVC Credit priced its fourth new-issue US CLO of 2026, Weil advised Sunstream USA on a $1.1bn parallel restructuring of Parallel's cannabis assets, and HSF Kramer advised on both a SEVER Life Sciences disposal and a $2.7bn Squadron Energy renewables financing.",
      bullets: [
        { html: "<strong>UK &mdash; Q2 GDP</strong>: the ONS confirmed the UK economy grew 0.4% q/q (1.2% y/y) in Q2, with a June rebound offering a brighter signal despite disruption from the Iran war.", src: "https://www.bloomberg.com/news/articles/2026-08-13/uk-economy-weathers-early-months-of-iran-war-with-0-4-growth", srcName: "Bloomberg" },
        { html: "<strong>Markets &mdash; Asia/CPI</strong>: Asian stocks rose as the in-line July US CPI print dented September Fed rate-hike bets, with an AI-earnings rally adding to the gains.", src: "https://www.fxstreet.com/news/asian-stocks-rise-on-soft-us-cpi-ai-earnings-rally-202608130351", srcName: "FXStreet" },
        { html: "<strong>Markets &mdash; Hormuz</strong>: traffic through the Strait of Hormuz remained low as Trump asserted US control over the strait and tensions with Iran stayed elevated.", src: "https://www.cnn.com/2026/08/13/world/live-news/iran-war-trump", srcName: "CNN" },
        { html: "<strong>Credit &mdash; CVC Apidos LVIII</strong>: CVC Credit priced Apidos LVIII, a $550m US CLO and its fourth new-issue CLO globally this year, with Bank of America as lead arranger.", src: "https://www.cvc.com/media/news/2026/cvc-credit-prices-apidos-lviii-its-fourth-new-issue-clo-globally-of-2026/", srcName: "CVC" },
        { html: "<strong>Legal &mdash; Weil/Sunstream</strong>: Weil guided Sunstream USA through a $1.1bn parallel restructuring, extinguishing more than 90% of Parallel's cannabis-business debt via a foreclosure acquisition.", src: "https://www.weil.com/articles/weil-guides-sunstream-usa-through-1-1b-parallel-restructuring", srcName: "Weil" },
        { html: "<strong>Legal &mdash; HSF Kramer</strong>: HSF Kramer advised SEVER Life Sciences on its sale of Nordic Group to Alfasigma, and separately advised Squadron Energy on a $2.7bn renewable-energy portfolio project financing.", src: "https://www.mondaq.com/pressrelease/205110/herbert-smith-freehills-kramer-advises-squadron-energy-on-$27-billion-renewable-energy-portfolio-project-financing", srcName: "HSF Kramer" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-13",
      time: "12:31 BST",
      lede: "The FTSE 100 joined a global rally and sterling steadied after Q2 UK GDP grew an in-line 0.4% q/q, with US markets awaiting today's July PPI print &mdash; the last inflation read before the Fed's 16 September decision; on the desks, Churchill Asset Management launched a TIAA-backed capital solutions strategy, and White &amp; Case advised on Lakeshore Recycling Systems' $665m credit-facilities refinancing.",
      bullets: [
        { html: "<strong>UK &mdash; Q2 GDP</strong>: the ONS confirmed the UK economy grew 0.4% q/q (1.2% y/y) in Q2, weathering the early months of the Iran war, with a June rebound on hot weather and World Cup demand offsetting a softer April&ndash;May patch.", src: "https://www.bloomberg.com/news/articles/2026-08-13/uk-economy-weathers-early-months-of-iran-war-with-0-4-growth", srcName: "Bloomberg" },
        { html: "<strong>Markets &mdash; FTSE/pound</strong>: the FTSE 100 tracked a global rally and the pound steadied on the in-line GDP print, with traders still weighing gilts, the Hormuz standoff and Jaguar Land Rover headlines.", src: "https://www.bloomberg.com/news/live-blog/2026-08-13/ftse-100-live-uk-gdp-pound-gilts-trump-iran-oil-prices-hormuz-jlr-ai-stocks-what-s-moving-uk-markets-right-now-markets-today-msr3mc9u", srcName: "Bloomberg" },
        { html: "<strong>Markets &mdash; PPI ahead</strong>: economists expect a subdued July US PPI print later Thursday, the final inflation data point before the Fed's 16 September meeting, following Wednesday's in-line CPI.", src: "https://continuumeconomics.com/a/b6e8faf2/preview-due-august-13-us-july-ppi-prices-seen-subdued-when-data-was-surveyed", srcName: "Continuum Economics" },
        { html: "<strong>Credit &mdash; Churchill/TIAA</strong>: Churchill Asset Management launched a new capital solutions strategy backed by parent TIAA, led by Noah Charney and drawing on sister firm Arcmont's expertise via the ~$99bn Nuveen Private Capital platform.", src: "https://alternativecreditinvestor.com/2026/08/12/churchill-launches-capital-solutions-strategy-backed-by-tiaa/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; White &amp; Case/Lakeshore</strong>: White &amp; Case advised Lakeshore Recycling Systems on a $665m refinancing of its credit facilities.", src: "https://www.whitecase.com/news/press-release/white-case-advises-lakeshore-recycling-systems-us665-million-credit-facilities", srcName: "White & Case" },
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
