// Transactions tab — the covered managers' deal flow by transaction type. Checks
// the shared classifier/amount enrichment (credit/js/tx.js) against the live deal
// ledger, then the tab UI: an overview league table of the types → a per-type
// stat header + dated transaction list, in the Profiles terminal look.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
await pg.waitForTimeout(400);

// ---- 1) enrichment layer -------------------------------------------------
const tx = await pg.evaluate(async () => {
  const [T, D] = await Promise.all([import("/credit/js/tx.js?v=20260904-1"), import("/credit/js/data.js")]);
  const keys = new Set(T.TX_TYPES.map((t) => t.key));
  const deals = D.deals.filter((d) => d && d.date);
  const classified = deals.every((d) => keys.has(T.txOf(d)));
  const clo = deals.filter((d) => d.clo);
  const cloOk = clo.length > 0 && clo.every((d) => T.txOf(d) === "clo");
  // a deal whose headline states a size parses; a size-less one is null (never invented)
  const withAmt = deals.map((d) => T.amountOf(d)).filter(Boolean);
  const usd = withAmt.map((a) => T.toUsd(a)).filter((v) => v > 0);
  const dist = {}; deals.forEach((d) => { const k = T.txOf(d); dist[k] = (dist[k] || 0) + 1; });
  return { total: deals.length, classified, cloOk, cloN: clo.length, amtN: withAmt.length, usdN: usd.length, types: T.TX_TYPES.length, dist };
});
check(tx.total > 500, `deal ledger present (${tx.total})`);
check(tx.classified, "every deal is classified into a canonical transaction type");
check(tx.cloOk, `CLO-flagged deals classify as CLO issuance (${tx.cloN})`);
check(tx.amtN > 200 && tx.usdN > 200, `deal sizes parse from the sourced text and normalise to USD (${tx.amtN} sized, ${tx.usdN} in USD)`);
check((tx.dist.clo || 0) > 50 && (tx.dist.lend || 0) > 50, `the data-rich types are well populated (clo ${tx.dist.clo}, lend ${tx.dist.lend})`);

// ---- 2) overview league table --------------------------------------------
await pg.goto(base + "/v2/transactions/", { waitUntil: "load" });
await pg.waitForSelector(".tx-tbl tbody tr.clickable", { timeout: 8000 });
const ov = await pg.evaluate(() => ({
  rows: document.querySelectorAll(".tx-tbl tbody tr.clickable").length,
  hasTotal: /All types/.test((document.querySelector(".tx-tbl tfoot") || {}).textContent || ""),
  hasTrend: document.querySelectorAll(".tx-tbl .tx-up, .tx-tbl .tx-fl, .tx-tbl .tx-dn").length > 0,
  hasVol: /\$/.test((document.querySelector(".tx-tbl tbody tr") || {}).textContent || ""),
  chips: [...document.querySelectorAll("#tx-period .tchip")].map((c) => c.textContent.trim()),
}));
check(ov.rows >= 6, `overview lists the transaction types as a league table (${ov.rows})`);
check(ov.hasTotal, "overview carries an 'All types' total row");
check(ov.hasTrend && ov.hasVol, "overview shows a 12mo-vs-prior momentum mark and a ≈USD volume per type");
check(ov.chips.join(",") === "Last 12 months,All time", `period chips present (${ov.chips.join(",")})`);

// ---- 3) drill into a type → stat header + transaction list ---------------
await pg.evaluate(() => { const r = [...document.querySelectorAll(".tx-tbl tbody tr.clickable")].find((x) => /CLO issuance/.test(x.textContent)); (r || document.querySelector(".tx-tbl tbody tr.clickable")).click(); });
await pg.waitForSelector(".tx-kpis .tx-kpi", { timeout: 4000 });
const dt = await pg.evaluate(() => ({
  title: (document.querySelector(".tx-title") || {}).textContent,
  kpis: document.querySelectorAll(".tx-kpi").length,
  listRows: document.querySelectorAll(".tx-list tbody tr").length,
  anySize: [...document.querySelectorAll(".tx-list td.tx-sz")].some((td) => /[$€£]/.test(td.textContent)),
  mgrLinks: document.querySelectorAll(".tx-list a.tx-mgr").length,
  srcLinks: [...document.querySelectorAll(".tx-list td.tx-hd a")].filter((a) => /^https?:/.test(a.getAttribute("href") || "")).length,
}));
check(dt.kpis === 6, `type detail shows the stat header (${dt.kpis} tiles)`);
check(dt.listRows > 0, `type detail lists its transactions (${dt.listRows})`);
check(dt.anySize, "transactions show their native disclosed size");
check(dt.mgrLinks > 0 && dt.srcLinks > 0, `each transaction links its manager profile + its source (${dt.mgrLinks} mgr, ${dt.srcLinks} src)`);

// a manager link routes into the Profiles tab
const nav = await pg.evaluate(() => (document.querySelector(".tx-list a.tx-mgr") || {}).getAttribute("href"));
check(/\/profiles\/#\/manager\//.test(nav), `manager links point into Profiles (${nav})`);

// ---- 4) back to overview + period toggle ---------------------------------
await pg.evaluate(() => document.querySelector("#tx-back").click());
await pg.waitForSelector(".tx-tbl tbody tr.clickable", { timeout: 4000 });
const twelve = await pg.evaluate(() => document.querySelectorAll(".tx-tbl tbody tr.clickable").length);
await pg.evaluate(() => document.querySelector('#tx-period .tchip[data-per="all"]').click());
await pg.waitForTimeout(200);
const allN = await pg.evaluate(() => { const foot = document.querySelector(".tx-tot"); return { rows: document.querySelectorAll(".tx-tbl tbody tr.clickable").length, total: (foot ? foot.textContent : "") }; });
check(allN.rows >= twelve, `the All-time period shows at least as many types as last-12-months (${allN.rows} ≥ ${twelve})`);

checkErrs(errs, "transactions tab");
await ctx.close();
await b.close(); srv.close();
finish();
