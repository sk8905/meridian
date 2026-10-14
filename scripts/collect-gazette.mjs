// =============================================================================
// collect-gazette.mjs — UK Gazette CORPORATE insolvency notices for the companies Wire
// tracks (restructuring-plan / scheme companies + UK obligors in Transactions ▸ Credits),
// docs/implementation-plan.md B4.
//
// Licence & etiquette: Gazette content is under the Open Government Licence, which
// "does not cover personal data" (thegazette.co.uk/data). So: ONLY corporate notice
// codes (24xx — corporate insolvency) are kept; personal-insolvency codes (25xx) are
// never requested or stored, and the person-name fields a notice entry carries
// (f:name / f:familyName) are dropped. robots.txt sets Crawl-delay: 10 — honoured
// (one request per 11s, sequential). The search endpoints used are not disallowed.
//
// A notice is kept only when its TITLE (the company the notice is about) matches the
// tracked company name after removing legal-form suffixes — a text hit inside another
// company's notice is not a notice about ours. Output = candidates for the routine to
// verify and record (legal `restructurings` / Credits status); nothing is applied here.
//
// Runs in .github/workflows/collect-gazette.yml (the Gazette is blocked from the routine
// containers). Usage:
//   node scripts/collect-gazette.mjs > backfill/gazette.json
//   node scripts/collect-gazette.mjs --only="Thames Water,EG Group"
// =============================================================================
import * as L from "../legal/js/data.js";
import * as E from "../credit/js/eu-credits.js";

const args = process.argv.slice(2);
const opt = (n, d) => { const a = args.find((x) => x.startsWith(n + "=")); return a ? a.slice(n.length + 1) : d; };
const UA = "WireMonitor/1.0 (+https://github.com/sk8905/meridian)";
export const CRAWL_DELAY_MS = 11000;           // robots.txt Crawl-delay: 10
const BASE = "https://www.thegazette.co.uk/insolvency/notice/data.json";

// ---- pure, unit-tested ------------------------------------------------------------
export const isCorporateCode = (code) => /^24\d\d$/.test(String(code || ""));
const SUFFIX = /\b(limited|ltd|plc|llp|lp|holdings?|group|international|uk|\(uk\)|bidco|topco|midco|finco|s\.a\.r\.l|sarl|sa|b\.v|bv|gmbh|inc|llc)\b\.?/gi;
export const normCo = (s) => String(s || "").toLowerCase().replace(/\(.*?\)/g, " ").replace(/&/g, " and ").replace(SUFFIX, " ").replace(/[^a-z0-9]+/g, " ").trim();
// Keep a notice only if it is corporate AND about the tracked company itself.
export function pickNotices(trackedName, json) {
  const want = normCo(trackedName);
  if (want.length < 2) return [];
  return [].concat((json && json.entry) || []).filter((e) => isCorporateCode(e["f:notice-code"]) && normCo(e.title) === want)
    .map((e) => {
      const page = [].concat(e.link || []).filter((l) => !l["@rel"]).map((l) => l["@href"]).find((h) => /\/notice\/[^/]+$/.test(h || "")) || e.id;
      return { company: e.title, noticeCode: e["f:notice-code"], category: (e.category && e.category["@term"]) || null, published: String(e.published || "").slice(0, 10) || null, url: page };
    });   // person-name fields (f:name / f:familyName) and addresses deliberately not carried
}
export function targets() {
  const rx = (L.restructurings || []).map((r) => ({ name: r.company, from: "restructuring" }));
  const uk = (E.EUR_CREDITS || []).filter((c) => /united kingdom|^uk$|england|scotland|wales|jersey/i.test(c.jurisdiction || "")).map((c) => ({ name: c.name, from: "credits" }));
  const seen = new Set();
  return [...rx, ...uk].filter((t) => { const k = normCo(t.name); if (!k || seen.has(k)) return false; seen.add(k); return true; });
}

// ---- I/O ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function search(name) {
  const u = `${BASE}?text=${encodeURIComponent('"' + name.replace(/\(.*?\)/g, "").trim() + '"')}&results-page-size=50`;
  try {
    const r = await fetch(u, { headers: { accept: "application/json", "user-agent": UA }, signal: AbortSignal.timeout(30000) });
    if (!r.ok) return { error: `http-${r.status}` };   // a refusal is respected — no retry trickery
    return await r.json();
  } catch (e) { return { error: String(e.message || e) }; }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const only = opt("--only", "").split(",").map((s) => s.trim()).filter(Boolean);
  const list = only.length ? only.map((name) => ({ name, from: "manual" })) : targets();
  const out = { generated: new Date().toISOString(), source: "The Gazette (OGL v3.0; personal data excluded) — " + BASE, companies: {} };
  let ok = 0, hits = 0;
  for (const t of list) {
    const j = await search(t.name);
    await sleep(CRAWL_DELAY_MS);
    if (j.error) { out.companies[t.name] = { ...t, error: j.error }; if (/http-(403|429)/.test(j.error)) break; continue; }
    ok++;
    const notices = pickNotices(t.name, j);
    hits += notices.length;
    out.companies[t.name] = { ...t, notices };
  }
  out.summary = { targets: list.length, queried: ok, notices: hits };
  console.log(JSON.stringify(out, null, 1));
  console.error(`gazette: ${ok}/${list.length} queried, ${hits} corporate notice(s) about tracked companies`);
  if (!ok && list.length) process.exit(2);
}
