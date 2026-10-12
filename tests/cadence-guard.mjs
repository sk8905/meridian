// Cadence guard (pure, no browser). The Wire refresh moved from a fixed 5×/day
// schedule (05:00 / 09:00 / 12:00 / 17:00 / 21:00) to ~every 2 hours, and the briefing
// to a single edition rewritten every run. The old cadence language was swept out of
// the code (user-facing stamps + comments). This spec stops the retired phrasings from
// creeping back into the source — a cheap hygiene lock so "Last refresh" never again
// asserts a schedule the cron doesn't run.
import { check, finish, ROOT } from "./lib.mjs";
import fs from "node:fs";
import path from "node:path";

// Retired cadence literals. Narrow by design — only the exact phrasings that were
// genuinely misleading, so a new comment that merely contains "5" can't trip it.
const BANNED = [
  /five-times-daily/i,
  /four-times-daily/i,
  /\btri-daily\b/i,
  /5×\/day/,
  /5x\/day/i,
  // the fixed-slot schedule claim, comma-separated and tilde tolerant
  // (catches "05:00, 09:00, 12:00, 17:00" and "~05:00, ~09:00, …"); a slash-separated
  // "don't hard-code a 05:00/09:00 label" warning is intentionally NOT matched.
  /~?0?5:00,\s*~?0?9:00,\s*~?12:00,\s*~?17:00/,
  /\bfive runs\b/i,   // "the five runs land each day …" — the retired 5×/day framing
];

// Hand-authored source only. home-data.js is generated (scanned via its generator).
const CODE = [
  "v2/js/home/glance.js", "v2/js/chrome.js", "v2/js/status.js", "v2/js/nav-actions.js",
  "macro/js/content.js", "src/index.js", "vite.config.js",
  "scripts/gen-home-data.mjs", "scripts/manager-coverage.mjs", "scripts/freshness-audit.mjs",
  "briefings.js", "research.js", "newsletters.js", "ft.js",
];

// Active docs, discovered so a NEW doc is covered automatically. The refresh cadence
// drifted in the governing docs once already (why this spec scans them now); excludes
// vendored/built trees.
function walkMd(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === "dist" || e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkMd(full, acc);
    else if (e.name.endsWith(".md")) acc.push(path.relative(ROOT, full));
  }
  return acc;
}

const FILES = [...CODE, ...walkMd(ROOT, [])];

const hits = [];
for (const rel of FILES) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  const txt = fs.readFileSync(p, "utf8");
  txt.split("\n").forEach((line, i) => {
    for (const re of BANNED) if (re.test(line)) hits.push(`${rel}:${i + 1}  ${line.trim().slice(0, 70)}`);
  });
}

check(hits.length === 0, `cadence-guard: no retired 5×/day schedule language in source or docs${hits.length ? ` — found:\n    ${hits.join("\n    ")}` : ""}`);

finish();
