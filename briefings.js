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
      date: "2026-09-07",
      time: "05:22 BST",
      lede: "Monday opens on two competing geopolitical threads &mdash; President Zelenskyy calling for trilateral US-Ukraine-Russia talks to resume after Sunday's &ldquo;substantial&rdquo; Kyiv session with envoys Witkoff and Kushner, even as Iran presses ahead with a new Hormuz &ldquo;prohibited zone&rdquo; plan that Asia-Pacific equities shrugged off (Kospi +3.09%, Nikkei +1%) on AI-chip optimism with US markets shut for Labor Day &mdash; while the credit desk logs Franklin Templeton's debut $1.5bn CFO close and an A$705m raise for Nuveen's Arcmont direct-lending strategy, and the legal desk covers a fresh South Square note on a Petropavlovsk sanctions ruling.",
      bullets: [
        { html: "<strong>Macro &mdash; Zelenskyy calls for trilateral US-Ukraine-Russia talks after &ldquo;substantial&rdquo; Kyiv session</strong>: President Zelenskyy urged the resumption of three-way negotiations following Sunday's meeting with envoys Steve Witkoff and Jared Kushner &mdash; their first stop after a three-hour Moscow session with President Putin &mdash; even as he named the status of Donetsk &ldquo;the question of this war&rdquo;.", src: "https://www.rferl.org/a/kushner-witkoff-putin-zelenskyy-ukraine-russia/33847622.html", srcName: "RFE/RL" },
        { html: "<strong>Macro &mdash; Iran presses ahead with new Hormuz &ldquo;prohibited zone&rdquo; plan</strong>: Supreme National Security Council secretary Mohsen Rezaei confirmed Tehran will declare a restricted zone extending from the US Navy's own blockade line into the Persian Gulf within days, with any vessel entering it placed on Iran's sanctions list &mdash; a fresh escalation five days before the decisive 11 September US CPI print.", src: "https://www.malaymail.com/news/world/2026/09/07/iran-to-declare-prohibited-zone-near-strait-of-hormuz-in-coming-days-warns-ships-entering-will-face-sanctions/234223", srcName: "Malay Mail" },
        { html: "<strong>Credit &mdash; Franklin Templeton closes debut $1.5bn collateralized fund obligation</strong>: Franklin Templeton Structured Solutions 2026 raised $1.5bn from global investors for diversified private-markets exposure spanning PE secondaries/continuation vehicles managed by Lexington Partners and US middle-market direct lending managed by Benefit Street Partners.", src: "https://alternativecreditinvestor.com/2026/08/20/franklin-templeton-raises-1-5bn-for-inaugural-cfo/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Nuveen raises A$705m for Arcmont's European direct lending strategy</strong>: Nuveen secured A$705m (~&pound;373m) from Australian institutional investors, including superannuation fund Brighter Super and JANA Private Credit Trust, for a dedicated portfolio of senior secured, unitranche and subordinated loans to European mid- and upper-mid-market companies managed by Arcmont Asset Management.", src: "https://www.nuveen.com/global/insights/news/nuveen-raises-705-million-for-arcmonts-european-direct-lending-strategy", srcName: "Nuveen" },
        { html: "<strong>Legal &mdash; South Square notes Petropavlovsk sanctions ruling on liquidation-proceeds assignment</strong>: HHJ Johns KC permitted Petropavlovsk's joint liquidators to consent to Atlas JSC's assignment of its rights to surplus liquidation proceeds to Dubai-based Denali Corp-FZCO despite Atlas's later UK sanctions designation, holding the rights were an &ldquo;economic resource&rdquo; rather than a &ldquo;fund&rdquo; and that mere consent to the assignment was not a prohibited &ldquo;dealing&rdquo;.", src: "https://southsquare.com/new-judgment-denali-corp-fzco-v-manson-ors-re-petropavlovsk-plc-in-liquidation-2026-ewhc-ch/", srcName: "South Square" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-06",
      time: "12:25 BST",
      lede: "Geopolitical risk is back in focus after Iran said it targeted oil tankers in response to US strikes, landing just as the Fed weighs its 16 September decision and the BoE's Huw Pill argues the opposite case for a UK hike to 4%; law firms record fresh megadeal work &mdash; Davis Polk advised Venture Global LNG on a $3bn revolving credit facility and UtilityInnovation Group on its $1.45bn sale to Vertiv &mdash; while on the credit desk CQS priced its second new European CLO of the year.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran says it targeted oil tankers in response to US strikes</strong>: Tehran's retaliatory claim reignites the geopolitical risk premium behind this year's oil-driven inflation scare, days before the Fed's 16 September rate decision.", src: "https://www.bloomberg.com/news/articles/2026-09-06/iran-says-it-targeted-oil-tankers-in-response-to-us-strikes", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; BoE's Pill backs a rate hike to 4% to limit inflation catch-up effects</strong>: Bank of England chief economist Huw Pill argues for tightening policy further even as UK borrowing costs sit at multi-decade highs, a starkly different call to Trump's public push for the Fed to cut.", src: "https://www.fxstreet.com/news/boes-pill-backs-rate-hike-to-4-to-limit-inflation-catch-up-effects-202609031544", srcName: "FXStreet" },
        { html: "<strong>Legal &mdash; Davis Polk advises Venture Global LNG on $3bn revolving credit facility</strong>: Davis Polk advised the LNG exporter as borrower on a $3bn revolver for general corporate purposes, with the deal team spanning finance, tax, sanctions and Investment Company Act advice.", src: "https://www.davispolk.com/experience/venture-global-lng-3-billion-revolving-credit-facility", srcName: "Davis Polk" },
        { html: "<strong>Legal &mdash; Davis Polk advises UtilityInnovation Group on $1.45bn sale to Vertiv</strong>: Davis Polk acted for the seller on its sale to NYSE-listed Vertiv Holdings for c.$1.45bn cash at closing plus up to $1.15bn of contingent EBITDA-linked consideration, expected to close Q4 2026.", src: "https://www.davispolk.com/experience/utilityinnovation-group-1-45-billion-sale-vertiv", srcName: "Davis Polk" },
        { html: "<strong>Credit &mdash; CQS prices Grosvenor Place CLO 11, its second new European CLO of 2026</strong>: Manulife | CQS priced triple-A notes at Euribor+129bps, taking its CLO platform to 12 vehicles across Europe and the US with roughly $5.5bn of total CLO AUM.", src: "https://www.creditflux.com/CLOs/2026-06-04/CQS-prints-second-new-European-CLO-for-the-year", srcName: "Creditflux" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-09-06",
      time: "21:22 BST",
      lede: "The Iran-Hormuz standoff hardened further into Sunday night &mdash; Tehran's security chief says it will declare a new &ldquo;prohibited zone&rdquo; near the Strait within days after a weekend of tit-for-tat tanker strikes, and parliament speaker Ghalibaf warned the &ldquo;era of proportionate responses is over&rdquo; &mdash; landing five days before the decisive 11 September CPI print both the Fed and BoE are now watching; the legal desk was quiet this run, while credit tracked incoming EMEA leadership at Apollo, a second European CLO build-out at Muzinich and a North American expansion at Pemberton.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran's security chief says Tehran will declare a &ldquo;prohibited zone&rdquo; near Hormuz within days</strong>: Mohsen Rezaei said the new zone would extend from the US Navy's own blockade line into the Persian Gulf, with any vessel entering it placed on Iran's sanctions list &mdash; a fresh oil-supply escalation five days before the decisive 11 September CPI print.", src: "https://www.scmp.com/news/world/middle-east/article/3366566/iran-will-declare-prohibited-zone-near-hormuz-coming-days-security-chief", srcName: "South China Morning Post" },
        { html: "<strong>Macro &mdash; US forces disabled two Iranian tankers and destroyed a third over the weekend</strong>: the Downy (off Kharg Island) and Stark 1 (near Jask) were permanently disabled and the Kylo destroyed near the Gulf of Oman, after Iran's IRGC fired missiles at two US Navy warships that missed &mdash; Iran retaliated Sunday with strikes on three more tankers, and parliament speaker Ghalibaf warned the &ldquo;era of proportionate responses is over&rdquo;.", src: "https://www.cnn.com/2026/09/05/middleeast/iran-us-tanker-kharg-intl", srcName: "CNN" },
        { html: "<strong>Macro &mdash; upcoming inflation data now the decisive input for both the Fed and the BoE</strong>: with the Fed's 16 September decision and the BoE's 17 September MPC both looming, Wall Street is watching the coming CPI/PPI prints &mdash; clouded by tariffs and the fresh oil shock &mdash; even as the BoE's Huw Pill keeps pushing for an immediate hike to 4%.", src: "https://fortune.com/2026/09/06/fed-rate-hikes-inflation-data-ppi-cpi-august-tariffs-oil-prices/", srcName: "Fortune" },
        { html: "<strong>Credit &mdash; Apollo names incoming EMEA head as Muzinich and Pemberton both expand</strong>: Apollo named Diego De Giorgi as incoming Head of EMEA, succeeding Rob Seminara; Muzinich is accelerating its European CLO platform with two new deals eyed for 2026; and Pemberton opened a New York office with senior hires to meet US/Canadian demand for European mid-market credit.", src: "https://www.apollo.com/insights-news/pressreleases/2026/02/apollo-names-diego-de-giorgi-as-incoming-head-of-emea-3234991", srcName: "Apollo" },
      ],
    },
  },
};
