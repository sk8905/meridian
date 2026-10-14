// BDC roster data: the largest US business development companies, LISTED vs
// INTERVAL/PRIVATE — every reported figure sourced, certifiable only — and the
// manager profile's Vehicles tab listing the BDCs it advises. The roster's UI (a card
// on Dashboard ▸ Credit) is covered by credit-rosters.mjs.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";
import { BDCS } from "../credit/js/bdcs.js";

// ---- 1) Data integrity (pure): every reported figure is sourced, never guessed --
let unsourced = [], badStruct = [], badListed = [];
for (const b of BDCS) {
  if (!["listed", "nontraded"].includes(b.structure)) badStruct.push(b.name);
  const hasFigure = b.totalAssets != null || b.nav != null || b.nonAccrualFV != null || b.repurchaseRequestedPct != null;
  if (hasFigure && !(Array.isArray(b.sources) && b.sources.length && b.sources.every((s) => /^https?:\/\//.test(s.url)))) unsourced.push(b.name);
  if (b.structure === "listed" && (!b.ticker || !b.exchange)) badListed.push(b.name);
  if (b.structure === "nontraded" && b.ticker) badListed.push(b.name + " (non-traded w/ ticker)");
}
check(BDCS.length >= 25, `the roster lists the largest BDCs (${BDCS.length})`);
check(badStruct.length === 0, `every BDC is listed or nontraded (${badStruct.join(", ")})`);
check(unsourced.length === 0, `every reported figure carries a real source URL — certifiable only (${unsourced.join(", ")})`);
check(badListed.length === 0, `listed funds carry a ticker+exchange; non-traded carry none (${badListed.join(", ")})`);
check(BDCS.some((b) => b.structure === "listed") && BDCS.some((b) => b.structure === "nontraded"), "the roster spans both listed and interval/private funds");

// ---- 2) UI: the roster's cards live on Dashboard ▸ Credit — see credit-rosters.mjs.
const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// ---- 2b) A manager profile lists the BDCs it advises under Vehicles ----
{
  const { ctx: c3, pg: p3, errs: e3 } = await open(b, DESKTOP, base + "/v2/profiles/#/manager/m90/vehicles");
  await p3.waitForSelector("#pf-detail #mgr-panes", { timeout: 8000 });
  const veh = await p3.evaluate(() => [...document.querySelectorAll('#pf-detail #mgr-panes .tpane[data-p="vehicles"] .veh-load')].map((r) => r.dataset.nm));
  check(veh.some((n) => /Blue Owl Capital Corp/.test(n)) && veh.some((n) => /Blue Owl Credit Income/.test(n)), `Blue Owl's Vehicles tab lists its BDCs (${veh.join(", ")})`);
  check(veh.filter((n) => /Blue Owl Capital Corp/.test(n)).length === 1, "a BDC already on the manager's SEC vehicle list is not listed twice (same CIK)");
  checkErrs(e3, "manager vehicles BDCs");
  await c3.close();
}

await b.close(); srv.close();
finish();
