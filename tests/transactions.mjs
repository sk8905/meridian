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
    || !(t.event == null || ["new", "reset", "refi"].includes(t.event)) || typeof t.managerMA !== "boolean"
    || (t.partySource != null && (t.party == null || !/^https?:\/\//.test(t.partySource)))
    || !(t.partyQuality == null || ["unconfirmed", "placeholder"].includes(t.partyQuality))
    // A researched country carries its source URL and basis (HQ | incorporation).
    || (t.countrySource != null && (!t.country || !/^https?:\/\//.test(t.countrySource) || !["hq", "incorporated", "issuer", "portfolio"].includes(t.countryBasis)))).map(([id]) => id);
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

// ---- 2) one-row bar (R39e): search · Target · Filters — no nested type sub-labels ----
await pg.goto(base + "/v2/transactions/", { waitUntil: "load" });
await pg.waitForSelector(".tx-panes-in .tx-list tbody tr.tx-row", { timeout: 8000 });
const statN = () => pg.evaluate(() => +((document.querySelector("#tx-stats b") || {}).textContent || 0));
const ov = await pg.evaluate(() => {
  const bar = document.querySelector("#tx-flow-search");
  const ctl = [...bar.querySelectorAll("input, select, button")].filter((e) => e.offsetParent && getComputedStyle(e).display !== "none");
  const tops = ctl.map((e) => Math.round(e.getBoundingClientRect().top));
  return {
    ctl: ctl.map((e) => e.id || e.className),
    oneRow: Math.max(...tops) - Math.min(...tops) <= 4,
    noSubs: !document.querySelector(".tx-subnav, [data-sub], .tx-typestrip"),
    paneRows: document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row").length,
    noPeriodChips: !document.querySelector(".tchip[data-period], [data-period]"),
    modeChips: [...document.querySelectorAll("#tx-mode .tchip[data-mode]")].map((c) => c.textContent.trim().replace(/\s+\d+$/, "")),
    railStacked: (() => { const c = [...document.querySelectorAll("#tx-mode .tchip[data-mode]")]; return c.length > 1 ? Math.round(c[1].getBoundingClientRect().top - c[0].getBoundingClientRect().top) : 0; })(),
    railLeft: (() => { const h = document.querySelector(".tx-dash .twire-head"), m = document.querySelector(".tx-dash .tcol-main"); return !!(h && m) && h.getBoundingClientRect().right <= m.getBoundingClientRect().left + 5 && Math.round(h.getBoundingClientRect().width) < 220; })(),
    bodyBg: getComputedStyle(document.querySelector("#tx-body")).backgroundColor,
    nameWt: (() => { const nm = document.querySelector(".tx-panes-in .tx-list tbody tr.tx-row td.tx-bd"); return nm ? parseInt(getComputedStyle(nm).fontWeight, 10) : null; })(),
  };
});
check(ov.ctl.join("|") === "tx-q|tx-scope|tx-focus|tx-filters" && ov.oneRow, `the bar is ONE row: search · Europe · Target · Filters (${ov.ctl.join(", ")})`);
check(ov.noSubs, "no nested transaction-type sub-labels (types live in the Filters panel)");
check(ov.nameWt != null && ov.nameWt <= 400, `Transactions: the deal name is NOT bold — normal weight (${ov.nameWt})`);
check(ov.paneRows > 0, `it opens on the whole group's deals (${ov.paneRows} rows)`);

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
// The as-of date rides in the stats line; the banner appears only when the ledger is stale.
const asofStat = await pg.evaluate(() => (document.querySelector("#tx-stats .tx-stats-asof") || {}).textContent || "");
check(/as of \d{1,2} \w{3}/.test(asofStat) && (asof.ageDays > 7 ? asof.shown && /deal flow as of/i.test(asof.lbl) : !asof.shown),
  `Transactions: a freshness cue shows the ledger's "as of" date (${asofStat}; banner ${asof.shown ? "shown (stale)" : "hidden (fresh)"})`);
check(asof.staleClass === (asof.ageDays > 7) && asof.hasFlag === (asof.ageDays > 7),
  `Transactions: the stale flag reflects the real ledger age (${asof.ageDays}d → ${asof.ageDays > 7 ? "stale flag shown" : "fresh, no flag"})`);
check(ov.bodyBg !== "rgba(0, 0, 0, 0)" && ov.bodyBg !== "transparent", `the pane sits on an opaque surface like the Profiles panes (${ov.bodyBg})`);
check(ov.noPeriodChips, "the old Last 12 months / All time period CHIPS stay removed (a compact date-range select replaces them)");
check(ov.modeChips.join(",") === "All,Lending,Structured credit,Secondaries,Manager M&A", `the All (first, default) / Lending / Structured credit / Secondaries / Manager M&A nav chips are present — Credits and BDCs live on Dashboard ▸ Credit (${ov.modeChips.join(",")})`);
check(ov.railStacked > 10, `desktop: the mode tabs stack as a vertical left rail like the Dashboard (Δtop ${ov.railStacked}px)`);
check(ov.railLeft, "desktop: the tab rail sits to the LEFT of the content (Dashboard-style sidebar)");

// ---- 3) one type (via the Filters panel / URL) → its dated deal list -------------
const allN = await statN();
await pg.evaluate(() => { location.hash = "#/lending?type=lend"; }); await pg.waitForTimeout(300);
await pg.waitForSelector(".tx-panes-in .tx-list tbody tr.tx-row", { timeout: 4000 });
const dt = await pg.evaluate(() => {
  const exp = document.querySelector(".tx-panes-in");
  return {
    noDetailPage: !document.querySelector(".tx-back") && !document.querySelector(".tx-kpi"),
    heads: [...exp.querySelectorAll(".tx-list thead th")].map((h) => h.textContent.trim()),
    listRows: exp.querySelectorAll(".tx-list tbody tr.tx-row").length,
    anySize: [...exp.querySelectorAll(".tx-list td.tx-sz")].some((td) => /[$€£]/.test(td.textContent)),
    mgrLinks: exp.querySelectorAll(".tx-list a.tx-mgr").length,
    borrowerNamed: [...exp.querySelectorAll(".tx-list td.tx-bd")].filter((td) => td.textContent.trim() && !td.querySelector("a")).length,
    srcLinks: [...exp.querySelectorAll(".tx-list td.tx-src2 a")].filter((a) => /^https?:/.test(a.getAttribute("href") || "")).length,
    typed: [...exp.querySelectorAll(".tx-list td.tx-cat")].filter((td) => td.textContent.trim() && td.textContent.trim() !== "—").length,
    sum: (document.querySelector("#tx-active .tx-sum") || {}).textContent || "",
    n: +((document.querySelector("#tx-stats b") || {}).textContent || 0),
  };
});
check(/Direct lending/.test(dt.sum) && dt.n > 0 && dt.n < allN, `one type narrows the list and reads in the summary line (${dt.sum}: ${dt.n} < ${allN})`);
check(dt.noDetailPage, "no separate detail page is rendered (no back bar, no KPI tiles)");
check(dt.listRows > 0, `the pane lists the type's transactions (${dt.listRows})`);
// R43 (owner 2026-10-15): an events table leads with its date and ends with its source.
check(/Date/i.test(dt.heads[0] || "") && /Borrower/i.test(dt.heads[1] || "") && /Lender/i.test(dt.heads[2] || "") && dt.heads.some((h) => /Sponsor/i.test(h)) && dt.heads.some((h) => /Sector/i.test(h)) && dt.heads.some((h) => /Country/i.test(h)) && dt.heads.some((h) => /Amount/i.test(h)) && /Source/i.test(dt.heads[dt.heads.length - 1] || ""),
  `Lending columns are Date · Borrower · Lender · Sponsor · Sector · Country · Amount · Source (${dt.heads.join(" · ")})`);
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

// ---- 3b) the Filters sheet: multi-select facets with live counts (HOUSE_STYLE R39) ----
const fs1 = await pg.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const rowsN = () => document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row").length;
  const before = rowsN();
  document.querySelector("#tx-filters").click(); await wait(80);
  const groups0 = [...document.querySelectorAll("#tx-sheet .tx-fgrp")].map((g) => g.dataset.fgrp).filter(Boolean);
  document.querySelector("#tx-sheet [data-fmore-t]").click(); await wait(80);
  const sheet = document.querySelector("#tx-sheet");
  const groups = [...sheet.querySelectorAll(".tx-fgrp")].map((g) => g.dataset.fgrp).filter(Boolean);
  const sec = [...sheet.querySelectorAll('[data-facet="sector"]')].sort((a, b) => +b.querySelector(".tx-secn").textContent - +a.querySelector(".tx-secn").textContent);
  const a = sec[0], bb = sec[1];
  const na = +a.querySelector(".tx-secn").textContent, nb = +bb.querySelector(".tx-secn").textContent;
  a.click(); await wait(80);
  const one = rowsN();
  document.querySelector(`#tx-sheet [data-facet="sector"][data-v="${CSS.escape(bb.dataset.v)}"]`).click(); await wait(80);
  const two = rowsN();
  const hash = location.hash;
  const done = document.querySelector("#tx-sheet .tx-sheet-done").textContent;
  const sum = (document.querySelector("#tx-active .tx-sum") || {}).textContent || "";
  const btn = document.querySelector("#tx-filters .tx-fn").textContent;
  const desk = getComputedStyle(sheet).position;
  document.querySelector("#tx-sheet .tx-sheet-done").click(); await wait(80);
  return { before, groups0, groups, na, nb, one, two, hash, done, sum, btn, desk, closed: document.querySelector("#tx-sheet").hidden, a: a.dataset.v, b: bb.dataset.v };
});
check(fs1.groups0.join(",") === "fit,type,date,region,size" && ["sector", "ccy", "sponsor", "lender"].every((g) => fs1.groups.includes(g)), `the panel shows Managers · Type · Date · Region · Size; More filters adds sector · currency · sponsor · lender (${fs1.groups0.join(", ")} + ${fs1.groups.filter((g) => !fs1.groups0.includes(g)).join(", ")})`);
check(fs1.one === fs1.na && fs1.two === fs1.na + fs1.nb, `facet chips are multi-select with live counts — OR within a facet (${fs1.a} ${fs1.one}, + ${fs1.b} → ${fs1.two} = ${fs1.na}+${fs1.nb})`);
check(fs1.sum.includes(fs1.a) && fs1.sum.includes(fs1.b) && +fs1.btn >= 2 && new RegExp("Show " + fs1.two + " deal").test(fs1.done), `selections read as ONE summary line, the button counts them, the footer counts the result (${fs1.sum}; ⚙ ${fs1.btn}; ${fs1.done})`);
check(/sec=/.test(fs1.hash) && fs1.closed && fs1.desk === "absolute", `desktop: the panel drops down over the list; selections live in the URL; "Show N deals" closes it (${fs1.hash})`);
await pg.evaluate(() => document.querySelector('#tx-active [data-clear="all"]').click()); await pg.waitForTimeout(120);

// ---- 3c) group-by (lender / month / sector / region / type) with subtotals; sortable columns
const grp = await pg.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  document.querySelector("#tx-filters").click(); await wait(80);
  if (!document.querySelector("#tx-grp")) { document.querySelector("#tx-sheet [data-fmore-t]").click(); await wait(80); }
  let sel = document.querySelector("#tx-grp");
  const rowsFlat = document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row").length;
  const out = { rowsFlat, opts: [...sel.options].map((o) => o.value) };
  for (const g of ["lender", "month", "sector"]) {
    sel = document.querySelector("#tx-grp"); sel.value = g; sel.dispatchEvent(new Event("change", { bubbles: true })); await wait(100);
    const heads = [...document.querySelectorAll(".tx-panes-in .tx-list tr.tx-grp")];
    const counts = heads.map((h) => +(h.querySelector(".tx-grp-n")?.textContent || 0));
    out[g] = { n: heads.length, sum: counts.reduce((a, b) => a + b, 0), rows: document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row").length,
      named: heads.every((h) => (h.querySelector(".tx-grp-nm")?.textContent || "").trim()), vol: heads.some((h) => /\$/.test(h.querySelector(".tx-grp-v")?.textContent || "")),
      first: (heads[0]?.querySelector(".tx-grp-nm")?.textContent || ""), hash: location.hash };
  }
  sel = document.querySelector("#tx-grp"); sel.value = ""; sel.dispatchEvent(new Event("change", { bubbles: true })); await wait(100);
  out.off = document.querySelectorAll(".tx-panes-in .tx-list tr.tx-grp").length;
  document.querySelector("#tx-sheet .tx-sheet-done").click(); await wait(80);
  // Sort by Amount via its header (largest first), then flip.
  document.querySelector('.tx-list th[data-sort="size"]').click(); await wait(100);
  const sizes = () => [...document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row td.tx-sz")].map((td) => td.textContent.trim());
  out.sortDesc = { first: sizes().slice(0, 3), aria: document.querySelector('.tx-list th[data-sort="size"]').getAttribute("aria-sort"), sel: "size-desc", hash: location.hash };
  document.querySelector('.tx-list th[data-sort="size"]').click(); await wait(100);
  // Undisclosed sizes sort LAST: in the rendered rows no blank precedes a figure. (The
  // list renders the first 400 rows, so once 400+ deals carry a size the blanks are below
  // the cap — "last" is checked as an ORDER, not as the last visible row.)
  // A cell is "blank" (sorts as null) when it shows "—" or only a muted non-size amount (.tx-amt-x).
  const cells = [...document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row td.tx-sz")];
  const ascAll = cells.map((td) => td.textContent.trim());
  const blank = cells.map((td) => { const t = td.textContent.trim(); return !t || t === "—" || !!td.querySelector(".tx-amt-x"); });
  const firstBlank = blank.indexOf(true);
  out.sortAsc = { aria: document.querySelector('.tx-list th[data-sort="size"]').getAttribute("aria-sort"), last: ascAll.slice(-1)[0], blanksLast: firstBlank < 0 || blank.slice(firstBlank).every(Boolean), capped: !!document.querySelector(".tx-panes-in .tw-empty") };
  location.hash = "#/lending"; await wait(200);
  return out;
});
check(["", "lender", "month", "sector", "region", "type"].every((g) => grp.opts.includes(g)), `group-by offers lender · month · sector · region · type (${grp.opts.join(",")})`);
// (By lender, a club deal sits under EACH of its lenders — R39m — so its rows may exceed the flat list.)
check(["month", "sector"].every((g) => grp[g].n > 1 && grp[g].sum === grp.rowsFlat && grp[g].rows === grp.rowsFlat && grp[g].named)
  && grp.lender.n > 1 && grp.lender.sum === grp.lender.rows && grp.lender.rows >= grp.rowsFlat && grp.lender.named, `grouping keeps every deal under named headers (lender ${grp.lender.n}, month ${grp.month.n}, sector ${grp.sector.n} groups; ${grp.rowsFlat} deals)`);
check(grp.lender.vol && /grp=sector/.test(grp.sector.hash) && /\d{4}/.test(grp.month.first), `group headers carry a disclosed-volume subtotal; month groups are newest first (${grp.month.first})`);
check(grp.off === 0, "No grouping restores the flat list");
check(grp.sortDesc.aria === "descending" && grp.sortDesc.sel === "size-desc" && /sort=size-desc/.test(grp.sortDesc.hash) && grp.sortAsc.aria === "ascending" && grp.sortAsc.blanksLast && (grp.sortAsc.capped || /^(—|EV |AUM |\$?[^0-9]*$)/.test(grp.sortAsc.last)), `a column header sorts (Amount ▼ ${grp.sortDesc.first.join(", ")}; ▲ keeps undisclosed last: ${grp.sortAsc.last}${grp.sortAsc.capped ? " (list capped)" : ""} · ${JSON.stringify(grp.sortDesc)})`);

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
// Link convention (R39l): in the deal card internal links are blue-underlined and external
// links orange-underlined (tables keep plain names / grey sources);
// the drawer's facts share the body's left edge.
const lk = await pg.evaluate(() => {
  const st = (a) => a ? [getComputedStyle(a).textDecorationLine, getComputedStyle(a).textDecorationColor] : null;
  const d = document.querySelector("#tx-drawer");
  const li = d.querySelector(".tbiz li"), body = d.querySelector(".tx-drawer-b"), t = d.querySelector(".tx-drawer-t");
  return { int: st(d.querySelector("a.tx-mgr")), ext: st(d.querySelector('.tbiz-v a[target="_blank"]')), row: st(document.querySelector("#tx-body td.tx-src2 a")),
    aligned: Math.abs(li.getBoundingClientRect().left + parseFloat(getComputedStyle(li).paddingLeft) - (t.getBoundingClientRect().left)) < 1 };
});
check(lk.int && lk.int[0] === "underline" && lk.ext && lk.ext[0] === "underline" && lk.int[1] !== lk.ext[1] && lk.row && lk.row[0] === "none", `deal card: internal links blue-underlined, external orange-underlined; the table's source keeps its plain style (${JSON.stringify(lk)})`);
check(lk.aligned, "the drawer's facts align with its title");
// Clicking the open deal's row again closes the card.
await pg.evaluate((id) => document.querySelector(`#tx-body tr.tx-row[data-deal="${id}"] td.tx-bd`).click(), drw.id); await pg.waitForTimeout(250);
check(await pg.evaluate(() => document.querySelector("#tx-drawer").hidden && !/deal=/.test(location.hash)), "clicking the open deal again closes its card");
await pg.evaluate((id) => document.querySelector(`#tx-body tr.tx-row[data-deal="${id}"] td.tx-bd`).click(), drw.id); await pg.waitForTimeout(200);
await pg.goBack(); await pg.waitForTimeout(250);
check(await pg.evaluate(() => document.querySelector("#tx-drawer").hidden && !/deal=/.test(location.hash)), "Back closes the deal drawer");

// ---- 4) Target button (bar) + the $1–15bn lens (panel Managers row) ----------------
const totOff = await statN();
const foc = await pg.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const btn = document.querySelector("#tx-focus"); if (!btn) return { present: false };
  btn.click(); await wait(120);
  const out = { present: true, on: btn.getAttribute("aria-pressed") === "true" && btn.classList.contains("is-on"), label: btn.textContent.trim(),
    inSearch: !!btn.closest(".thead-search"), tot: +((document.querySelector("#tx-stats b") || {}).textContent || 0) };
  btn.click(); await wait(120);
  out.off = btn.getAttribute("aria-pressed") === "false";
  document.querySelector("#tx-filters").click(); await wait(80);
  document.querySelector('#tx-sheet [data-fit="band"]').click(); await wait(120);
  out.band = +((document.querySelector("#tx-stats b") || {}).textContent || 0);
  document.querySelector("#tx-sheet .tx-sheet-done").click(); await wait(80);
  return out;
});
check(foc.present && foc.on && foc.label === "European mid-market" && foc.inSearch && foc.off, `the bar's Target button toggles the target market on and off ("${foc.label}")`);
check(foc.tot > 0 && foc.tot < totOff && foc.band > foc.tot && foc.band < totOff, `Target narrows the deals (${foc.tot} < ${totOff}); the panel's $1–15bn lens is broader (${foc.band})`);
const inband = await pg.evaluate(async () => {
  const D = await import("/credit/js/data.js");
  const aumOf = (m) => (!m || m.notAum) ? null : (m.aumTotal != null ? m.aumTotal : m.aum);
  const set = new Set(D.managers.filter((m) => { const a = aumOf(m); return a != null && a >= 1 && a <= 15; }).map((m) => m.id));
  // Every listed deal has at least one $1–15bn firm among its parties (R39m: a club deal counts for each).
  const rows = [...document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row")].map((tr) => (tr.dataset.parties || "").split(" ").filter(Boolean));
  return { n: rows.length, allIn: rows.length > 0 && rows.every((ids) => ids.some((id) => set.has(id))) };
});
check(inband.allIn, `with $1–15bn on, every listed deal has a $1–15bn manager among its parties (${inband.n} rows)`);
await pg.evaluate(() => { location.hash = "#/lending"; }); await pg.waitForTimeout(200);

// ---- 5) search — a flat list of matching deals across the group ----------
// (Typing renders the flat search list, replacing the sub-tab view.)
await pg.waitForTimeout(120);
const search = await pg.evaluate(async () => {
  const inp = document.querySelector("#tx-q"); if (!inp) return { present: false };
  inp.value = "lending"; inp.dispatchEvent(new Event("input", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 160));
  return { present: true, rows: document.querySelectorAll(".tx-list tr.tx-row").length, title: (document.querySelector(".tx-title") || {}).textContent || "", panesGone: true };
});
check(search.present, "Transactions: a search box is present");
check(/search/i.test(search.title) && search.rows > 0 && search.panesGone, `Transactions: typing filters to a flat list of matching deals (${search.rows} rows)`);
const cleared = await pg.evaluate(async () => {
  const inp = document.querySelector("#tx-q"); inp.value = ""; inp.dispatchEvent(new Event("input", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 160));
  return { rows: document.querySelectorAll(".tx-panes-in .tx-list tbody tr.tx-row").length, typeView: !document.querySelector(".tx-title") };
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

// ---- 7) phone: one-row bar, no type strip; Type is picked in the Filters panel. The deal
// list is cards and the page itself never gains a horizontal scrollbar.
{
  const p = await open(b, PHONE_SHORT, base + "/v2/transactions/");
  await p.pg.waitForSelector(".tx-panes-in .tx-card", { timeout: 8000 });
  const strip = await p.pg.evaluate(() => {
    const ctl = [...document.querySelectorAll("#tx-flow-search input, #tx-flow-search button")].filter((e) => e.offsetParent);
    const tops = ctl.map((e) => Math.round(e.getBoundingClientRect().top));
    return { noStrip: !document.querySelector(".tx-typestrip, .tx-subnav"), oneRow: Math.max(...tops) - Math.min(...tops) <= 4, n: ctl.length,
      statsHidden: getComputedStyle(document.querySelector("#tx-stats")).display === "none", defaultRows: document.querySelectorAll(".tx-panes-in .tx-card").length };
  });
  check(strip.noStrip && strip.oneRow && strip.n === 2 && strip.statsHidden, `phone: one row (search · Filters — region and mid-market live in the sheet), no type strip, no stats band (${strip.n} controls)`);
  check(strip.defaultRows > 0, `phone: the whole group's deals show by default (${strip.defaultRows} cards)`);
  const pick = await p.pg.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const before = document.querySelectorAll(".tx-panes-in .tx-card").length;
    document.querySelector("#tx-filters").click(); await wait(120);
    const c = [...document.querySelectorAll('#tx-sheet [data-facet="type"]')].find((x) => /Direct lending/.test(x.textContent));
    const n = +c.querySelector(".tx-secn").textContent;
    c.click(); await wait(120);
    const done = document.querySelector("#tx-sheet .tx-sheet-done").textContent;
    document.querySelector("#tx-sheet .tx-sheet-done").click(); await wait(150);
    return { before, n, done, after: document.querySelectorAll(".tx-panes-in .tx-card").length, sum: (document.querySelector("#tx-active .tx-sum") || {}).textContent || "" };
  });
  check(/Direct lending/.test(pick.sum) && pick.after > 0 && pick.after <= pick.before && pick.done === `Show ${pick.n} deals`, `phone: a type picked in the panel filters the list ("${pick.done}"; ${pick.after}/${pick.before})`);
  await p.pg.waitForSelector(".tx-panes-in .tx-card", { timeout: 8000 });
  await p.pg.waitForTimeout(400);
  // Phone: each deal is a two-line CARD (borrower · amount, then date · lender · type)
  // — the facts that matter fit 390px with no sideways-scrolling table, and the page
  // itself never scrolls horizontally.
  const drill = await p.pg.evaluate(() => {
    const c = document.querySelector(".tx-panes-in .tx-card");
    const r = c.getBoundingClientRect();
    return { vw: window.innerWidth, cardW: Math.round(r.width), table: !!document.querySelector(".tx-panes-in .tx-list"),
      // R43: the card is the shared events row — date · name · amount · source, then lender · type · country.
      nm: !!c.querySelector(".tx-card-nm") && c.firstElementChild.classList.contains("c-date"), meta: (c.querySelector(".g-ev-m") || { textContent: "" }).textContent.split(" · ").filter(Boolean).length + 1, lender: !!c.querySelector(".g-ev-m a.tx-mgr"),
      pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  check(!drill.table && drill.nm && drill.meta >= 3 && drill.cardW <= drill.vw, `phone: deals are events rows — date · name · amount, then lender · type · country (${drill.meta} parts, ${drill.cardW}px ≤ ${drill.vw})`);
  check(drill.lender, "phone: the card's lender links to its profile");
  // iPhone polish: the card meta is ONE line (no wrap; R43's shared row separates its
  // facts with "·" like every other list) and the stats strip is one line too.
  const one = await p.pg.evaluate(() => {
    const cards = [...document.querySelectorAll(".tx-panes-in .tx-card .g-ev-m")].slice(0, 12);
    const lh = (el) => parseFloat(getComputedStyle(el).lineHeight) || 16;
    const st = document.querySelector("#tx-stats");
    return { maxH: Math.max(...cards.map((c) => c.getBoundingClientRect().height)), lh: lh(cards[0]), dots: false,
      statsH: st ? st.getBoundingClientRect().height : 0, ph: document.querySelector("#tx-q").placeholder };
  });
  check(one.maxH <= one.lh * 1.6, `phone: card meta stays on one line (${Math.round(one.maxH)}px)`);
  check(one.statsH === 0 && one.ph === "Search deals, managers…", `phone: no stats band (the panel's Show N carries the count) and a short search placeholder`);
  check(drill.pageOverflow <= 1, `phone: the page itself does not scroll sideways (overflow ${drill.pageOverflow}px)`);
  // Tapping a card opens the deal in place of the list; Back returns to the list.
  await p.pg.evaluate(() => document.querySelector(".tx-panes-in .tx-card .tx-card-nm").click());
  await p.pg.waitForTimeout(200);
  const dv = await p.pg.evaluate(() => ({ open: !document.querySelector("#tx-drawer").hidden, listHidden: getComputedStyle(document.querySelector("#tx-body")).display === "none" }));
  check(dv.open && dv.listHidden, "phone: a card opens the deal in place of the list");
  await p.pg.goBack(); await p.pg.waitForTimeout(250);
  check(await p.pg.evaluate(() => document.querySelector("#tx-drawer").hidden && getComputedStyle(document.querySelector("#tx-body")).display !== "none"), "phone: Back returns from the deal to the list");
  // The open panel takes the list's place; sort + group sit under More filters; Show N returns.
  const ph = await p.pg.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    document.querySelector("#tx-filters").click(); await wait(120);
    const listHidden = getComputedStyle(document.querySelector("#tx-body")).display === "none";
    document.querySelector("#tx-sheet [data-fmore-t]").click(); await wait(120);
    const sheetSel = !!document.querySelector('#tx-sheet select[data-ctl="sort"]') && !!document.querySelector("#tx-sheet .tx-csv");
    const chipH = document.querySelector("#tx-sheet .tx-fchip").getBoundingClientRect().height;
    document.querySelector("#tx-sheet .tx-sheet-done").click(); await wait(120);
    return { listHidden, sheetSel, chipH, back: getComputedStyle(document.querySelector("#tx-body")).display !== "none" && document.querySelector("#tx-sheet").hidden };
  });
  check(ph.sheetSel, "phone: sort, group and CSV export live in the Filters panel, not the bar");
  check(ph.listHidden && ph.back && ph.chipH >= 30, `phone: the open panel replaces the list (chips ${ph.chipH}px tall); Show N deals returns to it`);
  checkErrs(p.errs, "transactions phone column fit");
  await p.ctx.close();
}

// Date (presets, years, quarters, a custom month range) + size bands narrow the list.
{
  const f = await open(b, DESKTOP, base + "/v2/transactions/");
  await f.pg.waitForSelector("#tx-stats b", { state: "attached", timeout: 8000 });
  const total = () => f.pg.evaluate(() => +((document.querySelector("#tx-stats b") || {}).textContent || 0));
  const sumTxt = () => f.pg.evaluate(() => (document.querySelector("#tx-active .tx-sum") || {}).textContent || "");
  const go = async (h) => { await f.pg.evaluate((h) => { location.hash = h; }, h); await f.pg.waitForTimeout(250); };
  const all = await total();
  await go("#/lending?period=30d"); const recent = await total();
  await go("#/lending?from=2025-01&to=2025-12"); const y2025 = await total();
  const yr = { pill: [await sumTxt()] };
  await go("#/lending?from=2025-04&to=2025-06"); const q2 = await total();
  const qp = [await sumTxt()];
  await go("#/lending?size=gt1bn"); const big = await total();
  await go("#/lending?min=1000"); const legacy = await f.pg.evaluate(() => location.hash);
  // The panel's ONE date menu (year / quarter / custom range) drives the same state.
  await go("#/lending");
  await f.pg.click("#tx-filters"); await f.pg.waitForTimeout(120);
  await f.pg.selectOption("#tx-date", "r:2025-01:2025-12"); await f.pg.waitForTimeout(150);
  const viaChip = await total();
  await f.pg.selectOption("#tx-date", "custom"); await f.pg.waitForTimeout(150);
  await f.pg.fill("#tx-from", "2024-01"); await f.pg.waitForTimeout(150);
  const rng = { h: await f.pg.evaluate(() => location.hash), pill: await sumTxt() };
  check(all > 0 && recent < all, `the date presets narrow the counts (last 30 days ${recent} < all ${all})`);
  check(y2025 > 0 && y2025 < all && yr.pill[0] === "2025" && viaChip === y2025, `a year narrows to that year (2025: ${y2025}; pill "${yr.pill.join("|")}")`);
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
  for (const m of ["lending", "structured", "mna"]) {
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
    // Structured leads with the VEHICLE (the audited CLO / fund name), not the news headline.
    const sRows = [...document.querySelectorAll("#tx-body tr.tx-row")].slice(0, 40);
    const { deals } = await import("/credit/js/data.js");
    const hl = new Map(deals.map((d) => [d.id, (d.headline || "").trim()]));
    const vehicles = sRows.map((tr) => [tr.querySelector("td.tx-bd").textContent.replace("▸", "").trim(), hl.get(tr.dataset.deal)]);
    const vehLead = vehicles.length > 0 && vehicles.filter(([v, h]) => v && v !== h).length >= vehicles.length * 0.9;
    const events = [...document.querySelectorAll("#tx-body td.txc-ev")].map((td) => td.textContent.trim()).filter((t) => t !== "—");
    const alt = document.querySelector("#tx-body .tx-alt");
    let altDrawer = "";
    if (alt) { alt.closest("tr").querySelector("td.tx-bd").click(); await wait(150); altDrawer = document.querySelector("#tx-drawer").innerText; }
    return { n: ids.length, allMna: ids.length > 0 && ids.every((id) => mna.has(id)), noneInLending: ![...mna].some((id) => lendIds.has(id)), heads, x: x ? x.textContent : "", sHeads, events: [...new Set(events)], vehLead, vehSample: vehicles.slice(0, 3).map(([v]) => v), alt: !!alt, altDrawer: /Also reported/i.test(altDrawer) };
  });
  check(r.allMna && r.noneInLending, `Manager M&A lists exactly the asset-manager acquisitions, kept out of Lending (${r.n})`);
  check(r.heads.join("|") === "Date|Target|Acquirer|Country|Value|Source", `Manager M&A columns (R43 date first): Date · Target · Acquirer · Country · Value · Source (${r.heads.join(" · ")})`);
  check(/^(EV|AUM) /.test(r.x) || r.x === "", `a non-deal-size figure reads muted with its kind (${r.x || "none on this page"})`);
  check(r.vehLead, `Structured credit leads each row with the vehicle name, not the headline (${r.vehSample.join(" · ")})`);
  check(r.sHeads.join("|") === "Date|Vehicle|Manager|Type|Event|Country|Size|AAA / WACD|Source" && r.events.some((e) => /New issue|Reset|Refi/.test(e)), `Structured credit has its own columns incl. the CLO event (${r.sHeads.join(" · ")}; ${r.events.join(", ")})`);
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
    const rows = [...document.querySelectorAll("#tx-body tr.tx-row")].map((tr) => (tr.dataset.parties || "").split(" ").filter(Boolean));
    const n2 = n(), l2 = btn.textContent, h2 = location.hash, sum = (document.querySelector("#tx-active .tx-sum") || {}).textContent || "";
    btn.click(); await wait(120);
    return { n0, n2, l2, h2, sum, allCore: rows.length > 0 && rows.every((ids) => ids.some((id) => core.has(id))), off: btn.getAttribute("aria-pressed") === "false" && n() === n0 };
  });
  check(t.l2 === "European mid-market" && /focus=target/.test(t.h2) && /European mid-market managers/.test(t.sum), `the bar's Target button filters to Target managers and back (${t.n0} → ${t.n2})`);
  check(t.allCore && t.n2 > 0 && t.n2 < t.n0 && t.off, "Target lists only target-market managers' deals (European · ≤ $15bn · 15%+ strategy)");
  // Region: "All Europe" selects every European region and reads as one pill.
  await f.pg.click("#tx-filters"); await f.pg.waitForTimeout(120);
  await f.pg.locator("#tx-sheet [data-europe]").click(); await f.pg.waitForTimeout(150);
  await f.pg.click("#tx-sheet .tx-sheet-done"); await f.pg.waitForTimeout(120);
  const eu = await f.pg.evaluate(() => ({ h: location.hash, pills: [(document.querySelector("#tx-active .tx-sum") || {}).textContent || ""], ctry: [...document.querySelectorAll("#tx-body td.txc-ctry")].map((td) => td.textContent.trim()) }));
  const nonEu = eu.ctry.filter((c) => ["US", "Canada", "Australia", "Asia", "Middle East", "Latin America", "Africa", "Global", "Cayman Islands", "Jersey", "Guernsey", "Bermuda", "—"].includes(c));
  check(/reg=uki,dach/.test(eu.h) && eu.pills.join("|") === "Europe" && eu.ctry.length > 0 && !nonEu.length, `All Europe narrows to European deals and reads as one "Europe" (${eu.ctry.length} rows, ${nonEu.length} non-European)`);
  checkErrs(f.errs, "transactions R39");
  await f.ctx.close();
}

await b.close(); srv.close();
finish();
