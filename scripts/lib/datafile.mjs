// =============================================================================
// datafile.mjs — record-level, re-runnable edits to the desk data modules.
//
// The data modules (credit/js/data.js, legal/js/data.js) hold each array record on
// ONE line inside `export const <name> = [ … ];`. The refresh routines append/edit
// those lines every ~2 hours, so a structural fix must never be a hand-merge: it is a
// script that reads the CURRENT file, changes only the records it needs to, and
// rewrites only those lines. On a rebase conflict take origin/main and re-run the
// script (docs/implementation-plan.md §0).
//
//   const recs = readRecords(file, "funds");          // [{ index, obj, line }]
//   const n = updateRecords(file, "funds", (obj) => { …mutate…; return changed; });
//
// A changed record is re-serialised as one JSON line (JS-object lines become JSON —
// same data, same key order). Unchanged lines are left byte-for-byte as they were.
// =============================================================================
import fs from "node:fs";

function bounds(lines, name) {
  const start = lines.findIndex((l) => l.startsWith(`export const ${name} = [`));
  if (start < 0) throw new Error(`datafile: no "export const ${name} = [" in file`);
  let end = start + 1;
  while (end < lines.length && !/^\];/.test(lines[end])) end++;
  if (end >= lines.length) throw new Error(`datafile: unterminated array ${name}`);
  return [start, end];
}

// Parse one record line (JSON or JS-object literal). The file is our own committed
// data module, so evaluating a literal from it is no wider than importing it.
function parseLine(line) {
  const body = line.trim().replace(/,$/, "");
  try { return JSON.parse(body); } catch { /* JS object literal */ }
  return Function(`"use strict"; return (${body});`)();
}

export function readRecords(file, name) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const [s, e] = bounds(lines, name);
  const out = [];
  for (let i = s + 1; i < e; i++) if (/^\s*\{/.test(lines[i])) out.push({ index: i, obj: parseLine(lines[i]), line: lines[i] });
  return out;
}

export function updateRecords(file, name, mutate, { dryRun = false } = {}) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const [s, e] = bounds(lines, name);
  let changed = 0;
  for (let i = s + 1; i < e; i++) {
    if (!/^\s*\{/.test(lines[i])) continue;
    const obj = parseLine(lines[i]);
    if (!mutate(obj)) continue;
    const indent = lines[i].match(/^\s*/)[0];
    const comma = /,\s*$/.test(lines[i]) ? "," : "";
    lines[i] = indent + JSON.stringify(obj) + comma;
    changed++;
  }
  if (changed && !dryRun) fs.writeFileSync(file, lines.join("\n"));
  return changed;
}
