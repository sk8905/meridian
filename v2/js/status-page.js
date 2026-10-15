// =============================================================================
// status-page.js — Menu ▸ Sources: "Coverage & sources" (HOUSE_STYLE R15).
//
// One page that answers two questions:
//   1. What does Wire track, from where, how often, how much, and how recent?
//      — per section of the app (Home lanes, briefing & reading, Transactions,
//      Profiles, Legal, Dashboard panels), each row with its item count, latest
//      item date and a status pill GOOD / STALE / FAILING.
//   2. What is failing or stale right now, and what fixes it?
//      — every non-GOOD row is ALSO listed first under "Needs attention", worst
//      first, with a plain-English reason and the fix.
//
// Three signals, none of which can go stale itself:
//   (a) Freshness — the committed health snapshot (dashboard/js/health.js, written by
//       `scripts/health-check.mjs --write` each refresh run) gives every surface's
//       count, newest date and cadence window (the SAME windows freshness-audit
//       uses). The page RE-JUDGES each stamp against the viewer's clock, and for the
//       surfaces whose data module is cheap to read here (Home slice, briefing,
//       research, newsletters, myFT) it reads the newest date straight from the data.
//   (b) Live checks — it probes the /api/* endpoints the Dashboard and Home read (the
//       liveJSON callers + the Home wire) and shows live / cached / snapshot / failing
//       per panel with the as-of time. A probe that fails is FAILING even when the
//       panel still shows last-known values (that is what "failing" means here).
//   (c) The last refresh run (LAST_CHECKED stamp the routine writes into the data),
//       the last health check, and the digest build time.
// Pure render helpers are exported for the spec (tests/status-page.mjs).
// =============================================================================
import { esc } from "/util.js";
import { useful, lastKnown } from "/v2/js/live-cache.js";

