// Navigation you can trust (UX review A1–A12, B5, B8, B10, C1, C2, C6): Back returns
// to the exact previous state on iPhone too, lists keep their scroll, a bottom-tab
// switch keeps each section where you left it, in-app links never reload the
// document, a profile's sub-tab lives in the URL, and Transactions' filters filter.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const H13F = { asOf: "2026-06-30", source: "https://www.sec.gov/x", holdings: [{ name: "Apple Inc", ticker: "AAPL", cusip: "037833100", value: 1e9, shares: 1e6, weight: 0.1 }] };
const srv = await serve({
  "/api/13f": () => [200, JSON.stringify(H13F)],
  "/api/filings": () => [200, JSON.stringify({ filings: [] })],
  "/api/perf": () => [200, JSON.stringify({ perf: {} })],
});
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const rows = (pg) => pg.evaluate(() => document.querySelectorAll("#tx-body tr.tx-row").length);
const marker = (pg) => pg.evaluate(() => window.__navMarker === 1);
const setMarker = (pg) => pg.evaluate(() => { window.__navMarker = 1; });

// ---- 1) Transactions: the period / size filters filter the default "All" list ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/transactions/");
  await pg.waitForSelector("#tx-body tr.tx-row", { timeout: 8000 });
  const all = await rows(pg);
  await pg.selectOption("#tx-min", "500"); await pg.waitForTimeout(200);
  const chipN = await pg.evaluate(() => +((document.querySelector('#tx-mode [data-sub=""] .tx-subn') || {}).textContent || 0));
  const big = await rows(pg);
  check(big < all && big === chipN, `≥$500m narrows the All list to the All count (${big} rows, chip ${chipN}, of ${all})`);
  await pg.selectOption("#tx-period", "30d"); await pg.waitForTimeout(200);
  const recent = await rows(pg);
  check(recent <= big, `a date range narrows it further (${recent} ≤ ${big})`);
  // C2: a reset (re-tap the active Transactions tab) leaves every control showing its default
  await pg.locator("#tx-focus").click(); await pg.fill("#tx-q", "ares"); await pg.waitForTimeout(150);
  await pg.locator('[data-key="transactions"]').filter({ visible: true }).first().click(); await pg.waitForTimeout(300);
  const ui = await pg.evaluate(() => ({ p: document.querySelector("#tx-period").value, m: document.querySelector("#tx-min").value, f: document.querySelector("#tx-focus").getAttribute("aria-pressed"), q: document.querySelector("#tx-q").value, n: document.querySelectorAll("#tx-body tr.tx-row").length }));
  check(ui.p === "all" && ui.m === "0" && ui.f === "false" && ui.q === "" && ui.n === all, `re-tapping Transactions resets the filters AND their controls (${JSON.stringify(ui)})`);
  checkErrs(errs, "transactions filters");
  await ctx.close();
}

// ---- 2) iPhone: Transactions (filtered) → a lender's profile → Back → the same list ----
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/transactions/");
  await pg.waitForSelector("#tx-body tr.tx-row", { timeout: 8000 });
  await pg.selectOption("#tx-min", "500"); await pg.waitForTimeout(200);
  const before = await rows(pg);
  await setMarker(pg);
  await pg.evaluate(() => document.querySelector("#tx-body a.tx-mgr").click());
  await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 8000 });
  check(/\/v2\/profiles\/#\/manager\//.test(await pg.evaluate(() => location.pathname + location.hash)), "phone: the lender opens its manager profile");
  await pg.goBack(); await pg.waitForTimeout(500);
  const after = await pg.evaluate(() => ({ path: location.pathname, tab: document.documentElement.dataset.v2tab, min: document.querySelector("#tx-min").value, n: document.querySelectorAll("#tx-body tr.tx-row").length }));
  check(after.path === "/v2/transactions/" && after.tab === "transactions", `phone: Back returns to Transactions, not out of the app (${after.path})`);
  check(after.min === "500" && after.n === before, `phone: …with the filter still applied (${after.n}/${before})`);
  check(await marker(pg), "phone: the round trip never reloaded the document");
  checkErrs(errs, "phone back-stack");
  await ctx.close();
}

