// The shared search band. On list pages (Profiles, Transactions) the search
// filters in place with the $1–15bn AUM button merged into its row. On the info
// pages the band opens the global command palette — and carries NO AUM button
// (there is no AUM list to filter there). On PHONES the Home band is hidden and
// search moves to a magnifier in the fixed header (reclaiming a body row); the
// band markup stays for desktop. Both the (hidden) band and the header magnifier
// open the same lazy-loaded command palette.
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
await pg.waitForTimeout(1500);

const cdp = await ctx.newCDPSession(pg);
const tap = async (key) => {
  const p = await pg.evaluate((k) => { const t = document.querySelector(`.mobile-tabbar .mtab[data-key="${k}"]`); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, key);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: p.x, y: p.y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await pg.waitForTimeout(1300);
};

// Home (default view): the band markup exists (opens the palette) and carries NO
// AUM button, but on PHONES it is hidden — search lives in the header magnifier.
const home = await pg.evaluate(() => {
  const v = document.querySelector('.v2-view[data-view="home"]');
  const band = v.querySelector(".wire-band");
  return {
    q: !!v.querySelector(".wire-band .wire-band-q[data-open-search]"),
    aum: !!v.querySelector(".wire-band [data-aum-jump], .wire-band .tfocus-aum"),
    bandHidden: !!band && getComputedStyle(band).display === "none",
    mag: !!document.querySelector("#na-search[data-open-search]"),
  };
});
check(home.q, "Home: search band markup present (opens the command palette)");
check(!home.aum, "Home: no AUM button in the band (nothing to filter here)");
check(home.bandHidden, "Home (phone): the full-width band is hidden — search moved to the header");
check(home.mag, "Home (phone): a magnifier search button sits in the header (data-open-search)");

// LAZY: the palette (and the ~1.5MB archive it imports) is NOT mounted on boot — the
// overlay only exists once search is first opened (chrome.js setupLazyPalette).
check(await pg.evaluate(() => !document.getElementById("mcmdk")), "palette is not mounted on page load (lazy — loads on first search)");

// The header magnifier opens the shared command palette — LAZY-loaded on first use
// (chrome.js setupLazyPalette), so the overlay appears after the dynamic import; wait
// for it rather than a fixed delay.
await pg.evaluate(() => document.querySelector("#na-search").click());
await pg.waitForSelector(".mcmdk.open", { timeout: 8000 });
check(await pg.evaluate(() => !!document.querySelector(".mcmdk.open .mcmdk-input")), "the header magnifier opens the command palette (lazy-loaded on first use)");
await pg.keyboard.press("Escape"); await pg.waitForTimeout(200);

// (The standalone Macro/Credit/Legal desk surfaces are retired — the search band lives
// on Home, tested above; Macro redirects to the Dashboard.)

// The DASHBOARD carries NO search bar — neither the global palette band above the
// chips nor a per-section search beneath them (both removed).
await tap("dashboard");
await pg.waitForTimeout(500);
const dsh = await pg.evaluate(() => {
  const v = document.querySelector('.v2-view[data-view="dashboard"]');
  return { noBand: !(v && v.querySelector(".wire-band")), noSearch: !(v && v.querySelector(".dsh-search, .dsh-q")) };
});
check(dsh.noBand, "Dashboard: the global palette band above the chips is gone");
check(dsh.noSearch, "Dashboard: no search bar (the per-section search is removed)");

checkErrs(errs, "search band");
await ctx.close();
await b.close(); srv.close();
finish();
