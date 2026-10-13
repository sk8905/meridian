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

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  const out = { generated: new Date().toISOString(), file: file ? file.split("/").pop() : null };
  if (!file || !fs.existsSync(file)) { console.log(JSON.stringify({ ...out, error: "no adviser file" }, null, 1)); process.exit(2); }
  const r = matchAdv(parseCsv(fs.readFileSync(file, "latin1")), C.HEDGE_FUNDS || []);
  console.log(JSON.stringify({ ...out, ...r }, null, 1));
  console.error(`form ADV: ${Object.keys(r.byId).length} tracked funds matched by CIK, ${r.unmatched.length} unmatched${r.error ? " — " + r.error : ""}`);
}
