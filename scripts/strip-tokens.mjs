// One-off codemod for the Vite migration: remove the ?v= cache-buster tokens from
// module import specifiers (Vite content-hashes instead) and unwrap the runtime's
// vurl() helper so dynamic imports are plain, statically-analysable specifiers.
// Tokens were only cache-busters — the app resolves identically without them — so
// this is safe in the current source-served mode too (verified by the test suite).
import fs from "node:fs";
import path from "node:path";

const ROOT = "/home/user/meridian";
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(mjs|js)$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = walk(path.join(ROOT, "v2/js"));
let changed = 0, edits = 0;
for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  const before = s;
  // 1) unwrap import(vurl("x")) -> import("x")  (and backtick form)
  s = s.replace(/vurl\(\s*(["'`][^"'`]+["'`])\s*\)/g, "$1");
  // 2) ?v=${V} / &v=${V} inside template-literal specifiers
  s = s.replace(/[?&]v=\$\{V\}/g, "");
  // 3) literal ?v=<token> right after an asset extension (import specifiers only)
  s = s.replace(/(\.(?:js|mjs|css|webmanifest))\?v=[0-9A-Za-z._-]+/g, "$1");
  if (s !== before) { fs.writeFileSync(f, s); changed++; edits += before.split(/\?v=|vurl\(/).length - s.split(/\?v=|vurl\(/).length; }
}
console.log(`files changed: ${changed}/${files.length}`);
// sanity: no ?v= or vurl( left in v2/js
const left = files.filter((f) => /[?&]v=|vurl\(/.test(fs.readFileSync(f, "utf8")));
console.log(left.length ? "STILL HAS TOKENS/vurl:\n  " + left.join("\n  ") : "clean: no ?v= or vurl( remain in v2/js");
