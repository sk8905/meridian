// =============================================================================
// v2/js/profiles/borrower.js — one page per BORROWER / company (review 2026-10-15,
// #10): "find everything on a named borrower" in one place instead of five searches.
// Route: /v2/profiles/#/co/<name>. Everything is matched by the company's name in
// Wire's own sourced records — nothing is inferred:
//   • Deals      — the deal's audited party (deal-tags) or a whole-word headline match
//   • Stress     — the Dashboard stress list (CR_STRESS) and the European credits roster
//   • Legal      — law-firm alerts, judgments and restructuring plans / schemes naming it
//   • Advisers   — firms on its deals (v2/js/deal-advisers.js)
//   • UK registry — Companies House profile + charges from the public register (/api/ch)
// =============================================================================
import { deals, managers } from "/credit/js/data.js";
import { DEAL_TAGS } from "/credit/js/deal-tags.js";
import { EUR_CREDITS } from "/credit/js/eu-credits.js";
import { CR_STRESS } from "/dashboard/js/data.js";
import { esc } from "/util.js";
import { fmtDateP, evRow } from "/feed.js";
import { creditSource } from "/credit/js/shared.js";
import { advisersFor } from "../deal-advisers.js";

const norm = (s) => " " + String(s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim() + " ";
// "Thames Water Utilities Holdings Limited" ↔ "Thames Water": compare on the name
// minus legal-form / holding suffixes.
const SUFFIX = /\s+(holdings?|group|limited|ltd|plc|s\.?a\.?s?|s\.?p\.?a\.?|gmbh|ag|n\.?v\.?|b\.?v\.?|llc|inc|corp(oration)?|s\.?a\.?r\.?l\.?|se|ab|asa|oyj|a\/s|co)\.?$/i;
export const coreName = (s) => { let n = String(s || "").replace(/\s*\(.*?\)\s*/g, " ").trim(); for (let i = 0; i < 3; i++) n = n.replace(SUFFIX, "").trim(); return n; };
const key = (s) => norm(coreName(s)).trim();
const mentions = (text, k) => k.length >= 3 && norm(text).includes(" " + k + " ");
const mgrName = new Map(managers.map((m) => [m.id, m.name]));

export const borrowerHref = (name) => `#/co/${encodeURIComponent(coreName(name))}`;

export function borrowerDeals(name) {
  const k = key(name);
  return deals.filter((d) => { const p = (DEAL_TAGS[d.id] || {}).party; return (p && key(p) === k) || mentions(d.headline, k); })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

async function ukRegistry(name) {
  try {
    const r = await fetch(`/api/ch?q=${encodeURIComponent(coreName(name))}`, { headers: { accept: "application/json" } });
    return r.ok ? await r.json() : null;
  } catch { return null; }
}

// Share: the system share sheet where the browser has one (iPhone), else copy the
// page URL with a small "Link copied" toast (the app-wide .wire-toast style).
let _toastEl = null, _toastT = null;
function toast(msg) {
  if (!_toastEl || !document.body.contains(_toastEl)) { _toastEl = document.createElement("div"); _toastEl.className = "wire-toast"; _toastEl.setAttribute("role", "status"); document.body.appendChild(_toastEl); }
  _toastEl.textContent = msg;
  _toastEl.classList.add("on");
  clearTimeout(_toastT); _toastT = setTimeout(() => _toastEl.classList.remove("on"), 1600);
}
function copyText(t) {
  if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t);
  return new Promise((res, rej) => {
    const ta = document.createElement("textarea"); ta.value = t; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand("copy"); } catch { ok = false; }
    ta.remove(); if (ok) res(); else rej(new Error("copy failed"));
  });
}
export function shareBorrower(name) {
  const url = location.href;
  if (navigator.share) { navigator.share({ title: `${name} — Wire`, url }).catch(() => {}); return; }
  copyText(url).then(() => toast("Link copied")).catch(() => toast("Couldn't copy the link"));
}