// ---- 3) iPhone: list scroll is restored on Back; a tab switch keeps the open profile ----
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/profiles/");
  await pg.waitForSelector("#mgr-rows tr", { timeout: 8000 });
  await pg.waitForTimeout(1500);   // let the boot-time scroll settle before scrolling the list
  await pg.evaluate(() => window.scrollTo({ top: 2500, behavior: "instant" })); await pg.waitForTimeout(150);
  const y0 = await pg.evaluate(() => window.scrollY);
  check(y0 > 2000, `setup: the Managers list is scrolled deep (${y0})`);
  const row = await pg.evaluate(() => { const r = [...document.querySelectorAll("#pf-panes #mgr-rows tr")].find((t) => t.getBoundingClientRect().top > 120); r.click(); return r.dataset.href; });
  await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 8000 });
  await pg.goBack(); await pg.waitForTimeout(500);
  const y1 = await pg.evaluate(() => window.scrollY);
  check(Math.abs(y1 - y0) <= 40, `phone: Back to the Managers list restores its scroll (${y1} vs ${y0}, opened ${row})`);
  // Open a profile, switch to Home, come back via the Profiles tab → still on that profile.
  await pg.evaluate(() => { location.hash = "#/manager/m21"; }); await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 8000 });
  await pg.locator('.mtab[data-key="home"]').click(); await pg.waitForTimeout(400);
  await pg.locator('.mtab[data-key="profiles"]').click(); await pg.waitForTimeout(400);
  const st = await pg.evaluate(() => ({ hash: location.hash, open: !!document.querySelector(".pf-detailing #pf-detail .tdet-id") }));
  check(st.open && /manager\/m21/.test(st.hash), `phone: switching tabs and back keeps the open profile (${st.hash})`);
  checkErrs(errs, "phone list scroll + tab memory");
  await ctx.close();
}

