// Transactions ↔ Profiles referential integrity.
//
// Every transaction in the Transactions tab (the `deals` ledger) is attributed to
// a lender/counterparty by id, and the Profiles tab renders that entity's profile
// (Managers / Hedge Funds / Investors / Law firms). This spec guarantees the two
// never drift apart: EVERY id a transaction (or the activity feeds that hang off
// the same rosters) points at MUST resolve to a real profile, so no deal, intel
// item, hedge-fund story, LP commitment or fund can dangle without the profile it
// links to. Run as part of the daily suite (see docs/refresh-routines.md) so a
// refresh that adds a deal for an unlisted manager — or renames/removes an entity
// out from under its deals — fails loudly instead of shipping a dead link.
//
// (The reverse — a profile with no transaction yet — is NOT a defect: the roster
// is a directory, and an entity can be listed before it has a recorded deal. This
// spec reports that coverage as counts only, and never fails on it.)
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
await pg.waitForTimeout(300);

const r = await pg.evaluate(async () => {
  const C = await import("/credit/js/data.js");
  const mId = new Set((C.managers || []).map((m) => m.id));
  const hId = new Set((C.HEDGE_FUNDS || []).map((h) => h.id));
  const lId = new Set((C.lps || []).map((l) => l.id));
  const fId = new Set((C.funds || []).map((f) => f.id));

  // Forward integrity: every id a transaction/activity record points at resolves.
  const orphan = { deals: [], dealFunds: [], intel: [], hedgeIntel: [], commitMgr: [], commitLp: [], fundsMgr: [] };
  (C.deals || []).forEach((d) => {
    if (d.managerId && !mId.has(d.managerId)) orphan.deals.push(`${d.id}→${d.managerId}`);
    if (d.fundId && !fId.has(d.fundId)) orphan.dealFunds.push(`${d.id}→${d.fundId}`);
  });
  (C.intel || []).forEach((i) => { if (i.managerId && !mId.has(i.managerId)) orphan.intel.push(`${i.id}→${i.managerId}`); });
  (C.HEDGE_INTEL || []).forEach((h) => { if (h.hfId && !hId.has(h.hfId)) orphan.hedgeIntel.push(`${h.id || "?"}→${h.hfId}`); });
  (C.commitments || []).forEach((c) => {
    if (c.managerId && !mId.has(c.managerId)) orphan.commitMgr.push(`${c.managerId}`);
    if (c.lpId && !lId.has(c.lpId)) orphan.commitLp.push(`${c.lpId}`);
  });
  (C.funds || []).forEach((f) => { if (f.managerId && !mId.has(f.managerId)) orphan.fundsMgr.push(`${f.id}→${f.managerId}`); });

  // Reverse coverage (informational only).
  const mgrWithDeal = new Set((C.deals || []).map((d) => d.managerId));
  const hfWithIntel = new Set((C.HEDGE_INTEL || []).map((h) => h.hfId));
  const lpWithCommit = new Set((C.commitments || []).map((c) => c.lpId));
  return {
    counts: { deals: (C.deals || []).length, managers: (C.managers || []).length, funds: (C.funds || []).length, hedgeFunds: (C.HEDGE_FUNDS || []).length, hedgeIntel: (C.HEDGE_INTEL || []).length, lps: (C.lps || []).length, commitments: (C.commitments || []).length, intel: (C.intel || []).length },
    orphan,
    coverage: {
      mgrNoDeal: (C.managers || []).filter((m) => !mgrWithDeal.has(m.id)).length,
      hfNoIntel: (C.HEDGE_FUNDS || []).filter((h) => !hfWithIntel.has(h.id)).length,
      lpNoCommit: (C.lps || []).filter((l) => !lpWithCommit.has(l.id)).length,
    },
  };
});

check(r.counts.deals > 500 && r.counts.managers > 100, `data present (${r.counts.deals} deals, ${r.counts.managers} managers, ${r.counts.hedgeFunds} hedge funds, ${r.counts.lps} investors)`);

// FORWARD — every transaction/activity id resolves to a Profiles entity.
check(r.orphan.deals.length === 0, `every deal's manager (lender) has a Profiles › Managers profile (${r.orphan.deals.length} orphan${r.orphan.deals.length === 1 ? "" : "s"}${r.orphan.deals.length ? ": " + r.orphan.deals.slice(0, 8).join(", ") : ""})`);
check(r.orphan.dealFunds.length === 0, `every deal's fund id resolves to a known fund (${r.orphan.dealFunds.slice(0, 8).join(", ")})`);
check(r.orphan.intel.length === 0, `every manager-intel item resolves to a Managers profile (${r.orphan.intel.slice(0, 8).join(", ")})`);
check(r.orphan.hedgeIntel.length === 0, `every hedge-fund story resolves to a Hedge Funds profile (${r.orphan.hedgeIntel.slice(0, 8).join(", ")})`);
check(r.orphan.commitMgr.length === 0, `every LP commitment's manager resolves to a Managers profile (${r.orphan.commitMgr.slice(0, 8).join(", ")})`);
check(r.orphan.commitLp.length === 0, `every LP commitment's investor resolves to an Investors profile (${r.orphan.commitLp.slice(0, 8).join(", ")})`);
check(r.orphan.fundsMgr.length === 0, `every fund's manager resolves to a Managers profile (${r.orphan.fundsMgr.slice(0, 8).join(", ")})`);

// REVERSE — reported as coverage counts; never a failure (a directory entry may
// legitimately precede its first recorded transaction).
check(true, `coverage (informational): ${r.coverage.mgrNoDeal} managers, ${r.coverage.hfNoIntel} hedge funds, ${r.coverage.lpNoCommit} investors have no recorded transaction yet`);

checkErrs(errs, "tx ↔ profiles coverage");
await ctx.close();
await b.close();
srv.close();
finish();
