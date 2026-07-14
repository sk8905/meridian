// =============================================================================
// Meridian Glance — the cross-desk landing. Imports the three apps' data modules
// (same-origin ES modules), renders a sectioned highlight card per platform
// (Macro, Credit, Legal — 3 most-recent items per section), mounts the Credit
// "key rates & credit spreads" bar, and powers a unified ⌘K command palette that
// searches deals, managers, funds, legal alerts, cases, restructurings, macro
// indicators and views — deep-linking into each app. Zero dependencies; loaded
// only once the user is authenticated.
// =============================================================================
// Data modules are versioned (matching each app) so the live Glance busts its
// cache with the four-times-daily data refresh instead of serving a stale copy.
import { deals, intel, managers, funds, LAST_CHECKED, LAST_CHECKED_TIME } from "/credit/js/data.js?v=20260714-2";
import { items, cases, restructurings, firmById } from "/legal/js/data.js?v=20260714-2";
import { NEWS, ALERTS, ARTICLES, COMMENTARY, CYCLE, BUBBLE, OUTLOOK } from "/macro/js/content.js?v=20260714-2";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const byDateDesc = (a, b) => String(b.date || "").localeCompare(String(a.date || ""));
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ""); return m ? `${+m[3]} ${MON[+m[2] - 1]} ${m[1]}` : (iso || ""); };
const mgrName = (id) => (managers.find((m) => m.id === id) || {}).name || "";

// ---- Notification source labels (kept in sync with each app's copy) --------
// Credit: outlet/wire from sourceUrl, else the manager's own PR (manager name).
// Legal: firm name for alerts/RPs, judgment host for cases. Macro data: series
// source (FRED/ONS/…). Editorial macro guidance has no single external source.
const NEWS_SOURCES = {
  "bloomberg.com": "Bloomberg", "reuters.com": "Reuters", "ft.com": "Financial Times",
  "wsj.com": "WSJ", "cnbc.com": "CNBC", "marketwatch.com": "MarketWatch",
  "creditflux.com": "Creditflux", "alternativecreditinvestor.com": "Alternative Credit Investor",
  "privatedebtinvestor.com": "Private Debt Investor", "privateequitywire.co.uk": "Private Equity Wire",
  "privateequityinternational.com": "Private Equity International", "penews.com": "Private Equity News",
  "pehub.com": "PE Hub", "with-intelligence.com": "With Intelligence", "fnlondon.com": "Financial News",
  "globenewswire.com": "GlobeNewswire", "businesswire.com": "Business Wire", "prnewswire.com": "PR Newswire",
  "finance.yahoo.com": "Yahoo Finance", "fintech.global": "FinTech Global", "citywire.com": "Citywire",
};
const JUDGMENT_SOURCES = {
  "bailii.org": "BAILII", "caselaw.nationalarchives.gov.uk": "National Archives",
  "supremecourt.uk": "Supreme Court", "judiciary.uk": "Judiciary",
};
const srcHost = (url) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; } };
const tidyDomain = (host) => { const l = host.split(".").slice(-2, -1)[0] || host; return l ? l.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : ""; };
function creditSource(rec) {
  const host = srcHost(rec.sourceUrl);
  if (host && NEWS_SOURCES[host]) return NEWS_SOURCES[host];
  const nm = rec.managerId ? mgrName(rec.managerId) : "";
  return nm || (host ? tidyDomain(host) : "");
}
const firmName = (id) => (firmById[id] || {}).name || id || "";
const judgmentSource = (url) => { const h = srcHost(url); return JUDGMENT_SOURCES[h] || "Judgment"; };
// Mirror of credit/js/app.js feedDedupKey — the canonical identity of a feed
// event (source URL, else title). It is stamped on every manager-feed row as
// data-fkey, so a news notification can deep-link (#/manager/<id>?focus=k:<key>)
// and focus the exact story even when it collapses into a deal/intel row.
function feedDedupKey(x) {
  const u = (x.url || x.sourceUrl || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
  const generic = !u || /^https?:\/\/[^/]+$/.test(u) || /\/(news-insights|news|press-releases|media|insights|press)$/.test(u);
  if (!generic) return "u:" + u;
  return "t:" + (x.title || x.headline || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

const MACRO_INDICATORS = [
  ["base_rate", "Base rate"], ["two_year", "2-year yield"], ["core_cpi", "Core inflation"],
  ["services_pmi", "Services PMI"], ["wages", "Wage growth"], ["unemployment", "Unemployment"],
];

let _inited = false;
const fmtRefresh = () => `${fmt(LAST_CHECKED)}${LAST_CHECKED_TIME ? `, ${LAST_CHECKED_TIME}` : ""}`;

export function initGlance() {
  if (_inited) return; _inited = true;
  renderFeed();
  renderMacroSnapshot();
  initMarkets();
  initRates();
  initPulse();
  initGlanceTickerToggle();
  const rf = document.getElementById("g-refresh");
  if (rf) rf.textContent = `Last refresh ${fmtRefresh()}`;
  initNotifBell();
  initMarketsPanel();
  initJumpNav();
  wirePalette(buildIndex());
  startLiveRefresh();
  import("/ptr.js?v=20260711-6").then((m) => m.initPullToRefresh()).catch(() => {});
}

// On phones the ticker chips are collapsed behind a chevron at the end of each
// one-liner; a single delegated handler toggles the block open/closed. On
// desktop the chips are always visible (CSS) and the chevron is hidden, so this
// listener never fires there.
function initGlanceTickerToggle() {
  const glance = document.getElementById("g-glance");
  if (!glance) return;
  glance.addEventListener("click", (e) => {
    const btn = e.target.closest(".gl-tk-toggle");
    if (!btn) return;
    const block = btn.closest(".g-gl-block");
    if (!block) return;
    const open = block.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Hide related tickers" : "Show related tickers");
  });
}

// ---- iPhone markets/rates dropdown -----------------------------------------
// On phones the right-hand markets + key-rates sidebar (.g-side) is relocated into
// a dropdown panel behind the chart button in the top bar, so the numbers are one
// tap away without pushing the news feed down. The SAME .g-side node moves between
// the layout grid (desktop) and the panel (phone) — one fetch/render feeds both,
// no duplicated markup. Desktop leaves it in the grid and hides the button (CSS).
function initMarketsPanel() {
  const btn = document.getElementById("g-mkt-btn");
  const panel = document.getElementById("g-mkt-panel");
  const side = document.querySelector(".g-side");
  const layout = document.querySelector(".g-layout");
  if (!btn || !panel || !side || !layout) return;
  const mq = matchMedia("(max-width:760px)");
  const close = () => { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); };
  const place = () => {
    if (mq.matches) { if (side.parentElement !== panel) panel.appendChild(side); }
    else { if (side.parentElement !== layout) layout.appendChild(side); close(); }
  };
  place();
  mq.addEventListener("change", place);
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = panel.hidden;
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    // The panel is position:fixed on phones — pin it just under the button in
    // viewport coords (the bar height varies with the safe-area inset).
    if (open && mq.matches) {
      const r = btn.getBoundingClientRect();
      panel.style.top = `${Math.round(r.bottom + 8)}px`;
    }
  });
  // Tap outside the panel (or press Escape) closes it.
  document.addEventListener("click", (e) => {
    if (panel.hidden) return;
    if (e.target.closest("#g-mkt-panel") || e.target.closest("#g-mkt-btn")) return;
    close();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

// ---- Section jump-links ----------------------------------------------------
// The top-bar strip (Markets · Rates · Macro · Credit · Legal) smooth-scrolls to
// each briefing section (handled by CSS scroll-behavior + the anchor hrefs). An
// IntersectionObserver here highlights whichever section is currently in view.
function initJumpNav() {
  const links = Array.from(document.querySelectorAll(".g-jump-link"));
  if (!links.length || !("IntersectionObserver" in window)) return;
  const byId = new Map(links.map((a) => [a.dataset.jump, a]));
  const targets = links.map((a) => document.getElementById(a.dataset.jump)).filter(Boolean);
  const visible = new Set();
  // A recent explicit click wins over scroll-spy for a moment (on desktop the
  // three platform cards share one row, so a jump can't distinguish them by
  // scroll position — honour what the user tapped).
  let holdUntil = 0;
  const setActive = (id) => links.forEach((a) => a.classList.toggle("active", a.dataset.jump === id));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) visible.add(e.target.id); else visible.delete(e.target.id);
    }
    if (Date.now() < holdUntil) return;
    // Highlight the first section (in document order) currently on screen.
    for (const t of targets) { if (visible.has(t.id)) { setActive(t.id); return; } }
  }, { rootMargin: "-80px 0px -55% 0px", threshold: 0 });
  targets.forEach((t) => io.observe(t));
  // Clicking a link highlights it immediately and holds through the scroll.
  links.forEach((a) => a.addEventListener("click", () => { holdUntil = Date.now() + 900; setActive(a.dataset.jump); }));
}

