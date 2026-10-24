// Screen ft.js (the committed myFT backfill) with the live wire's FT relevance screen
// (ftRelevant in src/index.js) so an off-beat FT headline never reaches Home — owner
// 2026-10-23, "relevance first". Run by the refresh routine right after it regenerates
// ft.js (docs/refresh-routines.md, myFT step); idempotent. Usage: node scripts/screen-ft.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(ROOT, "ft.js");
const { ftRelevant } = await import(pathToFileURL(path.join(ROOT, "src/index.js")).href);
const { FT_ITEMS } = await import(pathToFileURL(file).href + "?t=" + Date.now());
const kept = FT_ITEMS.filter((it) => ftRelevant(it.title));
const src = fs.readFileSync(file, "utf8");
const start = src.indexOf("export const FT_ITEMS = [");
const end = src.indexOf("];", start);
if (start < 0 || end < 0) { console.error("screen-ft: FT_ITEMS array not found"); process.exit(1); }
const out = src.slice(0, start) + "export const FT_ITEMS = " + JSON.stringify(kept, null, 2) + src.slice(end + 1);
fs.writeFileSync(file, out);
console.log(`screen-ft: kept ${kept.length} of ${FT_ITEMS.length} (dropped ${FT_ITEMS.length - kept.length} off-beat)`);
for (const it of FT_ITEMS.filter((x) => !ftRelevant(x.title))) console.log("  - " + it.title);
