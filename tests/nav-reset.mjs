// Bottom-nav "reset to first part": tapping a bottom-tab icon returns that section
// to its default sub-state (not the preserved one). E.g. on the Home X wire, tap
// Home → back to the news wire; a non-default Dashboard sub-tab → back to Macro;
// an open profile → back to the Managers list.
import { serve, launchChromium, check, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const ctx = await b.newContext({ viewport: { width: 430, height: 860 }, isMobile: true, hasTouch: true });
const pg = await ctx.newPage();
const vis = (s) => pg.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return false; const r = e.getBoundingClientRect(); return getComputedStyle(e).display !== "none" && r.width > 0 && r.height > 0; }, s);

// --- Home: X wire → tap Home → news wire ------------------------------------
await pg.goto(`${base}/v2/`, { waitUntil: "load" });
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
await pg.click('.g-wiretab[data-wire="x"]');
await pg.waitForTimeout(200);
check(await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="x"]').classList.contains("is-on")) && !(await vis(".g-feed-wrap")),
  "setup: the X wire is active and the news feed hidden");
await pg.click('.mtab[data-key="home"]');
await pg.waitForTimeout(250);
check(await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="news"]').classList.contains("is-on")), "Home tab: resets to the News chip");
check(await vis(".g-feed-wrap"), "Home tab: the news wire is shown again");
check(!(await vis(".g-side-x")), "Home tab: the X wire is hidden");

// --- Dashboard: non-default sub-tab → tap Dashboard → Macro -----------------
await pg.click('.mtab[data-key="dashboard"]');
await pg.waitForSelector(".dsh-railnav .dsh-navchip[data-sub]", { timeout: 8000 });
await pg.evaluate(() => { const c = document.querySelector('.dsh-navchip[data-sub="credit"]') || document.querySelector('.dsh-navchip[data-sub="legal"]'); if (c) c.click(); });
await pg.waitForTimeout(200);
check(await pg.evaluate(() => (document.querySelector(".dsh-3z") || {}).getAttribute && document.querySelector(".dsh-3z").getAttribute("data-pane") !== "macro"), "setup: Dashboard is on a non-default sub-tab");
await pg.click('.mtab[data-key="dashboard"]');
await pg.waitForTimeout(300);
check(await pg.evaluate(() => document.querySelector(".dsh-3z") && document.querySelector(".dsh-3z").getAttribute("data-pane") === "macro"), "Dashboard tab: resets to the Macro sub-tab");

// --- Profiles: open profile → tap Profiles → back to the list ---------------
await pg.goto(`${base}/v2/profiles/#/manager/m8`, { waitUntil: "load" });
await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 8000 });
check(await pg.evaluate(() => !!document.querySelector(".pf-detailing")), "setup: a manager profile is open (detailing)");
await pg.click('.mtab[data-key="profiles"]');
await pg.waitForTimeout(300);
check(await pg.evaluate(() => !document.querySelector(".pf-detailing")), "Profiles tab: closes the open profile (back to the list)");
check(await pg.evaluate(() => { const c = document.querySelector('#pf-chips .tchip[data-p="managers"]'); return !!c && c.classList.contains("is-on"); }), "Profiles tab: resets to the Managers category");

await ctx.close();
await b.close(); srv.close();
finish();
