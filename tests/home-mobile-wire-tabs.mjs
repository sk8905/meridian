// Home on mobile (iPhone nav reorg): the multi-column terminal collapses to one
// column. HOME top nav = Briefing (default, always expanded) · Markets (the full
// Equities/Macro/Predictions panel) · Chart · X Feed. The aggregated NEWS wire + its
// lane selector (All · Research · Managers · Watchlist · Newsletters) is the separate
// NEWS bottom tab (news mode): there the four home tabs hide and only the lane chip
// shows, over the feed. On desktop the lane chips + reading pane show and these tabs
// are hidden.
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

// --- Phone: HOME mode (Briefing · Markets · Chart · X Feed) + NEWS mode (lane feed) --
{
  const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
  await pg.evaluate(() => { try { localStorage.removeItem("wire.home.v1"); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-hbrief .g-hbrief-head", { state: "attached", timeout: 8000 });
  await pg.waitForTimeout(400);

  const cdp = await ctx.newCDPSession(pg);
  const tapTab = async (key) => {
    const box = await pg.evaluate((k) => { const t = document.querySelector(`.mobile-tabbar .mtab[data-key="${k}"]`); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, key);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x, y: box.y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await pg.waitForTimeout(700);
  };
  const vis = (sel) => pg.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return getComputedStyle(el).display !== "none" && r.width > 0 && r.height > 0;
  }, sel);
  const chipVisible = (sel) => pg.evaluate((s) => { const el = document.querySelector(s); return !!el && getComputedStyle(el).display !== "none"; }, sel);

  check(await pg.evaluate(() => { const t = document.querySelector(".g-wiretabs"); return t && getComputedStyle(t).display !== "none"; }), "phone: the wire chips are shown");

  // HOME top nav = the four home tabs; the news lane chip row is hidden in home mode.
  const labels = await pg.evaluate(() => [...document.querySelectorAll(".g-wiretab")].filter((c) => getComputedStyle(c).display !== "none").map((c) => c.textContent.trim()));
  check(labels.join(" · ") === "Briefing · Markets · Chart · X Feed", `phone: home top nav — Briefing · Markets · Chart · X Feed (${labels.join(", ")})`);
  check(!(await chipVisible("#g-wire-lanechips")), "phone: the news lane chip row is hidden in home mode");
  const laneChips = await pg.evaluate(() => [...document.querySelectorAll("#g-wire-lanechips .g-wire-lane")].map((i) => i.textContent.trim()));
  check(laneChips.join(" · ") === "All · Research · Managers · Watchlist · Newsletters", `phone: the news lane chip row carries the five lanes (${laneChips.join(", ")})`);

  // DEFAULT home pane = the Market Briefing (always expanded), feed/markets/chart/x hidden.
  check(await vis("#g-hbrief"), "phone: the Market Briefing pane is the default (shown on load)");
  check(await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="brief"]').classList.contains("is-on")), "phone: the Briefing chip is active by default");
  check(!(await vis("#g-feed")), "phone: the news feed is hidden in home mode (it lives on the News tab)");
  check(!(await vis(".g-hero")), "phone: the chart pane is hidden by default");
  const brief = await pg.evaluate(() => {
    const el = document.getElementById("g-hbrief");
    if (!el || el.hidden) return null;
    return { hasHead: !!el.querySelector(".g-hbrief-head"), chev: !!el.querySelector(".g-hbrief-chev"), open: el.dataset.open,
      slots: el.querySelectorAll(".g-hbrief-slot").length, bullets: el.querySelectorAll(".g-hbrief-b").length, noLede: !el.querySelector(".g-hbrief-lede") };
  });
  check(brief && brief.hasHead && !brief.chev && brief.open === "true", "phone: the briefing pane is always expanded — no collapse chevron");
  // One bullet per desk, budget = max(HB_MAX_BULLETS, #desks) — so ≥4 desks render
  // all of them (never drop a desk); the point is latest-only + no Overview lede.
  check(brief && brief.slots === 0 && brief.bullets >= 1 && brief.bullets <= 8 && brief.noLede, `phone: the briefing shows per-desk sections, latest only, no Overview lede (${brief && brief.bullets})`);

  // The X feed is PRELOADED while its pane is hidden.
  await pg.waitForSelector("#g-xwire .g-x-card", { state: "attached", timeout: 8000 });
  check(await pg.evaluate(() => document.querySelectorAll("#g-xwire .g-x-card").length) >= 1, "phone: the X feed is preloaded while hidden — ready before its chip is tapped");

  // Tap MARKETS → the full panel mounts in #g-mktpane as a SWIPE carousel (no switcher).
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="markets"]').click());
  await pg.waitForFunction(() => { const p = document.getElementById("g-mktpane"); return p && getComputedStyle(p).display !== "none" && p.querySelector(".na-mktswipe"); }, undefined, { timeout: 8000 });
  const mk = await pg.evaluate(() => ({ slides: [...document.querySelectorAll("#g-mktpane .na-mktslide")].map((s) => s.dataset.k), dots: document.querySelectorAll("#g-mktpane .na-mktdot").length, noSwitcher: !document.querySelector("#g-mktpane .na-mktsel") }));
  check(mk.slides.join(" | ") === "equities | macro | predict" && mk.dots === 3 && mk.noSwitcher, `phone: the Markets tab is an Equities/Macro/Predictions swipe carousel (slides: ${mk.slides.join(" | ")}, dots: ${mk.dots})`);
  check(!(await vis("#g-hbrief")), "phone: the briefing hides under the Markets tab");

  // Tap CHART → hero chart (feed + manager hidden), all instruments plotted, no left border.
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="chart"]').click());
  await pg.waitForTimeout(200);
  check(await vis(".g-hero"), "phone: tapping Chart reveals the hero chart");
  check(!(await vis("#g-mktpane")), "phone: the Markets pane hides under Chart");
  check(await pg.evaluate(() => { const h = document.querySelector(".g-hero"); return !!h && parseFloat(getComputedStyle(h).borderLeftWidth) === 0; }), "phone: the chart pane has no left border line on the far-left edge");
  await pg.waitForSelector("#g-hero-sel .g-hero-tk", { timeout: 8000 });
  const chartSel = await pg.evaluate(() => ({ all: [...document.querySelectorAll("#g-hero-sel .g-hero-tk")].map((t) => t.dataset.k).sort().join(","), on: [...document.querySelectorAll("#g-hero-sel .g-hero-tk.is-on")].map((t) => t.dataset.k).sort().join(",") }));
  checkEq(chartSel.on, chartSel.all, `phone: every instrument in the row is selected by default (${chartSel.on})`);

  // Tap X → the X wire.
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="x"]').click());
  await pg.waitForSelector("#g-xwire #g-x-feed", { timeout: 8000 });
  check(await vis(".g-side-x"), "phone: tapping X reveals the X wire");
  check(!(await vis(".g-hero")), "phone: the chart hides under X");

  // --- NEWS MODE: the News bottom tab — feed + lane CHIP ROW, home tabs hidden. ----
  await tapTab("news");
  check(await pg.evaluate(() => document.documentElement.dataset.v2tab === "news"), "phone: the News tab flags data-v2tab=news");
  check(await vis("#g-feed"), "phone: News mode shows the aggregated feed");
  check(await chipVisible("#g-wire-lanechips"), "phone: News mode shows the lane chip row");
  check(await pg.evaluate(() => document.querySelector("#g-wire-lanechips .g-wire-lane.is-on")?.textContent.trim() === "All"), "phone: the All chip is active by default");
  check(!(await chipVisible('.g-wiretab[data-wire="brief"]')), "phone: News mode hides the Briefing home tab");
  check(!(await chipVisible('.g-wiretab[data-wire="markets"]')), "phone: News mode hides the Markets home tab");
  check(!(await vis("#g-hbrief")), "phone: News mode hides the briefing pane");

  // Tapping a lane chip switches the lane and repaints the feed in place.
  await pg.evaluate(() => [...document.querySelectorAll("#g-wire-lanechips .g-wire-lane")].find((c) => c.textContent.trim() === "Managers").click());
  await pg.waitForTimeout(250);
  const mgrLane = await pg.evaluate(() => ({ lbl: ((document.querySelector("#g-wire-lanechips .g-wire-lane.is-on") || {}).textContent || "").trim(), rows: document.querySelectorAll("#g-feed .g-mw-fev").length }));
  check(mgrLane.lbl === "Managers" && mgrLane.rows > 0, `phone: the Managers lane chip renders manager events in the wire (${mgrLane.rows} rows)`);
  // Back to All — no filter band; feed sits directly under the wire tabs.
  await pg.evaluate(() => [...document.querySelectorAll("#g-wire-lanechips .g-wire-lane")].find((c) => c.textContent.trim() === "All").click());
  await pg.waitForTimeout(250);
  check(await pg.evaluate(() => { const head = document.getElementById("g-feed-head"); return !head || getComputedStyle(head).display === "none"; }), "phone: no filter band on the All lane (removed)");

  // Scroll: the wire chips stay pinned and the day-break marker sticks beneath them.
  const at = () => pg.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top), bot: Math.round(b.bottom) }; };
    return { header: r("#wire-header .topbar"), tabs: r(".g-wiretabs"), day: r("#g-feed .g-feed-dayhdr") };
  });
  const rest = await at();
  check(rest.day && rest.tabs && rest.day.top >= rest.tabs.bot - 2 && rest.day.top <= rest.tabs.bot + 8, `phone: at rest the day marker sits beneath the chips (day.top ${rest.day?.top}, chips.bot ${rest.tabs?.bot})`);
  await pg.evaluate(() => window.scrollTo(0, 5000));
  await pg.waitForTimeout(300);
  const scr = await at();
  check(rest.tabs && scr.tabs && Math.abs(rest.tabs.top - scr.tabs.top) <= 1, `phone: the wire chips stay pinned on scroll (chips ${rest.tabs?.top}→${scr.tabs?.top})`);
  check(scr.day && scr.day.top <= scr.tabs.bot + 1 && scr.day.top >= scr.tabs.bot - 4, `phone: the day-break marker sticks just beneath the chips (day.top ${scr.day?.top}, chips.bot ${scr.tabs?.bot})`);

  // A bottom-nav Home tap returns to the Briefing pane and resets the lane to All.
  await tapTab("home");
  const afterHome = await pg.evaluate(() => ({
    v2tab: document.documentElement.dataset.v2tab,
    briefOn: document.querySelector('.g-wiretab[data-wire="brief"]').classList.contains("is-on"),
    lane: ((document.querySelector("#g-wire-lanechips .g-wire-lane.is-on") || {}).textContent || "").trim(),
    briefVisible: (() => { const h = document.getElementById("g-hbrief"); return !!h && getComputedStyle(h).display !== "none" && h.getBoundingClientRect().height > 0; })(),
  }));
  check(afterHome.v2tab === "home" && afterHome.briefOn && afterHome.briefVisible, "phone: a Home tap returns to the Market Briefing pane (home mode)");
  check(afterHome.lane === "All", `phone: a Home tap resets the underlying news lane to All (${afterHome.lane})`);

  checkErrs(errs, "home mobile wire tabs");
  await ctx.close();
}

