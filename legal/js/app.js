// =============================================================================
// Wire Legal — hash-based router + all views. Renders each view by building an
// HTML string and assigning it to #app.innerHTML. Zero dependencies.
//
// Routes:  #/                dashboard
//          #/list            all updates (multi-select filters + search)
//          #/list?area=…     list pre-filtered (also ?saved=1, ?q=…, ?tier=…)
//          #/item/<id>       single alert detail
//
// Per-user state: saved items sync across devices via the /api/saved Worker/KV
// endpoint when behind Cloudflare Access (see the "Saved state" block below),
// with localStorage as an instant cache / offline fallback. The last-visit and
// notification-seen markers stay device-local in localStorage.
// =============================================================================

import {
  items, cases, caseSummaries, practiceAreas, firms, tiers, updateTypes, restructurings,
  firmById, areaById, typeById, tierById, LAST_REVIEWED, LAST_CHECKED, LAST_CHECKED_TIME,
  rxAdvisers,
} from "./data.js?v=20260724-2";
import { donutChart, columnChart } from "./charts.js?v=20260724-2";
// The view code splits across three modules with an ACYCLIC import graph —
// app.js -> detail.js -> shared.js. shared.js holds the date formatters, the
// saved-items read layer, the "new since last visit" marker and the alert
// feed-row renderer; detail.js holds the single-alert + firm-profile views;
// this shell keeps the dashboard/list views, the saved write/sync layer, the
// notifications and the router. All three import ./data.js with the SAME ?v=
// token above — bump together or data.js loads twice as separate instances.
import {
  fmtDate, itemDate, itemRow, firmLink, getSaved, SAVED_KEY,
  markVisitedSoon, _chipMem, chipMemKey,
} from "./shared.js?v=20260724-2";
import { viewItem, viewFirm } from "./detail.js?v=20260724-2";
// The shared news-wire engine — so the Legal dashboard wire is the same build as
// the Home feed (time-led .g-feed-* rows, day headers, and — new — the firm name
// at row end as an in-place source filter).
import { feedBodyHTML, feedSrcBarHTML, feedEmptyHTML, attachFeedClicks, byFeedDesc, onLiveWire } from "/feed.js?v=20260723-2";


const app = document.getElementById("app");
let _lgWireItems = [];        // normalised wire items for the shared feed engine
let _lgFilter = "all", _lgSrc = null;   // active desk chip / source filter
// Legal-industry NEWS from the shared live wire (The Lawyer, Legal Business) —
// the only /api/feed items folded into Legal's All, labelled NEWS. Loaded once
// via the shared onLiveWire loader; a change re-renders the dashboard.
let _lgNews = [], _lgFeedLoaded = false;
function loadLegalNews() {
  if (_lgFeedLoaded) return;
  _lgFeedLoaded = true;
  onLiveWire((items) => {
    const news = (items || []).filter((n) => n.legal)
      .map((n) => ({ desk: "news", href: n.url, ext: true, title: n.title, src: n.source, date: n.date || "", time: n.time || "" }));
    const changed = news.length !== _lgNews.length || (news[0] && (!_lgNews[0] || news[0].title !== _lgNews[0].title));
    _lgNews = news;
    if (changed && document.getElementById("lg-wire")) router();
  });
}

// In-page memory for chip selections, keyed per chips-row AND current route:
// survives the async data-sync re-renders (which re-run the templates with the
// first chip hardcoded active — the old "kick" bug) but deliberately NOT page
// loads or navigation — every fresh view starts on the first chip. Leaving a
// route drops its entries, so coming back also starts fresh. (Pull-to-refresh
// keeps position across its reload separately, via ptr.js's short-lived
// sessionStorage tab snapshot.)
window.addEventListener("hashchange", () => {
  const suf = "|" + location.hash;
  Object.keys(_chipMem).forEach((k) => { if (!k.endsWith(suf)) delete _chipMem[k]; });
});

// ---- Small helpers ----------------------------------------------------------
import { esc, MONTHS, byDateDesc } from "/util.js?v=20260719-1";

function ym(iso) { return iso.slice(0, 7); } // "2025-03"


// Day-break separator rows in the wire (same scanning aid as the Home feed),
// plus keeping them in step with the in-place kind/source filters.
function wireDays(rows, rowFn, getDate) {
  let last = "";
  return rows.map((x) => {
    const d = String((getDate ? getDate(x) : x.date) || "").slice(0, 10);
    const hdr = d && d !== last ? `<li class="tw-day">${esc(fmtDate(d))}</li>` : "";
    if (d) last = d;
    return hdr + rowFn(x);
  }).join("");
}
function syncDayRows(root) {
  if (!root) return;
  root.querySelectorAll(".tw-day").forEach((d) => {
    let vis = false, n = d.nextElementSibling;
    while (n && !n.classList.contains("tw-day")) {
      if (n.classList.contains("tw-row") && n.style.display !== "none") { vis = true; break; }
      n = n.nextElementSibling;
    }
    d.style.display = vis ? "" : "none";
  });
}

// Insert a gentle day-break divider whenever the day changes from the previous
// item (a subtle visual gap between each day's rows; rows carry their own date).
function withDayBreaks(items, rowFn) {
  let prevDay = null;
  return items.map((x) => {
    const day = String(x.date || "").slice(0, 10);
    const sep = prevDay !== null && day !== prevDay ? '<div class="day-sep" aria-hidden="true"></div>' : "";
    prevDay = day;
    return sep + rowFn(x);
  }).join("");
}

// ---- Feed pagination --------------------------------------------------------
// Long feeds render the first PAGE items with a "Load more" button that reveals
// the next PAGE. The shown count resets to PAGE whenever the filter signature
// for that feed changes (so a new search/filter starts from the top again).
const PAGE = 25;
const pageShown = {};
const pageSig = {};
function pageReset(key, sig) { if (pageSig[key] !== sig) { pageSig[key] = sig; pageShown[key] = PAGE; } }
function pageCount(key) { return pageShown[key] || PAGE; }
function loadMoreBtn(key, remaining) {
  if (remaining <= 0) return "";
  return `<div class="load-more-wrap"><button type="button" class="load-more" data-more="${esc(key)}">Load ${Math.min(PAGE, remaining)} more <span class="lm-rem">· ${remaining} remaining</span></button></div>`;
}
function feedHtml(rows, key, rowFn, sig) {
  pageReset(key, sig);
  const shown = rows.slice(0, pageCount(key));
  return withDayBreaks(shown, rowFn) + loadMoreBtn(key, rows.length - shown.length);
}
// "Load more" reveals the next page and re-renders the affected list in place
// (a local re-render, so the sidebar filters keep their selected state).
// Expand / collapse a clamped summary preview inline.
document.addEventListener("click", (e) => {
  const t = e.target.closest(".clamp-toggle");
  if (!t) return;
  const w = t.closest(".sum-clamp"); if (!w) return;
  const open = w.classList.toggle("is-open");
  t.textContent = open ? "less" : "more";
  t.setAttribute("aria-expanded", open ? "true" : "false");
});
document.addEventListener("click", (e) => {
  const b = e.target.closest(".load-more");
  if (!b) return;
  const key = b.getAttribute("data-more");
  pageShown[key] = pageCount(key) + PAGE;
  const y = window.scrollY;
  if (key === "alerts") renderResults();
  else if (key === "cases") renderCaseResults();
  else if (key === "rx") renderRxResults();
  window.scrollTo(0, y);
});

// On phones, the filter sidebar is collapsed behind a "Filters" toggle to save
// space. Open on desktop; collapsed by default on mobile (the sidebar DOM isn't
// re-rendered while filtering, so the user's choice sticks during a session).
const MOBILE_Q = "(max-width: 760px)";
function mfOpen() { return !window.matchMedia(MOBILE_Q).matches; }

// ---- Saved state (localStorage + cloud sync) --------------------------------
// Saved items persist to a per-user Cloudflare KV store (via the /api/saved
// endpoint) when the site is served behind Cloudflare Access, so saved alerts,
// cases and restructuring matters sync across the user's devices. localStorage
// is kept as an instant cache / offline fallback, so the app still works if the
// API isn't reachable (e.g. plain static hosting or local preview).
const SAVED_API = "/api/saved";
let savedCloud = false;        // true once the saved-items API responds
let savedPushTimer = null;

