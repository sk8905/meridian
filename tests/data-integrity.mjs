// Data integrity across EVERY curated collection (pure logic — no browser / no egress).
// The 2026-10-13 audit found 110 duplicate legal rows, 16 duplicate credit rows, 105
// undated legal items, a duplicated research id and homepage-only citations — none of
// which any spec caught. This guards the structural half of "every item real, sourced,
// dated" (HOUSE_STYLE R7). It cannot prove a source SUPPORTS a record — that needs the
// sampling verifier — but it stops the mechanical defects from recurring.
//   HARD rules (must be zero): unique ids; no same-entity+same-URL duplicates; ISO
//   dates, none in the future; http(s) URLs; legal firm ids resolve.
//   RATCHETS (known debt — may only shrink; lower the constant when you clear some,
//   never raise it): undated legal items, estimated legal dates, homepage-only
//   citations, low-grade aggregator citations, fund status outside FUND_STATUS.
import * as C from "../credit/js/data.js";
import * as L from "../legal/js/data.js";
import { check, finish } from "./lib.mjs";

const MAX_UNDATED_LEGAL = 47;
const MAX_ESTIMATED_LEGAL = 372;
const MAX_HOMEPAGE_CITES = 4;      // d261 d227 i256 i154 — re-point to the actual release
const MAX_WEAK_CITES = 77;
const MAX_BAD_FUND_STATUS = 8;

const urlOf = (r) => r.sourceUrl || r.url || "";
const list = (a) => a.slice(0, 8).join(", ") + (a.length > 8 ? ` …(+${a.length - 8})` : "");
const COLLS = {
  deals: C.deals, intel: C.intel, HEDGE_INTEL: C.HEDGE_INTEL, funds: C.funds, managers: C.managers,
  HEDGE_FUNDS: C.HEDGE_FUNDS, lps: C.lps, research: C.research,
  "legal.items": L.items, "legal.cases": L.cases, "legal.firms": L.firms,
};

// 1) unique ids in every collection
for (const [name, rows] of Object.entries(COLLS)) {
  const seen = new Set(), dup = [];
  for (const r of rows || []) { if (!r || r.id == null) continue; if (seen.has(r.id)) dup.push(r.id); seen.add(r.id); }
  check(dup.length === 0, `${name}: ids are unique${dup.length ? ` (dupes: ${list(dup)})` : ""}`);
}

// 2) no duplicate records: same entity + same source URL
function dupBy(rows, keyFn) {
  const g = new Map();
  for (const r of rows || []) { const u = urlOf(r); if (!u) continue; const k = keyFn(r) + "|" + u; (g.get(k) || g.set(k, []).get(k)).push(r.id); }
  return [...g.values()].filter((v) => v.length > 1).map((v) => v.join("/"));
}
for (const [name, rows, key] of [["deals", C.deals, (r) => r.managerId], ["intel", C.intel, (r) => r.managerId],
  ["HEDGE_INTEL", C.HEDGE_INTEL, (r) => r.hfId], ["legal.items", L.items, (r) => r.firm], ["legal.cases", L.cases, () => ""]]) {
  const d = dupBy(rows, key);
  check(d.length === 0, `${name}: no two records share the same entity + source URL${d.length ? ` (dupes: ${list(d)})` : ""}`);
}

// 3) dates: ISO YYYY-MM-DD, never in the future (1-day grace for timezones)
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
for (const [name, rows, required] of [["deals", C.deals, true], ["intel", C.intel, true], ["HEDGE_INTEL", C.HEDGE_INTEL, true],
  ["legal.cases", L.cases, true], ["legal.items", L.items, false]]) {
  const bad = [], future = [];
  for (const r of rows || []) {
    if (!r.date) { if (required) bad.push(r.id); continue; }
    if (!ISO.test(r.date) || Number.isNaN(Date.parse(r.date))) bad.push(`${r.id}:${r.date}`);
    else if (r.date > tomorrow) future.push(`${r.id}:${r.date}`);
  }
  check(bad.length === 0, `${name}: every date is a real ISO YYYY-MM-DD${bad.length ? ` (bad: ${list(bad)})` : ""}`);
  check(future.length === 0, `${name}: no future-dated records${future.length ? ` (${list(future)})` : ""}`);
}
const undated = (L.items || []).filter((i) => !i.date).map((i) => i.id);
check(undated.length <= MAX_UNDATED_LEGAL, `legal.items: undated items do not grow (${undated.length} ≤ ${MAX_UNDATED_LEGAL})`);
const est = (L.items || []).filter((i) => i.dateEstimated).length;
check(est <= MAX_ESTIMATED_LEGAL, `legal.items: estimated (non-exact) dates do not grow (${est} ≤ ${MAX_ESTIMATED_LEGAL})`);

