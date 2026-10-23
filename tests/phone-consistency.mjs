// R2d — iPhone consistency: ONE page gutter (--m-gutter, 12px) between the screen edge
// and text on every phone page; tab/lane bars fit the screen with no label clipped or
// wrapped; the light theme's "news" slate is readable (not the dark-theme tint).
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve({
  "/api/13f": () => [200, JSON.stringify({ asOf: "2026-06-30", source: "https://www.sec.gov/x", holdings: [] })],
  "/api/filings": () => [200, JSON.stringify({ filings: [] })],
  "/api/perf": () => [200, JSON.stringify({ perf: {} })],
});
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const G = 12;
const leftOf = (pg, sel, inner) => pg.evaluate(([s, inner]) => {
  const e = [...document.querySelectorAll(s)].find((x) => x.getClientRects().length && x.getBoundingClientRect().width > 0);
  if (!e) return null;
  if (inner === "lead") return Math.round(e.getBoundingClientRect().left + parseFloat(getComputedStyle(e).paddingLeft) + parseFloat(getComputedStyle(e, "::before").marginLeft));
  if (!inner) return Math.round(e.getBoundingClientRect().left);
  return Math.round(e.getBoundingClientRect().left + parseFloat(getComputedStyle(e).paddingLeft));
}, [sel, inner]);

const PAGES = [
  ["News feed row", "/v2/news/", ".g-feed-row", true, null],
  // The row now leads with the entity type (owner 2026-10-15) — that leading label sits on
  // the gutter (measured below as row padding + the ::before's negative margin).
  ["Profiles list lead", "/v2/profiles/#/?tab=managers", "#mgr-rows tr[data-lead]", "lead", null],
  ["Profile page header", "/v2/profiles/#/manager/m21", "#pf-detail .tdet-id", true, null],
  ["Profile news row", "/v2/profiles/#/manager/m21", "#pf-detail .twire .compact-item", true, null],
  ["Transactions card", "/v2/transactions/#/lending", "#tx-body .tx-card", true, null],
  ["Deal card body", "/v2/transactions/#/lending", ".tx-drawer-b", true, async (pg) => { await pg.evaluate(() => document.querySelector("#tx-body [data-deal]").click()); await pg.waitForTimeout(800); }],
  ["Dashboard card edge", "/v2/dashboard/credit", ".dsh-card", false, null],
];
for (const [label, url, sel, inner, act] of PAGES) {
  const { ctx, pg, errs } = await open(b, PHONE, base + url);
  await pg.waitForTimeout(1800);
  if (act) await act(pg);
  const x = await leftOf(pg, sel, inner);
  check(x === G, `phone: ${label} sits on the ${G}px page gutter (got ${x})`);
  checkErrs(errs, label);
  await ctx.close();
}

