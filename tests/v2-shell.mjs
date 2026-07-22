// Phase 0 of the ground-up rebuild: the /v2/ SPA shell. Asserts the core
// architecture — ONE document, all five tabs switch client-side with a
// same-document view transition (no reload, no per-tab bundle), and views are
// KEPT ALIVE (revisiting a tab is instant and preserves its state). This is the
// structural fix for the tab-change lag; the spec locks the guarantees in.
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
await pg.waitForTimeout(700);

// Stamp the loaded document so a full reload (which would blow the SPA promise)
// is detectable, and count view transitions.
await pg.evaluate(() => {
  window.__boot = Math.random();
  window.__vt = 0;
  const o = document.startViewTransition && document.startViewTransition.bind(document);
  if (o) document.startViewTransition = (cb) => { window.__vt++; return o(cb); };
});
const boot0 = await pg.evaluate(() => window.__boot);

check(await pg.evaluate(() => !!document.querySelector(".mobile-tabbar")), "bottom tab bar mounted once");
check(await pg.evaluate(() => document.querySelectorAll(".mobile-tabbar").length === 1), "exactly one tab bar");
check(await pg.evaluate(() => !!document.querySelector('.v2-view[data-view="home"]')), "home view mounted on boot");

const cdp = await ctx.newCDPSession(pg);
const tap = async (key) => {
  const box = await pg.evaluate((k) => { const t = document.querySelector(`.mobile-tabbar .mtab[data-key="${k}"]`); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, key);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x, y: box.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await pg.waitForTimeout(350);
  return pg.evaluate(() => ({
    path: location.pathname,
    active: (document.querySelector(".v2-view:not([hidden])") || {}).dataset?.view,
    docs: document.querySelectorAll("#app").length,
    views: document.querySelectorAll(".v2-view").length,
    booted: window.__boot,
    vt: window.__vt,
  }));
};

for (const [key, path] of [["macro", "/v2/macro/"], ["credit", "/v2/credit/"], ["legal", "/v2/legal/"], ["menu", "/v2/menu/"]]) {
  const s = await tap(key);
  checkEq(s.path, path, `tap ${key}: URL is ${path}`);
  checkEq(s.active, key, `tap ${key}: ${key} view is the visible one`);
  checkEq(s.booted, boot0, `tap ${key}: same document (no reload)`);
}
const afterChain = await pg.evaluate(() => window.__vt);
check(afterChain >= 4, `a view transition ran per switch (got ${afterChain})`);

// Keep-alive: bump a counter on Credit, leave, come back — state + mount time
// must survive (proves the view stayed alive and the revisit is instant).
await tap("credit");
await pg.evaluate(() => document.querySelector('.v2-view[data-view="credit"] [data-inc]').click());
await pg.evaluate(() => document.querySelector('.v2-view[data-view="credit"] [data-inc]').click());
const creditMt = await pg.evaluate(() => document.querySelector('.v2-view[data-view="credit"] [data-mt]').textContent);
await tap("macro");
const back = await tap("credit");
const creditState = await pg.evaluate(() => ({
  count: document.querySelector('.v2-view[data-view="credit"] [data-ct]').textContent,
  mt: document.querySelector('.v2-view[data-view="credit"] [data-mt]').textContent,
  mounts: document.querySelectorAll('.v2-view[data-view="credit"]').length,
}));
checkEq(creditState.count, "2", "keep-alive: Credit's tap count survived the round-trip");
checkEq(creditState.mt, creditMt, "keep-alive: Credit's mount time is unchanged (mounted once)");
checkEq(creditState.mounts, 1, "keep-alive: Credit mounted exactly once");
checkEq(back.views, 5, "all five views cached after visiting each");

// Back button traverses the SPA history (no reload).
await pg.goBack(); await pg.waitForTimeout(300);
checkEq(await pg.evaluate(() => window.__boot), boot0, "back button: still the same document");

checkErrs(errs, "v2 shell");
await ctx.close();
await b.close(); srv.close();
finish();
