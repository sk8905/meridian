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

// The morning email's HTML body (owner rule 2026-10-20, HOUSE_STYLE R39m): each item
// ends in a short "[link]" — the long source URL sits behind it, never printed.
{
  const h = spawnSync(process.execPath, [path.join(ROOT, "scripts/build-digest.mjs"), "--email=weekly", "--html", "--asof=" + ASOF, "--origin=https://wire.example"], { cwd: ROOT, encoding: "utf8", maxBuffer: 16 << 20 });
  const [subject, ...body] = (h.stdout || "").split("\n");
  const html = body.join("\n");
  check(/^Wire weekly credit digest — /.test(subject), `email --html: line 1 is the subject (${subject})`);
  const links = [...html.matchAll(/<a href="([^"]+)"[^>]*>([^<]*)<\/a>/g)];
  const items = (html.match(/<li /g) || []).length - (html.match(/Nothing new in this window/g) || []).length;
  check(items > 0 && links.filter((m) => m[2] === "[link]").length === items, `email --html: every item ends in a "[link]" (${items} items)`);
  check(links.every((m) => /^https?:\/\//.test(m[1])), "email --html: every [link] points at a real http(s) source");
  const textOnly = html.replace(/<[^>]+>/g, " ");
  check(!/https?:\/\//.test(textOnly), "email --html: no bare URL is printed in the text");
  check(/open the digest/.test(html) && html.includes('href="https://wire.example/v2/menu/digest/weekly"'), "email --html: the In Wire line is a short link to the app digest");
  // Rates & spreads lines carry a short "12 Oct" date (owner 2026-10-22) — not "as of 2026-10-12",
  // which wrapped on a phone.
  const rates = (textOnly.split(/RATES &amp; SPREADS|RATES & SPREADS/)[1] || "").split(/<\/ul>|In Wire|open the digest/)[0];
  // Each change is coloured by what it means (owner 2026-10-22): a rate / yield up green,
  // down red; a credit SPREAD (bp) the other way — widening red, tightening green; nil grey.
  const spans = [...html.matchAll(/ [\d.]+(bp|%) \(<span style="color:(#[0-9a-f]{6})">([^<]*)<\/span>/g)].map((m) => ({ spread: m[1] === "bp", c: m[2], t: m[3] }));
  const want = (x) => { const up = /^\+/.test(x.t), down = /^-/.test(x.t); if (!up && !down) return "#8b96ac"; return (x.spread ? down : up) ? "#0f9d68" : "#df4763"; };
  check(spans.length > 0 && spans.every((x) => x.c === want(x)), `email --html: rates up green / down red; spreads widening red / tightening green; flat grey (${spans.length} lines)`);
  // The tone is stored on each digest item, so the app's Digest page reads the same rule.
  const tone = (x) => (!x.chg ? "flat" : (x.unit === "bp" ? x.chg < 0 : x.chg > 0) ? "good" : "bad");
  const its = D ? [...D.daily.rates.items, ...D.weekly.rates.items] : [];
  check(its.length > 0 && its.every((x) => x.tone === tone(x)), `digest data: every rate item carries its tone (spread widening = bad) (${its.length})`);
  // Order + equities (owner 2026-10-23, R51): Equities, Rates & spreads, then the credit
  // sections in their usual order; equity moves up green / down red.
  const heads = [...html.matchAll(/<p style="margin:18px 0 6px;font-weight:bold;letter-spacing:\.04em">([^<]+)<\/p>/g)].map((m) => m[1].replace(/ \(.*$/, "").replace(/&amp;/g, "&"));
  const ORDER = ["EQUITIES", "RATES & SPREADS", "TOP DEALS BY SIZE", "FUND CLOSES & FUNDRAISING", "RESTRUCTURING & LEGAL", "PEOPLE MOVES"];
  check(JSON.stringify(heads) === JSON.stringify(ORDER), `email --html: sections run Equities, Rates & spreads, then deals / closes / legal / people (${heads.join(" › ")})`);
  const eq = (html.split(/EQUITIES \(/)[1] || "").split(/RATES &amp; SPREADS|RATES & SPREADS/)[0];
  const eqSpans = [...eq.matchAll(/<span style="color:(#[0-9a-f]{6})">([^<]*)<\/span>/g)].map((m) => ({ c: m[1], t: m[2] }));
  check(eqSpans.length >= 6 && eqSpans.every((x) => x.c === (/^\+/.test(x.t) ? "#0f9d68" : /^-/.test(x.t) ? "#df4763" : "#8b96ac")) && /S&amp;P 500|S&P 500/.test(eq) && /FTSE 100/.test(eq), `email --html: Equities lists the major indices, % move coloured up green / down red (${eqSpans.length})`);
  check(rates && !/as of \d{4}-\d{2}-\d{2}/.test(rates) && /\(\s*\S+\s*, \d{1,2} [A-Z][a-z]{2}\)/.test(rates), `email --html: rate dates read "12 Oct", never "as of YYYY-MM-DD" (${(rates.match(/\(\s*\S+\s*, \d{1,2} [A-Z][a-z]{2}\)/) || [""])[0]})`);
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
    order: [...dg.querySelectorAll(".dg-sec")].map((s) => s.dataset.dg),
    rateTone: [...dg.querySelectorAll(".dg-rates tr")].map((tr) => ({ v: tr.querySelector(".dg-r-v").textContent, c: tr.querySelector(".dg-r-c").textContent, cls: tr.querySelector(".dg-r-c").className })),
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
  check(JSON.stringify(s.order) === JSON.stringify(["equities", "rates", "deals", "closes", "legal", "people"]), `${name}: Digest page runs Equities, Rates & spreads, then the credit sections (${s.order.join(",")})`);
  { // Spreads (bp) widening read red (is-down), rates rising green (is-up) — the email's rule.
    const ok = s.rateTone.length > 0 && s.rateTone.every((r) => { const up = /^\+/.test(r.c), dn = /^[−-]/.test(r.c); const want = !up && !dn ? "is-flat" : ((/bp$/.test(r.v) ? dn : up) ? "is-up" : "is-down"); return r.cls.includes(want); });
    check(ok, `${name}: Digest rate colours — spreads widening red, rates rising green (${s.rateTone.length} rows)`);
  }
  checkEq(s.share, "/v2/menu/digest", `${name}: Share link carries the daily URL`);
  check(!s.overflow, `${name}: no horizontal page scroll`);
  await pg.evaluate(() => document.querySelector('#v2-dg-seg [data-dg-mode="weekly"]').click());
  await pg.waitForFunction(() => document.querySelector("#v2-dg")?.dataset.mode === "weekly", null, { timeout: 5000 });
  s = await read(pg);
  checkEq(s.path, "/v2/menu/digest/weekly", `${name}: Weekly moves the shareable URL to /v2/menu/digest/weekly`);
  checkEq(s.items, count("weekly"), `${name}: weekly renders every digest item`);
  check(s.items > 0 && s.allLinked, `${name}: every weekly item links its source (${s.items})`);
  check(s.rateRows === D.weekly.rates.items.length + ((D.weekly.equities || {}).items || []).length && s.rateLinked, `${name}: weekly equity + rate moves render with source links`);
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
