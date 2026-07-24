// AUTO-PORTED from credit/js/detail.js — settable host (__setHost) instead of a
// global #app capture; render code verbatim.

// =============================================================================
// credit/js/detail.js — the deep detail views: Fund, Manager, CLO and Investor
// profiles (the terminal "tdash" layout). Extracted from app.js, which routes to
// them via viewFund/viewManager/viewClo/viewLp. Imports flow
// app.js -> detail.js -> shared.js (never backwards) so the graph stays acyclic.
// NOTE: keep the ./data.js ?v= token identical to app.js / shared.js (see the
// shared.js header) or the browser loads data.js twice as separate instances.
// =============================================================================
import {
  managerById, fundById, lpById, funds, lps, intel, deals,
  fundsByManager, intelForFund, dealsForFund, dealsForManager, intelForManager,
  HEDGE_FUNDS,
} from "/credit/js/data.js?v=20260724-4";
import { esc } from "/util.js?v=20260719-1";
import {
  eur, pct, fmtDate, link, sources, raiseDisplay, nameCell, saveBtn, newsSaveId,
  metaDate, notFound, applyPendingFocus, commitmentsForLp, commitmentsForManager,
  investorsForFund, pageList, feedDedupKey, creditSource, intelRow, dealRow,
  _chipMem, chipMemKey,
} from "/credit/js/shared.js?v=20260724-2";

export let app = null;
export function __setHost(h) { app = h; }

// Indicative NET target IRR ranges by strategy — market-typical conventions, NOT
// a specific fund's disclosed target. Used only where a fund discloses no target.
const STRATEGY_IRR = {
  "Senior Direct Lending": "8–10%",
  "Unitranche": "9–12%",
  "Mezzanine / Junior Debt": "12–15%",
  "Distressed & Special Situations": "15–20%+",
  "Structured Credit / CLO": "12–16%",
  "Real Estate Debt": "7–10%",
  "Infrastructure Debt": "6–9%",
  "Asset-Based Lending": "8–12%",
  "Opportunistic Credit": "10–14%",
  "NAV / Fund Finance": "8–12%",
};

// Small reusable terminal rail panel.
function railPanel(title, meta, body) {
  return `<section class="tpanel"><header class="tpanel-h"><span>${title}</span>${meta ? `<span class="tpanel-x">${meta}</span>` : ""}</header>${body}</section>`;
}

// The Credit desk's section chips (the same set the dashboard shows). Rendered at
// the top of every detail view so you navigate the desk the same way from a
// profile as from the dashboard: each chip jumps straight to that section
// (dashboard ?tab= is seeded from the link). `all` has no param (bare dashboard).
const CR_SECTIONS = [["all", "All"], ["deals", "Deals"], ["fundraising", "Fundraising"], ["managers", "Managers"], ["hedgefunds", "Hedge Funds"]];
const crSecHref = (k) => k === "all" ? "#/" : "#/?tab=" + k;
// `parts` is kept for call-site compatibility; the first linked crumb's label
// tells us which section this profile lives under, so that chip reads active.
function breadcrumb(parts) {
  const parentLabel = (parts.filter((p) => p[0])[0] || [null, ""])[1];
  const active = { Managers: "managers", Funds: "fundraising", "Hedge Funds": "hedgefunds" }[parentLabel] || "all";
  return `<header class="tpanel-h twire-head tdet-secnav"><div class="tchips">${CR_SECTIONS
    .map(([k, l]) => `<a class="tchip${k === active ? " is-on" : ""}" href="${esc(crSecHref(k))}">${esc(l)}</a>`).join("")}</div></header>`;
}

// Generic in-place wire filter: chips toggle which kinds (data-kind) show,
// without leaving the screen. Shared by the dashboard and terminal detail pages.
function wireSimpleChips(chipsId, wireId) {
  const chips = document.getElementById(chipsId);
  const wire = document.getElementById(wireId);
  if (!chips || !wire) return;
  const KEY = chipMemKey(chipsId);
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".tchip");
    if (!b) return;
    chips.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    const k = b.dataset.k;
    _chipMem[KEY] = k || "all";
    wire.querySelectorAll(".tw-row").forEach((r) => { r.style.display = (k === "all" || r.dataset.kind === k) ? "" : "none"; });
  });
  // In-page selection survives the async-sync re-renders (All is hardcoded
  // active in the templates).
  {
    const k0 = _chipMem[KEY];
    const b0 = k0 && k0 !== "all" ? chips.querySelector(`.tchip[data-k="${k0}"]`) : null;
    if (b0 && !b0.classList.contains("is-on")) b0.click();
  }
}

