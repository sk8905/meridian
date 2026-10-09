// Reopen freshness — the NEWS items (not just the briefing). The Home wire is built
// from the edge-assembled /api/feed, which refetches on foreground. The resume gate is
// tiny (LIVE_RESUME_MS, a few seconds) so a reopened iOS PWA shows current headlines the
// instant it is foregrounded, not ones up to the ~5-min polling interval stale. The open
// app also polls every 5 min REGARDLESS of visibility (background refresh). This drives it
// with a swappable /api/feed and a controllable clock/visibility: after a reopen past the
// gate, the wire re-pulls and re-renders IN PLACE (no reload — a sentinel survives).
import { serve, launchChromium, PHONE, check, checkErrs, finish } from "./lib.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const feed = (marker) => ({ items: [
  { title: `${marker} — markets headline one`, url: "https://example.test/1", source: "Reuters", date: "2026-10-04", time: "09:00", desk: "m" },
  { title: `${marker} — markets headline two`, url: "https://example.test/2", source: "FT", date: "2026-10-04", time: "08:30", desk: "m" },
] });

let feedBody = JSON.stringify(feed("ALPHAMARK"));   // the edition this page loads with
const srv = await serve({
  "/api/feed": () => [200, feedBody],
  "/api/hero": () => [200, JSON.stringify({ asOf: "2026-10-04", instruments: [] })],
  "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })],
});

const b = await launchChromium();
const ctx = await b.newContext(PHONE);
await ctx.addInitScript(() => {
  let off = 0, vis = "visible";
  const realNow = Date.now.bind(Date);
  Date.now = () => realNow() + off;
  Object.defineProperty(document, "hidden", { configurable: true, get: () => vis === "hidden" });
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => vis });
  window.__setVis = (v, advanceMs) => { if (advanceMs) off += advanceMs; vis = v; document.dispatchEvent(new Event("visibilitychange")); };
});
const pg = await ctx.newPage();
const errs = [];
pg.on("pageerror", (e) => errs.push(String(e.message).slice(0, 160)));
await pg.goto(`http://localhost:${srv.port}/v2/`, { waitUntil: "load" });
// The aggregated news feed is the News tab now — switch into news mode (the lane
// chip's handler does this) so the wire is the visible pane.
await pg.waitForSelector(".g-wiretab-lane", { state: "attached", timeout: 8000 });
await pg.evaluate(() => document.querySelector(".g-wiretab-lane").click());
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });

const feedText = () => pg.evaluate(() => (document.getElementById("g-feed") || {}).textContent || "");
await pg.waitForFunction(() => /ALPHAMARK/.test((document.getElementById("g-feed") || {}).textContent || ""), null, { timeout: 8000 });
check(/ALPHAMARK/.test(await feedText()), "loads the first edition of headlines (ALPHAMARK)");

// Publish a new edition, mark the live page, then reopen just PAST the short dedupe gate —
// a near-instant foreground refresh (the gate is only a few seconds now).
feedBody = JSON.stringify(feed("BETAMARK"));
await pg.evaluate(() => { window.__sentinel = 1; });
await pg.evaluate(() => window.__setVis("hidden"));
await pg.evaluate(() => window.__setVis("visible", 5 * 1000));   // 5s away (> 3s dedupe gate) → refreshes on foreground
await pg.waitForFunction(() => /BETAMARK/.test((document.getElementById("g-feed") || {}).textContent || ""), null, { timeout: 8000 });
check(/BETAMARK/.test(await feedText()), "shows the new headlines after reopen (BETAMARK)");
check(!/ALPHAMARK/.test(await feedText()), "the stale headlines are gone (refetched, not appended)");
check((await pg.evaluate(() => window.__sentinel)) === 1, "news refreshed IN PLACE on reopen — no reload (sentinel survives)");

// Source invariant: the live poll runs regardless of visibility (keeps a backgrounded-but-
// resident app current), rather than skipping while hidden as it used to.
const _gsrc = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "v2", "js", "home", "glance.js"), "utf8");
check(/setInterval\(\(\)\s*=>\s*\{\s*refreshLive\(\);\s*\},\s*LIVE_REFRESH_MS\)/.test(_gsrc), "live poll: runs on every tick regardless of visibility (background refresh)");
check(!/if \(!document\.hidden\) refreshLive\(\)/.test(_gsrc), "live poll: no longer skips the tick while hidden");

checkErrs(errs, "home news resume");
await ctx.close();
await b.close(); srv.close();
finish();
