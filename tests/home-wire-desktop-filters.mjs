// Desktop merged wire: the colour/label sub-filters ride the lane-tab row (#g-wire-subs,
// beside All·News·Manager·Watchlist) instead of a separate band below — so the old
// #g-feed-head strip is hidden and the All lane shows no empty row. The reading pane
// defaults to the most-recent UNLOCKED story (one that opens in-pane without a login),
// and a padlocked (subscriber) story shows just the lock — no "subscriber source —
// preview + link" caption. Runs on the app's real bundled wire content.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.evaluate(() => { try { localStorage.removeItem("wire.home.v1"); } catch {} });
await pg.reload({ waitUntil: "load" });
await pg.waitForSelector("#g-wire-lanes .g-wire-lane", { timeout: 8000 });
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
await pg.waitForTimeout(600);

// ---- Task C: sub-filters ride the lane row; the band below is gone ----------
const lane = await pg.evaluate(() => {
  const lanes = document.getElementById("g-wire-lanes");
  const subs = document.getElementById("g-wire-subs");
  const head = document.getElementById("g-feed-head");
  const watch = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((b) => /Watchlist/i.test(b.textContent));
  return {
    subsInLaneRow: !!(subs && lanes && lanes.contains(subs)),
    deskChips: subs ? subs.querySelectorAll(".g-feed-deskchip").length : 0,
    besideWatchlist: !!(subs && watch && Math.round(subs.getBoundingClientRect().left) >= Math.round(watch.getBoundingClientRect().right) - 2),
    headHidden: !head || getComputedStyle(head).display === "none",
  };
});
check(lane.subsInLaneRow && lane.deskChips >= 6, `desktop: the desk sub-filters ride the lane-tab row (${lane.deskChips} chips)`);
check(lane.besideWatchlist, "desktop: the sub-filters sit beside Watchlist (right of the lane tabs)");
check(lane.headHidden, "desktop: the old #g-feed-head sub-filter band is hidden (no empty strip)");

// The All lane must show NO sub-filters and still no empty band.
await pg.evaluate(() => { const b = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((x) => x.textContent.trim() === "All"); if (b) b.click(); });
await pg.waitForTimeout(300);
const allLane = await pg.evaluate(() => {
  const subs = document.getElementById("g-wire-subs");
  const head = document.getElementById("g-feed-head");
  return { empty: !subs || subs.children.length === 0, headHidden: !head || getComputedStyle(head).display === "none" };
});
check(allLane.empty && allLane.headHidden, "desktop: the All lane carries no sub-filters and no empty band");

// Back to the News lane for the reading-pane checks.
await pg.evaluate(() => { const b = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((x) => x.textContent.trim() === "News"); if (b) b.click(); });
await pg.waitForTimeout(500);

// ---- Task G: the reading pane defaults to an UNLOCKED story ------------------
const dflt = await pg.evaluate(() => {
  const reading = document.querySelector("#g-feed .g-feed-row.is-reading");
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  const firstUnlocked = rows.find((r) => !r.classList.contains("is-locked"));
  return {
    hasReading: !!reading,
    readingLocked: !!(reading && reading.classList.contains("is-locked")),
    // The default open should be the FIRST (newest) unlocked row, not merely any.
    isFirstUnlocked: !!(reading && firstUnlocked && reading === firstUnlocked),
    hadLockedBeforeIt: rows.slice(0, rows.indexOf(reading)).some((r) => r.classList.contains("is-locked")),
  };
});
check(dflt.hasReading && !dflt.readingLocked, "desktop: the reading pane defaults to an UNLOCKED story (not a padlocked one)");
check(dflt.isFirstUnlocked, "desktop: the default is the most-recent unlocked row (subscriber leads are skipped)");

// ---- Task D: a padlocked story shows just the lock, no caption --------------
const clickedLocked = await pg.evaluate(() => {
  const r = document.querySelector("#g-feed .g-feed-row.is-locked");
  if (r) r.click();
  return !!r;
});
check(clickedLocked, "a subscriber (padlocked) row is present to open");
await pg.waitForTimeout(250);
const locked = await pg.evaluate(() => {
  const badge = document.querySelector("#g-readpane .g-read-lock");
  const meta = document.querySelector("#g-readpane .g-read-meta");
  return { badge: badge ? badge.textContent.trim() : "(none)", metaText: meta ? meta.textContent : "" };
});
check(locked.badge === "🔒", `desktop: a subscriber story's read pane shows just the padlock (${locked.badge})`);
check(!/subscriber source|preview \+ link/i.test(locked.metaText), "desktop: the 'subscriber source — preview + link' caption is gone");

checkErrs(errs, "home wire desktop filters");
await ctx.close();
await b.close();
srv.close();
finish();
