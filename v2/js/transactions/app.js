// =============================================================================
// v2/js/transactions/app.js — the Transactions tab: the covered managers' deal
// flow organised by TRANSACTION TYPE, plus the European credit universe and the
// BDC roster. Five modes — Lending · Structured credit · Secondaries (the three
// deal-flow groups of credit/js/tx.js) · Credits · BDCs.
//
// Every view lives in the URL hash (HOUSE_STYLE R35), so reload / a pasted link /
// Back restore it exactly:
//   #/<mode>[/<type>]?sec=&grp=lender&period=&min=&focus=1&q=&deal=<id>
//   #/credits?q=&grp=sector|rating&open=<name>      #/bdc?q=&open=<name>
//   #/deal/<id>  (deep link — canonicalised to that deal's mode with the drawer open)
// A deal is a first-class object: tapping a row opens its DRAWER (borrower,
// sponsor, lender → profile, fund, type, sector, amount, date, source and related
// deals). Built from the Profiles terminal furniture (.tdash / .tchips / .tleague).
// mount(host, ctx) → { enter, leave, home }.
// =============================================================================
import { deals, managers, fundById } from "/credit/js/data.js";
import { BDCS } from "/credit/js/bdcs.js";
import { EUR_CREDITS, EUR_CREDITS_META, creditsBySector } from "/credit/js/eu-credits.js";
import { TX_TYPES, TX_GROUPS, SECTORS, SECTOR_LABEL, txOf, sectorOf, amountOf, toUsd, fmtAmt, fmtUsd } from "/credit/js/tx.js";
import { esc } from "/util.js";
import { fmtDay } from "/feed.js";
import { dealCounterparty, dealSponsor } from "../deal-parse.js";
import { creditSource } from "/credit/js/shared.js";

const _mById = new Map(managers.map((m) => [m.id, m]));
const mgrName = (id) => (_mById.get(id) || {}).name || "";
const DAY = 864e5;

// $1–15bn AUM focus — the app-wide "target" band, identical to the Profiles /
// Credit league toggle. Gate on total group/parent AUM (not a credit-only
// sleeve), so a boutique inside a large group falls outside the band; banks /
// originators (notAum) carry no AUM and never qualify.
const inFocusAum = (aum) => aum != null && aum >= 1 && aum <= 15;
const focusAumOf = (m) => (!m || m.notAum ? null : (m.aumTotal != null ? m.aumTotal : m.aum));
const mInFocus = (m) => inFocusAum(focusAumOf(m));

const FLOW = TX_GROUPS.map((g) => g.key);                       // lending · structured · secondary
const MODES = [...TX_GROUPS.map((g) => [g.key, g.label]), ["credits", "Credits"], ["bdc", "BDCs"]];
const MODE_KEYS = MODES.map(([k]) => k);
const MODE_ALIAS = { primary: "lending" };                      // the pre-2026-10 mode name
const PERIOD_LABEL = { "30d": "Last 30 days", "12m": "Last 12 months", ytd: "Year to date", since2020: "Since 2020" };
const MIN_LABEL = { 100: "≥ $100m", 500: "≥ $500m", 1000: "≥ $1bn" };

