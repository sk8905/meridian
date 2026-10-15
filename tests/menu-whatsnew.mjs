// Menu ▸ What's new: records that ARRIVED since this device last looked, found by
// diffing record ids against a snapshot (so a backfilled item with an old date still
// counts as new). First visit sets the starting point; "Mark all as seen" re-baselines.
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";
import { deals, items } from "../home-data.js";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/menu/`);
const openNew = async () => {
  await pg.evaluate(() => document.querySelector('.na-menu-bar .tchip[data-sec="new"]').click());
  await pg.waitForFunction(() => { const b = document.querySelector("#v2-menu-new"); return b && !b.querySelector(".watch-loading"); }, null, { timeout: 8000 });
  return pg.evaluate(() => document.querySelector("#v2-menu-new").textContent);
};
await pg.waitForSelector('.na-menu-bar .tchip[data-sec="new"]', { timeout: 8000 });
const first = await openNew();
check(/starting point/i.test(first), "first visit sets a starting point instead of listing the whole database");

// Simulate 2 deals + 1 legal alert arriving after the snapshot: drop their ids from it.
const goneDeals = [deals[0].id, deals[deals.length - 1].id], goneLegal = items[0].id;
await pg.evaluate(({ goneDeals, goneLegal }) => {
  const s = JSON.parse(localStorage.getItem("wire.whatsnew.v1"));
  s.deals = s.deals.filter((id) => !goneDeals.includes(id)); s.legal = s.legal.filter((id) => id !== goneLegal);
  localStorage.setItem("wire.whatsnew.v1", JSON.stringify(s));
}, { goneDeals, goneLegal });
await pg.evaluate(() => document.querySelector('.na-menu-bar .tchip[data-sec="settings"]').click());
const txt = await openNew();
check(/3 new since/.test(txt), `lists exactly the records that arrived since the snapshot ("${txt.slice(0, 40)}")`);
check(/Deals\s*2/.test(txt) && /Law-firm alerts\s*1/.test(txt), "groups them by kind with counts (Deals 2 · Law-firm alerts 1)");
check(txt.includes(deals[deals.length - 1].headline.slice(0, 30)), "an OLD-dated record that is new to the device still appears (backfill is visible)");

await pg.evaluate(() => document.querySelector("#v2-new-seen").click());
await pg.waitForFunction(() => /Nothing new since/.test(document.querySelector("#v2-menu-new").textContent), null, { timeout: 8000 });
check(true, "'Mark all as seen' re-baselines — nothing new afterwards");
checkErrs(errs, "what's new");
await ctx.close(); await b.close(); srv.close();
finish();
