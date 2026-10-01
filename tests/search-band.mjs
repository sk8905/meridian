// The shared search band shows on every page. On list pages (Profiles,
// Transactions) the search filters in place with the $1–15bn AUM button merged
// into its row. On the info pages (Home, Dashboard, Macro) a matching
// band opens the global command palette — and carries NO AUM button (there is no
// AUM list to filter there).
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

// Home (default view): a search band that opens the palette, and NO AUM button.
const home = await pg.evaluate(() => {
  const v = document.querySelector('.v2-view[data-view="home"]');
  return { q: !!v.querySelector(".wire-band .wire-band-q[data-open-search]"), aum: !!v.querySelector(".wire-band [data-aum-jump], .wire-band .tfocus-aum") };
});
check(home.q, "Home: search band present (opens the command palette)");
check(!home.aum, "Home: no AUM button in the band (nothing to filter here)");

// LAZY: the palette (and the ~1.5MB archive it imports) is NOT mounted on boot — the
// overlay only exists once search is first opened (chrome.js setupLazyPalette).
check(await pg.evaluate(() => !document.getElementById("mcmdk")), "palette is not mounted on page load (lazy — loads on first search)");

// The band's search opens the shared command palette — now LAZY-loaded on first use
// (chrome.js setupLazyPalette), so the overlay appears after the dynamic import; wait
// for it rather than a fixed delay.
await pg.evaluate(() => document.querySelector('.v2-view[data-view="home"] .wire-band .wire-band-q').click());
await pg.waitForSelector(".mcmdk.open", { timeout: 8000 });
check(await pg.evaluate(() => !!document.querySelector(".mcmdk.open .mcmdk-input")), "band search opens the command palette (lazy-loaded on first use)");
await pg.keyboard.press("Escape"); await pg.waitForTimeout(200);

// The standalone Macro surface carries the shared palette band — search only, no AUM
// button. (Newsletters is retired — newsletters live in the Home feed.)
for (const [key, label] of [["macro", "Macro"]]) {
  await pg.evaluate((k) => { history.pushState({ v2: true }, "", "/v2/" + k + "/"); dispatchEvent(new PopStateEvent("popstate")); }, key); await pg.waitForTimeout(1200);
  const st = await pg.evaluate((k) => { const v = document.querySelector(`.v2-view[data-view="${k}"]`); return { q: !!(v && v.querySelector(".wire-band .wire-band-q[data-open-search]")), aum: !!(v && v.querySelector(".wire-band .tfocus-aum, .wire-band [data-aum-jump]")) }; }, key);
  check(st.q && !st.aum, `${label}: search band present, no AUM button`);
}

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
