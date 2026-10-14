// Worker /api/eurates parsers — pure functions, no network. ecbCsvPairs reads the
// ECB Data Portal SDMX csvdata; boeCsvSeries reads the Bank of England IADB CSV
// ("08 Oct 2026,3.75,3.7332"); eurostatSeries reads Eurostat JSON-stat; euPoint
// turns a dated series into { value, asOf, chg1w, chg1m } (calendar-day lookback,
// no 1W/1M move for a monthly series).
import { ecbCsvPairs, boeCsvSeries, eurostatSeries, euPoint, EU_RATE_SERIES, EU_AAA_TENORS, EU_EXTRA_SERIES, isoWeekFriday, fredCsvPairs } from "../src/index.js";
import { check, checkEq, finish } from "./lib.mjs";

const ecb = `KEY,FREQ,BENCHMARK_ITEM,DATA_TYPE_EST,TIME_PERIOD,OBS_VALUE,OBS_STATUS
EST.B.EU000A2X2A25.WT,B,EU000A2X2A25,WT,2026-10-12,2.439,A
EST.B.EU000A2X2A25.WT,B,EU000A2X2A25,WT,2026-10-08,2.438,A
EST.B.EU000A2X2A25.WT,B,EU000A2X2A25,WT,2026-10-09,,A
EST.B.EU000A2X2A25.WT,B,EU000A2X2A25,WT,2026-09-11,2.189,A`;
const pairs = ecbCsvPairs(ecb);
checkEq(pairs.length, 3, "ecbCsvPairs: drops rows with no OBS_VALUE");
checkEq(pairs.map((p) => p[0]).join(","), "2026-09-11,2026-10-08,2026-10-12", "ecbCsvPairs: sorts ascending by TIME_PERIOD");
checkEq(ecbCsvPairs("").length, 0, "ecbCsvPairs: empty body → []");
checkEq(ecbCsvPairs("<html>error</html>").length, 0, "ecbCsvPairs: non-CSV body → []");

const pt = euPoint(pairs);
checkEq(pt.value, 2.439, "euPoint: latest value");
checkEq(pt.asOf, "2026-10-12", "euPoint: as-of is the latest observation's date");
check(Math.abs(pt.chg1w - 0.25) < 1e-9, `euPoint: 1W change vs the last observation on/before 7 days earlier (${pt.chg1w})`);
check(Math.abs(pt.chg1m - 0.25) < 1e-9, `euPoint: 1M change vs the last observation on/before 30 days earlier (${pt.chg1m})`);
const monthly = euPoint([["2026-08", 2.1], ["2026-09", 2.635]]);
check(monthly.value === 2.635 && monthly.chg1w === null && monthly.chg1m === null, "euPoint: a monthly series reports no 1W/1M move");
checkEq(euPoint([]).value, null, "euPoint: empty series → value null (never guessed)");

const boe = `DATE,IUDBEDR,IUDSOIA
08 Oct 2026,3.75,3.7332
09 Oct 2026,3.75,3.7331
12 Oct 2026,3.75,`;
const bs = boeCsvSeries(boe, ["IUDBEDR", "IUDSOIA"]);
checkEq(bs.IUDBEDR.length, 3, "boeCsvSeries: Bank Rate has three dated rows");
checkEq(bs.IUDSOIA.length, 2, "boeCsvSeries: a blank SONIA cell is skipped, not zero");
checkEq(bs.IUDBEDR[2][0], "2026-10-12", "boeCsvSeries: '12 Oct 2026' → ISO 2026-10-12");
checkEq(boeCsvSeries("", ["IUDBEDR"]).IUDBEDR.length, 0, "boeCsvSeries: empty body → empty series");

const js = { value: { 0: 187.4, 1: 191.5, 2: 195.9 }, dimension: { time: { category: { index: { "2025-Q2": 0, "2025-Q3": 1, "2026-Q2": 2 } } } } };
const es = eurostatSeries(js);
checkEq(es.map((p) => p.join(":")).join(","), "2025-Q2:187.4,2025-Q3:191.5,2026-Q2:195.9", "eurostatSeries: JSON-stat → ascending [period, value]");
checkEq(eurostatSeries({}).length, 0, "eurostatSeries: malformed payload → []");

check(EU_RATE_SERIES.every((s) => s.key && s.label && /^https:\/\//.test(s.href) && s.source), "EU_RATE_SERIES: every series carries a key, label, https source link and source name");
check(EU_RATE_SERIES.some((s) => s.key === "euribor3m" && /monthly/i.test(s.label)), "EU_RATE_SERIES: the Euribor tile is labelled as the monthly average it is");
checkEq(EU_AAA_TENORS.map((t) => t[0]).join(","), "3M,2Y,5Y,10Y,30Y", "EU_AAA_TENORS: matches the yield-curve panel's maturities");

// Extra gauges: ECB weekly ISO-week periods → that week's Friday; FRED fredgraph CSV.
checkEq(isoWeekFriday("2026-W41"), "2026-10-09", "isoWeekFriday: 2026-W41 → Fri 9 Oct 2026 (Eurosystem statement day)");
checkEq(isoWeekFriday("2026-W01"), "2026-01-02", "isoWeekFriday: 2026-W01 → Fri 2 Jan 2026");
checkEq(isoWeekFriday("2026-10-12"), "2026-10-12", "isoWeekFriday: a daily period passes through");
const wk = ecbCsvPairs(`KEY,FREQ,TIME_PERIOD,OBS_VALUE,TITLE_COMPL\nILM.W,W,2026-W41,5943911,"Euro area, Eurosystem"\nILM.W,W,2026-W40,5947826,"Euro area, Eurosystem"`);
checkEq(wk.map((p) => p.join(":")).join(","), "2026-10-02:5947826,2026-10-09:5943911", "ecbCsvPairs: weekly rows dated by their Friday, ascending");
const fr = fredCsvPairs("observation_date,VIXCLS\n2026-10-09,15.52\n2026-10-10,.\n2026-10-12,15.21");
checkEq(fr.map((p) => p.join(":")).join(","), "2026-10-09:15.52,2026-10-12:15.21", "fredCsvPairs: '.' (missing) rows dropped, never zero");
checkEq(fredCsvPairs("<html>520</html>").length, 0, "fredCsvPairs: non-CSV body → []");
check(EU_EXTRA_SERIES.every((s) => s.key && s.label && /^https:\/\//.test(s.href) && s.source), "EU_EXTRA_SERIES: every gauge carries a key, label, https source link and source name");
finish();