// Auto-refresh the live markets + rates bands and the two hero one-liners every
// 5 minutes while the page is open. This is CLIENT-SIDE ONLY — it just re-hits
// the /api/markets and /api/rates feeds (no Claude, no scheduled routine, no
// cost of note). Everything else on the page keeps the 4×/day editorial
// cadence. Work is skipped while the tab is hidden and caught up on return.
const LIVE_REFRESH_MS = 5 * 60 * 1000;
let _lastLive = Date.now();
function refreshLive() { _lastLive = Date.now(); initMarkets(); initRates(); initPulse(); }
function startLiveRefresh() {
  setInterval(() => { if (!document.hidden) refreshLive(); }, LIVE_REFRESH_MS);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && Date.now() - _lastLive > LIVE_REFRESH_MS) refreshLive();
  });
}

// Deep-link a Credit deal/intel record to its exact row in the right feed tab
// (Credit reads ?focus=<id> on load and scrolls/flashes it). CLO-tagged items
// live in the CLOs tab regardless of which section surfaced them.
const creditItemHref = (x, tab) => `/credit/#/${x.clo ? "clos" : tab}?focus=${encodeURIComponent(x.id)}`;

// ---- Highlight cards -------------------------------------------------------
// Each platform card is broken into its natural sections, newest 3 items each.
// One cross-desk feed of everything dated TODAY — Macro headlines (market + US +
// UK), Credit deals / fundraising / CLOs, and Legal alerts / case law / schemes —
// interleaved across desks so it reads as a single merged feed, not three blocks.
// Falls back to the most-recent date present if nothing is dated today, so the
// feed is never empty between refreshes.
const DESK = { m: "Macro", c: "Credit", l: "Legal" };
function renderFeed() {
  // `time` is the article's publish time (e.g. "14:05", Europe/London) when the
  // data carries one — the four-times-daily routine populates it; rows lead with
  // it and the feed ranks newest→oldest by date+time. Absent → row leads with the
  // headline (no fabricated time) until the next refresh backfills it.
  const mk = (desk, href, title, source, ext, date, time) =>
    ({ desk, href, title, ext, date, time: time || "", src: source || "" });

  // Every dated, sourced Macro item: the reading list (ARTICLES), the dashboard
  // headlines (NEWS US/UK) and the economist commentary (COMMENTARY US/UK). Deduped
  // by title below, so cross-section overlap collapses to one row.
  const macro = [];
  ((ARTICLES && ARTICLES.items) || []).forEach((n) => macro.push(mk("m", n.url, n.title, n.source, true, n.date, n.time)));
  (((NEWS && NEWS.us) || [])).forEach((n) => macro.push(mk("m", n.url, n.title, n.source, true, n.date, n.time)));
  (((NEWS && NEWS.uk) || [])).forEach((n) => macro.push(mk("m", n.url, n.title, n.source, true, n.date, n.time)));
  (((COMMENTARY && COMMENTARY.us) || [])).forEach((n) => macro.push(mk("m", n.url, n.title, n.source, true, n.date, n.time)));
  (((COMMENTARY && COMMENTARY.uk) || [])).forEach((n) => macro.push(mk("m", n.url, n.title, n.source, true, n.date, n.time)));

  const credit = [];
  deals.forEach((d) => credit.push(mk("c", creditItemHref(d, "deals"), d.headline, creditSource(d), false, d.date, d.time)));
  intel.forEach((i) => credit.push(mk("c", creditItemHref(i, "intel"), i.headline, creditSource(i), false, i.date, i.time)));

  const legal = [];
  items.forEach((i) => { if (i.date) legal.push(mk("l", `/legal/#/item/${encodeURIComponent(i.id)}`, i.title, firmName(i.firm), false, i.date, i.time)); });
  cases.forEach((c) => { if (c.date) legal.push(mk("l", `/legal/#/cases?case=${encodeURIComponent(c.id)}`, c.name, c.court, false, c.date, c.time)); });
  restructurings.forEach((r) => { if (r.date) legal.push(mk("l", `/legal/#/restructurings?m=${encodeURIComponent(r.id)}`, r.company, r.type === "scheme" ? "Scheme" : "Restructuring plan", false, r.date, r.time)); });

  const day = (x) => String(x.date || "").slice(0, 10);
  const all = [...macro, ...credit, ...legal];
  const now = new Date();
  const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const target = all.some((x) => day(x) === todayISO) ? todayISO : all.reduce((m, x) => (day(x) > m ? day(x) : m), "");

  // Dedupe by normalised title (Macro market-headlines overlap the US/UK feeds).
  const norm = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  const dedupe = (list) => { const seen = new Set(); return list.filter((x) => { const k = norm(x.title); if (seen.has(k)) return false; seen.add(k); return true; }); };
  const pick = (list) => dedupe(list.filter((x) => day(x) === target).sort(byDateDesc));
  const lists = [pick(macro), pick(credit), pick(legal)];
  const seen = new Set();
  const feed = [];
  for (let i = 0; lists.some((l) => i < l.length); i++) lists.forEach((l) => {
    if (i < l.length) { const k = norm(l[i].title); if (!seen.has(k)) { seen.add(k); feed.push(l[i]); } }
  });
  // Show up to ~25 stories: if today alone has fewer, backfill with the most recent
  // items from earlier days (newest-first, deduped) so the feed stays substantial.
  const CAP = 25;
  if (feed.length < CAP) {
    for (const x of all.filter((x) => day(x) !== target).sort(byDateDesc)) {
      if (feed.length >= CAP) break;
      const k = norm(x.title); if (!seen.has(k)) { seen.add(k); feed.push(x); }
    }
  }
  feed.length = Math.min(feed.length, CAP);

  const row = (o) => {
    // The item's OWN frozen time (real publish, else the run that first found it —
    // stamped into the data by the routine). No moving global fallback, so a story's
    // time never re-times to the latest run.
    const t = o.time || "";
    const tspan = t ? `<span class="g-feed-time">${esc(t)}</span>` : "";
    return `<a class="g-feed-row g-desk-${o.desk}" href="${esc(o.href)}"${o.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>`
      + tspan
      + `<span class="g-feed-title">${esc(o.title)}</span>`
      + (o.src ? `<span class="g-feed-src">${esc(o.src)}</span>` : "")
      + `<span class="g-feed-desk">${esc(DESK[o.desk])}</span></a>`;
  };
  // Rank strictly newest→oldest (by day, then publish time), grouped into days;
  // each day is introduced by a date header and its rows lead with the time.
  feed.sort((a, b) => day(b).localeCompare(day(a)) || String(b.time || "").localeCompare(String(a.time || "")));
  let lastDay = null;
  const body = feed.map((o) => {
    const d = day(o);
    const hdr = d !== lastDay ? `<div class="g-feed-dayhdr">${esc(fmt(d))}</div>` : "";
    lastDay = d;
    return hdr + row(o);
  }).join("");
  setHTML("g-feed", feed.length ? body : `<div class="g-empty">No news yet today — check back shortly.</div>`);
  const head = document.getElementById("g-feed-head");
  if (head) head.textContent = feed.length ? "Latest news" : "Today";
}
// ---- Macro snapshot (right sidebar) ----------------------------------------
// A compact read of the three Macro views — policy rate, cycle position and
// bubble risk — filling the space below the markets/rates bands. Each block
// deep-links into the Macro app. Values mirror macro/js/content.js and the
// bubble-composite / band logic in macro/js/app.js.
const bubbleComposite = () => {
  const d = (BUBBLE && BUBBLE.dimensions) || [];
  const w = d.reduce((s, x) => s + x.weight, 0) || 1;
  return Math.round(d.reduce((s, x) => s + x.score * x.weight, 0) / w);
};
const bubbleBand = (s) => (s < 20 ? "Low" : s < 40 ? "Moderate" : s < 65 ? "Elevated" : s < 82 ? "High" : "Extreme");
const shortStage = (s) => String(s || "").split("—")[0].trim();
let _gsg = 0;
// A thin 0–100 gradient track with one dot per item (viewBox kept ~12.5:1 so it
// scales uniformly to the column width without distorting the dots).
function snapGauge(items) {
  const x0 = 2, x1 = 98, id = `gsg${_gsg++}`;
  const X = (p) => (x0 + Math.max(0, Math.min(100, p)) / 100 * (x1 - x0)).toFixed(1);
  const dots = items.map((it) => {
    const x = X(it.pos);
    return `<line x1="${x}" y1="0.6" x2="${x}" y2="7.4" stroke="var(--macro)" stroke-width="1.1"/>`
      + `<circle cx="${x}" cy="4" r="2.3" fill="var(--macro)" stroke="var(--surface)" stroke-width="1"><title>${esc(it.label)} · ${it.pos}</title></circle>`;
  }).join("");
  return `<svg class="g-snap-gauge" viewBox="0 0 100 8" role="img" aria-hidden="true">`
    + `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="var(--gauge-lo, #d7e3f4)"/><stop offset="1" stop-color="var(--macro)"/></linearGradient></defs>`
    + `<rect x="${x0}" y="3" width="${x1 - x0}" height="2" rx="1" fill="url(#${id})"/>${dots}</svg>`;
}
function renderMacroSnapshot() {
  const el = document.getElementById("g-macro-snap");
  if (!el || !CYCLE || !BUBBLE || !OUTLOOK) return;
  const comp = bubbleComposite();
  // One 3-column grid (country · rate · stance) shared by both rows so the rate
  // and stance columns line up even though the two rates differ in width.
  const pol = (cc, o) => `<span class="g-snap-cc">${cc}</span>`
    + `<span class="g-snap-pv">${esc(o.rate)}</span><span class="g-snap-ps">${esc(o.stance)}</span>`;
  const scale = (lo, hi) => `<div class="g-snap-scale"><span>${lo}</span><span>${hi}</span></div>`;
  el.innerHTML =
    `<a class="g-snap-blk" href="/macro/#/policy">`
      + `<div class="g-snap-h"><span class="g-snap-t">Policy rate</span><span class="g-snap-cap">Next 28–30 Jul</span></div>`
      + `<div class="g-snap-pol">` + pol("US", OUTLOOK.us) + pol("UK", OUTLOOK.uk) + `</div>`
    + `</a>`
    + `<a class="g-snap-blk" href="/macro/#/cycle">`
      + `<div class="g-snap-h"><span class="g-snap-t">Cycle position</span><span class="g-snap-cap">${esc(shortStage(CYCLE.us.shortStage))}</span></div>`
      + snapGauge([{ label: "US", pos: CYCLE.us.pos }, { label: "UK", pos: CYCLE.uk.pos }])
      + scale("Early", "Crisis")
      + `<div class="g-snap-sub">US ${CYCLE.us.pos} · UK ${CYCLE.uk.pos}</div>`
    + `</a>`
    + `<a class="g-snap-blk" href="/macro/#/bubble">`
      + `<div class="g-snap-h"><span class="g-snap-t">Bubble risk</span><span class="g-snap-cap">${esc(bubbleBand(comp))}</span></div>`
      + snapGauge([{ label: "Composite", pos: comp }])
      + scale("Low", "Extreme")
      + `<div class="g-snap-sub">${esc(BUBBLE.market)} · composite ${comp}/100</div>`
    + `</a>`;
}
const sec = (key, n, title, arr) => setHTML(`${key}-sec${n}`, subHead(title) + rows(arr));
function item(href, title, meta, ext) {
  const a = ext ? ` target="_blank" rel="noopener noreferrer"` : "";
  return `<a class="g-item" href="${esc(href)}"${a}><span class="t">${esc(title)}</span><span class="m">${esc(meta)}</span></a>`;
}
const rows = (arr) => { const h = arr.filter(Boolean).join(""); return h || `<div class="g-empty">Nothing to show yet.</div>`; };
const subHead = (t) => `<div class="g-sub-h">${esc(t)}</div>`;
const setHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

