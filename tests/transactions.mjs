// Transactions tab — the covered managers' deal flow by transaction type. Checks
// the shared classifier/amount enrichment (credit/js/tx.js) against the live deal
// ledger, then the tab UI: an overview league table of the types → a per-type
// stat header + dated transaction list, in the Profiles terminal look.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";
const PHONE_SHORT = { viewport: { width: 390, height: 460 }, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone)" };

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
await pg.waitForTimeout(400);

// ---- 1) enrichment layer -------------------------------------------------
const tx = await pg.evaluate(async () => {
  const [T, D] = await Promise.all([import("/credit/js/tx.js?v=20260907-1"), import("/credit/js/data.js")]);
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
  noPeriodChips: !document.querySelector("#tx-period"),
  modeChips: [...document.querySelectorAll("#tx-mode .tchip")].map((c) => c.textContent.trim().replace(/\s+\d+$/, "")),
  // Desktop: the mode tabs form a vertical LEFT sidebar (like the Dashboard rail) —
  // chips stack (differing tops) and the .twire-head rail sits left of the content.
  railStacked: (() => { const c = [...document.querySelectorAll("#tx-mode .tchip")]; return c.length > 1 ? Math.round(c[1].getBoundingClientRect().top - c[0].getBoundingClientRect().top) : 0; })(),
  railLeft: (() => { const h = document.querySelector(".tx-dash .twire-head"), m = document.querySelector(".tx-dash .tcol-main"); return !!(h && m) && h.getBoundingClientRect().right <= m.getBoundingClientRect().left + 5 && Math.round(h.getBoundingClientRect().width) < 220; })(),
  // Every league row is the SAME height (matches the Profiles panes — single-line
  // rows are normalised up to the chip-row height), so the vertical rhythm is even.
  rowHs: [...new Set([...document.querySelectorAll(".tx-tbl tbody tr.clickable")].map((tr) => Math.round(tr.getBoundingClientRect().height)))],
  // Type names render at the same weight as the Profiles league names (regular),
  // not bold — one type scale across the two tabs.
  nameFW: (() => { const e = document.querySelector(".tx-tbl tbody tr .tx-tnm"); return e ? getComputedStyle(e).fontWeight : ""; })(),
  nameFS: (() => { const e = document.querySelector(".tx-tbl tbody tr .tx-tnm"); return e ? getComputedStyle(e).fontSize : ""; })(),
  // Cells + headers are LEFT-aligned, matching the Profiles league format (which
  // left-aligns its whole table) rather than right-aligned numeric columns.
  aligns: [...document.querySelectorAll(".tx-tbl thead th, .tx-tbl tbody tr.clickable:first-child td")].map((c) => getComputedStyle(c).textAlign),
  // The body sits on the opaque surface (like the Profiles panes), not the
  // transparent grey ground; and the sticky column header sits flush at the top
  // of the body — no 28px blank band above it.
  bodyBg: getComputedStyle(document.querySelector("#tx-body")).backgroundColor,
  headOffset: (() => { const th = document.querySelector(".tx-tbl thead th"), thead = document.querySelector(".tx-tbl thead"); return th && thead ? Math.round(th.getBoundingClientRect().top - thead.getBoundingClientRect().top) : -1; })(),
}));
check(ov.rows >= 6, `overview lists the transaction types as a league table (${ov.rows})`);
check(ov.rowHs.length === 1, `overview rows share one uniform height, matching the Profiles league (${ov.rowHs.join(", ")}px)`);
check(ov.nameFS === "11px" && (ov.nameFW === "400" || ov.nameFW === "normal"), `type names match the Profiles league type (11px regular, got ${ov.nameFS}/${ov.nameFW})`);
check(ov.aligns.length > 0 && ov.aligns.every((a) => a === "left" || a === "start"), `every header + cell is left-aligned, matching the Profiles league (${[...new Set(ov.aligns)].join(", ")})`);
check(ov.bodyBg !== "rgba(0, 0, 0, 0)" && ov.bodyBg !== "transparent", `the table body sits on an opaque surface like the Profiles panes (${ov.bodyBg})`);
check(ov.headOffset === 0, `the column header sits flush at the top — no blank band above it (offset ${ov.headOffset}px)`);
check(ov.hasTotal, "overview carries an 'All types' total row");
check(ov.hasTrend && ov.hasVol, "overview shows a 12mo-vs-prior momentum mark and a ≈USD volume per type");
check(ov.noPeriodChips, "the Last 12 months / All time period chips are removed");
check(ov.modeChips.join(",") === "Deal flow,Credits", `the Deal flow / Credits mode chips are present (${ov.modeChips.join(",")})`);
check(ov.railStacked > 10, `desktop: the mode tabs stack as a vertical left rail like the Dashboard (Δtop ${ov.railStacked}px)`);
check(ov.railLeft, "desktop: the tab rail sits to the LEFT of the content (Dashboard-style sidebar)");

