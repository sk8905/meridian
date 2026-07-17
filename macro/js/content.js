// =============================================================================
// Meridian Macro — editorial content for the Commentary and Cycle tabs, plus the
// short conclusions surfaced on the Dashboard. Compiled from public commentary
// and official data on the dates cited; educational only, not investment advice.
// Each claim carries a source link — verify against it before relying on it.
// =============================================================================

export const UPDATED = "17 July 2026";

// ---- Refresh stamp (bumped every routine run, like Credit/Legal data.js) ----
// LAST_CHECKED is the "Last refresh" date shown in the top bar; LAST_CHECKED_TIME
// is a pre-formatted "HH:MM TZ" London string so it renders the same in any
// viewer timezone. The four-times-daily refresh routine advances both on every run.
export const META = {
  lastChecked: "2026-07-17",
  lastCheckedTime: "05:25 BST",
};

// ---- Policy-rate outlook (Commentary tab) ----------------------------------
export const OUTLOOK = {
  us: {
    rate: "3.50–3.75%",
    next: "29 Jul",
    stance: "Hold · hawkish bias easing",
    body: [
      "The FOMC held its target range at <strong>3.50–3.75%</strong> on 17 June 2026 — a fourth consecutive hold (12–0), and the first meeting chaired by Kevin Warsh. The June dot plot lifted the median year-end-2026 dot to roughly <strong>3.8%</strong> (from 3.4% in March), with nine of nineteen participants now pencilling in at least one further <em>hike</em> — a hawkish pivot from the earlier easing bias.",
      "The driver is re-accelerating inflation: <strong>core PCE hit 3.4% in May</strong>, its highest since October 2023, on tariff pass-through and a Middle-East energy shock. Solid growth and a firm labour market remove the case for cuts, though some argue tariff effects are near their peak.",
      "For the 28–29 July meeting, a Reuters poll (72 of 102 economists) and futures overwhelmingly expect a <strong>hold</strong>. Through year-end, futures price the rate drifting toward <strong>~4% by December</strong> — about one 25bp hike; J.P. Morgan sees no move in 2026, Deutsche Bank two.",
      "Minutes of the June meeting, released 8 July 2026, showed <strong>'a few' officials already saw a case for a hike in June</strong>, with broad-based price pressures flagged across transportation, air fares, petrochemicals and agricultural inputs. The same day, President Trump said the Iran ceasefire was 'over' and threatened fresh strikes; Brent crude jumped ~5% and the 10-year Treasury yield rose to <strong>4.57%</strong> (highest since mid-May) as September-hike odds jumped to <strong>~70%</strong> from ~58%.",
      "The Fed's semiannual Monetary Policy Report to Congress, released 10 July 2026 — the first under Chair Warsh — pledged the Fed 'will deliver price stability', describing growth as solid and the banking system as sound while acknowledging inflation has moved higher on tariffs and the Iran war. Warsh delivers his debut Humphrey-Hawkins testimony to the House Financial Services Committee on 14 July and the Senate Banking Committee on 15 July, a key test of how firmly he leans hawkish before the 29 July decision.",
      "Governor Christopher Waller sharpened the hawkish signal on 13 July, telling the New York Association for Business Economics that ~70% of core-services categories are running above 3% and that <strong>'if we get another hot reading on core inflation this week, then the FOMC will need to consider tightening monetary policy in the near term.'</strong> Market pricing has moved with him: CME FedWatch now shows a <strong>~46.5% probability of a 29 July hike</strong> (from a low base a week earlier) and Kalshi prediction-market odds jumped to ~36%, up from under 10% earlier in the month, as Tuesday's June CPI print looms.",
      "That risk eased sharply on 14 July: <strong>June CPI fell 0.4% month-on-month</strong> (vs. -0.1% expected) and rose just <strong>3.5% year-on-year</strong> (down from 4.2% in May) — the largest monthly drop since 2020, driven by a 9.7% slide in gasoline prices; core CPI was flat on the month and eased to 2.6% y/y. CME FedWatch odds of a 29 July hike collapsed from ~46.5% to roughly <strong>15–20%</strong>, and the 2-year Treasury yield fell as much as 14bp to ~4.14%, its biggest one-day drop since February. Chair Warsh's same-day House testimony added no fresh signal — he called the Fed's prior average-inflation-targeting framework a 'mistake' and said the Fed has 'no tolerance' for elevated inflation, but avoided hinting at the July decision — while President Trump's same-day reversal of the proposed 20% Hormuz cargo toll eased some of the oil-driven inflation risk, even as the wider US-Iran conflict continues.",
      "The disinflation theme extended to producer prices on 15 July: <strong>June PPI fell 0.3% month-on-month</strong>, its first monthly decline since June 2025, with a 12% drop in gasoline prices driving two-thirds of the fall and core PPI slowing to a 4.6% annual pace from 4.9% in May. CME FedWatch odds of a 29 July hike have now fallen to roughly <strong>17%</strong> (from a peak near 46.5% a week earlier), though traders still assign around 59% odds to a hike by the September meeting given the still-live Hormuz oil shock. Chair Warsh gives a second day of testimony to the Senate Banking Committee on 15 July, having offered no fresh signal on 14 July.",
      "Warsh's Senate Banking Committee appearance on 15 July repeated his non-committal message — he again said the Fed has 'no tolerance' for elevated inflation and cautioned against reading the cooler CPI/PPI prints as 'mission accomplished' — while facing a sharp ethics clash with Sen. Elizabeth Warren, who said he 'seems to invite corruption'; Warsh confirmed he is in regular contact with the Trump administration but declined to say if he has personally spoken with the President since becoming chair. CME FedWatch odds of a 29 July hike fell further intraday to roughly <strong>10–13%</strong>, even as traders continue to price a real chance of a September move. Economist reaction was split: Mohamed El-Erian called the testimony 'a real breath of fresh air', while Peter Schiff criticised the Fed's inflation framework.",
      "The IMF's July 2026 World Economic Outlook Update, published 8 July, held global growth steady at 3.0% but lifted its global headline-inflation forecast to roughly <strong>4.7%</strong>, built on an $89/bbl oil-price assumption tied to the Middle East conflict — external confirmation that the Hormuz shock is a genuine, fund-level inflation risk rather than a purely domestic US pricing dynamic, reinforcing the case some FOMC hawks are making for keeping a hike on the table past July.",
      "Kansas City Fed President Jeff Schmid added a fresh hawkish voice on 16 July, calling inflation his 'primary concern', saying it is 'too hot' and has been 'above target too long', and cautioning against reading June's cooler CPI/PPI prints as a trend. Meanwhile early data for July pointed to some softening beneath the inflation debate: preliminary University of Michigan consumer sentiment (17 July) rose from May's low but stayed 13% below its pre-Iran-conflict February level, with year-ahead inflation expectations easing to 4.6% from 4.8%, while June housing starts/permits data (also 17 July) showed building permits down 0.9% month-on-month.",
    ],
    bottomLine: "The 29 July hike risk has eased further intraday to roughly 10-13% (CME FedWatch), down from ~17% after June PPI and a peak near 46.5% a week ago, as Warsh's second day of testimony again offered no fresh signal — though traders still price meaningful September-hike odds given the still-live Iran/oil shock, keeping the meeting a live, if now more lopsided, two-way risk.",
    // Market-implied odds for the next FOMC decision (CME FedWatch) and the FOMC's
    // June 2026 Summary of Economic Projections "dot plot" median path.
    fedwatch: {
      meeting: "29 Jul 2026",
      asOf: "15 Jul 2026",
      href: "https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html",
      outcomes: [
        { label: "Hold — 3.50–3.75%", pct: 88 },
        { label: "Hike +25bp — 3.75–4.00%", pct: 12 },
      ],
      note: "Implied from 30-Day Fed Funds futures. Down from a ~46.5% hike peak on 13 Jul after June CPI and PPI cooled and Warsh's testimony offered no fresh signal; traders still price ~59% odds of a hike by the September meeting.",
    },
    dots: {
      meeting: "June 2026 SEP",
      href: "https://www.federalreserve.gov/monetarypolicy/fomc_projections.htm",
      median: [
        { year: "2026", rate: "3.8%" },
        { year: "2027", rate: "3.6%" },
        { year: "2028", rate: "3.4%" },
        { year: "Longer run", rate: "3.0%" },
      ],
      note: "Median federal-funds projection of the 19 FOMC participants. The year-end-2026 median rose to 3.8% (from 3.4% in March), with 9 of 19 pencilling in at least one further hike.",
    },
  },
  uk: {
    rate: "3.75%",
    next: "30 Jul",
    stance: "Hold · hawkish dissents",
    body: [
      "The MPC held <strong>Bank Rate at 3.75%</strong> on 17–18 June 2026 by a 7–2 majority, with Megan Greene and Huw Pill dissenting for a 25bp <em>hike</em> to 4.00% — more hawkish than April's 8–1 hold. The Bank cited sticky services inflation and a fresh energy-price shock.",
      "<strong>Services inflation was 3.7% in May</strong> (up from 3.2%), the MPC's key persistence gauge, while headline CPI held at <strong>2.8%</strong>. Labour data is softening — regular pay (AWE ex-bonus) growth around <strong>3.4%</strong>, unemployment <strong>4.9%</strong> and a rising claimant count — pointing to gradually easing wage pressure, which tempers the hawks.",
      "Markets expect the Bank to <strong>hold at 3.75% for the rest of 2026</strong>. A Reuters poll of 65 economists found most see a year-end hold, but nearly 40% price at least one hike and only six a cut; 2026 forecasts span 3.50–4.25%. The base case for the 30 July meeting is a hold with a hawkish tilt.",
      "The renewed Iran/oil shock of 8 July 2026 pushed the <strong>10-year gilt yield above 4.9%</strong> (highest since 10 June) as traders raised BoE hike-by-year-end odds to <strong>~76%</strong> (>50% for November); Governor Bailey reaffirmed inflation should reach 2% eventually but 'later than previously expected', ruling out imminent cuts. The BoE's July Financial Stability Report also flagged record hedge-fund leverage and noted the gilt move was amplified by hedge-fund deleveraging.",
      "Sterling and gilts held firm on 16 July on growing expectations Andy Burnham will confirm Shabana Mahmood — seen as a fiscally cautious 'blank slate' — as chancellor when he takes office on Monday: GBP/EUR traded near a one-year high above 1.17 and the 10-year gilt yield stayed elevated near 4.9-5.0%, with Scotiabank noting BoE tightening bets have firmed to a cumulative ~46bp of hikes priced by December — a modestly firmer hawkish-hold read than a week ago, even as the OECD continues to urge fiscal discipline from the incoming government.",
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
    ["CNBC — Wholesale inflation June 2026, 15 Jul 2026", "https://www.cnbc.com/2026/07/15/wholesale-inflation-june-2026-.html"],
    ["Benzinga — Stock Market: Will S&P 500 Open Up or Down Today?, 15 Jul 2026", "https://www.benzinga.com/markets/prediction-markets/26/07/60461322/sp500-july-15-open-up-or-down-polymarket-cpi-fed-rate-hike-inflation"],
    ["CNBC — Fed Chairman Kevin Warsh's testimony to Senate Banking Committee hits on economy, interest rates, 15 Jul 2026", "https://www.cnbc.com/2026/07/15/watch-fed-chairman-kevin-warsh-testify-live-before-senate-banking-committee.html"],
    ["CNN Business — Elizabeth Warren blasts Kevin Warsh, saying he 'seems to invite corruption', 15 Jul 2026", "https://www.cnn.com/2026/07/15/economy/fed-chairman-kevin-warsh-senate-testimony"],
    ["Benzinga — Kevin Warsh's Congressional Debut Like a 'Breath of Fresh Air,' Says El-Erian, 15 Jul 2026", "https://www.benzinga.com/markets/economic-data/26/07/60460861/fed-chair-kevin-warshs-congressional-debut-draws-mixed-reactions"],
    ["IMF — World Economic Outlook Update, Jul 2026", "https://www.imf.org/en/publications/weo/issues/2026/07/08/world-economic-outlook-update-july-2026"],
    ["Bloomberg — Mahmood's Economic Blank Slate Boosts Appeal for UK Chancellor Role, 16 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-16/mahmood-s-economic-blank-slate-key-to-appeal-as-uk-chancellor"],
    ["Bloomberg — Fed's Schmid Says Inflation Too Hot, Above Target Too Long, 16 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-16/fed-s-schmid-says-inflation-is-too-hot-above-target-too-long"],
    ["University of Michigan — Surveys of Consumers, preliminary July 2026", "https://www.sca.isr.umich.edu/"],
    ["US Census Bureau — New Residential Construction, June 2026", "https://www.census.gov/construction/nrc/current/index.html"],
  ],
};

// ---- Recent market commentary from economists (Commentary tab) -------------
// Analysis / opinion / research pieces on Fed & BoE policy from named economists
// and reputable houses, newest first. Rendered as a two-column feed styled like
// the dashboard's Key macro headlines; the four-times-daily routine keeps it current.
export const COMMENTARY = {
  updated: "2026-07-16",
  us: [
    { title: "Kevin Warsh's Congressional Debut Like a 'Breath of Fresh Air,' Says El Erian, as Schiff Flags Fed Chair's 'False Claim'", source: "Benzinga", author: "Mohamed El-Erian", date: "2026-07-15", url: "https://www.benzinga.com/markets/economic-data/26/07/60460861/fed-chair-kevin-warshs-congressional-debut-draws-mixed-reactions" },
    { title: "Consumer price index inflation report June 2026", source: "CNBC", author: "J.P. Morgan — Michael Feroli", date: "2026-07-14", url: "https://www.cnbc.com/2026/07/14/consumer-price-index-inflation-report-june-2026.html" },
    { title: "AI boom replaces oil as key inflation risk, says Barclays", source: "Yahoo Finance UK", author: "Barclays Research", date: "2026-07-13", url: "https://uk.finance.yahoo.com/news/ai-boom-replaces-oil-key-120900584.html" },
  ],
  uk: [
    { title: "Latest UK Interest Rate Forecasts: Will The Bank Of England Cut Interest Rates On 30 July 2026?", source: "HomeOwners Alliance", author: "Pantheon Macroeconomics — Rob Wood", date: "2026-07-13", url: "https://hoa.org.uk/news/interest-rate-predictions-2/" },
    { title: "Hedge Fund Gilt Risks Are Best Managed in Markets", source: "Bloomberg Opinion", author: "Aaron Brown", date: "2026-07-09", url: "https://www.bloomberg.com/opinion/articles/2026-07-09/hedge-fund-gilt-risks-are-best-managed-in-markets" },
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
      "The OECD's July 2026 Economic Survey of the UK, published 15 July, projected GDP growth slowing to <strong>0.9% in 2026</strong> (from 1.4% in 2025) and urged the incoming Burnham government to maintain budget discipline and reform the state-pension triple lock to contain fiscal risk — reinforcing the 'elevated but less acute than the US' read.",
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
    ["OECD — Economic Survey of the United Kingdom, 15 Jul 2026", "https://www.oecd.org/en/about/news/media-advisories/2026/07/oecd-to-launch-the-economic-survey-of-the-united-kingdom-on-15-july.html"],
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
    "The rhetoric widened further on 15 July when Iran's Revolutionary Guard threatened to halt <strong>all</strong> Mideast energy exports — not just Hormuz transit — in retaliation for the reimposed US blockade, saying exports would be 'for everyone or for no one'; Brent held around $85–87/bbl, broadly in line with 14 July levels rather than spiking further, with equities so far showing the same complacency toward the escalating supply-side threat.",
    "Sentiment data now corroborates the narrow-leadership read directly: BofA's July Fund Manager Survey, published 14 July, found 45% of managers naming an AI bubble as the single biggest tail risk to markets, up sharply from 28% in June — even as the S&P 500 and Nasdaq continue to hold near record highs on the back of the same handful of AI mega-caps.",
    "Markets closed little moved by the latest escalation on 15 July: the Dow added a marginal 0.02% to 52,508.66, the S&P 500 gained 0.4% to 7,543.89 and the Nasdaq rose 0.9% to 26,107.01, even as Trump warned of a 'really bad' next week of strikes on Iranian power plants and bridges unless Tehran returns to the table — a further test of how much geopolitical risk the AI-led rally is pricing in. Separately, Barclays argued on 13 July that AI investment, not oil, is now the more durable US inflation risk, lifting its end-2026 core PCE forecast to 3.3% (from 2.8% at the start of the year) on rising memory-chip and data-centre costs — a reminder that the same AI capex driving the market's narrow leadership is also complicating the Fed's disinflation path.",
    "The concentration risk resurfaced again on 15 July: South Korea's Kospi tumbled as much as ~7% in a fresh chip-sector rout — coming just two days after SK Hynix's circuit-breaker-triggering slide — even as US index futures held broadly steady ahead of the 16 July retail-sales and jobless-claims prints, underscoring how narrowly the AI-led rally's resilience is concentrated in a handful of US mega-caps rather than the wider chip supply chain. Separately, the IMF's July 2026 World Economic Outlook Update held global growth at 3.0% for the year but lifted its global headline-inflation forecast to ~4.7%, built on an $89/bbl oil assumption tied to the Middle East conflict — a reminder that the same Hormuz shock feeding the Fed/BoE inflation risk is also a live tail risk for the equity rally's valuation support.",
    "The narrow-leadership theme continued on 16 July: US chip stocks (Intel, AMD, Applied Materials) slid on renewed AI-valuation jitters, dragging the Nasdaq lower even as the Dow held near record highs, while China's Q2 GDP growth slowed to 4.3% y/y — its weakest since late 2022 — partly on Iran-conflict-driven resource-price spikes. Brent crude extended its climb to a fourth straight day (~$85.77/bbl) on fresh US strikes on Iranian coastal defences and missile sites, yet US equities showed only a muted reaction, consistent with the market continuing to price in relatively little of the geopolitical and global-growth risk building around its AI-led leadership.",
    "The valuation-not-demand read hardened further on 16 July when TSMC posted a record 77% profit jump — Q2 revenue of $39.62bn, up 36% year-on-year, with AI chips 61% of sales — and lifted its full-year outlook, yet the beat still failed to lift chip stocks: Micron, SK Hynix, AMD, Broadcom, Nvidia and TSMC itself all slid as investors booked profits after their outsized run, dragging the Nasdaq to a 1.3% close-of-day loss even as the Dow fell just 0.3% and the S&P 500 lost 0.5% — a clearer signal than most that stretched valuations, not AI demand itself, are now the market's chief worry.",
    "The Hormuz standoff widened again on 16 July as US CENTCOM said it struck and disabled an unladen tanker (the Curaçao-flagged Belma) attempting to breach the blockade near Kharg Island, while Iran hit back at US bases in Kuwait and Jordan on a sixth straight day of fighting; Brent settled up 0.4% at $85.28/bbl (WTI $80.02) after paring a larger intraday gain. A supply shock that keeps extending without denting the AI-led equity rally remains itself a bubble-consistent complacency signal.",
    "The chip-sector profit-taking that followed TSMC's 16 July beat extended into 17 July: TSM shares slipped a further 2.3% despite the record quarter, as investors continued to weigh elevated AI capex guidance against near-term margin pressure — a further sign that stretched valuations, not underlying AI demand, remain the market's chief worry.",
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
    ["NBC News — Iran threatens to halt all Mideast energy exports after US reimposes blockade, 15 Jul 2026", "https://www.nbcnews.com/world/iran/iran-threatens-halt-mideast-energy-exports-us-reimposes-blockade-rcna587593"],
    ["Seeking Alpha — AI bubble fears climb to top market risk in BofA fund manager survey, 14 Jul 2026", "https://seekingalpha.com/news/4613569-ai-bubble-fears-climb-to-top-market-risk-in-bofa-fund-manager-survey"],
    ["CNBC — Trump warns U.S. strikes on Iran could get 'really bad' next week, 15 Jul 2026", "https://www.cnbc.com/2026/07/15/trump-iran-hormuz-strikes-power-plants-targeted.html"],
    ["Yahoo Finance UK (Barclays) — AI boom replaces oil as key inflation risk, 13 Jul 2026", "https://uk.finance.yahoo.com/news/ai-boom-replaces-oil-key-120900584.html"],
    ["CNBC — Stock futures little changed ahead of retail sales, jobs data; Kospi tumbles 7% in chip rout, 15 Jul 2026", "https://www.cnbc.com/2026/07/15/stock-market-today-live-updates.html"],
    ["IMF — World Economic Outlook Update, Jul 2026", "https://www.imf.org/en/publications/weo/issues/2026/07/08/world-economic-outlook-update-july-2026"],
    ["Yahoo Finance — Stock market today: Dow rises, chip stocks slide amid AI jitters, 16 Jul 2026", "https://finance.yahoo.com/markets/live/stock-market-today-thursday-july-16-dow-sp-500-nasdaq-103116735.html"],
    ["Nikkei Asia — China's GDP growth rate slows sharply to 4.3% in Q2, 15 Jul 2026", "https://asia.nikkei.com/economy/china-s-gdp-growth-rate-slows-sharply-to-4.3-in-second-quarter"],
    ["CNBC — Oil prices rise for 4th day as U.S. strikes on Iran raise fears of wider conflict, 16 Jul 2026", "https://www.cnbc.com/2026/07/16/oil-rise-as-us-strikes-on-iran-raise-fears-of-wider-conflict.html"],
    ["Bloomberg — US Stock Futures Tumble as TSMC's Results Revive AI Concerns, 16 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-16/us-stock-futures-tumble-as-tsmc-s-results-revive-ai-concerns"],
    ["TheStreet — Stock Market Today (July 16, 2026): Nasdaq slips as tech stocks lose momentum", "https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-16-2026"],
    ["Bloomberg — Iran-US Strikes Worsen as Strait of Hormuz Shipping Traffic Dwindles, 16 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-16/iran-us-skirmishes-worsen-as-hormuz-shipping-traffic-dwindles"],
  ],
};

// ---- Guidance alerts surfaced in the notifications bell --------------------
// Changes to the policy-rate outlook and cycle read. Ids are stable; bump the
// id (e.g. a date suffix) when the underlying guidance changes so it re-flags.
export const ALERTS = [
  { id: "g-schmid-hawkish-2026-07-16", kind: "Rate guidance", title: "Kansas City Fed President Jeff Schmid called inflation his 'primary concern' on 16 July, saying it is 'too hot' and has been 'above target too long', and cautioned against reading June's cooler CPI/PPI prints as a trend ahead of the 29 July decision.", href: "#/policy", date: "2026-07-16" },
  { id: "g-tsmc-ai-selloff-2026-07-16", kind: "Bubble risk", title: "TSMC posted a record 77% profit jump and raised its full-year outlook, yet chip stocks (Micron, SK Hynix, AMD, Broadcom, Nvidia, TSMC) slid anyway on valuation concerns, dragging the Nasdaq to a 1.3% loss even as the Dow fell just 0.3% — further evidence the AI rally's chief risk is now valuation, not demand.", href: "#/bubble", date: "2026-07-16" },
  { id: "g-uk-gilt-sterling-2026-07-16", kind: "Rate guidance", title: "GBP/EUR held near a one-year high above 1.17 and the 10-year gilt yield stayed elevated near 4.9-5.0% as Mahmood-chancellor hopes and firming BoE tightening bets (Scotiabank: ~46bp priced by December) underpinned sterling and gilts.", href: "#/policy", date: "2026-07-16" },
  { id: "g-uk-gdp-beat-2026-07-16", kind: "Markets", title: "UK GDP grew 0.7% in the three months to May (vs 0.5% forecast), with annual growth accelerating to 1.3% — the fastest pace in 13 months — yet the FTSE 100 still fell 0.36% as Iran-driven oil and mining weakness offset the upside surprise.", href: "#/cycle", date: "2026-07-16" },
  { id: "g-china-gdp-chip-2026-07-16", kind: "Bubble risk", title: "China's Q2 GDP growth slowed to 4.3% y/y — its weakest since late 2022 — as US chip stocks (Intel, AMD, Applied Materials) slid on renewed AI-valuation jitters, another crack in the narrow, AI-led US equity rally even as the Dow held near record highs.", href: "#/bubble", date: "2026-07-16" },
  { id: "g-oil-4th-day-2026-07-16", kind: "Markets", title: "Brent crude rose for a fourth straight day to ~$85.77/bbl after fresh US strikes on Iranian coastal defences and missile sites; vessel crossings through the Strait of Hormuz fell further to 7 on Wednesday, down from 13 the previous day.", href: "#/bubble", date: "2026-07-16" },
  { id: "g-kospi-chip-rout-2026-07-15", kind: "Bubble risk", title: "South Korea's Kospi tumbled as much as ~7% in a fresh chip-sector rout on 15 July, extending the prior week's SK Hynix/Samsung slide, even as US futures held broadly steady ahead of retail-sales and jobs data — a further crack in the narrow, AI-led rally.", href: "#/bubble", date: "2026-07-15" },
  { id: "g-fedwatch-10pct-2026-07-15", kind: "Rate guidance", title: "CME FedWatch odds of a 29 July Fed hike fell further intraday to roughly 10-13% (from ~17% after June PPI), even as Chair Warsh's second day of Senate testimony reiterated the Fed has 'no tolerance' for elevated inflation and warned against reading the cooler CPI/PPI prints as 'mission accomplished'.", href: "#/policy", date: "2026-07-15" },
  { id: "g-iran-power-plants-2026-07-15", kind: "Markets", title: "Trump warned US strikes on Iran will intensify to power plants and bridges 'next week' unless Tehran returns to the negotiating table — a fresh escalation threat beyond the current blockade dispute; oil held little changed (Brent Sept future $84.95) on the news.", href: "#/bubble", date: "2026-07-15" },
  { id: "g-mahmood-chancellor-2026-07-15", kind: "Markets", title: "Andy Burnham is reportedly set to name Shabana Mahmood — seen as fiscally cautious — rather than Ed Miliband as UK Chancellor (FT, via Bloomberg), a gilt- and sterling-supportive signal that softens the near-term UK fiscal-risk overhang.", href: "#/cycle", date: "2026-07-15" },
  { id: "g-fedwatch-below-17pct-2026-07-15", kind: "Rate guidance", title: "Post-CPI repricing has pushed CME FedWatch odds of a 29 July Fed hike to roughly 17% (from ~42-46.5%), while US June PPI (released 15 July) fell 0.3% m/m, its first monthly decline since June 2025 — further evidence the hike scare has cooled, even as traders still price ~59% odds of a September hike and Warsh's second day of testimony (Senate Banking Committee) continues.", href: "#/policy", date: "2026-07-15" },
  { id: "g-fms-ai-bubble-2026-07-15", kind: "Bubble risk", title: "BofA's July Fund Manager Survey shows 45% of managers now naming an AI bubble as the top tail risk, up from 28% in June, reinforcing the narrow, AI-led bubble read even as headline indices hold near record highs.", href: "#/bubble", date: "2026-07-15" },
  { id: "g-iran-halt-exports-2026-07-15", kind: "Markets", title: "Iran's Revolutionary Guard threatened to halt all Mideast energy exports — not just Hormuz transit — in retaliation for the reimposed US blockade, a rhetorical escalation beyond the shipping-disruption threat already flagged; Brent trades $85-87/bbl, in line with levels reached 14 July.", href: "#/bubble", date: "2026-07-15" },
  { id: "g-cpi-cool-2026-07-14", kind: "Rate guidance", title: "June US CPI cooled sharply to 3.5% y/y (core 2.6%) — the largest monthly drop since 2020 — cutting CME FedWatch odds of a 29 July Fed hike from ~46.5% to roughly 15-20% and pulling the 2-year Treasury yield down as much as 14bp.", href: "#/policy", date: "2026-07-14" },
  { id: "g-hormuz-toll-dropped-2026-07-14", kind: "Markets", title: "Trump abandoned his proposed 20% Strait of Hormuz cargo toll hours after floating it, easing some of the oil-driven inflation risk even as the wider US-Iran conflict continues into a further day of strikes.", href: "#/bubble", date: "2026-07-14" },
  { id: "g-warsh-testimony-2026-07-14", kind: "Rate guidance", title: "Fed Chair Warsh's debut House testimony added no fresh signal on the 29 July decision — he called the Fed's prior average-inflation-targeting framework a 'mistake' and pledged the Fed has 'no tolerance' for elevated inflation.", href: "#/policy", date: "2026-07-14" },
  { id: "g-brent-87-2026-07-14", kind: "Markets", title: "Brent crude rose a further ~4.7% to $87.20/bbl (WTI $80.83) in early US trading on 14 July, per Investing.com/Reuters — a fresh high for this cycle — as three straight nights of US strikes on Iran and the proposed Hormuz toll kept a lid on relief ahead of the June CPI print.", href: "#/bubble", date: "2026-07-14" },
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
    us: "Fed on hold at 3.50–3.75%; June CPI and PPI both cooled, pulling 29 July hike odds from ~46.5% to ~17% (CME FedWatch), though September-hike odds stay elevated and the Iran oil shock keeps the meeting a genuine two-way risk.",
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
  updated: "2026-07-17",
  us: [
    { title: "New Residential Construction, June 2026", source: "US Census Bureau", date: "2026-07-17", time: "05:20", url: "https://www.census.gov/construction/nrc/current/index.html" },
    { title: "Surveys of Consumers, Preliminary July 2026", source: "University of Michigan", date: "2026-07-17", time: "05:20", url: "https://www.sca.isr.umich.edu/" },
    { title: "Fed's Schmid Says Inflation Too Hot, Above Target Too Long", source: "Bloomberg", date: "2026-07-16", time: "05:20", url: "https://www.bloomberg.com/news/articles/2026-07-16/fed-s-schmid-says-inflation-is-too-hot-above-target-too-long" },
    { title: "Latest Oil Market News and Analysis for July 17", source: "Bloomberg", date: "2026-07-16", time: "05:20", url: "https://www.bloomberg.com/news/articles/2026-07-16/latest-oil-market-news-and-analysis-for-july-17" },
  ],
  uk: [
    { title: "FTSE 100 Live: UK Stocks and Bonds Fall Despite Better GDP", source: "Bloomberg", date: "2026-07-16", time: "05:20", url: "https://www.bloomberg.com/news/live-blog/2026-07-16/ftse-100-live-uk-gdp-iip-pound-gilts-mahmood-burnham-hormuz-oil-prices-iran-war-what-s-moving-uk-markets-right-now-markets-today" },
    { title: "Shabana Mahmood: Andy Burnham Has Seen the Light on Chancellor Job", source: "Bloomberg Opinion", date: "2026-07-16", time: "05:20", url: "https://www.bloomberg.com/opinion/articles/2026-07-16/shabana-mahmood-andy-burnham-has-seen-the-light-on-chancellor-job" },
    { title: "Renewed Hormuz hostilities drive ECB rates rethink amid 'extremely volatile' outlook", source: "CNBC", date: "2026-07-15", time: "05:20", url: "https://www.cnbc.com/amp/2026/07/15/ecb-interest-rates-outlook-iran-war-hormuz.html" },
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
  updated: "2026-07-17",
  items: [
    {"title":"New Residential Construction, June 2026","source":"US Census Bureau","date":"2026-07-17","time":"05:20","url":"https://www.census.gov/construction/nrc/current/index.html","blurb":"Building permits fell 0.9% month-on-month to a 1.410m SAAR pace — a soft housing signal alongside the late-cycle/stagflation reads already tracked in the Cycle tab."},
    {"title":"Surveys of Consumers, Preliminary July 2026","source":"University of Michigan","date":"2026-07-17","time":"05:20","url":"https://www.sca.isr.umich.edu/","blurb":"Sentiment rose roughly 10% from May as gasoline prices moderated, but stayed 13% below the pre-Iran-conflict February level; year-ahead inflation expectations eased to 4.6% from 4.8%."},
    {"title":"US Stock Futures Tumble as TSMC's Results Revive AI Concerns","source":"Bloomberg","date":"2026-07-16","time":"21:10","url":"https://www.bloomberg.com/news/articles/2026-07-16/us-stock-futures-tumble-as-tsmc-s-results-revive-ai-concerns","blurb":"TSMC posted a record 77% profit jump and raised its full-year outlook, yet chip stocks (Micron, SK Hynix, AMD, Broadcom, Nvidia, TSMC) slid anyway as investors booked profits after their outsized run."},
    {"title":"Stock Market Today (July 16, 2026): Nasdaq slips as tech stocks lose momentum","source":"TheStreet","date":"2026-07-16","time":"21:10","url":"https://www.thestreet.com/stock-market-today/stock-market-today-dow-jones-sp-500-nasdaq-updates-july-16-2026","blurb":"The Dow fell 0.3%, the S&P 500 lost 0.5% and the Nasdaq dropped 1.3% as a fresh semiconductor selloff overshadowed a UnitedHealth earnings beat."},
    {"title":"Iran-US Strikes Worsen as Strait of Hormuz Shipping Traffic Dwindles","source":"Bloomberg","date":"2026-07-16","time":"21:10","url":"https://www.bloomberg.com/news/articles/2026-07-16/iran-us-skirmishes-worsen-as-hormuz-shipping-traffic-dwindles","blurb":"US CENTCOM says it struck and disabled the Curaçao-flagged tanker Belma near Kharg Island for defying the blockade; Iran hit back at US bases in Gulf states and Jordan on the sixth straight day of fighting."},
    {"title":"Mahmood's Economic Blank Slate Boosts Appeal for UK Chancellor Role","source":"Bloomberg","date":"2026-07-16","time":"21:10","url":"https://www.bloomberg.com/news/articles/2026-07-16/mahmood-s-economic-blank-slate-key-to-appeal-as-uk-chancellor","blurb":"Home Secretary Shabana Mahmood's lack of a public economic-policy record is seen as part of her appeal as Andy Burnham's likely chancellor pick, though his team says no final decision has been communicated."},
    {"title":"UK Stock Market Today (July 16): FTSE 100 Falls 0.37% While FTSE 250 Gains Despite Oil Price Surge and Global Risk","source":"Sunday Guardian Live","date":"2026-07-16","time":"21:10","url":"https://sundayguardianlive.com/business/uk-stock-market-today-july-16-ftse-100-falls-037-while-ftse-250-gains-despite-oil-price-surge-and-global-risk-what-should-investors-know-238177/","blurb":"The FTSE 100 slipped to around 10,470 as Middle East risk-off sentiment outweighed the stronger May GDP print, while the mid-cap FTSE 250 eked out a gain."},
    {"title":"Stock market today: Dow rises, S&P 500 and Nasdaq fall as chip stocks slide amid AI jitters","source":"Yahoo Finance","date":"2026-07-16","time":"17:20","url":"https://finance.yahoo.com/markets/live/stock-market-today-thursday-july-16-dow-sp-500-nasdaq-103116735.html","blurb":"Chip stocks lead the Nasdaq lower on renewed AI-valuation jitters even as the Dow ekes out a gain."},
    {"title":"Oil prices rise for 4th day as U.S. strikes on Iran raise fears of wider conflict","source":"CNBC","date":"2026-07-16","time":"17:20","url":"https://www.cnbc.com/2026/07/16/oil-rise-as-us-strikes-on-iran-raise-fears-of-wider-conflict.html","blurb":"Brent extends its climb to ~$85.77/bbl after fresh US strikes on Iranian coastal defences and missile sites, with vessel crossings through Hormuz falling further."},
    {"title":"US Retail Sales Rise Modestly as Consumers Spend Less on Gas","source":"Bloomberg","date":"2026-07-16","time":"17:20","url":"https://www.bloomberg.com/news/articles/2026-07-16/us-retail-sales-rise-modestly-as-consumers-spend-less-on-gas","blurb":"June retail sales rose 0.2% as falling gasoline-station receipts offset a broader 0.7% advance excluding gas; May's gain was revised up to 1.0%."},
    {"title":"US Weekly Jobless Claims Fall; Labor Market Remains Stable","source":"U.S. News","date":"2026-07-16","time":"17:20","url":"https://money.usnews.com/investing/news/articles/2026-07-16/us-weekly-jobless-claims-fall-labor-market-remains-stable","blurb":"Initial claims fell 8,000 to 208,000 for the week ended 11 July, below the 217,000 consensus, pointing to continued labour-market stability."},
    {"title":"Treasury yields rise as Wall Street awaits key employment data","source":"CNBC","date":"2026-07-16","time":"17:20","url":"https://www.cnbc.com/2026/07/16/us-treasury-yields-wall-street-inflation-employment-data.html","blurb":"Yields tick higher as traders position ahead of jobs and inflation data that could sway the Fed's 29 July decision."},
    {"title":"FTSE 100 today: Stocks slip as Iran tensions offset stronger UK GDP","source":"Yahoo Finance","date":"2026-07-16","time":"17:20","url":"https://finance.yahoo.com/markets/stocks/articles/ftse-100-today-stocks-slip-075535814.html","blurb":"The FTSE 100 fell 0.36% to 10,460.35 as mining and energy weakness outweighed May GDP growth of 0.7% quarter-on-quarter, the fastest annual pace in 13 months."},
    {"title":"UK economy grew by 0.1% in May","source":"Reuters (via Investing.com)","date":"2026-07-16","time":"17:20","url":"https://www.investing.com/news/economic-indicators/uk-economy-grew-by-01-in-may-4794681","blurb":"UK GDP rose 0.1% month-on-month in May, beating expectations of no growth, as services offset weak construction and industrial output."},
    {"title":"GDP monthly estimate, UK: May 2026","source":"Office for National Statistics","date":"2026-07-16","time":"17:20","url":"https://www.ons.gov.uk/economy/grossdomesticproductgdp/bulletins/gdpmonthlyestimateuk/may2026","blurb":"ONS's official May GDP release, the primary source behind today's better-than-expected UK growth headlines."},
    {"title":"FTSE 100 Live: UK Stocks and Bonds Fall Despite Better GDP","source":"Bloomberg","date":"2026-07-16","time":"17:20","url":"https://www.bloomberg.com/news/live-blog/2026-07-16/ftse-100-live-uk-gdp-iip-pound-gilts-mahmood-burnham-hormuz-oil-prices-iran-war-what-s-moving-uk-markets-right-now-markets-today","blurb":"Gilts and equities slip even after May GDP beat forecasts, as the renewed Hormuz oil shock and Burnham's cabinet picks dominate trading."},
    {"title":"In first Congressional testimony, new Fed Chief Warsh vows to fight inflation","source":"NPR","date":"2026-07-15","time":"17:20","url":"https://www.npr.org/2026/07/15/nx-s1-5894712/in-first-congressional-testimony-new-fed-chief-warsh-vows-to-fight-inflation","blurb":"Warsh pledges to end 'five years of excessive inflation' in his House testimony, while stopping short of signalling the 29 July decision."},
    {"title":"China's GDP growth rate slows sharply to 4.3% in second quarter","source":"Nikkei Asia","date":"2026-07-15","time":"17:20","url":"https://asia.nikkei.com/economy/china-s-gdp-growth-rate-slows-sharply-to-4.3-in-second-quarter","blurb":"China's weakest growth since late 2022 is partly attributed to Iran-conflict-driven resource and material price spikes, adding a fresh drag on global growth."},
    {"title":"FTSE 100 Live: UK Economy Grew Unexpectedly in May","source":"Bloomberg","date":"2026-07-16","time":"12:17","url":"https://www.bloomberg.com/news/live-blog/2026-07-16/ftse-100-live-uk-gdp-iip-pound-gilts-mahmood-burnham-hormuz-oil-prices-iran-war-what-s-moving-uk-markets-right-now-markets-today","blurb":"UK GDP grew 0.1% m/m in May, beating expectations of no growth, as services offset weak construction and industrial output."},
    {"title":"Bank of Korea raises rates to 2.75% in first hike in over three years","source":"CNBC","date":"2026-07-16","time":"12:17","url":"https://www.cnbc.com/2026/07/16/bok-interest-rate-monetary-policy-markets-kospi-skhynix.html","blurb":"The BoK hikes 25bp to 2.75%, its first increase since January 2023, as inflation runs above target amid a weaker won and elevated oil prices."},
    {"title":"Bank of Korea raises rates by 25 basis points to 2.75%","source":"Investing.com","date":"2026-07-16","time":"12:17","url":"https://www.investing.com/news/economy-news/bank-of-korea-raises-rates-by-25-basis-points-to-275-93CH-4794841","blurb":"Confirms the BoK's quarter-point hike to 2.75%, its first move since early 2023, as policymakers respond to above-target inflation."},
    {"title":"Stock futures little changed ahead of retail sales, jobs data; South Korea's Kospi tumbles 7% in chip rout: Live updates","source":"CNBC","date":"2026-07-15","time":"05:21","url":"https://www.cnbc.com/2026/07/15/stock-market-today-live-updates.html","blurb":"South Korea's Kospi drops ~7% in a fresh chip-sector rout as US futures hold steady ahead of retail-sales and jobs data."},
    {"title":"Burnham Upsets Labour Left Who Wanted Him to Become UK Premier","source":"Bloomberg","date":"2026-07-15","time":"05:21","url":"https://www.bloomberg.com/news/articles/2026-07-15/burnham-upsets-labour-left-who-wanted-him-to-become-uk-premier","blurb":"Labour's left flank bristles at Burnham's centrist positioning and cabinet picks as he prepares to take office."},
    {"title":"Burnham Faces Day One Warning of Souring UK Economy and Oil Risk","source":"Bloomberg","date":"2026-07-14","time":"05:21","url":"https://www.bloomberg.com/news/articles/2026-07-14/burnham-faces-day-one-warning-of-souring-uk-economy-and-oil-risk","blurb":"Economists warn the incoming PM inherits a weakening growth backdrop compounded by the renewed Hormuz oil shock."},
    {"title":"Rate-hike wagers rebuild across the Fed, BOE, and ECB","source":"Enterprise AM","date":"2026-07-15","time":"05:21","url":"https://enterpriseam.com/uae/2026/07/15/rate-hike-wagers-rebuild-across-the-fed-boe-and-ecb/","blurb":"A cross-central-bank roundup of how the Hormuz oil shock is reviving tightening bets from Washington to London to Frankfurt."},
    {"title":"Oil prices hit 1-month high as US-Iran attacks dim Strait of Hormuz outlook","source":"Al Jazeera","date":"2026-07-14","time":"05:21","url":"https://www.aljazeera.com/economy/2026/7/14/oil-hits-1-month-high-as-us-iran-fighting-clouds-strait-of-hormuz-outlook","blurb":"Brent extends its climb as renewed US-Iran attacks curb transits through a corridor carrying a fifth of global oil trade."},
    {"title":"World Economic Outlook Update, July 2026: Global Economy in Crosscurrents of War and Technology","source":"IMF","date":"2026-07-08","time":"05:21","url":"https://www.imf.org/en/publications/weo/issues/2026/07/08/world-economic-outlook-update-july-2026","blurb":"The IMF holds 2026 global growth at 3.0% but lifts its global headline-inflation forecast to ~4.7% on an $89/bbl oil assumption tied to the Middle East war."},
    {"title":"Fed Chairman Kevin Warsh's testimony to Senate banking committee hits on economy, interest rates","source":"CNBC","date":"2026-07-15","time":"21:07","url":"https://www.cnbc.com/2026/07/15/watch-fed-chairman-kevin-warsh-testify-live-before-senate-banking-committee.html","blurb":"Warsh's second day of testimony repeats his non-committal message, warning against reading June's cooler CPI/PPI as 'mission accomplished'."},
    {"title":"Elizabeth Warren blasts Kevin Warsh, saying he 'seems to invite corruption'","source":"CNN Business","date":"2026-07-15","time":"21:07","url":"https://www.cnn.com/2026/07/15/economy/fed-chairman-kevin-warsh-senate-testimony","blurb":"Warren presses Warsh on Fed ethics and his contacts with Trump-administration officials during his Senate Banking Committee appearance."},
    {"title":"Kevin Warsh's Congressional Debut Like a 'Breath of Fresh Air,' Says El Erian, as Schiff Flags Fed Chair's 'False Claim'","source":"Benzinga","date":"2026-07-15","time":"21:07","url":"https://www.benzinga.com/markets/economic-data/26/07/60460861/fed-chair-kevin-warshs-congressional-debut-draws-mixed-reactions","blurb":"Economists split on Warsh's debut testimony, with El-Erian praising his communication style and Schiff criticising the Fed's inflation framework."},
    {"title":"Trump warns U.S. strikes on Iran could get 'really bad' next week","source":"CNBC","date":"2026-07-15","time":"21:07","url":"https://www.cnbc.com/2026/07/15/trump-iran-hormuz-strikes-power-plants-targeted.html","blurb":"Trump threatens to expand strikes to Iranian power plants and bridges unless Tehran returns to the negotiating table."},
    {"title":"The U.S.-Iran standoff over the Strait of Hormuz intensifies","source":"NPR","date":"2026-07-15","time":"21:07","url":"https://www.npr.org/2026/07/15/nx-s1-5894582/us-iran-updates","blurb":"A fresh round of US strikes and a reinstated naval blockade keep the Hormuz standoff live even as oil prices hold roughly steady."},
    {"title":"Stock market today: Dow, S&P 500, Nasdaq rise as Big Tech stocks rally","source":"Yahoo Finance","date":"2026-07-15","time":"21:07","url":"https://finance.yahoo.com/markets/live/stock-market-today-wednesday-july-15-dow-sp-nasdaq-091813320.html","blurb":"US equities close higher — Dow +0.02% to 52,508.66, S&P 500 +0.4% to 7,543.89, Nasdaq +0.9% to 26,107.01 — as cooling inflation offsets Iran-driven oil jitters."},
    {"title":"Pound hits one-year high vs. euro on report Mahmood may get finance job","source":"Yahoo Finance UK","date":"2026-07-15","time":"21:07","url":"https://uk.finance.yahoo.com/news/pound-hits-one-high-vs-144336519.html","blurb":"Sterling rallies as markets welcome reports that the fiscally cautious Mahmood, not Miliband, will become Burnham's chancellor."},
    {"title":"OECD sounds alarm on pension triple lock in challenge to Burnham","source":"CityAM","date":"2026-07-15","time":"21:07","url":"https://www.cityam.com/oecd-andy-burnham-must-reform-state-pension-triple-lock/","blurb":"The OECD's new UK Economic Survey urges reform of the state-pension triple lock to reduce fiscal risk as Burnham prepares to take office."},
  ],
};

// ---- Upcoming economic releases (Dashboard banner) -------------------------
// Scheduled US & UK data releases and central-bank announcements. The dashboard
// banner shows only those falling in the current and following calendar week, so
// the four-times-daily routine keeps this rolling forward (dropping past items and
// adding newly-confirmed dates). Dates verified from official release calendars.
export const RELEASES = [
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
  { date: "2026-08-14", country: "US", title: "Retail sales (July)", url: "https://www.census.gov/retail/release_schedule.html" },
  { date: "2026-08-01", country: "UK", title: "S&P Global/CIPS Manufacturing PMI, final (July)", url: "https://www.pmi.spglobal.com/Public/Home/PressReleases" },
  { date: "2026-08-03", country: "UK", title: "S&P Global/CIPS Services & Composite PMI, final (July)", url: "https://www.pmi.spglobal.com/Public/Home/PressReleases" },
  { date: "2026-08-13", country: "UK", title: "GDP monthly estimate (June)", url: "https://www.ons.gov.uk/economy/grossdomesticproductgdp/bulletins/gdpmonthlyestimateuk/latest" },
  { date: "2026-08-19", country: "US", title: "FOMC minutes (28–29 July meeting)", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" },
  { date: "2026-08-19", country: "UK", title: "CPI inflation (July)", url: "https://www.ons.gov.uk/releases/consumerpriceinflationukjuly2026" },
];
