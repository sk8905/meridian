// Header ☆ Watchlist — RETIRED (owner 2026-10-16: "I don't see any useful purpose of this
// star. Get rid of it. Desktop and iPhone."). The header cluster has no star on either
// surface; what it carried lives elsewhere:
//   • Watchlist — Menu ▸ Watchlist, News ▸ Watchlist lane, the bell's Watchlist tab,
//     Profiles ▸ ★ Following;
//   • New since last visit — Menu ▸ New (tests/menu-whatsnew.mjs);
//   • the empty-watchlist suggestions (European managers by recorded deals, active law
//     firms) with a one-tap Follow — moved to Menu ▸ Watchlist's empty state, checked
//     here against the committed data, never a fixture.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";
import * as CR from "../credit/js/data.js";
import * as LG from "../legal/js/data.js";
import { targetFit } from "../credit/js/target.js";

// The expected suggestions, computed independently from the committed data.
const dealsBy = new Map();
for (const d of CR.deals) if (d.managerId) dealsBy.set(d.managerId, (dealsBy.get(d.managerId) || 0) + 1);
const primary = (m) => String(m.hq || "").split("/")[0].trim();
const euMgrs = CR.managers.filter((m) => dealsBy.get(m.id) && primary(m) && targetFit({ hq: primary(m) }, []).europe)
  .sort((a, b) => dealsBy.get(b.id) - dealsBy.get(a.id) || a.name.localeCompare(b.name));
