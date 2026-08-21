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
      date: "2026-08-21",
      time: "09:20 BST",
      lede: "UK flash PMIs strengthened modestly &mdash; the composite rose to a 4-month high of 52.5 as services rose to a 6-month high of 52.8, even as manufacturing slipped to a 5-month low of 51.5 &mdash; lifting the pound, with the US flash PMI due later today and Thursday's Treasury-buyback relief already fading as the 30-year yield resumes its climb; in credit, Crestline closed its second European Capital Solutions fund at $625m, up nearly 75% on its debut vehicle; and in legal, Clifford Chance advised Instone Real Estate on a joint venture with Ginkgo Fund to redevelop a 15-hectare Düsseldorf site.",
      bullets: [
        { html: "<strong>Macro &mdash; UK PMI</strong>: The flash UK Composite PMI climbed to 52.5 in August (from 52.2) &mdash; a 4-month high &mdash; as the Services Business Activity Index rose to a 6-month high of 52.8 (from 52.1, vs 51.8 expected), even as Manufacturing slipped to a 5-month low of 51.5, with sterling picking up bids.", src: "https://www.actionforex.com/live-comments/651355-uk-pmi-services-strengthen-in-august-but-manufacturing-momentum-fades/", srcName: "ActionForex" },
        { html: "<strong>Macro &mdash; Treasury/bonds</strong>: Strategists call Treasury Secretary Bessent's expanded long-bond buyback programme at best a 'circuit breaker' for the global bond slump &mdash; it bought a day's relief on Wednesday before the 30-year yield resumed its climb toward 5.27% on Thursday, with Asian bonds and the dollar under renewed pressure into Friday.", src: "https://www.bloomberg.com/news/articles/2026-08-20/bessent-s-plan-at-best-circuit-breaker-for-global-bond-slump", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Crestline</strong>: Crestline recorded the final close of its second European Capital Solutions fund at $625m (&pound;458m) &mdash; up nearly 75% on its debut vehicle &mdash; financing tailored capital solutions from senior debt to structured equity for asset-backed and lower-middle-market businesses across North and Western Europe.", src: "https://alternativecreditinvestor.com/2026/08/20/crestline-records-strong-demand-for-second-european-fund/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; CLO resets</strong>: Bridgepoint priced a &euro;307.85m reset of its debut CLO (Bridgepoint CLO I) extending reinvestment to 2031, while CIC Private Debt closed a &euro;307.5m reset of its own debut vehicle, Victory Street CLO I, with a c.90% investor roll rate &mdash; both a sign of continued European CLO reset demand into late August.", src: "https://alternativecreditinvestor.com/2026/08/18/bridgepoint-prices-e307m-reset-of-debut-clo/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Legal &mdash; Instone/Ginkgo</strong>: Clifford Chance advised Instone Real Estate on a strategic joint venture with Ginkgo Fund to redevelop 'Benrather G&auml;rten', a 15-hectare former industrial site in D&uuml;sseldorf, into a mixed-use urban quarter of 800-1,000 apartments; deal value undisclosed.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-instone-on-strategic-joint-venture-with-ginkgo.html", srcName: "Clifford Chance" },
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
      time: "17:26 BST",
      lede: "US flash composite PMI hit a four-year high as Services jumped to 56.8 (vs 54.0 expected) and equities extended their rebound with bitcoin near a three-year best week, while the UK's own flash Services PMI strengthened to a 6-month high (52.8, from 52.1) even as ONS data showed a surprise &pound;1.8bn July public-sector deficit alongside softer retail sales, a fresh headache for the Autumn Budget; in credit, CVC leads a consortium backing Standard Life's new UK pension-risk-transfer partnership; and in legal, the Supreme Court ruled in Drelle v Servis-Terminal that an unrecognised foreign money judgment can found an English bankruptcy petition, while Clifford Chance racked up advisory mandates on easyJet's &pound;5.7bn Apollo takeover and a &euro;500m Webuild financing.",
      bullets: [
        { html: "<strong>Macro &mdash; US PMI</strong>: The US flash S&amp;P Global Composite PMI hit a four-year high in August, with Services jumping to 56.8 (vs 54.0 expected, the fastest pace since December 2024) even as Manufacturing eased to 53.2; equities extended their stabilisation and bitcoin logged its best week in roughly three years.", src: "https://www.tradingview.com/news/reuters.com,2026:newsml_L6N44I0UZ:0-it-s-the-flash-us-composite-pmi-hits-four-year-high/", srcName: "Reuters (via TradingView)" },
        { html: "<strong>Macro &mdash; UK deficit</strong>: ONS data showed a surprise &pound;1.8bn July public-sector deficit &mdash; against an expected balance and more than &pound;2bn above the OBR's forecast &mdash; landing alongside a July retail-sales fall and complicating Chancellor Healey's run-up to the 28 October Autumn Budget, even as the flash UK Services PMI strengthened to a 6-month high of 52.8 (from 52.1, vs 51.8 expected).", src: "https://www.bloomberg.com/news/newsletters/2026-08-21/uk-posts-deficit-retail-sales-fall-ahead-of-labour-autumn-budget", srcName: "Bloomberg" },
        { html: "<strong>Credit &mdash; Standard Life PRT</strong>: CVC leads a consortium backing Standard Life's newly launched UK pension-risk-transfer partnership, part of a wider up-to-&pound;2bn tie-up alongside Goldman Sachs, MS&amp;AD and Prudential Financial.", src: "https://www.standardlifeplc.com/news-and-views/press-releases/article-page/launch-of-uk-pension-risk-transfer-partnership", srcName: "Standard Life" },
        { html: "<strong>Legal &mdash; Supreme Court</strong>: In Drelle v Servis-Terminal LLC, the Supreme Court unanimously held that an unrecognised, unregistrable foreign money judgment (a RUB 2bn Russian judgment) can found an English bankruptcy petition, reversing the Court of Appeal and widening the route open to creditors pursuing debtors from non-reciprocal jurisdictions.", src: "https://caselaw.nationalarchives.gov.uk/uksc/2026/29", srcName: "National Archives (UKSC)" },
        { html: "<strong>Legal &mdash; easyJet/Apollo</strong>: Clifford Chance advised easyJet on the recommended &pound;5.7bn takeover offer from Apollo-managed funds, structured by way of a Part 26 scheme of arrangement.", src: "https://www.cliffordchance.com/news/news/2026/08/clifford-chance-advises-easyjet-on-the-recommended-p5-7-billion-takeover.html", srcName: "Clifford Chance" },
      ],
    },
  },
};
