// =============================================================================
// collect-sec.mjs — the tracked hedge funds' OWN SEC 13F-HR filings, read straight
// from EDGAR, turned into (1) a per-fund summary of each latest filing and (2) a
// ready-to-apply 13F consensus panel (HF_13F shape) built only from those filings.
//
// Runs in a GitHub Action (.github/workflows/collect-sec.yml) because SEC hosts are
// blocked from the refresh routines' containers. Pure read — writes JSON to stdout;
// the heavy-sweep routine applies the panel. Nothing here is estimated: every number
// is a sum or count over the filings, and every row cites a real EDGAR filing.
//
// Usage:
//   node scripts/collect-sec.mjs > backfill/sec-13f.json
//   node scripts/collect-sec.mjs --only=h1,h2     # a few funds (debugging)
// =============================================================================
import * as C from "../credit/js/data.js";

const args = process.argv.slice(2);
const opt = (n, d) => { const a = args.find((x) => x.startsWith(n + "=")); return a ? a.slice(n.length + 1) : d; };
const UA = "Wire meridian admin (kenneds7@tcd.ie)";   // SEC requires a descriptive UA with a contact
const TOP = 20;                                       // a "position" for consensus = one of a fund's top 20 by value

// ---- parsing (pure, unit-tested) ------------------------------------------------------
const dec = (s) => String(s).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&amp;/g, "&");
const first = (b, tag) => { const m = b.match(new RegExp(`<(?:\\w+:)?${tag}\\b[^>]*>([\\s\\S]*?)</(?:\\w+:)?${tag}>`, "i")); return m ? dec(m[1].trim()) : null; };

// The two most recent ORIGINAL 13F-HR filings (amendments are partial restatements).
// The filer's CURRENT identity on EDGAR (data audit 2026-10-21: Suvretta → Montanova
// Capital, Hudson Bay / Viking moved to Stamford — the profiles hadn't noticed). The rota
// compares it with the profile and lists any rename / move for a routine to apply.
export function entityOf(sub) {
  if (!sub || !sub.name) return null;
  const b = (sub.addresses && sub.addresses.business) || {};
  return {
    name: sub.name,
    formerNames: (sub.formerNames || []).map((f) => ({ name: f.name, from: String(f.from || "").slice(0, 10) || null, to: String(f.to || "").slice(0, 10) || null })),
    city: b.city || null, state: b.stateOrCountry || null, stateName: b.stateOrCountryDescription || null,
  };
}

export function pickFilings(sub, n = 2) {
  const r = (sub && sub.filings && sub.filings.recent) || {};
  const out = [];
  for (let i = 0; i < (r.form || []).length && out.length < n; i++) {
    if (r.form[i] !== "13F-HR") continue;
    if (out.some((f) => f.asOf === r.reportDate[i])) continue;   // a re-filed period: keep the newest
    out.push({ accession: r.accessionNumber[i], filedAt: r.filingDate[i], asOf: r.reportDate[i] || null });
  }
  return out;
}

// Information table → equity positions by CUSIP (whole US$; option-only and
// principal-amount (debt) lines excluded — consensus is about shares held).
export function parseInfoTable(xml, filedAt) {
  const mult = String(filedAt || "") >= "2023-01-01" ? 1 : 1000;   // $ from 2023, $000 before
  const agg = new Map();
  let total = 0;
  for (const [, b] of String(xml || "").matchAll(/<(?:\w+:)?infoTable\b[^>]*>([\s\S]*?)<\/(?:\w+:)?infoTable>/gi)) {
    const value = Math.round((parseFloat(first(b, "value")) || 0) * mult);
    const shares = parseFloat(first(b, "sshPrnamt")) || 0;
    const cusip = (first(b, "cusip") || "").toUpperCase();
    if (!cusip || (!value && !shares)) continue;
    total += value;
    if ((first(b, "putCall") || "").trim() || (first(b, "sshPrnamtType") || "").trim().toUpperCase() === "PRN") continue;
    const e = agg.get(cusip) || { cusip, name: first(b, "nameOfIssuer") || "", value: 0, shares: 0 };
    e.value += value; e.shares += shares; agg.set(cusip, e);
  }
  const rows = [...agg.values()].sort((a, b) => b.value - a.value);
  return { total, rows };
}

const bn = (v) => `$${(v / 1e9).toFixed(v >= 1e10 ? 0 : 1)}bn`;
const names = (a) => a.slice(0, 3).join(", ") + (a.length > 3 ? ` +${a.length - 3} more` : "");

