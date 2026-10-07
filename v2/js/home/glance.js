// AUTO-PORTED from glance.js for the v2 SPA. initGlance() is reused as-is;
// only the nav-actions boot and glance's own palette are skipped (the shell
// owns chrome + search), and listeners self-guard on the active tab.

import { managerWire, CAT_LABEL, dedupeEvents, loadManagerData } from "/v2/js/manager-signals.js";
// Watchlist read-layer + follow button (shared with the Credit view so the ☆/★
// and the meridian.follows store are one implementation). The write here mirrors
// the credit app's localStorage persist; its cloud sync reconciles on next visit.
import { follows, followList, followBtn } from "/credit/js/shared.js";
import { reportRefresh } from "/v2/js/status.js";
import { NEWSLETTERS } from "/newsletters.js";
import { RESEARCH } from "/research.js";
import { FT_ITEMS } from "/ft.js";
import { X_LIST, X_ACCOUNTS } from "/v2/js/home/xposts.js";
import { BRIEFINGS } from "/briefings.js";
import { nbNums } from "/v2/js/nb-format.js";
import { h, Fragment, signal, effect, batch, mount } from "/v2/js/ui.js";
import { esc, byDateDesc, NEWS_SOURCES, srcHost, tidyDomain, MONTHS } from "/util.js";
import { DESK, DESK_CODE, STRICT_MACRO_RE, deskFor, nlDesk, feedRow,
  feedBodyHTML, feedSrcBarHTML, feedEmptyHTML, byFeedDesc, stampAddedTimes, fmtDay as fmt } from "/feed.js";

const __KEY = "home";
const __ROOT = document.documentElement;
const on = (t, ty, fn, o) => t.addEventListener(ty, (e) => { if (__ROOT.dataset.v2tab !== __KEY) return; return fn(e); }, o);

// ---- Deferred desk data (the heavy modules) --------------------------------
// credit/js/data.js (~686 KB gz), legal/js/data.js (~639 KB gz) and
// macro/js/content.js (~169 KB gz) are NOT imported statically — doing so made
// opening Home download+parse ~1.5 MB gzip of desk data before it could paint,
// even though Home only renders slices. They start EMPTY and are populated by
// loadDeskData() (called right after the live/API panes are kicked off), then the
// desk-derived panes are (re-)rendered. Every reader runs inside a function (there
// is no module-eval use), and the feed/snapshot builders already guard empties, so
// pre-load Home paints the live wire + chart and the curated desk items fill in a
// few hundred ms later. loadDeskData also records the "wire:desk" performance
// measure that vitals.js beacons — the number proving this win on real devices.
let deals = [], intel = [], managers = [], funds = [], research = [], HEDGE_INTEL = [], hedgeFunds = [];
let LAST_CHECKED = null, LAST_CHECKED_TIME = null;
let items = [], cases = [], restructurings = [], firmById = {};
let NEWS = {}, ARTICLES = {}, COMMENTARY = {}, CYCLE = {}, BUBBLE = {}, OUTLOOK = {}, EARNINGS = {};
let _deskData = null;
function loadDeskData() {
  if (_deskData) return _deskData;
  try { performance.mark("wire:desk:start"); } catch { /* no perf API */ }
  // ONE compact module (~0.47 MB gz) instead of the three full desk modules
  // (~1.5 MB gz) — see scripts/gen-home-data.mjs. manager-signals reads the same
  // /home-data.js (browser-deduped to a single fetch).
  _deskData = Promise.all([import("/home-data.js"), loadManagerData()]).then(([d]) => {
    ({ deals, intel, managers, funds, research, HEDGE_INTEL, hedgeFunds, LAST_CHECKED, LAST_CHECKED_TIME } = d);
    ({ items, cases, restructurings, firmById } = d);
    _entRe = _entMap = null;                               // rebuild the reader entity index from the loaded rosters
    ({ NEWS, ARTICLES, COMMENTARY, CYCLE, BUBBLE, OUTLOOK, EARNINGS } = d);
    try { performance.measure("wire:desk", "wire:desk:start"); } catch { /* no perf API */ }
  }).catch(() => { _deskData = null; /* allow a retry on the next trigger */ });
  return _deskData;
}

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

// The shared news-wire engine — row/day-header/chip/source-filter markup + the
// desk vocabulary. Home assembles its cross-desk streams below and hands them to
// these helpers; Macro/Credit/Legal use the same module, so every wire is one
// build.
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
// (The low-tier source list + general-news relevance gate now live server-side in
// the Worker's /api/feed assembly — the wire arrives pre-culled for every surface.)
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

let _inited = false;
// Live macro headlines from /api/feed (curated finance/macro RSS, edge-parsed).
// Seeded from last-good cache on load, refreshed on the 5-min live cadence, and
// merged into the home feed's Macro items. Empty until the first fetch resolves.
let _liveFeed = [];

// The Markets dropdown is the SHARED nav-actions panel (#na-mkt-panel) on every
// page, Home included — one identical Markets | Macro | Portfolio list. Home no
// longer relocates its desktop data rails into that panel; on phones it simply
// hides them (the dropdown carries the same numbers), and on desktop they stay
// in the 3-column grid.
function initHomeMarketsRails() {
  const side = document.querySelector(".g-side");
  const side2 = document.querySelector(".g-side2");
  if (!side) return;
  const mq = matchMedia("(max-width:760px)");
  const place = () => {
    const phone = mq.matches;
    side.style.display = phone ? "none" : "";
    if (side2) side2.style.display = phone ? "none" : "";
  };
  place();
  mq.addEventListener("change", place);
}

export function initGlance(ctx) {
  _ctx = ctx || _ctx;
  if (_inited) return; _inited = true;
  // A [data-godash] element (the "This week's earnings" header) deep-links into a
  // Dashboard sub-tab in place (SPA nav), landing on that section's pane — e.g.
  // the earnings calendar under Dashboard › Equities. The <a href> is the
  // no-JS/full-reload fallback to the same route. Bound once (guarded above).
  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-godash]");
    if (!go) return;
    e.preventDefault();
    const base = (_ctx && _ctx.base) || "/v2";
    const to = base + "/dashboard/" + go.dataset.godash;
    if (_ctx && _ctx.navigate) _ctx.navigate(to); else location.href = to;
  });
  // F8 — restore the last-used wire filter + grouping before the first render.
  const _hp = _homePrefs();
  if (_DESK_KEYS.includes(_hp.desk)) _feedDesk = _hp.desk;
  if (typeof _hp.group === "boolean") _feedGroup = _hp.group;
  if (typeof _hp.mgrGroup === "boolean") _mwGroup = _hp.mgrGroup;
  if (typeof _hp.mgrCat === "string") _mwCat = _hp.mgrCat;
  if (typeof _hp.wireLane === "string") _wireLane = _hp.wireLane;
  if (typeof _hp.mgrLaneCat === "string") _mgrLaneCat = _hp.mgrLaneCat;
  _liveFeed = ((readCache("feed") || {}).items) || [];  // instant last-good merge
  // ---- Paint NOW: the shell, the briefing, and every live/API pane. None of
  // these need the heavy desk data, so Home paints without waiting on ~1.5 MB gz.
  renderWire();                                          // live wire (lanes) + reading pane — desk items merge in after load
  initHomeBriefing();                                    // the tri-daily brief atop the News wire (BRIEFINGS — small, static)
  refreshLiveFeed();                                     // then pull fresh headlines
  initMarkets();
  initRates();
  initHormuz();
  initPulse();
  initGlanceTickerToggle();
  // ---- Deferred: load the heavy desk data off the critical path, then (re-)render
  // only the desk-derived panes. The wire re-renders to merge in the curated desk
  // base + manager rows; the manager wire, macro snapshot, earnings and the shared
  // refresh stamp fill in once the data lands (a few hundred ms after first paint).
  loadDeskData().then(() => {
    renderWire();                                        // now with the curated desk base + manager merge
    renderManagerWire();                                 // mobile watch tab (#g-mgrwire)
    renderMacroSnapshot();
    initMacroIndicators();
    renderEarnings();
    reportRefresh(LAST_CHECKED, LAST_CHECKED_TIME);      // v2: app-wide refresh (shared) — real stamp after load
  });
  // Top-bar Markets / Saved / Notifications: the SAME shared controller as
  // Macro/Credit/Legal (nav-actions.js) — one implementation on all pages. The
  // legacy Home-only dropdown menus are retired; on phones Home just hides its
  // desktop data rails (initHomeMarketsRails) and uses the shared Markets panel.
  initHomeMarketsRails();   // v2: chrome is the shell's; skip nav-actions boot
  renderPredict();
  initXWire(true);   // eager: preload the X feed on Home load so it's ready when its chip is opened
  initHero();
  initFeedEntityNav();
  initMobileWireTabs();
  initFocusToggle();   // narrow-desktop (iPad-landscape) Chart ⇄ X column swap
  initJumpNav();
  // v2: search is the shell palette (palette.js); glance palette skipped
  startLiveRefresh();
  initBriefFreshness();   // on reopen, pull a newly-published briefing (see below)
}

// ---- Unified Saved -----------------------------------------------------------
// One cross-desk bookmark list. Each app stores its own saved-id set in
// localStorage; here we resolve those ids back to items (replicating the two
// hashed-id schemes and matching the raw-id ones) so the home page shows
// everything the user has starred across Macro, Credit and Legal in one place.
function _savedHash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
function _savedBase(x) { return (x.url || x.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, ""); }
// One delegated handler: a click (or Enter/Space) on the source name (filter by
// that newsroom) or the source-filter clear pill, without triggering the row's
// own story link.
function initFeedEntityNav() {
  const feed = document.getElementById("g-feed");
  if (!feed) return;
  const handle = (e) => {
    // The publication name is NOT a special external jump: a click on it falls through
    // to the row's own reader handler (opens in the reading pane like the rest of the
    // row). Only the source-filter clear chip is handled here.
    const clr = e.target.closest("[data-clearsrc]");
    if (clr) { e.preventDefault(); e.stopPropagation(); _feedSrc = null; renderWire(); }
  };
  feed.addEventListener("click", handle);
  feed.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") handle(e); });
}

