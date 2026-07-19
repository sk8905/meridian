// Swipe gestures vs sticky rows: during a slide the in-pane sticky rows drop
// to static (no floating headers) while the actively-swiped chip row keeps its
// lock (.st-hold); everything restores when the slide lands.
import { serve, launchChromium, open, touches, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// A) Macro dashboard sub-section swipe (earnings → credit).
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/macro/");
  const t = await touches(ctx, pg);
  await pg.waitForTimeout(1800);
  await pg.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    [...document.querySelectorAll(".tchip")].find((c) => c.textContent.trim() === "Dashboard").click(); await sleep(400);
    [...document.querySelectorAll("#ck-secnav .tchip")].find((c) => c.dataset.sec === "earnings").click(); await sleep(300);
    window.scrollTo(0, 400);
  });
  await pg.waitForTimeout(300);
  await t.swipeBegin(300, 500, -1);
  const mid = await pg.evaluate(() => {
    const sb = document.querySelector(".mac-dash-pane .ck-secbar");
    return {
      sliding: document.body.classList.contains("wire-sliding"),
      secbarPos: sb ? getComputedStyle(sb).position : "-",
      secbarHold: !!(sb && sb.classList.contains("st-hold")),
      chipbarPos: (() => { const e = document.querySelector("#ck-cockpit .ew-chipbar"); return e ? getComputedStyle(e).position : "-"; })(),
    };
  });
  check(mid.sliding, "body.wire-sliding during sub-swipe");
  checkEq(mid.secbarPos, "sticky", "secbar HOLDS during sub-swipe");
  check(mid.secbarHold, "secbar carries .st-hold");
  checkEq(mid.chipbarPos, "static", "in-pane chipbar static during sub-swipe");
  await t.swipeFinish(300, 500, -1);
  const after = await pg.evaluate(() => ({
    sec: document.querySelector("#ck-secnav .tchip.is-on")?.dataset.sec,
    sliding: document.body.classList.contains("wire-sliding"),
    holdLeft: !!document.querySelector(".st-hold"),
  }));
  checkEq(after.sec, "credit", "sub-swipe lands on credit");
  check(!after.sliding && !after.holdLeft, "slide state fully cleaned up");

  // B) Main-tab swipe INTO the dashboard: incoming secbar static mid-slide.
  await pg.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    [...document.querySelectorAll("#mac-chips .tchip")].find((c) => /comm/i.test(c.textContent)).click(); await sleep(400);
    window.scrollTo(0, 400);
  });
  await pg.waitForTimeout(300);
  await t.swipeBegin(300, 500, -1);
  const mid2 = await pg.evaluate(() => {
    const sb = document.querySelector("#mac-dash .ck-secbar");
    return { pos: sb ? getComputedStyle(sb).position : "-", vis: !!(sb && sb.getClientRects().length) };
  });
  check(mid2.vis, "incoming dashboard visible mid main-tab slide");
  checkEq(mid2.pos, "static", "incoming secbar static mid main-tab slide");
  await t.swipeFinish(300, 500, -1);
  checkEq(await pg.evaluate(() => document.querySelector("#mac-chips .tchip.is-on")?.textContent.trim()), "Dashboard", "main-tab swipe lands on Dashboard");
  checkEq(await pg.evaluate(() => getComputedStyle(document.querySelector("#mac-dash .ck-secbar")).position), "sticky", "secbar sticky restored after landing");
  checkErrs(errs, "macro swipes");
  await ctx.close();
}
// C) Credit dashboard managers pane: stuck search/table headers static mid-slide.
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/credit/");
  const t = await touches(ctx, pg);
  await pg.waitForTimeout(1800);
  await pg.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    [...document.querySelectorAll("#cr-dash-tabs .tchip")].find((c) => c.dataset.p === "managers").click(); await sleep(400);
    window.scrollTo(0, 600);
  });
  await pg.waitForTimeout(300);
  await t.swipeBegin(300, 500, +1);
  const mid = await pg.evaluate(() => ({
    search: getComputedStyle(document.querySelector('.tpane[data-pane="managers"] .thead-search')).position,
    th: getComputedStyle(document.querySelector('.tpane[data-pane="managers"] .tleague-full th')).position,
  }));
  checkEq(mid.search, "static", "managers search header static mid-slide");
  checkEq(mid.th, "static", "managers table header static mid-slide");
  await t.swipeFinish(300, 500, +1);
  checkEq(await pg.evaluate(() => document.querySelector("#cr-dash-tabs .tchip.is-on")?.dataset.p), "fundraising", "managers swipe lands on fundraising");
  checkErrs(errs, "credit managers swipe");
  await ctx.close();
}
await b.close(); srv.close();
finish();
