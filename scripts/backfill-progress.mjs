// =============================================================================
// backfill-progress.mjs — "complete since 2020", measured against a CHECKLIST.
//
// manager-coverage.mjs asks "does this profile have ANY item from ≤2020?" — a profile
// with one 2020 CLO passes while missing every flagship fund close. This measures
// completeness the honest way: backfill/checklist.json lists, per priority entity,
// the major public events since 2020 (each with a source + date, researched up front),
// and each event is either PRESENT (linked to the Wire record that carries it) or
// MISSING. % complete = present ÷ listed, over the entities whose checklist is built.
//
// The 2020-backfill routine works off this script's worklist: FILL the built
// entities' missing events (verify → append record → link recordId), then BUILD the
// next unbuilt entities' checklists. Read-only unless --link is passed.
//
// Usage:
//   node scripts/backfill-progress.mjs                 # summary + next worklist
//   node scripts/backfill-progress.mjs --json
//   node scripts/backfill-progress.mjs --size=4        # worklist size (entities)
//   node scripts/backfill-progress.mjs --link          # auto-link missing events whose
//                                                      # source URL a record already cites
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as C from "../credit/js/data.js";
import { nicheIndex, TIER_RANK } from "./lib/niche.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const CHECKLIST = path.join(HERE, "..", "backfill", "checklist.json");
const args = process.argv.slice(2);
const opt = (n, d) => { const a = args.find((x) => x.startsWith(n + "=")); return a ? a.slice(n.length + 1) : d; };

export function loadChecklist(file = CHECKLIST) { return JSON.parse(fs.readFileSync(file, "utf8")); }
const RECORDS = [...(C.deals || []), ...(C.intel || []), ...(C.HEDGE_INTEL || [])];
export const recordById = new Map(RECORDS.map((r) => [r.id, r]));
const normUrl = (u) => String(u || "").toLowerCase().replace(/^https?:\/\/(www\.)?/, "").split(/[?#]/)[0].replace(/\/+$/, "");

// Link missing events whose source URL is already cited by a record of that entity.
export function autoLink(cl) {
  let n = 0;
  for (const [id, e] of Object.entries(cl.entities)) {
    const mine = RECORDS.filter((r) => r.managerId === id || r.hfId === id);
    const byUrl = new Map(mine.map((r) => [normUrl(r.sourceUrl || r.url), r.id]));
    for (const ev of e.events || []) {
      if (ev.recordId || !ev.source) continue;
      const hit = byUrl.get(normUrl(ev.source));
      if (hit) { ev.recordId = hit; ev.status = "present"; n++; }
    }
  }
  return n;
}

export function progress(cl) {
  const rows = [];
  let listed = 0, present = 0, rejected = 0;
  for (const [id, e] of Object.entries(cl.entities)) {
    if (e.status !== "built") continue;
    const evs = e.events || [];
    const ok = evs.filter((v) => v.status === "present" && v.recordId && recordById.has(v.recordId)).length;
    const rej = evs.filter((v) => v.status === "rejected").length;
    const n = evs.length - rej;
    listed += n; present += ok; rejected += rej;
    rows.push({ id, name: e.name, kind: e.kind, priority: e.priority, listed: n, present: ok, missing: n - ok, pct: n ? Math.round((ok / n) * 100) : 100 });
  }
  const all = Object.keys(cl.entities).length, built = rows.length;
  return {
    entities: all, built, unbuilt: all - built,
    events: listed, present, missing: listed - present, rejected,
    pct: listed ? Math.round((present / listed) * 1000) / 10 : 0,
    rows: rows.sort((a, b) => a.pct - b.pct || a.priority - b.priority),
  };
}

// Next work: fill built entities that still have missing events (worst first), then
// build checklists NICHE-FIRST (scripts/lib/niche.mjs: European, ≤$15bn, 15%+
// strategies — the owner's actual universe), then by checklist priority. Core-niche
// managers not yet on the checklist are proposed as ADD (put the entity on the
// checklist with status "todo", then build it) — the original top-by-AUM priority
// list is kept, it just no longer outranks the niche.
const NICHE = nicheIndex(C.managers || [], C.funds || []);
const nicheRank = (id) => NICHE.get(id)?.rank ?? TIER_RANK.context;
const depth = new Map(); for (const r of RECORDS) if (r.managerId) depth.set(r.managerId, (depth.get(r.managerId) || 0) + 1);
export function worklist(cl, size = 4) {
  const p = progress(cl);
  const fill = p.rows.filter((r) => r.missing > 0).map((r) => ({ action: "fill", ...r }));
  const build = Object.entries(cl.entities).filter(([, e]) => e.status !== "built")
    .map(([id, e]) => ({ action: "build", id, name: e.name, kind: e.kind, priority: e.priority, niche: NICHE.get(id)?.tier || null }));
  const add = (C.managers || []).filter((m) => !cl.entities[m.id] && NICHE.get(m.id)?.tier === "core")
    .map((m) => ({ action: "add", id: m.id, name: m.name, kind: "manager", priority: Infinity, niche: "core" }));
  const next = [...build, ...add].sort((a, b) => nicheRank(a.id) - nicheRank(b.id) || a.priority - b.priority || (depth.get(a.id) || 0) - (depth.get(b.id) || 0) || a.name.localeCompare(b.name));
  return [...fill, ...next].slice(0, size);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const cl = loadChecklist();
  if (args.includes("--link")) { const n = autoLink(cl); fs.writeFileSync(CHECKLIST, JSON.stringify(cl, null, 1) + "\n"); console.error(`linked ${n} event(s) to existing records`); }
  const p = progress(cl), wl = worklist(cl, Math.max(1, parseInt(opt("--size", "4"), 10) || 4));
  if (args.includes("--json")) { console.log(JSON.stringify({ ...p, worklist: wl }, null, 2)); process.exit(0); }
  console.log(`2020 BACKFILL — checklist completeness`);
  console.log(`  ${p.built}/${p.entities} priority entities have a built checklist (${p.unbuilt} still to research)`);
  console.log(`  ${p.present}/${p.events} listed events present in Wire = ${p.pct}% complete${p.rejected ? ` (${p.rejected} rejected as unverifiable/out of scope)` : ""}\n`);
  for (const r of p.rows) console.log(`  ${String(r.pct).padStart(3)}%  ${r.present}/${r.listed}  ${r.name} [${r.id}]`);
  console.log(`\nNEXT WORKLIST:`);
  for (const w of wl) console.log(`  ${w.action.toUpperCase().padEnd(5)} ${w.name} [${w.id}]${w.action === "fill" ? ` — ${w.missing} missing event(s)` : w.action === "add" ? " — core niche, not on the checklist: add it (status todo), then research its 2020→today events" : ` — research its 2020→today event checklist${w.niche ? ` (niche: ${w.niche})` : ""}`}`);
}
