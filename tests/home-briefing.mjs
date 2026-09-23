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
      // ONE continuous combined item per desk: each desk section renders exactly ONE
      // .g-hbrief-bt (same-desk stories folded together), NOT one per story.
      oneItemPerSection: items.length > 0 && items.length === sections.length,
      // Grounding (R7): every section links at least one real source, and every
      // source link is a real URL — the combined item still cites all it compresses.
      allSourced: srcs.length > 0 && srcs.every((a) => /^https?:\/\//.test(a.getAttribute("href") || ""))
        && sections.every((sec) => sec.querySelectorAll(".g-hbrief-src").length >= 1),
      // A desk carrying two stories is genuinely COMBINED: one .g-hbrief-bt, but two
      // source links on its single trailing line (the real Morning slot has Macro×2).
      combinedDesk: sections.some((sec) => sec.querySelectorAll(".g-hbrief-bt").length === 1 && sec.querySelectorAll(".g-hbrief-src").length >= 2),
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
  check(r.oneItemPerSection, `desktop: each desk is ONE continuous combined item (same-desk stories folded, not stacked) (${r.itemCount} items / ${r.sections} sections)`);
  check(r.combinedDesk, "desktop: a desk with two stories is combined — one item, both sources on a single trailing line");
  check(r.allSourced, "desktop: every combined item links every source it compresses (grounding, R7)");
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

// --- Phone: the briefing is its OWN pane (the Market Briefing tab, the default),
//     always expanded — no collapse — and it fills the page. -------------------
{
  const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
  await pg.evaluate(() => { try { localStorage.removeItem("wire.home.v1"); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-hbrief .g-hbrief-head", { timeout: 8000 });
  await pg.waitForTimeout(400);
  const p = await pg.evaluate(() => {
    const el = document.getElementById("g-hbrief");
    const bd = el.querySelector(".g-hbrief-body");
    const chev = el.querySelector(".g-hbrief-chev");
    const briefTab = document.querySelector('.g-wiretab[data-wire="brief"]');
    const layout = document.querySelector(".g-layout");
    const vh = window.innerHeight;
    return {
      shown: getComputedStyle(el).display !== "none" && el.getBoundingClientRect().height > 0,
      bullets: el.querySelectorAll(".g-hbrief-b").length,
      open: el.dataset.open,
      bodyVisible: !!bd && getComputedStyle(bd).display !== "none",
      chev: !!chev,
      tabOn: !!briefTab && briefTab.classList.contains("is-on"),
      tabLabel: briefTab && briefTab.textContent.trim(),
      isPane: layout.classList.contains("wire-brief"),
      fills: el.getBoundingClientRect().height >= vh * 0.6,   // fills the page, not a slim strip
    };
  });
  check(p.tabOn && p.tabLabel === "Briefing", "phone: Briefing is the default tab");
  check(p.isPane && p.shown, "phone: the briefing shows as its own pane (wire-brief)");
  check(p.bullets >= 1 && p.bodyVisible && p.open === "true", `phone: the briefing is expanded (${p.bullets} bullet[s])`);
  check(!p.chev, "phone: there is NO collapse chevron — the briefing is always open");
  check(p.fills, "phone: the briefing pane fills the page (not a slim collapsed strip)");
  // The source note is pinned to the BOTTOM of the pane, and the page does not scroll.
  const pinned = await pg.evaluate(() => {
    const pane = document.getElementById("g-hbrief").getBoundingClientRect();
    const foot = document.querySelector("#g-hbrief .g-hbrief-foot").getBoundingClientRect();
    return { gap: Math.round(pane.bottom - foot.bottom), noScroll: document.documentElement.scrollHeight <= window.innerHeight + 4 };
  });
  check(pinned.gap <= 14, `phone: the 'AI-generated…' note is pinned to the bottom of the briefing pane (gap ${pinned.gap}px)`);
  check(pinned.noScroll, "phone: the briefing pane does not scroll (one screen)");
  // The pane butts flush under the wire tabs (anchored to their real bottom), so its
  // "Market briefing" header never slides under the tabs / bleeds at the seam.
  const briefSeam = await pg.evaluate(() => {
    const hb = document.getElementById("g-hbrief").getBoundingClientRect();
    const tabs = document.querySelector(".g-wiretabs").getBoundingClientRect();
    return Math.round(hb.top - tabs.bottom);
  });
  check(briefSeam >= 0 && briefSeam <= 2, `phone: the briefing pane butts flush under the wire tabs — no seam (gap ${briefSeam}px)`);
  // Structure: a stuck header row and a stuck footer note (both direct children of
  // the pane), with the body as the scroll region between them.
  const struct = await pg.evaluate(() => {
    const hb = document.getElementById("g-hbrief");
    const head = hb.querySelector(":scope > .g-hbrief-head");
    const body = hb.querySelector(":scope > .g-hbrief-body");
    const foot = hb.querySelector(":scope > .g-hbrief-foot");
    return {
      headChild: !!head, footChild: !!foot,
      bodyScrolls: !!body && getComputedStyle(body).overflowY === "auto",
      order: head && body && foot ? (head.compareDocumentPosition(body) & 4) !== 0 && (body.compareDocumentPosition(foot) & 4) !== 0 : false,
    };
  });
  check(struct.headChild && struct.footChild && struct.order, "phone: the header row and the footer note are direct children (header · body · footer)");
  check(struct.bodyScrolls, "phone: the body scrolls internally between the fixed header and footer (iOS-proof)");
  // The header is inert now (no collapse): tapping it keeps the body open.
  await pg.evaluate(() => document.querySelector("#g-hbrief .g-hbrief-head").click());
  await pg.waitForTimeout(100);
  check(await pg.evaluate(() => { const bd = document.querySelector("#g-hbrief .g-hbrief-body"); return !!bd && getComputedStyle(bd).display !== "none"; }),
    "phone: tapping the header does not collapse the briefing");
  checkErrs(errs, "home briefing (phone)");
  await ctx.close();
}

await b.close(); srv.close();
finish();
