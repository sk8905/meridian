// Transactions tab — the covered managers' deal flow by transaction type. Checks
// the shared classifier/amount enrichment (credit/js/tx.js) against the live deal
// ledger, then the tab UI: a blue sub-tab rail (one per transaction type) → a dated
// transaction list per type, in the Profiles terminal look.
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

// ---- 2) the sub-tab rail + the default (largest) type's deal list --------
// Primary/Secondaries carry a blue sub-tab rail — one sub-tab per transaction type,
// each with its deal count, NO "Overview" — landing on the largest type's deals.
await pg.goto(base + "/v2/transactions/", { waitUntil: "load" });
await pg.waitForSelector(".tx-subnav [data-sub]", { timeout: 8000 });
await pg.waitForSelector(".tx-panes-in .tx-list tbody tr.tx-row", { timeout: 8000 });
const ov = await pg.evaluate(() => {
  const subChips = [...document.querySelectorAll(".tx-subnav [data-sub]")];
  const on = document.querySelector(".tx-subnav .tchip.is-on");
  return {
    subs: subChips.map((c) => c.textContent.trim().replace(/\s*\d+$/, "")),
    noOverview: !subChips.some((c) => /overview/i.test(c.textContent)),
    activeIsFirst: subChips.length > 0 && on === subChips[0],
    subsHaveCounts: document.querySelectorAll(".tx-subnav [data-sub] .tx-subn").length === subChips.length && subChips.length > 0,
    paneRows: document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row").length,
    // Desktop: the sub-tabs stack as a SECOND vertical rail (differing tops) beside the pane.
    subStacked: subChips.length > 1 ? Math.round(subChips[1].getBoundingClientRect().top - subChips[0].getBoundingClientRect().top) : 0,
    noPeriodChips: !document.querySelector("#tx-period"),
    modeChips: [...document.querySelectorAll("#tx-mode .tchip")].map((c) => c.textContent.trim().replace(/\s+\d+$/, "")),
    // Desktop: the mode tabs form a vertical LEFT sidebar (chips stack; rail sits left).
    railStacked: (() => { const c = [...document.querySelectorAll("#tx-mode .tchip")]; return c.length > 1 ? Math.round(c[1].getBoundingClientRect().top - c[0].getBoundingClientRect().top) : 0; })(),
    railLeft: (() => { const h = document.querySelector(".tx-dash .twire-head"), m = document.querySelector(".tx-dash .tcol-main"); return !!(h && m) && h.getBoundingClientRect().right <= m.getBoundingClientRect().left + 5 && Math.round(h.getBoundingClientRect().width) < 220; })(),
    bodyBg: getComputedStyle(document.querySelector("#tx-body")).backgroundColor,
  };
});
check(ov.subs.length >= 4, `Primary shows a sub-tab per transaction type (${ov.subs.join(", ")})`);
check(ov.noOverview, "the Overview sub-tab is removed from Primary/Secondaries");
check(ov.activeIsFirst && ov.paneRows > 0, `it lands on the first (largest) type's deals (${ov.paneRows} rows)`);
check(ov.subsHaveCounts, "each sub-tab carries its deal count");
check(ov.subStacked > 10, `desktop: the sub-tabs stack as a second vertical rail (Δtop ${ov.subStacked}px)`);
check(ov.bodyBg !== "rgba(0, 0, 0, 0)" && ov.bodyBg !== "transparent", `the pane sits on an opaque surface like the Profiles panes (${ov.bodyBg})`);
check(ov.noPeriodChips, "the Last 12 months / All time period chips are removed");
check(ov.modeChips.join(",") === "Primary,Secondaries,Credits,BDCs", `the Primary / Secondaries / Credits / BDCs nav chips are present (${ov.modeChips.join(",")})`);
check(ov.railStacked > 10, `desktop: the mode tabs stack as a vertical left rail like the Dashboard (Δtop ${ov.railStacked}px)`);
check(ov.railLeft, "desktop: the tab rail sits to the LEFT of the content (Dashboard-style sidebar)");

