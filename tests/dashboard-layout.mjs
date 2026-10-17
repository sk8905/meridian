// Dashboard ▸ responsive packed layout + fill cards (HOUSE_STYLE R40). At six
// desktop widths (laptop 1280 → ultra-wide 3440) every tab packs into 2–6 columns
// with no card overflowing its frame, no two cards overlapping and no vertical
// gap > 14px between a card and the one above it (fill cards / frame stretch
// absorb the slack). The new sourced gauge cards render live values with their
// source links: All-in yields & BBB (Credit), Central-bank balance sheets (incl. the
// BoE Weekly Report lines), FX and
// Euro AAA curve history (Rates), VIX history (Equities) — all from /api/eurates.
// With an EMPTY /api/eurates payload they show an "unavailable" line with a
// source link, never a number.
import { serve, launchChromium, check, checkEq, finish } from "./lib.mjs";
import { apis as LIVE } from "./fixtures/dashboard-live.mjs";

const apis = { ...LIVE, "/api/13f": () => [200, JSON.stringify({ asOf: "2026-06-30", source: "https://www.sec.gov/", holdings: [] })] };
const TABS = ["rates", "equities", "credit", "hedge-funds", "legal"];
const b = await launchChromium();
const srv = await serve(apis);
// Switch tab, then wait for the packed layout to settle (live data lands and the
// packer re-runs) — positions unchanged across two reads 300ms apart, max ~6s.
const snap = (pg) => pg.evaluate(() => [...document.querySelectorAll(".dsh-mid > .dsh-card")].map((c) => `${c.style.left}|${c.style.top}|${c.offsetHeight}`).join(","));
const chartAxes = (pg) => pg.evaluate(() => [...document.querySelectorAll(".dsh-mid .dsh-chart")].map((c) => {
  const x = c.nextElementSibling, yt = c.previousElementSibling;
  return { y: c.querySelectorAll(".dsh-chart-y span").length, yt: yt && yt.classList.contains("dsh-chart-yt") ? yt.textContent.trim() : "",
    dates: x ? [...x.querySelectorAll(".dsh-chart-xt span")].map((e) => e.textContent.trim()) : [], xt: x ? ((x.querySelector(".dsh-chart-t") || {}).textContent || "") : "" }; }));
const DATE = /^(\d{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)( \d{4})?|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{2})$/;
const timeOk = (cs) => cs.length > 0 && cs.every((c) => c.y >= 3 && c.yt && c.dates.length >= 3 && c.dates.every((d) => DATE.test(d)) && /^Date, (daily|weekly)$/.test(c.xt));
const go = async (pg, k) => {
  await pg.evaluate((s) => document.querySelector(`.dsh-navchip[data-sub="${s}"]`).click(), k); await pg.waitForTimeout(600);
  let prev = await snap(pg);
  for (let i = 0; i < 20; i++) { await pg.waitForTimeout(300); const cur = await snap(pg); if (cur === prev) break; prev = cur; }
};

