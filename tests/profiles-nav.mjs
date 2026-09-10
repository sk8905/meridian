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

// The AUM focus control is the SAME everywhere: an "AUM focus" label + a
// "$1–15bn" button, sitting in its own .aum-focus bar at the top of the pane
// (identical to the Transactions tab), not inline in the search row.
const focusLbl = await pg.evaluate(() => {
  const read = (id) => { const btn = document.querySelector(id); if (!btn) return { btn: "(missing)" }; const bar = btn.closest(".aum-focus"); return { btn: btn.textContent.trim(), inBar: !!bar, label: bar ? (bar.querySelector(".aum-focus-l") || {}).textContent : "", inSearch: !!btn.closest(".thead-search") }; };
  return { lg: read("#cr-lg-focus"), hf: read("#cr-hf-focus") };
});
checkEq(focusLbl.lg.btn, "$1–15bn", "managers AUM focus toggle reads $1–15bn");
checkEq(focusLbl.hf.btn, "$1–15bn", "hedge-funds AUM focus toggle reads $1–15bn");
check(focusLbl.lg.inBar && focusLbl.lg.label === "AUM focus" && !focusLbl.lg.inSearch, "Managers: the $1–15bn toggle sits in the shared 'AUM focus' bar, not the search row");
check(focusLbl.hf.inBar && focusLbl.hf.label === "AUM focus" && !focusLbl.hf.inSearch, "Hedge Funds: the $1–15bn toggle sits in the shared 'AUM focus' bar, not the search row");
// The Hedge Funds "Cross-holdings" button shares that same AUM-focus line.
const cons = await pg.evaluate(() => { const btn = document.querySelector("#hf-cons-btn"); return { present: !!btn, inBar: !!(btn && btn.closest(".aum-focus")), inSearch: !!(btn && btn.closest(".thead-search")) }; });
check(cons.present && cons.inBar && !cons.inSearch, "Hedge Funds: the Cross-holdings button shares the AUM focus line");

// The Managers / Hedge Funds / Law firms chips carry the active-tab underline
// like the Dashboard/Transactions bars — the chip's marker sits in the header's
// overflow, so the header is lifted into its own stacking level to reveal it.
const chipUL = await pg.evaluate(() => {
  const head = document.querySelector("#pf-list .twire-head");
  const on = document.querySelector("#pf-chips .tchip.is-on");
  // the chips must actually paint on TOP at their own coordinates — the pane
  // sub-header (search + focus toggle) must not cover them (the mobile bug).
  const chips = document.querySelector("#pf-chips"); const r = chips.getBoundingClientRect();
  const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return { pos: head ? getComputedStyle(head).position : "", z: head ? getComputedStyle(head).zIndex : "", shadow: on ? getComputedStyle(on).boxShadow : "", chipsOnTop: !!(hit && hit.closest("#pf-chips")) };
});
check(chipUL.chipsOnTop, "Profiles: the Managers/Hedge Funds/Law firms chips are visible on top, not covered by the pane sub-header");
// The header must be positioned with its own stacking level so the chip's
// underline (in the header's overflow) shows above the pane below — sticky on
// mobile (its designed pin), relative on desktop; either way not static/auto.
check(chipUL.pos !== "static" && chipUL.z !== "auto" && chipUL.z !== "", `Profiles: the chips header is lifted so the active underline shows (pos ${chipUL.pos}, z ${chipUL.z})`);
check(/inset/.test(chipUL.shadow), `Profiles: the active chip carries the 2px underline marker`);

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
  // New model: the list FRAME (tabs + AUM-focus + search) stays put; only the
  // TABLE gives way to the profile, which renders below the search box. The
  // detail's own duplicate section nav is suppressed, and the ‹ back chevron
  // shows in the active pane's search row.
  const after = await pg.evaluate((pane) => {
    const list = document.querySelector("#pf-list");
    const detail = document.querySelector("#pf-detail");
    const activePane = document.querySelector(`.tpane[data-pane="${pane}"]:not([hidden])`);
    const table = activePane && activePane.querySelector(".tleague-wrap");
    const search = activePane && activePane.querySelector(".thead-search");
    const chev = activePane && activePane.querySelector(".pf-back-chev");
    const secnav = detail && detail.querySelector(".tdet-secnav");
    return {
      hash: location.hash,
      listShown: list ? getComputedStyle(list).display !== "none" : false,
      searchShown: search ? getComputedStyle(search).display !== "none" : false,
      tableHidden: table ? getComputedStyle(table).display === "none" : null,
      detailShown: detail ? getComputedStyle(detail).display !== "none" : false,
      chevShown: !!(chev && getComputedStyle(chev).display !== "none"),
      secnavHidden: secnav ? getComputedStyle(secnav).display === "none" : true,
      len: detail ? detail.textContent.trim().length : 0,
    };
  }, pane);
  check(after.hash === box.href, `${kind}: tapping the name routes to ${box.href} (got ${after.hash})`);
  check(after.listShown && after.searchShown, `${kind}: the list frame (tabs + search) stays visible above the profile`);
  check(after.tableHidden === true, `${kind}: the list table gives way to the profile`);
  check(after.detailShown, `${kind}: the profile detail is shown`);
  check(after.chevShown, `${kind}: the ‹ back chevron shows in the search row`);
  check(after.secnavHidden, `${kind}: the detail's duplicate section nav is suppressed`);
  check(after.len > 300, `${kind}: the profile page renders content (${after.len} chars)`);

  // The ‹ chevron in the search row returns to the list (table back, detail gone).
  await pg.evaluate(() => { const b = document.querySelector(".tpane:not([hidden]) .pf-back-chev"); if (b) b.click(); });
  await pg.waitForTimeout(400);
  const backState = await pg.evaluate((pane) => {
    const detail = document.querySelector("#pf-detail");
    const table = document.querySelector(`.tpane[data-pane="${pane}"] .tleague-wrap`);
    return {
      tableShown: table ? getComputedStyle(table).display !== "none" : false,
      detailShown: detail ? getComputedStyle(detail).display !== "none" : true,
    };
  }, pane);
  check(backState.tableShown, `${kind}: Back restores the list table`);
  check(!backState.detailShown, `${kind}: Back hides the profile detail`);
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
const touchShown = await pg.evaluate(() => { const d = document.querySelector("#pf-detail"); return !!(d && !d.hidden && document.querySelector(".pf-detailing")); });
check(!!touchShown, "touch-only: the profile detail is shown after a click-less tap");

checkErrs(errs, "profiles navigation");
await ctx.close();
await b.close(); srv.close();
finish();
