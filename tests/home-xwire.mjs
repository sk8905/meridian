// Home X wire: a single, always-current, merged & newest-first stream rendered
// live by X's official widgets.js as a List timeline (a public X List). The panel
// is its own rail (between the manager wire and the macro rail) on desktop, and
// the third wire chip (News · Watchlist · X) on phones. The widget is loaded
// lazily; offline here (X unreachable), so the panel shows its "Open the X list"
// fallback link — whose href is the real List URL — and the widgets.js loader is
// still wired in. Nothing is curated or fabricated: the embed is the source.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";
import { X_LIST } from "../v2/js/home/xposts.js";

const srv = await serve();
const b = await launchChromium();

{
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector("#g-xwire #g-x-timeline", { timeout: 8000 });
  await pg.waitForTimeout(300);

  const r = await pg.evaluate(() => {
    const panel = document.querySelector("#jump-xwire");
    const head = panel && panel.querySelector(".tui-ph > :first-child");
    const inRail = !!document.querySelector(".g-side-x #g-xwire");
    const lft = (s) => { const el = document.querySelector(s); return el ? el.getBoundingClientRect().left : null; };
    const between = lft(".g-side3") < lft(".g-side-x") && lft(".g-side-x") < lft(".g-side2");
    const slot = document.querySelector("#g-xwire #g-x-timeline");
    const anchor = slot && slot.querySelector("a.twitter-timeline");
    const fb = document.querySelector("#g-xwire .g-x-open .g-x-fallback");
    return {
      header: head ? head.textContent.trim() : null,
      inRail, between,
      hasSlot: !!slot,
      anchorHref: anchor ? anchor.getAttribute("href") : null,
      fbHref: fb ? fb.getAttribute("href") : null,
      // The official widget script is wired in (loaded lazily on boot).
      widgetScript: !!document.querySelector('script[src*="platform.twitter.com/widgets.js"]'),
    };
  });

  checkEq(r.header, "X wire", "X wire: panel renders with its header");
  check(r.inRail, "X wire: panel sits in its own rail (g-side-x)");
  check(r.between, "X wire: the rail sits between the manager wire and the macro rail");
  check(r.hasSlot, "X wire: the List-timeline mount point renders");
  check(!!r.anchorHref && r.anchorHref.includes(`/i/lists/${X_LIST.id}`), `X wire: the canonical .twitter-timeline anchor targets the List (${r.anchorHref})`);
  check(r.fbHref === X_LIST.url, `X wire: the "Open list on X" link points at the real List URL (${r.fbHref})`);
  check(/^https:\/\/x\.com\/i\/lists\/\d+$/.test(r.fbHref || ""), "X wire: the List URL is a real x.com list permalink");
  check(r.widgetScript, "X wire: X's official widgets.js is loaded to hydrate the timeline");
  checkErrs(errs, "home X wire (desktop)");
  await ctx.close();
}

// Phone: the X wire is the third chip (News · Watchlist · X); tapping it reveals
// and mounts the timeline.
{
  const ctx = await b.newContext({ viewport: { width: 430, height: 860 }, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${srv.port}/v2/`, { waitUntil: "load" });
  await pg.waitForSelector(".g-wiretab[data-wire='x']", { timeout: 8000 });
  await pg.evaluate(() => document.querySelector(".g-wiretab[data-wire='x']").click());
  await pg.waitForSelector("#g-xwire #g-x-timeline", { timeout: 8000 });
  const ok = await pg.evaluate(() => {
    const a = document.querySelector("#g-xwire #g-x-timeline a.twitter-timeline");
    return !!a && /\/i\/lists\/\d+$/.test(a.getAttribute("href") || "");
  });
  check(ok, "phone: the X chip reveals and mounts the List timeline");
  await ctx.close();
}

await b.close(); srv.close();
finish();
