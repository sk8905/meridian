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

// The wire's "Dashboard" chip (Macro tab, default view) swaps in the cockpit
// (macroDashPane) — its panel headers link out to the Policy/Cycle/Bubble deep
// dives via .ck-more. R7a bans decorative arrow glyphs on links; a past
// regression appended " →" to five of these labels.
await pg.evaluate(() => { location.hash = "#/dashboard"; });
await pg.waitForTimeout(400);
await pg.evaluate(() => { const b = document.querySelector('#mac-chips [data-k="dash"]'); if (b) b.click(); });
await pg.waitForTimeout(300);
const ck = await pg.evaluate(() => [...document.querySelectorAll("#mac-dash .ck-more")].map((a) => a.textContent));
check(ck.length > 0, `cockpit panel-header "more" links render (${ck.length})`);
check(ck.every((t) => !/[→↗➚»]/.test(t)), "cockpit panel-header 'more' links carry no decorative arrow glyph (R7a)");

checkErrs(errs, "macro market cycle");
await ctx.close();

// The PRIMARY surface: the Dashboard tab (bottom nav) → Macro sub-tab, where the
// user actually looks. It must show a cycle card with BOTH the Dalio debt cycle
// and the Howard Marks market cycle (the Macro desk view above is a deep link,
// not in the bottom tab bar).
const d = await open(b, PHONE, `http://localhost:${srv.port}/v2/dashboard/`);
await d.pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
await d.pg.waitForTimeout(1800);
const dash = await d.pg.evaluate(() => {
  const tab = document.querySelector('.dsh-subtabs [data-p="macro"], [data-sub="macro"], .dsh-subtab[data-p="macro"]');
  if (tab) tab.click();
  const txt = (document.querySelector("#app") || document.body).textContent || "";
  const heads = Array.from(document.querySelectorAll(".dsh-cyc-hd")).map((h) => h.textContent.trim());
  const links = Array.from(document.querySelectorAll("#app .dsh-cyc-src")).map((a) => a.getAttribute("href"));
  return {
    hasDebt: heads.some((h) => /debt cycle/i.test(h) && /dalio/i.test(h)),
    hasMarket: heads.some((h) => /market cycle/i.test(h) && /marks/i.test(h)),
    mentionsPendulum: /pendulum/i.test(txt),
    mentionsStand: /where we stand/i.test(txt),
    hasOaktree: links.some((h) => /oaktreecapital\.com/i.test(h || "")),
    meters: document.querySelectorAll(".dsh-cyc .dsh-fw-bar").length,
  };
});
check(dash.hasDebt, "Dashboard→Macro shows the Dalio debt-cycle block");
check(dash.hasMarket, "Dashboard→Macro shows the Howard Marks market-cycle block");
check(dash.mentionsPendulum, "Dashboard→Macro market cycle explains the pendulum");
check(dash.mentionsStand, "Dashboard→Macro market cycle has a 'where we stand' read");
check(dash.hasOaktree, "Dashboard→Macro market cycle links a real Oaktree memo");
check(dash.meters >= 3, `Dashboard→Macro renders position meters (${dash.meters})`);

// Nested Macro sub-tabs: Policy rates (default) and Cycle. The cycle card is
// hidden until you switch to the Cycle sub-tab; the Fed-path card is a Policy-
// rates card, hidden on the Cycle sub-tab.
const cardVisible = (sel) => d.pg.evaluate((s) => {
  const el = document.querySelector(s);
  return !!(el && el.offsetParent !== null);
}, sel);
const tabs = await d.pg.evaluate(() => Array.from(document.querySelectorAll(".dsh-msub .tchip")).map((b) => b.textContent.trim()));
check(tabs.join(",") === "Policy rates,Cycle", `Macro has two sub-tabs: Policy rates · Cycle (got ${tabs.join(",")})`);
check(await cardVisible('[data-mgrp="rates"] .dsh-h'), "default sub-tab shows Policy-rates cards");
check(!(await cardVisible('[data-mgrp="cycle"]')), "the Cycle card is hidden on the Policy rates sub-tab");
// Switch to Cycle.
await d.pg.evaluate(() => { const b = document.querySelector('[data-msub="cycle"]'); if (b) b.click(); });
await d.pg.waitForTimeout(250);
check(await cardVisible('[data-mgrp="cycle"] .dsh-cyc'), "tapping Cycle shows the cycle card");
check(!(await cardVisible('[data-mgrp="rates"]')), "tapping Cycle hides the Policy-rates cards");

// Both cycle blocks (debt + market) carry a collapsible narrative, collapsed by
// default; expanding one reveals its framework prose.
// Collapse is native <details> (content-visibility:hidden when closed — visually
// collapsed for the reader; headless still reports a layout box, so assert the
// semantic `open` state, not pixels).
const collapse = await d.pg.evaluate(() => {
  const exps = Array.from(document.querySelectorAll('[data-mgrp="cycle"] .dsh-cyc-exp'));
  return { count: exps.length, anyOpenByDefault: exps.some((e) => e.open), bothHaveProse: exps.every((e) => { const b = e.querySelector(".dsh-cyc-body"); return b && (b.textContent || "").trim().length > 200; }) };
});
check(collapse.count === 2, `both cycles have an expand/collapse toggle (${collapse.count})`);
check(!collapse.anyOpenByDefault, "both narratives are collapsed by default (details not open)");
check(collapse.bothHaveProse, "both blocks carry their narrative behind the toggle");
// Expand the first (debt cycle) narrative.
await d.pg.evaluate(() => { const s = document.querySelector('[data-mgrp="cycle"] .dsh-cyc-exp .dsh-cyc-sum'); if (s) s.click(); });
await d.pg.waitForTimeout(250);
const expanded = await d.pg.evaluate(() => {
  const e = document.querySelector('[data-mgrp="cycle"] .dsh-cyc-exp');
  const bd = e && e.querySelector(".dsh-cyc-body");
  return { open: !!(e && e.open), hasProse: !!(bd && /pendulum|Dalio|cycle/i.test(bd.textContent || "")) };
});
check(expanded.open, "clicking the toggle expands the narrative (details open)");
check(expanded.hasProse, "the narrative shows the framework prose");

checkErrs(d.errs, "dashboard macro cycle");
await d.ctx.close();
await b.close(); srv.close();
finish();
