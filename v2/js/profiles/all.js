// =============================================================================
// v2/js/profiles/all.js — Profiles ▸ All (owner 2026-10-15): the first and default
// Profiles tab. ONE directory of every covered entity — managers, hedge funds,
// investors and law firms — in the same .tpane / .tleague shape as the other lists, so
// the shared search, Filters (Type), Following, sort and CSV all work on it unchanged.
// Each row opens that entity's own profile. Built only from the committed rosters.
// =============================================================================
import { managers, HEDGE_FUNDS, lps } from "/credit/js/data.js";
import { firms } from "/legal/js/data.js";
import { fmtBn } from "/credit/js/shared.js";
import { esc } from "/util.js";

const TYPES = [["manager", "Manager"], ["hf", "Hedge fund"], ["lp", "Investor"], ["firm", "Law firm"]];
const LABEL = Object.fromEntries(TYPES);

export function allEntities() {
  const out = [];
  (managers || []).forEach((m) => m && m.id && out.push({ kind: "manager", id: m.id, name: m.name, hq: m.hq || "", aum: m.aum, sub: (m.strategies || []).slice(0, 2).join(" · ") }));
  (HEDGE_FUNDS || []).forEach((h) => h && h.id && out.push({ kind: "hf", id: h.id, name: h.name, hq: h.hq || "", aum: h.aum, sub: h.strategy || "" }));
  (lps || []).forEach((l) => l && l.id && out.push({ kind: "lp", id: l.id, name: l.name, hq: l.hq || "", aum: l.aum, sub: l.type || "" }));
  (firms || []).forEach((f) => f && f.id && out.push({ kind: "firm", id: f.id, name: f.name, hq: (f.london ? "London, UK" : f.hq || ""), aum: null, sub: "" }));
  return out.sort((a, b) => String(a.name).localeCompare(String(b.name)));
}

export function allPaneHTML() {
  const rows = allEntities().map((e) => `<tr class="clickable" data-href="#/${e.kind}/${esc(encodeURIComponent(e.id))}" title="${esc([e.name, LABEL[e.kind], e.sub, e.hq].filter(Boolean).join(" · "))}"`
    + ` data-name="${esc([e.name, LABEL[e.kind], e.sub, e.hq].filter(Boolean).join(" ").toLowerCase())}" data-f-type="${esc(LABEL[e.kind])}">`
    + `<td class="tl-nm">${esc(e.name)}</td>`
    + `<td class="pf-c-meta">${esc(e.sub || "—")}</td>`
    + `<td class="pf-c-meta tl-hq">${esc(e.hq || "—")}</td>`
    + `<td class="pf-c-main tl-n" data-sort="${e.aum != null ? e.aum : ""}">${e.aum != null ? esc(fmtBn(e.aum)) : "—"}</td></tr>`).join("");
  return `<div class="tpane" data-pane="all">
              <header class="tpanel-h thead-search">
                <input type="search" id="all-q" class="tsearch" placeholder="Search every manager, hedge fund, investor and law firm…" aria-label="Search all profiles">
              </header>
              <div class="tleague-wrap">
              <table class="tleague tleague-full pf-cards pf-all-tbl">
                <thead><tr><th>Name</th><th>Detail</th><th>HQ</th><th class="tl-n">AUM</th></tr></thead>
                <tbody id="all-rows">${rows}</tbody>
              </table>
              </div>
            </div>`;
}
