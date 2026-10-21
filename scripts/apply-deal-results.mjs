// =============================================================================
// apply-deal-results.mjs — record verified wire-queue / law-firm items in the database
// (data audit 2026-10-21, R52). Research workers return one RESULT per item; this is the
// one writer that turns them into records and closes the item in the wire ledger:
//
//   { results: [{ legalId?, url, outcome, record?, tags?, held?, reason?, evidence? }] }
//   outcome  deal        → credit/js/data.js `deals` (next d-id) + its deal-tags.js line
//            intel       → `intel` (next i-id)        HEDGE_INTEL → `HEDGE_INTEL` (next hi-id)
//            commitment  → `commitments`              webNews → the manager's `webNews`
//            held        → the release URL added to that deal's `alsoReported` ("@<legalId>"
//                          = a deal created from another result in the same run)
//            reject      → nothing recorded
//   Every item is then logged in backfill/wire-ledger.json ({url, status: recorded|rejected,
//   recordId|reason, at}), which closes it in backfill/wire-queue.json.
//
// Guards: a record whose URL the target already holds (same entity) is skipped; a deal
// type outside DEAL_TYPES, or a deal without a tracked managerId, is refused (reported).
// Every lender a deal names gets a profile (R39m): an existing profile of the same name
// (legal form aside) is linked, otherwise a lender STUB is created (category bank |
// lender, every fact null until a routine sources it) — also run alone with --link.
// Usage: node scripts/apply-deal-results.mjs <results.json>… [--dry-run] | --link
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readRecords, updateRecords, appendRecords, maxId } from "./lib/datafile.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CREDIT = path.join(ROOT, "credit", "js", "data.js");
const TAGS = path.join(ROOT, "credit", "js", "deal-tags.js");
const LEDGER = path.join(ROOT, "backfill", "wire-ledger.json");
const TAG_KEY = { country: "c", countrySource: "cs", countryBasis: "cb", sector: "s", amountKind: "a", event: "e", managerMA: "m", party: "p", partyRole: "r", partySource: "ps", partyQuality: "pq" };
const norm = (u) => String(u || "").toLowerCase().replace(/^https?:\/\/(www\.)?/, "").split(/[?#]/)[0].replace(/\/+$/, "");

export function compactTags(t = {}) {
  const o = {};
  for (const [k, v] of Object.entries(t)) {
    const ck = TAG_KEY[k]; if (!ck || v == null || v === "" || v === false) continue;
    o[ck] = k === "managerMA" ? 1 : v;
  }
  if (!("c" in o)) o.c = null;
  if (!("a" in o)) o.a = null;
  return o;
}

const BANK_RE = /\b(bank|banco|banca|banque|bnp|caixa|mizuho|uob|ocbc|maybank|unicredit|natixis|santander|hsbc|barclays|citi|kookmin|mashreq|qnb|rabobank|soci[eé]t[eé] g[eé]n[eé]rale|cr[eé]dit agricole|deutsche|ing|abn amro|commerzbank|lloyds|natwest|sumitomo|mufg|smbc|wells fargo|j\.?p\.? ?morgan|goldman sachs|morgan stanley|jefferies)\b/i;
export const lenderKey = (n) => String(n || "").toLowerCase().replace(/\(.*?\)/g, " ").replace(/\b(ltd|limited|plc|llc|inc|ag|sa|s\.a\.|gmbh|n\.v\.|nv|spa|s\.p\.a\.|lp|l\.p\.|group|holdings?)\b\.?/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
// Link (or create) a profile for every lender that has none. Returns the stubs created.
export function linkLenders({ dryRun = false } = {}) {
  const mgrs = readRecords(CREDIT, "managers").map((r) => r.obj);
  const byKey = new Map(mgrs.map((m) => [lenderKey(m.name), m.id]));
  let next = maxId(CREDIT, "m"); const created = [], today = new Date().toISOString().slice(0, 10);
  updateRecords(CREDIT, "deals", (d) => {
    let ch = false;
    for (const l of d.lenders || []) {
      if (l.managerId || !l.name) continue;
      const k = lenderKey(l.name); if (!k) continue;
      let id = byKey.get(k);
      if (!id) {
        id = `m${++next}`; byKey.set(k, id);
        created.push({ id, name: String(l.name).trim(), category: BANK_RE.test(l.name) ? "bank" : "lender", hq: null, founded: null, aum: null, aumText: null, strategies: [], description: null, owners: [], sources: [], estimated: null, asOf: null, profileStub: true, stubSince: today });
      }
      l.managerId = id; ch = true;
    }
    return ch;
  }, { dryRun });
  if (created.length && !dryRun) appendRecords(CREDIT, "managers", created);
  return created;
}

if (import.meta.url === `file://${process.argv[1]}` && process.argv.includes("--link")) {
  const c = linkLenders({ dryRun: process.argv.includes("--dry-run") });
  console.log(`apply-deal-results --link: ${c.length} lender stub(s) created${c.length ? ": " + c.map((m) => `${m.id} ${m.name}`).join(", ") : ""}`);
} else if (import.meta.url === `file://${process.argv[1]}`) {
  const DRY = process.argv.includes("--dry-run");
  const files = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const C = await import("file://" + CREDIT);
  const types = new Set(C.DEAL_TYPES), mgr = new Set(C.managers.map((m) => m.id)), hfs = new Set(C.HEDGE_FUNDS.map((h) => h.id)), lps = new Set(C.lps.map((l) => l.id));
  const held = { deals: new Set(), intel: new Set(), HEDGE_INTEL: new Set(), commitments: new Set() };
  for (const d of C.deals) { held.deals.add(`${d.managerId}|${norm(d.sourceUrl)}`); for (const a of d.alsoReported || []) held.deals.add(`${d.managerId}|${norm(a.url)}`); }
  for (const i of C.intel) held.intel.add(`${i.managerId}|${norm(i.sourceUrl)}`);
  for (const h of C.HEDGE_INTEL) held.HEDGE_INTEL.add(`${h.hfId}|${norm(h.url || h.sourceUrl)}`);
  for (const c of C.commitments) held.commitments.add(`${c.lpId}|${norm(c.sourceUrl)}`);
  let nd = maxId(CREDIT, "d") + 1, ni = maxId(CREDIT, "i") + 1, nh = maxId(CREDIT, "hi") + 1;
  const add = { deals: [], intel: [], HEDGE_INTEL: [], commitments: [] }, tagLines = [], webNews = new Map(), also = new Map(), ledger = [], refused = [];
  const at = new Date().toISOString();
  const byLegal = new Map();   // legalId → new deal id (for "@legalId" holds)
  const all = files.flatMap((f) => JSON.parse(fs.readFileSync(f, "utf8")).results || []);
  // deals first, so a "@legalId" hold can resolve to the deal it duplicates
  all.sort((a, b) => (a.outcome === "held") - (b.outcome === "held"));
  for (const r of all) {
    const url = r.url || (r.record && (r.record.sourceUrl || r.record.url));
    const close = (status, extra) => ledger.push({ url, status, ...extra, at, ...(r.legalId ? { legalId: r.legalId } : {}) });
    const x = r.record || {};
    if (r.outcome === "reject") { close("rejected", { reason: r.reason || "rejected" }); continue; }
    if (r.outcome === "held") { if (r.held && r.held.startsWith("@")) r.held = byLegal.get(r.held.slice(1)); if (!r.held) { refused.push(`${r.legalId}: held without a resolvable id`); continue; } (also.get(r.held) || also.set(r.held, []).get(r.held)).push({ url, headline: r.title || x.headline || null, date: r.date || x.date || null }); close("recorded", { recordId: r.held }); continue; }
    if (r.outcome === "deal") {
      if (!types.has(x.type) || !mgr.has(x.managerId) || !x.date || !x.headline || !x.sourceUrl) { refused.push(`${r.legalId}: deal refused (type ${x.type}, managerId ${x.managerId})`); continue; }
      const k = `${x.managerId}|${norm(x.sourceUrl)}`; if (held.deals.has(k)) { close("recorded", { reason: "already held" }); continue; }
      const id = `d${nd++}`; held.deals.add(k);
      add.deals.push({ id, date: x.date, type: x.type, managerId: x.managerId, fundId: null, headline: x.headline, summary: x.summary || "", sourceUrl: x.sourceUrl, borrower: x.borrower || "Unknown", sponsor: x.sponsor || "", lenders: (x.lenders || []).map((l) => ({ name: l.name, managerId: mgr.has(l.managerId) ? l.managerId : null, role: l.role || "participant", amount: l.amount ?? null, ccy: l.ccy ?? null })), managerRole: x.managerRole || "lender", ...(x.clo ? { clo: true } : {}),
        ...(Array.isArray(x.alsoReported) && x.alsoReported.length ? { alsoReported: x.alsoReported.filter((a) => a && a.url && norm(a.url) !== norm(x.sourceUrl)).map((a) => ({ url: a.url, headline: a.headline || null, date: a.date || null })) } : {}) });
      tagLines.push(`  ${id}: ${JSON.stringify(compactTags(r.tags || {}))},`);
      if (r.legalId) byLegal.set(r.legalId, id);
      close("recorded", { recordId: id }); continue;
    }
    if (r.outcome === "intel") {
      if (!mgr.has(x.managerId) || !x.date || !x.sourceUrl) { refused.push(`${r.legalId}: intel refused`); continue; }
      const k = `${x.managerId}|${norm(x.sourceUrl)}`; if (held.intel.has(k)) { close("recorded", { reason: "already held" }); continue; }
      const id = `i${ni++}`; held.intel.add(k);
      add.intel.push({ id, date: x.date, type: x.type, headline: x.headline, managerId: x.managerId, fundId: null, summary: x.summary || "", sourceUrl: x.sourceUrl });
      close("recorded", { recordId: id }); continue;
    }
    if (r.outcome === "HEDGE_INTEL") {
      const u = x.url || x.sourceUrl;
      if (!hfs.has(x.hfId) || !x.date || !u) { refused.push(`${r.legalId}: HEDGE_INTEL refused`); continue; }
      const k = `${x.hfId}|${norm(u)}`; if (held.HEDGE_INTEL.has(k)) { close("recorded", { reason: "already held" }); continue; }
      const id = `hi${nh++}`; held.HEDGE_INTEL.add(k);
      add.HEDGE_INTEL.push({ id, hfId: x.hfId, date: x.date, type: x.type, headline: x.headline, summary: x.summary || "", outlet: x.outlet || null, url: u });
      close("recorded", { recordId: id }); continue;
    }
    if (r.outcome === "commitment") {
      if (!lps.has(x.lpId) || !x.sourceUrl) { refused.push(`${r.legalId}: commitment refused`); continue; }
      const k = `${x.lpId}|${norm(x.sourceUrl)}`; if (held.commitments.has(k)) { close("recorded", { reason: "already held" }); continue; }
      held.commitments.add(k);
      add.commitments.push({ lpId: x.lpId, managerId: mgr.has(x.managerId) ? x.managerId : null, fundId: null, manager: x.manager || null, fund: x.fund || null, amount: x.amount ?? null, ccy: x.ccy ?? null, date: x.date || null, strategy: x.strategy || null, sourceUrl: x.sourceUrl, note: x.note || null });
      close("recorded", { recordId: `commitment:${x.lpId}` }); continue;
    }
    if (r.outcome === "webNews") {
      if (!mgr.has(x.managerId) || !x.url || !x.date) { refused.push(`${r.legalId}: webNews refused`); continue; }
      (webNews.get(x.managerId) || webNews.set(x.managerId, []).get(x.managerId)).push({ date: x.date, outlet: x.outlet || null, title: x.title, url: x.url });
      close("recorded", { recordId: `webNews:${x.managerId}` }); continue;
    }
    refused.push(`${r.legalId}: unknown outcome ${r.outcome}`);
  }
  for (const d of add.deals) { const a = also.get(d.id); if (!a) continue; also.delete(d.id); const have = new Set([norm(d.sourceUrl), ...(d.alsoReported || []).map((x) => norm(x.url))]); const fresh = a.filter((x) => !have.has(norm(x.url))); if (fresh.length) d.alsoReported = [...(d.alsoReported || []), ...fresh]; }
  if (!DRY) {
    for (const [name, recs] of Object.entries(add)) if (recs.length) appendRecords(CREDIT, name, recs);
    if (tagLines.length) { const src = fs.readFileSync(TAGS, "utf8"); const i = src.indexOf("\n};", src.indexOf("const T = {")); fs.writeFileSync(TAGS, src.slice(0, i) + "\n" + tagLines.join("\n") + src.slice(i)); }
    updateRecords(CREDIT, "managers", (m) => {
      const w = webNews.get(m.id); if (!w) return false;
      const have = new Set((m.webNews || []).map((x) => norm(x.url))); const fresh = w.filter((x) => !have.has(norm(x.url)));
      if (!fresh.length) return false; m.webNews = [...(m.webNews || []), ...fresh]; return true;
    });
    updateRecords(CREDIT, "deals", (d) => {
      const a = also.get(d.id); if (!a) return false;
      const have = new Set([norm(d.sourceUrl), ...(d.alsoReported || []).map((x) => norm(x.url))]); const fresh = a.filter((x) => !have.has(norm(x.url)));
      if (!fresh.length) return false; d.alsoReported = [...(d.alsoReported || []), ...fresh]; return true;
    });
    const L = JSON.parse(fs.readFileSync(LEDGER, "utf8")); L.items.push(...ledger); fs.writeFileSync(LEDGER, JSON.stringify(L, null, 1) + "\n");
    const stubs = linkLenders();
    if (stubs.length) console.log(`  lender profiles created: ${stubs.map((m) => `${m.id} ${m.name}`).join(", ")}`);
  }
  console.log(`${DRY ? "[dry-run] " : ""}apply-deal-results: deals +${add.deals.length}, intel +${add.intel.length}, HEDGE_INTEL +${add.HEDGE_INTEL.length}, commitments +${add.commitments.length}, webNews +${[...webNews.values()].flat().length}, alsoReported +${[...also.values()].flat().length}; ledger +${ledger.length} (${ledger.filter((l) => l.status === "rejected").length} rejected)`);
  if (refused.length) console.log("  refused:\n   - " + refused.join("\n   - "));
}