const DAY = 86400000, HOUR = 3600000;
const M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDay = (iso) => { const t = Date.parse(String(iso || "").slice(0, 10) + "T12:00:00Z"); if (Number.isNaN(t)) return ""; const d = new Date(t); return `${d.getUTCDate()} ${M[d.getUTCMonth()]}`; };
const fmtTime = (ms) => { if (!ms) return ""; const d = new Date(ms); return `${d.getDate()} ${M[d.getMonth()]} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
const nf = (n) => (typeof n === "number" ? n.toLocaleString("en-GB") : "");
const ageWords = (ms) => { const h = ms / HOUR; if (h < 1) return `${Math.max(1, Math.round(ms / 60000))} min`; if (h < 48) return `${Math.round(h)}h`; return `${Math.round(h / 24)} days`; };

// "2026-10-15" + "11:12 BST" → epoch ms (BST = UTC+1; GMT/UTC/blank = UTC).
export function stampMs(date, time) {
  if (!date) return 0;
  const m = String(time || "").match(/(\d{1,2}):(\d{2})/);
  const t = Date.parse(`${String(date).slice(0, 10)}T${m ? m[1].padStart(2, "0") + ":" + m[2] : "00:00"}:00Z`);
  if (Number.isNaN(t)) return 0;
  return /BST/i.test(String(time || "")) ? t - HOUR : t;
}
const londonHour = (ms) => { try { return +new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Europe/London" }).format(new Date(ms)); } catch { return new Date(ms).getUTCHours(); } };

// ---- The catalog: what each row is, its sources and cadence -------------------
// `key` = a freshness-audit surface (stamped in health.js) unless it starts with
// "api:" (a live probe) or "sys:" (the pipeline itself). `fix` is the fallback when
// the health snapshot carries no action for the surface.
const SAY_SWEEP = "The next refresh run should source verified, dated items for this surface. If it stays stale across two runs, the sweep for it is failing — check that routine's last run.";
export const CATALOG = [
  { id: "pipeline", title: "Refresh pipeline", rows: [
    { key: "sys:refresh", label: "Refresh routine — last run", what: "The ~2-hourly full refresh that updates every desk", sources: "Claude Routines → commit to main → auto-deploy", cadence: "Every ~2h, 05:00–23:00 London", fix: "Check the '/Wire: full refresh' routine's last run in the Routines UI — re-enable it, fix the failing run, or fire it by hand." },
    { key: "sys:health", label: "Health check — last run", what: "The freshness + build snapshot this page starts from", sources: "scripts/health-check.mjs --write", cadence: "Every refresh run", fix: "The refresh routine should run `node scripts/health-check.mjs --write` and commit dashboard/js/health.js each run; this page still re-judges every stamp live meanwhile." },
    { key: "sys:digest", label: "Credit digest — last build", what: "The daily / weekly digest (Menu ▸ Digest) and its morning email", sources: "scripts/build-digest.mjs over Wire's own committed data", cadence: "Every refresh run; emailed each morning", fix: "The refresh routine should run `node scripts/build-digest.mjs` and commit digest.js (docs/refresh-routines.md ▸ Morning digest).", href: "/v2/menu/digest" },
  ] },
  { id: "home", title: "Home — news lanes", href: "/v2/news/", rows: [
    { key: "api:/api/feed", label: "News wire (live)", what: "Credit, legal and macro headlines across the wire", sources: "Server-fetched RSS — wires, financial press, law-firm and court feeds", cadence: "fetched live on each load", fix: "The Worker's /api/feed could not build the wire. It retries on every load; if it persists, check the Worker logs for the failing feeds (src/index.js handleFeed)." },
    { key: "manager_webnews", label: "Managers lane — firms' own news", what: "News from covered managers' own sites", sources: "Managers' press / news pages", cadence: "Heavy sweep, several times a day" },
    { key: "xfeed_myft", label: "myFT lane", what: "FT headlines from the owner's myFT topics", sources: "myFT RSS", cadence: "Every refresh (~2h)" },
    { key: "macro_news", label: "Macro headlines", what: "Five US + five UK macro headlines", sources: "Verified wires and press", cadence: "Every refresh (~2h)" },
    { key: "macro_commentary", label: "Macro commentary", what: "Bank / house research and named-economist views (≥10)", sources: "Research houses, central-bank speeches, columnists", cadence: "Every refresh (~2h)" },
  ] },
  { id: "reading", title: "Briefing, research & newsletters", href: "/v2/", rows: [
    { key: "briefing", label: "Market briefing", what: "The top-of-Home summary of what moved", sources: "Synthesised from verified items + wires", cadence: "Every refresh (~2h, 05:00–23:00 London)", hours: 6, fix: "The refresh routine rewrites the briefing every run — if it is stale the routine has not run (see Refresh routine) or skipped the briefing step." },
    { key: "research_lane", label: "Research lane", what: "House research from banks and asset managers", sources: "Research-house emails (Gmail sweep)", cadence: "Every refresh (~2h)" },
    { key: "xfeed_newsletters", label: "Newsletters", what: "Forwarded newsletters, readable in-app", sources: "Gmail sweep — Bloomberg, The Economist, Reuters, WSJ and others", cadence: "Every refresh (~2h)" },
    { key: "macro_articles", label: "Reading list", what: "Long-form macro and markets pieces", sources: "Verified press and research", cadence: "Every refresh (~2h)" },
  ] },
  { id: "transactions", title: "Deals", href: "/v2/transactions/", rows: [
    { key: "deals", label: "Credit deals", what: "Direct lending, unitranche, NAV, SRT, ABF and secondaries deals", sources: "Managers' press releases, SEC EDGAR (Form D, BDC filings), trade press", cadence: "Every ~2h" },
    { key: "clos", label: "CLO pricings & resets", what: "New-issue CLOs, resets and refis", sources: "Manager announcements, trade press", cadence: "Every ~2h (lumpy flow)" },
    { key: "credit_volume", label: "Deal & intel flow (weekly volume)", what: "Is the deal collector still collecting at its usual rate?", sources: "Count of new deals + intel vs the 8-week median", cadence: "Judged weekly" },
  ] },
  { id: "profiles", title: "Profiles", href: "/v2/profiles/", rows: [
    { key: "intel", label: "Managers — fundraising, mandates, people", roster: "managers", what: "Private-credit manager profiles and their events", sources: "Managers' sites, press releases, SEC Form ADV / Form D, trade press", cadence: "Every ~2h; profile rota for slow fields", href: "/v2/profiles/#/?tab=managers" },
    { key: "lp_profiles", label: "Investors (LPs)", roster: "lps", what: "Pension, insurance and sovereign allocators", sources: "Annual reports and allocation disclosures", cadence: "Profile rota (annual reports)", href: "/v2/profiles/#/?tab=investors" },
    { key: "hedge_intel", label: "Hedge funds — news", roster: "hedgeFunds", what: "Performance, launches, raises, people, wind-downs", sources: "Fund letters, press releases, trade press", cadence: "Heavy sweep, several times a day", href: "/v2/profiles/#/?tab=hedgefunds" },
    { key: "hf_aum", label: "Hedge funds — AUM", what: "Regulatory AUM per fund", sources: "SEC Form ADV (daily Action) + firm disclosures", cadence: "Daily (SEC), else on disclosure" },
    { key: "hf_13f", label: "Hedge funds — 13F holdings", what: "Latest filed quarter's US long book", sources: "SEC EDGAR 13F-HR", cadence: "Quarterly (filed 45 days after quarter-end)" },
    { key: "legal_volume", label: "Law firms — alert flow", roster: "firms", what: "Are all tracked firms still being swept?", sources: "Each firm's insights / news pages", cadence: "Judged weekly", href: "/v2/profiles/#/?tab=firms" },
  ] },
  { id: "legal", title: "Legal", href: "/v2/profiles/#/?tab=firms", rows: [
    { key: "legal_items", label: "Legal updates & client alerts", what: "Finance, restructuring, funds and M&A alerts", sources: "Law firms' insights pages", cadence: "Every ~2h" },
    { key: "legal_cases", label: "Case law", what: "Reported English judgments relevant to credit", sources: "The National Archives — Find Case Law", cadence: "Every ~2h" },
    { key: "legal_rx", label: "Schemes & restructuring plans", what: "Part 26 / 26A cases and their advisers", sources: "Court judgments, firm deal announcements, press", cadence: "Every ~2h" },
  ] },
  { id: "dashboard", title: "Markets panels", href: "/v2/dashboard/", rows: [
    { key: "api:/api/rates", label: "Credit spreads & money markets", what: "OAS spreads, SOFR, SONIA, Treasuries", sources: "FRED (ICE BofA), NY Fed, US Treasury", cadence: "fetched live on each load", href: "/v2/dashboard/credit" },
    { key: "api:/api/eurates", label: "Europe policy & money-market rates", what: "ECB deposit rate, €STR, Euribor, Bank Rate, SONIA", sources: "ECB Data Portal, Bank of England", cadence: "fetched live on each load", href: "/v2/dashboard/rates" },
    { key: "api:/api/yield-curve", label: "Yield curve", what: "US and UK curves", sources: "US Treasury daily par curve, CNBC (gilts)", cadence: "fetched live on each load", href: "/v2/dashboard/rates" },
    { key: "api:/api/govyields", label: "Government bond yields", what: "10Y yields and changes by country", sources: "US Treasury, FRED (OECD series)", cadence: "fetched live on each load", href: "/v2/dashboard/rates" },
    { key: "api:/api/markets", label: "Markets ticker", what: "Indices, commodities, FX and crypto", sources: "Yahoo Finance (FRED / Stooq fallbacks)", cadence: "fetched live on each load" },
    { key: "api:/api/predict", label: "Prediction markets", what: "Finance and rates questions", sources: "Polymarket, Kalshi", cadence: "fetched live on each load" },
    { key: "dashboard_snapshot", label: "Dashboard fallback snapshot", what: "Committed values shown when a live source is down", sources: "refresh-dash-snapshot GitHub Action", cadence: "Daily (weekdays)" },
    { key: "dashboard_pc", label: "US private credit defaults", what: "Fitch PCDR + KBRA compendium", sources: "Fitch, KBRA", cadence: "Monthly" },
    { key: "dashboard_eu_distress", label: "Europe defaults & distress", what: "European default rates and insolvencies", sources: "LCD, Fitch, S&P, Insolvency Service", cadence: "Monthly" },
    { key: "dashboard_regcal", label: "Regulatory calendar", what: "AIFMD II, ELTIF, FCA and CRR dates", sources: "Regulators' publications", cadence: "Quarterly review", href: "/v2/dashboard/legal" },
    { key: "dashboard_fedwatch", label: "Rate-path odds", what: "FedWatch and SONIA-implied meeting odds", sources: "CME FedWatch, market pricing", cadence: "Weekly" },
    { key: "dashboard_matwall", label: "Maturity wall", what: "Leveraged-loan maturities by year (Europe first)", sources: "PitchBook LCD, S&P", cadence: "Quarterly" },
    { key: "dashboard_market_sizes", label: "Market sizes", what: "Size of each credit / rates market", sources: "Each source's latest release", cadence: "Quarterly" },
    { key: "dashboard_eq", label: "Equity Key Moments", what: "One sourced caption per index", sources: "Verified press", cadence: "Every few weeks", href: "/v2/dashboard/equities" },
    { key: "earnings", label: "Earnings calendar", what: "This week's reporting dates", sources: "Company IR calendars", cadence: "Weekly" },
    { key: "macro_releases", label: "Releases calendar", what: "Upcoming US / UK data releases", sources: "BLS, BEA, ONS and others", cadence: "Rolled forward weekly" },
    { key: "macro_keymoments", label: "Indicator Key Moments", what: "Sourced captions on indicators and FX", sources: "Verified press", cadence: "Every few weeks" },
    { key: "macro_editorial", label: "Outlook / cycle editorial", what: "Wire's macro outlook, cycle and bubble view", sources: "Wire editorial over verified sources", cadence: "On a material shift" },
    { key: "macro_alerts", label: "Macro alerts (bell)", what: "Guidance changes that hit the bell", sources: "Central banks, statistics offices", cadence: "As they happen" },
  ] },
];

// The live probes (every api: row) with how to judge a payload.
export const PROBES = CATALOG.flatMap((s) => s.rows).filter((r) => r.key.startsWith("api:")).map((r) => r.key.slice(4));
const feedUseful = (d) => !!(d && Array.isArray(d.items) && d.items.length);
// The newest as-of date a payload carries (for the "as of" label on a live row).
function payloadAsOf(path, d) {
  if (!d || typeof d !== "object") return null;
  const dates = [];
  const walk = (o, depth) => { if (!o || depth > 3) return; if (Array.isArray(o)) { o.slice(0, 60).forEach((x) => walk(x, depth + 1)); return; } if (typeof o === "object") { for (const k of ["asOf", "date"]) if (typeof o[k] === "string" && /^\d{4}-\d{2}(-\d{2})?/.test(o[k])) dates.push(o[k].slice(0, 10)); for (const v of Object.values(o)) if (v && typeof v === "object") walk(v, depth + 1); } };
  walk(d, 0);
  if (typeof d.ts === "number") dates.push(new Date(d.ts).toISOString().slice(0, 10));
  return dates.sort().pop() || null;
}

// Probe one endpoint: { path, mode: live|cached|snapshot|failing, at, asOf, why }.
export async function probe(path, { timeout = 10000 } = {}) {
  let d = null, why = "";
  try {
    const ac = typeof AbortController === "function" ? new AbortController() : null;
    const t = ac ? setTimeout(() => ac.abort(), timeout) : null;
    const r = await fetch(path, { headers: { accept: "application/json" }, signal: ac ? ac.signal : undefined, cache: "no-store" });
    if (t) clearTimeout(t);
    if (!r.ok) why = `HTTP ${r.status}`;
    else { try { d = await r.json(); } catch { why = "the response was not JSON"; } }
  } catch (e) { why = e && e.name === "AbortError" ? `no answer in ${Math.round(timeout / 1000)}s` : "the request did not complete (offline or blocked)"; }
  const ok = path === "/api/feed" ? feedUseful(d) : useful(path, d);
  if (ok) return { path, mode: "live", at: Date.now(), asOf: payloadAsOf(path, d), why: "" };
  if (!why) why = "it answered but carried no usable values";
  if (path === "/api/feed") return { path, mode: "failing", at: null, asOf: null, why };
  const lk = await lastKnown(path).catch(() => ({ state: "none" }));
  const mode = lk.state === "cached" ? "cached" : lk.state === "snapshot" ? "snapshot" : "failing";
  return { path, mode, at: lk.at ? Date.parse(lk.at) : null, asOf: lk.data ? payloadAsOf(path, lk.data) : null, why };
}

// ---- Judging -------------------------------------------------------------------
const RANK = { fail: 0, stale: 1, check: 2, good: 3 };
const PILL = { fail: "FAILING", stale: "STALE", good: "GOOD", check: "CHECKING" };

// Days-window judgement on a newest date. STALE past the window; FAILING past 3×.
function byWindow(newestDate, windowDays, now) {
  const t = Date.parse(String(newestDate || "").slice(0, 10) + "T00:00:00Z");
  if (!newestDate || Number.isNaN(t)) return { st: "fail", ageDays: null, reason: "No dated items on record." };
  const ageDays = Math.max(0, Math.floor((now - t) / DAY));
  if (windowDays == null) return { st: "good", ageDays, reason: "" };
  if (ageDays > windowDays * 3) return { st: "fail", ageDays, reason: `The newest item is ${ageDays} days old — expected something within ${windowDays} days, so this collector looks broken.` };
  if (ageDays > windowDays) return { st: "stale", ageDays, reason: `The newest item is ${ageDays} days old — expected something within ${windowDays} days.` };
  return { st: "good", ageDays, reason: "" };
}
// Hours-window judgement on a timestamp (briefing, pipeline stamps).
function byHours(ms, staleH, failH, now, what) {
  if (!ms) return { st: "fail", reason: `No ${what} stamp found.` };
  const age = now - ms;
  if (age > failH * HOUR) return { st: "fail", reason: `Last ${what} was ${ageWords(age)} ago — expected within ${staleH}h.` };
  if (age > staleH * HOUR) return { st: "stale", reason: `Last ${what} was ${ageWords(age)} ago — expected within ${staleH}h.` };
  return { st: "good", reason: "" };
}

// The newest date + count the page can read straight from the data modules (so the
// verdict for these never depends on how old health.js is).
function liveStamps(mods) {
  const out = {};
  const newest = (rows) => { let b = ""; for (const r of rows || []) { const d = String((r && r.date) || "").slice(0, 10); if (d > b) b = d; } return b || null; };
  const put = (k, rows) => { if (Array.isArray(rows) && rows.length) out[k] = { newestDate: newest(rows), count: rows.length }; };
  const H = mods.home || {};
  put("deals", H.deals); put("intel", H.intel); put("legal_items", H.items); put("legal_cases", H.cases);
  put("legal_rx", H.restructurings); put("hedge_intel", H.HEDGE_INTEL);
  if (H.NEWS) put("macro_news", [...(H.NEWS.us || []), ...(H.NEWS.uk || [])]);
  if (H.ARTICLES) put("macro_articles", H.ARTICLES.items);
  put("research_lane", (mods.research || {}).RESEARCH);
  put("xfeed_newsletters", (mods.newsletters || {}).NEWSLETTERS);
  put("xfeed_myft", (mods.ft || {}).FT_ITEMS);
  return out;
}

// Every catalog row → a judged row. `probes` maps path → probe result (or absent
// while still checking). Pure — the spec drives it directly too.
export function judgeAll({ health, mods = {}, probes = {}, now = Date.now() }) {
  const H = health || null;
  const surf = Object.fromEntries(((H && H.surfaces) || []).map((s) => [s.key, s]));
  const actions = (H && H.actions) || {};
  const live = liveStamps(mods);
  const rosters = (H && H.rosters) || {};
  const healthAge = H && H.generated ? now - Date.parse(H.generated) : null;
  const sections = CATALOG.map((sec) => ({ ...sec, rows: sec.rows.map((row) => {
    const r = { ...row, st: "good", reason: "", count: null, latest: null, mode: null };
    if (row.key === "sys:refresh") {
      const home = mods.home || {};
      const ms = stampMs(home.LAST_CHECKED, home.LAST_CHECKED_TIME) || (H && Date.parse(H.lastPublishAt)) || 0;
      const lh = londonHour(now);
      Object.assign(r, byHours(ms, lh >= 7 && lh <= 23 ? 3.5 : 9, 12, now, "refresh"));
      r.latestText = ms ? fmtTime(ms) : null;
    } else if (row.key === "sys:health") {
      const ms = H && H.generated ? Date.parse(H.generated) : 0;
      Object.assign(r, byHours(ms, 6, 48, now, "health check"));
      if (!H) r.reason = "The health snapshot (dashboard/js/health.js) could not be loaded.";
      r.latestText = ms ? fmtTime(ms) : null;
    } else if (row.key === "sys:digest") {
      const D = mods.digest || null;
      const ms = D && D.built ? Date.parse(D.built) : 0;
      Object.assign(r, byHours(ms, 30, 96, now, "digest build"));
      r.latestText = ms ? fmtTime(ms) : null;
    } else if (row.key.startsWith("api:")) {
      const p = probes[row.key.slice(4)];
      if (!p) { r.st = "check"; r.reason = "Checking now…"; r.mode = "checking"; }
      else {
        r.mode = p.mode;
        r.latestText = p.asOf ? fmtDay(p.asOf) : (p.at ? fmtTime(p.at) : null);
        if (p.mode === "live") r.st = "good";
        else {
          r.st = "fail";
          const served = p.mode === "cached" ? `the panel is showing this browser's last-known values from ${fmtTime(p.at)}`
            : p.mode === "snapshot" ? `the panel is showing the committed snapshot from ${fmtTime(p.at)}`
            : "the panel has nothing to show";
          r.reason = `Live call failed (${p.why}); ${served}.`;
          r.fix = row.fix || `Wire's Worker could not reach the upstream source (${row.sources}). It retries on every load; if it fails all day, check the Worker logs for ${row.key.slice(4)} (src/index.js) and the source's status.`;
        }
      }
    } else if (row.key === "briefing") {
      const B = (mods.briefings || {}).BRIEFINGS || null;
      const ms = B ? stampMs(B.date, B.time) : 0;
      Object.assign(r, byHours(ms, row.hours || 6, 24, now, "briefing"));
      r.latestText = ms ? fmtTime(ms) : null;
      r.count = B && Array.isArray(B.bullets) ? B.bullets.length : null;
      r.countWord = "bullets";
    } else {
      const s = surf[row.key] || null;
      const l = live[row.key] || null;
      const newestDate = [l && l.newestDate, s && s.newestDate].filter(Boolean).sort().pop() || null;
      r.count = s && s.count != null ? s.count : l ? l.count : null;
      r.latest = newestDate;
      r.latestText = newestDate ? fmtDay(newestDate) : null;
      const windowDays = s ? s.windowDays : null;
      // Flag-judged surfaces (weekly volume, roster as-of share, forward calendars):
      // the health snapshot's verdict, labelled with when it was judged.
      const flagged = s && (windowDays == null || /older than|median|upcoming|current week/.test(s.note || ""));
      if (!s && !l) { r.st = "fail"; r.reason = "Not found in the health snapshot or the data — this surface is not being audited."; }
      else if (flagged) {
        r.st = s.stale ? "stale" : "good";
        if (s.stale) r.reason = `${s.note ? s.note.charAt(0).toUpperCase() + s.note.slice(1) : "Below its floor"}${s.min ? ` (needs ≥${s.min})` : ""} — as of the last health check.`;
        else if (s.note) r.noteText = s.note;
      } else {
        Object.assign(r, byWindow(newestDate, windowDays, now));
        if (r.st === "good" && s && s.min && s.count < s.min) { r.st = "stale"; r.reason = `Only ${s.count} items — this feed should carry at least ${s.min}.`; }
      }
      if (r.st !== "good") r.fix = actions[row.key] || row.fix || SAY_SWEEP;
    }
    if (r.st !== "good" && r.st !== "check" && !r.fix) r.fix = row.fix || SAY_SWEEP;
    if (row.roster && rosters[row.roster] != null) r.rosterCount = rosters[row.roster];
    if (healthAge != null && healthAge > 2 * DAY && !row.key.startsWith("api:") && !row.key.startsWith("sys:")) r.healthOld = true;
    return r;
  }) }));
  const rows = sections.flatMap((s) => s.rows.map((r) => ({ ...r, section: s.title })));
  const attention = rows.filter((r) => r.st === "fail" || r.st === "stale").sort((a, b) => RANK[a.st] - RANK[b.st]);
  const counts = { fail: 0, stale: 0, good: 0, check: 0 };
  rows.forEach((r) => { counts[r.st]++; });
  return { sections, attention, counts };
}

