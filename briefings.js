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
      date: "2026-09-02",
      time: "05:11 BST",
      lede: "Fed-funds futures pushed above 66% odds of a 16 September hike as Chair Warsh's hawkish tone continued to reprice markets, UK gilts extended their selloff to fresh 2008/1998 highs with ~32bp of further BoE tightening now priced, and UK shop-price inflation hit a two-year high on rising energy costs; on the credit desk Crescent Capital closed a $232m second CLO equity fund.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed hike odds push past 66% as ISM Manufacturing PMI eases to 54.6%</strong>: CME FedWatch-implied odds of a 16 September Fed hike rose above 66% (from ~60.4% the prior session) after Chair Warsh's hawkish Jackson Hole tone, with core PCE still running at 3.7%, ISM Manufacturing PMI easing to 54.6% in August and July JOLTS job openings printing 7.271m.", src: "https://cryptobriefing.com/fed-rate-hike-probability-september-2026/", srcName: "CryptoBriefing" },
        { html: "<strong>Macro &mdash; UK gilt yields hit fresh 18-year high as ~32bp of further BoE hikes now priced</strong>: The 10-year gilt touched its highest since June 2008 (~5.23%) and the 30-year its highest since March 1998 (~5.89%), with markets pricing roughly 32bp of additional Bank of England tightening by year-end (~70% odds of a November move) ahead of the 17 September decision.", src: "https://www.fx.co/en/forex-news/3131539", srcName: "FX.co" },
        { html: "<strong>Macro &mdash; UK shop-price inflation hits two-year high as energy costs bite</strong>: BRC-NIQ data showed UK shop-price inflation accelerating to 1.5% year-on-year in August (from 0.9% in July) &mdash; the fastest pace in over two years &mdash; as food inflation rose to 2.8%, with Ofgem separately confirming a further 4% rise in the household energy price cap from October.", src: "https://www.talkingretail.com/featured/shop-price-inflation-reaches-two-year-high-01-09-2026/", srcName: "Talking Retail" },
        { html: "<strong>Macro &mdash; Britons face energy 'risk premium' as US-Israel war on Iran intensifies</strong>: Ofgem's confirmed 4% price-cap rise for October&ndash;December reflects wholesale gas prices tied to the US-Israel conflict with Iran, even after the government's electricity VAT cut, with experts warning costs will stay elevated while regional tensions persist.", src: "https://www.aljazeera.com/news/2026/9/1/uk-energy-price-rise-britons-face-risk-premium-for-supply-amid-iran-war", srcName: "Al Jazeera" },
        { html: "<strong>Credit &mdash; Crescent Capital lands $232m for second CLO equity fund</strong>: Crescent CLO Equity Funding II closed at $232m, doubling the $103m raised for its 2018 predecessor, investing in control positions within Crescent-managed CLOs and opportunistically across Crescent and third-party CLO debt tranches.", src: "https://alternativecreditinvestor.com/2026/08/28/crescent-lands-232m-for-second-clo-equity-fund/", srcName: "Alternative Credit Investor" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-01",
      time: "12:45 BST",
      lede: "Global bonds sold off sharply as traders back from the holiday weekend caught up with a hawkish Fed/BoE repricing &mdash; UK gilts led the move to their highest yields since 1998 and the US 10-year hit its highest since January 2025 &mdash; while euro-area inflation quickened to a near-three-year high and Brent held above $90/bbl on renewed US-Iran strikes; on the credit desk, Sona Asset Management is preparing to launch a &euro;400m European CLO.",
      bullets: [
        { html: "<strong>Macro &mdash; gilts lead global bond selloff as traders catch up with hawkish repricing</strong>: The UK 10-year gilt yield rose 11bp to 5.25% and the 30-year to 5.89% &mdash; its highest since 1998 &mdash; as the US 10-year Treasury yield pushed to its highest since January 2025 and emerging-market bonds sold off in sympathy.", src: "https://www.bloomberg.com/news/articles/2026-09-01/gilts-lead-global-bond-selloff-as-traders-play-catch-up", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; euro-area inflation quickens, ECB seen raising rates next week</strong>: Eurozone consumer-price growth accelerated to its fastest pace in almost three years, cementing the case for the ECB to hike borrowing costs at its next meeting.", src: "https://www.ft.com/content/99a48c12-cb13-47dd-8a31-fff9a157d7ea", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; UK manufacturing momentum eases as August PMI slips to 51.7</strong>: The final S&amp;P Global/CIPS UK Manufacturing PMI for August eased to 51.7 &mdash; still in expansion territory but signalling softer momentum &mdash; as gilts were swept into the broader global bond selloff.", src: "https://www.fx.co/en/forex-news/3132079", srcName: "FX.co" },
        { html: "<strong>Credit &mdash; Sona prepares to launch &euro;400m European CLO</strong>: Sona Asset Management, the $19bn pan-European credit specialist, is preparing to launch a new &euro;400m European CLO, extending its structured-credit platform after pricing its debut Sona FIOS CLO I in 2023.", src: "https://alternativecreditinvestor.com/2026/08/21/sona-prepares-to-launch-e400m-european-clo/", srcName: "Alternative Credit Investor" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-01",
      time: "21:21 BST",
      lede: "UK 10-year gilt yields pushed to their highest since 2008 and US JOLTS job openings missed estimates at 7.271m as the renewed US-Iran conflict and a global bond selloff kept risk assets under pressure into the New York close; on the credit desk Arcmont landed A$705m from Australian institutions for a European direct-lending mandate and Fortress pushed its private-wealth platform into EMEA and Japan, while Clifford Chance advised Calisen on a £500m infrastructure financing and the High Court dismissed a just-and-equitable winding-up petition in APL Holdco v Apple Properties.",
      bullets: [
        { html: "<strong>Macro &mdash; UK 10-year gilt yields hit highest since 2008 as Iran war reignites inflation fears</strong>: Gilts led a broader global bond selloff, with the UK 10-year yield climbing to levels last seen in 2008 as the renewed US-Iran conflict and stubborn inflation pressured fixed income on both sides of the Atlantic.", src: "https://www.brecorder.com/news/40437390/uk-10-year-gilt-yields-hit-highest-since-2008-as-iran-war-reignites-inflation-fears", srcName: "Business Recorder" },
        { html: "<strong>Macro &mdash; US JOLTS job openings miss at 7.271m versus 7.300m estimate</strong>: July job openings came in just below consensus, a modest cooling signal for the labour market that traders are weighing alongside the ISM Manufacturing PMI's dip to 54.6% ahead of the 16 September FOMC decision.", src: "https://investinglive.com/news/jolts-job-openings-7-271m-vs-7-300m-estimate/", srcName: "investingLive" },
        { html: "<strong>Credit &mdash; Arcmont wins A$705m from Australian institutions for European direct lending</strong>: The Nuveen-affiliated manager secured A$705m (&pound;372.6m) from Brighter Super, the Jana Private Credit Trust and two other Australian institutions for a dedicated portfolio of senior-secured, unitranche and subordinated loans to European mid-market companies in defensive sectors.", src: "https://alternativecreditinvestor.com/2026/09/01/australian-investors-commit-a705m-to-european-direct-lending/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Fortress expands private-wealth distribution into EMEA and Japan</strong>: Fortress Investment Group is taking its credit, real-estate and net-lease private-wealth products beyond the US and Latin America for the first time, naming Harry Bush (ex-Nuveen) to lead EMEA from London and Yuko Umino (ex-PIMCO Japan) to lead Japan from Tokyo.", src: "https://alternativecreditinvestor.com/2026/09/01/fortress-expands-private-wealth-business-into-emea-and-japan/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Clifford Chance advises Calisen on &pound;500m financing for smart-metering rollout</strong>: The firm advised the EQT/GIC/Equitix-backed UK energy-infrastructure business on a &pound;500m long-term financing facility, with Evercore and Santander acting as financial advisers, to fund continued smart-metering investment and expansion into complementary infrastructure sectors.", src: "https://www.cliffordchance.com/news/news/2026/09/clifford-chance-advises-calisen-on-500-million-financing-to-support-growth-of-leading-infrastructure-business.html", srcName: "Clifford Chance" },
      ],
    },
  },
};
