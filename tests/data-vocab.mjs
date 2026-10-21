// =============================================================================
// data-vocab.mjs — controlled vocabularies and record hygiene (data audit 2026-10-21).
// Each field below drives a filter facet, so a free-text value splits the facet
// ("Active" next to "Actively allocating") or drops the record from it. The fixes
// are deterministic rules in scripts/normalise-data.mjs and scripts/dedupe-data.mjs;
// run those, never hand-edit around this spec.
// =============================================================================
import { check, finish } from "./lib.mjs";
import * as C from "../credit/js/data.js";
import * as L from "../legal/js/data.js";
import { DEAL_TAGS } from "../credit/js/deal-tags.js";

const list = (a) => a.slice(0, 8).join(", ") + (a.length > 8 ? ` … +${a.length - 8}` : "");

const badType = C.deals.filter((d) => !C.DEAL_TYPES.includes(d.type)).map((d) => `${d.id}:${d.type}`);
check(badType.length === 0, `deals: every type is in DEAL_TYPES${badType.length ? " — " + list(badType) + " (add a synonym in normalise-data.mjs)" : ""}`);

const badMandate = C.lps.filter((l) => l.mandateStatus && !C.MANDATE_STATUS.includes(l.mandateStatus)).map((l) => `${l.id}:${l.mandateStatus}`);
check(badMandate.length === 0, `lps: every mandateStatus is in MANDATE_STATUS${badMandate.length ? " — " + list(badMandate) : ""}`);

const ids = new Set(C.deals.map((d) => d.id));
const orphan = Object.keys(DEAL_TAGS).filter((id) => !ids.has(id));
check(orphan.length === 0, `deal-tags: every tag belongs to a deal in the ledger${orphan.length ? " — " + list(orphan) + " (node scripts/normalise-data.mjs drops them)" : ""}`);

const spaced = L.items.filter((i) => /\s|%20/.test(i.url || "")).map((i) => i.id);
check(spaced.length === 0, `legal.items: no source URL carries spaces${spaced.length ? " — " + list(spaced) : ""}`);

const nt = (t) => String(t || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const seen = new Map(), dup = [];
for (const i of L.items) { const k = `${i.firm}|${i.date}|${nt(i.title)}`; if (seen.has(k)) dup.push(`${seen.get(k)}/${i.id}`); else seen.set(k, i.id); }
check(dup.length === 0, `legal.items: one record per firm + date + title${dup.length ? " — " + list(dup) + " (node scripts/dedupe-data.mjs)" : ""}`);

const badKind = C.funds.filter((f) => f.kind != null && !Object.hasOwn(C.FUND_KINDS, f.kind)).map((f) => `${f.id}:${f.kind}`);
check(badKind.length === 0, `funds: every kind is in FUND_KINDS (R39n)${badKind.length ? " — " + list(badKind) : ""}`);
const both = C.funds.filter((f) => f.kind && f.evergreen).map((f) => f.id);
check(both.length === 0, `funds: a platform / partnership is not also evergreen (R39n)${both.length ? " — " + list(both) : ""}`);

finish();
