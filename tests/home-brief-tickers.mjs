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
  "Nvidia":    { symbol: "NVDA",  label: "NVDA", pct: 2.13,  price: 182.40, dir: "up" },
  "Honeywell": { symbol: "HON",   label: "HON",  pct: -0.07, price: 210.15, dir: "down" },
} };
const RATES = { rates: [
  { label: "US 10Y", value: 5.31, change: 0.03, unit: "%", asOf: "6 Oct", history: [], href: "https://www.cnbc.com/quotes/US10Y" },
  { label: "US 30Y", value: 5.52, change: -0.02, unit: "%", asOf: "6 Oct", history: [], href: "https://home.treasury.gov" },
] };
// Indices are DETECTED via a curated name→symbol map (Nasdaq → ^IXIC) and their live % comes
// from /api/quotes (the only endpoint that accepts `^`-prefixed index symbols).
const QUOTES = { quotes: { "^IXIC": { changePct: 1.25, price: 20150.5 } } };
const srv = await serve({
  "/api/hero": () => [200, JSON.stringify(HERO)],
  "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })],
  "/api/markets": () => [200, JSON.stringify({ markets: [
    { label: "Brent", value: 89.52, change: -1.14, changePct: -1.27, marketState: "CLOSED" },
    { label: "WTI", value: 83.90, change: 0.50, changePct: 0.60, marketState: "REGULAR" },
  ], moversExtra: [], moversEtf: [], portfolio: null })],
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
  const _st = (k) => { const s = slots[k]; const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/); return (s.date || "") + " " + (t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"); };
  const _ord = (B.order || []).filter((k) => slots[k]);
  const key = _ord.reduce((b, k) => (_st(k) > _st(b) ? k : b), _ord[0]);   // the FRESHEST slot (what the card renders)
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
  const pill = (sel) => { const n = host.querySelector(sel); return n ? { txt: n.textContent.replace(/\s+/g, " ").trim(), lvl: ((n.querySelector(".g-hbt-v") || {}).textContent || "").trim(), chg: ((n.querySelector(".g-hbt-c") || {}).textContent || "").trim(), up: n.classList.contains("up"), down: n.classList.contains("down") } : null; };
  const html = host.innerHTML;
  // STRICT: every FILLED pill (one with a change) must ALSO carry a non-empty LEVEL span.
  const filled = [...host.querySelectorAll(".g-hbt-tk")].filter((n) => ((n.querySelector(".g-hbt-c") || {}).textContent || "").trim());
  const missingLevel = filled.filter((n) => !((n.querySelector(".g-hbt-v") || {}).textContent || "").trim()).map((n) => n.textContent.trim());
  return {
    nvda: pill('.g-hbt-tk[data-sym="NVDA"]'),
    hon: pill('.g-hbt-tk[data-sym="HON"]'),
    us10: pill('.g-hbt-tk[data-ykey="US 10Y"]'),
    nasdaq: pill('.g-hbt-tk[data-idx="^IXIC"]'),
    filledCount: filled.length, missingLevel,
    // The recognised name is REPLACED by its pill (kept the label, dropped the text), so the
    // resolved names must no longer appear as prose; the ticker/benchmark label stands in.
    bodyText: (host.querySelector(".g-hbrief-bt") || host).textContent.replace(/\s+/g, " "),
    boeingPill: /Boeing<span class="g-hbt-tk"/.test(html),
    acmePill: /Acme Widgets<span class="g-hbt-tk"/.test(html),
    francePill: /France<span class="g-hbt-tk"/.test(html),
    totalPills: host.querySelectorAll(".g-hbt-tk").length,
  };
});

// EVERY pill shows the LEVEL (price/yield/points) AND the change (%/bp) — R28, strict.
check(r.filledCount >= 4 && r.missingLevel.length === 0, `every filled pill carries a level + a change (${r.filledCount} pills${r.missingLevel.length ? "; MISSING level: " + r.missingLevel.join(" | ") : ""})`);
check(r.nvda && /NVDA/.test(r.nvda.txt) && /182\.40/.test(r.nvda.lvl) && /2\.13%/.test(r.nvda.chg) && /↑/.test(r.nvda.chg) && r.nvda.up, `megacap pill: Nvidia → NVDA 182.40 2.13% ↑ (${r.nvda && r.nvda.txt})`);
check(r.hon && /HON/.test(r.hon.txt) && /210\.15/.test(r.hon.lvl) && /0\.07%/.test(r.hon.chg) && /↓/.test(r.hon.chg) && r.hon.down, `megacap pill: Honeywell → HON 210.15 0.07% ↓ (${r.hon && r.hon.txt})`);
check(r.us10 && /US 10Y/.test(r.us10.txt) && /5\.31%/.test(r.us10.lvl) && /3bp/.test(r.us10.chg) && /↑/.test(r.us10.chg) && r.us10.up, `benchmark pill: US 10Y → 5.31% level + 3bp move (${r.us10 && r.us10.txt})`);
check(r.nasdaq && /NASDAQ/.test(r.nasdaq.txt) && /20,151/.test(r.nasdaq.lvl) && /1\.25%/.test(r.nasdaq.chg) && /↑/.test(r.nasdaq.chg) && r.nasdaq.up, `index pill: Nasdaq → 20,151 level + 1.25% move (${r.nasdaq && r.nasdaq.txt})`);
check(!/\bNvidia\b/.test(r.bodyText) && !/\bHoneywell\b/.test(r.bodyText) && !/\bNasdaq\b/.test(r.bodyText) && !/Treasury/.test(r.bodyText),
  `the recognised NAME is dropped — the pill label replaces it, not appended (${r.bodyText})`);
check(/\bBoeing\b/.test(r.bodyText) && /\bAcme Widgets\b/.test(r.bodyText) && /\bFrance\b/.test(r.bodyText),
  "an unresolved/unmapped/stoplisted name is KEPT as prose (no pill, so the text stays)");
check(!r.boeingPill, "an UNRESOLVED company (Boeing) gets NO pill (never guessed)");
check(!r.acmePill, "an unmapped name (Acme Widgets) gets NO pill");
check(!r.francePill, "a stoplisted country (France) is never pilled");
checkEq(r.totalPills, 4, "exactly four pills — NVDA, HON, US 10Y, NASDAQ");

// Commodity pill: a "Brent" (or WTI/Gold) mention is detected and pilled with the day's %
// from the MARKETS cache (the same source the snapshot strip uses) — /api/quotes can't take
// the "=F" futures symbols, so these fill from /api/markets like the strip does.
const com = await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {}, slots = B.slots || {};
  const _st = (k) => { const s = slots[k]; const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/); return (s.date || "") + " " + (t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"); };
  const _ord = (B.order || []).filter((k) => slots[k]);
  const key = _ord.reduce((b, k) => (_st(k) > _st(b) ? k : b), _ord[0]);
  slots[key].bullets = [
    { html: "<strong>Macro &mdash; the energy shock stays contained</strong> as Brent trades near $89 a barrel and WTI holds around $84.", src: "https://example.com/c", srcName: "Ex" },
  ];
  window.__wireRenderBrief();
  return key;
});
await pg.waitForFunction(() => {
  const n = document.querySelector('#g-hbrief .g-hbt-tk[data-mkt="Brent"]');
  return n && /%/.test(n.textContent);
}, { timeout: 8000 }).catch(() => {});
const comR = await pg.evaluate(() => {
  const host = document.getElementById("g-hbrief");
  const pill = (sel) => { const n = host.querySelector(sel); return n ? { txt: n.textContent.replace(/\s+/g, " ").trim(), up: n.classList.contains("up"), down: n.classList.contains("down") } : null; };
  const pillL = (sel) => { const n = host.querySelector(sel); return n ? { txt: n.textContent.replace(/\s+/g, " ").trim(), lvl: ((n.querySelector(".g-hbt-v") || {}).textContent || "").trim(), chg: ((n.querySelector(".g-hbt-c") || {}).textContent || "").trim(), up: n.classList.contains("up"), down: n.classList.contains("down") } : null; };
  return { brent: pillL('.g-hbt-tk[data-mkt="Brent"]'), wti: pillL('.g-hbt-tk[data-mkt="WTI"]'),
    bodyText: (host.querySelector(".g-hbrief-bt") || host).textContent.replace(/\s+/g, " ") };
});
check(comR.brent && /BRENT/.test(comR.brent.txt) && /89\.52/.test(comR.brent.lvl) && /1\.27%/.test(comR.brent.chg) && /↓/.test(comR.brent.chg) && comR.brent.down,
  `commodity pill: Brent → 89.52 level + 1.27% move from the markets cache (${comR.brent && comR.brent.txt})`);
