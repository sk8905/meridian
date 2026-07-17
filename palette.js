// =============================================================================
// Wire unified command palette — a self-contained ⌘K search that any of the
// three apps mounts in-place. It imports all three data modules (same-origin ES
// modules), builds one index across deals, managers, funds, legal alerts, cases,
// restructurings, macro indicators and views, injects its own overlay + styles
// (namespaced so they never clash with the host app), and deep-links on select.
// Import dynamically and call mountPalette() once.  Zero dependencies.
// =============================================================================
// Versioned imports (matching each app) so the palette busts its cache with the
// four-times-daily data refresh instead of serving a stale copy.
import { deals, intel, managers, funds, research } from "/credit/js/data.js?v=20260708-10";
import { items, cases, restructurings } from "/legal/js/data.js?v=20260708-8";
import { NEWS, ARTICLES, ALERTS } from "/macro/js/content.js?v=20260711-1";

// Canonical identity of a manager press item (mirrors credit/js/app.js) so a news
// search result deep-links to the exact row (#/manager/<id>?focus=k:<key>).
function feedDedupKey(x) {
  const u = (x.url || x.sourceUrl || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
  const generic = !u || /^https?:\/\/[^/]+$/.test(u) || /\/(news-insights|news|press-releases|media|insights|press)$/.test(u);
  return generic ? "t:" + (x.title || x.headline || "").toLowerCase().replace(/[^a-z0-9]+/g, "") : "u:" + u;
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ""); return m ? `${+m[3]} ${MON[+m[2] - 1]} ${m[1]}` : (iso || ""); };
const mgrName = (id) => (managers.find((m) => m.id === id) || {}).name || "";
// The standalone Deals/Fundraising list pages are retired, so a deal/intel record
// links to its source article when we have one, else the manager's page in Credit;
// CLO items keep the CLOs tab.
const creditItemHref = (x) => x.clo
  ? `/credit/#/clos?focus=${encodeURIComponent(x.id)}`
  : (x.sourceUrl ? x.sourceUrl : (x.managerId ? `/credit/#/manager/${encodeURIComponent(x.managerId)}` : "/credit/#/"));
const MACRO_INDICATORS = [
  ["base_rate", "Base rate"], ["two_year", "2-year yield"], ["core_cpi", "Core inflation"],
  ["services_pmi", "Services PMI"], ["wages", "Wage growth"], ["unemployment", "Unemployment"],
];

