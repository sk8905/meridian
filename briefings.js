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
      date: "2026-08-09",
      time: "09:23 BST",
      lede: "Iran set out formal terms for reopening the Strait of Hormuz as an Oman-mediated temporary transit deal was reported close, while a wave of cyberattacks hit Point72, Millennium, Citadel and Two Sigma and Millennium separately partnered with Anthropic to build an AI risk analyst; on the legal wire, White &amp; Case advised Alimentation Couche-Tard on its US$8.6bn acquisition of &#379;abka and Weil completed Brookfield's buyout of Oaktree's remaining stake, while Blackstone Credit &amp; Insurance's $1.3bn Paratek/Radius financing and Apollo's curbed $25bn Debt Solutions fund withdrawals were backfilled onto Credit's deal and intel rosters.",
      bullets: [
        { html: "<strong>Markets &mdash; Iran/Hormuz</strong>: Iran's national security chief set out formal demands for reopening the Strait of Hormuz &mdash; lifting the US naval blockade, withdrawing forces, ending the war, compensation and releasing frozen Iranian assets &mdash; as Iran and Oman said a temporary transit-route deal is 'very close' but won't mean an immediate reopening.", src: "https://us.cnn.com/2026/08/09/world/live-news/iran-war-trump", srcName: "CNN" },
        { html: "<strong>Hedge funds &mdash; cybersecurity</strong>: Point72, Millennium, Citadel and Two Sigma were targeted in a wave of attempted cyberattacks, underscoring the sector's growing exposure as AI tooling expands its attack surface.", src: "https://fortune.com/2026/08/06/major-hedge-funds-targeted-in-wave-of-attempted-cyberattacks/", srcName: "Fortune" },
        { html: "<strong>Hedge funds &mdash; AI</strong>: Millennium partnered with Anthropic to build an in-house AI risk analyst, the latest large multi-strat manager to formalise an AI partnership for portfolio risk management.", src: "https://www.bloomberg.com/news/articles/2026-08-06/millennium-partners-with-anthropic-to-develop-ai-risk-analyst", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; corporate</strong>: White &amp; Case advised Alimentation Couche-Tard on its landmark US$8.6bn acquisition of Polish retailer &#379;abka Group, while Weil advised Brookfield on completing its acquisition of Oaktree's remaining stake and Kirkland advised Nordic Capital on acquiring BWXT Medical.", src: "https://www.whitecase.com/news/press-release/white-case-advises-alimentation-couche-tard-landmark-us86-billion-acquisition", srcName: "White & Case" },
        { html: "<strong>Credit &mdash; backfilled deal/intel</strong>: Blackstone Credit &amp; Insurance's $1.3bn financing backing the Paratek Pharmaceuticals/Radius Health combination and Apollo's curbed withdrawals from its $25bn Debt Solutions fund (redemption requests hit 17%) were added to the historical record, alongside Mubadala Capital's completed integration of its $25bn credit business for third-party investors.", src: "https://www.cnbc.com/2026/06/23/apollo-private-credit-fund-withdrawals-redemptions.html", srcName: "CNBC" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-09",
      time: "12:28 BST",
      lede: "A quiet Sunday wire: Iran continued to attach conditions &mdash; lifting the US naval blockade, troop withdrawal, compensation &mdash; to any Strait of Hormuz reopening even as a temporary Oman-mediated transit deal is described as close, prediction-market pricing put September Fed-hike odds at just 38% after last week's payrolls miss, Kirkland closed the $55bn Electronic Arts take-private and picked up four other US deal mandates, and CVC Credit's first new European CLO of 2026 and a King Street CLO sub-advisory mandate were backfilled onto Credit's structured-credit roster.",
      bullets: [
        { html: "<strong>Markets &mdash; Iran/Hormuz</strong>: Tehran's national-security chief kept conditions attached to reopening the Strait of Hormuz &mdash; lifting the US naval blockade, troop withdrawal, compensation &mdash; even as Iran and Oman describe a temporary shipping-transit deal as close, and the UAE said one of ADNOC's vessels was targeted by an airstrike transiting the strait.", src: "https://www.cnbc.com/2026/08/08/uae-ship-targeted-missile-us-iran-tensions-stay-high.html", srcName: "CNBC" },
        { html: "<strong>US rates</strong>: prediction-market pricing (Polymarket, via Interactive Brokers) puts September Fed-hike odds at roughly 38%, down from about 50% before Friday's shock 23,000 nonfarm-payrolls miss, with Wednesday's 12 August CPI print now the pivotal data point for Chair Warsh.", src: "https://www.interactivebrokers.com/campus/traders-insight/prediction-market/september-fed-hike-drops-to-38-from-50-after-colossal-payroll-miss/", srcName: "Interactive Brokers" },
        { html: "<strong>Legal &mdash; corporate</strong>: Kirkland advised the PIF/Silver Lake/Affinity Partners consortium on closing its $55bn take-private of Electronic Arts &mdash; billed as the largest take-private in history &mdash; and separately picked up mandates for Veritas Capital's acquisition of Greenbelt-backed Saber Power Services, Engine's acquisition of Options Travel and Continuim Equity Partners' $548m oversubscribed Fund III close.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advises-investor-consortium-on-close-of-$55-billion-acquisition-of-ea", srcName: "Kirkland & Ellis" },
        { html: "<strong>Credit &mdash; structured credit/CLO</strong>: CVC Credit's Cordatus XXXVIII &mdash; a &euro;406m vehicle and its first new European CLO issue of 2026 &mdash; and King Street affiliate Rockford Tower's interim sub-advisory mandate on CLO-debt trust XFLT were backfilled onto Credit's deal and intel rosters, both tagged to the CLOs section.", src: "https://www.cvc.com/media/news/2026/cvc-credit-prices-first-european-clo-of-2026/", srcName: "CVC" },
        { html: "<strong>Credit &mdash; personnel</strong>: Balbec Capital's April 2025 leadership transition &mdash; Peter Troisi appointed CEO with founder Charles Rusbasan moving to Executive Chairman &mdash; was backfilled onto the manager's news record during this run's rotating profile re-verification.", src: "https://www.businesswire.com/news/home/20250425958223/en/Balbec-Capital-Announces-Leadership-Transition-and-Appointment-of-Four-New-Partners", srcName: "Business Wire" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-09",
      time: "17:13 BST",
      lede: "The Pentagon gave major defence contractors 21 days to accelerate weapons production after Patriot-interceptor stocks fell more than 65% since before the Iran war, even as Tehran kept its Hormuz-reopening terms unmet and traders eye Wednesday's CPI print; on the credit wire Fortress priced a static private-credit CLO and Deutsche Bank arranged a debut SRT for renewables lender DKB, while Legal added Travers Smith's Hamberley Care Homes refinancing and Capital Group/KKR fund launch to the historical record.",
      bullets: [
        { html: "<strong>Markets &mdash; defence procurement</strong>: Deputy Defense Secretary Steve Feinberg gave major US defence contractors 21 days to lay out faster delivery schedules for air-defense sensors, interceptors and missile-tracking systems, after Patriot-interceptor stocks fell more than 65% since before the Iran war to an estimated 759-827 units.", src: "https://www.cnbc.com/2026/08/09/pentagon-defense-contractors-weapons-production.html", srcName: "CNBC" },
        { html: "<strong>Markets &mdash; Iran/Hormuz</strong>: Iran's Supreme National Security Council said the Strait of Hormuz will not fully reopen until the US 'corrects its behaviour', even as Tehran and Oman describe a separate transit-route deal as nearing its final stages.", src: "https://www.bloomberg.com/news/articles/2026-08-09/wait-for-hormuz-deal-stretches-on-as-iran-says-terms-must-be-met", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; structured credit/CLO</strong>: Fortress became the latest manager to price a static private-credit CLO in 2026, following Blackstone, Barings and BlackRock, while Deutsche Bank Capital Solutions arranged a debut significant risk transfer for BayernLB subsidiary DKB tied to roughly &euro;2bn of German renewable-power financing loans.", src: "https://www.creditflux.com/CLOs/2026-06-17/Fortress-becomes-latest-manager-to-print-static-private-credit-CLO-in-2026", srcName: "Creditflux" },
        { html: "<strong>Legal &mdash; banking &amp; funds</strong>: Travers Smith advised Hamberley Care Homes and Patron Capital on a &pound;210m refinancing with Song Capital and separately advised Capital Group on launching its first European public-private credit fund with KKR, while Slaughter and May published its weekly financial-regulation bulletin covering the FCA's MiFIR reporting cuts and the ECB's geopolitical stress test.", src: "https://www.traverssmith.com/knowledge/knowledge-container/travers-smith-advises-hamberley-care-homes-and-patron-capital-on-hamberleys-long-term-refinancing-deal-with-song-capital/", srcName: "Travers Smith" },
        { html: "<strong>Markets &mdash; week ahead</strong>: US equities enter the week just off record highs (S&amp;P 500 +3.58% last week) with Wednesday's CPI and Thursday's PPI prints, plus earnings from CoreWeave, Cisco and Applied Materials, set to test reduced expectations for further Fed tightening.", src: "https://www.fxempire.com/forecasts/article/the-week-ahead-cpi-and-earnings-test-the-stock-market-rally-near-record-highs-1615629", srcName: "FXEmpire" },
      ],
    },
  },
};
