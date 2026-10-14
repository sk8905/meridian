// =============================================================================
// collect-matwall.mjs — LEADS for re-sourcing the Dashboard's maturity wall
// (macro/js/content.js MATWALL), European leveraged loans + high yield first.
//
// The free, citable figures appear in (a) LCD's public PitchBook write-ups of the
// Morningstar European Leveraged Loan Index (often syndicated free on Yahoo Finance),
// (b) rating-agency press releases (Fitch, Moody's, S&P), (c) AFME's quarterly
// European High Yield, Leveraged Loan & Private Credit report (free PDF) and
// (d) S&P Dow Jones Indices' monthly S&P UBS Western European Leveraged Loan Index
// dashboard (free PDF, charts a maturity wall by year). The routines' containers
// can't reach most of these, so this runs in a GitHub Action and writes
// backfill/matwall-sources.json. A lead is a CUE, never a figure: the routine opens
// the source and copies numbers VERBATIM into MATWALL.europe with their own date.
//   node scripts/collect-matwall.mjs > backfill/matwall-sources.json
// =============================================================================
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { MATWALL } from "../macro/js/content.js";
import { parseRss } from "./collect-candidates.mjs";

export const QUERIES = [
  '"maturity wall" Europe leveraged loan',
  '"maturity wall" European "high yield"',
  'LCD European leveraged loan maturities 2028',
  'Fitch EMEA leveraged loan maturities',
  "Moody's EMEA speculative-grade maturities",
  'AFME "European High Yield" "Leveraged Loan" report',
];
// Each doc: `urls` tried in order until one answers (S&P DJI refuses some hosts — its
// month-stamped copies and Japanese mirror are alternates); `follow` = a listing page
// whose report link (then PDF) is followed; kind "page" = an HTML article (its own
// published date is read); kind "rss" = a feed (on-topic items kept).
export const DOCS = [
  // Only addresses S&P DJI is known to publish (seen in search results) — no guessed URLs.
  { id: "spdji_weu_ll", name: "S&P UBS Western European Leveraged Loan Index dashboard", urls: [
    "https://www.spglobal.com/spdji/en/documents/performance-reports/dashboard-sp-ubs-western-european-leveraged-loan-indices.pdf",
    "https://www.spglobal.com/spdji/jp/documents/performance-reports/sp-ubs-western-european-leveraged-loan-dashboard.pdf",
  ] },
  { id: "afme_hyll", name: "AFME data & research (HY / leveraged loan / private credit reports)", urls: ["https://www.afme.eu/publications/data-research"], follow: /european-high-yield[^"'#?]*report[^"'#?]*/i },
  { id: "spratings_cmr", name: "S&P Global Ratings — Credit Markets Research hub (Global Refinancing items)", kind: "page", urls: ["https://www.spglobal.com/ratings/en/research/credit-market-research"], pick: /refinanc|maturit/i },
  { id: "fitch_levfin_maturity", name: "Fitch — Global Leveraged Finance Maturity Profile (free reprint)", kind: "page", urls: ["https://www.hellenicshippingnews.com/global-leveraged-finance-maturity-profile-supports-refinancing-flexibility/"], pick: /matur|refinanc|EMEA/i },
  { id: "maalot_pubs", name: "Maalot (S&P affiliate) — free S&P research PDFs", kind: "page", urls: ["https://www.maalot.co.il/Publications"], pick: /refinanc|maturit|credit trends/i, pdfLinks: true },
  { id: "indexology", name: "Indexology (S&P DJI blog) — leveraged loan commentary", kind: "rss", urls: ["https://www.indexologyblog.com/feed/"], pick: /leveraged loan|european leveraged|western europe/i },
];
const ON_TOPIC = /maturit|refinanc|wall|leveraged loan|high.yield|speculative/i;

// RSS items → leads, newest first; `newer` marks items after the held vintage.
export function leadsFrom(xmls, heldIso) {
  const seen = new Set(), out = [];
  for (const xml of xmls) for (const it of parseRss(xml || "")) {
    if (!it.title || !ON_TOPIC.test(it.title)) continue;
    const k = String(it.title).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seen.has(k)) continue; seen.add(k);
    out.push({ title: it.title, url: it.link, source: it.source || null, date: it.date || null, newer: !!(heldIso && it.date && it.date > heldIso) });
  }
  return out.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}
// Lines of a PDF's text that carry the maturity schedule (a year and a number).
export function maturityLines(text, max = 60) {
  const lines = String(text || "").split(/\r?\n/).map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  const out = new Set();
  lines.forEach((l, i) => {
    // A sentence/line that states a maturity figure (a number beyond a bare year) …
    if (/matur|refinanc|maturity wall/i.test(l) && /\d/.test(l.replace(/\b20[2-3]\d\b/g, "").replace(/\b\d{1,2}(\.\d+)*\s+[A-Z]/g, ""))) out.add(l);
    // … or a schedule table under a maturity heading (year followed by a number).
    if (/maturit/i.test(l)) for (const n of lines.slice(i + 1, i + 15)) if (/^\D{0,12}\b20[2-3]\d\b\D{0,6}[\d.,]+/.test(n)) out.add(n);
  });
  return [...out].filter((l) => !/^\d+(\.\d+)+\s/.test(l) || /€|\$|bn|%/.test(l)).slice(0, max);
}
// An HTML page's own published date + the paragraphs matching `pick`.
export function pageFacts(html, pick) {
  const h = String(html || "");
  const meta = (h.match(/(?:article:published_time|datePublished|og:updated_time)["']?\s*(?:content=|:)\s*["']([^"']{10,30})/i) || [])[1];
  const time = (h.match(/<time[^>]*datetime=["']([^"']+)/i) || [])[1];
  const text = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<\/(p|li|h\d|div|tr)>/gi, "\n").replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#8217;|&rsquo;/g, "'").replace(/&#\d+;/g, " ");
  const paras = text.split(/\n+/).map((x) => x.replace(/\s+/g, " ").trim()).filter((x) => x.length > 30 && (!pick || pick.test(x)));
  return { published: (meta || time || "").slice(0, 10) || null, paras: [...new Set(paras)].slice(0, 25) };
}
const UA = { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  accept: "text/html,application/pdf,application/xhtml+xml,*/*;q=0.8", "accept-language": "en-GB,en;q=0.9", referer: "https://www.spglobal.com/spdji/en/" };
async function get(url, bin = false) {
  try { const r = await fetch(url, { headers: UA, redirect: "follow", signal: AbortSignal.timeout(30000) }); if (!r.ok) return { status: r.status }; return { status: r.status, body: bin ? Buffer.from(await r.arrayBuffer()) : await r.text(), type: r.headers.get("content-type") || "" }; }
  catch (e) { return { status: 0, error: String(e).slice(0, 120) }; }
}
function pdfText(buf) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mw-")), f = path.join(dir, "d.pdf");
  try { fs.writeFileSync(f, buf); return execFileSync("pdftotext", ["-layout", f, "-"], { encoding: "utf8", maxBuffer: 32 << 20 }); }
  catch { return null; } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
async function readDoc(d) {
  const tried = [];
  for (const u of d.urls) {
    const res = await readOne(d, u);
    tried.push(`${u} → ${res.status}`);
    if (res.ok) return { ...d, urls: undefined, pick: undefined, follow: undefined, ...res, tried };
  }
  return { id: d.id, name: d.name, status: "unreachable", tried };
}
async function readOne(d, url) {
  if (d.kind === "rss") {
    const r = await get(url); if (!r.body) return { status: r.status };
    const items = parseRss(r.body).filter((it) => !d.pick || d.pick.test(it.title || "")).slice(0, 15).map((it) => ({ title: it.title, url: it.link, date: it.date }));
    return { ok: true, status: r.status, fetched: url, items };
  }
  if (d.kind === "page") {
    const r = await get(url); if (!r.body) return { status: r.status };
    const f = pageFacts(r.body, d.pick);
    const pdfs = d.pdfLinks ? [...new Set([...String(r.body).matchAll(/href=["']([^"']+\.pdf)["']/gi)].map((m) => new URL(m[1], url).href))].slice(0, 20) : undefined;
    return { ok: true, status: r.status, fetched: url, ...f, pdfs };
  }
  let r = await get(url, !d.follow);
  if (d.follow && r.body) {
    const m = String(r.body).match(new RegExp(`href=["']([^"']*${d.follow.source})["']`, "i"));
    if (!m) return { status: r.status, note: "no report link found on the listing page" };
    url = new URL(m[1], url).href;
    const page = await get(url); const pdf = page.body && String(page.body).match(/href=["']([^"']+\.pdf)["']/i);
    if (!pdf) return { status: page.status, report: url, note: "report page has no PDF link" };
    url = new URL(pdf[1], url).href; r = await get(url, true);
  }
  if (!r.body) return { status: r.status, error: r.error || null };
  const isPdf = /pdf/i.test(r.type) || url.endsWith(".pdf");
  if (isPdf && !String(r.body.slice(0, 5)).startsWith("%PDF")) return { status: r.status, note: "not a PDF (blocked page?)" };
  const txt = isPdf ? pdfText(r.body) : String(r.body);
  const dated = txt && (txt.match(/\b(?:as of|data as of|published)\s+([A-Z][a-z]+ \d{1,2}, \d{4}|\d{1,2} [A-Z][a-z]+ \d{4})/) || [])[1];
  return { ok: !!txt, status: r.status, fetched: url, dated: dated || null, lines: txt ? maturityLines(txt) : [], note: txt ? null : "no text (pdftotext missing?)" };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const held = (MATWALL.europe || {}).published || (MATWALL.europe || {}).asOfIso || null;   // leads published after the held write-up
  const xmls = [];
  for (const q of QUERIES) {
    const r = await get(`https://news.google.com/rss/search?hl=en-GB&gl=GB&ceid=GB:en&q=${encodeURIComponent(q + " when:120d")}`);
    xmls.push(r.body || ""); await new Promise((res) => setTimeout(res, 400));
  }
  const leads = leadsFrom(xmls, held);
  const docs = [];
  for (const d of DOCS) docs.push(await readDoc(d));
  console.log(JSON.stringify({ generated: new Date().toISOString(), held, leads, docs }, null, 1));
  console.error(`maturity wall: ${leads.length} leads (${leads.filter((l) => l.newer).length} newer than ${held}); docs ${docs.map((d) => `${d.id}:${d.status}${d.lines ? "/" + d.lines.length + " lines" : d.paras ? "/" + d.paras.length + " paras" : d.items ? "/" + d.items.length + " items" : ""}`).join(" ")}`);
}
