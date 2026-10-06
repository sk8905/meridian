// Inline security pills in the briefing prose (snip-3 style): after a recognised security's
// first mention, a small chip shows its ticker/benchmark + the day's move + a direction
// arrow. Coverage is a TIGHT, certain curated map — US/EU megacaps (live % via /api/quotes)
// and US Treasury benchmark yields (from the rates cache) — so a pill never shows a
// wrong/guessed value: an unmapped name gets NO pill, and a mapped name with no live quote
// stays EMPTY (hidden). Here /api/quotes + /api/rates are stubbed deterministically; the
// briefing is repainted with a controlled bullet via the __wireRenderBrief seam.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const HERO = { asOf: "2026-10-06", instruments: ["spx"].map((k) => ({
  key: k, label: k.toUpperCase(), unit: "", pre: "", dp: 2, fi: false, value: 100,
  history: Array.from({ length: 30 }, (_, j) => [Date.now() - (29 - j) * 864e5, 100 + j * 0.1]),
})) };
const QUOTES = { quotes: {
  NVDA: { price: 190.2, changePct: 2.13, marketState: "REGULAR" },
  HON:  { price: 210.5, changePct: -0.07, marketState: "REGULAR" },
  // Boeing (BA) deliberately absent → its pill must stay empty (hidden), never guessed.
} };
const RATES = { rates: [ { label: "US 10Y", value: 5.31, change: 0.03, unit: "%", asOf: "6 Oct", history: [], href: "https://www.cnbc.com/quotes/US10Y" } ] };
const srv = await serve({
  "/api/hero": () => [200, JSON.stringify(HERO)],
  "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })],
  "/api/markets": () => [200, JSON.stringify({ markets: [], moversExtra: [], moversEtf: [], portfolio: null })],
  "/api/rates": () => [200, JSON.stringify(RATES)],
  "/api/quotes": () => [200, JSON.stringify(QUOTES)],
});
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-hbrief .g-hbrief-head", { timeout: 8000 });
await pg.waitForFunction(() => typeof window.__wireRenderBrief === "function", { timeout: 8000 });
await pg.waitForSelector("#g-rates .rate-tile", { timeout: 8000 });

// Repaint with a controlled bullet: a mapped megacap (Nvidia), another (Honeywell), a US
// benchmark yield phrase, one mapped name with NO quote (Boeing), and an UNMAPPED name.
await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {}, slots = B.slots || {};
  const order = (B.order || []).filter((k) => slots[k]);
  const key = order[0];
  slots[key].bullets = [
    { html: "<strong>Equities &mdash; Nvidia leads a rally</strong> as Honeywell gains and Boeing lags, with the US 10-year Treasury yield ticking up and Acme Widgets flat.", src: "https://example.com/e", srcName: "Ex" },
  ];
  window.__wireRenderBrief();
});
// The equity pills fill after the (stubbed) /api/quotes call resolves.
await pg.waitForFunction(() => {
  const n = document.querySelector('#g-hbrief .g-hbt-tk[data-sym="NVDA"]');
  return n && n.textContent.trim().length > 0;
}, { timeout: 8000 });

const r = await pg.evaluate(() => {
  const host = document.getElementById("g-hbrief");
  const pill = (sel) => { const n = host.querySelector(sel); return n ? { txt: n.textContent.replace(/\s+/g, " ").trim(), up: n.classList.contains("up"), down: n.classList.contains("down"), vis: getComputedStyle(n).display !== "none" } : null; };
  return {
    nvda: pill('.g-hbt-tk[data-sym="NVDA"]'),
    hon: pill('.g-hbt-tk[data-sym="HON"]'),
    ba: pill('.g-hbt-tk[data-sym="BA"]'),              // mapped but no quote → empty/hidden
    us10: pill('.g-hbt-tk[data-ykey="US 10Y"]'),
    // the pill sits AFTER the company name in the prose
    afterName: (() => { const bt = host.querySelector(".g-hbrief-bt"); if (!bt) return ""; const h = bt.innerHTML; const i = h.indexOf("Nvidia"); const j = h.indexOf('data-sym="NVDA"'); return i >= 0 && j > i ? "after" : "not-after"; })(),
    acmeHasPill: /Acme Widgets<span class="g-hbt-tk"/.test(host.innerHTML),   // unmapped → no pill
    totalPills: host.querySelectorAll(".g-hbt-tk").length,
    visiblePills: [...host.querySelectorAll(".g-hbt-tk")].filter((n) => getComputedStyle(n).display !== "none").length,
  };
});

check(r.nvda && /NVDA/.test(r.nvda.txt) && /2\.13%/.test(r.nvda.txt) && /↑/.test(r.nvda.txt) && r.nvda.up, `megacap pill: Nvidia → NVDA 2.13% ↑ (up) (${r.nvda && r.nvda.txt})`);
check(r.hon && /HON/.test(r.hon.txt) && /0\.07%/.test(r.hon.txt) && /↓/.test(r.hon.txt) && r.hon.down, `megacap pill: Honeywell → HON 0.07% ↓ (down) (${r.hon && r.hon.txt})`);
check(r.us10 && /US 10Y/.test(r.us10.txt) && /3bp/.test(r.us10.txt) && /↑/.test(r.us10.txt) && r.us10.up, `benchmark pill: "US 10-year Treasury yield" → US 10Y 3bp ↑ (${r.us10 && r.us10.txt})`);
check(r.afterName === "after", "the pill is injected AFTER the company name in the prose");
check(!r.acmeHasPill, "an UNMAPPED name (Acme Widgets) gets NO pill");
check(!r.ba || !r.ba.vis, "a mapped name with NO live quote (Boeing/BA) stays EMPTY (hidden) — never a guessed value");

checkErrs(errs, "home brief tickers");
await ctx.close();
await b.close();
srv.close();
finish();
