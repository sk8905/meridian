// AUTO-PORTED from legal/js/detail.js — settable host (__setHost) instead of a
// global #app capture; render code verbatim.

// =============================================================================
// legal/js/detail.js — the detail views: single-alert (#/item/<id>) and firm
// profile (#/firm/<id>). Extracted from app.js, which routes to them via
// viewItem/viewFirm. Imports flow app.js -> detail.js -> shared.js (never
// backwards) so the module graph stays acyclic.
// NOTE: ./data.js is imported by the same tokenless URL as app.js / shared.js
// (served no-cache; no ?v= tokens — HOUSE_STYLE T1/T2), so the browser shares
// one module instance rather than loading data.js twice.
// =============================================================================
import {
  items, cases, restructurings, firms, firmById, areaById, typeById,
} from "/legal/js/data.js";
import { esc, byDateDesc } from "/util.js";
import {
  fmtDate, itemDate, isNew, areaChip, tierLabel, firmLink,
  _chipMem, chipMemKey,
} from "/legal/js/shared.js";
// The watchlist (follow) store is shared app-wide and lives in credit/js/shared.js —
// a law firm is followable too, so its profile gets the same ☆ star (type "firm").
import { nameCell, fmtBn, creditSource } from "/credit/js/shared.js";
import { peersOf, peerDetails } from "../peers.js";
import { latestLine } from "../profile-tabs.js";
import {
  PRACTICES, LENS_REGIONS, SIDE_LABEL, itemPractices, itemRegions, courtRegions, dealRegion,
  adviserSide, pcDealIsCredit, pcDealSide, firmAliases, adviserIsFirm,
} from "./firm-lens.js";

export let app = null;
export function __setHost(h) { app = h; }
// Scope id lookups to the current host (the retired Legal desk can hold a hidden copy).
const $id = (id) => (app && app.querySelector && app.querySelector("#" + CSS.escape(id))) || document.getElementById(id);

// The Legal desk's section chips (the same set the dashboard shows). Rendered at
// the top of every detail view so you navigate the desk the same way from a
// profile as from the dashboard: each chip jumps straight to that section (the
// dashboard seeds its selection from ?tab=). `all` has no param (bare dashboard).
const LG_SECTIONS = [["all", "All"], ["alert", "Alerts"], ["news", "News"], ["case", "Case law"], ["rp", "Scheme/RPs"], ["firms", "Law Firms"]];
// When a firm is opened from the Profiles tab it is hosted there, so its top nav
// becomes the Profiles chip set (Managers · Hedge Funds · Law firms) returning to
// that list, not the Legal desk's sections. Profiles flips this on per render.
let profilesMode = false;
export function __setProfilesMode(v) { profilesMode = v; }
const PF_SECTIONS = [["managers", "Managers"], ["hedgefunds", "Hedge Funds"], ["firms", "Law firms"]];
const sectionNav = (active) => profilesMode
  ? `<header class="tpanel-h twire-head tdet-secnav"><div class="tchips">${PF_SECTIONS
      .map(([k, l]) => `<a class="tchip${k === "firms" ? " is-on" : ""}" href="#/?tab=${k}">${esc(l)}</a>`).join("")}</div></header>`
  : `<header class="tpanel-h twire-head tdet-secnav"><div class="tchips">${LG_SECTIONS
      .map(([k, l]) => `<a class="tchip${k === active ? " is-on" : ""}" href="${k === "all" ? "#/" : "#/?tab=" + k}">${esc(l)}</a>`).join("")}</div></header>`;

