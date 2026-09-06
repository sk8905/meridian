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
      date: "2026-09-06",
      time: "09:25 BST",
      lede: "Sunday's dominant story is diplomatic rather than economic — Trump envoys Steve Witkoff and Jared Kushner carried their Moscow peace push on to Kyiv for talks with President Zelenskyy, even as Axios reports Republican voters souring on the economy — while law firms record a fresh wave of megadeals: Sidley advised Apollo funds on the $4.1bn sale of Kelvion to SLB and Clifford Chance advised EQT on its $2.0bn purchase of McGill & Partners, and on the credit desk Blue Owl disclosed writing a private loan to near-zero amid bankruptcy risk.",
      bullets: [
        { html: "<strong>Macro &mdash; Trump envoys carry Moscow peace push on to Kyiv</strong>: Steve Witkoff and Jared Kushner met Vladimir Putin in Moscow for over three hours Saturday before heading to Kyiv for Sunday talks with President Zelenskyy, with both sides observing a brief pause in strikes to allow the visit &mdash; the first concrete sign of momentum in the stalled Russia-Ukraine peace track in months, easing one of the two war-driven supply risks behind this year's oil-driven inflation scare.", src: "https://www.thenationalnews.com/news/2026/09/06/trump-envoys-meet-putin-before-taking-peace-push-to-kyiv/", srcName: "The National" },
        { html: "<strong>Macro &mdash; Republicans sour on the economy</strong>: Republican consumer sentiment has plunged 15.1 points since February on the University of Michigan survey &mdash; a pace unseen since Covid &mdash; as persistent inflation and Iran-war-linked gas prices erode confidence even among the president's own base ahead of the midterms.", src: "https://www.axios.com/2026/09/05/trump-economy-michigan-survey-inflation-iran-war", srcName: "Axios" },
        { html: "<strong>Legal &mdash; Sidley advises Apollo funds on $4.1bn sale of Kelvion to SLB</strong>: Sidley represented Apollo-managed funds, majority owner of thermal-management specialist Kelvion, on its sale to NYSE-listed SLB for approximately $4.1bn (c.$3.4bn cash plus assumed debt), with closing expected in H1 2027.", src: "https://www.sidley.com/en/newslanding/newsannouncements/2026/09/apollo-funds-in-sale-of-kelvion-to-slb", srcName: "Sidley" },
        { html: "<strong>Legal &mdash; Clifford Chance advises EQT on $2.0bn purchase of McGill & Partners</strong>: Clifford Chance advised EQT X on acquiring a majority stake in London specialty (re)insurance broker McGill & Partners from Warburg Pincus for approximately $2.0bn, with founder Steve McGill continuing to lead the business.", src: "https://www.cliffordchance.com/news/news/2026/09/clifford-chance-advises-eqt-on-the-us20bn-acquisition-of-a-majority-stake-in-mcgill-partners.html", srcName: "Clifford Chance" },
        { html: "<strong>Credit &mdash; Blue Owl slashes a private loan to near-zero amid bankruptcy risk</strong>: Blue Owl marked down a direct-lending position to near-zero as the borrower faces bankruptcy risk, the latest sign of stress surfacing in parts of the private-credit book even as the broader BDC platform keeps raising fresh capital.", src: "https://www.bloomberg.com/news/articles/2026-09-05/blue-owl-slashes-private-loan-to-near-zero-amid-bankruptcy-risk", srcName: "Bloomberg" },
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
