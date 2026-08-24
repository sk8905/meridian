// =============================================================================
// network/store.js — the LinkedIn-connections importer's data layer.
//
// PRIVACY: everything here stays on the device. A LinkedIn "Connections.csv"
// export is parsed IN THE BROWSER, matched against Wire's own roster of
// managers / hedge funds / law firms, and only the rows that match an entity we
// actually track are kept — in localStorage, under the keys below. The other
// ~95% of a contact list (people at firms Wire doesn't cover) is dropped the
// moment parsing finishes and never persisted. Nothing is ever sent to the
// Worker or any third party — there is no fetch in this module.
//
// The roster (credit/js/data.js + legal/js/data.js) is heavy, so it is loaded
// LAZILY via dynamic import() only when an import actually runs. The badge
// lookup (matchesFor) reads localStorage by key and needs no roster at all, so
// importing this module stays cheap for the profile pages that only read.
// =============================================================================

const KEY = "wire.li.v1";

// ---- persistence -----------------------------------------------------------
export function load() {
  try { const o = JSON.parse(localStorage.getItem(KEY) || "null"); return (o && typeof o === "object") ? o : null; }
  catch { return null; }
}
function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota / private mode — feature just won't persist */ }
}
export function clearAll() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
// People you know at one entity, for the profile badge. Reads localStorage by
// the "<kind>:<id>" key — no roster load, safe to call on every profile render.
export function matchesFor(kind, id) {
  const s = load();
  const e = s && s.confident && s.confident[kind + ":" + id];
  return (e && Array.isArray(e.people)) ? e.people : [];
}

