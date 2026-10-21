// =============================================================================
// collect-adv.mjs — the tracked hedge funds' REGULATORY AUM from the SEC's monthly
// registered-adviser file (Form ADV Item 5.F(2)(c), total regulatory assets under
// management), matched to Wire's HEDGE_FUNDS by SEC CIK — no name guessing.
//
// The GitHub Action (.github/workflows/collect-sec.yml) downloads + unzips the
// latest file and runs:  node scripts/collect-adv.mjs <file.csv> > backfill/sec-adv.json
// Regulatory AUM is GROSS (it counts leverage / securities portfolios at gross value),
// so it is shown alongside — never instead of — a fund's net AUM.
// =============================================================================
import fs from "node:fs";
import * as C from "../credit/js/data.js";

// RFC-4180 CSV (quoted fields may hold commas, quotes ("") and newlines).
export function parseCsv(text) {
  const rows = []; let row = [], f = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; continue; }
    if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n") { row.push(f.replace(/\r$/, "")); rows.push(row); row = []; f = ""; }
    else f += c;
  }
  if (f || row.length) { row.push(f.replace(/\r$/, "")); rows.push(row); }
  return rows;
}
const isoDate = (s) => { const t = String(s || "").trim(); let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(t); if (m) return `${m[1]}-${m[2]}-${m[3]}`; m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(t); return m ? `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}` : null; };

