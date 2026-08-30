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
      date: "2026-08-30",
      time: "09:17 BST",
      lede: "A quiet Sunday morning kept markets parked on Fed Chair Kevin Warsh's hawkish Jackson Hole debut &mdash; inflation still \"too high\" and the Fed has \"more work to do\" &mdash; with the September hike odds hardened to roughly a coin flip, while in Westminster Chancellor John Healey is aiming for a low-drama 28 October Budget even as political heat rises around Andy Burnham's higher-spending instincts. On the desks: LuminArx and Bridge partnered on a $500m direct-lending vehicle for US retail suppliers, and Clifford Chance's latest alert has it advising lenders on a US$1bn KEXIM-backed financing for South Korean copper imports.",
      bullets: [
        { html: "<strong>Macro &mdash; Warsh's hawkish Jackson Hole debut still setting the tone</strong>: Fed Chair Kevin Warsh said this summer's cooler inflation readings \"do not tell me that underlying trends have meaningfully improved\" and that the Fed still has \"work to do\"; fed-funds futures closed the week pricing a 57.5% chance of a 16 September hike, up from 35.5% the day before, with US stocks finishing lower on the Friday session even as they closed the week higher.", src: "https://www.cnbc.com/2026/08/28/kevin-warsh-jackson-hole-fed-inflation-rate-hike.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Healey eyes a drama-free Autumn Budget</strong>: Chancellor John Healey is preparing his first Budget (28 October) around fiscal discipline as the Government's \"bedrock\", even as political heat builds around Health Secretary Andy Burnham's higher-spending instincts within the Labour Government.", src: "https://www.bloomberg.com/news/articles/2026-08-29/john-healey-seeks-drama-free-uk-budget-as-economic-heat-rises-on-burnham", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; LuminArx and Bridge partner on $500m direct-lending fund</strong>: LuminArx Capital Management and fintech lending platform Bridge (a 2023 Citi spin-out) announced a $500m financing partnership funding US consumer-packaged-goods brands and retail suppliers to majors including Walmart, Sam's Club and Best Buy, pairing Bridge's AI-driven underwriting with LuminArx's credit capital.", src: "https://alternativecreditinvestor.com/2026/08/27/bridge-launches-500m-direct-lending-fund-for-us-retail-suppliers/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Clifford Chance advises on $1bn KEXIM-backed copper financing</strong>: Clifford Chance's Dubai team advised a lender group &mdash; KEXIM, KEXIM Global (Singapore), KEXIM Asia, JPMorgan Chase Bank (London) and Banco Santander &mdash; on a US$1bn export financing to a global diversified natural-resources company, structured to secure copper supply for Korean industry.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-lenders-on-a-us1-billion-kexim-backed-financing-supporting-copper-imports-to-south-korea.html", srcName: "Clifford Chance" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-30",
      time: "12:28 BST",
      lede: "Warsh's hawkish Jackson Hole debut is still the dominant macro thread into the weekend &mdash; a Washington Post read has the Fed's key inflation gauge still elevated and BoE Governor Bailey playing down second-round UK inflation risk ahead of the next rate decision; on the desks, Beechbrook Capital backed a UK IFA-network buy-and-build, Fair Oaks Capital's pioneering European CLO ETF surfaced in a historical sweep, Clifford Chance and Kirkland logged fresh acquisition-financing mandates, and the High Court (Ch) dismissed a director's bid to set aside a &pound;400k statutory demand in Doubtfire v Horrell.",
      bullets: [
        { html: "<strong>Macro &mdash; inflation gauge still elevated, Warsh signalling more hikes may be needed</strong>: The Washington Post's inflation read has price pressures staying high even as the Fed's new chair Kevin Warsh signals additional rate hikes may be required, extending the market repricing that began at Jackson Hole.", src: "https://www.washingtonpost.com/business/2026/08/29/inflation-economy-iran-trump-fed-warsh/81be75d2-a3b3-11f1-8606-1d40ad00172e_story.html", srcName: "The Washington Post" },
        { html: "<strong>Macro &mdash; Bailey downplays second-round UK inflation before BoE decision</strong>: Bank of England Governor Andrew Bailey said the UK is not seeing significant second-round inflation effects ahead of the Bank's next rate decision, tempering hawkish repricing of the BoE's own path.", src: "https://www.bloomberg.com/news/articles/2026-08-28/boe-s-bailey-downplays-second-round-effects-before-rate-decision", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Beechbrook backs Corbel Partners buy-and-build</strong>: Beechbrook Capital provided over &pound;10m of acquisition financing to Corbel Partners, a Warrington-based UK IFA network with c.180 advisers managing &pound;2.4bn of client assets, to fund a five-year programme targeting nearly 450 advisers and turnover past &pound;60m.", src: "https://www.professionaladviser.com/news/4524156/corbel-partners-secures-10m-fund-major-acquisition-programme", srcName: "Professional Adviser" },
        { html: "<strong>Credit &mdash; Fair Oaks' pioneering European CLO ETF</strong>: A historical sweep surfaced Fair Oaks Capital's launch of the industry's first European-domiciled, euro-denominated CLO ETF &mdash; a UCITS share class investing only in AAA-rated CLOs &mdash; which went on to list on Deutsche B&ouml;rse Xetra and the London Stock Exchange as FAAA.", src: "https://www.prnewswire.com/news-releases/fair-oaks-capital-announces-launch-of-first-european-domiciled-clo-etf-302234055.html", srcName: "PR Newswire" },
        { html: "<strong>Legal &mdash; Clifford Chance and Kirkland log fresh financing mandates</strong>: Clifford Chance advised the lender group financing Intersnack Group's c.US$920m take-private of Utz Brands, while Kirkland &amp; Ellis advised Crestline Investors and Canyon Partners on the private-credit financing backing NEOTech's acquisition of defense-sector manufacturer Virtex.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-lenders-on-financing-for-intersnacks-take-private-of-utz-brands.html", srcName: "Clifford Chance" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-30",
      time: "21:21 BST",
      lede: "The week ahead's macro hinge is Friday's jobs report and Broadcom earnings sitting on top of Warsh's hawkish Jackson Hole tone, while sterling forecasters see the BoE skipping a hike at its next meeting despite rising November odds; on the desks, Australian asset consultant JANA tapped Arcmont Asset Management and Jefferies Credit Partners for mandates in a new wholesale private-credit trust, and Cleary Gottlieb logged advising the underwriter group on The Bank of New York's $2bn medium-term notes offering.",
      bullets: [
        { html: "<strong>Macro &mdash; jobs report and Broadcom earnings are the week's next hurdles</strong>: CNBC's week-ahead preview flags Friday's US jobs report and Broadcom's results as the next tests for the stock market's rally, on top of the market repricing that followed Fed Chair Warsh's hawkish Jackson Hole tone.", src: "https://www.cnbc.com/2026/08/30/here-are-the-3-big-things-were-watching-in-the-stock-market-in-the-week-ahead.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; sterling forecast sees BoE holding despite rising November hike risk</strong>: Exchange Rates UK's latest pound forecast has the Bank of England skipping a hike at its next meeting even as the odds of a November move build, with Governor Bailey having already downplayed second-round UK inflation risk.", src: "https://www.exchangerates.org.uk/news/47047/2026-08-30-british-pound-forecast-boe-to-hold-despite-rising-november-hike-risk.html", srcName: "Exchange Rates UK" },
        { html: "<strong>Credit &mdash; JANA taps Arcmont and Jefferies Credit Partners for wholesale private-credit trust</strong>: Australian asset consultant JANA launched a private-credit trust for wholesale investors (already holding A$270m) and selected Nuveen affiliate Arcmont Asset Management alongside Jefferies Credit Partners through customised mandates, targeting core middle-market corporate direct lending across the US and Europe.", src: "https://alternativecreditinvestor.com/2026/08/28/jana-launches-private-credit-trust-for-wholesale-market/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Cleary Gottlieb advises underwriters on Bank of New York's $2bn notes offering</strong>: Cleary Gottlieb represented the underwriter group &mdash; BofA Securities, Citigroup Global Markets, Wells Fargo Securities, Samuel A. Ramirez &amp; Company and BNY Mellon Capital Markets &mdash; on The Bank of New York's $2bn three-series medium-term bank notes offering across 2028 and 2029 maturities, which priced 17 August 2026.", src: "https://www.clearygottlieb.com/news-and-insights/news-listing/the-bank-of-new-yorks-2-billion-offering-aug-2026", srcName: "Cleary Gottlieb" },
      ],
    },
  },
};
