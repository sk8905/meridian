// Dashboard heatmaps: (1) Equities ▸ World indices — local index points grouped
// by jurisdiction (US · South America · UK · Europe · APAC), heat-shaded by the
// latest session move, each tile sourced. (2) Fixed Income ▸ Government bond
// yields — a heatmap of one tenor with a 2Y/5Y/10Y/30Y toggle that re-renders.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// ---- Equities: world-indices heatmap ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/dashboard/equities/");
  await pg.waitForTimeout(1600);
  const wi = await pg.evaluate(() => {
    const regions = [...document.querySelectorAll(".dsh-wi .dsh-wi-grp .dsh-wi-h")].map((h) => h.textContent.trim());
    const tiles = [...document.querySelectorAll(".dsh-wi .dsh-wi-t")];
    return {
      regions,
      tiles: tiles.length,
      sourced: tiles.length > 0 && tiles.every((t) => t.tagName === "A" && /^https?:/.test(t.getAttribute("href") || "")),
      levels: tiles.filter((t) => (t.querySelector(".dsh-wi-lv") || {}).textContent && (t.querySelector(".dsh-wi-lv")).textContent !== "—").length,
      hasSP: tiles.some((t) => /S&P 500/.test((t.querySelector(".dsh-wi-nm") || {}).textContent || "")),
    };
  });
  check(wi.tiles >= 15, `World indices: tiles render (${wi.tiles})`);
  check(["US", "South America", "UK", "Europe", "APAC"].every((r) => wi.regions.includes(r)), `World indices: all five jurisdictions present (${wi.regions.join(", ")})`);
  check(wi.sourced, "World indices: every tile links its source");
  check(wi.levels >= 15, `World indices: tiles show index points (${wi.levels})`);
  check(wi.hasSP, "World indices: includes the S&P 500");
  checkErrs(errs, "world indices heatmap");
  await ctx.close();
}

// ---- Fixed Income: government-yield heatmap + tenor toggle ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/dashboard/fixed-income/");
  await pg.waitForTimeout(1600);
  const gy = await pg.evaluate(() => {
    const box = document.querySelector("#dsh-yld");
    const tenors = [...box.querySelectorAll(".dsh-yld-tgl")].map((t) => t.textContent.trim());
    const active0 = (box.querySelector(".dsh-yld-tgl.is-on") || {}).textContent;
    const regions = [...box.querySelectorAll(".dsh-wi-grp .dsh-wi-h")].map((h) => h.textContent.trim());
    const tiles0 = [...box.querySelectorAll(".dsh-wi-t")];
    const firstVal = (tiles0[0] && tiles0[0].querySelector(".dsh-wi-lv") || {}).textContent;
    return {
      tenors, active0, regions, tiles: tiles0.length,
      sourced: tiles0.length > 0 && tiles0.every((t) => t.tagName === "A"),
      pctFmt: /%$/.test(firstVal || ""),
    };
  });
  checkEq(gy.tenors.join(","), "2Y,5Y,10Y,30Y", "Govt yields: 2Y/5Y/10Y/30Y tenor toggle present");
  checkEq(gy.active0, "10Y", "Govt yields: defaults to the 10Y tenor");
  check(["US", "South America", "UK", "Europe", "APAC"].every((r) => gy.regions.includes(r)), `Govt yields: all five jurisdictions present (${gy.regions.join(", ")})`);
  check(gy.tiles >= 10, `Govt yields: economy tiles render (${gy.tiles})`);
  check(gy.sourced, "Govt yields: every tile links its source");
  check(gy.pctFmt, "Govt yields: tiles show a yield in %");

  // Toggle to 2Y → the active tenor changes and the heatmap re-renders.
  const after = await pg.evaluate(() => {
    const box = document.querySelector("#dsh-yld");
    const b2 = [...box.querySelectorAll(".dsh-yld-tgl")].find((t) => t.textContent.trim() === "2Y");
    b2.click();
    const box2 = document.querySelector("#dsh-yld");
    return { active: (box2.querySelector(".dsh-yld-tgl.is-on") || {}).textContent, tiles: box2.querySelectorAll(".dsh-wi-t").length };
  });
  checkEq(after.active, "2Y", "Govt yields: toggling to 2Y switches the active tenor");
  check(after.tiles >= 10, `Govt yields: heatmap re-renders on toggle (${after.tiles})`);
  checkErrs(errs, "govt yields heatmap");
  await ctx.close();
}

await b.close(); srv.close();
finish();
