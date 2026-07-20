// =============================================================================
// Wire Glance — the cross-desk landing. Imports the three apps' data modules
// (same-origin ES modules), renders a sectioned highlight card per platform
// (Macro, Credit, Legal — 3 most-recent items per section), mounts the Credit
// "key rates & credit spreads" bar, and powers a unified ⌘K command palette that
// searches deals, managers, funds, legal alerts, cases, restructurings, macro
// indicators and views — deep-linking into each app. Zero dependencies; loaded
// only once the user is authenticated.
// =============================================================================
// Data modules are versioned (matching each app) so the live Glance busts its
// cache with the four-times-daily data refresh instead of serving a stale copy.
import { deals, intel, managers, funds, research, LAST_CHECKED, LAST_CHECKED_TIME } from "/credit/js/data.js?v=20260718-9";
import { items, cases, restructurings, firmById } from "/legal/js/data.js?v=20260718-10";
import { NEWS, ALERTS, ARTICLES, COMMENTARY, CYCLE, BUBBLE, OUTLOOK } from "/macro/js/content.js?v=20260718-9";
import { NEWSLETTERS } from "/newsletters.js";
import { FT_ITEMS } from "/ft.js";

import { esc, byDateDesc, NEWS_SOURCES, JUDGMENT_SOURCES, srcHost, tidyDomain } from "/util.js?v=20260719-1";
// The ONLY sources eligible to lead the briefing "Top story": FT, Bloomberg, CNBC,
// Reuters and the WSJ (plus their same-wire variants, e.g. a Reuters story carried
// via Investing.com or an FT Alphaville post).
const PREMIUM_NEWS = new Set([
  "Financial Times", "FT Alphaville",
  "Bloomberg",
  "CNBC",
  "Reuters", "Reuters (via Investing.com)",
  "The Wall Street Journal", "WSJ",
  "The Economist",
]);
// Low-tier aggregator / SEO / forecast-farm / crypto sources — limited out of the
// Home macro feed so premium newsrooms dominate (credit & legal desks are the
// tracked universe and are left untouched).
const NON_PREMIUM = new Set([
  "Benzinga", "TheStreet", "Yahoo Finance", "Yahoo Finance UK", "Sunday Guardian Live",
  "HomeOwners Alliance", "U.S. News", "CityAM", "Enterprise AM", "exchangerates.org.uk",
  "TradingView", "GV Wire", "CryptoTimes",
]);
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ""); return m ? `${+m[3]} ${MON[+m[2] - 1]} ${m[1]}` : (iso || ""); };
const mgrName = (id) => (managers.find((m) => m.id === id) || {}).name || "";

// ---- Notification source labels (kept in sync with each app's copy) --------
// Credit: outlet/wire from sourceUrl, else the manager's own PR (manager name).
// Legal: firm name for alerts/RPs, judgment host for cases. Macro data: series
// source (FRED/ONS/…). Editorial macro guidance has no single external source.
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
// Live macro headlines from /api/feed (curated finance/macro RSS, edge-parsed).
// Seeded from last-good cache on load, refreshed on the 5-min live cadence, and
// merged into the home feed's Macro items. Empty until the first fetch resolves.
let _liveFeed = [];
const fmtRefresh = () => `${fmt(LAST_CHECKED)}${LAST_CHECKED_TIME ? `, ${LAST_CHECKED_TIME}` : ""}`;

// Home phone rails inside the SHARED Markets panel (#na-mkt-panel, created by
// nav-actions): on phones the two desktop side rails move into a .na-rails host
// with the Markets/Macro chips, and the panel's standard markets list hides
// (premium.css `.has-rails`). On desktop the rails return to the 3-column grid
// and the panel shows nav-actions' standard markets list, same as the apps.
function initHomeMarketsRails() {
  const panel = document.getElementById("na-mkt-panel");
  const side = document.querySelector(".g-side");
  const side2 = document.querySelector(".g-side2");
  const layout = document.querySelector(".g-layout");
  const feed = document.querySelector(".g-feed-wrap");
  if (!panel || !side || !layout) return;
  const host = document.createElement("div");
  host.className = "na-rails tui";
  panel.appendChild(host);
  const head = document.createElement("div");
  head.className = "g-mkt-head";
  head.innerHTML = '<div class="g-mkt-chips" role="tablist" aria-label="Data rail">'
    + '<button type="button" class="g-mkt-chip is-on" data-rail="side" role="tab" aria-selected="true">Markets</button>'
    + '<button type="button" class="g-mkt-chip" data-rail="side2" role="tab" aria-selected="false">Macro</button>'
    + '</div>';
  host.appendChild(head);
  const mq = matchMedia("(max-width:760px)");
  const selectRail = (which) => {
    const isSide = which !== "side2";
    side.style.display = isSide ? "" : "none";
    if (side2) side2.style.display = isSide ? "none" : "";
    head.querySelectorAll(".g-mkt-chip").forEach((c) => {
      const on = c.dataset.rail === (isSide ? "side" : "side2");
      c.classList.toggle("is-on", on);
      c.setAttribute("aria-selected", on ? "true" : "false");
    });
    panel.scrollTop = 0;
  };
  const place = () => {
    if (mq.matches) {
      panel.classList.add("has-rails");
      if (side.parentElement !== host) host.appendChild(side);
      if (side2 && side2.parentElement !== host) host.appendChild(side2);
      const on = head.querySelector(".g-mkt-chip.is-on");
      selectRail(on ? on.dataset.rail : "side");
    } else {
      panel.classList.remove("has-rails");
      side.style.display = ""; if (side2) side2.style.display = "";
      if (side.parentElement !== layout) layout.insertBefore(side, feed || null);
      if (side2 && side2.parentElement !== layout) layout.appendChild(side2);
    }
  };
  head.addEventListener("click", (e) => { const c = e.target.closest(".g-mkt-chip"); if (c) selectRail(c.dataset.rail); });
  place();
  mq.addEventListener("change", place);
}

export function initGlance() {
  if (_inited) return; _inited = true;
  _liveFeed = ((readCache("feed") || {}).items) || [];  // instant last-good merge
  renderFeed();
  refreshLiveFeed();                                     // then pull fresh headlines
  renderMacroSnapshot();
  initMacroIndicators();
  initMarkets();
  initRates();
  initPulse();
  initGlanceTickerToggle();
  const rf = document.getElementById("g-refresh");
  if (rf) rf.textContent = `Last refresh ${fmtRefresh()}`;
  // Top-bar Markets / Saved / Notifications: the SAME shared controller as
  // Macro/Credit/Legal (nav-actions.js) — one implementation on all four pages.
  // The legacy Home-only menus (initNotifBell / initSavedPanel /
  // initMarketsPanel) are retired; on phones the Home data rails move into the
  // shared Markets panel via initHomeMarketsRails.
  import("/nav-actions.js?v=20260719-32").then((m) => { m.initNavActions(); initHomeMarketsRails(); }).catch(() => {});
  renderDeals();
  renderFundraising();
  renderRx();
  initFlowChips();
  initFeedEntityNav();
  initFeedHeadLock();
  initJumpNav();
  wirePalette(buildIndex());
  startLiveRefresh();
  import("/ptr.js?v=20260719-10").then((m) => m.initPullToRefresh()).catch(() => {});
}

// ---- Unified Saved -----------------------------------------------------------
// One cross-desk bookmark list. Each app stores its own saved-id set in
// localStorage; here we resolve those ids back to items (replicating the two
// hashed-id schemes and matching the raw-id ones) so the home page shows
// everything the user has starred across Macro, Credit and Legal in one place.
function _savedHash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
function _savedBase(x) { return (x.url || x.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, ""); }
function resolveSaved() {
  const rd = (k) => { try { return new Set(JSON.parse(localStorage.getItem(k) || "[]")); } catch { return new Set(); } };
  const mS = rd("meridian.macro.saved"), cS = rd("meridian.credit.saved"), lS = rd("lexalert.saved");
  const out = [];
  // Macro — article ids are "a" + hash(url|title base).
  [...((ARTICLES && ARTICLES.items) || []), ...((NEWS && NEWS.us) || []), ...((NEWS && NEWS.uk) || []),
   ...((COMMENTARY && COMMENTARY.us) || []), ...((COMMENTARY && COMMENTARY.uk) || [])]
    .forEach((n) => { if (mS.has("a" + _savedHash(_savedBase(n)))) out.push({ desk: "m", title: n.title, href: n.url, ext: true, date: n.date, time: n.time, src: n.source }); });
  // Credit — deals/intel by raw id; manager press by "n" + hash(base|managerId).
  deals.forEach((d) => { if (cS.has(d.id)) out.push({ desk: "c", title: d.headline, href: creditItemHref(d), ext: creditItemExt(d), date: d.date, time: d.time, src: creditSource(d) }); });
  intel.forEach((i) => { if (cS.has(i.id)) out.push({ desk: "c", title: i.headline, href: creditItemHref(i), ext: creditItemExt(i), date: i.date, time: i.time, src: creditSource(i) }); });
  managers.forEach((m) => [...(m.news || []), ...(m.webNews || [])].forEach((w) => {
    if (cS.has("n" + _savedHash(_savedBase(w) + "|" + m.id))) out.push({ desk: "c", title: w.title, href: "/credit/#/manager/" + m.id + "?focus=k:" + encodeURIComponent(feedDedupKey({ ...w, _mid: m.id })), ext: false, date: w.date, time: w.time, src: w.outlet || m.name });
  }));
  // Legal — items/cases/restructurings by raw id.
  items.forEach((it) => { if (lS.has(it.id)) out.push({ desk: "l", title: it.title, href: it.url || "/legal/#/item/" + encodeURIComponent(it.id), ext: !!it.url, date: it.date, time: it.time, src: firmName(it.firm) }); });
  cases.forEach((c) => { if (lS.has(c.id)) out.push({ desk: "l", title: c.name, href: c.url || "/legal/#/", ext: !!c.url, date: c.date, time: c.time, src: c.court }); });
  restructurings.forEach((r) => { if (lS.has(r.id)) out.push({ desk: "l", title: r.company, href: r.judgmentUrl || r.articleUrl || "/legal/#/", ext: !!(r.judgmentUrl || r.articleUrl), date: r.date, time: r.time, src: r.type === "scheme" ? "Scheme" : "Restructuring plan" }); });
  return out.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}
