// scripts/audit-wire.mjs — newswire scope audit (HOUSE_STYLE R4c). Fetches every LIVE
// source in FEED_SOURCES (src/index.js) with curl, runs each item through the Worker's
// OWN gates (feedSourceKeep → the ~6-day cutoff → feedQualityKeep), and prints what the
// wire would carry, grouped by source, plus what each gate dropped. Read the KEPT list
// against R4c's four inclusion kinds; anything off-universe is a filter gap to fix.
//   node scripts/audit-wire.mjs [--json out.json] [--dropped]
import { execFileSync } from "node:child_process";
import fs from "node:fs";
globalThis.caches = { default: { match: async () => null, put: async () => {} } };
const W = await import("../src/index.js");
const args = process.argv.slice(2);
const out = { kept: [], droppedQuality: [] };
const cutoff = Date.now() - 6 * 864e5;
for (const f of W.FEED_SOURCES) {
  let txt = "";
  try { txt = execFileSync("curl", ["-sL", "-m", "25", "-A", "Mozilla/5.0 (compatible; WireAudit/1.0)", f.url], { maxBuffer: 32 << 20 }).toString(); } catch { /* source down */ }
  if (!txt) { process.stderr.write(`EMPTY ${f.source}\n`); continue; }
  let items = [];
  try { items = W.feedParse(txt, f); } catch { /* unparsable */ }
  const passSrc = items.filter((x) => W.feedSourceKeep(x, f));
  passSrc.sort((a, b) => (b.when ? b.when.getTime() : 0) - (a.when ? a.when.getTime() : 0));
  for (const it of passSrc.slice(0, f.cap || 8)) {
    if (it.when && it.when.getTime() < cutoff) continue;
    const row = { source: it.source, title: it.title, url: it.url, flags: ["hdg", "fi", "legal", "substack", "myft", "research"].filter((k) => it[k]).join(",") };
    (W.feedQualityKeep(it) ? out.kept : out.droppedQuality).push(row);
  }
}
const by = (rows) => rows.reduce((m, r) => ((m[r.source] = m[r.source] || []).push(r.title), m), {});
for (const [s, ts] of Object.entries(by(out.kept))) { console.log(`\n## ${s} (${ts.length})`); ts.forEach((t) => console.log("  + " + t)); }
if (args.includes("--dropped")) for (const [s, ts] of Object.entries(by(out.droppedQuality))) { console.log(`\n## DROPPED ${s} (${ts.length})`); ts.forEach((t) => console.log("  - " + t)); }
console.log(`\nkept ${out.kept.length} · dropped by feedQualityKeep ${out.droppedQuality.length}`);
const j = args.indexOf("--json"); if (j >= 0 && args[j + 1]) fs.writeFileSync(args[j + 1], JSON.stringify(out, null, 1));
