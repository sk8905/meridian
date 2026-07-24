// =============================================================================
// v2/js/dashboard/app.js — the Dashboard tab: three big-picture OVERVIEW
// sub-tabs (Macro · Equities · Credit). Not a live trading terminal — one
// "regime read" then a scannable grid per the design brief. Curated seed data
// comes from dashboard/js/data.js; live figures (credit spreads via /api/rates)
// override at runtime; macro reuses the macro desk's own OUTLOOK/CYCLE/BUBBLE
// and MATWALL so there is ONE source of truth. mount(host, ctx) → {enter,leave}.
// =============================================================================
import { esc } from "/util.js?v=20260719-1";
import { EQ_INDICES, EQ_SECTORS, EQ_VALUATION, EQ_VOL, EQ_IPO, CR_STRESS, DASH_ASOF } from "/dashboard/js/data.js?v=20260724-1";
import { OUTLOOK, CYCLE, BUBBLE, MATWALL } from "/macro/js/content.js?v=20260724-4";

const SUBTABS = [["macro", "Macro"], ["equities", "Equities"], ["credit", "Credit"]];
const pct1 = (n) => (n == null ? "—" : (n > 0 ? "+" : "") + n.toFixed(1) + "%");
const upcls = (n) => (n == null ? "" : n > 0 ? "up" : n < 0 ? "down" : "");
const asOf = (d) => (d ? `<span class="dsh-asof">as of ${esc(d)}</span>` : "");
const srcLink = (u) => (u ? ` <a class="dsh-src" href="${esc(u)}" target="_blank" rel="noopener noreferrer" title="Source">↗</a>` : "");

