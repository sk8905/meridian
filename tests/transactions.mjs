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
// Curated deal tags (HOUSE_STYLE R39): every dated deal is tagged, with allowed values only.
const tg = await pg.evaluate(async () => {
  const [T, D, G] = await Promise.all([import("/credit/js/tx.js"), import("/credit/js/data.js"), import("/credit/js/deal-tags.js")]);
  const countries = new Set(T.REGIONS.flatMap(([, , cs]) => cs));
  const deals = D.deals.filter((d) => d && d.date);
  const missing = deals.filter((d) => !G.DEAL_TAGS[d.id]).map((d) => d.id);
  const bad = Object.entries(G.DEAL_TAGS).filter(([, t]) => !(t.country == null || countries.has(t.country)) || !T.SECTOR_TAGS.includes(t.sector)
    || !(t.amountKind == null || ["financing", "fund", "portfolio", "ev", "aum", "other"].includes(t.amountKind))
    || !(t.event == null || ["new", "reset", "refi"].includes(t.event)) || typeof t.managerMA !== "boolean").map(([id]) => id);
  const evOnNonClo = Object.entries(G.DEAL_TAGS).filter(([id, t]) => t.event && D.deals.find((d) => d.id === id) && T.txOf(D.deals.find((d) => d.id === id)) !== "clo").map(([id]) => id);
  return { missing, bad, evOnNonClo };
});
check(!tg.missing.length, `every dated deal carries curated tags in credit/js/deal-tags.js (${tg.missing.length} untagged${tg.missing.length ? ": " + tg.missing.slice(0, 8).join(", ") : ""})`);
check(!tg.bad.length, `every deal tag uses an allowed value (${tg.bad.length} bad${tg.bad.length ? ": " + tg.bad.slice(0, 8).join(", ") : ""})`);
check(!tg.evOnNonClo.length, `a CLO event is only set on CLO issuance (${tg.evOnNonClo.join(", ") || "ok"})`);

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
    noPeriodChips: !document.querySelector(".tchip[data-period], [data-period]"),
    // The four PRIMARY nav chips carry data-mode; the transaction-type sub-tabs now
    // nest under the active one (data-sub) in the same rail, so scope to data-mode.
    modeChips: [...document.querySelectorAll("#tx-mode .tchip[data-mode]")].map((c) => c.textContent.trim().replace(/\s+\d+$/, "")),
    // Desktop: the mode tabs form a vertical LEFT sidebar (chips stack; rail sits left).
    railStacked: (() => { const c = [...document.querySelectorAll("#tx-mode .tchip[data-mode]")]; return c.length > 1 ? Math.round(c[1].getBoundingClientRect().top - c[0].getBoundingClientRect().top) : 0; })(),
    // Desktop: the type sub-tabs nest INSIDE the mode rail, beneath the active mode.
    subsNestedInRail: !!document.querySelector("#tx-mode .tx-subnav-nested [data-sub]"),
    railLeft: (() => { const h = document.querySelector(".tx-dash .twire-head"), m = document.querySelector(".tx-dash .tcol-main"); return !!(h && m) && h.getBoundingClientRect().right <= m.getBoundingClientRect().left + 5 && Math.round(h.getBoundingClientRect().width) < 220; })(),
    bodyBg: getComputedStyle(document.querySelector("#tx-body")).backgroundColor,
    // The deal NAME cell is WHITE but NOT bold (the bold was removed, matching Profiles).
    nameWt: (() => { const nm = document.querySelector(".tx-panes-in .tx-list tbody tr.tx-row td.tx-bd"); return nm ? parseInt(getComputedStyle(nm).fontWeight, 10) : null; })(),
  };
});
check(ov.nameWt != null && ov.nameWt <= 400, `Transactions: the deal name is NOT bold — normal weight (${ov.nameWt})`);
check(ov.subs.length >= 4, `Primary shows a sub-tab per transaction type (${ov.subs.join(", ")})`);
check(ov.noOverview, "the Overview sub-tab is removed from Primary/Secondaries");
check(ov.activeIsFirst && ov.subs[0] === "All" && ov.paneRows > 0, `it defaults to the All sub-tab — the whole group's deals across every type, not one type (${ov.subs[0]}, ${ov.paneRows} rows)`);
check(ov.subsHaveCounts, "each sub-tab carries its deal count");
check(ov.subStacked > 10, `desktop: the sub-tabs stack as a second vertical rail (Δtop ${ov.subStacked}px)`);

