// AUTO-PORTED from credit/js/detail.js — settable host (__setHost) instead of a
// global #app capture; render code verbatim.

// =============================================================================
// credit/js/detail.js — the deep detail views: Manager, CLO and Investor
// profiles (the terminal "tdash" layout). Extracted from app.js, which routes to
// them via viewManager/viewClo/viewLp (the standalone Fund page is retired —
// #/fund/<id> redirects to the fund's manager; see fundManagerId). Imports flow
// app.js -> detail.js -> shared.js (never backwards) so the graph stays acyclic.
// NOTE: ./data.js is imported by the same tokenless URL as app.js / shared.js
// (served no-cache; no ?v= tokens — HOUSE_STYLE T1/T2), so the browser shares
// one module instance rather than loading data.js twice.
// =============================================================================
import {
  managers, managerById, fundById, lpById, funds, lps, intel, deals,
  fundsByManager, dealsForManager, intelForManager,
  HEDGE_FUNDS, HEDGE_INTEL, VEHICLES, AUM_FX,
} from "/credit/js/data.js";
import { esc, byDateDesc } from "/util.js";
import { BDCS } from "/credit/js/bdcs.js";
import { tabbedHTML, bindTabs, latestLine } from "../profile-tabs.js";
import { TX_TYPES, TX_GROUPS, SECTOR_LABEL, txOf, sectorOf, amountOf, toUsd, fmtUsd } from "/credit/js/tx.js";
import { firms as LAW_FIRMS } from "/legal/js/data.js";
import { dealCounterparty, dealSponsor, dealAmount, dealRoleFor, ROLE_NAME } from "../deal-parse.js";
import { peersOf, peerDetails } from "../peers.js";
import {
  eur, pct, fmtDate, link, nameCell,
  notFound, applyPendingFocus, commitmentsForLp, investorsForFund, fmtAumC, aumNote, usdM, money,
  pageList, feedDedupKey, creditSource,
  _chipMem, chipMemKey, pendingFocus,
} from "/credit/js/shared.js";

export let app = null;
export function __setHost(h) { app = h; }
// Look ids up INSIDE the current host first: the retired Credit desk can hold a
// second (hidden) copy of the same page, so a bare document.getElementById could bind
// to the wrong copy. Falls back to the document for anything outside the host.
const $id = (id) => (app && app.querySelector && app.querySelector("#" + CSS.escape(id))) || $id(id);

// Profile sub-tab ⇄ URL (#/<route>/<id>[/<tab>]): a tab switch REPLACES the history
// entry (Back still leaves the profile in one step) but records the tab, so a
// reload, a shared link or Back from a drill-down (manager ▸ Vehicles ▸ a CLO → Back)
// lands on the same tab. Profiles-hosted pages only; the default tab has no segment.
export function tabUrl(route, id, p, def) {
  if (!profilesMode) return;
  const h = `#/${route}/${encodeURIComponent(id)}` + (p && p !== def ? "/" + p : "");
  if (location.hash.split("?")[0] === h) return;
  try { history.replaceState(history.state, "", location.pathname + location.search + h); } catch { /* keep the old URL */ }
}

// Small reusable terminal rail panel.
function railPanel(title, meta, body) {
  return `<section class="tpanel"><header class="tpanel-h"><span>${title}</span>${meta ? `<span class="tpanel-x">${meta}</span>` : ""}</header>${body}</section>`;
}

// Hedge-fund strategy → comparable tokens, so "Multi (quant & discretionary)" and
// "Multi-strategy" share "multi", two macro books share "macro", etc. Used to
// score HF peers (peers.js) where the strategy is one free-text string.
const _HF_STOP = new Set(["and", "the", "strategy", "strategies", "fund", "funds"]);
const hfStrategyTokens = (s) => String(s || "").toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2 && !_HF_STOP.has(w));

// The Credit desk's section chips (the same set the dashboard shows). Rendered at
// the top of every detail view so you navigate the desk the same way from a
// profile as from the dashboard: each chip jumps straight to that section
// (dashboard ?tab= is seeded from the link). `all` has no param (bare dashboard).
const CR_SECTIONS = [["all", "All"], ["deals", "Deals"], ["fundraising", "Fundraising"], ["managers", "Managers"], ["hedgefunds", "Hedge Funds"]];
const crSecHref = (k) => k === "all" ? "#/" : "#/?tab=" + k;
// When a profile is opened from the Profiles tab it is hosted THERE (not in the
// retired Credit desk), so its top nav must be the Profiles chip set — Managers ·
// Hedge Funds · Law firms — each returning to that list, not the Credit desk's
// Deals/Fundraising sections. Profiles flips this on per render; the Credit desk
// leaves it off (its router resets it). Shared single module instance, so the
// last writer before a synchronous render wins — and only the active tab renders.
let profilesMode = false;
export function __setProfilesMode(v) { profilesMode = v; }
const PF_SECTIONS = [["managers", "Managers"], ["hedgefunds", "Hedge Funds"], ["firms", "Law firms"]];
const pfSecNav = (active) => `<header class="tpanel-h twire-head tdet-secnav"><div class="tchips">${PF_SECTIONS
  .map(([k, l]) => `<a class="tchip${k === active ? " is-on" : ""}" href="#/?tab=${k}">${esc(l)}</a>`).join("")}</div></header>`;
