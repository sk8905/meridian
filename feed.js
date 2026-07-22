// =============================================================================
// feed.js — the ONE news-wire engine. The Home feed's row/day-header/chip/
// source-filter rendering, extracted so Macro, Credit and Legal render an
// identical wire (design, functionality, appearance). Content stays per-desk:
// each page assembles its own normalised items and desk vocabulary, then hands
// them to this engine, which owns the markup + interaction so every wire is the
// same build. Pure module — no page-specific imports; loaded site-absolute
// ("/feed.js?v=…") with the usual cache-token discipline.
// =============================================================================
import { esc } from "/util.js?v=20260719-1";

// ---- Desk vocabulary --------------------------------------------------------
// A "desk" is the label a row carries. Home merges the cross-desk streams
// (news / macro / credit / legal / letters / FT / …); the apps add their own
// finer taxonomy (credit: deal/fund/clo/comm; legal: alert/case/scheme/rp).
// One shared map so the code chip, its colour class and the tooltip all agree
// wherever the wire is rendered.
export const DESK = {
  news: "News", bbg: "Bloomberg", econ: "The Economist",
  m: "Macro", c: "Credit", l: "Legal",
  n: "Letter", f: "myFT", s: "Substack", b: "Brew",
  deal: "Deal", fund: "Fundraising", clo: "CLO", comm: "Commentary",
  alert: "Client alert", case: "Case law", scheme: "Scheme", rp: "Restructuring plan",
};
export const DESK_CODE = {
  news: "NEWS", bbg: "BBG", econ: "ECON", m: "MAC", c: "CRD", l: "LEX",
  n: "LTR", f: "FT", s: "SUBS", b: "BREW",
  deal: "DEAL", fund: "FUND", clo: "CLO", comm: "COMM",
  alert: "ALERT", case: "CASE", scheme: "SCHEME", rp: "RP",
};
export const DESK_CLASS = {
  news: "news", bbg: "bbg", econ: "econ", m: "macro", c: "credit", l: "legal",
  n: "newsletter", f: "ft", s: "substack", b: "brew",
  deal: "deal", fund: "fund", clo: "clo", comm: "comm",
  alert: "alert", case: "case", scheme: "scheme", rp: "rp",
};

// Strictly-macro classifier: central-bank policy, rates/yields, inflation,
// growth & the labour market. A story is tagged MAC only when its headline reads
// as core macro; everything else defaults to the general NEWS desk.
export const STRICT_MACRO_RE = /\b(fed(eral reserve)?|fomc|powell|rate (cut|hike|rise|path|decision)|interest rates?|bank of england|\bboe\b|\bmpc\b|\becb\b|central bank|lagarde|\bcpi\b|\bpce\b|inflation|disinflation|deflation|\bgdp\b|gross domestic|growth forecast|recession|jobs report|payrolls?|unemployment|jobless|labou?r market|treasur\w* (yield|note|bond)|gilt|bund|bond yield|yield curve|quantitative (easing|tightening)|\bqt\b|monetary policy|budget|deficit|fiscal|tariffs?|trade war)\b/i;
// Bloomberg stories that aren't strictly macro get the BBG label (not the
// generic NEWS one); Economist → ECON; strict-macro items still read MAC.
export const deskFor = (title, source, dflt = "news") => {
  const s = source || "";
  // The macro-data / economic-indicator desk (GDP / CPI / PMI / rates / labour
  // releases) reads MAC regardless of the individual headline — TradingEconomics
  // (legacy) and its reachable substitute, Investing.com's Economic Indicators
  // feed, emitted as source "Investing.com Economics".
  if (/trading\s*economics|investing\.com economics/i.test(s)) return "m";
  if (STRICT_MACRO_RE.test(title || "")) return "m";
  if (/^bloomberg\b/i.test(s)) return "bbg";
  if (/economist/i.test(s)) return "econ";
  return dflt;
};
// Map a feed desk to the command-palette tag vocabulary, so the "#CODE" filters
// (e.g. #BBG, #ECON) list the same items the feed labels carry.
export const palTag = (d, dflt) => ({ m: "macro", n: "letter", bbg: "bbg", econ: "econ", c: "credit", l: "legal", f: "ft", news: "news" }[d] || dflt);
// Newsletter classifier — the reader's Gmail-swept newsletters are LTR by the
// stated precedence (LTR trumps FT/BBG/ECON); only a strictly-macro one reads MAC
// (MAC also trumps LTR). Named premium sources (Bloomberg, The Economist) are
// fetched SEPARATELY as live wire stories and carry BBG/ECON there — the
// newsletter copy stays LTR.
export const nlDesk = (title) => (STRICT_MACRO_RE.test(title || "") ? "m" : "n");
// The command-palette label vocabulary: tag → the pill code shown + matched by
// the "#CODE" filter. Shared by the Home palette and the app palette so a "#"
// search behaves identically in every search bar.
export const PAL_CODE = { macro: "MAC", credit: "CRD", legal: "LEX", view: "GO", ft: "FT", letter: "LTR", substack: "SUBS", brew: "BREW", bbg: "BBG", econ: "ECON", news: "NEWS" };