// ---- Rendering -----------------------------------------------------------------
const pill = (st) => `<span class="cov-pill is-${st}">${PILL[st]}</span>`;
const MODE = { live: "Live", cached: "Cached", snapshot: "Snapshot", failing: "Failing", checking: "Checking" };
function metaLine(r) {
  const bits = [];
  if (r.mode) bits.push(`<span class="cov-mode is-${esc(r.mode)}">${MODE[r.mode] || esc(r.mode)}</span>`);
  if (r.rosterCount != null) bits.push(`${nf(r.rosterCount)} profiles`);
  if (r.count != null) bits.push(`${nf(r.count)} ${r.countWord || "items"}`);
  if (r.latestText) bits.push(`${r.mode ? "as of" : "latest"} ${esc(r.latestText)}`);
  if (r.cadence) bits.push(esc(r.cadence));
  return bits.join(" · ");
}
function rowHTML(r, { attn = false } = {}) {
  const name = r.href ? `<a class="cov-nm" href="${esc(r.href)}">${esc(r.label)}</a>` : `<span class="cov-nm">${esc(r.label)}</span>`;
  return `<div class="cov-row" data-key="${esc(r.key)}" data-st="${r.st}">`
    + `<div class="cov-r1">${name}${pill(r.st)}</div>`
    + (attn ? `<div class="cov-sec">${esc(r.section)}</div>` : "")
    + `<div class="cov-meta">${metaLine(r)}</div>`
    + (r.reason && r.st !== "good" ? `<div class="cov-why">${esc(r.reason)}</div>` : "")
    + (r.fix && (r.st === "fail" || r.st === "stale") ? `<div class="cov-fix"><span class="cov-fix-h">Fix</span> ${esc(r.fix)}</div>` : "")
    + (attn ? "" : `<div class="cov-src">${esc(r.what)}. <span class="cov-src-h">Sources:</span> ${esc(r.sources)}${r.noteText ? ` · ${esc(r.noteText)}` : ""}${r.healthOld ? " · health snapshot is over 2 days old" : ""}</div>`)
    + `</div>`;
}