function setSaved(set) {
  try { localStorage.setItem(SAVED_KEY, JSON.stringify([...set])); } catch { /* ignore */ }
  updateSavedCount();
  pushSavedRemote();
}
// Debounced save to the cloud (no-op when not signed in / not on Cloudflare).
function pushSavedRemote() {
  if (!savedCloud) return;
  clearTimeout(savedPushTimer);
  savedPushTimer = setTimeout(() => {
    fetch(SAVED_API, {
      method: "PUT", headers: { "content-type": "application/json" },
      body: JSON.stringify({ saved: [...getSaved()] }),
    }).catch(() => {});
  }, 400);
}
function toggleSaved(id) {
  const s = getSaved();
  s.has(id) ? s.delete(id) : s.add(id);
  setSaved(s);
  return s.has(id);
}
function updateSavedCount() {
  const n = getSaved().size;
  const el = document.getElementById("saved-count");
  if (el) el.textContent = n ? String(n) : "";
}
// On load, reconcile this device's saved set with the per-user cloud copy. We
// UNION the two (saving is additive, so we never want to drop an item saved on
// another device or on this one), persist the merged set locally, and push it
// back up so every device converges. No-op when the API isn't reachable.
async function initSavedSync() {
  let r;
  try { r = await fetch(SAVED_API, { headers: { accept: "application/json" } }); }
  catch { return; }            // offline / not on Cloudflare → localStorage only
  if (!r || !r.ok) return;     // 404 on static hosting, 401 if not authed
  let d; try { d = await r.json(); } catch { return; }
  savedCloud = true;
  const server = Array.isArray(d.saved) ? d.saved : [];
  const local = [...getSaved()];
  const union = new Set([...local, ...server]);
  try { localStorage.setItem(SAVED_KEY, JSON.stringify([...union])); } catch { /* ignore */ }
  updateSavedCount();
  // Push only if the merged set differs from what the server already holds.
  if (union.size !== server.length || server.some((id) => !union.has(id))) pushSavedRemote();
  router();                    // re-render so saved stars / Saved view reflect the merge
}



// Horizontal multi-select dropdown (Wire Credit style): an uppercase label,
// a plain-text "All ▾" toggle and a popover of checkboxes. `viewKey` is
// "view:key" (e.g. "list:areas", "cases:courts", "rx:types") — the view routes
// the change to the right filter store + feed re-render. `options` are strings or
// {value,label} objects; `selected` is the array of selected values.
function multiFilter(viewKey, label, options, selected) {
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const sel = selected || [];
  const n = sel.length;
  const summary = n === 0 ? "All" : (n === 1 ? (opts.find((o) => o.value === sel[0]) || { label: sel[0] }).label : `${n} selected`);
  return `<div class="filter ms" data-ms="${esc(viewKey)}">
    <span>${esc(label)}</span>
    <button type="button" class="ms-btn" aria-haspopup="true" aria-expanded="false">${esc(summary)} <span class="ms-caret" aria-hidden="true">▾</span></button>
    <div class="ms-pop" hidden>
      ${opts.map((o) => `<label class="ms-opt"><input type="checkbox" value="${esc(o.value)}" ${sel.includes(o.value) ? "checked" : ""}> ${esc(o.label)}</label>`).join("")}
    </div>
  </div>`;
}

// Multi-select plumbing. The filter bar is rendered once per view and only the
// feed re-renders on a filter change, so the popover DOM (and its open state)
// persists — no reopen dance needed. `openMs` tracks the currently-open dropdown.
let openMs = null;
const FILTER_STORES = () => ({ list: filterState, cases: caseFilter, rx: rxFilter });
const FILTER_RENDER = { list: () => renderResults(), cases: () => renderCaseResults(), rx: () => renderRxResults() };

// Toggle a dropdown's popover open/closed.
document.addEventListener("click", (e) => {
  const msBtn = e.target.closest(".ms-btn");
  if (msBtn) {
    e.stopPropagation();
    const ms = msBtn.closest(".ms");
    const pop = ms.querySelector(".ms-pop");
    const willOpen = pop.hasAttribute("hidden");
    document.querySelectorAll(".ms-pop").forEach((p) => p.setAttribute("hidden", ""));
    document.querySelectorAll(".ms-btn").forEach((b) => b.setAttribute("aria-expanded", "false"));
    if (willOpen) { pop.removeAttribute("hidden"); msBtn.setAttribute("aria-expanded", "true"); openMs = ms.getAttribute("data-ms"); }
    else { openMs = null; }
    return;
  }
  // Clicks inside an open popover shouldn't bubble to close it or hit row handlers.
  if (e.target.closest(".ms-pop")) { e.stopPropagation(); return; }
  // Click anywhere else closes any open popover.
  if (openMs) {
    document.querySelectorAll(".ms-pop").forEach((p) => p.setAttribute("hidden", ""));
    document.querySelectorAll(".ms-btn").forEach((b) => b.setAttribute("aria-expanded", "false"));
    openMs = null;
  }
});

// A checkbox toggle updates the right filter store, refreshes the toggle summary
// and re-renders that view's feed (leaving the popover open).
document.addEventListener("change", (e) => {
  const cb = e.target.closest(".ms-pop input[type=checkbox]");
  if (!cb) return;
  const ms = cb.closest(".ms");
  const [view, key] = ms.getAttribute("data-ms").split(":");
  const checked = [...ms.querySelectorAll("input[type=checkbox]:checked")];
  const vals = checked.map((i) => i.value);
  const store = FILTER_STORES()[view];
  if (store) store[key] = vals;
  const btn = ms.querySelector(".ms-btn");
  const n = vals.length;
  const summary = n === 0 ? "All" : (n === 1 ? checked[0].parentElement.textContent.trim() : `${n} selected`);
  btn.innerHTML = `${esc(summary)} <span class="ms-caret" aria-hidden="true">▾</span>`;
  FILTER_RENDER[view] && FILTER_RENDER[view]();
});



// A BAILII judgment as a list row — same Credit-style layout, AI summary inline,
// linking out to bailii.org.
// Collapsed by default — the CASE NAME (inside <summary>) is the expand/collapse
// toggle; the Save button sits top-right of that line (always visible; the global
// AI summary shown inline (same layout as the alerts rows); the title links out
// to the BAILII judgment and the Save button sits top-right of the title line.
// A summary preview clamped to 2 lines, with a "more" toggle (revealed only when
// the text actually overflows — see initClamps) that expands the full text inline.
function clampSum(text) {
  const t = esc(text || "");
  if (!t) return "";
  return `<div class="sum-clamp"><p class="feed-summary clamp2">${t}</p><button type="button" class="clamp-toggle" aria-expanded="false" hidden>more</button></div>`;
}
// Reveal the "more" toggle only where the clamped text is actually truncated.
// Skips already-expanded rows so a resize doesn't strip their "less" control.
function initClamps(root) {
  (root || document).querySelectorAll(".sum-clamp").forEach((w) => {
    if (w.classList.contains("is-open")) return;
    const btn = w.querySelector(".clamp-toggle");
    if (!btn) return;
    // Rows that hide extra detail are always expandable; summary-only rows show
    // the toggle only when the text actually overflows two lines.
    if (w.classList.contains("has-detail")) { btn.hidden = false; return; }
    const p = w.querySelector(".feed-summary");
    if (p) btn.hidden = !(p.scrollHeight - p.clientHeight > 2);
  });
}
function caseRow(c) {
  const summary = caseSummaries[c.id] || c.summary || "";
  const saved = getSaved().has(c.id);
  return `<div class="feed-row" id="row-${esc(c.id)}">
    <div class="feed-meta">
      <span class="feed-date">${fmtDate(c.date)}</span>
    </div>
    <div class="feed-body">
      <div class="rx-title-line">
        ${c.url
          ? `<a class="feed-title rx-name" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.name)}</a>`
          : `<span class="feed-title rx-name">${esc(c.name)}</span>`}
        <button class="save-btn rx-save ${saved ? "is-saved" : ""}" data-save="${esc(c.id)}"
          aria-pressed="${saved}" title="${saved ? "Remove from saved" : "Save this case"}">${saved ? "★ Saved" : "☆ Save"}</button>
      </div>
      ${clampSum(summary)}
      <div class="feed-foot">
        <span>${esc(c.court)}</span>${c.citation ? ` · <span class="cite">${esc(c.citation)}</span>` : ""}
      </div>
    </div>
  </div>`;
}

