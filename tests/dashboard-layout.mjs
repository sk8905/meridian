// Dashboard ▸ responsive packed layout + fill cards (HOUSE_STYLE R40). At six
// desktop widths (laptop 1280 → ultra-wide 3440) every tab packs into 2–6 columns
// with no card overflowing its frame, no two cards overlapping and no vertical
// gap > 14px between a card and the one above it (fill cards / frame stretch
// absorb the slack). The new sourced gauge cards render live values with their
// source links: All-in yields & BBB (Credit), Central-bank balance sheets, FX and
// Euro AAA curve history (Rates), VIX history (Equities) — all from /api/eurates.
// With an EMPTY /api/eurates payload they show an "unavailable" line with a
// source link, never a number.
import { serve, launchChromium, check, checkEq, finish } from "./lib.mjs";
import { apis as LIVE } from "./fixtures/dashboard-live.mjs";

const apis = { ...LIVE, "/api/13f": () => [200, JSON.stringify({ asOf: "2026-06-30", source: "https://www.sec.gov/", holdings: [] })] };
const TABS = ["credit", "rates", "legal", "equities", "hedge-funds"];
const b = await launchChromium();
const srv = await serve(apis);
const go = async (pg, k) => { await pg.evaluate((s) => document.querySelector(`.dsh-navchip[data-sub="${s}"]`).click(), k); await pg.waitForTimeout(900); };

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
  await pg.goto(`http://localhost:${srv.port}/v2/dashboard/credit/`, { waitUntil: "load" }); await pg.waitForTimeout(1500);
  const rowTxt = (sel) => pg.evaluate((s) => [...document.querySelectorAll(`${s} tbody tr`)].map((tr) => ({ t: tr.innerText.replace(/\s+/g, " "), src: !!tr.querySelector("a[href^='https://']") })), sel);
  const y = await rowTxt("#dsh-yields");
  checkEq(y.length, 3, "Credit: All-in yields card lists Euro HY yield, US HY yield, US BBB OAS");
  check(/Euro HY yield 6\.49%/.test(y[0] && y[0].t) && /US BBB OAS 102bp/.test(y[2] && y[2].t) && y.every((x) => x.src), `Credit: yields show the fixture's FRED values with source links (${y.map((x) => x.t).join(" / ")})`);
  check(await pg.evaluate(() => document.querySelector('.dsh-live[data-live="yld"]').textContent === "live"), "Credit: yields badge flips to live");
  await go(pg, "rates");
  const bs = await rowTxt("#dsh-cbbs");
  check(bs.length === 2 && /Eurosystem total assets €5,944/.test(bs[0].t) && /Fed total assets \$6,748/.test(bs[1].t), `Rates: balance sheets in €bn / $bn (${bs.map((x) => x.t).join(" / ")})`);
  const fx = await rowTxt("#dsh-fx");
  check(fx.length === 2 && /EUR\/USD 1\.1193/.test(fx[0].t) && /GBP\/USD 1\.3229/.test(fx[1].t), "Rates: FX card shows EUR/USD and GBP/USD");
  const ch = await pg.evaluate(() => ["#dsh-aaa", "#dsh-cbbs", "#dsh-fx", "#dsh-mmhist"].map((s) => document.querySelectorAll(`${s} .dsh-chart polyline`).length));
  checkEq(ch.join(","), "3,2,2,4", "Rates: chart lines — AAA 2Y/10Y/30Y, two balance sheets, two FX pairs, four money-market rates");
  check(await pg.evaluate(() => /2s10s \d+bp/.test(document.querySelector("#dsh-aaa .dsh-lgs").textContent)), "Rates: Euro AAA chart legend carries the 2s10s slope");
  await go(pg, "equities");
  check(await pg.evaluate(() => document.querySelectorAll("#dsh-vix .dsh-chart polyline").length === 1 && /15\.21/.test(document.querySelector("#dsh-vix .dsh-lgs").textContent)), "Equities: VIX chart with the latest close");
  await ctx.close();
}
srv.close();

// ---- EMPTY /api/eurates: no number is invented
{
  const s2 = await serve({ ...apis, "/api/eurates": () => [200, "{}"] });
  const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } }); const pg = await ctx.newPage();
  await pg.goto(`http://localhost:${s2.port}/v2/dashboard/rates/`, { waitUntil: "load" }); await pg.waitForTimeout(1500);
  const r = await pg.evaluate(() => ["#dsh-cbbs", "#dsh-fx", "#dsh-aaa"].map((s) => { const el = document.querySelector(s); return { t: el.textContent, a: !!el.querySelector(".dsh-fill-body a[href^='https://']"), badge: (el.querySelector(".dsh-live") || {}).textContent }; }));
  check(r.every((x) => /unavailable/.test(x.t) && x.a && x.badge === "snapshot" && !/\d{3,}/.test(x.t.replace(/\d+ \w+ 20\d\d/g, ""))), "Empty payload: gauge cards read 'unavailable' with a source link, no numbers, badge not live");
  await ctx.close(); s2.close();
}
await b.close();
finish();
