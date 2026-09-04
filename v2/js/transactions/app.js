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
import { TX_TYPES, txOf, amountOf, toUsd, fmtAmt, fmtUsd } from "/credit/js/tx.js?v=20260904-1";
import { esc } from "/util.js?v=20260818-1";
import { fmtDay } from "/feed.js?v=20260808-1";

const _mById = new Map(managers.map((m) => [m.id, m]));
const mgrName = (id) => (_mById.get(id) || {}).name || "";
const DAY = 864e5;

export function mount(host, ctx) {
  // Enrich every dated deal once: { d, tx, amt, usd, ts }.
  const now = Date.now();
  const rows = deals
    .filter((d) => d && d.date)
    .map((d) => { const amt = amountOf(d); return { d, tx: txOf(d), amt, usd: toUsd(amt), ts: Date.parse((d.date || "").slice(0, 10)) || 0 }; })
    .filter((r) => r.ts > 0);

  const st = { period: "12m", type: null };   // type=null → overview
  const inPeriod = (r) => st.period === "all" || r.ts >= now - 365 * DAY;

  // ---- per-type stats over the active period -------------------------------
  const median = (arr) => { if (!arr.length) return null; const a = [...arr].sort((x, y) => x - y); const m = a.length >> 1; return a.length % 2 ? a[m] : Math.round((a[m - 1] + a[m]) / 2); };
  function statsFor(key) {
    const all = rows.filter((r) => r.tx === key);
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
            <div class="tchips" id="tx-period">
              <button type="button" class="tchip is-on" data-per="12m">Last 12 months</button>
              <button type="button" class="tchip" data-per="all">All time</button>
            </div>
          </header>
          <div class="tx-scroll" id="tx-body"></div>
        </section>
      </div>
    </div>`;
  const body = host.querySelector("#tx-body");

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
      <p class="tx-intro">Tracked transactions across the covered managers, by type${st.period === "12m" ? " — last 12 months" : ", all time"}. Volumes are the sum of disclosed deal sizes, normalised to <span title="Indicative FX snapshot for aggregation only; each deal shows its native figure">≈USD</span>.</p>
      <div class="tleague-wrap"><table class="tleague tleague-full tx-tbl">
        <thead><tr><th>Transaction type</th><th>Deals</th><th>12mo vs prior</th><th>Volume ≈$</th><th>Median ≈$</th><th>Managers</th><th class="tx-top-h">Most active</th></tr></thead>
        <tbody>${S.map(row).join("")}</tbody>
        <tfoot><tr class="tx-tot"><td class="tl-nm">All types</td><td class="tl-n">${totalN}</td><td></td><td class="tl-n">${fmtUsd(totalUsd)}</td><td></td><td></td><td></td></tr></tfoot>
      </table></div>`;
  }

  // ---- type detail: stat tiles + the transaction list ----------------------
  const kpi = (label, val, sub) => `<div class="tx-kpi"><span class="tx-kpi-v">${val}</span><span class="tx-kpi-l">${esc(label)}</span>${sub ? `<span class="tx-kpi-s">${sub}</span>` : ""}</div>`;
  function renderType(key) {
    st.type = key;
    const t = TX_TYPES.find((x) => x.key === key), s = statsFor(key);
    const list = [...s.list].sort((a, b) => b.ts - a.ts);
    const txRow = (r) => {
      const u = r.d.sourceUrl, id = r.d.managerId;
      const head = u ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(r.d.headline || "")}</a>` : esc(r.d.headline || "");
      const mgr = id ? `<a href="${esc(ctx.base)}/profiles/#/manager/${esc(id)}" class="tx-mgr" data-id="${esc(id)}">${esc(mgrName(id))}</a>` : "—";
      return `<tr><td class="tx-dt">${esc(fmtDay(r.d.date))}</td><td class="tx-hd">${head}</td>`
        + `<td class="tx-mg">${mgr}</td><td class="tl-n tx-sz"${r.amt ? ` title="≈ ${fmtUsd(r.usd)}"` : ""}>${r.amt ? esc(fmtAmt(r.amt)) : "—"}</td></tr>`;
    };
    body.innerHTML = `
      <div class="tx-back-bar"><button type="button" class="tx-back" id="tx-back">‹ All transaction types</button></div>
      <div class="tx-head">
        <h2 class="tx-title">${esc(t.label)}</h2>
        <p class="tx-blurb">${esc(t.blurb)}</p>
        <div class="tx-kpis">
          ${kpi("Deals", String(s.n), st.period === "12m" ? "last 12mo" : "all time")}
          ${kpi("Volume ≈$", fmtUsd(s.usd), `${s.disclosed}% size disclosed`)}
          ${kpi("Median ≈$", s.med != null ? fmtUsd(s.med) : "—", "per deal")}
          ${kpi("Managers", String(s.managers), "active")}
          ${kpi("12mo", `${s.last12} ${s.last12 > s.prev12 ? "▲" : s.last12 < s.prev12 ? "▼" : "·"}`, `vs ${s.prev12} prior 12mo`)}
          ${kpi("Most active", s.top ? esc(mgrName(s.top.id)) : "—", s.top ? `${s.top.n} deals` : "")}
        </div>
      </div>
      ${list.length ? `<div class="tleague-wrap"><table class="tleague tleague-full tx-list">
        <thead><tr><th class="tx-dt-h">Date</th><th class="tx-hd-h">Transaction</th><th class="tx-mg-h">Manager</th><th>Size</th></tr></thead>
        <tbody>${list.map(txRow).join("")}</tbody></table></div>`
        : `<p class="tw-empty muted small">No ${esc(t.label.toLowerCase())} transactions ${st.period === "12m" ? "in the last 12 months" : "on record"} yet.</p>`}`;
  }

  function render() { st.type ? renderType(st.type) : renderOverview(); }

  // ---- events (delegated) --------------------------------------------------
  host.querySelector("#tx-period").addEventListener("click", (e) => {
    const b = e.target.closest(".tchip"); if (!b) return;
    st.period = b.dataset.per;
    host.querySelectorAll("#tx-period .tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    render();
  });
  host.addEventListener("click", (e) => {
    const back = e.target.closest("#tx-back");
    if (back) { renderOverview(); return; }
    const mgr = e.target.closest(".tx-mgr");
    if (mgr) { e.preventDefault(); ctx.navigate(`${ctx.base}/profiles/#/manager/${mgr.dataset.id}`); return; }
    const trow = e.target.closest("tr.clickable[data-type]");
    if (trow) { body.scrollTop = 0; renderType(trow.dataset.type); return; }
  });

  render();
  return { enter() { render(); }, leave() {} };
}