// Compact dashboard rows — headline + "date · source" line, matching Wire
// Credit's dashboard feeds.
function itemCompact(it) {
  const firm = firmById[it.firm] || { name: it.firm, insightsUrl: "" };
  const href = it.url || firm.insightsUrl; // prefer the item's own article link
  const src = href
    ? ` · <a href="${esc(href)}" target="_blank" rel="noopener noreferrer" class="muted small">source</a>` : "";
  return `<li class="compact-item">
    ${href
      ? `<a class="compact-head" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(it.title)}</a>`
      : `<a class="compact-head" href="#/item/${esc(it.id)}">${esc(it.title)}</a>`}
    <div class="compact-meta muted small">${itemDate(it)} · ${esc(firm.name)}${src}</div>
  </li>`;
}
function caseCompact(c) {
  return `<li class="compact-item">
    <a class="compact-head" href="${esc(c.url || "#/")}"${c.url ? ` target="_blank" rel="noopener noreferrer"` : ""}>${esc(c.name)}</a>
    <div class="compact-meta muted small">${fmtDate(c.date)} · ${esc(c.court)} · ${esc(c.citation)}</div>
  </li>`;
}
function rxCompact(r) {
  const kind = r.type === "scheme" ? "Scheme" : "Plan";
  const meta = [r.date ? fmtDate(r.date) : "undated", kind, r.citation ? esc(r.citation) : ""].filter(Boolean).join(" · ");
  const u = r.judgmentUrl || r.articleUrl;
  return `<li class="compact-item">
    <a class="compact-head" href="${esc(u || "#/")}"${u ? ` target="_blank" rel="noopener noreferrer"` : ""}>${esc(r.company)}</a>
    <div class="compact-meta muted small">${meta}</div>
  </li>`;
}

// =============================================================================
// VIEW: Dashboard (#/)
// =============================================================================
// ---- Schemes/RPs table helpers --------------------------------------------
// Lead monetary figure from the (descriptive) debt field for the compact "Total
// debt" column. Matches currency SYMBOLS and CODES (£/€/$…, EUR/GBP/USD…), the
// usual c./~/>/up to approximations and ranges ("US$5.5-6bn"). A dash means the
// matter has no single debt figure (leasehold compromises, consumer-redress
// schemes, disputed derivative claims) rather than a missing value.
function schemeDebt(r) {
  const m = String(r.debt || "").match(/(?:>|~|≈|up to\s|c\.?\s?|circa\s?)?(?:US\$|C\$|A\$|HK\$|£|€|\$|EUR|GBP|USD|CAD|AUD|CHF)\s?\d[\d.,]*(?:\s?[–-]\s?\d[\d.,]*)?\+?\s?(?:bn|billion|tn|trillion|m|million|k)?/i);
  return m ? m[0].replace(/\s+/g, " ").trim() : "—";
}
// Advisers split by side. Prefer the per-matter researched mapping (rxAdvisers:
// company-side vs creditor-side, sourced from law-firm deal notes / restructuring
// press / the judgments); fall back to a best-effort keyword split of the flat
// advisers field for any matter not in the mapping.
function schemeAdvisers(r) {
  const m = rxAdvisers && rxAdvisers[r.id];
  if (m && ((m.co && m.co.length) || (m.cr && m.cr.length))) return { co: m.co || [], cr: m.cr || [] };
  const co = [], cr = [];
  (r.advisers || []).forEach((a) => {
    const s = String(a).toLowerCase();
    const isCr = /creditor|ad hoc|\bahg\b|noteholder|bondholder|lender|holder group|committee/.test(s);
    if (isCr) cr.push(a); else co.push(a);
  });
  return { co, cr };
}
const statusShort = (o) => String(o || "").split("—")[0].replace(/\s*\([^)]*\)\s*/g, "").trim();
const statusClass = (o) => "s-" + statusShort(o).toLowerCase().replace(/[^a-z]+/g, "");

