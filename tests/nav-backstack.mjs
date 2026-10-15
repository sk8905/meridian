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
const rows = (pg) => pg.evaluate(() => document.querySelectorAll("#tx-body [data-deal]").length);
const marker = (pg) => pg.evaluate(() => window.__navMarker === 1);
const setMarker = (pg) => pg.evaluate(() => { window.__navMarker = 1; });

// ---- 1) Transactions: the size / date facets filter the default "All" list ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/transactions/");
  await pg.waitForSelector("#tx-body [data-deal]", { timeout: 8000 });
  const all = await rows(pg);
  await pg.click("#tx-filters"); await pg.waitForTimeout(120);
  await pg.locator('#tx-sheet [data-facet="size"][data-v="500to1bn"]').click(); await pg.waitForTimeout(150);
  await pg.locator('#tx-sheet [data-facet="size"][data-v="gt1bn"]').click(); await pg.waitForTimeout(150);
  const chipN = await pg.evaluate(() => +((document.querySelector("#tx-stats b") || {}).textContent || 0));
  const big = await rows(pg);
  check(big < all && big === chipN, `≥$500m narrows the All list to the All count (${big} rows, chip ${chipN}, of ${all})`);
  await pg.selectOption("#tx-date", "30d"); await pg.waitForTimeout(150);
  const recent = await rows(pg);
  check(recent <= big, `a date range narrows it further (${recent} ≤ ${big})`);
  // C2: a reset (re-tap the active Transactions tab) leaves every control showing its default
  await pg.locator("#tx-focus").click(); await pg.fill("#tx-q", "ares"); await pg.waitForTimeout(150);
  await pg.locator('[data-key="transactions"]').filter({ visible: true }).first().click(); await pg.waitForTimeout(300);
  const ui = await pg.evaluate(() => ({ h: location.hash, pills: !document.querySelector("#tx-active").hidden, sheet: !document.querySelector("#tx-sheet").hidden, btn: document.querySelector("#tx-filters .tx-fn").textContent, f: document.querySelector("#tx-focus").getAttribute("aria-pressed"), q: document.querySelector("#tx-q").value, n: document.querySelectorAll("#tx-body [data-deal]").length }));
  check(ui.h === "#/lending" && !ui.pills && !ui.sheet && ui.btn === "" && ui.f === "false" && ui.q === "" && ui.n === all, `re-tapping Transactions resets the filters AND their controls (${JSON.stringify(ui)})`);
  checkErrs(errs, "transactions filters");
  await ctx.close();
}

