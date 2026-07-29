// Cache-token lockstep (HOUSE_STYLE T1). A shared v2 module imported by more than
// one file MUST carry the SAME ?v= token everywhere. A drift silently double-
// instances the module AND — on a warm HTTP cache — lets one importer load a
// stale copy under an old token while another loads the fresh one. That is what
// stranded the Profiles view on an old credit/legal detail.js (its viewManager /
// viewHedgeFund / viewFirm imports) while the desks loaded the current build, so
// tapping any profile row failed. This spec pins every shared token in lockstep.
import fs from "node:fs";
import path from "node:path";
import { ROOT, check, finish } from "./lib.mjs";

const JS_DIR = path.join(ROOT, "v2", "js");
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith(".js") ? [p] : [];
  });
}

// module path (query-less) -> set of tokens seen across all importers
const RE = /["'`](\/v2\/js\/[^"'`?]+\.js|\.{1,2}\/[^"'`?]+\.js)\?v=([^"'`]+)["'`]/g;
const seen = new Map();
for (const file of walk(JS_DIR)) {
  const src = fs.readFileSync(file, "utf8");
  let m;
  while ((m = RE.exec(src))) {
    // normalise relative specifiers to an absolute-ish key by basename+dir tail
    const key = m[1].replace(/^\.{1,2}\//, "");
    if (!seen.has(key)) seen.set(key, new Map());
    const tokens = seen.get(key);
    tokens.set(m[2], [...(tokens.get(m[2]) || []), path.relative(ROOT, file)]);
  }
}

let drift = 0;
for (const [mod, tokens] of seen) {
  if (tokens.size > 1) {
    drift++;
    const detail = [...tokens.entries()].map(([t, files]) => `${t} (${files.join(", ")})`).join("  vs  ");
    check(false, `token lockstep for ${mod}: ${detail}`);
  }
}
check(drift === 0, `all shared v2 modules imported at a single ?v= token (${seen.size} modules checked)`);

finish();