// ---- 2a) freshness cue: the ledger's "as of" date + a stale flag when the newest
// deal is older than the threshold (7d). Asserted against the live data so it holds
// whether the ledger is currently fresh or stale.
const asof = await pg.evaluate(async () => {
  const D = await import("/credit/js/data.js");
  const ts = D.deals.filter((d) => d && d.date).map((d) => Date.parse((d.date || "").slice(0, 10)) || 0).filter((x) => x > 0);
  const newest = Math.max(...ts);
  const ageDays = Math.round((Date.now() - newest) / 864e5);
  const el = document.querySelector("#tx-asof");
  return {
    ageDays,
    shown: !!el && !el.hidden,
    hasLbl: !!(el && el.querySelector(".tx-asof-lbl")),
    lbl: el ? (el.querySelector(".tx-asof-lbl") || {}).textContent || "" : "",
    staleClass: !!(el && el.classList.contains("is-stale")),
    hasFlag: !!(el && el.querySelector(".tx-asof-flag")),
  };
});
check(asof.shown && asof.hasLbl && /deal flow as of/i.test(asof.lbl),
  `Transactions: a freshness cue shows the ledger's "as of" date (${asof.lbl})`);
check(asof.staleClass === (asof.ageDays > 7) && asof.hasFlag === (asof.ageDays > 7),
  `Transactions: the stale flag reflects the real ledger age (${asof.ageDays}d → ${asof.ageDays > 7 ? "stale flag shown" : "fresh, no flag"})`);
check(ov.bodyBg !== "rgba(0, 0, 0, 0)" && ov.bodyBg !== "transparent", `the pane sits on an opaque surface like the Profiles panes (${ov.bodyBg})`);
check(ov.noPeriodChips, "the old Last 12 months / All time period CHIPS stay removed (a compact date-range select replaces them)");
check(ov.modeChips.join(",") === "Lending,Structured credit,Secondaries,Manager M&A,Credits,BDCs", `the Lending / Structured credit / Secondaries / Manager M&A / Credits / BDCs nav chips are present (${ov.modeChips.join(",")})`);
check(ov.railStacked > 10, `desktop: the mode tabs stack as a vertical left rail like the Dashboard (Δtop ${ov.railStacked}px)`);
check(ov.railLeft, "desktop: the tab rail sits to the LEFT of the content (Dashboard-style sidebar)");
check(ov.subsNestedInRail, "desktop: the type sub-tabs nest under the active mode in the left rail");

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
check(/Borrower/i.test(dt.heads[0] || "") && /Lender/i.test(dt.heads[1] || "") && dt.heads.some((h) => /Sponsor/i.test(h)) && dt.heads.some((h) => /Sector/i.test(h)) && dt.heads.some((h) => /Country/i.test(h)) && dt.heads.some((h) => /Amount/i.test(h)) && dt.heads.some((h) => /Date/i.test(h)) && /Source/i.test(dt.heads[dt.heads.length - 1] || ""),
  `Lending columns are Borrower · Lender · Sponsor · Sector · Country · Amount · Date · Source (${dt.heads.join(" · ")})`);
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

// ---- 3a) the type filter is OFF by default: the "All" sub-tab clears it, restoring the
// whole group's deals (more rows than any one type). Then re-select Direct lending so the
// sub-category / group-by checks below run on that type.
const allRestore = await pg.evaluate(async () => {
  const typeRows = document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row").length;
  const allChip = [...document.querySelectorAll(".tx-subnav [data-sub]")].find((c) => c.dataset.sub === "");
  if (allChip) allChip.click();
  await new Promise((r) => setTimeout(r, 150));
  const allRows = document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row").length;
  const onAll = ((document.querySelector(".tx-subnav .tchip.is-on") || {}).dataset || {}).sub === "";
  const dl = [...document.querySelectorAll(".tx-subnav [data-sub]")].find((x) => /Direct lending/.test(x.textContent));
  if (dl) dl.click();
  await new Promise((r) => setTimeout(r, 150));
  return { typeRows, allRows, onAll };
});
check(allRestore.onAll && allRestore.allRows > allRestore.typeRows,
  `desktop: the All sub-tab clears the type filter — back to the whole group (${allRestore.allRows} > ${allRestore.typeRows} for one type)`);