export function mount(host, ctx) {
  // Enrich every dated deal once: { d, tx, sec, amt, usd, ts }.
  const now = Date.now();
  const rows = deals
    .filter((d) => d && d.date)
    .map((d) => { const amt = amountOf(d); return { d, tx: txOf(d), sec: sectorOf(d), amt, usd: toUsd(amt), ts: Date.parse((d.date || "").slice(0, 10)) || 0 }; })
    .filter((r) => r.ts > 0);
  const rowById = new Map(rows.map((r) => [r.d.id, r]));
  const groupOf = (key) => (TX_TYPES.find((x) => x.key === key) || {}).group || "lending";
  const typeLabel = (key) => (TX_TYPES.find((x) => x.key === key) || {}).label || key;
  const groupLabel = (g) => (TX_GROUPS.find((x) => x.key === g) || {}).label || "";

  // ---- state (the URL is its serialised form) --------------------------------
  const DEFAULT = () => ({ mode: "lending", sub: "", sec: "all", grp: "", period: "all", minUsd: 0, focus: false, q: "", deal: "", crQ: "", crGroup: null, crOpen: "", bdcQ: "", bdcOpen: "" });
  let st = DEFAULT();
  const flowMode = () => FLOW.includes(st.mode);

  // Filters (monitoring): a recency window, a minimum DISCLOSED size, the AUM band.
  const PERIODS = { all: () => 0, "30d": () => now - 30 * DAY, "12m": () => now - 365 * DAY, ytd: () => Date.UTC(new Date(now).getUTCFullYear(), 0, 1), since2020: () => Date.UTC(2020, 0, 1) };
  const inPeriod = (r) => st.period === "all" || r.ts >= (PERIODS[st.period] || PERIODS.all)();
  const inSize = (r) => !st.minUsd || (r.usd != null && r.usd >= st.minUsd);
  const inFocus = (r) => !st.focus || mInFocus(_mById.get(r.d.managerId));
  const passes = (r) => inPeriod(r) && inSize(r) && inFocus(r);

  // ---- URL <-> state ---------------------------------------------------------
  function toHash() {
    const p = new URLSearchParams();
    let path = "#/" + st.mode;
    if (flowMode()) {
      if (st.sub) path += "/" + st.sub;
      if (st.sec !== "all") p.set("sec", st.sec);
      if (st.grp) p.set("grp", st.grp);
      if (st.period !== "all") p.set("period", st.period);
      if (st.minUsd) p.set("min", String(st.minUsd));
      if (st.focus) p.set("focus", "1");
      if (st.q) p.set("q", st.q);
      if (st.deal) p.set("deal", st.deal);
    } else if (st.mode === "credits") {
      if (st.crQ) p.set("q", st.crQ);
      if (st.crGroup) p.set("grp", st.crGroup);
      if (st.crOpen) p.set("open", st.crOpen);
    } else {
      if (st.bdcQ) p.set("q", st.bdcQ);
      if (st.bdcOpen) p.set("open", st.bdcOpen);
    }
    const qs = p.toString();
    return path + (qs ? "?" + qs : "");
  }
  // Parse a hash into a fresh state. Unknown values fall back to the defaults.
  function fromHash(raw) {
    const s = DEFAULT();
    const [pathPart, qs = ""] = String(raw || "").replace(/^#/, "").split("?");
    const seg = pathPart.split("/").filter(Boolean);
    const q = new URLSearchParams(qs);
    if (seg[0] === "deal" && seg[1] && rowById.has(seg[1])) {
      // A deep link to one deal: open it over its own group's default list.
      s.mode = groupOf(rowById.get(seg[1]).tx); s.deal = seg[1];
      return s;
    }
    const m = MODE_ALIAS[seg[0]] || seg[0];
    if (MODE_KEYS.includes(m)) s.mode = m;
    if (FLOW.includes(s.mode)) {
      if (seg[1] && TX_TYPES.some((t) => t.key === seg[1] && t.group === s.mode)) s.sub = seg[1];
      if (q.get("sec") && SECTORS.some((x) => x.key === q.get("sec"))) s.sec = q.get("sec");
      if (q.get("grp") === "lender") s.grp = "lender";
      if (PERIODS[q.get("period")]) s.period = q.get("period");
      if (MIN_LABEL[q.get("min")]) s.minUsd = Number(q.get("min"));
      s.focus = q.get("focus") === "1";
      s.q = q.get("q") || "";
      if (q.get("deal") && rowById.has(q.get("deal"))) s.deal = q.get("deal");
    } else if (s.mode === "credits") {
      s.crQ = q.get("q") || "";
      s.crGroup = ["sector", "rating"].includes(q.get("grp")) ? q.get("grp") : null;
      s.crOpen = q.get("open") || "";
    } else if (s.mode === "bdc") {
      s.bdcQ = q.get("q") || "";
      s.bdcOpen = q.get("open") || "";
    }
    return s;
  }
  // Commit the state to the URL. A navigation-like change (mode, type, a filter, a
  // drawer) is a NEW history entry so Back steps back through it; typing a search
  // REPLACES (Back never walks keystrokes). Hash writes via the History API fire no
  // hashchange, so there is no double render.
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
    // Canonicalise legacy / deep-link forms (#/primary, #/deal/<id>) in place.
    if (isActive() && location.hash && location.hash !== canon) { try { history.replaceState(history.state, "", location.pathname + location.search + canon); } catch { /* ignore */ } }
    syncControls(); showMode(); render();
  }

  // ---- per-type stats over the active filters --------------------------------
  function statsFor(key) {
    const list = rows.filter((r) => r.tx === key && passes(r));
    return { key, n: list.length, list, usd: list.reduce((s, r) => s + (r.usd || 0), 0) };
  }
  // The active group's types (by volume) that carry deals under the active filters.
  const flowTypes = () => TX_TYPES.filter((t) => t.group === st.mode)
    .map((t) => statsFor(t.key)).filter((s) => s.n > 0)
    .sort((a, b) => b.usd - a.usd || b.n - a.n);

  const mq = (q) => { try { return window.matchMedia(q).matches; } catch { return false; } };
  const _txDesktop = () => mq("(min-width:901px)");
  const _phone = () => mq("(max-width:760px)");

  // ---- shell ---------------------------------------------------------------
  const grpSvg = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>`;
  host.innerHTML = `
    <div class="tdash tx-dash">
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full">
          <header class="tpanel-h twire-head">
            <!-- renderModeNav(): the five modes; on desktop the active deal-flow mode's
                 transaction-type sub-tabs nest beneath it in the left rail. -->
            <div class="tchips" id="tx-mode"></div>
          </header>
          <div class="tcol-main">
            <header class="tpanel-h thead-search" id="tx-flow-search">
              <div class="tx-asof" id="tx-asof" hidden></div>
              <input type="search" id="tx-q" class="tsearch" placeholder="Search every deal, manager or type…" aria-label="Search transactions">
              <select id="tx-period" class="tx-filt" aria-label="Date range">
                <option value="all">All dates</option><option value="30d">Last 30 days</option><option value="12m">Last 12 months</option><option value="ytd">Year to date</option><option value="since2020">Since 2020</option>
              </select>
              <select id="tx-min" class="tx-filt" aria-label="Minimum deal size">
                <option value="0">Any size</option><option value="100">≥ $100m</option><option value="500">≥ $500m</option><option value="1000">≥ $1bn</option>
              </select>
              <button type="button" class="tfocus-btn tfocus-aum" id="tx-focus" aria-pressed="false" title="AUM focus — show only $1–15bn AUM managers">$1–15bn</button>
              <div class="tx-active" id="tx-active" hidden></div>
            </header>
            <header class="tpanel-h thead-search" id="tx-credits-search">
              <input type="search" id="tx-cr-q" class="tsearch" placeholder="Search a credit or sector…" aria-label="Search credits">
              <div class="tcr-grpctl" id="tx-cr-ctl" role="group" aria-label="Group the credit roster">
                <button type="button" class="tcr-grpbtn" data-crgroup="sector" aria-pressed="false">${grpSvg}<span>Group by sector</span></button>
                <button type="button" class="tcr-grpbtn" data-crgroup="rating" aria-pressed="false">${grpSvg}<span>Group by rating</span></button>
              </div>
            </header>
            <header class="tpanel-h thead-search" id="tx-bdc-search">
              <input type="search" id="tx-bdc-q" class="tsearch" placeholder="Search a BDC or manager…" aria-label="Search BDCs">
            </header>
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
  let _bdcQuotes = null, _bdcQuotesTried = false;
  // S&P scale, best → worst — used to order the roster when grouping by rating.
  const RATING_ORDER = ["AAA", "AA+", "AA", "AA-", "A+", "A", "A-", "BBB+", "BBB", "BBB-", "BB+", "BB", "BB-", "B+", "B", "B-", "CCC+", "CCC", "CCC-", "CC", "C", "SD", "D"];
  const ratingRank = (r) => { const i = RATING_ORDER.indexOf(r); return i === -1 ? 999 : i; };

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

  // ---- active-filter pills + Clear (deal-flow modes) -------------------------
  // Every non-default filter shows as a removable pill, so what is narrowing the
  // list is always visible and one tap undoes it.
  function renderActive() {
    const el = host.querySelector("#tx-active");
    if (!el) return;
    const pills = [];
    if (flowMode()) {
      if (st.sub) pills.push(["sub", typeLabel(st.sub)]);
      if (st.sec !== "all") pills.push(["sec", SECTOR_LABEL[st.sec] || st.sec]);
      if (st.period !== "all") pills.push(["period", PERIOD_LABEL[st.period]]);
      if (st.minUsd) pills.push(["min", MIN_LABEL[st.minUsd]]);
      if (st.focus) pills.push(["focus", "$1–15bn AUM"]);
      if (st.grp) pills.push(["grp", "By lender"]);
    }
    el.hidden = !pills.length;
    el.innerHTML = pills.map(([k, l]) => `<button type="button" class="tx-pill" data-clear="${k}" aria-label="Remove filter: ${esc(l)}">${esc(l)}<span aria-hidden="true">✕</span></button>`).join("")
      + (pills.length ? `<button type="button" class="tx-clear" data-clear="all">Clear all</button>` : "");
  }

  // ---- mode nav ------------------------------------------------------------
  // Desktop: the five modes as a left rail, the active deal-flow mode's types
  // nested beneath it. Phone: a flat chip row (its type picker lives in the body).
  function renderModeNav() {
    const nav = host.querySelector("#tx-mode");
    if (!nav) return;
    let subHTML = "";
    if (_txDesktop() && flowMode()) {
      const types = flowTypes();
      if (types.length) {
        if (st.sub && !types.some((s) => s.key === st.sub)) st.sub = "";
        const groupN = types.reduce((a, s) => a + s.n, 0);
        const chip = (s) => `<button type="button" class="tchip${st.sub === s.key ? " is-on" : ""}" data-sub="${esc(s.key)}">${esc(typeLabel(s.key))}<span class="tx-subn">${s.n}</span></button>`;
        const allChip = `<button type="button" class="tchip${!st.sub ? " is-on" : ""}" data-sub="">All<span class="tx-subn">${groupN}</span></button>`;
        subHTML = `<div class="tx-subnav tx-subnav-nested"><div class="tchips">${allChip}${types.map(chip).join("")}</div></div>`;
      }
    }
    nav.innerHTML = MODES.map(([k, l]) => {
      const on = st.mode === k;
      // "Structured credit" → "Structured" on phones (five chips share 390px).
      const lbl = k === "structured" ? `Structured<span class="tx-mlong"> credit</span>` : esc(l);
      return `<button type="button" class="tchip${on ? " is-on" : ""}" data-mode="${esc(k)}">${lbl}</button>` + (on ? subHTML : "");
    }).join("");
    renderAsOf();
    renderActive();
  }

  // ---- deal rows -----------------------------------------------------------
  const mgrLink = (id) => id && mgrName(id) ? `<a href="${esc(ctx.base)}/profiles/#/manager/${esc(id)}" class="tx-mgr" data-id="${esc(id)}">${esc(mgrName(id))}</a>` : "—";
  // The borrower / company — the deal's OTHER party. When the headline leads with
  // the lender itself, the sourced headline stands in (muted) rather than repeating
  // the lender's name as the "borrower".
  const partyCell = (d) => {
    const cp = dealCounterparty(d, mgrName(d.managerId));
    return cp ? esc(cp) : `<span class="tx-hl">${esc(d.headline || "—")}</span>`;
  };
  const txRow = (r) => {
    const d = r.d, u = d.sourceUrl, t = TX_TYPES.find((x) => x.key === r.tx);
    const sponsor = dealSponsor(d);
    const sector = esc(SECTOR_LABEL[r.sec] || (t && t.label) || "—");
    const outlet = creditSource(d) || "";
    const srcCell = u ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(outlet || "source")}</a>` : "—";
    return `<tr class="tx-row${st.deal === d.id ? " is-open" : ""}" data-deal="${esc(d.id)}" tabindex="0"><td class="tx-bd" title="${esc(d.headline || "")}"><span class="tx-caret" aria-hidden="true">▸</span>${partyCell(d)}</td>`
      + `<td class="tx-sp">${sponsor ? esc(sponsor) : "—"}</td>`
      + `<td class="tx-dt">${esc(fmtDay(d.date))}</td>`
      + `<td class="tx-mg">${mgrLink(d.managerId)}</td>`
      + `<td class="tx-cat">${sector}</td>`
      + `<td class="tl-n tx-sz"${r.amt ? ` title="≈ ${fmtUsd(r.usd)}"` : ""}>${r.amt ? esc(fmtAmt(r.amt)) : "—"}</td>`
      + `<td class="tx-src2">${srcCell}</td></tr>`;
  };
  // Phone: a two-line card per deal — borrower · amount, then date · lender · type —
  // so the facts that matter fit 390px without a sideways-scrolling table.
  const txCard = (r) => {
    const d = r.d;
    return `<li class="tx-card${st.deal === d.id ? " is-open" : ""}" data-deal="${esc(d.id)}" tabindex="0">`
      + `<div class="tx-card-a"><span class="tx-card-nm">${partyCell(d)}</span><span class="tx-card-amt">${r.amt ? esc(fmtAmt(r.amt)) : ""}</span></div>`
      + `<div class="tx-card-b"><span>${esc(fmtDay(d.date))}</span><span>${mgrLink(d.managerId)}</span><span>${esc(typeLabel(r.tx))}</span></div></li>`;
  };
  const TABLE_HEAD = `<thead><tr><th class="tx-bd-h">Borrower / company</th><th class="tx-sp-h">Sponsor</th><th class="tx-dt-h">Date</th><th class="tx-mg-h">Lender / investor</th><th class="tx-cat-h">Sector</th><th class="tx-amt-h">Amount</th><th class="tx-src-h">Source</th></tr></thead>`;
  function dealList(list) {
    if (_phone()) {
      if (st.grp === "lender") {
        return `<ul class="tx-cards">${lenderGroups(list).map(([id, rs]) => `<li class="tx-grp"><span class="tx-grp-nm">${esc(mgrName(id) || "—")}</span><span class="tx-grp-n">${rs.length}</span></li>` + rs.map(txCard).join("")).join("")}</ul>`;
      }
      return `<ul class="tx-cards">${list.map(txCard).join("")}</ul>`;
    }
    const rowsHtml = st.grp === "lender"
      ? lenderGroups(list).map(([id, rs]) => `<tr class="tx-grp"><td colspan="7"><span class="tx-grp-nm">${esc(mgrName(id) || "—")}</span><span class="tx-grp-n">${rs.length}</span></td></tr>` + rs.map(txRow).join("")).join("")
      : list.map(txRow).join("");
    return `<div class="tleague-wrap"><table class="tleague tleague-full tx-list">${TABLE_HEAD}<tbody>${rowsHtml}</tbody></table></div>`;
  }
  // Bucket by lender/investor; most-active lender first, then alphabetical.
  function lenderGroups(list) {
    const groups = new Map();
    for (const r of list) { const id = r.d.managerId || "_"; if (!groups.has(id)) groups.set(id, []); groups.get(id).push(r); }
    return [...groups.entries()].sort((a, b) => b[1].length - a[1].length || mgrName(a[0]).localeCompare(mgrName(b[0])));
  }

  // The deal list for the active mode + type, with its sector chips and the
  // group-by-lender toggle; newest first.
  function typeSublist() {
    const isAll = !st.sub;
    const base = isAll ? rows.filter((r) => groupOf(r.tx) === st.mode && passes(r)) : statsFor(st.sub).list;
    const secCount = {}; base.forEach((r) => { secCount[r.sec] = (secCount[r.sec] || 0) + 1; });
    const present = SECTORS.filter((x) => secCount[x.key]);
    if (st.sec !== "all" && !secCount[st.sec]) st.sec = "all";
    const list = base.filter((r) => st.sec === "all" || r.sec === st.sec).sort((a, b) => b.ts - a.ts);
    const secChip = (k, label, n, on) => `<button type="button" class="tx-secchip${on ? " is-on" : ""}" data-sec="${esc(k)}">${esc(label)}<span class="tx-secn">${n}</span></button>`;
    const chips = present.length > 1
      ? `<div class="tx-secfilter" role="group" aria-label="Filter by sector"><span class="tx-striplbl">Sector</span>${secChip("all", "All", base.length, st.sec === "all")}${present.map((x) => secChip(x.key, x.label, secCount[x.key], st.sec === x.key)).join("")}</div>`
      : "";
    const grpBtn = `<button type="button" class="tx-grpbtn${st.grp ? " is-on" : ""}" data-txgroup="lender" aria-pressed="${st.grp ? "true" : "false"}" title="Group the deals by lender / investor">${grpSvg}<span>Group by lender</span></button>`;
    const subhead = `<div class="tx-subhead">${chips}${grpBtn}</div>`;
    const what = isAll ? groupLabel(st.mode).toLowerCase() : typeLabel(st.sub).toLowerCase();
    if (!list.length) return subhead + `<p class="tw-empty muted small">No ${esc(what)}${st.sec !== "all" ? " · " + esc(SECTOR_LABEL[st.sec]) : ""} transactions match these filters.</p>`;
    return subhead + dealList(list);
  }

  function renderFlow() {
    const types = flowTypes();
    if (st.sub && !types.some((s) => s.key === st.sub)) st.sub = "";
    if (!types.length) { body.innerHTML = `<p class="tw-empty muted small">No ${esc(groupLabel(st.mode).toLowerCase())} transactions match these filters.</p>`; return; }
    if (!_txDesktop()) {
      // Phone / tablet: a labelled type chip strip (All + each type) over the list.
      const groupN = types.reduce((a, s) => a + s.n, 0);
      const tchip = (k, label, n, on) => `<button type="button" class="tx-secchip${on ? " is-on" : ""}" data-sub="${esc(k)}">${esc(label)}<span class="tx-secn">${n}</span></button>`;
      const strip = `<div class="tx-typestrip tx-secfilter" role="group" aria-label="Filter by transaction type"><span class="tx-striplbl">Type</span>`
        + tchip("", "All", groupN, !st.sub)
        + types.map((s) => tchip(s.key, typeLabel(s.key), s.n, st.sub === s.key)).join("")
        + `</div>`;
      body.innerHTML = `<div class="tx-phone">${strip}<div class="tx-panes-in">${typeSublist()}</div></div>`;
      return;
    }
    body.innerHTML = `<div class="tx-panes"><div class="tx-panes-in">${typeSublist()}</div></div>`;
  }

  // ---- search: every deal across ALL groups, honouring the active filters ---
  function renderSearch() {
    const q = st.q.toLowerCase();
    const hit = (r) => {
      const d = r.d;
      return (d.headline || "").toLowerCase().includes(q)
        || mgrName(d.managerId).toLowerCase().includes(q)
        || (d.summary || "").toLowerCase().includes(q)
        || typeLabel(r.tx).toLowerCase().includes(q);
    };
    const list = rows.filter((r) => passes(r) && hit(r)).sort((a, b) => b.ts - a.ts);
    const CAP = 200, shown = list.slice(0, CAP);
    const byGroup = {}; list.forEach((r) => { const g = groupOf(r.tx); byGroup[g] = (byGroup[g] || 0) + 1; });
    const split = TX_GROUPS.filter((g) => byGroup[g.key]).map((g) => `${g.label} ${byGroup[g.key]}`).join(" · ");
    body.innerHTML = `
      <div class="tx-head">
        <h2 class="tx-title">Search · all transactions</h2>
        <p class="tx-blurb"><span class="muted">${list.length} match “${esc(st.q)}”${split ? ` (${esc(split)})` : ""}${list.length > CAP ? ` — showing the first ${CAP}` : ""}. Tap a row for the deal.</span></p>
      </div>
      ${shown.length ? dealList(shown) : `<p class="tw-empty muted small">No transactions match “${esc(st.q)}”.</p>`}`;
  }

  // ---- the deal drawer -------------------------------------------------------
  // Everything known about one deal, and sideways moves to related ones: the same
  // borrower, the same sponsor, the lender's other deals. Desktop: a panel beside
  // the list. Phone: the list gives way to the deal (Back / ✕ returns to it).
  let _listY = 0;
  const norm = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  function relatedRows(r) {
    const d = r.d;
    const cp = norm(dealCounterparty(d, mgrName(d.managerId)));
    const sp = norm(dealSponsor(d));
    const others = rows.filter((x) => x.d.id !== d.id);
    const by = (f) => others.filter(f).sort((a, b) => b.ts - a.ts).slice(0, 6);
    return {
      borrower: cp.length >= 3 ? by((x) => norm(dealCounterparty(x.d, mgrName(x.d.managerId))) === cp) : [],
      sponsor: sp.length >= 3 ? by((x) => norm(dealSponsor(x.d)) === sp) : [],
      lender: d.managerId ? by((x) => x.d.managerId === d.managerId) : [],
    };
  }
  const relRow = (x) => `<li class="tmini-row clickable" data-deal="${esc(x.d.id)}"><span class="tmini-t">${esc(x.d.headline || "—")}</span><span class="tmini-m">${esc(fmtDay(x.d.date))} · ${esc(mgrName(x.d.managerId) || "—")}${x.amt ? " · " + esc(fmtAmt(x.amt)) : ""}</span></li>`;
  function renderDrawer() {
    const r = st.deal && flowMode() ? rowById.get(st.deal) : null;
    host.classList.toggle("tx-has-deal", !!r);
    if (!r) { drawer.hidden = true; drawer.innerHTML = ""; return; }
    const d = r.d;
    const cp = dealCounterparty(d, mgrName(d.managerId));
    const sponsor = dealSponsor(d);
    const fund = d.fundId && fundById[d.fundId];
    const facts = [
      ["Borrower / company", cp ? esc(cp) : "—"],
      ...(sponsor ? [["Sponsor", esc(sponsor)]] : []),
      ["Lender / investor", mgrLink(d.managerId)],
      ...(fund ? [["Fund", `<a href="${esc(ctx.base)}/profiles/#/manager/${esc(fund.managerId)}/vehicles">${esc(fund.name)}</a>`]] : []),
      ["Type", `${esc(groupLabel(groupOf(r.tx)))} · ${esc(typeLabel(r.tx))}`],
      ["Sector", esc(SECTOR_LABEL[r.sec] || "—")],
      ["Amount", r.amt ? `${esc(fmtAmt(r.amt))}${r.usd != null && !/^\$/.test(fmtAmt(r.amt)) ? ` <span class="tf-est">≈ ${esc(fmtUsd(r.usd))}</span>` : ""}` : "Undisclosed"],
      ["Date", esc(fmtDay(d.date))],
      ["Source", d.sourceUrl ? `<a href="${esc(d.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(creditSource(d) || "source")}</a>` : "—"],
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
    if (!id || st.deal === id) return;
    if (!st.deal && _phone()) _listY = window.scrollY;
    st.deal = id; commit(true); renderDrawer();
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
  // The largest US business development companies, LISTED vs INTERVAL / PRIVATE.
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
    const tk = b.ticker ? `${esc(b.ticker)}${b.exchange ? ` · ${esc(b.exchange)}` : ""}` : "—";
    const ty = b.structure === "listed" ? `<span class="tbdc-ty-l">Listed</span>` : `<span class="tbdc-ty-p">Private</span>`;
    const na = b.nonAccrualFV != null
      ? `<span title="${b.nonAccrualCost != null ? b.nonAccrualCost + "% at cost · " : ""}at fair value${b.nonAccrualAsOf ? ", " + esc(b.nonAccrualAsOf) : ""}">${b.nonAccrualFV}%</span>` : "n/a";
    return `<tr class="tbdc-row${open ? " is-open" : ""}" data-i="${i}" data-key="${esc(bdcKey(b))}"><td class="tbdc-nm"><span class="tx-caret" aria-hidden="true">▸</span>${esc(b.name)}</td>`
      + `<td class="tbdc-tk">${tk}</td>`
      + `<td class="tbdc-ty">${ty}</td>`
      + `<td class="tbdc-mg">${mgr}</td>`
      + `<td class="tl-n tbdc-ta">${bdcSizeCell(b)}</td>`
      + `<td class="tl-n tbdc-nav">${b.nav != null ? "$" + b.nav.toFixed(2) : "n/a"}</td>`
      + `<td class="tl-n tbdc-na">${na}</td>`
      + `<td class="tl-n tbdc-lq">${bdcLiquidityCell(b)}</td></tr>`
      + `<tr class="tbdc-exp" data-for="${i}"${open ? "" : " hidden"}><td colspan="8"><div class="tx-exp-in"${open ? ' data-built="1"' : ""}>${open ? bdcDetail(b) : ""}</div></td></tr>`;
  }
  function renderBDCs() {
    const q = st.bdcQ.toLowerCase();
    const match = (b) => !q || b.name.toLowerCase().includes(q) || (b.manager || "").toLowerCase().includes(q) || (b.ticker || "").toLowerCase().includes(q);
    const list = BDCS.filter(match).sort((a, b) => (bdcSize(b) || 0) - (bdcSize(a) || 0) || a.name.localeCompare(b.name));
    const groups = [
      { key: "listed", label: "Listed", rows: list.filter((b) => b.structure === "listed") },
      { key: "private", label: "Private", rows: list.filter((b) => b.structure !== "listed") },
    ];
    const head = `<thead><tr><th class="tbdc-nm-h">Fund</th><th class="tbdc-tk-h">Ticker</th><th class="tbdc-ty-h">Type</th><th class="tbdc-mg-h">Manager</th><th class="tbdc-ta-h">Total assets</th><th class="tbdc-nav-h">NAV / sh</th><th class="tbdc-na-h">Non-accrual</th><th class="tbdc-lq-h">Px/NAV · liquidity</th></tr></thead>`;
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
  // trend. A row opens what the app knows about the name: the tracked deals that
  // NAME it and the covered managers behind those deals. Real, sourced rows only.
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
  function renderCredits() {
    if (!EUR_CREDITS.length) {
      creditsBody.innerHTML = `<p class="tw-empty muted small">The European credit universe (anchored to the ${esc(EUR_CREDITS_META.index)}) is being compiled — sourced names and ratings land here as they’re verified.</p>`;
      return;
    }
    const q = st.crQ.toLowerCase();
    const filtered = q ? EUR_CREDITS.filter((c) => `${c.name} ${c.sector} ${c.rating || ""} ${c.jurisdiction || ""}`.toLowerCase().includes(q)) : EUR_CREDITS;
    const list = st.crGroup === "rating"
      ? filtered.slice().sort((a, b) => ratingRank(a.rating) - ratingRank(b.rating) || a.name.localeCompare(b.name))
      : creditsBySector(filtered).flatMap(([, arr]) => arr);
    creditsBody.innerHTML = list.length
      ? `<div class="tleague-wrap tcr-wrap"><table class="tcr-tbl">`
        + `<colgroup><col class="c-nm"><col class="c-jur"><col class="c-sec"><col class="c-rt"></colgroup>`
        + `<thead><tr><th>Borrower</th><th>Jurisdiction</th><th>Sector</th><th>Rating</th></tr></thead>`
        + `<tbody>${list.map(crRow).join("")}</tbody></table></div>`
      : `<p class="tw-empty muted small">No credits match “${esc(st.crQ)}”.</p>`;
    if (st.crOpen) { const r = creditsBody.querySelector("tr.tcr-row.is-open"); if (r) requestAnimationFrame(() => r.scrollIntoView({ block: "center" })); }
  }

  // ---- render ----------------------------------------------------------------
  function syncControls() {
    const set = (sel, v) => { const el = host.querySelector(sel); if (el && el.value !== v) el.value = v; };
    set("#tx-q", st.q); set("#tx-period", st.period); set("#tx-min", String(st.minUsd || 0));
    set("#tx-cr-q", st.crQ); set("#tx-bdc-q", st.bdcQ);
    const f = host.querySelector("#tx-focus");
    if (f) { f.setAttribute("aria-pressed", st.focus ? "true" : "false"); f.classList.toggle("is-on", st.focus); }
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
    if (flowMode()) { if (st.q) renderSearch(); else renderFlow(); }
    if (st.mode === "credits") renderCredits();
    if (st.mode === "bdc") { renderBDCs(); loadBdcQuotes(); }
    renderDrawer();
  }
  // A state change from a control: update, record in the URL, re-render.
  function change(patch, push = true) {
    Object.assign(st, patch);
    commit(push); syncControls(); showMode(); render();
  }

  // ---- events (delegated) --------------------------------------------------
  host.querySelector("#tx-mode").addEventListener("click", (e) => {
    const b = e.target.closest(".tchip[data-mode]"); if (!b) return;
    if (b.dataset.mode === st.mode) { if (st.deal) change({ deal: "" }); return; }   // the active mode → back to its list
    change({ mode: b.dataset.mode, sub: "", sec: "all", grp: "", deal: "" });
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
    change({ crGroup: st.crGroup === mode ? null : mode });
  });
  host.querySelector("#tx-period").addEventListener("change", (e) => change({ period: e.currentTarget.value, deal: "" }));
  host.querySelector("#tx-min").addEventListener("change", (e) => change({ minUsd: Number(e.currentTarget.value) || 0, deal: "" }));
  host.querySelector("#tx-focus").addEventListener("click", () => change({ focus: !st.focus, deal: "" }));
  host.addEventListener("click", (e) => {
    // Lender / manager links → the profile (in-app, a history entry).
    const mgr = e.target.closest("a.tx-mgr");
    if (mgr) { e.preventDefault(); ctx.navigate(`${ctx.base}/profiles/#/manager/${mgr.dataset.id}`); return; }
    if (e.target.closest("a")) return;                                   // source links etc. keep native behaviour
    const clr = e.target.closest("[data-clear]");
    if (clr) {
      const k = clr.dataset.clear;
      const reset = { sub: { sub: "" }, sec: { sec: "all" }, period: { period: "all" }, min: { minUsd: 0 }, focus: { focus: false }, grp: { grp: "" },
        all: { sub: "", sec: "all", period: "all", minUsd: 0, focus: false, grp: "", q: "" } }[k];
      if (reset) change({ ...reset, deal: "" });
      return;
    }
    if (e.target.closest(".tx-drawer-x")) { closeDeal(); return; }
    // Type navigation (desktop rail + phone strip) — resets the sector filter.
    const subt = e.target.closest(".tx-subnav [data-sub], .tx-typestrip [data-sub]");
    if (subt) { if (subt.dataset.sub !== st.sub) change({ sub: subt.dataset.sub, sec: "all", deal: "" }); return; }
    const sec = e.target.closest(".tx-secchip[data-sec]");
    if (sec) { if (sec.dataset.sec !== st.sec) change({ sec: sec.dataset.sec, deal: "" }); return; }
    if (e.target.closest(".tx-grpbtn")) { change({ grp: st.grp ? "" : "lender" }); return; }
    // A deal (row, card, or a related-deal row in the drawer / a credit) → its drawer.
    const dl = e.target.closest("[data-deal]");
    if (dl) {
      if (st.mode === "credits") { const r = rowById.get(dl.dataset.deal); if (r) { Object.assign(st, { mode: groupOf(r.tx), sub: "", sec: "all", grp: "", q: "" }); syncControls(); showMode(); render(); openDeal(r.d.id); } return; }
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
    // Lending, no search, default filters, scrolled to top.
    home() {
      st = DEFAULT();
      commit(false); syncControls(); showMode(); render();
      window.scrollTo({ top: 0, behavior: "instant" });
    },
  };
}
