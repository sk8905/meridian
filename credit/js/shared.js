// =============================================================================
// credit/js/shared.js — helpers, shared state and row renderers used by BOTH the
// Credit app shell (app.js) and the detail-view module (detail.js). Pure/format
// functions + the watchlist/saved read layer + the paginated-feed and
// pending-focus machinery. Imports flow app.js -> detail.js -> shared.js (never
// backwards), so the module graph stays acyclic and the ?v= data token can't
// split data.js into two module instances.
// NOTE: app.js, detail.js and shared.js all import ./data.js (and app.js also
// ./charts.js) with the SAME ?v= token — keep them identical and bump together,
// or the browser loads data.js twice as separate module instances (blank page).
// =============================================================================
import { managers, managerById, lpById, commitments } from "./data.js?v=20260723-6";
import { esc, NEWS_SOURCES, srcHost, tidyDomain } from "/util.js?v=20260719-1";

// ----------------------------- formatting utils ----------------------------
export const eur = (m) => (m == null ? "Undisclosed" : "€" + (m >= 1000 ? (m / 1000).toFixed(m % 1000 === 0 ? 0 : 1) + "bn" : m + "m"));
export const pct = (n) => (n == null ? "Undisclosed" : Math.round(n) + "%");
export const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
// Format a €bn AUM figure: €Xtn above 1,000bn, €Xm below 1bn, else €Xbn.
export const fmtAum = (n) => {
  if (n == null) return "—";
  if (n >= 1000) return `€${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}tn`;
  if (n < 1) return `€${Math.round(n * 1000)}m`;
  return `€${n}bn`;
};

// ----------------------------- small render helpers -------------------------
export function link(href, text, cls = "") { return `<a href="${href}" class="${cls}">${esc(text)}</a>`; }

// Renders a record's source citations + as-of date, when present. No-ops otherwise.
export function sources(rec) {
  if (!rec || !rec.sources || !rec.sources.length) return "";
  const links = rec.sources.map((s, i) =>
    `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label || "source " + (i + 1))}</a>`
  ).join(" · ");
  const asOf = rec.asOf ? ` · <span>as of ${esc(rec.asOf)}</span>` : "";
  return `<div class="sources muted small"><span class="src-label">Sources:</span> ${links}${asOf}</div>`;
}

export function progressBar(raised, target) {
  const actual = Math.round((raised / target) * 100);
  const w = Math.min(100, actual);
  return `<div class="progress" title="${eur(raised)} of ${eur(target)} target">
    <div class="progress-fill" style="width:${w}%"></div>
    <span class="progress-label">${eur(raised)} / ${eur(target)} · ${actual}%</span>
  </div>`;
}

// Decides how to display a fund's fundraising state given real-world gaps:
// evergreen (no target), undisclosed target/raised, or a normal progress bar.
export function raiseDisplay(x) {
  if (x.evergreen) {
    return `<span class="fund-status">Evergreen</span>` +
      (x.raised != null ? ` <span class="muted small">~${eur(x.raised)} AUM/NAV</span>` : "");
  }
  if (x.raised != null && x.targetSize != null) return progressBar(x.raised, x.targetSize);
  if (x.raised != null) return `<span class="muted small">${eur(x.raised)} raised · target undisclosed</span>`;
  if (x.status === "Pre-marketing") return `<span class="muted small">Pre-marketing</span>`;
  return `<span class="muted small">Undisclosed</span>`;
}

// The date now ALWAYS occupies the leading meta column (where the type chip used
// to sit) on every feed row, on manager pages and feeds alike.
export const metaDate = (d) => `<span class="muted small">${d ? esc(fmtDate(d)) : ""}</span>`;

export function notFound(app) {
  app.innerHTML = `<div class="page-head"><h1>Not found</h1><p class="muted">That record doesn't exist. ${link("#/", "Back to dashboard")}.</p></div>`;
}

