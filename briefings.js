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
      time: "05:33 BST",
      lede: "Japan and the US staged their first coordinated yen intervention since 2011 as Trump&rsquo;s cancelled Iran strikes and a promised Monday resumption of talks sent Brent down as much as 6% at the Asian open, OPEC+ agreed a further September output hike, HSBC Asset Management closed a second UK direct-lending fund at $2bn, and Latham &amp; Watkins advised on Booz Allen Hamilton&rsquo;s $1.2bn senior notes offering.",
      bullets: [
        { html: "<strong>Yen intervention</strong>: Japan confirmed it intervened jointly with the US to shore up a slumping yen &mdash; the first coordinated US-Japan action since 2011, with Tokyo estimated to have sold as much as $58.97bn to buy yen &mdash; and the currency strengthened more than 1% against both the dollar and euro.", src: "https://www.bloomberg.com/news/articles/2026-08-03/japan-vows-to-intervene-again-with-us-over-yen-if-needed", srcName: "Bloomberg" },
        { html: "<strong>Iran</strong>: Trump says talks with Iran are set to resume Monday after he cancelled a planned new wave of strikes and hinted at an imminent Strait of Hormuz reopening deal; Brent fell as much as 6% at Monday&rsquo;s Asian open to ~$84.41 even as unconfirmed reports of a fresh Iranian attack near a US tanker undercut the de-escalation narrative.", src: "https://www.cnbc.com/2026/08/03/trump-says-iran-talks-to-resume-monday-after-calling-off-planned-strikes.html", srcName: "CNBC" },
        { html: "<strong>OPEC+</strong>: the group agreed to raise output quotas by 188,000 bpd for September, completing the phased unwind of the 1.65m bpd voluntary cuts first agreed in 2023, while signalling a pause in further increases through Q4.", src: "https://www.cnbc.com/2026/08/02/opec-agrees-september-oil-hike-completing-rollback-of-voluntary-cuts.html", srcName: "CNBC" },
        { html: "<strong>Private credit</strong>: HSBC Asset Management held final close of its second UK Direct Lending fund at $2bn (&pound;1.48bn) &mdash; roughly double its predecessor vintage &mdash; from a globally diverse institutional base.", src: "https://alternativecreditinvestor.com/2026/06/05/hsbc-am-closes-second-uk-direct-lending-vintage-at-2bn/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; banking</strong>: Latham &amp; Watkins advised the underwriters on Booz Allen Hamilton&rsquo;s two-tranche $1.2bn senior notes offering ($700m due 2030, $500m due 2034), guaranteed by Booz Allen Hamilton Holding Corporation, with closing expected 4 August.", src: "https://www.lw.com/en/news/2026/07/latham-watkins-advises-on-booz-allen-hamilton-senior-notes-offering", srcName: "Latham &amp; Watkins" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-02",
      time: "12:10 BST",
      lede: "Trump says the US is cancelling a planned new wave of strikes on Iran after &ldquo;the perimeters of a deal&rdquo; were agreed, Chancellor John Healey and Andy Burnham warned Labour ministers to prepare for budget cuts ahead of the 28 October Budget, Revolut added Apollo and Ares to its new European retail private-markets ELTIF, and Simmons &amp; Simmons advised on Europe&rsquo;s first tokenised securitisation.",
      bullets: [
        { html: "<strong>Iran</strong>: Trump says the US is cancelling a planned new wave of strikes on Iranian targets, citing progress toward &ldquo;the perimeters of a deal&rdquo; to end the conflict after Middle East allies requested restraint.", src: "https://www.bloomberg.com/news/articles/2026-08-02/trump-says-us-to-cancel-iran-attack-subject-to-a-rapid-deal", srcName: "Bloomberg" },
        { html: "<strong>UK Budget</strong>: Chancellor John Healey and Mayor Andy Burnham warned Labour ministers to prepare for spending cuts as departments brace for a tight 28 October Budget.", src: "https://www.gbnews.com/politics/john-healey-andy-burnham-labour-ministers-budget-cuts", srcName: "GB News" },
        { html: "<strong>UK housing</strong>: annual UK house-price growth slowed to 1.8% in July, Nationwide data showed, as affordability pressure continues to weigh on the market.", src: "https://www.mortgagesolutions.co.uk/mortgage-news/2026/07/31/slowdown-in-uk-annual-house-price-growth-to-1-8-in-july-nationwide/", srcName: "Mortgage Solutions" },
        { html: "<strong>Private credit</strong>: Revolut said it will offer EU retail customers access to private-markets funds for as little as &euro;1 via new ELTIF 2.0 feeder funds, with Apollo and Ares named among the managers selected alongside Partners Group and Hamilton Lane.", src: "https://www.bloomberg.com/news/articles/2026-07-27/revolut-to-offer-clients-apollo-ares-funds-for-as-little-as-1", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; banking</strong>: Simmons &amp; Simmons advised on what it says is Europe&rsquo;s first tokenised securitisation, a landmark deal for digital-asset structuring in the region.", src: "https://www.simmons-simmons.com/en/about-us/news/simmons-simmons-advises-on-europe-s-first-tokenised-securitisation", srcName: "Simmons &amp; Simmons" },
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