// `parts` is kept for call-site compatibility; the first linked crumb's label
// tells us which section this profile lives under, so that chip reads active.
function breadcrumb(parts) {
  const parentLabel = (parts.filter((p) => p[0])[0] || [null, ""])[1];
  if (profilesMode) return pfSecNav({ Managers: "managers", Funds: "managers", "Hedge Funds": "hedgefunds" }[parentLabel] || "managers");
  const active = { Managers: "managers", Funds: "fundraising", "Hedge Funds": "hedgefunds" }[parentLabel] || "all";
  return `<header class="tpanel-h twire-head tdet-secnav"><div class="tchips">${CR_SECTIONS
    .map(([k, l]) => `<a class="tchip${k === active ? " is-on" : ""}" href="${esc(crSecHref(k))}">${esc(l)}</a>`).join("")}</div></header>`;
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
  // The story link. A news item opens its source article; a deal/intel item opens the
  // in-app deal/intel detail on the CREDIT DESK (data-goto) — BUT the Profiles host has
  // no deals/intel route, so there #/deals / #/intel would dead-end back to the list
  // (the Arini bug). In Profiles, send deal/intel straight to the source story instead;
  // an item with no URL (news or deal) is plain text, never a bare "#" that bounces.
  const ext = (t, u) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer" class="tw-head">${esc(t)}</a>`;
  const head = isNews || profilesMode
    ? (url ? ext(title, url) : `<span class="tw-head">${esc(title)}</span>`)
    : `<a href="#/${x._kind === "deal" ? "deals" : "intel"}" data-goto="${x._kind === "deal" ? "deals" : "intel"}:${x.id}" class="tw-head">${esc(title)}</a>`;
  return `<li class="compact-item tw-row" data-kind="${x._kind}"${isNews ? ` data-fkey="${esc(feedDedupKey(x))}"` : ` id="row-${esc(x.id)}"`}>`
    + `<span class="tw-date">${x.date ? esc(fmtDate(x)) : "undated"}</span>`
    + `<span class="tw-tag ${x._kind}">${CR_KIND[x._kind]}</span>`
    + `<span class="tw-body">${head}${inline ? `<span class="tw-mgr-w">${inline}</span>` : ""}</span>`
    + `<span class="tw-src">${src ? (url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(src)}</a>` : esc(src)) : ""}</span>`
    + `</li>`;
}

// ================================== FUNDS ===================================
// The standalone fund detail page is retired — a fund is now surfaced only through
// its manager's profile. This resolves a fund id to its parent manager id so the
// routers can redirect #/fund/<id> to #/manager/<managerId>. null if unknown.
export function fundManagerId(id) { const f = fundById[id]; return (f && f.managerId) || null; }


// ================================ MANAGERS ==================================
// The header's AUM figures — the SAME fields, labels and currency as the Managers
// list columns (Group AUM · Credit AUM), so a number never changes meaning between
// the list and the profile. The sourced aumText + as-of date ride on the tooltip.
function aumLine(m) {
  if (m.notAum) return "";
  const g = m.aumTotal != null ? m.aumTotal : m.aum;
  const parts = [];
  if (g != null) parts.push(`Group AUM ${fmtAumC(g)}`);
  if (m.aumCredit != null) parts.push(`Credit AUM ${fmtAumC(m.aumCredit)}`);
  if (!parts.length) return "";
  const tip = [m.aumText, m.asOf ? "as of " + m.asOf : "", aumNote(m, m.aumTotal != null ? "aumTotal" : "aum", AUM_FX)].filter(Boolean).join(" · ");
  return ` · <span class="tdet-aum"${tip ? ` title="${esc(tip)}"` : ""}>${esc(parts.join(" · "))}</span>`;
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
  }).sort((a, b) => String(b.vintage).localeCompare(String(a.vintage)) || byDateDesc(a, b));
}

// "Book & business" — additive, render-if-present manager detail. Every value is
// optional and sourced.
// A stacked label→value row (label above, value wraps below) — the single
// key/value primitive for the Business tab, so prose facts (strategy, origination)
// and short ones (check size, AUM) read the same way instead of the old mix of
// fact-tables, chips and free paragraphs.
const bizRow = (k, v) => `<li><span class="tbiz-k">${esc(k)}</span><span class="tbiz-v">${v}</span></li>`;
function bookHTML(m) {
  const b = m.book; if (!b) return "";
  const rows = [];
  if (b.strategyDetail) rows.push(bizRow("Strategy", esc(b.strategyDetail)));
  if (b.checkSize) rows.push(bizRow("Typical check", esc(b.checkSize)));
  if (b.originationMix) rows.push(bizRow("Origination", esc(b.originationMix)));
  if (b.instruments && b.instruments.length) rows.push(bizRow("Instruments", esc(b.instruments.join(" · "))));
  if (b.sectors && b.sectors.length) rows.push(bizRow("Target sectors", esc(b.sectors.join(" · "))));
  if (b.lpBase && b.lpBase.length) rows.push(bizRow("LP base", esc(b.lpBase.join(" · "))));
  if (b.aumTrajectory && b.aumTrajectory.length) rows.push(bizRow("AUM trajectory", b.aumTrajectory.map((t) => `${esc(t.asOf)} — $${esc(String(t.aum))}bn`).join(" · ")));
  const facts = rows.length ? `<ul class="tbiz">${rows.join("")}</ul>` : "";
  const note = b.note ? `<p class="tpg-note">${esc(b.note)}</p>` : "";
  const src = (b.sources && b.sources.length) ? `<div class="tpg-src">${b.sources.map((u, i) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">source${b.sources.length > 1 ? " " + (i + 1) : ""}</a>`).join(" · ")}</div>` : "";
  return `<div class="tpg"><div class="tpg-h">Strategy &amp; book</div>${note}${facts}${src}</div>`;
}
// "Advisers" — law firms seen acting for the manager, grouped by product line. `firm` is a
// display name; `confidence:"inferred"` edges (derived from public deal coverage)
// are marked. Roles render in a fixed order, unknown roles appended.
// A named adviser → its covered law-firm profile id (or null). Names are matched on a
// normalised prefix so "Simpson Thacher & Bartlett" finds "Simpson Thacher" and
// "Proskauer" finds "Proskauer Rose LLP"; anything not on the roster stays unlinked.
const _lawNorm = (t) => String(t || "").toLowerCase().replace(/\(.*?\)/g, " ").replace(/\b(llp|llc|lp)\b/g, " ").replace(/[^a-z0-9& ]+/g, " ").replace(/\s+/g, " ").trim();
const _lawKeys = (LAW_FIRMS || []).map((f) => [_lawNorm(f.name), f.id]).filter(([k]) => k.length >= 4);
export function lawFirmIdFor(name) {
  const n = _lawNorm(name); if (!n) return null;
  const hit = _lawKeys.find(([k]) => n === k || n.startsWith(k + " ") || k.startsWith(n + " "));
  return hit ? hit[1] : null;
}
const ADV_ROLES = ["Fund formation", "Fund finance", "Financing/deals", "Restructuring", "Regulatory", "Tax"];
function advisersHTML(m) {
  const a = m.advisers; if (!a || !a.length) return "";
  const roles = ADV_ROLES.filter((r) => a.some((x) => x.role === r))
    .concat([...new Set(a.map((x) => x.role))].filter((r) => !ADV_ROLES.includes(r)));
  const row = (x) => `<li class="tmini-row"><span class="tmini-t">`
    + (() => { const fid = lawFirmIdFor(x.firm); return fid
      ? `<a href="#/firm/${esc(encodeURIComponent(fid))}">${esc(x.firm)}</a>${x.source ? ` <a class="tw-mgr" href="${esc(x.source)}" target="_blank" rel="noopener noreferrer">src</a>` : ""}`
      : (x.source ? `<a href="${esc(x.source)}" target="_blank" rel="noopener noreferrer">${esc(x.firm)}</a>` : esc(x.firm)); })()
    + `${x.confidence === "inferred" ? ` <span class="adv-inf" title="Inferred from public deal coverage — not confirmed panel counsel">inferred</span>` : ""}</span>`
    + `<span class="tmini-m">${esc(x.scope || "")}${x.lastSeen ? " · " + esc(x.lastSeen) : ""}</span></li>`;
  return `<div class="tpg"><div class="tpg-h">Advisers</div>`
    + roles.map((r) => `<div class="adv-grp"><div class="adv-role">${esc(r)}</div><ul class="tmini">${a.filter((x) => x.role === r).map(row).join("")}</ul></div>`).join("")
    + `</div>`;
}

// Collapsible sources: a single "Sources" line that expands to the links (+ an
// "as of" stamp). Replaces the long inline "Sources: …" note. Local to the detail
// views so it doesn't touch the shared sources() used elsewhere.
function srcDetails(rec) {
  if (!rec || !rec.sources || !rec.sources.length) return "";
  const links = rec.sources.map((s, i) =>
    `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label || "source " + (i + 1))}</a>`).join(" · ");
  const asOf = rec.asOf ? ` · <span class="muted">as of ${esc(rec.asOf)}</span>` : "";
  const n = rec.sources.length;
  return `<details class="tdet-src-det"><summary>Sources${n > 1 ? ` (${n})` : ""}</summary><div class="tdet-src-body">${links}${asOf}</div></details>`;
}

// ---- Investments: instrument classification --------------------------------
// The Investments tab lists a manager's deal activity drawn ONLY from the news
// we've surfaced, tagged debt vs equity (and a sub-type where the article says
// so). A CURATED override on the deal wins (d.instrument = "Debt"|"Equity",
// d.instrumentType = "Senior"/"Mezzanine"/"RCF"/…); otherwise we derive
// CONSERVATIVELY from the deal's own type + the wording of the article itself —
// asserting a class only on an explicit signal and a sub-type only when named,
// leaving anything unclear blank (never guessed). Each row links its source.
const INVEST_TYPES = new Set([
  "Financing", "Investment", "Acquisition", "Structured Credit",
  "Structured Credit / CLO", "Refinancing", "Unitranche", "NPL / Portfolio",
  "Restructuring", "Continuation Vehicle", "Disposal / Exit",
]);
const DEBT_SUB = [
  [/\bunitranche\b/, "Unitranche"],
  [/\bmezzanine\b|\bmezz\b/, "Mezzanine"],
  [/revolving credit facilit|\brcf\b/, "RCF"],
  [/second[-\s]lien/, "Second lien"],
  [/senior secured|senior debt|senior loan|first[-\s]lien/, "Senior"],
  [/\bterm loan\b|\btlb\b/, "Term loan"],
  [/nav (loan|financ|facilit)/, "NAV financing"],
  [/asset[-\s]backed|\babs\b|securitis|securitiz/, "Asset-backed"],
  [/\bclo\b|collateralis?ed loan/, "CLO / structured"],
  [/acquisition financ|financ\w+ (?:the|an|its) acquisition|to (?:back|fund|finance) the acquisition|buyout financ|\blbo\b/, "Acquisition financing"],
  [/\brefinanc/, "Refinancing"],
  [/\bnpl\b|non[-\s]performing/, "NPL / portfolio"],
  [/private placement|\bnotes\b|\bbond\b/, "Notes / bonds"],
];
const EQUITY_SUB = [
  [/preferred equity|\bpref equity\b/, "Preferred"],
  [/structured equity/, "Structured equity"],
  [/gp[-\s]stake|stake in the (?:manager|firm|gp)/, "GP stake"],
  [/growth equity/, "Growth equity"],
  [/ordinary shares|common equity|common shares/, "Ordinary"],
  [/minority (?:equity )?stake|minority investment|equity stake/, "Minority equity"],
];
const DEBT_KW = /(loan|facilit|financ|senior|unitranche|mezzanine|\brcf\b|revolving credit|term loan|refinanc|\bclo\b|securitis|securitiz|\bnpl\b|\bdebt\b|\bnotes\b|\bbond\b|direct lending|private credit|second[-\s]lien|first[-\s]lien)/;
const EQUITY_KW = /(\bequity\b|\bstake\b|\bshares\b|recapitalis|recapitaliz|preferred|buyout)/;
const DEBT_TYPES = new Set(["Financing", "Refinancing", "Unitranche", "Structured Credit", "Structured Credit / CLO", "NPL / Portfolio"]);
function classifyInstrument(d) {
  if (d.instrument) return { cls: d.instrument, sub: d.instrumentType || "", curated: true };
  const s = ((d.headline || "") + " — " + (d.summary || "")).toLowerCase();
  const findSub = (list) => { for (const [re, label] of list) if (re.test(s)) return label; return ""; };
  const dsub = findSub(DEBT_SUB); if (dsub) return { cls: "Debt", sub: dsub, curated: false };
  const esub = findSub(EQUITY_SUB); if (esub) return { cls: "Equity", sub: esub, curated: false };
  if (DEBT_TYPES.has(d.type)) return { cls: "Debt", sub: "", curated: false };
  const debt = DEBT_KW.test(s), eq = EQUITY_KW.test(s);
  if (debt && !eq) return { cls: "Debt", sub: "", curated: false };
  if (eq && !debt) return { cls: "Equity", sub: "", curated: false };
  return { cls: "", sub: "", curated: false };   // unspecified — never guessed
}
// The manager is implicit on its own profile, so an Investments row LEADS with the
// other named party — the portfolio company / borrower — derived best-effort from
// the sourced headline (dealCounterparty/dealAmount, shared with the Transactions
// tables; see v2/js/deal-parse.js). The verbatim headline always stays visible
// beneath, so a headline that doesn’t parse simply leads with itself.
// One Investments table row: the portfolio company / borrower leads (linking to
// the source article — "news about this"), with the deal type, debt/equity
// instrument, size and date in their own columns and the outlet at the right. The
// verbatim, sourced headline sits beneath the name so nothing is misrepresented
// when the name is derived; rows that don't parse lead with the headline itself.
function invRow(d, mid) {
  const { cls, sub, curated } = classifyInstrument(d);
  // This firm's role in the deal (R39m): a sponsor deal is never presented as a loan
  // the firm made — the Deal cell leads with "Sponsor" / "Borrower" / "Lender".
  const role = mid ? dealRoleFor(d, mid) : null;
  const roleTag = role && ROLE_NAME[role] ? `<span class="tinv-role" data-role="${esc(role)}">${esc(ROLE_NAME[role])}</span> · ` : "";
  const tag = cls
    ? `<span class="tinv-tag ${cls === "Debt" ? "is-debt" : "is-equity"}"${curated ? "" : ' title="Auto-derived from the linked article"'}>${esc(cls)}${sub ? " · " + esc(sub) : ""}${curated ? "" : "<span class=\"tinv-inf\">~</span>"}</span>`
    : `<span class="tinv-tag is-unspec">—</span>`;
  const outlet = creditSource(d) || "";
  const subj = dealCounterparty(d, (managerById[d.managerId] || {}).name);
  const sponsor = role === "sponsor" ? "" : dealSponsor(d);   // the PE backer, when the deal names one (not this firm itself)
  const amt = dealAmount(d);
  const url = esc(d.sourceUrl);
  // Company/borrower cell shows JUST the name (full headline is the hover title);
  // the source link is its own column at the right.
  const name = subj || d.headline;
  // A click reveals the short sourced narrative (same summary the Transactions tab
  // shows), plus the sponsor when one is named and a "Full source" link. Only rows
  // that carry a summary or a source are made expandable.
  const hasDetail = !!(d.summary || d.sourceUrl || d.date);
  const detail = `${d.summary ? `<p class="tx-sum">${esc(d.summary)}</p>` : ""}`
    + (sponsor ? `<p class="tinv-spon"><span class="tinv-spon-l">Sponsor</span> ${esc(sponsor)}</p>` : "")
    + (url ? `<a class="tx-src" href="${url}" target="_blank" rel="noopener noreferrer">Full source</a>` : "")
    + (d.date ? ` <a class="tx-src" href="/v2/transactions/#/deal/${esc(encodeURIComponent(d.id))}">Open in Transactions</a>` : "");
  return `<tr class="tinv-row${hasDetail ? " is-exp" : ""}" data-id="${esc(d.id)}">`
    + `<td class="tinv-c-co" title="${esc(d.headline)}">${hasDetail ? `<span class="tx-caret" aria-hidden="true">▸</span>` : ""}${esc(name)}</td>`
    + `<td class="tinv-c-type">${roleTag}${esc(d.type || "—")}</td>`
    + `<td class="tinv-c-instr">${tag}</td>`
    + `<td class="tinv-c-amt">${amt ? esc(amt) : "—"}</td>`
    + `<td class="tinv-c-date">${esc(fmtDate(d))}</td>`
    + `<td class="tinv-c-src">${url ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(outlet || "source")}</a>` : "—"}</td>`
    + `</tr>`
    + (hasDetail ? `<tr class="tinv-exp" data-for="${esc(d.id)}" hidden><td colspan="6"><div class="tx-exp-in">${detail}</div></td></tr>` : "");
}

// The expanded body of a fund row (Vehicles tab): sourced facts only — a field
// that isn't on the record is simply omitted (never a placeholder).
function fundBodyHTML(f) {
  const rows = [];
  if (f.strategy) rows.push(["Strategy", esc(f.strategy)]);
  if (f.status) rows.push(["Status", esc(f.status)]);
  if (f.targetSize != null) rows.push(["Target", esc(money(f.targetSize, f.ccy))]);
  if (f.hardCap != null) rows.push(["Hard cap", esc(money(f.hardCap, f.ccy))]);
  if (f.raised != null) rows.push([f.evergreen ? "AUM / NAV" : "Raised", esc(money(f.raised, f.ccy)) + (f.estimated ? ' <span class="tf-est">est.</span>' : "")]);
  if (f.deployedPct != null) rows.push(["Deployed", esc(f.deployedPct + "%") + (f.deployedAsOf ? ` <span class="tf-est">${esc(f.deployedAsOf)}</span>` : "")]);
  if (f.targetIRR) rows.push(["Target return", esc(String(f.targetIRR))]);
  const focus = [f.domicile, f.geoFocus, f.sectorFocus].filter(Boolean).map(esc).join(" · ");
  if (focus) rows.push(["Domicile · focus", focus]);
  if (f.asOf) rows.push(["As of", esc(f.asOf)]);
  const inv = investorsForFund(f);
  const invHTML = inv.length ? `<div class="tpg-h">Investors</div><ul class="tmini">${inv.map((i) => `<li class="tmini-row"><span class="tmini-t">${i.lpId && lpById[i.lpId] ? `<a href="#/lp/${esc(i.lpId)}">${esc(i.name)}</a>` : (i.url ? `<a href="${esc(i.url)}" target="_blank" rel="noopener noreferrer">${esc(i.name)}</a>` : esc(i.name))}</span>${i.note ? `<span class="tmini-m">${esc(i.note)}</span>` : ""}</li>`).join("")}</ul>` : "";
  const notable = (f.notableInvestments || []).length ? `<div class="tpg-h">Notable investments</div><ul class="tmini">${f.notableInvestments.map((n) => `<li class="tmini-row"><span class="tmini-t">${n.url ? `<a href="${esc(n.url)}" target="_blank" rel="noopener noreferrer">${esc(n.name)}</a>` : esc(n.name)}</span>${n.note ? `<span class="tmini-m">${esc(n.note)}</span>` : ""}</li>`).join("")}</ul>` : "";
  return (f.description ? `<p class="tx-sum">${esc(f.description)}</p>` : "")
    + (rows.length ? `<ul class="tbiz">${rows.map(([k, v]) => bizRow(k, v)).join("")}</ul>` : "")
    + invHTML + notable + srcDetails(f);
}

// ---- Deal timeline (manager ▸ Timeline) -------------------------------------
// Deals per quarter since 2020 as a single-series column chart (one neutral token —
// no legend needed), each column's hover naming the quarter, its count, disclosed
// volume and the Lending / Structured / Secondaries split; under it, every deal by
// year, each opening its Transactions deal panel. Sourced records only.
const _grpOf = (key) => (TX_TYPES.find((t) => t.key === key) || {}).group || "lending";
const _grpLabel = (g) => (TX_GROUPS.find((x) => x.key === g) || {}).label || g;
function timelineHTML(dealList) {
  const rows = dealList.filter((d) => d && d.date && !isNaN(Date.parse(d.date)))
    .map((d) => { const t = new Date(d.date); return { d, y: t.getUTCFullYear(), q: Math.floor(t.getUTCMonth() / 3) + 1, g: _grpOf(txOf(d)), usd: toUsd(amountOf(d)) }; });
  if (!rows.length) return `<p class="tw-empty muted small">No dated deals tracked for this manager yet.</p>`;
  const now = new Date(), y0 = Math.max(2020, Math.min(...rows.map((r) => r.y))), yN = now.getUTCFullYear(), qN = Math.floor(now.getUTCMonth() / 3) + 1;
  const buckets = [];
  for (let y = y0; y <= yN; y++) for (let q = 1; q <= 4; q++) { if (y === yN && q > qN) break; buckets.push({ y, q, rs: rows.filter((r) => r.y === y && r.q === q) }); }
  const max = Math.max(1, ...buckets.map((b) => b.rs.length));
  const W = 720, H = 150, padL = 26, padB = 20, padT = 8, n = buckets.length, slot = (W - padL) / n, bw = Math.max(3, slot - 2);
  const yv = (v) => padT + (H - padT - padB) * (1 - v / max);
  const ticks = [...new Set([0, Math.ceil(max / 2), max])];
  const grid = ticks.map((t) => `<line x1="${padL}" x2="${W}" y1="${yv(t)}" y2="${yv(t)}" class="ttl-grid"/><text x="${padL - 5}" y="${yv(t) + 3}" class="ttl-ax" text-anchor="end">${t}</text>`).join("");
  const bars = buckets.map((b, i) => {
    const x = padL + i * slot + (slot - bw) / 2, h = (H - padT - padB) * (b.rs.length / max), yTop = H - padB - h;
    const split = TX_GROUPS.map((g) => [g.label, b.rs.filter((r) => r.g === g.key).length]).filter(([, c]) => c).map(([l, c]) => `${l} ${c}`).join(" · ");
    const vol = b.rs.reduce((s, r) => s + (r.usd || 0), 0);
    const tip = `Q${b.q} ${b.y}: ${b.rs.length} deal${b.rs.length === 1 ? "" : "s"}${vol ? " · ≈" + fmtUsd(vol) + " disclosed" : ""}${split ? " · " + split : ""}`;
    const r = Math.min(4, bw / 2);
    const path = b.rs.length ? `<path class="ttl-bar" d="M${x},${H - padB} V${yTop + r} Q${x},${yTop} ${x + r},${yTop} H${x + bw - r} Q${x + bw},${yTop} ${x + bw},${yTop + r} V${H - padB} Z"/>` : "";
    // A full-height hit target, wider than the mark (the hover layer).
    return `<g class="ttl-col" tabindex="0" aria-label="${esc(tip)}"><title>${esc(tip)}</title><rect class="ttl-hit" x="${padL + i * slot}" y="${padT}" width="${slot}" height="${H - padT - padB}"/>${path}</g>`;
  }).join("");
  const years = buckets.filter((b) => b.q === 1).map((b) => `<text x="${padL + buckets.indexOf(b) * slot + 2}" y="${H - 5}" class="ttl-ax">${b.y}</text>`).join("");
  const shown = rows.filter((r) => r.y >= y0).length;
  const chart = `<figure class="ttl"><figcaption class="tpg-h">Deals per quarter since ${y0} <span class="tveh-grp-n">${shown}</span></figcaption>`
    + `<svg viewBox="0 0 ${W} ${H}" class="ttl-svg" role="img" aria-label="Deals per quarter since ${y0}: ${shown} in total">${grid}${bars}<line x1="${padL}" x2="${W}" y1="${H - padB}" y2="${H - padB}" class="ttl-base"/>${years}</svg></figure>`;
  const byYear = [...new Set(rows.map((r) => r.y))].sort((a, b) => b - a).map((y) => {
    const rs = rows.filter((r) => r.y === y).sort((a, b) => String(b.d.date).localeCompare(String(a.d.date)));
    return `<div class="tw-day">${y} · ${rs.length}</div><ul class="tmini">${rs.map((r) => `<li class="tmini-row"><a class="tmini-t" href="/v2/transactions/#/deal/${esc(encodeURIComponent(r.d.id))}">${esc(r.d.headline || "")}</a><span class="tmini-m">${esc(fmtDate(r.d.date))} · ${esc(_grpLabel(r.g))} · ${esc((TX_TYPES.find((t) => t.key === txOf(r.d)) || {}).label || "")}${r.usd ? " · ≈" + esc(fmtUsd(r.usd)) : ""}</span></li>`).join("")}</ul>`;
  }).join("");
  return chart + byYear;
}

// ---- Compare two managers (#/compare/<a>/<b>) --------------------------------
// Side by side: identity, AUM, strategies, vehicles, and the tracked deal activity
// (counts, mix, disclosed sizes, sectors, recency) — sourced records only.
function mgrStats(m) {
  const ds = deals.filter((d) => d.managerId === m.id && d.date);
  const t12 = Date.now() - 365 * 864e5, t90 = Date.now() - 90 * 864e5;
  const d12 = ds.filter((d) => Date.parse(d.date) >= t12);
  const usd12 = d12.map((d) => toUsd(amountOf(d))).filter((v) => v != null).sort((a, b) => a - b);
  const med = usd12.length ? usd12[Math.floor(usd12.length / 2)] : null;
  const mix = TX_GROUPS.map((g) => [g.label, d12.filter((d) => _grpOf(txOf(d)) === g.key).length]).filter(([, n]) => n).map(([l, n]) => `${l} ${n}`).join(" · ") || "—";
  const secN = {}; d12.forEach((d) => { const k = sectorOf(d); secN[k] = (secN[k] || 0) + 1; });
  const topSec = Object.entries(secN).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, n]) => `${SECTOR_LABEL[k] || k} ${n}`).join(" · ") || "—";
  const fs = fundsByManager(m.id);
  const veh = ((VEHICLES && VEHICLES[m.id]) || []).length + (BDCS || []).filter((b) => b.managerId === m.id && !((VEHICLES && VEHICLES[m.id]) || []).some((v) => Number(v.cik) === Number(b.cik))).length;
  const last = ds.reduce((a, d) => (!a || d.date > a ? d.date : a), "");
  // Same count as the profile header: deals + intel + press, de-duplicated by story.
  const seen = new Set();
  const evN = [...ds, ...intel.filter((i) => i.managerId === m.id), ...(m.webNews || []), ...(m.news || [])]
    .filter((x) => { const k = feedDedupKey(x); if (seen.has(k)) return false; seen.add(k); return !!x.date; }).length;
  return [
    ["HQ", esc(m.hq || "—")], ["Founded", esc(String(m.founded || "—"))],
    ["Group AUM", m.notAum ? "n/a" : esc(fmtAumC(m.aumTotal != null ? m.aumTotal : m.aum))],
    ["Credit AUM", m.aumCredit != null ? esc(fmtAumC(m.aumCredit)) : "—"],
    ["Strategies", esc((m.strategies || []).join(" · ") || "—")],
    ["Funds (in market)", `${fs.length} (${fs.filter((f) => !f.evergreen && (f.status === "Open" || f.status === "First Close")).length})`],
    ["Listed vehicles / BDCs", String(veh)],
    ["Tracked items", String(evN)],
    ["Deals · all / 12m / 90d", `${ds.length} / ${d12.length} / ${ds.filter((d) => Date.parse(d.date) >= t90).length}`],
    ["Deal mix · 12m", esc(mix)],
    ["Median disclosed deal · 12m", med != null ? esc(fmtUsd(med)) : "—"],
    ["Top sectors · 12m", esc(topSec)],
    ["Latest deal", last ? esc(fmtDate(last)) : "—"],
    ["Advisers on file", String((m.advisers || []).length)],
  ];
}
export function viewCompare(a, b) {
  const A = managerById[a], B = managerById[b];
  if (!A) return notFound(app);
  const pick = (cur, other, side) => `<select class="tx-filt tcmp-pick" data-side="${side}" aria-label="Choose a manager to compare">${[...managers].sort((x, y) => x.name.localeCompare(y.name)).map((m) => `<option value="${esc(m.id)}"${m.id === cur ? " selected" : ""}${m.id === other ? " disabled" : ""}>${esc(m.name)}</option>`).join("")}</select>`;
  const sa = mgrStats(A), sb = B ? mgrStats(B) : sa.map(([k]) => [k, ""]);
  const head = (m, side, other) => `<th class="tcmp-h"><a href="#/manager/${esc(m ? m.id : "")}">${esc(m ? m.name : "Choose a manager")}</a>${pick(m && m.id, other, side)}</th>`;
  app.innerHTML = `
    <div class="tdash">
      ${breadcrumb([["#/", "Managers"], [null, "Compare"]])}
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full">
          <div class="tdet-id"><h1>Compare managers</h1></div>
          <div class="tleague-wrap"><table class="tleague tleague-full tcmp-tbl">
            <thead><tr><th></th>${head(A, "a", b)}${head(B, "b", a)}</tr></thead>
            <tbody>${sa.map(([k, v], i) => `<tr><td class="tcmp-k">${esc(k)}</td><td>${v}</td><td>${sb[i][1]}</td></tr>`).join("")}</tbody>
          </table></div>
        </section>
      </div>
    </div>`;
  app.querySelectorAll(".tcmp-pick").forEach((sel) => sel.addEventListener("change", () => {
    const na = sel.dataset.side === "a" ? sel.value : a, nb = sel.dataset.side === "b" ? sel.value : (b || "");
    location.hash = `#/compare/${encodeURIComponent(na)}/${encodeURIComponent(nb)}`;
  }));
}

