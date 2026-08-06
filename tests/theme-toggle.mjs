// Appearance control: the phone /menu/ Display tab exposes THREE explicit theme
// toggles — System · Light · Dark — and picking one applies + remembers it. This
// guards the reinstated 3-option control (it had regressed to a 2-way System/Other
// toggle).
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/menu/`);
await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
await pg.waitForTimeout(1200);

// Open the Display tab of the menu.
await pg.evaluate(() => { const c = document.querySelector('.na-menu-bar .tchip[data-sec="display"]'); if (c) c.click(); });
await pg.waitForTimeout(300);

const opts = await pg.evaluate(() => Array.from(document.querySelectorAll("#v2-theme-seg .na-theme-opt")).map((b) => ({ pref: b.dataset.pref, label: b.textContent.trim() })));
checkEq(opts.length, 3, "three theme toggles are present");
checkEq(opts.map((o) => o.pref).join(","), "system,light,dark", "toggles are System, Light, Dark");
checkEq(opts.map((o) => o.label).join(","), "System,Light,Dark", "toggle labels read System/Light/Dark");

async function pick(pref) {
  await pg.evaluate((p) => { const b = document.querySelector(`#v2-theme-seg .na-theme-opt[data-pref="${p}"]`); if (b) b.click(); }, pref);
  await pg.waitForTimeout(150);
  return pg.evaluate(() => ({
    theme: document.documentElement.getAttribute("data-theme"),
    choice: document.documentElement.getAttribute("data-theme-choice"),
    pref: (() => { try { return localStorage.getItem("m_theme_pref"); } catch { return null; } })(),
    onPref: (document.querySelector("#v2-theme-seg .na-theme-opt.is-on") || {}).getAttribute ? document.querySelector("#v2-theme-seg .na-theme-opt.is-on").dataset.pref : null,
  }));
}

let s = await pick("light");
checkEq(s.theme, "light", "picking Light applies the light theme");
checkEq(s.choice, "light", "picking Light records a concrete light choice");
checkEq(s.pref, "light", "picking Light persists m_theme_pref=light");
checkEq(s.onPref, "light", "Light is the marked (is-on) option");

s = await pick("dark");
checkEq(s.theme, "dark", "picking Dark applies the dark theme");
checkEq(s.choice, "dark", "picking Dark records a concrete dark choice");
checkEq(s.onPref, "dark", "Dark is the marked (is-on) option");

s = await pick("system");
checkEq(s.choice, "system", "picking System follows the OS (choice=system)");
checkEq(s.onPref, "system", "System is the marked (is-on) option");

checkErrs(errs, "theme toggle");
await ctx.close();
await b.close(); srv.close();
finish();
