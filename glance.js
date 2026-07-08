// =============================================================================
// Meridian Glance — the cross-desk landing. Imports the three apps' data modules
// (same-origin ES modules), renders a sectioned highlight card per platform
// (Macro, Credit, Legal — 3 most-recent items per section), mounts the Credit
// "key rates & credit spreads" bar, and powers a unified ⌘K command palette that
// searches deals, managers, funds, legal alerts, cases, restructurings, macro
// indicators and views — deep-linking into each app. Zero dependencies; loaded
// only once the user is authenticated.
// =============================================================================
import { deals, intel, managers, funds } from "/credit/js/data.js";
import { items, cases, restructurings } from "/legal/js/data.js";
import { NEWS, RELEASES, SUMMARY } from "/macro/js/content.js";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const byDateDesc = (a, b) => String(b.date || "").localeCompare(String(a.date || ""));
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ""); return m ? `${+m[3]} ${MON[+m[2] - 1]} ${m[1]}` : (iso || ""); };
const mgrName = (id) => (managers.find((m) => m.id === id) || {}).name || "";

const MACRO_INDICATORS = [
  ["base_rate", "Base rate"], ["two_year", "2-year yield"], ["core_cpi", "Core inflation"],
  ["services_pmi", "Services PMI"], ["wages", "Wage growth"], ["unemployment", "Unemployment"],
];

let _inited = false;
export function initGlance() {
  if (_inited) return; _inited = true;
  renderCards();
  initRates();
  wirePalette(buildIndex());
}

// ---- Highlight cards -------------------------------------------------------
// Each platform card is broken into its natural sections, newest 3 items each.
function renderCards() {
  // ---- Macro: headlines, upcoming releases, rate outlook ----
  const macroNews = (k, c) => ((NEWS && NEWS[k]) || []).map((n) => ({ ...n, c }));
  const news = [...macroNews("us", "US"), ...macroNews("uk", "UK")].sort(byDateDesc).slice(0, 3);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const releases = (RELEASES || []).filter((r) => new Date((r.date || "") + "T00:00:00") >= today)
    .sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(0, 3);
  const outlook = (SUMMARY && SUMMARY.outlook) || {};
  setHTML("m-list",
    subHead("Headlines") + rows(news.map((n) => item(n.url, n.title, `${n.c} · ${fmt(n.date)} · ${n.source}`, true))) +
    subHead("Upcoming releases") + rows(releases.map((r) => item("/macro/", r.title, `${r.country || ""} · ${fmt(r.date)}`))) +
    subHead("Rate outlook") + rows([
      outlook.us ? item("/macro/#/commentary", outlook.us, "US") : "",
      outlook.uk ? item("/macro/#/commentary", outlook.uk, "UK") : "",
    ]));

  // ---- Credit: deals, fundraising, CLOs ----
  const dealsR = [...deals].filter((d) => !d.clo).sort(byDateDesc).slice(0, 3);
  const intelR = [...intel].filter((i) => !i.clo).sort(byDateDesc).slice(0, 3);
  const cloR = [...deals.filter((d) => d.clo), ...intel.filter((i) => i.clo)].sort(byDateDesc).slice(0, 3);
  const mgrSuffix = (x) => (mgrName(x.managerId) ? " · " + mgrName(x.managerId) : "");
  setHTML("c-list",
    subHead("Deals") + rows(dealsR.map((d) => item("/credit/#/deals", d.headline, `${fmt(d.date)}${mgrSuffix(d)}`))) +
    subHead("Fundraising") + rows(intelR.map((i) => item("/credit/#/intel", i.headline, `${i.type || "Fundraising"} · ${fmt(i.date)}${mgrSuffix(i)}`))) +
    subHead("CLOs") + rows(cloR.map((c) => item("/credit/#/clos", c.headline, `${fmt(c.date)}${mgrSuffix(c)}`))));

  // ---- Legal: alerts, case law, schemes & RPs ----
  const alerts = [...items].filter((i) => i.date).sort(byDateDesc).slice(0, 3);
  const caseLaw = [...cases].sort(byDateDesc).slice(0, 3);
  const rx = [...restructurings].filter((r) => r.date).sort(byDateDesc).slice(0, 3);
  setHTML("l-list",
    subHead("Alerts") + rows(alerts.map((i) => item(`/legal/#/item/${encodeURIComponent(i.id)}`, i.title, `${fmt(i.date)}${i.firm ? " · " + i.firm : ""}`))) +
    subHead("Case law") + rows(caseLaw.map((c) => item(`/legal/#/cases?case=${encodeURIComponent(c.id)}`, c.name, `${fmt(c.date)}${c.court ? " · " + c.court : ""}`))) +
    subHead("Schemes & RPs") + rows(rx.map((r) => item(`/legal/#/restructurings?m=${encodeURIComponent(r.id)}`, r.company, `${r.type === "scheme" ? "Scheme" : "Restructuring plan"} · ${fmt(r.date)}`))));
}
function item(href, title, meta, ext) {
  const a = ext ? ` target="_blank" rel="noopener noreferrer"` : "";
  return `<a class="g-item" href="${esc(href)}"${a}><span class="t">${esc(title)}</span><span class="m">${esc(meta)}</span></a>`;
}
const rows = (arr) => { const h = arr.filter(Boolean).join(""); return h || `<div class="g-empty">Nothing to show yet.</div>`; };
const subHead = (t) => `<div class="g-sub-h">${esc(t)}</div>`;
const setHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

