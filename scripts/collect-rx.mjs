// =============================================================================
// collect-rx.mjs — deterministic candidates for legal `restructurings` (English Part 26A
// restructuring plans and Part 26 creditor schemes that reached court).
//
// Why: the refresh routine had no named sources for this lane and fell back on general
// web search, which is stale for it (owner 2026-10-19 — "Restructurings 34d old" while
// every run reported "nothing verifiable found"). These sources answer from a plain fetch:
//   1. The National Archives Find Case Law Atom feed — handed-down judgments. Each hit is
//      CONFIRMED as a Part 26 / 26A case from its own judgment text (data.xml), so FSMA
//      Part VII insurance transfers and unrelated "Part 26A" mentions drop out.
//   2. South Square's WordPress posts — judgment notes from the leading insolvency set,
//      often within days of hand-down (a lead: the routine verifies it).
//   3. GRR's Part 26A / scheme topic pages — the earliest news signal (paywalled, so a
//      lead only, never a citation).
// Nothing is applied to the data files: the output is a worklist for the routine, which
// verifies each item and records it per docs/refresh-routines.md → "Restructurings".
//
// Runs in .github/workflows/collect-rx.yml (daily). Usage:
//   node scripts/collect-rx.mjs > backfill/rx-candidates.json
// =============================================================================
import * as L from "../legal/js/data.js";

const UA = "WireMonitor/1.0 (+https://github.com/sk8905/meridian)";
const TNA = "https://caselaw.nationalarchives.gov.uk/atom.xml";
// Courts where English schemes / plans are heard (Chancery / Business & Property, Court of Appeal).
const COURTS = ["ewhc/ch", "ewhc/bp", "ewca/civ"];
const QUERIES = ['"Part 26A"', '"restructuring plan"', '"scheme of arrangement"'];
const WINDOW_DAYS = 120;

// ---- pure, unit-tested ------------------------------------------------------------
const tag = (s, re) => { const m = re.exec(s); return m ? m[1] : null; };
const unesc = (s) => String(s || "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#8211;/g, "–").replace(/&#8217;/g, "’").replace(/&quot;/g, '"').replace(/&#039;/g, "'");
/** Atom XML → [{ title, url, xml, published, updated, citation, court }] */
export function parseAtom(xml) {
  return String(xml || "").split("<entry>").slice(1).map((e) => ({
    title: unesc(tag(e, /<title>([\s\S]*?)<\/title>/)),
    url: tag(e, /<link href="([^"]+)" rel="alternate"\/>/),
    xml: tag(e, /<link href="([^"]+\/data\.xml)"/),
    published: (tag(e, /<published>([^<]+)<\/published>/) || "").slice(0, 10) || null,
    updated: (tag(e, /<updated>([^<]+)<\/updated>/) || "").slice(0, 10) || null,
    citation: tag(e, /<tna:identifier[^>]*type="ukncn">([^<]+)<\/tna:identifier>/),
    court: unesc(tag(e, /<author><name>([^<]+)<\/name><\/author>/)),
  })).filter((x) => x.url);
}
/** Is this judgment text a CREDITOR restructuring under Part 26A / Part 26 — not a solvent
 *  takeover scheme (members' scheme under the Takeover Code), not an FSMA Part VII
 *  insurance transfer, and not a judgment that only mentions a scheme in passing? */
