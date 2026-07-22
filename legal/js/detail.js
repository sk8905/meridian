// =============================================================================
// legal/js/detail.js — the detail views: single-alert (#/item/<id>) and firm
// profile (#/firm/<id>). Extracted from app.js, which routes to them via
// viewItem/viewFirm. Imports flow app.js -> detail.js -> shared.js (never
// backwards) so the module graph stays acyclic.
// NOTE: keep the ./data.js ?v= token identical to app.js / shared.js (see the
// shared.js header) or the browser loads data.js twice as separate instances.
// =============================================================================
import {
  items, cases, restructurings, firmById, areaById, typeById,
} from "./data.js?v=20260722-3";
import { esc, byDateDesc } from "/util.js?v=20260719-1";
import {
  fmtDate, itemDate, isNew, getSaved, areaChip, tierLabel, firmLink, itemRow,
  _chipMem, chipMemKey,
} from "./shared.js?v=20260722-3";

const app = document.getElementById("app");

// =============================================================================
// VIEW: Detail (#/item/<id>)
// =============================================================================
export function viewItem(id) {
  const it = items.find((x) => x.id === id);
  if (!it) {
    app.innerHTML = `<div class="empty">Update not found. <a href="#/list">Back to all updates</a></div>`;
    return;
  }
  const firm = firmById[it.firm] || { name: it.firm, tier: "", insightsUrl: "#" };
  const type = (typeById[it.type] || {}).name || it.type;
  const saved = getSaved().has(it.id);
  const areasHtml = (it.areas || [it.area]).map(areaChip).join(" ");
  const tagsHtml = (it.tags || []).map((t) =>
    `<a class="tag" href="#/list?q=${encodeURIComponent(t)}">#${esc(t)}</a>`).join(" ");
  const pointsHtml = (it.points || []).map((p) => `<li>${esc(p)}</li>`).join("");

  const areaNames = (it.areas || [it.area]).map((a) => (areaById[a] ? areaById[a].name : a));
  const metrics = [
    ["Firm", esc(firm.name)], ["Tier", esc(tierLabel(firm.tier))], ["Type", esc(type)],
    ["Date", esc(itemDate(it))], ...(it.jurisdiction ? [["Jurisdiction", esc(it.jurisdiction)]] : []),
  ];
  const facts = [
    ["Firm", firmLink(it.firm, firm.name, `tf-lnk`)],
    ["Tier", esc(tierLabel(firm.tier))],
    ["Type", esc(type)],
    ["Practice areas", areaNames.map(esc).join(", ")],
    ...(it.jurisdiction ? [["Jurisdiction", esc(it.jurisdiction)]] : []),
    ...(it.court ? [["Court", esc(it.court)]] : []),
    ...(it.citation ? [["Citation", esc(it.citation)]] : []),
    ["Date", esc(itemDate(it))],
  ];
  const relatedList = items
    .filter((x) => x.id !== it.id && (x.areas || [x.area]).some((a) => (it.areas || [it.area]).includes(a)))
    .sort(byDateDesc).slice(0, 8);
  const relatedRail = relatedList.length
    ? `<ul class="tmini">${relatedList.map((r) => `<li class="tmini-row clickable" data-href="#/item/${encodeURIComponent(r.id)}"><span class="tmini-t">${esc(r.title)}</span><span class="tmini-m">${esc((firmById[r.firm] || {}).name || r.firm)}${r.date ? " · " + esc(fmtDate(r.date)) : ""}</span></li>`).join("")}</ul>`
    : `<p class="tw-empty muted small">No related updates.</p>`;

  app.innerHTML = `
    <div class="tdash">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#/">Dashboard</a><span class="sep">/</span>
        <a href="#/list?area=${esc(it.area)}">${esc(areaById[it.area] ? areaById[it.area].name : it.area)}</a><span class="sep">/</span>
        <span aria-current="page">Update</span>
      </nav>
      <div class="tdash-ticker">${metrics.map(([l, v]) => `<span class="tmet"><b>${v}</b> ${esc(l)}</span>`).join("")}</div>
      <div class="tdash-grid tdash-2">
        <section class="tcol tcol-c">
          <div class="tdet-id">
            <div class="tdet-chips">${areasHtml} <span class="chip type">${esc(type)}</span>${isNew(it) ? '<span class="chip new">New</span>' : ""}
              <button class="save-btn ${saved ? "is-saved" : ""}" data-save="${esc(it.id)}" aria-pressed="${saved}" style="margin-left:auto">${saved ? "★ Saved" : "☆ Save"}</button></div>
            <h1>${esc(it.title)}</h1>
            <div class="tdet-sub">${firmLink(it.firm, firm.name, `tf-lnk`)} · ${esc(tierLabel(firm.tier))} · ${itemDate(it)}${it.jurisdiction ? " · " + esc(it.jurisdiction) : ""}</div>
          </div>
          <header class="tpanel-h"><span>Summary</span></header>
          <div class="tdet-read">
            <p>${esc(it.summary)}</p>
            ${pointsHtml ? `<h4>Key points</h4><ul>${pointsHtml}</ul>` : ""}
            ${tagsHtml ? `<div class="tags">${tagsHtml}</div>` : ""}
            <div class="source-box">
              <span class="lbl">Source</span>
              <a href="${esc(it.url || firm.insightsUrl)}" target="_blank" rel="noopener noreferrer">${esc(firm.name)} — ${it.url ? "read the article" : "insights / know-how"}</a>
              <p class="source-note">${it.url ? "Links to the cited publication." : "Links to the firm's public landing page."} This summary is written for this prototype and is not legal advice — confirm against the firm's actual publication.</p>
            </div>
          </div>
        </section>
        <aside class="tcol tcol-r">
          <section class="tpanel"><header class="tpanel-h"><span>Details</span></header>
            <ul class="tfacts">${facts.map(([k, v]) => `<li><span class="tf-k">${esc(k)}</span><span class="tf-v">${v}</span></li>`).join("")}</ul>
          </section>
          <section class="tpanel"><header class="tpanel-h"><span>Related updates</span>${relatedList.length ? `<span class="tpanel-x">${relatedList.length}</span>` : ""}</header>${relatedRail}</section>
        </aside>
      </div>
    </div>
  `;
}

