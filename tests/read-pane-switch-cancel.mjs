// Regression: the desktop reading pane must not get stuck on "Fetching the full text…".
// ROOT CAUSE: closeMobileReader() bumped _readSeq unconditionally ("cancel any in-flight
// fetch"). During the paint, initMobileWireTabs → setWire(default pane) calls
// closeMobileReader AFTER a CACHED-FEED auto-open has already started its read, so the seq
// advances and the auto-open's .then bails on the seq guard — nothing re-renders and the
// pane sits on the loading note forever, even though the server returned the body. Fresh
// users (and the old tests) missed it: their feed loads AFTER setWire, so the auto-open
// happens later and keeps the current seq.
//
// This seeds a cached feed (m_glance_feed) so the auto-open fires at first paint, and
// delays /api/read so that read is in flight when the init setWire fires — exactly the
// production trigger. With the bug the pane stays on "Fetching…"; with the fix it renders.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const READ = { source: "The Guardian", title: "A tighter RBI, but not a hawkish one", byline: "Deepali Bhargava", date: "", accessible: true,
  paragraphs: ["The Reserve Bank of India raised its policy rate by 25bp to 5.50%, its first hike in over three years.",
    "Governor Malhotra framed the move as calibrated tightening rather than a hawkish turn."],
  blocks: [{ t: "RBI hikes as expected", h: true },
    { t: "The Reserve Bank of India raised its policy rate by 25bp to 5.50%, its first hike in over three years.", h: false },
    { t: "Governor Malhotra framed the move as calibrated tightening rather than a hawkish turn.", h: false }] };

// Openly-readable (non-walled) cached feed so the auto-open picks a row that fetches /api/read.
const FEED = { asOf: Date.now(), items: Array.from({ length: 8 }, (_, i) => ({
  title: `Guardian story ${i} on oil, rates and credit`, url: `https://www.theguardian.com/business/s${i}`,
  source: "The Guardian", date: "2026-10-07", time: `1${i}:00`, desk: "m",
})) };

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
// Delay the reader so the auto-open's read is still in flight when the init setWire runs.
await pg.route("**/api/read**", async (route) => {
  await new Promise((r) => setTimeout(r, 700));
  route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(READ) });
});
// Seed the cached feed BEFORE the app boots so the auto-open fires at first paint.
await pg.addInitScript((feed) => {
  try { localStorage.setItem("m_glance_feed", JSON.stringify(feed)); localStorage.removeItem("m_read_last"); localStorage.removeItem("meridian.follows"); } catch { /* */ }
}, FEED);
await pg.reload({ waitUntil: "load" });

// The auto-open enters reading mode (loading note) at first paint.
const sawLoading = await pg.waitForSelector("#g-readpane .g-read-loading", { timeout: 6000 }).then(() => true).catch(() => false);
check(sawLoading, "desktop auto-open enters the loading state (read in flight during init)");

// The in-flight auto-open read must RESOLVE into the pane — the init setWire's
// closeMobileReader must not have cancelled it. With the bug this never clears.
const rendered = await pg.waitForFunction(() => {
  const box = document.getElementById("g-readpane");
  if (!box) return false;
  return !box.querySelector(".g-read-loading") && box.querySelectorAll(".g-read-p").length >= 1;
}, { timeout: 5000 }).then(() => true).catch(() => false);
check(rendered, "the auto-open read renders the body — not cancelled by the init pane switch (no stuck 'Fetching…')");

const pane = await pg.evaluate(() => (document.getElementById("g-readpane")?.textContent || ""));
check(/RBI|Reserve Bank|calibrated/i.test(pane) && !/Fetching the full text/i.test(pane), "the reading pane shows the fetched article body, not the loading note");

checkErrs(errs, "read pane switch-cancel");
await ctx.close();
await b.close(); srv.close();
finish();
