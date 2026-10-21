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
//   deals.type — folded onto DEAL_TYPES (data audit 2026-10-21): exact synonyms
//       ("Direct Lending"/"Asset-Based Finance" → "Financing", "CLO" → "Structured
//       Credit", "Exit" → "Disposal / Exit", "Fundraise" → "Fundraising", "Ownership"
//       → "Acquisition") plus a REVIEWED per-id list for the catch-all types ("Deal",
//       "Strategy", "Equity / PE"), each read from the deal's own headline.
//   lps.mandateStatus — folded onto MANDATE_STATUS ("Active"/"Allocating" →
//       "Actively allocating"), so the Investors filter shows one chip per status.
//   legal items.url — a firm URL captured with spaces in its path (Latham's sitemap
//       titles, audit 2026-10-21) is rewritten to the firm's own lower-case hyphen
//       slug, the form the same notes carry when captured cleanly.
//   deal-tags.js — tags whose deal no longer exists (merged / removed) are dropped; a
//       deal with no audited party ROLE gets one only where its kind settles it (the
//       drawer otherwise labels every party "Borrower / company"): an asset-manager
//       acquisition (managerMA) → "target", a fund close / launch / continuation
//       vehicle → "fund", a CLO → "issuer". Only the role is set (the name stays the
//       audited party / headline parse); an audited r is never overridden. CLO sizes are fund sizes, so a
//       CLO with no amountKind gets "fund" (the convention on the other 204 CLOs).
//
// Usage: node scripts/normalise-data.mjs [--dry-run]
// =============================================================================
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { updateRecords, readRecords } from "./lib/datafile.mjs";
import { slugUrl } from "./lib/urls.mjs";
import { ccyFor } from "./lib/money.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(ROOT, "credit", "js", "data.js");
const DRY = process.argv.includes("--dry-run");
const LEGAL = path.join(ROOT, "legal", "js", "data.js");
const TAGS = path.join(ROOT, "credit", "js", "deal-tags.js");

export const DEAL_TYPE_SYN = {
  "Direct Lending": "Financing", "Asset-Based Finance": "Financing", CLO: "Structured Credit",
  Exit: "Disposal / Exit", Fundraise: "Fundraising", Ownership: "Acquisition",
};
// Catch-all types, mapped one by one from each deal's own headline (reviewed 2026-10-21).
export const DEAL_TYPE_REVIEWED = {
  d984: "Investment",            // Sixth Street $1bn+ growth equity investment in Kpler
  d986: "Continuation Vehicle",  // Audax / Pantheon $1bn credit continuation vehicle
  d952: "Acquisition",           // Rialto/Hines buy ~$99.75m of loans on three Midtown buildings
  d1085: "Acquisition",          // GPF Partners buys BeeDigital
  d1083: "Disposal / Exit",      // Metric Capital's Adalvo exit to EQT
  d1093: "Disposal / Exit",      // AURELIUS sells LSG Asia-Pacific
  d1017: "Partnership",          // Citi and Apollo $25bn direct lending program
  d1001: "Acquisition",          // Owl Rock / Dyal merger with Altimar (Blue Owl)
};
export const MANDATE_SYN = { Active: "Actively allocating", Allocating: "Actively allocating" };

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

let st2 = { dealType: 0, mandate: 0, legalUrl: 0, orphanTags: 0 };
const nD = updateRecords(FILE, "deals", (d) => {
  const to = DEAL_TYPE_REVIEWED[d.id] && ["Deal", "Strategy", "Equity / PE"].includes(d.type) ? DEAL_TYPE_REVIEWED[d.id] : DEAL_TYPE_SYN[d.type];
  if (!to || to === d.type) return false;
  d.type = to; st2.dealType++; return true;
}, { dryRun: DRY });
const nL = updateRecords(FILE, "lps", (l) => {
  if (!MANDATE_SYN[l.mandateStatus]) return false;
  l.mandateStatus = MANDATE_SYN[l.mandateStatus]; st2.mandate++; return true;
}, { dryRun: DRY });
const nU = updateRecords(LEGAL, "items", (i) => {
  const u = slugUrl(i.url); if (u === i.url) return false;
  i.url = u; st2.legalUrl++; return true;
}, { dryRun: DRY });
// Deal tags: drop orphans; fill a missing party role where the deal's kind settles it.
const FUND_EVENTS = new Set(["First Close", "Final Close", "Fundraising", "Launch", "Continuation Vehicle"]);
st2.partyRole = 0; st2.cloKind = 0;
{
  const byId = new Map(readRecords(FILE, "deals").map((r) => [r.obj.id, r.obj]));
  const src = fs.readFileSync(TAGS, "utf8");
  const out = src.split("\n").flatMap((l) => {
    const m = l.match(/^(\s+)(d\d+):\s*(\{.*\}),?\s*$/);
    if (!m) return [l];
    const d = byId.get(m[2]);
    if (!d) { st2.orphanTags++; return []; }
    let t; try { t = JSON.parse(m[3]); } catch { return [l]; }
    let ch = false;
    const role = t.r ? null : t.m ? "target" : FUND_EVENTS.has(d.type) ? "fund" : d.clo ? "issuer" : null;
    const name = String(d.borrower || "").trim();
    if (role && name && !/^unknown$/i.test(name)) { t.r = role; ch = true; st2.partyRole++; }
    if (d.clo && t.a == null && "a" in t) { t.a = "fund"; ch = true; st2.cloKind++; }
    return [ch ? `${m[1]}${m[2]}: ${JSON.stringify(t)},` : l];
  }).join("\n");
  if (out !== src && !DRY) fs.writeFileSync(TAGS, out);
}

console.log(`${DRY ? "[dry-run] " : ""}normalise-data: funds ${nF} changed`, JSON.stringify(stats));
console.log(`${DRY ? "[dry-run] " : ""}normalise-data: deals ${nD} · lps ${nL} · legal items ${nU} changed`, JSON.stringify(st2));
