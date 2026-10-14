// =============================================================================
// freshness-audit.mjs — the single deterministic staleness detector for Wire.
//
// One command that scans EVERY content surface built from the committed data
// modules and reports exactly what has gone stale, plus the manager-profile depth
// deficit — so the autonomous refresh/backfill routines get a concrete, machine-
// readable worklist instead of a vague "sweep for news" (which they were silently
// no-op'ing). It identifies the issue; the routine resolves it by WebSearch-sourcing
// VERIFIED, dated events for the surfaces/managers this prints, then appending them.
//
// Covers EVERY dated content surface the app renders — the credit feeds (deals, intel,
// CLOs, the credit-desk research array), hedge-fund intel, the legal surfaces, the macro
// feeds (headlines, commentary, reading list) PLUS the macro releases calendar and
// editorial, the dashboard equity Key Moments, the Home briefing, and the X-feed sources
// (myFT, newsletters, the research lane) — so nothing can rot unseen by the health check
// or the refresh routines. Each surface carries its own cadence window where a daily one
// would misfire (credit deals/intel a TIGHTER 3d since the Transactions ledger should
// never sit a week without a new item, CLO new-issue 21d, dashboard captions 21d, macro
// editorial 45d, the releases calendar is judged forward-looking).
//
// Pure read over the committed data modules + the manager-coverage scorer — no fetch, no
// writes, no state. Exit code is 0 when everything is fresh, 1 when any surface is stale
// or coverage is below target, so a routine (or CI) can branch on it.
//
// Usage:
//   node scripts/freshness-audit.mjs            # human report + exit code
//   node scripts/freshness-audit.mjs --json     # machine-readable {surfaces, coverage, worklist, actions}
//   node scripts/freshness-audit.mjs --stale=10 # override the staleness window (days; default 7)
// =============================================================================
import * as CR from "../credit/js/data.js";
import * as LG from "../legal/js/data.js";
import * as MAC from "../macro/js/content.js";
import * as BR from "../briefings.js";
import * as FT from "../ft.js";
import * as NL from "../newsletters.js";
import * as RSCH from "../research.js";
import * as DASH from "../dashboard/js/data.js";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => { const a = args.find((x) => x.startsWith(n + "=")); return a ? a.split("=")[1] : d; };
const STALE_DAYS = Math.max(1, parseInt(opt("--stale", "7"), 10) || 7);
// The Home briefing restamps on EVERY full-refresh run (the cron fires ~every 2h), so
// it is measured in HOURS, not days: freshest slot older than this ⇒ a run skipped it.
const BRIEF_STALE_HOURS = Math.max(1, parseInt(opt("--brief-stale", "6"), 10) || 6);

const now = Date.now();
const msOf = (d) => { const s = /^\d{4}-\d{2}$/.test(d) ? d + "-01" : String(d || "").slice(0, 10); const t = Date.parse(s); return Number.isNaN(t) ? 0 : t; };
// A human "24 Sep 2026" / "1 Jan 2025" stamp → ISO day (null when unparseable).
const _isoDay = (d) => { if (!d) return null; if (/^\d{4}-\d{2}(-\d{2})?$/.test(d)) return d; const t = Date.parse(d + " 12:00 UTC"); return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10); };
const ageDaysOf = (ms) => (ms ? Math.floor((now - ms) / 86400000) : null);

// Newest dated record across one or more arrays, by the given date field(s).
function newest(rows, field = "date") {
  let best = 0;
  for (const r of rows || []) { const ms = msOf(r && r[field]); if (ms > best) best = ms; }
  return best;
}

// A content surface: its freshest item's age, and whether that breaches the window.
// windowDays lets a surface carry its own cadence (e.g. CLO new-issue is lumpy, the
// macro editorial moves monthly) instead of the global default.
function surface(key, label, rows, field = "date", windowDays = STALE_DAYS) {
  const ms = newest(rows, field);
  const ageDays = ageDaysOf(ms);
  const newestDate = ms ? new Date(ms).toISOString().slice(0, 10) : null;
  const stale = ageDays == null || ageDays > windowDays;
  return { key, label, count: (rows || []).length, newestDate, ageDays, stale, windowDays };
}

// Macro editorial arrays: NEWS and COMMENTARY are US+UK buckets; ARTICLES is .items.
const _NEWS = [...(((MAC.NEWS || {}).us) || []), ...(((MAC.NEWS || {}).uk) || [])];
const _CMT = [...(((MAC.COMMENTARY || {}).us) || []), ...(((MAC.COMMENTARY || {}).uk) || [])];
const _ART = ((MAC.ARTICLES || {}).items) || [];

