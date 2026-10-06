// Pull-to-refresh: the COMPACT REVEAL. The content must slide down only a small, capped
// band (≈GAP_MAX) no matter how far the finger travels — so the page never empties into a
// big black void — while the ring fills as a determinate dial (visible from the first
// pixel) and, past the threshold, springs to rest and spins. Touch-only, so the gesture is
// driven with synthetic TouchEvents on the Home wire column (.g-feed-wrap / .wire-ptr-list).
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
await pg.waitForTimeout(400);

// Helper injected into the page: dispatch a touch pull of `travel` px on the wire column,
// sampling the gap height + ring opacity along the way. Returns the peak gap, the final
// content translateY, the peak ring opacity, and the ring opacity after the FIRST small move.
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
  const zoneH = () => { const z = document.getElementById("ptr-zone"); return z ? (parseFloat(getComputedStyle(z).height) || 0) : 0; };
  const ringOp = () => { const g = document.getElementById("ptr-ring"); return g ? (parseFloat(getComputedStyle(g).opacity) || 0) : 0; };
  const sweep = () => { const a = document.querySelector("#ptr-ring .ptr-arc"); return a ? (getComputedStyle(a).getPropertyValue("--ptr-sweep") || "").trim() : ""; };
  wrap.dispatchEvent(mk("touchstart", sy));
  let maxH = 0, firstOp = 0, pulled = false;
  for (let dy = 12; dy <= travel; dy += 18) {
    wrap.dispatchEvent(mk("touchmove", sy + dy));
    await new Promise((r) => requestAnimationFrame(r));
    maxH = Math.max(maxH, zoneH());
    if (!pulled && zoneH() > 0) { pulled = true; firstOp = ringOp(); }
  }
  const list = document.querySelector(".wire-ptr-list") || wrap;
  const m = new DOMMatrixReadOnly(getComputedStyle(list).transform);
  const out = { maxH: Math.round(maxH), translateY: Math.round(m.m42), ringOp: ringOp(), firstOp, sweep: sweep() };
  // Release BELOW the threshold (finger back to the top) so it snaps back without triggering
  // a reload — leaves the module cleanly reset for the next gesture.
  wrap.dispatchEvent(mk("touchmove", sy - 2));
  wrap.dispatchEvent(mk("touchend", sy - 2));
  await new Promise((r) => setTimeout(r, 380));
  return out;
}, travel);

// A HARD pull (300px of finger travel) must still open only the compact band.
const hard = await pull(300);
check(hard && !hard.err, `pull armed on the Home wire (${hard && hard.err ? hard.err : "ok"})`);
check(hard.maxH > 0 && hard.maxH <= 66, `compact reveal: the gap caps at ~60px even on a hard pull — the page never empties (gap ${hard.maxH}px)`);
check(hard.translateY > 0 && hard.translateY <= 66, `compact reveal: the content slides only the capped band, no big void (translateY ${hard.translateY}px)`);
check(hard.ringOp > 0.9, `the ring is fully shown at a full pull (opacity ${hard.ringOp})`);
check(hard.firstOp >= 0.2, `the ring is visible from the first pixel of the pull — no faint void (first opacity ${hard.firstOp})`);
check(hard.sweep === "360deg", `the fill dial completes at the threshold (--ptr-sweep ${hard.sweep})`);

// Release past the threshold → the ring enters its spin state and the band holds at rest.
const released = await pg.evaluate(async () => {
  // Stall the post-release reload: the module freshens the shell (fetch) then reloads;
  // make those fetches hang so the 3.5s timeout governs and the spin state stays readable.
  try { window.fetch = () => new Promise(() => {}); } catch { /* */ }
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
  return { spinning: !!g && g.classList.contains("ptr-spinning"), restH: z ? Math.round(parseFloat(getComputedStyle(z).height) || 0) : 0 };
});
check(released.spinning, "release past the threshold puts the ring into its spin state");
check(released.restH > 0 && released.restH <= 66, `the band holds open at the compact rest height while spinning (${released.restH}px)`);

checkErrs(errs, "ptr compact reveal");
await ctx.close();
await b.close();
srv.close();
finish();
