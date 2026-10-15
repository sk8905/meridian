// =============================================================================
// v2/js/transactions/app.js — the Transactions tab: the covered managers' deal
// flow organised by TRANSACTION TYPE. Four modes — Lending · Structured credit ·
// Secondaries (the deal-flow groups of credit/js/tx.js) · Manager M&A (acquisitions of /
// stakes in asset managers, kept out of credit deal flow). The European credits and BDC
// rosters moved to Dashboard ▸ Credit (v2/js/credit-roster.js, 2026-10); their old
// #/credits · #/bdc links redirect there.
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
//   #/credits?q=&open= · #/bdc?open=  (legacy → /v2/dashboard/credit?credit= · ?bdc=)
//   #/deal/<id>  (deep link — canonicalised to that deal's mode with the drawer open)
// mount(host, ctx) → { enter, leave, home }.
// =============================================================================
import { deals, managers, funds, fundById } from "/credit/js/data.js";
import { DEAL_TAGS } from "/credit/js/deal-tags.js";
import { targetFit } from "/credit/js/target.js";
import { TX_TYPES, TX_GROUPS, SECTOR_TAGS, REGIONS, REGION_LABEL, EUROPE_REGIONS, txOf, amountOf, toUsd, fmtAmt, fmtUsd, tagsOf, sizeCounts } from "/credit/js/tx.js";
import { esc } from "/util.js";
import { fmtDay, fmtDateP } from "/feed.js";
import { dealCounterparty, dealSponsor, dealPartyRole } from "../deal-parse.js";
import { creditSource } from "/credit/js/shared.js";
import { downloadCSV } from "../csv.js";
import { advisersFor, dealTerms } from "../deal-advisers.js";

const _mById = new Map(managers.map((m) => [m.id, m]));
const mgrName = (id) => (_mById.get(id) || {}).name || "";
const DAY = 864e5;

// The AUM / target-market lens shared with Profiles: "" (all) · "band" ($1–15bn group /
// parent AUM; banks / originators never qualify) · "target" (the owner's target market:
// European, ≤ $15bn, a 15%+ strategy — credit/js/target.js "core"). The bar's Target
// button toggles Target; the Filters panel's Managers row offers all three.
const inFocusAum = (aum) => aum != null && aum >= 1 && aum <= 15;
const focusAumOf = (m) => (!m || m.notAum ? null : (m.aumTotal != null ? m.aumTotal : m.aum));
const mInBand = (m) => inFocusAum(focusAumOf(m));
const _fundsBy = new Map();
for (const f of funds) { if (!_fundsBy.has(f.managerId)) _fundsBy.set(f.managerId, []); _fundsBy.get(f.managerId).push(f); }
const _tier = new Map(managers.map((m) => [m.id, targetFit(m, _fundsBy.get(m.id) || []).tier]));
const mIsTarget = (id) => _tier.get(id) === "core";
const FOCUS_PILL = { band: "$1–15bn AUM", target: "European mid-market managers" };

