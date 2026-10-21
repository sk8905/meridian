// =============================================================================
// dedupe-data.mjs — merge records that describe the SAME event, so the Transactions
// table, the manager News tab and search never show one deal twice (or the same deal
// at two different sizes). Re-runnable and idempotent: a second run changes nothing.
//
// Two passes, both conservative (a false merge loses a real record, a missed merge
// only leaves a visible duplicate — so the automatic rule is narrow and the rest is
// a reviewed list):
//   1. AUTO  — same array, same managerId, same normalised source URL, dates ≤5 days
//      apart. (Different managers on one URL are a club deal — one row per lender — and
//      are left alone; the Transactions view groups those for display.)
//   2. REVIEWED — explicit [keep, drop…] groups below: the same event reported by two
//      outlets (different URLs), each pair checked by hand against both sources.
//
// A merge keeps ONE record and folds every dropped record's URL + headline into
// `alsoReported: [{ url, headline, date }]` — the source trail is never lost, and the
// candidate collector treats those URLs as already known (scripts/collect-candidates
// knownIndex) so a routine can't re-add the dropped duplicate. The kept record takes
// the longer summary.
//
// Usage: node scripts/dedupe-data.mjs [--dry-run]
// =============================================================================
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { readRecords, updateRecords, deleteRecords } from "./lib/datafile.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CREDIT = path.join(ROOT, "credit", "js", "data.js");
const LEGAL = path.join(ROOT, "legal", "js", "data.js");
const DRY = process.argv.includes("--dry-run");

