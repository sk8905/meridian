// =============================================================================
// Meridian Macro — editorial content for the Commentary and Cycle tabs, plus the
// short conclusions surfaced on the Dashboard. Compiled from public commentary
// and official data on the dates cited; educational only, not investment advice.
// Each claim carries a source link — verify against it before relying on it.
// =============================================================================

export const UPDATED = "12 July 2026";

// ---- Refresh stamp (bumped every routine run, like Credit/Legal data.js) ----
// LAST_CHECKED is the "Last refresh" date shown in the top bar; LAST_CHECKED_TIME
// is a pre-formatted "HH:MM TZ" London string so it renders the same in any
// viewer timezone. The four-times-daily refresh routine advances both on every run.
export const META = {
  lastChecked: "2026-07-12",
  lastCheckedTime: "12:41 BST",
};

// ---- Policy-rate outlook (Commentary tab) ----------------------------------
export const OUTLOOK = {
  us: {
    rate: "3.50–3.75%",
    stance: "Hold · hawkish",
    body: [
      "The FOMC held its target range at <strong>3.50–3.75%</strong> on 17 June 2026 — a fourth consecutive hold (12–0), and the first meeting chaired by Kevin Warsh. The June dot plot lifted the median year-end-2026 dot to roughly <strong>3.8%</strong> (from 3.4% in March), with nine of nineteen participants now pencilling in at least one further <em>hike</em> — a hawkish pivot from the earlier easing bias.",
      "The driver is re-accelerating inflation: <strong>core PCE hit 3.4% in May</strong>, its highest since October 2023, on tariff pass-through and a Middle-East energy shock. Solid growth and a firm labour market remove the case for cuts, though some argue tariff effects are near their peak.",
      "For the 28–29 July meeting, a Reuters poll (72 of 102 economists) and futures overwhelmingly expect a <strong>hold</strong>. Through year-end, futures price the rate drifting toward <strong>~4% by December</strong> — about one 25bp hike; J.P. Morgan sees no move in 2026, Deutsche Bank two.",
      "Minutes of the June meeting, released 8 July 2026, showed <strong>'a few' officials already saw a case for a hike in June</strong>, with broad-based price pressures flagged across transportation, air fares, petrochemicals and agricultural inputs. The same day, President Trump said the Iran ceasefire was 'over' and threatened fresh strikes; Brent crude jumped ~5% and the 10-year Treasury yield rose to <strong>4.57%</strong> (highest since mid-May) as September-hike odds jumped to <strong>~70%</strong> from ~58%.",
      "The Fed's semiannual Monetary Policy Report to Congress, released 10 July 2026 — the first under Chair Warsh — pledged the Fed 'will deliver price stability', describing growth as solid and the banking system as sound while acknowledging inflation has moved higher on tariffs and the Iran war. Warsh delivers his debut Humphrey-Hawkins testimony to the House Financial Services Committee on 14 July and the Senate Banking Committee on 15 July, a key test of how firmly he leans hawkish before the 29 July decision.",
    ],
    bottomLine: "Next move a hold on 29 July; the 8 July FOMC minutes and a fresh Middle-East oil shock have pushed hike odds higher (~70% by September), with Warsh's 14–15 July congressional testimony the next catalyst and cuts off the table for now.",
  },
  uk: {
    rate: "3.75%",
    stance: "Hold · hawkish dissents",
    body: [
      "The MPC held <strong>Bank Rate at 3.75%</strong> on 17–18 June 2026 by a 7–2 majority, with Megan Greene and Huw Pill dissenting for a 25bp <em>hike</em> to 4.00% — more hawkish than April's 8–1 hold. The Bank cited sticky services inflation and a fresh energy-price shock.",
      "<strong>Services inflation was 3.7% in May</strong> (up from 3.2%), the MPC's key persistence gauge, while headline CPI held at <strong>2.8%</strong>. Labour data is softening — regular pay (AWE ex-bonus) growth around <strong>3.4%</strong>, unemployment <strong>4.9%</strong> and a rising claimant count — pointing to gradually easing wage pressure, which tempers the hawks.",
      "Markets expect the Bank to <strong>hold at 3.75% for the rest of 2026</strong>. A Reuters poll of 65 economists found most see a year-end hold, but nearly 40% price at least one hike and only six a cut; 2026 forecasts span 3.50–4.25%. The base case for the 30 July meeting is a hold with a hawkish tilt.",
      "The renewed Iran/oil shock of 8 July 2026 pushed the <strong>10-year gilt yield above 4.9%</strong> (highest since 10 June) as traders raised BoE hike-by-year-end odds to <strong>~76%</strong> (>50% for November); Governor Bailey reaffirmed inflation should reach 2% eventually but 'later than previously expected', ruling out imminent cuts. The BoE's July Financial Stability Report also flagged record hedge-fund leverage and noted the gilt move was amplified by hedge-fund deleveraging.",
    ],
    bottomLine: "Next move a hold on 30 July at 3.75%; the 8 July oil shock has lifted hike-by-year-end odds to ~76%, with hawkish dissents growing and cuts off the table.",
  },
  sources: [
    ["Fed statement, 17 Jun 2026", "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260617a.htm"],
    ["Fed projections (dot plot), Jun 2026", "https://www.federalreserve.gov/monetarypolicy/fomcprojtabl20260617.htm"],
    ["Fed H.15 selected rates", "https://www.federalreserve.gov/releases/h15/"],
    ["CNBC — May core PCE 3.4%", "https://www.cnbc.com/2026/06/25/pce-inflation-report-may-2026-.html"],
    ["J.P. Morgan Research — Fed's next move", "https://www.jpmorgan.com/insights/global-research/economy/fed-rate-cuts"],
    ["BoE MPC minutes, Jun 2026", "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/june-2026"],
    ["ONS — CPI, May 2026", "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/may2026"],
    ["ONS — labour market, Jun 2026", "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/bulletins/uklabourmarket/june2026"],
    ["Bloomberg — Fed minutes show 'a few' saw case for June hike, 8 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-08/fed-minutes-show-a-few-officials-saw-case-for-june-rate-hike"],
    ["CNBC — 10-year yield climbs to 4.57% on oil/Iran ceasefire collapse, 8 Jul 2026", "https://www.cnbc.com/2026/07/08/treasury-yields-trump-iran-ceasefire.html"],
    ["TradingView/Trading Economics — UK gilt yields surge on oil spike, rate-hike bets, 8 Jul 2026", "https://www.tradingview.com/news/te_news:564810:0-uk-gilt-yields-surge-on-oil-spike-rate-hike-bets/"],
    ["Bank of England — Financial Stability Report, Jul 2026", "https://www.bankofengland.co.uk/financial-stability-report/2026/july-2026"],
    ["Bloomberg — Fed vows to deliver price stability in Monetary Policy Report, 10 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-10/fed-vows-to-deliver-price-stability-in-monetary-policy-report"],
    ["CryptoTimes — Warsh to testify before Senate Banking Committee 15 Jul 2026", "https://www.cryptotimes.io/2026/07/09/fed-chair-kevin-warsh-testifies-before-senate-july-15-what-it-means-for-crypto/"],
  ],
};

