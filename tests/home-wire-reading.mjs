// Home MERGED WIRE — the News lane (desk sub-filters), the All lane (news + manager
// interleaved), and the READING PANE (click-to-read, top-story default, paywall vs
// openly-readable treatment). Desktop terminal only.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

// Stub the reader service: any openly-readable URL returns an extracted body.
const READ = { source: "The Guardian", title: "Oil slips below $100 as Iran signals a Hormuz offer", byline: "Jane Smith", date: "2026-09-22T16:28:00Z", accessible: true, paragraphs: [
  "Brent crude slipped back under $100 a barrel on Tuesday, unwinding part of Monday's spike after reports of an Iran offer over the Strait of Hormuz.",
  "The move came as UK borrowing overshot the OBR's forecast, with gilt yields ticking higher across the curve.",
] };
const srv = await serve({ "/api/read": () => [200, JSON.stringify(READ)] });
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const lane = (pg, name) => pg.evaluate((n) => [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((b) => b.textContent.trim() === n).click(), name);

const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
await pg.evaluate(() => { try { localStorage.removeItem("meridian.follows"); localStorage.removeItem("wire.home.v1"); } catch {} });
await pg.reload({ waitUntil: "load" });
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });

// News lane (default): the coloured news-desk sub-filters, only news rows.
await lane(pg, "News");
await pg.waitForTimeout(200);
const news = await pg.evaluate(() => ({
  subs: [...document.querySelectorAll("#g-feed-head .g-feed-deskchip")].map((c) => c.textContent.trim()),
  mgrRows: document.querySelectorAll("#g-feed .g-mw-fev").length,
  rows: document.querySelectorAll("#g-feed .g-feed-row").length,
}));
check(news.subs.includes("Macro") && news.subs.includes("Credit") && news.subs.includes("Legal"), `News lane: the coloured desk sub-filters show (${news.subs.slice(0, 6).join(" · ")})`);
check(news.rows > 0 && news.mgrRows === 0, "News lane: only news rows (no manager events)");

// All lane: news + manager interleaved, and NO second-level sub-filters.
await lane(pg, "All");
await pg.waitForTimeout(250);
const all = await pg.evaluate(() => ({
  subs: document.querySelectorAll("#g-feed-head .g-feed-deskchip, #g-feed-head .g-feed-chip").length,
  mgrRows: document.querySelectorAll("#g-feed .g-mw-fev").length,
  total: document.querySelectorAll("#g-feed .g-feed-row").length,
}));
check(all.subs === 0, "All lane: no second-level sub-filters");
check(all.mgrRows > 0 && all.total > all.mgrRows, `All lane: news + manager interleaved (${all.mgrRows} manager of ${all.total} rows)`);

// Reading pane: default top story renders in reading mode with a source badge.
const def = await pg.evaluate(() => ({
  title: (document.querySelector("#g-readpane .g-read-title") || {}).textContent.trim(),
  badge: (document.getElementById("g-read-badge") || {}).textContent.trim(),
  open: !!document.querySelector("#g-readpane .g-read-open"),
  kicker: !!document.querySelector("#g-readpane .g-read-kicker"),
}));
check(def.title.length > 0 && def.kicker, "reading pane: the default top story renders (kicker + headline)");
check(def.open, "reading pane: carries an 'Open original at …' link out");

// Paywall treatment: a subscriber source (FT/Bloomberg/WSJ) shows the lock WITHOUT
// fetching; an openly-readable source fetches the reader service and prints the body.
const pay = await pg.evaluate(() => {
  const row = [...document.querySelectorAll("#g-feed .g-feed-row")].find((r) => /financial times|bloomberg|wall street journal/i.test(((r.querySelector(".g-feed-src") || {}).textContent || "")));
  if (!row) return null; row.click();
  const box = document.getElementById("g-readpane");
  return { lock: !!box.querySelector(".g-read-lock"), paras: box.querySelectorAll(".g-read-p").length };
});
if (pay) check(pay.lock && pay.paras === 0, "reading pane: a subscriber source shows the 🔒 preview + link (no body fetched)");
// Openly-readable → the reader service body prints in-pane (paragraphs + byline).
const freeSel = await pg.evaluate(() => {
  const row = [...document.querySelectorAll("#g-feed .g-feed-row")].find((r) => { const s = ((r.querySelector(".g-feed-src") || {}).textContent || "").trim(); return s && !/financial times|bloomberg|wall street journal|economist|new york times/i.test(s); });
  if (!row) return false; row.click(); return true;
});
if (freeSel) {
  await pg.waitForSelector("#g-readpane .g-read-p", { timeout: 4000 });
  const full = await pg.evaluate(() => ({
    paras: document.querySelectorAll("#g-readpane .g-read-p").length,
    byline: !!document.querySelector("#g-readpane .g-read-byline"),
    free: !!document.querySelector("#g-readpane .g-read-free"),
    firstP: (document.querySelector("#g-readpane .g-read-p") || {}).textContent || "",
  }));
  check(full.paras >= 2 && full.byline && full.free, `reading pane: an openly-readable source prints the extracted body in-pane (${full.paras} paragraphs)`);
  check(full.firstP.includes("Brent crude"), "reading pane: the extracted paragraph text renders");
}
check(!!(pay || freeSel), "reading pane: access state resolves from the source");

checkErrs(errs, "merged wire news/all + reading pane");
await ctx.close();
await b.close(); srv.close();
finish();
