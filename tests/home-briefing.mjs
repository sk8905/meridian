// Home briefing card: the tri-daily market brief (BRIEFINGS — Morning/Afternoon/
// Evening) surfaced at the HEAD of the News wire, above "Today". It reuses the
// orange-accent desk headings, caps to 4 bullets, links each
// source, and is collapsible (per viewer). Here only /api/hero + /api/xfeed are
// stubbed; the briefing is a static data import, so it renders with real content.
import fs from "node:fs";
import path from "node:path";
import { serve, launchChromium, open, PHONE, DESKTOP, ROOT, check, checkEq, checkErrs, finish } from "./lib.mjs";

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
    // Desk names render as ORANGE-accent headings (.g-hbrief-bk) — on desktop a small
    // uppercase BLOCK header stacked above its prose (the column format), never an inline
    // .nb-topic kicker. The per-item source LINK is dropped from this summary view.
    const kickers = [...el.querySelectorAll(".g-hbrief-b .g-hbrief-bk")].map((k) => k.textContent.trim().toLowerCase());
    // Resolve the real --accent colour via a throwaway probe so the assertion is
    // token-value agnostic (hex/rgb): the headings must equal it, not the white title.
    const accent = (() => {
      const p = document.createElement("span"); p.style.color = "var(--accent)"; el.appendChild(p);
      const c = getComputedStyle(p).color; p.remove(); return c;
    })();
    const deskHdAccent = (() => {
      const hs = [...el.querySelectorAll(".g-hbrief-b .g-hbrief-bk")], t = el.querySelector(".g-hbrief-ttl");
      return hs.length > 0 && !!t && hs.every((h) => getComputedStyle(h).color === accent && accent !== getComputedStyle(t).color);
    })();
    // Column format: the desk name is a BLOCK header stacked ABOVE its prose (its bottom
    // sits at/above the body's top), not a run-in heading sharing the first line.
    const stackedHeader = (() => {
      const secs = [...el.querySelectorAll(".g-hbrief-b")].filter((s) => s.querySelector(".g-hbrief-bk") && s.querySelector(".g-hbrief-bt"));
      return secs.length > 0 && secs.every((s) => {
        const k = s.querySelector(".g-hbrief-bk"), t = s.querySelector(".g-hbrief-bt");
        return getComputedStyle(k).display === "block" && k.getBoundingClientRect().bottom <= t.getBoundingClientRect().top + 2;
      });
    })();
    const noOrangeKicker = el.querySelectorAll(".g-hbrief-b .nb-topic").length === 0;
    // The desks lay out as a COLUMN GRID (one card per desk) under a hairline that
    // separates them from the header above (the rule lives on the grid container).
    const desksGrid = (() => {
      const list = el.querySelector(".g-hbrief-list");
      if (!list) return false;
      const cs = getComputedStyle(list);
      return cs.display === "grid" && parseFloat(cs.borderTopWidth) >= 1;
    })();
    const box = (n) => { const b = n.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom), left: Math.round(b.left), right: Math.round(b.right) }; };
    const eb = box(el), hb = hero && box(hero), fb = feedWrap && box(feedWrap);
    return {
      shown: !el.hidden && getComputedStyle(el).display !== "none",
      title: (el.querySelector(".g-hbrief-ttl") || {}).textContent || "",
      slots: el.querySelectorAll(".g-hbrief-slot").length,
      when: (el.querySelector(".g-hbrief-when") || {}).textContent || "",
      // The Overview lede is retired — the card is desk sections only.
      noLede: !el.querySelector(".g-hbrief-lede") && !el.querySelector(".g-hbrief-lede-hd"),
      sections: sections.length,
      itemCount: items.length,
      hasKicker: kickers.length > 0,
      deskHdAccent,
      stackedHeader,
      noOrangeKicker,
      desksGrid,
      // ONE continuous combined item per desk: each desk section renders exactly ONE
      // .g-hbrief-bt (same-desk stories folded together), NOT one per story.
      oneItemPerSection: items.length > 0 && items.length === sections.length,
      // The per-item source LINK is intentionally dropped from this summary view.
      noSourceLinks: el.querySelectorAll(".g-hbrief-src").length === 0,
      // ONE section per desk: exactly one desk heading per section, and no desk repeats.
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
  check(r.noLede, "desktop: the Overview lede is retired — the card shows desk sections only");
  check(r.sections >= 1 && r.sections <= 3, `desktop: one section per desk, ≤3 (${r.sections} sections, ${r.itemCount} items)`);
  check(r.hasKicker, "desktop: each desk carries its name as a heading (.g-hbrief-bk)");
  check(r.deskHdAccent, "desktop: the desk headings are the orange accent (not the white title)");
  check(r.stackedHeader, "desktop: each desk name is a block header stacked above its prose (column format)");
  check(r.noSourceLinks, "desktop: the per-item source link is dropped from the briefing summary");
  check(r.noOrangeKicker, "desktop: no inline .nb-topic desk kicker survives in the bullets");
  check(r.desksGrid, "desktop: the desks lay out as a column grid under a hairline below the header");
  check(r.oneItemPerSection, `desktop: each desk is ONE continuous combined item (same-desk stories folded, not stacked) (${r.itemCount} items / ${r.sections} sections)`);
  check(r.oneKickerPerSection && r.kickersUnique, `desktop: one section per desk — no repeated desk heading (${r.kickers.join(", ")})`);
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
    return { title: (t && t.textContent) || "", notUpper: !!cs && cs.textTransform === "none", chevHidden: !chev || getComputedStyle(chev).display === "none" };
  });
  // The app is unified to ONE font (Gotham), so the distinguishing trait is case, not
  // family: the briefing header stays title-case ("Market briefing"), not uppercase.
  check(/market briefing/i.test(hdr.title) && hdr.notUpper, "desktop: the header matches the panel style (title-case 'Market briefing', not uppercase)");
  check(hdr.chevHidden, "desktop: no collapse chevron — the card is permanently open");
  await pg.evaluate(() => document.querySelector("#g-hbrief .g-hbrief-head").click());
  await pg.waitForTimeout(120);
  const stillOpen = await bodyVis() && (await pg.evaluate(() => document.getElementById("g-hbrief").dataset.open)) === "true";
  check(stillOpen, "desktop: clicking the header does NOT collapse it");

  // The briefing shows the latest available version (freshest by date·time stamp): the
  // header's freshness stamp matches the freshest slot's time·date.
  const latest = await pg.evaluate(async () => {
    const m = await import("/briefings.js");
    const B = m.BRIEFINGS || {}, slots = B.slots || {};
    const order = (B.order || []).filter((k) => slots[k]);
    const stamp = (k) => { const s = slots[k]; const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/); return `${s.date || ""} ${t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"}`; };
    const freshest = order.reduce((b, k) => (stamp(k) > stamp(b) ? k : b), order[0]);
    const s = slots[freshest];
    const when = ((document.querySelector("#g-hbrief .g-hbrief-when") || {}).textContent || "");
    const norm = (t) => String(t || "").replace(/\s+/g, " ").trim().toLowerCase();
    // The stamp carries the freshest slot's time (e.g. "15:29 BST"); a day·month token
    // from its date also appears.
    const timeOk = !!s && norm(when).includes(norm(s.time).split(" ")[0]);
    return { when, timeOk, freshestBullets: !!s && (s.bullets || []).length > 0 };
  });
  check(latest.timeOk && latest.freshestBullets, `desktop: the shown briefing is the latest available version (stamp "${latest.when}")`);

  // The WHOLE summary scrolls as one region beneath the stuck header; there is NO footer
  // note and NO Overview lede.
  const deskScroll = await pg.evaluate(() => {
    const hb = document.getElementById("g-hbrief");
    const body = hb.querySelector(".g-hbrief-body"), list = hb.querySelector(".g-hbrief-list");
    const sec0 = hb.querySelector(".g-hbrief-b");
    const secTop0 = sec0.getBoundingClientRect().top;
    body.scrollTop = 80;
    const secTop1 = sec0.getBoundingClientRect().top;
    return {
      bodyScrolls: getComputedStyle(body).overflowY === "auto",
      listOverflow: getComputedStyle(list).overflowY,
      canScroll: body.scrollHeight > body.clientHeight,
      secMoved: secTop1 !== secTop0,
      noFoot: !hb.querySelector(".g-hbrief-foot"),
      noLede: !hb.querySelector(".g-hbrief-lede") && !hb.querySelector(".g-hbrief-lede-hd"),
      bodyAtBottom: Math.round(hb.getBoundingClientRect().bottom - body.getBoundingClientRect().bottom),
    };
  });
  check(deskScroll.bodyScrolls && deskScroll.listOverflow !== "auto" && deskScroll.listOverflow !== "scroll", `desktop: the whole summary scrolls as one region (the bullet list has no separate scroll — list overflow ${deskScroll.listOverflow})`);
  if (deskScroll.canScroll) check(deskScroll.secMoved, "desktop: the desk sections scroll inside the body");
  check(deskScroll.noFoot, "desktop: there is NO 'AI-generated…' source-credit footer note");
  check(deskScroll.noLede, "desktop: there is NO Overview lede");
  check(deskScroll.bodyAtBottom <= 2, `desktop: the scrolling body runs to the bottom of the quadrant (${deskScroll.bodyAtBottom}px)`);

  checkErrs(errs, "home briefing (desktop)");
  await ctx.close();
}

