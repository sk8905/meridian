// Hygiene ratchets (consistency audit 2026-10-16, HOUSE_STYLE T16 / §7b). Source-only, fast.
//   • Fixed-time waits in specs (waitForTimeout(n), setTimeout(r, n)) — a spec waits for a
//     CONDITION. The suite still carries legacy ones; the count may only fall, and the
//     style / geometry specs carry none.
//   • !important in the stylesheets (T16) — the count may only fall.
//   • A self-calling helper: no top-level function in feed.js / util.js calls itself.
// Lower a BUDGET when you remove debt; never raise it.
import fs from "node:fs";
import path from "node:path";
import { ROOT, check, finish } from "./lib.mjs";

const WAIT_BUDGET = 507;        // audit 2026-10-16 (513 before it; incl. lib.mjs swipe pacing)
const IMPORTANT_BUDGET = 65;    // audit 2026-10-16 (75 before the dead-CSS purge)
const NO_WAITS = ["style-r43.mjs", "style-r43-phone.mjs", "style-consistency.mjs", "phone-geometry.mjs", "phone-trim.mjs", "spec-hygiene.mjs"];

const tdir = path.join(ROOT, "tests");
const WAIT = /waitForTimeout\(|setTimeout\(r, \d/g;
let waits = 0;
for (const f of fs.readdirSync(tdir).filter((f) => f.endsWith(".mjs") && f !== "spec-hygiene.mjs")) {
  const n = (fs.readFileSync(path.join(tdir, f), "utf8").match(WAIT) || []).length;
  waits += n;
  if (NO_WAITS.includes(f)) check(n === 0, `${f}: no fixed-time waits (${n})`);
}
check(waits <= WAIT_BUDGET, `fixed-time waits in specs only fall: ${waits} ≤ ${WAIT_BUDGET}`);

const CSS = ["premium.css", "tui.css", "header.css", "v2/css/app.css", "home.css", "credit/css/styles.css", "legal/css/styles.css", "macro/css/styles.css", "dashboard.css", "v2/css/restructuring.css", "feed.css", "palette.js"];
const imp = CSS.reduce((n, f) => n + (fs.readFileSync(path.join(ROOT, f), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").match(/!important/g) || []).length, 0);
check(imp <= IMPORTANT_BUDGET, `!important in the stylesheets only falls (T16): ${imp} ≤ ${IMPORTANT_BUDGET}`);

for (const f of ["feed.js", "util.js"]) {
  const src = fs.readFileSync(path.join(ROOT, f), "utf8");
  const selfCalls = [];
  for (const m of src.matchAll(/^export function (\w+)\s*\(|^function (\w+)\s*\(/gm)) {
    const name = m[1] || m[2], start = m.index + m[0].length;
    // the function body: from its first "{" to the matching "}"
    let i = src.indexOf("{", start), d = 0, j = i;
    for (; j < src.length; j++) { if (src[j] === "{") d++; else if (src[j] === "}" && --d === 0) break; }
    if (new RegExp(`\\b${name}\\s*\\(`).test(src.slice(i + 1, j))) selfCalls.push(name);
  }
  check(!selfCalls.length, `${f}: no recursive / self-calling helper (${selfCalls.join(", ") || "none"})`);
}
finish();
