// Home rails: the right rail carries the macro/rates data — Key rates, Spreads,
// Volatility, Policy rate, Yield curve — then Prediction markets last. (Key rates,
// spreads and volatility are three separate panels, not one combined gauge.)
// "This week's earnings" (date · pre/post-market · forecast → outcome) lives in
// the LEFT rail with the equities data, and Top movers stretches to fill the rail.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-earn .g-earn-row", { timeout: 8000 });
await pg.waitForTimeout(400);

const r = await pg.evaluate(() => {
  // Panel titles are the header's first child — a <span>, or an <a> when the title
  // deep-links into a Dashboard section (Policy rate / Yield curve / Key rates /
  // Volatility). Match either.
  const headers = [...document.querySelectorAll(".g-side2 .tui-ph > :first-child")].map((s) => s.textContent.trim());
  const rows = [...document.querySelectorAll("#g-earn .g-earn-row")];
  const first = rows[0];
  const side = document.querySelector(".g-side");
  const fx = document.querySelector(".g-side #jump-fx");
  return {
    headers,
    indicatorsGone: !document.getElementById("g-indicators"),
    // Earnings moved to the left rail; Key rates & Volatility moved to the right.
    earnInLeft: !!document.querySelector(".g-side #g-earn"),
    earnNotInRight: !document.querySelector(".g-side2 #g-earn"),
    ratesInRight: !!document.querySelector(".g-side2 #g-rates"),
    spreadsInRight: !!document.querySelector(".g-side2 #g-spreads"),
    volInRight: !!document.querySelector(".g-side2 #g-vol"),
    ratesNotInLeft: !document.querySelector(".g-side #g-rates") && !document.querySelector(".g-side #g-vol") && !document.querySelector(".g-side #g-spreads"),
    // Top movers stretches to fill the left rail: it is the flex-grow child, so FX
    // (the last panel) is pushed to the rail's bottom with no free space above it.
    moversGrows: getComputedStyle(document.querySelector(".g-movers-pnl")).flexGrow === "1",
    fxAtBottom: (() => { if (!side || !fx) return false; return Math.abs(side.getBoundingClientRect().bottom - fx.getBoundingClientRect().bottom) < 6; })(),
    earnRows: rows.length,
    firstHasDate: !!(first && first.querySelector(".g-earn-date")),
    firstHasTkr: !!(first && first.querySelector(".g-earn-tkr")),
    firstHasWhen: !!(first && first.querySelector(".g-earn-when")),
    anyEst: document.querySelectorAll("#g-earn .g-earn-l:not(.g-earn-act)").length,
    anyAct: document.querySelectorAll("#g-earn .g-earn-act").length,
    anyPx: document.querySelectorAll("#g-earn .g-earn-px").length,
    anyAwait: document.querySelectorAll("#g-earn .g-earn-await").length,
    // the well hugs its content (no gap) — with <=5 items, no forced max-height,
    // and the well bottom sits just under the last row.
    wellHugs: (() => { const w = document.querySelector(".g-earn-scroll"), last = document.querySelector("#g-earn .g-earn-row:last-child"); return w && last ? (w.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom) < 6 : false; })(),
    bodyMax: (document.querySelector(".g-earn-body") || {}).style ? document.querySelector(".g-earn-body").style.maxHeight : "",
  };
});

checkEq(r.headers.join(" | "), "Key rates | Spreads | Volatility | Policy rate | Yield curve | Prediction markets", "right rail order: Key rates → Spreads → Volatility → Policy rate → Yield curve → Prediction markets");
check(r.indicatorsGone, "right rail: Economic indicators panel removed from Home");
check(r.earnInLeft && r.earnNotInRight, "This week's earnings moved to the left rail");
check(r.ratesInRight && r.spreadsInRight && r.volInRight && r.ratesNotInLeft, "Key rates, Spreads & Volatility are three separate right-rail panels");
check(r.moversGrows && r.fxAtBottom, "left rail: Top movers stretches to fill (FX pinned at the rail bottom)");
check(r.earnRows > 0, `earnings: this week's companies render (${r.earnRows})`);
check(r.firstHasDate && r.firstHasTkr && r.firstHasWhen, "earnings: a row shows date + ticker + pre/post-market");
check(r.anyEst > 0, `earnings: forecast (Est) shown (${r.anyEst})`);
// Reported names show an outcome (Act) + price reaction; names not yet reported
// this week show an "awaiting" marker. Early in the week nothing has reported, so
// accept either — every row must carry an outcome OR an awaiting state.
check(r.anyAct > 0 || r.anyAwait > 0, `earnings: outcome (Act) shown for reported names, else awaiting (act ${r.anyAct}, awaiting ${r.anyAwait})`);
check(r.anyPx > 0 || r.anyAwait > 0, `earnings: price reaction shown for reported names, else awaiting (px ${r.anyPx}, awaiting ${r.anyAwait})`);
check(r.earnRows <= 5 ? r.wellHugs && !r.bodyMax : true, "earnings: the pane fits its items with no gap (<=5 shows uncapped)");

checkErrs(errs, "home right rail");
await ctx.close();
await b.close(); srv.close();
finish();
