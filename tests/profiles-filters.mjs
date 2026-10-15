// Profiles lists — the Filters sheet (facets with live counts), the $1–15bn → Target
// tri-state, Target-first ordering + the Fit / 90d columns, phone card rows with a sort
// select, and the Hedge Funds Monitor / Cross-holdings views in the phone sheet
// (HOUSE_STYLE R39).
import { serve, launchChromium, open, DESKTOP, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const vis = (pg, sel) => pg.evaluate((sel) => [...document.querySelectorAll("#pf-panes " + sel)].filter((t) => t.style.display !== "none").length, sel);

{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/profiles/#/?tab=managers");
  await pg.waitForSelector("#pf-panes #mgr-rows tr", { timeout: 8000 });
  const ord = await pg.evaluate(async () => {
    const [D, T] = await Promise.all([import("/credit/js/data.js"), import("/credit/js/target.js")]);
    const by = new Map(); D.funds.forEach((f) => { if (!by.has(f.managerId)) by.set(f.managerId, []); by.get(f.managerId).push(f); });
    const tier = new Map(D.managers.map((m) => [m.id, T.targetFit(m, by.get(m.id) || []).tier]));
    const rows = [...document.querySelectorAll("#pf-panes #mgr-rows tr")];
    const ranks = rows.map((r) => T.TIER_RANK[tier.get(r.getAttribute("data-href").split("/").pop())]);
    const heads = [...document.querySelectorAll('#pf-panes .tpane[data-pane="managers"] thead th')].map((h) => h.textContent.trim());
    const first = rows[0].querySelector(".tl-fit").textContent.trim();
    const act = rows.map((r) => r.querySelector(".tl-act")).filter((td) => td && +td.dataset.sort > 0);
    // The 90d count matches the ledger (deals + news in the last 90 days).
    const id = act[0] && act[0].closest("tr").getAttribute("data-href").split("/").pop();
    const n90 = [...D.deals, ...D.intel].filter((x) => x.managerId === id && x.date && Date.parse(x.date) >= Date.now() - 90 * 864e5).length;
    return { tierSorted: ranks.every((r, i) => i === 0 || r >= ranks[i - 1]), first, heads, nAct: act.length, actOk: !!act[0] && +act[0].dataset.sort === n90, core: ranks.filter((r) => r === 0).length };
  });
  check(ord.tierSorted && ord.first === "European mid-market", `Managers open Target-first (tier order kept down the list; ${ord.core} Target managers lead)`);
  check(ord.heads.includes("Fit") && ord.heads.includes("90d"), `Managers carry Fit and 90d columns (${ord.heads.join(" · ")})`);
  check(ord.nAct > 0 && ord.actOk, `the 90d column counts tracked deals + news in the last 90 days (${ord.nAct} active)`);

  // $1–15bn → Target → off.
  const all = await vis(pg, "#mgr-rows tr");
  // One-row bar: search · Target · Filters. Target toggles; $1–15bn is the panel's Managers row.
  const bar = await pg.evaluate(() => [...document.querySelectorAll('#pf-panes .tpane[data-pane="managers"] .thead-search button, #pf-panes .tpane[data-pane="managers"] .thead-search input, #pf-panes .tpane[data-pane="managers"] .thead-search select')]
    .filter((e) => e.offsetParent && getComputedStyle(e).display !== "none").map((e) => e.id || e.className));
  check(bar.join("|") === "mgr-q|cr-lg-focus|tx-fbtn pf-filter-btn", `Profiles bar is ONE row: search · Target · Filters (${bar.join(", ")})`);
  await pg.locator("#pf-panes #cr-lg-focus").click(); const tgt = await vis(pg, "#mgr-rows tr");
  const t = await pg.evaluate(() => ({ l: document.querySelector("#pf-panes #cr-lg-focus").textContent, allCore: [...document.querySelectorAll("#pf-panes #mgr-rows tr")].filter((r) => r.style.display !== "none").every((r) => r.dataset.tier === "core") }));
  await pg.locator("#pf-panes #cr-lg-focus").click(); const off = await vis(pg, "#mgr-rows tr");
  await pg.locator('#pf-panes .tpane[data-pane="managers"] .pf-filter-btn').click(); await pg.waitForTimeout(100);
  await pg.locator('#pf-panes [data-pffit="band"]').click(); const band = await vis(pg, "#mgr-rows tr");
  await pg.locator('#pf-panes [data-pffit=""]').click();
  await pg.locator('#pf-panes .pf-sheet-done').click(); await pg.waitForTimeout(100);
  check(t.l === "European mid-market" && tgt > 0 && tgt < band && band < all && t.allCore && off === all, `Target toggles from the bar (${tgt}); $1–15bn from the panel (${band}); off restores ${off}/${all}`);

  // Filters sheet: facets with live counts; OR within, AND across; pills; Clear all.
  await pg.locator('#pf-panes .tpane[data-pane="managers"] .pf-filter-btn').click(); await pg.waitForTimeout(120);
  const s1 = await pg.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const pane = document.querySelector('#pf-panes .tpane[data-pane="managers"]');
    const groups0 = [...pane.querySelectorAll(".pf-sheet .tx-fgrp")].map((g) => g.dataset.fgrp).filter(Boolean);
    pane.querySelector(".pf-sheet [data-pfmore]").click(); await wait(80);
    const groups = [...pane.querySelectorAll(".pf-sheet .tx-fgrp")].map((g) => g.dataset.fgrp).filter(Boolean);
    const n = (el) => +el.querySelector(".tx-secn").textContent;
    const visN = () => [...pane.querySelectorAll("#mgr-rows tr")].filter((t) => t.style.display !== "none").length;
    const uk = pane.querySelector('.pf-sheet [data-pfacet="region"][data-v="UK & Ireland"]');
    const nUk = n(uk); uk.click(); await wait(80);
    const afterUk = visN();
    const fr = pane.querySelector('.pf-sheet [data-pfacet="region"][data-v="France & Benelux"]');
    const nFr = n(fr); fr.click(); await wait(80);
    const both = visN();
    const dist = pane.querySelector('.pf-sheet [data-pfacet="strategy"][data-v="Distressed & special sits"]');
    const nDist = n(dist); dist.click(); await wait(80);
    const and = visN();
    const okRows = [...pane.querySelectorAll("#mgr-rows tr")].filter((t) => t.style.display !== "none").every((t) => /UK & Ireland|France & Benelux/.test(t.getAttribute("data-f-region")) && /Distressed/.test(t.getAttribute("data-f-strategy")));
    const pills = ((pane.querySelector(".pf-active .tx-sum") || {}).textContent || "").split(", ").filter(Boolean);
    const btn = pane.querySelector(".pf-filter-btn .tx-fn").textContent, done = pane.querySelector(".pf-sheet-done").textContent;
    const desk = getComputedStyle(pane.querySelector(".pf-sheet")).position;
    pane.querySelector(".pf-sheet-done").click(); await wait(80);
    const closed = pane.querySelector(".pf-sheet").hidden;
    pane.querySelector('.pf-active [data-pfclear="all"]').click(); await wait(80);
    return { groups0, desk, groups, nUk, afterUk, nFr, both, nDist, and, okRows, pills, btn, done, closed, cleared: visN() };
  });
  check(s1.groups0.join(",") === "fit,strategy,region" && ["band", "mkt", "show"].every((g) => s1.groups.includes(g)) && s1.desk === "absolute", `Managers panel: Managers · Strategy · Region; More adds AUM · In market · Show & sort; a dropdown on desktop (${s1.groups0.join(", ")} + ${s1.groups.filter((g) => !s1.groups0.includes(g)).join(", ")})`);
  check(s1.afterUk === s1.nUk && s1.both === s1.nUk + s1.nFr && s1.and === s1.nDist && s1.and > 0 && s1.okRows, `facets: live counts, OR within a facet, AND across (${s1.nUk} UK + ${s1.nFr} FR&B = ${s1.both}; ∧ distressed = ${s1.and})`);
  check(s1.pills.length === 3 && s1.btn === "3" && s1.done === `Show ${s1.and}` && s1.closed && s1.cleared === all, `one summary line + a count on the Filters button + "Show N"; Clear restores the list (${s1.pills.join(", ")})`);

  // The Fit header sorts by tier (data-sort), not alphabetically.
  await pg.locator('#pf-panes .tpane[data-pane="managers"] th.tl-fit').click(); await pg.waitForTimeout(100);
  await pg.locator('#pf-panes .tpane[data-pane="managers"] th.tl-fit').click(); await pg.waitForTimeout(100);
  const fitAsc = await pg.evaluate(() => document.querySelector("#pf-panes #mgr-rows tr .tl-fit").textContent.trim());
  check(fitAsc === "European mid-market", `the Fit column sorts by tier (ascending → ${fitAsc} first)`);

  // Other lists' facets.
  for (const [tab, want] of [["hedgefunds", ["strategy", "region"]], ["investors", ["type", "mandate"]], ["firms", ["tier", "practice"]]]) {
    await pg.goto(base + "/v2/profiles/#/?tab=" + tab); await pg.waitForTimeout(500);
    await pg.locator(`#pf-panes .tpane[data-pane="${tab}"] .pf-filter-btn`).click(); await pg.waitForTimeout(120);
    const g = await pg.evaluate((tab) => [...document.querySelectorAll(`#pf-panes .tpane[data-pane="${tab}"] .pf-sheet .tx-fgrp`)].map((x) => x.dataset.fgrp).filter(Boolean), tab);
    check(want.every((w) => g.includes(w)), `${tab}: facets ${want.join(" · ")} (${g.join(", ")})`);
  }
  checkErrs(errs, "profiles filters desktop");
  await ctx.close();
}

