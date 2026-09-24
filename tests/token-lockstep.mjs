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

let offenders = 0, files = 0;
for (const file of walk(JS_DIR)) {
  files++;
  const src = fs.readFileSync(file, "utf8");
  let m;
  while ((m = RE.exec(src))) {
    offenders++;
    check(false, `tokenless import violated: "${m[1]}?v=${m[2]}" in ${path.relative(ROOT, file)} — the build hash / no-cache data modules own cache-busting now`);
  }
}
check(offenders === 0, `no v2 module import carries a ?v= token (${files} files scanned; Vite hashing + no-cache data modules own busting)`);

finish();
