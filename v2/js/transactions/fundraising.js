// =============================================================================
// v2/js/transactions/fundraising.js — Transactions ▸ Fundraising (#/fundraising).
//
// Four sourced sections, all read from credit/js/data.js — nothing inferred:
//   • Funds in market   — the SAME builder as Dashboard ▸ Credit (v2/js/funds-market.js)
//   • Closes            — the first / final close events in the intel ledger (type
//                         "First Close" / "Final Close"), dated, each with its source
//   • LP commitments    — the commitments ledger: LP, manager, fund, amount, date, source
//   • LP ↔ manager      — commitments counted per (LP, manager) pair: a 15×15 matrix of
//                         the most active LPs × managers on desktop, a ranked list of
//                         pairs on phone
// Plus a link to the investor directory (Profiles ▸ Investors).
// Pure builders + HTML; app.js owns the state / URL / events.
// =============================================================================
import { funds, intel, commitments, managers, lps } from "/credit/js/data.js";
import { fmtBn } from "/credit/js/shared.js";
import { esc } from "/util.js";
import { fmtDay } from "/feed.js";
import { fundsInMarket, lpName } from "../funds-market.js";
import { norm } from "./league.js";

const _mById = new Map(managers.map((m) => [m.id, m]));
const _fById = new Map(funds.map((f) => [f.id, f]));
const _lpById = new Map(lps.map((l) => [l.id, l]));
const SYM = { EUR: "€", GBP: "£", USD: "$" };
const sym = (ccy) => SYM[ccy] || (ccy ? ccy + " " : "$");
// Millions in the fund's / commitment's own currency → the one money format (R2d).
const money = (m, ccy) => (m != null && isFinite(m) ? fmtBn(m / 1000, sym(ccy)) : "—");
const mgrNameOf = (id, fallback) => (_mById.get(id) || {}).name || fallback || "";

export const SECTIONS = [["fim", "Funds in market"], ["closes", "Closes"], ["lpc", "LP commitments"], ["matrix", "LP ↔ manager"]];

// ---- builders ------------------------------------------------------------------
export function closeEvents(kind = "") {
  return intel
    .filter((i) => i && i.date && (i.type === "First Close" || i.type === "Final Close"))
    .filter((i) => !kind || (kind === "first" ? i.type === "First Close" : i.type === "Final Close"))
    .slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
}
export function lpCommitments() {
  return commitments.filter((c) => c && c.lpId)
    .slice().sort((a, b) => (!a.date) - (!b.date) || String(b.date || "").localeCompare(String(a.date || "")));
}
const mgrKey = (c) => (c.managerId && _mById.has(c.managerId) ? c.managerId : c.manager ? "n:" + norm(c.manager) : "");
// Commitments per (LP, manager) pair. → { lps:[{id,name,n}], mgrs:[{key,id,name,n}], cell:Map("lp|mgr"→n), pairs:[…] }
export function lpManagerMatrix(top = 15) {
  const cell = new Map(), lpN = new Map(), mN = new Map(), mName = new Map();
  for (const c of commitments) {
    const mk = mgrKey(c);
    if (!c || !c.lpId || !mk || !_lpById.has(c.lpId)) continue;
    const k = c.lpId + "|" + mk;
    cell.set(k, (cell.get(k) || 0) + 1);
    lpN.set(c.lpId, (lpN.get(c.lpId) || 0) + 1);
    mN.set(mk, (mN.get(mk) || 0) + 1);
    if (!mName.has(mk)) mName.set(mk, mgrNameOf(c.managerId, c.manager));
  }
  const byN = (m, nameOf) => [...m.entries()].map(([k, n]) => ({ k, n, name: nameOf(k) })).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  const lpsR = byN(lpN, (id) => lpName(id)).slice(0, top).map((x) => ({ id: x.k, name: x.name, n: x.n }));
  const mgrsR = byN(mN, (k) => mName.get(k)).slice(0, top).map((x) => ({ key: x.k, id: x.k.startsWith("n:") ? "" : x.k, name: x.name, n: x.n }));
  const pairs = [...cell.entries()].map(([k, n]) => { const [lp, mk] = k.split("|"); return { lp, lpName: lpName(lp), mk, mId: mk.startsWith("n:") ? "" : mk, mName: mName.get(mk), n }; })
    .sort((a, b) => b.n - a.n || a.lpName.localeCompare(b.lpName));
  return { lps: lpsR, mgrs: mgrsR, cell, pairs };
}