// Onboarding: three roles, each with the 4–5 screens that matter most.
export const ROLES = [
  { role: "Lender / fund manager", links: [
    ["Deals", "/v2/transactions/", "who lent to whom, by type and size"],
    ["Markets ▸ Credit", "/v2/dashboard/credit", "spreads, defaults, BDCs, maturity wall"],
    ["Profiles ▸ Managers", "/v2/profiles/#/?tab=managers", "peers' funds, deals and people"],
    ["Profiles ▸ Investors", "/v2/profiles/#/?tab=investors", "who allocates to private credit"],
    ["Digest", "/v2/menu/digest", "the day's deals, closes and moves"],
  ] },
  { role: "Lawyer", links: [
    ["Profiles ▸ Law firms", "/v2/profiles/#/?tab=firms", "each firm's alerts, deals and cases"],
    ["Markets ▸ Legal", "/v2/dashboard/legal", "regulatory calendar and restructurings"],
    ["News wire", "/v2/news/", "legal and credit headlines as they land"],
    ["Deals", "/v2/transactions/", "deals and the advisers on them"],
    ["Weekly digest", "/v2/menu/digest/weekly", "restructuring and judgments this week"],
  ] },
  { role: "LP / investor", links: [
    ["Home briefing", "/v2/", "what moved, in one read"],
    ["Profiles ▸ Managers", "/v2/profiles/#/?tab=managers", "strategy, AUM, funds in market"],
    ["Profiles ▸ Hedge funds", "/v2/profiles/#/?tab=hedgefunds", "performance, AUM and 13F books"],
    ["Markets ▸ Rates", "/v2/dashboard/rates", "policy rates, curves and odds"],
    ["Watchlist", "/v2/menu/watchlist", "everything you follow, in one list"],
  ] },
];
function rolesHTML() {
  return `<div class="cov-start">`
    + ROLES.map((r) => `<div class="cov-role"><div class="cov-role-h">${esc(r.role)}</div>`
      + r.links.map(([l, href, why]) => `<a class="cov-role-a" href="${esc(href)}"><span class="cov-role-nm">${esc(l)}</span><span class="cov-role-why">${esc(why)}</span></a>`).join("")
      + `</div>`).join("")
    + `</div>`;
}

