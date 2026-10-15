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
import { esc, fmtD } from "/util.js";
import { evRow as eventRow } from "/feed.js";
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
  const src = (url) => (url ? `<a class="tx-fr-src dsh-src" href="${esc(url)}" target="_blank" rel="noopener noreferrer" title="Source">src</a>` : "");
  const day = (d) => (d ? esc(fmtD(String(d).slice(0, 10))) : "—");
  // R43: every dated list here is an events list — date first, the item, status tag, source
  // last; on iPhone each row is the shared events row (feed.js evRow), at one fixed height.
  const fSrc = (f) => ((f.sources || []).find((x) => x && x.url) || {}).url || f.sourceUrl || "";
  const tagH = (t) => (t ? `<span class="dsh-tag">${esc(t)}</span>` : "");
  const phoneRow = (o) => eventRow({ ...o, cls: `tx-fr-i${o.cls ? ` ${o.cls}` : ""}`, attrs: " data-pv" });
  const sec = (id, title, meta, ctl, inner) => `<section class="tx-fr-sec" id="tx-fr-${id}" data-fr="${id}"><header class="tx-fr-h"><h3 class="tx-fr-t">${esc(title)}</h3>${meta ? `<span class="tx-fr-n">${meta}</span>` : ""}${ctl || ""}</header>${inner}</section>`;
  const chip = (attr, label, on) => `<button type="button" class="tx-fchip${on ? " is-on" : ""}" ${attr} aria-pressed="${on}">${esc(label)}</button>`;

  // Funds in market.
  const fim = fundsInMarket({ scope: fs.fim });
  const fimRow = ({ f, lps: L, stale }) => phone
    ? phoneRow({ date: f.asOf ? String(f.asOf).slice(0, 10) : "", title: f.name, href: `${P}/manager/${encodeURIComponent(f.managerId)}/vehicles`, inApp: true, aCls: "tx-fr-a",
      tag: tagH(f.status + (stale ? " · stale" : "")), srcHref: fSrc(f),
      meta: [esc(mgrNameOf(f.managerId)), esc(f.strategy || ""), f.raised != null ? `raised ${esc(money(f.raised, f.ccy))}` : f.targetSize != null ? `target ${esc(money(f.targetSize, f.ccy))}` : ""].filter(Boolean).join(" · ") })
    : `<tr data-pv title="${esc([f.name, mgrNameOf(f.managerId), f.strategy, f.status].filter(Boolean).join(" · "))}"><td class="tx-fr-d c-date">${day(f.asOf)}</td><td class="tx-fr-nm c-text"><a class="tx-fr-a" href="${esc(P)}/manager/${encodeURIComponent(f.managerId)}/vehicles">${esc(f.name)}</a></td>`
      + `<td class="c-tag">${tagH(f.status)}${stale ? ` <span class="dsh-tag tx-fr-stale" title="Status not refreshed in 12+ months — it may have closed since">stale</span>` : ""}</td>`
      + `<td class="c-text">${mgrA(f.managerId)}</td><td class="c-text">${esc(f.strategy || "—")}</td>`
      + `<td class="tl-n c-num">${money(f.targetSize, f.ccy)}</td><td class="tl-n c-num">${money(f.raised, f.ccy)}</td>`
      + `<td class="tx-fr-lps c-text">${L.length ? esc(L.slice(0, 3).join(", ")) + (L.length > 3 ? ` +${L.length - 3}` : "") : "—"}</td><td class="c-src">${src(fSrc(f))}</td></tr>`;
  const fimBody = !fim.length ? `<p class="tw-empty muted small">No funds in market for this filter.</p>` : phone
    ? `<ul class="tx-fr-list g-evs">${fim.map(fimRow).join("")}</ul>`
    : `<div class="tleague-wrap"><table class="tleague tx-fr-tbl" data-events="1"><thead><tr><th class="c-date">As of</th><th>Fund</th><th class="c-tag">Status</th><th>Manager</th><th>Strategy</th><th class="tl-n c-num">Target</th><th class="tl-n c-num">Raised</th><th>Named LPs</th><th class="c-src">Src</th></tr></thead><tbody>${fim.map(fimRow).join("")}</tbody></table></div>`;
  const fimCtl = `<span class="tx-fr-ctl">${chip(`data-fr-fim="all"`, "All regions", fs.fim === "all")}${chip(`data-fr-fim="eu"`, "Europe", fs.fim === "eu")}</span>`;

  // First / final close timeline.
  const ev = closeEvents(fs.close);
  const fundOf = (i) => (i.fundId && _fById.get(i.fundId)) || null;
  const closeRow = (i) => {
    const f = fundOf(i), kind = i.type === "First Close" ? "First close" : "Final close";
    if (phone) return phoneRow({ date: i.date, title: f ? f.name : (i.headline || "—"), href: f ? `${P}/manager/${encodeURIComponent(f.managerId)}/vehicles` : "", inApp: true, aCls: "tx-fr-a",
      tag: tagH(kind), srcHref: i.sourceUrl || "", meta: [mgrA(i.managerId), f ? esc(i.headline || "") : ""].filter((x) => x && x !== "—").join(" · ") });
    const what = f ? `<a class="tx-fr-a" href="${esc(P)}/manager/${encodeURIComponent(f.managerId)}/vehicles">${esc(f.name)}</a>` : esc(i.headline || "—");
    return `<tr data-pv title="${esc(i.headline || "")}"><td class="tx-fr-d c-date">${day(i.date)}</td><td class="tx-fr-nm c-text">${what}</td><td class="tx-fr-k c-tag">${tagH(kind)}</td><td class="c-text">${mgrA(i.managerId)}</td><td class="c-src">${src(i.sourceUrl)}</td></tr>`;
  };
  const evBody = !ev.length ? `<p class="tw-empty muted small">No close events tracked.</p>` : phone
    ? `<ul class="tx-fr-list g-evs">${ev.map(closeRow).join("")}</ul>`
    : `<div class="tleague-wrap"><table class="tleague tx-fr-tbl" data-events="1"><thead><tr><th class="c-date">Date</th><th>Fund / announcement</th><th class="c-tag">Event</th><th>Manager</th><th class="c-src">Src</th></tr></thead><tbody>${ev.map(closeRow).join("")}</tbody></table></div>`;
  const evCtl = `<span class="tx-fr-ctl">${chip(`data-fr-close=""`, "All", !fs.close)}${chip(`data-fr-close="first"`, "First", fs.close === "first")}${chip(`data-fr-close="final"`, "Final", fs.close === "final")}</span>`;

  // LP commitments.
  const lc = lpCommitments();
  const fundName = (c) => ((c.fundId && _fById.get(c.fundId)) || {}).name || c.fund || "";
  const lcMgr = (c) => mgrA(c.managerId && _mById.has(c.managerId) ? c.managerId : "", mgrNameOf(c.managerId, c.manager));
  const lcRow = (c) => phone
    ? phoneRow({ date: c.date, title: lpName(c.lpId) || c.lpId, href: `${P}/lp/${encodeURIComponent(c.lpId)}`, inApp: true, aCls: "tx-fr-a",
      tag: c.amount != null ? `<span class="tx-fr-v">${esc(money(c.amount, c.ccy))}</span>` : "", srcHref: c.sourceUrl || "",
      meta: [lcMgr(c), fundName(c) ? esc(fundName(c)) : ""].filter((x) => x && x !== "—").join(" · ") })
    : `<tr data-pv><td class="tx-fr-d c-date">${day(c.date)}</td><td class="tx-fr-nm c-text">${lpA(c.lpId)}</td><td class="c-text">${lcMgr(c)}</td><td class="c-text">${esc(fundName(c) || "—")}</td><td class="tl-n c-num">${money(c.amount, c.ccy)}</td><td class="c-src">${src(c.sourceUrl)}</td></tr>`;
  const lcBody = !lc.length ? `<p class="tw-empty muted small">No commitments tracked.</p>` : phone
    ? `<ul class="tx-fr-list g-evs">${lc.map(lcRow).join("")}</ul>`
    : `<div class="tleague-wrap"><table class="tleague tx-fr-tbl" data-events="1"><thead><tr><th class="c-date">Date</th><th>Investor</th><th>Manager</th><th>Fund</th><th class="tl-n c-num">Amount</th><th class="c-src">Src</th></tr></thead><tbody>${lc.map(lcRow).join("")}</tbody></table></div>`;

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
