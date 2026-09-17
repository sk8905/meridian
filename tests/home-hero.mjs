// Home HERO CHART BAND (Option C): a price/performance chart for the market
// basket. The Worker (/api/hero) returns a full year of daily closes per
// instrument; the client draws the chart, and the 1M/6M/1Y/YTD toggle slices that
// one series client-side (no refetch). On desktop the band spans the news +
// manager wire columns (the two mid-panes) and sits above them. Here /api/hero is
// stubbed, so we assert the chips render, the readout + chart draw, the range and
// instrument controls redraw, and the desktop band spans the two middle columns.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

// A synthetic year of daily closes ending today (seeded walk — deterministic).
function series(seed, base, vol) {
  const out = []; let x = base, s = seed;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  const start = Date.now() - 364 * 864e5;
  for (let i = 0; i < 260; i++) { x = x * (1 + (rnd() - 0.5) * vol); out.push([start + i * 864e5 * (364 / 260), +x.toFixed(2)]); }
  return out;
}
const HERO = { asOf: new Date().toISOString().slice(0, 10), instruments: [
  { key: "spx", label: "S&P 500", unit: "", pre: "", dp: 1, fi: false, value: 7552.4, history: series(7, 7000, 0.01) },
  { key: "ndx", label: "Nasdaq", unit: "", pre: "", dp: 0, fi: false, value: 25978, history: series(19, 24000, 0.013) },
  { key: "ust10", label: "US 10Y", unit: "%", pre: "", dp: 2, fi: true, value: 5.01, history: series(29, 4.6, 0.01) },
  { key: "oil", label: "Oil", unit: "", pre: "$", dp: 2, fi: false, value: 99.85, history: series(41, 90, 0.015) },
  { key: "gold", label: "Gold", unit: "", pre: "$", dp: 0, fi: false, value: 4415, history: series(53, 4000, 0.009) },
  { key: "btc", label: "Bitcoin", unit: "", pre: "$", dp: 0, fi: false, value: 76610, history: series(67, 70000, 0.02) },
] };

const srv = await serve({ "/api/hero": () => [200, JSON.stringify(HERO)] });
const b = await launchChromium();

