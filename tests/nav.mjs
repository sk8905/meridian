// Bottom tab bar: cross-page navigation works (including with a panel open),
// and tapping the ACTIVE tab dismisses any open overlay (nav panels, search
// palette) instead of being a silent no-op.
import { serve, launchChromium, open, touches, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const tabXY = (pg, label) => pg.evaluate((lb) => {
  const t = [...document.querySelectorAll(".mobile-tabbar .mtab")].find((x) => x.textContent.trim().toLowerCase().includes(lb));
  if (!t) return null; const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
}, label);

// Cross-page: Home → Macro → Credit chains via confirmed taps.
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/");
  const t = await touches(ctx, pg);
  await pg.waitForTimeout(1800);
  for (const [label, want] of [["macro", "/macro/"], ["credit", "/credit/"], ["home", "/"]]) {
    const xy = await tabXY(pg, label);
    await t.tap(xy.x, xy.y);
    await pg.waitForTimeout(1400);
    checkEq(new URL(pg.url()).pathname, want, `tab → ${label}`);
  }
  checkErrs(errs, "tab navigation");
  await ctx.close();
}
// Panel open + cross-page tap still navigates.
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/credit/");
  const t = await touches(ctx, pg);
  await pg.waitForTimeout(1500);
  await pg.evaluate(() => document.getElementById("na-notif")?.click());
  await pg.waitForTimeout(600);
  const xy = await tabXY(pg, "home");
  await t.tap(xy.x, xy.y);
  await pg.waitForTimeout(1400);
  checkEq(new URL(pg.url()).pathname, "/", "bell open on credit, tap Home → navigates");
  checkErrs(errs, "cross-page with panel open");
  await ctx.close();
}
// Active-tab tap closes the bell (and its scrim) and the search palette.
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/");
  const t = await touches(ctx, pg);
  await pg.waitForTimeout(1800);
  await pg.evaluate(() => document.getElementById("na-notif")?.click());
  await pg.waitForTimeout(600);
  let xy = await tabXY(pg, "home");
  await t.tap(xy.x, xy.y);
  await pg.waitForTimeout(500);
  const st = await pg.evaluate(() => ({
    panelOpen: !document.getElementById("na-notif-panel").hidden,
    scrim: !!document.querySelector(".na-scrim:not([hidden])"),
  }));
  check(!st.panelOpen && !st.scrim, "active-tab tap closes the bell + scrim");
  checkEq(new URL(pg.url()).pathname, "/", "still on Home after dismissal");
  checkErrs(errs, "active-tab dismissal");
  await ctx.close();
}
// Search palette dismissal — on Macro (Home has no [data-open-search] button).
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/macro/");
  const t = await touches(ctx, pg);
  await pg.waitForTimeout(1500);
  await pg.evaluate(() => { document.querySelector("[data-open-search]")?.click(); });
  await pg.waitForTimeout(400);
  check(await pg.evaluate(() => !!document.querySelector(".mcmdk.open")), "search palette opens");
  const xy = await tabXY(pg, "macro");
  await t.tap(xy.x, xy.y);
  await pg.waitForTimeout(400);
  check(await pg.evaluate(() => !document.querySelector(".mcmdk.open")), "active-tab tap closes the palette");
  checkErrs(errs, "palette dismissal");
  await ctx.close();
}
await b.close(); srv.close();
finish();