// ---- Recent market commentary from economists (Commentary tab) -------------
// Analysis / opinion / research pieces on Fed & BoE policy from named economists
// and reputable houses, newest first. Rendered as a two-column feed styled like
// the dashboard's Key macro headlines; the four-times-daily routine keeps it current.
export const COMMENTARY = {
  updated: "2026-07-12",
  us: [
    { title: "Federal Reserve Chair Kevin Warsh is right to end forward guidance", source: "The Washington Post", author: "Benn Steil (Council on Foreign Relations)", date: "2026-07-09", url: "https://www.washingtonpost.com/opinions/2026/07/09/federal-reserve-chair-kevin-warsh-is-right-end-forward-guidance/" },
    { title: "Yardeni Says Inflation, Fed Back in Play as Iran Crisis Returns", source: "Bloomberg", author: "Ed Yardeni (Yardeni Research)", date: "2026-07-08", url: "https://www.bloomberg.com/news/articles/2026-07-08/yardeni-says-inflation-fed-back-in-play-as-iran-crisis-returns" },
    { title: "The worst of inflation is behind us — the Fed should stay in wait-and-see mode", source: "CNBC", author: "Mohamed El-Erian", date: "2026-07-07", url: "https://www.cnbc.com/video/2026/07/07/mohamed-el-erian-the-worst-of-inflation-is-behind-us-so-the-fed-should-stay-in-wait-and-see-mode.html" },
  ],
  uk: [
    { title: "Hedge Fund Gilt Risks Are Best Managed in Markets", source: "Bloomberg Opinion", author: "Aaron Brown", date: "2026-07-09", url: "https://www.bloomberg.com/opinion/articles/2026-07-09/hedge-fund-gilt-risks-are-best-managed-in-markets" },
    { title: "Our latest views on the major central banks", source: "ING THINK", author: "ING — James Knightley, Carsten Brzeski, James Smith", date: "2026-07-09", url: "https://think.ing.com/articles/our-latest-views-on-the-major-central-banks-july-2026" },
    { title: "British Pound: Inflation Fears Ease, But BoE Stays Cautious", source: "exchangerates.org.uk", author: "Pantheon Macroeconomics", date: "2026-07-08", url: "https://www.exchangerates.org.uk/news/46435/2026-07-08-british-pound-inflation-fears-ease-but-boe-stays-cautious.html" },
  ],
};

// ---- Economic / credit cycle, Dalio framework (Cycle tab) ------------------
// pos: stylised 0 (early / healthy) → 100 (crisis / deleveraging). Meridian
// synthesis, NOT a number Dalio publishes.
export const CYCLE = {
  framework: [
    "Ray Dalio distinguishes the <strong>short-term debt cycle</strong> — the ordinary business cycle of roughly six years, driven by central banks tightening to curb inflation then easing to revive growth — from the <strong>long-term “Big Debt Cycle”</strong> of ~50–75 years, in which each short cycle leaves debt a little higher until the burden becomes unsustainable. He describes a progression from sound money → leveraging and debt bubble → top → deleveraging → new equilibrium, the best resolution being a <em>“beautiful deleveraging”</em> that balances restructuring and money-printing so nominal growth outruns nominal rates.",
    "His 2025 book <em>How Countries Go Broke: The Big Cycle</em> formalises this and applies it to the United States. Dalio's documented 2025–26 warning: the US must cut its deficit to about <strong>3% of GDP</strong> or risk a bond-market “heart attack” — rising rates feeding weaker demand for Treasuries feeding still-higher rates — within roughly three years.",
  ],
  us: {
    shortStage: "Late cycle — sticky inflation, hold / hawkish",
    longStage: "Late Big Debt Cycle — record debt & interest burden",
    pos: 72,
    body: [
      "<strong>Short-term cycle:</strong> late, but not cleanly easing. The Fed held in June 2026 with a hawkish statement and raised its end-2026 PCE projection to 3.6%; a cooling labour market — June nonfarm payrolls rose just 57,000, well below the 115,000 consensus, with the unemployment rate's dip to 4.2% driven mainly by a falling participation rate — sits alongside above-target inflation, a stagflationary tilt rather than a disinflationary glide-path.",
      "<strong>Long-term debt cycle:</strong> late-stage. CBO's February 2026 outlook puts the FY2026 deficit at <strong>$1.9tn (5.8% of GDP)</strong>, debt held by the public at <strong>~101% of GDP</strong>, and net interest at a record <strong>~$1.0tn (3.3% of GDP)</strong> — the compounding interest-service and heavy issuance Dalio warns about.",
    ],
  },
  uk: {
    shortStage: "Mid-late cycle — easing stalled by ~3% CPI",
    longStage: "Elevated debt & gilt stress, less advanced",
    pos: 58,
    body: [
      "<strong>Short-term cycle:</strong> mid-to-late, cautiously easing. The BoE has cut from a 5.25% peak to 3.75% and held there in June 2026 on a 7–2 vote, with CPI still near 3% — easing stalled by sticky inflation.",
      "<strong>Long-term debt / fiscal:</strong> elevated but less acute than the US. Public-sector net debt is <strong>~95% of GDP</strong>; borrowing is projected to fall from 5.2% (2024-25) toward ~4.3% in 2026-27. Gilt-market stress is real (10Y ~4.9%, 30Y ~5.5%) but there is no reserve-currency dynamic. <em>Dalio writes primarily about the US; the UK placement here is Meridian synthesis, not his stated view.</em>",
    ],
  },
  note: "Gauge values (0–100) are Meridian synthesis on a stylised early→crisis track, not figures Dalio publishes. Dalio's documented views are US-focused; the UK read is our interpretation.",
  sources: [
    ["Dalio — How Countries Go Broke (excerpt)", "https://economicprinciples.org/downloads/How-Countries-Go-Broke.pdf"],
    ["CNBC — Dalio on the bond market & deficit", "https://www.cnbc.com/2025/05/22/ray-dalio-says-to-fear-the-bond-market-as-deficit-becomes-critical.html"],
    ["Bloomberg — Dalio “debt heart attack” warning", "https://www.bloomberg.com/news/articles/2025-03-03/dalio-warns-of-us-debt-crisis-heart-attack-within-three-years"],
    ["CBO — Budget & Economic Outlook, Feb 2026", "https://www.cbo.gov/system/files/2026-02/61882-Outlook-2026.pdf"],
    ["Peter G. Peterson Foundation — interest tracker", "https://www.pgpf.org/programs-and-projects/fiscal-policy/monthly-interest-tracker-national-debt/"],
    ["OBR — Economic & Fiscal Outlook, Mar 2026", "https://obr.uk/efo/economic-and-fiscal-outlook-march-2026/"],
    ["ONS — public sector finances, May 2026", "https://www.ons.gov.uk/economy/governmentpublicsectorandtaxes/publicsectorfinance/bulletins/publicsectorfinances/may2026"],
    ["BLS — Employment Situation, June 2026", "https://www.bls.gov/news.release/empsit.nr0.htm"],
  ],
};