check(comR.wti && /WTI/.test(comR.wti.txt) && /83\.90/.test(comR.wti.lvl) && /0\.60%/.test(comR.wti.chg) && comR.wti.up,
  `commodity pill: WTI → 83.90 level + 0.60% move (${comR.wti && comR.wti.txt})`);
check(!/\bBrent\b/.test(comR.bodyText) && !/\bWTI\b/.test(comR.bodyText), `the commodity NAME is replaced by its pill, not kept as prose (${comR.bodyText})`);

// Treasury pills: a Bonds bullet that LEADS with the long bond pills the 30-year, and a bare
// "10-year" (no "US"/"Treasury" prefix) still pills — both filled with their bp move from the
// rates cache. Verifies the broadened BRIEF_YIELDS + the new US 30Y entry.
await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {}, slots = B.slots || {};
  const _st = (k) => { const s = slots[k]; const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/); return (s.date || "") + " " + (t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"); };
  const _ord = (B.order || []).filter((k) => slots[k]);
  const key = _ord.reduce((b, k) => (_st(k) > _st(b) ? k : b), _ord[0]);
  slots[key].bullets = [
    { html: "<strong>Bonds &mdash; the sell-off resumed</strong>, with the US 30-year Treasury yield at its highest since 2002 and the 10-year near 5.27%.", src: "https://example.com/y", srcName: "Ex" },
  ];
  window.__wireRenderBrief();
});
await pg.waitForFunction(() => {
  const n = document.querySelector('#g-hbrief .g-hbt-tk[data-ykey="US 30Y"]');
  return n && /bp/.test(n.textContent);
}, { timeout: 8000 }).catch(() => {});
const yldR = await pg.evaluate(() => {
  const host = document.getElementById("g-hbrief");
  const pill = (sel) => { const n = host.querySelector(sel); return n ? { txt: n.textContent.replace(/\s+/g, " ").trim(), lvl: ((n.querySelector(".g-hbt-v") || {}).textContent || "").trim(), chg: ((n.querySelector(".g-hbt-c") || {}).textContent || "").trim(), up: n.classList.contains("up"), down: n.classList.contains("down") } : null; };
  return { us30: pill('.g-hbt-tk[data-ykey="US 30Y"]'), us10: pill('.g-hbt-tk[data-ykey="US 10Y"]'),
    bodyText: (host.querySelector(".g-hbrief-bt") || host).textContent.replace(/\s+/g, " ") };
});
check(yldR.us30 && /US 30Y/.test(yldR.us30.txt) && /5\.52%/.test(yldR.us30.lvl) && /2bp/.test(yldR.us30.chg) && /↓/.test(yldR.us30.chg) && yldR.us30.down,
  `long-bond pill: US 30Y → 5.52% level + 2bp move (${yldR.us30 && yldR.us30.txt})`);