// ---- Key rates & credit spreads (ported from Credit) -----------------------
function fmtRate(v, unit) {
  if (v == null) return "—";
  return unit === "bp" ? `${Math.round(v * 100)} bp` : `${v.toFixed(2)}%`;
}
function ratesTile(x) {
  const val = fmtRate(x.value, x.unit);
  let chg = '<span class="rate-chg flat">·</span>';
  if (x.change != null && x.value != null) {
    const c = x.unit === "bp" ? Math.round(x.change * 100) : +x.change.toFixed(2);
    const dir = c > 0 ? "up" : c < 0 ? "down" : "flat";
    const arrow = c > 0 ? "▲" : c < 0 ? "▼" : "·";
    const mag = x.unit === "bp" ? `${Math.abs(c)} bp` : Math.abs(c).toFixed(2);
    chg = `<span class="rate-chg ${dir}">${arrow} ${mag}</span>`;
  }
  const asOf = x.asOf ? ` as of ${esc(x.asOf)}` : "";
  const title = ` title="${esc(x.label)}${asOf} — open source"`;
  const tag = x.href ? "a" : "div";
  const attrs = x.href ? ` href="${esc(x.href)}" target="_blank" rel="noopener noreferrer"` : "";
  return `<${tag} class="rate-tile"${attrs}${title}><span class="rate-label">${esc(x.label)}</span><span class="rate-val">${val}</span>${chg}</${tag}>`;
}
// Last-good market/rates payloads, persisted so a reload (or a failed refetch)
// shows the most recent numbers immediately instead of a "Loading…" placeholder.
function readCache(key) { try { const s = localStorage.getItem("m_glance_" + key); return s ? JSON.parse(s) : null; } catch { return null; } }
function writeCache(key, d) { try { localStorage.setItem("m_glance_" + key, JSON.stringify(d)); } catch { /* quota/private mode — skip */ } }
function renderRates(el, d) {
  const rowsData = (d && d.rates) || [];
  if (!rowsData.length) return false;
  el.innerHTML = rowsData.map(ratesTile).join("") +
    '<a class="rate-src" href="https://fred.stlouisfed.org/" target="_blank" rel="noopener noreferrer">Source: FRED · ECB · NY Fed · US Treasury</a>';
  setGlance("gl-rates", _pulse.rates ? esc(_pulse.rates) : ratesOneLiner(rowsData));
  setGlTickers("rates", rateTickers(rowsData));
  return true;
}
function initRates() {
  const el = document.getElementById("g-rates");
  if (!el) return;
  // Render the last-good numbers instantly so a slow/failed refetch never drops
  // the tiles back to a "Loading…/unavailable" placeholder — the values just sit
  // until fresh ones land.
  renderRates(el, readCache("rates"));
  fetch("/api/rates?v=9")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d) => { if (renderRates(el, d)) writeCache("rates", d); })
    .catch(() => { if (!el.querySelector(".rate-tile") && !_pulse.rates) { el.innerHTML = '<span class="g-loading">Market rates unavailable right now.</span>'; setGlance("gl-rates", "Rates data unavailable right now."); } });
}