// Mobile-only News / Watchlist swap. On phones the aggregated news wire and the
// manager (watchlist) wire can't sit side by side, so a chip pair at the top of
// the workspace toggles which one is on screen (a `.wire-watch` class on the
// grid drives the CSS show/hide). Inert on desktop, where the chips are hidden
// and both columns show at once.
function initMobileWireTabs() {
  const tabs = document.querySelector(".g-wiretabs");
  const layout = document.querySelector(".g-layout");
  const main = document.querySelector(".g-main");
  if (!tabs || !layout) return;
  const setWire = (k) => {
    closeMobileReader();                                  // a pane switch leaves the in-app reader
    layout.classList.toggle("wire-brief", k === "brief");
    layout.classList.toggle("wire-watch", k === "watch");
    layout.classList.toggle("wire-x", k === "x");
    layout.classList.toggle("wire-chart", k === "chart");
    // Mirror the state onto .g-main too (kept for any .g-main.wire-* rules that
    // target content lifted out of the hidden panes on phones).
    if (main) { main.classList.toggle("wire-brief", k === "brief"); main.classList.toggle("wire-watch", k === "watch"); main.classList.toggle("wire-x", k === "x"); main.classList.toggle("wire-chart", k === "chart"); }
    tabs.querySelectorAll(".g-wiretab").forEach((t) => {
      const on = t.dataset.wire === k;
      t.classList.toggle("is-on", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    // The X wire and hero chart render lazily; revealing their (previously hidden)
    // pane lets the observer boot them, but also kick directly so no blank frame.
    if (k === "x") initXWire();
    if (k === "chart") initHero();
    // The Briefing pane is a fixed-height, internally-scrolling box; drop the page's
    // bottom-nav padding so the page itself doesn't scroll (the box's body does), and
    // size the box to the exact gap between the tabs and the nav. The class is cleared
    // when Home is left (home.js).
    try { document.documentElement.classList.toggle("home-brief", k === "brief"); } catch { /* noop */ }
    // Opening the Briefing pane counts as reading the latest brief → clear its dot.
    if (k === "brief") _markBriefRead(_briefLatest());
    _updateBriefDot();
    _placeBriefPane();
  };
  if (!window.__wirePlaceBound) {
    window.__wirePlaceBound = true;
    let briefResizeQueued = false;
    window.addEventListener("resize", () => {
      if (briefResizeQueued) return;
      briefResizeQueued = true;
      requestAnimationFrame(() => { briefResizeQueued = false; try { _placeBriefPane(); } catch { /* noop */ } });
    });
  }
  // Remember the module-level setter so a Home-nav tap (homeReset) can jump the pane.
  _wireSetter = setWire;
  // F8 — restore the last-used wire tab on load, else land on the DEFAULT pane, which
  // is now the wire (News/All lane), not the Market Briefing. Always call setWire so a
  // stored chart/watch/x class is cleared back on a fresh visit.
  const _wp = _homePrefs().wire;
  setWire(["brief", "news", "chart", "x"].includes(_wp) ? _wp : "news");   // "watch" retired — merged into the wire lanes
  const laneMenu = document.getElementById("g-wire-lanemenu");
  const laneTab = tabs.querySelector(".g-wiretab-lane");
  tabs.addEventListener("click", (e) => {
    // A lane pick from the dropdown.
    const item = e.target.closest("#g-wire-lanemenu .tchip-menu-item");
    if (item) { e.preventDefault(); e.stopPropagation(); _setWireLane(item.dataset.lane); return; }
    const btn = e.target.closest(".g-wiretab");
    if (!btn) return;
    // The merged-wire tab: if it's already the active pane, a tap toggles the lane
    // dropdown; otherwise it switches to the wire pane (closing any open menu).
    if (btn === laneTab && btn.classList.contains("is-on") && laneMenu) {
      const open = laneMenu.hidden;
      laneMenu.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      // Anchor the dropdown directly under the lane tab (now the first chip). We set BOTH top and left
      // explicitly from measured rects (relative to the menu's real offset parent)
      // rather than leaning on the CSS `top:100%` — on iOS Safari the sticky tab
      // bar resolves that percentage against the wrong containing block, dropping
      // the menu ~200px into the feed. Measured coords are correct on every engine.
      if (open) {
        const op = laneMenu.offsetParent || tabs;
        const mw = laneMenu.offsetWidth || 150;
        const t = laneTab.getBoundingClientRect(), o = op.getBoundingClientRect();
        laneMenu.style.top = Math.round(t.bottom - o.top) + "px";
        laneMenu.style.left = Math.round(Math.max(0, Math.min(t.left - o.left, op.clientWidth - mw))) + "px";
      }
      return;
    }
    _closeLaneMenu();
    setWire(btn.dataset.wire);
    _saveHomePref({ wire: btn.dataset.wire });
  });
  // A tap outside the tab bar dismisses the lane dropdown.
  document.addEventListener("click", (e) => { if (laneMenu && !laneMenu.hidden && !e.target.closest(".g-wiretabs")) _closeLaneMenu(); });
}

// ---- Home briefing (the market brief, at the head of the News wire) ----------
// The grounded market brief, surfaced atop the News pane so it reads as the day's
// read over the feed it summarises — desk sections only (no Overview lede). Only the
// LATEST available version is shown (no slot selector). Data: BRIEFINGS (tokenless /
// no-cache — regenerated on each of the ~5 daily refresh runs, so a new brief appears
// with no code push). Colour marking is the shared per-desk kicker. The card is
// collapsible per viewer, with an unread dot (localStorage m_brief_read) shown only
// when a new brief has landed and the card is collapsed. Kept to one screen
// (HB_MAX_BULLETS).
const _BRIEF_READ_KEY = "m_brief_read";
const HB_MAX_BULLETS = 4;
function _briefStamp(k) {
  const s = ((BRIEFINGS || {}).slots || {})[k]; if (!s) return "";
  const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/);
  return `${s.date || ""} ${t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"}`;
}
function _briefOrder() { const B = BRIEFINGS || {}; const slots = B.slots || {}; return (B.order || ["morning", "afternoon", "evening"]).filter((k) => slots[k]); }
// The freshest brief by (date·time) stamp — the only version surfaced.
function _briefLatest() { const o = _briefOrder(); return o.length ? o.reduce((best, k) => (_briefStamp(k) > _briefStamp(best) ? k : best), o[0]) : ""; }
// The latest (date time) stamp across ANY BRIEFINGS object — used to tell whether a
// freshly-fetched briefing module is newer than the one this page loaded (the
// reopen-freshness check below). Mirrors _briefStamp's normalisation, but pure so it
// can run against a re-imported module's exports, not just the loaded global.
function _latestStampOf(B) {
  const slots = (B && B.slots) || {};
  const order = ((B && B.order) || ["morning", "afternoon", "evening"]).filter((k) => slots[k]);
  const stampOf = (k) => {
    const s = slots[k]; if (!s) return "";
    const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/);
    return `${s.date || ""} ${t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"}`;
  };
  return order.reduce((best, k) => { const v = stampOf(k); return v > best ? v : best; }, "");
}
function _briefIdentity(k) { const s = ((BRIEFINGS || {}).slots || {})[k]; return s ? `${s.date || ""}|${s.time || ""}` : ""; }
function _briefReadMap() { try { return JSON.parse(localStorage.getItem(_BRIEF_READ_KEY) || "{}") || {}; } catch { return {}; } }
function _markBriefRead(k) { const id = _briefIdentity(k); if (!id) return; const m = _briefReadMap(); if (m[k] === id) return; m[k] = id; try { localStorage.setItem(_BRIEF_READ_KEY, JSON.stringify(m)); } catch { /* private mode */ } }
// A brief is UNREAD when the latest slot's identity (date|time) differs from the one
// this viewer last opened. Drives the Briefing tab's notification dot on phones.
function _briefUnread() { const k = _briefLatest(); if (!k) return false; const id = _briefIdentity(k); return !!id && _briefReadMap()[k] !== id; }
// Show/hide the orange dot on the phone Briefing chip to match the unread state.
function _updateBriefDot() { const dot = document.querySelector('.g-wiretab[data-wire="brief"] .g-wiretab-dot'); if (dot) dot.hidden = !_briefUnread(); }
// Desktop (≥1201px) shows the briefing as a permanent, always-visible quadrant;
// phones tuck it behind the Briefing tab. Used to decide when "rendered" == "read".
function _isPhoneLayout() { try { return !window.matchMedia("(min-width:1201px)").matches; } catch { return true; } }
// Compact freshness date: "18 Sep".
function _briefDate(d) { const t = Date.parse((d || "") + "T00:00:00"); if (!t) return d || ""; const dt = new Date(t); return `${dt.getDate()} ${MONTHS[dt.getMonth()] || ""}`; }
// A bullet's desk = the "<strong>Macro &mdash; …</strong>" lead word(s), lower-cased,
// used only to group same-desk bullets into one section. No kicker → its own group.
// Decode the HTML entities authored in a desk kicker ("M&amp;A" → "M&A", "&pound;" → "£") so
// the name can be re-escaped once for display — otherwise esc() double-encodes it and the
// literal "M&amp;A" leaks to the screen.
function _deEnt(s) {
  return String(s || "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0*39;|&apos;/g, "'")
    .replace(/&rsquo;/g, "’").replace(/&lsquo;/g, "‘")
    .replace(/&pound;/g, "£").replace(/&euro;/g, "€").replace(/&nbsp;/g, " ");
}
function _briefDesk(html) { const m = String(html || "").match(/^\s*<strong>\s*([^<]*?)\s*(?:&mdash;|—)/); return m ? _deEnt(m[1].trim()).toLowerCase() : "\0" + String(html || "").slice(0, 40); }
// Drop the leading "Desk &mdash; " label from a same-desk follow-on item, keeping the
// rest of its bold headline — so the kicker isn't repeated within a grouped section.
function _stripDesk(html) { return String(html || "").replace(/^(\s*<strong>)\s*[^<]*?\s*(?:&mdash;|—)\s*/, "$1"); }
// Re-capitalise the first letter of a de-kickered follow-on so it reads as a clean
// continuous sentence once folded onto the item before it ("…target. The ONS…").
function _capFold(html) { return String(html || "").replace(/^(\s*(?:<strong>\s*)?)([a-z])/, (m, p, c) => p + c.toUpperCase()); }
// Does this authored HTML carry any visible text once tags, entities and whitespace
// are stripped? Used to drop an empty-body desk group (a bare kicker) from the brief.
function _hasText(html) { return String(html || "").replace(/<[^>]*>/g, "").replace(/&(?:[a-z]+|#\d+);/gi, " ").replace(/\s+/g, "").length > 0; }
// Drop an inline "who reported it" attribution from a briefing body — "…, the FT reports",
// "…, Bloomberg reports", "…, according to the Wall Street Journal" — because the summary
// now carries the source as a LINK (reintroduced below), so the prose shouldn't also name
// the outlet. Anchored to a leading comma + a trailing boundary (punctuation / end), so a
// real "<Company> reports earnings" verb mid-sentence is never stripped.
function _stripReported(html) {
  // A "word" char is a normal char OR a whole HTML entity, so an entity-encoded apostrophe
  // in an outlet name ("Reuters&rsquo;", "Barron&rsquo;s") or "&amp;" doesn't break the
  // match — the body is matched before entities are decoded. Boundary allows , . ; : ) ] or
  // end, so "…reports;" and "…reports:" are caught too.
  const W = "(?:&[a-z]+;|&#\\d+;|[\\w.'’])";
  // A TRAILING "who said it" clause: ", the FT reports/notes/writes/says" (or a named
  // byline, "…, Bloomberg's John Authers notes"). The prose should state the news; the
  // source is the trailing srcName link. This is only a backstop — woven-in forms ("the FT
  // explains why …", "Bloomberg's Markets Daily notes <fact>") are the author's job to
  // avoid (see briefings.js header + HOUSE_STYLE R28); the strip stays trailing-only so it
  // can never cut real facts mid-sentence.
  const rep = new RegExp(",\\s*(?:the\\s+)?[A-Z]" + W + "*(?:\\s+[A-Z]" + W + "*){0,3}\\s+(?:reports?|notes?|writes?|says?)(?=[,.);:\\]]|\\s*$)", "g");
  const acc = new RegExp(",\\s*according to\\s+(?:the\\s+)?[A-Z]" + W + "*(?:\\s+[A-Z]" + W + "*){0,3}(?=[,.);:\\]]|\\s*$)", "gi");
  return String(html || "").replace(rep, "").replace(acc, "").replace(/\s+([,.;:])/g, "$1").replace(/\s{2,}/g, " ");
}
function renderHomeBriefing() {
  const host = document.getElementById("g-hbrief");
  if (!host) return;
  const slots = (BRIEFINGS || {}).slots || {};
  const key = _briefLatest();
  const s = slots[key];
  if (!s) { host.hidden = true; return; }
  // The briefing is ALWAYS expanded now — a permanent 2×2 quadrant on desktop, and
  // its own always-open pane (the Market Briefing tab) on phones. On desktop it is
  // always on screen, so rendering counts as read; on phones it sits behind the
  // Briefing tab, so leave it unread until that tab is opened (setWire marks it) and
  // let the tab carry a notification dot for a brief the viewer hasn't seen.
  const open = true;
  if (!_isPhoneLayout()) _markBriefRead(key);
  _updateBriefDot();
  const when = `${s.time ? esc(s.time) : ""}${s.date ? (s.time ? " · " : "") + esc(_briefDate(s.date)) : ""}`;
  // Group the rendered bullets by desk so each desk is ONE section (Macro,
  // Equities, Bonds) even when a desk carries more than one story: the
  // orange kicker shows once, and every item keeps its own sourced line so
  // grounding (R7) is never lost. Desk order follows first appearance.
  // Group ALL bullets by desk (first-appearance order within each desk), then re-order
  // the desk SECTIONS into the canonical house order — Macro, Bonds, Equities, Credit
  // (private equity / private credit fund news) — see HOUSE_STYLE R28; any other
  // (owner-requested) desk follows in first-appearance order.
  const byDesk = new Map();
  const appear = [];
  for (const b of (s.bullets || [])) {
    const desk = _briefDesk(b.html);
    let g = byDesk.get(desk);
    if (!g) { g = { desk, items: [], _i: appear.length }; byDesk.set(desk, g); appear.push(g); }
    g.items.push(b);
  }
  const DESK_RANK = { "macro": 0, "bonds": 1, "equities": 2, "credit": 3 };
  const ordered = appear.slice().sort((a, b) =>
    ((DESK_RANK[a.desk] ?? 50) - (DESK_RANK[b.desk] ?? 50)) || (a._i - b._i));
  // Budget the bullets to one screen (HB_MAX_BULLETS) WITHOUT dropping a whole desk:
  // round-robin across the desks in canonical order so every present desk keeps its
  // lead bullet before any desk takes a second. This is what guarantees the Equities
  // section (and its data badge) never vanishes under the cap when the slot is heavy on
  // Macro/Bonds — the gap a reader photographed.
  const budget = Math.max(HB_MAX_BULLETS, ordered.length);
  const groups = ordered.map(() => ({ items: [] }));
  for (let round = 0, taken = 0, progressed = true; taken < budget && progressed; round++) {
    progressed = false;
    for (let gi = 0; gi < ordered.length && taken < budget; gi++) {
      const src = ordered[gi].items;
      if (round < src.length) { groups[gi].items.push(src[round]); taken++; progressed = true; }
    }
  }
  // ALWAYS combine every same-desk item into ONE continuous item. The desk name is
  // lifted out of the first item and rendered as a RUN-IN heading — an inline accent
  // title on the SAME line as the body, to save vertical space. Every item (including
  // the first) is stripped of its kicker, its lead letter re-capitalised and folded into
  // one flowing body — never stacked as a separate sub-bullet. The prose's inline "who
  // reported it" attribution ("…, the FT reports") is stripped (_stripReported); instead
  // each desk carries a trailing LINK to every source it compresses (`.g-hbrief-srcs`,
  // middot-joined) — the clickable source, not a textual mention (R7 grounding kept).
  const secSeen = new Set();   // pill each recognised security ONCE across the whole brief
  const bullets = groups.map((g) => {
    const m = String(g.items[0].html || "").match(/^\s*<strong>\s*([^<]*?)\s*(?:&mdash;|—)/);
    const desk = m ? _deEnt(m[1].trim()) : "";   // decode entities (M&amp;A → M&A) so esc() doesn't double-encode
    // Inject an inline ticker/benchmark pill after a recognised security's first mention
    // (filled live by renderBriefTickers) — BEFORE nbNums so the pill's own markup is left
    // alone and a number isn't split out of a name we match.
    const text = g.items.map((b) => nbNums(_capFold(_injectSecPills(_stripReported(_stripDesk(b.html)), secSeen)))).join(" ");
    // A desk item with a kicker but NO body (e.g. a half-generated refresh draft where
    // the headline shipped before its sentence did) would otherwise paint as a bare
    // heading above an empty void — the exact ghost section a reader once photographed.
    // Drop any group whose combined body has no visible text so the briefing never
    // shows a textless desk.
    if (!_hasText(text)) return "";
    // Trailing source line: one clickable link per story this desk compresses (middot-
    // joined), labelled by outlet — the source as a LINK, replacing the old inline "…X
    // reports" mention. Opens the publisher in a new tab. (The old per-desk data badge was
    // retired — the inline pills + top strip now carry the live prices/levels.)
    const _srcLink = (b) => b.src ? `<a class="g-hbrief-src" href="${esc(b.src)}" target="_blank" rel="noopener noreferrer">${esc(b.srcName || "source")}</a>` : "";
    const srcs = g.items.map(_srcLink).filter(Boolean).join('<span class="g-hbrief-srcsep" aria-hidden="true"> · </span>');
    return `<li class="g-hbrief-b">${desk ? `<span class="g-hbrief-bk">${esc(desk)}</span> ` : ""}<span class="g-hbrief-bt">${text}</span>${srcs ? `<span class="g-hbrief-srcs">${srcs}</span>` : ""}</li>`;
  }).filter(Boolean).join("");
  host.hidden = false;
  host.dataset.open = "true";
  // Structure: the DESKTOP quadrant keeps a stuck header (matching the other quadrants);
  // on the iPhone the briefing is its own labelled tab, so the header is hidden there and
  // the freshness stamp moves to a footer at the bottom of the body (CSS-gated).
  host.innerHTML =
    `<div class="g-hbrief-head">`
    + `<span class="g-hbrief-ttl">Market briefing</span>`
    + `<span class="g-hbrief-when">${when}</span></div>`
    + `<div class="g-hbrief-body">`
    + `<div class="g-hbrief-strip" id="g-hbrief-strip" role="list" aria-label="Markets snapshot"></div>`   // iPhone-only top strip (CSS-gated); filled by renderBriefStrip()
    + `<ul class="g-hbrief-list">${bullets}</ul>`
    + `</div>`
    // Freshness stamp — a SIBLING of the scrolling body (not inside it), so on the phone it
    // pins to the bottom of the fixed pane (glued above the bottom nav) instead of scrolling
    // with the brief. CSS-gated: hidden on the desktop quadrant (the header carries the stamp).
    + (when ? `<div class="g-hbrief-stamp">Updated ${when}</div>` : "");
  renderBriefStrip();
  renderBriefTickers();
  _resolveBriefSecurities(_briefSecNames(groups));   // detect prose securities → resolve live → repaint once
}
// Inline security pills (snip-3 style) in the briefing prose. EQUITIES/INDICES are DETECTED
// in the prose and resolved LIVE via /api/secq (Yahoo search + a market-cap tiebreaker, so
// "Honeywell" → HON not HONA); US Treasury BENCHMARK yields come from the rates cache. A
// pill shows only for a confident resolution with a live quote — an unmapped/ambiguous name
// or a missing quote yields NO pill (never a guessed value, R7).
// Treasury-yield pills — filled live from the rates cache (renderBriefTickers matches
// `ykey` to a /api/rates label; the feed carries US 10Y, US 2Y and US 30Y, so all three
// fill with their bp move). Each regex matches "US <n>-year", "<n>-year Treasury", OR a
// bare "<n>-year" (the way a Bonds bullet usually names it, e.g. "the 10-year near 5.27%")
// — but NOT "<n>-year high/low". 30Y is listed first so a bullet that leads with the long
// bond pills the 30-year; a bullet naming both still pills each once.
const BRIEF_YIELDS = [
  { re: /\b(?:US\s+)?(?:30|thirty)[\s-]?year(?:\s+Treasury(?:\s+yield)?)?\b(?!\s+(?:high|low|peak|anniversary|period|plan|highs|lows))/i, ykey: "US 30Y", label: "US 30Y" },
  { re: /\b(?:US\s+)?(?:10|ten)[\s-]?year(?:\s+Treasury(?:\s+yield)?)?\b(?!\s+(?:high|low|peak|anniversary|period|plan|highs|lows))/i, ykey: "US 10Y", label: "US 10Y" },
  { re: /\b(?:US\s+)?(?:2|two)[\s-]?year(?:\s+Treasury(?:\s+yield)?)?\b(?!\s+(?:high|low|peak|anniversary|period|plan|highs|lows))/i, ykey: "US 2Y", label: "US 2Y" },
];
// Major INDICES — a curated name→symbol map (indices are a small, stable set, so a curated
// map is accurate where fuzzy name-resolution isn't). Live % via /api/quotes. MOST SPECIFIC
// first (Nasdaq 100 before Nasdaq Composite). `^`-symbols are allowed by /api/quotes.
const BRIEF_INDEX = [
  { re: /\bS&amp;P\s*500\b|\bS&P\s*500\b/i, sym: "^GSPC", label: "S&P 500" },
  { re: /\bNasdaq[\s-]?100\b/i,             sym: "^NDX",  label: "NASDAQ 100" },
  { re: /\bNasdaq(?:\s+Composite)?\b/i,     sym: "^IXIC", label: "NASDAQ" },
  { re: /\bRussell\s*2000\b/i,              sym: "^RUT",  label: "RUSSELL 2000" },
  { re: /\b(?:Dow Jones|the Dow)\b/i,       sym: "^DJI",  label: "DOW" },
  { re: /\bFTSE(?:\s*100)?\b/i,             sym: "^FTSE", label: "FTSE 100" },
  { re: /\bDAX\b/i,                         sym: "^GDAXI", label: "DAX" },
  { re: /\bCAC(?:\s*40)?\b/i,               sym: "^FCHI", label: "CAC 40" },
  { re: /\b(?:Euro\s?Stoxx|Stoxx)\s*50\b/i, sym: "^STOXX50E", label: "STOXX 50" },
  { re: /\bFTSE\s*MIB\b/i,                  sym: "FTSEMIB.MI", label: "FTSE MIB" },
  { re: /\bIBEX(?:\s*35)?\b/i,              sym: "^IBEX", label: "IBEX 35" },
  { re: /\bNikkei(?:\s*225)?\b/i,           sym: "^N225", label: "NIKKEI" },
  { re: /\bHang Seng\b/i,                   sym: "^HSI",  label: "HANG SENG" },
  { re: /\bShanghai Composite\b/i,          sym: "000001.SS", label: "SHANGHAI" },
  { re: /\bKospi\b/i,                       sym: "^KS11", label: "KOSPI" },
  { re: /\bSensex\b/i,                      sym: "^BSESN", label: "SENSEX" },
  { re: /\bNifty(?:\s*50)?\b/i,             sym: "^NSEI", label: "NIFTY 50" },
  { re: /\bBovespa\b/i,                     sym: "^BVSP", label: "BOVESPA" },
  { re: /\bVIX\b/i,                         sym: "^VIX",  label: "VIX" },
];
// Commodity benchmarks — a curated name→markets-feed-label map, filled from the markets
// cache (the SAME source the snapshot strip uses) rather than /api/quotes, which rejects the
// "=F" futures symbols (BZ=F/CL=F/GC=F). Matched by the markets-feed label; live % move.
const BRIEF_COMMODITY = [
  { re: /\bBrent(?:\s+crude)?\b/i, mkt: "Brent", label: "BRENT" },
  { re: /\bWTI(?:\s+crude)?\b/i,   mkt: "WTI",   label: "WTI" },
  { re: /\bgold\b/i,               mkt: "Gold",  label: "GOLD" },
];
// Proper-noun phrases that are NEVER a tradeable security — countries/demonyms, currencies,
// central banks / institutions, markets-not-tickers, calendar + common words — pre-filtered
// so they're not even queried (the server also negative-caches). The server's name-match +
// market-cap gate catches the rest; the tradeoff for broad coverage is a rare wrong pill.
const SEC_STOP = new Set(("the a an and or but of in on at to for with as after before while "
  + "us usa america american united states uk britain british england english europe european eurozone euro-area "
  + "france french spain spanish germany german italy italian japan japanese china chinese brazil brazilian india indian "
  + "russia russian ukraine canada canadian mexico asia asian africa middle east gulf nordic scandinavia latin "
  + "dollar euro sterling pound yen yuan renminbi franc peso real lira rupee bitcoin crypto "
  + "fed federal reserve ecb boe bank of england banque treasury imf oecd opec congress parliament senate budget "
  + "white house supreme court government ministry central bank mpc fomc "
  + "wall street main street city markets market stocks stock shares share bonds bond equities equity yields yield "
  + "oil crude brent gold silver copper gas energy commodities commodity "
  + "monday tuesday wednesday thursday friday saturday sunday "
  + "january february march april may june july august september october november december "
  + "q1 q2 q3 q4 gdp cpi ppi pmi ism "
  + "north south east west new this that these those it they we i he she his her their "
  + "monte dei paschi").split(/\s+/).filter(Boolean));
// Pull candidate company/index names out of the briefing prose (visible text only): runs of
// Capitalised tokens (allowing internal connectors de/dei/van/von/&/of/and), minus the
// stoplist. Multi-word phrases + single proper nouns (Nvidia, Honeywell) both qualify.
function _briefSecNames(groups) {
  const text = (groups || []).map((g) => (g.items || []).map((b) => _stripReported(_stripDesk(b.html))).join(" ")).join(" ")
    .replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/&#\d+;/g, " ");
  const re = /\b[A-Z][A-Za-z.&'’-]+(?:\s+(?:[A-Z][A-Za-z.&'’-]+|de|dei|del|du|van|von|der|of|and|&)){0,4}\b/g;
  const names = new Set(); let m;
  while ((m = re.exec(text)) && names.size < 24) {
    let p = m[0].replace(/\s+(?:of|and|de|the)$/i, "").replace(/[’'".,]+$/, "").trim();
    if (p.length < 3) continue;
    const low = p.toLowerCase();
    if (SEC_STOP.has(low)) continue;
    if (low.split(/\s+/).every((w) => SEC_STOP.has(w))) continue;   // e.g. "United States", "Bank of England"
    if (BRIEF_YIELDS.some((y) => y.re.test(p))) continue;           // handled as a yield
    if (BRIEF_INDEX.some((ix) => ix.re.test(p))) continue;          // handled as an index (curated)
    if (BRIEF_COMMODITY.some((c) => c.re.test(p))) continue;        // handled as a commodity (curated)
    names.add(p);
  }
  return [...names];
}
// Resolved equities for THIS page load: name -> { symbol, label, pct, dir } | null. In-memory
// only (re-fetched per load) so a quote is never stale across a deploy.
let _secResolved = {}, _secqFetching = false;
// Format a price/level for a pill: ≥1000 → thousands-separated whole number (7,771 · 4,129),
// otherwise two decimals (101.97 · 5.27). Empty string when there's no usable number.
function _fmtLevel(v) {
  if (v == null || !isFinite(+v)) return "";
  const n = +v;
  return Math.abs(n) >= 1000 ? Math.round(n).toLocaleString("en-US") : n.toFixed(2);
}
// A briefing ticker pill ALWAYS shows the LEVEL (price/value/points) AND the change
// (%/bp) + a direction arrow (HOUSE_STYLE R28). `levelStr` is pre-formatted (may carry a
// unit like "%"); `changeStr` is the move (e.g. "4bp", "0.62%").
function _hbtArrow(dir) { return dir === "up" ? "↑" : dir === "down" ? "↓" : "·"; }
function _hbtPill(n, label, levelStr, changeStr, dir) {
  n.className = "g-hbt-tk " + dir;
  n.innerHTML = `<span class="g-hbt-s">${esc(label)}</span>`
    + (levelStr ? `<span class="g-hbt-v">${esc(levelStr)}</span>` : "")
    + `<span class="g-hbt-c">${esc(changeStr)} ${_hbtArrow(dir)}</span>`;
}
function _secPill(sym, label, levelStr, changeStr, dir) {
  return `<span class="g-hbt-tk ${dir}" data-sym="${esc(sym)}"><span class="g-hbt-s">${esc(label)}</span>`
    + (levelStr ? `<span class="g-hbt-v">${esc(levelStr)}</span>` : "")
    + `<span class="g-hbt-c">${esc(changeStr)} ${_hbtArrow(dir)}</span></span>`;
}
// Inject a pill after the FIRST mention of a recognised security (yields via data-ykey, filled
// by renderBriefTickers from the rates cache; equities FILLED inline from _secResolved).
function _injectSecPills(html, seen) {
  let out = String(html || "");
  // REPLACE the recognised name with its pill (don't keep the name AND the label) — the pill's
  // label stands in for the name. Yield/index pills carry their label text up front so they read
  // even before (or without) the live value filling in (renderBriefTickers overwrites on fill).
  // Each injected pill is parked as a letter-free PLACEHOLDER token and only expanded back to
  // HTML at the very end — so a later regex can never match a label INSIDE an already-injected
  // pill (e.g. "Nasdaq-100" → NASDAQ 100, then the plain "Nasdaq" rule matching its own label).
  const pills = [];
  const tok = (h) => `\u0000P${pills.push(h) - 1}\u0000`;
  const once = (re, make) => { let done = false; out = out.replace(re, (mm) => { if (done) return mm; done = true; return tok(make(mm)); }); };
  for (const y of BRIEF_YIELDS) {
    if (seen.has("y:" + y.ykey)) continue;
    once(y.re, () => { seen.add("y:" + y.ykey); return `<span class="g-hbt-tk" data-ykey="${esc(y.ykey)}" data-label="${esc(y.label)}"><span class="g-hbt-s">${esc(y.label)}</span></span>`; });
  }
  for (const ix of BRIEF_INDEX) {
    if (seen.has("i:" + ix.sym)) continue;
    once(ix.re, () => { seen.add("i:" + ix.sym); return `<span class="g-hbt-tk" data-idx="${esc(ix.sym)}" data-label="${esc(ix.label)}"><span class="g-hbt-s">${esc(ix.label)}</span></span>`; });
  }
  for (const c of BRIEF_COMMODITY) {
    if (seen.has("c:" + c.mkt)) continue;
    once(c.re, () => { seen.add("c:" + c.mkt); return `<span class="g-hbt-tk" data-mkt="${esc(c.mkt)}" data-label="${esc(c.label)}"><span class="g-hbt-s">${esc(c.label)}</span></span>`; });
  }
  for (const name of Object.keys(_secResolved)) {
    const d = _secResolved[name];
    if (!d || seen.has("e:" + d.symbol)) continue;
    const re = new RegExp("\\b" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b");
    once(re, () => { seen.add("e:" + d.symbol); return _secPill(d.symbol, d.label, _fmtLevel(d.price), `${Math.abs(d.pct).toFixed(2)}%`, d.dir); });
  }
  return out.replace(/\u0000P(\d+)\u0000/g, (m, i) => pills[+i] || "");
}
let _idxQuotes = {}, _idxFetching = false;
function renderBriefTickers() {
  const host = document.getElementById("g-hbrief");
  if (!host) return;
  // Yields — straight from the rates cache: LEVEL (the yield, e.g. 5.27%) + the bp move.
  const rates = (_rateRows && _rateRows.length) ? _rateRows : (((readCache("rates") || {}).rates) || []);
  host.querySelectorAll(".g-hbt-tk[data-ykey]").forEach((n) => {
    const r = (rates || []).find((x) => x && x.label === n.getAttribute("data-ykey"));
    if (!r || typeof r.change !== "number" || !isFinite(r.change)) return;
    const bp = Math.round(r.change * 100), dir = glSign(bp);
    const lvl = (typeof r.value === "number" && isFinite(r.value)) ? r.value.toFixed(2) + "%" : "";
    _hbtPill(n, n.getAttribute("data-label"), lvl, `${Math.abs(bp)}bp`, dir);
  });
  // Commodities — from the markets cache (the SAME source the snapshot strip uses): the price
  // LEVEL + the % move. /api/quotes can't take the "=F" futures symbols, so these fill here.
  const mkts = (_mktRows && _mktRows.length) ? _mktRows : (((readCache("markets") || {}).markets) || []);
  host.querySelectorAll(".g-hbt-tk[data-mkt]").forEach((n) => {
    const row = (mkts || []).find((x) => x && x.label === n.getAttribute("data-mkt"));
    if (!row || typeof row.changePct !== "number" || !isFinite(row.changePct)) return;
    _hbtPill(n, n.getAttribute("data-label"), _fmtLevel(row.value), `${Math.abs(row.changePct).toFixed(2)}%`, glSign(row.changePct));
  });
  // Indices — curated symbols, live price + % via /api/quotes (cached per load in _idxQuotes
  // as { pct, price }).
  const fillIdx = () => host.querySelectorAll(".g-hbt-tk[data-idx]").forEach((n) => {
    const q = _idxQuotes[n.getAttribute("data-idx")];
    if (q && typeof q.pct === "number" && isFinite(q.pct)) _hbtPill(n, n.getAttribute("data-label"), _fmtLevel(q.price), `${Math.abs(q.pct).toFixed(2)}%`, glSign(q.pct));
  });
  const idxSyms = [...new Set([...host.querySelectorAll(".g-hbt-tk[data-idx]")].map((n) => n.getAttribute("data-idx")))].filter((s) => !(s in _idxQuotes));
  if (!idxSyms.length || _idxFetching) { fillIdx(); return; }
  _idxFetching = true;
  fetch(`/api/quotes?symbols=${encodeURIComponent(idxSyms.join(","))}`, { headers: { accept: "application/json" } })
    .then((r) => (r && r.ok) ? r.json() : null).catch(() => null)
    .then((d) => { _idxFetching = false; const q = (d && d.quotes) || {}; for (const s of idxSyms) _idxQuotes[s] = (q[s] && typeof q[s].changePct === "number") ? { pct: q[s].changePct, price: (typeof q[s].price === "number" ? q[s].price : null) } : null; fillIdx(); });
}
// Detect the prose's securities and resolve them live; when new ones resolve, repaint once so
// their pills inject. Equities carry their quote in _secResolved, so no second fill is needed.
function _resolveBriefSecurities(names) {
  const pending = (names || []).filter((n) => !(n in _secResolved));
  if (!pending.length || _secqFetching) return;
  _secqFetching = true;
  fetch(`/api/secq?names=${encodeURIComponent(pending.join("|"))}`, { headers: { accept: "application/json" } })
    .then((r) => (r && r.ok) ? r.json() : null).catch(() => null)
    .then((d) => {
      _secqFetching = false;
      const sec = (d && d.securities) || {};
      let gained = false;
      for (const n of pending) { _secResolved[n] = sec[n] || null; if (sec[n]) gained = true; }
      if (gained) renderHomeBriefing();   // repaint once so the resolved pills inject
    });
}
// The iPhone-only markets snapshot strip at the top of the briefing: square cards for
// S&P 500 · VIX · Oil · Gold · US 10Y (snip-2 format — label+value on top, a direction-
// coloured block with the day's change below). Every card shows the LAST CLOSE and its day
// change — no overnight-futures overlay. A "*" on the value flags that the market is CLOSED
// (so the figure is the last close, not live) — its only meaning. Reads the SAME last-good
// markets/rates cache the rail uses — no extra fetch — and stays empty when not cached.
const _HBS = [
  { key: "S&P 500", src: "mkt",   label: "S&P 500", kind: "price" },
  { key: "VIX",     src: "extra", label: "VIX",     kind: "level" },
  { key: "Brent",   src: "mkt",   label: "OIL",     kind: "price" },   // Brent front-month — the house oil benchmark (the markets feed labels crude "Brent"/"WTI", not "Oil")
  { key: "Gold",    src: "mkt",   label: "GOLD",    kind: "price" },
  { key: "US 10Y",  src: "rate",  label: "US 10Y",  kind: "yield" },
];
function renderBriefStrip() {
  const el = document.getElementById("g-hbrief-strip");
  if (!el) return;
  const mcache = readCache("markets") || {};
  const mkts  = (_mktRows  && _mktRows.length)  ? _mktRows  : (mcache.markets || []);
  const rates = (_rateRows && _rateRows.length) ? _rateRows : (((readCache("rates") || {}).rates) || []);
  const extra = (_mktExtra && _mktExtra.length) ? _mktExtra : (mcache.moversExtra || []);
  const find = (arr, lbl) => (arr || []).find((x) => x && x.label === lbl);
  el.innerHTML = _HBS.map((d) => {
    const row = d.src === "rate" ? find(rates, d.key) : d.src === "extra" ? find(extra, d.key) : find(mkts, d.key);
    return _hbsCard(d.label, row, d.kind);
  }).filter(Boolean).join("");
}
function _hbsCard(label, row, kind) {
  if (!row || row.value == null) return "";
  let dir = "flat", valTxt = "", absTxt = "", pctTxt = "", star = false;
  if (kind === "yield") {
    valTxt = fmtRate(row.value, row.unit);
    const chg = (typeof row.change === "number" && isFinite(row.change)) ? row.change : null;
    dir = chg == null ? "flat" : glSign(chg);
    if (chg != null) {
      // Yield cards carry BOTH the basis-point move and the relative % change (two lines, so
      // they read the same as the price cards). `change` is in the value's own unit — bp for
      // an OAS series, percentage-points for a Treasury yield (×100 → bp).
      const bp = row.unit === "bp" ? Math.round(chg) : Math.round(chg * 100);
      absTxt = `${bp > 0 ? "+" : ""}${bp} bp`;
      const prev = row.value - chg;
      if (prev) { const rel = chg / prev * 100; if (isFinite(rel)) pctTxt = `${rel > 0 ? "+" : ""}${rel.toFixed(2)}%`; }
    }
  } else {
    // Always the LAST CLOSE (the instrument's own value) + its day change — never an overnight-
    // futures overlay. A "*" on the value flags that the market is currently CLOSED, so the
    // figure is the last close rather than a live price (its ONLY meaning now — no futures).
    const pct = (typeof row.changePct === "number" && isFinite(row.changePct)) ? row.changePct : null;
    const abs = (typeof row.change === "number" && isFinite(row.change)) ? row.change : (pct != null ? row.value * pct / 100 : null);
    dir = pct != null ? glSign(pct) : (abs != null ? glSign(abs) : "flat");
    valTxt = fmtPrice(row.value);
    star = !isMarketOpen(row);
    if (abs != null) absTxt = `${abs > 0 ? "+" : ""}${abs.toFixed(2)}`;
    if (pct != null) pctTxt = `${pct > 0 ? "+" : ""}${pct.toFixed(2)}%`;
  }
  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "·";
  const nums = [absTxt, pctTxt].filter(Boolean).map((t) => `<span class="g-hbs-n">${esc(t)}</span>`).join("") || `<span class="g-hbs-n">·</span>`;
  const tag = row.href ? "a" : "span";
  const attrs = row.href ? ` href="${esc(row.href)}" target="_blank" rel="noopener noreferrer"` : "";
  return `<${tag} class="g-hbs-card ${dir}" role="listitem"${attrs}>`
    + `<span class="g-hbs-top"><span class="g-hbs-lbl">${esc(label)}</span>`
    + `<span class="g-hbs-val">${esc(valTxt)}${star ? '<span class="g-hbs-star">*</span>' : ""}</span></span>`
    + `<span class="g-hbs-chg"><span class="g-hbs-arw">${arrow}</span><span class="g-hbs-nums">${nums}</span></span>`
    + `</${tag}>`;
}
function initHomeBriefing() {
  // The briefing is always expanded now (its own Market Briefing pane on phones,
  // a permanent quadrant on desktop) — no collapse toggle to wire, just render.
  const host = document.getElementById("g-hbrief");
  if (!host) return;
  renderHomeBriefing();
  // A minimal test seam: lets a spec mutate BRIEFINGS and repaint deterministically
  // (there is no user-facing re-render trigger for the brief). Prod code never calls it.
  try { window.__wireRenderBrief = renderHomeBriefing; } catch { /* noop */ }
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
  on(document, "click", (e) => {
    const inside = e.target.closest(".g-gl-block");
    glance.querySelectorAll(".g-gl-block.is-open").forEach((block) => {
      if (block !== inside) closeBlock(block);
    });
  });
  // Escape closes any open one-liner too.
  on(document, "keydown", (e) => {
    if (e.key !== "Escape") return;
    glance.querySelectorAll(".g-gl-block.is-open").forEach(closeBlock);
  });
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

// ---- X wire (server-rendered live feed) -------------------------------------
// A merged, newest-first, LIVE feed of the roster's PUBLIC accounts, fetched by
// the Worker from X's public syndication endpoint (/api/xfeed) and drawn as our
// OWN cards. This deliberately avoids X's client-side List/timeline widget, which
// X blanks for logged-out webviews (the iPhone PWA). Fetched lazily — only when
// the panel nears view — with a persistent "Open list on X" escape hatch, and a
// clear message if X's server-side read is unavailable.
let _xwireBooted = false, _xwireWatching = false;
function initXWire(eager) {
  const host = document.getElementById("g-xwire");
  if (!host) return;
  // Re-entry (the X chip tapped again): refresh in place. renderXWire keeps the
  // existing cards on screen while it re-fetches, so there is never a blank.
  if (_xwireBooted) { renderXWire(host); return; }
  const boot = () => { if (_xwireBooted) return; _xwireBooted = true; renderXWire(host); _xwireLast = Date.now(); startXWireAuto(); };
  // Eager preload (Home load): boot even while the X pane is hidden behind a mobile
  // chip, so the feed is already populated the instant the X chip is opened.
  if (eager) { boot(); return; }
  // Boot as soon as the panel is actually on screen — the always-visible desktop
  // rail, or the mobile X-wire rail the moment its chip reveals it. A hidden rail
  // (display:none) has no offsetParent, so it stays lazy until shown.
  if (host.offsetParent !== null && host.getBoundingClientRect().top < innerHeight + 800) { boot(); return; }
  if (_xwireWatching) return; _xwireWatching = true;
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((ents) => {
      if (ents.some((e) => e.isIntersecting)) { io.disconnect(); boot(); }
    }, { rootMargin: "600px 0px" });
    io.observe(host);
  } else { boot(); }
}
// Keep the feed live & PRELOADED, but frugally. The recurring refresh runs every 15
// minutes, and ONLY during UK waking hours — 06:00 to midnight (Europe/London) — so the
// wire never burns paid calls overnight. It also pauses while the app is backgrounded.
// (Opening the X pane still fetches once at any hour — that's a deliberate user action,
// handled by bootXWire, not this timer.) renderXWire keeps the existing cards on refresh.
let _xwireAuto = 0;
let _xwireLast = 0;
// True during UK 06:00–23:59 (Europe/London, so it tracks BST/GMT automatically). Some
// engines render midnight as "24", so fold it back to 0 → the window closes at midnight.
function _xwireInHours() {
  let h;
  try { h = +new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", hour12: false }).format(new Date()); }
  catch { h = new Date().getHours(); }
  h = h % 24;
  return h >= 6;
}
function startXWireAuto() {
  if (_xwireAuto) return;
  const refresh = () => {
    const h = document.getElementById("g-xwire");   // resolve live, so a re-mounted Home is followed
    if (!h || !h.isConnected) return;               // X wire not in the DOM
    if (document.hidden) return;                     // app backgrounded — pause
    if (!_xwireInHours()) return;                    // outside UK 06:00–midnight — pause
    _xwireLast = Date.now();
    renderXWire(h);
  };
  _xwireAuto = setInterval(refresh, 15 * 60 * 1000);
  // On resume, if the feed has aged past ~5 min while hidden (and we're in hours),
  // refresh at once; the 15-min cadence carries on. Not gated on Home being active.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && _xwireInHours() && Date.now() - _xwireLast > 5 * 60 * 1000) refresh();
  });
}
// Relative "29m / 3h / 2d", falling back to a short date.
function fmtXWhen(s) {
  const t = Date.parse(s || ""); if (!t) return "";
  const d = Math.max(0, Date.now() - t), m = Math.floor(d / 60000);
  if (m < 1) return "now";
  if (m < 60) return m + "m";
  const h = Math.floor(m / 60); if (h < 24) return h + "h";
  const days = Math.floor(h / 24); if (days < 7) return days + "d";
  const dt = new Date(t); return `${dt.getDate()} ${MONTHS[dt.getMonth()] || ""}`;
}
// Escape, then linkify URLs · @handles · #hashtags (opened on X, new tab).
function xLinkify(text) {
  let s = esc(String(text || ""));
  s = s.replace(/https?:\/\/[^\s<]+/g, (u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${u.replace(/^https?:\/\//, "")}</a>`);
  s = s.replace(/(^|[^\w@\/])@([A-Za-z0-9_]{1,15})/g, (_m, p, h) => `${p}<a href="https://x.com/${h}" target="_blank" rel="noopener noreferrer">@${h}</a>`);
  s = s.replace(/(^|\s)#(\w{1,60})/g, (_m, p, h) => `${p}<a href="https://x.com/hashtag/${h}" target="_blank" rel="noopener noreferrer">#${h}</a>`);
  return s.replace(/\n/g, "<br>");
}
// X feed — a Preact + Signals island. One `_xView` signal holds the pane's state
// ({status:"loading"} | {status:"empty",msg,link} | {status:"posts",tweets}); the
// <XWire> component repaints on any change, so the lifecycle (lazy boot + the frugal
// auto-refresh timer, below) just sets the signal instead of touching the DOM. The
// post text/quote body are pre-built HTML (xLinkify escapes then linkifies), rendered
// via dangerouslySetInnerHTML; everything else is Preact nodes (auto-escaped).
const _xView = signal({ status: "loading" });
function XQuote(q) {
  if (!q || (!q.text && !(q.media && q.media[0]) && !q.handle)) return null;
  const qn = q.name || (q.handle ? "@" + q.handle : "");
  const href = q.url || (q.handle ? `https://x.com/${q.handle}` : "#");
  return h("a", { class: "g-x-quote", href, target: "_blank", rel: "noopener noreferrer" },
    (qn || q.handle) ? h("div", { class: "g-x-qhead" }, h("span", { class: "g-x-qwho" }, qn), q.handle ? h("span", { class: "g-x-qh" }, "@" + q.handle) : null) : null,
    q.text ? h("div", { class: "g-x-qtxt", dangerouslySetInnerHTML: { __html: esc(q.text).replace(/\n/g, "<br>") } }) : null,
    (q.media && q.media[0]) ? h("span", { class: "g-x-qmedia" }, h("img", { loading: "lazy", src: q.media[0], alt: "", referrerpolicy: "no-referrer" })) : null);
}
// Long posts are collapsed to a few lines until the reader taps "Show more". Expanded
// ids live in a signal (keyed by tweet id) so the toggle re-renders the island; XCard
// reads it during render, so flipping it repaints just the affected card's state.
const _xExpanded = signal(new Set());
function xToggleExpand(id) {
  const s = new Set(_xExpanded.value);
  if (s.has(id)) s.delete(id); else s.add(id);
  _xExpanded.value = s;
}
// A post counts as "long" (worth clamping) when its text runs past ~a few lines —
// judged by character length or several hard line breaks. Short posts show in full with
// no toggle.
function xIsLong(text) {
  const s = String(text || "");
  return s.length > 220 || (s.match(/\n/g) || []).length >= 4;
}
function XCard(t) {
  const hh = t.handle || "", name = t.name || ("@" + (t.handle || ""));
  const perma = t.url || (t.handle ? `https://x.com/${t.handle}/status/${t.id}` : "#");
  const long = xIsLong(t.text);
  const expanded = _xExpanded.value.has(t.id);
  return h("article", { class: "g-x-card" },
    t.repostedBy ? h("div", { class: "g-x-rt" }, "↻ " + t.repostedBy + " reposted") : null,
    h("div", { class: "g-x-meta" },
      t.avatar ? h("img", { class: "g-x-av", loading: "lazy", src: t.avatar, alt: "", referrerpolicy: "no-referrer" }) : h("span", { class: "g-x-av g-x-av-ph" }),
      h("a", { class: "g-x-who", href: "https://x.com/" + hh, target: "_blank", rel: "noopener noreferrer" }, name),
      h("span", { class: "g-x-h" }, "@" + hh), h("span", { class: "g-x-d" }, fmtXWhen(t.date))),
    h("div", { class: "g-x-txt" + (long && !expanded ? " g-x-txt--clamp" : ""), dangerouslySetInnerHTML: { __html: xLinkify(t.text) } }),
    long ? h("button", { class: "g-x-more", type: "button",
      onClick: (e) => { e.preventDefault(); e.stopPropagation(); xToggleExpand(t.id); } },
      expanded ? "Show less" : "Show more") : null,
    XQuote(t.quoted),
    (t.media && t.media[0]) ? h("a", { class: "g-x-media", href: perma, target: "_blank", rel: "noopener noreferrer" }, h("img", { loading: "lazy", src: t.media[0], alt: "", referrerpolicy: "no-referrer" })) : null,
    h("a", { class: "g-x-permalink", href: perma, target: "_blank", rel: "noopener noreferrer" }, "View on X"));
}
function XWire() {
  const v = _xView.value;
  let inner;
  if (v.status === "posts") inner = v.tweets.map(XCard);
  else if (v.status === "empty") {
    const list = X_LIST || {}, url = v.link ? (list.url || (list.id ? `https://x.com/i/lists/${list.id}` : "")) : "";
    inner = h("div", { class: "g-x-empty" }, v.msg + " ", url ? h("a", { class: "g-x-fallback", href: url, target: "_blank", rel: "noopener noreferrer" }, "Open list on X") : null);
  } else inner = h("div", { class: "g-loading" }, "Loading X…");
  return h("div", { class: "g-x-list" }, h("div", { id: "g-x-feed", class: "g-x-feed" }, inner));
}
// Persist the last feed (per viewer) so a fresh load / full reload paints the
// last-known posts INSTANTLY instead of a blank "Loading" state, then refreshes.
const _XFEED_KEY = "wire.xfeed.v1";
function xReadCache() { try { const d = JSON.parse(localStorage.getItem(_XFEED_KEY) || "null"); return d && Array.isArray(d.tweets) ? d.tweets : null; } catch { return null; } }
function xWriteCache(tweets) { try { localStorage.setItem(_XFEED_KEY, JSON.stringify({ tweets: tweets.slice(0, 40), at: Date.now() })); } catch { /* private mode / quota */ } }
function renderXWire(host) {
  // Mount the island once; seed from the persisted cache so a fresh load paints the
  // last-known posts INSTANTLY instead of "Loading". Thereafter the signal governs.
  if (!host.dataset.xMounted) {
    const cached = xReadCache();
    if (cached && cached.length) _xView.value = { status: "posts", tweets: cached };
    mount(host, XWire);
    host.dataset.xMounted = "1";
  }
  const hasPosts = () => _xView.value.status === "posts" && _xView.value.tweets.length;
  const list = X_LIST || {};
  const handles = (X_ACCOUNTS || []).map((a) => a.handle).filter(Boolean);
  if (!handles.length && !list.id) { if (!hasPosts()) _xView.value = { status: "empty", msg: "No accounts configured.", link: false }; return; }
  const q = `handles=${encodeURIComponent(handles.join(","))}` + (list.id ? `&listId=${encodeURIComponent(list.id)}` : "");
  fetch(`/api/xfeed?${q}`, { headers: { accept: "application/json" } })
    .then((r) => (r && r.ok) ? r.json() : null)
    .then((d) => {
      const tweets = (d && Array.isArray(d.tweets)) ? d.tweets : [];
      // Never blank the feed once it has posts (kept-alive on refresh).
      if (!tweets.length) { if (hasPosts()) return; _xView.value = { status: "empty", msg: "Live posts are unavailable right now.", link: true }; return; }
      _xView.value = { status: "posts", tweets }; xWriteCache(tweets);
    })
    .catch(() => { if (hasPosts()) return; _xView.value = { status: "empty", msg: "Couldn't load live posts.", link: true }; });
}

// ===== HERO CHART BAND (Option C) ==========================================
// A price/performance chart for the market basket (equities, the 10Y yield,
// commodities, bitcoin). The Worker (/api/hero) returns a FULL YEAR of daily
// closes per instrument in one shot; the client slices that single series for the
// 1M/6M/1Y/YTD toggle, so switching range costs no request. Fetched lazily (like
// the X wire) and seeded from a per-viewer localStorage cache so a fresh load
// paints the last-known chart instantly rather than a blank.
const _HERO_KEY = "wire.hero.v1";
// Reactive state (Phase 3 island): the basket data, the selected keys, and the range
// are signals. A single effect(renderHero) in boot() redraws whenever any of them
// changes, so there are no scattered manual renderHero() calls — mutating a signal IS
// the redraw. The SVG drawing + the ticker-row hover path stay imperative (canvas-like,
// 60fps direct-DOM); only the range toggle is a Preact component (HeroRange).
const _heroData = signal(null);   // [{ key,label,unit,pre,dp,fi,value,asOf,history:[[ms,v],…] }]
const _heroSel = signal([]);      // selected instrument keys (1..all); at least one is always kept
const _heroRange = signal("1M");  // 1D | 1W | 1M | 6M | 1Y | ALL — cold-start 1M (where the
                                  // indexed lines fan out); boot() restores the last-used range
let _heroBooted = false, _heroWatching = false, _heroAuto = 0, _heroWired = false;
const HERO_W = 900, HERO_H = 150, HERO_PX = 6, HERO_PT = 10, HERO_PB = 10;
// Only 1D is intraday — it reads the 15-min bar series and plots on a real wall-clock
// X axis; any run of >45 min between consecutive bars is a closed market (overnight
// / weekend) and is drawn as a BREAK in the line, not a straight fill across it. 1W
// and up read daily closes and draw one continuous line.
const HERO_GAP_MS = 45 * 60000;
function heroIntraday() { return _heroRange.value === "1D"; }
// Split a point series into contiguous segments, breaking wherever an intraday gap
// exceeds HERO_GAP_MS. Daily ranges are one unbroken segment. Returns arrays of
// point indices.
function heroSegments(pts, intraday) {
  if (!intraday) return [pts.map((_, i) => i)];
  const segs = []; let cur = [];
  for (let i = 0; i < pts.length; i++) {
    if (i > 0 && pts[i][0] - pts[i - 1][0] > HERO_GAP_MS) { if (cur.length) segs.push(cur); cur = []; }
    cur.push(i);
  }
  if (cur.length) segs.push(cur);
  return segs;
}
// True 1D: the intraday axis is anchored to the viewer's LOCAL trading day rather
// than a rolling 24h — it spans a fixed session window (07:00–22:00 local, widened
// to the latest bar) so each instrument's line occupies only the hours its market is
// open (US indices in the afternoon here, ~24h crypto/commodities across the day) and
// the rest of today sits empty to the right. Local hours → it follows the device clock.
const HERO_DAY_OPEN = 7, HERO_DAY_CLOSE = 22;
// Local midnight of the most recent intraday bar across the basket (≈ today, or the
// latest day we hold intraday data for — so a weekend 1D still anchors to a real day).
function heroDayStart() {
  let t = 0;
  for (const it of (_heroData.value || [])) { const a = it && it.intraday; if (a && a.length) { const e = a[a.length - 1][0]; if (e > t) t = e; } }
  if (!t) t = Date.now();
  const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime();
}
// The 1D wall-clock domain: ALWAYS the fixed session window (07:00–22:00 local, widened
// only to the latest bar), never a rolling 24h — so 1D consistently reads as the trading
// day left→right whatever hours the data happens to cover. Returns [t0, t1, session].
function heroIntradayDomain(t0data, t1data) {
  if (_heroRange.value === "1D") {
    const ds = heroDayStart(), ws = ds + HERO_DAY_OPEN * 3600e3;
    return [ws, Math.max(ds + HERO_DAY_CLOSE * 3600e3, t1data), true];
  }
  return [t0data, t1data, false];
}
// Intraday time ticks: whole-hour marks across the fixed 1D session window (so the day
// reads 07:00 … 22:00 left→right), else even fractions of the data window.
function heroIntradayTickTimes(t0, t1, session, xCount) {
  const out = [];
  if (session) {
    const stepH = (t1 - t0) > 12 * 3600e3 ? 4 : 3;   // ~5 labels across the day, never crowded
    for (let ms = t0; ms <= t1 + 1; ms += stepH * 3600e3) out.push(ms);
    if (out.length && out[out.length - 1] < t1 - 30 * 60e3) out.push(t1);
    return out;
  }
  for (let k = 0; k < xCount; k++) out.push(t0 + (t1 - t0) * k / Math.max(1, xCount - 1));
  return out;
}
// 1D SESSION OVERLAY — clean vertical markers only (no bands, no bottom strip): each
// bounded market's OPEN, plus its CLOSE once it has actually closed for the day. Group
// the plotted instruments by region, infer each region's open/close from its intraday
// bars (timezone-correct — the bars carry real timestamps), and draw a dashed vertical
// in the region's colour at each. Round-the-clock markets (Commodities/Crypto) get
// nothing. Coincident times (UK/Europe opens) are drawn once; UK is ordered first so
// the shared European-morning marker reads in its colour. 1D only; plot is unshrunk.
const HERO_REGION_ORDER = ["UK", "Europe", "US", "Commodities", "Crypto"];
const HERO_CONTINUOUS_REGIONS = new Set(["Commodities", "Crypto"]);
function heroSessionOverlay(series, Xtime, plotTop, fullBottom) {
  let latest = -Infinity;
  for (const s of series) if (s.pts && s.pts.length) latest = Math.max(latest, s.pts[s.pts.length - 1][0]);
  const byR = new Map();
  for (const s of series) {
    if (!s.pts || s.pts.length < 2) continue;
    const open = s.pts[0][0], close = s.pts[s.pts.length - 1][0], r = s.region || "Other";
    const g = byR.get(r);
    if (g) { g.open = Math.min(g.open, open); g.close = Math.max(g.close, close); }
    else byR.set(r, { region: r, color: s.color, open, close });
  }
  const order = HERO_REGION_ORDER.filter((r) => byR.has(r)).concat([...byR.keys()].filter((r) => !HERO_REGION_ORDER.includes(r)));
  const clampX = (ms) => Math.max(HERO_PX, Math.min(HERO_W - HERO_PX, Xtime(ms)));
  const vline = (ms, color) => `<line x1="${clampX(ms).toFixed(1)}" y1="${plotTop}" x2="${clampX(ms).toFixed(1)}" y2="${fullBottom.toFixed(1)}" stroke="${color}" stroke-width="1" stroke-opacity=".6" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"/>`;
  let lines = ""; const seen = new Set();
  const key = (ms) => Math.round(ms / (20 * 60e3));   // dedup markers within ~20 min
  for (const r of order) {
    if (HERO_CONTINUOUS_REGIONS.has(r)) continue;      // round-the-clock — no open/close
    const g = byR.get(r);
    if (!seen.has("o" + key(g.open))) { seen.add("o" + key(g.open)); lines += vline(g.open, g.color); }
    // A close only once the market has actually closed (its last bar precedes the
    // latest bar on the chart) — an open market has no close yet.
    if (g.close < latest - 30 * 60e3 && !seen.has("c" + key(g.close))) { seen.add("c" + key(g.close)); lines += vline(g.close, g.color); }
  }
  return { decor: lines, plotBottom: fullBottom };
}
const HERO_RLBL = { "1D": "1-day", "1W": "1-week", "1M": "1-month", "6M": "6-month", "1Y": "1-year", "ALL": "all" };
// Categorical series colours for the multi-select overlay — the dataviz reference
// palette's dark hues, validated (worst adjacent CVD ΔE 8.4). The green/red slots
// are deliberately skipped: on this terminal they read as up/down, not identity.
// A single selected series keeps the up/down price line instead of a series colour.
const HERO_COLORS = { spx: "#3987e5", ndx: "#d95926", ftse: "#26a9c4", sx5e: "#b45bb0", ust10: "#199e70", oil: "#c98500", gold: "#d55181", btc: "#9085e9" };
const HERO_FALLBACK = ["#3987e5", "#d95926", "#26a9c4", "#b45bb0", "#199e70", "#c98500", "#d55181", "#9085e9"];
function heroColor(key, i) { return HERO_COLORS[key] || HERO_FALLBACK[i % HERO_FALLBACK.length]; }
// Short codes for the direct end-of-line labels (the legend carries the full names).
const HERO_CODE = { spx: "SPX", ndx: "NDX", ftse: "FTSE", sx5e: "STOXX", ust10: "10Y", oil: "Oil", gold: "Gold", btc: "BTC" };
// The selected instruments, in basket order — never empty once data has loaded. Pure:
// it never writes _heroSel (the "≥1 kept" invariant is enforced at the mutation sites
// below), so it is safe to call inside the redraw effect without self-triggering it.
function heroSelected() {
  const data = _heroData.value;
  if (!data || !data.length) return [];
  const s = data.filter((it) => _heroSel.value.includes(it.key));
  return s.length ? s : [data[0]];
}
// Toggle a security in/out of the selection; never let it fall below one. Writes a NEW
// array to the signal (Object.is identity change) so the redraw effect re-runs.
function heroToggle(key) {
  if (!key) return;
  const cur = _heroSel.value;
  if (cur.includes(key)) { if (cur.length > 1) _heroSel.value = cur.filter((k) => k !== key); }
  else _heroSel.value = [...cur, key];
}
// The DEFAULT overlay: EVERY instrument selected, so the chart opens with all eight
// lines plotted. Each is one tap away on the legend to hide, and the shared % axis keeps
// them legible (the 1M default range separates them rather than burying them on ~0%).
function heroDefaultSel(insts) {
  return (insts || []).map((i) => i.key);
}
// Signed percent, e.g. "+3.4%" / "−1.2%" (real minus glyph).
function heroPctStr(v) { const a = Math.abs(v); return (v > 0 ? "+" : v < 0 ? "−" : "") + (a >= 100 ? Math.round(a) : a.toFixed(1)) + "%"; }

function heroReadCache() { try { const d = JSON.parse(localStorage.getItem(_HERO_KEY) || "null"); return d && Array.isArray(d.instruments) ? d.instruments : null; } catch { return null; } }
function heroWriteCache(insts) { try { localStorage.setItem(_HERO_KEY, JSON.stringify({ instruments: insts, at: Date.now() })); } catch { /* private mode / quota */ } }

function initHero() {
  const host = document.getElementById("jump-hero");
  if (!host) return;
  if (_heroBooted) { fetchHero(); renderHeroNews(); return; }   // re-entry (Chart chip tapped): refresh
  const boot = () => {
    if (_heroBooted) return; _heroBooted = true;
    // No fixed default range — restore whichever range was last used (1M only on a cold start).
    try { const pr = _homePrefs().heroRange; if (HERO_RANGES.includes(pr)) _heroRange.value = pr; } catch { /* ignore */ }
    mountHeroRange();            // Preact range toggle (reads/writes _heroRange)
    wireHeroControls();          // ticker-row delegation + svg hover
    effect(renderHero);          // reactive redraw: re-runs on any _heroData/_heroSel/_heroRange change
    const cached = heroReadCache();
    if (cached && cached.length) batch(() => { _heroData.value = cached; if (!_heroSel.value.length) _heroSel.value = heroDefaultSel(cached); });
    fetchHero();
    renderHeroNews();
    startHeroAuto();
  };
  if (host.offsetParent !== null) { boot(); return; }   // visible now (desktop, or revealed by the Chart chip)
  if (_heroWatching) return; _heroWatching = true;        // hidden: wait until it nears view
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((ents) => { if (ents.some((e) => e.isIntersecting)) { io.disconnect(); boot(); } }, { rootMargin: "400px 0px" });
    io.observe(host);
  } else boot();
}
function fetchHero() {
  fetch("/api/hero", { headers: { accept: "application/json" } })
    .then((r) => (r && r.ok) ? r.json() : null)
    .then((d) => {
      const insts = (d && Array.isArray(d.instruments)) ? d.instruments : [];
      if (!insts.length) return;                            // keep whatever is showing
      batch(() => {
        _heroData.value = insts;
        const pruned = _heroSel.value.filter((k) => insts.some((i) => i.key === k));   // drop stale keys
        _heroSel.value = pruned.length ? pruned : heroDefaultSel(insts);               // default: one per asset class
      });
      heroWriteCache(insts);
    })
    .catch(() => { /* keep last-good chart */ });
}
// Refresh the series every 5 min while Home is active and the band is visible —
// never in the background (mirrors the markets/X-wire cadence).
function startHeroAuto() {
  if (_heroAuto) return;
  _heroAuto = setInterval(() => {
    if (__ROOT.dataset.v2tab !== __KEY) return;
    const host = document.getElementById("jump-hero");
    if (!host || host.offsetParent === null || document.hidden) return;
    fetchHero();
    renderHeroNews();
  }, 5 * 60 * 1000);
}
function wireHeroControls() {
  if (_heroWired) return; _heroWired = true;
  const sel = document.getElementById("g-hero-sel");
  const svg = document.getElementById("g-hero-svg");
  // A ticker TOGGLES its security on/off the chart (multi-select, ≥1 kept). heroToggle
  // writes _heroSel, which the redraw effect reacts to — no explicit redraw here. The
  // range toggle is the HeroRange Preact island (it writes _heroRange directly).
  if (sel) sel.addEventListener("click", (e) => { const b = e.target.closest(".g-hero-tk"); if (!b) return; heroToggle(b.dataset.k); });
  if (svg) {
    svg.addEventListener("mousemove", heroHover);
    svg.addEventListener("mouseleave", () => {
      const tip = document.getElementById("g-hero-tip"); if (tip) tip.hidden = true;
      const cr = svg.querySelector(".g-hero-cross"); if (cr) cr.style.display = "none";
      const dot = svg.querySelector(".g-hero-hoverdot"); if (dot) dot.style.display = "none";
      if (svg._multi) heroRestoreTickers();
    });
  }
}
function heroFmt(v, m) {
  if (v == null || !isFinite(v)) return "—";
  const s = Number(v).toLocaleString("en-US", { minimumFractionDigits: m.dp, maximumFractionDigits: m.dp });
  return (m.pre || "") + s + (m.unit || "");
}
// Slice an instrument's series to the selected window (client-side; no refetch).
// 1D reads the INTRADAY series (15-min bars); 1W and the longer ranges read the
// daily-close series and draw one continuous line (ALL = everything we hold).
function heroSlice(m) {
  const intraday = heroIntraday();
  const src = (intraday && Array.isArray(m.intraday) && m.intraday.length >= 2) ? m.intraday : m.history;
  if (!Array.isArray(src) || src.length < 2) return src || [];
  const now = src[src.length - 1][0];
  // True 1D: today's session only (from the local open), so the ticker % is the
  // day's move and the line sits in its trading hours. Fall back to a rolling window
  // pre-open / on a non-trading day so it never blanks.
  if (_heroRange.value === "1D") {
    const ws = heroDayStart() + HERO_DAY_OPEN * 3600e3;
    const day = src.filter((p) => p[0] >= ws);
    // Always the session window — no rolling-24h fallback. If today's session is too
    // sparse to draw (pre-open), keep the last couple of bars; the domain still frames
    // 07:00–22:00 so the axis never reverts to a rolling day.
    return day.length >= 2 ? day : src.slice(-2);
  }
  let start = -Infinity;                                    // ALL → everything the series holds
  const rng = _heroRange.value;
  if (rng === "1W") start = now - 8 * 864e5;                 // ~one week of daily closes (continuous)
  else if (rng === "1M") start = now - 31 * 864e5;
  else if (rng === "6M") start = now - 183 * 864e5;
  else if (rng === "1Y") start = now - 366 * 864e5;
  const pts = src.filter((p) => p[0] >= start);
  return pts.length >= 2 ? pts : src.slice(-2);
}
// Round "nice" tick values inside [lo,hi] (1/2/5 × 10ⁿ steps) for the value axis.
function heroNiceTicks(lo, hi, n) {
  if (!(hi > lo)) { hi = lo + 1; lo = lo - 1; }
  const raw = (hi - lo) / Math.max(1, n);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const out = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-6; v += step) out.push(+v.toFixed(6));
  return out;
}
// Compact axis number (thousands-separated; no currency prefix; carries a % unit
// for the yield). Kept short so the value gutter stays narrow.
function heroFmtAxis(v, m) {
  const a = Math.abs(v);
  const s = a >= 1000 ? Math.round(v).toLocaleString("en-US")
    : v.toFixed(m.fi ? 2 : (a >= 100 ? 1 : 2));
  return s + (m.unit || "");
}
// Axis label: time-of-day on 1D, day+month on 1W/1M/6M, month+'YY on the long ones.
function heroFmtDate(ms) {
  const d = new Date(ms);
  const rng = _heroRange.value;
  if (rng === "1D") { try { return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); } catch { return `${d.getHours()}:00`; } }
  if (rng === "1W" || rng === "1M" || rng === "6M") return `${d.getDate()} ${MONTHS[d.getMonth()] || ""}`;
  return `${MONTHS[d.getMonth()] || ""} '${String(d.getFullYear()).slice(2)}`;   // 1Y / ALL
}
// Pixel-accurate de-collision of the exit-point labels. They're first placed at their
// line's end y (in viewBox %), then nudged apart here by their REAL rendered height —
// which the viewBox spread can't know on a wide/short chart, so lines that end close
// together used to stack on the same row. Packs the pills top-to-bottom at a min
// centre-to-centre gap and shoves the stack back inside the column if it overruns.
function _heroDecollideLabels(els) {
  const pills = els ? [...els.children] : [];
  if (pills.length < 2) return;
  const colH = els.clientHeight;
  if (!colH) return;                                        // no laid-out height (hidden) → nothing to do
  const ph = (pills[0].getBoundingClientRect().height || 14) + 1;   // pill height + 1px breathing
  const tops = pills.map((p) => parseFloat(getComputedStyle(p).top) || 0);   // resolved % → px (pill centres)
  for (let i = 1; i < tops.length; i++) if (tops[i] - tops[i - 1] < ph) tops[i] = tops[i - 1] + ph;
  const lo = ph / 2, hi = colH - ph / 2;                   // keep whole pills inside the column
  const over = tops[tops.length - 1] - hi; if (over > 0) for (let i = 0; i < tops.length; i++) tops[i] -= over;
  const under = lo - tops[0]; if (under > 0) for (let i = 0; i < tops.length; i++) tops[i] += under;
  pills.forEach((p, i) => { p.style.top = tops[i] + "px"; });
}
function drawHero(svg, pts, m) {
  const n = pts.length, vals = pts.map((p) => p[1]);
  let lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
  if (lo === hi) { lo -= 1; hi += 1; }
  const pad = (hi - lo) * 0.08;              // breathing room so the line clears the frame
  const dlo = lo - pad, dhi = hi + pad;      // padded value domain
  const plotW = HERO_W - HERO_PX * 2, fullBottom = HERO_H - HERO_PB;
  // Intraday (1D) → real wall-clock X so gaps show as gaps; daily → even by index.
  const intraday = heroIntraday();
  const dom = intraday ? heroIntradayDomain(pts[0][0], pts[n - 1][0]) : [pts[0][0], pts[n - 1][0], false];
  const t0 = dom[0], t1 = dom[1], session = dom[2], span = (t1 - t0) || 1;
  const X = intraday ? (i) => HERO_PX + plotW * (pts[i][0] - t0) / span
                     : (i) => HERO_PX + plotW * i / (n - 1);
  const last = vals[n - 1], up = last >= vals[0];
  // For a yield a FALL is "risk-on"/green; for a price a RISE is green.
  const good = m.fi ? !up : up;
  const col = good ? "var(--t-up)" : "var(--t-down)";
  // 1D session overlay (band · open vertical · duration bar) for this one instrument.
  const ov = (intraday && session)
    ? heroSessionOverlay([{ region: m.region || "", color: HERO_COLORS[m.key] || col, pts }], (ms) => HERO_PX + plotW * (ms - t0) / span, HERO_PT, fullBottom)
    : { decor: "", plotBottom: fullBottom };
  const plotBottom = ov.plotBottom, plotH = plotBottom - HERO_PT;
  const Y = (v) => HERO_PT + plotH - ((v - dlo) / (dhi - dlo)) * plotH;
  // Value ticks (right axis) and time ticks (bottom axis). Intraday ticks are even
  // fractions of the wall-clock window; daily ticks are even data indices.
  const yt = heroNiceTicks(dlo, dhi, 4).filter((t) => Y(t) >= HERO_PT - 0.5 && Y(t) <= plotBottom + 0.5);
  const xCount = Math.min(5, n);
  const xt = [];   // { gx, label, edge }
  if (intraday) {
    for (const tk of heroIntradayTickTimes(t0, t1, session, xCount)) xt.push({ gx: HERO_PX + plotW * (tk - t0) / span, label: heroFmtDate(tk) });
  } else {
    const seen = [];
    for (let k = 0; k < xCount; k++) { const idx = Math.round((n - 1) * k / Math.max(1, xCount - 1)); if (seen[seen.length - 1] !== idx) { seen.push(idx); xt.push({ gx: X(idx), label: heroFmtDate(pts[idx][0]) }); } }
  }
  // Bloomberg-style furniture: faint horizontal grid at each value tick, faint
  // dotted verticals at each time tick, the line (thin, non-scaling stroke) over a
  // whisper of fill, plus a baseline frame.
  let grid = "";
  for (const t of yt) { const gy = Y(t).toFixed(1); grid += `<line x1="${HERO_PX}" y1="${gy}" x2="${(HERO_W - HERO_PX).toFixed(1)}" y2="${gy}" style="stroke:var(--t-grid)" stroke-width="1" vector-effect="non-scaling-stroke"/>`; }
  for (const xk of xt) { const gx = xk.gx.toFixed(1); grid += `<line x1="${gx}" y1="${HERO_PT}" x2="${gx}" y2="${plotBottom.toFixed(1)}" style="stroke:var(--t-grid)" stroke-width="1" vector-effect="non-scaling-stroke"/>`; }
  // Line + fill, broken into segments at overnight/weekend gaps (intraday only).
  let line = "", area = "";
  for (const seg of heroSegments(pts, intraday)) {
    for (let j = 0; j < seg.length; j++) { const i = seg[j]; line += (j ? " L " : " M ") + X(i).toFixed(1) + " " + Y(vals[i]).toFixed(1); }
    const a = seg[0], b = seg[seg.length - 1];
    area += " M " + X(a).toFixed(1) + " " + plotBottom.toFixed(1);
    for (let j = 0; j < seg.length; j++) { const i = seg[j]; area += " L " + X(i).toFixed(1) + " " + Y(vals[i]).toFixed(1); }
    area += " L " + X(b).toFixed(1) + " " + plotBottom.toFixed(1) + " Z";
  }
  svg.innerHTML = `<title>Price chart</title>${ov.decor}${grid}`
    + `<path d="${area}" style="fill:${col};fill-opacity:.07" stroke="none"/>`
    + `<path class="g-hero-line" d="${line}" style="fill:none;stroke:${col}" stroke-width="1.35" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`
    + `<line class="g-hero-cross" x1="0" y1="${HERO_PT}" x2="0" y2="${plotBottom.toFixed(1)}" style="stroke:var(--t-faint);stroke-dasharray:2 2;display:none" vector-effect="non-scaling-stroke"/>`
    + `<circle class="g-hero-hoverdot" r="3" style="fill:${col};display:none"/>`
    + `<circle cx="${X(n - 1).toFixed(1)}" cy="${Y(last).toFixed(1)}" r="2.4" style="fill:${col}" vector-effect="non-scaling-stroke"/>`;
  // Right value axis (HTML — crisp text; % positions map 1:1 onto the stretched
  // SVG). The last value sits in a colour-coded tag; nearby ticks are dropped so
  // it never collides.
  const yax = document.getElementById("g-hero-yaxis");
  if (yax) {
    const tagTop = (Y(last) / HERO_H) * 100;
    const labs = yt.map((t) => { const top = (Y(t) / HERO_H) * 100; return Math.abs(top - tagTop) < 7 ? "" : `<span class="g-hero-ylab" style="top:${top.toFixed(2)}%">${esc(heroFmtAxis(t, m))}</span>`; }).join("");
    yax.innerHTML = labs + `<span class="g-hero-ytag ${good ? "up" : "down"}" style="top:${tagTop.toFixed(2)}%">${esc(heroFmtAxis(last, m))}</span>`;
  }
  // Bottom time axis (HTML). First/last labels hug the edges so they don't clip.
  const xax = document.getElementById("g-hero-xaxis");
  if (xax) {
    xax.innerHTML = xt.map((xk, k) => {
      const pos = k === 0 ? "left:0" : k === xt.length - 1 ? "right:0" : `left:${((xk.gx / HERO_W) * 100).toFixed(2)}%;transform:translateX(-50%)`;
      return `<span class="g-hero-xlab" style="${pos}">${esc(xk.label)}</span>`;
    }).join("");
  }
  svg._pts = pts; svg._m = m; svg._X = X; svg._Y = Y;
  svg._intraday = intraday; svg._t0 = t0; svg._span = span;
}
// The INDEX overlay drawn when ≥2 securities are selected: each series rebased to
// % from the window start onto ONE shared % axis (never a dual axis — see the
// dataviz rule), in its categorical colour, with a stronger baseline at 0%.
function drawHeroMulti(svg, series) {
  const plotW = HERO_W - HERO_PX * 2, plotR = HERO_W - HERO_PX, fullBottom = HERO_H - HERO_PB;
  const intraday = heroIntraday();
  const ref = series.reduce((a, b) => (b.pts.length > a.pts.length ? b : a), series[0]);
  // Intraday overlays share ONE wall-clock domain so the lines line up in real time
  // across instruments that trade different hours (24/7 crypto vs market-hours
  // indices); daily overlays keep the index-normalised layout.
  let t0d = Infinity, t1d = -Infinity;
  for (const s of series) { if (s.pts[0][0] < t0d) t0d = s.pts[0][0]; const e = s.pts[s.pts.length - 1][0]; if (e > t1d) t1d = e; }
  let t0 = t0d, t1 = t1d, session = false;
  if (intraday) { const dm = heroIntradayDomain(t0d, t1d); t0 = dm[0]; t1 = dm[1]; session = dm[2]; }
  const span = (t1 - t0) || 1;
  const Xtime = (ms) => HERO_PX + plotW * (ms - t0) / span;
  // 1D session overlay (bands · open verticals · per-region duration strip) — shrinks
  // the price plot by the strip height so nothing else moves. Off outside the 1D window.
  const ov = (intraday && session)
    ? heroSessionOverlay(series.map((s) => ({ region: (s.m && s.m.region) || "", color: s.color, pts: s.pts })), Xtime, HERO_PT, fullBottom)
    : { decor: "", plotBottom: fullBottom };
  const plotBottom = ov.plotBottom, plotH = plotBottom - HERO_PT;
  let lo = 0, hi = 0;
  const S = series.map((s) => {
    const base = s.pts[0][1] || 1;
    const pct = s.pts.map((p) => (p[1] / base - 1) * 100);
    for (const v of pct) { if (v < lo) lo = v; if (v > hi) hi = v; }
    return { key: s.key, label: s.label, color: s.color, pct, pts: s.pts };
  });
  if (lo === hi) { lo -= 1; hi += 1; }
  const p = (hi - lo) * 0.08, dlo = lo - p, dhi = hi + p;
  const Xof = (n) => (i) => HERO_PX + plotW * i / Math.max(1, n - 1);
  const Y = (v) => HERO_PT + plotH - ((v - dlo) / (dhi - dlo)) * plotH;
  const yt = heroNiceTicks(dlo, dhi, 4).filter((t) => Y(t) >= HERO_PT - 0.5 && Y(t) <= plotBottom + 0.5);
  // Time ticks: even wall-clock fractions (intraday) or even ref-index steps (daily).
  const xn = ref.pts.length, Xr = Xof(xn), xCount = Math.min(5, xn);
  const xt = [];   // { gx, label }
  if (intraday) {
    for (const tk of heroIntradayTickTimes(t0, t1, session, xCount)) xt.push({ gx: Xtime(tk), label: heroFmtDate(tk) });
  } else {
    const seen = [];
    for (let k = 0; k < xCount; k++) { const idx = Math.round((xn - 1) * k / Math.max(1, xCount - 1)); if (seen[seen.length - 1] !== idx) { seen.push(idx); xt.push({ gx: Xr(idx), label: heroFmtDate(ref.pts[idx][0]) }); } }
  }
  let grid = "";
  for (const t of yt) { const gy = Y(t).toFixed(1), zero = Math.abs(t) < 1e-6; grid += `<line x1="${HERO_PX}" y1="${gy}" x2="${plotR.toFixed(1)}" y2="${gy}" style="stroke:var(--${zero ? "t-faint" : "t-grid"})" stroke-width="${zero ? 1.2 : 1}" vector-effect="non-scaling-stroke"/>`; }
  for (const xk of xt) { const gx = xk.gx.toFixed(1); grid += `<line x1="${gx}" y1="${HERO_PT}" x2="${gx}" y2="${plotBottom.toFixed(1)}" style="stroke:var(--t-grid)" stroke-width="1" vector-effect="non-scaling-stroke"/>`; }
  let paths = "";
  const drawn = S.map((s) => {
    const n = s.pct.length;
    const X = intraday ? (i) => Xtime(s.pts[i][0]) : Xof(n);
    let d = "";
    for (const seg of heroSegments(s.pts, intraday)) for (let j = 0; j < seg.length; j++) { const i = seg[j]; d += (j ? " L " : " M ") + X(i).toFixed(1) + " " + Y(s.pct[i]).toFixed(1); }
    paths += `<path class="g-hero-line" d="${d}" style="fill:none;stroke:${s.color}" stroke-width="1.35" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`
      + `<circle cx="${X(n - 1).toFixed(1)}" cy="${Y(s.pct[n - 1]).toFixed(1)}" r="2.2" style="fill:${s.color}" vector-effect="non-scaling-stroke"/>`;
    return s;
  });
  svg.innerHTML = `<title>Indexed performance</title>${ov.decor}${grid}${paths}`
    + `<line class="g-hero-cross" x1="0" y1="${HERO_PT}" x2="0" y2="${plotBottom.toFixed(1)}" style="stroke:var(--t-faint);stroke-dasharray:2 2;display:none" vector-effect="non-scaling-stroke"/>`;
  const yax = document.getElementById("g-hero-yaxis");
  if (yax) yax.innerHTML = yt.map((t) => `<span class="g-hero-ylab" style="top:${((Y(t) / HERO_H) * 100).toFixed(2)}%">${esc(heroPctStr(t))}</span>`).join("");
  const xax = document.getElementById("g-hero-xaxis");
  if (xax) xax.innerHTML = xt.map((xk, k) => { const pos = k === 0 ? "left:0" : k === xt.length - 1 ? "right:0" : `left:${((xk.gx / HERO_W) * 100).toFixed(2)}%;transform:translateX(-50%)`; return `<span class="g-hero-xlab" style="${pos}">${esc(xk.label)}</span>`; }).join("");
  // Direct end-of-line labels (TradingView-style): a solid colour-filled pill —
  // short code + window % in white — sits in its OWN column just outside each line's
  // exit point (never over the plot), all pills a uniform width. Nudged apart
  // vertically so none collide.
  const els = document.getElementById("g-hero-endlbls");
  if (els) {
    const items = drawn.map((s) => ({ y: Y(s.pct[s.pct.length - 1]), color: s.color, code: HERO_CODE[s.key] || s.label, pct: s.pct[s.pct.length - 1] })).sort((a, b) => a.y - b.y);
    // Place each pill at its line's exit point, clamped to the plot; then de-collide in
    // PIXELS (see _heroDecollideLabels) — the pill's real rendered height can't be known
    // in viewBox units on a wide/short chart, which is what left them overlapping.
    els.innerHTML = items.map((it) => `<span class="g-hero-el" style="top:${((Math.max(HERO_PT, Math.min(plotBottom, it.y)) / HERO_H) * 100).toFixed(2)}%;background:${it.color}"><span class="g-hero-el-nm">${esc(it.code)}</span><span class="g-hero-el-pct">${esc(heroPctStr(it.pct))}</span></span>`).join("");
    _heroDecollideLabels(els);
  }
  svg._multi = drawn; svg._ref = ref; svg._pts = null;
  svg._intraday = intraday; svg._t0 = t0; svg._span = span;
}
// The single securities row — EVERY instrument with its window change, a colour
// dot (filled = plotted, hollow = off), tap to toggle. Doubles as the chart legend.
// Colour follows the instrument (fixed basket slot), never its selection rank.
function heroTickerRow(sel) {
  sel.innerHTML = _heroData.value.map((it, i) => {
    const on = _heroSel.value.includes(it.key);
    const pts = heroSlice(it);
    const first = pts.length >= 2 ? pts[0][1] : null, last = pts.length >= 2 ? pts[pts.length - 1][1] : null;
    const pct = (first) ? (last / first - 1) * 100 : 0;
    const c = heroColor(it.key, i);
    return `<button type="button" class="g-hero-tk${on ? " is-on" : ""}" data-k="${esc(it.key)}" aria-pressed="${on ? "true" : "false"}" style="--c:${c}">`
      + `<i class="g-hero-cdot${on ? " on" : ""}"></i>`
      + `<span class="g-hero-tk-nm">${esc(it.label)}</span>`
      + `<span class="g-hero-tk-pct ${pct >= 0 ? "up" : "down"}" data-pct="${pct.toFixed(4)}">${esc(heroPctStr(pct))}</span></button>`;
  }).join("");
}
// After a hover, put every ticker's % back to its window-end value.
function heroRestoreTickers() {
  document.querySelectorAll("#g-hero-sel .g-hero-tk-pct").forEach((el) => {
    const v = parseFloat(el.dataset.pct || "0");
    el.textContent = heroPctStr(v); el.className = "g-hero-tk-pct " + (v >= 0 ? "up" : "down");
  });
}
// Nearest point index to a wall-clock time (for intraday hover, where X is by time).
function heroNearestByTime(pts, tms) {
  let bi = 0, best = Infinity;
  for (let k = 0; k < pts.length; k++) { const d = Math.abs(pts[k][0] - tms); if (d < best) { best = d; bi = k; } }
  return bi;
}
function heroHover(e) {
  const svg = e.currentTarget;
  const r = svg.getBoundingClientRect(); if (!r.width) return;
  const cross = svg.querySelector(".g-hero-cross");
  const frac = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  const tms = svg._intraday ? (svg._t0 + svg._span * frac) : null;
  // Multi (indexed) mode: the crosshair drives the plotted tickers' % values.
  if (svg._multi) {
    const ref = svg._ref, n = ref.pts.length;
    let px;
    if (tms != null) px = HERO_PX + (HERO_W - HERO_PX * 2) * frac;   // time is linear in X
    else { const i = Math.max(0, Math.min(n - 1, Math.round(frac * (n - 1)))); px = HERO_PX + (HERO_W - HERO_PX * 2) * i / Math.max(1, n - 1); }
    if (cross) { cross.setAttribute("x1", px); cross.setAttribute("x2", px); cross.style.display = ""; }
    const refI = tms != null ? heroNearestByTime(ref.pts, tms) : Math.max(0, Math.min(n - 1, Math.round(frac * (n - 1))));
    svg._multi.forEach((s) => {
      const si = tms != null ? heroNearestByTime(s.pts, tms) : Math.min(refI, s.pct.length - 1);
      const v = s.pct[si];
      const el = document.querySelector(`#g-hero-sel .g-hero-tk[data-k="${s.key}"] .g-hero-tk-pct`);
      if (el) { el.textContent = heroPctStr(v); el.className = "g-hero-tk-pct " + (v >= 0 ? "up" : "down"); }
    });
    return;
  }
  const pts = svg._pts; if (!pts || !pts.length) return;
  let i = tms != null ? heroNearestByTime(pts, tms) : Math.round(frac * (pts.length - 1));
  i = Math.max(0, Math.min(pts.length - 1, i));
  const m = svg._m, px = svg._X(i), py = svg._Y(pts[i][1]);
  const dot = svg.querySelector(".g-hero-hoverdot");
  if (cross) { cross.setAttribute("x1", px); cross.setAttribute("x2", px); cross.style.display = ""; }
  if (dot) { dot.setAttribute("cx", px); dot.setAttribute("cy", py); dot.style.display = ""; }
  const tip = document.getElementById("g-hero-tip");
  if (tip) {
    tip.hidden = false;
    tip.style.left = ((px / HERO_W) * r.width) + "px";
    tip.style.top = ((py / HERO_H) * r.height) + "px";
    tip.innerHTML = `<span class="g-hero-tip-v">${esc(heroFmt(pts[i][1], m))}</span><span class="g-hero-tip-d">${esc(heroFmtDate(pts[i][0]))}</span>`;
  }
}
// The range toggle (1D…ALL) as a Preact island: a segmented tablist bound to the
// _heroRange signal. Tapping a range writes the signal, which re-renders this control
// (active state) AND triggers the redraw effect. No hover path touches it, so unlike the
// ticker row it is safe to let Preact own. Markup matches the old static buttons exactly
// (.g-hero-rg[data-r] · is-on · role=tab) so the specs and CSS are unchanged.
const HERO_RANGES = ["1D", "1W", "1M", "6M", "1Y", "ALL"];
function HeroRange() {
  const cur = _heroRange.value;
  return h(Fragment, null, HERO_RANGES.map((r) => h("button", {
    type: "button", class: "g-hero-rg" + (r === cur ? " is-on" : ""), "data-r": r,
    role: "tab", "aria-selected": r === cur ? "true" : "false",
    onClick: () => { _heroRange.value = r; _saveHomePref({ heroRange: r }); },   // remember the last-used range
  }, r)));
}
function mountHeroRange() {
  const host = document.getElementById("g-hero-range");
  if (host && !host.dataset.rangeMounted) { host.dataset.rangeMounted = "1"; mount(host, HeroRange); }
}

// The imperative redraw — registered as effect(renderHero) in boot(), so it re-runs on
// any _heroData/_heroSel/_heroRange change, and also called directly (via microtask) when
// the Chart column is revealed (its SVG had no laid-out geometry while display:none).
// Reads all three signals so the effect tracks them. The range toggle's active state is
// owned by the HeroRange island, not reflected here.
function renderHero() {
  const data = _heroData.value;
  if (!data || !data.length) return;
  const sel = document.getElementById("g-hero-sel"), svg = document.getElementById("g-hero-svg");
  if (!sel || !svg) return;
  const chosen = heroSelected();
  heroTickerRow(sel);
  const series = chosen.map((c, i) => ({ key: c.key, label: c.label, m: c, color: heroColor(c.key, data.findIndex((d) => d.key === c.key)), pts: heroSlice(c) })).filter((s) => s.pts.length >= 2);
  if (!series.length) return;
  svg._multi = null;
  const els = document.getElementById("g-hero-endlbls"); if (els) els.innerHTML = "";   // cleared for single-line mode; drawHeroMulti repopulates it
  if (series.length >= 2) drawHeroMulti(svg, series);   // ≥2 → indexed % overlay
  else drawHero(svg, series[0].pts, series[0].m);        // 1 → price line + price axis
}

// ---- Related news for the charted tickers -----------------------------------
// Real, sourced Yahoo Finance headlines for the six basket instruments (via
// /api/hero-news), drawn in the news-wire row format (time · ticker tag · headline
// · source · ticker) so it matches the Home news wire exactly. Seeded from a
// per-viewer localStorage cache so it never blanks on refresh.
const _HERONEWS_KEY = "wire.heronews.v1";
function heroNewsReadCache() { try { const d = JSON.parse(localStorage.getItem(_HERONEWS_KEY) || "null"); return d && Array.isArray(d.items) ? d.items : null; } catch { return null; } }
function heroNewsWriteCache(items) { try { localStorage.setItem(_HERONEWS_KEY, JSON.stringify({ items: items.slice(0, 30), at: Date.now() })); } catch { /* private mode / quota */ } }
// Short time: today → HH:MM (Europe/London), else → "D Mon" (mirrors the wire's time slot).
function heroNewsWhen(iso) {
  const t = Date.parse(iso || ""); if (!t) return "";
  const d = new Date(t), now = new Date();
  if (d.toDateString() === now.toDateString()) { try { return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" }); } catch { /* fall through */ } }
  return `${d.getDate()} ${MONTHS[d.getMonth()] || ""}`;
}
function heroNewsRow(it) {
  const c = heroColor(it.key, 0);
  const src = it.source ? `<span class="g-feed-src">${esc(it.source)}</span>` : "";
  return `<a class="g-feed-row g-hero-news-row" href="${esc(it.url)}" target="_blank" rel="noopener noreferrer">`
    + `<span class="g-feed-time">${esc(heroNewsWhen(it.date))}</span>`
    + `<span class="g-feed-code" style="color:${c};background:color-mix(in srgb, ${c} 15%, transparent)">${esc(it.code || "")}</span>`
    + `<span class="g-feed-title">${esc(it.title)}</span>${src}`
    + `<span class="g-feed-desk">${esc(it.ticker || "")}</span></a>`;
}
function renderHeroNews() {
  const host = document.getElementById("g-hero-news"); if (!host) return;
  const paint = (items) => {
    if (!items || !items.length) { if (!host.querySelector(".g-feed-row")) host.innerHTML = `<div class="g-hero-news-empty">No ticker news right now.</div>`; return; }
    host.innerHTML = `<div class="g-hero-news-head">Related news</div>` + items.map(heroNewsRow).join("");
  };
  if (!host.querySelector(".g-feed-row")) {
    const cached = heroNewsReadCache();
    if (cached && cached.length) paint(cached);
    else host.innerHTML = `<div class="g-hero-news-head">Related news</div><div class="g-loading">Loading news…</div>`;
  }
  _wireHeroNewsReader();
  fetch("/api/hero-news", { headers: { accept: "application/json" } })
    .then((r) => (r && r.ok) ? r.json() : null)
    .then((d) => { const items = (d && Array.isArray(d.items)) ? d.items : []; if (!items.length) return; paint(items); heroNewsWriteCache(items); })
    .catch(() => { /* keep whatever is showing */ });
}
// The related-news rows under the chart open IN THE APP like the main wire — never a
// bare external jump. Openly-readable sources print their full text in the reader;
// link-out / subscriber sources (e.g. Reuters) show the headline + an "open original"
// link in the same pane. Delegated once on the persistent host (renderHeroNews only
// swaps its innerHTML), routing to the desktop side pane or the mobile overlay.
function _wireHeroNewsReader() {
  const host = document.getElementById("g-hero-news");
  if (!host || host.dataset.readWired) return;
  host.dataset.readWired = "1";
  host.addEventListener("click", (e) => {
    const row = e.target.closest(".g-feed-row"); if (!row) return;   // source name included → opens in-pane

    e.preventDefault(); e.stopPropagation();
    const read = document.getElementById("g-read");
    if (read && read.offsetParent !== null) openInReadPane(row);   // desktop → side reading pane
    else openMobileReader(_rowItem(row));                          // mobile → in-app reader overlay
  });
}

// Auto-refresh the live markets + rates bands and the two hero one-liners every
// 5 minutes while the page is open. This is CLIENT-SIDE ONLY — it just re-hits
// the /api/markets and /api/rates feeds (no Claude, no scheduled routine, no
// cost of note). Everything else on the page keeps the 5×/day editorial
// cadence. Work is skipped while the tab is hidden and caught up on return.
const LIVE_REFRESH_MS = 5 * 60 * 1000;
// On REOPEN (foregrounding an iOS PWA that stayed resident), the news/markets must be
// current — not up to ~5 min stale. The resume refetch fires on EVERY foreground, gated
// only by a tiny dedupe window so a live refresh that just ran (the background interval,
// or a quick app-flick) isn't repeated. Any reopen past this re-pulls /api/feed (edge-
// assembled, always the freshest wire) + markets/rates and re-renders in place.
const LIVE_RESUME_MS = 3 * 1000;
let _lastLive = Date.now();
function refreshLive() { _lastLive = Date.now(); initMarkets(); initRates(); initPulse(); refreshLiveFeed(); renderPredict(); }

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
        renderWire();
      }
    })
    .catch(() => { /* keep cached/static feed */ });
}
function startLiveRefresh() {
  // Poll every 5 min REGARDLESS of visibility — a backgrounded-but-resident app keeps its
  // markets/rates/feed current, so foregrounding shows live data with nothing to fetch.
  // (The OS still governs this: a desktop/Android background tab keeps ticking, while iOS
  // usually SUSPENDS a backgrounded standalone PWA — its timer simply pauses until resume,
  // where the visibilitychange refetch below takes over. maybeReauth stays visible-only, so
  // a hidden poll never reloads the app.)
  setInterval(() => { refreshLive(); }, LIVE_REFRESH_MS);
  // Reopen: refetch the live news/markets/rates in place the moment the app is foregrounded
  // (gated only by the short dedupe window), so the Home wire is current on every resume.
  on(document, "visibilitychange", () => {
    if (!document.hidden && Date.now() - _lastLive > LIVE_RESUME_MS) refreshLive();
  });
}

// ---- Reopen freshness: pull a newly-published briefing without a manual reload ----
// iOS home-screen PWAs keep the page in memory, so returning to an already-open app
// does NOT re-import the data modules. The live feed/markets/rates refresh on resume
// (startLiveRefresh), but the BRIEFING is baked into the /briefings.js ES module at
// load — a running page can't re-import a module — so a resumed app can show the
// previous edition even though the 5×/day refresh has published a newer one. (The
// build self-heal in nav-actions only catches CODE deploys; a data-only refresh keeps
// the same content-hashed bundle, so it slips past that check.)
//
// Fix: when the app is foregrounded after being away a little while, fetch the
// briefing module fresh — a cache-busting query yields a NEW module instance, and the
// real file is Cache-Control:no-cache so it's a cheap 304 when unchanged — and compare
// its latest (date·time) stamp with the one this page loaded. If a newer edition has
// landed, reload ONCE to pull in every refreshed module (briefing, FT, newsletters,
// home-data). Guarded, throttled and offline-safe; the last-used wire tab is restored
// on reload (F8), so the only visible cost is a scroll-to-top.
// The latest stamp parsed from the briefing module's SOURCE TEXT (not an import), so
// the reopen check can read a freshly-fetched copy without re-importing the module
// (which a running page can't do) or polluting the module map. Each slot writes its
// `date` immediately before its `time`, so one regex captures every (date, time) pair;
// normalise exactly as _latestStampOf does and keep the max.
function _latestStampFromText(src) {
  const re = /\bdate:\s*"([^"]+)"\s*,\s*time:\s*"([^"]*)"/g;
  let m, best = "";
  while ((m = re.exec(String(src || "")))) {
    const t = String(m[2] || "").match(/(\d{1,2}):(\d{2})/);
    const v = `${m[1]} ${t ? t[1].padStart(2, "0") + ":" + t[2] : "00:00"}`;
    if (v > best) best = v;
  }
  return best;
}
let _briefFreshBusy = false, _briefFreshReloaded = false, _briefFreshAt = 0, _hiddenSince = 0;
async function _checkBriefRefresh() {
  if (_briefFreshBusy || _briefFreshReloaded || document.hidden) return;
  const now = Date.now();
  if (_briefFreshAt && now - _briefFreshAt < 60 * 1000) return;   // at most once a minute
  _briefFreshAt = now; _briefFreshBusy = true;
  try {
    const mine = _latestStampOf(BRIEFINGS);
    // Cache-busting query + no-store → a genuinely fresh copy (the file is also
    // Cache-Control:no-cache, and the SW leaves /briefings.js to the network).
    const res = await fetch(`/briefings.js?cb=${now}`, { cache: "no-store" });
    if (res && res.ok) {
      const theirs = _latestStampFromText(await res.text());
      if (theirs && mine && theirs > mine) { _briefFreshReloaded = true; location.reload(); }
    }
  } catch { /* offline / blocked — keep the loaded briefing */ }
  finally { _briefFreshBusy = false; }
}
function initBriefFreshness() {
  on(document, "visibilitychange", () => {
    if (document.hidden) { _hiddenSince = Date.now(); return; }
    // Foregrounded: only bother checking when we were actually away a while, so a
    // quick app-switch never triggers a network round-trip or a reload.
    if (_hiddenSince && Date.now() - _hiddenSince > 2 * 60 * 1000) _checkBriefRefresh();
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
  : (x.managerId ? `/v2/profiles/#/manager/${encodeURIComponent(x.managerId)}` : "/v2/profiles/");
const creditItemExt = (x) => !!x.sourceUrl;

// ---- Highlight cards -------------------------------------------------------
// Each platform card is broken into its natural sections, newest 3 items each.
// One cross-desk feed of everything dated TODAY — Macro headlines (market + US +
// UK), Credit deals / fundraising / CLOs, and Legal alerts / case law / schemes —
// interleaved across desks so it reads as a single merged feed, not three blocks.
// Falls back to the most-recent date present if nothing is dated today, so the
// feed is never empty between refreshes.
// DESK, DESK_CODE, DESK_CLASS, deskFor, palTag and STRICT_MACRO_RE now live in
// the shared wire engine (feed.js) so every page's labels agree.
// Active desk filter for the home news feed: "all" | "m" | "c" | "l".
// One-line cross-desk briefing shown under the "Your briefing" heading.
// Category matchers for the two glance lines: the freshest premium story
// ABOUT markets / about rates & credit replaces the generated one-liners.
const BRIEF_MKT_RE = /\b(stocks?|equit\w*|shares?|S&P|Nasdaq|Dow|FTSE|Nikkei|oil|crude|Brent|gold|dollar|DXY|bitcoin|crypto|rally|sell-?off|futures|Wall Street|market)\b/i;
// STRICTLY rates (gilts, treasuries, bunds, policy) & spreads (yield curve,
// credit/swap spreads). Deliberately absent: bare "bonds?" (corporate issuance
// headlines aren't rates), bare "credit"/"spreads?" (any wildfire "spreads"),
// and the inflation-print vocabulary (CPI/PCE — data, not rates/spreads).
const BRIEF_RATE_RE = /\b(treasur\w+|gilts?|bunds?|JGBs?|yields?|yield curve|2s10s|interest rates?|rate (cut|hike|rise|hold|path|decision|bets)|policy rate|bank rate|basis[- ]points?|bps|Fed|FOMC|Bank of England|BoE|ECB|MPC|central bank|monetary policy|credit spreads?|swap spreads?|spreads? (widen|tighten|narrow)\w*|(wider|tighter) spreads?|high[- ]?yield spreads?|IG spreads?|CDS|OAS)\b/i;
// Once a real story fills a line, the pulse/deterministic writers stand down.
const _briefLeads = { markets: false, rates: false };
// High-impact, market-moving vocabulary — a signal (not proof) that a headline is
// the day's important story rather than routine coverage. Used to RANK, not filter.
const BRIEF_MOVING_RE = /\b(fed|fomc|powell|warsh|rate (cut|hike|rise|decision|hold)|ecb|\bboe\b|inflation|\bcpi\b|\bpce\b|recession|payrolls?|jobs report|unemploy\w*|tariffs?|crash|plunge|slump|tumble|surge|soar|spike|rally|sell-?off|record (high|low)|all-time|crisis|default|downgrade|earnings|profit warning|guidance|deal|merger|acquisition|takeover|bond|yields?|treasur\w+|gilt|spreads?)\b/i;
// Source authority tier — the day's most AUTHORITATIVE wire leads (FT / Bloomberg /
// Reuters / WSJ / Economist over CNBC). An importance proxy, never fabricated.
const BRIEF_SRC_TIER = (s) => (/financial times|ft alphaville|bloomberg|reuters|wall street journal|\bwsj\b|economist/i.test(s || "") ? 2 : 1);
// Importance score: source authority first, then a market-moving signal in the
// headline. Recency is deliberately NOT part of the score (it's only a tiebreak).
const briefImportance = (x) => BRIEF_SRC_TIER(x.src) * 10 + (BRIEF_MOVING_RE.test(x.title || "") ? 5 : 0);
function renderBrief(byDesk, counts, day) {
  const el = document.getElementById("g-brief");
  if (!el) return;
  // Candidate pool: premium news-wire stories only (FT, Bloomberg, Reuters, CNBC,
  // WSJ, Economist). Manager/court/research items never headline.
  const premium = [...byDesk.m, ...byDesk.c, ...byDesk.l].filter((x) => x && PREMIUM_NEWS.has(x.src));
  // "Today" = the freshest day present in the pool; the brief leads ONLY with that
  // day's stories (per the editorial brief: from today, but not chosen by recency).
  const today = premium.reduce((mx, x) => (day(x) > mx ? day(x) : mx), "");
  const todays = premium.filter((x) => day(x) === today);
  // Rank by IMPORTANCE, not freshness: the day's single most important market-moving
  // story leads each line (source authority + moving signal; time is only a tiebreak).
  const byImportance = (a, b) => (briefImportance(b) - briefImportance(a)) || String(b.time || "12:00").localeCompare(String(a.time || "12:00"));
  const ranked = todays.slice().sort(byImportance);
  const lead = ranked[0];
  el.innerHTML = lead
    ? `<span class="g-brief-lead"><span class="g-brief-lbl">Top story</span> <a class="g-brief-link g-desk-${lead.desk}" href="${esc(lead.href)}"${lead.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(lead.title)}</a></span>`
    : "";
  // EQUITIES / RATES & SPREADS lines = the day's most important story in each
  // category (ranked, not newest), never duplicating the Top story above.
  const linkFor = (x) => `<a class="g-brief-link g-desk-${x.desk}" href="${esc(x.href)}"${x.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(x.title)}</a>`;
  const mkt = ranked.find((x) => x !== lead && BRIEF_MKT_RE.test(x.title));
  const rt = ranked.find((x) => x !== lead && x !== mkt && BRIEF_RATE_RE.test(x.title));
  if (mkt) { _briefLeads.markets = true; setGlance("gl-markets", linkFor(mkt)); }
  if (rt) { _briefLeads.rates = true; setGlance("gl-rates", linkFor(rt)); }
}

// Home-feed primary filters mirror the Dashboard sections (Macro · Equities ·
// Bonds · Credit · Hedge Funds · Legal). Macro/Credit/Hedge/Legal are their
// own desks; Equities and Bonds are keyword VIEWS over the macro stream
// (equity-index/stock news vs bond/rates news) so the filter set lines up with the
// dashboard without inventing a separate desk — items keep their real MAC label.
const FEED_DESK_LABEL = { all: "All news", views: "Views", m: "Macro", eq: "Equities", fi: "Bonds", c: "Credit", hdg: "Hedge Funds", l: "Legal", n: "Newsletters", research: "Research" };
const FEED_EQ_RE = /\b(stocks?|shares?|equit\w+|\bindex\b|indices|nasdaq|s&p ?500|s&p|dow(\s?jones)?|ftse|russell|nikkei|kospi|hang seng|\bdax\b|earnings|\bipo\b|semiconductors?|\bchips?\b|nvidia|mega-?cap|magnificent|rally|sell-?off|bull market|bear market)\b/i;
const FEED_FI_RE = /\b(bonds?|yields?|treasur\w+|gilts?|bunds?|coupon|duration|yield curve|credit spread|\boas\b|sovereign debt|rate (cut|hike|rise|path|decision)|interest rates?|\bfed\b|\bfomc\b|bank of england|\bboe\b|\becb\b|\bmpc\b|monetary policy|high[- ]yield|investment[- ]grade)\b/i;

// The router handle (from the Home view's mount), used to open a full desk view
// from the wire's desk switcher. Set once at init; survives keep-alive revisits.
let _ctx = null;
let _feedDesk = "all";
// Second-level TYPE filter within the active desk (e.g. Credit ▸ Deals). "all"
// shows every type. Reset to "all" whenever the primary desk changes.
let _feedType = "all";
// Group-by-type view: when on, the wire is grouped by row label (ALERT, MAC,
// BBG, myFT, …) over a rolling 3-day window instead of the day-by-day stream.
let _feedGroup = false;
// Manager wire grouping: false (default) = one flat chronological stream of every
// manager's events, newest first, regardless of manager; true = grouped into a
// mini-section per manager, managers ordered most-active → least-active.
let _mwGroup = false;
// Manager-wire LABEL filter (mirrors the news wire's desk filter): "all" or a
// signal category (fundraising/deal/clo/…). Chips carry the category's pastel dot.
let _mwCat = "all";
// Category → dot hue (matches the pastel tag colours in feed.css) + display order.
const MW_DOT = { fundraising: "hdg", financing: "hdg", deal: "lex", "m&a": "lex", clo: "mac", team: "amber", mandate: "amber", strategy: "ft", exit: "ft", restructuring: "crd", news: "news" };
const MW_CAT_ORDER = ["fundraising", "deal", "clo", "restructuring", "financing", "m&a", "team", "strategy", "mandate", "exit", "news"];
// Secondary type chips per domain: [labelKey (matches item.type||item.desk), text].
// Domains without sub-types (Newsletters, myFT) get no second row.
const TYPE_CHIPS = {
  // Macro's All/News/Comm sub-row was removed — the news-vs-commentary split is
  // better served by a dedicated filter (see the Commentary lane) than a
  // Macro-only three-chip toggle with a redundant "All".
  c:   [["all", "All"], ["deal", "Deals"], ["fund", "Raises"], ["comm", "Research"]],
  hdg: [["all", "All"], ["news", "News"], ["fund", "Raises"]],
  l:   [["all", "All"], ["alert", "Alerts"], ["case", "Cases"]],
};
// Active source filter (e.g. "Financial Times"): when set, the feed shows every
// story from that newsroom across all three desks. Cleared by the pill or a chip.
let _feedSrc = null;
// F8 — remembered Home preferences (on-device): the last wire desk filter, the
// group-by-type toggle, and the mobile News/Watchlist wire tab. So Home reopens
// exactly where you left it instead of resetting to the author's defaults.
const _HOME_PREFS_KEY = "wire.home.v1";
function _homePrefs() { try { const o = JSON.parse(localStorage.getItem(_HOME_PREFS_KEY) || "{}"); return (o && typeof o === "object") ? o : {}; } catch { return {}; } }
function _saveHomePref(patch) { try { localStorage.setItem(_HOME_PREFS_KEY, JSON.stringify({ ..._homePrefs(), ...patch })); } catch { /* ignore */ } }
// ---- Reader "Not interested" / "Mute source" mutes --------------------------
// The reader's ⋯ menu lets the reader hide a single story ("Not interested") or an
// entire source ("Mute source"). Mutes are kept in the shared home prefs
// (wire.home.v1 → muted:{ srcs:[], urls:[], titles:{} }) so they apply instantly and
// persist on-device, AND mirrored to the server (/api/feedback) so a mute made on one
// device applies on the others and the scheduled refresh routine can see what the reader
// wants filtered out of curation. _mutedSet() returns live Sets for the feed filter.
function _mutedRaw() { const m = _homePrefs().muted; return (m && typeof m === "object") ? m : {}; }
function _mutedSet() {
  const m = _mutedRaw();
  return { srcs: new Set(Array.isArray(m.srcs) ? m.srcs : []), urls: new Set(Array.isArray(m.urls) ? m.urls : []), titles: (m.titles && typeof m.titles === "object") ? m.titles : {} };
}
function _saveMuted(srcs, urls, titles) {
  const t = {}; const us = new Set(urls);
  Object.keys(titles || {}).forEach((u) => { if (us.has(u)) t[u] = String(titles[u]).slice(0, 300); });   // keep titles only for live mutes
  _saveHomePref({ muted: { srcs: [...new Set(srcs)].slice(0, 400), urls: [...us].slice(0, 2000), titles: t } });
}
function _isItemMuted(it) {
  const m = _mutedSet();
  return !!(it && ((it.src && m.srcs.has(it.src)) || (it.href && m.urls.has(it.href))));
}
// Fire-and-forget POST so the tap reaches the server (cross-device + the refresh routine).
function _postFeedback(rec) {
  try { fetch("/api/feedback", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(rec), keepalive: true }).catch(() => {}); } catch { /* best effort */ }
}
function muteSource(src, it) {
  if (!src) return;
  const m = _mutedSet(); m.srcs.add(src); _saveMuted([...m.srcs], [...m.urls], m.titles);
  _postFeedback({ reason: "mute-source", source: src, title: (it && it.title) || "", url: (it && it.href) || "", desk: (it && it.code) || "" });
}
function notInterested(it) {
  if (!it || !it.href) return;
  const m = _mutedSet(); m.urls.add(it.href); if (it.title) m.titles[it.href] = it.title; _saveMuted([...m.srcs], [...m.urls], m.titles);
  _postFeedback({ reason: "not-interested", url: it.href, source: it.src || "", title: it.title || "", desk: it.code || "" });
}
function unmute(sel) {
  const m = _mutedSet();
  if (sel && sel.src) m.srcs.delete(sel.src);
  if (sel && sel.url) { m.urls.delete(sel.url); delete m.titles[sel.url]; }
  _saveMuted([...m.srcs], [...m.urls], m.titles);
  _postFeedback({ reason: "unmute", source: (sel && sel.src) || "", url: (sel && sel.url) || "" });
}
// On load, merge the reader's server-side mutes into the local set so a mute made on
// another device takes effect here. Best-effort; re-renders the feed if anything changed.
let _mutesSynced = false;
function syncMutesFromServer() {
  if (_mutesSynced) return; _mutesSynced = true;
  try {
    fetch("/api/feedback?mine=1", { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || !Array.isArray(d.items)) return;
        const m = _mutedSet(); let changed = false;
        for (const r of d.items) {
          if (r && r.reason === "mute-source" && r.source && !m.srcs.has(r.source)) { m.srcs.add(r.source); changed = true; }
          else if (r && r.reason === "not-interested" && r.url && !m.urls.has(r.url)) { m.urls.add(r.url); if (r.title) m.titles[r.url] = r.title; changed = true; }
        }
        if (changed) { _saveMuted([...m.srcs], [...m.urls], m.titles); try { renderFeed(); } catch { /* feed not ready */ } }
      })
      .catch(() => {});
  } catch { /* best effort */ }
}
const _DESK_KEYS = ["all", "views", "m", "eq", "fi", "c", "hdg", "l", "n", "research"];
// ---- Manager wire (Home manager column) -----------------------------------
// Watchlist-first, then most-recently-active covered managers. Each row leads to
// the manager profile; the latest event + fundraising status are the preview.
function _mgrFollows() {
  try { const f = JSON.parse(localStorage.getItem("meridian.follows") || "{}"); return new Set(Array.isArray(f.manager) ? f.manager : []); }
  catch { return new Set(); }
}
// A CSS-safe category class for a manager-wire tag ("m&a" → "cat-ma"), so each
// category paints in its own soft pastel (see feed.css) instead of all-orange.
const _catCls = (c) => "cat-" + String(c || "news").replace(/[^a-z0-9]/gi, "").toLowerCase();
function _mwWhen(d) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || "");
  if (m) return `${+m[3]} ${MONTHS[+m[2] - 1]}`;
  const mm = /^(\d{4})-(\d{2})$/.exec(d || "");
  return mm ? `${MONTHS[+mm[2] - 1]} ${mm[1]}` : "";
}
// Source label for a manager event — the press outlet, else the source domain.
function _mwSrc(e) {
  if (!e) return "";
  if (e.outlet) return e.outlet;
  const h = srcHost(e.source);
  return h ? (NEWS_SOURCES[h] || tidyDomain(h)) : "";
}
// Formatters for the monitoring meta line.
const _eurAmt = (n) => (n == null ? "" : (n >= 1000 ? "€" + (n / 1000).toFixed(n % 1000 ? 1 : 0) + "bn" : "€" + n + "m"));
const _aumAmt = (sym, val) => (val == null ? "" : (val >= 1000 ? `${sym}${(val / 1000).toFixed(2).replace(/\.?0+$/, "")}tn` : `${sym}${val}bn`));
const _asOfShort = (d) => { const m = /^(\d{4})-(\d{2})/.exec(d || ""); return m ? `${MONTHS[+m[2] - 1]} '${m[1].slice(2)}` : ""; };
const _mixStr = (mix) => Object.entries(mix || {}).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c, n]) => `${CAT_LABEL[c] || c.toUpperCase()}×${n}`).join(" · ");
function _fundStr(f) {
  if (!f) return "";
  const prog = (f.raised != null && f.targetSize != null) ? `${_eurAmt(f.raised)}/${_eurAmt(f.targetSize)}`
    : (f.raised != null ? `${_eurAmt(f.raised)} raised` : (f.targetSize != null ? `target ${_eurAmt(f.targetSize)}` : ""));
  return `${f.name} · ${f.status}${prog ? ` · ${prog}` : ""}`;
}
// Per-manager "seen" baseline (localStorage) → the "+N new" delta on watchlisted
// managers. First sight of a manager sets the baseline (no wall of "new").
function _mgrSeen() { try { const o = JSON.parse(localStorage.getItem("meridian.mgrSeen") || "{}"); return (o && typeof o === "object") ? o : {}; } catch { return {}; } }
function _saveMgrSeen(o) { try { localStorage.setItem("meridian.mgrSeen", JSON.stringify(o)); } catch { /* ignore */ } }

// Each row is a monitor: the news-wire top line (time · code · manager · latest)
// plus a meta line — fundraising stage · activity+trend · signal mix · AUM+as-of
// · strategies — and it expands to the last few events. Rows read as symmetric
// with the aggregated feed (shared .g-feed-row engine).
function renderManagerWire() {
  const box = document.getElementById("g-mgrwire"); if (!box) return;
  // Pull EVERY covered manager with activity (not a capped 24) so the flat stream
  // is a true chronological wire and the grouped view can rank the whole universe.
  const rows = managerWire(_mgrFollows(), { limit: 0 });
  if (!rows.length) { box.innerHTML = `<div class="g-mw-empty">No manager activity yet.</div>`; return; }
  const seen = _mgrSeen();
  rows.forEach((r) => { const p = seen[r.id]; r.newCount = (p != null) ? r.events.filter((e) => e.ts && e.ts > p).length : 0; });

  // LABEL filter (mirrors the news wire's desk filter): a chip row of the signal
  // categories PRESENT in the wire, each with its pastel dot, plus "All". Clicking
  // one narrows the wire to that category (flat + grouped).
  const presentCats = new Set(rows.flatMap((r) => (r.events || []).map((e) => e.cat)).filter(Boolean));
  if (_mwCat !== "all" && _mwCat !== "watchlist" && !presentCats.has(_mwCat)) _mwCat = "all";
  // "All" and "Watchlist" are cross-manager LENSES (everything / followed managers
  // only), styled like the news wire's All/Views — no dot, and a separator after
  // Watchlist divides the lenses from the label (category) chips.
  const catOpts = ["all", "watchlist", ...MW_CAT_ORDER.filter((c) => presentCats.has(c))];
  const catChips = catOpts.map((c) => {
    const on = _mwCat === c;
    const isLens = c === "all" || c === "watchlist";
    const dot = isLens ? "" : `<span class="g-feed-deskdot g-dot-${MW_DOT[c] || "news"}" aria-hidden="true"></span>`;
    const sep = c === "watchlist" ? " g-feed-deskchip-sep" : "";
    const label = c === "all" ? "All" : c === "watchlist" ? "Watchlist" : (CAT_LABEL[c] || c.toUpperCase());
    return `<button type="button" class="g-feed-deskchip${on ? " is-on" : ""}${sep}" data-mwcat="${esc(c)}" role="tab" aria-selected="${on}">${dot}${esc(label)}</button>`;
  }).join("");
  // The wire's header row (fixed, like the news wire's #g-feed-head): the label
  // chips on the left, the Group-by-manager toggle on the right. No title.
  const grpSvg = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>`;
  const grpBtnHTML = `<button type="button" class="g-feed-openbtn g-mw-grpbtn${_mwGroup ? " is-on" : ""}" aria-pressed="${_mwGroup}" aria-label="Group the wire by manager (most active first)">${grpSvg}<span>Group by manager</span></button>`;
  const deskrow = `<div class="g-feed-deskrow g-mw-deskrow"><div class="g-feed-desks" role="tablist" aria-label="Filter the manager wire by label">${catChips}</div><div class="g-feed-ctl">${grpBtnHTML}</div></div>`;
  // Lens/label filter: "all" passes everything; "watchlist" passes only followed
  // managers' events (any category); a category passes only that label.
  const _lensOk = (e, watched) => _mwCat === "all" ? true : _mwCat === "watchlist" ? !!watched : (e && e.cat === _mwCat);

  const item = (r) => {
    const evs = (r.events || []).filter((e) => _lensOk(e, r.watched));
    const href = `/v2/profiles/#/manager/${encodeURIComponent(r.id)}`;
    // One-tap follow ☆/★ (F2) — builds the watchlist straight from the wire, using
    // the same button/store as the Credit view.
    const fav = `<span class="g-mw-fav">${followBtn("manager", r.id)}</span>`;
    const nu = (r.watched && r.newCount) ? `<span class="g-mw-new">+${r.newCount} new</span>` : "";
    const team = r.hasTeamChange ? '<span class="g-mw-team" title="Recent senior hire/departure">⇄</span>' : "";
    const fund = r.inMarket ? `<span class="g-mw-fund" title="Funds in market">◆ ${esc(_fundStr(r.fundsInMarket[0]))}${r.inMarket > 1 ? ` +${r.inMarket - 1}` : ""}</span>` : "";
    const hdr = `<div class="g-mw-hdr">${fav}<a class="g-mw-nm" href="${esc(href)}">${esc(r.name)}</a>${nu}${team}${fund}</div>`;

    const trend = r.trend === "up" ? '<span class="g-mw-up">▲</span>' : r.trend === "down" ? '<span class="g-mw-dn">▼</span>' : '<span class="g-mw-fl">·</span>';
    const mix = _mixStr(r.mix), aum = _aumAmt(r.aumSym, r.aum), strat = (r.strategies || []).slice(0, 2).map(esc).join(" · ");
    const activity = `<div class="g-mw-meta">`
      + `<span class="g-mw-m" title="Events last 30 days (▲ rising vs prior 30d)">${r.count30}·30d ${trend}</span>`
      + (mix ? `<span class="g-mw-m g-mw-mix" title="Signal mix, last 90 days">${esc(mix)}</span>` : "")
      + (aum ? `<span class="g-mw-m g-mw-aum${r.aumStale ? " is-stale" : ""}" title="AUM${r.aumStale ? " — as-of date is >9 months old" : ""}">AUM ${esc(aum)}${r.asOf ? ` · ${_asOfShort(r.asOf)}` : ""}</span>` : "")
      + (strat ? `<span class="g-mw-m g-mw-strat" title="Primary strategies">${strat}</span>` : "")
      + `</div>`;

    // All the manager's news stories together, feed-styled, beneath the activity line.
    const ev = (x) => `<a class="g-mw-ev" href="${esc(x.ext ? x.source : href)}"${x.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>`
      + `<span class="g-mw-ev-d">${_mwWhen(x.date)}</span><span class="g-mw-ev-c ${_catCls(x.cat)}">${CAT_LABEL[x.cat] || "NEWS"}</span>`
      + `<span class="g-mw-ev-t">${esc(x.title)}</span><span class="g-mw-ev-s">${esc(_mwSrc(x))}</span></a>`;
    const SHOWN = 3;
    const shown = evs.slice(0, SHOWN).map(ev).join("");
    const rest = evs.slice(SHOWN, 8);
    const more = rest.length ? `<div class="g-mw-events" hidden>${rest.map(ev).join("")}</div><button type="button" class="g-mw-exp" aria-expanded="false">More</button>` : "";

    return `<div class="g-mw-item">${hdr}${activity}<div class="g-mw-stories">${shown}${more}</div></div>`;
  };

  // Flat chronological row: a single manager event, rendered with the SAME engine
  // as the news wire (.g-feed-row) so it inherits the identical stacked layout —
  // headline on top, a meta line (code · DATE · source) beneath (the manager
  // column is a narrow feedwrap container, so the stacked layout always applies).
  // Instead of a publish time the meta shows the event's date; the headline already
  // leads with the manager, so there is no separate manager-name label — just an
  // orange ★ before the headline when the manager is watchlisted.
  const flatEv = (x) => {
    const to = x.ext ? x.source : `/v2/profiles/#/manager/${encodeURIComponent(x.mgrId)}`;
    const star = x.watched ? `<span class="g-mw-fev-star" title="On your watchlist" aria-label="Watchlisted">★</span> ` : "";
    return `<a class="g-feed-row g-mw-fev" data-mgr="${esc(x.mgrId)}" href="${esc(to)}"${x.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>`
      + `<span class="g-feed-time">${_mwWhen(x.date)}</span>`
      + `<span class="g-feed-code ${_catCls(x.cat)}">${CAT_LABEL[x.cat] || "NEWS"}</span>`
      + `<span class="g-feed-title">${star}${esc(x.title)}</span>`
      + `<span class="g-feed-src">${esc(_mwSrc(x))}</span></a>`;
  };

  let html;
  if (_mwGroup) {
    // Grouped by manager, ordered most-active → least-active by the 30-day event
    // count shown on each card (then 90-day, then recency). Watchlisted managers
    // still lead their section.
    const byActive = (a, b) => (b.count30 - a.count30) || (b.count90 - a.count90) || (b.lastTs - a.lastTs);
    const rowsF = _mwCat === "all" ? rows : rows.filter((r) => (r.events || []).some((e) => _lensOk(e, r.watched)));
    const watched = rowsF.filter((r) => r.watched).sort(byActive);
    const active = rowsF.filter((r) => !r.watched).sort(byActive).slice(0, 20);
    // First-run coaching (F2): with an empty watchlist, tell the user what
    // following does — the active list below doubles as the starter set.
    const coach = _mgrFollows().size === 0
      ? `<div class="g-mw-coach"><div class="g-mw-coach-h">Build your watchlist</div>`
        + `<p class="g-mw-coach-p">Tap ☆ to follow a manager or hedge fund. Your watchlist leads this wire and flags new activity since you last looked — the most active names are shown below to start you off.</p></div>`
      : "";
    html = coach;
    if (watched.length) html += `<div class="g-feed-dayhdr">Watchlist</div>` + watched.map(item).join("");
    if (active.length) html += `<div class="g-feed-dayhdr">${watched.length ? "Most active" : "Active managers"}</div>` + active.map(item).join("");
  } else {
    // Flat (default): every manager's events merged into ONE stream, newest first,
    // regardless of manager, under a month-break band (labelled with the month,
    // like the news wire's day bands) — the first sits beneath the wire heading.
    // Window: the current month to date + the whole previous month (≈ 2 months —
    // e.g. in September it runs back through all of August), rather than a fixed
    // item count, so the wire always shows the same span of history.
    const _nd = new Date(), _winStart = Date.UTC(_nd.getUTCFullYear(), _nd.getUTCMonth() - 1, 1);
    // Per-manager events are already de-duplicated; a conservative CROSS-manager pass
    // (same source URL / identical headline only — no fuzzy matching) then collapses a
    // story attributed to several managers (e.g. a club deal listed under each lender)
    // into one row, without ever merging two managers' genuinely different stories.
    const flat = dedupeEvents(
      rows.flatMap((r) => r.events.map((e) => ({ ...e, mgrName: r.name, mgrId: r.id, watched: r.watched })))
        .filter((e) => e.ts && e.ts >= _winStart && _lensOk(e, e.watched)),
      { fuzzy: false })
      .sort((a, b) => b.ts - a.ts || String(b.date).localeCompare(String(a.date)));
    let out = "", lastMonth = "";
    flat.forEach((r) => {
      const mk = String(r.date || "").slice(0, 7);           // YYYY-MM
      if (mk && mk !== lastMonth) { lastMonth = mk; const [y, mo] = mk.split("-"); out += `<div class="g-feed-dayhdr g-mw-month">${esc((MONTHS[(+mo) - 1] || "") + " " + y)}</div>`; }
      out += flatEv(r);
    });
    html = out ? `<div class="g-mw-flat">${out}</div>` : "";
  }
  // Under an active lens/label filter that leaves nothing, keep the chips + a note.
  if (!html && _mwCat === "watchlist") html = `<div class="g-mw-empty">No activity from your watchlist in this window. Tap ☆ on any manager to follow them.</div>`;
  else if (!html && _mwCat !== "all") html = `<div class="g-mw-empty">No ${esc(CAT_LABEL[_mwCat] || _mwCat)} activity in this window.</div>`;
  const headEl = document.getElementById("g-mw-head");
  if (headEl) headEl.innerHTML = deskrow;
  box.innerHTML = html;

  // Update the seen baseline for shown managers (so this session's items aren't
  // "new" next load); expand toggle is delegated once on the container.
  const next = { ...seen }; rows.forEach((r) => { next[r.id] = r.lastTs; }); _saveMgrSeen(next);
  // The header row (label chips + Group-by-manager) lives OUTSIDE #g-mgrwire, so
  // wire its clicks once via delegation: a chip narrows the wire by category, the
  // toggle flips flat ⇄ grouped. Both persist and re-render.
  if (headEl && !headEl.dataset.wired) {
    headEl.dataset.wired = "1";
    headEl.addEventListener("click", (e) => {
      const catChip = e.target.closest("[data-mwcat]");
      if (catChip) { e.preventDefault(); e.stopPropagation(); _mwCat = catChip.dataset.mwcat || "all"; _saveHomePref({ mgrCat: _mwCat }); renderManagerWire(); return; }
      if (e.target.closest(".g-mw-grpbtn")) { e.preventDefault(); e.stopPropagation(); _mwGroup = !_mwGroup; _saveHomePref({ mgrGroup: _mwGroup }); renderManagerWire(); }
    });
  }
  if (!box.dataset.wired) {
    box.dataset.wired = "1";
    box.addEventListener("click", (e) => {
      // One-tap follow ☆/★: mutate the shared follows store + persist to
      // localStorage (mirrors the credit app's persistLocal; cloud sync reconciles
      // when the Credit view next loads), then re-render so the row restacks.
      const fav = e.target.closest("[data-follow]");
      if (fav) {
        e.preventDefault(); e.stopPropagation();
        const [type, id] = String(fav.dataset.follow || "").split(":");
        if (type && id) {
          const a = followList(type); const i = a.indexOf(id);
          if (i >= 0) a.splice(i, 1); else a.push(id);
          try { localStorage.setItem("meridian.follows", JSON.stringify(follows)); } catch { /* ignore */ }
          renderManagerWire();
        }
        return;
      }
      const btn = e.target.closest(".g-mw-exp"); if (!btn) return;
      e.preventDefault();
      const evbox = btn.closest(".g-mw-item") && btn.closest(".g-mw-item").querySelector(".g-mw-events");
      if (!evbox) return;
      const opening = evbox.hasAttribute("hidden");
      if (opening) evbox.removeAttribute("hidden"); else evbox.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", opening ? "true" : "false");
      btn.textContent = opening ? "Less" : "More";
    });
  }
}

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
  // macro-sourced items split two ways: strictly-macro headlines get the MAC
  // desk, everything else defaults to the general NEWS desk. Economist COMMENTARY
  // is always MAC (it IS macro analysis). The saved-store (sk="m") is unchanged —
  // desk (label) is independent of which app owns the star.
  const macro = [], news = [], legal = [];
  const mSid = (n) => "a" + _savedHash(_savedBase(n));
  const pushMacroItem = (n) => {
    const desk = deskFor(n.title, n.source);
    (desk === "m" ? macro : news).push(mk(desk, n.url, n.title, n.source, true, n.date, n.time, "m", mSid(n)));
  };
  ((ARTICLES && ARTICLES.items) || []).forEach(pushMacroItem);
  (((NEWS && NEWS.us) || [])).forEach(pushMacroItem);
  (((NEWS && NEWS.uk) || [])).forEach(pushMacroItem);
  (((COMMENTARY && COMMENTARY.us) || [])).forEach((n) => macro.push({ ...mk("m", n.url, n.title, n.source, true, n.date, n.time, "m", mSid(n)), type: "comm" }));
  (((COMMENTARY && COMMENTARY.uk) || [])).forEach((n) => macro.push({ ...mk("m", n.url, n.title, n.source, true, n.date, n.time, "m", mSid(n)), type: "comm" }));
  // Live RSS headlines (real publish times) merged in with the curated items; the
  // title-dedupe below collapses any overlap with the static feeds. myFT-flagged
  // items belong to the FT stream and substack-flagged to the Substack desk; the
  // rest split MAC vs NEWS by the same strict-macro test.
  // myFT / Substack ride their own desks (added below). The legal-industry wire
  // (The Lawyer / Legal Business, flagged `legal:true` by the Worker) rides the
  // LEGAL desk so it appears under the Legal chip — deskFor only knows macro/news,
  // so without this it would fall under All/News only. Everything else folds into
  // the Home newsfeed, the superset of every news item across the app.
  (_liveFeed || []).forEach((n) => {
    // myFT / Substack ride their own desks; fixed-income (fi:true) items ride the
    // dedicated `fixedincome` bucket below (desk "fi", badged FI) — routing them
    // here too would mint a NEWS-desk duplicate that wins the title-dedupe on the
    // merged wire and buries the FI label. Same for house research (research:true → RSCH).
    // Skip all four so each keeps its own code.
    if (n.myft || n.substack || n.fi || n.research) return;
    // The Legal chip reads the `legal` bucket, so route legal-flagged items there
    // (with desk "l"); macro headlines to `macro`, the rest to `news`.
    const desk = n.legal ? "l" : deskFor(n.title, n.source);
    (desk === "m" ? macro : desk === "l" ? legal : news).push(mk(desk, n.url, n.title, n.source, true, n.date, n.time));
  });
  // (The low-tier source + off-topic relevance cull now runs server-side in the
  // Worker's /api/feed assembly, so Home and the Macro/Credit/Legal live-wire
  // folds all share ONE filtered stream — no client-side re-cull here.)

  // Every Home item keeps its DOMAIN in `desk` (colour + primary chip + bell) and
  // its finer TYPE in `type` (the pill text: DEAL/RAISE/NEWS/…), per HOUSE_STYLE
  // R10a. The feed engine colours by domain and labels by type||desk.
  const credit = [];
  deals.forEach((d) => credit.push({ ...mk("c", creditItemHref(d), d.headline, creditSource(d), creditItemExt(d), d.date, d.time, "c", d.id), mgr: d.managerId || "", type: d.clo ? "clo" : "deal" }));
  intel.forEach((i) => credit.push({ ...mk("c", creditItemHref(i), i.headline, creditSource(i), creditItemExt(i), i.date, i.time, "c", i.id), mgr: i.managerId || "", type: i.clo ? "clo" : "fund" }));
  // Credit research / white papers (Commentary) — external pieces, so they open
  // out to the publisher like the macro reading list.
  (research || []).forEach((r) => credit.push({ ...mk("c", r.url, r.title, r.institution, true, r.date, r.time), type: "comm" }));
  // Hedge-fund news — real dated events for the tracked hedge funds, in their own
  // Hedge bucket (its own desk chip; separate from the private-credit stream). Type
  // maps the HEDGE_INTEL kind to the pill: fundraising/launch → RAISE, else NEWS.
  const hdgType = (t) => /fundrais|launch|close|capital rais/i.test(t || "") ? "fund" : "news";
  const hdg = [];
  (HEDGE_INTEL || []).forEach((h) => hdg.push({ ...mk("hdg", h.url || `/v2/profiles/#/hf/${encodeURIComponent(h.hfId)}`, h.headline, h.outlet || "", !!h.url, h.date, h.time), mgr: "", type: hdgType(h.type) }));
  // Live hedge-fund stories from /api/feed (e.g. Nishant Kumar's Bloomberg byline,
  // tagged hdg:true by the Worker) — picked up ~5 min after publication and folded
  // into the SAME Hedge (HDG) bucket; title-dedupe collapses the overlap with the
  // curated HEDGE_INTEL backfill above so a story never shows twice.
  (_liveFeed || []).forEach((n) => { if (n.hdg) hdg.push({ ...mk("hdg", n.url, n.title, n.source || "Bloomberg", true, n.date, n.time), mgr: "", type: hdgType(n.title) }); });

  // `legal` is declared above (the live-wire loop folds The Lawyer / Legal
  // Business items into it); these are the committed Legal-app records.
  items.forEach((i) => { if (i.date) legal.push({ ...mk("l", i.url || `/v2/profiles/#/item/${encodeURIComponent(i.id)}`, i.title, firmName(i.firm), !!i.url, i.date, i.time, "l", i.id), firm: i.firm || "", type: i.type === "case" ? "case" : "alert" }); });
  cases.forEach((c) => { if (c.date) legal.push({ ...mk("l", c.url || "/v2/profiles/#/?tab=firms", c.name, c.court, !!c.url, c.date, c.time, "l", c.id), type: "case" }); });
  restructurings.forEach((r) => { if (r.date) legal.push({ ...mk("l", r.judgmentUrl || r.articleUrl || "/v2/profiles/#/?tab=firms", r.company, r.type === "scheme" ? "Scheme" : "Restructuring plan", !!(r.judgmentUrl || r.articleUrl), r.date, r.time, "l", r.id), type: "case" }); });

  // Reader's own aggregated email newsletters (Gmail-swept). By the stated
  // precedence these are LTR — even the Bloomberg / Economist ones — and only a
  // strictly-macro issue reads MAC. Bloomberg & Economist STORIES are fetched
  // separately as live wire items and carry BBG / ECON there.
  const newsletter = [];
  (NEWSLETTERS || []).forEach((n) => newsletter.push(mk(nlDesk(n.title), n.url, n.title, n.author ? `${n.author} · ${n.publication}` : n.publication, true, n.date, n.time)));

  // The reader's personalised myFT (followed-topics) headlines — pulled from the
  // myFT RSS feed by the refresh routines. Open out to ft.com; "FT" desk label.
  // myFT items read FT — unless strictly macro, where MAC trumps FT.
  // FT_DESK_ON — master switch for the whole FT desk. OFF under the readable-only
  // policy (FT is a hard paywall: its stories open at ft.com, not in the reading pane).
  // The server-side myFT feed is also switched off (src/index.js FEED_SOURCES); this
  // gate additionally suppresses the committed FT_ITEMS backfill (regenerated by the
  // refresh routine) so no FT headline leaks onto the wire. Flip to true to restore.
  const FT_DESK_ON = false;
  const ftDesk = (t) => (STRICT_MACRO_RE.test(t || "") ? "m" : "f");
  const ft = [];
  if (FT_DESK_ON) {
    (FT_ITEMS || []).forEach((n) => ft.push(mk(ftDesk(n.title), n.url, n.title, "Financial Times", true, n.date, n.time)));
    // Live myFT headlines from /api/feed (~5 min of publication) — the committed
    // FT_ITEMS above are the 5×/day backfill; title-dedupe collapses the overlap.
    (_liveFeed || []).forEach((n) => { if (n.myft) ft.push(mk(ftDesk(n.title), n.url, n.title, "Financial Times", true, n.date, n.time)); });
  }

  // Curated Substacks (credit/macro newsletters) — live from /api/feed, edge-
  // parsed by the Worker (substack:true). Their own "SUBS" desk label; folded
  // into the All wire and filterable by source like every other desk.
  const substacks = [];
  (_liveFeed || []).forEach((n) => { if (n.substack) substacks.push(mk("s", n.url, n.title, n.source, true, n.date, n.time)); });

  // MailBrew digest items — live from /api/feed (brew:true), edge-fetched by the
  // Worker with the reader's MailBrew key. Own "BREW" desk label; folded into All.
  const brew = [];
  (_liveFeed || []).forEach((n) => { if (n.brew) brew.push(mk("b", n.url, n.title, n.source || "MailBrew", true, n.date, n.time)); });

  // Dedicated fixed-income sources — M&G's Bond Vigilantes blog, live from
  // /api/feed (fi:true). Own "FI" desk label; every item is routed to the Fixed
  // Income filter (in addition to the keyword slice of the macro stream below)
  // and folded into the All wire, filterable by source like every other desk.
  const fixedincome = [];
  (_liveFeed || []).forEach((n) => { if (n.fi) fixedincome.push(mk("fi", n.url, n.title, n.source || "Bond Vigilantes", true, n.date, n.time)); });

  // Research — sell-side / house research. The MANUAL half is the Gmail-swept notes
  // in research.js (JPMorgan Eye on the Market, Apollo Daily Spark, …); the AUTO half
  // is the openly-indexed house shops tagged research:true on the live feed (Apollo
  // Academy, Oaktree, AQR — see src/index.js). Own "RSCH" desk label (teal); folded
  // into the All wire and filterable by source like every other desk.
  // (Named rschFeed, not `research`, to avoid shadowing the module-level credit
  // white-papers array `research` used above.)
  const rschFeed = [];
  (RESEARCH || []).forEach((r) => rschFeed.push(mk("rsch", r.url, r.title, r.author ? `${r.author} · ${r.publication}` : r.publication, true, r.date, r.time)));
  (_liveFeed || []).forEach((n) => { if (n.research) rschFeed.push(mk("rsch", n.url, n.title, n.source, true, n.date, n.time)); });

  // Reader "Not interested" / "Mute source" filter — drop muted stories EVERYWHERE
  // (every lane, the "what's new" counts and the briefing candidate pool) at the single
  // point where the raw desk streams are assembled, before byDesk / renderBrief / the
  // display branches read them. The arrays are rebuilt fresh each render, so splicing in
  // place only affects this pass — un-muting + re-render restores them. Manager/legal
  // event rows carry their own sources and simply won't match a muted news source.
  const _mz = _mutedSet();
  if (_mz.srcs.size || _mz.urls.size) {
    const drop = (x) => !!(x && ((x.src && _mz.srcs.has(x.src)) || (x.href && _mz.urls.has(x.href))));
    [news, macro, credit, hdg, legal, newsletter, ft, substacks, brew, fixedincome, rschFeed].forEach((a) => {
      for (let i = a.length - 1; i >= 0; i--) if (drop(a[i])) a.splice(i, 1);
    });
  }
  const day = (x) => String(x.date || "").slice(0, 10);
  const all = [...news, ...macro, ...credit, ...hdg, ...legal, ...newsletter, ...ft, ...substacks, ...brew, ...fixedincome, ...rschFeed];
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
  const byDesk = { news: dedupe([...news].sort(byDateDesc)), m: dedupe([...macro].sort(byDateDesc)), c: dedupe([...credit].sort(byDateDesc)), hdg: dedupe([...hdg].sort(byDateDesc)), l: dedupe([...legal].sort(byDateDesc)), n: dedupe([...newsletter].sort(byDateDesc)), f: dedupe([...ft].sort(byDateDesc)), s: dedupe([...substacks].sort(byDateDesc)), b: dedupe([...brew].sort(byDateDesc)), fisrc: dedupe([...fixedincome].sort(byDateDesc)), research: dedupe([...rschFeed].sort(byDateDesc)) };
  // Equities is a keyword slice of the macro stream (see FEED_DESK_LABEL note).
  // Bonds is the DEDICATED fi sources (Bond Vigilantes, badged BND) FIRST,
  // then the bond/rates keyword slice of the macro stream (which keeps its MAC
  // label). An item can match both a keyword view and macro; fine for a filter.
  byDesk.eq = byDesk.m.filter((x) => FEED_EQ_RE.test(x.title || ""));
  byDesk.fi = dedupe([...byDesk.fisrc, ...byDesk.m.filter((x) => FEED_FI_RE.test(x.title || ""))].sort(byDateDesc));
  // "Views" — a cross-desk COMMENTARY lane: serious analysis, not headlines. Every
  // strategist-commentary and research/white-paper item (tagged type:"comm" on the
  // Macro and Credit streams) in one filter, so "what the smart people are saying"
  // reads separately from general news.
  byDesk.views = dedupe(all.filter((x) => x.type === "comm").sort(byDateDesc));
  const maxDay = all.reduce((m, x) => (day(x) > m ? day(x) : m), "");
  const cutoff = (() => { const d = new Date(maxDay + "T00:00:00"); if (isNaN(d)) return ""; d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); })();
  const recentN = (list) => (cutoff ? list.filter((x) => day(x) >= cutoff).length : list.length);
  const counts = { m: recentN(byDesk.m), c: recentN(byDesk.c), l: recentN(byDesk.l) };

  // One-line cross-desk morning briefing atop the page: how much is new across the
  // three desks (last ~2 days) plus the single freshest headline as a link. Always
  // computed from the full per-desk streams, so it doesn't change when the reader
  // filters the feed below.
  renderBrief(byDesk, counts, day);

  let feed, groupedBody = null;
  if (_feedGroup && !_feedSrc) {
    // Group-by-type: a rolling 3-day window across the wire (or the selected
    // desk), grouped by each row's label (ALERT / MAC / BBG / myFT / …). Groups
    // are ordered by size; day-by-day ordering is replaced by label headers.
    const cut3 = (() => { const d = new Date(maxDay + "T00:00:00"); if (isNaN(d)) return ""; d.setDate(d.getDate() - 2); return d.toISOString().slice(0, 10); })();
    const corpus = _feedDesk === "all"
      ? dedupe([...news, ...macro, ...credit, ...hdg, ...legal, ...newsletter, ...ft, ...substacks, ...brew, ...fixedincome, ...rschFeed].sort(byDateDesc))
      : (byDesk[_feedDesk] || []);
    feed = corpus.filter((x) => !cut3 || day(x) >= cut3);
    // Readable-only Home newswire (see the ungrouped path below): drop subscriber-
    // paywalled items from the grouped view too, except on the Newsletters desk.
    if (_feedDesk !== "n") feed = feed.filter((x) => !_isPaywalled(x.src, x.href));
    // Stamp untimed rows with their "added" time so each group can order by
    // publish time within a day, not by the concat order of the source streams.
    stampAddedTimes(feed);
    const groups = new Map();
    feed.forEach((x) => {
      const codeKey = x.desk === "hdg" ? "hdg" : (x.type || x.desk);
      const label = DESK_CODE[codeKey] || "NWS";
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(x);
    });
    const ordered = [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
    // Within each type group, keep the wire's own newest→oldest order (day then
    // publish time), exactly as the ungrouped feed does via byFeedDesc.
    groupedBody = ordered.map(([label, items]) =>
      `<div class="g-feed-dayhdr">${esc(label)} · ${items.length}</div>`
      + items.slice().sort(byFeedDesc).map(feedRow).join("")
    ).join("") + `<div class="g-feed-end">· end of wire ·</div>`;
  } else if (_feedSrc) {
    // Source filter wins over the desk chips: every story from that newsroom,
    // across all three desks, newest first.
    feed = dedupe([...news, ...macro, ...credit, ...hdg, ...legal, ...ft, ...substacks, ...brew, ...fixedincome, ...rschFeed].sort(byDateDesc)).filter((x) => x.src === _feedSrc).slice(0, CAP);
  } else if (_feedDesk === "all") {
    // Today's items lead, interleaved across desks so no single desk dominates.
    const pick = (list) => dedupe(list.filter((x) => day(x) === target).sort(byDateDesc));
    const lists = [pick(news), pick(macro), pick(credit), pick(hdg), pick(legal), pick(newsletter), pick(ft), pick(substacks), pick(brew), pick(fixedincome), pick(rschFeed)];
    const seen = new Set();
    feed = [];
    for (let i = 0; lists.some((l) => i < l.length); i++) lists.forEach((l) => {
      if (i < l.length) { const k = norm(l[i].title); if (!seen.has(k)) { seen.add(k); feed.push(l[i]); } }
    });
    // Backfill older items newest-first. The Credit desk carries THOUSANDS of
    // historical rows (and Legal hundreds), so drawing the backfill from the flat
    // corpus lets those two bury a small desk's recent run — the newest ~500 rows
    // only reach back ~3 weeks, so e.g. a hedge reporter's month-old stories fall
    // below the fold. Cap the two high-volume desks to a recent slice and take
    // every other desk WHOLE, so each desk's recent stream survives the merge
    // (the full Credit/Legal history stays one tap away under their own filter).
    const HEAVY = 200;
    const pool = [byDesk.news, byDesk.m, byDesk.c.slice(0, HEAVY), byDesk.hdg,
      byDesk.l.slice(0, HEAVY), byDesk.n, byDesk.f, byDesk.s, byDesk.b, byDesk.fisrc, byDesk.research]
      .flat().filter((x) => day(x) !== target).sort(byDateDesc);
    const GUARD = 900;   // pathological guard, well above the capped pool (~600)
    for (const x of pool) {
      if (feed.length >= GUARD) break;
      const k = norm(x.title); if (!seen.has(k)) { seen.add(k); feed.push(x); }
    }
  } else {
    // Single desk: that desk's most-recent items, up to the cap — narrowed to the
    // active type when a second-level chip is on (matched on type||desk).
    const base = byDesk[_feedDesk] || [];
    feed = (_feedType && _feedType !== "all"
      ? base.filter((x) => (x.type || x.desk) === _feedType)
      : base).slice(0, CAP);
  }

  // Readable-only Home newswire: drop every subscriber-paywalled (Bloomberg / FT / WSJ
  // / Economist / Nikkei) item from the Home wire (News + All lanes) so it opens in the
  // reading pane. The dedicated sections keep their Bloomberg/FT sourcing — the Credit
  // page (Transactions), the hedge/manager Profiles and the Dashboard data panels have
  // their own renderers and are untouched; that beat is reported there and can't be
  // re-sourced. Bot-walled-but-free sources (Reuters / AP / CNA / Straits Times) are NOT
  // dropped — they render in-pane via the Firecrawl browser proxy. The Newsletters lane
  // (_feedDesk "n") is exempt (subscriber content by nature). This replaces the old
  // ≤30% paywalled-share cap.
  if (groupedBody == null && _feedDesk !== "n") {
    feed = feed.filter((x) => !_isPaywalled(x.src, x.href));
    feed = stampAddedTimes(feed).sort(byFeedDesc);
  }
  // Row + day-header + source-bar + empty markup all come from the shared wire
  // engine (feed.js) — the same builders the Macro/Credit/Legal wires use.
  const body = groupedBody != null ? groupedBody : feedBodyHTML(feed);
  const srcBar = _feedSrc ? feedSrcBarHTML(_feedSrc) : "";
  const empty = feedEmptyHTML(
    _feedDesk === "research" && !_feedSrc
      ? "Research fills from your subscribed house-research emails (JPMorgan Eye on the Market, Apollo, Goldman, Morgan Stanley, PIMCO, BlackRock…) swept from Gmail. None yet — subscribe and forward them to the mailbox to populate this lane."
      : `No ${_feedSrc ? _feedSrc + " stories" : _feedDesk === "all" ? "news yet today" : (FEED_DESK_LABEL[_feedDesk] || DESK[_feedDesk]) + " items"} — check back shortly.`);
  setHTML("g-feed", srcBar + (feed.length ? body : empty));
  // The desk / type / group-by sub-filters were removed (little-used) — the wire is now
  // just the lane tabs (All · Research · Managers · Watchlist · Newsletters). Each row keeps
  // its own colour label. The lane picks the desk (_feedDesk), set in renderWire.
  const head = document.getElementById("g-feed-head"); if (head) head.innerHTML = "";
  _lastFeed = feed;      // stashed so the "All" lane can interleave managers in
}