for (const [w, h] of [[1280, 800], [1366, 768], [1536, 864], [1920, 1080], [2560, 1440], [3440, 1440]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${srv.port}/v2/dashboard/`, { waitUntil: "load" }); await pg.waitForTimeout(1200);
  for (const t of TABS) {
    await go(pg, t);
    const r = await pg.evaluate(() => {
      const mid = document.querySelector(".dsh-mid");
      const cards = [...mid.querySelectorAll(":scope > .dsh-card")].map((c) => ({ c, r: c.getBoundingClientRect(), n: ((c.querySelector(".dsh-h-t, .dsh-h, summary") || c).textContent || "").trim().slice(0, 24) }));
      const spill = cards.filter(({ c }) => c.scrollWidth > c.clientWidth + 1).map((x) => x.n);
      const ov = [], holes = [];
      for (const a of cards) for (const o of cards) if (a !== o && a.r.left < o.r.right - 1 && o.r.left < a.r.right - 1 && a.r.top < o.r.bottom - 1 && o.r.top < a.r.bottom - 1) ov.push(a.n);
      for (const a of cards) {
        const above = cards.filter((o) => o !== a && o.r.bottom <= a.r.top + 1 && o.r.left < a.r.right - 1 && a.r.left < o.r.right - 1);
        if (!above.length) continue;
        const gap = a.r.top - Math.max(...above.map((o) => o.r.bottom));
        if (gap > 14) holes.push(`${a.n} ${Math.round(gap)}px`);
      }
      return { masonry: mid.classList.contains("dsh-masonry"), cols: new Set(cards.map(({ r }) => Math.round(r.left))).size, spill, ov, holes };
    });
    check(r.masonry && r.cols >= 2 && r.cols <= 6, `${w}px ${t}: packed into 2–6 columns (${r.cols})`);
    checkEq(r.spill.join("|"), "", `${w}px ${t}: no card content overflows its frame`);
    checkEq(r.ov.length, 0, `${w}px ${t}: no overlapping cards`);
    checkEq(r.holes.join("|"), "", `${w}px ${t}: no vertical gap > 14px between stacked cards`);
  }
  await ctx.close();
}

// ---- New sourced gauge cards (live /api/eurates `extra`)
{
  const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } }); const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${srv.port}/v2/dashboard/credit/`, { waitUntil: "load" });
  // Wait for the live /api/eurates payload to land (a condition, not a fixed timeout —
  // a fixed 1.5s flaked under the parallel runner).
  await pg.waitForFunction(() => document.querySelectorAll("#dsh-yields tbody tr").length >= 3 && document.querySelector('.dsh-live[data-live="yld"]')?.textContent === "live", null, { timeout: 15000 }).catch(() => {});
  const rowTxt = (sel) => pg.evaluate((s) => [...document.querySelectorAll(`${s} tbody tr`)].map((tr) => ({ t: tr.innerText.replace(/\s+/g, " "), src: !!tr.querySelector("a[href^='https://']") })), sel);
  const y = await rowTxt("#dsh-yields");
  checkEq(y.length, 3, "Credit: All-in yields card lists Euro HY yield, US HY yield, US BBB OAS");
  check(/Euro HY yield 6\.49%/.test(y[0] && y[0].t) && /US BBB OAS 102bp/.test(y[2] && y[2].t) && y.every((x) => x.src), `Credit: yields show the fixture's FRED values with source links (${y.map((x) => x.t).join(" / ")})`);
  check(await pg.evaluate(() => document.querySelector('.dsh-live[data-live="yld"]').textContent === "live"), "Credit: yields badge flips to live");
  const sh = await chartAxes(pg);
  check(timeOk(sh) && sh[0].dates[0] === "11 Sep" && sh[0].dates[sh[0].dates.length - 1] === "12 Oct", `Credit: spread history runs on real observation dates, 11 Sep → 12 Oct (${JSON.stringify(sh)})`);
  const dd = await pg.evaluate(() => [...document.querySelectorAll("#dsh-dd .dsh-news-i")].map((li) => `${li.querySelector(".c-date").textContent}|${li.querySelector(".g-ev-t").textContent}`));
  checkEq(dd.length - new Set(dd).size, 0, "Credit: restructuring & distress deals list each story once");
  const notes = await pg.evaluate(() => getComputedStyle(document.querySelector("#dsh-dd .g-ev-m")).fontSize);
  const adj = await pg.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs-adj")) || 0);
  check(notes === `${10 + adj}px`, `Credit: deal-type notes use the micro step (${notes})`);
  await go(pg, "rates");
  const bs = await rowTxt("#dsh-cbbs");
  check(bs.length === 4 && /Eurosystem total assets €5,944/.test(bs[0].t) && /Fed total assets \$6,748/.test(bs[1].t)
    && /BoE reserve balances £650/.test(bs[2].t) && /BoE loan to APF \(QE stock\) £522/.test(bs[3].t) && bs.every((x) => x.src), `Rates: balance sheets — Eurosystem €bn, Fed $bn, BoE Weekly Report reserves + APF £bn, each sourced (${bs.map((x) => x.t).join(" / ")})`);
  check(await pg.evaluate(() => [...document.querySelectorAll("#dsh-cbbs a.dsh-src")].some((a) => /bankofengland\.co\.uk\/boeapps\/database\/.*RPWB56A/.test(a.href))), "Rates: BoE reserves row links its IADB series (RPWB56A)");
  // Every chart is labelled on both axes: the x axis is TIME (dated ticks + "Date, …"
  // title) and the y axis carries value ticks plus a title above them.
  const charts = await chartAxes(pg);
  check(charts.length >= 4 && timeOk(charts), `Rates: every line chart has a time x-axis (dated ticks + "Date" title) and a titled value axis (${JSON.stringify(charts)})`);
  const yc = await pg.evaluate(() => ({ y: document.querySelectorAll("#dsh-yc-card .dsh-yc2-y span").length, yt: (document.querySelector("#dsh-yc-card .dsh-yc2-y em") || {}).textContent, xt: (document.querySelector("#dsh-yc-card .dsh-yc2-x em") || {}).textContent }));
  check(yc.y === 3 && yc.yt === "Yield" && yc.xt === "Maturity", `Rates: yield-curve chart carries a value axis and both axis titles (${JSON.stringify(yc)})`);
  // House type scale (R11): card titles at body size, column heads at micro.
  const fs = await pg.evaluate(() => ({ h: getComputedStyle(document.querySelector(".dsh-mid .dsh-h")).fontSize, th: getComputedStyle(document.querySelector(".dsh-mid .dsh-tbl th")).fontSize,
    body: getComputedStyle(document.documentElement).getPropertyValue("--fs-body").trim(), adj: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs-adj")) || 0 }));
  check(fs.h === `${12 + fs.adj}px` && fs.th === `${10 + fs.adj}px`, `Type scale: card titles ${fs.h} (body), column heads ${fs.th} (micro)`);
  const fx = await rowTxt("#dsh-fx");
  check(fx.length === 2 && /EUR\/USD 1\.1193/.test(fx[0].t) && /GBP\/USD 1\.3229/.test(fx[1].t), "Rates: FX card shows EUR/USD and GBP/USD");
  const ch = await pg.evaluate(() => ["#dsh-aaa", "#dsh-cbbs", "#dsh-fx", "#dsh-mmhist"].map((s) => document.querySelectorAll(`${s} .dsh-chart polyline`).length));
  checkEq(ch.join(","), "3,4,2,4", "Rates: chart lines — AAA 2Y/10Y/30Y, four balance-sheet lines (Eurosystem, Fed, BoE reserves, BoE APF), two FX pairs, four money-market rates");
  check(await pg.evaluate(() => /2s10s \d+bp/.test(document.querySelector("#dsh-aaa .dsh-lgs").textContent)), "Rates: Euro AAA chart legend carries the 2s10s slope");
  await go(pg, "equities");
  check(timeOk(await chartAxes(pg)), "Equities: VIX chart has a time x-axis and a titled value axis");
  // Legal + Hedge Funds lists are not capped: every tracked item is listed.
  const L = await import("../legal/js/data.js"), C = await import("../credit/js/data.js");
  await go(pg, "hedge-funds");
  const hf = await pg.evaluate(() => ({ aum: document.querySelectorAll("#dsh-hfaum tbody tr").length, news: document.querySelectorAll("#dsh-hfnews .dsh-news-i").length,
    fam: [...document.querySelectorAll("#dsh-hfaum ~ * td, .dsh-card td")].length, strat: [...document.querySelectorAll(".dsh-card")].find((c) => /By strategy/.test(c.textContent))?.querySelectorAll("tbody tr").length }));
  checkEq(hf.aum, C.HEDGE_FUNDS.filter((f) => f.aum != null).length, "Hedge Funds: the AUM table lists every tracked fund (no cap)");
  checkEq(hf.news, C.HEDGE_INTEL.filter((x) => x && x.date && x.headline && (x.sourceUrl || x.url)).length, "Hedge Funds: the news card lists every tracked item (no cap)");
  check(hf.strat >= 4 && hf.strat <= 7, `Hedge Funds: strategies grouped into families (${hf.strat} rows)`);
  check(await pg.evaluate(() => document.querySelectorAll("#dsh-hfperf tbody tr").length > 0 && document.querySelectorAll("#dsh-hfin tbody tr").length > 0), "Hedge Funds: reported-performance and funds-in-the-news cards render");
  await go(pg, "legal");
  const lg = await pg.evaluate(() => ({ cases: document.querySelectorAll("#dsh-cases .dsh-news-i").length, funds: document.querySelectorAll("#dsh-lfunds .dsh-news-i").length, areas: document.querySelectorAll("#dsh-areas tbody tr").length, firms: document.querySelectorAll("#dsh-firms tbody tr").length }));
  check(lg.cases > 40 && lg.funds > 40 && lg.areas === 4 && lg.firms > 10, `Legal: case law, funds alerts, practice areas and firms are listed in full (${JSON.stringify(lg)})`);
  await go(pg, "equities");
  check(await pg.evaluate(() => document.querySelectorAll("#dsh-vix .dsh-chart polyline").length === 1 && /15\.21/.test(document.querySelector("#dsh-vix .dsh-lgs").textContent)), "Equities: VIX chart with the latest close");
  await ctx.close();
}
srv.close();

// ---- EMPTY /api/eurates: no number is invented
{
  // No live data AND no committed last-known snapshot (the bare first-run case).
  const s2 = await serve({ ...apis, "/api/eurates": () => [200, "{}"], "/dashboard/js/live-snapshot.js": () => [404, "x", "text/plain"] });
  const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } }); const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${s2.port}/v2/dashboard/rates/`, { waitUntil: "load" });
  // Wait for the three cards to settle instead of a fixed 1.5s (flaky under the parallel suite).
  await pg.waitForFunction(() => ["#dsh-cbbs", "#dsh-fx", "#dsh-aaa"].every((s) => { const el = document.querySelector(s); return el && /unavailable/.test(el.textContent) && (el.querySelector(".dsh-live") || {}).textContent === "not live"; }), null, { timeout: 15000 }).catch(() => {});
  const r = await pg.evaluate(() => ["#dsh-cbbs", "#dsh-fx", "#dsh-aaa"].map((s) => { const el = document.querySelector(s); return { t: el.textContent, a: !!el.querySelector(".dsh-fill-body a[href^='https://']"), badge: (el.querySelector(".dsh-live") || {}).textContent }; }));
  check(r.every((x) => /unavailable/.test(x.t) && x.a && x.badge === "not live" && !/\d{3,}/.test(x.t.replace(/\d+ \w+ 20\d\d/g, ""))), "Empty payload: gauge cards read 'unavailable' with a source link, no numbers, badge not live");
  await ctx.close(); s2.close();
}
await b.close();
finish();
