// Profile detail scroll: at small-desktop / tablet widths (761–900px) the fixed
// shell (body/.v2-app overflow:hidden) is in force, so a long profile — e.g. a
// manager's Investments list — must scroll INSIDE #pf-panes and reach its bottom.
// Regression: the ≤900 "page scrolls" rule left #pf-panes overflow:visible in this
// band, so nothing scrolled and the tail rows were unreachable.
import { serve, launchChromium, check, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

for (const w of [780, 860, 900, 1280]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 720 } });
  const pg = await ctx.newPage();
  await pg.goto(`${base}/v2/profiles/#/manager/m8`, { waitUntil: "load" });
  await pg.waitForSelector("#pf-detail .tdet-id h1", { timeout: 8000 });
  await pg.evaluate(() => { const t = document.querySelector('#mgr-tabs .tchip[data-p="investments"]'); if (t) t.click(); });
  await pg.waitForTimeout(400);
  // The Profiles view is the desktop scroller (one container, like the Dashboard).
  const over = await pg.evaluate(() => { const p = document.querySelector('.v2-view[data-view="profiles"]'); return p.scrollHeight - p.clientHeight; });
  check(over > 40, `${w}px: the manager's Investments overflow the view (${over}px to scroll)`);
  // A real wheel over the content must move the scroller (not clip with nowhere to go).
  await pg.mouse.move(w / 2, 400);
  await pg.mouse.wheel(0, 4000);
  await pg.waitForTimeout(300);
  const moved = await pg.evaluate(() => document.querySelector('.v2-view[data-view="profiles"]').scrollTop);
  check(moved > 40, `${w}px: scrolling reaches the bottom rows (view scrolled to ${moved})`);
  // Both nav rails stay pinned (on-screen near the top) while the content scrolls
  // under them — they must NOT scroll off to a negative offset.
  const pinned = await pg.evaluate(() => {
    const side = document.querySelector('#pf-list > .tdash-grid > .tcol-c > .twire-head');
    const tabs = document.querySelector('#pf-detail .tdet-tabbed > .twire-head');
    return { sideTop: side ? side.getBoundingClientRect().top : -999, tabsTop: tabs ? tabs.getBoundingClientRect().top : -999 };
  });
  check(pinned.sideTop >= 0 && pinned.sideTop <= 220 && pinned.tabsTop >= 0 && pinned.tabsTop <= 220,
    `${w}px: the sidebar + section tabs stay pinned on scroll (side ${Math.round(pinned.sideTop)}, tabs ${Math.round(pinned.tabsTop)})`);
  await ctx.close();
}

// ≤760: the whole PAGE scrolls (the panes flow) — the other working model.
{
  const ctx = await b.newContext({ viewport: { width: 480, height: 720 }, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  await pg.goto(`${base}/v2/profiles/#/manager/m8`, { waitUntil: "load" });
  await pg.waitForSelector("#pf-detail .tdet-id h1", { timeout: 8000 });
  await pg.evaluate(() => { const t = document.querySelector('#mgr-tabs .tchip[data-p="investments"]'); if (t) t.click(); });
  await pg.waitForTimeout(400);
  await pg.mouse.move(240, 400);
  await pg.mouse.wheel(0, 4000);
  await pg.waitForTimeout(300);
  const winY = await pg.evaluate(() => window.scrollY);
  check(winY > 40, `phone: the page itself scrolls the long profile (scrollY ${winY})`);
  await ctx.close();
}

await b.close(); srv.close();
finish();
