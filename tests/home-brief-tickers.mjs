// Inline security pills in the briefing prose (snip-3 style): after a recognised security's
// first mention, a chip shows its ticker/benchmark + the day's move + a direction arrow.
// Equities/indices are DETECTED in the prose and resolved LIVE via /api/secq (Yahoo search +
// a market-cap tiebreaker server-side); US Treasury benchmark yields come from the rates
// cache. A pill shows only for a confident resolution + live quote — a stoplisted word
// (e.g. a country) isn't even queried, and an unresolved name gets NO pill (never guessed).
// Here /api/secq + /api/rates are stubbed and the briefing is repainted via __wireRenderBrief.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const HERO = { asOf: "2026-10-06", instruments: ["spx"].map((k) => ({
  key: k, label: k.toUpperCase(), unit: "", pre: "", dp: 2, fi: false, value: 100,
  history: Array.from({ length: 30 }, (_, j) => [Date.now() - (29 - j) * 864e5, 100 + j * 0.1]),
})) };
// The resolver echoes known names; anything else (Boeing, Acme Widgets) is absent → the
// client reads it as null → no pill. Country names are stoplisted and never reach here.
const SECQ = { securities: {
  "Nvidia":    { symbol: "NVDA",  label: "NVDA", pct: 2.13,  dir: "up" },
  "Honeywell": { symbol: "HON",   label: "HON",  pct: -0.07, dir: "down" },
} };
const RATES = { rates: [ { label: "US 10Y", value: 5.31, change: 0.03, unit: "%", asOf: "6 Oct", history: [], href: "https://www.cnbc.com/quotes/US10Y" } ] };
// Indices are DETECTED via a curated name→symbol map (Nasdaq → ^IXIC) and their live % comes
// from /api/quotes (the only endpoint that accepts `^`-prefixed index symbols).
const QUOTES = { quotes: { "^IXIC": { changePct: 1.25 } } };
const srv = await serve({
  "/api/hero": () => [200, JSON.stringify(HERO)],
  "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })],
  "/api/markets": () => [200, JSON.stringify({ markets: [], moversExtra: [], moversEtf: [], portfolio: null })],
  "/api/rates": () => [200, JSON.stringify(RATES)],
  "/api/secq": () => [200, JSON.stringify(SECQ)],
  "/api/quotes": () => [200, JSON.stringify(QUOTES)],
});
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-hbrief .g-hbrief-head", { timeout: 8000 });
await pg.waitForFunction(() => typeof window.__wireRenderBrief === "function", { timeout: 8000 });
await pg.waitForSelector("#g-rates .rate-tile", { timeout: 8000 });

// A controlled bullet: two resolvable megacaps (Nvidia, Honeywell), a US benchmark yield
// phrase, an unresolved company (Boeing), an unmapped name (Acme Widgets) and a stoplisted
// country (France) that must NEVER be queried or pilled.
await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {}, slots = B.slots || {};
  const key = (B.order || []).filter((k) => slots[k])[0];
  slots[key].bullets = [
    { html: "<strong>Equities &mdash; Nvidia leads a rally</strong> as Honeywell gains and Boeing lags in France, with the Nasdaq higher, the US 10-year Treasury yield ticking up and Acme Widgets flat.", src: "https://example.com/e", srcName: "Ex" },
  ];
  window.__wireRenderBrief();
});
// Equity pills appear after the (stubbed) /api/secq resolves and the brief repaints; the
// index pill fills once the (stubbed) /api/quotes returns.
await pg.waitForFunction(() => {
  const n = document.querySelector('#g-hbrief .g-hbt-tk[data-sym="NVDA"]');
  const ix = document.querySelector('#g-hbrief .g-hbt-tk[data-idx="^IXIC"]');
  return n && n.textContent.trim().length > 0 && ix && ix.textContent.trim().length > 0;
}, { timeout: 8000 });

