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
      date: "2026-08-03",
      time: "09:24 BST",
      lede: "Japan and the US staged their first coordinated yen intervention since 2011 as Trump&rsquo;s cancelled Iran strikes and a promised Monday resumption of talks sent Brent down as much as 6% at the Asian open, Flutter Entertainment delisted from the London Stock Exchange to trade solely on the NYSE, Brigade Capital Management closed its $1bn debut private-credit fund, and Latham &amp; Watkins advised on Booz Allen Hamilton&rsquo;s $1.2bn senior notes offering.",
      bullets: [
        { html: "<strong>Yen intervention</strong>: Japan confirmed it intervened jointly with the US to shore up a slumping yen &mdash; the first coordinated US-Japan action since 2011, with Tokyo estimated to have sold as much as $58.97bn to buy yen &mdash; and the currency strengthened more than 1% against both the dollar and euro.", src: "https://www.bloomberg.com/news/articles/2026-08-03/japan-vows-to-intervene-again-with-us-over-yen-if-needed", srcName: "Bloomberg" },
        { html: "<strong>Iran</strong>: Trump says talks with Iran are set to resume Monday after he cancelled a planned new wave of strikes and hinted at an imminent Strait of Hormuz reopening deal; Brent fell as much as 6% at Monday&rsquo;s Asian open to ~$84.41 even as unconfirmed reports of a fresh Iranian attack near a US tanker undercut the de-escalation narrative.", src: "https://www.cnbc.com/2026/08/03/trump-says-iran-talks-to-resume-monday-after-calling-off-planned-strikes.html", srcName: "CNBC" },
        { html: "<strong>Markets</strong>: Flutter Entertainment&rsquo;s ordinary shares ceased trading on the London Stock Exchange today, with the FanDuel owner citing thin UK trading activity and the added cost of a dual listing; the stock continues trading solely on the NYSE under FLUT.", src: "https://www.investing.com/news/company-news/flutter-entertainment-to-delist-from-london-stock-exchange-93CH-4738938", srcName: "Investing.com" },
        { html: "<strong>Private credit</strong>: Brigade Capital Management closed its debut Brigade Private Credit Solutions Fund oversubscribed at over $1bn, targeting lending to lower-to-middle-market and non-sponsor US borrowers alongside select opportunistic investments.", src: "https://www.brigadecapital.com/article/brigade_capital_management_closes_1_billion_inaugural_private_credit_fund", srcName: "Brigade Capital Management" },
        { html: "<strong>Legal &mdash; banking</strong>: Latham &amp; Watkins advised the underwriters on Booz Allen Hamilton&rsquo;s two-tranche $1.2bn senior notes offering ($700m due 2030, $500m due 2034), guaranteed by Booz Allen Hamilton Holding Corporation, with closing expected 4 August.", src: "https://www.lw.com/en/news/2026/07/latham-watkins-advises-on-booz-allen-hamilton-senior-notes-offering", srcName: "Latham &amp; Watkins" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-03",
      time: "12:10 BST",
      lede: "Iran denied Trump&rsquo;s claim that talks would resume Monday even as gold and the yen firmed and oil extended its slide after the coordinated US-Japan currency intervention, UK gilt yields eased to a one-week low, HPS Investment Partners&rsquo; AUM rose to $197bn as of 30 June, and the week ahead brings the July US jobs report alongside HSBC, BP, AMD and SpaceX&rsquo;s first results since its IPO.",
      bullets: [
        { html: "<strong>Iran</strong>: Tehran&rsquo;s foreign ministry said it &ldquo;currently do[es] not have negotiations with America&rdquo; and has no delegation planned in the coming days, directly contradicting Trump&rsquo;s claim that talks would resume Monday afternoon &mdash; Iran says its only live discussions are with Oman over a temporary safe route through the Strait of Hormuz.", src: "https://www.nbcnews.com/world/iran/trump-iran-talks-attacks-canceled-hormuz-nuclear-rcna590535", srcName: "NBC News" },
        { html: "<strong>FX &amp; gold</strong>: the dollar dropped about 1% to ¥156.34 after Japan&rsquo;s finance ministry confirmed it bought yen in coordination with the US Treasury &mdash; the first joint US-Japan intervention since 2011 &mdash; while gold firmed as the softer oil price trimmed US rate-hike expectations.", src: "https://www.houstonpublicmedia.org/npr/2026/08/03/g-s1-136866/u-s-dollar-weakens-sharply-against-the-japanese-yen-after-market-interventions/", srcName: "NPR (Houston Public Media)" },
        { html: "<strong>UK gilts</strong>: yields eased to a one-week low as oil pulled back sharply from last week&rsquo;s highs above $100/bbl following the US pause on Iran strikes; no economist in a Reuters poll expects the BoE to move off 3.75% at its next meeting.", src: "https://www.lse.co.uk/news/uk-bond-yields-fall-to-one-week-low-as-oil-prices-retreat-lq55khkk4vjd8di.html", srcName: "Reuters (via LSE.co.uk)" },
        { html: "<strong>Private credit</strong>: HPS Investment Partners (BlackRock) now manages ~$197bn across private and liquid credit as of 30 June 2026, up from $193bn at 31 March, per the firm&rsquo;s own disclosure.", src: "https://www.hpspartners.com/", srcName: "HPS Investment Partners" },
        { html: "<strong>Week ahead</strong>: US labour data headlines the week &mdash; Tuesday&rsquo;s JOLTS and Friday&rsquo;s nonfarm payrolls &mdash; alongside ISM manufacturing/services surveys, with SpaceX due to report its first-ever quarterly results as a public company Tuesday alongside HSBC, BP and AMD.", src: "https://www.ig.com/en/news-and-trade-ideas/weekly-market-navigator-3-aug-2026-260803", srcName: "IG International" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-02",
      time: "21:20 BST",
      lede: "Trump's claimed &ldquo;total&rdquo; reopening of the Strait of Hormuz remains unconfirmed on the ground as Iran's defence ministry calls the US pullback &ldquo;psychological operations&rdquo;; the Court of Appeal backed jurisdiction in Sucden Financial's fraud claim over a nickel-cathode bill of lading, with Macfarlanes acting for the successful appellant; Golub Capital, HSBC Asset Management and Schroders Capital co-led a $790m continuation vehicle for Solace; and Wall Street heads into next week bracing for the July jobs report after a blockbuster Amazon quarter.",
      bullets: [
        { html: "<strong>Iran</strong>: despite Trump's claim of Iranian agreement to an &ldquo;immediate, complete and total&rdquo; opening of the Strait of Hormuz, Iran's defence minister dismissed the US pullback from strikes as &ldquo;psychological operations,&rdquo; and mediators Pakistan, Qatar, Oman and Turkey have yet to produce a breakthrough on how shipping traffic will be managed.", src: "https://www.aljazeera.com/news/2026/8/2/no-breakthrough-on-strait-of-hormuz-as-trump-halts-attack-on-iran", srcName: "Al Jazeera" },
        { html: "<strong>Legal &mdash; banking</strong>: the Court of Appeal upheld jurisdiction over Sucden Financial's fraud claim that it was induced to forbear enforcing a debt over an allegedly fraudulent nickel-cathode bill of lading, applying the Tort Damage Gateway since the debt was payable &mdash; and the loss sustained &mdash; in England; Macfarlanes acted for the successful appellant.", src: "https://www.bailii.org/ew/cases/EWCA/Civ/2026/986.html", srcName: "BAILII" },
        { html: "<strong>Private credit</strong>: Bridge Growth Partners closed a $790m single-asset continuation vehicle for Solace, co-led by Apogem Capital, Golub Capital, HSBC Asset Management and Schroders Capital &mdash; Bridge Growth Partners III's inaugural investment.", src: "https://www.alternativeswatch.com/2026/05/06/bridge-growth-continuation-vehicle-solace-apogem-golub-schroders/", srcName: "Alternatives Watch" },
        { html: "<strong>UK Budget</strong>: Chancellor John Healey confirmed his first Budget for 28 October, with economists including Julian Jessop calling sizeable tax rises &ldquo;pretty much guaranteed&rdquo; given an estimated &pound;22bn fiscal hole.", src: "https://www.gbnews.com/money/john-healey-s-first-budget-date-confirmed", srcName: "GB News" },
        { html: "<strong>Rates</strong>: CNBC's read of Chair Warsh's press conference argues markets are underweighting how hawkish his own language was even as equities rallied on the Fed's hold &mdash; a reminder the September meeting is still genuinely contested after the FOMC's first three-way hawkish dissent since 2016.", src: "https://www.cnbc.com/2026/07/31/kevin-warsh-fed-inflation-rate-hike-markets.html", srcName: "CNBC" },
      ],
    },
  },
};