// --- Phone: the briefing is its OWN pane (the Market Briefing tab — no longer the
//     default; tap it), always expanded — no collapse — and it fills the page. ---
{
  const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
  await pg.evaluate(() => { try { localStorage.removeItem("wire.home.v1"); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-hbrief .g-hbrief-head", { state: "attached", timeout: 8000 });
  // The default pane is now the wire (All lane); switch to the Briefing tab to test it.
  await pg.click('.g-wiretab[data-wire="brief"]');
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
  check(p.tabOn && p.tabLabel === "Briefing", "phone: the Briefing tab activates its pane");
  check(p.isPane && p.shown, "phone: the briefing shows as its own pane (wire-brief)");
  check(p.bullets >= 1 && p.bodyVisible && p.open === "true", `phone: the briefing is expanded (${p.bullets} bullet[s])`);
  check(!p.chev, "phone: there is NO collapse chevron — the briefing is always open");
  check(p.fills, "phone: the briefing pane fills the page (not a slim collapsed strip)");
  // The scrolling body runs to the BOTTOM of the pane, hard against the top of the bottom
  // nav. The pane is a FIXED flex column filling the gap between the sticky tabs and the
  // fixed nav — anchored purely in CSS (no JS pixel sizing to go stale, which is what left
  // the pane blank). The PAGE is locked (it cannot scroll when there is nothing to scroll
  // to); a long brief scrolls inside the pane's body instead.
  const pinned = await pg.evaluate(() => {
    const pane = document.getElementById("g-hbrief").getBoundingClientRect();
    const body = document.querySelector("#g-hbrief .g-hbrief-body").getBoundingClientRect();
    const nav = document.querySelector(".mobile-tabbar").getBoundingClientRect();
    return {
      gap: Math.round(pane.bottom - body.bottom),
      bodyToNav: Math.round(nav.top - body.bottom),
      noFoot: !document.querySelector("#g-hbrief .g-hbrief-foot"),
      noInlineHeight: !document.getElementById("g-hbrief").style.height,
      pageLocked: document.documentElement.scrollHeight <= window.innerHeight + 2,
      // The COMPLETE scroll-lock (html AND body) is what stops the document bouncing on
      // iOS — a bounce moved the sticky tabs and detached the fixed pane. Both must be
      // overflow:hidden with overscroll-behavior off.
      htmlLocked: getComputedStyle(document.documentElement).overflowY === "hidden",
      bodyLocked: getComputedStyle(document.body).overflowY === "hidden",
      noBounce: getComputedStyle(document.documentElement).overscrollBehaviorY === "none",
    };
  });
  check(pinned.noFoot, "phone: there is NO 'AI-generated…' source-credit footer note");
  check(pinned.gap <= 14, `phone: the scrolling body runs to the bottom of the briefing pane (gap ${pinned.gap}px)`);
  check(pinned.bodyToNav >= -2 && pinned.bodyToNav <= 12, `phone: the pane's body lands hard against the top of the bottom nav (bodyToNav ${pinned.bodyToNav}px)`);
  check(pinned.noInlineHeight, "phone: the pane carries NO inline pixel height — it is anchored in CSS, not by JS measurement");
  check(pinned.pageLocked, "phone: the page does not scroll when the brief fits (scroll is locked — content scrolls inside the pane)");
  check(pinned.htmlLocked && pinned.bodyLocked && pinned.noBounce, "phone: BOTH html and body are scroll-locked (overflow hidden + overscroll-behavior none) so the document can't rubber-band and detach the pane");
  // The pane butts flush under the wire tabs (anchored to their real bottom), so its
  // "Market briefing" header never slides under the tabs / bleeds at the seam.
  const briefSeam = await pg.evaluate(() => {
    const hb = document.getElementById("g-hbrief").getBoundingClientRect();
    const tabs = document.querySelector(".g-wiretabs").getBoundingClientRect();
    return Math.round(hb.top - tabs.bottom);
  });
  check(briefSeam >= 0 && briefSeam <= 2, `phone: the briefing pane butts flush under the wire tabs — no seam (gap ${briefSeam}px)`);
  // Structure: header · body as direct children, in order. Within the FIXED pane the
  // body is the scroll region (a long brief scrolls here, not the page) while the header
  // stays put.
  const struct = await pg.evaluate(() => {
    const hb = document.getElementById("g-hbrief");
    const head = hb.querySelector(":scope > .g-hbrief-head");
    const body = hb.querySelector(":scope > .g-hbrief-body");
    return {
      headChild: !!head, bodyChild: !!body,
      paneFixed: getComputedStyle(hb).position === "fixed",
      bodyScrolls: !!body && getComputedStyle(body).overflowY === "auto",
      order: head && body ? (head.compareDocumentPosition(body) & 4) !== 0 : false,
    };
  });
  check(struct.headChild && struct.bodyChild && struct.order, "phone: the header row and the body are direct children, in order (header · body)");
  check(struct.paneFixed, "phone: the pane is fixed between the tabs and the nav (anchored, not measured)");
  check(struct.bodyScrolls, "phone: a long brief scrolls INSIDE the pane's body, not the page");
  // The header is inert now (no collapse): tapping it keeps the body open.
  await pg.evaluate(() => document.querySelector("#g-hbrief .g-hbrief-head").click());
  await pg.waitForTimeout(100);
  check(await pg.evaluate(() => { const bd = document.querySelector("#g-hbrief .g-hbrief-body"); return !!bd && getComputedStyle(bd).display !== "none"; }),
    "phone: tapping the header does not collapse the briefing");
  checkErrs(errs, "home briefing (phone)");
  await ctx.close();
}

await b.close(); srv.close();

// T17 — the briefing pane's resize handler (which measures + writes maxHeight
// via getBoundingClientRect on every event) must be rAF-throttled like every
// other resize listener in the app (chrome.js, nav-actions.js), not fire raw
// on each resize event.
const glanceSrc = fs.readFileSync(path.join(ROOT, "v2", "js", "home", "glance.js"), "utf8");
check(/addEventListener\("resize",\s*\(\)\s*=>\s*\{\s*if\s*\(briefResizeQueued\)/.test(glanceSrc),
  "v2/js/home/glance.js: the brief-pane resize listener is rAF-queued, not raw (T17)");

finish();
