// Home on mobile: the multi-column terminal collapses to one column. Four tabs —
// Market Briefing (default, always expanded, fills the page), News (a merged wire
// whose lane — All · News · Manager · Watchlist — is chosen from a "Chat"-style
// dropdown), Chart, and X Feed. On desktop the lane chips + reading pane show and
// these tabs are hidden.
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

// --- Phone: chips visible; Market Briefing is default (first chip); chips swap panes
{
  const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
  await pg.evaluate(() => { try { localStorage.removeItem("wire.home.v1"); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-hbrief .g-hbrief-head", { state: "attached", timeout: 8000 });
  await pg.waitForTimeout(400);

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
  check(labels.join(" · ") === "Briefing · News · Chart · X Feed", `phone: four tabs — Briefing · News (lane) · Chart · X Feed (${labels.join(", ")})`);
  const laneMenu = await pg.evaluate(() => [...document.querySelectorAll("#g-wire-lanemenu .tchip-menu-item")].map((i) => i.textContent.trim()));
  check(laneMenu.join(" · ") === "All · News · Manager · Watchlist", `phone: the wire tab's dropdown offers the four lanes (${laneMenu.join(", ")})`);

  // Default: Market Briefing on (the first chip), its pane visible, the rest hidden.
  check(await vis("#g-hbrief"), "phone: the market briefing pane is visible by default");
  check(!(await vis("#g-feed")), "phone: the news feed is hidden by default (Briefing selected)");
  check(!(await vis(".g-hero")), "phone: the chart pane is hidden by default (Briefing selected)");
  check(!(await vis(".g-side-x")), "phone: the X wire is hidden by default (Briefing selected)");
  const briefDefault = await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="brief"]').classList.contains("is-on"));
  check(briefDefault, "phone: the Market Briefing chip is active by default");

  // The briefing pane is ALWAYS expanded (no collapse chevron) and shows the latest brief.
  const brief = await pg.evaluate(() => {
    const el = document.getElementById("g-hbrief");
    if (!el || el.hidden) return null;
    return { hasHead: !!el.querySelector(".g-hbrief-head"), chev: !!el.querySelector(".g-hbrief-chev"), open: el.dataset.open,
      slots: el.querySelectorAll(".g-hbrief-slot").length, bullets: el.querySelectorAll(".g-hbrief-b").length, hasLede: !!el.querySelector(".g-hbrief-lede") };
  });
  check(brief && brief.hasHead && !brief.chev && brief.open === "true", "phone: the briefing pane is always expanded — no collapse chevron");
  check(brief && brief.slots === 0 && brief.bullets >= 1 && brief.bullets <= 4 && brief.hasLede, `phone: the briefing shows a lede + capped bullets, latest only (${brief && brief.bullets})`);

  // The X feed is PRELOADED while its pane is hidden, so it's ready the instant its
  // chip is tapped (no blank frame).
  await pg.waitForSelector("#g-xwire .g-x-card", { state: "attached", timeout: 8000 });
  const preloaded = await pg.evaluate(() => document.querySelectorAll("#g-xwire .g-x-card").length);
  check(preloaded >= 1, `phone: the X feed is preloaded while hidden (${preloaded} card[s]) — ready before its chip is tapped`);

  // Tap News → the merged wire feed replaces the briefing pane. Tapping the News
  // tab once activates its pane; tapping the ACTIVE News tab opens the lane dropdown.
  await pg.evaluate(() => document.querySelector(".g-wiretab-lane").click());
  await pg.waitForTimeout(200);
  check(await vis("#g-feed"), "phone: tapping News reveals the merged wire feed");
  check(!(await vis("#g-hbrief")), "phone: the briefing pane hides under News");
  await pg.evaluate(() => document.querySelector(".g-wiretab-lane").click());
  await pg.waitForTimeout(150);
  const menuOpen = await pg.evaluate(() => { const m = document.getElementById("g-wire-lanemenu"); return !!m && !m.hidden && m.offsetParent !== null; });
  check(menuOpen, "phone: tapping the active News tab opens the lane dropdown");
  await pg.evaluate(() => [...document.querySelectorAll("#g-wire-lanemenu .tchip-menu-item")].find((i) => i.textContent.trim() === "Manager").click());
  await pg.waitForTimeout(250);
  const mgrLane = await pg.evaluate(() => ({
    lbl: (document.querySelector(".g-wiretab-lane .g-wire-lanelbl") || {}).textContent || "",
    rows: document.querySelectorAll("#g-feed .g-mw-fev").length,
    menuClosed: document.getElementById("g-wire-lanemenu").hidden,
  }));
  check(mgrLane.lbl === "Manager" && mgrLane.rows > 0, `phone: the Manager lane renders manager events in the wire (${mgrLane.rows} rows)`);
  check(await vis("#g-feed"), "phone: manager events show in the shared feed pane (no separate Managers tab)");
  check(mgrLane.menuClosed, "phone: the dropdown closes after a lane is picked");

  // The All lane carries no sub-filters, so its (empty) filter band collapses — the
  // feed then sits directly under the wire tabs. Other lanes keep the band.
  await pg.evaluate(() => document.querySelector(".g-wiretab-lane").click());
  await pg.waitForTimeout(120);
  await pg.evaluate(() => [...document.querySelectorAll("#g-wire-lanemenu .tchip-menu-item")].find((i) => i.textContent.trim() === "All").click());
  await pg.waitForTimeout(250);
  const allBand = await pg.evaluate(() => {
    const head = document.getElementById("g-feed-head");
    const tabs = document.querySelector(".g-wiretabs").getBoundingClientRect();
    const day = document.querySelector("#g-feed .g-feed-dayhdr");
    return {
      headHidden: getComputedStyle(head).display === "none",
      dayUnderTabs: day ? Math.round(day.getBoundingClientRect().top - tabs.bottom) : null,
    };
  });
  check(allBand.headHidden, "phone: the All lane collapses its empty filter band");
  check(allBand.dayUnderTabs != null && allBand.dayUnderTabs >= -1 && allBand.dayUnderTabs <= 6,
    `phone: on All, the feed sits directly under the wire tabs (gap ${allBand.dayUnderTabs}px)`);

  // Back to the News lane — the filter band (sub-filters) returns.
  await pg.evaluate(() => document.querySelector(".g-wiretab-lane").click());
  await pg.waitForTimeout(120);
  await pg.evaluate(() => [...document.querySelectorAll("#g-wire-lanemenu .tchip-menu-item")].find((i) => i.textContent.trim() === "News").click());
  await pg.waitForTimeout(200);
  check(await vis("#g-feed-head"), "phone: the News lane restores the filter band (sub-filters)");

  // A bottom-nav Home tap resets to the Market Briefing pane (the first chip) and
  // never leaves the lane dropdown open. (The nav routes on pointerup, so a real tap
  // — not a synthetic click — exercises ctrl.home().)
  await pg.tap('.mtab[data-key="home"]');
  await pg.waitForTimeout(200);
  const afterHome = await pg.evaluate(() => ({
    briefOn: document.querySelector('.g-wiretab[data-wire="brief"]').classList.contains("is-on"),
    menuHidden: document.getElementById("g-wire-lanemenu").hidden,
  }));
  check(afterHome.briefOn, "phone: a Home tap resets to the Market Briefing pane");
  check(afterHome.menuHidden, "phone: a Home tap leaves the lane dropdown closed");
  // Back to News for the remaining pane-swap checks.
  await pg.evaluate(() => document.querySelector(".g-wiretab-lane").click());
  await pg.waitForTimeout(200);

  // Tap Chart → the hero chart pane is revealed (feed + manager hidden).
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="chart"]').click());
  await pg.waitForTimeout(200);
  check(await vis(".g-hero"), "phone: tapping Chart reveals the hero chart");
  check(!(await vis("#g-feed")), "phone: tapping Chart hides the news feed");
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
  check(!(await vis("#g-feed")), "phone: tapping X hides the news feed");
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
  check(await vis("#g-feed"), "phone: tapping News returns to the feed");
  check(!(await vis(".g-side3")), "phone: the manager wire is hidden again under News");
  check(!(await vis(".g-hero")), "phone: the chart is hidden again under News");
  check(!(await vis(".g-side-x")), "phone: the X wire is hidden again under News");

  // The header · search band · wire chips · filter row stay LOCKED when the News
  // pane scrolls. The filter row pins directly beneath the chips, and the feed's
  // day-break marker pins just beneath the filter — "sticks to the top of the wire".
  const at = () => pg.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top), bot: Math.round(b.bottom) }; };
    return { header: r("#wire-header .topbar"), band: r(".g-main .wire-band"), tabs: r(".g-wiretabs"), feedhead: r("#g-feed-head"), day: r("#g-feed .g-feed-dayhdr") };
  });
  const rest = await at();
  // At rest the filter row is pinned directly under the chips.
  check(rest.feedhead && rest.tabs && Math.abs(rest.feedhead.top - rest.tabs.bot) <= 2,
    `phone: at rest the filter row is pinned beneath the chips (filter.top ${rest.feedhead?.top}, chips.bot ${rest.tabs?.bot})`);
  // Scroll the feed → the band + chips + filter stay pinned, and the day-break
  // marker pins directly beneath the filter row.
  await pg.evaluate(() => window.scrollTo(0, 5000));
  await pg.waitForTimeout(300);
  const scr = await at();
  const same = (a, c) => a && c && Math.abs(a.top - c.top) <= 1;
  check(same(rest.band, scr.band) && same(rest.tabs, scr.tabs) && same(rest.feedhead, scr.feedhead),
    `phone: band + chips + filter stay pinned on scroll (band ${rest.band?.top}→${scr.band?.top}, filter ${rest.feedhead?.top}→${scr.feedhead?.top})`);
  check(scr.day && scr.day.top <= scr.feedhead.bot + 1 && scr.day.top >= scr.feedhead.bot - 4,
    `phone: the day-break marker sticks just beneath the filter row (day.top ${scr.day?.top}, filter.bot ${scr.feedhead?.bot})`);
  // No overlap in the pinned cluster.
  const stacked = scr.header.bot <= scr.band.top + 1 && scr.band.bot <= scr.tabs.top + 1 && scr.tabs.bot <= scr.feedhead.top + 1;
  check(stacked, `phone: the pinned cluster stacks without overlap (header→${scr.band.top}, band→${scr.tabs.top}, tabs→${scr.feedhead.top})`);

  checkErrs(errs, "home mobile wire tabs");
  await ctx.close();
}

