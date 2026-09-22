// The right-rail market gauges are THREE separate panels, each with its own kind
// of instrument — reorganised from the old "Key rates & spreads" + "Volatility &
// risk" pair:
//   • Key rates  (#g-rates)   — benchmark yields only (EURIBOR/SONIA/SOFR/US 10Y)
//   • Spreads    (#g-spreads) — the OAS credit spreads + derived HY−IG / CCC−HY
//   • Volatility (#g-vol)     — VIX, MOVE, CDX HY only
// This stubs /api/rates and /api/markets so each panel renders real tiles, then
// checks the partition: no OAS leaks into Key rates, no vol leaks into Spreads,
// and the volatility panel carries none of the credit spreads.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const RATES = { rates: [
  { label: "3M EURIBOR", value: 2.51, unit: "%", change: 0.09, href: "https://example.com/euribor" },
  { label: "SONIA", value: 3.73, unit: "%", change: 0, href: "https://example.com/sonia" },
  { label: "SOFR", value: 3.85, unit: "%", change: 0, href: "https://example.com/sofr" },
  { label: "US 10Y", value: 4.96, unit: "%", change: -0.05, href: "https://example.com/ust10", history: [4.7, 4.75, 4.8, 4.78, 4.85, 4.9, 4.88, 4.96] },
  { label: "US IG OAS", value: 0.77, unit: "bp", change: -0.01, href: "https://example.com/ig", history: [0.82, 0.81, 0.8, 0.79, 0.78, 0.78, 0.77, 0.77] },
  { label: "US HY OAS", value: 2.68, unit: "bp", change: -0.02, href: "https://example.com/hy" },
  { label: "US CCC OAS", value: 10.83, unit: "bp", change: 0.07, href: "https://example.com/ccc" },
  { label: "EURO HY OAS", value: 2.67, unit: "bp", change: -0.02, href: "https://example.com/ehy" },
] };
const MARKETS = { markets: [{ label: "S&P 500", value: 7764.7, changePct: 0.1 }], moversExtra: [
  { label: "VIX", value: 14.86, changePct: -0.07, history: [16.2, 15.8, 15.5, 15.1, 14.9, 14.95, 14.8, 14.86] },
  { label: "MOVE", value: 81.20, changePct: 0.69 },
  { label: "CDX HY", value: 20.54, changePct: 0.24 },
] };

const srv = await serve({
  "/api/rates": () => [200, JSON.stringify(RATES)],
  "/api/markets": () => [200, JSON.stringify(MARKETS)],
  "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })],
});
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-rates .rate-tile", { timeout: 8000 });
await pg.waitForSelector("#g-spreads .rate-tile", { timeout: 8000 });
await pg.waitForSelector("#g-vol .rate-tile", { timeout: 8000 });
await pg.waitForTimeout(200);

const labels = (sel) => pg.evaluate((s) => [...document.querySelectorAll(`${s} .rate-tile .rate-label`)].map((e) => e.textContent.trim()), sel);
const rates = await labels("#g-rates");
const spreads = await labels("#g-spreads");
const vol = await labels("#g-vol");

// (i) Key rates — the benchmark yields, and NOT any OAS credit spread.
checkEq(rates.join(", "), "3M EURIBOR, SONIA, SOFR, US 10Y", "Key rates: benchmark yields only");
check(!rates.some((l) => /OAS|−/.test(l)), `Key rates: no OAS/spread rows leak in (${rates.join(", ")})`);

// (ii) Spreads — the four OAS levels plus the derived quality/distress premia.
check(["US IG OAS", "US HY OAS", "US CCC OAS", "EURO HY OAS"].every((l) => spreads.includes(l)), `Spreads: carries every OAS level (${spreads.join(", ")})`);
check(spreads.includes("HY − IG") && spreads.includes("CCC − HY"), `Spreads: carries the derived HY−IG and CCC−HY premia (${spreads.join(", ")})`);
check(!spreads.some((l) => /VIX|MOVE|CDX/.test(l)), `Spreads: no volatility instruments leak in (${spreads.join(", ")})`);

