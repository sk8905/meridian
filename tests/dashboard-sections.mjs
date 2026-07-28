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
  typeChips: [...document.querySelectorAll(".dsh-lgl-chip[data-type]")].map((c) => c.dataset.type),
  areaChips: document.querySelectorAll(".dsh-lgl-chip[data-area]").length,
  itemsDefault: document.querySelectorAll(".dsh-lgl-i").length,
}));
check(lg.search, "Legal: search box present");
check(lg.typeChips.includes("alert") && lg.typeChips.includes("case"), "Legal: Alerts + Case law type filters present");
checkEq(lg.areaChips, 4, "Legal: four practice-area filter chips");
checkEq(lg.itemsDefault, 0, "Legal: no list until a keyword is entered (search-driven)");

// A keyword surfaces sourced, practice-area-grouped results across ALL LEX types.
const searched = await pg.evaluate(() => {
  const q = document.querySelector("#dsh-lgl-q"); q.value = "director"; q.dispatchEvent(new Event("input"));
  return { items: document.querySelectorAll(".dsh-lgl-i").length, srcs: document.querySelectorAll(".dsh-lgl-t[href^='http']").length, groups: document.querySelectorAll(".dsh-lgl-grp-h").length };
});
check(searched.items > 0, `Legal: keyword search returns results (${searched.items})`);
check(searched.groups >= 1, `Legal: results grouped by practice area (${searched.groups})`);
checkEq(searched.srcs, searched.items, `Legal: every result links its source (${searched.srcs}/${searched.items})`);

// Type filter: limit to Case law → every result is case law (and fewer than all).
const typed = await pg.evaluate(() => {
  const c = [...document.querySelectorAll(".dsh-lgl-chip[data-type]")].find((x) => x.dataset.type === "case"); c && c.click();
  const items = [...document.querySelectorAll(".dsh-lgl-i")];
  return { n: items.length, allCase: items.length > 0 && items.every((i) => i.querySelector(".dsh-lgl-case")) };
});
check(typed.allCase && typed.n < searched.items, `Legal: type filter limits to case law (${typed.n} of ${searched.items})`);

// Add a practice-area chip on top → case law AND that area (single group).
const scoped = await pg.evaluate(() => {
  const c = [...document.querySelectorAll(".dsh-lgl-chip[data-area]")].find((x) => x.dataset.area === "corporate"); c && c.click();
  return { groups: document.querySelectorAll(".dsh-lgl-grp-h").length, onTypes: [...document.querySelectorAll(".dsh-lgl-chip.is-on")].length };
});
checkEq(scoped.groups, 1, "Legal: type + practice-area filters combine to one group");
checkEq(scoped.onTypes, 2, "Legal: type and area chips are independent multi-select toggles");

// Clearing the keyword returns to the search prompt (no dump).
const cleared = await pg.evaluate(() => { const q = document.querySelector("#dsh-lgl-q"); q.value = ""; q.dispatchEvent(new Event("input")); return document.querySelectorAll(".dsh-lgl-i").length; });
checkEq(cleared, 0, "Legal: clearing the keyword returns to the search prompt");

checkErrs(errs, "dashboard fixed-income + legal");
await ctx.close();
await b.close(); srv.close();
finish();