// The Schemes & RPs pane: every Part 26A plan / Part 26 scheme as a table row.
function schemesTablePane() {
  const rows = [...restructurings].sort(byDateDesc);
  const advList = (arr) => (arr && arr.length) ? `<ul class="lg-mini-list">${arr.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : '<span class="muted small">—</span>';
  const credList = (arr) => (arr && arr.length) ? `<ul class="lg-mini-list">${arr.slice(0, 4).map((c) => `<li>${esc(c)}</li>`).join("")}${arr.length > 4 ? `<li class="muted small">+${arr.length - 4} more</li>` : ""}</ul>` : '<span class="muted small">—</span>';
  const docs = (r) => {
    const l = [];
    if (r.judgmentUrl) l.push(`<a href="${esc(r.judgmentUrl)}" target="_blank" rel="noopener noreferrer">Judgment${r.citation ? ` · ${esc(r.citation)}` : ""}</a>`);
    if (r.articleUrl) l.push(`<a href="${esc(r.articleUrl)}" target="_blank" rel="noopener noreferrer">Analysis / documents</a>`);
    return l.length ? `<ul class="lg-doc-list">${l.map((x) => `<li>${x}</li>`).join("")}</ul>` : '<span class="muted small">—</span>';
  };
  const tr = (r) => {
    const a = schemeAdvisers(r);
    const kind = r.type === "scheme" ? "Scheme" : "Restructuring plan";
    return `<tr id="lg-sc-${esc(r.id)}">`
      + `<td class="lg-sc-co"><span class="lg-sc-name">${esc(r.company)}</span>${r.date ? `<div class="muted small">${esc(fmtDate(r.date))}</div>` : ""}</td>`
      + `<td class="lg-sc-type">${kind}</td>`
      + `<td class="lg-sc-debt">${esc(schemeDebt(r))}</td>`
      + `<td><span class="lg-sc-status ${statusClass(r.outcome)}">${esc(statusShort(r.outcome))}</span></td>`
      + `<td>${credList(r.creditors)}</td>`
      + `<td>${advList(a.co)}</td>`
      + `<td>${advList(a.cr)}</td>`
      + `<td>${docs(r)}</td>`
      + `</tr>`;
  };
  return `<div class="lg-sc-wrap"><table class="lg-sc-tbl">
    <thead><tr><th>Company</th><th>Type</th><th>Total debt</th><th>Status</th><th>Creditors</th><th>Company's advisers</th><th>Creditors' advisers</th><th>Documents</th></tr></thead>
    <tbody>${rows.map(tr).join("")}</tbody>
  </table></div>`;
}
// The Case law pane: every tracked BAILII case as a wire row (full list, not the
// newest-N slice the combined wire is capped at).
function casesPane() {
  const row = (c) => `<li class="compact-item tw-row">`
    + `<span class="tw-date">${c.date ? esc(fmtDate(c.date)) : ""}</span>`
    + `<span class="tw-tag case">CASE</span>`
    + `<span class="tw-body"><a href="${esc(c.url || "#/")}"${c.url ? ` target="_blank" rel="noopener noreferrer"` : ""} class="tw-head">${esc(c.name)}</a><span class="tw-mgr-w"><span class="tw-mgr">${esc(c.court)}</span></span></span>`
    + `<span class="tw-src">${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.citation || "source")}</a>` : esc(c.citation || "")}</span>`
    + `</li>`;
  return `<ul class="twire compact-list">${wireDays([...cases].sort(byDateDesc), row)}</ul>`;
}

function viewDashboard() {
  const thisYear = new Date().getFullYear();

  // Five practice-area tiles: number of alerts dated THIS YEAR, click → filtered list.
  const tiles = practiceAreas.map((a) => {
    const n = items.filter((i) => Number(i.date.slice(0, 4)) === thisYear
      && (i.areas || [i.area]).includes(a.id)).length;
    return `<a class="kpi kpi-link" href="#/list?area=${a.id}" style="--c:${a.color}"
      aria-label="${esc(a.name)}: ${n} alerts in ${thisYear}">
      <span class="kpi-num">${n}</span>
      <span class="kpi-label">${esc(a.name)}</span>
      <span class="kpi-sub">alerts in ${thisYear}</span>
    </a>`;
  }).join("");

  // Dashboard lists: law-firm alerts, recent BAILII cases, and schemes/RPs.
  const firmList = [...items].sort(byDateDesc).slice(0, 10).map(itemCompact).join("");
  const caseListHtml = [...cases].sort(byDateDesc).slice(0, 10).map(caseCompact).join("");
  const rxListHtml = [...restructurings].sort(byDateDesc).slice(0, 10).map(rxCompact).join("");

  // Supporting charts: by source tier + by month.
  const tierData = tiers.map((t) => ({
    label: t.name,
    value: items.filter((i) => (firmById[i.firm] || {}).tier === t.id).length,
    nav: { tier: t.id },
  }));
  const months = [...new Set(items.map((i) => ym(i.date)).filter(Boolean))].sort().slice(-8);
  const monthData = months.map((m) => ({
    label: MONTHS[Number(m.slice(5, 7)) - 1] + " " + m.slice(2, 4),
    value: items.filter((i) => ym(i.date) === m).length,
    nav: { month: m },
  }));

  // ---- dense terminal screen (canonical tui.css format) -------------------
  const inYear = (i) => Number(String(i.date).slice(0, 4)) === thisYear;
  const areaCount = (a) => items.filter((i) => inYear(i) && (i.areas || [i.area]).includes(a.id)).length;
  const metrics = [
    ["Alerts " + thisYear, items.filter(inYear).length],
    ...practiceAreas.map((a) => [a.name, areaCount(a)]),
    ["Case law", cases.length], ["Scheme/RPs", restructurings.length],
  ];
  const alerts = items.map((it) => ({ _k: "alert", date: it.date, title: it.title, href: it.url || (firmById[it.firm] || {}).insightsUrl || `#/item/${encodeURIComponent(it.id)}`, ext: !!(it.url || (firmById[it.firm] || {}).insightsUrl), mgr: (firmById[it.firm] || {}).name || it.firm, src: (firmById[it.firm] || {}).name || it.firm, url: it.url, code: "ALERT", firmId: it.firm || "" }));
  // A case headline opens its source directly (BAILII / National Archives judgment).
  // A scheme/RP headline jumps to that matter's row in the Schemes & RPs table
  // (goScheme); its citation still links to the judgment in the source column.
  // An alert headline opens the firm's own article (its source URL) directly.
  const caseItems = cases.map((c) => ({ _k: "case", date: c.date, title: c.name, href: c.url || "#/", ext: !!c.url, mgr: c.court, src: c.citation, url: c.url, code: "CASE" }));
  const rps = restructurings.map((r) => ({ _k: "rp", date: r.date, title: r.company, goScheme: r.id, mgr: r.court || (r.type === "scheme" ? "Scheme" : "Restructuring plan"), src: r.citation || "", url: r.judgmentUrl || r.articleUrl || null, code: r.type === "scheme" ? "SCHEME" : "RP" }));
  // The 'All' feed always carries EVERY case and scheme/RP (there are far fewer of
  // them than law-firm alerts, so a flat newest-N cap would bury them entirely);
  // only the alert stream is capped, to the most recent 250.
  const wire = [
    ...alerts.filter((x) => x.date).sort(byDateDesc).slice(0, 250),
    ...caseItems.filter((x) => x.date),
    ...rps.filter((x) => x.date),
  ].sort(byDateDesc);
  // Normalise into the shared wire's item shape: the Legal taxonomy (ALERT /
  // CASE / SCHEME / RP) maps to the shared code chips. The row-end value — for an
  // alert that's the FIRM name — becomes an in-place source filter, exactly like
  // the Home feed (previously it was a plain external link). Scheme/RP headlines
  // still jump to that matter in the Schemes & RPs table (via data-sid, handled
  // in legalWireDash). Legal data carries a date only, so rows lead with "12:00".
  _lgWireItems = wire.map((x) => x._k === "rp"
    ? { desk: x.code === "SCHEME" ? "scheme" : "rp", href: "#/", ext: false, title: x.title,
        src: x.src || "", date: x.date || "", sid: x.goScheme || "" }
    : { desk: x._k, href: x.href, ext: x.ext, title: x.title,
        src: x.src || "", date: x.date || "", firm: x.firmId || "" });
  // Fold in ONLY legal-industry NEWS from the shared wire (The Lawyer, Legal
  // Business, flagged legal:true) — labelled NEWS — alongside the LEGAL desk
  // (client alerts, case law, schemes/RPs). General macro/markets wire stays out.
  loadLegalNews();
  _lgWireItems = [..._lgWireItems, ..._lgNews].sort(byFeedDesc);
  const rxRow = (r) => { const u = r.judgmentUrl || r.articleUrl; return `<li class="tmini-row"><a class="tmini-t" href="${esc(u || "#/")}"${u ? ` target="_blank" rel="noopener noreferrer"` : ""}>${esc(r.company)}</a><span class="tmini-m">${r.type === "scheme" ? "Scheme" : "Plan"}${r.date ? " · " + esc(fmtDate(r.date)) : ""}</span></li>`; };
  const caseRow = (c) => `<li class="tmini-row"><a class="tmini-t" href="${esc(c.url || "#/")}"${c.url ? ` target="_blank" rel="noopener noreferrer"` : ""}>${esc(c.name)}</a><span class="tmini-m">${esc(c.court)}${c.date ? " · " + esc(fmtDate(c.date)) : ""}</span></li>`;

  app.innerHTML = `<div class="tdash">
    <div class="tdash-grid tdash-1">
      <section class="tcol tcol-c tcol-full">
        <header class="tpanel-h twire-head">
          <div class="tchips" id="lg-chips">
            <button type="button" class="tchip is-on" data-k="all">All</button>
            <button type="button" class="tchip" data-k="alert">Alerts</button>
            <button type="button" class="tchip" data-k="news">News</button>
            <button type="button" class="tchip" data-k="case">Case law</button>
            <button type="button" class="tchip" data-k="rp">Scheme/RPs</button>
          </div>
        </header>
        <div class="tpanes" id="lg-panes">
          <div class="tpane g-feed-wrap" data-pane="wire">
            <div class="g-feed twire" id="lg-wire">${_lgWireItems.length ? feedBodyHTML(_lgWireItems) : feedEmptyHTML("No items yet.")}</div>
          </div>
          <div class="tpane" data-pane="cases" hidden>${casesPane()}</div>
          <div class="tpane" data-pane="schemes" hidden>${schemesTablePane()}</div>
        </div>
      </section>
    </div>
  </div>`;
  legalWireDash();
}
// All / Alerts filter the combined wire in place; Case law and Schemes & RPs each
// swap to their own full pane (a case list and the schemes table) so both are
// completely populated rather than capped by the wire's newest-N slice.
function legalWireDash() {
  const chips = document.getElementById("lg-chips"), panes = document.getElementById("lg-panes");
  if (!chips || !panes) return;
  const PANE = { all: "wire", alert: "wire", news: "wire", case: "cases", rp: "schemes" };
  const wire = document.getElementById("lg-wire");
  // Filtering re-renders the shared wire (so day headers + the source bar stay
  // correct), like the Home feed. Case law / Schemes still swap to their own full
  // pane (not capped by the wire's newest-N slice).
  const paint = () => {
    if (!wire) return;
    let list = _lgWireItems;
    if (_lgSrc) list = list.filter((x) => x.src === _lgSrc);
    else if (_lgFilter !== "all") list = list.filter((x) => x.desk === _lgFilter);
    wire.innerHTML = (_lgSrc ? feedSrcBarHTML(_lgSrc) : "")
      + (list.length ? feedBodyHTML(list) : feedEmptyHTML(_lgSrc ? `No ${_lgSrc} stories — check back shortly.` : "No items yet."));
  };
  const showPane = (pane) => panes.querySelectorAll(".tpane").forEach((p) => { p.hidden = p.dataset.pane !== pane; });
  const setActive = (k) => chips.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c.dataset.k === k));
  const selectChip = (k) => {
    setActive(k);
    const pane = PANE[k] || "wire";
    showPane(pane);
    if (pane === "wire") { _lgFilter = k === "alert" ? "alert" : "all"; _lgSrc = null; paint(); }
  };
  chips.onclick = (e) => {
    const b = e.target.closest(".tchip"); if (!b) return;
    _chipMem[chipMemKey("lg-chips")] = b.dataset.k || "all";
    selectChip(b.dataset.k);
  };
  // In-page selection survives async-sync re-renders (All is hardcoded active in
  // the template — the same kick the Macro main tabs had).
  {
    const k0 = _chipMem[chipMemKey("lg-chips")];
    if (k0 && k0 !== "all" && chips.querySelector(`.tchip[data-k="${k0}"]`)) selectChip(k0);
  }
  // Firm name (row end) → filter the wire to that firm, Home-style; reset to All.
  attachFeedClicks(wire, {
    onSrc: (s) => { _lgSrc = s; _lgFilter = "all"; setActive("all"); showPane("wire"); paint(); },
    onClearSrc: () => { _lgSrc = null; paint(); },
  });
  // A scheme/RP headline still jumps to that matter in the Schemes & RPs table.
  if (wire) wire.addEventListener("click", (e) => {
    if (e.target.closest(".g-feed-src")) return;   // source-filter click, not a jump
    const row = e.target.closest('.g-feed-row[data-desk="scheme"], .g-feed-row[data-desk="rp"]');
    if (!row || !row.dataset.sid) return;
    e.preventDefault();
    selectChip("rp");
    const t = document.getElementById("lg-sc-" + row.dataset.sid);
    if (t) { t.scrollIntoView({ behavior: "smooth", block: "center" }); t.classList.add("lg-sc-flash"); setTimeout(() => t.classList.remove("lg-sc-flash"), 1600); }
  });
}

