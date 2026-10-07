// The reader's ⋯ overflow menu — "Not interested" (hide this story) and "Mute source"
// (hide every story from that outlet). Mutes persist locally (wire.home.v1) and POST to
// /api/feedback; the one feed engine drops muted items across every lane. This drives the
// DESKTOP reading pane: open a story, use the ⋯ menu, assert the feed updates and the tap
// is posted, then un-mute via the Manage sheet.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

// A feed with several stories from two outlets we can mute, among ordinary news.
const FEED = { items: [
  { title: "Channel NewsAsia story one on Facebook film", url: "https://www.channelnewsasia.com/a1", source: "Channel NewsAsia", date: "2026-10-07", time: "11:05", desk: "news" },
  { title: "Channel NewsAsia story two on markets", url: "https://www.channelnewsasia.com/a2", source: "Channel NewsAsia", date: "2026-10-07", time: "10:30", desk: "news" },
  { title: "Reuters story on rates and credit", url: "https://www.reuters.com/r1", source: "Reuters", date: "2026-10-07", time: "10:00", desk: "m" },
  ...Array.from({ length: 20 }, (_, i) => ({ title: `Markets story ${i} on bonds`, url: `https://www.reuters.com/x${i}`, source: "Reuters", date: "2026-10-07", time: `0${9 - (i % 9)}:00`, desk: "m" })),
] };

const srv = await serve({
  "/api/feed": () => [200, JSON.stringify(FEED)],
  // POST → ack the tap; GET (?mine=1 on load) → no server-side mutes for this reader.
  "/api/feedback": (q) => q.method === "POST" ? [200, JSON.stringify({ ok: true })] : [200, JSON.stringify({ email: "t@x", items: [] })],
});

const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
// Capture the /api/feedback POST bodies at the network layer to assert the tap was sent.
const posted = [];
pg.on("request", (r) => {
  if (r.method() === "POST" && r.url().includes("/api/feedback")) {
    try { posted.push(JSON.parse(r.postData() || "{}")); } catch { posted.push({}); }
  }
});
await pg.evaluate(() => { try { localStorage.clear(); } catch {} });
await pg.reload({ waitUntil: "load" });
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
await pg.waitForTimeout(400);

// A CNA story auto-opens (or open one) in the desktop reading pane; the ⋯ button shows.
await pg.evaluate(() => {
  const row = [...document.querySelectorAll("#g-feed .g-feed-row")].find((r) => /Channel NewsAsia/.test(r.textContent));
  if (row) row.click();
});
await pg.waitForTimeout(500);
const hasBtn = await pg.evaluate(() => !!document.querySelector("#g-readpane .g-read-menu-btn, #g-read .g-read-menu-btn"));
check(hasBtn, "reader: the ⋯ overflow button renders in the reading pane");

// Open the menu → it offers Not interested + Mute source.
const menuItems = await pg.evaluate(() => {
  const btn = document.querySelector("#g-read .g-read-menu-btn");
  if (btn) btn.click();
  return [...document.querySelectorAll("#g-read .g-read-menu-item")].map((i) => i.textContent.trim());
});
check(menuItems.some((t) => /Not interested/i.test(t)), `menu: offers 'Not interested' (${menuItems.join(" | ")})`);
check(menuItems.some((t) => /Mute source/i.test(t) && /Channel NewsAsia/.test(t)), "menu: offers 'Mute source · Channel NewsAsia'");

const cnaBefore = await pg.evaluate(() => [...document.querySelectorAll("#g-feed .g-feed-row")].filter((r) => /Channel NewsAsia/.test(r.textContent)).length);
check(cnaBefore >= 2, `feed: Channel NewsAsia stories present before muting (${cnaBefore})`);

// Click "Mute source" → every CNA row disappears from the feed, and a tap is POSTed.
await pg.evaluate(() => {
  const it = [...document.querySelectorAll("#g-read .g-read-menu-item")].find((i) => /Mute source/i.test(i.textContent));
  if (it) it.click();
});
await pg.waitForTimeout(500);
const cnaAfter = await pg.evaluate(() => [...document.querySelectorAll("#g-feed .g-feed-row")].filter((r) => /Channel NewsAsia/.test(r.textContent)).length);
checkEq(cnaAfter, 0, "feed: muting the source removes all its stories from the wire");
const reutersStillThere = await pg.evaluate(() => [...document.querySelectorAll("#g-feed .g-feed-row")].filter((r) => /reuters/i.test(r.textContent)).length);
check(reutersStillThere > 0, `feed: other sources are untouched by the mute (${reutersStillThere} Reuters rows)`);
check(posted.some((p) => p.reason === "mute-source" && p.source === "Channel NewsAsia"), `server: the mute-source tap was POSTed to /api/feedback (${posted.map((p) => p.reason).join(",")})`);

// The mute persists in local prefs (wire.home.v1 → muted.srcs).
const persisted = await pg.evaluate(() => { try { return (JSON.parse(localStorage.getItem("wire.home.v1") || "{}").muted || {}).srcs || []; } catch { return []; } });
check(persisted.includes("Channel NewsAsia"), `prefs: the muted source persists locally (${persisted.join(",")})`);

// Mute persists across a reload (and stays filtered).
await pg.reload({ waitUntil: "load" });
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
await pg.waitForTimeout(400);
const cnaAfterReload = await pg.evaluate(() => [...document.querySelectorAll("#g-feed .g-feed-row")].filter((r) => /Channel NewsAsia/.test(r.textContent)).length);
checkEq(cnaAfterReload, 0, "feed: the mute survives a reload");

// Manage muted → shows the source → Unmute restores it.
await pg.evaluate(() => {
  const row = [...document.querySelectorAll("#g-feed .g-feed-row")][0];
  if (row) row.click();
});
await pg.waitForTimeout(400);
await pg.evaluate(() => {
  const btn = document.querySelector("#g-read .g-read-menu-btn"); if (btn) btn.click();
  const mg = [...document.querySelectorAll("#g-read .g-read-menu-item")].find((i) => /Manage muted/i.test(i.textContent));
  if (mg) mg.click();
});
await pg.waitForTimeout(300);
const mgrShowsSource = await pg.evaluate(() => /Channel NewsAsia/.test((document.getElementById("g-muted-mgr") || {}).textContent || ""));
check(mgrShowsSource, "manage: the muted sheet lists the muted source");
await pg.evaluate(() => { const u = document.querySelector("#g-muted-mgr [data-mm-unmute]"); if (u) u.click(); });
await pg.waitForTimeout(500);
const cnaBack = await pg.evaluate(() => [...document.querySelectorAll("#g-feed .g-feed-row")].filter((r) => /Channel NewsAsia/.test(r.textContent)).length);
check(cnaBack >= 2, `feed: un-muting restores the source's stories (${cnaBack})`);
check(posted.some((p) => p.reason === "unmute"), "server: the unmute was POSTed to /api/feedback");

checkErrs(errs, "home reader mute");
await ctx.close();
await b.close();
srv.close();
finish();
