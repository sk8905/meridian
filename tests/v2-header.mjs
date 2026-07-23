// v2 header action cluster (ported from nav-actions): Markets / Saved /
// Notifications / Search buttons + their panels + the refresh indicator, wired
// into the shell — WITHOUT nav-actions building its own tab bar (the runtime
// owns that). Guards against the "buttons missing / not wired" regression.
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
await pg.waitForTimeout(1800);

const present = await pg.evaluate(() => ({
  cluster: !!document.querySelector("#wire-header .na-actions"),
  mkt: !!document.getElementById("na-mkt"),
  saved: !!document.getElementById("na-saved"),
  notif: !!document.getElementById("na-notif"),
  search: !!document.getElementById("na-search"),
  panels: document.querySelectorAll(".na-panel").length,
  tabbars: document.querySelectorAll(".mobile-tabbar").length,
  refresh: ((document.getElementById("data-status") || {}).textContent || "").trim().length,
}));
check(present.cluster, "header action cluster mounted (.na-actions in the header)");
check(present.mkt, "Markets button present");
check(present.saved, "Saved (bookmarks) button present");
check(present.notif, "Notifications button present");
check(present.search, "Search button present");
check(present.panels >= 3, `Markets/Saved/Notifications panels built (${present.panels})`);
checkEq(present.tabbars, 1, "still exactly one tab bar (nav-actions did NOT add its own)");
check(present.refresh > 0, `refresh indicator populated ("Last refresh…", ${present.refresh} chars)`);

// Bottom meta strip (phone): the signed-in identity + the app-wide last refresh,
// pinned DIRECTLY above the bottom tab bar. header.css hides the header copies on
// phones, so this strip is where a phone surfaces that info.
const strip = await pg.evaluate(() => {
  const s = document.querySelector(".v2-botmeta");
  const t = document.querySelector(".mobile-tabbar");
  if (!s || !t) return { ok: false };
  const sr = s.getBoundingClientRect(), tr = t.getBoundingClientRect();
  return {
    ok: true,
    shown: getComputedStyle(s).display !== "none" && sr.height > 0,
    aboveBar: sr.bottom <= tr.top + 2 && Math.abs(sr.bottom - tr.top) <= 2,
    acct: ((document.getElementById("account-nav-bot") || {}).textContent || "").trim().length,
    stat: ((document.getElementById("data-status-bot") || {}).textContent || "").trim(),
  };
});
check(strip.ok && strip.shown, "bottom meta strip is shown on phone");
check(strip.aboveBar, "meta strip sits directly above the bottom tab bar");
check(strip.acct > 0, "meta strip shows the signed-in identity");
check(/last refresh/i.test(strip.stat), `meta strip shows the app-wide last refresh ("${strip.stat}")`);

// Header must stay ANCHORED to the top through scroll (its sticky container is
// the short #wire-header wrapper, so on phones it's pinned position:fixed). And
// --wire-head-h must be set so each view's sticky sub-nav pins flush under it
// (no content bleeding through the seam).
const anchored = await pg.evaluate(async () => {
  const bar = document.querySelector(".topbar");
  const top0 = Math.round(bar.getBoundingClientRect().top);
  window.scrollTo(0, 600);
  await new Promise((r) => setTimeout(r, 300));
  const top1 = Math.round(bar.getBoundingClientRect().top);
  const fh = document.querySelector(".g-feed-head, .g-feed-chips");
  const headVar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--wire-head-h")) || 0;
  const fhTop = fh ? Math.round(fh.getBoundingClientRect().top) : null;
  window.scrollTo(0, 0);
  return { top0, top1, headVar, fhTop, barH: Math.round(bar.getBoundingClientRect().height) };
});
check(anchored.top0 === 0 && anchored.top1 === 0, `top bar stays anchored at top through scroll (top ${anchored.top0}→${anchored.top1})`);
check(anchored.headVar > 0, `--wire-head-h is set for sub-nav offsets (${anchored.headVar}px)`);
if (anchored.fhTop !== null) check(Math.abs(anchored.fhTop - anchored.headVar) <= 2, `sub-nav pins flush under the header (feed head ${anchored.fhTop} ≈ head ${Math.round(anchored.headVar)})`);

