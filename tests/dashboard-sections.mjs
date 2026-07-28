// Dashboard ▸ Fixed Income + Legal sections. Fixed Income shows the sovereign
// yield curves (government) and the ICE BofA OAS spreads container (corporate).
// Legal is a searchable database of ALL alerts + case law, grouped by practice
// area, every row sourced — with a working search box and area filter.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/dashboard/fixed-income/");
await pg.waitForTimeout(1600);

// Five sub-tabs, Fixed Income active with sovereign curve + corporate spreads.
const fi = await pg.evaluate(() => ({
  tabs: [...document.querySelectorAll(".dsh-nav .tchip[data-sub]")].map((c) => c.dataset.sub),
  yc: !!document.querySelector(".dsh-yc-svg"),
  spreads: !!document.querySelector("#dsh-spreads"),
}));
checkEq(fi.tabs.length, 5, `Dashboard has five sub-tabs (${fi.tabs.join(",")})`);
check(fi.tabs.includes("fixed-income") && fi.tabs.includes("legal"), "Fixed Income and Legal sub-tabs present");
check(fi.yc, "Fixed Income: sovereign yield curve renders (government)");
check(fi.spreads, "Fixed Income: corporate credit-spreads block present");

// Switch to Legal.
await pg.evaluate(() => { const t = [...document.querySelectorAll(".dsh-nav .tchip[data-sub]")].find((c) => c.dataset.sub === "legal"); t && t.click(); });
await pg.waitForTimeout(800);
const lg = await pg.evaluate(() => ({
  search: !!document.querySelector("#dsh-lgl-q"),
  chips: document.querySelectorAll(".dsh-lgl-chip").length,
  items: document.querySelectorAll(".dsh-lgl-i").length,
  groups: document.querySelectorAll(".dsh-lgl-grp-h").length,
  srcs: document.querySelectorAll(".dsh-lgl-t[href^='http']").length,
}));
check(lg.search, "Legal: search box present");
check(lg.chips >= 5, `Legal: practice-area filter chips (All + areas) (${lg.chips})`);
check(lg.items > 100, `Legal: case law + alerts populate the database (${lg.items})`);
check(lg.groups >= 2, `Legal: organised into practice-area groups (${lg.groups})`);
checkEq(lg.srcs, lg.items, `Legal: every row links its source (${lg.srcs}/${lg.items})`);

// Search narrows the list.
const searched = await pg.evaluate(() => { const q = document.querySelector("#dsh-lgl-q"); q.value = "supreme court"; q.dispatchEvent(new Event("input")); return document.querySelectorAll(".dsh-lgl-i").length; });
check(searched > 0 && searched < lg.items, `Legal: search narrows results (${searched} < ${lg.items})`);

// Area filter restricts to a single practice-area group.
const filtered = await pg.evaluate(() => {
  const q = document.querySelector("#dsh-lgl-q"); q.value = ""; q.dispatchEvent(new Event("input"));
  const c = [...document.querySelectorAll(".dsh-lgl-chip")].find((x) => x.dataset.area === "ri"); c && c.click();
  return document.querySelectorAll(".dsh-lgl-grp-h").length;
});
checkEq(filtered, 1, "Legal: practice-area chip filters to one group");

checkErrs(errs, "dashboard fixed-income + legal");
await ctx.close();
await b.close(); srv.close();
finish();
