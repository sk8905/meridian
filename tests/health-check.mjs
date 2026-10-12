// Coverage for scripts/health-check.mjs — the daily "is Wire functioning?" aggregator
// the health-email routine runs. Pure: it shells out to the audit + git + node --check,
// so we just assert the contract the email depends on (a parseable verdict, each issue
// carrying a detail + a proposed solution, and the exit code matching the verdict).
import { check, finish, ROOT } from "./lib.mjs";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

check(fs.existsSync(path.join(ROOT, "scripts/health-check.mjs")), "health-check: scripts/health-check.mjs exists");

const r = spawnSync("node", [path.join(ROOT, "scripts/health-check.mjs"), "--json"], { cwd: ROOT, encoding: "utf8", maxBuffer: 8 << 20 });
let j = null;
try { j = JSON.parse(r.stdout); } catch { /* reported below */ }
check(!!j, "health-check: --json emits parseable JSON");

if (j) {
  check(["GOOD", "ATTENTION", "FAIL"].includes(j.verdict), `health-check: verdict is one of GOOD/ATTENTION/FAIL (${j.verdict})`);
  check(typeof j.ok === "boolean", "health-check: carries a boolean ok");
  check(Array.isArray(j.fails) && Array.isArray(j.attention), "health-check: fails[] and attention[] are arrays");
  const all = [...j.fails, ...j.attention];
  check(all.every((i) => i.area && i.detail && i.solution), "health-check: every issue carries an area, a detail AND a proposed solution");
  check(all.every((i) => i.severity === "fail" || i.severity === "attention"), "health-check: every issue is severity fail|attention");
  // The verdict is internally consistent with the issue lists.
  const expect = j.fails.length ? "FAIL" : j.attention.length ? "ATTENTION" : "GOOD";
  check(j.verdict === expect, `health-check: verdict matches the issue lists (${j.verdict} vs ${expect})`);
  check(j.ok === (j.verdict === "GOOD"), "health-check: ok is true exactly when the verdict is GOOD");
  // Exit code is 0 only on a clean bill of health, so a routine/CI can branch on it.
  check((r.status === 0) === j.ok, `health-check: exit code reflects the verdict (status ${r.status}, ok ${j.ok})`);
}

finish();
