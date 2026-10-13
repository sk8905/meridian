// Watchlist lane = EVERY followed profile's activity, regardless of type, with NO
// date limit (only NOTIFICATIONS are time-boxed). A followed manager shows its
// deals/intel/webNews (even older than the Managers-lane recency window); a followed
// hedge fund shows its HEDGE_INTEL; a followed law firm shows its legal alerts. This
// is the guard for "I added X to my watchlist and its stories don't show up".
// It also covers followed FUNDS (records carrying fundId), followed INVESTORS (records
// naming them) and LIVE wire headlines that name any followed entity.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const today = new Date().toISOString().slice(0, 10);
const LIVE = [
  { title: "Bridgewater Associates trims risk as bond volatility jumps", url: "https://www.reuters.com/markets/bridgewater-trims-risk", source: "Reuters", date: today, time: "08:15", desk: "m" },
  { title: "Allianz weighs a bigger private credit allocation", url: "https://www.cnbc.com/allianz-private-credit", source: "CNBC", date: today, time: "07:40", desk: "m" },
  { title: "Story about markets and rates", url: "https://www.reuters.com/markets/other", source: "Reuters", date: today, time: "07:00", desk: "m" },
];
const srv = await serve({ "/api/feed": () => [200, JSON.stringify({ items: LIVE })] });
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

// (5) FUND follow — the deals/intel recorded against that fund (f19, Cheyne ESVC III).
await setFollows({ manager: [], fund: ["f19"], lp: [], hf: [], firm: [] });
const fund = await watchlistRows("__none__");
check(fund.total > 0 && !fund.empty, `followed FUND shows the records against it (rows: ${fund.total})`);

// (6) INVESTOR follow — deal/intel headlines that name it, plus live headlines (Allianz, l14).
await setFollows({ manager: [], fund: [], lp: ["l14"], hf: [], firm: [] });
await watchlistRows("__none__");
const lp = await pg.evaluate(() => [...document.querySelectorAll("#g-feed .g-feed-row .g-feed-title")].map((x) => x.textContent));
check(lp.length > 1 && lp.every((t) => /allianz/i.test(t)), `followed INVESTOR shows only headlines naming it (${lp.length} rows)`);
check(lp.some((t) => /bigger private credit allocation/.test(t)), "…including a LIVE wire headline that names it");

// (7) LIVE wire headlines naming a followed hedge fund (Bridgewater, h1) appear; unrelated ones don't.
await setFollows({ manager: [], fund: [], lp: [], hf: ["h1"], firm: [] });
await watchlistRows("h1");
const live = await pg.evaluate(() => [...document.querySelectorAll("#g-feed .g-feed-row .g-feed-title")].map((x) => x.textContent));
check(live.some((t) => /Bridgewater Associates trims risk/.test(t)), "a LIVE wire headline naming a followed hedge fund appears on the Watchlist");
check(!live.some((t) => /Story about markets and rates/.test(t)), "unrelated live headlines stay off the Watchlist");

checkErrs(errs, "watchlist lane — all follow types, no date limit");
await ctx.close();
await b.close(); srv.close();
finish();
