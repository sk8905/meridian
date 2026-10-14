// =============================================================================
// v2/js/transactions/app.js — the Transactions tab: the covered managers' deal
// flow organised by TRANSACTION TYPE, plus the European credit universe and the
// BDC roster. Six modes — Lending · Structured credit · Secondaries (the deal-flow
// groups of credit/js/tx.js) · Manager M&A (acquisitions of / stakes in asset
// managers, kept out of credit deal flow) · Credits · BDCs.
//
// Filtering (HOUSE_STYLE R36/R39): one Filters sheet of MULTI-SELECT facets with live
// counts — type · sector (industry) · region · size band · currency · sponsor ·
// lender — plus a date block (presets, years, quarters, a custom month range) and the
// $1–15bn → Target tri-state. Facets read the curated tags in credit/js/deal-tags.js.
// Each mode has its own columns; any column sorts; the list groups by lender / month /
// sector / region / type with subtotals; a stats strip summarises the filtered set.
//
// Every view lives in the URL hash (HOUSE_STYLE R35), so reload / a pasted link /
// Back restore it exactly:
//   #/<mode>?type=&sec=&reg=&size=&ccy=&sp=&lender=&period=|from=&to=&focus=&q=&sort=&grp=&deal=
//   #/credits?q=&rt=&tr=&jur=&csec=&sort=&grp=&open=      #/bdc?q=&sort=&open=
//   #/deal/<id>  (deep link — canonicalised to that deal's mode with the drawer open)
// mount(host, ctx) → { enter, leave, home }.
// =============================================================================
import { deals, managers, funds, fundById } from "/credit/js/data.js";
import { BDCS } from "/credit/js/bdcs.js";
import { EUR_CREDITS, EUR_CREDITS_META, creditsBySector } from "/credit/js/eu-credits.js";
import { DEAL_TAGS } from "/credit/js/deal-tags.js";
import { targetFit } from "/credit/js/target.js";
import { TX_TYPES, TX_GROUPS, SECTOR_TAGS, REGIONS, REGION_LABEL, EUROPE_REGIONS, txOf, amountOf, toUsd, fmtAmt, fmtUsd, tagsOf, sizeCounts } from "/credit/js/tx.js";
import { esc } from "/util.js";
import { fmtDay } from "/feed.js";
import { dealCounterparty, dealSponsor } from "../deal-parse.js";
import { creditSource } from "/credit/js/shared.js";
import { downloadCSV } from "../csv.js";

const _mById = new Map(managers.map((m) => [m.id, m]));
const mgrName = (id) => (_mById.get(id) || {}).name || "";
const DAY = 864e5;

// The AUM focus tri-state shared with Profiles: off → $1–15bn (group / parent AUM in
// the band; banks / originators never qualify) → Target (the owner's target market:
// European, ≤ $15bn, a 15%+ strategy — credit/js/target.js "core") → off.
const inFocusAum = (aum) => aum != null && aum >= 1 && aum <= 15;
const focusAumOf = (m) => (!m || m.notAum ? null : (m.aumTotal != null ? m.aumTotal : m.aum));
const mInBand = (m) => inFocusAum(focusAumOf(m));
const _fundsBy = new Map();
for (const f of funds) { if (!_fundsBy.has(f.managerId)) _fundsBy.set(f.managerId, []); _fundsBy.get(f.managerId).push(f); }
const _tier = new Map(managers.map((m) => [m.id, targetFit(m, _fundsBy.get(m.id) || []).tier]));
const mIsTarget = (id) => _tier.get(id) === "core";
const FOCUS_NEXT = { "": "band", band: "target", target: "" };
const FOCUS_PILL = { band: "$1–15bn AUM", target: "Target managers" };

const DEAL_MODES = [...TX_GROUPS.map((g) => [g.key, g.label]), ["mna", "Manager M&A"]];
const FLOW = DEAL_MODES.map(([k]) => k);                       // lending · structured · secondary · mna
const MODES = [...DEAL_MODES, ["credits", "Credits"], ["bdc", "BDCs"]];
const MODE_KEYS = MODES.map(([k]) => k);
const MODE_ALIAS = { primary: "lending" };                      // the pre-2026-10 mode name
const MODE_LABEL = Object.fromEntries(MODES);

const PERIOD_LABEL = { "30d": "Last 30 days", "12m": "Last 12 months", ytd: "Year to date", since2020: "Since 2020" };
const SIZE_BANDS = [["lt100", "< $100m"], ["100to500", "$100–500m"], ["500to1bn", "$500m–1bn"], ["gt1bn", "≥ $1bn"], ["undisc", "Not disclosed"]];
const CCY_OPTS = [["USD", "USD"], ["EUR", "EUR"], ["GBP", "GBP"], ["oth", "Other"], ["none", "Not disclosed"]];
const SPONSOR_OPTS = [["yes", "Sponsor-backed"], ["no", "No sponsor named"]];
const LEGACY_MIN = { 100: ["100to500", "500to1bn", "gt1bn"], 500: ["500to1bn", "gt1bn"], 1000: ["gt1bn"] };
const KIND_LABEL = { financing: "Financing", fund: "Vehicle size", portfolio: "Portfolio size", ev: "Enterprise value", aum: "AUM of the target", other: "Other figure" };
const KIND_SHORT = { ev: "EV", aum: "AUM", other: "" };
// Where a researched country comes from (deal-tags cb).
const BASIS_LABEL = { hq: "HQ", incorporated: "incorporation", issuer: "issuer domicile", portfolio: "portfolio location" };
const EVENT_LABEL = { new: "New issue", reset: "Reset", refi: "Refi" };
const SORTS = [["date-desc", "Newest"], ["date-asc", "Oldest"], ["size-desc", "Largest"], ["size-asc", "Smallest"], ["lender-asc", "Lender A–Z"], ["name-asc", "Name A–Z"]];
const SORT_DEFAULT_DIR = { date: "desc", size: "desc", lender: "asc", name: "asc" };
const GROUPS = [["", "No grouping"], ["lender", "By lender"], ["month", "By month"], ["sector", "By sector"], ["region", "By region"], ["type", "By type"]];
// URL keys per facet.
const FKEYS = { type: "type", sector: "sec", region: "reg", size: "size", ccy: "ccy", sponsor: "sp", lender: "lender" };
const FACETS = Object.keys(FKEYS);
const emptyF = () => Object.fromEntries(FACETS.map((k) => [k, []]));

// Credits facets (HOUSE_STYLE R39): rating band · 12m trend · jurisdiction · sector.
const RATING_ORDER = ["AAA", "AA+", "AA", "AA-", "A+", "A", "A-", "BBB+", "BBB", "BBB-", "BB+", "BB", "BB-", "B+", "B", "B-", "CCC+", "CCC", "CCC-", "CC", "C", "SD", "D"];
const ratingRank = (r) => { const i = RATING_ORDER.indexOf(r); return i === -1 ? 999 : i; };
const RATING_BANDS = [["a", "A & above"], ["bbb", "BBB"], ["bb", "BB"], ["b", "B"], ["ccc", "CCC & below"], ["nr", "NR"]];
const ratingBand = (r) => { const i = RATING_ORDER.indexOf(r); return i === -1 ? "nr" : i <= 6 ? "a" : i <= 9 ? "bbb" : i <= 12 ? "bb" : i <= 15 ? "b" : "ccc"; };
const TREND_OPTS = [["down", "▼ Downgraded"], ["up", "▲ Upgraded"], ["flat", "– Unchanged"]];
const CRKEYS = { rating: "rt", trend: "tr", jur: "jur", sector: "csec" };
const CR_FACETS = Object.keys(CRKEYS);
const emptyCr = () => Object.fromEntries(CR_FACETS.map((k) => [k, []]));
const CR_SORTS = [["", "Sector order"], ["name", "Name A–Z"], ["rating", "Rating, best first"], ["rating-worst", "Rating, worst first"], ["deals", "Most tracked deals"]];
const BDC_SORTS = [["size-desc", "Largest"], ["name-asc", "Name A–Z"], ["nav-desc", "NAV / sh"], ["na-desc", "Non-accrual, highest"], ["pxnav-asc", "Px/NAV, lowest"]];