// =============================================================================
// VIEW: List (#/list) — multi-select filters + search
// =============================================================================
const filterState = { areas: [], tiers: [], types: [], firms: [], years: [], months: [], q: "", saved: false };

function parseHashQuery() {
  const h = location.hash.slice(1); // "/list?area=banking"
  const qi = h.indexOf("?");
  const out = {};
  if (qi >= 0) {
    new URLSearchParams(h.slice(qi + 1)).forEach((v, k) => { out[k] = v; });
  }
  return out;
}

function viewList() {
  // Seed filter state from the hash query (shareable deep links).
  const q = parseHashQuery();
  filterState.areas = q.area ? [q.area] : [];
  filterState.tiers = q.tier ? [q.tier] : [];
  filterState.types = q.type ? [q.type] : [];
  filterState.firms = q.firm ? [q.firm] : [];
  filterState.years = q.year ? [q.year] : [];
  filterState.months = q.month ? [q.month] : [];
  filterState.q = q.q || "";
  filterState.saved = q.saved === "1";

  const years = [...new Set(items.map((i) => i.date.slice(0, 4)).filter(Boolean))].sort((a, b) => b.localeCompare(a));
  const monthOpts = [...new Set(items.map((i) => ym(i.date)).filter(Boolean))].sort((a, b) => b.localeCompare(a))
    .map((m) => ({ id: m, name: MONTHS[Number(m.slice(5, 7)) - 1] + " " + m.slice(0, 4) }));

  app.innerHTML = `
    <div class="list-head">
      <h1>${filterState.saved ? "Saved items" : "Legal alerts"}</h1>
      <p class="muted">Filter by practice area, source tier, type or firm, or search the full text.</p>
    </div>
    <input type="checkbox" id="filters-toggle" class="ff-cb" ${mfOpen() ? "checked" : ""}><label for="filters-toggle" class="ff-lab">Filters</label>
    <div class="filters" aria-label="Filters">
      <label class="filter search"><span>Search</span>
        <input id="search" type="search" placeholder="Search updates, cases, tags…"
          value="${esc(filterState.q)}" aria-label="Search updates" autocomplete="off"/>
      </label>
      ${multiFilter("list:areas", "Practice area", practiceAreas.map((a) => ({ value: a.id, label: a.name })), filterState.areas)}
      ${multiFilter("list:years", "Year", years.map((y) => ({ value: y, label: y })), filterState.years)}
      ${multiFilter("list:months", "Month", monthOpts.map((m) => ({ value: m.id, label: m.name })), filterState.months)}
      ${multiFilter("list:tiers", "Source tier", tiers.map((t) => ({ value: t.id, label: t.name })), filterState.tiers)}
      ${multiFilter("list:types", "Type", updateTypes.map((t) => ({ value: t.id, label: t.name })), filterState.types)}
      ${multiFilter("list:firms", "Firm", firms.map((f) => ({ value: f.id, label: f.name })), filterState.firms)}
    </div>
    <section class="card"><div id="results" class="feed"></div></section>
  `;

  // Search input re-renders the feed in place; the multi-selects are wired
  // globally (data-ms delegation).
  const search = app.querySelector("#search");
  search.addEventListener("input", () => { filterState.q = search.value; renderResults(); });

  renderResults();
}