// Each button opens its panel (click → the matching .na-panel becomes visible).
const opens = async (btnId, panelId) => {
  await pg.evaluate((id) => document.getElementById(id)?.click(), btnId);
  await pg.waitForTimeout(450);
  const open = await pg.evaluate((pid) => { const p = document.getElementById(pid); if (!p) return false; const cs = getComputedStyle(p); return !p.hidden && cs.display !== "none" && cs.visibility !== "hidden"; }, panelId);
  await pg.evaluate((id) => document.getElementById(id)?.click(), btnId);   // close
  await pg.waitForTimeout(250);
  return open;
};
check(await opens("na-mkt", "na-mkt-panel"), "Markets button opens the Markets panel");
check(await opens("na-saved", "na-saved-panel"), "Saved button opens the Bookmarks panel");
check(await opens("na-notif", "na-notif-panel"), "Notifications button opens the Notifications panel");

// Search button opens the shared command palette (data-open-search → palette.js).
await pg.evaluate(() => document.getElementById("na-search")?.click());
await pg.waitForTimeout(400);
check(await pg.evaluate(() => !!document.querySelector(".mcmdk.open") || !!document.querySelector(".mcmdk-input")), "Search button opens the command palette");
await pg.keyboard.press("Escape"); await pg.waitForTimeout(250);

const cdp = await ctx.newCDPSession(pg);
const tapKey = async (key) => {
  const box = await pg.evaluate((k) => { const t = document.querySelector(`.mobile-tabbar .mtab[data-key="${k}"]`); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, key);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x, y: box.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await pg.waitForTimeout(900);
};
// Navigation still works with nav-actions loaded.
await tapKey("credit");
checkEq(await pg.evaluate(() => (document.querySelector(".v2-view:not([hidden])") || {}).dataset?.view), "credit", "tab navigation still works with the header cluster loaded");

// A tab tap dismisses an open header panel (no lingering overlay over the new view).
await pg.evaluate(() => document.getElementById("na-mkt")?.click()); await pg.waitForTimeout(400);
check(await pg.evaluate(() => { const p = document.getElementById("na-mkt-panel"); return p && !p.hidden && getComputedStyle(p).display !== "none"; }), "Markets panel is open before the tab tap");
await tapKey("legal");
const closed = await pg.evaluate(() => { const p = document.getElementById("na-mkt-panel"); return !p || p.hidden || getComputedStyle(p).display === "none" || !p.classList.contains("open"); });
check(closed, "tab tap dismisses the open header panel");

// App-wide "Last refresh" + notifications: identical on every desk (not split).
const tabKey2 = async (key) => {
  const box = await pg.evaluate((k) => { const t = document.querySelector(`.mobile-tabbar .mtab[data-key="${k}"]`); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, key);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x, y: box.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await pg.waitForTimeout(950);
};
const readShared = async () => {
  await pg.evaluate(() => document.getElementById("na-notif")?.click());
  await pg.waitForTimeout(450);
  const r = await pg.evaluate(() => ({
    refresh: ((document.getElementById("data-status") || {}).textContent || "").trim(),
    notif: (document.querySelector("#na-notif-panel .na-body") || {}).textContent?.trim().slice(0, 200) || "",
  }));
  await pg.keyboard.press("Escape"); await pg.waitForTimeout(200);
  return r;
};
const seen = [];
for (const k of ["macro", "credit", "legal", "home"]) { await tabKey2(k); seen.push([k, await readShared()]); }
const [, first] = seen[0];
check(first.refresh.length > 0, `refresh populated app-wide ("${first.refresh}")`);
for (const [k, v] of seen) {
  checkEq(v.refresh, first.refresh, `Last refresh is the SAME on ${k} (app-wide, not per-desk)`);
  checkEq(v.notif, first.notif, `notifications are the SAME on ${k} (app-wide, not per-desk)`);
}
checkEq(await pg.evaluate(() => getComputedStyle(document.getElementById("notif")).display), "none", "per-desk #notif bell stays hidden (only the shared app-wide bell shows)");

checkErrs(errs, "v2 header cluster");
await ctx.close();
await b.close(); srv.close();
finish();
