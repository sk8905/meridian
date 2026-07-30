// The dashboard heatmaps are LIVE: /api/worldindices (index closes) and
// /api/govyields (bond yields) overlay their values onto the sourced snapshot.
// Here we stub both endpoints with distinctive values and assert the tiles show
// the LIVE figure, not the seed. (The snapshot-only path is covered separately.)
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const worldindices = { indices: [
  { name: "S&P 500", value: 9999.99, changePct: 5.55, asOf: "2026-07-30" },
] };
const govyields = { yields: [
  { country: "United States", y2: null, y5: null, y10: 9.99, y30: null, asOf: "2026-07-30" },
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

// Fixed Income: the US 10Y tile reflects the LIVE yield (9.99%), not the seed.
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/dashboard/fixed-income/");
  await pg.waitForTimeout(2000);
  const us = await pg.evaluate(() => {
    const r = [...document.querySelectorAll("#dsh-yld tbody tr")].find((x) => /United States/.test((x.querySelector(".dsh-nm") || {}).textContent || ""));
    if (!r) return null;
    const cells = [...r.querySelectorAll("td:not(.dsh-nm)")];   // [2Y, 5Y, 10Y, 30Y]
    return (cells[2] || {}).textContent;                        // the 10Y column
  });
  check(/9\.99%/.test(us || ""), `Govt yields: US 10Y shows the LIVE yield (${us})`);
  checkErrs(errs, "govt yields live overlay");
  await ctx.close();
}

await b.close(); srv.close();
finish();
