// HOUSE_STYLE R44 (owner 2026-10-15): (a) Deals and Profiles open on an "All" tab, the
// first chip; (b) Deals carries no default filter (all regions); (c) every selected chip
// marker is ONE underline layer, never a double line; (d) every in-page back control
// returns to the page you were on immediately before — the Profiles ‹ chevron and the
// deal drawer ‹ step back through in-app history, a cold deep link falls back to the list.
import { serve, launchChromium, open, DESKTOP, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const visible = (sel) => `[...document.querySelectorAll(${JSON.stringify(sel)})].some((e) => e.offsetParent !== null)`;

// (a)(b) defaults.
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `${base}/v2/transactions/`);
  await pg.waitForSelector("#tx-mode .tchip.is-on", { timeout: 10000 });
  const d = await pg.evaluate(() => ({ chips: [...document.querySelectorAll("#tx-mode .tchip")].map((c) => c.textContent.trim()), on: document.querySelector("#tx-mode .tchip.is-on").textContent.trim(),
    scope: (document.querySelector("#tx-scope") || {}).textContent || "", hash: location.hash, types: new Set([...document.querySelectorAll("#tx-body td.txc-type")].map((t) => t.textContent.split(" · ")[0])).size }));
  checkEq(d.chips[0], "All", "Deals: All is the first chip");
  checkEq(d.on, "All", "Deals: All is the default tab");
  check(d.types >= 2, `Deals ▸ All lists deals from several modes (${d.types} modes in the Type column)`);
  checkEq(d.scope.trim(), "All regions", "Deals: no default region filter (the scope button reads All regions)");
  await pg.goto(`${base}/v2/transactions/#/league`); await pg.waitForSelector("#tx-lg-reg", { timeout: 8000 });
  checkEq(await pg.evaluate(() => document.querySelector("#tx-lg-reg").value), "all", "League tables: all regions by default");
  // (c) one underline layer on every selected chip / toggle.
  await pg.goto(`${base}/v2/transactions/#/lending?scope=eu`); await pg.waitForSelector("#tx-scope.is-on", { timeout: 8000 });
  const shadows = await pg.evaluate(() => [...document.querySelectorAll(".is-on, .on")].filter((e) => e.offsetParent !== null).map((e) => getComputedStyle(e).boxShadow).filter((s) => s && s !== "none"));
  check(shadows.length > 0 && shadows.every((s) => (s.match(/rgba?\(/g) || []).length === 1), `every selected marker is ONE layer, never a double underline (${[...new Set(shadows)].join(" | ")})`);
  checkErrs(errs, "deals defaults");
  await ctx.close();
}
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `${base}/v2/profiles/`);
  await pg.waitForSelector("#pf-chips .tchip.is-on", { timeout: 10000 });
  await pg.waitForFunction(() => document.querySelectorAll("#all-rows tr").length > 100, null, { timeout: 10000 });
  const p = await pg.evaluate(() => ({ first: document.querySelector("#pf-chips .tchip").textContent.trim(), on: document.querySelector("#pf-chips .tchip.is-on").textContent.trim(),
    kinds: new Set([...document.querySelectorAll("#all-rows tr")].map((tr) => tr.dataset.fType)).size }));
  checkEq(p.first, "All", "Profiles: All is the first chip");
  checkEq(p.on, "All", "Profiles: All is the default list");
  checkEq(p.kinds, 4, "Profiles ▸ All holds managers, hedge funds, investors and law firms");
  // A row opens that entity's profile.
  await pg.fill("#all-q", "clifford chance"); await pg.waitForFunction(() => [...document.querySelectorAll("#all-rows tr")].filter((t) => t.style.display !== "none").length >= 1, null, { timeout: 5000 });
  await pg.evaluate(() => [...document.querySelectorAll("#all-rows tr")].find((t) => t.style.display !== "none").click());
  await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 8000 });
  check(/#\/firm\//.test(await pg.evaluate(() => location.hash)), "an All row opens the entity's own profile");
  checkErrs(errs, "profiles all");
  await ctx.close();
}

// (d) Back returns to the page you were on immediately before.
for (const [name, dev] of [["desktop", DESKTOP], ["phone", PHONE]]) {
  const { ctx, pg, errs } = await open(b, dev, `${base}/v2/restructuring/`);
  await pg.waitForSelector("#rxh-deals .dsh-news-i > a", { timeout: 15000 });
  // Hub deal → Deals drawer → ‹ → back on the hub (not the Deals list).
  await pg.evaluate(() => document.querySelector("#rxh-deals .dsh-news-i > a").click());
  await pg.waitForFunction(() => /\/transactions\//.test(location.pathname) && !!document.querySelector("#tx-drawer:not([hidden])"), null, { timeout: 10000 });
  await pg.click("#tx-drawer .tx-drawer-x");
  await pg.waitForFunction(() => /\/v2\/restructuring\/?$/.test(location.pathname), null, { timeout: 8000 }).catch(() => {});
  checkEq(await pg.evaluate(() => location.pathname), "/v2/restructuring/", `${name}: the deal drawer's ‹ returns to the hub it was opened from`);
  // Hub borrower → Profiles borrower page → ‹ → back on the hub.
  await pg.waitForSelector("#rxh-plans a.rxh-co", { timeout: 8000 });
  await pg.evaluate(() => document.querySelector("#rxh-plans a.rxh-co").click());
  await pg.waitForFunction(() => /\/profiles\//.test(location.pathname) && !!document.querySelector("#pf-detail [data-borrower]"), null, { timeout: 10000 });
  await pg.waitForFunction(new Function(`return ${visible(".pf-back-chev")};`), null, { timeout: 5000 });
  await pg.evaluate(() => [...document.querySelectorAll(".pf-back-chev")].find((e) => e.offsetParent !== null).click());
  await pg.waitForFunction(() => /\/v2\/restructuring\/?$/.test(location.pathname), null, { timeout: 8000 }).catch(() => {});
  checkEq(await pg.evaluate(() => location.pathname), "/v2/restructuring/", `${name}: the Profiles ‹ returns to the hub it was opened from`);
  checkErrs(errs, `back ${name}`);
  await ctx.close();
}
// A cold deep link (no in-app history) — ‹ falls back to the list.
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `${base}/v2/profiles/#/manager/m20`);
  await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 10000 });
  await pg.evaluate(() => [...document.querySelectorAll(".pf-back-chev")].find((e) => e.offsetParent !== null).click());
  await pg.waitForFunction(() => !document.querySelector(".pf-detailing"), null, { timeout: 8000 }).catch(() => {});
  check(await pg.evaluate(() => !document.querySelector(".pf-detailing") && location.pathname === "/v2/profiles/"), "a cold deep link: ‹ falls back to the Profiles list");
  checkErrs(errs, "back cold");
  await ctx.close();
}
await b.close(); srv.close();
finish();
