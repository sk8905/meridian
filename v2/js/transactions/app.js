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
  const st = { period: "all", type: null, sector: "all", focus: false, q: "" };   // type=null → overview; q set → search
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
  host.innerHTML = `
    <div class="tdash tx-dash">
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full">
          <header class="tpanel-h twire-head">
            <div class="tchips" id="tx-mode">
              <button type="button" class="tchip is-on" data-mode="flow">Deal flow</button>
              <button type="button" class="tchip" data-mode="credits">Credits${EUR_CREDITS.length ? " " + EUR_CREDITS.length : ""}</button>
            </div>
          </header>
          <div class="tcol-main">
            <header class="tpanel-h thead-search" id="tx-flow-search">
              <input type="search" id="tx-q" class="tsearch" placeholder="Search a deal, manager or type…" aria-label="Search transactions">
              <button type="button" class="tfocus-btn tfocus-aum" id="tx-focus" aria-pressed="false" title="AUM focus — show only $1–15bn AUM managers">$1–15bn</button>
            </header>
            <header class="tpanel-h thead-search" id="tx-credits-search">
              <input type="search" id="tx-cr-q" class="tsearch" placeholder="Search a credit or sector…" aria-label="Search credits">
            </header>
            <div class="tx-scroll" id="tx-body"></div>
            <div class="tx-scroll" id="tx-credits-body"></div>
          </div>
        </section>
      </div>
    </div>`;
  const body = host.querySelector("#tx-body");
  const creditsBody = host.querySelector("#tx-credits-body");
  let _crMode = "flow", _crQ = "";

  const trendMark = (a, b) => a > b ? `<span class="tx-up">▲</span>` : a < b ? `<span class="tx-dn">▼</span>` : `<span class="tx-fl">·</span>`;

  // ---- overview: a league table of the transaction types -------------------
  function renderOverview() {
    st.type = null;
    const S = TX_TYPES.map((t) => statsFor(t.key)).filter((s) => s.n > 0);
    S.sort((a, b) => b.usd - a.usd || b.n - a.n);
    const totalN = S.reduce((s, x) => s + x.n, 0), totalUsd = S.reduce((s, x) => s + x.usd, 0);
    const row = (s) => {
      const t = TX_TYPES.find((x) => x.key === s.key);
      return `<tr class="clickable" data-type="${esc(s.key)}">`
        + `<td class="tl-nm tx-tnm">${esc(t.label)}</td>`
        + `<td class="tl-n">${s.n}</td>`
        + `<td class="tl-n tx-trend">${s.last12}<span class="tx-vs">/${s.prev12}</span> ${trendMark(s.last12, s.prev12)}</td>`
        + `<td class="tl-n">${fmtUsd(s.usd)}</td>`
        + `<td class="tl-n">${s.med != null ? fmtUsd(s.med) : "—"}</td>`
        + `<td class="tl-n">${s.managers}</td>`
        + `<td class="tl-nm tx-top">${s.top ? esc(mgrName(s.top.id)) : "—"}</td></tr>`;
    };
    body.innerHTML = `
      <div class="tleague-wrap"><table class="tleague tleague-full tx-tbl">
        <thead><tr><th>Transaction type</th><th>Deals</th><th>12mo vs prior</th><th>Volume ≈$</th><th>Median ≈$</th><th>Managers</th><th class="tx-top-h">Most active</th></tr></thead>
        <tbody>${S.map(row).join("")}</tbody>
        <tfoot><tr class="tx-tot"><td class="tl-nm">All types</td><td class="tl-n">${totalN}</td><td></td><td class="tl-n">${fmtUsd(totalUsd)}</td><td></td><td></td><td></td></tr></tfoot>
      </table></div>`;
  }

  // ---- type detail: stat tiles + the transaction list ----------------------
  const kpi = (label, val, sub) => `<div class="tx-kpi"><span class="tx-kpi-v">${val}</span><span class="tx-kpi-l">${esc(label)}</span>${sub ? `<span class="tx-kpi-s">${sub}</span>` : ""}</div>`;
  const mgrLink = (id) => id ? `<a href="${esc(ctx.base)}/profiles/#/manager/${esc(id)}" class="tx-mgr" data-id="${esc(id)}">${esc(mgrName(id))}</a>` : "—";
  // A transaction row + a hidden detail row (borrower/advisers live in the sourced
  // summary prose; the structured fields — type, lender, amount, date, sub-category
  // — are laid out beside it). Shared by the type-detail list and the search list.
  const txRow = (r) => {
    const d = r.d, u = d.sourceUrl, t = TX_TYPES.find((x) => x.key === r.tx);
    const head = u ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(d.headline || "")}</a>` : esc(d.headline || "");
    const amtCell = r.amt ? `${esc(fmtAmt(r.amt))}${r.usd != null && r.amt.ccy !== "USD" ? ` <span class="tx-usd">≈${fmtUsd(r.usd)}</span>` : ""}` : "Not disclosed";
    const fields = [["Type", esc((t && t.label) || "—")], ["Lender / investor", mgrLink(d.managerId)], ["Amount", amtCell], ["Date", esc(fmtDay(d.date))], ["Sub-category", esc(SECTOR_LABEL[r.sec] || "—")]];
    const detail = `${d.summary ? `<p class="tx-sum">${esc(d.summary)}</p>` : ""}`
      + `<dl class="tx-fields">${fields.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join("")}</dl>`
      + (u ? `<a class="tx-src" href="${esc(u)}" target="_blank" rel="noopener noreferrer">Full source ›</a>` : "");
    return `<tr class="tx-row" data-id="${esc(d.id)}"><td class="tx-dt"><span class="tx-caret" aria-hidden="true">▸</span>${esc(fmtDay(d.date))}</td>`
      + `<td class="tx-hd">${head}</td><td class="tx-mg">${mgrLink(d.managerId)}</td>`
      + `<td class="tl-n tx-sz"${r.amt ? ` title="≈ ${fmtUsd(r.usd)}"` : ""}>${r.amt ? esc(fmtAmt(r.amt)) : "—"}</td></tr>`
      + `<tr class="tx-exp" data-for="${esc(d.id)}" hidden><td colspan="4"><div class="tx-exp-in">${detail}</div></td></tr>`;
  };
  function renderType(key) {
    st.type = key;
    const t = TX_TYPES.find((x) => x.key === key), s = statsFor(key);
    // Asset-class SUB-CATEGORIES present within this type (+ their counts).
    const secCount = {}; s.list.forEach((r) => { secCount[r.sec] = (secCount[r.sec] || 0) + 1; });
    const present = SECTORS.filter((x) => secCount[x.key]);
    const list = s.list.filter((r) => st.sector === "all" || r.sec === st.sector).sort((a, b) => b.ts - a.ts);
    const secChip = (k, label, n, on) => `<button type="button" class="tx-secchip${on ? " is-on" : ""}" data-sec="${esc(k)}">${esc(label)}<span class="tx-secn">${n}</span></button>`;
    const chips = present.length > 1
      ? `<div class="tx-secfilter" aria-label="Filter by sub-category">${secChip("all", "All", s.list.length, st.sector === "all")}${present.map((x) => secChip(x.key, x.label, secCount[x.key], st.sector === x.key)).join("")}</div>`
      : "";
    body.innerHTML = `
      <div class="tx-back-bar"><button type="button" class="tx-back" id="tx-back">‹ All transaction types</button></div>
      <div class="tx-head">
        <h2 class="tx-title">${esc(t.label)}</h2>
        <p class="tx-blurb">${esc(t.blurb)} <span class="muted">Tap a row for the borrower, advisers &amp; full detail.</span></p>
        <div class="tx-kpis">
          ${kpi("Deals", String(s.n), "all time")}
          ${kpi("Volume ≈$", fmtUsd(s.usd), `${s.disclosed}% size disclosed`)}
          ${kpi("Median ≈$", s.med != null ? fmtUsd(s.med) : "—", "per deal")}
          ${kpi("Managers", String(s.managers), "active")}
          ${kpi("12mo", `${s.last12} ${s.last12 > s.prev12 ? "▲" : s.last12 < s.prev12 ? "▼" : "·"}`, `vs ${s.prev12} prior 12mo`)}
          ${kpi("Most active", s.top ? esc(mgrName(s.top.id)) : "—", s.top ? `${s.top.n} deals` : "")}
        </div>
        ${chips}
      </div>
      ${list.length ? `<div class="tleague-wrap"><table class="tleague tleague-full tx-list">
        <thead><tr><th class="tx-dt-h">Date</th><th class="tx-hd-h">Transaction</th><th class="tx-mg-h">Lender / investor</th><th>Amount</th></tr></thead>
        <tbody>${list.map(txRow).join("")}</tbody></table></div>`
        : `<p class="tw-empty muted small">No ${esc(t.label.toLowerCase())}${st.sector !== "all" ? " · " + esc(SECTOR_LABEL[st.sector]) : ""} transactions on record yet.</p>`}`;
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
        <thead><tr><th class="tx-dt-h">Date</th><th class="tx-hd-h">Transaction</th><th class="tx-mg-h">Lender / investor</th><th>Amount</th></tr></thead>
        <tbody>${shown.map(txRow).join("")}</tbody></table></div>`
        : `<p class="tw-empty muted small">No transactions match “${esc(st.q)}”.</p>`}`;
  }

  // ---- Credits: the European credit universe (ELLI), organised by sector, each
  // with its current issuer rating. Real, sourced rows only — empty until the
  // first verified batch lands (compiled by the daily routine; see eu-credits.js).
  const crRow = (c) => {
    const rt = c.rating
      ? (c.source
        ? `<a class="tcr-rt" href="${esc(c.source)}" target="_blank" rel="noopener noreferrer" title="${esc(c.agency || EUR_CREDITS_META.agency)}${c.asOf ? " · as of " + esc(c.asOf) : ""}">${esc(c.rating)}</a>`
        : `<span class="tcr-rt" title="${esc(c.agency || EUR_CREDITS_META.agency)}${c.asOf ? " · as of " + esc(c.asOf) : ""}">${esc(c.rating)}</span>`)
      : `<span class="tcr-rt tcr-nr" title="Rating pending verification">NR</span>`;
    return `<li class="tmini-row tcr-row"><span class="tcr-nm">${esc(c.name)}</span>${rt}</li>`;
  };
  function renderCredits() {
    if (!EUR_CREDITS.length) {
      creditsBody.innerHTML = `<p class="tw-empty muted small">The European credit universe (anchored to the ${esc(EUR_CREDITS_META.index)}) is being compiled — sourced names and ratings land here as they’re verified.</p>`;
      return;
    }
    const q = _crQ.toLowerCase();
    const filtered = q ? EUR_CREDITS.filter((c) => `${c.name} ${c.sector} ${c.rating || ""}`.toLowerCase().includes(q)) : EUR_CREDITS;
    const groups = creditsBySector(filtered);
    creditsBody.innerHTML = groups.length
      ? `<div class="tcr-meta muted small">${filtered.length} of ${EUR_CREDITS.length} credits · issuer ratings ${esc(EUR_CREDITS_META.agency)}</div>`
        + groups.map(([sec, arr]) => `<div class="tcr-grp"><div class="tcr-grp-h">${esc(sec)} <span class="tcr-grp-n">${arr.length}</span></div><ul class="tmini tcr-list">${arr.map(crRow).join("")}</ul></div>`).join("")
      : `<p class="tw-empty muted small">No credits match “${esc(_crQ)}”.</p>`;
  }

  function render() { st.q ? renderSearch() : (st.type ? renderType(st.type) : renderOverview()); }

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
    const back = e.target.closest("#tx-back");
    if (back) { st.sector = "all"; renderOverview(); return; }
    const mgr = e.target.closest(".tx-mgr");
    if (mgr) { e.preventDefault(); ctx.navigate(`${ctx.base}/profiles/#/manager/${mgr.dataset.id}`); return; }
    const trow = e.target.closest("tr.clickable[data-type]");
    if (trow) { body.scrollTop = 0; st.sector = "all"; renderType(trow.dataset.type); return; }
    const sec = e.target.closest(".tx-secchip");
    if (sec) { st.sector = sec.dataset.sec; renderType(st.type); return; }
    // Expand/collapse a transaction to reveal borrower/advisers/full detail.
    const row = e.target.closest("tr.tx-row");
    if (row && !e.target.closest("a")) {
      const exp = row.nextElementSibling;
      if (exp && exp.classList.contains("tx-exp")) { const open = exp.hasAttribute("hidden"); exp.hidden = !open; row.classList.toggle("is-open", open); }
    }
  });

  render();
  return { enter() { render(); }, leave() {} };
}
