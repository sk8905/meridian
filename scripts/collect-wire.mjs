// =============================================================================
// collect-wire.mjs — the WIRE SWEEP: nothing relevant on the News wire is ever lost.
//
// Owner rule 2026-10-21 (CLAUDE.md "Information database"; HOUSE_STYLE R52): the live
// News wire is a 30-day window, but Deals, Profiles and the Dashboard are a permanent
// information database. So every wire item that relates to something the app tracks —
// a credit manager, hedge fund, law firm, LP, deal borrower, restructuring or a stressed
// credit on the Dashboard — must be recorded in its correct place before it ages out.
//
// This script reads the wire exactly as the Worker builds it (same FEED_SOURCES, same
// parser and quality screens, same 30-day window), finds the headlines that name a
// tracked entity, and keeps them in a PERMANENT QUEUE (backfill/wire-queue.json):
//   • an item enters the queue the first time it is seen and is NEVER dropped while open —
//     even after it has left the live wire;
//   • it closes as "recorded" automatically once the data holds its URL or headline, or
//     when the routine logs it in backfill/wire-ledger.json as recorded (with the record
//     id, e.g. when the record cites the primary source instead) or rejected (with a
//     reason, e.g. a passing mention, not about the entity, duplicate).
// The heavy-sweep routine works every open item (docs/refresh-routines.md → "Wire
// sweep"); scripts/health-check.mjs flags any item left open for more than 48h.
//
// Runs every 2h in .github/workflows/collect-wire.yml (open internet), which commits
// the queue. Usage:
//   node scripts/collect-wire.mjs > backfill/wire-queue.json      (reads the previous queue)
//   node scripts/collect-wire.mjs --summary                       (human list of open items)
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as CR from "../credit/js/data.js";
import * as LG from "../legal/js/data.js";
import * as DB from "../dashboard/js/data.js";
import { FEED_SOURCES, FEED_WINDOW_DAYS, feedParse, feedSourceKeep, feedQualityKeep } from "../src/index.js";
import { knownIndex, isKnown } from "./collect-candidates.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const QUEUE_FILE = path.join(ROOT, "backfill/wire-queue.json");
export const LEDGER_FILE = path.join(ROOT, "backfill/wire-ledger.json");
// Closed items are kept this long for the audit trail; OPEN items are kept forever.
const CLOSED_KEEP_DAYS = 90;

// ---- entity roster ------------------------------------------------------------
// Where a matched item belongs (the routine's guide; see refresh-routines "Wire sweep").
export const PLACE = {
  manager: "credit deals/intel (capital events, hires) or the manager's webNews",
  hf: "HEDGE_INTEL",
  firm: "legal items (the firm's deal / advisory / people news)",
  lp: "commitments (an allocation) or the LP's sources/notes",
  borrower: "the deal record (update or new deal) — Profiles ▸ borrower page",
  rx: "legal restructurings (court step) or the restructuring's notes",
  stress: "Dashboard ▸ Credit stress list (CR_STRESS latest/status) + deal/intel if a transaction",
};
const SUFFIX = /\b(LLP|LLC|L\.P\.|LP|Ltd|Limited|plc|PLC|Inc\.?|S\.A\.|SA|AG|SE|GmbH|N\.V\.|B\.V\.|S\.?p\.?A\.?|Holdings?|Group|Co\.?)\b\.?/g;
// Trailing words that the press usually drops ("Apollo Global Management" → "Apollo").
const GENERIC_TAIL = /\s+(?:Global|Asset|Investment|Investments|Management|Managers|Capital|Partners|Credit|Advisors|Advisers|Alternatives|Private|Debt|Fund|Funds|Insurance|& Co|and Co|Associates|International|Europe|UK|US|LLP)$/;
const COMMON = new Set(("the and park square blue north south east west eastern western northern southern global capital credit partners first new european americas "
  + "private general national standard royal united summit pacific atlantic harbour harbor bridge crescent ocean river lake star apex pinnacle vista horizon peak alpine "
  + "alternative alternatives direct lending income opportunities strategic").split(" "));
const clean = (n) => String(n || "").replace(/\s*\([^)]*\)/g, "").replace(SUFFIX, "").replace(/[,]/g, " ").replace(/\s{2,}/g, " ").trim();
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** The name forms a headline would use: the cleaned name, its core (generic tail words
 *  dropped), and a parenthetical acronym / alt name ("ICG (Intermediate Capital Group)"). */
