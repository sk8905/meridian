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
      date: "2026-09-05",
      time: "09:20 BST",
      lede: "Saturday morning's dominant thread is still Friday's blowout US payrolls (+162,000, unemployment steady at 4.1%), which reopened the September rate-hike debate, while UK retail investors piled into gilts this week after yields touched multi-decade highs; the credit desk's freshest deals remain Fortress's third European CLO and Golub Capital's European CLO platform build-out, and on the legal desk Kirkland advised Carlyle, Dynasty Equity and Sixth Street on their minority investments in the Seattle Seahawks.",
      bullets: [
        { html: "<strong>Macro &mdash; August payrolls beat triples consensus, unemployment holds at 4.1%</strong>: The US economy added 162,000 jobs in August, roughly triple consensus, keeping the 16 September Fed decision in play even as President Trump renewed pressure on the central bank to cut rates.", src: "https://www.cnbc.com/2026/09/04/jobs-report-august-2026.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; UK retail gilt buying jumps as yields touch multi-decade highs</strong>: British savers sharply increased purchases of UK government bonds this week as the sell-off lifted yields to their highest levels in decades, with retail-platform gilt buying surging to the year's highest level.", src: "https://www.bloomberg.com/news/articles/2026-09-03/retail-gilt-buying-jumps-after-yields-touch-highest-in-decades", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Fortress prices its third European CLO, a &euro;406m deal</strong>: Fortress Investment Group priced Fortress Credit Europe BSL 2026-3 DAC, a &euro;406m broadly-syndicated-loan CLO and its third European transaction.", src: "https://www.fortress.com/news/2026-08-14-fortress-investment-group-announces-pricing-of-third-european-clo-transaction", srcName: "Fortress" },
        { html: "<strong>Credit &mdash; Golub Capital expands its CLO platform to Europe</strong>: Golub Capital extended its broadly-syndicated-loan CLO business into Europe, hiring Tyler Wallace from Fair Oaks Capital to lead the build-out as an MD.", src: "https://golubcapital.com/news-insights/golub-capital-expands-broadly-syndicated-loan-clo-business-to-europe/", srcName: "Golub Capital" },
        { html: "<strong>Legal &mdash; Kirkland advises Carlyle, Dynasty Equity and Sixth Street on Seattle Seahawks minority stakes</strong>: Kirkland &amp; Ellis acted as legal counsel to the three minority investors in the Khosla family's $9.6bn acquisition of the NFL franchise, which closed 3 September; Sullivan &amp; Cromwell advised the Khosla ownership group.", src: "https://www.alternativeswatch.com/2026/09/03/khosla-family-closes-9-6bn-seahawks-purchase-sixth-street-carlyle-dynasty-equity-invest/", srcName: "Alternatives Watch" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-05",
      time: "12:16 BST",
      lede: "Saturday's quiet in markets but not in debate: Friday's blowout August payrolls (+162,000) has hike odds for the 16 September FOMC holding near 58%, with Goldman Sachs pushing back that a hike is still \"very unlikely,\" while UK gilt yields at 28-year highs keep squeezing Chancellor Healey's Budget headroom; on the credit desk Greg Coffey's Kirkoswald is preparing a new emerging-market credit hedge fund, and law firms are already lining up tech mandates behind Nvidia's $13bn purchase of Hugging Face.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed hike odds hold near 58% after payrolls beat; Goldman Sachs pushes back</strong>: Futures still price roughly even-to-favoured odds of a 16 September rate hike after Friday's 162,000 August payrolls print, but Goldman Sachs' Jan Hatzius argues a hike remains \"very unlikely\" and expects the Fed to hold through 2026.", src: "https://finance.yahoo.com/economy/policy/articles/odds-fed-rate-hike-fall-083935313.html", srcName: "Yahoo Finance" },
        { html: "<strong>Macro &mdash; UK borrowing costs at a 28-year high squeeze Healey's Budget room</strong>: Deutsche Bank's Sanjay Raja estimates the gilt-yield surge could roughly halve Chancellor Healey's fiscal headroom to £13.8bn ahead of the 28 October Budget, with 30-year yields near their highest since 1998.", src: "https://www.easterneye.biz/uk-borrowing-costs-burnham-budget/", srcName: "Eastern Eye" },
        { html: "<strong>Credit &mdash; Kirkoswald to launch new EM credit hedge fund</strong>: Greg Coffey's Kirkoswald Asset Management is preparing a fund focused on emerging-market credit, capitalising on surging investor demand for hedge funds.", src: "https://www.bloomberg.com/news/articles/2026-09-04/coffey-s-kirkoswald-set-to-launch-new-em-credit-hedge-fund", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; Nvidia's $13bn Hugging Face deal drives a fresh wave of tech mandates</strong>: US firms are leading advisory work on Nvidia's purchase of AI platform Hugging Face, the latest in a run of blockbuster tech M&amp;A mandates this year.", src: "https://email.legalbusiness.co.uk/q/12H5apPMR0Krw1LgMOgvOiAc/wv", srcName: "Legal Business" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-05",
      time: "21:09 BST",
      lede: "Saturday evening's dominant thread is Trump's renewed ultimatum to the Fed ahead of the 16 September decision, compounded by US strikes on three Iranian oil tankers and diesel prices hitting a record high as the Iran and Ukraine wars squeeze global supply; on the legal desk HSF Kramer advised Bodycote on its &pound;1.84bn takeover by Veritas Capital and Weil advised Barilla on its acquisition of GOODLES, while on credit Pimco's Christian Stracke warned that some collateralized fund obligations echo pre-2008 subprime MBS.",
      bullets: [
        { html: "<strong>Macro &mdash; Trump renews Fed ultimatum ahead of the September rate decision</strong>: the president pressed the Fed to cut rates ahead of its pivotal 16 September meeting, warning of a trade war with the world if it does not, even as some officials strike a cautious tone.", src: "https://www.cnbc.com/2026/09/05/trump-warsh-fed-september-rate-hike.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; US strikes three Iranian oil tankers in tit-for-tat response</strong>: the US attacked three Iranian tankers as the Strait of Hormuz conflict continued to escalate, with diesel prices hitting an all-time high as the Iran and Ukraine wars constrict global fuel supply.", src: "https://www.axios.com/2026/09/05/us-iran-war-oil-tankers-warships", srcName: "Axios" },
        { html: "<strong>Legal &mdash; HSF Kramer advises Bodycote on its &pound;1.84bn takeover by Veritas Capital</strong>: Herbert Smith Freehills Kramer advised FTSE 250 industrial heat-treatment specialist Bodycote on its recommended all-cash takeover by US private-equity sponsor Veritas Capital, agreed 1 September after a competitive process against rival bidder CVC Capital Partners.", src: "https://legaldesire.com/herbert-smith-freehills-kramer-advises-bodycote-plc-on-its-1-84-billion-takeover-by-veritas-capital", srcName: "Legal Desire" },
        { html: "<strong>Legal &mdash; Weil advises Barilla on its acquisition of GOODLES</strong>: Weil, Gotshal &amp; Manges advised the Barilla Group on its definitive agreement to acquire Santa Cruz mac-and-cheese brand GOODLES, which will continue operating as a standalone brand under its founder.", src: "https://www.weil.com/articles/weil-advises-the-barilla-group-in-its-acquisition-of-goodles", srcName: "Weil" },
        { html: "<strong>Credit &mdash; Pimco's Stracke warns some CFOs echo pre-2008 subprime MBS</strong>: Pimco president Christian Stracke cautioned that investors may be complacent about risk in collateralized fund obligations &mdash; structured vehicles repackaging private-fund LP interests into rated tranches &mdash; drawing comparisons to subprime mortgage-backed securities.", src: "https://www.bloomberg.com/news/articles/2026-09-04/pimco-s-stracke-says-some-complicated-debt-echoes-subprime-mbs", srcName: "Bloomberg" },
      ],
    },
  },
};
