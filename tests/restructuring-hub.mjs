// Restructuring hub (/v2/restructuring/): every section card renders from Wire's own
// data, lists preview 10 rows + "See all N" (phone and desktop), company names route to
// the borrower page, deals route into Transactions, the hub carries the Deals mode bar
// (ONE horizontally scrolling row on iPhone), every list row is one height, the Hearings card shows
// the Rolls Building cause list (/api/causelist, stubbed from the real-page fixture) with
// the official CaTH link, and the Dashboard stress card links to the hub. No page errors.
import fs from "node:fs";
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

globalThis.caches = { default: { match: async () => null, put: async () => {} } };
const W = await import("../src/index.js");
const list = W.cathParseList(fs.readFileSync(new URL("./fixtures/cath-rolls-list.html", import.meta.url), "utf8"));
const rows = W.cathCompanyRows(list);
// One synthetic rx hearing exercises the "Sanction" tag rendering (the real fixture day had none).
rows.push({ judge: "Mr Justice Test", time: "10:30am", venue: "Court 1", type: "Sanction hearing", caseNo: "CR-2026-000999", caseName: "Spec Plan Co Limited", info: null, list: "Insolvency and Companies Court", rx: "sanction" });
const cause = { source: W.CATH_ROLLS_SUMMARY, lists: [{ date: list.listDate, updated: list.updated, url: "https://www.court-tribunal-hearings.service.gov.uk/business-and-property-division-rolls-building-daily-cause-list?artefactId=x", rows }] };
const srv = await serve({ "/api/causelist": () => [200, JSON.stringify(cause)] });
const base = `http://localhost:${srv.port}`;
const b = await launchChromium();

