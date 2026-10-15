// R35f — a working Back after any internal link. Desktop: an arrow at the right end of
// the ticker row, directly under the Menu icon (#nav-back) — dimmed/inert on the entry the app opened on,
// live after any drill-down (a runtime link or a view's own `location.hash =` move),
// and clicking it returns to exactly where you were. iPhone: no button — the iOS
// left-edge swipe is Back (history.back), so the phone header stays clean.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const H13F = { asOf: "2026-06-30", source: "https://www.sec.gov/x", holdings: [] };
const srv = await serve({
  "/api/13f": () => [200, JSON.stringify(H13F)],
  "/api/filings": () => [200, JSON.stringify({ filings: [] })],
  "/api/perf": () => [200, JSON.stringify({ perf: {} })],
});
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const visible = (pg) => pg.evaluate(() => { const el = document.querySelector("#nav-back"); return !!el && getComputedStyle(el).display !== "none" && el.getBoundingClientRect().width > 0; });
const shown = (pg) => pg.evaluate(() => { const el = document.querySelector("#nav-back"); return !!el && document.documentElement.hasAttribute("data-can-back") && getComputedStyle(el).pointerEvents !== "none" && +getComputedStyle(el).opacity === 1; });
const back = async (pg, name) => { if (name === "phone") await pg.goBack(); else await pg.locator("#nav-back").click(); };

// Phone: the header carries no Back button at all.
{
  const { ctx, pg } = await open(b, PHONE, base + "/v2/transactions/");
  await pg.waitForSelector("#tx-body [data-deal]", { timeout: 8000 });
  await pg.evaluate(() => document.querySelector("#tx-body a.tx-mgr").click());
  await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 8000 });
  check(!(await visible(pg)), "phone: no header Back button (the edge-swipe is Back)");
  await ctx.close();
}
// Desktop: the arrow sits on the row below the header, directly under the Menu icon.
{
  const { ctx, pg } = await open(b, DESKTOP, base + "/v2/transactions/");
  await pg.waitForSelector("#tx-body [data-deal]", { timeout: 8000 });
  const pos = await pg.evaluate(() => { const r = document.querySelector("#nav-back").getBoundingClientRect(), m = document.querySelector(".nav-menu-btn").getBoundingClientRect(), t = document.querySelector(".topbar").getBoundingClientRect(); return { cx: Math.round(r.left + r.width / 2), mx: Math.round(m.left + m.width / 2), top: Math.round(r.top), barBottom: Math.round(t.bottom) }; });
  check(await visible(pg) && Math.abs(pos.cx - pos.mx) <= 2 && pos.top >= pos.barBottom, `desktop: Back sits on the row below the header, under the Menu icon (${JSON.stringify(pos)})`);
  await ctx.close();
}

for (const [name, dev] of [["phone", PHONE], ["desktop", DESKTOP]]) {
  const { ctx, pg, errs } = await open(b, dev, base + "/v2/transactions/");
  await pg.waitForSelector("#tx-body [data-deal]", { timeout: 8000 });
  check(!(await shown(pg)), `${name}: Back is inert on the page the app opened on`);
  await pg.evaluate(() => { window.__navMarker = 1; });

  // 1) A runtime link (Transactions → a lender's profile) → Back shows and returns.
  await pg.evaluate(() => document.querySelector("#tx-body a.tx-mgr").click());
  await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 8000 });
  check(await shown(pg), `${name}: Back is live after an internal link`);
  await back(pg, name); await pg.waitForTimeout(500);
  const at = await pg.evaluate(() => ({ path: location.pathname, tab: document.documentElement.dataset.v2tab }));
  check(at.path === "/v2/transactions/" && at.tab === "transactions", `${name}: Back returns to Transactions (${at.path})`);
  check(!(await shown(pg)), `${name}: …and goes inert again at the start`);

  // 2) A view's own hash drill-down (Profiles list → a profile) also counts.
  await pg.evaluate(() => document.querySelector("#tx-body a.tx-mgr").click());
  await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 8000 });
  const h1 = await pg.evaluate(() => location.hash);
  // Drill to a DIFFERENT profile than the one the link opened.
  await pg.evaluate((h) => { location.hash = h === "#/manager/m21" ? "#/manager/m8" : "#/manager/m21"; }, h1); await pg.waitForTimeout(400);
  check(await shown(pg), `${name}: Back is live after a hash drill-down`);
  await back(pg, name); await pg.waitForTimeout(400);
  check(await pg.evaluate(() => location.hash) === h1, `${name}: Back steps one entry, to the previous profile (${h1})`);
  check(await shown(pg), `${name}: …and stays while there is still somewhere to go`);
  await back(pg, name); await pg.waitForTimeout(500);
  check(await pg.evaluate(() => location.pathname) === "/v2/transactions/" && !(await shown(pg)), `${name}: second Back lands on the start page, Back inert`);
  check(await pg.evaluate(() => window.__navMarker === 1), `${name}: no Back reloaded the document`);
  checkErrs(errs, `${name} header back`);
  await ctx.close();
}

await b.close();
srv.close();
finish();
