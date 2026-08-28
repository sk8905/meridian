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
  check(labels.join(" · ") === "News · Watchlist", `phone: chips read 'News' and 'Watchlist' (${labels.join(", ")})`);

  // Default: News on, feed visible, manager wire hidden.
  check(await vis(".g-feed-wrap"), "phone: news feed is visible by default");
  check(!(await vis(".g-side3")), "phone: the manager wire is hidden by default (News selected)");
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
    hasMgr: !!document.querySelector("#g-mgrwire .g-mw-item, #g-mgrwire .g-mw-empty"),
  }));
  check(watchState.watchOn && watchState.aria === "true", "phone: the Watchlist chip is active + aria-selected after tap");
  check(watchState.hasMgr, "phone: the manager wire has rendered content under Watchlist");

  // Tap News → back to the feed.
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="news"]').click());
  await pg.waitForTimeout(200);
  check(await vis(".g-feed-wrap"), "phone: tapping News returns to the feed");
  check(!(await vis(".g-side3")), "phone: the manager wire is hidden again under News");

  checkErrs(errs, "home mobile wire tabs");
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
