// =============================================================================
// merge-lp-research.mjs — fold a researched batch of LP COMMITMENTS and new LP
// profiles (review 2026-10-15, #15) into credit/js/data.js. Idempotent: a commitment
// already present (same lp + manager/fund + date + source URL) or an LP already present
// (same name) is skipped. Every record keeps its public source URL; unknown = null.
//   node scripts/merge-lp-research.mjs [--dry-run]
// Inputs (committed for provenance): every backfill/lp-profiles-*.json and
//   backfill/lp-commitments-*.json — public pension board papers / transaction reports,
//   manager & LP releases, trade press (each row's sourceUrl). The LP sweep in
//   docs/refresh-routines.md appends to these and re-runs this script.
// AUM is USD by convention (HOUSE_STYLE R29): a EUR/GBP figure converts at AUM_FX and
// records aumFrom provenance; any other currency is left null rather than guessed.
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readRecords, appendRecords, maxId } from "./lib/datafile.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(ROOT, "credit", "js", "data.js");
const DRY = process.argv.includes("--dry-run");
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, "backfill", f), "utf8"));
const inputs = (prefix) => fs.readdirSync(path.join(ROOT, "backfill")).filter((f) => f.startsWith(prefix) && f.endsWith(".json")).sort().flatMap(read);
const C = await import(path.join(ROOT, "credit", "js", "data.js"));
const FX = { USD: 1, EUR: C.AUM_FX.EURUSD, GBP: C.AUM_FX.GBPUSD };
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// 1) LP profiles
const lpRecs = readRecords(FILE, "lps").map((r) => r.obj);
const byName = new Map(lpRecs.map((l) => [norm(l.name), l.id]));
let next = maxId(FILE, "l");
const newLps = [];
for (const x of inputs("lp-profiles-")) {
  if (byName.has(norm(x.name))) continue;
  const id = "l" + (++next);
  const fx = x.aum != null && x.aumCcy ? FX[x.aumCcy] : null;
  const rec = {
    id, name: x.name, type: x.type, hq: x.hq,
    aum: fx ? +(x.aum * fx).toFixed(1) : null,
    ...(fx && x.aumCcy !== "USD" ? { aumFrom: { aum: x.aumCcy } } : {}),
    pcAllocationPct: x.pcAllocationPct ?? null, pcEstimated: false, typicalTicket: null,
    strategies: x.strategies || [], mandateStatus: x.mandateStatus || "Selective", mandateInferred: true,
    notes: x.notes || "", asOf: x.aumAsOf || null, sources: x.sources || [],
  };
  byName.set(norm(x.name), id); newLps.push(rec);
}

// 2) Commitments (the ledger gains amount / ccy / date / strategy / sourceUrl)
const have = new Set(C.commitments.map((c) => [c.lpId, c.managerId, c.fundId, c.date || "", c.sourceUrl || ""].join("|")));
const newC = [];
let unmatched = 0;
for (const x of inputs("lp-commitments-")) {
  const lpId = byName.get(norm(x.lp));
  if (!lpId) { unmatched++; continue; }
  const rec = {
    lpId, managerId: x.managerId || null, fundId: x.fundId || null,
    ...(x.managerId ? {} : { manager: x.manager || null }), ...(x.fund && !x.fundId ? { fund: x.fund } : {}),
    amount: x.amount ?? null, ccy: x.amount != null ? (x.ccy || null) : null, date: x.date || null,
    strategy: x.strategy || null, sourceUrl: x.sourceUrl, note: x.note || "",
  };
  const k = [rec.lpId, rec.managerId, rec.fundId, rec.date || "", rec.sourceUrl || ""].join("|");
  if (have.has(k) || !rec.sourceUrl) continue;
  have.add(k); newC.push(rec);
}
const a = appendRecords(FILE, "lps", newLps, { dryRun: DRY });
const b = appendRecords(FILE, "commitments", newC, { dryRun: DRY });
console.log(`merge-lp-research: +${a} LPs, +${b} commitments${unmatched ? `, ${unmatched} unmatched` : ""}${DRY ? " (dry run)" : ""}`);