// ---- Live wire (shared /api/feed loader) -------------------------------------
// Desk label for a LIVE wire item — Home's routing rule, codified once so every
// page labels the same story the same way: reader-curated streams keep their own
// desks (myFT→FT, Substack→SUBS, Brew→BREW); everything else classifies by
// title/source (MAC / BBG / ECON / NEWS).
export const liveDesk = (n) => (n.myft ? "f" : n.substack ? "s" : n.brew ? "b" : deskFor(n.title, n.source));
// One loader for the cross-desk live wire, shared by every page (Macro / Credit /
// Legal dashboards + the app search palette). Subscribers are called immediately
// with the last-good cached items (the SAME m_glance_feed cache Home writes, so
// all pages see the same stories), then once more when the live fetch lands —
// which happens at most ONCE per page load no matter how many subscribers.
let _lwFetchStarted = false;
let _lwLive = null;
const _lwSubs = [];
const lwCached = () => { try { return ((JSON.parse(localStorage.getItem("m_glance_feed") || "null") || {}).items) || []; } catch { return []; } };
export function onLiveWire(fn) {
  _lwSubs.push(fn);
  const seed = _lwLive || lwCached();
  if (seed.length) { try { fn(seed); } catch { /* subscriber error — isolate */ } }
  if (_lwFetchStarted) return;
  _lwFetchStarted = true;
  fetch("/api/feed", { headers: { accept: "application/json" } })
    .then((r) => (r.ok && !(r.headers.get("content-type") || "").includes("text/html") ? r.json() : null))
    .then((d) => {
      const items = d && Array.isArray(d.items) ? d.items : [];
      if (!items.length) return;
      _lwLive = items;
      try { localStorage.setItem("m_glance_feed", JSON.stringify(d)); } catch { /* quota/private mode */ }
      // Anchor the top-bar countdown ring to the payload's assembly time — the
      // same signal Home sets — so the ring reads correctly on every page.
      try { localStorage.setItem("wire.live.anchor", String(Date.parse(d.asOf) || Date.now())); } catch { /* */ }
      try { window.dispatchEvent(new CustomEvent("wire:live-refresh")); } catch { /* */ }
      _lwSubs.forEach((s) => { try { s(items); } catch { /* subscriber error — isolate */ } });
    })
    .catch(() => { /* offline — the cached/curated content stands */ });
}

// ---- Formatting / sorting ---------------------------------------------------
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// The one day-header formatter — every wire's date breaks read "20 Jul 2026".
export const fmtDay = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ""); return m ? `${+m[3]} ${MON[+m[2] - 1]} ${m[1]}` : (iso || ""); };
export const dayOf = (x) => String(x.date || "").slice(0, 10);
// Newest-first by day then publish time; untimed items sort at midday to match
// their "12:00" display.
export const byFeedDesc = (a, b) => dayOf(b).localeCompare(dayOf(a)) || String(b.time || "12:00").localeCompare(String(a.time || "12:00"));
const norm = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
// Dedupe by normalised title (cross-section overlap collapses to one row).
export const dedupeByTitle = (list) => { const seen = new Set(); return list.filter((x) => { const k = norm(x.title); if (seen.has(k)) return false; seen.add(k); return true; }); };

