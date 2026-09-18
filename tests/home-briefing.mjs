// Home briefing card: the tri-daily market brief (BRIEFINGS — Morning/Afternoon/
// Evening) surfaced at the HEAD of the News wire, above "Today". It reuses the
// shared colour marking (orange desk kicker), caps to 4 bullets, links each
// source, and is collapsible (per viewer). Here only /api/hero + /api/xfeed are
// stubbed; the briefing is a static data import, so it renders with real content.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const HERO = { asOf: "2026-09-18", instruments: ["spx", "ndx", "ust10", "oil", "gold", "btc"].map((k, i) => ({
  key: k, label: k.toUpperCase(), unit: "", pre: "", dp: 2, fi: false, value: 100 + i,
  history: Array.from({ length: 30 }, (_, j) => [Date.now() - (29 - j) * 864e5, 100 + i + j * 0.1]),
})) };
const srv = await serve({ "/api/hero": () => [200, JSON.stringify(HERO)], "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })] });
const b = await launchChromium();

// --- Desktop: the card leads the News column, above the feed ------------------
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector("#g-hbrief .g-hbrief-head", { timeout: 8000 });
  await pg.waitForTimeout(150);

  const r = await pg.evaluate(() => {
    const el = document.getElementById("g-hbrief");
    const head = el.querySelector(".g-hbrief-head");
    const feedHead = document.getElementById("g-feed-head");
    const wrap = document.querySelector(".g-feed-wrap");
    const bullets = [...el.querySelectorAll(".g-hbrief-b")];
    const box = (n) => { const b = n.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom) }; };
    return {
      shown: !el.hidden && getComputedStyle(el).display !== "none",
      title: (el.querySelector(".g-hbrief-ttl") || {}).textContent || "",
      slots: el.querySelectorAll(".g-hbrief-slot").length,
      slotOn: (el.querySelector(".g-hbrief-slot.is-on") || {}).textContent || "",
      hasLede: !!el.querySelector(".g-hbrief-lede"),
      bullets: bullets.length,
      hasKicker: !!el.querySelector(".g-hbrief-b .nb-topic"),
      allSourced: bullets.length > 0 && bullets.every((li) => /^https?:\/\//.test((li.querySelector(".g-hbrief-src") || {}).getAttribute?.("href") || "")),
      insideWrap: !!wrap && wrap.contains(el),
      aboveFeed: feedHead ? box(el).bottom <= box(feedHead).top + 2 : false,
      open: el.dataset.open,
    };
  });
  check(r.shown, "desktop: the briefing card renders on the News column");
  check(/briefing/i.test(r.title), `desktop: the card is titled "Market briefing" (${r.title})`);
  checkEq(r.slots, 3, "desktop: three slot chips (Morning · Afternoon · Evening)");
  check(/morning/i.test(r.slotOn), `desktop: it opens on the freshest slot — Morning (${r.slotOn})`);
  check(r.hasLede && r.bullets >= 1 && r.bullets <= 4, `desktop: a lede + up to four bullets (${r.bullets})`);
  check(r.hasKicker, "desktop: bullets carry the orange desk kicker (.nb-topic)");
  check(r.allSourced, "desktop: every bullet links a real source (grounding, R7)");
  check(r.insideWrap && r.aboveFeed, "desktop: the card sits inside the News column, above the 'Today' feed head");
  check(r.open === "true", "desktop: the card is expanded by default");

  // Collapse: clicking the header folds the body away; clicking again restores it.
  const bodyVis = () => pg.evaluate(() => { const bd = document.querySelector("#g-hbrief .g-hbrief-body"); return !!bd && getComputedStyle(bd).display !== "none"; });
  check(await bodyVis(), "desktop: the briefing body is visible before collapse");
  await pg.evaluate(() => document.querySelector("#g-hbrief .g-hbrief-head").click());
  await pg.waitForTimeout(120);
  check(!(await bodyVis()), "desktop: clicking the header collapses the briefing body");
  const collapsedFlag = await pg.evaluate(() => document.getElementById("g-hbrief").dataset.open);
  checkEq(collapsedFlag, "false", "desktop: the collapsed state is flagged (data-open=false)");
  await pg.evaluate(() => document.querySelector("#g-hbrief .g-hbrief-head").click());
  await pg.waitForTimeout(120);
  check(await bodyVis(), "desktop: clicking the header again expands it");

  // Slot switch: tapping Afternoon changes the active chip and the lede content.
  const ledeBefore = await pg.evaluate(() => (document.querySelector("#g-hbrief .g-hbrief-lede") || {}).textContent || "");
  await pg.evaluate(() => { const c = [...document.querySelectorAll("#g-hbrief .g-hbrief-slot")].find((x) => /afternoon/i.test(x.textContent)); if (c) c.click(); });
  await pg.waitForTimeout(120);
  const afterSwitch = await pg.evaluate(() => ({
    on: (document.querySelector("#g-hbrief .g-hbrief-slot.is-on") || {}).textContent || "",
    lede: (document.querySelector("#g-hbrief .g-hbrief-lede") || {}).textContent || "",
  }));
  check(/afternoon/i.test(afterSwitch.on), `desktop: tapping a slot switches the active chip (${afterSwitch.on})`);
  check(afterSwitch.lede && afterSwitch.lede !== ledeBefore, "desktop: switching the slot swaps in that slot's briefing");

  checkErrs(errs, "home briefing (desktop)");
  await ctx.close();
}

// --- Phone: the card also leads the News pane (the default chip) --------------
{
  const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
  await pg.waitForSelector("#g-hbrief .g-hbrief-head", { timeout: 8000 });
  const p = await pg.evaluate(() => {
    const el = document.getElementById("g-hbrief");
    const shown = !el.hidden && getComputedStyle(el).display !== "none" && el.getBoundingClientRect().height > 0;
    return { shown, bullets: el.querySelectorAll(".g-hbrief-b").length };
  });
  check(p.shown && p.bullets >= 1, `phone: the briefing card shows on the News pane (${p.bullets} bullet[s])`);
  checkErrs(errs, "home briefing (phone)");
  await ctx.close();
}

await b.close(); srv.close();
finish();
