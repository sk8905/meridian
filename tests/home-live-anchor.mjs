// Live repaint without the jump (glance.js renderWireLive). A live feed refresh that
// lands new stories ABOVE the row being read must leave that row exactly where it
// was on screen (no shove down the page), wait until the finger is off the glass,
// and show a small "↑ N new stories" pill that scrolls back to the top on tap.
// At the very top of the feed, new stories just appear (no pill).
import { serve, launchChromium, PHONE, check, checkErrs, finish } from "./lib.mjs";

const today = new Date().toISOString().slice(0, 10);
// Distinct headlines (the wire title-dedupes near-identical ones).
const W = ["Apollo", "Blackstone", "Ares", "KKR", "Carlyle", "Oaktree", "Permira", "Bain", "TPG", "EQT", "CVC", "Brookfield", "Sixth", "Golub", "Blue", "HPS", "Owl", "Hayfin", "Arcmont", "Intermediate"];
const V = ["prices", "closes", "launches", "expands", "refinances", "hires", "acquires", "raises", "trims", "files"];
const N = ["loan", "fund", "CLO", "deal", "unit", "notes", "facility", "portfolio", "stake", "vehicle"];
const item = (i, time) => ({ title: `${W[i % 20]} ${V[Math.floor(i / 20) % 10]} ${N[(i * 7) % 10]} number ${i} in ${["Paris", "Dublin", "Madrid", "Oslo", "Rome", "Lisbon"][i % 6]}`, url: `https://example.test/live${i}`, source: "Reuters", date: today, time, desk: "m" });
let items = Array.from({ length: 60 }, (_, i) => item(i, `0${(i % 9) + 1}:00`.slice(-5)));
const srv = await serve({ "/api/feed": () => [200, JSON.stringify({ asOf: new Date().toISOString(), items })] });

const b = await launchChromium();
const ctx = await b.newContext(PHONE);
await ctx.addInitScript(() => {
  let vis = "visible", off = 0;
  const realNow = Date.now.bind(Date);
  Date.now = () => realNow() + off;
  window.__away = () => { off += 5000; };          // jump the clock past LIVE_RESUME_MS
  Object.defineProperty(document, "hidden", { configurable: true, get: () => vis === "hidden" });
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => vis });
  window.__setVis = (v) => { vis = v; document.dispatchEvent(new Event("visibilitychange")); };
});
const pg = await ctx.newPage();
const errs = [];
pg.on("pageerror", (e) => errs.push(String(e.message).slice(0, 160)));
await pg.goto(`http://localhost:${srv.port}/v2/`, { waitUntil: "load" });
await pg.click('.mobile-tabbar .mtab[data-key="news"]');
await pg.waitForFunction(() => document.querySelectorAll("#g-feed a.g-feed-row").length > 30, null, { timeout: 15000 });
await pg.waitForLoadState("networkidle");            // let the desk-data merge settle

// Scroll well into the feed and note the first row under the header.
await pg.waitForFunction(() => { window.scrollTo(0, 1400); return window.scrollY >= 1390; }, null, { timeout: 8000, polling: 200 });
const probe = () => pg.evaluate(() => {
  const head = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--wire-head-h")) || 0;
  const a = [...document.querySelectorAll("#g-feed a.g-feed-row")].find((r) => r.getBoundingClientRect().bottom > head + 1);
  return a ? { href: a.getAttribute("href"), top: a.getBoundingClientRect().top } : null;
});
// Wait until the page has settled (the same row at the same spot on two reads 300ms apart).
await pg.waitForFunction(() => {
  const head = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--wire-head-h")) || 0;
  const a = [...document.querySelectorAll("#g-feed a.g-feed-row")].find((r) => r.getBoundingClientRect().bottom > head + 1);
  const k = a ? a.getAttribute("href") + "@" + a.getBoundingClientRect().top : "";
  const same = k && window.__lastProbe === k; window.__lastProbe = k; return same;
}, null, { timeout: 8000, polling: 300 });
const before = await probe();
check(!!before, `found the row being read (${JSON.stringify(before)})`);

// Three new stories land at the top; a resume triggers the live refresh.
items = [item(901, "23:57"), item(902, "23:58"), item(903, "23:59"), ...items];
await pg.evaluate(() => { window.__setVis("hidden"); window.__away(); window.__setVis("visible"); });
await pg.waitForFunction(() => !!document.querySelector('#g-feed a.g-feed-row[href="https://example.test/live903"]'), null, { timeout: 10000 });
await pg.waitForFunction(() => { const p = document.querySelector(".wire-new-pill"); return p && !p.hidden; }, null, { timeout: 3000 }).catch(() => {});
const after = await pg.evaluate((href) => {
  const a = document.querySelector(`#g-feed a.g-feed-row[href="${href}"]`);
  return a ? a.getBoundingClientRect().top : null;
}, before.href);
check(after !== null && Math.abs(after - before.top) <= 2, `the row being read stayed put (${before.top} → ${after})`);
const pill = () => pg.evaluate(() => { const p = document.querySelector(".wire-new-pill"); return p && !p.hidden ? p.textContent : null; });
check(/3 new stories/.test((await pill()) || ""), `a "3 new stories" pill appears (${await pill()})`);

// Tapping the pill goes back to the top and clears it.
await pg.click(".wire-new-pill");
await pg.waitForFunction(() => window.scrollY < 40, null, { timeout: 5000 });
check((await pill()) === null, "the pill clears once back at the top");

// At the top, another refresh just shows the new story — no pill.
items = [item(904, "23:59"), ...items];
await pg.evaluate(() => { window.__setVis("hidden"); window.__away(); window.__setVis("visible"); });
await pg.waitForFunction(() => !!document.querySelector('#g-feed a.g-feed-row[href="https://example.test/live904"]'), null, { timeout: 10000 });
check((await pill()) === null, "no pill when the reader is already at the top");

checkErrs(errs, "home live anchor");
await ctx.close(); await b.close(); srv.close();
finish();
