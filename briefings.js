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
      date: "2026-09-01",
      time: "09:17 BST",
      lede: "Fed-funds futures firmed past a ~60% chance of a 16 September hike as Brent crude crossed $91/bbl on the resumed US-Iran conflict and Chair Warsh's hawkish Jackson Hole tone, while UK house-price growth stayed subdued at 1.6% in August per Nationwide; on the desks Blue Owl's $2.4bn AI-factory financing for IREN and Danantara's confirmed $1bn Partners Group mandate remain the standout private-credit stories, and Ropes & Gray advised Eli Lilly on its up-to-$2.875bn acquisition of Merida Biosciences.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed hike odds firm past 60% as Brent tops $91 on renewed Iran strikes</strong>: CME FedWatch-implied odds of a 16 September Fed hike pushed toward 60% after Chair Warsh's hawkish Jackson Hole tone, with Brent crude crossing $91/bbl as US-Iran hostilities resumed over the weekend and the FTSE 100 opened near-flat around 10,825.", src: "https://sundayguardianlive.com/business/uk-stock-market-forecast-today-september-1-ftse-100-set-for-flat-open-near-10825-as-brent-crude-tops-91-check-market-outlook-stocks-to-watch-today-274599/", srcName: "Sunday Guardian Live" },
        { html: "<strong>Macro &mdash; UK house-price growth stays subdued at 1.6% in August, Nationwide</strong>: Nationwide's index showed annual UK house-price growth edging up to 1.6% in August (from a revised 1.4% in July, below the ~2.1% consensus), with the average price at £275,465 as chief economist Robert Gardner described market activity as muted amid economic uncertainty.", src: "https://theintermediary.co.uk/2026/09/house-price-growth-remains-subdued-at-1-6-in-august-nationwide/", srcName: "The Intermediary" },
        { html: "<strong>Credit &mdash; Blue Owl leads $2.4bn AI-factory financing for IREN's Nvidia GPU buildout</strong>: Blue Owl Capital-managed funds led a $2.4bn debt financing &mdash; a $1.2bn senior-secured term loan plus $1.2bn of senior secured notes, each at a 9% rate &mdash; to fund IREN's purchase of Nvidia Blackwell Ultra GPUs for its Horizon 1 data-centre campus in British Columbia, Canada; PIMCO also backed the financing.", src: "https://www.blueowl.com/news/blue-owl-managed-funds-lead-24-billion-ai-factory-financing-iren", srcName: "Blue Owl" },
        { html: "<strong>Credit &mdash; Danantara confirmed as investor behind Partners Group's $1bn Asia-Pacific private-credit mandate</strong>: Bloomberg confirmed Indonesia's sovereign wealth fund Danantara as the previously-unnamed backer of Partners Group's $1bn private-credit mandate &mdash; a $600m direct-lending tranche plus $400m of discretionary/co-investment capital targeting senior and junior direct lending across Asia-Pacific, with a focus on Indonesia.", src: "https://www.privateequitywire.co.uk/danantara-commits-1bn-to-partners-group-private-credit-strategy/", srcName: "Private Equity Wire" },
        { html: "<strong>Legal &mdash; Ropes &amp; Gray advises Eli Lilly on up to $2.875bn acquisition of Merida Biosciences</strong>: Ropes &amp; Gray is advising Eli Lilly on its agreement to acquire Cambridge, MA biotech Merida Biosciences &mdash; developer of biologics targeting pathogenic autoantibodies, lead candidate MER511 in Phase 1 for Graves' disease &mdash; for up to $2.875bn including contingent milestones, with completion expected Q4 2026.", src: "https://www.ropesgray.com/en/news-and-events/news/2026/08/ropes-gray-advised-eli-lilly-in-acquisition-of-merida-biosciences", srcName: "Ropes & Gray" },
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