export function viewManager(id, tab0) {
  const m = managerById[id];
  if (!m) return notFound(app);
  const fs = fundsByManager(id).sort((a, b) => b.vintage - a.vintage);
  const news = intelForManager(id);
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
      // A deal counts on every firm that is a party to it — filed under it, a lender in
      // its club, or its sponsor (R39m).
      ...deals.filter((d) => belongs(d) || dealRoleFor(d, id)).map((d) => ({ ...d, _kind: "deal" })),
      ...intel.filter(belongs).map((i) => ({ ...i, _kind: "intel" })),
      ...[...(m.news || []), ...(m.webNews || [])].map((x) => ({ ...x, _kind: "news", _mid: m.id, _mname: m.name })),
    ];
    const seen = new Set();
    return items
      .filter((x) => { const k = feedDedupKey(x); if (seen.has(k)) return false; seen.add(k); return true; })
      .sort(byDateDesc);
  })();

  // The manager is implicit on this page, so we surface the fund inline instead.
  const mgrWireRow = (x) => crWireRow(x, x.fundId && fundById[x.fundId]
    ? `<button type="button" class="tw-mgr tw-fundlink" data-openfund="${esc(x.fundId)}">${esc(fundById[x.fundId].name)}</button>` : "");
  // ---- panes: News (default) · Vehicles (Funds + CLOs + listed) · Investments ·
  //      Business ----
  const newsPane = mgrFeed.length
    ? `<ul class="twire compact-list" id="mgr-wire">${mgrFeed.map(mgrWireRow).join("")}</ul>`
    : '<p class="tw-empty muted small">No news yet for this manager.</p>';
  // A fund has no page of its own (retired), so its row EXPANDS in place to the
  // fund's facts, named investors (linked to their profile when covered) and sources —
  // a real destination, instead of a link that redirected back to this same page.
  const fundSize = (x) => x.evergreen ? "Evergreen" : x.raised != null ? money(x.raised, x.ccy) + (x.status === "Final Close" ? "" : " raised") : (x.targetSize ? money(x.targetSize, x.ccy) + " target" : "—");
  const fundsList = fs.length
    ? `<ul class="tmini">${fs.map((x) => `<li class="tmini-row clickable fund-exp" id="row-fund-${esc(x.id)}" data-fund="${esc(x.id)}" role="button" tabindex="0" aria-expanded="false"><span class="tmini-t"><span class="tx-caret" aria-hidden="true">▸</span>${esc(x.name)}<span class="tmini-r">${esc(fundSize(x))}</span></span><span class="tmini-m">Vintage ${x.vintage} · ${esc(x.status || x.strategy || "")}</span><div class="fund-body" hidden></div></li>`).join("")}</ul>`
    : "";
  const closList = mgrCloRoster.length
    ? `<ul class="tmini">${mgrCloRoster.map((c) => `<li class="tmini-row clickable" data-href="#/clo/${m.id}/${encodeURIComponent(c.name)}"><span class="tmini-t">${esc(c.name)}<span class="tmini-r">${c.size ? esc(c.size) : ""}</span></span><span class="tmini-m">${c.vintage ? "Vintage " + esc(c.vintage) : "Issued"}</span></li>`).join("")}</ul>`
    : "";
  // Investments — the manager's deal activity from the news we've surfaced, tagged
  // debt/equity (+ sub-type where the article says so). mgrFeed is date-sorted.
  const investments = mgrFeed.filter((x) => x._kind === "deal" && INVEST_TYPES.has(x.type));
  const invPane = investments.length
    ? `<div class="tleague-wrap"><table class="tleague tleague-full tinv-tbl">`
      + `<thead><tr><th>Company / borrower</th><th>Deal</th><th>Instrument</th><th>Amount</th><th>Date</th><th class="tinv-c-src">Source</th></tr></thead>`
      + `<tbody>${investments.map((d) => invRow(d, id)).join("")}</tbody></table></div>`
    : `<p class="tw-empty muted small">No investments identified yet from the news surfaced for this manager.</p>`;
  const peoplePane = (() => {
    let out = "";
    // Ownership & senior counsel: entity/person rows in the shared .tmini list style.
    if (m.owners && m.owners.length) out += `<div class="tpg"><div class="tpg-h">Ownership</div><ul class="tmini">${m.owners.map((o) => `<li class="tmini-row"><span class="tmini-t">${esc(o.name)}<span class="tmini-r tmini-r-inline">${esc(o.stake)}</span></span></li>`).join("")}</ul></div>`;
    if (m.legal && m.legal.length) out += `<div class="tpg"><div class="tpg-h">Legal &amp; senior counsel</div><ul class="tmini">${m.legal.map((p) => `<li class="tmini-row"><span class="tmini-t">${esc(p.name)}${p.linkedin ? ` · <a href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer" class="tw-mgr">LinkedIn</a>` : ""}</span><span class="tmini-m">${esc(p.role || "")}${p.city ? " · " + esc(p.city) : ""}</span></li>`).join("")}</ul></div>`;
    // Headcount: numeric facts in the shared .tbiz key/value style. Only rows with a
    // real figure render — an undisclosed count is dropped rather than shown as a
    // "—" placeholder (so a firm that only discloses a total reads as one clean row,
    // not two empty ones).
    if (m.headcount) {
      const h = m.headcount;
      const hrows = [["Investment professionals", h.investment], ["Other professionals", h.other], ["Total", h.total]]
        .filter(([, v]) => v != null).map(([k, v]) => bizRow(k, esc(String(v))));
      if (hrows.length) out += `<div class="tpg"><div class="tpg-h">Headcount${h.asOf ? ` · as of ${esc(h.asOf)}` : ""}</div><ul class="tbiz">${hrows.join("")}</ul></div>`;
    }
    if (m.filings && m.filings.length) out += `<div class="tpg"><div class="tpg-h">Regulatory &amp; account filings</div><ul class="tmini">${m.filings.map((x) => `<li class="tmini-row"><a class="tmini-t" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.label)}</a>${x.date ? `<span class="tmini-m">${esc(x.date)}</span>` : ""}</li>`).join("")}</ul></div>`;
    return out;
  })();
  // ---- Business tab: Book & business + Advisers + ownership/personnel. Shown
  // only when there's something to show (render-if-present); also the sole home
  // for the ownership/counsel data (previously computed but never rendered). ----
  const businessPane = bookHTML(m) + advisersHTML(m) + peoplePane;
  const hasBiz = businessPane.trim().length > 0;
  // ---- Listed vehicles (BDC / registered CEF) — live holdings from SEC ----
  // Rendered in the SAME .tmini row style as Funds/CLOs: a clickable row that
  // expands its latest SEC holdings inline (no separate card chrome).
  // Listed / non-traded BDCs this manager advises (the Dashboard ▸ Credit BDC roster) join
  // the SEC-filer vehicles, de-duplicated by CIK.
  const vehicles = [...((VEHICLES && VEHICLES[m.id]) || [])];
  (BDCS || []).filter((b) => b.managerId === m.id && b.cik && !vehicles.some((v) => Number(v.cik) === Number(b.cik)))
    .forEach((b) => vehicles.push({ name: b.name, ticker: b.ticker, cik: b.cik, type: "bdc" }));
  const vehRow = (v) => {
    const tag = v.type === "cef" ? "CEF · N-PORT" : "BDC · 10-Q";
    return `<li class="tmini-row clickable veh-load" data-cik="${esc(v.cik)}" data-type="${esc(v.type)}" data-nm="${esc(v.name)}">`
      + `<span class="tmini-t">${esc(v.name)}${v.ticker ? ` <span class="veh-tk">${esc(v.ticker)}</span>` : ""}<span class="tmini-r">${tag}</span></span>`
      + `<span class="tmini-m veh-cta" id="vehcta-${esc(v.cik)}">Tap to load latest holdings</span>`
      + `<div class="veh-body" id="veh-${esc(v.cik)}"></div></li>`;
  };
  const listedList = vehicles.length ? `<ul class="tmini">${vehicles.map(vehRow).join("")}</ul>` : "";
  // Merged Vehicles tab: Funds + CLOs + listed BDC/CEF vehicles, each a labelled
  // group (groups with nothing to show are omitted).
  const vehGrp = (label, n, body) => body ? `<div class="tveh-grp"><div class="tveh-grp-h">${label}${n ? ` <span class="tveh-grp-n">${n}</span>` : ""}</div>${body}</div>` : "";
  const vehCount = fs.length + mgrCloRoster.length + vehicles.length;
  const vehiclesPane = (vehGrp("Funds", fs.length, fundsList) + vehGrp("CLOs", mgrCloRoster.length, closList) + vehGrp("Listed vehicles", vehicles.length, listedList)).trim()
    || `<p class="tw-empty muted small">${esc(m.fundsNote || "No funds, CLOs or listed vehicles tracked (bank/balance-sheet lender, no dedicated credit arm, or US/global-only vehicles).")}</p>`;
  const pane = (p, inner) => `<div class="tpane" data-p="${p}"${p === "news" ? "" : " hidden"}>${inner}</div>`;

  // Peers: nearest managers by strategy overlap + AUM proximity (see peers.js) —
  // a collapsible header dropdown above the Sources line.
  const mgrPeers = peersOf(m, managers, { tags: (x) => x.strategies || [], size: (x) => x.groupAum != null ? x.groupAum : x.aum, n: 5 });
  const mgrPeersDetails = peerDetails(mgrPeers, (e) => `#/manager/${e.id}`, (p) => {
    const s = p.shared[0] || (p.e.strategies || [])[0] || "";
    const a = p.e.aum != null ? fmtAumC(p.e.aum) : "";
    return [s, a].filter(Boolean).join(" · ");
  }, esc);

  app.innerHTML = `
    <div class="tdash">
      ${breadcrumb([["#/", "Managers"], [null, m.name]])}
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full tdet-tabbed">
          <div class="tdet-id">
            <h1>${nameCell("manager", m.id, esc(m.name))}</h1>
            <div class="tdet-sub">${esc(m.hq)} · Founded ${m.founded}${aumLine(m)}</div>
            ${latestLine(mgrFeed)}
            ${m.strategies && m.strategies.length ? `<div class="tdet-chips">${m.strategies.map((s) => `<span class="tdet-chip">${esc(s)}</span>`).join("")}</div>` : ""}
            ${mgrPeersDetails}
            <details class="tdet-src-det tdet-compare"><summary>Compare</summary><div class="tdet-src-body">${mgrPeers.map((p) => `<div class="tdet-peer-row"><a class="tdet-peer" href="#/compare/${esc(m.id)}/${esc(p.e.id)}">vs ${esc(p.e.name)}</a></div>`).join("")}<div class="tdet-peer-row"><a class="tdet-peer" href="#/compare/${esc(m.id)}/">vs any manager…</a></div></div></details>
            ${srcDetails(m)}
          </div>
          <header class="tpanel-h twire-head">
            <div class="tchips" id="mgr-tabs">
              <button type="button" class="tchip is-on" data-p="news">News</button>
              <button type="button" class="tchip" data-p="vehicles">Vehicles${vehCount ? " " + vehCount : ""}</button>
              <button type="button" class="tchip" data-p="investments">Investments${investments.length ? " " + investments.length : ""}</button>
              <button type="button" class="tchip" data-p="timeline">Timeline</button>
              ${hasBiz ? `<button type="button" class="tchip" data-p="business">Business</button>` : ""}
            </div>
          </header>
          <div class="tpanes" id="mgr-panes">
            ${pane("news", newsPane)}
            ${pane("vehicles", vehiclesPane)}
            ${pane("investments", invPane)}
            ${pane("timeline", timelineHTML(deals.filter(belongs)))}
            ${hasBiz ? pane("business", businessPane) : ""}
          </div>
        </section>
      </div>
    </div>`;
  // Toggle which pane (News / Vehicles / Investments / Business) is shown.
  const tabs = $id("mgr-tabs");
  if (tabs) tabs.addEventListener("click", (e) => {
    const b = e.target.closest(".tchip"); if (!b) return;
    tabs.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    const p = b.dataset.p;
    _chipMem[chipMemKey("mgr-tabs")] = p || "news";
    (app || document).querySelectorAll("#mgr-panes .tpane").forEach((el) => { el.hidden = el.dataset.p !== p; });
    tabUrl("manager", m.id, p, "news");
  });
  // Investments rows expand in place to show the sourced narrative (+ sponsor).
  const mgrPanes = $id("mgr-panes");
  if (mgrPanes) mgrPanes.addEventListener("click", (e) => {
    const row = e.target.closest("tr.tinv-row.is-exp");
    if (!row || e.target.closest("a")) return;
    const exp = row.nextElementSibling;
    if (exp && exp.classList.contains("tinv-exp")) { const open = exp.hasAttribute("hidden"); exp.hidden = !open; row.classList.toggle("is-open", open); }
  });
  // Fund rows expand in place (Vehicles); a fund named on a News row jumps to the
  // Vehicles tab and opens that fund.
  const toggleFund = (li, open) => {
    const body = li.querySelector(".fund-body"); if (!body) return;
    const on = open != null ? open : body.hidden;
    if (on && !body.dataset.built) { body.innerHTML = fundBodyHTML(fundById[li.dataset.fund] || {}); body.dataset.built = "1"; }
    body.hidden = !on; li.classList.toggle("is-open", on); li.setAttribute("aria-expanded", String(on));
  };
  if (mgrPanes) mgrPanes.addEventListener("click", (e) => {
    const jump = e.target.closest("[data-openfund]");
    if (jump) {
      const li = $id("row-fund-" + jump.dataset.openfund);
      const vb = tabs && tabs.querySelector('.tchip[data-p="vehicles"]');
      if (vb) vb.click();
      if (li) { toggleFund(li, true); li.scrollIntoView({ block: "center" }); }
      return;
    }
    const li = e.target.closest("li.fund-exp");
    if (!li || e.target.closest("a") || e.target.closest(".fund-body")) return;
    toggleFund(li);
  });
  if (mgrPanes) mgrPanes.addEventListener("keydown", (e) => {
    const li = e.target.closest && e.target.closest("li.fund-exp");
    if (li && e.target === li && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); toggleFund(li); }
  });
  // Listed-vehicle holdings: tapping the row fetches the latest N-PORT (CEF) or
  // 10-Q SOI (BDC) and expands it inline; tapping again collapses/re-expands.
  // Clicks inside the loaded holdings (source links etc.) must NOT toggle.
  (app || document).querySelectorAll("#mgr-panes .veh-load").forEach((row) => row.addEventListener("click", (e) => {
    if (e.target.closest(".veh-body")) return;
    const cik = row.dataset.cik, type = row.dataset.type;
    const body = $id("veh-" + cik);
    const cta = $id("vehcta-" + cik);
    if (!body) return;
    if (body.dataset.state === "loading") return;
    if (body.dataset.state === "loaded") {                 // toggle collapse/expand
      const hidden = body.style.display === "none";
      body.style.display = hidden ? "" : "none";
      if (cta) cta.textContent = hidden ? "Latest holdings" : "Tap to show latest holdings";
      return;
    }
    body.dataset.state = "loading";
    if (cta) cta.textContent = "Fetching latest SEC filing…";
    body.innerHTML = `<p class="tw-empty muted small">Fetching latest SEC filing…</p>`;
    fetch(`${type === "cef" ? "/api/nport" : "/api/bdc"}?cik=${encodeURIComponent(cik)}`, { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { body.dataset.state = "loaded"; if (cta) cta.textContent = "Latest holdings"; renderVehicle(body, d, type); })
      .catch(() => { body.dataset.state = ""; if (cta) cta.textContent = "Tap to retry"; body.innerHTML = `<p class="tw-empty muted small">Holdings unavailable right now — try again shortly.</p>`; });
  }));
  if (tabs) {
    // The URL's tab wins; a story deep link (?focus=) needs the News pane; otherwise
    // the last tab viewed on this route.
    const focusNews = pendingFocus && pendingFocus.view === "manager";
    const k0 = tab0 || (focusNews ? "news" : _chipMem[chipMemKey("mgr-tabs")]);
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
  const items = [...c.items].sort(byDateDesc);
  const otherClos = roster.filter((r) => r.name !== c.name);
  const otherList = otherClos.length
    ? `<ul class="tmini">${otherClos.map((r) => `<li class="tmini-row clickable" data-href="#/clo/${mid}/${encodeURIComponent(r.name)}"><span class="tmini-t">${esc(r.name)}<span class="tmini-r">${r.size ? esc(r.size) : ""}</span></span><span class="tmini-m">${r.vintage ? "Vintage " + esc(r.vintage) : "Issued"}</span></li>`).join("")}</ul>`
    : `<p class="tw-empty muted small">No other tracked CLOs from this manager.</p>`;
  const wire = items.length
    ? `<ul class="twire compact-list" id="clo-wire">${items.map((x) => crWireRow(x, "")).join("")}</ul>`
    : `<p class="tw-empty muted small">No tracked activity for this CLO yet.</p>`;
  // Same layout as the manager / hedge-fund pages: identity header, then a section
  // rail — Activity (issuance, pricings, resets, news) · Other CLOs from the manager.
  app.innerHTML = `
    <div class="tdash">
      ${breadcrumb([["#/managers", "Managers"], ["#/manager/" + mid, m.name], [null, c.name]])}
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full tdet-tabbed">
          <div class="tdet-id">
            <h1>${esc(c.name)}</h1>
            <div class="tdet-sub">CLO · managed by ${link("#/manager/" + mid, m.name)}${c.vintage ? ` · Vintage ${esc(c.vintage)}` : ""}${c.size ? ` · ${esc(c.size)}` : ""}</div>
            ${latestLine(items)}
            <div class="tdet-chips"><span class="tdet-chip">Structured Credit</span>${c.vintage ? `<span class="tdet-chip">Vintage ${esc(c.vintage)}</span>` : ""}<span class="tdet-chip">${roster.length} CLO${roster.length === 1 ? "" : "s"} from ${esc(m.name)}</span></div>
          </div>
          ${tabbedHTML({ tabsId: "clo-tabs", panesId: "clo-panes", active: "activity", tabs: [
            { k: "activity", label: "Activity", n: items.length, html: wire },
            { k: "others", label: "Other CLOs", n: otherClos.length, html: otherList },
          ] })}
        </section>
      </div>
    </div>`;
  bindTabs(app, { tabsId: "clo-tabs", panesId: "clo-panes" });
  applyPendingFocus("clos");
}

// ================================ INVESTORS =================================
// The names an investor is cited by in deal / fundraising copy: its record name
// without the parenthetical, plus any vehicle it manages ("APG (manages ABP)" →
// APG, ABP). Word-bounded, so "Keva" never matches inside another word.
function lpTerms(l) {
  const out = [String(l.name || "").replace(/\s*\(.*?\)\s*/g, " ").trim()];
  const par = /\((?:manages\s+)?([^)]+)\)/i.exec(l.name || "");
  if (par) out.push(par[1].trim());
  return [...new Set(out.filter((t) => t.length >= 3))];
}
const reEsc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Deals / fundraising items whose headline or summary NAME the investor — the
// sourced record of what it has backed. An item where the matched name is the
// item's own manager (e.g. "Allianz" on an Allianz Global Investors deal) is not a
// mention of the investor, so it is skipped.
export function lpMentions(l) {
  const terms = lpTerms(l);
  if (!terms.length) return [];
  const re = new RegExp("\\b(?:" + terms.map(reEsc).join("|") + ")\\b", "i");
  return [...deals.map((d) => ({ ...d, _kind: "deal" })), ...intel.map((i) => ({ ...i, _kind: "intel" }))]
    .filter((x) => {
      const txt = (x.headline || "") + " " + (x.summary || "");
      if (!re.test(txt)) return false;
      const mName = ((managerById[x.managerId] || {}).name || "").toLowerCase();
      return !terms.some((t) => mName.includes(t.toLowerCase()));
    })
    .sort(byDateDesc);
}

