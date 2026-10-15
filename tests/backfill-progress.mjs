// The 2020-backfill checklist (backfill/checklist.json) is the measure of "complete
// since 2020". Guards: every checklist row is well-formed; a PRESENT event links to a
// real Wire record of THAT entity; a MISSING event carries the source it was found
// in; a REJECTED event says why. Ratchets (raise when progress is made — never lower):
// the number of present events and of built checklists can only grow.
import { loadChecklist, progress, recordById } from "../scripts/backfill-progress.mjs";
import { check, finish } from "./lib.mjs";

const MIN_PRESENT = 447;   // present (linked) events across built checklists
const MIN_BUILT = 51;      // entities whose 2020→today checklist has been researched

const cl = loadChecklist();
const DATE = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const bad = [];
for (const [id, e] of Object.entries(cl.entities || {})) {
  if (!["manager", "hf"].includes(e.kind) || !e.name || typeof e.priority !== "number" || !["built", "todo"].includes(e.status)) bad.push(`${id}: entity fields`);
  const keys = new Set();
  for (const v of e.events || []) {
    const tag = `${id}/${v.key}`;
    if (!v.key || keys.has(v.key)) bad.push(`${tag}: missing/duplicate key`); keys.add(v.key);
    if (!DATE.test(String(v.date || ""))) bad.push(`${tag}: date "${v.date}"`);
    if (v.status === "present") {
      const r = recordById.get(v.recordId);
      if (!r) bad.push(`${tag}: recordId ${v.recordId} not in data`);
      // A merged club deal (R39m) belongs to every firm that is a party to it.
      else if (r.managerId !== id && r.hfId !== id && r.sponsorId !== id && !(r.lenders || []).some((l) => l.managerId === id)) bad.push(`${tag}: ${v.recordId} belongs to another entity`);
    } else if (v.status === "missing") {
      if (!/^https?:\/\//.test(String(v.source || ""))) bad.push(`${tag}: missing event without a source URL`);
    } else if (v.status === "rejected") {
      if (!v.note) bad.push(`${tag}: rejected without a note`);
    } else bad.push(`${tag}: status "${v.status}"`);
  }
  if (e.status === "built" && !(e.events || []).length) bad.push(`${id}: built but empty`);
}
check(bad.length === 0, `checklist rows are well-formed and every present event links to that entity's record${bad.length ? ` (${bad.slice(0, 6).join("; ")})` : ""}`);
const p = progress(cl);
check(p.present >= MIN_PRESENT, `backfill does not regress: ${p.present} present events ≥ ${MIN_PRESENT} (${p.pct}% of ${p.events} listed)`);
check(p.built >= MIN_BUILT, `built checklists do not shrink: ${p.built} ≥ ${MIN_BUILT} of ${p.entities} priority entities`);
finish();