// ---- CSV ------------------------------------------------------------------
// RFC-4180-ish parser: handles quoted fields, "" escapes and quoted newlines,
// so a company like "Smith, Jones & Co" or a multi-line note survives intact.
function parseCSV(text) {
  const rows = []; let row = [], field = "", q = false;
  const t = String(text || "").replace(/\r\n?/g, "\n");
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c === '"') { if (t[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') { q = true; }
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}
// LinkedIn prepends a "Notes:" preamble before the real header row, and the
// column order isn't guaranteed — so find the header by content and map by name.
function readConnections(text) {
  const rows = parseCSV(text);
  let hi = -1, col = {};
  for (let i = 0; i < rows.length; i++) {
    const h = rows[i].map((x) => x.trim().toLowerCase());
    if (h.includes("first name") && h.includes("company")) {
      hi = i;
      h.forEach((name, idx) => { col[name] = idx; });
      break;
    }
  }
  if (hi < 0) return null;                                  // not a Connections export
  const out = [];
  for (let i = hi + 1; i < rows.length; i++) {
    const r = rows[i]; if (!r || !r.length) continue;
    const at = (n) => (col[n] != null ? (r[col[n]] || "").trim() : "");
    const company = at("company");
    if (!company) continue;                                 // no employer → nothing to match
    const name = [at("first name"), at("last name")].filter(Boolean).join(" ").trim();
    out.push({ name: name || "(no name)", position: at("position"), company });
  }
  return out;
}

// ---- name normalisation + matching ----------------------------------------
// Strip only true legal-entity suffixes (LLP/LLC/LP/Ltd/…) — NOT identity words
// like "Capital", "Partners", "Management", "Group": collapsing those would fuse
// distinct firms ("Apollo" vs "Apollo Global Management"). "&" → "and".
const LEGAL_SUFFIX = new Set(["llp", "llc", "lp", "lllp", "pllc", "pc", "inc", "incorporated", "ltd", "limited", "plc", "gmbh", "ag", "sa", "sarl", "bv", "nv", "co", "corp", "corporation"]);
function norm(s) {
  let x = String(s || "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
  x = x.replace(/^the\s+/, "");
  let toks = x.split(/\s+/).filter(Boolean);
  while (toks.length > 1 && LEGAL_SUFFIX.has(toks[toks.length - 1])) toks.pop();
  return toks.join(" ");
}
const ROUTE = { manager: (id) => "#/manager/" + id, hf: (id) => "#/hf/" + id, firm: (id) => "#/firm/" + id };

// Build the roster index once per import (lazy dynamic import of the heavy data).
async function rosterIndex() {
  const [credit, legal] = await Promise.all([import("/credit/js/data.js"), import("/legal/js/data.js")]);
  const idx = [];
  const add = (kind, id, name) => { const n = norm(name); if (n) idx.push({ key: kind + ":" + id, kind, id, name, route: ROUTE[kind](id), norm: n }); };
  (credit.managers || []).forEach((m) => add("manager", m.id, m.name));
  (credit.HEDGE_FUNDS || []).forEach((f) => add("hf", f.id, f.name));
  (legal.firms || []).forEach((f) => add("firm", f.id, f.name));
  return idx;
}
// Classify one company against the roster:
//   exact    — normalised names equal (confident)
//   prefix   — one is a whole-token prefix of the other (ambiguous → confirm),
//              e.g. "Citadel Securities" vs "Citadel", or a bare "Kirkland".
// Returns { entity, kind:"exact"|"prefix" } or null.
function classify(company, idx) {
  const nc = norm(company);
  if (nc.length < 3) return null;
  let exact = null, prefix = null, prefixLen = -1;
  for (const e of idx) {
    if (e.norm === nc) { exact = e; break; }
    const a = nc, b = e.norm;
    const short = a.length <= b.length ? a : b, long = a.length <= b.length ? b : a;
    if (short.length >= 3 && (long === short || long.startsWith(short + " "))) {
      if (short.length > prefixLen) { prefix = e; prefixLen = short.length; }
    }
  }
  if (exact) return { entity: exact, kind: "exact" };
  if (prefix) return { entity: prefix, kind: "prefix" };
  return null;
}

// Import a Connections.csv body: parse → match → persist. Returns a summary or
// throws with a readable message the UI can show. Merges confirmed decisions
// from any prior import so re-importing doesn't re-ask about them.
export async function importCSV(text) {
  if (/PK\x03\x04/.test(String(text).slice(0, 4))) {
    throw new Error("That looks like the .zip archive — open it and import the Connections.csv file inside.");
  }
  const conns = readConnections(text);
  if (!conns) throw new Error("Couldn't find a LinkedIn Connections export in that file (no “First Name … Company” header row).");
  const idx = await rosterIndex();
  const prev = load();
  const confirmedOK = (prev && prev.confirmedMap) || {};    // company(norm) → key, user-accepted before

  const confident = {};                                     // key → {kind,id,name,route,people:[]}
  const pendingBy = {};                                     // company → {key,kind,id,name,route,people:[]}
  const put = (bag, e, person) => {
    const slot = bag[e.key] || (bag[e.key] = { kind: e.kind, id: e.id, name: e.name, route: e.route, people: [] });
    if (!slot.people.some((p) => p.name === person.name && p.position === person.position)) slot.people.push(person);
  };
  const byEntity = {};                                      // for confident aggregation keyed by entity
  for (const c of conns) {
    const m = classify(c.company, idx);
    if (!m) continue;
    const person = { name: c.name, position: c.position };
    const forced = confirmedOK[norm(c.company)];
    if (m.kind === "exact" || forced === m.entity.key) {
      put(byEntity, m.entity, person);
    } else {
      const g = pendingBy[c.company] || (pendingBy[c.company] = { company: c.company, key: m.entity.key, kind: m.entity.kind, id: m.entity.id, name: m.entity.name, route: m.entity.route, people: [] });
      if (!g.people.some((p) => p.name === person.name && p.position === person.position)) g.people.push(person);
    }
  }
  Object.assign(confident, byEntity);
  const state = {
    savedAt: new Date().toISOString(),
    total: conns.length,
    confident,
    pending: Object.values(pendingBy),
    confirmedMap: confirmedOK,
  };
  save(state);
  return state;
}

// Accept an ambiguous match → fold its people into the confident set and
// remember the decision (so a future re-import treats this company as confident).
export function accept(company) {
  const s = load(); if (!s) return s;
  const p = (s.pending || []).find((x) => x.company === company); if (!p) return s;
  const slot = s.confident[p.key] || (s.confident[p.key] = { kind: p.kind, id: p.id, name: p.name, route: p.route, people: [] });
  p.people.forEach((person) => { if (!slot.people.some((q) => q.name === person.name && q.position === person.position)) slot.people.push(person); });
  s.pending = s.pending.filter((x) => x.company !== company);
  s.confirmedMap = s.confirmedMap || {};
  s.confirmedMap[normPub(company)] = p.key;
  save(s); return s;
}
export function dismiss(company) {
  const s = load(); if (!s) return s;
  s.pending = (s.pending || []).filter((x) => x.company !== company);
  save(s); return s;
}
// normalise() is internal; expose the same transform for the accept() bookkeeping.
function normPub(s) { return norm(s); }
