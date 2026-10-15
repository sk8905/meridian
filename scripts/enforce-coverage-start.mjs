// =============================================================================
// enforce-coverage-start.mjs — the app covers events from 1 January 2020 onwards
// (owner rule 2026-10-15, HOUSE_STYLE R7b). Removes every DATED feed item before
// COVERAGE_START from the data modules, and keeps their references consistent:
//   credit deals            → record removed, its deal-tags entry removed, its
//                             backfill/deal-parties.json entry marked deleted
//   credit intel            → record removed
//   credit commitments      → LP-commitment rows dated before 2020 removed
//   managers[].webNews/news → pre-2020 press items dropped from the profile
//   legal items             → law-firm wire items dated before 2020 removed
//   backfill/checklist.json → an event pointing at a removed record becomes
//                             "rejected" (outside coverage), never a dangling link
// Profile FACTS are not feed items and stay: a fund's vintage, a firm's `founded`
// year, case law (judgments are cited law, not coverage events).
// Re-runnable and idempotent (scripts/lib/datafile.mjs record-level edits): routines
// run it after appending; tests/data-integrity.mjs fails on any pre-2020 item.
//   node scripts/enforce-coverage-start.mjs [--dry-run]
// =============================================================================
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { readRecords, updateRecords, deleteRecords } from "./lib/datafile.mjs";

export const COVERAGE_START = "2020-01-01";
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CREDIT = path.join(ROOT, "credit", "js", "data.js");
const LEGAL = path.join(ROOT, "legal", "js", "data.js");
const TAGS = path.join(ROOT, "credit", "js", "deal-tags.js");
const PARTIES = path.join(ROOT, "backfill", "deal-parties.json");
const CHECKLIST = path.join(ROOT, "backfill", "checklist.json");
const DRY = process.argv.includes("--dry-run");
// A date before the floor ("2019-06-05", "2018-06", "2017"). Undated items are left to
// the data-integrity ratchets, not removed here.
export const beforeCoverage = (d) => typeof d === "string" && /^\d{4}/.test(d) && d.slice(0, 10) < COVERAGE_START.slice(0, Math.min(10, d.length));

function main() {
  const out = {};
  const gone = new Set();
  // Records with ids.
  for (const [file, name] of [[CREDIT, "deals"], [CREDIT, "intel"], [LEGAL, "items"]]) {
    const ids = readRecords(file, name).map((r) => r.obj).filter((o) => beforeCoverage(o.date)).map((o) => o.id);
    ids.forEach((id) => gone.add(id));
    out[name] = ids.length ? deleteRecords(file, name, ids, { dryRun: DRY }) : 0;
    if (ids.length) out[name + "Ids"] = ids.join(" ");
  }
  // LP commitments carry no id: remove the dated rows by their span.
  {
    const lines = fs.readFileSync(CREDIT, "utf8").split("\n");
    const recs = readRecords(CREDIT, "commitments").filter((r) => beforeCoverage(r.obj.date));
    for (const r of recs.reverse()) lines.splice(r.index, r.end - r.index + 1);
    out.commitments = recs.length;
    if (recs.length && !DRY) fs.writeFileSync(CREDIT, lines.join("\n"));
  }
  // Manager press items.
  let press = 0;
  updateRecords(CREDIT, "managers", (m) => {
    let ch = false;
    for (const k of ["webNews", "news"]) if (Array.isArray(m[k])) {
      const keep = m[k].filter((w) => !beforeCoverage(w && w.date));
      if (keep.length !== m[k].length) { press += m[k].length - keep.length; m[k] = keep; ch = true; }
    }
    return ch;
  }, { dryRun: DRY });
  out.managerPress = press;
  // Deal tags of removed deals.
  let tags = fs.readFileSync(TAGS, "utf8"), nt = 0;
  for (const id of gone) if (/^d\d+$/.test(id)) tags = tags.replace(new RegExp(`^  ${id}: .*\\n`, "m"), () => (nt++, ""));
  if (nt && !DRY) fs.writeFileSync(TAGS, tags);
  out.tags = nt;
  // The deal-party audit keeps the removed deals as deletes (so apply-parties never re-adds them).
  if (fs.existsSync(PARTIES)) {
    const j = JSON.parse(fs.readFileSync(PARTIES, "utf8"));
    j.deletes = j.deletes || [];
    let n = 0;
    for (const e of j.deals) if (gone.has(e.id) && !j.deletes.some((x) => x.id === e.id)) {
      j.deletes.push({ id: e.id, reason: `dated before ${COVERAGE_START} — outside the app's coverage (owner rule 2026-10-15)` }); e.deleted = true; e.review = null; n++;
    }
    if (n && !DRY) fs.writeFileSync(PARTIES, JSON.stringify(j, null, 0).replace(/\},\{"id"/g, '},\n{"id"'));
    out.auditDeletes = n;
  }
  // Checklist events linked to a removed record.
  if (fs.existsSync(CHECKLIST)) {
    const src = fs.readFileSync(CHECKLIST, "utf8"), j = JSON.parse(src);
    let n = 0;
    for (const e of Object.values(j.entities || {})) for (const v of e.events || []) {
      if (v.recordId && gone.has(v.recordId)) { v.status = "rejected"; v.note = `Record ${v.recordId} removed: dated before ${COVERAGE_START}, outside the app's coverage (owner rule 2026-10-15)`; delete v.recordId; n++; }
    }
    if (n && !DRY) fs.writeFileSync(CHECKLIST, JSON.stringify(j, null, 2) + "\n");
    out.checklist = n;
  }
  console.log(`enforce-coverage-start${DRY ? " (dry run)" : ""}:`, out);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