// ---- 3b) the Filters sheet: multi-select facets with live counts (HOUSE_STYLE R39) ----
const fs1 = await pg.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const rowsN = () => document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row").length;
  const before = rowsN();
  document.querySelector("#tx-filters").click(); await wait(80);
  const sheet = document.querySelector("#tx-sheet");
  const groups = [...sheet.querySelectorAll(".tx-fgrp")].map((g) => g.dataset.fgrp);
  const sec = [...sheet.querySelectorAll('[data-facet="sector"]')].sort((a, b) => +b.querySelector(".tx-secn").textContent - +a.querySelector(".tx-secn").textContent);
  const a = sec[0], bb = sec[1];
  const na = +a.querySelector(".tx-secn").textContent, nb = +bb.querySelector(".tx-secn").textContent;
  a.click(); await wait(80);
  const one = rowsN();
  document.querySelector(`#tx-sheet [data-facet="sector"][data-v="${CSS.escape(bb.dataset.v)}"]`).click(); await wait(80);
  const two = rowsN();
  const hash = location.hash;
  const done = document.querySelector("#tx-sheet .tx-sheet-done").textContent;
  const pills = [...document.querySelectorAll("#tx-active .tx-pill")].map((p) => p.textContent.replace("✕", "").trim());
  const btn = document.querySelector("#tx-filters").textContent;
  document.querySelector("#tx-sheet .tx-sheet-done").click(); await wait(80);
  return { before, groups, na, nb, one, two, hash, done, pills, btn, closed: document.querySelector("#tx-sheet").hidden, a: a.dataset.v, b: bb.dataset.v };
});
check(["date", "type", "sector", "region", "size", "ccy", "sponsor", "lender"].every((g) => fs1.groups.includes(g)), `the Filters sheet offers date · type · sector · region · size · currency · sponsor · lender (${fs1.groups.join(", ")})`);
check(fs1.one === fs1.na && fs1.two === fs1.na + fs1.nb, `facet chips are multi-select with live counts — OR within a facet (${fs1.a} ${fs1.one}, + ${fs1.b} → ${fs1.two} = ${fs1.na}+${fs1.nb})`);
check(fs1.pills.includes(fs1.a) && fs1.pills.includes(fs1.b) && /Filters \([2-9]\)/.test(fs1.btn) && new RegExp("Show " + fs1.two + " deal").test(fs1.done), `selected values show as pills, the button counts them, the sheet footer counts the result (${fs1.btn}; ${fs1.done}; ${JSON.stringify(fs1.pills)} ${fs1.two})`);
check(/sec=/.test(fs1.hash) && fs1.closed, `facet selections live in the URL and "Show N deals" closes the sheet (${fs1.hash})`);
// Pills remove one value; Clear all resets.
await pg.evaluate(() => document.querySelector('#tx-active [data-clear="all"]').click()); await pg.waitForTimeout(120);

