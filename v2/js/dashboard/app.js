// =============================================================================
// v2/js/dashboard/app.js — the Dashboard tab: the at-a-glance market state for a
// European credit-fund reader. Five sub-tabs in priority order (HOUSE_STYLE R37):
// Credit (the default) · Rates (policy, money markets, curves — the old Macro +
// Bonds tabs merged) · Legal · Equities · Hedge Funds. Curated seed data comes
// from dashboard/js/data.js + the macro desk's content (ONE source of truth);
// live figures override at runtime from the Worker (/api/rates, /api/eurates,
// /api/yield-curve, /api/govyields, /api/worldindices, /api/13f). Every figure
// keeps a real outbound source link and an as-of date; a LIVE badge only lights
// once live data has actually been applied (otherwise it reads "snapshot").
// mount → {enter,leave,home}.
// =============================================================================
import { esc, MONTHS, byDateDesc } from "/util.js";
import { fmtDay as fmtDate } from "/feed.js";
import { EQ_INDICES, EQ_SECTORS, EQ_VALUATION, EQ_VOL, EQ_IPO, CR_STRESS, WORLD_INDICES, GOVT_YIELDS, GOVT_YIELD_CHG, PRIVATE_CREDIT, EU_DISTRESS, REG_CALENDAR } from "/dashboard/js/data.js";
import { OUTLOOK, CYCLE, MARKET_CYCLE, BUBBLE, MATWALL, YIELD_CURVE, NEWS, EARNINGS, IND_KEYMOMENTS, MARKET_SIZES, CB_CALENDAR } from "/macro/js/content.js";
import { deals, intel, managers, funds, commitments, lps, HEDGE_FUNDS, HEDGE_FUNDS_ASOF, HF_13F, HEDGE_INTEL } from "/credit/js/data.js";
import { fmtBn } from "/credit/js/shared.js";
import { SECTOR_FLOWS } from "/allocations.js";
import { nbNums } from "../nb-format.js";
import { rosterCardsHTML, wireRosters } from "../credit-roster.js";
import { liveJSON, lastKnownLabel } from "../live-cache.js";
import { tagsOf, EUROPE_REGIONS } from "/credit/js/tx.js";
import { DEAL_TAGS } from "/credit/js/deal-tags.js";
import { dealLenderIds } from "../deal-parse.js";
import { items as LGL_ITEMS, cases as LGL_CASES, practiceAreas as LGL_AREAS, areaById as LGL_AREA_BY_ID, firmById as LGL_FIRM_BY_ID, caseSummaries as LGL_CASE_SUMMARIES } from "/legal/js/data.js";