const topMgr = euMgrs[0];

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// ---------------------------------------------------------------- phone (390px)
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
  await pg.waitForSelector("#wire-header .na-actions #na-notif", { timeout: 8000 });
  await pg.waitForTimeout(600);
  const geo = await pg.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect() : null; };
    const btns = [...document.querySelectorAll("#wire-header .na-actions > .na-btn")].filter((x) => x.offsetParent).map((x) => x.id);
    const brand = r("#wire-header .brand"), cluster = r("#wire-header .na-actions"), bar = r("#wire-header .topbar");
    return { btns, star: !!document.querySelector("#na-watch, #na-watch-panel"), gap: cluster && brand ? Math.round(cluster.left - brand.right) : -1, barH: bar ? Math.round(bar.height) : 0, right: cluster ? Math.round(cluster.right) : 0, pageW: document.documentElement.scrollWidth };
  });
  check(!geo.star, "phone: no header ☆ Watchlist button or panel");
  checkEq(geo.btns.join(","), "na-search,na-ask,na-notif,na-menu", "phone header cluster: Search · Ask · Notifications · Menu");
  check(geo.gap >= 24 && geo.right <= 390 && geo.pageW <= 390, `phone: the cluster fits beside the brand on one row (gap ${geo.gap}px, right edge ${geo.right})`);
  check(geo.barH <= 64, `phone: the header stays one row tall (${geo.barH}px)`);

  // Menu ▸ Watchlist, empty → suggestions from committed data, each with a Follow.
  await pg.evaluate(() => { try { localStorage.removeItem("meridian.follows"); } catch {} });
  await pg.goto(base + "/v2/menu/watchlist", { waitUntil: "load" });
  await pg.waitForSelector("#v2-menu-watch .wsug-row", { timeout: 15000 });
  const sug = await pg.evaluate(() => {
    const grp = [...document.querySelectorAll("#v2-menu-watch .watch-grp")];
    const rows = (g) => [...g.querySelectorAll(".wsug-row")].map((r) => ({ nm: r.querySelector(".watch-nm").textContent, sub: r.querySelector(".watch-sub").textContent, f: (r.querySelector("[data-sugg-follow]") || {}).dataset?.suggFollow, btn: (r.querySelector("[data-sugg-follow]") || {}).textContent }));
    return { heads: grp.map((g) => g.querySelector(".watch-grp-h").textContent), mgr: grp[0] ? rows(grp[0]) : [], firm: grp[1] ? rows(grp[1]) : [] };
  });
  check(/European managers/.test(sug.heads[0] || "") && /Law firms/.test(sug.heads[1] || ""), `Menu ▸ Watchlist suggestions are grouped: ${sug.heads.join(" · ")}`);
  check(sug.mgr.length >= 3 && sug.mgr.length <= 6 && sug.firm.length >= 3 && sug.firm.length <= 6, `3–6 suggested managers (${sug.mgr.length}) and law firms (${sug.firm.length})`);
  checkEq(sug.mgr[0] && sug.mgr[0].f, "manager:" + topMgr.id, `the top suggestion is the European manager with the most recorded deals (${topMgr.name})`);
  check(sug.mgr[0] && sug.mgr[0].sub.includes(`${dealsBy.get(topMgr.id)} deals`), `its row shows the real deal tally (${sug.mgr[0] && sug.mgr[0].sub})`);
  const mgrIds = sug.mgr.map((s) => s.f.split(":")[1]);
  const usPrimary = mgrIds.map((id) => CR.managerById[id]).filter((m) => !targetFit({ hq: primary(m) }, []).europe);
  checkEq(usPrimary.length, 0, "every suggested manager has a European PRIMARY HQ (a US house with a London office is not suggested)");
  const firmIds = sug.firm.map((s) => s.f.split(":")[1]);
  check(firmIds.every((id) => LG.firmById[id] && LG.firmById[id].tier !== "chambers"), "suggested law firms are covered firms (no barristers' chambers)");
  check(sug.mgr.concat(sug.firm).every((s) => s.btn === "Follow"), "each suggestion offers a one-tap Follow");

  // One-tap Follow → the shared follow store (meridian.follows) + button state.
  await pg.click(`#v2-menu-watch [data-sugg-follow="manager:${topMgr.id}"]`);
  await pg.waitForFunction((id) => (document.querySelector(`#v2-menu-watch [data-sugg-follow="manager:${id}"]`) || {}).textContent === "Following", topMgr.id, { timeout: 5000 }).catch(() => {});
  const after = await pg.evaluate((id) => ({
    stored: (JSON.parse(localStorage.getItem("meridian.follows") || "{}").manager || []).includes(id),
    btn: document.querySelector(`#v2-menu-watch [data-sugg-follow="manager:${id}"]`).textContent,
    pressed: document.querySelector(`#v2-menu-watch [data-sugg-follow="manager:${id}"]`).getAttribute("aria-pressed"),
  }), topMgr.id);
  check(after.stored && after.btn === "Following" && after.pressed === "true", `Follow writes the shared follow store and flips to Following (${JSON.stringify(after)})`);

  // Revisit → Menu ▸ Watchlist lists the followed manager, linked to its profile.
  await pg.goto(base + "/v2/menu/watchlist", { waitUntil: "load" });
  await pg.waitForFunction(() => document.querySelector("#v2-menu-watch [data-watch-href]"), null, { timeout: 10000 });
  const wl = await pg.evaluate(() => [...document.querySelectorAll("#v2-menu-watch [data-watch-href]")].map((a) => ({ nm: (a.querySelector(".watch-nm") || {}).textContent, href: a.dataset.watchHref })));
  check(wl.length === 1 && wl[0].nm === topMgr.name && /\/v2\/profiles\/#\/manager\//.test(wl[0].href), `Menu ▸ Watchlist lists what you follow, linked to its profile (${JSON.stringify(wl)})`);
  checkErrs(errs, "header / menu watchlist (phone)");
  await ctx.close();
}

// ------------------------------------------------------------------- desktop
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.waitForSelector("#wire-header .na-actions #na-notif", { timeout: 8000 });
  const d = await pg.evaluate(() => ({ btns: [...document.querySelectorAll("#wire-header .na-actions > .na-btn")].filter((x) => x.offsetParent).map((x) => x.id), star: !!document.querySelector("#na-watch, #na-watch-panel") }));
  check(!d.star, "desktop: no header ☆ Watchlist button or panel");
  checkEq(d.btns.join(","), "na-ask,na-notif", "desktop header cluster: Ask · Notifications (Menu keeps its own button)");
  checkErrs(errs, "header (desktop)");
  await ctx.close();
}

await b.close(); srv.close();
finish();
