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
// ~2 days of 15-min bars ending now — the intraday series behind 1D / 1W.
function intra(seed, base, vol) {
  const out = []; let x = base, s = seed;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  const start = Date.now() - 200 * 15 * 60000;
  for (let i = 0; i < 200; i++) { x = x * (1 + (rnd() - 0.5) * vol); out.push([start + i * 15 * 60000, +x.toFixed(2)]); }
  return out;
}
const HERO = { asOf: new Date().toISOString().slice(0, 10), instruments: [
  { key: "spx", label: "S&P 500", unit: "", pre: "", dp: 1, fi: false, value: 7552.4, history: series(7, 7000, 0.01), intraday: intra(7, 7550, 0.002) },
  { key: "ndx", label: "Nasdaq", unit: "", pre: "", dp: 0, fi: false, value: 25978, history: series(19, 24000, 0.013), intraday: intra(19, 25900, 0.002) },
  { key: "ust10", label: "US 10Y", unit: "%", pre: "", dp: 2, fi: true, value: 5.01, history: series(29, 4.6, 0.01), intraday: intra(29, 5.0, 0.003) },
  { key: "oil", label: "Oil", unit: "", pre: "$", dp: 2, fi: false, value: 99.85, history: series(41, 90, 0.015), intraday: intra(41, 99, 0.003) },
  { key: "gold", label: "Gold", unit: "", pre: "$", dp: 0, fi: false, value: 4415, history: series(53, 4000, 0.009), intraday: intra(53, 4400, 0.002) },
  { key: "btc", label: "Bitcoin", unit: "", pre: "$", dp: 0, fi: false, value: 76610, history: series(67, 70000, 0.02), intraday: intra(67, 76000, 0.004) },
] };

// Related-news stub (newest-first): the Worker returns real Yahoo Finance items.
const NEWS = { items: [
  { title: "Stocks rise as the Fed's rate decision lands", url: "https://finance.yahoo.com/a", source: "Yahoo Finance", date: new Date(Date.now() - 20 * 60000).toISOString(), ts: Date.now() - 20 * 60000, key: "spx", code: "SPX", ticker: "S&P 500" },
  { title: "Crude oil slips on the supply outlook", url: "https://finance.yahoo.com/b", source: "Reuters", date: new Date(Date.now() - 90 * 60000).toISOString(), ts: Date.now() - 90 * 60000, key: "oil", code: "OIL", ticker: "Oil" },
  { title: "Bitcoin extends its rally past resistance", url: "https://finance.yahoo.com/c", source: "CoinDesk", date: new Date(Date.now() - 5 * 3600000).toISOString(), ts: Date.now() - 5 * 3600000, key: "btc", code: "BTC", ticker: "Bitcoin" },
] };

const srv = await serve({ "/api/hero": () => [200, JSON.stringify(HERO)], "/api/hero-news": () => [200, JSON.stringify(NEWS)] });
const b = await launchChromium();

