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
      date: "2026-08-20",
      time: "09:24 BST",
      lede: "Asian equities rallied hard and the dollar slid to a two-and-a-half-month low after the US Treasury doubled its long-bond buybacks, with Walmart's pre-market earnings today the next catalyst before Chair Warsh's 28 August Jackson Hole keynote; in credit, BlackRock's HPS and Brookfield's Oaktree seized control of Hollywood production-services supplier MBS Group in a restructuring wiping out up to $900m of debt, while Jefferies Credit Partners launched a &euro;1bn private-credit secondaries fund; and in legal, Kirkland advised Francisco Partners on its $650m take-private of Weave Communications.",
      bullets: [
        { html: "<strong>Macro &mdash; Asia/dollar</strong>: South Korea's Kospi surged as much as 6% (triggering a buy-side circuit breaker) and Japan's Nikkei gained around 1.2% as the Treasury's expanded long-bond buyback pulled global yields off their highs, with SK Hynix's $28.7bn buyback plan powering a sharp chip-stock rebound and the dollar index near a 2&frac12;-month low.", src: "https://www.fxstreet.com/news/asian-equities-rally-kospi-leads-gains-as-us-treasury-support-counters-fed-iran-risks-202608200357", srcName: "FXStreet" },
        { html: "<strong>Macro &mdash; Bessent/Warsh</strong>: Treasury Secretary Bessent's move to curb Treasury yields via the expanded buyback programme puts fresh pressure on incoming Fed Chair Kevin Warsh ahead of his 28 August Jackson Hole keynote and the 16 September FOMC decision.", src: "https://www.cnbc.com/2026/08/19/bessent-treasury-buybacks-yields-warsh-fed.html", srcName: "CNBC" },
        { html: "<strong>Credit &mdash; HPS/Oaktree/MBS Group</strong>: Creditors led by BlackRock's HPS Investment Partners and Brookfield-owned Oaktree Capital took over Hollywood production-services supplier MBS Group after it defaulted, converting up to $900m of debt into roughly $100m of equity and committing a further $40m, with former owners Hackman Capital Partners and Affinius Capital ousted.", src: "https://www.bloomberg.com/news/articles/2026-08-19/blackrock-oaktree-seize-movie-servicer-with-900-million-debt", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Jefferies secondaries fund</strong>: Jefferies Credit Partners is targeting around &euro;1bn ($1.16bn) for a new private-credit secondaries fund that will acquire loans from its existing direct-lending portfolio and provide fresh capital for new lending, extending its push into GP-led liquidity solutions.", src: "https://www.bloomberg.com/news/articles/2026-08-19/jefferies-targets-1-billion-for-private-credit-secondaries-fund", srcName: "Bloomberg" },
        { html: "<strong>Legal &mdash; Francisco Partners/Weave</strong>: Kirkland &amp; Ellis advised Francisco Partners on its agreement to take Weave Communications private for approximately $650m in cash, with Weave stockholders to receive $7.40 a share &mdash; a c.34% premium &mdash; in a deal expected to close in Q4 2026.", src: "https://www.kirkland.com/news/press-release/2026/08/kirkland-advises-francisco-partners-on-acquisition-of-weave-communications", srcName: "Kirkland & Ellis" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-20",
      time: "12:30 BST",
      lede: "The dollar hovers near three-month lows as the Treasury leans on doubled long-bond buybacks to steady the market after US public debt topped $40 trillion, while JD Sports shares crater on a profit warning and Standard Life partners with Wall Street heavyweights on a &pound;2bn UK bulk-annuity push; in credit, Jefferies Credit Partners is targeting roughly &euro;1bn for a new private-credit secondaries vehicle; and in legal, Slaughter and May's corporate bulletin flags FCA changes to COBS 11A.1.4 disclosure rules and the AIM Rules.",
      bullets: [
        { html: "<strong>Macro &mdash; dollar/Treasury</strong>: The dollar is hugging three-month lows as the Treasury tries to steady the bond market with its doubled long-bond buyback programme, days after total US public debt surpassed $40 trillion for the first time.", src: "https://www.cnbc.com/amp/2026/08/20/dollar-hugs-three-month-lows-as-treasury-aims-to-sooth-the-bond-market.html", srcName: "Reuters (via CNBC)" },
        { html: "<strong>Macro &mdash; UK equities</strong>: JD Sports shares fell sharply after the retailer cut its profit outlook, citing a slower-than-expected turnaround under chief executive R&eacute;gis Schultz amid weak sneaker demand.", src: "https://www.cityam.com/jd-sports-cuts-profit-forecast-as-regis-shultz-turnaround-slows/", srcName: "CityAM" },
        { html: "<strong>Macro &mdash; Standard Life</strong>: Standard Life is teaming up with Wall Street partners on a &pound;2bn UK bulk-annuity drive, the latest sign of intensifying competition in the pension-risk-transfer market.", src: "https://www.proactiveinvestors.co.uk/companies/news/1097320/standard-life-teams-up-with-wall-street-heavyweights-for-2bn-uk-bulk-annuity-drive-1097320.html", srcName: "Proactive Investors" },
        { html: "<strong>Credit &mdash; Jefferies Credit Partners</strong>: Jefferies Credit Partners is seeking roughly &euro;1bn for a new evergreen private-credit secondaries vehicle, structured as a continuation-fund/staple transaction acquiring loans from its existing direct-lending portfolio to recycle capital into new origination.", src: "https://www.privateequitywire.co.uk/jefferies-eyes-e1bn-for-private-credit-secondaries-vehicle/", srcName: "Private Equity Wire" },
        { html: "<strong>Legal &mdash; Slaughter and May</strong>: Slaughter and May's latest corporate bulletin flags the FCA's removal of most COBS 11A.1.4 rules on analyst information access, the AIM Rules changes that took effect 5 August, and a new FCA form from 21 September requiring issuers to declare whether a draft prospectus or circular contains inside information.", src: "https://www.slaughterandmay.com/insights/corporate-update/corporate-update-bulletin-20-august-2026/", srcName: "Slaughter and May" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-20",
      time: "17:25 BST",
      lede: "Walmart beat and raised but its shares sank 8.9% as investors questioned a beat built on tariff refunds, while the dollar held near three-month lows with the Treasury leaning on doubled long-bond buybacks and US public debt past $40 trillion; London closed lower on a JD Sports profit warning and a four-month-high 2.9% CPI print; and in credit, Franklin Templeton raised $1.5bn for its first collateralised fund obligation as Goldman Sachs agreed to buy net-lease manager LCN Capital Partners for up to $410m.",
      bullets: [
        { html: "<strong>Macro &mdash; Walmart</strong>: Walmart posted adjusted EPS of $0.81 on revenue of $187.9bn (+5.9%) and lifted FY27 adjusted EPS guidance to $2.80&ndash;2.87, but the shares fell 8.9% to $104.28 as investors questioned margin quality: the retailer was eligible for roughly $2.9bn of tariff refunds and said it will spend them cutting prices from Q3.", src: "https://www.cnbc.com/2026/08/20/walmart-wmt-q2-2027-earnings.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; dollar/Treasury</strong>: The dollar hugged three-month lows as the Treasury pressed on with its doubled long-bond buyback programme to steady the bond market, days after total US public debt passed $40 trillion for the first time.", src: "https://www.cnbc.com/amp/2026/08/20/dollar-hugs-three-month-lows-as-treasury-aims-to-sooth-the-bond-market.html", srcName: "Reuters (via CNBC)" },
        { html: "<strong>Macro &mdash; UK</strong>: The FTSE 100 gave back the previous session's gain, easing 0.52% to 10,688, as JD Sports slumped on a profit warning and July CPI at a four-month high of 2.9% kept rate-cut hopes in check, with oil holding above $91/bbl.", src: "https://tradingeconomics.com/united-kingdom/stock-market", srcName: "Trading Economics" },
        { html: "<strong>Credit &mdash; Franklin Templeton CFO</strong>: Franklin Templeton raised $1.5bn from global investors for Franklin Templeton Structured Solutions 2026, L.P., its first collateralised fund obligation, giving exposure to flagship strategies run by Lexington Partners and alternative-credit manager Benefit Street Partners.", src: "https://alternativecreditinvestor.com/2026/08/20/franklin-templeton-raises-1-5bn-for-inaugural-cfo/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Goldman/LCN</strong>: Goldman Sachs agreed to acquire LCN Capital Partners, a sale-leaseback and triple-net-lease specialist with about $3bn of assets under supervision, for roughly $260m upfront plus up to $150m deferred and contingent &mdash; around 80% payable in equity, with closing expected by end-2026.", src: "https://www.goldmansachs.com/pressroom/press-releases/2026/goldman-sachs-announces-agreement-to-acquire-lcn-capital-partners", srcName: "Goldman Sachs" },
      ],
    },
  },
};