export function viewLp(id, tab0) {
  const l = lpById[id];
  if (!l) return notFound(app);
  const pcAum = l.pcAllocationPct != null ? (l.aum * l.pcAllocationPct / 100) : null;
  const commits = commitmentsForLp(l.id);
  // Funds that name this investor on their own record (fund.investors) — with the
  // commitments above, the investor's known positions.
  const fundsIn = funds.filter((f) => (f.investors || []).some((i) => i.lpId === l.id) && !commits.some((c) => c.fundId === f.id));
  const mentions = lpMentions(l);
  const kvFig = [
    ["Total AUM", fmtAumC(l.aum)], ["PC allocation", pct(l.pcAllocationPct)],
    ["Implied PC AUM", pcAum != null ? "$" + pcAum.toFixed(1) + "bn" : "—"], ["Typical ticket", usdM(l.typicalTicket)],
  ];
  const commitRows = [
    // Newest first; each commitment shows its amount, date and public source (review #15).
    ...commits.slice().sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).map((c) => {
      const mName = (managerById[c.managerId] || {}).name || c.manager || "—";
      const fName = c.fundId && fundById[c.fundId] ? fundById[c.fundId].name : (c.fund || "");
      const amt = c.amount != null ? `${{ EUR: "€", GBP: "£", USD: "$" }[c.ccy] || (c.ccy ? c.ccy + " " : "")}${c.amount >= 1000 ? +(c.amount / 1000).toFixed(2) + "bn" : c.amount + "m"}` : "";
      const meta = [amt, c.date ? fmtDate({ date: c.date.length === 7 ? c.date + "-01" : c.date, datePrecision: c.date.length === 7 ? "month" : null }) : "", c.strategy || ""].filter(Boolean).join(" · ");
      const src = c.sourceUrl ? ` <a href="${esc(c.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="tmini-src">source</a>` : "";
      return `<li class="tmini-row${c.managerId ? " clickable" : ""}"${c.managerId ? ` data-href="#/manager/${esc(c.managerId)}"` : ""}><span class="tmini-t">${esc(mName)}${fName ? `<span class="tmini-r">${esc(fName)}</span>` : ""}</span>${meta ? `<span class="tmini-m">${esc(meta)}${src}</span>` : ""}${c.note ? `<span class="tmini-m">${esc(c.note)}${meta ? "" : src}</span>` : ""}</li>`;
    }),
    ...fundsIn.map((f) => { const i = (f.investors || []).find((x) => x.lpId === l.id) || {}; return `<li class="tmini-row clickable" data-href="#/manager/${esc(f.managerId)}"><span class="tmini-t">${esc((managerById[f.managerId] || {}).name || "")}<span class="tmini-r">${esc(f.name)}</span></span>${i.note ? `<span class="tmini-m">${esc(i.note)}</span>` : ""}</li>`; }),
  ];
  const commitsBody = commitRows.length
    ? `<ul class="tmini">${commitRows.join("")}</ul>`
    : `<p class="tw-empty muted small">No specific commitments publicly disclosed.</p>`;
  const mentionRow = (x) => crWireRow({ ...x }, x.managerId && managerById[x.managerId] ? `<a href="#/manager/${esc(x.managerId)}" class="tw-mgr">${esc(managerById[x.managerId].name)}</a>` : "");
  const mentionsBody = mentions.length
    ? `<ul class="twire compact-list" id="lp-mentions">${mentions.slice(0, 60).map(mentionRow).join("")}</ul>`
    : `<p class="tw-empty muted small">No tracked deal or fundraising item names this investor yet.</p>`;

  // Peers: nearest investors by allocator type + strategy overlap + AUM proximity.
  const lpPeers = peersOf(l, lps, { tags: (x) => x.strategies || [], cat: (x) => x.type, size: (x) => x.aum, n: 5 });
  const lpPeersDetails = peerDetails(lpPeers, (e) => `#/lp/${e.id}`, (p) => {
    const a = p.e.aum != null ? fmtAumC(p.e.aum) : "";
    return [p.e.type || "", a].filter(Boolean).join(" · ");
  }, esc);

  // Same layout as the manager / hedge-fund pages: identity header (with the AUM line),
  // then a section rail — Commitments · Mentioned in · Profile (key figures, mandate).
  const profilePane = `<div class="tpg"><div class="tpg-h">Key figures</div><ul class="tbiz">${kvFig.map(([k, v]) => bizRow(k, esc(String(v)))).join("")}</ul></div>`
    + `<div class="tpg"><div class="tpg-h">Strategies of interest</div><div class="tdet-chips">${l.strategies.map((x) => `<span class="tdet-chip">${esc(x)}</span>`).join("")}</div></div>`
    + (aumNote(l, "aum", AUM_FX) ? `<p class="tdet-latest">${esc(aumNote(l, "aum", AUM_FX))}</p>` : "");
  const first = commitRows.length ? "commitments" : mentions.length ? "mentions" : "profile";
  app.innerHTML = `
    <div class="tdash">
      ${breadcrumb([[profilesMode ? "#/?tab=investors" : "#/lps", "Investors"], [null, l.name]])}
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full tdet-tabbed">
          <div class="tdet-id">
            <h1>${nameCell("lp", l.id, esc(l.name))}</h1>
            <div class="tdet-sub">${esc(l.type)} · ${esc(l.hq)}${l.aum != null ? ` · <span class="tdet-aum"${aumNote(l, "aum", AUM_FX) ? ` title="${esc(aumNote(l, "aum", AUM_FX))}"` : ""}>AUM ${esc(fmtAumC(l.aum))}</span>` : ""}${l.pcAllocationPct != null ? ` · PC allocation ${esc(pct(l.pcAllocationPct))}` : ""}</div>
            ${latestLine(mentions)}
            ${l.notes ? `<p class="tdet-desc">${esc(l.notes)}</p>` : ""}
            <div class="tdet-chips"><span class="tdet-chip"${l.mandateInferred ? ' title="Inferred from the dates of its latest public commitments"' : ""}>${esc(l.mandateStatus)}${l.mandateInferred ? " (inferred)" : ""}</span>${l.strategies.map((x) => `<span class="tdet-chip">${esc(x)}</span>`).join("")}</div>
            ${lpPeersDetails}
            ${srcDetails(l)}
          </div>
          ${tabbedHTML({ tabsId: "lp-tabs", panesId: "lp-panes", active: tab0 || first, tabs: [
            { k: "commitments", label: "Commitments", n: commitRows.length, html: `<div id="lp-commits">${commitsBody}</div>` },
            { k: "mentions", label: "Mentioned in", n: mentions.length, html: mentionsBody },
            { k: "profile", label: "Profile", html: profilePane },
          ] })}
        </section>
      </div>
    </div>`;
  bindTabs(app, { tabsId: "lp-tabs", panesId: "lp-panes", route: "lp", entityId: l.id, def: first });
}

