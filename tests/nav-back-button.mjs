// R35f — there is always a visible, working Back button after an internal link. The
// iPhone home-screen app has no browser Back, so the header carries one (#nav-back):
// hidden on the entry the app opened on, shown after any drill-down (a runtime link or
// a view's own `location.hash =` move), and tapping it returns to exactly where you were.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const H13F = { asOf: "2026-06-30", source: "https://www.sec.gov/x", holdings: [] };
const srv = await serve({
  "/api/13f": () => [200, JSON.stringify(H13F)],
  "/api/filings": () => [200, JSON.stringify({ filings: [] })],
  "/api/perf": () => [200, JSON.stringify({ perf: {} })],
});
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const shown = (pg) => pg.evaluate(() => { const el = document.querySelector("#nav-back"); return !!el && getComputedStyle(el).display !== "none" && el.getBoundingClientRect().width > 0; });

for (const [name, dev] of [["phone", PHONE], ["desktop", DESKTOP]]) {
  const { ctx, pg, errs } = await open(b, dev, base + "/v2/transactions/");
  await pg.waitForSelector("#tx-body [data-deal]", { timeout: 8000 });
  check(!(await shown(pg)), `${name}: no Back button on the page the app opened on`);
  await pg.evaluate(() => { window.__navMarker = 1; });

  // 1) A runtime link (Transactions → a lender's profile) → Back shows and returns.
  await pg.evaluate(() => document.querySelector("#tx-body a.tx-mgr").click());
  await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 8000 });
  check(await shown(pg), `${name}: Back shows after an internal link`);
  await pg.locator("#nav-back").click(); await pg.waitForTimeout(500);
  const at = await pg.evaluate(() => ({ path: location.pathname, tab: document.documentElement.dataset.v2tab }));
  check(at.path === "/v2/transactions/" && at.tab === "transactions", `${name}: Back returns to Transactions (${at.path})`);
  check(!(await shown(pg)), `${name}: …and hides again at the start`);

  // 2) A view's own hash drill-down (Profiles list → a profile) also counts.
  await pg.evaluate(() => document.querySelector("#tx-body a.tx-mgr").click());
  await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 8000 });
  const h1 = await pg.evaluate(() => location.hash);
  await pg.evaluate(() => { location.hash = "#/manager/m21"; }); await pg.waitForTimeout(400);
  check(await shown(pg), `${name}: Back shows after a hash drill-down`);
  await pg.locator("#nav-back").click(); await pg.waitForTimeout(400);
  check(await pg.evaluate(() => location.hash) === h1, `${name}: Back steps one entry, to the previous profile (${h1})`);
  check(await shown(pg), `${name}: …and stays while there is still somewhere to go`);
  await pg.locator("#nav-back").click(); await pg.waitForTimeout(500);
  check(await pg.evaluate(() => location.pathname) === "/v2/transactions/" && !(await shown(pg)), `${name}: second Back lands on the start page, button hidden`);
  check(await pg.evaluate(() => window.__navMarker === 1), `${name}: no Back reloaded the document`);
  checkErrs(errs, `${name} header back`);
  await ctx.close();
}

await b.close();
srv.close();
finish();
