// Watchlist lane shows a FOLLOWED name's activity even when it is older than the
// general Managers-lane recency window (current + previous month). A deliberate
// follow is a standing interest, so the lane uses a ~12-month window — otherwise a
// manager whose newest record is a few weeks old (e.g. Sona Asset Management, m38,
// whose latest is late August) shows NOTHING in a watchlist opened in October.
// Also: a hedge-fund follow resolves to its same-named covered manager (Sona is
// both m38 and the hedge fund h56), so starring either profile populates the lane.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);

// Sanity: m38's newest activity really is OUTSIDE the general window (so this test
// genuinely exercises the wide watchlist window, not just any coverage).
const newest = await pg.evaluate(async () => {
  const m = await import("/home-data.js");
  const ds = [...m.deals, ...m.intel].filter((x) => x.managerId === "m38" && x.date).map((x) => x.date);
  (m.managers.find((x) => x.id === "m38") || { webNews: [] }).webNews?.forEach((w) => w.date && ds.push(w.date));
  return ds.sort().reverse()[0] || "";
});
const now = new Date();
const genWinStart = `${now.getUTCFullYear()}-${String(now.getUTCMonth()).padStart(2, "0")}-01`; // month index = prev month number
check(newest && newest < genWinStart, `setup: m38's newest record (${newest}) is older than the general window start (${genWinStart}) — a valid discriminator`);

async function watchlistFor(mid) {
  await pg.evaluate(() => { const el = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane, .tchip-menu-item")].find((b) => /watchlist/i.test(b.textContent)); if (el) el.click(); });
  await pg.waitForTimeout(1000);
  return pg.evaluate((m) => ({
    total: document.querySelectorAll("#g-feed .g-feed-row").length,
    mine: document.querySelectorAll(`#g-feed .g-feed-row[data-mgr="${m}"]`).length,
    empty: !!document.querySelector("#g-feed .g-mw-empty"),
  }), mid);
}

// (1) Follow the MANAGER (m38). Its newest activity predates the general window, so
// under the old code the watchlist was empty; the wide window must now show it.
await pg.evaluate(() => { try { localStorage.setItem("m_signed_in", "1"); localStorage.setItem("meridian.follows", JSON.stringify({ manager: ["m38"], fund: [], lp: [], hf: [] })); } catch {} });
await pg.reload({ waitUntil: "load" });
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
await pg.waitForTimeout(600);
const asMgr = await watchlistFor("m38");
check(asMgr.mine > 0, `followed manager's older-than-window activity shows in the Watchlist lane (m38 rows: ${asMgr.mine}, empty=${asMgr.empty})`);

// (2) Follow ONLY the same firm's HEDGE FUND (h56) — no manager follow. It must
// resolve to the same-named manager m38 and still populate the watchlist.
await pg.evaluate(() => { try { localStorage.setItem("meridian.follows", JSON.stringify({ manager: [], fund: [], lp: [], hf: ["h56"] })); } catch {} });
await pg.reload({ waitUntil: "load" });
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
await pg.waitForTimeout(600);
const asHf = await watchlistFor("m38");
check(asHf.mine > 0, `following the same-named hedge fund surfaces its manager on the Watchlist lane (m38 rows: ${asHf.mine})`);

checkErrs(errs, "watchlist lane window + hf resolution");
await ctx.close();
await b.close(); srv.close();
finish();