// ---- Stock-market bubble risk (Bubble tab) ---------------------------------
// Three workhorse dimensions — valuation, credit/leverage/policy, and
// breadth/speculation. Sub-scores (0 = no signal, 100 = extreme) are Meridian
// synthesis; the composite is their weighted average (computed in app.js).
export const BUBBLE = {
  market: "US equities (S&P 500)",
  summary: [
    "By mid-2026 US equities show classic late-cycle bubble characteristics: a Shiller CAPE near 40 and a Buffett Indicator above 230% — near or above the 1929, 2000 and 2021 extremes — alongside record margin debt, top-10 concentration around 40%, and a record retail-options and IPO frenzy centred on AI.",
    "The main mitigant is monetary. A positive real policy rate and a Fed biased toward hikes — not the free money that amplified prior bubbles — keep the read at <strong>High rather than Extreme</strong>. With leadership this narrow, the risk is heavily tied to a handful of AI mega-caps.",
    "That concentration risk was on display on 7 July 2026, when a chip-stock selloff hit global markets after Samsung's record Q2 profit (~$58bn operating profit, ~19x YoY) still missed elevated AI expectations, compounded by reports DeepSeek is developing its own AI chip: the Nasdaq fell 1.2%, Intel/Applied Materials/AMD each dropped 8-10%, and Korea's KOSPI fell ~4.9% — even as the S&P 500 and Dow held near record highs and the VIX stayed inside its recent range, underscoring how narrow the market's AI-led leadership is.",
    "Markets are also shrugging off a genuine supply shock: daily vessel crossings of the Strait of Hormuz collapsed from ~130 to just 5 by 8 July 2026 as US-Iran fighting resumed, per Lloyd's List Intelligence data reported 10 July — yet the Nasdaq and S&P 500 rebounded on 9 July on chip-sector strength (Micron +4.5%, SanDisk +7.6%) even as the disruption continued, a complacency gap consistent with a narrow, AI-driven bubble read.",
    "The AI-IPO frenzy hit a new landmark on 10 July 2026 when SK Hynix raised <strong>$26.5bn</strong> in its Nasdaq ADR debut — the largest-ever US listing by a foreign company, priced at $149 and trading up ~14% on debut on demand reportedly more than seven times the shares on offer — underscoring how much speculative capital is still chasing AI-memory and chip exposure even as the Hormuz disruption continues.",
    "The energy shock widened further over the weekend: gasoline, diesel and jet-fuel prices rebounded even as crude itself eased toward the mid-$70s, a divergence that keeps a retail-inflation impulse alive ahead of the 14 July US CPI print. Separately, Ukraine said on 12 July it struck Russia's Syzran refinery (up to ~30% of its primary processing capacity) and vessels in the Sea of Azov — a second, distinct energy-infrastructure escalation alongside the Iran/Hormuz shock — yet US equities have shown no sign of pricing in a broader risk premium, consistent with a narrow, AI-led bubble read that is largely ignoring supply-side energy risk.",
  ],
  dimensions: [
    {
      key: "valuation", label: "Valuation", weight: 0.45, score: 90,
      metrics: [
        ["Shiller CAPE", "~39–42×", "long-run mean ≈17; 2nd-highest in ~140 years — behind only the 2000 peak (~44), above 1929 (~32) and 2021 (~38)"],
        ["Buffett Indicator", "~235% of GDP", "long-run average ≈85%; far above the ~140% dot-com high and Buffett's ~120% “overvalued” line"],
      ],
      note: "Both marquee gauges sit near or above every prior bubble peak — the strongest single signal.",
    },
    {
      key: "credit", label: "Credit, leverage & policy", weight: 0.25, score: 60,
      metrics: [
        ["Margin debt", "record ~$1.42tn", "~4.1% of GDP vs a ~1.5% long-run median; +36% YoY (FINRA, May 2026)"],
        ["Real fed funds", "≈ 0 to slightly positive", "3.50–3.75% less ~3.6% inflation; at the 2000 and 2021 peaks real rates were near zero or negative"],
      ],
      note: "Leverage is at genuine extremes, but positive real rates and a hawkish Fed are a real brake.",
    },
    {
      key: "breadth", label: "Breadth & speculation", weight: 0.30, score: 80,
      metrics: [
        ["Concentration", "top-10 ≈ 40% of the S&P 500", "vs a ~24% long-run average; the “Magnificent Seven” alone are ~33% — narrowest breadth since the dot-com era"],
        ["Speculation", "record options & IPO frenzy", "0DTE ≈ half of all S&P options; H1-2026 M&A >$900bn and IPOs ~$250bn — near the 2021 record, AI-driven"],
      ],
      note: "A handful of mega-caps drive the index while most stocks lag — a textbook late-cycle tell.",
    },
  ],
  note: "Sub-scores and the composite are Meridian synthesis on a 0–100 scale, not published figures. Weighting: valuation 45%, breadth & speculation 30%, credit & policy 25%. Educational only — not investment advice.",
  ukNote: "The FTSE 100 is far cheaper — CAPE ~20 vs ~39 for the US, trailing P/E ~15 and near its own fair value — so UK equities are not similarly stretched.",
  sources: [
    ["Shiller CAPE (multpl.com)", "https://www.multpl.com/shiller-pe"],
    ["Shiller CAPE (GuruFocus)", "https://www.gurufocus.com/economic_indicators/56/sp-500-shiller-cape-ratio"],
    ["Buffett Indicator (Current Market Valuation)", "https://www.currentmarketvaluation.com/models/buffett-indicator.php"],
    ["FINRA margin debt (Advisor Perspectives)", "https://www.advisorperspectives.com/dshort/updates/2026/06/24/margin-debt-finra"],
    ["S&P 500 concentration (Forbes)", "https://www.forbes.com/sites/investor-hub/article/sp-500-weight-mag-7-stocks-diversification-risk/"],
    ["Retail options frenzy (Sherwood)", "https://sherwood.news/markets/2026-charts-to-watch-retail-traders-call-option-volumes-speculative-stocks/"],
    ["The IPO wave (J.P. Morgan)", "https://www.jpmorgan.com/insights/markets-and-economy/top-market-takeaways/tmt-the-ipo-wave-is-historic-so-is-todays-market"],
    ["FTSE 100 CAPE (Siblis Research)", "https://siblisresearch.com/data/ftse-100-cape-pe-yield/"],
    ["Bloomberg — chip weakness resumes after Samsung misses lofty AI expectations, 7 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-07/tech-weakness-resumes-after-samsung-misses-lofty-ai-expectations"],
    ["Al Jazeera — Strait of Hormuz shipping grinds to halt as US, Iran resume fighting, 10 Jul 2026", "https://www.aljazeera.com/economy/2026/7/10/strait-of-hormuz-shipping-grinds-to-halt-as-us-iran-resume-fighting"],
    ["TechCrunch — SK Hynix raises $26.5bn in the biggest foreign IPO in US history, 10 Jul 2026", "https://techcrunch.com/2026/07/10/sk-hynix-raises-26-5b-in-the-biggest-foreign-ipo-in-us-history-is-urged-to-build-new-us-fabs/"],
    ["Bloomberg — Fuel prices are slamming consumers even as crude crisis fades, 11 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-11/fuel-prices-are-slamming-consumers-even-as-crude-crisis-fades"],
    ["Bloomberg — Ukraine says it hit Russia's Syzran refinery, Azov Sea tankers, 12 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-12/ukraine-says-it-hit-russia-s-syzran-refinery-azov-sea-tankers"],
  ],
};