// ---- 2) iPhone: Transactions (filtered) → a lender's profile → Back → the same list ----
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/transactions/");
  await pg.waitForSelector("#tx-body [data-deal]", { timeout: 8000 });
  await pg.evaluate(() => { location.hash = "#/lending?size=500to1bn,gt1bn"; }); await pg.waitForTimeout(250);
  const before = await rows(pg);
  await setMarker(pg);
  await pg.evaluate(() => document.querySelector("#tx-body a.tx-mgr").click());
  await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 8000 });
  check(/\/v2\/profiles\/#\/manager\//.test(await pg.evaluate(() => location.pathname + location.hash)), "phone: the lender opens its manager profile");
  await pg.goBack(); await pg.waitForTimeout(500);
  const after = await pg.evaluate(() => ({ path: location.pathname, tab: document.documentElement.dataset.v2tab, h: location.hash, n: document.querySelectorAll("#tx-body [data-deal]").length }));
  check(after.path === "/v2/transactions/" && after.tab === "transactions", `phone: Back returns to Transactions, not out of the app (${after.path})`);
  check(/size=500to1bn,gt1bn/.test(after.h) && after.n === before, `phone: …with the filter still applied (${after.n}/${before})`);
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
  // Wait for the list chips to render rather than a fixed 800ms (flaky under the parallel suite).
  await pg.goto(base + "/v2/profiles/?tab=hedgefunds");
  const hfOn = await pg.waitForFunction(() => { const c = document.querySelector("#pf-chips .tchip.is-on"); return c && c.dataset.p === "hedgefunds"; }, null, { timeout: 10000 }).then(() => true).catch(() => false);
  check(hfOn, "/v2/profiles/?tab=hedgefunds opens the Hedge Funds list");
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

// ---- 6b) Profiles ▸ ★ Following narrows a list to followed names; the reader offers
// the hop from a Watchlist / manager-wire story to the profile it is about ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/profiles/");
  await pg.evaluate(() => localStorage.setItem("meridian.follows", JSON.stringify({ manager: ["m20", "m21"] })));
  await pg.reload(); await pg.waitForSelector("#pf-panes #mgr-rows tr", { timeout: 8000 });
  // ★ Following lives in the Filters panel (Show & sort, under More filters).
  const follow = async () => {
    await pg.locator('#pf-panes .tpane[data-pane="managers"] .pf-filter-btn').click(); await pg.waitForTimeout(100);
    if (!(await pg.locator('#pf-panes [data-pfstate="follow"]').count())) { await pg.locator('#pf-panes [data-pfmore]').click(); await pg.waitForTimeout(100); }
    await pg.locator('#pf-panes [data-pfstate="follow"]').click(); await pg.waitForTimeout(100);
    await pg.locator('#pf-panes .pf-sheet-done').click(); await pg.waitForTimeout(100);
  };
  await follow();
  const vis = await pg.evaluate(() => [...document.querySelectorAll("#pf-panes #mgr-rows tr")].filter((r) => r.style.display !== "none").map((r) => r.dataset.href));
  check(vis.length === 2 && vis.includes("#/manager/m20") && vis.includes("#/manager/m21"), `★ Following shows only the followed managers (${vis.join(", ")})`);
  await pg.fill("#pf-panes #mgr-q", "ares"); await pg.waitForTimeout(150);
  const vis2 = await pg.evaluate(() => [...document.querySelectorAll("#pf-panes #mgr-rows tr")].filter((r) => r.style.display !== "none").map((r) => r.dataset.href));
  check(vis2.length === 1 && vis2[0] === "#/manager/m20", `…and combines with the search box (${vis2.join(", ")})`);
  // Sortable list columns: Group AUM descending puts the largest first; again → ascending.
  await pg.fill("#pf-panes #mgr-q", ""); await follow();
  const th = pg.locator('#pf-panes .tpane[data-pane="managers"] thead th', { hasText: "Group" });
  await th.click(); await pg.waitForTimeout(100);
  const firstDesc = await pg.evaluate(() => document.querySelector("#pf-panes #mgr-rows tr").dataset.href);
  await th.click(); await pg.waitForTimeout(100);
  const sortState = await pg.evaluate(() => ({ first: document.querySelector("#pf-panes #mgr-rows tr").dataset.href, aria: [...document.querySelectorAll('#pf-panes .tpane[data-pane="managers"] thead th')].map((h) => h.getAttribute("aria-sort")).filter((a) => a !== "none") }));
  check(firstDesc !== sortState.first && sortState.aria.join() === "ascending", `list columns sort on tap, and reverse on a second tap (${firstDesc} → ${sortState.first})`);
  // AUM is STORED in USD (R29) and SHOWN honestly (R4): a figure restated from €/£ reads
  // in its native currency with the USD equivalent in brackets ("€12bn ($13.4bn)"),
  // everything else is USD alone; a restated figure carries its provenance on the tooltip.
  const ccy = await pg.evaluate(async () => {
    const D = await import("/credit/js/data.js");
    const cells = [...document.querySelectorAll("#pf-panes #mgr-rows td.pf-c-main, #pf-panes #lp-rows td:nth-child(4)")].map((td) => td.textContent.trim()).filter((t) => t && t !== "n/a" && t !== "—");
    const restated = [...document.querySelectorAll("#pf-panes #mgr-rows td.pf-c-main[title*='restated from']")].length;
    const dual = cells.filter((t) => /^[€£]/.test(t));
    return { dual: dual.length, dualOk: dual.every((t) => /^[€£][\d.]+(?:m|bn|tn) \(\$[\d.]+(?:m|bn|tn)\)$/.test(t)), bareForeign: cells.filter((t) => /€|£/.test(t) && !/^[€£]/.test(t)).length, usd: cells.filter((t) => t.startsWith("$")).length, restated, fx: !!(D.AUM_FX && D.AUM_FX.EURUSD > 0) };
  });
  check(ccy.dual > 50 && ccy.dualOk && ccy.bareForeign === 0 && ccy.usd > 100 && ccy.restated > 50 && ccy.fx, `AUM columns: native with USD in brackets where restated, else USD (${ccy.dual} €/£ ($), ${ccy.usd} $; ${ccy.restated} restated with provenance)`);
  // Profile header coverage line
  await pg.goto(base + "/v2/profiles/#/manager/m21"); await pg.waitForSelector("#pf-detail .tdet-latest", { timeout: 8000 });
  check(/tracked.*latest/i.test(await pg.evaluate(() => document.querySelector("#pf-detail .tdet-latest").textContent)), "a profile header shows its coverage (count · 90 days · latest date)");
  await pg.goto(base + "/v2/news/"); await pg.waitForTimeout(1500);
  await pg.evaluate(() => { const l = [...document.querySelectorAll("button, [data-lane]")].find((x) => /^Watchlist$/i.test((x.textContent || "").trim())); if (l) l.click(); });
  await pg.waitForTimeout(600);
  const ent = await pg.evaluate(async () => {
    const row = [...document.querySelectorAll("#g-feed a.g-feed-row[data-mgr]")].find((r) => r.dataset.mgr);
    if (!row) return null;
    row.click(); await new Promise((r) => setTimeout(r, 400));
    const a = document.querySelector("#g-read .g-read-ent, #g-reader .g-read-ent");
    return { mgr: row.dataset.mgr, href: a && a.getAttribute("href"), txt: a && a.textContent };
  });
  check(!!ent && /\/v2\/profiles\/#\/(manager|hf|firm)\//.test(ent.href || ""), `a Watchlist story's reader links to its profile (${ent && ent.txt})`);
  checkErrs(errs, "following + reader entity link");
  await ctx.close();
}

// ---- 6c) The bell opens items IN the app (deal panel / focused profile / alert page),
// closes itself, and never reloads the document ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/profiles/");
  await pg.waitForTimeout(800);
  const items = await pg.evaluate(async () => { const S = await import("/saved.js"); return (await S.buildNotifs()).map((x) => ({ href: x.href, ext: x.ext, id: x.id })); });
  const credit = items.filter((x) => /^[dil]:|^u:/.test(x.id));
  const inApp = credit.filter((x) => /^\/v2\//.test(x.href) && !x.ext).length;
  check(credit.length > 0 && inApp === credit.length, `every deal / fundraising / alert in the bell opens in the app (${inApp}/${credit.length})`);
  await setMarker(pg);
  await pg.locator('[aria-label*="otification"]').filter({ visible: true }).first().click();
  await pg.waitForSelector(".na-panel:not([hidden]) a.nf-row[href^='/v2/']", { timeout: 8000 });
  await pg.locator(".na-panel:not([hidden]) a.nf-row[href^='/v2/']").first().click(); await pg.waitForTimeout(700);
  const st = await pg.evaluate(() => ({ open: !![...document.querySelectorAll(".na-panel")].find((p) => !p.hidden), url: location.pathname + location.hash }));
  check(!st.open && /^\/v2\/(transactions|profiles)\//.test(st.url) && await marker(pg), `a bell row opens its Wire page in-app and closes the panel (${st.url})`);
  checkErrs(errs, "bell in-app");
  await ctx.close();
}

// ---- 6d) Extras: deal timeline, compare two managers, CSV export ----
{
  const { ctx, pg, errs } = await open(b, { ...DESKTOP, acceptDownloads: true }, base + "/v2/profiles/#/manager/m21/timeline");
  await pg.waitForSelector("#pf-detail .ttl-svg", { timeout: 8000 });
  const tl = await pg.evaluate(() => ({ cols: document.querySelectorAll("#pf-detail .ttl-col").length, bars: document.querySelectorAll("#pf-detail .ttl-bar").length, tip: (document.querySelector("#pf-detail .ttl-col title") || {}).textContent || "", links: document.querySelectorAll('#pf-detail .tpane[data-p="timeline"] a[href^="/v2/transactions/#/deal/"]').length }));
  check(tl.cols >= 24 && tl.bars > 0 && /^Q[1-4] \d{4}: \d+ deal/.test(tl.tip) && tl.links > 0, `Timeline: quarterly columns since 2020 with hover tooltips, deals by year linking to their panel (${tl.cols} cols, ${tl.bars} bars, ${tl.links} links)`);
  await pg.goto(base + "/v2/profiles/#/compare/m21/m30"); await pg.waitForSelector("#pf-detail .tcmp-tbl", { timeout: 8000 });
  const cmp = await pg.evaluate(() => ({ heads: [...document.querySelectorAll("#pf-detail .tcmp-h a")].map((a) => a.textContent), rows: document.querySelectorAll("#pf-detail .tcmp-tbl tbody tr").length, aum: [...document.querySelectorAll("#pf-detail .tcmp-tbl tbody tr")].find((r) => /Group AUM/.test(r.textContent))?.textContent || "" }));
  check(cmp.heads.length === 2 && cmp.rows >= 12 && /\$/.test(cmp.aum), `Compare: two managers side by side (${cmp.heads.join(" vs ")}, ${cmp.rows} rows)`);
  await pg.selectOption('#pf-detail .tcmp-pick[data-side="b"]', "m20"); await pg.waitForTimeout(400);
  check(/#\/compare\/m21\/m20$/.test(await pg.evaluate(() => location.hash)), "Compare: swapping a manager updates the URL");
  // CSV: Transactions (the filtered deal list) and a Profiles list
  await pg.goto(base + "/v2/transactions/#/lending?min=1000"); await pg.waitForSelector("#tx-body [data-deal]", { timeout: 8000 });
  const n = await pg.evaluate(() => document.querySelectorAll("#tx-body [data-deal]").length);
  await pg.click("#tx-filters"); await pg.waitForTimeout(100);
  const [dl] = await Promise.all([pg.waitForEvent("download"), pg.locator("#tx-sheet .tx-csv").click()]);
  const txt = await (async () => { const fs = await import("node:fs"); return fs.readFileSync(await dl.path(), "utf8"); })();
  const lines = txt.replace(/^\ufeff/, "").trim().split(/\r\n/);
  check(/^wire-transactions-lending-\d{4}-\d{2}-\d{2}\.csv$/.test(dl.suggestedFilename()) && lines.length === n + 1 && /^Date,Borrower/.test(lines[0]), `CSV: the on-screen deals export (${lines.length - 1} rows = ${n} shown)`);
  await pg.goto(base + "/v2/profiles/#/?tab=hedgefunds"); await pg.waitForSelector("#hf-rows tr", { timeout: 8000 });
  await pg.locator('#pf-panes .tpane[data-pane="hedgefunds"] .pf-filter-btn').click(); await pg.waitForTimeout(100);
  const [dl2] = await Promise.all([pg.waitForEvent("download"), pg.locator('#pf-panes .tpane[data-pane="hedgefunds"] .pf-sheet .tx-csv').click()]);
  check(/^wire-hedgefunds-/.test(dl2.suggestedFilename()), `CSV: a Profiles list exports (${dl2.suggestedFilename()})`);
  checkErrs(errs, "timeline + compare + csv");
  await ctx.close();
}

// ---- 7) Transactions state lives in the URL (A4) + search / filters (C4, C5) ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/transactions/#/structured?sort=size-desc");
  await pg.waitForSelector("#tx-body [data-deal]", { timeout: 8000 });
  await pg.reload(); await pg.waitForSelector("#tx-body [data-deal]", { timeout: 8000 });
  check(await pg.evaluate(() => (document.querySelector("#tx-mode .tchip.is-on") || {}).dataset.mode === "structured" && /sort=size-desc/.test(location.hash)), "a reload keeps the Transactions mode and sort");
  // A BDC deep link opens on Dashboard ▸ Credit and survives a reload.
  await pg.goto(base + "/v2/dashboard/credit?bdc=ARCC"); await pg.waitForSelector(".crr-row.is-open", { timeout: 8000 });
  await pg.reload(); await pg.waitForSelector(".crr-row.is-open", { timeout: 8000 });
  check(await pg.evaluate(() => (document.querySelector(".crr-row.is-open") || {}).dataset.bdc === "ARCC"), "a reload of ?bdc=ARCC keeps Ares Capital open on the Dashboard");
  // Legacy #/primary → Lending; a filter change is a history step Back undoes.
  await pg.goto(base + "/v2/transactions/#/primary"); await pg.waitForTimeout(600);
  check(await pg.evaluate(() => location.hash === "#/lending"), "the retired #/primary mode canonicalises to #/lending");
  await pg.click("#tx-filters"); await pg.waitForTimeout(120);
  await pg.locator('#tx-sheet [data-facet="size"][data-v="gt1bn"]').click(); await pg.waitForTimeout(150);
  const typeChip = pg.locator('#tx-sheet [data-facet="type"][data-v="lend"]');
  await typeChip.click(); await pg.waitForTimeout(150);
  await pg.locator('#tx-sheet .tx-sheet-done').click(); await pg.waitForTimeout(120);
  check(await pg.evaluate(() => location.hash === "#/lending?type=lend&size=gt1bn"), `type + size are in the URL (${await pg.evaluate(() => location.hash)})`);
  const sum = await pg.evaluate(() => (document.querySelector("#tx-active .tx-sum") || {}).textContent || "");
  check(/Direct lending \/ unitranche/.test(sum) && /≥ \$1bn/.test(sum), `active filters read as one summary line (${sum})`);
  // A mode change is a history step: Back returns to the filtered list.
  await pg.locator('#tx-mode [data-mode="structured"]').click(); await pg.waitForTimeout(200);
  await pg.goBack(); await pg.waitForTimeout(250);
  check(await pg.evaluate(() => location.hash === "#/lending?type=lend&size=gt1bn"), `Back steps back to the filtered list (${await pg.evaluate(() => location.hash)})`);
  await pg.locator('#tx-active [data-clear="all"]').click(); await pg.waitForTimeout(150);
  check(await pg.evaluate(() => location.hash === "#/lending" && document.querySelector("#tx-active").hidden && document.querySelector("#tx-filters .tx-fn").textContent === ""), "Clear resets every filter");
  // Search covers every group (a CLO is found from the Lending mode).
  await pg.fill("#tx-q", "CLO"); await pg.waitForTimeout(300);
  const sr = await pg.evaluate(() => ({ title: (document.querySelector(".tx-title") || {}).textContent || "", n: document.querySelectorAll("#tx-body [data-deal]").length, blurb: (document.querySelector(".tx-blurb") || {}).textContent || "" }));
  check(/all transactions/i.test(sr.title) && sr.n > 0 && /Structured credit/.test(sr.blurb), `search spans every group (${sr.n} rows — ${sr.blurb.trim().slice(0, 90)})`);
  // #/deal/<id> deep link → that deal's mode with the drawer open; search opens deals in-app.
  const id = await pg.evaluate(async () => { const D = await import("/credit/js/data.js"); return D.deals.find((d) => d.clo && d.date).id; });
  await pg.goto(base + "/v2/transactions/#/deal/" + id); await pg.waitForTimeout(700);
  const dl = await pg.evaluate(() => ({ hash: location.hash, open: !document.querySelector("#tx-drawer").hidden }));
  check(dl.open && new RegExp("^#/structured\\?deal=" + id + "$").test(dl.hash), `#/deal/<id> opens the deal in its own mode (${dl.hash})`);
  checkErrs(errs, "transactions URL state");
  await ctx.close();
}

await b.close(); srv.close();
finish();
