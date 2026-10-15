// =============================================================================
// v2/js/transactions/league.js — Transactions ▸ League tables (#/league).
//
// Ranks the parties behind Wire's tracked deal flow — Lenders, Sponsors, Law firms and
// Financial advisers — by DEAL COUNT and DISCLOSED VOLUME (≈ USD via credit/js/tx.js
// toUsd; only amounts that measure the deal itself count — sizeCounts, R39b).
//
// Who a deal credits (written for the coming explicit deal fields):
//   lenders  — d.lenders[] when present (strings: a manager id or a name; objects:
//              { managerId | id, name }), else the deal's managerId. A club deal counts
//              ONCE per lender, and each lender is credited the deal's full disclosed size.
//   sponsor  — d.sponsor when present (string, or { name }), else the existing parse
//              (dealSponsor in v2/js/deal-parse.js, already carried on the row).
//   advisers — v2/js/deal-advisers.js advisersFor(): firms named in the deal's own source
//              or in a tracked law firm's announcement. The financial advisers
//              (FIN_ADVISERS) are split out of the law-firm table.
// Everything here is pure (rows in → ranked rows out) so the spec can drive it directly.
// =============================================================================

export const BY = [["lenders", "Lenders"], ["sponsors", "Sponsors"], ["law", "Law firms"], ["fa", "Financial advisers"]];
export const BY_KEYS = BY.map(([k]) => k);
// The financial advisers in ADVISER_NAMES (deal-advisers.js); every other name is a law firm.
export const FIN_ADVISERS = new Set(["Houlihan Lokey", "Rothschild", "PJT Partners", "Lazard", "Evercore", "Moelis", "Perella Weinberg", "Alvarez & Marsal", "FTI Consulting", "Kroll"]);

export const norm = (s) => String(s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/\(.*?\)/g, " ").replace(/[^a-z0-9]+/g, " ").trim();

// A name → tracked-manager index (full name and the name without a bracketed suffix).
// toUsd (credit/js/tx.js) is passed in, not imported: this module also runs under node
// in tests/tx-league.mjs, where the app's root-absolute /credit/js/ path doesn't resolve.
export function managerIndex(managers, toUsd = null) {
  const byId = new Map(), byName = new Map();
  for (const m of managers || []) {
    byId.set(m.id, m);
    for (const k of [norm(m.name), norm(String(m.name || "").replace(/\s*\(.*?\)/g, ""))]) if (k && !byName.has(k)) byName.set(k, m);
  }
  return { byId, byName, toUsd };
}

// The lenders a deal credits: [{ key, id?, name }] — unique per deal (club deals once).
export function lendersOf(d, idx) {
  const out = [], seen = new Set();
  const add = (id, name, own) => {
    const m = id && idx.byId.get(id) || (!id && name && idx.byName.get(norm(name))) || null;
    const key = m ? m.id : name ? "n:" + norm(name) : "";
    if (!key || key === "n:" || seen.has(key)) return;
    seen.add(key); out.push({ key, id: m ? m.id : "", name: m ? m.name : String(name).trim(), ...(own !== undefined ? { own } : {}) });
  };
  if (d && Array.isArray(d.lenders) && d.lenders.length) {
    // A lender's OWN stated share (audited lenders[].amount, $m in its ccy) is what it is
    // credited. When any lender on the deal has a stated share, the others get the deal
    // counted but no volume — never the whole deal size each (that double-counts a club).
    const anyOwn = d.lenders.some((l) => l && typeof l === "object" && l.amount != null);
    for (const l of d.lenders) {
      if (typeof l === "string") { if (idx.byId.has(l)) add(l, ""); else add("", l); }
      else if (l && typeof l === "object") {
        const own = !anyOwn || !idx.toUsd ? undefined : (l.amount != null ? idx.toUsd({ v: l.amount, ccy: l.ccy || "USD" }) : null);
        add(l.managerId || (idx.byId.has(l.id) ? l.id : ""), l.name || "", own);
      }
    }
    if (out.length) return out;
  }
  if (d && d.managerId) add(d.managerId, "");
  return out;
}

// The deal's sponsor name: the explicit field first, else the parse carried on the row.
export function sponsorOf(r) {
  const s = r && r.d && r.d.sponsor;
  if (s && typeof s === "object" && s.name) return String(s.name).trim();
  if (typeof s === "string") return s.trim();
  return (r && r.sponsor) || "";
}

// Aggregate: keysOf(r) → [{ key, name, id? }]. Returns rows ranked by count, then volume.
export function aggregate(rows, keysOf) {
  const m = new Map();
  for (const r of rows) {
    const seen = new Set();
    for (const p of keysOf(r) || []) {
      if (!p || !p.key || seen.has(p.key)) continue;
      seen.add(p.key);
      let a = m.get(p.key);
      if (!a) { a = { key: p.key, name: p.name, id: p.id || "", n: 0, vol: 0, sized: 0, deals: [], latest: 0 }; m.set(p.key, a); }
      a.n++; a.deals.push(r);
      if (p.own !== undefined) { if (p.own != null) { a.vol += p.own; a.sized++; } }   // the lender's own stated share
      else if (r.sizeOk && r.usd != null) { a.vol += r.usd; a.sized++; }
      if (r.ts > a.latest) a.latest = r.ts;
    }
  }
  return [...m.values()];
}
export function rank(list, sort = "n") {
  const f = sort === "vol" ? (a, b) => b.vol - a.vol || b.n - a.n : (a, b) => b.n - a.n || b.vol - a.vol;
  return list.slice().sort((a, b) => f(a, b) || a.name.localeCompare(b.name));
}
