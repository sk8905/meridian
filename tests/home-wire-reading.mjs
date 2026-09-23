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

// News lane (default): only news rows, and NO sub-filter row (the desk chips were
// removed — the lane tabs are the only control now).
await lane(pg, "News");
await pg.waitForTimeout(200);
const news = await pg.evaluate(() => ({
  subs: document.querySelectorAll("#g-wire-subs .g-feed-deskchip, #g-feed-head .g-feed-deskchip").length,
  mgrRows: document.querySelectorAll("#g-feed .g-mw-fev").length,
  rows: document.querySelectorAll("#g-feed .g-feed-row").length,
}));
check(news.subs === 0, "News lane: no desk sub-filter row (removed)");
check(news.rows > 0 && news.mgrRows === 0, "News lane: only news rows (no manager events)");

// All lane: news + manager interleaved, and still no sub-filters.
await lane(pg, "All");
await pg.waitForTimeout(250);
const all = await pg.evaluate(() => ({
  subs: document.querySelectorAll("#g-wire-subs .g-feed-deskchip, #g-wire-subs .g-feed-chip, #g-feed-head .g-feed-deskchip, #g-feed-head .g-feed-chip").length,
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

// Row-level lock: a subscriber source carries an outline padlock right in the wire
// (a glance-level "needs a login") — an openly-readable source does not.
const rowLocks = await pg.evaluate(() => {
  const has = (r) => !!(r && r.querySelector(".g-feed-lock svg"));
  const src = (r) => ((r.querySelector(".g-feed-src") || {}).textContent || "").trim();
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  const paid = rows.find((r) => /financial times|bloomberg|wall street journal|economist|new york times/i.test(src(r)));
  const free = rows.find((r) => { const s = src(r); return s && !/financial times|bloomberg|wall street journal|economist|new york times|nikkei|forbes|telegraph|the times|washington post|barron|business insider/i.test(s); });
  return { paidFound: !!paid, paidLock: has(paid), paidClass: !!(paid && paid.classList.contains("is-locked")), freeFound: !!free, freeLock: has(free) };
});
if (rowLocks.paidFound) check(rowLocks.paidLock && rowLocks.paidClass, "wire row: a subscriber source carries the outline padlock (.g-feed-lock / .is-locked)");
if (rowLocks.freeFound) check(!rowLocks.freeLock, "wire row: an openly-readable source is not padlocked");

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

// --- Phone: openly-readable rows open the in-app terminal reader; padlocked
//     (subscriber) rows keep their native "open at the publisher" tap. ----------
{
  const { PHONE } = await import("./lib.mjs");
  const ctx2 = await b.newContext({ ...PHONE });
  const pg2 = await ctx2.newPage();
  pg2.on("popup", (p) => p.close().catch(() => {}));   // swallow any external-link popup
  await pg2.goto(base + "/v2/", { waitUntil: "load" });
  await pg2.evaluate(() => { try { localStorage.setItem("wire.home.v1", JSON.stringify({ wire: "news" })); } catch {} });
  await pg2.reload({ waitUntil: "load" });
  await pg2.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
  await pg2.waitForTimeout(300);
  // Desktop side pane is hidden on phones; the reader overlay exists but is hidden.
  check(await pg2.evaluate(() => { const o = document.getElementById("g-reader"); return !!o && o.hidden; }), "phone: the reader overlay starts hidden");
  // Tap an openly-readable (not padlocked) external row → the in-app reader opens.
  const tapped = await pg2.evaluate(() => {
    const row = [...document.querySelectorAll("#g-feed .g-feed-row")].find((r) => r.getAttribute("target") === "_blank" && !r.classList.contains("is-locked"));
    if (!row) return false; row.click(); return true;
  });
  check(tapped, "phone: found an openly-readable wire row to tap");
  await pg2.waitForSelector("#g-reader:not([hidden]) #g-reader-body .g-read-p", { timeout: 5000 });
  const rd = await pg2.evaluate(() => ({
    open: !document.getElementById("g-reader").hidden,
    paras: document.querySelectorAll("#g-reader-body .g-read-p").length,
    title: (document.querySelector("#g-reader-body .g-read-title") || {}).textContent || "",
    openLink: !!document.querySelector("#g-reader-body .g-read-open"),
  }));
  check(rd.open && rd.paras >= 2 && rd.title.length > 0, `phone: an openly-readable row opens the in-app reader with the body (${rd.paras} paragraphs)`);
  check(rd.openLink, "phone: the in-app reader still offers an 'Open original' link");
  // The reader sits in the workspace BELOW the wire tabs (not full-screen), flush
  // against the tab bar's bottom (no seam where the feed could bleed through), with
  // the underlying wire content hidden behind it.
  const seam = await pg2.evaluate(() => {
    const r = document.getElementById("g-reader").getBoundingClientRect();
    const tabs = document.querySelector(".g-wiretabs").getBoundingClientRect();
    return { gap: Math.round(r.top - tabs.bottom), hidden: document.querySelector(".g-main").classList.contains("g-reading") };
  });
  check(seam.gap >= 0 && seam.gap <= 2, `phone: the reader butts flush under the wire tabs — no bleed seam (gap ${seam.gap}px)`);
  check(seam.hidden, "phone: the wire content is hidden behind the open reader");
  // Tapping a wire tab closes the reader and switches pane.
  await pg2.evaluate(() => document.querySelector('.g-wiretab[data-wire="chart"]').click());
  await pg2.waitForTimeout(150);
  check(await pg2.evaluate(() => document.getElementById("g-reader").hidden), "phone: switching wire tabs closes the reader");
  // Re-open, then Back closes the reader, returning to the wire.
  await pg2.evaluate(() => document.querySelector('.g-wiretab[data-wire="news"]').click());
  await pg2.waitForTimeout(150);
  await pg2.evaluate(() => { const row = [...document.querySelectorAll("#g-feed .g-feed-row")].find((r) => r.getAttribute("target") === "_blank" && !r.classList.contains("is-locked")); if (row) row.click(); });
  await pg2.waitForSelector("#g-reader:not([hidden])", { timeout: 4000 });
  await pg2.evaluate(() => document.getElementById("g-reader-back").click());
  await pg2.waitForTimeout(150);
  check(await pg2.evaluate(() => document.getElementById("g-reader").hidden), "phone: Back closes the reader");
  // A padlocked (subscriber) row does NOT open the in-app reader — it opens at the source.
  const locked = await pg2.evaluate(() => {
    const row = document.querySelector("#g-feed .g-feed-row.is-locked");
    if (!row) return { found: false };
    row.click();
    return { found: true, readerOpen: !document.getElementById("g-reader").hidden };
  });
  if (locked.found) check(!locked.readerOpen, "phone: a padlocked subscriber row does not open the in-app reader (opens at the publisher)");
  await ctx2.close();
}

await b.close(); srv.close();
finish();
