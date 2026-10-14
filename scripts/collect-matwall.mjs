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
export const DOCS = [
  { id: "spdji_weu_ll", name: "S&P UBS Western European Leveraged Loan Index dashboard", url: "https://www.spglobal.com/spdji/en/documents/performance-reports/dashboard-sp-ubs-western-european-leveraged-loan-indices.pdf" },
  { id: "afme_hyll", name: "AFME data & research (HY / leveraged loan / private credit reports)", url: "https://www.afme.eu/publications/data-research", follow: /european-high-yield[^"'#?]*report[^"'#?]*/i },
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
export function maturityLines(text) {
  const lines = String(text || "").split(/\r?\n/).map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  const i = lines.findIndex((l) => /maturit/i.test(l));
  const near = i < 0 ? [] : lines.slice(Math.max(0, i - 2), i + 40);
  return near.filter((l) => /maturit/i.test(l) || (/\b20[2-3]\d\b/.test(l) && /\d[\d.,]*/.test(l.replace(/\b20[2-3]\d\b/g, "")))).slice(0, 40);
}

const UA = { "user-agent": "Mozilla/5.0 (Wire maturity-wall collector)" };
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
  let url = d.url, r = await get(url, !d.follow);
  if (d.follow && r.body) {
    const m = String(r.body).match(new RegExp(`href=["']([^"']*${d.follow.source})["']`, "i"));
    if (!m) return { ...d, status: r.status, note: "no report link found on the listing page" };
    url = new URL(m[1], d.url).href;
    const page = await get(url); const pdf = page.body && String(page.body).match(/href=["']([^"']+\.pdf)["']/i);
    if (!pdf) return { ...d, report: url, status: page.status, note: "report page has no PDF link" };
    url = new URL(pdf[1], url).href; r = await get(url, true);
  }
  if (!r.body) return { ...d, fetched: url, status: r.status, error: r.error || null };
  const txt = /pdf/i.test(r.type) || url.endsWith(".pdf") ? pdfText(r.body) : String(r.body);
  const dated = txt && (txt.match(/\b(?:as of|data as of|published)\s+([A-Z][a-z]+ \d{1,2}, \d{4}|\d{1,2} [A-Z][a-z]+ \d{4})/) || [])[1];
  return { ...d, fetched: url, status: r.status, dated: dated || null, lines: txt ? maturityLines(txt) : [], note: txt ? null : "no text (pdftotext missing?)" };
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
  console.error(`maturity wall: ${leads.length} leads (${leads.filter((l) => l.newer).length} newer than ${held}); docs ${docs.map((d) => `${d.id}:${d.status}${d.lines ? "/" + d.lines.length + " lines" : ""}`).join(" ")}`);
}
