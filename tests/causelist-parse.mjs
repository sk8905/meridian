// /api/causelist reads the PUBLIC Rolls Building daily cause list on the Court and
// Tribunal Hearings service (CaTH) for the Restructuring hub's Hearings card. Parsers
// run against saved slices of the real pages (tests/fixtures/cath-rolls-*.html, fetched
// 2026-10-15; personal-bankruptcy rows removed from the list slice).
import fs from "node:fs";
import { check, checkEq, finish } from "./lib.mjs";
globalThis.caches = { default: { match: async () => null, put: async () => {} } };
const W = await import("../src/index.js");
const fx = (f) => fs.readFileSync(new URL(`./fixtures/${f}`, import.meta.url), "utf8");

const arts = W.cathParseSummary(fx("cath-rolls-summary.html"));
checkEq(arts.length, 1, "summary page → only the Rolls Building daily cause list (Interim Applications list skipped)");
check(arts[0] && /^https:\/\/www\.court-tribunal-hearings\.service\.gov\.uk\/business-and-property-division-rolls-building-daily-cause-list\?artefactId=1f12f118/.test(arts[0].href), `list link resolves to an absolute CaTH URL (${arts[0] && arts[0].href})`);
checkEq(arts[0] && arts[0].date, "2026-10-15", "list date read from the link title");

const p = W.cathParseList(fx("cath-rolls-list.html"));
checkEq(p.listDate, "2026-10-15", "list page: 'List for' date → ISO");
check(/15 October 2026 at 11:21am/.test(p.updated || ""), `list page: last-updated stamp (${p.updated})`);
const icc = p.sections.find((s) => s.name === "Insolvency and Companies Court");
check(icc && icc.rows.length >= 10, `Insolvency and Companies Court table parses (${icc && icc.rows.length} rows)`);
const wu = p.sections.find((s) => s.name === "Companies Winding Up");
check(wu && wu.rows.length === 0, "a 'No hearings scheduled' list parses as an empty section");
const r0 = icc.rows[0];
checkEq(r0.caseNo, "CR-2025-001741", "case number column");
checkEq(r0.caseName, "Hunt Commercial Property Limited", "case name column");
checkEq(r0.type, "Pre trial review", "hearing type column");
checkEq(r0.time, "10:30am", "time column");
check(icc.rows.some((r) => r.caseName === "Argon Consulting & Management Ltd"), "HTML entities decoded in case names");

const rows = W.cathCompanyRows(p);
check(rows.length === icc.rows.length && rows.every((r) => r.list === "Insolvency and Companies Court"), `company rows = the ICC company matters (${rows.length})`);
check(rows.every((r) => !/^BR-/.test(r.caseNo || "")), "no personal-bankruptcy (individual) rows");
// A personal bankruptcy row is dropped even when present; an rx hearing elsewhere is kept.
const synth = { sections: [
  { name: "Insolvency and Companies Court", rows: [{ caseNo: "BR-2025-000001", caseName: "An Individual", type: "Bankruptcy application" }] },
  { name: "Business List", rows: [{ caseNo: "CR-2026-000001", caseName: "Plan Co Limited", type: "Sanction hearing" }, { caseNo: "BL-2026-000002", caseName: "A v B", type: "Trial" }] },
] };
const sr = W.cathCompanyRows(synth);
check(sr.length === 1 && sr[0].rx === "sanction" && sr[0].list === "Business List", `filter: individuals dropped, a sanction hearing in another list kept (${JSON.stringify(sr.map((r) => r.caseName))})`);
checkEq(W.cathRxKind("Convening hearing"), "convening", "rx kind: convening");
checkEq(W.cathRxKind("Application", "Re X: Part 26A restructuring plan"), "plan", "rx kind: Part 26A plan");
checkEq(W.cathRxKind("Companies application", "Scheme of arrangement"), "scheme", "rx kind: scheme");
checkEq(W.cathRxKind("Companies application", "Vapouround Group Holdings Limited"), null, "rx kind: nothing inferred from a plain application");
finish();
