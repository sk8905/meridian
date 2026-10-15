// =============================================================================
// aum-currency.mjs — a manager's AUM currency tag must agree with its own AUM text
// (owner request 2026-10-15, after ICG's "$126bn" was restated as if it were EUR and
// shown as ~€116bn ($130bn)). `aumFrom` says which currency each stored figure was
// converted from; when `aumText` plainly states a currency ($ / US$ / € / £) and
// aumFrom tags a different one, the restatement is wrong or the text describes a
// different figure — either way a human must look.
//
// RATCHET: the records below were already in that state on 2026-10-15 and are on the
// review list for the refresh routine's AUM check and the Profiles audit
// (docs/refresh-routines.md "AUM currency check"). A NEW mismatch fails this spec;
// resolving one means deleting its id here (the spec fails until you do, so the list
// only ever shrinks).
// =============================================================================
import { check, finish } from "./lib.mjs";
import { managers } from "../credit/js/data.js";

export const REVIEW = new Set(["m4", "m8", "m9", "m12", "m18", "m22", "m53", "m56", "m69", "m71", "m97", "m98", "m110", "m116", "m121", "m125"]);

const ccyOf = (t) => {
  const s = String(t || "").trim();
  if (/^(US)?\$/.test(s)) return "USD";
  if (/^€/.test(s)) return "EUR";
  if (/^£/.test(s)) return "GBP";
  return null;
};
const mismatched = managers.filter((r) => r.aumFrom && ccyOf(r.aumText) && Object.values(r.aumFrom).some((c) => c !== ccyOf(r.aumText)));
const ids = new Set(mismatched.map((r) => r.id));
const fresh = mismatched.filter((r) => !REVIEW.has(r.id));
check(fresh.length === 0, `no new AUM currency mismatch${fresh.length ? " — " + fresh.map((r) => `${r.id} ${r.name}: "${r.aumText}" vs aumFrom ${JSON.stringify(r.aumFrom)}`).join(" | ") : ""}`);
const resolved = [...REVIEW].filter((id) => !ids.has(id));
check(resolved.length === 0, `review list is current${resolved.length ? " — resolved, delete from REVIEW: " + resolved.join(", ") : ""}`);
const icg = managers.find((r) => r.id === "m2");
check(icg && !icg.aumFrom && icg.aum === 126, "ICG is stored as its own US$ figure ($126bn, 31 Mar 2026), not restated from EUR");
console.log(`  review list: ${REVIEW.size} managers still to check`);
finish();
