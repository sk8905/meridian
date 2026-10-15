// Header ▸ Watchlist (R2): a star button in the header cluster (phone + desktop) opens
// ONE panel with two tabs — "New since last visit" (whatsnew.js: records that arrived
// since this device last marked them seen) and "Watchlist" (the meridian.follows
// store ∪ /api/watchlist). The button carries a COUNT badge of new records. An empty
// watchlist offers suggested European managers (most recorded deals, by PRIMARY HQ)
// and the most active law firms (legal alerts in the last 12 months) with a one-tap
// Follow through the shared follow store. Everything is checked against the
// committed data, never a fixture.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";
import { deals as HD_DEALS, items as HD_ITEMS } from "../home-data.js";
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
  await pg.waitForSelector("#na-watch", { timeout: 8000 });
  await pg.waitForTimeout(600);
  const geo = await pg.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect() : null; };
    const btns = [...document.querySelectorAll("#wire-header .na-actions > .na-btn")].filter((x) => x.offsetParent).map((x) => x.id);
    const brand = r("#wire-header .brand"), cluster = r("#wire-header .na-actions"), bar = r("#wire-header .topbar");
    return { btns, gap: cluster && brand ? Math.round(cluster.left - brand.right) : -1, barH: bar ? Math.round(bar.height) : 0, right: cluster ? Math.round(cluster.right) : 0, pageW: document.documentElement.scrollWidth };
  });
  checkEq(geo.btns.join(","), "na-search,na-ask,na-watch,na-notif,na-menu", "phone header cluster: Search · Ask · Watchlist · Notifications · Menu");
  check(geo.gap >= 24 && geo.right <= 390 && geo.pageW <= 390, `phone: the cluster fits beside the brand on one row (gap ${geo.gap}px, right edge ${geo.right})`);
  check(geo.barH <= 64, `phone: the header stays one row tall (${geo.barH}px)`);

  // First open → New tab sets the starting point (nothing listed as new yet).
  await pg.click("#na-watch");
  await pg.waitForSelector("#na-watch-panel:not([hidden]) .na-chip", { timeout: 8000 });
  const chips = await pg.evaluate(() => [...document.querySelectorAll("#na-watch-panel .na-chip")].map((c) => c.textContent.trim()));
  checkEq(chips.join("|"), "New since last visit|Watchlist", "panel tabs: New since last visit · Watchlist");
  await pg.waitForFunction(() => { const t = document.querySelector("#na-watch-panel .na-watch-body"); return t && !t.querySelector(".watch-loading"); }, null, { timeout: 8000 });
  check(/starting point/i.test(await pg.textContent("#na-watch-panel .na-watch-body")), "first open of New sets the starting point (not the whole database)");

  // Empty watchlist → suggestions from committed data, each with a Follow.
  await pg.click('#na-watch-panel .na-chip[data-wk="watch"]');
  await pg.waitForSelector("#na-watch-panel .wsug-row", { timeout: 15000 });
  const sug = await pg.evaluate(() => {
    const grp = [...document.querySelectorAll("#na-watch-panel .watch-grp")];
    const rows = (g) => [...g.querySelectorAll(".wsug-row")].map((r) => ({ nm: r.querySelector(".watch-nm").textContent, sub: r.querySelector(".watch-sub").textContent, f: (r.querySelector("[data-sugg-follow]") || {}).dataset?.suggFollow, btn: (r.querySelector(".wsug-follow") || {}).textContent }));
    return { heads: grp.map((g) => g.querySelector(".watch-grp-h").textContent), mgr: grp[0] ? rows(grp[0]) : [], firm: grp[1] ? rows(grp[1]) : [] };
  });
  check(/European managers/.test(sug.heads[0] || "") && /Law firms/.test(sug.heads[1] || ""), `suggestions are grouped: ${sug.heads.join(" · ")}`);
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
  await pg.click(`#na-watch-panel [data-sugg-follow="manager:${topMgr.id}"]`);
  await pg.waitForTimeout(200);
  const after = await pg.evaluate((id) => ({
    stored: (JSON.parse(localStorage.getItem("meridian.follows") || "{}").manager || []).includes(id),
    btn: document.querySelector(`#na-watch-panel [data-sugg-follow="manager:${id}"]`).textContent,
    pressed: document.querySelector(`#na-watch-panel [data-sugg-follow="manager:${id}"]`).getAttribute("aria-pressed"),
  }), topMgr.id);
  check(after.stored && after.btn === "Following" && after.pressed === "true", `Follow writes the shared follow store and flips to Following (${JSON.stringify(after)})`);

  // Close + reopen → the Watchlist tab now lists the followed manager (the follow store).
  await pg.keyboard.press("Escape");
  await pg.waitForTimeout(150);
  await pg.click("#na-watch");
  await pg.waitForSelector("#na-watch-panel:not([hidden])", { timeout: 5000 });
  await pg.click('#na-watch-panel .na-chip[data-wk="watch"]');
  await pg.waitForFunction(() => { const t = document.querySelector("#na-watch-panel .na-watch-body"); return t && t.querySelector("a.watch-row"); }, null, { timeout: 10000 });
  const wl = await pg.evaluate(() => [...document.querySelectorAll("#na-watch-panel a.watch-row")].map((a) => ({ nm: a.querySelector(".watch-nm").textContent, href: a.getAttribute("href") })));
  check(wl.length === 1 && wl[0].nm === topMgr.name && wl[0].href === "/v2/profiles/#/manager/" + topMgr.id, `the Watchlist tab lists what you follow, linked to its profile (${JSON.stringify(wl)})`);
  // A row opens the profile in-app and closes the panel.
  await pg.click("#na-watch-panel a.watch-row");
  await pg.waitForTimeout(900);
  const nav = await pg.evaluate(() => ({ path: location.pathname + location.hash, open: !document.querySelector("#na-watch-panel").hidden }));
  check(/\/v2\/profiles\/#\/manager\//.test(nav.path) && !nav.open, `a watchlist row opens the profile in-app and closes the panel (${nav.path})`);

  // Simulate 2 deals + 1 legal alert arriving after the snapshot → the COUNT badge.
  const goneDeals = [HD_DEALS[0].id, HD_DEALS[HD_DEALS.length - 1].id], goneLegal = HD_ITEMS[0].id;
  await pg.evaluate(({ goneDeals, goneLegal }) => {
    const s = JSON.parse(localStorage.getItem("wire.whatsnew.v1"));
    s.deals = s.deals.filter((id) => !goneDeals.includes(id)); s.legal = s.legal.filter((id) => id !== goneLegal);
    localStorage.setItem("wire.whatsnew.v1", JSON.stringify(s));
  }, { goneDeals, goneLegal });
  await pg.goto(base + "/v2/", { waitUntil: "load" });
  await pg.waitForFunction(() => { const c = document.querySelector("#na-watch .na-count"); return c && !c.hidden; }, null, { timeout: 10000 });
  const badge = await pg.evaluate(() => { const c = document.querySelector("#na-watch .na-count"), r = c.getBoundingClientRect(), bt = c.closest(".na-btn").getBoundingClientRect(); return { n: c.textContent, inside: r.right <= bt.right + 1 && r.top >= bt.top - 1, label: c.closest(".na-btn").getAttribute("aria-label") }; });
  checkEq(badge.n, "3", "the header badge counts the records new since the last visit");
  check(badge.inside && /3 new/.test(badge.label), `the badge sits on the star and is announced (${badge.label})`);
  await pg.click("#na-watch");
  await pg.waitForFunction(() => /3 new since/.test((document.querySelector("#na-watch-panel .na-watch-body") || {}).textContent || ""), null, { timeout: 10000 });
  check(await pg.evaluate(() => document.querySelector('#na-watch-panel .na-chip[data-wk="new"]').classList.contains("is-on")), "with new records the panel opens on the New tab");
  const txt = await pg.textContent("#na-watch-panel .na-watch-body");
  check(/Transactions\s*2/.test(txt) && /Law-firm alerts\s*1/.test(txt), "New groups the arrivals by kind (Deals 2 · Law-firm alerts 1) — the same whatsnew.js as Menu ▸ New");
  await pg.click("#na-watch-panel [data-wn-seen]");
  await pg.waitForFunction(() => /Nothing new since/.test((document.querySelector("#na-watch-panel .na-watch-body") || {}).textContent || ""), null, { timeout: 8000 });
  check(await pg.evaluate(() => document.querySelector("#na-watch .na-count").hidden), "'Mark all as seen' re-baselines and clears the badge");

  for (const theme of ["light", "dark"]) {
    await pg.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
    const c = await pg.evaluate(() => { const p = document.querySelector("#na-watch-panel"); return { bg: getComputedStyle(p).backgroundColor, fg: getComputedStyle(p.querySelector(".na-chip.is-on")).color }; });
    check(c.bg !== "rgba(0, 0, 0, 0)" && c.bg !== c.fg, `${theme}: the panel paints an opaque ground with legible chips (${c.bg} / ${c.fg})`);
  }
  checkErrs(errs, "header watchlist (phone)");
  await ctx.close();
}

// ------------------------------------------------------------------- desktop
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.waitForSelector("#na-watch", { timeout: 8000 });
  const btns = await pg.evaluate(() => [...document.querySelectorAll("#wire-header .na-actions > .na-btn")].filter((x) => x.offsetParent).map((x) => x.id));
  checkEq(btns.join(","), "na-ask,na-watch,na-notif", "desktop header cluster: Ask · Watchlist · Notifications (Menu keeps its own button)");
  await pg.click("#na-watch");
  await pg.waitForSelector("#na-watch-panel:not([hidden]) .na-watch-body", { timeout: 5000 });
  const box = await pg.evaluate(() => { const r = document.querySelector("#na-watch-panel").getBoundingClientRect(); return { w: Math.round(r.width), l: Math.round(r.left) }; });
  check(box.w >= 400 && box.w <= 600 && box.l > 0, `desktop: the panel is the shared centred modal (${box.w}px wide)`);
  checkErrs(errs, "header watchlist (desktop)");
  await ctx.close();
}

await b.close(); srv.close();
finish();
