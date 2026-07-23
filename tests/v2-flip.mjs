// PWA flip: an INSTALLED (standalone) home-screen app is redirected to the v2
// rebuild; a normal browser tab keeps the current app. This is what makes the
// home-screen icon open v2 without a re-add, while leaving browser users (and
// every other spec) on the current app. One-line rollback (remove the redirect).
import { serve, launchChromium, PHONE, check, checkEq, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// Browser (non-standalone): entries do NOT redirect.
for (const p of ["/", "/macro/", "/menu/"]) {
  const ctx = await b.newContext({ ...PHONE });
  const pg = await ctx.newPage();
  await pg.goto(base + p, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(600);
  checkEq(await pg.evaluate(() => location.pathname), p, `browser ${p}: stays on the current app (no redirect)`);
  await ctx.close();
}

// Standalone (installed PWA): entries redirect to their /v2/ equivalent.
for (const [from, to] of [["/", "/v2/"], ["/macro/", "/v2/macro/"], ["/credit/", "/v2/credit/"], ["/menu/", "/v2/menu/"]]) {
  const ctx = await b.newContext({ ...PHONE });
  const pg = await ctx.newPage();
  await pg.addInitScript(() => { Object.defineProperty(navigator, "standalone", { get: () => true }); });
  await pg.goto(base + from, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(1000);
  checkEq(await pg.evaluate(() => location.pathname), to, `standalone ${from}: redirects to ${to}`);
  await ctx.close();
}

// The v2 shell itself must NOT redirect (no loop) even in standalone.
{
  const ctx = await b.newContext({ ...PHONE });
  const pg = await ctx.newPage();
  await pg.addInitScript(() => { Object.defineProperty(navigator, "standalone", { get: () => true }); });
  await pg.goto(base + "/v2/", { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(800);
  checkEq(await pg.evaluate(() => location.pathname), "/v2/", "standalone /v2/: no redirect loop (already on v2)");
  await ctx.close();
}

await b.close(); srv.close();
finish();
