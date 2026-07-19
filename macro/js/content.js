// =============================================================================
// Wire Macro — editorial content for the Commentary and Cycle tabs, plus the
// short conclusions surfaced on the Dashboard. Compiled from public commentary
// and official data on the dates cited; educational only, not investment advice.
// Each claim carries a source link — verify against it before relying on it.
// =============================================================================

export const UPDATED = "19 July 2026";

// ---- Refresh stamp (bumped every routine run, like Credit/Legal data.js) ----
// LAST_CHECKED is the "Last refresh" date shown in the top bar; LAST_CHECKED_TIME
// is a pre-formatted "HH:MM TZ" London string so it renders the same in any
// viewer timezone. The four-times-daily refresh routine advances both on every run.
export const META = {
  lastChecked: "2026-07-19",
  lastCheckedTime: "21:19 BST",
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
      "Governor Lisa Cook added to the hawkish chorus on 15 July, telling the Exchequer Club that core goods prices are running at a striking 5% annual pace and that she is <strong>'prepared to act soon'</strong> if disinflation signs don't appear, judging the current 3.50–3.75% rate only 'mildly restrictive'; she named AI-investment capex and tariff/Iran-war price pressures as the key inflation risks. Separately, CME FedWatch-implied odds of a hike at the following (September) meeting have risen further to roughly <strong>73%</strong> (from ~59% a few days earlier and just 26% in mid-June) even as the 29 July hike itself stays a low-probability outcome — underscoring that the market sees the July/September decisions as a connected, still-live hiking cycle rather than a one-off risk that has passed.",
      "The hawkish chorus swelled further on 17 July when Cleveland Fed President Beth Hammack said persistently high inflation — she estimated core PCE rose 3.3% in June — is now her bigger concern than the labour market, noting that for the first time in her tenure business leaders are telling her the Fed needs to act on inflation even as consumer spending holds up; the Washington Post reported the same day that a small but growing group of officials now argue a hike may be needed even as President Trump keeps pushing for cuts, though CME FedWatch's 29 July hike odds were little changed at roughly 10% (per 16 July data), with the debate increasingly centred on the 16–17 September meeting instead.",
      "The conflict crossed a new threshold over the weekend of 18 July: two US service members were killed in Jordan in Iranian-linked attacks — the first direct US combat deaths of the renewed war — as Brent extended its climb toward $88/bbl. Chair Warsh repeated his 'no tolerance for elevated inflation' line the same day (Bloomberg, 'Warsh Shows His Inner Hawk'), underscoring that the still-live oil shock keeps the hiking debate open into the 29 July decision even with markets closed over the weekend to react to the fatalities.",
      "The escalation deepened further on 19 July: a third US service member was killed, in Iraq, during the controlled detonation of a downed Iranian drone, as CENTCOM completed an eighth consecutive night of strikes on Iran — including one Tehran says hit the under-construction Darkhovin nuclear power plant — and Kuwait reported a second attack on its desalination and power plant in as many days. Iran's deputy foreign minister said the US had suspended the Islamabad ceasefire framework. CME FedWatch odds for the 29 July meeting were little changed from Saturday at roughly 87% hold / 13% hike as of 18-19 July, with equity markets shut over the weekend leaving the reaction untested ahead of Monday's open.",
    ],
    bottomLine: "The 29 July hike risk has eased further intraday to roughly 10-13% (CME FedWatch), down from ~17% after June PPI and a peak near 46.5% a week ago, as Warsh's second day of testimony again offered no fresh signal — but odds of a hike at the following September meeting have instead risen to roughly 73% (from ~59% a few days earlier), with Governor Cook now saying she is 'prepared to act soon' absent clear disinflation. The weekend's escalation — the first direct US combat deaths of the renewed conflict, in Jordan, and Brent pushing toward $88/bbl — keeps the Iran/oil shock a live, if now more lopsided and later-dated, two-way risk for the hiking cycle.",
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
      note: "Implied from 30-Day Fed Funds futures. Down from a ~46.5% hike peak on 13 Jul after June CPI and PPI cooled and Warsh's testimony offered no fresh signal; September-meeting hike odds have instead risen to roughly 73% (from ~59% a few days earlier and just 26% in mid-June) as the Iran-driven oil shock feeds through to broader inflation.",
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
    ["Federal Reserve — Governor Cook, \"Economic Outlook\", 15 Jul 2026", "https://www.federalreserve.gov/newsevents/speech/cook20260715a.htm"],
    ["Bloomberg — Fed's Cook Says She's Prepared to Act If Inflation Doesn't Cool, 15 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-15/fed-s-cook-says-she-s-prepared-to-act-if-inflation-doesn-t-cool"],
    ["Tech Times — Iran Oil Shock Spills Into Demand Inflation, Lifting Fed Rate-Hike Odds to 73% by September, 16 Jul 2026", "https://www.techtimes.com/articles/320773/20260716/iran-oil-shock-spills-demand-inflation-lifting-fed-rate-hike-odds-73-september.htm"],
    ["Bloomberg — Fed's Hammack Says Inflation Is Her Main Concern as Labor Market Holds Up, 17 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-17/fed-s-hammack-sees-no-conflict-in-mandate-inflation-her-worry"],
    ["Washington Post — Trump wants rate cuts. More Fed officials say hikes could be next, 17 Jul 2026", "https://www.washingtonpost.com/business/2026/07/17/trump-wants-rate-cuts-more-fed-officials-say-hikes-could-be-next/"],
    ["Bloomberg — Warsh Shows His Inner Hawk as Inflation Debate Heats Up, 18 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-18/warsh-shows-his-inner-hawk-as-inflation-debate-heats-up"],
    ["Euronews — Two US troops killed in Jordan by Iranian attacks, US military says, 18 Jul 2026", "https://www.euronews.com/2026/07/18/two-us-troops-killed-in-jordan-by-iranian-attacks-us-military-says"],
    ["Al Jazeera — US launches new Iran strikes after two soldiers killed: What's the latest?, 19 Jul 2026", "https://www.aljazeera.com/news/2026/7/19/us-launches-new-iran-strikes-after-two-soldiers-killed-whats-the-latest"],
    ["CNBC — U.S. says it targeted Iran forces after deaths of two American troops, 19 Jul 2026", "https://www.cnbc.com/2026/07/19/us-says-it-targeted-iran-forces-after-deaths-of-two-american-troops.html"],
  ],
};

// ---- Recent market commentary from economists (Commentary tab) -------------
// Analysis / opinion / research pieces on Fed & BoE policy from named economists
// and reputable houses, newest first. Rendered as a two-column feed styled like
// the dashboard's Key macro headlines; the four-times-daily routine keeps it current.
export const COMMENTARY = {
  updated: "2026-07-19",
  us: [
    { title: "Warsh Shows His Inner Hawk as Inflation Debate Heats Up", source: "Bloomberg", author: "Bloomberg — Fed coverage", date: "2026-07-18", url: "https://www.bloomberg.com/news/articles/2026-07-18/warsh-shows-his-inner-hawk-as-inflation-debate-heats-up" },
    { title: "The Daily Spark: Sticky services inflation keeps a July hike on the table", source: "Apollo", author: "Torsten Sløk", date: "2026-07-16", url: "https://www.apolloacademy.com/" },
    { title: "Market Views: Narrow AI leadership and a late-cycle US economy", source: "Blackstone", author: "Joe Zidle", date: "2026-07-15", url: "https://www.blackstone.com/insights/" },
    { title: "Kevin Warsh's Congressional Debut Like a 'Breath of Fresh Air,' Says El Erian, as Schiff Flags Fed Chair's 'False Claim'", source: "Benzinga", author: "Mohamed El-Erian", date: "2026-07-15", url: "https://www.benzinga.com/markets/economic-data/26/07/60460861/fed-chair-kevin-warshs-congressional-debut-draws-mixed-reactions" },
  ],
  uk: [
    { title: "British Pound: Shorts on the run", source: "FXStreet", author: "ING — Chris Turner", date: "2026-07-16", url: "https://www.fxstreet.com/news/british-pound-shorts-on-the-run-ing-202607161153" },
    { title: "The great escape: Why Britain is stuck in a fiscal funk and how we can break free", source: "Resolution Foundation", author: "Simon Pittaway, Cillian Sheehan, James Smith, Andy King", date: "2026-07-16", url: "https://www.resolutionfoundation.org/publications/the-great-escape/" },
    { title: "Latest UK Interest Rate Forecasts: Will The Bank Of England Cut Interest Rates On 30 July 2026?", source: "HomeOwners Alliance", author: "Pantheon Macroeconomics — Rob Wood", date: "2026-07-13", url: "https://hoa.org.uk/news/interest-rate-predictions-2/" },
  ],
};

