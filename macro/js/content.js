// =============================================================================
// Meridian Macro — editorial content for the Commentary and Cycle tabs, plus the
// short conclusions surfaced on the Dashboard. Compiled from public commentary
// and official data on the dates cited; educational only, not investment advice.
// Each claim carries a source link — verify against it before relying on it.
// =============================================================================

export const UPDATED = "14 July 2026";

// ---- Refresh stamp (bumped every routine run, like Credit/Legal data.js) ----
// LAST_CHECKED is the "Last refresh" date shown in the top bar; LAST_CHECKED_TIME
// is a pre-formatted "HH:MM TZ" London string so it renders the same in any
// viewer timezone. The four-times-daily refresh routine advances both on every run.
export const META = {
  lastChecked: "2026-07-14",
  lastCheckedTime: "10:13 BST",
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
      "Governor Christopher Waller sharpened the hawkish signal on 13 July, telling the New York Association for Business Economics that ~70% of core-services categories are running above 3% and that <strong>'if we get another hot reading on core inflation this week, then the FOMC will need to consider tightening monetary policy in the near term.'</strong> Market pricing has moved with him: CME FedWatch now shows a <strong>~46.5% probability of a 29 July hike</strong> (from a low base a week earlier) and Kalshi prediction-market odds jumped to ~36%, up from under 10% earlier in the month, as Tuesday's June CPI print looms.",
    ],
    bottomLine: "A 29 July hike has gone from a tail risk to a live, market-priced possibility (~46.5% CME FedWatch) after Governor Waller's 13 July hawkish remarks and the ongoing Iran/oil shock; Tuesday's CPI print and Warsh's 14–15 July congressional testimony are the immediate catalysts, with cuts off the table for now.",
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
    bottomLine: "Next move a hold on 30 July at 3.75%; markets now fully price a 25bp hike by year-end (most likely December) as the 10-year gilt yield holds above 4.9% on the renewed oil shock, with hawkish dissents growing and cuts off the table.",
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
    ["TradingView/Trading Economics — UK gilt yields hold above 4.9% on BoE hike bets, 13 Jul 2026", "https://www.tradingview.com/news/te_news:565653:0-uk-gilt-yields-hold-above-4-9-on-boe-hike-bets/"],
    ["Federal Reserve — Governor Waller, \"Monetary Policy at a Crossroads\", 13 Jul 2026", "https://www.federalreserve.gov/newsevents/speech/waller20260713a.htm"],
    ["Reuters (via GV Wire) — Fed's Waller says rate hike may be needed if core inflation stays hot, 13 Jul 2026", "https://gvwire.com/2026/07/13/feds-waller-says-rate-hike-may-be-needed-if-core-inflation-stays-hot/"],
    ["CNBC — A July rate hike from the Fed? The odds are rising, 13 Jul 2026", "https://www.cnbc.com/2026/07/13/-a-july-rate-hike-from-the-fed-the-odds-are-rising.html"],
  ],
};

