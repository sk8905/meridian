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

checkErrs(errs, "briefing + key moments");
await ctx.close();
await b.close(); srv.close();
finish();
