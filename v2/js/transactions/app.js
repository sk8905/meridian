// =============================================================================
// v2/js/transactions/app.js — the Transactions tab: the covered managers'
// deal flow organised by TRANSACTION TYPE (GP-led secondaries, NAV financing,
// CLO issuance, …). An overview league table of the types (count · momentum ·
// ≈USD volume · median · managers · most-active) drills into a per-type stat
// header + a dated list of the transactions, each linking to its source and its
// manager's profile. Enrichment (type + amount) is the shared credit/js/tx.js
// layer. Built from the same terminal furniture as Profiles (.tdash / .tchips /
// .tleague) so the two tabs read as one app. mount(host, ctx) → {enter,leave}.
// =============================================================================
import { deals, managers } from "/credit/js/data.js";
import { EUR_CREDITS, EUR_CREDITS_META, creditsBySector } from "/credit/js/eu-credits.js";
import { TX_TYPES, SECTORS, SECTOR_LABEL, txOf, sectorOf, amountOf, toUsd, fmtAmt, fmtUsd } from "/credit/js/tx.js?v=20260907-1";
import { esc } from "/util.js?v=20260818-1";
import { fmtDay } from "/feed.js?v=20260808-1";
import { dealSubject } from "../deal-parse.js?v=v2-3";
import { creditSource } from "/credit/js/shared.js?v=20260730-2";

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

