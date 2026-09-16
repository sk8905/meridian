// Home X wire: a merged, newest-first column of REAL X posts rendered live by X's
// official widgets.js. The panel is its own rail (between the manager wire and the
// macro rail) on desktop, and the third wire chip (News · Watchlist · X) on phones.
// The widget
// script is third-party and loaded LAZILY; in this offline harness X is
// unreachable, so every post keeps its "View on X" fallback link and the two
// unverifiable accounts (@michaeljburry, @ArashMassoudi) show a profile card.
// Nothing is fabricated: each card carries a real x.com permalink / profile URL.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";
import { X_POSTS, X_ACCOUNTS } from "../v2/js/home/xposts.js";

const srv = await serve();
const b = await launchChromium();

// Expected: posts newest-first; accounts with no post reference render a profile card.
const postsSorted = [...X_POSTS].filter((p) => p && p.id && p.handle)
  .sort((a, b2) => String(b2.date).localeCompare(String(a.date)));
const withPost = new Set(postsSorted.map((p) => p.handle.toLowerCase()));
const orphans = X_ACCOUNTS.filter((a) => !withPost.has(a.handle.toLowerCase()));

{
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector("#g-xwire .g-x-card", { timeout: 8000 });
  await pg.waitForTimeout(300);

  const r = await pg.evaluate(() => {
    const panel = document.querySelector("#jump-xwire");
    const head = panel && panel.querySelector(".tui-ph > :first-child");
    const inRail = !!document.querySelector(".g-side-x #g-xwire");
    // The X rail sits between the manager wire (g-side3) and the macro rail (g-side2).
    const lft = (s) => { const el = document.querySelector(s); return el ? el.getBoundingClientRect().left : null; };
    const between = lft(".g-side3") < lft(".g-side-x") && lft(".g-side-x") < lft(".g-side2");
    const postCards = [...document.querySelectorAll("#g-xwire .g-x-card[data-tweet]")];
    const acctCards = [...document.querySelectorAll("#g-xwire .g-x-card.g-x-acct")];
    const rx = /^https:\/\/x\.com\/[^/]+\/status\/\d+$/;
    const rp = /^https:\/\/x\.com\/[^/]+$/;
    return {
      header: head ? head.textContent.trim() : null,
      inRail, between,
      ids: postCards.map((c) => c.dataset.tweet),
      // Every post card links a real permalink (the fallback stands in until X
      // renders the embed in its place — offline here, so it must be present).
      postLinks: postCards.map((c) => { const a = c.querySelector('a[href^="https://x.com/"][href*="/status/"]'); return a ? rx.test(a.getAttribute("href")) : false; }),
      // Account (orphan) cards link a real profile URL, no fabricated status.
      acctHandles: acctCards.map((c) => (c.querySelector(".g-x-h") || {}).textContent || ""),
      acctLinks: acctCards.map((c) => { const a = c.querySelector(".g-x-fallback"); return a ? rp.test(a.getAttribute("href")) : false; }),
      acctNoStatus: acctCards.every((c) => !c.querySelector('a[href*="/status/"]')),
      // The official widget script is wired in (loaded lazily on boot).
      widgetScript: !!document.querySelector('script[src*="platform.twitter.com/widgets.js"]'),
    };
  });

  checkEq(r.header, "X wire", "X wire: panel renders with its header");
  check(r.inRail, "X wire: panel sits in its own rail (g-side-x)");
  check(r.between, "X wire: the rail sits between the manager wire and the macro rail");
  checkEq(r.ids.length, postsSorted.length, `X wire: every verified post renders (${r.ids.length})`);
  checkEq(r.ids.join(","), postsSorted.map((p) => p.id).join(","), "X wire: posts are merged newest-first (by tweet date)");
  check(r.postLinks.length > 0 && r.postLinks.every(Boolean), "X wire: every post card carries a real x.com permalink");
  checkEq(r.acctHandles.length, orphans.length, `X wire: accounts with no verified post show a profile card (${r.acctHandles.length})`);
  check(r.acctLinks.length === orphans.length && r.acctLinks.every(Boolean), "X wire: profile cards link a real x.com profile URL");
  check(r.acctNoStatus, "X wire: profile cards never invent a status permalink");
  check(r.widgetScript, "X wire: X's official widgets.js is loaded to render the embeds live");
  checkErrs(errs, "home X wire (desktop)");
  await ctx.close();
}

// Phone: the X wire is a third chip (News · Watchlist · X); tapping it reveals
// and renders the wire.
{
  const ctx = await b.newContext({ viewport: { width: 430, height: 860 }, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${srv.port}/v2/`, { waitUntil: "load" });
  await pg.waitForSelector(".g-wiretab[data-wire='x']", { timeout: 8000 });
  await pg.evaluate(() => document.querySelector(".g-wiretab[data-wire='x']").click());
  await pg.waitForSelector("#g-xwire .g-x-card", { timeout: 8000 });
  const n = await pg.evaluate(() => document.querySelectorAll("#g-xwire .g-x-card").length);
  check(n >= postsSorted.length, `phone: the X chip reveals and renders the wire (${n})`);
  await ctx.close();
}

await b.close(); srv.close();
finish();