// Result priority (rank): managers first, then funds / CLOs, then dated items
// (deals, intel, legal — newest first), then macro chart shortcuts, then views.
// Expand central-bank abbreviations both ways ("Federal Reserve" ⇄ "Fed", etc.).
const CB_SYN = [["fed", "federal reserve"], ["fomc", "federal open market committee"], ["boe", "bank of england"], ["ecb", "european central bank"]];
function expandHay(s) {
  let h = s.toLowerCase();
  for (const [ab, full] of CB_SYN) {
    const hasAb = new RegExp("\\b" + ab + "\\b").test(h), hasFull = h.includes(full);
    if (hasAb && !hasFull) h += " " + full; else if (hasFull && !hasAb) h += " " + ab;
  }
  return h;
}
function buildIndex() {
  const idx = [];
  // `label` is the pill text (the sub-section / tab the item lives in, e.g.
  // "Legal alert", "Case law", "Deal", "Fundraising"); `tag` still drives the
  // pill colour (macro / credit / legal). Falls back to the section name.
  const add = (tag, title, sub, href, rank, date, label) => idx.push({ tag, title, sub, href, rank, date: date || "", label: label || "", hay: expandHay(title + " " + sub) });
  add("view", "Home", "Cross-desk briefing", "/", 4, "");
  [["commentary", "Commentary", "Commentary"], ["policy", "Rate outlook", "Policy"], ["cycle", "Cycle", "Cycle"], ["bubble", "Bubble risk", "Bubble"], ["chart", "Chart", "Chart"], ["saved", "Saved", "Saved"]]
    .forEach(([k, l, tl]) => add("macro", `Macro — ${l}`, "View", `/macro/#/${k}`, 4, "", tl));
  managers.forEach((m) => add("credit", m.name, "Manager", `/credit/#/manager/${encodeURIComponent(m.id)}`, 0, "", "Manager"));
  funds.forEach((f) => add("credit", f.name, `Fund${f.managerId && mgrName(f.managerId) ? " · " + mgrName(f.managerId) : ""}`, `/credit/#/fund/${encodeURIComponent(f.id)}`, 1, "", "Fund"));
  deals.forEach((d) => add("credit", d.headline, `${d.clo ? "CLO" : "Deal"} · ${fmt(d.date)}${mgrName(d.managerId) ? " · " + mgrName(d.managerId) : ""}`, creditItemHref(d), d.clo ? 1 : 2, d.date, d.clo ? "CLO" : "Deal"));
  intel.forEach((i) => add("credit", i.headline, `${i.clo ? "CLO · " : ""}${i.type || "Fundraising"} · ${fmt(i.date)}${mgrName(i.managerId) ? " · " + mgrName(i.managerId) : ""}`, creditItemHref(i), i.clo ? 1 : 2, i.date, i.clo ? "CLO" : "Fundraising"));
  (research || []).forEach((r) => add("credit", r.title, `${r.institution}${r.type ? " · " + r.type : ""}${r.date ? " · " + fmt(r.date) : ""}`, r.url, 2, r.date, "Commentary"));
  items.forEach((i) => add("legal", i.title, `Legal alert${i.firm ? " · " + i.firm : ""}${i.date ? " · " + fmt(i.date) : ""}`, i.url || `/legal/#/item/${encodeURIComponent(i.id)}`, 2, i.date, "Alert"));
  cases.forEach((c) => add("legal", c.name, `Case · ${c.court || ""}${c.citation ? " · " + c.citation : ""}`, c.url || `/legal/#/`, 2, c.date, "Case"));
  restructurings.forEach((r) => add("legal", r.company, `${r.type === "scheme" ? "Scheme" : "Restructuring plan"}${r.citation ? " · " + r.citation : ""}`, r.judgmentUrl || r.articleUrl || `/legal/#/`, 2, r.date, r.type === "scheme" ? "Scheme" : "RP"));
  ["US", "UK"].forEach((c) => MACRO_INDICATORS.forEach(([k, l]) => add("macro", `${c} ${l}`, "Open in Chart", `/macro/#/chart?add=${c}:${k}`, 3, "", "Chart")));
  // News items — so a search for e.g. "Federal Reserve" finds macro headlines too.
  const seenNews = new Set();
  const addNews = (n) => {
    const k = (n.url || n.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
    if (k && seenNews.has(k)) return; if (k) seenNews.add(k);
    add("macro", n.title, `Macro news${n.source ? " · " + n.source : ""}${n.date ? " · " + fmt(n.date) : ""}`, n.url, 2, n.date, "News");
  };
  ["us", "uk"].forEach((c) => ((NEWS && NEWS[c]) || []).forEach(addNews));
  ((ARTICLES && ARTICLES.items) || []).forEach(addNews);
  (ALERTS || []).forEach((a) => add("macro", a.title, `Macro guidance${a.kind ? " · " + a.kind : ""}`, `/macro/${a.href || "#/policy"}`, 3, a.date, "Guidance"));
  managers.forEach((m) => {
    const seen = new Set();
    [...(m.news || []), ...(m.webNews || [])].forEach((w) => {
      const k = (w.url || w.title || "").toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "");
      if (k && seen.has(k)) return; seen.add(k);
      add("credit", w.title, `News${m.name ? " · " + m.name : ""}${w.date ? " · " + fmt(w.date) : ""}`, `/credit/#/manager/${encodeURIComponent(m.id)}?focus=k:${encodeURIComponent(feedDedupKey(w))}`, 2, w.date, "News");
    });
  });
  return idx;
}