// ---- Row + body markup ------------------------------------------------------
// One wire row. `o`: { desk, href, title, ext, date, time, src, sk, sid, mgr,
// firm }. Leads with the publish time when the item carries a REAL one; items
// with no known time lead with the headline (an empty time cell keeps the grid
// aligned) rather than a fabricated "12:00" that reads as a real noon publish.
// A coloured code chip, the headline, and — when present — the source as an
// in-place filter control (a span, not a link, so it doesn't trigger the row's
// link-to-article) follow.
export function feedRow(o) {
  const t = o.time || "";
  return `<a class="g-feed-row g-desk-${o.desk}" href="${esc(o.href)}"${o.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}`
    + ` data-sk="${esc(o.sk || "x")}"${o.sid ? ` data-sid="${esc(o.sid)}"` : ""}${o.mgr ? ` data-mgr="${esc(o.mgr)}"` : ""}${o.firm ? ` data-firm="${esc(o.firm)}"` : ""} data-desk="${esc(o.desk)}" data-date="${esc(o.date || "")}" data-time="${esc(o.time || "")}">`
    + `<span class="g-feed-time">${esc(t)}</span>`
    + `<span class="g-feed-code ${DESK_CLASS[o.desk] || ""}" title="${esc(DESK[o.desk] || "")}">${DESK_CODE[o.desk] || ""}</span>`
    + `<span class="g-feed-title">${esc(o.title)}</span>`
    + (o.src ? `<span class="g-feed-src" role="button" tabindex="0" data-src="${esc(o.src)}" title="Show all ${esc(o.src)} stories">${esc(o.src)}</span>` : "")
    + `<span class="g-feed-desk">${esc(DESK[o.desk] || "")}</span></a>`;
}
// The day-grouped body: rows newest→oldest, each new day introduced by a date
// header, closed by a quiet end-marker.
export function feedBodyHTML(feed) {
  const rows = feed.slice().sort(byFeedDesc);
  let lastDay = null;
  return rows.map((o) => {
    const d = dayOf(o);
    const hdr = d !== lastDay ? `<div class="g-feed-dayhdr">${esc(fmtDay(d))}</div>` : "";
    lastDay = d;
    return hdr + feedRow(o);
  }).join("") + `<div class="g-feed-end">· end of wire ·</div>`;
}
// The chip bar (a label + a row of desk filters). `chips`: [{k,label}].
export function feedChipsHTML(chips, activeK, label = "Latest news") {
  const chip = (k, l) => `<button type="button" class="g-feed-chip${activeK === k ? " is-on" : ""}" data-desk="${esc(k)}" aria-pressed="${activeK === k}">${esc(l)}</button>`;
  return `<span class="g-feed-h-lbl">${esc(label)}</span>`
    + `<span class="g-feed-chips" role="group" aria-label="Filter by desk">${chips.map((c) => chip(c.k, c.label)).join("")}</span>`;
}
// The active-source bar above the wire, with a one-click clear.
export function feedSrcBarHTML(src) {
  return `<div class="g-feed-srcbar">Source · <strong>${esc(src)}</strong><button type="button" class="g-feed-srcclear" data-clearsrc="1" aria-label="Clear source filter — show all sources">✕ clear</button></div>`;
}
export function feedEmptyHTML(msg) { return `<div class="g-empty">${esc(msg)}</div>`; }

