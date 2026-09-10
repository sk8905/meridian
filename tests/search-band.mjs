// The shared search + $1–15bn band shows on every page. On list pages (Profiles,
// Transactions) the search filters in place with the AUM button merged into its
// row; on other pages (Home, Dashboard, Macro, Newsletters) a matching band opens
// the global command palette, and the $1–15bn button jumps to Profiles → Managers
// with that AUM focus applied.
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
await pg.waitForTimeout(1500);

const cdp = await ctx.newCDPSession(pg);
const tap = async (key) => {
  const p = await pg.evaluate((k) => { const t = document.querySelector(`.mobile-tabbar .mtab[data-key="${k}"]`); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, key);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: p.x, y: p.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await pg.waitForTimeout(1300);
};

// Home (default view) carries the band: a search field (opens the palette) + the
// $1–15bn button (jumps to Managers).
const home = await pg.evaluate(() => {
  const v = document.querySelector('.v2-view[data-view="home"]');
  return { q: !!v.querySelector(".wire-band .wire-band-q[data-open-search]"), aum: !!v.querySelector(".wire-band [data-aum-jump]") };
});
check(home.q, "Home: search band present (opens the command palette)");
check(home.aum, "Home: $1–15bn button present in the band");

// The band's search opens the shared command palette.
await pg.evaluate(() => document.querySelector('.v2-view[data-view="home"] .wire-band .wire-band-q').click());
await pg.waitForTimeout(400);
check(await pg.evaluate(() => !!document.querySelector(".mcmdk.open, .mcmdk.open .mcmdk-input")), "band search opens the command palette");
await pg.keyboard.press("Escape"); await pg.waitForTimeout(200);

// Dashboard, Macro and Newsletters also carry the band.
for (const [key, label] of [["dashboard", "Dashboard"], ["macro", "Macro"], ["newsletters", "Newsletters"]]) {
  if (key === "macro" || key === "newsletters") { await pg.evaluate((k) => { history.pushState({ v2: true }, "", "/v2/" + k + "/"); dispatchEvent(new PopStateEvent("popstate")); }, key); await pg.waitForTimeout(1200); }
  else await tap(key);
  const has = await pg.evaluate((k) => { const v = document.querySelector(`.v2-view[data-view="${k}"]`); return !!(v && v.querySelector(".wire-band .wire-band-q[data-open-search]") && v.querySelector(".wire-band [data-aum-jump]")); }, key);
  check(has, `${label}: search band present`);
}

// The $1–15bn button jumps to Profiles → Managers with the AUM focus applied.
await pg.evaluate(() => { history.pushState({ v2: true }, "", "/v2/"); dispatchEvent(new PopStateEvent("popstate")); });
await pg.waitForTimeout(1000);
await pg.evaluate(() => document.querySelector('.v2-view[data-view="home"] .wire-band [data-aum-jump]').click());
await pg.waitForTimeout(1400);
const jumped = await pg.evaluate(() => ({
  tab: document.documentElement.dataset.v2tab,
  managers: (document.querySelector("#pf-chips .tchip.is-on") || {}).dataset?.p,
  focusOn: (document.querySelector("#cr-lg-focus") || {}).getAttribute?.("aria-pressed") === "true",
}));
checkEq(jumped.tab, "profiles", "$1–15bn jumps to the Profiles tab");
checkEq(jumped.managers, "managers", "$1–15bn lands on the Managers list");
check(jumped.focusOn, "$1–15bn applies the AUM focus on arrival");

checkErrs(errs, "search band");
await ctx.close();
await b.close(); srv.close();
finish();