export function mount(host, ctx) {
  let pane = "macro";

  // ---- Equities -----------------------------------------------------------
  function idxTile(x, live) {
    const l = live && live[x.id];
    const lv = l && l.value != null ? l.value : x.level;
    const dp = l ? l.changePct : null;
    const sub = dp != null ? `<span class="dsh-idx-yt ${upcls(dp)}">${pct1(dp)} today</span>`
      : x.ytd != null ? `<span class="dsh-idx-yt ${upcls(x.ytd)}">${pct1(x.ytd)} YTD</span>`
        : `<span class="dsh-idx-yt"></span>`;
    return `<a class="dsh-idx" data-idx="${esc(x.id)}" href="${esc(x.source)}" target="_blank" rel="noopener noreferrer">`
      + `<span class="dsh-idx-nm">${esc(x.name)}</span>`
      + `<span class="dsh-idx-lv">${lv != null ? esc(Number(lv).toLocaleString("en-GB", { maximumFractionDigits: 2 })) : "—"}</span>`
      + sub + `</a>`;
  }
  function indexStripHTML(live) { return `<div class="dsh-strip" id="dsh-strip">${EQ_INDICES.map((x) => idxTile(x, live)).join("")}</div>`; }
  // Live index closes from the Worker (/api/eqindices, Yahoo→FRED). Overrides the
  // seed level and shows today's %move; falls back to the seed strip on any error.
  async function loadIndices() {
    const strip = host.querySelector("#dsh-strip");
    if (!strip) return;
    try {
      const r = await fetch("/api/eqindices", { headers: { accept: "application/json" } });
      const d = r.ok ? await r.json() : null;
      const arr = (d && d.indices) || [];
      if (!arr.length) return;
      const live = {}; arr.forEach((x) => { if (x && x.id) live[x.id] = x; });
      strip.outerHTML = indexStripHTML(live);
    } catch { /* keep the sourced seed strip */ }
  }
  function sectorBarsHTML() {
    const rows = EQ_SECTORS.rows.filter((r) => r.ytd != null).sort((a, b) => b.ytd - a.ytd);
    const max = Math.max(1, ...rows.map((r) => Math.abs(r.ytd)));
    const bar = (r) => {
      const w = (Math.abs(r.ytd) / max) * 50; // half-width max (diverging around centre)
      const pos = r.ytd >= 0;
      return `<div class="dsh-sec"><span class="dsh-sec-nm">${esc(r.name)}</span>`
        + `<span class="dsh-sec-track"><span class="dsh-sec-bar ${pos ? "up" : "down"}" style="width:${w.toFixed(1)}%;${pos ? "left:50%" : `right:50%;left:auto`}"></span></span>`
        + `<span class="dsh-sec-v ${upcls(r.ytd)}">${pct1(r.ytd)}</span></div>`;
    };
    return `<div class="dsh-sectors" data-view="bars">${rows.map(bar).join("")}</div>`;
  }
  function sectorHeatHTML() {
    const rows = [...EQ_SECTORS.rows].filter((r) => r.ytd != null).sort((a, b) => b.ytd - a.ytd);
    const max = Math.max(1, ...rows.map((r) => Math.abs(r.ytd)));
    const tile = (r) => {
      const a = (Math.abs(r.ytd) / max) * 0.5 + 0.12;
      const col = r.ytd >= 0 ? `rgba(63,192,141,${a.toFixed(2)})` : `rgba(242,109,132,${a.toFixed(2)})`;
      return `<div class="dsh-heat-t" style="background:${col}"><span>${esc(r.name)}</span><b>${pct1(r.ytd)}</b></div>`;
    };
    return `<div class="dsh-heat" data-view="heat" hidden>${rows.map(tile).join("")}</div>`;
  }
  function volBand(level) {
    if (level == null) return ["—", ""];
    if (level < 15) return ["Low", "up"];
    if (level < 20) return ["Light", "up"];
    if (level < 28) return ["Neutral", ""];
    if (level < 40) return ["Elevated", "down"];
    return ["Panic", "down"];
  }
  function valVolHTML() {
    const val = EQ_VALUATION.map((v) => `<div class="dsh-kv"><span class="dsh-kv-k">${esc(v.name)} fwd P/E</span><span class="dsh-kv-v">${v.fwdPE != null ? v.fwdPE.toFixed(1) + "×" : "—"}${srcLink(v.source)}</span></div>`).join("");
    const vol = EQ_VOL.map((v) => { const [b, c] = volBand(v.level); return `<div class="dsh-kv"><span class="dsh-kv-k">${esc(v.name)}</span><span class="dsh-kv-v ${c}">${v.level != null ? v.level.toFixed(1) : "—"} <span class="dsh-band ${c}">${b}</span>${srcLink(v.source)}</span></div>`; }).join("");
    return `<div class="dsh-kvgrid">${val}${vol}</div>`;
  }
  function ipoHTML() {
    const row = (x) => `<tr><td class="dsh-nm">${esc(x.company)}</td><td>${esc(x.exchange)}</td><td class="dsh-r">${esc(x.size)}</td><td>${esc(x.timing)}</td><td><span class="dsh-tag dsh-tag-${x.status.toLowerCase()}">${esc(x.status)}</span>${srcLink(x.source)}</td></tr>`;
    return `<table class="dsh-tbl"><thead><tr><th>Company</th><th>Listing</th><th class="dsh-r">Size</th><th>Timing</th><th>Status</th></tr></thead><tbody>${EQ_IPO.map(row).join("")}</tbody></table>`;
  }
  function equitiesHTML() {
    return `<div class="dsh-pane">
      <section class="dsh-card"><h3 class="dsh-h">Global indices ${asOf(EQ_INDICES[0].asOf)}</h3>${indexStripHTML()}</section>
      <section class="dsh-card"><h3 class="dsh-h">S&amp;P 500 sectors — YTD
        <span class="dsh-toggle" role="group" aria-label="Sector view"><button type="button" class="dsh-tgl is-on" data-secview="bars">Bars</button><button type="button" class="dsh-tgl" data-secview="heat">Heatmap</button></span>
        ${asOf(EQ_SECTORS.asOf)}</h3>${sectorBarsHTML()}${sectorHeatHTML()}</section>
      <section class="dsh-card"><h3 class="dsh-h">Valuation &amp; volatility</h3>${valVolHTML()}</section>
      <section class="dsh-card"><h3 class="dsh-h">IPO / ECM pipeline</h3><div class="dsh-scroll">${ipoHTML()}</div></section>
    </div>`;
  }

  // ---- Credit -------------------------------------------------------------
  function stressHTML() {
    const card = (s) => `<div class="dsh-stress"><div class="dsh-stress-h"><span class="dsh-nm">${esc(s.name)}</span><span class="dsh-tag dsh-tag-stress">${esc(s.status)}</span></div>`
      + `<div class="dsh-stress-m">${esc(s.sector)} · ${esc(s.hq)} · <strong>${esc(s.debt)}</strong> · ${esc(s.latest)}</div>`
      + `<div class="dsh-stress-n">${esc(s.note)}${srcLink(s.source)}</div></div>`;
    return `<div class="dsh-stresslist">${CR_STRESS.map(card).join("")}</div>`;
  }
  function maturityHTML() {
    const w = MATWALL && MATWALL.rated, wall = MATWALL && MATWALL.ratedWall;
    if (!w) return "";
    const summary = `<div class="dsh-kvgrid">
      <div class="dsh-kv"><span class="dsh-kv-k">Rated corporate debt maturing</span><span class="dsh-kv-v">${esc(w.total)} <span class="dsh-band">${esc(w.window)}</span></span></div>
      <div class="dsh-kv"><span class="dsh-kv-k">Investment-grade share</span><span class="dsh-kv-v">${esc(String(w.igPct))}%${srcLink(w.src && w.src.url)}</span></div>
    </div>`;
    let ladder = "";
    if (wall && Array.isArray(wall.buckets) && wall.buckets.length) {
      const max = wall.max || Math.max(...wall.buckets.map((b) => b.amt));
      const col = (b) => `<div class="dsh-ladder-col"><span class="dsh-ladder-v">$${(b.amt / 1000).toFixed(1)}tn</span>`
        + `<span class="dsh-ladder-bar" style="height:${Math.max(2, Math.round((b.amt / max) * 100))}%"></span>`
        + `<span class="dsh-ladder-y">${esc(b.y)}</span></div>`;
      ladder = `<div class="dsh-ladder" role="img" aria-label="Maturity wall by year">${wall.buckets.map(col).join("")}</div>`
        + `<div class="dsh-ladder-cap">Face value maturing by year · ${esc(wall.asOf || "")}</div>`;
    }
    return summary + ladder;
  }
  function creditHTML() {
    return `<div class="dsh-pane">
      <section class="dsh-card"><h3 class="dsh-h">Credit spreads — ICE BofA OAS <span class="dsh-live">live</span></h3><div id="dsh-spreads" class="dsh-spreads"><p class="dsh-load">Loading live spreads…</p></div></section>
      <section class="dsh-card"><h3 class="dsh-h">Maturity wall</h3>${maturityHTML()}</section>
      <section class="dsh-card"><h3 class="dsh-h">Stress — situations in focus <span class="dsh-n">(${CR_STRESS.length})</span></h3>${stressHTML()}</section>
    </div>`;
  }
  // Live spread stack from the Worker's /api/rates (US IG/HY/CCC + Euro HY OAS).
  async function loadSpreads() {
    const el = host.querySelector("#dsh-spreads");
    if (!el) return;
    try {
      const r = await fetch("/api/rates", { headers: { accept: "application/json" } });
      const d = r.ok ? await r.json() : null;
      const rows = ((d && (d.rates || d.series || d)) || []).filter((x) => x && /oas/i.test(x.label || ""));
      if (!rows.length) { el.innerHTML = `<p class="dsh-load">Live spreads unavailable — <a href="https://fred.stlouisfed.org/series/BAMLH0A0HYM2" target="_blank" rel="noopener noreferrer">FRED ICE BofA OAS ↗</a></p>`; return; }
      el.innerHTML = rows.map((x) => `<div class="dsh-spread"><span class="dsh-spread-nm">${esc(String(x.label).replace(/\s*OAS$/i, ""))}</span>`
        + `<span class="dsh-spread-v">${x.value != null ? esc(String(x.value)) : "—"}<span class="dsh-spread-u">${esc(x.unit || "bp")}</span></span>`
        + `${srcLink(x.href)}</div>`).join("");
    } catch { el.innerHTML = `<p class="dsh-load">Live spreads unavailable right now.</p>`; }
  }

  // ---- Macro (reuse the macro desk's regime reads) ------------------------
  function macroHTML() {
    const o = OUTLOOK || {}, b = (BUBBLE && BUBBLE.market) || {}, c = CYCLE || {};
    const line = (k, v) => `<div class="dsh-kv"><span class="dsh-kv-k">${esc(k)}</span><span class="dsh-kv-v">${v}</span></div>`;
    const usSum = (o.us && (o.us.summary || o.us.stance || (o.us.path && o.us.path[0]))) || "";
    const ukSum = (o.uk && (o.uk.summary || o.uk.stance || (o.uk.path && o.uk.path[0]))) || "";
    const bubbleSum = (BUBBLE && BUBBLE.summary) || (b && b.read) || "";
    return `<div class="dsh-pane">
      <section class="dsh-card"><h3 class="dsh-h">Rate outlook</h3><div class="dsh-kvgrid">
        ${line("US / Fed", esc(String(usSum)) || "—")}
        ${line("UK / BoE", esc(String(ukSum)) || "—")}
      </div>${asOf((OUTLOOK && OUTLOOK.sources && "see Macro") || DASH_ASOF)}</section>
      <section class="dsh-card"><h3 class="dsh-h">Cycle &amp; regime</h3><div class="dsh-kvgrid">
        ${line("Bubble read", esc(String(bubbleSum)).slice(0, 220) || "—")}
      </div></section>
      <section class="dsh-card dsh-more"><a href="${esc(ctx.base)}/macro/">Open the full Macro desk — indicators, yield curve, cycle &amp; bubble →</a></section>
    </div>`;
  }

  // ---- Shell + routing ----------------------------------------------------
  function render() {
    const nav = SUBTABS.map(([k, l]) => `<a class="tchip${pane === k ? " is-on" : ""}" href="${ctx.base}/dashboard/${k}" data-sub="${k}">${l}</a>`).join("");
    const body = pane === "equities" ? equitiesHTML() : pane === "credit" ? creditHTML() : macroHTML();
    host.innerHTML = `<div class="dsh"><header class="dsh-nav tdet-secnav"><div class="tchips">${nav}</div></header>${body}</div>`;
    if (pane === "credit") loadSpreads();
    if (pane === "equities") { wireSectorToggle(); loadIndices(); }
  }
  function wireSectorToggle() {
    host.querySelectorAll(".dsh-tgl").forEach((b) => b.addEventListener("click", () => {
      const v = b.dataset.secview;
      host.querySelectorAll(".dsh-tgl").forEach((x) => x.classList.toggle("is-on", x === b));
      const bars = host.querySelector('.dsh-sectors'), heat = host.querySelector('.dsh-heat');
      if (bars) bars.hidden = v !== "bars";
      if (heat) heat.hidden = v !== "heat";
    }));
  }
  // Sub-tab clicks navigate (router calls enter with the new sub); intercept for
  // an instant in-view switch too.
  host.addEventListener("click", (e) => {
    const a = e.target.closest(".tchip[data-sub]");
    if (a) { e.preventDefault(); e.stopPropagation(); pane = a.dataset.sub; render(); try { history.replaceState(null, "", a.getAttribute("href")); } catch { /* */ } }
  });

  // The runtime mounts a view once and expects it to RENDER ITSELF — it only calls
  // enter() for same-tab sub-nav / cross-tab deep links, not on first mount. Derive
  // the initial sub-tab from the URL (/v2/dashboard/<sub>) and paint now.
  const subFromUrl = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    const i = parts.indexOf("dashboard");
    return i >= 0 ? parts[i + 1] : "";
  };
  pane = SUBTABS.some(([x]) => x === subFromUrl()) ? subFromUrl() : "macro";
  render();

  return {
    enter(sub) {
      const k = (sub && sub[0]) || subFromUrl() || "macro";
      pane = SUBTABS.some(([x]) => x === k) ? k : "macro";
      render();
    },
    leave() {},
  };
}
