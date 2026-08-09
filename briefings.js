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
      time: "21:24 BST",
      lede: "Houthi rebels claimed an attack on a Saudi Aramco refinery and Iran denied any direct US talks on reopening the Strait of Hormuz, keeping an oil-supply risk premium in place ahead of Wednesday's CPI print; on the legal wire K&amp;L Gates published an alert on the London Stock Exchange's revised AIM Rules, while Credit's rotating manager re-verification backfilled OneIM's SMBC Nikko joint venture and T&amp;D Financial Life Insurance investment, Corinthia's litigation win over Barings, and Venn Partners' still-pending majority sale to USS onto the historical record.",
      bullets: [
        { html: "<strong>Markets &mdash; Iran/Hormuz</strong>: Iran denied any direct talks with the US on reopening the Strait of Hormuz, while Houthi rebels claimed an attack on a Saudi Aramco refinery, adding a fresh supply-risk premium to oil even as a fire at the site was brought under control.", src: "https://www.cnbc.com/2026/08/09/saudi-aramco-extinguishes-refinery-fire-houthis-claim-attack.html", srcName: "CNBC" },
        { html: "<strong>Markets &mdash; defence procurement</strong>: Deputy Defense Secretary Steve Feinberg gave major US defence contractors 21 days to lay out faster delivery schedules for air-defense sensors, interceptors and missile-tracking systems, after Patriot-interceptor stocks fell more than 65% since before the Iran war to an estimated 759-827 units.", src: "https://www.cnbc.com/2026/08/09/pentagon-defense-contractors-weapons-production.html", srcName: "CNBC" },
        { html: "<strong>Legal &mdash; corporate</strong>: K&amp;L Gates published a client alert on the London Stock Exchange's revised AIM Rules for Companies (effective 5 August 2026), which streamline admission documentation, add a new 'Capital Access Window' fundraising route and clarify reverse-takeover thresholds.", src: "https://www.klgates.com/thought-leadership/The-New-AIM-Rules-Key-Changes-for-Companies-8-7-2026", srcName: "K&amp;L Gates" },
        { html: "<strong>Credit &mdash; manager profiles</strong>: this run's rotating re-verification backfilled OneIM's new strategic joint venture with SMBC Nikko and its investment in T&amp;D Financial Life Insurance, confirmed Corinthia's litigation win dismissing Barings' claims against its Fowler/Tucker hires, and re-confirmed Venn Partners' still-unclosed majority sale to USS first announced in April.", src: "https://www.mingtiandi.com/real-estate/finance/esr-selling-stake-in-uk-private-credit-platform-in-latest-exit-from-ara-legacy-businesses/", srcName: "Mingtiandi" },
        { html: "<strong>US rates</strong>: prediction markets and Fed funds futures continue to price a hold as the base case for September after July's 23,000 nonfarm-payrolls miss, with three FOMC dissenters warning that delaying a hike risks more aggressive tightening later &mdash; Wednesday's CPI print is now the pivotal data point.", src: "https://www.bloomberg.com/news/articles/2026-08-07/fed-split-on-rate-hikes-deepens-as-high-inflation-tests-patience", srcName: "Bloomberg" },
      ],
    },
  },
};
