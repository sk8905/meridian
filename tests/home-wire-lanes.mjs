// Desktop merged wire: the top-level lane tabs are the ONLY control — All · News ·
// Manager · Watchlist · Newsletters. The desk/category sub-filter rows were removed, so
// there is no #g-wire-subs slot and no #g-feed-head band; every row keeps its own colour
// label. The Newsletters lane shows the (padlocked) newsletter items. The reading pane
// still defaults to the most-recent UNLOCKED story and a subscriber story shows just the
// padlock. Runs on the app's real bundled wire content.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.evaluate(() => { try { localStorage.removeItem("wire.home.v1"); } catch {} });
await pg.reload({ waitUntil: "load" });
await pg.waitForSelector("#g-wire-lanes .g-wire-lane", { timeout: 8000 });
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
await pg.waitForTimeout(500);

// ---- Reading pane auto-opens the most-recent story ON LOAD (R3a) --------------
// (The .is-reading row highlight is transient — a later re-render rebuilds the feed and
// drops it — but the opened story persists in the pane, which is what proves auto-open.)
const auto = await pg.evaluate(() => ({
  title: ((document.querySelector("#g-readpane .g-read-title") || {}).textContent || "").trim().length > 0,
  open: !!document.querySelector("#g-readpane .g-read-open, #g-readpane .g-read-lock"),
}));
check(auto.title && auto.open, `desktop: the most-recent story auto-opens the reading pane on page load (title=${auto.title})`);

// ---- Lane tabs are the only control; no sub-filter rows ----------------------
const lanes = await pg.evaluate(() => ({
  tabs: [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].map((b) => b.textContent.trim()),
  hasSubsSlot: !!document.getElementById("g-wire-subs"),
  headVisible: (() => { const h = document.getElementById("g-feed-head"); return !!h && getComputedStyle(h).display !== "none" && h.getBoundingClientRect().height > 1; })(),
  deskChips: document.querySelectorAll("#g-wire-lanes .g-feed-deskchip, #g-wire-lanes .g-feed-grpbtn, #g-wire-lanes [data-mglcat], #g-feed-head .g-feed-deskchip, #g-feed-head .g-feed-grpbtn, #g-feed-head [data-mglcat]").length,
}));
check(lanes.tabs.join(" · ") === "All · News · Manager · Watchlist · Newsletters", `lane tabs are All · News · Manager · Watchlist · Newsletters (${lanes.tabs.join(" · ")})`);
check(!lanes.hasSubsSlot, "no inline sub-filter slot (#g-wire-subs) exists");
check(!lanes.headVisible, "the #g-feed-head sub-filter band takes no space");
check(lanes.deskChips === 0, `no desk / category / group sub-filter chips anywhere (${lanes.deskChips})`);

// ---- News rows keep their per-item colour label ------------------------------
const labelled = await pg.evaluate(() => {
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")].slice(0, 20);
  return rows.filter((r) => r.querySelector(".g-feed-code")).length;
});
check(labelled >= 10, `news rows keep their own colour label (${labelled}/20)`);

// ---- Newsletters lane shows the (padlocked) newsletter items -----------------
await pg.evaluate(() => { const b = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((x) => x.textContent.trim() === "Newsletters"); if (b) b.click(); });
await pg.waitForTimeout(400);
const nl = await pg.evaluate(() => {
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  const srcs = [...new Set(rows.map((r) => (r.querySelector(".g-feed-src") || {}).textContent || ""))];
  return { rows: rows.length, locked: document.querySelectorAll("#g-feed .g-feed-row.is-locked").length, srcs: srcs.slice(0, 8) };
});
check(nl.rows > 0, `Newsletters lane renders newsletter items (${nl.rows} rows from ${nl.srcs.filter(Boolean).slice(0,4).join(", ")})`);

// ---- Auto-open runs ONCE per load; a lane switch re-renders but does NOT re-jump the
// pane (R3a). The ↑/↓ arrows then cycle the feed, and keyboard focus must NOT paint the
// browser's default outline (the is-reading accent marker is the indicator).
await pg.evaluate(() => { const b = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((x) => x.textContent.trim() === "News"); if (b) b.click(); });
await pg.waitForTimeout(500);
const afterSwitch = await pg.evaluate(() => ({
  reading: !!document.querySelector("#g-feed .g-feed-row.is-reading"),
  rows: document.querySelectorAll("#g-feed .g-feed-row").length,
}));
check(afterSwitch.rows > 0 && !afterSwitch.reading, `desktop: a lane switch re-renders without re-jumping the pane (${afterSwitch.reading ? "re-opened" : "no re-jump"})`);

