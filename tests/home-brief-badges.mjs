// Market-briefing data badges: ONE live-data card per desk section, pinning the
// desk's lead instrument to a real, sourced number — Macro → Brent, Equities →
// S&P 500, Fixed income → US 10Y. The badge reads the SAME last-good markets/rates
// payloads the left-rail panels use (no extra request), shows value + a
// direction-coloured change chip (▲/▼ + % move for prices — no absolute point change;
// bp/pp for the yield), and simply stays empty — never fabricated — when the instrument isn't in
// the cache. Here /api/markets + /api/rates are stubbed with known rows so the badge
// values are deterministic.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const HERO = { asOf: "2026-09-18", instruments: ["spx", "ndx"].map((k, i) => ({
  key: k, label: k.toUpperCase(), unit: "", pre: "", dp: 2, fi: false, value: 100 + i,
  history: Array.from({ length: 30 }, (_, j) => [Date.now() - (29 - j) * 864e5, 100 + i + j * 0.1]),
})) };
const MARKETS = {
  markets: [
    { label: "S&P 500", value: 5123.45, change: 24.10, changePct: 0.47, asOf: "18 Sep", history: [], href: "https://finance.yahoo.com/quote/%5EGSPC" },
    { label: "Oil", value: 68.42, change: -0.85, changePct: -1.23, asOf: "18 Sep", history: [], href: "https://finance.yahoo.com/quote/BZ=F" },
  ],
  moversExtra: [], moversEtf: [], portfolio: null,
};
const RATES = { rates: [
  { label: "US 10Y", value: 4.12, change: 0.03, unit: "%", asOf: "18 Sep", history: [], href: "https://www.cnbc.com/quotes/US10Y" },
] };
const srv = await serve({
  "/api/hero": () => [200, JSON.stringify(HERO)],
  "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })],
  "/api/markets": () => [200, JSON.stringify(MARKETS)],
  "/api/rates": () => [200, JSON.stringify(RATES)],
});
const b = await launchChromium();

const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-hbrief .g-hbrief-head", { timeout: 8000 });
await pg.waitForFunction(() => typeof window.__wireRenderBrief === "function", { timeout: 8000 });
// Wait for the stubbed markets + rates to land (so the in-memory rows the badge reads
// are populated before we repaint the brief with our controlled desks).
await pg.waitForSelector("#g-markets .mkt-tile", { timeout: 8000 });
await pg.waitForSelector("#g-rates .rate-tile", { timeout: 8000 });

const r = await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {}, slots = B.slots || {};
  const order = (B.order || []).filter((k) => slots[k]);
  const stamp = (k) => { const s = slots[k]; const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/); return `${s.date || ""} ${t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"}`; };
  const key = order.reduce((best, k) => (stamp(k) > stamp(best) ? k : best), order[0]);
  // Three canonical desks — one each — so every badge mapping is exercised.
  slots[key].bullets = [
    { html: "<strong>Macro &mdash; oil slips as the dollar firms</strong> on a repricing of the rate path.", src: "https://example.com/m", srcName: "Ex" },
    { html: "<strong>Equities &mdash; US stocks edge higher</strong> into the close on light volume.", src: "https://example.com/e", srcName: "Ex" },
    { html: "<strong>Fixed income &mdash; Treasury yields tick up</strong> after a soft auction.", src: "https://example.com/f", srcName: "Ex" },
  ];
  window.__wireRenderBrief();
  const el = document.getElementById("g-hbrief");
  const secs = [...el.querySelectorAll(".g-hbrief-b")];
  const byDesk = {};
  for (const s of secs) {
    const name = ((s.querySelector(".g-hbrief-bk") || {}).textContent || "").trim().toLowerCase();
    const badge = s.querySelector(".g-hb-badge");
    byDesk[name] = badge ? {
      k: (badge.querySelector(".g-hb-badge-k") || {}).textContent || "",
      v: (badge.querySelector(".g-hb-badge-v") || {}).textContent || "",
      c: (badge.querySelector(".g-hb-badge-c") || {}).textContent || "",
      up: badge.classList.contains("up"),
      down: badge.classList.contains("down"),
      href: badge.getAttribute("href") || "",
      // the change chip carries a non-neutral background for a real move (the "band")
      chipTinted: (() => { const chip = badge.querySelector(".g-hb-badge-c"); if (!chip) return false; const bg = getComputedStyle(chip).backgroundColor; return bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent"; })(),
      // one badge per section — never two
      count: s.querySelectorAll(".g-hb-badge").length,
    } : null;
  }
  return {
    total: el.querySelectorAll(".g-hb-badge").length,
    sections: secs.length,
    macro: byDesk["macro"] || null,
    equities: byDesk["equities"] || null,
    fixed: byDesk["fixed income"] || null,
  };
});

checkEq(r.sections, 3, "three desk sections render (Macro · Equities · Fixed income)");
checkEq(r.total, 3, "exactly ONE data badge per section (3 sections → 3 badges)");

// Macro → Brent (a commodity price that FELL): down-coloured, abs + % change.
check(!!r.macro, "the Macro section carries a badge");
if (r.macro) {
  checkEq(r.macro.count, 1, "Macro: a single badge (1 per section)");
  check(/brent/i.test(r.macro.k), `Macro badge is Brent (${r.macro.k})`);
  check(r.macro.v === "68.42", `Macro badge shows the live Brent value (${r.macro.v})`);
  check(r.macro.down && !r.macro.up, "Macro badge is down-coloured (Brent fell)");
  check(/-1\.23%/.test(r.macro.c) && !/0\.85/.test(r.macro.c), `Macro change chip shows the % move only, no absolute point change (${r.macro.c})`);
  check(r.macro.chipTinted, "Macro change chip carries a direction-coloured band");
  check(/yahoo|finance/i.test(r.macro.href), "Macro badge links to the instrument's source");
}