// ---- Merged wire (desktop): News + Manager in one column -------------------
// A top-level lane switch — All · News · Manager · Watchlist — over the shared feed
// column (#g-feed), with the existing coloured sub-filters (news desks / manager
// categories) switching to match the lane. The old manager quadrant becomes a
// reading pane. Mobile keeps its own News/Watch tabs (renderManagerWire → #g-mgrwire).
let _wireLane = "all";        // all | research | manager | watchlist | newsletters — DEFAULT lane is All
let _wireSetter = null;       // initMobileWireTabs' setWire, hoisted so homeReset() can switch panes
let _mgrLaneCat = "all";      // manager/watchlist category sub-filter
let _lastFeed = [];           // last news feed array (for the All interleave)
// The wire-lane chips. "News" was retired (the All lane already carries the full
// news stream, interleaved with manager events); Research sits in its place. The
// "manager" lane keeps its key but is labelled "Managers" (plural).
const WIRE_LANES = [["all", "All"], ["research", "Research"], ["manager", "Managers"], ["watchlist", "Watchlist"], ["newsletters", "Newsletters"]];
const _WIRE_LANE_KEYS = new Set(WIRE_LANES.map(([k]) => k));

// Manager events, flattened + de-duped across managers, for the merged wire.
function managerFlatEvents(watchOnly, cat) {
  const rows = managerWire(_mgrFollows(), { limit: 0 });
  const nd = new Date(), winStart = Date.UTC(nd.getUTCFullYear(), nd.getUTCMonth() - 1, 1);
  const ok = (e, w) => (!watchOnly || w) && (!cat || cat === "all" || e.cat === cat);
  const present = new Set(rows.flatMap((r) => (r.events || []).map((e) => e.cat)).filter(Boolean));
  const events = dedupeEvents(
    rows.flatMap((r) => r.events.map((e) => ({ ...e, mgrName: r.name, mgrId: r.id, watched: r.watched })))
      .filter((e) => e.ts && e.ts >= winStart && ok(e, e.watched)),
    { fuzzy: false }
  ).sort((a, b) => b.ts - a.ts || String(b.date).localeCompare(String(a.date)));
  return { events, present };
}
// A manager event as a shared .g-feed-row (same markup as the manager wire's flat row).
function mgrEventRow(x) {
  const to = x.ext ? x.source : `/v2/profiles/#/manager/${encodeURIComponent(x.mgrId)}`;
  const star = x.watched ? `<span class="g-mw-fev-star" title="On your watchlist" aria-label="Watchlisted">★</span> ` : "";
  return `<a class="g-feed-row g-mw-fev" data-mgr="${esc(x.mgrId)}" href="${esc(to)}"${x.ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>`
    + `<span class="g-feed-time">${_mwWhen(x.date)}</span>`
    + `<span class="g-feed-code ${_catCls(x.cat)}">${CAT_LABEL[x.cat] || "NEWS"}</span>`
    + `<span class="g-feed-title">${star}${esc(x.title)}</span>`
    + `<span class="g-feed-src">${esc(_mwSrc(x))}</span></a>`;
}
// Manager / Watchlist lane: flat month-banded manager events into #g-feed. The
// category sub-filter chips were removed — every event shows, each keeping its own
// colour label (RAISE / DEAL / CLO …).
function renderMgrLane(watchOnly) {
  const box = document.getElementById("g-feed"); if (!box) return;
  const { events } = managerFlatEvents(watchOnly, "all");
  let out = "", lastMonth = "";
  events.forEach((r) => {
    const mk = String(r.date || "").slice(0, 7);
    if (mk && mk !== lastMonth) { lastMonth = mk; const [y, mo] = mk.split("-"); out += `<div class="g-feed-dayhdr g-mw-month">${esc((MONTHS[(+mo) - 1] || "") + " " + y)}</div>`; }
    out += mgrEventRow(r);
  });
  const empty = watchOnly
    ? `<div class="g-mw-empty">No activity from your watchlist in this window. Tap ☆ on a manager to follow them.</div>`
    : `<div class="g-mw-empty">No manager activity yet.</div>`;
  setHTML("g-feed", out ? `<div class="g-mw-flat">${out}</div>` : empty);
  const head = document.getElementById("g-feed-head"); if (head) head.innerHTML = "";
}
// All lane: interleave the news feed with manager events by recency. Reuses the news
// feed already painted by renderFeed (stashed in _lastFeed), then repaints #g-feed.
function _newsTs(x) {
  const d = (x.date || "").slice(0, 10);
  return Date.parse(`${d}T${x.time || "00:00"}:00Z`) || (x.added || 0) || Date.parse(d) || 0;
}
function mergeManagersIntoFeed() {
  const head = document.getElementById("g-feed-head"); if (head) head.innerHTML = "";
  const news = (_lastFeed || []).map((x) => ({ it: x, mgr: false, ts: _newsTs(x) }));
  // DEDUPE manager events against the news feed. The SAME deal is routinely recorded both
  // as a credit deal (CRD, already in _lastFeed) and as a manager-wire event (e.g. FIN), so
  // without this the All lane shows it twice (observed: a Hayfin €305m financing as both
  // CRD and FIN). Keep the news row (richer, desk-coded) and drop any manager event whose
  // normalised title — or external URL — already appears on the feed.
  const _ntitle = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  const seenT = new Set(news.map((m) => _ntitle(m.it.title)).filter(Boolean));
  const seenU = new Set(news.map((m) => m.it.href).filter(Boolean));
  const { events } = managerFlatEvents(false, "all");
  const mgr = events
    .filter((e) => !(seenT.has(_ntitle(e.title)) || (e.ext && e.source && seenU.has(e.source))))
    .map((e) => ({ it: e, mgr: true, ts: e.ts || _newsTs(e) }));
  const merged = news.concat(mgr).sort((a, b) => b.ts - a.ts);
  let out = "", lastDay = "";
  for (const m of merged) {
    const d = (m.it.date || "").slice(0, 10);
    if (d && d !== lastDay) { lastDay = d; out += `<div class="g-feed-dayhdr">${esc(fmt(d))}</div>`; }
    out += m.mgr ? mgrEventRow(m.it) : feedRow(m.it);
  }
  setHTML("g-feed", out || feedEmptyHTML("Nothing on the wire yet."));
}
const WIRE_LANE_LABEL = Object.fromEntries(WIRE_LANES);
// Desktop lane chips (#g-wire-lanes) + the phone wire-tab dropdown (label + menu).
function renderWireLanes() {
  const host = document.getElementById("g-wire-lanes");
  if (host) {
    // Just the lane tabs — All · Research · Managers · Watchlist · Newsletters (desktop; the
    // lane row is display:none on phones, which use the wire-tab dropdown below). The
    // desk/category sub-filters were removed, so there's no sub-filter slot here.
    host.innerHTML = WIRE_LANES.map(([k, l]) =>
      `<button type="button" class="g-wire-lane${_wireLane === k ? " is-on" : ""}" data-lane="${esc(k)}" role="tab" aria-selected="${_wireLane === k}">${esc(l)}</button>`).join("");
    if (!host.dataset.wired) {
      host.dataset.wired = "1";
      host.addEventListener("click", (e) => { const b = e.target.closest(".g-wire-lane"); if (b && b.dataset.lane !== _wireLane) { _setWireLane(b.dataset.lane); } });
    }
  }
  // Phone: the wire tab's label reflects the lane; its dropdown offers all four.
  const lbl = document.querySelector(".g-wiretab-lane .g-wire-lanelbl");
  if (lbl) lbl.textContent = WIRE_LANE_LABEL[_wireLane] || "News";
  const menu = document.getElementById("g-wire-lanemenu");
  if (menu) menu.innerHTML = WIRE_LANES.map(([k, l]) =>
    `<button type="button" class="tchip-menu-item${_wireLane === k ? " is-on" : ""}" data-lane="${esc(k)}" role="menuitem">${esc(l)}</button>`).join("");
}
function _setWireLane(k) {
  if (!k || k === _wireLane) { _closeLaneMenu(); return; }
  _wireLane = k; _saveHomePref({ wireLane: _wireLane });
  _closeLaneMenu();
  renderWire();
}
function _closeLaneMenu() {
  const menu = document.getElementById("g-wire-lanemenu"); if (menu) menu.hidden = true;
  const tab = document.querySelector(".g-wiretab-lane"); if (tab) tab.setAttribute("aria-expanded", "false");
}
// A Home-nav tap (home.js ctrl.home) lands on the DEFAULT: the wire pane, All lane —
// not the Market Briefing. Switches the pane, forces the All lane, persists both so a
// cold load lands there too, and scrolls to top. Closes any open in-app reader/menu.
export function homeReset() {
  try {
    closeMobileReader();
    if (_wireSetter) _wireSetter("brief");           // land on the Market Briefing pane
    if (_wireLane !== "all") _setWireLane("all"); else _closeLaneMenu();   // reset the underlying feed to the All lane
    _saveHomePref({ wire: "brief", wireLane: "all" });
    const feed = document.getElementById("g-feed"); if (feed) feed.scrollTop = 0;
    window.scrollTo(0, 0);
  } catch { /* best-effort reset */ }
}
// The dispatcher — the single entry point for (re)painting the merged wire. Desktop
// selects the lane from the chip row; phones from the wire-tab dropdown (renderWireLanes
// paints both). The reading pane is desktop-only (mobile rows navigate as before).
function renderWire() {
  // Coerce a stale/removed lane (e.g. a persisted "news" from before it was retired)
  // back to the default so the chip row always has an active chip.
  if (!_WIRE_LANE_KEYS.has(_wireLane)) _wireLane = "all";
  renderWireLanes();
  const lane = _wireLane;
  // The All lane carries no sub-filters — flag the layout so phones collapse the
  // (empty) #g-feed-head and let the market-briefing bar sit under the wire tabs.
  const layout = document.querySelector(".g-layout");
  if (layout) layout.classList.toggle("wire-lane-all", lane === "all");
  // The lane picks which desk the news feed shows: Newsletters → the newsletter desk
  // ("n"); Research → the research desk ("research"); every other feed lane → all
  // news. (No sub-filters, so this is the only desk control.) Reset the leftover
  // type/group/source state each paint.
  _feedType = "all"; _feedGroup = false; _feedSrc = null;
  if (lane === "manager" || lane === "watchlist") renderMgrLane(lane === "watchlist");
  else if (lane === "newsletters") { _feedDesk = "n"; renderFeed(); }
  else if (lane === "research") { _feedDesk = "research"; renderFeed(); }
  else { _feedDesk = "all"; renderFeed(); if (lane === "all") mergeManagersIntoFeed(); }
  _decorateLocks();                                    // flag subscriber-only rows with a padlock
  ensureReadWired();
  _markReadingRow();                                   // keep the open story shaded across this repaint
  syncReadDefault();
  // Pre-warm the top stories so the auto-open (desktop) and the first taps/clicks (BOTH
  // surfaces — iPhone is the primary one) are instant. The in-memory cache de-dupes, so
  // repeated renders don't re-fetch the same hrefs, and a client prefetch warms the user's
  // OWN edge colo — the one their open will hit.
  prefetchTopReads(6);
}

