// Reopen freshness: an iOS home-screen PWA keeps the page in memory, so returning
// to an already-open app does NOT re-import the data modules. The live feed refreshes
// on resume, but the BRIEFING is baked into the /briefings.js ES module at load, so a
// resumed app could show the previous edition. glance.js initBriefFreshness() closes
// that: on foreground AFTER being away a while, it fetches /briefings.js fresh and, if
// the 5×/day refresh has published a newer edition, reloads ONCE to pull it in.
//
// This test drives the exact sequence with a stubbed, swappable /briefings.js (served
// with a JS content-type so the page's own import works), plus a controllable clock +
// visibility so the 2-minute away-gate can be crossed without waiting. Reload is proven
// two ways: the module-sourced briefing text can ONLY change via a reload (a running
// page can't re-import it), and a window sentinel is wiped by a full document reload.
import { serve, launchChromium, PHONE, check, checkErrs, finish } from "./lib.mjs";

const brief = (time) => `export const BRIEFINGS = { tz: "BST", order: ["morning"], slots: {
  morning: { label: "Morning", date: "2026-10-04", time: ${JSON.stringify(time)}, bullets: [
    { html: "<strong>Macro &mdash; a test macro line</strong> for the freshness spec.", src: "https://example.test/macro", srcName: "Test" },
    { html: "<strong>Fixed income &mdash; a test rates line</strong> for the freshness spec.", src: "https://example.test/fi", srcName: "Test" },
    { html: "<strong>Equities &mdash; a test equities line</strong> for the freshness spec.", src: "https://example.test/eq", srcName: "Test" }
  ] }
} };`;

let briefSrc = brief("10:15 BST");        // the edition this page loads with
const srv = await serve({
  "/briefings.js": () => [200, briefSrc, "text/javascript"],
  "/api/hero": () => [200, JSON.stringify({ asOf: "2026-10-04", instruments: [] })],
  "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })],
});

const b = await launchChromium();
const ctx = await b.newContext(PHONE);
// Controllable clock (offset) + visibility so we can cross the 2-min away-gate at once.
await ctx.addInitScript(() => {
  let off = 0, vis = "visible";
  const realNow = Date.now.bind(Date);
  Date.now = () => realNow() + off;
  Object.defineProperty(document, "hidden", { configurable: true, get: () => vis === "hidden" });
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => vis });
  window.__setVis = (v, advanceMs) => { if (advanceMs) off += advanceMs; vis = v; document.dispatchEvent(new Event("visibilitychange")); };
});
const pg = await ctx.newPage();
const errs = [];
pg.on("pageerror", (e) => errs.push(String(e.message).slice(0, 160)));
await pg.goto(`http://localhost:${srv.port}/v2/`, { waitUntil: "load" });
await pg.waitForSelector("#g-hbrief .g-hbrief-head", { state: "attached", timeout: 8000 });

const when = () => pg.evaluate(() => (document.querySelector("#g-hbrief .g-hbrief-when") || {}).textContent || "");
const setSentinel = () => pg.evaluate(() => { window.__sentinel = 1; });
const sentinel = () => pg.evaluate(() => window.__sentinel);
const away = async (ms) => { await pg.evaluate(() => window.__setVis("hidden")); await pg.evaluate((m) => window.__setVis("visible", m), ms); };

// The loaded briefing is the 10:15 edition.
check(/10:15/.test(await when()), `loads the 10:15 edition (${await when()})`);

// --- Case 1: away < 2 min → NO check, NO reload, even though a newer edition exists.
briefSrc = brief("16:15 BST");                 // publish a newer edition on the server
await setSentinel();
await away(60 * 1000);                         // only 1 min away
await pg.waitForTimeout(700);
check((await sentinel()) === 1, "a quick away (<2 min) does not reload (sentinel survives)");
check(/10:15/.test(await when()), "still the 10:15 edition after a quick away");

// --- Case 2: away > 2 min with a newer edition → reload ONCE, pulling the new edition.
await setSentinel();
await away(3 * 60 * 1000);                      // 3 min away
await pg.waitForFunction(() => /16:15/.test((document.querySelector("#g-hbrief .g-hbrief-when") || {}).textContent || ""), null, { timeout: 8000 });
check(/16:15/.test(await when()), `shows the new 16:15 edition after resume (${await when()})`);
check((await sentinel()) === undefined, "a full reload happened (sentinel was wiped)");

// --- Case 3: away > 2 min but NO newer edition → no reload (idempotent, no loop).
await setSentinel();
await away(3 * 60 * 1000);
await pg.waitForTimeout(800);
check((await sentinel()) === 1, "no reload when the edition is unchanged (sentinel survives)");

checkErrs(errs, "home brief freshness");
await ctx.close();
await b.close(); srv.close();
finish();
