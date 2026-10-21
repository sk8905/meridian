// The profile rota (scripts/profile-rota.mjs) drives the slow-data refresh. Its 13F
// clock must be right: a quarter's 13F-HR is due 45 days after quarter end, so the
// "latest available" quarter flips on the deadline, not on the quarter end.
import { latest13fQuarter, rota, expectedFirmYear } from "../scripts/profile-rota.mjs";
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
check(r.hedgeFundNoNews.length === 5 && r.hedgeFundsWithoutNews >= r.hedgeFundNoNews.length && r.hedgeFundNoNews.every((h, i, a) => i === 0 || (a[i - 1].aum || 0) >= (h.aum || 0)), "rota lists hedge funds with no news on record, biggest first");
// Audit 2026-10-21 slices: every gap the audit found has a bounded, ordered worklist.
const r2 = rota({ hf: 5, lp: 2, mgr: 3, firms: 2, funds: 3, tags: 4, now: at("2026-10-21") });
for (const k of ["hedgeFundWeakSource", "hedgeFundAumFromIntel", "managerAumGap", "lpNoAum", "lawFirmFinancials", "staleOpenFunds", "dealTagGaps"]) check(Array.isArray(r2[k]), `rota has the ${k} slice`);
check(r2.managerAumGap.length <= 3 && r2.lawFirmFinancials.length <= 2 && r2.staleOpenFunds.length <= 3 && r2.dealTagGaps.length <= 4, "the new slices honour their bounds");
check(r2.dealTagGaps.every((d, i, a) => i === 0 || a[i - 1].date >= d.date), "deal-tag gaps are newest first");
check(r2.hedgeFundAumFromIntel.every((h) => h.date > String(h.aumAsOf || "")), "AUM-from-news lists only news newer than the profile figure");
checkEq(expectedFirmYear({ tier: "magic", london: {} }, at("2026-10-21")), 2026, "UK firm: FY2025/26 results are due by October 2026");
checkEq(expectedFirmYear({ tier: "us-elite", london: { revenueBasis: "US$m" } }, at("2026-03-01")), 2024, "US firm before Am Law season: FY2024 is the latest");
finish();
