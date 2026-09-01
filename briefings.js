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
      time: "05:27 BST",
      lede: "Fed-funds futures pushed the odds of a 16 September hike toward a fresh-cycle-high ~65% after Iran's IRGC struck US bases in Jordan and the UAE overnight, reviving the oil-driven inflation risk, while on the desks Blue Owl led a $2.4bn AI-factory financing for IREN, Danantara was confirmed as the sovereign investor behind Partners Group's $1bn Asia private-credit mandate, and Travers Smith advised August Equity on its exit from Hallmarq Veterinary Imaging.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed hike odds push toward a fresh-cycle-high ~65% as gold slides</strong>: CME FedWatch-implied odds of a 16 September Fed hike pushed toward 65% on Chair Warsh's hawkish Jackson Hole tone, even as the renewed US-Iran exchange over the Strait of Hormuz kept a geopolitical bid under the dollar and gold extended Monday's drop below $4,450/oz.", src: "https://www.fxstreet.com/news/gold-declines-as-rising-fed-hike-bets-and-us-iran-tensions-support-usd-202609010350", srcName: "FXStreet" },
        { html: "<strong>Credit &mdash; Blue Owl leads $2.4bn AI-factory financing for IREN's Nvidia GPU buildout</strong>: Blue Owl Capital-managed funds led a $2.4bn debt financing &mdash; a $1.2bn senior-secured term loan plus $1.2bn of senior secured notes, each at a 9% rate &mdash; to fund IREN's purchase of Nvidia Blackwell Ultra GPUs for its Horizon 1 data-centre campus in British Columbia, Canada; PIMCO also backed the financing.", src: "https://www.blueowl.com/news/blue-owl-managed-funds-lead-24-billion-ai-factory-financing-iren", srcName: "Blue Owl" },
        { html: "<strong>Credit &mdash; Danantara confirmed as investor behind Partners Group's $1bn Asia-Pacific private-credit mandate</strong>: Bloomberg confirmed Indonesia's sovereign wealth fund Danantara as the previously-unnamed backer of Partners Group's $1bn private-credit mandate &mdash; a $600m direct-lending tranche plus $400m of discretionary/co-investment capital targeting senior and junior direct lending across Asia-Pacific, with a focus on Indonesia.", src: "https://www.privateequitywire.co.uk/danantara-commits-1bn-to-partners-group-private-credit-strategy/", srcName: "Private Equity Wire" },
        { html: "<strong>Credit &mdash; Audax Private Debt raised a record $7.6bn in 2025</strong>: Audax Private Debt raised around $7.6bn from global investors in 2025 &mdash; the highest annual total in the New York firm's history, taking total capital raised since inception to roughly $44bn &mdash; deploying $7.3bn across 450 transactions and issuing $3.2bn across six CLOs.", src: "https://alternativecreditinvestor.com/2026/03/05/audax-private-debt-raises-record-7-6bn-in-2025/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Travers Smith advises August Equity on the sale of Hallmarq Veterinary Imaging</strong>: Travers Smith advised August Equity on its exit from veterinary-imaging group Hallmarq to funds advised by NORD Holding, backing a strategic combination with OR Technology to build a global multimodality veterinary-imaging group.", src: "https://www.traverssmith.com/knowledge/knowledge-container/travers-smith-advises-august-equity-on-the-sale-of-hallmarq-veterinary-imaging/", srcName: "Travers Smith" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-31",
      time: "12:26 BST",
      lede: "The US and Iran exchanged strikes again over the weekend &mdash; Washington hit Iranian rocket launchers on Larak Island, Tehran's IRGC retaliated against US bases in Jordan and the UAE &mdash; reviving the oil-driven inflation risk just as fed-funds futures price a fresh-cycle-high 60.4% chance of a 16 September Fed hike; London opened and stayed lower on the same overhang while the dollar held its post-Jackson Hole gains on safe-haven demand. On the desks, JANA tapped Arcmont Asset Management and Jefferies Credit Partners for a new Australian wholesale private-credit trust, Crescent Capital closed $232m for a second CLO equity fund, and Clifford Chance advised lenders on a $1bn KEXIM-backed copper-import financing.",
      bullets: [
        { html: "<strong>Macro &mdash; oil surges, shares mixed after fresh US-Iran strikes</strong>: World shares were mixed and oil jumped over 3% after US forces struck Iranian rocket launchers on the Strait of Hormuz &mdash; the first US military action in the region in a month &mdash; with Iran's IRGC claiming retaliatory strikes on US bases in Jordan and the UAE.", src: "https://www.bnnbloomberg.ca/business/economics/2026/08/31/world-shares-are-mixed-and-oil-prices-surge-after-us-strike-on-iranian-rocket-launchers/", srcName: "AP (via BNN Bloomberg)" },
        { html: "<strong>Macro &mdash; dollar holds post-Jackson Hole gains on renewed Iran safe-haven demand</strong>: The dollar index held near a two-week high as the weekend's exchange of strikes drove fresh safe-haven flows even as oil jumped and gold traded below $4,400 on the stronger dollar and higher rate-hike expectations.", src: "https://www.dailyforex.com/forex-news/2026/08/forex-today-oil-surges-31-august-2026/249145", srcName: "DailyForex" },
        { html: "<strong>Macro &mdash; FTSE falls as investors eye Iran's next move</strong>: London's FTSE 100 opened and stayed lower as investors weighed the renewed US-Iran strikes and the resulting jump in oil prices.", src: "https://www.hl.co.uk/shares/stock-market-news/market-reports/london-open-ftse-falls-as-investors-eye-irans-next-move", srcName: "Hargreaves Lansdown" },
        { html: "<strong>Credit &mdash; JANA taps Arcmont and Jefferies Credit Partners for wholesale private-credit trust</strong>: Australian asset consultant JANA launched a private-credit trust for wholesale investors (already holding A$270m) and selected Nuveen affiliate Arcmont Asset Management alongside Jefferies Credit Partners through customised mandates, targeting core middle-market corporate direct lending across the US and Europe.", src: "https://alternativecreditinvestor.com/2026/08/28/jana-launches-private-credit-trust-for-wholesale-market/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Clifford Chance advises lenders on $1bn KEXIM-backed copper financing</strong>: Clifford Chance advised the lender group on a US$1bn KEXIM-backed financing supporting copper imports into South Korea.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-lenders-on-a-us1-billion-kexim-backed-financing-supporting-copper-imports-to-south-korea.html", srcName: "Clifford Chance" },
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
