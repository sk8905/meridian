// Home MERGED WIRE — the News lane (desk sub-filters), the All lane (news + manager
// interleaved), and the READING PANE (click-to-read, top-story default, paywall vs
// openly-readable treatment). Desktop terminal only.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

// Stub the reader service: any openly-readable URL returns an extracted body.
const READ = { source: "The Guardian", title: "Oil slips below $100 as Iran signals a Hormuz offer", byline: "Jane Smith", date: "2026-09-22T16:28:00Z", accessible: true, paragraphs: [
  "Brent crude slipped back under $100 a barrel on Tuesday, unwinding part of Monday's spike after reports of an Iran offer over the Strait of Hormuz.",
  "The move came as UK borrowing overshot the OBR's forecast, with gilt yields ticking higher across the curve.",
], blocks: [
  { t: "The oil move", h: true },
  { t: "Brent crude slipped back under $100 a barrel on Tuesday, unwinding part of Monday's spike after reports of an Iran offer over the Strait of Hormuz.", h: false },
  { t: "The move came as UK borrowing overshot the OBR's forecast, with gilt yields ticking higher across the curve.", h: false },
] };
const srv = await serve({ "/api/read": () => [200, JSON.stringify(READ)] });
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const lane = (pg, name) => pg.evaluate((n) => [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((b) => b.textContent.trim() === n).click(), name);
// Sources the app treats as NOT readable in-pane — either a subscriber paywall
// (glance.js PAYWALL_SRC) or a bot-walled link-out (glance.js LINKOUT_SRC, e.g.
// Reuters). Kept in step with both lists so "free row" picks here match what the
// app actually renders as unlocked.
const WALLED_SRC_PATTERN = "financial times|bloomberg|wall street journal|\\bwsj\\b|economist|new york times|\\bnyt\\b|barron|business insider|the times|telegraph|nikkei|forbes|washington post|the information|seeking alpha|reuters";

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
const rowLocks = await pg.evaluate((walledPattern) => {
  const walled = new RegExp(walledPattern, "i");
  const has = (r) => !!(r && r.querySelector(".g-feed-lock svg"));
  const src = (r) => ((r.querySelector(".g-feed-src") || {}).textContent || "").trim();
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  const paid = rows.find((r) => /financial times|bloomberg|wall street journal|economist|new york times/i.test(src(r)));
  const free = rows.find((r) => { const s = src(r); return s && !walled.test(s); });
  return { paidFound: !!paid, paidLock: has(paid), paidClass: !!(paid && paid.classList.contains("is-locked")), freeFound: !!free, freeLock: has(free) };
}, WALLED_SRC_PATTERN);
if (rowLocks.paidFound) check(rowLocks.paidLock && rowLocks.paidClass, "wire row: a subscriber source carries the outline padlock (.g-feed-lock / .is-locked)");
if (rowLocks.freeFound) check(!rowLocks.freeLock, "wire row: an openly-readable source is not padlocked");

// Openly-readable → the reader service body prints in-pane (paragraphs + byline).
const freeSel = await pg.evaluate((walledPattern) => {
  const walled = new RegExp(walledPattern, "i");
  const row = [...document.querySelectorAll("#g-feed .g-feed-row")].find((r) => { const s = ((r.querySelector(".g-feed-src") || {}).textContent || "").trim(); return s && !walled.test(s); });
  if (!row) return false; row.click(); return true;
}, WALLED_SRC_PATTERN);
if (freeSel) {
  await pg.waitForSelector("#g-readpane .g-read-p", { timeout: 4000 });
  const full = await pg.evaluate(() => {
    const p = document.querySelector("#g-readpane .g-read-p");
    const title = document.querySelector("#g-feed .g-feed-title");
    const cs = p && getComputedStyle(p);
    const h = document.querySelector("#g-readpane .g-read-h");
    return {
      paras: document.querySelectorAll("#g-readpane .g-read-p").length,
      byline: !!document.querySelector("#g-readpane .g-read-byline"),
      free: !!document.querySelector("#g-readpane .g-read-free"),
      firstP: (p || {}).textContent || "",
      align: cs && cs.textAlign,
      letter: cs && parseFloat(cs.letterSpacing),
      readSize: cs && cs.fontSize,
      feedSize: title && getComputedStyle(title).fontSize,
      headText: (h || {}).textContent || "",
      headWeight: h && getComputedStyle(h).fontWeight,
    };
  });
  check(full.paras >= 2 && full.byline && full.free, `reading pane: an openly-readable source prints the extracted body in-pane (${full.paras} paragraphs)`);
  check(full.firstP.includes("Brent crude"), "reading pane: the extracted paragraph text renders");
  // Section headings from `blocks` render in BOLD (.g-read-h) for easier reading.
  check(full.headText === "The oil move" && +full.headWeight >= 700, `reading pane: a section heading renders in bold (.g-read-h "${full.headText}" @ ${full.headWeight})`);
  // The body prose is JUSTIFIED and set at the SAME size as the rest of the app's
  // reading text (the wire feed titles) — not a larger outlier. It's also lightly
  // tracking-compressed so justified prose doesn't open ragged rivers.
  checkEq(full.align, "justify", "reading pane: body text is justified");
  check(full.letter < 0, `reading pane: body text is lightly tracking-compressed for justification (letter-spacing ${full.letter}px)`);
  checkEq(full.readSize, full.feedSize, "reading pane: body font-size matches the wire feed-title size (one app-wide reading size)");
  checkEq(full.readSize, full.feedSize, "reading pane: body font-size matches the wire feed-title size (one app-wide reading size)");
}
check(!!(pay || freeSel), "reading pane: access state resolves from the source");

// The publication NAME is no longer a special external jump: clicking it opens the
// row IN THE READING PANE exactly like the rest of the row (never a new tab), and it
// still does NOT filter the wire by that newsroom.
await lane(pg, "News");
await pg.waitForTimeout(200);
const srcLink = await pg.evaluate(() => {
  window.__opened = null;
  window.open = (u) => { window.__opened = u; return { focus() {} }; };
  // Pick an openly-readable row (not a padlocked/link-out source) so the pane prints a body.
  const walled = /financial times|bloomberg|wall street journal|economist|new york times|reuters/i;
  const row = [...document.querySelectorAll("#g-feed .g-feed-row")].find((r) => {
    const s = ((r.querySelector(".g-feed-src") || {}).textContent || "").trim();
    return s && !walled.test(s) && /^https?:/.test(r.getAttribute("href") || "");
  });
  if (!row) return null;
  const title = (row.querySelector(".g-feed-title") || {}).textContent.replace(/^★\s*/, "").trim();
  row.querySelector(".g-feed-src").click();
  const pane = document.getElementById("g-readpane");
  const paneTitle = ((pane && pane.querySelector(".g-read-title")) || {}).textContent || "";
  return { title, opened: window.__opened, paneTitle: paneTitle.trim(), srcbar: !!document.querySelector(".g-feed-srcbar") };
});
if (srcLink) {
  check(srcLink.opened === null, "wire: clicking the publication name does NOT open a new tab (no external jump)");
  checkEq(srcLink.paneTitle, srcLink.title, "wire: clicking the publication name opens that story in the reading pane");
  check(!srcLink.srcbar, "wire: clicking the publication name does NOT filter the wire by source");
}

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
  // The reader is a FULL-SCREEN modal that covers from the fixed HEADER down (not from
  // the wire tabs): it butts flush against the header's bottom (no seam where the feed or
  // a mis-anchored band could bleed through at the top), with the underlying wire content
  // hidden behind it. This is the iOS "header bug on scroll" fix — the previous anchor
  // (a stale open-time pixel measurement of the tab bar) desynced on every URL-bar
  // show/hide, clipping the search band under the header.
  const seam = await pg2.evaluate(() => {
    const r = document.getElementById("g-reader").getBoundingClientRect();
    const head = document.querySelector(".topbar").getBoundingClientRect();
    return { gap: Math.round(r.top - head.bottom), top: Math.round(r.top), hidden: document.querySelector(".g-main").classList.contains("g-reading") };
  });
  check(seam.gap >= -2 && seam.gap <= 2, `phone: the reader butts flush under the fixed header — no bleed seam (gap ${seam.gap}px)`);
  check(seam.hidden, "phone: the wire content is hidden behind the open reader");
  // While reading, the search band and wire tabs are HIDDEN (display:none), so no sticky
  // layer sits above the reader to rubber-band out of sync on iOS. Hiding them (rather
  // than scroll-locking the document) was the fix for the gap a scroll-lock opened: an
  // overflow:hidden lock broke the band/tabs' sticky positioning and pushed everything
  // down.
  const lock = await pg2.evaluate(() => ({
    cls: document.documentElement.classList.contains("home-reading"),
    bandDisp: getComputedStyle(document.querySelector(".wire-band")).display,
    tabsDisp: getComputedStyle(document.querySelector(".g-wiretabs")).display,
  }));
  check(lock.cls && lock.bandDisp === "none" && lock.tabsDisp === "none", `phone: reading hides the search band + wire tabs so no sticky layer can desync (html.home-reading, band ${lock.bandDisp}, tabs ${lock.tabsDisp})`);
  // A pull-down at the top of the reader must NOT rubber-band the page behind it (that
  // dragged the wire tabs into view through the top seam) — the scroll body contains it.
  const oc = await pg2.evaluate(() => getComputedStyle(document.getElementById("g-reader-body")).overscrollBehaviorY);
  check(oc === "contain" || oc === "none", `phone: the reader body contains overscroll so a pull-down can't drag the page behind it (${oc})`);
  // Tapping a wire tab closes the reader and switches pane.
  await pg2.evaluate(() => document.querySelector('.g-wiretab[data-wire="chart"]').click());
  await pg2.waitForTimeout(150);
  check(await pg2.evaluate(() => document.getElementById("g-reader").hidden), "phone: switching wire tabs closes the reader");
  check(await pg2.evaluate(() => !document.documentElement.classList.contains("home-reading") && getComputedStyle(document.querySelector(".g-wiretabs")).display !== "none"), "phone: closing the reader restores the search band + wire tabs");
  // Re-open, then Back closes the reader, returning to the wire.
  await pg2.evaluate(() => document.querySelector('.g-wiretab[data-wire="news"]').click());
  await pg2.waitForTimeout(150);
  await pg2.evaluate(() => { const row = [...document.querySelectorAll("#g-feed .g-feed-row")].find((r) => r.getAttribute("target") === "_blank" && !r.classList.contains("is-locked")); if (row) row.click(); });
  await pg2.waitForSelector("#g-reader:not([hidden])", { timeout: 4000 });
  await pg2.evaluate(() => document.getElementById("g-reader-back").click());
  await pg2.waitForTimeout(150);
  check(await pg2.evaluate(() => document.getElementById("g-reader").hidden), "phone: Back closes the reader");
  // Re-open, then an iOS-style LEFT-EDGE swipe → back also closes it.
  await pg2.evaluate(() => { const row = [...document.querySelectorAll("#g-feed .g-feed-row")].find((r) => r.getAttribute("target") === "_blank" && !r.classList.contains("is-locked")); if (row) row.click(); });
  await pg2.waitForSelector("#g-reader:not([hidden])", { timeout: 4000 });
  const swiped = await pg2.evaluate(() => {
    const ov = document.getElementById("g-reader");
    const mk = (type, x, y) => { const t = new Touch({ identifier: 1, target: ov, clientX: x, clientY: y }); return new TouchEvent(type, { touches: [t], targetTouches: [t], changedTouches: [t], bubbles: true, cancelable: true }); };
    ov.dispatchEvent(mk("touchstart", 8, 400));      // start AT the left edge
    ov.dispatchEvent(mk("touchmove", 90, 405));      // drag right, staying horizontal
    return true;
  });
  await pg2.waitForTimeout(120);
  check(swiped && await pg2.evaluate(() => document.getElementById("g-reader").hidden), "phone: a left-edge swipe-right closes the reader (iOS-style back)");
  // A mid-content horizontal drag (NOT from the edge) must NOT close it — only the edge.
  await pg2.evaluate(() => { const row = [...document.querySelectorAll("#g-feed .g-feed-row")].find((r) => r.getAttribute("target") === "_blank" && !r.classList.contains("is-locked")); if (row) row.click(); });
  await pg2.waitForSelector("#g-reader:not([hidden])", { timeout: 4000 });
  await pg2.evaluate(() => {
    const ov = document.getElementById("g-reader");
    const mk = (type, x, y) => { const t = new Touch({ identifier: 2, target: ov, clientX: x, clientY: y }); return new TouchEvent(type, { touches: [t], targetTouches: [t], changedTouches: [t], bubbles: true, cancelable: true }); };
    ov.dispatchEvent(mk("touchstart", 180, 400));    // starts mid-pane, not the edge
    ov.dispatchEvent(mk("touchmove", 280, 405));
  });
  await pg2.waitForTimeout(120);
  check(await pg2.evaluate(() => !document.getElementById("g-reader").hidden), "phone: a mid-content swipe does NOT close the reader (edge-only)");
  await pg2.evaluate(() => document.getElementById("g-reader-back").click());
  await pg2.waitForTimeout(120);
  // A SUBSCRIBER-padlocked row (needs a login) does NOT open the in-app reader — it opens
  // at the source. NB: .is-locked also covers bot-walled link-outs (Reuters), which DO
  // open the reader now, so pick a row whose mark says "needs a login" specifically.
  const locked = await pg2.evaluate(() => {
    const row = [...document.querySelectorAll("#g-feed .g-feed-row.is-locked")].find((r) => /needs a login/i.test((r.querySelector(".g-feed-lock") || {}).title || ""));
    if (!row) return { found: false };
    row.click();
    return { found: true, readerOpen: !document.getElementById("g-reader").hidden };
  });
  if (locked.found) check(!locked.readerOpen, "phone: a padlocked subscriber row does not open the in-app reader (opens at the publisher)");
  await pg2.evaluate(() => { const ov = document.getElementById("g-reader"); if (ov && !ov.hidden) document.getElementById("g-reader-back").click(); });
  await pg2.waitForTimeout(120);
  // A bot-walled LINK-OUT row (Reuters) DOES open the in-app reader now — showing the
  // headline + an "open original" link in-pane, rather than bouncing straight out.
  const reut = await pg2.evaluate(() => {
    const row = [...document.querySelectorAll("#g-feed .g-feed-row.is-locked")].find((r) => /reuters/i.test(((r.querySelector(".g-feed-src") || {}).textContent) || ""));
    if (!row) return { found: false };
    row.click();
    const body = document.getElementById("g-reader-body");
    return { found: true, readerOpen: !document.getElementById("g-reader").hidden, hasOpen: !!(body && body.querySelector(".g-read-open, .g-read-ext")) };
  });
  if (reut.found) check(reut.readerOpen && reut.hasOpen, "phone: a bot-walled Reuters row opens the in-app reader with an 'open original' link (not a bare external jump)");
  await ctx2.close();
}

await b.close(); srv.close();
finish();
