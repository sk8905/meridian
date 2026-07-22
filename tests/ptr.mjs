// Pull-to-refresh is a shared, cross-page mechanism that kept regressing:
// a page shipped with NO PTR (the /menu/ black-band bug — native rubber-band
// exposed the dark ground), Home drifted onto a stale ptr.js token, and a new
// panel header tore against the frozen stack on a pull (the macro cockpit
// "ghost"). This spec locks the invariants so those can't come back silently:
//   1. EVERY page initialises PTR (it's now one shared init in header.js).
//   2. A top-pull engages and opens its gap in the page's OWN ground (--bg) —
//      never a foreign dark band on a light surface.
//   3. On the macro cockpit a pull freezes only the tab bars, never a panel
//      title (which would ghost against the column header above it).
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const PAGES = ["/", "/macro/", "/credit/", "/legal/", "/menu/"];

// Drive ptr.js's real gesture over CDP touch (Playwright's tap() won't reach the
// swipe code). Pull down past the threshold, read state mid-gesture, then release
// SHORT so the page springs back instead of reloading (which would kill evaluate).
async function pullAndRead(ctx, pg, readFn) {
  const cdp = await ctx.newCDPSession(pg);
  const ev = (type, y) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x: 195, y }] });
  await pg.evaluate(() => window.scrollTo(0, 0));
  await ev("touchStart", 24);
  await ev("touchMove", 44);    // arm (first qualifying downward move)
  await ev("touchMove", 150);   // pull past the threshold
  await pg.waitForTimeout(30);
  const state = await pg.evaluate(readFn);
  await ev("touchMove", 30);    // back under the threshold
  await ev("touchEnd", 0);      // release → springs back, no reload
  await pg.waitForTimeout(60);
  return state;
}

for (const path of PAGES) {
  const { ctx, pg, errs } = await open(b, PHONE, base + path);
  await pg.waitForTimeout(900);
  // 1. Shared init reached this page (the opt-in / token-drift catch).
  check(await pg.evaluate(() => !!document.getElementById("ptr-kf")), `${path}: pull-to-refresh initialised`);
  // 2. A pull engages and the gap matches the page's own ground colour.
  const st = await pullAndRead(ctx, pg, () => {
    const z = document.getElementById("ptr-zone");
    const probe = document.createElement("div");
    probe.style.cssText = "background:var(--bg);position:absolute;left:-9999px;top:0";
    document.body.appendChild(probe);
    const bgVar = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return {
      pulling: document.body.classList.contains("wire-pulling"),
      zoneBg: z && getComputedStyle(z).backgroundColor,
      zoneInline: z && z.style.background,
      bgVar,
      zoneTop: z ? parseFloat(z.style.top || "0") : -1,
    };
  });
  check(st.pulling, `${path}: a top-pull engages PTR (wire-pulling)`);
  checkEq(st.zoneBg, st.bgVar, `${path}: pull gap is the page ground (--bg), not a foreign band`);
  // The gap colour MUST reference the live CSS var, not a value snapshotted at
  // init: on iOS the light --bg often hasn't resolved when this render-blocking
  // module runs, so a snapshot falls back to black and stays black on a light
  // pull. var(--bg) re-resolves at paint, so it always tracks the theme.
  check(/var\(--bg/.test(st.zoneInline || ""), `${path}: gap ground is live var(--bg), not an init-time snapshot`);
  check(st.zoneTop > 0, `${path}: gap opens below the frozen header`);
  checkErrs(errs, `${path} pull`);
  await ctx.close();
}

// The macro cockpit ghost: on the Dashboard sub-tab a pull must freeze only the
// tab bars. A frozen panel title (.ck-h) carries a negative translateY and tears
// against the column header above it — the bug that recurred when the layout
// changed. Assert no .ck-h is counter-translated during a pull.
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/macro/");
  await pg.waitForTimeout(900);
  await pg.evaluate(() => { const d = [...document.querySelectorAll(".tchip")].find((c) => c.textContent.trim() === "Dashboard"); if (d) d.click(); });
  await pg.waitForTimeout(800);
  const frozen = await pullAndRead(ctx, pg, () =>
    [...document.querySelectorAll(".ck-h")].map((h) => h.style.transform).filter((t) => /translateY\(-/.test(t)).length);
  checkEq(frozen, 0, "macro Dashboard: a pull does not freeze panel titles (ghost)");
  checkErrs(errs, "macro Dashboard pull");
  await ctx.close();
}

await b.close(); srv.close();
finish();
