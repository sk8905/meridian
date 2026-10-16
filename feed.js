// =============================================================================
// feed.js — the ONE news-wire engine. The Home feed's row/day-header/chip/
// source-filter rendering, extracted so Macro, Credit and Legal render an
// identical wire (design, functionality, appearance). Content stays per-desk:
// each page assembles its own normalised items and desk vocabulary, then hands
// them to this engine, which owns the markup + interaction so every wire is the
// same build. Pure module — no page-specific imports; loaded site-absolute
// ("/feed.js") tokenless, like every other shared root module (T1/T2).
// =============================================================================
import { esc, MONTHS, fmtD, outletOf } from "/util.js";

// ---- Desk vocabulary --------------------------------------------------------
// A "desk" is the label a row carries. Home merges the cross-desk streams
// (news / macro / credit / legal / letters / FT / …); the apps add their own
// finer taxonomy (credit: deal/fund/clo/comm; legal: alert/case/scheme/rp).
// One shared map so the code chip, its colour class and the tooltip all agree
// wherever the wire is rendered.
// RATIONALISED to EIGHT domain labels (HOUSE_STYLE R10a): the pill names the item's DOMAIN,
// one of NEWS · MACRO · BONDS · CREDIT · LEGAL · HEDGE · RESEARCH · LETTER — never a granular
// sub-type (DEAL/RAISE/CLO/13F/ALERT/CASE/…) and never a SOURCE brand (Bloomberg/Economist/
// myFT/Substack/Brew), since the publication name already sits on the row. Every desk/type key
// maps up to its domain, so the three maps stay keyed by the same keys but collapse to 8
// values; the colour (DESK_CLASS → domClass) encodes the same 8 domains.
export const DESK = {
  news: "News", bbg: "News", econ: "News",
  m: "Macro", comm: "Macro",
  fi: "Bonds",
  c: "Credit", deal: "Credit", fund: "Credit", clo: "Credit",
  l: "Legal", alert: "Legal", case: "Legal", scheme: "Legal", rp: "Legal",
  hdg: "Hedge funds", hedge: "Hedge funds", f13: "Hedge funds",
  rsch: "Research",
  n: "Newsletter", f: "Newsletter", s: "Newsletter", b: "Newsletter",
};
// The visible pill text — ONE compact 3-LETTER code per domain so every pill fits
// the fixed 34px code column neatly (HOUSE_STYLE R10a). The full domain name lives in
// DESK (the tooltip). Eight codes, one per domain: NWS·MAC·BND·CRD·LAW·HDG·RSH·LTR.
export const DESK_CODE = {
  news: "NWS", bbg: "NWS", econ: "NWS",
  m: "MAC", comm: "MAC",
  fi: "BND",
  c: "CRD", deal: "CRD", fund: "CRD", clo: "CRD",
  l: "LAW", alert: "LAW", case: "LAW", scheme: "LAW", rp: "LAW",
  hdg: "HDG", hedge: "HDG", f13: "HDG",
  rsch: "RSH",
  n: "LTR", f: "LTR", s: "LTR", b: "LTR",
};
export const DESK_CLASS = {
  news: "news", bbg: "news", econ: "news",
  m: "macro", comm: "macro",
  fi: "fi",
  c: "credit", deal: "credit", fund: "credit", clo: "credit",
  l: "legal", alert: "legal", case: "legal", scheme: "legal", rp: "legal",
  hdg: "hdg", hedge: "hdg", f13: "hdg",
  rsch: "rsch",
  n: "newsletter", f: "newsletter", s: "newsletter", b: "newsletter",
};
// Domain (colour) for a type-desk — HOUSE_STYLE R10a: the pill's COLOUR encodes
// the domain (Credit/Hedge/Legal/…), its TEXT the type (DEAL/RAISE/13F/…). Only
// overrides are listed; a desk absent here colours by its own key. A per-item
// `dom` (set by the assembler) beats this map. Credit deals/raises/CLOs read the
// credit colour; legal alerts/cases/schemes/RPs read the legal colour; etc.
export const DESK_DOMAIN = {
  deal: "c", fund: "c", clo: "c",
  alert: "l", case: "l", scheme: "l", rp: "l",
  comm: "m", f13: "hdg",
};
export const domClass = (o) => DESK_CLASS[o.dom || DESK_DOMAIN[o.desk] || o.desk] || "";

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
// Newsletter classifier — EVERYTHING that arrived as a newsletter reads LTR.
// LTR takes precedence over MAC: a macro-flavoured newsletter is still a
// newsletter, so it keeps the LTR label rather than being reclassified MAC.
// Named premium sources (Bloomberg, The Economist) are fetched SEPARATELY as
// live wire stories and carry BBG/ECON there; myFT/Substack/Brew keep their own
// FT/SUBS/BREW codes via the live path — only the generic Gmail sweep is LTR here.
export const nlDesk = () => "n";
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
// The one day-header formatter — every wire's date breaks read "20 Jul 2026".
export const fmtDay = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ""); return m ? `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}` : (iso || ""); };
// A record's date at the precision its source supports (scripts/date-precision.mjs):
// datePrecision "year" → "2025", "month" → "Jan 2025", an estimated day → "c. 14 Jan
// 2025", otherwise the exact day. Never prints a placeholder "1 Jan" as a real date.
export const fmtDateP = (x) => {
  const d = String((x && x.date) || "");
  if (!d) return "";
  if (x.datePrecision === "year") return d.slice(0, 4);
  if (x.datePrecision === "month" && /^\d{4}-\d{2}/.test(d)) return `${MONTHS[+d.slice(5, 7) - 1]} ${d.slice(0, 4)}`;
  return (x.dateEstimated ? "c. " : "") + fmtD(d);
};
export const dayOf = (x) => String(x.date || "").slice(0, 10);
// Newest-first by day then publish time; untimed items sort at midday to match
// their "12:00" display.
export const byFeedDesc = (a, b) => dayOf(b).localeCompare(dayOf(a)) || String(b.time || "12:00").localeCompare(String(a.time || "12:00"));
const norm = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "");

