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
      date: "2026-08-31",
      time: "21:18 BST",
      lede: "US equities and Treasuries stayed on the back foot into the close as the weekend's US-Iran strikes kept oil above $90/bbl and fed-funds futures held near a fresh-cycle-high for a 16 September hike, while BoE Governor Andrew Bailey's G20/FSB warning on AI-driven financial-stability risk continued to reverberate; on the desks, TDR Capital was reported exploring a sale of UK alternative-credit manager Arrow Global, and EQT's completed combination with Coller Capital (forming \"Coller EQT\") remained the day's biggest credit-manager ownership move.",
      bullets: [
        { html: "<strong>Macro &mdash; Bailey warns G20/FSB that AI investment could amplify a market correction</strong>: Writing to G20 finance ministers as chair of the Financial Stability Board, BoE Governor Andrew Bailey warned that debt-fuelled AI investment, 'stretched' valuations and elevated sovereign-debt issuance could together amplify a future market correction, cautioning that few jurisdictions have protocols in place to manage a disorderly AI-sector correction.", src: "https://www.cityam.com/andrew-bailey-warns-markets-are-not-ready-for-the-rise-or-fall-of-ai/", srcName: "CityAM" },
        { html: "<strong>Macro &mdash; Fed hike odds hold near a fresh-cycle high as oil stays above $90/bbl</strong>: Fed-funds futures continued to price a fresh-cycle-high probability of a 16 September hike Monday (CME FedWatch), as renewed US-Iran strikes near the Strait of Hormuz kept Brent crude above $90/bbl and US equity indices extended their session declines into the close.", src: "https://fortune.com/2026/08/31/gas-prices-oil-us-iran-strikes-strait-hormuz/", srcName: "Fortune" },
        { html: "<strong>Credit &mdash; TDR Capital explores sale of Arrow Global</strong>: TDR Capital, which took UK alternative-credit and NPL manager Arrow Global private in 2021, is working with Goldman Sachs to explore a sale of the business; the process is early-stage and TDR could ultimately retain the asset.", src: "https://www.bloomberg.com/news/articles/2026-08-12/tdr-is-said-to-explore-sale-of-uk-private-credit-manager-arrow", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; EQT completes acquisition of Coller Capital, forming \"Coller EQT\"</strong>: EQT AB closed its combination with Coller Capital, acquiring 100% of the management company and GP entities roughly a quarter ahead of the mid-to-late Q3 2026 guidance Coller had given &mdash; lifting EQT's total AUM to &euro;341bn ($389bn); Jeremy Coller becomes Head of Coller EQT and joins EQT's Executive Committee.", src: "https://www.prnewswire.com/news-releases/eqt-closes-combination-with-coller-capital-302864808.html", srcName: "PR Newswire" },
        { html: "<strong>Legal &mdash; Ropes &amp; Gray and Davis Polk advise on Genstar's $7bn sale of First Eagle to Victory Capital</strong>: Ropes &amp; Gray advised Genstar Capital on its sale of First Eagle Investments to Victory Capital for $7bn, with Davis Polk advising First Eagle's management on the other side of the deal.", src: "https://www.ropesgray.com/en/news-and-events/news/2026/08/ropes-gray-advised-genstar-capital-first-eagle-investments-victory-capital", srcName: "Ropes & Gray" },
      ],
    },
  },
};
