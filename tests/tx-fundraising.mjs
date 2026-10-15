// Transactions ▸ Fundraising (R7, 2026-10): a "Fundraising" chip (#/fundraising) with
// Funds in market (the Dashboard's own builder — v2/js/funds-market.js), a first / final
// close timeline from the intel ledger, the LP commitments ledger, an LP ↔ manager
// matrix (15×15 on desktop, a ranked list of pairs on phone) and a link to the investor
// directory. Long lists preview 10 rows + "See all N".
import { serve, launchChromium, open, DESKTOP, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";
import { intel, commitments } from "../credit/js/data.js";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const closes = intel.filter((i) => i.date && (i.type === "First Close" || i.type === "Final Close"));

{
  const { pg, errs } = await open(b, DESKTOP, base + "/v2/transactions/");
  await pg.waitForSelector("#tx-mode .tchip", { timeout: 10000 });
  await pg.click('#tx-mode [data-view="fundraising"]'); await pg.waitForTimeout(300);
  await pg.waitForSelector("#tx-fr-fim", { timeout: 5000 });
  checkEq(await pg.evaluate(() => location.hash), "#/fundraising", "the Fundraising chip opens #/fundraising");
  const v = await pg.evaluate(async () => {
    const { fundsInMarket } = await import("/v2/js/funds-market.js");
    const shown = (sel) => [...document.querySelectorAll(sel)].filter((e) => e.style.display !== "none");
    return {
      fimN: document.querySelectorAll("#tx-fr-fim tbody tr[data-pv]").length,
      fimWant: fundsInMarket({ scope: "eu" }).length,
      fimShown: shown("#tx-fr-fim tbody tr[data-pv]").length,
      fimFirst: (document.querySelector("#tx-fr-fim tbody tr td") || {}).textContent,
      fimWantFirst: (fundsInMarket({ scope: "eu" })[0] || { f: {} }).f.name,
      closesN: document.querySelectorAll("#tx-fr-closes tbody tr[data-pv]").length,
      closeSrc: [...document.querySelectorAll("#tx-fr-closes tbody tr")].slice(0, 10).every((tr) => tr.querySelector('a.tx-fr-src[href^="http"]')),
      closeDates: [...document.querySelectorAll("#tx-fr-closes tbody tr .tx-fr-d")].map((td) => Date.parse(td.textContent)),
      lpcN: document.querySelectorAll("#tx-fr-lpc tbody tr[data-pv]").length,
      lpcLink: !!document.querySelector('#tx-fr-lpc tbody tr a[href*="/profiles/#/lp/"]'),
      mx: { rows: document.querySelectorAll("#tx-fr-matrix .tx-mx tbody tr").length, cols: document.querySelectorAll("#tx-fr-matrix .tx-mx thead th.tx-mx-h").length, filled: document.querySelectorAll("#tx-fr-matrix .tx-mx td.has-n").length },
      seeAll: document.querySelectorAll("#tx-fr-fim .tx-seeall, #tx-fr-closes .tx-seeall, #tx-fr-lpc .tx-seeall").length,
      dir: (document.querySelector(".tx-fr-dir") || {}).getAttribute?.("href") || "",
    };
  });
  check(v.fimN === v.fimWant && v.fimFirst === v.fimWantFirst, `Funds in market = the shared builder's list (${v.fimN}/${v.fimWant})`);
  check(v.fimShown === Math.min(10, v.fimN), `Funds in market previews 10 rows (${v.fimShown})`);
  checkEq(v.closesN, closes.length, "the close timeline lists every first / final close event");
  check(v.closeSrc, "each close event links its source");
  check(v.closeDates.every((t, i) => i === 0 || v.closeDates[i - 1] >= t), "closes run newest first");
  checkEq(v.lpcN, commitments.filter((c) => c.lpId).length, "LP commitments list the ledger");
  check(v.lpcLink, "an LP links to its investor profile");
  check(v.mx.rows > 0 && v.mx.rows <= 15 && v.mx.cols > 0 && v.mx.cols <= 15 && v.mx.filled > 0, `LP ↔ manager matrix (${v.mx.rows}×${v.mx.cols}, ${v.mx.filled} filled)`);
  checkEq(v.seeAll, 3, "each long list has See all");
  check(/\/v2\/profiles\/#\/\?tab=investors$/.test(v.dir), `investor directory → Profiles ▸ Investors (${v.dir})`);
  // See all → sheet with everything.
  await pg.click("#tx-fr-closes .tx-seeall"); await pg.waitForTimeout(200);
  checkEq(await pg.evaluate(() => [...document.querySelectorAll(".tx-sheetv tr[data-pv]")].filter((e) => e.style.display !== "none").length), closes.length, "See all opens every close event in the sheet");
  await pg.keyboard.press("Escape"); await pg.waitForTimeout(100);
  // Filters: final closes only; all regions.
  await pg.click('#tx-fr-closes [data-fr-close="final"]'); await pg.waitForTimeout(200);
  const fin = await pg.evaluate(() => [...document.querySelectorAll("#tx-fr-closes tbody tr .tx-fr-k")].map((x) => x.textContent));
  check(fin.length > 0 && fin.every((t) => t === "Final close") && /close=final/.test(await pg.evaluate(() => location.hash)), `Final-only filter (${fin.length}) lands in the URL`);
  await pg.click('#tx-fr-fim [data-fr-fim="all"]'); await pg.waitForTimeout(200);
  check(await pg.evaluate(() => document.querySelectorAll("#tx-fr-fim tbody tr[data-pv]").length) >= v.fimN, "All regions widens Funds in market");
  await pg.reload(); await pg.waitForSelector("#tx-fr-fim", { timeout: 8000 });
  check(await pg.evaluate(() => document.querySelector('#tx-fr-fim [data-fr-fim="all"]').classList.contains("is-on") && (document.querySelector("#tx-mode .tchip.is-on") || {}).dataset.view === "fundraising"), "a reload restores the view and its filters");
  checkErrs(errs, "fundraising desktop");
}
{
  const { pg, errs } = await open(b, PHONE, base + "/v2/transactions/#/fundraising");
  await pg.waitForSelector("#tx-fr-matrix", { timeout: 10000 });
  const p = await pg.evaluate(() => ({
    noTable: !document.querySelector("#tx-view table"),
    pairs: document.querySelectorAll("#tx-fr-matrix .tx-fr-pairs > li").length,
    pairShown: [...document.querySelectorAll("#tx-fr-matrix .tx-fr-pairs > li")].filter((e) => e.style.display !== "none").length,
    lists: [...document.querySelectorAll(".tx-fr-list")].map((l) => [...l.children].filter((e) => e.style.display !== "none").length),
    overflow: document.documentElement.scrollWidth - innerWidth,
  }));
  check(p.noTable, "phone: no tables — card rows only (the matrix becomes a list of pairs)");
  check(p.pairs > 0 && p.pairShown === Math.min(10, p.pairs), `phone: ranked LP ↔ manager pairs preview 10 (${p.pairShown}/${p.pairs})`);
  check(p.lists.every((n) => n <= 10), `phone: every list previews ≤10 rows (${p.lists.join(",")})`);
  check(p.overflow <= 1, `phone: no sideways page scroll (${p.overflow}px)`);
  checkErrs(errs, "fundraising phone");
}
await b.close(); srv.close();
finish();