// =============================================================================
// VIEW: Detail (#/item/<id>)
// =============================================================================
export function viewItem(id) {
  const it = items.find((x) => x.id === id);
  if (!it) {
    app.innerHTML = `<div class="empty">Update not found. <a href="${profilesMode ? "#/?tab=firms" : "#/list"}">Back to all updates</a></div>`;
    return;
  }
  const firm = firmById[it.firm] || { name: it.firm, tier: "", insightsUrl: "#" };
  const type = (typeById[it.type] || {}).name || it.type;
  const areasHtml = (it.areas || [it.area]).map(areaChip).join(" ");
  // Tag chips filter the all-updates LIST — a Legal-desk route. The Profiles host has
  // no updates list, so there a tag link would dead-end back to the profile list; show
  // the tags as plain text instead (the firm/item content is the destination here).
  const tagsHtml = (it.tags || []).map((t) =>
    profilesMode ? `<span class="tag">#${esc(t)}</span>` : `<a class="tag" href="#/list?q=${encodeURIComponent(t)}">#${esc(t)}</a>`).join(" ");
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
    ? `<ul class="tmini">${relatedList.map((r) => `<li class="tmini-row clickable" data-href="#/item/${encodeURIComponent(r.id)}"><span class="tmini-t">${esc(r.title)}</span><span class="tmini-m">${esc((firmById[r.firm] || {}).name || r.firm)}${r.date ? " · " + (r.dateEstimated ? "c. " : "") + esc(fmtDate(r.date)) : ""}</span></li>`).join("")}</ul>`
    : `<p class="tw-empty muted small">No related updates.</p>`;

  app.innerHTML = `
    <div class="tdash">
      ${sectionNav(it.type === "news" || it.desk === "news" ? "news" : "alert")}
      <div class="tdash-ticker">${metrics.map(([l, v]) => `<span class="tmet"><b>${v}</b> ${esc(l)}</span>`).join("")}</div>
      <div class="tdash-grid tdash-2">
        <section class="tcol tcol-c">
          <div class="tdet-id">
            <div class="tdet-chips">${areasHtml} <span class="chip type">${esc(type)}</span>${isNew(it) ? '<span class="chip new">New</span>' : ""}</div>
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
              ${(() => { const u = it.url || firm.insightsUrl; const lbl = `${esc(firm.name)} — ${it.url ? "read the article" : "insights / know-how"}`; return (u && u !== "#") ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${lbl}</a>` : `<span>${lbl}</span>`; })()}
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

// London-office figure formatters (mirror the Law Firms league table). Revenue in
// £m → £Xm/£X.XXbn; PEP in the reported currency ($ for US-firm global figures).
const lfCcy = (basis) => /\$|US\$|USD/.test(basis || "") ? "$" : "£";
const lfMoney = (v, basis) => v == null ? "—" : fmtBn(v / 1000, lfCcy(basis));   // £m in → one money format (R2d)
const lfPep = (p, basis) => p == null ? "—" : lfCcy(basis) + (p >= 1 ? p.toFixed(2) + "m" : Math.round(p * 1000) + "k");
// Deal dates may be full (YYYY-MM-DD), month-only (YYYY-MM) or year-only.
const PC_MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function pcDate(s) {
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return esc(fmtDate(s));
  const m = /^(\d{4})-(\d{2})$/.exec(s);
  return m ? PC_MON[+m[2] - 1] + " " + m[1] : esc(s);
}
// One private-capital deal row (last-12-months list): date · parties · role · value.
const pcDealRow = (d) => `<li class="compact-item tw-row" data-kind="deal">`
  + `<span class="tw-date">${pcDate(d.date)}</span>`
  + `<span class="tw-tag deal">DEAL</span>`
  + `<span class="tw-body">${d.url ? `<a href="${esc(d.url)}" target="_blank" rel="noopener noreferrer" class="tw-head">${esc(d.parties)}</a>` : `<span class="tw-head">${esc(d.parties)}</span>`}`
  + `${d.role ? `<span class="tw-mgr-w"><span class="tw-mgr">${esc(d.role)}</span></span>` : ""}</span>`
  + `<span class="tw-src">${esc(d.value || "")}</span>`
  + `</li>`;