// ---- Key rates & credit spreads (ported from Credit) -----------------------
function fmtRate(v, unit) {
  if (v == null) return "—";
  return unit === "bp" ? `${Math.round(v * 100)} bp` : `${v.toFixed(2)}%`;
}
// Compact 1-month trend line, coloured by net direction over the window.
function rateSpark(hist) {
  if (!Array.isArray(hist) || hist.length < 2) return '<span class="rate-spark-empty" aria-hidden="true"></span>';
  const W = 100, H = 22, pad = 2;
  const min = Math.min(...hist), max = Math.max(...hist), span = (max - min) || 1;
  const X = (i) => pad + (i / (hist.length - 1)) * (W - pad * 2);
  const Y = (v) => H - pad - ((v - min) / span) * (H - pad * 2);
  const d = hist.map((v, i) => `${i ? "L" : "M"} ${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
  const c = hist[hist.length - 1] >= hist[0] ? "#059669" : "#dc2626";
  return `<svg class="rate-spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="1-month trend">` +
    `<path d="${d}" fill="none" stroke="${c}" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}
function ratesTile(x) {
  const val = fmtRate(x.value, x.unit);
  let chg = '<span class="rate-chg flat">·</span>';
  if (x.change != null && x.value != null) {
    const c = x.unit === "bp" ? Math.round(x.change * 100) : +x.change.toFixed(2);
    const dir = c > 0 ? "up" : c < 0 ? "down" : "flat";
    const arrow = c > 0 ? "▲" : c < 0 ? "▼" : "·";
    const mag = x.unit === "bp" ? `${Math.abs(c)} bp` : Math.abs(c).toFixed(2);
    chg = `<span class="rate-chg ${dir}">${arrow} ${mag}</span>`;
  }
  const asOf = x.asOf ? ` as of ${esc(x.asOf)}` : "";
  const title = ` title="${esc(x.label)}${asOf} — 1-month trend — open source ↗"`;
  const tag = x.href ? "a" : "div";
  const attrs = x.href ? ` href="${esc(x.href)}" target="_blank" rel="noopener noreferrer"` : "";
  return `<${tag} class="rate-tile"${attrs}${title}><span class="rate-label">${esc(x.label)}</span><span class="rate-val">${val}</span>${chg}${rateSpark(x.history)}</${tag}>`;
}
function initRates() {
  const el = document.getElementById("g-rates");
  if (!el) return;
  fetch("/api/rates?v=9")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d) => {
      const rowsData = d.rates || [];
      el.innerHTML = rowsData.length
        ? rowsData.map(ratesTile).join("") +
          '<a class="rate-src" href="https://fred.stlouisfed.org/" target="_blank" rel="noopener noreferrer">Source: FRED · ECB · NY Fed · US Treasury ↗</a>'
        : '<span class="g-loading">Market rates unavailable right now.</span>';
    })
    .catch(() => { el.innerHTML = '<span class="g-loading">Market rates unavailable right now.</span>'; });
}

// ---- Unified search index --------------------------------------------------
function buildIndex() {
  const idx = [];
  const add = (tag, title, sub, href) => idx.push({ tag, title, sub, href, hay: (title + " " + sub).toLowerCase() });

  add("view", "Glance", "Cross-desk briefing", "/");
  add("credit", "Credit dashboard", "Meridian Credit", "/credit/");
  add("legal", "Legal dashboard", "Meridian Legal", "/legal/");
  add("macro", "Macro dashboard", "Meridian Macro", "/macro/");
  [["commentary", "Rate outlook"], ["cycle", "Cycle"], ["bubble", "Bubble risk"], ["chart", "Chart"]]
    .forEach(([k, l]) => add("macro", `Macro — ${l}`, "View", `/macro/#/${k}`));

  deals.forEach((d) => add("credit", d.headline, `Deal · ${fmt(d.date)}${mgrName(d.managerId) ? " · " + mgrName(d.managerId) : ""}`, "/credit/#/deals"));
  intel.forEach((i) => add("credit", i.headline, `${i.type || "Fundraising"} · ${fmt(i.date)}${mgrName(i.managerId) ? " · " + mgrName(i.managerId) : ""}`, "/credit/#/intel"));
  managers.forEach((m) => add("credit", m.name, "Manager", "/credit/#/managers"));
  funds.forEach((f) => add("credit", f.name, `Fund${f.managerId && mgrName(f.managerId) ? " · " + mgrName(f.managerId) : ""}`, "/credit/#/funds"));

  items.forEach((i) => add("legal", i.title, `Legal alert${i.firm ? " · " + i.firm : ""}${i.date ? " · " + fmt(i.date) : ""}`, `/legal/#/item/${encodeURIComponent(i.id)}`));
  cases.forEach((c) => add("legal", c.name, `Case · ${c.court || ""}${c.citation ? " · " + c.citation : ""}`, `/legal/#/cases?case=${encodeURIComponent(c.id)}`));
  restructurings.forEach((r) => add("legal", r.company, `${r.type === "scheme" ? "Scheme" : "Restructuring plan"}${r.citation ? " · " + r.citation : ""}`, `/legal/#/restructurings?m=${encodeURIComponent(r.id)}`));

  ["US", "UK"].forEach((ctry) => MACRO_INDICATORS.forEach(([k, l]) =>
    add("macro", `${ctry} ${l}`, "Open in Chart", `/macro/#/chart?add=${ctry}:${k}`)));

  return idx;
}

// ---- Command palette -------------------------------------------------------
function wirePalette(idx) {
  const overlay = document.getElementById("cmdk");
  const input = document.getElementById("cmdk-input");
  const results = document.getElementById("cmdk-results");
  let sel = 0, current = [];

  const defaults = idx.filter((e) => e.tag === "view").slice(0, 8);

  function score(e, q) {
    const t = e.title.toLowerCase();
    if (t === q) return 0;
    if (t.startsWith(q)) return 1;
    if (t.includes(q)) return 2;
    return e.hay.includes(q) ? 3 : -1;
  }
  function search(q) {
    q = q.trim().toLowerCase();
    if (!q) return defaults;
    const toks = q.split(/\s+/);
    return idx
      .map((e) => ({ e, s: toks.every((t) => e.hay.includes(t)) ? score(e, q) : -1 }))
      .filter((x) => x.s >= 0 || x.e.hay.includes(toks[0]))
      .map((x) => ({ e: x.e, s: x.s < 0 ? 4 : x.s }))
      .sort((a, b) => a.s - b.s)
      .slice(0, 40).map((x) => x.e);
  }
  function draw() {
    if (!current.length) { results.innerHTML = `<div class="cmdk-empty">No matches.</div>`; return; }
    results.innerHTML = current.map((e, i) => `
      <div class="cmdk-row${i === sel ? " sel" : ""}" data-i="${i}">
        <span class="cmdk-tag ${e.tag}">${e.tag === "view" ? "Go" : e.tag}</span>
        <span class="cmdk-txt"><span class="cmdk-t">${esc(e.title)}</span><span class="cmdk-s">${esc(e.sub)}</span></span>
      </div>`).join("");
    const s = results.querySelector(".cmdk-row.sel"); if (s) s.scrollIntoView({ block: "nearest" });
  }
  function refresh() { current = search(input.value); sel = 0; draw(); }
  function go(e) { if (e) window.location.href = e.href; }

  function open() { overlay.classList.add("open"); input.value = ""; refresh(); setTimeout(() => input.focus(), 10); }
  function close() { overlay.classList.remove("open"); }

  document.getElementById("open-cmdk").addEventListener("click", open);
  overlay.querySelector("[data-close]").addEventListener("click", close);
  input.addEventListener("input", refresh);
  results.addEventListener("click", (ev) => { const r = ev.target.closest(".cmdk-row"); if (r) go(current[+r.getAttribute("data-i")]); });
  input.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowDown") { ev.preventDefault(); sel = Math.min(sel + 1, current.length - 1); draw(); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); sel = Math.max(sel - 1, 0); draw(); }
    else if (ev.key === "Enter") { ev.preventDefault(); go(current[sel]); }
    else if (ev.key === "Escape") { close(); }
  });
  window.addEventListener("keydown", (ev) => {
    if ((ev.metaKey || ev.ctrlKey) && (ev.key === "k" || ev.key === "K")) { ev.preventDefault(); overlay.classList.contains("open") ? close() : open(); }
    else if (ev.key === "Escape" && overlay.classList.contains("open")) { close(); }
  });
  // Arriving from an in-app ⌘K (which routes to "/#find") opens search immediately.
  if (location.hash === "#find") { history.replaceState(null, "", "/"); open(); }
}
