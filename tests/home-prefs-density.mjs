// F7 — a Density preference (Menu ▸ Display): "Comfortable" grows the shared
// --chip-h to a ~44px touch target, opt-in over the compact default.
// F8 — Home remembers the last wire desk filter and the mobile News/Watchlist
// tab, so it reopens where you left it.
import { serve, launchChromium, open, DESKTOP, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// ---- F7: density toggle ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/menu/");
  await pg.waitForSelector('.v2-view[data-view="menu"] .na-menu-bar .tchip', { timeout: 8000 });
  // Default density is compact.
  const def = await pg.evaluate(() => ({
    attr: document.documentElement.getAttribute("data-density"),
    chip: getComputedStyle(document.documentElement).getPropertyValue("--chip-h").trim(),
  }));
  checkEq(def.attr, "compact", "default density is compact");
  checkEq(def.chip, "34px", "compact --chip-h is 34px");

  // Open Display, choose Comfortable.
  await pg.evaluate(() => [...document.querySelectorAll('.v2-view[data-view="menu"] .na-menu-bar .tchip')].find((c) => c.textContent.trim() === "Display")?.click());
  await pg.waitForTimeout(200);
  const hasSeg = await pg.evaluate(() => !!document.getElementById("v2-density-seg"));
  check(hasSeg, "Display pane has a Density control");
  await pg.evaluate(() => document.querySelector('#v2-density-seg .na-theme-opt[data-density-opt="comfortable"]').click());
  await pg.waitForTimeout(200);
  const after = await pg.evaluate(() => ({
    attr: document.documentElement.getAttribute("data-density"),
    stored: (() => { try { return localStorage.getItem("m_density"); } catch { return null; } })(),
    chip: getComputedStyle(document.documentElement).getPropertyValue("--chip-h").trim(),
  }));
  checkEq(after.attr, "comfortable", "choosing Comfortable sets data-density=comfortable");
  checkEq(after.stored, "comfortable", "the density choice is persisted (m_density)");
  checkEq(after.chip, "44px", "comfortable --chip-h grows to a 44px touch target");
  checkErrs(errs, "density toggle");
  await ctx.close();
}

// ---- F8: Home remembers the last desk filter ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
  await pg.waitForSelector(".g-feed-deskchip", { timeout: 8000 });
  await pg.waitForTimeout(600);
  await pg.evaluate(() => document.querySelector('.g-feed-deskchip[data-desk="c"]').click());
  await pg.waitForTimeout(300);
  const stored = await pg.evaluate(() => { try { return JSON.parse(localStorage.getItem("wire.home.v1") || "{}").desk; } catch { return null; } });
  checkEq(stored, "c", "selecting the Credit desk persists the filter");
  // Reload → the Credit chip is restored as active.
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector(".g-feed-deskchip", { timeout: 8000 });
  await pg.waitForTimeout(600);
  const restored = await pg.evaluate(() => {
    const c = document.querySelector('.g-feed-deskchip[data-desk="c"]');
    const all = document.querySelector('.g-feed-deskchip[data-desk="all"]');
    return { creditOn: c && c.classList.contains("is-on"), allOn: all && all.classList.contains("is-on") };
  });
  check(restored.creditOn && !restored.allOn, "Home reopens on the remembered Credit filter, not All");
  checkErrs(errs, "remembered desk filter");
  await ctx.close();
}

// ---- F8: mobile remembers the News/Watchlist tab ----
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
  await pg.waitForSelector(".g-wiretab", { timeout: 8000 });
  await pg.waitForTimeout(500);
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="watch"]').click());
  await pg.waitForTimeout(200);
  const savedWatch = await pg.evaluate(() => { try { return JSON.parse(localStorage.getItem("wire.home.v1") || "{}").wire; } catch { return null; } });
  checkEq(savedWatch, "watch", "choosing Watchlist persists the wire tab");
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector(".g-wiretab", { timeout: 8000 });
  await pg.waitForTimeout(500);
  const restored = await pg.evaluate(() => ({
    watchOn: document.querySelector('.g-wiretab[data-wire="watch"]').classList.contains("is-on"),
    layoutWatch: document.querySelector(".g-layout").classList.contains("wire-watch"),
  }));
  check(restored.watchOn && restored.layoutWatch, "mobile reopens on the remembered Watchlist tab");
  checkErrs(errs, "remembered wire tab");
  await ctx.close();
}

await b.close(); srv.close();
finish();