const STYLE = `
.mcmdk{position:fixed;inset:0;z-index:9000;display:none;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
.mcmdk.open{display:block}
.mcmdk *{box-sizing:border-box}
.mcmdk-scrim{position:absolute;inset:0;background:rgba(3,6,12,.62)}
.mcmdk-panel{position:relative;max-width:620px;margin:9vh auto 0;background:var(--surface,#0c1220);border:1px solid var(--border,#232f47);border-radius:0;box-shadow:0 24px 60px rgba(0,0,0,.55);overflow:hidden}
.mcmdk-bar{display:flex;align-items:center}
.mcmdk-mag,.mcmdk-cancel{display:none}
.mcmdk .mcmdk-input{flex:1 1 auto;width:100%;min-width:0;border:0 !important;border-bottom:1px solid var(--border,#232f47) !important;padding:1rem 1.1rem;font:inherit;font-size:1.05rem;color:var(--ink,#eaf0fb);background:transparent !important;outline:none}
.mcmdk-input::placeholder{color:var(--faint,#5c6a86)}
.mcmdk-results{max-height:56vh;overflow-y:auto;overscroll-behavior:contain;padding:.35rem}
.mcmdk-empty{color:var(--muted,#8592ad);font-size:.9rem;padding:1.2rem;text-align:center}
.mcmdk-row{display:flex;align-items:center;gap:.7rem;padding:.55rem .7rem;border-radius:0;cursor:pointer}
.mcmdk-row.sel,.mcmdk-row:hover{background:var(--panel2,rgba(255,255,255,.05))}
.mcmdk-tag{flex:0 0 auto;font-size:.58rem;font-weight:800;text-transform:uppercase;letter-spacing:.02em;color:#fff;padding:.12rem .3rem;border-radius:0;width:5.4rem;text-align:center;white-space:nowrap}
.mcmdk-tag.credit{background:#4a6b93}.mcmdk-tag.legal{background:#1c3a5e}.mcmdk-tag.macro{background:#2b4a7c}.mcmdk-tag.view{background:#5b6576}
.mcmdk-txt{min-width:0}
.mcmdk-t{display:block;font-weight:600;font-size:.9rem;color:var(--ink,#eaf0fb);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mcmdk-s{display:block;color:var(--muted,#8592ad);font-size:.75rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mcmdk-foot{border-top:1px solid var(--border,#232f47);padding:.5rem .8rem;color:var(--muted,#8592ad);font-size:.72rem;display:flex;gap:1rem}
.mcmdk-foot kbd{background:var(--panel2,rgba(255,255,255,.06));border-radius:0;padding:.05rem .3rem;font-family:inherit;font-weight:700}
/* On touch phones the tag pill ("Go") and the keyboard-hint footer are irrelevant. */
@media (max-width:760px){.mcmdk-foot{display:none}.mcmdk-tag{width:4rem;padding:.1rem .18rem;font-size:.52rem;letter-spacing:.01em}}
/* iPhone: Bloomberg-Go full-screen search — top bar (magnifier · field · Cancel),
   results filling the screen, terminal-styled. */
@media (max-width:760px){
  .mcmdk{z-index:9000}
  .mcmdk-scrim{display:none}
  .mcmdk-panel{position:fixed;inset:0;top:0;left:0;right:0;bottom:0;margin:0;max-width:none;width:100vw;height:100dvh;max-height:100dvh;border:0;border-radius:0;box-shadow:none;display:flex;flex-direction:column;overflow:hidden;background:var(--bg,#05080f)}
  .mcmdk-bar{flex:0 0 auto;gap:9px;padding:6px 8px 6px 13px;padding-top:calc(env(safe-area-inset-top,0px) + 8px);background:var(--head,#080d17);border-bottom:1px solid var(--border,#232f47)}
  .mcmdk-mag{display:block;flex:0 0 auto;width:18px;height:18px;color:var(--faint,#5c6a86)}
  .mcmdk .mcmdk-input{border:0 !important;border-bottom:0 !important;padding:.5rem .1rem;font-size:16px}
  .mcmdk-cancel{display:block;flex:0 0 auto;border:0;background:transparent;color:var(--accent,#fb8b1e);font:inherit;font-size:14px;font-weight:600;padding:.4rem .35rem;cursor:pointer;white-space:nowrap}
  .mcmdk-results{flex:1 1 auto;max-height:none;padding:0}
  .mcmdk-row{border-bottom:1px solid var(--border,#232f47);padding:.72rem .9rem;gap:.7rem}
  .mcmdk-t{font-size:.95rem}.mcmdk-s{font-size:.8rem}
  .mcmdk-empty{padding:1.4rem}
}`;

