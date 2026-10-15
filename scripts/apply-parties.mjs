// =============================================================================
// apply-parties.mjs — write the 2026-10 deal-party audit (HOUSE_STYLE R39m) into the
// credit ledger. Re-runnable on whatever `main` holds: it reads the CURRENT data files
// and changes only the records it needs to (scripts/lib/datafile.mjs), so on a rebase
// conflict take origin/main and run it again — never hand-merge.
//
// Input: backfill/deal-parties.json — one entry per audited deal, each read from the
// deal's own source(s) (sourceUrl, alsoReported, the firm's release found by search):
//   { id, borrower, sponsor, lenders: [{ name, managerId, role, amount, ccy }],
//     managerRole, seller, review, checked: [urls], note }
// and `merges`: [[keepId, dropId…]] — club deals that were split one row per tracked
// lender (same borrower, same financing, same source), merged into ONE record.
//
// What it does, per deal:
//   • sets `borrower`, `sponsor` ("" = none named), `sponsorId` (when the sponsor is a
//     tracked firm), `lenders` (managerId resolved for every lender), `managerRole`;
//     drops the superseded `company` field.
//   • every lender / arranger that is not yet a tracked firm gets a lender PROFILE — a
//     `managers` record with category "bank" | "lender", every fact null until a
//     routine sources it (docs/refresh-routines.md "Lender profiles").
//   • merges: the kept record takes every lender of the group (each with its own
//     amount), the dropped records' URLs go to `alsoReported`, their tags are removed
//     from deal-tags.js and backfill/checklist.json references are remapped.
// A deal the audit could not settle keeps `review` in deal-parties.json (the review
// list) and only the fields the sources DID support are written.
//
// Usage: node scripts/apply-parties.mjs [--dry-run] [--upto=N]
// =============================================================================
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { readRecords, updateRecords, appendRecords, deleteRecords, maxId } from "./lib/datafile.mjs";
import { normUrl } from "./dedupe-data.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CREDIT = path.join(ROOT, "credit", "js", "data.js");
const TAGS = path.join(ROOT, "credit", "js", "deal-tags.js");
const PARSE = path.join(ROOT, "v2", "js", "deal-parse.js");
const AUDIT = path.join(ROOT, "backfill", "deal-parties.json");
const CHECKLIST = path.join(ROOT, "backfill", "checklist.json");
const DRY = process.argv.includes("--dry-run");
const TODAY = new Date().toISOString().slice(0, 10);

export const ROLES = ["lead", "participant", "arranger", "investor"];
export const MANAGER_ROLES = ["lender", "sponsor", "borrower", "issuer", "adviser", "seller"];