function matchesFilters(it) {
  const itAreas = it.areas || [it.area];
  if (filterState.areas.length && !filterState.areas.some((a) => itAreas.includes(a))) return false;
  if (filterState.tiers.length && !filterState.tiers.includes((firmById[it.firm] || {}).tier)) return false;
  if (filterState.types.length && !filterState.types.includes(it.type)) return false;
  if (filterState.firms.length && !filterState.firms.includes(it.firm)) return false;
  if (filterState.years.length && !filterState.years.includes(it.date.slice(0, 4))) return false;
  if (filterState.months.length && !filterState.months.includes(ym(it.date))) return false;
  if (filterState.saved && !getSaved().has(it.id)) return false;
  if (filterState.q.trim()) {
    const q = filterState.q.trim().toLowerCase();
    const hay = [it.title, it.summary, it.citation, it.court, (it.tags || []).join(" "),
      (firmById[it.firm] || {}).name].join(" ").toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

// Does a case pass the sidebar filters? Cases share area / year / month / search;
// the alert-only facets (tier/type/firm) exclude cases when active.
function caseMatchesFilters(c) {
  if (filterState.areas.length && !filterState.areas.includes(c.area)) return false;
  if (filterState.tiers.length || filterState.types.length || filterState.firms.length) return false;
  if (filterState.years.length && !filterState.years.includes(c.date.slice(0, 4))) return false;
  if (filterState.months.length && !filterState.months.includes(ym(c.date))) return false;
  if (filterState.q.trim()) {
    const q = filterState.q.trim().toLowerCase();
    const hay = [c.name, c.citation, c.court, caseSummaries[c.id] || c.summary].join(" ").toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

// Does a restructuring matter pass the sidebar filters? Schemes/RPs have no
// practice area / tier / type / firm, so they're hidden when those facets are
// active (like cases); they do share year / month / search.
function rxMatchesFilters(r) {
  if (filterState.areas.length || filterState.tiers.length || filterState.types.length || filterState.firms.length) return false;
  const yr = (r.date || "").slice(0, 4);
  if (filterState.years.length && !filterState.years.includes(yr)) return false;
  if (filterState.months.length && !filterState.months.includes((r.date || "").slice(0, 7))) return false;
  if (filterState.q.trim()) {
    const q = filterState.q.trim().toLowerCase();
    const hay = [r.company, r.citation, r.court, r.sector, (r.creditors || []).join(" "), (r.advisers || []).join(" ")].join(" ").toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function renderResults() {
  const results = document.getElementById("results");
  if (!results) return;
  let rows = items.filter(matchesFilters).map((it) => ({ ...it, _kind: "item" }));
  // In the "Saved" view, also surface saved case-law judgments and saved
  // restructuring matters (schemes/RPs) alongside saved alerts.
  if (filterState.saved) {
    const savedSet = getSaved();
    rows = rows.concat(cases.filter((c) => savedSet.has(c.id) && caseMatchesFilters(c)).map((c) => ({ ...c, _kind: "case" })));
    rows = rows.concat(restructurings.filter((r) => savedSet.has(r.id) && rxMatchesFilters(r)).map((r) => ({ ...r, _kind: "rx" })));
  }
  rows.sort(byDateDesc);
  const n = rows.length;
  const noun = filterState.saved ? "saved item" : "update";
  const sig = JSON.stringify([filterState.areas, filterState.tiers, filterState.types, filterState.firms, filterState.years, filterState.months, filterState.q, filterState.saved]);
  results.innerHTML = n
    ? feedHtml(rows, "alerts", (x) => (x._kind === "case" ? caseRow(x) : x._kind === "rx" ? rxRow(x) : itemRow(x)), sig)
    : `<div class="empty">No ${noun}s match these filters.${filterState.saved ? " Save items with the ☆ button." : ""}</div>`;
  initClamps(results);
}

// =============================================================================
// VIEW: Case law (#/cases) — all BAILII cases with AI-generated summaries
// =============================================================================
const caseFilter = { areas: [], courts: [], years: [], q: "" };

// Courts present in the data, in a sensible hierarchy order.
const COURT_ORDER = ["Supreme Court", "Court of Appeal", "High Court (Ch)", "High Court (Comm)", "High Court (KB)", "High Court (QB)"];

function viewCases() {
  // Seed from the hash query (shareable deep links, e.g. #/cases?area=ri).
  const q = parseHashQuery();
  caseFilter.areas = q.area ? [q.area] : [];
  caseFilter.courts = [];
  caseFilter.years = q.year ? [q.year] : [];
  caseFilter.q = q.q || "";

  const courts = COURT_ORDER.filter((ct) => cases.some((c) => c.court === ct));
  const years = [...new Set(cases.map((c) => c.date.slice(0, 4)))].sort((a, b) => b.localeCompare(a));

  app.innerHTML = `
    <div class="list-head">
      <h1>Case law</h1>
      <p class="muted">English-law judgments from the Supreme Court, Court of Appeal (Civil Division) and the
        High Court (Chancery, Commercial &amp; King's/Queen's Bench).</p>
    </div>
    <input type="checkbox" id="filters-toggle" class="ff-cb" ${mfOpen() ? "checked" : ""}><label for="filters-toggle" class="ff-lab">Filters</label>
    <div class="filters" aria-label="Filters">
      <label class="filter search"><span>Search</span>
        <input id="case-search" type="search" placeholder="Search cases, citations…"
          value="${esc(caseFilter.q)}" aria-label="Search case law" autocomplete="off"/>
      </label>
      ${multiFilter("cases:areas", "Practice area", practiceAreas.map((a) => ({ value: a.id, label: a.name })), caseFilter.areas)}
      ${multiFilter("cases:years", "Year", years.map((y) => ({ value: y, label: y })), caseFilter.years)}
      ${multiFilter("cases:courts", "Court", courts.map((ct) => ({ value: ct, label: ct })), caseFilter.courts)}
    </div>
    <section class="card"><div id="case-results" class="feed"></div></section>
  `;

  const search = app.querySelector("#case-search");
  search.addEventListener("input", () => { caseFilter.q = search.value; renderCaseResults(); });

  renderCaseResults();

  // Deep-link from the dashboard "Recent cases" list (or a shared URL): scroll to,
  // open & flash it — revealing later pages first if needed.
  const focusId = parseHashQuery().case;
  if (focusId) focusCaseRow(focusId);
}

// Jump to a specific case: scroll to it, open it and flash it. If it's beyond the
// current page, reveal all cases first so the jump always lands.
function focusCaseRow(id) {
  let el = document.getElementById("row-" + id);
  if (!el) {
    pageShown.cases = cases.length;
    renderCaseResults();
    el = document.getElementById("row-" + id);
  }
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), 2200);
}

function renderCaseResults() {
  const el = document.getElementById("case-results");
  if (!el) return;
  const matched = cases.filter((c) => {
    if (caseFilter.areas.length && !caseFilter.areas.includes(c.area)) return false;
    if (caseFilter.courts.length && !caseFilter.courts.includes(c.court)) return false;
    if (caseFilter.years.length && !caseFilter.years.includes(c.date.slice(0, 4))) return false;
    if (caseFilter.q.trim()) {
      const hay = [c.name, c.citation, c.court, caseSummaries[c.id] || c.summary].join(" ").toLowerCase();
      if (!hay.includes(caseFilter.q.trim().toLowerCase())) return false;
    }
    return true;
  }).sort(byDateDesc);
  el.innerHTML = matched.length ? feedHtml(matched, "cases", caseRow, JSON.stringify(caseFilter)) : `<div class="empty">No cases match these filters.</div>`;
  initClamps(el);
}


// =============================================================================
// =============================================================================
// VIEW: Plans & Schemes (#/restructurings) — Part 26A restructuring plans and
// distressed Part 26 schemes of arrangement since 2020, with an All / Plans /
// Schemes type filter (plus search, outcome and year).
// =============================================================================
const rxFilter = { types: [], q: "", years: [], outcomes: [] };

function rxTypeLabel(t) { return t === "scheme" ? "Scheme (Pt 26)" : "Plan (Pt 26A)"; }
function rxOutcomeClass(o) {
  const t = (o || "").toLowerCase();
  if (t.includes("refus") || t.includes("overturn") || (t.includes("appeal") && t.includes("allow"))) return "neg";
  if (t.includes("upheld") || t.includes("dismiss")) return "pos";
  if (t.includes("conven") || t.includes("withdraw")) return "neu";
  return "pos";
}

function rxOutcomeShort(o) {
  const t = (o || "").toLowerCase();
  if (t.includes("overturn") || (t.includes("appeal") && t.includes("allow"))) return "Overturned on appeal";
  if (t.includes("upheld") || (t.includes("appeal") && t.includes("dismiss"))) return "Upheld on appeal";
  if (t.includes("refus")) return "Refused";
  if (t.includes("conven")) return "Convening";
  if (t.includes("withdraw")) return "Withdrawn";
  return "Sanctioned";
}

// Outcome as a verb phrase for the composed summary sentence.
function rxOutcomeVerb(o) {
  const t = (o || "").toLowerCase();
  if (t.includes("refus")) return "was refused sanction";
  if (t.includes("overturn") || (t.includes("appeal") && t.includes("allow"))) return "was sanctioned but overturned on appeal";
  if (t.includes("upheld") || (t.includes("appeal") && t.includes("dismiss"))) return "was sanctioned and later upheld on appeal";
  if (t.includes("conven")) return "is at the convening stage";
  if (t.includes("withdraw")) return "was withdrawn";
  return "was sanctioned";
}

// A short narrative summary composed from the matter's own fields (company, type,
// the debt/deal description and outcome) — mirrors the AI-summary line shown on
// case-law rows. Facts only; no fabrication beyond joining existing fields.
function rxSummary(r) {
  const kind = r.type === "scheme" ? "a Part 26 scheme of arrangement" : "a Part 26A restructuring plan";
  let deal = "";
  if (r.debt) {
    const d = r.debt.trim();
    // A bare figure ("~€7bn", ">$9bn") vs. a descriptive clause.
    const bare = d.length < 16 && /[£$€\d]/.test(d) && !/\s[a-z]{4,}/i.test(d.replace(/(bn|m|billion|million)/ig, ""));
    deal = bare ? ` The restructuring concerned debt of ${d}.` : ` ${d.replace(/[.;]\s*$/, "")}.`;
  }
  return `${r.company} pursued ${kind}.${deal} The ${r.type === "scheme" ? "scheme" : "plan"} ${rxOutcomeVerb(r.outcome)}.`;
}

// A restructuring matter as a feed row — same layout as the alerts/case-law
// feeds: type chip + date in the meta column, company title (linking to the
// judgment), key detail lines, and a muted footer with the citation and links.
function rxRow(r) {
  const firm = r.firm ? (firmById[r.firm] || { name: r.firm }) : null;
  const saved = getSaved().has(r.id);
  const typeFull = r.type === "scheme" ? "Part 26 scheme of arrangement" : "Part 26A restructuring plan";
  const features = (r.features || []).length
    ? `<ul class="rx-features">${r.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>` : "";
  // The 2-line summary is the preview; all the structured detail below is tucked
  // into the same expander, so a collapsed matter is genuinely just title +
  // 2-line summary + "more".
  const detail = [
    (r.creditors || []).length ? `<p class="rx-line"><span class="rx-lbl">Largest creditors</span> ${esc(r.creditors.join("; "))}</p>` : "",
    (r.advisers || []).length ? `<p class="rx-line"><span class="rx-lbl">Company advised by</span> ${esc(r.advisers.join(", "))}</p>` : "",
    features,
    r.notes ? `<p class="rx-line muted">${esc(r.notes)}</p>` : "",
  ].filter(Boolean).join("");
  const lines = `<div class="sum-clamp rx-clamp${detail ? " has-detail" : ""}">
    <p class="feed-summary clamp2">${esc(rxSummary(r))}</p>
    ${detail ? `<div class="rx-detail">${detail}</div>` : ""}
    <button type="button" class="clamp-toggle" aria-expanded="false"${detail ? "" : " hidden"}>more</button>
  </div>`;
  // Foot: court / citation / sector metadata + the firm-analysis and judgment links
  // (mirrors the alerts rows, where the source metadata sits in the footer line).
  // The title links to the primary source (the judgment, else the firm analysis).
  const srcUrl = r.judgmentUrl || r.articleUrl || "";
  const foot = [
    r.court ? esc(r.court) : "",
    r.citation ? `<span class="cite">${esc(r.citation)}</span>` : "",
    r.sector ? esc(r.sector) : "",
    firm && r.firm ? firmLink(r.firm, firm.name) : "",
    // Keep the firm-analysis link only when it isn't already the title's target.
    r.articleUrl && r.articleUrl !== srcUrl ? `<a href="${esc(r.articleUrl)}" target="_blank" rel="noopener noreferrer">analysis</a>` : "",
  ].filter(Boolean).join(" · ");
  // AI summary + detail shown inline (same layout as the alerts rows); the outcome
  // chip and Save button sit on the title line.
  return `<div class="feed-row rx-row" id="row-${esc(r.id)}">
    <div class="feed-meta">
      <span class="feed-date">${r.date ? esc(fmtDate(r.date)) : "undated"}</span>
    </div>
    <div class="feed-body">
      <div class="rx-title-line">
        ${srcUrl
          ? `<a class="feed-title rx-name" href="${esc(srcUrl)}" target="_blank" rel="noopener noreferrer">${esc(r.company)}</a>`
          : `<a class="feed-title rx-name" href="#/restructurings?m=${esc(r.id)}">${esc(r.company)}</a>`}
        <span class="rx-out-text muted small" title="${esc(r.outcome)}">${esc(rxOutcomeShort(r.outcome))}</span>
        <button class="save-btn rx-save ${saved ? "is-saved" : ""}" data-save="${esc(r.id)}"
          aria-pressed="${saved}" title="${saved ? "Remove from saved" : "Save this matter"}">${saved ? "★ Saved" : "☆ Save"}</button>
      </div>
      ${lines}
      ${foot ? `<div class="feed-foot">${foot}</div>` : ""}
    </div>
  </div>`;
}

function viewRestructurings() {
  const q = parseHashQuery();
  rxFilter.types = ["plan", "scheme"].includes(q.type) ? [q.type] : [];
  rxFilter.q = q.q || "";
  rxFilter.years = [];
  rxFilter.outcomes = [];
  const years = [...new Set(restructurings.map((r) => (r.date || "").slice(0, 4)).filter(Boolean))].sort((a, b) => b.localeCompare(a));
  const outcomes = [...new Set(restructurings.map((r) => r.outcome))].sort();

  app.innerHTML = `
    <div class="list-head">
      <h1>Schemes</h1>
      <p class="muted">English-law restructuring plans (Companies Act 2006 <strong>Part 26A</strong>) and
        distressed schemes of arrangement (<strong>Part 26</strong>) before the court since 2020.</p>
    </div>
    <input type="checkbox" id="filters-toggle" class="ff-cb" ${mfOpen() ? "checked" : ""}><label for="filters-toggle" class="ff-lab">Filters</label>
    <div class="filters" aria-label="Filters">
      <label class="filter search"><span>Search</span>
        <input id="rx-search" type="search" placeholder="Search company, citation, sector, creditor…"
          value="${esc(rxFilter.q)}" aria-label="Search plans and schemes" autocomplete="off"/>
      </label>
      ${multiFilter("rx:types", "Type", [{ value: "plan", label: "Plan (Part 26A)" }, { value: "scheme", label: "Scheme (Part 26)" }], rxFilter.types)}
      ${multiFilter("rx:outcomes", "Outcome", outcomes.map((o) => ({ value: o, label: o })), rxFilter.outcomes)}
      ${multiFilter("rx:years", "Year", years.map((y) => ({ value: y, label: y })), rxFilter.years)}
    </div>
    <section class="card"><div id="rx-results" class="feed"></div></section>`;

  const search = app.querySelector("#rx-search");
  search.addEventListener("input", () => { rxFilter.q = search.value; renderRxResults(); });
  renderRxResults();

  // Deep-link from the dashboard / a notification: scroll to & flash the matter.
  // If it's paged out of the first page, reveal all matters and retry so the jump
  // always lands.
  if (q.m) focusRxMatter(q.m);
}

function renderRxResults() {
  const el = document.getElementById("rx-results");
  if (!el) return;
  const matched = restructurings.filter((r) => {
    if (rxFilter.types.length && !rxFilter.types.includes(r.type)) return false;
    if (rxFilter.years.length && !rxFilter.years.includes((r.date || "").slice(0, 4))) return false;
    if (rxFilter.outcomes.length && !rxFilter.outcomes.includes(r.outcome)) return false;
    if (rxFilter.q.trim()) {
      const hay = [r.company, r.citation, r.sector, r.debt, (r.creditors || []).join(" "),
        (r.advisers || []).join(" "), (r.features || []).join(" ")].join(" ").toLowerCase();
      if (!hay.includes(rxFilter.q.trim().toLowerCase())) return false;
    }
    return true;
  }).sort(byDateDesc);
  el.innerHTML = matched.length ? feedHtml(matched, "rx", rxRow, JSON.stringify(rxFilter)) : '<p class="empty">No matters match these filters.</p>';
  initClamps(el);
}

// Jump to a specific matter (from a dashboard link or notification): scroll to &
// flash it. If it's beyond the current page, reveal all matters first.
function focusRxMatter(id) {
  let el = document.getElementById("row-" + id);
  if (!el) {
    pageShown.rx = restructurings.length;
    renderRxResults();
    el = document.getElementById("row-" + id);
  }
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), 2200);
}

// =============================================================================
// Router + global click delegation
// =============================================================================
function router() {
  const hash = location.hash || "#/";
  const path = hash.slice(1).split("?")[0]; // strip query
  window.scrollTo(0, 0);

  if (path === "/" || path === "") viewDashboard();
  else if (path === "/list") viewList();
  // Case-law and Schemes/RPs list pages retired: the dashboard Case law / Schemes
  // & RPs chips carry that content, and every case/scheme links straight to its
  // source (BAILII judgment / analysis). viewCases/viewRestructurings are kept
  // (dormant) for reuse; a stray hit on the old routes lands on the dashboard.
  else if (path.startsWith("/item/")) viewItem(decodeURIComponent(path.slice("/item/".length)));
  else if (path.startsWith("/firm/")) viewFirm(decodeURIComponent(path.slice("/firm/".length)));
  else viewDashboard();

  updateSavedCount();
  syncNavActive(hash);
}

function syncNavActive(hash) {
  document.querySelectorAll(".mainnav .nav-link").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === hash);
  });
}

