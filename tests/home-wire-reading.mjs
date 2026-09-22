// Home MERGED WIRE — the News lane (desk sub-filters), the All lane (news + manager
// interleaved), and the READING PANE (click-to-read, top-story default, paywall vs
// openly-readable treatment). Desktop terminal only.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
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

// Paywall treatment: a subscriber source (FT/Bloomberg/WSJ) shows the lock; an openly
// readable source shows the reading-mode badge. Find one of each in the wire.
const access = await pg.evaluate(() => {
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  const srcOf = (r) => ((r.querySelector(".g-feed-src") || {}).textContent || "").trim();
  const pay = rows.find((r) => /financial times|bloomberg|wall street journal/i.test(srcOf(r)));
  const free = rows.find((r) => srcOf(r) && !/financial times|bloomberg|wall street journal|economist|new york times/i.test(srcOf(r)));
  const readOf = (r) => { r.click(); const box = document.getElementById("g-readpane"); return { lock: !!box.querySelector(".g-read-lock"), free: !!box.querySelector(".g-read-free") }; };
  return { pay: pay ? readOf(pay) : null, free: free ? readOf(free) : null };
});
if (access.pay) check(access.pay.lock && !access.pay.free, "reading pane: a subscriber source shows the 🔒 preview + link treatment");
if (access.free) check(access.free.free && !access.free.lock, "reading pane: an openly-readable source shows the reading-mode badge");
check(!!(access.pay || access.free), "reading pane: access state resolves from the source");

checkErrs(errs, "merged wire news/all + reading pane");
await ctx.close();
await b.close(); srv.close();
finish();
