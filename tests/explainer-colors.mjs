// Explainer colour treatment (shared with the briefing): every "Key moments" /
// "why it moved" line reads its topic HEADING as BOLD WHITE (--t-ink/--ink, weight
// 700) — the orange was removed by request. Numbers are still WRAPPED (.nb-num,
// metrics not dates — v2/js/nb-format.js) but read as PLAIN body text: the blue
// number accent was removed by request too. Covers the Dashboard Equities Key
// moments, the Dashboard Rates why-it-moved, and the Macro indicators Key moments.
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
await pg.waitForTimeout(1000);
const rgb = (v) => pg.evaluate((val) => { const s = document.createElement("span"); s.style.color = val; document.body.appendChild(s); const c = getComputedStyle(s).color; s.remove(); return c; }, v);
const ACCENT = await rgb("var(--accent)");
const BLUE = await rgb("var(--wb-txt)");
// The bold-white heading colour is the scoped ink token (--t-ink on the dashboard,
// --ink on macro), so each section computes its own in-scope ink reference rather
// than reading the token off <body>, where those scoped tokens don't resolve.

// ---- Dashboard ▸ Equities "Key moments" -----------------------------------
await pg.evaluate(() => { history.pushState({ v2: true }, "", "/v2/dashboard/equities/"); dispatchEvent(new PopStateEvent("popstate")); });
await pg.waitForTimeout(1300);
const eq = await pg.evaluate(() => {
  const t = document.querySelector(".dsh-km .dsh-km-t");
  const n = document.querySelector(".dsh-km-x .nb-num");
  let inkRef = null;
  if (t) { const p = document.createElement("span"); p.style.color = "var(--t-ink)"; t.parentElement.appendChild(p); inkRef = getComputedStyle(p).color; p.remove(); }
  return {
    heading: t ? getComputedStyle(t).color : null,
    weight: t ? getComputedStyle(t).fontWeight : null,
    inkRef,
    hasNum: !!n,
    numColor: n ? getComputedStyle(n).color : null,
    // No .nb-num may be a bare year or a day-before-month (dates stay plain).
    badDate: [...document.querySelectorAll(".dsh-km-x .nb-num")].some((e) => {
      const s = e.textContent.trim();
      return /^(?:19|20)\d\d$/.test(s) || (/^\d{1,2}$/.test(s) && /^\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test((e.nextSibling || {}).textContent || ""));
    }),
  };
});
check(eq.heading === eq.inkRef && eq.heading !== ACCENT && eq.weight === "700", `dashboard Key-moment heading reads BOLD WHITE, not orange (${eq.heading} / ${eq.weight})`);
check(eq.hasNum && eq.numColor !== BLUE, `dashboard Key-moment numbers read PLAIN, not the old blue accent (${eq.numColor})`);
check(!eq.badDate, "dashboard Key-moment date components are NOT blue");

// Entity safety: the number-colouring must NEVER split an HTML entity (esc()'s
// apostrophe is &#39;) — that would leak literal "&#39;" into the page. Guard both
// the live text and the nbNums round-trip.
const noLeak = await pg.evaluate(() => [...document.querySelectorAll(".dsh-km-x, .mac-km-x, .na-fx-km, .na-brief-b, .na-brief-lede")].every((el) => !/&#\d/.test(el.textContent)));
check(noLeak, "no explainer leaks a literal HTML entity (e.g. &#39;) into its text");
const rt = await pg.evaluate(async () => {
  const m = await import("/v2/js/nb-format.js?v=v2-2");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const src = "Japan's PPI up 3.2% in 2023 on 16 September — Norway's fund";
  const d = document.createElement("div"); d.innerHTML = m.nbNums(esc(src)); document.body.appendChild(d);
  const txt = d.textContent; const nBlue = d.querySelectorAll(".nb-num").length; d.remove();
  return { txt, nBlue };
});
check(rt.txt === "Japan's PPI up 3.2% in 2023 on 16 September — Norway's fund", `nbNums preserves apostrophes/entities verbatim (${rt.txt})`);
check(rt.nBlue === 1, `nbNums still wraps the metric but not the date/year (${rt.nBlue} wrapped)`);

// ---- Dashboard ▸ Rates "why it moved" (renders with committed IND_KEYMOMENTS) ---
await pg.evaluate(() => { const c = [...document.querySelectorAll('.dsh-railnav .dsh-navchip[data-sub]')].find((x) => x.dataset.sub === "rates" || x.dataset.sub === "fixed-income"); if (c) c.click(); });
await pg.waitForTimeout(600);
const rates = await pg.evaluate(() => {
  const t = document.querySelector(".dsh-km .dsh-km-t");
  let inkRef = null;
  if (t) { const p = document.createElement("span"); p.style.color = "var(--t-ink)"; t.parentElement.appendChild(p); inkRef = getComputedStyle(p).color; p.remove(); }
  return { present: !!t, heading: t ? getComputedStyle(t).color : null, weight: t ? getComputedStyle(t).fontWeight : null, inkRef };
});
check(!rates.present || (rates.heading === rates.inkRef && rates.weight === "700"), `rates why-it-moved heading bold white when present (${rates.heading} / ${rates.weight})`);

// ---- Macro ▸ indicators Key moments ---------------------------------------
await pg.evaluate(() => { history.pushState({ v2: true }, "", "/v2/macro/"); dispatchEvent(new PopStateEvent("popstate")); });
await pg.waitForTimeout(1400);
const mac = await pg.evaluate(() => {
  const t = document.querySelector(".mac-km-t");
  let inkRef = null;
  if (t) { const p = document.createElement("span"); p.style.color = "var(--ink)"; t.parentElement.appendChild(p); inkRef = getComputedStyle(p).color; p.remove(); }
  return { present: !!t, heading: t ? getComputedStyle(t).color : null, weight: t ? getComputedStyle(t).fontWeight : null, inkRef, numBlue: (() => { const n = document.querySelector(".mac-km-x .nb-num"); return n ? getComputedStyle(n).color : null; })() };
});
check(!mac.present || (mac.heading === mac.inkRef && mac.weight === "700"), `macro Key-moment heading bold white when present (${mac.heading} / ${mac.weight})`);
if (mac.present && mac.numBlue) check(mac.numBlue !== BLUE, `macro Key-moment numbers read PLAIN, not blue, when present (${mac.numBlue})`);
else check(true, "macro Key-moment: no numbers to colour this render");

checkErrs(errs, "explainer colours");
await ctx.close();
await b.close(); srv.close();
finish();
