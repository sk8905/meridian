// =============================================================================
// dashboard/js/data.js — CURATED seed + reference data for the Dashboard tab
// (Macro / Equities / Credit overviews). Live figures (equity index closes,
// ICE BofA OAS credit spreads, VIX) are fetched at runtime from the Worker
// (/api/markets, FRED/Stooq, edge-cached) and OVERRIDE the `level`/`spread`
// seeds here; everything else (sources, as-of dates, IPO pipeline, the Stress
// tracker, sector list) is curated and refreshed by the routine. Never
// fabricate — every figure keeps a real source URL + asOf. Values verified
// July 2026.
// =============================================================================

// ---- Equities -------------------------------------------------------------
// Major global indices — seed close + YTD; the live feed refreshes `level`/`ytd`.
export const EQ_INDICES = [
  {
    "id": "spx",
    "name": "S&P 500",
    "region": "US",
    "level": 7659.44,
    "ytd": 11.89,
    "asOf": "2026-10-16",
    "stooq": "^spx",
    "source": "https://finance.yahoo.com/quote/%5EGSPC",
    "keyMoment": {
      "text": "The S&amp;P 500 fell 1.09% on Friday to 7,659.44 as worries that tech companies are borrowing too much for the AI buildout drove a sell-off, with neocloud CoreWeave down nearly 12% and September CPI at 3.7% y/y stoking Fed-hike fears.",
      "src": "https://www.cnbc.com/2026/10/15/stock-market-today-live-updates.html",
      "srcName": "CNBC",
      "date": "2026-10-16"
    }
  },
  {
    "id": "ndq",
    "name": "Nasdaq Composite",
    "region": "US",
    "level": 26140.03,
    "ytd": 12.47,
    "asOf": "2026-10-16",
    "stooq": "^ndq",
    "source": "https://finance.yahoo.com/quote/%5EIXIC",
    "keyMoment": {
      "text": "The Nasdaq Composite fell 2.14% on Friday to 26,140.03 and lost 4.5% on the week, breaking a four-week winning streak with its worst weekly decline since June, pressured by the AI sell-off and higher oil prices.",
      "src": "https://www.cnbc.com/2026/10/15/stock-market-today-live-updates.html",
      "srcName": "CNBC",
      "date": "2026-10-16"
    }
  },
  {
    "id": "dji",
    "name": "Dow Jones",
    "region": "US",
    "level": 52002.41,
    "ytd": 8.2,
    "asOf": "2026-10-16",
    "stooq": "^dji",
    "source": "https://finance.yahoo.com/quote/%5EDJI",
    "keyMoment": {
      "text": "The Dow slipped 0.3% on Friday to 52,002.41, cushioned relative to the tech-heavy indices as the AI-debt sell-off hit the Nasdaq hardest.",
      "src": "https://finance.yahoo.com/markets/live/stock-market-today-dow-sp-500-nasdaq-futures-mixed-amid-volatile-week-112939401.html",
      "srcName": "Yahoo Finance",
      "date": "2026-10-16"
    }
  },
  {
    "id": "rut",
    "name": "Russell 2000",
    "region": "US",
    "level": 2721.37,
    "ytd": 9.65,
    "asOf": "2026-10-16",
    "stooq": "^rut",
    "source": "https://finance.yahoo.com/quote/%5ERUT"
  },
  {
    "id": "sxxp",
    "name": "Stoxx Europe 600",
    "region": "Europe",
    "level": 637.94,
    "ytd": 7.62,
    "asOf": "2026-10-19",
    "stooq": "^stoxx",
    "source": "https://finance.yahoo.com/quote/%5ESTOXX"
  },
  {
    "id": "ukx",
    "name": "FTSE 100",
    "region": "Europe",
    "level": 10741.96,
    "ytd": 8.16,
    "asOf": "2026-10-19",
    "stooq": "^ftse",
    "source": "https://finance.yahoo.com/quote/%5EFTSE",
    "keyMoment": {
      "text": "The FTSE 100 slid to a two-week low on Tuesday, dragged down by heavyweight energy stocks as oil prices retreated, while British American Tobacco fell after issuing downbeat guidance.",
      "src": "https://live.euronext.com/en/financial-news/ftse-100-hits-two-week-low-energy-stocks-slide",
      "srcName": "Reuters (via Euronext)",
      "date": "2026-09-29"
    }
  },
  {
    "id": "dax",
    "name": "DAX",
    "region": "Europe",
    "level": 25279.9,
    "ytd": 3.22,
    "asOf": "2026-10-19",
    "stooq": "^dax",
    "source": "https://finance.yahoo.com/quote/%5EGDAXI"
  },
  {
    "id": "cac",
    "name": "CAC 40",
    "region": "Europe",
    "level": 7833.91,
    "ytd": -3.87,
    "asOf": "2026-10-19",
    "stooq": "^cac",
    "source": "https://finance.yahoo.com/quote/%5EFCHI"
  },
  {
    "id": "nkx",
    "name": "Nikkei 225",
    "region": "Asia",
    "level": 64916.7,
    "ytd": 28.96,
    "asOf": "2026-10-19",
    "stooq": "^nkx",
    "source": "https://finance.yahoo.com/quote/%5EN225",
    "keyMoment": {
      "text": "The Nikkei 225 rose 2.0% to 66,826 on Wednesday, extending the region's chip-led strength as investors looked to US PCE data later in the day.",
      "src": "https://nordfx.com/market-news/market-pulse-september-30-2026",
      "srcName": "NordFX",
      "date": "2026-09-30"
    }
  },
  {
    "id": "hsi",
    "name": "Hang Seng",
    "region": "Asia",
    "level": 24186.83,
    "ytd": -5.63,
    "asOf": "2026-10-16",
    "stooq": "^hsi",
    "source": "https://finance.yahoo.com/quote/%5EHSI",
    "keyMoment": {
      "text": "The Hang Seng declined 0.2% to 24,472 on Wednesday while the Shanghai Composite rose 0.3% to 3,840 and the Kospi fell 0.4% to 6,843.",
      "src": "https://nordfx.com/market-news/market-pulse-september-30-2026",
      "srcName": "NordFX",
      "date": "2026-09-30"
    }
  }
];

// S&P 500 sectors — YTD %, sorted best→worst by the view. S&P DJI's sector dashboard
// is not reachable, so these are the SPDR Select Sector ETFs' YTD PRICE change (31 Dec
// 2025 close → latest close, Yahoo Finance): a labelled ETF proxy, not the sector indices.
export const EQ_SECTORS = {
  "asOf": "2026-10-13",
  "label": "S&P 500 sectors (SPDR sector ETFs) — YTD price",
  "source": "https://finance.yahoo.com/quote/XLE/history/",
  "rows": [
    {
      "name": "Energy",
      "ytd": 50.3
    },
    {
      "name": "Information Technology",
      "ytd": 36.33
    },
    {
      "name": "Materials",
      "ytd": 9.64
    },
    {
      "name": "Health Care",
      "ytd": 9.6
    },
    {
      "name": "Industrials",
      "ytd": 8.74
    },
    {
      "name": "Consumer Staples",
      "ytd": 8.38
    },
    {
      "name": "Real Estate",
      "ytd": 3.67
    },
    {
      "name": "Financials",
      "ytd": 0.09
    },
    {
      "name": "Utilities",
      "ytd": -1.92
    },
    {
      "name": "Communication Services",
      "ytd": -4.62
    },
    {
      "name": "Consumer Discretionary",
      "ytd": -5.9
    }
  ]
};

// Forward P/E of the majors (valuation) — percentile context computed in the view.
export const EQ_VALUATION = [
  {
    "name": "S&P 500",
    "fwdPE": 19.1,
    "asOf": "2026-10-09",
    "source": "https://advantage.factset.com/hubfs/Website/Resources%20Section/Research%20Desk/Earnings%20Insight/EarningsInsight_100926.pdf"
  },
  {
    "name": "Stoxx Europe 600",
    "fwdPE": 14.6,
    "asOf": "2026-08-26",
    "source": "https://www.kitco.com/news/off-the-wire/2026-08-26/stoxx-600-seen-rising-modestly-year-end-poll-shows"
  },
  {
    "name": "FTSE 100",
    "fwdPE": 13.35,
    "asOf": "2025-12-31",
    "source": "https://siblisresearch.com/data/ftse-100-cape-pe-yield/"
  },
  {
    "name": "Nikkei 225",
    "fwdPE": 21,
    "asOf": "2026-04-30",
    "source": "https://en.macromicro.me/charts/95007/japan-nikkei225"
  }
];

// Volatility gauges — VIX / VSTOXX. Live feed refreshes `level`; bands in the view.
export const EQ_VOL = [
  { id: "vix",    name: "VIX",    level: 15.21, asOf: "2026-10-12", fred: "VIXCLS", source: "https://fred.stlouisfed.org/series/VIXCLS" },
  { id: "vstoxx", name: "VSTOXX", level: 20.60, asOf: "2026-07-10", fred: null,     source: "https://tradingeconomics.com/vstoxx:ind" },
];

