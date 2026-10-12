// =============================================================================
// freshness-audit.mjs — the single deterministic staleness detector for Wire.
//
// One command that scans EVERY content surface built from the committed data
// modules and reports exactly what has gone stale, plus the manager-profile depth
// deficit — so the autonomous refresh/backfill routines get a concrete, machine-
// readable worklist instead of a vague "sweep for news" (which they were silently
// no-op'ing). It identifies the issue; the routine resolves it by WebSearch-sourcing
// VERIFIED, dated events for the surfaces/managers this prints, then appending them.
//
// Pure read over the committed data (credit/js/data.js, legal/js/data.js) + the
// manager-coverage scorer — no fetch, no writes, no state. Exit code is 0 when
// everything is fresh, 1 when any surface is stale or coverage is below target, so
// a routine (or CI) can branch on it.
//
// Usage:
//   node scripts/freshness-audit.mjs            # human report + exit code
//   node scripts/freshness-audit.mjs --json     # machine-readable {surfaces, coverage, worklist, actions}
//   node scripts/freshness-audit.mjs --stale=10 # override the staleness window (days; default 7)
// =============================================================================
import * as CR from "../credit/js/data.js";
import * as LG from "../legal/js/data.js";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => { const a = args.find((x) => x.startsWith(n + "=")); return a ? a.split("=")[1] : d; };
const STALE_DAYS = Math.max(1, parseInt(opt("--stale", "7"), 10) || 7);

const now = Date.now();
const msOf = (d) => { const s = /^\d{4}-\d{2}$/.test(d) ? d + "-01" : String(d || "").slice(0, 10); const t = Date.parse(s); return Number.isNaN(t) ? 0 : t; };
const ageDaysOf = (ms) => (ms ? Math.round((now - ms) / 86400000) : null);

// Newest dated record across one or more arrays, by the given date field(s).
function newest(rows, field = "date") {
  let best = 0;
  for (const r of rows || []) { const ms = msOf(r && r[field]); if (ms > best) best = ms; }
  return best;
}

// A content surface: its freshest item's age, and whether that breaches the window.
function surface(key, label, rows, field = "date") {
  const ms = newest(rows, field);
  const ageDays = ageDaysOf(ms);
  const newestDate = ms ? new Date(ms).toISOString().slice(0, 10) : null;
  const stale = ageDays == null || ageDays > STALE_DAYS;
  return { key, label, count: (rows || []).length, newestDate, ageDays, stale };
}

const SURFACES = [
  surface("deals", "Transactions (credit deals)", CR.deals),
  surface("intel", "Credit intel (fundraising / mandates / personnel)", CR.intel),
  surface("hedge_intel", "Hedge-fund intel", CR.HEDGE_INTEL),
  surface("legal_items", "Legal updates", LG.items),
  surface("legal_cases", "Case law", LG.cases),
  surface("legal_rx", "Restructurings", LG.restructurings),
];

// Manager-profile depth: borrow the authoritative scorer so the audit and the
// backfill worklist never drift. Run it as --json and fold its summary in.
let coverage = null, worklist = [];
try {
  const r = spawnSync(process.execPath, [path.join(HERE, "manager-coverage.mjs"), "--json", "--size=" + opt("--size", "12")], { encoding: "utf8" });
  if (r.status === 0 && r.stdout) {
    const j = JSON.parse(r.stdout);
    // reach-≤2020 is not in the JSON summary; recompute it cheaply here from the data.
    const yr = (d) => Number(String(d || "").slice(0, 4)) || 0;
    const oldest = new Map();
    const note = (id, d) => { if (!id || !d) return; const y = yr(d); if (!y) return; const cur = oldest.get(id); if (cur == null || y < cur) oldest.set(id, y); };
    for (const d of CR.deals) note(d.managerId, d.date);
    for (const i of CR.intel) note(i.managerId, i.date);
    for (const m of CR.managers) if (Array.isArray(m.webNews)) for (const w of m.webNews) note(m.id, w.date);
    let reach2020 = 0; for (const [, y] of oldest) if (y <= 2020) reach2020++;
    coverage = { totalManagers: j.totalManagers, flagged: j.flagged, reach2020 };
    worklist = j.worklist || [];
  }
} catch { /* scorer unavailable — surfaces still audited */ }

