// apply-deal-results.mjs (audit 2026-10-21) — the one writer that turns researched
// wire-queue / law-firm items into database records. Its tag conversion must produce
// the compact deal-tags.js keys the Transactions filters read.
import { check, checkEq, finish } from "./lib.mjs";
import { compactTags } from "../scripts/apply-deal-results.mjs";

checkEq(JSON.stringify(compactTags({ country: "UK", sector: "TMT", amountKind: "financing", party: "Acme Ltd", partyRole: "borrower" })), JSON.stringify({ c: "UK", s: "TMT", a: "financing", p: "Acme Ltd", r: "borrower" }), "long tag names → compact keys");
checkEq(JSON.stringify(compactTags({ sector: "Diversified", managerMA: true })), JSON.stringify({ s: "Diversified", m: 1, c: null, a: null }), "managerMA → m:1; unknown country / amount kind stay explicit nulls");
check(!("cs" in compactTags({ country: "UK", countrySource: null })), "an empty source is not written");
finish();
