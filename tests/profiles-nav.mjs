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

async function tapRow(pane, kind, hrefRe) {
  await pg.evaluate(() => { location.hash = ""; });
  await pg.waitForTimeout(150);
  const box = await pg.evaluate((pane) => {
    const chip = document.querySelector(`#pf-chips .tchip[data-p="${pane}"]`); if (chip) chip.click();
    const row = document.querySelector(`.tpane[data-pane="${pane}"] tr[data-href]`);
    if (!row) return null;
    row.scrollIntoView({ block: "center" });
    const r = row.getBoundingClientRect();
    return { x: r.x + Math.min(60, r.width / 2), y: r.y + r.height / 2, href: row.getAttribute("data-href") };
  }, pane);
  check(!!box, `${kind}: a row is present to tap`);
  if (!box) return;
  check(hrefRe.test(box.href || ""), `${kind}: row targets a ${kind} profile (${box.href})`);
  await tapAt(box.x, box.y);
  await pg.waitForTimeout(800);
  const after = await pg.evaluate(() => ({
    hash: location.hash,
    detailShown: document.querySelector("#pf-detail") && !document.querySelector("#pf-detail").hidden,
    listHidden: document.querySelector("#pf-list") && document.querySelector("#pf-list").hidden,
    len: document.querySelector("#pf-detail") ? document.querySelector("#pf-detail").textContent.trim().length : 0,
  }));
  check(after.hash === box.href, `${kind}: tapping the name routes to ${box.href} (got ${after.hash})`);
  check(after.detailShown && after.listHidden, `${kind}: the profile detail is shown (list hidden)`);
  check(after.len > 300, `${kind}: the profile page renders content (${after.len} chars)`);
}

await tapRow("managers", "manager", /^#\/manager\//);
await tapRow("hedgefunds", "hedge fund", /^#\/hf\//);
await tapRow("firms", "law firm", /^#\/firm\//);

checkErrs(errs, "profiles navigation");
await ctx.close();
await b.close(); srv.close();
finish();
