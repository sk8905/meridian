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
      time: "17:23 BST",
      lede: "The Fed/BoE rate-path debate intensified into the weekend after August's blowout US payrolls report, with Mohamed El-Erian warning the government bond sell-off may continue and Trump renewing pressure on the Fed to cut; on the legal desk Freshfields advised Flex on a $4.4bn AI-power acquisition and Kirkland closed Axcel's oversubscribed &euro;2.1bn eighth buyout fund, while credit saw a leadership overhaul at Sona Asset Management and the launch of London start-up Leeside Capital Partners.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed rate decision still hangs on inflation after the jobs-report surprise</strong>: the stronger-than-expected August payrolls print reopened the September rate debate, with Trump renewing pressure on the Fed to cut even as some officials strike a cautious tone.", src: "https://www.bloomberg.com/news/articles/2026-09-04/fed-rate-decision-still-hangs-on-inflation-after-jobs-report", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; El-Erian warns the government bond sell-off may continue</strong>: Mohamed El-Erian cautioned that the recent sell-off in government bonds, including UK gilts at multi-decade-high yields, could persist as fiscal and rate-path uncertainty weighs on markets.", src: "https://www.cnbc.com/2026/09/04/el-erian-government-bond-selloff.html", srcName: "CNBC" },
        { html: "<strong>Legal &mdash; Freshfields advises Flex on $4.4bn acquisition of EPC Power</strong>: Freshfields represented Flex on its $4.4bn acquisition of AI-infrastructure power-conversion specialist EPC Power.", src: "https://www.freshfields.com/en/our-thinking/news/news-search/2026/09/freshfields-represents-flex-on-$4.4bn-acquisition-of-epc-power", srcName: "Freshfields" },
        { html: "<strong>Legal &mdash; Kirkland closes Axcel's oversubscribed &euro;2.1bn eighth fund</strong>: Kirkland advised Nordic private-equity house Axcel on the final close of Axcel VIII, its largest fund to date at &euro;2.1bn.", src: "https://axcel.com/axcel-closes-oversubscribed-eighth-mid-market-fund-at-eur-2-1-billion/", srcName: "Axcel" },
        { html: "<strong>Credit &mdash; Sona Asset Management overhauls its C-suite</strong>: the credit hedge fund named ex-Deutsche Bank capital-markets co-head Henrik Johnsson as CEO and hired Cheyne Capital's David Hill as CFO, as London start-up Leeside Capital Partners launched with a European opportunistic-credit and restructuring strategy led by two more Deutsche Bank veterans.", src: "https://www.bloomberg.com/news/articles/2025-10-09/deutsche-bank-manager-johnsson-wechselt-zu-hedgefonds-sona", srcName: "Bloomberg" },
      ],
    },
  },
};