// Shared terminal wire row for credit detail pages (manager / fund / CLO). Builds
// one dense line — date · CODE · headline (+ optional inline entity) · source —
// from a feed item tagged with _kind (deal / intel / news). data-fkey (news) or
// id="row-<id>" (structured) preserve the notification deep-link focus.
const CR_KIND = { deal: "DEAL", intel: "FUND", news: "NEWS" };
function crWireRow(x, inline) {
  const isNews = x._kind === "news";
  const title = isNews ? x.title : x.headline;
  const src = isNews ? (x.outlet || "") : creditSource(x);
  const url = isNews ? x.url : x.sourceUrl;
  const head = isNews
    ? `<a href="${esc(url || "#")}"${url ? ' target="_blank" rel="noopener noreferrer"' : ""} class="tw-head">${esc(title)}</a>`
    : `<a href="#/${x._kind === "deal" ? "deals" : "intel"}" data-goto="${x._kind === "deal" ? "deals" : "intel"}:${x.id}" class="tw-head">${esc(title)}</a>`;
  return `<li class="compact-item tw-row" data-kind="${x._kind}"${isNews ? ` data-fkey="${esc(feedDedupKey(x))}"` : ` id="row-${esc(x.id)}"`}>`
    + `<span class="tw-date">${x.date ? esc(fmtDate(x.date)) : ""}</span>`
    + `<span class="tw-tag ${x._kind}">${CR_KIND[x._kind]}</span>`
    + `<span class="tw-body">${head}${inline ? `<span class="tw-mgr-w">${inline}</span>` : ""}</span>`
    + `<span class="tw-src">${url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(src || "source")}</a>` : esc(src || "")}</span>`
    + `</li>`;
}

// ================================== FUNDS ===================================
// Indicative LP fit — shown while a fund is raising (open / first close / evergreen).
// Explicitly NOT confirmed commitments.
function potentialFitCard(x) {
  const interestedLps = lps.filter((l) => l.strategies.includes(x.strategy) && l.mandateStatus !== "Not currently active");
  return `<section class="card">
    <h2>Potential investor fit <span class="muted">(${interestedLps.length})</span></h2>
    <p class="muted small">LPs whose stated interests include ${esc(x.strategy)} — indicative fit while the fund is open, not confirmed commitments.</p>
    <ul class="link-list">
      ${interestedLps.slice(0, 6).map((l) => `<li>${link(`#/lp/${l.id}`, l.name)} <span class="muted small">${esc(l.type)} · ${l.typicalTicket != null ? eur(l.typicalTicket) + " typical ticket" : "ticket undisclosed"}</span></li>`).join("") || '<li class="muted">No active LPs flagged.</li>'}
    </ul>
  </section>`;
}

// Actual, publicly-disclosed investors — shown for funds that have reached final
// close (and evergreen funds). Honest empty-state when no LPs are public.
function actualInvestorsCard(x) {
  const inv = investorsForFund(x);
  const body = inv.length
    ? `<ul class="link-list">${inv.map((i) => `<li>${i.lpId ? link(`#/lp/${i.lpId}`, i.name) : `<strong>${esc(i.name)}</strong>`}${i.note ? ` <span class="muted small">— ${esc(i.note)}</span>` : ""}${i.url ? ` · <a href="${esc(i.url)}" target="_blank" rel="noopener noreferrer" class="muted small">source</a>` : ""}</li>`).join("")}</ul>`
    : `<p class="muted small">No specific LP commitments to this fund have been disclosed publicly. (Most private funds do not name investors; where cornerstone/anchor LPs are announced — e.g. public pensions, the EIF / British Business Bank, sovereign wealth funds — they are listed here with sources.)</p>`;
  return `<section class="card"><h2>Investors <span class="muted">(${inv.length})</span></h2>
    <p class="muted small">Limited partners publicly disclosed as having committed to this fund.</p>${body}</section>`;
}

// ---- Data provenance & completeness -----------------------------------------
// Honest, at-a-glance view of WHICH data points are disclosed for a fund, which
// are estimates/indicative, and which are simply not public — so gaps are
// explicit rather than hidden. States: yes (disclosed) · est (estimate) ·
// indicative (strategy proxy, not this fund's figure) · no (gap) · na (n/a).
function dataDimensions(x) {
  const inv = investorsForFund(x);
  const notable = (x.notableInvestments || []).length;
  return [
    { key: "Fundraising target",
      state: x.evergreen ? "na" : (x.targetSize != null ? "yes" : "no"),
      detail: x.evergreen ? "evergreen — no fixed target" : (x.targetSize != null ? eur(x.targetSize) + " target" : "target not disclosed") },
    { key: x.evergreen ? "Current AUM/NAV" : "Amount raised",
      state: x.raised != null ? "yes" : "no",
      detail: x.raised != null ? eur(x.raised) : "not disclosed" },
    { key: "Deployment",
      state: x.evergreen ? "na" : (x.deployedPct != null ? (x.deployedEstimated ? "est" : "yes") : "no"),
      detail: x.evergreen ? "rolling (evergreen)" : (x.deployedPct != null ? `${x.deployedPct}% invested${x.deployedEstimated ? " (est.)" : ""}${x.deployedAsOf ? ` · as of ${x.deployedAsOf}` : ""}` : "not separately disclosed") },
    { key: "Target IRR",
      state: x.targetIRR ? "yes" : "indicative",
      detail: x.targetIRR ? `${x.targetIRR.range}${x.targetIRR.basis ? " " + x.targetIRR.basis : ""} — disclosed` : `${STRATEGY_IRR[x.strategy] || "—"} — indicative strategy range, not this fund's figure` },
    { key: "Actual performance",
      state: x.performance ? "yes" : "no",
      detail: x.performance ? "net IRR / multiples disclosed" : "not publicly disclosed" },
    { key: "Named investors",
      state: inv.length ? "yes" : "no",
      detail: inv.length ? `${inv.length} disclosed` : "none publicly disclosed" },
    { key: "Notable investments",
      state: notable ? "yes" : "no",
      detail: notable ? `${notable} compiled` : "none compiled / disclosed" },
  ];
}
// Disclosed = hard facts (yes) + flagged estimates (est). Indicative/no/na are not
// counted as disclosed; na is excluded from the denominator (not applicable).
function completeness(x) {
  const dims = dataDimensions(x);
  const applicable = dims.filter((d) => d.state !== "na");
  const disclosed = applicable.filter((d) => d.state === "yes" || d.state === "est");
  return { disclosed: disclosed.length, total: applicable.length, gaps: applicable.filter((d) => d.state === "no" || d.state === "indicative").map((d) => d.key) };
}
// Compact inline meter for tables/headers; tooltip spells out the gaps.
function completenessPill(x) {
  const c = completeness(x);
  const lvl = c.disclosed / c.total;
  const cls = lvl >= 0.66 ? "dm-hi" : lvl >= 0.34 ? "dm-mid" : "dm-lo";
  const title = c.gaps.length ? `Not disclosed: ${c.gaps.join(", ")}` : "All tracked data points disclosed";
  return `<span class="data-meter ${cls}" title="${esc(title)}"><span class="dm-bar"><span class="dm-fill" style="width:${Math.round(lvl * 100)}%"></span></span>${c.disclosed}/${c.total} data</span>`;
}
const STATE_ICON = { yes: "✓", est: "~", indicative: "~", no: "—", na: "·" };
const STATE_LABEL = { yes: "Disclosed", est: "Estimate", indicative: "Indicative", no: "Not disclosed", na: "N/A" };

export function viewFund(id) {
  const x = fundById[id];
  if (!x) return notFound(app);
  const m = managerById[x.managerId];
  const related = intelForFund(id);
  const peers = funds.filter((p) => p.strategy === x.strategy && p.id !== id).slice(0, 5);
  // While raising (open/first close/pre-marketing) or evergreen → indicative fit.
  // At final close (and for evergreen) → actual disclosed investor list.
  const showPotential = x.evergreen || x.status === "Open" || x.status === "First Close" || x.status === "Pre-marketing";
  const hasActualInvestors = investorsForFund(x).length > 0;
  const investorCard = showPotential ? potentialFitCard(x) : actualInvestorsCard(x);
  // Evergreen funds show both; a still-raising fund also shows actual investors if any are disclosed.
  const extraInvestorCard = (x.evergreen || (showPotential && hasActualInvestors)) ? actualInvestorsCard(x) : "";

  // Combined, date-sorted activity wire for this fund: fundraising intel + deals.
  const fdeals = dealsForFund(x.id);
  const fundFeed = [
    ...related.map((i) => ({ ...i, _kind: "intel" })),
    ...fdeals.map((d) => ({ ...d, _kind: "deal" })),
  ].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  const inv = investorsForFund(x);
  const interestedLps = lps.filter((l) => l.strategies.includes(x.strategy) && l.mandateStatus !== "Not currently active");
  // The manager is the natural inline entity on a fund's activity rows.
  const fundWireRow = (i) => crWireRow(i, `<a href="#/manager/${m.id}" class="tw-mgr">${esc(m.name)}</a>`);

  const raisedLabel = x.evergreen ? "AUM/NAV" : "Raised";
  const metrics = [
    [x.evergreen ? "AUM" : "Target", x.evergreen ? (x.raised != null ? eur(x.raised) : "—") : eur(x.targetSize)],
    [raisedLabel, eur(x.raised)], ["Vintage", x.vintage], ["Status", esc(x.status)],
    ["Investors", inv.length], ["Deals", fdeals.length],
  ];
  // Rail: fundraising facts, deployment, returns, investors, notable, peers, provenance.
  const facts = [
    ["Target size", x.evergreen ? "Evergreen" : eur(x.targetSize)],
    ["Hard cap", eur(x.hardCap)],
    [x.evergreen ? "Current AUM/NAV" : "Raised to date", eur(x.raised)],
    ["Sector focus", esc(x.sectorFocus || "—")],
    ["Domicile", esc(x.domicile)],
    ["Geography", esc(x.geoFocus || "—")],
  ];
  const factsRail = `<ul class="tfacts">${facts.map(([k, v]) => `<li><span class="tf-k">${k}</span><span class="tf-v">${v}</span></li>`).join("")}</ul>`;
  const ti = x.targetIRR;
  const perf = x.performance;
  const irrLine = ti ? `${esc(ti.range)}${ti.basis ? " " + esc(ti.basis) : ""} <span class="tf-est">disclosed</span>` : `${esc(STRATEGY_IRR[x.strategy] || "—")} <span class="tf-est">indicative</span>`;
  const returnsRail = `<ul class="tfacts"><li><span class="tf-k">Target IRR</span><span class="tf-v">${irrLine}</span></li>`
    + (perf && perf.netIRR != null ? `<li><span class="tf-k">Net IRR</span><span class="tf-v">${perf.netIRR}%</span></li>` : "")
    + (perf && perf.grossIRR != null ? `<li><span class="tf-k">Gross IRR</span><span class="tf-v">${perf.grossIRR}%</span></li>` : "")
    + (perf && perf.moic != null ? `<li><span class="tf-k">MOIC</span><span class="tf-v">${perf.moic}x</span></li>` : "")
    + (perf && perf.dpi != null ? `<li><span class="tf-k">DPI</span><span class="tf-v">${perf.dpi}x</span></li>` : "")
    + (!perf ? `<li><span class="tf-k">Performance</span><span class="tf-v">n/d</span></li>` : "")
    + `</ul>`;
  const investorsRail = inv.length
    ? `<ul class="tmini">${inv.map((i) => `<li class="tmini-row${i.lpId ? " clickable" : ""}"${i.lpId ? ` data-href="#/lp/${i.lpId}"` : ""}><span class="tmini-t">${esc(i.name)}</span>${i.note ? `<span class="tmini-m">${esc(i.note)}</span>` : ""}</li>`).join("")}</ul>`
    : (showPotential && interestedLps.length
      ? `<ul class="tmini">${interestedLps.slice(0, 8).map((l) => `<li class="tmini-row clickable" data-href="#/lp/${l.id}"><span class="tmini-t">${esc(l.name)}<span class="tmini-r">${l.typicalTicket != null ? eur(l.typicalTicket) : ""}</span></span><span class="tmini-m">${esc(l.type)} · indicative fit</span></li>`).join("")}</ul>`
      : `<p class="tw-empty muted small">No LP commitments publicly disclosed.</p>`);
  const investorsTitle = inv.length ? "Investors" : (showPotential && interestedLps.length ? "Potential investor fit" : "Investors");
  const investorsCount = inv.length || (showPotential ? interestedLps.length : 0);
  const notable = x.notableInvestments || [];
  const notableRail = notable.length
    ? `<ul class="tmini">${notable.map((n) => `<li class="tmini-row">${n.url ? `<a class="tmini-t" href="${esc(n.url)}" target="_blank" rel="noopener noreferrer">${esc(n.name)}</a>` : `<span class="tmini-t">${esc(n.name)}</span>`}${n.note ? `<span class="tmini-m">${esc(n.note)}</span>` : ""}</li>`).join("")}</ul>`
    : "";
  const peersRail = peers.length
    ? `<ul class="tmini">${peers.map((pp) => `<li class="tmini-row clickable" data-href="#/fund/${pp.id}"><span class="tmini-t">${esc(pp.name)}</span><span class="tmini-m">${esc(managerById[pp.managerId].name)} · ${esc(pp.status)}</span></li>`).join("")}</ul>`
    : "";
  const provRail = `<ul class="tfacts">${dataDimensions(x).map((d) => `<li><span class="tf-k">${STATE_ICON[d.state]} ${esc(d.key)}</span><span class="tf-v">${esc(String(d.detail).replace(/\s*—.*$/, "")) || esc(STATE_LABEL[d.state])}</span></li>`).join("")}</ul>`;

  app.innerHTML = `
    <div class="tdash">
      ${breadcrumb([["#/funds", "Funds"], [null, x.name]])}
      <div class="tdash-ticker">${metrics.map(([l, v]) => `<span class="tmet"><b>${v}</b> ${esc(l)}</span>`).join("")}</div>
      <div class="tdash-grid tdash-2">
        <section class="tcol tcol-c">
          <div class="tdet-id">
            <h1>${nameCell("fund", x.id, esc(x.name))}</h1>
            <div class="tdet-sub">${link(`#/manager/${m.id}`, m.name)} · ${esc(x.domicile)} · Vintage ${x.vintage}</div>
            ${x.description ? `<p class="tdet-desc">${esc(x.description)}</p>` : ""}
            <div class="tdet-chips"><span class="tdet-chip">${esc(x.strategy)}</span><span class="tdet-chip">${esc(x.status)}</span>${x.geoFocus ? `<span class="tdet-chip">${esc(x.geoFocus)}</span>` : ""}${x.lifecycle ? `<span class="tdet-chip">${esc(typeof x.lifecycle === "string" ? x.lifecycle : x.lifecycle.status)}</span>` : ""}</div>
            <div class="tdet-src">Data as of ${esc(x.asOf || "—")} · ${completenessPill(x)}</div>
            ${(x.sources && x.sources.length) ? `<div class="tdet-src">${sources(x)}</div>` : ""}
          </div>
          <header class="tpanel-h twire-head">
            <div class="tchips" id="fd-chips">
              <button type="button" class="tchip is-on" data-k="all">All</button>
              <button type="button" class="tchip" data-k="intel">Fundraising</button>
              <button type="button" class="tchip" data-k="deal">Deals</button>
            </div>
          </header>
          <ul class="twire compact-list" id="fd-wire">${fundFeed.length ? fundFeed.map(fundWireRow).join("") : '<li class="muted small tw-empty">No activity linked to this fund yet.</li>'}</ul>
        </section>
        <aside class="tcol tcol-r">
          ${railPanel("Fundraising", "", `<div class="tfd-raise">${raiseDisplay(x)}</div>${factsRail}`)}
          ${railPanel("Target & performance", "", returnsRail)}
          ${railPanel(investorsTitle, investorsCount ? String(investorsCount) : "", investorsRail)}
          ${notableRail ? railPanel("Notable investments", String(notable.length), notableRail) : ""}
          ${peersRail ? railPanel("Peer funds", esc(x.strategy), peersRail) : ""}
          ${railPanel("Data completeness", "", provRail)}
        </aside>
      </div>
    </div>`;
  wireSimpleChips("fd-chips", "fd-wire");
  applyPendingFocus("intel");
}

// ================================ MANAGERS ==================================
// A short, strong AUM figure for the compact profile tile: pull the leading
// currency figure out of the (often descriptive) aumText — e.g. "c. €2.5bn AUM
// (firm website); ~€2.2bn across the funds" → "€2.5bn". Falls back to the numeric
// aum, then a dash. Full aumText still shows on hover (title) and in Finances.
function aumHeadline(m) {
  const t = String(m.aumText || "");
  const hit = t.match(/[~<>]?\s*(?:c\.\s*)?[€$£]\s*\d[\d.,]*\s*(?:tn|bn|billion|m|million)?\+?/i);
  if (hit) return hit[0].replace(/c\.\s*/i, "").replace(/\s+/g, "").replace(/billion/i, "bn").replace(/million/i, "m");
  return m.aum != null ? "€" + m.aum + "bn" : "—";
}

// One manager-profile news row — same layout as the Fundraising (intelRow) rows:
// a "News" pill + date in the meta column, the headline (links to source), then
// the outlet inline after the headline, and a summary line where present.
function newsItemRow(x, mgr) {
  const head = x.url
    ? `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer" class="intel-head">${esc(x.title)}</a>`
    : `<span class="intel-head">${esc(x.title)}</span>`;
  const src = x.outlet ? `<span class="intel-src-inline muted small">${esc(x.outlet)}</span>` : "";
  return `<div class="intel-row" data-fkey="${esc(feedDedupKey(x))}">
    <div class="intel-meta">${metaDate(x.date)}</div>
    <div class="intel-body"><div class="intel-title-line">${head}${src}${saveBtn(newsSaveId(x))}</div>${x.summary ? `<p class="muted small">${esc(x.summary)}</p>` : ""}</div>
  </div>`;
}

// Render one row of the manager's combined feed by its tagged kind. On a manager
// profile the headline should open the source directly (srcHead), matching the
// press rows — the manager link would only point back to this same page.
function mgrFeedRow(x) {
  return x._kind === "deal" ? dealRow(x, true) : x._kind === "intel" ? intelRow(x, true) : newsItemRow(x, true);
}

// Best-effort extraction of a named CLO vehicle from a headline/summary, e.g.
// "Palmer Square CLO 2026-1", "Cordatus XXXVIII", "GLM US CLO 30",
// "Hayfin Emerald CLO XIII". Returns null when no specific vehicle is named
// (general CLO news), so those items only show in the CLO news feed.
function cloName(text) {
  if (!text) return null;
  let m = text.match(/\b([A-Z][\w'&.]*(?:\s+(?:[A-Z][\w'&.()/]*|of|the)){0,4}?\s+CLO\s+\d{4}-\d+[A-Z]?)\b/);
  if (m) return m[1].trim();
  m = text.match(/\b([A-Z][\w'&.]*(?:\s+[A-Z][\w'&.()/]*){0,4}?\s+CLO\s+(?:[IVXLCDM]{1,9}|\d{1,3}))\b/);
  if (m) return m[1].trim();
  m = text.match(/\b([A-Z][a-z]{3,}\s+[IVXLCDM]{1,9})\b/);
  if (m) return m[1].trim();
  return null;
}
// Best-effort deal size from a headline/summary, e.g. "€406m" / "$726m".
function cloSize(text) {
  const m = String(text || "").match(/([€$£])\s?~?\s?(\d[\d,]*(?:\.\d+)?)\s?(bn|billion|m|million)\b/i);
  if (!m) return null;
  return m[1] + m[2].replace(/,/g, "") + (/b/i.test(m[3]) ? "bn" : "m");
}
// Reduce a manager's CLO items to a roster of distinct named vehicles, each with
// its vintage (issuance year), disclosed size and the items relating to it.
// Sorted newest vintage first.
function cloRosterFor(items) {
  const map = new Map();
  items.forEach((x) => {
    const name = cloName(x.headline) || cloName(x.summary);
    if (!name) return;
    const key = name.toLowerCase();
    let e = map.get(key);
    if (!e) { e = { name, items: [], date: x.date }; map.set(key, e); }
    e.items.push(x);
    if (String(x.date) > String(e.date)) { e.date = x.date; e.name = name; }
  });
  return [...map.values()].map((e) => {
    const byDate = [...e.items].sort((a, b) => String(a.date).localeCompare(String(b.date)));
    const ny = (e.name.match(/\b(20\d{2})\b/) || [])[1];
    const vintage = ny || (String(byDate[0].date).match(/^(\d{4})/) || [])[1] || "";
    let size = null;
    byDate.some((it) => (size = cloSize(it.headline) || cloSize(it.summary)));
    return { name: e.name, items: e.items, date: e.date, vintage, size };
  }).sort((a, b) => String(b.vintage).localeCompare(String(a.vintage)) || String(b.date).localeCompare(String(a.date)));
}

