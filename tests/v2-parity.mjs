// v2 parity + audit: deep-links render on cold load, a full nav cycle keeps
// exactly one of each shell element and one section per view (no leak/dup), the
// back button traverses, and there are no console errors anywhere. This is the
// acceptance gate for the ported SPA.
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// ---- 1. Cold-load deep links (Worker/serve shell fallback + view hash router) ----
async function deepLink(url, view, min, label) {
  const { ctx, pg, errs } = await open(b, PHONE, base + url);
  await pg.waitForTimeout(1900);
  const r = await pg.evaluate((v) => { const s = document.querySelector(`.v2-view[data-view="${v}"]`); return { len: s ? s.textContent.trim().length : -1, hidden: s ? s.hidden : true }; }, view);
  check(!r.hidden && r.len >= min, `deep-link ${label} renders on cold load (${r.len} chars)`);
  checkErrs(errs, `deep-link ${label}`);
  await ctx.close();
}
// need a real id for the detail routes — read from the data modules first
{
  const { ctx, pg } = await open(b, PHONE, base + "/v2/");
  await pg.waitForTimeout(400);
  const ids = await pg.evaluate(async () => {
    const c = await import("/credit/js/data.js?v=20260722-5");
    const l = await import("/legal/js/data.js?v=20260718-10");
    return { mgr: c.managers[0].id, item: l.items[0].id };
  });
  await ctx.close();
  await deepLink(`/v2/credit/#/manager/${ids.mgr}`, "credit", 800, "credit #/manager");
  await deepLink(`/v2/legal/#/item/${ids.item}`, "legal", 400, "legal #/item");
  await deepLink(`/v2/macro/#/policy`, "macro", 400, "macro #/policy");
  await deepLink(`/v2/`, "home", 2000, "home");
}

// ---- 2. Full nav cycle x2: no duplication, no leak, no errors ----
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
  await pg.waitForTimeout(1200);
  const cdp = await ctx.newCDPSession(pg);
  const tap = async (key) => {
    const box = await pg.evaluate((k) => { const t = document.querySelector(`.mobile-tabbar .mtab[data-key="${k}"]`); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, key);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x, y: box.y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await pg.waitForTimeout(900);
  };
  const order = ["macro", "credit", "legal", "menu", "home", "macro", "credit", "legal", "menu", "home"];
  for (const k of order) await tap(k);
  const counts = await pg.evaluate(() => ({
    headers: document.querySelectorAll("#wire-header .topbar").length,
    tabbars: document.querySelectorAll(".mobile-tabbar").length,
    apps: document.querySelectorAll("#app").length,
    macro: document.querySelectorAll('.v2-view[data-view="macro"]').length,
    credit: document.querySelectorAll('.v2-view[data-view="credit"]').length,
    legal: document.querySelectorAll('.v2-view[data-view="legal"]').length,
    home: document.querySelectorAll('.v2-view[data-view="home"]').length,
    menu: document.querySelectorAll('.v2-view[data-view="menu"]').length,
    visible: document.querySelectorAll(".v2-view:not([hidden])").length,
    activeTab: (document.querySelector(".mobile-tabbar .mtab.is-active") || {}).dataset?.key,
  }));
  checkEq(counts.headers, 1, "cycle: one header after 10 switches");
  checkEq(counts.tabbars, 1, "cycle: one tab bar");
  checkEq(counts.apps, 1, "cycle: one #app");
  checkEq(counts.macro, 1, "cycle: macro mounted once (no leak)");
  checkEq(counts.credit, 1, "cycle: credit mounted once");
  checkEq(counts.legal, 1, "cycle: legal mounted once");
  checkEq(counts.home, 1, "cycle: home mounted once");
  checkEq(counts.menu, 1, "cycle: menu mounted once");
  checkEq(counts.visible, 1, "cycle: exactly one view visible at a time");
  checkEq(counts.activeTab, "home", "cycle: active tab marker tracks the last tab");
  checkErrs(errs, "full nav cycle");

  // ---- 3. Back button traverses the SPA (clean tab-only state: … menu, home) ----
  await pg.goBack(); await pg.waitForTimeout(700);
  checkEq(await pg.evaluate(() => (document.querySelector(".v2-view:not([hidden])") || {}).dataset?.view), "menu", "back button: returns to the previous tab (menu)");

  // ---- 4. In-view interactivity: the active view's own (guarded) handlers fire ----
  await tap("macro");
  await pg.evaluate(() => { const e = [...document.querySelectorAll('.v2-view[data-view="macro"] #ck-secnav .tchip')].find((c) => c.textContent.trim() === "Earnings"); if (e) e.click(); });
  await pg.waitForTimeout(300);
  checkEq(await pg.evaluate(() => (document.querySelector('.v2-view[data-view="macro"] #ck-secnav .tchip.is-on') || {}).textContent?.trim()), "Earnings", "in-view: Macro sub-tab chip switches (active-guarded handler fires)");
  await tap("credit");
  const creditChip = await pg.evaluate(() => { const t = [...document.querySelectorAll('.v2-view[data-view="credit"] .tchip')].find((c) => !c.classList.contains("is-on")); if (t) { t.click(); return t.textContent.trim(); } return null; });
  await pg.waitForTimeout(300);
  checkEq(await pg.evaluate(() => (document.querySelector('.v2-view[data-view="credit"] .tchip.is-on') || {}).textContent?.trim()), creditChip, "in-view: Credit filter chip activates");
  checkErrs(errs, "in-view interactivity");
  await ctx.close();
}

await b.close(); srv.close();
finish();
