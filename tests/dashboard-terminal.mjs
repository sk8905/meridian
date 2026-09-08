// Dashboard as a 3-zone workspace (desktop ≥901px): a narrow LEFT nav rail holds
// the section chips, the selected section STACKS its cards in the middle, and the
// section's news wire is a RIGHT rail that scrolls internally. The dashboard fills
// the viewport (it doesn't scroll as a whole). Legal is a full-width search (no rail).
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/dashboard/`);
await pg.waitForSelector(".dsh-3z .dsh-mid .dsh-card", { timeout: 8000 });
await pg.waitForTimeout(600);

const r = await pg.evaluate(() => {
  const dsh = document.querySelector(".dsh");
  const nav = document.querySelector(".dsh-railnav");
  const mid = document.querySelector(".dsh-mid");
  const rail = document.querySelector(".dsh-newsrail");
  const wire = document.querySelector(".dsh-newsrail .dsh-news");
  const navR = nav && nav.getBoundingClientRect(), midR = mid && mid.getBoundingClientRect(), railR = rail && rail.getBoundingClientRect();
  return {
    navChips: document.querySelectorAll(".dsh-railnav .dsh-navchip").length,
    navLeft: navR ? Math.round(navR.left) : -1,
    navW: navR ? Math.round(navR.width) : -1,
    navNarrow: navR ? navR.width < 220 : false,
    // left rail sits left of the middle, which sits left of the news rail
    order: navR && midR && railR ? (navR.right <= midR.left + 2 && midR.right <= railR.left + 2) : false,
    midScrolls: mid ? /(auto|scroll)/.test(getComputedStyle(mid).overflowY) : false,
    hasRail: !!rail,
    wireOv: wire ? getComputedStyle(wire).overflowY : "",
    dshOv: dsh ? getComputedStyle(dsh).overflowY : "",
    dshFlex: dsh ? getComputedStyle(dsh).display : "",
    pageScroll: document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight,
  };
});
checkEq(r.navChips, 6, "Dashboard: the left rail holds the six section chips");
check(r.navLeft <= 12 && r.navNarrow, `Dashboard: the nav is a narrow LEFT rail (${r.navW}px at x=${r.navLeft})`);
check(r.order, "Dashboard: the layout reads left-to-right — nav rail · middle · news rail");
check(r.dshOv !== "auto" && r.dshFlex === "flex", `Dashboard: the workspace fills the viewport (doesn't scroll as a whole) — overflowY=${r.dshOv}`);
check(r.midScrolls, "Dashboard: the middle section stacks and scrolls internally");
check(r.hasRail && /(auto|scroll)/.test(r.wireOv), `Macro: the news wire is a right rail that scrolls internally (${r.wireOv})`);
check(r.pageScroll <= 4, `Dashboard: the page itself doesn't scroll (overflow ${r.pageScroll}px)`);
checkErrs(errs, "dashboard 3-zone");

// Credit → its own news wire in the right rail.
await pg.goto(`http://localhost:${srv.port}/v2/dashboard/credit`, { waitUntil: "load" });
await pg.waitForSelector(".dsh-newsrail .dsh-news", { timeout: 8000 });
const c = await pg.evaluate(() => {
  const wire = document.querySelector(".dsh-newsrail .dsh-news");
  return { hasWire: !!wire, ov: wire ? getComputedStyle(wire).overflowY : "" };
});
check(c.hasWire && /(auto|scroll)/.test(c.ov), `Credit: the credit-wire is a right rail that scrolls internally (${c.ov})`);
checkErrs(errs, "dashboard 3-zone credit");

// Every section: nav rail + tiled middle + a right-hand news wire (Legal now has
// a "Legal wire" rail too, like the other tabs).
for (const key of ["equities", "fixed-income", "hedge-funds", "legal"]) {
  await pg.goto(`http://localhost:${srv.port}/v2/dashboard/${key}`, { waitUntil: "load" });
  await pg.waitForSelector(".dsh-3z .dsh-mid", { timeout: 8000 });
  await pg.waitForTimeout(300);
  const p = await pg.evaluate(() => ({
    threeZone: !!document.querySelector(".dsh-3z"),
    navChips: document.querySelectorAll(".dsh-railnav .dsh-navchip").length,
    dshFlex: (() => { const d = document.querySelector(".dsh"); return d ? getComputedStyle(d).display : ""; })(),
    pageScroll: document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight,
    hasRail: !!document.querySelector(".dsh-newsrail"),
    norail: !!document.querySelector(".dsh-3z.dsh-norail"),
    hSize: (() => { const h = document.querySelector(".dsh-mid .dsh-h"); return h ? getComputedStyle(h).fontSize : ""; })(),
  }));
  check(p.threeZone && p.navChips === 6 && p.dshFlex === "flex", `${key}: renders the 3-zone workspace with the left nav rail`);
  check(p.pageScroll <= 4, `${key}: the page itself doesn't scroll (overflow ${p.pageScroll}px)`);
  check(p.hasRail && !p.norail, `${key}: keeps a news rail on the right`);
  check(p.hSize === "12px", `${key}: panel headers use the 12px terminal scale (got ${p.hSize})`);
}
checkErrs(errs, "dashboard 3-zone all sections");

await ctx.close();
await b.close(); srv.close();
finish();
