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

checkErrs(errs, "v2 header cluster");
await ctx.close();
await b.close(); srv.close();
finish();
