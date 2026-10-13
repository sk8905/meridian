// When a live refetch of /api/rates or /api/markets FAILS, Home keeps the last-good
// tiles on screen (R17) — and must now SAY they are cached, visibly (the as-of
// tooltip never shows on a phone), so stale prices never read as live. A healthy
// fetch shows no such label.
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const RATES = { rates: [{ label: "US 10Y", value: 4.1, unit: "%", change: 0.01, href: "https://example.com/ust10" },
  { label: "SONIA", value: 3.7, unit: "%", change: 0, href: "https://example.com/sonia" }] };
const MARKETS = { markets: [{ label: "S&P 500", value: 7000, changePct: 0.1 }] };
let fail = false;
const srv = await serve({
  "/api/rates": () => (fail ? [500, "{}"] : [200, JSON.stringify(RATES)]),
  "/api/markets": () => (fail ? [500, "{}"] : [200, JSON.stringify(MARKETS)]),
  "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })],
});
const b = await launchChromium();
const url = `http://localhost:${srv.port}/v2/`;

// 1) healthy: tiles render and are cached; no stale label
const { ctx, pg, errs } = await open(b, PHONE, url);
await pg.waitForSelector("#g-rates .rate-tile", { state: "attached", timeout: 8000 });
await pg.waitForTimeout(300);
check(!(await pg.$("#g-rates .g-stale")), "a successful rates fetch shows no stale label");
check(await pg.evaluate(() => !!localStorage.getItem("m_glance_rates_t")), "the last-good cache records when it was written");

// 2) upstream down on the next load: cached tiles stay AND are labelled as cached
fail = true;
await pg.reload({ waitUntil: "load" });
await pg.waitForSelector("#g-rates .g-stale", { state: "attached", timeout: 8000 });
const r = await pg.evaluate(() => ({ tiles: document.querySelectorAll("#g-rates .rate-tile").length, txt: (document.querySelector("#g-rates .g-stale") || {}).textContent || "" }));
check(r.tiles > 0, `cached rate tiles stay on screen when the refetch fails (${r.tiles})`);
check(/cached values/i.test(r.txt) && /from /.test(r.txt), `a visible label says the values are cached and when from ("${r.txt}")`);
checkErrs(errs, "stale label");
await ctx.close(); await b.close(); srv.close();
finish();
