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
