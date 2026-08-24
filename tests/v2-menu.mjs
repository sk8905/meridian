// The Menu view must render as a VISIBLE full-width column — not the .na-panel
// dropdown, which sized it to a hidden corner sliver on phones ("Menu opens
// blank"). Checks both a direct load and a real client-side tab tap.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

async function menuState(pg) {
  return pg.evaluate(() => {
    const m = document.querySelector('.v2-view[data-view="menu"] .v2-menu');
    if (!m) return { hasMenu: false };
    const r = m.getBoundingClientRect();
    const cs = getComputedStyle(m);
    const chips = [...document.querySelectorAll('.v2-view[data-view="menu"] .na-menu-bar .tchip')]
      .map((c) => { const cr = c.getBoundingClientRect(); return cr.width > 0 && cr.height > 0; });
    return { hasMenu: true, w: Math.round(r.width), h: Math.round(r.height), display: cs.display, visible: chips.length === 4 && chips.every(Boolean) };
  });
}

// 1) Direct load of /v2/menu/.
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/menu/");
  await pg.waitForTimeout(1400);
  const s = await menuState(pg);
  check(s.hasMenu, "direct /v2/menu/: menu container present");
  check(s.w >= 300, `direct /v2/menu/: menu is full-width (${s.w}px), not a dropdown sliver`);
  check(s.h > 80, `direct /v2/menu/: menu has height (${s.h}px)`);
  check(s.visible, "direct /v2/menu/: all four chips (Search/Notifications/Network/Display) are visible");
  checkErrs(errs, "direct menu");
  await ctx.close();
}

// 2) Client-side tab tap (real touch) from Home.
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
  await pg.waitForTimeout(1400);
  const cdp = await ctx.newCDPSession(pg);
  const box = await pg.evaluate(() => { const t = document.querySelector('.mobile-tabbar .mtab[data-key="menu"]'); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x, y: box.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await pg.waitForTimeout(900);
  const s = await menuState(pg);
  check(s.hasMenu && s.visible && s.w >= 300, `tap Menu: renders full-width + visible chips (w=${s.w}, visible=${s.visible})`);
  checkEq(await pg.evaluate(() => (document.querySelector(".v2-view:not([hidden])") || {}).dataset?.view), "menu", "tap Menu: menu is the active view");
  checkErrs(errs, "tap menu");
  await ctx.close();
}

// 3) Desktop: Menu isn't a platform pill, so a top-bar Menu icon must reach it.
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.waitForTimeout(1200);
  const btn = await pg.evaluate(() => {
    const el = document.querySelector("#wire-header .nav-menu-btn");
    if (!el) return { present: false };
    const r = el.getBoundingClientRect();
    return { present: true, visible: r.width > 0 && r.height > 0, key: el.dataset.key };
  });
  check(btn.present && btn.visible, "desktop: Menu icon button is present + visible in the top bar");
  checkEq(btn.key, "menu", "desktop: Menu button routes to the menu tab");
  await pg.evaluate(() => document.querySelector("#wire-header .nav-menu-btn").click());
  await pg.waitForTimeout(700);
  const after = await pg.evaluate(() => ({
    active: (document.querySelector(".v2-view:not([hidden])") || {}).dataset?.view,
    marked: !!document.querySelector("#wire-header .nav-menu-btn.is-active"),
  }));
  checkEq(after.active, "menu", "desktop: clicking the Menu button opens the Menu view");
  check(after.marked, "desktop: Menu button shows the active state on the menu tab");
  checkErrs(errs, "desktop menu button");
  await ctx.close();
}

// 4) Phone: the top-bar Menu icon is hidden (the bottom tab bar owns Menu there).
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
  await pg.waitForTimeout(1000);
  const hidden = await pg.evaluate(() => {
    const el = document.querySelector("#wire-header .nav-menu-btn");
    return !el || getComputedStyle(el).display === "none";
  });
  check(hidden, "phone: top-bar Menu icon is hidden (bottom tab bar carries Menu)");
  checkErrs(errs, "phone menu button hidden");
  await ctx.close();
}

await b.close(); srv.close();
finish();
