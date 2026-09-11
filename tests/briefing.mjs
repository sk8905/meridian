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

// Unread-briefing dot: on a fresh visit (empty localStorage) the current slot
// has never been opened, so the accent dot on the Briefing button is lit.
const dotBefore = await pg.evaluate(() => {
  const d = document.querySelector("#na-brief .na-brief-dot");
  return d ? { present: true, visible: !d.hidden && getComputedStyle(d).display !== "none" } : { present: false };
});
check(dotBefore.present, "unread-briefing dot present on the Briefing button");
check(dotBefore.visible, "unread-briefing dot is lit on a fresh visit (current slot unread)");

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
  // Colour cues: topic headings orange (--accent), numbers blue (--wb-txt); the
  // source links must stay intact (their URLs contain digits we must NOT recolour).
  const rgb = (v) => { const s = document.createElement("span"); s.style.color = v; document.body.appendChild(s); const c = getComputedStyle(s).color; s.remove(); return c; };
  const topic = p.querySelector(".na-brief-b .nb-topic"), num = p.querySelector(".na-brief-b .nb-num");
  const srcHrefOk = [...p.querySelectorAll(".na-brief-b .na-brief-src")].every((a) => /^https?:\/\//.test(a.getAttribute("href") || "") && !a.querySelector(".nb-num"));
  // Date components must NOT be blue: no .nb-num is a bare 4-digit year, and none is
  // a day immediately followed by a month name.
  const nums = [...p.querySelectorAll(".nb-num")];
  const yearBlue = nums.some((e) => /^(?:19|20)\d\d$/.test(e.textContent.trim()));
  const dayBeforeMonth = nums.some((e) => /^\d{1,2}$/.test(e.textContent.trim()) && /^\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(e.nextSibling ? e.nextSibling.textContent || "" : ""));
  return { visible, chips, onSlot, bullets, srcs, lede,
    topicColor: topic ? getComputedStyle(topic).color : null, accent: rgb("var(--accent)"),
    numColor: num ? getComputedStyle(num).color : null, wbtxt: rgb("var(--wb-txt)"),
    nTopics: p.querySelectorAll(".na-brief-b .nb-topic").length, nNums: nums.length, srcHrefOk, yearBlue, dayBeforeMonth };
});
check(opened && opened.visible, "Briefing button opens the Briefing panel");
check(opened && opened.nTopics >= 1 && opened.topicColor === opened.accent, `briefing topic headings read orange (${opened && opened.topicColor})`);
check(opened && opened.nNums >= 1 && opened.numColor === opened.wbtxt, `briefing numbers read blue (${opened && opened.numColor})`);
check(opened && !opened.yearBlue && !opened.dayBeforeMonth, "briefing: date numbers (bare years, day-before-month) are NOT blue");
check(opened && opened.srcHrefOk, "briefing source links stay intact (URLs not recoloured)");
check(opened && opened.chips.length === 3, `three slot chips — Morning/Afternoon/Evening (${opened ? opened.chips.join(",") : "none"})`);
check(opened && !!opened.onSlot, `a slot is active by default (${opened ? opened.onSlot : "none"})`);
// The panel always DEFAULTS to the most recent briefing (newest date · time
// stamp), not the wall-clock slot — so overnight it never opens a stale slot.
const latest = await pg.evaluate(async () => {
  const m = await import("/briefings.js");
  const B = m.BRIEFINGS || {}; const slots = B.slots || {};
  const order = (B.order || []).filter((k) => slots[k]);
  const stamp = (k) => { const s = slots[k]; const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/); return `${s.date || ""} ${t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"}`; };
  const exp = order.reduce((b, k) => (stamp(k) > stamp(b) ? k : b), order[0]);
  const on = (document.querySelector("#na-brief-panel .na-chip.is-on") || {}).dataset?.slot;
  return { exp, on };
});
check(latest.on === latest.exp, `default slot is the most recent briefing (${latest.on} = ${latest.exp})`);
check(opened && opened.lede > 0, "active slot shows a lede");
check(opened && opened.bullets >= 1, `active slot shows briefing bullets (${opened ? opened.bullets : 0})`);
check(opened && opened.srcs >= 1 && opened.srcs === opened.bullets, `every bullet carries a source link (${opened ? opened.srcs : 0}/${opened ? opened.bullets : 0})`);

// Opening the panel marks the current slot read, so its unread dot clears.
const dotAfter = await pg.evaluate(() => {
  const d = document.querySelector("#na-brief .na-brief-dot");
  return d ? !d.hidden : false;
});
check(!dotAfter, "opening the briefing clears the unread dot for the current slot");

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
// Thresholds track the INVARIANT (the calendar renders the week's releases as
// stacked cards, each with an EPS forecast→actual and some carrying a note),
// not a specific rich week — the number of releases swings with the calendar,
// so a quiet EPS-only week is valid and must not flip the suite red.
check(earn.cards >= 3, `Earnings: releases render as stacked cards (${earn.cards})`);
check(earn.epsLabel && earn.fctArrow, "Earnings: each release shows a forecast → actual EPS measure");
check(earn.notes >= 1, `Earnings: a note line renders under a release (${earn.notes})`);
// Non-EPS key metrics (bank/energy pre-tax, RC profit) only appear when such
// companies report that week; when present they must be tagged AND a reported
// one surfaces its actual — a quiet week with none is a valid pass.
if (earn.metricTags > 0) check(earn.kmReported, `Earnings: a tagged non-EPS key metric surfaces its actual (${earn.metricTags} tagged)`);
else check(true, "Earnings: EPS-only week — no non-EPS key metrics to surface");

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
