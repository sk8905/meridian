// HOUSE_STYLE R43 — one professional list & table style, everywhere (owner 2026-10-15).
// Loads every live v2 surface at the desk widths the owner named — laptop 1366×768,
// desk monitor 1920×1080, ultrawide 2560×1440 and 3440×1440 — and asserts, via the
// shared probe (tests/fixtures/r43-probe.mjs):
//   • every events row / events table leads with its date (the wire: its time) and ends
//     with its source; status tags sit beside the name;
//   • no events item runs past two lines, and each list keeps ONE row height;
//   • no bold outside headings, navigation tabs / chips and "Open original at …";
//   • text colours resolve only to ink / mut / faint (+ up / down / accent / link and the
//     eight domain-label tokens);
//   • no table column narrower than its longest single word, no table cell overflowing;
//   • no horizontal page scroll — and no page errors.
// iPhone (390×844, light AND dark) is tests/style-r43-phone.mjs.
import { serve, launchChromium, check, checkEq, finish } from "./lib.mjs";
import { SURFACES, settle, r43Probe } from "./fixtures/r43-probe.mjs";

// Every surface at 1920; the other desk widths walk a representative set (one per
// layout family) so the spec stays inside the runner's time budget.
const SAMPLE = new Set(["Home", "Markets Credit", "Markets Legal", "Deals Lending", "Deals Fundraising", "Restructuring", "Profiles Managers", "Manager profile", "Firm profile", "Menu Digest"]);
const WIDTHS = [[1920, 1080, null], [1366, 768, SAMPLE], [2560, 1440, SAMPLE], [3440, 1440, SAMPLE]];

// R43_ONLY=<regex> narrows the walk to matching surfaces (a development aid).
const ONLY = process.env.R43_ONLY ? new RegExp(process.env.R43_ONLY) : null;
const srv = await serve();
const b = await launchChromium();
for (const [w, h, only] of WIDTHS) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: "dark" });
  const pg = await ctx.newPage();
  const errs = []; pg.on("pageerror", (e) => errs.push(String(e.message).slice(0, 140)));
  for (const [name, url, chip] of SURFACES) {
    if (ONLY && !ONLY.test(name)) continue;
    if (only && !only.has(name)) continue;
    await pg.goto(`http://localhost:${srv.port}${url}`, { waitUntil: "load" });
    try { await settle(pg, chip); } catch (e) { check(false, `${w}px ${name}: surface settles (${String(e.message).slice(0, 80)})`); continue; }
    const bad = await pg.evaluate(r43Probe);
    checkEq(bad.slice(0, 8).join(" | "), "", `${w}px ${name}: R43 list & table style`);
  }
  // Header panels: Ask Wire, Watchlist, Markets (desktop), Notifications — and the search palette.
  if (w === 1920 && (!ONLY || ONLY.test("panels"))) {
    await pg.goto(`http://localhost:${srv.port}/v2/`, { waitUntil: "load" });
    await settle(pg);
    for (const id of ["na-ask", "na-watch", "na-mkt", "na-notif"]) {
      const btn = await pg.$(`#${id}`); if (!btn || !(await btn.isVisible())) continue;
      await btn.click();
      await pg.waitForFunction(() => [...document.querySelectorAll(".na-panel")].some((p) => p.offsetParent !== null && p.textContent.trim().length > 10), null, { timeout: 8000 }).catch(() => {});
      const bad = await pg.evaluate(r43Probe);
      checkEq(bad.slice(0, 8).join(" | "), "", `${w}px panel ${id}`);
      await pg.keyboard.press("Escape");
      await pg.evaluate(() => new Promise((r) => requestAnimationFrame(r)));
    }
    await pg.keyboard.press("/");
    await pg.waitForFunction(() => !!document.querySelector(".cmdk, .mcmdk, [class*='cmdk']"), null, { timeout: 8000 }).catch(() => {});
    await pg.keyboard.type("ares");
    await pg.evaluate(() => new Promise((r) => setTimeout(r, 300)));
    const bad = await pg.evaluate(r43Probe);
    checkEq(bad.slice(0, 8).join(" | "), "", `${w}px search palette`);
  }
  check(errs.length === 0, `${w}px: no page errors${errs.length ? " — " + errs.slice(0, 2).join(" | ") : ""}`);
  await ctx.close();
}
await b.close(); srv.close();
finish();