// ---- Reading pane (desktop right quadrant) ---------------------------------
// Click any wire row → it opens here in reading mode; defaults to the top story of the
// day. Paywalled sources show the card + a link out; open sources will print in full
// once the reader service lands (Stage 2). On mobile the pane is hidden and rows
// navigate as before.
// Known subscriber sources — these show a preview + link (never fetched). Kept in
// step with the Worker's READ_PAYWALL set so the lock shows instantly; every OTHER
// source is attempted by the reader (any openly-accessible page prints in-pane).
const PAYWALL_SRC = /financial times|bloomberg|wall street journal|\bwsj\b|economist|new york times|\bnyt\b|barron|business insider|the times|telegraph|nikkei|forbes|washington post|the information|seeking alpha/i;
function _isPaywalled(src, href) {
  return PAYWALL_SRC.test(src || "")
    || /(?:^|\/\/|\.)(?:ft|bloomberg|wsj|economist|nytimes|barrons|businessinsider|thetimes|telegraph|nikkei|forbes|washingtonpost|theinformation|seekingalpha)\.[a-z]/i.test(href || "");
}
// Openly-published sources that nonetheless BOT-WALL the reader — a plain AND a
// headless-browser fetch is refused or renders empty — so they can't open in the
// reading pane and must link out, even though they carry NO subscriber paywall.
// Confirmed by the live reader falling back (Reuters → fetch-503/fc-empty). Kept
// SEPARATE from PAYWALL_SRC: no "needs a login" padlock, but they DO count against
// the readable-share throttle, open straight at the publisher (never a dead in-pane
// fallback), and carry an "opens at publisher" mark. Grow as more are confirmed live.
const LINKOUT_SRC = /\breuters\b/i;
function _linksOut(src, href) {
  return LINKOUT_SRC.test(src || "") || /(?:^|\/\/|\.)reuters\.[a-z]/i.test(href || "");
}
// A row can't open in the reading pane — it opens EXTERNALLY — when it's paywalled
// (subscriber login) OR bot-walled (Reuters &c). Both are "not readable in-pane".
function _opensExternally(src, href) { return _isPaywalled(src, href) || _linksOut(src, href); }
// (The _capPaywalledShare throttle was removed: the paywalled premium wires
// (FT/Bloomberg/WSJ/Economist) are switched off at source, so the wire is readable by
// construction. The padlock / external markers below still flag any residual link-out.)
// An outline padlock, flagged on rows whose source needs a login — so you can see
// at a glance what can't open in the reading pane (it opens at the publisher).
const LOCK_SVG = '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="1.7"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>';
// Up-right arrow — a source that opens AT THE PUBLISHER (won't render in-pane), but
// isn't a subscriber paywall (so not the padlock). Distinguishes bot-walled link-outs.
const EXT_SVG = '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 5h11v11"/><path d="M18 6 5 19"/></svg>';
function _decorateLocks() {
  const feed = document.getElementById("g-feed"); if (!feed) return;
  feed.querySelectorAll(".g-feed-row").forEach((row) => {
    if (row.querySelector(".g-feed-lock")) return;                       // already flagged
    const srcEl = row.querySelector(".g-feed-src");
    const href = row.getAttribute("href") || "";
    const ext = row.getAttribute("target") === "_blank" || /^https?:/i.test(href);
    if (!ext || !href) return;
    const src = (srcEl && srcEl.textContent) || "";
    const paywalled = _isPaywalled(src, href);
    const linksOut = !paywalled && _linksOut(src, href);
    if (!paywalled && !linksOut) return;                                 // opens in the reading pane
    row.classList.add("is-locked");                                      // → opens externally, not in-pane
    const mark = document.createElement("span");
    mark.className = "g-feed-lock";
    mark.title = paywalled ? "Subscriber source — needs a login; opens at the publisher"
                           : "Opens in the reading pane; the full text opens at the publisher (this source blocks in-app fetch)";
    mark.innerHTML = paywalled ? LOCK_SVG : EXT_SVG;
    if (srcEl) srcEl.insertBefore(mark, srcEl.firstChild); else row.appendChild(mark);
  });
}
function _rowItem(row) {
  const t = row.querySelector(".g-feed-title");
  return {
    title: t ? t.textContent.replace(/^★\s*/, "").trim() : "",
    src: ((row.querySelector(".g-feed-src") || {}).textContent || "").trim(),
    code: ((row.querySelector(".g-feed-code") || {}).textContent || "").trim(),
    when: ((row.querySelector(".g-feed-time") || {}).textContent || "").trim(),
    href: row.getAttribute("href") || "",
    ext: row.getAttribute("target") === "_blank" || /^https?:/i.test(row.getAttribute("href") || ""),
  };
}
// A stable per-story key for the reading-pane selection (survives a reload).
function _rowKey(row) { return (row && (row.getAttribute("data-sid") || row.getAttribute("href"))) || ""; }
// The story currently open in the reading pane, by _rowKey — so its row stays SHADED
// across in-session re-renders (a live/background refresh, a lane switch). Seeded from
// the persisted last-selection so the shade survives a reload too.
let _readOpenKey = (() => { try { return localStorage.getItem("m_read_last") || ""; } catch { return ""; } })();
let _readPaneOpen = false;   // a story is actually open in the pane this session (not just a stored key)
// Re-apply the .is-reading shade to the open story's row after a feed repaint (the repaint
// rebuilds #g-feed and drops the class). Desktop reading pane only; a no-op when the open
// story isn't in the current lane/feed. Gated on the pane actually being OPEN so it never
// pre-empts syncReadDefault's first open/restore (which both opens the pane AND shades) —
// it only re-applies the shade on later repaints, before syncReadDefault's early-return.
function _markReadingRow() {
  if (!_readPaneOpen || !_readOpenKey) return;
  const read = document.getElementById("g-read");
  if (!read || read.offsetParent === null) return;                 // mobile / hidden pane — rows navigate, no shade
  document.querySelectorAll("#g-feed .g-feed-row").forEach((r) => r.classList.toggle("is-reading", _rowKey(r) === _readOpenKey));
}
function openInReadPane(row) {
  document.querySelectorAll("#g-feed .g-feed-row.is-reading").forEach((r) => r.classList.remove("is-reading"));
  row.classList.add("is-reading");
  const key = _rowKey(row);
  _readOpenKey = key;                                               // keep this row shaded across re-renders
  _readPaneOpen = true;
  try { if (key) localStorage.setItem("m_read_last", key); } catch { /* private mode */ }   // remember the selection across reloads
  renderReadPane(_rowItem(row));
}
let _readSeq = 0;
// Per-page-load reader cache: href -> Promise<parsed /api/read JSON | null>. It de-dupes an
// in-flight PREFETCH with the real open (they share one request), and makes re-opening a
// story instant. In-memory only (cleared on reload) so it never pins pre-deploy text — the
// browser HTTP cache stays bypassed (cache:"no-store"); the EDGE still serves fast.
const _readMem = new Map();
function _timeoutSignal(ms) { try { const c = new AbortController(); setTimeout(() => { try { c.abort(); } catch { /* noop */ } }, ms); return c.signal; } catch { return undefined; } }
function _fetchRead(href) {
  if (!href) return Promise.resolve(null);
  const hit = _readMem.get(href); if (hit) return hit;
  // A 40s ceiling so a hung fetch always resolves, but with enough room for the SERVER to
  // return real text: the worker bounds its own work (direct fetch 8s × up to 4 tries for a
  // flaky origin, then a proxy render ~20s), so this must outwait those retries to actually
  // LOAD the body rather than giving up on it. Only a genuinely dead source falls through to
  // the UI fallback — and the worker caches any success, so a later open is instant anyway.
  const p = fetch(`/api/read?url=${encodeURIComponent(href)}`, { headers: { accept: "application/json" }, cache: "no-store", signal: _timeoutSignal(40000) })
    .then((r) => (r && r.ok) ? r.json() : null).catch(() => null);
  _readMem.set(href, p);
  p.then((d) => { if (!d) _readMem.delete(href); });        // a failed/timed-out fetch retries on the next open
  return p;
}
// Warm the reader cache (and the edge) for the top few openable stories, so the auto-opened
// default and the first ↑/↓ clicks render instantly instead of waiting on a cold fetch.
function prefetchTopReads(n) {
  let warmed = 0;
  for (const row of document.querySelectorAll("#g-feed .g-feed-row")) {
    if (warmed >= (n || 3)) break;
    const it = _rowItem(row);
    if (it && it.ext && it.href && !_opensExternally(it.src, it.href) && !_readMem.has(it.href)) { _fetchRead(it.href); warmed++; }
  }
}
function _readNiceDate(iso) {
  const t = Date.parse(iso || ""); if (!t) return "";
  const d = new Date(t); return `${d.getDate()} ${MONTHS[d.getMonth()] || ""} ${d.getFullYear()}`;
}
function _readOpen(it) { return (it.ext && it.href) ? `<a class="g-read-open" href="${esc(it.href)}" target="_blank" rel="noopener noreferrer">Open original at ${esc(it.src || "source")}</a>` : ""; }
// The ⋯ overflow menu pinned top-right of the article: feedback controls that mute a
// story or a source (and a shortcut to review/undo). Rendered only when there's a real
// source/url to act on; the menu buttons carry the story fields as data-* so the
// delegated handler needs no closure over the current reader item.
function _readMenuHTML(it) {
  const src = it.src || "", url = it.href || "";
  if (!src && !url) return "";
  const a = (s) => esc(s || "");
  const data = ` data-url="${a(url)}" data-src="${a(src)}" data-title="${a(it.title)}" data-desk="${a(it.code)}"`;
  return `<div class="g-read-menu-wrap">`
    + `<button class="g-read-menu-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Story options" title="Story options">&#8943;</button>`
    + `<div class="g-read-menu" role="menu" hidden>`
    + (url ? `<button class="g-read-menu-item" type="button" role="menuitem" data-act="not-interested"${data}>Not interested in this story</button>` : "")
    + (src ? `<button class="g-read-menu-item" type="button" role="menuitem" data-act="mute-source"${data}>Mute source &middot; ${a(src)}</button>` : "")
    + `<button class="g-read-menu-item g-read-menu-manage" type="button" role="menuitem" data-act="manage">Manage muted&hellip;</button>`
    + `</div></div>`;
}
function _readShell(it, access, bodyHTML) {
  const meta = [it.src, it.when].filter(Boolean).map(esc).join(" · ");
  return `<article class="g-read-art">`
    + _readMenuHTML(it)
    + (it.code ? `<div class="g-read-kicker">${esc(it.code)}</div>` : "")
    + `<h1 class="g-read-title">${esc(it.title)}</h1>`
    + `<div class="g-read-meta">${meta}${meta && access ? " · " : ""}${access || ""}</div>`
    + bodyHTML + _readOpen(it) + `</article>`;
}
// Close any open reader ⋯ menu + reset its button state.
function _closeReadMenus() {
  document.querySelectorAll(".g-read-menu").forEach((m) => { m.hidden = true; });
  document.querySelectorAll(".g-read-menu-btn[aria-expanded='true']").forEach((b) => b.setAttribute("aria-expanded", "false"));
}
// After a mute, the just-hidden story mustn't stay open: re-render the feed, then on
// mobile close the reader, on desktop drop the selection and let syncReadDefault re-pick.
function _afterMute() {
  try { renderFeed(); } catch { /* ignore */ }
  const ov = document.getElementById("g-reader");
  if (ov && !ov.hidden) { closeMobileReader(); return; }
  const read = document.getElementById("g-read");
  if (read && read.offsetParent !== null) {
    _readPaneOpen = false; _readOpenKey = ""; _readDefaultOpened = false;
    try { localStorage.removeItem("m_read_last"); } catch { /* private mode */ }
    document.querySelectorAll("#g-feed .g-feed-row.is-reading").forEach((r) => r.classList.remove("is-reading"));
    try { syncReadDefault(); } catch { /* ignore */ }
  }
}
// The "Manage muted…" sheet — a self-contained modal listing muted sources + stories,
// each with an Unmute button. Created lazily on first open and re-rendered in place.
function openMutedManager() {
  _closeReadMenus();
  let ov = document.getElementById("g-muted-mgr");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "g-muted-mgr"; ov.className = "g-muted-mgr"; ov.hidden = true;
    document.body.appendChild(ov);
    ov.addEventListener("click", (e) => {
      if (e.target === ov || e.target.closest("[data-mm-close]")) { ov.hidden = true; return; }
      const un = e.target.closest("[data-mm-unmute]");
      if (un) { unmute(un.dataset.mmKind === "src" ? { src: un.dataset.mmVal } : { url: un.dataset.mmVal }); try { renderFeed(); } catch { /* ignore */ } openMutedManager(); }
    });
  }
  const m = _mutedSet();
  const srcs = [...m.srcs], urls = [...m.urls];
  const row = (label, kind, val) => `<li class="g-mm-row"><span class="g-mm-label">${esc(label)}</span><button class="g-mm-unmute" type="button" data-mm-unmute data-mm-kind="${kind}" data-mm-val="${esc(val)}">Unmute</button></li>`;
  const list = (srcs.length || urls.length)
    ? `<ul class="g-mm-list">`
      + srcs.map((s) => row("Source · " + s, "src", s)).join("")
      + urls.map((u) => row(m.titles[u] || u, "url", u)).join("")
      + `</ul>`
    : `<p class="g-mm-empty">Nothing muted yet. Use the ⋯ menu on a story to hide it or mute its source.</p>`;
  ov.innerHTML = `<div class="g-mm-card" role="dialog" aria-modal="true" aria-label="Muted sources and stories">`
    + `<div class="g-mm-head"><h2 class="g-mm-title">Muted</h2><button class="g-mm-x" type="button" data-mm-close aria-label="Close">&times;</button></div>`
    + list + `</div>`;
  ov.hidden = false;
}
// ---- Reading-pane entity auto-linking --------------------------------------
// Where a tracked entity (manager, hedge fund, law firm) is NAMED in the article
// body, link the mention to its Wire profile — a SOFT link via .g-ent (body prose with a
// faint link-coloured underline, not bold/blue). READING
// PANE ONLY (never the wire feed). Built once from the loaded rosters; rebuilt when
// loadDeskData refreshes them (it nulls _entRe/_entMap).
let _entRe = null, _entMap = null;
// Generic words that must never become a standalone entity link (they appear as the
// remainder after stripping an org suffix, or inside many names).
// Generic words that must never become a standalone entity link — org-suffix remainders
// AND common prose words that happen to be a single-word fund name/alias (e.g. "Sector"
// from "Sector Asset Management" must not light up the word "sector"). Full multi-word
// names are unaffected; this only blocks the single-token term.
const _ENT_STOP = new Set(["group", "capital", "partners", "management", "associates", "advisors", "advisers", "investments", "holdings", "global", "asset", "fund", "funds", "credit", "markets", "securities", "investment", "the", "and", "its", "new", "york", "london",
  "sector", "growth", "income", "value", "research", "opportunity", "opportunities", "advantage", "strategic", "premier", "select", "core", "prime", "special", "general", "alpha", "beta", "focus", "summit", "frontier", "horizon", "pioneer", "vantage", "venture", "ventures"]);
