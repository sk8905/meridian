// Desk-vocabulary lockstep (HOUSE_STYLE T9/T10). feed.js's DESK_CLASS/DESK_CODE
// maps are the single source of truth for a wire item's pill colour-class and
// code text. v2/js/nav-actions.js previously kept its OWN copy of these maps
// (for the Saved/Notifications panel rows) and it had already drifted from
// feed.js's values (e.g. desk "f" read "FT" here vs "myFT" in feed.js, "fund"
// read "FUND" vs "RAISE") — a saved myFT story would show the wrong code. This
// spec pins nav-actions.js to IMPORT the maps from feed.js instead of
// re-declaring them, so the two can never drift apart again.
import fs from "node:fs";
import path from "node:path";
import { ROOT, check, finish } from "./lib.mjs";

const src = fs.readFileSync(path.join(ROOT, "v2", "js", "nav-actions.js"), "utf8");

check(/import\s*\{[^}]*\bDESK_CLASS\b[^}]*\}\s*from\s*["']\/feed\.js/.test(src),
  "nav-actions.js imports DESK_CLASS from feed.js (not a local re-declaration)");
check(/import\s*\{[^}]*\bDESK_CODE\s+as\s+NF_CODE\b[^}]*\}\s*from\s*["']\/feed\.js/.test(src),
  "nav-actions.js imports DESK_CODE (as NF_CODE) from feed.js (not a local re-declaration)");
check(!/^const\s+DESK_CLASS\s*=\s*\{/m.test(src), "no local DESK_CLASS map re-declared in nav-actions.js");
check(!/^const\s+NF_CODE\s*=\s*\{/m.test(src), "no local NF_CODE map re-declared in nav-actions.js");

finish();
