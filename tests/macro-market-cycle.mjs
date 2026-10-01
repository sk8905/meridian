// Market-cycle coverage after the Macro DESK VIEW was retired. The long-form cycle
// analysis lives on its PRIMARY surface — the Dashboard tab → Macro sub-tab — where it
// must show BOTH the Ray Dalio debt cycle and the Howard Marks market cycle (framework,
// "where we stand", gauges, Oaktree sources), with the narratives behind a collapse.
// (The old /v2/macro/#/cycle deep-dive view is gone; this content was always duplicated
// on the Dashboard, which is where the user actually looks.)
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();

// The PRIMARY surface: the Dashboard tab (bottom nav) → Macro sub-tab. It must show a
// cycle card with BOTH the Dalio debt cycle and the Howard Marks market cycle.
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
    // The Market cycle block mirrors the Debt cycle block: US + UK meters and a
    // grey (muted) per-region DESCRIPTOR — not a single bold "Equities" reading.
    mkt: (() => {
      const blk = [...document.querySelectorAll(".dsh-cyc-blk")].find((b2) => /market cycle/i.test((b2.querySelector(".dsh-cyc-hd") || {}).textContent || ""));
      if (!blk) return null;
      const labels = [...blk.querySelectorAll(".dsh-fw-l")].map((l) => l.textContent.trim());
      const note = blk.querySelector(".dsh-cyc-note.dsh-mut");
      return { labels, mutedNote: !!note, noBold: !!note && !note.querySelector("strong") };
    })(),
  };
});
check(dash.hasDebt, "Dashboard→Macro shows the Dalio debt-cycle block");
check(dash.hasMarket, "Dashboard→Macro shows the Howard Marks market-cycle block");
check(dash.mentionsPendulum, "Dashboard→Macro market cycle explains the pendulum");
check(dash.mentionsStand, "Dashboard→Macro market cycle has a 'where we stand' read");
check(dash.hasOaktree, "Dashboard→Macro market cycle links a real Oaktree memo");
check(dash.meters >= 4, `Dashboard→Macro renders position meters (${dash.meters})`);
check(dash.mkt && dash.mkt.labels.join(",") === "US,UK", `Dashboard→Macro market cycle shows US + UK meters (${dash.mkt && dash.mkt.labels.join(",")})`);
check(dash.mkt && dash.mkt.mutedNote && dash.mkt.noBold, "Dashboard→Macro market-cycle descriptor is grey (muted), not bold");

// The Macro pane is a fixed-viewport terminal with side-by-side panes — Policy rates,
// Cycle, Market sizes and the Macro wire — all visible at once (no sub-tabs). The Cycle
// pane carries the Dalio debt + Marks market blocks and a labelled header.
const cardVisible = (sel) => d.pg.evaluate((s) => {
  const el = document.querySelector(s);
  return !!(el && el.offsetParent !== null);
}, sel);
const lbls = await d.pg.evaluate(() => Array.from(document.querySelectorAll(".dsh-term-lbl")).map((b) => b.textContent.trim()));
check(lbls.join(",") === "Policy rates,Cycle,Market sizes,Macro wire", `Macro is labelled Policy rates · Cycle · Market sizes (stacked middle) + Macro wire (right rail) (got ${lbls.join(",")})`);
check(await cardVisible(".dsh-mid .dsh-h"), "the stacked Policy-rates cards are visible");
check(await cardVisible(".dsh-mid .dsh-cyc"), "the Cycle block is visible in the stacked middle");

// Both cycle blocks (debt + market) carry a collapsible narrative, collapsed by default;
// expanding one reveals its framework prose. Collapse is native <details>.
const collapse = await d.pg.evaluate(() => {
  const exps = Array.from(document.querySelectorAll(".dsh-cyc .dsh-cyc-exp"));
  return { count: exps.length, anyOpenByDefault: exps.some((e) => e.open), bothHaveProse: exps.every((e) => { const b = e.querySelector(".dsh-cyc-body"); return b && (b.textContent || "").trim().length > 200; }) };
});
check(collapse.count === 2, `both cycles have an expand/collapse toggle (${collapse.count})`);
check(!collapse.anyOpenByDefault, "both narratives are collapsed by default (details not open)");
check(collapse.bothHaveProse, "both blocks carry their narrative behind the toggle");
// Expand the first (debt cycle) narrative.
await d.pg.evaluate(() => { const s = document.querySelector(".dsh-cyc .dsh-cyc-exp .dsh-cyc-sum"); if (s) s.click(); });
await d.pg.waitForTimeout(250);
const expanded = await d.pg.evaluate(() => {
  const e = document.querySelector(".dsh-cyc .dsh-cyc-exp");
  const bd = e && e.querySelector(".dsh-cyc-body");
  return { open: !!(e && e.open), hasProse: !!(bd && /pendulum|Dalio|cycle/i.test(bd.textContent || "")) };
});
check(expanded.open, "clicking the toggle expands the narrative (details open)");
check(expanded.hasProse, "the narrative shows the framework prose");

checkErrs(d.errs, "dashboard macro cycle");
await d.ctx.close();
await b.close(); srv.close();
finish();