// --- Desktop: chips + readout + chart, then range & instrument switch ---------
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector("#g-hero-sel .g-hero-chip", { timeout: 8000 });
  await pg.waitForTimeout(200);

  const init = await pg.evaluate(() => {
    const chips = [...document.querySelectorAll("#g-hero-sel .g-hero-chip")];
    const on = chips.find((c) => c.classList.contains("is-on"));
    const paths = document.querySelectorAll("#g-hero-svg path").length;
    return {
      labels: chips.map((c) => c.textContent.trim()),
      onLabel: on ? on.textContent.trim() : "",
      name: (document.getElementById("g-hero-name") || {}).textContent || "",
      px: (document.getElementById("g-hero-px") || {}).textContent || "",
      delta: (document.getElementById("g-hero-delta") || {}).textContent || "",
      sub: (document.getElementById("g-hero-sub") || {}).textContent || "",
      paths,
      rangeOn: (document.querySelector("#g-hero-range .g-hero-rg.is-on") || {}).dataset?.r,
    };
  });
  checkEq(init.labels.length, 6, "hero: six instrument chips render");
  check(init.labels.join(",") === "S&P 500,Nasdaq,US 10Y,Oil,Gold,Bitcoin", `hero: basket is S&P 500 · Nasdaq · US 10Y · Oil · Gold · Bitcoin (${init.labels.join(", ")})`);
  checkEq(init.onLabel, "S&P 500", "hero: the first instrument (S&P 500) is selected by default");
  checkEq(init.name, "S&P 500", "hero: the readout names the selected instrument");
  check(init.px.trim().length > 0 && init.px !== "—", `hero: the price readout is populated (${init.px})`);
  check(/[▲▼]/.test(init.delta), `hero: the change readout shows a direction arrow (${init.delta})`);
  check(init.paths >= 2, "hero: the chart draws an area + line path");
  checkEq(init.rangeOn, "1M", "hero: 1M is the default range");
  check(/1-month/.test(init.sub), `hero: the sub-label states the range (${init.sub})`);

  // Range toggle: 1M → 1Y redraws (the line path changes) and relabels.
  const d1m = await pg.evaluate(() => document.querySelector("#g-hero-svg path:nth-of-type(2)").getAttribute("d"));
  await pg.evaluate(() => document.querySelector('#g-hero-range .g-hero-rg[data-r="1Y"]').click());
  await pg.waitForTimeout(150);
  const y = await pg.evaluate(() => ({
    d: document.querySelector("#g-hero-svg path:nth-of-type(2)").getAttribute("d"),
    sub: (document.getElementById("g-hero-sub") || {}).textContent || "",
    on: (document.querySelector("#g-hero-range .g-hero-rg.is-on") || {}).dataset?.r,
  }));
  check(y.on === "1Y" && /1-year/.test(y.sub), `hero: the range toggle switches to 1Y (${y.sub})`);
  check(y.d !== d1m, "hero: changing the range redraws the chart (different path)");

  // Instrument switch: pick US 10Y → readout follows, yield shows a pp change + FRED source.
  await pg.evaluate(() => [...document.querySelectorAll("#g-hero-sel .g-hero-chip")].find((c) => c.dataset.k === "ust10").click());
  await pg.waitForTimeout(150);
  const fi = await pg.evaluate(() => ({
    name: (document.getElementById("g-hero-name") || {}).textContent || "",
    delta: (document.getElementById("g-hero-delta") || {}).textContent || "",
    sub: (document.getElementById("g-hero-sub") || {}).textContent || "",
    px: (document.getElementById("g-hero-px") || {}).textContent || "",
  }));
  checkEq(fi.name, "US 10Y", "hero: switching instrument updates the readout name");
  check(/pp$/.test(fi.delta.trim()), `hero: the 10Y yield reports a pp change, not a % (${fi.delta})`);
  check(/%$/.test(fi.px.trim()), `hero: the 10Y value carries its % unit (${fi.px})`);
  check(/FRED/.test(fi.sub), `hero: the 10Y sub-label cites FRED (${fi.sub})`);

  // Option C geometry: the band spans the two MIDDLE columns (news + manager),
  // sits to the right of the left rail and left of the X rail, and above the wires.
  const geo = await pg.evaluate(() => {
    const box = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom) }; };
    return { hero: box(".g-hero"), side: box(".g-side"), feed: box(".g-feed-wrap"), mgr: box(".g-side3"), sidex: box(".g-side-x") };
  });
  check(geo.hero.l >= geo.side.r - 2, "hero: the band starts to the right of the left rail");
  check(geo.hero.l <= geo.feed.l + 2 && geo.hero.r >= geo.mgr.r - 2, "hero: the band spans the news + manager wire columns");
  check(geo.hero.r <= geo.sidex.l + 2, "hero: the band ends before the X rail");
  check(geo.hero.b <= geo.feed.t + 2 && geo.hero.b <= geo.mgr.t + 2, "hero: the two wires sit beneath the band (Option C)");

  checkErrs(errs, "home hero desktop");
  await ctx.close();
}

// --- Phone: the chart is reachable via the Chart chip and draws there too -----
{
  const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector(".g-wiretab[data-wire='chart']", { timeout: 8000 });
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="chart"]').click());
  await pg.waitForSelector("#g-hero-sel .g-hero-chip", { timeout: 8000 });
  await pg.waitForTimeout(150);
  const r = await pg.evaluate(() => {
    const hero = document.querySelector(".g-hero");
    const shown = hero && getComputedStyle(hero).display !== "none" && hero.getBoundingClientRect().height > 0;
    return { shown, chips: document.querySelectorAll("#g-hero-sel .g-hero-chip").length, paths: document.querySelectorAll("#g-hero-svg path").length };
  });
  check(r.shown, "phone: the hero chart pane is visible under the Chart chip");
  check(r.chips === 6 && r.paths >= 2, "phone: the chart renders its chips + line under the Chart chip");
  checkErrs(errs, "home hero phone");
  await ctx.close();
}

await b.close(); srv.close();
finish();
