// Profiles tab: tapping a Manager / Hedge Fund / Law firm row navigates to that
// entity's profile detail (rendered inside Profiles). This is the safety net for
// the recurring "tapping a name doesn't open the profile" report — no other spec
// clicks a profiles-list row. Exercised with REAL touch (CDP) on a phone, since
// the bug is iOS-tap-shaped.
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
await pg.waitForTimeout(1500);

const cdp = await ctx.newCDPSession(pg);
const tapAt = async (x, y) => {
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
};

// Real-touch the Profiles bottom tab.
const tb = await pg.evaluate(() => { const t = document.querySelector('.mobile-tabbar .mtab[data-key="profiles"]'); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
await tapAt(tb.x, tb.y);
await pg.waitForTimeout(1500);
checkEq(await pg.evaluate(() => document.documentElement.dataset.v2tab), "profiles", "Profiles tab is active after tapping it");

// The Managers / Hedge Funds AUM "target focus" toggle band is $1–15bn.
const focusLbl = await pg.evaluate(() => {
  const hf = document.querySelector("#cr-hf-focus"); const lg = document.querySelector("#cr-lg-focus");
  return { hf: hf ? hf.textContent.trim() : "(missing)", lg: lg ? lg.textContent.trim() : "(missing)" };
});
checkEq(focusLbl.lg, "$1–15bn", "managers AUM focus toggle reads $1–15bn");
checkEq(focusLbl.hf, "$1–15bn", "hedge-funds AUM focus toggle reads $1–15bn");

async function tapRow(pane, kind, hrefRe) {
  await pg.evaluate(() => { location.hash = ""; });
  await pg.waitForTimeout(200);
  // Select the pane + scroll the row into view FIRST, then let layout settle
  // before reading its box — reading the rect in the same tick as scrollIntoView
  // can hand back a pre-scroll position, so the pixel tap lands off the row (the
  // occasional first-tap flake). Two steps: scroll, settle, then measure + tap.
  const href0 = await pg.evaluate((pane) => {
    const chip = document.querySelector(`#pf-chips .tchip[data-p="${pane}"]`); if (chip) chip.click();
    const row = document.querySelector(`.tpane[data-pane="${pane}"] tr[data-href]`);
    if (!row) return null;
    row.scrollIntoView({ block: "center" });
    return row.getAttribute("data-href");
  }, pane);
  await pg.waitForTimeout(250);
  const box = href0 == null ? null : await pg.evaluate((pane) => {
    const row = document.querySelector(`.tpane[data-pane="${pane}"] tr[data-href]`);
    if (!row) return null;
    const r = row.getBoundingClientRect();
    return { x: r.x + Math.min(60, r.width / 2), y: r.y + r.height / 2, href: row.getAttribute("data-href") };
  }, pane);
  check(!!box, `${kind}: a row is present to tap`);
  if (!box) return;
  check(hrefRe.test(box.href || ""), `${kind}: row targets a ${kind} profile (${box.href})`);
  await tapAt(box.x, box.y);
  await pg.waitForTimeout(800);
  // Assert VISUAL state (computed display), not just the .hidden property: the
  // list carries .tdash{display:flex}, whose author specificity beat the UA
  // [hidden] rule, so the profile opened BELOW the still-visible list. .hidden
  // was true yet the list stayed on screen — the property check missed it.
  const after = await pg.evaluate(() => {
    const list = document.querySelector("#pf-list");
    const detail = document.querySelector("#pf-detail");
    const back = document.querySelector("#pf-back-bar");
    return {
      hash: location.hash,
      listDisplay: list ? getComputedStyle(list).display : null,
      detailDisplay: detail ? getComputedStyle(detail).display : null,
      backShown: !!(back && getComputedStyle(back).display !== "none"),
      len: detail ? detail.textContent.trim().length : 0,
    };
  });
  check(after.hash === box.href, `${kind}: tapping the name routes to ${box.href} (got ${after.hash})`);
  check(after.listDisplay === "none", `${kind}: the list is VISUALLY hidden — profile opens as its own page (list display=${after.listDisplay})`);
  check(after.detailDisplay !== "none", `${kind}: the profile detail is shown (display=${after.detailDisplay})`);
  check(after.backShown, `${kind}: a Back-to-list button is shown on the profile`);
  check(after.len > 300, `${kind}: the profile page renders content (${after.len} chars)`);

  // The Back button returns to the list (list visible again, detail gone).
  await pg.evaluate(() => { const b = document.querySelector("#pf-back"); if (b) b.click(); });
  await pg.waitForTimeout(400);
  const backState = await pg.evaluate(() => {
    const list = document.querySelector("#pf-list");
    const detail = document.querySelector("#pf-detail");
    return { listDisplay: list ? getComputedStyle(list).display : null, detailDisplay: detail ? getComputedStyle(detail).display : null };
  });
  check(backState.listDisplay !== "none", `${kind}: Back returns to the visible list (list display=${backState.listDisplay})`);
  check(backState.detailDisplay === "none", `${kind}: Back hides the profile detail`);
}

await tapRow("managers", "manager", /^#\/manager\//);
await tapRow("hedgefunds", "hedge fund", /^#\/hf\//);
await tapRow("firms", "law firm", /^#\/firm\//);

// The iOS-shaped case: a genuine touch tap on a plain <tr data-href> row that
// fires NO `click` (iOS won't synthesise one for a non-interactive element).
// CDP's dispatchTouchEvent above ALSO generates a click, so it can't prove the
// touch handler works on its own — here we fire raw TouchEvents with no click
// and assert the row still navigates. This is the guard for "tapping a name
// does nothing on iPhone".
const touchNav = await pg.evaluate(() => {
  const chip = document.querySelector('#pf-chips .tchip[data-p="managers"]'); if (chip) chip.click();
  location.hash = "";
  const row = document.querySelector('.tpane[data-pane="managers"] tr[data-href]');
  if (!row) return { ok: false, why: "no row" };
  const r = row.getBoundingClientRect();
  const x = r.x + Math.min(60, r.width / 2), y = r.y + r.height / 2;
  const cell = row.querySelector("td") || row;              // tap the plain name cell, as a user would
  const touch = new Touch({ identifier: 1, target: cell, clientX: x, clientY: y });
  cell.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, cancelable: true, changedTouches: [touch] }));
  cell.dispatchEvent(new TouchEvent("touchend", { bubbles: true, cancelable: true, changedTouches: [touch] }));
  return { ok: true, href: row.getAttribute("data-href"), hash: location.hash };
});
check(touchNav.ok, `touch-only: a manager row is present (${touchNav.why || "ok"})`);
if (touchNav.ok) check(touchNav.hash === touchNav.href, `touch-only (no click) tap navigates to ${touchNav.href} (got ${touchNav.hash})`);
const touchShown = await pg.evaluate(() => document.querySelector("#pf-detail") && !document.querySelector("#pf-detail").hidden && document.querySelector("#pf-list").hidden);
check(!!touchShown, "touch-only: the profile detail is shown after a click-less tap");

checkErrs(errs, "profiles navigation");
await ctx.close();
await b.close(); srv.close();
finish();
