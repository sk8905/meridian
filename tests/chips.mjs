// Chip-selection lifecycle: selections survive in-page re-renders (the old
// tab-kick bug), reset to the first chip on a fresh page load and when
// returning to a route, and are restored across a pull-to-refresh reload via
// ptr.js's sessionStorage snapshot.
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// MACRO
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/macro/");
  await pg.waitForTimeout(1500);
  const state = () => pg.evaluate(() => ({
    main: document.querySelector("#mac-chips .tchip.is-on")?.textContent.trim(),
    sec: document.querySelector("#ck-secnav .tchip.is-on")?.dataset.sec,
    week: document.querySelector("#ew-weeknav .tchip.is-on")?.dataset.w,
  }));
  await pg.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    [...document.querySelectorAll(".tchip")].find((c) => c.textContent.trim() === "Dashboard").click(); await sleep(300);
    [...document.querySelectorAll("#ck-secnav .tchip")].find((c) => c.dataset.sec === "earnings").click(); await sleep(200);
    [...document.querySelectorAll("#ew-weeknav .tchip")].find((c) => c.dataset.w === "last")?.click(); await sleep(150);
  });
  await pg.evaluate(() => window.dispatchEvent(new Event("hashchange")));
  await pg.waitForTimeout(700);
  let st = await state();
  check(st.main === "Dashboard" && st.sec === "earnings" && st.week === "last", "macro selections survive re-render");
  await pg.reload({ waitUntil: "load" }); await pg.waitForTimeout(1500);
  st = await state();
  check(st.main === "All" && st.sec === "economy" && st.week === "this", "macro reload resets to first chips");
  // PTR snapshot restore
  await pg.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    [...document.querySelectorAll(".tchip")].find((c) => c.textContent.trim() === "Dashboard").click(); await sleep(300);
    [...document.querySelectorAll("#ck-secnav .tchip")].find((c) => c.dataset.sec === "credit").click(); await sleep(200);
    const TAB_ROWS = ["#mac-chips", "#ck-secnav", "#lg-chips", "#cr-dash-tabs", "#firm-chips", "#mgr-tabs", ".g-feed-chips"];
    const sel = [];
    for (const row of TAB_ROWS) { const on = document.querySelector(row + " .tchip.is-on, " + row + " .g-feed-chip.is-on"); if (on) sel.push([row, on.dataset.desk || on.dataset.sec || on.textContent.trim()]); }
    sessionStorage.setItem("wire.ptrTabs", JSON.stringify({ href: location.href, sel, t: Date.now() }));
    location.reload();
  });
  await pg.waitForTimeout(3000);
  st = await state();
  check(st.main === "Dashboard" && st.sec === "credit", "PTR snapshot restores macro tabs across reload");
  checkErrs(errs, "macro chips");
  await ctx.close();
}
// CREDIT (incl. route-away reset)
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/credit/");
  await pg.waitForTimeout(1500);
  const tab = () => pg.evaluate(() => document.querySelector("#cr-dash-tabs .tchip.is-on")?.dataset.p);
  await pg.evaluate(() => document.querySelector('#cr-dash-tabs .tchip[data-p="fundraising"]')?.click());
  await pg.waitForTimeout(300);
  await pg.evaluate(() => window.dispatchEvent(new Event("hashchange")));
  await pg.waitForTimeout(700);
  checkEq(await tab(), "fundraising", "credit selection survives re-render");
  await pg.evaluate(() => { location.hash = "#/managers"; });
  await pg.waitForTimeout(600);
  await pg.evaluate(() => { location.hash = "#/"; });
  await pg.waitForTimeout(700);
  checkEq(await tab(), "all", "credit resets when returning to the route");
  await pg.evaluate(() => document.querySelector('#cr-dash-tabs .tchip[data-p="managers"]')?.click());
  await pg.waitForTimeout(300);
  await pg.reload({ waitUntil: "load" }); await pg.waitForTimeout(1500);
  checkEq(await tab(), "all", "credit reload resets to All");
  checkErrs(errs, "credit chips");
  await ctx.close();
}
// LEGAL
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/legal/");
  await pg.waitForTimeout(1500);
  const tab = () => pg.evaluate(() => document.querySelector("#lg-chips .tchip.is-on")?.dataset.k);
  await pg.evaluate(() => document.querySelector('#lg-chips .tchip[data-k="case"], #lg-chips .tchip[data-k="rp"]')?.click());
  await pg.waitForTimeout(300);
  const picked = await tab();
  await pg.evaluate(() => window.dispatchEvent(new Event("hashchange")));
  await pg.waitForTimeout(700);
  checkEq(await tab(), picked, "legal selection survives re-render");
  await pg.reload({ waitUntil: "load" }); await pg.waitForTimeout(1500);
  checkEq(await tab(), "all", "legal reload resets to All");
  checkErrs(errs, "legal chips");
  await ctx.close();
}
await b.close(); srv.close();
finish();
