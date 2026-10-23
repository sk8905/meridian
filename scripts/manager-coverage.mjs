// =============================================================================
// manager-coverage.mjs — the deterministic backfill worklist for manager profiles.
//
// The manager/profile surface is a material feature: every covered manager must
// carry history back to 2020 AND current activity. Coverage used to decay because
// the earlier refresh only deep-backfilled WATCHLIST names, so ~150 of the 219
// profiles never got a historical pass. This script removes the guesswork: it
// reads the committed credit data, scores every manager's coverage, and prints a
// BOUNDED, ROTATING worklist so each refresh run backfills the thinnest profiles
// first and the rotation guarantees the whole roster is swept over time.
//
// Pure read over credit/js/data.js — no fetch, no state, no writes. The refresh
// routine runs `node scripts/manager-coverage.mjs` to get its target list, then
// WebSearch-sources verified (real URL + real date) events for those managers and
// appends them to credit/js/data.js (deals / intel / manager.webNews).
//
// Usage:
//   node scripts/manager-coverage.mjs            # today's worklist + summary
//   node scripts/manager-coverage.mjs --all      # full per-manager table
//   node scripts/manager-coverage.mjs --json     # machine-readable worklist
//   node scripts/manager-coverage.mjs --size=12  # override worklist size (default 10)
// =============================================================================
import * as CR from "../credit/js/data.js";
import { nicheIndex } from "./lib/niche.mjs";

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => { const a = args.find((x) => x.startsWith(n + "=")); return a ? a.split("=")[1] : d; };

const SIZE = Math.max(1, parseInt(opt("--size", "10"), 10) || 10);

// Coverage thresholds — a manager is "thin" if ANY of these hold.
const THIN_TOTAL = 4;      // fewer than this many events total
const BACKFILL_YEAR = 2020; // must carry at least one event dated this year or earlier (R32: history to 2020)…
const STALE_DAYS = 150;     // …AND at least one event within this many days (current activity)

const TODAY = new Date();
const todayMs = TODAY.getTime();
const yr = (d) => String(d || "").slice(0, 4);
const msOf = (d) => { const s = /^\d{4}-\d{2}$/.test(d) ? d + "-01" : d; const m = Date.parse(s); return Number.isNaN(m) ? 0 : m; };

const deals = CR.deals || [], intel = CR.intel || [], managers = CR.managers || [];

// Per-manager event aggregation (deals + intel + manager.webNews).
const byId = new Map();
// Lender / bank profiles awaiting research (profileStub, R39m) are deal counterparties, not
// credit managers: "history back to 2020" doesn't apply to them, so they are not scored
// (the ratchet in tests/manager-coverage.mjs already skips them — owner 2026-10-23).
for (const m of managers) {
  if (m.profileStub) continue;
  byId.set(m.id, {
    id: m.id, name: m.name, hq: m.hq || null,
    founded: m.founded != null ? Number(m.founded) : null,
    total: 0, years: new Set(), oldestMs: Infinity, newestMs: 0,
  });
}
const bump = (mid, date) => {
  const c = byId.get(mid); if (!c || !date) return;
  c.total++; const y = yr(date); if (y) c.years.add(y);
  const ms = msOf(date); if (ms) { c.oldestMs = Math.min(c.oldestMs, ms); c.newestMs = Math.max(c.newestMs, ms); }
};
for (const d of deals) bump(d.managerId, d.date);
for (const i of intel) bump(i.managerId, i.date);
for (const m of managers) if (Array.isArray(m.webNews)) for (const w of m.webNews) bump(m.id, w.date);

