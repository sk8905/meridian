// Scrollbars (owner 2026-10-23): hidden app-wide, EXCEPT a thin bar on the Home news feed,
// the reading pane and the X feed (premium.css). Computed styles only — headless Chromium
// hides painted bars, so the spec checks the rules that draw them.
import { serve, launchChromium, open, WIDE, check, checkErrs, finish } from "./lib.mjs";
const srv = await serve({});
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, WIDE, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 10000 });
const r = await pg.evaluate(() => {
  const sw = (sel) => { const e = document.querySelector(sel); return e ? getComputedStyle(e).scrollbarWidth : "missing"; };
  const wk = (sel) => { const e = document.querySelector(sel); return e ? getComputedStyle(e, "::-webkit-scrollbar").width : "missing"; };
  return { feed: sw("#g-feed"), pane: sw("#g-readpane"), x: sw(".g-x-body"), mw: sw(".g-mw-body"), movers: sw("#g-movers"), body: sw("body"), feedW: wk("#g-feed") };
});
check(r.feed !== "none" && r.pane !== "none" && r.x !== "none", `news feed, reading pane and X feed show a scrollbar (${r.feed}/${r.pane}/${r.x})`);
check(r.feedW === "5px", `…a thin 5px bar (${r.feedW})`);
check(r.mw === "none" && r.movers === "none" && r.body === "none", `every other scroller keeps its hidden bar (${r.mw}/${r.movers}/${r.body})`);
checkErrs(errs, "scrollbars");
await ctx.close(); await b.close(); srv.close();
finish();