// ---- Interaction ------------------------------------------------------------
// One delegated handler for the in-row controls that must NOT trigger the row's
// link-to-article: the source name (filter by that newsroom), the clear pill,
// and (optional) entity chips. Idempotent per element.
export function attachFeedClicks(feedEl, { onSrc, onClearSrc, onEnt } = {}) {
  if (!feedEl || feedEl._wfWired) return;
  feedEl._wfWired = true;
  const handle = (e) => {
    const ent = e.target.closest(".g-feed-ent");
    if (ent && onEnt) { e.preventDefault(); e.stopPropagation(); onEnt(ent); return; }
    const src = e.target.closest(".g-feed-src");
    if (src) { e.preventDefault(); e.stopPropagation(); if (onSrc) onSrc(src.dataset.src); return; }
    const clr = e.target.closest("[data-clearsrc]");
    if (clr) { e.preventDefault(); e.stopPropagation(); if (onClearSrc) onClearSrc(); }
  };
  feedEl.addEventListener("click", handle);
  feedEl.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") handle(e); });
}

// ---- App feed controller ----------------------------------------------------
// A self-contained wire for the app pages: builds the desk-chip bar, renders the
// day-grouped rows, and filters in place by desk (chip) or source (row click) —
// exactly like the Home wire. Home keeps its bespoke cross-desk assembly and
// calls the low-level helpers above directly; the apps use this.
//
// opts:
//   feedEl    — the .g-feed container (rows render here)
//   headEl    — the .g-feed-head container (chip bar renders here); optional
//   headLabel — the chip-bar label ("Latest news")
//   chips     — [{k,label}] ; k="all" plus desk/group keys
//   buildItems— () => [normalised items]  (rebuilt each render, so live data flows)
//   groupOf   — (item) => chip-key the item belongs to (default: item.desk)
//   defaultDesk — starting chip ("all")
//   emptyLabel  — (deskKey|null, srcName|null) => empty-state text
//   onChip    — (k) => truthy to intercept a chip (e.g. swap to a non-feed pane);
//               the controller then skips its own render for that chip.
export function createFeed(opts) {
  const groupOf = opts.groupOf || ((x) => x.desk);
  let deskFilter = opts.defaultDesk || "all";
  let srcFilter = null;

  const emptyMsg = () => {
    if (opts.emptyLabel) return opts.emptyLabel(srcFilter ? null : (deskFilter === "all" ? null : deskFilter), srcFilter);
    if (srcFilter) return `No ${srcFilter} stories — check back shortly.`;
    if (deskFilter === "all") return "No news yet — check back shortly.";
    return `No ${DESK[deskFilter] || "matching"} items — check back shortly.`;
  };

  function currentFeed() {
    const all = opts.buildItems() || [];
    if (srcFilter) return dedupeByTitle(all.slice().sort(byFeedDesc)).filter((x) => x.src === srcFilter);
    if (deskFilter === "all") return dedupeByTitle(all.slice().sort(byFeedDesc));
    return dedupeByTitle(all.filter((x) => groupOf(x) === deskFilter).sort(byFeedDesc));
  }

  function paint() {
    const feed = currentFeed();
    const srcBar = srcFilter ? feedSrcBarHTML(srcFilter) : "";
    opts.feedEl.innerHTML = srcBar + (feed.length ? feedBodyHTML(feed) : feedEmptyHTML(emptyMsg()));
    if (opts.headEl) {
      opts.headEl.innerHTML = feedChipsHTML(opts.chips, srcFilter ? null : deskFilter, opts.headLabel);
      opts.headEl.querySelectorAll(".g-feed-chip").forEach((b) => b.addEventListener("click", () => {
        const k = b.dataset.desk;
        if (opts.onChip && opts.onChip(k)) return;   // pane-swap chip handled by the page
        srcFilter = null; deskFilter = k; paint();
      }));
    }
  }

  attachFeedClicks(opts.feedEl, {
    onSrc: (s) => { srcFilter = s; deskFilter = "all"; paint(); },
    onClearSrc: () => { srcFilter = null; paint(); },
    onEnt: opts.onEnt,
  });

  return {
    render: paint,
    get desk() { return deskFilter; },
    setDesk(k) { srcFilter = null; deskFilter = k; paint(); },
    clearSrc() { srcFilter = null; paint(); },
  };
}
