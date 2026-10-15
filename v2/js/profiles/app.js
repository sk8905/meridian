// Profiles — a cross-desk directory AND the home of every entity profile. It
// renders the EXACT same three lists that used to live under Credit (Managers,
// Hedge Funds) and Legal (Law firms) by borrowing those apps' own pane builders
// (one source per list, no second version), and — crucially — it now HOSTS the
// profile detail pages itself. Tapping a row no longer bounces you into the
// retired Credit/Legal desk tab: the manager / hedge-fund / law-firm page (and
// everything it links to — funds, CLOs, investors, filings) renders right here,
// inside Profiles, with a Managers · Hedge Funds · Investors · Law firms nav that
// returns to the list. The detail views are the desks' own view functions, at a
// Profiles-owned host per render (see __setProfilesMode in the detail modules).

import { viewBorrower } from "./borrower.js";
import { peoplePaneHTML } from "./people.js";
import { allPaneHTML } from "./all.js";
import {
  viewManager, viewClo, viewLp, viewHedgeFund, fundManagerId, viewCompare,
  __setHost as setCreditHost, __setProfilesMode as setCreditPfMode,
} from "/v2/js/credit/detail.js";
import {
  viewFirm, viewItem,
  __setHost as setLegalHost, __setProfilesMode as setLegalPfMode,
} from "/v2/js/legal/detail.js";
// Same shared.js instance the detail views read (same tokenless import), so seeding
// the URL-driven row highlight here is the pending focus viewManager applies.
import { setPendingFocus, isFollowed } from "/credit/js/shared.js";
import { esc } from "/util.js";
import { tableCols } from "/feed.js";
import { downloadCSV, tableRows } from "../csv.js";
// The LinkedIn-connections importer was retired (monitoring-only app); clear any
// connections a previous version left on this device.
try { localStorage.removeItem("wire.li.v1"); } catch { /* ignore */ }

