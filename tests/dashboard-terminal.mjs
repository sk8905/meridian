// Dashboard Macro pane as a fixed-viewport terminal (desktop): the rates panels
// tile into three columns that fill the screen, and the Macro wire is a rail that
// scrolls INTERNALLY — the dashboard itself doesn't scroll as a whole. Mobile
// keeps the stacked card layout (this terminal is desktop-only, ≥901px).
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/dashboard/`);
await pg.waitForSelector(".dsh-term-ws .dsh-card", { timeout: 8000 });
await pg.waitForTimeout(600);

const r = await pg.evaluate(() => {
  const ws = document.querySelector(".dsh-term-ws");
  const dsh = document.querySelector(".dsh");
  const rail = document.querySelector(".dsh-term-rail .dsh-news");
  const regime = document.querySelector(".dsh-term > .dsh-card");   // regime strip (first card)
  const term = document.querySelector(".dsh-term");
  const cols = ws ? getComputedStyle(ws).gridTemplateColumns.trim().split(/\s+/).length : 0;
  return {
    cols,
    dshOv: dsh ? getComputedStyle(dsh).overflowY : "",
    dshFlex: dsh ? getComputedStyle(dsh).display : "",
    railOv: rail ? getComputedStyle(rail).overflowY : "",
    railScrolls: rail ? rail.scrollHeight > rail.clientHeight + 2 : false,
    regimeW: regime ? Math.round(regime.getBoundingClientRect().width) : 0,
    termW: term ? Math.round(term.getBoundingClientRect().width) : 0,
    // the dashboard fills the viewport rather than overflowing the page
    pageScroll: document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight,
  };
});

checkEq(r.cols, 3, "Macro terminal: the workspace is a three-column grid");
check(r.dshOv !== "auto" && r.dshFlex === "flex", `Macro terminal: the dashboard fills the viewport (doesn't scroll as a whole) — overflowY=${r.dshOv}, display=${r.dshFlex}`);
check(/(auto|scroll)/.test(r.railOv), `Macro terminal: the wire rail scrolls internally (overflowY=${r.railOv})`);
check(r.railScrolls, "Macro terminal: the wire rail actually has more headlines than fit (it scrolls)");
check(r.regimeW >= r.termW - 24, `Macro terminal: the regime strip fills the full width, not shrink-to-content (${r.regimeW}/${r.termW})`);
check(r.pageScroll <= 4, `Macro terminal: the page itself doesn't scroll (overflow ${r.pageScroll}px)`);

checkErrs(errs, "dashboard terminal");

// Credit pane is a terminal too — data columns + a credit-wire rail that scrolls.
await pg.evaluate(() => { const t = [...document.querySelectorAll(".dsh-nav button, .dsh-nav [role=tab]")].find((x) => /^Credit/i.test(x.textContent.trim())); if (t) t.click(); });
await pg.waitForSelector(".dsh-term-rail .dsh-news", { timeout: 8000 });
await pg.waitForTimeout(400);
const c = await pg.evaluate(() => {
  const ws = document.querySelector(".dsh-term-ws");
  const rail = document.querySelector(".dsh-term-rail .dsh-news");
  return {
    cols: ws ? getComputedStyle(ws).gridTemplateColumns.trim().split(/\s+/).length : 0,
    railOv: rail ? getComputedStyle(rail).overflowY : "",
    hasWire: !!rail,
  };
});
checkEq(c.cols, 3, "Credit terminal: the workspace is a three-column grid");
check(c.hasWire && /(auto|scroll)/.test(c.railOv), `Credit terminal: the credit-wire rail scrolls internally (${c.railOv})`);
checkErrs(errs, "dashboard terminal credit");

await ctx.close();
await b.close(); srv.close();
finish();
