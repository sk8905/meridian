// =============================================================================
// v2/js/credit-roster.js — the two reference rosters on Dashboard ▸ Credit (moved from
// Transactions, 2026-10): the European credit universe (ELLI obligors with their issuer
// rating and 12-month trend) and the BDC roster (listed vs private, sourced figures, live
// Px/NAV). Each is ONE card that reads the same on desktop and iPhone: a one-row bar
// (search · quick chips · sort · CSV), then a list of two-line rows (name · headline
// figure / meta) that expand in place — never a sideways-scrolling table.
//
// Deep links: /v2/dashboard/credit?credit=<name> or ?bdc=<ticker|name> opens that row
// (the palette, the Stress list and old #/credits · #/bdc links land here).
// rosterCardsHTML() → the two card shells; wireRosters(host) → renders + binds them.
// =============================================================================
import { deals, managers } from "/credit/js/data.js";
import { BDCS } from "/credit/js/bdcs.js";
import { EUR_CREDITS, EUR_CREDITS_META, creditsBySector } from "/credit/js/eu-credits.js";
import { amountOf, fmtAmt } from "/credit/js/tx.js";
import { esc } from "/util.js";
import { fmtDay } from "/feed.js";
import { downloadCSV } from "./csv.js";

const _mById = new Map(managers.map((m) => [m.id, m]));
const mgrName = (id) => (_mById.get(id) || {}).name || "";
const PROFILE = (id) => `/v2/profiles/#/manager/${encodeURIComponent(id)}`;

// ---- state (module scope: survives Dashboard re-renders) ---------------------
const cr = { q: "", trend: "", sort: "", open: "", all: false };
const bdc = { q: "", sort: "size-desc", open: "" };
let _quotes = null, _quotesTried = false;
const CR_PREVIEW = 12;
// iPhone: rosters preview 10 rows; "See all" hands the live roster to the Dashboard's
// full-screen sheet (opts.onSeeAll) instead of expanding the card in place.
const PHONE_PREVIEW = 10;
const isPhone = () => !!(typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width:900px)").matches);

