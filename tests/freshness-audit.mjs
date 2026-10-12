// Freshness-audit tool guard (pure logic — no browser / no egress).
//
// scripts/freshness-audit.mjs is the deterministic staleness detector the autonomous
// refresh/backfill routines run FIRST, so they get a concrete worklist instead of
// silently no-op'ing. This spec proves the tool exists, runs, and emits a well-formed
// machine-readable audit whose staleness verdict matches the committed data — so a
// routine can trust its exit code and JSON to decide what to resolve.
import { check, finish, ROOT } from "./lib.mjs";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const tool = path.join(ROOT, "scripts", "freshness-audit.mjs");
check(fs.existsSync(tool), "freshness-audit: scripts/freshness-audit.mjs exists");

// Run it as JSON with a fixed stale window so the assertions are deterministic.
const r = spawnSync(process.execPath, [tool, "--json", "--stale=7"], { encoding: "utf8" });
let j = null; try { j = JSON.parse(r.stdout); } catch { /* */ }
check(!!j, "freshness-audit: --json emits parseable JSON");

if (j) {
  // Shape: surfaces[] each with key/label/count/newestDate/ageDays/stale.
  const keys = new Set((j.surfaces || []).map((s) => s.key));
  check(["deals", "intel", "hedge_intel", "legal_items", "legal_cases", "legal_rx"].every((k) => keys.has(k)),
    `freshness-audit: audits every content surface (${[...keys].join(", ")})`);
  const shapeOk = (j.surfaces || []).every((s) => typeof s.key === "string" && typeof s.count === "number" && typeof s.stale === "boolean" && (s.ageDays === null || typeof s.ageDays === "number"));
  check(shapeOk, "freshness-audit: every surface row is well-formed (key / count / ageDays / stale)");

  // The staleness verdict must agree with the data: a surface is stale iff its newest
  // dated item is older than the window (or it has none). Re-derive independently.
  const DAY = 86400000, now = Date.now();
  const recompute = async () => {
    const CR = await import("../credit/js/data.js");
    const LG = await import("../legal/js/data.js");
    const msOf = (d) => { const s = /^\d{4}-\d{2}$/.test(d) ? d + "-01" : String(d || "").slice(0, 10); const t = Date.parse(s); return Number.isNaN(t) ? 0 : t; };
    const newest = (rows, f = "date") => rows.reduce((m, x) => Math.max(m, msOf(x && x[f])), 0);
    const src = { deals: CR.deals, intel: CR.intel, hedge_intel: CR.HEDGE_INTEL, legal_items: LG.items, legal_cases: LG.cases, legal_rx: LG.restructurings };
    const out = {};
    for (const [k, rows] of Object.entries(src)) { const ms = newest(rows); out[k] = ms === 0 ? true : Math.round((now - ms) / DAY) > 7; }
    return out;
  };
  const expect = await recompute();
  const mismatches = (j.surfaces || []).filter((s) => s.stale !== expect[s.key]).map((s) => s.key);
  check(mismatches.length === 0, `freshness-audit: the stale verdict matches the committed data${mismatches.length ? ` (mismatch: ${mismatches.join(", ")})` : ""}`);

  // The Home briefing is audited in HOURS (it restamps every ~2h run). Well-formed,
  // and when stale it must raise a "briefing" action so a run can't silently skip it.
  check(j.briefing && j.briefing.key === "briefing" && typeof j.briefing.stale === "boolean" && (j.briefing.ageHours === null || typeof j.briefing.ageHours === "number"),
    "freshness-audit: the Home briefing is audited (hours-based) and well-formed");

  // ok === "no actions", and a stale surface (or coverage deficit) must raise an action.
  check(j.ok === (j.actions.length === 0), "freshness-audit: ok is true exactly when there are no actions");
  const actionSurfaces = new Set(j.actions.map((a) => a.surface));
  const staleSurfaces = (j.surfaces || []).filter((s) => s.stale).map((s) => s.key);
  check(staleSurfaces.every((k) => actionSurfaces.has(k)), "freshness-audit: every stale surface raises a resolve-action");
  if (j.briefing && j.briefing.stale) check(actionSurfaces.has("briefing"), "freshness-audit: a stale briefing raises a resolve-action");

  // When coverage work remains, it carries the rotating backfill worklist for the routine.
  if (actionSurfaces.has("coverage")) check(Array.isArray(j.worklist) && j.worklist.length > 0, "freshness-audit: a coverage action ships the backfill worklist");

  // Exit code: 0 when clean, 1 when action is needed — so a routine/CI can branch on it.
  check(r.status === (j.ok ? 0 : 1), `freshness-audit: exit code reflects the verdict (ok=${j.ok} → exit ${r.status})`);
}

finish();