// rows (header first) + funds → { byId: {hId: {raum (US$bn), filed, crd, name, src}}, unmatched: [...] }
export function matchAdv(rows, funds) {
  const [hdr, ...body] = rows;
  const col = (re) => hdr.findIndex((h) => re.test(String(h).trim()));
  const iCik = col(/^CIK#?$/i), iAum = col(/^5F\(2\)\(c\)$/i), iCrd = col(/^Organization CRD#?$/i), iName = col(/^Primary Business Name$/i), iFiled = col(/^Latest ADV Filing Date$/i);
  if (iCik < 0 || iAum < 0) return { error: `columns not found (CIK# ${iCik}, 5F(2)(c) ${iAum})`, byId: {}, unmatched: [] };
  const byCik = new Map();
  for (const r of body) { const k = Number(String(r[iCik] || "").replace(/\D/g, "")); if (k) byCik.set(k, r); }
  const byId = {}, unmatched = [];
  for (const h of funds) {
    if (!h.cik) continue;
    const r = byCik.get(Number(String(h.cik).replace(/\D/g, "")));
    const aum = r ? Number(String(r[iAum] || "").replace(/[^\d.]/g, "")) : 0;
    if (!r || !aum) { unmatched.push(h.id); continue; }
    const crd = iCrd >= 0 ? String(r[iCrd] || "").replace(/\D/g, "") : "";
    byId[h.id] = { raum: Math.round(aum / 1e8) / 10, filed: iFiled >= 0 ? isoDate(r[iFiled]) : null, crd: crd || null, name: iName >= 0 ? r[iName] : null,
      src: crd ? `https://adviserinfo.sec.gov/firm/summary/${crd}` : null };
  }
  return { byId, unmatched };
}

// The CRD of the IAPD page a profile cites (sources / regSources / filings / advisers).
export function crdOf(m) {
  const s = JSON.stringify([m.sources, m.regSources, m.filings, m.advisers, m.raumSource]);
  const ids = [...new Set([...s.matchAll(/adviserinfo\.sec\.gov\/(?:firm\/summary|Firm)\/(\d{3,7})/gi)].map((x) => x[1]))];
  return ids.length === 1 ? ids[0] : null;   // two different CRDs cited = ambiguous, left to a human
}
const ADV_SUFFIX = /\b(llp|ltd|limited|plc|llc|lp|l p|inc|corp|corporation|sa|sas|sarl|gmbh|ag|bv|nv|spa|co|company)\b\.?/g;
export const advName = (s) => String(s || "").toLowerCase().replace(/\(.*?\)/g, " ").replace(/&/g, " and ").replace(/[^a-z0-9 ]+/g, " ").replace(ADV_SUFFIX, " ").replace(/\s+/g, " ").trim();
const COUNTRY_OF = [["United States", /\b(US|USA|United States|NY|CA|CT|TX|IL|MA|FL|New York|Chicago|Boston|Greenwich|Los Angeles|San Francisco|Dallas|Miami|Stamford)\b/i], ["United Kingdom", /\b(UK|United Kingdom|London|England|Edinburgh|Manchester)\b/i], ["France", /\b(France|Paris)\b/i], ["Germany", /\b(Germany|Frankfurt|Munich|Berlin)\b/i], ["Luxembourg", /\bLuxembourg\b/i], ["Ireland", /\b(Ireland|Dublin)\b/i], ["Switzerland", /\b(Switzerland|Zurich|Geneva)\b/i], ["Netherlands", /\b(Netherlands|Amsterdam)\b/i], ["Sweden", /\b(Sweden|Stockholm)\b/i], ["Denmark", /\b(Denmark|Copenhagen)\b/i], ["Italy", /\b(Italy|Milan|Rome)\b/i], ["Spain", /\b(Spain|Madrid|Barcelona)\b/i], ["Canada", /\b(Canada|Toronto|Montreal)\b/i]];
export const hqCountry = (hq) => { const first = String(hq || "").split("/")[0]; const hit = COUNTRY_OF.find(([, re]) => re.test(first)); return hit ? hit[0] : null; };
const advCountry = (c) => ({ "UNITED STATES": "United States", "UNITED KINGDOM": "United Kingdom" }[String(c || "").toUpperCase()] || String(c || "").replace(/\b\w/g, (x) => x.toUpperCase()).replace(/\B\w/g, (x) => x.toLowerCase()) || null);

// rows + managers → { byManager: {mId: {raum, filed, crd, name, src}}, managerCandidates: {mId: [{crd, name, city, country, raum, filed, src}]} }
export function matchManagers(rows, managers) {
  const [hdr, ...body] = rows;
  const col = (re) => hdr.findIndex((h) => re.test(String(h).trim()));
  const iAum = col(/^5F\(2\)\(c\)$/i), iCrd = col(/^Organization CRD#?$/i), iName = col(/^Primary Business Name$/i), iLegal = col(/^Legal Name$/i), iFiled = col(/^Latest ADV Filing Date$/i), iCity = col(/^Main Office City$/i), iCountry = col(/^Main Office Country$/i);
  if (iCrd < 0 || iAum < 0) return { error: `columns not found (CRD ${iCrd}, 5F(2)(c) ${iAum})`, byManager: {}, managerCandidates: {} };
  const rec = (r) => { const crd = String(r[iCrd] || "").replace(/\D/g, ""); const aum = Number(String(r[iAum] || "").replace(/[^\d.]/g, "")); return { crd, name: r[iName] || r[iLegal] || null, city: iCity >= 0 ? r[iCity] || null : null, country: iCountry >= 0 ? advCountry(r[iCountry]) : null, raum: aum ? Math.round(aum / 1e8) / 10 : null, filed: iFiled >= 0 ? isoDate(r[iFiled]) : null, src: crd ? `https://adviserinfo.sec.gov/firm/summary/${crd}` : null }; };
  const byCrd = new Map(), byName = new Map();
  for (const r of body) {
    const x = rec(r); if (!x.crd) continue;
    byCrd.set(x.crd, x);
    for (const n of new Set([advName(r[iName]), advName(r[iLegal])])) if (n.length >= 4) (byName.get(n) || byName.set(n, []).get(n)).push(x);
  }
  const byManager = {}, managerCandidates = {};
  for (const m of managers) {
    if (m.profileStub) continue;
    const crd = crdOf(m);
    if (crd && byCrd.has(crd)) { const x = byCrd.get(crd); if (x.raum) byManager[m.id] = { raum: x.raum, filed: x.filed, crd, name: x.name, src: x.src }; continue; }
    const want = hqCountry(m.hq);
    const hits = (byName.get(advName(m.name)) || []).filter((x) => x.raum && want && x.country === want);
    const uniq = [...new Map(hits.map((x) => [x.crd, x])).values()];
    if (uniq.length) managerCandidates[m.id] = uniq.slice(0, 3);
  }
  return { byManager, managerCandidates };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  const out = { generated: new Date().toISOString(), file: file ? file.split("/").pop() : null };
  if (!file || !fs.existsSync(file)) { console.log(JSON.stringify({ ...out, error: "no adviser file" }, null, 1)); process.exit(2); }
  const rows = parseCsv(fs.readFileSync(file, "latin1"));
  const r = matchAdv(rows, C.HEDGE_FUNDS || []);
  const mm = matchManagers(rows, C.managers || []);
  console.log(JSON.stringify({ ...out, ...r, ...mm }, null, 1));
  console.error(`form ADV: ${Object.keys(mm.byManager).length} credit managers matched by CRD, ${Object.keys(mm.managerCandidates).length} name + country candidates`);
  console.error(`form ADV: ${Object.keys(r.byId).length} tracked funds matched by CIK, ${r.unmatched.length} unmatched${r.error ? " — " + r.error : ""}`);
}