// =============================================================================
// VIEW: Firm profile (#/firm/<id>) — the Legal analogue of Credit's manager
// profile: firm identity + external insights link, plus every alert this firm
// published and every restructuring matter it analysed, so an item can always
// point to "the firm" the way a Credit deal points to its manager.
// =============================================================================
// Textual aliases a firm is actually cited by in judgments/alerts/deal wire copy
// (the record's own name plus historic/short forms). Used to compile the firm's
// "involved in" lists — cases, matters and deals that NAME the firm.
const FIRM_ALIASES = {
  aoshearman: ["a&o shearman", "allen & overy"],
  slaughtermay: ["slaughter and may", "slaughter & may"],
  hsf: ["herbert smith freehills", "hsf kramer", "herbert smith"],
  weil: ["weil, gotshal", "weil gotshal", "weil"],
  cleary: ["cleary gottlieb", "cleary"],
  latham: ["latham & watkins", "latham"],
  kirkland: ["kirkland & ellis", "kirkland"],
  ropesgray: ["ropes & gray", "ropes and gray"],
  simmons: ["simmons & simmons", "simmons + simmons"],
};
function firmMentioned(firm, text) {
  const hay = String(text || "").toLowerCase();
  const names = FIRM_ALIASES[firm.id] || [firm.name.toLowerCase()];
  return names.some((n) => hay.includes(n));
}
// Whole-record text for mention scanning (titles, summaries, adviser lists…).
const recText = (o) => { try { return JSON.stringify(o); } catch { return ""; } };