// ---- 3) selecting a type sub-tab → its dated deal list -------------------
await pg.evaluate(() => { const c = [...document.querySelectorAll(".tx-subnav [data-sub]")].find((x) => /Direct lending/.test(x.textContent)); if (c) c.click(); });
await pg.waitForSelector(".tx-panes-in .tx-list tbody tr.tx-row", { timeout: 4000 });
const dt = await pg.evaluate(() => {
  const exp = document.querySelector(".tx-panes-in");
  return {
    activeName: (document.querySelector(".tx-subnav .tchip.is-on") || {}).textContent || "",
    activeBar: (() => { const on = document.querySelector(".tx-subnav .tchip.is-on"); return on ? getComputedStyle(on).boxShadow : ""; })(),
    noDetailPage: !document.querySelector(".tx-back") && !document.querySelector(".tx-kpi"),
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
check(dt.activeName.includes("Direct lending"), `selecting a sub-tab activates it (${dt.activeName.trim()})`);
check(dt.activeBar && dt.activeBar !== "none" && /inset/.test(dt.activeBar), "the active sub-tab carries the blue left bar");
check(dt.noDetailPage, "no separate detail page is rendered (no back bar, no KPI tiles)");
check(dt.listRows > 0, `the pane lists the type's transactions (${dt.listRows})`);
check(/Borrower/i.test(dt.heads[0] || "") && /Sponsor/i.test(dt.heads[1] || "") && dt.heads.some((h) => /Date/i.test(h)) && dt.heads.some((h) => /Lender/i.test(h)) && dt.heads.some((h) => /Sector/i.test(h)) && dt.heads.some((h) => /Amount/i.test(h)) && /Source/i.test(dt.heads[dt.heads.length - 1] || ""),
  `columns are Borrower · Sponsor · Date · Lender · Sector · Amount · Source (${dt.heads.join(" · ")})`);
check(dt.anySize, "transactions show their native disclosed size");
check(dt.mgrLinks > 0 && dt.borrowerNamed > 0, `borrower cell is a plain name and the lender is named (${dt.borrowerNamed} borrower, ${dt.mgrLinks} lender)`);
check(dt.srcLinks > 0, `the source link sits in its own Source column (${dt.srcLinks})`);
check(dt.typed > 0, `transactions carry a Sector column (${dt.typed})`);
// Sponsor column: at least some deals name a PE sponsor distinct from the borrower.
const spon = await pg.evaluate(() => {
  const exp = document.querySelector(".tx-panes-in");
  const rows = [...exp.querySelectorAll(".tx-list tbody tr.tx-row")];
  const withSp = rows.filter((r) => { const t = (r.querySelector(".tx-sp") || {}).textContent || ""; return t.trim() && t.trim() !== "—"; });
  const s = withSp[0];
  return { n: withSp.length, diff: s ? (s.querySelector(".tx-bd")?.textContent || "").replace("▸", "").trim() !== (s.querySelector(".tx-sp")?.textContent || "").trim() : false };
});
check(spon.n > 0 && spon.diff, `a Sponsor column names the PE backer, distinct from the borrower (${spon.n} sponsored)`);
// a manager link routes into the Profiles tab
const nav = await pg.evaluate(() => (document.querySelector(".tx-panes-in .tx-list a.tx-mgr") || {}).getAttribute("href"));
check(/\/profiles\/#\/manager\//.test(nav), `manager links point into Profiles (${nav})`);

// ---- 3b) asset-class sub-category chips filter the pane ------------------
const sub = await pg.evaluate(() => {
  const exp = document.querySelector(".tx-panes-in");
  const chips = [...exp.querySelectorAll(".tx-secchip")];
  return { n: chips.length, hasAll: chips.some((c) => c.dataset.sec === "all"), labels: chips.slice(0, 5).map((c) => c.textContent.trim()) };
});
check(sub.n > 1 && sub.hasAll, `the pane shows asset-class sub-category chips (${sub.n}: ${sub.labels.join(" · ")})`);
const filt = await pg.evaluate(async () => {
  const exp = document.querySelector(".tx-panes-in");
  const before = exp.querySelectorAll(".tx-list tr.tx-row").length;
  [...exp.querySelectorAll(".tx-secchip")].find((c) => c.dataset.sec !== "all").click();
  await new Promise((r) => setTimeout(r, 80));
  const exp2 = document.querySelector(".tx-panes-in");
  return { before, after: exp2.querySelectorAll(".tx-list tr.tx-row").length, on: [...exp2.querySelectorAll(".tx-secchip.is-on")].some((c) => c.dataset.sec !== "all") };
});
check(filt.on && filt.after > 0 && filt.after <= filt.before, `a sub-category chip filters the pane (${filt.after}/${filt.before})`);

// ---- 3c) "Group by lender / investor" toggle on the sub-category row ------
// A button on the far right of the chips row buckets the deals by lender, each
// group headed by the lender name + count; toggling off restores the flat list.
const grp = await pg.evaluate(async () => {
  let exp = document.querySelector(".tx-panes-in");
  const allChip = exp.querySelector('.tx-secchip[data-sec="all"]'); if (allChip) allChip.click();
  await new Promise((r) => setTimeout(r, 80));
  exp = document.querySelector(".tx-panes-in");
  const btn = exp.querySelector(".tx-grpbtn");
  const sh = exp.querySelector(".tx-subhead");
  const rightAligned = btn && sh ? (sh.getBoundingClientRect().right - btn.getBoundingClientRect().right) < 3 : false;
  const rowsFlat = exp.querySelectorAll(".tx-list tbody tr.tx-row").length;
  const groupsFlat = exp.querySelectorAll(".tx-list tr.tx-grp").length;
  btn.click();
  await new Promise((r) => setTimeout(r, 80));
  const e2 = document.querySelector(".tx-panes-in");
  const heads = [...e2.querySelectorAll(".tx-list tr.tx-grp")];
  const counts = heads.map((h) => +(h.querySelector(".tx-grp-n")?.textContent || 0));
  const named = heads.every((h) => (h.querySelector(".tx-grp-nm")?.textContent || "").trim().length > 0);
  const sumCounts = counts.reduce((a, b) => a + b, 0);
  const descending = counts.every((c, i) => i === 0 || c <= counts[i - 1]);
  const on = e2.querySelector(".tx-grpbtn").classList.contains("is-on");
  const rowsGrouped = e2.querySelectorAll(".tx-list tbody tr.tx-row").length;
  e2.querySelector(".tx-grpbtn").click();   // toggle back off for later steps
  await new Promise((r) => setTimeout(r, 80));
  const e3 = document.querySelector(".tx-panes-in");
  return { hasBtn: !!btn, label: (btn.textContent || "").trim(), rightAligned, groupsFlat, groupsAfter: heads.length,
    named, sumCounts, rowsFlat, rowsGrouped, descending, on, offAgain: e3.querySelectorAll(".tx-list tr.tx-grp").length };
});
check(grp.hasBtn && /group by lender/i.test(grp.label), `a "Group by lender" button sits on the chips row (${grp.label})`);
check(grp.rightAligned, "the group-by button is right-aligned on the chips row");
check(grp.groupsFlat === 0 && grp.groupsAfter > 1, `toggling on buckets the deals into lender groups (${grp.groupsAfter})`);
check(grp.named && grp.descending, "each group is headed by its lender name, most-active first");
check(grp.sumCounts === grp.rowsFlat && grp.rowsGrouped === grp.rowsFlat, `grouping keeps every deal (${grp.rowsGrouped}/${grp.rowsFlat}, counts ${grp.sumCounts})`);
check(grp.on && grp.offAgain === 0, "toggling the button off restores the flat list");

// a transaction row expands to its full-width narrative detail
const expd = await pg.evaluate(async () => {
  let e = document.querySelector(".tx-panes-in");
  const allChip = e.querySelector('.tx-secchip[data-sec="all"]'); if (allChip) allChip.click();
  await new Promise((r) => setTimeout(r, 80));
  e = document.querySelector(".tx-panes-in");
  const row = e.querySelector(".tx-list tr.tx-row"); let det = row.nextElementSibling;
  const before = det.hidden; row.click(); det = row.nextElementSibling;
  const td = det.querySelector("td");
  return {
    before, after: det.hidden, isExp: det.classList.contains("tx-exp"),
    noBox: det.querySelectorAll(".tx-fields").length === 0,           // the snapshot box is gone
    fullWidth: td ? td.getAttribute("colspan") : null,               // the detail spans every column
  };
});
check(expd.isExp && expd.before === true && expd.after === false, "a transaction row expands to its detail");
check(expd.noBox && expd.fullWidth === "7", `the expanded detail is a full-width narrative — no snapshot box (colspan ${expd.fullWidth})`);

// ---- 4) $1–15bn AUM focus toggle -----------------------------------------
// A target-band filter (identical to the Profiles league toggle) narrows every
// view — the sub-tab counts + each type's list — to deals by managers whose group
// AUM is $1–15bn.
const totOff = await pg.evaluate(() => [...document.querySelectorAll(".tx-subnav [data-sub] .tx-subn")].reduce((a, e) => a + (+e.textContent || 0), 0));
const foc = await pg.evaluate(() => {
  const btn = document.querySelector("#tx-focus"); if (!btn) return { present: false };
  btn.click();
  return {
    present: true,
    on: btn.getAttribute("aria-pressed") === "true" && btn.classList.contains("is-on"),
    label: btn.textContent.trim(),
    inSearch: !!btn.closest(".thead-search"), noBar: !document.querySelector(".aum-focus .aum-focus-l"),
    tot: [...document.querySelectorAll(".tx-subnav [data-sub] .tx-subn")].reduce((a, e) => a + (+e.textContent || 0), 0),
  };
});
check(foc.present && foc.on, "Transactions: a $1–15bn AUM focus toggle is present and turns on (active state marks the filter)");
// The $1–15bn button is merged into the search row (the "AUM focus" label dropped), matching the Profiles panes.
check(foc.label === "$1–15bn" && foc.inSearch && foc.noBar, `Transactions: the AUM focus button is merged into the search row ("${foc.label}")`);
check(foc.tot > 0 && foc.tot <= totOff, `Transactions: the focus narrows the deal universe to the target band (${foc.tot} ≤ ${totOff})`);
// with the focus on, every deal listed in the active type pane is by an in-band manager
const inband = await pg.evaluate(async () => {
  const D = await import("/credit/js/data.js");
  const aumOf = (m) => (!m || m.notAum) ? null : (m.aumTotal != null ? m.aumTotal : m.aum);
  const set = new Set(D.managers.filter((m) => { const a = aumOf(m); return a != null && a >= 1 && a <= 15; }).map((m) => m.id));
  const ids = [...document.querySelectorAll(".tx-panes-in .tx-list a.tx-mgr")].map((a) => a.dataset.id).filter(Boolean);
  return { n: ids.length, allIn: ids.length > 0 && ids.every((id) => set.has(id)) };
});
check(inband.allIn, `Transactions: with focus on, every listed deal is a $1–15bn manager's (${inband.n} links)`);

// ---- 5) search — a flat list of matching deals across the group ----------
// (Typing renders the flat search list, replacing the sub-tab view.)
await pg.waitForTimeout(120);
const search = await pg.evaluate(async () => {
  const inp = document.querySelector("#tx-q"); if (!inp) return { present: false };
  inp.value = "lending"; inp.dispatchEvent(new Event("input", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 160));
  return { present: true, rows: document.querySelectorAll(".tx-list tr.tx-row").length, title: (document.querySelector(".tx-title") || {}).textContent || "", tabbedGone: !document.querySelector(".tx-tabbed") };
});
check(search.present, "Transactions: a search box is present");
check(/search/i.test(search.title) && search.rows > 0 && search.tabbedGone, `Transactions: typing filters to a flat list of matching deals (${search.rows} rows)`);
const cleared = await pg.evaluate(async () => {
  const inp = document.querySelector("#tx-q"); inp.value = ""; inp.dispatchEvent(new Event("input", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 160));
  return { rows: document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row").length, tabbed: !!document.querySelector(".tx-tabbed") };
});
check(cleared.tabbed && cleared.rows > 0, `Transactions: clearing the search restores the type view (${cleared.rows} rows)`);

checkErrs(errs, "transactions tab");
await ctx.close();

// ---- 6) phone: the search bar stays pinned on scroll ---------------------
// A short viewport forces the page to scroll; the search row (and the Primary /
// Secondaries / Credits tabs above it) must stay locked at the top rather than
// scrolling away — the inner terminal scroll container used to trap the sticky.
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
  check(Math.abs(scrolled.search.top - scrolled.tabs.bot) <= 2, `phone: the search bar pins flush under the Primary / Secondaries / Credits tabs (search ${scrolled.search.top} ≈ tabs bottom ${scrolled.tabs.bot})`);
  checkErrs(p.errs, "transactions phone sticky search");
  await p.ctx.close();
}

// ---- 7) phone: types are on-screen OPTIONS (no sub-tab strip); a picked type's
// deal list FITS the screen — all columns scroll inside its own .tleague-wrap,
// not squashing the borrower into a ragged char-by-char wrap, and the page itself
// must NOT gain a horizontal scrollbar.
{
  const p = await open(b, PHONE_SHORT, base + "/v2/transactions/");
  await p.pg.waitForSelector(".tx-typelist .tx-typeopt", { timeout: 8000 });
  const opts = await p.pg.evaluate(() => {
    const o = [...document.querySelectorAll(".tx-typelist .tx-typeopt")];
    const r = { n: o.length, noStrip: !document.querySelector(".tx-subnav") };
    (o.find((x) => /Direct lending/.test(x.textContent)) || o[0]).click();
    return r;
  });
  check(opts.n >= 4 && opts.noStrip, `phone: transaction types shown as on-screen options, no sub-tab strip (${opts.n} options)`);
  await p.pg.waitForSelector(".tx-panes-in .tx-list tbody tr.tx-row", { timeout: 8000 });
  await p.pg.waitForTimeout(400);
  const hasBack = await p.pg.evaluate(() => !!document.querySelector(".tx-phone-back"));
  check(hasBack, "phone: a back control returns from a type's deals to the options list");
  const drill = await p.pg.evaluate(() => {
    const t = document.querySelector(".tx-panes-in .tx-list");
    const wrap = t.closest(".tleague-wrap");
    const row = t.querySelector("tbody tr.tx-row");
    const cells = [...row.children].filter((td) => getComputedStyle(td).display !== "none").map((td) => td.className.replace(/\s*tl-n\s*/, "").trim());
    return { vw: window.innerWidth, tblW: Math.round(t.getBoundingClientRect().width),
      wrapScrolls: wrap ? wrap.scrollWidth > wrap.clientWidth + 1 : false,
      wrapFits: wrap ? Math.round(wrap.getBoundingClientRect().width) <= window.innerWidth + 1 : false,
      pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, cells };
  });
  check(drill.wrapScrolls && drill.wrapFits, `phone: the deal list scrolls horizontally inside its wrap (tbl ${drill.tblW} > vw ${drill.vw}, wrap fits screen)`);
  check(drill.pageOverflow <= 1, `phone: the page itself does not scroll sideways (overflow ${drill.pageOverflow}px)`);
  check(drill.cells.length === 7 && ["tx-bd", "tx-sp", "tx-dt", "tx-mg", "tx-cat", "tx-sz", "tx-src2"].every((c) => drill.cells.includes(c)),
    `phone: the deal list keeps all seven columns to scroll through (${drill.cells.join(", ")})`);
  // The sub-category chips sit on ONE row that scrolls horizontally (like the
  // home-page wire filters); the Group-by-lender button stays pinned to the right
  // of that row, on the same line, never overlapping a chip.
  const gb = await p.pg.evaluate(() => {
    const sh = document.querySelector(".tx-panes-in .tx-subhead");
    const btn = sh && sh.querySelector(".tx-grpbtn");
    const strip = sh && sh.querySelector(".tx-secfilter");
    const chips = sh ? [...sh.querySelectorAll(".tx-secchip")] : [];
    if (!sh || !btn || !strip) return null;
    const s = sh.getBoundingClientRect(), r = btn.getBoundingClientRect(), st = strip.getBoundingClientRect();
    const oneRow = chips.every((c) => Math.abs(c.getBoundingClientRect().top - chips[0].getBoundingClientRect().top) <= 1);
    return {
      sameRow: Math.abs(r.top - s.top) <= 2, rightPinned: (s.right - r.right) <= 3,
      stripScrolls: strip.scrollWidth > strip.clientWidth + 1,   // chips overflow → horizontal scroll
      noOverlap: st.right <= r.left + 1,                          // strip ends before the button starts
      oneRow, chips: chips.length,
    };
  });
  check(gb && gb.sameRow && gb.rightPinned, `phone: the Group-by button is pinned right of the filter row (sameRow ${gb && gb.sameRow}, right ${gb && gb.rightPinned})`);
  check(gb && gb.oneRow && gb.stripScrolls && gb.noOverlap, `phone: the sub-category chips are one horizontally-scrolling row, not overlapping the button (oneRow ${gb && gb.oneRow}, scrolls ${gb && gb.stripScrolls})`);
  checkErrs(p.errs, "transactions phone column fit");
  await p.ctx.close();
}

await b.close(); srv.close();
finish();
