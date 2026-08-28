// =============================================================================
// v2/js/origination/app.js — the Origination Radar: a contained BD workspace for
// a finance partner targeting mid-market opportunistic / structured / solutions
// credit funds (docs/origination-radar-spec.md). NO algorithmic score — it's a
// filterable, sortable table of the target universe with signals shown as facts,
// plus YOUR private tier / warm flags / notes (localStorage overlay, per-device,
// never committed). Clicking a fund opens its enriched profile in the Profiles
// tab. Built from the shared terminal (.tdash / .tleague / .tchips) — no new
// look. mount(host, ctx) → {enter,leave}.
// =============================================================================
import { managers, deals, intel } from "/credit/js/data.js";
import { esc, fmtAum } from "/util.js?v=20260818-1";

// ---- Target universe: managers running a flexible / solutions-capital strategy
// (not vanilla senior-only). AUM is a FILTER, not a gate — "mid-market" is about
// the strategy, so a larger house with a solutions book still qualifies. ----
const SOLUTIONS = new Set([
  "Opportunistic Credit", "Distressed & Special Situations", "Mezzanine / Junior Debt",
  "Structured Credit / CLO", "NAV / Fund Finance", "Asset-Based Lending", "Real Estate Debt",
]);
const inUniverse = (m) => !m.notAum && (m.strategies || []).some((s) => SOLUTIONS.has(s));

// ---- Wallet: which of the five cross-sell product lines the fund is active in,
// derived from its structured/SLS items + strategies. ----
const WALLET = [["FF", "Fund finance"], ["SEC", "Secondaries"], ["STR", "Structured"], ["LEND", "Snr/Mezz"], ["RX", "Restructuring"]];
function walletOf(m) {
  const st = m.structured || [], strat = m.strategies || [];
  const has = (arr, re) => arr.some((s) => re.test(typeof s === "string" ? s : s.type || ""));
  const out = new Set();
  if (strat.includes("NAV / Fund Finance") || st.some((s) => s.type === "NAV")) out.add("FF");
  if (st.some((s) => ["CONT", "SEC", "STRIP"].includes(s.type))) out.add("SEC");
  if (strat.includes("Structured Credit / CLO") || st.some((s) => ["CFO", "SRT"].includes(s.type))) out.add("STR");
  if (has(strat, /Senior Direct Lending|Unitranche|Mezzanine/)) out.add("LEND");
  if (has(strat, /Distressed|Special Situations/)) out.add("RX");
  return [...out];
}
// Most-recent tracked activity for a manager (webNews / deals / intel) — the
// "how active / why now" signal. Returns { date, label } or null.
function latestOf(m) {
  let best = null;
  const consider = (date, label, url) => { const d = String(date || "").slice(0, 10); if (d && (!best || d > best.date)) best = { date: d, label, url: url || null }; };
  (m.webNews || []).forEach((w) => consider(w.date, "News", w.url));
  deals.forEach((d) => { if (d.managerId === m.id) consider(d.date, d.type || "Deal", d.sourceUrl); });
  intel.forEach((i) => { if (i.managerId === m.id) consider(i.date, i.type || "Intel", i.sourceUrl); });
  return best;
}
const aumOf = (m) => (m.aumTotal != null ? m.aumTotal : m.aum);
function aumBand(a) {
  if (a == null) return { key: "na", label: "n/a", mid: false };
  if (a < 1) return { key: "sub1", label: "<$1bn", mid: false };
  if (a <= 10) return { key: "mid", label: "$1–10bn", mid: true };
  if (a <= 50) return { key: "large", label: "$10–50bn", mid: false };
  return { key: "mega", label: "$50bn+", mid: false };
}

// ---- Private overlay (per-device localStorage; conflicts-clean, never committed).
// Shape mirrors the spec's KV so cross-device sync can be added later. ----
const OV_KEY = "meridian.origination";
function readOv() { try { const o = JSON.parse(localStorage.getItem(OV_KEY) || "null"); return o && o.targets ? o : { strengths: [], targets: {} }; } catch { return { strengths: [], targets: {} }; } }
function writeOv(o) { try { localStorage.setItem(OV_KEY, JSON.stringify(o)); } catch { /* ignore */ } }
const tgt = (ov, id) => ov.targets[id] || {};

const TIERS = ["", "A", "B", "C"];
const REL = [["none", "—"], ["warm-path", "Warm path"], ["named-contact", "Contact"], ["strong", "Strong"]];
const COV = [["none", "—"], ["dormant", "Dormant"], ["active", "Active client"]];

