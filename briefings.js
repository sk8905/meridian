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
      date: "2026-09-04",
      time: "05:22 BST",
      lede: "The dollar slumped to start September as the yen surged on fresh BoJ rate-hike bets and gold pushed toward a higher weekly close on Fedspeak-driven rate-cut odds, while UK services activity hit a four-month high even as sterling held near a three-week low ahead of Friday's US payrolls; on the credit desk BNP Paribas Asset Management's SRT strategy landed a $600m mandate from Arizona's state pension fund and Bridgewater hired away a Brevan Howard commodities strategist, while Freshfields advised DHL Group on modernising its group structure.",
      bullets: [
        { html: "<strong>Macro &mdash; Dollar slumps to start September as yen surges on BoJ rate bets</strong>: The dollar fell to its lowest since May as traders trimmed September Fed rate-hike bets and a surging Japanese yen &mdash; on fresh Bank of Japan hike speculation &mdash; rippled across global currency markets, with swaps now pricing roughly even odds of a quarter-point Fed hike, down from about 70% earlier in the week.", src: "https://www.bloomberg.com/news/articles/2026-09-04/us-dollar-slumps-to-start-september-as-yen-surges-on-rate-bets", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Britain's services PMI reaches a 4-month high even as sterling lags</strong>: The final S&amp;P Global/CIPS UK Services PMI rose to 52.5 in August, its fastest pace of growth in four months and business confidence at its highest since February, yet the pound has still failed to draw support from the reading and continues to trade near a three-week low against the dollar ahead of Friday's US jobs report.", src: "https://english.news.cn/europe/20260904/0198482770084ee28528946bd5c840d0/c.html", srcName: "Xinhua" },
        { html: "<strong>Credit &mdash; BNP Paribas Asset Management wins $600m SRT mandate from Arizona pension fund</strong>: The Arizona State Retirement System awarded BNP Paribas Asset Management's significant-risk-transfer strategy a further $600m commitment, lifting ASRS's total commitments to the manager's SRT programme to $1bn.", src: "https://alternativecreditinvestor.com/2026/09/03/arizona-pension-fund-doubles-down-on-srts/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Hedge funds &mdash; Bridgewater hires Brevan Howard commodities strategist Kobi Platt</strong>: Bridgewater Associates hired Kobi Platt, a commodities strategist from Brevan Howard, as the world's largest hedge fund continues to build out its macro research bench.", src: "https://www.hedgeweek.com/bridgewater-hires-brevan-howard-commodities-strategist-kobi-platt/", srcName: "Hedgeweek" },
        { html: "<strong>Legal &mdash; Freshfields advises DHL Group on modernisation of its group structure</strong>: Freshfields advised DHL Group on a corporate restructuring effective 1 September 2026 under which listed parent Deutsche Post AG was renamed DHL AG, while its Post &amp; Paket Deutschland division was separated into a new independent company retaining the &lsquo;Deutsche Post AG&rsquo; name as a wholly-owned DHL AG subsidiary.", src: "https://www.freshfields.com/en/our-thinking/news/news-search/2026/09/freshfields-advises-dhl-group-on-the-modernisation-of-its-group-structure", srcName: "Freshfields" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-03",
      time: "12:23 BST",
      lede: "European bond-market turmoil eased through Thursday morning as the final UK services PMI showed the sector growing at its fastest pace in months, while the yen surged to a one-month high on fresh Bank of Japan rate-hike bets and Reuters reported oil steadying ahead of Friday's US payrolls; on the credit desk Bain Capital Credit provided a $250m senior facility to Playfly Sports and ExodusPoint handed a former BlueCrest trader more than $1bn for a new macro pod, while Wire added the convening judgment in Waldorf Production's second Part 26A restructuring plan.",
      bullets: [
        { html: "<strong>Macro &mdash; Bond market turmoil eases as UK service-sector growth jumps</strong>: European government bonds steadied after this week's rout and the final S&amp;P Global/CIPS UK services PMI showed activity growing at its fastest pace in months, pulling gilt yields back from the multi-decade highs reached earlier in the week.", src: "https://www.theguardian.com/business/live/2026/sep/03/uk-mortgage-rates-set-to-rise-bond-sell-off-borrowing-costs-latest-news-updates", srcName: "The Guardian" },
        { html: "<strong>Macro &mdash; Yen soars as Bank of Japan is tipped to raise rates</strong>: The yen jumped to a one-month high as traders raised bets on another BoJ hike &mdash; with suspicions of fresh intervention adding to Wednesday's roughly 1% move &mdash; while Japanese government bond yields slid back from historic peaks.", src: "https://www.theguardian.com/business/2026/sep/03/yen-soars-bank-of-japan-tipped-to-raise-interest-rates", srcName: "The Guardian" },
        { html: "<strong>Macro &mdash; Calm returns to markets before Friday's payrolls</strong>: Reuters' Morning Bid reported oil steadying and Treasury yields easing from multi-year highs overnight, with Fed speakers Waller, Hammack and Goolsbee due on Thursday and the August employment report on Friday as the next tests of September hike pricing.", src: "https://www.investing.com/news/commodities-news/morning-bid-labor-days-4887462", srcName: "Reuters (via Investing.com)" },
        { html: "<strong>Credit &mdash; Bain Capital Credit provides $250m senior facility to Playfly Sports</strong>: The US sports revenue and media platform secured a $250m senior credit facility from Bain Capital Credit's private credit group to fund continued growth across its multimedia-rights management business.", src: "https://pulse2.com/playfly-sports-secures-250-million-senior-credit-facility-from-bain-capital-credit/", srcName: "Pulse 2.0" },
        { html: "<strong>Hedge funds &mdash; ExodusPoint backs ex-BlueCrest trader with more than $1bn</strong>: ExodusPoint Capital Management is giving former BlueCrest portfolio manager Ben Atlas an initial allocation of over $1bn for a new macro pod, Atlas Capital, expected to launch later this month as the firm also expands its Asia headcount by nearly 80% this year.", src: "https://www.hedgeweek.com/exoduspoint-gives-former-bluecrest-trader-more-than-1bn-for-new-macro-pod/", srcName: "Hedgeweek" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-03",
      time: "21:23 BST",
      lede: "Fed Governor Waller's CPI-contingent hold remarks kept pulling hike odds lower into the evening (CME FedWatch ~54.6%, down from ~66% Wednesday) as Broadcom's post-earnings slide underlined the market's narrow-leadership nerves; on the credit desk the Benetton family's Edizione launched 21 Next, a &euro;3bn pan-European platform with private-debt exposure via the Tages Credit Fund, while IFM Investors opened a Singapore office to grow its Asia diversified-credit book and Bloomberg's Nishant Kumar reported Jain Global made $1.8bn in trading profit before pivoting to run Millennium's capital exclusively; Herbert Smith Freehills Kramer advised Bodycote plc on its &pound;1.84bn recommended takeover by Veritas Capital.",
      bullets: [
        { html: "<strong>Macro &mdash; Waller's dovish CPI-contingent tone pulls hike odds to ~54.6%</strong>: Fed Governor Christopher Waller said his 15&ndash;16 September rate call is &ldquo;heavily influenced&rdquo; by the 11 September CPI report and he would back a hold if disinflation continues &mdash; the least-hawkish framing from any FOMC voter since Jackson Hole &mdash; pulling CME FedWatch-implied hike odds down roughly 12 points to ~54.6% (45.4% hold), from ~66% on Wednesday.", src: "https://www.bloomberg.com/news/articles/2026-09-03/fed-s-waller-says-september-rate-decision-hinges-on-august-cpi", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Broadcom falls despite Q3 beat as Q4 guide undershoots</strong>: Broadcom fell in premarket/midday trading despite beating on both lines (revenue $29.59bn, adjusted EPS $3.32) after its ~$34.8bn fiscal Q4 revenue guide missed the $35.03bn consensus &mdash; the market again judging an AI-capex bellwether on the size of the raise rather than the beat, even as the S&amp;P 500 and Nasdaq rallied on falling Treasury yields.", src: "https://www.fool.com/coverage/stock-market-today/2026/09/03/stock-market-midday-sept-3-stocks-rally-as-treasury-yields-fall-broadcom-falls-despite-earnings-beat/", srcName: "The Motley Fool" },
        { html: "<strong>Credit &mdash; Benetton family's Edizione launches 21 Next with &euro;3bn AUM</strong>: Edizione completed the launch of 21 Next, merging 21 Invest and Tages Capital into a pan-European platform spanning private equity, energy transition, infrastructure and private debt, with &euro;500m of seed capital and a target of &euro;10bn+ AUM by 2030; its private-debt exposure runs through the &euro;145m Tages Credit Fund financing Italian mid-sized companies.", src: "https://alternativecreditinvestor.com/2026/09/03/benetton-backed-21-next-launches-with-e3bn-aum/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Jain Global made $1.8bn in trading profit before pivoting to run Millennium's capital exclusively</strong>: Bobby Jain's Jain Global generated roughly $1.8bn in gross trading profit over its first two years managing outside capital before an April 2026 deal replaced more than $5bn of that money with capital from his former employer Millennium Management, per Bloomberg's Nishant Kumar.", src: "https://www.bloomberg.com/news/articles/2026-09-01/jain-s-hedge-fund-made-1-8-billion-as-millennium-cash-rolls-in", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; HSF Kramer advises Bodycote plc on &pound;1.84bn Veritas Capital takeover</strong>: Herbert Smith Freehills Kramer advised the FTSE 250 heat-treatment and metal-coatings group on its recommended &pound;1.84bn takeover by US private equity sponsor Veritas Capital at 940p/share in cash, after Veritas prevailed over rival bidder CVC in a competitive process.", src: "https://legaldesire.com/herbert-smith-freehills-kramer-advises-bodycote-plc-on-its-1-84-billion-takeover-by-veritas-capital", srcName: "Herbert Smith Freehills Kramer (via Legal Desire)" },
      ],
    },
  },
};
