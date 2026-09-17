// Home X wire: a merged, newest-first, LIVE feed of the roster's public accounts,
// fetched by the Worker from X's syndication endpoint (/api/xfeed) and drawn as
// our OWN cards — deliberately NOT the client-side X widget (X blanks that for
// logged-out webviews). Its own rail (between the manager wire and the macro rail)
// on desktop; the third wire chip (News · Watchlist · X) on phones. Here /api/xfeed
// is stubbed, so we assert the cards render (author · handle · text · permalink),
// newest-first, plus the persistent "Open list on X" link.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const SAMPLE = { tweets: [
  { id: "2097419714045624433", handle: "elerianm", name: "Mohamed A. El-Erian", avatar: "https://pbs.twimg.com/x.jpg", text: "The Fed delivered a 25bp hike, its first since 2023.", date: new Date(Date.now() - 29 * 60000).toUTCString(), ts: Date.now() - 29 * 60000, url: "https://x.com/elerianm/status/2097419714045624433", media: [] },
  { id: "2097400000000000000", handle: "RayDalio", name: "Ray Dalio", avatar: "https://pbs.twimg.com/y.jpg", text: "At this stage in my life my main goal is to pass along principles.", date: new Date(Date.now() - 53 * 60000).toUTCString(), ts: Date.now() - 53 * 60000, url: "https://x.com/RayDalio/status/2097400000000000000", media: [] },
  { id: "2097300000000000000", handle: "TheEconomist", name: "The Economist", avatar: "https://pbs.twimg.com/e.jpg", text: "The most important factor driving up bond yields.", date: new Date(Date.now() - 70 * 60000).toUTCString(), ts: Date.now() - 70 * 60000, url: "https://x.com/TheEconomist/status/2097300000000000000", media: [], repostedBy: "Mohamed A. El-Erian" },
] };

const srv = await serve({ "/api/xfeed": () => [200, JSON.stringify(SAMPLE)] });
const b = await launchChromium();

{
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector("#g-xwire .g-x-card", { timeout: 8000 });
  await pg.waitForTimeout(200);

  const r = await pg.evaluate(() => {
    const panel = document.querySelector("#jump-xwire");
    // No title row — the X chip / rail labels it; posts start at the top.
    const noHeader = !!panel && !panel.querySelector(".tui-ph");
    const inRail = !!document.querySelector(".g-side-x #g-xwire");
    const lft = (s) => { const el = document.querySelector(s); return el ? el.getBoundingClientRect().left : null; };
    const between = lft(".g-side3") < lft(".g-side-x") && lft(".g-side-x") < lft(".g-side2");
    const cards = [...document.querySelectorAll("#g-xwire .g-x-card")];
    const first = cards[0];
    return {
      noHeader,
      inRail, between,
      count: cards.length,
      // No chrome above the posts in normal use (no title row, no "Open list" row).
      noOpenRow: !document.querySelector("#g-xwire .g-x-open"),
      handles: cards.map((c) => (c.querySelector(".g-x-h") || {}).textContent || ""),
      firstText: first ? (first.querySelector(".g-x-txt") || {}).textContent || "" : "",
      firstPerma: first ? (first.querySelector(".g-x-permalink") || {}).getAttribute("href") : null,
      // The repost card shows a "reposted" line naming the account that reposted it.
      repostLine: (() => { const c = [...cards].find((x) => (x.querySelector(".g-x-h") || {}).textContent === "@TheEconomist"); const r = c && c.querySelector(".g-x-rt"); return r ? r.textContent : ""; })(),
      // We render our own cards — no dependency on X's client widget script.
      noWidgetScript: !document.querySelector('script[src*="platform.twitter.com"]'),
    };
  });

  check(r.noHeader, "X wire: no title row (posts start at the top, saving space)");
  check(r.noOpenRow, "X wire: no 'Open list on X' row in normal use");
  check(r.inRail, "X wire: panel sits in its own rail (g-side-x)");
  check(r.between, "X wire: the rail sits between the manager wire and the macro rail");
  checkEq(r.count, SAMPLE.tweets.length, `X wire: one card per tweet (${r.count})`);
  checkEq(r.handles.join(","), "@elerianm,@RayDalio,@TheEconomist", "X wire: cards render in the order served (newest-first, merged)");
  check(/Mohamed A\. El-Erian reposted/.test(r.repostLine), `X wire: reposts show a "reposted" line (${r.repostLine})`);
  check(/25bp hike/.test(r.firstText), "X wire: the tweet body text renders in the card");
  check(/^https:\/\/x\.com\/elerianm\/status\/\d+$/.test(r.firstPerma || ""), `X wire: each card links the real post permalink (${r.firstPerma})`);
  check(r.noWidgetScript, "X wire: renders our own cards (no client-side X widget script)");
  checkErrs(errs, "home X wire (desktop)");
  await ctx.close();
}

// Phone: the X wire is the third chip (News · Watchlist · X); tapping it reveals
// and loads the feed.
{
  const ctx = await b.newContext({ viewport: { width: 430, height: 860 }, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${srv.port}/v2/`, { waitUntil: "load" });
  await pg.waitForSelector(".g-wiretab[data-wire='x']", { timeout: 8000 });
  await pg.evaluate(() => document.querySelector(".g-wiretab[data-wire='x']").click());
  await pg.waitForSelector("#g-xwire .g-x-card", { timeout: 8000 });
  const n = await pg.evaluate(() => document.querySelectorAll("#g-xwire .g-x-card").length);
  check(n === SAMPLE.tweets.length, `phone: the X chip reveals and loads the feed (${n} cards)`);
  await ctx.close();
}

await b.close(); srv.close();
finish();