check(yldR.us10 && /US 10Y/.test(yldR.us10.txt) && /5\.31%/.test(yldR.us10.lvl), `a bare "the 10-year" still pills → US 10Y with its 5.31% level (${yldR.us10 && yldR.us10.txt})`);
check(!/Treasury/.test(yldR.bodyText), `the 30-year phrase is replaced by its pill, not kept as prose (${yldR.bodyText})`);

// Entity handling under the canonical-desk render guard (HOUSE_STYLE R28):
//   • a NON-canonical desk kicker ("R&D") is DROPPED — the brief shows only the four
//     house desks (Macro/Bonds/Equities/Credit), so a malformed refresh can't paint an
//     off-house section (the same invariant the data gate enforces on committed data).
//   • a canonical bullet whose authored BODY carries an entity ("R&amp;D") still renders
//     the literal glyph ("R&D"), never a double-encoded "R&amp;D".
const amp = await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {}, slots = B.slots || {};
  const _st = (k) => { const s = slots[k]; const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/); return (s.date || "") + " " + (t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"); };
  const _ord = (B.order || []).filter((k) => slots[k]);
  const key = _ord.reduce((b, k) => (_st(k) > _st(b) ? k : b), _ord[0]);   // the FRESHEST slot (what the card renders)
  slots[key].bullets = [
    { html: "<strong>Equities &mdash; spending on R&amp;D rose</strong> as megacaps led the tape higher.", src: "https://example.com/eq", srcName: "Ex" },
    { html: "<strong>R&amp;D &mdash; spending rose</strong> across the sector.", src: "https://example.com/x", srcName: "Ex" },
  ];
  window.__wireRenderBrief();
  const heads = [...document.querySelectorAll("#g-hbrief .g-hbrief-bk")].map((e) => e.textContent.trim());
  const body = (document.querySelector("#g-hbrief .g-hbrief-bt") || {}).textContent || "";
  return { heads, body };
});
check(!amp.heads.some((h) => /r&d/i.test(h)), `a non-canonical desk kicker ("R&D") is dropped by the render guard — only house desks surface (heads: ${amp.heads.join(" · ") || "none"})`);
check(/R&D/.test(amp.body) && !/R&amp;D/.test(amp.body), `a canonical bullet's body entity renders the glyph "R&D", not a double-encoded "R&amp;D" (body "${amp.body.slice(0, 60)}")`);

checkErrs(errs, "home brief tickers");
await ctx.close();
await b.close();
srv.close();
finish();