// --- Phone: the filter row leads the news column (above the briefing) and hides
//     with that pane when a non-News chip is chosen. ---------------------------
{
  const ctx = await b.newContext({ viewport: { width: 430, height: 860 }, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${srv.port}/v2/`, { waitUntil: "load" });
  await pg.waitForSelector(".g-wiretab[data-wire='x']", { timeout: 8000 });
  // Switch to the News pane (default is the Briefing), then verify the filter row
  // leads the feed and hides with that pane when X is chosen.
  await pg.evaluate(() => document.querySelector(".g-wiretab-lane").click());
  await pg.waitForTimeout(200);
  const r = await pg.evaluate(() => {
    const head = document.getElementById("g-feed-head");
    const feed = document.getElementById("g-feed");
    const inWrap = !!head.closest(".g-feed-wrap");
    // The filter row leads the feed column (above the live feed).
    const hb = head.getBoundingClientRect(), fb = feed.getBoundingClientRect();
    const aboveFeed = hb.top <= fb.top + 1;
    const visible = getComputedStyle(head).display !== "none" && head.offsetParent !== null;
    document.querySelector(".g-wiretab[data-wire='x']").click();
    return { inWrap, aboveFeed, visible, hidden: getComputedStyle(head).display === "none" || head.offsetParent === null };
  });
  check(r.inWrap && r.aboveFeed && r.visible, "phone: the filter row leads the news column, above the feed");
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
    const feed = document.querySelector("#g-feed"), mgr = document.querySelector(".g-side3");
    const shown = (el) => el && getComputedStyle(el).display !== "none" && el.getBoundingClientRect().width > 0;
    return { chipsHidden: !t || getComputedStyle(t).display === "none", feedShown: shown(feed), mgrShown: shown(mgr) };
  });
  check(d.chipsHidden, "desktop: the mobile wire tabs are hidden");
  check(d.feedShown && d.mgrShown, "desktop: the merged wire (feed) and the reading pane (.g-side3) show side by side");
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
    const feed = document.querySelector("#g-feed"), mgr = document.querySelector(".g-side3");
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