// Niche-first (scripts/lib/niche.mjs): core European ≤$15bn 15%+ managers outrank
// adjacent, then context, then off-niche names — within a tier the old thinness order holds.
const NICHE = nicheIndex(managers, CR.funds || []);
const rows = [...byId.values()].map((c) => {
  const ageDays = c.newestMs ? Math.round((todayMs - c.newestMs) / 86400000) : null;
  const oldestYear = c.oldestMs < Infinity ? Number(yr(new Date(c.oldestMs).toISOString())) : null;
  // "needs backfill to 2020": the firm is old enough to have pre-2020 history but none is recorded.
  const old = c.founded == null || c.founded <= BACKFILL_YEAR;
  const needsHistory = old && !(oldestYear != null && oldestYear <= BACKFILL_YEAR);
  const needsCurrent = ageDays == null || ageDays > STALE_DAYS;
  const thin = c.total < THIN_TOTAL;
  const gaps = [];
  if (thin) gaps.push("thin");
  if (needsHistory) gaps.push("no-" + BACKFILL_YEAR);
  if (needsCurrent) gaps.push(ageDays == null ? "empty" : `stale-${ageDays}d`);
  // Priority score: lower = more urgent. Empty first, then thin, then missing-history, then stale.
  const niche = NICHE.get(c.id) || { tier: "context", rank: 2 };
  const score = niche.rank * 100000 + c.total * 10 + (needsHistory ? 0 : 1000) + (needsCurrent ? 0 : 500) + (c.founded || 0) / 10000;
  return { ...c, niche: niche.tier, years: [...c.years].sort(), ageDays, oldestYear, needsHistory, needsCurrent, thin, gaps, score };
});

const flagged = rows.filter((r) => r.gaps.length).sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));

// Rotating worklist: deterministic by day-of-year so consecutive runs sweep DIFFERENT
// slices of the flagged roster (thinnest always re-surface because their score stays low,
// but the rotation offset keeps the run from re-targeting the exact same 10 each time).
const doy = Math.floor((todayMs - Date.parse(TODAY.getFullYear() + "-01-01")) / 86400000);
// The rotation runs WITHIN each niche tier, best tier first, so the core niche is
// swept before effort spills into adjacent / context names.
const worklist = [];
for (const tier of ["core", "adjacent", "context", "off"]) {
  const pool = flagged.filter((r) => r.niche === tier);
  const offset = pool.length ? (doy * SIZE) % pool.length : 0;
  for (let i = 0; i < pool.length && worklist.length < SIZE; i++) worklist.push(pool[(offset + i) % pool.length]);
  if (worklist.length >= SIZE) break;
}

function fmt(r) {
  const fnd = r.founded != null ? `est.${r.founded}` : "est.?";
  const span = r.years.length ? `${r.years[0]}–${r.years[r.years.length - 1]}` : "—";
  return `  ${String(r.total).padStart(3)}  ${r.niche.padEnd(8)} ${r.name}  [${fnd}, ${r.hq || "?"}, span ${span}]  → ${r.gaps.join(", ")}`;
}

if (flag("--json")) {
  console.log(JSON.stringify({
    generated: TODAY.toISOString().slice(0, 10),
    totalManagers: rows.length, flagged: flagged.length,
    worklist: worklist.map((r) => ({ id: r.id, name: r.name, niche: r.niche, hq: r.hq, founded: r.founded, total: r.total, span: r.years, gaps: r.gaps })),
  }, null, 2));
} else if (flag("--all")) {
  console.log(`MANAGER COVERAGE — ${rows.length} profiles, ${flagged.length} flagged (${TODAY.toISOString().slice(0, 10)})\n`);
  rows.sort((a, b) => a.score - b.score).forEach((r) => console.log(fmt(r)));
} else {
  const have2020 = rows.filter((r) => r.oldestYear != null && r.oldestYear <= 2020).length;
  console.log(`MANAGER COVERAGE — ${TODAY.toISOString().slice(0, 10)}`);
  console.log(`  ${rows.length} profiles · ${have2020} reach ≤2020 · ${flagged.length} flagged (thin / missing-history / stale)\n`);
  console.log(`TODAY'S BACKFILL WORKLIST (${worklist.length} managers, niche-first, thinnest-first, rotating):`);
  console.log(`  Source VERIFIED events (real URL + real date, no fabrication) back to 2020 AND recent,`);
  console.log(`  then append to credit/js/data.js (deals / intel / manager.webNews). gaps legend:`);
  console.log(`  thin=<${THIN_TOTAL} events · no-${BACKFILL_YEAR}=no pre-${BACKFILL_YEAR} history · stale-Nd/empty=no recent activity\n`);
  worklist.forEach((r) => console.log(fmt(r)));
}
