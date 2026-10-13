// The profile rota (scripts/profile-rota.mjs) drives the slow-data refresh. Its 13F
// clock must be right: a quarter's 13F-HR is due 45 days after quarter end, so the
// "latest available" quarter flips on the deadline, not on the quarter end.
import { latest13fQuarter, rota } from "../scripts/profile-rota.mjs";
import { check, checkEq, finish } from "./lib.mjs";

const at = (s) => Date.parse(s + "T12:00:00Z");
checkEq(latest13fQuarter(at("2026-10-13")).quarter, "Q2 2026", "mid-Oct: Q2 (due 14 Aug) is the latest filed quarter");
checkEq(latest13fQuarter(at("2026-08-13")).quarter, "Q1 2026", "13 Aug: Q2 not yet due → still Q1");
checkEq(latest13fQuarter(at("2026-08-15")).quarter, "Q2 2026", "15 Aug: Q2 now due");
checkEq(latest13fQuarter(at("2026-02-15")).quarter, "Q4 2025", "mid-Feb: Q4 of the prior year");
checkEq(latest13fQuarter(at("2026-10-13")).asOf, "2026-06-30", "quarter-end date is the panel's asOf");
const r = rota({ hf: 5, lp: 2 });
check(r.hedgeFundAum.length === 5 && r.lpProfiles.length === 2, "rota returns the requested oldest-first slices");
check(r.hedgeFundAum.every((h, i, a) => i === 0 || String(a[i - 1].aumAsOf || "") <= String(h.aumAsOf || "~")), "hedge-fund AUM slice is oldest-first");
finish();
