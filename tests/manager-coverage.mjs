// Manager-profile coverage guard (pure logic — no browser / no egress).
//
// The manager/profile surface must carry history back to 2020 AND current activity
// for the covered roster. Coverage grows through the refresh routine's MANDATORY
// whole-roster historical backfill (docs/refresh-routines.md → "Manager-profile
// depth"), driven by scripts/manager-coverage.mjs. This spec guards the mechanism
// and the no-fabrication discipline on the records that feed profiles, and locks in
// the depth so a later edit cannot silently strip a profile's history:
//   (1) the coverage worklist tool exists;
//   (2) every profile-feeding record (a deal/intel with a headline, and every
//       manager webNews item) has a real, non-future date and a real source URL —
//       the "never fabricate; real URL + date" invariant, enforced on exactly the
//       records that render on the Managers lane / profile pages;
//   (3) the backfilled reference profiles retain depth (an event reaching ≤2021 and
//       a recent one), proving the pipeline produced genuine 2020→present coverage.
import { managers, deals, intel } from "../credit/js/data.js";
import { check, checkEq, finish, ROOT } from "./lib.mjs";
import fs from "node:fs";
import path from "node:path";

// (1) the deterministic worklist tool is present.
const tool = path.join(ROOT, "scripts", "manager-coverage.mjs");
check(fs.existsSync(tool), "coverage: scripts/manager-coverage.mjs exists (the backfill worklist tool)");

const dateOk = (d) => /^\d{4}-\d{2}(-\d{2})?$/.test(d || "");
const urlOk = (u) => /^https?:\/\//.test(u || "");
const TODAY = new Date().toISOString().slice(0, 10);
const yearOf = (d) => Number(String(d || "").slice(0, 4));

// (2) profile-feeding records carry a real, non-future date + real source URL.
const badDate = [], badUrl = [], future = [];
for (const [coll, rows] of [["deals", deals], ["intel", intel]])
  for (const r of rows || [])
    if (r && r.headline) { // the headlined records are what render on the wire / profile
      if (!dateOk(r.date)) badDate.push(`${coll}:${r.id}`);
      if (!urlOk(r.sourceUrl)) badUrl.push(`${coll}:${r.id}`);
      if (r.date && r.date.slice(0, 10) > TODAY) future.push(`${coll}:${r.id}`);
    }
for (const m of managers)
  if (Array.isArray(m.webNews))
    for (const [i, w] of m.webNews.entries()) {
      if (!dateOk(w.date)) badDate.push(`webNews ${m.id}[${i}]`);
      if (!urlOk(w.url)) badUrl.push(`webNews ${m.id}[${i}]`);
      if (w.date && w.date.slice(0, 10) > TODAY) future.push(`webNews ${m.id}[${i}]`);
    }
check(badDate.length === 0, `coverage: every profile-feeding record has a real YYYY-MM[-DD] date${badDate.length ? ` (bad: ${badDate.slice(0, 8).join(", ")})` : ""}`);
check(badUrl.length === 0, `coverage: every profile-feeding record has a real source URL${badUrl.length ? ` (missing: ${badUrl.slice(0, 8).join(", ")})` : ""}`);
check(future.length === 0, `coverage: no profile-feeding record is future-dated${future.length ? ` (future: ${future.slice(0, 8).join(", ")})` : ""}`);

// (3) depth lock on the backfilled reference profiles — each must keep at least one
// event reaching ≤2021 (history) and one dated ≥2024 (current). These are the firms
// the first backfill pass covered; the routine extends the rest of the roster over
// time. A regression here means a profile's hard-won history was deleted.
const events = new Map(); // managerId -> [years]
const push = (mid, d) => { if (!mid || !d) return; (events.get(mid) || events.set(mid, []).get(mid)).push(yearOf(d)); };
for (const d of deals) push(d.managerId, d.date);
for (const i of intel) push(i.managerId, i.date);
for (const m of managers) if (Array.isArray(m.webNews)) for (const w of m.webNews) push(m.id, w.date);
const REF = { m67: "Anchorage Capital Group", m113: "White Oak Global Advisors", m146: "SVP (Strategic Value Partners)", m174: "Northleaf Capital Partners", m181: "Jefferies Credit Partners" };
for (const [id, name] of Object.entries(REF)) {
  const ys = events.get(id) || [];
  check(ys.some((y) => y <= 2021) && ys.some((y) => y >= 2024),
    `coverage: ${name} keeps history (≤2021) and current activity (≥2024)${ys.length ? ` (span ${Math.min(...ys)}–${Math.max(...ys)})` : " (NO EVENTS)"}`);
}

finish();
