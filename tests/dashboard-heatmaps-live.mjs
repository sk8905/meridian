// The dashboard heatmaps are LIVE: /api/worldindices (index closes) and
// /api/govyields (bond yields) overlay their values onto the sourced snapshot.
// Here we stub both endpoints with distinctive values and assert the tiles show
// the LIVE figure, not the seed. (The snapshot-only path is covered separately.)
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const worldindices = { indices: [
  { name: "S&P 500", value: 9999.99, changePct: 5.55, asOf: "2026-07-30" },
] };
// New shape: per-tenor { v: current level, w1..y1: change in bp }.
const govyields = { yields: [
  { country: "United States", y10: { v: 4.65, w1: 5, m1: 12, m3: -8, m6: 20, y1: 40 } },
] };

const srv = await serve({
  "/api/worldindices": () => [200, JSON.stringify(worldindices)],
  "/api/govyields": () => [200, JSON.stringify(govyields)],
});
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// Equities: the S&P 500 tile reflects the LIVE level (9,999.99), not the seed.
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/dashboard/equities/");
  await pg.waitForTimeout(2000);
  const sp = await pg.evaluate(() => {
    const r = [...document.querySelectorAll("#dsh-wi-box tbody tr")].find((x) => /S&P 500/.test((x.querySelector(".dsh-nm") || {}).textContent || ""));
    return r ? { lv: (r.querySelector(".dsh-nm .dsh-fl-t") || {}).textContent } : null;
  });
  check(sp && /9,?999\.99/.test(sp.lv), `World indices: S&P 500 shows the LIVE level in the label (${sp && sp.lv})`);
  checkErrs(errs, "world indices live overlay");
  await ctx.close();
}

// Fixed Income (default tenor 10Y): the US row shows the LIVE current 10Y yield in
// the label (4.65%) and the LIVE 1M change (+12 bp) in the 1M column.
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/dashboard/fixed-income/");
  await pg.waitForTimeout(2000);
  const us = await pg.evaluate(() => {
    const r = [...document.querySelectorAll("#dsh-yld tbody tr")].find((x) => /United States/.test((x.querySelector(".dsh-nm") || {}).textContent || ""));
    if (!r) return null;
    const cells = [...r.querySelectorAll("td.dsh-fl, td.dsh-fl-na")];   // [1W, 1M, 3M, 6M, 1Y]
    return { lv: (r.querySelector(".dsh-nm .dsh-fl-t") || {}).textContent, m1: (cells[1] || {}).textContent };
  });
  check(us && /4\.65%/.test(us.lv || ""), `Govt yields: US label shows the LIVE current 10Y yield (${us && us.lv})`);
  check(us && /\+12/.test(us.m1 || ""), `Govt yields: US 1M column shows the LIVE +12bp change (${us && us.m1})`);
  checkErrs(errs, "govt yields live overlay");
  await ctx.close();
}

await b.close(); srv.close();
finish();
