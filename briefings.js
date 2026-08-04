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
      date: "2026-08-04",
      time: "05:12 BST",
      lede: "Palantir smashed Q2 estimates with US commercial revenue up 149% as Wall Street&rsquo;s rally kept futures near record highs, Sixth Street and Bayview Asset Management acquired UK specialist lender Castle Trust Bank from JC Flowers, A&amp;O Shearman advised Dubai Aerospace Enterprise on its roughly $9bn acquisition of Macquarie AirFinance, Kirkland &amp; Ellis advised KKR on its $5.7bn acquisition of Integer Holdings, and HSBC and BP report interim results later today.",
      bullets: [
        { html: "<strong>Palantir</strong>: Q2 results smashed Wall Street estimates as US commercial revenue surged 149% year-on-year, with shares jumping in after-hours trading and the company raising its full-year 2026 guidance.", src: "https://www.cnbc.com/2026/08/03/palantir-pltr-earnings-q2-2026.html", srcName: "CNBC" },
        { html: "<strong>Private credit</strong>: Sixth Street and Bayview Asset Management acquired UK specialist lender Castle Trust Bank, which serves more than 170,000 customers, from JC Flowers &amp; Co in a deal understood to be worth more than &pound;100m, with the pair acting as equal partners and committing additional capital to grow the bank&rsquo;s retail savings and lending franchise.", src: "https://alternativecreditinvestor.com/2026/08/03/bayview-and-sixth-street-acquire-uk-specialist-bank-castle-trust/", srcName: "AltFi / Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; corporate</strong>: A&amp;O Shearman advised Dubai Aerospace Enterprise on its roughly $9bn acquisition of Macquarie AirFinance, one of the largest aviation-leasing deals of the year.", src: "https://www.aoshearman.com/en/news/ao-shearman-represents-dubai-aerospace-enterprise-ltd-on-its-acquisition-of-macquarie-airfinance", srcName: "A&amp;O Shearman" },
        { html: "<strong>Legal &mdash; corporate</strong>: Kirkland &amp; Ellis advised KKR on its $5.7bn acquisition of Integer Holdings, a medical-device outsourcing manufacturer, and separately advised Curium on its merger with Lantheus Holdings.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advises-kkr-on-acquisition-of-integer", srcName: "Kirkland &amp; Ellis" },
        { html: "<strong>Week ahead</strong>: HSBC and BP report interim results later today, with BP&rsquo;s planned North Sea oil and gas sale in focus, ahead of AMD and SpaceX&rsquo;s first-ever results as a public company on Tuesday and Friday&rsquo;s US nonfarm payrolls report.", src: "https://www.marketscreener.com/news/uk-stocks-factors-to-watch-on-august-4-ce7c5edad88cf724", srcName: "MarketScreener (Alliance News)" },
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