// --- Desktop: chips + readout + chart, then range & instrument switch ---------
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector("#g-hero-sel .g-hero-tk", { timeout: 8000 });
  await pg.waitForTimeout(200);

  const init = await pg.evaluate(() => {
    const tk = [...document.querySelectorAll("#g-hero-sel .g-hero-tk")];
    const on = tk.filter((t) => t.classList.contains("is-on"));
    const dotFilled = (k) => document.querySelector(`#g-hero-sel .g-hero-tk[data-k="${k}"] .g-hero-cdot`).classList.contains("on");
    return {
      labels: tk.map((t) => (t.querySelector(".g-hero-tk-nm") || {}).textContent.trim()),
      onKeys: on.map((t) => t.dataset.k),
      pcts: tk.map((t) => (t.querySelector(".g-hero-tk-pct") || {}).textContent.trim()),
      spxFilled: dotFilled("spx"), goldFilled: dotFilled("gold"),
      lines: document.querySelectorAll("#g-hero-svg .g-hero-line").length,
      rangeOn: (document.querySelector("#g-hero-range .g-hero-rg.is-on") || {}).dataset?.r,
    };
  });
  checkEq(init.labels.length, 6, "hero: the securities row lists all six instruments");
  check(init.labels.join(",") === "S&P 500,Nasdaq,US 10Y,Oil,Gold,Bitcoin", `hero: the row reads S&P 500 · Nasdaq · US 10Y · Oil · Gold · Bitcoin (${init.labels.join(", ")})`);
  check(init.onKeys.length === 6, `hero: all six securities are plotted by default — the indexed overlay (${init.onKeys.length})`);
  check(init.pcts.every((p) => /%$/.test(p)), `hero: every ticker shows a % change indicator (${init.pcts.join(" · ")})`);
  check(init.spxFilled && init.goldFilled, "hero: all default dots are FILLED (every ticker selected)");
  check(init.lines >= 6, `hero: six securities → six lines (${init.lines})`);
  checkEq(init.rangeOn, "1M", "hero: 1M is the default range");

  // Default is the INDEXED overlay: a shared % axis, no single-view price tag,
  // a bottom dated time axis, and vertical grid lines.
  const ax = await pg.evaluate(() => ({
    yl: document.querySelectorAll("#g-hero-yaxis .g-hero-ylab").length,
    yPct: [...document.querySelectorAll("#g-hero-yaxis .g-hero-ylab")].some((e) => /%/.test(e.textContent)),
    noTag: !document.querySelector("#g-hero-yaxis .g-hero-ytag"),
    xl: [...document.querySelectorAll("#g-hero-xaxis .g-hero-xlab")].map((e) => e.textContent.trim()),
    verticals: [...document.querySelectorAll("#g-hero-svg line:not(.g-hero-cross)")].filter((l) => l.getAttribute("x1") === l.getAttribute("x2")).length,
  }));
  check(ax.yl >= 2 && ax.yPct, `hero: the value axis shows indexed % ticks (${ax.yl})`);
  check(ax.noTag, "hero: no single-view price tag while indexed");
  check(ax.xl.length >= 2 && /\d/.test(ax.xl.join("")), `hero: the bottom time axis draws dated ticks (${ax.xl.join(" · ")})`);
  check(ax.verticals >= 3, `hero: the chart draws vertical grid lines (${ax.verticals})`);

  // Range toggle: 1M → 1Y redraws (a line path changes) and relabels the axis.
  const d1m = await pg.evaluate(() => document.querySelector("#g-hero-svg .g-hero-line").getAttribute("d"));
  await pg.evaluate(() => document.querySelector('#g-hero-range .g-hero-rg[data-r="1Y"]').click());
  await pg.waitForTimeout(150);
  const y = await pg.evaluate(() => ({
    d: document.querySelector("#g-hero-svg .g-hero-line").getAttribute("d"),
    on: (document.querySelector("#g-hero-range .g-hero-rg.is-on") || {}).dataset?.r,
    xl: [...document.querySelectorAll("#g-hero-xaxis .g-hero-xlab")].map((e) => e.textContent.trim()).join(" "),
  }));
  checkEq(y.on, "1Y", "hero: the range toggle switches to 1Y");
  check(y.d !== d1m, "hero: changing the range redraws the chart (different path)");
  check(/'\d\d/.test(y.xl), `hero: the 1Y time axis switches to month-'YY ticks (${y.xl})`);

  // 1D uses the intraday series — the time axis reads HH:MM and the chart redraws.
  const dPrev = await pg.evaluate(() => document.querySelector("#g-hero-svg .g-hero-line").getAttribute("d"));
  await pg.evaluate(() => document.querySelector('#g-hero-range .g-hero-rg[data-r="1D"]').click());
  await pg.waitForTimeout(150);
  const d1 = await pg.evaluate(() => ({
    on: (document.querySelector("#g-hero-range .g-hero-rg.is-on") || {}).dataset?.r,
    d: document.querySelector("#g-hero-svg .g-hero-line").getAttribute("d"),
    xl: [...document.querySelectorAll("#g-hero-xaxis .g-hero-xlab")].map((e) => e.textContent.trim()).join(" "),
  }));
  checkEq(d1.on, "1D", "hero: the range toggle switches to 1D");
  check(d1.d !== dPrev, "hero: 1D redraws from the intraday series (different path)");
  check(/\d{1,2}:\d\d/.test(d1.xl), `hero: the 1D time axis reads HH:MM (${d1.xl})`);

  // 1W also uses intraday, with day+month ticks.
  await pg.evaluate(() => document.querySelector('#g-hero-range .g-hero-rg[data-r="1W"]').click());
  await pg.waitForTimeout(150);
  const w1 = await pg.evaluate(() => ({
    on: (document.querySelector("#g-hero-range .g-hero-rg.is-on") || {}).dataset?.r,
    xl: [...document.querySelectorAll("#g-hero-xaxis .g-hero-xlab")].map((e) => e.textContent.trim()).join(" "),
  }));
  checkEq(w1.on, "1W", "hero: the range toggle switches to 1W");
  check(/\d/.test(w1.xl) && !/:/.test(w1.xl), `hero: the 1W time axis reads day+month, not times (${w1.xl})`);
  // Back to 1M for the pare-down assertions below.
  await pg.evaluate(() => document.querySelector('#g-hero-range .g-hero-rg[data-r="1M"]').click());
  await pg.waitForTimeout(150);

  // Pare down to ONE security → the single price view returns (line + price tag).
  await pg.evaluate(() => ["ndx", "ust10", "oil", "gold", "btc"].forEach((k) => document.querySelector(`#g-hero-sel .g-hero-tk[data-k="${k}"]`).click()));
  await pg.waitForTimeout(150);
  const one = await pg.evaluate(() => ({
    onKeys: [...document.querySelectorAll("#g-hero-sel .g-hero-tk.is-on")].map((t) => t.dataset.k),
    lines: document.querySelectorAll("#g-hero-svg .g-hero-line").length,
    tag: (document.querySelector("#g-hero-yaxis .g-hero-ytag") || {}).textContent || "",
    spxFilled: document.querySelector('#g-hero-sel .g-hero-tk[data-k="spx"] .g-hero-cdot').classList.contains("on"),
    goldFilled: document.querySelector('#g-hero-sel .g-hero-tk[data-k="gold"] .g-hero-cdot').classList.contains("on"),
  }));
  check(one.onKeys.length === 1 && one.onKeys[0] === "spx", `hero: paring to one returns the single view (${one.onKeys.join(", ")})`);
  checkEq(one.lines, 1, "hero: one security → a single line");
  check(one.tag.trim().length > 0, `hero: the single view shows the current level in an axis tag (${one.tag})`);
  check(one.spxFilled && !one.goldFilled, "hero: the selected dot is FILLED, an unselected dot is HOLLOW");

  // Switch the single security to the 10Y yield (carries its % unit).
  await pg.evaluate(() => { document.querySelector('#g-hero-sel .g-hero-tk[data-k="ust10"]').click(); document.querySelector('#g-hero-sel .g-hero-tk[data-k="spx"]').click(); });
  await pg.waitForTimeout(150);
  const fi = await pg.evaluate(() => ({
    onKeys: [...document.querySelectorAll("#g-hero-sel .g-hero-tk.is-on")].map((t) => t.dataset.k),
    tag: (document.querySelector("#g-hero-yaxis .g-hero-ytag") || {}).textContent || "",
    pct10: (document.querySelector('#g-hero-sel .g-hero-tk[data-k="ust10"] .g-hero-tk-pct') || {}).textContent || "",
  }));
  check(fi.onKeys.length === 1 && fi.onKeys[0] === "ust10", `hero: the single security switches to the 10Y (${fi.onKeys.join(", ")})`);
  check(/%$/.test(fi.tag.trim()), `hero: the 10Y single view carries its % unit on the axis tag (${fi.tag})`);
  check(/%$/.test(fi.pct10.trim()), `hero: the 10Y ticker shows a % change (${fi.pct10})`);
  // Restore a single spx so the geometry assertions read a clean chart.
  await pg.evaluate(() => { document.querySelector('#g-hero-sel .g-hero-tk[data-k="spx"]').click(); document.querySelector('#g-hero-sel .g-hero-tk[data-k="ust10"]').click(); });
  await pg.waitForTimeout(150);

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

  // The related-news list is hidden on the desktop terminal (the News column
  // already exists and the hero is a height-boxed band).
  const newsHidden = await pg.evaluate(() => { const n = document.getElementById("g-hero-news"); return !n || getComputedStyle(n).display === "none"; });
  check(newsHidden, "hero: the related-news list is hidden on the desktop terminal");

  checkErrs(errs, "home hero desktop");
  await ctx.close();
}

