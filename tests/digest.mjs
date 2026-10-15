// Menu ▸ Digest (v2/js/digest.js over /digest.js, built by scripts/build-digest.mjs).
// The digest renders Daily and Weekly, every item links its real source, the
// Daily / Weekly toggle moves the shareable URL (/v2/menu/digest ⇄ /digest/weekly),
// and a shared weekly link opens straight on Weekly. The page is served the digest
// the SCRIPT builds for a fixed as-of day, so this also covers the builder's contract
// (windows, sources, no item without a URL).
import { serve, launchChromium, PHONE, DESKTOP, check, checkEq, finish, ROOT } from "./lib.mjs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const ASOF = "2026-10-15";
const r = spawnSync(process.execPath, [path.join(ROOT, "scripts/build-digest.mjs"), "--dry-run", "--asof=" + ASOF], { cwd: ROOT, encoding: "utf8", maxBuffer: 16 << 20 });
let D = null;
try { D = JSON.parse(r.stdout); } catch { /* reported below */ }
check(!!D, "build-digest --dry-run emits the digest JSON");
const SECS = ["deals", "closes", "legal", "people"];
if (D) {
  checkEq(D.asOf, ASOF, "the digest is anchored on the requested as-of day");
  checkEq(D.daily.from, "2026-10-14", "daily = the as-of day and the day before");
  checkEq(D.weekly.from, "2026-10-09", "weekly = the 7 days ending on the as-of day");
  for (const w of ["daily", "weekly"]) {
    const items = SECS.flatMap((k) => D[w][k].items);
    check(items.every((x) => /^https?:\/\//.test(x.url) && x.date && x.date >= D[w].from && x.date <= D[w].to), `${w}: every item has a source URL and a date inside its window`);
    check(D[w].rates.items.every((x) => /^https?:\/\//.test(x.url)), `${w}: every rate move links its source`);
    const sized = D[w].deals.items.filter((x) => x.amount);
    check(sized.every((x) => x.title.includes(x.amount)), `${w}: a deal's amount is the figure its own headline states`);
  }
  check(SECS.some((k) => D.weekly[k].items.length > 0), "weekly: the committed data yields at least one item to show");
}

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const body = "export const DIGEST = " + JSON.stringify(D) + ";";

async function page(dev, url) {
  const ctx = await b.newContext(dev); const pg = await ctx.newPage(); const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e.message).slice(0, 160)));
  await pg.route("**/digest.js", (q) => (new URL(q.request().url()).pathname === "/digest.js"
    ? q.fulfill({ status: 200, contentType: "application/javascript", body }) : q.continue()));
  await pg.goto(base + url, { waitUntil: "load" });
  await pg.waitForSelector("#v2-dg", { timeout: 10000 });
  return { ctx, pg, errs };
}
const read = (pg) => pg.evaluate(() => {
  const dg = document.querySelector("#v2-dg");
  const links = [...dg.querySelectorAll(".dg-item a.dg-t")];
  return {
    mode: dg.dataset.mode, path: location.pathname,
    chip: (document.querySelector(".na-menu-bar .tchip.is-on") || {}).dataset?.sec,
    secs: [...dg.querySelectorAll(".dg-sec")].map((s) => s.dataset.dg),
    items: links.length,
    allLinked: links.every((a) => /^https?:\/\//.test(a.getAttribute("href") || "") && a.target === "_blank"),
    rateRows: dg.querySelectorAll(".dg-rates tr").length,
    rateLinked: [...dg.querySelectorAll(".dg-rates a")].every((a) => /^https?:\/\//.test(a.getAttribute("href") || "")),
    share: (document.querySelector("#v2-dg-share") || {}).dataset?.path,
    on: (document.querySelector("#v2-dg-seg .is-on") || {}).dataset?.dgMode,
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
  };
});
const count = (w) => SECS.reduce((n, k) => n + D[w][k].items.length, 0);

for (const [dev, name] of [[PHONE, "phone"], [DESKTOP, "desktop"]]) {
  const { ctx, pg, errs } = await page(dev, "/v2/menu/digest");
  let s = await read(pg);
  checkEq(s.chip, "digest", `${name}: /v2/menu/digest opens the Digest chip`);
  checkEq(s.mode, "daily", `${name}: the plain link opens the Daily digest`);
  checkEq(s.on, "daily", `${name}: the Daily option is selected`);
  check(["deals", "closes", "legal", "people"].every((k) => s.secs.includes(k)), `${name}: daily shows deals / closes / legal / people sections (${s.secs.join(",")})`);
  checkEq(s.items, count("daily"), `${name}: daily renders every digest item`);
  check(s.allLinked, `${name}: every daily item links its source`);
  check(s.rateLinked, `${name}: every daily rate row links its source`);
  checkEq(s.share, "/v2/menu/digest", `${name}: Share link carries the daily URL`);
  check(!s.overflow, `${name}: no horizontal page scroll`);
  await pg.evaluate(() => document.querySelector('#v2-dg-seg [data-dg-mode="weekly"]').click());
  await pg.waitForFunction(() => document.querySelector("#v2-dg")?.dataset.mode === "weekly", null, { timeout: 5000 });
  s = await read(pg);
  checkEq(s.path, "/v2/menu/digest/weekly", `${name}: Weekly moves the shareable URL to /v2/menu/digest/weekly`);
  checkEq(s.items, count("weekly"), `${name}: weekly renders every digest item`);
  check(s.items > 0 && s.allLinked, `${name}: every weekly item links its source (${s.items})`);
  check(s.rateRows === D.weekly.rates.items.length && s.rateLinked, `${name}: weekly rate moves render with source links`);
  checkEq(s.share, "/v2/menu/digest/weekly", `${name}: Share link carries the weekly URL`);
  check(errs.length === 0, `${name}: no page errors (${errs.join(" | ")})`);
  await ctx.close();
}
// A shared weekly link opens straight on Weekly.
{
  const { ctx, pg } = await page(PHONE, "/v2/menu/digest/weekly");
  const s = await read(pg);
  check(s.chip === "digest" && s.mode === "weekly", `a shared /v2/menu/digest/weekly link opens the Weekly digest (${s.chip}/${s.mode})`);
  await ctx.close();
}

await b.close(); srv.close();
finish();