export function viewManager(id) {
  const m = managerById[id];
  if (!m) return notFound(app);
  const fs = fundsByManager(id).sort((a, b) => b.vintage - a.vintage);
  const news = intelForManager(id);
  const liveFunds = fs.filter((x) => !x.evergreen && !x.lifecycle && x.status !== "Final Close").length;
  // The CLO roster still needs this manager's CLO items (deals + intel tagged clo).
  const mgrClo = [
    ...dealsForManager(m.id).filter((d) => d.clo).map((d) => ({ ...d, _kind: "deal" })),
    ...news.filter((i) => i.clo).map((i) => ({ ...i, _kind: "intel" })),
  ];
  const mgrCloRoster = cloRosterFor(mgrClo);
  // One comprehensive, date-sorted feed for the manager AND its funds/CLOs:
  // press (news + webNews), deal activity, fundraising intelligence and CLO
  // items together, de-duplicated so an event captured as both a press item and
  // a structured deal/intel shows once (the structured record wins).
  const fundIds = new Set(fs.map((f) => f.id));
  const belongs = (x) => x.managerId === id || (x.fundId && fundIds.has(x.fundId));
  const mgrFeed = (() => {
    const items = [
      ...deals.filter(belongs).map((d) => ({ ...d, _kind: "deal" })),
      ...intel.filter(belongs).map((i) => ({ ...i, _kind: "intel" })),
      ...[...(m.news || []), ...(m.webNews || [])].map((x) => ({ ...x, _kind: "news", _mid: m.id, _mname: m.name })),
    ];
    const seen = new Set();
    return items
      .filter((x) => { const k = feedDedupKey(x); if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  })();

  const commits = commitmentsForManager(m.id);
  // The manager is implicit on this page, so we surface the fund inline instead.
  const mgrWireRow = (x) => crWireRow(x, x.fundId && fundById[x.fundId]
    ? `<a href="#/fund/${x.fundId}" class="tw-mgr">${esc(fundById[x.fundId].name)}</a>` : "");
  const metrics = [
    ["AUM", esc(aumHeadline(m))], ["Founded", m.founded], ["Funds", fs.length],
    ["In market", liveFunds], ["CLOs", mgrCloRoster.length], ["Investors", commits.length],
  ];
  // ---- panes: News (default) · Funds · CLOs · Key personnel ----
  const newsPane = mgrFeed.length
    ? `<ul class="twire compact-list" id="mgr-wire">${mgrFeed.map(mgrWireRow).join("")}</ul>`
    : '<p class="tw-empty muted small">No news yet for this manager.</p>';
  const fundsPane = fs.length
    ? `<ul class="tmini">${fs.map((x) => `<li class="tmini-row clickable" data-href="#/fund/${x.id}"><span class="tmini-t">${esc(x.name)}<span class="tmini-r">${x.evergreen ? "Evergreen" : (x.targetSize ? eur(x.targetSize) : "—")}</span></span><span class="tmini-m">Vintage ${x.vintage} · ${esc(x.status || x.strategy || "")}</span></li>`).join("")}</ul>`
    : `<p class="tw-empty muted small">${esc(m.fundsNote || "No fund tracked (bank/balance-sheet lender, no dedicated credit arm, or US/global-only vehicles).")}</p>`;
  const closPane = mgrCloRoster.length
    ? `<ul class="tmini">${mgrCloRoster.map((c) => `<li class="tmini-row clickable" data-href="#/clo/${m.id}/${encodeURIComponent(c.name)}"><span class="tmini-t">${esc(c.name)}<span class="tmini-r">${c.size ? esc(c.size) : ""}</span></span><span class="tmini-m">${c.vintage ? "Vintage " + esc(c.vintage) : "Issued"}</span></li>`).join("")}</ul>`
    : `<p class="tw-empty muted small">${mgrClo.length ? "No individually-named CLO vehicles identified yet." : "No tracked CLOs."}</p>`;
  const peoplePane = (() => {
    let out = "";
    if (m.owners && m.owners.length) out += `<div class="tpg"><div class="tpg-h">Ownership</div><ul class="tfacts">${m.owners.map((o) => `<li><span class="tf-k">${esc(o.name)}</span><span class="tf-v">${esc(o.stake)}</span></li>`).join("")}</ul></div>`;
    if (m.legal && m.legal.length) out += `<div class="tpg"><div class="tpg-h">Legal &amp; senior counsel</div><ul class="tmini">${m.legal.map((p) => `<li class="tmini-row"><span class="tmini-t">${esc(p.name)}${p.linkedin ? ` · <a href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer" class="tw-mgr">LinkedIn</a>` : ""}</span><span class="tmini-m">${esc(p.role || "")}${p.city ? " · " + esc(p.city) : ""}</span></li>`).join("")}</ul></div>`;
    if (m.headcount) { const h = m.headcount; out += `<div class="tpg"><div class="tpg-h">Headcount${h.asOf ? ` · as of ${esc(h.asOf)}` : ""}</div><ul class="tfacts"><li><span class="tf-k">Investment professionals</span><span class="tf-v">${h.investment ?? "—"}</span></li><li><span class="tf-k">Other professionals</span><span class="tf-v">${h.other ?? "—"}</span></li><li><span class="tf-k">Total</span><span class="tf-v">${h.total ?? "—"}</span></li></ul></div>`; }
    if (m.filings && m.filings.length) out += `<div class="tpg"><div class="tpg-h">Regulatory &amp; account filings</div><ul class="tmini">${m.filings.map((x) => `<li class="tmini-row"><a class="tmini-t" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.label)}</a>${x.date ? `<span class="tmini-m">${esc(x.date)}</span>` : ""}</li>`).join("")}</ul></div>`;
    return out || '<p class="tw-empty muted small">No ownership or personnel data compiled for this manager yet.</p>';
  })();
  const pane = (p, inner) => `<div class="tpane" data-p="${p}"${p === "news" ? "" : " hidden"}>${inner}</div>`;

  app.innerHTML = `
    <div class="tdash">
      ${breadcrumb([["#/", "Managers"], [null, m.name]])}
      <div class="tdash-ticker">${metrics.map(([l, v]) => `<span class="tmet"><b>${v}</b> ${esc(l)}</span>`).join("")}</div>
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full">
          <div class="tdet-id">
            <h1>${nameCell("manager", m.id, esc(m.name))}</h1>
            <div class="tdet-sub">${esc(m.hq)} · Founded ${m.founded}${m.aumText ? " · " + esc(aumHeadline(m)) + " AUM" : ""}</div>
            ${m.description ? `<p class="tdet-desc">${esc(m.description)}</p>` : ""}
            ${m.strategies && m.strategies.length ? `<div class="tdet-chips">${m.strategies.map((s) => `<span class="tdet-chip">${esc(s)}</span>`).join("")}</div>` : ""}
            ${(m.sources && m.sources.length) ? `<div class="tdet-src">${sources(m)}</div>` : ""}
          </div>
          <header class="tpanel-h twire-head">
            <div class="tchips" id="mgr-tabs">
              <button type="button" class="tchip is-on" data-p="news">News</button>
              <button type="button" class="tchip" data-p="funds">Funds${fs.length ? " " + fs.length : ""}</button>
              <button type="button" class="tchip" data-p="clos">CLOs${mgrCloRoster.length ? " " + mgrCloRoster.length : ""}</button>
            </div>
          </header>
          <div class="tpanes" id="mgr-panes">
            ${pane("news", newsPane)}
            ${pane("funds", fundsPane)}
            ${pane("clos", closPane)}
          </div>
        </section>
      </div>
    </div>`;
  // Toggle which pane (News / Funds / CLOs / Key personnel) is shown.
  const tabs = document.getElementById("mgr-tabs");
  if (tabs) tabs.addEventListener("click", (e) => {
    const b = e.target.closest(".tchip"); if (!b) return;
    tabs.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    const p = b.dataset.p;
    _chipMem[chipMemKey("mgr-tabs")] = p || "news";
    document.querySelectorAll("#mgr-panes .tpane").forEach((el) => { el.hidden = el.dataset.p !== p; });
  });
  if (tabs) {
    const k0 = _chipMem[chipMemKey("mgr-tabs")];
    const b0 = k0 && k0 !== "news" ? tabs.querySelector(`.tchip[data-p="${k0}"]`) : null;
    if (b0 && !b0.classList.contains("is-on")) b0.click();
  }
  // Deep link to a specific story focuses its row in the News pane.
  applyPendingFocus("manager");
}