const _deskClass = { m: "macro", c: "credit", l: "legal", n: "newsletter", f: "ft", s: "substack" };
const DESK_CODE = { m: "MAC", c: "CRD", l: "LEX", n: "LETTER", f: "FT", s: "SUBS" };
function initSavedPanel() {
  const wrap = document.getElementById("g-saved");
  if (!wrap) return;
  const list = resolveSaved();
  const n = list.length;
  const row = (x) => `<a class="g-sv-item" href="${esc(x.href)}"${x.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>`
    + `<span class="g-sv-tag ${_deskClass[x.desk]}">${esc(DESK[x.desk])}</span>`
    + `<span class="g-sv-txt"><span class="g-sv-t">${esc(x.title)}</span>`
    + `<span class="g-sv-m">${x.src ? esc(x.src) : ""}${x.date ? (x.src ? " · " : "") + esc(fmt(String(x.date).slice(0, 10))) : ""}</span></span></a>`;
  wrap.innerHTML = `
    <button type="button" class="g-sv-btn" id="g-sv-btn" aria-haspopup="true" aria-expanded="false" aria-label="Saved${n ? ` — ${n}` : ""}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
    </button>
    <div class="g-sv-panel" id="g-sv-panel" role="menu" hidden>
      <div class="g-sv-head"><span>Saved${n ? ` · ${n}` : ""}</span></div>
      <div class="g-sv-body">${n ? list.map(row).join("") : '<div class="g-sv-empty">Nothing saved yet. Tap the ☆ on any item across Macro, Credit or Legal to keep it here.</div>'}</div>
    </div>`;
  const btn = document.getElementById("g-sv-btn"), panel = document.getElementById("g-sv-panel");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const wasOpen = !panel.hasAttribute("hidden");
    closeAllGlanceMenus();
    if (!wasOpen) { panel.removeAttribute("hidden"); btn.setAttribute("aria-expanded", "true"); document.body.classList.add("g-menu-open"); showScrim(closeAllGlanceMenus); }
  });
  panel.addEventListener("click", (e) => { if (e.target.closest("[data-menu-close]")) closeAllGlanceMenus(); });
  document.addEventListener("click", (e) => { if (!panel.hasAttribute("hidden") && !e.target.closest("#g-saved")) closeAllGlanceMenus(); });
}

// ---- Entity cross-linking ----------------------------------------------------
// A manager/firm named in ANY feed headline (macro, credit or legal) gets a small
// chip linking straight to its Credit profile. We reduce each manager's full name
// to a short brand key ("Bridgepoint Credit" → "Bridgepoint", "ICG (Intermediate
// Capital Group)" → "ICG") and word-boundary match it against the headline.
const _ENT_GENERIC = new Set(["credit", "management", "capital", "global", "partners", "advisors", "advisers", "asset", "alternatives", "group", "investment", "investments", "private", "holdings", "llp", "llc", "inc", "co", "company", "the", "and"]);
function _entKey(name) {
  let toks = String(name || "").split("(")[0].replace(/&/g, " ").trim().split(/\s+/).filter(Boolean);
  while (toks.length > 1 && _ENT_GENERIC.has(toks[toks.length - 1].toLowerCase().replace(/[^a-z]/gi, ""))) toks.pop();
  return toks.join(" ");
}
// Single-word brand keys that collide with common English words (or plain
// numbers) would light up on unrelated headlines ("one-year high", "400bps"),
// so they're excluded from matching.
const _ENT_STOPKEYS = new Set(["one", "signal", "arrow", "orbit", "metric", "trinity", "crescent", "fortress"]);
let _entIndex = null;
function entityIndex() {
  if (_entIndex) return _entIndex;
  _entIndex = managers.map((m) => ({ id: m.id, name: m.name, key: _entKey(m.name) }))
    .filter((e) => e.key && e.key.replace(/[^a-z0-9]/gi, "").length >= 3
      && !_ENT_GENERIC.has(e.key.toLowerCase()) && !_ENT_STOPKEYS.has(e.key.toLowerCase())
      && !/^\d+$/.test(e.key))
    .sort((a, b) => b.key.length - a.key.length);   // longest key wins (Park Square before Park)
  return _entIndex;
}
function matchEntity(title) {
  const t = String(title || "");
  for (const e of entityIndex()) {
    const re = new RegExp("(^|[^A-Za-z0-9])" + e.key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[^A-Za-z0-9])", "i");
    if (re.test(t)) return e;
  }
  return null;
}
// One delegated handler: a click (or Enter/Space) on an entity chip navigates to
// the manager's Credit profile without triggering the row's own story link.
function initFeedEntityNav() {
  const go = (el) => { const h = el.getAttribute("data-href"); if (h) location.href = h; };
  const feed = document.getElementById("g-feed");
  if (!feed) return;
  // A single delegated handler serves three in-row controls that must NOT trigger
  // the row's link-to-article: entity chips (navigate), the source name (filter by
  // that newsroom) and the source-filter clear pill.
  const handle = (e) => {
    const ent = e.target.closest(".g-feed-ent");
    if (ent) { e.preventDefault(); e.stopPropagation(); go(ent); return; }
    const src = e.target.closest(".g-feed-src");
    if (src) { e.preventDefault(); e.stopPropagation(); _feedSrc = src.dataset.src; _feedDesk = "all"; renderFeed(); return; }
    const clr = e.target.closest("[data-clearsrc]");
    if (clr) { e.preventDefault(); e.stopPropagation(); _feedSrc = null; renderFeed(); }
  };
  feed.addEventListener("click", handle);
  feed.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") handle(e); });
}

// On phones the ticker chips are collapsed behind a chevron at the end of each
// one-liner; a single delegated handler toggles the block open/closed. On
// desktop the chips are always visible (CSS) and the chevron is hidden, so this
// listener never fires there.
function initGlanceTickerToggle() {
  const glance = document.getElementById("g-glance");
  if (!glance) return;
  const closeBlock = (block) => {
    block.classList.remove("is-open");
    const btn = block.querySelector(".gl-tk-toggle");
    if (btn) {
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Show related tickers");
    }
  };
  glance.addEventListener("click", (e) => {
    // Clicks on the ticker chips themselves (links inside the open dropdown) pass
    // through; a click anywhere else on the one-liner (label, text or chevron)
    // toggles that line's tickers.
    if (e.target.closest(".gl-tickers")) return;
    const line = e.target.closest(".g-gl");
    if (!line) return;
    const block = line.closest(".g-gl-block");
    const btn = block && block.querySelector(".gl-tk-toggle");
    if (!btn || btn.hidden) return;   // no tickers for this line → nothing to toggle
    const open = block.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Hide related tickers" : "Show related tickers");
  });
  // Clicking anywhere off an open one-liner collapses it. The toggle above runs
  // first (it bubbles from inside the block), so a click that just opened a block
  // is skipped here because the target is still inside that block.
  document.addEventListener("click", (e) => {
    const inside = e.target.closest(".g-gl-block");
    glance.querySelectorAll(".g-gl-block.is-open").forEach((block) => {
      if (block !== inside) closeBlock(block);
    });
  });
  // Escape closes any open one-liner too.
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    glance.querySelectorAll(".g-gl-block.is-open").forEach(closeBlock);
  });
}

// Mobile-only backdrop for the markets / notifications menus. A full-viewport
// catcher absorbs the tap that dismisses an open menu so it can't also activate a
// link or tab on the page behind it. Only used on phones (the desktop dropdowns
// close fine on outside-click without one). The top bar is raised above it via
// body.g-menu-open so the open panel (which lives inside the bar) stays on top.
let _scrimEl = null;
function showScrim(onClose) {
  if (!matchMedia("(max-width:760px)").matches) return;
  if (!_scrimEl) {
    _scrimEl = document.createElement("div");
    _scrimEl.className = "g-scrim";
    _scrimEl.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); if (_scrimEl._cb) _scrimEl._cb(); });
    document.body.appendChild(_scrimEl);
  }
  _scrimEl._cb = onClose;
  _scrimEl.hidden = false;
  document.body.classList.add("g-menu-open");
}
function hideScrim() {
  if (_scrimEl) { _scrimEl.hidden = true; _scrimEl._cb = null; }
  document.body.classList.remove("g-menu-open");
}
// Close ALL three command-bar menus (Markets / Saved / Notifications) and reset
// the shared body-locks + scrim. Every menu's toggle calls this before opening so
// only one is ever open — opening one always closes the others (no layering/stick).
function closeAllGlanceMenus() {
  const mkt = document.getElementById("g-mkt-panel");
  if (mkt && !mkt.hidden) mkt.hidden = true;
  const mktBtn = document.getElementById("g-mkt-btn"); if (mktBtn) mktBtn.setAttribute("aria-expanded", "false");
  const sv = document.getElementById("g-sv-panel");
  if (sv) sv.setAttribute("hidden", "");
  const svBtn = document.getElementById("g-sv-btn"); if (svBtn) svBtn.setAttribute("aria-expanded", "false");
  document.body.classList.remove("g-mkt-open");
  hideScrim();
}

