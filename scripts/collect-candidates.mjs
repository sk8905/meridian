// =============================================================================
// collect-candidates.mjs — deterministic CANDIDATE collector for the refresh routines.
//
// The audit (2026-10-13) found the routines' collection was almost entirely
// model-driven free web search: ~80 runs in a week added ~27 records, and the "SEC
// EDGAR deterministic path" never ran (the routines couldn't reach the Access-gated
// Worker). This script makes the HUNT deterministic: it pulls the Google News RSS
// search feed for every tracked entity — credit managers, hedge funds and law firms
// (the same news.google.com endpoint the Worker's live wire already uses) — and
// lists the recent stories that are NOT already in the data (by URL or headline).
//
// A candidate is a CUE, never a record: the routine opens/verifies each one (exact
// date, entity, figures from the primary source) before appending anything, exactly
// as for a search hit. Nothing here writes the data files.
//
// Usage:
//   node scripts/collect-candidates.mjs                 # rotating slice, human list
//   node scripts/collect-candidates.mjs --json          # machine-readable
//   node scripts/collect-candidates.mjs --size=80 --days=7 --kind=manager|hf|firm|all
//   node scripts/collect-candidates.mjs --offline=<feed.xml>  # parse a saved feed (tests)
// =============================================================================
import fs from "node:fs";
import * as CR from "../credit/js/data.js";
import * as LG from "../legal/js/data.js";
import { unwrapGnews } from "../src/index.js";

const args = process.argv.slice(2);
const opt = (n, d) => { const a = args.find((x) => x.startsWith(n + "=")); return a ? a.slice(n.length + 1) : d; };
const asJson = args.includes("--json");
const DAYS = Math.max(1, parseInt(opt("--days", "7"), 10) || 7);
const SIZE = Math.max(1, parseInt(opt("--size", "80"), 10) || 80);
const KIND = opt("--kind", "all");
const CONC = 4;

// ---- entity roster + search terms -----------------------------------------
// The search name drops parenthetical qualifiers ("Ares Management (European
// Credit)" → "Ares Management") and corporate suffixes, so the query matches how the
// press writes the name. Credit managers get credit keywords to keep the feed on-topic.
const shortName = (n) => String(n || "").replace(/\s*\([^)]*\)/g, "").replace(/\b(LLP|LLC|L\.P\.|LP|Ltd|Limited|plc|Inc\.?|S\.A\.|AG|SE)\b\.?/g, "").replace(/\s{2,}/g, " ").trim();
const CREDIT_KW = '(credit OR loan OR lending OR financing OR fund OR CLO OR close OR raises OR hires OR appoints)';
export function rosterEntities() {
  const out = [];
  for (const m of CR.managers || []) out.push({ kind: "manager", id: m.id, name: m.name, q: `"${shortName(m.name)}" ${CREDIT_KW}` });
  for (const h of CR.HEDGE_FUNDS || []) out.push({ kind: "hf", id: h.id, name: h.name, q: `"${shortName(h.name)}"` });
  for (const f of LG.firms || []) out.push({ kind: "firm", id: f.id, name: f.name, q: `"${shortName(f.name)}" (advises OR advised OR acted)` });
  return out.filter((e) => KIND === "all" || e.kind === KIND);
}
// Rotate through the roster so successive runs cover everyone (by hour of the year).
export function slice(entities, size, now = Date.now()) {
  if (entities.length <= size) return entities;
  const turn = Math.floor(now / 3600000) % Math.ceil(entities.length / size);
  return entities.slice(turn * size, turn * size + size);
}

