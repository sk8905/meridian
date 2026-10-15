// Manager page "at a glance" (owner review R8) + currency honesty (R4) + the "Firm facts"
// rename (R3). The manager profile opens with a fact strip — AUM in its native currency
// with USD in brackets (+ as-of and a source), strategies, HQ, the latest fund and its
// status, deals in the last 90 days (the most recent linked), top LPs (commitments),
// advisers and key people — built only from the record; a fact with no data is omitted.
// Phone: a compact 2-column grid. Desktop: one dense strip. News stays its own tab.
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

async function openProfile(dev, hash) {
  const { ctx, pg, errs } = await open(b, dev, base + "/v2/");
  await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
  await pg.goto(base + "/v2/profiles/" + hash, { waitUntil: "load" });
  await pg.waitForSelector("#pf-detail .tdet-id h1", { timeout: 20000 });
  await pg.waitForTimeout(400);
  return { ctx, pg, errs };
}
const glanceOf = (pg) => pg.evaluate(() => {
  const g = document.querySelector("#pf-detail .mgr-glance");
  if (!g) return null;
  const facts = [...g.querySelectorAll(".mg-f")].map((f) => ({ k: f.querySelector(".mg-k").textContent.trim(), v: f.querySelector(".mg-v").textContent.trim(), m: (f.querySelector(".mg-m") || {}).textContent || "", top: Math.round(f.getBoundingClientRect().top) }));
  const sec = g.parentElement;
  const kids = [...sec.children];
  return {
    facts,
    afterId: kids.indexOf(g) === kids.indexOf(sec.querySelector(":scope > .tdet-id")) + 1,
    beforeTabs: kids.indexOf(g) < kids.indexOf(sec.querySelector(":scope > .twire-head")),
    cols: getComputedStyle(g).gridTemplateColumns.split(" ").filter(Boolean).length,
    h: Math.round(g.getBoundingClientRect().height),
    overflow: g.scrollWidth > g.clientWidth + 1,
    links: [...g.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
    tabs: [...document.querySelectorAll("#mgr-tabs .tchip")].map((c) => [c.dataset.p, c.textContent.trim()]),
    onTab: (document.querySelector("#mgr-tabs .tchip.is-on") || {}).dataset?.p,
  };
});

// ---- Phone: Tikehau (m3) — a €-restated manager with funds, deals and advisers -------
{
  const { ctx, pg, errs } = await openProfile(PHONE, "#/manager/m3");
  const g = await glanceOf(pg);
  check(!!g, "phone: the manager page renders an at-a-glance strip");
  check(g.afterId && g.beforeTabs, "the strip sits at the TOP — under the identity header, above the section tabs");
  check(g.cols === 2, `phone: compact 2-column fact grid (${g.cols} columns)`);
  const k = g.facts.map((f) => f.k.toUpperCase());
  for (const want of ["AUM", "HQ", "STRATEGIES", "LATEST FUND", "DEALS · 90D", "ADVISERS"]) check(k.includes(want), `fact: ${want}`);
  check(g.facts.every((f) => f.v && f.v !== "—"), "no fact renders as an empty placeholder");
  // AUM: native with the USD equivalent in brackets, computed from the record + AUM_FX.
  const want = await pg.evaluate(async () => {
    const D = await import("/credit/js/data.js"); const S = await import("/credit/js/shared.js");
    const m = D.managerById.m3, f = m.aumTotal != null ? "aumTotal" : "aum";
    return { group: S.fmtAumDual(m, f), credit: m.aumCredit != null ? S.fmtAumDual(m, "aumCredit") : "", from: (m.aumFrom || {})[f] };
  });
  const aum = g.facts.find((f) => f.k.toUpperCase() === "AUM");
  check(want.from === "EUR" && /^€[\d.]+bn \(\$[\d.]+bn\)$/.test(want.group) && aum.v.includes(want.group), `AUM reads native + (USD): ${aum.v}`);
  check(!want.credit || aum.v.includes(want.credit), "credit AUM shown the same way");
  check(/as of/i.test(aum.m) && /src/i.test(aum.m), `AUM carries its as-of date and a source (${aum.m.trim()})`);
  check(g.links.some((h) => /^https?:/.test(h)), "the AUM source links out");
  // Deals in the last 90 days: count from the record; the most recent link into Transactions.
  const deals = g.facts.find((f) => f.k.toUpperCase() === "DEALS · 90D");
  const n90 = await pg.evaluate(async () => {
    const D = await import("/credit/js/data.js"); const S = await import("/credit/js/shared.js");
    const fids = new Set(D.funds.filter((f) => f.managerId === "m3").map((f) => f.id)), seen = new Set();
    return D.deals.filter((d) => (d.managerId === "m3" || (d.fundId && fids.has(d.fundId))) && d.date && Date.parse(d.date) >= Date.now() - 90 * 864e5 && Date.parse(d.date) <= Date.now() + 864e5)
      .filter((d) => { const k = S.feedDedupKey(d); if (seen.has(k)) return false; seen.add(k); return true; }).length;
  });
  check(new RegExp("^" + n90 + "\\b").test(deals.v), `deals in 90 days = ${n90} (${deals.v})`);
  const dealLinks = g.links.filter((h) => /^\/v2\/transactions\/#\/deal\//.test(h)).length;
  check(dealLinks === Math.min(3, n90), `the ${Math.min(3, n90)} most recent deals are linked (${dealLinks})`);
  check(g.links.some((h) => /^#\/firm\//.test(h)), "advisers link to their law-firm profiles");
  // R3 rename: the old "Business" tab is "Firm facts" (key kept so old links land).
  check(g.tabs.some(([p, l]) => p === "business" && l === "Firm facts") && !g.tabs.some(([, l]) => l === "Business"), `"Business" is renamed "Firm facts" (${g.tabs.map((t) => t[1]).join(" · ")})`);
  check(g.onTab === "news", "News stays its own (default) tab");
  // The header no longer repeats the AUM / strategy chips the strip carries.
  check(await pg.evaluate(() => !document.querySelector("#pf-detail .tdet-id .tdet-aum") && !document.querySelector("#pf-detail .tdet-id .tdet-chips")), "the identity header doesn't duplicate the strip's AUM / strategies");
  // Latest fund opens that fund in Vehicles.
  await pg.click("#pf-detail .mgr-glance [data-openfund]"); await pg.waitForTimeout(300);
  const fo = await pg.evaluate(() => ({ tab: (document.querySelector("#mgr-tabs .tchip.is-on") || {}).dataset?.p, open: !!document.querySelector("#mgr-panes li.fund-exp.is-open .fund-body:not([hidden])") }));
  check(fo.tab === "vehicles" && fo.open, "tapping the latest fund opens it in Vehicles");
  // Fund sizes: native with USD in brackets for a € fund.
  const fund = await pg.evaluate(() => [...document.querySelectorAll("#mgr-panes .fund-exp .tmini-r")].map((e) => e.textContent.trim()).find((t) => /^€/.test(t)) || "");
  check(/^€[\d.]+(?:m|bn) \(\$[\d.]+(?:m|bn)\)/.test(fund), `€ fund sizes show USD in brackets (${fund})`);
  checkErrs(errs, "manager glance (phone)");
  await ctx.close();
}

// ---- Top LPs: a manager with disclosed commitments links its investors -------------------
{
  const { ctx, pg, errs } = await openProfile(PHONE, "#/manager/m11");
  const g = await glanceOf(pg);
  const lp = await pg.evaluate(async () => { const S = await import("/credit/js/shared.js"); return S.commitmentsForManager("m11").filter((c) => c.lpId).length; });
  const top = g && g.facts.find((f) => f.k.toUpperCase() === "TOP LPS");
  if (lp) check(!!top && g.links.some((h) => /^#\/lp\//.test(h)), `top LPs from commitments link to investor profiles (${top ? top.v : "none"})`);
  else check(!top, "no commitments → no Top LPs fact");
  checkErrs(errs, "manager glance (LPs)");
  await ctx.close();
}

// ---- A USD manager shows USD only ----------------------------------------------------
{
  const id = await (async () => {
    const { ctx, pg } = await openProfile(PHONE, "#/manager/m3");
    const x = await pg.evaluate(async () => { const D = await import("/credit/js/data.js"); const m = D.managers.find((y) => !y.aumFrom && !y.notAum && (y.aumTotal ?? y.aum) != null); return m && m.id; });
    await ctx.close(); return x;
  })();
  const { ctx, pg, errs } = await openProfile(PHONE, "#/manager/" + id);
  const g = await glanceOf(pg);
  const aum = g.facts.find((f) => f.k.toUpperCase() === "AUM");
  check(aum && /^\$/.test(aum.v) && !/[€£(]/.test(aum.v.split(/\s+(?:group|credit)\b/)[0]), `a manager with no native currency shows USD only (${id}: ${aum && aum.v})`);
  checkErrs(errs, "manager glance (USD)");
  await ctx.close();
}

// ---- Desktop: one dense strip --------------------------------------------------------
for (const w of [1366, 1920]) {
  const { ctx, pg, errs } = await openProfile({ viewport: { width: w, height: 900 } }, "#/manager/m3");
  const g = await glanceOf(pg);
  const tops = new Set(g.facts.map((f) => f.top));
  check(tops.size === 1, `desktop ${w}: the facts sit in ONE row (${[...tops].join(",")})`);
  check(!g.overflow && g.h < 190, `desktop ${w}: dense strip, nothing spills (${g.h}px)`);
  checkErrs(errs, `manager glance (desktop ${w})`);
  await ctx.close();
}

await b.close(); srv.close();
finish();
