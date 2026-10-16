// Dashboard ▸ Credit (owner 2026-10-16, HOUSE_STYLE R44k): no "Sort by" bar on the Stress
// list, no Europe / All-regions toggle on Funds in market or the Credit wire (both list every
// region), and LP commitments shows the latest 10 + "See all N ›" — the sheet holding every
// dated commitment. Desktop and iPhone.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkErrs, finish } from "./lib.mjs";
import { commitments } from "../credit/js/data.js";

const srv = await serve();
const b = await launchChromium();
const dated = (commitments || []).filter((c) => c.date && c.sourceUrl).length;
for (const [name, dev] of [["iPhone", PHONE], ["desktop", DESKTOP]]) {
  const { ctx, pg, errs } = await open(b, dev, `http://localhost:${srv.port}/v2/dashboard/`);
  await pg.waitForSelector("#dsh-lpc .dsh-seeall", { timeout: 15000 });
  const r = await pg.evaluate(() => {
    const vis = (e) => e && e.getBoundingClientRect().height > 0;
    const lp = document.querySelector("#dsh-lpc");
    return { sort: !!document.querySelector(".dsh-stresswrap .dsh-sortbar, .dsh-stresswrap [data-sort]"),
      fim: !!document.querySelector("#dsh-fim [data-fim-scope], #dsh-fim .dsh-sortchip"), strat: !!document.querySelector("#dsh-fim .dsh-fim-strat"),
      cw: !!document.querySelector("#dsh-cw [data-cwscope], #dsh-cw .dsh-sortchip"),
      lpRows: [...lp.querySelectorAll(".dsh-stk-list > li, tbody tr")].filter(vis).length, more: (lp.querySelector(".dsh-seeall") || {}).textContent || "" };
  });
  check(!r.sort, `${name}: the Stress list has no "Sort by" bar`);
  check(!r.fim && r.strat, `${name}: Funds in market has no Europe toggle (the strategy select stays)`);
  check(!r.cw, `${name}: the Credit wire has no Europe toggle`);
  check(r.lpRows === 10 && r.more.includes(`See all ${dated}`), `${name}: LP commitments shows the latest 10 + "See all ${dated}" (${r.lpRows} rows, "${r.more.trim()}")`);
  await pg.evaluate(() => document.querySelector("#dsh-lpc .dsh-seeall").click());
  await pg.waitForSelector(".dsh-sheet", { timeout: 5000 });
  const n = await pg.evaluate(() => [...document.querySelectorAll(".dsh-sheet .dsh-stk-list > li, .dsh-sheet tbody tr")].filter((e) => e.getBoundingClientRect().height > 0).length);
  check(n === dated, `${name}: "See all" opens every dated commitment (${n}/${dated})`);
  checkErrs(errs, `dashboard trim ${name}`); await ctx.close();
}
await b.close(); srv.close();
finish();