// Trim a trailing generic org suffix → a shorter but still-distinctive alias (so
// "Bridgewater Associates" also links a bare "Bridgewater"). Only kept when ≥5 chars
// and not itself a generic word.
function _entAlias(name) {
  const short = String(name).replace(/\s+(Investment Management|Asset Management|Capital Management|Global Management|Management|Associates|Advisers|Advisors|Partners|Capital|Credit|Investments|Holdings|Group|LLP|LLC|Inc\.?|Ltd\.?|plc)\.?$/i, "").trim();
  return (short && short !== name && short.length >= 5 && !_ENT_STOP.has(short.toLowerCase())) ? short : null;
}
function _buildEntIndex() {
  const byTerm = new Map();   // lowercased RAW term → href, or null when ambiguous (→ disabled)
  const add = (name, href) => {
    if (!name || !href) return;
    for (const term of [name, _entAlias(name)]) {
      if (!term || term.length < 4) continue;
      const k = term.toLowerCase();
      if (_ENT_STOP.has(k)) continue;
      if (byTerm.has(k)) { if (byTerm.get(k) !== href) byTerm.set(k, null); continue; }   // two entities, same term → drop
      byTerm.set(k, href);
    }
  };
  for (const m of (managers || [])) add(m.name, `/v2/profiles/#/manager/${encodeURIComponent(m.id)}`);
  for (const h of (hedgeFunds || [])) add(h.name, `/v2/profiles/#/hf/${encodeURIComponent(h.id)}`);
  for (const id of Object.keys(firmById || {})) add((firmById[id] || {}).name, `/v2/profiles/#/firm/${encodeURIComponent(id)}`);
  // The body text is ESCAPED before linking, so key the lookup + build the alternation
  // from the escaped form (a firm's "&" is "&amp;" in both). Longest first so the
  // longest name wins at any position.
  _entMap = new Map();
  const escTerms = [];
  for (const [kraw, href] of byTerm) {
    if (!href) continue;
    const e = esc(kraw);
    _entMap.set(e.toLowerCase(), href);
    escTerms.push(e);
  }
  escTerms.sort((a, b) => b.length - a.length);
  const alt = escTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  _entRe = escTerms.length ? new RegExp("(^|[^A-Za-z0-9&])(" + alt + ")(?![A-Za-z0-9])", "gi") : null;
}
// Linkify entity mentions in an already-ESCAPED block of body text.
function linkEntities(escHtml) {
  if (_entRe === null && _entMap === null) { try { _buildEntIndex(); } catch { _entMap = new Map(); _entRe = null; } }
  if (!_entRe) return escHtml;
  return String(escHtml).replace(_entRe, (full, pre, term) => {
    // Require the mention to be capitalised like a proper noun — a lower-case match is
    // the common word, not the entity ("the legal sector" ≠ Sector Asset Management).
    if (!/^[A-Z0-9]/.test(term)) return full;
    const href = _entMap.get(term.toLowerCase());
    return href ? pre + `<a class="g-ent" href="${href}">${term}</a>` : full;
  });
}
// An embedded tweet, resolved server-side (X API) into a card and rendered inline in the
// reading pane: author, the tweet text, its image/media if any, linking to the post. The
// whole card is a link to the tweet on X.
function _readEmbedHTML(c) {
  if (!c || !c.url) return "";
  const who = esc(c.name || ("@" + (c.handle || "")));
  const hh = esc(c.handle || "");
  const av = c.avatar ? `<img class="g-read-tw-av" src="${esc(c.avatar)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : `<span class="g-read-tw-av"></span>`;
  const txt = esc(c.text || "").replace(/\n/g, "<br>");
  const media = (c.media && c.media[0]) ? `<img class="g-read-tw-media" src="${esc(c.media[0])}" alt="" loading="lazy" referrerpolicy="no-referrer">` : "";
  return `<a class="g-read-tweet" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">`
    + `<span class="g-read-tw-head">${av}<span class="g-read-tw-who">${who}</span>${hh ? `<span class="g-read-tw-h">@${hh}</span>` : ""}</span>`
    + (txt ? `<span class="g-read-tw-txt">${txt}</span>` : "")
    + media
    + `<span class="g-read-tw-foot">View on X</span>`
    + `</a>`;
}
// Render a story into a reader container (the desktop side pane OR the mobile
// overlay). Openly-readable sources fetch /api/read and print the terminal body;
// subscriber sources (and curated/internal items) show a preview + link instead.
function _renderReaderInto(box, it, emptyMsg) {
  if (!box) return;
  if (!it || !it.title) { box.innerHTML = `<div class="g-read-empty">${esc(emptyMsg || "Select a story to read it here.")}</div>`; return; }
  const seq = ++_readSeq;
  if (!it.ext || !it.href || _opensExternally(it.src, it.href)) {
    const paywalled = _isPaywalled(it.src, it.href);
    const linksOut = !paywalled && _linksOut(it.src, it.href);
    const badge = paywalled ? `<span class="g-read-lock">🔒</span>`
      : linksOut ? `<span class="g-read-ext">opens at publisher</span>`
      : `<span class="g-read-free">● reading mode</span>`;
    const note = paywalled ? "This source needs a login — open the original below."
      : linksOut ? "This source blocks in-app fetch, so the full text can't render here — open the original below."
      : "Open the original below to read the full story.";
    box.innerHTML = _readShell(it, badge, `<div class="g-read-note">${note}</div>`);
    return;
  }
  box.innerHTML = _readShell(it, `<span class="g-read-free">● reading mode</span>`, `<div class="g-read-note g-read-loading">Fetching the full text — a few seconds for some sources…</div>`);
  // _fetchRead reuses an in-flight prefetch / a just-read body from the in-memory cache
  // (instant re-open), fetches the edge with cache:"no-store" (never the stale browser
  // copy), and aborts its own request at 25s. BELT AND BRACES: race it against a 26s UI
  // timeout so the pane NEVER stays stuck on the loading note even if the underlying
  // promise somehow never settles (a hung prefetch, an abort that didn't reject) — the
  // timeout resolves null → the "open the original" fallback renders. Fixes a reading pane
  // that could sit on "Fetching the full text…" indefinitely.
  const uiTimeout = (typeof window !== "undefined" && +window.__readUiTimeoutMs) || 42000;   // test-overridable; outwaits the fetch ceiling
  Promise.race([_fetchRead(it.href), new Promise((res) => setTimeout(() => res(null), uiTimeout))])
    .then((d) => {
      if (seq !== _readSeq) return;                                     // superseded by another click
      // Re-query the live pane: a repaint can swap the #g-readpane node out from under
      // the captured `box`, and rendering into a detached node would silently lose the
      // body (leaving "Fetching…" on screen forever). Fall back to the live element.
      if (!box.isConnected && box.id) { const live = document.getElementById(box.id); if (live) box = live; }
      if (!box.isConnected) return;
      if (d && d.accessible && Array.isArray(d.paragraphs) && d.paragraphs.length) {
        const bl = [d.byline, _readNiceDate(d.date)].filter(Boolean).map(esc).join(" · ");
        // Prefer the ordered `blocks` (body paragraphs + section headings) so headings
        // render in BOLD for easier reading; fall back to the plain `paragraphs` strings
        // (older cached responses / the proxy path carry no blocks).
        // Body paragraphs get entity auto-linking (managers / hedge funds / law firms →
        // their Wire profile); section headings stay plain (bold + underlined).
        const body = (Array.isArray(d.blocks) && d.blocks.length)
          ? d.blocks.map((b) => {
              if (b && b.embed) return _readEmbedHTML(b.embed);
              if (b && b.img) return `<figure class="g-read-fig"><img class="g-read-img" src="${esc(b.img)}" alt="${esc(b.alt || "")}" loading="lazy" referrerpolicy="no-referrer">${b.alt ? `<figcaption class="g-read-cap">${esc(b.alt)}</figcaption>` : ""}</figure>`;
              if (b && b.h) return `<h3 class="g-read-h">${esc(b.t)}</h3>`;
              return `<p class="g-read-p">${linkEntities(esc((b && b.t != null) ? b.t : b))}</p>`;
            }).join("")
          : d.paragraphs.map((p) => `<p class="g-read-p">${linkEntities(esc(p))}</p>`).join("");
        box.innerHTML = _readShell({ ...it, title: d.title || it.title }, `<span class="g-read-free">● reading mode</span>`,
          (bl ? `<div class="g-read-byline">${bl}</div>` : "") + body);
      } else {
        // Surface WHY it couldn't render: a `reason` (fetch-401 / not-html / …) means
        // the publisher blocked the server-side fetch; no reason means the fetch worked
        // but no readable body was extracted. Helps decide fetch-proxy vs padlock.
        const why = (d && d.reason) ? ` <span class="g-read-diag">(${esc(d.reason)})</span>` : "";
        box.innerHTML = _readShell(it, "",
          `<div class="g-read-note">Full text isn't available in-pane for this source — open the original below.${why}</div>`);
      }
    });
}
function renderReadPane(it) {
  const badge = document.getElementById("g-read-badge");
  if (badge) badge.textContent = (it && it.title) ? (it.src || "") : "";
  _renderReaderInto(document.getElementById("g-readpane"), it, "Select a story on the left to read it here.");
}
// Mobile: an in-app terminal reader that sits in the wire workspace. Openly-readable
// rows open here; subscriber (padlocked) rows keep their native "open at the
// publisher" tap.
function openMobileReader(it) {
  const ov = document.getElementById("g-reader"); if (!ov) return;
  const src = document.getElementById("g-reader-src"); if (src) src.textContent = it.src || "";
  ov.style.transition = ""; ov.style.transform = ""; ov.style.willChange = "";   // clear any leftover from a back-swipe
  ov.hidden = false;
  // The reader is a FULL-SCREEN modal: html.home-reading hides the search band + wire
  // tabs (CSS), and the overlay covers from the header (top:--wire-head-h, in CSS) down.
  // Nothing sticky sits above it, so there is no layer to rubber-band out of sync on iOS
  // — which is what clipped the search band under the header (the original bug) and, when
  // the document was briefly scroll-locked, pushed everything down into a gap (the lock
  // broke the band/tabs' sticky positioning). The old open-time pixel measurement of the
  // tab-bar bottom is gone too; the header-var anchor tracks the real header height live.
  document.documentElement.classList.add("home-reading");
  const main = document.querySelector(".g-main"); if (main) main.classList.add("g-reading");
  const body = document.getElementById("g-reader-body");
  if (body) body.scrollTop = 0;
  _renderReaderInto(body, it, "");
}
function closeMobileReader() {
  const ov = document.getElementById("g-reader");
  // Only CANCEL an in-flight read (bump _readSeq) when a MOBILE reader was actually
  // open. closeMobileReader is also called on every pane switch and on init (setWire),
  // including on DESKTOP where the mobile overlay is never shown — bumping _readSeq there
  // wrongly cancelled the DESKTOP side-pane's auto-open fetch, so its .then bailed on the
  // seq guard and the pane sat on "Fetching the full text…" forever. Gate the cancel on
  // the overlay having been open so a desktop pane switch never kills the reading pane.
  const wasOpen = !!(ov && !ov.hidden);
  if (ov) ov.hidden = true;
  document.documentElement.classList.remove("home-reading");   // restores the band + tabs
  const main = document.querySelector(".g-main"); if (main) main.classList.remove("g-reading");
  if (wasOpen) _readSeq++;                                 // cancel the in-flight MOBILE fetch only when one was open
}
// Give the fixed-height, internally-scrolling mobile Briefing box an exact height:
// the measured gap between the wire tabs and the bottom nav. In-flow (no fixed
// positioning) so it can't vanish; the body scrolls inside it. No-op on desktop.
// Narrow-desktop (iPad-landscape, 1201–1500px) Chart ⇄ X column swap — the FIRST
// Preact + Signals island (Phase 3 of the refactor). The five-column terminal squashes
// the two flexible centre columns, so in that band the Chart/Reading region and the X
// feed share one column, chosen by a small header toggle (see the CSS media query).
// ONE shared `_focusX` signal drives BOTH toggle instances (chart header + X header),
// so they stay in sync automatically — no manual sync loop or document-level click
// delegation. An effect reflects the choice onto the .g-layout class and redraws the
// hero. Defaults to Chart/Reading; at ≥1501px the .focus-x class is inert (CSS).
const _focusX = signal(false);
function FocusToggle() {
  const x = _focusX.value;
  const btn = (which, label) => {
    const on = (which === "x") === x;
    return h("button", { type: "button", class: "g-focus-b" + (on ? " is-on" : ""),
      "data-focus": which, "aria-pressed": on ? "true" : "false",
      onClick: () => { _focusX.value = (which === "x"); } }, label);
  };
  return h("span", { class: "g-focus-tog", role: "group", "aria-label": "Show the chart/reading column or the X feed" },
    btn("chart", "Chart"), btn("x", "X"));
}
function initFocusToggle() {
  const mounts = document.querySelectorAll("[data-focus-mount]");
  if (!mounts.length) return;
  mounts.forEach((m) => mount(m, FocusToggle));
  // Reflect the signal onto the layout, and redraw the hero when switching back to
  // Chart (its SVG was display:none). Runs once now, then on every toggle.
  effect(() => {
    const layout = document.querySelector(".g-layout");
    if (layout) layout.classList.toggle("focus-x", _focusX.value);
    // Redraw the hero once the Chart column is shown again (its SVG had no laid-out
    // geometry while display:none, so the end-label de-collision needs a re-run). Deferred
    // to a microtask so renderHero's signal reads are NOT tracked by this focus effect.
    if (!_focusX.value) queueMicrotask(() => { try { renderHero(); } catch { /* hero may not have booted */ } });
  });
}
function _placeBriefPane() {
  // The Briefing pane is now anchored purely in CSS (a flex column with a min-height in
  // svh; the page scrolls for a long brief — see home.css). There is NO JS pixel sizing:
  // the old getBoundingClientRect/innerHeight measurement went stale on every iOS URL-bar
  // change and left the pane blank or the footer stranded mid-screen. All this does now
  // is clear any inline height/maxHeight a previous build may have left, so CSS governs.
  const hb = document.getElementById("g-hbrief");
  if (!hb) return;
  if (hb.style.height) hb.style.height = "";
  if (hb.style.maxHeight) hb.style.maxHeight = "";
}
// Is this feed row openable in the reading pane WITHOUT a login — i.e. an external
// story from a non-subscriber source, whose full text the reader service can print?
// (Subscriber/padlocked rows and internal links only ever show a preview + link.)
function _rowOpensInPane(row) {
  const it = _rowItem(row);
  return !!(it.ext && it.href && !_opensExternally(it.src, it.href));
}
// Auto-open a story ONCE per page load: on a fresh load / reload, restore the reader's
// LAST-SELECTED story (localStorage m_read_last) if it is still in the feed, so the pane
// keeps their choice across a reload; otherwise default to the first openable story so the
// pane is never empty on open. The flag resets on each relaunch (module re-import). An
// in-session re-render (a lane switch, the live/background refresh) does NOT re-jump the
// pane, and the open story's row stays SHADED across the repaint (_markReadingRow re-applies
// .is-reading by the persisted selection key) as long as that story is still in the feed. R3a.
let _readDefaultOpened = false;
// The saved selection to restore on this load (captured ONCE at module load, BEFORE any
// fallback open can overwrite m_read_last). The feed fills in passes — home-data first,
// then /api/feed news — so the saved story's row may not exist on the first render; we
// must not lock the auto-open to a fallback and lose the restore (R3a / observed flake).
let _restorePending = (() => { try { return localStorage.getItem("m_read_last") || null; } catch { return null; } })();
let _userPickedRead = false;   // set once the reader opens a story the user actually tapped
function syncReadDefault() {
  const read = document.getElementById("g-read");
  if (!read || read.offsetParent === null) return;                          // mobile / hidden
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  if (!rows.length) return;                                                 // feed not populated yet — retry next render
  // Restore the saved story as soon as its row is in the feed — even if an earlier render
  // had to open a fallback while the feed was still filling. Yield the restore once the
  // user has picked their own story (don't yank the pane out from under them).
  if (_restorePending && !_userPickedRead) {
    const saved = rows.find((r) => _rowKey(r) === _restorePending);
    if (saved) { openInReadPane(saved); try { saved.scrollIntoView({ block: "nearest" }); } catch { /* older engines */ } _restorePending = null; _readDefaultOpened = true; return; }
  }
  if (document.querySelector("#g-feed .g-feed-row.is-reading")) return;     // a row is already highlighted — keep it
  if (_readDefaultOpened) return;                                           // already auto-opened this load — don't re-jump
  // Saved story not in the feed yet → open the first openable story so the pane is never
  // empty (rows are newest-first; fall back to the very first if all locked). Only LOCK the
  // auto-open when there is no pending restore — otherwise keep retrying above as later
  // renders add rows, so the saved story still wins when it finally loads.
  const pick = rows.find(_rowOpensInPane) || rows[0];
  if (pick) {
    openInReadPane(pick);
    try { pick.scrollIntoView({ block: "nearest" }); } catch { /* older engines */ }
    if (!_restorePending) _readDefaultOpened = true;
  }
}
function ensureReadWired() {
  const feed = document.getElementById("g-feed");
  if (!feed || feed.dataset.readWired) return;
  feed.dataset.readWired = "1";
  feed.addEventListener("click", (e) => {
    if (e.target.closest("[data-follow], .g-mw-exp")) return;               // in-row controls
    const row = e.target.closest(".g-feed-row"); if (!row) return;          // (source name included → opens in-pane)
    _userPickedRead = true;                                                 // a deliberate pick — don't let a late restore override it
    const read = document.getElementById("g-read");
    if (read && read.offsetParent !== null) {                               // desktop → side pane
      e.preventDefault(); e.stopPropagation();
      openInReadPane(row);
      return;
    }
    // Mobile: openly-readable AND bot-walled link-outs (e.g. Reuters) open in the in-app
    // reader — the link-outs show the headline + an "Open original" link in-pane rather
    // than bouncing straight out. Only subscriber (padlocked) rows and internal links
    // keep their native tap (open at the source).
    const it = _rowItem(row);
    if (it.ext && it.href && !_isPaywalled(it.src, it.href)) {
      e.preventDefault(); e.stopPropagation();
      openMobileReader(it);
    }
  });
  // Reader ⋯ overflow menu — one delegated handler on the document (the menu lives inside
  // .g-read-art, which is re-rendered on every reader paint in BOTH the desktop pane and
  // the mobile overlay, so per-button listeners would leak). Toggle on the ⋯ button; act
  // on a menu item from its data-*; any other click closes an open menu. Also kick off the
  // one-shot cross-device mute sync now the reader is live.
  if (!document.body.dataset.readMenuWired) {
    document.body.dataset.readMenuWired = "1";
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".g-read-menu-btn");
      if (btn) {
        e.preventDefault(); e.stopPropagation();
        const menu = btn.parentElement && btn.parentElement.querySelector(".g-read-menu");
        const wasOpen = !!(menu && menu.hidden === false);
        _closeReadMenus();
        if (menu && !wasOpen) { menu.hidden = false; btn.setAttribute("aria-expanded", "true"); }
        return;
      }
      const item = e.target.closest(".g-read-menu-item");
      if (item) {
        e.preventDefault(); e.stopPropagation();
        const act = item.dataset.act;
        if (act === "manage") { openMutedManager(); return; }
        const it = { href: item.dataset.url || "", src: item.dataset.src || "", title: item.dataset.title || "", code: item.dataset.desk || "" };
        if (act === "mute-source") muteSource(it.src, it);
        else if (act === "not-interested") notInterested(it);
        _afterMute();
        return;
      }
      if (!e.target.closest(".g-read-menu")) _closeReadMenus();
    });
  }
  syncMutesFromServer();
  // ↑/↓ arrow keys cycle through the feed, opening each story in the reading pane
  // (desktop only — mobile has no side pane). Wraps top↔bottom; only VISIBLE rows are
  // cycled (filters don't trap the cursor), and arrows are ignored while typing in a
  // field so search keeps its native caret movement. Wired once, on the document.
  if (!document.body.dataset.feedArrowsWired) {
    document.body.dataset.feedArrowsWired = "1";
    document.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const read = document.getElementById("g-read");
      if (!read || read.offsetParent === null) return;                      // mobile / no side pane
      if (e.target && e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      const feedEl = document.getElementById("g-feed"); if (!feedEl) return;
      const rows = [...feedEl.querySelectorAll(".g-feed-row")].filter((r) => r.offsetParent !== null);
      if (!rows.length) return;
      e.preventDefault();
      const cur = feedEl.querySelector(".g-feed-row.is-reading");
      const i = cur ? rows.indexOf(cur) : -1;
      // Clamp at the ends — no wrap. At the top, ArrowUp does nothing; at the bottom,
      // ArrowDown does nothing. With no selection yet, either arrow opens the first row.
      const j = e.key === "ArrowDown" ? (i < 0 ? 0 : Math.min(i + 1, rows.length - 1))
                                      : (i < 0 ? 0 : Math.max(i - 1, 0));
      if (j === i) return;                                       // already at the end — do nothing
      const next = rows[j];
      if (next) { openInReadPane(next); try { next.focus({ preventScroll: true }); } catch { next.focus(); } next.scrollIntoView({ block: "nearest" }); }
    });
  }
  // The mobile reader's Back control (and a tap on the backdrop) closes it.
  const ov = document.getElementById("g-reader");
  if (ov && !ov.dataset.wired) {
    ov.dataset.wired = "1";
    ov.addEventListener("click", (e) => { if (e.target.closest("#g-reader-back") || e.target === ov) closeMobileReader(); });
    // iOS-style INTERACTIVE left-edge "back": a drag that STARTS at the left edge drags the
    // whole reader with the finger (translateX tracks 1:1); on release, past ~a third of the
    // width — or a quick flick — it slides the rest of the way out and closes, otherwise it
    // springs back. Horizontal-only: a vertical move hands the gesture straight back to the
    // body's scroll (we only preventDefault once the drag is committed horizontal, and the
    // touchmove bails on its first line for every touch that didn't start at the edge).
    let sx = 0, sy = 0, lastX = 0, lastT = 0, vel = 0, w = 1;
    let tracking = false, dragging = false;
    const EDGE = 30;                                      // left start-zone (px)
    const settle = () => { ov.style.transition = ""; ov.style.transform = ""; ov.style.willChange = ""; };
    ov.addEventListener("touchstart", (e) => {
      if (ov.hidden) { tracking = false; return; }
      const t = e.touches && e.touches[0];
      if (!t || t.clientX > EDGE) { tracking = false; return; }
      tracking = true; dragging = false;
      sx = lastX = t.clientX; sy = t.clientY; lastT = e.timeStamp || Date.now(); vel = 0;
      w = ov.getBoundingClientRect().width || window.innerWidth || 1;
    }, { passive: true });
    ov.addEventListener("touchmove", (e) => {
      if (!tracking) return;
      const t = e.touches && e.touches[0]; if (!t) return;
      const dx = t.clientX - sx, dy = t.clientY - sy;
      if (!dragging) {
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { tracking = false; return; }   // vertical → leave the scroll alone
        if (dx > 8 && dx >= Math.abs(dy)) { dragging = true; ov.style.transition = "none"; ov.style.willChange = "transform"; }
        else return;
      }
      e.preventDefault();                                 // own the gesture (non-passive listener below)
      const now = e.timeStamp || Date.now();
      if (now > lastT) { vel = (t.clientX - lastX) / (now - lastT); lastX = t.clientX; lastT = now; }
      ov.style.transform = "translate3d(" + Math.max(0, dx) + "px,0,0)";
    }, { passive: false });
    const end = () => {
      if (!tracking) { return; }
      const wasDragging = dragging; tracking = false; dragging = false;
      if (!wasDragging) return;
      const m = /translate3d\(([-0-9.]+)px/.exec(ov.style.transform || "");
      const x = m ? parseFloat(m[1]) : 0;
      const complete = x > w * 0.35 || (x > 48 && vel > 0.45);   // far enough, or a quick flick
      ov.style.transition = "transform .22s cubic-bezier(.2,.7,.3,1)";
      ov.style.transform = complete ? "translate3d(100%,0,0)" : "translate3d(0,0,0)";
      let fired = false;
      const finish = () => { if (fired) return; fired = true; ov.removeEventListener("transitionend", finish); if (complete) closeMobileReader(); settle(); };
      ov.addEventListener("transitionend", finish);
      setTimeout(finish, 280);                            // fallback if transitionend doesn't fire
    };
    ov.addEventListener("touchend", end, { passive: true });
    ov.addEventListener("touchcancel", end, { passive: true });
  }
}
// ---- Macro snapshot (right sidebar) ----------------------------------------
// A compact read of the three Macro views — policy rate, cycle position and
// bubble risk — filling the space below the markets/rates bands. Each block
// deep-links into the Macro app. Values mirror macro/js/content.js and the
// bubble-composite / band logic in macro/js/app.js.
function renderMacroSnapshot() {
  const el = document.getElementById("g-macro-snap");
  if (!el || !CYCLE || !BUBBLE || !OUTLOOK) return;
  // One 3-column grid (country · rate · stance) shared by both rows so the rate
  // and stance columns line up even though the two rates differ in width.
  // The Forecast column shows ONLY the one-word call for the next decision (the
  // action before the "·", e.g. "Hold") — the trending mood keyword (hawkish /
  // dovish / neutral) is deliberately dropped here; the full detail lives on the
  // linked Macro › Policy Rate page (the whole block is a link to it).
  const pol = (cc, o) => {
    const s = String(o.stance || "");
    // Forecast = the one-word call before the "·". Drop a leading action verb when it is
    // immediately followed by a SIGNED size (e.g. "Hike +25bp" → "+25bp") — the sign
    // already carries the direction; a bare "Hold" (no signed figure) is left as-is.
    const fc = (s.split("·")[0] || s).trim().replace(/^(?:hike|cut|raise|lower|rise)\s+(?=[+\-−])/i, "");
    // The "Next" column is a bare meeting date — strip any parenthetical outcome
    // note (e.g. "(resolved 17 Sep: hold)") a refresh may have appended, so a stale
    // annotation can never spill across into the Forecast column.
    const nx = String(o.next || "").replace(/\s*\((?:resolved|held?|decided)\b[^)]*\)/gi, "").trim();
    return `<span class="g-snap-cc">${cc}</span>`
      + `<span class="g-snap-pv">${esc(o.rate)}</span>`
      + `<span class="g-snap-nx">${esc(nx)}</span>`
      + `<span class="g-snap-ps"><span class="g-snap-fc">${esc(fc)}</span></span>`;
  };
  // Meter row: the scale end-labels sit inline either side of the gauge; the
  // per-country / composite detail is tucked into the row's hover tooltip.
  const meter = (lo, hi, gauge, detail) =>
    `<div class="g-snap-meter"${detail ? ` title="${esc(detail)}"` : ""}>`
      + `<span class="g-snap-end">${lo}</span>${gauge}<span class="g-snap-end">${hi}</span></div>`;
  // Policy rate only — the cycle & bubble gauges were moved off this rail panel.
  el.innerHTML =
    `<a class="g-snap-blk" href="/v2/dashboard/macro" data-godash="macro">`
      + `<div class="g-snap-pol">`
        + `<span class="g-snap-t g-snap-polh">Policy rate</span>`
        + `<span class="g-snap-colh g-snap-colh-c">Next</span>`
        + `<span class="g-snap-colh g-snap-colh-r">Forecast</span>`
        + pol("US", OUTLOOK.us) + pol("UK", OUTLOOK.uk)
      + `</div>`
    + `</a>`;
}

