// Transactions ▸ Credits sub-tab: a Lending/Structured credit/Secondaries/Credits/BDCs nav. Credits mode
// shows the European credit universe (ELLI) organised by sector with issuer
// ratings — or, until the sourced roster has landed, an honest "being compiled"
// state. Toggling swaps the chrome + body (no leftover deal-flow controls).
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/transactions/`);
await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
await pg.waitForTimeout(1600);

// The top-level nav: Lending (default, on) + Structured credit + Secondaries + Credits + BDCs.
const modes = await pg.evaluate(() => [...document.querySelectorAll("#tx-mode .tchip")].map((c) => ({ label: c.textContent.trim().replace(/\s+\d+$/, ""), on: c.classList.contains("is-on") })));
check(modes.map((m) => m.label).join("/") === "Lending/Structured credit/Secondaries/Manager M&A/Credits/BDCs", `nav chips are Lending / Structured credit / Secondaries / Manager M&A / Credits / BDCs (${modes.map((m) => m.label).join("/")})`);
check(modes[0].on && !modes[1].on, "Lending is the default mode");

// Deal-flow chrome (shared by Primary/Secondaries) shows the type table; the credits body is hidden.
const flow = await pg.evaluate(() => { const d = (id) => getComputedStyle(document.querySelector("#" + id)).display; return { search: d("tx-flow-search"), body: d("tx-body"), credits: d("tx-credits-body") }; });
check(flow.search !== "none" && flow.body !== "none" && flow.credits === "none", "Lending mode shows the deal-flow body, hides the credits body");

// Switch to Credits.
await pg.evaluate(() => document.querySelector('#tx-mode .tchip[data-mode="credits"]').click());
await pg.waitForTimeout(300);
const cr = await pg.evaluate(() => {
  const d = (id) => getComputedStyle(document.querySelector("#" + id)).display;
  const cb = document.querySelector("#tx-credits-body");
  return {
    flowSearchHidden: d("tx-flow-search") === "none", flowBodyHidden: d("tx-body") === "none",
    crSearchShown: d("tx-credits-search") !== "none", crBodyShown: d("tx-credits-body") !== "none",
    rows: cb.querySelectorAll(".tcr-row").length,
    empty: !!cb.querySelector(".tw-empty"),
    text: (cb.textContent || "").trim().length,
  };
});
check(cr.flowSearchHidden && cr.flowBodyHidden, "Credits mode hides all the deal-flow chrome (no leftover search/table)");
check(cr.crSearchShown && cr.crBodyShown, "Credits mode shows the credit search + roster body");
// Either the sourced roster (table rows) or the honest "being compiled" state.
check((cr.rows > 0) || (cr.empty && cr.text > 0), `Credits body shows the roster table or the compiling state (rows ${cr.rows})`);

// Once the roster has landed, every row must be REAL + SOURCED (R7/R22): a named
// obligor, and a rating that is either a link to a public rating action or an
// honest "NR" — never an unsourced rating. One agency, named in the meta line.
if (cr.rows > 0) {
  const q = await pg.evaluate(() => {
    const cb = document.querySelector("#tx-credits-body");
    const rows = [...cb.querySelectorAll(".tcr-row")];
    const named = rows.filter((r) => (r.querySelector(".tcr-nm") || {}).textContent.trim()).length;
    const rated = rows.map((r) => r.querySelector(".tcr-rt")).filter(Boolean);
    const badRating = rated.filter((rt) => {
      const nr = rt.classList.contains("tcr-nr");
      const a = rt.tagName === "A" && /^https?:/.test(rt.getAttribute("href") || "");
      return !nr && !a;                       // a real rating with no source link is illegal
    }).length;
    // Four columns per row: name, the borrower's jurisdiction (full country name),
    // the sector, and a rating with its 12-month trend arrow.
    const juris = rows.filter((r) => ((r.querySelector(".tcr-jur") || {}).textContent || "").trim().length > 1).length;
    const sectors = rows.filter((r) => (r.querySelector(".tcr-sec") || {}).textContent.trim()).length;
    const trends = rows.map((r) => r.querySelector(".tcr-tr")).filter(Boolean);
    const badTrend = trends.filter((t) => !(t.classList.contains("tx-up") || t.classList.contains("tx-dn") || t.classList.contains("tx-fl"))).length;
    // The roster is a real table with the four expected column headers.
    const heads = [...cb.querySelectorAll(".tcr-tbl thead th")].map((h) => h.textContent.trim());
    return { total: rows.length, named, sourced: rated.filter((rt) => rt.tagName === "A" && /^https?:/.test(rt.getAttribute("href") || "")).length, badRating, juris, sectors, trends: trends.length, badTrend, heads };
  });
  check(q.named === q.total, `Credits: every listed obligor is named (${q.named}/${q.total})`);
  check(q.badRating === 0, `Credits: no unsourced ratings — each rating links its action or shows NR (${q.badRating} bad)`);
  check(q.sourced > 0, `Credits: ratings link to their public source (${q.sourced} linked)`);
  check(q.juris === q.total, `Credits: every obligor shows its jurisdiction (${q.juris}/${q.total})`);
  check(q.sectors === q.total, `Credits: every obligor shows its sector column (${q.sectors}/${q.total})`);
  check(q.trends === q.total && q.badTrend === 0, `Credits: every obligor shows a 12-month rating trend (${q.trends}/${q.total}, ${q.badTrend} bad)`);
  check(q.heads.length === 4 && /Borrower/i.test(q.heads[0]) && /Jurisdiction/i.test(q.heads[1]) && /Sector/i.test(q.heads[2]) && /Rating/i.test(q.heads[3]), `Credits: four-column table header (${q.heads.join("/")})`);

  // Group-by controls (sector | rating) — a mutually-exclusive pair, styled like the
  // news/manager-wire group button, defaulting to sector.
  // The group-by pair lives in the Credits Filters panel (one-row bar, R39e).
  await pg.evaluate(() => document.querySelector("#tx-cr-filters").click()); await pg.waitForTimeout(120);
  const g0 = await pg.evaluate(() => {
    const btns = [...document.querySelectorAll("#tx-cr-ctl .tcr-grpbtn")];
    return { n: btns.length, labels: btns.map((b) => b.textContent.trim()), anyOn: btns.some((b) => b.classList.contains("is-on")) };
  });
  check(g0.n === 2 && /sector/i.test(g0.labels[0] || "") && /rating/i.test(g0.labels[1] || ""), `Credits: two group-by buttons (${g0.labels.join(", ")})`);
  check(!g0.anyOn, "Credits: no group-by button carries the accent until one is picked");
  // Switching to group-by-rating re-orders the roster best → worst.
  await pg.evaluate(() => document.querySelector('#tx-cr-ctl [data-crgroup="rating"]').click());
  await pg.waitForTimeout(150);
  const g1 = await pg.evaluate(() => {
    const ORDER = ["AAA", "AA+", "AA", "AA-", "A+", "A", "A-", "BBB+", "BBB", "BBB-", "BB+", "BB", "BB-", "B+", "B", "B-", "CCC+", "CCC", "CCC-", "CC", "C", "SD", "D"];
    const rk = (r) => { const i = ORDER.indexOf(r); return i === -1 ? 999 : i; };
    const ranks = [...document.querySelectorAll("#tx-credits-body .tcr-row .tcr-rt")].map((a) => rk(a.textContent.trim()));
    let sorted = true; for (let i = 1; i < ranks.length; i++) if (ranks[i] < ranks[i - 1]) { sorted = false; break; }
    return { sorted, count: ranks.length, ratingOn: document.querySelector('#tx-cr-ctl [data-crgroup="rating"]').classList.contains("is-on"), sectorOff: !document.querySelector('#tx-cr-ctl [data-crgroup="sector"]').classList.contains("is-on") };
  });
  check(g1.ratingOn && g1.sectorOff && g1.count === q.total, `Credits: group-by-rating becomes active and keeps every row (${g1.count})`);
  check(g1.sorted, "Credits: group-by-rating orders the roster best → worst");
  // Clicking the active button again toggles it OFF, back to the neutral default.
  await pg.evaluate(() => document.querySelector('#tx-cr-ctl [data-crgroup="rating"]').click());
  await pg.waitForTimeout(120);
  const g2 = await pg.evaluate(() => ({ anyOn: [...document.querySelectorAll("#tx-cr-ctl .tcr-grpbtn")].some((b) => b.classList.contains("is-on")), rows: document.querySelectorAll("#tx-credits-body .tcr-row").length }));
  check(!g2.anyOn && g2.rows === q.total, `Credits: clicking the active group-by button again turns it off (${g2.rows} rows)`);
  await pg.evaluate(() => document.querySelector("#tx-cr-sheet .tx-sheet-done").click()); await pg.waitForTimeout(120);
}

// A credit row opens what the app knows about the name: the tracked deals that NAME
// it (each opening its deal) and the covered lenders behind them; the open row is in
// the URL (?open=), so search / a pasted link can land on it.
{
  const rel = await pg.evaluate(async () => {
    const row = [...document.querySelectorAll("#tx-credits-body tr.tcr-row")].find((r) => r.querySelector(".tcr-n"));
    if (!row) return null;
    row.click(); await new Promise((r) => setTimeout(r, 120));
    const exp = row.nextElementSibling;
    return { name: row.dataset.cr, shown: !exp.hidden, deals: exp.querySelectorAll("[data-deal]").length, n: +row.querySelector(".tcr-n").textContent, hash: location.hash };
  });
  check(!!rel, "Credits: at least one obligor is named in a tracked deal (count badge)");
  if (rel) {
    check(rel.shown && rel.deals > 0 && rel.deals <= rel.n, `Credits: a row opens the deals that name it (${rel.name}: ${rel.deals} shown of ${rel.n})`);
    check(/^#\/credits\?.*open=/.test(rel.hash), `Credits: the open row is in the URL (${rel.hash})`);
    await pg.evaluate(() => document.querySelector("#tx-credits-body tr.tcr-exp:not([hidden]) [data-deal]").click());
    await pg.waitForTimeout(200);
    const d = await pg.evaluate(() => ({ mode: (document.querySelector("#tx-mode .tchip.is-on") || {}).dataset.mode, drawer: !document.querySelector("#tx-drawer").hidden }));
    check(d.drawer && ["lending", "structured", "secondary"].includes(d.mode), `Credits: a named deal opens its deal drawer (${d.mode})`);
  }
}

// Toggling back restores the deal-flow table (Lending).
await pg.evaluate(() => document.querySelector('#tx-mode .tchip[data-mode="lending"]').click());
await pg.waitForTimeout(200);
checkEq(await pg.evaluate(() => getComputedStyle(document.querySelector("#tx-body")).display !== "none" && getComputedStyle(document.querySelector("#tx-credits-body")).display === "none"), true, "toggling back restores the deal-flow table");

// Credits filters (T15): rating band · 12-month trend · jurisdiction · sector, multi-select
// with live counts, as pills, in the URL; plus sortable columns and a downgrade count.
{
  await pg.goto(`http://localhost:${srv.port}/v2/transactions/#/credits`); await pg.waitForSelector("#tx-credits-body .tcr-row", { timeout: 8000 });
  const f = await pg.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const total = document.querySelectorAll("#tx-credits-body .tcr-row").length;
    document.querySelector("#tx-cr-filters").click(); await wait(120);
    const groups = [...document.querySelectorAll("#tx-cr-sheet .tx-fgrp")].map((g) => g.dataset.fgrp);
    const listHidden = getComputedStyle(document.querySelector("#tx-credits-body")).display === "none";
    const down = document.querySelector('#tx-cr-sheet [data-crfacet="trend"][data-v="down"]');
    const nDown = down ? +down.querySelector(".tx-secn").textContent : 0;
    if (down) down.click(); await wait(120);
    document.querySelector("#tx-cr-sheet .tx-sheet-done").click(); await wait(120);
    const rows = [...document.querySelectorAll("#tx-credits-body .tcr-row")];
    const allDown = rows.length > 0 && rows.every((r) => r.querySelector(".tcr-tr.tx-dn"));
    const pills = [(document.querySelector("#tx-cr-active .tx-sum") || {}).textContent || ""];
    const stats = (document.querySelector("#tx-credits-body .tx-stats") || {}).textContent || "";
    const h = location.hash;
    document.querySelector('#tx-cr-active [data-crclear="all"]').click(); await wait(120);
    document.querySelector('#tx-credits-body th[data-crsort="name"]').click(); await wait(120);
    const names = [...document.querySelectorAll("#tx-credits-body .tcr-row .tcr-nm")].map((td) => td.textContent.replace("▸", "").replace(/^\d+/, "").trim());
    return { total, groups, listHidden, nDown, n: rows.length, allDown, pills, stats, h, back: document.querySelectorAll("#tx-credits-body .tcr-row").length,
      az: names.every((x, i) => i === 0 || names[i - 1].localeCompare(x) <= 0), sortH: location.hash };
  });
  check(["rating", "trend", "jur", "sector"].every((g) => f.groups.includes(g)) && f.listHidden, `Credits: a Filters sheet with rating · trend · jurisdiction · sector (${f.groups.join(", ")})`);
  check(f.n === f.nDown && f.allDown && f.pills.join("|") === "▼ Downgraded" && /tr=down/.test(f.h), `Credits: "▼ Downgraded" narrows to the 12-month downgrades, as a pill and in the URL (${f.n})`);
  check(/\d+ credits?/.test(f.stats) && /downgraded/.test(f.stats), `Credits: a stats line counts credits and up/downgrades (${f.stats.trim()})`);
  check(f.back === f.total && f.az && /sort=name/.test(f.sortH), `Credits: Clear all restores every row; the Borrower header sorts A–Z (${f.sortH})`);
}
checkErrs(errs, "transactions credits");
await ctx.close();
await b.close(); srv.close();
finish();
