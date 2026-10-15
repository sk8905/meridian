// Transactions ▸ League tables (R9, 2026-10): a "League tables" chip after the modes
// (#/league) ranks Lenders · Sponsors · Law firms · Financial advisers by tracked deal
// count and disclosed ≈USD volume, filterable by period / region (all regions by default — owner 2026-10-15) / type;
// names link to profiles; a row expands to the deals behind it and opens the list
// filtered by that lender / sponsor. The aggregation counts a club deal ONCE per lender,
// reads d.lenders[] when present (else managerId) and d.sponsor when present.
// Also: the mode bar order + Restructuring link chip, and the deal drawer's Share button.
import { serve, launchChromium, open, DESKTOP, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";
import { managers } from "../credit/js/data.js";
import { managerIndex, lendersOf, sponsorOf, aggregate, rank } from "../v2/js/transactions/league.js";

// ---- 1) pure aggregation ---------------------------------------------------------
const idx = managerIndex(managers);
const [m1, m2] = managers;
const R = (id, extra, usd = 100) => ({ d: { id, managerId: m1.id, date: "2026-03-01", ...extra }, usd, sizeOk: true, ts: Date.parse("2026-03-01"), sponsor: "Parsed Sponsor" });
const rowsT = [
  R("a", {}),                                                                          // fallback: managerId
  R("b", { lenders: [m1.id, m2.id, m1.id, { name: m2.name }] }),                         // club deal, duplicates
  R("c", { lenders: ["Some Bank"], sponsor: "Explicit Capital" }),
  R("d", { lenders: [{ managerId: m2.id, name: "x" }], sponsor: { name: "Obj Sponsor" } }, null),
];
rowsT[3].sizeOk = false;
check(lendersOf(rowsT[0].d, idx).map((l) => l.key).join() === m1.id, "no lenders[] → the deal's managerId");
checkEq(lendersOf(rowsT[1].d, idx).map((l) => l.key).join(), `${m1.id},${m2.id}`, "lenders[] ids / names resolve to managers, each once per deal");
checkEq(lendersOf(rowsT[2].d, idx)[0].key, "n:some bank", "an untracked lender name is kept by name");
checkEq(sponsorOf(rowsT[2]), "Explicit Capital", "d.sponsor (string) wins over the parse");
checkEq(sponsorOf(rowsT[3]), "Obj Sponsor", "d.sponsor (object) is read by name");
checkEq(sponsorOf(rowsT[0]), "Parsed Sponsor", "no d.sponsor → the existing sponsor parse");
const lg = rank(aggregate(rowsT, (r) => lendersOf(r.d, idx)));
const a1 = lg.find((x) => x.key === m1.id), a2 = lg.find((x) => x.key === m2.id);
check(a1.n === 2 && a1.vol === 200 && a2.n === 2 && a2.vol === 100 && a2.sized === 1, `club deal counted once per lender; undisclosed sizes add no volume (${a1.n}/${a1.vol}, ${a2.n}/${a2.vol})`);
checkEq(lg[0].key, m1.id, "ranked by deal count, then volume");
checkEq(rank(lg, "vol")[0].key, m1.id, "rank by volume");

// ---- 2) desktop view ---------------------------------------------------------------
const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const { pg, errs } = await open(b, DESKTOP, base + "/v2/transactions/");
await pg.waitForSelector("#tx-mode .tchip", { timeout: 10000 });
const chips = await pg.evaluate(() => [...document.querySelectorAll("#tx-mode .tchip")].map((c) => c.textContent.trim()));
checkEq(chips.join(" · "), "All · Lending · Structured credit · Secondaries · Restructuring · Fundraising · Manager M&A · League tables", "mode bar order (All first and default — owner 2026-10-15)");
check(await pg.evaluate(() => /\/v2\/restructuring\/$/.test(document.querySelector("#tx-mode a.tx-rxchip").getAttribute("href"))), "Restructuring is a link chip to /v2/restructuring/");

await pg.click('#tx-mode [data-view="league"]'); await pg.waitForTimeout(300);
check(/#\/league$/.test(await pg.evaluate(() => location.hash)), "the League tables chip opens #/league");
const t0 = await pg.evaluate(() => ({
  on: (document.querySelector("#tx-mode .tchip.is-on") || {}).textContent,
  rows: [...document.querySelectorAll(".tx-lg-tbl tbody[data-pv]")].filter((t) => t.style.display !== "none").length,
  all: document.querySelectorAll(".tx-lg-tbl tbody[data-pv]").length,
  n: [...document.querySelectorAll(".tx-lg-row td:nth-child(3)")].map((td) => +td.textContent),
  link: !!document.querySelector('.tx-lg-row a.tx-lg-a[href*="/profiles/#/manager/"]'),
  reg: document.querySelector("#tx-lg-reg").value, period: document.querySelector("#tx-lg-period").value,
}));
check(/League/.test(t0.on) && t0.rows > 0 && t0.rows <= 25, `lenders table renders (${t0.rows} shown of ${t0.all})`);
check(t0.n.every((x, i) => i === 0 || t0.n[i - 1] >= x), "ranked by deal count");
check(t0.link, "a tracked lender links to its manager profile");
check(t0.reg === "all" && t0.period === "ytd", "defaults: all regions (no default filter on Deals — owner 2026-10-15), year to date");
if (t0.all > 25) {
  await pg.click(".tx-seeall"); await pg.waitForTimeout(200);
  const sh = await pg.evaluate(() => ({ n: document.querySelectorAll(".tx-sheetv tbody[data-pv]").length, vis: [...document.querySelectorAll(".tx-sheetv tbody[data-pv]")].every((t) => t.style.display !== "none") }));
  check(sh.n === t0.all && sh.vis, `See all opens the whole table in a sheet (${sh.n})`);
  await pg.click(".tx-sheetv .dsh-sheet-x"); await pg.waitForTimeout(100);
}
// Region widens.
await pg.selectOption("#tx-lg-reg", "all"); await pg.waitForTimeout(250);
const allN = await pg.evaluate(() => +document.querySelector(".tx-lg-stats b").textContent);
await pg.selectOption("#tx-lg-reg", "eu"); await pg.waitForTimeout(250);
const euN = await pg.evaluate(() => +document.querySelector(".tx-lg-stats b").textContent);
check(allN >= euN && /reg=eu/.test(await pg.evaluate(() => location.hash)), `All regions is the wider base (${allN} ≥ ${euN}); All regions is the default, Europe lands in the URL`);
await pg.selectOption("#tx-lg-period", "12m"); await pg.waitForTimeout(250);
check(/period=12m/.test(await pg.evaluate(() => location.hash)), "the period lands in the URL");
// Expand the top row → deals + an "Open N in …" link filtered by that lender.
await pg.click(".tx-lg-row td.tx-lg-rk"); await pg.waitForTimeout(200);
const ex = await pg.evaluate(() => ({ deals: document.querySelectorAll(".tx-lg-row.is-open + .tx-lg-exprow .tx-lg-deal").length, ol: (document.querySelector(".tx-lg-exprow:not([hidden]) .tx-lg-ol") || {}).getAttribute?.("href") || "", hash: location.hash }));
check(ex.deals > 0 && /open=/.test(ex.hash), `a row expands to its deals (${ex.deals}) and the URL records it`);
check(/#\/\w+\?lender=m\w+.*period=12m/.test(ex.ol), `"Open in …" opens the list filtered by that lender (${ex.ol})`);
await pg.click(".tx-lg-exprow:not([hidden]) .tx-lg-ol"); await pg.waitForTimeout(400);
const fl = await pg.evaluate(() => ({ hash: location.hash, rows: document.querySelectorAll("#tx-body tr.tx-row").length, sum: (document.querySelector("#tx-active .tx-sum") || {}).textContent || "" }));
check(/lender=/.test(fl.hash) && fl.rows > 0, `…the filtered deal list (${fl.rows} rows; ${fl.sum})`);
await pg.goBack(); await pg.waitForTimeout(400);
check(/#\/league/.test(await pg.evaluate(() => location.hash)) && await pg.evaluate(() => !!document.querySelector(".tx-lg-tbl")), "Back returns to the league table");
// Sponsors → the sponsor-filtered list.
await pg.evaluate(() => { location.hash = "#/league?by=sponsors&period=12m&reg=all"; }); await pg.waitForTimeout(400);
const sp = await pg.evaluate(() => document.querySelectorAll(".tx-lg-row").length);
check(sp > 0, `sponsors table renders (${sp})`);
await pg.click(".tx-lg-row td.tx-lg-rk"); await pg.waitForTimeout(200);
const spHref = await pg.evaluate(() => (document.querySelector(".tx-lg-exprow:not([hidden]) .tx-lg-ol") || {}).getAttribute?.("href") || "");
check(/spn=/.test(spHref), `a sponsor row opens the list filtered by that sponsor (${spHref})`);
await pg.click(".tx-lg-exprow:not([hidden]) .tx-lg-ol"); await pg.waitForTimeout(400);
const spl = await pg.evaluate(() => ({ rows: document.querySelectorAll("#tx-body tr.tx-row").length, sum: (document.querySelector("#tx-active .tx-sum") || {}).textContent || "" }));
check(spl.rows > 0 && /Sponsor:/.test(spl.sum), `…sponsor-filtered deals (${spl.rows}; "${spl.sum}")`);
// Law firms (needs the legal desk) → firm page links.
await pg.evaluate(() => { location.hash = "#/league?by=law&period=12m&reg=all"; }); await pg.waitForTimeout(400);
await pg.waitForSelector(".tx-lg-row", { timeout: 15000 }).catch(() => {});
const law = await pg.evaluate(() => ({ n: document.querySelectorAll(".tx-lg-row").length, firm: !!document.querySelector('.tx-lg-row a[href*="/profiles/#/firm/"]') }));
check(law.n > 0, `law-firm table renders (${law.n})`);
check(law.firm, "a tracked law firm links to its firm page");

// ---- 3) Share in the deal drawer (no navigator.share → copy + toast) -----------------
await pg.evaluate(() => { try { delete Navigator.prototype.share; } catch { /* */ } navigator.share = undefined; window.__copied = null; navigator.clipboard.writeText = (t) => { window.__copied = t; return Promise.resolve(); }; });
await pg.evaluate(() => { location.hash = "#/lending?scope=all"; }); await pg.waitForTimeout(400);
await pg.click("#tx-body tr.tx-row td.tx-bd"); await pg.waitForTimeout(250);
await pg.click("#tx-drawer .tx-share"); await pg.waitForTimeout(150);
const sh = await pg.evaluate(() => ({ c: window.__copied, t: (document.querySelector(".tx-toast") || {}).textContent }));
check(/\/v2\/transactions\/#\/deal\/\w+/.test(sh.c || "") && sh.t === "Link copied", `Share copies the deal link + "Link copied" (${sh.c})`);
checkErrs(errs, "league tables desktop");

// ---- 4) phone: one scrolling mode row, cards, 10-row preview -------------------------
{
  const p = await open(b, PHONE, base + "/v2/transactions/#/league?reg=all&period=12m");
  await p.pg.waitForSelector(".tx-lg-card", { timeout: 10000 });
  const ph = await p.pg.evaluate(() => {
    const nav = document.querySelector("#tx-mode"), c = [...nav.querySelectorAll(".tchip")];
    const on = nav.querySelector(".tchip.is-on").getBoundingClientRect(), nr = nav.getBoundingClientRect();
    return {
      oneRow: new Set(c.map((x) => Math.round(x.getBoundingClientRect().top))).size === 1,
      scrolls: nav.scrollWidth > nav.clientWidth, activeIn: on.left >= nr.left - 1 && on.right <= nr.right + 1,
      shown: [...document.querySelectorAll(".tx-lg-card")].filter((x) => x.style.display !== "none").length,
      seeAll: !!document.querySelector(".tx-seeall"), overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  check(ph.oneRow && ph.scrolls && ph.activeIn, `phone: the mode bar is ONE sideways-scrolling row with the active chip in view (${JSON.stringify(ph)})`);
  check(ph.shown === 10 && ph.seeAll, `phone: 10-row preview + See all (${ph.shown})`);
  check(ph.overflow <= 1, `phone: no sideways page scroll (${ph.overflow}px)`);
  await p.pg.click(".tx-lg-card .tx-lg-rk"); await p.pg.waitForTimeout(200);
  check(await p.pg.evaluate(() => document.querySelectorAll(".tx-lg-card.is-open .tx-lg-deal").length > 0), "phone: a card expands to its deals");
  checkErrs(p.errs, "league tables phone");
}
await b.close(); srv.close();
finish();