// ---- RSS parsing (no deps) ------------------------------------------------------
const decode = (s) => String(s || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
const tag = (x, t) => { const m = new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`).exec(x); return m ? decode(m[1]) : ""; };
export function parseRss(xml) {
  return [...String(xml || "").matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, x]) => {
    const source = tag(x, "source");
    let title = tag(x, "title");
    if (source && title.endsWith(" - " + source)) title = title.slice(0, -(" - " + source).length);
    const pub = Date.parse(tag(x, "pubDate"));
    const link = tag(x, "link");
    return { title, link: unwrapGnews(link) || link, source, date: Number.isNaN(pub) ? null : new Date(pub).toISOString().slice(0, 10) };
  });
}

// ---- dedupe against what Wire already holds ---------------------------------
const normUrl = (u) => String(u || "").toLowerCase().replace(/^https?:\/\/(www\.)?/, "").split(/[?#]/)[0].replace(/\/+$/, "");
const normT = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export function knownIndex() {
  const urls = new Set(), titles = new Set();
  const addR = (u, t) => { if (u) urls.add(normUrl(u)); if (t) titles.add(normT(t)); };
  // alsoReported: the URLs of duplicates merged away by scripts/dedupe-data.mjs —
  // still "known", so a routine never re-adds a merged duplicate.
  for (const r of [...(CR.deals || []), ...(CR.intel || [])]) { addR(r.sourceUrl, r.headline); for (const a of r.alsoReported || []) addR(a.url, a.headline); }
  for (const r of CR.HEDGE_INTEL || []) addR(r.url, r.headline);
  for (const m of CR.managers || []) for (const w of [...(m.webNews || []), ...(m.news || [])]) addR(w.url, w.title);
  for (const r of LG.items || []) { addR(r.url, r.title); for (const a of r.alsoReported || []) addR(a.url, a.headline); }
  for (const r of LG.cases || []) addR(r.url, r.name);
  // URLs a DEAL-side record cites (deals / intel / HEDGE_INTEL / commitments, incl. merged
  // duplicates) — a law-firm deal announcement is only "recorded" once one of these cites
  // it, not merely because it is held as a legal item (collect-wire.mjs, audit 2026-10-21).
  const dealUrls = new Set();
  for (const r of [...(CR.deals || []), ...(CR.intel || [])]) { if (r.sourceUrl) dealUrls.add(normUrl(r.sourceUrl)); for (const a of r.alsoReported || []) if (a.url) dealUrls.add(normUrl(a.url)); }
  for (const r of CR.HEDGE_INTEL || []) if (r.url || r.sourceUrl) dealUrls.add(normUrl(r.url || r.sourceUrl));
  for (const r of CR.commitments || []) if (r.sourceUrl) dealUrls.add(normUrl(r.sourceUrl));
  return { urls, titles, dealUrls };
}
export function isKnown(idx, c) { return idx.urls.has(normUrl(c.link)) || idx.titles.has(normT(c.title)); }
export function isKnownDeal(idx, c) { return !!(idx.dealUrls && idx.dealUrls.has(normUrl(c.link))); }

// The feed matches a quoted name, but a story only qualifies when the headline
// itself names the entity (cuts "X said…" passing mentions deep in the body).
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const namedIn = (title, name) => {
  const n = shortName(name); if (!n) return false;
  // Whole-name match, and not as the tail of a longer proper name ("Blue Man Group").
  return new RegExp(`(^|[^A-Za-z])(?<![A-Z][a-z]+ )${esc(n)}(?![A-Za-z])`, "i").test(title);
};
// The headline must also carry an EVENT word — a transaction, capital-formation or
// people move — so earnings chatter, ESG pieces and share-price commentary drop out.
const EVENT = /\b(financ\w*|loan|lend\w*|lender|debt|credit|unitranche|refinanc\w*|clo|securiti[sz]\w*|fund|funds|raise[sd]?|raising|close[sd]?|closing|final close|first close|launch\w*|acquir\w*|acquisition|buys?|sells?|sale|stake|invest\w*|backs?|backing|hires?|hired|appoint\w*|names|joins?|promot\w*|departs?|exit\w*|merger|partner\w*|mandate|advis\w*|acted|restructur\w*|scheme|administration|insolven\w*|activist|13f|stake)\b/i;
// Results / share-price / earnings coverage is not a deal or people event even when
// it says "loan" or "credit" ("Wells Fargo profit rises on loan growth") — drop it.
const NOISE = /\b(earnings|profit|profits|revenue|quarterly results|q[1-4] (results|20\d\d)|shares (rise|fall|jump|slide|drop)|stock (analysis|price|closes)|price target|dividend|beats? estimates|misses estimates|interactive stock chart)\b/i;
// Aggregators that only re-write others' stories — a story carried ONLY by these
// is dropped (one carried by a real outlet too is kept; the routine cites that).
const WEAK_OUTLETS = /(kalkine|tipranks|marketscreener|ad-hoc-news|streetinsider|seeking alpha|investing\.com|marketbeat|benzinga|finviz|gurufocus|simply wall|yahoo finance|tradingview|moomoo|\bmsn\b|pulse 2\.0|konsulteer|traders union)/i;

// One EVENT is syndicated by many outlets ("Nokia sells unit to Aurelius" ×12), so
// group a single entity's candidates whose headlines share most of their words, and
// keep one per story (with every outlet listed) — the routine verifies an event once.
const STOP = new Set("a an the to of for in on and or with its at by from as is are be has have new".split(" "));
const words = (t) => new Set(normT(t).split(" ").filter((w) => w.length > 2 && !STOP.has(w)));
const overlap = (a, b) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n / Math.max(1, Math.min(a.size, b.size)); };
export function clusterStories(list) {
  const groups = [];
  for (const c of list) {
    // Compare on the words BEYOND the entity's own name, so two different events
    // about one firm ("X closes fund" vs "X hires head") never merge on "X" alone.
    const own = words(shortName(c.entity || ""));
    const w = new Set([...words(c.title)].filter((x) => !own.has(x)));
    const g = groups.find((x) => x.kind === c.kind && x.entityId === c.entityId && overlap(x._w, w) >= 0.6 && [...w].filter((y) => x._w.has(y)).length >= 2);
    if (g) { g.outlets.push(c.source); g.urls.push(c.url); if ((c.date || "") < (g.date || "9")) g.date = c.date; }
    else groups.push({ ...c, outlets: [c.source], urls: [c.url], _w: w });
  }
  return groups.map(({ _w, ...g }) => g).filter((g) => g.outlets.some((o) => !WEAK_OUTLETS.test(String(o || "").trim()))).sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

async function fetchFeed(q) {
  const url = `https://news.google.com/rss/search?hl=en-GB&gl=GB&ceid=GB:en&q=${encodeURIComponent(q + ` when:${DAYS}d`)}`;
  for (let i = 0; i < 2; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (Wire candidate collector)" }, signal: AbortSignal.timeout(12000) });
      if (r.ok) return await r.text();
      if (r.status === 429) await new Promise((res) => setTimeout(res, 2000 * (i + 1)));
    } catch { /* retry once */ }
  }
  return null;
}