// ---- Row + body markup ------------------------------------------------------
// One wire row. `o`: { desk, href, title, ext, date, time, src, sk, sid, mgr,
// firm }. Leads with the publish time when the item carries a REAL one; items
// with no known time lead with the headline (an empty time cell keeps the grid
// aligned) rather than a fabricated "12:00" that reads as a real noon publish.
// A coloured code chip, the headline, and — when present — the source as an
// in-place filter control (a span, not a link, so it doesn't trigger the row's
// link-to-article) follow.
// Trim a source to the outlet only for DISPLAY — drop "(via …)" republisher tags
// (e.g. "Reuters (via Japan Times)" → "Reuters") so the column reads as the
// newspaper/site. The raw value is kept as the filter key (data-src) so filtering
// is unaffected.
export const cleanSource = (s) => String(s || "").replace(/\s*\((?:via|from)\b[^)]*\)/gi, "").replace(/\s{2,}/g, " ").trim();
export function feedRow(o) {
  // An item whose source shows no exact publication date (o.est — e.g. a legal
  // insight dated from context) shows "≈" in the time cell instead of a clock time,
  // so its day placement never reads as an exact date.
  const t = o.est ? "≈" : (o.time || "");
  // Added-time (no source publish time) carries a tooltip so it isn't mistaken
  // for a real publish time.
  const timeAttr = o.est ? ` title="Approximate date — the source shows no exact publication date"`
    : o.added ? ` title="Added to Wire at ${esc(t)} — the source gave no publish time"` : "";
  // Badge key: most desks show their sub-type when present (credit → DEAL/FUND/CLO),
  // but the Hedge desk always badges HDG — its items carry a news/fund `type` only
  // to drive the sub-filter chips, and that must not override the desk code (else a
  // hedge story reads NEWS/RAISE instead of HDG).
  const codeKey = o.desk === "hdg" ? "hdg" : (o.type || o.desk);
  return `<a class="g-feed-row g-desk-${o.desk}" href="${esc(o.href)}"${o.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}${rowTip(o.title, o.src ? cleanSource(o.src) : "")}`
    + ` data-sk="${esc(o.sk || "x")}"${o.sid ? ` data-sid="${esc(o.sid)}"` : ""}${o.mgr ? ` data-mgr="${esc(o.mgr)}"` : ""}${o.firm ? ` data-firm="${esc(o.firm)}"` : ""} data-desk="${esc(o.desk)}" data-date="${esc(o.date || "")}" data-time="${esc(o.time || "")}">`
    + `<span class="g-feed-time${o.est ? " g-feed-time-est" : o.added ? " g-feed-time-added" : ""}"${timeAttr}>${esc(t)}</span>`
    + `<span class="g-feed-code ${domClass(o)}" title="${esc(DESK[codeKey] || "")}">${DESK_CODE[codeKey] || ""}</span>`
    + `<span class="g-feed-title">${esc(o.title)}</span>`
    + (o.src ? `<span class="g-feed-src" role="button" tabindex="0" data-src="${esc(o.src)}" title="Show all ${esc(cleanSource(o.src))} stories">${esc(cleanSource(o.src))}</span>` : "")
    + `<span class="g-feed-desk">${esc(DESK[codeKey] || "")}</span></a>`;
}
// ---- R43: THE events row ----------------------------------------------------
// One row for every dated list outside the wire (deals, alerts, cases, plans &
// schemes, hearings, fund closes, LP commitments, people moves, digest rows):
//   date · headline / meta · tag · source
// `title` is plain text (escaped here); `meta` and `tag` are trusted HTML the caller
// built with esc(); `src` is the outlet name (plain text) and `srcHref` its URL — a
// row with a URL but no outlet name gets the SRC chip. The full text rides in the
// row's title attribute (hover / long-press); one fixed height (--ev-h) per list.
const _plain = (h) => String(h || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
// R43c: a list row is two single, ellipsised lines — its FULL text rides in the row's
// title (hover / long-press). ` title="headline · meta · source"` from plain or HTML parts.
export function rowTip(...parts) {
  const t = parts.map(_plain).filter(Boolean).join(" · ");
  return t ? ` title="${esc(t)}"` : "";
}
export function evRow({ date = "", dateText = "", est = false, title = "", href = "", inApp = false, meta = "", tag = "", src = "", srcHref = "", cls = "", aCls = "", dCls = "", attrs = "", tip = "" } = {}) {
  const d = dateText || (date ? fmtD(date) : "");
  const full = tip || [title, _plain(meta), _plain(tag), src].filter(Boolean).join(" · ");
  const a = href
    ? `<a class="g-ev-t${aCls ? ` ${aCls}` : ""}" href="${esc(href)}"${inApp ? "" : ' target="_blank" rel="noopener noreferrer"'}>${esc(title)}</a>`
    : `<span class="g-ev-t${aCls ? ` ${aCls}` : ""}">${esc(title)}</span>`;
  // No outlet given → name it from the source URL (or the external row link).
  if (!src && (srcHref || (href && !inApp && /^https?:/.test(href)))) src = outletOf(srcHref || href);
  const s = src
    ? (srcHref ? `<a href="${esc(srcHref)}" target="_blank" rel="noopener noreferrer">${esc(src)}</a>` : esc(src))
    : (srcHref ? `<a class="dsh-src" href="${esc(srcHref)}" target="_blank" rel="noopener noreferrer" title="Source">src</a>` : "");
  return `<li class="g-ev${cls ? ` ${cls}` : ""}" title="${esc(full)}"${attrs}>`
    + `<span class="c-date${dCls ? ` ${dCls}` : ""}"${est ? ' title="Approximate date — the source shows no exact publication date"' : ""}>${est && d ? "c. " : ""}${esc(d)}</span>`
    + a + `<span class="c-tag">${tag}</span><span class="c-src">${s}</span>`
    + `<span class="g-ev-m">${meta}</span></li>`;
}
// ---- R43: THE table column roles -------------------------------------------------
// Tags every table cell with its column role so ONE stylesheet (feed.css) sizes every
// table the same way: .c-date (fixed, narrow, faint) · .c-num (right, tabular, sized to
// content) · .c-src (fixed, narrow, faint, last) · .c-tag · .c-text (shares the rest,
// min / max, ellipsis). A role set in the markup wins; otherwise it is read from the
// header label and the column's own cells. Idempotent (re-run after any re-render).
// A chart-table (bars / heat cells laid out as a table) opts out with data-cols="off".
const _DATE_TXT = /^(c\. |≈ ?)?(\d{1,2} [A-Z][a-z]{2}( \d{2,4})?|[A-Z][a-z]{2} \d{4}|Q[1-4] \d{4}|\d{4}-\d{2}(-\d{2})?|TBC|—)$/;
const _NUM_TXT = /^[-+−▲▼·]?\s*[€$£]?\s*[-+−]?[\d.,]+\s*(%|bp|bn|m|tn|x|pp|pt)?(\s*\(.*\))?$|^—$|^n\/a$/i;
const _ROLE = /\bc-(date|num|text|tag|src)\b/;
const _colRoots = new Set();
let _colRaf = 0;
// Re-read layout (auto / fixed / stacked) of every tagged root when the width crosses a
// breakpoint — one rAF-throttled listener, registered once (T17), not a self-call.
function _reflowCols() { if (!_colRaf) _colRaf = requestAnimationFrame(() => { _colRaf = 0; _colRoots.forEach(_tagCols); }); }
export function tableCols(root) {
  if (!root || !root.querySelectorAll) return;
  if (!_colRoots.size && typeof window !== "undefined") window.addEventListener("resize", _reflowCols);
  _colRoots.add(root);
  _tagCols(root);
}
function _tagCols(root) {
  root.querySelectorAll("table:not([data-cols='off'])").forEach((t) => {
    const head = t.tHead && t.tHead.rows[0] ? [...t.tHead.rows[0].cells] : [];
    if (head.some((c) => c.colSpan > 1)) return;
    // Width roles apply to auto-layout tables; a fixed-layout table keeps its own
    // column shares (data-cols="fixed") and takes only the alignment / colour roles.
    // A table that CSS restacks into card rows on a phone (cells no longer table cells)
    // takes no column widths at all (data-cols="stacked").
    const fixed = getComputedStyle(t).tableLayout === "fixed";
    const c0 = t.tBodies[0] && t.tBodies[0].rows[0] && t.tBodies[0].rows[0].cells[0];
    const stacked = !!c0 && getComputedStyle(c0).display !== "table-cell";
    t.dataset.cols = stacked ? "stacked" : fixed ? "fixed" : "auto";
    const rows = [...t.tBodies].flatMap((b) => [...b.rows]).filter((r) => ![...r.cells].some((c) => c.colSpan > 1));
    const n = Math.max(head.length, ...rows.slice(0, 8).map((r) => r.cells.length), 0);
    const textW = [];
    for (let i = 0; i < n; i++) {
      const h = head[i]; const cells = rows.map((r) => r.cells[i]).filter(Boolean);
      const all = [h, ...cells].filter(Boolean);
      const set = all.find((c) => _ROLE.test(c.className));
      let role = set ? set.className.match(_ROLE)[0] : null;
      if (!role) {
        const lab = h ? h.textContent.replace(/\s+/g, " ").trim() : "";
        const txt = cells.map((c) => c.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
        const srcOnly = cells.length && cells.every((c) => !c.textContent.replace(/src/i, "").trim() && (c.querySelector("a.dsh-src") || !c.textContent.trim()));
        if ((h && h.classList.contains("dsh-srccol")) || /^(src|source)$/i.test(lab) || srcOnly) role = "c-src";
        else if (/^(date|as of|latest|updated|when|closed|announced|period|timing)$/i.test(lab) || (txt.length && txt.every((x) => _DATE_TXT.test(x)) && txt.some((x) => /\d/.test(x)))) role = "c-date";
        else if ((h && h.classList.contains("dsh-r")) || (txt.length && txt.every((x) => _NUM_TXT.test(x)))) role = "c-num";
        else role = "c-text";
      }
      all.forEach((c) => c.classList.add(role));
      // A truncating cell keeps its full text on hover / long-press (R43c).
      if (role === "c-text") {
        cells.forEach((c) => { if (!c.title) { const t = c.textContent.replace(/\s+/g, " ").trim(); if (t) c.title = t; } });
        // Weight = the column's typical (80th-percentile) text length, clamped 6–36ch, so
        // text columns share the remaining width in proportion to what they hold.
        const lens = cells.map((c) => c.textContent.replace(/\s+/g, " ").trim().length).sort((x, y) => x - y);
        const p80 = lens.length ? lens[Math.min(lens.length - 1, Math.floor(lens.length * 0.8))] : 8;
        textW.push([h || (rows[0] && rows[0].cells[i]), Math.max(6, Math.min(36, p80, 36)), Math.max(6, (h ? h.textContent.trim().length : 0))]);
      }
    }
    const sum = fixed || stacked ? 0 : textW.reduce((a, [, w]) => a + w, 0);
    textW.forEach(([c, w]) => { if (c) c.style.width = sum ? `${Math.round((w / sum) * 96)}%` : ""; });
  });
}
export const evList = (rows, cls = "") => `<ul class="g-evs${cls ? ` ${cls}` : ""}">${rows.join("")}</ul>`;
// Some rows carry no real publish time (curated items, or a live item whose
// source omitted one). Rather than leave the time blank, stamp each with the
// moment it was FIRST SEEN on this device — its "added to Wire" time — persisted
// in localStorage so the stamp holds across renders and sessions. Keyed by
// normalised title; pruned to the newest ~1500 so the store stays bounded.
const FIRSTSEEN_KEY = "wire.firstseen";
const loadFirstSeen = () => { try { return JSON.parse(localStorage.getItem(FIRSTSEEN_KEY) || "{}") || {}; } catch { return {}; } };
const londonHM = (ms) => {
  try {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
    return `${p.hour === "24" ? "00" : p.hour}:${p.minute}`;
  } catch { return ""; }
};
export function stampAddedTimes(items) {
  const map = loadFirstSeen();
  let dirty = false;
  const now = Date.now();
  for (const o of items) {
    if (o.time || o.est) continue;
    const k = norm(o.title);
    if (!k) continue;
    if (!map[k]) { map[k] = now; dirty = true; }
    o.time = londonHM(map[k]);
    o.added = true;   // flags the time as "added to app", not a publish time
  }
  if (dirty) {
    try {
      const keys = Object.keys(map);
      const out = keys.length > 1500
        ? Object.fromEntries(keys.map((k) => [k, map[k]]).sort((a, b) => b[1] - a[1]).slice(0, 1500))
        : map;
      localStorage.setItem(FIRSTSEEN_KEY, JSON.stringify(out));
    } catch { /* quota/private mode — the in-memory stamps still render */ }
  }
  return items;
}
// ---- Code legend ("?") ------------------------------------------------------
// Plain-language key to every code chip this engine renders (DESK_CODE — the eight
// domain codes) plus the two time-cell marks. Rendered as a native <details>
// disclosure (no JS, keyboard-accessible) at the right of the FIRST day header of
// every wire, so each surface that uses the engine gets it for free.
const LEGEND_CODES = [
  ["NWS", "news", "General news — wires and newspapers"],
  ["MAC", "macro", "Macro — central banks, rates, inflation, growth"],
  ["BND", "fi", "Bonds — fixed-income markets"],
  ["CRD", "credit", "Credit — private-credit deals, fundraising, CLOs"],
  ["LAW", "legal", "Legal — law-firm alerts, cases, schemes and plans"],
  ["HDG", "hdg", "Hedge funds — fund news and 13F filings"],
  ["RSH", "rsch", "Research — bank, rating-agency and manager research"],
  ["LTR", "newsletter", "Newsletter — email newsletters and columns"],
];
// The manager-event rows Home merges into its wire (v2/js/manager-signals.js
// CAT_LABEL pills, coloured by their cat-* class) — keyed by the same category ids.
const LEGEND_MGR = [
  ["RAISE", "fundraising", "Fundraising — launches, first and final closes"],
  ["DEAL", "deal", "A loan or investment by the manager"],
  ["FIN", "financing", "Financing, refinancing or fund finance"],
  ["M&A", "m&a", "Acquisition or change of ownership"],
  ["EXIT", "exit", "A disposal or exit"],
  ["RX", "restructuring", "Restructuring or distress"],
  ["CLO", "clo", "CLOs and structured credit"],
  ["TEAM", "team", "Hires, departures and promotions"],
  ["STRAT", "strategy", "Strategy, results and firm news"],
  ["MAND", "mandate", "An investor mandate"],
  ["NEWS", "news", "Other press coverage of the manager"],
];
// What the wire's codes mean — shown on Menu ▸ Sources (owner 2026-10-15: no "?" on the
// wire itself). opts.managers also explains the manager-event pills (Home's merged wire).
export function feedCodesHTML(opts = {}) {
  const row = (c, cls, t) => `<dt class="g-feed-code ${cls}">${esc(c)}</dt><dd>${esc(t)}</dd>`;
  return `<div class="g-feed-codes"><h4>Source codes</h4><dl>`
    + LEGEND_CODES.map(([c, cls, t]) => row(c, cls, t)).join("")
    + `</dl>`
    + (opts.managers ? `<h4>Manager events</h4><dl>` + LEGEND_MGR.map(([c, k, t]) => row(c, "cat-" + k.replace(/&/g, ""), t)).join("") + `</dl>` : "")
    + `<h4>Time column</h4><dl>`
    + `<dt class="g-feed-legend-t">≈</dt><dd>Approximate date — the source gives no exact publication date</dd>`
    + `<dt class="g-feed-legend-t">09:15</dt><dd>Publish time; where the source gives none, the time the story was added to Wire</dd>`
    + `</dl></div>`;
}
// The day-grouped body: rows newest→oldest, each new day introduced by a date
// header, closed by a quiet end-marker.
export function feedBodyHTML(feed) {
  const rows = stampAddedTimes(feed.slice()).sort(byFeedDesc);
  let lastDay = null;
  return rows.map((o, i) => {
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
  return `<div class="g-feed-srcbar">Source · <strong>${esc(cleanSource(src))}</strong><button type="button" class="g-feed-srcclear" data-clearsrc="1" aria-label="Clear source filter — show all sources">✕ clear</button></div>`;
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

