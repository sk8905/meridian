// Credit-desk roster integrity (pure logic — no browser / no egress). Guards the
// coverage roster against the duplicate-profile class of bug: two manager entries for
// the SAME firm (e.g. "Rgreen Invest" + "RGreen Invest", or "Alantra" + "Alantra
// Private Debt"), which splits a firm's deals/intel across two profiles and lets one
// carry a stale AUM. Enforces:
//   (1) every manager id is unique;
//   (2) no two managers share a normalised name (case/space/punctuation-insensitive);
//   (3) every funds/intel/deals/commitments record's managerId resolves to a real
//       manager (no dangling reference — what a merge must not leave behind).
import { managers, funds, intel, deals, commitments } from "../credit/js/data.js";
import { check, checkEq, finish } from "./lib.mjs";

// (1) unique ids
const ids = managers.map((m) => m.id);
const dupIds = ids.filter((v, i) => ids.indexOf(v) !== i);
checkEq(dupIds.length, 0, `roster: every manager id is unique${dupIds.length ? ` (dupes: ${[...new Set(dupIds)].join(", ")})` : ""}`);

// (2) no duplicate firm (normalised name)
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const byNorm = new Map();
for (const m of managers) { const k = norm(m.name); (byNorm.get(k) || byNorm.set(k, []).get(k)).push(`${m.id}:${m.name}`); }
const dupNames = [...byNorm.values()].filter((g) => g.length > 1);
check(dupNames.length === 0, `roster: no two managers are the same firm${dupNames.length ? ` (dupes: ${dupNames.map((g) => g.join(" / ")).join("; ")})` : ""}`);

// (3) no dangling managerId references
const idSet = new Set(ids);
const dangling = [];
for (const [coll, rows] of [["funds", funds], ["intel", intel], ["deals", deals], ["commitments", commitments]])
  for (const r of (rows || [])) if (r && r.managerId && !idSet.has(r.managerId)) dangling.push(`${coll}:${r.id}→${r.managerId}`);
check(dangling.length === 0, `roster: every managerId reference resolves to a real manager${dangling.length ? ` (dangling: ${dangling.join(", ")})` : ""}`);

// Spot-check the two merged firms are present exactly once, in coverage, with their
// reconciled (non-stale) AUM.
const once = (re) => managers.filter((m) => re.test(m.name));
const rg = once(/rgreen invest/i);
checkEq(rg.length, 1, `roster: RGreen Invest appears exactly once${rg.length ? ` (${rg.map((m) => m.id).join(", ")})` : ""}`);
const al = once(/^alantra( private debt)?$/i);
checkEq(al.length, 1, `roster: Alantra (private debt) appears exactly once${al.length ? ` (${al.map((m) => `${m.id}:${m.name}`).join(", ")})` : ""}`);
if (al.length === 1) check(al[0].aum >= 1, `roster: Alantra's reconciled AUM is in-coverage ≥ $1bn (got ${al[0].aum})`);

finish();
