// Dark-mode header panels (Markets / Notifications) open as a FULL-SCREEN sheet on the
// phone. The dark-mode hairline border that gives the desktop dropdown its coplanar edge
// (premium.css ~L298) has higher specificity than the mobile `border:0`, so without an
// override it re-draws on the phone sheet as grey vertical lines down the far-left/right
// screen edges. This asserts the panels have NO side border and span the full width in
// dark mode on the phone.
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const DARK_PHONE = { ...PHONE, colorScheme: "dark" };
const srv = await serve({
  "/api/markets": () => [200, JSON.stringify({ markets: [{ label: "S&P 500", value: 7824.5, changePct: 0.65 }], movers: [{ label: "Utilities", changePct: 2.44 }] })],
  "/api/notifs": () => [200, JSON.stringify({ items: [] })],
});
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DARK_PHONE, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#na-mkt", { timeout: 8000 });

const edges = async (panelId) => pg.evaluate((id) => {
  const p = document.getElementById(id); if (!p || p.hidden) return null;
  const cs = getComputedStyle(p), r = p.getBoundingClientRect();
  const body = p.querySelector(".na-body"), br = body ? body.getBoundingClientRect() : null;
  return {
    bl: cs.borderLeftWidth, brr: cs.borderRightWidth,
    left: Math.round(r.left), right: Math.round(r.right), vw: window.innerWidth,
    bodyLeft: br ? Math.round(br.left) : null, bodyRight: br ? Math.round(br.right) : null,
  };
}, panelId);

// ---- Markets panel ----
await pg.evaluate(() => document.getElementById("na-mkt").click());
await pg.waitForSelector("#na-mkt-panel .na-chip", { timeout: 8000 });
await pg.waitForTimeout(200);
const m = await edges("na-mkt-panel");
check(m && m.bl === "0px" && m.brr === "0px", `dark phone: the Markets panel has no left/right border (${m && m.bl}/${m && m.brr})`);
check(m && m.left === 0 && m.right === m.vw && m.bodyLeft === 0 && m.bodyRight === m.vw,
  `dark phone: the Markets panel + content span the full width, no edge inset (panel [${m && m.left},${m && m.right}], body [${m && m.bodyLeft},${m && m.bodyRight}], vw ${m && m.vw})`);

// ---- Notifications panel ----
await pg.evaluate(() => document.getElementById("na-notif").click());
await pg.waitForSelector("#na-notif-panel .na-body", { timeout: 8000 });
await pg.waitForTimeout(200);
const n = await edges("na-notif-panel");
check(n && n.bl === "0px" && n.brr === "0px", `dark phone: the Notifications panel has no left/right border (${n && n.bl}/${n && n.brr})`);
check(n && n.left === 0 && n.right === n.vw && n.bodyLeft === 0 && n.bodyRight === n.vw,
  `dark phone: the Notifications panel + content span the full width, no edge inset (panel [${n && n.left},${n && n.right}], body [${n && n.bodyLeft},${n && n.bodyRight}])`);

checkErrs(errs, "panel edge border");
await ctx.close();
await b.close();
srv.close();
finish();