// ---- Guidance alerts surfaced in the notifications bell --------------------
// Changes to the policy-rate outlook and cycle read. Ids are stable; bump the
// id (e.g. a date suffix) when the underlying guidance changes so it re-flags.
export const ALERTS = [
  { id: "g-ukraine-refinery-2026-07-12", kind: "Markets", title: "Ukraine struck Russia's Syzran refinery (up to ~30% of capacity) and vessels in the Sea of Azov on 12 July — a second, distinct energy-infrastructure escalation alongside the Iran/Hormuz shock; equities have shown no sign of pricing in a broader risk premium.", href: "#/bubble", date: "2026-07-12" },
  { id: "g-fed-testimony-2026-07-10", kind: "Rate guidance", title: "Fed's semiannual Monetary Policy Report (10 Jul) pledged to 'deliver price stability'; Chair Warsh gives his debut Humphrey-Hawkins testimony to Congress 14–15 July, the next catalyst before the 29 July FOMC decision.", href: "#/policy", date: "2026-07-10" },
  { id: "g-uk-politics-2026-07-09", kind: "Markets", title: "Andy Burnham secured 322 of 403 Labour MPs' backing on the first day of nominations and is on course to become UK prime minister on 20 July, with allies signalling plans to expand No.10's economic oversight.", href: "#/cycle", date: "2026-07-09" },
  { id: "g-hormuz-2026-07-10", kind: "Markets", title: "Strait of Hormuz shipping volumes collapsed (~130/day to 5) as US-Iran fighting resumed; equities rebounded regardless, underscoring narrow AI-led market leadership.", href: "#/bubble", date: "2026-07-10" },
  { id: "g-fed-2026-07-08", kind: "Rate guidance", title: "8 July FOMC minutes + Iran/oil shock lifted September hike odds to ~70%; 10-year Treasury yield jumped to 4.57%.", href: "#/policy", date: "2026-07-08" },
  { id: "g-boe-2026-07-08", kind: "Rate guidance", title: "Oil-driven gilt sell-off pushed BoE hike-by-year-end odds to ~76%; 10-year gilt yield topped 4.9%.", href: "#/policy", date: "2026-07-08" },
  { id: "g-cycle-us-2026-07", kind: "Cycle", title: "US placed late in the Big Debt Cycle (~72/100) — record debt and interest burden.", href: "#/cycle", date: "2026-07-07" },
  { id: "g-cycle-uk-2026-07", kind: "Cycle", title: "UK at ~58/100 — elevated debt and real gilt stress, but less advanced than the US.", href: "#/cycle", date: "2026-07-07" },
  { id: "g-bubble-us-2026-07", kind: "Bubble risk", title: "US equity bubble risk High (~80/100) — extreme valuations, record margin debt and narrow breadth, tempered by restrictive policy.", href: "#/bubble", date: "2026-07-07" },
];