export function nameForms(name) {
  const forms = new Set();
  const base = clean(name);
  if (base) forms.add(base);
  let core = base;
  for (let i = 0; i < 5; i++) { const n = core.replace(GENERIC_TAIL, "").replace(/\s+(?:&|and)$/, ""); if (n === core) break; core = n.trim(); }
  if (core && core.length >= 4 && !COMMON.has(core.toLowerCase())) forms.add(core);
  for (const [, p] of String(name || "").matchAll(/\(([^)]+)\)/g)) {
    const t = p.trim();
    if (/^[A-Z][A-Z0-9&.\-]{1,7}$/.test(t)) forms.add(t);                         // acronym: BXCI, ICG
    // An alternative proper name only when the main name is itself an acronym
    // ("ICG (Intermediate Capital Group)") — never a descriptive tag ("(Alternative Credit)").
    else if (/^[A-Z0-9&]{2,8}$/.test(base) && /^[A-Z][\w&'.-]*(?: [A-Z&][\w&'.-]*)+$/.test(t)) forms.add(clean(t));
  }
  // A form of 3 letters or fewer must be an acronym ("KKR", "TPG") — never a word ("Man").
  const ok = [...forms].filter((f) => f.length >= 3 && !COMMON.has(f.toLowerCase()) && (f.length > 3 || /^[A-Z0-9&]+$/.test(f)));
  if (ok.length) return ok;
  const full = String(name || "").replace(/\s*\([^)]*\)/g, "").trim();   // e.g. "Man Group" itself
  return full.length >= 4 ? [full] : [];
}
// Case-sensitive whole-word match (an acronym or proper name, not a common word).
const formRe = (f) => new RegExp(`(^|[^A-Za-z0-9])${esc(f)}(?![A-Za-z0-9])`);
const BORROWER_JUNK = /\b(portfolio|loan|loans|CLO|joint venture|business|businesses|seed|assets?|platform|facility|notes|bonds?|units?|refinancing|programme|program)\b|[(:;]/i;
// How the press names the tracked law firms (their full names rarely appear in a headline).
export const FIRM_ALIASES = {
  "Proskauer Rose LLP": ["Proskauer"], "A&O Shearman": ["A&O Shearman", "Allen & Overy"], "Weil, Gotshal & Manges": ["Weil"],
  "Kirkland & Ellis": ["Kirkland"], "Latham & Watkins": ["Latham"], "Herbert Smith Freehills Kramer": ["Herbert Smith Freehills", "HSF Kramer", "HSF"],
  "Cleary Gottlieb": ["Cleary"], "Sidley Austin": ["Sidley"], "Simpson Thacher": ["Simpson Thacher"], "Ropes & Gray": ["Ropes & Gray"],
  "Davis Polk": ["Davis Polk"], "White & Case": ["White & Case"], "Mayer Brown": ["Mayer Brown"], "Hogan Lovells": ["Hogan Lovells"],
  "Reed Smith": ["Reed Smith"], "K&L Gates": ["K&L Gates"], "Stephenson Harwood": ["Stephenson Harwood"], "Slaughter and May": ["Slaughter and May", "Slaughters"],
  "Clifford Chance": ["Clifford Chance"], "Simmons & Simmons": ["Simmons & Simmons"], "Travers Smith": ["Travers Smith"], "South Square": ["South Square"],
};
export function rosterEntities() {
  const out = [];
  const add = (kind, id, name, extra = []) => { const forms = [...new Set([...nameForms(name), ...extra])]; if (forms.length) out.push({ kind, id, name, forms, res: forms.map(formRe) }); };
  for (const m of CR.managers || []) add("manager", m.id, m.name);
  for (const h of CR.HEDGE_FUNDS || []) add("hf", h.id, h.name);
  for (const f of LG.firms || []) add("firm", f.id, f.name, FIRM_ALIASES[f.name] || []);
  for (const l of CR.lps || []) add("lp", l.id, l.name);
  for (const r of LG.restructurings || []) add("rx", r.id, r.company);
  for (const s of DB.CR_STRESS || []) add("stress", s.name, s.name);
  const seenB = new Set();
  for (const d of CR.deals || []) {
    const b = String(d.borrower || "").trim();
    if (!b || BORROWER_JUNK.test(b) || b.split(/\s+/).length > 5 || seenB.has(b)) continue;
    seenB.add(b); add("borrower", d.id, b);
  }
  return out;
}
/** Every tracked entity a headline names (one per entity; longest form wins). */
export function matchEntities(title, ents) {
  const t = String(title || "");
  return ents.filter((e) => e.res.some((re) => re.test(t))).map((e) => ({ kind: e.kind, id: e.id, name: e.name }));
}

// ---- queue ----------------------------------------------------------------------
export const keyOf = (u) => String(u || "").toLowerCase().replace(/^https?:\/\/(www\.)?/, "").split(/[?#]/)[0].replace(/\/+$/, "");
/** Merge the latest wire matches into the permanent queue.
 *  prev: previous queue items · fresh: [{title,url,source,date,entities}] · idx: knownIndex()
 *  ledger: [{key|url, status:"recorded"|"rejected", recordId?, reason?, at?}] · now: ISO time */
export function mergeQueue(prev, fresh, { idx, ledger = [], now = new Date().toISOString() } = {}) {
  const byKey = new Map((prev || []).map((x) => [x.key, { ...x }]));
  for (const f of fresh || []) {
    const key = keyOf(f.url);
    if (!key) continue;
    if (byKey.has(key)) { const x = byKey.get(key); x.lastSeen = now; continue; }
    byKey.set(key, { key, title: f.title, url: f.url, source: f.source, date: f.date, entities: f.entities, firstSeen: now, lastSeen: now, status: "open" });
  }
  const led = new Map((ledger || []).map((l) => [keyOf(l.key || l.url), l]));
  const cut = new Date(Date.parse(now) - CLOSED_KEEP_DAYS * 864e5).toISOString();
  const out = [];
  for (const x of byKey.values()) {
    if (x.status === "open") {
      const l = led.get(x.key);
      if (l && (l.status === "recorded" || l.status === "rejected")) Object.assign(x, { status: l.status, recordId: l.recordId || null, reason: l.reason || null, closed: l.at || now });
      else if (idx && isKnown(idx, { link: x.url, title: x.title })) Object.assign(x, { status: "recorded", recordId: null, reason: "held in the data (URL or headline)", closed: now });
    }
    if (x.status !== "open" && (x.closed || now) < cut) continue;   // closed long ago — trim the audit trail
    out.push(x);
  }
  return out.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || a.key.localeCompare(b.key));
}

// ---- wire read (the Worker's own pipeline) --------------------------------------------
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
async function readFeed(f) {
  for (let i = 0; i < 2; i++) {
    try { const r = await fetch(f.url, { headers: { "user-agent": UA, accept: "*/*" }, signal: AbortSignal.timeout(20000) }); if (r.ok) return await r.text(); } catch { /* retry */ }
  }
  return null;
}
export async function readWire({ fetcher = readFeed, now = Date.now() } = {}) {
  const cutoff = now - FEED_WINDOW_DAYS * 864e5, items = [], failed = [];
  await Promise.all(FEED_SOURCES.map(async (f) => {
    const xml = await fetcher(f);
    if (!xml) { failed.push(f.source); return; }
    for (const x of feedParse(xml, f)) {
      if (!x.when || x.when.getTime() < cutoff || !feedSourceKeep(x, f) || !feedQualityKeep(x)) continue;
      items.push({ title: x.title, url: x.url, source: x.source, date: x.when.toISOString().slice(0, 10) });
    }
  }));
  return { items, failed: [...new Set(failed)] };
}

// ---- CLI ------------------------------------------------------------------------
const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return d; } };
if (import.meta.url === `file://${process.argv[1]}`) {
  const prev = readJson(QUEUE_FILE, { items: [] });
  if (process.argv.includes("--summary")) {
    const open = (prev.items || []).filter((x) => x.status === "open");
    console.log(`WIRE QUEUE — ${open.length} open of ${(prev.items || []).length} (generated ${prev.generated || "never"})`);
    for (const x of open) console.log(`  ${x.date}  [${x.entities.map((e) => `${e.kind}:${e.id}`).join(" ")}] ${x.title}\n      ${x.source} · ${x.url}\n      → ${[...new Set(x.entities.map((e) => PLACE[e.kind]))].join(" | ")}`);
    process.exit(0);
  }
  const ents = rosterEntities();
  const wire = await readWire();
  const fresh = [];
  for (const it of wire.items) { const m = matchEntities(it.title, ents); if (m.length) fresh.push({ ...it, entities: m }); }
  const ledger = readJson(LEDGER_FILE, { items: [] }).items || [];
  const now = new Date().toISOString();
  const items = mergeQueue(prev.items || [], fresh, { idx: knownIndex(), ledger, now });
  const open = items.filter((x) => x.status === "open").length;
  console.log(JSON.stringify({ generated: now, windowDays: FEED_WINDOW_DAYS,
    summary: { wireItems: wire.items.length, matched: fresh.length, open, total: items.length, entities: ents.length, failedSources: wire.failed },
    place: PLACE, items }, null, 1));
  if (!wire.items.length) process.exit(2);   // nothing reachable — never pretend
}
