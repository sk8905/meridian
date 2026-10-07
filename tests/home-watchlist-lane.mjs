// Watchlist lane = EVERY followed profile's activity, regardless of type, with NO
// date limit (only NOTIFICATIONS are time-boxed). A followed manager shows its
// deals/intel/webNews (even older than the Managers-lane recency window); a followed
// hedge fund shows its HEDGE_INTEL; a followed law firm shows its legal alerts. This
// is the guard for "I added X to my watchlist and its stories don't show up".
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);

// m38 (Sona Asset Management) — a manager whose newest record predates the general
// Managers-lane window, so showing it proves the watchlist has NO date limit.
const newest = await pg.evaluate(async () => {
  const m = await import("/home-data.js");
  const ds = [...m.deals, ...m.intel].filter((x) => x.managerId === "m38" && x.date).map((x) => x.date);
  (m.managers.find((x) => x.id === "m38") || { webNews: [] }).webNews?.forEach((w) => w.date && ds.push(w.date));
  return ds.sort().reverse()[0] || "";
});
const now = new Date();
const genWinStart = `${now.getUTCFullYear()}-${String(now.getUTCMonth()).padStart(2, "0")}-01`;
check(newest && newest < genWinStart, `setup: m38's newest record (${newest}) predates the Managers-lane window (${genWinStart}) — a no-limit discriminator`);

async function watchlistRows(key) {
  await pg.evaluate(() => { const el = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane, .tchip-menu-item")].find((b) => /watchlist/i.test(b.textContent)); if (el) el.click(); });
  await pg.waitForTimeout(1000);
  return pg.evaluate((k) => ({
    total: document.querySelectorAll("#g-feed .g-feed-row").length,
    mine: document.querySelectorAll(`#g-feed .g-feed-row[data-mgr="${k}"]`).length,
    empty: !!document.querySelector("#g-feed .g-mw-empty"),
  }), key);
}
async function setFollows(obj) {
  await pg.evaluate((o) => { try { localStorage.setItem("m_signed_in", "1"); localStorage.setItem("meridian.follows", JSON.stringify(o)); } catch {} }, obj);
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
  await pg.waitForTimeout(700);
}

// (1) MANAGER follow — shows its activity with NO date limit.
await setFollows({ manager: ["m38"], fund: [], lp: [], hf: [], firm: [] });
const mgr = await watchlistRows("m38");
check(mgr.mine > 0, `followed MANAGER shows its activity with no date limit (m38 rows: ${mgr.mine}, empty=${mgr.empty})`);

// (2) HEDGE FUND follow — shows its HEDGE_INTEL stream.
await setFollows({ manager: [], fund: [], lp: [], hf: ["h56"], firm: [] });
const hf = await watchlistRows("h56");
check(hf.mine > 0, `followed HEDGE FUND shows its news on the Watchlist lane (h56 rows: ${hf.mine})`);

// (3) LAW FIRM follow — shows its legal alerts.
await setFollows({ manager: [], fund: [], lp: [], hf: [], firm: ["cliffordchance"] });
const firm = await watchlistRows("cliffordchance");
check(firm.mine > 0, `followed LAW FIRM shows its legal alerts on the Watchlist lane (cliffordchance rows: ${firm.mine})`);

// (4) Mixed follow — all three types appear together.
await setFollows({ manager: ["m38"], fund: [], lp: [], hf: ["h56"], firm: ["cliffordchance"] });
const mix = await watchlistRows("m38");
const mixCounts = await pg.evaluate(() => ({
  m: document.querySelectorAll('#g-feed .g-feed-row[data-mgr="m38"]').length,
  h: document.querySelectorAll('#g-feed .g-feed-row[data-mgr="h56"]').length,
  f: document.querySelectorAll('#g-feed .g-feed-row[data-mgr="cliffordchance"]').length,
}));
check(mixCounts.m > 0 && mixCounts.h > 0 && mixCounts.f > 0, `mixed watchlist shows all three types together (manager ${mixCounts.m}, hedge fund ${mixCounts.h}, law firm ${mixCounts.f})`);

checkErrs(errs, "watchlist lane — all follow types, no date limit");
await ctx.close();
await b.close(); srv.close();
finish();
