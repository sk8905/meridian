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
      time: "09:18 BST",
      lede: "Monday's session stays dominated by the twin Iran-Hormuz and Fed-rate threads &mdash; President Zelenskyy is pushing for trilateral US-Ukraine-Russia talks to resume after Sunday's Kyiv session with envoys Witkoff and Kushner, even as Iran presses ahead with a new Hormuz &ldquo;prohibited zone&rdquo; plan &mdash; while the credit desk logs a new evergreen direct-lending vehicle from Bridgepoint and Nuveen's A$705m Arcmont raise, and the legal desk stays quiet on new alerts this run after Friday's South Square note on the Petropavlovsk sanctions ruling.",
      bullets: [
        { html: "<strong>Macro &mdash; Zelenskyy calls for trilateral US-Ukraine-Russia talks after &ldquo;substantial&rdquo; Kyiv session</strong>: President Zelenskyy urged the resumption of three-way negotiations following Sunday's meeting with envoys Steve Witkoff and Jared Kushner &mdash; their first stop after a three-hour Moscow session with President Putin &mdash; even as he named the status of Donetsk &ldquo;the question of this war&rdquo;.", src: "https://www.rferl.org/a/kushner-witkoff-putin-zelenskyy-ukraine-russia/33847622.html", srcName: "RFE/RL" },
        { html: "<strong>Macro &mdash; Iran presses ahead with new Hormuz &ldquo;prohibited zone&rdquo; plan</strong>: Supreme National Security Council secretary Mohsen Rezaei confirmed Tehran will declare a restricted zone extending from the US Navy's own blockade line into the Persian Gulf within days, with any vessel entering it placed on Iran's sanctions list &mdash; a fresh escalation five days before the decisive 11 September US CPI print.", src: "https://www.malaymail.com/news/world/2026/09/07/iran-to-declare-prohibited-zone-near-strait-of-hormuz-in-coming-days-warns-ships-entering-will-face-sanctions/234223", srcName: "Malay Mail" },
        { html: "<strong>Credit &mdash; Bridgepoint rolls out evergreen direct-lending vehicle for institutional investors</strong>: Bridgepoint launched Bridgepoint Direct Lending Evergreen, a Luxembourg-domiciled, perpetual-but-illiquid extension of its European direct lending strategy for institutional investors, following July's &euro;5.1bn final close of Bridgepoint Direct Lending IV.", src: "https://alternativecreditinvestor.com/2026/09/07/bridgepoint-rolls-out-evergreen-vehicle-for-institutional-investors/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; Nuveen raises A$705m for Arcmont's European direct lending strategy</strong>: Nuveen secured A$705m (~&pound;373m) from Australian institutional investors, including superannuation fund Brighter Super and JANA Private Credit Trust, for a dedicated portfolio of senior secured, unitranche and subordinated loans to European mid- and upper-mid-market companies managed by Arcmont Asset Management.", src: "https://www.nuveen.com/global/insights/news/nuveen-raises-705-million-for-arcmonts-european-direct-lending-strategy", srcName: "Nuveen" },
        { html: "<strong>Legal &mdash; South Square notes Petropavlovsk sanctions ruling on liquidation-proceeds assignment</strong>: HHJ Johns KC permitted Petropavlovsk's joint liquidators to consent to Atlas JSC's assignment of its rights to surplus liquidation proceeds to Dubai-based Denali Corp-FZCO despite Atlas's later UK sanctions designation, holding the rights were an &ldquo;economic resource&rdquo; rather than a &ldquo;fund&rdquo; and that mere consent to the assignment was not a prohibited &ldquo;dealing&rdquo;.", src: "https://southsquare.com/new-judgment-denali-corp-fzco-v-manson-ors-re-petropavlovsk-plc-in-liquidation-2026-ewhc-ch/", srcName: "South Square" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-09-07",
      time: "12:31 BST",
      lede: "US markets stay shut for Labor Day but OpenAI's weekend release of GPT-6 Astra has revived the AI-capex trade into the Asian session &mdash; Nikkei and Kospi both surging &mdash; even as Brent extends its advance on the still-live Strait of Hormuz standoff and Governor Bailey uses an LSE keynote to make the case for central-bank independence rather than signal on the 17 September MPC decision; the credit desk logs a new DACH direct-lending hire at PGIM and re-verifies three hedge-fund-adjacent credit managers, while legal stays quiet on new alerts this run.",
      bullets: [
        { html: "<strong>Macro &mdash; GPT-6 Astra launch drives Asia AI-chip rally as Fed-hike odds hold near 65%</strong>: Japan's Nikkei 225 closed up 2.1% at a record 66,399.84 and South Korea's Kospi jumped 4.6% to 6,995.39 (SK Hynix +6.1%, Samsung +4%) on revived AI-infrastructure demand optimism, even as Brent crude extended its advance on the still-live Iran/Hormuz standoff with US cash markets shut for Labor Day.", src: "https://www.investing.com/news/stock-market-news/asian-stocks-rally-as-chipmakers-surge-oil-and-fed-bets-keep-risks-in-view-4890351", srcName: "Investing.com" },
        { html: "<strong>Macro &mdash; Governor Bailey makes the institutional case for central-bank independence</strong>: Bailey's LSE TRIUM Anniversary Conference keynote argued central-bank independence rests on more than technocratic expertise, a day after chief economist Huw Pill's Edinburgh remarks kept a prompt move to 4% Bank Rate in play ahead of the 17 September MPC decision.", src: "https://www.bankofengland.co.uk/speech/2026/september/andrew-bailey-keynote-speech-at-lse-trium-anniversary-conference", srcName: "Bank of England" },
        { html: "<strong>Credit &mdash; PGIM ramps up DACH focus with new direct lending head</strong>: PGIM Private Capital appointed Robert Scheer, ex-M&amp;G Investments co-head of private credit origination, as head of direct lending for the DACH region, based in Frankfurt and responsible for sponsor-led origination, structuring and underwriting across Germany, Austria and Switzerland.", src: "https://alternativecreditinvestor.com/2026/09/07/pgim-ramps-up-dach-focus-with-new-direct-lending-head/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; rotating manager re-verification: Baupost, Davidson Kempner, V&auml;rde all confirmed unchanged</strong>: this run's SEC Form ADV re-checks found The Baupost Group's AUM still $24.68bn, Davidson Kempner's still $46.63bn and V&auml;rde Partners' still $16.13bn, with no newer ADV amendments filed at any of the three since their last-recorded update.", src: "https://adviserinfo.sec.gov/firm/summary/109530", srcName: "SEC Form ADV" },
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