// Delegate: save buttons + chart drill-down (data-area / data-tier).
document.addEventListener("click", (e) => {
  const saveBtn = e.target.closest("[data-save]");
  if (saveBtn) {
    e.preventDefault();
    const id = saveBtn.getAttribute("data-save");
    const nowSaved = toggleSaved(id);
    saveBtn.classList.toggle("is-saved", nowSaved);
    saveBtn.setAttribute("aria-pressed", String(nowSaved));
    saveBtn.textContent = nowSaved ? "★ Saved" : "☆ Save";
    // If we're viewing "saved only", drop the card immediately.
    if (filterState.saved && document.getElementById("results")) renderResults();
    return;
  }
  const navEl = e.target.closest("[data-area],[data-tier],[data-year],[data-month]");
  if (navEl) {
    const params = new URLSearchParams();
    if (navEl.dataset.area) params.set("area", navEl.dataset.area);
    if (navEl.dataset.tier) params.set("tier", navEl.dataset.tier);
    if (navEl.dataset.year) params.set("year", navEl.dataset.year);
    if (navEl.dataset.month) params.set("month", navEl.dataset.month);
    location.hash = "#/list?" + params.toString();
  }
});

// Keyboard activation for chart drill-down elements.
document.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.matches?.("[data-area],[data-tier],[data-year],[data-month]")) {
    e.preventDefault();
    e.target.click();
  }
});