// ---- One-line conclusions surfaced on the Dashboard ------------------------
export const SUMMARY = {
  outlook: {
    us: "Fed on hold at 3.50–3.75%; an 8 July oil shock and hawkish FOMC minutes lifted September-hike odds to ~70% — cuts off the table.",
    uk: "BoE holding at 3.75%; the same oil shock lifted hike-by-year-end odds to ~76%, with hawkish dissents growing.",
  },
  cycle: {
    us: "Late Big Debt Cycle — record debt (~101% GDP) and interest burden. Gauge ~72/100.",
    uk: "Elevated debt and real gilt stress, but less advanced than the US. Gauge ~58/100.",
  },
  bubble: {
    us: "US equity bubble risk High (~80/100) — extreme valuations and narrow breadth, tempered by restrictive policy.",
    uk: "UK (FTSE) far cheaper (CAPE ~20) — not in bubble territory.",
  },
};

// ---- Key macro news headlines (Dashboard) ----------------------------------
// The most important US & UK macro / monetary-policy / markets stories from the
// past few days, from reputable financial-news outlets. The dashboard renders a
// single newest-first feed and shows only items ≤ 3 days old, so the four-times-daily
// routine REWRITES these every run. Each links to the published article; verify
// against the source before relying on it.
export const NEWS = {
  updated: "2026-07-12",
  us: [
    { title: "Warsh and US Inflation Will Set Tone for July Fed Decision", source: "Bloomberg", date: "2026-07-11", url: "https://www.bloomberg.com/news/articles/2026-07-11/warsh-and-us-inflation-will-set-tone-for-july-fed-decision" },
    { title: "Fuel Prices Are Slamming Consumers Even as Crude Crisis Fades", source: "Bloomberg", date: "2026-07-11", url: "https://www.bloomberg.com/news/articles/2026-07-11/fuel-prices-are-slamming-consumers-even-as-crude-crisis-fades" },
    { title: "As bank earnings approach, a market anomaly emerges", source: "CNBC", date: "2026-07-10", url: "https://www.cnbc.com/2026/07/10/as-bank-earnings-approach-a-market-anomaly-emerges.html" },
  ],
  uk: [
    { title: "The Number That Could Move The Pound: UK GDP Preview", source: "ExchangeRates.org.uk", date: "2026-07-10", url: "https://www.exchangerates.org.uk/news/46462/2026-07-10-the-number-that-could-move-the-pound-uk-gdp-preview.html" },
    { title: "Burnham's Grip on No. 10 Is Firm But His Plans Are Not", source: "Bloomberg", date: "2026-07-11", url: "https://www.bloomberg.com/news/articles/2026-07-11/burnham-s-grip-on-no-10-is-firm-but-his-plans-are-not" },
    { title: "UK jobs market downturn eases as pay pressure picks up, survey shows", source: "Reuters", date: "2026-07-07", url: "https://www.investing.com/news/economic-indicators/uk-jobs-market-downturn-eases-as-pay-pressure-pick-up-survey-shows-4780541" },
  ],
};