// Drill-down from a manager's CLO roster: the news/activity for one CLO vehicle.
// Route: #/clo/<managerId>/<encoded CLO name>.
export function viewClo(mid, encName) {
  const m = managerById[mid];
  if (!m) return notFound(app);
  const name = decodeURIComponent(encName || "");
  const mgrClo = [
    ...dealsForManager(mid).filter((d) => d.clo).map((d) => ({ ...d, _kind: "deal" })),
    ...intelForManager(mid).filter((i) => i.clo).map((i) => ({ ...i, _kind: "intel" })),
  ];
  const roster = cloRosterFor(mgrClo);
  const c = roster.find((x) => x.name === name) || roster.find((x) => x.name.toLowerCase() === name.toLowerCase());
  if (!c) return notFound(app);
  const items = [...c.items].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  const otherClos = roster.filter((r) => r.name !== c.name);
  const metrics = [
    ["Vintage", c.vintage || "—"], ["Size", c.size || "—"],
    ["Items", c.items.length], ["Manager", esc(m.name)],
  ];
  const kvFig = [
    ["Vintage", c.vintage || "—"], ["Size", c.size || "—"],
    ["Items", c.items.length], ["Manager CLOs", roster.length],
  ];
  const otherRail = otherClos.length
    ? `<ul class="tmini">${otherClos.map((r) => `<li class="tmini-row clickable" data-href="#/clo/${mid}/${encodeURIComponent(r.name)}"><span class="tmini-t">${esc(r.name)}<span class="tmini-r">${r.size ? esc(r.size) : ""}</span></span><span class="tmini-m">${r.vintage ? "Vintage " + esc(r.vintage) : "Issued"}</span></li>`).join("")}</ul>`
    : `<p class="tw-empty muted small">No other tracked CLOs from this manager.</p>`;
  app.innerHTML = `
    <div class="tdash">
      ${breadcrumb([["#/managers", "Managers"], ["#/manager/" + mid, m.name], [null, c.name]])}
      <div class="tdash-ticker">${metrics.map(([l, v]) => `<span class="tmet"><b>${v}</b> ${esc(l)}</span>`).join("")}</div>
      <div class="tdash-grid tdash-2">
        <section class="tcol tcol-c">
          <div class="tdet-id">
            <h1>${esc(c.name)}</h1>
            <div class="tdet-sub">CLO · managed by ${link("#/manager/" + mid, m.name)}${c.vintage ? ` · Vintage ${esc(c.vintage)}` : ""}${c.size ? ` · ${esc(c.size)}` : ""}</div>
            <div class="tdet-chips"><span class="tdet-chip">Structured Credit</span>${c.vintage ? `<span class="tdet-chip">Vintage ${esc(c.vintage)}</span>` : ""}</div>
          </div>
          <header class="tpanel-h twire-head"><span>Issuance, pricings, resets &amp; news</span><span class="tpanel-x">CLO wire</span></header>
          <ul class="twire compact-list" id="clo-wire">${items.length ? items.map((x) => crWireRow(x, "")).join("") : '<li class="muted small tw-empty">No tracked activity for this CLO yet.</li>'}</ul>
        </section>
        <aside class="tcol tcol-r">
          ${railPanel("Key figures", "", `<dl class="tkv">${kvFig.map(([l, v]) => `<div><dt>${esc(l)}</dt><dd>${v}</dd></div>`).join("")}</dl>`)}
          ${railPanel("Manager", "", `<ul class="tmini"><li class="tmini-row clickable" data-href="#/manager/${mid}"><span class="tmini-t">${esc(m.name)}</span><span class="tmini-m">${esc(m.hq || "")}</span></li></ul>`)}
          ${railPanel("Other CLOs from " + esc(m.name), otherClos.length ? String(otherClos.length) : "", otherRail)}
        </aside>
      </div>
    </div>`;
  applyPendingFocus("clos");
}

