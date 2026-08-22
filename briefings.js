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
      date: "2026-08-22",
      time: "05:16 BST",
      lede: "UK growth momentum builds &mdash; the flash composite PMI hit a 4-month high and GfK consumer confidence a 2-year high &mdash; even as Chancellor Healey confronts a surprise &pound;1.8bn July deficit and Bessent's Treasury-buyback relief fades, with longer-dated yields resuming their climb and gold breaking to a 3-month high on dollar weakness; in credit, Sona Asset Management is preparing to launch a &euro;400m European CLO; and in legal, Freshfields advised Goldman Sachs on Standard Life's up-to-&pound;2bn UK pension-risk-transfer partnership.",
      bullets: [
        { html: "<strong>Macro &mdash; UK PMI/confidence</strong>: Britain's private sector expanded at its fastest pace in four months as the flash composite PMI rose to 52.5 in August, while GfK's consumer-confidence index climbed three points to -14 &mdash; its best level in two years &mdash; on easing energy prices and optimism around the new Burnham government, even as July inflation ran at a four-month high of 2.9%.", src: "https://www.bloomberg.com/news/articles/2026-08-21/uk-economy-speeds-up-as-firms-and-shoppers-splash-out-pmi-shows", srcName: "Bloomberg" },
        { html: "<strong>Macro &mdash; Treasury yields</strong>: The relief from Treasury Secretary Bessent's expanded bond-buyback programme proved short-lived as longer-dated Treasury yields resumed climbing, with strategists warning the intervention does little to address the underlying deficit or term premium.", src: "https://www.cnbc.com/2026/08/21/treasury-yields-bonds-inflation-rates.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; Gold</strong>: Gold reached its highest price in three months as the dollar weakened, extending a rally driven by the Treasury's expanded buyback plan after being range-bound for most of the summer.", src: "https://www.forbes.com/sites/conormurray/2026/08/21/gold-reaches-highest-price-in-three-months-as-dollar-weakens/", srcName: "Forbes" },
        { html: "<strong>Credit &mdash; Sona CLO</strong>: Sona Asset Management is preparing to launch a &euro;400m multicurrency European CLO, Sona Aclai CLO I DAC, per a preliminary KBRA rating covering a 97-obligor portfolio split roughly 70/30 between broadly-syndicated and middle-market loans.", src: "https://alternativecreditinvestor.com/2026/08/21/sona-prepares-to-launch-e400m-european-clo/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Standard Life/Goldman</strong>: Freshfields advised Goldman Sachs as part of an investor consortium &mdash; led by CVC Capital Partners and Prudential Financial, alongside MS&amp;AD &mdash; providing up to &pound;2bn to expand Standard Life's UK pension-risk-transfer business, with completion expected in H1 2027 subject to regulatory approval.", src: "https://www.freshfields.com/en/our-thinking/news/news-search/2026/08/freshfields-advises-the-goldman-sachs-group-inc.-on-the-strategic-uk-pension-risk-transfer-partnership", srcName: "Freshfields" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-21",
      time: "12:31 BST",
      lede: "Treasury Secretary Bessent pledges the 'toughest sanctions in history' on Iran as futures drift higher and gold breaks $4,525 on dollar weakness, while UK retail sales soften in July even as the flash composite PMI beats expectations; in credit, PGIM commits to a roughly $3bn three-year forward-flow facility with home-improvement lender GreenSky; and in legal, Sidley is representing Ridgeview Partners on its proposed &pound;545m scheme-of-arrangement acquisition of Pinewood Technologies, while Weil advised Foundever on a recapitalisation cutting its debt by nearly $900m.",
      bullets: [
        { html: "<strong>Macro &mdash; Iran sanctions</strong>: Bessent vowed the 'toughest sanctions in history' on Iran and warned allies against providing it any economic lifeline, as US futures drifted higher despite persistent Treasury-yield pressure.", src: "https://www.cnbc.com/video/2026/08/21/bessent-vows-atoughest-sanctions-in-historya-on-iran-warns-allies.html", srcName: "CNBC" },
        { html: "<strong>Macro &mdash; gold/dollar</strong>: Gold broke above $4,525/oz with bulls eyeing $4,625 as the dollar continued to slide, extending this week's debasement-trade narrative around the Treasury's bond-buyback intervention.", src: "https://www.fxleaders.com/news/2026/08/21/gold-breaks-4525-xau-usd-bulls-eye-4625-dollar-slides/", srcName: "FX Leaders" },
        { html: "<strong>Macro &mdash; UK retail/PMI</strong>: UK retail sales softened in July after June's World Cup-driven boost, per ONS data, even as the flash composite PMI beat expectations and business activity strengthened &mdash; a mixed picture that left the FTSE 100 higher on a metals rally.", src: "https://www.ons.gov.uk/releases/retailsalesgreatbritainjuly2026", srcName: "ONS" },
        { html: "<strong>Credit &mdash; PGIM/GreenSky</strong>: PGIM committed to a roughly $3bn, three-year forward-flow facility with home-improvement lender GreenSky, growing its asset-based-finance pool as ABF forward-flow deals continue to proliferate.", src: "https://alternativecreditinvestor.com/2026/08/20/pgim-grows-abf-pool/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Ridgeview/Pinewood</strong>: Sidley is representing Ridgeview Partners on its proposed &pound;545m recommended acquisition of London-listed Pinewood Technologies via a court-sanctioned Part 26 scheme of arrangement, a 43% premium to Pinewood's pre-announcement close.", src: "https://www.sidley.com/en/newslanding/newsannouncements/2026/08/sidley-represents-ridgeview-partners-in-its-proposed-545-million-acquisition", srcName: "Sidley" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-21",
      time: "21:25 BST",
      lede: "US flash composite PMI hit a four-year high as Services jumped to 56.8 (vs 54.0 expected) and equities extended their rebound with bitcoin near a three-year best week, while the UK's own flash Services PMI strengthened to a 6-month high (52.8, from 52.1) even as ONS data showed a surprise &pound;1.8bn July public-sector deficit alongside softer retail sales, a fresh headache for the Autumn Budget; in credit, Guggenheim Investments launched an actively managed Investment Grade CLO ETF; and in legal, the Supreme Court ruled in Drelle v Servis-Terminal that an unrecognised foreign money judgment can found an English bankruptcy petition, while Clifford Chance racked up advisory mandates on easyJet's &pound;5.7bn Apollo takeover and a &euro;500m Webuild financing.",
      bullets: [
        { html: "<strong>Macro &mdash; US PMI</strong>: The US flash S&amp;P Global Composite PMI hit a four-year high in August, with Services jumping to 56.8 (vs 54.0 expected, the fastest pace since December 2024) even as Manufacturing eased to 53.2; equities extended their stabilisation and bitcoin logged its best week in roughly three years.", src: "https://www.tradingview.com/news/reuters.com,2026:newsml_L6N44I0UZ:0-it-s-the-flash-us-composite-pmi-hits-four-year-high/", srcName: "Reuters (via TradingView)" },
        { html: "<strong>Macro &mdash; UK deficit</strong>: ONS data showed a surprise &pound;1.8bn July public-sector deficit &mdash; against an expected balance and more than &pound;2bn above the OBR's forecast &mdash; landing alongside a July retail-sales fall and complicating Chancellor Healey's run-up to the 28 October Autumn Budget, even as the flash UK Services PMI strengthened to a 6-month high of 52.8 (from 52.1, vs 51.8 expected).", src: "https://www.bloomberg.com/news/newsletters/2026-08-21/uk-posts-deficit-retail-sales-fall-ahead-of-labour-autumn-budget", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Guggenheim CLO ETF</strong>: Guggenheim Investments expanded its active ETF platform with the launch of the Guggenheim Investment Grade CLO ETF (NYSE: GCLO), which invests across the CLO capital structure from AAA to equity tranches.", src: "https://www.globenewswire.com/news-release/2026/08/20/3348515/16530/en/guggenheim-investments-expands-active-etf-platform-with-launch-of-two-new-etfs.html", srcName: "GlobeNewswire" },
        { html: "<strong>Legal &mdash; Supreme Court</strong>: In Drelle v Servis-Terminal LLC, the Supreme Court unanimously held that an unrecognised, unregistrable foreign money judgment (a RUB 2bn Russian judgment) can found an English bankruptcy petition, reversing the Court of Appeal and widening the route open to creditors pursuing debtors from non-reciprocal jurisdictions.", src: "https://caselaw.nationalarchives.gov.uk/uksc/2026/29", srcName: "National Archives (UKSC)" },
        { html: "<strong>Legal &mdash; easyJet/Apollo</strong>: Clifford Chance advised easyJet on the recommended &pound;5.7bn takeover offer from Apollo-managed funds, structured by way of a Part 26 scheme of arrangement.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-easyjet-on-the-recommended-p5-7-billion-takeover.html", srcName: "Clifford Chance" },
      ],
    },
  },
};