// ---- Recent market commentary from economists (Commentary tab) -------------
// Analysis / opinion / research pieces on Fed & BoE policy from named economists
// and reputable houses, newest first. Rendered as a two-column feed styled like
// the dashboard's Key macro headlines; the four-times-daily routine keeps it current.
export const COMMENTARY = {
  updated: "2026-07-13",
  us: [
    { title: "Oil prices march upward again as the U.S-Iran conflict intensifies — and it's yet another headache for Warsh and the Fed", source: "Fortune", author: "Goldman Sachs — David Mericle (via Fortune)", date: "2026-07-13", url: "https://fortune.com/2026/07/13/oil-price-rises-inflation-expectations-warsh-fed-goldman/" },
    { title: "Federal Reserve Chair Kevin Warsh is right to end forward guidance", source: "The Washington Post", author: "Benn Steil (Council on Foreign Relations)", date: "2026-07-09", url: "https://www.washingtonpost.com/opinions/2026/07/09/federal-reserve-chair-kevin-warsh-is-right-end-forward-guidance/" },
    { title: "Yardeni Says Inflation, Fed Back in Play as Iran Crisis Returns", source: "Bloomberg", author: "Ed Yardeni (Yardeni Research)", date: "2026-07-08", url: "https://www.bloomberg.com/news/articles/2026-07-08/yardeni-says-inflation-fed-back-in-play-as-iran-crisis-returns" },
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
    "The Hormuz shock escalated sharply on 12 July: the US struck Iran for a third time in a week, Tehran fired on a vessel and declared the Strait closed 'until the end of the American intervention in the region', and Iran retaliated with strikes against US-allied Gulf states including Qatar and the UAE, though Washington maintains traffic through the waterway is still flowing. With markets shut over the weekend the equity reaction is untested, but the episode raises the stakes for Monday's open and for the 14 July CPI print — and, if futures hold last week's pattern of shrugging off Middle-East escalation, would be a further data point for a narrow, complacent AI-led rally.",
    "That narrow-leadership risk stopped being purely theoretical on 13 July: South Korea's KOSPI triggered a circuit breaker as SK Hynix plunged as much as 14–15% (its worst on record) and Samsung Electronics fell over 10%, just days after SK Hynix's record $26.5bn Nasdaq debut, with the sell-off spreading to European chip suppliers. The same day the US and Iran traded a further round of strikes — Iran hit US-linked sites in Bahrain, Kuwait and Jordan — pushing Brent to a three-week high near $78.82/bbl, while US equities were comparatively muted ahead of Tuesday's CPI print, underscoring how concentrated the market's AI-led gains remain and how little of the geopolitical or chip-sector risk is being priced into the broader index.",
    "The standoff escalated further within the day on 13 July as President Trump announced the US would reinstate its Iran blockade in the Strait of Hormuz and impose a 20% toll on all other cargo transiting the waterway — reversing Washington's prior opposition to tolls — while Brent held near $79–80/bbl on the news; US equities were little changed into the early afternoon (S&P 500 -0.4%, Nasdaq -1%), a further test of how much geopolitical and chip-sector risk is being priced into the broader index.",
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
    ["Bloomberg — US, Iran trade wave of attacks as Tehran says Hormuz closed, 12 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-12/us-iran-trade-wave-of-attacks-as-tehran-says-hormuz-closed"],
    ["TradingKey — Kospi plummets to trigger circuit breaker, SK Hynix plunges, Samsung drops, 13 Jul 2026", "https://www.tradingkey.com/analysis/stocks/more/262025472-kospi-samsung-skhynix-ai-adr-skhy-tradingkey"],
    ["Bloomberg — SK Hynix shares drop in Seoul after much-hyped US trading debut, 13 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-13/sk-hynix-shares-drop-in-seoul-after-much-hyped-us-trading-debut"],
    ["Al Jazeera — Oil prices jump as US and Iran trade attacks over Strait of Hormuz, 13 Jul 2026", "https://www.aljazeera.com/economy/2026/7/13/oil-prices-jump-as-us-and-iran-trade-attacks-over-strait-of-hormuz"],
    ["AP — Trump says US will blockade Iran, charge 20% toll on Hormuz cargo, 13 Jul 2026", "https://www.yahoo.com/news/politics/articles/us-ends-latest-round-airstrikes-024503851.html"],
  ],
};