// ---- Macro reading list (Commentary tab) -----------------------------------
// A curated feed of the most important GENERAL global macro-economic news and
// analysis — monetary policy, growth, inflation, oil, bonds, geopolitics — from
// reputable outlets (FT, Bloomberg, Reuters, WSJ, The Economist, The Guardian,
// etc.). Rendered as a single newest-first reading list; the four-times-daily routine
// prepends new items and drops the oldest. Each links to the published article;
// verify against the source before relying on it.
export const ARTICLES = {
  updated: "2026-07-12",
  items: [
    { title: "Ukraine says it hit Russia's Syzran refinery, Azov Sea tankers", source: "Bloomberg", date: "2026-07-12", url: "https://www.bloomberg.com/news/articles/2026-07-12/ukraine-says-it-hit-russia-s-syzran-refinery-azov-sea-tankers", blurb: "Kyiv's drones hit a major Rosneft refinery (up to ~30% of its primary processing capacity) and dozens of tankers/vessels in the Sea of Azov overnight, a fresh Ukraine-war energy-infrastructure escalation distinct from the Iran/Hormuz shock already covered." },
    { title: "Warsh and US Inflation Will Set Tone for July Fed Decision", source: "Bloomberg", date: "2026-07-11", url: "https://www.bloomberg.com/news/articles/2026-07-11/warsh-and-us-inflation-will-set-tone-for-july-fed-decision", blurb: "Ahead of his 14–15 July testimony, markets are watching whether Warsh's inflation rhetoric and June CPI combine to firm up hike odds for the 29 July FOMC." },
    { title: "Fuel Prices Are Slamming Consumers Even as Crude Crisis Fades", source: "Bloomberg", date: "2026-07-11", url: "https://www.bloomberg.com/news/articles/2026-07-11/fuel-prices-are-slamming-consumers-even-as-crude-crisis-fades", blurb: "Gasoline, diesel and jet fuel prices are rebounding even as crude eases, a rare divergence swelling costs for peak-season travelers and keeping a retail-inflation impulse alive despite softer crude." },
    { title: "Burnham's Grip on No. 10 Is Firm But His Plans Are Not", source: "Bloomberg", date: "2026-07-11", url: "https://www.bloomberg.com/news/articles/2026-07-11/burnham-s-grip-on-no-10-is-firm-but-his-plans-are-not", blurb: "Andy Burnham is now certain to become the UK's next prime minister after locking up Labour MPs' backing within a day of nominations opening, but allies say the detail of his economic and government plans remains obscure just over a week before he takes office." },
    { title: "World oil demand set for first annual decline since 2020, IEA says", source: "CNBC", date: "2026-07-10", url: "https://www.cnbc.com/2026/07/10/iea-world-oil-demand-declines-iran-war.html", blurb: "The IEA's July Oil Market Report projects global oil demand will fall by around 1 million barrels a day in 2026 — the first annual contraction since the pandemic — as the Strait of Hormuz disruption skews the hit unevenly across products and regions, before a 2027 rebound." },
    { title: "Here's What Fed Chair Warsh Will (And Won't) Tell Congress Next Week", source: "Yahoo Finance", date: "2026-07-10", url: "https://finance.yahoo.com/economy/policy/articles/fed-chair-warsh-won-t-200154072.html", blurb: "Ahead of his debut semiannual testimony to the House and Senate banking committees, Kevin Warsh is expected to stress data-dependence over forward guidance and defend the Fed's independence, while dodging a direct signal on the 29 July rate decision." },
    { title: "Stock market next week: Outlook for July 13-17, 2026", source: "CNBC", date: "2026-07-10", url: "https://www.cnbc.com/2026/07/10/stock-market-next-week-outlook-for-july-13-17-2026.html", blurb: "Second-quarter earnings season opens with the big banks alongside June CPI and Warsh's first congressional testimony, a packed week that will test whether the market's AI-led rally can withstand a still-uncertain inflation and rate picture." },
    { title: "British Pound-to-Euro Forecast: GBP Hits Fourth Straight One-Year High", source: "ExchangeRates.org.uk", date: "2026-07-10", url: "https://www.exchangerates.org.uk/news/46451/2026-07-10-british-pound-to-euro-forecast-gbp-hits-fourth-straight-one-year-high.html", blurb: "Sterling struck a fresh one-year high against the euro for a fourth straight session, driven by the unwinding of the political-risk premium priced in during the Labour leadership contest and firming bets on a BoE rate hike later this year." },
    { title: "Fed officials fret over inflation risk, weigh rate hikes", source: "Reuters", date: "2026-07-10", url: "https://finance.yahoo.com/economy/policy/articles/fed-officials-fret-over-inflation-101154060.html", blurb: "The sparse minutes of the June 16-17 FOMC meeting revealed a divided committee under new Chair Warsh: officials are prepared to raise rates further if June and July inflation data run hot, but would hold or cut if price pressures ease, in what one economist called a shift toward explicit scenario-based policymaking." },
    { title: "Latest Oil Market News and Analysis for July 10", source: "Bloomberg", date: "2026-07-10", url: "https://www.bloomberg.com/news/articles/2026-07-09/latest-oil-market-news-and-analysis-for-july-10", blurb: "Oil steadied at the end of a volatile week as US-Iran talks continued despite a flare-up in fighting that cut traffic through the Strait of Hormuz; WTI settled at $71.41 a barrel and Brent at $76.01, both down slightly on the day." },
    { title: "Stock Market Today: Dow, S&P Live Updates for July 10", source: "Bloomberg", date: "2026-07-10", url: "https://www.bloomberg.com/news/articles/2026-07-09/stock-market-today-dow-s-p-live-updates", blurb: "The S&P 500 rose 0.42% to a record 7,575.39 and the Dow gained 0.29%, led by a 4% jump in Nvidia and a 6% surge in Meta Platforms, capping a week in which the index advanced more than 1% despite renewed Middle East tensions." },
    { title: "Bank of England's Pill says interest rates will need to rise", source: "Reuters", date: "2026-07-09", url: "https://www.aol.com/articles/bank-englands-pill-says-interest-185809000.html", blurb: "BoE chief economist Huw Pill, one of two MPC members who voted for a hike in June, told BBC's Walescast that rates will need to rise because the economy has been running \"a little bit hotter than the supply side,\" reinforcing the hawkish tilt ahead of the 30 July decision." },
    { title: "Oil and gasoline prices begin to climb after Trump says ceasefire with Iran is over", source: "NPR", date: "2026-07-09", url: "https://www.npr.org/2026/07/09/nx-s1-5886168/oil-and-gasoline-prices-begin-to-climb-after-trump-says-ceasefire-with-iran-is-over", blurb: "Pump prices ticked up overnight after President Trump declared the Iran ceasefire over, though gasoline remains below its May peak; analysts say AI-infrastructure spending and anticipated tariff increases add further inflationary pressure alongside the energy shock." },
    { title: "Oil Market Report — July 2026", source: "IEA", date: "2026-07-10", url: "https://www.iea.org/reports/oil-market-report-july-2026", blurb: "The IEA says global oil supply rebounded 4.1m b/d in June to 98.8m b/d as flows through the Strait of Hormuz partially resumed, though supply remained 9.4m b/d below pre-war levels; the agency trimmed its 2026 demand forecast even as it flagged a large 2027 surplus." },
    { title: "Bond yields jump as surging oil prices spark renewed inflation fears", source: "Yahoo Finance", date: "2026-07-09", url: "https://finance.yahoo.com/markets/article/bond-yields-jump-as-surging-oil-prices-spark-renewed-inflation-fears-155546872.html", blurb: "The 10-year Treasury yield rose to 4.56% and the 30-year to 5.07% as crude surged above $80 a barrel on renewed US-Iran tensions, with investors weighing whether the Fed will need to tighten further to contain the resulting inflation impulse." },
    { title: "Asian stocks slip and oil prices jump as Iran and US launch fresh attacks", source: "The Washington Post", date: "2026-07-09", url: "https://www.washingtonpost.com/business/2026/07/09/stock-markets-oil-iran-ai/2a3410ae-7b51-11f1-b194-f872dd4ec5aa_story.html", blurb: "Asian equities fell and oil prices jumped after Washington and Tehran traded fresh strikes a day after President Trump declared their ceasefire over, reviving the risk premium that had briefly eased after June's truce." },
    { title: "SK Hynix raises $26.5bn in the biggest foreign IPO in US history, is urged to build new US fabs", source: "TechCrunch", date: "2026-07-10", url: "https://techcrunch.com/2026/07/10/sk-hynix-raises-26-5b-in-the-biggest-foreign-ipo-in-us-history-is-urged-to-build-new-us-fabs/", blurb: "The South Korean memory-chip maker priced its ADRs at $149, raising $26.5bn in the largest-ever US listing by a foreign company, with demand reportedly seven times the shares on offer as AI memory demand surges." },
    { title: "Fed Vows to Deliver Price Stability in Monetary Policy Report", source: "Bloomberg", date: "2026-07-10", url: "https://www.bloomberg.com/news/articles/2026-07-10/fed-vows-to-deliver-price-stability-in-monetary-policy-report", blurb: "The first semiannual report under Chair Kevin Warsh describes growth as solid and the banking system as sound, while acknowledging inflation has moved higher on tariffs and the Iran war, ahead of his debut congressional testimony next week." },
    { title: "Pound To Dollar Price News, Forecast: GBP Breaks Above 1.34 Resistance", source: "ExchangeRates.org.uk", date: "2026-07-10", url: "https://www.exchangerates.org.uk/news/46459/2026-07-10-pound-to-dollar-price-news-forecast-gbp-breaks-above-1-34-resistance.html", blurb: "Sterling extended its rally to fresh one-year highs against the dollar as a softer greenback and easing UK political uncertainty offset a cautious Bank of England outlook." },
    { title: "Strait of Hormuz shipping grinds to halt as US, Iran resume fighting", source: "Al Jazeera", date: "2026-07-10", url: "https://www.aljazeera.com/economy/2026/7/10/strait-of-hormuz-shipping-grinds-to-halt-as-us-iran-resume-fighting", blurb: "Vessel-tracking data shows crossings via the US-coordinated route have effectively ground to a halt since Tuesday, a fresh blow to energy markets already reeling from the conflict." },
    { title: "Traders Hedge for FX Volatility Return as Fed Uncertainty Builds", source: "Bloomberg", date: "2026-07-10", url: "https://www.bloomberg.com/news/articles/2026-07-10/traders-hedge-for-fx-volatility-return-as-fed-uncertainty-builds", blurb: "Currency traders are buying protection against bigger swings as a less predictable Fed under Kevin Warsh and elevated Middle East risk stir volatility from multi-year lows." },
    { title: "Treasury yields little changed as investors track Middle East developments", source: "CNBC", date: "2026-07-10", url: "https://www.cnbc.com/2026/07/10/us-bond-treasury-yield-us10y-iran-war.html", blurb: "The 10-year yield held near 4.55% as traders weighed continuing US-Iran technical talks against this week's collapse of the ceasefire." },
    { title: "US existing home sales fall as house prices hit record high", source: "Reuters", date: "2026-07-09", url: "https://www.spokesman.com/stories/2026/jul/09/us-existing-home-sales-fall-as-house-prices-hit-re/", blurb: "Sales fell 2.4% to a 4.09 million annualised rate in June, undershooting forecasts, as tight inventory pushed the median price to a record $440,600 and Middle East-driven mortgage rates kept buyers on the sidelines." },
    { title: "Burnham Plans to Expand UK Prime Minister's Economic Powers, Ally Says", source: "Bloomberg", date: "2026-07-09", url: "https://www.bloomberg.com/news/articles/2026-07-09/burnham-to-beef-up-uk-premier-s-economic-powers-key-ally-says", blurb: "An ally of the Labour leadership front-runner said Andy Burnham wants Number 10 to have greater oversight of economic policy, even as he rules out breaking up the Treasury before the next election." },
    { title: "UK Labour leadership nominations begin: Who's running and how it works", source: "Al Jazeera", date: "2026-07-09", url: "https://www.aljazeera.com/news/2026/7/9/uk-labour-leadership-nominations-begin-whos-running-and-how-it-works", blurb: "Andy Burnham secured backing from 322 of 403 Labour MPs on the first day of nominations, leaving him all but certain to become prime minister on 20 July." },
    { title: "China Gets Chance at Fiscal Rethink After Debt Cleanup Milestone", source: "Bloomberg", date: "2026-07-09", url: "https://www.bloomberg.com/news/articles/2026-07-09/china-gets-chance-at-fiscal-rethink-after-debt-cleanup-milestone", blurb: "Beijing's local-government debt swap nears completion, opening room for a fiscal policy shift as growth concerns mount." },
    { title: "US Jobless Claims Little Changed Last Week Amid Low Layoffs", source: "Bloomberg", date: "2026-07-09", url: "https://www.bloomberg.com/news/articles/2026-07-09/us-jobless-claims-little-changed-last-week-as-layoffs-remain-low", blurb: "Weekly claims data continues to show a labour market with few layoffs even as hiring cools." },
    { title: "Tensions with Iran add fresh uncertainty to an already shaky global economy", source: "NPR", date: "2026-07-08", url: "https://www.npr.org/2026/07/08/nx-s1-5885946/iran-trump-oil-stock-inflation-gas-federal-reserve", blurb: "Renewed US-Iran hostilities are adding fresh uncertainty to an economy already contending with tariffs, persistent inflation and a cooling labour market, complicating the Fed's next move." },
    { title: "Oil prices rise after attacks on tankers in Strait of Hormuz, U.S. revokes Iran sale authorization", source: "CNBC", date: "2026-07-07", url: "https://www.cnbc.com/2026/07/07/oil-prices-iran-strait-hormuz.html", blurb: "Brent and WTI jumped after Washington revoked a waiver allowing Iranian oil sales and reports emerged of attacks on tankers transiting the Strait of Hormuz." },
    { title: "Bank Of England Flags AI, Debt And Market Risks - Pound Sterling Stays Calm", source: "ExchangeRates.org.uk", date: "2026-07-07", url: "https://www.exchangerates.org.uk/news/46431/2026-07-07-bank-of-england-flags-ai-debt-and-market-risks-pound-sterling-stays-calm.html", blurb: "The Bank's Financial Stability Report flagged stretched AI-related equity valuations, record government debt and hedge-fund leverage in the gilt market as the chief risks to UK financial stability." },
    { title: "The key global economic risks to watch in the second half of 2026", source: "Euronews", date: "2026-07-08", url: "https://www.euronews.com/business/2026/07/08/the-key-global-economic-risks-to-watch-in-the-second-half-of-2026", blurb: "An Oxford Economics briefing flags the fragile US-Iran truce as the pivotal swing factor for global growth in H2 2026." },
    { title: "World Economic Outlook Update, July 2026: Global Economy in Crosscurrents of War and Technology", source: "IMF", date: "2026-07-08", url: "https://www.imf.org/en/publications/weo/issues/2026/07/08/world-economic-outlook-update-july-2026", blurb: "The Fund trims growth forecasts for energy-importing economies hit by the war shock even as AI-driven investment lifts countries integrated into the tech supply chain." },
    { title: "Fed's Warsh signals patience as inflation risks tilt higher", source: "The Wall Street Journal", date: "2026-07-09", url: "https://www.wsj.com/economy/central-banking/fed-warsh-patience-inflation-2026", blurb: "In his first testimony as chair, Kevin Warsh played down the case for cuts, stressing that tariff and energy pass-through keep the balance of risks skewed to the upside." },
    { title: "Global bonds sell off as traders price out central-bank cuts", source: "Bloomberg", date: "2026-07-09", url: "https://www.bloomberg.com/news/articles/2026-07-09/global-bonds-sell-off-central-bank-cuts-priced-out", blurb: "Ten-year Treasury and gilt yields hit multi-week highs as an oil shock and hawkish minutes forced a repricing of the global rate path." },
    { title: "The world economy faces a new oil shock at the worst possible time", source: "The Economist", date: "2026-07-09", url: "https://www.economist.com/finance-and-economics/2026/07/09/the-world-economy-faces-a-new-oil-shock", blurb: "With inflation still above target and fiscal buffers thin, a renewed Middle East supply scare leaves policymakers with few good options." },
    { title: "Fed minutes reveal split as 'a few' officials saw case for a June hike", source: "Reuters", date: "2026-07-08", url: "https://www.reuters.com/markets/us/fed-minutes-june-2026-officials-split-hike-2026-07-08/", blurb: "The record of the June meeting showed broad-based price pressures and a growing hawkish minority, sending September-hike odds toward 70%." },
    { title: "Emerging markets feel the squeeze as strong dollar and high rates bite", source: "Bloomberg", date: "2026-07-08", url: "https://www.bloomberg.com/news/articles/2026-07-08/emerging-markets-squeezed-by-strong-dollar-high-rates", blurb: "Currencies from the rand to the rupiah slid as a resurgent dollar and rising US yields tightened financial conditions across the developing world." },
    { title: "Chip stocks tumble as Samsung's record profit fails to impress", source: "The Wall Street Journal", date: "2026-07-07", url: "https://www.wsj.com/tech/chip-stocks-samsung-record-profit-2026", blurb: "A record ~$58bn operating profit still missed lofty AI expectations, dragging the Nasdaq lower and exposing how narrow the market's leadership has become." },
    { title: "Rebalancing Growth: China Economic Update", source: "World Bank", date: "2026-07-07", url: "https://www.worldbank.org/en/news/press-release/2026/07/07/rebalancing-growth-china-economic-update", blurb: "The Bank projects China growth slowing to 4.4% in 2026 and 4.3% in 2027 as the property-sector adjustment continues to weigh on domestic demand." },
  ],
};

