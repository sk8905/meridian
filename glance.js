// =============================================================================
// Meridian Glance — the cross-desk landing. Imports the three apps' data modules
// (same-origin ES modules), renders a highlight card per platform, and powers a
// unified ⌘K command palette that searches deals, managers, funds, legal alerts,
// cases, restructurings, macro indicators and views — deep-linking into each app.
// Zero dependencies; loaded only once the user is authenticated.
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
  wirePalette(buildIndex());
}

// ---- Highlight cards -------------------------------------------------------
function renderCards() {
  const credit = [...deals.map((d) => ({ ...d, _k: "deal" })), ...intel.map((i) => ({ ...i, _k: "intel" }))]
    .sort(byDateDesc).slice(0, 4);
  setHTML("c-list", credit.map((x) => item(
    `/credit/#/${x._k === "deal" ? "deals" : "intel"}`, x.headline,
    `${fmt(x.date)}${mgrName(x.managerId) ? " · " + mgrName(x.managerId) : ""}`)).join(""));

  const lc = [...cases].sort(byDateDesc).slice(0, 2);
  const li = [...items].filter((i) => i.date).sort(byDateDesc).slice(0, 2);
  setHTML("l-list",
    subHead("Recent case law") +
    lc.map((c) => item(`/legal/#/cases?case=${encodeURIComponent(c.id)}`, c.name, `${fmt(c.date)} · ${c.court || ""}`)).join("") +
    subHead("Latest alerts") +
    li.map((i) => item(`/legal/#/item/${encodeURIComponent(i.id)}`, i.title, `${fmt(i.date)}${i.firm ? " · " + i.firm : ""}`)).join(""));

  const news = [...((NEWS && NEWS.us) || []).map((n) => ({ ...n, c: "US" })), ...((NEWS && NEWS.uk) || []).map((n) => ({ ...n, c: "UK" }))]
    .sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 2);
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const rel = (RELEASES || []).filter((r) => new Date((r.date || "") + "T00:00:00") >= now)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))[0];
  setHTML("m-list",
    subHead("Headlines") +
    news.map((n) => item(n.url, n.title, `${n.c} · ${fmt(n.date)} · ${n.source}`, true)).join("") +
    (rel ? subHead("Next release") + item("/macro/", rel.title, `${rel.country} · ${fmt(rel.date)}`) : "") +
    subHead("Rate outlook") +
    item("/macro/#/commentary", (SUMMARY && SUMMARY.outlook && SUMMARY.outlook.us) || "", "US"));
}
function item(href, title, meta, ext) {
  const a = ext ? ` target="_blank" rel="noopener noreferrer"` : "";
  return `<a class="g-item" href="${esc(href)}"${a}><span class="t">${esc(title)}</span><span class="m">${esc(meta)}</span></a>`;
}
const subHead = (t) => `<div class="g-sub-h">${esc(t)}</div>`;
const setHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

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
