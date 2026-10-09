// Pull-to-refresh: ONLY THE RING MOVES. The page content must stay put (no translate) while
// the loading ring descends from below the frozen chips by a small, capped band (≈GAP_MAX)
// no matter how far the finger travels — the ring fills as a determinate dial (visible from
// the first pixel) and, past the threshold, springs to rest and spins. Touch-only, so the
// gesture is driven with synthetic TouchEvents on the Home wire column (.g-feed-wrap).
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
// The wire column (.g-feed-wrap) lives on the News tab now (news mode) — load it.
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/news/`);
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
await pg.waitForTimeout(400);

// Dispatch a touch pull of `travel` px on the wire column, sampling the RING descent (the
// zone's padding-top), the ring opacity/fill, and — critically — the page's own translateY,
// which must stay ~0 (the page does not slide; only the ring moves).
const pull = (travel) => pg.evaluate(async (travel) => {
  const wrap = document.querySelector(".g-feed-wrap"); if (!wrap) return { err: "no .g-feed-wrap" };
  window.scrollTo(0, 0);
  const r = wrap.getBoundingClientRect();
  const cx = Math.round(r.left + r.width / 2), sy = Math.round(r.top + 8);
  const mk = (type, y) => {
    const t = new Touch({ identifier: 1, target: wrap, clientX: cx, clientY: y, pageX: cx, pageY: y });
    const empty = type === "touchend";
    return new TouchEvent(type, { bubbles: true, cancelable: true, touches: empty ? [] : [t], targetTouches: empty ? [] : [t], changedTouches: [t] });
  };
  const zone = () => document.getElementById("ptr-zone");
  const padTop = () => { const z = zone(); return z ? (parseFloat(getComputedStyle(z).paddingTop) || 0) : 0; };
  const ringTop = () => { const g = document.getElementById("ptr-ring"); return g ? Math.round(g.getBoundingClientRect().top) : 0; };
  const ringOp = () => { const g = document.getElementById("ptr-ring"); return g ? (parseFloat(getComputedStyle(g).opacity) || 0) : 0; };
  const sweep = () => { const a = document.querySelector("#ptr-ring .ptr-arc"); return a ? (getComputedStyle(a).getPropertyValue("--ptr-sweep") || "").trim() : ""; };
  const listTY = () => { const list = document.querySelector(".wire-ptr-list") || wrap; const m = new DOMMatrixReadOnly(getComputedStyle(list).transform); return Math.round(m.m42); };
  wrap.dispatchEvent(mk("touchstart", sy));
  let maxPad = 0, firstOp = 0, pulled = false, ringStart = ringTop(), maxTY = 0;
  for (let dy = 12; dy <= travel; dy += 18) {
    wrap.dispatchEvent(mk("touchmove", sy + dy));
    await new Promise((r) => requestAnimationFrame(r));
    maxPad = Math.max(maxPad, padTop());
    maxTY = Math.max(maxTY, Math.abs(listTY()));
    if (!pulled && padTop() > 0) { pulled = true; firstOp = ringOp(); }
  }
  const out = { maxPad: Math.round(maxPad), ringDescent: ringTop() - ringStart, pageTY: maxTY, ringOp: ringOp(), firstOp, sweep: sweep() };
  // Release BELOW the threshold (finger back to the top) so it snaps back without a reload.
  wrap.dispatchEvent(mk("touchmove", sy - 2));
  wrap.dispatchEvent(mk("touchend", sy - 2));
  await new Promise((r) => setTimeout(r, 380));
  return out;
}, travel);

// A HARD pull (300px of finger travel) must descend only the compact ring band — and the PAGE
// must not move at all.
const hard = await pull(300);
check(hard && !hard.err, `pull armed on the Home wire (${hard && hard.err ? hard.err : "ok"})`);
check(hard.pageTY <= 1, `the PAGE does not slide — only the ring moves (page translateY ${hard.pageTY}px)`);
check(hard.maxPad > 0 && hard.maxPad <= 66, `the ring descends only the capped band (~60px) even on a hard pull (${hard.maxPad}px)`);
check(hard.ringDescent > 10, `the ring actually descends on screen as you pull (${hard.ringDescent}px down)`);
check(hard.ringOp > 0.9, `the ring is fully shown at a full pull (opacity ${hard.ringOp})`);
check(hard.firstOp >= 0.2, `the ring is visible from the first pixel of the pull — no faint void (first opacity ${hard.firstOp})`);
check(hard.sweep === "360deg", `the fill dial completes at the threshold (--ptr-sweep ${hard.sweep})`);

// Release past the threshold → the ring enters its spin state and holds at the rest descent,
// with the page still unmoved.
const released = await pg.evaluate(async () => {
  try { window.fetch = () => new Promise(() => {}); } catch { /* */ }   // stall the post-release reload so the spin state stays readable
  const wrap = document.querySelector(".g-feed-wrap");
  const r = wrap.getBoundingClientRect();
  const cx = Math.round(r.left + r.width / 2), sy = Math.round(r.top + 8);
  const mk = (type, y) => { const t = new Touch({ identifier: 2, target: wrap, clientX: cx, clientY: y, pageX: cx, pageY: y }); const e = type === "touchend"; return new TouchEvent(type, { bubbles: true, cancelable: true, touches: e ? [] : [t], targetTouches: e ? [] : [t], changedTouches: [t] }); };
  window.scrollTo(0, 0);
  wrap.dispatchEvent(mk("touchstart", sy));
  for (let dy = 12; dy <= 120; dy += 18) { wrap.dispatchEvent(mk("touchmove", sy + dy)); await new Promise((r) => requestAnimationFrame(r)); }
  wrap.dispatchEvent(mk("touchend", sy + 120));
  await new Promise((r) => setTimeout(r, 120));
  const g = document.getElementById("ptr-ring"), z = document.getElementById("ptr-zone");
  const list = document.querySelector(".wire-ptr-list") || wrap;
  const ty = Math.round(new DOMMatrixReadOnly(getComputedStyle(list).transform).m42);
  return { spinning: !!g && g.classList.contains("ptr-spinning"), restPad: z ? Math.round(parseFloat(getComputedStyle(z).paddingTop) || 0) : 0, pageTY: Math.abs(ty) };
});
check(released.spinning, "release past the threshold puts the ring into its spin state");
check(released.restPad > 0 && released.restPad <= 66, `the ring holds at the compact rest descent while spinning (${released.restPad}px)`);
check(released.pageTY <= 1, `the page is still unmoved while the ring spins (page translateY ${released.pageTY}px)`);

checkErrs(errs, "ptr ring-only pull");
await ctx.close();
await b.close();
srv.close();
finish();
