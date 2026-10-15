// =============================================================================
// v2/js/restructuring/app.js — the Restructuring hub (/v2/restructuring/): one page
// for a European restructuring / distressed-credit reader. Every card is built ONLY
// from data Wire already holds or a public live source — nothing is inferred:
//   • Stress list         — dashboard/js/data.js CR_STRESS (the Dashboard's stress table)
//   • Plans & schemes     — legal/js/data.js `restructurings` (Part 26A plans, Part 26
//                           schemes), one row per matter + date, stage = recorded outcome
//   • Case law            — legal/js/data.js `cases`, Restructuring & Insolvency area
//   • Deals               — credit/js/data.js deals whose transaction type (credit/js/tx.js
//                           txOf) is "rx", each opening its Transactions deal drawer
//   • Insolvency stats    — EU_DISTRESS (Insolvency Service + agency default rates) and
//                           the live Eurostat bankruptcy index (/api/eurates)
//   • Hearings            — the public Rolls Building daily cause list (/api/causelist,
//                           CaTH) + dated Restructuring milestones (REG_CALENDAR)
// Every company name links to its borrower page (/v2/profiles/#/co/<name>). Each list
// previews 10 rows + "See all N" (phone AND desktop, HOUSE_STYLE R40/R41j), which opens
// the whole list in a sheet. mount(host, ctx) → { enter, leave, home }.
// =============================================================================
import { esc, MONTHS, byDateDesc, fmtD } from "/util.js";
import { CR_STRESS, EU_DISTRESS, REG_CALENDAR } from "/dashboard/js/data.js";
import { restructurings, cases } from "/legal/js/data.js";
import { deals, managers } from "/credit/js/data.js";
import { creditSource } from "/credit/js/shared.js";
import { DEAL_TAGS } from "/credit/js/deal-tags.js";
import { txOf, tagsOf, REGION_LABEL } from "/credit/js/tx.js";
import { dealCounterparty } from "../deal-parse.js";
import { coreName } from "../profiles/borrower.js";
import { liveJSON, lastKnownLabel } from "../live-cache.js";
import { evRow } from "/feed.js";

const PREVIEW = 10;
const CATH_SUMMARY = "https://www.court-tribunal-hearings.service.gov.uk/summary-of-publications?locationId=111";
const isoDay = (d) => fmtD(String(d || "")); // R43b: "15 Oct 26"
const srcLink = (u, label) => (u ? `<a class="dsh-src" href="${esc(u)}" target="_blank" rel="noopener noreferrer" title="${esc(label || "Source")}">src</a>` : "");
const asOf = (d) => (d ? `<span class="dsh-asof" title="as of ${esc(isoDay(d))}">${esc(isoDay(d))}</span>` : "");
const count = (n) => `<span class="dsh-n">(${n})</span>`;
const _mName = new Map((managers || []).map((m) => [m.id, m.name]));
const mgrName = (id) => _mName.get(id) || "";

// ---- borrower links -----------------------------------------------------------
export const borrowerPath = (name, base = "/v2") => `${base}/profiles/#/co/${encodeURIComponent(coreName(String(name || "").replace(/\*$/, "")))}`;
const coLink = (name, base) => (name ? `<a class="dsh-drill rxh-co" href="${esc(borrowerPath(name, base))}" title="Everything Wire holds on ${esc(name)}">${esc(name)}</a>` : "");

