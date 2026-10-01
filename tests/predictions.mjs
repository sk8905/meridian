// Prediction-markets pane (right rail, #g-predict) — characterization spec written
// BEFORE migrating the pane to a Preact + Signals island, so the migration is proven
// behaviour-preserving. Covers: the super-group filter chips, the default Largest
// view, row shape (question · odds · daily change), switching filters, and the Top
// Movers Up/Down toggle.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const PREDICT = { markets: [
  { q: "Fed cuts rates in December?", type: "Fed & rates", yes: 62, chg: 3.2, vol: 2_500_000, venue: "Polymarket", url: "https://ex/1", end: "2026-12-31" },
  { q: "US recession called in 2027?", type: "Economy", yes: 28, chg: -1.5, vol: 1_200_000, venue: "Polymarket", url: "https://ex/2", end: "2027-12-31" },
  { q: "Trump approval above 45%?", type: "Trump", yes: 41, chg: 0.8, vol: 800_000, venue: "Polymarket", url: "https://ex/3" },
  { q: "BTC above $150k this year?", type: "Crypto", yes: 15, chg: -4.1, vol: 3_000_000, venue: "Polymarket", url: "https://ex/4" },
  { q: "S&P 500 ends the year up?", type: "Equities", yes: 71, chg: 0, vol: 500_000, venue: "Polymarket", url: "https://ex/5" },
] };

const srv = await serve({ "/api/predict": () => [200, JSON.stringify(PREDICT)] });
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-predict .g-pred-fchip", { timeout: 8000 });

const read = () => pg.evaluate(() => {
  const el = document.getElementById("g-predict");
  const chips = [...el.querySelectorAll(".g-pred-fchip")];
  const rows = [...el.querySelectorAll(".g-pred-row")];
  return {
    chips: chips.map((c) => c.textContent.trim()),
    onChip: (chips.find((c) => c.classList.contains("on")) || {}).textContent?.trim() || "",
    sections: [...el.querySelectorAll(".g-pred-sec")].map((s) => s.textContent.trim()),
    rowCount: rows.length,
    firstRow: rows[0] ? {
      q: (rows[0].querySelector(".tui-li-t") || {}).textContent || "",
      odds: (rows[0].querySelector(".g-pred-odds") || {}).textContent || "",
      hasChg: !!rows[0].querySelector(".g-pred-chg"),
      href: rows[0].getAttribute("href") || "",
    } : null,
    hasDirToggle: !!el.querySelector(".g-pred-dir"),
    dirOn: (el.querySelector(".g-pred-dir.on") || {}).textContent?.trim() || "",
  };
});
const clickChip = (label) => pg.evaluate((l) => { const c = [...document.querySelectorAll("#g-predict .g-pred-fchip")].find((x) => x.textContent.trim() === l); c && c.click(); }, label);
const clickDir = (label) => pg.evaluate((l) => { const d = [...document.querySelectorAll("#g-predict .g-pred-dir")].find((x) => x.textContent.trim() === l); d && d.click(); }, label);

// --- Default: Largest, all five markets, well-formed rows ----------------------
let s = await read();
checkEq(s.chips.join(" · "), "Largest · Top Movers · Macro · Politics · Finance", "the five super-group filter chips render");
checkEq(s.onChip, "Largest", "Largest is the default filter");
check(s.sections.includes("Largest markets"), "the Largest view is labelled 'Largest markets'");
checkEq(s.rowCount, 5, `all five markets render as rows (${s.rowCount})`);
check(!!s.firstRow && /BTC above \$150k/.test(s.firstRow.q), `rows are ordered by size (largest vol first — BTC $3M: ${s.firstRow && s.firstRow.q})`);
check(!!s.firstRow && /%/.test(s.firstRow.odds) && s.firstRow.hasChg && /^https:/.test(s.firstRow.href), "each row carries odds %, a daily-change cell and a market link");

// --- Macro super-group: only Fed & rates + Economy sub-sections ----------------
await clickChip("Macro"); await pg.waitForTimeout(100);
s = await read();
checkEq(s.onChip, "Macro", "clicking Macro activates it");
check(s.sections.includes("Fed & rates") && s.sections.includes("Economy") && !s.sections.includes("Trump"), `Macro shows only its own types (${s.sections.join(", ")})`);
checkEq(s.rowCount, 2, `Macro has its two markets (${s.rowCount})`);

// --- Top Movers: Up/Down toggle, defaults to Up (increases only) ---------------
await clickChip("Top Movers"); await pg.waitForTimeout(100);
s = await read();
check(s.hasDirToggle && s.dirOn === "Up", "Top Movers shows an Up/Down toggle, defaulting to Up");
checkEq(s.rowCount, 2, `Up shows the two risers (Fed +3.2, Trump +0.8) (${s.rowCount})`);
await clickDir("Down"); await pg.waitForTimeout(100);
s = await read();
check(s.dirOn === "Down", "tapping Down selects the decreases view");
checkEq(s.rowCount, 2, `Down shows the two fallers (BTC −4.1, Economy −1.5) (${s.rowCount})`);

checkErrs(errs, "prediction markets");
await ctx.close();
await b.close(); srv.close();
finish();
