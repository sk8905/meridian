// Home on mobile: the four-column terminal collapses to one column, so a
// News / Watchlist chip pair at the top swaps the visible wire — the aggregated
// news feed vs. the watchlist (manager) wire. On desktop both columns show at
// once and the chips are hidden.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();

// --- Phone: chips visible; News is default; Watchlist swaps the wire ---------
{
  const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
  await pg.waitForTimeout(300);

  const vis = (sel) => pg.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return getComputedStyle(el).display !== "none" && r.width > 0 && r.height > 0;
  }, sel);

  const chipsShown = await pg.evaluate(() => {
    const t = document.querySelector(".g-wiretabs");
    return t && getComputedStyle(t).display !== "none";
  });
  check(chipsShown, "phone: the News / Watchlist chips are shown");

  const labels = await pg.evaluate(() => [...document.querySelectorAll(".g-wiretab")].map((c) => c.textContent.trim()));
  check(labels.join(" · ") === "News · Watchlist · X", `phone: chips read 'News', 'Watchlist' and 'X' (${labels.join(", ")})`);

  // Default: News on, feed visible, manager + X wires hidden.
  check(await vis(".g-feed-wrap"), "phone: news feed is visible by default");
  check(!(await vis(".g-side3")), "phone: the manager wire is hidden by default (News selected)");
  check(!(await vis(".g-side-x")), "phone: the X wire is hidden by default (News selected)");
  const newsOn = await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="news"]').classList.contains("is-on"));
  check(newsOn, "phone: the News chip is active by default");

  // Tap Watchlist → manager wire visible, feed hidden.
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="watch"]').click());
  await pg.waitForTimeout(200);
  check(await vis(".g-side3"), "phone: tapping Watchlist reveals the manager wire");
  check(!(await vis(".g-feed-wrap")), "phone: tapping Watchlist hides the news feed");
  const watchState = await pg.evaluate(() => ({
    watchOn: document.querySelector('.g-wiretab[data-wire="watch"]').classList.contains("is-on"),
    aria: document.querySelector('.g-wiretab[data-wire="watch"]').getAttribute("aria-selected"),
    hasMgr: !!document.querySelector("#g-mgrwire .g-mw-fev, #g-mgrwire .g-mw-item, #g-mgrwire .g-mw-empty"),
  }));
  check(watchState.watchOn && watchState.aria === "true", "phone: the Watchlist chip is active + aria-selected after tap");
  check(watchState.hasMgr, "phone: the manager wire has rendered content under Watchlist");

  // Tap X → the X wire is revealed (feed + manager hidden) and it renders.
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="x"]').click());
  await pg.waitForSelector("#g-xwire .g-x-card", { timeout: 8000 });
  check(await vis(".g-side-x"), "phone: tapping X reveals the X wire");
  check(!(await vis(".g-feed-wrap")), "phone: tapping X hides the news feed");
  check(!(await vis(".g-side3")), "phone: tapping X keeps the manager wire hidden");
  const xState = await pg.evaluate(() => ({
    xOn: document.querySelector('.g-wiretab[data-wire="x"]').classList.contains("is-on"),
    aria: document.querySelector('.g-wiretab[data-wire="x"]').getAttribute("aria-selected"),
    cards: document.querySelectorAll("#g-xwire .g-x-card").length,
  }));
  check(xState.xOn && xState.aria === "true", "phone: the X chip is active + aria-selected after tap");
  check(xState.cards > 0, `phone: the X wire has rendered its posts (${xState.cards})`);

  // Tap News → back to the feed.
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="news"]').click());
  await pg.waitForTimeout(200);
  check(await vis(".g-feed-wrap"), "phone: tapping News returns to the feed");
  check(!(await vis(".g-side3")), "phone: the manager wire is hidden again under News");
  check(!(await vis(".g-side-x")), "phone: the X wire is hidden again under News");

  // The whole top cluster (header · search band · News/Watchlist tabs · feed
  // filter row) stays LOCKED when the headlines scroll — each pins directly under
  // the one above with no overlap. Regression guard for the band-height omission
  // that let the tabs slide up over the search band.
  const stackAt = () => pg.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top), bot: Math.round(b.bottom) }; };
    return { header: r("#wire-header .topbar"), band: r(".g-main .wire-band"), tabs: r(".g-wiretabs"), feedhead: r("#g-feed-head") };
  });
  const rest = await stackAt();
  await pg.evaluate(() => window.scrollTo(0, 700));
  await pg.waitForTimeout(300);
  const scrolled = await stackAt();
  const same = (a, b) => a && b && Math.abs(a.top - b.top) <= 1;
  check(same(rest.band, scrolled.band) && same(rest.tabs, scrolled.tabs) && same(rest.feedhead, scrolled.feedhead),
    `phone: search band + tabs + filter row stay pinned on scroll (band ${rest.band?.top}→${scrolled.band?.top}, tabs ${rest.tabs?.top}→${scrolled.tabs?.top}, filter ${rest.feedhead?.top}→${scrolled.feedhead?.top})`);
  // No overlap: each element sits fully below the previous one's bottom edge.
  const stacked = scrolled.header.bot <= scrolled.band.top + 1 && scrolled.band.bot <= scrolled.tabs.top + 1 && scrolled.tabs.bot <= scrolled.feedhead.top + 1;
  check(stacked, `phone: the locked cluster stacks without overlap (header→${scrolled.band.top}, band→${scrolled.tabs.top}, tabs→${scrolled.feedhead.top})`);

  checkErrs(errs, "home mobile wire tabs");
  await ctx.close();
}

// --- Phone: the news filter header must not sit above the Watchlist/X wire, even
//     when initFeedHeadLock has relocated it out of .g-feed-wrap up into .g-main
//     (as on iOS). Force that relocation, then swap to X, and confirm it hides. ---
{
  const ctx = await b.newContext({ viewport: { width: 430, height: 860 }, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${srv.port}/v2/`, { waitUntil: "load" });
  await pg.waitForSelector(".g-wiretab[data-wire='x']", { timeout: 8000 });
  const hidden = await pg.evaluate(() => {
    const head = document.getElementById("g-feed-head"), main = document.querySelector(".g-main");
    if (head && main && head.parentElement !== main) main.appendChild(head);   // simulate the iOS relocation
    document.querySelector(".g-wiretab[data-wire='x']").click();
    return getComputedStyle(document.getElementById("g-feed-head")).display === "none";
  });
  check(hidden, "phone: the news filter header is hidden under X even when relocated into .g-main");
  await ctx.close();
}

// --- Desktop: chips hidden, both wire columns visible ------------------------
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
  await pg.waitForTimeout(300);
  const d = await pg.evaluate(() => {
    const t = document.querySelector(".g-wiretabs");
    const feed = document.querySelector(".g-feed-wrap"), mgr = document.querySelector(".g-side3");
    const shown = (el) => el && getComputedStyle(el).display !== "none" && el.getBoundingClientRect().width > 0;
    return { chipsHidden: !t || getComputedStyle(t).display === "none", feedShown: shown(feed), mgrShown: shown(mgr) };
  });
  check(d.chipsHidden, "desktop: the News / Watchlist chips are hidden");
  check(d.feedShown && d.mgrShown, "desktop: both the news feed and manager wire show side by side");
  checkErrs(errs, "home desktop wire columns");
  await ctx.close();
}

await b.close(); srv.close();
finish();
