// =============================================================================
// date-precision.mjs — stop placeholder days reading as real dates (review 2026-10-15).
//
// Some records only know their year (or month): they were stored as YYYY-01-01 /
// YYYY-MM-01, which the app printed as "1 Jan 2025" — false precision that also
// mis-sorts them. This pass, re-runnable and idempotent, does three evidence-based
// things to credit deals + intel and legal items:
//   1. URL day repair — when the record's day is a placeholder (the 1st) and its own
//      source URL encodes an exact publication day in the same year (businesswire
//      /news/home/20250930…, /2026/01/14/ paths), the date becomes that day.
//   2. Year / month precision — a YYYY-01-01 record with no such evidence is flagged
//      dateEstimated:true + datePrecision:"year" ("month" when its URL carries /YYYY/01/).
//   3. A legal item already flagged dateEstimated whose date is the 1st and whose URL
//      carries /YYYY/MM/ gets datePrecision:"month".
// The app renders these via fmtDateP (feed.js): "2025" · "Jan 2025" · "c. 14 Jan 2025".
//
// Usage: node scripts/date-precision.mjs [--dry-run]
// =============================================================================
import path from "node:path";
import { fileURLToPath } from "node:url";
import { updateRecords } from "./lib/datafile.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry-run");

export function urlDay(u) {
  const s = String(u || "");
  const m = s.match(/\/(20\d\d)\/(\d\d)\/(\d\d)\//) || s.match(/\/news\/home\/(20\d\d)(\d\d)(\d\d)\d{3,}\//) || s.match(/\/(20\d\d)-(\d\d)-(\d\d)[-/]/);
  if (!m) return null;
  const [y, mo, d] = [+m[1], +m[2], +m[3]];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}
export const urlMonth = (u) => { const m = String(u || "").match(/\/(20\d\d)\/(0[1-9]|1[0-2])\//) || String(u || "").match(/\/(20\d\d)-(0[1-9]|1[0-2])\//); return m ? `${m[1]}-${m[2]}` : null; };

export function fix(rec, url) {
  const d = String(rec.date || "");
  if (!/^\d{4}-\d{2}-01$/.test(d)) return false;
  const day = urlDay(url);
  if (day && day.slice(0, 4) === d.slice(0, 4) && day !== d && (d.endsWith("-01-01") || day.slice(0, 7) === d.slice(0, 7))) {
    rec.date = day; delete rec.dateEstimated; delete rec.datePrecision; return true;
  }
  if (rec.datePrecision) return false;
  if (d.endsWith("-01-01")) {
    rec.dateEstimated = true;
    rec.datePrecision = urlMonth(url) === d.slice(0, 7) ? "month" : "year";
    return true;
  }
  if (rec.dateEstimated && urlMonth(url) === d.slice(0, 7)) { rec.datePrecision = "month"; return true; }
  return false;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const credit = path.join(ROOT, "credit", "js", "data.js"), legal = path.join(ROOT, "legal", "js", "data.js");
  const n1 = updateRecords(credit, "deals", (r) => fix(r, r.sourceUrl), { dryRun: DRY });
  const n2 = updateRecords(credit, "intel", (r) => fix(r, r.sourceUrl), { dryRun: DRY });
  const n3 = updateRecords(legal, "items", (r) => fix(r, r.url), { dryRun: DRY });
  console.log(`date-precision: deals ${n1} · intel ${n2} · legal items ${n3}${DRY ? " (dry run)" : ""}`);
}
