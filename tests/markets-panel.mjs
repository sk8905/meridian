// iPhone Markets panel (header chart icon → full-screen tabs). Reorganised to
// mirror the Home rails: Equities (the left rail — markets · top movers · FX),
// Macro (the right rail bar predictions — Key rates · Spreads · Volatility · Yield
// curve · Policy rate) and Predictions. Portfolio is gone. Every data row carries a
// ~1-month sparkline tinted green-up / red-down, on an evenly-spread grid.
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const up = (b) => Array.from({ length: 22 }, (_, i) => b * (1 + Math.sin(i / 3) * 0.03 + i * 0.004));
const dn = (b) => Array.from({ length: 22 }, (_, i) => b * (1 + Math.sin(i / 3) * 0.03 - i * 0.004));
const MARKETS = { markets: [
  { label: "S&P 500", value: 7764.7, changePct: 1.49, history: up(7600), marketState: "REGULAR" },
  { label: "NASDAQ", value: 27122, changePct: 2.26, history: up(26500), marketState: "REGULAR" },
  { label: "Oil", value: 90.51, changePct: -5.5, history: dn(96) },
], moversEtf: [
  { label: "Semis", changePct: 4.02, href: "https://x" }, { label: "Long Treasuries", changePct: 0.68, href: "https://x" },
], moversExtra: [
  { label: "VIX", value: 14.81, changePct: -0.4, history: dn(16) },
  { label: "MOVE", value: 81.2, changePct: 0.69, history: up(80) },
  { label: "CDX HY", value: 20.54, changePct: 0.24, history: up(20.4) },
  { label: "GBP/USD", value: 1.337, changePct: -0.1 }, { label: "EUR/USD", value: 1.081, changePct: 0.1 }, { label: "USD/JPY", value: 149.2, changePct: 0.2 },
] };
const RATES = { rates: [
  { label: "3M EURIBOR", value: 2.51, unit: "%", change: 0.09, href: "https://x", history: up(2.4) },
  { label: "US 10Y", value: 4.96, unit: "%", change: -0.05, href: "https://x", history: dn(4.7) },
  { label: "US 2Y", value: 4.76, unit: "%", change: 0.54, href: "https://x", history: up(4.5) },
  { label: "US IG OAS", value: 0.77, unit: "bp", change: -0.01, href: "https://x", history: dn(0.8) },
  { label: "US HY OAS", value: 2.68, unit: "bp", change: -0.02, href: "https://x", history: dn(2.8) },
  { label: "US CCC OAS", value: 10.83, unit: "bp", change: 0.07, href: "https://x", history: up(10) },
] };
const MACRO = { series: [] };
const HORMUZ = { date: "2026-09-21", total: { latest: 108, avg30: 121, days: 30 }, tanker: { latest: 42, avg30: 47, days: 30 } };

const srv = await serve({
  "/api/markets": () => [200, JSON.stringify(MARKETS)],
  "/api/rates": () => [200, JSON.stringify(RATES)],
  "/api/macro": () => [200, JSON.stringify(MACRO)],
  "/api/hormuz": () => [200, JSON.stringify(HORMUZ)],
  "/api/predict": () => [200, JSON.stringify({ markets: [] })],
  "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })],
});
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#na-mkt", { timeout: 8000 });
await pg.evaluate(() => document.getElementById("na-mkt").click());
await pg.waitForSelector("#na-mkt-panel .na-chip", { timeout: 8000 });
await pg.waitForTimeout(500);

// ---- Tabs: Equities | Macro | Predictions, and NO Portfolio -----------------
const chips = await pg.evaluate(() => [...document.querySelectorAll("#na-mkt-panel .na-chip")].map((c) => c.textContent.trim()));
checkEq(chips.join(" | "), "Equities | Macro | Predictions", "the panel tabs are Equities · Macro · Predictions");
check(!chips.some((c) => /portfolio/i.test(c)), `no Portfolio tab (${chips.join(", ")})`);

