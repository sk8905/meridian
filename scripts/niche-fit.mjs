// =============================================================================
// niche-fit.mjs — rank the covered credit managers by fit to the owner's niche
// (European, ≤$15bn AUM, 15%+ target strategies). See scripts/lib/niche.mjs.
//
// Pure read over credit/js/data.js. Used to point backfill / refresh effort at the
// niche first (manager-coverage.mjs ranks by it) and to show which roster names
// are context-only. Never deletes or demotes data — it only orders work.
//
// Usage:
//   node scripts/niche-fit.mjs           # summary + core list
//   node scripts/niche-fit.mjs --all     # every manager with tier + reasons
//   node scripts/niche-fit.mjs --json    # machine-readable
// =============================================================================
import * as CR from "../credit/js/data.js";
import { nicheIndex } from "./lib/niche.mjs";

const args = process.argv.slice(2);
const idx = nicheIndex(CR.managers || [], CR.funds || []);
const rows = (CR.managers || []).map((m) => ({ id: m.id, name: m.name, hq: m.hq, ...idx.get(m.id) }))
  .sort((a, b) => a.rank - b.rank || (a.aum ?? 1e9) - (b.aum ?? 1e9) || a.name.localeCompare(b.name));
const count = (t) => rows.filter((r) => r.tier === t).length;

if (args.includes("--json")) {
  console.log(JSON.stringify({ generated: new Date().toISOString().slice(0, 10), tiers: { core: count("core"), adjacent: count("adjacent"), context: count("context"), off: count("off") }, managers: rows.map(({ id, name, tier, aum, reasons }) => ({ id, name, tier, aum, reasons })) }, null, 2));
} else {
  console.log(`NICHE FIT — ${rows.length} managers · core ${count("core")} · adjacent ${count("adjacent")} · context ${count("context")} · off ${count("off")}\n`);
  const show = args.includes("--all") ? rows : rows.filter((r) => r.tier === "core");
  for (const r of show) console.log(`  ${r.tier.padEnd(8)} ${r.id.padEnd(5)} ${r.name}  [${r.reasons.join(" · ")}]`);
}
