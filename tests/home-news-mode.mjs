// Home never shows the News page (owner 2026-10-16). Home and News share ONE kept-alive
// view (/v2/ and /v2/news/ resolve to it), so its mode must follow the ACTIVE tab on every
// path — not only on a Home re-tap. The owner's photo: the Home tab lit, the News lanes and
// wire on screen. Paths covered, on iPhone (390 and 430):
//   • News → another tab → Home (the kept-alive return — the bug's common path);
//   • News → Home tap (the same-view switch);
//   • a cold /v2/news/ with Home tapped before the view finished mounting (the mount race);
//   • Back / edge-swipe from News to Home (a popstate onto the same view);
//   • and the reverse: Home → another tab → News always shows the News wire.
import { serve, launchChromium, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
// The state that matters: which tab is lit, and whether the shared view is in news mode.
const state = (pg) => pg.evaluate(() => ({
  tab: document.documentElement.dataset.v2tab,
  lit: (document.querySelector(".mobile-tabbar .mtab.is-active") || {}).dataset?.key || null,
  news: !!document.querySelector(".g-layout.wire-newsmode"),
  lanes: [...document.querySelectorAll("#g-wire-lanechips .g-wire-lane")].some((c) => c.getClientRects().length),
  path: location.pathname,
}));
const settled = (pg, tab) => pg.waitForFunction((t) => document.documentElement.dataset.v2tab === t
  && [...document.querySelectorAll(".v2-view")].some((v) => v.offsetParent !== null && v.textContent.trim().length > 20), tab, { timeout: 20000 });
const tap = async (pg, key) => { await pg.click(`.mobile-tabbar .mtab[data-key="${key}"]`); await settled(pg, key); await pg.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))); };
const homeOk = (s) => s.tab === "home" && s.lit === "home" && !s.news && !s.lanes;
const newsOk = (s) => s.tab === "news" && s.lit === "news" && s.news && s.lanes;

for (const width of [390, 430]) {
  const dev = { viewport: { width, height: 900 }, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone)", colorScheme: "dark" };
  const ctx = await b.newContext(dev);
  const pg = await ctx.newPage();
  const errs = []; pg.on("pageerror", (e) => errs.push(String(e.message).slice(0, 160)));
  await pg.goto(base + "/v2/", { waitUntil: "load" }); await settled(pg, "home");
  check(homeOk(await state(pg)), `${width}px: a cold /v2/ opens Home, not the News wire`);
  await tap(pg, "news");
  check(newsOk(await state(pg)), `${width}px: the News tab shows the News wire (${JSON.stringify(await state(pg))})`);
  for (const via of ["transactions", "dashboard", "profiles"]) {
    await tap(pg, "news");
    await tap(pg, via);
    await tap(pg, "home");
    const s = await state(pg);
    check(homeOk(s), `${width}px: News → ${via} → Home shows Home, never the News wire (${JSON.stringify(s)})`);
    await tap(pg, via);
    await tap(pg, "news");
    check(newsOk(await state(pg)), `${width}px: Home → ${via} → News shows the News wire`);
  }
  // Same-view switch both ways.
  await tap(pg, "home");
  check(homeOk(await state(pg)), `${width}px: News → Home tap shows Home`);
  // Back / edge-swipe onto the same view: a pushed News entry, then Back to Home.
  await pg.evaluate(() => { history.pushState({ v2: true }, "", "/v2/news/"); dispatchEvent(new PopStateEvent("popstate")); });
  await settled(pg, "news");
  check(newsOk(await state(pg)), `${width}px: a pushed /v2/news/ entry shows the News wire`);
  await pg.goBack(); await settled(pg, "home");
  await pg.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  check(homeOk(await state(pg)), `${width}px: Back from News to Home shows Home (${JSON.stringify(await state(pg))})`);
  checkErrs(errs, `${width}px tab paths`);
  await ctx.close();

  // The mount race: a cold /v2/news/ with Home tapped the moment the tab bar exists.
  const ctx2 = await b.newContext(dev);
  const pg2 = await ctx2.newPage();
  await pg2.goto(base + "/v2/news/", { waitUntil: "domcontentloaded" });
  await pg2.waitForSelector('.mobile-tabbar .mtab[data-key="home"]', { timeout: 20000 });
  await pg2.click('.mobile-tabbar .mtab[data-key="home"]');
  await settled(pg2, "home");
  await pg2.waitForFunction(() => !!document.querySelector(".g-layout"), null, { timeout: 20000 });
  await pg2.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  check(homeOk(await state(pg2)), `${width}px: Home tapped while a cold News load mounts ends on Home (${JSON.stringify(await state(pg2))})`);
  await ctx2.close();
}
await b.close(); srv.close();
finish();
