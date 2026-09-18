// Home on mobile: the four-column terminal collapses to one column, so a
// News / Watchlist chip pair at the top swaps the visible wire — the aggregated
// news feed vs. the watchlist (manager) wire. On desktop both columns show at
// once and the chips are hidden.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

// A minimal hero stub so the Chart pane (the default) has its ticker row.
const HERO = { asOf: "2026-09-17", instruments: ["spx", "ndx", "ust10", "oil", "gold", "btc"].map((k, i) => ({
  key: k, label: k.toUpperCase(), unit: "", pre: "", dp: 2, fi: false, value: 100 + i,
  history: Array.from({ length: 30 }, (_, j) => [Date.now() - (29 - j) * 864e5, 100 + i + j * 0.1]),
})) };
// One preloaded tweet so the X feed can be asserted as ready before its chip is tapped.
const XFEED = { tweets: [
  { id: "2097419714045624433", handle: "elerianm", name: "Mohamed A. El-Erian", avatar: "", text: "Preloaded tweet.", date: new Date(Date.now() - 20 * 60000).toUTCString(), ts: Date.now() - 20 * 60000, url: "https://x.com/elerianm/status/2097419714045624433", media: [] },
] };
const srv = await serve({ "/api/hero": () => [200, JSON.stringify(HERO)], "/api/xfeed": () => [200, JSON.stringify(XFEED)] });
const b = await launchChromium();

// --- Phone: chips visible; News is default (first chip); chips swap the pane --
{
  const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector("#g-feed .g-feed-row", { state: "attached", timeout: 8000 });
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
  check(chipsShown, "phone: the wire chips are shown");

  const labels = await pg.evaluate(() => [...document.querySelectorAll(".g-wiretab")].map((c) => c.textContent.trim()));
  check(labels.join(" · ") === "News · Managers · Chart · X Feed", `phone: chips read 'News', 'Managers', 'Chart' and 'X Feed' in order (${labels.join(", ")})`);

  // Default: News on (the first chip), the feed pane visible, the rest hidden.
  check(await vis(".g-feed-wrap"), "phone: the news feed is visible by default");
  check(!(await vis(".g-hero")), "phone: the chart pane is hidden by default (News selected)");
  check(!(await vis(".g-side3")), "phone: the manager wire is hidden by default (News selected)");
  check(!(await vis(".g-side-x")), "phone: the X wire is hidden by default (News selected)");
  const newsDefault = await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="news"]').classList.contains("is-on"));
  check(newsDefault, "phone: the News chip is active by default");

  // The tri-daily briefing rides the top of the News pane.
  const brief = await pg.evaluate(() => {
    const el = document.getElementById("g-hbrief");
    if (!el || el.hidden) return null;
    return { hasHead: !!el.querySelector(".g-hbrief-head"), slots: el.querySelectorAll(".g-hbrief-slot").length, bullets: el.querySelectorAll(".g-hbrief-b").length, hasLede: !!el.querySelector(".g-hbrief-lede") };
  });
  check(brief && brief.hasHead && brief.slots === 3, `phone: the briefing card leads the News pane with 3 slot chips (${brief && brief.slots})`);
  check(brief && brief.bullets >= 1 && brief.bullets <= 4 && brief.hasLede, `phone: the briefing shows a lede + capped bullets (${brief && brief.bullets})`);

  // The X feed is PRELOADED while its pane is hidden, so it's ready the instant its
  // chip is tapped (no blank frame).
  await pg.waitForSelector("#g-xwire .g-x-card", { state: "attached", timeout: 8000 });
  const preloaded = await pg.evaluate(() => document.querySelectorAll("#g-xwire .g-x-card").length);
  check(preloaded >= 1, `phone: the X feed is preloaded while hidden (${preloaded} card[s]) — ready before its chip is tapped`);

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

  // Tap Chart → the hero chart pane is revealed (feed + manager hidden).
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="chart"]').click());
  await pg.waitForTimeout(200);
  check(await vis(".g-hero"), "phone: tapping Chart reveals the hero chart");
  check(!(await vis(".g-feed-wrap")), "phone: tapping Chart hides the news feed");
  check(!(await vis(".g-side3")), "phone: tapping Chart keeps the manager wire hidden");
  // All six tickers are plotted by default on the chart.
  await pg.waitForSelector("#g-hero-sel .g-hero-tk", { timeout: 8000 });
  const chartSel = await pg.evaluate(() => document.querySelectorAll("#g-hero-sel .g-hero-tk.is-on").length);
  checkEq(chartSel, 6, "phone: all six tickers are selected on the chart by default");
  const chartState = await pg.evaluate(() => ({
    on: document.querySelector('.g-wiretab[data-wire="chart"]').classList.contains("is-on"),
    aria: document.querySelector('.g-wiretab[data-wire="chart"]').getAttribute("aria-selected"),
  }));
  check(chartState.on && chartState.aria === "true", "phone: the Chart chip is active + aria-selected after tap");

  // Tap X → the X wire is revealed (feed + manager hidden) and mounts the feed.
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="x"]').click());
  await pg.waitForSelector("#g-xwire #g-x-feed", { timeout: 8000 });
  check(await vis(".g-side-x"), "phone: tapping X reveals the X wire");
  check(!(await vis(".g-feed-wrap")), "phone: tapping X hides the news feed");
  check(!(await vis(".g-side3")), "phone: tapping X keeps the manager wire hidden");
  const xState = await pg.evaluate(() => ({
    xOn: document.querySelector('.g-wiretab[data-wire="x"]').classList.contains("is-on"),
    aria: document.querySelector('.g-wiretab[data-wire="x"]').getAttribute("aria-selected"),
    mounted: !!document.querySelector("#g-xwire #g-x-feed"),
  }));
  check(xState.xOn && xState.aria === "true", "phone: the X chip is active + aria-selected after tap");
  check(xState.mounted, "phone: the X wire feed is mounted");

  // Tap News → back to the feed.
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="news"]').click());
  await pg.waitForTimeout(200);
  check(await vis(".g-feed-wrap"), "phone: tapping News returns to the feed");
  check(!(await vis(".g-side3")), "phone: the manager wire is hidden again under News");
  check(!(await vis(".g-hero")), "phone: the chart is hidden again under News");
  check(!(await vis(".g-side-x")), "phone: the X wire is hidden again under News");

  // The header · search band · wire chips stay LOCKED when the page scrolls. The
  // news filter row sits BELOW the briefing at rest, scrolls up with it, and then
  // PINS directly beneath the chips (sticks to the top of the news wire).
  const at = () => pg.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top), bot: Math.round(b.bottom) }; };
    return { header: r("#wire-header .topbar"), band: r(".g-main .wire-band"), tabs: r(".g-wiretabs"), brief: r("#g-hbrief"), feedhead: r("#g-feed-head") };
  });
  const rest = await at();
  // At rest the briefing leads the pane and the filter row sits below it, unpinned.
  check(rest.brief && rest.feedhead && rest.feedhead.top >= rest.brief.bot - 1,
    `phone: at rest the filter row sits BELOW the briefing (brief.bot ${rest.brief?.bot}, filter.top ${rest.feedhead?.top})`);
  check(rest.feedhead.top > rest.tabs.bot + 1, "phone: at rest the filter row is not yet pinned (below the chips, in the scroll)");
  // Scroll well past the briefing → chips stay pinned, and the filter row pins to
  // the top of the wire directly beneath them.
  await pg.evaluate(() => window.scrollTo(0, 3000));
  await pg.waitForTimeout(300);
  const scr = await at();
  const same = (a, c) => a && c && Math.abs(a.top - c.top) <= 1;
  check(same(rest.band, scr.band) && same(rest.tabs, scr.tabs),
    `phone: the search band + chips stay pinned on scroll (band ${rest.band?.top}→${scr.band?.top}, tabs ${rest.tabs?.top}→${scr.tabs?.top})`);
  check(Math.abs(scr.feedhead.top - scr.tabs.bot) <= 2,
    `phone: the filter row pins to the top of the wire, beneath the chips (filter.top ${scr.feedhead?.top}, chips.bot ${scr.tabs?.bot})`);
  // No overlap in the pinned cluster.
  const stacked = scr.header.bot <= scr.band.top + 1 && scr.band.bot <= scr.tabs.top + 1 && scr.tabs.bot <= scr.feedhead.top + 1;
  check(stacked, `phone: the pinned cluster stacks without overlap (header→${scr.band.top}, band→${scr.tabs.top}, tabs→${scr.feedhead.top})`);

  checkErrs(errs, "home mobile wire tabs");
  await ctx.close();
}

