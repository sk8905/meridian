// =============================================================================
// date-repair-list.mjs — the nightly verifier's bounded DATE-REPAIR worklist.
//
// Legal items with no date, or with a date that was only estimated
// (`dateEstimated: true` — shown as "≈" / "c." in the app), need their exact
// publication date from the page itself. This prints a rotating slice (undated first,
// then estimated, oldest-touched first by a daily rotation) so each night repairs a
// different batch. tests/data-integrity.mjs ratchets both counts — tighten
// MAX_UNDATED_LEGAL / MAX_ESTIMATED_LEGAL to the new numbers after a repair.
//
// Usage: node scripts/date-repair-list.mjs [--size=30] [--json]
// =============================================================================
import * as L from "../legal/js/data.js";
const args = process.argv.slice(2);
const opt = (n, d) => { const a = args.find((x) => x.startsWith(n + "=")); return a ? parseInt(a.slice(n.length + 1), 10) || d : d; };
const size = opt("--size", 30);
const firmName = Object.fromEntries((L.firms || []).map((f) => [f.id, f.name]));
const undated = (L.items || []).filter((i) => !i.date);
const estimated = (L.items || []).filter((i) => i.date && i.dateEstimated);
// Rotate the estimated pool by day so successive nights take different items.
const day = Math.floor(Date.now() / 86400000);
const off = estimated.length ? (day * size) % estimated.length : 0;
const est = [...estimated.slice(off), ...estimated.slice(0, off)];
const pick = [...undated, ...est].slice(0, size).map((i) => ({ id: i.id, firm: firmName[i.firm] || i.firm, title: i.title, url: i.url, current: i.date || null, kind: i.date ? "estimated" : "undated" }));
if (args.includes("--json")) console.log(JSON.stringify({ undated: undated.length, estimated: estimated.length, worklist: pick }, null, 2));
else {
  console.log(`DATE REPAIR — ${undated.length} undated + ${estimated.length} estimated legal items; tonight's ${pick.length}:`);
  for (const p of pick) console.log(`  ${p.id} [${p.kind}${p.current ? " " + p.current : ""}] ${p.firm} — ${p.title}\n      ${p.url}`);
}