// IPO / ECM pipeline — notable 2026 listings (curated, refreshed by the routine).
export const EQ_IPO = [
  { company: "SpaceX",       exchange: "Nasdaq",  size: "$75bn raised",   timing: "priced 2026-06",   status: "Priced",   source: "https://money.usnews.com/investing/articles/new-and-upcoming-ipos-in-2026" },
  { company: "SK hynix (US)", exchange: "Nasdaq", size: "$26.5bn",        timing: "priced 2026-07-10", status: "Priced",   source: "https://stockanalysis.com/ipos/2026/" },
  { company: "Quantinuum",   exchange: "Nasdaq",  size: "$1.68bn",        timing: "priced 2026-06",   status: "Priced",   source: "https://money.usnews.com/investing/articles/new-and-upcoming-ipos-in-2026" },
  { company: "Cerebras",     exchange: "Nasdaq",  size: "$5.55bn raised", timing: "priced 2026-05-13", status: "Priced",  source: "https://www.cnbc.com/2026/05/13/cerebras-prices-ipo-above-expected-range-wall-street-expects-ai-flood.html" },
  { company: "OpenAI",       exchange: "US (TBD)", size: "large-cap",     timing: "2026 H2",          status: "Filed",    source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
  { company: "Anthropic",    exchange: "US (TBD)", size: "~$965bn valn",  timing: "filed 2026-06",    status: "Filed",    source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
  { company: "Discord",      exchange: "US (TBD)", size: "confidential",  timing: "filed 2026-01",    status: "Filed",    source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
  { company: "Databricks",   exchange: "Nasdaq",  size: "$134bn valn",    timing: "2026 H2",          status: "Rumoured", source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
  { company: "Revolut",      exchange: "Nasdaq",  size: "~$75bn target",  timing: "2026 H2",          status: "Rumoured", source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
  { company: "Crusoe Energy", exchange: "US (TBD)", size: "~$13bn target", timing: "2026 Q4",         status: "Rumoured", source: "https://news.clateway.com/upcoming-ipos-2026-spacex-openai-10-more-to-watch-43090.html" },
  { company: "Stripe",       exchange: "US (TBD)", size: "$159bn valn",   timing: "2027+",            status: "Rumoured", source: "https://www.allocations.com/insights/spacex-openai-anthropic-stripe-databricks-ipo-timeline-2026" },
  { company: "Canva",        exchange: "US (TBD)", size: "$42bn valn",    timing: "2027",             status: "Rumoured", source: "https://valueaddvc.com/blog/ipo-pipeline-2026-every-company-expected-to-go-public-this-year-and-current-status" },
];

// ---- Credit ---------------------------------------------------------------
// "Stress" — high-profile distressed / stressed corporate debtors in focus.
// Each verified & sourced; refreshed by the routine. Newest update first (Europe
// expanded to ~40 names, review 2026-10-15). hq "City, CC" or just "CC" when the
// city was not confirmed in a source.
export const CR_STRESS = [
  {"name": "Venator", "sector": "Chemicals (TiO2)", "hq": "UK", "debt": null, "status": "Administration / insolvency", "note": "After the group's collapse and rescue of operating units, A&M liquidators of a Cayman holdco sought court-supervised liquidation.", "latest": "2026-10-09", "source": "https://globalrestructuringreview.com/article/venators-cayman-unit-seeks-court-supervised-liquidation-after-parent-groups-collapse"},
  {"name": "Galeria", "sector": "Department stores", "hq": "DE", "debt": null, "status": "Administration / insolvency", "note": "Fourth insolvency filing since 2020 at Düsseldorf court (502 IN 258/26); ~83 stores, sales down ~25% in late September.", "latest": "2026-10-09", "source": "https://globalrestructuringreview.com/article/galeria-files-fourth-insolvency-2020-appoints-same-administrator"},
  {"name": "TalkTalk", "sector": "Telecoms / broadband", "hq": "UK", "debt": null, "status": "Administration / insolvency", "note": "Consumer and wholesale arms sold to BT via ~£400m pre-pack administration (A&M); creditors left owed hundreds of millions, equity wiped.", "latest": "2026-10-05", "source": "https://www.itv.com/news/2026-10-05/bt-agrees-rescue-deal-to-save-talktalk-from-administration"},
  {"name": "Schleich", "sector": "Toys", "hq": "Schwäbisch Gmünd, DE", "debt": "€189m", "status": "Scheme / safeguard", "note": "English court reserved judgment on sanction of Part 26 scheme handing control to lenders after valuation evidence narrowed gap vs insolvency.", "latest": "2026-10-05", "source": "https://globalrestructuringreview.com/article/english-court-reserves-judgment-schleich-scheme-after-recovery-gap-narrows"},
  {"name": "Thames Water", "sector": "Water utility", "hq": "Reading, UK", "debt": null, "status": "Restructuring plan", "note": "Launched a second Part 26A restructuring plan in under two years amid speculation over public ownership / special administration.", "latest": "2026-09-22", "source": "https://globalrestructuringreview.com/article/thames-water-returns-part-26a-public-ownership-debate-intensifies"},
  {"name": "Arxada", "sector": "Specialty chemicals", "hq": "CH", "debt": "€3.6bn", "status": "Scheme / safeguard", "note": "English Part 26 scheme sanctioned 15 Sept: three-year maturity extension, no haircut, CHF200m sponsor equity from Cinven/Bain.", "latest": "2026-09-15", "source": "https://ionanalytics.com/insights/debtwire/arxada-ae-scheme-of-arrangement-sanctioned-by-english-high-court/"},
  {"name": "Emeria (ex-Foncia)", "sector": "Real-estate services", "hq": "FR", "debt": "€3.6bn", "status": "Refinancing risk", "note": "Largest lenders signed NDAs to negotiate; sponsors Partners Group/TA weigh ~€350m new equity and moving debt to holdco; H1 loss €108m.", "latest": "2026-09-10", "source": "https://briefs.co/news/emeria-s-creditors-sign-ndas-as-owners-weigh-350-million-lif"},
  {"name": "Seqens", "sector": "Pharma chemicals", "hq": "FR", "debt": "€1.06bn (€930m TLB + €130m RCF)", "status": "Debt-for-equity", "note": "Agreement in principle with key financial stakeholders: senior lenders become owners, Bpifrance stays minority; closing targeted by end-2026.", "latest": "2026-09-10", "source": "https://www.lw.com/en/news/2026/09/latham-advises-seqens-on-its-financial-restructuring"},
  {"name": "Enerparc", "sector": "Solar IPP", "hq": "Hamburg, DE", "debt": null, "status": "Administration / insolvency", "note": "Filed for insolvency; Hamburg court appointed Stefan Denkhaus provisional administrator on 7 Sept; ~5.5 GW portfolio keeps operating.", "latest": "2026-09-07", "source": "https://www.enerparc.de/en/company/newsroom/news-detail/solar-park-owner-enerparc-ag-files-for-insolvency"},
  {"name": "Cerba Healthcare", "sector": "Diagnostics / labs", "hq": "FR", "debt": "~€5bn", "status": "In restructuring", "note": "EQT-backed lab group opened court-supervised conciliation at the Nanterre economic court to renegotiate its ~€5bn debt; net debt >€4.9bn at end-June.", "latest": "2026-09-04", "source": "https://pipelineroad.com/news/20260904-eqt-backed-cerba-healthcare-seeks-french-court-supervised-re"},
  {"name": "airBaltic", "sector": "Airline", "hq": "Riga, LV", "debt": null, "status": "Refinancing risk", "note": "Agreed up to €257m interim financing via 25%-coupon bonds due Feb 2027, subject to bondholder vote; Fitch rated it CCC-.", "latest": "2026-09-03", "source": "https://runwaygirlnetwork.com/2026/09/airbaltic-agrees-terms-for-up-to-e257-million-of-interim-financing/"},
  {"name": "Polestar", "sector": "Electric vehicles", "hq": "SE", "debt": null, "status": "Refinancing risk", "note": "H1 2026 accounts flag material going-concern doubt tied to renegotiating the Club Loan expiring early 2027 and covenant compliance.", "latest": "2026-09-03", "source": "https://www.sec.gov/Archives/edgar/data/0001884082/000188408226000013/psny-20260630.htm"},
  {"name": "Relatech", "sector": "IT services", "hq": "Milan, IT", "debt": "~€50m bank debt", "status": "In restructuring", "note": "Entered composizione negoziata over Bregal LBO debt from Banca Ifis/Banco BPM; banks weighing sale of the loans.", "latest": "2026-09-02", "source": "https://www.milanofinanza.it/news/relatech-banche-studiano-cessione-crediti-per-50-mln-2715936"},
  {"name": "Lowell Group", "sector": "Debt collection", "hq": "UK", "debt": "~€2bn", "status": "Debt-for-equity", "note": "€2bn recap announced 28 Aug cuts debt by >£1bn, >£500m new money, ownership to Arini-led creditor group; closing Q4 2026/Q1 2027.", "latest": "2026-09-01", "source": "https://www.willkie.com/news/2026/09/willkie-advises-key-creditor-group-on-2-billion-lowell-group-recapitalisation"},
  {"name": "Aston Martin Lagonda", "sector": "Automotive", "hq": "Gaydon, UK", "debt": "$1.85bn-equiv. 2029 bonds", "status": "Distressed exchange / LME", "note": "Up to £550m HPS-led priming financing moved assets from bondholders; Arini/Tresidor sought US discovery ahead of a UK claim.", "latest": "2026-08-26", "source": "https://www.just-auto.com/newsletters/aston-martin-bondholders-seek-us-discovery"},
  {"name": "Grupo Antolin", "sector": "Auto parts", "hq": "Burgos, ES", "debt": "~€1.25bn", "status": "Restructuring plan", "note": "Spanish plan backed by banks; holdout 2028/2030 noteholders fought it; standstill pauses US, English and Spanish proceedings.", "latest": "2026-08-20", "source": "https://globalrestructuringreview.com/article/grupo-antolin-enters-standstill-pauses-us-english-and-spanish-proceedings"},
  {"name": "Ingenico", "sector": "Payment terminals", "hq": "FR", "debt": "€1.1bn TLB", "status": "Debt-for-equity", "note": "Capital restructuring converts part of debt into equity with €150m new money led by Pimco; Apollo exits after interest-payment strain.", "latest": "2026-08-17", "source": "https://en.ilsole24ore.com/art/ingenico-150-million-investors-pimco-and-apollo-lead-capital-outflow-AJsoDAo"},
  {"name": "Pandion", "sector": "Real estate development", "hq": "Cologne, DE", "debt": null, "status": "Missed payment", "note": "Missed a €3.6m bond coupon in August, months after extending bond maturities, then filed for self-administration in Cologne.", "latest": "2026-08-14", "source": "https://globalrestructuringreview.com/article/german-real-estate-developer-pandion-files-self-administration"},
  {"name": "TG Jones", "sector": "Retail (stationery)", "hq": "Swindon, UK", "debt": null, "status": "Restructuring plan", "note": "Part 26A plans sanctioned after changes proposed by British Land; c.£15m new money from Modella, estate cut from ~451 stores.", "latest": "2026-08-11", "source": "https://globalrestructuringreview.com/article/negotiations-british-land-saved-tg-jones-plans-english-court-says"},
  {"name": "Accell Group", "sector": "Bicycles", "hq": "Heerenveen, NL", "debt": null, "status": "Administration / insolvency", "note": "Amsterdam court declared Dutch entities bankrupt 11 Aug, six months after KKR ceded control to lenders; Raleigh/Lapierre also in proceedings.", "latest": "2026-08-11", "source": "https://nltimes.nl/2026/08/11/dutch-bicycle-maker-accell-owner-batavus-sparta-declared-bankrupt"},
  {"name": "Bigben Interactive", "sector": "Gaming accessories", "hq": "Lesquin, FR", "debt": "€73.2m", "status": "Scheme / safeguard", "note": "Filed for accelerated safeguard after conciliation: €47.2m of bonds/guarantees to equity, €26m into ORAR, €25m rights issue; massive dilution.", "latest": "2026-08-04", "source": "https://www.boursorama.com/bourse/actualites/bigben-accord-de-principe-des-principaux-creanciers-financiers-et-depot-d-une-requete-aux-fins-d-ouverture-d-une-procedure-de-sauvegarde-acceleree-f53e4776c9c64a672b6c9acc08995642"},
  {"name": "Branicks Group", "sector": "Real estate", "hq": "Frankfurt, DE", "debt": "€579.5m (notes + SSD/NSV)", "status": "Distressed exchange / LME", "note": "Lock-ups on €400m Sept-2026 notes: senior cut to €258.8m to 2030, €219.5m subordinated to 2038 at 15% PIK, €95m new money.", "latest": "2026-07-30", "source": "https://live.deutsche-boerse.com/news/EQS-News-BRANICKS-Group-AG-Reaches-Comprehensive-Restructuring-Agreement-with-Its-Creditors-db05d6da-5209-4fb1-b8ee-a16c4bfe5623"},
  {"name": "Pfleiderer", "sector": "Wood-based panels", "hq": "Neumarkt, DE", "debt": null, "status": "Debt-for-equity", "note": "Support agreement transfers all shares to bondholders with significant debt reduction; bondholders commit ~€80m fresh capital.", "latest": "2026-07-30", "source": "https://www.pfleiderer.com/fileadmin/content/Images/Press/Press_Releases_PDF/2026_07_Pfleiderer_gibt_Finanzierungsvereinbarung_bekannt_DE.pdf"},
  {"name": "Varta", "sector": "Batteries", "hq": "Ellwangen, DE", "debt": null, "status": "Administration / insolvency", "note": "Filed self-administered insolvency a year after its StaRUG plan; Porsche/Tojner declined funding; Deutsche Bank-led creditors eye unit.", "latest": "2026-07-29", "source": "https://evertiq.com/news/2026-07-29-german-battery-maker-varta-files-insolvency-applications"},
  {"name": "Tullow Oil", "sector": "Oil & gas E&P", "hq": "London, UK", "debt": "~$1.2bn bonds", "status": "Refinancing risk", "note": "After April 2026 bond exchange, weighing a 2027 refinancing and company/asset sale; springing maturity tied to a Sept-2027 sale contract.", "latest": "2026-07-28", "source": "https://www.briefs.co/?p=13876"},
  {"name": "Casino Guichard-Perrachon", "sector": "Food retail", "hq": "Saint-Étienne, FR", "debt": null, "status": "Scheme / safeguard", "note": "Bank creditors agreed in principle to amend 2024 safeguard plans; TLB lenders refused to extend consent and threatened to seek plan termination.", "latest": "2026-07-24", "source": "https://www.optionfinance.fr/info-financiere-en-continu/d/2026-07-24-casino-obtient-un-accord-de-principe-de-ses-creanciers-bancaires.html"},
  {"name": "Victoria plc", "sector": "Flooring", "hq": "Kidderminster, UK", "debt": "€166.6m 2028 SSNs", "status": "Distressed exchange / LME", "note": ">75% (later >90%) of 2028 noteholders backed TSA; refinancing to cut senior debt and prefs by ≥£300m via new 2031 notes.", "latest": "2026-07-21", "source": "https://www.willkie.com/news/2026/07/willkie-advises-ad-hoc-group-of-bondholders-in-victoria-plcs-financial-restructuring"},
  {"name": "Deutsche Glasfaser", "sector": "Fibre broadband", "hq": "Borken, DE", "debt": "€7bn", "status": "Scheme / safeguard", "note": "€7bn senior debt recapitalised via single-class English scheme (sanctioned June); >€1.2bn new capital incl. EQT/OMERS equity.", "latest": "2026-07-20", "source": "https://www.linklaters.com/about-us/news-and-deals/deals/2026/july/linklaters-advises-syndicate-of-lenders-and-hedge-counterparties"},
  {"name": "South East Water", "sector": "Water utility", "hq": "UK", "debt": null, "status": "Refinancing risk", "note": "Annual report flags material going-concern uncertainty: funded to July 2027, needs new loan facilities; Moody's cut it to junk.", "latest": "2026-07-17", "source": "https://britbrief.co.uk/business/acquisitions/south-east-water-warns-over-survival-as-funds-dry-up.html"},
  {"name": "BayWa", "sector": "Agri / energy conglomerate", "hq": "Munich, DE", "debt": "€5.2bn", "status": "In restructuring", "note": "Reached preliminary understanding to revise its 2025 StaRUG plan after guiding to significantly lower 2027–28 earnings.", "latest": "2026-07-03", "source": "https://globalrestructuringreview.com/article/german-conglomerate-baywa-adjust-terms-of-starug"},
  {"name": "Selecta", "sector": "Vending / food services", "hq": "CH", "debt": null, "status": "Distressed exchange / LME", "note": "Amsterdam appeal court let excluded noteholders challenge share-pledge enforcement behind 2025 LME; Selecta may appeal to Supreme Court.", "latest": "2026-07-01", "source": "https://globalrestructuringreview.com/article/excluded-noteholders-can-challenge-dutch-share-pledge-enforcement-selecta-granted-right-appeal"},
  {"name": "SpaceX", "sector": "Aerospace", "hq": "Hawthorne, US", "debt": "$25bn bonds", "status": "Bonds below issue", "note": "Inaugural $25bn multi-tranche bond (post-June IPO, to repay a $20bn bridge) — all five tranches slipped below issue price; 2056s fell to ~94.5.", "latest": "2026-07", "source": "https://www.advisorperspectives.com/articles/2026/06/26/bond-traders-stunned-losses-spacexs-debt-growing"},
  {"name": "EchoStar (Dish DBS)", "sector": "Satellite/Telecom", "hq": "Englewood, US", "debt": "~$10bn", "status": "Chapter 11", "note": "Prepackaged Chapter 11 on ~$10bn after delays to a $23bn AT&T spectrum sale left it unable to repay $2bn of 7.75% notes; 88%+ creditor support.", "latest": "2026-07", "source": "https://satnews.com/2026/07/01/echostars-dish-dbs-initiates-prepackaged-chapter-11-restructuring-to-resolve-impending-senior-note-maturities/"},
  {"name": "Maisons du Monde", "sector": "Home furnishings retail", "hq": "Vertou, FR", "debt": null, "status": "Debt-for-equity", "note": "Conciliation protocol with Alteri/Eicos consortium buying bank debt; existing shareholders diluted to <5%; shares fell ~31% on 22 June.", "latest": "2026-06-22", "source": "https://www.optionfinance.fr/info-financiere-en-continu/d/2026-06-22-oddo-bhf-reduit-considerablement-sa-cible-sur-maisons-du-monde-le-titre-seffondre.html"},
  {"name": "Duro Felguera", "sector": "Engineering", "hq": "Gijón, ES", "debt": "€980m+ affected", "status": "Restructuring plan", "note": "Gijón commercial court homologated plan over >€980m liabilities incl. €408m Djelfa claims; Grupo Prodi takes control via €10m raise.", "latest": "2026-06-16", "source": "https://www.merca2.es/2026/06/16/duro-felguera-reestructuracion-45-por-ciento-2398124/"},
  {"name": "Poundstretcher", "sector": "Discount retail", "hq": "Huddersfield, UK", "debt": null, "status": "Restructuring plan", "note": "Part 26A plan sanctioned: ~298 leases compromised across 14 classes; Fortress shareholder loan extended to 2029 releasing £4.5m.", "latest": "2026-06-12", "source": "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/1438"},
  {"name": "Las Iguanas (Big Table Group)", "sector": "Restaurants", "hq": "UK", "debt": "~£37m loan notes", "status": "Restructuring plan", "note": "Part 26A plan sanctioned writing off ~£37m of loan-note debt with ~£3m parent new money and landlord rent compromises.", "latest": "2026-06-05", "source": "https://www.bailii.org/ew/cases/EWHC/Ch/2026/2051.html"},
  {"name": "Atalian", "sector": "Facility services", "hq": "Paris, FR", "debt": "€918.5m PIK notes", "status": "Debt-for-equity", "note": "Recap backed by >60% of 8.5% PIK notes due 2028: ~66% of debt equitised, rest extended to H2 2031, up to €140m super senior new money.", "latest": "2026-06-01", "source": "https://atalian.com/wp-content/uploads/2026/06/20260601-market-update-PR-re-Agreement-vEN.pdf"},
  {"name": "New Fortress Energy", "sector": "Energy / LNG", "hq": "New York, US", "debt": "~$9.3bn", "status": "In restructuring", "note": "Going-concern doubt amid covenant risk and springing maturities on $510.9m 2026 notes; entered forbearance after missing a 2028 TLB interest payment.", "latest": "2026-06", "source": "https://news.bloomberglaw.com/bankruptcy-law/new-fortress-energy-bonds-loan-tumble-on-refinancing-concerns"},
  {"name": "REC Silicon", "sector": "Polysilicon", "hq": "NO", "debt": null, "status": "Refinancing risk", "note": "Warned it lacks cash for debt service without Hanwha support; extended a $10m Hanwha loan to May 2027.", "latest": "2026-05-27", "source": "https://filingreader.com/news-wire/oslo/2026-05-27/rec-silicon-extends-10m-loan-amid-liquidity-warning"},
  {"name": "Altice International", "sector": "Telecoms", "hq": "Luxembourg, LU", "debt": "~€8bn net", "status": "Distressed exchange / LME", "note": "Converted €2.5bn intragroup debt into MEO equity after removing Portugal and Dominican Republic from creditors' collateral pool.", "latest": "2026-05-13", "source": "https://econews.pt/2026/05/13/altice-converts-e2-5bn-of-meo-debt-into-equity/"},
  {"name": "Tele Columbus (Pyur)", "sector": "Cable / broadband", "hq": "Berlin, DE", "debt": null, "status": "Refinancing risk", "note": "Arini, BlackRock, Helikon, PSquared and Sona (~70% of bonds/loans) signed a co-op ahead of debt talks after the 2024 scheme.", "latest": "2026-05-12", "source": "https://www.bloomberg.com/news/articles/2026-05-12/tele-columbus-creditors-unite-ahead-of-potential-debt-talks"},
  {"name": "Gigaclear", "sector": "Fibre broadband", "hq": "Abingdon, UK", "debt": "~£1bn", "status": "Debt-for-equity", "note": "Lenders incl. National Wealth Fund, NatWest, Lloyds took control; sponsors wiped out; trade press cites haircut of up to ~40%.", "latest": "2026-04-17", "source": "https://bratby.law/gigaclear-restructuring-uk-altnet-lender-reset/"},
  {"name": "Grifols", "sector": "Healthcare", "hq": "Barcelona, ES", "debt": "€9.6bn", "status": "Refinancing risk", "note": "Blood-plasma group, leverage 4.2x, refinancing a 2027 maturity wall in stages; risk elevated after the 2024 short-seller episode and failed take-private.", "latest": "2026-02", "source": "https://www.stocktitan.net/sec-filings/GRFS/20-f-grifols-sa-files-annual-report-foreign-issuer-25ea80ea26f9.html"},
  {"name": "Altice France (SFR)", "sector": "Telecoms", "hq": "Paris, FR", "debt": "€15.5bn net", "status": "In restructuring", "note": "Europe's largest restructuring cut ~€8.6bn term debt via debt-for-equity (creditors 45%); Drahi retains control amid asset-shift tensions.", "latest": "2025-12", "source": "https://www.bloomberg.com/news/articles/2025-12-02/billionaire-drahi-strikes-back-with-moves-bashing-altice-lenders"},
  {"name": "Ardagh Group", "sector": "Packaging", "hq": "Luxembourg", "debt": "$8.5bn net", "status": "In restructuring", "note": "Recapitalisation swapped ~$4.3bn senior unsecured & PIK for equity; unsecured bondholders took 92.5%; net leverage 6.0x from 7.4x.", "latest": "2025-11", "source": "https://www.kirkland.com/news/press-release/2025/11/kirkland-advises-ardagh-group-on-successful-recapitalization"},
  {"name": "Wolfspeed", "sector": "Semiconductors", "hq": "Durham, US", "debt": "$2.1bn", "status": "Emerged from Ch.11", "note": "Silicon-carbide chipmaker filed prepackaged Chapter 11 in Jul 2025, emerged after 91 days cutting debt ~70% and extending maturities to 2030.", "latest": "2025-09", "source": "https://investor.wolfspeed.com/news/news-details/2025/Wolfspeed-Successfully-Completes-Financial-Restructuring-Emerges-as-Financially-Stronger-Company-Well-Positioned-in-Silicon-Carbide-Market/default.aspx"},
];

// Listed bonds of the stressed names above, keyed by the CR_STRESS `name` (kept apart
// from the stress rows so a routine rewrite of a row never drops them). Each line is
// TradingView's own record of the issue (issuer, coupon, maturity, ISIN — `src` is its
// symbol page) on a venue whose quote TradingView's free embeddable widget can show
// (Tradegate · gettex · Frankfurt · Munich; LSE / LuxSE / FINRA bond quotes are
// TradingView-only). `tv` = the widget symbol. `checked` = the day the widget was seen
// showing a current quote on that venue; lines with no quote in the last month, matured
// issues and pre-restructuring issues were left out. `perp: true` = perpetual.
// `px` = a news-quoted price {v | text (a quoted range), asOf, src, outlet, quote,
// aggregator?} (cents / % of par), only where a dated article states the number — never
// inferred; shown as "57 (28 Sep 26)". Where there is no free live quote the press price
// is kept as the line's only price, however old (owner 2026-10-16; `asOf` may be a
// month, "2026-05", when the article gives no day); such a line (`tv`
// null) needs no ISIN when the article names none — `bond` then carries the article's
// description, and `maturity` may be a year. See refresh-routines §bonds.
export const CR_BONDS = [
  {"name": "Thames Water", "issuer": "Thames Water Utilities Finance Plc", "coupon": 4.0, "maturity": "2029-04-18", "isin": "XS2576550326", "tv": "TRADEGATE:XS257655032", "src": "https://www.tradingview.com/symbols/TRADEGATE-XS257655032/", "checked": "2026-10-16", "px": null},
  {"name": "Thames Water", "issuer": "Thames Water Utilities Finance Plc", "coupon": 0.875, "maturity": "2030-01-31", "isin": "XS2438026440", "tv": "TRADEGATE:XS243802644", "src": "https://www.tradingview.com/symbols/TRADEGATE-XS243802644/", "checked": "2026-10-16", "px": null},
  {"name": "Thames Water", "issuer": "Thames Water Utilities Finance Plc", "coupon": 4.375, "maturity": "2033-01-18", "isin": "XS2576550672", "tv": "TRADEGATE:XS257655067", "src": "https://www.tradingview.com/symbols/TRADEGATE-XS257655067/", "checked": "2026-10-16", "px": null},
  {"name": "Thames Water", "issuer": "Thames Water Utilities Finance Plc", "coupon": 1.25, "maturity": "2034-01-31", "isin": "XS2438026366", "tv": "TRADEGATE:729A", "src": "https://www.tradingview.com/symbols/TRADEGATE-729A/", "checked": "2026-10-16", "px": null},
  {"name": "Emeria (ex-Foncia)", "issuer": "Emeria SAS", "coupon": 3.375, "maturity": "2028-03-31", "isin": "XS2324364251", "tv": "TRADEGATE:XS232436425", "src": "https://www.tradingview.com/symbols/TRADEGATE-XS232436425/", "checked": "2026-10-16", "px": null},
  {"name": "Cerba Healthcare", "issuer": "Cerba Healthcare SA", "coupon": 3.5, "maturity": "2028-05-31", "isin": "XS2343000241", "tv": "TRADEGATE:XS234300024", "src": "https://www.tradingview.com/symbols/TRADEGATE-XS234300024/", "checked": "2026-10-16", "px": null},
  {"name": "airBaltic", "issuer": "AS Air Baltic Corporation", "coupon": 16.5, "maturity": "2029-08-14", "isin": "XS2800678224", "tv": "TRADEGATE:XS280067822", "src": "https://www.tradingview.com/symbols/TRADEGATE-XS280067822/", "checked": "2026-10-16", "px": null},
  {"name": "Pfleiderer", "issuer": "PCF GmbH", "coupon": 4.75, "maturity": "2029-04-15", "isin": "XS2333301674", "tv": "TRADEGATE:506A", "src": "https://www.tradingview.com/symbols/TRADEGATE-506A/", "checked": "2026-10-16", "px": null},
  {"name": "Victoria plc", "issuer": "Victoria Plc", "coupon": 3.75, "maturity": "2028-03-15", "isin": "XS2315945829", "tv": "TRADEGATE:XS231594582", "src": "https://www.tradingview.com/symbols/TRADEGATE-XS231594582/", "checked": "2026-10-16", "px": null},
  {"name": "BayWa", "issuer": "BayWa AG", "coupon": 7.75, "maturity": null, "perp": true, "isin": "DE000A351PD9", "tv": "TRADEGATE:A351PD", "src": "https://www.tradingview.com/symbols/TRADEGATE-A351PD/", "checked": "2026-10-16", "px": null},
  {"name": "Altice International", "issuer": "Altice Financing SA", "coupon": 4.25, "maturity": "2029-08-15", "isin": "XS2373430425", "tv": "TRADEGATE:XS237343042", "src": "https://www.tradingview.com/symbols/TRADEGATE-XS237343042/", "checked": "2026-10-16", "px": null},
  {"name": "Altice International", "issuer": "Altice Financing SA", "coupon": 3.0, "maturity": "2028-01-15", "isin": "XS2102493389", "tv": "GETTEX:A28R7A", "src": "https://www.tradingview.com/symbols/GETTEX-A28R7A/", "checked": "2026-10-16", "px": null},
  {"name": "Tele Columbus (Pyur)", "issuer": "Tele Columbus AG", "coupon": 10.0, "maturity": "2029-01-01", "isin": "XS1814546013", "tv": "MUN:XS181454601", "src": "https://www.tradingview.com/symbols/MUN-XS181454601/", "checked": "2026-10-16", "px": null},
  {"name": "Grifols", "issuer": "Grifols Escrow Issuer SA", "coupon": 3.875, "maturity": "2028-10-15", "isin": "XS2393001891", "tv": "TRADEGATE:XS239300189", "src": "https://www.tradingview.com/symbols/TRADEGATE-XS239300189/", "checked": "2026-10-16", "px": null},
  {"name": "Altice France (SFR)", "issuer": "Altice France SA", "coupon": 7.25, "maturity": "2029-11-01", "isin": "XS3161792075", "tv": "GETTEX:A4EHR4", "src": "https://www.tradingview.com/symbols/GETTEX-A4EHR4/", "checked": "2026-10-16", "px": null},
  {"name": "Aston Martin Lagonda", "issuer": "Aston Martin Capital Holdings Ltd.", "coupon": 10.0, "maturity": "2029-03-31", "isin": "USG05891AL32", "tv": null, "src": "https://www.tradingview.com/symbols/FWB-USG05891AL3/", "checked": "2026-10-16", "px": {"v": 57, "asOf": "2026-09-28", "outlet": "Euronews", "src": "https://www.euronews.com/2026/09/29/europes-most-troubled-companies-whos-hit-hardest-by-high-interest-rates", "quote": "Aston Martin's 10% dollar bond due in March 2029 was quoted at only around 57 cents on the dollar on 28 September."}},
  {"name": "Grupo Antolin", "issuer": "Grupo Antolin-Irausa SA", "coupon": 3.5, "maturity": "2028-04-30", "isin": "XS2355632584", "tv": null, "src": "https://www.tradingview.com/symbols/FWB-XS235563258/", "checked": "2026-10-16", "px": {"v": 60, "asOf": "2026-05", "outlet": "Octus", "src": "https://octus.com/resources/articles/grupo-antolin-to-start-debt-talks-ahead-of-springing-maturity/", "quote": "The 2028 and 2030 bonds are quoted at 60-mid and 58-mid, respectively"}},
  {"name": "Grupo Antolin", "issuer": "Grupo Antolin-Irausa SA", "coupon": 10.375, "maturity": "2030-01-30", "isin": "XS2867238532", "tv": null, "src": "https://www.tradingview.com/symbols/FWB-XS286723853/", "checked": "2026-10-16", "px": {"v": 58, "asOf": "2026-05", "outlet": "Octus", "src": "https://octus.com/resources/articles/grupo-antolin-to-start-debt-talks-ahead-of-springing-maturity/", "quote": "The 2028 and 2030 bonds are quoted at 60-mid and 58-mid, respectively"}},
  {"name": "Pandion", "issuer": "Pandion AG", "coupon": 8.0, "maturity": "2026-02-05", "isin": "DE000A289YC5", "tv": null, "src": "https://www.tradingview.com/symbols/TRADEGATE-A289YC/", "checked": "2026-10-16", "px": {"v": 5.27, "asOf": "2026-09-05", "outlet": "Börse Express", "aggregator": true, "src": "https://www.boerse-express.com/news/articles/pandion-aktie-79-prozent-verlust-in-30-tagen-944978", "quote": "Sie wurde Medienberichten zufolge zeitweise mit einem leichten Plus von 0,38 Prozent bei 5,27 Euro in Stuttgart gehandelt."}},
  {"name": "SpaceX", "issuer": null, "bond": "6.65% notes due 2056 (50-year)", "coupon": 6.65, "maturity": "2056", "isin": null, "tv": null, "src": null, "checked": "2026-10-16", "px": {"v": 85, "asOf": "2026-10-10", "outlet": "TIKR (quoting the FT's John Foley)", "aggregator": true, "src": "https://www.tikr.com/blog/spacex-is-getting-riskier-by-the-minute-as-its-50-year-bonds-slip-to-85-cents", "quote": "trade at something like 85 cents on the dollar"}},
];

export const DASH_ASOF = "2026-10-19";

// ---------------------------------------------------------------------------
// World equity indices — major LOCAL benchmarks (not ETFs) grouped by
// jurisdiction, for the Equities dashboard heatmap (same 1W/1M/3M/6M/1Y windows
// as the ETF-flows heatmap). Each row: index name, latest level (points), the
// PRICE RETURN over each window (w1/m1/m3/m6/y1, %), as-of date and a source URL.
// This is the SEED + fallback: the live /api/worldindices computes the exact
// returns from Yahoo price history and overrides these at runtime. Every seed
// value is real + sourced (never fabricated); windows not cleanly publishable
// (3M/6M and many 1W) are null in the seed and filled live. Refreshed by the
// daily routine.
export const WORLD_INDICES = {
  "asOf": "2026-10-19",
  "regions": [
    {
      "region": "US",
      "rows": [
        {
          "name": "S&P 500",
          "level": 7659.44,
          "w1": -1.95,
          "m1": 1.43,
          "m3": 2.71,
          "m6": 7.48,
          "y1": 14.94,
          "asOf": "2026-10-16",
          "source": "https://finance.yahoo.com/quote/%5EGSPC/"
        },
        {
          "name": "Nasdaq Composite",
          "level": 26140.03,
          "w1": -4.48,
          "m1": 0.62,
          "m3": 2.43,
          "m6": 6.83,
          "y1": 15.26,
          "asOf": "2026-10-16",
          "source": "https://finance.yahoo.com/quote/%5EIXIC/"
        },
        {
          "name": "Dow Jones",
          "level": 52002.41,
          "w1": 0.67,
          "m1": 1.05,
          "m3": -0.28,
          "m6": 5.17,
          "y1": 12.58,
          "asOf": "2026-10-16",
          "source": "https://finance.yahoo.com/quote/%5EDJI/"
        },
        {
          "name": "Russell 2000",
          "level": 2721.37,
          "w1": -3.05,
          "m1": -4.81,
          "m3": -8.13,
          "m6": -2,
          "y1": 10.98,
          "asOf": "2026-10-16",
          "source": "https://finance.yahoo.com/quote/%5ERUT/"
        }
      ]
    },
    {
      "region": "UK",
      "rows": [
        {
          "name": "FTSE 100",
          "level": 10741.96,
          "w1": 0.8,
          "m1": 0.78,
          "m3": 2.06,
          "m6": 1.25,
          "y1": 14.23,
          "asOf": "2026-10-19",
          "source": "https://finance.yahoo.com/quote/%5EFTSE/"
        },
        {
          "name": "FTSE 250",
          "level": 24374.6,
          "w1": 0.19,
          "m1": 0.7,
          "m3": 3.54,
          "m6": 6.25,
          "y1": 11.46,
          "asOf": "2026-10-19",
          "source": "https://finance.yahoo.com/quote/%5EFTMC/"
        }
      ]
    },
    {
      "region": "Europe",
      "rows": [
        {
          "name": "Euro Stoxx 50",
          "level": 6129.05,
          "w1": -1.16,
          "m1": -1.72,
          "m3": -1.58,
          "m6": 2.45,
          "y1": 7.89,
          "asOf": "2026-10-19",
          "source": "https://finance.yahoo.com/quote/%5ESTOXX50E/"
        },
        {
          "name": "DAX",
          "level": 25279.9,
          "w1": 0.01,
          "m1": -0.1,
          "m3": 1.74,
          "m6": 3.53,
          "y1": 4.21,
          "asOf": "2026-10-19",
          "source": "https://finance.yahoo.com/quote/%5EGDAXI/"
        },
        {
          "name": "CAC 40",
          "level": 7833.91,
          "w1": 0.01,
          "m1": -2.87,
          "m3": -6.07,
          "m6": -5.97,
          "y1": -4.54,
          "asOf": "2026-10-19",
          "source": "https://finance.yahoo.com/quote/%5EFCHI/"
        },
        {
          "name": "IBEX 35",
          "level": 18974.1,
          "w1": -1.62,
          "m1": -2.77,
          "m3": -1.21,
          "m6": 3.91,
          "y1": 19.87,
          "asOf": "2026-10-19",
          "source": "https://finance.yahoo.com/quote/%5EIBEX/"
        }
      ]
    },
    {
      "region": "APAC",
      "rows": [
        {
          "name": "Nikkei 225",
          "level": 64916.7,
          "w1": -5.96,
          "m1": -0.16,
          "m3": 1.21,
          "m6": 10.36,
          "y1": 31.98,
          "asOf": "2026-10-19",
          "source": "https://finance.yahoo.com/quote/%5EN225/"
        },
        {
          "name": "Hang Seng",
          "level": 24186.83,
          "w1": -0.1,
          "m1": -2.13,
          "m3": -1.53,
          "m6": -7.54,
          "y1": -6.57,
          "asOf": "2026-10-16",
          "source": "https://finance.yahoo.com/quote/%5EHSI/"
        },
        {
          "name": "Shanghai Composite",
          "level": 3730.92,
          "w1": -1.75,
          "m1": -4.63,
          "m3": -1.72,
          "m6": -8.6,
          "y1": -3.44,
          "asOf": "2026-10-19",
          "source": "https://finance.yahoo.com/quote/000001.SS/"
        },
        {
          "name": "KOSPI",
          "level": 5768.01,
          "w1": -9.65,
          "m1": -16.34,
          "m3": -11.48,
          "m6": -7.25,
          "y1": 51.21,
          "asOf": "2026-10-19",
          "source": "https://finance.yahoo.com/quote/%5EKS11/"
        }
      ]
    }
  ]
};

// Government bond benchmark yields (2Y/5Y/10Y/30Y, in %) for the major economies
// in each jurisdiction, for the Bonds dashboard heatmap. Each row: country,
// y2/y5/y10/y30, an as-of date and a source URL. This is the SEED + fallback: the
// live /api/govyields (Stooq keyless yield series) refreshes these at runtime.
// G7 + Western Europe only (R4c). Every value is real + sourced (never fabricated);
// a null is a tenor the source does not publish (Switzerland 5Y / 30Y).
export const GOVT_YIELDS = {
  "asOf": "2026-10-13",
  "tenors": [
    "2Y",
    "5Y",
    "10Y",
    "30Y"
  ],
  "regions": [
    {
      "region": "US",
      "rows": [
        {
          "country": "United States",
          "y2": 4.74,
          "y5": 4.89,
          "y10": 5.09,
          "y30": 5.43,
          "asOf": "2026-10-16",
          "source": "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve"
        }
      ]
    },
    {
      "region": "UK",
      "rows": [
        {
          "country": "United Kingdom",
          "y2": 4.8,
          "y5": 5.03,
          "y10": 5.44,
          "y30": 5.93,
          "asOf": "2026-10-13",
          "source": "https://tradingeconomics.com/united-kingdom/government-bond-yield"
        }
      ]
    },
    {
      "region": "Europe",
      "rows": [
        {
          "country": "Germany",
          "y2": 3.12,
          "y5": 3.25,
          "y10": 3.46,
          "y30": 3.81,
          "asOf": "2026-10-13",
          "source": "https://tradingeconomics.com/germany/government-bond-yield"
        },
        {
          "country": "France",
          "y2": 3.63,
          "y5": 4.21,
          "y10": 4.84,
          "y30": 5.42,
          "asOf": "2026-10-13",
          "source": "https://tradingeconomics.com/france/government-bond-yield"
        },
        {
          "country": "Italy",
          "y2": 3.5,
          "y5": 3.99,
          "y10": 4.56,
          "y30": 5.13,
          "asOf": "2026-10-13",
          "source": "https://tradingeconomics.com/italy/government-bond-yield"
        },
        {
          "country": "Spain",
          "y2": 3.32,
          "y5": 3.58,
          "y10": 4.09,
          "y30": 4.6,
          "asOf": "2026-10-13",
          "source": "https://tradingeconomics.com/spain/government-bond-yield"
        },
        {
          "country": "Switzerland",
          "y2": 0.24,
          "y5": null,
          "y10": 0.56,
          "y30": null,
          "asOf": "2026-10-13",
          "source": "https://tradingeconomics.com/switzerland/government-bond-yield"
        }
      ]
    },
    {
      "region": "APAC",
      "rows": [
        {
          "country": "Japan",
          "y2": 1.93,
          "y5": 2.34,
          "y10": 3,
          "y30": 4.04,
          "asOf": "2026-10-13",
          "source": "https://tradingeconomics.com/japan/government-bond-yield"
        }
      ]
    }
  ]
};

// Curated government-bond-yield CHANGES (basis points) by country → tenor, for the
// Bonds yield-change heatmap. Trading Economics country pages publish the
// current level plus the trailing 1-month (m1) and 1-year (y1) change; those two are
// curated here. The 10Y 3M/6M (m3/m6) are filled LIVE from FRED's OECD monthly series
// via /api/govyields, and the whole US curve (all windows, daily) too — both override
// these. Only 1W (needs daily non-US data) stays blank. Real + sourced.
export const GOVT_YIELD_CHG = {
  "United States": {
    "y2": {
      "w1": -6,
      "m1": 0,
      "m3": 56,
      "m6": 103,
      "y1": 133
    },
    "y5": {
      "w1": -13,
      "m1": 3,
      "m3": 61,
      "m6": 105,
      "y1": 134
    },
    "y10": {
      "w1": -15,
      "m1": 8,
      "m3": 54,
      "m6": 83,
      "y1": 110
    },
    "y30": {
      "w1": -17,
      "m1": 8,
      "m3": 37,
      "m6": 55,
      "y1": 85
    }
  },
  "United Kingdom": {
    "y2": {
      "m1": 0,
      "y1": 85
    },
    "y5": {
      "m1": 2,
      "y1": 98
    },
    "y10": {
      "m1": 3,
      "y1": 86
    },
    "y30": {
      "m1": -3,
      "y1": 54
    }
  },
  "Germany": {
    "y2": {
      "m1": -13,
      "y1": 118
    },
    "y5": {
      "m1": -10,
      "y1": 108
    },
    "y10": {
      "m1": -7,
      "y1": 91
    },
    "y30": {
      "m1": -7,
      "y1": 68
    }
  },
  "France": {
    "y2": {
      "m1": 10,
      "y1": 154
    },
    "y5": {
      "m1": 28,
      "y1": 154
    },
    "y10": {
      "m1": 32,
      "y1": 149
    },
    "y30": {
      "m1": 25,
      "y1": 121
    }
  },
  "Italy": {
    "y2": {
      "m1": 4,
      "y1": 138
    },
    "y5": {
      "m1": 12,
      "y1": 128
    },
    "y10": {
      "m1": 14,
      "y1": 118
    },
    "y30": {
      "m1": 9,
      "y1": 85
    }
  },
  "Spain": {
    "y2": {
      "m1": 1,
      "y1": 129
    },
    "y5": {
      "m1": 5,
      "y1": 123
    },
    "y10": {
      "m1": 8,
      "y1": 99
    },
    "y30": {
      "m1": 6,
      "y1": 68
    }
  },
  "Switzerland": {
    "y2": {
      "m1": -8,
      "y1": 39
    },
    "y10": {
      "m1": -4,
      "y1": 35
    }
  },
  "Japan": {
    "y2": {
      "m1": 7,
      "y1": 102
    },
    "y5": {
      "m1": 4,
      "y1": 115
    },
    "y10": {
      "m1": -4,
      "y1": 135
    },
    "y30": {
      "m1": -11,
      "y1": 87
    }
  }
};

// Private-credit pulse for the Credit dashboard — Fitch's U.S. Private Credit
// Default Rate (PCDR), KBRA's middle-market surveillance and market-context
// metrics. Every figure is real + sourced (never fabricated); refreshed by the
// routine. `reports` tracks the recurring industry research the pulse draws on —
// KBRA's quarterly Middle Market Compendium and AIMA/ACC's Private Credit
// Performance & Valuation Trends — so each cycle rolls to the newest edition (see
// docs/refresh-routines.md, "Private-credit research").
export const PRIVATE_CREDIT = {
  asOf: "2026-09",
  headline: "Fitch's U.S. Private Credit Default Rate hit a fresh record 6.3% for the trailing 12 months ended August 2026 (across ~1,300 borrowers) — up from 6.1% in July and the prior quarterly record of 6.0% for TTM 2Q26, with 14 default events in August, the highest monthly total in a year. Defaults stayed amendment-led: stressed maturity extensions were 45% of August's events (a third straight month on top) and interest-deferral / cash-to-PIK swaps 47% of the trailing year's 89 defaults, rather than missed payments. Stress concentrated in healthcare and industrials/manufacturing (both 9.9%, up from 9.5% in July), while software stayed resilient at 0.6%. Fitch ties the climb to rate/inflation uncertainty crimping deal liquidity, leaving lenders unable to exit distressed borrowers before maturity.",
  metrics: [
    { k: "Private Credit Default Rate", v: "6.3%", sub: "TTM Aug 2026 · record · up from 6.1% (Jul 2026)", src: "https://www.fitchratings.com/research/corporate-finance/fitch-ratings-us-private-credit-default-rate-rose-to-6-3-in-august-2026-14-09-2026", srcName: "Fitch Ratings", prev: "6.0%", prevAsOf: "TTM 2Q26", prevSrc: "https://www.fundssociety.com/en/news/alternatives/u-s-private-credit-default-rate-continues-to-climb/" },
    { k: "Defaults recorded (TTM)", v: "89", sub: "TTM Aug 2026 · 14 in August (highest monthly in a year)", src: "https://www.fitchratings.com/research/corporate-finance/fitch-ratings-us-private-credit-default-rate-rose-to-6-3-in-august-2026-14-09-2026", srcName: "Fitch Ratings" },
    { k: "Top-stressed sectors", v: "9.9%", sub: "healthcare & industrials/mfg · Aug 2026 · up from 9.5% (Jul)", src: "https://www.fitchratings.com/research/corporate-finance/fitch-ratings-us-private-credit-default-rate-rose-to-6-3-in-august-2026-14-09-2026", srcName: "Fitch Ratings" },
    { k: "Software sector default", v: "0.6%", sub: "Aug 2026 · tech most resilient", src: "https://www.fitchratings.com/research/corporate-finance/fitch-ratings-us-private-credit-default-rate-rose-to-6-3-in-august-2026-14-09-2026", srcName: "Fitch Ratings" },
    { k: "Defaults via amendment", v: "45%", sub: "maturity extensions (Aug 2026, 3rd mo.) · PIK/deferrals 47% of TTM · not missed payments", src: "https://www.fitchratings.com/research/corporate-finance/fitch-ratings-us-private-credit-default-rate-rose-to-6-3-in-august-2026-14-09-2026", srcName: "Fitch Ratings" },
    { k: "KBRA MM default monitor", v: "3.3%", sub: "by count, 2Q26 · first rise in a year · 2.4% by debt (record)", src: "https://www.kbra.com/publications/RWVsCVCX/kbra-releases-research-private-credit-q2-2026-middle-market-compendium-ebitda-s-fading-tailwinds", srcName: "KBRA Q2'26 MM Compendium" },
    { k: "MM debt assessed (KBRA)", v: "$1.2tn", sub: "2,785 borrowers, TTM 2Q26 · EBITDA growth fading", src: "https://www.kbra.com/publications/RWVsCVCX/kbra-releases-research-private-credit-q2-2026-middle-market-compendium-ebitda-s-fading-tailwinds", srcName: "KBRA Q2'26 MM Compendium" },
    { k: "US leveraged-loan default (Fitch fcst)", v: "4.5–5.0%", sub: "end-2026 forecast · US HY 2.5–3.0% · Europe institutional loans 3.0–3.5%", src: "https://www.investmentexecutive.com/news/research-and-markets/u-s-leveraged-loan-defaults-to-ease-in-2026-fitch/", srcName: "Fitch (via Investment Executive)" },
    { k: "Market size (AUM)", v: "~$2.0tn", sub: "2026 est. · ~$4tn by 2030", src: "https://www.moodys.com/web/en/us/insights/credit-risk/outlooks/private-credit-2026.html", srcName: "Moody's" },
    { k: "BDC non-accruals", v: "~1.2%", sub: "of portfolios (Q2'25)", src: "https://www.withintelligence.com/insights/what-is-actually-going-on-in-bdc-portfolios/", srcName: "With Intelligence" },
  ],
  // Recurring industry research the pulse tracks — refreshed to the newest edition each
  // cycle. Fitch's U.S. Private Credit Default Rate is a MONTHLY report; the refresh
  // routine rolls this entry (and the metrics above) to each new month's release and
  // watches for follow-on Fitch private-credit commentary. KBRA's MM Compendium is
  // quarterly and public; AIMA/ACC's quarterly is members' research, so it links the
  // ACC's public private-credit research hub.
  reports: [
    { title: "Fitch — U.S. Private Credit Default Rate Rose to 6.3% in August 2026 (monthly)", date: "2026-09-14", url: "https://www.fitchratings.com/research/corporate-finance/fitch-ratings-us-private-credit-default-rate-rose-to-6-3-in-august-2026-14-09-2026", srcName: "Fitch Ratings" },
    { title: "KBRA — Private Credit: Q2 2026 Middle Market Compendium (EBITDA's Fading Tailwinds)", date: "2026-07-28", url: "https://www.kbra.com/publications/RWVsCVCX/kbra-releases-research-private-credit-q2-2026-middle-market-compendium-ebitda-s-fading-tailwinds", srcName: "KBRA" },
    { title: "AIMA/ACC — Financing the Economy 2025: private credit reaches US$3.5tn (end-2024)", date: "2025", url: "https://www.aima.org/article/press-release-strong-growth-sees-private-credit-market-reach-us-3-5-trillion.html", srcName: "AIMA/ACC" },
  ],
};

// ---------------------------------------------------------------------------
// Europe — defaults & distress (Dashboard ▸ Credit). Curated from free public
// releases; every figure carries its source and the period it is AS OF (never
// fabricated, R7). Refreshed by the routine as each monthly/quarterly release
// lands (docs/refresh-routines.md → "Dashboard: European distress"). The EU
// bankruptcy index is LIVE from Eurostat via /api/eurates; `bankruptcyFallback`
// is its last verified reading, shown only when the live call fails.
export const EU_DISTRESS = {
  asOf: "2026-10-15",
  // Re-sourced 2026-10-15 (review #6): every row names its MEASURE (TTM by count / by
  // amount / forecast) and links its public source through the standard SRC chip.
  metrics: [
    { k: "Fitch European lev-loan default (TTM)", v: "2.7%", asOf: "Aug 2026", measure: "TTM", sub: "up from 2.4% in Jul · Fitch European Corporates Distressed & Default Monitor (Sep 2026)", src: "https://www.bebankers.it/europa-salgono-i-tassi-di-default-per-le-aziende-piu-rischiose-dice-fitch/", srcName: "Fitch Ratings" },
    { k: "Fitch European HY default (TTM)", v: "2.3%", asOf: "Aug 2026", measure: "TTM", sub: "unchanged on the month · Fitch European Corporates Distressed & Default Monitor (Sep 2026)", src: "https://www.bebankers.it/europa-salgono-i-tassi-di-default-per-le-aziende-piu-rischiose-dice-fitch/", srcName: "Fitch Ratings" },
    { k: "Fitch loans of concern — European lev loans", v: "10.6%", asOf: "Aug 2026", measure: "share of index on Top Market Concern + Tier 2 lists", sub: "highest since 2013", src: "https://www.bebankers.it/europa-salgono-i-tassi-di-default-per-le-aziende-piu-rischiose-dice-fitch/", srcName: "Fitch Ratings" },
    { k: "Fitch 2026 fcst — European lev loans", v: "4.0–4.5%", asOf: "Jul 2026", measure: "forecast, end-2026 TTM", sub: "raised in Jul 2026 · HY bonds 3.75–4.25% (unchanged)", src: "https://www.bebankers.it/europa-salgono-i-tassi-di-default-per-le-aziende-piu-rischiose-dice-fitch/", srcName: "Fitch Ratings" },
    { k: "Lev-loan default rate (ELLI, by count)", v: "1.47%", asOf: "Jun 2026", measure: "TTM by count", sub: "PitchBook LCD Morningstar European Leveraged Loan Index · 1.23% by amount · 2.06% incl. distressed exchanges/LMEs (Q2)", src: "https://en.paperjam.lu/article/europes-loan-market-buys-time-not-safety", srcName: "PitchBook LCD (via Paperjam)" },
    { k: "S&P European spec-grade default (TTM)", v: "2.6%", asOf: "Jun 2026", measure: "TTM by count", sub: "down from 3.3% at end-March · S&P via AFME Q2 2026 report", src: "https://www.afme.eu/media/1ygbf3ae/hyllpc-report-2q-2026.pdf", srcName: "AFME (citing S&P)" },
    { k: "Moody's European spec-grade default (TTM)", v: "4.5%", asOf: "Jun 2026", measure: "TTM", sub: "up from 3.8% in March · Moody's via AFME Q2 2026 report", src: "https://www.afme.eu/media/1ygbf3ae/hyllpc-report-2q-2026.pdf", srcName: "AFME (citing Moody's)" },
    { k: "UK company insolvencies (E&W, month)", v: "1,946", asOf: "Aug 2026", measure: "count, seasonally adjusted", sub: "2,007 in Aug 2025 · September release due 20 Oct 2026", src: "https://www.gov.uk/government/statistics/company-insolvencies-august-2026", srcName: "Insolvency Service" },
  ],

  bankruptcyFallback: { value: 195.9, asOf: "2026-Q2", yearAgo: 187.4, yearAgoAsOf: "2025-Q2", href: "https://ec.europa.eu/eurostat/databrowser/view/sts_rb_q/default/table" },
};

// ---------------------------------------------------------------------------
// Regulatory calendar (Dashboard ▸ Legal) — dated milestones for European / UK
// private-credit funds. Only dates verifiable from the instrument or the
// regulator; an undated file is `date: null` (shown "TBC"). Refreshed by the
// routine as dates are confirmed.
export const REG_CALENDAR = {
  asOf: "2026-10-15",
  // jur: EU | UK | US · area: Funds | Banking | Securitisation | Restructuring | AML | Other.
  // date: YYYY-MM-DD, or YYYY-MM when the source gives only the month; null = no agreed date.
  items: [
    {"date": "2024-10-26", "item": "ELTIF 2.0 RTS apply", "note": "Delegated Regulation (EU) 2024/2759 — redemptions, liquidity tools, cost disclosure", "src": "https://eur-lex.europa.eu/eli/reg_del/2024/2759/oj", "srcName": "EUR-Lex", "jur": "EU", "area": "Funds"},
    {"date": "2026-04-16", "item": "AIFMD II applies", "note": "Transposition deadline of Directive (EU) 2024/927; loan-origination rules apply to new AIFs", "src": "https://eur-lex.europa.eu/eli/dir/2024/927/oj", "srcName": "EUR-Lex", "jur": "EU", "area": "Funds"},
    {"date": "2026-10-14", "item": "FCA CP26/28 — UK AIFM regime consultation closes", "note": "Proposed three-tier UK AIFM regime; final rules expected 2027", "src": "https://www.fca.org.uk/publications/consultation-papers/cp26-28-uk-aifm-regime", "srcName": "FCA", "jur": "UK", "area": "Funds"},
    {"date": "2026-10-14", "item": "HMT draft AIFM Regulations 2026: technical comments close", "note": "HM Treasury's draft SI (published 14 Jul 2026) repealing/replacing UK AIFM legislation; feedback requested by 14 Oct 2026.", "src": "https://www.regulationtomorrow.com/2026/07/hmt-issues-draft-si-and-policy-note-on-the-alternative-investment-fund-managers-regulations-2026/", "srcName": "Regulation Tomorrow (Norton Rose Fulbright)", "jur": "UK", "area": "Funds"},
    {"date": "2026-10-22", "item": "FCA CP26/28 — extended response deadline", "note": "FCA extended the CP26/28 deadline to 22 Oct 2026 (reported as covering the prudential discussion chapter); HMT AIFM SI comments closed 14 Oct", "src": "https://www.fca.org.uk/publications/consultation-papers/cp26-28-uk-aifm-regime", "srcName": "FCA", "jur": "UK", "area": "Funds"},
    {"date": "2026-12", "item": "EU securitisation review: Irish Presidency target to close trilogues", "note": "Irish Presidency aims to close the Securitisation Regulation/CRR review file by end of its term (31 Dec 2026); third trilogue was 29 Sep.", "src": "https://www.walkersglobal.com/en/Insights/2026/07/EU-securitisation-review-Progress-made-at-second-trilogue-update", "srcName": "Walkers", "jur": "EU", "area": "Securitisation"},
    {"date": "2026-12-11", "item": "FCA CP26/35 redemption terms for illiquid-asset funds closes", "note": "Proposes max monthly dealing and 90-day notice for NURS ≥50% in illiquid assets; final rules expected H1 2027.", "src": "https://www.fca.org.uk/publications/consultation-papers/cp26-35-fair-redemption-terms-authorised-funds-investing-illiquid-assets", "srcName": "FCA", "jur": "UK", "area": "Funds"},
    {"date": "2027-01-01", "item": "CRR3 output floor rises to 60%", "note": "EU bank capital output floor steps up from 55% (2026)", "src": "https://eur-lex.europa.eu/eli/reg/2024/1623/oj", "srcName": "EUR-Lex", "jur": "EU", "area": "Banking"},
    {"date": "2027-01-01", "item": "UK Basel 3.1 (PRA PS1/26) takes effect", "note": "Basel 3.1 rules and reporting apply from 1 Jan 2027, incl. new credit-risk SA/IRB rules affecting bank lending and SRT capital.", "src": "https://www.bankofengland.co.uk/prudential-regulation/publication/2026/january/implementation-of-the-basel-3-1-final-rules-policy-statement", "srcName": "Bank of England / PRA", "jur": "UK", "area": "Banking"},
    {"date": "2027-01-01", "item": "EU FRTB applies, with 3-year temporary capital relief", "note": "Commission delegated act (adopted 4 Jun 2026) applies FRTB from 1 Jan 2027 with transitional multiplier relief for three years.", "src": "https://finance.ec.europa.eu/news/commission-adopts-temporary-adjustments-basel-iii-market-risk-rules-safeguard-eu-banks-2026-06-04_en", "srcName": "European Commission", "jur": "EU", "area": "Banking"},
    {"date": "2027-04", "item": "UK DB pension surplus release changes expected", "note": "Pension Schemes Act 2026 measures making it easier for ongoing DB schemes to pay surplus to employers expected April 2027.", "src": "https://www.burges-salmon.com/thinking/topics/pension-schemes-act-2026/", "srcName": "Burges Salmon", "jur": "UK", "area": "Other"},
    {"date": "2027-04-06", "item": "Insolvency Rules 2016 post-implementation review due", "note": "Insolvency Service's second review of the Insolvency (E&W) Rules 2016 (consultation closed 6 Oct 2026); PIR report due by 6 Apr 2027.", "src": "https://www.gov.uk/government/consultations/second-review-of-the-insolvency-england-and-wales-rules-2016-and-the-insolvency-scotland-company-voluntary-arrangements-and-administration-rules-2018-/second-review-of-the-insolvency-england-and-wales-rules-2016-and-the-insolvency-scotland-company-voluntary-arrangements-and-administration-rules", "srcName": "GOV.UK (Insolvency Service)", "jur": "UK", "area": "Restructuring"},
    {"date": "2027-04-16", "item": "AIFMD II revised supervisory reporting", "note": "Annex IV reporting changes apply", "src": "https://eur-lex.europa.eu/eli/dir/2024/927/oj", "srcName": "EUR-Lex", "jur": "EU", "area": "Funds"},
    {"date": "2027-04-16", "item": "AIFMD II: ESMA LMT Guidelines apply to pre-existing funds", "note": "ESMA LMT Guidelines applied from 16 Apr 2026; funds existing before that date have until 16 Apr 2027 to comply.", "src": "https://www.simmons-simmons.com/en/publications/cmmvslb8y00auufwssmrvyowv/aifmd-2-esma-publishes-lmt-guidelines", "srcName": "Simmons & Simmons", "jur": "EU", "area": "Funds"},
    {"date": "2027-07-01", "item": "US Form PF amendments compliance date (extended)", "note": "SEC/CFTC (31 Aug 2026) delayed compliance with the 2024 Form PF amendments from 1 Oct 2026 to 1 Jul 2027.", "src": "https://www.sec.gov/rules-regulations/2026/08/s7-22-22", "srcName": "SEC", "jur": "US", "area": "Funds"},
    {"date": "2027-07-01", "item": "AMLA begins first selection of directly supervised entities", "note": "AMLA's first six-month selection of ~40 cross-border obliged entities starts 1 Jul 2027.", "src": "https://www.jonesday.com/de/insights/2025/07/direct-supervisory-powers-of-the-new-european-antimoney-laundering-authority", "srcName": "Jones Day", "jur": "EU", "area": "AML"},
    {"date": "2027-07-10", "item": "EU AML Regulation (AMLR 2024/1624) applies", "note": "Single EU AML rulebook applies from 10 Jul 2027 (football clubs/agents from 10 Jul 2029); covers AIFMs as obliged entities.", "src": "https://www.springlex.eu/en/packages/aml/amlr-regulation/article-90/", "srcName": "Springlex (OJ text of Art 90)", "jur": "EU", "area": "AML"},
    {"date": "2027-07-10", "item": "AMLD6 (Directive 2024/1640) transposition deadline", "note": "Member States must transpose AMLD6 by 10 Jul 2027, when AMLD4/5 is repealed.", "src": "https://twobirds.com/en/insights/2024/global/eu-aml-package-–-a-new-adventure-begins", "srcName": "Bird & Bird", "jur": "EU", "area": "AML"},
    {"date": "2028-01-01", "item": "AMLA direct supervision starts", "note": "Direct supervision of selected obliged entities transfers to AMLA from 1 Jan 2028.", "src": "https://www.jonesday.com/de/insights/2025/07/direct-supervisory-powers-of-the-new-european-antimoney-laundering-authority", "srcName": "Jones Day", "jur": "EU", "area": "AML"},
    {"date": "2028-01-01", "item": "UK FRTB internal model approach takes effect", "note": "PRA delays FRTB-IMA to 1 Jan 2028; existing IMA permissions continue through the 2027 interim period.", "src": "https://www.bankofengland.co.uk/prudential-regulation/publication/2026/january/implementation-of-the-basel-3-1-final-rules-policy-statement", "srcName": "Bank of England / PRA", "jur": "UK", "area": "Banking"},
    {"date": "2029-01", "item": "EU insolvency harmonisation Directive 2026/799 transposition", "note": "Directive (in force 21 Apr 2026) on avoidance actions, pre-packs, creditor committees: 2y9m to transpose (~Jan 2029).", "src": "https://www.loyensloeff.com/insights/news--events/news/eu-directive-harmonising-insolvency-rules-across-member-states-entered-into-force/", "srcName": "Loyens & Loeff", "jur": "EU", "area": "Restructuring"},
    {"date": "2029-04-16", "item": "AIFMD II loan-origination grandfathering ends", "note": "For AIFs constituted before 15 Apr 2024 that keep raising capital", "src": "https://eur-lex.europa.eu/eli/dir/2024/927/oj", "srcName": "EUR-Lex", "jur": "EU", "area": "Funds"},
    {"date": "2029-07-10", "item": "AMLR applies to football clubs and agents", "note": "Deferred AMLR application date for obliged entities in Art 3(3)(n)-(o).", "src": "https://www.springlex.eu/en/packages/aml/amlr-regulation/article-90/", "srcName": "Springlex (OJ text of Art 90)", "jur": "EU", "area": "AML"},
    {"date": "2030-01-01", "item": "EU CRR3 output floor fully phased in at 72.5%", "note": "Output floor reaches 72.5% from 2030; 125% transitional cap available until end-2029.", "src": "https://banking.vision/en/crr-iii-transitional-provisions", "srcName": "banking.vision", "jur": "EU", "area": "Banking"},
    {"date": "2030-06", "item": "UK PISCES sandbox ends; permanent regime decision", "note": "Five-year PISCES private-share trading sandbox runs to June 2030, when FCA expects to finalise a permanent regime.", "src": "https://www.orrick.com/en/Insights/2025/06/PISCES-Sandbox", "srcName": "Orrick", "jur": "UK", "area": "Other"},
    {"date": null, "item": "FCA UK AIFM regime: policy statement 2027, go-live 2028", "note": "FCA intends to publish final rules in 2027 after HMT's SI, with implementation of the new UK AIFM regime currently envisaged in 2028.", "src": "https://www.fca.org.uk/publications/consultation-papers/cp26-28-uk-aifm-regime", "srcName": "FCA", "jur": "UK", "area": "Funds"},
    {"date": null, "item": "UK Pension Schemes Act 2026: DC value-for-money regs in effect", "note": "Burges Salmon timeline: VFM regulations come into effect Q1 2027; first VFM data to TPR Mar 2028.", "src": "https://www.burges-salmon.com/thinking/topics/pension-schemes-act-2026/", "srcName": "Burges Salmon", "jur": "UK", "area": "Other"},
    {"date": null, "item": "UK securitisation reforms (PRA CP2/26 / FCA CP26/6) implementation", "note": "PRA proposed Q2 2027 implementation for simplified due diligence/transparency rules; FCA final rules H2 2026. Policy statements not yet seen.", "src": "https://www.bankofengland.co.uk/prudential-regulation/publication/2026/february/reforms-to-securitisation-requirements-consultation-paper", "srcName": "Bank of England / PRA", "jur": "UK", "area": "Securitisation"},
    {"date": null, "item": "UK DC megafund scale test (£25bn default arrangement)", "note": "Pension Schemes Act 2026: DC main scale default arrangement ≥£25bn expected Q2 2030 (transition pathway to 2035).", "src": "https://www.burges-salmon.com/thinking/topics/pension-schemes-act-2026/", "srcName": "Burges Salmon", "jur": "UK", "area": "Other"},
  ],
};
