// =============================================================================
// apply-research.mjs — apply a reviewed research patch file to the data modules.
//
// Research workers (routine runs or sub-agents) never edit data.js directly: each one
// writes a patch file (docs/refresh-routines.md "Research patches") — every change
// carries its source URL, as-of date and the evidence it rests on. This script is the
// ONE writer: it applies the patches record-by-record (scripts/lib/datafile.mjs), so
// several workers can research in parallel without ever racing on the same file.
//
//   patches  [{ collection, id, set:{field|dotted.path: value}, unset:[field…], money:{field:{value,ccy,unit}},
//              source, sourceLabel, asOf, evidence, verdict }]
//   append   [{ collection, record, evidence }]          → new HEDGE_INTEL / commitments
//
// `money` is converted to US$bn at AUM_FX (ECB reference rates of one fixing day) and
// records `aumFrom[field] = <source ccy>` (R29 provenance); a US$ figure clears it.
// Every applied change is logged to backfill/research-ledger.json (append-only audit
// trail: what changed, from what, to what, and on which source).
//
// Usage: node scripts/apply-research.mjs <patch.json>… [--dry-run]
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readRecords, updateRecords, appendRecords, maxId } from "./lib/datafile.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CREDIT = path.join(ROOT, "credit", "js", "data.js");
const LEGAL = path.join(ROOT, "legal", "js", "data.js");
const LEDGER = path.join(ROOT, "backfill", "research-ledger.json");
const DRY = process.argv.includes("--dry-run");
const files = process.argv.slice(2).filter((a) => !a.startsWith("--"));

const WHERE = {
  managers: CREDIT, funds: CREDIT, lps: CREDIT, deals: CREDIT, intel: CREDIT, commitments: CREDIT,
  HEDGE_FUNDS: CREDIT, HEDGE_INTEL: CREDIT, firms: LEGAL,
};
const ID_PREFIX = { HEDGE_INTEL: "hi", intel: "i", deals: "d" };
const MONEY_FIELDS = new Set(["aum", "aumTotal", "aumCredit", "groupAum"]);
const COLLECTIONS_WITH_AUMFROM = new Set(["managers", "lps"]);

const { AUM_FX } = await import(pathToUrl(CREDIT));
function pathToUrl(p) { return "file://" + p; }
export function toUsdBn({ value, ccy, unit = "bn" }) {
  const v = Number(value) * (unit === "m" ? 0.001 : unit === "tn" ? 1000 : 1);
  const rate = ccy === "USD" ? 1 : AUM_FX[`${ccy}USD`] ?? (ccy === "EUR" ? AUM_FX.EURUSD : null);
  if (rate == null || !isFinite(v)) return null;
  return Math.round(v * rate * 100) / 100;
}
const setPath = (o, p, v) => { const ks = p.split("."); let x = o; for (const k of ks.slice(0, -1)) x = x[k] = x[k] && typeof x[k] === "object" ? x[k] : {}; x[ks.at(-1)] = v; };
const getPath = (o, p) => p.split(".").reduce((x, k) => (x == null ? undefined : x[k]), o);

const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, "utf8")) : { note: "Append-only log of researched data corrections (scripts/apply-research.mjs).", entries: [] };
const at = new Date().toISOString().slice(0, 10);
const stats = { patched: 0, fields: 0, appended: 0, skipped: [] };