export function mount(host, ctx) {
  // Enrich every dated deal once: { d, tx, amt, usd, ts }.
  const now = Date.now();
  const rows = deals
    .filter((d) => d && d.date)
    .map((d) => { const amt = amountOf(d); return { d, tx: txOf(d), sec: sectorOf(d), amt, usd: toUsd(amt), ts: Date.parse((d.date || "").slice(0, 10)) || 0 }; })
    .filter((r) => r.ts > 0);

  // No period toggle — the tab shows ALL transaction history (the overview's "12mo
  // vs prior" column still carries the recency trend).
  const st = { period: "all", focus: false, q: "" };   // q set → search; else the type overview (types expand inline)
  const inPeriod = () => true;
  // The $1–15bn AUM focus is an entity filter (orthogonal to the period): a deal
  // qualifies when its manager sits in the target band. Off → everything.
  const inFocus = (r) => !st.focus || mInFocus(_mById.get(r.d.managerId));

  // ---- per-type stats over the active period -------------------------------
  const median = (arr) => { if (!arr.length) return null; const a = [...arr].sort((x, y) => x - y); const m = a.length >> 1; return a.length % 2 ? a[m] : Math.round((a[m - 1] + a[m]) / 2); };
  function statsFor(key) {
    const all = rows.filter((r) => r.tx === key && inFocus(r));
    const inP = all.filter(inPeriod);
    const withAmt = inP.filter((r) => r.usd != null);
    const last12 = all.filter((r) => r.ts >= now - 365 * DAY).length;
    const prev12 = all.filter((r) => r.ts < now - 365 * DAY && r.ts >= now - 730 * DAY).length;
    const byMgr = {}; inP.forEach((r) => { const id = r.d.managerId; if (id) byMgr[id] = (byMgr[id] || 0) + 1; });
    const top = Object.entries(byMgr).sort((a, b) => b[1] - a[1])[0];
    return {
      key, n: inP.length, list: inP,
      usd: withAmt.reduce((s, r) => s + r.usd, 0),
      med: median(withAmt.map((r) => r.usd)),
      managers: Object.keys(byMgr).length,
      disclosed: inP.length ? Math.round((withAmt.length / inP.length) * 100) : 0,
      last12, prev12, top: top ? { id: top[0], n: top[1] } : null,
    };
  }

  // ---- shell (Profiles furniture) ------------------------------------------
  // Group-by control icon — the same rows glyph the news/manager wires use.
  const grpSvg = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>`;
  host.innerHTML = `
    <div class="tdash tx-dash">
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full">
          <header class="tpanel-h twire-head">
            <div class="tchips" id="tx-mode">
              <button type="button" class="tchip is-on" data-mode="flow">Deal flow</button>
              <button type="button" class="tchip" data-mode="credits">Credits</button>
            </div>
          </header>
          <div class="tcol-main">
            <header class="tpanel-h thead-search" id="tx-flow-search">
              <input type="search" id="tx-q" class="tsearch" placeholder="Search a deal, manager or type…" aria-label="Search transactions">
              <button type="button" class="tfocus-btn tfocus-aum" id="tx-focus" aria-pressed="false" title="AUM focus — show only $1–15bn AUM managers">$1–15bn</button>
            </header>
            <header class="tpanel-h thead-search" id="tx-credits-search">
              <input type="search" id="tx-cr-q" class="tsearch" placeholder="Search a credit or sector…" aria-label="Search credits">
              <div class="tcr-grpctl" id="tx-cr-ctl" role="group" aria-label="Group the credit roster">
                <button type="button" class="tcr-grpbtn" data-crgroup="sector" aria-pressed="false">${grpSvg}<span>Group by sector</span></button>
                <button type="button" class="tcr-grpbtn" data-crgroup="rating" aria-pressed="false">${grpSvg}<span>Group by rating</span></button>
              </div>
            </header>
            <div class="tx-scroll" id="tx-body"></div>
            <div class="tx-scroll" id="tx-credits-body"></div>
          </div>
        </section>
      </div>
    </div>`;
  const body = host.querySelector("#tx-body");
  const creditsBody = host.querySelector("#tx-credits-body");
  let _crMode = "flow", _crQ = "", _crGroup = null;   // null = neutral default (sector order, no button lit)
  // S&P scale, best → worst — used to order the roster when grouping by rating.
  const RATING_ORDER = ["AAA", "AA+", "AA", "AA-", "A+", "A", "A-", "BBB+", "BBB", "BBB-", "BB+", "BB", "BB-", "B+", "B", "B-", "CCC+", "CCC", "CCC-", "CC", "C", "SD", "D"];
  const ratingRank = (r) => { const i = RATING_ORDER.indexOf(r); return i === -1 ? 999 : i; };

  const trendMark = (a, b) => a > b ? `<span class="tx-up">▲</span>` : a < b ? `<span class="tx-dn">▼</span>` : `<span class="tx-fl">·</span>`;

  // ---- overview: a league table of the transaction types -------------------
  function renderOverview() {
    const S = TX_TYPES.map((t) => statsFor(t.key)).filter((s) => s.n > 0);
    S.sort((a, b) => b.usd - a.usd || b.n - a.n);
    const totalN = S.reduce((s, x) => s + x.n, 0), totalUsd = S.reduce((s, x) => s + x.usd, 0);
    const row = (s) => {
      const t = TX_TYPES.find((x) => x.key === s.key);
      return `<tr class="clickable" data-type="${esc(s.key)}" aria-expanded="false">`
        + `<td class="tl-nm tx-tnm"><span class="tx-tcaret" aria-hidden="true">▸</span>${esc(t.label)}</td>`
        + `<td class="tl-n">${s.n}</td>`
        + `<td class="tl-n tx-trend">${s.last12}<span class="tx-vs">/${s.prev12}</span> ${trendMark(s.last12, s.prev12)}</td>`
        + `<td class="tl-n">${fmtUsd(s.usd)}</td>`
        + `<td class="tl-n">${s.med != null ? fmtUsd(s.med) : "—"}</td>`
        + `<td class="tl-n">${s.managers}</td>`
        + `<td class="tl-nm tx-top">${s.top ? esc(mgrName(s.top.id)) : "—"}</td></tr>`
        // Inline, indented sub-list of this type's deals — rendered lazily on first
        // open (see the click handler), so the overview never pays to build every
        // type's list up front.
        + `<tr class="tx-typeexp" data-for="${esc(s.key)}" data-sec="all" hidden><td colspan="7"><div class="tx-typeexp-in"></div></td></tr>`;
    };
    body.innerHTML = `
      <div class="tleague-wrap"><table class="tleague tleague-full tx-tbl">
        <thead><tr><th>Transaction type</th><th>Deals</th><th>12mo vs prior</th><th>Volume ≈$</th><th>Median ≈$</th><th>Managers</th><th class="tx-top-h">Most active</th></tr></thead>
        <tbody>${S.map(row).join("")}</tbody>
        <tfoot><tr class="tx-tot"><td class="tl-nm">All types</td><td class="tl-n">${totalN}</td><td></td><td class="tl-n">${fmtUsd(totalUsd)}</td><td></td><td></td><td></td></tr></tfoot>
      </table></div>`;
  }

  // ---- deal rows (shared by the inline type sub-list and the search list) ---
  const mgrLink = (id) => id ? `<a href="${esc(ctx.base)}/profiles/#/manager/${esc(id)}" class="tx-mgr" data-id="${esc(id)}">${esc(mgrName(id))}</a>` : "—";
  // A transaction row + a hidden detail row (borrower/advisers live in the sourced
  // summary prose; the structured fields — type, lender, amount, date, sub-category
  // — are laid out beside it). Shared by the type-detail list and the search list.
  const txRow = (r) => {
    const d = r.d, u = d.sourceUrl, t = TX_TYPES.find((x) => x.key === r.tx);
    // Borrower / portfolio company (derived from the sourced headline — shared with
    // the manager Investments table). The cell shows JUST the name; the full,
    // verbatim headline is the hover title, and the source link lives in its own
    // Source column at the right.
    const subj = dealSubject(d);
    const name = subj || d.headline || "—";
    const cat = esc(SECTOR_LABEL[r.sec] || (t && t.label) || "—");
    const outlet = creditSource(d) || "";
    const srcCell = u ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(outlet || "source")}</a>` : "—";
    // The expanded detail is the sourced narrative at full width — the structured
    // fields (type / lender / amount / date / sub-category) already sit in the row's
    // own columns, so no snapshot box is repeated here.
    const detail = `${d.summary ? `<p class="tx-sum">${esc(d.summary)}</p>` : ""}`
      + (u ? `<a class="tx-src" href="${esc(u)}" target="_blank" rel="noopener noreferrer">Full source ›</a>` : "");
    return `<tr class="tx-row" data-id="${esc(d.id)}"><td class="tx-bd" title="${esc(d.headline || "")}"><span class="tx-caret" aria-hidden="true">▸</span>${esc(name)}</td>`
      + `<td class="tx-dt">${esc(fmtDay(d.date))}</td>`
      + `<td class="tx-mg">${mgrLink(d.managerId)}</td>`
      + `<td class="tx-cat">${cat}</td>`
      + `<td class="tl-n tx-sz"${r.amt ? ` title="≈ ${fmtUsd(r.usd)}"` : ""}>${r.amt ? esc(fmtAmt(r.amt)) : "—"}</td>`
      + `<td class="tx-src2">${srcCell}</td></tr>`
      + `<tr class="tx-exp" data-for="${esc(d.id)}" hidden><td colspan="6"><div class="tx-exp-in">${detail}</div></td></tr>`;
  };
  // The inline sub-list shown when a transaction type is expanded in place: the
  // sub-category filter (when the type spans more than one) over the type's deals,
  // newest first. The headline stats (deals / volume / median / managers / most
  // active) already sit on the overview row itself, so they are not repeated here —
  // this is purely the indented drill-down of the individual deals. `sector`
  // filters within the type; each open type keeps its own filter on its data-sec.
  function typeSublist(key, sector) {
    const t = TX_TYPES.find((x) => x.key === key), s = statsFor(key);
    const sec = sector || "all";
    // Asset-class SUB-CATEGORIES present within this type (+ their counts).
    const secCount = {}; s.list.forEach((r) => { secCount[r.sec] = (secCount[r.sec] || 0) + 1; });
    const present = SECTORS.filter((x) => secCount[x.key]);
    const list = s.list.filter((r) => sec === "all" || r.sec === sec).sort((a, b) => b.ts - a.ts);
    const secChip = (k, label, n, on) => `<button type="button" class="tx-secchip${on ? " is-on" : ""}" data-sec="${esc(k)}">${esc(label)}<span class="tx-secn">${n}</span></button>`;
    const chips = present.length > 1
      ? `<div class="tx-secfilter" aria-label="Filter by sub-category">${secChip("all", "All", s.list.length, sec === "all")}${present.map((x) => secChip(x.key, x.label, secCount[x.key], sec === x.key)).join("")}</div>`
      : "";
    return chips + (list.length
      ? `<div class="tleague-wrap"><table class="tleague tleague-full tx-list">
        <thead><tr><th class="tx-bd-h">Borrower / company</th><th class="tx-dt-h">Date</th><th class="tx-mg-h">Lender / investor</th><th class="tx-cat-h">Type</th><th>Amount</th><th class="tx-src-h">Source</th></tr></thead>
        <tbody>${list.map(txRow).join("")}</tbody></table></div>`
      : `<p class="tw-empty muted small">No ${esc(t.label.toLowerCase())}${sec !== "all" ? " · " + esc(SECTOR_LABEL[sec]) : ""} transactions on record yet.</p>`);
  }

  // ---- search: a flat, dated list of matching deals across ALL types --------
  // Honours the active period + AUM focus; matches the deal headline, its
  // manager, the sourced summary, or the transaction-type label.
  function renderSearch() {
    const q = st.q.toLowerCase();
    const hit = (r) => {
      const d = r.d, t = TX_TYPES.find((x) => x.key === r.tx);
      return (d.headline || "").toLowerCase().includes(q)
        || mgrName(d.managerId).toLowerCase().includes(q)
        || (d.summary || "").toLowerCase().includes(q)
        || !!(t && t.label.toLowerCase().includes(q));
    };
    const list = rows.filter((r) => inPeriod(r) && inFocus(r) && hit(r)).sort((a, b) => b.ts - a.ts);
    const CAP = 200, shown = list.slice(0, CAP);
    body.innerHTML = `
      <div class="tx-head">
        <h2 class="tx-title">Search</h2>
        <p class="tx-blurb"><span class="muted">${list.length} transaction${list.length === 1 ? "" : "s"} match “${esc(st.q)}”${st.focus ? " · $1–15bn AUM" : ""}${list.length > CAP ? ` — showing the first ${CAP}` : ""}. Tap a row for the full detail.</span></p>
      </div>
      ${shown.length ? `<div class="tleague-wrap"><table class="tleague tleague-full tx-list">
        <thead><tr><th class="tx-bd-h">Borrower / company</th><th class="tx-dt-h">Date</th><th class="tx-mg-h">Lender / investor</th><th class="tx-cat-h">Type</th><th>Amount</th><th class="tx-src-h">Source</th></tr></thead>
        <tbody>${shown.map(txRow).join("")}</tbody></table></div>`
        : `<p class="tw-empty muted small">No transactions match “${esc(st.q)}”.</p>`}`;
  }

  // ---- Credits: the European credit universe (ELLI), organised by sector, each
  // with its current issuer rating, borrower domicile and 12-month rating trend.
  // Real, sourced rows only — empty until the first verified batch lands (compiled
  // by the daily routine; see eu-credits.js).
  // Rating momentum over the trailing 12 months: ▲ up, ▼ down, – unchanged.
  const TREND = {
    up: { g: "▲", c: "tx-up", t: "Rating up over the past 12 months" },
    down: { g: "▼", c: "tx-dn", t: "Rating down over the past 12 months" },
    flat: { g: "–", c: "tx-fl", t: "Rating unchanged over the past 12 months" },
  };
  const crRow = (c) => {
    const rt = c.rating
      ? (c.source
        ? `<a class="tcr-rt" href="${esc(c.source)}" target="_blank" rel="noopener noreferrer" title="${esc(c.agency || EUR_CREDITS_META.agency)}${c.asOf ? " · as of " + esc(c.asOf) : ""}">${esc(c.rating)}</a>`
        : `<span class="tcr-rt" title="${esc(c.agency || EUR_CREDITS_META.agency)}${c.asOf ? " · as of " + esc(c.asOf) : ""}">${esc(c.rating)}</span>`)
      : `<span class="tcr-rt tcr-nr" title="Rating pending verification">NR</span>`;
    const tr = TREND[c.trend] || TREND.flat;
    const trend = `<span class="tcr-tr ${tr.c}" title="${tr.t} (${esc(c.agency || EUR_CREDITS_META.agency)})">${tr.g}</span>`;
    return `<tr class="tcr-row">`
      + `<td class="tcr-nm" title="${esc(c.name)}">${esc(c.name)}</td>`
      + `<td class="tcr-jur">${esc(c.jurisdiction || "")}</td>`
      + `<td class="tcr-sec">${esc(c.sector)}</td>`
      + `<td class="tcr-rt-cell"><span class="tcr-rr">${trend}${rt}</span></td>`
      + `</tr>`;
  };
  function renderCredits() {
    if (!EUR_CREDITS.length) {
      creditsBody.innerHTML = `<p class="tw-empty muted small">The European credit universe (anchored to the ${esc(EUR_CREDITS_META.index)}) is being compiled — sourced names and ratings land here as they’re verified.</p>`;
      return;
    }
    const q = _crQ.toLowerCase();
    const filtered = q ? EUR_CREDITS.filter((c) => `${c.name} ${c.sector} ${c.rating || ""} ${c.jurisdiction || ""}`.toLowerCase().includes(q)) : EUR_CREDITS;
    // One flat table — Borrower · Jurisdiction · Sector · Rating — ordered by the
    // active grouping: by sector (canonical order, name-sorted within each) or by
    // rating (best → worst, name-sorted within each) so like values read in blocks.
    const rows = _crGroup === "rating"
      ? filtered.slice().sort((a, b) => ratingRank(a.rating) - ratingRank(b.rating) || a.name.localeCompare(b.name))
      : creditsBySector(filtered).flatMap(([, arr]) => arr);
    creditsBody.innerHTML = rows.length
      ? `<div class="tleague-wrap tcr-wrap"><table class="tcr-tbl">`
        + `<colgroup><col class="c-nm"><col class="c-jur"><col class="c-sec"><col class="c-rt"></colgroup>`
        + `<thead><tr><th>Borrower</th><th>Jurisdiction</th><th>Sector</th><th>Rating</th></tr></thead>`
        + `<tbody>${rows.map(crRow).join("")}</tbody></table></div>`
      : `<p class="tw-empty muted small">No credits match “${esc(_crQ)}”.</p>`;
  }

  function render() { st.q ? renderSearch() : renderOverview(); }

  // ---- events (delegated) --------------------------------------------------
  // Primary mode: Deal flow (the transaction-type table) vs Credits (the ELLI
  // issuer universe). Toggling swaps which chrome + body is shown. Drive it with
  // inline display (not [hidden]) — the headers carry a CSS `display` that beats
  // the UA [hidden] rule, so the attribute alone wouldn't hide them.
  const setMode = (mode) => {
    _crMode = mode === "credits" ? "credits" : "flow";
    const credits = _crMode === "credits";
    host.querySelectorAll("#tx-mode .tchip").forEach((c) => c.classList.toggle("is-on", c.dataset.mode === _crMode));
    ["tx-flow-search", "tx-body"].forEach((id) => { const el = host.querySelector("#" + id); if (el) el.style.display = credits ? "none" : ""; });
    ["tx-credits-search", "tx-credits-body"].forEach((id) => { const el = host.querySelector("#" + id); if (el) el.style.display = credits ? "" : "none"; });
    if (credits) renderCredits();
  };
  setMode("flow");   // initial (drives the display, replacing the [hidden] attrs)
  host.querySelector("#tx-mode").addEventListener("click", (e) => {
    const b = e.target.closest(".tchip"); if (!b) return;
    setMode(b.dataset.mode);
  });
  host.querySelector("#tx-cr-q").addEventListener("input", (e) => { _crQ = e.target.value.trim(); renderCredits(); });
  // Group-by toggle (sector | rating): a mutually-exclusive pair, styled like the
  // news/manager-wire group button. Re-orders the roster in place.
  host.querySelector("#tx-cr-ctl").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-crgroup]"); if (!btn) return;
    const mode = btn.dataset.crgroup === "rating" ? "rating" : "sector";
    _crGroup = (_crGroup === mode) ? null : mode;   // clicking the active button turns it off
    host.querySelectorAll("#tx-cr-ctl .tcr-grpbtn").forEach((b) => { const on = b.dataset.crgroup === _crGroup; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", String(on)); });
    renderCredits();
  });
  // Search box — typing switches the body to a flat list of matching deals; the
  // input lives in the shell (outside #tx-body) so it keeps focus across renders.
  host.querySelector("#tx-q").addEventListener("input", (e) => {
    st.q = e.target.value.trim();
    render();
  });
  // $1–15bn AUM focus toggle — narrows every view (overview + type detail) to the
  // target-band managers' deal flow, then re-renders in place.
  host.querySelector("#tx-focus").addEventListener("click", (e) => {
    const b = e.currentTarget;
    st.focus = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", st.focus ? "true" : "false");
    b.classList.toggle("is-on", st.focus);
    render();
  });
  host.addEventListener("click", (e) => {
    const mgr = e.target.closest(".tx-mgr");
    if (mgr) { e.preventDefault(); ctx.navigate(`${ctx.base}/profiles/#/manager/${mgr.dataset.id}`); return; }
    // Sub-category filter INSIDE an open type — rebuild just that type's sub-list,
    // keeping every other row (and any other open type) exactly where it is.
    const sec = e.target.closest(".tx-secchip");
    if (sec) {
      const exp = sec.closest(".tx-typeexp");
      if (exp) { exp.dataset.sec = sec.dataset.sec; exp.querySelector(".tx-typeexp-in").innerHTML = typeSublist(exp.dataset.for, exp.dataset.sec); }
      return;
    }
    // Expand/collapse an individual transaction to reveal borrower/advisers/detail.
    const row = e.target.closest("tr.tx-row");
    if (row && !e.target.closest("a")) {
      const exp = row.nextElementSibling;
      if (exp && exp.classList.contains("tx-exp")) { const open = exp.hasAttribute("hidden"); exp.hidden = !open; row.classList.toggle("is-open", open); }
      return;
    }
    // Click a transaction TYPE → open its deals as an indented sub-list in place
    // (a single-open accordion), instead of navigating away to a detail page.
    const trow = e.target.closest("tr.clickable[data-type]");
    if (trow) {
      const exp = trow.nextElementSibling;
      if (!exp || !exp.classList.contains("tx-typeexp")) return;
      const opening = exp.hasAttribute("hidden");
      // Collapse any other open type first (keeps the page compact).
      body.querySelectorAll("tr.tx-typeexp:not([hidden])").forEach((o) => {
        if (o === exp) return;
        o.hidden = true;
        const otr = o.previousElementSibling;
        if (otr) { otr.classList.remove("is-open"); otr.setAttribute("aria-expanded", "false"); }
      });
      if (opening) {
        const inner = exp.querySelector(".tx-typeexp-in");
        if (!inner.dataset.built) { inner.innerHTML = typeSublist(exp.dataset.for, exp.dataset.sec || "all"); inner.dataset.built = "1"; }
      }
      exp.hidden = !opening;
      trow.classList.toggle("is-open", opening);
      trow.setAttribute("aria-expanded", String(opening));
    }
  });

  render();
  return { enter() { render(); }, leave() {} };
}