// ---- Top-bar chrome: "Updated …" status + Cloudflare Access identity --------
// ---- Notifications bell: feed items new since the bell was last opened ------
// In the topbar (outside #app) so it persists across every tab. "New" is the set
// of current item ids not yet acknowledged (localStorage).
// "Seen" ids sync per-user across devices via /api/notif-legal (KV keyed on the
// verified Access email), with localStorage as an instant cache / offline
// fallback — so acknowledging items on one device clears them on the others.
const NOTIF_KEY = "meridian.legal.notifSeen";
const NOTIF_API = "/api/notif-legal";
let notifSeen = null;    // resolved array of acknowledged ids (null until known)
let notifCloud = false;  // true once the per-user seen-set API responds
// Source label for a case-law / restructuring judgment link (BAILII, the
// National Archives, or the Supreme Court site). Alerts & RPs use the firm name.
const JUDGMENT_SOURCES = {
  "bailii.org": "BAILII", "caselaw.nationalarchives.gov.uk": "National Archives",
  "supremecourt.uk": "Supreme Court", "judiciary.uk": "Judiciary",
};
function judgmentSource(url) {
  try { const h = new URL(url).hostname.replace(/^www\./, ""); return JUDGMENT_SOURCES[h] || "Judgment"; }
  catch { return "Judgment"; }
}
function firmName(id) { return (firmById[id] || {}).name || id || ""; }
function notifReadLocal() {
  try { const p = JSON.parse(localStorage.getItem(NOTIF_KEY) || "null"); return Array.isArray(p) ? p : null; } catch { return null; }
}
function notifPersist(ids) {
  notifSeen = ids;
  try { localStorage.setItem(NOTIF_KEY, JSON.stringify(ids)); } catch { /* */ }
  if (notifCloud) fetch(NOTIF_API, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ seen: ids }) }).catch(() => {});
}
// Only surface RECENT updates in the bell — not the whole back-catalogue (see the
// same helper in Credit). Older items stay browsable in the feeds.
const NOTIF_WINDOW_DAYS = 7;
function notifTime(d) { if (!d) return null; const s = /^\d{4}-\d{2}$/.test(d) ? d + "-01" : d; const t = Date.parse(s); return isNaN(t) ? null : t; }
function recentNotif(list) {
  const times = list.map((x) => notifTime(x.date)).filter((t) => t != null);
  if (!times.length) return list;
  const cutoff = Math.max(...times) - NOTIF_WINDOW_DAYS * 864e5;
  return list.filter((x) => { const t = notifTime(x.date); return t != null && t >= cutoff; });
}
function notifItems() {
  const out = [];
  items.forEach((it) => out.push({ id: "u:" + it.id, date: it.date || "", kind: (typeById[it.type] || {}).name || it.type, title: it.title, source: firmName(it.firm), href: it.url || ("#/item/" + it.id), ext: !!it.url }));
  cases.forEach((c) => out.push({ id: "c:" + c.id, date: c.date || "", kind: c.court || "Case", title: c.name, source: judgmentSource(c.url), href: c.url || "#/", ext: !!c.url }));
  restructurings.forEach((r) => { const u = r.judgmentUrl || r.articleUrl; out.push({ id: "r:" + r.id, date: r.date || "", kind: r.type === "scheme" ? "Scheme" : "Plan", title: r.company, source: r.firm ? firmName(r.firm) : (r.judgmentUrl ? judgmentSource(r.judgmentUrl) : ""), href: u || "#/", ext: !!u }); });
  return recentNotif(out).sort((a, b) => String(b.date).localeCompare(String(a.date)));
}
function closeNotif() {
  const p = document.getElementById("notif-panel"), b = document.getElementById("notif-bell");
  if (p) p.setAttribute("hidden", "");
  if (b) b.setAttribute("aria-expanded", "false");
}
function renderNotifications() {
  const wrap = document.getElementById("notif");
  if (!wrap) return;
  const all = notifItems();
  const allIds = all.map((x) => x.id);
  const seenSet = notifSeen ? new Set(notifSeen) : null;
  const fresh = seenSet ? all.filter((x) => !seenSet.has(x.id)) : [];
  const n = fresh.length;
  const list = (n ? fresh : all).slice(0, 12);
  wrap.innerHTML = `
    <button type="button" class="notif-bell" id="notif-bell" aria-haspopup="true" aria-expanded="false" aria-label="Notifications${n ? ` — ${n} new` : ""}">
      <span class="notif-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>${n ? `<span class="notif-badge">${n > 9 ? "9+" : n}</span>` : ""}
    </button>
    <div class="notif-panel" id="notif-panel" role="menu" hidden>
      <div class="notif-head">${n ? `${n} new update${n > 1 ? "s" : ""}` : "No new updates"} <span class="muted small">· checked ${esc(fmtDate(LAST_CHECKED))}${LAST_CHECKED_TIME ? `, ${esc(LAST_CHECKED_TIME)}` : ""}</span></div>
      <ul class="notif-list">
        ${list.length ? list.map((x) => `<li class="notif-item${(n && fresh.includes(x)) ? " is-new" : ""}">
          <a href="${esc(x.href)}" ${x.ext ? 'target="_blank" rel="noopener noreferrer"' : ""} class="nf-row">
            <span class="nf-title">${esc(x.title)}</span>
            <span class="nf-meta"><span class="nf-code legal">LEX</span>${x.date ? `<span class="nf-time">${esc(fmtDate(x.date))}</span>` : ""}${x.source ? `<span class="nf-sep">·</span><span class="nf-src">${esc(x.source)}</span>` : ""}</span>
          </a>
        </li>`).join("") : '<li class="notif-empty muted small">Nothing yet.</li>'}
      </ul>
    </div>`;
  const bell = document.getElementById("notif-bell");
  const panel = document.getElementById("notif-panel");
  bell.addEventListener("click", (e) => {
    e.stopPropagation();
    if (panel.hasAttribute("hidden")) {
      panel.removeAttribute("hidden"); bell.setAttribute("aria-expanded", "true");
      notifPersist([...new Set([...(notifSeen || []), ...allIds])]);
      const badge = bell.querySelector(".notif-badge"); if (badge) badge.remove();
    } else { closeNotif(); }
  });
}
// Resolve the seen-set: instant render from localStorage, then reconcile with the
// per-user server copy so items acknowledged on another device drop off here too.
async function initNotif() {
  notifSeen = notifReadLocal();
  renderNotifications();
  let serverSeen = null;
  try {
    const r = await fetch(NOTIF_API, { headers: { accept: "application/json" } });
    if (r.ok) { const d = await r.json(); serverSeen = Array.isArray(d.seen) ? d.seen : []; notifCloud = true; }
  } catch { /* not behind Access → local-only */ }
  const allIds = notifItems().map((x) => x.id);
  const local = notifReadLocal() || [];
  const baseline = ((serverSeen && serverSeen.length) || local.length)
    ? [...new Set([...local, ...(serverSeen || [])])]
    : allIds;
  notifSeen = baseline;
  try { localStorage.setItem(NOTIF_KEY, JSON.stringify(baseline)); } catch { /* */ }
  if (notifCloud && (!serverSeen || baseline.length !== serverSeen.length)) {
    fetch(NOTIF_API, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ seen: baseline }) }).catch(() => {});
  }
  renderNotifications();
}
document.addEventListener("click", (e) => {
  const panel = document.getElementById("notif-panel");
  const isOpen = panel && !panel.hasAttribute("hidden");
  if (isOpen && !e.target.closest("#notif")) { e.preventDefault(); e.stopPropagation(); closeNotif(); }
}, true);
window.addEventListener("hashchange", closeNotif);

function initChrome() {
  const status = document.getElementById("data-status");
  if (status) {
    status.innerHTML = `<span class="ds-part">Last refresh ${fmtDate(LAST_CHECKED)}${LAST_CHECKED_TIME ? `, ${LAST_CHECKED_TIME}` : ""}</span>`;
    status.title = `Routine last ran ${fmtDate(LAST_CHECKED)}${LAST_CHECKED_TIME ? ` ${LAST_CHECKED_TIME}` : ""}; data last changed ${fmtDate(LAST_REVIEWED)}`;
  }
  // Same pattern as the Wire app / landing page: behind Cloudflare Access
  // this returns the verified email; otherwise we leave the slot empty.
  const acct = document.getElementById("account-nav");
  if (acct) {
    fetch("/api/me", { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        if (d && d.email) {
          acct.innerHTML = `<span class="si-prefix">Signed in as </span><strong>${esc(d.email)}</strong>`
            + ` · <a href="/cdn-cgi/access/logout">Sign out</a>`;
          // Remember verified sign-in so the Glance home can render optimistically
          // (skip its "Checking your sign-in…" splash) when the user navigates there.
          try { localStorage.setItem("m_signed_in", "1"); } catch { /* ignore */ }
        }
      })
      .catch(() => { /* not behind Access (e.g. local preview) — leave empty */ });
  }
}

// Swipe-to-change-section gesture removed by request (pull-to-refresh kept).

window.addEventListener("hashchange", router);
// iPhone: tapping the brand logo refreshes the current page rather than jumping
// back to Glance (the href="/" navigation is the desktop behaviour only).
document.addEventListener("click", (e) => {
  if (e.target.closest(".brand") && window.matchMedia("(max-width: 760px)").matches) {
    e.preventDefault(); location.reload();
  }
});
// Unified ⌘K / Ctrl-K search, mounted in-place (opens over the current app).
import("/palette.js?v=20260723-2").then((m) => m.mountPalette()).catch(() => {});
initChrome();
initNotif();
router();
markVisitedSoon();
initSavedSync();   // pull + merge the per-user saved list across devices (behind Access)