// ================================ INVESTORS =================================
export function viewLp(id) {
  const l = lpById[id];
  if (!l) return notFound(app);
  const pcAum = l.pcAllocationPct != null ? (l.aum * l.pcAllocationPct / 100) : null;
  const matches = funds.filter((x) => l.strategies.includes(x.strategy) && (x.status === "Open" || x.status === "First Close" || x.status === "Pre-marketing"));
  const mf = pageList(matches, "lp:" + l.id + ":funds", "");

  const commits = commitmentsForLp(l.id);
  const metrics = [
    ["AUM", "€" + l.aum + "bn"], ["PC alloc", pct(l.pcAllocationPct)],
    ["Implied PC", pcAum != null ? "€" + pcAum.toFixed(1) + "bn" : "—"],
    ["Ticket", eur(l.typicalTicket)], ["Commitments", commits.length], ["Matches", matches.length],
  ];
  const kvFig = [
    ["Total AUM", "€" + l.aum + "bn"], ["PC allocation", pct(l.pcAllocationPct)],
    ["Implied PC AUM", pcAum != null ? "€" + pcAum.toFixed(1) + "bn" : "—"], ["Typical ticket", eur(l.typicalTicket)],
  ];
  const commitsBody = commits.length
    ? `<ul class="tmini">${commits.map((c) => `<li class="tmini-row clickable" data-href="#/manager/${c.managerId}"><span class="tmini-t">${esc(managerById[c.managerId].name)}${c.fundId && fundById[c.fundId] ? `<span class="tmini-r">${esc(fundById[c.fundId].name)}</span>` : ""}</span>${c.note ? `<span class="tmini-m">${esc(c.note)}</span>` : ""}</li>`).join("")}</ul>`
    : `<p class="tw-empty muted small">No specific commitments publicly disclosed.</p>`;
  const matchesBody = matches.length
    ? `<ul class="tmini">${mf.shown.map((x) => `<li class="tmini-row clickable" data-href="#/fund/${x.id}"><span class="tmini-t">${esc(x.name)}</span><span class="tmini-m">${esc(managerById[x.managerId].name)} · ${esc(x.strategy)} · ${esc(x.status)}</span></li>`).join("")}${mf.more}</ul>`
    : `<p class="tw-empty muted small">No matching live funds.</p>`;

  app.innerHTML = `
    <div class="tdash">
      ${breadcrumb([["#/lps", "Investors"], [null, l.name]])}
      <div class="tdash-ticker">${metrics.map(([lab, v]) => `<span class="tmet"><b>${v}</b> ${esc(lab)}</span>`).join("")}</div>
      <div class="tdash-grid tdash-2">
        <section class="tcol tcol-c">
          <div class="tdet-id">
            <h1>${nameCell("lp", l.id, esc(l.name))}</h1>
            <div class="tdet-sub">${esc(l.type)} · ${esc(l.hq)}</div>
            ${l.notes ? `<p class="tdet-desc">${esc(l.notes)}</p>` : ""}
            <div class="tdet-chips"><span class="tdet-chip">${esc(l.mandateStatus)}</span>${l.strategies.map((s) => `<span class="tdet-chip">${esc(s)}</span>`).join("")}</div>
          </div>
          <header class="tpanel-h twire-head"><span>Known commitments</span><span class="tpanel-x">${commits.length}</span></header>
          <div id="lp-commits">${commitsBody}</div>
        </section>
        <aside class="tcol tcol-r">
          ${railPanel("Key figures", "", `<dl class="tkv">${kvFig.map(([lab, v]) => `<div><dt>${esc(lab)}</dt><dd>${v}</dd></div>`).join("")}</dl>`)}
          ${railPanel("Strategies of interest", "", `<div class="tdet-chips" style="padding:9px 12px">${l.strategies.map((s) => `<span class="tdet-chip">${esc(s)}</span>`).join("")}</div>`)}
          ${railPanel("Matching funds in market", String(matches.length), matchesBody)}
        </aside>
      </div>
    </div>`;
}