// ---- Guidance alerts surfaced in the notifications bell --------------------
// Changes to the policy-rate outlook and cycle read. Ids are stable; bump the
// id (e.g. a date suffix) when the underlying guidance changes so it re-flags.
export const ALERTS = [
  { id: "g-burnham-confirmed-2026-07-13", kind: "Markets", title: "Andy Burnham secured the Labour leadership with landslide MP support, confirming his path to become UK prime minister on 20 July — resolving the political-risk overhang flagged earlier in the week.", href: "#/cycle", date: "2026-07-13" },
  { id: "g-waller-hike-odds-2026-07-13", kind: "Rate guidance", title: "Fed Governor Waller said a 29 July rate hike 'will need to be considered' if core inflation stays hot in Tuesday's CPI print — CME FedWatch now shows ~46.5% odds of a hike (from a low base a week earlier) and Kalshi odds jumped to ~36%, a sharp shift from the prior hold-biased framing.", href: "#/policy", date: "2026-07-13" },
  { id: "g-hormuz-toll-2026-07-13", kind: "Markets", title: "Trump said the US will reinstate its Iran blockade in the Strait of Hormuz and impose a 20% toll on all other cargo transiting the waterway — a reversal of Washington's prior opposition to tolls that further undercuts last month's interim ceasefire and adds to the oil-driven inflation risk facing the Fed and BoE.", href: "#/bubble", date: "2026-07-13" },
  { id: "g-kospi-2026-07-13", kind: "Bubble risk", title: "South Korea's KOSPI triggered a circuit breaker as SK Hynix fell as much as 14-15% and Samsung Electronics dropped over 10%, days after SK Hynix's $26.5bn Nasdaq debut — a real crack in the narrow, AI-led rally rather than just a valuation ratio.", href: "#/bubble", date: "2026-07-13" },
  { id: "g-hormuz-widens-2026-07-13", kind: "Markets", title: "The US and Iran traded a further round of strikes on 13 July, with Iran firing on US-linked sites in Bahrain, Kuwait and Jordan — the standoff has widened geographically beyond the Strait of Hormuz itself; Brent crude rose over 4% to a three-week high near $78.82/bbl.", href: "#/bubble", date: "2026-07-13" },
  { id: "g-boe-hike-odds-2026-07-13", kind: "Rate guidance", title: "UK 10-year gilt yields held above 4.9% as markets moved to fully price a 25bp BoE hike by year-end (most likely December), a firmer call than the prior hawkish-hold framing.", href: "#/policy", date: "2026-07-13" },
  { id: "g-hormuz-closed-2026-07-12", kind: "Markets", title: "Tehran declared the Strait of Hormuz closed and fired on a vessel on 12 July after the US struck Iran for a third time in a week; Iran retaliated against Gulf states including Qatar and the UAE, though Washington says traffic is still flowing — a sharp escalation beyond the shipping slowdown already flagged.", href: "#/bubble", date: "2026-07-12" },
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
    us: "Fed on hold at 3.50–3.75%; Governor Waller's 13 July hawkish remarks pushed 29 July hike odds to ~46.5% (CME FedWatch) as the Iran oil shock persists — cuts off the table.",
    uk: "BoE holding at 3.75%; markets now fully price a 25bp hike by year-end (most likely December) as gilt yields hold above 4.9%, with hawkish dissents growing.",
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
  updated: "2026-07-14",
  us: [
    { title: "Fed Rate-Hike Bets Mount Before Inflation Data, Warsh Testimony", source: "Bloomberg", date: "2026-07-14", url: "https://www.bloomberg.com/news/articles/2026-07-14/fed-rate-hike-bets-mount-before-inflation-data-warsh-testimony" },
    { title: "Dollar steady before US inflation data, yen under pressure", source: "CNBC", date: "2026-07-14", url: "https://www.cnbc.com/2026/07/14/dollar-steady-before-us-inflation-data-yen-under-pressure.html" },
    { title: "Oil prices hit 1-month high as US-Iran attacks dim Strait of Hormuz outlook", source: "Al Jazeera", date: "2026-07-14", url: "https://www.aljazeera.com/economy/2026/7/14/oil-hits-1-month-high-as-us-iran-fighting-clouds-strait-of-hormuz-outlook" },
    { title: "Stock market today: Dow, S&P 500, Nasdaq futures decline as traders lift Fed rate hike bets ahead of key inflation data", source: "Yahoo Finance", date: "2026-07-14", url: "https://finance.yahoo.com/markets/live/stock-market-today-tuesday-july-14-dow-sp-500-nasdaq-070833816.html" },
    { title: "Morning Bid: Fed in the spotlight as Warsh faces Congress", source: "Reuters (via Investing.com)", date: "2026-07-14", url: "https://www.investing.com/news/economy-news/morning-bid-fed-in-the-spotlight-as-warsh-faces-congress-4789685" },
  ],
  uk: [
    { title: "Andrew Bailey: speech at the Annual Financial and Professional Services Dinner, Mansion House", source: "Bank of England", date: "2026-07-14", url: "https://www.bankofengland.co.uk/speech/2026/july/andrew-bailey-speech-at-manison-house" },
    { title: "FTSE 100 Live: Bond Yields Jump as Traders Add to Rate-Hike Bets", source: "Bloomberg", date: "2026-07-14", url: "https://www.bloomberg.com/news/live-blog/2026-07-14/ftse-100-live-brent-oil-iran-trump-hormuz-pound-bonds-reeves-what-s-moving-uk-markets-right-now-markets-today" },
    { title: "FTSE 100 Live: Stocks drop as oil surges after Trump reinstates Iranian blockade", source: "CityAM", date: "2026-07-14", url: "https://www.cityam.com/ftse-100-live-stocks-to-dip-as-oil-surges-after-trump-reinstates-iranian-blockade/" },
    { title: "Top investors managing $3tn to gain access to UK infrastructure projects via AI platform", source: "CityAM", date: "2026-07-14", url: "https://www.cityam.com/top-investors-managing-3tn-to-gain-access-to-uk-infrastructure-projects-via-ai-platform/" },
    { title: "Sterling today: Pound slips as US-Iran escalation drives oil, dollar", source: "Investing.com", date: "2026-07-13", url: "https://www.investing.com/news/forex-news/sterling-today-pound-slips-as-usiran-escalation-drives-oil-dollar-4787777" },
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
  updated: "2026-07-14",
  items: [
    {"title":"Fed Rate-Hike Bets Mount Before Inflation Data, Warsh Testimony","source":"Bloomberg","date":"2026-07-14","url":"https://www.bloomberg.com/news/articles/2026-07-14/fed-rate-hike-bets-mount-before-inflation-data-warsh-testimony","blurb":"Traders lift the odds of a July Fed hike as June CPI lands hours before new Chair Kevin Warsh's first Capitol Hill testimony."},
    {"title":"Morning Bid: Fed in the spotlight as Warsh faces Congress","source":"Reuters (via Investing.com)","date":"2026-07-14","url":"https://www.investing.com/news/economy-news/morning-bid-fed-in-the-spotlight-as-warsh-faces-congress-4789685","blurb":"A daily markets column framing today's collision of CPI, Warsh's Humphrey-Hawkins debut, Iran-driven oil and Q2 bank earnings."},
    {"title":"Oil prices hit 1-month high as US-Iran attacks dim Strait of Hormuz outlook","source":"Al Jazeera","date":"2026-07-14","url":"https://www.aljazeera.com/economy/2026/7/14/oil-hits-1-month-high-as-us-iran-fighting-clouds-strait-of-hormuz-outlook","blurb":"Brent hits a one-month high as a third day of US-Iran strikes chokes off Hormuz shipping traffic, with $100 oil flagged as a live risk."},
    {"title":"Dollar steady before US inflation data, yen under pressure","source":"CNBC","date":"2026-07-14","url":"https://www.cnbc.com/2026/07/14/dollar-steady-before-us-inflation-data-yen-under-pressure.html","blurb":"FX markets mark time ahead of the June CPI print, with the yen the session's clearest mover."},
    {"title":"Stock market today: Dow, S&P 500, Nasdaq futures decline as traders lift Fed rate hike bets ahead of key inflation data","source":"Yahoo Finance","date":"2026-07-14","url":"https://finance.yahoo.com/markets/live/stock-market-today-tuesday-july-14-dow-sp-500-nasdaq-070833816.html","blurb":"US equity futures slip as markets price higher odds of a July Fed hike ahead of the CPI release."},
    {"title":"FTSE 100 Live: Bond Yields Jump as Traders Add to Rate-Hike Bets","source":"Bloomberg","date":"2026-07-14","url":"https://www.bloomberg.com/news/live-blog/2026-07-14/ftse-100-live-brent-oil-iran-trump-hormuz-pound-bonds-reeves-what-s-moving-uk-markets-right-now-markets-today","blurb":"Live UK-markets blog tracking gilts, sterling and Chancellor Reeves's Mansion House speech against the Hormuz oil-shock backdrop."},
    {"title":"FTSE 100 Live: Stocks drop as oil surges after Trump reinstates Iranian blockade","source":"CityAM","date":"2026-07-14","url":"https://www.cityam.com/ftse-100-live-stocks-to-dip-as-oil-surges-after-trump-reinstates-iranian-blockade/","blurb":"Brent tops $84 as Washington reimposes a Strait of Hormuz blockade and floats a 20% transit toll.","author":"Samuel Norman & Felix Armstrong"},
    {"title":"Top investors managing $3tn to gain access to UK infrastructure projects via AI platform","source":"CityAM","date":"2026-07-14","url":"https://www.cityam.com/top-investors-managing-3tn-to-gain-access-to-uk-infrastructure-projects-via-ai-platform/","blurb":"At her Mansion House dinner speech, Chancellor Reeves unveils an AI-driven investment platform meant to funnel global capital into UK infrastructure.","author":"Maisie Grice"},
    {"title":"Sterling today: Pound slips as US-Iran escalation drives oil, dollar","source":"Investing.com","date":"2026-07-13","url":"https://www.investing.com/news/forex-news/sterling-today-pound-slips-as-usiran-escalation-drives-oil-dollar-4787777","blurb":"Sterling gives back ground as the renewed Hormuz standoff lifts oil and the dollar.","author":"Navamya Acharya"},
    {"title":"CNBC Daily Open: Hormuz toll threats, Mideast tensions keep investors on edge","source":"CNBC","date":"2026-07-14","url":"https://www.cnbc.com/2026/07/14/cnbc-daily-open-hormuz-toll-threats-mideast-tensions-keep-investors-on-edge.html","blurb":"Markets stay jittery as Trump's proposed Hormuz toll overshadows Tuesday's CPI print and bank earnings."},
    {"title":"Fed chair Kevin Warsh testifies on monetary policy in House hearing","source":"PBS News","date":"2026-07-14","url":"https://www.pbs.org/newshour/politics/watch-live-fed-chair-kevin-warsh-testifies-on-monetary-policy-in-house-hearing","blurb":"Warsh's debut semiannual congressional testimony lands the same day as the June CPI report."},
    {"title":"Andrew Bailey: speech at the Annual Financial and Professional Services Dinner, Mansion House","source":"Bank of England","date":"2026-07-14","url":"https://www.bankofengland.co.uk/speech/2026/july/andrew-bailey-speech-at-manison-house","blurb":"The BoE Governor's flagship City speech, delivered at the annual Mansion House dinner."},
    {"title":"Latest Oil Market News and Analysis for July 14","source":"Bloomberg","date":"2026-07-13","url":"https://www.bloomberg.com/news/articles/2026-07-13/latest-oil-market-news-and-analysis-for-july-14","blurb":"Oil holds its biggest gain since April after Trump threatens a Hormuz blockade and cargo toll."},
    {"title":"Wall Street to Fed's Warsh: Skip the Guidance, Tell Us What You Think","source":"Bloomberg","date":"2026-07-13","url":"https://www.bloomberg.com/news/articles/2026-07-13/wall-street-to-fed-s-warsh-skip-the-guidance-tell-us-what-you-think","blurb":"Investors want clearer signals as Warsh charts a new course for Fed communication."},
    {"title":"Bank earnings: JPMorgan Chase, Goldman Sachs, Bank of America","source":"CNBC","date":"2026-07-13","url":"https://www.cnbc.com/2026/07/13/bank-earnings-jpmorgan-chase-goldman-sachs-bank-of-america.html","blurb":"Big US banks kick off Q2 earnings season against a backdrop of oil-driven rate-hike risk."},
    {"title":"UK two-year gilt yield hits 1-month high as Iran and US clash","source":"Reuters","date":"2026-07-13","url":"https://live.euronext.com/en/financial-news/uk-two-year-gilt-yield-hits-1-month-high-iran-and-us-clash","blurb":"Short gilts sell off as traders price a firmer chance of BoE tightening."},
    {"title":"Andy Burnham secures Labour leadership with landslide support, paving way to becoming UK PM","source":"The Irish Times","date":"2026-07-13","url":"https://www.irishtimes.com/world/uk/2026/07/13/andy-burnham-secures-labour-leadership-with-landslide-support-paving-way-to-becoming-uk-pm/","blurb":"Burnham locks up enough MP backing to become UK PM unopposed on 20 July."},
    {"title":"Oil jumps amid fears of prolonged disruption in Strait of Hormuz","source":"The National","date":"2026-07-13","url":"https://www.thenationalnews.com/business/energy/2026/07/13/oil-jumps-amid-fears-of-prolonged-disruption-in-strait-of-hormuz/","blurb":"Brent tops $78 as renewed US-Iran strikes threaten a fifth of global oil and gas flows."},
    {"title":"Fed's Waller Says Rate Hike May Be Needed if Core Inflation Stays Hot","source":"Reuters","date":"2026-07-13","url":"https://gvwire.com/2026/07/13/feds-waller-says-rate-hike-may-be-needed-if-core-inflation-stays-hot/","blurb":"Fed Governor Christopher Waller said he'll treat another hot core-inflation print as 'signal, not noise' ahead of Tuesday's CPI, and that the FOMC may need to consider tightening in the near term if price pressures stay elevated."},
    {"title":"A July Rate Hike From the Fed? The Odds Are Rising","source":"CNBC","date":"2026-07-13","url":"https://www.cnbc.com/2026/07/13/-a-july-rate-hike-from-the-fed-the-odds-are-rising.html","blurb":"CME FedWatch now shows a 46.5% probability of a quarter-point hike at the 29 July FOMC meeting, up sharply as the Iran/Hormuz oil shock revives inflation concerns."},
    {"title":"Trump Takes a Page From Iran's Playbook on the Strait of Hormuz","source":"Fortune","date":"2026-07-13","url":"https://fortune.com/2026/07/13/trump-hormuz-toll-reimbursement-iran-naval-blockade-cargo-fee-oil/","blurb":"Analysis of Trump's proposed 20% cargo toll for transiting the Strait of Hormuz as a revenue play over the contested chokepoint.","author":"Eleanor Pringle"},
    {"title":"UN Shipping Agency Opposes Fees for Any Strait, After Trump Plans Hormuz Charge","source":"Reuters / U.S. News","date":"2026-07-13","url":"https://www.usnews.com/news/world/articles/2026-07-13/un-shipping-agency-opposes-fees-for-any-strait-after-trump-plans-hormuz-charge","blurb":"The International Maritime Organization said it 'stands firmly against charging fees for passage through straits used for international navigation,' rejecting the legal basis for Trump's proposed Hormuz toll."},
    {"title":"Burnham's Budget Is at the Mercy of a Middle East War: The Readout","source":"Bloomberg","date":"2026-07-13","url":"https://www.bloomberg.com/news/newsletters/2026-07-13/burnham-s-budget-is-at-the-mercy-of-a-middle-east-war-the-readout","blurb":"Incoming UK prime minister Andy Burnham's fiscal room is increasingly tied to the Iran-driven oil-price spike, ahead of a possible bolstered autumn Budget."},
    {"title":"UK Stock Market Today (July 13): FTSE 100 Edges Higher While FTSE 250 Slips Amid Middle East Crisis and Rising Oil Prices- What Should Investors Know","source":"Sunday Guardian Live","date":"2026-07-13","url":"https://sundayguardianlive.com/business/uk-stock-market-today-july-13-ftse-100-edges-higher-while-ftse-250-slips-amid-middle-east-crisis-and-rising-oil-prices-what-should-investors-know-235463/","blurb":"The FTSE 100 edged higher to 10,528.74 (+0.30%) as rising oil prices from Middle East tensions supported energy stocks despite broader market caution; the FTSE 250 slipped."},
    {"title":"Pound To Dollar Weekly Forecast: GBP Hits Three-Week High Despite Middle East Tensions","source":"ExchangeRates.org.uk","date":"2026-07-13","url":"https://www.exchangerates.org.uk/news/46482/2026-07-13-pound-to-dollar-weekly-forecast-gbp-hits-three-week-high-despite-middle-east-tensions.html","blurb":"Sterling held near a three-week high against the dollar as traders further reduced the UK political-risk premium following Andy Burnham's expected smooth transition to prime minister and firming BoE rate-hike bets."},
    {"title":"Trump Says US Will Blockade Iran in the Strait of Hormuz and Will Charge Ships for Safe Passage","source":"Associated Press","date":"2026-07-13","url":"https://www.yahoo.com/news/politics/articles/us-ends-latest-round-airstrikes-024503851.html","blurb":"President Trump said the US will reinstate its Iran blockade in the Strait of Hormuz and charge a 20% fee on all other cargo transiting the waterway, reversing Washington's prior opposition to tolls and further straining the interim ceasefire reached last month."},
    {"title":"Oil Prices March Upward Again as the U.S-Iran Conflict Intensifies — and It's Yet Another Headache for Warsh and the Fed","source":"Fortune","date":"2026-07-13","url":"https://fortune.com/2026/07/13/oil-price-rises-inflation-expectations-warsh-fed-goldman/","blurb":"Goldman Sachs chief US economist David Mericle warned in a weekend note that a re-escalation of oil toward $100/bbl could add 3-4bp to monthly core inflation, leaving the Fed 'little margin for error' even as he still expects a hold this year.","author":"Eleanor Pringle"},
    {"title":"Britain's Likely Future PM Andy Burnham Considers Bolstered Budget This Year","source":"Bloomberg","date":"2026-07-13","url":"https://www.bloomberg.com/news/newsletters/2026-07-13/britain-s-likely-future-pm-andy-burnham-considers-bolstered-budget-this-year","blurb":"Allies and advisers are pushing Britain's incoming prime minister Andy Burnham toward a land tax, public ownership of utilities and a more ambitious devolution agenda ahead of a possible bolstered autumn Budget."},
    {"title":"FTSE 100 Live: UK Bonds Lead Europe Selloff as Inflation Fears Rekindled","source":"Bloomberg","date":"2026-07-13","url":"https://www.bloomberg.com/news/live-blog/2026-07-13/ftse-100-live-updated-iran-trump-oil-prices-pound-gilts-hormuz-uk-data-what-s-moving-uk-markets-right-now-markets-today-mrisu12x","blurb":"UK gilts led a broader European bond selloff as the renewed Iran/Hormuz oil shock revived inflation fears and hardened bets on a Bank of England rate hike by year-end."},
    {"title":"US and Iran Exchange Strikes as Strait of Hormuz Standoff Escalates","source":"CNBC","date":"2026-07-13","url":"https://www.cnbc.com/2026/07/13/us-iran-war-hormuz-oil-trump.html","blurb":"Washington and Tehran traded a further round of attacks, with Iran firing on US-linked sites in Bahrain, Kuwait and Jordan as the Strait of Hormuz standoff widens geographically beyond the shipping lane itself."},
    {"title":"Oil Prices Jump as US and Iran Trade Attacks Over Strait of Hormuz","source":"Al Jazeera","date":"2026-07-13","url":"https://www.aljazeera.com/economy/2026/7/13/oil-prices-jump-as-us-and-iran-trade-attacks-over-strait-of-hormuz","blurb":"Brent crude jumped over 4% to a three-week high near $78.82/bbl as Hormuz vessel crossings collapsed to roughly six in a 12-hour window versus a normal 18-22 a day."},
    {"title":"Kospi Plummets to Trigger Circuit Breaker, SK Hynix Plunges, Samsung Electronics Drops","source":"TradingKey","date":"2026-07-13","url":"https://www.tradingkey.com/analysis/stocks/more/262025472-kospi-samsung-skhynix-ai-adr-skhy-tradingkey","blurb":"South Korea's KOSPI triggered a circuit breaker as SK Hynix fell as much as 14-15% just days after its $26.5bn Nasdaq debut and Samsung Electronics dropped over 10%, spreading the chip-stock correction to European suppliers and sharpening the AI-bubble narrative."},
    {"title":"SK Hynix Shares Drop in Seoul After Much-Hyped US Trading Debut","source":"Bloomberg","date":"2026-07-13","url":"https://www.bloomberg.com/news/articles/2026-07-13/sk-hynix-shares-drop-in-seoul-after-much-hyped-us-trading-debut","blurb":"SK Hynix shares fell in Seoul trading in the wake of its record $26.5bn Nasdaq ADR debut, as investors reassessed how much further the AI-memory rally can run."},
    {"title":"Don't Be Fooled: America's Inflation Problems Aren't Going Away Anytime Soon","source":"CNN Business","date":"2026-07-13","url":"https://us.cnn.com/2026/07/13/economy/inflation-prices","blurb":"Tariff pass-through and the renewed energy shock are keeping underlying US price pressures elevated heading into Tuesday's June CPI print, CNN's economics team argues."},
    {"title":"FTSE 100 Live: Global Stocks Fall as Oil Prices Hit Three-Week High on Iran Fighting","source":"Proactive Investors","date":"2026-07-13","url":"https://www.proactiveinvestors.com/companies/news/1095311/ftse-100-live-global-stocks-fall-as-oil-prices-hit-three-week-high-on-iran-fighting-1095311.html","blurb":"UK and global equities slipped as renewed US-Iran fighting pushed oil to a three-week high, with energy stocks outperforming and tech/chip names leading the losses."},
    {"title":"UK Gilt Yields Hold Above 4.9% on BoE Hike Bets","source":"TradingView / Trading Economics","date":"2026-07-13","url":"https://www.tradingview.com/news/te_news:565653:0-uk-gilt-yields-hold-above-4-9-on-boe-hike-bets/","blurb":"The 10-year gilt yield held above 4.9% — near its highest since 10 June — as markets moved to fully price a 25bp BoE hike by year-end, most likely in December, on the back of the renewed oil shock."},
    {"title":"Fed Chair Kevin Warsh Bets on AI, Taps Marc Andreessen and Xbox CEO Asha Sharma","source":"Benzinga","date":"2026-07-10","url":"https://www.benzinga.com/markets/tech/26/07/60375922/fed-chair-kevin-warsh-bets-on-ai-taps-marc-andreessen-and-xbox-ceo-asha-sharma-to-help-inform-future-fed-policy","blurb":"Warsh empanelled an AI task force chaired by Marc Andreessen alongside Stanford's Charles I. Jones and Microsoft's Asha Sharma to study AI's effect on growth, inflation and future Fed policy."},
    {"title":"US, Iran Trade Wave of Attacks as Tehran Says Hormuz Closed","source":"Bloomberg","date":"2026-07-12","url":"https://www.bloomberg.com/news/articles/2026-07-12/us-iran-trade-wave-of-attacks-as-tehran-says-hormuz-closed","blurb":"The US struck Iran for a third time in a week, prompting Tehran to fire on a vessel and declare the Strait of Hormuz closed, while retaliating against US-allied Gulf states including Qatar and the UAE — a sharp escalation beyond the shipping slowdown already covered, though Washington maintains traffic is flowing."},
    {"title":"Pound Sterling: UK Economy Defies Higher Oil Prices, Says Pantheon","source":"ExchangeRates.org.uk","date":"2026-07-12","url":"https://www.exchangerates.org.uk/news/46480/2026-07-12-pound-sterling-uk-economy-defies-higher-oil-prices-says-pantheon.html","blurb":"Pantheon Macroeconomics says the UK economy is showing surprising resilience to the renewed Middle East oil shock, but still expects it to raise the risk of further BoE tightening even as a prolonged hold stays the base case."},
    {"title":"Ukraine says it hit Russia's Syzran refinery, Azov Sea tankers","source":"Bloomberg","date":"2026-07-12","url":"https://www.bloomberg.com/news/articles/2026-07-12/ukraine-says-it-hit-russia-s-syzran-refinery-azov-sea-tankers","blurb":"Kyiv's drones hit a major Rosneft refinery (up to ~30% of its primary processing capacity) and dozens of tankers/vessels in the Sea of Azov overnight, a fresh Ukraine-war energy-infrastructure escalation distinct from the Iran/Hormuz shock already covered."},
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
  { date: "2026-07-15", country: "US", title: "Fed Beige Book", url: "https://www.federalreserve.gov/monetarypolicy/publications/beige-book-default.htm" },
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
  { date: "2026-07-31", country: "US", title: "Employment Cost Index (Q2 2026)", url: "https://www.bls.gov/schedule/news_release/eci.htm" },
  { date: "2026-08-03", country: "US", title: "ISM Manufacturing PMI (July)", url: "https://www.ismworld.org/supply-management-news-and-reports/reports/rob-report-calendar/" },
  { date: "2026-08-05", country: "US", title: "ISM Services PMI (July)", url: "https://www.ismworld.org/supply-management-news-and-reports/reports/rob-report-calendar/" },
  { date: "2026-08-07", country: "US", title: "Jobs report / Nonfarm payrolls (July)", url: "https://www.bls.gov/schedule/news_release/empsit.htm" },
  { date: "2026-08-12", country: "US", title: "CPI (July)", url: "https://www.bls.gov/schedule/news_release/cpi.htm" },
  { date: "2026-08-13", country: "US", title: "PPI (July)", url: "https://www.bls.gov/schedule/news_release/ppi.htm" },
];