// ---- Market open / closed indicator ----------------------------------------
// Primary source is Yahoo's authoritative `marketState` (REGULAR = open),
// forwarded by /api/markets — it already accounts for holidays and half-days.
// The clock-based schedule below is only a FALLBACK for tiles that fell back to
// FRED/Stooq (which carry no session field), so a dot is always shown.
const MKT_TYPE = {
  "S&P 500": "us_equity", "NASDAQ": "us_equity", // NYSE/Nasdaq
  "IGWD": "lse_equity", "EMEE": "lse_equity",         // London Stock Exchange
  "Oil": "futures", "Gold": "futures", "DXY": "futures", // CME/ICE Globex (~24h)
  "Bitcoin": "crypto",                                 // 24/7
};
// Current weekday (0=Sun) + hour + minute in a given IANA timezone (DST-aware).
function zonedNow(tz) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const g = (t) => (parts.find((p) => p.type === t) || {}).value;
  const dow = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[g("weekday")];
  let h = +g("hour"); if (h === 24) h = 0; // some engines emit "24" at midnight
  return { dow, h, m: +g("minute") };
}
function marketOpen(type) {
  if (type === "crypto") return true;
  if (type === "us_equity") {
    const { dow, h, m } = zonedNow("America/New_York");
    if (dow === 0 || dow === 6) return false;
    const t = h * 60 + m; return t >= 570 && t < 960; // 09:30–16:00 ET
  }
  if (type === "lse_equity") {
    const { dow, h, m } = zonedNow("Europe/London");
    if (dow === 0 || dow === 6) return false;
    const t = h * 60 + m; return t >= 480 && t < 990; // 08:00–16:30 London
  }
  if (type === "futures") {
    // CME Globex: Sun 18:00 → Fri 17:00 ET, with a daily 17:00–18:00 ET halt.
    const { dow, h } = zonedNow("America/New_York");
    if (dow === 6) return false;      // Saturday
    if (dow === 0) return h >= 18;    // Sunday reopen 18:00 ET
    if (dow === 5) return h < 17;     // Friday close 17:00 ET
    return h !== 17;                  // Mon–Thu: closed 17:00–17:59 ET
  }
  return true;
}
// Descriptive tooltip for each Yahoo session state (dot is green only in the
// regular session; pre/post/closed are all red but read differently on hover).
const MKT_STATE_LABEL = {
  REGULAR: "Market open", PRE: "Pre-market", PREPRE: "Pre-market",
  POST: "After-hours", POSTPOST: "After-hours", CLOSED: "Market closed",
};
// Is this market in its regular session? Yahoo's marketState is authoritative;
// otherwise fall back to the clock-based schedule (returns false if neither is
// available for the label).
function isMarketOpen(x) {
  if (x.marketState) return x.marketState === "REGULAR";
  const type = MKT_TYPE[x.label];
  return type ? marketOpen(type) : false;
}
function marketDot(x) {
  let tip;
  if (x.marketState) {                       // authoritative — from Yahoo
    tip = MKT_STATE_LABEL[x.marketState] || (x.marketState === "REGULAR" ? "Market open" : "Market closed");
  } else {                                    // fallback — clock-based schedule
    if (!MKT_TYPE[x.label]) return "";
    tip = isMarketOpen(x) ? "Market open" : "Market closed";
  }
  const state = isMarketOpen(x) ? "open" : "closed";
  return ` <span class="mkt-dot ${state}" title="${esc(tip)}" aria-label="${esc(tip)}"></span>`;
}
// ---- At-a-glance one-liners (hero) -----------------------------------------
// Two short, plain-language NARRATIVES synthesised from the same live feeds as
// the bands below (which carry the numbers) — a qualitative read, refreshed
// automatically on each four-times-daily data pull.
const glSign = (v) => (v > 0 ? "up" : v < 0 ? "down" : "flat");
// Qualitative move word from a % change, using a caller-supplied vocabulary.
function moveWord(v, w) {
  const a = Math.abs(v);
  if (a < 0.1) return w.flat;
  if (v > 0) return a > 1.2 ? (w.strongUp || w.up) : w.up;
  return a > 1.2 ? (w.strongDown || w.down) : w.down;
}
const avgOf = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function marketsOneLiner(rows) {
  if (!rows || !rows.length) return "Markets data unavailable right now.";
  const by = {}; rows.forEach((r) => { by[r.label] = r; });
  const pct = (l) => (by[l] && by[l].changePct != null ? +Number(by[l].changePct) : null);
  const futOf = (l) => (by[l] && by[l].futuresPct != null ? +Number(by[l].futuresPct) : null);
  const eqClauses = [];
  // US equities — when Wall Street is shut, lead with what the futures imply.
  const usAvg = avgOf(["S&P 500", "NASDAQ"].map(pct).filter((v) => v != null));
  const usFut = avgOf(["S&P 500", "NASDAQ"].map(futOf).filter((v) => v != null));
  const usClosed = by["S&P 500"] && !isMarketOpen(by["S&P 500"]);
  if (usClosed && usFut != null) {
    eqClauses.push(`Wall Street is closed, with futures pointing ${moveWord(usFut, { up: "higher", down: "lower", flat: "flat", strongUp: "sharply higher", strongDown: "sharply lower" })}`);
  } else if (usAvg != null) {
    eqClauses.push(`US equities are ${moveWord(usAvg, { up: "firmer", down: "softer", flat: "little changed", strongUp: "rallying", strongDown: "selling off" })}`);
  }
  // London indices.
  const lonAvg = avgOf(["IGWD", "EMEE"].map(pct).filter((v) => v != null));
  if (lonAvg != null) {
    const lonOpen = by["IGWD"] && isMarketOpen(by["IGWD"]);
    eqClauses.push(`London ${lonOpen ? "is trading" : "ended"} ${moveWord(lonAvg, { up: "firmer", down: "softer", flat: "flat" })}`);
  }
  // Commodities.
  const cmdty = [];
  const oil = pct("Oil");
  if (oil != null) cmdty.push(`crude oil ${moveWord(oil, { up: "firmed", down: "eased", flat: "held steady", strongUp: "jumped", strongDown: "slid" })}`);
  const gold = pct("Gold");
  if (gold != null) cmdty.push(`gold ${moveWord(gold, { up: "advanced", down: "slipped", flat: "was flat", strongUp: "surged", strongDown: "fell" })}`);
  const dxy = pct("DXY");
  if (dxy != null) cmdty.push(`the dollar ${moveWord(dxy, { up: "firmed", down: "eased", flat: "was steady", strongUp: "jumped", strongDown: "slid" })}`);
  let s = eqClauses.join(" while ");
  if (cmdty.length) {
    const list = cmdty.length === 1 ? cmdty[0] : cmdty.slice(0, -1).join(", ") + " and " + cmdty[cmdty.length - 1];
    s += (s ? "; " : "") + list;
  }
  return s ? cap(s) + "." : "Markets are quiet.";
}
function ratesOneLiner(rows) {
  if (!rows || !rows.length) return "Rates data unavailable right now.";
  const by = {}; rows.forEach((r) => { by[r.label] = r; });
  const clauses = [];
  const t = by["US 10Y"];
  if (t && t.change != null) {
    const bp = t.change * 100;
    const w = Math.abs(bp) < 2 ? "holding steady" : bp > 0 ? (bp > 8 ? "pushing higher" : "drifting higher") : (bp < -8 ? "falling back" : "edging lower");
    clauses.push(`Treasury yields are ${w}`);
  } else {
    clauses.push("Treasury yields are steady");
  }
  const chgs = ["US IG OAS", "US HY OAS"].map((l) => (by[l] && by[l].change != null ? by[l].change : null)).filter((v) => v != null);
  let sprAvg = null;
  if (chgs.length) {
    sprAvg = avgOf(chgs);
    const w = Math.abs(sprAvg) < 0.01 ? "broadly stable" : sprAvg < 0 ? "grinding tighter" : "leaking wider";
    clauses.push(`credit spreads are ${w}`);
  }
  let s = clauses.join(" and ");
  if (sprAvg != null) s += sprAvg < -0.005 ? ", keeping financial conditions supportive" : sprAvg > 0.005 ? ", a mildly risk-off tone" : "";
  return cap(s) + ".";
}
function setGlance(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }

