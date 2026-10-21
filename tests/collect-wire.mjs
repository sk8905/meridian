// The wire sweep (owner 2026-10-21, HOUSE_STYLE R52): every News-wire item naming a tracked
// entity enters a PERMANENT queue and stays open until it is recorded in the app or
// rejected with a reason — it never disappears just because it left the 30-day wire.
// Offline: entity matching, the queue merge rules, and the health-check alarm.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { check, checkEq, finish, ROOT } from "./lib.mjs";
import { nameForms, rosterEntities, matchEntities, mergeQueue, keyOf, PLACE, readWire, legalDealItems } from "../scripts/collect-wire.mjs";
import { knownIndex } from "../scripts/collect-candidates.mjs";
import * as CR from "../credit/js/data.js";

// ---- name forms + matching -------------------------------------------------------------
checkEq(nameForms("Apollo Global Management").join(" | "), "Apollo Global Management | Apollo", "a manager is matched by its full and its core name");
checkEq(nameForms("ICG (Intermediate Capital Group)").join(" | "), "ICG | Intermediate Capital", "an acronym's spelled-out name is a form too");
check(!nameForms("HSBC Asset Management (Alternative Credit)").includes("Alternative Credit"), "a descriptive bracket is never a name form");
checkEq(nameForms("Man Group").join(" | "), "Man Group", "a short common word ('Man') is never a form on its own");
const ents = rosterEntities();
for (const k of ["manager", "hf", "firm", "lp", "rx", "stress", "borrower"]) check(ents.some((e) => e.kind === k) && PLACE[k], `the roster covers ${k} entities, each with a place to record them`);
const m1 = matchEntities("Kirkland, Latham, Weil advise as US insurance firm takes PE investment", ents).map((e) => e.name);
check(["Kirkland & Ellis", "Latham & Watkins", "Weil, Gotshal & Manges"].every((n) => m1.includes(n)), `law firms match by their press names (${m1.join(", ")})`);
check(matchEntities("Freshfields apologises over leaked comments about Middle Eastern investors", ents).every((e) => e.kind === "firm"), "'Middle Eastern' does not match a manager");
check(matchEntities("Man charged over fraud", ents).length === 0, "an ordinary word never matches an entity");

// ---- the queue -------------------------------------------------------------------------
const T0 = "2026-10-21T08:00:00.000Z", T1 = "2026-10-21T10:00:00.000Z", T2 = "2026-10-23T10:00:00.000Z";
const story = { title: "Arini closes inaugural direct lending fund", url: "https://example.test/arini-fund?utm=x", source: "Alternative Credit Investor", date: "2026-10-21", entities: [{ kind: "manager", id: "m1", name: "Arini" }] };
const empty = { urls: new Set(), titles: new Set() };
let q = mergeQueue([], [story], { idx: empty, now: T0 });
check(q.length === 1 && q[0].status === "open" && q[0].firstSeen === T0 && q[0].key === "example.test/arini-fund", "a matched wire item enters the queue as open");
q = mergeQueue(q, [], { idx: empty, now: T2 });
check(q.length === 1 && q[0].status === "open", "an open item STAYS in the queue after it has left the wire");
q = mergeQueue(q, [story], { idx: empty, now: T1 });
check(q.length === 1 && q[0].firstSeen === T0, "a re-seen item is not duplicated and keeps its first-seen time");
const held = { urls: new Set([keyOf(story.url)]), titles: new Set() };
const qr = mergeQueue(q, [], { idx: held, now: T2 });
check(qr[0].status === "recorded", "the item closes as recorded once the data holds its URL");
const qj = mergeQueue(q, [], { idx: empty, ledger: [{ url: story.url, status: "rejected", reason: "passing mention", at: T2 }], now: T2 });
check(qj[0].status === "rejected" && qj[0].reason === "passing mention", "a ledger rejection closes the item with its reason");
const qrec = mergeQueue(q, [], { idx: empty, ledger: [{ url: story.url, status: "recorded", recordId: "i9999", at: T2 }], now: T2 });
check(qrec[0].status === "recorded" && qrec[0].recordId === "i9999", "a ledger record closes the item with the record id");
const later = new Date(Date.parse(T2) + 100 * 864e5).toISOString();
check(mergeQueue(qj, [], { idx: empty, now: later }).length === 0, "a closed item is trimmed from the audit trail after 90 days");
check(mergeQueue(q, [], { idx: empty, now: later }).length === 1, "an OPEN item is never trimmed, however old");