// ---- Economic / credit cycle, Dalio framework (Cycle tab) ------------------
// pos: stylised 0 (early / healthy) → 100 (crisis / deleveraging). Wire
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
      "<strong>Long-term debt / fiscal:</strong> elevated but less acute than the US. Public-sector net debt is <strong>~95% of GDP</strong>; borrowing is projected to fall from 5.2% (2024-25) toward ~4.3% in 2026-27. Gilt-market stress is real (10Y ~4.9%, 30Y ~5.5%) but there is no reserve-currency dynamic. <em>Dalio writes primarily about the US; the UK placement here is Wire synthesis, not his stated view.</em>",
      "The OECD's July 2026 Economic Survey of the UK, published 15 July, projected GDP growth slowing to <strong>0.9% in 2026</strong> (from 1.4% in 2025) and urged the incoming Burnham government to maintain budget discipline and reform the state-pension triple lock to contain fiscal risk — reinforcing the 'elevated but less acute than the US' read.",
    ],
  },
  note: "Gauge values (0–100) are Wire synthesis on a stylised early→crisis track, not figures Dalio publishes. Dalio's documented views are US-focused; the UK read is our interpretation.",
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
// breadth/speculation. Sub-scores (0 = no signal, 100 = extreme) are Wire
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
    "The narrow-leadership rout deepened further into Friday 17 July: global chip stocks extended Thursday's slide in a broad pre-market selloff — the iShares Semiconductor ETF fell ~3.7%, with Applied Materials, LAM Research, Intel and KLA all down 4-5% and Nvidia off ~3% — compounding Thursday's 1.5% Nasdaq close (the CNN Money Fear & Greed Index moved into 'Fear' territory at 41.8) and Netflix's ~9% post-earnings slide on a third-quarter revenue forecast that missed Wall Street estimates, as investors kept questioning whether AI capex can justify current valuations even as the Dow held comparatively steady.",
    "Separately, oil extended its advance on 17 July toward $86/bbl (Brent) and $80/bbl (WTI) — both up more than 11% on the week, their best weekly performance since late April — after Tehran reportedly instructed Yemen's Houthi rebels to threaten closing the Bab el-Mandeb Strait, a second Red Sea chokepoint, if Iranian power infrastructure comes under attack. Equities again showed little sign of pricing in the widening supply-side risk, consistent with the market's narrow, AI-led complacency read.",
    "The narrow-leadership rout crossed a technical threshold on 17 July: the Philadelphia Semiconductor Index (SOX) fell as much as 5.7% on the day, taking its drawdown from June's record high beyond 20% and confirming a technical bear market — global chip stocks have now erased roughly $3.3tn in value since 22 June after a 105% rally into that peak. The proximate trigger was Moonshot AI's release of Kimi K3, a 2.8-trillion-parameter open model billed as the largest ever, which revived 'DeepSeek moment' comparisons about the durability of US AI-chip demand; the rout was multi-causal alongside weak Netflix/TSMC reactions, the Iran war and rate fears, but the speed of the swing from a 105% rally to a bear market in under a month is itself a bubble-consistent signal of narrow, sentiment-driven leadership.",
    "Friday's close confirmed the week as the major indices' first collective weekly decline since early June: the Dow fell 0.77% to 52,146.42, the S&P 500 lost 1.01% to 7,457.69 and the Nasdaq dropped 1.4% to 25,520.24, with 10 of 11 S&P sectors lower and only energy gaining as oil extended its climb on the Iran conflict. The semiconductor cohort's 20%-plus drawdown was its worst week since April 2025, even though the SOX remains up more than 60% year-to-date — a reminder the correction is unwinding an extreme prior rally rather than a broad-market repricing.",
    "The energy shock widened again over the weekend: Iran struck Kuwait's Shuaiba desalination and power plant for a second straight day on 18 July, pushing Brent up 4.6% to $88.10/bbl (WTI $82.49) — a weekly gain of more than 14% — as tanker crossings through the Strait of Hormuz fell to just eight a day (from over 100 pre-conflict), with the conflict now formally spanning both a shipping-lane crisis and a civilian-infrastructure war; equity markets are closed over the weekend, leaving the reaction untested ahead of Monday's open.",
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
  note: "Sub-scores and the composite are Wire synthesis on a 0–100 scale, not published figures. Weighting: valuation 45%, breadth & speculation 30%, credit & policy 25%. Educational only — not investment advice.",
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
    ["Benzinga — Nasdaq Tumbles 1.5% Amid Selloff In Chip Stocks, 17 Jul 2026", "https://www.benzinga.com/markets/market-summary/26/07/60516921/nasdaq-tumbles-1-5-amid-selloff-in-chip-stocks-investor-sentiment-weakens-greed-index-moves-to-fear-zone"],
    ["Reuters (via TradingView) — Wall St futures fall as chip selloff gathers pace; Netflix tumbles, 17 Jul 2026", "https://www.tradingview.com/news/reuters.com,2026:newsml_L4N43J0MP:0-wall-st-futures-fall-as-chip-selloff-gathers-pace-netflix-tumbles/"],
    ["CNBC — Netflix stock falls as earnings forecast disappoints, 16 Jul 2026", "https://www.cnbc.com/2026/07/16/netflix-nflx-earnings-q2-2026.html"],
    ["CNBC — Oil prices rise as U.S.-Iran hostilities threaten supply through Strait of Hormuz, 17 Jul 2026", "https://www.cnbc.com/2026/07/17/oil-price-today-brent-wti.html"],
    ["Bloomberg — Chips Stocks Sink Into Bear Market as 105% AI Rally Fizzles, 17 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-17/chips-stocks-tumble-into-bear-market-as-105-ai-rally-fizzles"],
    ["Bloomberg — Moonshot Unveils Kimi K3 AI Model, Narrowing Gap With US Rivals, 17 Jul 2026", "https://www.bloomberg.com/news/articles/2026-07-17/china-s-powerful-new-moonshot-ai-model-closes-gap-with-us-rivals"],
    ["Xinhua — U.S. stocks slide as semiconductors slip into technical bear market, 18 Jul 2026", "https://english.news.cn/20260718/3a7128e8ba5e4146b87ec169223cb3b4/c.html"],
    ["Tech Times — Brent Crude Hits $88 as Iran Extends War From Hormuz to Kuwait Drinking Water, 18 Jul 2026", "https://www.techtimes.com/articles/320922/20260718/brent-crude-hits-88-iran-extends-war-hormuz-kuwait-drinking-water.htm"],
  ],
};