for (const f of files) {
  const j = JSON.parse(fs.readFileSync(f, "utf8"));
  const byColl = new Map();
  for (const p of j.patches || []) (byColl.get(p.collection) || byColl.set(p.collection, []).get(p.collection)).push(p);
  for (const [coll, ps] of byColl) {
    const file = WHERE[coll]; if (!file) { stats.skipped.push(`${coll} (unknown collection)`); continue; }
    const want = new Map(ps.map((p) => [p.id, p]));
    const seen = new Set();
    updateRecords(file, coll, (r) => {
      const p = want.get(r.id); if (!p) return false;
      seen.add(r.id);
      const changes = [];
      for (const [k, v] of Object.entries(p.set || {})) {
        const was = getPath(r, k);
        if (JSON.stringify(was) === JSON.stringify(v)) continue;
        setPath(r, k, v); changes.push({ field: k, from: was ?? null, to: v });
      }
      for (const k of p.unset || []) {
        if (!(k in r)) continue;
        changes.push({ field: k, from: r[k], to: "(removed)" }); delete r[k];
        if (r.aumFrom && k in r.aumFrom) { delete r.aumFrom[k]; if (!Object.keys(r.aumFrom).length) delete r.aumFrom; }
      }
      for (const [k, m] of Object.entries(p.money || {})) {
        if (!MONEY_FIELDS.has(k)) { stats.skipped.push(`${r.id}.${k} (not a money field)`); continue; }
        const usd = toUsdBn(m);
        if (usd == null) { stats.skipped.push(`${r.id}.${k} (no AUM_FX rate for ${m.ccy})`); continue; }
        const was = r[k];
        r[k] = usd;
        if (COLLECTIONS_WITH_AUMFROM.has(coll)) {
          const af = { ...(r.aumFrom || {}) };
          if (m.ccy === "USD") delete af[k]; else af[k] = m.ccy;
          if (Object.keys(af).length) r.aumFrom = af; else delete r.aumFrom;
        }
        changes.push({ field: k, from: was ?? null, to: usd, reported: `${m.value}${m.unit === "m" ? "m" : "bn"} ${m.ccy}` });
      }
      if (!changes.length) return false;
      stats.patched++; stats.fields += changes.length;
      ledger.entries.push({ at, collection: coll, id: r.id, verdict: p.verdict || null, source: p.source || null, sourceLabel: p.sourceLabel || null, asOf: p.asOf || null, evidence: p.evidence || null, changes });
      return true;
    }, { dryRun: DRY });
    for (const id of want.keys()) if (!seen.has(id)) stats.skipped.push(`${coll}:${id} (no such record)`);
  }
  const apps = new Map();
  for (const a of j.append || []) (apps.get(a.collection) || apps.set(a.collection, []).get(a.collection)).push(a);
  for (const [coll, as] of apps) {
    const file = WHERE[coll]; if (!file) { stats.skipped.push(`append ${coll}`); continue; }
    // Dedupe on entity + URL (refresh-routines "Invariants"): one article about two funds is two records.
    const keyOf = (o) => [o.hfId || o.managerId || o.lpId || o.firm || "", String(o.url || o.sourceUrl || "").toLowerCase()].join("|");
    const held = new Set(readRecords(file, coll).map(({ obj }) => keyOf(obj)));
    const prefix = ID_PREFIX[coll];
    let next = prefix ? maxId(file, prefix) + 1 : null;
    const recs = [];
    for (const a of as) {
      const u = keyOf(a.record);
      if (held.has(u)) { stats.skipped.push(`append ${coll} ${u} (already held)`); continue; }
      const rec = prefix ? { id: `${prefix}${next++}`, ...a.record } : { ...a.record };
      recs.push(rec); held.add(u);
      ledger.entries.push({ at, collection: coll, id: rec.id || null, verdict: "GAP", source: a.record.url || a.record.sourceUrl || null, evidence: a.evidence || null, changes: [{ field: "(new record)", to: rec }] });
    }
    if (recs.length) { appendRecords(file, coll, recs, { dryRun: DRY }); stats.appended += recs.length; }
  }
}
if (!DRY) fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 1) + "\n");
console.log(`${DRY ? "[dry-run] " : ""}apply-research: ${stats.patched} record(s), ${stats.fields} field(s) changed; ${stats.appended} record(s) appended`);
if (stats.skipped.length) console.log("  skipped:\n   - " + stats.skipped.join("\n   - "));