export async function collect(entities, { fetcher = fetchFeed } = {}) {
  const idx = knownIndex(), out = [], seen = new Set();
  let fetched = 0, failed = 0;
  const queue = [...entities];
  async function worker() {
    while (queue.length) {
      const e = queue.shift();
      const xml = await fetcher(e.q);
      if (!xml) { failed++; continue; }
      fetched++;
      for (const c of parseRss(xml)) {
        if (!c.title || !namedIn(c.title, e.name) || !EVENT.test(c.title) || NOISE.test(c.title) || isKnown(idx, c)) continue;
        const k = normUrl(c.link) || normT(c.title);
        if (seen.has(k)) continue; seen.add(k);
        out.push({ kind: e.kind, entityId: e.id, entity: e.name, title: c.title, url: c.link, source: c.source, date: c.date });
      }
      await new Promise((res) => setTimeout(res, 250));
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  return { candidates: clusterStories(out), raw: out, fetched, failed };
}

// ---- PREMIUM leads: the paywalled specialists' HEADLINES ------------------------
// Specialist outlets (Private Debt Investor, Creditflux, 9fin, Debtwire, FT, Bloomberg,
// Law360, GRR, IPE …) can't be read in Wire, but their headlines are public. Their
// beat is exactly Wire's, so each headline naming a tracked entity becomes a CUE: the
// routine finds the readable primary (the firm's own release, a filing, an open
// outlet) and records from that — or, if none exists, cites the paywalled article
// with a summary limited to what its public headline/standfirst states.
export const PREMIUM_QUERIES = [
  "site:privatedebtinvestor.com", "site:creditflux.com", "site:9fin.com", "site:debtwire.com", "site:octus.com",
  'site:ft.com ("private credit" OR "direct lending" OR "hedge fund" OR CLO OR restructuring OR "law firm")',
  'site:bloomberg.com ("private credit" OR "direct lending" OR "hedge fund" OR CLO OR restructuring OR "law firm")',
  'site:wsj.com ("private credit" OR "direct lending" OR "hedge fund")',
  "site:law360.com (restructuring OR \"private credit\" OR financing OR \"capital markets\")",
  "site:law.com (\"Big Law\" OR partner OR restructuring OR finance)", "site:globalrestructuringreview.com",
  'site:ipe.com ("private credit" OR "private debt" OR "hedge fund")', 'site:institutionalinvestor.com ("hedge fund" OR "private credit")',
];
export const PAYWALLED_OUTLET = /financial times|\bft\b|bloomberg|wall street journal|\bwsj\b|private debt investor|creditflux|9fin|debtwire|octus|law360|law\.com|global restructuring review|\bgrr\b|\bipe\b|institutional investor|economist|the times|telegraph|barron/i;
export async function collectPremium(entities, { fetcher = fetchFeed } = {}) {
  const idx = knownIndex(), out = [], seen = new Set();
  let fetched = 0, failed = 0;
  for (const q of PREMIUM_QUERIES) {
    const xml = await fetcher(q);
    if (!xml) { failed++; continue; }
    fetched++;
    for (const c of parseRss(xml)) {
      if (!c.title || !EVENT.test(c.title) || NOISE.test(c.title) || isKnown(idx, c)) continue;
      const e = entities.find((x) => namedIn(c.title, x.name));
      if (!e) continue;
      const k = normUrl(c.link) || normT(c.title);
      if (seen.has(k)) continue; seen.add(k);
      out.push({ kind: e.kind, entityId: e.id, entity: e.name, title: c.title, url: c.link, source: c.source, date: c.date, premium: true });
    }
    await new Promise((res) => setTimeout(res, 300));
  }
  return { items: out, fetched, failed };
}
// Merge both passes into one clustered list; flag stories carried ONLY by paywalled
// outlets so the routine knows to look for a readable primary first.
export function mergeCandidates(open, premium) {
  return clusterStories([...open, ...premium]).map((c) => ({ ...c, paywalledOnly: (c.outlets || []).every((o) => PAYWALLED_OUTLET.test(String(o || ""))) }));
}

// ---- CLI --------------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
  const offline = opt("--offline", "");
  const ents = slice(rosterEntities(), SIZE);
  const res = offline
    ? await collect(ents.slice(0, 1), { fetcher: async () => fs.readFileSync(offline, "utf8") })
    : await collect(ents);
  // Premium headlines are matched against the WHOLE roster (not just this run's slice).
  if (!offline && !args.includes("--no-premium")) {
    const prem = await collectPremium(rosterEntities());
    res.premium = { fetched: prem.fetched, failed: prem.failed, matched: prem.items.length };
    res.candidates = mergeCandidates(res.raw || [], prem.items);
  }
  const meta = { generated: new Date().toISOString(), days: DAYS, entities: ents.length, ...res, candidates: undefined, raw: undefined };
  if (asJson) console.log(JSON.stringify({ ...meta, candidates: res.candidates }, null, 2));
  else {
    console.log(`CANDIDATES — ${meta.generated.slice(0, 16)}Z · ${ents.length} entities (${KIND}), last ${DAYS}d · feeds ok ${res.fetched}, failed ${res.failed}`);
    console.log(`${res.candidates.length} recent STORIES (outlets grouped) naming a tracked entity that Wire does NOT hold yet (CUES — verify each before recording):\n`);
    if (res.premium) console.log(`Premium (paywalled) headlines: ${res.premium.matched} named a tracked entity (${res.premium.fetched} queries ok); ⚿ = only paywalled outlets — find a readable primary first.\n`);
    for (const c of res.candidates) console.log(`  ${c.date || "????-??-??"}  [${c.kind}:${c.entityId}] ${c.paywalledOnly ? "⚿ " : ""}${c.entity} — ${c.title}\n      outlets (${c.outlets.length}): ${[...new Set(c.outlets)].slice(0, 6).join(", ")}\n      ${c.url}`);
  }
  if (res.fetched === 0) process.exit(2);   // nothing reachable — say so, don't pretend
}