// Third tuple element is an OPTIONAL short label shown on the narrow iPhone tab
// bar (≤760px) where the full two-word labels wrap to two lines; desktop (the
// fixed-viewport terminal) keeps the full label.
const SUBTABS = [["credit", "Credit"], ["rates", "Rates"], ["legal", "Legal"], ["equities", "Equities"], ["hedge-funds", "Hedge Funds", "Hedge"]];
// Retired sub-tab URLs (Macro and Bonds merged into Rates) keep resolving.
const SUB_ALIAS = { macro: "rates", "fixed-income": "rates", bonds: "rates" };
const DEFAULT_SUB = "credit";
const subOf = (k) => { const x = SUB_ALIAS[k] || k; return SUBTABS.some(([s]) => s === x) ? x : DEFAULT_SUB; };
const pct1 = (n) => (n == null ? "—" : (n > 0 ? "+" : "") + n.toFixed(1) + "%");
const upcls = (n) => (n == null ? "" : n > 0 ? "up" : n < 0 ? "down" : "");
// Card-level "as of" — one date style and format everywhere (R40): "13 Oct 2026",
// "Sep 2026", "Q2 2026"; the words "as of" live in the tooltip, not the header.
const asOf = (d) => (d ? `<span class="dsh-asof" title="as of ${esc(isoDay(d))}">${esc(isoDay(d))}</span>` : "");
const srcLink = (u, label) => (u ? ` <a class="dsh-src" href="${esc(u)}" target="_blank" rel="noopener noreferrer" title="${esc(label || "Source")}">src</a>` : "");
const stripTags = (s) => String(s || "").replace(/<[^>]+>/g, "");
// Curated text sometimes arrives entity-encoded ("S&amp;P"); decode the common
// entities BEFORE esc() so the page never shows a literal "&amp;".
const deEnt = (s) => String(s || "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
const txt = (s) => esc(deEnt(s));
// LIVE badge: renders as "snapshot" and only flips to "live" once a live payload
// has actually been applied (markLive), so stale fallback data is never badged live.
const liveTag = (id) => `<span class="dsh-live is-snap" data-live="${id}" title="Sourced snapshot — live data not loaded">snapshot</span>`;
const isoDay = (d) => {
  const t = String(d || "").replace(/^\s*as of\s+/i, "");
  let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(t); if (m) return `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}`;
  m = /^(\d{4})-(\d{2})$/.exec(t); if (m) return `${MONTHS[+m[2] - 1]} ${m[1]}`;
  m = /^(\d{4})-Q([1-4])$/.exec(t); if (m) return `Q${m[2]} ${m[1]}`;
  return t;
};
// Search normaliser: lowercase and drop apostrophes so "director's" / "directors'"
// / "directors" all collapse to the same token. Used to build each legal item's
// search haystack and to tokenise the query (word-by-word AND match).
const _norm = (s) => String(s || "").toLowerCase().replace(/['’‘]/g, "");

export function mount(host, ctx) {
  let pane = "macro";
  let _gyLive = null;                    // live yields overlay (/api/govyields), keyed by country
  let _ycLive = null;                    // live US/UK yield curve overlay (/api/yield-curve)
  let _yldTenor = "y10";                 // tenor selected in the yield-change heatmap dropdown
  let _legalQuery = "";                 // Legal database keyword (persist across re-renders)
  const _legalAreas = new Set();        // practice areas the search is limited to (empty = all)
  const _legalTypes = new Set();        // item types the search is limited to (empty = all): "alert" | "case"

  // Live-state bookkeeping: flip a "snapshot" badge to "live" (with the live
  // as-of date in its title) only once a live payload has been applied.
  const _live = {};
  // A card fed by LAST-KNOWN values (the live call failed or came back empty, so
  // v2/js/live-cache.js served this viewer's last-good payload or the committed
  // snapshot): the badge says so, with the capture time — never "live".
  function markCached(id, at) {
    _live[id] = false;
    host.querySelectorAll(`.dsh-live[data-live="${id}"]`).forEach((el) => {
      el.classList.add("is-snap"); el.classList.add("is-cached"); el.textContent = "last-known";
      el.title = lastKnownLabel(at) + " — live data not loaded";
      // The capture date rides visibly next to the badge (the tooltip never shows on a phone).
      const h = el.closest(".dsh-h");
      if (h && at && !h.querySelector(".dsh-asof")) el.insertAdjacentHTML("afterend", ` <span class="dsh-asof dsh-asof-lk" title="${esc(lastKnownLabel(at))}">${esc(isoDay(String(at).slice(0, 10)))}</span>`);
    });
  }
  // Apply a liveJSON result's badge: live → LIVE (with as-of), else last-known.
  const badge = (res, id, asOfDate) => { if (res.state === "live") markLive(id, asOfDate); else if (res.state !== "none") markCached(id, res.at); };
  function markLive(id, asOfDate) {
    _live[id] = asOfDate || true;
    host.querySelectorAll(`.dsh-live[data-live="${id}"]`).forEach((el) => {
      el.classList.remove("is-snap"); el.textContent = "live";
      el.title = asOfDate ? `Live · as of ${isoDay(asOfDate)}` : "Live";
    });
  }
  // Card header anatomy (R40): <title (truncates)> · <meta: count, LIVE, date, select>.
  // Panels build headers as inline markup; this splits them once into the two slots.
  const META = ".dsh-live, .dsh-asof, .dsh-n, .dsh-mut, select, .dsh-src";
  function tidyHeaders(root) {
    (root || host).querySelectorAll(".dsh-h:not([data-tidy])").forEach((h) => {
      h.dataset.tidy = "1";
      const t = document.createElement("span"); t.className = "dsh-h-t";
      const r = document.createElement("span"); r.className = "dsh-h-r";
      [...h.childNodes].forEach((n) => { ((n.nodeType === 1 && n.matches(META)) ? r : t).appendChild(n); });
      const last = t.lastChild; if (last && last.nodeType === 3) last.nodeValue = last.nodeValue.replace(/\s+$/, "");
      if (t.title === "") t.title = t.textContent;
      h.appendChild(t); if (r.childNodes.length) h.appendChild(r);
    });
  }
  // ---- Desktop layout (R40): cards keep a natural width and pack into columns ----
  // The middle column's own width decides HOW MANY columns (≈480px each, 1–6), never
  // how wide a card is. Each card has a size — std (one column), wide (spans two) or
  // full (every column) — and drops, in priority (DOM) order, into whichever column
  // is shortest, so there are no holes and nothing is stretched. Phones keep the
  // plain stacked flow. Re-packs whenever the width or any card's height changes.
  const COL_TARGET = 480, GAP = 10;
  const sizeOf = (el) => (el.classList.contains("dsh-span") ? "full" : el.classList.contains("dsh-wide") ? "wide" : "std");
  let _ro = null, _raf = 0;
  function flattenMid(mid) {
    // Paired-row wrappers are a phone/tablet convenience; the packer places cards itself.
    mid.querySelectorAll(":scope > .dsh-row2, :scope > .dsh-wide:not(.dsh-card)").forEach((w) => { while (w.firstElementChild) w.parentNode.insertBefore(w.firstElementChild, w); w.remove(); });
  }
  const FILL_BASE = 240;   // a fill card's starting height before it absorbs slack
  const HOLE = 120;
  function packMid() {
    _raf = 0;
    if (_lastPhone !== null && isPhone() !== _lastPhone) phoneTidy();
    const mid = host.querySelector(".dsh-mid");
    if (!mid) return;
    const cards = [...mid.children].filter((el) => el.classList.contains("dsh-card"));
    const W = mid.clientWidth;
    const byWidth = window.matchMedia("(min-width: 901px)").matches ? Math.max(1, Math.min(6, Math.round(W / COL_TARGET))) : 1;
    // Never more columns than the tab's cards can fill.
    const units = Math.max(1, cards.reduce((a, c) => a + ({ full: 0, wide: 2, std: 1 })[sizeOf(c)], 0));
    const cols = Math.max(1, Math.min(byWidth, units));
    if (cols < 2) {
      mid.classList.remove("dsh-masonry"); mid.style.removeProperty("--mas-h");
      cards.forEach((c) => { ["left", "top", "width", "height"].forEach((k) => c.style.removeProperty(k)); c.dataset.ph = ""; });
      return;
    }
    mid.classList.add("dsh-masonry");
    const viewH = mid.clientHeight;
    // Plan a packing at a given column count (measures every card at that width).
    const plan = (cols) => {
    const colW = (W - GAP * (cols - 1)) / cols;
    const widthOf = (span) => colW * span + GAP * (span - 1);
    // Measure each card once at its width. Fill cards (charts / long lists) start at
    // FILL_BASE; everything else at its natural height. A one-column card whose content
    // cannot fit is promoted to two columns (never clips).
    const items = cards.map((c, i) => {
      const sz = sizeOf(c), fill = c.classList.contains("dsh-fill");
      let span = sz === "full" ? cols : sz === "wide" ? Math.min(2, cols) : 1;
      c.style.removeProperty("height");
      if (span === 1) { c.style.width = `${colW}px`; if (c.scrollWidth > c.clientWidth + 1) span = Math.min(2, cols); }
      c.style.width = `${widthOf(span)}px`;
      // A chart fill starts at its natural height (chart at its min-height, so it can
      // sit level beside a short rigid card) and reads badly beyond ~460px; a list
      // fill starts at FILL_BASE and can take any height.
      const chart = fill && !!c.querySelector(".dsh-chart");
      const nat = c.offsetHeight;   // full content height, before any cap
      if (fill && !chart) c.style.height = `${FILL_BASE}px`;
      const fmax = chart ? 460 : Infinity;
      return { c, i, span, fill, fmax, nat, h: c.offsetHeight };
    });
    // Pack an order shortest-column first (pulling the next one-column card into a gap a
    // wide card would leave), then let fill cards absorb every remaining gap: within each
    // column, the stretch above a spanning card (or the end of the page) is levelled by
    // growing a fill card in it. Returns positions, grown heights and unabsorbed space.
    const simulate = (order, pullFill = true) => {
      const h = new Array(cols).fill(0), pos = new Map();
      const slot = (span) => {
        let best = 0, top = Infinity, waste = Infinity;
        for (let i = 0; i + span <= cols; i++) {
          const seg = h.slice(i, i + span), t = Math.max(...seg), w = seg.reduce((acc, x) => acc + (t - x), 0);
          if (t < top - 0.5 || (Math.abs(t - top) <= 0.5 && w < waste)) { best = i; top = t; waste = w; }
        }
        return { best, top, waste };
      };
      const queue = order.slice(), deferred = new Set();
      while (queue.length) {
        const it = queue[0];
        if (it.span > 1) {
          const { best, top, waste } = slot(it.span);
          if (waste > 2) {
            // Drop a one-column card — a fill card first, since it absorbs any remainder
            // exactly — into EACH column this wide card would leave short. Without a fill
            // card, only a gap taller than HOLE is worth reordering for.
            let moved = false;
            for (let c = best; c < best + it.span; c++) {
              const need = top - h[c];
              if (need <= 2) continue;
              let j = pullFill ? queue.findIndex((q, k) => k > 0 && q.span === 1 && q.fill && q.fmax === Infinity) : -1;
              if (j < 0 && pullFill) j = queue.findIndex((q, k) => k > 0 && q.span === 1 && q.fill && need <= q.fmax - q.h + HOLE);
              if (j < 0 && need > HOLE) j = queue.findIndex((q, k) => k > 0 && q.span === 1 && q.h <= need + HOLE);
              if (j < 0) continue;
              const [q] = queue.splice(j, 1);
              pos.set(q, { col: c, top: h[c], h: q.h }); h[c] += q.h + GAP; moved = true;
            }
            if (moved) continue;
            if (waste > HOLE && !deferred.has(it) && queue.some((q, k) => k > 0 && q.span < it.span)) { deferred.add(it); queue.push(queue.shift()); continue; }
          }
        }
        queue.shift();
        const { best, top } = slot(it.span);
        pos.set(it, { col: best, top, h: it.h });
        for (let i = best; i < best + it.span; i++) h[i] = top + it.h + GAP;
      }
      // Level each column: segments end at the top of the next card spanning into the
      // column from elsewhere (or at the page bottom). Grow the segment's last fill card.
      // The page is levelled to its tallest column — or to the bottom of the screen when
      // the tab is shorter than the screen, so a short tab never ends in an empty band.
      // (Only when every column ends in a fill card can all of them follow it down.)
      const lastIsFill = (c) => { let last = null; for (const [it, p] of pos) if (p.col <= c && c < p.col + it.span && (!last || p.top > last[1].top)) last = [it, p]; return !!(last && last[0].fill); };
      const allFill = [...Array(cols).keys()].every(lastIsFill);
      const natural = Math.max(...h);
      const end = natural >= viewH || !allFill ? natural : viewH;
      let dead = 0;
      for (let c = 0; c < cols; c++) {
        const inCol = [...pos.entries()].filter(([it, p]) => p.col <= c && c < p.col + it.span).sort((x, y) => x[1].top - y[1].top);
        let seg = [], prevBottom = 0;   // bottom (incl. gap) of the last card above the segment
        const close = (limit) => {
          if (!seg.length) { const gap = limit - prevBottom; if (gap > 1) dead += gap; return; }
          const [lit, lp] = seg[seg.length - 1];
          const gap = limit - (lp.top + lp.h + GAP);
          if (gap > 1) {
            // Share the gap among the segment's fill cards: first to the ones with the
            // most content still hidden (up to their full height), then last first,
            // each up to its cap — so a long list grows before a short one pads out.
            let left = gap;
            const shift = (idx, g) => { seg[idx][1].h += g; left -= g; for (let k = idx + 1; k < seg.length; k++) seg[k][1].top += g; };
            seg.map((e, idx) => [idx, e[0].fill && e[0].span === 1 ? Math.min(e[0].nat, e[0].fmax) - e[1].h : 0]).filter(([, w]) => w > 1)
              .sort((x, y) => y[1] - x[1]).forEach(([idx, w]) => { const g = Math.min(left, w); if (g > 0) shift(idx, g); });
            for (let idx = seg.length - 1; idx >= 0 && left > 1; idx--) {
              const [it, p] = seg[idx];
              if (!it.fill || it.span !== 1) continue;
              const g = Math.min(left, it.fmax - p.h);
              if (g <= 0) continue;
              p.h += g; left -= g;
              for (let k = idx + 1; k < seg.length; k++) seg[k][1].top += g;
            }
            // No fill card to take a small remainder: stretch the last card's frame so
            // the column edges still meet (content stays top-aligned inside it).
            if (left > 1 && left <= HOLE && lit.span === 1) { lp.h += left; lp.stretch = true; dead += left * 0.25; left = 0; }
            if (left > 1) dead += left * (lit.span === 1 ? 1 : 0.5);
          }
          seg = [];
        };
        for (const e of inCol) {
          if (e[0].span > 1) { close(e[1].top); prevBottom = e[1].top + e[1].h + GAP; }
          else { if (!seg.length && e[1].top - prevBottom > 1) dead += e[1].top - prevBottom; seg.push(e); }
        }
        close(end);
      }
      // Any fill card (wide ones too) then grows into the empty space directly below it,
      // down to the next card in any of its columns or the page bottom.
      for (const [it, p] of pos) {
        if (!it.fill) continue;
        let limit = end;
        for (const [o, q] of pos) if (o !== it && q.col < p.col + it.span && p.col < q.col + o.span && q.top >= p.top + p.h - 1) limit = Math.min(limit, q.top);
        const grow = Math.min(limit - (p.top + p.h + GAP), it.fmax - p.h);
        if (grow > 1) { p.h += grow; dead = Math.max(0, dead - grow * it.span); }
      }
      // A list fill stretched past its own content is empty space inside a frame:
      // count half of it, so a long list takes the slack before a short one.
      for (const [it, p] of pos) if (it.fill && it.fmax === Infinity && p.h > it.nat + 1) dead += (p.h - it.nat) * it.span * 0.5;
      // A short page that can't follow the fills to the screen bottom leaves a band:
      // count it, so orders that end every column in a fill card win.
      if (end < viewH) dead += (viewH - end) * cols * 0.25;
      return { pos, end, dead, natural };
    };
    // Search for the cleanest layout that stays close to priority order: hill-climb
    // over swaps of nearby cards, scoring empty space plus a cost per place a card
    // moves away from its priority position (so order only bends for a real gain).
    const MOVE_COST = 12;
    // Full-width strips and the collapsed Reference block keep their places.
    const pinned = (it) => it.span === cols || it.c.classList.contains("dsh-ref");
    // Fill cards are flexible by design, so moving one costs a third as much.
    const cost = (order, r) => r.dead + order.reduce((a, it, k) => a + Math.abs(k - it.i) * (it.fill ? MOVE_COST / 3 : MOVE_COST), 0);
    const climb = (start, pullFill) => {
      let order = start.slice(), res = simulate(order, pullFill), best = cost(order, res);
      for (let iter = 0; iter < 30; iter++) {
        let gain = null;
        for (let a = 0; a < order.length; a++) for (let b = a + 1; b < Math.min(order.length, a + ((order[a].fill || order[Math.min(order.length - 1, a + 1)].fill) ? 9 : 4)); b++) {
          if (pinned(order[a]) || pinned(order[b])) continue;
          const o = order.slice(); [o[a], o[b]] = [o[b], o[a]];
          const r = simulate(o, pullFill), c = cost(o, r);
          if (c < best - 1 && (!gain || c < gain.c)) gain = { o, r, c };
        }
        if (!gain) break;
        order = gain.o; res = gain.r; best = gain.c;
      }
      return { res, c: best };
    };
    // Second starting point: wide cards first, pinned cards left where they are.
    const free = items.filter((it) => !pinned(it)).sort((a, b) => (b.span - a.span) || (a.i - b.i));
    const wideFirst = items.map((it) => (pinned(it) ? it : free.shift()));
    const tries = [[items, true], [items, false], [wideFirst, true], [wideFirst, false]].map(([o, pf]) => climb(o, pf));
    const pick = tries.reduce((x, y) => (y.c < x.c ? y : x)).res;
    return { pick, items, colW };
    };
    // A short tab on a very wide screen would end in an empty band: step down to
    // fewer, wider columns until the packed content reaches ~80% of the screen
    // height (fill cards then take it to the bottom), never below two columns.
    // Columns never widen past ~960px (a line of text stays readable).
    const minCols = Math.min(cols, Math.max(2, Math.ceil((W + GAP) / (960 + GAP))));
    let r = null;
    for (let c = cols; c >= minCols; c--) { r = plan(c); if (c === minCols || r.pick.natural >= 0.8 * viewH) break; }
    const { pick, items, colW } = r;
    items.forEach((it) => {
      const p = pick.pos.get(it);
      it.c.style.left = `${p.col * (colW + GAP)}px`; it.c.style.top = `${p.top}px`;
      if (it.fill || p.stretch) it.c.style.height = `${p.h}px`;
      it.c.dataset.ph = String(Math.round(p.h));
    });
    mid.style.setProperty("--mas-h", `${pick.end}px`);
  }
  const schedulePack = () => { if (!_raf) _raf = requestAnimationFrame(packMid); };
  function layoutMid() {
    const mid = host.querySelector(".dsh-mid");
    if (!mid) return;
    flattenMid(mid);
    if (_ro) _ro.disconnect();
    if (typeof ResizeObserver === "function") {
      // Re-pack when the column width changes or a card's CONTENT changes its height —
      // not when the packer itself sized it (dataset.ph), which would loop.
      _ro = new ResizeObserver((entries) => {
        if (entries.some((e) => e.target === host.querySelector(".dsh-mid") || Math.abs(e.target.offsetHeight - (+e.target.dataset.ph || 0)) > 1)) schedulePack();
      });
      _ro.observe(mid);
      mid.querySelectorAll(":scope > .dsh-card").forEach((c) => _ro.observe(c));
    }
    phoneTidy();
    packMid();
  }
  // ---- Phone (R40): no scrolling inside cards. A long list shows a short preview
  // and "See all N ›", which opens the whole list in a full-screen sheet (its own
  // scroll, a filter box for long lists, ✕ to close). Wide tables re-render as
  // stacked rows: name + key figure on one line, the other fields on a small grey
  // line beneath — nothing clipped, nothing scrolling sideways.
  const PREVIEW = 10;
  const PHONE_MQ = "(max-width:900px)";
  const isPhone = () => !!(window.matchMedia && window.matchMedia(PHONE_MQ).matches);
  function stackTables(root) {
    root.querySelectorAll("table.dsh-stk-src").forEach((t) => {
      const anchor = t.closest(".dsh-scroll") || t;
      const old = anchor.nextElementSibling; if (old && old.classList.contains("dsh-stk-list")) old.remove();
      const heads = [...t.querySelectorAll("thead th")].map((th) => th.textContent.trim());
      const nm = +(t.dataset.stkName || 0), key = t.dataset.stkKey != null ? +t.dataset.stkKey : -1, rank = t.dataset.stkRank != null ? +t.dataset.stkRank : -1;
      const lab = new Set(String(t.dataset.stkLab || "").split(",").filter((x) => x !== "").map(Number));
      const li = [...t.querySelectorAll("tbody tr")].map((tr) => {
        const td = [...tr.children];
        const isSrc = (c) => c.querySelector("a.dsh-src") && !c.textContent.replace(/src/i, "").trim();
        const src = td.filter((c, i) => i !== nm && isSrc(c)).map((c) => c.innerHTML).join("");
        const meta = td.map((c, i) => [c, i]).filter(([c, i]) => i !== nm && i !== key && i !== rank && !isSrc(c) && c.textContent.trim() && c.textContent.trim() !== "—")
          .map(([c, i]) => `<span>${lab.has(i) && heads[i] ? `<span class="dsh-stk-l">${esc(heads[i])}</span> ` : ""}${c.innerHTML}</span>`);
        const kv = key >= 0 && td[key] ? `<span class="dsh-stk-v">${lab.has(key) && heads[key] ? `<span class="dsh-stk-l">${esc(heads[key])}</span> ` : ""}${td[key].innerHTML}</span>` : "";
        return `<li class="dsh-stk-i"><div class="dsh-stk-h"><span class="dsh-stk-n">${rank >= 0 && td[rank] ? `<span class="dsh-stk-r">${esc(td[rank].textContent.trim())}</span>` : ""}${td[nm] ? td[nm].innerHTML : ""}</span>${kv}${src ? `<span class="dsh-stk-s">${src}</span>` : ""}</div>`
          + (meta.length ? `<div class="dsh-stk-m">${meta.join("")}</div>` : "") + `</li>`;
      });
      anchor.insertAdjacentHTML("afterend", `<ul class="dsh-stk-list">${li.join("")}</ul>`);
    });
  }
  const itemsOf = (body) => {
    // Phone reads the stacked list; desktop reads the visible table rows.
    // Desktop: the LONGEST list in the body (a card can hold a 4-row summary table and a
    // long news list — preview the long one).
    if (!isPhone()) {
      const cands = [...body.querySelectorAll("tbody")].map((t) => [...t.children].filter((r) => r.tagName === "TR"));
      for (const sel of ["li.dsh-news-i", ".dsh-km", ".dsh-earn-rel", ".dsh-hf-i", ".dsh-lgl-i"]) cands.push([...body.querySelectorAll(sel)]);
      return cands.sort((a, b) => b.length - a.length)[0] || [];
    }
    const stk = body.querySelector(".dsh-stk-list"); if (stk) return [...stk.children];
    for (const sel of ["li.dsh-news-i", ".dsh-km", ".dsh-earn-rel", ".dsh-hf-i", ".dsh-lgl-i"]) { const a = [...body.querySelectorAll(sel)]; if (a.length) return a; }
    return [...body.querySelectorAll("tbody tr")];
  };
  // Hidden rows carry .dsh-pv-hide AND an inline display:none — row layouts such as
  // `.dsh-rx .dsh-news-i { display:grid }` would otherwise out-rank a class rule.
  const pvHide = (e) => { e.classList.add("dsh-pv-hide"); e.style.display = "none"; };
  const pvShow = (e) => { e.classList.remove("dsh-pv-hide"); e.style.removeProperty("display"); };
  function previewList(body) {
    body.querySelectorAll(".dsh-pv-hide").forEach(pvShow);
    body.querySelectorAll(":scope > .dsh-seeall").forEach((e) => e.remove());
    // Phone AND desktop (owner 2026-10-15): every long list previews 10 rows + "See all".
    if (body.querySelector(".dsh-chart")) return;
    const items = itemsOf(body); if (items.length <= PREVIEW) return;
    items.slice(PREVIEW).forEach(pvHide);
    // A sub-heading (earnings week) left with nothing visible after it hides too.
    body.querySelectorAll(".dsh-earn-wk").forEach((h) => { if (items[PREVIEW].compareDocumentPosition(h) & Node.DOCUMENT_POSITION_FOLLOWING) pvHide(h); });
    body.insertAdjacentHTML("beforeend", `<button type="button" class="dsh-seeall">See all ${items.length} <span aria-hidden="true">›</span></button>`);
  }
  // The phone decision is re-checked whenever the layout settles (packMid) or the width
  // changes — an iPhone home-screen app can mount the view before its viewport width is
  // final, so a decision taken only at mount could leave full lists showing.
  let _lastPhone = null, _ros = null;
  // Every list-bearing card body: fill cards, the legal search results, the news rails,
  // and the long tables (stress list, regulatory calendar, funds in market, LP
  // commitments, implied path, credit wire).
  const PV_SEL = ".dsh-fill-body, #dsh-lgl-body, .dsh-newsrail > .dsh-card, .dsh-stresswrap, #dsh-regcal-b, #dsh-fim-b, #dsh-lpc, #dsh-implied";
  const repreview = (el) => { if (!el) return; if (isPhone()) stackTables(el); previewList(el); };
  function phoneTidy() {
    const ph = isPhone();
    if (_ros && _lastPhone !== null && ph !== _lastPhone) _ros.refresh();
    _lastPhone = ph;
    stackTables(host);
    host.querySelectorAll(PV_SEL).forEach(previewList);
  }
  let _closeSheet = null;
  // openSheet(body): the whole list, cloned, with a search bar.
  // openSheet(null, { move: el, onClose }): a live, interactive block (a roster with its
  // own search / sort / rows) is MOVED into the sheet and put back on close.
  function openSheet(body, { move = null, onClose = null } = {}) {
    if (_closeSheet) _closeSheet();
    const src = move || body;
    const card = src.closest(".dsh-card");
    const title = card ? ((card.querySelector(".dsh-h-t") || card.querySelector(".dsh-h") || {}).textContent || "").trim() : "";
    let clone, home = null;
    if (move) {
      home = document.createComment("dsh-sheet-home"); move.parentNode.insertBefore(home, move);
      clone = document.createElement("div"); clone.className = "dsh-sheet-body"; clone.appendChild(move);
    } else {
      clone = body.cloneNode(true);
      clone.className = "dsh-sheet-body"; clone.removeAttribute("id"); clone.removeAttribute("style");
      clone.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id"));
      clone.querySelectorAll(":scope > .dsh-h").forEach((e) => e.remove());
      clone.querySelectorAll(".dsh-pv-hide").forEach(pvShow);
      clone.querySelectorAll(".dsh-seeall").forEach((e) => e.remove());
    }
    const n = move ? null : itemsOf(clone).length;
    const sh = document.createElement("div");
    // Mounted on <body> (above the app's tab bar), carrying .dsh so card styles apply.
    sh.className = "dsh dsh-sheet"; sh.setAttribute("role", "dialog"); sh.setAttribute("aria-modal", "true"); sh.setAttribute("aria-label", title);
    sh.innerHTML = `<div class="dsh-sheet-hd"><span class="dsh-sheet-t">${esc(title)}${n != null ? ` <span class="dsh-n">(${n})</span>` : ""}</span><button type="button" class="dsh-sheet-x" aria-label="Close">✕</button></div>`
      + (move ? "" : `<div class="dsh-sheet-f"><input type="search" class="dsh-sheet-q" placeholder="Search this list" aria-label="Search this list" autocomplete="off"></div>`);
    sh.appendChild(clone);
    document.body.appendChild(sh);
    document.documentElement.classList.add("dsh-sheet-open");
    const onKey = (e) => { if (e.key === "Escape") close(); };
    const close = () => {
      if (move && home && home.parentNode) { home.parentNode.insertBefore(move, home); home.remove(); }
      sh.remove(); document.documentElement.classList.remove("dsh-sheet-open"); document.removeEventListener("keydown", onKey); _closeSheet = null;
      if (onClose) onClose();
    };
    document.addEventListener("keydown", onKey);
    sh.querySelector(".dsh-sheet-x").addEventListener("click", close);
    sh.addEventListener("click", (e) => { if (e.target.closest("a[href]")) close(); });
    const q = sh.querySelector(".dsh-sheet-q");
    if (q) q.addEventListener("input", () => { const v = q.value.trim().toLowerCase(); itemsOf(clone).forEach((it) => { it.style.display = !v || it.textContent.toLowerCase().includes(v) ? "" : "none"; }); });
    _closeSheet = close;
  }
  if (window.matchMedia) { try { window.matchMedia(PHONE_MQ).addEventListener("change", () => phoneTidy()); } catch { /* old Safari */ } }
  window.addEventListener("resize", () => { if (isPhone() !== _lastPhone) phoneTidy(); });
  window.addEventListener("pageshow", () => { if (isPhone() !== _lastPhone) phoneTidy(); });
  const liveOr = (id) => (_live[id] ? `<span class="dsh-live" data-live="${id}" title="Live">live</span>` : liveTag(id));
  let _eu = null;                        // /api/eurates payload (ECB · BoE · Eurostat)
  let _rates = null;                     // /api/rates payload (FRED OAS, SOFR, Treasury)

  // ---- Equities -----------------------------------------------------------
  function sectorBarsHTML() {
    const rows = EQ_SECTORS.rows.filter((r) => r.ytd != null).sort((a, b) => b.ytd - a.ytd);
    const max = Math.max(1, ...rows.map((r) => Math.abs(r.ytd)));
    const bar = (r) => {
      const w = (Math.abs(r.ytd) / max) * 50;
      const pos = r.ytd >= 0;
      return `<div class="dsh-sec"><span class="dsh-sec-nm">${esc(r.name)}</span>`
        + `<span class="dsh-sec-track"><span class="dsh-sec-bar ${pos ? "up" : "down"}" style="width:${w.toFixed(1)}%;${pos ? "left:50%" : `right:50%;left:auto`}"></span></span>`
        + `<span class="dsh-sec-v ${upcls(r.ytd)}">${pct1(r.ytd)}</span></div>`;
    };
    return `<div class="dsh-sectors" data-view="bars">${rows.map(bar).join("")}</div>`;
  }
  function volBand(level) {
    if (level == null) return ["—", ""];
    if (level < 15) return ["Low", "up"];
    if (level < 20) return ["Light", "up"];
    if (level < 28) return ["Neutral", ""];
    if (level < 40) return ["Elevated", "down"];
    return ["Panic", "down"];
  }
  function valVolHTML() {
    const val = EQ_VALUATION.map((v) => kpiRow({ k: `${v.name} fwd P/E`, v: v.fwdPE != null ? v.fwdPE.toFixed(1) + "×" : null, d: v.asOf, src: v.source, srcName: v.name + " valuation" })).join("");
    const vol = EQ_VOL.map((v) => { const [b, c] = volBand(v.level); return kpiRow({ k: v.name, v: v.level != null ? v.level.toFixed(1) : null, d: v.asOf, src: v.source, srcName: v.name, sub: b !== "—" ? `<span class="dsh-band ${c}">${b}</span>` : "" }); }).join("");
    return `<div class="dsh-kvgrid dsh-pc-grid">${val}${vol}</div>`;
  }
  function ipoHTML() {
    const row = (x) => `<tr><td class="dsh-nm">${esc(x.company)}</td><td>${esc(x.exchange)}</td><td class="dsh-r">${esc(x.size)}</td><td>${esc(x.timing)}</td><td><span class="dsh-tag dsh-tag-${(x.status || "").toLowerCase()}">${esc(x.status)}</span>${srcLink(x.source, x.company + " source")}</td></tr>`;
    return `<table class="dsh-tbl dsh-stk-src" data-stk-name="0" data-stk-key="2"><thead><tr><th>Company</th><th>Listing</th><th class="dsh-r">Size</th><th>Timing</th><th>Status</th></tr></thead><tbody>${EQ_IPO.map(row).join("")}</tbody></table>`;
  }
  // Two-week earnings calendar from the macro desk's EARNINGS structure
  // (weeks → days → rows): THIS week's slate first (forecast, not yet reported),
  // then LAST week's results. Columns are FORECAST vs ACTUAL EPS — the default
  // metric — and each release carries a note line beneath it: the "why" (result
  // colour, guidance, price reaction), plus a metric tag when the row tracks
  // something other than EPS (banks → pre-tax profit, Tesla → deliveries) so the
  // Fct/Act cells and their unit stay legible. An upcoming row shows its preview
  // note and "—" in Act until the company reports; the actual fills in on the next
  // refresh. Tickers link to Yahoo; the card header carries the week-ahead source.
  // Earnings calendar as a legible stacked list (was an over-stuffed 6-column
  // table): a week header, then one card per release — ticker · company · date ·
  // session on top, sector beneath, a forecast→actual line for each measure (EPS
  // and Revenue, or a key metric like a bank's pre-tax profit when there's no EPS
  // forecast), a colour-coded price reaction, and the "why" note. Tickers link to
  // Yahoo; upcoming releases read "awaited" until they report.
  function earningsHTML() {
    const weeks = (EARNINGS && EARNINGS.weeks) || [];
    if (!weeks.length) return "";
    const yahoo = (t) => `https://finance.yahoo.com/quote/${encodeURIComponent(t)}`;
    // A key metric (km) replaces EPS when the row has no EPS forecast but tracks
    // something else (banks → pre-tax profit) — shown with a metric tag.
    const km = (r) => (!r.estEps && r.km && (r.km.est || r.km.act)) ? r.km : null;
    const pxCls = (p) => { const s = String(p || "").trim(); return /^[+▲↑]/.test(s) ? "up" : /^[-–▼↓]/.test(s) ? "down" : ""; };
    // One forecast → actual measure. `tag` renders the metric name as a chip (km);
    // otherwise a light inline label (EPS / Rev).
    const measure = (label, est, act, tag) => {
      if (est == null && act == null) return "";
      const lab = tag ? `<span class="dsh-earn-metric">${esc(label)}</span>` : `<i class="dsh-earn-ml">${esc(label)}</i>`;
      const a = act ? `<b class="dsh-earn-act">${esc(act)}</b>` : `<span class="dsh-earn-await">awaited</span>`;
      return `<span class="dsh-earn-m">${lab} <span class="dsh-earn-fct">${est ? esc(est) : "—"}</span> <span class="dsh-earn-arw">·</span> ${a}</span>`;
    };
    const rel = (r, date) => {
      const k = km(r);
      const measures = k
        ? measure(k.l || "Metric", k.est, k.act, true)
        : measure("EPS", r.estEps, r.actEps) + measure("Rev", r.estRev, r.actRev);
      const px = r.px ? `<span class="dsh-earn-px ${pxCls(r.px)}">${esc(r.px)}</span>` : "";
      const when = r.when ? `<span class="dsh-earn-when">${esc(r.when)}</span>` : "";
      return `<div class="dsh-earn-rel">`
        + `<div class="dsh-earn-hd"><a class="dsh-earn-tk" href="${yahoo(r.t)}" target="_blank" rel="noopener noreferrer">${esc(r.t)}</a>`
        + `<span class="dsh-earn-co">${esc(r.n || "")}</span>${when}<span class="dsh-earn-dt">${esc(fmtDate(date))}</span></div>`
        + (r.tag ? `<div class="dsh-earn-tag">${esc(r.tag)}</div>` : "")
        + `<div class="dsh-earn-ms">${measures}${px}</div>`
        + (r.note ? `<div class="dsh-earn-note">${esc(r.note)}</div>` : "")
        + `</div>`;
    };
    const wk = (w) => `<div class="dsh-earn-wk">${esc(w.label || "")}</div>`
      + (w.days || []).map((day) => (day.rows || []).map((r) => rel(r, day.date)).join("")).join("");
    return `<div class="dsh-earn">${weeks.map(wk).join("")}</div>`;
  }
  const earnSrc = (EARNINGS && EARNINGS.srcs && EARNINGS.srcs[0] && EARNINGS.srcs[0].url) || "";
  // Key moments — a plain-language "why it moved" line for each index that carries
  // a sourced explanation (EQ_INDICES[].keyMoment). Grounded only: an index with no
  // sourced move renders nothing, and the whole card is omitted if none qualify.
  function keyMomentsBody() {
    const items = EQ_INDICES.filter((x) => x.keyMoment && x.keyMoment.text);
    if (!items.length) return "";
    const row = (x) => `<div class="dsh-km"><span class="dsh-km-t">${esc(x.name)}</span>`
      + `<span class="dsh-km-x">${nbNums(txt(x.keyMoment.text))}${x.keyMoment.date ? ` <span class="dsh-asof">${esc(isoDay(x.keyMoment.date))}</span>` : ""}${srcLink(x.keyMoment.src, (x.keyMoment.srcName || "source") + " — source")}</span></div>`;
    return items.map(row).join("");
  }
  // ETF flows heatmap — net fund flows across the Top Movers cross-asset ETF set
  // across windows (SECTOR_FLOWS, allocations.js). Diverging colour normalised
  // PER COLUMN so each window's leaders/laggards read despite the scale gap
  // between 1W and 1Y. Null cell → blank (grounded only, never fabricated).
  function fmtFlow(m) {
    if (m == null) return "—";
    const a = Math.abs(m), sign = m < 0 ? "-" : "";
    return a >= 1000 ? `${sign}$${(a / 1000).toFixed(a >= 9950 ? 0 : 1)}B` : `${sign}$${Math.round(a)}M`;
  }
  function sectorFlowsHTML() {
    const F = SECTOR_FLOWS;
    if (!F || !(F.sectors || []).length) return "";
    const wins = F.windows || [];
    const maxAbs = {};
    wins.forEach(([k]) => { maxAbs[k] = Math.max(1, ...F.sectors.map((s) => (s[k] == null ? 0 : Math.abs(s[k])))); });
    const heat = (v, max) => {
      if (v == null || !max) return "";
      const a = (Math.abs(v) / max) * 0.62 + 0.10;
      return ` style="background:color-mix(in srgb, var(--t-${v >= 0 ? "up" : "down"}) ${(a * 100).toFixed(1)}%, transparent)"`;
    };
    const head = `<tr><th>Sector</th>${wins.map(([, l]) => `<th class="dsh-r">${esc(l)}</th>`).join("")}</tr>`;
    const row = (s) => {
      const cells = wins.map(([k, l]) => {
        const v = s[k];
        if (v == null) return `<td class="dsh-fl-na">—</td>`;
        return `<td class="dsh-fl"${heat(v, maxAbs[k])} title="${esc(s.t)} · ${esc(l)}: ${v >= 0 ? "+" : ""}${esc(fmtFlow(v))} net flow">${esc(fmtFlow(v))}</td>`;
      }).join("");
      return `<tr><td class="dsh-nm"><a href="${esc(s.src)}" target="_blank" rel="noopener noreferrer">${esc(s.name)}</a> <span class="dsh-fl-t">${esc(s.t)}</span></td>${cells}</tr>`;
    };
    return `<table class="dsh-tbl dsh-fl-tbl"><thead>${head}</thead><tbody>${F.sectors.map(row).join("")}</tbody></table>`
      + `<p class="dsh-fl-note"><span class="dsh-fl-pos">green = inflow</span> · <span class="dsh-fl-neg">red = outflow</span>, shaded within each window (net ${esc(F.unit || "$M")}). Source: <a href="${esc(F.source)}" target="_blank" rel="noopener noreferrer">ETF Database</a>.</p>`;
  }
  // Major indices by jurisdiction — LOCAL index points (not ETFs), as a heat-shaded
  // table in the ETF-flows style with the SAME trailing windows (1W/1M/3M/6M/1Y):
  // one row per index under a region section header, each window cell the index's
  // price return over that period, shaded green (up) / red (down) normalised per
  // column. The latest index level (points) rides in the label cell. Snapshot from
  // WORLD_INDICES (dashboard/js/data.js), every value sourced + dated.
  // `live` (from /api/worldindices, keyed by index name) refreshes the level.
  const IDX_WINS = [["w1", "1W"], ["m1", "1M"], ["m3", "3M"], ["m6", "6M"], ["y1", "1Y"]];
  function worldIndicesHeatHTML(live) {
    const W = WORLD_INDICES;
    if (!W || !(W.regions || []).length) return "";
    const lvOf = (r) => { const l = live && live[r.name]; return (l && l.value != null) ? l.value : r.level; };
    const valK = (r, k) => { const l = live && live[r.name]; return (l && l[k] != null) ? l[k] : r[k]; };
    const maxAbs = {};
    IDX_WINS.forEach(([k]) => { maxAbs[k] = Math.max(1, ...W.regions.flatMap((g) => (g.rows || []).map((r) => { const v = valK(r, k); return v == null ? 0 : Math.abs(v); }))); });
    const heat = (v, k) => { if (v == null) return ""; const a = (Math.abs(v) / maxAbs[k]) * 0.62 + 0.10; return ` style="background:color-mix(in srgb, var(--t-${v >= 0 ? "up" : "down"}) ${(a * 100).toFixed(1)}%, transparent)"`; };
    const fmtLv = (v) => (v == null ? "" : Number(v).toLocaleString("en-GB", { maximumFractionDigits: 2 }));
    const cell = (r, k, l) => { const v = valK(r, k); return v == null ? `<td class="dsh-fl-na">—</td>` : `<td class="dsh-fl"${heat(v, k)} title="${esc(r.name)} · ${esc(l)}: ${pct1(v)}">${pct1(v)}</td>`; };
    // Each geography is introduced by a labelled band and set off by a rule, so the
    // table reads as regional blocks (United States, Europe, Asia-Pacific, …).
    const REGION_LABEL = { US: "United States", "South America": "South America", UK: "United Kingdom", Europe: "Europe", APAC: "Asia-Pacific" };
    const row = (r) => {
      const nm = r.source ? `<a href="${esc(r.source)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a>` : esc(r.name);
      const lv = lvOf(r);
      return `<tr><td class="dsh-nm">${nm}${lv != null ? ` <span class="dsh-fl-t">${fmtLv(lv)}</span>` : ""}</td>${IDX_WINS.map(([k, l]) => cell(r, k, l)).join("")}</tr>`;
    };
    const group = (g) => `<tr class="dsh-georow"><td class="dsh-geo" colspan="${IDX_WINS.length + 1}">${esc(REGION_LABEL[g.region] || g.region)}</td></tr>`
      + (g.rows || []).map(row).join("");
    return `<table class="dsh-tbl dsh-fl-tbl"><thead><tr><th>Index</th>${IDX_WINS.map(([, l]) => `<th class="dsh-r">${l}</th>`).join("")}</tr></thead>`
      + `<tbody>${W.regions.map(group).join("")}</tbody></table>`
      + `<p class="dsh-fl-note"><span class="dsh-fl-pos">green = up</span> · <span class="dsh-fl-neg">red = down</span>, price return shaded within each window; the grey figure is the latest index level (points).</p>`;
  }
  async function loadWorldIndices() {
    const box = host.querySelector("#dsh-wi-box");
    if (!box) return;
    try {
      const r = await fetch("/api/worldindices", { headers: { accept: "application/json" } });
      const d = r.ok ? await r.json() : null;
      const arr = (d && d.indices) || [];
      if (!arr.length) return;
      const live = {}; arr.forEach((x) => { if (x && x.name) live[x.name] = x; });
      box.innerHTML = worldIndicesHeatHTML(live);
      markLive("wi", arr.map((x) => x && x.asOf).filter(Boolean).sort().pop());
    } catch { /* keep the sourced snapshot */ }
  }
  // A compact "market tape" strip (major indices + VIX) for the top of a
  // terminal pane — the equities analogue of the Macro regime-pills strip.
  function eqTapeHTML() {
    const majors = ["S&P 500", "Euro Stoxx 50", "FTSE 100", "DAX", "Nasdaq Composite"];
    const flat = (WORLD_INDICES.regions || []).flatMap((g) => g.rows || []);
    const pick = majors.map((nm) => flat.find((r) => r.name === nm)).filter(Boolean);
    // ONE consistent window (1-month) so the tape never mixes horizons; where a
    // 1M change is missing (e.g. Dow), show the level alone rather than borrow a
    // longer window and read as a same-scale move.
    // Each tile stacks name → level → 1-month change so the numbers read cleanly
    // and every tile is the same height (an inline level+change+window wrapped
    // raggedly at narrow widths). See .dsh-tape in dashboard.css.
    const tape = (r) => { const v = r.m1, cls = v == null ? "" : (v >= 0 ? "dsh-pill-up" : "dsh-pill-dn"),
      lv = r.level != null ? Number(r.level).toLocaleString("en-GB", { maximumFractionDigits: 0 }) : "—";
      const chg = v == null ? "" : `<span class="dsh-pill-chg ${cls}">${pct1(v)} <span class="dsh-pill-win">1M</span></span>`;
      return `<span class="dsh-pill"><span class="dsh-pill-k">${esc(r.name)}</span><span class="dsh-pill-lv">${lv}</span>${chg}</span>`; };
    const vix = EQ_VOL.find((v) => /vix/i.test(v.name));
    return `<div class="dsh-pills dsh-tape">${pick.map(tape).join("")}${vix ? `<span class="dsh-pill"><span class="dsh-pill-k">${esc(vix.name)}</span><span class="dsh-pill-lv">${vix.level != null ? vix.level.toFixed(1) : "—"}</span></span>` : ""}</div>`
      + `<div class="dsh-tape-as">${asOf(isoDay(WORLD_INDICES.asOf))}${srcLink((pick[0] || {}).source, "Index levels source")}</div>`;
  }
  function equitiesHTML() {
    const km = keyMomentsBody();
    const mid = `<section class="dsh-card dsh-span">${eqTapeHTML()}</section>
      <h3 class="dsh-term-lbl">Indices &amp; flows</h3>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">World indices — benchmarks by jurisdiction ${liveOr("wi")} ${asOf(isoDay(WORLD_INDICES.asOf))}</h3><div class="dsh-scroll" id="dsh-wi-box">${worldIndicesHeatHTML()}</div></section>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">ETF flows — net fund flows ${asOf(SECTOR_FLOWS.asOf)}</h3><div class="dsh-scroll" id="dsh-flows-box">${sectorFlowsHTML()}</div></section>
      <h3 class="dsh-term-lbl">Sectors &amp; valuation</h3>
      <section class="dsh-card"><h3 class="dsh-h">${esc(EQ_SECTORS.label || "S&P 500 sectors — YTD")} ${asOf(EQ_SECTORS.asOf)}${srcLink(EQ_SECTORS.source, "S&P sector performance")}</h3>${sectorBarsHTML()}</section>
      <section class="dsh-card"><h3 class="dsh-h">Valuation &amp; volatility</h3>${valVolHTML()}</section>
      ${fillCard("dsh-vix", "VIX — 2 months", vixBody(), liveOr("vix"), "dsh-wide")}
      <h3 class="dsh-term-lbl">Calendar &amp; pipeline</h3>
      <section class="dsh-card dsh-wide dsh-fill"><h3 class="dsh-h">Earnings calendar${srcLink(earnSrc, "Earnings week-ahead source")}</h3><div class="dsh-fill-body">${earningsHTML()}</div></section>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">IPO / ECM pipeline</h3><div class="dsh-scroll">${ipoHTML()}</div></section>`;
    const news = km ? `<section class="dsh-card"><h3 class="dsh-h">Key moments <span class="dsh-n">why it moved</span></h3><div class="dsh-news dsh-km-wrap">${km}</div></section>` : "";
    return { mid, news, newsLabel: "Key moments" };
  }

  // ---- Credit -------------------------------------------------------------
  // Europe-first credit state: the spread stack (Euro HY leading), European +
  // US defaults & distress, the stress list (drills into Transactions), the
  // maturity wall and the deal/fund activity Wire itself tracks.
  // Stress table — sortable; each debtor drills into the European credits roster below.
  // Parse a debt string ("€15.5bn net", "~£19bn", "$25bn bonds") to a comparable
  // magnitude (currency-agnostic) so the table can rank by size of debt.
  const debtNum = (s) => {
    const m = String(s || "").replace(/,/g, "").match(/([\d.]+)\s*(tn|bn|m|k)?/i);
    if (!m) return 0;
    const n = parseFloat(m[1]) || 0;
    const u = (m[2] || "bn").toLowerCase();
    return n * (u === "tn" ? 1e12 : u === "bn" ? 1e9 : u === "m" ? 1e6 : u === "k" ? 1e3 : 1e9);
  };
  // Region from the HQ string — a US state/city ends ", US"; everything else on
  // the roster is European (the stress list is G7 + Western Europe only).
  const regionOf = (s) => (/,\s*US$/i.test(String(s.hq || "")) ? "US" : "Europe");
  // Default: Europe first, then grouped by status, biggest debt first inside.
  let _stressSort = { key: "region", dir: 1 };
  function stressRows() {
    const rows = CR_STRESS.map((s, i) => ({ ...s, region: regionOf(s), _i: i }));
    const k = _stressSort.key, dir = _stressSort.dir;
    const reg = (a, b) => (a.region === b.region ? 0 : a.region === "Europe" ? -1 : 1);
    if (k === "debt") rows.sort((a, b) => (debtNum(a.debt) - debtNum(b.debt)) * dir);
    else if (k === "region") rows.sort((a, b) => (reg(a, b) * dir) || String(a.status || "").localeCompare(String(b.status || "")) || (debtNum(b.debt) - debtNum(a.debt)));
    else if (k === "status") rows.sort((a, b) => (String(a.status || "").localeCompare(String(b.status || "")) * dir) || (debtNum(b.debt) - debtNum(a.debt)));
    else if (k === "latest") rows.sort((a, b) => String(b.latest || "").localeCompare(String(a.latest || "")) * dir);
    else if (k) rows.sort((a, b) => String(a[k] || "").localeCompare(String(b[k] || "")) * dir);
    return rows;
  }
  function stressHTML() {
    const chip = (k, l) => `<button type="button" class="dsh-sortchip${_stressSort.key === k ? " is-on" : ""}" data-sort="${k}">${l}${_stressSort.key === k ? (_stressSort.dir > 0 ? " ▲" : " ▼") : ""}</button>`;
    const row = (s) => `<tr>`
      + `<td class="dsh-nm"><a class="dsh-drill" href="${esc(`${ctx.base}/profiles/#/co/${encodeURIComponent(s.name)}`)}" title="Everything Wire holds on ${esc(s.name)} — deals, plans, judgments, alerts">${esc(s.name)}</a></td>`
      + `<td class="dsh-stress-sec">${esc(s.sector || "")}</td>`
      + `<td class="dsh-stress-hq">${esc(s.hq || "")}</td>`
      + `<td class="dsh-stress-debt">${esc(s.debt || "—")}</td>`
      + `<td><span class="dsh-tag dsh-tag-stress">${esc(s.status)}</span></td>`
      + `<td class="dsh-stress-as">${s.latest ? esc(isoDay(s.latest)) : "—"}</td>`
      + `<td class="dsh-note">${srcLink(s.source, s.name + " source")}</td></tr>`;
    return `<div class="dsh-stresswrap">`
      + `<div class="dsh-sortbar"><span class="dsh-sortlbl">Sort by</span>${chip("region", "Region")}${chip("status", "Status")}${chip("debt", "Debt")}${chip("latest", "Latest")}${chip("name", "Debtor")}</div>`
      + `<div class="dsh-scroll"><table class="dsh-tbl dsh-stresstbl dsh-stk-src" id="dsh-stress-body" data-stk-name="0" data-stk-key="3"><thead><tr><th>Debtor</th><th>Sector</th><th>HQ</th><th>Debt</th><th>Status</th><th>Latest</th><th>Src</th></tr></thead>`
      + `<tbody>${stressRows().map(row).join("")}</tbody></table></div></div>`;
  }
  // European loan maturities by year (S&P UBS index dashboard) — bar + cumulative %,
  // figures exactly as the dashboard's bar labels.
  function euWallHTML() {
    const ew = MATWALL && MATWALL.europeWall;
    if (!ew || !(ew.buckets || []).length) return "";
    const max = Math.max(...ew.buckets.map((b) => b.amt || 0)) || 1, tot = ew.buckets.reduce((s, b) => s + (b.amt || 0), 0) || 1;
    let cum = 0;
    const row = (b) => { cum += b.amt || 0; const pct = Math.max(2, Math.round((b.amt / max) * 100));
      return `<tr><td class="dsh-nm">${esc(b.y)}</td><td class="dsh-mw-barcell"><span class="dsh-mw-track"><span class="dsh-mw-fill" style="width:${pct}%"></span></span>`
        + `<span class="dsh-mw-hval">€${esc(b.amt.toFixed(2))}bn</span></td><td class="dsh-r">${Math.round((cum / tot) * 100)}%</td></tr>`; };
    return `<div class="dsh-mw-eu dsh-mw-euwall" data-mw="europe-wall"><div class="dsh-pc-reports-h">${esc(ew.title || "By year")}</div>`
      + `<table class="dsh-tbl dsh-mw-tbl dsh-mw-eutbl"><thead><tr><th>Year</th><th>Maturing</th><th class="dsh-r">Cumulative</th></tr></thead><tbody>${ew.buckets.map(row).join("")}</tbody></table>`
      + `<div class="dsh-ladder-cap">${esc(ew.note || "")} Data as of ${esc(ew.asOf || "")}.${srcLink(ew.src && ew.src.url, (ew.src && ew.src.name) || "source")}${srcLink(ew.src2 && ew.src2.url, (ew.src2 && ew.src2.name) || "index page")}</div></div>`;
  }
  function maturityHTML() {
    const w = MATWALL && MATWALL.rated, wall = MATWALL && MATWALL.ratedWall;
    if (!w) return "";
    const summary = `<div class="dsh-kvgrid">
      <div class="dsh-kv"><span class="dsh-kv-k">Rated corporate debt maturing</span><span class="dsh-kv-v">${esc(w.total)} <span class="dsh-band">${esc(w.window)}</span></span></div>
      <div class="dsh-kv"><span class="dsh-kv-k">Investment-grade share</span><span class="dsh-kv-v">${esc(String(w.igPct))}%${srcLink(w.src && w.src.url, "S&P maturity data")}</span></div>
    </div>`;
    // Europe first (the reader's market): LCD's European leveraged-loan wall, each row
    // with its own earlier reading where LCD published one.
    const eu = MATWALL.europe;
    const europe = eu && (eu.rows || []).length ? `<div class="dsh-mw-eu" data-mw="europe"><div class="dsh-pc-reports-h">${esc(eu.title || "Europe")} · LCD</div>`
      + `<div class="dsh-kvgrid">${eu.rows.map((x) => `<div class="dsh-kv"><span class="dsh-kv-k" title="${esc(x.k)}${x.sub ? " — " + esc(x.sub) : ""}">${esc(x.k)}</span>`
        + `<span class="dsh-kv-v">${esc(x.v)}${x.prev ? ` <span class="dsh-kv-yoy" title="earlier LCD reading">vs ${esc(x.prev)}</span>` : ""}</span></div>`).join("")}</div>`
      + `<div class="dsh-ladder-cap">${esc(eu.note || "")}${srcLink(eu.src && eu.src.url, (eu.src && eu.src.name) || "source")}${srcLink(eu.srcAlt && eu.srcAlt.url, (eu.srcAlt && eu.srcAlt.name) || "free copy")}${srcLink(eu.src2 && eu.src2.url, (eu.src2 && eu.src2.name) || "earlier reading")}</div></div>`
      + `<div class="dsh-pc-reports-h">Global rated corporate debt (S&amp;P)</div>` : "";
    let ladder = "";
    if (wall && Array.isArray(wall.buckets) && wall.buckets.length) {
      const max = wall.max || Math.max(...wall.buckets.map((b) => b.amt));
      const tot = wall.buckets.reduce((s, b) => s + (b.amt || 0), 0) || 1;
      const fmtB = (v) => v >= 1000 ? "$" + (v / 1000).toFixed(2) + "tn" : "$" + Math.round(v) + "bn";
      // Europe leads the per-year composition (the reader's market), then US, then the rest.
      const rank = (l) => (/europe/i.test(l) ? 0 : /^us$|united states/i.test(l) ? 1 : 2);
      const compCell = (b) => {
        const c = Array.isArray(b.comp) ? b.comp.filter((x) => x && x.label && x.amt != null).slice().sort((x, y) => rank(x.label) - rank(y.label)) : [];
        if (!c.length) return `<span class="dsh-mw-comp-na">—</span>`;
        return c.map((x) => `<span class="dsh-mw-comp-i"><span class="dsh-mw-comp-l">${esc(x.label)}</span> <span class="dsh-mw-comp-v">${esc(fmtB(x.amt))}</span></span>`).join("");
      };
      let cum = 0;
      const trow = (b) => { cum += b.amt || 0; const pct = Math.max(6, Math.round((b.amt / max) * 100));
        return `<tr><td class="dsh-nm">${esc(b.y)}</td>`
        + `<td class="dsh-mw-barcell"><span class="dsh-mw-track"><span class="dsh-mw-fill" style="width:${pct}%"></span></span><span class="dsh-mw-hval">$${(b.amt / 1000).toFixed(2)}tn</span></td>`
        + `<td class="dsh-mw-comp">${compCell(b)}</td>`
        + `<td class="dsh-r">${Math.round((cum / tot) * 100)}%</td></tr>`; };
      const anyComp = wall.buckets.some((b) => Array.isArray(b.comp) && b.comp.length);
      const table = `<table class="dsh-tbl dsh-mw-tbl"><thead><tr><th>Year</th><th>Maturing</th><th>Composition${anyComp && wall.compBy ? ` <span class="dsh-mw-comp-by">${esc(wall.compBy)}</span>` : ""}</th><th class="dsh-r">Cumulative</th></tr></thead><tbody>${wall.buckets.map(trow).join("")}</tbody></table>`;
      const cap = `<div class="dsh-ladder-cap">Face value maturing by year · ${esc(wall.asOf || "")}${wall.compNote ? ` · ${esc(wall.compNote)}` : ""}${srcLink(wall.src && wall.src.url, "S&P factbook")}</div>`;
      ladder = `<div class="dsh-mw-wall">${table}${cap}</div>`;
    }
    return euWallHTML() + europe + summary + ladder;
  }
  // Credit wire — the desk's freshest sourced deals/intel, DE-DUPLICATED (same
  // headline on the same day collapses) and capped. A deal opens in Wire's own
  // Transactions drawer (R36); an intel item links its source.
  const WIRE_CAP = 15;
  const _normHead = (h) => String(h || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  // ONE news-row format for every Dashboard list (R40): the headline, then the date on
  // the left and a grey tag (type · source / firm / court) on the right. In-app items
  // (deals, profiles) open in Wire; everything else opens its source in a new tab.
  const mgrName = (id) => ((managers || []).find((m) => m.id === id) || {}).name || "";
  function newsLi({ title, href, inApp = false, date, est = false, meta = "", cls = "", aCls = "", dCls = "", attrs = "" }) {
    const a = inApp ? ` class="dsh-drill${aCls ? ` ${aCls}` : ""}"` : ` target="_blank" rel="noopener noreferrer"${aCls ? ` class="${aCls}"` : ""}`;
    return `<li class="dsh-news-i${cls ? ` ${cls}` : ""}"${attrs}><a href="${esc(href)}"${a}>${txt(title)}</a>`
      + `<span class="dsh-news-d${dCls ? ` ${dCls}` : ""}"${est ? ' title="Approximate date — the source shows no exact publication date"' : ""}>${est ? "c. " : ""}${esc(/^\d{4}-\d{2}-\d{2}/.test(String(date || "")) ? fmtDate(date) : isoDay(date))}</span>`
      + (meta ? `<span class="dsh-news-s">${meta}</span>` : "") + `</li>`;
  }
  const newsUl = (rows, cls = "") => `<ul class="dsh-news dsh-rx${cls ? ` ${cls}` : ""}">${rows.join("")}</ul>`;
  const metaOf = (...parts) => esc(parts.filter(Boolean).join(" · "));
  // Europe-first (review 2026-10-15, #5): by default only European items — a deal whose
  // borrower/asset region is European (deal-tags), an intel item whose own text names
  // Europe/UK/€/£ — with one tap to "All regions".
  let _cwScope = "eu";
  const _mgrHq = new Map((managers || []).map((m) => [m.id, String(m.hq || "")]));
  const euMgr = (id) => { const h = _mgrHq.get(id) || ""; return !!h && !/\b(US|USA|United States|Canada|Australia|Japan|Singapore|Hong Kong|Asia)\b/.test(h) && /,\s*(UK|[A-Z][a-z]+|[A-Z]{2})$|London|Paris|Frankfurt|Milan|Madrid|Stockholm|Copenhagen|Luxembourg|Amsterdam|Dublin|Zurich|Geneva|Munich|Brussels|Helsinki|Oslo|Jersey/.test(h); };
  const isEuItem = (x) => x._deal ? EUROPE_REGIONS.includes(tagsOf(x, DEAL_TAGS).region) : (isEuro(x) || euMgr(x.managerId));
  function creditWireItems() {
    const seen = new Set(), out = [];
    [...(deals || []).map((x) => ({ ...x, _deal: true })), ...(intel || [])]
      .filter((x) => x && x.date && (x.headline || x.title) && (x.sourceUrl || x.url))
      .filter((x) => _cwScope === "all" || isEuItem(x))
      .sort(byDateDesc)
      .forEach((x) => {
        const u = x.sourceUrl || x.url;
        const k1 = `${x.date}|${_normHead(x.headline || x.title)}`, k2 = `u|${u}`;
        if (seen.has(k1) || seen.has(k2) || out.length >= WIRE_CAP) return;
        seen.add(k1); seen.add(k2); out.push(x);
      });
    return out;
  }
  function creditNewsHTML() {
    const items = creditWireItems();
    if (!items.length) return "";
    const row = (x) => {
      const inApp = !!(x._deal && x.id);
      return newsLi({ title: x.headline || x.title, href: inApp ? `${ctx.base}/transactions/#/deal/${encodeURIComponent(x.id)}` : (x.sourceUrl || x.url), inApp,
        date: x.date, meta: metaOf(x.type, mgrName(x.managerId)) });
    };
    return newsUl(items.map(row));
  }
  // US private credit — Fitch's PCDR + KBRA's middle-market monitor and market
  // context (PRIVATE_CREDIT). Every metric links its source; a `prev` shows the
  // year-ago comparison with its own source.
  function privateCreditHTML() {
    const P = PRIVATE_CREDIT;
    if (!P || !(P.metrics || []).length) return "";
    const yoy = (x) => x.prev
      ? `<a class="dsh-kv-yoy" href="${esc(x.prevSrc || x.src)}" target="_blank" rel="noopener noreferrer" title="a year earlier${x.prevAsOf ? ` (${esc(x.prevAsOf)})` : ""} — source">vs ${esc(x.prev)}${x.prevAsOf ? ` ${esc(x.prevAsOf)}` : ""}</a>`
      : "";
    // The period each metric refers to, read from its sourced sub-line ("TTM Aug 2026 · …").
    const per = (x) => ((String(x.sub || "").match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) 20\d{2}\b|\b[1-4]Q\d{2}\b|\bQ[1-4]'\d{2}\b|\b20\d{2}\b/) || [])[0] || "");
    const kv = (x) => kpiRow({ k: x.k, v: x.v, d: per(x), src: x.src, srcName: x.srcName, title: x.sub ? `${x.k} — ${x.sub}` : x.k, sub: yoy(x) });
    // Research: the same news row as every list (title · date · source); the anchor keeps
    // its .dsh-pc-report hook.
    const reports = (P.reports || []).length
      ? `<div class="dsh-pc-reports"><div class="dsh-pc-reports-h">Research</div>${newsUl(P.reports.map((r) => newsLi({ title: r.title, href: r.url, date: r.date, meta: metaOf(r.srcName), aCls: "dsh-pc-report" })))}</div>`
      : "";
    return `<div class="dsh-kvgrid dsh-pc-grid">${P.metrics.map(kv).join("")}</div>${reports}`;
  }
  // Europe — defaults & distress: the curated, sourced European default/distress
  // rates (EU_DISTRESS) plus the LIVE Eurostat bankruptcy index (/api/eurates).
  function euDistressHTML() {
    const E = EU_DISTRESS || {};
    // Live Eurostat reading when loaded; else the last verified reading (labelled by its own quarter).
    const b = (_eu && _eu.bankruptcies && _eu.bankruptcies.value != null) ? _eu.bankruptcies : (E.bankruptcyFallback && E.bankruptcyFallback.value != null ? E.bankruptcyFallback : null);
    const bk = kpiRow({ id: "dsh-eu-bkrt", k: "EU bankruptcy declarations (index)", title: "Eurostat sts_rb_q, EU27, seasonally & calendar adjusted, 2021=100",
      v: b ? b.value.toFixed(1) : null, d: b ? b.asOf : null, src: (b && b.href) || "https://ec.europa.eu/eurostat/databrowser/view/sts_rb_q/default/table", srcName: "Eurostat",
      sub: b && b.yearAgo != null ? `vs ${esc(b.yearAgo.toFixed(1))} ${esc(isoDay(b.yearAgoAsOf || ""))}` : "" });
    return `<div class="dsh-kvgrid dsh-pc-grid">${(E.metrics || []).map((x) => kpiRow({ k: x.k, v: x.v, d: x.asOf, src: x.src, srcName: x.srcName, sub: x.measure ? esc(x.measure) : "", title: x.sub ? `${x.k} — ${x.sub}` : x.k })).join("")}${bk}</div>`;
  }

  // Activity Wire itself tracks — European CLO pricings and private-credit fund
  // closes counted from the desk's own sourced deal records (labelled as tracked
  // by Wire, never presented as a market-wide statistic).
  // One KPI row anatomy (R40): label (wraps, with an optional faint sub-line) ·
  // value (right) · period (fixed column) · SRC (fixed column).
  const kpiRow = ({ k, v, d, src, srcName, sub, id, title }) => `<div class="dsh-kv dsh-kv4"${id ? ` id="${id}"` : ""}>`
    + `<span class="dsh-kv-k" title="${esc(title || k)}">${esc(k)}${sub ? `<span class="dsh-kv-sub">${sub}</span>` : ""}</span>`
    + `<span class="dsh-kv-v">${v != null ? esc(v) : "—"}</span>`
    + `<span class="dsh-kv-d">${d ? esc(isoDay(d)) : ""}</span>`
    + `<span class="dsh-kv-s">${srcLink(src, (srcName || "source") + " — source")}</span></div>`;
  const isEuro = (x) => /€|\bEUR\b|\beuro(pe|pean)?\b|\bUK\b|£|\bGBP\b|sterling/i.test(`${x.headline || ""} ${x.summary || ""}`);
  const isClo = (x) => x.type === "CLO" || x.clo === true;
  const isClose = (x) => /final close|fundraise|first close/i.test(x.type || "");
  function activityHTML() {
    const D = (deals || []).filter((x) => x && x.date);
    const now = new Date(), ym = (d) => d.toISOString().slice(0, 7);
    const m0 = ym(now), m1 = ym(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))), m2 = ym(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1)));
    const cnt = (f, m) => D.filter((x) => f(x) && String(x.date).slice(0, 7) === m).length;
    const lines = [["European CLOs priced", (x) => isClo(x) && isEuro(x)], ["All CLOs priced", isClo], ["Fund closes / raises", isClose], ["European deals (all types)", isEuro]];
    const mo = (m) => MONTHS[+m.slice(5) - 1];
    const head = `<tr><th>Tracked by Wire</th><th class="dsh-r">${mo(m2)}</th><th class="dsh-r">${mo(m1)}</th><th class="dsh-r" title="month to date">${mo(m0)}*</th></tr>`;
    const rows = lines.map(([l, f]) => `<tr><td class="dsh-nm">${esc(l)}</td><td class="dsh-r">${cnt(f, m2)}</td><td class="dsh-r">${cnt(f, m1)}</td><td class="dsh-r">${cnt(f, m0)}</td></tr>`).join("");
    const latest = D.filter((x) => (isClo(x) || isClose(x))).sort(byDateDesc)
      .map((x) => newsLi({ title: x.headline, href: `${ctx.base}/transactions/#/deal/${encodeURIComponent(x.id)}`, inApp: true, date: x.date, meta: metaOf(isClo(x) ? "CLO" : x.type, mgrName(x.managerId)) })).join("");
    return `<div class="dsh-scroll"><table class="dsh-tbl dsh-act-tbl"><thead>${head}</thead><tbody>${rows}</tbody></table></div>`
      + (latest ? `<div class="dsh-pc-reports-h">Latest CLOs &amp; fund closes</div><ul class="dsh-news dsh-rx dsh-act-list">${latest}</ul>` : "");
  }
  // ---- Fill cards (R40): charts and long lists that take whatever height the
  // layout gives them — a chart scales, a list shows more rows or scrolls — so
  // packed columns always end level. Built only from data Wire already holds.
  const SERIES_C = ["var(--t-hdg)", "var(--t-accent)", "var(--t-mac)", "var(--t-amber)"];
  // Multi-line chart over a common y axis: series = [{label, pts:[[x,y]…], last}].
  // The SVG stretches to its box (non-scaling strokes); axis labels are HTML.
  // Every chart is labelled on both axes: the x axis is TIME — evenly spaced date ticks
  // with an axis title ("Date, daily" / "Date, weekly") — and the y axis carries value
  // ticks with the unit plus its title above the tick column.
  const shortDay = (ms) => { const d = new Date(ms); return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}${d.getUTCFullYear() !== new Date().getUTCFullYear() ? ` ${d.getUTCFullYear()}` : ""}`; };
  function lineChart(series, { unit = "", fmt = (v) => v.toFixed(2), zero = false, ytitle = "", xtitle = "Date, daily" } = {}) {
    const all = series.flatMap((s) => s.pts.map((p) => p[1])).filter(Number.isFinite);
    const xs = series.flatMap((s) => s.pts.map((p) => p[0]));
    if (!all.length || !xs.length) return `<p class="dsh-load">No history available.</p>`;
    let lo = Math.min(...all, zero ? 0 : Infinity), hi = Math.max(...all, zero ? 0 : -Infinity);
    if (hi - lo < 1e-9) { hi += 1; lo -= 1; }
    const pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
    const x0 = Math.min(...xs), x1 = Math.max(...xs) || 1;
    const X = (x) => (x1 === x0 ? 0 : ((x - x0) / (x1 - x0)) * 100), Y = (y) => (1 - (y - lo) / (hi - lo)) * 100;
    const ticks = [hi - pad, (hi + lo) / 2, lo + pad];
    const lines = series.map((s, i) => `<polyline fill="none" stroke="${SERIES_C[i % SERIES_C.length]}" stroke-width="1.6" vector-effect="non-scaling-stroke" points="${s.pts.filter((p) => Number.isFinite(p[1])).map((p) => `${X(p[0]).toFixed(2)},${Y(p[1]).toFixed(2)}`).join(" ")}"/>`).join("");
    const zl = zero && lo < 0 && hi > 0 ? `<line x1="0" x2="100" y1="${Y(0).toFixed(2)}" y2="${Y(0).toFixed(2)}" stroke="var(--t-grid2)" stroke-width="1" vector-effect="non-scaling-stroke"/>` : "";
    const legend = series.map((s, i) => `<span class="dsh-lg"><i style="background:${SERIES_C[i % SERIES_C.length]}"></i>${esc(s.label)} <b>${s.last != null ? esc(s.last) : ""}</b></span>`).join("");
    const grid = ticks.map((t) => `<line x1="0" x2="100" y1="${Y(t).toFixed(2)}" y2="${Y(t).toFixed(2)}" stroke="var(--t-grid)" stroke-width="1" stroke-dasharray="2 3" vector-effect="non-scaling-stroke"/>`).join("");
    // Time ticks: five evenly spaced dates (start and end pinned to the plot edges).
    const N = 4, tx = x1 > x0 ? Array.from({ length: N + 1 }, (_, k) => x0 + ((x1 - x0) * k) / N) : [x0];
    // A span over ~4 months reads in months ("Dec 25"); shorter spans in days ("12 Oct").
    const lab = x1 - x0 > 120 * 864e5 ? (ms) => { const d = new Date(ms); return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(2)}`; } : shortDay;
    const xt = tx.map((t, k) => `<span style="left:${X(t).toFixed(1)}%"${k === 0 ? ' class="is-first"' : k === tx.length - 1 ? ' class="is-last"' : ""}>${esc(lab(t))}</span>`).join("");
    const vgrid = tx.slice(1, -1).map((t) => `<line y1="0" y2="100" x1="${X(t).toFixed(2)}" x2="${X(t).toFixed(2)}" stroke="var(--t-grid)" stroke-width="1" stroke-dasharray="2 3" vector-effect="non-scaling-stroke"/>`).join("");
    return `<div class="dsh-lgs">${legend}</div>${ytitle ? `<div class="dsh-chart-yt">${esc(ytitle)}</div>` : ""}<div class="dsh-chart"><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="${esc(`${ytitle || series.map((s) => s.label).join(", ")} over time, ${shortDay(x0)} to ${shortDay(x1)}`)}">${grid}${vgrid}${zl}${lines}</svg>`
      + `<div class="dsh-chart-y">${ticks.map((t) => `<span style="top:${Y(t).toFixed(1)}%">${esc(fmt(t))}${esc(unit)}</span>`).join("")}</div></div>`
      + `<div class="dsh-chart-x"><div class="dsh-chart-xt">${xt}</div><div class="dsh-chart-t">${esc(xtitle)}</div></div>`;
  }
  // Credit · spread history: each OAS series' move in bp over its ~1-month daily history.
  function spreadHistBody() {
    const arr = (Array.isArray(_rates && _rates.rates) ? _rates.rates : []).filter((x) => x && /oas/i.test(x.label || "") && Array.isArray(x.history) && x.history.length > 2)
      .sort((a, b) => { const r = (x) => { const i = SPREAD_ORDER.findIndex((re) => re.test(x.label)); return i < 0 ? 9 : i; }; return r(a) - r(b); });
    if (!arr.length) return _rates === null ? `<p class="dsh-load">Loading spread history…</p>` : `<p class="dsh-load">Spread history unavailable — <a href="https://fred.stlouisfed.org/series/BAMLHE00EHYIOAS" target="_blank" rel="noopener noreferrer">FRED</a></p>`;
    // Each point is placed at its own observation date (historyDates, from the feed).
    const dated = arr.filter((x) => Array.isArray(x.historyDates) && x.historyDates.length === x.history.length);
    if (!dated.length) return `<p class="dsh-load">Spread history dates unavailable — <a href="https://fred.stlouisfed.org/series/BAMLHE00EHYIOAS" target="_blank" rel="noopener noreferrer">FRED</a></p>`;
    const series = dated.map((x) => { const h = x.history.map(Number), b0 = h[0]; const pts = h.map((v, i) => [Date.parse(x.historyDates[i]), Math.round((v - b0) * 100)]); const d = pts[pts.length - 1][1];
      return { label: String(x.label).replace(/\s*OAS$/i, "").replace(/^EURO /, "Euro "), pts, last: `${d > 0 ? "+" : ""}${d}` }; });
    return lineChart(series, { unit: "bp", fmt: (v) => `${v > 0 ? "+" : ""}${Math.round(v)}`, zero: true, ytitle: "OAS change since start, bp" });
  }
  // Credit · most active lenders (deal records tracked by Wire, last 90 days).
  function lendersBody() {
    const cut = new Date(Date.now() - 90 * 864e5).toISOString().slice(0, 10);
    const byId = new Map((managers || []).map((m) => [m.id, m]));
    const n = new Map();
    // Each lender of a club deal counts (R39m); a sponsor / borrower role is not lending.
    (deals || []).forEach((d) => { if (d && d.date >= cut) for (const id of dealLenderIds(d)) if (byId.has(id)) n.set(id, (n.get(id) || 0) + 1); });
    const rows = [...n.entries()].sort((a, b) => b[1] - a[1] || byId.get(a[0]).name.localeCompare(byId.get(b[0]).name)).slice(0, 40);
    if (!rows.length) return `<p class="dsh-load">No tracked deals in the last 90 days.</p>`;
    return `<table class="dsh-tbl dsh-mini dsh-stk-src" data-stk-name="0" data-stk-key="1" data-stk-lab="1"><thead><tr><th>Manager</th><th class="dsh-r">Deals</th></tr></thead><tbody>`
      + rows.map(([id, c]) => `<tr><td><a class="dsh-drill" href="${esc(`${ctx.base}/profiles/#/manager/${id}`)}">${esc(byId.get(id).name)}</a></td><td class="dsh-r">${c}</td></tr>`).join("") + `</tbody></table>`;
  }
  // Credit · distress & restructuring deals Wire has tracked (newest first, deal drawer).
  function distressDealsBody() {
    // Newest first; one row per story (same headline on the same day collapses).
    const seen = new Set();
    const rows = (deals || []).filter((d) => d && d.date && d.id && /restructuring|bankruptcy|distress/i.test(d.type || "")).sort(byDateDesc)
      .filter((d) => { const k = `${d.date}|${String(d.headline || "").trim().toLowerCase()}`; if (seen.has(k)) return false; seen.add(k); return true; });
    if (!rows.length) return `<p class="dsh-load">No tracked restructuring deals.</p>`;
    return newsUl(rows.map((x) => newsLi({ title: x.headline, href: `${ctx.base}/transactions/#/deal/${encodeURIComponent(x.id)}`, inApp: true, date: x.date, meta: metaOf(x.type, mgrName(x.managerId)) })));
  }
  // Funds in market (review 2026-10-15, #12) — "which managers are raising European
  // direct-lending funds, and from which LPs?" in one card: every fund whose status is
  // Pre-marketing / Open / First Close, Europe-focused by default, newest update first.
  // A status not refreshed in 12+ months is flagged STALE (it may have closed since);
  // named LPs come from the fund's sourced investors + the commitments ledger.
  let _fimScope = "eu", _fimStrat = "";
  const FIM_STATUS = new Set(["Pre-marketing", "Open", "First Close"]);
  const EU_GEO = /europe|pan-?european|\buk\b|united kingdom|ireland|nordic|dach|germany|france|benelux|italy|spain|iberia|netherlands|belgium|switzerland|sweden|denmark|norway|finland|poland|cee/i;
  const lpName = (id) => ((lps || []).find((l) => l.id === id) || {}).name || "";
  function fundLps(f) {
    const named = (f.investors || []).map((x) => (typeof x === "string" ? x : x && (x.name || x.lp))).filter(Boolean);
    (commitments || []).forEach((c) => { if (c.fundId === f.id) { const n = lpName(c.lpId); if (n && !named.includes(n)) named.push(n); } });
    return named;
  }
  function fundsInMarket() {
    const yr = new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 10);
    return (funds || []).filter((f) => FIM_STATUS.has(f.status))
      .filter((f) => _fimScope === "all" || EU_GEO.test(`${f.geoFocus || ""} ${f.domicile || ""}`))
      .filter((f) => !_fimStrat || f.strategy === _fimStrat)
      .map((f) => ({ f, lps: fundLps(f), stale: !f.asOf || String(f.asOf) < yr }))
      .sort((a, b) => (a.stale - b.stale) || String(b.f.asOf || "").localeCompare(String(a.f.asOf || "")));
  }
  function fimHTML() {
    const rows = fundsInMarket();
    const strats = [...new Set((funds || []).filter((f) => FIM_STATUS.has(f.status)).map((f) => f.strategy).filter(Boolean))].sort();
    const ccy = (f) => ({ EUR: "€", GBP: "£", USD: "$" }[f.ccy] || (f.ccy ? f.ccy + " " : "$"));
    const amt = (f, v) => (v != null ? fmtBn(v / 1000, ccy(f)) : "—");
    const bar = `<div class="dsh-sortbar"><button type="button" class="dsh-sortchip${_fimScope === "eu" ? " is-on" : ""}" data-fim-scope="1">${_fimScope === "eu" ? "Europe" : "All regions"}</button>`
      + `<select class="dsh-fim-strat" aria-label="Strategy"><option value="">All strategies</option>${strats.map((x) => `<option value="${esc(x)}"${x === _fimStrat ? " selected" : ""}>${esc(x)}</option>`).join("")}</select>`
      + `<span class="dsh-n">${rows.length} fund${rows.length === 1 ? "" : "s"} · ${rows.filter((r) => r.lps.length).length} with named LPs</span></div>`;
    const row = ({ f, lps: L, stale }) => `<tr><td class="dsh-nm"><a class="dsh-drill" href="${esc(`${ctx.base}/profiles/#/manager/${encodeURIComponent(f.managerId)}/vehicles`)}">${esc(f.name)}</a></td>`
      + `<td>${esc(((managers || []).find((m) => m.id === f.managerId) || {}).name || "—")}</td>`
      + `<td>${esc(f.strategy || "—")}</td><td><span class="dsh-tag">${esc(f.status)}</span>${stale ? ` <span class="dsh-tag dsh-tag-stale" title="Status not refreshed in 12+ months — it may have closed since">stale</span>` : ""}</td>`
      + `<td class="dsh-r">${amt(f, f.targetSize)}</td><td class="dsh-r">${amt(f, f.raised)}</td>`
      + `<td class="dsh-fim-lps">${L.length ? esc(L.slice(0, 3).join(", ")) + (L.length > 3 ? ` +${L.length - 3}` : "") : "—"}</td>`
      + `<td class="dsh-stress-as">${f.asOf ? esc(isoDay(String(f.asOf).slice(0, 10))) : "—"}</td></tr>`;
    return bar + `<div class="dsh-scroll"><table class="dsh-tbl dsh-fim-tbl dsh-stk-src" data-stk-name="0" data-stk-key="3"><thead><tr><th>Fund</th><th>Manager</th><th>Strategy</th><th>Status</th><th class="dsh-r">Target</th><th class="dsh-r">Raised</th><th>Named LPs</th><th>As of</th></tr></thead><tbody>`
      + (rows.length ? rows.map(row).join("") : `<tr><td colspan="8" class="dsh-load">No funds in market for this filter.</td></tr>`) + `</tbody></table></div>`;
  }
  // Latest LP commitments (review #15) — the public commitments ledger, newest first:
  // LP → manager / fund, amount, date, each linked to its source.
  function lpCommitsHTML() {
    const rows = (commitments || []).filter((c) => c.date && c.sourceUrl).slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 25);
    if (!rows.length) return `<p class="dsh-load">No dated commitments tracked.</p>`;
    const sym = { EUR: "€", GBP: "£", USD: "$" };
    const amt = (c) => (c.amount != null ? `${sym[c.ccy] || (c.ccy ? c.ccy + " " : "")}${c.amount >= 1000 ? +(c.amount / 1000).toFixed(2) + "bn" : c.amount + "m"}` : "—");
    const mName = (c) => ((managers || []).find((m) => m.id === c.managerId) || {}).name || c.manager || "—";
    const fName = (c) => ((funds || []).find((f) => f.id === c.fundId) || {}).name || c.fund || "";
    return `<div class="dsh-scroll"><table class="dsh-tbl dsh-lpc-tbl dsh-stk-src" data-stk-name="0" data-stk-key="2"><thead><tr><th>Investor</th><th>Manager / fund</th><th class="dsh-r">Amount</th><th>Date</th><th>Src</th></tr></thead><tbody>`
      + rows.map((c) => `<tr><td class="dsh-nm"><a class="dsh-drill" href="${esc(`${ctx.base}/profiles/#/lp/${encodeURIComponent(c.lpId)}`)}">${esc(lpName(c.lpId))}</a></td>`
        + `<td>${c.managerId ? `<a class="dsh-drill" href="${esc(`${ctx.base}/profiles/#/manager/${encodeURIComponent(c.managerId)}`)}">${esc(mName(c))}</a>` : esc(mName(c))}${fName(c) ? ` <span class="dsh-n">${esc(fName(c))}</span>` : ""}</td>`
        + `<td class="dsh-r">${esc(amt(c))}</td><td class="dsh-stress-as">${esc(isoDay(c.date))}</td><td class="dsh-note">${srcLink(c.sourceUrl, "source")}</td></tr>`).join("")
      + `</tbody></table></div>`;
  }
  const fillCard = (id, title, body, meta = "", cls = "") => `<section class="dsh-card dsh-fill${cls ? ` ${cls}` : ""}" id="${id}"><h3 class="dsh-h">${title} ${meta}</h3><div class="dsh-fill-body">${body}</div></section>`;
  function creditHTML() {
    const mid = `<section class="dsh-card dsh-spreads-card"><h3 class="dsh-h">Credit spreads — ICE BofA OAS ${liveOr("spreads")}</h3><div id="dsh-spreads" class="dsh-spreads">${spreadsBody()}</div></section>
      <section class="dsh-card"><h3 class="dsh-h">All-in yields &amp; BBB — ICE BofA ${liveOr("yld")}</h3><div id="dsh-yields" class="dsh-spreads">${yieldsBody()}</div></section>
      <h3 class="dsh-term-lbl">Defaults &amp; distress</h3>
      <div class="dsh-wide dsh-row2">
        <section class="dsh-card dsh-pc-card"><h3 class="dsh-h">Europe — defaults &amp; distress ${asOf(EU_DISTRESS && EU_DISTRESS.asOf)}</h3><div id="dsh-eu-distress">${euDistressHTML()}</div></section>
        <section class="dsh-card dsh-pc-card"><h3 class="dsh-h">US private credit ${asOf(PRIVATE_CREDIT && PRIVATE_CREDIT.asOf)}</h3>${privateCreditHTML()}</section>
      </div>
      <h3 class="dsh-term-lbl">Stress &amp; refinancing</h3>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">Stress — situations in focus <span class="dsh-n">(${CR_STRESS.length})</span></h3>${stressHTML()}</section>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">Maturity wall ${asOf(MATWALL && ((MATWALL.europeWall && MATWALL.europeWall.asOf) || (MATWALL.europe && MATWALL.europe.asOf) || (MATWALL.ratedWall && MATWALL.ratedWall.asOf)))}</h3><div class="dsh-scroll">${maturityHTML()}</div></section>
      ${fillCard("dsh-sphist", "Spread history — 1M change", spreadHistBody(), liveOr("sphist"))}
      ${fillCard("dsh-lenders", "Most active lenders — 90 days", lendersBody(), `<span class="dsh-n">tracked by Wire</span> ${asOf(isoDay(new Date().toISOString().slice(0, 10)))}`)}
      ${fillCard("dsh-dd", "Restructuring &amp; distress deals", distressDealsBody(), `<span class="dsh-n">tracked by Wire</span>`)}
      <h3 class="dsh-term-lbl">Fundraising</h3>
      <section class="dsh-card dsh-wide" id="dsh-fim"><h3 class="dsh-h">Funds in market ${asOf(isoDay(new Date().toISOString().slice(0, 10)))}</h3><div id="dsh-fim-b">${fimHTML()}</div></section>
      <section class="dsh-card dsh-wide" id="dsh-lpc"><h3 class="dsh-h">LP commitments — latest <span class="dsh-n">(${(commitments || []).filter((c) => c.date).length} dated)</span></h3>${lpCommitsHTML()}</section>
      <h3 class="dsh-term-lbl">Activity</h3>
      <section class="dsh-card dsh-fill"><h3 class="dsh-h">CLOs &amp; fund closes ${asOf(isoDay(new Date().toISOString().slice(0, 10)))}</h3><div class="dsh-fill-body">${activityHTML()}</div></section>
      ${rosterCardsHTML(asOf)}`;
    const scopeBtn = `<button type="button" class="dsh-sortchip dsh-cw-scope${_cwScope === "eu" ? " is-on" : ""}" data-cwscope="1" title="Europe only / all regions">${_cwScope === "eu" ? "Europe" : "All regions"}</button>`;
    const news = `<section class="dsh-card" id="dsh-cw"><h3 class="dsh-h">Credit wire — latest deals &amp; intel ${scopeBtn}</h3><div id="dsh-cw-b">${creditNewsHTML()}</div></section>`;
    return { mid, news, newsLabel: "Credit wire" };
  }
  // ICE BofA OAS stack from /api/rates. The feed reports OAS in PERCENT (3.11 =
  // 311bp) — converted to basis points here. Euro HY leads; each tile shows the
  // level, its 1W / 1M move (from the feed's ~1-month daily history) and as-of.
  const SPREAD_ORDER = [/euro hy/i, /us hy/i, /us ig/i, /us ccc/i];
  function spreadsBody() {
    const arr = Array.isArray(_rates && _rates.rates) ? _rates.rates : [];
    const rows = arr.filter((x) => x && /oas/i.test(x.label || "") && x.value != null)
      .sort((a, b) => { const r = (x) => { const i = SPREAD_ORDER.findIndex((re) => re.test(x.label)); return i < 0 ? 9 : i; }; return r(a) - r(b); });
    if (!rows.length) {
      return _rates === null ? `<p class="dsh-load">Loading live spreads…</p>`
        : `<p class="dsh-load">Live spreads unavailable — <a href="https://fred.stlouisfed.org/series/BAMLHE00EHYIOAS" target="_blank" rel="noopener noreferrer">FRED Euro HY OAS</a> · <a href="https://fred.stlouisfed.org/series/BAMLH0A0HYM2" target="_blank" rel="noopener noreferrer">US HY OAS</a></p>`;
    }
    const bp = (v) => Math.round(v * 100);
    const back = (h, k) => (Array.isArray(h) && h.length > k ? h[h.length - 1 - k] : null);
    const chg = (x, k) => {
      const p = back(x.history, k);
      if (p == null || !Number.isFinite(+p)) return `<td class="dsh-r dsh-chg">—</td>`;
      const d = bp(x.value) - bp(+p);
      return `<td class="dsh-r dsh-chg ${d > 0 ? "down" : d < 0 ? "up" : ""}" title="change in basis points (wider = red)">${d > 0 ? "+" : ""}${d}</td>`;
    };
    // One mini table (R40): every value shares a right edge whatever the label length.
    return `<table class="dsh-tbl dsh-mini"><thead><tr><th>Index</th><th class="dsh-r">OAS bp</th><th class="dsh-r">1W</th><th class="dsh-r">1M</th><th class="dsh-r dsh-as-h">As of</th><th class="dsh-srccol"></th></tr></thead><tbody>`
      + rows.map((x) => `<tr class="dsh-mini-r"><td class="dsh-spread-nm">${esc(String(x.label).replace(/\s*OAS$/i, "").replace(/^EURO /, "Euro ").replace(/^US /, "US "))}<span class="dsh-mini-d">${x.asOf ? esc(isoDay(x.asOf)) : ""}</span></td>`
        + `<td class="dsh-r dsh-spread-v">${bp(x.value)}</td>${chg(x, 5)}${chg(x, 21)}`
        + `<td class="dsh-r dsh-spread-as">${x.asOf ? esc(isoDay(x.asOf)) : "—"}</td><td class="dsh-srccol">${srcLink(x.href, "FRED")}</td></tr>`).join("")
      + `</tbody></table>`;
  }
  async function loadRates() {
    const res = await liveJSON("/api/rates");
    _rates = res.data && typeof res.data === "object" ? res.data : {};
    const el = host.querySelector("#dsh-spreads");
    if (el) el.innerHTML = spreadsBody();
    const sh = host.querySelector("#dsh-sphist .dsh-fill-body");
    if (sh) { sh.innerHTML = spreadHistBody(); if ((_rates.rates || []).some((x) => /oas/i.test(x.label || "") && (x.history || []).length > 2)) badge(res, "sphist"); }
    const oas = (Array.isArray(_rates.rates) ? _rates.rates : []).filter((x) => x && /oas/i.test(x.label || "") && x.value != null);
    if (oas.length) badge(res, "spreads", oas.map((x) => x.asOf).filter(Boolean).sort().pop());
    const mm = host.querySelector("#dsh-mm");
    if (mm) mm.innerHTML = moneyMarketsHTML();
  }
  async function loadEu() {
    const res = await liveJSON("/api/eurates");
    _eu = res.data && typeof res.data === "object" ? res.data : {};
    const set = (sel, html) => { const el = host.querySelector(sel); if (el) el.innerHTML = html; };
    set("#dsh-eu-distress", euDistressHTML());
    set("#dsh-mm", moneyMarketsHTML());
    set("#dsh-policy", policyHTML());
    set("#dsh-mmhist .dsh-fill-body", mmHistBody());
    if (["estr", "sonia"].some((k) => { const x = euSer(k); return x && (x.history || []).length > 2; })) badge(res, "mmhist");
    const yc = host.querySelector("#dsh-yc-card"); if (yc) { yc.innerHTML = yieldCurveCardHTML(); tidyHeaders(yc); }
    setExtras(res);
    const live = (_eu.series || []).filter((x) => x && x.value != null);
    if (live.length) { badge(res, "mm", live.map((x) => x.asOf).filter(Boolean).sort().pop()); if (euSer("ecb_dfr") || euSer("boe_bank")) badge(res, "pol"); }
  }

  // ---- Macro --------------------------------------------------------------
  // Regime pills: the three central banks' stance + the cycle read, a quick
  // top-of-page state drawn from the macro desk's own fields (ECB first).
  function regimePillsHTML() {
    const pill = (label, val, cls) => `<span class="dsh-pill ${cls || ""}"><span class="dsh-pill-k">${esc(label)}</span><span class="dsh-pill-v">${esc(val)}</span></span>`;
    const st = (o) => stripTags((o && o.stance) || "—");
    const cyc = (CYCLE && CYCLE.us && CYCLE.us.shortStage) || "—";
    return `<div class="dsh-pills">`
      + pill("EA · ECB", st(OUTLOOK && OUTLOOK.ecb))
      + pill("UK · BoE", st(OUTLOOK && OUTLOOK.uk))
      + pill("US · Fed", st(OUTLOOK && OUTLOOK.us))
      + pill("Cycle", stripTags(String(cyc)))
      + `</div>`;
  }
  // Fed path — the dot-plot median SEP projections and the CME FedWatch odds for
  // the next meeting, side by side. Both link to their primary source.
  function fedHTML() {
    const d = OUTLOOK && OUTLOOK.us && OUTLOOK.us.dots;
    const fw = OUTLOOK && OUTLOOK.us && OUTLOOK.us.fedwatch;
    let dots = "";
    if (d && Array.isArray(d.median) && d.median.length) {
      dots = `<div class="dsh-fed-blk"><div class="dsh-fed-h">Dot plot — median projection <span class="dsh-mut">${esc(d.meeting || "")}</span>${srcLink(d.href, "FOMC projections")}</div>`
        + `<div class="dsh-kvgrid">${d.median.map((x) => `<div class="dsh-kv"><span class="dsh-kv-k">${esc(x.year)}</span><span class="dsh-kv-v">${esc(x.rate)}</span></div>`).join("")}</div></div>`;
    }
    let watch = "";
    if (fw && Array.isArray(fw.outcomes) && fw.outcomes.length) {
      const bar = (o) => `<div class="dsh-fw"><span class="dsh-fw-l">${esc(o.label)}</span><span class="dsh-fw-track"><span class="dsh-fw-bar" style="width:${Math.max(2, Math.min(100, o.pct || 0))}%"></span></span><span class="dsh-fw-p">${o.pct != null ? o.pct + "%" : "—"}</span></div>`;
      watch = `<div class="dsh-fed-blk"><div class="dsh-fed-h">CME FedWatch — ${esc(fw.meeting || "")} <span class="dsh-mut">as of ${esc(fw.asOf || "")}</span>${srcLink(fw.href, "CME FedWatch")}</div>`
        + `${fw.outcomes.map(bar).join("")}</div>`;
    }
    if (!dots && !watch) return "";
    return `<div class="dsh-fed">${watch}${dots}</div>`;
  }
  // BoE path — same two-block format as the Fed box: the market-implied SONIA/OIS
  // odds for the next decision (bars, like CME FedWatch) and the MPC vote splits
  // (a kv grid, standing in for the dot plot the UK doesn't publish).
  function boeHTML() {
    const s = OUTLOOK && OUTLOOK.uk && OUTLOOK.uk.sonia;
    const v = OUTLOOK && OUTLOOK.uk && OUTLOOK.uk.votes;
    let sonia = "";
    if (s && Array.isArray(s.odds) && s.odds.length) {
      const bar = (o) => `<div class="dsh-fw"><span class="dsh-fw-l">${esc(o.label)}</span><span class="dsh-fw-track"><span class="dsh-fw-bar" style="width:${Math.max(2, Math.min(100, o.pct || 0))}%"></span></span><span class="dsh-fw-p">${o.pct != null ? o.pct + "%" : "—"}</span></div>`;
      sonia = `<div class="dsh-fed-blk"><div class="dsh-fed-h">SONIA / OIS — ${esc(s.meeting || "")} <span class="dsh-mut">as of ${esc(s.asOf || "")}</span>${srcLink(s.href, "SONIA/OIS-implied")}</div>`
        + `${s.odds.map(bar).join("")}</div>`;
    }
    let votes = "";
    if (v && Array.isArray(v.history) && v.history.length) {
      const row = (r) => `<div class="dsh-kv dsh-kv-vote" title="${esc(stripTags(r.decision || ""))}${r.dissent ? " · " + esc(r.dissent) : " · unanimous"}"><span class="dsh-kv-k">${esc(r.date)}</span><span class="dsh-kv-v"><span class="dsh-tally">${esc(r.tally)}</span>${r.lean ? `<span class="dsh-band">${esc(r.lean)}</span>` : ""}</span></div>`;
      votes = `<div class="dsh-fed-blk"><div class="dsh-fed-h">MPC vote splits <span class="dsh-mut">${esc(v.latestMeeting || "")}</span>${srcLink(v.href, "BoE minutes")}</div>`
        + `<div class="dsh-kvgrid">${v.history.slice(0, 4).map(row).join("")}</div></div>`;
    }
    if (!sonia && !votes) return "";
    return `<div class="dsh-fed">${sonia}${votes}</div>`;
  }
  // Policy rates — one row per central bank (ECB · BoE · Fed): the current rate
  // (LIVE from the ECB / BoE databases where loaded, else the desk's curated
  // figure), the next meeting, the concise stance read and the as-of date.
  const euSer = (k) => ((_eu && _eu.series) || []).find((x) => x && x.key === k && x.value != null) || null;
  const fmtPct = (v, dp = 2) => (v == null ? "—" : `${(+v).toFixed(dp)}%`);
  function policyHTML() {
    const row = (name, o, live, src) => {
      if (!o && !live) return "";
      const rate = live ? fmtPct(live.value) : esc(stripTags((o && o.rate) || "—"));
      const asof = live ? isoDay(live.asOf) : ((o && o.asOf) || "");
      const read = esc(stripTags((o && (o.stance || o.bottomLine)) || ""));
      return `<tr class="dsh-ro-r"><td class="dsh-nm">${esc(name)}</td>`
        + `<td class="dsh-r dsh-ro-rate"${live ? ` title="Live · ${esc(live.source || "")}"` : ""}>${rate}</td>`
        + `<td class="dsh-ro-nx">${esc(stripTags((o && o.next) || "—"))}</td>`
        + `<td class="dsh-ro-read"><span class="dsh-clamp2">${read || "—"}</span></td>`
        + `<td class="dsh-r dsh-stress-as">${esc(asof)}</td><td class="dsh-srccol">${srcLink(live ? live.href : src, name + " source")}</td></tr>`;
    };
    const ecb = OUTLOOK && OUTLOOK.ecb, uk = OUTLOOK && OUTLOOK.uk, us = OUTLOOK && OUTLOOK.us;
    const srcOf = (o, fb) => (o && o.href) || fb;
    return `<div class="dsh-scroll"><table class="dsh-tbl dsh-ro-tbl"><thead><tr><th>Bank</th><th class="dsh-r">Rate</th><th>Next meeting</th><th>Read</th><th class="dsh-r">As of</th><th class="dsh-srccol"></th></tr></thead>`
      + `<tbody>${row("ECB · deposit", ecb, euSer("ecb_dfr"), srcOf(ecb, "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/key_ecb_interest_rates/html/index.en.html"))}`
      + `${row("BoE · Bank Rate", uk, euSer("boe_bank"), srcOf(uk, "https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate"))}`
      + `${row("Fed · funds target", us, null, srcOf(us, "https://www.federalreserve.gov/monetarypolicy/openmarket.htm"))}</tbody></table></div>`;
  }
  // Money markets — the floating-rate bases in European facilities: €STR, 3M
  // Euribor (ECB monthly average — daily fixings are EMMI-licensed), SONIA, plus
  // SOFR from the rates feed. Level · 1W / 1M move in bp · as-of · source.
  function moneyMarketsHTML() {
    const sofr = (Array.isArray(_rates && _rates.rates) ? _rates.rates : []).find((x) => x && x.label === "SOFR" && x.value != null);
    const items = [euSer("estr"), euSer("euribor3m"), euSer("sonia"),
      sofr ? { label: "SOFR", value: sofr.value, asOf: sofr.asOf, chg1w: null, chg1m: null, href: sofr.href, source: "NY Fed" } : null];
    if (!items.some(Boolean)) {
      return (_eu === null ? `<p class="dsh-load">Loading money-market rates…</p>` : `<p class="dsh-load">Money-market rates unavailable — <a href="https://data.ecb.europa.eu/" target="_blank" rel="noopener noreferrer">ECB Data Portal</a> · <a href="https://www.bankofengland.co.uk/boeapps/database/" target="_blank" rel="noopener noreferrer">BoE database</a></p>`);
    }
    const c = (v) => { if (v == null) return `<td class="dsh-r dsh-chg">—</td>`; const bp = Math.round(v * 100); return `<td class="dsh-r dsh-chg ${bp > 0 ? "down" : bp < 0 ? "up" : ""}">${bp > 0 ? "+" : ""}${bp}</td>`; };
    const when = (x) => (/^\d{4}-\d{2}$/.test(x.asOf || "") ? `${isoDay(x.asOf)} avg` : isoDay(x.asOf));
    return `<table class="dsh-tbl dsh-mini"><thead><tr><th>Rate</th><th class="dsh-r">%</th><th class="dsh-r">1W bp</th><th class="dsh-r">1M bp</th><th class="dsh-r dsh-as-h">As of</th><th class="dsh-srccol"></th></tr></thead><tbody>`
      + items.filter(Boolean).map((x) => `<tr class="dsh-mini-r"><td class="dsh-spread-nm">${esc(x.label)}<span class="dsh-mini-d">${esc(when(x))}</span></td><td class="dsh-r dsh-spread-v">${(+x.value).toFixed(3)}</td>${c(x.chg1w)}${c(x.chg1m)}`
        + `<td class="dsh-r dsh-spread-as">${esc(when(x))}</td><td class="dsh-srccol">${srcLink(x.href, x.source || "source")}</td></tr>`).join("")
      + `</tbody></table>`;
  }
  // Yield curve — a small SVG line for US & UK across the standard maturities,
  // plus the underlying table (used by the Macro pane). Refinitiv-style read.
  // Live US Treasury + UK gilt curves (/api/yield-curve) merged over the compiled
  // YIELD_CURVE per maturity, so a point that can't be sourced keeps its fallback
  // and the freshest available "as of" date wins. _ycLive is filled by loadYieldCurve().
  function mergedYC() {
    const base = YIELD_CURVE || {};
    if (!_ycLive) return base;
    const merge = (live, stat) => (stat || []).map((v, i) => (live && Number.isFinite(live[i]) ? live[i] : v));
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(_ycLive.asOf || "");
    const asOf = m ? `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}` : (base.asOf || "");
    return { ...base, us: merge(_ycLive.us, base.us), uk: merge(_ycLive.uk, base.uk), asOf };
  }
  // Euro-area AAA curve (ECB, live) aligned to the panel's maturities, or null.
  function euCurve(mats) {
    const c = _eu && _eu.curve;
    if (!c || !Array.isArray(c.tenors) || !Array.isArray(c.points)) return null;
    const v = (mats || []).map((m) => { const i = c.tenors.indexOf(m); const p = i >= 0 ? c.points[i] : null; return p && p.value != null ? +p.value : null; });
    return v.some((x) => x != null) ? v : null;
  }
  // Dots, tenor axis labels and the value table all share ONE column grid: a fixed
  // 92px label column, then N equal tenor columns. The plot stretches to fill
  // (preserveAspectRatio none) with each point at its column CENTRE, the axis
  // labels are an N-column grid offset by the same 92px, and the table is
  // fixed-layout with a 92px first column and N centred value columns — so the 3M
  // dot, the "3M" label and the 3M yields line up exactly.
  function yieldCurveHTML() {
    const yc = mergedYC(); if (!yc || !yc.maturities) return "";
    const mats = yc.maturities, us = yc.us || [], uk = yc.uk || [];
    const ea = euCurve(mats);
    const all = [...us, ...uk, ...(ea || [])].filter((v) => v != null);
    const lo = Math.min(...all) - 0.2, hi = Math.max(...all) + 0.2;
    const N = mats.length, W = 100 * N, H = 120, padY = 10;
    const x = (i) => (i + 0.5) * (W / N);
    const y = (v) => padY + (1 - (v - lo) / (hi - lo)) * (H - 2 * padY);
    const path = (arr) => arr.map((v, i) => v == null ? "" : ((i && arr[i - 1] != null ? "L" : "M") + x(i).toFixed(1) + "," + y(v).toFixed(1))).join(" ");
    const dots = (arr, cls) => arr.map((v, i) => v == null ? "" : `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="2.5" class="${cls}" vector-effect="non-scaling-stroke"/>`).join("");
    const yt = [hi - 0.2, (hi + lo) / 2, lo + 0.2];
    const svg = `<div class="dsh-yc2-plot"><div class="dsh-yc2-y">${yt.map((v) => `<span style="top:${((y(v) / H) * 100).toFixed(1)}%">${esc(v.toFixed(2))}%</span>`).join("")}<em>Yield</em></div><svg class="dsh-yc-svg dsh-yc2-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Euro AAA, UK gilt and US Treasury yield curves, yield % by maturity">`
      + yt.map((v) => `<line x1="0" x2="${W}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" stroke="var(--t-grid)" stroke-width="1" stroke-dasharray="2 3" vector-effect="non-scaling-stroke"/>`).join("")
      + `<path d="${path(us)}" class="dsh-yc-us" fill="none" vector-effect="non-scaling-stroke"/>${dots(us, "dsh-yc-us-d")}`
      + `<path d="${path(uk)}" class="dsh-yc-uk" fill="none" vector-effect="non-scaling-stroke"/>${dots(uk, "dsh-yc-uk-d")}`
      + (ea ? `<path d="${path(ea)}" class="dsh-yc-ea" fill="none" vector-effect="non-scaling-stroke"/>${dots(ea, "dsh-yc-ea-d")}` : "") + `</svg></div>`
      + `<div class="dsh-yc2-x" style="--n:${N}"><em>Maturity</em>${mats.map((m) => `<span>${esc(m)}</span>`).join("")}</div>`;
    const rowFor = (arr, lbl, cls) => `<tr><td class="dsh-nm"><span class="dsh-yc-key ${cls}"></span>${lbl}</td>${arr.map((v) => `<td>${v != null ? esc(v.toFixed(2)) : "—"}</td>`).join("")}</tr>`;
    const table = `<table class="dsh-tbl dsh-yc2-tbl"><thead><tr><th>Curve</th>${mats.map((m) => `<th>${esc(m)}</th>`).join("")}</tr></thead><tbody>${ea ? rowFor(ea, "Euro AAA", "dsh-yc-ea") : ""}${rowFor(uk, "UK gilts", "dsh-yc-uk")}${rowFor(us, "US Treasury", "dsh-yc-us")}</tbody></table>`;
    const src = (yc.sources && yc.sources[0]) || null;
    const eaCap = ea ? ` · Euro AAA ${esc(isoDay(_eu.curve.asOf))} · <a href="${esc(_eu.curve.href)}" target="_blank" rel="noopener noreferrer">ECB</a>` : "";
    return `<div class="dsh-yc dsh-yc2 dsh-scroll">${svg}${table}</div>` + (src ? `<div class="dsh-ladder-cap">${esc(yc.asOf || "")} · <a href="${esc(src[1])}" target="_blank" rel="noopener noreferrer">${esc(src[0])}</a>${eaCap}</div>` : "");
  }
  // The whole Yield-curve card (header "as of" + body) so loadYieldCurve() can
  // repaint it in place once the live curve lands — header date included.
  function yieldCurveCardHTML() {
    return `<h3 class="dsh-h">Yield curves — Euro AAA · gilts · Treasuries ${_ycLive ? `<span class="dsh-live" title="Live">live</span>` : liveTag("yc")} ${asOf(mergedYC().asOf)}</h3>${yieldCurveHTML()}`;
  }
  // Pull the live US Treasury + UK gilt curves and repaint the card. Never throws —
  // on any failure the compiled curve (and its July date) simply stays.
  // Market-implied policy path (review 2026-10-15, #17): prediction-market odds on the
  // next Fed / ECB / BoE decisions (Polymarket / Kalshi via the Worker's /api/predict),
  // grouped by bank and meeting, newest-dated first, each linked to its market. Odds
  // are crowd probabilities, labelled as such — not a forecast by Wire.
  let _pred = null, _predState = null;
  const BANK_OF = (q) => /\bFed\b|FOMC|Federal Reserve/i.test(q) ? "Fed" : /\bECB\b|European Central Bank/i.test(q) ? "ECB" : /Bank of England|\bBoE\b|\bMPC\b/i.test(q) ? "BoE" : null;
  const MOVE_OF = (q) => /no change|hold|unchanged|pause/i.test(q) ? "Hold" : /(increase|hike|raise)[^?]*?(\d+)\s*bps?/i.test(q) ? `Hike ${RegExp.$2}bp` : /(decrease|cut|lower)[^?]*?(\d+)\s*bps?/i.test(q) ? `Cut ${RegExp.$2}bp` : /(hike|increase|raise)/i.test(q) ? "Hike" : /(cut|decrease|lower)/i.test(q) ? "Cut" : null;
  function impliedHTML() {
    const ms = ((_pred && _pred.markets) || []).filter((m) => m && m.q && m.yes != null && BANK_OF(m.q) && MOVE_OF(m.q));
    if (!ms.length) return _pred === null ? `<p class="dsh-load">Loading market-implied odds…</p>` : `<p class="dsh-load">No live central-bank decision markets — <a href="https://polymarket.com/" target="_blank" rel="noopener noreferrer">Polymarket</a> · <a href="https://kalshi.com/" target="_blank" rel="noopener noreferrer">Kalshi</a></p>`;
    const groups = new Map();
    for (const m of ms) {
      const meet = (/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(20\d\d)/i.exec(m.q) || [])[0] || (/in (20\d\d)/i.exec(m.q) ? "By end-" + /in (20\d\d)/i.exec(m.q)[1] : (m.end ? String(m.end).slice(0, 7) : "—"));
      const k = BANK_OF(m.q) + "|" + meet;
      if (!groups.has(k)) groups.set(k, { bank: BANK_OF(m.q), meet, end: m.end || "", rows: [] });
      groups.get(k).rows.push(m);
    }
    const ORDER = { ECB: 0, BoE: 1, Fed: 2 };
    const list = [...groups.values()].sort((a, b) => (ORDER[a.bank] - ORDER[b.bank]) || String(a.end).localeCompare(String(b.end)));
    const cell = (m) => `<a href="${esc(m.url || "#")}" target="_blank" rel="noopener noreferrer" title="${esc(m.q)} — ${esc(m.venue || "")}">${esc(MOVE_OF(m.q))} ${esc(String(m.yes))}%</a>${m.chg ? ` <span class="${m.chg > 0 ? "up" : "down"}">${m.chg > 0 ? "+" : ""}${esc(String(m.chg))}</span>` : ""}`;
    return `<table class="dsh-tbl dsh-implied-tbl dsh-stk-src" data-stk-name="0" data-stk-key="1"><thead><tr><th>Bank</th><th>Meeting</th><th>Market-implied odds</th><th>Venue</th></tr></thead><tbody>`
      + list.map((g) => `<tr><td class="dsh-nm">${esc(g.bank)}</td><td>${esc(g.meet)}</td><td>${g.rows.sort((a, b) => b.yes - a.yes).map(cell).join(" · ")}</td><td class="dsh-reg-jur">${esc([...new Set(g.rows.map((m) => m.venue).filter(Boolean))].join(", "))}</td></tr>`).join("")
      + `</tbody></table><p class="dsh-ladder-cap">Crowd probabilities from prediction markets (pts change on the day) — not a Wire forecast.${_predState && _predState.state !== "live" ? " " + esc(lastKnownLabel(_predState.at)) + "." : ""}</p>`;
  }
  async function loadImplied() {
    const res = await liveJSON("/api/predict");
    _pred = res.data && typeof res.data === "object" ? res.data : {}; _predState = res;
    const el = host.querySelector("#dsh-implied"); if (el) { el.innerHTML = impliedHTML(); repreview(el); }
    if ((_pred.markets || []).length) badge(res, "implied");
  }
  async function loadYieldCurve() {
    const res = await liveJSON("/api/yield-curve");
    const d = res.data;
    if (!d || !Array.isArray(d.us)) return;            // keep the compiled curve (and its date)
    _ycLive = d;
    const card = host.querySelector("#dsh-yc-card");
    if (card) { card.innerHTML = yieldCurveCardHTML(); tidyHeaders(card); }
  }
  // Multi-country term structure (Bonds pane) — every country's 2Y/5Y/10Y/
  // 30Y yields from GOVT_YIELDS as a table, one colour key per country. The old
  // 14-line overlay chart added little over the numbers in a narrow tile, so it
  // was dropped in favour of the table alone.
  const YC_TENORS = [["y2", "2Y"], ["y5", "5Y"], ["y10", "10Y"], ["y30", "30Y"]];
  // Macro scope is the G7 + Western Europe (HOUSE_STYLE R4c): the sovereign tables
  // show only those rows (the snapshot may carry others; they are not rendered).
  const SOV_SCOPE = new Set(["United States", "Canada", "United Kingdom", "Germany", "France", "Italy", "Spain", "Netherlands", "Belgium", "Austria", "Portugal", "Ireland", "Switzerland", "Sweden", "Norway", "Denmark", "Finland", "Japan"]);
  const sovRegions = () => ((GOVT_YIELDS && GOVT_YIELDS.regions) || []).map((g) => ({ ...g, rows: (g.rows || []).filter((r) => SOV_SCOPE.has(r.country)) })).filter((g) => g.rows.length);
  function worldYieldCurveHTML() {
    const regs = sovRegions(); if (!regs.length) return "";
    const rows = regs.flatMap((g) => (g.rows || []).map((r) => ({ ...r, region: g.region })));
    if (!rows.length) return "";
    // Live where available: the /api/govyields feed carries the current level per
    // tenor (US, from FRED daily) — use it, else the sourced GOVT_YIELDS snapshot.
    const lvl = (r, k) => { const t = _gyLive && _gyLive[r.country] && _gyLive[r.country][k]; return (t && t.v != null) ? t.v : r[k]; };
    // Heatmap: shade each level cell by how far it sits from the ~2% policy-target
    // yield — GREEN below 2%, RED above — with intensity scaled per tenor by the
    // widest deviation in that column, so at-target reads neutral and the high-yield
    // outliers (Brazil, India) and the low-yield havens (Switzerland) both stand out.
    const TARGET = 2;
    const maxDev = {};
    YC_TENORS.forEach(([k]) => {
      const devs = rows.map((r) => lvl(r, k)).filter((v) => v != null).map((v) => Math.abs(v - TARGET));
      maxDev[k] = devs.length ? Math.max(0.25, ...devs) : null;
    });
    const heat = (v, k) => {
      const md = maxDev[k]; if (v == null || !md) return "";
      const dev = v - TARGET;
      if (Math.abs(dev) < 0.03) return "";                       // ~at target → no shade
      const a = (Math.abs(dev) / md) * 0.6 + 0.08;
      return ` style="background:color-mix(in srgb, var(--t-${dev < 0 ? "up" : "down"}) ${(a * 100).toFixed(1)}%, transparent)"`;
    };
    const rowFor = (r) => `<tr><td class="dsh-nm">`
      + `${r.source ? `<a href="${esc(r.source)}" target="_blank" rel="noopener noreferrer">${esc(r.country)}</a>` : esc(r.country)}</td>`
      + `${YC_TENORS.map(([k]) => { const v = lvl(r, k); return `<td class="dsh-r dsh-fl"${heat(v, k)}>${v != null ? esc(v.toFixed(2)) : "—"}</td>`; }).join("")}</tr>`;
    return `<table class="dsh-tbl dsh-fl-tbl"><thead><tr><th>Country</th>${YC_TENORS.map(([, l]) => `<th class="dsh-r">${esc(l)}</th>`).join("")}</tr></thead><tbody>${rows.map(rowFor).join("")}</tbody></table>`
      + `<p class="dsh-fl-note"><span class="dsh-fl-pos">green below 2%</span> · <span class="dsh-fl-neg">red above</span></p>`;
  }
  // Embedded macro news wire — the desk's US + UK headlines, linked to source.
  function macroNewsHTML() {
    const items = [...((NEWS && NEWS.us) || []), ...((NEWS && NEWS.uk) || [])]
      .filter((x) => x && x.title && x.url)
      .sort((a, b) => byDateDesc(a, b) || String(b.time || "").localeCompare(String(a.time || "")))
      .slice(0, 50);
    if (!items.length) return "";
    return newsUl(items.map((x) => newsLi({ title: x.title, href: x.url, date: x.date, meta: metaOf(x.source) })));
  }
  // Two readings of where we are: Ray Dalio's debt cycle (US/UK position on the
  // 0 early → 100 crisis track) and Howard Marks' market cycle (the pendulum of
  // investor psychology, 0 capitulation → 100 mania), with his sourced framework
  // and "where we stand". Reuses the FedWatch meter bars; every claim is linked.
  function cyclesHTML() {
    const meter = (label, pos) => `<div class="dsh-fw"><span class="dsh-fw-l">${esc(label)}</span>`
      + `<span class="dsh-fw-track"><span class="dsh-fw-bar" style="width:${Math.max(2, Math.min(100, pos || 0))}%"></span></span>`
      + `<span class="dsh-fw-p">${pos}/100</span></div>`;
    const mc = MARKET_CYCLE || {};
    // The cycle narrative is curated static prose (macro/js/content.js) authored with
    // intentional <strong>/<em> emphasis, so render its markup rather than escaping it.
    const paras = (arr) => (arr || []).map((p) => `<p class="dsh-cyc-note">${p}</p>`).join("");
    const srcRow = (sources) => { const s = (sources || []).map(([l, u]) => `<a class="dsh-cyc-src" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(l)}</a>`).join(""); return s ? `<div class="dsh-cyc-srcs">${s}</div>` : ""; };
    // The full narrative sits behind a per-block expand/collapse, collapsed by
    // default (native <details>; the dashboard click handler ignores <summary>).
    const details = (body) => `<details class="dsh-cyc-exp"><summary class="dsh-cyc-sum"><span class="dsh-cyc-more">Show detail</span><span class="dsh-cyc-less">Hide detail</span></summary><div class="dsh-cyc-body">${body}</div></details>`;

    // Each block splits into a meters column (US/UK bars + short stage) and a
    // narrative column beside it: the framework intro reads inline, and the fuller
    // per-region detail + sources stay behind the expand toggle.
    const meters = (a, b) => `<div class="dsh-cyc-meters">` + meter("US", a) + meter("UK", b) + `</div>`;
    const debtInline = paras(CYCLE.framework);
    const debtFull = `<p class="dsh-cyc-sub">United States</p>` + paras(CYCLE.us.body)
      + `<p class="dsh-cyc-sub">United Kingdom</p>` + paras(CYCLE.uk.body)
      + srcRow(CYCLE.sources)
      + `<p class="dsh-cyc-note dsh-mut">${esc(CYCLE.note || "")}</p>`;
    const debt = `<div class="dsh-cyc-blk"><div class="dsh-cyc-hd"><div class="dsh-cyc-hd-t">Debt cycle <span>Ray Dalio · 0 early → 100 crisis</span></div>`
      + meters(CYCLE.us.pos, CYCLE.uk.pos) + `</div>`
      + `<div class="dsh-cyc-narr"><p class="dsh-cyc-note dsh-mut">${esc(stripTags(String(CYCLE.us.shortStage || "")))} (US) · ${esc(stripTags(String(CYCLE.uk.shortStage || "")))} (UK)</p>`
      + debtInline + details(debtFull) + `</div>`
      + `</div>`;

    // US / UK meters + a grey per-region descriptor, matching the Debt cycle block.
    const mcUs = mc.us || { pos: mc.pos, shortStage: mc.short }, mcUk = mc.uk || {};
    const mktInline = paras(mc.framework);
    const mktFull = `<p class="dsh-cyc-sub">Where we stand</p>` + paras(mc.stand)
      + srcRow(mc.sources)
      + `<p class="dsh-cyc-note dsh-mut">${esc(mc.note || "")}</p>`;
    const market = `<div class="dsh-cyc-blk"><div class="dsh-cyc-hd"><div class="dsh-cyc-hd-t">Market cycle <span>Howard Marks · 0 capitulation → 100 mania</span></div>`
      + meters(mcUs.pos, mcUk.pos) + `</div>`
      + `<div class="dsh-cyc-narr"><p class="dsh-cyc-note dsh-mut">${esc(stripTags(String(mcUs.shortStage || "")))} (US) · ${esc(stripTags(String(mcUk.shortStage || "")))} (UK)</p>`
      + mktInline + details(mktFull) + `</div>`
      + `</div>`;
    // Two blocks, returned separately so the Macro pane can place each in its own
    // tile (a break down the middle, like the paired rows above) — each keeps the
    // .dsh-cyc wrapper so the meters/heads/toggles stay scoped as before.
    return { debt: `<div class="dsh-cyc">${debt}</div>`, market: `<div class="dsh-cyc">${market}</div>` };
  }
  // The Macro pane is a fixed-viewport terminal (option 4): three side-by-side
  // panes that fill the screen and each scroll internally — Policy rates (Fed/BoE
  // paths, rate outlook, yield curve), Cycle (Dalio debt + Marks market cycle) and
  // the Macro wire rail. The regime pills strip spans the top as a shared read.
  // Market sizes — a matrix of the world's investable markets by asset class ×
  // region, with the latest size and 1Y/5Y/10Y trend arrows (▲/▼/–). Reuses the
  // world-indices band + heat-table furniture. Every size/direction is sourced
  // (MARKET_SIZES, macro/js/content.js); a size that isn't cleanly published on a
  // comparable basis shows "—" while its arrows stay (each independently sourced).
  function marketSizesHTML() {
    const M = MARKET_SIZES;
    if (!M || !(M.classes || []).length) return "";
    const arrow = (d) => d === 1 ? `<span class="dsh-ms-t up" title="Larger than a year/5y/10y ago">▲</span>`
      : d === -1 ? `<span class="dsh-ms-t down" title="Smaller">▼</span>`
      : d === 0 ? `<span class="dsh-ms-t flat" title="Broadly flat">–</span>`
      : `<span class="dsh-ms-t na" title="Exact change not published">·</span>`;
    // A horizon cell: the sourced % where one is published (green/red by sign),
    // otherwise the direction arrow (no fabricated number).
    const cell = (pct, dir) => {
      if (pct) { const cls = /^-/.test(pct) ? "down" : "up"; return `<td class="dsh-r dsh-ms-a"><span class="dsh-ms-p ${cls}">${esc(pct)}</span></td>`; }
      return `<td class="dsh-r dsh-ms-a">${arrow(dir)}</td>`;
    };
    const row = (r) => {
      const nm = r.source
        ? `<a href="${esc(r.source)}" target="_blank" rel="noopener noreferrer"${r.note ? ` title="${esc(r.note)}"` : ""}>${esc(r.region)}</a>`
        : esc(r.region);
      const up = r.up || [], pc = r.pct || [];
      return `<tr><td class="dsh-ms-nm">${nm}</td>`
        + `<td class="dsh-ms-sz">${r.size ? esc(r.size) : "—"}${r.asOf ? ` <span class="dsh-ms-as">${esc(r.asOf)}</span>` : ""}</td>`
        + cell(pc[0], up[0]) + cell(pc[1], up[1]) + cell(pc[2], up[2]) + `</tr>`;
    };
    // Asset classes laid out SIDE BY SIDE (one block each), filling the full width;
    // blocks wrap to fewer columns as the card narrows.
    const block = (c) => `<div class="dsh-ms-col">`
      + `<div class="dsh-ms-col-h">${esc(c.label)}${c.sub ? ` <span class="dsh-ms-sub">${esc(c.sub)}</span>` : ""}</div>`
      + `<table class="dsh-fl-tbl dsh-ms-tbl"><thead><tr><th class="dsh-ms-nm"></th><th class="dsh-ms-sz">Size</th>`
      + `<th class="dsh-r dsh-ms-a">1Y</th><th class="dsh-r dsh-ms-a">5Y</th><th class="dsh-r dsh-ms-a">10Y</th></tr></thead>`
      + `<tbody>${(c.rows || []).map(row).join("")}</tbody></table></div>`;
    return `<div class="dsh-ms-grid">${M.classes.map(block).join("")}</div>`;
  }
  // ---- Bonds --------------------------------------------------------------
  // Government/sovereign (the US/UK yield curves) + corporate (ICE BofA OAS
  // spreads, loaded live). Reuses the macro yield-curve renderer and the credit
  // spreads loader so there is one source of truth for each.
  // Government bond yields across the major economies in each jurisdiction, as a
  // heat-shaded table in the ETF-flows style: one row per country under a region
  // section header, a column per tenor (2Y/5Y/10Y/30Y), each cell green→red heat-
  // shaded by yield LEVEL within its column (low yield = green, high = red).
  // Snapshot from GOVT_YIELDS (dashboard/js/data.js), every value sourced + dated.
  const YLD_TENORS = [["y2", "2Y"], ["y5", "5Y"], ["y10", "10Y"], ["y30", "30Y"]];
  const YCHG_WINS = [["w1", "1W"], ["m1", "1M"], ["m3", "3M"], ["m6", "6M"], ["y1", "1Y"]];
  // The heatmap shows, for the tenor picked in the dropdown, each country's yield
  // CHANGE (basis points) over 1W/1M/3M/6M/1Y, green (fell) / red (rose), with the
  // current yield in the label. Changes are live from /api/govyields (Stooq
  // history, keyed by country → per-tenor {v, w1..y1}); the current level falls
  // back to the sourced GOVT_YIELDS snapshot when live is absent.
  function govtYieldsHeatHTML() {
    const G = { regions: sovRegions() };
    if (!G.regions.length) return "";
    const tk = _yldTenor;
    const tl = (YLD_TENORS.find(([k]) => k === tk) || [, ""])[1];
    const liveT = (r) => (_gyLive && _gyLive[r.country] && _gyLive[r.country][tk]) || null;
    const snapT = (r) => (GOVT_YIELD_CHG && GOVT_YIELD_CHG[r.country] && GOVT_YIELD_CHG[r.country][tk]) || null;
    const levelOf = (r) => { const l = liveT(r); return (l && l.v != null) ? l.v : r[tk]; };
    // Live (US, FRED, all windows) wins; otherwise the curated GOVT_YIELD_CHG snapshot
    // (Trading Economics m1/y1). A window with neither stays blank.
    const chgOf = (r, w) => { const l = liveT(r); if (l && l[w] != null) return l[w]; const s = snapT(r); return s && s[w] != null ? s[w] : null; };
    // Shade each window column independently by |change|.
    const maxAbs = {};
    YCHG_WINS.forEach(([w]) => { maxAbs[w] = Math.max(1, ...G.regions.flatMap((g) => (g.rows || []).map((r) => { const c = chgOf(r, w); return c == null ? 0 : Math.abs(c); }))); });
    const heat = (c, w) => { if (c == null) return ""; const a = (Math.abs(c) / maxAbs[w]) * 0.62 + 0.10; return ` style="background:color-mix(in srgb, var(--t-${c <= 0 ? "up" : "down"}) ${(a * 100).toFixed(1)}%, transparent)"`; };
    const fmtBp = (c) => (c == null ? "" : (c > 0 ? "+" : "") + Math.round(c));
    const cell = (r, w, l) => { const c = chgOf(r, w); return c == null ? `<td class="dsh-fl-na">—</td>` : `<td class="dsh-fl"${heat(c, w)} title="${esc(r.country)} ${esc(tl)} ${esc(l)}: ${c > 0 ? "+" : ""}${Math.round(c)}bp">${fmtBp(c)}</td>`; };
    const fmtLv = (v) => (v == null ? "" : v.toFixed(2) + "%");
    // Regions are separated by a thin grey rule (top border on the first row).
    const row = (r, brk) => {
      const lv = levelOf(r);
      const nm = r.source ? `<a href="${esc(r.source)}" target="_blank" rel="noopener noreferrer">${esc(r.country)}</a>` : esc(r.country);
      return `<tr${brk ? ' class="dsh-secbreak"' : ""}><td class="dsh-nm">${nm}${lv != null ? ` <span class="dsh-fl-t">${fmtLv(lv)}</span>` : ""}</td>${YCHG_WINS.map(([w, l]) => cell(r, w, l)).join("")}</tr>`;
    };
    const group = (g, i) => (g.rows || []).map((r, ri) => row(r, i > 0 && ri === 0)).join("");
    return `<table class="dsh-tbl dsh-fl-tbl"><thead><tr><th>Country</th>${YCHG_WINS.map(([, l]) => `<th class="dsh-r">${l}</th>`).join("")}</tr></thead>`
      + `<tbody>${G.regions.map(group).join("")}</tbody></table>`
      + `<p class="dsh-fl-note"><span class="dsh-fl-pos">green = yield fell</span> · <span class="dsh-fl-neg">red = yield rose</span> (${esc(tl)}, bp)</p>`;
  }
  // Bond-duration selector — lives in the card HEADER (top-right, in line with the
  // title), not the table body, so it survives the body's live re-renders.
  function yldSelectHTML() {
    return `<select id="dsh-yld-tenor" class="dsh-hf-sel dsh-yld-sel" aria-label="Bond duration">`
      + `${YLD_TENORS.map(([k, l]) => `<option value="${k}"${k === _yldTenor ? " selected" : ""}>${l}</option>`).join("")}</select>`;
  }
  function wireYields() {
    const box = host.querySelector("#dsh-yld");
    if (!box) return;
    // The select sits in the header (outside #dsh-yld), so listen on the card.
    const card = box.closest(".dsh-card") || host;
    card.addEventListener("change", (e) => {
      const s = e.target.closest("#dsh-yld-tenor");
      if (!s) return;
      _yldTenor = s.value;
      box.innerHTML = govtYieldsHeatHTML();
    });
  }
  async function loadGovYields() {
    const res = await liveJSON("/api/govyields");
    const arr = ((res.data && res.data.yields) || []).filter((x) => x && x.country);
    if (!arr.length) return;                           // keep the sourced snapshot
    _gyLive = {}; arr.forEach((x) => { _gyLive[x.country] = x; });
    badge(res, "gy");
    const box = host.querySelector("#dsh-yld");
    if (box) box.innerHTML = govtYieldsHeatHTML();
    const curve = host.querySelector("#dsh-yc-tbl");        // levels table shares the live feed
    if (curve) curve.innerHTML = worldYieldCurveHTML();
    const shape = host.querySelector("#dsh-shape");
    if (shape) shape.innerHTML = curveShapeHTML();
  }
  // "Why it moved" for rates — mirrors the Equities Key-moments box, reading the
  // sourced per-benchmark notes in IND_KEYMOMENTS (macro/js/content.js). Keys are
  // "<CC>:<tenor>" (e.g. US:two_year); each note is grounded + sourced. The whole
  // card is omitted when nothing qualifies.
  function fixedKeyMomentsBody() {
    const KM = IND_KEYMOMENTS || {};
    const keys = Object.keys(KM).filter((k) => KM[k] && KM[k].text);
    if (!keys.length) return "";
    const TEN = { two_year: "2Y", five_year: "5Y", ten_year: "10Y", thirty_year: "30Y" };
    const label = (k) => { const [cc, t] = String(k).split(":"); return `${cc}${TEN[t] ? " " + TEN[t] : ""}`; };
    const row = (k) => { const m = KM[k]; return `<div class="dsh-km"><span class="dsh-km-t">${esc(label(k))}</span>`
      + `<span class="dsh-km-x">${nbNums(txt(m.text))}${m.date ? ` <span class="dsh-asof">${esc(isoDay(m.date))}</span>` : ""}${srcLink(m.src, (m.srcName || "source") + " — source")}</span></div>`; };
    return keys.map(row).join("");
  }
  // Curve shape (2s10s / 2s30s) and 10Y spreads to the Bund — both DERIVED from
  // the sovereign levels already on the page (live where loaded, else the sourced
  // snapshot). No new data, only arithmetic.
  function curveShapeHTML() {
    const regs = sovRegions(); if (!regs.length) return "";
    const flat = regs.flatMap((g) => g.rows || []);
    const find = (c) => flat.find((r) => (r.country || "").toLowerCase() === c.toLowerCase());
    const lv = (r, k) => { const t = r && _gyLive && _gyLive[r.country] && _gyLive[r.country][k]; return (t && t.v != null) ? t.v : (r ? r[k] : null); };
    const bp = (a, b) => (a == null || b == null) ? null : Math.round((a - b) * 100);
    const cell = (v) => v == null ? `<td class="dsh-fl-na">—</td>` : `<td class="dsh-r">${v > 0 ? "+" : ""}${v}</td>`;
    const specs = [["Germany", "DE"], ["United Kingdom", "UK"], ["United States", "US"], ["Japan", "JP"]];
    const rows = specs.map(([c, lbl]) => { const r = find(c); return r ? `<tr><td class="dsh-nm">${esc(lbl)}</td>${cell(bp(lv(r, "y10"), lv(r, "y2")))}${cell(bp(lv(r, "y30"), lv(r, "y2")))}</tr>` : ""; }).join("");
    const de = find("Germany");
    const sp = [["Italy", "BTP"], ["France", "OAT"], ["Spain", "Bono"], ["United Kingdom", "Gilt"], ["United States", "UST"]]
      .map(([c, lbl]) => { const r = find(c); const v = r && de ? bp(lv(r, "y10"), lv(de, "y10")) : null; return r ? `<tr><td class="dsh-nm">${esc(lbl)}–Bund</td>${cell(v)}</tr>` : ""; }).join("");
    if (!rows && !sp) return "";
    return `<div class="dsh-shape"><table class="dsh-tbl"><thead><tr><th>Slope</th><th class="dsh-r">2s10s</th><th class="dsh-r">2s30s</th></tr></thead><tbody>${rows}</tbody></table>`
      + (sp ? `<table class="dsh-tbl"><thead><tr><th>10Y spread</th><th class="dsh-r">bp</th></tr></thead><tbody>${sp}</tbody></table>` : "") + `</div>`;
  }
  // Rates = the old Macro + Bonds tabs merged: policy, money markets, curves,
  // sovereign moves, the Fed/BoE paths, "why it moved", and a collapsed
  // Reference block (cycles, market sizes) — with the macro wire as the rail.
  // Rates · central-bank calendar: the next three decision dates per bank (verified).
  function cbCalHTML() {
    const C = CB_CALENDAR || {}; const today = new Date().toISOString().slice(0, 10);
    const rows = (C.banks || []).map((b) => { const next = (b.meetings || []).filter((d) => d >= today).slice(0, 3);
      return `<tr><td class="dsh-nm" title="${esc(b.label || "")}">${esc(b.bank)}</td>${[0, 1, 2].map((i) => `<td class="dsh-r">${next[i] ? esc(isoDay(next[i])) : "—"}</td>`).join("")}<td class="dsh-srccol">${srcLink(b.href, b.bank + " calendar")}</td></tr>`; }).join("");
    return `<div class="dsh-scroll"><table class="dsh-tbl dsh-mini"><thead><tr><th>Bank</th><th class="dsh-r">Next</th><th class="dsh-r">Then</th><th class="dsh-r">Then</th><th class="dsh-srccol"></th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  // Rates · money-market history (~2 months daily, live ECB / BoE series).
  function mmHistBody() {
    const pick = ["estr", "ecb_dfr", "sonia", "boe_bank"].map(euSer).filter((x) => x && Array.isArray(x.history) && x.history.length > 2);
    if (!pick.length) return _eu === null ? `<p class="dsh-load">Loading rate history…</p>` : `<p class="dsh-load">Rate history unavailable — <a href="https://data.ecb.europa.eu/" target="_blank" rel="noopener noreferrer">ECB</a> · <a href="https://www.bankofengland.co.uk/boeapps/database/" target="_blank" rel="noopener noreferrer">BoE</a></p>`;
    const series = pick.map((x) => ({ label: x.label, pts: x.history.map(([d, v]) => [Date.parse(d), +v]), last: `${(+x.value).toFixed(2)}%` }));
    return lineChart(series, { unit: "%", fmt: (v) => v.toFixed(2), ytitle: "Rate, %" });
  }
  // ---- Extra gauges from /api/eurates `extra` (R40 fill cards): balance sheets,
  // all-in yields, VIX, FX — each a keyless official/benchmark series with its own
  // as-of and source link; nothing renders a number the feed didn't return.
  const euX = (k) => ((_eu && _eu.extra) || []).find((x) => x && x.key === k && x.value != null) || null;
  const euWait = (what, href, name) => (_eu === null ? `<p class="dsh-load">Loading ${what}…</p>`
    : `<p class="dsh-load">${what[0].toUpperCase() + what.slice(1)} unavailable — <a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(name)}</a></p>`);
  // One mini table (same anatomy as the spreads / money-market tables).
  // fmt formats the level; chg formats a change (null → "—"); `up` = a rise reads red
  // (false: a fall reads red; null: neutral — e.g. balance sheets, FX).
  function gaugeTable(items, { head, fmt, chg, up = true, cols = ["1W", "1M"] }) {
    const c = (v) => { if (v == null) return `<td class="dsh-r dsh-chg">—</td>`; const [t, n] = chg(v); const bad = up ? n > 0 : n < 0;
      return `<td class="dsh-r dsh-chg ${n === 0 || up === null ? "" : bad ? "down" : "up"}">${esc(t)}</td>`; };
    return `<table class="dsh-tbl dsh-mini"><thead><tr><th>${esc(head[0])}</th><th class="dsh-r">${esc(head[1])}</th>${cols.map((h) => `<th class="dsh-r">${esc(h)}</th>`).join("")}<th class="dsh-r dsh-as-h">As of</th><th class="dsh-srccol"></th></tr></thead><tbody>`
      + items.map((x) => `<tr class="dsh-mini-r"><td class="dsh-spread-nm">${esc(x.label)}<span class="dsh-mini-d">${esc(isoDay(x.asOf))}</span></td><td class="dsh-r dsh-spread-v">${esc(fmt(x))}</td>${c(x.chg1w)}${c(x.chg1m)}`
        + `<td class="dsh-r dsh-spread-as">${esc(isoDay(x.asOf))}</td><td class="dsh-srccol">${srcLink(x.href, x.source || "source")}</td></tr>`).join("") + `</tbody></table>`;
  }
  const bpChg = (v) => { const n = Math.round(v * 100); return [`${n > 0 ? "+" : ""}${n}`, n]; };
  const ptsOf = (x) => (x.history || []).map(([d, v]) => [Date.parse(d), +v]);
  // Credit · ICE BofA all-in (effective) yields + US BBB OAS — the level a buyer
  // actually locks in, beside the spread table.
  function yieldsBody() {
    const items = ["ehy_yld", "ushy_yld", "usbbb_oas"].map(euX).filter(Boolean)
      .map((x) => ({ ...x, label: x.label.replace(/ effective yield$/, " yield") }));
    if (!items.length) return euWait("all-in yields", "https://fred.stlouisfed.org/series/BAMLHE00EHYIEY", "FRED");
    return gaugeTable(items, { head: ["Index", "Level"], fmt: (x) => (x.key === "usbbb_oas" ? `${Math.round(x.value * 100)}bp` : `${x.value.toFixed(2)}%`), chg: bpChg, cols: ["1W bp", "1M bp"] });
  }
  // Rates · Euro-area AAA spot curve over ~2 months (ECB YC): 2Y, 10Y, 30Y.
  function aaaHistBody() {
    const C = _eu && _eu.curve; const T = (C && C.tenors) || [];
    const pick = ["2Y", "10Y", "30Y"].map((t) => { const p = C && C.points && C.points[T.indexOf(t)]; return p && (p.history || []).length > 2 ? { t, p } : null; }).filter(Boolean);
    if (!pick.length) return euWait("Euro AAA curve history", "https://data.ecb.europa.eu/data/datasets/YC", "ECB");
    const s2 = pick.find((x) => x.t === "2Y"), s10 = pick.find((x) => x.t === "10Y");
    const slope = s2 && s10 ? `<span class="dsh-lg">2s10s <b>${Math.round((s10.p.value - s2.p.value) * 100)}bp</b></span>` : "";
    return lineChart(pick.map(({ t, p }) => ({ label: t, pts: ptsOf(p), last: `${p.value.toFixed(2)}%` })), { unit: "%", fmt: (v) => v.toFixed(2), ytitle: "Spot yield, %" })
      .replace(`<div class="dsh-lgs">`, `<div class="dsh-lgs">${slope}`);
  }
  // Rates · central-bank balance sheets: Eurosystem (ECB weekly statement) and Fed
  // (H.4.1) total assets, and the Bank of England Weekly Report's reserve balances
  // and APF loan (it publishes no weekly total). The chart rebases every line to
  // the first week all of them cover, so the % changes share one start date.
  function cbBsBody() {
    const items = ["ecb_bs", "fed_bs", "boe_res", "boe_apf"].map(euX).filter(Boolean);
    if (!items.length) return euWait("balance-sheet data", "https://data.ecb.europa.eu/data/datasets/ILM/ILM.W.U2.C.T000000.Z5.Z01", "ECB");
    const cur = (x) => ({ "€bn": "€", "£bn": "£" })[x.unit] || "$";
    const tbl = gaugeTable(items, { head: ["Balance-sheet line", "bn"], fmt: (x) => `${cur(x)}${Math.round(x.value).toLocaleString("en-GB")}`,
      chg: (v) => { const n = Math.round(v); return [`${n > 0 ? "+" : ""}${n.toLocaleString("en-GB")}`, n]; }, up: null, cols: ["1W bn", "1M bn"] });
    const hist = items.filter((x) => (x.history || []).length > 2);
    if (!hist.length) return tbl;
    const start = hist.map((x) => x.history[0][0]).sort().pop();
    const series = hist.map((x) => { const h = ptsOf(x).filter(([d]) => d >= Date.parse(start) - 6 * 864e5), b = h[0][1], d = (x.value / b - 1) * 100;
      return { label: ({ ecb_bs: "Eurosystem", fed_bs: "Fed", boe_res: "BoE reserves", boe_apf: "BoE APF loan" })[x.key] || x.label,
        pts: h.map(([t, v]) => [t, ((v / b) - 1) * 100]), last: `${d > 0 ? "+" : ""}${d.toFixed(1)}%` }; });
    return tbl + lineChart(series, { unit: "%", fmt: (v) => v.toFixed(1), zero: true, ytitle: `% change since ${isoDay(start)}`, xtitle: "Date, weekly" });
  }
  // Rates · FX: EUR/USD and GBP/USD (Fed H.10 noon NY rates).
  function fxBody() {
    const items = ["eurusd", "gbpusd"].map(euX).filter(Boolean);
    if (!items.length) return euWait("FX rates", "https://fred.stlouisfed.org/series/DEXUSEU", "FRED");
    const tbl = gaugeTable(items, { head: ["Pair", "Rate"], fmt: (x) => x.value.toFixed(4), chg: (v) => { const n = +(v * 100).toFixed(2); return [`${n > 0 ? "+" : ""}${n.toFixed(2)}¢`, n]; }, up: null, cols: ["1W", "1M"] });
    return tbl + lineChart(items.filter((x) => (x.history || []).length > 2).map((x) => ({ label: x.label, pts: ptsOf(x), last: x.value.toFixed(4) })), { fmt: (v) => v.toFixed(3), ytitle: "USD per unit" });
  }
  // Equities · VIX close over ~2 months (Cboe via FRED).
  function vixBody() {
    const x = euX("vix");
    if (!x || (x.history || []).length < 3) return euWait("VIX history", "https://fred.stlouisfed.org/series/VIXCLS", "FRED");
    return lineChart([{ label: `VIX · ${isoDay(x.asOf)}`, pts: ptsOf(x), last: x.value.toFixed(2) }], { fmt: (v) => v.toFixed(1), ytitle: "Index level (close)" });
  }
  function setExtras(res) {
    const set = (sel, html) => { const el = host.querySelector(sel); if (el) el.innerHTML = html; };
    set("#dsh-yields", yieldsBody()); set("#dsh-aaa .dsh-fill-body", aaaHistBody()); set("#dsh-cbbs .dsh-fill-body", cbBsBody());
    set("#dsh-fx .dsh-fill-body", fxBody()); set("#dsh-vix .dsh-fill-body", vixBody());
    const last = (keys) => keys.map(euX).filter(Boolean).map((x) => x.asOf).sort().pop();
    if (["ehy_yld", "ushy_yld", "usbbb_oas"].some(euX)) (res && res.state !== "live" ? (id, a) => markCached(id, res.at) : markLive)("yld", last(["ehy_yld", "ushy_yld", "usbbb_oas"]));
    if (_eu && _eu.curve && (_eu.curve.points || []).some((p) => (p.history || []).length > 2)) (res && res.state !== "live" ? (id, a) => markCached(id, res.at) : markLive)("aaa", _eu.curve.asOf);
    if (["ecb_bs", "fed_bs", "boe_res", "boe_apf"].some(euX)) (res && res.state !== "live" ? (id, a) => markCached(id, res.at) : markLive)("cbbs", last(["ecb_bs", "fed_bs", "boe_res", "boe_apf"]));
    if (["eurusd", "gbpusd"].some(euX)) (res && res.state !== "live" ? (id, a) => markCached(id, res.at) : markLive)("fx", last(["eurusd", "gbpusd"]));
    if (euX("vix")) (res && res.state !== "live" ? (id, a) => markCached(id, res.at) : markLive)("vix", euX("vix").asOf);
  }
  function ratesHTML() {
    const fed = fedHTML();
    const boe = boeHTML();
    const cyc = cyclesHTML();
    const km = fixedKeyMomentsBody();
    const gyAsOf = asOf(isoDay(GOVT_YIELDS && GOVT_YIELDS.asOf));
    const mid = `<section class="dsh-card dsh-span">${regimePillsHTML()}</section>
      <h3 class="dsh-term-lbl">Policy &amp; money markets</h3>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">Policy rates — ECB · BoE · Fed ${liveOr("pol")}</h3><div id="dsh-policy">${policyHTML()}</div></section>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">Market-implied path — next decisions ${liveOr("implied")}</h3><div id="dsh-implied">${impliedHTML()}</div></section>
      <section class="dsh-card"><h3 class="dsh-h">Central-bank calendar ${asOf(CB_CALENDAR && CB_CALENDAR.asOf)}</h3>${cbCalHTML()}</section>
      ${fillCard("dsh-mmhist", "Money-market rates — 2 months", mmHistBody(), liveOr("mmhist"))}
      <section class="dsh-card dsh-wide"><h3 class="dsh-h">Money markets — €STR · Euribor · SONIA · SOFR ${liveOr("mm")}</h3><div id="dsh-mm" class="dsh-spreads">${moneyMarketsHTML()}</div></section>
      ${fillCard("dsh-cbbs", "Central-bank balance sheets", cbBsBody(), liveOr("cbbs"), "dsh-wide")}
      ${fillCard("dsh-fx", "FX — EUR/USD · GBP/USD", fxBody(), liveOr("fx"))}
      <h3 class="dsh-term-lbl">Curves</h3>
      <section class="dsh-card dsh-wide" id="dsh-yc-card">${yieldCurveCardHTML()}</section>
      ${fillCard("dsh-aaa", "Euro AAA curve — 2 months", aaaHistBody(), liveOr("aaa"))}
      <section class="dsh-card"><h3 class="dsh-h">Curve shape &amp; spreads to Bund ${gyAsOf}</h3><div id="dsh-shape">${curveShapeHTML()}</div></section>
      <section class="dsh-card"><h3 class="dsh-h">Sovereign yields — G7 &amp; Western Europe ${liveOr("gy")} ${gyAsOf}</h3><div class="dsh-scroll" id="dsh-yc-tbl">${worldYieldCurveHTML()}</div></section>
      <section class="dsh-card dsh-wide"><h3 class="dsh-h dsh-h-sel">Sovereign yield changes — 1W · 1M · 3M · 6M · 1Y ${liveOr("gy")} ${gyAsOf}${yldSelectHTML()}</h3><div class="dsh-scroll" id="dsh-yld">${govtYieldsHeatHTML()}</div></section>
      ${km ? fillCard("dsh-why", "Rates — why it moved", `<div class="dsh-km-wrap">${km}</div>`) : ""}
      <h3 class="dsh-term-lbl">Central-bank paths</h3>
      <div class="dsh-wide dsh-row2">
        ${fed ? `<section class="dsh-card"><h3 class="dsh-h">Fed path — dot plot &amp; CME FedWatch</h3>${fed}</section>` : ""}
        ${boe ? `<section class="dsh-card"><h3 class="dsh-h">BoE path — MPC votes &amp; SONIA/OIS</h3>${boe}</section>` : ""}
      </div>
      <h3 class="dsh-term-lbl">Reference</h3>
      <details class="dsh-card dsh-span dsh-ref"><summary class="dsh-h dsh-ref-sum">Cycles &amp; market sizes <span class="dsh-mut">${esc(MARKET_SIZES.asOf || "")}</span></summary>
        <div class="dsh-wide dsh-row2"><section class="dsh-card">${cyc.debt}</section><section class="dsh-card">${cyc.market}</section></div>
        <section class="dsh-card dsh-wide"><h3 class="dsh-h">Market sizes — by asset class &amp; region ${asOf(MARKET_SIZES.asOf)}</h3><div class="dsh-scroll">${marketSizesHTML()}</div></section>
      </details>`;
    const news = `<section class="dsh-card"><h3 class="dsh-h">Rates wire — US &amp; UK headlines</h3>${macroNewsHTML()}</section>`;
    return { mid, news, newsLabel: "Rates wire" };
  }

  // ---- Legal --------------------------------------------------------------
  // A searchable database of ALL alerts + case law the platform covers, unified
  // from the legal desk's `items` (alerts/updates + case notes) and its landmark
  // `cases`, organised by practice area. Insights/know-how are excluded (they are
  // thought-leadership, not alerts or case law). Every row keeps its source URL.
  let _legalCache = null;
  function legalDb() {
    if (_legalCache) return _legalCache;
    // Every legal item the desk covers — alerts, updates, case notes, insights and
    // know-how (the feed labels them all, so all are searchable here). `case` items
    // read as case law; everything else reads as an alert. `hay` is the pre-built
    // normalised search haystack: title + summary + the FULL long-form text (insight
    // bullet points / the extended case summary) + tags + court + citation + firm,
    // so a topic search (e.g. "directors' duties") reaches a case whose NAME never
    // says it but whose summary does.
    const fromItems = (LGL_ITEMS || [])
      .filter((x) => x && x.title)
      .map((x) => {
        const firm = (LGL_FIRM_BY_ID[x.firm] || {}).name || null;
        const long = Array.isArray(x.points) ? x.points.join(" ") : "";
        const tags = Array.isArray(x.tags) ? x.tags.join(" ") : "";
        return { title: x.title, area: x.area, type: x.type === "case" ? "case" : "alert", court: x.court, citation: x.citation, firm, summary: x.summary, url: x.url, date: x.date, est: !!x.dateEstimated,
          thay: _norm(`${x.title} ${x.citation || ""}`),
          hay: _norm(`${x.title} ${x.summary || ""} ${long} ${tags} ${x.court || ""} ${x.citation || ""} ${firm || ""}`) };
      });
    const fromCases = (LGL_CASES || [])
      .filter((c) => c && (c.name || c.title))
      .map((c) => {
        const title = c.name || c.title;
        const long = (LGL_CASE_SUMMARIES && LGL_CASE_SUMMARIES[c.id]) || "";
        return { title, area: c.area, type: "case", court: c.court, citation: c.citation, firm: null, summary: c.summary, url: c.url, date: c.date,
          thay: _norm(`${title} ${c.citation || ""}`),
          hay: _norm(`${title} ${c.summary || ""} ${long} ${c.court || ""} ${c.citation || ""}`) };
      });
    // Dedup by citation|title, but MERGE the search haystacks of duplicates into the
    // kept row — two entries can share a citation (e.g. a Supreme Court case noted at
    // both the appeal and final stage) yet one carries the richer summary. Folding
    // their `hay` together means the survivor is searchable on every duplicate's text.
    const byKey = new Map(), all = [];
    [...fromCases, ...fromItems].forEach((r) => {
      const k = (r.citation || r.title || "").toLowerCase();
      if (k && byKey.has(k)) { const kept = byKey.get(k); kept.hay += " " + r.hay; kept.thay += " " + r.thay; return; }
      if (k) byKey.set(k, r); all.push(r);
    });
    _legalCache = all.sort(byDateDesc);
    return _legalCache;
  }
  function legalListHTML() {
    // Word-by-word AND match over the normalised haystack: every query token must
    // appear somewhere, in any order — so "directors' duties" reaches an item whose
    // title has one word and summary the other. Search-driven: nothing lists until a
    // keyword is entered (no full dump).
    const tokens = _norm(_legalQuery).split(/[^a-z0-9]+/).filter(Boolean);
    if (!tokens.length) {
      const bits = [];
      if (_legalTypes.size) bits.push([..._legalTypes].map((t) => t === "case" ? "case law" : "alerts").join(" & "));
      if (_legalAreas.size) bits.push([..._legalAreas].map((a) => (LGL_AREA_BY_ID[a] || {}).short || a).join(", "));
      const scope = bits.length ? ` (limited to ${bits.join(" · ")})` : "";
      return `<p class="dsh-load">Search ${legalDb().length} legal alerts &amp; case law${scope} — type a keyword above; use the chips to limit by type or practice area.</p>`;
    }
    let list = legalDb();
    if (_legalTypes.size) list = list.filter((x) => _legalTypes.has(x.type));
    if (_legalAreas.size) list = list.filter((x) => _legalAreas.has(x.area));
    list = list.filter((x) => tokens.every((t) => x.hay.includes(t)));
    if (!list.length) return `<p class="dsh-load">No matching case law or alerts.</p>`;
    // One flat list, NEWEST FIRST — not split by practice area. Relevance only breaks
    // a date tie, so among items published the same day the directly-named authority
    // (whole phrase in the title > all query words > word count) edges out a passing
    // mention. Each row still carries its practice-area label so that dimension is kept.
    const phrase = tokens.join(" ");
    const score = (x) => (x.thay.includes(phrase) ? 1000 : 0)
      + (tokens.every((t) => x.thay.includes(t)) ? 100 : 0)
      + tokens.filter((t) => x.thay.includes(t)).length * 10;
    list.forEach((x) => { x._score = score(x); });
    list.sort((a, b) => byDateDesc(a, b) || (b._score - a._score));
    // The same news row as every other list; the type word keeps its .dsh-lgl-case /
    // .dsh-lgl-alert hook (plain text in the grey tag).
    const row = (x) => {
      const area = LGL_AREA_BY_ID[x.area];
      const ty = x.type === "case" ? `<span class="dsh-lgl-ty dsh-lgl-case">Case</span>` : `<span class="dsh-lgl-ty dsh-lgl-alert">Alert</span>`;
      const rest = esc([area && area.short, x.court, x.citation, x.firm].filter(Boolean).join(" · "));
      return newsLi({ title: x.title, href: x.url || "#", date: x.date, est: x.est, meta: ty + (rest ? ` · ${rest}` : ""),
        cls: "dsh-lgl-i", aCls: "dsh-lgl-t", dCls: "dsh-lgl-d", attrs: ` data-date="${esc(x.date || "")}"` });
    };
    return newsUl(list.map(row), "dsh-lgl-list");
  }
  // ---- Hedge Funds --------------------------------------------------------
  // Cross-fund 13F read: curated, SOURCED "consensus longs" + "notable Q1 moves"
  // (HF_13F), plus a LIVE per-fund top-10 holdings table pulled from SEC via the
  // Worker's /api/13f endpoint (same source as the Credit fund pages).
  const hfUsd = (v) => {
    if (v == null || !isFinite(v)) return "—";
    const a = Math.abs(v);
    return a >= 1e9 ? "$" + (v / 1e9).toFixed(2) + "bn" : a >= 1e6 ? "$" + (v / 1e6).toFixed(0) + "m" : "$" + Math.round(v).toLocaleString("en-US");
  };
  const _hfDir = { buy: "Buy", new: "New", trim: "Trim", sell: "Sell" };
  const hfById = new Map((HEDGE_FUNDS || []).map((f) => [f.id, f]));
  // Hedge funds · latest news on the covered funds (HEDGE_INTEL, newest first).
  function hfNewsBody() {
    const rows = (HEDGE_INTEL || []).filter((x) => x && x.date && x.headline && (x.sourceUrl || x.url)).sort(byDateDesc);
    if (!rows.length) return `<p class="dsh-load">No hedge-fund news tracked.</p>`;
    return newsUl(rows.map((x) => newsLi({ title: x.headline, href: x.sourceUrl || x.url, date: x.date, meta: metaOf((hfById.get(x.hfId) || {}).name, x.type, x.outlet) })));
  }
  // Hedge funds · every covered fund by reported AUM (US$bn, each dated + sourced;
  // an estimate is marked "est."), with strategy and HQ.
  function hfFundsBody() {
    const rows = (HEDGE_FUNDS || []).filter((f) => f && f.aum != null).sort((a, b) => b.aum - a.aum);
    if (!rows.length) return `<p class="dsh-load">No AUM figures.</p>`;
    return `<div class="dsh-scroll"><table class="dsh-tbl dsh-mini dsh-hfaum-tbl dsh-stk-src" data-stk-rank="0" data-stk-name="1" data-stk-key="4" data-stk-lab="4"><thead><tr><th>#</th><th>Fund</th><th>Strategy</th><th>HQ</th><th class="dsh-r">AUM $bn</th><th class="dsh-r">As of</th><th class="dsh-srccol"></th></tr></thead><tbody>`
      + rows.map((f, i) => `<tr><td class="dsh-r dsh-rank">${i + 1}</td><td><a class="dsh-drill" href="${esc(`${ctx.base}/profiles/#/hf/${f.id}`)}">${esc(f.name)}</a></td><td class="dsh-mut dsh-wrap">${esc(f.strategy || "—")}</td><td class="dsh-mut dsh-wrap">${esc(f.hq || f.region || "—")}</td>`
        + `<td class="dsh-r"${f.estimated ? ' title="Estimate — see source"' : ""}>${esc((+f.aum).toFixed(1))}${f.estimated ? `<span class="dsh-est"> est.</span>` : ""}</td><td class="dsh-r dsh-d">${esc(isoDay(f.aumAsOf || ""))}</td><td class="dsh-srccol">${srcLink(f.aumSource, f.name + " AUM")}</td></tr>`).join("") + `</tbody></table></div>`;
  }
  // Hedge funds · latest reported performance per fund (each with its own period + source).
  function hfPerfBody() {
    const rows = (HEDGE_FUNDS || []).filter((f) => f && f.perf && f.perf.text && f.perf.source)
      .sort((a, b) => String(b.perf.asOf || "").localeCompare(String(a.perf.asOf || "")) || a.name.localeCompare(b.name));
    if (!rows.length) return `<p class="dsh-load">No reported performance.</p>`;
    return `<div class="dsh-scroll"><table class="dsh-tbl dsh-mini dsh-stk-src" data-stk-name="0" data-stk-key="2"><thead><tr><th>Fund</th><th>Reported</th><th class="dsh-r">Period</th><th class="dsh-srccol"></th></tr></thead><tbody>`
      + rows.map((f) => `<tr><td><a class="dsh-drill" href="${esc(`${ctx.base}/profiles/#/hf/${f.id}`)}">${esc(f.name)}</a></td><td class="dsh-mut dsh-wrap">${txt(f.perf.text)}</td><td class="dsh-r dsh-d">${esc(isoDay(f.perf.asOf || ""))}</td><td class="dsh-srccol">${srcLink(f.perf.source, f.name + " performance")}</td></tr>`).join("") + `</tbody></table></div>`;
  }
  // Hedge funds · the covered universe by strategy family: each fund's own strategy
  // label grouped by keyword (first match wins), with fund count and summed AUM.
  const HF_FAMILIES = [["Activist / event-driven", /activis|event/i], ["Multi-strategy", /multi/i], ["Quant / systematic", /quant|systematic|cta|factor|statistical/i],
    ["Global macro", /macro/i], ["Credit & fixed income", /credit|distress|fixed.income|structured|debt|bond|convertible|arbitrage/i],
    ["Equity long/short", /equity|long.?short|long\/short|growth|value|sector|technology|health/i]];
  const hfFamily = (st) => (HF_FAMILIES.find(([, re]) => re.test(st || "")) || ["Other"])[0];
  function hfStrategyBody() {
    const m = new Map();
    (HEDGE_FUNDS || []).forEach((f) => { if (!f) return; const k = hfFamily(f.strategy); const r = m.get(k) || { n: 0, aum: 0, eu: 0, top: null }; r.n++; r.aum += +f.aum || 0; if (/europe|uk/i.test(f.region || "")) r.eu++; if (!r.top || (+f.aum || 0) > (+r.top.aum || 0)) r.top = f; m.set(k, r); });
    const rows = [...m.entries()].sort((a, b) => b[1].aum - a[1].aum);
    if (!rows.length) return `<p class="dsh-load">No funds tracked.</p>`;
    return `<div class="dsh-scroll"><table class="dsh-tbl dsh-mini dsh-stk-src" data-stk-name="0" data-stk-key="4" data-stk-lab="1,2,3,4"><thead><tr><th>Strategy family</th><th>Largest</th><th class="dsh-r">Funds</th><th class="dsh-r" title="Europe / UK based">EU/UK</th><th class="dsh-r">AUM $bn</th></tr></thead><tbody>`
      + rows.map(([k, r]) => `<tr><td class="dsh-wrap">${esc(k)}</td><td class="dsh-mut dsh-wrap">${r.top ? esc(r.top.name) : "—"}</td><td class="dsh-r">${r.n}</td><td class="dsh-r">${r.eu}</td><td class="dsh-r">${esc(r.aum.toFixed(0))}</td></tr>`).join("") + `</tbody></table></div>`;
  }
  // Hedge funds · which covered funds are in the news (last 90 days, tracked by Wire).
  function hfNewsCountBody() {
    const cut = new Date(Date.now() - 90 * 864e5).toISOString().slice(0, 10);
    const m = new Map();
    (HEDGE_INTEL || []).forEach((x) => { if (x && x.hfId && x.date >= cut && hfById.has(x.hfId)) { const r = m.get(x.hfId) || { n: 0, last: "", types: new Set() }; r.n++; if (x.date > r.last) r.last = x.date; if (x.type) r.types.add(x.type); m.set(x.hfId, r); } });
    const rows = [...m.entries()].sort((a, b) => b[1].n - a[1].n || (a[1].last < b[1].last ? 1 : -1));
    if (!rows.length) return `<p class="dsh-load">No fund news in the last 90 days.</p>`;
    return `<div class="dsh-scroll"><table class="dsh-tbl dsh-mini dsh-stk-src" data-stk-name="0" data-stk-key="3" data-stk-lab="2"><thead><tr><th>Fund</th><th>Topics</th><th class="dsh-r">Items</th><th class="dsh-r">Latest</th></tr></thead><tbody>`
      + rows.map(([id, r]) => `<tr><td><a class="dsh-drill" href="${esc(`${ctx.base}/profiles/#/hf/${id}`)}">${esc(hfById.get(id).name)}</a></td><td class="dsh-mut dsh-wrap">${esc([...r.types].join(", "))}</td><td class="dsh-r">${r.n}</td><td class="dsh-r dsh-d">${esc(isoDay(r.last))}</td></tr>`).join("") + `</tbody></table></div>`;
  }
  function hedgeFundsHTML() {
    const F = HF_13F || {};
    const yh = (t) => `https://finance.yahoo.com/quote/${encodeURIComponent(t)}`;
    const tkr = (t) => `<a class="dsh-hf-t" href="${esc(yh(t))}" target="_blank" rel="noopener noreferrer">${esc(t)}</a>`;
    const conRow = (x) => `<div class="dsh-hf-i"><div class="dsh-hf-i-h">${tkr(x.t)} <span class="dsh-hf-nm">${esc(x.name)}</span>${srcLink(x.src)}</div><div class="dsh-hf-note">${txt(x.note)}</div></div>`;
    const mvRow = (x) => `<div class="dsh-hf-i"><div class="dsh-hf-i-h"><span class="dsh-hf-dir dsh-hf-${esc(x.dir)}">${esc(_hfDir[x.dir] || x.dir)}</span> ${tkr(x.t)} <span class="dsh-hf-nm">${esc(x.name)}</span> <span class="dsh-hf-by">${esc(x.by)}</span>${srcLink(x.src)}</div><div class="dsh-hf-note">${txt(x.note)}</div></div>`;
    const filers = (HEDGE_FUNDS || []).filter((f) => f.cik).sort((a, b) => a.name.localeCompare(b.name));
    const opts = filers.map((f) => `<option value="${esc(f.cik)}">${esc(f.name)}</option>`).join("");
    const mid = `<h3 class="dsh-term-lbl">Holdings — SEC 13F</h3>
      <section class="dsh-card dsh-wide">
        <h3 class="dsh-h">Consensus longs — ${esc(F.quarter || "")} 13Fs ${asOf(F.quarter)}</h3>
        <div class="dsh-hf-list">${(F.consensus || []).map(conRow).join("")}</div>
              </section>
      <section class="dsh-card dsh-wide dsh-fill">
        <h3 class="dsh-h">Per-fund holdings — SEC 13F ${liveOr("hf13f")}</h3>
        <div class="dsh-hf-pick"><label class="dsh-lgl-lbl" for="dsh-hf-sel">Fund</label>
          <select id="dsh-hf-sel" class="dsh-hf-sel">${opts}</select><a id="dsh-hf-prof" class="dsh-drill dsh-hf-prof" href="${filers[0] ? esc(`${ctx.base}/profiles/#/hf/${filers[0].id}/holdings`) : "#"}">Open profile</a></div>
        <div id="dsh-hf-body" class="dsh-hf-body dsh-fill-body"><p class="dsh-load">Loading latest 13F…</p></div>
      </section>
      <h3 class="dsh-term-lbl">Funds</h3>
      ${fillCard("dsh-hfaum", "Hedge funds tracked — by AUM", hfFundsBody(), `<span class="dsh-n">(${(HEDGE_FUNDS || []).filter((f) => f && f.aum != null).length})</span> ${asOf(HEDGE_FUNDS_ASOF)}`, "dsh-wide")}
      <section class="dsh-card"><h3 class="dsh-h">By strategy ${asOf(HEDGE_FUNDS_ASOF)}</h3>${hfStrategyBody()}</section>
      ${fillCard("dsh-hfperf", "Reported performance — latest", hfPerfBody(), `<span class="dsh-n">(${(HEDGE_FUNDS || []).filter((f) => f && f.perf && f.perf.text).length})</span>`, "dsh-wide")}
      <h3 class="dsh-term-lbl">News</h3>
      ${fillCard("dsh-hfnews", "Hedge-fund news", hfNewsBody(), `<span class="dsh-n">(${(HEDGE_INTEL || []).length})</span>`)}
      ${fillCard("dsh-hfin", "Funds in the news — 90 days", hfNewsCountBody(), `<span class="dsh-n">tracked by Wire</span> ${asOf(isoDay(new Date().toISOString().slice(0, 10)))}`)}`;
    const news = `<section class="dsh-card"><h3 class="dsh-h">Notable ${esc(F.quarter || "")} moves ${asOf(F.quarter)}</h3>
      <div class="dsh-news dsh-hf-list">${(F.moves || []).map(mvRow).join("")}</div></section>`;
    return { mid, news, newsLabel: "Notable moves" };
  }
  function renderHfHoldings(body, d) {
    if (!d || !Array.isArray(d.holdings) || !d.holdings.length) {
      body.innerHTML = `<p class="dsh-load">No 13F holdings available${d && d.source ? ` — <a href="${esc(d.source)}" target="_blank" rel="noopener noreferrer">latest filing</a>.` : "."}</p>`;
      return;
    }
    const yh = (t) => `https://finance.yahoo.com/quote/${encodeURIComponent(t)}`;
    const rows = d.holdings.slice(0, 50).map((h, i) => `<tr><td class="dsh-r">${i + 1}</td>`
      + `<td>${esc(h.name || "—")}</td>`
      + `<td>${h.ticker ? `<a href="${esc(yh(h.ticker))}" target="_blank" rel="noopener noreferrer">${esc(h.ticker)}</a>` : "—"}</td>`
      + `<td class="dsh-r">${esc(hfUsd(h.value))}</td>`
      + `<td class="dsh-r">${h.weight != null && isFinite(h.weight) ? (h.weight * 100).toFixed(1) + "%" : "—"}</td></tr>`).join("");
    body.innerHTML = `<table class="dsh-tbl dsh-hf-tbl"><thead><tr><th class="dsh-r">#</th><th>Holding</th><th>Ticker</th><th class="dsh-r">Value</th><th class="dsh-r">Weight</th></tr></thead><tbody>${rows}</tbody></table>`
      + `<p class="dsh-fl-note">Top ${Math.min(50, d.holdings.length)} US-listed positions by value${d.asOf ? `, as of ${esc(d.asOf)}` : ""}${d.source ? ` · <a href="${esc(d.source)}" target="_blank" rel="noopener noreferrer">latest 13F</a>` : ""}.</p>`;
  }
  function wireHedgeFunds() {
    const sel = host.querySelector("#dsh-hf-sel"), body = host.querySelector("#dsh-hf-body");
    if (!sel || !body) return;
    const load = async (cik) => {
      if (!cik) return;
      body.innerHTML = `<p class="dsh-load">Loading latest 13F…</p>`;
      try {
        const r = await fetch(`/api/13f?cik=${encodeURIComponent(cik)}`, { headers: { accept: "application/json" } });
        if (!r.ok) { body.innerHTML = `<p class="dsh-load">Could not load holdings right now (SEC feed error ${r.status}).</p>`; return; }
        const d = await r.json();
        renderHfHoldings(body, d);
        if (d && Array.isArray(d.holdings) && d.holdings.length) markLive("hf13f", d.asOf);
      } catch { body.innerHTML = `<p class="dsh-load">Could not load holdings right now.</p>`; }
    };
    const prof = host.querySelector("#dsh-hf-prof");
    const syncProf = () => { const f = (HEDGE_FUNDS || []).find((x) => x.cik === sel.value); if (prof && f) prof.href = `${ctx.base}/profiles/#/hf/${f.id}/holdings`; };
    sel.addEventListener("change", () => { syncProf(); load(sel.value); });
    if (sel.value) load(sel.value);
  }
  // Legal wire — the freshest sourced alerts & case law as a right-rail news list
  // (legalDb() is already newest-first), mirroring the Macro/Credit wires.
  function legalNewsHTML() {
    const items = legalDb().filter((x) => x && x.date && x.title && x.url).slice(0, 16);
    if (!items.length) return "";
    return newsUl(items.map((x) => newsLi({ title: x.title, href: x.url, date: x.date, est: x.est, meta: metaOf(x.type === "case" ? "Case" : "Alert", x.firm || x.court) })));
  }
  // Restructuring & insolvency — the newest sourced alerts / case law in the
  // restructuring practice area (schemes, Part 26A plans, insolvency), drawn from
  // the legal desk's own records.
  function restructuringHTML() {
    const items = legalDb().filter((x) => x && x.area === "ri" && x.date && x.title && x.url);
    if (!items.length) return `<p class="dsh-load">No restructuring items tracked.</p>`;
    return newsUl(items.map((x) => newsLi({ title: x.title, href: x.url, date: x.date, est: x.est, meta: metaOf(x.type === "case" ? "Case" : "Alert", x.firm || x.court) })));
  }
  // Regulatory calendar — dated, sourced milestones (REG_CALENDAR), upcoming first
  // then the most recent past ones; an undated item (e.g. a file still in
  // trilogue) is listed last as "TBC".
  // A window filter answers "what hits us next quarter?" in one tap: Next 90 days ·
  // Next 12 months · All (default). Month-precision dates ("2026-12") sort and
  // filter as the 1st of that month and read "Dec 2026".
  let _regWin = "all";
  const REG_WINS = [["90", "Next 90 days"], ["365", "Next 12 months"], ["all", "All"]];
  function regCalendarHTML() {
    const R = (REG_CALENDAR && REG_CALENDAR.items) || [];
    if (!R.length) return "";
    const today = new Date().toISOString().slice(0, 10);
    const horizon = _regWin === "all" ? null : new Date(Date.now() + (+_regWin) * 864e5).toISOString().slice(0, 10);
    const inWin = (x) => !horizon || (x.date && x.date >= today.slice(0, x.date.length) && x.date <= horizon);
    const up = R.filter((x) => x.date && x.date >= today.slice(0, x.date.length) && inWin(x)).sort((a, b) => (a.date < b.date ? -1 : 1));
    const past = horizon ? [] : R.filter((x) => x.date && x.date < today.slice(0, x.date.length)).sort((a, b) => (a.date < b.date ? 1 : -1));
    const tbc = horizon ? [] : R.filter((x) => !x.date);
    const n90 = R.filter((x) => x.date && x.date >= today.slice(0, x.date.length) && x.date <= new Date(Date.now() + 90 * 864e5).toISOString().slice(0, 10)).length;
    const chips = `<div class="dsh-sortbar dsh-reg-wins"><span class="dsh-sortlbl">Show</span>${REG_WINS.map(([k, l]) => `<button type="button" class="dsh-sortchip dsh-reg-win${_regWin === k ? " is-on" : ""}" data-regwin="${k}">${esc(l)}${k === "90" ? ` (${n90})` : ""}</button>`).join("")}</div>`;
    const row = (x, cls) => `<tr class="${cls}"><td class="dsh-stress-as">${x.date ? esc(isoDay(x.date)) : "TBC"}</td>`
      + `<td class="dsh-reg-jur">${esc(x.jur || "")}</td>`
      + `<td class="dsh-nm">${esc(x.item)}${srcLink(x.src, (x.srcName || "source") + " — source")}</td><td class="dsh-reg-note">${esc(x.note || "")}</td></tr>`;
    const rows = up.map((x) => row(x, "dsh-reg-up")).join("") + tbc.map((x) => row(x, "dsh-reg-tbc")).join("") + past.map((x) => row(x, "dsh-reg-past")).join("");
    return chips + `<div class="dsh-scroll"><table class="dsh-tbl dsh-reg-tbl dsh-stk-src" data-stk-name="2" data-stk-key="0"><thead><tr><th>Date</th><th>Jur.</th><th>Milestone</th><th>What</th></tr></thead><tbody>`
      + (rows || `<tr><td colspan="4" class="dsh-load">No dated milestones in this window.</td></tr>`)
      + `</tbody></table></div>`;
  }
  // Legal · latest case law (all judgments the desk covers, newest first).
  function caseLawBody() {
    const rows = legalDb().filter((x) => x && x.type === "case" && x.date && x.title && x.url);
    if (!rows.length) return `<p class="dsh-load">No case law tracked.</p>`;
    return newsUl(rows.map((x) => newsLi({ title: x.title, href: x.url, date: x.date, est: x.est, meta: metaOf(x.court, x.citation, (LGL_AREA_BY_ID[x.area] || {}).short) })));
  }
  // Legal · every item in one practice area, newest first (alerts + judgments).
  function areaListBody(area) {
    const rows = legalDb().filter((x) => x && x.area === area && x.date && x.title && x.url);
    if (!rows.length) return `<p class="dsh-load">No items tracked.</p>`;
    return newsUl(rows.map((x) => newsLi({ title: x.title, href: x.url, date: x.date, est: x.est, meta: metaOf(x.type === "case" ? "Case" : "Alert", x.firm || x.court) })));
  }
  // Legal · activity by practice area: alerts and judgments in the last 30 / 90 days
  // and in total, from the desk's own records.
  function areasBody() {
    const d30 = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10), d90 = new Date(Date.now() - 90 * 864e5).toISOString().slice(0, 10);
    const m = new Map();
    legalDb().forEach((x) => { if (!x || !x.area) return; const r = m.get(x.area) || { a30: 0, c30: 0, n90: 0, all: 0, last: "" }; r.all++;
      if (x.date >= d90) r.n90++; if (x.date >= d30) { if (x.type === "case") r.c30++; else r.a30++; } if ((x.date || "") > r.last) r.last = x.date; m.set(x.area, r); });
    const rows = [...m.entries()].sort((a, b) => b[1].n90 - a[1].n90 || b[1].all - a[1].all);
    if (!rows.length) return `<p class="dsh-load">No legal items tracked.</p>`;
    return `<div class="dsh-scroll"><table class="dsh-tbl dsh-mini dsh-stk-src" data-stk-name="0" data-stk-lab="1,2,3,4,5"><thead><tr><th>Practice area</th><th class="dsh-r" title="Alerts, last 30 days">Alerts 30d</th><th class="dsh-r" title="Judgments, last 30 days">Cases 30d</th><th class="dsh-r">90d</th><th class="dsh-r">All</th><th class="dsh-r">Latest</th></tr></thead><tbody>`
      + rows.map(([k, r]) => `<tr><td class="dsh-wrap">${esc((LGL_AREA_BY_ID[k] || {}).name || k)}</td><td class="dsh-r">${r.a30}</td><td class="dsh-r">${r.c30}</td><td class="dsh-r">${r.n90}</td><td class="dsh-r">${r.all}</td><td class="dsh-r dsh-d">${esc(isoDay(r.last))}</td></tr>`).join("") + `</tbody></table></div>`;
  }
  // Legal · most active firms: every firm publishing in the last 90 days — 30-day and
  // 90-day counts, its leading practice area, and its latest item's date.
  function firmsBody() {
    const d30 = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10), d90 = new Date(Date.now() - 90 * 864e5).toISOString().slice(0, 10);
    const idByName = new Map(Object.values(LGL_FIRM_BY_ID || {}).map((f) => [f.name, f.id]));
    const m = new Map();
    legalDb().forEach((x) => { if (!x || !x.firm || !(x.date >= d90)) return; const r = m.get(x.firm) || { n30: 0, n90: 0, last: "", areas: new Map() }; r.n90++; if (x.date >= d30) r.n30++;
      if (x.date > r.last) r.last = x.date; if (x.area) r.areas.set(x.area, (r.areas.get(x.area) || 0) + 1); m.set(x.firm, r); });
    const rows = [...m.entries()].sort((a, b) => b[1].n30 - a[1].n30 || b[1].n90 - a[1].n90 || a[0].localeCompare(b[0]));
    if (!rows.length) return `<p class="dsh-load">No firm publications in the last 90 days.</p>`;
    const top = (r) => { const a = [...r.areas.entries()].sort((x, y) => y[1] - x[1])[0]; return a ? ((LGL_AREA_BY_ID[a[0]] || {}).short || a[0]) : "—"; };
    return `<div class="dsh-scroll"><table class="dsh-tbl dsh-mini dsh-stk-src" data-stk-name="0" data-stk-lab="2,3,4"><thead><tr><th>Firm</th><th>Main area</th><th class="dsh-r">30d</th><th class="dsh-r">90d</th><th class="dsh-r">Latest</th></tr></thead><tbody>`
      + rows.map(([nm, r]) => { const id = idByName.get(nm); return `<tr><td>${id ? `<a class="dsh-drill" href="${esc(`${ctx.base}/profiles/#/firm/${encodeURIComponent(id)}`)}">${esc(nm)}</a>` : esc(nm)}</td><td class="dsh-mut">${esc(top(r))}</td><td class="dsh-r">${r.n30}</td><td class="dsh-r">${r.n90}</td><td class="dsh-r dsh-d">${esc(isoDay(r.last))}</td></tr>`; }).join("") + `</tbody></table></div>`;
  }
  function legalHTML() {
    const total = legalDb().length;
    // Toggleable practice-area chips (multi-select) that LIMIT the keyword search;
    // none selected = search every area.
    const TYPES = [["alert", "Alerts"], ["case", "Case law"]];
    const tchip = ([k, l]) => `<button type="button" class="dsh-lgl-chip${_legalTypes.has(k) ? " is-on" : ""}" data-type="${esc(k)}">${esc(l)}</button>`;
    const achip = (a) => `<button type="button" class="dsh-lgl-chip${_legalAreas.has(a.id) ? " is-on" : ""}" data-area="${esc(a.id)}">${esc(a.short || a.name)}</button>`;
    const typeChips = `<div class="dsh-lgl-chips"><span class="dsh-lgl-lbl">Type</span>${TYPES.map(tchip).join("")}</div>`;
    const areaChips = `<div class="dsh-lgl-chips"><span class="dsh-lgl-lbl">Practice area</span>${(LGL_AREAS || []).map(achip).join("")}</div>`;
    // Legal is a normal 3-zone tab: the search panel is a full-width card in the
    // middle (white surface on the grey ground, like the other pages) and the
    // recent alerts & case law ride in a right-hand news wire, just like Macro.
    const cal = regCalendarHTML();
    const mid = `<section class="dsh-card dsh-legal-panel dsh-span">
        <h3 class="dsh-h">Legal — case law &amp; alerts <span class="dsh-n">(${total}) · search</span></h3>
        <input type="search" class="dsh-lgl-search" id="dsh-lgl-q" placeholder="Search alerts &amp; case law" value="${esc(_legalQuery)}" autocomplete="off" spellcheck="false">
        ${typeChips}${areaChips}
        <div class="dsh-lgl-body" id="dsh-lgl-body">${legalListHTML()}</div>
      </section>
      ${cal ? `<section class="dsh-card dsh-wide" id="dsh-regcal"><h3 class="dsh-h">Regulatory calendar ${asOf(REG_CALENDAR.asOf)}</h3><div id="dsh-regcal-b">${cal}</div></section>` : ""}
      ${fillCard("dsh-rxl", "Restructuring &amp; insolvency — latest", restructuringHTML())}
      ${fillCard("dsh-cases", "Case law — latest judgments", caseLawBody())}
      ${fillCard("dsh-firms", "Most active firms — 30 / 90 days", firmsBody(), `<span class="dsh-n">alerts &amp; updates</span> ${asOf(isoDay(new Date().toISOString().slice(0, 10)))}`, "dsh-wide")}
      <section class="dsh-card" id="dsh-areas"><h3 class="dsh-h">Activity by practice area ${asOf(isoDay(new Date().toISOString().slice(0, 10)))}</h3>${areasBody()}</section>
      ${fillCard("dsh-lfunds", "Funds — regulatory &amp; fund-finance alerts", areaListBody("funds"), `<span class="dsh-n">(${legalDb().filter((x) => x && x.area === "funds").length})</span>`)}
      ${fillCard("dsh-lbank", "Banking &amp; finance — latest", areaListBody("banking"), `<span class="dsh-n">(${legalDb().filter((x) => x && x.area === "banking").length})</span>`)}
`;
    const lw = legalNewsHTML();
    return { mid, news: lw ? `<section class="dsh-card"><h3 class="dsh-h">Legal wire — latest alerts &amp; case law</h3>${lw}</section>` : "", newsLabel: "Legal wire" };
  }
  function wireLegal() {
    const rc = host.querySelector("#dsh-regcal-b");
    if (rc) rc.addEventListener("click", (e) => {
      const b = e.target.closest("[data-regwin]"); if (!b) return;
      _regWin = b.dataset.regwin; rc.innerHTML = regCalendarHTML(); repreview(rc);
    });
    const q = host.querySelector("#dsh-lgl-q");
    const body = host.querySelector("#dsh-lgl-body");
    if (q && body) q.addEventListener("input", () => { _legalQuery = q.value; body.innerHTML = legalListHTML(); previewList(body); });
    host.querySelectorAll(".dsh-lgl-chip").forEach((c) => c.addEventListener("click", () => {
      if (c.dataset.type) { const t = c.dataset.type; _legalTypes.has(t) ? _legalTypes.delete(t) : _legalTypes.add(t); }
      else { const a = c.dataset.area; _legalAreas.has(a) ? _legalAreas.delete(a) : _legalAreas.add(a); }
      c.classList.toggle("is-on");
      if (body) { body.innerHTML = legalListHTML(); previewList(body); }
    }));
  }

  // ---- Shell + routing ----------------------------------------------------
  // The Dashboard is a three-zone workspace: a narrow left rail holding the
  // section nav, the selected section stacked top-to-bottom in the middle, and
  // the section's news wire as a right-hand rail (omitted for Legal, which is a
  // full-width search).
  function render() {
    if (_closeSheet) _closeSheet();
    _ros = null;
    const nav = SUBTABS.map(([k, l, s]) => {
      // Full label in the desktop rail; a short label appears on the narrow phone
      // tab bar (see dashboard.css) so "Hedge Funds" doesn't wrap.
      const label = s ? `<span class="dsh-tab-lg">${l}</span><span class="dsh-tab-sm">${s}</span>` : l;
      return `<a class="dsh-navchip${pane === k ? " is-on" : ""}" href="${ctx.base}/dashboard/${k}" data-sub="${k}">${label}</a>`;
    }).join("");
    const sec = pane === "equities" ? equitiesHTML()
      : pane === "rates" ? ratesHTML()
      : pane === "hedge-funds" ? hedgeFundsHTML()
      : pane === "legal" ? legalHTML()
      : creditHTML();
    const rail = sec.news
      ? `<aside class="dsh-newsrail"><h3 class="dsh-term-lbl">${esc(sec.newsLabel || "Wire")}</h3>${sec.news}</aside>`
      : "";
    host.innerHTML = `<div class="dsh"><div class="dsh-3z${sec.news ? "" : " dsh-norail"}" data-pane="${esc(pane)}">
      <nav class="dsh-railnav" aria-label="Dashboard sections">${nav}</nav>
      <main class="dsh-mid">${sec.mid}</main>
      ${rail}
    </div></div>`;
    tidyHeaders();
    if (pane === "credit") {
      _ros = wireRosters(host, { onSeeAll: (root, which) => openSheet(null, { move: root, onClose: () => _ros && _ros.collapse(which) }) });
    }
    layoutMid();
    if (pane === "equities") loadWorldIndices();
    if (pane === "credit") { loadRates(); loadEu(); wireStressSort(); }
    if (pane === "equities") loadEu();
    if (pane === "rates") { loadRates(); loadEu(); loadYieldCurve(); wireYields(); loadGovYields(); loadImplied(); }
    if (pane === "hedge-funds") wireHedgeFunds();
    if (pane === "legal") wireLegal();
  }
  function wireStressSort() {
    host.querySelectorAll(".dsh-sortchip").forEach((btn) => btn.addEventListener("click", () => {
      const k = btn.dataset.sort;
      if (_stressSort.key === k) _stressSort.dir *= -1; else { _stressSort.key = k; _stressSort.dir = k === "debt" ? -1 : 1; }
      const wrap = host.querySelector(".dsh-stresswrap");
      if (wrap) { wrap.outerHTML = stressHTML(); stackTables(host); repreview(host.querySelector(".dsh-stresswrap")); wireStressSort(); }
    }));
  }
  host.addEventListener("change", (e) => {
    if (!e.target.matches || !e.target.matches(".dsh-fim-strat")) return;
    _fimStrat = e.target.value; const bx = host.querySelector("#dsh-fim-b"); if (bx) { bx.innerHTML = fimHTML(); repreview(bx); }
  });
  host.addEventListener("click", (e) => {
    const fs = e.target.closest("[data-fim-scope]");
    if (fs) { e.preventDefault(); _fimScope = _fimScope === "eu" ? "all" : "eu"; const bx = host.querySelector("#dsh-fim-b"); if (bx) { bx.innerHTML = fimHTML(); repreview(bx); } return; }
    const cw = e.target.closest("[data-cwscope]");
    if (cw) {
      e.preventDefault(); _cwScope = _cwScope === "eu" ? "all" : "eu";
      cw.classList.toggle("is-on", _cwScope === "eu"); cw.textContent = _cwScope === "eu" ? "Europe" : "All regions";
      host.querySelectorAll("#dsh-cw-b").forEach((b) => { b.innerHTML = creditNewsHTML(); repreview(b.closest(".dsh-card")); });
      return;
    }
    const more = e.target.closest(".dsh-seeall:not([data-crall]):not([data-bdcall])");
    if (more) { e.preventDefault(); openSheet(more.parentElement); return; }
    const a = e.target.closest(".dsh-navchip[data-sub], .tchip[data-sub]");
    if (a) { e.preventDefault(); e.stopPropagation(); pane = a.dataset.sub; render(); try { history.replaceState(null, "", a.getAttribute("href")); } catch { /* */ } }
  });
  const subFromUrl = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    const i = parts.indexOf("dashboard");
    return i >= 0 ? parts[i + 1] : "";
  };
  // Resolve the URL's sub-tab (retired macro/fixed-income → rates; unknown →
  // Credit) and canonicalise a retired URL in place so Back never revisits it.
  const resolve = (k) => {
    const sub = subOf(k || "");
    if (k && k !== sub) { try { history.replaceState(history.state, "", `${ctx.base}/dashboard/${sub}`); } catch { /* */ } }
    return sub;
  };
  pane = resolve(subFromUrl());
  render();

  return {
    enter(sub) {
      pane = resolve((sub && sub[0]) || subFromUrl());
      render();
    },
    leave() { if (_ro) { _ro.disconnect(); _ro = null; } if (_closeSheet) _closeSheet(); },
    // home(): a nav-bar tap resets the Dashboard to its first sub-tab (Credit).
    home() { pane = DEFAULT_SUB; render(); window.scrollTo(0, 0); },
  };
}