// ---- Per-one-liner ticker chips --------------------------------------------
// Below each hero narrative we surface up to five up/down chips drawn from the
// SAME live feed that powers the line — the biggest movers, so the chips read
// "in line with the context". Desktop shows them inline; phones tuck them behind
// a chevron toggle (CSS-only; the toggle is wired in initGlance).
function glTkChip(label, dir, mag) {
  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "·";
  return `<span class="gl-tk ${dir}"><span class="gl-tk-l">${esc(label)}</span><span class="gl-tk-c">${arrow} ${esc(mag)}</span></span>`;
}
// Markets: rank by the effective move (futures-implied when the market is shut,
// else the daily %), take the five largest, render as signed % chips.
function marketTickers(rows) {
  const scored = (rows || [])
    .filter((x) => x.value != null)
    .map((x) => {
      const move = (!isMarketOpen(x) && x.futuresPct != null) ? +Number(x.futuresPct)
        : (x.changePct != null ? +Number(x.changePct) : null);
      return move == null ? null : { label: x.label, move };
    })
    .filter(Boolean)
    .sort((a, b) => Math.abs(b.move) - Math.abs(a.move))
    .slice(0, 5);
  return scored.map((s) => glTkChip(s.label, glSign(s.move), `${Math.abs(s.move).toFixed(2)}%`)).join("");
}
// Rates & spreads: rank by the move in basis points (both yields and OAS change
// are decimals of a percentage point, so ×100 → bp), take the five largest.
function rateTickers(rows) {
  const scored = (rows || [])
    .filter((x) => x.value != null && x.change != null)
    .map((x) => ({ label: x.label, bp: Math.round(x.change * 100) }))
    .sort((a, b) => Math.abs(b.bp) - Math.abs(a.bp))
    .slice(0, 5);
  return scored.map((s) => glTkChip(s.label, glSign(s.bp), `${Math.abs(s.bp)} bp`)).join("");
}
// Paint the chip row and reveal the phone toggle only when there are chips.
function setGlTickers(kind, html) {
  const box = document.getElementById(`gl-${kind}-tk`);
  if (box) box.innerHTML = html;
  const btn = document.querySelector(`.gl-tk-toggle[data-gl="${kind}"]`);
  if (btn) btn.hidden = !html;
}

