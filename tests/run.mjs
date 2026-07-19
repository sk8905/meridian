// tests/run.mjs — run every spec in this directory sequentially and report.
//   node tests/run.mjs            all specs
//   node tests/run.mjs swipe nav  just those specs
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const all = fs.readdirSync(dir).filter((f) => f.endsWith(".mjs") && !["run.mjs", "lib.mjs"].includes(f)).sort();
const picked = process.argv.slice(2);
const specs = picked.length ? all.filter((f) => picked.some((p) => f.startsWith(p))) : all;

let failed = 0;
const t0 = Date.now();
for (const spec of specs) {
  console.log(`\n=== ${spec} ===`);
  const r = spawnSync(process.execPath, [path.join(dir, spec)], { stdio: "inherit", timeout: 300000 });
  if (r.status !== 0) { failed++; console.error(`>>> ${spec} FAILED`); }
}
console.log(`\n${specs.length - failed}/${specs.length} specs passed in ${Math.round((Date.now() - t0) / 1000)}s`);
process.exit(failed ? 1 : 0);