const DEAL_MODES = [...TX_GROUPS.map((g) => [g.key, g.label]), ["mna", "Manager M&A"]];
const FLOW = DEAL_MODES.map(([k]) => k);                       // lending · structured · secondary · mna
const MODES = DEAL_MODES;
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
// The audited role of the deal's counterparty (deal-tags `r`) → its drawer label.
const ROLE_LABEL = { borrower: "Borrower / company", issuer: "Issuer", target: "Target", fund: "Fund / vehicle", seller: "Seller", none: "Counterparty" };
const EVENT_LABEL = { new: "New issue", reset: "Reset", refi: "Refi" };
const SORTS = [["date-desc", "Newest"], ["date-asc", "Oldest"], ["size-desc", "Largest"], ["size-asc", "Smallest"], ["lender-asc", "Lender A–Z"], ["name-asc", "Name A–Z"]];
const SORT_DEFAULT_DIR = { date: "desc", size: "desc", lender: "asc", name: "asc" };
const GROUPS = [["", "No grouping"], ["lender", "By lender"], ["month", "By month"], ["sector", "By sector"], ["region", "By region"], ["type", "By type"]];
// URL keys per facet.
const FKEYS = { type: "type", sector: "sec", region: "reg", size: "size", ccy: "ccy", sponsor: "sp", lender: "lender" };
const FACETS = Object.keys(FKEYS);
const emptyF = () => Object.fromEntries(FACETS.map((k) => [k, []]));

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
        // Other outlets' reports of this same deal: merged-away duplicates
        // (scripts/dedupe-data.mjs keeps their URLs as alsoReported) plus any
        // same-deal row folded in below.
        alt: (d.alsoReported || []).map((a) => ({ id: d.id, sourceUrl: a.url, date: a.date, headline: a.headline })),
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
  // scope: "eu" (default — the reader is a European credit fund) | "all". Europe = the
  // EUROPE_REGIONS of the deal's borrower/asset country; a search, an explicit Region
  // facet or Manager M&A always spans every region (review 2026-10-15, #5).
  const DEFAULT = () => ({ mode: "lending", q: "", deal: "", sort: "date", dir: "desc", grp: "", f: emptyF(), period: "all", from: "", to: "", focus: "", scope: "eu" });
  let st = DEFAULT();
  let sheetOpen = false, lenderAll = false, moreOpen = false, customDate = false;
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
  const scopeOn = () => st.scope === "eu" && !st.q && !st.f.region.length && st.mode !== "mna";
  const inScope = (r) => !scopeOn() || EUROPE_REGIONS.includes(r.tags.region);
  const passes = (r, except) => inDate(r) && inFocus(r) && inScope(r) && FACETS.every((k) => k === except || !st.f[k].length || st.f[k].includes(FVAL[k](r)));
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
      if (st.scope === "all") p.set("scope", "all");
      if (st.q) p.set("q", st.q);
      if (st.sort !== "date" || st.dir !== "desc") p.set("sort", `${st.sort}-${st.dir}`);
      if (st.grp) p.set("grp", st.grp);
      if (st.deal) p.set("deal", st.deal);
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
      if (!EUROPE_REGIONS.includes(r.tags.region)) s.scope = "all";   // keep the deal's row in the list
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
      s.scope = q.get("scope") === "all" ? "all" : "eu";
      if (q.get("deal") && rowById.has(q.get("deal")) && !EUROPE_REGIONS.includes(rowById.get(q.get("deal")).tags.region)) s.scope = "all";
      const [sk, sd] = (q.get("sort") || "").split("-");
      if (SORT_VAL[sk]) { s.sort = sk; s.dir = sd === "asc" ? "asc" : sd === "desc" ? "desc" : SORT_DEFAULT_DIR[sk]; }
      if (GROUPS.some(([k]) => k && k === q.get("grp"))) s.grp = q.get("grp");
      if (q.get("deal") && rowById.has(q.get("deal"))) s.deal = rowById.get(q.get("deal")).d.id;
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
  // The rosters that used to be modes here now live on Dashboard ▸ Credit.
  function legacyRoster(raw) {
    const [pathPart, qs = ""] = String(raw || "").replace(/^#/, "").split("?");
    const seg = pathPart.split("/").filter(Boolean)[0], q = new URLSearchParams(qs);
    if (seg === "credits") { const v = q.get("open") || q.get("q"); return `${ctx.base}/dashboard/credit${v ? "?credit=" + encodeURIComponent(v) : ""}#dsh-credits`; }
    if (seg === "bdc") { const v = q.get("open"); return `${ctx.base}/dashboard/credit${v ? "?bdc=" + encodeURIComponent(v) : ""}#dsh-bdcs`; }
    return "";
  }
  function applyHash() {
    const legacy = isActive() && legacyRoster(location.hash);
    if (legacy) { try { history.replaceState(history.state, "", location.pathname + location.search); } catch { /* */ } ctx.navigate(legacy); return; }
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
  // The Filters button: a sliders glyph (SVG, so iOS never swaps in an emoji) + a count.
  const filtSvg = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="9" cy="6" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/><circle cx="7" cy="18" r="2" fill="currentColor"/></svg>`;
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
            <!-- One row per mode: search · (Target) · ⚙ Filters. Everything else — fit, type,
                 dates, facets, sort / group, CSV — lives in the Filters panel (R39e). -->
            <header class="tpanel-h thead-search tx-bar" id="tx-flow-search">
              <input type="search" id="tx-q" class="tsearch" placeholder="Search deals, managers…" aria-label="Search transactions">
              <button type="button" class="tfocus-btn tx-scope" id="tx-scope" aria-pressed="true">Europe</button>
              <button type="button" class="tfocus-btn tfocus-aum" id="tx-focus" aria-pressed="false">European mid-market</button>
              <button type="button" class="tx-fbtn" id="tx-filters" aria-expanded="false" aria-controls="tx-sheet" aria-label="Filters">${filtSvg}<span class="tx-fn"></span></button>
              <div class="tx-active" id="tx-active" hidden></div>
            </header>
            <div class="tx-asof" id="tx-asof" hidden></div>
            <div class="tx-sheet" id="tx-sheet" role="region" aria-label="Filters" hidden></div>
            <div class="tx-scroll" id="tx-body"></div>
            <aside class="tx-drawer" id="tx-drawer" role="region" aria-label="Deal" hidden></aside>
          </div>
        </section>
      </div>
    </div>`;
  const body = host.querySelector("#tx-body");
  const drawer = host.querySelector("#tx-drawer");
  const sheet = host.querySelector("#tx-sheet");

  // ---- freshness cue -------------------------------------------------------
  // The newest dated deal in the ledger; older than TX_STALE_DAYS → a stale flag, so
  // a quiet pipeline is visible instead of being masked by the back-catalogue.
  const TX_STALE_DAYS = 7;
  let _newestRow = null;
  for (const r of rows) if (!_newestRow || r.ts > _newestRow.ts) _newestRow = r;
  function renderAsOf() {
    const el = host.querySelector("#tx-asof");
    if (!el) return;
    const ageDays = _newestRow ? Math.round((Date.now() - _newestRow.ts) / DAY) : 0;
    const stale = ageDays > TX_STALE_DAYS;
    // A fresh ledger needs no banner — its date rides in the stats line; only a stale
    // ledger gets its own line (the "awaiting fresh filings" flag).
    if (!flowMode() || !_newestRow || !stale) { el.hidden = true; el.innerHTML = ""; return; }
    el.hidden = false;
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

  // ---- the active-filter summary + the Filters button count ------------------
  // One quiet line, only when something narrows the list: "Direct lending, UK & Ireland,
  // Target · Clear". The values themselves are edited in the Filters panel.
  const setFbtn = (sel, n, open) => {
    const fb = host.querySelector(sel); if (!fb) return;
    fb.querySelector(".tx-fn").textContent = n ? String(n) : "";
    fb.classList.toggle("is-on", open); fb.classList.toggle("has-n", !!n);
    fb.setAttribute("aria-expanded", String(open)); fb.setAttribute("aria-label", n ? `Filters (${n})` : "Filters");
  };
  const summaryHTML = (labels, clearAttr) => labels.length
    ? `<span class="tx-sum">${esc(labels.join(", "))}</span><button type="button" class="tx-clear" ${clearAttr}>Clear</button>` : "";
  function activeLabels() {
    const out = [];
    const allEu = EUROPE_REGIONS.every((v) => st.f.region.includes(v));
    for (const k of FACETS) for (const v of st.f[k]) if (!(allEu && k === "region" && EUROPE_REGIONS.includes(v))) out.push(optLabel(k, v));
    if (allEu) out.push("Europe");
    const dl = dateLabel(); if (dl) out.push(dl);
    if (st.focus) out.push(FOCUS_PILL[st.focus]);
    return out;
  }
  function renderActive() {
    const el = host.querySelector("#tx-active");
    if (!el) return;
    const labels = flowMode() ? activeLabels() : [];
    el.hidden = !labels.length;
    el.innerHTML = summaryHTML(labels, `data-clear="all"`);
    setFbtn("#tx-filters", nSelected() + (st.focus === "band" ? 1 : 0), sheetOpen);
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
  // Date: ONE menu — presets, years, the last six quarters, or a custom month range.
  const ymd = (a, b) => `r:${a}:${b}`;
  function dateValue() {
    if (customDate) return "custom";
    if (!st.from && !st.to) return st.period;
    const v = ymd(st.from, st.to);
    const known = YEARS.some((y) => ymd(`${y}-01`, `${y}-12`) === v) || QUARTERS.some(([, a, b]) => ymd(a, b) === v);
    return known ? v : "custom";
  }
  function dateBlock() {
    const val = dateValue();
    const o = (v, l) => `<option value="${esc(v)}"${v === val ? " selected" : ""}>${esc(l)}</option>`;
    const sel = `<select class="tx-filt tx-fdate" id="tx-date" aria-label="Date range">`
      + o("all", "All dates") + Object.entries(PERIOD_LABEL).map(([k, l]) => o(k, l)).join("")
      + `<optgroup label="Year">${YEARS.map((y) => o(ymd(`${y}-01`, `${y}-12`), y)).join("")}</optgroup>`
      + `<optgroup label="Quarter">${QUARTERS.map(([l, a, b]) => o(ymd(a, b), l)).join("")}</optgroup>`
      + o("custom", "Custom range…") + `</select>`;
    const lo = rows.reduce((m, r) => (ym(r) < m ? ym(r) : m), "9999-12"), hi = new Date(now).toISOString().slice(0, 7);
    const range = val === "custom" ? `<div class="tx-frange"><label>From <input type="month" id="tx-from" min="${lo}" max="${hi}" value="${esc(st.from)}"></label><label>To <input type="month" id="tx-to" min="${lo}" max="${hi}" value="${esc(st.to)}"></label></div>` : "";
    return `<div class="tx-fgrp" data-fgrp="date"><div class="tx-fh">Date</div>${sel}${range}</div>`;
  }
  // Fit: the AUM / target-market lens (the bar's Target button is its one-tap shortcut).
  const fitBlock = () => `<div class="tx-fgrp" data-fgrp="fit"><div class="tx-fh">Managers</div><div class="tx-fchips">`
    + [["", "All"], ["band", "$1–15bn AUM"], ["target", "European mid-market"]].map(([v, l]) => fchip(`data-fit="${v}"`, l, null, st.focus === v)).join("") + `</div></div>`;
  const MORE_FACETS = ["sector", "ccy", "sponsor", "lender"];
  function placeSheet(el, bar) {
    // Desktop: the panel drops down over the list, just under its bar; phone: in flow.
    el.style.top = !_phone() && bar ? (bar.offsetTop + bar.offsetHeight) + "px" : "";
  }
  const sheetFoot = (clearAttr, csv, n, noun) => `<div class="tx-sheet-f">`
    + (clearAttr ? `<button type="button" class="tx-clear" ${clearAttr}>Clear all</button>` : "<span></span>")
    + `<span class="tx-sheet-fr"><button type="button" class="tfocus-btn tx-csv" data-csv="${csv}">Export CSV</button>`
    + `<button type="button" class="tx-sheet-done">${n == null ? "Done" : `Show ${n} ${noun}${n === 1 ? "" : "s"}`}</button></span></div>`;
  function renderSheet() {
    sheet.hidden = !(sheetOpen && flowMode());
    host.classList.toggle("tx-sheet-open", !sheet.hidden);
    if (sheet.hidden) { sheet.innerHTML = ""; return; }
    const n = currentList().length;
    if (MORE_FACETS.some((k) => st.f[k].length) || st.sort !== "date" || st.dir !== "desc" || st.grp) moreOpen = true;
    const facets = (ks) => ks.filter((k) => !(k === "type" && st.mode === "mna" && !st.q)).filter((k) => !(k === "sponsor" && st.mode !== "lending" && !st.q)).map(facetBlock).join("");
    const sortSel = `<select class="tx-filt" id="tx-sort" data-ctl="sort" aria-label="Sort the deals">${SORTS.map(opt).join("")}</select>`;
    const grpSel = `<select class="tx-filt" id="tx-grp" data-ctl="grp" aria-label="Group the deals">${GROUPS.map(opt).join("")}</select>`;
    const keepY = sheet.querySelector(".tx-sheet-b") ? sheet.querySelector(".tx-sheet-b").scrollTop : 0;
    sheet.innerHTML = `<div class="tx-sheet-b">`
      + fitBlock() + facets(["type"]) + dateBlock() + facets(["region", "size"])
      + `<button type="button" class="tx-fmore-t" data-fmore-t="1" aria-expanded="${moreOpen}">${moreOpen ? "Fewer filters ▾" : "More filters ▸"}</button>`
      + (moreOpen ? facets(MORE_FACETS) + `<div class="tx-fgrp tx-fsortgrp"><div class="tx-fh">Sort &amp; group</div><div class="tx-fchips">${sortSel}${grpSel}</div></div>` : "")
      + `</div>` + sheetFoot(`data-clear="all"`, "flow", n, "deal");
    sheet.querySelectorAll("select[data-ctl]").forEach((x) => { x.value = x.dataset.ctl === "sort" ? `${st.sort}-${st.dir}` : st.grp; });
    const b = sheet.querySelector(".tx-sheet-b"); if (b) b.scrollTop = keepY;
    placeSheet(sheet, host.querySelector("#tx-flow-search"));
  }

  // ---- mode nav ------------------------------------------------------------
  // Desktop: the modes as a left rail, the active deal-flow mode's types nested
  // beneath it (a shortcut that sets the Type facet). Phone: a flat chip row.
  function renderModeNav() {
    const nav = host.querySelector("#tx-mode");
    if (!nav) return;
    const subHTML = "";   // types live in the Filters panel (no nested sub-labels)
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
      lender: (lbl) => [lbl, (r) => mgrLink(r.d.managerId), "lender", "txc-lender tx-mg"],
      sponsor: ["Sponsor", (r) => (r.sponsor ? esc(r.sponsor) : "—"), null, "txc-sp tx-sp"],
      type: ["Type", (r) => esc(st.q ? `${MODE_LABEL[r.mode]} · ${typeLabel(r.tx)}` : typeLabel(r.tx)), null, "txc-type tx-cat"],
      sector: ["Sector", (r) => esc(r.tags.sector), null, "txc-sec tx-cat"],
      country: ["Country", (r) => esc(r.tags.country || "—"), null, "txc-ctry tx-cat"],
      event: ["Event", (r) => esc(EVENT_LABEL[r.tags.event] || "—"), null, "txc-ev tx-cat"],
      // CLO pricing (review #11): the AAA spread and/or weighted-average cost of debt
      // where the manager / arranger / rating release states them (deal.cloTerms).
      pricing: ["AAA / WACD", (r) => { const t = r.d.cloTerms; if (!t) return "—"; const a = [t.aaaBp != null ? `${t.aaaBp}` : "—", t.wacdBp != null ? `${t.wacdBp}` : "—"]; return `<span title="AAA spread / weighted-average cost of debt, bp over the benchmark">${esc(a.join(" / "))}</span>`; }, null, "txc-px tl-n"],
      amount: (lbl) => [lbl, amtCell, "size", "txc-amt tl-n tx-sz"],
      date: ["Date", (r) => esc(fmtDateP(r.d)), "date", "txc-date tx-dt"],
      source: ["Source", srcCell, null, "txc-src tx-src2"],
    };
    if (st.q) return [C.party("Deal"), C.lender("Lender / investor"), C.type, C.amount("Amount"), C.date, C.source];
    if (st.mode === "structured") return [C.party("Vehicle"), C.lender("Manager"), C.type, C.event, C.country, C.amount("Size"), C.pricing, C.date, C.source];
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
  // Short type labels for the one-line phone card meta.
  const TYPE_SHORT = { lend: "DL / unitranche", other: "Other", rx: "Restructuring", abl: "ABL", nav: "NAV", rescue: "Rescue", clo: "CLO", cfo: "CFO", srt: "SRT", gp_sec: "GP-led", lp_sec: "LP-led", npl: "NPL / portfolio" };
  const txCard = (r) => {
    const d = r.d;
    // The type only when the list isn't already narrowed to one type (Manager M&A has none).
    const showType = st.q || (st.mode !== "mna" && st.f.type.length !== 1);
    const what = !showType ? "" : (TYPE_SHORT[r.tx] || typeLabel(r.tx)) + (st.mode === "structured" && r.tags.event && !st.q ? ` ${EVENT_LABEL[r.tags.event].toLowerCase()}` : "");
    return `<li class="tx-card${st.deal === d.id ? " is-open" : ""}" data-deal="${esc(d.id)}" tabindex="0">`
      + `<div class="tx-card-a"><span class="tx-card-nm">${partyCell(r)}</span><span class="tx-card-amt">${r.amt ? amtCell(r) : ""}</span></div>`
      + `<div class="tx-card-b"><span class="tx-cb-dt">${esc(fmtDateP(d))}</span><span class="tx-cb-mg">${mgrLink(d.managerId)}</span>${what ? `<span class="tx-cb-ty">${esc(what)}</span>` : ""}${r.tags.country ? `<span class="tx-cb-ct">${esc(r.tags.country)}</span>` : ""}</div></li>`;
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
    if (vol) parts.push(`<span title="Disclosed deal sizes only, converted to USD">≈ <b>${esc(fmtUsd(vol))}</b> disclosed<span class="tx-stats-x"> (${s.length}/${list.length})</span></span>`);
    if (med != null) parts.push(`<span>median <b>${esc(fmtUsd(med))}</b></span>`);
    if (top.length) parts.push(`<span class="tx-stats-top">top: ${top.map(([id, n]) => `${mgrLink(id)} ${n}`).join(" · ")}</span>`);
    if (_newestRow) parts.push(`<span class="tx-stats-asof" title="Newest deal in the ledger: ${esc(fmtDay(_newestRow.d.date))}">as of ${esc(fmtDay(_newestRow.d.date).replace(/\s\d{4}$/, ""))}</span>`);
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
    const strip = "";
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
  // Law-firm announcements (legal desk) are loaded on the first drawer open only —
  // the advisers line fills in when they land (deal-advisers.js).
  let _legal = null, _legalLoading = false;
  function legalForAdvisers() {
    if (_legal || _legalLoading) return _legal;
    _legalLoading = true;
    import("/legal/js/data.js").then((m) => { _legal = m; if (st.deal) renderDrawer(); }).catch(() => { _legal = { items: [] }; });
    return null;
  }
  function advisersHTML(r) {
    const L = legalForAdvisers();
    const list = advisersFor(r.d, r.cp, L);
    const item = (a) => a.basis === "alert"
      ? `${esc(a.firm)} <span class="tf-est">per the firm's <a href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">announcement</a>${a.date ? " · " + esc(fmtDay(a.date)) : ""}</span>`
      : `${esc(a.firm)} <span class="tf-est">named in the deal source</span>`;
    if (list.length) return list.map(item).join("<br>");
    return L ? `<span class="tf-est">None named in the deal's source or a tracked firm's announcement</span>` : `<span class="tf-est">Checking law-firm announcements…</span>`;
  }
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
      [r.mode === "mna" ? "Target" : ROLE_LABEL[dealPartyRole(d)] || "Borrower / company", (r.cp ? `<a href="${esc(ctx.base)}/profiles/#/co/${encodeURIComponent(r.cp)}" title="Everything Wire holds on ${esc(r.cp)}">${esc(r.cp)}</a>` : "—")
        + (r.tags.partyQuality === "unconfirmed" ? ` <span class="tf-est">* unconfirmed — inferred, not named in a source${r.tags.partySource ? ` · <a href="${esc(r.tags.partySource)}" target="_blank" rel="noopener noreferrer">closest source</a>` : ""}</span>`
          : r.tags.partyQuality === "placeholder" ? ` <span class="tf-est">vehicle not named in any source found</span>`
          : r.tags.partySource ? ` <span class="tf-est">researched · <a href="${esc(r.tags.partySource)}" target="_blank" rel="noopener noreferrer">source</a></span>` : "")],
      ...(r.sponsor ? [["Sponsor", esc(r.sponsor)]] : []),
      [r.mode === "mna" ? "Acquirer" : "Lender / investor", mgrLink(d.managerId)],
      ...(fund ? [["Fund", `<a href="${esc(ctx.base)}/profiles/#/manager/${esc(fund.managerId)}/vehicles">${esc(fund.name)}</a>`]] : []),
      ["Type", `${esc(MODE_LABEL[r.mode])} · ${esc(typeLabel(r.tx))}${r.tags.event ? " · " + esc(EVENT_LABEL[r.tags.event]) : ""}`],
      ["Sector", esc(r.tags.sector)],
      ["Country", r.tags.country
        ? esc(r.tags.country) + (r.tags.countrySource ? ` <span class="tf-est">${esc(BASIS_LABEL[r.tags.countryBasis] || "HQ")} · <a href="${esc(r.tags.countrySource)}" target="_blank" rel="noopener noreferrer">source</a></span>` : "")
        : "—"],
      ["Amount", amount],
      ["Date", esc(fmtDateP(d))],
      ...(d.cloTerms ? [["CLO terms", [
        d.cloTerms.aaaBp != null ? `AAA ${esc(d.cloTerms.aaaBp)}bp` : "", d.cloTerms.wacdBp != null ? `WACD ${esc(d.cloTerms.wacdBp)}bp` : "",
        d.cloTerms.rpYrs != null ? `RP ${esc(d.cloTerms.rpYrs)}y` : (d.cloTerms.rpEnd ? `RP to ${esc(d.cloTerms.rpEnd)}` : ""),
        d.cloTerms.ncYrs != null ? `NC ${esc(d.cloTerms.ncYrs)}y` : (d.cloTerms.ncEnd ? `NC to ${esc(d.cloTerms.ncEnd)}` : ""),
        d.cloTerms.arranger ? `Arranger ${esc(d.cloTerms.arranger)}` : "",
      ].filter(Boolean).join(" · ") + (d.cloTerms.src ? ` <span class="tf-est"><a href="${esc(d.cloTerms.src)}" target="_blank" rel="noopener noreferrer">terms source</a></span>` : "")]] : []),
      ...(() => { const t = dealTerms(d); return t.length ? [["Terms", t.map(([k, v]) => `${esc(k)} ${esc(v)}`).join(" · ") + ` <span class="tf-est">as stated in the source</span>`]] : []; })(),
      ...(r.mode === "mna" ? [] : [["Advisers", advisersHTML(r)]]),
      ["Source", srcLink(d)],
      ...r.alt.map((a) => ["Also reported", `${srcLink(a)} <span class="tf-est">${esc(fmtDay(a.date))}</span>`]),
    ];
    const rel = relatedRows(r);
    const relSec = (title, list) => list.length ? `<div class="tpg-h">${esc(title)} <span class="tveh-grp-n">${list.length}</span></div><ul class="tmini">${list.map(relRow).join("")}</ul>` : "";
    drawer.innerHTML = `
      <header class="tpanel-h tx-drawer-h"><button type="button" class="tx-drawer-x" aria-label="Close the deal">‹</button><span>Deal</span></header>
      <div class="tx-drawer-b">
        <h2 class="tx-drawer-t">${esc(d.headline || "")}</h2>
        ${d.summary ? `<p class="tx-sum">${esc(d.summary)}</p>` : ""}
        <ul class="tbiz">${facts.map(([k, v]) => `<li><span class="tbiz-k">${esc(k)}</span><span class="tbiz-v">${v}</span></li>`).join("")}</ul>
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
    if (st.deal === id) { closeDeal(); return; }   // clicking the open deal again closes its card
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

  // ---- CSV export: exactly what the active view shows (filters + search applied) ----
  function exportCSV(kind) {
    if (kind === "flow") {
      const list = currentList();
      downloadCSV(`wire-transactions-${st.q ? "search" : st.mode}`,
        ["Date", "Borrower / company", "Party role", "Sponsor", "Lender / investor", "Group", "Type", "Sector", "Country", "Country basis", "Country source", "Region", "Amount (reported)", "Amount kind", "Amount (USD, approx.)", "CLO event", "Headline", "Source", "Other sources"],
        list.map((r) => [r.d.date, r.cp, dealPartyRole(r.d), r.sponsor, mgrName(r.d.managerId), MODE_LABEL[r.mode], typeLabel(r.tx), r.tags.sector, r.tags.country || "", r.tags.country ? (r.tags.countrySource ? `${BASIS_LABEL[r.tags.countryBasis] || "HQ"} (researched)` : "deal text") : "", r.tags.countrySource || "", REGION_LABEL[r.tags.region] || "",
          r.amt ? fmtAmt(r.amt) : "", r.tags.amountKind || "", r.usd != null ? Math.round(r.usd) : "", r.tags.event || "", r.d.headline || "", r.d.sourceUrl || "", r.alt.map((a) => a.sourceUrl).filter(Boolean).join(" ")]));
    }
  }

  // ---- render ----------------------------------------------------------------
  function syncControls() {
    const set = (sel, v) => { const el = host.querySelector(sel); if (el && el.value !== v) el.value = v; };
    set("#tx-q", st.q);
    set("#tx-sort", `${st.sort}-${st.dir}`); set("#tx-grp", st.grp);
    const sc = host.querySelector("#tx-scope");
    if (sc) {
      const eu = st.scope === "eu";
      sc.setAttribute("aria-pressed", String(eu)); sc.classList.toggle("is-on", eu);
      sc.textContent = eu ? "Europe" : "All regions";
      sc.title = eu ? "Showing European borrowers / assets (UK, EU, Nordics, Switzerland, pan-European) — tap for all regions" : "Showing every region — tap for Europe only";
    }
    const f = host.querySelector("#tx-focus");
    if (f) {
      const on = st.focus === "target";
      f.setAttribute("aria-pressed", String(on)); f.classList.toggle("is-on", on);
      f.dataset.focus = st.focus;
      f.title = on ? "Showing European mid-market managers (European, ≤ $15bn, 15%+ strategy) — tap to clear" : "Show only European mid-market managers (European, ≤ $15bn, 15%+ strategy); $1–15bn AUM is in Filters";
    }
  }
  // Show the active mode's chrome + body. Driven with inline display (the headers
  // carry a CSS display that beats the UA [hidden] rule).
  function showMode() {
    const show = (ids, on) => ids.forEach((id) => { const el = host.querySelector("#" + id); if (el) el.style.display = on ? "" : "none"; });
    show(["tx-flow-search", "tx-body"], flowMode());
  }
  function render() {
    renderModeNav();
    if (flowMode()) renderFlow();
    renderSheet();
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
  // The bar's Target button: Target on / off (the $1–15bn lens is in the panel's Managers row).
  host.querySelector("#tx-focus").addEventListener("click", () => change({ focus: st.focus === "target" ? "" : "target", deal: "" }));
  host.querySelector("#tx-scope").addEventListener("click", () => change({ scope: st.scope === "eu" ? "all" : "eu", deal: "" }));
  host.addEventListener("change", (e) => {
    const t = e.target;
    if (t.matches("select[data-ctl='sort']")) { const [k, d] = t.value.split("-"); change({ sort: k, dir: d }, !sheetOpen); return; }
    if (t.matches("select[data-ctl='grp']")) { change({ grp: t.value }, !sheetOpen); return; }
    if (t.id === "tx-date") {
      const v = t.value;
      if (v === "custom") { customDate = true; renderSheet(); return; }
      customDate = false;
      if (v.startsWith("r:")) { const [, a, b] = v.split(":"); change({ from: a, to: b, period: "all", deal: "" }, false); }
      else change({ period: v, from: "", to: "", deal: "" }, false);
      return;
    }
    if (t.id === "tx-from" || t.id === "tx-to") {
      let from = host.querySelector("#tx-from").value || "", to = host.querySelector("#tx-to").value || "";
      if (from && to && from > to) [from, to] = [to, from];
      change({ from, to, period: "all", deal: "" }, false); return;
    }
  });
  host.addEventListener("click", (e) => {
    // Lender / manager links → the profile (in-app, a history entry).
    const mgr = e.target.closest("a.tx-mgr");
    if (mgr) { e.preventDefault(); ctx.navigate(`${ctx.base}/profiles/#/manager/${mgr.dataset.id}`); return; }
    if (e.target.closest("a")) return;                                   // source links etc. keep native behaviour
    // Filters sheets.
    if (e.target.closest("#tx-filters")) { sheetOpen = !sheetOpen; renderSheet(); renderActive(); return; }
    if (e.target.closest("[data-fmore-t]")) { moreOpen = !moreOpen; renderSheet(); return; }
    const fit = e.target.closest("[data-fit]");
    if (fit) { change({ focus: fit.dataset.fit, deal: "" }, false); return; }
    if (e.target.closest(".tx-sheet-done")) {
      sheetOpen = false; render();
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
    // A deal (row, card, or a related-deal row in the drawer / a credit) → its drawer.
    const dl = e.target.closest("[data-deal]");
    if (dl) { openDeal(dl.dataset.deal); return; }
  });
  host.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sheetOpen) { sheetOpen = false; render(); return; }
    if (e.key === "Escape" && st.deal) { closeDeal(); return; }
    const row = e.target.closest && e.target.closest("[data-deal]");
    if (row && e.target === row && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); row.click(); }
  });
  // Desktop: a click anywhere outside an open panel (and its button) closes it.
  document.addEventListener("click", (e) => {
    if (!isActive() || _phone() || !sheetOpen) return;
    if (!document.contains(e.target) || e.target.closest(".tx-sheet, .tx-fbtn")) return;   // a re-rendered chip, or the panel itself
    sheetOpen = false; render();
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
      st = DEFAULT(); sheetOpen = lenderAll = moreOpen = customDate = false;
      commit(false); syncControls(); showMode(); render();
      window.scrollTo({ top: 0, behavior: "instant" });
    },
  };
}