export function viewFirm(id) {
  const firm = firmById[id];
  if (!firm) {
    app.innerHTML = `<div class="empty">Firm not found. <a href="#/list">Back to all updates</a></div>`;
    return;
  }
  const firmAlerts = items.filter((i) => i.firm === id).sort(byDateDesc);
  const firmRx = restructurings.filter((r) => r.firm === id).sort(byDateDesc);
  // ---- Involvement compilation: everything on the wire that NAMES this firm ----
  // Cases whose name/summary cite the firm (as counsel or party).
  const firmCases = cases.filter((c) => firmMentioned(firm, recText(c))).sort(byDateDesc);
  // Schemes & plans that cite the firm anywhere in the record (advisers, narrative)
  // beyond the ones it authored analysis for (those are in firmRx already).
  const rxMentions = restructurings.filter((r) => r.firm !== id && firmMentioned(firm, recText(r))).sort(byDateDesc);
  // Other firms' / unattributed alerts that cite the firm in title or summary.
  const alertMentions = items.filter((i) => i.firm !== id && firmMentioned(firm, (i.title || "") + " " + (i.summary || ""))).sort(byDateDesc);
  // Practice-area mix across this firm's alerts (for the rail).
  const areaMix = {};
  firmAlerts.forEach((i) => (i.areas || [i.area]).forEach((a) => (areaMix[a] = (areaMix[a] || 0) + 1)));
  const areaMixRows = Object.entries(areaMix).sort((a, b) => b[1] - a[1]);

  const alertWireRow = (it) => `<li class="compact-item tw-row" data-kind="alert">`
    + `<span class="tw-date">${it.date ? esc(fmtDate(it.date)) : ""}</span>`
    + `<span class="tw-tag alert">ALERT</span>`
    + `<span class="tw-body">${it.url ? `<a href="${esc(it.url)}" target="_blank" rel="noopener noreferrer" class="tw-head">${esc(it.title)}</a>` : `<a href="#/item/${encodeURIComponent(it.id)}" class="tw-head">${esc(it.title)}</a>`}`
    + `${(it.areas || [it.area]).length ? `<span class="tw-mgr-w"><span class="tw-mgr">${esc((areaById[(it.areas || [it.area])[0]] || {}).name || (it.areas || [it.area])[0])}</span></span>` : ""}</span>`
    + `<span class="tw-src">${esc((typeById[it.type] || {}).name || it.type)}</span>`
    + `</li>`;
  // "Involved in" wire — cases / schemes & plans / alerts across the whole wire
  // that name this firm, one dated list, newest first.
  const inv = [
    ...firmCases.map((c) => ({ date: c.date, tag: "case", code: "CASE", title: c.name, href: c.url || "#/", ext: !!c.url, meta: `${c.court || ""}${c.citation ? " · " + c.citation : ""}` })),
    ...rxMentions.map((r) => { const u = r.judgmentUrl || r.articleUrl; return { date: r.date, tag: "rp", code: r.type === "scheme" ? "SCHEME" : "RP", title: r.company, href: u || "#/", ext: !!u, meta: `${r.type === "scheme" ? "Scheme" : "Restructuring plan"}${r.citation ? " · " + r.citation : ""}` }; }),
    ...alertMentions.map((i) => ({ date: i.date, tag: "alert", code: "ALERT", title: i.title, href: i.url || `#/item/${encodeURIComponent(i.id)}`, ext: !!i.url, meta: (firmById[i.firm] || {}).name || "" })),
  ].sort(byDateDesc);
  const invRow = (x) => `<li class="compact-item tw-row">`
    + `<span class="tw-date">${x.date ? esc(fmtDate(x.date)) : ""}</span>`
    + `<span class="tw-tag ${x.tag}">${x.code}</span>`
    + `<span class="tw-body"><a href="${esc(x.href)}"${x.ext ? ` target="_blank" rel="noopener noreferrer"` : ""} class="tw-head">${esc(x.title)}</a>`
    + `${x.meta ? `<span class="tw-mgr-w"><span class="tw-mgr">${esc(x.meta)}</span></span>` : ""}</span>`
    + `</li>`;
  const areaRail = areaMixRows.length
    ? `<ul class="tfacts">${areaMixRows.map(([a, n]) => `<li><span class="tf-k">${esc((areaById[a] || {}).name || a)}</span><span class="tf-v">${n}</span></li>`).join("")}</ul>`
    : "";

  // ---- One chip-filtered wire (matches the dashboard chips): All / Alerts /
  // Matters. "Matters" = everything the firm worked on or is named in — its
  // restructuring-analysis matters, cases/schemes/plans naming it, and credit-
  // wire deals naming it (loaded lazily below). "Alerts" = its own alerts.
  const matterRows = [
    ...firmRx.map((r) => { const u = r.judgmentUrl || r.articleUrl; return { date: r.date, tag: "rp", code: r.type === "scheme" ? "SCHEME" : "RP", title: r.company, href: u || "#/", ext: !!u, meta: `${r.type === "scheme" ? "Scheme" : "Restructuring plan"}${r.citation ? " · " + r.citation : ""}` }; }),
    ...inv,
  ];
  let dealRows = null; // null = credit wire still loading
  let firmTab = _chipMem[chipMemKey("firm-chips")] || "all";
  if (!["all", "alerts", "matters"].includes(firmTab)) firmTab = "all";
  const emptyRow = (t) => `<li class="tw-empty muted small">${t}</li>`;
  const renderFirmWire = () => {
    const list = document.getElementById("firm-wire"); if (!list) return;
    const alerts = firmAlerts.map((it) => ({ date: it.date || "", html: alertWireRow(it) }));
    const matters = [...matterRows, ...(dealRows || [])].map((x) => ({ date: x.date || "", html: invRow(x) }));
    const rows = (firmTab === "alerts" ? alerts : firmTab === "matters" ? matters : [...alerts, ...matters])
      .sort(byDateDesc);
    list.innerHTML = rows.length ? rows.map((r) => r.html).join("")
      : emptyRow(firmTab === "alerts" ? "No alerts tracked from this firm yet."
        : firmTab === "matters" ? "No tracked matter, case, scheme, plan or deal names this firm yet."
        : "Nothing tracked for this firm yet.");
  };

  app.innerHTML = `
    <div class="tdash">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#/">Dashboard</a><span class="sep">/</span><a href="#/list">Legal alerts</a><span class="sep">/</span>
        <span aria-current="page">${esc(firm.name)}</span>
      </nav>
      <div class="tdash-grid tdash-2">
        <section class="tcol tcol-c">
          <div class="tdet-id">
            <h1>${esc(firm.name)}</h1>
            <div class="tdet-src"><span class="lbl">Insights:</span> <a href="${esc(firm.insightsUrl || "#")}" target="_blank" rel="noopener noreferrer">${esc(firm.name)} — insights / know-how</a></div>
          </div>
          <header class="tpanel-h twire-head">
            <div class="tchips" id="firm-chips">${[["all", "All"], ["alerts", "Alerts"], ["matters", "Matters"]]
              .map(([k, l]) => `<button type="button" class="tchip${k === firmTab ? " is-on" : ""}" data-k="${k}">${l}</button>`).join("")}</div>
          </header>
          <ul class="twire compact-list" id="firm-wire"></ul>
        </section>
        <aside class="tcol tcol-r">
          ${areaRail ? `<section class="tpanel"><header class="tpanel-h"><span>Practice areas</span><span class="tpanel-x">alerts</span></header>${areaRail}</section>` : ""}
        </aside>
      </div>
    </div>
  `;
  renderFirmWire();
  const chips = document.getElementById("firm-chips");
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".tchip"); if (!b) return;
    firmTab = b.dataset.k;
    _chipMem[chipMemKey("firm-chips")] = firmTab || "all";
    chips.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    renderFirmWire();
  });

  // Credit-wire deals/fundraising naming this firm fold into "Matters" (and
  // "All") once the lazily-loaded credit data arrives; if it can't load, the
  // page simply shows the legal-side rows.
  import("/credit/js/data.js?v=20260722-3").then(({ deals, intel, managers }) => {
    const mgr = (mid) => (managers.find((m) => m.id === mid) || {}).name || "";
    dealRows = [...(deals || []), ...(intel || [])]
      .filter((d) => firmMentioned(firm, recText(d)))
      .map((d) => ({
        date: d.date, tag: "deal", code: d.clo ? "CLO" : (d.headline ? "DEAL" : "INTEL"),
        title: d.headline || d.title || "", ext: !!d.sourceUrl,
        href: d.sourceUrl || (d.managerId ? `/credit/#/manager/${encodeURIComponent(d.managerId)}` : "/credit/#/"),
        meta: mgr(d.managerId),
      }));
    renderFirmWire();
  }).catch(() => { dealRows = []; });
}
