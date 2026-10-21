// =============================================================================
// collect-ch.mjs — UK Companies House facts for the tracked credit managers, read from
// the PUBLIC register (find-and-update.company-information.service.gov.uk — no key; the
// same pages the Worker's /api/ch reads for borrower pages, src/index.js chParse*).
// Data audit 2026-10-21.
//
// Match rule — by company NUMBER, never a name:
//   · a manager whose profile already cites its register page (…/company/<number>) →
//     `byManager`: legal name, status, type, incorporation date, registered office, SIC.
//     scripts/apply-registry.mjs writes them (companyNumber, incorporated, …).
//   · any other UK-HQ manager → the register search's EXACT-name active company only, as
//     `candidates` for the profile rota: a routine confirms it is the firm (address,
//     officers) and adds the register link to the profile's sources — after which the
//     number path applies it. Nothing is applied from a name.
// Paced at ≤ 1 request / 0.6s (the register is a public website).
//
// Usage:  node scripts/collect-ch.mjs > backfill/companies-house.json
//         node scripts/collect-ch.mjs --only=m35,m42
// =============================================================================
import * as C from "../credit/js/data.js";
import { chParseSearch } from "../src/index.js";

const args = process.argv.slice(2);
const opt = (n, d) => { const a = args.find((x) => x.startsWith(n + "=")); return a ? a.slice(n.length + 1) : d; };
const BASE = "https://find-and-update.company-information.service.gov.uk";
const PACE_MS = 600;

// ---- pure, unit-tested ------------------------------------------------------------
const text = (s) => String(s || "").replace(/<[^>]+>/g, " ").replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const MONTHS = { january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };
export function isoFromLong(s) { const m = /(\d{1,2}) ([A-Za-z]+) (\d{4})/.exec(String(s || "")); const mo = m && MONTHS[m[2].toLowerCase()]; return mo ? `${m[3]}-${String(mo).padStart(2, "0")}-${m[1].padStart(2, "0")}` : null; }
export const companyNumberOf = (m) => { const ids = [...new Set([...JSON.stringify([m.sources, m.regSources, m.filings]).matchAll(/company-information\.service\.gov\.uk\/company\/([0-9A-Z]{6,10})/gi)].map((x) => x[1].toUpperCase()))]; return ids.length === 1 ? ids[0] : null; };
export function parseCompany(html) {
  const h = String(html || "");
  const name = text((/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(h) || [])[1]);
  if (!name) return null;
  const sic = [...h.matchAll(/<span id="sic\d+">([\s\S]*?)<\/span>/g)].map((m) => text(m[1])).filter(Boolean);
  return {
    legalName: name,
    status: text((/id="company-status">([\s\S]*?)<\/dd>/.exec(h) || [])[1]) || null,
    type: text((/id="company-type-value">([\s\S]*?)<\/span>/.exec(h) || [])[1]) || null,
    incorporated: isoFromLong(text((/id="company-creation-date">([\s\S]*?)<\/dd>/.exec(h) || [])[1])),
    registeredOffice: text((/id="roa-address">([\s\S]*?)<\/span>/.exec(h) || [])[1]) || null,
    sic,
  };
}
// A profile name's parenthetical is a note ("HSBC AM (Alternative Credit)") and is
// dropped; a register title's is part of the name ("… (US) LIMITED" is another company).
const legal = (s, { notes = false } = {}) => String(s || "").toLowerCase().replace(notes ? /\(.*?\)/g : /$^/, " ").replace(/&/g, " and ").replace(/[^a-z0-9 ]+/g, " ").replace(/\b(limited|ltd|llp|plc|l l p)\b/g, " ").replace(/\s+/g, " ").trim();
// Register search results → the ONE active company whose legal name equals the
// tracked name (legal form aside). Several, or none → no candidate.
export function exactCandidate(name, items) {
  const want = legal(name, { notes: true }); if (want.length < 4) return null;
  const hits = (items || []).filter((x) => legal(x.title) === want && /^active/i.test(x.company_status || ""));
  return hits.length === 1 ? hits[0] : null;
}
const UK = /\b(London|UK|United Kingdom|England|Edinburgh|Manchester|Glasgow|Leeds|Birmingham|Bristol|Jersey|Guernsey)\b/i;

// ---- I/O ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function page(path) {
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(BASE + path, { headers: { "user-agent": "Mozilla/5.0 (WireMonitor; +https://github.com/sk8905/meridian)", accept: "text/html" }, signal: AbortSignal.timeout(20000) });
      await sleep(PACE_MS);
      if (r.status === 429) { await sleep(8000 * (a + 1)); continue; }
      return r.ok ? await r.text() : null;
    } catch { await sleep(2000); }
  }
  return null;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const only = opt("--only", "").split(",").filter(Boolean);
  const mgrs = (C.managers || []).filter((m) => !m.profileStub && (!only.length || only.includes(m.id)));
  const byManager = {}, candidates = {}; let read = 0;
  for (const m of mgrs) {
    const num = companyNumberOf(m);
    if (num) {
      const c = parseCompany(await page(`/company/${num}`)); read++;
      if (c) byManager[m.id] = { companyNumber: num, ...c, src: `${BASE}/company/${num}` };
      continue;
    }
    if (!UK.test(String(m.hq || "").split("/")[0])) continue;
    const items = chParseSearch(await page(`/search/companies?q=${encodeURIComponent(String(m.name).replace(/\(.*?\)/g, " ").trim())}`)); read++;
    const hit = exactCandidate(m.name, items);
    if (hit) candidates[m.id] = { name: m.name, companyNumber: hit.company_number, title: hit.title, incorporated: isoFromLong(hit.date_of_creation), src: `${BASE}/company/${hit.company_number}` };
  }
  console.log(JSON.stringify({ generated: new Date().toISOString(), source: BASE + " (public register)", byManager, candidates }, null, 1));
  console.error(`companies house: ${Object.keys(byManager).length} managers read by company number, ${Object.keys(candidates).length} exact-name candidates (${read} pages)`);
  if (!read && mgrs.length) process.exit(2);
}