// A firm name → a matching key: case, punctuation, legal suffixes and a trailing
// parenthetical dropped ("HSBC UK Bank plc" and "HSBC UK" stay distinct; "Investec Bank
// plc" ↔ "Investec").
export function nameKey(s) {
  return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/&/g, " and ").replace(/\([^)]*\)/g, " ").replace(/[.,'’]/g, "")
    .replace(/\b(plc|ltd|limited|llp|lp|llc|inc|sa|spa|ag|se|nv|bv|dac|sarl|gmbh|corp|corporation|co)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
// Brand aliases → one profile. Only spellings of the SAME institution.
export const ALIASES = {
  "allied irish banks": "aib", "aib group": "aib", "aib uk": "aib",
  "investec bank": "investec", "natwest group": "natwest", "natwest markets": "natwest", "national westminster bank": "natwest",
  "lloyds banking group": "lloyds", "lloyds bank": "lloyds", "barclays bank": "barclays",
  "hsbc bank": "hsbc", "hsbc uk": "hsbc", "hsbc uk bank": "hsbc", "banco santander": "santander",
  "socgen": "societe generale", "sg americas securities": "societe generale",
  "jp morgan": "jpmorgan", "j p morgan": "jpmorgan", "jpmorgan chase": "jpmorgan",
  "citigroup": "citi", "citigroup global markets": "citi", "citibank": "citi",
  "bofa securities": "bank of america", "bofa": "bank of america", "bank of america securities": "bank of america",
  "deutsche bank securities": "deutsche bank", "deutsche bank london branch": "deutsche bank",
  "credit agricole cib": "credit agricole", "natixis cib": "natixis",
  "smbc nikko securities america": "smbc nikko", "synovus securities": "synovus", "r seelaus": "r seelaus and",
  "silver point finance": "silver point capital", "elliott investment management": "elliott",
  "european investment fund": "eif", "jll capital markets": "jll", "jll real estate capital": "jll",
  "kkr capital markets": "kkr", "schroders": "schroders capital",
  "wells fargo securities": "wells fargo", "jp morgan securities": "jpmorgan", "greensledge capital markets": "greensledge",
  "bbva spark": "bbva", "apollo global securities": "apollo global management", "apollo": "apollo global management",
  "keybanc capital markets": "keybanc", "rbc capital markets": "rbc", "citizens jmp": "citizens",
};
// The display name of a profile created for an aliased brand.
export const ALIAS_NAME = {
  natwest: "NatWest", jpmorgan: "J.P. Morgan", citi: "Citi", "bank of america": "Bank of America", "deutsche bank": "Deutsche Bank",
  "societe generale": "Société Générale", "credit agricole": "Crédit Agricole CIB", "smbc nikko": "SMBC Nikko", aib: "AIB", hsbc: "HSBC",
  lloyds: "Lloyds", santander: "Santander", eif: "European Investment Fund", jll: "JLL", "silver point capital": "Silver Point Capital",
  elliott: "Elliott Investment Management", greensledge: "GreensLedge", bbva: "BBVA", investec: "Investec", barclays: "Barclays",
  keybanc: "KeyBanc", rbc: "RBC", citizens: "Citizens", synovus: "Synovus", "r seelaus and": "R. Seelaus & Co.",
};
const canon = (s) => { const k = nameKey(s); return ALIASES[k] || k; };
const BANK_RE = /\b(bank|banco|banca|banque|bancorp|caixa|caja|sparkasse|landesbank|investec|aib|natwest|hsbc|santander|barclays|lloyds|bnp|societe generale|credit agricole|natixis|jpmorgan|citi|morgan stanley|goldman sachs|ubs|deutsche|commerzbank|unicredit|intesa|ing|rabobank|abn amro|nordea|danske|seb|handelsbanken|dnb|kbc|belfius|mizuho|mufg|smbc|sumitomo|nomura|wells fargo|bmo|rbc|td securities|scotiabank|jefferies|barings bank|mediobanca|bpm|bper|helaba|nord lb|lbbw|bayernlb|dz|aareal|pbb|ulster|caixabank|bbva|unicaja|credit suisse|caisse|kfw|eib|keybanc|rbc|citizens|bank of ireland|ptsb|close brothers|shawbrook|ocbc|dbs|standard chartered|cibc|truist|citizens|pnc|keybank|fifth third|regions|huntington|zions|m and t)\b/;

export function loadAudit(file = AUDIT) {
  const j = JSON.parse(fs.readFileSync(file, "utf8"));
  return { entries: j.deals || [], merges: j.merges || [] };
}

function main() {
  // --upto=N applies the first N audited deals only (the audit landed in ~100-deal commits).
  const upto = Number((process.argv.find((a) => a.startsWith("--upto=")) || "").slice(7)) || Infinity;
  const audit = loadAudit();
  const entries = audit.entries.slice(0, upto);
  const inScope = new Set(entries.map((e) => e.id));
  const merges = audit.merges.filter((g) => g.every((id) => inScope.has(id)));
  const byId = new Map(entries.map((e) => [e.id, e]));
  const mgrs = readRecords(CREDIT, "managers").map((r) => r.obj);
  const mgrIds = new Set(mgrs.map((m) => m.id));
  const index = new Map();
  for (const m of mgrs) { const k = canon(m.name); if (!index.has(k)) index.set(k, m.id); }

  // 1) Lender profiles for every untracked lender / arranger the audit names.
  let next = maxId(CREDIT, "m");
  const created = [];
  const resolve = (name, id) => {
    if (id && mgrIds.has(id)) return id;
    const k = canon(name);
    if (!k) return null;
    if (index.has(k)) return index.get(k);
    const rec = {
      id: `m${++next}`, name: ALIAS_NAME[k] || String(name).trim(), category: BANK_RE.test(k) ? "bank" : "lender",
      hq: null, founded: null, aum: null, aumText: null, strategies: [], description: null, owners: [], sources: [],
      estimated: null, asOf: null, profileStub: true, stubSince: TODAY,
    };
    index.set(k, rec.id); mgrIds.add(rec.id); created.push(rec);
    return rec.id;
  };
  // A placeholder ("unnamed Japanese allocator", "other lenders") is not a party.
  const cleanLenders = (ls) => (ls || []).filter((l) => l && l.name && String(l.name).trim() && !/^(unnamed|undisclosed|other|various|unknown|prepetition|existing|certain)\b/i.test(String(l.name).trim())).map((l) => ({
    name: String(l.name).trim(), managerId: resolve(l.name, l.managerId),
    role: ROLES.includes(l.role) ? l.role : "participant",
    amount: Number.isFinite(l.amount) ? l.amount : null, ccy: l.ccy ? String(l.ccy).toUpperCase() : null,
  })).filter((l, i, a) => a.findIndex((x) => x.managerId === l.managerId && x.role === l.role) === i);

  // Resolve every lender first, so a sponsor that is also a lender elsewhere links on
  // the first run as on any re-run (idempotent).
  for (const e of entries) cleanLenders(e.lenders);

  // 2) Merge groups: union of lenders, the dropped URLs kept as alsoReported.
  const deals = new Map(readRecords(CREDIT, "deals").map((r) => [r.obj.id, r.obj]));
  const drop = new Map();   // dropped id → kept id
  const fold = new Map();
  for (const [keep, ...rest] of merges) {
    if (!deals.has(keep)) continue;
    for (const d of rest) if (deals.has(d) && d !== keep && !drop.has(d)) { drop.set(d, keep); (fold.get(keep) || fold.set(keep, []).get(keep)).push(deals.get(d)); }
  }

  const stats = { borrower: 0, sponsor: 0, lenders: 0, managerRole: 0, merged: drop.size };
  const n = updateRecords(CREDIT, "deals", (d) => {
    if (drop.has(d.id)) return false;
    const e = byId.get(d.id);
    const group = fold.get(d.id) || [];
    if (!e && !group.length) return false;
    const before = JSON.stringify(d);
    if (e) {
      // A trailing "*" marks an inferred vehicle (deal-tags pq) — never written as audited.
      if (typeof e.borrower === "string" && e.borrower.trim() && !/\*$/.test(e.borrower.trim())) {
        if (d.borrower !== e.borrower.trim()) stats.borrower++;
        d.borrower = e.borrower.trim(); delete d.company;
      }
      const sp = typeof e.sponsor === "string" ? e.sponsor.trim() : "";
      if (d.sponsor !== sp) stats.sponsor++;
      d.sponsor = sp;
      // The sponsor's profile: the tracked firm itself when it IS the sponsor, else a
      // tracked firm of exactly that name.
      const spId = !sp ? null : (e.managerRole === "sponsor" && d.managerId) ? d.managerId : (index.get(canon(sp)) || null);
      // (A sponsorId set by a merge — the dropped row's firm was the sponsor — is kept.)
      if (spId) d.sponsorId = spId; else if (!sp) delete d.sponsorId;
      const ls = cleanLenders(e.lenders);
      if (JSON.stringify(d.lenders || []) !== JSON.stringify(ls)) stats.lenders++;
      d.lenders = ls;
      const role = MANAGER_ROLES.includes(e.managerRole) ? e.managerRole : (d.clo ? "issuer" : "lender");
      if (d.managerRole !== role) stats.managerRole++;
      d.managerRole = role;
      if (e.seller) d.seller = String(e.seller).trim(); else delete d.seller;
    }
    if (group.length && !Array.isArray(d.lenders)) d.lenders = [];
    for (const r of group) {
      // Every lender of a dropped row joins the kept record (with its own amount); a
      // dropped row whose firm was a sponsor / borrower keeps its profile link.
      const re = byId.get(r.id);
      const theirs = cleanLenders(re ? re.lenders : []);
      for (const l of theirs) if (!d.lenders.some((x) => x.managerId === l.managerId)) d.lenders.push(l);
      const rRole = re && re.managerRole;
      // Only an UNAUDITED dropped row contributes its firm as a lender by default — an
      // audited one contributes exactly the lenders its sources named.
      if (!re && r.managerId && !d.lenders.some((x) => x.managerId === r.managerId)) {
        d.lenders.push({ name: (mgrs.find((m) => m.id === r.managerId) || {}).name || r.managerId, managerId: r.managerId, role: "participant", amount: null, ccy: null });
      }
      if (rRole === "sponsor" && !d.sponsorId) d.sponsorId = r.managerId;
      const also = d.alsoReported || [];
      for (const x of [{ url: r.sourceUrl, headline: r.headline, date: r.date || null }, ...(r.alsoReported || [])]) {
        if (x.url && normUrl(x.url) !== normUrl(d.sourceUrl) && !also.some((a) => normUrl(a.url) === normUrl(x.url))) also.push(x);
      }
      if (also.length) d.alsoReported = also;
      if ((r.summary || "").length > (d.summary || "").length) d.summary = r.summary;
    }
    return JSON.stringify(d) !== before;
  }, { dryRun: DRY });
  const dropped = deleteRecords(CREDIT, "deals", [...drop.keys()], { dryRun: DRY });
  if (created.length) appendRecords(CREDIT, "managers", created, { dryRun: DRY });

  // 3) Tags + checklist follow the merge; superseded parser overrides go.
  let tagSrc = fs.readFileSync(TAGS, "utf8");
  const tagsDropped = [...drop.keys()].filter((id) => new RegExp(`^  ${id}: .*\\n`, "m").test(tagSrc));
  for (const id of tagsDropped) tagSrc = tagSrc.replace(new RegExp(`^  ${id}: .*\\n`, "m"), "");
  if (!DRY) fs.writeFileSync(TAGS, tagSrc);
  let ck = 0;
  if (fs.existsSync(CHECKLIST)) {
    let src = fs.readFileSync(CHECKLIST, "utf8");
    src = src.replace(/("recordId"\s*:\s*")([a-z]\d+)(")/g, (all, a, id, b) => (drop.has(id) ? (ck++, a + drop.get(id) + b) : all));
    if (ck && !DRY) fs.writeFileSync(CHECKLIST, src);
  }
  const withBorrower = new Set(readRecords(CREDIT, "deals").map((r) => r.obj).filter((d) => d.borrower).map((d) => d.id));
  let parse = fs.readFileSync(PARSE, "utf8"), ov = 0;
  for (const block of ["COMPANY_OVERRIDES", "SPONSOR_OVERRIDES"]) {
    const re = new RegExp(`(const ${block} = \\{)([^}]*)(\\};)`);
    parse = parse.replace(re, (all, a, body, c) => a + body.replace(/\b(d\d+): ("(?:[^"\\]|\\.)*"),\s*/g, (m, id) => {
      const live = DRY ? (byId.has(id) && byId.get(id).borrower) : withBorrower.has(id);
      const gone = drop.has(id);
      if ((block === "COMPANY_OVERRIDES" && live) || gone || (block === "SPONSOR_OVERRIDES" && byId.has(id))) { ov++; return ""; }
      return m;
    }) + c);
  }
  if (!DRY) fs.writeFileSync(PARSE, parse);

  console.log(`apply-parties: ${n} deal(s) updated; borrower ${stats.borrower}, sponsor ${stats.sponsor}, lenders ${stats.lenders}, managerRole ${stats.managerRole}; `
    + `${dropped} split row(s) merged into ${fold.size} deal(s); ${created.length} lender profile(s) created; ${tagsDropped.length} tag(s) and ${ck} checklist ref(s) remapped; ${ov} parser override(s) retired${DRY ? " (dry run)" : ""}`);
  if (process.argv.includes("--list")) console.log(created.map((m) => `${m.id}\t${m.category}\t${m.name}`).join("\n"));
  return { created, drop, stats };
}

if (import.meta.url === `file://${process.argv[1]}`) main();
