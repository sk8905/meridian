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
      date: "2026-09-06",
      time: "05:23 BST",
      lede: "Sunday's quiet markets don't mean a quiet backdrop: Trump's ultimatum to the Fed ahead of the 16 September decision and record diesel prices from the Iran/Ukraine conflicts still dominate, UK gilt-yield stress at multi-decade highs is drawing retail buyers into gilts even as it squeezes Chancellor Healey's Budget headroom, an Australian property developer's collapse has rattled roughly 40 private-credit funds, and Freshfields advised Flex on its $4.4bn purchase of EPC Power.",
      bullets: [
        { html: "<strong>Macro &mdash; Trump renews Fed ultimatum ahead of the September rate decision</strong>: the president pressed the Fed to cut rates ahead of its pivotal 16 September meeting, warning of a trade war with the world if it does not, even as some officials strike a cautious tone.", src: "https://www.cnbc.com/2026/09/05/trump-warsh-fed-september-rate-hike.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; diesel hits an all-time high as the Iran and Ukraine wars squeeze global fuel supply</strong>: prices for diesel reached a record high as the twin conflicts constrict supply, adding to inflation pressure just ahead of the Fed's September decision.", src: "https://www.nbcnews.com/business/energy/diesel-hits-all-time-high-iran-ukraine-trump-rcna595998", srcName: "NBC News" },
        { html: "<strong>Macro &mdash; UK gilt-yield surge draws in retail buyers even as it squeezes Healey's Budget room</strong>: Aviva Investors boosted its gilts position as yields hit multi-decade highs, while Bloomberg Economics argues Chancellor Healey needs to rebuild fiscal headroom ahead of the 28 October Budget.", src: "https://www.bloomberg.com/news/articles/2026-09-04/aviva-investors-boosts-gilts-bet-as-yield-surge-caps-uk-spending", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Bathla Group collapse rattles Australia's private-credit market, ~40 funds exposed</strong>: Sydney developer Bathla Group entered administration owing roughly A$3.4bn, mostly to non-bank lenders; CVS Lane Capital Partners, Centuria Bass and MA Financial have all restricted redemptions on affected credit funds.", src: "https://alternativecreditinvestor.com/2026/09/04/property-developer-bathla-collapse-rattles-australian-private-credit/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Freshfields represents Flex on its $4.4bn acquisition of EPC Power</strong>: Freshfields advised electronics manufacturer Flex on its agreement to acquire EPC Power, a maker of power-conversion systems for AI data centres and grid infrastructure.", src: "https://www.freshfields.com/en/our-thinking/news/news-search/2026/09/freshfields-represents-flex-on-$4.4bn-acquisition-of-epc-power", srcName: "Freshfields" },
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
