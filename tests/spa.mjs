// Client-side tab navigation (spa.js): app↔app tab changes swap in-document with
// a same-document view transition (no full load → no white inter-document blank
// on iOS). Asserts the swap is correct AND clean: right content + stylesheet,
// exactly one copy of the shared chrome, the transition fires, the back button
// works, and Home / off-scope routes fall back to a normal navigation.
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

const { ctx, pg, errs } = await open(b, PHONE, base + "/macro/");
await pg.waitForTimeout(1400);
// Count how often a (same-document) view transition actually runs.
await pg.evaluate(() => { window.__vt = 0; const o = document.startViewTransition.bind(document); document.startViewTransition = (cb) => { window.__vt++; return o(cb); }; });

check(await pg.evaluate(() => typeof window.__spaNavigate === "function"), "spa hook installed via shared header");
// Home / off-scope must NOT be claimed (returns false → caller does a real load).
check(await pg.evaluate(() => window.__spaNavigate("/") === false), "Home falls back to a normal navigation");

const cdp = await ctx.newCDPSession(pg);
const tapTab = async (nav) => {
  const box = await pg.evaluate((n) => { const t = document.querySelector(`.mobile-tabbar .mtab[data-nav="${n}"]`); if (!t) return null; const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, nav);
  if (!box) throw new Error("no tab " + nav);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x, y: box.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await pg.waitForTimeout(1500);
  return pg.evaluate(() => ({
    path: location.pathname,
    vt: window.__vt,
    title: document.title,
    headers: document.querySelectorAll("#wire-header .topbar").length,
    tabbars: document.querySelectorAll(".mobile-tabbar").length,
    apps: document.querySelectorAll("#app").length,
    // page-specific stylesheet: the destination's css/styles.css present, others' gone
    sheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => new URL(l.href).pathname).filter((p) => /\/css\/styles\.css$/.test(p)),
  }));
};

// macro → credit (a real touch tap on the tab bar → nav-actions act() → hook).
let s = await tapTab("/credit/");
checkEq(s.path, "/credit/", "tap Credit: URL is /credit/ (client-side)");
checkEq(s.vt, 1, "tap Credit: a view transition ran (same-document)");
checkEq(s.title, "Wire Credit", "tap Credit: title swapped");
checkEq(s.headers, 1, "tap Credit: exactly one header (chrome not duplicated)");
checkEq(s.tabbars, 1, "tap Credit: exactly one tab bar");
checkEq(s.apps, 1, "tap Credit: exactly one #app");
checkEq(JSON.stringify(s.sheets), JSON.stringify(["/credit/css/styles.css"]), "tap Credit: only the Credit stylesheet is loaded");

// Chain the rest + confirm no accumulation.
for (const [nav, path, title] of [["/legal/", "/legal/", "Wire Legal"], ["/menu/", "/menu/", "Wire Menu"], ["/macro/", "/macro/", "Wire Macro"]]) {
  s = await tapTab(nav);
  checkEq(s.path, path, `tap ${nav}: URL`);
  checkEq(s.headers, 1, `tap ${nav}: single header`);
  checkEq(s.tabbars, 1, `tap ${nav}: single tab bar`);
  checkEq(s.apps, 1, `tap ${nav}: single #app`);
}

// Back button (popstate) traverses client-side too.
await pg.goBack(); await pg.waitForTimeout(1400);
checkEq(await pg.evaluate(() => location.pathname), "/menu/", "back button: returns to /menu/");
checkEq(await pg.evaluate(() => document.querySelectorAll("#app").length), 1, "back button: single #app");

checkErrs(errs, "spa navigation chain");
await ctx.close();
await b.close(); srv.close();
finish();
