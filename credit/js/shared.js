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
import { managers, managerById, lpById, commitments, AUM_FX } from "./data.js";
import { esc, NEWS_SOURCES, srcHost, tidyDomain, isOwnSite, fmtD } from "/util.js";

// ----------------------------- formatting utils ----------------------------
export const eur = (m) => (m == null ? "Undisclosed" : "€" + (m >= 1000 ? (m / 1000).toFixed(m % 1000 === 0 ? 0 : 1) + "bn" : m + "m"));
// A fund-size figure ($m-style units, i.e. millions) in the record's OWN currency
// (`ccy`, ISO code); falls back to the historic € convention when unset.
const CCY_SIGN = { EUR: "€", USD: "$", GBP: "£", CAD: "C$", AUD: "A$", CHF: "CHF ", SEK: "SEK " };
export const money = (m, ccy) => (m == null ? "Undisclosed" : (CCY_SIGN[ccy] || (ccy ? ccy + " " : "€")) + (m >= 1000 ? (m / 1000).toFixed(m % 1000 === 0 ? 0 : 1) + "bn" : m + "m"));
export const pct = (n) => (n == null ? "Undisclosed" : Math.round(n) + "%");
// "1 Oct 26" (R43b, via util fmtD). Fixed English month abbreviations (toLocaleDateString printed
// "Sept" on some engines, which overflowed the date column). Pass the RECORD (not its
// date) to honour datePrecision / dateEstimated: "2025" · "Jan 2025" · "c. 14 Jan 2025".
const _MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const fmtDate = (d) => {
  if (d && typeof d === "object" && !(d instanceof Date)) {
    const s = String(d.date || "");
    if (d.datePrecision === "year") return s.slice(0, 4);
    if (d.datePrecision === "month" && /^\d{4}-\d{2}/.test(s)) return `${_MON[+s.slice(5, 7) - 1]} ${s.slice(0, 4)}`;
    return (d.dateEstimated ? "c. " : "") + fmtDate(s);
  }
  return fmtD(d instanceof Date ? d.toISOString() : d);
};
// Format a $bn AUM figure: $Xtn above 1,000bn, $Xm below 1bn, else $Xbn.
export const fmtAum = (n) => {
  if (n == null) return "—";
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}tn`;
  if (n < 1) return `$${Math.round(n * 1000)}m`;
  return `$${n}bn`;
};

// AUM is stored in USD bn across the whole roster (R29). Legacy €/£ figures were
// restated once at the ECB reference rates in AUM_FX (credit/js/data.js); the record's
// `aumFrom` names the fields restated and their original currency, so the tooltip can
// say so.
// ONE money format for every list/profile figure (R2d): 3 significant figures, no
// padded zeros — $228bn · $13.4bn · $8.95bn · $2.9bn · $1.1tn · $450m. Managers, hedge
// funds, investors and law firms all print through this, so a column never mixes
// "$227.60bn" with "$14bn".
export const fmtBn = (n, ccy = "$") => {
  if (n == null || !isFinite(n)) return "—";
  const trim = (x, dp) => String(+x.toFixed(dp));
  if (n >= 1000) return `${ccy}${trim(n / 1000, n >= 10000 ? 1 : 2)}tn`;
  if (n < 1) return `${ccy}${Math.round(n * 1000)}m`;
  return `${ccy}${trim(n, n >= 100 ? 0 : n >= 10 ? 1 : 2)}bn`;
};
export const fmtAumC = (n, ccy = "$") => fmtBn(n, ccy);
// "$9.4bn · restated from €8.4bn at ECB 13 Oct 2026" style provenance for a tooltip.
export function aumNote(rec, field, fx) {
  const from = rec && rec.aumFrom && rec.aumFrom[field];
  if (!from || !fx) return "";
  const r = from === "GBP" ? fx.GBPUSD : fx.EURUSD;
  const orig = rec[field] != null && r ? rec[field] / r : null;
  return `restated from ${from === "GBP" ? "£" : "€"}${orig != null ? (orig >= 100 ? Math.round(orig) : orig.toFixed(1)) + "bn" : ""} at the ECB reference rate (${fx.asOf})`;
}
// ---- Currency honesty (owner review R4) --------------------------------------------
// A figure reads in its NATIVE currency with the USD equivalent in brackets —
// "€53.5bn ($59.9bn)" — wherever the record evidences the native currency; where it
// doesn't, USD only. Manager / investor AUM is STORED in USD (R29) and `aumFrom` names
// the fields that were restated from €/£ — the native figure is recovered at the same
// ECB reference rate (AUM_FX) the restatement used, so the pair is exactly the reported
// figure and its stored USD equivalent. Fund sizes are stored as reported in `ccy`.
const FX_SIGN = { EUR: "€", GBP: "£", USD: "$" };
export const fxToUsd = (ccy) => (ccy === "USD" ? 1 : ccy === "EUR" ? AUM_FX.EURUSD : ccy === "GBP" ? AUM_FX.GBPUSD : null);
// { usd: $bn number|null, native: "€53.5bn"|null, text: "€53.5bn ($59.9bn)"|"$59.9bn"|"—" }
export function aumParts(rec, field) {
  const usd = rec && rec[field] != null && isFinite(rec[field]) ? Number(rec[field]) : null;
  if (usd == null) return { usd: null, native: null, text: "—" };
  const from = rec.aumFrom && rec.aumFrom[field];
  const r = from && from !== "USD" ? fxToUsd(from) : null;
  const native = r ? fmtBn(usd / r, FX_SIGN[from]) : null;
  return { usd, native, text: native ? `${native} (${fmtBn(usd)})` : fmtBn(usd) };
}
export const fmtAumDual = (rec, field) => aumParts(rec, field).text;
// The same, as markup: the native figure leads, the USD equivalent is the muted bracket.
export function aumDualHTML(rec, field) {
  const p = aumParts(rec, field);
  return p.native ? `<span class="ccy-dual"><span class="ccy-nat">${p.native}</span> <span class="ccy-usd">(${fmtBn(p.usd)})</span></span>` : p.text;
}
// A fund-size figure (millions, in the fund's own `ccy`): native with USD in brackets
// for €/£ funds, USD alone for $ funds, native alone for a currency with no reference
// rate (CAD/CHF/SEK…). Without a `ccy` the figure keeps the historic money() label.
export function fundMoney(m, ccy) {
  if (m == null) return "Undisclosed";
  if (!ccy) return money(m, ccy);
  const bn = m / 1000;
  if (ccy === "USD") return fmtBn(bn);
  const r = fxToUsd(ccy);
  const sign = FX_SIGN[ccy] || CCY_SIGN[ccy] || ccy + " ";
  return r ? `${fmtBn(bn, sign)} (${fmtBn(bn * r)})` : fmtBn(bn, sign);
}
// A USD amount in $m (LP tickets).
export const usdM = (m) => (m == null ? "Undisclosed" : "$" + (m >= 1000 ? (m / 1000).toFixed(m % 1000 === 0 ? 0 : 1) + "bn" : m + "m"));

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
  app.innerHTML = `<div class="page-head"><h1>Not found</h1><p class="muted">That record doesn't exist. ${link("#/", "Back to the list")}.</p></div>`;
}

