// Profile DETAIL sub-section nav. On desktop the manager/hedge-fund detail's
// tabs (News · Vehicles · Investments · Business) render as a SECOND-level left
// rail — nested under the Profiles rail, tinted blue (--wb-txt) to read as
// sub-sections — with the identity header spanning the top and the panes filling
// the rest. On phones the SAME tabs stay a horizontal chip bar. Desktop-only, and
// only in the Profiles surface (#pf-detail).
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const BLUE = /rgb\(74, 163, 240\)|rgb\(31, 111, 208\)/;   // --wb-txt dark / light

async function openManager(vp) {
  const { ctx, pg, errs } = await open(b, vp, base + "/v2/");
  await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
  await pg.waitForTimeout(1000);
  await pg.evaluate(() => { history.pushState({ v2: true }, "", "/v2/profiles/"); dispatchEvent(new PopStateEvent("popstate")); });
  await pg.waitForTimeout(700);
  await pg.evaluate(() => { location.hash = "#/manager/m8"; });
  await pg.waitForTimeout(900);
  return { ctx, pg, errs };
}

// ---- Desktop: vertical blue sub-rail --------------------------------------
{
  const DESK = { width: 1280, height: 900, isMobile: false, hasTouch: false, deviceScaleFactor: 1 };
  const { ctx, pg, errs } = await openManager(DESK);
  const r = await pg.evaluate(() => {
    const sec = document.querySelector("#pf-detail .tdet-tabbed");
    const chips = document.querySelector("#pf-detail .tdet-tabbed > .twire-head .tchips");
    const on = document.querySelector("#pf-detail .tdet-tabbed > .twire-head .tchip.is-on");
    const rail = document.querySelector("#pf-detail .tdet-tabbed > .twire-head");
    const panes = document.querySelector("#pf-detail .tdet-tabbed > .tpanes");
    const onCS = on ? getComputedStyle(on) : null;
    const rr = rail && rail.getBoundingClientRect(), pr = panes && panes.getBoundingClientRect();
    return {
      grid: sec ? getComputedStyle(sec).display : null,
      dir: chips ? getComputedStyle(chips).flexDirection : null,
      leftOfPanes: rr && pr ? rr.right <= pr.left + 2 : null,
      onColor: onCS ? onCS.color : null,
      onShadow: onCS ? onCS.boxShadow : null,
    };
  });
  check(r.grid === "grid", `desktop: detail section is a grid (${r.grid})`);
  check(r.dir === "column", `desktop: sub-tabs stack vertically as a rail (${r.dir})`);
  check(r.leftOfPanes === true, "desktop: the rail sits to the LEFT of the panes");
  check(BLUE.test(r.onColor || ""), `desktop: active sub-tab text is blue, not orange (${r.onColor})`);
  check(BLUE.test(r.onShadow || ""), `desktop: active sub-tab carries a blue left bar (${r.onShadow})`);
  checkErrs(errs, "desktop sub-rail");
  await ctx.close();
}

// ---- Phone: horizontal chip bar (unchanged) -------------------------------
{
  const { ctx, pg, errs } = await openManager(PHONE);
  const r = await pg.evaluate(() => {
    const sec = document.querySelector("#pf-detail .tdet-tabbed");
    const chips = document.querySelector("#pf-detail .tdet-tabbed > .twire-head .tchips");
    return { grid: sec ? getComputedStyle(sec).display : null, dir: chips ? getComputedStyle(chips).flexDirection : null };
  });
  check(r.grid !== "grid", `phone: detail section is NOT a grid rail (${r.grid})`);
  check(r.dir === "row", `phone: sub-tabs stay a horizontal chip bar (${r.dir})`);
  checkErrs(errs, "phone chip bar");
  await ctx.close();
}

await b.close(); srv.close();
finish();
