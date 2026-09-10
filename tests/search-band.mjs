// The shared search band shows on every page. On list pages (Profiles,
// Transactions) the search filters in place with the $1–15bn AUM button merged
// into its row. On the info pages (Home, Dashboard, Macro, Newsletters) a matching
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

// The band's search opens the shared command palette.
await pg.evaluate(() => document.querySelector('.v2-view[data-view="home"] .wire-band .wire-band-q').click());
await pg.waitForTimeout(400);
check(await pg.evaluate(() => !!document.querySelector(".mcmdk.open, .mcmdk.open .mcmdk-input")), "band search opens the command palette");
await pg.keyboard.press("Escape"); await pg.waitForTimeout(200);

// Dashboard, Macro and Newsletters carry the same band — search only, no AUM button.
for (const [key, label] of [["dashboard", "Dashboard"], ["macro", "Macro"], ["newsletters", "Newsletters"]]) {
  if (key === "macro" || key === "newsletters") { await pg.evaluate((k) => { history.pushState({ v2: true }, "", "/v2/" + k + "/"); dispatchEvent(new PopStateEvent("popstate")); }, key); await pg.waitForTimeout(1200); }
  else await tap(key);
  const st = await pg.evaluate((k) => { const v = document.querySelector(`.v2-view[data-view="${k}"]`); return { q: !!(v && v.querySelector(".wire-band .wire-band-q[data-open-search]")), aum: !!(v && v.querySelector(".wire-band .tfocus-aum, .wire-band [data-aum-jump]")) }; }, key);
  check(st.q && !st.aum, `${label}: search band present, no AUM button`);
}

checkErrs(errs, "search band");
await ctx.close();
await b.close(); srv.close();
finish();
