// =============================================================================
// data-guards.mjs — integrity guards from the data audit of 2026-10-21. Each guard is
// a RATCHET: the records already in that state are listed by id (to be fixed through
// the profile rota — scripts/profile-rota.mjs), a NEW case fails, and fixing a listed
// one fails until its id is deleted here, so the lists only shrink.
// =============================================================================
import { check, finish } from "./lib.mjs";
import * as C from "../credit/js/data.js";
import { DEAL_TAGS } from "../credit/js/deal-tags.js";

const list = (a) => a.slice(0, 8).join(", ") + (a.length > 8 ? ` … +${a.length - 8}` : "");
function ratchet(name, found, known) {
  const fresh = found.filter((x) => !known.has(x)), gone = [...known].filter((x) => !found.includes(x));
  check(fresh.length === 0, `${name}: no new case${fresh.length ? " — " + list(fresh) : ""}`);
  check(gone.length === 0, `${name}: known list is current${gone.length ? " — fixed, delete from the list: " + list(gone) : ""}`);
}

// 1. A manager's AUM never exceeds its firm-wide total (a sleeve > the firm = a currency
//    or scope mix-up), and the credit platform never exceeds the firm either.
const real = C.managers.filter((m) => !m.profileStub);
ratchet("managers: aum ≤ aumTotal", real.filter((m) => m.aum != null && m.aumTotal != null && m.aum > m.aumTotal * 1.01).map((m) => m.id), new Set(["m40", "m96"]));
ratchet("managers: aumCredit ≤ aumTotal", real.filter((m) => m.aumCredit != null && m.aumTotal != null && m.aumCredit > m.aumTotal * 1.01).map((m) => m.id), new Set([]));

// 2. One record per event: the same tracked firm, the same day and the same counterparty
//    is ONE deal (a second outlet goes to alsoReported — scripts/dedupe-data.mjs).
const norm = (s) => String(s || "").toLowerCase().normalize("NFKD").replace(/\(.*?\)/g, " ").replace(/[^a-z0-9]+/g, " ")
  .replace(/\b(ltd|limited|plc|llc|inc|holdings?|group|sa|ag|gmbh|bv|nv|spa|sas|lp)\b/g, " ").replace(/\s+/g, " ").trim();
const party = (d) => norm((DEAL_TAGS[d.id] || {}).party || d.borrower);
const ev = new Map();
for (const d of C.deals) { const p = party(d); if (p.length < 3 || p === "unknown") continue; const k = `${d.managerId}|${d.date}|${p}`; (ev.get(k) || ev.set(k, []).get(k)).push(d.id); }
ratchet("deals: one record per firm + date + counterparty", [...ev.values()].filter((v) => v.length > 1).map((v) => v.join("/")), new Set([]));

// 3. A borrower is in ONE country and ONE sector across its deals (the tag describes the
//    company, not the deal). Known conflicts: vehicles whose name is shared across
//    issuers, and groups tagged per-deal before the rule.
const by = new Map();
for (const d of C.deals) { const p = party(d); if (p.length < 3 || p === "unknown") continue; const t = DEAL_TAGS[d.id] || {}; const b = by.get(p) || by.set(p, { c: new Set(), s: new Set() }).get(p); if (t.country) b.c.add(t.country); if (t.sector) b.s.add(t.sector); }
ratchet("borrowers: one country", [...by].filter(([, v]) => v.c.size > 1).map(([k]) => k), new Set(["esr", "muzinich vehicle", "dutscher", "palmer square vehicle", "fidera vecta", "cedar funding v", "regatta xxiii funding", "signal harmonic clo i", "1box"]));
ratchet("borrowers: one sector", [...by].filter(([, v]) => v.s.size > 1).map(([k]) => k), new Set(["wayflyer", "esr", "meridianlink", "zetland capital", "fasanara capital"]));

// 4. Roles: a fund close / launch / continuation vehicle never labels its party
//    "Borrower"; an asset-manager acquisition's party is the target (or seller / none).
const FUND_EVENTS = new Set(["First Close", "Final Close", "Fundraising", "Launch", "Continuation Vehicle"]);
const fe = C.deals.filter((d) => FUND_EVENTS.has(d.type) && (DEAL_TAGS[d.id] || {}).partyRole === "borrower").map((d) => d.id);
check(fe.length === 0, `deals: a fund event's party is never a "Borrower"${fe.length ? " — " + list(fe) : ""}`);
const ma = C.deals.filter((d) => { const t = DEAL_TAGS[d.id] || {}; return t.managerMA && t.partyRole && !["target", "seller", "none"].includes(t.partyRole); }).map((d) => d.id);
check(ma.length === 0, `deals: a manager-M&A party is the target / seller${ma.length ? " — " + list(ma) : ""}`);

// 5. A re-check that changes nothing is recorded ONCE as lastChecked {date, url} on the
//    record — never as another "confirmed unchanged" entry in `sources` (the audit found
//    4 of 10 such notes were wrong: newer figures were already public).
const UNCHANGED = /confirmed unchanged|no newer (figure|disclosure|filing)|remains the latest|figures? unchanged/i;
let n = 0; for (const coll of ["managers", "lps", "funds", "HEDGE_FUNDS"]) for (const r of C[coll]) for (const s of r.sources || []) if (s && UNCHANGED.test(s.label || "")) n++;
check(n <= 147, `sources: "confirmed unchanged" notes do not grow (${n} ≤ 147) — record a no-change re-check as lastChecked {date, url}`);

finish();