// --- Phone: the feed leads the news column and hides with that pane when a non-News
//     chip is chosen. (There is no filter row anymore.) -------------------------
{
  const ctx = await b.newContext({ viewport: { width: 430, height: 860 }, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${srv.port}/v2/`, { waitUntil: "load" });
  await pg.waitForSelector(".g-wiretab[data-wire='x']", { timeout: 8000 });
  // Enter news mode (default is the Briefing) via the News bottom tab, then verify the
  // feed shows and hides with that pane when X is chosen.
  await pg.click('.mtab[data-key="news"]');
  await pg.waitForTimeout(300);
  const r = await pg.evaluate(() => {
    const feed = document.getElementById("g-feed");
    const inWrap = !!feed.closest(".g-feed-wrap");
    const visible = getComputedStyle(feed).display !== "none" && feed.offsetParent !== null;
    document.querySelector(".g-wiretab[data-wire='x']").click();
    return { inWrap, visible, hidden: getComputedStyle(feed).display === "none" || feed.offsetParent === null };
  });
  check(r.inWrap && r.visible, "phone: the feed leads the news column");
  check(r.hidden, "phone: switching to X hides the news feed with its pane");
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
  // Briefing is the default pane; tap the News bottom tab (the bottom bar now shows
  // across the whole ≤1200px mobile/tablet range) so the feed is the visible column.
  await pg.click('.mtab[data-key="news"]');
  await pg.waitForTimeout(400);
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