const _lensMem = {};   // per-firm lens filters { prac, reg } for the session
export function viewFirm(id, tab0) {
  const firm = firmById[id];
  if (!firm) {
    app.innerHTML = `<div class="empty">Firm not found. <a href="${profilesMode ? "#/?tab=firms" : "#/list"}">Back to all updates</a></div>`;
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
    + `<span class="tw-date"${it.dateEstimated ? ' title="Approximate date — the source shows no exact publication date"' : ""}>${it.date ? (it.dateEstimated ? "c. " : "") + esc(fmtDate(it.date)) : ""}</span>`
    + `<span class="tw-tag alert">ALERT</span>`
    + `<span class="tw-body">${it.url ? `<a href="${esc(it.url)}" target="_blank" rel="noopener noreferrer" class="tw-head">${esc(it.title)}</a>` : `<a href="#/item/${encodeURIComponent(it.id)}" class="tw-head">${esc(it.title)}</a>`}`
    + `${(it.areas || [it.area]).length ? `<span class="tw-mgr-w"><span class="tw-mgr">${esc((areaById[(it.areas || [it.area])[0]] || {}).name || (it.areas || [it.area])[0])}</span></span>` : ""}</span>`
    + `<span class="tw-src">${esc((typeById[it.type] || {}).name || it.type)}</span>`
    + `</li>`;
  // "Involved in" wire — cases / schemes & plans / alerts across the whole wire
  // that name this firm, one dated list, newest first.
  // Every row carries its practice (`prac`) and region (`reg`) evidence for the lens
  // filters (firm-lens.js): alerts from their areas / tags / jurisdiction, judgments and
  // plans from their court, deals from their audited country.
  const rxRow = (r) => { const u = r.judgmentUrl || r.articleUrl; return { date: r.date, tag: "rp", code: r.type === "scheme" ? "SCHEME" : "RP", title: r.company, href: u || "#/", ext: !!u, meta: `${r.type === "scheme" ? "Scheme" : "Restructuring plan"}${r.citation ? " · " + r.citation : ""}`, prac: ["restructuring"], reg: courtRegions(r) }; };
  const inv = [
    ...firmCases.map((c) => ({ date: c.date, tag: "case", code: "CASE", title: c.name, href: c.url || "#/", ext: !!c.url, meta: `${c.court || ""}${c.citation ? " · " + c.citation : ""}`, prac: c.area === "ri" ? ["disputes", "restructuring"] : ["disputes"], reg: courtRegions(c) })),
    ...rxMentions.map(rxRow),
    ...alertMentions.map((i) => ({ date: i.date, tag: "alert", code: "ALERT", title: i.title, href: i.url || `#/item/${encodeURIComponent(i.id)}`, ext: !!i.url, meta: (firmById[i.firm] || {}).name || "", prac: itemPractices(i), reg: itemRegions(i) })),
  ].sort(byDateDesc);
  const invRow = (x) => `<li class="compact-item tw-row">`
    + `<span class="tw-date">${x.date ? esc(fmtDate(x.date)) : ""}</span>`
    + `<span class="tw-tag ${x.tag}">${x.code}</span>`
    + `<span class="tw-body"><a href="${esc(x.href)}"${x.ext ? ` target="_blank" rel="noopener noreferrer"` : ""} class="tw-head">${esc(x.title)}</a>`
    + `${x.meta ? `<span class="tw-mgr-w">${x.metaHref ? `<a class="tw-mgr" href="${esc(x.metaHref)}">${esc(x.meta)}</a>` : `<span class="tw-mgr">${esc(x.meta)}</span>`}</span>` : ""}</span>`
    + `</li>`;
  const areaRail = areaMixRows.length
    ? `<ul class="tfacts">${areaMixRows.map(([a, n]) => `<li><span class="tf-k">${esc((areaById[a] || {}).name || a)}</span><span class="tf-v">${n}</span></li>`).join("")}</ul>`
    : "";
  // London-office profile panel (approx lawyer headcount, revenue, PEP, main
  // London practice areas + sources) — the Legal analogue of the hedge-fund facts.
  const L = firm.london;
  const londonRail = L ? `<section class="tpanel"><header class="tpanel-h"><span>London office</span>${L.lawyersAsOf ? `<span class="tpanel-x">as of ${esc(String(L.lawyersAsOf))}</span>` : ""}</header>`
    + `<ul class="tfacts">`
    + `<li><span class="tf-k">London lawyers</span><span class="tf-v">${L.lawyers != null ? esc(String(L.lawyers)) : "—"}</span></li>`
    + `<li><span class="tf-k">Total revenue</span><span class="tf-v">${L.revenue != null ? esc(lfMoney(L.revenue, L.revenueBasis)) : "—"}${L.revenueBasis ? ` <span class="tf-est">${esc(L.revenueBasis)}</span>` : ""}</span></li>`
    + `<li><span class="tf-k">London revenue</span><span class="tf-v">${L.revenueLondon != null ? esc(lfMoney(L.revenueLondon, L.revenueLondonBasis)) : "—"}${L.revenueLondonBasis ? ` <span class="tf-est">${esc(L.revenueLondonBasis)}</span>` : ""}</span></li>`
    + `<li><span class="tf-k">PEP</span><span class="tf-v">${L.pep != null ? esc(lfPep(L.pep, L.pepBasis)) : "—"}${L.pepBasis ? ` <span class="tf-est">${esc(L.pepBasis)}</span>` : ""}</span></li>`
    + `<li><span class="tf-k">Tier</span><span class="tf-v">${esc(tierLabel(firm.tier))}</span></li>`
    + `</ul>`
    + (L.areas && L.areas.length ? `<div class="tdet-chips" style="padding:8px 12px 10px">${L.areas.map((a) => `<span class="tdet-chip">${esc(a)}</span>`).join("")}</div>` : "")
    + `</section>` : "";
  // Peers: nearest London firms by practice-area overlap + tier + size (headcount) —
  // a collapsible header dropdown, matching the manager/HF/LP profiles.
  const firmPeers = peersOf(firm, firms, { tags: (x) => (x.london && x.london.areas) || [], cat: (x) => x.tier, size: (x) => (x.london && x.london.lawyers) || null, n: 5 });
  const firmPeersDetails = peerDetails(firmPeers, (e) => `#/firm/${encodeURIComponent(e.id)}`, (p) => {
    const n = p.e.london && p.e.london.lawyers;
    return [tierLabel(p.e.tier), n ? `${n} London lawyers` : ""].filter(Boolean).join(" · ");
  }, esc);

  // ---- One chip-filtered wire (matches the dashboard chips): All / Alerts /
  // Matters. "Matters" = everything the firm worked on or is named in — its
  // restructuring-analysis matters, cases/schemes/plans naming it, and credit-
  // wire deals naming it (loaded lazily below). "Alerts" = its own alerts.
  const matterRows = [...firmRx.map(rxRow), ...inv];
  let dealRows = null; // null = credit wire still loading
  let creditRows = null; // null = still loading — the firm's credit deals (lens)
  const pcDeals = (firm.pcDeals || []).slice().sort(byDateDesc);
  let firmTab = tab0 || _chipMem[chipMemKey("firm-chips")] || "all";
  if (!["all", "alerts", "matters", "credit", "deals", "office"].includes(firmTab)) firmTab = "all";
  // Lens filters (practice · region), remembered per firm for the session.
  const lensMem = _lensMem[id] || (_lensMem[id] = { prac: "", reg: "" });
  let expanded = false; // "See all" pressed on the current list
  const emptyRow = (t) => `<li class="tw-empty muted small">${t}</li>`;
  const alertRows = firmAlerts.map((it) => ({ date: it.date || "", html: alertWireRow(it), prac: itemPractices(it), reg: itemRegions(it) }));
  const wireRows = () => {
    const matters = [...matterRows, ...(dealRows || [])].map((x) => ({ date: x.date || "", html: invRow(x), prac: x.prac || [], reg: x.reg || [] }));
    return (firmTab === "alerts" ? alertRows : firmTab === "matters" ? matters : [...alertRows, ...matters]);
  };
  const passes = (r, prac, reg) => (!prac || r.prac.includes(prac)) && (!reg || r.reg.includes(reg));
  // 10-row preview + "See all N ›" (R40e / R41j) — renders the rest in place.
  const PREVIEW = 10;
  const moreBtn = (n) => n > PREVIEW && !expanded ? `<button type="button" class="lf-more" data-more="1">See all ${n} ›</button>` : "";
  const renderFilters = () => {
    const bar = $id("firm-filt"); if (!bar) return;
    const onWire = !["credit", "deals", "office"].includes(firmTab);
    bar.hidden = !onWire;
    if (!onWire) return;
    const rows = wireRows();
    const opt = (k, l, n, cur) => `<option value="${k}"${k === cur ? " selected" : ""}${n || k === cur ? "" : " disabled"}>${esc(l)}${k ? ` (${n})` : ""}</option>`;
    const pracOpts = [opt("", "All practices", rows.length, lensMem.prac), ...PRACTICES.map(([k, l]) => opt(k, l, rows.filter((r) => passes(r, k, lensMem.reg)).length, lensMem.prac))].join("");
    const regOpts = [opt("", "All regions", rows.length, lensMem.reg), ...LENS_REGIONS.map(([k, l]) => opt(k, l, rows.filter((r) => passes(r, lensMem.prac, k)).length, lensMem.reg))].join("");
    bar.innerHTML = `<select class="lf-sel${lensMem.prac ? " is-on" : ""}" data-f="prac" aria-label="Practice">${pracOpts}</select>`
      + `<select class="lf-sel${lensMem.reg ? " is-on" : ""}" data-f="reg" aria-label="Region">${regOpts}</select>`
      + (lensMem.prac || lensMem.reg ? `<button type="button" class="lf-clear" data-clear="1">Clear</button>` : "");
  };
  const renderFirmWire = () => {
    const list = $id("firm-wire"); if (!list) return;
    const more = $id("firm-wire-more");
    renderFilters();
    if (firmTab === "deals") {
      list.innerHTML = pcDeals.length ? pcDeals.map(pcDealRow).join("")
        : emptyRow("No private-capital deals recorded for this firm's London office in the last 12 months.");
      if (more) more.innerHTML = "";
      return;
    }
    const rows = wireRows().filter((r) => passes(r, lensMem.prac, lensMem.reg)).sort(byDateDesc);
    const shown = expanded ? rows : rows.slice(0, PREVIEW);
    list.innerHTML = shown.length ? shown.map((r) => r.html).join("")
      : emptyRow(lensMem.prac || lensMem.reg ? "Nothing tracked for this firm matches these filters."
        : firmTab === "alerts" ? "No alerts tracked from this firm yet."
        : firmTab === "matters" ? "No tracked matter, case, scheme, plan or deal names this firm yet."
        : "Nothing tracked for this firm yet.");
    if (more) more.innerHTML = moreBtn(rows.length);
  };
  // ---- Credit deals (lens): deals this firm advised on, with the side it acted for.
  // R43: the shared events row — date · deal · side tag · source, then amount · lender.
  const creditRow = (c) => `<li class="lf-deal g-ev" data-side="${c.side}" title="${esc([c.title, SIDE_LABEL[c.side], c.amount, c.lender].filter(Boolean).join(" · "))}">`
    + `<span class="c-date">${c.date ? pcDate(c.date) : ""}</span>`
    + `<span class="g-ev-t lf-deal-t">${c.href ? `<a href="${esc(c.href)}"${c.ext ? ` target="_blank" rel="noopener noreferrer"` : ""}>${esc(c.title)}</a>` : esc(c.title)}</span>`
    + `<span class="c-tag"><span class="dsh-tag lf-side lf-side-${c.side}">${esc(SIDE_LABEL[c.side])}</span></span>`
    + `<span class="c-src">${c.src ? `<a class="lf-src" href="${esc(c.src)}" target="_blank" rel="noopener noreferrer">${esc(c.srcLabel || "source")}</a>` : ""}</span>`
    + `<span class="g-ev-m lf-deal-m">${[c.amount ? esc(c.amount) : "", c.lender ? esc(c.lender) : ""].filter(Boolean).join(" · ")}</span></li>`;
  const renderCredit = () => {
    const list = $id("firm-credit"); if (!list) return;
    const more = $id("firm-credit-more");
    if (!creditRows) { list.innerHTML = emptyRow("Loading credit deals…"); return; }
    const shown = expanded ? creditRows : creditRows.slice(0, PREVIEW);
    list.innerHTML = shown.length ? shown.map(creditRow).join("") : emptyRow("No tracked credit deal names this firm as an adviser yet.");
    if (more) more.innerHTML = moreBtn(creditRows.length);
  };
  // ---- At-a-glance strip: alerts (90d) · credit deals · lender-side % · top counterparties.
  const alerts90 = firmAlerts.filter((i) => { const t = Date.parse(i.date); return t && Date.now() - t <= 90 * 864e5; }).length;
  const renderGlance = () => {
    const g = $id("firm-glance"); if (!g) return;
    const cell = (k, v, sub) => `<div class="lf-g"><span class="lf-g-k">${esc(k)}</span><span class="lf-g-v">${v}</span>${sub ? `<span class="lf-g-s">${sub}</span>` : ""}</div>`;
    const cr = creditRows || [];
    const sided = cr.filter((c) => c.side !== "unknown"), lend = sided.filter((c) => c.side === "lender").length;
    const cps = {};
    cr.forEach((c) => { if (c.lender) cps[c.lender] = (cps[c.lender] || 0) + 1; });
    const top = Object.entries(cps).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 3);
    g.innerHTML = cell("Alerts 90d", String(alerts90))
      + cell("Credit deals", creditRows ? String(cr.length) : "…")
      + cell("Lender side", !creditRows ? "…" : sided.length ? `${Math.round((lend / sided.length) * 100)}%` : "—", creditRows && sided.length ? `${lend} of ${sided.length} sided` : "")
      + cell("Top counterparties", !creditRows ? "…" : top.length ? top.map(([n, k]) => `${esc(n)} <span class="lf-g-n">${k}</span>`).join(" · ") : "—", top.length ? "lenders on its deals" : "");
  };

  // Same layout as the manager / hedge-fund pages: identity header, then a section rail
  // — All · Alerts · Matters · PC deals (one filtered wire) · Office (London facts and
  // the practice-area mix).
  const officePane = (londonRail || "")
    + (areaRail ? `<section class="tpanel"><header class="tpanel-h"><span>Practice areas</span><span class="tpanel-x">alerts</span></header>${areaRail}</section>` : "")
    || `<p class="tw-empty muted small">No London-office figures on file.</p>`;
  const lawyers = L && L.lawyers != null ? ` · ${esc(String(L.lawyers))} London lawyers` : "";
  app.innerHTML = `
    <div class="tdash">
      ${sectionNav("firms")}
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full tdet-tabbed">
          <div class="tdet-id">
            <h1>${nameCell("firm", firm.id, esc(firm.name))}</h1>
            <div class="tdet-sub">${esc(tierLabel(firm.tier))}${lawyers}</div>
            ${latestLine([...firmAlerts, ...matterRows])}
            ${firmPeersDetails}
            <div class="tdet-src"><span class="lbl">Insights:</span> ${(firm.insightsUrl && firm.insightsUrl !== "#") ? `<a href="${esc(firm.insightsUrl)}" target="_blank" rel="noopener noreferrer">${esc(firm.name)} — insights / know-how</a>` : `<span>${esc(firm.name)} — insights / know-how</span>`}</div>
          </div>
          <header class="tpanel-h twire-head">
            <div class="tchips" id="firm-chips">${[["all", "All"], ["alerts", firmAlerts.length ? `Alerts ${firmAlerts.length}` : "Alerts"], ["matters", "Matters"], ["credit", `Credit deals<span class="lf-cn" id="firm-credit-n"></span>`], ["deals", pcDeals.length ? `PC deals ${pcDeals.length}` : "PC deals"], ["office", "Office"]]
              .map(([k, l]) => `<button type="button" class="tchip${k === firmTab ? " is-on" : ""}" data-k="${k}">${l}</button>`).join("")}</div>
          </header>
          <div class="tpanes" id="firm-panes">
            <div class="lf-glance" id="firm-glance"></div>
            <div class="tpane" data-p="wire"><div class="lf-filt" id="firm-filt" hidden></div><ul class="twire compact-list" id="firm-wire"></ul><div class="lf-more-w" id="firm-wire-more"></div></div>
            <div class="tpane" data-p="credit"><ul class="lf-deals" id="firm-credit"></ul><div class="lf-more-w" id="firm-credit-more"></div></div>
            <div class="tpane" data-p="office">${officePane}</div>
          </div>
        </section>
      </div>
    </div>
  `;
  const paneOf = (t) => (t === "office" || t === "credit" ? t : "wire");
  const showFirmPane = () => (app.querySelectorAll("#firm-panes > .tpane") || []).forEach((el) => { el.hidden = el.dataset.p !== paneOf(firmTab); });
  const renderAll = () => { renderFirmWire(); renderCredit(); renderGlance(); };
  showFirmPane();
  renderAll();
  const chips = $id("firm-chips");
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".tchip"); if (!b) return;
    firmTab = b.dataset.k;
    expanded = false;
    _chipMem[chipMemKey("firm-chips")] = firmTab || "all";
    // Record the tab in the URL (replace, not push) — see tabUrl in credit/detail.js.
    if (profilesMode) {
      const h = `#/firm/${encodeURIComponent(id)}` + (firmTab && firmTab !== "all" ? "/" + firmTab : "");
      if (location.hash.split("?")[0] !== h) { try { history.replaceState(history.state, "", location.pathname + location.search + h); } catch { /* keep */ } }
    }
    chips.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    showFirmPane();
    renderFirmWire();
    renderCredit();
  });
  const panes = $id("firm-panes");
  panes.addEventListener("change", (e) => {
    const s = e.target.closest(".lf-sel"); if (!s) return;
    lensMem[s.dataset.f] = s.value;
    expanded = false;
    renderFirmWire();
  });
  panes.addEventListener("click", (e) => {
    if (e.target.closest("[data-clear]")) { lensMem.prac = ""; lensMem.reg = ""; expanded = false; renderFirmWire(); return; }
    if (e.target.closest("[data-more]")) { expanded = true; renderFirmWire(); renderCredit(); }
  });

  // Credit-wire deals/fundraising naming this firm fold into "Matters" (and
  // "All") once the lazily-loaded credit data arrives; if it can't load, the
  // page simply shows the legal-side rows. The same load builds the lens's
  // Credit deals: deals deal-advisers.js names this firm on (its own announcement
  // or the deal's sourced text) plus the firm's own announced financings.
  Promise.all([
    import("/credit/js/data.js"), import("../deal-advisers.js"), import("../deal-parse.js"),
    import("/credit/js/tx.js"), import("/credit/js/deal-tags.js"),
  ]).then(([{ deals, intel, managers }, { advisersFor }, { dealCounterparty, dealSponsor }, { amountOf, fmtAmt, regionOf, tagsOf, sizeCounts }, { DEAL_TAGS }]) => {
    const mgr = (mid) => (managers.find((m) => m.id === mid) || {}).name || "";
    const dealReg = (d) => { const c = (DEAL_TAGS[d.id] || {}).country; return dealRegion(c, regionOf(c)); };
    dealRows = [...(deals || []), ...(intel || [])]
      .filter((d) => firmMentioned(firm, recText(d)))
      .map((d) => ({
        date: d.date, tag: "deal", code: d.clo ? "CLO" : (d.headline ? "DEAL" : "INTEL"),
        title: d.headline || d.title || "", ext: !!d.sourceUrl,
        href: d.sourceUrl || (d.managerId ? `/v2/profiles/#/manager/${encodeURIComponent(d.managerId)}` : "/v2/profiles/"),
        meta: mgr(d.managerId),
        // The manager the deal belongs to links to its profile (in-app), alongside the
        // headline's external source.
        metaHref: d.managerId && mgr(d.managerId) ? `#/manager/${encodeURIComponent(d.managerId)}` : "",
        prac: ["finance"], reg: d.headline ? dealReg(d) : [],
      }));

    const aliases = firmAliases(firm, FIRM_ALIASES[id] || []);
    // Only this firm's advising announcements can make it an adviser by "alert" basis.
    const legal = { items: firmAlerts, firmById };
    const cr = [];
    for (const d of deals || []) {
      if (!d || !d.date) continue;
      const lender = mgr(d.managerId);
      const cp = dealCounterparty(d, lender) || "";
      const advs = advisersFor(d, cp, legal).filter((a) => adviserIsFirm(a.firm, firm, aliases));
      if (!advs.length) continue;
      const a = advs.find((x) => x.basis === "alert") || advs[0];
      const side = adviserSide(a, d, aliases, { lender, borrower: cp, sponsor: dealSponsor(d) || "" });
      // Only a deal size counts as "the amount" (an EV / AUM figure is not — R39b).
      const amt = sizeCounts(tagsOf(d, DEAL_TAGS)) ? amountOf(d) : null;
      const srcName = creditSource(d) || "source";
      cr.push({
        id: d.id, date: d.date, title: d.headline || cp || "—", side, lender,
        amount: amt ? fmtAmt(amt) : "",
        href: `/v2/transactions/#/deal/${encodeURIComponent(d.id)}`, ext: false,
        src: a.basis === "alert" ? a.url : d.sourceUrl, srcLabel: a.basis === "alert" ? "firm announcement" : srcName === lender ? "lender release" : srcName,
      });
    }
    const seenUrl = new Set(cr.map((c) => c.src).filter(Boolean));
    for (const p of pcDeals) {
      if (!pcDealIsCredit(p) || (p.url && seenUrl.has(p.url))) continue;
      cr.push({ id: p.id, date: p.date, title: p.parties, side: pcDealSide(p), lender: "", amount: p.value || "", href: "", ext: false, src: p.url || "", srcLabel: "firm announcement" });
    }
    creditRows = cr.sort(byDateDesc);
    const n = $id("firm-credit-n"); if (n) n.textContent = creditRows.length ? " " + creditRows.length : "";
    renderAll();
  }).catch(() => { dealRows = dealRows || []; creditRows = creditRows || []; renderAll(); });
}