// Funds (each {id, name, cur:{asOf, src, rows}, prev?:{rows}}) → the HF_13F panel.
// Only funds whose latest filing is for `asOf` count. Consensus = names in the most
// tracked funds' top-20; moves = names the most funds newly bought / added >50% to,
// and the most-sold (exited / cut >50%), each versus the fund's previous filing.
export function buildPanel(funds, asOf, { tick = {} } = {}) {
  const inQ = funds.filter((f) => f.cur && f.cur.asOf === asOf && f.cur.rows.length);
  const N = inQ.length;
  const top = new Map(), add = new Map(), cut = new Map();
  const bump = (m, r, f) => { const e = m.get(r.cusip) || { cusip: r.cusip, name: r.name, funds: [], value: 0, src: f.cur.src }; e.funds.push(f.name); e.value += r.value; if (!e.srcValue || r.value > e.srcValue) { e.src = f.cur.src; e.srcValue = r.value; } m.set(r.cusip, e); };
  for (const f of inQ) {
    const cur = f.cur.rows.slice(0, TOP);
    for (const r of cur) bump(top, r, f);
    if (!f.prev || !f.prev.rows.length) continue;
    const was = new Map(f.prev.rows.map((r) => [r.cusip, r]));
    const now = new Map(f.cur.rows.map((r) => [r.cusip, r]));
    for (const r of cur) { const p = was.get(r.cusip); if (!p) bump(add, { ...r, isNew: true }, f); else if (r.shares > p.shares * 1.5) bump(add, r, f); }
    for (const p of f.prev.rows.slice(0, TOP)) { const r = now.get(p.cusip); if (!r || r.shares < p.shares * 0.5) bump(cut, p, f); }
  }
  const rank = (m) => [...m.values()].sort((a, b) => b.funds.length - a.funds.length || b.value - a.value);
  const label = (e) => (tick[e.cusip] && tick[e.cusip].t) || null;
  const nm = (e) => (tick[e.cusip] && tick[e.cusip].name) || tidy(e.name);
  const consensus = rank(top).slice(0, 8).map((e) => ({ t: label(e), name: nm(e), cusip: e.cusip,
    note: `A top-${TOP} holding at ${e.funds.length} of ${N} tracked funds (${names(e.funds)}); ${bn(e.value)} combined.`, src: e.src }));
  const buys = rank(add).filter((e) => e.funds.length >= 2).slice(0, 3).map((e) => ({ t: label(e), name: nm(e), cusip: e.cusip, dir: "buy", by: names(e.funds),
    note: `New or added to (>50% more shares) by ${e.funds.length} of ${N} tracked funds versus their previous filing.`, src: e.src }));
  const sells = rank(cut).filter((e) => e.funds.length >= 2).slice(0, 2).map((e) => ({ t: label(e), name: nm(e), cusip: e.cusip, dir: "sell", by: names(e.funds),
    note: `Exited or cut by more than half at ${e.funds.length} of ${N} tracked funds versus their previous filing.`, src: e.src }));
  return { consensus, moves: [...buys, ...sells], fundsCounted: N };
}

export function quarterLabel(asOf) { const d = new Date(asOf + "T00:00:00Z"); return `Q${Math.floor(d.getUTCMonth() / 3) + 1} ${d.getUTCFullYear()}`; }