// ---- data shaping (pure; exported for specs) ------------------------------------
const STAGE = (o) => String(o || "").split("—")[0].replace(/\s*\([^)]*\)\s*/g, "").trim() || null;
const courtShort = (c) => (/court of appeal/i.test(c || "") ? "Court of Appeal" : /supreme court/i.test(c || "") ? "UK Supreme Court" : c ? "High Court (Ch)" : null);
const _key = (s) => coreName(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
// One row per matter + date: several research passes recorded some matters twice
// (same company, same date) — keep the record carrying a judgment link / citation.
export function plansAndSchemes() {
  const by = new Map();
  const score = (r) => (r.judgmentUrl ? 2 : 0) + (r.citation ? 1 : 0);
  for (const r of restructurings || []) {
    if (!r || !r.company || !r.date) continue;
    const k = `${_key(r.company).split(" ").slice(0, 2).join(" ")}|${r.date}`;
    const prev = by.get(k);
    if (!prev || score(r) > score(prev)) by.set(k, r);
  }
  return [...by.values()].sort(byDateDesc).map((r) => ({
    id: r.id, company: r.company, date: r.date, kind: r.type === "scheme" ? "Part 26 scheme" : "Part 26A plan",
    stage: STAGE(r.outcome), court: courtShort(r.court), citation: r.citation || null, src: r.judgmentUrl || r.articleUrl || null, sector: r.sector || null,
  }));
}
export function rxCases() {
  return (cases || []).filter((c) => c && c.area === "ri" && c.date).slice().sort(byDateDesc);
}
export function rxDeals() {
  const seen = new Set();
  return (deals || []).filter((d) => d && d.id && d.date && txOf(d) === "rx").slice().sort(byDateDesc)
    .filter((d) => { const k = `${d.date}|${String(d.headline || "").trim().toLowerCase()}`; if (seen.has(k)) return false; seen.add(k); return true; });
}
export function stressRows() {
  return (CR_STRESS || []).slice().sort((a, b) => String(b.latest || "").localeCompare(String(a.latest || "")));
}
export function rxMilestones(today = new Date().toISOString().slice(0, 10)) {
  return ((REG_CALENDAR && REG_CALENDAR.items) || []).filter((x) => x && x.area === "Restructuring" && x.date && String(x.date) >= today.slice(0, String(x.date).length))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

export function mount(host, ctx) {
  const base = (ctx && ctx.base) || "/v2";
  let _eu = null, _euState = null, _cause = undefined;   // undefined = loading · null = unavailable

  // ---- rows -------------------------------------------------------------------
  // Every list is the shared R43 events row (feed.js evRow): date · name / meta · tag ·
  // source, two single lines at one fixed height so 10-row previews line up across cards.
  const coRow = ({ name, date, dateText, tag: t = "", meta = [], srcHref = "", src = "", cls = "", attrs = "" }) => evRow({
    title: name, href: name ? borrowerPath(name, base) : "", inApp: true, aCls: "dsh-drill rxh-co", date, dateText,
    tag: t, meta: meta.filter(Boolean).join(" · "), srcHref, src, cls: `rxh-i${cls ? ` ${cls}` : ""}`, attrs });
  const newsLi = ({ title, href, inApp = false, date, meta = "", src = "", srcHref = "" }) => evRow({ title, href, inApp, aCls: inApp ? "dsh-drill" : "", date, meta, src, srcHref, cls: "dsh-news-i" });
  const ul = (items, empty, cls = "") => (items.length ? `<ul class="g-evs rxh-list${cls ? ` ${cls}` : ""}">${items.join("")}</ul>` : `<p class="dsh-load">${empty}</p>`);
  const newsUl = (items, empty) => (items.length ? `<ul class="g-evs dsh-news dsh-rx">${items.join("")}</ul>` : `<p class="dsh-load">${empty}</p>`);
  const tag = (t) => (t ? `<span class="dsh-tag">${esc(t)}</span>` : "");

  // ---- 1 · Stress list ------------------------------------------------------------
  function stressBody() {
    return ul(stressRows().map((s) => coRow({
      name: s.name, date: s.latest, tag: tag(s.status), srcHref: s.source,
      meta: [esc(s.sector || ""), esc(s.hq || ""), s.debt ? esc(s.debt) : ""],
    })), "No stressed names tracked.");
  }
  // ---- 2 · Plans & schemes ----------------------------------------------------------
  function plansBody() {
    return ul(plansAndSchemes().map((r) => coRow({
      name: r.company, date: r.date, tag: tag(r.stage), srcHref: r.src || "",
      meta: [esc(r.kind), esc(r.court || ""), r.citation ? esc(r.citation) : ""],
      attrs: ` data-rx="${esc(r.id)}"`,
    })), "No plans or schemes tracked.");
  }
  // ---- 3 · Case law --------------------------------------------------------------------
  function casesBody() {
    return newsUl(rxCases().map((c) => newsLi({ title: c.name, href: c.url, date: c.date, meta: esc(c.citation || ""), src: courtShort(c.court) || "" })), "No restructuring judgments tracked.");
  }
  // ---- 4 · Restructuring & distressed deals -------------------------------------------
  function dealsBody() {
    return newsUl(rxDeals().map((d) => {
      const cp = dealCounterparty(d, mgrName(d.managerId));
      const reg = REGION_LABEL[tagsOf(d, DEAL_TAGS).region] || "";
      const meta = [cp ? coLink(cp, base) : "", esc(mgrName(d.managerId)), esc(reg)].filter(Boolean).join(" · ");
      return newsLi({ title: d.headline, href: `${base}/transactions/#/deal/${encodeURIComponent(d.id)}`, inApp: true, date: d.date, meta, src: creditSource(d), srcHref: d.sourceUrl || "" });
    }), "No restructuring deals tracked.");
  }
  // ---- 5 · Insolvency statistics -------------------------------------------------------
  const kpiRow = ({ k, v, d, src, srcName, sub, title, id }) => `<div class="dsh-kv dsh-kv4"${id ? ` id="${id}"` : ""}>`
    + `<span class="dsh-kv-k" title="${esc(title || k)}">${esc(k)}${sub ? `<span class="dsh-kv-sub">${sub}</span>` : ""}</span>`
    + `<span class="dsh-kv-v">${v != null ? esc(v) : "—"}</span>`
    + `<span class="dsh-kv-d">${d ? esc(isoDay(d)) : ""}</span>`
    + `<span class="dsh-kv-s">${srcLink(src, (srcName || "source") + " — source")}</span></div>`;
  function statsBody() {
    const E = EU_DISTRESS || {};
    const metrics = E.metrics || [];
    const official = metrics.filter((x) => /insolvency service|eurostat|gov\.uk/i.test(`${x.srcName} ${x.src}`));
    const agency = metrics.filter((x) => !official.includes(x));
    const live = _eu && _eu.bankruptcies && _eu.bankruptcies.value != null ? _eu.bankruptcies : null;
    const b = live || (E.bankruptcyFallback && E.bankruptcyFallback.value != null ? E.bankruptcyFallback : null);
    const bk = kpiRow({ id: "rxh-bkrt", k: "EU bankruptcy declarations (index)", title: "Eurostat sts_rb_q, EU27, seasonally & calendar adjusted, 2021=100",
      v: b ? b.value.toFixed(1) : null, d: b ? b.asOf : null, src: (b && b.href) || "https://ec.europa.eu/eurostat/databrowser/view/sts_rb_q/default/table", srcName: "Eurostat",
      sub: b && b.yearAgo != null ? `vs ${esc(b.yearAgo.toFixed(1))} ${esc(isoDay(b.yearAgoAsOf || ""))}` : "" });
    const kv = (x) => kpiRow({ k: x.k, v: x.v, d: x.asOf, src: x.src, srcName: x.srcName, sub: x.measure ? esc(x.measure) : "", title: x.sub ? `${x.k} — ${x.sub}` : x.k });
    // Quarterly history of the live Eurostat series (latest 8 quarters), when loaded.
    const hist = live && Array.isArray(live.history) ? live.history.slice(-8).reverse() : [];
    const histHTML = hist.length ? `<div class="dsh-pc-reports-h">EU bankruptcy declarations by quarter</div><ul class="rxh-hist">${hist.map(([q, v]) => `<li class="rxh-hist-i"><span class="rxh-hist-q">${esc(isoDay(q))}</span><span class="c-num">${esc(Number(v).toFixed(1))}</span></li>`).join("")}</ul>` : "";
    return `<div class="dsh-kvgrid rxh-kv">${official.map(kv).join("")}${bk}</div>${histHTML}`
      + (agency.length ? `<div class="dsh-pc-reports-h">Default rates</div><div class="dsh-kvgrid rxh-kv">${agency.map(kv).join("")}</div>` : "");
  }
  // ---- 6 · Hearings ---------------------------------------------------------------------
  const RX_LABEL = { sanction: "Sanction", convening: "Convening", scheme: "Scheme", plan: "Plan" };
  function hearingsBody() {
    let live;
    if (_cause === undefined) live = `<p class="dsh-load">Loading the Rolls Building cause list…</p>`;
    else if (!_cause || !Array.isArray(_cause.lists)) live = `<p class="dsh-load">Cause list unavailable — <a href="${esc(CATH_SUMMARY)}" target="_blank" rel="noopener noreferrer">Court and Tribunal Hearings</a></p>`;
    else {
      const rows = _cause.lists.flatMap((l) => (l.rows || []).map((r) => ({ ...r, date: l.date, url: l.url })))
        .sort((a, b) => String(a.date).localeCompare(String(b.date)) || (b.rx ? 1 : 0) - (a.rx ? 1 : 0));
      const days = _cause.lists.map((l) => l.date).filter(Boolean);
      live = rows.length
        ? ul(rows.map((r) => coRow({
          name: r.caseName, dateText: isoDay(r.date), tag: r.rx ? tag(RX_LABEL[r.rx]) : "", srcHref: r.url, src: "Cause list",
          meta: [esc(r.time || ""), esc(r.type || ""), esc(r.judge || ""), esc(r.venue || ""), esc(r.caseNo || "")],
          attrs: r.rx ? ' data-rx-hearing="1"' : "",
        })), "", "rxh-hear")
        : `<p class="dsh-load">No company hearings listed${days.length ? ` for ${esc(days.map(isoDay).join(", "))}` : ""}.</p>`;
    }
    const ms = rxMilestones();
    const msHTML = ms.length ? `<div class="dsh-pc-reports-h">Restructuring milestones</div>${newsUl(ms.map((x) => newsLi({ title: x.item, href: x.src, date: x.date, meta: esc(x.jur || ""), src: x.srcName || "" })), "")}` : "";
    return `<div class="dsh-pc-reports-h">Rolls Building — company hearings</div>${live}${msHTML}`;
  }

  // ---- page ---------------------------------------------------------------------------
  const card = (id, title, meta, body, cls = "") => `<section class="dsh-card rxh-card${cls ? ` ${cls}` : ""}" id="${id}"><h3 class="dsh-h"><span class="dsh-h-t">${title}</span><span class="dsh-h-r">${meta}</span></h3><div class="rxh-body">${body}</div></section>`;
  const txAll = `${base}/transactions/#/lending?type=rx&scope=all`;
  // The hub is part of Deals (owner 2026-10-15): it carries the Deals mode bar with
  // Restructuring lit, so every chip goes somewhere (the old in-page section chips are gone).
  const DEALS_BAR = [["lending", "Lending"], ["structured", "Structured credit"], ["secondary", "Secondaries"], ["restructuring", "Restructuring"], ["fundraising", "Fundraising"], ["mna", "Manager M&amp;A"], ["league", "League tables"]];
  function render() {
    const P = plansAndSchemes(), C = rxCases(), D = rxDeals();
    const chips = DEALS_BAR.map(([k, l]) => k === "restructuring"
      ? `<span class="tchip rxh-chip is-on" aria-current="page">${l}</span>`
      : `<a class="tchip rxh-chip" href="${esc(base)}/transactions/#/${k}">${l}</a>`).join("");
    host.innerHTML = `<div class="dsh rxh">
      <header class="tpanel-h twire-head rxh-nav"><nav class="tchips rxh-chips" aria-label="Deals">${chips}</nav></header>
      <header class="rxh-hd"><h2 class="rxh-t">Restructuring</h2><span class="rxh-sub">${CR_STRESS.length} stressed · ${P.length} plans &amp; schemes · ${C.length} judgments · ${D.length} deals</span></header>
      <div class="rxh-grid">
        ${card("rxh-stress", "Stress — situations in focus", count(CR_STRESS.length), stressBody())}
        ${card("rxh-plans", "Plans &amp; schemes", count(P.length), plansBody())}
        ${card("rxh-cases", "Case law — restructuring &amp; insolvency", count(C.length), casesBody())}
        ${card("rxh-hearings", "Hearings", `<a class="dsh-src rxh-off" href="${esc(CATH_SUMMARY)}" target="_blank" rel="noopener noreferrer" title="HMCTS Court and Tribunal Hearings — Rolls Building">Official cause lists</a>`, hearingsBody())}
        ${card("rxh-deals", "Restructuring &amp; distressed deals", `${count(D.length)} <a class="dsh-drill rxh-more" href="${esc(txAll)}">Transactions</a>`, dealsBody())}
        ${card("rxh-stats", "Insolvency statistics", `<span class="dsh-live is-snap" data-live="bkrt" title="Sourced snapshot — live data not loaded">not live</span> ${asOf(EU_DISTRESS && EU_DISTRESS.asOf)}`, statsBody())}
      </div></div>`;
    host.querySelectorAll(".rxh-body").forEach(preview);
  }

  // ---- 10-row preview + "See all N" (phone and desktop) -----------------------------
  const itemsOf = (body) => {
    const lists = [...body.querySelectorAll("ul.rxh-list:not(.rxh-hist), ul.dsh-news")].map((u) => [...u.children]);
    return lists.sort((a, b) => b.length - a.length)[0] || [];
  };
  const pvHide = (e) => { e.classList.add("dsh-pv-hide"); e.style.display = "none"; };
  function preview(body) {
    const items = itemsOf(body);
    if (items.length <= PREVIEW) return;
    items.slice(PREVIEW).forEach(pvHide);
    body.insertAdjacentHTML("beforeend", `<button type="button" class="dsh-seeall">See all ${items.length} <span aria-hidden="true">›</span></button>`);
  }
  let _closeSheet = null;
  function openSheet(body) {
    if (_closeSheet) _closeSheet();
    const cardEl = body.closest(".dsh-card");
    const title = cardEl ? ((cardEl.querySelector(".dsh-h-t") || {}).textContent || "").trim() : "";
    const clone = body.cloneNode(true);
    clone.className = "dsh-sheet-body rxh-sheet-body";
    clone.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id"));
    clone.querySelectorAll(".dsh-pv-hide").forEach((e) => { e.classList.remove("dsh-pv-hide"); e.style.removeProperty("display"); });
    clone.querySelectorAll(".dsh-seeall").forEach((e) => e.remove());
    const items = itemsOf(clone);
    const sh = document.createElement("div");
    sh.className = "dsh dsh-sheet rxh"; sh.setAttribute("role", "dialog"); sh.setAttribute("aria-modal", "true"); sh.setAttribute("aria-label", title);
    sh.innerHTML = `<div class="dsh-sheet-hd"><span class="dsh-sheet-t">${esc(title)} <span class="dsh-n">(${items.length})</span></span><button type="button" class="dsh-sheet-x" aria-label="Close">✕</button></div>`
      + `<div class="dsh-sheet-f"><input type="search" class="dsh-sheet-q" placeholder="Search this list" aria-label="Search this list" autocomplete="off"></div>`;
    sh.appendChild(clone);
    document.body.appendChild(sh);
    document.documentElement.classList.add("dsh-sheet-open");
    const onKey = (e) => { if (e.key === "Escape") close(); };
    const close = () => { sh.remove(); document.documentElement.classList.remove("dsh-sheet-open"); document.removeEventListener("keydown", onKey); _closeSheet = null; };
    document.addEventListener("keydown", onKey);
    sh.querySelector(".dsh-sheet-x").addEventListener("click", close);
    sh.addEventListener("click", (e) => { if (e.target.closest("a[href]")) close(); });
    const q = sh.querySelector(".dsh-sheet-q");
    q.addEventListener("input", () => { const v = q.value.trim().toLowerCase(); itemsOf(clone).forEach((it) => { it.style.display = !v || it.textContent.toLowerCase().includes(v) ? "" : "none"; }); });
    _closeSheet = close;
  }
  host.addEventListener("click", (e) => {
    const chip = e.target.closest(".rxh-chip.is-on");
    if (chip && host.contains(chip)) { e.preventDefault(); const sc = host.querySelector(".rxh"); if (sc) sc.scrollTo({ top: 0, behavior: "smooth" }); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const b = e.target.closest(".dsh-seeall");
    if (b && host.contains(b)) { e.preventDefault(); openSheet(b.closest(".rxh-body")); }
  });

  // ---- live data ------------------------------------------------------------------------
  const set = (id, html) => { const el = host.querySelector(`#${id} .rxh-body`); if (el) { el.innerHTML = html; preview(el); } };
  function loadLive() {
    liveJSON("/api/eurates").then((res) => {
      if (res && res.data && res.data.bankruptcies && res.data.bankruptcies.value != null) {
        _eu = res.data; _euState = res;
        set("rxh-stats", statsBody());
        const el = host.querySelector('.dsh-live[data-live="bkrt"]');
        if (el && res.state === "live") { el.classList.remove("is-snap"); el.textContent = "live"; el.title = `Live · Eurostat ${isoDay(res.data.bankruptcies.asOf || "")}`; }
        else if (el && res.state !== "none") { el.classList.add("is-cached"); el.textContent = lastKnownLabel(res.at).replace(/^Last-known · /, "as of ").replace(/^Last-known values$/, "not live"); el.title = lastKnownLabel(res.at) + " — live data not loaded"; }
      }
    }).catch(() => {});
    fetch("/api/causelist", { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null)).catch(() => null)
      .then((j) => { _cause = j && Array.isArray(j.lists) ? j : null; set("rxh-hearings", hearingsBody()); });
  }

  render();
  loadLive();
  return {
    enter() {},
    leave() { if (_closeSheet) _closeSheet(); },
    home() { if (_closeSheet) _closeSheet(); const r = host.querySelector(".rxh"); if (r) r.scrollTop = 0; window.scrollTo(0, 0); },
    _state: () => ({ eu: _euState && _euState.state, cause: _cause }),
  };
}
