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
    const box = document.querySelector("#dsh-wi-box");
    const cols = [...box.querySelectorAll("thead th.dsh-r")].map((t) => t.textContent.trim());
    const rows = [...box.querySelectorAll("tbody tr")];
    return {
      cols,
      rows: rows.length,
      bands: box.querySelectorAll(".dsh-wkrow").length,          // old labelled region band (should be gone)
      breaks: box.querySelectorAll(".dsh-secbreak").length,      // thin region separators (5 regions → 4)
      sourced: rows.length > 0 && rows.every((r) => { const a = r.querySelector(".dsh-nm a"); return a && /^https?:/.test(a.getAttribute("href") || ""); }),
      levels: rows.filter((r) => { const c = r.querySelector(".dsh-nm .dsh-fl-t"); return c && c.textContent.trim(); }).length,
      hasSP: rows.some((r) => /S&P 500/.test((r.querySelector(".dsh-nm") || {}).textContent || "")),
    };
  });
  checkEq(wi.cols.join(","), "1W,1M,3M,6M,1Y", "World indices: same 1W/1M/3M/6M/1Y windows as the ETF-flows heatmap");
  check(wi.rows >= 15, `World indices: rows render (${wi.rows})`);
  checkEq(wi.bands, 0, "World indices: no labelled region band (replaced by thin rules)");
  checkEq(wi.breaks, 4, "World indices: five jurisdictions separated by thin grey rules");
  check(wi.sourced, "World indices: every row links its source");
  check(wi.levels >= 15, `World indices: rows show the index level (points) in the label (${wi.levels})`);
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
    const cols = [...box.querySelectorAll("thead th.dsh-r")].map((t) => t.textContent.trim());
    const rows = [...box.querySelectorAll("tbody tr")];
    const cells = [...box.querySelectorAll("tbody td.dsh-fl")];
    return {
      cols, rows: rows.length,
      bands: box.querySelectorAll(".dsh-wkrow").length,
      breaks: box.querySelectorAll(".dsh-secbreak").length,
      sourced: rows.length > 0 && rows.every((r) => { const a = r.querySelector(".dsh-nm a"); return a && /^https?:/.test(a.getAttribute("href") || ""); }),
      pctFmt: cells.length > 0 && /%$/.test(cells[0].textContent || ""),
    };
  });
  checkEq(gy.cols.join(","), "2Y,5Y,10Y,30Y", "Govt yields: 2Y/5Y/10Y/30Y tenor columns present");
  checkEq(gy.bands, 0, "Govt yields: no labelled region band (replaced by thin rules)");
  checkEq(gy.breaks, 4, "Govt yields: five jurisdictions separated by thin grey rules");
  check(gy.rows >= 10, `Govt yields: economy rows render (${gy.rows})`);
  check(gy.sourced, "Govt yields: every row links its source");
  check(gy.pctFmt, "Govt yields: yield cells show a % value");

  // "Why it moved" box mirrors the Equities Key-moments card, each note sourced.
  const km = await pg.evaluate(() => {
    const card = [...document.querySelectorAll('.v2-view[data-view="dashboard"] .dsh-card')].find((c) => /why it moved/i.test(c.textContent));
    if (!card) return null;
    const rows = [...card.querySelectorAll(".dsh-km")];
    return { rows: rows.length, sourced: rows.length > 0 && rows.every((r) => r.querySelector('.dsh-src[href^="http"]')) };
  });
  check(km && km.rows > 0, `Fixed Income: "why it moved" box renders (${km && km.rows})`);
  check(km && km.sourced, "Fixed Income: every why-it-moved note links its source");
  checkErrs(errs, "govt yields heatmap");
  await ctx.close();
}

await b.close(); srv.close();
finish();
