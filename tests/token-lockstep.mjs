// Post-Vite cache-busting invariant (HOUSE_STYLE T1). The v2 SPA's own modules are
// bundled and content-hashed by Vite (the hash is the cache-buster), and the shared
// desk DATA modules (credit/js/data.js, legal/js/data.js, macro/js/content.js, …)
// are imported by a STABLE, tokenless URL and revalidated via _headers (no-cache +
// ETag). So NO import specifier under v2/js may carry a ?v= token anymore. A
// re-introduced token is either dead noise the build strips, or — on the tokenless
// data modules — resurrects the ?v= DRIFT that once double-instanced a module and
// blanked the Profiles view. This spec pins every v2 module import tokenless.
//
// (API fetches like "/api/rates?v=13" are endpoint version contracts, not module
// specifiers — they don't end in a module/style extension and are intentionally
// not matched here.)
//
// v2 also reaches a handful of shared ROOT modules — not under v2/js — via a
// site-absolute import ("/brief.js", "/palette.js", "/saved.js", "/rowmenu.js",
// "/feed.js", "/util.js", …), some of them dynamic (chrome.js/nav-actions.js
// `import("/saved.js")` etc). Those are just as live as anything under v2/js, and
// a stale ?v= on one of THEIR OWN imports (e.g. feed.js importing "/util.js?v=…")
// double-instances the shared module for that entry point only — the exact bug
// this spec exists to catch, just one hop removed. So the walk below follows the
// live closure: v2/js, plus every root-relative module those files reference
// (statically or via `import("/…")`), transitively, skipping only "/api/*" (API
// version query params, not module specifiers) and "/v2/js/*" (already covered).
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

// A quoted module/style/manifest specifier carrying a ?v= token. Quote-delimited so
// the fresh-build detector's RegExp literal (/…runtime\.js\?v=…/, no quotes) and API
// fetch strings (no module extension) are not caught.
const RE = /["'`]([^"'`]+\.(?:m?js|css|webmanifest))\?v=([^"'`]+)["'`]/g;
// A root-relative module specifier (static or dynamic import), used to discover the
// live closure outside v2/js. ?v= tokens are stripped from the captured path so a
// (violating) tokened reference still gets followed to its file on disk.
const REF_RE = /["'`](\/[^"'`]+\.m?js)(?:\?[^"'`]*)?["'`]/g;

const seen = new Set();
const queue = walk(JS_DIR);
let offenders = 0, files = 0;
while (queue.length) {
  const file = queue.shift();
  if (seen.has(file)) continue;
  seen.add(file);
  if (!fs.existsSync(file)) continue; // referenced but not on disk (e.g. a dynamic /api-shaped path) — not our concern here
  files++;
  const src = fs.readFileSync(file, "utf8");

  let m;
  while ((m = RE.exec(src))) {
    offenders++;
    check(false, `tokenless import violated: "${m[1]}?v=${m[2]}" in ${path.relative(ROOT, file)} — the build hash / no-cache data modules own cache-busting now`);
  }

  // Follow root-relative references (outside v2/js, already walked) to grow the closure.
  while ((m = REF_RE.exec(src))) {
    const spec = m[1];
    if (spec.startsWith("/api/") || spec.startsWith("/v2/js/")) continue;
    const abs = path.join(ROOT, spec);
    if (!seen.has(abs)) queue.push(abs);
  }
}
check(offenders === 0, `no v2 module import — including the live root-module closure (brief/palette/saved/rowmenu/feed/util/…) — carries a ?v= token (${files} files scanned; Vite hashing + no-cache data modules own busting)`);

finish();
