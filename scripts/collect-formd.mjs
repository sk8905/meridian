// =============================================================================
// collect-formd.mjs — SEC Form D filings of the tracked private-credit FUNDS, read from
// EDGAR (data audit 2026-10-21: 38 funds still "Open" 18+ months on; Form D shows what a
// fund vehicle has actually sold and when its first sale was).
//
// Match rule — exact entity, never a fuzzy name: an EDGAR filer counts only when its
// name, minus the legal form (LP, Ltd, SCSp, …), equals the tracked fund's name minus the
// same. A fund often files through several vehicles (onshore LP + offshore Ltd); each is
// listed. Form D covers only the US-offered vehicles, so the totals are a FLOOR on the
// fund size, never the fund size: the output is CANDIDATES for the profile rota
// (`fundFormD`), which a routine reads together with the manager's own release before
// changing `raised` / `status`. Nothing is applied here.
//
// Runs in a GitHub Action (.github/workflows/collect-formd.yml). SEC fair-access: ≤ 8
// requests / second with a descriptive User-Agent.
//
// Usage:
//   node scripts/collect-formd.mjs > backfill/formd.json
//   node scripts/collect-formd.mjs --only=f54,f258
// =============================================================================
import * as C from "../credit/js/data.js";

const args = process.argv.slice(2);
const opt = (n, d) => { const a = args.find((x) => x.startsWith(n + "=")); return a ? a.slice(n.length + 1) : d; };
const UA = "Wire meridian admin (kenneds7@tcd.ie)";   // as scripts/collect-sec.mjs — SEC requires a contact
const PACE_MS = 140;

// ---- pure, unit-tested ------------------------------------------------------------
const FORM = /\b(l\.?p\.?|ltd\.?|limited|llc|l\.l\.c\.?|inc\.?|scsp|scs|sca|s\.?a\.?r\.?l\.?|sicav|raif|icav|dac|plc|co\.?|fund\s+lp)\s*$/i;
export function fundKey(s) {
  let n = String(s || "").replace(/\(CIK \d+\)/i, "").replace(/\(.*?\)/g, " ").replace(/[,.]/g, " ").replace(/\s+/g, " ").trim();
  for (let i = 0; i < 3; i++) n = n.replace(FORM, "").trim();
  return n.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
}
// EDGAR full-text hits → the latest filing of each exactly-matching filer.
export function matchHits(fundName, hits) {
  const want = fundKey(fundName); if (want.length < 6) return [];
  const best = new Map();
  for (const h of hits || []) {
    const s = h._source || {}; const name = (s.display_names || [])[0] || "";
    if (fundKey(name) !== want || !(s.root_forms || []).includes("D")) continue;
    const cik = String((s.ciks || [])[0] || "").replace(/^0+/, "");
    const prev = best.get(cik);
    if (!prev || String(s.file_date) > prev.filed) best.set(cik, { cik, entity: name.replace(/\s*\(CIK \d+\)\s*$/i, "").trim(), filed: s.file_date || null, adsh: s.adsh || String(h._id || "").split(":")[0], location: (s.biz_locations || [])[0] || null });
  }
  return [...best.values()];
}
const tag = (x, t) => { const m = new RegExp(`<${t}>\\s*([^<]*?)\\s*</${t}>`, "i").exec(x || ""); return m ? m[1] : null; };
// A Form D primary_doc.xml → its offering figures (US$, as filed).
export function parseFormD(xml) {
  const num = (v) => (v == null || /indefinite/i.test(v) ? null : Number(String(v).replace(/[^\d.]/g, "")) || null);
  const first = /<dateOfFirstSale>[\s\S]*?<value>\s*([^<]+?)\s*<\/value>/i.exec(xml || "");
  return {
    offering: num(tag(xml, "totalOfferingAmount")), sold: num(tag(xml, "totalAmountSold")), remaining: num(tag(xml, "totalRemaining")),
    firstSale: first ? first[1] : (/<yetToOccur>\s*true/i.test(xml || "") ? "yet to occur" : null),
    investors: num(tag(xml, "totalNumberAlreadyInvested")),
  };
}

// ---- I/O ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, as = "json") {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": UA, accept: "application/json, text/xml, */*" }, signal: AbortSignal.timeout(20000) });
      await sleep(PACE_MS);
      if (r.status === 429 || r.status === 503) { await sleep(5000 * (a + 1)); continue; }
      if (!r.ok) return null;
      return as === "json" ? await r.json() : await r.text();
    } catch { await sleep(1500); }
  }
  return null;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const only = opt("--only", "").split(",").filter(Boolean);
  // Every tracked fund that isn't evergreen — closed funds too: a Form D after the close
  // still corrects a `raised` figure.
  const funds = (C.funds || []).filter((f) => !f.evergreen && (!only.length || only.includes(f.id)));
  const byFund = {}; let searched = 0, matched = 0;
  for (const f of funds) {
    const q = String(f.name).replace(/\(.*?\)/g, " ").replace(/\s+/g, " ").trim();
    const j = await get(`https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent('"' + q + '"')}&forms=D`);
    if (!j) continue; searched++;
    const hits = matchHits(f.name, (j.hits && j.hits.hits) || []);
    if (!hits.length) continue;
    const rows = [];
    for (const h of hits.slice(0, 4)) {
      const base = `https://www.sec.gov/Archives/edgar/data/${h.cik}/${String(h.adsh).replace(/-/g, "")}`;
      const xml = await get(`${base}/primary_doc.xml`, "text");
      rows.push({ ...h, ...(xml ? parseFormD(xml) : {}), src: `${base}/${h.adsh}-index.htm` });
    }
    matched++;
    const sold = rows.reduce((a, r) => a + (r.sold || 0), 0);
    byFund[f.id] = { name: f.name, status: f.status, raised: f.raised ?? null, ccy: f.ccy || null, soldUsdM: sold ? Math.round(sold / 1e5) / 10 : null, filings: rows };
  }
  const out = { generated: new Date().toISOString(), source: "SEC EDGAR full-text search (Form D) + primary_doc.xml", tracked: funds.length, searched, matched, byFund };
  console.log(JSON.stringify(out, null, 1));
  console.error(`form D: ${matched}/${searched} searched funds have an exactly-named Form D filer`);
  if (!searched && funds.length) process.exit(2);
}
