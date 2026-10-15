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

// Record spans inside an array: a record starts on a line beginning with "{" and ends
// on the line where its brace depth returns to zero (braces inside string literals
// are ignored). Most records are ONE line; older hand-written legal records span
// several (`{\n  id: "u137", …\n},`) — both forms are handled the same way.
function spans(lines, s, e) {
  const out = [];
  for (let i = s + 1; i < e; i++) {
    if (!/^\s*\{/.test(lines[i])) continue;
    let depth = 0, q = null, j = i;
    for (; j < e; j++) {
      const L = lines[j];
      for (let k = 0; k < L.length; k++) {
        const c = L[k];
        if (q) { if (c === "\\") k++; else if (c === q) q = null; continue; }
        if (c === '"' || c === "'" || c === "`") q = c;
        else if (c === "{") depth++;
        else if (c === "}") depth--;
      }
      if (depth <= 0) break;
    }
    out.push([i, j]);
    i = j;
  }
  return out;
}
const spanText = (lines, a, b) => lines.slice(a, b + 1).join("\n");

export function readRecords(file, name) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const [s, e] = bounds(lines, name);
  return spans(lines, s, e).map(([a, b]) => ({ index: a, end: b, obj: parseLine(spanText(lines, a, b)), line: spanText(lines, a, b) }));
}

export function updateRecords(file, name, mutate, { dryRun = false } = {}) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const [s, e] = bounds(lines, name);
  let changed = 0;
  // Walk spans bottom-up so a multi-line record collapsing to one line never shifts
  // the indices of spans still to be visited.
  for (const [a, b] of spans(lines, s, e).reverse()) {
    const text = spanText(lines, a, b);
    const obj = parseLine(text);
    if (!mutate(obj)) continue;
    const indent = lines[a].match(/^\s*/)[0];
    const comma = /,\s*$/.test(lines[b]) ? "," : "";
    lines.splice(a, b - a + 1, indent + JSON.stringify(obj) + comma);
    changed++;
  }
  if (changed && !dryRun) fs.writeFileSync(file, lines.join("\n"));
  return changed;
}

// Append records (one JSON line each) at the end of an array. Returns the count.
export function appendRecords(file, name, objs, { dryRun = false } = {}) {
  if (!objs.length) return 0;
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const [s, e] = bounds(lines, name);
  let last = e - 1;
  while (last > s && !/^\s*\{/.test(lines[last])) last--;
  if (last > s && !/,\s*$/.test(lines[last])) lines[last] += ",";
  const indent = last > s ? lines[last].match(/^\s*/)[0] : "  ";
  lines.splice(e, 0, ...objs.map((o) => indent + JSON.stringify(o) + ","));
  if (!dryRun) fs.writeFileSync(file, lines.join("\n"));
  return objs.length;
}

// Remove records whose id is in `ids`. Returns the count removed.
export function deleteRecords(file, name, ids, { dryRun = false } = {}) {
  const want = new Set(ids);
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const [s, e] = bounds(lines, name);
  let n = 0;
  for (const [a, b] of spans(lines, s, e).reverse()) {
    if (!want.has(parseLine(spanText(lines, a, b)).id)) continue;
    lines.splice(a, b - a + 1); n++;
  }
  if (n && !dryRun) fs.writeFileSync(file, lines.join("\n"));
  return n;
}

// Highest numeric id with a given prefix ("m", "f", "i", "d") across BOTH the
// hand-written `id: "m12"` and the JSON `"id":"m12"` forms (R29 — a scanner that
// misses one form collides).
export function maxId(file, prefix) {
  const src = fs.readFileSync(file, "utf8");
  let max = 0;
  for (const m of src.matchAll(new RegExp(`(?:\\bid:\\s*|"id"\\s*:\\s*)"${prefix}(\\d+)"`, "g"))) max = Math.max(max, +m[1]);
  return max;
}
