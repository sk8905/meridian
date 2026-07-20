// Active source-filter bars pin under the fixed chrome on phones so the
// ✕ clear stays reachable mid-scroll (Home feed + the shared Macro/Credit bar).
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// HOME: filter by a source, scroll deep — bar pinned at header + 30px chips row.
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/");
  await pg.waitForTimeout(2000);
  const res = await pg.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    document.querySelector("#g-feed .g-feed-src")?.click(); await sleep(500);
    const bar = document.querySelector(".g-feed-srcbar");
    if (!bar) return { fail: "no srcbar" };
    window.scrollTo(0, 2000); await sleep(400);
    const r = bar.getBoundingClientRect();
    const head = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--wire-head-h")) || 53;
    const clear = bar.querySelector(".g-feed-srcclear");
    const out = { top: Math.round(r.top), want: Math.round(head + 30), scrolled: window.scrollY > 0, hasClear: !!clear };
    if (clear) { clear.click(); await sleep(400); out.cleared = !document.querySelector(".g-feed-srcbar"); }
    return out;
  });
  check(!res.fail, "home srcbar appears");
  check(res.scrolled, "home page scrolled");
  checkEq(res.top, res.want, "home srcbar pinned under the feed chips");
  check(res.hasClear && res.cleared, "home clear button works");
  checkErrs(errs, "home srcbar");
  await ctx.close();
}
// MACRO: shared .g-feed-srcbar (now the same wire engine as Home) sticks below
// the fixed chrome on phones.
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/macro/");
  await pg.waitForTimeout(1500);
  const res = await pg.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    document.querySelector("#mac-wire .g-feed-src")?.click(); await sleep(500);
    const bar = document.querySelector("#mac-wire .g-feed-srcbar");
    if (!bar) return { fail: "srcbar not shown" };
    window.scrollTo(0, 1500); await sleep(400);
    const cs = getComputedStyle(bar);
    const r = bar.getBoundingClientRect();
    const clear = bar.querySelector(".g-feed-srcclear");
    const out = { pos: cs.position, visible: r.top >= 0 && r.top < 220, hasClear: !!clear };
    if (clear) { clear.click(); await sleep(400); out.cleared = !document.querySelector("#mac-wire .g-feed-srcbar"); }
    return out;
  });
  check(!res.fail, "macro srcbar appears");
  checkEq(res.pos, "sticky", "macro srcbar sticky");
  check(res.visible, "macro srcbar visible in the chrome band");
  check(res.hasClear && res.cleared, "macro clear button works");
  checkErrs(errs, "macro srcbar");
  await ctx.close();
}
await b.close(); srv.close();
finish();
