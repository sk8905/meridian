// Macro › Cycle view: alongside the Ray Dalio debt cycle, a Howard Marks market-
// cycle reading (framework + "where we stand" + gauge + Oaktree sources), and a
// compact Market-cycle card in the dashboard cockpit's Regime column.
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/macro/#/cycle`);
await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
await pg.waitForTimeout(1800);

const cyc = await pg.evaluate(() => {
  const txt = (document.querySelector("#app") || document.body).textContent || "";
  const heads = Array.from(document.querySelectorAll("h2.macro-section-h")).map((h) => h.textContent.trim());
  const links = Array.from(document.querySelectorAll("#app a[href]")).map((a) => a.getAttribute("href"));
  return {
    hasDebtHead: heads.some((h) => /debt cycle/i.test(h) && /dalio/i.test(h)),
    hasMarketHead: heads.some((h) => /market cycle/i.test(h) && /marks/i.test(h)),
    mentionsPendulum: /pendulum/i.test(txt),
    mentionsSeaChange: /sea change/i.test(txt),
    mentionsWhereStand: /where we stand/i.test(txt),
    hasOaktree: links.some((h) => /oaktreecapital\.com\/insights\/memo/i.test(h || "")),
    gaugeCount: document.querySelectorAll("#app svg.gauge").length,
  };
});
check(cyc.hasDebtHead, "Cycle view keeps the Ray Dalio debt-cycle section");
check(cyc.hasMarketHead, "Cycle view adds a Howard Marks market-cycle section");
check(cyc.mentionsPendulum, "market cycle explains the pendulum of psychology");
check(cyc.mentionsSeaChange, "market cycle cites the 'Sea Change' regime call");
check(cyc.mentionsWhereStand, "market cycle has a 'Where we stand' read");
check(cyc.hasOaktree, "market cycle links a real Oaktree/Howard Marks memo");
check(cyc.gaugeCount >= 2, `both cycles render a gauge (${cyc.gaugeCount} gauges)`);

// Dashboard cockpit Regime column carries a compact Market-cycle card.
await pg.evaluate(() => { location.hash = "#/dashboard"; });
await pg.waitForTimeout(1400);
const dash = await pg.evaluate(() => {
  const heads = Array.from(document.querySelectorAll(".ck-panel .ck-h span")).map((s) => s.textContent.trim());
  return { hasMarks: heads.some((h) => /market cycle/i.test(h) && /marks/i.test(h)), hasDalio: heads.some((h) => /debt cycle/i.test(h)) };
});
check(dash.hasDalio, "dashboard Regime keeps the debt-cycle card");
check(dash.hasMarks, "dashboard Regime adds the Howard Marks market-cycle card");

checkErrs(errs, "macro market cycle");
await ctx.close();
await b.close(); srv.close();
finish();
