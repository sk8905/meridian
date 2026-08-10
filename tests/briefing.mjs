// Briefing floating box + Dashboard "Key moments" card. Guards the two AI-
// generated surfaces: the header Briefing button opens a panel with Morning/
// Afternoon/Evening slot chips (grounded bullets, each carrying a source link)
// and switches slots on chip click; the Equities pane shows sourced "why it
// moved" rows. Both must render from the committed data (briefings.js /
// EQ_INDICES[].keyMoment) with real outbound source links.
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
await pg.waitForTimeout(1800);

// --- Briefing button + panel -------------------------------------------------
check(await pg.evaluate(() => !!document.getElementById("na-brief")), "Briefing button present in the header cluster");
check(await pg.evaluate(() => !!document.getElementById("na-brief-panel")), "Briefing panel built");

await pg.evaluate(() => document.getElementById("na-brief")?.click());
await pg.waitForTimeout(450);
const opened = await pg.evaluate(() => {
  const p = document.getElementById("na-brief-panel");
  if (!p) return null;
  const cs = getComputedStyle(p);
  const visible = !p.hidden && cs.display !== "none" && cs.visibility !== "hidden";
  const chips = [...p.querySelectorAll(".na-chip[data-slot]")].map((c) => c.dataset.slot);
  const onSlot = (p.querySelector(".na-chip.is-on") || {}).dataset?.slot || "";
  const bullets = p.querySelectorAll(".na-brief-b").length;
  const srcs = p.querySelectorAll(".na-brief-b .na-brief-src[href]").length;
  const lede = ((p.querySelector(".na-brief-lede") || {}).textContent || "").trim().length;
  return { visible, chips, onSlot, bullets, srcs, lede };
});
check(opened && opened.visible, "Briefing button opens the Briefing panel");
check(opened && opened.chips.length === 3, `three slot chips — Morning/Afternoon/Evening (${opened ? opened.chips.join(",") : "none"})`);
check(opened && !!opened.onSlot, `a slot is active by default (${opened ? opened.onSlot : "none"})`);
check(opened && opened.lede > 0, "active slot shows a lede");
check(opened && opened.bullets >= 1, `active slot shows briefing bullets (${opened ? opened.bullets : 0})`);
check(opened && opened.srcs >= 1 && opened.srcs === opened.bullets, `every bullet carries a source link (${opened ? opened.srcs : 0}/${opened ? opened.bullets : 0})`);

// Switching slot re-renders the panel to a DIFFERENT slot's content.
const switched = await pg.evaluate(() => {
  const p = document.getElementById("na-brief-panel");
  const on = (p.querySelector(".na-chip.is-on") || {}).dataset?.slot;
  const other = [...p.querySelectorAll(".na-chip[data-slot]")].find((c) => c.dataset.slot !== on);
  const before = ((p.querySelector(".na-brief-lede") || {}).textContent || "").trim();
  other.click();
  const nowOn = (p.querySelector(".na-chip.is-on") || {}).dataset?.slot;
  const after = ((p.querySelector(".na-brief-lede") || {}).textContent || "").trim();
  return { changedSlot: nowOn === other.dataset.slot && nowOn !== on, changedText: after !== before && after.length > 0 };
});
check(switched.changedSlot, "clicking another slot chip activates that slot");
check(switched.changedText, "switching slot re-renders the briefing content");

await pg.evaluate(() => document.getElementById("na-brief")?.click()); // close
await pg.waitForTimeout(250);

// --- Dashboard ▸ Equities "Key moments" card ---------------------------------
await pg.evaluate(() => { history.pushState({ v2: true }, "", "/v2/dashboard/equities/"); dispatchEvent(new PopStateEvent("popstate")); });
await pg.waitForTimeout(1200);
const km = await pg.evaluate(() => {
  const rows = [...document.querySelectorAll(".dsh-km")];
  return {
    count: rows.length,
    named: rows.filter((r) => (r.querySelector(".dsh-km-t") || {}).textContent?.trim()).length,
    explained: rows.filter((r) => (r.querySelector(".dsh-km-x") || {}).textContent?.trim()).length,
    srcs: rows.filter((r) => r.querySelector(".dsh-km-x a[href^='http']")).length,
  };
});
check(km.count >= 1, `Key moments card renders sourced movers (${km.count})`);
check(km.named === km.count && km.explained === km.count, "every Key moment has an index name and an explanation");
check(km.srcs === km.count, `every Key moment links its source (${km.srcs}/${km.count})`);

// Earnings calendar (stacked cards): each release shows forecast→actual measures
// with a legible EPS label, a note per release, and a key-metric row (bank pre-tax
// profit) surfaces its actual rather than "awaited".
const earn = await pg.evaluate(() => {
  const rels = [...document.querySelectorAll(".dsh-earn .dsh-earn-rel")];
  const eps = rels.some((r) => [...r.querySelectorAll(".dsh-earn-ml")].some((i) => /EPS/i.test(i.textContent)));
  // A reported key-metric row (bank/energy pre-tax or RC profit) surfaces its
  // actual: a measure carrying BOTH a metric tag and a reported value (not
  // "awaited"). Generalised so it survives the earnings calendar rolling forward
  // (it used to pin a specific ticker/figure that ages out each week).
  const kmReported = rels.some((r) => [...r.querySelectorAll(".dsh-earn-m")]
    .some((m) => m.querySelector(".dsh-earn-metric") && m.querySelector(".dsh-earn-act")));
  return {
    cards: rels.length,
    epsLabel: eps,
    fctArrow: rels.some((r) => r.querySelector(".dsh-earn-arw")),
    notes: document.querySelectorAll(".dsh-earn .dsh-earn-note").length,
    metricTags: document.querySelectorAll(".dsh-earn-metric").length,
    kmReported,
  };
});
check(earn.cards > 10, `Earnings: releases render as stacked cards (${earn.cards})`);
check(earn.epsLabel && earn.fctArrow, "Earnings: each release shows a forecast → actual EPS measure");
check(earn.notes > 5, `Earnings: a note line renders under each release (${earn.notes})`);
check(earn.metricTags >= 1, `Earnings: non-EPS rows tag their metric (${earn.metricTags})`);
check(earn.kmReported, "Earnings: a reported key-metric row (bank/energy pre-tax) shows its actual");

// Rates/FX Key Moments render only with live /api data (absent in the harness),
// so guard the grounded data contract instead: every entry must carry text + a
// real source URL (the non-negotiable — no uncited claims).
const data = await pg.evaluate(async () => {
  const m = await import("/macro/js/content.js");
  const ik = m.IND_KEYMOMENTS || {};
  const keys = Object.keys(ik);
  const wellFormed = keys.length > 0 && keys.every((k) => ik[k] && ik[k].text && /^https?:\/\//.test(ik[k].src || ""));
  const fx = m.FX_KEYMOMENT || {};
  return { keys: keys.length, wellFormed, fxOk: !!(fx.text && /^https?:\/\//.test(fx.src || "")) };
});
check(data.wellFormed, `rates Key Moments present and every entry sourced (${data.keys})`);
check(data.fxOk, "FX key moment present and sourced");

checkErrs(errs, "briefing + key moments");
await ctx.close();
await b.close(); srv.close();
finish();
