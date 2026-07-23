// The Menu view must render as a VISIBLE full-width column — not the .na-panel
// dropdown, which sized it to a hidden corner sliver on phones ("Menu opens
// blank"). Checks both a direct load and a real client-side tab tap.
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

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
    return { hasMenu: true, w: Math.round(r.width), h: Math.round(r.height), display: cs.display, visible: chips.length === 3 && chips.every(Boolean) };
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
  check(s.visible, "direct /v2/menu/: all three chips (Search/Notifications/Display) are visible");
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

await b.close(); srv.close();
finish();