export async function viewBorrower(host, rawName, base = "/v2") {
  const name = coreName(rawName), k = key(name);
  const ds = borrowerDeals(name);
  const stress = (CR_STRESS || []).find((s) => key(s.name) === k || mentions(s.name, k));
  const credit = (EUR_CREDITS || []).find((c) => key(c.name) === k);
  host.innerHTML = `<div class="tdash"><div class="tdash-grid tdash-1"><section class="tcol tcol-c tcol-full"><div class="tdet-id"><h1>${esc(name)}</h1><div class="tdet-sub">Borrower / company · loading legal records…</div></div></section></div></div>`;
  const L = await import("/legal/js/data.js").catch(() => ({ items: [], cases: [], restructurings: [], firmById: {} }));
  const alerts = (L.items || []).filter((i) => mentions(i.title, k)).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const cases = (L.cases || []).filter((c) => mentions(c.name, k)).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const rx = (L.restructurings || []).filter((r) => mentions(r.company, k) || mentions(r.sector, k));
  const advisers = [];
  for (const d of ds) for (const a of advisersFor(d, (DEAL_TAGS[d.id] || {}).party || name, L)) if (!advisers.some((x) => x.firm === a.firm)) advisers.push(a);
  const firm = (id) => ((L.firmById || {})[id] || {}).name || id || "";
  const ext = (u, t) => (u ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(t)}</a>` : esc(t));
  const li = (t, m) => `<li class="tmini-row"><span class="tmini-t">${t}</span>${m ? `<span class="tmini-m">${m}</span>` : ""}</li>`;
  const sec = (title, n, body) => `<div class="tpg"><div class="tpg-h">${esc(title)} <span class="tveh-grp-n">${n}</span></div>${body}</div>`;
  const facts = [
    ...(stress ? [["Status", `<span class="dsh-tag dsh-tag-stress">${esc(stress.status)}</span> ${stress.debt ? esc(stress.debt) + " · " : ""}${esc(stress.note || "")} ${ext(stress.source, "source")}`]] : []),
    ...(credit ? [["Rating", `${esc(credit.rating)} (${esc(credit.agency)}) · ${esc(credit.sector)} · ${esc(credit.jurisdiction || "")} ${ext(credit.source, "source")}`]] : []),
    ...(stress && stress.hq ? [["HQ", esc(stress.hq)]] : []),
    ...(advisers.length ? [["Advisers", advisers.map((a) => esc(a.firm)).join(" · ")]] : []),
  ];
  // R43: deals, plans, judgments and alerts are events lists — the shared row
  // (date · headline / meta · tag · source).
  const dealsBody = ds.length ? `<ul class="tmini g-evs">${ds.map((d) => evRow({ dateText: fmtDateP(d), title: d.headline, href: `${base}/transactions/#/deal/${d.id}`, inApp: true, meta: esc(mgrName.get(d.managerId) || ""), src: creditSource(d), srcHref: d.sourceUrl || "", cls: "tmini-row" })).join("")}</ul>` : `<p class="tw-empty muted small">No tracked deal names this company.</p>`;
  const legalRows = [
    ...rx.map((r) => ({ x: r, t: r.company, u: r.judgmentUrl || r.articleUrl, tag: r.type === "scheme" ? "Scheme" : "Plan", meta: [r.citation, r.court].filter(Boolean).join(" · ") })),
    ...cases.map((c) => ({ x: c, t: c.name, u: c.url, tag: "Case", meta: [c.citation].filter(Boolean).join(" · "), src: c.court })),
    ...alerts.map((i) => ({ x: i, t: i.title, u: i.url, tag: "Alert", meta: "", src: firm(i.firm) })),
  ].sort((a, b) => String(b.x.date || "").localeCompare(String(a.x.date || "")));
  const legalBody = legalRows.length
    ? `<ul class="tmini g-evs">${legalRows.map((r) => evRow({ dateText: fmtDateP(r.x), title: r.t, href: r.u || "", meta: esc(r.meta), tag: `<span class="dsh-tag">${esc(r.tag)}</span>`, src: r.src || "", srcHref: r.src ? "" : (r.u || ""), cls: "tmini-row" })).join("")}</ul>` : `<p class="tw-empty muted small">No tracked alert, judgment or plan names this company.</p>`;
  host.innerHTML = `
    <div class="tdash"><div class="tdash-grid tdash-1"><section class="tcol tcol-c tcol-full">
      <div class="tdet-id" data-borrower="${esc(name)}">
        <div class="co-head"><h1>${esc(name)}</h1><button type="button" class="tfocus-btn co-share" aria-label="Share this borrower page" title="Share this page">Share</button></div>
        <div class="tdet-sub">Borrower / company · ${ds.length} deal${ds.length === 1 ? "" : "s"} · ${alerts.length + cases.length + rx.length} legal record${alerts.length + cases.length + rx.length === 1 ? "" : "s"}</div>
        ${facts.length ? `<ul class="tbiz">${facts.map(([a, v]) => `<li><span class="tbiz-k">${esc(a)}</span><span class="tbiz-v">${v}</span></li>`).join("")}</ul>` : ""}
      </div>
      ${sec("Deals", ds.length, dealsBody)}
      ${sec("Legal — plans, judgments & alerts", alerts.length + cases.length + rx.length, legalBody)}
      <div class="tpg" id="co-uk"><div class="tpg-h">UK registry (Companies House)</div><p class="tw-empty muted small">Looking up…</p></div>
    </section></div></div>`;
  const sh = host.querySelector(".co-share");
  if (sh) sh.addEventListener("click", () => shareBorrower(name));
  const uk = await ukRegistry(name);
  const box = host.querySelector("#co-uk");
  if (!box) return;
  const reg = `https://find-and-update.company-information.service.gov.uk/search?q=${encodeURIComponent(name)}`;
  if (!uk || !uk.company) {
    box.innerHTML = `<div class="tpg-h">UK registry (Companies House)</div><p class="tw-empty muted small">No matching UK company found on the public register. <a href="${esc(reg)}" target="_blank" rel="noopener noreferrer">Search Companies House</a></p>`;
    return;
  }
  const c = uk.company;
  const charges = (uk.charges || []).slice(0, 12);
  box.innerHTML = `<div class="tpg-h">UK registry (Companies House)</div><ul class="tbiz">`
    + `<li><span class="tbiz-k">Company</span><span class="tbiz-v">${ext(`https://find-and-update.company-information.service.gov.uk/company/${c.number}`, `${c.name} (${c.number})`)}</span></li>`
    + `<li><span class="tbiz-k">Status</span><span class="tbiz-v">${esc(c.status || "—")}${c.incorporated ? " · incorporated " + esc(c.incorporated) : ""}</span></li>`
    + `</ul>` + (charges.length ? `<ul class="tmini">${charges.map((x) => li(esc((x.persons || []).join(", ") || "Charge holder not stated"), `${esc(x.created || "")} · ${esc(x.status || "")}${x.description ? " · " + esc(x.description) : ""}`)).join("")}</ul>` : `<p class="tw-empty muted small">No registered charges.</p>`);
}