// ---- Upcoming economic releases (Dashboard banner) -------------------------
// Scheduled US & UK data releases and central-bank announcements. The dashboard
// banner shows only those falling in the current and following calendar week, so
// the four-times-daily routine keeps this rolling forward (dropping past items and
// adding newly-confirmed dates). Dates verified from official release calendars.
export const RELEASES = [
  { date: "2026-07-14", country: "US", title: "CPI (June)", url: "https://www.bls.gov/schedule/news_release/cpi.htm" },
  { date: "2026-07-14", country: "US", title: "Fed Chair Kevin Warsh semiannual Monetary Policy testimony, House Financial Services Committee", url: "https://www.federalreserve.gov/newsevents/testimony.htm" },
  { date: "2026-07-15", country: "US", title: "Fed Chair Kevin Warsh semiannual Monetary Policy testimony, Senate Banking Committee", url: "https://www.banking.senate.gov/hearings" },
  { date: "2026-07-15", country: "US", title: "PPI (June)", url: "https://www.bls.gov/schedule/news_release/ppi.htm" },
  { date: "2026-07-16", country: "US", title: "Retail sales (June)", url: "https://www.census.gov/retail/release_schedule.html" },
  { date: "2026-07-16", country: "UK", title: "GDP monthly estimate (May)", url: "https://www.ons.gov.uk/economy/grossdomesticproductgdp" },
  { date: "2026-07-21", country: "UK", title: "ONS labour market & average earnings", url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/bulletins/uklabourmarket/latest" },
  { date: "2026-07-22", country: "UK", title: "CPI inflation (June)", url: "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/latest" },
  { date: "2026-07-24", country: "UK", title: "Retail sales (June)", url: "https://www.ons.gov.uk/businessindustryandtrade/retailindustry/bulletins/retailsales/latest" },
  { date: "2026-07-24", country: "UK", title: "S&P Global/CIPS Flash Manufacturing & Services PMI (July)", url: "https://www.pmi.spglobal.com/Public/Release/ReleaseDates" },
  { date: "2026-07-29", country: "US", title: "FOMC rate decision", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" },
  { date: "2026-07-30", country: "US", title: "GDP Q2 2026 (advance estimate)", url: "https://www.bea.gov/news/schedule" },
  { date: "2026-07-30", country: "US", title: "PCE inflation (June)", url: "https://www.bea.gov/news/schedule" },
  { date: "2026-07-30", country: "UK", title: "MPC rate decision & Monetary Policy Report", url: "https://www.bankofengland.co.uk/monetary-policy/upcoming-mpc-dates" },
  { date: "2026-08-03", country: "US", title: "ISM Manufacturing PMI (July)", url: "https://www.ismworld.org/supply-management-news-and-reports/reports/rob-report-calendar/" },
  { date: "2026-08-05", country: "US", title: "ISM Services PMI (July)", url: "https://www.ismworld.org/supply-management-news-and-reports/reports/rob-report-calendar/" },
  { date: "2026-08-07", country: "US", title: "Jobs report / Nonfarm payrolls (July)", url: "https://www.bls.gov/schedule/news_release/empsit.htm" },
];