export function mount(host, ctx) {
  // ---- enrich every dated deal once ------------------------------------------
  const now = Date.now();
  const typeLabel = (key) => (TX_TYPES.find((x) => x.key === key) || {}).label || key;
  const groupOfTx = (key) => (TX_TYPES.find((x) => x.key === key) || {}).group || "lending";
  const sizeBand = (usd, ok) => !(ok && usd != null) ? "undisc" : usd < 100 ? "lt100" : usd < 500 ? "100to500" : usd < 1000 ? "500to1bn" : "gt1bn";
  const all = deals
    .filter((d) => d && d.date)
    .map((d) => {
      const amt = amountOf(d), tx = txOf(d), tags = tagsOf(d, DEAL_TAGS), usd = toUsd(amt);
      const sizeOk = usd != null && sizeCounts(tags);
      return {
        d, tx, amt, usd, tags, sizeOk,
        ts: Date.parse((d.date || "").slice(0, 10)) || 0,
        band: sizeBand(usd, sizeOk),
        ccyK: amt ? (["USD", "EUR", "GBP"].includes(amt.ccy) ? amt.ccy : "oth") : "none",
        mode: tags.managerMA ? "mna" : groupOfTx(tx),
        sponsor: dealSponsor(d) || "",
        cp: dealCounterparty(d, mgrName(d.managerId)) || "",
        alt: [],
      };
    })
    .filter((r) => r.ts > 0);
  // De-duplicate: the same lender, date, size and type from two outlets is ONE deal
  // with two sources (the drawer lists both). Undisclosed sizes never merge.
  const _seen = new Map();
  const rows = [];
  const rowById = new Map();
  for (const r of all) {
    const k = r.usd != null ? `${r.d.managerId}|${r.d.date.slice(0, 10)}|${Math.round(r.usd)}|${r.tx}` : null;
    const first = k && _seen.get(k);
    if (first) { first.alt.push(r.d); rowById.set(r.d.id, first); continue; }
    if (k) _seen.set(k, r);
    rows.push(r); rowById.set(r.d.id, r);
  }

  // ---- state (the URL is its serialised form) --------------------------------
  const DEFAULT = () => ({ mode: "lending", q: "", deal: "", sort: "date", dir: "desc", grp: "", f: emptyF(), period: "all", from: "", to: "", focus: "",
    crQ: "", crGroup: null, crOpen: "", cr: emptyCr(), crSort: "", bdcQ: "", bdcOpen: "", bdcSort: "size-desc" });
  let st = DEFAULT();
  let sheetOpen = false, crSheetOpen = false, lenderAll = false;
  const flowMode = () => FLOW.includes(st.mode);

  // ---- filters -----------------------------------------------------------------
  const PERIODS = { all: () => 0, "30d": () => now - 30 * DAY, "12m": () => now - 365 * DAY, ytd: () => Date.UTC(new Date(now).getUTCFullYear(), 0, 1), since2020: () => Date.UTC(2020, 0, 1) };
  const ym = (r) => r.d.date.slice(0, 7);
  const inDate = (r) => (st.from || st.to)
    ? (!st.from || ym(r) >= st.from) && (!st.to || ym(r) <= st.to)
    : (st.period === "all" || r.ts >= (PERIODS[st.period] || PERIODS.all)());
  const inFocus = (r) => !st.focus || (st.focus === "band" ? mInBand(_mById.get(r.d.managerId)) : mIsTarget(r.d.managerId));
  const FVAL = {
    type: (r) => r.tx, sector: (r) => r.tags.sector, region: (r) => r.tags.region, size: (r) => r.band,
    ccy: (r) => r.ccyK, sponsor: (r) => (r.sponsor ? "yes" : "no"), lender: (r) => r.d.managerId || "_",
  };
  const passes = (r, except) => inDate(r) && inFocus(r) && FACETS.every((k) => k === except || !st.f[k].length || st.f[k].includes(FVAL[k](r)));
  const hit = (r, q) => (r.d.headline || "").toLowerCase().includes(q) || mgrName(r.d.managerId).toLowerCase().includes(q)
    || (r.d.summary || "").toLowerCase().includes(q) || typeLabel(r.tx).toLowerCase().includes(q) || r.tags.sector.toLowerCase().includes(q)
    || (r.tags.country || "").toLowerCase().includes(q);
  // Search spans every deal-flow mode; otherwise the active mode's deals.
  const baseRows = () => (st.q ? rows.filter((r) => hit(r, st.q.toLowerCase())) : rows.filter((r) => r.mode === st.mode));
  function facetCounts(k) {
    const out = {};
    for (const r of baseRows()) if (passes(r, k)) { const v = FVAL[k](r); out[v] = (out[v] || 0) + 1; }
    return out;
  }
  const SORT_VAL = {
    date: (r) => r.ts,
    size: (r) => (r.sizeOk && r.usd != null ? r.usd : null),
    lender: (r) => mgrName(r.d.managerId).toLowerCase() || null,
    name: (r) => (r.cp || r.d.headline || "").toLowerCase() || null,
  };
  function sortRows(list) {
    const f = SORT_VAL[st.sort] || SORT_VAL.date, sgn = st.dir === "asc" ? 1 : -1;
    return list.slice().sort((a, b) => {
      const x = f(a), y = f(b);
      if (x == null || y == null) return x == null && y == null ? b.ts - a.ts : x == null ? 1 : -1;   // blanks last either way
      return (x < y ? -1 : x > y ? 1 : 0) * sgn || b.ts - a.ts;
    });
  }
  const currentList = () => sortRows(baseRows().filter((r) => passes(r)));
  const nSelected = () => FACETS.reduce((a, k) => a + st.f[k].length, 0) + (st.from || st.to || st.period !== "all" ? 1 : 0);

  // ---- URL <-> state ---------------------------------------------------------
  const csv = (a) => a.join(",");
  function toHash() {
    const p = new URLSearchParams();
    const path = "#/" + st.mode;
    if (flowMode()) {
      for (const k of FACETS) if (st.f[k].length) p.set(FKEYS[k], csv(st.f[k]));
      if (st.from || st.to) { if (st.from) p.set("from", st.from); if (st.to) p.set("to", st.to); }
      else if (st.period !== "all") p.set("period", st.period);
      if (st.focus) p.set("focus", st.focus);
      if (st.q) p.set("q", st.q);
      if (st.sort !== "date" || st.dir !== "desc") p.set("sort", `${st.sort}-${st.dir}`);
      if (st.grp) p.set("grp", st.grp);
      if (st.deal) p.set("deal", st.deal);
    } else if (st.mode === "credits") {
      if (st.crQ) p.set("q", st.crQ);
      for (const k of CR_FACETS) if (st.cr[k].length) p.set(CRKEYS[k], csv(st.cr[k]));
      if (st.crSort) p.set("sort", st.crSort);
      if (st.crGroup) p.set("grp", st.crGroup);
      if (st.crOpen) p.set("open", st.crOpen);
    } else {
      if (st.bdcQ) p.set("q", st.bdcQ);
      if (st.bdcSort !== "size-desc") p.set("sort", st.bdcSort);
      if (st.bdcOpen) p.set("open", st.bdcOpen);
    }
    const qs = p.toString().replace(/%2C/g, ",");
    return path + (qs ? "?" + qs : "");
  }
  const FVALID = {
    type: (v) => TX_TYPES.some((t) => t.key === v), sector: (v) => SECTOR_TAGS.includes(v), region: (v) => REGION_LABEL[v] != null,
    size: (v) => SIZE_BANDS.some(([k]) => k === v), ccy: (v) => CCY_OPTS.some(([k]) => k === v), sponsor: (v) => v === "yes" || v === "no",
    lender: (v) => _mById.has(v),
  };
  const listParam = (q, key, ok) => (q.get(key) || "").split(",").filter((v) => v && ok(v)).filter((v, i, a) => a.indexOf(v) === i);
  const YM = /^\d{4}-(0[1-9]|1[0-2])$/;
  // Parse a hash into a fresh state. Unknown values fall back to the defaults.
  function fromHash(raw) {
    const s = DEFAULT();
    const [pathPart, qs = ""] = String(raw || "").replace(/^#/, "").split("?");
    const seg = pathPart.split("/").filter(Boolean);
    const q = new URLSearchParams(qs);
    if (seg[0] === "deal" && seg[1] && rowById.has(seg[1])) {
      // A deep link to one deal: open it over its own mode's default list.
      const r = rowById.get(seg[1]);
      s.mode = r.mode; s.deal = r.d.id;
      return s;
    }
    const m = MODE_ALIAS[seg[0]] || seg[0];
    if (MODE_KEYS.includes(m)) s.mode = m;
    if (FLOW.includes(s.mode)) {
      for (const k of FACETS) s.f[k] = listParam(q, FKEYS[k], FVALID[k]);
      // Legacy forms: a type path segment, ?min=, focus=1.
      if (seg[1] && FVALID.type(seg[1]) && !s.f.type.length) s.f.type = [seg[1]];
      if (LEGACY_MIN[q.get("min")] && !s.f.size.length) s.f.size = LEGACY_MIN[q.get("min")].slice();
      if (YM.test(q.get("from") || "")) s.from = q.get("from");
      if (YM.test(q.get("to") || "")) s.to = q.get("to");
      if (!s.from && !s.to && PERIODS[q.get("period")]) s.period = q.get("period");
      s.focus = q.get("focus") === "1" ? "band" : (["band", "target"].includes(q.get("focus")) ? q.get("focus") : "");
      s.q = q.get("q") || "";
      const [sk, sd] = (q.get("sort") || "").split("-");
      if (SORT_VAL[sk]) { s.sort = sk; s.dir = sd === "asc" ? "asc" : sd === "desc" ? "desc" : SORT_DEFAULT_DIR[sk]; }
      if (GROUPS.some(([k]) => k && k === q.get("grp"))) s.grp = q.get("grp");
      if (q.get("deal") && rowById.has(q.get("deal"))) s.deal = rowById.get(q.get("deal")).d.id;
    } else if (s.mode === "credits") {
      s.crQ = q.get("q") || "";
      s.cr.rating = listParam(q, "rt", (v) => RATING_BANDS.some(([k]) => k === v));
      s.cr.trend = listParam(q, "tr", (v) => TREND_OPTS.some(([k]) => k === v));
      s.cr.jur = listParam(q, "jur", (v) => EUR_CREDITS.some((c) => c.jurisdiction === v));
      s.cr.sector = listParam(q, "csec", (v) => EUR_CREDITS.some((c) => c.sector === v));
      if (CR_SORTS.some(([k]) => k && k === q.get("sort"))) s.crSort = q.get("sort");
      s.crGroup = ["sector", "rating"].includes(q.get("grp")) ? q.get("grp") : null;
      s.crOpen = q.get("open") || "";
    } else if (s.mode === "bdc") {
      s.bdcQ = q.get("q") || "";
      if (BDC_SORTS.some(([k]) => k === q.get("sort"))) s.bdcSort = q.get("sort");
      s.bdcOpen = q.get("open") || "";
    }
    return s;
  }
  // Commit the state to the URL. A navigation-like change (mode, type, a pill, a
  // drawer) is a NEW history entry so Back steps back through it; typing a search or
  // toggling chips inside the open Filters sheet REPLACES. Hash writes via the History
  // API fire no hashchange, so there is no double render.
  const isActive = () => document.documentElement.dataset.v2tab === "transactions";
  function commit(push) {
    if (!isActive()) return;
    const h = toHash();
    if (location.hash === h) return;
    const url = location.pathname + location.search + h;
    try { if (push) history.pushState({ v2: true, tx: 1 }, "", url); else history.replaceState(history.state, "", url); } catch { /* keep the old URL */ }
  }
  // Apply a hash to the view (mount, Back/Forward, a deep link, enter()).
  function applyHash() {
    const next = fromHash(location.hash);
    const canon = (() => { const keep = st; st = next; const h = toHash(); st = keep; return h; })();
    st = next;
    // Canonicalise legacy / deep-link forms (#/primary, #/deal/<id>, ?min=) in place.
    if (isActive() && location.hash && location.hash !== canon) { try { history.replaceState(history.state, "", location.pathname + location.search + canon); } catch { /* ignore */ } }
    syncControls(); showMode(); render();
  }

  const mq = (q) => { try { return window.matchMedia(q).matches; } catch { return false; } };
  const _txDesktop = () => mq("(min-width:901px)");
  const _phone = () => mq("(max-width:760px)");

  // ---- shell ---------------------------------------------------------------
  const grpSvg = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>`;
  const opt = ([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`;
  host.innerHTML = `
    <div class="tdash tx-dash">
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full">
          <header class="tpanel-h twire-head">
            <!-- renderModeNav(): the modes; on desktop the active deal-flow mode's
                 transaction types nest beneath it in the left rail. -->
            <div class="tchips" id="tx-mode"></div>
          </header>
          <div class="tcol-main">
            <header class="tpanel-h thead-search tx-bar" id="tx-flow-search">
              <input type="search" id="tx-q" class="tsearch" placeholder="Search every deal, manager or type…" aria-label="Search transactions">
              <button type="button" class="tx-fbtn" id="tx-filters" aria-expanded="false" aria-controls="tx-sheet">Filters</button>
              <select id="tx-sort" class="tx-filt tx-sortgrp" data-ctl="sort" aria-label="Sort the deals">${SORTS.map(opt).join("")}</select>
              <select id="tx-grp" class="tx-filt tx-sortgrp" data-ctl="grp" aria-label="Group the deals">${GROUPS.map(opt).join("")}</select>
              <button type="button" class="tfocus-btn tfocus-aum" id="tx-focus" aria-pressed="false">$1–15bn</button>
              <button type="button" class="tfocus-btn tx-csv" data-csv="flow" title="Download the deals on screen as CSV">CSV</button>
              <div class="tx-active" id="tx-active" hidden></div>
            </header>
            <header class="tpanel-h thead-search tx-bar" id="tx-credits-search">
              <input type="search" id="tx-cr-q" class="tsearch" placeholder="Search a credit or sector…" aria-label="Search credits">
              <button type="button" class="tx-fbtn" id="tx-cr-filters" aria-expanded="false" aria-controls="tx-cr-sheet">Filters</button>
              <select id="tx-cr-sort" class="tx-filt" aria-label="Sort the credits">${CR_SORTS.map(opt).join("")}</select>
              <div class="tcr-grpctl" id="tx-cr-ctl" role="group" aria-label="Group the credit roster">
                <button type="button" class="tcr-grpbtn" data-crgroup="sector" aria-pressed="false">${grpSvg}<span>Group by sector</span></button>
                <button type="button" class="tcr-grpbtn" data-crgroup="rating" aria-pressed="false">${grpSvg}<span>Group by rating</span></button>
              </div>
              <button type="button" class="tfocus-btn tx-csv" data-csv="credits" title="Download the credits on screen as CSV">CSV</button>
              <div class="tx-active" id="tx-cr-active" hidden></div>
            </header>
            <header class="tpanel-h thead-search tx-bar" id="tx-bdc-search">
              <input type="search" id="tx-bdc-q" class="tsearch" placeholder="Search a BDC or manager…" aria-label="Search BDCs">
              <select id="tx-bdc-sort" class="tx-filt" aria-label="Sort the BDCs">${BDC_SORTS.map(opt).join("")}</select>
              <button type="button" class="tfocus-btn tx-csv" data-csv="bdc" title="Download the BDCs on screen as CSV">CSV</button>
            </header>
            <div class="tx-asof" id="tx-asof" hidden></div>
            <div class="tx-sheet" id="tx-sheet" role="region" aria-label="Filters" hidden></div>
            <div class="tx-sheet" id="tx-cr-sheet" role="region" aria-label="Credit filters" hidden></div>
            <div class="tx-scroll" id="tx-body"></div>
            <div class="tx-scroll" id="tx-credits-body"></div>
            <div class="tx-scroll" id="tx-bdc-body"></div>
            <aside class="tx-drawer" id="tx-drawer" role="region" aria-label="Deal" hidden></aside>
          </div>
        </section>
      </div>
    </div>`;
  const body = host.querySelector("#tx-body");
  const creditsBody = host.querySelector("#tx-credits-body");
  const bdcBody = host.querySelector("#tx-bdc-body");
  const drawer = host.querySelector("#tx-drawer");
  const sheet = host.querySelector("#tx-sheet");
  const crSheet = host.querySelector("#tx-cr-sheet");
  let _bdcQuotes = null, _bdcQuotesTried = false;

  // ---- freshness cue -------------------------------------------------------
  // The newest dated deal in the ledger; older than TX_STALE_DAYS → a stale flag, so
  // a quiet pipeline is visible instead of being masked by the back-catalogue.
  const TX_STALE_DAYS = 7;
  let _newestRow = null;
  for (const r of rows) if (!_newestRow || r.ts > _newestRow.ts) _newestRow = r;
  function renderAsOf() {
    const el = host.querySelector("#tx-asof");
    if (!el) return;
    if (!flowMode() || !_newestRow) { el.hidden = true; el.innerHTML = ""; return; }
    el.hidden = false;
    const ageDays = Math.round((Date.now() - _newestRow.ts) / DAY);
    const stale = ageDays > TX_STALE_DAYS;
    el.className = "tx-asof" + (stale ? " is-stale" : "");
    el.innerHTML = `<span class="tx-asof-lbl">Deal flow as of ${esc(fmtDay(_newestRow.d.date))}</span>`
      + (stale ? `<span class="tx-asof-flag" title="No new deal recorded in ${ageDays} days — the ledger is awaiting fresh, verified filings">${ageDays}d ago · awaiting fresh filings</span>` : "");
  }

  // ---- labels ----------------------------------------------------------------
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const ymLabel = (s) => `${MON[+s.slice(5, 7) - 1]} ${s.slice(0, 4)}`;
  function dateLabel() {
    const { from, to } = st;
    if (!from && !to) return st.period !== "all" ? PERIOD_LABEL[st.period] : "";
    if (from && to && from.slice(0, 4) === to.slice(0, 4)) {
      const y = from.slice(0, 4), a = +from.slice(5), b = +to.slice(5);
      if (a === 1 && b === 12) return y;
      if (b - a === 2 && a % 3 === 1) return `Q${(a + 2) / 3} ${y}`;
    }
    if (from && to) return from === to ? ymLabel(from) : `${ymLabel(from)} – ${ymLabel(to)}`;
    return from ? `From ${ymLabel(from)}` : `To ${ymLabel(to)}`;
  }
  const optLabel = (k, v) => {
    if (k === "type") return typeLabel(v);
    if (k === "region") return REGION_LABEL[v] || v;
    if (k === "lender") return mgrName(v) || "—";
    const opts = { size: SIZE_BANDS, ccy: CCY_OPTS, sponsor: SPONSOR_OPTS }[k];
    return opts ? ((opts.find(([x]) => x === v) || [])[1] || v) : v;
  };
  const FACET_TITLE = { type: "Type", sector: "Sector", region: "Region", size: "Size", ccy: "Currency", sponsor: "Sponsor", lender: "Lender / investor" };

  // ---- active-filter pills + the Filters button count -------------------------
  // Every non-default filter shows as a removable pill, so what is narrowing the list
  // is always visible and one tap undoes it.
  function renderActive() {
    const el = host.querySelector("#tx-active");
    if (!el) return;
    const pills = [];
    if (flowMode()) {
      // Every European region selected reads as one "Europe" pill.
      const allEu = EUROPE_REGIONS.every((v) => st.f.region.includes(v));
      for (const k of FACETS) for (const v of st.f[k]) if (!(allEu && k === "region" && EUROPE_REGIONS.includes(v))) pills.push([`${k}:${v}`, optLabel(k, v)]);
      if (allEu) pills.push(["europe", "Europe"]);
      const dl = dateLabel(); if (dl) pills.push(["date", dl]);
      if (st.focus) pills.push(["focus", FOCUS_PILL[st.focus]]);
    }
    el.hidden = !pills.length;
    el.innerHTML = pills.map(([k, l]) => `<button type="button" class="tx-pill" data-clear="${esc(k)}" aria-label="Remove filter: ${esc(l)}">${esc(l)}<span aria-hidden="true">✕</span></button>`).join("")
      + (pills.length ? `<button type="button" class="tx-clear" data-clear="all">Clear all</button>` : "");
    const n = nSelected();
    const fb = host.querySelector("#tx-filters");
    if (fb) { fb.textContent = n ? `Filters (${n})` : "Filters"; fb.classList.toggle("is-on", sheetOpen); fb.setAttribute("aria-expanded", String(sheetOpen)); }
  }

  // ---- the Filters sheet -----------------------------------------------------
  // Multi-select chips with LIVE counts (each facet counts against every OTHER active
  // filter — OR within a facet, AND across facets). Zero-count values hide unless on.
  const fchip = (attrs, label, n, on) => `<button type="button" class="tx-fchip${on ? " is-on" : ""}" ${attrs} aria-pressed="${on}">${esc(label)}${n != null ? `<span class="tx-secn">${n}</span>` : ""}</button>`;
  function facetBlock(k) {
    const counts = facetCounts(k);
    let opts;
    if (k === "type") opts = TX_TYPES.filter((t) => st.q || st.mode === "mna" || t.group === st.mode).map((t) => [t.key, t.label]);
    else if (k === "sector") opts = SECTOR_TAGS.map((s) => [s, s]);
    else if (k === "region") opts = REGIONS.map(([v, l]) => [v, l]);
    else if (k === "size") opts = SIZE_BANDS;
    else if (k === "ccy") opts = CCY_OPTS;
    else if (k === "sponsor") opts = SPONSOR_OPTS;
    else opts = Object.keys(counts).filter((id) => id !== "_").map((id) => [id, mgrName(id)]).sort((a, b) => counts[b[0]] - counts[a[0]] || a[1].localeCompare(b[1]));
    const sel = st.f[k];
    let shown = opts.filter(([v]) => counts[v] || sel.includes(v));
    let more = "";
    if (k === "lender" && !lenderAll && shown.length > 15) {
      const top = shown.slice(0, 15);
      shown = [...top, ...shown.slice(15).filter(([v]) => sel.includes(v))];
      more = `<button type="button" class="tx-fchip tx-fmore" data-fmore="1">All ${opts.length} lenders</button>`;
    }
    if (!shown.length) return "";
    let extra = "";
    if (k === "region") {
      const eu = EUROPE_REGIONS.filter((v) => counts[v]);
      const on = eu.length > 0 && eu.every((v) => sel.includes(v));
      if (eu.length > 1) extra = fchip(`data-europe="1"`, "All Europe", eu.reduce((a, v) => a + counts[v], 0), on);
    }
    return `<div class="tx-fgrp" data-fgrp="${k}"><div class="tx-fh">${esc(FACET_TITLE[k])}${sel.length ? ` <span class="tx-fsel">${sel.length}</span>` : ""}</div><div class="tx-fchips">${extra}`
      + shown.map(([v, l]) => fchip(`data-facet="${k}" data-v="${esc(v)}"`, l, counts[v] || 0, sel.includes(v))).join("") + more + `</div></div>`;
  }
  // Years present in the ledger, newest first, and the last six calendar quarters.
  const YEARS = [...new Set(rows.map((r) => r.d.date.slice(0, 4)))].sort().reverse().filter((y) => y >= "2020");
  const QUARTERS = (() => {
    const d = new Date(now), out = [];
    let y = d.getUTCFullYear(), q = Math.floor(d.getUTCMonth() / 3) + 1;
    for (let i = 0; i < 6; i++) {
      const a = String((q - 1) * 3 + 1).padStart(2, "0"), b = String(q * 3).padStart(2, "0");
      out.push([`Q${q} ${y}`, `${y}-${a}`, `${y}-${b}`]);
      if (--q === 0) { q = 4; y--; }
    }
    return out;
  })();
  function dateBlock() {
    const custom = !!(st.from || st.to);
    const pre = [["all", "All dates"], ...Object.entries(PERIOD_LABEL)].map(([k, l]) => fchip(`data-period="${k}"`, l, null, !custom && st.period === k)).join("");
    const rng = (l, a, b) => fchip(`data-from="${a}" data-to="${b}"`, l, null, st.from === a && st.to === b);
    const years = YEARS.map((y) => rng(y, `${y}-01`, `${y}-12`)).join("");
    const qs = QUARTERS.map(([l, a, b]) => rng(l, a, b)).join("");
    const lo = rows.reduce((m, r) => (ym(r) < m ? ym(r) : m), "9999-12"), hi = new Date(now).toISOString().slice(0, 7);
    return `<div class="tx-fgrp" data-fgrp="date"><div class="tx-fh">Date</div><div class="tx-fchips">${pre}</div><div class="tx-fchips">${years}</div><div class="tx-fchips">${qs}</div>`
      + `<div class="tx-frange"><label>From <input type="month" id="tx-from" min="${lo}" max="${hi}" value="${esc(st.from)}"></label><label>To <input type="month" id="tx-to" min="${lo}" max="${hi}" value="${esc(st.to)}"></label></div></div>`;
  }
  function renderSheet() {
    sheet.hidden = !(sheetOpen && flowMode());
    host.classList.toggle("tx-sheet-open", !sheet.hidden);
    if (sheet.hidden) { sheet.innerHTML = ""; return; }
    const n = currentList().length;
    const sortSel = `<select class="tx-filt" data-ctl="sort" aria-label="Sort the deals">${SORTS.map(opt).join("")}</select>`;
    const grpSel = `<select class="tx-filt" data-ctl="grp" aria-label="Group the deals">${GROUPS.map(opt).join("")}</select>`;
    const keepY = sheet.querySelector(".tx-sheet-b") ? sheet.querySelector(".tx-sheet-b").scrollTop : 0;
    sheet.innerHTML = `<div class="tx-sheet-b">`
      + `<div class="tx-fgrp tx-fsortgrp"><div class="tx-fh">Sort &amp; group</div><div class="tx-fchips">${sortSel}${grpSel}</div></div>`
      + dateBlock()
      + FACETS.filter((k) => !(k === "type" && st.mode === "mna" && !st.q)).filter((k) => !(k === "sponsor" && st.mode !== "lending" && !st.q)).map(facetBlock).join("")
      + `</div><div class="tx-sheet-f"><button type="button" class="tx-clear" data-clear="all">Clear all</button><button type="button" class="tx-sheet-done">Show ${n} deal${n === 1 ? "" : "s"}</button></div>`;
    sheet.querySelectorAll("select[data-ctl]").forEach((s) => { s.value = s.dataset.ctl === "sort" ? `${st.sort}-${st.dir}` : st.grp; });
    const b = sheet.querySelector(".tx-sheet-b"); if (b) b.scrollTop = keepY;
  }

  // ---- mode nav ------------------------------------------------------------
  // Desktop: the modes as a left rail, the active deal-flow mode's types nested
  // beneath it (a shortcut that sets the Type facet). Phone: a flat chip row.
  function renderModeNav() {
    const nav = host.querySelector("#tx-mode");
    if (!nav) return;
    let subHTML = "";
    if (_txDesktop() && flowMode() && st.mode !== "mna" && !st.q) {
      const counts = facetCounts("type");
      const types = TX_TYPES.filter((t) => t.group === st.mode && (counts[t.key] || st.f.type.includes(t.key))).sort((a, b) => (counts[b.key] || 0) - (counts[a.key] || 0));
      if (types.length) {
        const groupN = types.reduce((a, t) => a + (counts[t.key] || 0), 0);
        const one = st.f.type.length === 1 ? st.f.type[0] : null;
        const chip = (t) => `<button type="button" class="tchip${one === t.key ? " is-on" : ""}" data-sub="${esc(t.key)}">${esc(t.label)}<span class="tx-subn">${counts[t.key] || 0}</span></button>`;
        const allChip = `<button type="button" class="tchip${!st.f.type.length ? " is-on" : ""}" data-sub="">All<span class="tx-subn">${groupN}</span></button>`;
        subHTML = `<div class="tx-subnav tx-subnav-nested"><div class="tchips">${allChip}${types.map(chip).join("")}</div></div>`;
      }
    }
    nav.innerHTML = MODES.map(([k, l]) => {
      const on = st.mode === k;
      // Long labels shorten on phones (six chips share 390px).
      const lbl = k === "structured" ? `Structured<span class="tx-mlong"> credit</span>` : k === "mna" ? `<span class="tx-mlong">Manager </span>M&amp;A` : esc(l);
      return `<button type="button" class="tchip${on ? " is-on" : ""}" data-mode="${esc(k)}">${lbl}</button>` + (on ? subHTML : "");
    }).join("");
    renderAsOf();
    renderActive();
  }

  // ---- cells / columns per mode -------------------------------------------------
  const mgrLink = (id) => id && mgrName(id) ? `<a href="${esc(ctx.base)}/profiles/#/manager/${esc(id)}" class="tx-mgr" data-id="${esc(id)}">${esc(mgrName(id))}</a>` : "—";
  // The borrower / company — the deal's OTHER party. When the headline leads with the
  // lender itself, the sourced headline stands in (muted) rather than repeating the
  // lender's name as the "borrower".
  const partyCell = (r) => (r.cp ? esc(r.cp) : `<span class="tx-hl">${esc(r.d.headline || "—")}</span>`);
  const hlCell = (r) => `<span class="tx-hl">${esc(r.d.headline || "—")}</span>`;
  // Amounts that are NOT the deal size (a target's AUM, an enterprise value) read
  // muted with their kind, and never count in sizes, totals or medians.
  const amtCell = (r) => {
    if (!r.amt) return "—";
    if (r.sizeOk) return `<span${r.amt.ccy !== "USD" && r.usd != null ? ` title="≈ ${esc(fmtUsd(r.usd))}"` : ""}>${esc(fmtAmt(r.amt))}</span>`;
    const k = r.tags.amountKind;
    return `<span class="tx-amt-x" title="${esc(KIND_LABEL[k] || "")} — not counted as deal size">${KIND_SHORT[k] ? esc(KIND_SHORT[k]) + " " : ""}${esc(fmtAmt(r.amt))}</span>`;
  };
  const srcCell = (r) => (r.d.sourceUrl ? `<a href="${esc(r.d.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(creditSource(r.d) || "source")}</a>` : "—") + (r.alt.length ? `<span class="tx-alt" title="Also reported by ${r.alt.length} other source${r.alt.length === 1 ? "" : "s"}"> +${r.alt.length}</span>` : "");
  const caret = `<span class="tx-caret" aria-hidden="true">▸</span>`;
  // [label, cell, sortKey|null, class]
  function columns(list) {
    const C = {
      party: (lbl) => [lbl, (r) => caret + partyCell(r), "name", "txc-party tx-bd"],
      vehicle: (lbl) => [lbl, (r) => caret + hlCell(r), "name", "txc-party tx-bd"],
      lender: (lbl) => [lbl, (r) => mgrLink(r.d.managerId), "lender", "txc-lender tx-mg"],
      sponsor: ["Sponsor", (r) => (r.sponsor ? esc(r.sponsor) : "—"), null, "txc-sp tx-sp"],
      type: ["Type", (r) => esc(st.q ? `${MODE_LABEL[r.mode]} · ${typeLabel(r.tx)}` : typeLabel(r.tx)), null, "txc-type tx-cat"],
      sector: ["Sector", (r) => esc(r.tags.sector), null, "txc-sec tx-cat"],
      country: ["Country", (r) => esc(r.tags.country || "—"), null, "txc-ctry tx-cat"],
      event: ["Event", (r) => esc(EVENT_LABEL[r.tags.event] || "—"), null, "txc-ev tx-cat"],
      amount: (lbl) => [lbl, amtCell, "size", "txc-amt tl-n tx-sz"],
      date: ["Date", (r) => esc(fmtDay(r.d.date)), "date", "txc-date tx-dt"],
      source: ["Source", srcCell, null, "txc-src tx-src2"],
    };
    if (st.q) return [C.party("Deal"), C.lender("Lender / investor"), C.type, C.amount("Amount"), C.date, C.source];
    if (st.mode === "structured") return [C.vehicle("Deal"), C.lender("Manager"), C.type, C.event, C.country, C.amount("Size"), C.date, C.source];
    if (st.mode === "secondary") return [C.party("Fund / portfolio"), C.lender("Buyer / lead"), C.type, C.country, C.amount("Size"), C.date, C.source];
    if (st.mode === "mna") return [C.party("Target"), C.lender("Acquirer"), C.country, C.amount("Value"), C.date, C.source];
    const sp = list.some((r) => r.sponsor) ? [C.sponsor] : [];
    return [C.party("Borrower"), C.lender("Lender / investor"), ...sp, C.sector, C.country, C.amount("Amount"), C.date, C.source];
  }
  const ariaSort = (k) => (k && st.sort === k ? ` aria-sort="${st.dir === "asc" ? "ascending" : "descending"}"` : "");
  const txRow = (cols) => (r) => `<tr class="tx-row${st.deal === r.d.id ? " is-open" : ""}" data-deal="${esc(r.d.id)}" tabindex="0">`
    + cols.map(([, cell, , cls], i) => `<td class="${cls}"${i === 0 ? ` title="${esc(r.d.headline || "")}"` : ""}>${cell(r)}</td>`).join("") + `</tr>`;
  // Phone: a two-line card per deal — party · amount, then date · lender · type /
  // country — so the facts that matter fit 390px without a sideways-scrolling table.
  const txCard = (r) => {
    const d = r.d;
    const what = st.mode === "mna" && !st.q ? "Manager M&A" : st.mode === "structured" && r.tags.event && !st.q ? `${typeLabel(r.tx)} · ${EVENT_LABEL[r.tags.event]}` : typeLabel(r.tx);
    return `<li class="tx-card${st.deal === d.id ? " is-open" : ""}" data-deal="${esc(d.id)}" tabindex="0">`
      + `<div class="tx-card-a"><span class="tx-card-nm">${st.mode === "structured" && !st.q ? hlCell(r) : partyCell(r)}</span><span class="tx-card-amt">${r.amt ? amtCell(r) : ""}</span></div>`
      + `<div class="tx-card-b"><span>${esc(fmtDay(d.date))}</span><span>${mgrLink(d.managerId)}</span><span>${esc(what)}</span>${r.tags.country ? `<span>${esc(r.tags.country)}</span>` : ""}</div></li>`;
  };

  // ---- grouping + stats ---------------------------------------------------------
  const GRP_KEY = {
    lender: (r) => r.d.managerId || "_", month: (r) => ym(r), sector: (r) => r.tags.sector, region: (r) => r.tags.region, type: (r) => r.tx,
  };
  const GRP_LABEL = {
    lender: (k) => mgrName(k) || "—", month: (k) => ymLabel(k), sector: (k) => k, region: (k) => REGION_LABEL[k] || k, type: (k) => typeLabel(k),
  };
  function grouped(list) {
    const f = GRP_KEY[st.grp], m = new Map();
    for (const r of list) { const k = f(r); if (!m.has(k)) m.set(k, []); m.get(k).push(r); }
    const out = [...m.entries()];
    if (st.grp === "month") out.sort((a, b) => (a[0] < b[0] ? 1 : -1));
    else out.sort((a, b) => b[1].length - a[1].length || GRP_LABEL[st.grp](a[0]).localeCompare(GRP_LABEL[st.grp](b[0])));
    return out;
  }
  const sized = (list) => list.filter((r) => r.sizeOk && r.usd != null);
  const volOf = (list) => sized(list).reduce((a, r) => a + r.usd, 0);
  const grpHead = (k, rs, tag, span) => {
    const v = volOf(rs);
    const inner = `<span class="tx-grp-nm">${esc(GRP_LABEL[st.grp](k))}</span><span class="tx-grp-n">${rs.length}</span>${v ? `<span class="tx-grp-v">≈ ${esc(fmtUsd(v))}</span>` : ""}`;
    return tag === "tr" ? `<tr class="tx-grp"><td colspan="${span}">${inner}</td></tr>` : `<li class="tx-grp">${inner}</li>`;
  };
  function statsHTML(list) {
    if (!list.length) return "";
    const s = sized(list);
    const vol = s.reduce((a, r) => a + r.usd, 0);
    const us = s.map((r) => r.usd).sort((a, b) => a - b);
    const med = us.length ? (us.length % 2 ? us[(us.length - 1) / 2] : (us[us.length / 2 - 1] + us[us.length / 2]) / 2) : null;
    const lc = {}; list.forEach((r) => { if (r.d.managerId && mgrName(r.d.managerId)) lc[r.d.managerId] = (lc[r.d.managerId] || 0) + 1; });
    const top = Object.entries(lc).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const parts = [`<span><b>${list.length}</b> deal${list.length === 1 ? "" : "s"}</span>`];
    if (vol) parts.push(`<span title="Disclosed deal sizes only, converted to USD">≈ <b>${esc(fmtUsd(vol))}</b> disclosed (${s.length}/${list.length})</span>`);
    if (med != null) parts.push(`<span>median <b>${esc(fmtUsd(med))}</b></span>`);
    if (top.length) parts.push(`<span>top: ${top.map(([id, n]) => `${mgrLink(id)} ${n}`).join(" · ")}</span>`);
    return `<div class="tx-stats" id="tx-stats">${parts.join("")}</div>`;
  }
  const CAP = 400;
  function dealList(all) {
    const list = all.slice(0, CAP);
    const more = all.length > CAP ? `<p class="tw-empty muted small">First ${CAP} of ${all.length} — narrow the filters or export the CSV.</p>` : "";
    if (_phone()) {
      const inner = st.grp ? grouped(list).map(([k, rs]) => grpHead(k, rs, "li") + rs.map(txCard).join("")).join("") : list.map(txCard).join("");
      return `<ul class="tx-cards">${inner}</ul>` + more;
    }
    const cols = columns(list);
    const head = `<thead><tr>${cols.map(([l, , sk, cls]) => `<th class="${cls.split(" ")[0]}${sk ? " tx-sortable" : ""}"${sk ? ` data-sort="${sk}"${ariaSort(sk)}` : ""}>${esc(l)}</th>`).join("")}</tr></thead>`;
    const row = txRow(cols);
    const rowsHtml = st.grp ? grouped(list).map(([k, rs]) => grpHead(k, rs, "tr", cols.length) + rs.map(row).join("")).join("") : list.map(row).join("");
    return `<div class="tleague-wrap"><table class="tleague tleague-full tx-list tx-m-${st.q ? "search" : st.mode}">${head}<tbody>${rowsHtml}</tbody></table></div>` + more;
  }

  function renderFlow() {
    const list = currentList();
    let strip = "";
    if (!_txDesktop() && !st.q && st.mode !== "mna") {
      // Phone / tablet: a labelled type strip (All + each type) — a Type-facet shortcut.
      const counts = facetCounts("type");
      const types = TX_TYPES.filter((t) => t.group === st.mode && (counts[t.key] || st.f.type.includes(t.key))).sort((a, b) => (counts[b.key] || 0) - (counts[a.key] || 0));
      const one = st.f.type.length === 1 ? st.f.type[0] : null;
      const tchip = (k, label, n, on) => `<button type="button" class="tx-secchip${on ? " is-on" : ""}" data-sub="${esc(k)}">${esc(label)}<span class="tx-secn">${n}</span></button>`;
      if (types.length > 1) strip = `<div class="tx-typestrip tx-secfilter" role="group" aria-label="Filter by transaction type"><span class="tx-striplbl">Type</span>`
        + tchip("", "All", types.reduce((a, t) => a + (counts[t.key] || 0), 0), !st.f.type.length)
        + types.map((t) => tchip(t.key, t.label, counts[t.key] || 0, one === t.key)).join("") + `</div>`;
    }
    const head = st.q ? `<div class="tx-head"><h2 class="tx-title">Search · all transactions</h2>${searchSplit(list)}</div>` : "";
    const empty = `<p class="tw-empty muted small">No ${st.q ? `transactions match “${esc(st.q)}”` : esc(MODE_LABEL[st.mode].toLowerCase()) + " transactions match these filters"}.</p>`;
    body.innerHTML = `<div class="tx-panes-in">${strip}${head}${statsHTML(list)}${list.length ? dealList(list) : empty}</div>`;
  }
  function searchSplit(list) {
    const by = {}; list.forEach((r) => { by[r.mode] = (by[r.mode] || 0) + 1; });
    const split = DEAL_MODES.filter(([k]) => by[k]).map(([k, l]) => `${l} ${by[k]}`).join(" · ");
    return split ? `<p class="tx-blurb"><span class="muted">${esc(split)}</span></p>` : "";
  }

  // ---- the deal drawer -------------------------------------------------------
  // Everything known about one deal, and sideways moves to related ones: the same
  // borrower, the same sponsor, the lender's other deals. Desktop: a panel beside
  // the list. Phone: the list gives way to the deal (Back / ✕ returns to it).
  let _listY = 0;
  const norm = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  function relatedRows(r) {
    const cp = norm(r.cp), sp = norm(r.sponsor);
    const others = rows.filter((x) => x !== r);
    const by = (f) => others.filter(f).sort((a, b) => b.ts - a.ts).slice(0, 6);
    return {
      borrower: cp.length >= 3 ? by((x) => norm(x.cp) === cp) : [],
      sponsor: sp.length >= 3 ? by((x) => norm(x.sponsor) === sp) : [],
      lender: r.d.managerId ? by((x) => x.d.managerId === r.d.managerId) : [],
    };
  }
  const relRow = (x) => `<li class="tmini-row clickable" data-deal="${esc(x.d.id)}"><span class="tmini-t">${esc(x.d.headline || "—")}</span><span class="tmini-m">${esc(fmtDay(x.d.date))} · ${esc(mgrName(x.d.managerId) || "—")}${x.amt ? " · " + esc(fmtAmt(x.amt)) : ""}</span></li>`;
  const srcLink = (d) => d.sourceUrl ? `<a href="${esc(d.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(creditSource(d) || "source")}</a>` : "—";
  function renderDrawer() {
    const r = st.deal && flowMode() ? rowById.get(st.deal) : null;
    host.classList.toggle("tx-has-deal", !!r);
    if (!r) { drawer.hidden = true; drawer.innerHTML = ""; return; }
    const d = r.d;
    const fund = d.fundId && fundById[d.fundId];
    const kind = r.tags.amountKind;
    const amount = r.amt
      ? `${esc(fmtAmt(r.amt))}${r.usd != null && r.amt.ccy !== "USD" ? ` <span class="tf-est">≈ ${esc(fmtUsd(r.usd))}</span>` : ""}${kind && kind !== "financing" ? ` <span class="tf-est">${esc(KIND_LABEL[kind])}</span>` : ""}`
      : "Undisclosed";
    const facts = [
      [r.mode === "mna" ? "Target" : "Borrower / company", r.cp ? esc(r.cp) : "—"],
      ...(r.sponsor ? [["Sponsor", esc(r.sponsor)]] : []),
      [r.mode === "mna" ? "Acquirer" : "Lender / investor", mgrLink(d.managerId)],
      ...(fund ? [["Fund", `<a href="${esc(ctx.base)}/profiles/#/manager/${esc(fund.managerId)}/vehicles">${esc(fund.name)}</a>`]] : []),
      ["Type", `${esc(MODE_LABEL[r.mode])} · ${esc(typeLabel(r.tx))}${r.tags.event ? " · " + esc(EVENT_LABEL[r.tags.event]) : ""}`],
      ["Sector", esc(r.tags.sector)],
      ["Country", r.tags.country
        ? esc(r.tags.country) + (r.tags.countrySource ? ` <span class="tf-est">${esc(BASIS_LABEL[r.tags.countryBasis] || "HQ")} · <a href="${esc(r.tags.countrySource)}" target="_blank" rel="noopener noreferrer">source</a></span>` : "")
        : "—"],
      ["Amount", amount],
      ["Date", esc(fmtDay(d.date))],
      ["Source", srcLink(d)],
      ...r.alt.map((a) => ["Also reported", `${srcLink(a)} <span class="tf-est">${esc(fmtDay(a.date))}</span>`]),
    ];
    const rel = relatedRows(r);
    const relSec = (title, list) => list.length ? `<div class="tpg-h">${esc(title)} <span class="tveh-grp-n">${list.length}</span></div><ul class="tmini">${list.map(relRow).join("")}</ul>` : "";
    drawer.innerHTML = `
      <header class="tpanel-h tx-drawer-h"><button type="button" class="tx-drawer-x" aria-label="Close the deal">‹</button><span>Deal</span></header>
      <div class="tx-drawer-b">
        <h2 class="tx-drawer-t">${esc(d.headline || "")}</h2>
        <ul class="tbiz">${facts.map(([k, v]) => `<li><span class="tbiz-k">${esc(k)}</span><span class="tbiz-v">${v}</span></li>`).join("")}</ul>
        ${d.summary ? `<p class="tx-sum">${esc(d.summary)}</p>` : ""}
        ${relSec("Same borrower", rel.borrower)}
        ${relSec("Same sponsor", rel.sponsor)}
        ${relSec("More from " + (mgrName(d.managerId) || "this lender"), rel.lender)}
      </div>`;
    drawer.hidden = false;
    if (_phone()) window.scrollTo({ top: 0, behavior: "instant" });
    else drawer.scrollTop = 0;
  }
  function openDeal(id) {
    const r = rowById.get(id);
    if (!r) return;
    id = r.d.id;
    if (st.deal === id) return;
    if (!st.deal && _phone()) _listY = window.scrollY;
    st.deal = id; sheetOpen = false; commit(true); renderSheet(); renderActive(); renderDrawer();
    body.querySelectorAll("[data-deal].is-open").forEach((e) => e.classList.remove("is-open"));
    const row = body.querySelector(`[data-deal="${CSS.escape(id)}"]`); if (row) row.classList.add("is-open");
  }
  function closeDeal() {
    if (!st.deal) return;
    // A drawer this view pushed is one history entry — step back so Back and ✕ agree.
    if (history.state && history.state.tx && isActive()) { history.back(); return; }
    st.deal = ""; commit(false); renderDrawer();
    body.querySelectorAll("[data-deal].is-open").forEach((e) => e.classList.remove("is-open"));
    if (_phone()) window.scrollTo({ top: _listY, behavior: "instant" });
  }

  // ---- BDCs ------------------------------------------------------------------
  // The largest US business development companies, LISTED vs PRIVATE (non-traded).
  // Every figure is from the fund's own latest SEC filing / IR release (linked per
  // row); the listed price÷NAV ratio is computed live from /api/quotes. Certifiable
  // data only — an unverified field reads "n/a" rather than a guess.
  const bdcPxNav = (b) => {
    if (b.structure !== "listed" || b.nav == null || !_bdcQuotes) return null;
    const q = _bdcQuotes[b.ticker];
    return (q && q.price != null) ? q.price / b.nav : null;
  };
  const bdcSize = (b) => b.totalAssets != null ? b.totalAssets : (b.netAssets != null ? b.netAssets : (b.portfolio != null ? b.portfolio : null));
  const bdcSizeCell = (b) => b.totalAssets != null ? `$${b.totalAssets}bn`
    : b.netAssets != null ? `$${b.netAssets}bn<span class="tbdc-szt" title="Net assets (aggregate NAV) — total assets not stated in filing">net</span>`
    : b.portfolio != null ? `$${b.portfolio}bn<span class="tbdc-szt" title="Investment portfolio at fair value — total assets not stated in filing">port</span>`
    : "n/a";
  function bdcLiquidityCell(b) {
    if (b.structure === "listed") {
      const r = bdcPxNav(b);
      if (r == null) return `<span class="muted">${b.ticker ? esc(b.ticker) : "listed"}</span>`;
      const prem = r >= 1;
      return `<span class="tbdc-pxnav ${prem ? "is-prem" : "is-disc"}" title="Live price ÷ latest reported NAV — ${prem ? "premium" : "discount"} to NAV">${r.toFixed(2)}×</span>`;
    }
    const parts = [];
    if (b.repurchaseCapPct != null) parts.push(`${b.repurchaseCapPct}% cap`);
    if (b.repurchaseRequestedPct != null) parts.push(`${b.repurchaseRequestedPct}% req`);
    const gated = b.repurchaseProrated === true ? `<span class="tbdc-gated" title="Repurchase requests exceeded the cap and were prorated (gated)">GATED</span>`
      : b.repurchaseProrated === false ? `<span class="tbdc-open" title="Repurchase requests fully honoured last period">honoured</span>` : "";
    if (!parts.length && !gated) return `<span class="muted" title="No verified repurchase figures on file for the latest period">n/a</span>`;
    return `<span class="tbdc-rep">${parts.join(" · ")}${gated ? " " + gated : ""}</span>`;
  }
  function bdcDetail(b) {
    const out = [];
    if (b.totalAssets != null) out.push(["Total assets", `$${b.totalAssets}bn${b.totalAssetsAsOf ? " (" + b.totalAssetsAsOf + ")" : ""}`]);
    if (b.netAssets != null) out.push(["Net assets", `$${b.netAssets}bn aggregate NAV${b.navAsOf ? " (" + b.navAsOf + ")" : ""}`]);
    if (b.portfolio != null) out.push(["Portfolio", `$${b.portfolio}bn at fair value${b.navAsOf ? " (" + b.navAsOf + ")" : ""}`]);
    if (b.nonAccrualFV != null) out.push(["Non-accruals", `${b.nonAccrualFV}% at fair value${b.nonAccrualCost != null ? ", " + b.nonAccrualCost + "% at cost" : ""}${b.nonAccrualAsOf ? " (" + b.nonAccrualAsOf + ")" : ""}`]);
    if (b.nav != null) out.push(["NAV / share", `$${b.nav}${b.navAsOf ? " (" + b.navAsOf + ")" : ""}`]);
    if (b.structure === "nontraded" && (b.repurchaseCapPct != null || b.repurchaseRequestedPct != null || b.repurchaseProrated != null)) {
      const bits = [];
      if (b.repurchaseCapPct != null) bits.push(`${b.repurchaseCapPct}% of NAV quarterly cap`);
      if (b.repurchaseRequestedPct != null) bits.push(`${b.repurchaseRequestedPct}% requested`);
      if (b.repurchaseProrated === true) bits.push("prorated (gated)");
      else if (b.repurchaseProrated === false) bits.push("fully honoured");
      out.push(["Repurchases", bits.join(" · ") + (b.repurchaseAsOf ? " (" + b.repurchaseAsOf + ")" : "")]);
    }
    const facts = out.length ? `<dl class="tbdc-facts">${out.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`
      : `<p class="muted small">No certifiable figures on file yet — see the fund's SEC filings.</p>`;
    const holdCta = b.cik ? `<button type="button" class="tbdc-hold-btn" data-cik="${esc(b.cik)}">Load latest holdings (SEC)</button><div class="tbdc-hold"></div>` : "";
    const srcLinks = (b.sources || []).map((s) => `<a class="tx-src" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`);
    if (b.edgar) srcLinks.push(`<a class="tx-src" href="${esc(b.edgar)}" target="_blank" rel="noopener noreferrer">SEC EDGAR filings</a>`);
    return facts + holdCta + `<div class="tbdc-srcs">${srcLinks.join("<br>")}</div>`;
  }
  const bdcKey = (b) => b.ticker || b.name;
  function bdcRow(b) {
    const i = BDCS.indexOf(b);
    const open = !!st.bdcOpen && (st.bdcOpen === b.ticker || st.bdcOpen === b.name);
    const mgr = b.managerId && mgrName(b.managerId) ? `<a href="${esc(ctx.base)}/profiles/#/manager/${esc(b.managerId)}" class="tx-mgr" data-id="${esc(b.managerId)}">${esc(b.manager)}</a>` : esc(b.manager);
    const tk = b.ticker ? `${esc(b.ticker)}${b.exchange ? `<span class="tbdc-ex">${esc(b.exchange)}</span>` : ""}` : "—";
    const na = b.nonAccrualFV != null
      ? `<span title="${b.nonAccrualCost != null ? b.nonAccrualCost + "% at cost · " : ""}at fair value${b.nonAccrualAsOf ? ", " + esc(b.nonAccrualAsOf) : ""}">${b.nonAccrualFV}%</span>` : "n/a";
    return `<tr class="tbdc-row${open ? " is-open" : ""}" data-i="${i}" data-key="${esc(bdcKey(b))}"><td class="tbdc-nm"><span class="tx-caret" aria-hidden="true">▸</span>${esc(b.name)}</td>`
      + `<td class="tbdc-tk">${tk}</td>`
      + `<td class="tbdc-mg">${mgr}</td>`
      + `<td class="tl-n tbdc-ta">${bdcSizeCell(b)}</td>`
      + `<td class="tl-n tbdc-nav">${b.nav != null ? "$" + b.nav.toFixed(2) : "n/a"}</td>`
      + `<td class="tl-n tbdc-na">${na}</td>`
      + `<td class="tl-n tbdc-lq">${bdcLiquidityCell(b)}</td></tr>`
      + `<tr class="tbdc-exp" data-for="${i}"${open ? "" : " hidden"}><td colspan="7"><div class="tx-exp-in"${open ? ' data-built="1"' : ""}>${open ? bdcDetail(b) : ""}</div></td></tr>`;
  }
  const BDC_VAL = { size: bdcSize, name: (b) => b.name.toLowerCase(), nav: (b) => b.nav, na: (b) => b.nonAccrualFV, pxnav: bdcPxNav };
  function bdcSorted(list) {
    const [k, dir] = st.bdcSort.split("-"), f = BDC_VAL[k] || BDC_VAL.size, sgn = dir === "asc" ? 1 : -1;
    return list.slice().sort((a, b) => {
      const x = f(a), y = f(b);
      if (x == null || y == null) return x == null && y == null ? a.name.localeCompare(b.name) : x == null ? 1 : -1;
      return (x < y ? -1 : x > y ? 1 : 0) * sgn || a.name.localeCompare(b.name);
    });
  }
  const bdcMatch = (b) => { const q = st.bdcQ.toLowerCase(); return !q || b.name.toLowerCase().includes(q) || (b.manager || "").toLowerCase().includes(q) || (b.ticker || "").toLowerCase().includes(q); };
  function renderBDCs() {
    const list = bdcSorted(BDCS.filter(bdcMatch));
    const groups = [
      { key: "listed", label: "Listed", rows: list.filter((b) => b.structure === "listed") },
      { key: "private", label: "Private (non-traded)", rows: list.filter((b) => b.structure !== "listed") },
    ];
    const [sk, sd] = st.bdcSort.split("-");
    const th = (cls, label, k) => `<th class="${cls}${k ? " tx-sortable" : ""}"${k ? ` data-bsort="${k}"${sk === k ? ` aria-sort="${sd === "asc" ? "ascending" : "descending"}"` : ""}` : ""}>${label}</th>`;
    const head = `<thead><tr>${th("tbdc-nm-h", "Fund", "name")}${th("tbdc-tk-h", "Ticker", "")}${th("tbdc-mg-h", "Manager", "")}${th("tbdc-ta-h", "Total assets", "size")}${th("tbdc-nav-h", "NAV / sh", "nav")}${th("tbdc-na-h", "Non-accrual", "na")}${th("tbdc-lq-h", "Px/NAV · liquidity", "pxnav")}</tr></thead>`;
    const section = (g) => g.rows.length
      ? `<section class="tbdc-sec"><h4 class="tbdc-seclbl">${esc(g.label)}<span class="tbdc-seclbl-n">${g.rows.length}</span></h4>`
        + `<div class="tleague-wrap"><table class="tleague tleague-full tbdc-tbl">${head}<tbody>${g.rows.map(bdcRow).join("")}</tbody></table></div></section>`
      : "";
    bdcBody.innerHTML = list.length ? groups.map(section).join("") : `<p class="tw-empty muted small">No BDCs match “${esc(st.bdcQ)}”.</p>`;
    if (st.bdcOpen) { const r = bdcBody.querySelector("tr.tbdc-row.is-open"); if (r) requestAnimationFrame(() => r.scrollIntoView({ block: "center" })); }
  }
  function loadBdcQuotes() {
    if (_bdcQuotesTried) return;
    _bdcQuotesTried = true;
    const syms = [...new Set(BDCS.filter((b) => b.structure === "listed" && b.ticker).map((b) => b.ticker))];
    if (!syms.length) return;
    fetch(`/api/quotes?symbols=${encodeURIComponent(syms.join(","))}`, { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d && d.quotes) { _bdcQuotes = d.quotes; if (st.mode === "bdc") renderBDCs(); } })
      .catch(() => { /* live ratio simply stays hidden */ });
  }
  function loadBdcHoldings(cik, host2, btn) {
    if (host2.dataset.state === "loading" || host2.dataset.state === "loaded") return;
    host2.dataset.state = "loading";
    host2.innerHTML = `<p class="tw-empty muted small">Fetching the latest SEC schedule of investments…</p>`;
    fetch(`/api/bdc?cik=${encodeURIComponent(cik)}`, { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        host2.dataset.state = "loaded";
        if (btn) btn.hidden = true;
        const link = (d && d.source) ? ` — <a href="${esc(d.source)}" target="_blank" rel="noopener noreferrer" class="tx-src">latest filing</a>` : "";
        if (!d || !Array.isArray(d.holdings) || !d.holdings.length) { host2.innerHTML = `<p class="tw-empty muted small">Couldn't parse this filer's schedule of investments automatically${link}.</p>`; return; }
        const usd = (v) => v >= 1e9 ? "$" + (v / 1e9).toFixed(2) + "bn" : v >= 1e6 ? "$" + (v / 1e6).toFixed(0) + "m" : "$" + Math.round(v || 0).toLocaleString("en-US");
        const trs = d.holdings.slice(0, 25).map((h, i) => `<tr><td class="tl-n">${i + 1}</td><td class="tl-nm">${esc(h.name || "—")}</td><td class="tl-n">${usd(h.value)}</td><td class="tl-n">${h.weight != null && isFinite(h.weight) ? (h.weight * 100).toFixed(1) + "%" : "—"}</td></tr>`).join("");
        host2.innerHTML = `<div class="tleague-wrap"><table class="tleague tl-holdings"><thead><tr><th>#</th><th>Portfolio company</th><th>Fair value</th><th>% of book</th></tr></thead><tbody>${trs}</tbody></table></div><p class="muted tbdc-hold-note">Top ${Math.min(25, d.holdings.length)} of ${d.holdings.length} parsed from the latest SEC filing${link}.</p>`;
      })
      .catch(() => { host2.dataset.state = ""; if (btn) { btn.disabled = false; btn.textContent = "Load latest holdings (SEC)"; } host2.innerHTML = `<p class="tw-empty muted small">Holdings unavailable right now — try again shortly.</p>`; });
  }

  // ---- Credits: the European credit universe (ELLI) ---------------------------
  // By sector, with its current issuer rating, borrower domicile and 12-month rating
  // trend; filterable by rating band, trend, jurisdiction and sector. A row opens what
  // the app knows about the name: the tracked deals that NAME it and their lenders.
  const TREND = {
    up: { g: "▲", c: "tx-up", t: "Rating up over the past 12 months" },
    down: { g: "▼", c: "tx-dn", t: "Rating down over the past 12 months" },
    flat: { g: "–", c: "tx-fl", t: "Rating unchanged over the past 12 months" },
  };
  // An obligor's distinctive name, legal-form suffixes stripped ("Verisure Holding
  // AB" → "Verisure"), for matching it in deal copy. Too-short cores never match.
  const LEGAL = /\b(?:holdings?|group|bidco|topco|midco|holdco|lux(?:embourg)?|finance|financing|international|plc|ltd|limited|llc|inc|ab|asa|as|a\/s|sa|sas|sarl|s\.?a\.?r\.?l\.?|s\.?à\.?\s?r\.?l\.?|gmbh|ag|bv|b\.v\.|nv|n\.v\.|spa|s\.p\.a\.|srl|oy|oyj|se|kg|co|corp|corporation|the)\b\.?/gi;
  const coreName = (n) => String(n || "").replace(/\(.*?\)/g, " ").replace(LEGAL, " ").replace(/[^A-Za-z0-9&' -]+/g, " ").replace(/\s+/g, " ").trim();
  const reEsc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function creditMentions(c) {
    const core = coreName(c.name);
    if (core.length < 4) return [];
    const re = new RegExp("\\b" + reEsc(core) + "\\b", "i");
    return rows.filter((r) => re.test((r.d.headline || "") + " " + (r.d.summary || ""))).sort((a, b) => b.ts - a.ts);
  }
  const _crMentions = new Map();
  const mentionsOf = (c) => { if (!_crMentions.has(c.name)) _crMentions.set(c.name, creditMentions(c)); return _crMentions.get(c.name); };
  function crDetail(c) {
    const ms = mentionsOf(c);
    if (!ms.length) return `<p class="tw-empty muted small">No tracked deal names ${esc(coreName(c.name))} yet.</p>`;
    const lenders = [...new Set(ms.map((r) => r.d.managerId).filter((id) => id && mgrName(id)))];
    return (lenders.length ? `<div class="tpg-h">Lenders / investors</div><div class="tcr-lenders">${lenders.map((id) => mgrLink(id)).join("")}</div>` : "")
      + `<div class="tpg-h">Deals naming ${esc(coreName(c.name))} <span class="tveh-grp-n">${ms.length}</span></div><ul class="tmini">${ms.slice(0, 8).map(relRow).join("")}</ul>`;
  }
  const crRow = (c) => {
    const rt = c.rating
      ? (c.source
        ? `<a class="tcr-rt" href="${esc(c.source)}" target="_blank" rel="noopener noreferrer" title="${esc(c.agency || EUR_CREDITS_META.agency)}${c.asOf ? " · as of " + esc(c.asOf) : ""}">${esc(c.rating)}</a>`
        : `<span class="tcr-rt" title="${esc(c.agency || EUR_CREDITS_META.agency)}${c.asOf ? " · as of " + esc(c.asOf) : ""}">${esc(c.rating)}</span>`)
      : `<span class="tcr-rt tcr-nr" title="Rating pending verification">NR</span>`;
    const tr = TREND[c.trend] || TREND.flat;
    const trend = `<span class="tcr-tr ${tr.c}" title="${tr.t} (${esc(c.agency || EUR_CREDITS_META.agency)})">${tr.g}</span>`;
    const open = st.crOpen && st.crOpen === c.name;
    const n = mentionsOf(c).length;
    return `<tr class="tcr-row${open ? " is-open" : ""}" data-cr="${esc(c.name)}" tabindex="0">`
      + `<td class="tcr-nm" title="${esc(c.name)}"><span class="tx-caret" aria-hidden="true">▸</span>${n ? `<span class="tcr-n" title="${n} tracked deal${n === 1 ? "" : "s"} name this credit">${n}</span>` : ""}${esc(c.name)}</td>`
      + `<td class="tcr-jur">${esc(c.jurisdiction || "")}</td>`
      + `<td class="tcr-sec">${esc(c.sector)}</td>`
      + `<td class="tcr-rt-cell"><span class="tcr-rr">${trend}${rt}</span></td>`
      + `</tr>`
      + `<tr class="tcr-exp"${open ? "" : " hidden"}><td colspan="4"><div class="tx-exp-in">${open ? crDetail(c) : ""}</div></td></tr>`;
  };
  const CRVAL = { rating: (c) => ratingBand(c.rating), trend: (c) => c.trend || "flat", jur: (c) => c.jurisdiction || "", sector: (c) => c.sector || "" };
  const crHit = (c) => { const q = st.crQ.toLowerCase(); return !q || `${c.name} ${c.sector} ${c.rating || ""} ${c.jurisdiction || ""}`.toLowerCase().includes(q); };
  const crPasses = (c, except) => crHit(c) && CR_FACETS.every((k) => k === except || !st.cr[k].length || st.cr[k].includes(CRVAL[k](c)));
  function crList() {
    const filtered = EUR_CREDITS.filter((c) => crPasses(c));
    const byName = (a, b) => a.name.localeCompare(b.name);
    if (st.crSort === "name") return filtered.slice().sort(byName);
    if (st.crSort === "rating" || (!st.crSort && st.crGroup === "rating")) return filtered.slice().sort((a, b) => ratingRank(a.rating) - ratingRank(b.rating) || byName(a, b));
    if (st.crSort === "rating-worst") return filtered.slice().sort((a, b) => (ratingRank(b.rating) === 999 ? -1 : ratingRank(b.rating)) - (ratingRank(a.rating) === 999 ? -1 : ratingRank(a.rating)) || byName(a, b));
    if (st.crSort === "deals") return filtered.slice().sort((a, b) => mentionsOf(b).length - mentionsOf(a).length || byName(a, b));
    return creditsBySector(filtered).flatMap(([, arr]) => arr);
  }
  const crOptLabel = (k, v) => k === "rating" ? (RATING_BANDS.find(([x]) => x === v) || [])[1] || v : k === "trend" ? (TREND_OPTS.find(([x]) => x === v) || [])[1] || v : v;
  const CR_TITLE = { rating: "Rating", trend: "12-month trend", jur: "Jurisdiction", sector: "Sector" };
  function renderCrActive() {
    const el = host.querySelector("#tx-cr-active");
    const pills = [];
    for (const k of CR_FACETS) for (const v of st.cr[k]) pills.push([`${k}:${v}`, crOptLabel(k, v)]);
    el.hidden = !pills.length;
    el.innerHTML = pills.map(([k, l]) => `<button type="button" class="tx-pill" data-crclear="${esc(k)}" aria-label="Remove filter: ${esc(l)}">${esc(l)}<span aria-hidden="true">✕</span></button>`).join("")
      + (pills.length ? `<button type="button" class="tx-clear" data-crclear="all">Clear all</button>` : "");
    const n = CR_FACETS.reduce((a, k) => a + st.cr[k].length, 0);
    const fb = host.querySelector("#tx-cr-filters");
    fb.textContent = n ? `Filters (${n})` : "Filters"; fb.classList.toggle("is-on", crSheetOpen); fb.setAttribute("aria-expanded", String(crSheetOpen));
  }
  function renderCrSheet() {
    crSheet.hidden = !(crSheetOpen && st.mode === "credits");
    host.classList.toggle("tx-crsheet-open", !crSheet.hidden);
    if (crSheet.hidden) { crSheet.innerHTML = ""; return; }
    const block = (k) => {
      const counts = {}; EUR_CREDITS.forEach((c) => { if (crPasses(c, k)) { const v = CRVAL[k](c); counts[v] = (counts[v] || 0) + 1; } });
      const opts = k === "rating" ? RATING_BANDS : k === "trend" ? TREND_OPTS
        : [...new Set(EUR_CREDITS.map(CRVAL[k]).filter(Boolean))].sort().map((v) => [v, v]);
      const shown = opts.filter(([v]) => counts[v] || st.cr[k].includes(v));
      if (!shown.length) return "";
      return `<div class="tx-fgrp" data-fgrp="${k}"><div class="tx-fh">${esc(CR_TITLE[k])}</div><div class="tx-fchips">`
        + shown.map(([v, l]) => fchip(`data-crfacet="${k}" data-v="${esc(v)}"`, l, counts[v] || 0, st.cr[k].includes(v))).join("") + `</div></div>`;
    };
    const n = crList().length;
    crSheet.innerHTML = `<div class="tx-sheet-b">${CR_FACETS.map(block).join("")}</div>`
      + `<div class="tx-sheet-f"><button type="button" class="tx-clear" data-crclear="all">Clear all</button><button type="button" class="tx-sheet-done">Show ${n} credit${n === 1 ? "" : "s"}</button></div>`;
  }
  function renderCredits() {
    renderCrActive(); renderCrSheet();
    if (!EUR_CREDITS.length) {
      creditsBody.innerHTML = `<p class="tw-empty muted small">The European credit universe (anchored to the ${esc(EUR_CREDITS_META.index)}) is being compiled — sourced names and ratings land here as they’re verified.</p>`;
      return;
    }
    const list = crList();
    const down = list.filter((c) => c.trend === "down").length, up = list.filter((c) => c.trend === "up").length;
    const th = (label, k) => `<th class="tx-sortable" data-crsort="${k}"${st.crSort === k ? ` aria-sort="${k === "deals" || k === "rating-worst" ? "descending" : "ascending"}"` : ""}>${label}</th>`;
    creditsBody.innerHTML = list.length
      ? `<div class="tx-stats"><span><b>${list.length}</b> credit${list.length === 1 ? "" : "s"}</span><span><b>${down}</b> ▼ downgraded</span><span><b>${up}</b> ▲ upgraded</span></div>`
        + `<div class="tleague-wrap tcr-wrap"><table class="tcr-tbl">`
        + `<colgroup><col class="c-nm"><col class="c-jur"><col class="c-sec"><col class="c-rt"></colgroup>`
        + `<thead><tr>${th("Borrower", "name")}<th>Jurisdiction</th><th>Sector</th>${th("Rating", "rating")}</tr></thead>`
        + `<tbody>${list.map(crRow).join("")}</tbody></table></div>`
      : `<p class="tw-empty muted small">No credits match these filters.</p>`;
    if (st.crOpen) { const r = creditsBody.querySelector("tr.tcr-row.is-open"); if (r) requestAnimationFrame(() => r.scrollIntoView({ block: "center" })); }
  }

  // ---- CSV export: exactly what the active view shows (filters + search applied) ----
  function exportCSV(kind) {
    if (kind === "flow") {
      const list = currentList();
      downloadCSV(`wire-transactions-${st.q ? "search" : st.mode}`,
        ["Date", "Borrower / company", "Sponsor", "Lender / investor", "Group", "Type", "Sector", "Country", "Country basis", "Country source", "Region", "Amount (reported)", "Amount kind", "Amount (USD, approx.)", "CLO event", "Headline", "Source", "Other sources"],
        list.map((r) => [r.d.date, r.cp, r.sponsor, mgrName(r.d.managerId), MODE_LABEL[r.mode], typeLabel(r.tx), r.tags.sector, r.tags.country || "", r.tags.country ? (r.tags.countrySource ? `${BASIS_LABEL[r.tags.countryBasis] || "HQ"} (researched)` : "deal text") : "", r.tags.countrySource || "", REGION_LABEL[r.tags.region] || "",
          r.amt ? fmtAmt(r.amt) : "", r.tags.amountKind || "", r.usd != null ? Math.round(r.usd) : "", r.tags.event || "", r.d.headline || "", r.d.sourceUrl || "", r.alt.map((a) => a.sourceUrl).filter(Boolean).join(" ")]));
    } else if (kind === "credits") {
      downloadCSV("wire-eu-credits", ["Borrower", "Jurisdiction", "Sector", "Rating", "Agency", "Rating as of", "12m trend", "Tracked deals naming it", "Source"],
        crList().map((c) => [c.name, c.jurisdiction || "", c.sector || "", c.rating || "NR", c.agency || EUR_CREDITS_META.agency, c.asOf || "", c.trend || "flat", mentionsOf(c).length, c.source || ""]));
    } else {
      downloadCSV("wire-bdcs", ["Fund", "Ticker", "Exchange", "Structure", "Manager", "Total assets ($bn)", "Net assets ($bn)", "Portfolio ($bn)", "NAV / share ($)", "NAV as of", "Non-accrual FV (%)", "Non-accrual cost (%)", "Px/NAV (live)", "SEC EDGAR"],
        bdcSorted(BDCS.filter(bdcMatch)).map((b) => [b.name, b.ticker || "", b.exchange || "", b.structure, b.manager || "", b.totalAssets ?? "", b.netAssets ?? "", b.portfolio ?? "", b.nav ?? "", b.navAsOf || "", b.nonAccrualFV ?? "", b.nonAccrualCost ?? "", bdcPxNav(b) != null ? bdcPxNav(b).toFixed(2) : "", b.edgar || ""]));
    }
  }

  // ---- render ----------------------------------------------------------------
  function syncControls() {
    const set = (sel, v) => { const el = host.querySelector(sel); if (el && el.value !== v) el.value = v; };
    set("#tx-q", st.q); set("#tx-cr-q", st.crQ); set("#tx-bdc-q", st.bdcQ);
    set("#tx-sort", `${st.sort}-${st.dir}`); set("#tx-grp", st.grp);
    set("#tx-cr-sort", st.crSort); set("#tx-bdc-sort", st.bdcSort);
    const f = host.querySelector("#tx-focus");
    if (f) {
      f.setAttribute("aria-pressed", st.focus ? "true" : "false"); f.classList.toggle("is-on", !!st.focus);
      f.dataset.focus = st.focus;
      f.textContent = st.focus === "target" ? "Target" : "$1–15bn";
      f.title = st.focus === "" ? "AUM focus — show only $1–15bn AUM managers"
        : st.focus === "band" ? "Showing $1–15bn AUM managers — tap again for Target managers (European, ≤ $15bn, 15%+ strategy)"
        : "Showing Target managers (European, ≤ $15bn, 15%+ strategy) — tap again to clear";
    }
    host.querySelectorAll("#tx-cr-ctl .tcr-grpbtn").forEach((b) => { const on = b.dataset.crgroup === st.crGroup; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", String(on)); });
  }
  // Show the active mode's chrome + body. Driven with inline display (the headers
  // carry a CSS display that beats the UA [hidden] rule).
  function showMode() {
    const show = (ids, on) => ids.forEach((id) => { const el = host.querySelector("#" + id); if (el) el.style.display = on ? "" : "none"; });
    show(["tx-flow-search", "tx-body"], flowMode());
    show(["tx-credits-search", "tx-credits-body"], st.mode === "credits");
    show(["tx-bdc-search", "tx-bdc-body"], st.mode === "bdc");
  }
  function render() {
    renderModeNav();
    if (flowMode()) renderFlow();
    renderSheet();
    if (st.mode === "credits") renderCredits(); else renderCrSheet();
    if (st.mode === "bdc") { renderBDCs(); loadBdcQuotes(); }
    renderDrawer();
  }
  // A state change from a control: update, record in the URL, re-render.
  function change(patch, push = true) {
    Object.assign(st, patch);
    commit(push); syncControls(); showMode(); render();
  }
  const withF = (k, vals) => ({ f: { ...st.f, [k]: vals }, deal: "" });
  const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  // ---- events (delegated) --------------------------------------------------
  host.querySelector("#tx-mode").addEventListener("click", (e) => {
    const b = e.target.closest(".tchip[data-mode]"); if (!b) return;
    if (b.dataset.mode === st.mode) { if (st.deal) change({ deal: "" }); return; }   // the active mode → back to its list
    // Filters carry across the deal-flow modes, except Type (types belong to a mode).
    change({ mode: b.dataset.mode, f: { ...st.f, type: [] }, deal: "" });
  });
  let _qT = null;
  host.querySelector("#tx-q").addEventListener("input", (e) => {
    st.q = e.target.value.trim(); st.deal = "";
    render();
    clearTimeout(_qT); _qT = setTimeout(() => commit(false), 250);   // typing replaces, never stacks history
  });
  host.querySelector("#tx-cr-q").addEventListener("input", (e) => { st.crQ = e.target.value.trim(); st.crOpen = ""; renderCredits(); clearTimeout(_qT); _qT = setTimeout(() => commit(false), 250); });
  host.querySelector("#tx-bdc-q").addEventListener("input", (e) => { st.bdcQ = e.target.value.trim(); st.bdcOpen = ""; renderBDCs(); clearTimeout(_qT); _qT = setTimeout(() => commit(false), 250); });
  host.querySelector("#tx-cr-ctl").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-crgroup]"); if (!btn) return;
    const mode = btn.dataset.crgroup === "rating" ? "rating" : "sector";
    change({ crGroup: st.crGroup === mode ? null : mode, crSort: "" });
  });
  host.querySelector("#tx-focus").addEventListener("click", () => change({ focus: FOCUS_NEXT[st.focus], deal: "" }));
  host.addEventListener("change", (e) => {
    const t = e.target;
    if (t.matches("select[data-ctl='sort']")) { const [k, d] = t.value.split("-"); change({ sort: k, dir: d }, !sheetOpen); return; }
    if (t.matches("select[data-ctl='grp']")) { change({ grp: t.value }, !sheetOpen); return; }
    if (t.id === "tx-from" || t.id === "tx-to") {
      let from = host.querySelector("#tx-from").value || "", to = host.querySelector("#tx-to").value || "";
      if (from && to && from > to) [from, to] = [to, from];
      change({ from, to, period: "all", deal: "" }, false); return;
    }
    if (t.id === "tx-cr-sort") { change({ crSort: t.value, crGroup: null }); return; }
    if (t.id === "tx-bdc-sort") { change({ bdcSort: t.value }); return; }
  });
  host.addEventListener("click", (e) => {
    // Lender / manager links → the profile (in-app, a history entry).
    const mgr = e.target.closest("a.tx-mgr");
    if (mgr) { e.preventDefault(); ctx.navigate(`${ctx.base}/profiles/#/manager/${mgr.dataset.id}`); return; }
    if (e.target.closest("a")) return;                                   // source links etc. keep native behaviour
    // Filters sheets.
    if (e.target.closest("#tx-filters")) { sheetOpen = !sheetOpen; renderSheet(); renderActive(); return; }
    if (e.target.closest("#tx-cr-filters")) { crSheetOpen = !crSheetOpen; renderCrSheet(); renderCrActive(); return; }
    if (e.target.closest(".tx-sheet-done")) {
      sheetOpen = false; crSheetOpen = false; render();
      if (_phone()) window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    const fc = e.target.closest("[data-facet]");
    if (fc) { const k = fc.dataset.facet; change(withF(k, toggle(st.f[k], fc.dataset.v)), false); return; }
    if (e.target.closest("[data-europe]")) {
      const counts = facetCounts("region"), eu = EUROPE_REGIONS.filter((v) => counts[v]);
      const on = eu.every((v) => st.f.region.includes(v));
      change(withF("region", on ? st.f.region.filter((v) => !EUROPE_REGIONS.includes(v)) : [...new Set([...st.f.region, ...EUROPE_REGIONS])]), false); return;
    }
    if (e.target.closest("[data-fmore]")) { lenderAll = true; renderSheet(); return; }
    const per = e.target.closest("[data-period]");
    if (per) { change({ period: per.dataset.period, from: "", to: "", deal: "" }, false); return; }
    const rng = e.target.closest("[data-from]");
    if (rng) {
      const on = st.from === rng.dataset.from && st.to === rng.dataset.to;
      change(on ? { from: "", to: "", deal: "" } : { from: rng.dataset.from, to: rng.dataset.to, period: "all", deal: "" }, false); return;
    }
    const crf = e.target.closest("[data-crfacet]");
    if (crf) { const k = crf.dataset.crfacet; change({ cr: { ...st.cr, [k]: toggle(st.cr[k], crf.dataset.v) }, crOpen: "" }, false); return; }
    const crc = e.target.closest("[data-crclear]");
    if (crc) {
      const k = crc.dataset.crclear;
      if (k === "all") change({ cr: emptyCr(), crOpen: "" });
      else { const i = k.indexOf(":"), f = k.slice(0, i), v = k.slice(i + 1); change({ cr: { ...st.cr, [f]: st.cr[f].filter((x) => x !== v) } }); }
      return;
    }
    const clr = e.target.closest("[data-clear]");
    if (clr) {
      const k = clr.dataset.clear;
      if (k === "all") change({ f: emptyF(), period: "all", from: "", to: "", focus: "", grp: "", q: "", deal: "" });
      else if (k === "date") change({ period: "all", from: "", to: "", deal: "" });
      else if (k === "focus") change({ focus: "", deal: "" });
      else if (k === "europe") change(withF("region", st.f.region.filter((v) => !EUROPE_REGIONS.includes(v))));
      else { const i = k.indexOf(":"), f = k.slice(0, i), v = k.slice(i + 1); if (st.f[f]) change(withF(f, st.f[f].filter((x) => x !== v))); }
      return;
    }
    if (e.target.closest(".tx-drawer-x")) { closeDeal(); return; }
    const csvb = e.target.closest(".tx-csv");
    if (csvb) { exportCSV(csvb.dataset.csv); return; }
    // Sortable column headers.
    const sh = e.target.closest("th[data-sort]");
    if (sh) { const k = sh.dataset.sort; change(st.sort === k ? { dir: st.dir === "asc" ? "desc" : "asc" } : { sort: k, dir: SORT_DEFAULT_DIR[k] }, false); return; }
    const bh = e.target.closest("th[data-bsort]");
    if (bh) {
      const k = bh.dataset.bsort, [ck, cd] = st.bdcSort.split("-");
      const def = (BDC_SORTS.find(([v]) => v.startsWith(k + "-")) || [k + "-desc"])[0].split("-")[1];
      change({ bdcSort: `${k}-${ck === k ? (cd === "asc" ? "desc" : "asc") : def}` }, false); return;
    }
    const ch = e.target.closest("th[data-crsort]");
    if (ch) { const k = ch.dataset.crsort; change({ crSort: st.crSort === k ? (k === "rating" ? "rating-worst" : "") : k, crGroup: null }, false); return; }
    // Type shortcuts (desktop rail + phone strip) — set the Type facet to one type.
    const subt = e.target.closest(".tx-subnav [data-sub], .tx-typestrip [data-sub]");
    if (subt) { const v = subt.dataset.sub ? [subt.dataset.sub] : []; if (v.join() !== st.f.type.join()) change(withF("type", v)); return; }
    // A deal (row, card, or a related-deal row in the drawer / a credit) → its drawer.
    const dl = e.target.closest("[data-deal]");
    if (dl) {
      if (st.mode === "credits") {
        const r = rowById.get(dl.dataset.deal);
        if (r) { Object.assign(st, { mode: r.mode, f: emptyF(), period: "all", from: "", to: "", focus: "", grp: "", q: "" }); syncControls(); showMode(); render(); openDeal(r.d.id); }
        return;
      }
      openDeal(dl.dataset.deal); return;
    }
    // BDC roster: holdings fetch; row expand (recorded as ?open=).
    const hb = e.target.closest(".tbdc-hold-btn");
    if (hb) { e.stopPropagation(); hb.disabled = true; hb.textContent = "Loading…"; loadBdcHoldings(hb.dataset.cik, hb.nextElementSibling, hb); return; }
    const brow = e.target.closest("tr.tbdc-row");
    if (brow) {
      const exp = brow.nextElementSibling;
      if (exp && exp.classList.contains("tbdc-exp")) {
        const opening = exp.hasAttribute("hidden");
        if (opening) { const inner = exp.querySelector(".tx-exp-in"); if (!inner.dataset.built) { inner.innerHTML = bdcDetail(BDCS[+brow.dataset.i]); inner.dataset.built = "1"; } }
        exp.hidden = !opening; brow.classList.toggle("is-open", opening);
        st.bdcOpen = opening ? brow.dataset.key : ""; commit(false);
      }
      return;
    }
    // Credits: a row opens the deals that name it + their lenders.
    const crow = e.target.closest("tr.tcr-row");
    if (crow) {
      const exp = crow.nextElementSibling;
      const opening = exp.hasAttribute("hidden");
      if (opening) { const c = EUR_CREDITS.find((x) => x.name === crow.dataset.cr); exp.querySelector(".tx-exp-in").innerHTML = c ? crDetail(c) : ""; }
      exp.hidden = !opening; crow.classList.toggle("is-open", opening);
      st.crOpen = opening ? crow.dataset.cr : ""; commit(false);
    }
  });
  host.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && (sheetOpen || crSheetOpen)) { sheetOpen = crSheetOpen = false; render(); return; }
    if (e.key === "Escape" && st.deal) { closeDeal(); return; }
    const row = e.target.closest && e.target.closest("[data-deal], tr.tcr-row");
    if (row && e.target === row && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); row.click(); }
  });
  // Back / Forward inside Transactions (hash-only history moves) → re-apply the URL.
  window.addEventListener("hashchange", () => { if (isActive()) applyHash(); });
  // Crossing the phone / desktop breakpoints swaps cards ↔ table and rail ↔ strip.
  for (const q of ["(min-width:901px)", "(max-width:760px)"]) {
    try { window.matchMedia(q).addEventListener("change", () => { if (isActive()) render(); }); } catch { /* old engines */ }
  }

  applyHash();
  return {
    enter() { applyHash(); },
    leave() {},
    // home(): re-tapping the Transactions tab resets it to its first part —
    // Lending, no search, default filters, sheets closed, scrolled to top.
    home() {
      st = DEFAULT(); sheetOpen = crSheetOpen = lenderAll = false;
      commit(false); syncControls(); showMode(); render();
      window.scrollTo({ top: 0, behavior: "instant" });
    },
  };
}
