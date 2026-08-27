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
      date: "2026-08-27",
      time: "12:39 BST",
      lede: "Treasury yields eased into Friday's Jackson Hole symposium — the first under Fed Chair Kevin Warsh — as markets digested Wednesday's Nvidia beat-and-raise and awaited weekly jobless claims; in credit, Victory Capital's $7bn deal for First Eagle/Napier Park continues to dominate the tape alongside Star Mountain Capital's newly-closed CFO I and a fresh Capula energy-trading hire; and in legal, Stephenson Harwood flagged that unregulated firms can still exploit exemptions to market minibonds to retail investors despite the FCA's latest warning.",
      bullets: [
        { html: "<strong>Macro &mdash; Treasury yields/Jackson Hole</strong>: The 10-year Treasury yield eased 2bp to 4.645% and the 30-year 2bp to 5.161% as markets awaited weekly jobless claims and the start of the Fed's Jackson Hole symposium, with CME FedWatch pricing a 36% chance of a September rate hike.", src: "https://www.cnbc.com/2026/08/27/us-bonds-us10y-jackson-hold.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; dollar/bonds on edge</strong>: Dollar and bond markets stayed on edge ahead of Friday's keynote, with Treasury Secretary Bessent's bond-buyback intervention adding pressure on Fed Chair Warsh's first major public test.", src: "https://www.cnbc.com/2026/08/26/jackson-hole-warsh-bessent-bonds-treasury-dollar.html", srcName: "CNBC" },
        { html: "<strong>Credit &mdash; Victory Capital/First Eagle</strong>: Victory Capital's agreed $7bn acquisition of First Eagle Investments &mdash; parent of private-credit manager Napier Park Global Credit &mdash; remained the desk's headline story, creating a combined group with roughly $571bn of client assets.", src: "https://www.bloomberg.com/news/articles/2026-08-26/victory-capital-agrees-to-buy-first-eagle-in-7-billion-deal", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Star Mountain/Capula</strong>: Star Mountain Capital's inaugural collateralised fund obligation, Star Mountain CFO I, reached final close with 'strong' institutional interest, while macro hedge fund Capula hired two energy traders to expand into commodities.", src: "https://alternativecreditinvestor.com/2026/08/14/star-mountain-hails-strong-institutional-interest-at-final-close-of-cfo-i/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; minibonds</strong>: Stephenson Harwood said unregulated firms can still exploit financial-promotion exemptions to market loan notes ('minibonds') to retail investors, despite the FCA's fresh 20 August warning.", src: "https://www.stephensonharwood.com/insights/minibonds-still-a-problem-or-problem-solved/", srcName: "Stephenson Harwood" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-27",
      time: "21:11 BST",
      lede: "London's FTSE 100 slid 0.8% to a three-week low of 10,792.54 as banks and energy stocks sagged on rising expectations the BoE's next hike slips into 2027, while sterling and the US trade balance both softened ahead of Fed Chair Kevin Warsh's first Jackson Hole keynote tomorrow; the legal desk logged a busy Clifford Chance/Travers Smith afternoon spanning MUFG's structured-notes programme, an Alexandria Real Estate notes offering, Eurofiber's sustainability-linked refinancing, Volkswagen's Canadian bond issuance and Peel Group's cash offer for Harworth Group.",
      bullets: [
        { html: "<strong>Macro &mdash; FTSE slips to three-week low</strong>: London's FTSE 100 fell 0.8% to 10,792.54, its steepest one-day drop in six weeks, as banks and energy stocks sagged with investors pushing the BoE's next rate hike out toward 2027.", src: "https://www.lse.co.uk/news/uks-ftse-100-hits-over-three-week-low-as-banks-energy-stocks-sag--58czwgjluqwfkfo.html", srcName: "Reuters (via lse.co.uk)" },
        { html: "<strong>Macro &mdash; US trade gap widens</strong>: The US goods-trade deficit jumped 17.2% month-on-month to $118.8bn in July, its widest since March 2025, as AI-related capital-goods imports surged while exports fell for a third straight month.", src: "https://www.bloomberg.com/news/articles/2026-08-27/us-merchandise-trade-deficit-widens-to-largest-since-march-2025", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Warsh's keynote looms</strong>: Markets are bracing for Fed Chair Kevin Warsh's first Jackson Hole keynote as chair tomorrow, with sterling slipping and gilt markets already pricing a later BoE hike path into the speech.", src: "https://www.npr.org/2026/08/27/nx-s1-5945044/federal-reserve-kevin-warsh-jackson-hole-wyoming-bond-markets", srcName: "NPR" },
        { html: "<strong>Legal &mdash; Clifford Chance's busy Thursday</strong>: CC advised on four separate matters today &mdash; MUFG's new US$4.6bn structured-notes programme, Alexandria Real Estate Equities' US$1bn junior subordinated notes offering, Eurofiber's &euro;2.2bn sustainability-linked refinancing, and Volkswagen's C$750m dual-tranche bond issuance.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-eurofiber-on-22-billion-sustainability-linked-refinancing.html", srcName: "Clifford Chance" },
        { html: "<strong>Legal &mdash; Travers Smith/Harworth</strong>: Travers Smith advised Peel Group on its &pound;582.88m cash offer for LSE-listed regeneration company Harworth Group plc, a roughly 36% premium to the three-month VWAP.", src: "https://www.traverssmith.com/knowledge/knowledge-container/travers-smith-advises-peel-group-on-its-cash-offer-for-harworth-group-plc/", srcName: "Travers Smith" },
      ],
    },
  },
};
