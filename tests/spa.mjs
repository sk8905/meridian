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
// Count how often a (same-document) view transition actually runs, AND record
// how much content #app holds the instant the transition's DOM update completes.
// The "after" snapshot is captured then; if #app is still empty (destination not
// yet rendered) the crossfade animates old→blank body ground — the white flash
// on a light theme. renderInto() renders the destination inside the update
// callback, so this length must be substantial.
await pg.evaluate(() => {
  window.__vt = 0; window.__appLenAtSwap = -1;
  const o = document.startViewTransition.bind(document);
  document.startViewTransition = (cb) => {
    window.__vt++;
    const t = o(cb);
    t.updateCallbackDone.then(() => { const a = document.getElementById("app"); window.__appLenAtSwap = a ? a.textContent.trim().length : -1; }).catch(() => {});
    return t;
  };
});

check(await pg.evaluate(() => typeof window.__spaNavigate === "function"), "spa hook installed via shared header");
// Home / off-scope must NOT be claimed (returns false → caller does a real load).
check(await pg.evaluate(() => window.__spaNavigate("/") === false), "Home falls back to a normal navigation");

const cdp = await ctx.newCDPSession(pg);
const reqs = [];
pg.on("request", (r) => reqs.push(r.url()));
const isCreditHtml = (u) => /\/credit\/(\?|$)/.test(u);
const tapTab = async (nav) => {
  const box = await pg.evaluate((n) => { const t = document.querySelector(`.mobile-tabbar .mtab[data-nav="${n}"]`); if (!t) return null; const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, nav);
  if (!box) throw new Error("no tab " + nav);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x, y: box.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await pg.waitForTimeout(1500);
  return pg.evaluate(() => ({
    path: location.pathname,
    vt: window.__vt,
    appLenAtSwap: window.__appLenAtSwap,
    title: document.title,
    headers: document.querySelectorAll("#wire-header .topbar").length,
    tabbars: document.querySelectorAll(".mobile-tabbar").length,
    apps: document.querySelectorAll("#app").length,
    // page-specific stylesheet: the destination's css/styles.css present, others' gone
    sheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => new URL(l.href).pathname).filter((p) => /\/css\/styles\.css$/.test(p)),
  }));
};

// macro → credit, done as a SPLIT touch so we can assert the pointerdown
// PREFETCH: the touchStart warms the destination (HTML + its nonce'd app.js)
// during finger-contact, and the release then renders from cache — the fix for
// the tab-change lag. navigation must NOT re-fetch the HTML it already prefetched.
const cbox = await pg.evaluate(() => { const t = document.querySelector('.mobile-tabbar .mtab[data-nav="/credit/"]'); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
reqs.length = 0;
await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: cbox.x, y: cbox.y }] });
await pg.waitForTimeout(500);                    // let the prefetch fetches fire
const preHtml = reqs.filter(isCreditHtml).length;
const preApp = reqs.filter((u) => /\/credit\/js\/app\.js.*_spa=/.test(u)).length;
check(preHtml >= 1, "pointerdown prefetches the destination HTML (before release)");
check(preApp >= 1, "pointerdown warms the destination app.js at its nonce'd URL");
await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });   // release → navigate
await pg.waitForTimeout(1500);
check(reqs.filter(isCreditHtml).length === preHtml, "navigation reuses the prefetched HTML (no second round-trip)");
let s = await pg.evaluate(() => ({
  path: location.pathname, vt: window.__vt, appLenAtSwap: window.__appLenAtSwap, title: document.title,
  headers: document.querySelectorAll("#wire-header .topbar").length,
  tabbars: document.querySelectorAll(".mobile-tabbar").length,
  apps: document.querySelectorAll("#app").length,
  sheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => new URL(l.href).pathname).filter((p) => /\/css\/styles\.css$/.test(p)),
}));
checkEq(s.path, "/credit/", "tap Credit: URL is /credit/ (client-side)");
checkEq(s.vt, 1, "tap Credit: a view transition ran (same-document)");
check(s.appLenAtSwap > 500, `tap Credit: #app is rendered before the transition ends (no blank-flash), len=${s.appLenAtSwap}`);
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