// A record already in the data closes its wire item (the real data index).
const d0 = (CR.deals || [])[0];
const qd = mergeQueue([], [{ ...story, url: d0.sourceUrl, title: d0.headline }], { idx: knownIndex(), now: T0 });
check(qd[0].status === "recorded", "an item whose source the data already cites is closed at once");

// The wire is read through the Worker's own pipeline (offline fetcher).
const rss = `<rss><channel><item><title>Arini closes inaugural direct lending fund</title><link>https://alternativecreditinvestor.com/2026/10/21/arini/</link><pubDate>${new Date().toUTCString()}</pubDate></item></channel></rss>`;
const w = await readWire({ fetcher: async (f) => (f.source === "Alternative Credit Investor" ? rss : null) });
check(w.items.length === 1 && w.items[0].source === "Alternative Credit Investor", `readWire parses a source's feed with the Worker's pipeline (${w.items.length})`);

// ---- the health check flags an item left open for more than 48h -------------------------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "wq-"));
const qfile = path.join(tmp, "q.json");
fs.writeFileSync(qfile, JSON.stringify({ generated: new Date().toISOString(), items: [{ ...q[0], firstSeen: new Date(Date.now() - 3 * 864e5).toISOString() }] }));
const r = spawnSync(process.execPath, [path.join(ROOT, "scripts/health-check.mjs"), "--json", "--no-ci"], { cwd: ROOT, encoding: "utf8", env: { ...process.env, WIRE_QUEUE_FILE: qfile }, maxBuffer: 16 << 20 });
let hj = null; try { hj = JSON.parse(r.stdout); } catch { /* reported below */ }
const iss = hj && [...(hj.fails || []), ...(hj.attention || [])].find((i) => i.area === "wire-sweep" && /waited/.test(i.detail));
check(!!iss && /1 /.test(iss.detail), `health check: an item open for more than 48h is flagged (${iss && iss.detail})`);
// Law-firm deal announcements (audit 2026-10-21): a firm's own "X advises Y on …"
// release that names a tracked party joins the queue, and closes only when a DEAL-side
// record cites it — not because it is held as a legal item.
{
  const ents = [{ kind: "manager", id: "mA", name: "Antares Capital", forms: ["Antares"], res: [/\bAntares\b/i] }, { kind: "manager", id: "mC", name: "Clifford Capital", forms: ["Clifford"], res: [/\bClifford\b/i] }, { kind: "firm", id: "weil", name: "Weil", forms: ["Weil"], res: [/\bWeil\b/i] }];
  const items = [
    { id: "u1", firm: "weil", date: "2026-10-20", url: "https://www.weil.com/a", title: "Weil Advises Antares Capital in Financing for Eide Bailly" },
    { id: "u2", firm: "cliffordchance", date: "2026-10-20", url: "https://www.cliffordchance.com/b", title: "Clifford Chance advises GD Towers on its €1 billion debut public bond" },
    { id: "u3", firm: "weil", date: "2026-10-20", url: "https://www.weil.com/c", title: "Weil partner named to Antares Capital advisory board" },
    { id: "u4", firm: "weil", date: "2026-08-01", url: "https://www.weil.com/d", title: "Weil Advises Antares Capital on Refinancing" },
  ];
  const got = legalDealItems(items, ents, { since: "2026-09-21", firms: { weil: "Weil" } });
  check(got.length === 1 && got[0].url.endsWith("/a") && got[0].via === "law-firm" && got[0].entities[0].id === "mA" && got[0].source === "Weil", "law-firm deals: an advisory release naming a tracked party is queued (with its firm as source)");
  check(!got.some((g) => g.url.endsWith("/b")), "law-firm deals: the firm's own name never matches a tracked entity (Clifford Chance ≠ Clifford Capital)");
  check(!got.some((g) => /\/(c|d)$/.test(g.url)), "law-firm deals: not a transaction, or older than the window → not queued");
  const idx = { urls: new Set(["weil.com/a"]), titles: new Set(), dealUrls: new Set() };
  const q1 = mergeQueue([], got, { idx, now: "2026-10-21T00:00:00Z" });
  checkEq(q1[0].status, "open", "law-firm deals: held as a legal item is NOT enough to close it");
  const q2 = mergeQueue(q1, [], { idx: { ...idx, dealUrls: new Set(["weil.com/a"]) }, now: "2026-10-21T02:00:00Z" });
  checkEq(q2[0].status, "recorded", "law-firm deals: it closes once a deal-side record cites it");
}
finish();
