// Transactions ▸ BDCs sub-tab: the largest US business development companies,
// split into LISTED and INTERVAL/PRIVATE, with total assets, NAV, non-accruals,
// a LIVE price÷NAV ratio (listed) or repurchase/gating (non-traded), each row
// expanding to its sourced figures + a holdings fetch. Certifiable data only.
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";
import { BDCS } from "../credit/js/bdcs.js";

// ---- 1) Data integrity (pure): every reported figure is sourced, never guessed --
let unsourced = [], badStruct = [], badListed = [];
for (const b of BDCS) {
  if (!["listed", "nontraded"].includes(b.structure)) badStruct.push(b.name);
  const hasFigure = b.totalAssets != null || b.nav != null || b.nonAccrualFV != null || b.repurchaseRequestedPct != null;
  if (hasFigure && !(Array.isArray(b.sources) && b.sources.length && b.sources.every((s) => /^https?:\/\//.test(s.url)))) unsourced.push(b.name);
  if (b.structure === "listed" && (!b.ticker || !b.exchange)) badListed.push(b.name);
  if (b.structure === "nontraded" && b.ticker) badListed.push(b.name + " (non-traded w/ ticker)");
}
check(BDCS.length >= 25, `the roster lists the largest BDCs (${BDCS.length})`);
check(badStruct.length === 0, `every BDC is listed or nontraded (${badStruct.join(", ")})`);
check(unsourced.length === 0, `every reported figure carries a real source URL — certifiable only (${unsourced.join(", ")})`);
check(badListed.length === 0, `listed funds carry a ticker+exchange; non-traded carry none (${badListed.join(", ")})`);
check(BDCS.some((b) => b.structure === "listed") && BDCS.some((b) => b.structure === "nontraded"), "the roster spans both listed and interval/private funds");

// ---- 2) UI ---------------------------------------------------------------------
const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const { ctx, pg, errs } = await open(b, { viewport: { width: 1440, height: 900 }, colorScheme: "dark" }, base + "/v2/transactions/");
await pg.waitForSelector("#tx-mode .tchip", { timeout: 8000 });
// Deterministic quotes so the price/NAV ratio is stable (ARCC NAV 19.35 → 21.30/19.35 ≈ 1.10×).
await pg.route("**/api/quotes**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ quotes: { ARCC: { price: 21.30 }, FSK: { price: 15.50 }, MAIN: { price: 52.00 } }, asOf: "2026-09-15" }) }));

check(await pg.evaluate(() => [...document.querySelectorAll("#tx-mode .tchip")].some((c) => c.dataset.mode === "bdc" && /BDC/i.test(c.textContent))), "a BDCs sub-tab chip sits beside Deal flow / Credits");
await pg.evaluate(() => [...document.querySelectorAll("#tx-mode .tchip")].find((c) => c.dataset.mode === "bdc").click());
await pg.waitForSelector("#tx-bdc-body .tbdc-tbl tbody tr.tbdc-row", { timeout: 5000 });
await pg.waitForTimeout(400);

const view = await pg.evaluate(() => {
  const rows = [...document.querySelectorAll("#tx-bdc-body .tbdc-tbl tbody tr.tbdc-row")];
  const heads = [...document.querySelectorAll("#tx-bdc-body .tbdc-tbl thead th")].map((t) => t.textContent.trim());
  const filters = [...document.querySelectorAll("#tx-bdc-body [data-bdcf]")].map((f) => ({ k: f.dataset.bdcf, n: +(f.querySelector(".tx-secn")?.textContent || 0) }));
  const arcc = rows.find((x) => /Ares Capital/.test(x.textContent));
  return {
    rows: rows.length, heads, filters,
    arccPxNav: arcc ? (arcc.querySelector(".tbdc-pxnav") || {}).textContent : null,
    arccPrem: arcc ? !!arcc.querySelector(".tbdc-pxnav.is-prem") : false,
  };
});
check(view.rows >= 25, `the BDC table lists the roster (${view.rows})`);
check(/Fund/.test(view.heads[0]) && view.heads.some((h) => /Ticker/.test(h)) && view.heads.some((h) => /Type/.test(h)) && view.heads.some((h) => /Manager/.test(h)) && view.heads.some((h) => /Total assets/i.test(h)) && view.heads.some((h) => /NAV/i.test(h)) && view.heads.some((h) => /Non-accrual/i.test(h)) && view.heads.some((h) => /Px\/NAV|liquidity/i.test(h)),
  `columns: Fund · Ticker · Type · Manager · Total assets · NAV · Non-accrual · Px/NAV·liquidity (${view.heads.join(" · ")})`);
check(await pg.evaluate(() => { const rows = [...document.querySelectorAll("#tx-bdc-body tr.tbdc-row")]; const arcc = rows.find((r) => /Ares Capital/.test(r.textContent)); const bcred = rows.find((r) => /Blackstone Private Credit/.test(r.textContent)); return /ARCC/.test(arcc?.querySelector(".tbdc-tk")?.textContent || "") && (bcred?.querySelector(".tbdc-tk")?.textContent || "").trim() === "—"; }),
  "a Ticker column shows the listed fund's symbol and a dash for non-traded funds");
check(await pg.evaluate(() => { const rows = [...document.querySelectorAll("#tx-bdc-body tr.tbdc-row")]; const listed = rows.filter((r) => /Listed/.test(r.querySelector(".tbdc-ty")?.textContent || "")); const priv = rows.filter((r) => /Private/.test(r.querySelector(".tbdc-ty")?.textContent || "")); return listed.length > 0 && priv.length > 0 && !rows.some((r) => /Interval \/ private/.test(r.querySelector(".tbdc-nm")?.textContent || "")); }),
  "a Type column marks each fund Listed / Private (and the label is gone from under the name)");
const fAll = view.filters.find((f) => f.k === "all"), fL = view.filters.find((f) => f.k === "listed"), fN = view.filters.find((f) => f.k === "nontraded");
check(fAll && fL && fN && fL.n + fN.n === fAll.n && fL.n > 0 && fN.n > 0, `a filter splits listed vs interval/private (${fL && fL.n} + ${fN && fN.n} = ${fAll && fAll.n})`);
check(/^1\.10×$/.test((view.arccPxNav || "").trim()) && view.arccPrem, `listed funds show a LIVE price÷NAV ratio, marked premium/discount (${view.arccPxNav})`);

// Filter to interval/private → only non-traded rows, and they read "Interval / private".
await pg.evaluate(() => document.querySelector('#tx-bdc-body [data-bdcf="nontraded"]').click());
await pg.waitForTimeout(150);
const nt = await pg.evaluate(() => {
  const rows = [...document.querySelectorAll("#tx-bdc-body .tbdc-tbl tbody tr.tbdc-row")];
  return { n: rows.length, allPrivate: rows.every((r) => /Private/.test(r.querySelector(".tbdc-ty")?.textContent || "")) };
});
check(nt.n > 0 && nt.allPrivate, `the interval/private filter shows only non-traded funds, marked Private in the Type column (${nt.n})`);

// Expand a listed row → sourced facts (total assets / NAV / non-accruals) + source links + holdings CTA.
await pg.evaluate(() => document.querySelector('#tx-bdc-body [data-bdcf="all"]').click());
await pg.waitForTimeout(150);
const exp = await pg.evaluate(() => {
  const row = [...document.querySelectorAll("#tx-bdc-body tr.tbdc-row")].find((x) => /Ares Capital/.test(x.textContent));
  row.click();
  const d = row.nextElementSibling;
  return {
    open: d && d.classList.contains("tbdc-exp") && !d.hidden,
    facts: (d.querySelector(".tbdc-facts") || {}).textContent || "",
    srcs: d.querySelectorAll(".tbdc-srcs a[href^='https://www.sec.gov']").length,
    holdBtn: !!d.querySelector(".tbdc-hold-btn"),
  };
});
check(exp.open, "clicking a BDC row expands its detail");
check(/Total assets/.test(exp.facts) && /Non-accruals/.test(exp.facts) && /fair value/.test(exp.facts), "the detail lists total assets + non-accruals (at fair value / cost)");
check(exp.srcs > 0, `the detail links its SEC source(s) (${exp.srcs})`);
check(exp.holdBtn, "a listed BDC offers a live SEC holdings fetch");

checkErrs(errs, "BDC roster");
await ctx.close();

// ---- 3) Phone: the BDC table fits the screen (no horizontal scroll) ----
{
  const { ctx: c2, pg: p2, errs: e2 } = await open(b, PHONE, base + "/v2/transactions/");
  await p2.waitForSelector("#tx-mode .tchip", { timeout: 8000 });
  await p2.evaluate(() => [...document.querySelectorAll("#tx-mode .tchip")].find((c) => c.dataset.mode === "bdc").click());
  await p2.waitForSelector("#tx-bdc-body .tbdc-tbl tbody tr.tbdc-row", { timeout: 5000 });
  const fit = await p2.evaluate(() => {
    const t = document.querySelector("#tx-bdc-body .tbdc-tbl");
    const wrap = t.closest(".tleague-wrap");
    const se = document.scrollingElement;
    return { vw: window.innerWidth, tblW: Math.round(t.getBoundingClientRect().width),
      wrapOverflow: wrap.scrollWidth - wrap.clientWidth, pageOverflow: se.scrollWidth - se.clientWidth };
  });
  check(fit.pageOverflow <= 1, `phone: the page itself does not scroll horizontally — only the table does (page ${fit.pageOverflow})`);
  check(fit.wrapOverflow > 1, `phone: the full table extends and scrolls horizontally inside its wrapper (${fit.wrapOverflow}px)`);
  checkErrs(e2, "BDC roster phone");
  await c2.close();
}

await b.close(); srv.close();
finish();