export const normUrl = (u) => String(u || "").toLowerCase().replace(/^https?:\/\/(www\.)?/, "").split(/[?#]/)[0].replace(/\/+$/, "");

// Reviewed same-event groups: first id is kept. Each group was checked against both
// sources (same borrower/fund, same size, same date ±5d, same manager).
export const REVIEWED = {
  deals: [
    ["d990", "d1108"],          // Blackstone $1bn Analogic/Leidos financing (same press release)
    ["d946", "d887"],           // BrightSpire $960m CRE CLO BRSP 2026-FL4
    ["d974", "d863"],           // PennantPark $745m credit continuation vehicle
    ["d794", "d816"],           // PGIM ~$3bn GreenSky forward-flow
    ["d814", "d763"],           // Fortress third European CLO €406m (BSL 2026-3)
    ["d760", "d764"],           // CVC Apidos LVIII $550m
    ["d755", "d765"],           // Apollo Sports Capital $2.6bn Yankees financing
    ["d925", "d728"],           // Willow Tree ~$730m continuation vehicle
    ["d774", "d700"],           // Park Square / Cosmobilis WRC acquisition
    ["d947", "d892"],           // Aperture $300m Avant facility
    ["d514", "d510"],           // Pollen Street €120m InSoil facility
    ["d523", "d1033"],          // Janus Henderson acquires Rantum Capital
    ["d984", "d263"],           // Sixth Street growth investment in Kpler
    ["d752", "d98", "d889"],    // Arrow Global / Fortress JV buys CPP Investments' European NPLs
    ["d986", "d827"],           // Audax $1bn continuation vehicle
    ["d481", "d864"],           // Bridgepoint CLO X €403m
    ["d638", "d960"],           // Cross Ocean Bosphorus CLO VII
    ["d998", "d902"],           // LendInvest Mortimer 2026-1: £300m incl. £35m pre-fund (£265m pool)
    // Data audit 2026-10-21 (same event, two outlets — each pair checked against both sources):
    ["d248", "d584"],           // Tikehau €42.1m senior loan to Fidera Vecta, Rome (Il Sole 24 Ore + BeBeez)
    ["d83", "d172"],            // Deutsche Bank $865m Marelli DIP (Bloomberg Law + Willkie release)
    ["d1046", "d1254"],         // BSP / Franklin Templeton – Encina Lender Finance (BSP release + ACI)
    ["d1166", "d1253"],         // Blackstone $1bn Analogic/Leidos financing (Blackstone release + Insurance Business)
    ["d663", "d680"],           // Blackstone-led $5.34bn for 49% of Williams' Power Innovation (Blackstone + Williams releases)
  ],
  intel: [
    ["i1095", "i1148"], ["i807", "i999"], ["i700", "i860"], ["i629", "i923"], ["i621", "i641"],
    ["i617", "i609"], ["i601", "i653"], ["i594", "i645"], ["i535", "i925"], ["i518", "i862"],
    ["i508", "i863"], ["i525", "i488"], ["i395", "i321"], ["i1", "i394"], ["i329", "i215"],
    ["i24", "i62"], ["i25", "i195"], ["i233", "i1136"], ["i5", "i54"], ["i930", "i552"],
    ["i870", "i472"], ["i344", "i69"], ["i29", "i163"], ["i347", "i176"], ["i81", "i348"],
    ["i7", "i56"], ["i934", "i736"], ["i73", "i173"], ["i34", "i194"], ["i946", "i735"],
    ["i75", "i314"], ["i305", "i120"], ["i957", "i756"], ["i117", "i175"], ["i297", "i115"],
    ["i315", "i174"],           // 400 Capital new strategy heads (Business Wire 15 Apr 2025 + firm page)
  ],
  // Legal items: same firm, same note published twice (a PDF + the HTML page, or a
  // syndicated copy). The firm's own HTML page with an exact date is kept.
  items: [
    ["u809", "u137"],           // Clifford Chance — Re Argo Blockchain (HTML 20 Jan kept; PDF "1 Jan" dropped)
    ["u1679", "u1667"],         // Kirkland advises TPG (same release)
    ["u1491", "u1467"],         // Kirkland advises Bridgepoint Credit (firm release kept over PE Wire)
    ["u1564", "u1394"],         // HSF Kramer advises Windlab (firm release kept)
    ["u770", "u662"],           // Linklaters FinReg post (full URL kept)
    ["u1252", "u1308"],         // Clifford Chance advises MUFG (same release, typo'd URL dropped)
  ],
};

const day = (d) => (d ? Date.parse(String(d).length === 7 ? d + "-01" : d) : NaN);
const urlOf = (r) => r.sourceUrl || r.url;
const titleOf = (r) => r.headline || r.title;

// Legal items only: the same firm publishing the same title on the same day is ONE note,
// even when the two copies' URLs differ by case, spaces or a typo in the slug (audit
// 2026-10-21: 45 such pairs, mostly Latham insight URLs captured with spaces).
export const normTitle = (t) => String(t || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const urlScore = (u) => (/\s|%20/.test(u) ? 0 : 2) + (/[A-Z]/.test(String(u).split("/").slice(3).join("/")) ? 0 : 1);
function titleGroups(recs) {
  const by = new Map();
  for (const { obj } of recs) {
    if (!obj.firm || !obj.date || !normTitle(obj.title)) continue;
    const k = obj.firm + "|" + obj.date + "|" + normTitle(obj.title);
    (by.get(k) || by.set(k, []).get(k)).push(obj);
  }
  const out = [];
  for (const g of by.values()) {
    if (g.length < 2) continue;
    // keep the clean URL (no spaces, lower-case slug), then the longer summary
    g.sort((a, b) => urlScore(urlOf(b)) - urlScore(urlOf(a)) || (b.summary || "").length - (a.summary || "").length);
    out.push(g.map((x) => x.id));
  }
  return out;
}

function autoGroups(recs) {
  const by = new Map();
  for (const { obj } of recs) {
    const k = (obj.managerId || obj.firm) + "|" + normUrl(urlOf(obj));
    if (!normUrl(urlOf(obj)) || /^(sec\.gov\/cgi-bin\/browse-edgar|[^/]+)$/.test(normUrl(urlOf(obj)))) continue; // generic / domain-only URLs are not an identity
    (by.get(k) || by.set(k, []).get(k)).push(obj);
  }
  const out = [];
  for (const g of by.values()) {
    if (g.length < 2) continue;
    g.sort((a, b) => String(a.date).localeCompare(String(b.date)));
    if (Math.abs(day(g[0].date) - day(g[g.length - 1].date)) > 5 * 864e5) continue;
    g.sort((a, b) => (b.summary || "").length - (a.summary || "").length);
    out.push(g.map((x) => x.id));
  }
  return out;
}

// dropped id → surviving id, so references elsewhere (backfill/checklist.json
// recordId) follow the merge instead of dangling.
const REMAP = new Map();
function remapRefs() {
  if (!REMAP.size) return 0;
  const f = path.join(ROOT, "backfill", "checklist.json");
  if (!fs.existsSync(f)) return 0;
  let src = fs.readFileSync(f, "utf8"), n = 0;
  src = src.replace(/("recordId"\s*:\s*")([a-z]\d+)(")/g, (all, a, id, b) => (REMAP.has(id) ? (n++, a + REMAP.get(id) + b) : all));
  if (n && !DRY) fs.writeFileSync(f, src);
  return n;
}
function merge(file, name, groups) {
  const recs = readRecords(file, name);
  const byId = new Map(recs.map((r) => [r.obj.id, r.obj]));
  const all = [...groups, ...autoGroups(recs), ...(name === "items" ? titleGroups(recs) : [])];
  const drop = new Set(), fold = new Map();
  for (const [keep, ...rest] of all) {
    if (!byId.has(keep) || drop.has(keep)) continue;
    for (const d of rest) {
      const r = byId.get(d); if (!r || d === keep || drop.has(d)) continue;
      drop.add(d); (fold.get(keep) || fold.set(keep, []).get(keep)).push(r);
    }
  }
  const n = updateRecords(file, name, (k) => {
    const rs = fold.get(k.id); if (!rs) return false;
    const also = k.alsoReported || [];
    for (const r of rs) {
      for (const x of [{ url: urlOf(r), headline: titleOf(r), date: r.date || null }, ...(r.alsoReported || [])]) {
        if (x.url && normUrl(x.url) !== normUrl(urlOf(k)) && !also.some((a) => normUrl(a.url) === normUrl(x.url))) also.push(x);
      }
      if ((r.summary || "").length > (k.summary || "").length) k.summary = r.summary;
    }
    k.alsoReported = also;
    return true;
  }, { dryRun: DRY });
  const m = deleteRecords(file, name, [...drop], { dryRun: DRY });
  for (const [keep, rs] of fold) for (const r of rs) REMAP.set(r.id, keep);
  console.log(`dedupe ${name}: merged ${m} duplicate(s) into ${n} record(s)${DRY ? " (dry run)" : ""}`);
  return m;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  merge(CREDIT, "deals", REVIEWED.deals);
  merge(CREDIT, "intel", REVIEWED.intel);
  merge(LEGAL, "items", REVIEWED.items);
  console.log(`dedupe: remapped ${remapRefs()} backfill reference(s)`);
}