// --------------------------- watchlist (read layer) ------------------------
// Watchlist persists to a per-user Cloudflare KV store (see app.js) with
// localStorage as an instant cache / offline fallback. This module holds the
// live `follows` store + the read helpers the views use to render stars; the
// write/sync side (toggleFollow / syncFollows) lives just below — one implementation.
export const FOLLOW_KEY = "meridian.follows";
export const FOLLOW_TYPES = ["manager", "fund", "lp", "hf", "firm"];
export function loadFollows() { try { return JSON.parse(localStorage.getItem(FOLLOW_KEY)) || {}; } catch { return {}; } }
export const follows = loadFollows();
export function followList(type) { return follows[type] || (follows[type] = []); }
export function isFollowed(type, id) { return followList(type).includes(id); }
export function followCount() { return FOLLOW_TYPES.reduce((n, t) => n + followList(t).length, 0); }

// --------------------------- watchlist (write + sync — the ONE implementation) ---
// Every follow/unfollow in the app goes through toggleFollow, and every cloud
// reconcile through syncFollows, so the device copy (localStorage) and the per-user
// cloud copy (/api/watchlist) can't drift. Merge rule: UNION of device + cloud,
// minus this device's explicit unfollows ("tombstones"), so a follow made on another
// device is kept while an unfollow made here is never resurrected by the next sync.
const UNFOLLOW_KEY = "meridian.unfollowed";
const WATCHLIST_API = "/api/watchlist";
const readJSON = (k) => { try { return JSON.parse(localStorage.getItem(k) || "{}") || {}; } catch { return {}; } };
const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota / private mode */ } };
function persistFollows() { writeJSON(FOLLOW_KEY, follows); }
function mergeServer(server) {
  const tomb = readJSON(UNFOLLOW_KEY);
  let changed = false, needPush = false;
  for (const t of FOLLOW_TYPES) {
    const dead = new Set(Array.isArray(tomb[t]) ? tomb[t] : []);
    const local = followList(t), sv = Array.isArray(server[t]) ? server[t] : [];
    for (const x of sv) if (!dead.has(x) && !local.includes(x)) { local.push(x); changed = true; }
    if (local.some((x) => !sv.includes(x)) || sv.some((x) => dead.has(x))) needPush = true;
  }
  if (changed) persistFollows();
  return { changed, needPush };
}
function putFollows() {
  const body = {}; FOLLOW_TYPES.forEach((t) => (body[t] = followList(t).slice()));
  return fetch(WATCHLIST_API, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
    .then((r) => { if (r && r.ok) writeJSON(UNFOLLOW_KEY, {}); })   // cloud now reflects the unfollows
    .catch(() => {});
}
// Pull the cloud copy, merge it in, and push back anything the cloud is missing.
// Resolves { ok, changed } — ok=false when the API isn't reachable (offline /
// static hosting / signed out), in which case the device copy stands.
export function syncFollows() {
  return fetch(WATCHLIST_API, { headers: { accept: "application/json" } })
    .then((r) => (r && r.ok ? r.json() : null))
    .then((d) => {
      if (!d) return { ok: false, changed: false, email: null };
      const { changed, needPush } = mergeServer(d.watchlist || {});
      if (needPush) putFollows();
      return { ok: true, changed, email: d.email || null };
    })
    .catch(() => ({ ok: false, changed: false, email: null }));
}
// Follow ⇄ unfollow one entity; returns the new state (true = now following).
export function toggleFollow(type, id) {
  const a = followList(type), i = a.indexOf(id), added = i < 0;
  const tomb = readJSON(UNFOLLOW_KEY), dead = new Set(Array.isArray(tomb[type]) ? tomb[type] : []);
  if (added) { a.push(id); dead.delete(id); } else { a.splice(i, 1); dead.add(id); }
  tomb[type] = [...dead]; writeJSON(UNFOLLOW_KEY, tomb);
  persistFollows();
  try { window.dispatchEvent(new CustomEvent("watchlist:changed", { detail: { type, id, added } })); } catch { /* ignore */ }
  syncFollows();   // merge with the cloud, then push the result
  return added;
}
export function followBtn(type, id) {
  const on = isFollowed(type, id);
  return `<button type="button" class="follow-btn ${on ? "on" : ""}" data-follow="${type}:${id}" title="${on ? "Following — click to remove from watchlist" : "Add to your watchlist"}" aria-label="Follow">${on ? "★" : "☆"}</button>`;
}
// Star + name as two flex columns, so a wrapping name stays in its own column
// (and never slides back under the star).
export function nameCell(type, id, inner) {
  return `<span class="namecell">${followBtn(type, id)}<span class="namecell-text">${inner}</span></span>`;
}

// Human-readable source (outlet / wire / manager PR) for a notification/feed
// item, from its sourceUrl. Known wires & trade-press map to a clean label; an
// unmapped domain is taken to be the manager's own press release (show the
// manager name); otherwise a tidied domain. Kept in sync with Glance's copy.
export function creditSource(rec) {
  const host = srcHost(rec.sourceUrl);
  if (host && NEWS_SOURCES[host]) return NEWS_SOURCES[host];
  const m = rec.managerId ? managerById[rec.managerId] : null;
  if (m && m.name && isOwnSite(host, m.name)) return m.name;   // the manager's own press page
  return host ? tidyDomain(host) : "";      // any other outlet — never the manager's name
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
    <div class="intel-body"><div class="intel-title-line">${head}${tag ? `<span class="intel-src-inline muted small">${tag}</span>` : ""}</div><p class="muted small">${esc(i.summary)}</p></div>
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
    <div class="intel-body"><div class="intel-title-line">${head}${tag ? `<span class="intel-src-inline muted small">${tag}</span>` : ""}</div><p class="muted small">${esc(d.summary)}</p></div>
  </div>`;
}
