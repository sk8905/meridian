// Dark is the ONLY theme (owner 2026-10-16: "eliminate light mode from desktop and
// iPhone — I never use it"). Every load is dark — whatever the OS asks for and whatever
// an old stored preference says — and Menu ▸ Settings has no Theme control.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
for (const [name, dev] of [["iPhone", PHONE], ["desktop", DESKTOP]]) {
  // A light-mode OS and a leftover "light" choice from before the change.
  const { ctx, pg, errs } = await open(b, { ...dev, colorScheme: "light" }, base + "/v2/");
  await pg.evaluate(() => { try { localStorage.setItem("m_theme_pref", "light"); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForTimeout(800);
  checkEq(await pg.evaluate(() => document.documentElement.getAttribute("data-theme")), "dark", `${name}: dark even with a light OS and a stored "light" preference`);
  const bg = await pg.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const lum = (bg.match(/\d+/g) || [255, 255, 255]).slice(0, 3).reduce((a, v) => a + +v, 0) / 3;
  check(lum < 40, `${name}: the page ground is dark (${bg})`);
  await pg.goto(base + "/v2/menu/settings", { waitUntil: "load" });
  await pg.waitForTimeout(900);
  const s = await pg.evaluate(() => ({ seg: !!document.querySelector("#v2-theme-seg, .na-theme-opt"), text: (document.querySelector(".v2-view[data-view='menu']") || document.body).textContent }));
  check(!s.seg && !/\bTheme\b/.test(s.text), `${name}: Menu ▸ Settings has no Theme control`);
  checkEq(await pg.evaluate(() => document.documentElement.getAttribute("data-theme")), "dark", `${name}: still dark after visiting Settings`);
  checkErrs(errs, `dark only (${name})`);
  await ctx.close();
}
await b.close(); srv.close();
finish();