// Thousands+ round to a whole number; smaller prices keep two decimals.
function fmtPrice(n) {
  n = Number(n);
  return n >= 1000
    ? Math.round(n).toLocaleString("en-US", { maximumFractionDigits: 0 })
    : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
// ---- Markets banner: equity indices + ETFs (same tile style as the rates) --
function marketTile(x) {
  const val = x.value != null ? fmtPrice(x.value) : "—";
  let chg = '<span class="rate-chg flat">·</span>';
  if (x.changePct != null && x.value != null) {
    const c = +Number(x.changePct).toFixed(2);
    const dir = c > 0 ? "up" : c < 0 ? "down" : "flat";
    const arrow = c > 0 ? "▲" : c < 0 ? "▼" : "·";
    chg = `<span class="rate-chg ${dir}">${arrow} ${Math.abs(c).toFixed(2)}%</span>`;
  }
  // While the market is closed, the daily change is stale — show the index
  // future's implied move (vs prior close) in square brackets alongside it.
  if (!isMarketOpen(x) && x.futuresPct != null) {
    const f = +Number(x.futuresPct).toFixed(2);
    const fdir = glSign(f);
    const farrow = f > 0 ? "▲" : f < 0 ? "▼" : "·";
    chg += ` <span class="mkt-fut ${fdir}" title="Index futures imply this open vs the prior close">[${farrow} ${Math.abs(f).toFixed(2)}%]</span>`;
  }
  const asOf = x.asOf ? ` as of ${esc(x.asOf)}` : "";
  const title = ` title="${esc(x.label)}${asOf} — open source"`;
  const tag = x.href ? "a" : "div";
  const attrs = x.href ? ` href="${esc(x.href)}" target="_blank" rel="noopener noreferrer"` : "";
  // Wrap the daily change + implied-open in one row so the bracket sits inline to
  // the right of the change rather than dropping to its own line.
  return `<${tag} class="rate-tile"${attrs}${title}><span class="rate-label">${esc(x.label)}${marketDot(x)}</span><span class="rate-val">${val}</span><span class="rate-chg-line">${chg}</span></${tag}>`;
}
function renderMarketsBand(el, d) {
  const rows = (d && d.markets) || [];
  if (!rows.length) return false;
  el.innerHTML = rows.map(marketTile).join("") +
    '<a class="rate-src" href="https://finance.yahoo.com/" target="_blank" rel="noopener noreferrer">Source: Yahoo Finance · FRED</a>';
  setGlance("gl-markets", _pulse.markets ? esc(_pulse.markets) : marketsOneLiner(rows));
  // Chips pick the top movers from a WIDER pool (the banner 8 + extra global
  // cross-asset instruments), so they aren't limited to the banner tiles.
  setGlTickers("markets", marketTickers([...rows, ...((d.moversExtra) || [])]));
  return true;
}
function initMarkets() {
  const el = document.getElementById("g-markets");
  if (!el) return;
  // Keep the last-good tiles up until fresh values arrive (never flash a
  // placeholder on a slow or failed refetch).
  renderMarketsBand(el, readCache("markets"));
  fetch("/api/markets?v=9")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d) => { if (renderMarketsBand(el, d)) writeCache("markets", d); })
    .catch(() => { if (!el.querySelector(".rate-tile") && !_pulse.markets) { el.innerHTML = '<span class="g-loading">Markets unavailable right now.</span>'; setGlance("gl-markets", "Markets data unavailable right now."); } });
}

// The "market pulse" — two direction+driver one-liners written server-side by
// Workers AI from the live feeds + headlines. When present it OVERRIDES the
// deterministic lines; when absent (first load, off-hours, or AI disabled) the
// page keeps the client-computed narrative. _pulse is consulted by initMarkets/
// initRates too, so it wins regardless of which request resolves last.
let _pulse = { markets: null, rates: null };
let _pulseRetried = false;
function initPulse() {
  fetch("/api/pulse", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d) return;
      _pulse = { markets: d.markets || null, rates: d.rates || null };
      if (_pulse.markets) setGlance("gl-markets", esc(_pulse.markets));
      if (_pulse.rates) setGlance("gl-rates", esc(_pulse.rates));
      // First view often precedes the first background generation — retry once.
      if (!_pulse.markets && !_pulseRetried) { _pulseRetried = true; setTimeout(initPulse, 15000); }
    })
    .catch(() => { /* keep deterministic lines */ });
}

