// tests/run.mjs — run every spec in this directory and report.
//   node tests/run.mjs            all specs
//   node tests/run.mjs swipe nav  just those specs
//
// Specs run CONCURRENTLY in a bounded pool (each spec is self-contained — its own
// localhost server on a random port and its own headless browser — so they don't
// interfere). Full coverage is unchanged; only the wall-clock shrinks. Output is
// captured per spec and printed as one block when that spec finishes, so the
// interleaved runs stay readable. Concurrency defaults to the CPU count (capped at
// 4 so we never thrash the browser); override with TEST_CONCURRENCY=N.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const all = fs.readdirSync(dir).filter((f) => f.endsWith(".mjs") && !["run.mjs", "lib.mjs"].includes(f)).sort();
const picked = process.argv.slice(2);
const specs = picked.length ? all.filter((f) => picked.some((p) => f.startsWith(p))) : all;

const envN = parseInt(process.env.TEST_CONCURRENCY || "", 10);
const concurrency = Math.max(1, Number.isFinite(envN) && envN > 0 ? envN : Math.min(os.cpus().length || 4, 4));

let failed = 0, done = 0;
const t0 = Date.now();
console.log(`running ${specs.length} spec(s), ${concurrency} at a time\n`);

function runSpec(spec) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(dir, spec)], { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    const to = setTimeout(() => { try { child.kill("SIGKILL"); } catch { /* */ } }, 300000);
    child.stdout.on("data", (d) => { out += d; });
    child.stderr.on("data", (d) => { out += d; });
    child.on("close", (code) => {
      clearTimeout(to);
      const ok = code === 0;
      if (!ok) failed++;
      done++;
      // Print the spec's full output as one contiguous block, prefixed by a header
      // that carries a live progress counter.
      process.stdout.write(`\n=== ${spec} (${done}/${specs.length}${ok ? "" : " — FAILED"}) ===\n${out.trimEnd()}\n`);
      if (!ok) console.error(`>>> ${spec} FAILED`);
      resolve();
    });
  });
}

// Bounded worker pool: keep `concurrency` specs in flight, feeding the next as each
// finishes.
const queue = specs.slice();
async function worker() { while (queue.length) await runSpec(queue.shift()); }
await Promise.all(Array.from({ length: Math.min(concurrency, specs.length) }, worker));

console.log(`\n${specs.length - failed}/${specs.length} specs passed in ${Math.round((Date.now() - t0) / 1000)}s`);
process.exit(failed ? 1 : 0);
