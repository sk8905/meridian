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
  // Type names render at the same weight as the Profiles league names (bold —
  // the first column of every league/data table is the only bold column),
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
check(ov.nameFS === "11.5px" && (ov.nameFW === "700" || ov.nameFW === "bold"), `type names are the bold first column (11.5px bold, got ${ov.nameFS}/${ov.nameFW})`);
check(ov.aligns.length > 0 && ov.aligns.every((a) => a === "left" || a === "start"), `every header + cell is left-aligned, matching the Profiles league (${[...new Set(ov.aligns)].join(", ")})`);
check(ov.bodyBg !== "rgba(0, 0, 0, 0)" && ov.bodyBg !== "transparent", `the table body sits on an opaque surface like the Profiles panes (${ov.bodyBg})`);
check(ov.headOffset === 0, `the column header sits flush at the top — no blank band above it (offset ${ov.headOffset}px)`);
check(ov.hasTotal, "overview carries an 'All types' total row");
check(ov.hasTrend && ov.hasVol, "overview shows a 12mo-vs-prior momentum mark and a ≈USD volume per type");
check(ov.noPeriodChips, "the Last 12 months / All time period chips are removed");
check(ov.modeChips.join(",") === "Deal flow,Credits", `the Deal flow / Credits mode chips are present (${ov.modeChips.join(",")})`);
check(ov.railStacked > 10, `desktop: the mode tabs stack as a vertical left rail like the Dashboard (Δtop ${ov.railStacked}px)`);
check(ov.railLeft, "desktop: the tab rail sits to the LEFT of the content (Dashboard-style sidebar)");

// ---- 3) expand a type → an inline, indented sub-list of its deals --------
// Clicking a transaction type opens its deals as an indented accordion IN PLACE
// (the overview stays on the page) instead of navigating to a separate detail page.
await pg.evaluate(() => { const r = [...document.querySelectorAll(".tx-tbl tbody tr.clickable")].find((x) => /CLO issuance/.test(x.textContent)); (r || document.querySelector(".tx-tbl tbody tr.clickable")).click(); });
await pg.waitForSelector(".tx-typeexp:not([hidden]) .tx-list tbody tr.tx-row", { timeout: 4000 });
const dt = await pg.evaluate(() => {
  const exp = document.querySelector(".tx-typeexp:not([hidden])");
  const openRow = exp && exp.previousElementSibling;
  return {
    overviewStays: document.querySelectorAll(".tx-tbl tbody tr.clickable").length,
    noDetailPage: !document.querySelector(".tx-back") && !document.querySelector(".tx-kpi"),
    rowOpen: !!(openRow && openRow.classList.contains("is-open") && openRow.getAttribute("aria-expanded") === "true"),
    indentPx: parseInt(getComputedStyle(exp.querySelector(".tx-typeexp-in")).paddingLeft, 10) || 0,
    // Table columns (reordered): Borrower/company · Date · Lender/investor · Type · Amount · Source.
    heads: [...exp.querySelectorAll(".tx-list thead th")].map((h) => h.textContent.trim()),
    listRows: exp.querySelectorAll(".tx-list tbody tr.tx-row").length,
    anySize: [...exp.querySelectorAll(".tx-list td.tx-sz")].some((td) => /[$€£]/.test(td.textContent)),
    mgrLinks: exp.querySelectorAll(".tx-list a.tx-mgr").length,
    // Borrower cell is the NAME only (no link); the source link is its own column.
    borrowerNamed: [...exp.querySelectorAll(".tx-list td.tx-bd")].filter((td) => td.textContent.trim() && !td.querySelector("a")).length,
    srcLinks: [...exp.querySelectorAll(".tx-list td.tx-src2 a")].filter((a) => /^https?:/.test(a.getAttribute("href") || "")).length,
    typed: [...exp.querySelectorAll(".tx-list td.tx-cat")].filter((td) => td.textContent.trim() && td.textContent.trim() !== "—").length,
  };
});
check(dt.overviewStays >= 6, `the type overview stays — the deals open inline, not on a new page (${dt.overviewStays} types)`);
check(dt.noDetailPage, "no separate detail page is rendered (no back bar, no KPI tiles)");
check(dt.rowOpen, "the clicked type row is marked open (caret rotates, aria-expanded=true)");
check(dt.indentPx > 0, `the sub-list is indented beneath its type (${dt.indentPx}px)`);
check(dt.listRows > 0, `the sub-list lists the type's transactions (${dt.listRows})`);
check(/Borrower/i.test(dt.heads[0] || "") && /Sponsor/i.test(dt.heads[1] || "") && dt.heads.some((h) => /Date/i.test(h)) && dt.heads.some((h) => /Lender/i.test(h)) && dt.heads.some((h) => /Sector/i.test(h)) && dt.heads.some((h) => /Amount/i.test(h)) && /Source/i.test(dt.heads[dt.heads.length - 1] || ""),
  `columns are Borrower · Sponsor · Date · Lender · Sector · Amount · Source (${dt.heads.join(" · ")})`);
