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
    const feedHead = document.getElementById("g-feed-head");
    const wrap = document.querySelector(".g-feed-wrap");
    const bullets = [...el.querySelectorAll(".g-hbrief-b")];
    const box = (n) => { const b = n.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom) }; };
    return {
      shown: !el.hidden && getComputedStyle(el).display !== "none",
      title: (el.querySelector(".g-hbrief-ttl") || {}).textContent || "",
      slots: el.querySelectorAll(".g-hbrief-slot").length,
      when: (el.querySelector(".g-hbrief-when") || {}).textContent || "",
      hasLede: !!el.querySelector(".g-hbrief-lede"),
      bullets: bullets.length,
      hasKicker: !!el.querySelector(".g-hbrief-b .nb-topic"),
      allSourced: bullets.length > 0 && bullets.every((li) => /^https?:\/\//.test((li.querySelector(".g-hbrief-src") || {}).getAttribute?.("href") || "")),
      insideWrap: !!wrap && wrap.contains(el),
      belowFilter: feedHead ? box(el).top >= box(feedHead).bottom - 2 : false,
      open: el.dataset.open,
    };
  });
  check(r.shown, "desktop: the briefing card renders on the News column");
  check(/briefing/i.test(r.title), `desktop: the card is titled "Market briefing" (${r.title})`);
  checkEq(r.slots, 0, "desktop: NO slot selector — only the latest brief is shown");
  check(/\d/.test(r.when), `desktop: the header shows the brief's freshness stamp (${r.when})`);
  check(r.hasLede && r.bullets >= 1 && r.bullets <= 4, `desktop: a lede + up to four bullets (${r.bullets})`);
  check(r.hasKicker, "desktop: bullets carry the orange desk kicker (.nb-topic)");
  check(r.allSourced, "desktop: every bullet links a real source (grounding, R7)");
  check(r.insideWrap && r.belowFilter, "desktop: the card sits inside the News column, below the 'Today' filter row");
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

  // The briefing shows the latest available version (freshest by date·time stamp).
  const latest = await pg.evaluate(async () => {
    const m = await import("/briefings.js");
    const B = m.BRIEFINGS || {}, slots = B.slots || {};
    const order = (B.order || []).filter((k) => slots[k]);
    const stamp = (k) => { const s = slots[k]; const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/); return `${s.date || ""} ${t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"}`; };
    const freshest = order.reduce((b, k) => (stamp(k) > stamp(b) ? k : b), order[0]);
    const key12 = (str) => String(str || "").replace(/<[^>]+>/g, "").replace(/&[a-z]+;|&#\d+;/g, " ").replace(/[^A-Za-z]/g, "").slice(0, 12).toLowerCase();
    const shown = (document.querySelector("#g-hbrief .g-hbrief-lede") || {}).textContent || "";
    return { shownLen: shown.trim().length, match: !!slots[freshest] && key12(shown) === key12(slots[freshest].lede) };
  });
  check(latest.shownLen > 0 && latest.match, "desktop: the shown briefing is the latest available version");

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
