// SEC 13F collector (scripts/collect-sec.mjs) — offline. It must pick each fund's two
// latest ORIGINAL 13F-HR filings, parse the information table into equity positions
// (options / debt lines excluded, pre-2023 $000 values scaled), and build the
// consensus panel only from funds filing for the panel's quarter.
import { pickFilings, parseInfoTable, buildPanel, quarterLabel } from "../scripts/collect-sec.mjs";
import { check, checkEq, finish } from "./lib.mjs";

const sub = { filings: { recent: {
  form: ["4", "13F-HR/A", "13F-HR", "13F-HR", "13F-HR"],
  accessionNumber: ["a0", "a1", "a2", "a3", "a4"],
  filingDate: ["2026-09-01", "2026-08-20", "2026-08-14", "2026-05-15", "2026-02-14"],
  reportDate: ["", "2026-06-30", "2026-06-30", "2026-03-31", "2025-12-31"],
} } };
const fs = pickFilings(sub);
checkEq(fs.map((f) => f.accession).join(","), "a2,a3", "the two latest ORIGINAL 13F-HR filings are picked (amendments and other forms skipped)");

const row = (cusip, name, value, shares, extra = "") => `<ns1:infoTable><ns1:nameOfIssuer>${name}</ns1:nameOfIssuer><ns1:cusip>${cusip}</ns1:cusip><ns1:value>${value}</ns1:value><ns1:shrsOrPrnAmt><ns1:sshPrnamt>${shares}</ns1:sshPrnamt><ns1:sshPrnamtType>SH</ns1:sshPrnamtType></ns1:shrsOrPrnAmt>${extra}</ns1:infoTable>`;
const xml = `<informationTable>${row("023135106", "AMAZON COM INC", 900, 10)}${row("023135106", "AMAZON COM INC", 100, 1)}${row("67066G104", "NVIDIA CORP", 500, 5, "<ns1:putCall>Call</ns1:putCall>")}${row("594918104", "MICROSOFT CORP", 300, 3)}</informationTable>`;
const t = parseInfoTable(xml, "2026-08-14");
checkEq(t.rows.map((r) => r.name).join("|"), "AMAZON COM INC|MICROSOFT CORP", "positions are aggregated by CUSIP, sorted by value, and option legs excluded");
checkEq(t.rows[0].value, 1000, "values from 2023-on filings are whole dollars");
checkEq(parseInfoTable(xml, "2022-11-14").rows[0].value, 1000000, "values from pre-2023 filings are scaled from $000");
checkEq(t.total, 1800, "the filing total includes every line");

const F = (id, rows, prevRows, asOf = "2026-06-30") => ({ id, name: id.toUpperCase(), cur: { asOf, src: `https://www.sec.gov/Archives/edgar/data/1/${id}-index.htm`, rows }, prev: prevRows ? { rows: prevRows } : null });
const R = (cusip, name, value, shares) => ({ cusip, name, value, shares });
const funds = [
  F("a", [R("AMZN", "Amazon", 900, 10), R("MSFT", "Microsoft", 500, 5)], [R("MSFT", "Microsoft", 500, 5), R("META", "Meta", 400, 4)]),
  F("b", [R("AMZN", "Amazon", 800, 8), R("MSFT", "Microsoft", 100, 1)], [R("AMZN", "Amazon", 100, 2), R("META", "Meta", 300, 3)]),
  F("c", [R("MSFT", "Microsoft", 700, 7)], null),
  F("old", [R("AMZN", "Amazon", 999, 9)], null, "2026-03-31"),
];
const p = buildPanel(funds, "2026-06-30", { tick: { AMZN: "AMZN", MSFT: "MSFT", META: "META" } });
checkEq(p.fundsCounted, 3, "only funds filing for the panel's quarter count");
checkEq(p.consensus[0].t, "MSFT", "consensus ranks by how many funds hold it in their top 20 (MSFT: 3 funds)");
check(/3 of 3 tracked funds/.test(p.consensus[0].note) && /^https:\/\/www\.sec\.gov\//.test(p.consensus[0].src), "a consensus row states the count over the filings and cites an EDGAR filing");
const buy = p.moves.find((m) => m.dir === "buy");
check(buy && buy.t === "AMZN" && /2 of 3/.test(buy.note), "most-added = new or >50% more shares at the most funds (AMZN: new at A, 4× shares at B)");
const sell = p.moves.find((m) => m.dir === "sell");
check(sell && sell.t === "META", "most-sold = exited or cut by more than half at the most funds (META exited at A and B)");
checkEq(quarterLabel("2026-06-30"), "Q2 2026", "quarter label from the period end");
finish();
