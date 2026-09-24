// Vite builds only the v2 SPA (dist/v2/index.html + dist/assets/*). This copies
// everything ELSE that the Worker serves as a static asset into dist/, so the built
// directory is a complete drop-in for the current `assets.directory`:
//   • the EXTERNAL modules the SPA imports from root paths (feed.js, palette.js,
//     credit/js/*, macro/js/*, legal/js/*, …) and the desk DATA modules refreshed
//     by the routine (ft.js, newsletters.js, credit/js/data.js, …),
//   • static files (manifest, sw.js, icons, favicon, _headers, _redirects, …),
//   • the retired top-level pages (kept as the existing edge-redirect rollback).
// Excludes build tooling, the Worker source, tests/docs, and the v2 SOURCE (Vite
// already emitted the built v2 into dist/).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

// Top-level entries NOT copied into dist (build artefacts, source, tooling).
const SKIP = new Set([
  "dist", "node_modules", ".git", ".github", ".claude",
  "tests", "docs", "src", "scripts", "v2",              // v2 = Vite's job
  "package.json", "package-lock.json", "vite.config.js", ".gitignore",
  "CLAUDE.md", "README.md",
]);

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else if (e.isFile()) fs.copyFileSync(s, d);
  }
}

let files = 0;
for (const name of fs.readdirSync(ROOT)) {
  if (SKIP.has(name)) continue;
  const s = path.join(ROOT, name), d = path.join(DIST, name);
  const st = fs.statSync(s);
  if (st.isDirectory()) copyDir(s, d);
  else if (st.isFile()) { fs.copyFileSync(s, d); files++; }
}
// The bundled SPA loads only from /assets, but the raw v2/js + v2/css modules are
// still copied so any direct module URL resolves (cross-app refs, and the browser
// unit-test specs that import a module by its /v2/js path). Vite's built
// dist/v2/index.html is kept — only the source js/css subtrees are copied.
copyDir(path.join(ROOT, "v2/js"), path.join(DIST, "v2/js"));
copyDir(path.join(ROOT, "v2/css"), path.join(DIST, "v2/css"));
// Verify the built SPA landed where the Worker will serve it.
const shell = path.join(DIST, "v2", "index.html");
if (!fs.existsSync(shell)) { console.error("postbuild: dist/v2/index.html missing — Vite build did not run?"); process.exit(1); }
console.log(`postbuild: copied static/external assets into dist/ (${files} root files + dirs); dist/v2/index.html present.`);
