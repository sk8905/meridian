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
      time: "09:25 BST",
      lede: "Sunday's dominant story is diplomatic rather than economic — Trump envoys Steve Witkoff and Jared Kushner carried their Moscow peace push on to Kyiv for talks with President Zelenskyy, even as Axios reports Republican voters souring on the economy — while law firms record a fresh wave of megadeals: Sidley advised Apollo funds on the $4.1bn sale of Kelvion to SLB and Clifford Chance advised EQT on its $2.0bn purchase of McGill & Partners, and on the credit desk Blue Owl disclosed writing a private loan to near-zero amid bankruptcy risk.",
      bullets: [
        { html: "<strong>Macro &mdash; Trump envoys carry Moscow peace push on to Kyiv</strong>: Steve Witkoff and Jared Kushner met Vladimir Putin in Moscow for over three hours Saturday before heading to Kyiv for Sunday talks with President Zelenskyy, with both sides observing a brief pause in strikes to allow the visit &mdash; the first concrete sign of momentum in the stalled Russia-Ukraine peace track in months, easing one of the two war-driven supply risks behind this year's oil-driven inflation scare.", src: "https://www.thenationalnews.com/news/2026/09/06/trump-envoys-meet-putin-before-taking-peace-push-to-kyiv/", srcName: "The National" },
        { html: "<strong>Macro &mdash; Republicans sour on the economy</strong>: Republican consumer sentiment has plunged 15.1 points since February on the University of Michigan survey &mdash; a pace unseen since Covid &mdash; as persistent inflation and Iran-war-linked gas prices erode confidence even among the president's own base ahead of the midterms.", src: "https://www.axios.com/2026/09/05/trump-economy-michigan-survey-inflation-iran-war", srcName: "Axios" },
        { html: "<strong>Legal &mdash; Sidley advises Apollo funds on $4.1bn sale of Kelvion to SLB</strong>: Sidley represented Apollo-managed funds, majority owner of thermal-management specialist Kelvion, on its sale to NYSE-listed SLB for approximately $4.1bn (c.$3.4bn cash plus assumed debt), with closing expected in H1 2027.", src: "https://www.sidley.com/en/newslanding/newsannouncements/2026/09/apollo-funds-in-sale-of-kelvion-to-slb", srcName: "Sidley" },
        { html: "<strong>Legal &mdash; Clifford Chance advises EQT on $2.0bn purchase of McGill & Partners</strong>: Clifford Chance advised EQT X on acquiring a majority stake in London specialty (re)insurance broker McGill & Partners from Warburg Pincus for approximately $2.0bn, with founder Steve McGill continuing to lead the business.", src: "https://www.cliffordchance.com/news/news/2026/09/clifford-chance-advises-eqt-on-the-us20bn-acquisition-of-a-majority-stake-in-mcgill-partners.html", srcName: "Clifford Chance" },
        { html: "<strong>Credit &mdash; Blue Owl slashes a private loan to near-zero amid bankruptcy risk</strong>: Blue Owl marked down a direct-lending position to near-zero as the borrower faces bankruptcy risk, the latest sign of stress surfacing in parts of the private-credit book even as the broader BDC platform keeps raising fresh capital.", src: "https://www.bloomberg.com/news/articles/2026-09-05/blue-owl-slashes-private-loan-to-near-zero-amid-bankruptcy-risk", srcName: "Bloomberg" },
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