// News lanes (owner 2026-10-16): the USUAL heading-row spacing (chips 0 12px, labels never
// squeezed) and the row scrolls sideways only; a tapped lane scrolls into view.
{
  const { ctx, pg } = await open(b, PHONE, base + "/v2/news/");
  await pg.waitForSelector("#g-wire-lanechips .g-wire-lane", { timeout: 10000 });
  await pg.waitForTimeout(600);
  const r = await pg.evaluate(() => {
    const row = document.querySelector("#g-wire-lanechips"), chips = [...row.querySelectorAll(".g-wire-lane")];
    const cs = getComputedStyle(row);
    return { n: chips.length, pads: [...new Set(chips.map((c) => getComputedStyle(c).paddingLeft + "/" + getComputedStyle(c).paddingRight))], oneLine: chips.every((c) => c.scrollWidth <= c.clientWidth + 1 && c.getBoundingClientRect().height < 40),
      scrolls: row.scrollWidth > row.clientWidth, ox: cs.overflowX, oy: cs.overflowY, pageW: document.documentElement.scrollWidth };
  });
  check(r.n === 5 && r.pads.length === 1 && r.pads[0] === "12px/12px", `phone: five News lanes (Newsletters folded into News, 2026-10-23) at the usual 0 12px chip spacing (${r.pads.join(", ")})`);
  check(r.oneLine, "phone: no lane label is squeezed or wrapped");
  // Five lanes may now fit a 390px phone; the row still scrolls sideways if they don't, and never the page.
check(r.ox === "auto" && r.oy === "hidden" && r.pageW <= 390, `phone: the lane row scrolls sideways only (when needed), the page does not (overflow ${r.ox}/${r.oy}, page ${r.pageW}px, row scrolls: ${r.scrolls})`);
  await pg.evaluate(() => [...document.querySelectorAll("#g-wire-lanechips .g-wire-lane")].find((c) => c.textContent.trim() === "Research").click());
  await pg.waitForTimeout(400);
  const seen = await pg.evaluate(() => { const row = document.querySelector("#g-wire-lanechips"), on = row.querySelector(".g-wire-lane.is-on"); const a = row.getBoundingClientRect(), c = on.getBoundingClientRect(); return { lbl: on.textContent.trim(), inView: c.left >= a.left - 1 && c.right <= a.right + 1 }; });
  check(seen.lbl === "Research" && seen.inView, `phone: the tapped lane (${seen.lbl}) scrolls into view`);
  await ctx.close();
}
{
  const { ctx, pg } = await open(b, PHONE, base + "/v2/profiles/#/manager/m21");
  await pg.waitForTimeout(1800);
  // Lines of text per tab label (a wrapped "Investments 46" reads 2).
  const hs = await pg.evaluate(() => [...document.querySelectorAll("#mgr-tabs .tchip")].filter((t) => t.offsetParent).map((t) => { const r = document.createRange(); r.selectNodeContents(t); return new Set([...r.getClientRects()].map((c) => Math.round(c.top))).size; }));
  check(hs.length >= 4 && hs.every((n) => n === 1), `phone: every profile sub-tab label is on one line (${hs.join(",")})`);
  await ctx.close();
}
// One money format across the Profiles lists (no "$227.60bn" padded zeros next to "$14bn"),
// and the hedge-fund Performance line never repeats its as-of year ("in 2025 2025").
{
  const { ctx, pg } = await open(b, PHONE, base + "/v2/profiles/#/?tab=hedgefunds");
  await pg.waitForTimeout(1800);
  const figs = [];
  for (const tab of ["managers", "hedgefunds", "investors", "firms"]) {
    await pg.evaluate((t) => { location.hash = "#/?tab=" + t; }, tab); await pg.waitForTimeout(700);
    figs.push(...await pg.evaluate(() => [...document.querySelectorAll("#pf-panes td.pf-c-main, #pf-panes td.tl-aum")].filter((e) => e.offsetParent).slice(0, 12).map((e) => e.textContent.trim())));
  }
  const bad = figs.filter((t) => /\.\d*0(bn|tn)$/.test(t) || /\d{3,}\.\d+bn$/.test(t));
  check(figs.length > 20 && bad.length === 0, `phone: list money uses one 3-sig-fig format (${bad.slice(0, 4).join(", ") || figs.slice(0, 4).join(", ")})`);
  await pg.evaluate(() => { location.hash = "#/hf/h1"; }); await pg.waitForTimeout(900);
  const perf = await pg.evaluate(() => ([...document.querySelectorAll("#pf-detail .tdet-desc")].map((e) => e.textContent).find((t) => /^Performance/.test(t)) || ""));
  check(perf && !/\b(\d{4})\s+\1\b/.test(perf), `phone: hedge-fund Performance line has no repeated year (${perf.slice(0, 60)})`);
  await ctx.close();
}
// Light theme: the "news" slate is the darker light-theme value, not the dark-theme tint.
{
  const { ctx, pg } = await open(b, PHONE, base + "/v2/news/");
  await pg.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await pg.waitForTimeout(1500);
  const v = await pg.evaluate(() => getComputedStyle(document.querySelector(".tui") || document.body).getPropertyValue("--t-news").trim());
  check(v === "#4f6690", `phone/light: --t-news is the readable light slate (${v})`);
  await ctx.close();
}
await b.close(); srv.close();
finish();
