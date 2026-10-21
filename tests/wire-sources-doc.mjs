// The fixed wire source set (owner 2026-10-21): HOUSE_STYLE §8.3's table and FEED_SOURCES
// in src/index.js name exactly the same sources — no "preferred" list drifting from the code.
import fs from "node:fs";
import path from "node:path";
import { check, finish, ROOT } from "./lib.mjs";
import { FEED_SOURCES } from "../src/index.js";

const doc = fs.readFileSync(path.join(ROOT, "docs/HOUSE_STYLE.md"), "utf8");
const block = (doc.split("<!-- wire-sources:start -->")[1] || "").split("<!-- wire-sources:end -->")[0];
const docNames = new Set(block.split("\n").filter((l) => /^\| /.test(l) && !/^\| Source \|/.test(l) && !/^\|---/.test(l))
  .map((l) => l.split("|")[1].trim().replace(/\s*\(.*\)$/, "")));
const codeNames = new Set(FEED_SOURCES.map((f) => f.source));
const missingInDoc = [...codeNames].filter((n) => !docNames.has(n));
const missingInCode = [...docNames].filter((n) => !codeNames.has(n));
check(docNames.size > 20, `the §8.3 table lists the wire sources (${docNames.size})`);
check(missingInDoc.length === 0, `every live wire source is in the §8.3 table (missing: ${missingInDoc.join(", ") || "none"})`);
check(missingInCode.length === 0, `every §8.3 source is live in FEED_SOURCES (not wired: ${missingInCode.join(", ") || "none"})`);
finish();