// ↓ opens the first row; ↓ again advances; ↑ steps back — cycling the feed.
const press = async (key) => { await pg.evaluate((k) => document.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true })), key); await pg.waitForTimeout(120); };
const readingIdx = () => pg.evaluate(() => { const rows = [...document.querySelectorAll("#g-feed .g-feed-row")]; return rows.findIndex((r) => r.classList.contains("is-reading")); });
await press("ArrowDown");
const i0 = await readingIdx();
check(i0 === 0, `arrows: ArrowDown opens the first row (idx ${i0})`);
await press("ArrowDown");
const i1 = await readingIdx();
check(i1 === 1, `arrows: a second ArrowDown advances to the next story (idx ${i1})`);
await press("ArrowUp");
const i2 = await readingIdx();
check(i2 === 0, `arrows: ArrowUp steps back to the previous story (idx ${i2})`);
// The keyboard-focused row must not carry the browser's default outline (white ring).
const outline = await pg.evaluate(() => {
  const r = document.querySelector("#g-feed .g-feed-row.is-reading"); if (!r) return null;
  const s = getComputedStyle(r);
  return { w: s.outlineWidth, style: s.outlineStyle };
});
check(outline && (outline.style === "none" || outline.w === "0px"), `arrows: focused row has no default outline ring (${outline ? outline.style + "/" + outline.w : "no row"})`);
check(await pg.evaluate(() => !!document.querySelector("#g-readpane .g-read-ttl, #g-readpane .g-read-body, #g-readpane [class*='g-read']")), "arrows: the selected story renders in the reading pane");

// ---- Readable-only Home newswire: the News lane carries NO subscriber-paywalled rows.
// The premium four (FT/Bloomberg/WSJ/Economist) and Nikkei are culled from the general
// news + macro desks, so nothing on the News lane needs a login. (The old ≤30% cap was
// replaced by this hard cull — see renderWire in glance.js. Bot-walled-but-free sources
// like Reuters still appear: they render in-pane via the Firecrawl proxy, so they carry
// the "opens at the publisher" mark, not the subscriber padlock.) -------------------
const sub = await pg.evaluate(() => {
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  const isSub = (r) => /needs a login/i.test(((r.querySelector(".g-feed-lock") || {}).title) || "");
  const subscriber = rows.filter(isSub);
  const subSrcs = [...new Set(subscriber.map((r) => ((r.querySelector(".g-feed-src") || {}).textContent || "").trim()))].filter(Boolean);
  return { total: rows.length, subscriber: subscriber.length, subSrcs: subSrcs.slice(0, 6) };
});
check(sub.total > 0 && sub.subscriber === 0,
  `News lane is readable-only — no subscriber-paywalled rows (${sub.subscriber}/${sub.total}${sub.subSrcs.length ? " — leaked: " + sub.subSrcs.join(", ") : ""})`);

// ---- Bot-walled (openly-published but reader-refused) sources count as NON-readable
// too: Reuters &c open at the publisher, get the "opens externally" mark (NOT the
// subscriber padlock), and are throttled into the ≤30% along with the paywalls. This
// is what keeps the readable-in-pane share honest (a Reuters row that shows a dead
// in-pane fallback would otherwise be miscounted as "readable"). -----------------
const linkout = await pg.evaluate(() => {
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  const reuters = rows.filter((r) => /reuters/i.test(((r.querySelector(".g-feed-src") || {}).textContent) || ""));
  if (!reuters.length) return null;
  return {
    n: reuters.length,
    allLocked: reuters.every((r) => r.classList.contains("is-locked")),
    extMark: reuters.every((r) => /opens at the publisher/i.test(((r.querySelector(".g-feed-lock") || {}).title) || "")),
  };
});
if (linkout) {
  check(linkout.allLocked, `bot-walled Reuters rows are flagged non-readable (is-locked), throttled with the paywalls (${linkout.n} rows)`);
  check(linkout.extMark, "bot-walled rows carry the 'opens at the publisher' mark, not the subscriber padlock");
} else check(true, "no Reuters rows in this cycle to check the link-out mark");

// ---- A padlocked story shows just the lock, no caption -----------------------
// The Home news wire is now readable-only (subscriber-paywalled rows are culled), so the
// padlocked-row reading-pane behaviour is exercised on the NEWSLETTERS lane, which keeps
// its subscriber content by nature. The row must be flagged "needs a login" (the
// subscriber padlock), not a bot-walled link-out.
await pg.evaluate(() => { const b = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((x) => x.textContent.trim() === "Newsletters"); if (b) b.click(); });
await pg.waitForTimeout(400);
const clickedLocked = await pg.evaluate(() => { const r = [...document.querySelectorAll("#g-feed .g-feed-row.is-locked")].find((x) => /needs a login/i.test((x.querySelector(".g-feed-lock") || {}).title || "")); if (r) r.click(); return !!r; });
check(clickedLocked, "a subscriber (padlocked) row is present to open (Newsletters lane)");
await pg.waitForTimeout(250);
const locked = await pg.evaluate(() => {
  const badge = document.querySelector("#g-readpane .g-read-lock");
  const meta = document.querySelector("#g-readpane .g-read-meta");
  return { badge: badge ? badge.textContent.trim() : "(none)", metaText: meta ? meta.textContent : "" };
});
check(locked.badge === "🔒", `desktop: a subscriber story's read pane shows just the padlock (${locked.badge})`);
check(!/subscriber source|preview \+ link/i.test(locked.metaText), "desktop: no 'subscriber source — preview + link' caption");

checkErrs(errs, "home wire lanes");
await ctx.close();
await b.close();
srv.close();
finish();