let _mounted = false;
export function mountPalette() {
  if (_mounted) return; _mounted = true;
  if (!document.getElementById("mcmdk-style")) {
    const st = document.createElement("style"); st.id = "mcmdk-style"; st.textContent = STYLE; document.head.appendChild(st);
  }
  const ov = document.createElement("div");
  ov.className = "mcmdk"; ov.id = "mcmdk"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "Search Wire");
  ov.innerHTML = `<div class="mcmdk-scrim" data-close></div>
    <div class="mcmdk-panel">
      <div class="mcmdk-bar">
        <svg class="mcmdk-mag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.6" y1="15.6" x2="21" y2="21"/></svg>
        <input class="mcmdk-input" type="text" placeholder="Search deals, managers, cases…" autocomplete="off" spellcheck="false" aria-label="Search" />
        <button class="mcmdk-cancel" type="button" data-close aria-label="Cancel search">Cancel</button>
      </div>
      <div class="mcmdk-results"></div>
      <div class="mcmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>
    </div>`;
  document.body.appendChild(ov);

  const input = ov.querySelector(".mcmdk-input"), results = ov.querySelector(".mcmdk-results");
  const idx = buildIndex();
  let sel = 0, current = [];

  const score = (e, q) => { const t = e.title.toLowerCase(); return t === q ? 0 : t.startsWith(q) ? 1 : t.includes(q) ? 2 : e.hay.includes(q) ? 3 : 4; };
  function searchIdx(q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    const toks = q.split(/\s+/);
    return idx.filter((e) => toks.every((t) => e.hay.includes(t)))
      .map((e) => ({ e, s: score(e, q) }))
      .sort((a, b) =>
        a.e.rank - b.e.rank ||
        (a.e.rank === 2 ? String(b.e.date).localeCompare(String(a.e.date)) : 0) ||
        a.s - b.s ||
        a.e.title.localeCompare(b.e.title))
      .slice(0, 40).map((x) => x.e);
  }
  function draw() {
    results.innerHTML = current.length
      ? current.map((e, i) => `<div class="mcmdk-row${i === sel ? " sel" : ""}" data-i="${i}"><span class="mcmdk-tag ${e.tag}">${esc(e.label || (e.tag === "view" ? "Go" : e.tag))}</span><span class="mcmdk-txt"><span class="mcmdk-t">${esc(e.title)}</span><span class="mcmdk-s">${esc(e.sub)}</span></span></div>`).join("")
      : (input.value.trim() ? `<div class="mcmdk-empty">No matches.</div>` : "");
    const s = results.querySelector(".mcmdk-row.sel"); if (s) s.scrollIntoView({ block: "nearest" });
  }
  const refresh = () => { current = searchIdx(input.value); sel = 0; draw(); };
  const go = (e) => { if (!e) return; close(); if (/^https?:\/\//i.test(e.href)) window.open(e.href, "_blank", "noopener"); else window.location.href = e.href; };
  // Focus SYNCHRONOUSLY within the tap/click gesture so iOS Safari pops the
  // keyboard immediately (a setTimeout would escape the gesture and suppress it).
  const open = () => { ov.classList.add("open"); input.value = ""; refresh(); input.focus({ preventScroll: true }); };
  const close = () => ov.classList.remove("open");

  ov.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", close));
  // A visible nav search button (any app topbar) opens the palette on click.
  document.addEventListener("click", (ev) => {
    if (ev.target.closest("[data-open-search]") && !ov.classList.contains("open")) { ev.preventDefault(); open(); }
  });
  input.addEventListener("input", refresh);
  results.addEventListener("click", (ev) => { const r = ev.target.closest(".mcmdk-row"); if (r) go(current[+r.getAttribute("data-i")]); });
  input.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowDown") { ev.preventDefault(); sel = Math.min(sel + 1, current.length - 1); draw(); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); sel = Math.max(sel - 1, 0); draw(); }
    else if (ev.key === "Enter") { ev.preventDefault(); go(current[sel]); }
    else if (ev.key === "Escape") { close(); }
  });
  const isTyping = (t) => { const tag = (t && t.tagName || "").toLowerCase(); return !!t && (t.isContentEditable || tag === "input" || tag === "textarea" || tag === "select"); };
  window.addEventListener("keydown", (ev) => {
    if (ev.key === "/" && !ev.metaKey && !ev.ctrlKey && !ev.altKey && !isTyping(ev.target) && !ov.classList.contains("open")) { ev.preventDefault(); open(); }
    else if (ev.key === "Escape" && ov.classList.contains("open")) close();
  });
}