check(dt.anySize, "transactions show their native disclosed size");
check(dt.mgrLinks > 0 && dt.borrowerNamed > 0, `borrower cell is a plain name and the lender is named (${dt.borrowerNamed} borrower, ${dt.mgrLinks} lender)`);
check(dt.srcLinks > 0, `the source link sits in its own Source column (${dt.srcLinks})`);
check(dt.typed > 0, `transactions carry a Sector column (${dt.typed})`);
// Sponsor column: at least some deals name a PE sponsor distinct from the borrower.
const spon = await pg.evaluate(() => {
  const exp = document.querySelector(".tx-typeexp:not([hidden])");
  const rows = [...exp.querySelectorAll(".tx-list tbody tr.tx-row")];
  const withSp = rows.filter((r) => { const t = (r.querySelector(".tx-sp") || {}).textContent || ""; return t.trim() && t.trim() !== "—"; });
  const s = withSp[0];
  return { has: !!s.querySelector(".tx-sp"), n: withSp.length,
    diff: s ? (s.querySelector(".tx-bd")?.textContent || "").replace("▸", "").trim() !== (s.querySelector(".tx-sp")?.textContent || "").trim() : false };
});
check(spon.n > 0 && spon.diff, `a Sponsor column names the PE backer, distinct from the borrower (${spon.n} sponsored)`);