// 4) citations: http(s), point at an article (not a bare homepage), not a low-grade aggregator
const CITED = [...C.deals, ...C.intel, ...C.HEDGE_INTEL, ...L.items, ...L.cases];
const badScheme = [], homepage = [], weak = [];
const WEAK = /(^|\.)(finance\.yahoo\.com|cbonds\.(com|de)|legaldesire\.com|tradingview\.com|marketscreener\.com|pulse2\.com|investing\.com|disruptionbanking\.com|placera\.se|financialcontent\.com|sahmcapital\.com|globallegalchronicle\.com|mortgageintroducer\.com|wordpress\.com|blogspot\.com|benzinga\.com|finviz\.com|dealroom\.co|scottishfinancialreview\.com|kalkinemedia\.com|dfcfw\.com|briefs\.co|247wallst\.com|esg-investing\.com|gurufocus\.com|seekingalpha\.com|insidermonkey\.com|marketbeat\.com)$/;
for (const r of CITED) {
  const u = urlOf(r); let p;
  try { p = new URL(u); } catch { badScheme.push(r.id); continue; }
  if (!/^https?:$/.test(p.protocol)) { badScheme.push(r.id); continue; }
  if (p.pathname.replace(/\/+$/, "") === "" && !p.search) homepage.push(r.id);
  if (WEAK.test(p.hostname.replace(/^www\./, ""))) weak.push(r.id);
}
check(badScheme.length === 0, `citations: every source URL is http(s)${badScheme.length ? ` (bad: ${list(badScheme)})` : ""}`);
check(homepage.length <= MAX_HOMEPAGE_CITES, `citations: homepage-only sources do not grow (${homepage.length} ≤ ${MAX_HOMEPAGE_CITES}${homepage.length ? `: ${list(homepage)}` : ""})`);
check(weak.length <= MAX_WEAK_CITES, `citations: low-grade aggregator sources do not grow (${weak.length} ≤ ${MAX_WEAK_CITES}) — cite the issuer, filing or a tier-1 outlet`);

// 5) references resolve: legal firm ids; fund status vocabulary
const firmIds = new Set((L.firms || []).map((f) => f.id));
const strayFirm = (L.items || []).filter((i) => i.firm && !firmIds.has(i.firm)).map((i) => `${i.id}:${i.firm}`);
check(strayFirm.length === 0, `legal.items: every firm id is a tracked firm${strayFirm.length ? ` (stray: ${list(strayFirm)})` : ""}`);
const badStatus = (C.funds || []).filter((f) => f.status && !C.FUND_STATUS.includes(f.status)).length;
check(badStatus <= MAX_BAD_FUND_STATUS, `funds: status outside FUND_STATUS does not grow (${badStatus} ≤ ${MAX_BAD_FUND_STATUS})`);

// Banned outlets (owner request, 2026-10): no record may cite Channel NewsAsia.
{
  const BANNED = /(^|\.)(channelnewsasia\.com|cna\.asia)$/i;
  const all = [...(C.deals || []), ...(C.intel || []), ...(C.HEDGE_INTEL || []), ...(L.items || []), ...(L.cases || [])];
  const hits = all.filter((r) => [r.url, r.sourceUrl].some((u) => { try { return u && BANNED.test(new URL(u).hostname); } catch { return false; } })).map((r) => r.id);
  check(!hits.length, `no record cites a banned outlet (Channel NewsAsia)${hits.length ? " — " + hits.join(", ") : ""}`);
}
finish();