// ================================ HEDGE FUNDS ================================
// Per-fund detail: firm facts (AUM + source, strategy, region, performance) plus
// a live Top-10 holdings table pulled from the fund's most recent SEC 13F-HR via
// the Worker's /api/13f endpoint (edge-cached 24h — the holdings self-refresh as
// the TTL lapses). Funds that don't file a US 13F (cik null) skip the call and
// show a not-disclosed note. Escapes everything; every fetch has a .catch.
function hfUsd(v) {
  if (v == null || !isFinite(v)) return "—";
  const a = Math.abs(v);
  if (a >= 1e9) return "$" + (v / 1e9).toFixed(2) + "bn";
  if (a >= 1e6) return "$" + (v / 1e6).toFixed(1) + "m";
  if (a >= 1e3) return "$" + Math.round(v / 1e3) + "k";
  return "$" + Math.round(v);
}
// One performance cell. perfMap null = not fetched yet (show "…" for rows that
// have a ticker); a fetched map with no entry, or a row with no ticker = "—".
function hfPct(v) {
  if (v == null || !isFinite(v)) return `<span class="muted">—</span>`;
  const cls = v > 0 ? "hp-up" : v < 0 ? "hp-down" : "hp-flat";
  return `<span class="${cls}">${v > 0 ? "+" : ""}${esc(v.toFixed(2))}%</span>`;
}
function hfPerfCell(h, perfMap, k) {
  if (!h.ticker) return `<span class="muted">—</span>`;
  if (!perfMap) return `<span class="muted">…</span>`;
  const p = perfMap[String(h.ticker).toUpperCase()];
  return hfPct(p ? p[k] : null);
}
function hfHoldingsTable(d, perfMap) {
  if (!d || !Array.isArray(d.holdings) || !d.holdings.length) return null;
  const rows = d.holdings.map((h, i) => `<tr>`
    + `<td class="tl-n">${i + 1}</td>`
    + `<td class="tl-nm">${esc(h.name || "—")}</td>`
    + `<td class="tl-tick">${h.ticker ? esc(h.ticker) : "—"}</td>`
    + `<td class="tl-hq">${esc(h.cusip || "")}</td>`
    + `<td class="tl-n">${esc(hfUsd(h.value))}</td>`
    + `<td class="tl-n">${h.shares != null && isFinite(h.shares) ? esc(Math.round(h.shares).toLocaleString("en-US")) : "—"}</td>`
    + `<td class="tl-n">${h.weight != null && isFinite(h.weight) ? esc((h.weight * 100).toFixed(2)) + "%" : "—"}</td>`
    + `<td class="tl-n">${hfPerfCell(h, perfMap, "d1")}</td>`
    + `<td class="tl-n">${hfPerfCell(h, perfMap, "m3")}</td>`
    + `<td class="tl-n">${hfPerfCell(h, perfMap, "m6")}</td>`
    + `<td class="tl-n">${hfPerfCell(h, perfMap, "m12")}</td></tr>`).join("");
  return `<div class="tleague-wrap"><table class="tleague tl-holdings">`
    + `<thead><tr><th>#</th><th>Holding</th><th class="tl-tick">Ticker</th><th class="tl-hq">CUSIP</th><th>Value</th><th>Shares</th><th>Weight</th><th>1D</th><th>3M</th><th>6M</th><th>12M</th></tr></thead>`
    + `<tbody>${rows}</tbody></table></div>`;
}