// --- Phone: the chart is reachable via the Chart chip and draws there too -----
{
  const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector(".g-wiretab[data-wire='chart']", { timeout: 8000 });
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="chart"]').click());
  await pg.waitForSelector("#g-hero-sel .g-hero-tk", { timeout: 8000 });
  await pg.waitForTimeout(150);
  const r = await pg.evaluate(() => {
    const hero = document.querySelector(".g-hero");
    const shown = hero && getComputedStyle(hero).display !== "none" && hero.getBoundingClientRect().height > 0;
    return { shown, tk: document.querySelectorAll("#g-hero-sel .g-hero-tk").length, paths: document.querySelectorAll("#g-hero-svg path").length };
  });
  check(r.shown, "phone: the hero chart pane is visible under the Chart chip");
  check(r.tk === 6 && r.paths >= 2, "phone: the chart renders its securities row + line under the Chart chip");

  // Related news beneath the chart — real Yahoo items, in the news-wire row format.
  await pg.waitForSelector("#g-hero-news .g-feed-row", { timeout: 8000 });
  const news = await pg.evaluate(() => {
    const rows = [...document.querySelectorAll("#g-hero-news .g-feed-row")];
    const t = (r, s) => (r.querySelector(s) || {}).textContent ? r.querySelector(s).textContent.trim() : "";
    const chart = document.querySelector(".g-hero-plot"), host = document.getElementById("g-hero-news");
    return {
      count: rows.length,
      shown: host && getComputedStyle(host).display !== "none" && host.getBoundingClientRect().height > 0,
      belowChart: chart && host && host.getBoundingClientRect().top >= chart.getBoundingClientRect().bottom - 2,
      firstTitle: rows[0] ? t(rows[0], ".g-feed-title") : "",
      firstTag: rows[0] ? t(rows[0], ".g-feed-code") : "",
      firstTicker: rows[0] ? t(rows[0], ".g-feed-desk") : "",
      allTagged: rows.every((r) => t(r, ".g-feed-code").length > 0),
      allSourced: rows.every((r) => t(r, ".g-feed-src").length > 0),
      allLinked: rows.every((r) => /^https?:\/\//.test(r.getAttribute("href") || "")),
    };
  });
  check(news.shown && news.belowChart, "phone: the related-news list shows beneath the chart");
  checkEq(news.count, 3, "phone: the related-news rows render");
  check(news.firstTitle.includes("Fed's rate decision"), `phone: news is newest-first (${news.firstTitle})`);
  check(news.allTagged && /^(SPX|OIL|BTC)$/.test(news.firstTag), `phone: each row carries a ticker tag (${news.firstTag})`);
  check(news.allSourced && news.allLinked, "phone: each row carries a source + real link (news-wire format, R7)");
  check(news.firstTicker.length > 0, `phone: the row is labelled with its ticker (${news.firstTicker})`);
  checkErrs(errs, "home hero phone");
  await ctx.close();
}

await b.close(); srv.close();
finish();
