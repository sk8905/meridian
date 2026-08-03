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
      date: "2026-08-03",
      time: "21:27 BST",
      lede: "Wall Street closed at a record as Trump's cancelled Iran strikes and the coordinated US-Japan yen intervention drove a broad risk-on session and US manufacturing expanded for a seventh straight month, AstraZeneca extended its slide on Bristol Myers Squibb tie-up reports to drag the FTSE 100 lower, Brookfield completed full ownership of Oaktree Capital Management, and Freshfields advised IG Group Holdings on a $1.3bn acquisition of prediction-markets operator Underdog Holdings.",
      bullets: [
        { html: "<strong>Markets</strong>: the Dow closed at a record 53,178.41 (+693.38, +1.32%), the S&amp;P 500 gained 1.48% to 7,600.50 and the Nasdaq jumped 2.13%, with Meta up 6% and Amazon topping a $3tn market cap, as oil's slide on Trump's cancelled Iran strikes drove the risk-on session.", src: "https://qz.com/dow-700-points-trump-iran-strikes-oil-prices-080326", srcName: "Quartz" },
        { html: "<strong>ISM</strong>: US manufacturing activity expanded for a seventh straight month &mdash; the headline index rose 2.3 points to 55.6%, its highest since May 2022, with New Orders up to 56.7% and Employment improving to 52.8% from 49.7%, beating the ~54% consensus.", src: "https://www.prnewswire.com/news-releases/manufacturing-pmi-at-55-6-july-2026-ism-manufacturing-pmi-report-302840669.html", srcName: "PR Newswire / ISM" },
        { html: "<strong>UK &amp; M&amp;A</strong>: the FTSE 100 closed down 0.1% at 10,857.70 &mdash; a third straight losing session &mdash; as AstraZeneca slumped 9.0% on a cautious reaction to reported $400bn tie-up talks with Bristol Myers Squibb, even as the mid-cap FTSE 250 rose almost 1%.", src: "https://www.marketscreener.com/news/ftse-100-slips-as-astrazeneca-drops-on-bristol-myers-merger-talks-ce7f50d9d989f024", srcName: "MarketScreener" },
        { html: "<strong>Private credit</strong>: Brookfield completed its roughly $3bn acquisition of the ~26% of Oaktree Capital Management it did not already own, taking full ownership and folding Oaktree into Brookfield's global credit platform (now $365bn combined) &mdash; the next step in a partnership dating to 2019.", src: "https://www.globenewswire.com/news-release/2026/08/03/3337342/0/en/Brookfield-Completes-Acquisition-of-Oaktree.html", srcName: "GlobeNewswire" },
        { html: "<strong>Legal &mdash; corporate</strong>: Freshfields advised IG Group Holdings on its agreed $1.3bn acquisition of Underdog Holdings, a US daily fantasy sports and prediction-markets operator, structured as $1.1bn upfront plus a $200m earnout and following IG's March 2026 strategic review.", src: "https://www.freshfields.com/en/our-thinking/news/news-search/2026/08/freshfields-advises-ig-group-holdings-plc-on-its-$1.3bn-acquisition-of-underdog-holdings-inc", srcName: "Freshfields" },
      ],
    },
  },
};