// Equities → S&P 500 (rose): up-coloured, thousands-formatted value.
check(!!r.equities, "the Equities section carries a badge");
if (r.equities) {
  check(/s&p 500|s&amp;p 500/i.test(r.equities.k), `Equities badge is the S&P 500 (${r.equities.k})`);
  check(r.equities.v === "5,123.45", `Equities badge shows the live index value, thousands-grouped (${r.equities.v})`);
  check(r.equities.up && !r.equities.down, "Equities badge is up-coloured (index rose)");
  check(/\+0\.47%/.test(r.equities.c) && !/24\.10/.test(r.equities.c), `Equities change chip shows the % move only, no absolute point change (${r.equities.c})`);
}

// Fixed income → US 10Y (yield rose): up-coloured, yield value + pp change (no % chip).
check(!!r.fixed, "the Fixed income section carries a badge");
if (r.fixed) {
  check(/us 10y/i.test(r.fixed.k), `Fixed income badge is the US 10Y (${r.fixed.k})`);
  check(r.fixed.v === "4.12%", `Fixed income badge shows the live yield (${r.fixed.v})`);
  check(r.fixed.up && !r.fixed.down, "Fixed income badge is up-coloured (yield rose)");
  check(/\+0\.03 pp/.test(r.fixed.c), `Fixed income change chip shows the yield move in pp, not a bogus % (${r.fixed.c})`);
}

// Never fabricate: a desk whose instrument is ABSENT from the cache shows no badge.
const none = await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {}, slots = B.slots || {};
  const order = (B.order || []).filter((k) => slots[k]);
  const stamp = (k) => { const s = slots[k]; const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/); return `${s.date || ""} ${t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"}`; };
  const key = order.reduce((best, k) => (stamp(k) > stamp(best) ? k : best), order[0]);
  // A non-canonical owner-requested desk — no instrument mapping, so no badge placeholder.
  slots[key].bullets = [{ html: "<strong>Legal &mdash; a Big-Law lateral move</strong> reshuffles a credit practice.", src: "https://example.com/l", srcName: "Ex" }];
  window.__wireRenderBrief();
  const el = document.getElementById("g-hbrief");
  return { badges: el.querySelectorAll(".g-hb-badge").length, placeholders: el.querySelectorAll(".g-hbrief-badge").length };
});
checkEq(none.badges, 0, "a non-canonical desk (no instrument mapping) shows no badge — nothing fabricated");
checkEq(none.placeholders, 0, "a non-canonical desk emits no badge placeholder at all");

// Fixed house order (Macro → Fixed income → Equities) and the cap-survival guarantee:
// feed the bullets in a NON-canonical order AND bury the single Equities bullet past
// the HB_MAX_BULLETS cap behind a Macro/Fixed-income-heavy slot. The renderer must
// still (a) order the sections Macro, Fixed income, Equities and (b) keep the Equities
// section — its lead bullet survives the round-robin so it can never be pushed off.
const ord = await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {}, slots = B.slots || {};
  const order = (B.order || []).filter((k) => slots[k]);
  const stamp = (k) => { const s = slots[k]; const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/); return `${s.date || ""} ${t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"}`; };
  const key = order.reduce((best, k) => (stamp(k) > stamp(best) ? k : best), order[0]);
  // Equities appears FIRST in the data and only once, then 3 Macro + 3 Fixed income
  // (7 bullets, cap is 4) — a worst case for the old slice-first-4 logic.
  slots[key].bullets = [
    { html: "<strong>Equities &mdash; US stocks close higher</strong> on a broad rally.", src: "https://example.com/e", srcName: "Ex" },
    { html: "<strong>Macro &mdash; payrolls undershoot</strong> as hiring cools.", src: "https://example.com/m1", srcName: "Ex" },
    { html: "<strong>Macro &mdash; eurozone inflation firms</strong> to a three-year high.", src: "https://example.com/m2", srcName: "Ex" },
    { html: "<strong>Macro &mdash; the housing market stalls</strong> on rate lock-in.", src: "https://example.com/m3", srcName: "Ex" },
    { html: "<strong>Fixed income &mdash; the bond rout steadies</strong> after a sharp sell-off.", src: "https://example.com/f1", srcName: "Ex" },
    { html: "<strong>Fixed income &mdash; French spreads widen</strong> toward a 20-year high.", src: "https://example.com/f2", srcName: "Ex" },
    { html: "<strong>Fixed income &mdash; investors seek refuge</strong> in short-dated paper.", src: "https://example.com/f3", srcName: "Ex" },
  ];
  window.__wireRenderBrief();
  const el = document.getElementById("g-hbrief");
  const names = [...el.querySelectorAll(".g-hbrief-b .g-hbrief-bk")].map((k) => k.textContent.trim().toLowerCase());
  return { names, hasEquities: names.includes("equities") };
});
checkEq(ord.names.join(" > "), "macro > fixed income > equities", "sections render in the fixed house order (Macro → Fixed income → Equities), not data order");
check(ord.hasEquities, "the single Equities bullet survives the bullet cap (round-robin keeps each desk's lead) — never pushed off the card");

checkErrs(errs, "home brief badges");
await ctx.close();
await b.close(); srv.close();
finish();
