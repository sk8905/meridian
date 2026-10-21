// =============================================================================
// collect-gleif.mjs — Legal Entity Identifier (LEI) CANDIDATES for the tracked credit
// managers and funds, read from GLEIF's public API (docs/implementation-plan.md B3).
//
// Licence: GLEIF LEI data is CC0 1.0 ("data available through the Access Service are
// provided under the CC0 licence" — gleif.org/en/meta/lei-data-terms-of-use). No key.
// Runs in a GitHub Action (.github/workflows/collect-gleif.yml) because api.gleif.org is
// blocked from the routines' containers. Paced at ≤ 1 request / 1.1s.
//
// Output (stdout JSON → backfill/gleif.json): per manager/fund, the GLEIF records whose
// legal name matches the tracked name after removing legal-form suffixes, each with LEI,
// legal name, jurisdiction, status, legal form and (for exact matches) the direct /
// ultimate accounting-consolidation parent (GLEIF Level 2). These are CANDIDATES: a
// name match is not proof of identity — a routine or the owner confirms (jurisdiction,
// address, parent) before an `lei` is written to the data. Nothing is applied here.
//
// Usage:
//   node scripts/collect-gleif.mjs > backfill/gleif.json
//   node scripts/collect-gleif.mjs --only=m37,f12      # a few entities (debugging)
//   node scripts/collect-gleif.mjs --kind=managers     # managers | funds | all (default)
// =============================================================================
import * as C from "../credit/js/data.js";

const args = process.argv.slice(2);
const opt = (n, d) => { const a = args.find((x) => x.startsWith(n + "=")); return a ? a.slice(n.length + 1) : d; };
const API = "https://api.gleif.org/api/v1";
const UA = "WireMonitor/1.0 (+https://github.com/sk8905/meridian)";
const PACE_MS = 1100;

// ---- pure, unit-tested ------------------------------------------------------------
const SUFFIX = /\b(llp|l\.l\.p|ltd|limited|plc|llc|l\.l\.c|lp|l\.p|inc|corp|corporation|sa|s\.a|sas|sarl|s\.a r\.l|s\.à r\.l|sàrl|gmbh|ag|bv|b\.v|nv|n\.v|spa|s\.p\.a|sgr|scsp|scs|sca|sicav|raif|sif|icav|fcp|kg|ab|as|oy|oyj|aps|a\/s|co|company|group|holdings?|partners?|management|asset management|investment management|capital management|advisors?|advisers?|uk|europe|international)\b\.?/gi;
export function normName(s) {
  return String(s || "").toLowerCase()
    .replace(/\(.*?\)/g, " ")               // "(BlackRock)", "(KKR Credit)" — parenthetical owners/notes
    .replace(/&/g, " and ").replace(/[’'`"]/g, "")
    .replace(SUFFIX, " ").replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
export function pickRecord(r) {
  const a = (r && r.attributes) || {}, e = a.entity || {};
  return {
    lei: a.lei || r.id || null,
    legalName: (e.legalName && e.legalName.name) || null,
    jurisdiction: e.jurisdiction || null,
    country: (e.legalAddress && e.legalAddress.country) || null,
    // Where the entity is run from (GLEIF headquartersAddress; the legal address can be a
    // registered-agent office) — the HQ a stub profile shows once the LEI is confirmed.
    hqCity: (e.headquartersAddress && e.headquartersAddress.city) || null,
    hqCountry: (e.headquartersAddress && e.headquartersAddress.country) || null,
    legalForm: (e.legalForm && (e.legalForm.other || e.legalForm.id)) || null,
    entityStatus: e.status || null,
    registrationStatus: (a.registration && a.registration.status) || null,
  };
}
// Candidates whose normalised legal name equals the tracked name's are "exact"; the rest
// are kept (up to 5) as "near" for a human to look at, never applied.
export function classify(trackedName, records) {
  const want = normName(trackedName);
  return (records || []).map(pickRecord).filter((x) => x.lei)
    .map((x) => ({ ...x, match: normName(x.legalName) === want && want.length >= 3 ? "exact" : "near" }))
    .sort((a, b) => (a.match === b.match ? 0 : a.match === "exact" ? -1 : 1)).slice(0, 5);
}

// ---- I/O ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJson(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(url, { headers: { accept: "application/vnd.api+json", "user-agent": UA }, signal: AbortSignal.timeout(20000) });
      if (r.status === 429) { await sleep(10000 * (attempt + 1)); continue; }   // rate-limited: back off, don't hammer
      if (r.status === 404) return null;
      if (!r.ok) return { error: `http-${r.status}` };
      return await r.json();
    } catch (e) { if (attempt === 2) return { error: String(e.message || e) }; await sleep(2000); }
  }
  return { error: "rate-limited" };
}
async function parentOf(lei, which) {
  const j = await getJson(`${API}/lei-records/${lei}/${which}`); await sleep(PACE_MS);
  return j && j.data ? pickRecord(j.data) : null;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const only = new Set(opt("--only", "").split(",").filter(Boolean));
  const kind = opt("--kind", "all");
  const targets = [
    ...(kind === "funds" ? [] : (C.managers || []).map((m) => ({ kind: "manager", id: m.id, name: m.name }))),
    ...(kind === "managers" ? [] : (C.funds || []).map((f) => ({ kind: "fund", id: f.id, name: f.name }))),
  ].filter((t) => !only.size || only.has(t.id));
  const out = { generated: new Date().toISOString(), source: "GLEIF API (CC0 1.0) — " + API, entities: {} };
  let ok = 0, exact = 0;
  for (const t of targets) {
    const q = String(t.name).replace(/\(.*?\)/g, " ").replace(/\s+/g, " ").trim();
    const j = await getJson(`${API}/lei-records?filter[fulltext]=${encodeURIComponent(q)}&page[size]=10`);
    await sleep(PACE_MS);
    if (!j || j.error) { out.entities[t.id] = { ...t, error: j ? j.error : "no-response" }; continue; }
    ok++;
    const cands = classify(t.name, j.data);
    // Level 2 parents only for a single exact match (an ambiguous name is left to a human).
    const ex = cands.filter((c) => c.match === "exact");
    if (ex.length === 1) {
      exact++;
      ex[0].directParent = await parentOf(ex[0].lei, "direct-parent");
      ex[0].ultimateParent = await parentOf(ex[0].lei, "ultimate-parent");
    }
    out.entities[t.id] = { ...t, candidates: cands };
  }
  out.summary = { targets: targets.length, queried: ok, singleExact: exact };
  console.log(JSON.stringify(out, null, 1));
  console.error(`gleif: ${ok}/${targets.length} queried, ${exact} single exact name match(es)`);
  if (!ok && targets.length) process.exit(2);   // nothing reachable — fail loudly, never commit an empty file
}
