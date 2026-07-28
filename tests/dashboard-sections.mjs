// Dashboard ▸ Fixed Income + Legal sections. Sub-tab order is Macro · Equities ·
// Fixed Income · Credit · Legal. Fixed Income shows the sovereign yield curves
// (government) and the ICE BofA OAS spreads container (corporate). Legal is a
// SEARCH interface over all alerts + case law: nothing lists until a keyword is
// entered; practice-area chips limit the search; every result is sourced.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/dashboard/fixed-income/");
await pg.waitForTimeout(1600);

// Sub-tabs in the requested order, Fixed Income active with both blocks.
const fi = await pg.evaluate(() => ({
  tabs: [...document.querySelectorAll(".dsh-nav .tchip[data-sub]")].map((c) => c.dataset.sub),
  yc: !!document.querySelector(".dsh-yc-svg"),
  spreads: !!document.querySelector("#dsh-spreads"),
}));
checkEq(fi.tabs.join(","), "macro,equities,fixed-income,credit,legal", "Dashboard sub-tab order (Fixed Income before Credit)");
check(fi.yc, "Fixed Income: sovereign yield curve renders (government)");
check(fi.spreads, "Fixed Income: corporate credit-spreads block present");

// Switch to Legal — a search interface, not a list.
await pg.evaluate(() => { const t = [...document.querySelectorAll(".dsh-nav .tchip[data-sub]")].find((c) => c.dataset.sub === "legal"); t && t.click(); });
await pg.waitForTimeout(800);
const lg = await pg.evaluate(() => ({
  search: !!document.querySelector("#dsh-lgl-q"),
  chips: document.querySelectorAll(".dsh-lgl-chip").length,
  itemsDefault: document.querySelectorAll(".dsh-lgl-i").length,
}));
check(lg.search, "Legal: search box present");
checkEq(lg.chips, 4, "Legal: four practice-area limit chips");
checkEq(lg.itemsDefault, 0, "Legal: no list until a keyword is entered (search-driven)");

// A keyword surfaces sourced, practice-area-grouped results.
const searched = await pg.evaluate(() => {
  const q = document.querySelector("#dsh-lgl-q"); q.value = "supreme court"; q.dispatchEvent(new Event("input"));
  return { items: document.querySelectorAll(".dsh-lgl-i").length, srcs: document.querySelectorAll(".dsh-lgl-t[href^='http']").length, groups: document.querySelectorAll(".dsh-lgl-grp-h").length };
});
check(searched.items > 0, `Legal: keyword search returns results (${searched.items})`);
check(searched.groups >= 1, `Legal: results grouped by practice area (${searched.groups})`);
checkEq(searched.srcs, searched.items, `Legal: every result links its source (${searched.srcs}/${searched.items})`);

// A practice-area chip limits the search to that area (single group).
const scoped = await pg.evaluate(() => {
  const c = [...document.querySelectorAll(".dsh-lgl-chip")].find((x) => x.dataset.area === "ri"); c && c.click();
  return { groups: document.querySelectorAll(".dsh-lgl-grp-h").length, on: [...document.querySelectorAll(".dsh-lgl-chip.is-on")].map((x) => x.dataset.area) };
});
checkEq(scoped.groups, 1, "Legal: a practice-area chip limits the search to that area");
check(scoped.on.length === 1 && scoped.on[0] === "ri", "Legal: chips are multi-select toggles");

// Clearing the keyword returns to the search prompt (no dump).
const cleared = await pg.evaluate(() => { const q = document.querySelector("#dsh-lgl-q"); q.value = ""; q.dispatchEvent(new Event("input")); return document.querySelectorAll(".dsh-lgl-i").length; });
checkEq(cleared, 0, "Legal: clearing the keyword returns to the search prompt");

checkErrs(errs, "dashboard fixed-income + legal");
await ctx.close();
await b.close(); srv.close();
finish();
