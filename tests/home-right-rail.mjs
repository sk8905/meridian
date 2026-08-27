// Home right rail: Economic indicators moved to the Macro dashboard; Yield curve
// sits directly beneath Policy rate; the freed space holds "This week's earnings"
// (date · pre/post-market · forecast → outcome). Prediction markets stays last.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-earn .g-earn-row", { timeout: 8000 });
await pg.waitForTimeout(400);

const r = await pg.evaluate(() => {
  const headers = [...document.querySelectorAll(".g-side2 .tui-ph span:first-child")].map((s) => s.textContent.trim());
  const rows = [...document.querySelectorAll("#g-earn .g-earn-row")];
  const first = rows[0];
  return {
    headers,
    indicatorsGone: !document.getElementById("g-indicators"),
    earnRows: rows.length,
    firstHasDate: !!(first && first.querySelector(".g-earn-date")),
    firstHasTkr: !!(first && first.querySelector(".g-earn-tkr")),
    firstHasWhen: !!(first && first.querySelector(".g-earn-when")),
    anyEst: document.querySelectorAll("#g-earn .g-earn-l:not(.g-earn-act)").length,
    anyAct: document.querySelectorAll("#g-earn .g-earn-act").length,
    anyPx: document.querySelectorAll("#g-earn .g-earn-px").length,
  };
});

checkEq(r.headers.join(" | "), "Policy rate | Yield curve | This week's earnings | Prediction markets", "right rail order: Policy rate → Yield curve → earnings → Prediction markets");
check(r.indicatorsGone, "right rail: Economic indicators panel removed from Home");
check(r.earnRows > 0, `earnings: this week's companies render (${r.earnRows})`);
check(r.firstHasDate && r.firstHasTkr && r.firstHasWhen, "earnings: a row shows date + ticker + pre/post-market");
check(r.anyEst > 0, `earnings: forecast (Est) shown (${r.anyEst})`);
check(r.anyAct > 0, `earnings: outcome (Act) shown for reported names (${r.anyAct})`);
check(r.anyPx > 0, `earnings: price reaction shown for reported names (${r.anyPx})`);

checkErrs(errs, "home right rail");
await ctx.close();
await b.close(); srv.close();
finish();