// ---- Notifications: aggregate the three apps' unread counts ----------------
// Each app defines its own notification set + per-user "seen" ids (synced via
// /api/notif-<app>, KV keyed on the Access email, with localStorage as cache).
// Glance replays that model for all three and sums the unread counts on one bell.
// Only surface RECENT updates (within NOTIF_WINDOW_DAYS of the latest) so the
// historical back-catalogue doesn't flood the aggregated bell with old-dated
// items that are buried deep in each app's feeds.
const NOTIF_WINDOW_DAYS = 7;
function notifTime(d) { if (!d) return null; const s = /^\d{4}-\d{2}$/.test(d) ? d + "-01" : d; const t = Date.parse(s); return isNaN(t) ? null : t; }
function recentNotif(list) {
  const times = list.map((x) => notifTime(x.date)).filter((t) => t != null);
  if (!times.length) return list;
  const cutoff = Math.max(...times) - NOTIF_WINDOW_DAYS * 864e5;
  return list.filter((x) => { const t = notifTime(x.date); return t != null && t >= cutoff; });
}
function creditNotif() {
  const out = [];
  deals.forEach((d) => out.push({ id: "d:" + d.id, date: d.date || "", kind: d.type, title: d.headline, source: creditSource(d), href: creditItemHref(d, "deals") }));
  intel.forEach((i) => out.push({ id: "i:" + i.id, date: i.date || "", kind: i.type, title: i.headline, source: creditSource(i), href: creditItemHref(i, "intel") }));
  managers.forEach((m) => (m.webNews || []).forEach((w) => out.push({ id: "w:" + m.id + ":" + (w.url || w.title), date: w.date || "", kind: "News", title: w.title, source: w.outlet || m.name || "", href: "/credit/#/manager/" + m.id + "?focus=k:" + encodeURIComponent(feedDedupKey(w)) })));
  return recentNotif(out).sort(byDateDesc);
}
function legalNotif() {
  const out = [];
  items.forEach((it) => out.push({ id: "u:" + it.id, date: it.date || "", kind: "Alert", title: it.title, source: firmName(it.firm), href: "/legal/#/item/" + encodeURIComponent(it.id) }));
  cases.forEach((c) => out.push({ id: "c:" + c.id, date: c.date || "", kind: c.court || "Case", title: c.name, source: judgmentSource(c.url), href: "/legal/#/cases?case=" + encodeURIComponent(c.id) }));
  restructurings.forEach((r) => out.push({ id: "r:" + r.id, date: r.date || "", kind: r.type === "scheme" ? "Scheme" : "Plan", title: r.company, source: r.firm ? firmName(r.firm) : (r.judgmentUrl ? judgmentSource(r.judgmentUrl) : ""), href: "/legal/#/restructurings?m=" + encodeURIComponent(r.id) }));
  return recentNotif(out).sort(byDateDesc);
}
function macroDataAlerts(series) {
  return (series || []).filter((s) => s.value != null).map((s) => {
    const pct = s.unit === "%";
    const val = `${(+s.value).toFixed(2)}${pct ? "%" : ""}`;
    const country = s.country === "US" ? "US" : "UK";
    let chg = "";
    if (s.change != null && s.change !== 0) chg = ` · ${s.change > 0 ? "▲" : "▼"} ${Math.abs(s.change).toFixed(2)}${pct ? " pp" : ""} MoM`;
    else if (s.change === 0) chg = " · unchanged MoM";
    const flag = (s.key === "services_pmi" && +s.value < 50) ? " — below 50 (contraction)" : "";
    return { id: `d:${s.country}:${s.key}:${s.asOf}:${(+s.value).toFixed(2)}`, kind: "Economic data",
      title: `${country} · ${s.label}: ${val}${flag}${chg}`, source: s.source || "", href: `/macro/#/dashboard?focus=${s.country}-${s.key}`, date: s.asOf ? `${s.asOf}-01` : "" };
  });
}
let _macroSeries;
async function macroSeries() {
  if (_macroSeries) return _macroSeries;
  try { const r = await fetch("/api/macro", { headers: { accept: "application/json" } }); if (r.ok) { const d = await r.json(); _macroSeries = (d && d.series) || []; return _macroSeries; } } catch { /* offline */ }
  _macroSeries = []; return _macroSeries;
}
async function macroNotif() {
  const series = await macroSeries();
  const guidance = (ALERTS || []).map((a) => ({ id: a.id, date: a.date || "", kind: a.kind || "Guidance", title: a.title, source: "Meridian analysis", href: "/macro/" + (a.href || "#/policy") }));
  return [...guidance, ...macroDataAlerts(series)].sort(byDateDesc);
}
const NOTIF_APPS = [
  { key: "credit", tag: "Credit", api: "/api/notif-credit", ls: "meridian.credit.notifSeen", build: creditNotif },
  { key: "legal", tag: "Legal", api: "/api/notif-legal", ls: "meridian.legal.notifSeen", build: legalNotif },
  { key: "macro", tag: "Macro", api: "/api/notif-macro", ls: "meridian.macro.notifSeen", build: macroNotif },
];
async function resolveSeen(api, ls, allIds) {
  let local = null;
  try { const p = JSON.parse(localStorage.getItem(ls) || "null"); local = Array.isArray(p) ? p : null; } catch { /* */ }
  let server = null, cloud = false;
  try { const r = await fetch(api, { headers: { accept: "application/json" } }); if (r.ok) { const d = await r.json(); server = Array.isArray(d.seen) ? d.seen : []; cloud = true; } } catch { /* not behind Access */ }
  const hasHistory = (server && server.length) || (local && local.length);
  const baseline = hasHistory ? [...new Set([...(local || []), ...(server || [])])] : allIds.slice();
  return { baseline, cloud };
}
let _notifApps = null;
async function initNotifBell() {
  const wrap = document.getElementById("g-notif");
  if (!wrap) return;
  const apps = [];
  for (const cfg of NOTIF_APPS) {
    let list = [];
    try { list = await cfg.build(); } catch { list = []; }
    const allIds = list.map((x) => x.id);
    const { baseline, cloud } = await resolveSeen(cfg.api, cfg.ls, allIds);
    const set = new Set(baseline);
    apps.push({ ...cfg, list, allIds, baseline, cloud, unread: list.filter((x) => !set.has(x.id)) });
  }
  _notifApps = apps;
  renderBell();
}
function closeNotifPanel() {
  const p = document.getElementById("g-notif-panel"), b = document.getElementById("g-bell");
  if (p) p.setAttribute("hidden", "");
  if (b) b.setAttribute("aria-expanded", "false");
}
function markAllSeen() {
  (_notifApps || []).forEach((a) => {
    const merged = [...new Set([...a.baseline, ...a.allIds])];
    try { localStorage.setItem(a.ls, JSON.stringify(merged)); } catch { /* */ }
    if (a.cloud) fetch(a.api, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ seen: merged }) }).catch(() => {});
    a.baseline = merged; a.unread = [];
  });
  const badge = document.querySelector("#g-bell .g-badge"); if (badge) badge.remove();
}
function renderBell() {
  const wrap = document.getElementById("g-notif");
  if (!wrap || !_notifApps) return;
  const total = _notifApps.reduce((s, a) => s + a.unread.length, 0);
  const tagged = (a, arr) => arr.map((x) => ({ ...x, tag: a.tag, key: a.key }));
  const unreadAll = _notifApps.flatMap((a) => tagged(a, a.unread)).sort(byDateDesc);
  const listAll = _notifApps.flatMap((a) => tagged(a, a.list)).sort(byDateDesc);
  const show = (total ? unreadAll : listAll).slice(0, 24);
  const row = (x) => `<a class="g-np-item" href="${esc(x.href)}"><span class="g-np-tag ${x.key}">${esc(x.tag)}</span><span class="g-np-txt"><span class="g-np-t">${esc(x.title)}</span><span class="g-np-m">${esc(x.kind)}${x.date ? " · " + esc(fmt(x.date)) : ""}${x.source ? ` · <span class="g-np-src">${esc(x.source)}</span>` : ""}</span></span></a>`;
  wrap.innerHTML = `
    <button type="button" class="g-bell" id="g-bell" aria-haspopup="true" aria-expanded="false" aria-label="Notifications${total ? ` — ${total} new` : ""}">
      <span aria-hidden="true">🔔</span>${total ? `<span class="g-badge">${total > 9 ? "9+" : total}</span>` : ""}
    </button>
    <div class="g-notif-panel" id="g-notif-panel" role="menu" hidden>
      <div class="g-np-head">${total ? `${total} new update${total > 1 ? "s" : ""}` : "No new updates"} <span class="g-np-sub">· checked ${esc(fmtRefresh())}</span></div>
      <div class="g-np-list">${show.length ? show.map(row).join("") : '<div class="g-np-empty">Nothing yet.</div>'}</div>
    </div>`;
  const bell = document.getElementById("g-bell"), panel = document.getElementById("g-notif-panel");
  bell.addEventListener("click", (e) => {
    e.stopPropagation();
    if (panel.hasAttribute("hidden")) { panel.removeAttribute("hidden"); bell.setAttribute("aria-expanded", "true"); markAllSeen(); }
    else { closeNotifPanel(); }
  });
  document.addEventListener("click", (e) => {
    const panel = document.getElementById("g-notif-panel");
    const isOpen = panel && !panel.hasAttribute("hidden");
    if (isOpen && !wrap.contains(e.target)) { e.preventDefault(); e.stopPropagation(); closeNotifPanel(); }
  }, true);
}