// --------------------------- watchlist (read layer) ------------------------
// Watchlist persists to a per-user Cloudflare KV store (see app.js) with
// localStorage as an instant cache / offline fallback. This module holds the
// live `follows` store + the read helpers the views use to render stars; the
// write/sync side (toggle, debounced push, cloud reconcile) lives in app.js.
export const FOLLOW_KEY = "meridian.follows";
export const FOLLOW_TYPES = ["manager", "fund", "lp"];
export function loadFollows() { try { return JSON.parse(localStorage.getItem(FOLLOW_KEY)) || {}; } catch { return {}; } }
export const follows = loadFollows();
export function followList(type) { return follows[type] || (follows[type] = []); }
export function isFollowed(type, id) { return followList(type).includes(id); }
export function followCount() { return FOLLOW_TYPES.reduce((n, t) => n + followList(t).length, 0); }
export function followBtn(type, id) {
  const on = isFollowed(type, id);
  return `<button type="button" class="follow-btn ${on ? "on" : ""}" data-follow="${type}:${id}" title="${on ? "Following — click to remove from watchlist" : "Add to your watchlist"}" aria-label="Follow">${on ? "★" : "☆"}</button>`;
}
// Star + name as two flex columns, so a wrapping name stays in its own column
// (and never slides back under the star).
export function nameCell(type, id, inner) {
  return `<span class="namecell">${followBtn(type, id)}<span class="namecell-text">${inner}</span></span>`;
}

