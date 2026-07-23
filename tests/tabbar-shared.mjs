// Verifies the bottom tab bar renders IDENTICALLY on every page (home + the
// three apps), in both light and dark themes — i.e. it is now one shared
// component (defined once in premium.css), not four per-page copies.
import { serve, launchChromium, open, PHONE, check, checkEq, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const PAGES = ["/", "/macro/", "/credit/", "/legal/"];

// Snapshot the computed styles that define the bar's look + layout.
const snap = (pg) => pg.evaluate(() => {
  const bar = document.querySelector(".mobile-tabbar");
  // Sample an explicitly INACTIVE tab: the first .mtab is active on Home but
  // inactive on the apps, so picking by class (not position) keeps the
  // comparison apples-to-apples across pages.
  const tab = document.querySelector(".mobile-tabbar .mtab:not(.is-active)");
  const active = document.querySelector(".mobile-tabbar .mtab.is-active");
  const g = (el, ...props) => { const c = getComputedStyle(el); const o = {}; for (const p of props) o[p] = c.getPropertyValue(p); return o; };
  const ico = tab?.querySelector(".mtab-ico");
  return {
    bar: bar && g(bar, "display", "position", "left", "right", "bottom", "z-index", "grid-template-columns", "background-color", "border-top-width", "border-top-color", "border-top-left-radius", "box-shadow", "padding-top", "transform"),
    tab: tab && g(tab, "display", "flex-direction", "align-items", "justify-content", "min-height", "border-radius", "font-size", "color", "text-decoration-line"),
    active: active && { color: getComputedStyle(active).color, background: getComputedStyle(active).backgroundColor, lineBg: getComputedStyle(active, "::before").backgroundColor },
    ico: ico && getComputedStyle(ico).display,
  };
});

for (const theme of ["light", "dark"]) {
  const snaps = {};
  for (const path of PAGES) {
    const { ctx, pg } = await open(b, PHONE, base + path);
    await pg.evaluate((t) => { document.documentElement.setAttribute("data-theme", t); localStorage.setItem("m_theme_pref", t); }, theme);
    await pg.waitForTimeout(700);
    check(await pg.evaluate(() => { const b = document.querySelector(".mobile-tabbar"); return !!b && b.getClientRects().length > 0; }), `${theme} ${path}: tab bar visible on phone`);
    snaps[path] = await snap(pg);
    await ctx.close();
  }
  // Every page must match Home byte-for-byte.
  const ref = JSON.stringify(snaps["/"]);
  for (const path of PAGES.slice(1)) {
    checkEq(JSON.stringify(snaps[path]), ref, `${theme}: ${path} tab bar identical to Home`);
  }
  // Spot-check the intended design so a shared-but-wrong bar still fails.
  const s = snaps["/"];
  checkEq(s.bar.display, "grid", `${theme}: bar is a grid`);
  checkEq(s.bar["grid-template-columns"].split(" ").length, 6, `${theme}: six equal columns`);
  checkEq(s.bar["border-top-left-radius"], "0px", `${theme}: flat (no rounded corners)`);
  checkEq(s.bar["box-shadow"], "none", `${theme}: no floating shadow`);
  checkEq(s.ico, "block", `${theme}: icon is block`);
  checkEq(s.active.background, "rgba(0, 0, 0, 0)", `${theme}: active tab has no pill background`);
  // Selected-tab top line: black in light (matches the other light-surface chip
  // markers), orange in dark (reads on the black bar).
  checkEq(s.active.lineBg, theme === "dark" ? "rgb(251, 139, 30)" : "rgb(0, 0, 0)", `${theme}: active tab top line is ${theme === "dark" ? "orange" : "black"}`);
}

await b.close(); srv.close();
finish();