// ---- HTML ----------------------------------------------------------------------
// Each list renders every row; app.js previews the first 10 + "See all N" (R40/R41j).
export function fundraisingHTML(fs, base, phone) {
  const P = `${base}/profiles/#`;
  const mgrA = (id, name) => (id ? `<a class="tx-fr-a" href="${esc(P)}/manager/${encodeURIComponent(id)}">${esc(name || mgrNameOf(id))}</a>` : esc(name || "—"));
  const lpA = (id) => `<a class="tx-fr-a" href="${esc(P)}/lp/${encodeURIComponent(id)}">${esc(lpName(id) || id)}</a>`;
  const src = (url) => (url ? `<a class="tx-fr-src" href="${esc(url)}" target="_blank" rel="noopener noreferrer">source</a>` : "—");
  const day = (d) => (d ? esc(fmtDay(String(d).slice(0, 10))) : "—");
  const sec = (id, title, meta, ctl, inner) => `<section class="tx-fr-sec" id="tx-fr-${id}" data-fr="${id}"><header class="tx-fr-h"><h3 class="tx-fr-t">${esc(title)}</h3>${meta ? `<span class="tx-fr-n">${meta}</span>` : ""}${ctl || ""}</header>${inner}</section>`;
  const chip = (attr, label, on) => `<button type="button" class="tx-fchip${on ? " is-on" : ""}" ${attr} aria-pressed="${on}">${esc(label)}</button>`;

  // Funds in market.
  const fim = fundsInMarket({ scope: fs.fim });
  const fimRow = ({ f, lps: L, stale }) => phone
    ? `<li class="tx-fr-i" data-pv><div class="tx-fr-ia"><span class="tx-fr-hl"><a class="tx-fr-a" href="${esc(P)}/manager/${encodeURIComponent(f.managerId)}/vehicles">${esc(f.name)}</a></span><span class="tx-fr-v" title="${f.raised != null ? "Raised" : "Target"}">${f.raised != null || f.targetSize != null ? `${f.raised != null ? "" : "target "}${money(f.raised != null ? f.raised : f.targetSize, f.ccy)}` : ""}</span></div>`
      + `<div class="tx-fr-ib"><span>${esc(mgrNameOf(f.managerId))}</span><span>${esc(f.status)}${stale ? " · stale" : ""}</span>${f.strategy ? `<span>${esc(f.strategy)}</span>` : ""}${f.asOf ? `<span>${day(f.asOf)}</span>` : ""}</div></li>`
    : `<tr data-pv><td class="tx-fr-nm"><a class="tx-fr-a" href="${esc(P)}/manager/${encodeURIComponent(f.managerId)}/vehicles">${esc(f.name)}</a></td><td>${mgrA(f.managerId)}</td><td>${esc(f.strategy || "—")}</td>`
      + `<td>${esc(f.status)}${stale ? ` <span class="tx-fr-stale" title="Status not refreshed in 12+ months — it may have closed since">stale</span>` : ""}</td>`
      + `<td class="tl-n">${money(f.targetSize, f.ccy)}</td><td class="tl-n">${money(f.raised, f.ccy)}</td>`
      + `<td class="tx-fr-lps">${L.length ? esc(L.slice(0, 3).join(", ")) + (L.length > 3 ? ` +${L.length - 3}` : "") : "—"}</td><td class="tx-fr-d">${day(f.asOf)}</td></tr>`;
  const fimBody = !fim.length ? `<p class="tw-empty muted small">No funds in market for this filter.</p>` : phone
    ? `<ul class="tx-fr-list">${fim.map(fimRow).join("")}</ul>`
    : `<div class="tleague-wrap"><table class="tleague tx-fr-tbl"><thead><tr><th>Fund</th><th>Manager</th><th>Strategy</th><th>Status</th><th class="tl-n">Target</th><th class="tl-n">Raised</th><th>Named LPs</th><th>As of</th></tr></thead><tbody>${fim.map(fimRow).join("")}</tbody></table></div>`;
  const fimCtl = `<span class="tx-fr-ctl">${chip(`data-fr-fim="eu"`, "Europe", fs.fim === "eu")}${chip(`data-fr-fim="all"`, "All regions", fs.fim === "all")}</span>`;

  // First / final close timeline.
  const ev = closeEvents(fs.close);
  const fundOf = (i) => (i.fundId && _fById.get(i.fundId)) || null;
  const evRow = (i) => {
    const f = fundOf(i), kind = i.type === "First Close" ? "First close" : "Final close";
    const what = f ? `<a class="tx-fr-a" href="${esc(P)}/manager/${encodeURIComponent(f.managerId)}/vehicles">${esc(f.name)}</a>` : esc(i.headline || "—");
    return phone
      ? `<li class="tx-fr-i" data-pv><div class="tx-fr-ia"><span class="tx-fr-hl">${what}</span><span class="tx-fr-k">${kind}</span></div><div class="tx-fr-ib"><span>${day(i.date)}</span><span>${mgrA(i.managerId)}</span><span>${src(i.sourceUrl)}</span></div></li>`
      : `<tr data-pv><td class="tx-fr-d">${day(i.date)}</td><td class="tx-fr-k">${kind}</td><td class="tx-fr-nm" title="${esc(i.headline || "")}">${what}${f ? `<span class="tx-fr-sub">${esc(i.headline || "")}</span>` : ""}</td><td>${mgrA(i.managerId)}</td><td>${src(i.sourceUrl)}</td></tr>`;
  };
  const evBody = !ev.length ? `<p class="tw-empty muted small">No close events tracked.</p>` : phone
    ? `<ul class="tx-fr-list">${ev.map(evRow).join("")}</ul>`
    : `<div class="tleague-wrap"><table class="tleague tx-fr-tbl"><thead><tr><th>Date</th><th>Event</th><th>Fund / announcement</th><th>Manager</th><th>Source</th></tr></thead><tbody>${ev.map(evRow).join("")}</tbody></table></div>`;
  const evCtl = `<span class="tx-fr-ctl">${chip(`data-fr-close=""`, "All", !fs.close)}${chip(`data-fr-close="first"`, "First", fs.close === "first")}${chip(`data-fr-close="final"`, "Final", fs.close === "final")}</span>`;

  // LP commitments.
  const lc = lpCommitments();
  const fundName = (c) => ((c.fundId && _fById.get(c.fundId)) || {}).name || c.fund || "";
  const lcRow = (c) => phone
    ? `<li class="tx-fr-i" data-pv><div class="tx-fr-ia"><span class="tx-fr-hl">${lpA(c.lpId)}</span><span class="tx-fr-v">${money(c.amount, c.ccy)}</span></div><div class="tx-fr-ib"><span>${mgrA(c.managerId && _mById.has(c.managerId) ? c.managerId : "", mgrNameOf(c.managerId, c.manager))}</span>${fundName(c) ? `<span>${esc(fundName(c))}</span>` : ""}<span>${day(c.date)}</span><span>${src(c.sourceUrl)}</span></div></li>`
    : `<tr data-pv><td class="tx-fr-nm">${lpA(c.lpId)}</td><td>${mgrA(c.managerId && _mById.has(c.managerId) ? c.managerId : "", mgrNameOf(c.managerId, c.manager))}</td><td>${esc(fundName(c) || "—")}</td><td class="tl-n">${money(c.amount, c.ccy)}</td><td class="tx-fr-d">${day(c.date)}</td><td>${src(c.sourceUrl)}</td></tr>`;
  const lcBody = !lc.length ? `<p class="tw-empty muted small">No commitments tracked.</p>` : phone
    ? `<ul class="tx-fr-list">${lc.map(lcRow).join("")}</ul>`
    : `<div class="tleague-wrap"><table class="tleague tx-fr-tbl"><thead><tr><th>Investor</th><th>Manager</th><th>Fund</th><th class="tl-n">Amount</th><th>Date</th><th>Source</th></tr></thead><tbody>${lc.map(lcRow).join("")}</tbody></table></div>`;

  // LP ↔ manager.
  const mx = lpManagerMatrix(15);
  let mxBody;
  if (phone) {
    mxBody = mx.pairs.length ? `<ol class="tx-fr-list tx-fr-pairs">${mx.pairs.map((p, i) => `<li class="tx-fr-i" data-pv><div class="tx-fr-ia"><span class="tx-fr-hl"><span class="tx-lg-rk">${i + 1}</span>${lpA(p.lp)} <span class="tx-fr-x">·</span> ${mgrA(p.mId, p.mName)}</span><span class="tx-fr-v">${p.n}</span></div></li>`).join("")}</ol>` : "";
  } else {
    const head = `<thead><tr><th class="tx-mx-c">LP \\ manager</th>${mx.mgrs.map((m) => `<th class="tx-mx-h" title="${esc(m.name)} — ${m.n} commitment${m.n === 1 ? "" : "s"}"><span>${m.id ? `<a class="tx-fr-a" href="${esc(P)}/manager/${encodeURIComponent(m.id)}">${esc(m.name)}</a>` : esc(m.name)}</span></th>`).join("")}</tr></thead>`;
    const rowsH = mx.lps.map((l) => `<tr><td class="tx-mx-c">${lpA(l.id)}</td>${mx.mgrs.map((m) => { const n = mx.cell.get(l.id + "|" + m.key) || 0; return `<td class="tx-mx-v${n ? " has-n" : ""}"${n ? ` title="${esc(lpName(l.id))} → ${esc(m.name)}: ${n} commitment${n === 1 ? "" : "s"}"` : ""}>${n || ""}</td>`; }).join("")}</tr>`).join("");
    mxBody = mx.lps.length ? `<div class="tleague-wrap tx-mx-wrap"><table class="tx-mx">${head}<tbody>${rowsH}</tbody></table></div>` : "";
  }
  if (!mxBody) mxBody = `<p class="tw-empty muted small">No commitments tracked.</p>`;

  const nav = `<nav class="tx-fr-nav" aria-label="Fundraising sections">${SECTIONS.map(([k, l]) => `<button type="button" class="tx-fchip" data-fr-jump="${k}">${esc(l)}</button>`).join("")}`
    + `<a class="tx-fchip tx-fr-dir" href="${esc(base)}/profiles/#/?tab=investors">Investor directory</a></nav>`;
  return `<div class="tx-fr">${nav}`
    + sec("fim", "Funds in market", `${fim.length} fund${fim.length === 1 ? "" : "s"} · ${fim.filter((r) => r.lps.length).length} with named LPs`, fimCtl, fimBody)
    + sec("closes", "First & final closes", `${ev.length} event${ev.length === 1 ? "" : "s"} · sourced`, evCtl, evBody)
    + sec("lpc", "LP commitments", `${lc.length} · ${lc.filter((c) => c.date).length} dated`, "", lcBody)
    + sec("matrix", "LP ↔ manager", phone ? `${mx.pairs.length} pairs · commitments per pair` : `top ${mx.lps.length} LPs × ${mx.mgrs.length} managers · commitments`, "", mxBody)
    + `</div>`;
}
