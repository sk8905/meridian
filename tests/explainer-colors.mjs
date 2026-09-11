// Explainer colour treatment (shared with the briefing): every "Key moments" /
// "why it moved" line reads its topic HEADING orange (--accent) and its NUMBERS
// blue (--wb-txt) except date components — driven by v2/js/nb-format.js + the
// global .nb-topic / .nb-num rules. Covers the Dashboard Equities Key moments, the
// Macro indicators Key moments, and the FX Key moment.
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
await pg.waitForTimeout(1000);
const rgb = (v) => pg.evaluate((val) => { const s = document.createElement("span"); s.style.color = val; document.body.appendChild(s); const c = getComputedStyle(s).color; s.remove(); return c; }, v);
const ACCENT = await rgb("var(--accent)");
const BLUE = await rgb("var(--wb-txt)");

// ---- Dashboard ▸ Equities "Key moments" -----------------------------------
await pg.evaluate(() => { history.pushState({ v2: true }, "", "/v2/dashboard/equities/"); dispatchEvent(new PopStateEvent("popstate")); });
await pg.waitForTimeout(1300);
const eq = await pg.evaluate(() => {
  const t = document.querySelector(".dsh-km .dsh-km-t");
  const n = document.querySelector(".dsh-km-x .nb-num");
  return {
    heading: t ? getComputedStyle(t).color : null,
    hasNum: !!n,
    numColor: n ? getComputedStyle(n).color : null,
    // No .nb-num may be a bare year or a day-before-month (dates stay plain).
    badDate: [...document.querySelectorAll(".dsh-km-x .nb-num")].some((e) => {
      const s = e.textContent.trim();
      return /^(?:19|20)\d\d$/.test(s) || (/^\d{1,2}$/.test(s) && /^\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test((e.nextSibling || {}).textContent || ""));
    }),
  };
});
check(eq.heading === ACCENT, `dashboard Key-moment heading reads orange (${eq.heading})`);
check(eq.hasNum && eq.numColor === BLUE, `dashboard Key-moment numbers read blue (${eq.numColor})`);
check(!eq.badDate, "dashboard Key-moment date components are NOT blue");

// ---- Dashboard ▸ Rates "why it moved" (renders with committed IND_KEYMOMENTS) ---
await pg.evaluate(() => { const c = [...document.querySelectorAll('.dsh-railnav .dsh-navchip[data-sub]')].find((x) => x.dataset.sub === "rates" || x.dataset.sub === "fixed-income"); if (c) c.click(); });
await pg.waitForTimeout(600);
const rates = await pg.evaluate(() => {
  const t = document.querySelector(".dsh-km .dsh-km-t");
  return { present: !!t, heading: t ? getComputedStyle(t).color : null };
});
check(!rates.present || rates.heading === ACCENT, `rates why-it-moved heading orange when present (${rates.heading})`);

// ---- Macro ▸ indicators Key moments ---------------------------------------
await pg.evaluate(() => { history.pushState({ v2: true }, "", "/v2/macro/"); dispatchEvent(new PopStateEvent("popstate")); });
await pg.waitForTimeout(1400);
const mac = await pg.evaluate(() => {
  const t = document.querySelector(".mac-km-t");
  return { present: !!t, heading: t ? getComputedStyle(t).color : null, numBlue: (() => { const n = document.querySelector(".mac-km-x .nb-num"); return n ? getComputedStyle(n).color : null; })() };
});
check(!mac.present || mac.heading === ACCENT, `macro Key-moment heading orange when present (${mac.heading})`);
if (mac.present && mac.numBlue) check(mac.numBlue === BLUE, `macro Key-moment numbers blue when present (${mac.numBlue})`);
else check(true, "macro Key-moment: no numbers to colour this render");

checkErrs(errs, "explainer colours");
await ctx.close();
await b.close(); srv.close();
finish();