// --------------------------- saved items (read layer) ----------------------
// Individually saved news / deal / fundraising / CLO items. This module holds
// the getter + the ★/☆ button + the stable content-derived id; the write/sync
// side (toggle, debounced push, cloud reconcile) lives in app.js.
export const SAVEDC_KEY = "meridian.credit.saved";
export function getSavedC() { try { return new Set(JSON.parse(localStorage.getItem(SAVEDC_KEY) || "[]")); } catch { return new Set(); } }
// Stable content-derived id for a news item — a short hash of its normalised URL
// (or title) + manager, so a saved news story keeps pointing at the same item
// across data refreshes (unlike the aggregation index used for row anchors).
export function newsSaveId(x) {
  const base = (x.url || x.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
  const s = base + "|" + (x._mid || x.managerId || "");
  let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  return "n" + (h >>> 0).toString(36);
}
// Save/unsave button — Wire Legal style. `id` is the item's stable save id.
export function saveBtn(id) {
  const on = getSavedC().has(id);
  return `<button type="button" class="save-btn ${on ? "is-saved" : ""}" data-save="${esc(id)}" aria-pressed="${on}" title="${on ? "Remove from saved" : "Save this item"}">${on ? "★ Saved" : "☆ Save"}</button>`;
}

// Human-readable source (outlet / wire / manager PR) for a notification/feed
// item, from its sourceUrl. Known wires & trade-press map to a clean label; an
// unmapped domain is taken to be the manager's own press release (show the
// manager name); otherwise a tidied domain. Kept in sync with Glance's copy.
export function creditSource(rec) {
  const host = srcHost(rec.sourceUrl);
  if (host && NEWS_SOURCES[host]) return NEWS_SOURCES[host];
  const m = rec.managerId ? managerById[rec.managerId] : null;
  if (m && m.name) return m.name;           // manager's own press release
  return host ? tidyDomain(host) : "";
}

// ----------------------- relationship lookups ------------------------------
export function commitmentsForLp(lpId) { return commitments.filter((c) => c.lpId === lpId); }
export function commitmentsForManager(managerId) { return commitments.filter((c) => c.managerId === managerId); }

// Actual, publicly-disclosed investors in a specific fund: combines the fund's
// own `investors` list with any fund-level entries in the commitments table.
// Deduped by name; LP-universe entries link through to the investor profile.
export function investorsForFund(f) {
  const out = [];
  const seen = new Set();
  const push = (name, lpId, note, url) => {
    const key = (name || "").toLowerCase();
    if (!name || seen.has(key)) return;
    seen.add(key);
    out.push({ name, lpId: lpId || null, note: note || "", url: url || null });
  };
  (f.investors || []).forEach((i) => push(i.name, i.lpId, i.note, i.url));
  commitments.filter((c) => c.fundId === f.id).forEach((c) => {
    const lp = lpById[c.lpId];
    push(lp ? lp.name : c.lpId, c.lpId, c.note, c.sourceUrl);
  });
  return out;
}

// ---- Feed pagination --------------------------------------------------------
// Long feeds render the first PAGE items with a "Load more" button that reveals
// the next PAGE. The shown count resets to PAGE whenever the filter signature
// for that feed changes (so a new search/filter starts from the top again).
export const PAGE = 25;
export const pageShown = {};
export const pageSig = {};
export function pageReset(key, sig) { if (pageSig[key] !== sig) { pageSig[key] = sig; pageShown[key] = PAGE; } }
export function pageCount(key) { return pageShown[key] || PAGE; }
export function loadMoreBtn(key, remaining) {
  if (remaining <= 0) return "";
  return `<div class="load-more-wrap"><button type="button" class="load-more" data-more="${esc(key)}">Load ${Math.min(PAGE, remaining)} more <span class="lm-rem">· ${remaining} remaining</span></button></div>`;
}
// Render a date-sorted list, inserting a day-break separator whenever the day
// changes from the previous item (a visual gap between each day's items).
// `labeled` → introduce each day with a dated header ("16 Jul 2026", uppercased
// in CSS), matching the home news feed; the news/commentary rows then lead with
// the time. Other feeds keep the plain centred day-rule.
export function withDayBreaks(items, rowFn, labeled) {
  let prevDay = null;
  return items.map((x) => {
    const day = String(x.date || "").slice(0, 10);
    const sep = labeled
      ? (day !== prevDay ? `<div class="day-hdr">${esc(fmtDate(day))}</div>` : "")
      : (prevDay !== null && day !== prevDay ? '<div class="day-sep" aria-hidden="true"></div>' : "");
    prevDay = day;
    return sep + rowFn(x);
  }).join("");
}
// Render a feed capped to the current page with a gentle per-day break between
// items, plus a Load-more button. (Rows carry their own date, so the break is a
// subtle divider rather than a heading.)
export function feedHtml(rows, key, rowFn, sig, labeled) {
  pageReset(key, sig);
  const shown = rows.slice(0, pageCount(key));
  return withDayBreaks(shown, rowFn, labeled) + loadMoreBtn(key, rows.length - shown.length);
}
// Flat paginated feed — no day-break separators (the row carries its own date).
export function feedFlat(rows, key, rowFn, sig) {
  pageReset(key, sig);
  const shown = rows.slice(0, pageCount(key));
  return shown.map(rowFn).join("") + loadMoreBtn(key, rows.length - shown.length);
}
// Cap a flat list/table to the current page; returns { shown, more } so the
// caller can render its own rows and drop the Load-more button after them.
export function pageList(rows, key, sig) {
  pageReset(key, sig);
  const shown = rows.slice(0, pageCount(key));
  return { shown, more: loadMoreBtn(key, rows.length - shown.length) };
}

// ---- In-page chip memory ----------------------------------------------------
// Keyed per chips-row AND current route: survives the async data-sync re-renders
// (which re-run the templates with the first chip hardcoded active) but NOT page
// loads or navigation. app.js prunes stale entries on hashchange.
export const _chipMem = {};
export const chipMemKey = (id) => id + "|" + location.hash;

// ---- Pending scroll-to focus ------------------------------------------------
// After navigating to a feed page via a dashboard headline (or a cross-app deep
// link), scroll to and briefly highlight the targeted item. `pendingFocus` is a
// live binding — app.js sets it via setPendingFocus; the one-shot / windowed
// clearing happens inside applyPendingFocus below.
export let pendingFocus = null;
export const setPendingFocus = (v) => { pendingFocus = v; };
export function applyPendingFocus(view) {
  if (!pendingFocus || pendingFocus.view !== view) return;
  const windowed = !!pendingFocus.until; // URL-driven (re-apply until it lapses)
  if (windowed && Date.now() > pendingFocus.until) { pendingFocus = null; return; }
  // Resolve by feed dedup key (news stories, which may render as a deal/intel
  // row) or by element id (structured deal/intel deep links).
  const el = pendingFocus.fkey
    ? [...document.querySelectorAll("[data-fkey]")].find((e) => e.getAttribute("data-fkey") === pendingFocus.fkey)
    : document.getElementById("row-" + pendingFocus.id);
  if (!windowed) pendingFocus = null; // click-set focus is one-shot (unchanged)
  if (!el) return; // row not in the DOM yet (paged out) — a windowed focus retries
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), 2200);
}