// Coverage is "below target" when the aggregate ratchet in tests/manager-coverage.mjs
// would still flag depth work — i.e. more than a handful of profiles remain thin /
// missing-history. Kept loose here (the test holds the hard numbers); this only
// decides whether the audit asks the routine to spend its backfill budget.
const coverageStale = !!(coverage && coverage.flagged > 0);

// ---- assemble the actionable worklist ------------------------------------
const staleSurfaces = SURFACES.filter((s) => s.stale);
const actions = [];
for (const s of staleSurfaces) {
  const map = {
    deals: "Sweep NEW verified private-credit transactions (direct lending, unitranche, CLO pricings, SRTs, NAV/fund finance) and append to `deals`.",
    intel: "Sweep NEW verified fundraising / first & final closes / mandates / senior personnel and append to `intel`.",
    hedge_intel: "Sweep NEW verified hedge-fund activity (performance, launches, raises, personnel, wind-downs) and append to `HEDGE_INTEL`.",
    legal_items: "Sweep NEW verified legal updates / client alerts and append to legal `items`.",
    legal_cases: "Sweep NEW verified reported judgments and append to legal `cases`.",
    legal_rx: "Sweep NEW verified restructurings / schemes / RPs and append to legal `restructurings`.",
  };
  actions.push({ surface: s.key, newest: s.newestDate, ageDays: s.ageDays, do: map[s.key] || `Refresh ${s.label}.` });
}
if (coverageStale) actions.push({ surface: "coverage", flagged: coverage.flagged, reach2020: coverage.reach2020, do: "Backfill the worklisted managers' history to 2020 (deals / intel / webNews), all VERIFIED + dated." });

const ok = actions.length === 0;

// ---- output --------------------------------------------------------------
if (flag("--json")) {
  console.log(JSON.stringify({
    generated: new Date().toISOString().slice(0, 10),
    staleWindowDays: STALE_DAYS,
    ok,
    surfaces: SURFACES,
    coverage,
    worklist,
    actions,
  }, null, 2));
} else {
  const today = new Date().toISOString().slice(0, 10);
  console.log(`WIRE FRESHNESS AUDIT — ${today} (stale window: ${STALE_DAYS}d)\n`);
  for (const s of SURFACES) {
    const tag = s.stale ? "STALE " : "fresh ";
    const age = s.ageDays == null ? "no dated items" : `${s.ageDays}d old`;
    console.log(`  [${tag}] ${s.label.padEnd(48)} newest ${String(s.newestDate || "—").padEnd(11)} (${age}, ${s.count} items)`);
  }
  if (coverage) {
    const tag = coverageStale ? "STALE " : "fresh ";
    console.log(`  [${tag}] ${"Manager-profile depth".padEnd(48)} ${coverage.reach2020}/${coverage.totalManagers} reach ≤2020 · ${coverage.flagged} flagged`);
  }
  if (ok) {
    console.log(`\nAll surfaces fresh and coverage on target — nothing to resolve this run.`);
  } else {
    console.log(`\nACTIONS (resolve each — source VERIFIED, dated items, NEVER fabricate; then re-run the gate):`);
    for (const a of actions) console.log(`  • ${a.surface}${a.ageDays != null ? ` (${a.ageDays}d)` : ""}: ${a.do}`);
    if (coverageStale && worklist.length) {
      console.log(`\nBACKFILL WORKLIST (thinnest-first, rotating — today's targets):`);
      for (const w of worklist) console.log(`    ${String(w.total).padStart(3)}  ${w.name}  [${w.founded != null ? "est." + w.founded : "est.?"}]  → ${(w.gaps || []).join(", ")}`);
    }
  }
}
process.exit(ok ? 0 : 1);
