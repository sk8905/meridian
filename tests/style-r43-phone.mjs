// HOUSE_STYLE R43 on iPhone (390×844, touch) in BOTH themes — the same probe as
// tests/style-r43.mjs: events rows date-first / source-last and never past two lines
// (iPhone included — never wrap further), one row height per list, no bold outside
// headings / tabs / "Open original", three text tiers only, even table columns, no
// sideways page scroll.
import { serve, launchChromium, PHONE, check, checkEq, finish } from "./lib.mjs";
import { SURFACES, settle, r43Probe } from "./fixtures/r43-probe.mjs";

const LIGHT = new Set(["Home", "Markets Credit", "Markets Hedge", "Deals Lending", "Restructuring", "Profiles Managers", "Manager profile", "Menu Digest"]);
// R43_ONLY=<regex> narrows the walk to matching surfaces (a development aid).
const ONLY = process.env.R43_ONLY ? new RegExp(process.env.R43_ONLY) : null;
const srv = await serve();
const b = await launchChromium();
for (const theme of ["dark", "light"]) {
  const ctx = await b.newContext({ ...PHONE, colorScheme: theme });
  await ctx.addInitScript((t) => { try { localStorage.setItem("m_theme_pref", t); } catch { /* */ } }, theme);
  const pg = await ctx.newPage();
  const errs = []; pg.on("pageerror", (e) => errs.push(String(e.message).slice(0, 140)));
  for (const [name, url, chip] of SURFACES) {
    if (ONLY && !ONLY.test(name)) continue;
    if (theme === "light" && !LIGHT.has(name)) continue;
    await pg.goto(`http://localhost:${srv.port}${url}`, { waitUntil: "load" });
    try { await settle(pg, chip); } catch (e) { check(false, `phone ${theme} ${name}: surface settles (${String(e.message).slice(0, 80)})`); continue; }
    const bad = await pg.evaluate(r43Probe);
    checkEq(bad.slice(0, 8).join(" | "), "", `phone ${theme} ${name}: R43 list & table style`);
  }
  // Header panels: Ask Wire, Watchlist, Markets (desktop), Notifications — and the search palette.
  if (theme === "dark" && (!ONLY || ONLY.test("panels"))) {
    await pg.goto(`http://localhost:${srv.port}/v2/`, { waitUntil: "load" });
    await settle(pg);
    for (const id of ["na-ask", "na-mkt", "na-notif"]) {
      const btn = await pg.$(`#${id}`); if (!btn || !(await btn.isVisible())) continue;
      await btn.click();
      await pg.waitForFunction(() => [...document.querySelectorAll(".na-panel")].some((p) => p.offsetParent !== null && p.textContent.trim().length > 10), null, { timeout: 8000 }).catch(() => {});
      const bad = await pg.evaluate(r43Probe);
      checkEq(bad.slice(0, 8).join(" | "), "", `phone ${theme} panel ${id}`);
      await pg.keyboard.press("Escape");
      await pg.evaluate(() => new Promise((r) => requestAnimationFrame(r)));
    }
    await pg.keyboard.press("/");
    await pg.waitForFunction(() => !!document.querySelector(".cmdk, .mcmdk, [class*='cmdk']"), null, { timeout: 8000 }).catch(() => {});
    await pg.keyboard.type("ares");
    await pg.waitForFunction(() => document.querySelectorAll(".mcmdk-row").length > 0, null, { timeout: 8000 }).catch(() => {});
    const bad = await pg.evaluate(r43Probe);
    checkEq(bad.slice(0, 8).join(" | "), "", `phone ${theme} search palette`);
  }
  check(errs.length === 0, `phone ${theme}: no page errors${errs.length ? " — " + errs.slice(0, 2).join(" | ") : ""}`);
  await ctx.close();
}
await b.close(); srv.close();
finish();