// ---- iPhone markets/rates dropdown -----------------------------------------
// On phones the right-hand markets + key-rates sidebar (.g-side) is relocated into
// a dropdown panel behind the chart button in the top bar, so the numbers are one
// tap away without pushing the news feed down. The SAME .g-side node moves between
// the layout grid (desktop) and the panel (phone) — one fetch/render feeds both,
// no duplicated markup. Desktop leaves it in the grid and hides the button (CSS).
// The mobile overlays (markets / saved / notifications) sit full-screen BELOW the
// sticky top nav bar. Publish the bar's exact bottom (incl. the notch/safe-area)
// as --gtop-b so the panels' CSS `top` tracks it precisely.
function setTopbarVar() {
  const t = document.querySelector(".g-top");
  const h = t ? Math.round(t.getBoundingClientRect().bottom) : 54;
  document.documentElement.style.setProperty("--gtop-b", h + "px");
}
function initMarketsPanel() {
  setTopbarVar();
  addEventListener("resize", setTopbarVar);
  addEventListener("orientationchange", () => setTimeout(setTopbarVar, 200));
  const btn = document.getElementById("g-mkt-btn");
  const panel = document.getElementById("g-mkt-panel");
  const side = document.querySelector(".g-side");
  const side2 = document.querySelector(".g-side2");
  const layout = document.querySelector(".g-layout");
  const feed = document.querySelector(".g-feed-wrap");
  if (!btn || !panel || !side || !layout) return;
  const mq = matchMedia("(max-width:760px)");
  // Full-screen panel header (title + close), built once — phones only (CSS hides
  // it on desktop). Sits above the moved rails so it stays sticky while scrolling.
  let head = panel.querySelector(".g-mkt-head");
  if (!head) {
    head = document.createElement("div");
    head.className = "g-mkt-head";
    // Left rail = "Markets" (prices, rates, FX, vol, movers); right rail = "Macro"
    // (economic data, yield curve, macro read, deal flow). Chips swap between them.
    // No explicit close control: tapping the Markets icon again (or Escape)
    // toggles the panel shut, so the header is just the Markets / Macro chips.
    head.innerHTML = '<div class="g-mkt-chips" role="tablist" aria-label="Data rail">'
      + '<button type="button" class="g-mkt-chip is-on" data-rail="side" role="tab" aria-selected="true">Markets</button>'
      + '<button type="button" class="g-mkt-chip" data-rail="side2" role="tab" aria-selected="false">Macro</button>'
      + '</div>';
    panel.appendChild(head);
  }
  // Show one rail at a time in the panel (phones); the chips pick which.
  const selectRail = (which) => {
    const isSide = which !== "side2";
    side.style.display = isSide ? "" : "none";
    if (side2) side2.style.display = isSide ? "none" : "";
    head.querySelectorAll(".g-mkt-chip").forEach((c) => {
      const on = c.dataset.rail === (isSide ? "side" : "side2");
      c.classList.toggle("is-on", on);
      c.setAttribute("aria-selected", on ? "true" : "false");
    });
    panel.scrollTop = 0;
  };
  const close = () => { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); document.body.classList.remove("g-mkt-open"); hideScrim(); };
  // On phones BOTH rails live in the full-screen panel (the news wire owns the
  // page), shown one at a time via the Markets/Macro chips. On desktop both rails
  // return to the 3-column grid with their inline show/hide cleared.
  const place = () => {
    if (mq.matches) {
      if (side.parentElement !== panel) panel.appendChild(side);
      if (side2 && side2.parentElement !== panel) panel.appendChild(side2);
      const on = head.querySelector(".g-mkt-chip.is-on");
      selectRail(on ? on.dataset.rail : "side");
    } else {
      side.style.display = ""; if (side2) side2.style.display = "";
      if (side.parentElement !== layout) layout.insertBefore(side, feed || null);
      if (side2 && side2.parentElement !== layout) layout.appendChild(side2);
      close();
    }
  };
  head.addEventListener("click", (e) => { const c = e.target.closest(".g-mkt-chip"); if (c) selectRail(c.dataset.rail); });
  place();
  mq.addEventListener("change", place);
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const wasOpen = !panel.hidden;
    closeAllGlanceMenus();
    if (!wasOpen) {
      panel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      if (mq.matches) { document.body.classList.add("g-mkt-open", "g-menu-open"); showScrim(closeAllGlanceMenus); }
    }
  });
  // Close button, or Escape.
  panel.addEventListener("click", (e) => { if (e.target.closest(".g-mkt-close")) closeAllGlanceMenus(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAllGlanceMenus(); });
}

// On phones the briefing leads and the filter-chip bar sits directly BELOW it,
// then locks beneath the sticky command bar once the briefing scrolls away — so
// the greeting/top-story read first and the chips take over the top as you scroll
// into the feed. On desktop the bar stays at the top of the internally-scrolling
// feed column.
function initFeedHeadLock() {
  const head = document.getElementById("g-feed-head");
  const main = document.querySelector(".g-main");
  const wrap = document.querySelector(".g-feed-wrap");
  const hello = document.querySelector(".g-hello");
  if (!head || !main || !wrap) return;
  const mq = matchMedia("(max-width:900px)");
  const place = () => {
    if (mq.matches) { if (head.previousElementSibling !== hello) main.insertBefore(head, hello ? hello.nextElementSibling : main.firstElementChild); }
    else if (head.parentElement !== wrap) wrap.insertBefore(head, wrap.firstElementChild);
  };
  place();
  mq.addEventListener("change", place);
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
// cost of note). Everything else on the page keeps the 5×/day editorial
// cadence. Work is skipped while the tab is hidden and caught up on return.
const LIVE_REFRESH_MS = 5 * 60 * 1000;
let _lastLive = Date.now();
function refreshLive() { _lastLive = Date.now(); initMarkets(); initRates(); initPulse(); refreshLiveFeed(); }

// Pull the curated live news feed (/api/feed) and re-render the home feed with
// the fresh headlines merged in. Non-200 / empty / offline → keep whatever we
// already show (cached live items or the static curated feed) — never blanks it.
// When the Cloudflare Access session expires while the page is open, API polls
// get silently redirected to the login page — the feed freezes with no error.
// Detect that and reload the document (throttled, only while visible) so
// Access re-establishes the session and the polls come back to life.
function maybeReauth() {
  try {
    if (document.hidden) return;
    const last = +localStorage.getItem("wire.reauthAt") || 0;
    if (Date.now() - last < 15 * 60 * 1000) return;
    localStorage.setItem("wire.reauthAt", String(Date.now()));
    // ?__net=1 forces the navigation past the service-worker app-shell cache —
    // it must reach the origin so Access can redirect through login and back
    // (nav-actions strips the marker after load).
    window.location.href = location.pathname + "?__net=1";
  } catch { /* leave the stale feed rather than loop */ }
}
function refreshLiveFeed() {
  fetch("/api/feed", { headers: { accept: "application/json" } })
    .then((r) => {
      if ((r.redirected && /cdn-cgi\/access/.test(r.url)) || (r.headers.get("content-type") || "").includes("text/html")) { maybeReauth(); return null; }
      return r.ok ? r.json() : null;
    })
    .then((d) => {
      if (d && Array.isArray(d.items) && d.items.length) {
        _liveFeed = d.items;
        writeCache("feed", d);
        // Anchor the top-bar countdown ring to the payload's own assembly time
        // (asOf) — if the edge served a cached copy, the ring correctly shows
        // the reduced time until the NEXT fresh assembly, on every page.
        try { localStorage.setItem("wire.live.anchor", String(Date.parse(d.asOf) || Date.now())); } catch { /* private mode */ }
        window.dispatchEvent(new CustomEvent("wire:live-refresh"));
        renderFeed();
      }
    })
    .catch(() => { /* keep cached/static feed */ });
}
function startLiveRefresh() {
  setInterval(() => { if (!document.hidden) refreshLive(); }, LIVE_REFRESH_MS);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && Date.now() - _lastLive > LIVE_REFRESH_MS) refreshLive();
  });
}

// Deep-link a Credit deal/intel record to its exact row in the right feed tab
// (Credit reads ?focus=<id> on load and scrolls/flashes it). CLO-tagged items
// live in the CLOs tab regardless of which section surfaced them.
// A deal/intel headline opens its source article when we have one, else the
// manager's page (the standalone Deals/Fundraising pages are retired); CLOs keep
// the CLOs tab. `creditItemExt` says whether that destination is an external URL.
const creditItemHref = (x) => x.sourceUrl
  ? x.sourceUrl
  : (x.managerId ? `/credit/#/manager/${encodeURIComponent(x.managerId)}` : "/credit/#/");
const creditItemExt = (x) => !!x.sourceUrl;

// ---- Highlight cards -------------------------------------------------------
// Each platform card is broken into its natural sections, newest 3 items each.
// One cross-desk feed of everything dated TODAY — Macro headlines (market + US +
// UK), Credit deals / fundraising / CLOs, and Legal alerts / case law / schemes —
// interleaved across desks so it reads as a single merged feed, not three blocks.
// Falls back to the most-recent date present if nothing is dated today, so the
// feed is never empty between refreshes.
const DESK = { m: "Macro", c: "Credit", l: "Legal", n: "Letter", f: "myFT", s: "Substack" };
// Active desk filter for the home news feed: "all" | "m" | "c" | "l".
// One-line cross-desk briefing shown under the "Your briefing" heading.
// Category matchers for the two glance lines: the freshest premium story
// ABOUT markets / about rates & credit replaces the generated one-liners.
const BRIEF_MKT_RE = /\b(stocks?|equit\w*|shares?|S&P|Nasdaq|Dow|FTSE|Nikkei|oil|crude|Brent|gold|dollar|DXY|bitcoin|crypto|rally|sell-?off|futures|Wall Street|market)\b/i;
const BRIEF_RATE_RE = /\b(treasur\w*|yields?|gilts?|bonds?|interest rates?|rate (cut|hike|rise|path)|Fed\b|FOMC|Bank of England|BoE|ECB|central bank|spreads?|credit|inflation|CPI|PCE)\b/i;
// Once a real story fills a line, the pulse/deterministic writers stand down.
const _briefLeads = { markets: false, rates: false };
function renderBrief(byDesk, counts, day) {
  const el = document.getElementById("g-brief");
  if (!el) return;
  // The brief line leads with the single freshest headline — but ONLY from a
  // premium news wire (FT, Bloomberg, Reuters, CNBC, WSJ, Economist, Guardian,
  // MarketWatch, FT Alphaville). Manager/court/research items never headline.
  const pool = [...byDesk.m, ...byDesk.c, ...byDesk.l]
    .filter((x) => x && PREMIUM_NEWS.has(x.src))
    .sort((a, b) => day(b).localeCompare(day(a)) || String(b.time || "12:00").localeCompare(String(a.time || "12:00")));
  const lead = pool[0];
  el.innerHTML = lead
    ? `<span class="g-brief-lead"><span class="g-brief-lbl">Top story</span> <a class="g-brief-link g-desk-${lead.desk}" href="${esc(lead.href)}"${lead.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(lead.title)}</a></span>`
    : "";
  // MARKETS / RATES & SPREADS lines = the top story in each category (never
  // duplicating the Top story line above).
  const linkFor = (x) => `<a class="g-brief-link g-desk-${x.desk}" href="${esc(x.href)}"${x.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(x.title)}</a>`;
  const mkt = pool.find((x) => x !== lead && BRIEF_MKT_RE.test(x.title));
  const rt = pool.find((x) => x !== lead && x !== mkt && BRIEF_RATE_RE.test(x.title));
  if (mkt) { _briefLeads.markets = true; setGlance("gl-markets", linkFor(mkt)); }
  if (rt) { _briefLeads.rates = true; setGlance("gl-rates", linkFor(rt)); }
}

