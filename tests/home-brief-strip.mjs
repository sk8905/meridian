// iPhone-only markets snapshot STRIP at the top of the Market briefing: square cards for
// S&P 500 · VIX · Oil · Gold · US 10Y (snip-2 format — label+value on top, a direction-
// coloured block with absolute + % change below). A CLOSED cash market shows the futures
// move with a "*" on the value. Reads the same last-good markets/rates cache the rail uses.
// Hidden on the desktop quadrant. Here /api/markets + /api/rates are stubbed deterministically.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const HERO = { asOf: "2026-10-06", instruments: ["spx", "ndx"].map((k, i) => ({
  key: k, label: k.toUpperCase(), unit: "", pre: "", dp: 2, fi: false, value: 100 + i,
  history: Array.from({ length: 30 }, (_, j) => [Date.now() - (29 - j) * 864e5, 100 + i + j * 0.1]),
})) };
const MARKETS = {
  markets: [
    // S&P 500 OPEN (marketState REGULAR) → no star, uses the cash % move.
    { label: "S&P 500", value: 7773.95, change: 51.0, changePct: 0.66, marketState: "REGULAR", asOf: "6 Oct", history: [], href: "https://finance.yahoo.com/quote/%5EGSPC" },
    // Brent (shown as "OIL") CLOSED with a futures move → star, uses futuresPct. The markets
    // feed labels crude "Brent"/"WTI" (not "Oil"), so the strip keys on "Brent".
    { label: "Brent", value: 89.52, change: null, changePct: null, futuresPct: -3.61, marketState: "CLOSED", asOf: "6 Oct", history: [], href: "https://finance.yahoo.com/quote/BZ=F" },
    { label: "Gold", value: 3987.40, change: 12.3, changePct: 0.31, marketState: "REGULAR", asOf: "6 Oct", history: [], href: "https://finance.yahoo.com/quote/GC=F" },
  ],
  moversExtra: [
    { label: "VIX", value: 18.44, change: -0.52, changePct: -2.74, marketState: "REGULAR", history: [], href: "https://finance.yahoo.com/quote/%5EVIX" },
  ],
  moversEtf: [], portfolio: null,
};
const RATES = { rates: [
  { label: "US 10Y", value: 5.31, change: 0.03, unit: "%", asOf: "6 Oct", history: [], href: "https://www.cnbc.com/quotes/US10Y" },
] };
const routes = {
  "/api/hero": () => [200, JSON.stringify(HERO)],
  "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })],
  "/api/markets": () => [200, JSON.stringify(MARKETS)],
  "/api/rates": () => [200, JSON.stringify(RATES)],
};
const srv = await serve(routes);
const b = await launchChromium();

