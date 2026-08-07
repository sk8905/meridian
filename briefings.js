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
      date: "2026-08-07",
      time: "09:31 BST",
      lede: "Markets held a tight, wait-and-see range into Friday's US July jobs report as gold and sterling consolidated near recent levels, Willow Tree Credit Partners closed a $730m HarbourVest-led continuation vehicle and Blackstone Credit &amp; Insurance backed ContextLogic's $850m acquisition of gChem, Slaughter and May advised RWS on its acquisition of Acolad, and Kirkland &amp; Ellis published its read on the TG Jones restructuring-plan judgment on equity retention and cross-class cram-down.",
      bullets: [
        { html: "<strong>US data watch</strong>: gold held below recent highs and the dollar stayed firm ahead of the July jobs report, with nonfarm payrolls, the unemployment rate and average hourly earnings all in focus as the last major data point before the Fed's contested September meeting.", src: "https://www.fxstreet.com/news/gold-consolidates-below-recent-highs-as-usd-strength-and-fed-hike-bets-cap-ahead-of-us-nfp-202608070135", srcName: "FXStreet" },
        { html: "<strong>UK markets</strong>: the FTSE 100 was set for a softer open as fresh US tariffs on polysilicon imports and firmer oil prices offset optimism ahead of the US jobs report, while sterling traded weaker as UK-US bond-yield differentials narrowed.", src: "https://www.share-talk.com/ftse-100-set-for-softer-open-as-investors-await-us-jobs-report/", srcName: "Share Talk" },
        { html: "<strong>Credit &mdash; continuation vehicles</strong>: Willow Tree Credit Partners closed a $730m continuation vehicle (Fund II-CV) comprising roughly 130 first-lien, sponsor-backed securities from its 2020/21-vintage Fund II, led by HarbourVest Partners.", src: "https://alternativecreditinvestor.com/2026/08/06/willow-tree-closes-730m-credit-continuation-vehicle/", srcName: "Alternative Credit Investor" },
        { html: "<strong>Credit &mdash; financing</strong>: Blackstone Credit &amp; Insurance led a $275m debt financing backing ContextLogic Holdings' agreed $850m-enterprise-value acquisition of Gaylord Chemical (gChem) from EagleTree Capital-managed funds; Latham &amp; Watkins advised Blackstone.", src: "https://www.lw.com/en/news/2026/08/latham-represents-blackstone-credit-insurance-in-financing-for-contextlogic-acquisition-of-gchem", srcName: "Latham & Watkins" },
        { html: "<strong>Legal &mdash; corporate</strong>: Slaughter and May is advising RWS Holdings on its proposed acquisition of France-based Acogroup (Acolad), a language and content-services provider, in a deal reported at roughly &pound;22.4m enterprise value.", src: "https://www.slaughterandmay.com/recent-work/rws-on-the-acquisition-of-acolad/", srcName: "Slaughter and May" },
        { html: "<strong>Legal &mdash; restructuring</strong>: Kirkland &amp; Ellis published its analysis of Hildyard J's reasons sanctioning TG Jones' Part 26A restructuring plans, examining the court's approval of sponsor Modella Capital retaining full equity and its caution that cross-class cram-down 'must not become an engine of abuse'.", src: "https://www.kirkland.com/publications/kirkland-alert/2026/08/tg-jones-english-court", srcName: "Kirkland & Ellis" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-08-07",
      time: "12:33 BST",
      lede: "Markets stayed cautious into Friday's US jobs report as gold slipped on cooling Hormuz tensions and sterling stayed weak on narrowing UK-US yield differentials, the High Court dismissed a family shareholder dispute at a Cambridge hotel company, and L&amp;G's new debt-issuance platform with Finance in Motion and Texel remained the freshest European private-credit strategy move on the wire.",
      bullets: [
        { html: "<strong>US markets</strong>: US futures wavered ahead of the July jobs report &mdash; the last major data point before the Fed's contested September meeting &mdash; with Atlassian, Trade Desk and Cloudflare in focus.", src: "https://www.benzinga.com/markets/equities/26/08/61031224/stock-market-today-dow-jones-futures-slip-sp-500-gains-ahead-of-july-jobs-report-atlassian-trade-desk-cloudflare-in-focus", srcName: "Benzinga" },
        { html: "<strong>Gold / commodities</strong>: gold slipped as easing tension around the Strait of Hormuz took some safe-haven bid out of the market, with silver falling harder.", src: "https://www.riotimesonline.com/gold-silver-precious-metals-friday-august-7-2026/", srcName: "Rio Times Online" },
        { html: "<strong>UK markets</strong>: sterling stayed weaker against the dollar as UK-US bond-yield differentials narrowed, while the FTSE 100 was tipped to open softer on firmer oil prices ahead of the US print.", src: "https://www.fxstreet.com/news/pound-sterling-price-news-and-forecast-gbp-usd-remains-weaker-as-uk-us-yields-narrow-202608070336", srcName: "FXStreet" },
        { html: "<strong>Legal &mdash; corporate</strong>: the High Court (Ch) dismissed a section 994 unfair-prejudice petition brought by family shareholders of Cambridge Hotel and Lodge Limited in <em>Mohammed Sarwar &amp; Ors v Bilal Sarwar &amp; Anor</em>.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2104", srcName: "National Archives" },
        { html: "<strong>Credit &mdash; strategy</strong>: Legal &amp; General launched a new debt-issuance platform with Finance in Motion and Texel designed to open impact-linked private-credit assets to a wider investor base.", src: "https://alternativecreditinvestor.com/2026/08/06/finance-in-motion-opens-impact-assets-to-investors/", srcName: "Alternative Credit Investor" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-08-06",
      time: "21:20 BST",
      lede: "Gold held near a seven-week high and Treasury yields edged higher as traders braced for Friday's US jobs report following a soft 44,000 ADP print, Carlyle said it raised $17bn in Q2 with credit strategies deploying $7bn as it called an H2 2026 fundraising &lsquo;supercycle&rsquo;, Golub Capital and Palmer Square's listed BDCs both reported softer Q2/Q3 numbers, and the UK confirmed its Autumn Budget for 28 October.",
      bullets: [
        { html: "<strong>US markets</strong>: gold held near a seven-week high and Treasury yields edged higher as traders sharpened their focus on rates ahead of Friday's July jobs report, after ADP's private-payrolls print of just 44,000 &mdash; the weakest since January and well below the ~70,000 consensus &mdash; revived Fed-cut speculation.", src: "https://www.cnbc.com/2026/08/05/private-companies-added-just-44000-workers-in-july-below-expectations-adp-reports.html", srcName: "CNBC" },
        { html: "<strong>Credit &mdash; fundraising</strong>: Carlyle raised $17bn in Q2 2026 (trailing-12-month inflows of $56bn, +10% YoY) and said its credit strategies &mdash; direct lending, liquid credit and opportunistic credit &mdash; deployed $7bn in the quarter, with chief executive Harvey Schwartz describing the firm as &lsquo;entering the supercycle&rsquo; for H2 2026.", src: "https://www.benzinga.com/markets/private-markets/26/08/60964417/carlyle-raises-17-billion-sees-private-credit-pe-growth-accelerating-into-fundraising-supercycle", srcName: "Benzinga" },
        { html: "<strong>Credit &mdash; BDCs</strong>: Golub Capital BDC's fiscal Q3 results showed credit quality improving (adjusted net income recovering to $0.22/share) even as NAV edged down to $14.25/share, while Palmer Square Capital BDC declared a $0.36/share Q3 dividend after Q2 total investment income softened to $27.3m from $31.7m a year earlier.", src: "https://www.palmersquarebdc.com/news-events/press-releases/detail/40/palmer-square-capital-bdc-inc-announces-second-quarter-2026-financial-results", srcName: "Palmer Square" },
        { html: "<strong>UK markets</strong>: the FTSE 100 extended its record run as gold miners provided a boost, even as Prudential and HSBC came under pressure on a China tax-crackdown report.", src: "https://www.proactiveinvestors.com/companies/news/1096553/ftse-100-live-next-and-glencore-provide-results-boost-spacex-tumbles-1096553.html", srcName: "Proactive Investors" },
        { html: "<strong>UK policy</strong>: Chancellor John Healey confirmed the Autumn Budget for Wednesday 28 October 2026, with the OBR to publish its accompanying economic and fiscal forecast the same day &mdash; now the key catalyst for gilt markets after the 30-year yield touched a two-month high on fiscal-flexibility rhetoric from PM Andy Burnham.", src: "https://www.gov.uk/government/publications/chancellor-letter-to-the-treasury-select-committee-tsc-budget-2026-date", srcName: "HM Treasury / GOV.UK" },
      ],
    },
  },
};
