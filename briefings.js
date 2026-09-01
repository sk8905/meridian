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
      time: "17:23 BST",
      lede: "US stocks opened lower and Treasury/gilt yields extended their advance as August's ISM Manufacturing PMI cooled to 54.6% and the renewed US-Iran conflict kept Brent above $91/bbl, with the FTSE 100 dropping below 10,800 on its return from the Bank Holiday; on the credit desk, Partners Group replaced chief executive David Layton amid mounting redemption pressure on its flagship evergreen fund.",
      bullets: [
        { html: "<strong>Macro &mdash; ISM Manufacturing PMI cools to 54.6% in August</strong>: The headline index eased a point from July's 55.6% but still marked an eighth straight month of US factory-sector expansion, even as new-orders growth slowed to 53.7% from 56.7%.", src: "https://www.prnewswire.com/news-releases/manufacturing-pmi-at-54-6-august-2026-ism-manufacturing-pmi-report-302865127.html", srcName: "PR Newswire (ISM)" },
        { html: "<strong>Macro &mdash; US stocks open lower as oil and yields extend their advance</strong>: The S&amp;P 500 and Nasdaq pulled back from last week's highs at the open as Brent crude and Treasury yields pushed further into the renewed US-Iran conflict, though equities pared some of the early losses through the session.", src: "https://www.schwab.com/learn/story/stock-market-update-open", srcName: "Charles Schwab" },
        { html: "<strong>Macro &mdash; FTSE 100 drops below 10,800 as Brent crosses $91/bbl</strong>: London's blue-chip index fell back on its return from the Summer Bank Holiday as the resumed US-Iran conflict lifted oil prices and a global bond selloff kept gilt yields elevated.", src: "https://sundayguardianlive.com/business/uk-stock-market-today-september-1-why-is-the-uk-stock-market-down-today-ftse-100-drops-below-10800-as-oil-crosses-dollar-91-check-key-drivers-top-gainers-losers-274697/", srcName: "Sunday Guardian Live" },
        { html: "<strong>Credit &mdash; Partners Group replaces chief executive David Layton amid redemption pressure</strong>: The Swiss private-markets manager is replacing Layton after a surge in redemption requests hit its flagship evergreen fund and share price; Layton had joined in 2005 and co-founder Urs Wietlisbach had signalled a leadership change was coming, but the departure lands sooner amid pressure that has also hit the firm's private-credit and private-equity vehicles this year.", src: "https://www.ft.com/content/0d5b67bd-a07f-47da-9e9b-505df1b4ff33", srcName: "Financial Times" },
        { html: "<strong>Legal &mdash; Clifford Chance advises APA Corporation on strategic partnership for offshore Uruguay block</strong>: Clifford Chance is advising APA Corporation on a strategic partnership covering an offshore exploration block in Uruguay, part of a run of energy and infrastructure financings the firm has advised on through late August.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-apa-corporation-on-strategic-partnership-for-offshore-block-in-uruguay.html", srcName: "Clifford Chance" },
      ],
    },
  },
};
