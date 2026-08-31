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
      date: "2026-08-31",
      time: "09:36 BST",
      lede: "Fed hike odds hit a fresh-cycle high after Iran retaliated for the weekend's Larak Island strike with attacks on US bases in Jordan and the UAE, reviving the oil-driven inflation risk just as Deutsche Bank turned hawkish on the Fed's path. On the desks, Ares closed its $8.3bn ASOF III opportunistic-credit fund and Weil guided Sunstream USA through a $1.1bn restructuring of Parallel.",
      bullets: [
        { html: "<strong>Macro &mdash; Fed hike odds hit fresh-cycle high of 60.4% after Iran escalation</strong>: Fed-funds futures priced a 60.4% probability of a 16 September hike Monday morning (CME FedWatch), up from ~56% Friday, after the weekend's Larak Island strike and Iran's retaliation revived the oil-driven inflation risk &mdash; Deutsche Bank now expects hikes at both the September and December FOMC meetings.", src: "https://www.cnbc.com/2026/08/31/jackson-hole-fed-chair-kevin-warsh-hawkish-rate-hikes-analysts.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Iran retaliates against US bases in Jordan and the UAE</strong>: Iran's IRGC struck US military targets at bases in Jordan and Al Minhad air base in the UAE, and said it downed a US drone over the Strait, after US forces hit two IRGC rocket launchers on Iran's Larak Island late Sunday &mdash; Washington's first military action against Iran in over a month.", src: "https://www.aljazeera.com/news/liveblog/2026/8/31/iran-war-live-irgc-attacks-us-bases-in-jordan-after-us-bombs-larak-island", srcName: "Al Jazeera" },
        { html: "<strong>Credit &mdash; Ares closes $8.3bn ASOF III, $9.8bn total for Opportunistic Credit</strong>: Ares Management closed on more than $9.8bn of capital for its Opportunistic Credit strategy, including the final closing of Ares Special Opportunities Fund III (ASOF III) with over $8.3bn in equity commitments &mdash; significantly exceeding its target and the prior vintage.", src: "https://www.businesswire.com/news/home/20260330751690/en/Ares-Raises-Over-$9.8-Billion-for-Leading-Opportunistic-Credit-Strategy", srcName: "Business Wire" },
        { html: "<strong>Legal &mdash; Weil guides Sunstream USA through $1.1bn restructuring of Parallel</strong>: Weil advised Sunstream USA through a $1.1bn restructuring of cannabis-sector lender Parallel, arising from a foreclosure process.", src: "https://www.weil.com/articles/weil-guides-sunstream-usa-through-1-point-1b-restructuring-of-parallel", srcName: "Weil" },
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
      time: "17:30 BST",
      lede: "BoE Governor Andrew Bailey, writing to G20 finance ministers as chair of the Financial Stability Board, warned that debt-fuelled AI investment and stretched valuations could together amplify a future market correction, as fed-funds futures priced a fresh-cycle-high ~62% chance of a 16 September hike and US equities slipped at midday on the weekend's Iran escalation; on the desks, EQT closed its combination with Coller Capital to form \"Coller EQT\", and Ropes &amp; Gray and Davis Polk advised on Genstar Capital's $7bn sale of First Eagle Investments to Victory Capital.",
      bullets: [
        { html: "<strong>Macro &mdash; Bailey warns G20/FSB that AI investment could amplify a market correction</strong>: Writing to G20 finance ministers as chair of the Financial Stability Board, BoE Governor Andrew Bailey warned that debt-fuelled AI investment, 'stretched' valuations and elevated sovereign-debt issuance could together amplify a future market correction, cautioning that few jurisdictions have protocols in place to manage a disorderly AI-sector correction.", src: "https://www.cityam.com/andrew-bailey-warns-markets-are-not-ready-for-the-rise-or-fall-of-ai/", srcName: "CityAM" },
        { html: "<strong>Macro &mdash; Fed hike odds hit fresh-cycle high of ~62% as US stocks slip at midday</strong>: Fed-funds futures priced a fresh-cycle-high ~62% probability of a 16 September hike Monday (CME FedWatch), up from 57.5% at Friday's Jackson Hole close, as the S&amp;P 500 fell 0.52% to 7,671.54 and the Dow fell 0.67% to 53,202.02 on the weekend's US-Iran strikes reviving the oil-driven inflation risk.", src: "https://finance.yahoo.com/markets/live/stock-market-today-monday-august-31-dow-sp-500-nasdaq-113851714.html", srcName: "Yahoo Finance" },
        { html: "<strong>Credit &mdash; EQT completes acquisition of Coller Capital, forming \"Coller EQT\"</strong>: EQT AB closed its combination with Coller Capital, acquiring 100% of the management company and GP entities roughly a quarter ahead of the mid-to-late Q3 2026 guidance Coller had given &mdash; lifting EQT's total AUM to &euro;341bn ($389bn); Jeremy Coller becomes Head of Coller EQT and joins EQT's Executive Committee.", src: "https://www.prnewswire.com/news-releases/eqt-closes-combination-with-coller-capital-302864808.html", srcName: "PR Newswire" },
        { html: "<strong>Legal &mdash; Ropes &amp; Gray and Davis Polk advise on Genstar's $7bn sale of First Eagle to Victory Capital</strong>: Ropes &amp; Gray advised Genstar Capital on its sale of First Eagle Investments to Victory Capital for $7bn, with Davis Polk advising First Eagle's management on the other side of the deal.", src: "https://www.ropesgray.com/en/news-and-events/news/2026/08/ropes-gray-advised-genstar-capital-first-eagle-investments-victory-capital", srcName: "Ropes & Gray" },
      ],
    },
  },
};
