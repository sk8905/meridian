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

// ---- Reading pane: default is the most-recent UNLOCKED story -----------------
await pg.evaluate(() => { const b = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((x) => x.textContent.trim() === "News"); if (b) b.click(); });
await pg.waitForTimeout(500);
const dflt = await pg.evaluate(() => {
  const reading = document.querySelector("#g-feed .g-feed-row.is-reading");
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  const firstUnlocked = rows.find((r) => !r.classList.contains("is-locked"));
  return { hasReading: !!reading, readingLocked: !!(reading && reading.classList.contains("is-locked")), isFirstUnlocked: !!(reading && firstUnlocked && reading === firstUnlocked) };
});
check(dflt.hasReading && !dflt.readingLocked, "desktop: the reading pane defaults to an UNLOCKED story");
check(dflt.isFirstUnlocked, "desktop: the default is the most-recent unlocked row");

// ---- ≥70% of the News wire is readable in-pane, at every scroll depth ----
const access = await pg.evaluate(() => {
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  const lockAt = rows.map((r) => (r.classList.contains("is-locked") ? 1 : 0));
  const locked = lockAt.reduce((s, v) => s + v, 0);
  // Worst padlocked density in any sliding window of 10 consecutive rows.
  let worst = 0;
  for (let i = 0; i + 10 <= lockAt.length; i++) worst = Math.max(worst, lockAt.slice(i, i + 10).reduce((s, v) => s + v, 0));
  return { total: rows.length, locked, frac: rows.length ? locked / rows.length : 0, worstPer10: worst };
});
check(access.total > 0 && access.frac <= 0.30 + 1e-9, `News wire keeps ≥70% readable overall — subscriber rows ≤30% (${access.locked}/${access.total} = ${Math.round(access.frac * 100)}%)`);
check(access.worstPer10 <= 3, `News wire never clumps padlocked rows — ≤3 per any 10-row window (worst ${access.worstPer10}/10)`);

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
const clickedLocked = await pg.evaluate(() => { const r = document.querySelector("#g-feed .g-feed-row.is-locked"); if (r) r.click(); return !!r; });
check(clickedLocked, "a subscriber (padlocked) row is present to open");
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