export function statusHTML(state) {
  const { sections, attention, counts } = state;
  const sum = `<div class="cov-sum">`
    + `<span class="cov-sum-n is-fail">${counts.fail} failing</span><span class="cov-sum-n is-stale">${counts.stale} stale</span><span class="cov-sum-n is-good">${counts.good} good</span>`
    + (counts.check ? `<span class="cov-sum-n">${counts.check} checking</span>` : "")
    + `</div>`;
  const attn = attention.length
    ? attention.map((r) => rowHTML(r, { attn: true })).join("")
    : `<p class="cov-ok">Nothing is failing or stale — every source below is current.</p>`;
  return `<div class="cov" id="v2-cov">`
    + `<div class="cov-title">Coverage &amp; sources</div>`
    + `<p class="cov-lede">What Wire tracks, where it comes from, how often it refreshes — and what is failing or stale right now.</p>`
    + sum
    + `<div class="na-menu-recent-h">Needs attention</div><div class="cov-attn" id="v2-cov-attn">${attn}</div>`
    + `<div class="na-menu-recent-h">Start here</div>${rolesHTML()}`
    + sections.map((s) => `<div class="cov-grp" data-sec="${esc(s.id)}"><div class="na-menu-recent-h cov-grp-h">${s.href ? `<a href="${esc(s.href)}">${esc(s.title)}</a>` : esc(s.title)}</div>`
      + s.rows.map((r) => rowHTML(r)).join("") + `</div>`).join("")
    + `</div>`;
}

// Load everything, paint once (probes "Checking…"), then repaint as each probe lands.
// `box()` returns the live container (the Menu re-renders its pane, so re-query).
let _tok = 0;
export async function mountStatus(box) {
  const tok = ++_tok;
  const opt = (p) => p.catch(() => null);
  const [hm, home, briefings, research, newsletters, ft, digest] = await Promise.all([
    opt(import("/dashboard/js/health.js")), opt(import("/home-data.js")), opt(import("/briefings.js")),
    opt(import("/research.js")), opt(import("/newsletters.js")), opt(import("/ft.js")), opt(import("/digest.js")),
  ]);
  const health = hm ? hm.HEALTH : null;
  const mods = { home, briefings, research, newsletters, ft, digest: digest ? digest.DIGEST : null };
  const probes = {};
  const paint = () => { if (tok !== _tok) return; const b = box(); if (b) b.innerHTML = statusHTML(judgeAll({ health, mods, probes })); };
  paint();
  await Promise.all(PROBES.map((p) => probe(p).then((res) => { probes[p] = res; paint(); })));
}