export function isPart26(text) {
  const t = String(text || "");
  const count = (re) => (t.match(re) || []).length;
  const p26a = count(/Part 26A\b|section 901[A-L]\b|s\.\s?901[A-L]\b/gi) >= 2;
  const creditorScheme = count(/scheme creditors|creditors[’'] scheme|plan creditors|scheme of arrangement between [^.]{0,80}creditors|creditor scheme/gi) >= 2;
  const takeover = /Takeover Code|Takeover Panel|scheme shareholders|members[’'] scheme|scheme of arrangement between [^.]{0,80}(members|shareholders)/i.test(t);
  const partVII = /Part VII\b/i.test(t) && !p26a;
  return (p26a || (creditorScheme && !takeover)) && !partVII;
}
export const normCo = (s) => String(s || "").toLowerCase().replace(/\(.*?\)/g, " ").replace(/,?\s*re\b\.?$/i, " ").replace(/\b(limited|ltd|plc|llp|gmbh|s\.?a\.?r?\.?l?|b\.?v|inc|llc|holdings?|group|and others|& ors|ors)\b\.?/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
/** Already held? (citation, judgment URL, or same company within ±10 days) */
export function heldIn(rows, cand) {
  const n = normCo(cand.title);
  return (rows || []).some((r) => (cand.citation && r.citation === cand.citation)
    || (r.judgmentUrl && cand.url && r.judgmentUrl.replace(/\/$/, "") === cand.url.replace(/\/$/, ""))
    || (n && normCo(r.company) && (normCo(r.company).includes(n) || n.includes(normCo(r.company)))
        && cand.published && r.date && Math.abs(Date.parse(r.date) - Date.parse(cand.published)) <= 10 * 864e5));
}
const RX_TITLE = /restructuring plan|scheme|sanction|convening|part 26a|\bEWHC\b|\bre\b/i;
/** South Square WP posts → judgment-note leads */
export function pickSouthSquare(posts) {
  return (posts || []).map((p) => ({ title: unesc((p.title || {}).rendered || ""), url: p.link, date: String(p.date || "").slice(0, 10) }))
    .filter((p) => /judgment|ewhc|ewca|scheme|restructuring plan|sanction|convening/i.test(p.title) && RX_TITLE.test(p.title));
}
/** GRR topic page HTML → article leads (slug → readable title) */
export function pickGrr(html) {
  const seen = new Set();
  return [...String(html || "").matchAll(/href="\/article\/([a-z0-9-]+)"/g)].map((m) => m[1])
    .filter((s) => !/^grr-awards|^grr-100|shortlist/.test(s) && !seen.has(s) && seen.add(s))
    .map((s) => ({ title: s.replace(/-/g, " "), url: `https://globalrestructuringreview.com/article/${s}` }));
}

// ---- I/O ---------------------------------------------------------------------------
const get = async (url, as = "text", headers = {}) => {
  try {
    const r = await fetch(url, { headers: { "user-agent": UA, ...headers }, signal: AbortSignal.timeout(30000) });
    return r.ok ? await r[as]() : null;
  } catch { return null; }
};
async function main() {
  const rows = L.restructurings || [];
  const since = new Date(Date.now() - WINDOW_DAYS * 864e5).toISOString().slice(0, 10);
  const seen = new Map(), errors = [];
  for (const q of QUERIES) {
    const u = `${TNA}?query=${encodeURIComponent(q)}&order=-date&per_page=50&${COURTS.map((c) => "court=" + c).join("&")}`;
    const xml = await get(u);
    if (!xml) { errors.push(`tna ${q}`); continue; }
    for (const e of parseAtom(xml)) if (e.published && e.published >= since && !seen.has(e.url)) seen.set(e.url, e);
  }
  const judgments = [];
  for (const e of seen.values()) {
    if (heldIn(rows, e)) continue;
    const text = e.xml ? await get(e.xml) : null;
    if (!text) { errors.push(`data.xml ${e.citation || e.url}`); continue; }
    if (!isPart26(text)) continue;
    judgments.push({ company: e.title.replace(/,\s*Re$/, ""), date: e.published, citation: e.citation, court: e.court, judgmentUrl: e.url, uploaded: e.updated, source: "tna" });
  }
  const ss = await get("https://southsquare.com/wp-json/wp/v2/posts?per_page=40&_fields=date,link,title", "json");
  if (!ss) errors.push("southsquare");
  const grrHtml = [await get("https://globalrestructuringreview.com/topic/part-26a-restructuring-plan", "text", { "user-agent": "Mozilla/5.0" }),
    await get("https://globalrestructuringreview.com/topic/scheme-of-arrangment", "text", { "user-agent": "Mozilla/5.0" })];
  if (!grrHtml.some(Boolean)) errors.push("grr");
  const leads = [
    ...pickSouthSquare(ss).filter((p) => p.date >= since).map((p) => ({ ...p, source: "south-square" })),
    ...grrHtml.flatMap(pickGrr).map((p) => ({ ...p, source: "grr" })),
  ];
  const out = { generated: new Date().toISOString(), windowDays: WINDOW_DAYS,
    summary: { judgments: judgments.length, leads: leads.length, tnaHits: seen.size, held: rows.length, errors },
    judgments: judgments.sort((a, b) => b.date.localeCompare(a.date)), leads };
  console.log(JSON.stringify(out, null, 1));
}
if (import.meta.url === `file://${process.argv[1]}`) main();