// R18 — the Macro commentary feed targets ≥10 items. Flag it stale if the feed has
// thinned below that OR its newest piece is older than the window, so the ≥10/day rule
// can no longer rot unnoticed (it was previously only a code comment nobody checked).
const MACRO_COMMENTARY_MIN = 10;
function macroCommentarySurface() {
  const s = surface("macro_commentary", "Macro commentary (R18 ≥10)", _CMT);
  if (s.count < MACRO_COMMENTARY_MIN) s.stale = true;
  s.min = MACRO_COMMENTARY_MIN;
  return s;
}

// CLOs section (#/clos) renders ONLY clo:true items out of deals+intel. New-issue /
// reset flow is lumpy, so judge it on a wider window than daily feeds.
const _CLO = [...(CR.deals || []), ...(CR.intel || [])].filter((x) => x && x.clo);
// Dashboard equity-index "Key Moments" — the per-index editorial caption carries its
// own date; audit the freshest of them.
const _EQ_KM = ((DASH.EQ_INDICES || []).map((i) => i && i.keyMoment).filter(Boolean));

// Macro releases calendar must run FORWARD: it is "stale" when nothing dated today-or-
// later remains (nobody rolled it on), not when its newest row is old.
function macroReleasesSurface() {
  const rel = MAC.RELEASES || [];
  const startToday = Date.parse(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
  const futureMs = rel.map((r) => msOf(r && r.date)).filter((ms) => ms >= startToday).sort((a, b) => a - b);
  const nextDate = futureMs.length ? new Date(futureMs[0]).toISOString().slice(0, 10) : null;
  return {
    key: "macro_releases", label: "Macro releases calendar (forward)", count: rel.length,
    newestDate: nextDate, ageDays: null, stale: futureMs.length === 0, windowDays: null,
    note: futureMs.length ? `${futureMs.length} upcoming, next ${nextDate}` : "no upcoming entries — roll the calendar forward",
  };
}
// Macro editorial (OUTLOOK / CYCLE / BUBBLE) restamps only on a material shift — judge
// it on a slow (45d) window so it is COVERED without flagging ordinary quiet weeks.
function macroEditorialSurface() {
  const t = Date.parse(MAC.UPDATED || "");
  const iso = Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
  const s = surface("macro_editorial", "Macro editorial (Outlook/Cycle/Bubble)", iso ? [{ date: iso }] : [], "date", 45);
  s.count = 1;
  return s;
}

// Credit deals (the Transactions ledger) and intel flow often enough that a 7-day
// window lets the ledger sit visibly stale for a week before anything chases it (the
// "nothing new since 9 Oct" plateau). Hold them to a TIGHTER 3-day window so the audit —
// and therefore the refresh / heavy-sweep routines and the daily health email — flag a
// stalled credit collector within a couple of days, not a week.
// ---- Surfaces the newest-date check alone can't judge (added by the 2026-10-13 audit,
// which found these rotting unseen) ------------------------------------------------
const DAY_MS = 86400000;
const startOfWeekUTC = () => { const d = new Date(); d.setUTCHours(0, 0, 0, 0); const dow = (d.getUTCDay() + 6) % 7; return d.getTime() - dow * DAY_MS; };
// A one-off "as of" stamp judged on its own window (13F quarter, dashboard snapshot …).
function stampSurface(key, label, stamp, windowDays, count = 1, note) {
  const s = surface(key, label, stamp ? [{ date: stamp }] : [], "date", windowDays);
  s.count = count; if (note) s.note = note; return s;
}
// Profile-style collections: stale when MOST records' as-of dates are older than maxAgeDays.
function asOfSurface(key, label, rows, field, maxAgeDays) {
  // `field` may list alternatives — a record is as fresh as its NEWEST one (e.g. a hedge
  // fund's net aumAsOf or its SEC Form ADV raumAsOf).
  const fields = Array.isArray(field) ? field : [field];
  const ms = (rows || []).map((r) => Math.max(0, ...fields.map((f) => msOf(r && r[f]) || 0)));
  const old = ms.filter((m) => !m || (now - m) / DAY_MS > maxAgeDays).length;
  const share = rows && rows.length ? old / rows.length : 1;
  const newest = Math.max(0, ...ms);
  return { key, label, count: (rows || []).length, newestDate: newest ? new Date(newest).toISOString().slice(0, 10) : null,
    ageDays: ageDaysOf(newest), stale: share > 0.5, windowDays: maxAgeDays,
    note: `${Math.round(share * 100)}% older than ${maxAgeDays}d` };
}
// VOLUME: a single new item resets a newest-date check, so a collector that has
// slowed to a trickle still reads "fresh" (legal alerts fell from ~320/month to
// single digits in Oct 2026 unseen). Stale when the last 7 days carry under a
// quarter of the trailing 8-week weekly median.
function volumeSurface(key, label, rows) {
  const t = (rows || []).map((r) => msOf(r && r.date)).filter(Boolean);
  const weeks = [];
  for (let w = 1; w <= 8; w++) weeks.push(t.filter((m) => m <= now - w * 7 * DAY_MS && m > now - (w + 1) * 7 * DAY_MS).length);
  const sorted = [...weeks].sort((a, b) => a - b), median = (sorted[3] + sorted[4]) / 2;
  const last7 = t.filter((m) => m > now - 7 * DAY_MS).length;
  return { key, label, count: last7, newestDate: null, ageDays: null, windowDays: 7,
    stale: median >= 4 && last7 < median / 4, note: `${last7} in last 7d vs ${median}/wk median` };
}
// 13F: a quarter's filings are public 45 days after quarter-end, so the panel is a
// quarter behind once quarter-end + 135 days passes.
const _13F = (CR.HF_13F || {}).asOf || null;
// Earnings: rows must reach into the current week (the "This week" label is otherwise wrong).
const _earnRows = ((MAC.EARNINGS || {}).weeks || []).flatMap((w) => (w.days || []).map((d) => ({ date: d.date })));
const _earnNewest = newest(_earnRows);
const earningsSurface = { key: "earnings", label: "Earnings calendar (this week)", count: _earnRows.length,
  newestDate: _earnNewest ? new Date(_earnNewest).toISOString().slice(0, 10) : null, ageDays: ageDaysOf(_earnNewest),
  windowDays: null, stale: !_earnNewest || _earnNewest < startOfWeekUTC(), note: "must include the current week" };
const _webNews = (CR.managers || []).flatMap((m) => m.webNews || []);
const _indKm = [...Object.values(MAC.IND_KEYMOMENTS || {}), MAC.FX_KEYMOMENT].filter(Boolean);
const CREDIT_WIN = 3;
const SURFACES = [
  surface("deals", "Transactions (credit deals)", CR.deals, "date", CREDIT_WIN),
  surface("intel", "Credit intel (fundraising / mandates / personnel)", CR.intel, "date", CREDIT_WIN),
  surface("clos", "CLOs (clo:true items)", _CLO, "date", 21),
  surface("hedge_intel", "Hedge-fund intel", CR.HEDGE_INTEL),
  surface("legal_items", "Legal updates", LG.items),
  surface("legal_cases", "Case law", LG.cases),
  surface("legal_rx", "Restructurings", LG.restructurings),
  surface("macro_news", "Macro headlines", _NEWS),
  macroCommentarySurface(),
  surface("macro_articles", "Macro reading list", _ART),
  macroReleasesSurface(),
  macroEditorialSurface(),
  surface("dashboard_eq", "Dashboard equity Key Moments", _EQ_KM, "date", 21),
  surface("xfeed_myft", "X feed · myFT (ft.js)", FT.FT_ITEMS),
  surface("xfeed_newsletters", "X feed · newsletters", NL.NEWSLETTERS),
  surface("research_lane", "Research lane (research.js)", RSCH.RESEARCH, "date", 10),
  surface("manager_webnews", "Manager website news (bell)", _webNews),
  surface("macro_alerts", "Macro alerts (bell)", MAC.ALERTS, "date", 21),
  surface("macro_keymoments", "Macro indicator / FX Key Moments", _indKm, "date", 21),
  earningsSurface,
  stampSurface("hf_13f", "Hedge-fund 13F panel (quarter end)", _13F, 135),
  stampSurface("dashboard_snapshot", "Dashboard fallback snapshot (DASH_ASOF)", DASH.DASH_ASOF, 45),
  // Dashboard curated panels (R37) — each a single as-of stamp on its source's cadence.
  stampSurface("dashboard_pc", "Dashboard ▸ US private credit (Fitch PCDR, monthly)", (DASH.PRIVATE_CREDIT || {}).asOf, 45),
  stampSurface("dashboard_eu_distress", "Dashboard ▸ Europe defaults & distress", (DASH.EU_DISTRESS || {}).asOf, 45),
  stampSurface("dashboard_regcal", "Dashboard ▸ Legal regulatory calendar", (DASH.REG_CALENDAR || {}).asOf, 90),
  stampSurface("dashboard_fedwatch", "Dashboard ▸ Rates CME FedWatch / SONIA odds", _isoDay((((MAC.OUTLOOK || {}).us || {}).fedwatch || {}).asOf), 14),
  // Europe-first block (LCD, quarterly) when present; else the S&P global vintage.
  stampSurface("dashboard_matwall", "Dashboard ▸ Credit maturity wall (Europe LCD / S&P)", [((MAC.MATWALL || {}).europeWall || {}).asOfIso, ((MAC.MATWALL || {}).europe || {}).asOfIso].filter(Boolean).sort().pop() || _isoDay(String((((MAC.MATWALL || {}).ratedWall) || {}).asOf || "").replace(/^\D*(?=\d)/, "")), ((MAC.MATWALL || {}).europe || {}).asOfIso ? 150 : 400),
  stampSurface("dashboard_market_sizes", "Dashboard ▸ Rates market-sizes matrix", (MAC.MARKET_SIZES || {}).asOf, 120),
  asOfSurface("hf_aum", "Hedge-fund AUM (net aumAsOf or SEC regulatory raumAsOf)", CR.HEDGE_FUNDS, ["aumAsOf", "raumAsOf"], 540),
  asOfSurface("lp_profiles", "Investor (LP) profiles (asOf)", CR.lps, "asOf", 365),
  volumeSurface("legal_volume", "Legal alerts — weekly volume", LG.items),
  volumeSurface("credit_volume", "Credit deals + intel — weekly volume", [...(CR.deals || []), ...(CR.intel || [])]),
];

// The Home market briefing: the freshest of its three rolling slots, by (date·time)
// stamp. It must restamp on every ~2-hourly run, so it is judged in hours. A freshest
// slot older than BRIEF_STALE_HOURS means a run skipped the briefing (the 2026-10-12
// bug: the slot-time map only fired at a few fixed hours, so 08:00/10:00 runs left the
// morning slot frozen at 05:15).
function briefingState() {
  const B = BR.BRIEFINGS || {};
  const msOfBrief = (s) => {
    if (!s || !s.date) return 0;
    const t = String(s.time || "").match(/(\d{1,2}):(\d{2})/);
    const hh = t ? t[1].padStart(2, "0") : "00", mm = t ? t[2] : "00";
    return Date.parse(`${s.date}T${hh}:${mm}:00Z`) || 0;
  };
  // Single-briefing model ({date,time,bullets}); fall back to the freshest of a legacy
  // {slots} object so the audit works across the transition.
  let best = null;
  if (Array.isArray(B.bullets)) best = B;
  else { const slots = B.slots || {}; for (const k of Object.keys(slots)) { if (!best || msOfBrief(slots[k]) > msOfBrief(best)) best = slots[k]; } }
  const bestMs = msOfBrief(best);
  const bestStamp = bestMs ? new Date(bestMs).toISOString().slice(0, 16).replace("T", " ") : null;
  const ageHours = bestMs ? Math.round(((now - bestMs) / 3600000) * 10) / 10 : null;
  const stale = ageHours == null || ageHours > BRIEF_STALE_HOURS;
  return { key: "briefing", label: "Home market briefing", newestStamp: bestStamp, ageHours, stale };
}
const briefing = briefingState();

// Manager-profile depth: borrow the authoritative scorer so the audit and the
// backfill worklist never drift. Run it as --json and fold its summary in.
let coverage = null, worklist = [];
try {
  const r = spawnSync(process.execPath, [path.join(HERE, "manager-coverage.mjs"), "--json", "--size=" + opt("--size", "12")], { encoding: "utf8" });
  if (r.status === 0 && r.stdout) {
    const j = JSON.parse(r.stdout);
    // reach-≤2020 is not in the JSON summary; recompute it cheaply here from the data.
    const yr = (d) => Number(String(d || "").slice(0, 4)) || 0;
    const oldest = new Map();
    const note = (id, d) => { if (!id || !d) return; const y = yr(d); if (!y) return; const cur = oldest.get(id); if (cur == null || y < cur) oldest.set(id, y); };
    for (const d of CR.deals) note(d.managerId, d.date);
    for (const i of CR.intel) note(i.managerId, i.date);
    for (const m of CR.managers) if (Array.isArray(m.webNews)) for (const w of m.webNews) note(m.id, w.date);
    let reach2020 = 0; for (const [, y] of oldest) if (y <= 2020) reach2020++;
    coverage = { totalManagers: j.totalManagers, flagged: j.flagged, reach2020 };
    worklist = j.worklist || [];
  }
} catch { /* scorer unavailable — surfaces still audited */ }

// Coverage is "below target" when the aggregate ratchet in tests/manager-coverage.mjs
// would still flag depth work — i.e. more than a handful of profiles remain thin /
// missing-history. Kept loose here (the test holds the hard numbers); this only
// decides whether the audit asks the routine to spend its backfill budget.
const coverageStale = !!(coverage && coverage.flagged > 0);

// ---- assemble the actionable worklist ------------------------------------
const staleSurfaces = SURFACES.filter((s) => s.stale);
const actions = [];
for (const s of staleSurfaces) {
  const map = {
    deals: "Sweep NEW verified private-credit transactions (direct lending, unitranche, CLO pricings, SRTs, NAV/fund finance) and append to `deals`.",
    intel: "Sweep NEW verified fundraising / first & final closes / mandates / senior personnel and append to `intel`.",
    hedge_intel: "Sweep NEW verified hedge-fund activity (performance, launches, raises, personnel, wind-downs) and append to `HEDGE_INTEL`.",
    legal_items: "Sweep NEW verified legal updates / client alerts and append to legal `items`.",
    legal_cases: "Sweep NEW verified reported judgments and append to legal `cases`.",
    legal_rx: "Sweep NEW verified restructurings / schemes / RPs and append to legal `restructurings`.",
    macro_news: "REWRITE macro NEWS — exactly 5 US + 5 UK current, verified, dated headlines (macro/js/content.js).",
    macro_commentary: "Top up macro COMMENTARY to ≥10 items (bank/house research + named-economist opinion), newest first (macro/js/content.js).",
    macro_articles: "Prepend current, verified macro reading-list items (newest 3 dated today) to ARTICLES.items (macro/js/content.js).",
    clos: "Sweep NEW verified CLO pricings / resets / new issues and append to deals/intel with clo:true.",
    macro_releases: "Roll the macro releases calendar forward — drop past entries, add confirmed upcoming US/UK releases (macro/js/content.js RELEASES).",
    macro_editorial: "Review the macro editorial (OUTLOOK / CYCLE / BUBBLE) and restamp UPDATED when materially changed (macro/js/content.js).",
    dashboard_eq: "Refresh the dashboard equity-index Key Moments (dashboard/js/data.js EQ_INDICES keyMoment).",
    xfeed_myft: "Re-run the myFT RSS sweep into ft.js (FT_ITEMS).",
    xfeed_newsletters: "Sweep forwarded newsletters into newsletters.js (NEWSLETTERS).",
    research_lane: "Sweep research-house publications into research.js (RESEARCH) — the Research lane's source.",
    manager_webnews: "Sweep managers' own press pages into `webNews` (and mirror capital events into deals/intel).",
    macro_alerts: "Review the macro ALERTS bell items against current guidance (macro/js/content.js).",
    macro_keymoments: "Refresh IND_KEYMOMENTS / FX_KEYMOMENT with current, sourced captions (macro/js/content.js).",
    earnings: "Roll the EARNINGS calendar to the current and previous week (macro/js/content.js) — verified dates/tickers only.",
    hf_13f: "Update HF_13F to the latest filed 13F quarter (SEC EDGAR 13F-HR) — credit/js/data.js.",
    dashboard_snapshot: "Refreshed daily by the refresh-dash-snapshot GitHub Action (scripts/refresh-dash-snapshot.mjs) from the live sources — if stale, check that Action's last run.",
    dashboard_pc: "Roll PRIVATE_CREDIT (dashboard/js/data.js) to Fitch's latest monthly US PCDR + KBRA's latest quarterly compendium; set asOf.",
    dashboard_eu_distress: "Refresh EU_DISTRESS (dashboard/js/data.js): latest LCD ELLI / Fitch / S&P European default rates + the Insolvency Service monthly release; set asOf.",
    dashboard_regcal: "Review REG_CALENDAR (dashboard/js/data.js): add newly confirmed AIFMD II / ELTIF / FCA / CRR dates; set asOf.",
    dashboard_fedwatch: "Refresh OUTLOOK fedwatch + uk.sonia odds and the ECB/BoE/Fed next-meeting fields (macro/js/content.js).",
    dashboard_matwall: "Replace MATWALL.europeWall from the owner-supplied S&P UBS Western European Leveraged Loan Index dashboard (whole series + asOf/asOfIso), and re-source MATWALL.europe from the newest LCD/PitchBook European maturity-wall write-up (leads in backfill/matwall-sources.json) — every row verbatim, asOf + asOfIso together; replace MATWALL.ratedWall only when S&P publishes a fresher per-year split.",
    dashboard_market_sizes: "Refresh MARKET_SIZES from each source's latest release (macro/js/content.js).",
    hf_aum: "Regulatory AUM is refreshed daily from SEC Form ADV (collect-sec Action → apply-sec); for funds with no SEC filing, refresh net AUM from firm disclosures and set aumAsOf to the figure's date.",
    lp_profiles: "Refresh investor (LP) profiles from their latest annual reports; set asOf to the report date.",
    legal_volume: "Legal alert flow has collapsed vs its weekly median — sweep EVERY firm in `firms` (insights/news pages), firm by firm.",
    credit_volume: "Credit deal/intel flow has collapsed vs its weekly median — run the full manager + category sweep.",
  };
  actions.push({ surface: s.key, newest: s.newestDate, ageDays: s.ageDays, do: map[s.key] || `Refresh ${s.label}.` });
}
if (briefing.stale) actions.push({ surface: "briefing", newest: briefing.newestStamp, ageHours: briefing.ageHours, do: "Regenerate the briefing slot for the current London window (morning <12:00 / afternoon 12:00–17:00 / evening ≥17:00) and restamp it — every run, never skipped." });
if (coverageStale) actions.push({ surface: "coverage", flagged: coverage.flagged, reach2020: coverage.reach2020, do: "Backfill the worklisted managers' history to 2020 (deals / intel / webNews), all VERIFIED + dated." });

const ok = actions.length === 0;

// ---- output --------------------------------------------------------------
if (flag("--json")) {
  console.log(JSON.stringify({
    generated: new Date().toISOString().slice(0, 10),
    staleWindowDays: STALE_DAYS,
    briefingStaleHours: BRIEF_STALE_HOURS,
    ok,
    surfaces: SURFACES,
    briefing,
    coverage,
    worklist,
    actions,
  }, null, 2));
} else {
  const today = new Date().toISOString().slice(0, 10);
  console.log(`WIRE FRESHNESS AUDIT — ${today} (default stale window: ${STALE_DAYS}d; credit deals/intel ${CREDIT_WIN}d; some surfaces wider — see per-row)\n`);
  for (const s of SURFACES) {
    const tag = s.stale ? "STALE " : "fresh ";
    const age = s.note ? s.note : (s.ageDays == null ? "no dated items" : `${s.ageDays}d old`);
    console.log(`  [${tag}] ${s.label.padEnd(48)} newest ${String(s.newestDate || "—").padEnd(11)} (${age}, ${s.count} items)`);
  }
  {
    const tag = briefing.stale ? "STALE " : "fresh ";
    const age = briefing.ageHours == null ? "no briefing" : `${briefing.ageHours}h old`;
    console.log(`  [${tag}] ${briefing.label.padEnd(48)} newest ${String(briefing.newestStamp || "—").padEnd(11)} (${age})`);
  }
  if (coverage) {
    const tag = coverageStale ? "STALE " : "fresh ";
    console.log(`  [${tag}] ${"Manager-profile depth".padEnd(48)} ${coverage.reach2020}/${coverage.totalManagers} reach ≤2020 · ${coverage.flagged} flagged`);
  }
  if (ok) {
    console.log(`\nAll surfaces fresh and coverage on target — nothing to resolve this run.`);
  } else {
    console.log(`\nACTIONS (resolve each — source VERIFIED, dated items, NEVER fabricate; then re-run the gate):`);
    for (const a of actions) console.log(`  • ${a.surface}${a.ageDays != null ? ` (${a.ageDays}d)` : ""}: ${a.do}`);
    if (coverageStale && worklist.length) {
      console.log(`\nBACKFILL WORKLIST (thinnest-first, rotating — today's targets):`);
      for (const w of worklist) console.log(`    ${String(w.total).padStart(3)}  ${w.name}  [${w.founded != null ? "est." + w.founded : "est.?"}]  → ${(w.gaps || []).join(", ")}`);
    }
  }
}
process.exit(ok ? 0 : 1);