const r = await pg.evaluate(() => {
  const host = document.getElementById("g-hbrief");
  const pill = (sel) => { const n = host.querySelector(sel); return n ? { txt: n.textContent.replace(/\s+/g, " ").trim(), up: n.classList.contains("up"), down: n.classList.contains("down") } : null; };
  const html = host.innerHTML;
  return {
    nvda: pill('.g-hbt-tk[data-sym="NVDA"]'),
    hon: pill('.g-hbt-tk[data-sym="HON"]'),
    us10: pill('.g-hbt-tk[data-ykey="US 10Y"]'),
    nasdaq: pill('.g-hbt-tk[data-idx="^IXIC"]'),
    // The recognised name is REPLACED by its pill (kept the label, dropped the text), so the
    // resolved names must no longer appear as prose; the ticker/benchmark label stands in.
    bodyText: (host.querySelector(".g-hbrief-bt") || host).textContent.replace(/\s+/g, " "),
    boeingPill: /Boeing<span class="g-hbt-tk"/.test(html),
    acmePill: /Acme Widgets<span class="g-hbt-tk"/.test(html),
    francePill: /France<span class="g-hbt-tk"/.test(html),
    totalPills: host.querySelectorAll(".g-hbt-tk").length,
  };
});

check(r.nvda && /NVDA/.test(r.nvda.txt) && /2\.13%/.test(r.nvda.txt) && /↑/.test(r.nvda.txt) && r.nvda.up, `megacap pill: Nvidia → NVDA 2.13% ↑ (up) (${r.nvda && r.nvda.txt})`);
check(r.hon && /HON/.test(r.hon.txt) && /0\.07%/.test(r.hon.txt) && /↓/.test(r.hon.txt) && r.hon.down, `megacap pill: Honeywell → HON 0.07% ↓ (down) (${r.hon && r.hon.txt})`);
check(r.us10 && /US 10Y/.test(r.us10.txt) && /3bp/.test(r.us10.txt) && /↑/.test(r.us10.txt) && r.us10.up, `benchmark pill: US 10-year Treasury yield → US 10Y 3bp ↑ (${r.us10 && r.us10.txt})`);
check(r.nasdaq && /NASDAQ/.test(r.nasdaq.txt) && /1\.25%/.test(r.nasdaq.txt) && /↑/.test(r.nasdaq.txt) && r.nasdaq.up, `index pill: Nasdaq → NASDAQ 1.25% ↑ (up) (${r.nasdaq && r.nasdaq.txt})`);
check(!/\bNvidia\b/.test(r.bodyText) && !/\bHoneywell\b/.test(r.bodyText) && !/\bNasdaq\b/.test(r.bodyText) && !/Treasury/.test(r.bodyText),
  `the recognised NAME is dropped — the pill label replaces it, not appended (${r.bodyText})`);
check(/\bBoeing\b/.test(r.bodyText) && /\bAcme Widgets\b/.test(r.bodyText) && /\bFrance\b/.test(r.bodyText),
  "an unresolved/unmapped/stoplisted name is KEPT as prose (no pill, so the text stays)");
check(!r.boeingPill, "an UNRESOLVED company (Boeing) gets NO pill (never guessed)");
check(!r.acmePill, "an unmapped name (Acme Widgets) gets NO pill");
check(!r.francePill, "a stoplisted country (France) is never pilled");
checkEq(r.totalPills, 4, "exactly four pills — NVDA, HON, US 10Y, NASDAQ");

// A desk kicker authored with an entity ("M&amp;A", "R&amp;D") must render the literal glyph
// ("M&A"), not a double-encoded "M&amp;A" — the desk name is decoded before it is re-escaped.
const amp = await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {}, slots = B.slots || {};
  const key = (B.order || []).filter((k) => slots[k])[0];
  slots[key].bullets = [
    { html: "<strong>R&amp;D &mdash; spending rose</strong> across the sector.", src: "https://example.com/x", srcName: "Ex" },
  ];
  window.__wireRenderBrief();
  const bk = document.querySelector("#g-hbrief .g-hbrief-bk");
  return { txt: bk ? bk.textContent : null };
});
check(amp.txt === "R&D", `desk kicker with '&' renders the glyph "R&D", not the literal "R&amp;A" (double-encoded) (text "${amp.txt}")`);

checkErrs(errs, "home brief tickers");
await ctx.close();
await b.close();
srv.close();
finish();
