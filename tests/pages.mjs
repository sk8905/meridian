// Every page × phone/desktop: loads clean (no page/console errors), the shared
// chrome is present, the bell is populated and scoped to CRD/LEX, and the
// Macro dashboard's data widgets (earnings wall, maturity-wall chart) render.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
for (const [name, dev] of [["phone", PHONE], ["desktop", DESKTOP]]) {
  for (const url of ["/", "/macro/", "/credit/", "/legal/", "/menu/"]) {
    const { ctx, pg, errs } = await open(b, dev, `http://localhost:${srv.port}${url}`);
    await pg.waitForTimeout(2200);
    await pg.evaluate(async () => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      // Empty seen-sets → every notification counts as genuinely NEW, so the
      // panel lists the fresh cross-desk items (the bell now shows only what's
      // new; on a caught-up bell it shows a "Recent" context list instead).
      try { localStorage.setItem("meridian.credit.notifSeen", "[]"); localStorage.setItem("meridian.legal.notifSeen", "[]"); } catch { /* */ }
      document.getElementById("na-notif")?.click(); await sleep(700);
    });
    const st = await pg.evaluate(() => ({
      tabbar: !!document.querySelector(".mobile-tabbar"),
      visible: getComputedStyle(document.body).visibility !== "hidden",
      bellRows: document.querySelectorAll("#na-notif-panel .nf-row").length,
      codes: [...new Set([...document.querySelectorAll("#na-notif-panel .nf-code")].map((c) => c.textContent))].sort().join(","),
    }));
    const w = `${name} ${url}`;
    checkErrs(errs, w);
    check(st.tabbar, `tab bar present on ${w}`);
    check(st.visible, `body visible on ${w}`);
    check(st.bellRows > 0, `bell populated on ${w}`);
    checkEq(st.codes, "CRD,LEX", `bell scoped to CRD/LEX on ${w}`);
    await ctx.close();
  }
}

// Macro dashboard widgets (phone).
{
  const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/macro/`);
  await pg.waitForTimeout(1600);
  await pg.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    [...document.querySelectorAll(".tchip")].find((c) => c.textContent.trim() === "Dashboard").click(); await sleep(400);
    [...document.querySelectorAll("#ck-secnav .tchip")].find((c) => c.dataset.sec === "earnings").click(); await sleep(300);
  });
  const ew = await pg.evaluate(() => ({
    rows: document.querySelectorAll(".ew-row").length,
    srcLinks: document.querySelectorAll(".ew-srcs a").length,
    srcCollapsed: !!document.querySelector("details.ew-srcwrap:not([open])"),
    foot: !!document.querySelector(".ew-foot"),
  }));
  check(ew.rows > 5, "earnings wall renders rows");
  check(ew.srcLinks > 10, "earnings sources present in DOM");
  check(ew.srcCollapsed, "earnings sources collapsed by default");
  check(!ew.foot, "no earnings explainer footnote");
  await pg.evaluate(async () => {
    [...document.querySelectorAll("#ck-secnav .tchip")].find((c) => c.dataset.sec === "credit").click();
    await new Promise((r) => setTimeout(r, 300));
  });
  const mw = await pg.evaluate(() => {
    const svg = document.querySelector(".mwc-svg");
    return { svg: !!svg, bars: svg ? svg.querySelectorAll("rect").length : 0, np: svg ? svg.querySelectorAll(".mwc-np").length : 0 };
  });
  check(mw.svg, "maturity-wall chart renders");
  checkEq(mw.bars, 3, "maturity-wall bar count");
  checkEq(mw.np, 3, "maturity-wall n/p placeholders");
  checkErrs(errs, "macro dashboard widgets");
  await ctx.close();
}
await b.close(); srv.close();
finish();