// ---- 3) drill into a type → stat header + transaction list ---------------
await pg.evaluate(() => { const r = [...document.querySelectorAll(".tx-tbl tbody tr.clickable")].find((x) => /CLO issuance/.test(x.textContent)); (r || document.querySelector(".tx-tbl tbody tr.clickable")).click(); });
await pg.waitForSelector(".tx-kpis .tx-kpi", { timeout: 4000 });
const dt = await pg.evaluate(() => ({
  title: (document.querySelector(".tx-title") || {}).textContent,
  kpis: document.querySelectorAll(".tx-kpi").length,
  // Table columns: Date · Borrower/company · Lender/investor · Type · Amount · Source.
  heads: [...document.querySelectorAll(".tx-list thead th")].map((h) => h.textContent.trim()),
  listRows: document.querySelectorAll(".tx-list tbody tr.tx-row").length,
  anySize: [...document.querySelectorAll(".tx-list td.tx-sz")].some((td) => /[$€£]/.test(td.textContent)),
  mgrLinks: document.querySelectorAll(".tx-list a.tx-mgr").length,
  // Borrower cell is the NAME only (no link); the source link is its own column.
  borrowerNamed: [...document.querySelectorAll(".tx-list td.tx-bd")].filter((td) => td.textContent.trim() && !td.querySelector("a")).length,
  srcLinks: [...document.querySelectorAll(".tx-list td.tx-src2 a")].filter((a) => /^https?:/.test(a.getAttribute("href") || "")).length,
  typed: [...document.querySelectorAll(".tx-list td.tx-cat")].filter((td) => td.textContent.trim() && td.textContent.trim() !== "—").length,
}));
check(dt.kpis === 6, `type detail shows the stat header (${dt.kpis} tiles)`);
check(dt.listRows > 0, `type detail lists its transactions (${dt.listRows})`);
check(/Borrower/i.test(dt.heads[1] || "") && dt.heads.some((h) => /Lender/i.test(h)) && dt.heads.some((h) => /Type/i.test(h)) && dt.heads.some((h) => /Amount/i.test(h)) && /Source/i.test(dt.heads[dt.heads.length - 1] || ""),
  `columns are Date · Borrower · Lender · Type · Amount · Source (${dt.heads.join(" · ")})`);
check(dt.anySize, "transactions show their native disclosed size");
check(dt.mgrLinks > 0 && dt.borrowerNamed > 0, `borrower cell is a plain name and the lender is named (${dt.borrowerNamed} borrower, ${dt.mgrLinks} lender)`);
check(dt.srcLinks > 0, `the source link sits in its own Source column (${dt.srcLinks})`);
check(dt.typed > 0, `transactions carry a deal-type/category column (${dt.typed})`);

