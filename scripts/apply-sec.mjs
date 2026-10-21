// =============================================================================
// apply-sec.mjs — writes the SEC collectors' output into credit/js/data.js exactly,
// so no figure is re-typed by hand:
//   · backfill/sec-13f.json `panel` → replaces the HF_13F export, only when its asOf
//     is newer than the one held;
//   · backfill/sec-adv.json `byId`  → sets each hedge fund's `raum` (regulatory AUM,
//     US$bn), `raumAsOf` (the ADV filing date) and `raumSource` (its IAPD page).
//     Net `aum` / `aumAsOf` / `aumSource` are never touched.
//   · backfill/sec-adv.json `byManager` → the same three fields on a CREDIT MANAGER
//     matched by the CRD of the IAPD page its profile cites (collect-adv.mjs).
// Usage: node scripts/apply-sec.mjs            (edits credit/js/data.js in place)
//        node scripts/apply-sec.mjs --dry-run  (prints what would change)
// =============================================================================
import fs from "node:fs";

const FILE = new URL("../credit/js/data.js", import.meta.url);
const read = (p) => { try { return JSON.parse(fs.readFileSync(new URL(p, import.meta.url), "utf8")); } catch { return null; } };

export function applySec(src, { sec, adv } = {}) {
  let out = src; const log = [];
  // 13F panel.
  const panel = sec && sec.panel;
  const cur = /export const HF_13F = \{[\s\S]*?\n\s*"?asOf"?:\s*"(\d{4}-\d{2}-\d{2})"/.exec(out);   // JS or JSON key form
  if (panel && panel.asOf && panel.consensus && panel.consensus.length && (!cur || panel.asOf > cur[1])) {
    const start = out.indexOf("export const HF_13F = {");
    const end = out.indexOf("\n};", start);
    if (start >= 0 && end > start) {
      out = out.slice(0, start) + `export const HF_13F = ${JSON.stringify(panel, null, 2)}` + out.slice(end + 2);
      log.push(`HF_13F: ${cur ? cur[1] : "none"} → ${panel.asOf} (${panel.quarter}, ${panel.consensus.length} consensus, ${panel.moves.length} moves)`);
    }
  }
  // Regulatory AUM on each hedge-fund line ({ id: "hN", … },).
  const byId = (adv && adv.byId) || {};
  let n = 0;
  out = out.replace(/^(  \{ id: "(h\d+)",.*?)(,\s*raum: [\d.]+, raumAsOf: (?:"[^"]*"|null), raumSource: (?:"[^"]*"|null))?( \},?)$/gm, (line, head, id, old, tail) => {
    const a = byId[id];
    if (!a || !(a.raum > 0)) return line;
    const add = `, raum: ${a.raum}, raumAsOf: ${JSON.stringify(a.filed || null)}, raumSource: ${JSON.stringify(a.src || null)}`;
    if (old === add) return line;
    n++; return head + add + tail;
  });
  // …and the JSON form ({"id":"hN",…},) that scripts/lib/datafile.mjs writes when a
  // record is edited by a script (apply-research, normalise-data) — both forms occur.
  out = out.replace(/^(\s*)(\{"id":"(h\d+)",.*\})(,?)$/gm, (line, ind, body, id, comma) => {
    const a = byId[id];
    if (!a || !(a.raum > 0)) return line;
    let r; try { r = JSON.parse(body); } catch { return line; }
    if (r.raum === a.raum && r.raumAsOf === (a.filed || null) && r.raumSource === (a.src || null)) return line;
    r.raum = a.raum; r.raumAsOf = a.filed || null; r.raumSource = a.src || null;
    n++; return ind + JSON.stringify(r) + comma;
  });
  if (n) log.push(`raum: ${n} hedge funds updated from Form ADV`);
  // Credit managers (byManager, matched by CRD). Any manager line form — a JS literal is
  // re-serialised as JSON when it changes (scripts/lib/datafile.mjs does the same).
  const byM = (adv && adv.byManager) || {};
  let nm = 0;
  const start = out.indexOf("export const managers = ["), end = start >= 0 ? out.indexOf("\n];", start) : -1;
  if (start >= 0 && end > start && Object.keys(byM).length) {
    const block = out.slice(start, end).replace(/^(\s*)(\{\s*"?id"?\s*:\s*"(m\d+)".*\})(,?)$/gm, (line, ind, body, id, comma) => {
      const a = byM[id];
      if (!a || !(a.raum > 0)) return line;
      let r; try { r = JSON.parse(body); } catch { try { r = Function(`"use strict"; return (${body});`)(); } catch { return line; } }
      if (r.raum === a.raum && r.raumAsOf === (a.filed || null) && r.raumSource === (a.src || null)) return line;
      r.raum = a.raum; r.raumAsOf = a.filed || null; r.raumSource = a.src || null;
      nm++; return ind + JSON.stringify(r) + comma;
    });
    out = out.slice(0, start) + block + out.slice(end);
  }
  if (nm) log.push(`raum: ${nm} credit managers updated from Form ADV (matched by CRD)`);
  return { out, log };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const src = fs.readFileSync(FILE, "utf8");
  const { out, log } = applySec(src, { sec: read("../backfill/sec-13f.json"), adv: read("../backfill/sec-adv.json") });
  console.log(log.length ? log.join("\n") : "nothing to apply");
  if (!process.argv.includes("--dry-run") && out !== src) fs.writeFileSync(FILE, out);
}
