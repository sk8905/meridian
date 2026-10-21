// Home desktop rails (left data rail .g-side, X wire .g-side-x, macro rail .g-side2) set
// type 1px under the app scale (owner 2026-10-21, 1.5px → 1px), by re-declaring the grid tokens
// with --fs-rail — so the one knob (--fs-adj, Menu → Text size) still moves them (R11).
import { serve, launchChromium, open, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { pg, errs } = await open(b, { viewport: { width: 1600, height: 900 } }, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector(".tui .g-side2", { timeout: 15000 });
const probe = () => pg.evaluate(() => {
  const v = (sel, tok) => { const e = document.querySelector(sel); return e ? parseFloat(getComputedStyle(e).getPropertyValue(tok)) || parseFloat((() => { const t = document.createElement("span"); t.style.fontSize = `var(${tok})`; e.appendChild(t); const s = getComputedStyle(t).fontSize; t.remove(); return s; })()) : null; };
  const px = (sel, tok) => { const e = document.querySelector(sel); if (!e) return null; const t = document.createElement("span"); t.style.fontSize = `var(${tok})`; e.appendChild(t); const s = parseFloat(getComputedStyle(t).fontSize); t.remove(); return s; };
  return { root: px("body", "--fs-body"), side: px(".tui .g-side", "--fs-body"), sidex: px(".tui .g-side-x", "--fs-body"), side2: px(".tui .g-side2", "--fs-body"), sideNum: px(".tui .g-side", "--fs-num"), feed: px(".tui .g-feed", "--fs-body") };
});
const a = await probe();
checkEq(a.side, a.root - 1, "left rail body text is 1px under the app body size");
checkEq(a.sidex, a.root - 1, "X-wire rail body text is 1px under");
checkEq(a.side2, a.root - 1, "macro rail body text is 1px under");
checkEq(a.sideNum, a.root - 1 - 1, "rail numeric data keeps its notch under body");
checkEq(a.feed, a.root, "the centre wire is unchanged");
await pg.evaluate(() => document.documentElement.style.setProperty("--fs-adj", "2.5px"));
const c = await probe();
check(c.side - a.side === 2 && c.root - a.root === 2, `the Text-size knob still moves the rails (+2px → ${c.side}px)`);
checkErrs(errs, "home rails");
await b.close(); srv.close();
finish();
