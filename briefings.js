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
      date: "2026-08-07",
      time: "17:29 BST",
      lede: "US payrolls unexpectedly fell 23,000 in July with large downward revisions, trimming Fed hike bets and pulling Treasury yields lower, while easyJet's &pound;5.7bn Apollo takeover drew a second tracked-firm mandate (Macfarlanes for major shareholder easyGroup), Weil advised Antin Infrastructure Partners on a minority-stake sale in Norwegian aquaculture group S&oslash;lvtrans, the High Court let SOCAR's fraud claims against Mubariz Mansimov proceed, and Churchill Asset Management's $16bn senior-lending-program raise surfaced on the wire.",
      bullets: [
        { html: "<strong>US data watch</strong>: nonfarm payrolls fell 23,000 in July &mdash; the first drop in months &mdash; with the unemployment rate easing to 4.1% and wage growth slowing to 3.2% YoY, the softest since 2021; Treasury yields fell and traders trimmed September Fed hike bets.", src: "https://www.bloomberg.com/news/articles/2026-08-07/us-treasuries-rally-as-soft-jobs-data-trims-fed-rate-hike-bets", srcName: "Bloomberg" },
        { html: "<strong>UK markets</strong>: the UK housing market stayed in &lsquo;suspended animation&rsquo; while Britain curbed power exports to Europe to preserve domestic supplies.", src: "https://www.ft.com/content/2434fbcc-b8b5-4bda-a82d-1b08c6a015f8", srcName: "Financial Times" },
        { html: "<strong>Credit &mdash; fundraising</strong>: Churchill Asset Management, Nuveen's US middle-market direct-lending affiliate, raised more than $16bn for the fifth vintage of its flagship senior loan strategy &mdash; its largest capital raise to date, from roughly 325 institutional and high-net-worth investors.", src: "https://www.businesswire.com/news/home/20260121411398/en/Churchill-Asset-Management-Raises-over-$16-Billion-for-Senior-Lending-Program", srcName: "Business Wire" },
        { html: "<strong>Legal &mdash; corporate</strong>: Macfarlanes advised Sir Stelios Haji-Ioannou and easyGroup Ltd, easyJet's ~15.31% shareholder, on Apollo's &pound;5.7bn recommended takeover offer &mdash; a separate mandate to Clifford Chance's advice to easyJet itself.", src: "https://www.macfarlanes.com/insights/102ngds/macfarlanes-advises-sir-stelios-haji-ioannou-and-easygroup-ltd-on-5-7bn-recommen/", srcName: "Macfarlanes" },
        { html: "<strong>Legal &mdash; disputes</strong>: the Commercial Court dismissed an application to set aside permission for SOCAR to serve fraud and asset-dissipation claims on Mubariz Mansimov out of the jurisdiction, finding a serious issue to be tried on the section 423 and conspiracy claims tied to roughly $240m of arbitration awards.", src: "https://caselaw.nationalarchives.gov.uk/ewhc/comm/2026/2102", srcName: "National Archives" },
      ],
    },
  },
};