// a manager link routes into the Profiles tab
const nav = await pg.evaluate(() => (document.querySelector(".tx-typeexp:not([hidden]) .tx-list a.tx-mgr") || {}).getAttribute("href"));
check(/\/profiles\/#\/manager\//.test(nav), `manager links point into Profiles (${nav})`);

// ---- 3b) asset-class sub-category chips + expandable detail (in the sub-list)
const sub = await pg.evaluate(() => {
  const exp = document.querySelector(".tx-typeexp:not([hidden])");
  const chips = [...exp.querySelectorAll(".tx-secchip")];
  return { n: chips.length, hasAll: chips.some((c) => c.dataset.sec === "all"), labels: chips.slice(0, 5).map((c) => c.textContent.trim()) };
});
check(sub.n > 1 && sub.hasAll, `the sub-list shows asset-class sub-category chips (${sub.n}: ${sub.labels.join(" · ")})`);
const filt = await pg.evaluate(() => {
  const exp = document.querySelector(".tx-typeexp:not([hidden])");
  const before = exp.querySelectorAll(".tx-list tr.tx-row").length;
  [...exp.querySelectorAll(".tx-secchip")].find((c) => c.dataset.sec !== "all").click();
  const exp2 = document.querySelector(".tx-typeexp:not([hidden])");
  return { before, after: exp2.querySelectorAll(".tx-list tr.tx-row").length, on: [...exp2.querySelectorAll(".tx-secchip.is-on")].some((c) => c.dataset.sec !== "all") };
});
check(filt.on && filt.after > 0 && filt.after <= filt.before, `a sub-category chip filters the sub-list (${filt.after}/${filt.before})`);

// ---- 3c) "Group by lender / investor" toggle on the sub-category row ----------
// A button on the far right of the chips row buckets the deals by lender, each
// group headed by the lender name + count; toggling off restores the flat list.
const grp = await pg.evaluate(() => {
  const exp = document.querySelector(".tx-typeexp:not([hidden])");
  // reset the sub-category filter to All so the counts are the full set
  const allChip = exp.querySelector('.tx-secchip[data-sec="all"]'); if (allChip) allChip.click();
  const e = document.querySelector(".tx-typeexp:not([hidden])");
  const btn = e.querySelector(".tx-grpbtn");
  const sh = e.querySelector(".tx-subhead");
  // the button sits at the far right of the sub-head row
  const rightAligned = btn && sh ? (sh.getBoundingClientRect().right - btn.getBoundingClientRect().right) < 3 : false;
  const rowsFlat = e.querySelectorAll(".tx-list tbody tr.tx-row").length;
  const groupsFlat = e.querySelectorAll(".tx-list tr.tx-grp").length;
  btn.click();
  const e2 = document.querySelector(".tx-typeexp:not([hidden])");
  const heads = [...e2.querySelectorAll(".tx-list tr.tx-grp")];
  const counts = heads.map((h) => +(h.querySelector(".tx-grp-n")?.textContent || 0));
  const named = heads.every((h) => (h.querySelector(".tx-grp-nm")?.textContent || "").trim().length > 0);
  const sumCounts = counts.reduce((a, b) => a + b, 0);
  const descending = counts.every((c, i) => i === 0 || c <= counts[i - 1]);
  const on = e2.querySelector(".tx-grpbtn").classList.contains("is-on");
  const rowsGrouped = e2.querySelectorAll(".tx-list tbody tr.tx-row").length;
  e2.querySelector(".tx-grpbtn").click();   // toggle back off for later steps
  const e3 = document.querySelector(".tx-typeexp:not([hidden])");
  return { hasBtn: !!btn, label: (btn.textContent || "").trim(), rightAligned, groupsFlat, groupsAfter: heads.length,
    named, sumCounts, rowsFlat, rowsGrouped, descending, on, offAgain: e3.querySelectorAll(".tx-list tr.tx-grp").length };
});
check(grp.hasBtn && /group by lender/i.test(grp.label), `a "Group by lender" button sits on the chips row (${grp.label})`);
check(grp.rightAligned, "the group-by button is right-aligned on the chips row");
check(grp.groupsFlat === 0 && grp.groupsAfter > 1, `toggling on buckets the deals into lender groups (${grp.groupsAfter})`);
check(grp.named && grp.descending, "each group is headed by its lender name, most-active first");
check(grp.sumCounts === grp.rowsFlat && grp.rowsGrouped === grp.rowsFlat, `grouping keeps every deal (${grp.rowsGrouped}/${grp.rowsFlat}, counts ${grp.sumCounts})`);
check(grp.on && grp.offAgain === 0, "toggling the button off restores the flat list");

const exp = await pg.evaluate(() => {
  const e = document.querySelector(".tx-typeexp:not([hidden])");
  const allChip = e.querySelector('.tx-secchip[data-sec="all"]'); if (allChip) allChip.click();
  const e2 = document.querySelector(".tx-typeexp:not([hidden])");
  const row = e2.querySelector(".tx-list tr.tx-row"); let det = row.nextElementSibling;
  const before = det.hidden; row.click(); det = row.nextElementSibling;
  const td = det.querySelector("td");
  return {
    before, after: det.hidden, isExp: det.classList.contains("tx-exp"),
    noBox: det.querySelectorAll(".tx-fields").length === 0,           // the snapshot box is gone
    fullWidth: td ? td.getAttribute("colspan") : null,               // the detail spans every column
  };
});
check(exp.isExp && exp.before === true && exp.after === false, "a transaction row expands to its detail");
check(exp.noBox && exp.fullWidth === "7", `the expanded detail is a full-width narrative — no snapshot box (colspan ${exp.fullWidth})`);

// ---- 4) accordion: clicking the open type again collapses it -------------
const collapse = await pg.evaluate(() => {
  const e = document.querySelector(".tx-typeexp:not([hidden])");
  const openRow = e.previousElementSibling;
  openRow.click();                       // click the same type row again
  return { collapsed: e.hidden, rowClosed: !openRow.classList.contains("is-open"), overview: document.querySelectorAll(".tx-tbl tbody tr.clickable").length };
});
check(collapse.collapsed && collapse.rowClosed, "clicking the open type again collapses its sub-list");
check(collapse.overview >= 6, "the type overview is always present (nothing ever navigates away)");
// single-open: opening a second type collapses the first
const single = await pg.evaluate(() => {
  const rows = [...document.querySelectorAll(".tx-tbl tbody tr.clickable")];
  rows[0].click(); rows[1].click();
  const open = [...document.querySelectorAll(".tx-typeexp:not([hidden])")];
  return { openCount: open.length, matches: open.length === 1 && open[0].dataset.for === rows[1].dataset.type };
});
check(single.openCount === 1 && single.matches, "single-open accordion: opening another type collapses the previous one");
// collapse it so later sections start from a clean overview
await pg.evaluate(() => { const e = document.querySelector(".tx-typeexp:not([hidden])"); if (e) e.previousElementSibling.click(); });

// ---- 5) $1–15bn AUM focus toggle -----------------------------------------
// A target-band filter (identical to the Profiles league toggle) narrows every
// view — the overview totals + each type's inline sub-list — to deals by managers
// whose group AUM is $1–15bn.
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
  const r = document.querySelector(".tx-tbl tbody tr.clickable"); if (r) r.click();  // expand a type inline
  await new Promise((res) => setTimeout(res, 120));
  const ids = [...document.querySelectorAll(".tx-typeexp:not([hidden]) .tx-list a.tx-mgr")].map((a) => a.dataset.id).filter(Boolean);
  return { n: ids.length, allIn: ids.length > 0 && ids.every((id) => set.has(id)) };
});
check(inband.allIn, `Transactions: with focus on, every listed deal is a $1–15bn manager's (${inband.n} links)`);