// ---- Credits ------------------------------------------------------------------
const RATING_ORDER = ["AAA", "AA+", "AA", "AA-", "A+", "A", "A-", "BBB+", "BBB", "BBB-", "BB+", "BB", "BB-", "B+", "B", "B-", "CCC+", "CCC", "CCC-", "CC", "C", "SD", "D"];
const ratingRank = (r) => { const i = RATING_ORDER.indexOf(r); return i === -1 ? 999 : i; };
const TREND = {
  up: { g: "▲", c: "tx-up", t: "Rating up over the past 12 months" },
  down: { g: "▼", c: "tx-dn", t: "Rating down over the past 12 months" },
  flat: { g: "–", c: "tx-fl", t: "Rating unchanged over the past 12 months" },
};
const CR_SORTS = [["", "Sector"], ["name", "Name A–Z"], ["rating", "Rating, best first"], ["rating-worst", "Rating, worst first"], ["deals", "Most tracked deals"]];
// An obligor's distinctive name, legal-form suffixes stripped ("Verisure Holding AB" →
// "Verisure"), for matching it in deal copy. Too-short cores never match.
const LEGAL = /\b(?:holdings?|group|bidco|topco|midco|holdco|lux(?:embourg)?|finance|financing|international|plc|ltd|limited|llc|inc|ab|asa|as|a\/s|sa|sas|sarl|s\.?a\.?r\.?l\.?|s\.?à\.?\s?r\.?l\.?|gmbh|ag|bv|b\.v\.|nv|n\.v\.|spa|s\.p\.a\.|srl|oy|oyj|se|kg|co|corp|corporation|the)\b\.?/gi;
const coreName = (n) => String(n || "").replace(/\(.*?\)/g, " ").replace(LEGAL, " ").replace(/[^A-Za-z0-9&' -]+/g, " ").replace(/\s+/g, " ").trim();
const reEsc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const _dated = deals.filter((d) => d && d.date);
const _mentions = new Map();
function mentionsOf(c) {
  if (_mentions.has(c.name)) return _mentions.get(c.name);
  const core = coreName(c.name);
  const out = core.length < 4 ? [] : _dated.filter((d) => new RegExp("\\b" + reEsc(core) + "\\b", "i").test((d.headline || "") + " " + (d.summary || ""))).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  _mentions.set(c.name, out);
  return out;
}
const crHit = (c) => { const q = cr.q.toLowerCase(); return !q || `${c.name} ${c.sector} ${c.rating || ""} ${c.jurisdiction || ""}`.toLowerCase().includes(q); };
function crList() {
  const list = EUR_CREDITS.filter((c) => crHit(c) && (!cr.trend || (c.trend || "flat") === cr.trend));
  const byName = (a, b) => a.name.localeCompare(b.name);
  if (cr.sort === "name") return list.sort(byName);
  if (cr.sort === "rating") return list.sort((a, b) => ratingRank(a.rating) - ratingRank(b.rating) || byName(a, b));
  if (cr.sort === "rating-worst") return list.sort((a, b) => (ratingRank(b.rating) === 999 ? -1 : ratingRank(b.rating)) - (ratingRank(a.rating) === 999 ? -1 : ratingRank(a.rating)) || byName(a, b));
  if (cr.sort === "deals") return list.sort((a, b) => mentionsOf(b).length - mentionsOf(a).length || byName(a, b));
  return creditsBySector(list).flatMap(([, arr]) => arr);
}
const dealLi = (d) => {
  const amt = amountOf(d);
  return `<li><a class="crr-deal" href="/v2/transactions/#/deal/${esc(d.id)}">${esc(d.headline || "—")}</a><span class="crr-dm">${esc(fmtDay(d.date))} · ${esc(mgrName(d.managerId) || "—")}${amt ? " · " + esc(fmtAmt(amt)) : ""}</span></li>`;
};
function crDetail(c) {
  const ms = mentionsOf(c);
  const rating = c.rating
    ? `${esc(c.rating)} (${esc(c.agency || EUR_CREDITS_META.agency)}${c.asOf ? ", " + esc(c.asOf) : ""})${c.source ? ` · <a href="${esc(c.source)}" target="_blank" rel="noopener noreferrer">rating action</a>` : ""}`
    : "Not rated / pending verification";
  const lenders = [...new Set(ms.map((d) => d.managerId).filter((id) => id && mgrName(id)))];
  return `<div class="crr-facts"><span class="crr-k">Rating</span><span>${rating}</span></div>`
    + (lenders.length ? `<div class="crr-facts"><span class="crr-k">Lenders / investors</span><span>${lenders.map((id) => `<a href="${PROFILE(id)}">${esc(mgrName(id))}</a>`).join(", ")}</span></div>` : "")
    + (ms.length ? `<div class="crr-k crr-kh">Tracked deals naming ${esc(coreName(c.name))} · ${ms.length}</div><ul class="crr-deals">${ms.slice(0, 8).map(dealLi).join("")}</ul>`
      : `<p class="crr-none">No tracked deal names ${esc(coreName(c.name))} yet.</p>`);
}
function crRow(c) {
  const tr = TREND[c.trend] || TREND.flat, open = cr.open === c.name, n = mentionsOf(c).length;
  return `<li class="crr-row${open ? " is-open" : ""}" data-cr="${esc(c.name)}">`
    + `<button type="button" class="crr-hd" aria-expanded="${open}">`
    + `<span class="crr-a"><span class="crr-nm">${esc(c.name)}</span><span class="crr-v"><span class="tcr-tr ${tr.c}" title="${tr.t}">${tr.g}</span> <span class="tcr-rt${c.rating ? "" : " tcr-nr"}">${esc(c.rating || "NR")}</span></span></span>`
    + `<span class="crr-b"><span>${esc(c.sector || "")}</span><span>${esc(c.jurisdiction || "")}</span>${n ? `<span>${n} deal${n === 1 ? "" : "s"}</span>` : ""}</span>`
    + `</button>${open ? `<div class="crr-x">${crDetail(c)}</div>` : ""}</li>`;
}
function creditsBody() {
  if (!EUR_CREDITS.length) return `<p class="crr-none">The European credit universe (anchored to the ${esc(EUR_CREDITS_META.index)}) is being compiled — sourced names and ratings land here as they’re verified.</p>`;
  const list = crList();
  const narrowed = !!(cr.q || cr.trend);
  const lim = isPhone() ? PHONE_PREVIEW : CR_PREVIEW;
  const shown = cr.all || narrowed ? list : list.slice(0, Math.max(lim, list.findIndex((c) => c.name === cr.open) + 1));
  const down = EUR_CREDITS.filter((c) => c.trend === "down").length, up = EUR_CREDITS.filter((c) => c.trend === "up").length;
  const chip = (v, l) => `<button type="button" class="crr-chip${cr.trend === v ? " is-on" : ""}" data-crtrend="${v}" aria-pressed="${cr.trend === v}">${l}</button>`;
  return `<div class="crr-bar"><input type="search" class="crr-q" data-roster="credits" placeholder="Search credits" aria-label="Search credits" value="${esc(cr.q)}">`
    + `<select class="crr-sort" data-roster="credits" aria-label="Sort the credits">${CR_SORTS.map(([v, l]) => `<option value="${v}"${cr.sort === v ? " selected" : ""}>${l}</option>`).join("")}</select>`
    + `<button type="button" class="crr-csv" data-csv="credits">CSV</button></div>`
    + `<div class="crr-chips">${chip("", `All ${EUR_CREDITS.length}`)}${chip("down", `▼ Downgraded ${down}`)}${chip("up", `▲ Upgraded ${up}`)}</div>`
    + `<div class="crr-body">${list.length ? `<ul class="crr-list">${shown.map(crRow).join("")}</ul>` : `<p class="crr-none">No credits match.</p>`}`
    + (shown.length < list.length ? (isPhone() ? `<button type="button" class="dsh-seeall" data-crall="1">See all ${list.length} <span aria-hidden="true">›</span></button>` : `<button type="button" class="crr-more" data-crall="1">Show all ${list.length}</button>`) : "") + `</div>`;
}

// ---- BDCs ----------------------------------------------------------------------
// Every figure is from the fund's own latest SEC filing / IR release (linked per row);
// the listed price ÷ NAV ratio is computed live from /api/quotes. Certifiable data only
// — an unverified field reads "n/a" rather than a guess.
const BDC_SORTS = [["size-desc", "Largest"], ["name-asc", "Name A–Z"], ["nav-desc", "NAV / sh"], ["na-desc", "Non-accrual, highest"], ["pxnav-asc", "Px/NAV, lowest"]];
const bdcKey = (b) => b.ticker || b.name;
const bdcPxNav = (b) => {
  if (b.structure !== "listed" || b.nav == null || !_quotes) return null;
  const q = _quotes[b.ticker];
  return (q && q.price != null) ? q.price / b.nav : null;
};
const bdcSize = (b) => b.totalAssets != null ? b.totalAssets : (b.netAssets != null ? b.netAssets : (b.portfolio != null ? b.portfolio : null));
const bdcSizeTxt = (b) => b.totalAssets != null ? `$${b.totalAssets}bn` : b.netAssets != null ? `$${b.netAssets}bn net` : b.portfolio != null ? `$${b.portfolio}bn port.` : "n/a";
const BDC_VAL = { size: bdcSize, name: (b) => b.name.toLowerCase(), nav: (b) => b.nav, na: (b) => b.nonAccrualFV, pxnav: bdcPxNav };
function bdcSorted(list) {
  const [k, dir] = bdc.sort.split("-"), f = BDC_VAL[k] || BDC_VAL.size, sgn = dir === "asc" ? 1 : -1;
  return list.slice().sort((a, b) => {
    const x = f(a), y = f(b);
    if (x == null || y == null) return x == null && y == null ? a.name.localeCompare(b.name) : x == null ? 1 : -1;
    return (x < y ? -1 : x > y ? 1 : 0) * sgn || a.name.localeCompare(b.name);
  });
}
const bdcMatch = (b) => { const q = bdc.q.toLowerCase(); return !q || b.name.toLowerCase().includes(q) || (b.manager || "").toLowerCase().includes(q) || (b.ticker || "").toLowerCase().includes(q); };
function bdcLiquidity(b) {
  if (b.structure === "listed") {
    const r = bdcPxNav(b);
    if (r == null) return "";
    const prem = r >= 1;
    return `<span class="tbdc-pxnav ${prem ? "is-prem" : "is-disc"}" title="Live price ÷ latest reported NAV — ${prem ? "premium" : "discount"} to NAV">${r.toFixed(2)}× NAV</span>`;
  }
  if (b.repurchaseProrated === true) return `<span class="tbdc-gated" title="Repurchase requests exceeded the cap and were prorated (gated)">GATED</span>`;
  if (b.repurchaseRequestedPct != null) return `<span>${b.repurchaseRequestedPct}% redemptions req.</span>`;
  return "";
}
function bdcDetail(b) {
  const out = [];
  if (b.totalAssets != null) out.push(["Total assets", `$${b.totalAssets}bn${b.totalAssetsAsOf ? " (" + b.totalAssetsAsOf + ")" : ""}`]);
  if (b.netAssets != null) out.push(["Net assets", `$${b.netAssets}bn aggregate NAV${b.navAsOf ? " (" + b.navAsOf + ")" : ""}`]);
  if (b.portfolio != null) out.push(["Portfolio", `$${b.portfolio}bn at fair value${b.navAsOf ? " (" + b.navAsOf + ")" : ""}`]);
  if (b.nonAccrualFV != null) out.push(["Non-accruals", `${b.nonAccrualFV}% at fair value${b.nonAccrualCost != null ? ", " + b.nonAccrualCost + "% at cost" : ""}${b.nonAccrualAsOf ? " (" + b.nonAccrualAsOf + ")" : ""}`]);
  if (b.nav != null) out.push(["NAV / share", `$${b.nav}${b.navAsOf ? " (" + b.navAsOf + ")" : ""}`]);
  if (b.structure === "nontraded" && (b.repurchaseCapPct != null || b.repurchaseRequestedPct != null || b.repurchaseProrated != null)) {
    const bits = [];
    if (b.repurchaseCapPct != null) bits.push(`${b.repurchaseCapPct}% of NAV quarterly cap`);
    if (b.repurchaseRequestedPct != null) bits.push(`${b.repurchaseRequestedPct}% requested`);
    if (b.repurchaseProrated === true) bits.push("prorated (gated)");
    else if (b.repurchaseProrated === false) bits.push("fully honoured");
    out.push(["Repurchases", bits.join(" · ") + (b.repurchaseAsOf ? " (" + b.repurchaseAsOf + ")" : "")]);
  }
  const facts = out.length ? out.map(([k, v]) => `<div class="crr-facts"><span class="crr-k">${esc(k)}</span><span>${esc(v)}</span></div>`).join("")
    : `<p class="crr-none">No certifiable figures on file yet — see the fund's SEC filings.</p>`;
  const hold = b.cik ? `<button type="button" class="tbdc-hold-btn" data-cik="${esc(b.cik)}">Load latest holdings (SEC)</button><div class="tbdc-hold"></div>` : "";
  const src = [...(b.sources || []).map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`),
    ...(b.edgar ? [`<a href="${esc(b.edgar)}" target="_blank" rel="noopener noreferrer">SEC EDGAR filings</a>`] : [])];
  return facts + hold + (src.length ? `<div class="crr-srcs">${src.join(" · ")}</div>` : "");
}
function bdcRow(b) {
  const open = bdc.open && (bdc.open === b.ticker || bdc.open === b.name);
  const mgr = b.managerId && mgrName(b.managerId) ? `<a href="${PROFILE(b.managerId)}" class="crr-mgr">${esc(b.manager)}</a>` : esc(b.manager || "");
  const tk = b.ticker ? `<span class="crr-tk">${esc(b.ticker)}${b.exchange ? " · " + esc(b.exchange) : ""}</span>` : "";
  const meta = [mgr, b.nav != null ? `NAV $${b.nav.toFixed(2)}` : "", b.nonAccrualFV != null ? `non-accrual ${b.nonAccrualFV}%` : "", bdcLiquidity(b)].filter(Boolean);
  return `<li class="crr-row${open ? " is-open" : ""}" data-bdc="${esc(bdcKey(b))}">`
    + `<div class="crr-hd" role="button" tabindex="0" aria-expanded="${!!open}">`
    + `<span class="crr-a"><span class="crr-nm">${esc(b.name)} ${tk}</span><span class="crr-v">${esc(bdcSizeTxt(b))}</span></span>`
    + `<span class="crr-b">${meta.map((m) => `<span>${m}</span>`).join("")}</span>`
    + `</div>${open ? `<div class="crr-x">${bdcDetail(b)}</div>` : ""}</li>`;
}
function bdcBody() {
  const list = bdcSorted(BDCS.filter(bdcMatch));
  // Phone preview: the first 10 (listed first, then private) unless searching, a row is
  // open, or the whole roster is showing in the sheet.
  const cut = isPhone() && !bdc.all && !bdc.q && !bdc.open && list.length > PHONE_PREVIEW;
  let left = cut ? PHONE_PREVIEW : Infinity;
  const take = (rows) => { const r = rows.slice(0, Math.max(0, left)); left -= r.length; return r; };
  const sec = (label, rows) => { const all = rows.length, r = take(rows); return r.length ? `<div class="crr-sec">${esc(label)} <span class="crr-n">${all}</span></div><ul class="crr-list">${r.map(bdcRow).join("")}</ul>` : ""; };
  return `<div class="crr-bar"><input type="search" class="crr-q" data-roster="bdc" placeholder="Search BDCs" aria-label="Search BDCs" value="${esc(bdc.q)}">`
    + `<select class="crr-sort" data-roster="bdc" aria-label="Sort the BDCs">${BDC_SORTS.map(([v, l]) => `<option value="${v}"${bdc.sort === v ? " selected" : ""}>${l}</option>`).join("")}</select>`
    + `<button type="button" class="crr-csv" data-csv="bdc">CSV</button></div>`
    + `<div class="crr-body">${list.length ? sec("Listed", list.filter((b) => b.structure === "listed")) + sec("Private (non-traded)", list.filter((b) => b.structure !== "listed"))
      : `<p class="crr-none">No BDCs match “${esc(bdc.q)}”.</p>`}`
    + (cut ? `<button type="button" class="dsh-seeall" data-bdcall="1">See all ${list.length} <span aria-hidden="true">›</span></button>` : "") + `</div>`;
}
function loadQuotes(onDone) {
  if (_quotesTried) return;
  _quotesTried = true;
  const syms = [...new Set(BDCS.filter((b) => b.structure === "listed" && b.ticker).map((b) => b.ticker))];
  if (!syms.length) return;
  fetch(`/api/quotes?symbols=${encodeURIComponent(syms.join(","))}`, { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => { if (d && d.quotes) { _quotes = d.quotes; onDone(); } })
    .catch(() => { /* the live ratio simply stays hidden */ });
}
function loadHoldings(cik, box, btn) {
  if (box.dataset.state === "loading" || box.dataset.state === "loaded") return;
  box.dataset.state = "loading";
  box.innerHTML = `<p class="crr-none">Fetching the latest SEC schedule of investments…</p>`;
  fetch(`/api/bdc?cik=${encodeURIComponent(cik)}`, { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      box.dataset.state = "loaded";
      if (btn) btn.hidden = true;
      const link = (d && d.source) ? ` — <a href="${esc(d.source)}" target="_blank" rel="noopener noreferrer">latest filing</a>` : "";
      if (!d || !Array.isArray(d.holdings) || !d.holdings.length) { box.innerHTML = `<p class="crr-none">Couldn't parse this filer's schedule of investments automatically${link}.</p>`; return; }
      const usd = (v) => v >= 1e9 ? "$" + (v / 1e9).toFixed(2) + "bn" : v >= 1e6 ? "$" + (v / 1e6).toFixed(0) + "m" : "$" + Math.round(v || 0).toLocaleString("en-US");
      box.innerHTML = `<ol class="crr-hold">${d.holdings.slice(0, 25).map((h) => `<li><span>${esc(h.name || "—")}</span><span>${usd(h.value)}${h.weight != null && isFinite(h.weight) ? ` · ${(h.weight * 100).toFixed(1)}%` : ""}</span></li>`).join("")}</ol>`
        + `<p class="crr-none">Top ${Math.min(25, d.holdings.length)} of ${d.holdings.length} parsed from the latest SEC filing${link}.</p>`;
    })
    .catch(() => { box.dataset.state = ""; if (btn) { btn.disabled = false; btn.textContent = "Load latest holdings (SEC)"; } box.innerHTML = `<p class="crr-none">Holdings unavailable right now — try again shortly.</p>`; });
}

// ---- public -----------------------------------------------------------------
// asOf(date) → the Dashboard's dated header stamp; each card is stamped with the
// latest as-of among its sourced figures (rating actions · fund filings).
const latest = (vals) => vals.filter((v) => /^\d{4}-\d{2}-\d{2}$/.test(v || "")).sort().pop() || "";
export function rosterCardsHTML(asOf = () => "") {
  return `<h3 class="dsh-term-lbl">Reference rosters</h3>
    <section class="dsh-card dsh-wide crr-card" id="dsh-credits"><h3 class="dsh-h">European credits — ELLI roster <span class="dsh-n">(${EUR_CREDITS.length})</span> ${asOf(latest(EUR_CREDITS.map((c) => c.asOf)))}</h3><div class="crr-root" data-roster="credits"></div></section>
    <section class="dsh-card dsh-wide crr-card" id="dsh-bdcs"><h3 class="dsh-h">BDCs — business development companies <span class="dsh-n">(${BDCS.length})</span> ${asOf(latest(BDCS.flatMap((b) => [b.navAsOf, b.totalAssetsAsOf])))}</h3><div class="crr-root" data-roster="bdc"></div></section>`;
}
// Record the open row in the URL (?credit= / ?bdc=), replacing — so a reload or a pasted
// link reopens it, and Back never walks row taps.
function writeUrl() {
  const p = new URLSearchParams(location.search);
  if (cr.open) p.set("credit", cr.open); else p.delete("credit");
  if (bdc.open) p.set("bdc", bdc.open); else p.delete("bdc");
  const qs = p.toString();
  try { history.replaceState(history.state, "", location.pathname + (qs ? "?" + qs : "") + location.hash); } catch { /* keep */ }
}
export function wireRosters(host, opts = {}) {
  const crRoot = host.querySelector('.crr-root[data-roster="credits"]'), bdcRoot = host.querySelector('.crr-root[data-roster="bdc"]');
  if (!crRoot || !bdcRoot) return;
  const q = new URLSearchParams(location.search);
  let jump = null;
  if (q.get("credit") && EUR_CREDITS.some((c) => c.name === q.get("credit"))) { cr.open = q.get("credit"); cr.q = ""; cr.trend = ""; jump = "credits"; }
  else if (q.get("credit")) { cr.q = q.get("credit"); cr.open = ""; jump = "credits"; }   // a name search (e.g. a stress name)
  if (q.get("bdc") && BDCS.some((b) => bdcKey(b) === q.get("bdc") || b.name === q.get("bdc"))) { bdc.open = q.get("bdc"); jump = jump || "bdc"; }
  const paintCr = () => { crRoot.innerHTML = creditsBody(); };
  const paintBdc = () => { bdcRoot.innerHTML = bdcBody(); };
  paintCr(); paintBdc();
  loadQuotes(paintBdc);
  if (jump) setTimeout(() => {   // after the packer has placed the cards
    const el = (jump === "credits" ? crRoot : bdcRoot).querySelector(".crr-row.is-open") || (jump === "credits" ? crRoot : bdcRoot);
    el.scrollIntoView({ block: "center" });
  }, 80);
  let t = null;
  const onInput = (e) => {
    const inp = e.target.closest(".crr-q"); if (!inp) return;
    const which = inp.dataset.roster, v = inp.value;
    clearTimeout(t);
    t = setTimeout(() => {
      if (which === "credits") { cr.q = v.trim(); cr.open = ""; paintCr(); } else { bdc.q = v.trim(); bdc.open = ""; paintBdc(); }
      const again = (which === "credits" ? crRoot : bdcRoot).querySelector(".crr-q"); if (again) { again.focus(); again.setSelectionRange(v.length, v.length); }
      writeUrl();
    }, 120);
  };
  const onChange = (e) => {
    const s = e.target.closest(".crr-sort"); if (!s) return;
    if (s.dataset.roster === "credits") { cr.sort = s.value; paintCr(); } else { bdc.sort = s.value; paintBdc(); }
  };
  const onClick = (e) => {
    if (e.target.closest("a")) return;   // links (deals, profiles, sources) keep native / in-app behaviour
    const csv = e.target.closest(".crr-csv");
    if (csv) {
      if (csv.dataset.csv === "credits") downloadCSV("wire-eu-credits", ["Borrower", "Jurisdiction", "Sector", "Rating", "Agency", "Rating as of", "12m trend", "Tracked deals naming it", "Source"],
        crList().map((c) => [c.name, c.jurisdiction || "", c.sector || "", c.rating || "NR", c.agency || EUR_CREDITS_META.agency, c.asOf || "", c.trend || "flat", mentionsOf(c).length, c.source || ""]));
      else downloadCSV("wire-bdcs", ["Fund", "Ticker", "Exchange", "Structure", "Manager", "Total assets ($bn)", "Net assets ($bn)", "Portfolio ($bn)", "NAV / share ($)", "NAV as of", "Non-accrual FV (%)", "Non-accrual cost (%)", "Px/NAV (live)", "SEC EDGAR"],
        bdcSorted(BDCS.filter(bdcMatch)).map((b) => [b.name, b.ticker || "", b.exchange || "", b.structure, b.manager || "", b.totalAssets ?? "", b.netAssets ?? "", b.portfolio ?? "", b.nav ?? "", b.navAsOf || "", b.nonAccrualFV ?? "", b.nonAccrualCost ?? "", bdcPxNav(b) != null ? bdcPxNav(b).toFixed(2) : "", b.edgar || ""]));
      return;
    }
    const tr = e.target.closest("[data-crtrend]");
    if (tr) { cr.trend = tr.dataset.crtrend; cr.open = ""; paintCr(); writeUrl(); return; }
    if (e.target.closest("[data-crall]")) { cr.all = true; paintCr(); if (isPhone() && opts.onSeeAll) opts.onSeeAll(crRoot, "credits"); return; }
    if (e.target.closest("[data-bdcall]")) { bdc.all = true; paintBdc(); if (isPhone() && opts.onSeeAll) opts.onSeeAll(bdcRoot, "bdc"); return; }
    const hb = e.target.closest(".tbdc-hold-btn");
    if (hb) { hb.disabled = true; hb.textContent = "Loading…"; loadHoldings(hb.dataset.cik, hb.nextElementSibling, hb); return; }
    if (e.target.closest(".crr-x")) return;   // clicks inside an open row's detail
    const row = e.target.closest(".crr-row");
    if (!row) return;
    if (row.dataset.cr != null) { cr.open = cr.open === row.dataset.cr ? "" : row.dataset.cr; paintCr(); }
    else { bdc.open = bdc.open === row.dataset.bdc ? "" : row.dataset.bdc; paintBdc(); }
    writeUrl();
  };
  const onKey = (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("div.crr-hd")) { e.preventDefault(); e.target.click(); } };
  for (const root of [crRoot, bdcRoot]) {
    root.addEventListener("input", onInput); root.addEventListener("change", onChange);
    root.addEventListener("click", onClick); root.addEventListener("keydown", onKey);
  }
  // Back to the 10-row preview (the sheet closed).
  return {
    collapse(which) { if (which === "credits") { cr.all = false; paintCr(); } else { bdc.all = false; paintBdc(); } },
    refresh() { paintCr(); paintBdc(); },   // the phone / desktop breakpoint changed
  };
}
