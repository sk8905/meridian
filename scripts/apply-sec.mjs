// =============================================================================
// apply-sec.mjs — writes the SEC collectors' output into credit/js/data.js exactly,
// so no figure is re-typed by hand:
//   · backfill/sec-13f.json `panel` → replaces the HF_13F export, only when its asOf
//     is newer than the one held;
//   · backfill/sec-adv.json `byId`  → sets each hedge fund's `raum` (regulatory AUM,
//     US$bn), `raumAsOf` (the ADV filing date) and `raumSource` (its IAPD page).
//     Net `aum` / `aumAsOf` / `aumSource` are never touched.
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
  const cur = /export const HF_13F = \{[\s\S]*?\n\s*asOf:\s*"(\d{4}-\d{2}-\d{2})"/.exec(out);
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
  if (n) log.push(`raum: ${n} hedge funds updated from Form ADV`);
  return { out, log };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const src = fs.readFileSync(FILE, "utf8");
  const { out, log } = applySec(src, { sec: read("../backfill/sec-13f.json"), adv: read("../backfill/sec-adv.json") });
  console.log(log.length ? log.join("\n") : "nothing to apply");
  if (!process.argv.includes("--dry-run") && out !== src) fs.writeFileSync(FILE, out);
}
