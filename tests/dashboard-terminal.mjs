// Dashboard as a 3-zone workspace (desktop ≥901px): a narrow LEFT nav rail holds
// the section chips, the selected section STACKS its cards in the middle, and the
// section's news wire is a RIGHT rail that scrolls internally. The dashboard fills
// the viewport (it doesn't scroll as a whole). Legal is a full-width search (no rail).
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";
import { apis as LIVE } from "./fixtures/dashboard-live.mjs";

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
checkEq(r.navChips, 5, "Dashboard: the left rail holds the five section chips");
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
for (const key of ["rates", "equities", "hedge-funds", "legal"]) {
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
    adj: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs-adj")) || 0,
  }));
  check(p.threeZone && p.navChips === 5 && p.dshFlex === "flex", `${key}: renders the 3-zone workspace with the left nav rail`);
  check(p.pageScroll <= 4, `${key}: the page itself doesn't scroll (overflow ${p.pageScroll}px)`);
  check(p.hasRail && !p.norail, `${key}: keeps a news rail on the right`);
  check(p.hSize === `${12 + p.adj}px`, `${key}: panel headers use the app's body scale (12px + --fs-adj = ${12 + p.adj}px, got ${p.hSize})`);
}
checkErrs(errs, "dashboard 3-zone all sections");

await ctx.close();
// No card spills or overlaps at any desktop width (R37): with LIVE payloads, every
// .dsh-card's content fits its box (wide tables scroll inside their own .dsh-scroll
// region) and no two sibling cards in the middle column overlap.
{
  const srv2 = await serve(LIVE);
  for (const w of [1024, 1280, 1440, 1600]) {
    const { ctx: c2, pg: p2, errs: e2 } = await open(b, { viewport: { width: w, height: 900 } }, `http://localhost:${srv2.port}/v2/dashboard/`);
    await p2.waitForSelector(".dsh-3z .dsh-mid > .dsh-card", { timeout: 10000 });
    for (const key of ["rates", "equities", "credit", "hedge-funds", "legal"]) {
      await p2.evaluate((k) => { const t = document.querySelector(`.dsh-navchip[data-sub="${k}"]`); t && t.click(); }, key);
      await p2.waitForTimeout(700);
      const r = await p2.evaluate(() => {
        const cards = [...document.querySelectorAll(".dsh-3z .dsh-card")].filter((c) => c.offsetParent !== null && !c.closest("details:not([open])"));
        const spill = cards.filter((c) => c.scrollWidth > c.clientWidth + 1).map((c) => (c.querySelector(".dsh-h") || c).textContent.trim().slice(0, 32));
        const tops = [...document.querySelectorAll(".dsh-mid > .dsh-card, .dsh-mid > .dsh-wide > .dsh-card, .dsh-mid > .dsh-row2 > .dsh-card")].map((c) => c.getBoundingClientRect());
        let overlaps = 0;
        for (let i = 0; i < tops.length; i++) for (let j = i + 1; j < tops.length; j++) {
          const a = tops[i], b2 = tops[j];
          if (a.left < b2.right - 1 && b2.left < a.right - 1 && a.top < b2.bottom - 1 && b2.top < a.bottom - 1) overlaps++;
        }
        return { spill, overlaps, n: cards.length };
      });
      check(r.n > 0 && r.spill.length === 0, `${w}px ${key}: no card content spills its card (${r.spill.join(" | ") || "ok"})`);
      checkEq(r.overlaps, 0, `${w}px ${key}: no two cards overlap`);
    }
    checkErrs(e2, `dashboard ${w}px live layout`);
    await c2.close();
  }
  srv2.close();
}

await b.close(); srv.close();
finish();
