// Home ▸ Strait of Hormuz tile: the latest day's vessel transits vs the trailing
// 30-day average (IMF PortWatch). Mocks /api/hormuz so the render is deterministic
// and asserts the above/below-average comparison. Real data only in production —
// this just proves the tile renders what the feed returns.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
// Open a blank page first so the /api/hormuz mock is installed BEFORE Home boots.
const { ctx, pg, errs } = await open(b, DESKTOP, "about:blank");
await pg.route("**/api/hormuz**", (route) => route.fulfill({
  status: 200, contentType: "application/json",
  body: JSON.stringify({ latest: 120, date: "2026-09-18", avg30: 100, days: 30, ts: Date.now() }),
}));
await pg.goto(base + "/v2/", { waitUntil: "load" });
await pg.waitForSelector("#g-hormuz .rate-tile", { timeout: 8000 });

const d = await pg.evaluate(() => {
  const tiles = [...document.querySelectorAll("#g-hormuz .rate-tile")];
  const t0 = tiles[0];
  return {
    n: tiles.length,
    label0: (t0.querySelector(".rate-label") || {}).textContent || "",
    val0: (t0.querySelector(".rate-val") || {}).textContent || "",
    dirUp: !!t0.querySelector(".rate-chg.up"),
    avgTile: tiles.some((t) => /30d avg/i.test((t.querySelector(".rate-label") || {}).textContent || "") && /100/.test((t.querySelector(".rate-val") || {}).textContent || "")),
    header: (document.querySelector("#jump-hormuz .tui-ph") || {}).textContent || "",
    linksOut: [...document.querySelectorAll("#g-hormuz a[href]")].every((a) => /portwatch\.imf\.org/.test(a.getAttribute("href") || "")),
  };
});
check(d.n >= 2, `Hormuz tile renders transits + average (${d.n} tiles)`);
check(/Transits/i.test(d.label0) && d.val0 === "120", `shows the latest transit count (${d.val0})`);
check(d.dirUp, "marks the count as ABOVE the 30-day average (up arrow)");
check(d.avgTile, "shows the 30-day average benchmark (100)");
check(/Strait of Hormuz/i.test(d.header), "panel is titled Strait of Hormuz");
check(d.linksOut, "sources link out to IMF PortWatch");

// Below-average case → down arrow.
await pg.unroute("**/api/hormuz**");
await pg.route("**/api/hormuz**", (route) => route.fulfill({
  status: 200, contentType: "application/json",
  body: JSON.stringify({ latest: 80, date: "2026-09-18", avg30: 100, days: 30, ts: Date.now() }),
}));
await pg.evaluate(() => { try { localStorage.removeItem("m_glance_hormuz"); } catch { /* */ } });
await pg.goto(base + "/v2/", { waitUntil: "load" });
await pg.waitForSelector("#g-hormuz .rate-tile", { timeout: 8000 });
const below = await pg.evaluate(() => !!document.querySelector("#g-hormuz .rate-tile .rate-chg.down"));
check(below, "a count below the 30-day average shows a down arrow");

checkErrs(errs, "home hormuz tile");
await ctx.close();
await b.close(); srv.close();
finish();