// ---- PHONE: the strip renders its five cards, in order, with the closed-market star ----
{
  const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
  // On phone the briefing rides its own tab (now FIRST) — open it so the pane is visible.
  await pg.waitForSelector('.g-wiretab[data-wire="brief"]', { timeout: 8000 });
  await pg.evaluate(() => document.querySelector('.g-wiretab[data-wire="brief"]').click());
  await pg.waitForSelector("#g-hbrief-strip .g-hbs-card", { timeout: 9000 });
  const strip = await pg.evaluate(() => {
    const cards = [...document.querySelectorAll("#g-hbrief-strip .g-hbs-card")];
    const vis = (() => { const s = document.getElementById("g-hbrief-strip"); const r = s.getBoundingClientRect(); return getComputedStyle(s).display !== "none" && r.width > 0 && r.height > 0; })();
    return {
      vis,
      labels: cards.map((c) => (c.querySelector(".g-hbs-lbl") || {}).textContent),
      spStar: !!(cards[0] && cards[0].querySelector(".g-hbs-star")),      // S&P open → no star
      oilStar: !!(cards.find((c) => /OIL/.test((c.querySelector(".g-hbs-lbl") || {}).textContent || "")) || {}).querySelector?.(".g-hbs-star"),
      oilDir: (cards.find((c) => /OIL/.test((c.querySelector(".g-hbs-lbl") || {}).textContent || "")) || {}).className || "",
      spDir: (cards[0] || {}).className || "",
      spNums: cards[0] ? [...cards[0].querySelectorAll(".g-hbs-n")].map((n) => n.textContent) : [],
      // US 10Y (yield) card: its change block carries BOTH the bp move and the relative % change.
      us10: (() => { const c = cards.find((x) => /US 10Y/.test((x.querySelector(".g-hbs-lbl") || {}).textContent || "")); return c ? { val: (c.querySelector(".g-hbs-val") || {}).textContent, nums: [...c.querySelectorAll(".g-hbs-n")].map((n) => n.textContent), dir: c.className } : null; })(),
      // Uniform sizing: every card (and its coloured change bar) must be the same height —
      // the US 10Y card carries a ONE-LINE chip ("+0.03 pp") where the others carry two, so
      // the change block must GROW to fill the card or its bar would stop short over dark panel.
      cardH: cards.map((c) => Math.round(c.getBoundingClientRect().height)),
      chgH: cards.map((c) => { const g = c.querySelector(".g-hbs-chg"); return g ? Math.round(g.getBoundingClientRect().height) : 0; }),
      // Width fit: the whole strip must fit the viewport (no horizontal scroll), and no card's
      // numbers may be clipped — the five cards share the row (flex:1 1 0) and stay readable.
      stripOverflow: (() => { const s = document.getElementById("g-hbrief-strip"); return s.scrollWidth - s.clientWidth; })(),
      numClip: Math.max(0, ...[...document.querySelectorAll("#g-hbrief-strip .g-hbs-n, #g-hbrief-strip .g-hbs-val")].map((n) => n.scrollWidth - n.clientWidth)),
    };
  });
  check(strip.vis, "phone: the briefing markets-snapshot strip is visible");
  checkEq(strip.labels.join(" · "), "S&P 500 · VIX · OIL · GOLD · US 10Y", "phone: five cards, in order — S&P 500 · VIX · OIL · GOLD · US 10Y");
  check(/\bup\b/.test(strip.spDir) && strip.spNums.some((n) => /\+0\.66%/.test(n)) && strip.spNums.some((n) => /\+51/.test(n)),
    `phone: S&P card is up with absolute + % change (${strip.spNums.join(", ")})`);
  check(!strip.spStar, "phone: an OPEN market (S&P, REGULAR) shows NO '*'");
  check(strip.oilStar && /\bdown\b/.test(strip.oilDir), "phone: a CLOSED market (Oil, shown as OIL from Brent) shows the futures '*' and its direction");
  check(strip.us10 && /5\.31%/.test(strip.us10.val || ""), `phone: the US 10Y card shows the yield level (${strip.us10 && strip.us10.val})`);
  check(strip.us10 && strip.us10.nums.some((n) => /\+3 bp/.test(n)) && strip.us10.nums.some((n) => /\+0\.57%/.test(n)) && /\bup\b/.test(strip.us10.dir),
    `phone: the US 10Y card shows BOTH the bp move and the relative % change (${strip.us10 && strip.us10.nums.join(", ")})`);
  check(strip.stripOverflow <= 1, `phone: the strip fits the viewport width — no horizontal scroll (overflow ${strip.stripOverflow}px)`);
  check(strip.numClip <= 1, `phone: no card value/number is clipped at the larger font size (max overflow ${strip.numClip}px)`);
  check(strip.cardH.length === 5 && new Set(strip.cardH).size === 1, `phone: all five cards are the SAME height — uniform size (${strip.cardH.join(", ")})`);
  check(strip.chgH.length === 5 && new Set(strip.chgH).size === 1, `phone: every card's coloured change bar is the same height (the bar grows to fill, so it always reaches the bottom edge) (${strip.chgH.join(", ")})`);
  checkErrs(errs, "home brief strip (phone)");
  await ctx.close();
}

// ---- DESKTOP: the snapshot strip is hidden (iPhone-only) ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector("#g-hbrief .g-hbrief-head", { timeout: 8000 });
  await pg.waitForTimeout(400);
  const hidden = await pg.evaluate(() => {
    const s = document.getElementById("g-hbrief-strip");
    return !s || getComputedStyle(s).display === "none";
  });
  check(hidden, "desktop: the markets-snapshot strip is hidden (iPhone-only)");
  await ctx.close();
}

await b.close();
srv.close();
finish();