// ---- 3c) group-by (lender / month / sector / region / type) with subtotals; sortable columns
const grp = await pg.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const sel = document.querySelector("#tx-grp");
  const rowsFlat = document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row").length;
  const out = { rowsFlat, opts: [...sel.options].map((o) => o.value) };
  for (const g of ["lender", "month", "sector"]) {
    sel.value = g; sel.dispatchEvent(new Event("change", { bubbles: true })); await wait(100);
    const heads = [...document.querySelectorAll(".tx-panes-in .tx-list tr.tx-grp")];
    const counts = heads.map((h) => +(h.querySelector(".tx-grp-n")?.textContent || 0));
    out[g] = { n: heads.length, sum: counts.reduce((a, b) => a + b, 0), rows: document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row").length,
      named: heads.every((h) => (h.querySelector(".tx-grp-nm")?.textContent || "").trim()), vol: heads.some((h) => /\$/.test(h.querySelector(".tx-grp-v")?.textContent || "")),
      first: (heads[0]?.querySelector(".tx-grp-nm")?.textContent || ""), hash: location.hash };
  }
  sel.value = ""; sel.dispatchEvent(new Event("change", { bubbles: true })); await wait(100);
  out.off = document.querySelectorAll(".tx-panes-in .tx-list tr.tx-grp").length;
  // Sort by Amount via its header (largest first), then flip.
  document.querySelector('.tx-list th[data-sort="size"]').click(); await wait(100);
  const sizes = () => [...document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row td.tx-sz")].map((td) => td.textContent.trim());
  out.sortDesc = { first: sizes().slice(0, 3), aria: document.querySelector('.tx-list th[data-sort="size"]').getAttribute("aria-sort"), sel: document.querySelector("#tx-sort").value, hash: location.hash };
  document.querySelector('.tx-list th[data-sort="size"]').click(); await wait(100);
  out.sortAsc = { aria: document.querySelector('.tx-list th[data-sort="size"]').getAttribute("aria-sort"), last: sizes().slice(-1)[0] };
  const s = document.querySelector("#tx-sort"); s.value = "date-desc"; s.dispatchEvent(new Event("change", { bubbles: true })); await wait(100);
  return out;
});
check(["", "lender", "month", "sector", "region", "type"].every((g) => grp.opts.includes(g)), `group-by offers lender · month · sector · region · type (${grp.opts.join(",")})`);
check(["lender", "month", "sector"].every((g) => grp[g].n > 1 && grp[g].sum === grp.rowsFlat && grp[g].rows === grp.rowsFlat && grp[g].named), `grouping keeps every deal under named headers (lender ${grp.lender.n}, month ${grp.month.n}, sector ${grp.sector.n} groups; ${grp.rowsFlat} deals)`);
check(grp.lender.vol && /grp=sector/.test(grp.sector.hash) && /\d{4}/.test(grp.month.first), `group headers carry a disclosed-volume subtotal; month groups are newest first (${grp.month.first})`);
check(grp.off === 0, "No grouping restores the flat list");
check(grp.sortDesc.aria === "descending" && grp.sortDesc.sel === "size-desc" && /sort=size-desc/.test(grp.sortDesc.hash) && grp.sortAsc.aria === "ascending" && /^(—|EV |AUM |\$?[^0-9]*$)/.test(grp.sortAsc.last), `a column header sorts (Amount ▼ ${grp.sortDesc.first.join(", ")}; ▲ keeps undisclosed last: ${grp.sortAsc.last} · ${JSON.stringify(grp.sortDesc)})`);

// ---- 3d) the stats strip summarises the filtered set (numbers only — R20)
const stats = await pg.evaluate(() => (document.querySelector("#tx-stats") || {}).textContent || "");
check(/\d+ deals?/.test(stats) && /disclosed \(\d+\/\d+\)/.test(stats) && /median/.test(stats) && /top:/.test(stats), `a stats strip shows N deals · disclosed volume (n/N) · median · top lenders (${stats.trim().slice(0, 110)})`);