// ---- US & UK economic indicators (sidebar) ---------------------------------
// The same live series the Macro dashboard shows (Base rate, 2-year yield, Core
// inflation, Services PMI, Wage growth, Unemployment) fetched from /api/macro and
// rendered as a compact 3×2 grid per country — value + change + source, no chart.
const monY = (iso) => { const m = /^(\d{4})-(\d{2})/.exec(iso || ""); return m ? `${MONTHS[+m[2] - 1]} ${m[1]}` : ""; };
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
// Pulls /api/macro once and drives the Home Yield-curve panel; if the Economic-
// indicators panel is present it fills that too. (Indicators were moved to the
// Macro dashboard, so on Home only the curve consumes this now — but the fetch
// stays here since the curve reads the same series.)
function initMacroIndicators() {
  const el = document.getElementById("g-indicators");
  const curve = document.getElementById("g-curve");
  if (!el && !curve) return;
  const fail = () => { if (el) el.innerHTML = '<div class="g-loading">Indicators unavailable right now.</div>'; };
  fetch("/api/macro")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d) => {
      const series = (d && d.series) || [];
      if (!series.length) return fail();
      _macroSeries = series;
      renderYieldCurve();
      if (el) {
        const rowsFor = (c) => IND_ORDER.map((k) => series.find((s) => s.country === c && s.key === k)).filter(Boolean);
        const block = (label, c) => { const r = rowsFor(c); return r.length ? `<div class="rate-sub">${label}</div>${r.map(indTile).join("")}` : ""; };
        const html = block("United States", "US") + block("United Kingdom", "UK");
        if (html) el.innerHTML = html;
      }
    })
    .catch(fail);
}
const setHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