// ---- Government bond yield curves (Dashboard) ------------------------------
// US Treasury and UK gilt par yields across the maturity spectrum, compiled as of
// UPDATED. Values are Wire synthesis from the cited primary curves; refreshed by
// the same routine that updates the indicators. Used by the dashboard yield-curve
// chart. (No live /api endpoint yet — these are static like the FedWatch/dot data.)
export const YIELD_CURVE = {
  asOf: "17 Jul 2026",
  maturities: ["3M", "2Y", "5Y", "10Y", "30Y"],
  us: [4.30, 4.14, 4.28, 4.57, 4.82],
  uk: [3.95, 4.30, 4.58, 4.92, 5.52],
  note: "The US front end is inverted — the 2-year (~4.14%) sits below the 10-year (4.57%) after June's cooler CPI and PPI pulled July-hike odds down — while the long end stays elevated on heavy issuance. The UK gilt curve sits higher and steeper across the board (10Y ~4.9%, 30Y ~5.5%) on the renewed oil shock, sticky ~3% services inflation and fiscal risk.",
  sources: [
    ["US Treasury — daily par yield curve", "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve"],
    ["UK Debt Management Office — gilt yields", "https://www.dmo.gov.uk/data/"],
  ],
};

// ---- Guidance alerts surfaced in the notifications bell --------------------
// Changes to the policy-rate outlook and cycle read. Ids are stable; bump the
// id (e.g. a date suffix) when the underlying guidance changes so it re-flags.
export const ALERTS = [
  { id: "g-iraq-death-nuclear-site-2026-07-19", kind: "Markets", title: "A third US service member was killed (in Iraq, during the detonation of a downed Iranian drone) as the US completed an eighth straight night of strikes on Iran, including one Iran says hit the under-construction Darkhovin nuclear plant; Kuwait reported a second desalination-plant attack in two days and Iran said the Islamabad ceasefire framework is now suspended.", href: "#/bubble", date: "2026-07-19" },
  { id: "g-us-strikes-iran-2026-07-19", kind: "Markets", title: "The US carried out retaliatory strikes on Iran after two American service members were killed in Jordan, deepening the oil-driven inflation and war-risk premium into the 28-29 July FOMC meeting.", href: "#/bubble", date: "2026-07-19" },
  { id: "g-jordan-troops-2026-07-18", kind: "Markets", title: "Two US service members were killed in Jordan in Iranian-linked attacks — the first direct US combat deaths of the renewed conflict — deepening the war-risk premium already visible in oil, gold and rate markets.", href: "#/bubble", date: "2026-07-18" },
  { id: "g-warsh-hawk-2026-07-18", kind: "Rate guidance", title: "Fed Chair Kevin Warsh again said the Fed has 'no tolerance' for elevated inflation as the oil-driven price shock revives the internal Fed debate over whether a hike is still needed ahead of the 29 July decision.", href: "#/policy", date: "2026-07-18" },
  { id: "g-kuwait-desal-2nd-2026-07-18", kind: "Bubble risk", title: "Iran struck Kuwait's Shuaiba desalination and power plant for a second straight day on 18 July, pushing Brent up 4.6% to $88.10/bbl (a 14%+ weekly gain) as Hormuz tanker crossings fell to just eight a day — the Gulf war now spans both a shipping-lane crisis and a civilian-infrastructure war.", href: "#/bubble", date: "2026-07-18" },
  { id: "g-hammack-hawkish-2026-07-17", kind: "Rate guidance", title: "Cleveland Fed President Beth Hammack said persistently high inflation (core PCE ~3.3% in June) is now her bigger concern than the labour market, joining a growing chorus of officials the Washington Post reports are open to a hike even as President Trump keeps pushing for cuts.", href: "#/policy", date: "2026-07-17" },
  { id: "g-fedwatch-sept-73pct-2026-07-18", kind: "Rate guidance", title: "CME FedWatch-implied odds of a September Fed hike have risen to roughly 73% (from ~59% a few days earlier and just 26% in mid-June) after Governor Lisa Cook said she is 'prepared to act soon' if disinflation signs don't appear, even as the 29 July hike itself stays a low-probability (~10-13%) outcome.", href: "#/policy", date: "2026-07-18" },
  { id: "g-chip-week-close-2026-07-18", kind: "Bubble risk", title: "Friday's close confirmed the major indices' first collective weekly decline since early June (Dow -0.77%, S&P 500 -1.01%, Nasdaq -1.4%), with the semiconductor cohort's 20%-plus drawdown its worst week since April 2025 — though the SOX remains up over 60% year-to-date.", href: "#/bubble", date: "2026-07-18" },
  { id: "g-chip-bear-market-2026-07-17", kind: "Bubble risk", title: "The Philadelphia Semiconductor Index (SOX) fell as much as 5.7% on 17 July, taking its drawdown from June's record peak beyond 20% and confirming a technical bear market — chip stocks have erased ~$3.3tn since 22 June — after Moonshot AI's Kimi K3 model release revived 'DeepSeek moment' comparisons about US AI-chip demand.", href: "#/bubble", date: "2026-07-17" },
  { id: "g-chip-selloff-continues-2026-07-17", kind: "Bubble risk", title: "Global chip stocks extended Thursday's rout into Friday's pre-market session — the iShares Semiconductor ETF fell ~3.7% and Nvidia, Applied Materials, Intel and LAM Research all declined — compounding Netflix's ~9% post-earnings slide, as investors kept questioning whether AI capex can justify current valuations.", href: "#/bubble", date: "2026-07-17" },
  { id: "g-hormuz-bab-el-mandeb-2026-07-17", kind: "Markets", title: "Brent extended its advance toward $86/bbl and WTI toward $80/bbl — both up more than 11% on the week — after Iran reportedly instructed Yemen's Houthi rebels to threaten closing the Bab el-Mandeb Strait, a second Red Sea chokepoint, if Iranian power infrastructure is struck.", href: "#/bubble", date: "2026-07-17" },
  { id: "g-kuwait-desalination-strike-2026-07-17", kind: "Markets", title: "Kuwait said an Iranian missile and drone strike hit a major power-and-desalination plant, sparking a fire and injuring several military personnel — a widening of the conflict onto Gulf civilian infrastructure (Kuwait draws ~90% of its drinking water from desalination) that kept Brent elevated near multi-week highs.", href: "#/bubble", date: "2026-07-17" },
  { id: "g-burnham-leader-confirmed-2026-07-17", kind: "Markets", title: "Labour's special conference confirmed Andy Burnham as party leader with backing from over 360 of 403 MPs; the 10-year gilt yield eased to ~4.95% as markets welcomed the expected appointment of Shabana Mahmood as chancellor, ahead of Burnham formally entering Downing Street on Monday.", href: "#/cycle", date: "2026-07-17" },
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
    us: "Fed on hold at 3.50–3.75%; June CPI and PPI both cooled, pulling 29 July hike odds from ~46.5% to ~10-13% (CME FedWatch), but September-hike odds have risen to ~73% as Governor Cook says she's 'prepared to act soon' and the Iran oil shock keeps the cycle live.",
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
  updated: "2026-07-19",
  us: [
    { title: "U.S. says it targeted Iran forces after deaths of two American troops", source: "CNBC", date: "2026-07-19", time: "21:05", url: "https://www.cnbc.com/2026/07/19/us-says-it-targeted-iran-forces-after-deaths-of-two-american-troops.html" },
    { title: "US renews strikes on Iran after two military personnel killed by Iranian attack", source: "Reuters (via Yahoo Finance)", date: "2026-07-19", time: "19:33", url: "https://www.yahoo.com/news/articles/us-renews-strikes-iran-two-232139930.html" },
    { title: "US launches new Iran strikes after two soldiers killed: What's the latest?", source: "Al Jazeera", date: "2026-07-19", time: "21:05", url: "https://www.aljazeera.com/news/2026/7/19/us-launches-new-iran-strikes-after-two-soldiers-killed-whats-the-latest" },
    { title: "Here are the 6 big things we're watching in the stock market this week", source: "CNBC", date: "2026-07-19", time: "21:05", url: "https://www.cnbc.com/2026/07/19/here-are-the-6-big-things-were-watching-in-the-stock-market-this-week.html" },
    { title: "Live updates: US-Iran war news; American military casualties raise fears of a wider war with Iran", source: "CNN", date: "2026-07-19", time: "21:05", url: "https://www.cnn.com/2026/07/19/world/live-news/iran-war-trump" },
  ],
  uk: [
    { title: "UK's incoming PM Andy Burnham drops digital ID scheme to prioritize cost of living, say allies", source: "CNBC", date: "2026-07-19", time: "21:05", url: "https://www.cnbc.com/2026/07/19/uks-incoming-pm-andy-burnham-to-prioritize-cost-of-living-say-allies.html" },
    { title: "Burnham urged not to allow new North Sea drilling", source: "RTÉ", date: "2026-07-18", time: "20:02", url: "https://www.rte.ie/news/2026/0718/1583956-uk-andy-burnham/" },
    { title: "Burnham to approve North Sea oil and gas drilling in policy blitz", source: "CityAM", date: "2026-07-17", time: "11:53", url: "https://www.cityam.com/burnham-to-approve-north-sea-oil-and-gas-drilling-in-policy-blitz/" },
    { title: "UK Economy Leads G7 on Growth as Rate-Hike Pressure Builds for Borrowers", source: "Tech Times", date: "2026-07-16", time: "21:10", url: "https://www.techtimes.com/articles/320748/20260716/uk-economy-leads-g7-growth-rate-hike-pressure-builds-borrowers.htm" },
    { title: "Pound Index Hits One-Year High on Mahmood for Chancellor Reports", source: "Bloomberg", date: "2026-07-16", time: "21:10", url: "https://www.bloomberg.com/news/articles/2026-07-16/pound-index-hits-one-year-high-on-mahmood-for-chancellor-reports" },
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
  updated: "2026-07-19",
  items: [
    {"title":"U.S. says it targeted Iran forces after deaths of two American troops","source":"CNBC","date":"2026-07-19","time":"21:05","url":"https://www.cnbc.com/2026/07/19/us-says-it-targeted-iran-forces-after-deaths-of-two-american-troops.html","blurb":"CENTCOM says it hit Iranian coastal-surveillance, air-defence and missile-storage sites after two US troops were killed in Jordan and a third in Iraq."},
    {"title":"US renews strikes on Iran after two military personnel killed by Iranian attack","source":"Reuters (via Yahoo Finance)","date":"2026-07-19","time":"19:33","url":"https://www.yahoo.com/news/articles/us-renews-strikes-iran-two-232139930.html","blurb":"An eighth consecutive night of US strikes on Iran follows the Jordan attack, as Tehran says the Islamabad ceasefire framework is now suspended."},
    {"title":"US launches new Iran strikes after two soldiers killed: What's the latest?","source":"Al Jazeera","date":"2026-07-19","time":"21:05","url":"https://www.aljazeera.com/news/2026/7/19/us-launches-new-iran-strikes-after-two-soldiers-killed-whats-the-latest","blurb":"A rundown of the conflict's eighth day, as Iran says the US struck an under-construction nuclear plant near Darkhovin and Kuwait reports a second desalination-plant attack in two days."},
    {"title":"Here are the 6 big things we're watching in the stock market this week","source":"CNBC","date":"2026-07-19","time":"21:05","url":"https://www.cnbc.com/2026/07/19/here-are-the-6-big-things-were-watching-in-the-stock-market-this-week.html","blurb":"A heavy earnings week (Alphabet, Tesla, Intel) and the still-live Iran oil shock headline what investors are watching into Monday's open."},
    {"title":"UK's incoming PM Andy Burnham drops digital ID scheme to prioritize cost of living, say allies","source":"CNBC","date":"2026-07-19","time":"21:05","url":"https://www.cnbc.com/2026/07/19/uks-incoming-pm-andy-burnham-to-prioritize-cost-of-living-say-allies.html","blurb":"Burnham's office says scrapping the digital-ID scheme frees up government attention for cost-of-living priorities as he prepares to enter Downing Street on Monday."},
    {"title":"How will the ECB respond to the latest rise in oil prices?","source":"Financial Times","date":"2026-07-19","time":"12:00","url":"https://www.ft.com/content/c1b04338-8fc8-45fc-8a35-f623843d4dda","blurb":"The Iran-driven oil shock complicates the ECB's own policy calculus just as the Fed and BoE debate whether to hike."},
    {"title":"US strikes Iran after two American troops killed in Jordan","source":"Financial Times","date":"2026-07-19","time":"10:13","url":"https://www.ft.com/content/e8e8adc5-7c56-45a8-99fc-bb5acfda263e","blurb":"Washington carries out retaliatory strikes after the first direct US combat deaths of the renewed conflict, deepening the oil-driven inflation risk into the 28-29 July FOMC meeting."},
    {"title":"U.S. blockades Iranian ports, launches dozens of strikes as Trump seeks control of Strait of Hormuz","source":"CBS News","date":"2026-07-19","time":"09:22","url":"https://www.cbsnews.com/live-updates/iran-war-trump-strait-of-hormuz-attacks-persian-gulf/","blurb":"Rolling coverage as the US completes an eighth straight night of strikes on Iran following the killing of two US service members in Jordan."},
    {"title":"Brent Crude Hits $88 as Iran Extends War From Hormuz to Kuwait Drinking Water","source":"Tech Times","date":"2026-07-18","time":"21:10","url":"https://www.techtimes.com/articles/320922/20260718/brent-crude-hits-88-iran-extends-war-hormuz-kuwait-drinking-water.htm","blurb":"Iran struck Kuwait's Shuaiba desalination plant for a second straight day, pushing Brent up 4.6% to $88.10 — a 14%+ weekly gain — as Hormuz tanker crossings fell to just eight a day and the Gulf war widens from shipping into civilian infrastructure."},
    {"title":"Burnham urged not to allow new North Sea drilling","source":"RTÉ","date":"2026-07-18","time":"20:02","url":"https://www.rte.ie/news/2026/0718/1583956-uk-andy-burnham/","blurb":"Environmental and political figures press the incoming PM to honour Labour's manifesto pledge against new North Sea oil and gas exploration licences."},
    {"title":"Burnham to approve North Sea oil and gas drilling in policy blitz","source":"CityAM","date":"2026-07-17","time":"11:53","url":"https://www.cityam.com/burnham-to-approve-north-sea-oil-and-gas-drilling-in-policy-blitz/","blurb":"Burnham has asked officials to prepare announcements on new North Sea drilling and public control of Thames Water within days of taking office."},
    {"title":"UK Economy Leads G7 on Growth as Rate-Hike Pressure Builds for Borrowers","source":"Tech Times","date":"2026-07-16","time":"21:10","url":"https://www.techtimes.com/articles/320748/20260716/uk-economy-leads-g7-growth-rate-hike-pressure-builds-borrowers.htm","blurb":"UK GDP growth outpaces G7 peers even as sticky services inflation and oil-driven price pressure keep BoE hike bets alive."},
    {"title":"Britain hopes this man will save its economy. We went to Manchester to find out why","source":"CNN Business","date":"2026-07-18","time":"17:08","url":"https://kesq.com/money/cnn-business-consumer/2026/07/18/britain-hopes-this-man-will-save-its-economy-we-went-to-manchester-to-find-out-why/","blurb":"A ground-level look at whether the incoming prime minister's Manchester track record translates into a credible economic turnaround plan for the UK."},
    {"title":"U.S. stocks slide as semiconductors slip into technical bear market","source":"Xinhua","date":"2026-07-18","time":"12:03","url":"https://english.news.cn/20260718/3a7128e8ba5e4146b87ec169223cb3b4/c.html","blurb":"The Dow fell 0.77% to 52,146.42, the S&P 500 lost 1.01% to 7,457.69 and the Nasdaq dropped 1.4% to 25,520.24 on Friday, capping the major indices' first collective weekly decline since early June as the semiconductor sector's worst week since April 2025 confirmed a technical bear market."},
    {"title":"Pound Sterling Forecast 2026: Politics And Growth Keep GBP Supported — Lloyds","source":"ExchangeRates.org.uk","date":"2026-07-18","time":"12:03","url":"https://www.exchangerates.org.uk/news/46543/2026-07-18-pound-sterling-forecast-2026-politics-and-growth-keep-gbp-supported-lloyds.html","blurb":"Lloyds' latest currency outlook argues the Burnham transition and the BoE's rate-differential advantage over the ECB should keep sterling underpinned through the rest of 2026."},
    {"title":"Warsh Shows His Inner Hawk as Inflation Debate Heats Up","source":"Bloomberg","date":"2026-07-18","time":"09:22","url":"https://www.bloomberg.com/news/articles/2026-07-18/warsh-shows-his-inner-hawk-as-inflation-debate-heats-up","blurb":"Fed Chair Kevin Warsh reiterates the Fed has 'no tolerance' for elevated inflation as the oil-driven price shock revives an internal Fed debate over whether a hike is still needed."},
    {"title":"The U.S. and Iran blow past red lines as they lurch back toward all-out war","source":"NPR","date":"2026-07-18","time":"09:22","url":"https://www.npr.org/2026/07/18/nx-s1-5898916/us-iran-escalate-strikes","blurb":"Both sides have crossed thresholds neither had crossed before, deepening a conflict that is now feeding directly into oil prices and rate expectations."},
    {"title":"Two US troops killed in Jordan by Iranian attacks, US military says","source":"Euronews","date":"2026-07-18","time":"09:22","url":"https://www.euronews.com/2026/07/18/two-us-troops-killed-in-jordan-by-iranian-attacks-us-military-says","blurb":"The first direct US combat deaths of the renewed conflict deepen the war-risk premium already visible in oil, gold and rate markets."},
    {"title":"Fed's Hammack Says Inflation Is Her Main Concern as Labor Market Holds Up","source":"Bloomberg","date":"2026-07-17","time":"21:10","url":"https://www.bloomberg.com/news/articles/2026-07-17/fed-s-hammack-sees-no-conflict-in-mandate-inflation-her-worry","blurb":"Cleveland Fed President Beth Hammack said persistently high inflation — core PCE she estimates rose 3.3% in June — is now her bigger worry than the labor market, joining a growing chorus of officials open to a hike ahead of the 28-29 July FOMC meeting."},
    {"title":"Trump wants rate cuts. More Fed officials say hikes could be next.","source":"Washington Post","date":"2026-07-17","time":"21:10","url":"https://www.washingtonpost.com/business/2026/07/17/trump-wants-rate-cuts-more-fed-officials-say-hikes-could-be-next/","blurb":"A small but growing group of Fed officials is warning inflation may force a rate increase even as President Trump keeps pushing for cuts, setting up a charged debate at the Fed's 28-29 July meeting."},
    {"title":"Iran Attacks Kuwait Desalination and Power Plants as Hostilities Worsen","source":"Bloomberg","date":"2026-07-17","time":"21:04","url":"https://www.bloomberg.com/news/articles/2026-07-17/iran-attacks-kuwait-desalination-and-power-plants-as-hostilities-worsen","blurb":"An Iranian missile and drone strike damaged a major Kuwaiti power-and-desalination plant and injured military personnel, widening the conflict onto Gulf civilian infrastructure."},
    {"title":"Andy Burnham becomes UK Labour leader; next stop - prime minister","source":"CNBC","date":"2026-07-17","time":"13:15","url":"https://www.cnbc.com/2026/07/17/andy-burnham-becomes-uk-labour-leader-next-stop-prime-minister.html","blurb":"Burnham's confirmation as Labour leader clears the way for him to enter Downing Street on Monday as the UK's seventh prime minister in a decade."},
    {"title":"World stocks fall in semiconductor rout; oil rises on Middle East escalation","source":"Reuters","date":"2026-07-17","time":"13:00","url":"https://finance.yahoo.com/markets/stocks/articles/stocks-stumble-oil-set-weekly-011728443.html","blurb":"A global semiconductor selloff dragged equities lower while Brent held near multi-week highs on the escalating US-Iran conflict."},
    {"title":"European shares drop as global tech selloff, Middle East conflict weigh","source":"Reuters","date":"2026-07-17","time":"13:00","url":"https://www.investing.com/news/stock-market-news/european-shares-slip-as-tech-stocks-mideast-tensions-weigh-4797502","blurb":"European equities slide as the chip rout and escalating US-Iran conflict combine to sour risk appetite.","author":"Tharuniyaa Lakshmi and Johann M Cherian"},
    {"title":"FTSE 100 Live: AI Selloff Hits European Stocks, UK Stocks Escape","source":"Bloomberg","date":"2026-07-17","time":"12:45","url":"https://www.bloomberg.com/news/live-blog/2026-07-17/what-s-moving-uk-markets-right-now-markets-today","blurb":"European bourses fell in sympathy with the global chip rout, though UK equities proved comparatively resilient on the day."},
    {"title":"Chip Stock Rout Deepens as TSMC Selloff Drives Taiwan Correction","source":"Bloomberg","date":"2026-07-17","time":"12:30","url":"https://www.bloomberg.com/news/articles/2026-07-17/chip-stock-selloff-deepens-in-asia-as-tsmc-fails-to-impress","blurb":"Taiwan's stock market entered correction territory as TSMC's record results still failed to satisfy stretched AI-valuation expectations."},
    {"title":"Burnham Says He'll Be a Pro-Business PM in London Speech","source":"Bloomberg","date":"2026-07-17","time":"12:19","url":"https://www.bloomberg.com/news/articles/2026-07-17/burnham-says-he-will-be-a-pro-business-prime-minister","blurb":"Britain's incoming prime minister pitched a \"pro-business\" agenda in his first speech since winning the Labour leadership."},
    {"title":"Forecasting the coming week: ECB decision, UK inflation, and global PMIs to drive markets","source":"FXStreet","date":"2026-07-17","time":"12:19","url":"https://www.fxstreet.com/news/forecasting-the-coming-week-ecb-decision-uk-inflation-and-global-pmis-to-drive-markets-202607171835","blurb":"The ECB's rate call, UK inflation and labour-market data, and flash PMIs headline a week reshaped by the Iran-driven oil shock."},
    {"title":"Week Ahead - Jul 20th","source":"TradingEconomics","date":"2026-07-17","time":"12:19","url":"https://tradingeconomics.com/calendar?article=29362&importance=2&startdate=2026-07-17","blurb":"A rundown of the week's central-bank decisions, earnings and data, including Andy Burnham's formal accession as UK prime minister."},
    {"title":"Stock market today: Stocks fall after Netflix whiff while chip stocks sell-off hammers Nasdaq","source":"Yahoo Finance","date":"2026-07-17","time":"12:19","url":"https://finance.yahoo.com/markets/live/stock-market-today-friday-july-17-dow-sp-500-nasdaq-092345307.html","blurb":"A semiconductor-led sell-off dragged Wall Street lower, closing out a losing week for the major US indexes."},
    {"title":"Andy Burnham Calls for 'New Politics' in U.K. in First Speech as Labour Leader","source":"Time","date":"2026-07-17","time":"12:03","url":"https://time.com/article/2026/07/17/andy-burnham-first-speech-labour-leader-incoming-prime-minister/","blurb":"In his first speech as Labour leader, Burnham positioned himself as a 'pro-business' reformer, pointing to his record on public transport in Manchester ahead of taking over Downing Street on Monday."},
    {"title":"Andy Burnham to become U.K.'s prime minister Monday after being declared Labour Party leader","source":"CBS News","date":"2026-07-17","time":"12:03","url":"https://www.cbsnews.com/news/andy-burnham-uk-prime-minister-labour-party-leader/","blurb":"Burnham will succeed Keir Starmer as Britain's seventh prime minister in a decade, inheriting a sluggish economy, a cost-of-living squeeze and overstretched public services."},
    {"title":"Andy Burnham will be Britain's seventh leader in a decade. Can he buck the trend?","source":"CNN","date":"2026-07-17","time":"12:03","url":"https://www.cnn.com/2026/07/17/uk/andy-burnham-labour-leader-uk-intl","blurb":"A look at whether the former Greater Manchester mayor, known as the 'King of the North,' can break the UK's recent run of short-lived premierships."},
    {"title":"Stock market next week: Outlook for July 20-24, 2026","source":"CNBC","date":"2026-07-17","time":"12:03","url":"https://www.cnbc.com/2026/07/17/stock-market-next-week-outlook-for-july-20-24-2026.html","blurb":"Alphabet and Tesla headline a heavy earnings week as investors weigh whether hyperscaler AI-capex guidance can steady the reeling chip sector."},
    {"title":"Chip stock sell-off, Netflix earnings, Trump's approval rating and more in Morning Squawk","source":"CNBC","date":"2026-07-17","time":"11:30","url":"https://www.cnbc.com/2026/07/17/5-things-to-know-before-the-stock-market-opens.html","blurb":"A rundown of the five biggest stories moving markets into Friday's US open."},
    {"title":"Oil prices rise as U.S.-Iran hostilities threaten supply through Strait of Hormuz","source":"CNBC","date":"2026-07-17","time":"11:00","url":"https://www.cnbc.com/2026/07/17/oil-price-today-brent-wti.html","blurb":"Brent rose toward $85 and WTI toward $80 — both up more than 11% on the week — after Iran vowed to target regional infrastructure if Trump follows through on threats to strike its facilities."},
    {"title":"Wall St futures fall as chip selloff gathers pace; Netflix tumbles","source":"Reuters","date":"2026-07-17","time":"10:30","url":"https://www.tradingview.com/news/reuters.com,2026:newsml_L4N43J0MP:0-wall-st-futures-fall-as-chip-selloff-gathers-pace-netflix-tumbles/","blurb":"US futures extended Thursday's semiconductor rout into Friday's premarket session, with Nvidia, Applied Materials, LAM Research and Intel all lower and Netflix down over 9% after a weak Q3 revenue forecast."},
    {"title":"UK Gilt Yields Retreat from Two-Month Highs on Fiscal Optimism","source":"Trading Economics","date":"2026-07-17","time":"09:00","url":"https://www.tradingview.com/news/te_news:567278:0-uk-gilt-yields-retreat-from-two-month-highs-on-fiscal-optimism/","blurb":"The 10-year gilt yield eased toward 4.95% as investors welcomed the expected appointment of a fiscally cautious chancellor, unwinding some of the week's Hormuz-driven rate-hike repricing."},
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
  { date: "2026-08-01", country: "UK", title: "S&P Global/CIPS Manufacturing PMI, final (July)", url: "https://www.pmi.spglobal.com/Public/Home/PressReleases" },
  { date: "2026-08-03", country: "US", title: "ISM Manufacturing PMI (July)", url: "https://www.ismworld.org/supply-management-news-and-reports/reports/rob-report-calendar/" },
  { date: "2026-08-03", country: "UK", title: "S&P Global/CIPS Services & Composite PMI, final (July)", url: "https://www.pmi.spglobal.com/Public/Home/PressReleases" },
  { date: "2026-08-05", country: "US", title: "ISM Services PMI (July)", url: "https://www.ismworld.org/supply-management-news-and-reports/reports/rob-report-calendar/" },
  { date: "2026-08-07", country: "US", title: "Jobs report / Nonfarm payrolls (July)", url: "https://www.bls.gov/schedule/news_release/empsit.htm" },
  { date: "2026-08-12", country: "US", title: "CPI (July)", url: "https://www.bls.gov/schedule/news_release/cpi.htm" },
  { date: "2026-08-13", country: "US", title: "PPI (July)", url: "https://www.bls.gov/schedule/news_release/ppi.htm" },
  { date: "2026-08-13", country: "UK", title: "GDP monthly estimate (June)", url: "https://www.ons.gov.uk/economy/grossdomesticproductgdp/bulletins/gdpmonthlyestimateuk/latest" },
  { date: "2026-08-14", country: "US", title: "Retail sales (July)", url: "https://www.census.gov/retail/release_schedule.html" },
  { date: "2026-08-19", country: "US", title: "FOMC minutes (28–29 July meeting)", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" },
  { date: "2026-08-18", country: "UK", title: "ONS labour market & average earnings (August release)", url: "https://www.gov.uk/government/statistics/announcements/uk-labour-market-august-2026" },
  { date: "2026-08-19", country: "UK", title: "CPI inflation (July)", url: "https://www.ons.gov.uk/releases/consumerpriceinflationukjuly2026" },
];

// ---- Wall of maturities — corporate credit due over the next five years ----
// VERBATIM figures from the cited reports only. Per-year dollar splits sit
// behind S&P's registration wall — never estimate or interpolate them here;
// upgrade this block only from a source that states the numbers.
export const MATWALL = {
  rated: {
    total: "$12.4tn", window: "2025\u20132029", igPct: 73,
    src: { name: "S&P", url: "https://investorfactbook.spglobal.com/sp-global-ratings/global-corporate-debt-maturities-through-2029/" },
  },
  near: {
    rows: [
      ["Due within 36 months", "$6.88tn \u00b7 29.7% of rated"],
      ["of which speculative-grade", "$1.43tn"],
      ["Spec-grade peak year", "2029"],
    ],
    src: { name: "S&P \u00b7 Apr 2026", url: "https://www.spglobal.com/ratings/en/regulatory/article/credit-trends-global-refinancing-speculative-grade-maturities-now-peak-in-2029-s101682010" },
  },
  bonds: {
    igPct: 24, nigPct: 31,
    rows: [["Outstanding, end-2025", "$36.4tn bonds \u00b7 $23.1tn loans"]],
    src: { name: "OECD GDR 2026", url: "https://www.oecd.org/en/publications/global-debt-report-2026_e9d80efd-en.html" },
  },
  privateCredit: {
    rows: [
      ["BDC direct-lending sample", "74 funds \u00b7 $84bn"],
      ["Due through 2026", "~$15bn"],
      ["Wall peaks", "2028\u201329"],
    ],
    src: { name: "Reuters", url: "https://finance.yahoo.com/markets/stocks/articles/private-credit-borrowers-big-maturity-141544760.html" },
  },
  // Maturity wall by year (bar chart) \u2014 the ONLY published per-year figures;
  // the global rated per-year splits sit behind S&P's registration wall (see
  // note above). US leveraged finance, quoted verbatim from public index
  // analyses. null = no published figure for that bucket \u2014 rendered as "n/p",
  // NEVER estimated or interpolated. hyMin marks a ">$Xbn" floor figure.
  wall: {
    unit: "$bn",
    buckets: [
      { y: "2026\u201327", loans: 32, hy: null },
      { y: "2028", loans: 331, hy: null },
      { y: "2029", loans: null, hy: 350, hyMin: true },
    ],
    note: "Loans: Morningstar LSTA US Lev Loan Index ($1.57tn outstanding, end-Jun 2026); 2028 includes $124bn from B\u2212 borrowers. HY bonds: >$700bn due 2027\u201329 in total (as of 30 Nov 2025). n/p = no published per-year figure.",
    srcs: {
      loans: { name: "LSTA \u00b7 Jun 2026", url: "https://www.lsta.org/content/morningstar-lsta-leveraged-loan-index-analysis-june-2026/" },
      hy: { name: "PitchBook \u00b7 LCD", url: "https://pitchbook.com/news/articles/2026-us-high-yield-outlook-volume-to-tick-higher-amid-looming-maturity-wall" },
    },
  },
};

// Earnings wall (Dashboard › Earnings): a one-week LOOK-BACK (results +
// share reaction) and the week AHEAD (consensus), FOCUSED on: banks & brokers,
// asset managers, AI-relevant names (hyperscalers, chips, AI software), the
// Mag 7, and other market-movers. RULES — every figure VERBATIM from the
// sources below, never estimated here. Each row carries the full triple
// est/act × Eps/Rev plus optional km {l, est, act} (the sector's key metric)
// and guide {est, act} (guidance going in / issued with results), plus px = the
// source's quoted share reaction. Weekly roll (Monday 05:00 routine): last
// week's block is replaced by the week just ended, the ahead block by the new
// calendar; act/px filled by the first routine after each release.
// held[] = the reader's ETFs holding the name ({etf, w}, verified only):
// IGWD tracks MSCI World (any developed large cap; weights from the MSCI
// factsheet top-10 where published); EMEE is EM-only (weights from the
// BlackRock factsheet); WMVG = World Min Vol (MSCI factsheet constituents);
// COMM holds commodity futures, never equities.
export const EARNINGS = {
  weeks: [
    { label: "Last week \u00b7 13\u201317 Jul", days: [
      { date: "2026-07-14", rows: [
        { t: "JPM", n: "JPMorgan", tag: "Banks \u00b7 Dow", when: "Pre-mkt", held: [{ etf: "IGWD", w: null }], estEps: "$5.55", estRev: "$48.8bn", actEps: "$7.70", actRev: "$57.3bn", km: { l: "Markets rev", est: null, act: "$12.1bn +35%" }, guide: { est: "FY26 NII ~$103bn", act: null }, px: null, note: "record $21.2bn profit; all five majors beat" },
        { t: "GS", n: "Goldman Sachs", tag: "Banks \u00b7 Dow", when: "Pre-mkt", held: [{ etf: "IGWD", w: null }], estEps: "$14.47", estRev: "$16.49bn", actEps: "$20.98", actRev: "$20.34bn", km: { l: "Markets rev", est: null, act: "$7.42bn record" }, px: null, note: "best quarter in its history" },
      ] },
      { date: "2026-07-15", rows: [
        { t: "MS", n: "Morgan Stanley", tag: "Banks \u00b7 S&P 500", when: "Pre-mkt", held: [{ etf: "IGWD", w: null }], estEps: "$2.89", estRev: "$19.38bn", actEps: "$3.46", actRev: "$21.3bn", km: { l: "Equities rev", est: null, act: "$6.3bn +69%" }, px: null, note: "record equities revenue" },
        { t: "ASML", n: "ASML", tag: "Chips \u00b7 AI capex", when: null, held: [{ etf: "IGWD", w: null }], estEps: null, estRev: null, actEps: "\u20ac7.59", actRev: "\u20ac9.3bn", km: { l: "Gross mgn", est: null, act: "54.0%" }, guide: { est: null, act: "FY26 \u20ac43\u201345bn \u00b7 Q3 \u20ac11\u201312bn" }, px: null },
      ] },
      { date: "2026-07-16", rows: [
        { t: "TSM", n: "TSMC", tag: "Chips \u00b7 EM", when: null, held: [{ etf: "EMEE", w: "9.74%" }], estEps: "$3.83", estRev: "$40bn", actEps: "$4.31/ADR", actRev: "$40.2bn", km: { l: "Gross mgn", est: "65.5\u201367.5%", act: "67.7% record" }, px: "-5%" },
      ] },
    ] },
    { label: "This week \u00b7 20\u201324 Jul", days: [
      { date: "2026-07-21", rows: [
        { t: "SCHW", n: "Charles Schwab", tag: "Banks/brokers \u00b7 S&P 500", when: "Pre-mkt", held: [{ etf: "IGWD", w: null }], estEps: "$1.55", estRev: "$6.89bn", actEps: null, actRev: null, px: null },
        { t: "COF", n: "Capital One", tag: "Banks \u00b7 S&P 500", when: null, held: [{ etf: "IGWD", w: null }], estEps: "$4.89", estRev: "$15.7bn", km: { l: "Non-int inc", est: "$3.21bn", act: null }, actEps: null, actRev: null, px: null },
        { t: "KO", n: "Coca-Cola", tag: "Staples \u00b7 Dow", when: "Pre-mkt", held: [{ etf: "IGWD", w: null }], estEps: "$0.93", estRev: "$13.13bn", actEps: null, actRev: null, px: null },
        { t: "VZ", n: "Verizon", tag: "Telecoms \u00b7 Dow", when: "Pre-mkt", held: [{ etf: "IGWD", w: null }], estEps: "$1.26", estRev: "$35.5bn", km: { l: "Adj EBITDA", est: "$13.7bn", act: null }, note: "consensus +7.7% y/y; EBITDA cons +8.1%", actEps: null, actRev: null, px: null },
        { t: "RTX", n: "RTX", tag: "Defence \u00b7 S&P 500", when: "Pre-mkt", held: [{ etf: "IGWD", w: null }], estEps: "$1.66", estRev: "$23.08bn", actEps: null, actRev: null, px: null },
        { t: "LMT", n: "Lockheed Martin", tag: "Defence \u00b7 S&P 500", when: "Pre-mkt", held: [{ etf: "IGWD", w: null }], estEps: "$7.19", estRev: "$19.37bn", actEps: null, actRev: null, px: null },
      ] },
      { date: "2026-07-22", rows: [
        { t: "GOOGL", n: "Alphabet", tag: "Mag 7 \u00b7 hyperscaler", when: "After close", held: [{ etf: "IGWD", w: "4.16%" }], estEps: "$2.86", estRev: "$116.53bn", guide: { est: "FY26 capex $175bn", act: null }, actEps: null, actRev: null, px: null },
        { t: "TSLA", n: "Tesla", tag: "Mag 7", when: "After close", held: [{ etf: "IGWD", w: "1.33%" }], estEps: "$0.47", estRev: "$27.6bn", km: { l: "Deliveries", est: null, act: "480,126 +25%" }, note: "deliveries (2 Jul) ~74k above Street; rev = co-compiled consensus", actEps: null, actRev: null, px: null },
        { t: "TXN", n: "Texas Instruments", tag: "Chips \u00b7 S&P 500", when: null, held: [{ etf: "IGWD", w: null }], estEps: "$1.92", estRev: "$5.24bn", note: "industrial-cycle bellwether", actEps: null, actRev: null, px: null },
        { t: "IBM", n: "IBM", tag: "AI/software \u00b7 Dow", when: null, held: [{ etf: "IGWD", w: null }], estEps: "$3.02", estRev: "$17.86bn", actEps: "$2.93 prelim", actRev: "$17.2bn prelim", px: "-25.2%", note: "prelim miss 14 Jul; full report 22 Jul" },
        { t: "NOW", n: "ServiceNow", tag: "AI/software \u00b7 S&P 500", when: "After close", held: [{ etf: "IGWD", w: null }], estEps: "$0.86", estRev: "$3.82bn subs", km: { l: "cRPO growth", est: ">19.5%", act: null }, note: "rev = subscription guide", actEps: null, actRev: null, px: null },
      ] },
      { date: "2026-07-23", rows: [
        { t: "INTC", n: "Intel", tag: "Chips \u00b7 Nasdaq 100", when: "After close", held: [{ etf: "IGWD", w: null }], estEps: "$0.10", estRev: "$14.4bn", guide: { est: "co guide $13.8\u201314.8bn \u00b7 EPS $0.20", act: null }, note: "consensus +138.5% y/y", actEps: null, actRev: null, px: null },
        { t: "BX", n: "Blackstone", tag: "Asset mgr \u00b7 S&P 500", when: null, held: [{ etf: "IGWD", w: null }], estEps: "$1.34", estRev: null, actEps: null, actRev: null, px: null },
      ] },
      { date: "2026-07-24", rows: [
        { t: "SLB", n: "SLB (Schlumberger)", tag: "Oil services \u00b7 S&P 500", when: "Pre-mkt", held: [{ etf: "IGWD", w: null }], estEps: "$0.52", estRev: null, guide: { est: "intl rev +mid-high SD \u00b7 NAm flat", act: null }, note: "consensus \u221229.7% y/y", actEps: null, actRev: null, px: null },
      ] },
    ] },
  ],
  srcs: [
    { name: "CNBC week ahead", url: "https://www.cnbc.com/2026/07/17/stock-market-next-week-outlook-for-july-20-24-2026.html" },
    { name: "Tech Times (banks, IBM prelim)", url: "https://www.techtimes.com/articles/320491/20260714/all-five-major-banks-beat-estimates-jpmorgan-posts-highest-profit-us-history.htm" },
    { name: "Goldman Sachs 8-K", url: "https://www.sec.gov/Archives/edgar/data/0000886982/000088698226000294/a2q26gsearningsresults.htm" },
    { name: "CNBC (Morgan Stanley)", url: "https://www.cnbc.com/2026/07/15/morgan-stanley-ms-earnings-q2-2026-.html" },
    { name: "ASML 6-K", url: "https://www.sec.gov/Archives/edgar/data/0000937966/000162828026048235/pressreleasefinancialresul.htm" },
    { name: "TradingKey (TSMC)", url: "https://www.tradingkey.com/analysis/stocks/us-stocks/262036881-tsmc-tsm-breaks-q2-2026-records-tradingkey" },
    { name: "Alphastreet (SCHW, TXN)", url: "https://news.alphastreet.com/charles-schwab-schw-q2-2026-preview-eps-est-1-55-reports-july-21/" },
    { name: "IG (IBM prelim)", url: "https://www.ig.com/uk/trading-strategies/ibm-share-price-earnings-miss-q2-2026-260715" },
    { name: "ts2 (ServiceNow)", url: "https://ts2.tech/en/servicenow-stock-slides-as-ibm-budget-warning-turns-july-earnings-into-a-core-growth-test/" },
    { name: "Zacks/Yahoo (TSLA, INTC, VZ, SLB)", url: "https://finance.yahoo.com/markets/stocks/articles/tesla-tsla-reports-next-week-140020290.html" },
    { name: "Yahoo (GOOGL)", url: "https://finance.yahoo.com/markets/stocks/articles/alphabet-q2-earnings-preview-expect-134252050.html" },
    { name: "Barchart (LMT)", url: "https://www.barchart.com/story/news/3115438/what-to-expect-from-lockheed-martins-next-quarterly-earnings-report" },
    { name: "Nasdaq (RTX)", url: "https://www.nasdaq.com/market-activity/stocks/rtx/earnings" },
    { name: "MarketBeat (KO)", url: "https://www.marketbeat.com/stocks/NYSE/KO/earnings/" },
    { name: "Yahoo (JPM results)", url: "https://finance.yahoo.com/markets/stocks/articles/jpmorgan-crushes-q2-estimates-record-123820712.html" },
    { name: "TradingKey (JPM/GS previews)", url: "https://www.tradingkey.com/analysis/stocks/us-stocks/262028603-goldman-sachs-gs-q2-2026-earnings-preview-triangle-breakout-1067-tradingkey" },
    { name: "TechTimes (MS preview)", url: "https://www.techtimes.com/articles/320542/20260715/morgan-stanley-q2-arrives-goldman-record-ibm-crash-raise-stakes-wealth-giant.htm" },
    { name: "TradingKey (TSMC preview)", url: "https://www.tradingkey.com/analysis/stocks/us-stocks/262031904-tsmc-tsm-stock-forecast-july-15-2026-june-revenue-q2-earnings-tradingkey" },
    { name: "Yahoo (COF preview)", url: "https://finance.yahoo.com/markets/stocks/articles/earnings-preview-capital-one-cof-140008572.html" },
    { name: "Hudson Labs (KO & VZ previews, incl VZ EBITDA)", url: "https://www.hudson-labs.com/research/verizon-vz-q2-2026-earnings-preview" },
    { name: "Barchart (RTX)", url: "https://www.barchart.com/story/news/3113873/what-to-expect-from-rtx-corporation-s-q2-2026-earnings-report" },
    { name: "Barchart (NOW)", url: "https://www.barchart.com/story/news/3052357/servicenow-s-q2-2026-earnings-what-to-expect" },
    { name: "Tesla IR (co-compiled consensus)", url: "https://ir.tesla.com/press-release/earnings-consensus-second-quarter-2026" },
    { name: "Yahoo (BX preview)", url: "https://finance.yahoo.com/markets/stocks/articles/earnings-preview-expect-blackstones-report-125257138.html" },
    { name: "Yahoo (INTC preview)", url: "https://finance.yahoo.com/markets/stocks/articles/earnings-preview-expect-intels-report-131017775.html" },
    { name: "ASML (Q2 2026 release)", url: "https://www.asml.com/en/news/press-releases/2026/q2-2026-financial-results" },
    { name: "Tesla IR (Q2 deliveries)", url: "https://ir.tesla.com/press-release/tesla-second-quarter-2026-production-deliveries-and-deployments" },
    { name: "Yahoo (GS record equities)", url: "https://finance.yahoo.com/markets/stocks/articles/goldman-sachs-q2-2026-earnings-120234207.html" },
    { name: "Yahoo (MS record quarter)", url: "https://finance.yahoo.com/markets/stocks/articles/morgan-stanley-q2-2026-earnings-115242115.html" },
    { name: "MSCI World factsheet (IGWD weights)", url: "https://www.msci.com/documents/10199/255599/msci-world-index.pdf" },
    { name: "BlackRock EMEE factsheet (TSMC weight)", url: "https://www.blackrock.com/lu/individual/literature/fact-sheet/emee-ishares-emerging-markets-equity-enhanced-active-ucits-etf-fund-fact-sheet-en-lu.pdf" },
  ],
};