// ---- Equities tab (the left rail): markets rows carry a sparkline -----------
const eq = await pg.evaluate(() => {
  const secs = [...document.querySelectorAll("#na-mkt-panel .na-sec span:first-child")].map((s) => s.textContent.trim());
  const mkt = [...document.querySelectorAll("#na-mkt-panel .na-srow")];
  const rowByLabel = (lbl) => [...document.querySelectorAll("#na-mkt-panel .na-mrow")].find((r) => (r.querySelector(".na-l") || {}).textContent.trim().startsWith(lbl));
  const transits = rowByLabel("Transits");
  return { secs, srows: mkt.length, sparks: document.querySelectorAll("#na-mkt-panel .na-srow .na-spark svg polyline").length,
    hasFx: !!document.querySelector("#na-mkt-panel .na-fx-tbl"),
    transitsVal: transits ? (transits.querySelector(".na-v") || {}).textContent.trim() : null,
    earnRows: document.querySelectorAll("#na-mkt-panel .na-earn-row").length,
    earnHasEst: !!document.querySelector("#na-mkt-panel .na-earn-row .na-earn-l") };
});
check(eq.secs.includes("Markets") && eq.secs.includes("Top movers"), `Equities: Markets + Top movers sections (${eq.secs.join(" · ")})`);
check(eq.hasFx, "Equities: the FX matrix renders");
check(eq.srows >= 3 && eq.sparks >= 1, `Equities: market rows carry a sparkline (${eq.sparks} drawn / ${eq.srows} rows)`);
// Hormuz + this-week's-earnings ported from the desktop left rail so the Equities
// tab mirrors it in full (Markets · Top movers · Hormuz · Earnings · FX).
check(eq.secs.includes("Strait of Hormuz") && eq.transitsVal === "108", `Equities: Strait of Hormuz transits row from /api/hormuz (${eq.transitsVal})`);
check(eq.secs.includes("This week's earnings") && eq.earnRows >= 1 && eq.earnHasEst, `Equities: this week's earnings block renders with Est/Act lines (${eq.earnRows} rows)`);

// ---- Macro tab: the five right-rail sections, sparklines, correct OAS -------
await pg.evaluate(() => [...document.querySelectorAll("#na-mkt-panel .na-chip")].find((c) => c.dataset.k === "macro").click());
await pg.waitForSelector("#na-mkt-panel .na-srow", { timeout: 5000 });
await pg.waitForTimeout(200);
const mac = await pg.evaluate(() => {
  const secs = [...document.querySelectorAll("#na-mkt-panel .na-sec span:first-child")].map((s) => s.textContent.trim());
  const rowByLabel = (lbl) => [...document.querySelectorAll("#na-mkt-panel .na-mrow")].find((r) => (r.querySelector(".na-l") || {}).textContent.trim().startsWith(lbl));
  const ig = rowByLabel("US IG OAS");
  const igStroke = (() => { const p = ig && ig.querySelector(".na-spark svg polyline"); return p ? getComputedStyle(p).stroke : null; })();
  const eur = rowByLabel("3M EURIBOR");
  const eurStroke = (() => { const p = eur && eur.querySelector(".na-spark svg polyline"); return p ? getComputedStyle(p).stroke : null; })();
  const probe = (v) => { const t = document.querySelector("#na-mkt-panel .na-srow"); const s = document.createElement("span"); s.style.color = v; t.appendChild(s); const c = getComputedStyle(s).color; s.remove(); return c; };
  const gc = document.querySelector("#na-mkt-panel .na-srow");
  return {
    secs,
    igVal: ig ? (ig.querySelector(".na-v") || {}).textContent.trim() : null,
    igStroke, eurStroke, up: probe("var(--t-up)"), down: probe("var(--t-down)"),
    cols: gc ? getComputedStyle(gc).gridTemplateColumns : null,
    hasPolicy: secs.includes("Policy rate"),
    moodColor: (() => { const m = document.querySelector("#na-mkt-panel .na-pol-mood"); return m ? getComputedStyle(m).color : null; })(),
    // Phase 2: the DERIVED rows (HY−IG, CCC−HY, 2s10s) now draw a diff sparkline, and
    // the US 2Y feeds the Yield-curve panel (not shown as a Key rate).
    derivedDrawn: ["HY − IG", "CCC − HY", "2s10s"].filter((l) => { const r = rowByLabel(l); return r && r.querySelector(".na-spark svg polyline"); }).length,
    twoYRow: !!rowByLabel("2Y"),
  };
});
check(["Key rates", "Spreads", "Volatility", "Yield curve", "Policy rate"].every((s) => mac.secs.includes(s)), `Macro: the five right-rail sections render (${mac.secs.join(" · ")})`);
checkEq(mac.igVal, "77 bp", "Macro: OAS spreads read in basis points (value ×100), not raw percent");
check(mac.eurStroke === mac.up, `Macro: an up-over-the-period sparkline reads green (${mac.eurStroke})`);
check(mac.igStroke === mac.down, `Macro: a down-over-the-period sparkline reads red (${mac.igStroke})`);
const colParts = (mac.cols || "").split(/\s+/).map(parseFloat).filter((n) => !isNaN(n));
const evenCols = colParts.length === 4 && (Math.max(...colParts) - Math.min(...colParts)) < 2;
check(evenCols, `Macro: rows are four EQUAL columns spread across the width — label · spark · value · change (${mac.cols})`);
check(mac.hasPolicy && mac.moodColor && mac.moodColor !== mac.up, "Macro: Policy rate renders with a muted (non-accent) forecast lean");
check(mac.derivedDrawn === 3, `Macro (Phase 2): the derived rows HY−IG · CCC−HY · 2s10s all draw a diff sparkline (${mac.derivedDrawn}/3)`);
check(mac.twoYRow, "Macro: the Yield curve carries a 2Y row (fed by the daily US 2Y)");

checkErrs(errs, "markets panel");
await ctx.close();
await b.close(); srv.close();
finish();
