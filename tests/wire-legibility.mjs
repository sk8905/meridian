// F9 — the wire source label reads at the secondary --t-mut tier, not the faint
// tertiary that fell below WCAG AA on the light ground.
// F10 — on a short laptop viewport the Home rails scroll as a whole so their
// pinned panels stay reachable instead of clipping.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// ---- F9: source label uses --t-mut (light + dark) ----
// The --t-* tokens are scoped to the panel roots (not :root), so assert against
// the documented token rgb values directly. --t-mut clears WCAG AA on the light
// ground where the old --t-faint (light rgb(139,150,172), ~3:1) did not.
const MUT = { light: "rgb(94, 106, 132)", dark: "rgb(133, 146, 173)" };
const FAINT = { light: "rgb(139, 150, 172)", dark: "rgb(92, 106, 134)" };
for (const theme of ["light", "dark"]) {
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.evaluate((t) => { document.documentElement.setAttribute("data-theme", t); localStorage.setItem("m_signed_in", "1"); }, theme);
  await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
  await pg.waitForTimeout(400);
  const srcColor = await pg.evaluate(() => { const s = document.querySelector("#g-feed .g-feed-src"); return s ? getComputedStyle(s).color : ""; });
  checkEq(srcColor, MUT[theme], `${theme}: wire source label uses --t-mut (readable), not the faint tier`);
  check(srcColor !== FAINT[theme], `${theme}: source label is not the faint tertiary tier`);
  checkErrs(errs, `source contrast ${theme}`);
  await ctx.close();
}

// ---- F10: short-laptop viewport keeps rail content reachable ----
{
  const { ctx, pg, errs } = await open(b, { viewport: { width: 1280, height: 620 } }, base + "/v2/");
  await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-predict, .g-flow-pane", { timeout: 8000 });
  await pg.waitForTimeout(1200);
  const r = await pg.evaluate(() => {
    const noHPageScroll = document.scrollingElement.scrollWidth <= window.innerWidth + 1;
    const rail = (sel) => {
      const el = document.querySelector(sel); if (!el) return { ok: false };
      const cs = getComputedStyle(el);
      // Reachable = the rail fits, OR it can scroll to reveal the overflow.
      const scrollable = /(auto|scroll)/.test(cs.overflowY) || [...el.querySelectorAll("*")].some((c) => /(auto|scroll)/.test(getComputedStyle(c).overflowY) && c.scrollHeight > c.clientHeight + 2);
      const fits = el.scrollHeight <= el.clientHeight + 2;
      return { ok: fits || scrollable, fits, scrollable };
    };
    return { noHPageScroll, left: rail(".g-side"), macro: rail(".g-side2"), mgr: rail(".g-side3") };
  });
  check(r.noHPageScroll, "short viewport: no horizontal page scroll");
  check(r.left.ok, `short viewport: the markets rail's content stays reachable (fits ${r.left.fits}, scrollable ${r.left.scrollable})`);
  check(r.macro.ok, `short viewport: the macro rail's content stays reachable (fits ${r.macro.fits}, scrollable ${r.macro.scrollable})`);
  check(r.mgr.ok, `short viewport: the manager rail's content stays reachable (fits ${r.mgr.fits}, scrollable ${r.mgr.scrollable})`);
  checkErrs(errs, "short viewport rails");
  await ctx.close();
}

await b.close(); srv.close();
finish();