// ---- Unified search index --------------------------------------------------
// Result priority (rank): managers first, then funds / CLOs, then dated items
// (deals, intel, legal — newest first), then macro chart shortcuts, then views.
// Expand common central-bank abbreviations both ways so "Federal Reserve" finds
// "Fed" headlines and vice-versa (same for BoE / ECB).
const CB_SYN = [["fed", "federal reserve"], ["fomc", "federal open market committee"], ["boe", "bank of england"], ["ecb", "european central bank"]];
function expandHay(s) {
  let h = s.toLowerCase();
  for (const [ab, full] of CB_SYN) {
    const hasAb = new RegExp("\\b" + ab + "\\b").test(h), hasFull = h.includes(full);
    if (hasAb && !hasFull) h += " " + full; else if (hasFull && !hasAb) h += " " + ab;
  }
  return h;
}
function buildIndex() {
  const idx = [];
  const add = (tag, title, sub, href, rank, date) => idx.push({ tag, title, sub, href, rank, date: date || "", hay: expandHay(title + " " + sub) });

  add("view", "Home", "Cross-desk briefing", "/", 4, "");
  [["commentary", "Commentary"], ["policy", "Rate outlook"], ["cycle", "Cycle"], ["bubble", "Bubble risk"], ["chart", "Chart"], ["saved", "Saved"]]
    .forEach(([k, l]) => add("macro", `Macro — ${l}`, "View", `/macro/#/${k}`, 4, ""));

  managers.forEach((m) => add("credit", m.name, "Manager", `/credit/#/manager/${encodeURIComponent(m.id)}`, 0, ""));
  funds.forEach((f) => add("credit", f.name, `Fund${f.managerId && mgrName(f.managerId) ? " · " + mgrName(f.managerId) : ""}`, `/credit/#/fund/${encodeURIComponent(f.id)}`, 1, ""));
  deals.forEach((d) => add("credit", d.headline, `${d.clo ? "CLO" : "Deal"} · ${fmt(d.date)}${mgrName(d.managerId) ? " · " + mgrName(d.managerId) : ""}`, creditItemHref(d, "deals"), d.clo ? 1 : 2, d.date));
  intel.forEach((i) => add("credit", i.headline, `${i.clo ? "CLO · " : ""}${i.type || "Fundraising"} · ${fmt(i.date)}${mgrName(i.managerId) ? " · " + mgrName(i.managerId) : ""}`, creditItemHref(i, "intel"), i.clo ? 1 : 2, i.date));

  items.forEach((i) => add("legal", i.title, `Legal alert${i.firm ? " · " + i.firm : ""}${i.date ? " · " + fmt(i.date) : ""}`, `/legal/#/item/${encodeURIComponent(i.id)}`, 2, i.date));
  cases.forEach((c) => add("legal", c.name, `Case · ${c.court || ""}${c.citation ? " · " + c.citation : ""}`, `/legal/#/cases?case=${encodeURIComponent(c.id)}`, 2, c.date));
  restructurings.forEach((r) => add("legal", r.company, `${r.type === "scheme" ? "Scheme" : "Restructuring plan"}${r.citation ? " · " + r.citation : ""}`, `/legal/#/restructurings?m=${encodeURIComponent(r.id)}`, 2, r.date));

  ["US", "UK"].forEach((ctry) => MACRO_INDICATORS.forEach(([k, l]) =>
    add("macro", `${ctry} ${l}`, "Open in Chart", `/macro/#/chart?add=${ctry}:${k}`, 3, "")));

  // ---- News items (so a search for e.g. "Federal Reserve" finds headlines) ----
  // Macro news headlines (US/UK) + the market reading list — link out to the
  // source, deduped across the two feeds.
  const seenNews = new Set();
  const addNews = (n) => {
    const k = (n.url || n.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
    if (k && seenNews.has(k)) return; if (k) seenNews.add(k);
    add("macro", n.title, `Macro news${n.source ? " · " + n.source : ""}${n.date ? " · " + fmt(n.date) : ""}`, n.url, 2, n.date);
  };
  ["us", "uk"].forEach((c) => ((NEWS && NEWS[c]) || []).forEach(addNews));
  ((ARTICLES && ARTICLES.items) || []).forEach(addNews);
  // Editorial macro guidance (rate outlook / cycle / bubble).
  (ALERTS || []).forEach((a) => add("macro", a.title, `Macro guidance${a.kind ? " · " + a.kind : ""}`, `/macro/${a.href || "#/policy"}`, 3, a.date));
  // Credit manager press (news + webNews), deduped per manager — deep-link into the profile.
  managers.forEach((m) => {
    const seen = new Set();
    [...(m.news || []), ...(m.webNews || [])].forEach((w) => {
      const k = (w.url || w.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
      if (k && seen.has(k)) return; seen.add(k);
      add("credit", w.title, `News${m.name ? " · " + m.name : ""}${w.date ? " · " + fmt(w.date) : ""}`,
        `/credit/#/manager/${encodeURIComponent(m.id)}?focus=k:${encodeURIComponent(feedDedupKey(w))}`, 2, w.date);
    });
  });

  return idx;
}

// ---- Command palette -------------------------------------------------------
function wirePalette(idx) {
  const overlay = document.getElementById("cmdk");
  const input = document.getElementById("cmdk-input");
  const results = document.getElementById("cmdk-results");
  let sel = 0, current = [];

  function score(e, q) {
    const t = e.title.toLowerCase();
    if (t === q) return 0;
    if (t.startsWith(q)) return 1;
    if (t.includes(q)) return 2;
    return e.hay.includes(q) ? 3 : -1;
  }
  function search(q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    const toks = q.split(/\s+/);
    return idx
      .map((e) => ({ e, s: toks.every((t) => e.hay.includes(t)) ? score(e, q) : -1 }))
      .filter((x) => x.s >= 0 || x.e.hay.includes(toks[0]))
      .map((x) => ({ e: x.e, s: x.s < 0 ? 4 : x.s }))
      .sort((a, b) =>
        a.e.rank - b.e.rank ||
        (a.e.rank === 2 ? String(b.e.date).localeCompare(String(a.e.date)) : 0) ||
        a.s - b.s ||
        a.e.title.localeCompare(b.e.title))
      .slice(0, 40).map((x) => x.e);
  }
  function draw() {
    if (!current.length) { results.innerHTML = input.value.trim() ? `<div class="cmdk-empty">No matches.</div>` : ""; return; }
    results.innerHTML = current.map((e, i) => `
      <div class="cmdk-row${i === sel ? " sel" : ""}" data-i="${i}">
        <span class="cmdk-tag ${e.tag}">${e.tag === "view" ? "Go" : e.tag}</span>
        <span class="cmdk-txt"><span class="cmdk-t">${esc(e.title)}</span><span class="cmdk-s">${esc(e.sub)}</span></span>
      </div>`).join("");
    const s = results.querySelector(".cmdk-row.sel"); if (s) s.scrollIntoView({ block: "nearest" });
  }
  function refresh() { current = search(input.value); sel = 0; draw(); }
  function go(e) { if (!e) return; close(); if (/^https?:\/\//i.test(e.href)) window.open(e.href, "_blank", "noopener"); else window.location.href = e.href; }

  // Focus SYNCHRONOUSLY within the tap gesture so iOS Safari pops the keyboard
  // immediately (a setTimeout would escape the gesture and suppress it).
  function open() { overlay.classList.add("open"); input.value = ""; refresh(); input.focus({ preventScroll: true }); }
  function close() { overlay.classList.remove("open"); }

  document.getElementById("open-cmdk").addEventListener("click", open);
  // Also open from the mobile bottom-bar search button (or any [data-open-search]).
  document.addEventListener("click", (e) => { if (e.target.closest("[data-open-search]")) { e.preventDefault(); open(); } });
  overlay.querySelector("[data-close]").addEventListener("click", close);
  input.addEventListener("input", refresh);
  results.addEventListener("click", (ev) => { const r = ev.target.closest(".cmdk-row"); if (r) go(current[+r.getAttribute("data-i")]); });
  input.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowDown") { ev.preventDefault(); sel = Math.min(sel + 1, current.length - 1); draw(); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); sel = Math.max(sel - 1, 0); draw(); }
    else if (ev.key === "Enter") { ev.preventDefault(); go(current[sel]); }
    else if (ev.key === "Escape") { close(); }
  });
  const isTyping = (t) => { const tag = (t && t.tagName || "").toLowerCase(); return !!t && (t.isContentEditable || tag === "input" || tag === "textarea" || tag === "select"); };
  window.addEventListener("keydown", (ev) => {
    if (ev.key === "/" && !ev.metaKey && !ev.ctrlKey && !ev.altKey && !isTyping(ev.target) && !overlay.classList.contains("open")) { ev.preventDefault(); open(); }
    else if (ev.key === "Escape" && overlay.classList.contains("open")) { close(); }
  });
  // Arriving from an in-app ⌘K (which routes to "/#find") opens search immediately.
  if (location.hash === "#find") { history.replaceState(null, "", "/"); open(); }
}