// ---- 6) search — a flat list of matching deals across all types -----------
// (Typing renders the flat search list, replacing whatever type was expanded.)
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

// ---- 8) phone: the deal-flow tables FIT the screen — three columns, no h-scroll --
// The overview (Type · Deals · Volume) and, when a type is expanded, its inline
// deal list (Borrower · Date · Amount) each fit the viewport width so all three
// columns read at once, instead of the borrower column overflowing off the right.
{
  const p = await open(b, PHONE_SHORT, base + "/v2/transactions/");
  await p.pg.waitForSelector(".tx-tbl thead th", { timeout: 8000 });
  await p.pg.waitForTimeout(500);
  const over = await p.pg.evaluate(() => {
    const t = document.querySelector(".tx-tbl");
    // Count columns that actually take width — the unused ones are collapsed to 0.
    const vis = [...t.querySelectorAll(":scope > thead > tr > th")].filter((th) => th.getBoundingClientRect().width > 1).map((th) => th.textContent.trim());
    return { vw: window.innerWidth, tblW: Math.round(t.getBoundingClientRect().width), vis };
  });
  check(over.tblW <= over.vw + 1, `phone: the deal-flow overview fits the screen — no horizontal scroll (table ${over.tblW} ≤ vw ${over.vw})`);
  check(over.vis.length === 3, `phone: the overview shows exactly three columns (${over.vis.join(" · ")})`);
  // Expand a type → its inline deal list fits too, with Borrower + Date + Amount all visible.
  await p.pg.evaluate(() => { const r = document.querySelector(".tx-tbl tbody tr.clickable"); if (r) r.click(); });
  await p.pg.waitForSelector(".tx-typeexp:not([hidden]) .tx-list tbody tr.tx-row", { timeout: 4000 });
  const drill = await p.pg.evaluate(() => {
    const t = document.querySelector(".tx-typeexp:not([hidden]) .tx-list");
    const row = t.querySelector("tbody tr.tx-row");
    const cells = [...row.children].filter((td) => getComputedStyle(td).display !== "none").map((td) => td.className.replace(/\s*tl-n\s*/, "").trim());
    return { vw: window.innerWidth, tblW: Math.round(t.getBoundingClientRect().width), cells };
  });
  check(drill.tblW <= drill.vw + 1, `phone: an expanded type's deal list fits the screen (table ${drill.tblW} ≤ vw ${drill.vw})`);
  check(drill.cells.length === 3 && drill.cells.includes("tx-bd") && drill.cells.includes("tx-dt") && drill.cells.includes("tx-sz"),
    `phone: the deal list shows Borrower · Date · Amount at once (${drill.cells.join(", ")})`);
  checkErrs(p.errs, "transactions phone column fit");
  await p.ctx.close();
}

await b.close(); srv.close();
finish();