// List state lives in the URL: reload, Back from a profile and a tab round-trip restore it.
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/profiles/#/?tab=managers");
  await pg.waitForSelector("#pf-panes #mgr-rows tr", { timeout: 8000 });
  const M = '#pf-panes .tpane[data-pane="managers"]';
  await pg.locator(M + " .pf-filter-btn").click(); await pg.waitForTimeout(120);
  await pg.locator(M + ' [data-pfacet="region"][data-v="UK & Ireland"]').click(); await pg.waitForTimeout(100);
  await pg.locator(M + ' [data-pfacet="strategy"][data-v="Opportunistic"]').click(); await pg.waitForTimeout(100);
  await pg.locator(M + " .pf-sheet-done").click();
  await pg.locator("#pf-panes #cr-lg-focus").click(); await pg.waitForTimeout(100);
  await pg.locator(M + " th.tl-fit").click(); await pg.waitForTimeout(100);
  await pg.fill("#pf-panes #mgr-q", "capital"); await pg.waitForTimeout(150);
  const snap = () => pg.evaluate((M) => ({ h: location.hash, n: [...document.querySelectorAll("#pf-panes #mgr-rows tr")].filter((t) => t.style.display !== "none").length,
    first: (document.querySelector("#pf-panes #mgr-rows tr:not([style*='none'])") || {}).dataset?.href, q: document.querySelector("#pf-panes #mgr-q").value,
    focus: document.querySelector("#pf-panes #cr-lg-focus").getAttribute("aria-pressed"), pills: (document.querySelector(M + " .pf-active .tx-sum") || {}).textContent || "" }), M);
  const a = await snap();
  check(/tab=managers/.test(a.h) && /q=capital/.test(a.h) && /aum=target/.test(a.h) && /region=UK/.test(a.h) && /strategy=Opportunistic/.test(a.h) && /sort=2-desc/.test(a.h), `Profiles list filters + sort are in the URL (${a.h})`);
  await pg.reload(); await pg.waitForSelector("#pf-panes #mgr-rows tr", { state: "attached", timeout: 8000 }); await pg.waitForTimeout(300);
  const r = await snap();
  check(r.h === a.h && r.n === a.n && r.first === a.first && r.q === "capital" && r.focus === "true" && r.pills === a.pills, `a reload restores the filtered, sorted list (${r.n} rows; ${r.pills})`);
  await pg.evaluate(() => document.querySelector("#pf-panes #mgr-rows tr:not([style*='none']) td.tl-nm").click());
  await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 8000 });
  await pg.goBack(); await pg.waitForTimeout(400);
  const bk = await snap();
  check(bk.h === a.h && bk.n === a.n, `Back from a profile returns to the same filtered list (${bk.n})`);
  await pg.locator('#pf-chips .tchip[data-p="hedgefunds"]').click(); await pg.waitForTimeout(200);
  await pg.locator('#pf-chips .tchip[data-p="managers"]').click(); await pg.waitForTimeout(200);
  const tr = await snap();
  check(tr.h === a.h && tr.n === a.n, "switching list tabs and back keeps each list's filters");
  await pg.locator('[data-key="profiles"]').filter({ visible: true }).first().click(); await pg.waitForTimeout(300);
  const hm = await snap();
  check(!hm.pills && hm.q === "" && hm.focus === "false" && !/q=|region=|aum=/.test(hm.h), `re-tapping Profiles resets the list filters (${hm.h})`);
  checkErrs(errs, "profiles URL state");
  await ctx.close();
}

