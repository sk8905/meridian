// GLEIF LEI candidate collector (pure logic, no egress). Names are matched after
// stripping legal-form suffixes; only an exact normalised match is "exact", and nothing
// is ever applied to the data by the collector (candidates only — a human/routine
// confirms jurisdiction + parent before writing an `lei`).
import { normName, classify, pickRecord } from "../scripts/collect-gleif.mjs";
import { check, checkEq, finish } from "./lib.mjs";
import fs from "node:fs";

checkEq(normName("Attestor Limited"), normName("Attestor"), "gleif: legal-form suffix ignored (Limited)");
checkEq(normName("Cross Ocean Partners Management LP"), normName("Cross Ocean Partners"), "gleif: Partners/Management/LP ignored");
checkEq(normName("HPS Investment Partners (BlackRock)"), normName("HPS Investment Partners, LLC"), "gleif: parenthetical owner ignored");
check(normName("Arini") !== normName("Arini Capital Management Two") , "gleif: an extra word is not an exact match");

const rec = (lei, name, j) => ({ id: lei, attributes: { lei, entity: { legalName: { name }, jurisdiction: j, legalAddress: { country: j.slice(0, 2) }, status: "ACTIVE", legalForm: { id: "H0PO" } }, registration: { status: "ISSUED" } } });
const c = classify("Attestor", [rec("2138001", "ATTESTOR CAPITAL HOLDINGS LIMITED", "GB"), rec("2138002", "Attestor Limited", "GB")]);
checkEq(c[0].lei, "2138002", "gleif: the exact match is ranked first");
checkEq(c[0].match, "exact", "gleif: exact match flagged");
checkEq(c[1].match, "near", "gleif: a longer legal name stays 'near' (never auto-applied)");
checkEq(pickRecord(rec("X", "Y Ltd", "LU")).jurisdiction, "LU", "gleif: jurisdiction read");

const src = fs.readFileSync(new URL("../scripts/collect-gleif.mjs", import.meta.url), "utf8");
check(/PACE_MS = 1[0-9]{3}/.test(src), "gleif: paced at ≥ 1s between requests");
check(!/updateRecords|writeFileSync/.test(src), "gleif: the collector never writes the data files");
finish();