let _feedDesk = "all";
// Active source filter (e.g. "Financial Times"): when set, the feed shows every
// story from that newsroom across all three desks. Cleared by the pill or a chip.
let _feedSrc = null;
function renderFeed() {
  // `time` is the article's publish time (e.g. "14:05", Europe/London) when the
  // data carries one — the four-times-daily routine populates it; rows lead with
  // it and the feed ranks newest→oldest by date+time. Absent → row leads with the
  // headline (no fabricated time) until the next refresh backfills it.
  // `sk`/`sid`: which app saved-store this row toggles in (m/c/l + the item's
  // saved-id, matching the apps' own star scheme) — rows without one (letters,
  // FT, live RSS) fall back to the Home-side store ("x").
  const mk = (desk, href, title, source, ext, date, time, sk, sid) =>
    ({ desk, href, title, ext, date, time: time || "", src: source || "", sk: sk || "", sid: sid || "" });

  // Every dated, sourced Macro item: the reading list (ARTICLES), the dashboard
  // headlines (NEWS US/UK) and the economist commentary (COMMENTARY US/UK). Deduped
  // by title below, so cross-section overlap collapses to one row.
  const macro = [];
  const mSid = (n) => "a" + _savedHash(_savedBase(n));
  ((ARTICLES && ARTICLES.items) || []).forEach((n) => macro.push(mk("m", n.url, n.title, n.source, true, n.date, n.time, "m", mSid(n))));
  (((NEWS && NEWS.us) || [])).forEach((n) => macro.push(mk("m", n.url, n.title, n.source, true, n.date, n.time, "m", mSid(n))));
  (((NEWS && NEWS.uk) || [])).forEach((n) => macro.push(mk("m", n.url, n.title, n.source, true, n.date, n.time, "m", mSid(n))));
  (((COMMENTARY && COMMENTARY.us) || [])).forEach((n) => macro.push(mk("m", n.url, n.title, n.source, true, n.date, n.time, "m", mSid(n))));
  (((COMMENTARY && COMMENTARY.uk) || [])).forEach((n) => macro.push(mk("m", n.url, n.title, n.source, true, n.date, n.time, "m", mSid(n))));
  // Live RSS headlines (real publish times) merged in with the curated macro
  // items; the title-dedupe below collapses any overlap with the static feeds.
  // myFT-flagged items belong to the FT stream and substack-flagged items to the
  // Substack desk, not Macro — both routed below.
  (_liveFeed || []).forEach((n) => { if (!n.myft && !n.substack) macro.push(mk("m", n.url, n.title, n.source, true, n.date, n.time)); });
  // Limit non-premium sources: drop Investing.com (unless a Reuters story delivered
  // via it) and the low-tier aggregator/SEO/crypto desks, so the macro feed stays
  // on premium newsrooms, research houses and official data.
  { const kept = macro.filter((o) => (o.src !== "Investing.com" || /\breuters\b/i.test(o.title || "")) && !NON_PREMIUM.has(o.src)); macro.length = 0; macro.push(...kept); }

  const credit = [];
  deals.forEach((d) => credit.push({ ...mk("c", creditItemHref(d), d.headline, creditSource(d), creditItemExt(d), d.date, d.time, "c", d.id), mgr: d.managerId || "" }));
  intel.forEach((i) => credit.push({ ...mk("c", creditItemHref(i), i.headline, creditSource(i), creditItemExt(i), i.date, i.time, "c", i.id), mgr: i.managerId || "" }));
  // Credit research / white papers (Commentary) — external pieces, so they open
  // out to the publisher like the macro reading list.
  (research || []).forEach((r) => credit.push(mk("c", r.url, r.title, r.institution, true, r.date, r.time)));

  const legal = [];
  items.forEach((i) => { if (i.date) legal.push({ ...mk("l", i.url || `/legal/#/item/${encodeURIComponent(i.id)}`, i.title, firmName(i.firm), !!i.url, i.date, i.time, "l", i.id), firm: i.firm || "" }); });
  cases.forEach((c) => { if (c.date) legal.push(mk("l", c.url || "/legal/#/", c.name, c.court, !!c.url, c.date, c.time, "l", c.id)); });
  restructurings.forEach((r) => { if (r.date) legal.push(mk("l", r.judgmentUrl || r.articleUrl || "/legal/#/", r.company, r.type === "scheme" ? "Scheme" : "Restructuring plan", !!(r.judgmentUrl || r.articleUrl), r.date, r.time, "l", r.id)); });

  // Reader's own aggregated email newsletters (Bloomberg, Economist, etc.),
  // pulled from the connected mailbox. They open out to the newsletter's own
  // "read online" link and carry a distinct "Newsletter" desk label.
  const newsletter = [];
  (NEWSLETTERS || []).forEach((n) => newsletter.push(mk("n", n.url, n.title, n.author ? `${n.author} · ${n.publication}` : n.publication, true, n.date, n.time)));

  // The reader's personalised myFT (followed-topics) headlines — pulled from the
  // myFT RSS feed by the refresh routines. Open out to ft.com; "FT" desk label.
  const ft = [];
  (FT_ITEMS || []).forEach((n) => ft.push(mk("f", n.url, n.title, "Financial Times", true, n.date, n.time)));
  // Live myFT headlines from /api/feed (~5 min of publication) — the committed
  // FT_ITEMS above are the 5×/day backfill; title-dedupe collapses the overlap.
  (_liveFeed || []).forEach((n) => { if (n.myft) ft.push(mk("f", n.url, n.title, "Financial Times", true, n.date, n.time)); });

  // Curated Substacks (credit/macro newsletters) — live from /api/feed, edge-
  // parsed by the Worker (substack:true). Their own "SUBS" desk label; folded
  // into the All wire and filterable by source like every other desk.
  const substacks = [];
  (_liveFeed || []).forEach((n) => { if (n.substack) substacks.push(mk("s", n.url, n.title, n.source, true, n.date, n.time)); });

  const day = (x) => String(x.date || "").slice(0, 10);
  const all = [...macro, ...credit, ...legal, ...newsletter, ...ft, ...substacks];
  const now = new Date();
  const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const target = all.some((x) => day(x) === todayISO) ? todayISO : all.reduce((m, x) => (day(x) > m ? day(x) : m), "");

  // Dedupe by normalised title (Macro market-headlines overlap the US/UK feeds).
  const norm = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  const dedupe = (list) => { const s = new Set(); return list.filter((x) => { const k = norm(x.title); if (s.has(k)) return false; s.add(k); return true; }); };
  // No artificial 50-item ceiling — surface the whole deduped stream so the feed
  // fills the screen and scrolls through everything (a high guard just caps
  // pathological cases).
  const CAP = 500;
  // Per-desk deduped streams (newest first) — power the desk filter and the
  // "what's new" counts (items in the most recent ~2 days).
  const byDesk = { m: dedupe([...macro].sort(byDateDesc)), c: dedupe([...credit].sort(byDateDesc)), l: dedupe([...legal].sort(byDateDesc)), n: dedupe([...newsletter].sort(byDateDesc)), f: dedupe([...ft].sort(byDateDesc)), s: dedupe([...substacks].sort(byDateDesc)) };
  const maxDay = all.reduce((m, x) => (day(x) > m ? day(x) : m), "");
  const cutoff = (() => { const d = new Date(maxDay + "T00:00:00"); if (isNaN(d)) return ""; d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); })();
  const recentN = (list) => (cutoff ? list.filter((x) => day(x) >= cutoff).length : list.length);
  const counts = { m: recentN(byDesk.m), c: recentN(byDesk.c), l: recentN(byDesk.l) };

  // One-line cross-desk morning briefing atop the page: how much is new across the
  // three desks (last ~2 days) plus the single freshest headline as a link. Always
  // computed from the full per-desk streams, so it doesn't change when the reader
  // filters the feed below.
  renderBrief(byDesk, counts, day);

  let feed;
  if (_feedSrc) {
    // Source filter wins over the desk chips: every story from that newsroom,
    // across all three desks, newest first.
    feed = dedupe([...macro, ...credit, ...legal, ...ft, ...substacks].sort(byDateDesc)).filter((x) => x.src === _feedSrc).slice(0, CAP);
  } else if (_feedDesk === "all") {
    const pick = (list) => dedupe(list.filter((x) => day(x) === target).sort(byDateDesc));
    const lists = [pick(macro), pick(credit), pick(legal), pick(newsletter), pick(ft), pick(substacks)];
    const seen = new Set();
    feed = [];
    for (let i = 0; lists.some((l) => i < l.length); i++) lists.forEach((l) => {
      if (i < l.length) { const k = norm(l[i].title); if (!seen.has(k)) { seen.add(k); feed.push(l[i]); } }
    });
    // Hold up to 50 stories: if today alone has fewer, backfill with the most
    // recent earlier items (newest-first, deduped).
    if (feed.length < CAP) {
      for (const x of all.filter((x) => day(x) !== target).sort(byDateDesc)) {
        if (feed.length >= CAP) break;
        const k = norm(x.title); if (!seen.has(k)) { seen.add(k); feed.push(x); }
      }
    }
    feed.length = Math.min(feed.length, CAP);
  } else {
    // Single desk: that desk's most-recent items, up to the cap.
    feed = byDesk[_feedDesk].slice(0, CAP);
  }

  const row = (o) => {
    // The item's OWN frozen time (real publish, else the run that first found it —
    // stamped into the data by the routine). No moving global fallback, so a story's
    // time never re-times to the latest run. When no time is known, default to
    // "12:00" (midday) so every row leads with a time.
    const t = o.time || "12:00";
    const ent = matchEntity(o.title);
    return `<a class="g-feed-row g-desk-${o.desk}" href="${esc(o.href)}"${o.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}`
      + ` data-sk="${esc(o.sk || "x")}"${o.sid ? ` data-sid="${esc(o.sid)}"` : ""}${o.mgr ? ` data-mgr="${esc(o.mgr)}"` : ""}${o.firm ? ` data-firm="${esc(o.firm)}"` : ""} data-desk="${esc(o.desk)}" data-date="${esc(o.date || "")}" data-time="${esc(o.time || "")}">`
      + `<span class="g-feed-time">${esc(t)}</span>`
      + `<span class="g-feed-code ${_deskClass[o.desk]}" title="${esc(DESK[o.desk])}">${DESK_CODE[o.desk]}</span>`
      + `<span class="g-feed-title">${esc(o.title)}</span>`
      + (o.src ? `<span class="g-feed-src" role="button" tabindex="0" data-src="${esc(o.src)}" title="Show all ${esc(o.src)} stories">${esc(o.src)}</span>` : "")
      + `<span class="g-feed-desk">${esc(DESK[o.desk])}</span></a>`;
  };
  // Rank strictly newest→oldest (by day, then publish time); untimed items sort at
  // midday to match their "12:00" display. Each day is introduced by a date header.
  feed.sort((a, b) => day(b).localeCompare(day(a)) || String(b.time || "12:00").localeCompare(String(a.time || "12:00")));
  let lastDay = null;
  const body = feed.map((o) => {
    const d = day(o);
    const hdr = d !== lastDay ? `<div class="g-feed-dayhdr">${esc(fmt(d))}</div>` : "";
    lastDay = d;
    return hdr + row(o);
  }).join("") + `<div class="g-feed-end">· end of wire ·</div>`;
  // When a source filter is active, a thin bar above the feed names it and offers
  // a one-click clear (the chips can't show it — they're a fixed desk set).
  const srcBar = _feedSrc
    ? `<div class="g-feed-srcbar">Source · <strong>${esc(_feedSrc)}</strong><button type="button" class="g-feed-srcclear" data-clearsrc="1" aria-label="Clear source filter — show all sources">✕ clear</button></div>`
    : "";
  const empty = `<div class="g-empty">No ${_feedSrc ? esc(_feedSrc) + " stories" : _feedDesk === "all" ? "news yet today" : DESK[_feedDesk] + " items"} — check back shortly.</div>`;
  setHTML("g-feed", srcBar + (feed.length ? body : empty));
  const head = document.getElementById("g-feed-head");
  if (head) {
    const chip = (k, label) => `<button type="button" class="g-feed-chip${!_feedSrc && _feedDesk === k ? " is-on" : ""}" data-desk="${k}" aria-pressed="${!_feedSrc && _feedDesk === k}">${label}</button>`;
    head.innerHTML = `<span class="g-feed-h-lbl">Latest news</span>`
      + `<span class="g-feed-chips" role="group" aria-label="Filter by desk">${chip("all", "All")}${chip("m", "Macro")}${chip("c", "Credit")}${chip("l", "Legal")}</span>`;
    // A desk chip clears any source filter and switches desks.
    head.querySelectorAll(".g-feed-chip").forEach((b) => b.addEventListener("click", () => { _feedSrc = null; _feedDesk = b.dataset.desk; renderFeed(); }));
  }
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
    return `<line x1="${x}" y1="2" x2="${x}" y2="6" stroke="var(--macro)" stroke-width="0.7"/>`
      + `<circle cx="${x}" cy="4" r="1.6" fill="var(--macro)" stroke="var(--surface)" stroke-width="0.7"><title>${esc(it.label)} · ${it.pos}</title></circle>`;
  }).join("");
  return `<svg class="g-snap-gauge" viewBox="0 0 100 8" role="img" aria-hidden="true">`
    + `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="var(--gauge-lo, #d7e3f4)"/><stop offset="1" stop-color="var(--macro)"/></linearGradient></defs>`
    + `<rect x="${x0}" y="3.45" width="${x1 - x0}" height="1.1" rx="0.55" fill="url(#${id})"/>${dots}</svg>`;
}
function renderMacroSnapshot() {
  const el = document.getElementById("g-macro-snap");
  if (!el || !CYCLE || !BUBBLE || !OUTLOOK) return;
  const comp = bubbleComposite();
  // One 3-column grid (country · rate · stance) shared by both rows so the rate
  // and stance columns line up even though the two rates differ in width.
  // Two-part read of the stance: the one-word forecast for the next decision
  // (the action before the "·", e.g. "Hold") plus the trending mood keyword
  // (hawkish / dovish / neutral) pulled from the rest. The full detail lives on
  // the linked Macro › Policy Rate page (the whole block is a link to it).
  const MOOD = { hawkish: "hawk", dovish: "dove", neutral: "neut" };
  const pol = (cc, o) => {
    const s = String(o.stance || "");
    const parts = s.split("·");
    const fc = (parts[0] || s).trim();
    const rest = parts.slice(1).join("·").toLowerCase();
    let mood = "";
    for (const k in MOOD) { if (rest.includes(k)) { mood = k; break; } }
    const tag = mood
      ? ` <span class="g-snap-mood">· ${mood[0].toUpperCase()}${mood.slice(1)}</span>`
      : "";
    return `<span class="g-snap-cc">${cc}</span>`
      + `<span class="g-snap-pv">${esc(o.rate)}</span>`
      + `<span class="g-snap-nx">${esc(o.next || "")}</span>`
      + `<span class="g-snap-ps"><span class="g-snap-fc">${esc(fc)}</span>${tag}</span>`;
  };
  // Meter row: the scale end-labels sit inline either side of the gauge; the
  // per-country / composite detail is tucked into the row's hover tooltip.
  const meter = (lo, hi, gauge, detail) =>
    `<div class="g-snap-meter"${detail ? ` title="${esc(detail)}"` : ""}>`
      + `<span class="g-snap-end">${lo}</span>${gauge}<span class="g-snap-end">${hi}</span></div>`;
  el.innerHTML =
    `<a class="g-snap-blk" href="/macro/#/policy">`
      + `<div class="g-snap-pol">`
        + `<span class="g-snap-t g-snap-polh">Policy rate</span>`
        + `<span class="g-snap-colh g-snap-colh-c">Next</span>`
        + `<span class="g-snap-colh g-snap-colh-r">Forecast</span>`
        + pol("US", OUTLOOK.us) + pol("UK", OUTLOOK.uk)
      + `</div>`
    + `</a>`
    + `<a class="g-snap-blk" href="/macro/#/cycle">`
      + `<div class="g-snap-h"><span class="g-snap-t">Cycle position</span><span class="g-snap-cap">${esc(shortStage(CYCLE.us.shortStage))}</span></div>`
      + meter("Early", "Crisis", snapGauge([{ label: "US", pos: CYCLE.us.pos }, { label: "UK", pos: CYCLE.uk.pos }]), `US ${CYCLE.us.pos} · UK ${CYCLE.uk.pos}`)
    + `</a>`
    + `<a class="g-snap-blk" href="/macro/#/bubble">`
      + `<div class="g-snap-h"><span class="g-snap-t">Bubble risk</span><span class="g-snap-cap">${esc(bubbleBand(comp))}</span></div>`
      + meter("Low", "Extreme", snapGauge([{ label: "Composite", pos: comp }]), `${BUBBLE.market} · composite ${comp}/100`)
    + `</a>`;
}