// A deal is a first-class object: tapping a row opens its DRAWER (borrower, lender →
// profile, type, amount, date, source, related deals), recorded in the URL (?deal=),
// and Back / ‹ closes it again.
const drw = await pg.evaluate(async () => {
  let e = document.querySelector(".tx-panes-in");
  const row = document.querySelector(".tx-panes-in .tx-list tr.tx-row");
  const id = row.dataset.deal;
  row.querySelector("td.tx-bd").click();
  await new Promise((r) => setTimeout(r, 120));
  const d = document.querySelector("#tx-drawer");
  const txt = d && !d.hidden ? d.innerText : "";
  return { id, open: !!d && !d.hidden, hash: location.hash, facts: ["lender", "type", "date", "source", "amount"].every((k) => txt.toLowerCase().includes(k)),
    lender: !!(d && d.querySelector("a.tx-mgr")), rowOn: row.classList.contains("is-open") };
});
check(drw.open && drw.facts && drw.lender && drw.rowOn, `tapping a deal opens its drawer with the deal's facts and the lender's profile link (${JSON.stringify(drw)})`);
check(new RegExp("deal=" + drw.id + "$").test(drw.hash), `the open deal is in the URL (${drw.hash})`);
await pg.goBack(); await pg.waitForTimeout(250);
check(await pg.evaluate(() => document.querySelector("#tx-drawer").hidden && !/deal=/.test(location.hash)), "Back closes the deal drawer");

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
  return { present: true, rows: document.querySelectorAll(".tx-list tr.tx-row").length, title: (document.querySelector(".tx-title") || {}).textContent || "", panesGone: !document.querySelector(".tx-subnav") };
});
check(search.present, "Transactions: a search box is present");
check(/search/i.test(search.title) && search.rows > 0 && search.panesGone, `Transactions: typing filters to a flat list of matching deals (${search.rows} rows)`);
const cleared = await pg.evaluate(async () => {
  const inp = document.querySelector("#tx-q"); inp.value = ""; inp.dispatchEvent(new Event("input", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 160));
  return { rows: document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row").length, typeView: !!document.querySelector(".tx-subnav") && !document.querySelector(".tx-title") };
});
check(cleared.typeView && cleared.rows > 0, `Transactions: clearing the search restores the type view (${cleared.rows} rows)`);

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

// ---- 7) phone: the TYPE filter is a chip strip (All + each type) over the deal list;
// All is the DEFAULT, so the whole group's deals show without picking a type, and tapping
// a type narrows in place. The deal list FITS the screen — all columns scroll inside its
// own .tleague-wrap, not squashing the borrower into a ragged char-by-char wrap, and the
// page itself must NOT gain a horizontal scrollbar.
{
  const p = await open(b, PHONE_SHORT, base + "/v2/transactions/");
  await p.pg.waitForSelector(".tx-typestrip [data-sub]", { timeout: 8000 });
  await p.pg.waitForSelector(".tx-panes-in .tx-card", { timeout: 8000 });
  const strip = await p.pg.evaluate(() => {
    const chips = [...document.querySelectorAll(".tx-typestrip [data-sub]")];
    const allChip = chips.find((c) => c.dataset.sub === "");
    return {
      n: chips.length, hasAll: !!allChip, defaultAll: !!(allChip && allChip.classList.contains("is-on")),
      noStrip: !document.querySelector(".tx-subnav"),   // no desktop left-rail sub-tabs on phone
      defaultRows: document.querySelectorAll(".tx-panes-in .tx-card").length,
    };
  });
  check(strip.n >= 5 && strip.hasAll && strip.noStrip, `phone: a type-filter chip strip (All + each type), no left sub-tab rail (${strip.n} chips)`);
  check(strip.defaultAll && strip.defaultRows > 0, `phone: All is the default — the whole group's deals show without picking a type (${strip.defaultRows} rows)`);
  // Tapping a type narrows the list to it (the optional, off-by-default filter).
  const pick = await p.pg.evaluate(async () => {
    const before = document.querySelectorAll(".tx-panes-in .tx-card").length;
    const c = [...document.querySelectorAll(".tx-typestrip [data-sub]")].find((x) => /Direct lending/.test(x.textContent));
    if (c) c.click();
    await new Promise((r) => setTimeout(r, 150));
    const onChip = document.querySelector(".tx-typestrip [data-sub].is-on");
    return { before, after: document.querySelectorAll(".tx-panes-in .tx-card").length, onLabel: (onChip || {}).textContent || "" };
  });
  check(/Direct lending/.test(pick.onLabel) && pick.after > 0 && pick.after <= pick.before, `phone: tapping a type filters the list to it (${pick.after}/${pick.before})`);
  await p.pg.waitForSelector(".tx-panes-in .tx-card", { timeout: 8000 });
  await p.pg.waitForTimeout(400);
  // Phone: each deal is a two-line CARD (borrower · amount, then date · lender · type)
  // — the facts that matter fit 390px with no sideways-scrolling table, and the page
  // itself never scrolls horizontally.
  const drill = await p.pg.evaluate(() => {
    const c = document.querySelector(".tx-panes-in .tx-card");
    const r = c.getBoundingClientRect();
    return { vw: window.innerWidth, cardW: Math.round(r.width), table: !!document.querySelector(".tx-panes-in .tx-list"),
      nm: !!c.querySelector(".tx-card-nm"), meta: c.querySelectorAll(".tx-card-b > span").length, lender: !!c.querySelector(".tx-card-b a.tx-mgr"),
      pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  check(!drill.table && drill.nm && drill.meta >= 3 && drill.cardW <= drill.vw, `phone: deals are cards — name + amount, then date · lender · type (${drill.meta} meta, ${drill.cardW}px ≤ ${drill.vw})`);
  check(drill.lender, "phone: the card's lender links to its profile");
  check(drill.pageOverflow <= 1, `phone: the page itself does not scroll sideways (overflow ${drill.pageOverflow}px)`);
  // Tapping a card opens the deal in place of the list; Back returns to the list.
  await p.pg.evaluate(() => document.querySelector(".tx-panes-in .tx-card .tx-card-nm").click());
  await p.pg.waitForTimeout(200);
  const dv = await p.pg.evaluate(() => ({ open: !document.querySelector("#tx-drawer").hidden, listHidden: getComputedStyle(document.querySelector("#tx-body")).display === "none" }));
  check(dv.open && dv.listHidden, "phone: a card opens the deal in place of the list");
  await p.pg.goBack(); await p.pg.waitForTimeout(250);
  check(await p.pg.evaluate(() => document.querySelector("#tx-drawer").hidden && getComputedStyle(document.querySelector("#tx-body")).display !== "none"), "phone: Back returns from the deal to the list");
  // Phone: sort + group live in the Filters sheet (not the bar); the open sheet takes the
  // list's place and "Show N deals" returns to it.
  const ph = await p.pg.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const barSel = getComputedStyle(document.querySelector("#tx-sort")).display;
    document.querySelector("#tx-filters").click(); await wait(120);
    const listHidden = getComputedStyle(document.querySelector("#tx-body")).display === "none";
    const sheetSel = !!document.querySelector('#tx-sheet select[data-ctl="sort"]') && getComputedStyle(document.querySelector("#tx-sheet .tx-fsortgrp")).display !== "none";
    const chipH = document.querySelector("#tx-sheet .tx-fchip").getBoundingClientRect().height;
    document.querySelector("#tx-sheet .tx-sheet-done").click(); await wait(120);
    return { barSel, listHidden, sheetSel, chipH, back: getComputedStyle(document.querySelector("#tx-body")).display !== "none" && document.querySelector("#tx-sheet").hidden };
  });
  check(ph.barSel === "none" && ph.sheetSel, "phone: sort and group sit in the Filters sheet, not the bar");
  check(ph.listHidden && ph.back && ph.chipH >= 30, `phone: the open sheet replaces the list (chips ${ph.chipH}px tall); Show N deals returns to it`);
  checkErrs(p.errs, "transactions phone column fit");
  await p.ctx.close();
}

// Date (presets, years, quarters, a custom month range) + size bands narrow the list.
{
  const f = await open(b, DESKTOP, base + "/v2/transactions/");
  await f.pg.waitForSelector(".tx-subnav [data-sub] .tx-subn", { state: "attached", timeout: 8000 });
  const total = () => f.pg.evaluate(() => [...document.querySelectorAll(".tx-subnav [data-sub] .tx-subn")].slice(1).reduce((n, x) => n + (parseInt(x.textContent, 10) || 0), 0));
  const go = async (h) => { await f.pg.evaluate((h) => { location.hash = h; }, h); await f.pg.waitForTimeout(250); };
  const all = await total();
  await go("#/lending?period=30d"); const recent = await total();
  await go("#/lending?from=2025-01&to=2025-12"); const y2025 = await total();
  const yr = await f.pg.evaluate(() => ({ pill: [...document.querySelectorAll("#tx-active .tx-pill")].map((p) => p.textContent.replace("✕", "").trim()) }));
  await go("#/lending?from=2025-04&to=2025-06"); const q2 = await total();
  const qp = await f.pg.evaluate(() => [...document.querySelectorAll("#tx-active .tx-pill")].map((p) => p.textContent.replace("✕", "").trim()));
  await go("#/lending?size=gt1bn"); const big = await total();
  await go("#/lending?min=1000"); const legacy = await f.pg.evaluate(() => location.hash);
  // The sheet's year chip + custom range inputs drive the same state.
  await go("#/lending");
  await f.pg.click("#tx-filters"); await f.pg.waitForTimeout(120);
  await f.pg.locator('#tx-sheet [data-from="2025-01"][data-to="2025-12"]').click(); await f.pg.waitForTimeout(150);
  const viaChip = await total();
  await f.pg.fill("#tx-from", "2024-01"); await f.pg.waitForTimeout(150);
  const rng = await f.pg.evaluate(() => ({ h: location.hash, pill: [...document.querySelectorAll("#tx-active .tx-pill")].map((p) => p.textContent.replace("✕", "").trim()).join("|") }));
  check(all > 0 && recent < all, `the date presets narrow the counts (last 30 days ${recent} < all ${all})`);
  check(y2025 > 0 && y2025 < all && yr.pill.includes("2025") && viaChip === y2025, `a year narrows to that year (2025: ${y2025}; pill "${yr.pill.join("|")}")`);
  check(q2 > 0 && q2 < y2025 && qp.includes("Q2 2025"), `a quarter narrows within the year (Q2 2025: ${q2})`);
  check(/from=2024-01&to=2025-12/.test(rng.h) && /Jan 2024 – Dec 2025/.test(rng.pill), `a custom from–to month range (${rng.h}; ${rng.pill})`);
  check(big > 0 && big < all, `the ≥ $1bn size band narrows to disclosed deals (${big} < ${all})`);
  check(/size=gt1bn/.test(legacy) && !/min=/.test(legacy), `a legacy ?min= link canonicalises to the size band (${legacy})`);
  checkErrs(f.errs, "transactions filters");
  await f.ctx.close();
}

// T1 — every control in each mode's bar sits inside the viewport at desktop widths
// (the as-of line used to push the whole row off the right edge at 1280px).
for (const w of [1280, 1024]) {
  const f = await open(b, { ...DESKTOP, viewport: { width: w, height: 800 } }, base + "/v2/transactions/");
  await f.pg.waitForSelector("#tx-body [data-deal]", { timeout: 8000 });
  const off = [];
  for (const m of ["lending", "credits", "bdc"]) {
    await f.pg.evaluate((m) => { location.hash = "#/" + m; }, m); await f.pg.waitForTimeout(250);
    off.push(...await f.pg.evaluate(() => [...document.querySelectorAll(".tx-bar")].filter((h) => h.offsetParent).flatMap((h) => [...h.querySelectorAll("input, select, button")])
      .filter((e) => e.offsetParent && getComputedStyle(e).display !== "none")
      .filter((e) => { const r = e.getBoundingClientRect(); return r.left < 0 || r.right > window.innerWidth + 0.5 || r.width === 0; })
      .map((e) => `${e.id || e.className}@${Math.round(e.getBoundingClientRect().left)}`)));
  }
  check(!off.length, `${w}px: every Transactions control is inside the viewport (${off.join(", ") || "all in"})`);
  checkErrs(f.errs, `transactions controls ${w}`);
  await f.ctx.close();
}

// Manager M&A, de-duplication, amount kinds, CLO events, Target (HOUSE_STYLE R39).
{
  const f = await open(b, DESKTOP, base + "/v2/transactions/#/mna");
  await f.pg.waitForSelector("#tx-body [data-deal]", { timeout: 8000 });
  const r = await f.pg.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const [{ DEAL_TAGS }] = await Promise.all([import("/credit/js/deal-tags.js")]);
    const mna = new Set(Object.entries(DEAL_TAGS).filter(([, t]) => t.managerMA).map(([id]) => id));
    const ids = [...document.querySelectorAll("#tx-body tr.tx-row")].map((tr) => tr.dataset.deal);
    const heads = [...document.querySelectorAll("#tx-body .tx-list thead th")].map((h) => h.textContent.trim());
    location.hash = "#/lending"; await wait(250);
    const lendIds = new Set([...document.querySelectorAll("#tx-body tr.tx-row")].map((tr) => tr.dataset.deal));
    // A figure that is NOT the deal size (EV / target AUM) reads muted and never counts.
    const x = document.querySelector("#tx-body .tx-amt-x");
    location.hash = "#/structured"; await wait(250);
    const sHeads = [...document.querySelectorAll("#tx-body .tx-list thead th")].map((h) => h.textContent.trim());
    const events = [...document.querySelectorAll("#tx-body td.txc-ev")].map((td) => td.textContent.trim()).filter((t) => t !== "—");
    const alt = document.querySelector("#tx-body .tx-alt");
    let altDrawer = "";
    if (alt) { alt.closest("tr").querySelector("td.tx-bd").click(); await wait(150); altDrawer = document.querySelector("#tx-drawer").innerText; }
    return { n: ids.length, allMna: ids.length > 0 && ids.every((id) => mna.has(id)), noneInLending: ![...mna].some((id) => lendIds.has(id)), heads, x: x ? x.textContent : "", sHeads, events: [...new Set(events)], alt: !!alt, altDrawer: /Also reported/i.test(altDrawer) };
  });
  check(r.allMna && r.noneInLending, `Manager M&A lists exactly the asset-manager acquisitions, kept out of Lending (${r.n})`);
  check(r.heads.join("|") === "Target|Acquirer|Country|Value|Date|Source", `Manager M&A columns: Target · Acquirer · Country · Value · Date · Source (${r.heads.join(" · ")})`);
  check(/^(EV|AUM) /.test(r.x) || r.x === "", `a non-deal-size figure reads muted with its kind (${r.x || "none on this page"})`);
  check(r.sHeads.join("|") === "Deal|Manager|Type|Event|Country|Size|Date|Source" && r.events.some((e) => /New issue|Reset|Refi/.test(e)), `Structured credit has its own columns incl. the CLO event (${r.sHeads.join(" · ")}; ${r.events.join(", ")})`);
  check(r.alt && r.altDrawer, "a de-duplicated deal shows its other source (+n in the row, Also reported in the drawer)");
  // $1–15bn → Target → off.
  await f.pg.evaluate(() => { location.hash = "#/lending"; }); await f.pg.waitForTimeout(250);
  const t = await f.pg.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const [D, T] = await Promise.all([import("/credit/js/data.js"), import("/credit/js/target.js")]);
    const by = new Map(); D.funds.forEach((x) => { if (!by.has(x.managerId)) by.set(x.managerId, []); by.get(x.managerId).push(x); });
    const core = new Set(D.managers.filter((m) => T.targetFit(m, by.get(m.id) || []).tier === "core").map((m) => m.id));
    const n = () => document.querySelectorAll("#tx-body tr.tx-row").length;
    const btn = document.querySelector("#tx-focus");
    const n0 = n(); btn.click(); await wait(120);
    const n1 = n(), l1 = btn.textContent; btn.click(); await wait(120);
    const ids = [...document.querySelectorAll("#tx-body a.tx-mgr")].map((a) => a.dataset.id);
    const n2 = n(), l2 = btn.textContent, h2 = location.hash, pill = [...document.querySelectorAll("#tx-active .tx-pill")].map((p) => p.textContent.replace("✕", "").trim());
    btn.click(); await wait(120);
    return { n0, n1, n2, l1, l2, h2, pill, allCore: ids.length > 0 && ids.filter((id) => !core.has(id)).length === 0, off: btn.getAttribute("aria-pressed") === "false" && n() === n0 };
  });
  check(t.l1 === "$1–15bn" && t.l2 === "Target" && /focus=target/.test(t.h2) && t.pill.includes("Target managers"), `the AUM button cycles $1–15bn → Target → off (${t.n0} → ${t.n1} → ${t.n2})`);
  check(t.allCore && t.n2 > 0 && t.n2 < t.n0 && t.off, "Target lists only target-market managers' deals (European · ≤ $15bn · 15%+ strategy)");
  // Region: "All Europe" selects every European region and reads as one pill.
  await f.pg.click("#tx-filters"); await f.pg.waitForTimeout(120);
  await f.pg.locator("#tx-sheet [data-europe]").click(); await f.pg.waitForTimeout(150);
  const eu = await f.pg.evaluate(() => ({ h: location.hash, pills: [...document.querySelectorAll("#tx-active .tx-pill")].map((p) => p.textContent.replace("✕", "").trim()), ctry: [...document.querySelectorAll("#tx-body td.txc-ctry")].map((td) => td.textContent.trim()) }));
  const nonEu = eu.ctry.filter((c) => ["US", "Canada", "Australia", "Asia", "Middle East", "Latin America", "Africa", "Global", "—"].includes(c));
  check(/reg=uki,dach/.test(eu.h) && eu.pills.join("|") === "Europe" && eu.ctry.length > 0 && !nonEu.length, `All Europe narrows to European deals under one pill (${eu.ctry.length} rows, ${nonEu.length} non-European)`);
  checkErrs(f.errs, "transactions R39");
  await f.ctx.close();
}

await b.close(); srv.close();
finish();
