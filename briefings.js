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
      date: "2026-08-27",
      time: "09:29 BST",
      lede: "Nasdaq 100 futures rose about 1% after Nvidia's after-the-close beat and bullish sales guidance, with Salesforce and CrowdStrike also beating and raising guidance, ahead of Friday's Jackson Hole keynote from Fed Chair Warsh; Ofgem confirmed the October-December energy price cap will rise only 4% (to £1,723), a smaller-than-feared increase that eases one near-term UK inflation risk; in credit, CVC Credit priced Apidos LVI, its first new CLO of 2026, and Star Mountain Capital closed an oversubscribed second SBIC fund at $286m while adding several senior hires; and in legal, Clifford Chance advised on HDFC Bank's $1.75bn dual-tranche senior notes offering via India's GIFT City, the largest US dollar bank issuance from India since 2008.",
      bullets: [
        { html: "<strong>Macro &mdash; Nvidia/Salesforce/CrowdStrike beats</strong>: Nvidia beat on both lines after Wednesday's close (adjusted EPS $2.22 vs $2.09 est, revenue $96.2bn, +105.8% y/y) and guided Q3 revenue to $105.84-110.16bn, popping 4.7% after hours; Salesforce (+13% AH) and CrowdStrike (+10.5% AH) also beat and raised guidance, broadening the AI-led rally.", src: "https://www.bloomberg.com/news/articles/2026-08-26/nasdaq-futures-rise-on-bullish-nvidia-sales-growth-markets-wrap", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; UK energy price cap</strong>: Ofgem confirmed on 26 August that the typical dual-fuel price cap will rise a comparatively modest 4% (&pound;60/yr, to &pound;1,723) for October-December, well below the ~13% increase feared in July, easing one of the MPC hawks' near-term inflation arguments ahead of the 17 September decision.", src: "https://www.ofgem.gov.uk/press-release/energy-price-cap-will-rise-4-october-2026", srcName: "Ofgem" },
        { html: "<strong>Credit &mdash; CVC Apidos LVI</strong>: CVC Credit priced Apidos LVI, a $550m US CLO arranged by BNP Paribas with a five-year reinvestment period &mdash; CVC's first new-issue CLO of 2026, roughly 70% ramped at pricing.", src: "https://www.cvc.com/media/news/2026/cvc-credit-prices-first-new-clo-of-2026/", srcName: "CVC" },
        { html: "<strong>Credit &mdash; Star Mountain Capital</strong>: Star Mountain Capital closed an oversubscribed second SBIC fund at a program-optimized $286m, and separately added Michael Karangelen, George Zahringer and Adam Fitzner as senior portfolio/investment-committee hires.", src: "https://www.businesswire.com/news/home/20260218194364/en/Star-Mountain-Capital-Announces-Final-Close-of-Its-Oversubscribed-2nd-SBIC-Fund-at-a-Program-Optimized-Level-of-$286-Million", srcName: "Business Wire" },
        { html: "<strong>Legal &mdash; Clifford Chance/HDFC Bank</strong>: Clifford Chance advised the joint bookrunners on HDFC Bank's US$1.75bn dual-tranche Rule 144A/Reg S senior notes offering via its GIFT City (IFSC) branch &mdash; the largest US dollar bank issuance from India since the 2008 financial crisis.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-on-hdfc-banks-us175-billion-senior-notes-offering-via-indias-gift-city.html", srcName: "Clifford Chance" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-26",
      time: "12:31 BST",
      lede: "US futures and Treasuries slipped as traders held back risk into Nvidia's after-the-close earnings and Wednesday's core-PCE print, while London's FTSE 100 recovered off an early dip as record copper prices lifted miners; in credit, Eagle Point Credit Management led a $1.3bn mezzanine financing on an Anthropic-anchored Texas AI data-centre campus and Nuveen Green Capital closed a $1bn+ first close for its fourth C-PACE lending fund; and in legal, Ropes &amp; Gray and Kirkland advised opposite sides of the Dragoneer/KKR/Amwins AUD$7.7bn take-private of Steadfast Group.",
      bullets: [
        { html: "<strong>Macro &mdash; US futures/Nvidia/PCE</strong>: S&amp;P 500 and Nasdaq 100 futures eased and Treasuries retreated across the curve as traders held back risk ahead of Nvidia's after-the-close results and Wednesday's core-PCE print.", src: "https://www.bloomberg.com/news/articles/2026-08-25/asian-stocks-set-to-gain-as-oil-extends-declines-markets-wrap", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; FTSE/miners</strong>: London's FTSE 100 recovered from an early dip to trade broadly flat near 10,880 as record copper prices lifted miners Fresnillo and Antofagasta, offsetting a fresh Brent slide that dragged BP and Shell lower.", src: "https://uk.finance.yahoo.com/news/ftse-100-live-london-set-055600616.html", srcName: "Yahoo Finance UK" },
        { html: "<strong>Credit &mdash; Eagle Point/Anthropic data centre</strong>: Eagle Point Credit Management provided roughly $1.3bn of mezzanine debt in a $16bn project-finance package for Nexus Data Centers' Anthropic-anchored AI campus in Hubbard, Texas.", src: "https://www.bloomberg.com/news/articles/2026-08-19/anthropic-tied-data-center-inks-1-3-billion-private-credit-loan", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Nuveen Green Capital</strong>: Nuveen Green Capital secured a first close exceeding $1bn in new commitments for the fourth vintage of its C-PACE lending fund series.", src: "https://www.prnewswire.com/news-releases/nuveen-announces-closing-of-the-fourth-vintage-of-cpace-lending-fund-series-bringing-total-commitments-to-over-3-billion-since-inception-in-2023-302858381.html", srcName: "PR Newswire" },
        { html: "<strong>Legal &mdash; Steadfast Group take-private</strong>: Ropes &amp; Gray advised Dragoneer Investment Group and Kirkland &amp; Ellis advised KKR/Dragoneer's debt financing on the consortium's agreed AUD$7.7bn (US$5.52bn) take-private of Steadfast Group, Australia's largest insurance broker network.", src: "https://www.ropesgray.com/en/news-and-events/news/2026/08/ropes-gray-advised-dragoneer-investment-group-in-take-private-of-steadfast-group", srcName: "Ropes & Gray" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-26",
      time: "21:21 BST",
      lede: "Dollar and bond markets stayed \"on edge\" heading into Friday's Jackson Hole keynote as Treasury Secretary Bessent's bond-buyback intervention piled pressure on incoming Fed Chair Kevin Warsh, US consumers pulled back on spending in July even as price pressures persisted, and London's FTSE 100 fought through a fresh Brent oil rout as record copper prices lifted miners — with Nvidia, CrowdStrike and Salesforce all due to report after today's US close.",
      bullets: [
        { html: "<strong>Macro &mdash; Jackson Hole/dollar</strong>: Dollar and bond markets stayed &ldquo;on edge&rdquo; as Treasury Secretary Bessent's bond-buyback intervention piled pressure on incoming Fed Chair Kevin Warsh ahead of Friday's Jackson Hole keynote.", src: "https://www.cnbc.com/2026/08/26/jackson-hole-warsh-bessent-bonds-treasury-dollar.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; US PCE/consumer spending</strong>: US consumers pulled back on spending in July even as price pressures persisted, the latest core-PCE release showed, leaving September Fed rate-hike odds little changed.", src: "https://www.cnn.com/2026/08/26/economy/pce-consumer-spending-inflation-july", srcName: "CNN" },
        { html: "<strong>Macro &mdash; Nvidia earnings watch</strong>: The S&amp;P 500 nudged up ahead of today's after-the-close results from Nvidia, CrowdStrike and Salesforce, with Nvidia's report seen as the next major catalyst for AI-linked equities.", src: "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-aug-26-2026", srcName: "TheStreet" },
        { html: "<strong>Macro &mdash; FTSE/oil</strong>: London's FTSE 100 fought through a fresh Brent oil rout as record copper prices lifted miners, offsetting declines in BP and Shell.", src: "https://invezz.com/en-ae/news/2026/08/26/ftse-100-battles-through-oil-rout-as-miners-rescue-london-from-bp-and-shell/", srcName: "Invezz" },
      ],
    },
  },
};
