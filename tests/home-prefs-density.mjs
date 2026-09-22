// F7 — density is fixed at the compact default; the user-facing Density toggle
// was removed from Settings (along with the Account section — Sign out lives in
// the phone bottom strip). Settings keeps only Notifications + Appearance (Theme).
// F8 — Home remembers the last wire desk filter and the mobile News/Watchlist
// tab, so it reopens where you left it.
import { serve, launchChromium, open, DESKTOP, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// ---- F7: density is the compact default; Density + Account controls removed ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/menu/");
  await pg.waitForSelector('.v2-view[data-view="menu"] .na-menu-bar .tchip', { timeout: 8000 });
  // Density stays at the compact default (no user control to change it).
  const def = await pg.evaluate(() => ({
    attr: document.documentElement.getAttribute("data-density"),
    chip: getComputedStyle(document.documentElement).getPropertyValue("--chip-h").trim(),
  }));
  checkEq(def.attr, "compact", "default density is compact");
  checkEq(def.chip, "34px", "compact --chip-h is 34px");

  // Open Settings — it must NOT carry a Density control or an Account section any
  // more, but must keep Theme + Notifications.
  await pg.evaluate(() => [...document.querySelectorAll('.v2-view[data-view="menu"] .na-menu-bar .tchip')].find((c) => c.textContent.trim() === "Settings")?.click());
  await pg.waitForTimeout(200);
  const pane = await pg.evaluate(() => {
    const p = document.querySelector('.v2-view[data-view="menu"] .na-menu-pane');
    return {
      densitySeg: !!document.getElementById("v2-density-seg"),
      densityLabel: /Density/i.test(p?.textContent || ""),
      account: /Account/i.test(p?.textContent || ""),
      acctRow: !!document.getElementById("account-nav-menu"),
      theme: !!document.getElementById("v2-theme-seg"),
      push: !!document.getElementById("v2-push"),
    };
  });
  check(!pane.densitySeg && !pane.densityLabel, "Settings has NO Density control");
  check(!pane.account && !pane.acctRow, "Settings has NO Account section");
  check(pane.theme && pane.push, "Settings keeps Theme + Notifications controls");
  checkErrs(errs, "settings pane");
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

// ---- F8: mobile remembers the chosen wire LANE (dropdown) ----
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
  await pg.evaluate(() => { try { localStorage.removeItem("wire.home.v1"); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector(".g-wiretab-lane", { timeout: 8000 });
  await pg.waitForTimeout(400);
  await pg.evaluate(() => document.querySelector(".g-wiretab-lane").click());
  await pg.waitForTimeout(120);
  await pg.evaluate(() => [...document.querySelectorAll("#g-wire-lanemenu .tchip-menu-item")].find((i) => i.textContent.trim() === "Manager").click());
  await pg.waitForTimeout(200);
  const savedLane = await pg.evaluate(() => { try { return JSON.parse(localStorage.getItem("wire.home.v1") || "{}").wireLane; } catch { return null; } });
  checkEq(savedLane, "manager", "choosing a lane persists it (wireLane)");
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-feed .g-mw-fev", { timeout: 8000 });
  await pg.waitForTimeout(300);
  const restored = await pg.evaluate(() => ({
    lbl: (document.querySelector(".g-wiretab-lane .g-wire-lanelbl") || {}).textContent || "",
    rows: document.querySelectorAll("#g-feed .g-mw-fev").length,
  }));
  check(restored.lbl === "Manager" && restored.rows > 0, `mobile reopens on the remembered lane (${restored.lbl}, ${restored.rows} rows)`);
  checkErrs(errs, "remembered wire lane");
  await ctx.close();
}

await b.close(); srv.close();
finish();