export function viewHedgeFund(id) {
  const f = HEDGE_FUNDS.find((x) => x.id === id);
  if (!f) return notFound(app);
  const aumStr = f.aum == null ? "n.a." : "$" + f.aum.toFixed(2) + "bn" + (f.estimated ? " (approx.)" : "");
  const aumFact = f.aum == null ? "n.a."
    : `${esc(aumStr)}${f.aumAsOf ? ` <span class="tf-est">as of ${esc(f.aumAsOf)}</span>` : ""}`
      + (f.aumSource ? ` · <a href="${esc(f.aumSource)}" target="_blank" rel="noopener noreferrer" class="tw-mgr">source</a>` : "");
  const perfFact = f.perf && f.perf.text
    ? `${esc(f.perf.text)}${f.perf.asOf ? ` <span class="tf-est">${esc(f.perf.asOf)}</span>` : ""}`
      + (f.perf.source ? ` · <a href="${esc(f.perf.source)}" target="_blank" rel="noopener noreferrer" class="tw-mgr">source</a>` : "")
    : "n.a.";
  const secUrl = f.cik ? `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${esc(f.cik)}&type=13F-HR&dateb=&owner=include&count=40` : null;
  const metrics = [
    ["AUM", f.aum == null ? "n.a." : "$" + f.aum.toFixed(2) + "bn"], ["Region", esc(f.region)],
    ["Founded", f.founded || "—"], ["Strategy", esc(f.strategy)],
  ];
  const facts = [
    ["AUM (US$bn)", aumFact],
    ["Strategy", esc(f.strategy)],
    ["Region", esc(f.region)],
    ["HQ", esc(f.hq)],
    ["Founded", f.founded || "—"],
    ["Founder", esc(f.founder || "—")],
    ["Performance", perfFact],
  ];
  const factsRail = `<ul class="tfacts">${facts.map(([k, v]) => `<li><span class="tf-k">${esc(k)}</span><span class="tf-v">${v}</span></li>`).join("")}</ul>`;
  const linksRail = `<ul class="tmini">`
    + (f.url ? `<li class="tmini-row"><a class="tmini-t" href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">Firm website</a><span class="tmini-m">${esc(f.name)}</span></li>` : "")
    + (secUrl ? `<li class="tmini-row"><a class="tmini-t" href="${esc(secUrl)}" target="_blank" rel="noopener noreferrer">SEC EDGAR — 13F filings</a><span class="tmini-m">CIK ${esc(f.cik)}</span></li>` : "")
    + `</ul>`;
  const holdingsBody = f.cik
    ? `<div id="hf-holdings"><p class="tw-empty muted small">Loading latest 13F holdings…</p></div>`
    : `<p class="tw-empty muted small">No US 13F / not disclosed.</p>`;

  app.innerHTML = `
    <div class="tdash">
      ${breadcrumb([["#/", "Hedge Funds"], [null, f.name]])}
      <div class="tdash-ticker">${metrics.map(([l, v]) => `<span class="tmet"><b>${v}</b> ${esc(l)}</span>`).join("")}</div>
      <div class="tdash-grid tdash-2">
        <section class="tcol tcol-c">
          <div class="tdet-id">
            <h1>${esc(f.name)}</h1>
            <div class="tdet-sub">${esc(f.hq)} · ${esc(f.region)}${f.founded ? " · Founded " + esc(String(f.founded)) : ""}${f.founder ? " · " + esc(f.founder) : ""}</div>
            <div class="tdet-chips"><span class="tdet-chip">${esc(f.strategy)}</span>${f.aum != null ? `<span class="tdet-chip">$${esc(f.aum.toFixed(2))}bn AUM</span>` : ""}</div>
          </div>
          <header class="tpanel-h twire-head"><span>Top 10 holdings</span><span class="tpanel-x">SEC 13F-HR${f.cik ? "" : " · n/a"}</span></header>
          ${holdingsBody}
          <p class="tl-sls-key muted small">AUM approximate; 13F holdings via SEC EDGAR, as of <span id="hf-asof">${f.cik ? "latest filing" : "n/a"}</span>; performance ${f.perf && f.perf.text ? "as noted" : "n.a."}</p>
        </section>
        <aside class="tcol tcol-r">
          ${railPanel("Firm facts", "", factsRail)}
          ${railPanel("Links", "", linksRail)}
        </aside>
      </div>
    </div>`;

  // Live Top-10 holdings — edge-cached at /api/13f (24h TTL); cache-first via the
  // edge + browser cache, with a .catch fallback so a failed fetch degrades to a
  // note rather than throwing.
  if (f.cik) {
    fetch(`/api/13f?cik=${encodeURIComponent(f.cik)}`, { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const el = document.getElementById("hf-holdings");
        if (!el) return;
        if (!d || !Array.isArray(d.holdings) || !d.holdings.length) {
          el.innerHTML = `<p class="tw-empty muted small">No US 13F holdings disclosed.</p>`;
          return;
        }
        // First paint: holdings with "…" in the four performance columns.
        el.innerHTML = hfHoldingsTable(d, null);
        const asof = document.getElementById("hf-asof");
        if (asof && d.asOf) {
          asof.textContent = "";
          if (d.source) { const a = document.createElement("a"); a.href = d.source; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = d.asOf; asof.appendChild(a); }
          else asof.textContent = d.asOf;
        }
        // Second phase: live 1D/3M/6M/12M price performance for the resolved
        // tickers (edge-cached ~15 min), then re-render with the figures filled.
        const syms = [...new Set(d.holdings.map((h) => h.ticker).filter(Boolean))];
        const fill = (perfMap) => { const e2 = document.getElementById("hf-holdings"); if (e2) e2.innerHTML = hfHoldingsTable(d, perfMap); };
        if (!syms.length) { fill({}); return; }
        fetch(`/api/perf?symbols=${encodeURIComponent(syms.join(","))}`, { headers: { accept: "application/json" } })
          .then((r) => (r.ok ? r.json() : null))
          .then((pr) => fill((pr && pr.perf) || {}))
          .catch(() => fill({}));
      })
      .catch(() => {
        const el = document.getElementById("hf-holdings");
        if (el) el.innerHTML = `<p class="tw-empty muted small">Holdings unavailable right now — try again shortly.</p>`;
      });
  }
}
