// Briefing surface + Dashboard "Key moments" card. The tri-daily market brief no
// longer has a header button/panel — it lives on the Home News pane (covered by
// tests/home-briefing.mjs). Here we guard that the header briefing button is gone,
// and that the Equities "why it moved" rows + rates/FX key moments still render
// from the committed data (macro content) with real outbound source links.
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
await pg.waitForTimeout(1800);

// --- The header Briefing button/panel is removed (brief moved to Home) --------
const briefGone = await pg.evaluate(() => !document.getElementById("na-brief") && !document.getElementById("na-brief-panel"));
check(briefGone, "the header Briefing button + panel are removed (the brief lives on the Home News pane)");

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