const SECTIONS = ["rxh-stress", "rxh-plans", "rxh-cases", "rxh-hearings", "rxh-deals", "rxh-stats"];
async function probe(pg) {
  await pg.waitForSelector(".rxh #rxh-stress .rxh-i", { timeout: 15000 });
  await pg.waitForFunction(() => !/Loading the Rolls Building/.test((document.querySelector("#rxh-hearings") || {}).textContent || ""), null, { timeout: 8000 });
  return pg.evaluate((ids) => {
    const vis = (el) => !!el && el.offsetParent !== null && getComputedStyle(el).display !== "none";
    const card = (id) => document.getElementById(id);
    const shown = (id, sel) => [...(card(id) || document).querySelectorAll(sel)].filter(vis).length;
    const coLinks = [...document.querySelectorAll(".rxh a.rxh-co")].map((a) => a.getAttribute("href"));
    const dealLinks = [...document.querySelectorAll("#rxh-deals .dsh-news-i > a")].map((a) => a.getAttribute("href"));
    const chipRow = document.querySelector(".rxh-chips");
    const rows = (id, sel) => [...(card(id) || document).querySelectorAll(sel)].filter(vis).map((e) => Math.round(e.getBoundingClientRect().height));
    return {
      present: ids.filter((id) => card(id)),
      stressShown: shown("rxh-stress", ".rxh-i"), stressMore: ((card("rxh-stress") || {}).querySelector?.(".dsh-seeall") || {}).textContent || "",
      plansShown: shown("rxh-plans", ".rxh-i"), plansMore: !!(card("rxh-plans") || {}).querySelector?.(".dsh-seeall"),
      casesShown: shown("rxh-cases", ".dsh-news-i"), dealsShown: shown("rxh-deals", ".dsh-news-i"),
      coLinks: coLinks.length, coBad: coLinks.filter((h) => !/^\/v2\/profiles\/#\/co\/[^/]+$/.test(h)).slice(0, 3),
      dealBad: dealLinks.filter((h) => !/^\/v2\/transactions\/#\/deal\/./.test(h)).slice(0, 3), deals: dealLinks.length,
      txAll: (document.querySelector("#rxh-deals a.rxh-more") || {}).getAttribute?.("href"),
      hearRows: shown("rxh-hearings", ".rxh-hear .rxh-i"), hearRx: (document.querySelector('#rxh-hearings [data-rx-hearing] .dsh-tag') || {}).textContent || "",
      official: (document.querySelector("#rxh-hearings a.rxh-off") || {}).href || "",
      stats: [...document.querySelectorAll("#rxh-stats .dsh-kv")].map((k) => k.textContent),
      chips: [...document.querySelectorAll(".rxh-chip")].map((c) => c.textContent.trim()),
      chipOneRow: chipRow ? [...chipRow.children].filter(vis).every((c, _, a) => Math.abs(c.getBoundingClientRect().top - a[0].getBoundingClientRect().top) < 2) : false,
      chipScrolls: chipRow ? getComputedStyle(chipRow).overflowX : "",
      chipHrefs: [...document.querySelectorAll(".rxh-chip")].map((c) => c.getAttribute("href")),
      rowH: [...rows("rxh-stress", ".rxh-i"), ...rows("rxh-plans", ".rxh-i"), ...rows("rxh-cases", ".dsh-news-i"), ...rows("rxh-deals", ".dsh-news-i")],
      seeTops: ["rxh-stress", "rxh-plans", "rxh-cases"].map((id) => Math.round(((card(id) || {}).querySelector?.(".dsh-seeall") || { getBoundingClientRect: () => ({ top: -1 }) }).getBoundingClientRect().top)),
      hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };
  }, SECTIONS);
}

for (const [name, dev, phone] of [["phone light", { ...PHONE, colorScheme: "light" }, true], ["phone dark", { ...PHONE, colorScheme: "dark" }, true], ["desktop 1366", { viewport: { width: 1366, height: 900 } }, false], ["desktop 1920", { viewport: { width: 1920, height: 1080 } }, false]]) {
  const { ctx, pg, errs } = await open(b, dev, `${base}/v2/restructuring/`);
  const r = await probe(pg);
  checkEq(r.present.length, SECTIONS.length, `${name}: all six section cards present`);
  check(r.stressShown === 10 && /See all \d+/.test(r.stressMore), `${name}: stress list previews 10 + "${r.stressMore.trim()}" (${r.stressShown})`);
  check(r.plansShown === 10 && r.plansMore, `${name}: plans & schemes preview 10 + See all (${r.plansShown})`);
  check(r.casesShown === 10 && r.dealsShown === 10, `${name}: case law and deals preview 10 rows (${r.casesShown}/${r.dealsShown})`);
  check(r.coLinks > 20 && !r.coBad.length, `${name}: company names link to /v2/profiles/#/co/<name> (${r.coLinks}; bad ${JSON.stringify(r.coBad)})`);
  check(r.deals > 0 && !r.dealBad.length, `${name}: every deal opens its Transactions drawer (${r.deals})`);
  checkEq(r.txAll, "/v2/transactions/#/lending?type=rx&scope=all", `${name}: deals card links to the rx type in Transactions`);
  check(r.hearRows >= 10 && r.hearRx === "Sanction", `${name}: hearings list the cause-list company matters, rx hearing tagged (${r.hearRows}, "${r.hearRx}")`);
  check(r.official.startsWith("https://www.court-tribunal-hearings.service.gov.uk/summary-of-publications"), `${name}: Official cause lists links to CaTH`);
  check(r.stats.some((t) => /UK company insolvencies/.test(t)) && r.stats.some((t) => /EU bankruptcy declarations/.test(t)), `${name}: insolvency statistics (Insolvency Service + Eurostat)`);
  // Owner 2026-10-15: the hub is part of Deals — its chip row is the Deals mode bar
  // (Restructuring lit; every other chip goes to its Deals view), not in-page section chips.
  checkEq(r.chips.join("|"), "Lending|Structured credit|Secondaries|Restructuring|Fundraising|Manager M&A|League tables", `${name}: the Deals mode bar, Restructuring lit`);
  check(r.chipHrefs.filter(Boolean).every((h) => /^\/v2\/transactions\/#\/\w+$/.test(h)) && r.chipHrefs.filter(Boolean).length === 6, `${name}: every other chip opens its Deals view`);
  check(r.chipOneRow, `${name}: the mode bar sits on ONE row`);
  check(!r.hscroll, `${name}: no horizontal page scroll`);
  // Even, aligned cards: every list row is one fixed height.
  check(r.rowH.length >= 40 && new Set(r.rowH).size === 1, `${name}: every list row is the same height (${[...new Set(r.rowH)].join("/")}px)`);
  if (!phone && name === "desktop 1920") check(new Set(r.seeTops).size === 1, `${name}: the See all buttons line up across the first row of cards (${r.seeTops.join("/")})`);
  if (phone) checkEq(r.chipScrolls, "auto", `${name}: chip row scrolls horizontally`);
  // See all → sheet with the whole list.
  await pg.click("#rxh-stress .dsh-seeall"); await pg.waitForTimeout(250);
  const sh = await pg.evaluate(() => { const s = document.querySelector(".dsh-sheet"); return s ? s.querySelectorAll(".rxh-i").length : 0; });
  check(sh > 10, `${name}: See all opens the whole stress list (${sh})`);
  await pg.click(".dsh-sheet-x");
  // A borrower link routes in-app to the Profiles borrower page.
  if (name === "desktop 1366") {
    const href = await pg.$eval("#rxh-plans a.rxh-co", (a) => a.getAttribute("href"));
    await pg.click("#rxh-plans a.rxh-co"); await pg.waitForTimeout(1200);
    const at = await pg.evaluate(() => location.pathname + location.hash);
    check(at === decodeURI(href) || at === href, `borrower link routes in-app (${at})`);
  }
  if (name === "phone light" || name === "desktop 1366") await pg.screenshot({ path: `${process.env.SHOT_DIR || "/tmp"}/rxh-${name.replace(/\s+/g, "-")}.png` }).catch(() => {});
  checkErrs(errs, `restructuring hub ${name}`);
  await ctx.close();
}

// Unavailable cause list → honest empty state + the official link (default /api stub is {}).
{
  const srv2 = await serve();
  const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv2.port}/v2/restructuring/`);
  await pg.waitForSelector("#rxh-hearings .rxh-body", { timeout: 15000 });
  await pg.waitForFunction(() => /unavailable/i.test(document.querySelector("#rxh-hearings").textContent), null, { timeout: 8000 }).catch(() => {});
  const t = await pg.$eval("#rxh-hearings", (e) => e.textContent);
  check(/Cause list unavailable/.test(t), "cause list unavailable → says so, never invents hearings");
  checkErrs(errs, "restructuring hub (no cause list)");
  await ctx.close(); srv2.close();
}

// Dashboard stress card → the hub.
{
  const { ctx, pg, errs } = await open(b, { viewport: { width: 1366, height: 900 } }, `${base}/v2/dashboard/credit`);
  await pg.waitForSelector("a.dsh-rxhub", { timeout: 15000 });
  await pg.click("a.dsh-rxhub"); await pg.waitForSelector(".rxh #rxh-stress", { timeout: 15000 });
  checkEq(await pg.evaluate(() => location.pathname), "/v2/restructuring/", "Dashboard stress card links to the Restructuring hub");
  checkErrs(errs, "dashboard → hub");
  await ctx.close();
}
await b.close(); srv.close();
finish();
