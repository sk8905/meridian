// Home ▸ Strait of Hormuz tile: two separate daily counts — all vessels (n_total)
// and oil tankers (n_tanker) — each vs its own trailing 30-day average (IMF
// PortWatch). Mocks /api/hormuz so the render is deterministic; real data only in
// production.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
// Open a blank page first so the /api/hormuz mock is installed BEFORE Home boots.
const { ctx, pg, errs } = await open(b, DESKTOP, "about:blank");
await pg.route("**/api/hormuz**", (route) => route.fulfill({
  status: 200, contentType: "application/json",
  body: JSON.stringify({ date: "2026-09-18", total: { latest: 120, avg30: 100, days: 30 }, tanker: { latest: 40, avg30: 50, days: 30 }, ts: Date.now() }),
}));
await pg.goto(base + "/v2/", { waitUntil: "load" });
await pg.waitForSelector("#g-hormuz .rate-tile", { timeout: 8000 });

const d = await pg.evaluate(() => {
  const tiles = [...document.querySelectorAll("#g-hormuz .rate-tile")].map((t) => ({
    label: (t.querySelector(".rate-label") || {}).textContent || "",
    val: (t.querySelector(".rate-val") || {}).textContent || "",
    up: !!t.querySelector(".rate-chg.up"),
    down: !!t.querySelector(".rate-chg.down"),
  }));
  return {
    n: tiles.length, tiles,
    header: (document.querySelector("#jump-hormuz .tui-ph") || {}).textContent || "",
    linksOut: [...document.querySelectorAll("#g-hormuz a[href]")].every((a) => /portwatch\.imf\.org/.test(a.getAttribute("href") || "")),
  };
});
const total = d.tiles.find((t) => /Transits/i.test(t.label));
const tanker = d.tiles.find((t) => /Tankers/i.test(t.label));
check(d.n >= 2, `Hormuz tile renders two counts (${d.n})`);
check(total && total.val === "120" && total.up, `all-vessel transits (120) shown, above its 30-day avg`);
check(tanker && tanker.val === "40" && tanker.down, `oil-tanker transits (40) shown as a separate number, below its 30-day avg`);
check(/Strait of Hormuz/i.test(d.header), "panel is titled Strait of Hormuz");
check(d.linksOut, "sources link out to IMF PortWatch");

// A missing tanker series still renders the total (graceful).
await pg.unroute("**/api/hormuz**");
await pg.route("**/api/hormuz**", (route) => route.fulfill({
  status: 200, contentType: "application/json",
  body: JSON.stringify({ date: "2026-09-18", total: { latest: 90, avg30: 110, days: 30 }, tanker: null, ts: Date.now() }),
}));
await pg.evaluate(() => { try { localStorage.removeItem("m_glance_hormuz"); } catch { /* */ } });
await pg.goto(base + "/v2/", { waitUntil: "load" });
await pg.waitForSelector("#g-hormuz .rate-tile", { timeout: 8000 });
const partial = await pg.evaluate(() => {
  const tiles = [...document.querySelectorAll("#g-hormuz .rate-tile")];
  return { n: tiles.length, hasDown: !!document.querySelector("#g-hormuz .rate-chg.down"), hasTanker: tiles.some((t) => /Tankers/i.test((t.querySelector(".rate-label") || {}).textContent || "")) };
});
check(partial.n === 1 && partial.hasDown && !partial.hasTanker, "with no tanker series, only the total renders (below-avg → down arrow)");

checkErrs(errs, "home hormuz tile");
await ctx.close();
await b.close(); srv.close();
finish();