// ---- Feed dedup + shared row renderers --------------------------------------
// Dedup key for a manager's combined news feed: a specific source URL when one
// exists, else the normalized headline/title — so an event captured as both a
// press item and a structured deal/intel collapses to a single row. Generic
// landing URLs (a bare domain, /news, /press-releases, …) are ignored so they
// don't wrongly merge unrelated items that share the same landing page.
export function feedDedupKey(x) {
  const u = (x.url || x.sourceUrl || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
  const generic = !u || /^https?:\/\/[^/]+$/.test(u) || /\/(news-insights|news|press-releases|media|insights|press)$/.test(u);
  if (!generic) return "u:" + u;
  return "t:" + (x.title || x.headline || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

// The headline links straight to the source; the manager sits inline beside the
// headline (a link to its profile), consistently across every feed.
export function intelRow(i, mgr) {
  const m = i.managerId ? managerById[i.managerId] : null;
  const ftarget = i.fundId ? `#/fund/${i.fundId}` : (m ? `#/manager/${m.id}` : null);
  const tag = m ? link(`#/manager/${m.id}`, m.name, "muted small") : '<span class="muted small">Market-wide</span>';
  const head = i.sourceUrl
    ? `<a href="${esc(i.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="intel-head">${esc(i.headline)}</a>`
    : (ftarget ? link(ftarget, i.headline, "intel-head") : `<span class="intel-head">${esc(i.headline)}</span>`);
  return `<div class="intel-row" id="row-${i.id}" data-fkey="${esc(feedDedupKey(i))}">
    <div class="intel-meta">${metaDate(i.date)}</div>
    <div class="intel-body"><div class="intel-title-line">${head}${tag ? `<span class="intel-src-inline muted small">${tag}</span>` : ""}${saveBtn(i.id)}</div><p class="muted small">${esc(i.summary)}</p></div>
  </div>`;
}

// The headline links straight to the source; the manager sits inline beside the
// headline (a link to its profile), consistently across every feed.
export function dealRow(d, mgr) {
  const m = d.managerId ? managerById[d.managerId] : null;
  const tgt = d.fundId ? `#/fund/${d.fundId}` : (m ? `#/manager/${m.id}` : null);
  const tag = m ? link(`#/manager/${m.id}`, m.name, "muted small") : "";
  const head = d.sourceUrl
    ? `<a href="${esc(d.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="intel-head">${esc(d.headline)}</a>`
    : (tgt ? link(tgt, d.headline, "intel-head") : `<span class="intel-head">${esc(d.headline)}</span>`);
  return `<div class="intel-row" id="row-${d.id}" data-fkey="${esc(feedDedupKey(d))}">
    <div class="intel-meta">${metaDate(d.date)}</div>
    <div class="intel-body"><div class="intel-title-line">${head}${tag ? `<span class="intel-src-inline muted small">${tag}</span>` : ""}${saveBtn(d.id)}</div><p class="muted small">${esc(d.summary)}</p></div>
  </div>`;
}