// Phone: card rows, a sort select, Monitor / Cross-holdings in the HF sheet.
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/profiles/#/?tab=managers");
  await pg.waitForSelector("#pf-panes #mgr-rows tr", { timeout: 8000 });
  const c = await pg.evaluate(() => {
    const tr = document.querySelector("#pf-panes #mgr-rows tr");
    const nm = tr.querySelector(".tl-nm").getBoundingClientRect(), main = tr.querySelector(".pf-c-main").getBoundingClientRect();
    const metas = [...tr.querySelectorAll(".pf-c-meta")].filter((td) => getComputedStyle(td).display !== "none");
    return { thead: getComputedStyle(document.querySelector('#pf-panes .tpane[data-pane="managers"] thead')).display, sameLine: Math.abs(nm.top - main.top) < 4, mainRight: main.right > window.innerWidth - 20,
      metaBelow: metas.length >= 2 && metas.every((m) => m.getBoundingClientRect().top > nm.bottom - 2), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      bar: [...document.querySelectorAll('#pf-panes .tpane[data-pane="managers"] .thead-search :is(input, button, select)')].filter((e) => e.offsetParent && getComputedStyle(e).display !== "none").length };
  });
  check(c.thead === "none" && c.sameLine && c.mainRight && c.metaBelow && c.overflow <= 1, `phone: Managers rows are cards — name · AUM, then HQ · fit · activity (no sideways scroll, ${c.overflow}px)`);
  check(c.bar === 3, `phone: one-row bar (search · Target · Filters; ${c.bar} controls)`);
  // Sorting sits in the panel (Show & sort, under More filters) — headers are hidden on phone.
  await pg.locator('#pf-panes .tpane[data-pane="managers"] .pf-filter-btn').click(); await pg.waitForTimeout(100);
  await pg.locator('#pf-panes [data-pfmore]').click(); await pg.waitForTimeout(100);
  await pg.selectOption('#pf-panes .tpane[data-pane="managers"] .pf-sort-p', { label: "Group AUM ↓" }); await pg.waitForTimeout(150);
  await pg.locator('#pf-panes .pf-sheet-done').click(); await pg.waitForTimeout(100);
  const aum = await pg.evaluate(() => [...document.querySelectorAll("#pf-panes #mgr-rows tr")].slice(0, 5).map((r) => r.querySelector(".pf-c-main").textContent.trim()));
  check(/^\$1\.\d+tn$|^\$1\d{3}/.test(aum[0]) || /tn/.test(aum[0]), `phone: sorting by Group AUM ↓ puts the largest first (${aum.join(", ")})`);
  await pg.goto(base + "/v2/profiles/#/?tab=hedgefunds"); await pg.waitForTimeout(600);
  const hf = await pg.evaluate(() => ({ mon: getComputedStyle(document.querySelector("#pf-panes #hf-mon-btn")).display, cons: getComputedStyle(document.querySelector("#pf-panes #hf-cons-btn")).display }));
  await pg.locator('#pf-panes .tpane[data-pane="hedgefunds"] .pf-filter-btn').click(); await pg.waitForTimeout(150);
  await pg.locator('#pf-panes .tpane[data-pane="hedgefunds"] [data-proxy="#hf-mon-btn"]').click(); await pg.waitForTimeout(250);
  const opened = await pg.evaluate(() => ({ ofr: !document.querySelector("#pf-panes #hf-ofr").hidden, sheet: document.querySelector('#pf-panes .tpane[data-pane="hedgefunds"] .pf-sheet').hidden }));
  check(hf.mon === "none" && hf.cons === "none" && opened.ofr && opened.sheet, "Monitor / Cross-holdings live in the Hedge Funds Filters panel (one-row bar); a view opens and the panel closes");
  checkErrs(errs, "profiles filters phone");
  await ctx.close();
}

await b.close(); srv.close();
finish();
