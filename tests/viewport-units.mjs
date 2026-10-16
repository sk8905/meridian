// Viewport units (HOUSE_STYLE R47). In iPhone Safari `vh` is the height with the
// toolbar HIDDEN, so a 100vh box is taller than the screen and every vh-sized panel
// resizes as the toolbar slides in and out — the page jumps. Every `vh` declaration
// in the bundled stylesheets must be followed by a modern twin: `dvh` for full-height
// page boxes (height / min-height), `svh` (stable) for everything else. The plain vh
// line stays as the fallback for older engines.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { ROOT, check, finish } from "./lib.mjs";

const postcss = createRequire(import.meta.url)(path.join(ROOT, "node_modules", "postcss"));
const entry = fs.readFileSync(path.join(ROOT, "v2", "styles.css"), "utf8");
const files = [...entry.matchAll(/@import\s+"([^"]+)"/g)].map((m) => path.resolve(ROOT, "v2", m[1]));
const bad = [];
for (const f of files) {
  postcss.parse(fs.readFileSync(f, "utf8")).walkDecls((d) => {
    if (!/\d(\.\d+)?vh\b/.test(d.value) || (d.parent && d.parent.type === "atrule")) return;
    const n = d.next();
    if (!(n && n.type === "decl" && n.prop === d.prop && /[ds]vh\b/.test(n.value))) bad.push(`${path.relative(ROOT, f)}:${d.source.start.line} ${d.prop}:${d.value}`);
  });
}
check(bad.length === 0, `every vh declaration has a dvh/svh twin${bad.length ? " — " + bad.slice(0, 5).join(" | ") : ""}`);
finish();