export async function mount(host, ctx) {
  // Borrow Credit's and Legal's list builders (mounts them off-screen if needed).
  const [credit, legal] = await Promise.all([ctx.view("credit"), ctx.view("legal")]);
  // "All" (owner 2026-10-15) is the first and default list: every covered entity in one directory.
  const CHIPS = [["all", "All"], ["managers", "Managers"], ["hedgefunds", "Hedge Funds"], ["investors", "Investors"], ["firms", "Law firms"], ["people", "People"]];
  host.innerHTML = `
    <div id="pf-list" class="tdash">
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full">
          <header class="tpanel-h twire-head">
            <div class="tchips" id="pf-chips">${CHIPS
              .map(([k, l], i) => `<button type="button" class="tchip${i === 0 ? " is-on" : ""}" data-p="${k}">${l}</button>`).join("")}</div>
          </header>
          <div class="tpanes" id="pf-panes">
            ${allPaneHTML()}
            ${credit.buildManagers()}
            ${credit.buildHedgeFunds()}
            ${credit.buildInvestors()}
            ${legal.buildLawFirms()}
            ${peoplePaneHTML()}
            <div id="pf-detail" hidden></div>
          </div>
        </section>
      </div>
    </div>`;
  // R43: every (re-)rendered list / profile table gets its column roles.
  if (typeof MutationObserver === "function") {
    let q = 0;
    new MutationObserver(() => { if (!q) q = requestAnimationFrame(() => { q = 0; tableCols(host); }); }).observe(host, { childList: true, subtree: true });
    tableCols(host);
  }
  const pfList = host.querySelector("#pf-list");
  // The Managers bar toggle reads "European mid-market" from the first paint, whichever
  // list opens first (All is the default since 2026-10-15).
  { const lgF = host.querySelector("#cr-lg-focus"); if (lgF) setFocus(lgF, ""); }
  const pfDetail = host.querySelector("#pf-detail");
  const panes = host.querySelector("#pf-panes");
  const chips = host.querySelector("#pf-chips");
  // Leading column (owner 2026-10-15): where a dated list leads with its date, a Profiles
  // list leads with the entity's TYPE — Manager · Hedge fund · Investor · Law firm — in the
  // same faint micro style (R43). Carried as data-lead and drawn by CSS (::before), so
  // the table's columns, sort, URL state and CSV are untouched. People keeps its date.
  const LEAD = { managers: "Manager", hedgefunds: "Hedge fund", investors: "Investor", firms: "Law firm" };
  panes.querySelectorAll(".tpane[data-pane]").forEach((p) => {
    const k = p.dataset.pane; if (k === "people") return;
    const t = p.querySelector(".tleague-wrap table"); if (!t) return;
    t.classList.add("pf-lead");
    t.querySelectorAll("tbody tr").forEach((tr) => {
      const lead = k === "all" ? tr.dataset.fType : LEAD[k]; if (!lead) return;
      tr.dataset.lead = lead; if (tr.cells[0]) tr.cells[0].dataset.lead = lead;
    });
  });
  // The OFR Hedge Fund Monitor is collapsed on open — it loads lazily when the
  // "Monitor" toggle in the Hedge Funds header is first opened (wired below).

  // Back control: a leading ‹ chevron injected into each list's search row. When
  // a profile is open the list's tabs + AUM-focus row + search box stay put (the
  // table gives way to the profile below); the chevron in that persistent search
  // row returns to the list. Injected once per pane; shown only while detailing
  // (CSS .pf-detailing), and only in the active pane's visible search row.
  panes.querySelectorAll(".thead-search").forEach((h) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pf-back-chev";
    b.setAttribute("aria-label", "Back");
    b.setAttribute("title", "Back to the previous page");
    b.textContent = "‹";
    h.insertBefore(b, h.firstChild);
    // "★ Following" — narrows the list to the entities on your watchlist.
    const f = document.createElement("button");
    f.type = "button";
    f.className = "tfocus-btn pf-follow-btn";
    f.setAttribute("aria-pressed", "false");
    f.title = "Show only the names you follow";
    f.textContent = "★ Following";
    const inp = h.querySelector(".tsearch");
    if (inp && inp.nextSibling) h.insertBefore(f, inp.nextSibling); else h.appendChild(f);
    // Filters — the list's facet sheet (HOUSE_STYLE R39).
    // One row (R39e): search · (Target / $1–15bn) · Filters. Following, CSV, sort and the
    // Hedge Funds views stay in the DOM as hidden state holders; the panel drives them.
    f.classList.add("pf-hold");
    const fb = document.createElement("button");
    fb.type = "button"; fb.className = "tx-fbtn pf-filter-btn"; fb.setAttribute("aria-expanded", "false"); fb.setAttribute("aria-label", "Filters");
    fb.innerHTML = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="9" cy="6" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/><circle cx="7" cy="18" r="2" fill="currentColor"/></svg><span class="tx-fn"></span>`;
    h.appendChild(fb);
    h.querySelectorAll("#hf-mon-btn, #hf-cons-btn").forEach((x) => x.classList.add("pf-hold"));
    // CSV — the list's visible rows (search / focus / Following / sort applied).
    const c = document.createElement("button");
    c.type = "button"; c.className = "tfocus-btn pf-csv-btn pf-hold"; c.title = "Download this list as CSV"; c.textContent = "CSV";
    h.appendChild(c);
    // Phone: the column headers give way to card rows, so sorting is a select.
    const table = h.parentNode.querySelector(".tleague-wrap table");
    if (table) {
      const sel = document.createElement("select");
      sel.className = "tx-filt pf-sort pf-hold"; sel.setAttribute("aria-label", "Sort the list");
      sel.innerHTML = `<option value="">Default order</option>` + [...table.tHead.rows[0].cells].map((th, i) => {
        const l = th.textContent.replace(/\s+/g, " ").trim(); if (!l) return "";
        return `<option value="${i}:descending">${esc(l)} ↓</option><option value="${i}:ascending">${esc(l)} ↑</option>`;
      }).join("");
      h.appendChild(sel);
    }
    // Active-filter pills + the sheet, under the search row.
    const pills = document.createElement("div"); pills.className = "tx-active pf-active"; pills.hidden = true;
    h.appendChild(pills);
    const sheet = document.createElement("div"); sheet.className = "tx-sheet pf-sheet"; sheet.hidden = true;
    h.after(sheet);
  });
  // Facets per list (rows carry data-f-<facet>, pipe-separated; see credit/app.js).
  const PF_FACETS = {
    all: [["type", "Type"]],
    managers: [["strategy", "Strategy"], ["region", "Region"], ["band", "AUM"], ["mkt", "In market"]],
    hedgefunds: [["strategy", "Strategy"], ["region", "Region"]],
    investors: [["type", "Type"], ["mandate", "Mandate"]],
    firms: [["tier", "Tier"], ["practice", "Practice"]],
    // People (R11): hires / departures / promotions across the covered firms.
    people: [["move", "Move"], ["seniority", "Seniority"], ["period", "Period"], ["kind", "Type"], ["firm", "Firm"]],
  };
  // Shown under "More filters ▸" (the rest are always in the panel).
  const PF_MORE = { managers: ["band", "mkt"], people: ["firm"] };
  const _pfMore = {};
  const FIXED_ORDER = { band: ["< $1bn", "$1–15bn", "$15–100bn", "> $100bn", "n/a"], period: ["30d", "90d", "12m", "older"], move: ["Hire", "Departure", "Promotion", "Other"], seniority: ["C-suite", "Partner", "MD", "Head", "Director", "Other"] };
  const OPT_LABEL = { mkt: { yes: "Raising now", no: "Not raising" }, period: { "30d": "Last 30 days", "90d": "Last 90 days", "12m": "Last 12 months", older: "Older" } };
  const pfSel = {};   // pane key → { facet: [values] }
  const selOf = (key) => (pfSel[key] = pfSel[key] || Object.fromEntries((PF_FACETS[key] || []).map(([k]) => [k, []])));
  const rowVals = (tr, k) => (tr.getAttribute("data-f-" + k) || "").split("|").filter(Boolean);
  // The $1–15bn button on Managers is a tri-state: off → $1–15bn → Target → off.
  const focusOf = (pane) => {
    const fb = pane.querySelector("#cr-lg-focus, #cr-hf-focus");
    if (!fb) return "";
    if (fb.id === "cr-lg-focus") return fb.dataset.focus || "";
    return fb.getAttribute("aria-pressed") === "true" ? "band" : "";
  };
  function setFocus(fb, v) {
    fb.dataset.focus = v;
    fb.setAttribute("aria-pressed", v ? "true" : "false");
    fb.classList.toggle("is-on", !!v);
    // The bar button is the Target shortcut; $1–15bn AUM is chosen in the panel.
    fb.textContent = "European mid-market";
    fb.setAttribute("aria-pressed", v === "target" ? "true" : "false");
    fb.classList.toggle("is-on", v === "target");
    fb.title = v === "target" ? "Showing European mid-market managers (European, ≤ $15bn, 15%+ strategy) — tap to clear" : "Show only European mid-market managers (European, ≤ $15bn, 15%+ strategy); $1–15bn AUM is in Filters";
  }
  // ONE row filter per list — the search text, the $1–15bn AUM focus and Following
  // combine (each used to overwrite the others' result).
  const ROWSEL = { all: "#all-rows tr", managers: "#mgr-rows tr", hedgefunds: "#hf-rows tr", investors: "#lp-rows tr", firms: "#lf-rows tr", people: "#pp-rows tr" };
  const FTYPE = { manager: "manager", hf: "hf", lp: "lp", firm: "firm" };
  const dec0 = (x) => { try { return decodeURIComponent(x); } catch { return x; } };
  function rowPasses(pane, tr, except) {
    const key = pane.dataset.pane;
    const q = ((pane.querySelector(".tsearch") || {}).value || "").toLowerCase().trim();
    const focus = focusOf(pane);
    const fol = (pane.querySelector(".pf-follow-btn") || {}).getAttribute?.("aria-pressed") === "true";
    const [, type, id] = (tr.getAttribute("data-href") || "").match(/^#\/(\w+)\/(.+)$/) || [];
    const sel = selOf(key);
    return (!q || (tr.dataset.name || "").includes(q))
      && (!focus || (focus === "target" ? tr.dataset.tier === "core" : tr.dataset.focus === "1"))
      && (!fol || (FTYPE[type] && isFollowed(FTYPE[type], dec0(id))))
      && (PF_FACETS[key] || []).every(([k]) => k === except || !sel[k].length || rowVals(tr, k).some((v) => sel[k].includes(v)));
  }
  function filterList(pane) {
    if (!pane) return;
    const key = pane.dataset.pane, sel = ROWSEL[key]; if (!sel) return;
    host.querySelectorAll(sel).forEach((tr) => { tr.style.display = rowPasses(pane, tr) ? "" : "none"; });
    renderPfChrome(pane);
    writeListState(pane);
  }
  // ---- list state in the URL (HOUSE_STYLE R35/R39) --------------------------------
  // #/?tab=<list>&q=&aum=band|target&following=1&<facet>=a|b&sort=<col>-<asc|desc>
  // Filter / sort changes REPLACE the entry (Back never walks chip taps); reload, a
  // pasted link and Back from a profile restore the list exactly. Each list keeps its
  // own last URL so switching tabs and back returns to the same filtered view.
  const _paneHash = {};
  const listHash = (tab) => _paneHash[tab] || "#/?tab=" + tab;
  let _applying = false;
  function stateHash(pane) {
    const key = pane.dataset.pane, p = new URLSearchParams();
    p.set("tab", key);
    const q = ((pane.querySelector(".tsearch") || {}).value || "").trim(); if (q) p.set("q", q);
    const f = focusOf(pane); if (f) p.set("aum", f);
    if ((pane.querySelector(".pf-follow-btn") || {}).getAttribute?.("aria-pressed") === "true") p.set("following", "1");
    const sel = selOf(key); for (const [k] of PF_FACETS[key] || []) if (sel[k].length) p.set(k, sel[k].join("|"));
    const th = [...pane.querySelectorAll(".tleague-wrap table thead th")].find((h) => ["ascending", "descending"].includes(h.getAttribute("aria-sort")));
    if (th) p.set("sort", `${[...th.parentNode.children].indexOf(th)}-${th.getAttribute("aria-sort") === "ascending" ? "asc" : "desc"}`);
    return "#/?" + p.toString().replace(/%7C/gi, "|");
  }
  function writeListState(pane) {
    if (_applying || !pane || pane.hidden || host.classList.contains("pf-detailing")) return;
    const h = stateHash(pane);
    _paneHash[pane.dataset.pane] = h;
    if (document.documentElement.dataset.v2tab !== "profiles" || location.hash === h) return;
    try { history.replaceState(history.state, "", location.pathname + location.search + h); } catch { /* keep */ }
  }
  function applyListState(tab, rawIn) {
    const pane = panes.querySelector(`.tpane[data-pane="${tab}"]`); if (!pane) return;
    const raw = rawIn != null ? rawIn : ((location.hash || "").split("?")[1] || location.search.slice(1));
    const q = new URLSearchParams(raw);
    _applying = true;
    try {
      const inp = pane.querySelector(".tsearch"); if (inp) inp.value = q.get("q") || "";
      const fb = pane.querySelector("#cr-lg-focus, #cr-hf-focus");
      if (fb) {
        const v = q.get("aum") || "";
        if (fb.id === "cr-lg-focus") setFocus(fb, ["band", "target"].includes(v) ? v : "");
        else { const on = v === "band"; fb.setAttribute("aria-pressed", String(on)); fb.classList.toggle("is-on", on); }
      }
      const fol = pane.querySelector(".pf-follow-btn");
      if (fol) { const on = q.get("following") === "1"; fol.setAttribute("aria-pressed", String(on)); fol.classList.toggle("is-on", on); }
      const sel = selOf(tab);
      for (const [k] of PF_FACETS[tab] || []) sel[k] = (q.get(k) || "").split("|").filter(Boolean);
      const m = /^(\d+)-(asc|desc)$/.exec(q.get("sort") || "");
      const th = m && pane.querySelector(".tleague-wrap table").tHead.rows[0].cells[+m[1]];
      if (th) sortBy(th, m[2] === "asc" ? "ascending" : "descending"); else resetOrder(pane);
      filterList(pane);
    } finally { _applying = false; }
    _paneHash[tab] = stateHash(pane);
    // Canonicalise (e.g. a bare /v2/profiles/?tab=… or dropped unknown params) in place.
    if (rawIn == null && document.documentElement.dataset.v2tab === "profiles" && location.hash && location.hash !== _paneHash[tab]) {
      try { history.replaceState(history.state, "", location.pathname + location.search + _paneHash[tab]); } catch { /* keep */ }
    }
  }
  // Pills + the Filters button count + (when open) the sheet with live counts.
  function renderPfChrome(pane) {
    const key = pane.dataset.pane, facets = PF_FACETS[key] || [], sel = selOf(key);
    const label = (k, v) => (OPT_LABEL[k] && OPT_LABEL[k][v]) || v;
    const fol = pane.querySelector(".pf-follow-btn"), folOn = !!fol && fol.getAttribute("aria-pressed") === "true";
    const focus = focusOf(pane);
    // ONE quiet summary line, only when something narrows the list.
    const labels = [...facets.flatMap(([k]) => sel[k].map((v) => label(k, v))),
      ...(focus === "band" ? ["$1–15bn AUM"] : focus === "target" ? ["European mid-market"] : []), ...(folOn ? ["Following"] : [])];
    const pe = pane.querySelector(".pf-active");
    if (pe) {
      pe.hidden = !labels.length;
      pe.innerHTML = labels.length ? `<span class="tx-sum">${esc(labels.join(", "))}</span><button type="button" class="tx-clear" data-pfclear="all">Clear</button>` : "";
    }
    const sheet = pane.querySelector(".pf-sheet"), fb = pane.querySelector(".pf-filter-btn");
    const open = !!sheet && !sheet.hidden;
    const n = labels.length - (focus === "target" ? 1 : 0);   // Target shows on its own button
    if (fb) {
      fb.querySelector(".tx-fn").textContent = n ? String(n) : "";
      fb.classList.toggle("is-on", open); fb.classList.toggle("has-n", !!n);
      fb.setAttribute("aria-expanded", String(open)); fb.setAttribute("aria-label", n ? `Filters (${n})` : "Filters");
    }
    pane.classList.toggle("pf-sheet-open", open);
    if (!open) return;
    const rows = [...host.querySelectorAll(ROWSEL[key])];
    const shown = rows.filter((tr) => tr.style.display !== "none").length;
    const chip = (attrs, l, on, n2) => `<button type="button" class="tx-fchip${on ? " is-on" : ""}" ${attrs} aria-pressed="${on}">${esc(l)}${n2 != null ? `<span class="tx-secn">${n2}</span>` : ""}</button>`;
    const block = ([k, title]) => {
      const counts = {};
      rows.forEach((tr) => { if (rowPasses(pane, tr, k)) rowVals(tr, k).forEach((v) => { counts[v] = (counts[v] || 0) + 1; }); });
      const all = new Set(rows.flatMap((tr) => rowVals(tr, k)));
      let opts = FIXED_ORDER[k] ? FIXED_ORDER[k].filter((v) => all.has(v)) : [...all].sort((a, b) => (counts[b] || 0) - (counts[a] || 0) || a.localeCompare(b));
      if (k === "mkt") opts = ["yes"];
      opts = opts.filter((v) => counts[v] || sel[k].includes(v));
      if (!opts.length) return "";
      return `<div class="tx-fgrp" data-fgrp="${k}"><div class="tx-fh">${esc(title)}</div><div class="tx-fchips">`
        + opts.map((v) => chip(`data-pfacet="${k}" data-v="${esc(v)}"`, label(k, v), sel[k].includes(v), counts[v] || 0)).join("") + `</div></div>`;
    };
    const more = PF_MORE[key] || [];
    if (more.some((k) => sel[k].length) || folOn) _pfMore[key] = true;
    const moreOpen = !!_pfMore[key];
    const fbtn = pane.querySelector("#cr-lg-focus, #cr-hf-focus");
    const fit = !fbtn ? "" : fbtn.id === "cr-lg-focus"
      ? `<div class="tx-fgrp" data-fgrp="fit"><div class="tx-fh">Managers</div><div class="tx-fchips">${[["", "All"], ["band", "$1–15bn AUM"], ["target", "European mid-market"]].map(([v, l]) => chip(`data-pffit="${v}"`, l, focus === v)).join("")}</div></div>`
      : `<div class="tx-fgrp" data-fgrp="fit"><div class="tx-fh">AUM</div><div class="tx-fchips">${chip(`data-pffit=""`, "All", !focus)}${chip(`data-pffit="band"`, "$1–15bn", focus === "band")}</div></div>`;
    const sortSel = pane.querySelector(".pf-sort");
    const sortHTML = sortSel ? `<select class="tx-filt pf-sort-p" aria-label="Sort the list">${sortSel.innerHTML}</select>` : "";
    const showMore = `<div class="tx-fgrp" data-fgrp="show"><div class="tx-fh">Show &amp; sort</div><div class="tx-fchips">${chip(`data-pfstate="follow"`, "★ Following", folOn)}${sortHTML}</div></div>`;
    const views = key === "hedgefunds" ? `<div class="tx-fgrp pf-views"><div class="tx-fh">Views</div><div class="tx-fchips"><button type="button" class="tx-fchip" data-proxy="#hf-mon-btn">Monitor</button><button type="button" class="tx-fchip" data-proxy="#hf-cons-btn">Cross-holdings</button></div></div>` : "";
    sheet.innerHTML = `<div class="tx-sheet-b">${fit}${facets.filter(([k]) => !more.includes(k)).map(block).join("")}`
      + (more.length ? `<button type="button" class="tx-fmore-t" data-pfmore="1" aria-expanded="${moreOpen}">${moreOpen ? "Fewer filters ▾" : "More filters ▸"}</button>` : "")
      + (moreOpen || !more.length ? facets.filter(([k]) => more.includes(k)).map(block).join("") + showMore : "")
      + views + `</div>`
      + `<div class="tx-sheet-f"><button type="button" class="tx-clear" data-pfclear="all">Clear all</button><span class="tx-sheet-fr"><button type="button" class="tfocus-btn tx-csv" data-proxy=".pf-csv-btn" data-keep="1">Export CSV</button><button type="button" class="tx-sheet-done pf-sheet-done">Show ${shown}</button></span></div>`;
    const ps = sheet.querySelector(".pf-sort-p"); if (ps && sortSel) ps.value = sortSel.value;
    // Desktop: drop down just under the bar, over the list.
    const bar = pane.querySelector(".thead-search");
    sheet.style.top = window.matchMedia("(max-width:760px)").matches || !bar ? "" : (bar.offsetTop + bar.offsetHeight) + "px";
  }

  // Sortable columns: tap a list header to sort by it (again to reverse). Money cells
  // ("€1.2tn", "$227.60bn", "€600m") sort by value; "—" / "n/a" always sort last.
  const cellVal = (td) => {
    if (td && td.dataset.sort != null && td.dataset.sort !== "") return Number(td.dataset.sort);
    const t = (td ? td.textContent : "").trim();
    if (!t || /^(—|n\/a|-)$/i.test(t)) return null;
    const m = t.match(/^[~≈]?\s*[€$£]?\s*(-?[\d,.]+)\s*(tn|bn|m|k|%)?/i);
    if (m) { let v = parseFloat(m[1].replace(/,/g, "")); const u = (m[2] || "").toLowerCase(); if (u === "tn") v *= 1000; else if (u === "m") v /= 1000; else if (u === "k") v /= 1e6; if (isFinite(v)) return v; }
    return t.toLowerCase();
  };
  panes.querySelectorAll(".tleague thead th").forEach((th) => { th.classList.add("pf-sortable"); th.setAttribute("tabindex", "0"); th.setAttribute("aria-sort", "none"); });
  function sortBy(th, force) {
    const table = th.closest("table"), tb = table && table.tBodies[0]; if (!tb) return;
    const i = [...th.parentNode.children].indexOf(th);
    const dir = force || (th.getAttribute("aria-sort") === "descending" ? "ascending" : "descending");
    th.parentNode.querySelectorAll("th").forEach((h) => h.setAttribute("aria-sort", "none"));
    th.setAttribute("aria-sort", dir);
    const rowsArr = [...tb.rows];
    const k = (tr) => cellVal(tr.cells[i]);
    rowsArr.sort((a, b) => {
      const x = k(a), y = k(b);
      if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
      const c = (typeof x === "number" && typeof y === "number") ? x - y : String(x).localeCompare(String(y));
      return dir === "ascending" ? c : -c;
    });
    rowsArr.forEach((r) => tb.appendChild(r));
    const ps = th.closest(".tpane") && th.closest(".tpane").querySelector(".pf-sort");
    if (ps) ps.value = `${i}:${dir}`;
    writeListState(th.closest(".tpane"));
  }
  // The builder's own order (target-first on Managers), for "Default order".
  const _origOrder = new Map([...panes.querySelectorAll(".tleague-wrap table")].map((t) => [t, t.tBodies[0] ? [...t.tBodies[0].rows] : []]));
  function resetOrder(pane) {
    const t = pane.querySelector(".tleague-wrap table"); if (!t || !_origOrder.has(t)) return;
    _origOrder.get(t).forEach((r) => t.tBodies[0].appendChild(r));
    t.tHead.querySelectorAll("th").forEach((h) => h.setAttribute("aria-sort", "none"));
    const ps = pane.querySelector(".pf-sort"); if (ps) ps.value = "";
    writeListState(pane);
  }
  panes.addEventListener("keydown", (e) => { const th = e.target.closest && e.target.closest("th.pf-sortable"); if (th && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); sortBy(th); } });

  // ---- list <-> detail plumbing -------------------------------------------
  const showPane = (p) => panes.querySelectorAll(".tpane").forEach((el) => { el.hidden = el.dataset.pane !== p; });
  const selectChip = (p) => {
    chips.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c.dataset.p === p));
    showPane(p);
  };
  // Detailing = a profile is open. The list frame (chips + AUM-focus + search)
  // stays visible; CSS (.pf-detailing) hides the active list's TABLE and the
  // detail's own duplicate section nav, so the profile renders directly under the
  // search box. exitDetail() just closes the profile (no scroll — used when you
  // start typing/filtering in the persistent search); showList() also resets the
  // scroll and (optionally) the active tab.
  const setDetailing = (on) => host.classList.toggle("pf-detailing", on);
  const exitDetail = () => { setDetailing(false); pfDetail.hidden = true; pfDetail.innerHTML = ""; };
  // Scroll memory per list tab: opening a profile records where the list was, and
  // returning to that list (Back, the ‹ chevron, the tab chip) puts the reader back on
  // the same row. Desktop scrolls inside the view section (fixed-viewport terminal);
  // the phone scrolls the window.
  const _listY = {};
  const scroller = () => (host.scrollHeight > host.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(host).overflowY)) ? host : null;
  const getY = () => { const s = scroller(); return s ? s.scrollTop : window.scrollY; };
  const setY = (y) => { const s = scroller(); if (s) s.scrollTo({ top: y, behavior: "instant" }); else window.scrollTo({ top: y, behavior: "instant" }); };
  const activeTab = () => { const on = chips.querySelector(".tchip.is-on"); return on ? on.dataset.p : "all"; };
  const rememberList = () => { if (!host.classList.contains("pf-detailing") && !pfList.hidden) _listY[activeTab()] = getY(); };
  function showList(tab) {
    exitDetail();
    _via = null;
    pfList.hidden = false;
    if (tab) selectChip(tab);
    const y = _listY[activeTab()] || 0;
    setY(y);
    if (y) requestAnimationFrame(() => setY(y));   // re-apply once the table has re-laid out
  }
  // Render a desk detail view into the Profiles-owned host. The list stays
  // mounted (only its table is hidden by .pf-detailing); point the shared detail
  // host at #pf-detail and flip Profiles mode on right before the synchronous
  // render. selectChip(p) first, so the persistent frame above the profile is the
  // RIGHT list (its search box + AUM focus), and the active tab highlights.
  // On desktop the identity header is sticky; the section-tab rail sticks just
  // BELOW it — so the list scrolls under a fixed header + tabs. Publish the header's
  // live height as --pf-head-h so the tabs' sticky offset tracks it (it changes when
  // the Peers/Sources dropdowns expand). One ResizeObserver, reused across renders.
  let _headRO = null;
  const activeSearch = () => [...panes.querySelectorAll(".tpane")].map((p) => (p.hidden ? null : p.querySelector(".thead-search"))).find(Boolean) || null;
  const publishHeights = () => {
    const id = pfDetail.querySelector(".tdet-id");
    const sb = activeSearch();
    pfDetail.style.setProperty("--pf-search-h", (sb ? sb.offsetHeight : 0) + "px");
    if (id) pfDetail.style.setProperty("--pf-head-h", id.offsetHeight + "px");
    else pfDetail.style.removeProperty("--pf-head-h");
  };
  const syncHeadH = () => {
    const id = pfDetail.querySelector(".tdet-id");
    if (!id) { pfDetail.style.removeProperty("--pf-head-h"); pfDetail.style.removeProperty("--pf-search-h"); return; }
    publishHeights();
    if (typeof ResizeObserver === "function") {
      if (!_headRO) _headRO = new ResizeObserver(() => publishHeights());
      _headRO.disconnect(); _headRO.observe(id);
      const sb = activeSearch(); if (sb) _headRO.observe(sb);
    }
  };
  const renderCredit = (p, fn) => { rememberList(); selectChip(_via || p); setDetailing(true); pfList.hidden = false; pfDetail.hidden = false; setCreditHost(pfDetail); setCreditPfMode(true); setY(0); fn(); syncHeadH(); };
  const renderLegal = (p, fn) => { rememberList(); selectChip(_via || p); setDetailing(true); pfList.hidden = false; pfDetail.hidden = false; setLegalHost(pfDetail); setLegalPfMode(true); setY(0); fn(); syncHeadH(); };

  // Hash router (Profiles owns /v2/profiles/#/…). No route → the list, honouring
  // ?tab=; a detail route renders the matching desk view in place.
  const dec = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
  function readTab() {
    // ?tab= inside the hash (#/?tab=…) is the canonical form; a plain query string
    // (/v2/profiles/?tab=…, e.g. a pasted link) is honoured too.
    const q = (location.hash || "").split("?")[1] || "";
    const t = new URLSearchParams(q).get("tab") || new URLSearchParams(location.search).get("tab");
    return CHIPS.some(([k]) => k === t) ? t : "all";
  }
  function router() {
    const raw = location.hash || "#/";
    const seg = raw.split("?")[0].replace(/^#/, "").split("/").filter(Boolean);
    const route = seg[0], arg = seg[1];
    // URL-driven row highlight (?focus=…) — same contract as the desks: a search
    // result or a saved/watchlist row can deep-link to a manager's specific news
    // story. Seed the pending focus BEFORE rendering (viewManager applies it), then
    // drop the param so later re-renders don't keep re-scrolling. "k:" targets a
    // row by its feed dedup key; otherwise by element id.
    const q = raw.split("?")[1] || "";
    const focusId = q ? new URLSearchParams(q).get("focus") : null;
    if (focusId) {
      setPendingFocus(focusId.startsWith("k:")
        ? { view: route, fkey: dec(focusId.slice(2)), until: Date.now() + 4000 }
        : { view: route, id: focusId, until: Date.now() + 4000 });
      try { history.replaceState(null, "", location.pathname + location.search + raw.split("?")[0]); } catch { /* keep the param if replaceState is blocked */ }
    }
    switch (route) {
      case "manager": renderCredit("managers", () => viewManager(arg, seg[2])); return;
      // The standalone fund page is retired — redirect to the fund's manager so no
      // link (search, peer lists, connections, feed items) can reach a dead page.
      case "fund": {
        const mid = fundManagerId(arg);
        if (!mid) return showList("managers");
        const mh = `#/manager/${encodeURIComponent(mid)}`;
        try { history.replaceState(null, "", location.pathname + location.search + mh); } catch { location.hash = mh; }
        renderCredit("managers", () => viewManager(mid)); return;
      }
      case "clo": return renderCredit("managers", () => viewClo(arg, seg[2] ? dec(seg[2]) : ""));
      case "compare": return renderCredit("managers", () => viewCompare(dec(arg || ""), seg[2] ? dec(seg[2]) : ""));
      case "lp": return renderCredit("investors", () => viewLp(arg, seg[2]));
      // Borrower / company page (review #10) — everything Wire holds on one company.
      case "co": return renderCredit("managers", () => { viewBorrower(pfDetail, dec(arg || ""), ctx.base || "/v2"); });
      case "hf": renderCredit("hedgefunds", () => viewHedgeFund(arg, seg[2])); return;
      case "firm": renderLegal("firms", () => viewFirm(dec(arg), seg[2])); return;
      case "item": return renderLegal("firms", () => viewItem(dec(arg)));
      default: { const t = readTab(); showList(t); applyListState(t); return; }
    }
  }
  // Only act on hash moves while Profiles is the active tab — other tabs drive
  // the same location.hash and must not trip this router (mirrors the desks).
  window.addEventListener("hashchange", () => { if (document.documentElement.dataset.v2tab === "profiles") router(); });

  // ---- activation (clicks AND touch taps) ----------------------------------
  // Navigate to a [data-href] row's target: an external/absolute href opens a
  // new tab, an internal hash route renders the profile in place NOW (not via
  // the hashchange event + active-tab guard, which can silently miss).
  // A row opened from the People list keeps People as the active list, so the ‹ back
  // control (and the persistent search row above the profile) return to it.
  let _via = null;
  const goRow = (row) => {
    _via = row.closest('.tpane[data-pane="people"]') ? "people" : null;
    const href = row.getAttribute("data-href");
    if (!href) return;
    if (row.dataset.ext === "1" || /^https?:/i.test(href)) { (window.__wireRead ? window.__wireRead(href, { title: (row.querySelector(".tmini-t, .tw-head, td") || row).textContent.trim().slice(0, 200) }) : window.open(href, "_blank", "noopener")); return; }
    if (location.hash !== href) location.hash = href;
    router();
  };
  const goLink = (link) => {
    const h = link.getAttribute("href");
    if (location.hash !== h) location.hash = h;
    router();
  };

  // Chip taps switch the list pane. Row taps (list league rows AND the detail
  // views' .clickable rows) drive the hash router; a click on a cell's own link
  // (AUM source, 13F, SLS chip, breadcrumb) defers to that anchor. External /
  // absolute rows open in a new tab.
  host.addEventListener("click", (e) => {
    // Leading ‹ chevron in the persistent search row → close the profile and
    // return to the list it came from (the active tab).
    const back = e.target.closest(".pf-back-chev");
    // ‹ returns to the page you were on immediately before (owner 2026-10-15) — a
    // profile reached from Deals, Markets, another profile or the list steps back
    // there; only a cold deep link (no in-app history) falls back to the list.
    if (back && document.documentElement.hasAttribute("data-can-back")) { history.back(); return; }
    if (back) {
      const on = chips.querySelector(".tchip.is-on");
      const h = listHash(on ? on.dataset.p : "all");
      if (location.hash !== h) location.hash = h;
      router();
      return;
    }
    // A tab tap always lands on that list (closing any open profile).
    const chip = e.target.closest("#pf-chips .tchip");
    if (chip) {
      rememberList();
      const h = listHash(chip.dataset.p);
      if (location.hash !== h) location.hash = h;
      router();
      return;
    }
    // League $1–15bn AUM focus toggles + the hedge-fund Cross-holdings (13F
    // consensus) button. These live inside the borrowed panes, whose ids are
    // duplicated in the Credit desk — wire OUR copies here, scoped to this host.
    const focus = e.target.closest("#cr-hf-focus, #cr-lg-focus");
    if (focus) {
      if (host.classList.contains("pf-detailing")) exitDetail();   // filtering means you want the list
      if (focus.id === "cr-lg-focus") setFocus(focus, focus.dataset.focus === "target" ? "" : "target");
      else { const on = focus.getAttribute("aria-pressed") !== "true"; focus.setAttribute("aria-pressed", on ? "true" : "false"); focus.classList.toggle("is-on", on); }
      filterList(focus.closest(".tpane"));
      return;
    }
    // Facet sheet: open/close, chip toggles, pills, Show N, the HF view proxies.
    const pfb = e.target.closest(".pf-filter-btn");
    if (pfb) {
      if (host.classList.contains("pf-detailing")) exitDetail();
      const pane = pfb.closest(".tpane"), sh = pane.querySelector(".pf-sheet");
      sh.hidden = !sh.hidden; if (sh.hidden) sh.innerHTML = "";
      renderPfChrome(pane); return;
    }
    const pfc = e.target.closest("[data-pfacet]");
    if (pfc) {
      const pane = pfc.closest(".tpane"), sel = selOf(pane.dataset.pane), k = pfc.dataset.pfacet, v = pfc.dataset.v;
      sel[k] = sel[k].includes(v) ? sel[k].filter((x) => x !== v) : [...sel[k], v];
      filterList(pane); return;
    }
    const pmo = e.target.closest("[data-pfmore]");
    if (pmo) { const pane = pmo.closest(".tpane"); _pfMore[pane.dataset.pane] = !_pfMore[pane.dataset.pane]; renderPfChrome(pane); return; }
    const pfit = e.target.closest("[data-pffit]");
    if (pfit) {
      const pane = pfit.closest(".tpane"), fbtn = pane.querySelector("#cr-lg-focus, #cr-hf-focus"), v = pfit.dataset.pffit;
      if (fbtn.id === "cr-lg-focus") setFocus(fbtn, v);
      else { fbtn.setAttribute("aria-pressed", String(v === "band")); fbtn.classList.toggle("is-on", v === "band"); }
      filterList(pane); return;
    }
    const pst = e.target.closest("[data-pfstate]");
    if (pst) { const pane = pst.closest(".tpane"), f = pane.querySelector(".pf-follow-btn"); const on = f.getAttribute("aria-pressed") !== "true"; f.setAttribute("aria-pressed", String(on)); f.classList.toggle("is-on", on); filterList(pane); return; }
    const pcl = e.target.closest("[data-pfclear]");
    if (pcl) {
      if (host.classList.contains("pf-detailing")) exitDetail();
      const pane = pcl.closest(".tpane"), sel = selOf(pane.dataset.pane), k = pcl.dataset.pfclear;
      if (k === "all") {
        Object.keys(sel).forEach((f) => { sel[f] = []; });
        const fbtn = pane.querySelector("#cr-lg-focus, #cr-hf-focus");
        if (fbtn && fbtn.id === "cr-lg-focus") setFocus(fbtn, ""); else if (fbtn) { fbtn.setAttribute("aria-pressed", "false"); fbtn.classList.remove("is-on"); }
        const f = pane.querySelector(".pf-follow-btn"); if (f) { f.setAttribute("aria-pressed", "false"); f.classList.remove("is-on"); }
      }
      else { const i = k.indexOf(":"), f = k.slice(0, i), v = k.slice(i + 1); sel[f] = sel[f].filter((x) => x !== v); }
      filterList(pane); return;
    }
    const pdone = e.target.closest(".pf-sheet-done");
    if (pdone) { const pane = pdone.closest(".tpane"), sh = pane.querySelector(".pf-sheet"); sh.hidden = true; sh.innerHTML = ""; renderPfChrome(pane); return; }
    const prox = e.target.closest("[data-proxy]");
    if (prox) {
      const pane = prox.closest(".tpane"), sh = pane.querySelector(".pf-sheet"), t = pane.querySelector(prox.dataset.proxy);
      if (!prox.dataset.keep) { sh.hidden = true; sh.innerHTML = ""; renderPfChrome(pane); }
      if (t) t.click();
      return;
    }
    const fol = e.target.closest(".pf-follow-btn");
    if (fol) {
      if (host.classList.contains("pf-detailing")) exitDetail();
      const on = fol.getAttribute("aria-pressed") !== "true";
      fol.setAttribute("aria-pressed", on ? "true" : "false");
      fol.classList.toggle("is-on", on);
      filterList(fol.closest(".tpane"));
      return;
    }
    const csvb = e.target.closest(".pf-csv-btn");
    if (csvb) {
      const pane = csvb.closest(".tpane"), t = pane && pane.querySelector(".tleague-wrap table");
      if (t) { const { header, rows } = tableRows(t); downloadCSV(`wire-${pane.dataset.pane}`, header, rows); }
      return;
    }
    const sth = e.target.closest("#pf-panes th.pf-sortable");
    if (sth) { sortBy(sth); return; }
    const cons = e.target.closest("#hf-cons-btn");
    if (cons) { if (credit.loadConsensus) credit.loadConsensus(cons); return; }
    // Hedge fund monitor — collapsed by default, revealed by the header "Monitor"
    // toggle. Lazy-loads the OFR feed on first open; the ✕ in the panel (or a
    // second tap) collapses it again. Scoped to this host (duplicate ids on the
    // retired Credit desk).
    const mon = e.target.closest("#hf-mon-btn");
    if (mon) {
      if (host.classList.contains("pf-detailing")) exitDetail();   // show the list + monitor
      const ofr = host.querySelector("#hf-ofr");
      const on = mon.getAttribute("aria-pressed") !== "true";
      mon.setAttribute("aria-pressed", on ? "true" : "false");
      mon.classList.toggle("is-on", on);
      if (ofr) {
        ofr.hidden = !on;
        if (on) {
          const tiles = ofr.querySelector("#hf-ofr-tiles");
          if (tiles && !ofr.dataset.loaded && !tiles.children.length) tiles.innerHTML = `<div class="hf-ofr-note muted small">Loading monitor…</div>`;
          if (credit.loadHfm) credit.loadHfm(host);
        }
      }
      return;
    }
    const ofrx = e.target.closest(".hf-ofr-x");
    if (ofrx) {
      const ofr = host.querySelector("#hf-ofr");
      const mb = host.querySelector("#hf-mon-btn");
      if (ofr) ofr.hidden = true;
      if (mb) { mb.setAttribute("aria-pressed", "false"); mb.classList.remove("is-on"); }
      return;
    }
    // Watchlist star (☆/★) — Profiles HOSTS the profile pages, so the follow
    // toggle must be wired HERE too (the retired Credit desk's own handler is not
    // loaded). Reuse Credit's single toggle (local persist + debounced cloud PUT
    // to /api/watchlist, which the refresh routine reads for deep-research), then
    // flip the button in place so the tap doesn't scroll-jump the profile.
    const fav = e.target.closest("[data-follow]");
    if (fav) {
      e.preventDefault(); e.stopPropagation();
      const [type, id] = (fav.getAttribute("data-follow") || "").split(":");
      if (type && id && credit.toggleFollow) {
        const on = credit.toggleFollow(type, id);
        fav.classList.toggle("on", on);
        fav.textContent = on ? "★" : "☆";
        fav.setAttribute("title", on ? "Following — click to remove from watchlist" : "Add to your watchlist");
      }
      return;
    }
    // Internal hash links inside Profiles — breadcrumbs, the Managers/Hedge Funds/
    // Law firms section chips, and the detail views' own sub-entity anchors (a
    // manager's funds/CLOs, a fund's manager, etc.). Route HERE, synchronously,
    // rather than leaving it to the anchor's native hashchange + the active-tab
    // guard, which can silently miss on some devices/timings.
    const link = e.target.closest('a[href^="#/"]');
    if (link) { e.preventDefault(); goLink(link); return; }
    const row = e.target.closest("[data-href]");
    if (!row || e.target.closest("a")) return;
    goRow(row);
  });

  // TOUCH TAP FALLBACK — the actual fix for "tapping a name does nothing" on
  // iPhone. iOS Safari only synthesises a `click` on a tap when the tapped
  // element (or an ancestor) is genuinely interactive — a link, a button, a
  // form control. Our league rows are plain <tr data-href> with plain <td> text
  // (cursor:pointer is NOT sufficient on iOS), so a tap fires NO click and the
  // delegated handler above never runs — while a long-press still offers the
  // text callout. Real <button>/<a> children (chips, source links) DO fire click
  // and stay on the path above; here we add the one thing iOS misses: a genuine
  // tap (finger didn't move → not a scroll) on a [data-href] row. preventDefault
  // suppresses the would-be ghost click and the text-selection callout.
  let tStart = null;
  host.addEventListener("touchstart", (e) => {
    const t = e.changedTouches && e.changedTouches[0];
    tStart = t ? { x: t.clientX, y: t.clientY } : null;
  }, { passive: true });
  host.addEventListener("touchend", (e) => {
    const start = tStart; tStart = null;
    const t = e.changedTouches && e.changedTouches[0];
    if (!start || !t) return;
    if (Math.abs(t.clientX - start.x) + Math.abs(t.clientY - start.y) > 12) return; // a scroll, not a tap
    if (e.target.closest("a")) return;                 // inner links keep native behaviour
    const row = e.target.closest("[data-href]");
    if (!row) return;                                  // buttons/links/inputs (incl. the watchlist star): leave to click
    e.preventDefault();
    goRow(row);
  }, { passive: false });
  host.addEventListener("change", (e) => {
    const pp = e.target.closest(".pf-sort-p");
    if (pp) { const real = pp.closest(".tpane").querySelector(".pf-sort"); real.value = pp.value; real.dispatchEvent(new Event("change", { bubbles: true })); return; }
    const ps = e.target.closest(".pf-sort"); if (!ps) return;
    const pane = ps.closest(".tpane");
    if (!ps.value) { resetOrder(pane); return; }
    const [i, dir] = ps.value.split(":");
    const th = pane.querySelector(".tleague-wrap table").tHead.rows[0].cells[+i];
    if (th) sortBy(th, dir);
  });
  // Desktop: a click outside an open Filters panel (and its button) closes it.
  document.addEventListener("click", (e) => {
    if (document.documentElement.dataset.v2tab !== "profiles" || window.matchMedia("(max-width:760px)").matches) return;
    if (!document.contains(e.target) || e.target.closest(".pf-sheet, .pf-filter-btn")) return;
    panes.querySelectorAll(".pf-sheet:not([hidden])").forEach((sh) => { sh.hidden = true; sh.innerHTML = ""; renderPfChrome(sh.closest(".tpane")); });
  });
  // Each list's search box filters its rows in place by the row's data-name.
  // Scoped to this host so it never touches the desks' own (hidden) copies.
  host.addEventListener("input", (e) => {
    const inp = e.target.closest("#all-q, #mgr-q, #hf-q, #lp-q, #lf-q, #pp-q"); if (!inp) return;
    if (host.classList.contains("pf-detailing")) exitDetail();   // typing a search returns to the list
    filterList(inp.closest(".tpane"));
  });

  router();                                             // land on the list (or a deep-linked profile)
  // On re-entry at a different route, re-run the router (the runtime only calls
  // enter() when the URL differs from the one Profiles was left on). Leaving keeps
  // the open profile/list exactly as it was, so switching tabs and coming back — or
  // Back from another section — returns to the same place.
  return {
    enter: () => router(),
    leave() { rememberList(); },
    // home(): a nav-bar tap resets Profiles to its first part — the Managers list
    // (closing any open profile, first category tab, scrolled to top).
    // Every list's filters, focus, Following and sort reset too.
    home() {
      Object.keys(_listY).forEach((k) => delete _listY[k]);
      CHIPS.forEach(([k]) => { delete _paneHash[k]; applyListState(k, "tab=" + k); });
      showList("all");
    },
  };
}