// a manager link routes into the Profiles tab
const nav = await pg.evaluate(() => (document.querySelector(".tx-list a.tx-mgr") || {}).getAttribute("href"));
check(/\/profiles\/#\/manager\//.test(nav), `manager links point into Profiles (${nav})`);

// ---- 3b) asset-class sub-category chips + expandable detail ---------------
const sub = await pg.evaluate(() => {
  const chips = [...document.querySelectorAll(".tx-secchip")];
  return { n: chips.length, hasAll: chips.some((c) => c.dataset.sec === "all"), labels: chips.slice(0, 5).map((c) => c.textContent.trim()) };
});
check(sub.n > 1 && sub.hasAll, `type detail shows asset-class sub-category chips (${sub.n}: ${sub.labels.join(" · ")})`);
const filt = await pg.evaluate(() => {
  const before = document.querySelectorAll(".tx-list tr.tx-row").length;
  const chip = [...document.querySelectorAll(".tx-secchip")].find((c) => c.dataset.sec !== "all");
  chip.click();
  return { before, after: document.querySelectorAll(".tx-list tr.tx-row").length, on: [...document.querySelectorAll(".tx-secchip.is-on")].some((c) => c.dataset.sec !== "all") };
});
check(filt.on && filt.after > 0 && filt.after <= filt.before, `a sub-category chip filters the list (${filt.after}/${filt.before})`);
const exp = await pg.evaluate(() => {
  const allChip = document.querySelector('.tx-secchip[data-sec="all"]'); if (allChip) allChip.click();
  const row = document.querySelector(".tx-list tr.tx-row"), det = row.nextElementSibling;
  const before = det.hidden; row.click();
  return { before, after: row.nextElementSibling.hidden, fields: det.querySelectorAll(".tx-fields dt").length, isExp: det.classList.contains("tx-exp") };
});
check(exp.isExp && exp.before === true && exp.after === false && exp.fields >= 4, `a transaction expands to its detail — lender · amount · date · sub-category (${exp.fields} fields)`);

// ---- 4) back to the overview ---------------------------------------------
await pg.evaluate(() => document.querySelector("#tx-back").click());
await pg.waitForSelector(".tx-tbl tbody tr.clickable", { timeout: 4000 });
check(await pg.evaluate(() => document.querySelectorAll(".tx-tbl tbody tr.clickable").length) >= 6, "back returns to the transaction-type overview");

// ---- 5) $1–15bn AUM focus toggle -----------------------------------------
// A target-band filter (identical to the Profiles league toggle) narrows every
// view — overview + type detail — to deals by managers whose group AUM is $1–15bn.
const totOff = await pg.evaluate(() => parseInt(((document.querySelector(".tx-tot .tl-n") || {}).textContent || "0"), 10));
const foc = await pg.evaluate(() => {
  const btn = document.querySelector("#tx-focus"); if (!btn) return { present: false };
  btn.click();
  return {
    present: true,
    on: btn.getAttribute("aria-pressed") === "true" && btn.classList.contains("is-on"),
    label: btn.textContent.trim(),
    inSearch: !!btn.closest(".thead-search"), noBar: !document.querySelector(".aum-focus .aum-focus-l"),
    tot: parseInt(((document.querySelector(".tx-tot .tl-n") || {}).textContent || "0"), 10),
  };
});
check(foc.present && foc.on, "Transactions: a $1–15bn AUM focus toggle is present and turns on (active state marks the filter)");
// The $1–15bn button is now merged into the search row (the "AUM focus" label dropped), matching the Profiles panes.
check(foc.label === "$1–15bn" && foc.inSearch && foc.noBar, `Transactions: the AUM focus button is merged into the search row ("${foc.label}")`);
check(foc.tot > 0 && foc.tot <= totOff, `Transactions: the focus narrows the deal universe to the target band (${foc.tot} ≤ ${totOff})`);
// with the focus on, every deal listed under a type is by an in-band manager
const inband = await pg.evaluate(async () => {
  const D = await import("/credit/js/data.js");
  const aumOf = (m) => (!m || m.notAum) ? null : (m.aumTotal != null ? m.aumTotal : m.aum);
  const set = new Set(D.managers.filter((m) => { const a = aumOf(m); return a != null && a >= 1 && a <= 15; }).map((m) => m.id));
  const r = document.querySelector(".tx-tbl tbody tr.clickable"); if (r) r.click();
  await new Promise((res) => setTimeout(res, 120));
  const ids = [...document.querySelectorAll(".tx-list a.tx-mgr")].map((a) => a.dataset.id).filter(Boolean);
  return { n: ids.length, allIn: ids.length > 0 && ids.every((id) => set.has(id)) };
});
check(inband.allIn, `Transactions: with focus on, every listed deal is a $1–15bn manager's (${inband.n} links)`);

// ---- 6) search — a flat list of matching deals across all types -----------
await pg.evaluate(() => { const bk = document.querySelector("#tx-back"); if (bk) bk.click(); }); // back to the overview first
await pg.waitForTimeout(120);
const search = await pg.evaluate(async () => {
  const inp = document.querySelector("#tx-q"); if (!inp) return { present: false };
  inp.value = "lending"; inp.dispatchEvent(new Event("input", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 160));
  return { present: true, rows: document.querySelectorAll(".tx-list tr.tx-row").length, title: (document.querySelector(".tx-title") || {}).textContent || "", overviewGone: !document.querySelector(".tx-tbl tbody tr.clickable") };
});
check(search.present, "Transactions: a search box is present");
check(/search/i.test(search.title) && search.rows > 0 && search.overviewGone, `Transactions: typing filters to a flat list of matching deals (${search.rows} rows)`);
const cleared = await pg.evaluate(async () => {
  const inp = document.querySelector("#tx-q"); inp.value = ""; inp.dispatchEvent(new Event("input", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 160));
  return { league: document.querySelectorAll(".tx-tbl tbody tr.clickable").length };
});
check(cleared.league >= 6, `Transactions: clearing the search restores the type overview (${cleared.league})`);

checkErrs(errs, "transactions tab");
await ctx.close();

// ---- 7) phone: the search bar stays pinned on scroll ---------------------
// A short viewport forces the page to scroll; the search row (and the Deal flow /
// Credits tabs above it) must stay locked at the top rather than scrolling away —
// the inner terminal scroll container used to trap the sticky and it vanished.
{
  const p = await open(b, PHONE_SHORT, base + "/v2/transactions/");
  await p.pg.waitForTimeout(1200);
  const at = () => p.pg.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top), bot: Math.round(b.bottom) }; };
    return { tabs: r(".tx-dash .twire-head"), search: r("#tx-flow-search"), maxSY: document.documentElement.scrollHeight - window.innerHeight };
  });
  const rest = await at();
  check(rest.maxSY > 40, `phone: the transactions page is scrollable in the short viewport (${rest.maxSY}px)`);
  await p.pg.evaluate(() => window.scrollTo(0, 300));
  await p.pg.waitForTimeout(300);
  const scrolled = await at();
  check(Math.abs(rest.search.top - scrolled.search.top) <= 1 && scrolled.search.top >= 0, `phone: the search bar stays pinned on scroll (top ${rest.search.top}→${scrolled.search.top})`);
  check(Math.abs(scrolled.search.top - scrolled.tabs.bot) <= 2, `phone: the search bar pins flush under the Deal flow / Credits tabs (search ${scrolled.search.top} ≈ tabs bottom ${scrolled.tabs.bot})`);
  checkErrs(p.errs, "transactions phone sticky search");
  await p.ctx.close();
}

await b.close(); srv.close();
finish();