// Monday–Sunday ISO bounds of the week containing `now` (local time) — the window
// the "This week's earnings" rail is pinned to, so a committed earnings week that
// hasn't been rolled forward can't keep showing a weeks-old item.
function _thisWeekRange(now = new Date()) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dow = (d.getDay() + 6) % 7;                 // Mon=0 … Sun=6
  const mon = new Date(d); mon.setDate(d.getDate() - dow);
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  const iso = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
  return { mon: iso(mon), sun: iso(sun) };
}
// ---- This week's corporate earnings (right sidebar) ------------------------
// From EARNINGS.weeks[0] (macro/js/content.js): per company — date, pre/post-
// market timing, the consensus forecast (Est) and, once reported, the outcome
// (Act) with the share-price reaction. Every figure is curated + sourced there.
function renderEarnings() {
  const box = document.getElementById("g-earn"); if (!box) return;
  const wk = EARNINGS && EARNINGS.weeks && EARNINGS.weeks[0];
  const all = [];
  ((wk && wk.days) || []).forEach((d) => (d.rows || []).forEach((r) => all.push({ ...r, date: r.date || d.date })));
  // Only THIS week — drop any row outside the current Mon–Sun window so a stale
  // (un-rolled) committed week falls through to the "none this week" state rather
  // than pinning a weeks-old item.
  const _wk = _thisWeekRange();
  const rows = all.filter((r) => { const d = String(r.date || "").slice(0, 10); return d && d >= _wk.mon && d <= _wk.sun; });
  if (!rows.length) { box.innerHTML = `<div class="g-earn-empty">No earnings scheduled this week.</div>`; return; }
  rows.sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.when || "").localeCompare(String(b.when || "")));
  const dshort = (d) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ""); return m ? `${+m[3]} ${MONTHS[+m[2] - 1]}` : (d || ""); };
  const whenTag = (w) => (/after|post|close/i.test(w || "") ? "Post" : /before|pre|open/i.test(w || "") ? "Pre" : (w || ""));
  const clean = (s) => String(s || "").split(" (")[0].replace(/\s*adjusted\b/i, "").replace(/\s{2,}/g, " ").trim();
  const pxOf = (s) => { const m = /([+-]\d+(?:\.\d+)?%)/.exec(s || ""); return m ? m[1] : ""; };
  const row = (r) => {
    const reported = !!(r.actEps || r.actRev);
    const px = pxOf(r.px), pxc = px.startsWith("+") ? "up" : px.startsWith("-") ? "down" : "";
    const est = [clean(r.estEps), clean(r.estRev)].filter(Boolean).join(" · ");
    const act = [clean(r.actEps), clean(r.actRev)].filter(Boolean).join(" · ");
    const tail = px ? `<span class="g-earn-px ${pxc}">${esc(px)}</span>` : (reported ? "" : `<span class="g-earn-await">awaiting</span>`);
    return `<div class="g-earn-row">`
      + `<div class="g-earn-r1"><span class="g-earn-date">${esc(dshort(r.date))}</span>`
      + `<span class="g-earn-tkr">${esc(r.t || r.n || "")}</span>`
      + (r.n && r.t ? `<span class="g-earn-nm">${esc(r.n)}</span>` : "")
      + (whenTag(r.when) ? `<span class="g-earn-when">${esc(whenTag(r.when))}</span>` : "")
      + tail + `</div>`
      + (est ? `<div class="g-earn-l"><span class="g-earn-k">Est</span> ${esc(est)}</div>` : "")
      + (reported && act ? `<div class="g-earn-l g-earn-act"><span class="g-earn-k">Act</span> ${esc(act)}</div>` : "")
      + `</div>`;
  };
  box.innerHTML = rows.map(row).join("");
  // Fit the pane to its items, capped at 5 companies — beyond that the body
  // scrolls. Measured from the 6th row so the cap lands exactly on 5 rows.
  const body = box.parentElement;
  const kids = box.querySelectorAll(".g-earn-row");
  if (body) {
    if (kids.length > 5) {
      let cap = kids[5].getBoundingClientRect().top - box.getBoundingClientRect().top;
      if (!(cap > 0)) cap = 5 * 58;               // fallback if not yet laid out
      body.style.maxHeight = Math.round(cap) + "px";
    } else {
      body.style.maxHeight = "";
    }
  }
}