// ================================ HEDGE FUNDS ================================
// Per-fund detail: firm facts (AUM + source, strategy, region, performance) plus
// a live top-holdings table pulled from the fund's most recent SEC 13F-HR via
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
// Render a listed vehicle's top holdings (N-PORT for CEFs, 10-Q SOI for BDCs).
function renderVehicle(body, d, type) {
  const link = (d && d.source) ? ` · <a href="${esc(d.source)}" target="_blank" rel="noopener noreferrer" class="tw-mgr">latest filing</a>` : "";
  if (!d || !Array.isArray(d.holdings) || !d.holdings.length) {
    body.innerHTML = `<p class="tw-empty muted small">${type === "bdc" ? "Could not parse this filer's Schedule of Investments automatically" : "No N-PORT holdings available"}${link ? " — see the" + link : "."}</p>`;
    return;
  }
  const usd = (v) => v >= 1e9 ? "$" + (v / 1e9).toFixed(2) + "bn" : v >= 1e6 ? "$" + (v / 1e6).toFixed(0) + "m" : "$" + Math.round(v || 0).toLocaleString("en-US");
  const rows = d.holdings.map((h, i) => `<tr><td class="tl-n">${i + 1}</td><td class="tl-nm">${esc(h.name || "—")}</td>`
    + `<td class="tl-n">${usd(h.value)}</td><td class="tl-n">${h.weight != null && isFinite(h.weight) ? (h.weight * 100).toFixed(1) + "%" : "—"}</td></tr>`).join("");
  body.innerHTML = `<div class="tleague-wrap"><table class="tleague tl-holdings"><thead><tr><th>#</th>`
    + `<th>${type === "bdc" ? "Portfolio company" : "Holding"}</th><th>Fair value</th><th>${type === "bdc" ? "% of book" : "% of NAV"}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function hfHoldingsTable(d, perfMap) {
  if (!d || !Array.isArray(d.holdings) || !d.holdings.length) return null;
  const flag = (h) => (h.opt ? ` <span class="hf-fl" title="Held via options (puts/calls) — 13F reports held options only">opt</span>` : "")
    + (h.prn ? ` <span class="hf-fl" title="Held as a convertible / debt-type 13(f) security">conv</span>` : "");
  const rows = d.holdings.map((h, i) => `<tr>`
    + `<td class="tl-n">${i + 1}</td>`
    + `<td class="tl-nm">${esc(h.name || "—")}${flag(h)}</td>`
    + `<td class="tl-tick">${h.ticker ? `<a href="https://finance.yahoo.com/quote/${encodeURIComponent(h.ticker)}" target="_blank" rel="noopener noreferrer" title="${esc(h.ticker)} on Yahoo Finance">${esc(h.ticker)}</a>` : "—"}</td>`
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

export function viewHedgeFund(id, tab0) {
  const f = HEDGE_FUNDS.find((x) => x.id === id);
  if (!f) return notFound(app);
  const secUrl = f.cik ? `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${esc(f.cik)}&type=13F-HR&dateb=&owner=include&count=40` : null;
  // News for this fund — the hedge-fund intelligence stream (HEDGE_INTEL),
  // shaped into the shared credit wire row, newest first.
  const news = (HEDGE_INTEL || []).filter((h) => h.hfId === f.id)
    .map((h) => ({ _kind: "news", title: h.headline, outlet: h.outlet, url: h.url, date: h.date || "", time: h.time || "" }))
    .sort(byDateDesc);

  const newsPane = news.length
    ? `<ul class="twire compact-list" id="hf-news">${news.map((x) => crWireRow(x, "")).join("")}</ul>`
    : '<p class="tw-empty muted small">No news tracked for this fund yet.</p>';
  const holdingsPane = f.cik
    ? `<p class="hf-asof-line"><span class="tf-k">13F period</span> <span id="hf-asof">…</span></p><div id="hf-holdings"><p class="tw-empty muted small">Loading latest 13F holdings…</p></div>`
    : `<p class="tw-empty muted small">No US 13F / not disclosed.</p>`;
  const filingsPane = f.cik
    ? `<div id="hf-filings"><p class="tw-empty muted small">Loading recent SEC filings…</p></div>`
    : `<p class="tw-empty muted small">No US SEC filer.</p>`;
  const pane = (p, inner) => `<div class="tpane" data-p="${p}"${p === "news" ? "" : " hidden"}>${inner}</div>`;

  // Peers: nearest hedge funds by strategy (token + exact-class match) + AUM.
  const hfPeers = peersOf(f, HEDGE_FUNDS, { tags: (x) => hfStrategyTokens(x.strategy), cat: (x) => x.strategy, size: (x) => x.aum, n: 5 });
  const hfPeersDetails = peerDetails(hfPeers, (e) => `#/hf/${e.id}`, (p) => {
    const a = p.e.aum != null ? `$${p.e.aum}bn` : "";
    return [p.e.strategy || "", a].filter(Boolean).join(" · ");
  }, esc);

  app.innerHTML = `
    <div class="tdash">
      ${breadcrumb([["#/", "Hedge Funds"], [null, f.name]])}
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full tdet-tabbed">
          <div class="tdet-id">
            <h1>${nameCell("hf", f.id, esc(f.name))}</h1>
            <div class="tdet-sub">${esc(f.hq)} · ${esc(f.region)}${f.founded ? " · Founded " + esc(String(f.founded)) : ""}${f.founder ? " · " + esc(f.founder) : ""}</div>
            ${latestLine(news)}
            ${f.perf && f.perf.text ? `<p class="tdet-desc">Performance: ${esc(f.perf.text)}${f.perf.asOf && !String(f.perf.text).includes(String(f.perf.asOf)) ? ` <span class="tf-est">${esc(f.perf.asOf)}</span>` : ""}${f.perf.source ? ` · <a href="${esc(f.perf.source)}" target="_blank" rel="noopener noreferrer" class="tw-mgr">source</a>` : ""}</p>` : ""}
            <div class="tdet-chips"><span class="tdet-chip">${esc(f.strategy)}</span>${f.aum != null ? `<span class="tdet-chip">$${esc(f.aum.toFixed(2))}bn AUM</span>` : ""}${f.raum != null ? `<span class="tdet-chip" data-raum title="Regulatory assets under management from the firm's SEC Form ADV — gross of leverage, so usually above net AUM">$${esc(f.raum.toFixed(1))}bn regulatory AUM (SEC)</span>` : ""}</div>
            ${hfPeersDetails}
            <div class="tdet-src">${f.aumSource ? `AUM: <a href="${esc(f.aumSource)}" target="_blank" rel="noopener noreferrer">source${f.aumAsOf ? " (as of " + esc(f.aumAsOf) + ")" : ""}</a>` : ""}${f.raumSource ? `${f.aumSource ? " · " : ""}Regulatory AUM: <a href="${esc(f.raumSource)}" target="_blank" rel="noopener noreferrer">SEC Form ADV${f.raumAsOf ? " (filed " + esc(f.raumAsOf) + ")" : ""}</a>` : ""}${f.url ? `${(f.aumSource || f.raumSource) ? " · " : ""}<a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">Firm website</a>` : ""}${secUrl ? `${(f.aumSource || f.raumSource || f.url) ? " · " : ""}<a href="${esc(secUrl)}" target="_blank" rel="noopener noreferrer">SEC EDGAR — 13F filings</a>` : ""}</div>
          </div>
          <header class="tpanel-h twire-head">
            <div class="tchips" id="hf-tabs">
              <button type="button" class="tchip is-on" data-p="news">News${news.length ? " " + news.length : ""}</button>
              <button type="button" class="tchip" data-p="holdings">Holdings</button>
              <button type="button" class="tchip" data-p="filings">Filings</button>
            </div>
          </header>
          <div class="tpanes" id="hf-panes">
            ${pane("news", newsPane)}
            ${pane("holdings", holdingsPane)}
            ${pane("filings", filingsPane)}
          </div>
        </section>
      </div>
    </div>`;

  // Toggle which pane (News / Holdings / Filings) is shown — same wiring as the
  // manager page's tabs, remembered per route via _chipMem.
  const tabs = $id("hf-tabs");
  if (tabs) tabs.addEventListener("click", (e) => {
    const b = e.target.closest(".tchip"); if (!b) return;
    tabs.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    const p = b.dataset.p;
    _chipMem[chipMemKey("hf-tabs")] = p || "news";
    (app || document).querySelectorAll("#hf-panes .tpane").forEach((el) => { el.hidden = el.dataset.p !== p; });
    tabUrl("hf", f.id, p, "news");
  });

  // Live top holdings — edge-cached at /api/13f (24h TTL); cache-first via the
  // edge + browser cache, with a .catch fallback so a failed fetch degrades to a
  // note rather than throwing.
  if (f.cik) {
    fetch(`/api/13f?cik=${encodeURIComponent(f.cik)}`, { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const el = $id("hf-holdings");
        if (!el) return;
        if (!d || !Array.isArray(d.holdings) || !d.holdings.length) {
          const al = $id("hf-asof"); if (al) al.closest(".hf-asof-line").hidden = true;
          el.innerHTML = `<p class="tw-empty muted small">No US 13F holdings disclosed.</p>`;
          return;
        }
        // First paint: holdings with "…" in the four performance columns.
        el.innerHTML = hfHoldingsTable(d, null);
        const asof = $id("hf-asof");
        if (asof && d.asOf) {
          asof.textContent = "";
          if (d.source) { const a = document.createElement("a"); a.href = d.source; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = d.asOf; asof.appendChild(a); }
          else asof.textContent = d.asOf;
          // A 13F is filed up to 45 days after quarter-end and then stands for a
          // quarter: flag a period older than ~5 months as stale.
          const age = (Date.now() - Date.parse(d.asOf)) / 864e5;
          if (age > 150) asof.closest(".hf-asof-line").classList.add("is-stale");
        } else if (asof) asof.closest(".hf-asof-line").hidden = true;
        // Second phase: live 1D/3M/6M/12M price performance for the resolved
        // tickers (edge-cached ~15 min), then re-render with the figures filled.
        const syms = [...new Set(d.holdings.map((h) => h.ticker).filter(Boolean))];
        const fill = (perfMap) => { const e2 = $id("hf-holdings"); if (e2) e2.innerHTML = hfHoldingsTable(d, perfMap); };
        if (!syms.length) { fill({}); return; }
        fetch(`/api/perf?symbols=${encodeURIComponent(syms.join(","))}`, { headers: { accept: "application/json" } })
          .then((r) => (r.ok ? r.json() : null))
          .then((pr) => fill((pr && pr.perf) || {}))
          .catch(() => fill({}));
      })
      .catch(() => {
        const el = $id("hf-holdings");
        if (el) el.innerHTML = `<p class="tw-empty muted small">Holdings unavailable right now — try again shortly.</p>`;
      });
    // Stakes & insider filings (SC 13D/13G + Forms 3/4/5) from EDGAR — a compact
    // list, newest first, each linking to the filing. Edge-cached 6h.
    fetch(`/api/filings?cik=${encodeURIComponent(f.cik)}`, { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const el = $id("hf-filings");
        if (!el) return;
        const rows = (d && Array.isArray(d.filings)) ? d.filings : [];
        if (!rows.length) { el.innerHTML = `<p class="tw-empty muted small">No recent 13D/13G or insider filings.</p>`; return; }
        const cls = (k) => k === "stake-active" ? "hf-fl-13d" : k === "stake-passive" ? "hf-fl-13g" : "hf-fl-ins";
        const li = (x) => `<li class="tmini-row"><a class="tmini-t" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer"><span class="hf-fform ${cls(x.kind)}">${esc(x.form)}</span></a>`
          + `<span class="tmini-m">${x.filed ? "filed " + esc(fmtDate(x.filed)) : ""}${x.period ? " · as of " + esc(fmtDate(x.period)) : ""}</span></li>`;
        el.innerHTML = `<ul class="tmini">${rows.slice(0, 15).map(li).join("")}</ul>`;
      })
      .catch(() => { const el = $id("hf-filings"); if (el) el.innerHTML = `<p class="tw-empty muted small">Filings unavailable right now.</p>`; });
  }
  // Restore the last-viewed tab (News default) for this route.
  if (tabs) {
    // The URL's tab wins; else the last tab viewed here; else — for a fund with no
    // tracked news but a 13F on file — open on Holdings rather than an empty News pane.
    const focusNews = pendingFocus && pendingFocus.view === "hf";
    const k0 = tab0 || (focusNews ? "news" : _chipMem[chipMemKey("hf-tabs")] || (!news.length && f.cik ? "holdings" : ""));
    const b0 = k0 && k0 !== "news" ? tabs.querySelector(`.tchip[data-p="${k0}"]`) : null;
    if (b0 && !b0.classList.contains("is-on")) b0.click();
  }
  // A bell / Watchlist story deep link (?focus=k:…) scrolls to and flashes its row.
  applyPendingFocus("hf");
}