// ---- fetching -------------------------------------------------------------------------
let last = 0;
async function sec(url, as = "json") {
  for (let attempt = 0; attempt < 3; attempt++) {
    const wait = Math.max(0, last + 150 - Date.now()); if (wait) await new Promise((r) => setTimeout(r, wait));   // < ~7 req/s
    last = Date.now();
    try {
      const r = await fetch(url, { headers: { "user-agent": UA, accept: "application/json, text/xml, */*" }, signal: AbortSignal.timeout(20000) });
      if (r.status === 429 || r.status >= 500) { await new Promise((res) => setTimeout(res, 2000 * (attempt + 1))); continue; }
      if (!r.ok) return null;
      return as === "json" ? await r.json() : await r.text();
    } catch { /* retry */ }
  }
  return null;
}
async function filing(cik, f) {
  const dir = `https://www.sec.gov/Archives/edgar/data/${Number(cik)}/${f.accession.replace(/-/g, "")}`;
  const idx = await sec(`${dir}/index.json`);
  const files = ((idx && idx.directory && idx.directory.item) || []).map((x) => x.name).filter((n) => /\.xml$/i.test(n) && !/primary_doc/i.test(n));
  for (const n of files) {
    const xml = await sec(`${dir}/${n}`, "text");
    if (xml && /<(?:\w+:)?infoTable\b/i.test(xml)) return { asOf: f.asOf, filedAt: f.filedAt, src: `${dir}/${f.accession}-index.htm`, ...parseInfoTable(xml, f.filedAt) };
  }
  return null;
}
const US_EXCH = new Set(["NMS", "NGM", "NCM", "NAS", "NYQ", "NYS", "ASE", "PCX", "BTS", "NIM"]);
// "AMAZON.COM, INC." / "Warner Bros. Discovery, Inc." → "Amazon.com" / "Warner Bros. Discovery".
export function tidy(n) { return String(n || "").replace(/\s+/g, " ").replace(/[\s\-–—]+$/, "").replace(/,?\s+(inc\.?|incorporated|corp\.?|corporation|co\.?|ltd\.?|limited|plc|holdings?|hldgs|n\.?v\.?|s\.?a\.?|ag|se)$/i, "").replace(/,\s*$/, "").trim(); }
async function tickers(cusips, names = {}) {
  const out = {};
  const search = async (q) => { try { const r = await fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=6&newsCount=0`, { headers: { "user-agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(10000) }); const j = r.ok ? await r.json() : null; return (j && j.quotes) || []; } catch { return []; } };
  for (const c of cusips) {
    try {
      let q = await search(c);
      // No US listing by CUSIP (e.g. an ADR) → try the issuer name, accepting a US
      // listing whose name starts with the same word.
      if (!q.some((x) => US_EXCH.has(x.exchange)) && names[c]) {
        const w = tidy(names[c]).split(" ")[0].toLowerCase();
        q = (await search(tidy(names[c]))).filter((x) => String(x.shortname || x.longname || "").toLowerCase().startsWith(w));
      }
      // US listings only (a 13F security trades in the US; e.g. TSMC's ADR is TSM, not
      // its London line "0LCV"), with the listing's own clean company name.
      const hit = q.find((x) => x.symbol && (x.quoteType === "EQUITY" || x.quoteType === "ETF") && US_EXCH.has(x.exchange) && !/[.^]/.test(x.symbol));
      if (hit) out[c] = { t: hit.symbol, name: tidy(hit.shortname || hit.longname || "") };
    } catch { /* leave unresolved */ }
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const only = opt("--only", "").split(",").filter(Boolean);
  const hfs = (C.HEDGE_FUNDS || []).filter((h) => h.cik && (!only.length || only.includes(h.id)));
  const funds = [], perFund = {};
  for (const h of hfs) {
    const sub = await sec(`https://data.sec.gov/submissions/CIK${String(h.cik).replace(/\D/g, "").padStart(10, "0")}.json`);
    const fs = pickFilings(sub, 2);
    const entity = entityOf(sub);
    if (!fs.length) { perFund[h.id] = { name: h.name, entity, error: sub ? "no 13F-HR" : "submissions unreachable" }; continue; }
    const cur = await filing(h.cik, fs[0]);
    const prev = fs[1] ? await filing(h.cik, fs[1]) : null;
    if (!cur) { perFund[h.id] = { name: h.name, entity, error: "information table not found" }; continue; }
    funds.push({ id: h.id, name: h.name, cur, prev });
    perFund[h.id] = { name: h.name, entity, asOf: cur.asOf, filedAt: cur.filedAt, src: cur.src, total: cur.total, positions: cur.rows.length,
      top: cur.rows.slice(0, 10).map((r) => ({ name: r.name, cusip: r.cusip, value: r.value })) };
  }
  // The panel's quarter = the latest period most tracked funds have filed for.
  const counts = {}; for (const f of funds) counts[f.cur.asOf] = (counts[f.cur.asOf] || 0) + 1;
  const asOf = Object.entries(counts).sort((a, b) => b[1] - a[1] || b[0].localeCompare(a[0]))[0]?.[0] || null;
  let panel = null;
  if (asOf) {
    const draft = buildPanel(funds, asOf);
    const rowsAll = [...draft.consensus, ...draft.moves];
    const tick = await tickers([...new Set(rowsAll.map((x) => x.cusip))], Object.fromEntries(rowsAll.map((x) => [x.cusip, x.name])));
    const p = buildPanel(funds, asOf, { tick });
    const lastFiled = funds.filter((f) => f.cur.asOf === asOf).map((f) => f.cur.filedAt).sort().pop();
    panel = { quarter: quarterLabel(asOf), asOf, filed: `Built from ${p.fundsCounted} tracked funds' own 13F-HR filings for ${quarterLabel(asOf)} (SEC EDGAR; latest filed ${lastFiled}).`,
      // A row needs a ticker to render; one that didn't resolve is left out rather than guessed.
      consensus: p.consensus.filter((x) => x.t).map(({ cusip, ...x }) => x), moves: p.moves.filter((x) => x.t).map(({ cusip, ...x }) => x) };
  }
  console.log(JSON.stringify({ generated: new Date().toISOString(), tracked: hfs.length, filed: funds.length, panel, funds: perFund }, null, 1));
  console.error(`sec 13F: ${funds.length}/${hfs.length} tracked funds read; panel ${panel ? panel.quarter + " from " + panel.filed.match(/\d+/)[0] + " funds" : "none"}`);
  if (!funds.length) process.exit(2);
}
