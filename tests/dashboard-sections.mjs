// Dashboard sections. Sub-tab order is Credit · Rates · Legal · Equities · Hedge
// Funds (HOUSE_STYLE R37 — Macro + Bonds merged into Rates). Rates shows the
// policy table (ECB · BoE · Fed), the sovereign curves (G7 + Western Europe only)
// and the curve-shape / spreads-to-Bund tile; the ICE BofA spread stack lives on
// Credit only. Legal is a SEARCH interface over all alerts + case law: nothing
// lists until a keyword is entered; practice-area chips limit the search; every
// result is sourced.
import { serve, launchChromium, open, DESKTOP, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/dashboard/rates/");
await pg.waitForTimeout(1600);

const fi = await pg.evaluate(() => {
  const card = (re) => [...document.querySelectorAll(".dsh-mid .dsh-card")].find((c) => { const h = c.querySelector(".dsh-h"); return h && re.test(h.textContent); });
  const sov = card(/sovereign yields — g7/i), shape = card(/curve shape/i), pol = card(/policy rates/i);
  const countries = sov ? [...sov.querySelectorAll("tbody tr td.dsh-nm")].map((t) => t.textContent.trim()) : [];
  return {
    tabs: [...document.querySelectorAll(".dsh-railnav .dsh-navchip[data-sub]")].map((c) => c.dataset.sub),
    sovRows: countries.length, countries,
    noKeys: !!sov && sov.querySelectorAll(".dsh-yc-key").length === 0,
    spreadsHere: !!document.querySelector("#dsh-spreads"),
    shape: !!shape && /2s10s/i.test(shape.textContent) && /BTP–Bund/.test(shape.textContent) && /\d/.test(shape.querySelector("td.dsh-r")?.textContent || ""),
    banks: pol ? [...pol.querySelectorAll("tbody td.dsh-nm")].map((t) => t.textContent.trim()) : [],
  };
});
checkEq(fi.tabs.join(","), "credit,rates,legal,equities,hedge-funds", "Dashboard sub-tab order: Credit · Rates · Legal · Equities · Hedge Funds");
check(fi.sovRows >= 6 && fi.noKeys, `Rates: sovereign term-structure table renders (${fi.sovRows} rows, no colour keys)`);
check(!fi.countries.some((c) => /Brazil|Mexico|China|India|Korea|Australia/.test(c)), `Rates: sovereign table is G7 + Western Europe only (R4c) (${fi.countries.join(", ")})`);
check(fi.countries.includes("Germany") && fi.countries.includes("Italy"), "Rates: sovereign table carries the Bund and BTP rows");
check(!fi.spreadsHere, "Rates: the ICE BofA spread stack is NOT duplicated here (it lives on Credit)");
check(fi.shape, "Rates: Curve-shape tile shows 2s10s and the BTP–Bund 10Y spread derived from the yields");
checkEq(fi.banks.map((x) => x.split(" ")[0]).join(","), "ECB,BoE,Fed", "Rates: policy table lists ECB · BoE · Fed in that order");

// Switch to Legal — a search interface, not a list.
await pg.evaluate(() => { const t = [...document.querySelectorAll(".dsh-railnav .dsh-navchip[data-sub]")].find((c) => c.dataset.sub === "legal"); t && t.click(); });
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

// A keyword surfaces sourced results across ALL LEX types, as ONE flat list ordered
// newest-first — not split into practice-area groups.
const searched = await pg.evaluate(() => {
  const q = document.querySelector("#dsh-lgl-q"); q.value = "director"; q.dispatchEvent(new Event("input"));
  return {
    items: document.querySelectorAll(".dsh-lgl-i").length,
    srcs: document.querySelectorAll(".dsh-lgl-t[href^='http']").length,
    groupHeaders: document.querySelectorAll(".dsh-lgl-grp-h").length,
    lists: document.querySelectorAll(".dsh-lgl-list").length,
    dates: [...document.querySelectorAll(".dsh-lgl-i")].map((el) => el.dataset.date || ""),
  };
});
check(searched.items > 0, `Legal: keyword search returns results (${searched.items})`);
checkEq(searched.groupHeaders, 0, "Legal: results are NOT split into practice-area groups");
checkEq(searched.lists, 1, "Legal: results render as one flat list");
checkEq(searched.srcs, searched.items, `Legal: every result links its source (${searched.srcs}/${searched.items})`);
// ISO dates run newest-first down the whole list (string compare works on YYYY-MM-DD).
check(searched.dates.every((d, i) => i === 0 || searched.dates[i - 1] >= d), "Legal: list is ordered newest-first (recency, not practice area)");

// Topic search still reaches cases that only RELATE to the term (name never says it).
const relates = await pg.evaluate(() => {
  const q = document.querySelector("#dsh-lgl-q"); q.value = "directors' duties"; q.dispatchEvent(new Event("input"));
  return [...document.querySelectorAll(".dsh-lgl-t")].some((el) => /Saxon Woods/i.test(el.textContent));
});
check(relates, "Legal: topic search reaches a related case whose name never says the term (Saxon Woods)");

// Type filter: limit to Case law → every result is case law (and fewer than all).
const typed = await pg.evaluate(() => {
  const c = [...document.querySelectorAll(".dsh-lgl-chip[data-type]")].find((x) => x.dataset.type === "case"); c && c.click();
  const items = [...document.querySelectorAll(".dsh-lgl-i")];
  return { n: items.length, allCase: items.length > 0 && items.every((i) => i.querySelector(".dsh-lgl-case")) };
});
check(typed.allCase && typed.n < searched.items, `Legal: type filter limits to case law (${typed.n} of ${searched.items})`);

// Add a practice-area chip on top → case law AND that area, further narrowing the list.
const scoped = await pg.evaluate(() => {
  const c = [...document.querySelectorAll(".dsh-lgl-chip[data-area]")].find((x) => x.dataset.area === "corporate"); c && c.click();
  return { n: document.querySelectorAll(".dsh-lgl-i").length, onChips: [...document.querySelectorAll(".dsh-lgl-chip.is-on")].length };
});
check(scoped.n > 0 && scoped.n <= typed.n, `Legal: type + practice-area filters combine to narrow the list (${scoped.n} of ${typed.n})`);
checkEq(scoped.onChips, 2, "Legal: type and area chips are independent multi-select toggles");

// Clearing the keyword returns to the search prompt (no dump).
const cleared = await pg.evaluate(() => { const q = document.querySelector("#dsh-lgl-q"); q.value = ""; q.dispatchEvent(new Event("input")); return document.querySelectorAll(".dsh-lgl-i").length; });
checkEq(cleared, 0, "Legal: clearing the keyword returns to the search prompt");

// Hedge Funds sub-tab: sourced consensus + moves lists, and the live per-fund picker.
await pg.evaluate(() => { const t = [...document.querySelectorAll(".dsh-railnav .dsh-navchip[data-sub]")].find((c) => c.dataset.sub === "hedge-funds"); t && t.click(); });
await pg.waitForTimeout(700);
const hf = await pg.evaluate(() => {
  const items = [...document.querySelectorAll(".dsh-hf-i")];
  return {
    lists: items.length,
    sourced: items.length > 0 && items.every((i) => i.querySelector('.dsh-src[href^="http"]')),
    moves: document.querySelectorAll(".dsh-hf-dir").length,
    picker: !!document.querySelector("#dsh-hf-sel") && document.querySelectorAll("#dsh-hf-sel option").length > 10,
  };
});
check(hf.lists > 5, `Hedge Funds: consensus + moves render (${hf.lists})`);
check(hf.sourced, "Hedge Funds: every consensus/move entry links a source");
check(hf.moves >= 1, `Hedge Funds: notable moves tagged buy/sell/new/trim (${hf.moves})`);
check(hf.picker, "Hedge Funds: per-fund 13F picker lists the tracked filers");

checkErrs(errs, "dashboard rates + legal + hedge funds");
await ctx.close();

// PHONE: like every other tab, the Hedge Funds pane shows its own data first and
// its wire ("Notable moves") last.
{
  const p = await open(b, PHONE, base + "/v2/dashboard/hedge-funds/");
  await p.pg.waitForTimeout(1800);
  const ord = await p.pg.evaluate(() => {
    const rail = document.querySelector('.dsh-3z[data-pane="hedge-funds"] .dsh-newsrail');
    const mid = document.querySelector('.dsh-3z[data-pane="hedge-funds"] .dsh-mid');
    return { railTop: rail ? Math.round(rail.getBoundingClientRect().top) : null, midTop: mid ? Math.round(mid.getBoundingClientRect().top) : null };
  });
  check(ord.railTop != null && ord.midTop != null && ord.midTop < ord.railTop, `phone: Hedge Funds data (mid ${ord.midTop}) reads above its Notable-moves wire (${ord.railTop})`);
  checkErrs(p.errs, "dashboard hedge order");
  await p.ctx.close();
}

await b.close(); srv.close();
finish();
