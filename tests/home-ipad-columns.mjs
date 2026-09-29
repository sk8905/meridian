// Home terminal — narrow-desktop (iPad-landscape) column collapse. The five-column
// terminal squashes the two flexible centre columns to ~220px on a 1200–1500px screen
// (e.g. iPad Pro 12.9" landscape, 1366px). In that band the layout collapses to FOUR
// columns: the Chart/Reading region and the X feed SHARE one column, chosen by a header
// toggle that defaults to Chart/Reading. At ≥1501px all five columns return and the
// toggle disappears.
import { serve, launchChromium, open, WIDE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const HERO = { asOf: "2026-09-18", instruments: ["spx", "ndx"].map((k, i) => ({
  key: k, label: k.toUpperCase(), unit: "", pre: "", dp: 2, fi: false, value: 100 + i,
  history: Array.from({ length: 30 }, (_, j) => [Date.now() - (29 - j) * 864e5, 100 + i + j * 0.1]),
})) };
const IPAD = { viewport: { width: 1366, height: 1024 } };
const srv = await serve({ "/api/hero": () => [200, JSON.stringify(HERO)], "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })] });
const b = await launchChromium();

// --- iPad landscape (1366px): FOUR columns, Chart shown, X behind the toggle --------
{
  const { ctx, pg, errs } = await open(b, IPAD, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector(".tui .g-layout", { timeout: 8000 });
  await pg.waitForTimeout(200);

  const base = await pg.evaluate(() => {
    const g = document.querySelector(".g-layout");
    const disp = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e).display : "missing"; };
    const tog = document.querySelector(".g-focus-tog");
    return {
      colCount: getComputedStyle(g).gridTemplateColumns.split(" ").length,
      focusX: g.classList.contains("focus-x"),
      heroDisp: disp(".g-hero"), xDisp: disp(".g-side-x"),
      readDisp: disp(".g-side3"),
      togVisible: !!tog && getComputedStyle(tog).display !== "none",
      // the flexible centre column is now roughly double the squashed ~220px
      heroW: Math.round((document.querySelector(".g-hero") || { getBoundingClientRect: () => ({ width: 0 }) }).getBoundingClientRect().width),
    };
  });
  checkEq(base.colCount, 4, "iPad: the terminal collapses to four columns (not five)");
  check(!base.focusX, "iPad: Chart/Reading is the default (no focus-x)");
  check(base.heroDisp !== "none" && base.readDisp !== "none", "iPad: the Chart + Reading region is shown by default");
  check(base.xDisp === "none", "iPad: the X feed is hidden by default (behind the toggle)");
  check(base.togVisible, "iPad: the Chart ⇄ X toggle is visible in the shared column header");
  check(base.heroW >= 320, `iPad: the shared column is roomy (~373px, not the squashed ~220px) — got ${base.heroW}px`);

  // Toggle to X: the X feed takes the shared column; Chart + Reading hide.
  await pg.evaluate(() => { const btn = [...document.querySelectorAll(".g-focus-b")].find((x) => x.dataset.focus === "x" && x.offsetParent !== null); btn && btn.click(); });
  await pg.waitForTimeout(150);
  const onX = await pg.evaluate(() => {
    const g = document.querySelector(".g-layout");
    const disp = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e).display : "missing"; };
    const pressed = (f) => { const bs = [...document.querySelectorAll(`.g-focus-b[data-focus="${f}"]`)]; return bs.length > 0 && bs.every((x) => x.getAttribute("aria-pressed") === "true"); };
    return { focusX: g.classList.contains("focus-x"), heroDisp: disp(".g-hero"), xDisp: disp(".g-side-x"), xPressed: pressed("x") };
  });
  check(onX.focusX, "iPad: tapping X swaps the shared column to the X feed");
  check(onX.xDisp !== "none" && onX.heroDisp === "none", "iPad: X is shown and the Chart/Reading region is hidden");
  check(onX.xPressed, "iPad: the X toggle button reflects the pressed state (aria-pressed)");

  // Toggle back to Chart.
  await pg.evaluate(() => { const btn = [...document.querySelectorAll(".g-focus-b")].find((x) => x.dataset.focus === "chart" && x.offsetParent !== null); btn && btn.click(); });
  await pg.waitForTimeout(150);
  const back = await pg.evaluate(() => {
    const g = document.querySelector(".g-layout");
    const disp = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e).display : "missing"; };
    return { focusX: g.classList.contains("focus-x"), heroDisp: disp(".g-hero"), xDisp: disp(".g-side-x") };
  });
  check(!back.focusX && back.heroDisp !== "none" && back.xDisp === "none", "iPad: tapping Chart swaps back to the Chart/Reading region");

  checkErrs(errs, "home iPad columns");
  await ctx.close();
}

// --- Wide desktop (1600px): all FIVE columns, no toggle -----------------------------
{
  const { ctx, pg, errs } = await open(b, WIDE, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector(".tui .g-layout", { timeout: 8000 });
  await pg.waitForTimeout(150);
  const wide = await pg.evaluate(() => {
    const g = document.querySelector(".g-layout");
    const disp = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e).display : "missing"; };
    const tog = document.querySelector(".g-focus-tog");
    return {
      colCount: getComputedStyle(g).gridTemplateColumns.split(" ").length,
      heroDisp: disp(".g-hero"), xDisp: disp(".g-side-x"),
      togVisible: !!tog && getComputedStyle(tog).display !== "none",
    };
  });
  checkEq(wide.colCount, 5, "wide: the full five-column terminal returns");
  check(wide.heroDisp !== "none" && wide.xDisp !== "none", "wide: both the Chart and the X feed are permanent columns");
  check(!wide.togVisible, "wide: the Chart ⇄ X toggle is hidden (no column sharing needed)");
  checkErrs(errs, "home wide columns");
  await ctx.close();
}

await b.close(); srv.close();
finish();
