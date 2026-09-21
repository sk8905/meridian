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
    const hero = document.querySelector(".g-hero");
    const feedWrap = document.querySelector(".g-feed-wrap");
    const sections = [...el.querySelectorAll(".g-hbrief-b")];
    const items = [...el.querySelectorAll(".g-hbrief-bt")];
    const srcs = [...el.querySelectorAll(".g-hbrief-src")];
    const kickers = [...el.querySelectorAll(".g-hbrief-b .nb-topic")].map((k) => k.textContent.trim().toLowerCase());
    const box = (n) => { const b = n.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom), left: Math.round(b.left), right: Math.round(b.right) }; };
    const eb = box(el), hb = hero && box(hero), fb = feedWrap && box(feedWrap);
    return {
      shown: !el.hidden && getComputedStyle(el).display !== "none",
      title: (el.querySelector(".g-hbrief-ttl") || {}).textContent || "",
      slots: el.querySelectorAll(".g-hbrief-slot").length,
      when: (el.querySelector(".g-hbrief-when") || {}).textContent || "",
      hasLede: !!el.querySelector(".g-hbrief-lede"),
      sections: sections.length,
      itemCount: items.length,
      hasKicker: kickers.length > 0,
      // Every item (including a grouped desk's follow-on items) links a real source.
      allSourced: items.length > 0 && srcs.length === items.length && srcs.every((a) => /^https?:\/\//.test(a.getAttribute("href") || "")),
      // ONE section per desk: exactly one kicker per section, and no desk repeats.
      kickers,
      oneKickerPerSection: kickers.length === sections.length,
      kickersUnique: new Set(kickers).size === kickers.length,
      // 2×2 centre: the briefing is the top-LEFT quadrant — left of the chart (same
      // row) and above the news wire (same column).
      leftOfHero: !!hb && eb.right <= hb.left + 2,
      aboveFeed: !!fb && eb.bottom <= fb.top + 2,
      rowAlignedWithHero: !!hb && Math.abs(eb.top - hb.top) <= 2,
      open: el.dataset.open,
    };
  });
  check(r.shown, "desktop: the briefing card renders on the News column");
  check(/briefing/i.test(r.title), `desktop: the card is titled "Market briefing" (${r.title})`);
  checkEq(r.slots, 0, "desktop: NO slot selector — only the latest brief is shown");
  check(/\d/.test(r.when), `desktop: the header shows the brief's freshness stamp (${r.when})`);
  check(r.hasLede && r.sections >= 1 && r.sections <= 3, `desktop: a lede + one section per desk, ≤3 (${r.sections} sections, ${r.itemCount} items)`);
  check(r.hasKicker, "desktop: bullets carry the orange desk kicker (.nb-topic)");
  check(r.allSourced, "desktop: every item links a real source (grounding, R7)");
  check(r.oneKickerPerSection && r.kickersUnique, `desktop: one section per desk — no repeated kicker (${r.kickers.join(", ")})`);
  check(r.leftOfHero && r.aboveFeed && r.rowAlignedWithHero, "desktop: the briefing is the top-left quadrant of the 2×2 (left of the chart, above the news wire)");
  check(r.open === "true", "desktop: the card is OPEN by default (it is a full quadrant, not a slim bar)");

  // Desktop: the briefing is PERMANENTLY open — no collapse control. Its header
  // matches the other panes (.tui-ph look: title-case, faint sub-label, no chevron),
  // and clicking it does NOT collapse the card.
  const bodyVis = () => pg.evaluate(() => { const bd = document.querySelector("#g-hbrief .g-hbrief-body"); return !!bd && getComputedStyle(bd).display !== "none"; });
  check(await bodyVis(), "desktop: the briefing body is expanded");
  const hdr = await pg.evaluate(() => {
    const t = document.querySelector(".g-hbrief-ttl"); const cs = t && getComputedStyle(t);
    const chev = document.querySelector(".g-hbrief-chev");
    return { title: (t && t.textContent) || "", notMono: !!cs && !/mono/i.test(cs.fontFamily), notUpper: !!cs && cs.textTransform === "none", chevHidden: !chev || getComputedStyle(chev).display === "none" };
  });
  check(/market briefing/i.test(hdr.title) && hdr.notMono && hdr.notUpper, "desktop: the header matches the panel style (title-case 'Market briefing', not mono/uppercase)");
  check(hdr.chevHidden, "desktop: no collapse chevron — the card is permanently open");
  await pg.evaluate(() => document.querySelector("#g-hbrief .g-hbrief-head").click());
  await pg.waitForTimeout(120);
  const stillOpen = await bodyVis() && (await pg.evaluate(() => document.getElementById("g-hbrief").dataset.open)) === "true";
  check(stillOpen, "desktop: clicking the header does NOT collapse it");

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

  // The lede is a synthesis, NOT a restatement: no bullet's lead sentence (after its
  // "Desk —" kicker) is copied verbatim into the lede. A ~28-char normalised run of a
  // bullet lead appearing in the lede would mean ~5+ words lifted straight in.
  const restate = await pg.evaluate(async () => {
    const m = await import("/briefings.js");
    const B = m.BRIEFINGS || {}, slots = B.slots || {};
    const order = (B.order || []).filter((k) => slots[k]);
    const stamp = (k) => { const s = slots[k]; const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/); return `${s.date || ""} ${t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"}`; };
    const k = order.reduce((b, x) => (stamp(x) > stamp(b) ? x : b), order[0]);
    const s = slots[k]; if (!s) return { ok: true, hit: "" };
    const norm = (t) => String(t || "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;|&#\d+;/gi, " ").toLowerCase().replace(/[^a-z0-9]/g, "");
    const lede = norm(s.lede);
    let hit = "";
    for (const b of (s.bullets || [])) {
      const lead = norm(String(b.html || "").replace(/^\s*<strong>\s*[^<]*?\s*(?:&mdash;|—)\s*/, "")).slice(0, 28);
      if (lead.length >= 20 && lede.includes(lead)) { hit = lead; break; }
    }
    return { ok: !hit, hit };
  });
  check(restate.ok, `desktop: the lede does not restate a bullet verbatim${restate.hit ? ` (found "${restate.hit}")` : ""}`);

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
    const chev = el.querySelector(".g-hbrief-chev");
    return { shown, bullets: el.querySelectorAll(".g-hbrief-b").length, open: el.dataset.open, chevShown: !!chev && getComputedStyle(chev).display !== "none" };
  });
  check(p.shown && p.bullets >= 1, `phone: the briefing card shows on the News pane (${p.bullets} bullet[s])`);

  // Collapse is RETAINED on the phone: default collapsed, with the chevron, and the
  // header toggles the body.
  check(p.open === "false", "phone: the briefing is collapsed by default");
  check(p.chevShown, "phone: the collapse chevron is shown (the card is collapsible)");
  const bodyVisP = () => pg.evaluate(() => { const bd = document.querySelector("#g-hbrief .g-hbrief-body"); return !!bd && getComputedStyle(bd).display !== "none"; });
  check(!(await bodyVisP()), "phone: the body is collapsed by default");
  await pg.evaluate(() => document.querySelector("#g-hbrief .g-hbrief-head").click());
  await pg.waitForTimeout(120);
  check(await bodyVisP() && (await pg.evaluate(() => document.getElementById("g-hbrief").dataset.open)) === "true", "phone: tapping the header expands the briefing");
  await pg.evaluate(() => document.querySelector("#g-hbrief .g-hbrief-head").click());
  await pg.waitForTimeout(120);
  check(!(await bodyVisP()), "phone: tapping again collapses it");
  checkErrs(errs, "home briefing (phone)");
  await ctx.close();
}

await b.close(); srv.close();
finish();
