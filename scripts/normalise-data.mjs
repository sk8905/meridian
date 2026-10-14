// =============================================================================
// normalise-data.mjs — deterministic, re-runnable data hygiene for credit/js/data.js
// (docs/implementation-plan.md A5 + A7). Idempotent: a second run changes nothing.
//
// What it does — and the evidence each change rests on (never a guess, never FX):
//   (Manager / investor AUM is USD by convention — HOUSE_STYLE R29, restated once at
//   AUM_FX with `aumFrom` provenance — so it needs no per-record currency.)
//   funds.ccy — currency of the fund's size figures, set ONLY when its own sourced
//       `description` states targetSize / raised / hardCap (±3%) with a currency.
//   funds.status — synonyms folded onto FUND_STATUS ("Launched"/"Fundraising" → "Open");
//       genuinely different lifecycle words ("Investing", "Operating", "Closed") are
//       NOT mapped (that would assert a close that may not have happened).
//   funds.strategy — exact synonyms folded onto STRATEGIES ("Direct Lending",
//       "Middle Market Direct Lending" → "Senior Direct Lending"); others untouched.
//   funds.domicile / domicileEstimated / structure — "Luxembourg (SCSp)" →
//       domicile "Luxembourg" + structure "SCSp"; "[est]" → domicileEstimated:true;
//       "Undisclosed" and geographies misfiled as a domicile ("Pan-European",
//       "Global", "Europe") → null; "US"/"UK" → full country name. `structure` is
//       also read from the description when it names exactly one vehicle form.
//
// Usage: node scripts/normalise-data.mjs [--dry-run]
// =============================================================================
import path from "node:path";
import { fileURLToPath } from "node:url";
import { updateRecords } from "./lib/datafile.mjs";
import { ccyFor } from "./lib/money.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(ROOT, "credit", "js", "data.js");
const DRY = process.argv.includes("--dry-run");

const STATUS_SYN = { Launched: "Open", Fundraising: "Open" };
const STRATEGY_SYN = { "Direct Lending": "Senior Direct Lending", "Direct lending": "Senior Direct Lending", "Middle Market Direct Lending": "Senior Direct Lending" };
const NOT_A_DOMICILE = /^(undisclosed|pan-european|europe|global( \/ non-european)?|global \(incl\. europe\)|ucits \(europe\))$/i;
const COUNTRY = { US: "United States", "United States (Delaware)": "United States", UK: "United Kingdom" };
const STRUCTURES = ["ELTIF 2.0", "ELTIF", "SCSp", "SICAV-RAIF", "RAIF", "SICAV-SIF", "SIF", "SICAV", "FCP-RAIF", "FCP", "ICAV", "QIAIF", "ILP", "LTAF", "UCITS", "SLP", "FPCI", "SCA"];
const STRUCT_RE = new RegExp(`\\b(${STRUCTURES.map((s) => s.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&")).join("|")})\\b`, "g");
const structuresIn = (t) => [...new Set((String(t || "").match(STRUCT_RE) || []).map((s) => (s === "ELTIF 2.0" ? "ELTIF" : s)))];

let stats = { fundCcy: 0, status: 0, strategy: 0, domicile: 0, structure: 0 };

const nF = updateRecords(FILE, "funds", (f) => {
  let ch = false;
  if (!f.ccy) {
    const cands = new Set(["targetSize", "raised", "hardCap"].map((k) => ccyFor(f[k], f.description, "m")).filter(Boolean));
    if (cands.size === 1) { f.ccy = [...cands][0]; ch = true; stats.fundCcy++; }
  }
  if (STATUS_SYN[f.status]) { f.status = STATUS_SYN[f.status]; ch = true; stats.status++; }
  if (STRATEGY_SYN[f.strategy]) { f.strategy = STRATEGY_SYN[f.strategy]; ch = true; stats.strategy++; }
  if (typeof f.domicile === "string") {
    let d = f.domicile.trim(); const was = f.domicile;
    if (/\[est\]/i.test(d)) { f.domicileEstimated = true; d = d.replace(/\s*\[est\]\s*/i, "").trim(); }
    if (/\(unconfirmed\)/i.test(d)) { f.domicileEstimated = true; d = d.replace(/\s*\(unconfirmed\)\s*/i, "").trim(); }
    const paren = d.match(/^(.*?)\s*\(([^)]+)\)$/);
    if (paren && !COUNTRY[d]) { const s = structuresIn(paren[2]); if (s.length === 1 && !f.structure) { f.structure = s[0]; stats.structure++; } d = paren[1].trim(); }
    if (NOT_A_DOMICILE.test(was.trim()) || NOT_A_DOMICILE.test(d)) { const s = structuresIn(was); if (s.length === 1 && !f.structure) { f.structure = s[0]; stats.structure++; } d = null; }
    else if (COUNTRY[d]) d = COUNTRY[d];
    if (d !== was) { f.domicile = d; ch = true; stats.domicile++; }
  }
  if (!f.structure) { const s = structuresIn(f.description); if (s.length === 1) { f.structure = s[0]; ch = true; stats.structure++; } }
  return ch;
}, { dryRun: DRY });

console.log(`${DRY ? "[dry-run] " : ""}normalise-data: funds ${nF} changed`, JSON.stringify(stats));