// ---- 4) In-app links never reload; ⌘K opens search; profile sub-tab in the URL ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/profiles/");
  await pg.waitForSelector("#mgr-rows tr", { timeout: 8000 });
  await setMarker(pg);
  await pg.keyboard.press("Control+k");
  await pg.waitForSelector(".mcmdk.open, .open .mcmdk-input, .mcmdk-input:focus", { timeout: 5000 }).catch(() => {});
  const opened = await pg.evaluate(() => { const i = document.querySelector(".mcmdk-input"); return !!i && document.activeElement === i; });
  check(opened, "Ctrl/⌘-K opens the search palette");
  await pg.keyboard.type("Ares Management"); await pg.waitForTimeout(400);
  await pg.locator(".mcmdk-row").first().click(); await pg.waitForTimeout(600);
  check(/#\/manager\/m20/.test(await pg.evaluate(() => location.hash)) && await marker(pg), "a search result opens in-app (no document reload)");
  // Sub-tab → URL → survives reload
  await pg.locator('#pf-detail #mgr-tabs .tchip[data-p="investments"]').click(); await pg.waitForTimeout(150);
  check(/#\/manager\/m20\/investments$/.test(await pg.evaluate(() => location.hash)), "a profile sub-tab is recorded in the URL");
  await pg.reload(); await pg.waitForSelector("#pf-detail #mgr-tabs", { timeout: 8000 });
  check(await pg.evaluate(() => (document.querySelector("#pf-detail #mgr-tabs .tchip.is-on") || {}).dataset.p === "investments"), "…and survives a reload");
  // A7: a fund row expands in place — no navigation, no history entry
  await pg.goto(base + "/v2/profiles/#/manager/m21/vehicles"); await pg.waitForSelector("#pf-detail li.fund-exp", { timeout: 8000 });
  const h0 = await pg.evaluate(() => history.length);
  await pg.locator("#pf-detail li.fund-exp").first().click(); await pg.waitForTimeout(150);
  const f = await pg.evaluate(() => ({ h: history.length, hash: location.hash, open: !document.querySelector("#pf-detail li.fund-exp .fund-body").hidden, txt: document.querySelector("#pf-detail li.fund-exp .fund-body").textContent.length }));
  check(f.open && f.txt > 20 && f.h === h0 && /m21\/vehicles$/.test(f.hash), `a fund row expands to its facts in place (no navigation, ${f.txt} chars)`);
  // A10: a plain ?tab= query selects that list
  await pg.goto(base + "/v2/profiles/?tab=hedgefunds"); await pg.waitForTimeout(800);
  check(await pg.evaluate(() => (document.querySelector("#pf-chips .tchip.is-on") || {}).dataset.p === "hedgefunds"), "/v2/profiles/?tab=hedgefunds opens the Hedge Funds list");
  checkErrs(errs, "in-app links + URL tabs");
  await ctx.close();
}

// ---- 5) Hedge funds (13F period, default tab) · Investors (Mentioned in) ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/profiles/#/hf/h2/holdings");
  await pg.waitForSelector("#hf-holdings table", { timeout: 8000 });
  check(/2026-06-30/.test(await pg.evaluate(() => (document.querySelector("#hf-asof") || {}).textContent || "")), "Holdings shows the 13F reporting period");
  const noNews = await pg.evaluate(async () => {
    const D = await import("/credit/js/data.js");
    const has = new Set((D.HEDGE_INTEL || []).map((h) => h.hfId));
    const f = D.HEDGE_FUNDS.find((x) => x.cik && !has.has(x.id)); return f && f.id;
  });
  if (noNews) {
    await pg.goto(base + `/v2/profiles/#/hf/${noNews}`); await pg.waitForTimeout(900);
    check(await pg.evaluate(() => (document.querySelector("#pf-detail #hf-tabs .tchip.is-on") || {}).dataset.p === "holdings"), `a hedge fund with no tracked news opens on Holdings (${noNews})`);
  }
  await pg.goto(base + "/v2/profiles/#/lp/l1"); await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 8000 });
  const lp = await pg.evaluate(() => ({ txt: document.querySelector("#pf-detail").innerText, mentions: document.querySelectorAll("#lp-mentions li").length }));
  check(/Mentioned in/.test(lp.txt) && lp.mentions > 0 && !/Matching funds/.test(lp.txt), `an investor lists the deals that name it, and no fund-matching panel (${lp.mentions})`);
  checkErrs(errs, "hf + lp");
  await ctx.close();
}

// ---- 6) What's new deep-links to the item; legacy fund follows resolve ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/menu/");
  const r = await pg.evaluate(async () => {
    const [W, d, S, D] = await Promise.all([import("/v2/js/whatsnew.js"), import("/home-data.js"), import("/saved.js"), import("/credit/js/data.js")]);
    const snap = { deals: [], intel: [], hedge: [], legal: [], cases: [], rx: [], at: Date.now() - 864e5 };
    const html = W.whatsNewHTML(d, snap);
    const div = document.createElement("div"); div.innerHTML = html;
    const dealHref = [...div.querySelectorAll("a.watch-row")].map((a) => a.getAttribute("href")).find((h) => /#\/manager\/.+\?focus=/.test(h));
    const deadLinks = [...div.querySelectorAll('a.watch-row[href="#"], a.watch-row[href=""]')].length;
    const fund = D.funds.find((f) => f.managerId);
    localStorage.setItem("meridian.follows", JSON.stringify({ fund: [fund.id] }));
    const res = S.resolveFollows();
    return { dealHref, deadLinks, legacy: res.some((x) => x.id === fund.managerId) };
  });
  check(!!r.dealHref, `What's new opens a deal focused on its row (${r.dealHref})`);
  check(r.deadLinks === 0, "What's new renders no dead (#) links");
  check(r.legacy, "a legacy fund follow resolves to its manager in the watchlist");
  checkErrs(errs, "what's new + follows");
  await ctx.close();
}

await b.close(); srv.close();
finish();
