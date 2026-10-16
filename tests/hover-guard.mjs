// Sticky hover guard (HOUSE_STYLE R46). On iPhone a :hover style "sticks" after a tap
// — the row stays highlighted until something else is touched. Every :hover rule in
// the bundled stylesheets must therefore sit inside @media (hover:hover), and touch
// devices get a neutral :active press shade instead (v2/css/app.css).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { ROOT, check, finish } from "./lib.mjs";

const postcss = createRequire(import.meta.url)(path.join(ROOT, "node_modules", "postcss"));
const entry = fs.readFileSync(path.join(ROOT, "v2", "styles.css"), "utf8");
const files = [...entry.matchAll(/@import\s+"([^"]+)"/g)].map((m) => path.resolve(ROOT, "v2", m[1]));
check(files.length >= 10, `found the bundled stylesheets (${files.length})`);

const bad = [];
for (const f of files) {
  postcss.parse(fs.readFileSync(f, "utf8")).walkRules((r) => {
    if (!r.selector.includes(":hover")) return;
    for (let p = r.parent; p; p = p.parent) if (p.type === "atrule" && p.name === "media" && /hover\s*:\s*hover/.test(p.params)) return;
    bad.push(`${path.relative(ROOT, f)}:${r.source.start.line} ${r.selector.slice(0, 60)}`);
  });
}
check(bad.length === 0, `every :hover rule is fenced by @media (hover:hover)${bad.length ? " — " + bad.slice(0, 5).join(" | ") : ""}`);

const app = fs.readFileSync(path.join(ROOT, "v2", "css", "app.css"), "utf8");
check(/@media \(hover:none\)[\s\S]*\.g-feed-row:active/.test(app), "touch devices get a press shade on feed rows");
finish();