export function mount(host, ctx) {
  let ov = readOv();
  const uni = managers.filter(inUniverse).map((m) => ({
    m, aum: aumOf(m), band: aumBand(aumOf(m)), wallet: walletOf(m), latest: latestOf(m),
    advisers: (m.advisers || []).length,
  }));
  // Filter + sort state.
  const st = { pane: "radar", line: "all", band: "all", tier: "all", q: "", sort: "aum", dir: -1 };

  host.innerHTML = `
    <div class="tdash">
      <header class="tpanel-h twire-head">
        <div class="tchips" id="org-chips">
          <button type="button" class="tchip is-on" data-pane="radar">Radar</button>
          <button type="button" class="tchip" data-pane="pipeline">Pipeline</button>
        </div>
      </header>
      <div class="tpanes" id="org-panes">
        <div class="tpane" data-pane="radar">
          <div class="org-filters" id="org-filters"></div>
          <div class="tleague-wrap"><table class="tleague tleague-full org-tbl"><thead id="org-head"></thead><tbody id="org-rows"></tbody></table></div>
        </div>
        <div class="tpane" data-pane="pipeline" hidden><div id="org-pipe"></div></div>
      </div>
    </div>`;
  const $ = (s) => host.querySelector(s);

  // ---- filter bar ----------------------------------------------------------
  const opt = (v, l, cur) => `<option value="${esc(v)}"${v === cur ? " selected" : ""}>${esc(l)}</option>`;
  function renderFilters() {
    $("#org-filters").innerHTML = `
      <input type="search" id="org-q" class="tsearch" placeholder="Search name / HQ…" value="${esc(st.q)}" aria-label="Search targets">
      <label class="org-fl">Line <select id="org-line">${["all", ...WALLET.map((w) => w[0])].map((k) => opt(k, k === "all" ? "All" : (WALLET.find((w) => w[0] === k) || [])[1] || k, st.line)).join("")}</select></label>
      <label class="org-fl">AUM <select id="org-band">${[["all", "All"], ["mid", "$1–10bn"], ["sub1", "<$1bn"], ["large", "$10–50bn"], ["mega", "$50bn+"]].map(([k, l]) => opt(k, l, st.band)).join("")}</select></label>
      <label class="org-fl">Tier <select id="org-tier">${[["all", "All"], ["A", "A"], ["B", "B"], ["C", "C"], ["none", "Untiered"]].map(([k, l]) => opt(k, l, st.tier)).join("")}</select></label>`;
  }

  const walletChips = (w) => WALLET.map(([k, l]) => `<span class="org-w${w.includes(k) ? " on" : ""}" title="${esc(l)}">${k}</span>`).join("");
  const relOf = (id) => (tgt(ov, id).relationship || "none");

  function filtered() {
    let rows = uni.filter((r) => {
      const t = tgt(ov, r.m.id);
      if (st.line !== "all" && !r.wallet.includes(st.line)) return false;
      if (st.band !== "all" && r.band.key !== st.band) return false;
      if (st.tier === "none") { if (t.tier) return false; } else if (st.tier !== "all" && t.tier !== st.tier) return false;
      if (st.q) { const q = st.q.toLowerCase(); if (!((r.m.name + " " + (r.m.hq || "")).toLowerCase().includes(q))) return false; }
      return true;
    });
    const key = st.sort, warmRank = (id) => REL.findIndex(([k]) => k === relOf(id));
    rows.sort((a, b) => {
      let av, bv;
      if (key === "aum") { av = a.aum == null ? -1 : a.aum; bv = b.aum == null ? -1 : b.aum; }
      else if (key === "aumCredit") { av = a.m.aumCredit == null ? -1 : a.m.aumCredit; bv = b.m.aumCredit == null ? -1 : b.m.aumCredit; }
      else if (key === "latest") { av = a.latest ? a.latest.date : ""; bv = b.latest ? b.latest.date : ""; }
      else if (key === "warm") { av = warmRank(a.m.id); bv = warmRank(b.m.id); }
      else if (key === "tier") { av = tgt(ov, a.m.id).tier || "Z"; bv = tgt(ov, b.m.id).tier || "Z"; }
      else { av = a.m.name.toLowerCase(); bv = b.m.name.toLowerCase(); }
      return av < bv ? -st.dir : av > bv ? st.dir : 0;
    });
    return rows;
  }

  const th = (k, l, cls) => `<th class="org-sortable${st.sort === k ? " on" : ""}${cls ? " " + cls : ""}" data-sort="${k}">${esc(l)}${st.sort === k ? (st.dir > 0 ? " ▲" : " ▼") : ""}</th>`;
  function renderRadar() {
    $("#org-head").innerHTML = `<tr>${th("name", "Fund / manager")}<th class="org-hq-h">HQ</th><th>Strategy</th>${th("aum", "AUM")}${th("aumCredit", "Credit")}<th>Wallet</th><th>Advisers</th>${th("latest", "Latest")}${th("warm", "Warm")}${th("tier", "Tier")}</tr>`;
    const rows = filtered();
    const relLabel = { "none": "", "warm-path": "warm", "named-contact": "contact", "strong": "strong" };
    $("#org-rows").innerHTML = rows.map((r) => {
      const t = tgt(ov, r.m.id), id = r.m.id;
      const adv = r.advisers ? `${r.advisers} firm${r.advisers > 1 ? "s" : ""}` : `<span class="org-white-flag" title="No incumbent counsel recorded — potential white space">— white space?</span>`;
      const rel = relOf(id);
      const lt = r.latest
        ? (r.latest.url
          ? `<a class="org-lt-lnk" href="${esc(r.latest.url)}" target="_blank" rel="noopener"><span class="org-lt-k">${esc(r.latest.label)}</span> ${esc(r.latest.date)}</a>`
          : `<span class="org-lt-k">${esc(r.latest.label)}</span> ${esc(r.latest.date)}`)
        : "—";
      return `<tr data-id="${esc(id)}">`
        + `<td class="tl-nm"><a href="#" class="org-open" data-id="${esc(id)}">${esc(r.m.name)}</a></td>`
        + `<td class="org-hq-c">${esc(r.m.hq || "")}</td>`
        + `<td class="org-strat">${esc((r.m.strategies || []).slice(0, 2).join(" · "))}</td>`
        + `<td class="org-aum-c" title="Total AUM">${esc(fmtAum(r.aum))}</td>`
        + `<td class="org-aum-c org-aum-cr" title="Private-credit AUM">${r.m.aumCredit != null ? esc(fmtAum(r.m.aumCredit)) : "—"}</td>`
        + `<td class="org-wallet">${walletChips(r.wallet)}</td>`
        + `<td class="org-adv">${adv}</td>`
        + `<td class="org-latest">${lt}</td>`
        + `<td><button type="button" class="org-warm-btn${rel !== "none" ? " on" : ""}" data-id="${esc(id)}" title="Cycle relationship warmth" aria-label="Cycle relationship warmth${rel === "none" ? "" : " (currently " + relLabel[rel] + ")"}">${rel === "none" ? "☆" : "★"}<span class="org-warm-lbl">${relLabel[rel]}</span></button></td>`
        + `<td class="org-tier-c"><select class="org-tier" data-id="${esc(id)}" aria-label="Tier for ${esc(r.m.name)}">${TIERS.map((v) => `<option value="${v}"${v === (t.tier || "") ? " selected" : ""}>${v || "—"}</option>`).join("")}</select></td>`
        + `</tr>`;
    }).join("") || `<tr><td colspan="10" class="tw-empty muted small">No targets match these filters.</td></tr>`;
  }

  // ---- Pipeline: tiered targets with the deep BD controls + notes. ----------
  function renderPipe() {
    const rows = uni.filter((r) => tgt(ov, r.m.id).tier).sort((a, b) => (tgt(ov, a.m.id).tier || "Z").localeCompare(tgt(ov, b.m.id).tier || "Z") || a.m.name.localeCompare(b.m.name));
    if (!rows.length) { $("#org-pipe").innerHTML = `<p class="tw-empty muted small">No targets tiered yet — set a Tier (A/B/C) on the Radar to build your pipeline.</p>`; return; }
    const sel = (cls, id, opts, cur) => `<select class="${cls}" data-id="${esc(id)}">${opts.map(([v, l]) => `<option value="${v}"${v === cur ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
    $("#org-pipe").innerHTML = rows.map((r) => {
      const t = tgt(ov, r.m.id), id = r.m.id;
      return `<div class="org-card" data-id="${esc(id)}">`
        + `<div class="org-card-h"><span class="org-card-tier">${esc(t.tier)}</span><a href="#" class="org-open" data-id="${esc(id)}">${esc(r.m.name)}</a><span class="org-hq">${esc(r.m.hq || "")}</span><span class="org-card-w">${walletChips(r.wallet)}</span></div>`
        + `<div class="org-card-ctl"><label>Relationship ${sel("org-rel", id, REL, t.relationship || "none")}</label>`
        + `<label>Firm coverage ${sel("org-cov", id, COV, t.firmCoverage || "none")}</label></div>`
        + `<textarea class="org-notes" data-id="${esc(id)}" rows="2" placeholder="Notes / next action…">${esc(t.notes || "")}</textarea>`
        + `</div>`;
    }).join("");
  }

  function repaint() { renderFilters(); (st.pane === "radar" ? renderRadar : renderPipe)(); }
  const repaintCur = () => { (st.pane === "radar" ? renderRadar : renderPipe)(); };
  // Cross-device sync: localStorage is the instant local cache; a per-user KV
  // (/api/origination, behind Cloudflare Access) is the shared truth. Edits
  // persist locally, then debounce up; on load/re-entry the server copy is merged
  // in. Off-Access (no auth) it silently stays device-local.
  let cloud = false, pushTimer = null;
  const push = () => { if (!cloud) return; clearTimeout(pushTimer); pushTimer = setTimeout(() => { fetch("/api/origination", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ overlay: ov }) }).catch(() => {}); }, 500); };
  const setT = (id, patch) => { ov.targets[id] = { ...tgt(ov, id), ...patch }; writeOv(ov); push(); };
  async function initSync() {
    let r; try { r = await fetch("/api/origination", { headers: { accept: "application/json" } }); } catch { return; }
    if (!r || !r.ok) return;
    let d; try { d = await r.json(); } catch { return; }
    cloud = true;
    const srv = (d.overlay && typeof d.overlay === "object") ? d.overlay : { targets: {} };
    const local = readOv();
    // Server is the shared truth; keep any local-only targets this device added.
    ov = { strengths: (srv.strengths && srv.strengths.length) ? srv.strengths : local.strengths, targets: { ...local.targets, ...(srv.targets || {}) } };
    writeOv(ov);
    if (Object.keys(local.targets).some((id) => !(srv.targets || {})[id])) push();   // migrate local-only up
    repaintCur();
  }

  // ---- events (delegated) --------------------------------------------------
  $("#org-chips").addEventListener("click", (e) => {
    const b = e.target.closest(".tchip"); if (!b) return;
    st.pane = b.dataset.pane;
    $("#org-chips").querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    host.querySelectorAll("#org-panes .tpane").forEach((el) => { el.hidden = el.dataset.pane !== st.pane; });
    if (st.pane === "pipeline") renderPipe(); else renderRadar();
  });
  host.addEventListener("click", (e) => {
    const open = e.target.closest(".org-open");
    if (open) { e.preventDefault(); ctx.navigate(`${ctx.base}/profiles/#/manager/${open.dataset.id}`); return; }
    const sortTh = e.target.closest(".org-sortable");
    if (sortTh) { const k = sortTh.dataset.sort; if (st.sort === k) st.dir *= -1; else { st.sort = k; st.dir = (k === "name" || k === "tier") ? 1 : -1; } renderRadar(); return; }
    const warm = e.target.closest(".org-warm-btn");
    if (warm) { const id = warm.dataset.id; const order = ["none", "warm-path", "named-contact", "strong"]; const cur = relOf(id); setT(id, { relationship: order[(order.indexOf(cur) + 1) % order.length] }); renderRadar(); return; }
  });
  host.addEventListener("change", (e) => {
    const t = e.target;
    if (t.id === "org-line") { st.line = t.value; renderRadar(); }
    else if (t.id === "org-band") { st.band = t.value; renderRadar(); }
    else if (t.id === "org-tier") { st.tier = t.value; renderRadar(); }
    else if (t.classList.contains("org-tier")) { setT(t.dataset.id, { tier: t.value }); if (st.tier !== "all") renderRadar(); }
    else if (t.classList.contains("org-rel")) { setT(t.dataset.id, { relationship: t.value }); }
    else if (t.classList.contains("org-cov")) { setT(t.dataset.id, { firmCoverage: t.value }); }
  });
  host.addEventListener("input", (e) => {
    if (e.target.id === "org-q") { st.q = e.target.value; renderRadar(); const el = host.querySelector("#org-q"); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }
    else if (e.target.classList.contains("org-notes")) { setT(e.target.dataset.id, { notes: e.target.value }); }
  });

  repaint();
  initSync();
  return { enter() { ov = readOv(); repaintCur(); initSync(); }, leave() {} };
}