// --- Phone: the filter row lives in the news column (below the briefing) and hides
//     with that pane when a non-News chip is chosen. ---------------------------
{
  const ctx = await b.newContext({ viewport: { width: 430, height: 860 }, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${srv.port}/v2/`, { waitUntil: "load" });
  await pg.waitForSelector(".g-wiretab[data-wire='x']", { timeout: 8000 });
  const r = await pg.evaluate(() => {
    const head = document.getElementById("g-feed-head");
    const brief = document.getElementById("g-hbrief");
    const inWrap = !!head.closest(".g-feed-wrap");
    // The filter row follows the briefing in the news column's flow.
    const belowBrief = !!brief && !!(brief.compareDocumentPosition(head) & Node.DOCUMENT_POSITION_FOLLOWING);
    document.querySelector(".g-wiretab[data-wire='x']").click();
    return { inWrap, belowBrief, hidden: getComputedStyle(head).display === "none" || head.offsetParent === null };
  });
  check(r.inWrap && r.belowBrief, "phone: the filter row lives in the news column, after the briefing");
  check(r.hidden, "phone: switching to X hides the filter row with the news pane");
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

// --- Tablet (iPad mini landscape, 1024px): the 5-column terminal crushes the two
//     middle wires to ~50px each, so below 1201px we use the single-column chip
//     swap. Assert the chips are shown and the feed is a full-width single column
//     (the manager wire is NOT side-by-side). ------------------------------------
{
  const ctx = await b.newContext({ viewport: { width: 1024, height: 768 } });
  const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${srv.port}/v2/`, { waitUntil: "load" });
  await pg.waitForSelector("#g-feed .g-feed-row", { state: "attached", timeout: 8000 });
  // Chart is the default pane; tap News so the feed is the visible single column here.
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="news"]').click());
  await pg.waitForTimeout(300);
  const t = await pg.evaluate(() => {
    const tabs = document.querySelector(".g-wiretabs");
    const feed = document.querySelector(".g-feed-wrap"), mgr = document.querySelector(".g-side3");
    const shown = (el) => el && getComputedStyle(el).display !== "none" && el.getBoundingClientRect().width > 0;
    const fw = feed ? feed.getBoundingClientRect().width : 0;
    return { chipsShown: tabs && getComputedStyle(tabs).display !== "none", feedShown: shown(feed), feedW: Math.round(fw), mgrShown: shown(mgr) };
  });
  check(t.chipsShown, "ipad(1024): the wire chips are shown (chip-swap, not the crushed 5-col terminal)");
  check(t.feedShown && !t.mgrShown, "ipad(1024): the news feed is the single visible pane (manager wire not squeezed alongside)");
  check(t.feedW > 700, `ipad(1024): the news feed spans a readable full-width column (${t.feedW}px)`);
  await ctx.close();
}

await b.close(); srv.close();
finish();