// (iii) Volatility — VIX, MOVE, CDX HY only; no OAS or spread differentials.
checkEq(vol.join(", "), "VIX, MOVE, CDX HY", "Volatility: VIX · MOVE · CDX HY only");
check(!vol.some((l) => /OAS|−/.test(l)), `Volatility: no credit spreads leak in (${vol.join(", ")})`);

// The three panels share ONE fixed column grid (label · value · change), so the
// numbers and changes line up vertically down the whole rail — Spreads must not
// fall back to ragged content-sized columns.
const cols = (sel) => pg.evaluate((s) => { const t = document.querySelector(`${s} .rate-tile`); return t ? getComputedStyle(t).gridTemplateColumns : null; }, sel);
const cR = await cols("#g-rates"), cS = await cols("#g-spreads"), cV = await cols("#g-vol");
check(cR && cS && cV && cR === cS && cS === cV, `Key rates / Spreads / Volatility share one column grid so text, numbers & changes align vertically (${cR} | ${cS} | ${cV})`);
check(/^\S+\s+\S+\s+\S+\s+\S+$/.test(cR || ""), `the rail rows are a 4-column grid (label · spark · value · change) (${cR})`);
// The four elements are spread evenly across the row (fixed tracks + space-between),
// so gaps are equal and identical down every panel.
const justify = await pg.evaluate(() => getComputedStyle(document.querySelector("#g-rates .rate-tile")).justifyContent);
check(justify === "space-between", `the row spreads its columns evenly (justify-content: ${justify})`);

// Sparklines: each panel draws a ~1-month trend line (inline SVG polyline) for the
// rows whose feed carries history — and reserves an empty spark cell for every row
// (so columns stay aligned). Data-driven, R7 — no fabricated series.
const sparks = (sel) => pg.evaluate((s) => ({
  cells: document.querySelectorAll(`${s} .rate-tile .rate-spark`).length,
  drawn: document.querySelectorAll(`${s} .rate-tile .rate-spark svg polyline`).length,
}), sel);
const sR = await sparks("#g-rates"), sS = await sparks("#g-spreads"), sV = await sparks("#g-vol");
check(sR.cells === rates.length && sR.drawn >= 1, `Key rates: a spark cell per row, at least one drawn from real history (${sR.drawn}/${sR.cells})`);
check(sS.cells === spreads.length && sS.drawn >= 1, `Spreads: a spark cell per row, at least one drawn (${sS.drawn}/${sS.cells})`);
check(sV.cells === vol.length && sV.drawn >= 1, `Volatility: a spark cell per row, at least one drawn (${sV.drawn}/${sV.cells})`);
// Sparklines are tinted by their NET move over the window: up over the period reads
// green, down reads red. (Stub: US 10Y rises → green; US IG OAS falls → red.)
const colorRef = (v) => pg.evaluate((val) => { const t = document.querySelector("#g-rates .rate-tile"); const s = document.createElement("span"); s.style.color = val; t.appendChild(s); const c = getComputedStyle(s).color; s.remove(); return c; }, v);
const strokeFor = (panel, label) => pg.evaluate(([p, lbl]) => {
  const tile = [...document.querySelectorAll(`${p} .rate-tile`)].find((t) => (t.querySelector(".rate-label") || {}).textContent.trim().startsWith(lbl));
  const pl = tile && tile.querySelector(".rate-spark svg polyline");
  return pl ? getComputedStyle(pl).stroke : null;
}, [panel, label]);
const upRef = await colorRef("var(--t-up)"), downRef = await colorRef("var(--t-down)");
const up10y = await strokeFor("#g-rates", "US 10Y"), downIG = await strokeFor("#g-spreads", "US IG OAS");
check(up10y === upRef, `an up-over-the-period sparkline reads green (${up10y})`);
check(downIG === downRef, `a down-over-the-period sparkline reads red (${downIG})`);

checkErrs(errs, "rates/spreads/volatility split");
await ctx.close();
await b.close(); srv.close();
finish();
