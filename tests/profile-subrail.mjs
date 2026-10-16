// Profile DETAIL sub-section nav. On desktop the manager/hedge-fund detail's
// tabs (News · Vehicles · Investments · Firm facts) render as a SECOND-level left
// rail — nested under the Profiles rail, selected with the ONE marker every tab row
// uses (HOUSE_STYLE R14a: ink, 600, one inset underline — it was blue with a 3px blue
// side-bar until the 2026-10-16 audit) — with the identity header spanning the top and
// the panes filling the rest. On phones the SAME tabs stay a horizontal chip bar. Desktop-only, and
// only in the Profiles surface (#pf-detail).
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const ONE_UL = /^rgb\([^)]*\) 0px -2px 0px 0px inset$/;   // R14a: one inset underline layer

async function openManager(vp) {
  const { ctx, pg, errs } = await open(b, vp, base + "/v2/");
  await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
  await pg.waitForFunction(() => [...document.querySelectorAll(".v2-view")].some((v) => v.offsetParent !== null && v.textContent.trim().length > 20), null, { timeout: 15000 });
  await pg.evaluate(() => { history.pushState({ v2: true }, "", "/v2/profiles/"); dispatchEvent(new PopStateEvent("popstate")); });
  await pg.waitForFunction(() => !!document.querySelector("#pf-chips .tchip"), null, { timeout: 15000 });
  await pg.evaluate(() => { location.hash = "#/manager/m8"; });
  await pg.waitForFunction(() => !!document.querySelector("#pf-detail .tdet-tabbed > .twire-head .tchip.is-on"), null, { timeout: 15000 });
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
      onWeight: onCS ? onCS.fontWeight : null,
      onShadow: onCS ? onCS.boxShadow : null,
      offWeight: [...new Set([...document.querySelectorAll("#pf-detail .tdet-tabbed > .twire-head .tchip:not(.is-on)")].map((c) => getComputedStyle(c).fontWeight))].join(","),
    };
  });
  check(r.grid === "grid", `desktop: detail section is a grid (${r.grid})`);
  check(r.dir === "column", `desktop: sub-tabs stack vertically as a rail (${r.dir})`);
  check(r.leftOfPanes === true, "desktop: the rail sits to the LEFT of the panes");
  check(r.onWeight === "600" && r.offWeight === "400", `desktop: active sub-tab 600, the others 400 (${r.onWeight} / ${r.offWeight})`);
  check(ONE_UL.test(r.onShadow || ""), `desktop: active sub-tab carries the one inset underline, no side-bar (${r.onShadow})`);
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
