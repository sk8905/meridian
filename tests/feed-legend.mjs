// Feed ▸ code legend (R3): every wire carries a small "?" on its FIRST day header that
// explains, in plain language, each code chip the feed engine renders (the eight
// domain codes NWS · MAC · BND · CRD · LAW · HDG · RSH · LTR), the manager-event pills
// Home merges into its wire (RAISE · DEAL · …), and the time-column marks. Every chip
// actually on screen must be explained. Native <details> — keyboard-accessible, no JS
// needed to open; a tap outside / Escape closes it.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const DOMAIN = ["NWS", "MAC", "BND", "CRD", "LAW", "HDG", "RSH", "LTR"];

for (const [name, dev] of [["phone", PHONE], ["desktop", DESKTOP]]) {
  const { ctx, pg, errs } = await open(b, dev, base + "/v2/news/");
  await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 10000 });
  const r = await pg.evaluate(() => {
    const feed = document.querySelector("#g-feed");
    const hdrs = [...feed.querySelectorAll(".g-feed-dayhdr")];
    const lg = feed.querySelectorAll("details.g-feed-legend");
    return { n: lg.length, inFirst: !!(hdrs[0] && hdrs[0].querySelector("details.g-feed-legend")), label: (feed.querySelector(".g-feed-legend > summary") || {}).getAttribute?.("aria-label"),
      onScreen: [...new Set([...feed.querySelectorAll(".g-feed-row .g-feed-code")].map((c) => c.textContent.trim()).filter(Boolean))] };
  });
  checkEq(r.n, 1, `${name}: exactly one legend on the wire`);
  check(r.inFirst && /codes mean/i.test(r.label || ""), `${name}: the "?" sits on the first day header and is labelled (${r.label})`);
  await pg.click("#g-feed .g-feed-legend > summary");
  await pg.waitForTimeout(150);
  const pop = await pg.evaluate(() => {
    const p = document.querySelector("#g-feed .g-feed-legend[open] .g-feed-legend-pop");
    if (!p) return null;
    const rr = p.getBoundingClientRect();
    const codes = [...p.querySelectorAll("dt.g-feed-code")].map((d) => ({ c: d.textContent.trim(), dd: (d.nextElementSibling || {}).textContent || "" }));
    // Is the popover's top-left visible (not hidden under a later sticky day header)?
    const hit = document.elementFromPoint(rr.left + 20, rr.top + rr.height * 0.6);
    return { codes, left: Math.round(rr.left), right: Math.round(rr.right), w: innerWidth, onTop: !!(hit && p.contains(hit)), bg: getComputedStyle(p).backgroundColor, text: p.textContent };
  });
  check(!!pop, `${name}: tapping "?" opens the legend`);
  if (pop) {
    const have = new Set(pop.codes.map((x) => x.c));
    check(DOMAIN.every((c) => have.has(c)), `${name}: all eight domain codes are explained (${DOMAIN.filter((c) => !have.has(c)).join(",") || "none missing"})`);
    check(pop.codes.every((x) => x.dd.trim().length > 8), `${name}: every code has a plain-language explanation`);
    const missing = r.onScreen.filter((c) => !have.has(c));
    checkEq(missing.join(","), "", `${name}: every code chip on the wire is in the legend (${r.onScreen.join(" ")})`);
    check(/≈/.test(pop.text) && /added to Wire/.test(pop.text), `${name}: the time-column marks are explained too`);
    check(pop.left >= 0 && pop.right <= pop.w, `${name}: the legend fits the viewport (${pop.left}–${pop.right} of ${pop.w})`);
    check(pop.onTop, `${name}: the open legend paints above the later sticky day headers`);
    check(pop.bg !== "rgba(0, 0, 0, 0)", `${name}: the legend has an opaque ground (${pop.bg})`);
  }
  // Tap outside → closes.
  await pg.mouse.click(5, Math.round((dev.viewport.height) * 0.75));
  await pg.waitForTimeout(150);
  check(await pg.evaluate(() => !document.querySelector("#g-feed .g-feed-legend[open]")), `${name}: a tap outside closes the legend`);
  checkErrs(errs, `feed legend (${name})`);
  await ctx.close();
}

// Light + dark: the codes keep their chip colours inside the legend.
for (const theme of ["light", "dark"]) {
  const { ctx, pg, errs } = await open(b, { ...PHONE, colorScheme: theme }, base + "/v2/news/");
  await pg.evaluate((t) => { localStorage.setItem("m_theme_pref", t); }, theme);
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-feed .g-feed-legend > summary", { timeout: 10000 });
  await pg.click("#g-feed .g-feed-legend > summary");
  const c = await pg.evaluate(() => {
    const dt = document.querySelector('#g-feed .g-feed-legend-pop dt.g-feed-code.credit');
    const row = document.querySelector("#g-feed .g-feed-row .g-feed-code.credit");
    const dd = document.querySelector("#g-feed .g-feed-legend-pop dd");
    return { dt: dt && getComputedStyle(dt).color, row: row && getComputedStyle(row).color, dd: dd && getComputedStyle(dd).color, bg: getComputedStyle(document.querySelector("#g-feed .g-feed-legend-pop")).backgroundColor };
  });
  check(!c.row || c.dt === c.row, `${theme}: the legend's CRD chip uses the wire's CRD colour (${c.dt})`);
  check(c.dd && c.dd !== c.bg, `${theme}: explanation text is legible on the legend ground (${c.dd} on ${c.bg})`);
  checkErrs(errs, `feed legend (${theme})`);
  await ctx.close();
}

// The Managers lane (manager-event pills) and a desk wire (feedBodyHTML) carry it too.
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/news/");
  await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 10000 });
  const lane = await pg.evaluate(() => { const c = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane, .g-wiretabs button, [data-lane]")].find((x) => /^Managers$/i.test(x.textContent.trim())); if (c) c.click(); return !!c; });
  await pg.waitForTimeout(800);
  if (lane) {
    const m = await pg.evaluate(() => {
      const lg = document.querySelector("#g-feed .g-feed-legend");
      const have = new Set([...(lg ? lg.querySelectorAll("dt.g-feed-code") : [])].map((d) => d.textContent.trim()));
      const shown = [...new Set([...document.querySelectorAll("#g-feed .g-feed-code")].map((c) => c.textContent.trim()).filter(Boolean))];
      return { has: !!lg, missing: shown.filter((c) => !have.has(c)) };
    });
    check(m.has && m.missing.length === 0, `Managers lane: legend present and explains every manager-event pill (missing: ${m.missing.join(",") || "none"})`);
  } else check(false, "Managers lane chip found");
  checkErrs(errs, "feed legend (managers lane)");
  await ctx.close();
}

await b.close(); srv.close();
finish();