// ---- US & UK economic indicators (sidebar) ---------------------------------
// The same live series the Macro dashboard shows (Base rate, 2-year yield, Core
// inflation, Services PMI, Wage growth, Unemployment) fetched from /api/macro and
// rendered as a compact 3×2 grid per country — value + change + source, no chart.
const monY = (iso) => { const m = /^(\d{4})-(\d{2})/.exec(iso || ""); return m ? `${MON[+m[2] - 1]} ${m[1]}` : ""; };
const IND_ORDER = ["base_rate", "two_year", "core_cpi", "services_pmi", "wages", "unemployment"];
// Rendered as a .rate-tile row to match the Markets / Key-rates bands: the whole
// row links to the source; the as-of / source detail lives in the hover tooltip.
function indTile(s) {
  const pct = s.unit === "%";
  const val = s.value == null ? "—" : `${(+s.value).toFixed(2)}${pct ? "%" : ""}`;
  const ch = s.change;
  let chg = '<span class="rate-chg flat">·</span>';
  if (ch != null && s.value != null) {
    const dir = ch > 0 ? "up" : ch < 0 ? "down" : "flat";
    const arrow = ch > 0 ? "▲" : ch < 0 ? "▼" : "·";
    chg = `<span class="rate-chg ${dir}">${arrow} ${Math.abs(ch).toFixed(2)}${pct ? " pp" : " pt"}</span>`;
  }
  const tag = s.href ? "a" : "div";
  const attrs = s.href ? ` href="${esc(s.href)}" target="_blank" rel="noopener noreferrer"` : "";
  const foot = [s.asOf ? monY(s.asOf) : "", s.source].filter(Boolean).join(" · ");
  const tip = [s.label, s.sub, foot].filter(Boolean).join(" — ");
  return `<${tag} class="rate-tile"${attrs} title="${esc(tip)}">`
    + `<span class="rate-label">${esc(s.label)}</span>`
    + `<span class="rate-val">${val}</span>`
    + chg + `</${tag}>`;
}
function initMacroIndicators() {
  const el = document.getElementById("g-indicators");
  if (!el) return;
  const fail = () => { el.innerHTML = '<div class="g-loading">Indicators unavailable right now.</div>'; };
  fetch("/api/macro")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d) => {
      const series = (d && d.series) || [];
      if (!series.length) return fail();
      _macroSeries = series;
      renderYieldCurve();
      const rowsFor = (c) => IND_ORDER.map((k) => series.find((s) => s.country === c && s.key === k)).filter(Boolean);
      const block = (label, c) => { const r = rowsFor(c); return r.length ? `<div class="rate-sub">${label}</div>${r.map(indTile).join("")}` : ""; };
      const html = block("United States", "US") + block("United Kingdom", "UK");
      if (!html) return fail();
      el.innerHTML = html;
    })
    .catch(fail);
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
    const mag = x.unit === "bp" ? `${Math.abs(c)} bp` : `${Math.abs(c).toFixed(2)} pp`;
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
  el.innerHTML = rowsData.map(ratesTile).join("");
  if (!_briefLeads.rates) setGlance("gl-rates", _pulse.rates ? esc(_pulse.rates) : ratesOneLiner(rowsData));
  setGlTickers("rates", rateTickers(rowsData));
  _rateRows = rowsData;
  renderTicker(); renderMovers(); renderVolRisk(); renderYieldCurve();
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
    .catch(() => { if (!el.querySelector(".rate-tile") && !_pulse.rates) { el.innerHTML = '<span class="g-loading">Market rates unavailable right now.</span>'; if (!_briefLeads.rates) setGlance("gl-rates", "Rates data unavailable right now."); } });
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
function glTkChip(label, dir, mag, href) {
  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "·";
  const inner = `<span class="gl-tk-l">${esc(label)}</span><span class="gl-tk-c">${arrow} ${esc(mag)}</span>`;
  return href
    ? `<a class="gl-tk ${dir}" href="${esc(href)}" target="_blank" rel="noopener noreferrer" title="${esc(label)} — open source">${inner}</a>`
    : `<span class="gl-tk ${dir}">${inner}</span>`;
}
// Markets: rank by the effective move (futures-implied when the market is shut,
// else the daily %), take the five largest, render as signed % chips.
function marketTickers(rows) {
  const scored = (rows || [])
    .filter((x) => x.value != null)
    .map((x) => {
      const move = (!isMarketOpen(x) && x.futuresPct != null) ? +Number(x.futuresPct)
        : (x.changePct != null ? +Number(x.changePct) : null);
      return move == null ? null : { label: x.label, move, href: x.href };
    })
    .filter(Boolean)
    .sort((a, b) => Math.abs(b.move) - Math.abs(a.move))
    .slice(0, 5);
  return scored.map((s) => glTkChip(s.label, glSign(s.move), `${Math.abs(s.move).toFixed(2)}%`, s.href)).join("");
}
// Rates & spreads: rank by the move in basis points (both yields and OAS change
// are decimals of a percentage point, so ×100 → bp), take the five largest.
function rateTickers(rows) {
  const scored = (rows || [])
    .filter((x) => x.value != null && x.change != null)
    .map((x) => ({ label: x.label, bp: Math.round(x.change * 100), href: x.href }))
    .sort((a, b) => Math.abs(b.bp) - Math.abs(a.bp))
    .slice(0, 5);
  return scored.map((s) => glTkChip(s.label, glSign(s.bp), `${Math.abs(s.bp)} bp`, s.href)).join("");
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
  // Two decimals for every value (even round thousands) so the decimal points
  // line up vertically down the band. The compact ticker keeps fmtPrice.
  const val = x.value != null
    ? Number(x.value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";
  let chg = '<span class="rate-chg flat">·</span>';
  if (x.changePct != null && x.value != null) {
    const c = +Number(x.changePct).toFixed(2);
    const dir = c > 0 ? "up" : c < 0 ? "down" : "flat";
    const arrow = c > 0 ? "▲" : c < 0 ? "▼" : "·";
    chg = `<span class="rate-chg ${dir}">${arrow} ${Math.abs(c).toFixed(2)}%</span>`;
  }
  const asOf = x.asOf ? ` as of ${esc(x.asOf)}` : "";
  const title = ` title="${esc(x.label)}${asOf} — open source"`;
  const tag = x.href ? "a" : "div";
  const attrs = x.href ? ` href="${esc(x.href)}" target="_blank" rel="noopener noreferrer"` : "";
  return `<${tag} class="rate-tile mkt-tile"${attrs}${title}><span class="rate-label">${esc(x.label)}${marketDot(x)}</span><span class="rate-val">${val}</span>${chg}</${tag}>`;
}
function renderMarketsBand(el, d) {
  const rows = (d && d.markets) || [];
  if (!rows.length) return false;
  el.innerHTML = rows.map(marketTile).join("");
  if (!_briefLeads.markets) setGlance("gl-markets", _pulse.markets ? esc(_pulse.markets) : marketsOneLiner(rows));
  // Chips pick the top movers from a WIDER pool (the banner 8 + extra global
  // cross-asset instruments), so they aren't limited to the banner tiles.
  setGlTickers("markets", marketTickers([...rows, ...((d.moversExtra) || [])]));
  renderFxMatrix(d);
  _mktRows = rows;
  _mktExtra = d.moversExtra || [];
  _mktEtf = d.moversEtf || [];
  renderTicker(); renderMovers(); renderVolRisk();
  return true;
}
// FX daily matrix — USD/GBP/EUR/JPY cross rates derived from the three USD pairs
// (EUR/USD, GBP/USD, USD/JPY) that already ride along in the markets feed's extra-
// movers pool. cell(row,col) = value of 1 unit of the row currency in the column
// currency. No extra request — it reuses the markets payload.
const FX_CCY = ["USD", "GBP", "EUR", "JPY"];
function fxData(d) {
  const all = [...(((d && d.markets) || [])), ...(((d && d.moversExtra) || []))];
  const find = (lbl) => all.find((x) => x.label === lbl);
  const g = find("GBP/USD"), e = find("EUR/USD"), j = find("USD/JPY");
  const v = (x) => (x && x.value != null ? +x.value : NaN);
  if (!(v(g) > 0) || !(v(e) > 0) || !(v(j) > 0)) return null;
  const chg = (x) => (x && typeof x.changePct === "number" && isFinite(x.changePct) ? x.changePct : 0);
  // USD value of 1 unit of each, and each currency's daily % move vs USD.
  return {
    up: { USD: 1, GBP: v(g), EUR: v(e), JPY: 1 / v(j) },
    dPct: { USD: 0, GBP: chg(g), EUR: chg(e), JPY: -chg(j) },
  };
}
const fmtFx = (v) => (v >= 100 ? v.toFixed(1) : v >= 1 ? v.toFixed(3) : v.toFixed(4));
// A faint background tint scaled to the cross's daily move — deliberately low
// contrast (a glance reads it, but it doesn't pull the eye). No tint on tiny moves.
function fxHeat(chg) {
  const a = Math.min(Math.abs(chg) / 1.0, 1) * 0.18;
  if (!(a > 0.015)) return "";
  return ` style="background:rgba(${chg > 0 ? "5,150,105" : "220,38,38"},${a.toFixed(3)})"`;
}
function renderFxMatrix(d) {
  const el = document.getElementById("g-fx");
  if (!el) return false;
  const fx = fxData(d) || fxData(readCache("markets"));
  if (!fx) return false;
  const { up, dPct } = fx;
  const head = `<tr><th></th>${FX_CCY.map((c) => `<th>${c}</th>`).join("")}</tr>`;
  const body = FX_CCY.map((base) => {
    const cells = FX_CCY.map((q) => {
      if (base === q) return `<td class="g-fx-diag">—</td>`;
      const chg = dPct[base] - dPct[q];   // row currency's move vs the column currency
      const tip = `${base}/${q} ${chg > 0 ? "+" : ""}${chg.toFixed(2)}% today — source: Yahoo Finance`;
      const href = `https://finance.yahoo.com/quote/${base}${q}=X`;
      return `<td${fxHeat(chg)}><a href="${esc(href)}" target="_blank" rel="noopener noreferrer" title="${esc(tip)}">${fmtFx(up[base] / up[q])}</a></td>`;
    }).join("");
    return `<tr><th>${base}</th>${cells}</tr>`;
  }).join("");
  el.innerHTML = `<table class="g-fx-tbl"><thead>${head}</thead><tbody>${body}</tbody></table>`;
  return true;
}

// ---- Terminal ticker strip · top movers · cross-desk counts -----------------
// The ticker strip and movers panel are derived views over the SAME live markets
// and rates payloads the left-rail panels show — no extra request. The renderers
// stash the freshest rows so either feed landing repaints both derived views.
let _mktRows = [], _rateRows = [], _mktExtra = [], _mktEtf = [];
// NB: _macroSeries is declared further down (populated by the macro snapshot).
const TK_SHORT = { "S&P 500": "SPX", "NASDAQ": "NDX", "IGWD": "FTSE", "EMEE": "STOXX", "Oil": "BRENT", "Gold": "GOLD", "DXY": "DXY", "Bitcoin": "BTC" };
function renderTicker() {
  const row = document.getElementById("g-ticker-row");
  if (!row) return;
  const items = [];
  (_mktRows || []).forEach((x) => {
    if (x.value == null) return;
    const eff = (!isMarketOpen(x) && x.futuresPct != null) ? +Number(x.futuresPct) : (x.changePct != null ? +Number(x.changePct) : null);
    items.push({ s: TK_SHORT[x.label] || x.label, v: fmtPrice(x.value), chg: eff == null ? "" : `${eff > 0 ? "+" : ""}${eff.toFixed(2)}%`, dir: glSign(eff || 0), href: x.href });
  });
  (_rateRows || []).slice(0, 5).forEach((x) => {
    if (x.value == null) return;
    const bp = x.change != null ? Math.round(x.change * 100) : null;
    items.push({ s: x.label.replace(/ OAS$/, ""), v: fmtRate(x.value, x.unit).replace(/\s/g, ""), chg: bp == null ? "" : `${bp > 0 ? "+" : ""}${bp}bp`, dir: glSign(bp || 0), href: x.href });
  });
  row.innerHTML = items.map((it) => {
    const inner = `<span class="s">${esc(it.s)}</span><span class="v">${esc(it.v)}</span>${it.chg ? `<span class="${it.dir}">${esc(it.chg)}</span>` : ""}`;
    return it.href ? `<a class="g-tk" href="${esc(it.href)}" target="_blank" rel="noopener noreferrer">${inner}</a>` : `<span class="g-tk">${inner}</span>`;
  }).join("");
}
function renderMovers() {
  const el = document.getElementById("g-movers");
  if (!el) return;
  const list = [];
  const seenNm = new Set();
  const pushPct = (label, x, short = true) => {
    if (!x || x.value == null) return;
    const eff = (!isMarketOpen(x) && x.futuresPct != null) ? +Number(x.futuresPct) : (x.changePct != null ? +Number(x.changePct) : null);
    if (eff == null) return;
    const nm = short ? (TK_SHORT[label] || label) : label;
    if (seenNm.has(nm)) return; seenNm.add(nm);
    list.push({ nm, mag: Math.abs(eff), dir: glSign(eff), val: `${eff > 0 ? "+" : ""}${eff.toFixed(2)}%`, unit: "pct", href: x.href || null, dot: marketDot(x) });
  };
  // The board is a cross-asset ETF universe — equity indices & sectors, bonds,
  // commodities and crypto, each an ETF so every row is one comparable % move.
  // Fall back to the legacy mixed pool only if the ETF feed hasn't arrived yet
  // (e.g. an older cached /api/markets response without moversEtf).
  if ((_mktEtf || []).length) {
    (_mktEtf || []).forEach((x) => pushPct(x.label, x, false));
  } else {
    (_mktRows || []).forEach((x) => pushPct(x.label, x));
    (_mktExtra || []).forEach((x) => { if (!/\//.test(x.label)) pushPct(x.label, x); });
    (_rateRows || []).forEach((x) => {
      if (x.value == null || x.change == null) return;
      const bp = Math.round(x.change * 100);
      if (!bp) return;
      list.push({ nm: x.label.replace(/ OAS$/, ""), mag: Math.abs(bp), dir: glSign(bp), val: `${bp > 0 ? "+" : ""}${bp}bp`, unit: "bp" });
    });
  }
  if (!list.length) { el.innerHTML = '<div class="g-empty">No moves yet.</div>'; return; }
  const maxPct = Math.max(...list.filter((x) => x.unit === "pct").map((x) => x.mag), 0.01);
  const maxBp = Math.max(...list.filter((x) => x.unit === "bp").map((x) => x.mag), 1);
  const rel = (x) => x.mag / (x.unit === "pct" ? maxPct : maxBp);
  // Signed, unit-normalised size so gainers and losers order consistently even
  // though the board mixes % and bp moves.
  const signed = (x) => rel(x) * (x.dir === "up" ? 1 : x.dir === "down" ? -1 : 0);
  // Take the biggest movers (either direction), then order them from the biggest
  // increase at the top down to the biggest decrease at the bottom.
  const top = list.sort((a, b) => rel(b) - rel(a)).slice(0, 18).sort((a, b) => signed(b) - signed(a));
  el.innerHTML = top.map((x) => {
    // Diverging bar: 0 is the centre; gains grow right (green), losses left (red).
    // Half the track = the biggest move in that unit, so each half fills to 50%.
    const half = Math.max(3, Math.round(rel(x) * 50));
    const col = x.dir === "up" ? "var(--t-up)" : x.dir === "down" ? "var(--t-down)" : "var(--t-faint)";
    const pos = x.dir === "down" ? `right:50%;left:auto` : `left:50%;right:auto`;
    const tag = x.href ? "a" : "div";
    const attrs = x.href ? ` href="${esc(x.href)}" target="_blank" rel="noopener noreferrer" title="${esc(x.nm)} — open source"` : "";
    return `<${tag} class="g-mv"${attrs}><span class="nm">${esc(x.nm)}${x.dot || ""}</span><span class="bar"><i style="${pos};width:${half}%;background:${col}"></i></span><span class="val ${x.dir}">${esc(x.val)}</span></${tag}>`;
  }).join("");
}
// Latest credit deals — the most recent priced/announced deals, deep-linking into
// the Credit desk. Fills the right rail with cross-desk data on the home hub.
function renderDeals() {
  const el = document.getElementById("g-deals");
  if (!el) return;
  const list = [...deals].sort(byDateDesc).slice(0, 8);
  if (!list.length) { el.innerHTML = '<div class="g-empty">No deals yet.</div>'; return; }
  el.innerHTML = list.map((d) => {
    const meta = [creditSource(d), d.date ? fmt(String(d.date).slice(0, 10)) : ""].filter(Boolean).join(" · ");
    return `<a class="tui-li" href="${esc(creditItemHref(d))}"${creditItemExt(d) ? ' target="_blank" rel="noopener noreferrer"' : ""}><span class="tui-li-t">${esc(d.headline)}</span>`
      + `<span class="tui-li-m"><span class="tui-li-tag">DEAL</span>${esc(meta)}</span></a>`;
  }).join("");
}
// Fundraising & CLOs — the newest closes/launches from the credit intel feed,
// deep-linking into the Credit desk alongside the deal flow.
function renderFundraising() {
  const el = document.getElementById("g-fund");
  if (!el) return;
  const list = [...intel].filter((i) => i.date).sort(byDateDesc).slice(0, 8);
  if (!list.length) { el.innerHTML = '<div class="g-empty">Nothing raised yet.</div>'; return; }
  el.innerHTML = list.map((i) => {
    const kind = i.clo ? "CLO" : "RAISE";
    const meta = [creditSource(i), i.date ? fmt(String(i.date).slice(0, 10)) : ""].filter(Boolean).join(" · ");
    return `<a class="tui-li" href="${esc(creditItemHref(i))}"${creditItemExt(i) ? ' target="_blank" rel="noopener noreferrer"' : ""}><span class="tui-li-t">${esc(i.headline)}</span>`
      + `<span class="tui-li-m"><span class="tui-li-tag">${kind}</span>${esc(meta)}</span></a>`;
  }).join("");
}
// Active restructurings & schemes — the most recent from the Legal desk.
function renderRx() {
  const el = document.getElementById("g-rx");
  if (!el) return;
  const list = [...restructurings].filter((r) => r.date).sort(byDateDesc).slice(0, 8);
  if (!list.length) { el.innerHTML = '<div class="g-empty">Nothing active.</div>'; return; }
  el.innerHTML = list.map((r) => {
    const kind = r.type === "scheme" ? "SCHEME" : "RP";
    const meta = [r.date ? fmt(String(r.date).slice(0, 10)) : ""].filter(Boolean).join(" · ");
    return `<a class="tui-li" href="${esc(r.judgmentUrl || r.articleUrl || "/legal/#/")}"${(r.judgmentUrl || r.articleUrl) ? ' target="_blank" rel="noopener noreferrer"' : ""}><span class="tui-li-t">${esc(r.company)}</span>`
      + `<span class="tui-li-m"><span class="tui-li-tag lex">${kind}</span>${esc(meta)}</span></a>`;
  }).join("");
}
// Deal-flow chips — one panel, three panes (deals / fundraising / schemes-RPs).
// Clicking a chip shows its pane and hides the others; the active list scrolls
// on its own so the macro data pinned above it never moves.
function initFlowChips() {
  const chips = [...document.querySelectorAll(".g-flow-chip")];
  if (!chips.length) return;
  const paneOf = { deals: "g-deals", fund: "g-fund", rx: "g-rx" };
  const body = document.querySelector(".g-flow-body");
  const select = (key) => {
    chips.forEach((c) => {
      const on = c.dataset.flow === key;
      c.classList.toggle("is-on", on);
      c.setAttribute("aria-selected", on ? "true" : "false");
    });
    Object.entries(paneOf).forEach(([k, id]) => {
      const el = document.getElementById(id);
      if (el) el.hidden = k !== key;
    });
    if (body) body.scrollTop = 0;
  };
  chips.forEach((c) => c.addEventListener("click", () => select(c.dataset.flow)));
}

// ---- Volatility & risk (left rail) + Yield curve (right rail) ---------------
// Both reuse the .rate-tile band (label · value · change) so they read exactly
// like Markets / Key rates. Data is stitched from feeds already fetched: VIX from
// the markets extra-movers pool, OAS spreads from the rates feed, and the 2-year
// yield from the macro feed (the 10-year comes from the rates feed).
const dSign = (c) => (c == null ? "flat" : c > 0 ? "up" : c < 0 ? "down" : "flat");
function riskTile(o) {
  const chg = o.chg == null
    ? '<span class="rate-chg flat">·</span>'
    : `<span class="rate-chg ${o.dir}">${o.dir === "up" ? "▲" : o.dir === "down" ? "▼" : "·"} ${o.chg}</span>`;
  const tag = o.href ? "a" : "div";
  const attrs = o.href ? ` href="${esc(o.href)}" target="_blank" rel="noopener noreferrer"` : "";
  return `<${tag} class="rate-tile"${attrs} title="${esc(o.title || o.label)}">`
    + `<span class="rate-label">${esc(o.label)}</span><span class="rate-val">${esc(o.val)}</span>${chg}</${tag}>`;
}
const findRate = (label) => (_rateRows || []).find((x) => x.label === label);
const findExtra = (label) => (_mktExtra || []).find((x) => x.label === label);
const findMacro = (country, key) => (_macroSeries || []).find((s) => s.country === country && s.key === key);
// OAS series carry `value`/`change` in PERCENT (0.95 → 95 bp), matching fmtRate.
const bpTxt = (v) => `${Math.round(v * 100)} bp`;
function renderVolRisk() {
  const el = document.getElementById("g-vol");
  if (!el) return;
  const vix = findExtra("VIX");
  const hy = findRate("US HY OAS"), ig = findRate("US IG OAS"), ccc = findRate("US CCC OAS");
  const rows = [];
  if (vix && vix.value != null) {
    // The markets feed carries VIX's % move; convert to points for the tile.
    const cp = typeof vix.changePct === "number" ? vix.changePct : null;
    const pts = cp == null ? null : +vix.value - (+vix.value) / (1 + cp / 100);
    rows.push(riskTile({ label: "VIX", val: (+vix.value).toFixed(2), chg: pts == null ? null : Math.abs(pts).toFixed(2) + " pt", dir: dSign(pts), href: "https://finance.yahoo.com/quote/%5EVIX", title: "CBOE Volatility Index — equity volatility" }));
  }
  if (hy && hy.value != null) {
    rows.push(riskTile({ label: "HY OAS", val: bpTxt(hy.value), chg: hy.change == null ? null : Math.abs(Math.round(hy.change * 100)) + " bp", dir: dSign(hy.change), href: hy.href, title: "US high-yield option-adjusted spread" }));
  }
  if (hy && ig && hy.value != null && ig.value != null) {
    const v = hy.value - ig.value, c = (hy.change != null && ig.change != null) ? hy.change - ig.change : null;
    rows.push(riskTile({ label: "HY − IG", val: bpTxt(v), chg: c == null ? null : Math.abs(Math.round(c * 100)) + " bp", dir: dSign(c), href: hy.href, title: "Quality premium — high-yield minus investment-grade OAS" }));
  }
  if (ccc && hy && ccc.value != null && hy.value != null) {
    const v = ccc.value - hy.value, c = (ccc.change != null && hy.change != null) ? ccc.change - hy.change : null;
    rows.push(riskTile({ label: "CCC − HY", val: bpTxt(v), chg: c == null ? null : Math.abs(Math.round(c * 100)) + " bp", dir: dSign(c), href: ccc.href, title: "Distress premium — CCC minus high-yield OAS" }));
  }
  if (rows.length) el.innerHTML = rows.join("");
}
function renderYieldCurve() {
  const el = document.getElementById("g-curve");
  if (!el) return;
  const t2 = findMacro("US", "two_year"), t10 = findRate("US 10Y");
  const rows = [];
  if (t2 && t2.value != null) {
    rows.push(riskTile({ label: "2Y", val: (+t2.value).toFixed(2) + "%", chg: t2.change == null ? null : Math.abs(t2.change).toFixed(2) + " pp", dir: dSign(t2.change), href: t2.href, title: "US 2-year Treasury yield" }));
  }
  if (t10 && t10.value != null) {
    rows.push(riskTile({ label: "10Y", val: (+t10.value).toFixed(2) + "%", chg: t10.change == null ? null : Math.abs(t10.change).toFixed(2) + " pp", dir: dSign(t10.change), href: t10.href, title: "US 10-year Treasury yield" }));
  }
  if (t2 && t10 && t2.value != null && t10.value != null) {
    const spBp = Math.round((+t10.value - +t2.value) * 100);
    const cBp = (t10.change != null && t2.change != null) ? Math.round((t10.change - t2.change) * 100) : null;
    rows.push(riskTile({ label: "2s10s", val: `${spBp > 0 ? "+" : ""}${spBp} bp`, chg: cBp == null ? null : Math.abs(cBp) + " bp", dir: dSign(cBp), href: t10.href, title: "2s10s slope — 10Y minus 2Y (negative = inverted, a recession signal)" }));
  }
  if (rows.length) el.innerHTML = rows.join("");
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
    .catch(() => { if (!el.querySelector(".rate-tile") && !_pulse.markets) { el.innerHTML = '<span class="g-loading">Markets unavailable right now.</span>'; if (!_briefLeads.markets) setGlance("gl-markets", "Markets data unavailable right now."); } });
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
      if (_pulse.markets && !_briefLeads.markets) setGlance("gl-markets", esc(_pulse.markets));
      if (_pulse.rates && !_briefLeads.rates) setGlance("gl-rates", esc(_pulse.rates));
      // First view often precedes the first background generation — retry once.
      if (!_pulse.markets && !_pulseRetried) { _pulseRetried = true; setTimeout(initPulse, 15000); }
    })
    .catch(() => { /* keep deterministic lines */ });
}

// ---- Notifications ----------------------------------------------------------
// The Home-only bell (initNotifBell/renderBell and friends) is RETIRED: all
// four pages share the nav-actions.js bell, whose list comes from saved.js
// buildNotifs() — limited to the deal-flow desks (manager news, deals,
// fundraising, CLOs, legal alerts, case law, schemes/RPs).

// Shared cache of the /api/macro series — populated by the macro snapshot
// (initMacroSnapshot) and read via findMacro().
let _macroSeries;

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
  // `label` is the pill text (the sub-section / tab the item lives in, e.g.
  // "Legal alert", "Case law", "Deal", "Fundraising"); `tag` still drives the
  // pill colour (macro / credit / legal). Falls back to the section name.
  const add = (tag, title, sub, href, rank, date, label) => idx.push({ tag, title, sub, href, rank, date: date || "", label: label || "", hay: expandHay(title + " " + sub) });

  add("view", "Home", "Cross-desk briefing", "/", 4, "");
  [["commentary", "Commentary", "Commentary"], ["policy", "Rate outlook", "Policy"], ["cycle", "Cycle", "Cycle"], ["bubble", "Bubble risk", "Bubble"], ["chart", "Chart", "Chart"], ["saved", "Saved", "Saved"]]
    .forEach(([k, l, tl]) => add("macro", `Macro — ${l}`, "View", `/macro/#/${k}`, 4, "", tl));

  managers.forEach((m) => add("credit", m.name, "Manager", `/credit/#/manager/${encodeURIComponent(m.id)}`, 0, "", "Manager"));
  funds.forEach((f) => add("credit", f.name, `Fund${f.managerId && mgrName(f.managerId) ? " · " + mgrName(f.managerId) : ""}`, `/credit/#/fund/${encodeURIComponent(f.id)}`, 1, "", "Fund"));
  deals.forEach((d) => add("credit", d.headline, `${d.clo ? "CLO" : "Deal"} · ${fmt(d.date)}${mgrName(d.managerId) ? " · " + mgrName(d.managerId) : ""}`, creditItemHref(d), d.clo ? 1 : 2, d.date, d.clo ? "CLO" : "Deal"));
  intel.forEach((i) => add("credit", i.headline, `${i.clo ? "CLO · " : ""}${i.type || "Fundraising"} · ${fmt(i.date)}${mgrName(i.managerId) ? " · " + mgrName(i.managerId) : ""}`, creditItemHref(i), i.clo ? 1 : 2, i.date, i.clo ? "CLO" : "Fundraising"));
  (research || []).forEach((r) => add("credit", r.title, `${r.institution}${r.type ? " · " + r.type : ""}${r.date ? " · " + fmt(r.date) : ""}`, r.url, 2, r.date, "Commentary"));

  // Law firms — rank 0 (like managers) so "Freshfields" surfaces the firm page
  // first; the page compiles the firm's alerts, matters, cases and deal mentions.
  const TIER_LBL = { magic: "Magic Circle", silver: "Silver Circle", "us-elite": "US elite", chambers: "Chambers" };
  Object.values(firmById || {}).forEach((f) => add("legal", f.name, `Law firm${TIER_LBL[f.tier] ? " · " + TIER_LBL[f.tier] : ""}`, `/legal/#/firm/${encodeURIComponent(f.id)}`, 0, "", "Firm"));

  items.forEach((i) => add("legal", i.title, `Legal alert${i.firm ? " · " + (((firmById || {})[i.firm] || {}).name || i.firm) : ""}${i.date ? " · " + fmt(i.date) : ""}`, i.url || `/legal/#/item/${encodeURIComponent(i.id)}`, 2, i.date, "Alert"));
  cases.forEach((c) => add("legal", c.name, `Case · ${c.court || ""}${c.citation ? " · " + c.citation : ""}`, c.url || "/legal/#/", 2, c.date, "Case"));
  restructurings.forEach((r) => add("legal", r.company, `${r.type === "scheme" ? "Scheme" : "Restructuring plan"}${r.citation ? " · " + r.citation : ""}`, (r.judgmentUrl || r.articleUrl || "/legal/#/"), 2, r.date, r.type === "scheme" ? "Scheme" : "RP"));

  ["US", "UK"].forEach((ctry) => MACRO_INDICATORS.forEach(([k, l]) =>
    add("macro", `${ctry} ${l}`, "Open in Chart", `/macro/#/chart?add=${ctry}:${k}`, 3, "", "Chart")));

  // ---- News items (so a search for e.g. "Federal Reserve" finds headlines) ----
  // Macro news headlines (US/UK) + the market reading list — link out to the
  // source, deduped across the two feeds.
  const seenNews = new Set();
  const addNews = (n) => {
    const k = (n.url || n.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
    if (k && seenNews.has(k)) return; if (k) seenNews.add(k);
    add("macro", n.title, `Macro news${n.source ? " · " + n.source : ""}${n.date ? " · " + fmt(n.date) : ""}`, n.url, 2, n.date, "News");
  };
  ["us", "uk"].forEach((c) => ((NEWS && NEWS[c]) || []).forEach(addNews));
  ((ARTICLES && ARTICLES.items) || []).forEach(addNews);
  // Editorial macro guidance (rate outlook / cycle / bubble).
  (ALERTS || []).forEach((a) => add("macro", a.title, `Macro guidance${a.kind ? " · " + a.kind : ""}`, `/macro/${a.href || "#/policy"}`, 3, a.date, "Guidance"));
  // Credit manager press (news + webNews), deduped per manager — deep-link into the profile.
  managers.forEach((m) => {
    const seen = new Set();
    [...(m.news || []), ...(m.webNews || [])].forEach((w) => {
      const k = (w.url || w.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
      if (k && seen.has(k)) return; seen.add(k);
      add("credit", w.title, `News${m.name ? " · " + m.name : ""}${w.date ? " · " + fmt(w.date) : ""}`,
        `/credit/#/manager/${encodeURIComponent(m.id)}?focus=k:${encodeURIComponent(feedDedupKey(w))}`, 2, w.date, "News");
    });
  });

  // myFT stories + email newsletters — so they're searchable and the "/FT" /
  // "/LETTER" code filters have content to list.
  (FT_ITEMS || []).forEach((f) => add("ft", f.title, `Financial Times · myFT${f.date ? " · " + fmt(f.date) : ""}`, f.url, 2, f.date, "FT"));
  (NEWSLETTERS || []).forEach((n) => add("letter", n.title, `${n.publication || "Newsletter"}${n.series ? " · " + n.series : ""}${n.date ? " · " + fmt(n.date) : ""}`, n.url, 2, n.date, "Letter"));
  // Curated Substacks (live from /api/feed, seeded from cache at init) — so the
  // "/SUBS" code filter has content to list.
  (_liveFeed || []).forEach((n) => { if (n.substack) add("substack", n.title, `${n.source || "Substack"}${n.date ? " · " + fmt(n.date) : ""}`, n.url, 2, n.date, "SUBS"); });

  return idx;
}

// ---- Command palette -------------------------------------------------------
const PAL_CODE = { macro: "MAC", credit: "CRD", legal: "LEX", view: "GO", ft: "FT", letter: "LETTER", substack: "SUBS" };
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
    // "/CODE [text]" filters by the label chip (e.g. /FT, /LEX, /LETTER, /MAC,
    // /CRD) — prefix match, so /LE lists LEX and LETTER together.
    let code = null;
    if (q.startsWith("/")) { const parts = q.slice(1).split(/\s+/); code = parts.shift() || ""; q = parts.join(" "); }
    if (!q && !code) return [];
    const pool = code ? idx.filter((e) => String(PAL_CODE[e.tag] || e.label || e.tag).toLowerCase().startsWith(code)) : idx;
    const toks = q ? q.split(/\s+/) : [];
    return pool
      .map((e) => ({ e, s: toks.every((t) => e.hay.includes(t)) ? score(e, q) : -1 }))
      .filter((x) => x.s >= 0 || (toks.length && x.e.hay.includes(toks[0])))
      .map((x) => ({ e: x.e, s: x.s < 0 ? 4 : x.s }))
      .sort((a, b) =>
        a.e.rank - b.e.rank ||
        (a.e.rank === 2 ? String(b.e.date).localeCompare(String(a.e.date)) : 0) ||
        a.s - b.s ||
        a.e.title.localeCompare(b.e.title))
      .slice(0, code ? 60 : 40).map((x) => x.e);
  }
  function draw() {
    if (!current.length) { results.innerHTML = input.value.trim() ? `<div class="cmdk-empty">No matches.</div>` : ""; return; }
    results.innerHTML = current.map((e, i) => `
      <div class="cmdk-row${i === sel ? " sel" : ""}" data-i="${i}">
        <span class="cmdk-t">${esc(e.title)}</span>
        <span class="cmdk-meta"><span class="cmdk-code ${e.tag}">${esc(PAL_CODE[e.tag] || e.label || e.tag)}</span>${e.sub ? `<span class="cmdk-s">${esc(e.sub)}</span>` : ""}</span>
      </div>`).join("");
    const s = results.querySelector(".cmdk-row.sel"); if (s) s.scrollIntoView({ block: "nearest" });
  }
  function refresh() { current = search(input.value); sel = 0; draw(); }
  // Remember the query whenever a result is opened — feeds the Menu panel's
  // "Recent searches" list (shared key with the app palettes).
  function recordSearch(q) {
    q = String(q || "").trim(); if (!q) return;
    try {
      const k = "wire.recentSearches";
      const a = (JSON.parse(localStorage.getItem(k) || "[]") || []).filter((x) => typeof x === "string" && x.toLowerCase() !== q.toLowerCase());
      a.unshift(q);
      localStorage.setItem(k, JSON.stringify(a.slice(0, 8)));
    } catch { /* ignore */ }
  }
  // Recents record ONLY when a result is actually opened — a typed-then-cancelled
  // query (or a half-typed fragment) never lands in the list.
  function go(e) { if (!e) return; recordSearch((e.title || input.value || "").trim()); close(); if (/^https?:\/\//i.test(e.href)) window.open(e.href, "_blank", "noopener"); else window.location.href = e.href; }

  // Focus SYNCHRONOUSLY within the tap gesture so iOS Safari pops the keyboard
  // immediately (a setTimeout would escape the gesture and suppress it).
  function open() { overlay.classList.add("open"); input.value = ""; refresh(); syncClr(); input.focus({ preventScroll: true }); }
  function close() { overlay.classList.remove("open"); }

  document.getElementById("open-cmdk").addEventListener("click", open);
  // Also open from the mobile bottom-bar search button (or any [data-open-search]).
  document.addEventListener("click", (e) => { if (e.target.closest("[data-open-search]")) { e.preventDefault(); open(); } });
  overlay.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", close));
  // ✕ clears the typed query (visible only while there's text) and refocuses.
  const clr = document.getElementById("cmdk-clear");
  const syncClr = () => { if (clr) clr.hidden = !input.value; };
  if (clr) clr.addEventListener("click", () => { input.value = ""; refresh(); syncClr(); input.focus(); });
  input.addEventListener("input", () => { refresh(); syncClr(); });
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
  // Menu panel "Recent searches" → reopen the search seeded with that query.
  document.addEventListener("wire:search", (e) => {
    open();
    const q = e.detail && e.detail.q;
    if (q) { input.value = q; refresh(); syncClr(); }
  });
  // Arriving from an in-app ⌘K (which routes to "/#find") opens search immediately.
  if (location.hash === "#find") { history.replaceState(null, "", "/"); open(); }
}