// ---- Key rates & credit spreads (ported from Credit) -----------------------
function fmtRate(v, unit) {
  if (v == null) return "—";
  return unit === "bp" ? `${Math.round(v * 100)} bp` : `${v.toFixed(2)}%`;
}
// A compact ~1-month trend sparkline for a rail row — an inline SVG polyline drawn
// from the row's OWN daily-close history (the feeds already carry it; no fabricated
// data, R7). No axes, no fill, one muted tone. The cell ALWAYS renders (empty when a
// row carries too little history) so the value + change columns stay aligned down
// the panel. Desktop terminal only (the CSS gates it to .tui).
function sparkCell(hist) {
  const h = (Array.isArray(hist) ? hist : []).filter((v) => Number.isFinite(v));
  if (h.length < 3) return `<span class="rate-spark" aria-hidden="true"></span>`;
  const n = h.length, min = Math.min(...h), max = Math.max(...h), rng = (max - min) || 1;
  const W = 100, H = 28, pad = 3;
  const pts = h.map((v, i) => `${((i / (n - 1)) * W).toFixed(1)},${(H - pad - ((v - min) / rng) * (H - 2 * pad)).toFixed(1)}`).join(" ");
  // Tint the line by its NET move over the whole window: up over the period reads
  // green, down reads red, dead-flat stays muted.
  const net = h[n - 1] - h[0];
  const dir = net > 0 ? "up" : net < 0 ? "down" : "flat";
  return `<span class="rate-spark ${dir}" aria-hidden="true"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><polyline points="${pts}"/></svg></span>`;
}
// Element-wise difference of two daily histories, tail-aligned to the shorter — for
// the DERIVED rows' sparklines (HY−IG, CCC−HY, 2s10s). Both inputs come from the
// same daily source, so index alignment is date alignment. [] if either is too short.
function diffHist(a, b) {
  const A = (Array.isArray(a) ? a : []).filter((v) => Number.isFinite(v));
  const B = (Array.isArray(b) ? b : []).filter((v) => Number.isFinite(v));
  const k = Math.min(A.length, B.length);
  if (k < 3) return [];
  const oa = A.length - k, ob = B.length - k, out = [];
  for (let i = 0; i < k; i++) out.push(A[oa + i] - B[ob + i]);
  return out;
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
  return `<${tag} class="rate-tile"${attrs}${title}><span class="rate-label">${esc(x.label)}</span>${sparkCell(x.history)}<span class="rate-val">${val}</span>${chg}</${tag}>`;
}
// Last-good market/rates payloads, persisted so a reload (or a failed refetch)
// shows the most recent numbers immediately instead of a "Loading…" placeholder.
function readCache(key) { try { const s = localStorage.getItem("m_glance_" + key); return s ? JSON.parse(s) : null; } catch { return null; } }
function writeCache(key, d) { try { localStorage.setItem("m_glance_" + key, JSON.stringify(d)); } catch { /* quota/private mode — skip */ } }
function renderRates(el, d) {
  const rowsData = (d && d.rates) || [];
  if (!rowsData.length) return false;
  _rateRows = rowsData;
  // The "Key rates" panel is the benchmark yields ONLY (EURIBOR/SONIA/SOFR/US 10Y);
  // the OAS credit spreads move to their own "Spreads" panel (renderSpreads).
  el.innerHTML = rowsData.filter((x) => !/OAS/i.test(x.label) && x.label !== "US 2Y" && x.label !== "US 30Y").map(ratesTile).join("");
  if (!_briefLeads.rates) setGlance("gl-rates", _pulse.rates ? esc(_pulse.rates) : ratesOneLiner(rowsData));
  setGlTickers("rates", rateTickers(rowsData));
  renderTicker(); renderMovers(); renderSpreads(); renderVolRisk(); renderYieldCurve(); renderBriefStrip();
  return true;
}
function initRates() {
  const el = document.getElementById("g-rates");
  if (!el) return;
  // Render the last-good numbers instantly so a slow/failed refetch never drops
  // the tiles back to a "Loading…/unavailable" placeholder — the values just sit
  // until fresh ones land.
  renderRates(el, readCache("rates"));
  fetch("/api/rates?v=10")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d) => { if (renderRates(el, d)) writeCache("rates", d); })
    .catch(() => { if (!el.querySelector(".rate-tile") && !_pulse.rates) { el.innerHTML = '<span class="g-loading">Market rates unavailable right now.</span>'; if (!_briefLeads.rates) setGlance("gl-rates", "Rates data unavailable right now."); } });
}
// ---- Strait of Hormuz vessel transits (IMF PortWatch) ----------------------
// Two separate daily counts — ALL vessels (n_total) and OIL TANKERS (n_tanker) —
// each vs its own trailing ~30-day average, so the tile shows whether traffic
// through the strait is running above or below normal. Real data only (from
// /api/hormuz); if the feed can't be reached the tile says so, never a guess.
function renderHormuz(el, d) {
  if (!el || !d || (!d.total && !d.tanker)) return false;
  const dm = /^(\d{4})-(\d{2})-(\d{2})/.exec(d.date || "");
  const dstr = dm ? `${+dm[3]} ${MONTHS[+dm[2] - 1]}` : "";
  const tile = (label, s, what) => {
    if (!s || s.latest == null) return "";
    const avg = s.avg30, w = s.days || 30;
    const dir = avg == null ? "flat" : s.latest > avg ? "up" : s.latest < avg ? "down" : "flat";
    const delta = avg == null ? null : Math.abs(s.latest - avg);
    return riskTile({ label, val: String(s.latest), chg: delta == null ? null : `${delta} vs avg`, dir,
      href: "https://portwatch.imf.org/pages/chokepoint6",
      title: `${what}${dstr ? " on " + dstr : ""} vs the ${w}-day average (${avg}) — IMF PortWatch, AIS-derived` });
  };
  const rows = [tile("Transits", d.total, "All vessel transits"), tile("Tankers", d.tanker, "Oil-tanker transits")].filter(Boolean);
  if (!rows.length) return false;
  el.innerHTML = rows.join("");
  return true;
}
function initHormuz() {
  const el = document.getElementById("g-hormuz");
  if (!el) return;
  renderHormuz(el, readCache("hormuz"));
  fetch("/api/hormuz", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d) => { if (renderHormuz(el, d)) writeCache("hormuz", d); else if (!el.querySelector(".rate-tile")) el.innerHTML = '<span class="g-loading">Transit data unavailable right now.</span>'; })
    .catch(() => { if (!el.querySelector(".rate-tile")) el.innerHTML = '<span class="g-loading">Transit data unavailable right now.</span>'; });
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
// Session schedule for a tile: its label's mapping, or an explicit `mktType`
// hint carried by rows without a fixed label (e.g. the Top-movers ETFs, which
// are all US-listed → us_equity).
const mktTypeOf = (x) => MKT_TYPE[x.label] || x.mktType || null;
function isMarketOpen(x) {
  if (x.marketState) return x.marketState === "REGULAR";
  const type = mktTypeOf(x);
  return type ? marketOpen(type) : false;
}
function marketDot(x) {
  let tip;
  if (x.marketState) {                       // authoritative — from Yahoo
    tip = MKT_STATE_LABEL[x.marketState] || (x.marketState === "REGULAR" ? "Market open" : "Market closed");
  } else {                                    // fallback — clock-based schedule
    if (!mktTypeOf(x)) return "";
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
  return `<${tag} class="rate-tile mkt-tile"${attrs}${title}><span class="rate-label">${esc(x.label)}${marketDot(x)}</span>${sparkCell(x.history)}<span class="rate-val">${val}</span>${chg}</${tag}>`;
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
  renderTicker(); renderMovers(); renderVolRisk(); renderBriefStrip();
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
  return ` style="background:color-mix(in srgb, var(--t-${chg > 0 ? "up" : "down"}) ${(a * 100).toFixed(1)}%, transparent)"`;
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
    // All movers are US-listed ETFs → carry a us_equity session hint so the
    // open/closed dot shows even when Yahoo omits marketState.
    (_mktEtf || []).forEach((x) => pushPct(x.label, { ...x, mktType: "us_equity" }, false));
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
// Prediction markets (right rail) — finance & finance-adjacent implied odds from
// /api/predict (Polymarket), grouped by type (Fed / Economy / Crypto / …) with a
// filter, refreshed on the live cycle. Rows reuse the deal-flow row style.
const PRED_TYPE_ORDER = ["Fed & rates", "Economy", "Equities", "Crypto", "Trump", "Geopolitics", "Elections", "Other"];
// Three top-level chips group the fine-grained types: Macro (Fed/rates, inflation),
// Politics (Trump, geopolitics, elections) and Finance (equities/IPOs, crypto).
// Unmapped types (the finance-adjacent "Other" bucket) fall to Macro.
// "Top Movers" is a cross-cutting view (default); the other three are the type
// super-groups. Every market already passes the finance/finance-adjacent gate
// server-side, so the mover set stays within the app's universe (no sport/culture).
const PRED_SUPERS = ["Largest", "Top Movers", "Macro", "Politics", "Finance"];
const PRED_SUPER_TYPES = {
  Macro: ["Fed & rates", "Economy", "Other"],
  Politics: ["Trump", "Geopolitics", "Elections"],
  Finance: ["Equities", "Crypto"],
};
const PRED_SUPER_OF = {};
for (const s of ["Macro", "Politics", "Finance"]) for (const t of PRED_SUPER_TYPES[s]) PRED_SUPER_OF[t] = s;
const predSuperOf = (type) => PRED_SUPER_OF[type] || "Macro";
// Movers = liquid markets whose implied odds actually MOVED today, ranked biggest
// daily-odds INCREASE → biggest DECREASE (unchanged markets are excluded here).
function predMovers(list) {
  return list.filter((m) => (m.vol || 0) >= 10000 && typeof m.chg === "number" && isFinite(m.chg) && m.chg !== 0)
    .sort((a, b) => (b.chg - a.chg) || ((b.vol || 0) - (a.vol || 0)))
    .slice(0, 40);
}
// Prediction markets — a Preact + Signals island. `_predList` (data) and the two
// view selectors (`_predFilter`, `_predMoveDir`) are signals, so the <Predict>
// component re-renders itself whenever any of them changes — no manual innerHTML
// rebuild or click-handler re-attachment. Preact escapes text, so no esc().
const _predList = signal(null), _predFilter = signal("Largest"), _predMoveDir = signal("up");
// Market size = total money wagered (Polymarket USD volume), compacted.
function predVol(n) {
  n = +n || 0;
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
  return "$" + n;
}
function PredRow(m) {
  const yes = typeof m.yes === "number" ? m.yes + "%" : "—";
  const meta = [m.venue, m.vol ? predVol(m.vol) : "", m.end ? fmt(String(m.end).slice(0, 10)) : ""].filter(Boolean).join(" · ");
  // Daily change in implied odds (percentage points), column-aligned with the pane above.
  let chg;
  if (typeof m.chg === "number" && isFinite(m.chg)) {
    const c = +m.chg.toFixed(1);
    const dir = c > 0 ? "up" : c < 0 ? "down" : "flat";
    chg = h("span", { class: "g-pred-chg " + dir }, (c > 0 ? "▲" : c < 0 ? "▼" : "·") + " " + Math.abs(c).toFixed(1));
  } else {
    chg = h("span", { class: "g-pred-chg flat" }, "·");
  }
  return h("a", { class: "tui-li g-pred-row", href: m.url || "#", target: "_blank", rel: "noopener noreferrer" },
    h("span", { class: "g-pred-main" }, h("span", { class: "tui-li-t" }, m.q), h("span", { class: "tui-li-m" }, meta)),
    h("span", { class: "g-pred-nums" }, h("span", { class: "g-pred-odds" }, yes), chg));
}
function Predict() {
  const list = _predList.value || [];
  if (!list.length) return h("div", { class: "g-empty" }, "No prediction markets right now.");
  // Bucket into the 3 super-groups, keeping the fine-grained type sub-sections.
  const supers = {}; PRED_SUPERS.forEach((s) => (supers[s] = {}));
  for (const m of list) { const t = m.type || "Other"; (supers[predSuperOf(t)][t] = supers[predSuperOf(t)][t] || []).push(m); }
  const movers = predMovers(list);
  const largest = list.slice().sort((a, b) => (b.vol || 0) - (a.vol || 0));
  const has = (s) => s === "Top Movers" ? movers.length > 0 : s === "Largest" ? list.length > 0 : Object.keys(supers[s]).length > 0;
  let filter = _predFilter.value; if (!has(filter)) filter = PRED_SUPERS.find(has) || "Macro";
  const chips = h("div", { class: "g-pred-filter", role: "tablist" },
    PRED_SUPERS.map((s) => h("button", { type: "button", class: "g-pred-fchip" + (filter === s ? " on" : ""),
      "data-f": s, disabled: !has(s), onClick: () => { if (has(s)) _predFilter.value = s; } }, s)));
  let body;
  if (filter === "Top Movers") {
    // Two views only: Up = increases (largest→smallest); Down = decreases (largest magnitude→smallest).
    const dir = _predMoveDir.value;
    const rows = dir === "down" ? movers.filter((m) => m.chg < 0).sort((a, b) => a.chg - b.chg) : movers.filter((m) => m.chg > 0);
    const tgl = h("span", { class: "g-pf-tgl-wrap" },
      h("button", { type: "button", class: "g-pred-dir" + (dir === "up" ? " on" : ""), "data-dir": "up", onClick: () => { _predMoveDir.value = "up"; } }, "Up"),
      h("button", { type: "button", class: "g-pred-dir" + (dir === "down" ? " on" : ""), "data-dir": "down", onClick: () => { _predMoveDir.value = "down"; } }, "Down"));
    body = [h("div", { class: "g-pred-sec g-pred-sec-tgl" }, h("span", null, "Top movers"), tgl), ...rows.map(PredRow)];
  } else if (filter === "Largest") {
    body = [h("div", { class: "g-pred-sec" }, "Largest markets"), ...largest.map(PredRow)];
  } else {
    const active = supers[filter] || {};
    const subTypes = PRED_TYPE_ORDER.filter((t) => active[t] && active[t].length).concat(Object.keys(active).filter((t) => !PRED_TYPE_ORDER.includes(t)));
    body = subTypes.flatMap((t) => [h("div", { class: "g-pred-sec" }, t), ...active[t].map(PredRow)]);
  }
  return h(Fragment, null, chips, h("div", { class: "g-pred-list" }, body));
}
function renderPredict() {
  const el = document.getElementById("g-predict");
  if (!el) return;
  if (!el.dataset.predMounted) { mount(el, Predict); el.dataset.predMounted = "1"; }   // mount once; signals repaint it
  fetch("/api/predict?v=8", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null)).catch(() => null)
    .then((d) => { const list = (d && d.markets) || []; if (!list.length && (_predList.value || []).length) return; _predList.value = list; });
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
  // A spark cell is included ONLY when the caller opts in by passing `hist` (even an
  // empty array, to keep a panel's columns aligned) — so rows on panels that carry
  // no sparkline at all (e.g. Hormuz) keep their original 3-column grid.
  const spark = o.hist !== undefined ? sparkCell(o.hist) : "";
  return `<${tag} class="rate-tile"${attrs} title="${esc(o.title || o.label)}">`
    + `<span class="rate-label">${esc(o.label)}</span>${spark}<span class="rate-val">${esc(o.val)}</span>${chg}</${tag}>`;
}
const findRate = (label) => (_rateRows || []).find((x) => x.label === label);
const findExtra = (label) => (_mktExtra || []).find((x) => x.label === label);
const findMacro = (country, key) => (_macroSeries || []).find((s) => s.country === country && s.key === key);
// OAS series carry `value`/`change` in PERCENT (0.95 → 95 bp), matching fmtRate.
const bpTxt = (v) => `${Math.round(v * 100)} bp`;
// ---- Spreads (OAS levels + quality/distress premia) ------------------------
// The credit-spread panel: the ICE BofA OAS levels straight from the rates feed
// (US IG / HY / CCC, EURO HY), then the derived HY−IG (quality) and CCC−HY
// (distress) premia. Kept distinct from Key rates (yields) and Volatility (vol).
function renderSpreads() {
  const el = document.getElementById("g-spreads");
  if (!el) return;
  const rows = [];
  for (const x of (_rateRows || [])) {
    if (/OAS/i.test(x.label) && x.value != null) rows.push(ratesTile(x));
  }
  const hy = findRate("US HY OAS"), ig = findRate("US IG OAS"), ccc = findRate("US CCC OAS");
  if (hy && ig && hy.value != null && ig.value != null) {
    const v = hy.value - ig.value, c = (hy.change != null && ig.change != null) ? hy.change - ig.change : null;
    rows.push(riskTile({ label: "HY − IG", val: bpTxt(v), chg: c == null ? null : Math.abs(Math.round(c * 100)) + " bp", dir: dSign(c), href: hy.href, title: "Quality premium — high-yield minus investment-grade OAS", hist: diffHist(hy.history, ig.history) }));
  }
  if (ccc && hy && ccc.value != null && hy.value != null) {
    const v = ccc.value - hy.value, c = (ccc.change != null && hy.change != null) ? ccc.change - hy.change : null;
    rows.push(riskTile({ label: "CCC − HY", val: bpTxt(v), chg: c == null ? null : Math.abs(Math.round(c * 100)) + " bp", dir: dSign(c), href: ccc.href, title: "Distress premium — CCC minus high-yield OAS", hist: diffHist(ccc.history, hy.history) }));
  }
  if (rows.length) el.innerHTML = rows.join("");
}
function renderVolRisk() {
  const el = document.getElementById("g-vol");
  if (!el) return;
  const vix = findExtra("VIX");
  const rows = [];
  if (vix && vix.value != null) {
    // The markets feed carries VIX's % move; convert to points for the tile.
    const cp = typeof vix.changePct === "number" ? vix.changePct : null;
    const pts = cp == null ? null : +vix.value - (+vix.value) / (1 + cp / 100);
    rows.push(riskTile({ label: "VIX", val: (+vix.value).toFixed(2), chg: pts == null ? null : Math.abs(pts).toFixed(2) + " pt", dir: dSign(pts), href: "https://finance.yahoo.com/quote/%5EVIX", title: "CBOE Volatility Index — equity volatility", hist: vix.history || [] }));
  }
  // MOVE — ICE BofAML US Treasury option-vol index (the "bond-market VIX"): a level
  // in points, its daily move shown like VIX.
  const move = findExtra("MOVE");
  if (move && move.value != null) {
    const cp = typeof move.changePct === "number" ? move.changePct : null;
    const pts = cp == null ? null : +move.value - (+move.value) / (1 + cp / 100);
    rows.push(riskTile({ label: "MOVE", val: (+move.value).toFixed(2), chg: pts == null ? null : Math.abs(pts).toFixed(2) + " pt", dir: dSign(pts), href: "https://finance.yahoo.com/quote/%5EMOVE", title: "ICE BofAML MOVE Index — US Treasury option-implied volatility (the bond-market VIX)", hist: move.history || [] }));
  }
  // CDX HY — Simplify High Yield ETF (ticker CDX), a tradeable proxy for the
  // CDX.NA.HY credit-default-swap index; live price + daily % move.
  const cdx = findExtra("CDX HY");
  if (cdx && cdx.value != null) {
    const cp = typeof cdx.changePct === "number" ? cdx.changePct : null;
    rows.push(riskTile({ label: "CDX HY", val: "$" + (+cdx.value).toFixed(2), chg: cp == null ? null : Math.abs(cp).toFixed(2) + "%", dir: dSign(cp), href: "https://finance.yahoo.com/quote/CDX", title: "Simplify High Yield ETF (CDX) — tracks the CDX.NA.HY credit-default-swap index", hist: cdx.history || [] }));
  }
  if (rows.length) el.innerHTML = rows.join("");
}
function renderYieldCurve() {
  const el = document.getElementById("g-curve");
  if (!el) return;
  // 2Y from the rates feed (daily Treasury, same source/column as the 10Y) so both
  // yields — and the 2s10s diff — share one date-aligned ~1-month history.
  const t2 = findRate("US 2Y"), t10 = findRate("US 10Y");
  const rows = [];
  if (t2 && t2.value != null) {
    rows.push(riskTile({ label: "2Y", val: (+t2.value).toFixed(2) + "%", chg: t2.change == null ? null : Math.abs(t2.change).toFixed(2) + " pp", dir: dSign(t2.change), href: t2.href, title: "US 2-year Treasury yield", hist: t2.history || [] }));
  }
  if (t10 && t10.value != null) {
    rows.push(riskTile({ label: "10Y", val: (+t10.value).toFixed(2) + "%", chg: t10.change == null ? null : Math.abs(t10.change).toFixed(2) + " pp", dir: dSign(t10.change), href: t10.href, title: "US 10-year Treasury yield", hist: t10.history || [] }));
  }
  if (t2 && t10 && t2.value != null && t10.value != null) {
    const spBp = Math.round((+t10.value - +t2.value) * 100);
    const cBp = (t10.change != null && t2.change != null) ? Math.round((t10.change - t2.change) * 100) : null;
    rows.push(riskTile({ label: "2s10s", val: `${spBp > 0 ? "+" : ""}${spBp} bp`, chg: cBp == null ? null : Math.abs(cBp) + " bp", dir: dSign(cBp), href: t10.href, title: "2s10s slope — 10Y minus 2Y (negative = inverted, a recession signal)", hist: diffHist(t10.history, t2.history) }));
  }
  if (rows.length) el.innerHTML = rows.join("");
}

function initMarkets() {
  const el = document.getElementById("g-markets");
  if (!el) return;
  // Keep the last-good tiles up until fresh values arrive (never flash a
  // placeholder on a slow or failed refetch).
  renderMarketsBand(el, readCache("markets"));
  fetch("/api/markets?v=10")
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
