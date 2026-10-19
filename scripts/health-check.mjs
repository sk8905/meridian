// =============================================================================
// health-check.mjs — one deterministic "is Wire functioning as intended?" report.
//
// Aggregates three independent health signals into a single verdict, each issue
// paired with a plain-English explanation and a proposed fix, so a daily routine
// can email the reader a confirm-or-flag summary (and so a human can run it by hand):
//
//   1. CONTENT FRESHNESS — every data surface the app shows (credit deals / intel,
//      legal updates / cases / restructurings, macro news / commentary / articles,
//      the Home briefing) via scripts/freshness-audit.mjs. Stale = the refresh
//      routines haven't appended verified items lately.
//   2. REFRESH CADENCE — how long since the last commit landed on this checkout.
//      The ~2-hourly routine publishes on every run (even a no-op restamp), so a
//      long gap during the active London day means it has stopped firing/publishing.
//   3. BUILD SANITY — the committed Worker + data modules parse / import cleanly.
//      A refresh that published a malformed module would break the live site.
//
// Pure read (shells out to freshness-audit + git + node --check); no network, and no
// writes unless --write is given. Exit code: 0 when everything is GOOD, 1 when
// anything needs attention, so a routine or CI can branch on it.
//
// --write also commits the result as the tokenless data module dashboard/js/health.js
// (HEALTH), which Menu ▸ Sources (v2/js/status-page.js) reads for each surface's
// count / newest date / window and the proposed fix. The page RE-JUDGES every stamp
// against the viewer's clock (and against the live data modules), so it never shows a
// stale verdict even when this file is a few hours old.
//
// Usage:
//   node scripts/health-check.mjs           # human report + exit code
//   node scripts/health-check.mjs --json    # machine-readable verdict
//   node scripts/health-check.mjs --write   # also write dashboard/js/health.js
// =============================================================================
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const asJson = process.argv.includes("--json");
const doWrite = process.argv.includes("--write");

// Active London hours: the refresh fires ~05:00–23:00 London and is quiet overnight,
// so the cadence check is only meaningful inside that window (no run is expected at 03:00).
const CADENCE_MAX_HOURS = 3.5;   // every ~2h → a gap over this during the day is a miss
function londonHour() {
  try { return +new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Europe/London" }).format(new Date()); }
  catch { return new Date().getUTCHours(); }
}

const issues = [];   // { area, severity: "fail"|"attention", detail, solution }

// ---- 1. Content freshness -------------------------------------------------
let audit = null;
try {
  const r = spawnSync("node", [path.join(HERE, "freshness-audit.mjs"), "--json"], { cwd: ROOT, encoding: "utf8", maxBuffer: 8 << 20 });
  audit = JSON.parse(r.stdout);
} catch (e) {
  issues.push({ area: "freshness-audit", severity: "fail", detail: `could not run the freshness audit (${e.message})`, solution: "The audit script itself is broken — check scripts/freshness-audit.mjs and the data modules it imports parse." });
}
const staleSurfaces = audit ? audit.surfaces.filter((s) => s.stale) : [];
const actionBy = {};
if (audit && Array.isArray(audit.actions)) for (const a of audit.actions) actionBy[a.surface] = a.do || "";
const GENERIC_FIX = "The next heavy-sweep routine run should source verified, dated items for this surface and append them. If it stays stale across 2+ runs, the sweep source is failing — investigate that surface's sources.";
for (const s of staleSurfaces) {
  issues.push({
    area: `content:${s.key}`,
    severity: "attention",
    detail: (s.ageDays == null && s.note ? `${s.label}: ${s.note}` : `${s.label} is ${s.ageDays}d old (newest ${s.newestDate}, ${s.count} items)`) + (s.min ? ` — below the ≥${s.min} floor` : ""),
    solution: actionBy[s.key] || GENERIC_FIX,
  });
}
// The Home briefing is a separate (hours-based) surface in the audit.
if (audit && audit.briefing && audit.briefing.stale) {
  issues.push({
    area: "content:briefing",
    severity: "attention",
    detail: `${audit.briefing.label} is ${audit.briefing.ageHours}h old (stamp ${audit.briefing.newestStamp})`,
    solution: "The refresh routine rewrites the briefing every run — if it's stale, the routine hasn't run recently (see cadence) or isn't restamping it.",
  });
}
const coverage = audit ? audit.coverage : null;

// ---- 2. Refresh cadence ---------------------------------------------------
let lastCommitAgeH = null, lastCommitSubject = "", lastCommitAt = null;
try {
  // Measure the PUBLISHED tip (origin/main) when it resolves — that is what the live
  // site serves and what the refresh routine pushes to; fall back to HEAD otherwise.
  const hasOrigin = spawnSync("git", ["rev-parse", "--verify", "-q", "origin/main"], { cwd: ROOT, encoding: "utf8" }).status === 0;
  const ref = hasOrigin ? "origin/main" : "HEAD";
  const t = spawnSync("git", ["log", "-1", "--format=%ct\t%s", ref], { cwd: ROOT, encoding: "utf8" }).stdout.trim();
  const [ct, subj] = t.split("\t");
  lastCommitAgeH = (Date.now() / 1000 - +ct) / 3600;
  lastCommitAt = new Date(+ct * 1000).toISOString();
  lastCommitSubject = subj || "";
} catch { /* not a git checkout — skip cadence */ }
const lh = londonHour();
const inActiveWindow = lh >= 6 && lh <= 23;
if (lastCommitAgeH != null && inActiveWindow && lastCommitAgeH > CADENCE_MAX_HOURS) {
  issues.push({
    area: "cadence",
    severity: "fail",
    detail: `the last commit on this checkout is ${lastCommitAgeH.toFixed(1)}h old (expected ≤${CADENCE_MAX_HOURS}h during the London day); newest: "${lastCommitSubject}"`,
    solution: "The ~2-hourly '/Wire: full refresh' routine may have stopped firing or failed to publish. Check its last run in the Claude Code Routines UI — re-enable it, fix the failing run, or fire it manually.",
  });
}

// ---- 2b. Collection yield ------------------------------------------------
// The cadence check proves a routine COMMITTED, not that it COLLECTED: in the week to
// 2026-10-13 ~80 routine runs restamped on schedule while adding ~27 records. Count the
// records actually added to the data modules in the last 24h (new `id:` lines in the
// diff) so a restamp-only routine can't read as healthy.
const YIELD_FILES = { deals: /"?id"?\s*:\s*"d\d+"/, intel: /"?id"?\s*:\s*"i\d+"/, hedge: /"?id"?\s*:\s*"hi\d+"/, legal: /"?id"?\s*:\s*"(u|c|rx)\d+"/ };
let yield24 = null;
// Compare the record ids NOW against the ids in the last commit from >24h ago. (Reading
// `git log -p` instead over-counts in a SHALLOW clone — the routines' checkouts are
// shallow, so the boundary commit's diff shows every record as "added": the 2026-10-14
// email reported 4,316 new records, i.e. the whole dataset.) If that base commit isn't
// in the checkout, deepen once; if it still isn't, report the yield as unknown.
try {
  const git = (args) => spawnSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 << 20 });
  const ref = git(["rev-parse", "--verify", "-q", "origin/main"]).status === 0 ? "origin/main" : "HEAD";
  let base = git(["rev-list", "-1", "--before=24 hours ago", ref]).stdout.trim();
  if (!base) { git(["fetch", "-q", "--shallow-since=3 days ago", "origin", "main"]); base = git(["rev-list", "-1", "--before=24 hours ago", ref]).stdout.trim(); }
  if (base) {
    const ids = (rev) => {
      const out = new Set();
      for (const f of ["credit/js/data.js", "legal/js/data.js"]) {
        const r = git(["show", `${rev}:${f}`]);
        if (r.status !== 0) return null;
        for (const m of r.stdout.matchAll(/"?id"?\s*:\s*"((?:d|i|hi|u|c|rx)\d+)"/g)) out.add(m[1]);
      }
      return out;
    };
    const before = ids(base), now = ids(ref);
    if (before && now) {
      yield24 = { deals: 0, intel: 0, hedge: 0, legal: 0 };
      for (const id of now) {
        if (before.has(id)) continue;
        for (const [k, re] of Object.entries(YIELD_FILES)) if (re.test(`id: "${id}"`)) { yield24[k]++; break; }
      }
    }
  }
} catch { /* not a git checkout — skip yield */ }
const yieldTotal = yield24 ? Object.values(yield24).reduce((a, b) => a + b, 0) : null;
if (yield24 && yieldTotal === 0 && lastCommitAgeH != null && lastCommitAgeH < 24) {
  issues.push({
    area: "yield",
    severity: "attention",
    detail: "the routines published in the last 24h but added NO new deals, intel, hedge-fund or legal records",
    solution: "The refresh is restamping without collecting. Check the routine run summaries for the searches run; a full day with zero new verified records across ~200 managers and 26 law firms means the sweep is not running.",
  });
}

// ---- 2c. Commit hygiene (HOUSE_STYLE T8) -----------------------------------
// No model identifier in any committed artifact — including commit trailers
// ("Co-Authored-By: Claude Opus 4.8" broke this through Oct 2026). Flag the last 24h.
try {
  const hasOrigin = spawnSync("git", ["rev-parse", "--verify", "-q", "origin/main"], { cwd: ROOT, encoding: "utf8" }).status === 0;
  const r = spawnSync("git", ["log", "--since=24 hours ago", "--format=%h%x09%B%x00", hasOrigin ? "origin/main" : "HEAD"], { cwd: ROOT, encoding: "utf8", maxBuffer: 16 << 20 });
  const bad = (r.stdout || "").split("\0").map((c) => c.trim()).filter(Boolean)
    .filter((c) => /\b(Opus|Sonnet|Haiku|Fable)\b|claude-(opus|sonnet|haiku|fable)/i.test(c)).map((c) => c.split("\t")[0]);
  if (bad.length) issues.push({
    area: "commit-hygiene",
    severity: "attention",
    detail: `${bad.length} commit(s) in the last 24h carry a model identifier (${bad.slice(0, 5).join(", ")})`,
    solution: "Use the model-free trailer `Co-Authored-By: Claude Code <noreply@anthropic.com>` (CLAUDE.md, HOUSE_STYLE T8). History can't be rewritten on main; fix the session/routine that writes it.",
  });
} catch { /* not a git checkout */ }

// ---- 2d. 2020 backfill (checklist completeness — progress, not a failure) ----
let backfill = null;
try {
  const r = spawnSync("node", [path.join(HERE, "backfill-progress.mjs"), "--json"], { cwd: ROOT, encoding: "utf8", maxBuffer: 8 << 20 });
  if (r.status === 0) { const j = JSON.parse(r.stdout); backfill = { pct: j.pct, present: j.present, events: j.events, built: j.built, entities: j.entities }; }
} catch { /* script missing — skip */ }

// ---- 2e. Newswire lanes — is each Home lane actually stocked? ---------------
// The live RSS part of the wire is fetched by the Worker at view time (not checkable
// here); this measures the curated content each lane draws on, plus how much a
// Watchlist follow can show for each entity type.
let lanes = null;
try {
  const [C, L, NL, RS] = await Promise.all([import("../credit/js/data.js"), import("../legal/js/data.js"), import("../newsletters.js"), import("../research.js")]);
  const now = new Date(), iso = (d) => d.toISOString().slice(0, 10);
  const since = (days) => iso(new Date(now.getTime() - days * 864e5));
  const monthStart = iso(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)));
  const mgrEv = [...(C.deals || []), ...(C.intel || [])].filter((x) => x.date >= monthStart).length
    + (C.managers || []).reduce((n, m) => n + (m.webNews || []).filter((w) => (w.date || "") >= monthStart).length, 0);
  const hfWith = new Set((C.HEDGE_INTEL || []).map((h) => h.hfId));
  const hfTotal = (C.HEDGE_FUNDS || []).length, hfCovered = (C.HEDGE_FUNDS || []).filter((h) => hfWith.has(h.id)).length;
  const firmRecent = new Set((L.items || []).filter((i) => (i.date || "") >= since(30)).map((i) => i.firm)).size;
  lanes = {
    managers: mgrEv,
    research14: (RS.RESEARCH || []).filter((x) => (x.date || "") >= since(14)).length,
    newsletters7: (NL.NEWSLETTERS || []).filter((x) => (x.date || "") >= since(7)).length,
    hfCovered, hfTotal, firmRecent, firmTotal: (L.firms || []).length,
  };
  const lane = (area, cond, detail, solution) => { if (cond) issues.push({ area, severity: "attention", detail, solution }); };
  lane("lane:managers", mgrEv < 20, `Managers lane has only ${mgrEv} manager events since ${monthStart}`, "The heavy sweep's candidate collector should be adding manager deals/intel every run — check its last runs for 'no feed reachable' or mass rejections.");
  lane("lane:research", lanes.research14 === 0, "Research lane: no house-research items in the last 14 days", "The refresh routine's research email sweep (Gmail) found nothing — check the mailbox forwarding and the sweep step.");
  lane("lane:newsletters", lanes.newsletters7 === 0, "Newsletters lane: no newsletter items in the last 7 days", "The refresh routine's newsletter email sweep found nothing — check the mailbox and the sweep step.");
  lane("lane:watchlist-hedge", hfCovered / Math.max(1, hfTotal) < 0.6, `Watchlist depth: only ${hfCovered}/${hfTotal} tracked hedge funds have any news on record, so following one often shows little`, "Hedge-fund news needs building out: the 2020 backfill and heavy sweep should prioritise hedge funds with no HEDGE_INTEL records.");
} catch { /* lane sources missing — skip */ }

// ---- 3. Build sanity ------------------------------------------------------
const MODULES = [
  { label: "Worker (src/index.js)", cmd: ["node", "--check", "src/index.js"] },
  { label: "credit/js/data.js", cmd: ["node", "--input-type=module", "-e", "import('./credit/js/data.js').then(m=>{if(!Array.isArray(m.deals))throw new Error('no deals')})"] },
  { label: "legal/js/data.js", cmd: ["node", "--input-type=module", "-e", "import('./legal/js/data.js').then(m=>{if(!Array.isArray(m.items))throw new Error('no items')})"] },
  { label: "macro/js/content.js", cmd: ["node", "--input-type=module", "-e", "import('./macro/js/content.js').then(m=>{if(!m.META)throw new Error('no META')})"] },
  { label: "briefings.js", cmd: ["node", "--input-type=module", "-e", "import('./briefings.js').then(m=>{if(!m.BRIEFINGS)throw new Error('no BRIEFINGS')})"] },
];
for (const m of MODULES) {
  const r = spawnSync(m.cmd[0], m.cmd.slice(1), { cwd: ROOT, encoding: "utf8" });
  if (r.status !== 0) issues.push({
    area: `build:${m.label}`,
    severity: "fail",
    detail: `${m.label} does not parse/import cleanly: ${(r.stderr || "").trim().split("\n").pop()}`,
    solution: "A refresh likely committed a malformed module, which breaks the live site. Revert the offending commit or fix the syntax, then redeploy.",
  });
}

// ---- 4. CI (the automated test suite on main) ------------------------------
// The refresh routines gate only on the data specs before publishing, so a change can
// leave the FULL suite (.github/workflows/tests.yml, run on every push) red for a day
// without anyone noticing (owner 2026-10-19: six specs failed silently). Read the latest
// completed run on main and surface a red one. Tries the authenticated `gh` CLI first,
// then a GITHUB_TOKEN / GH_TOKEN, then the public API; if none answer, it says so rather
// than guessing. --no-ci (or WIRE_HEALTH_NO_CI=1) skips it offline; WIRE_HEALTH_CI_STUB
// injects a run JSON for the spec.
const CI_API = "repos/sk8905/meridian/actions/workflows/tests.yml/runs?branch=main&status=completed&per_page=1";
let ci = null;
async function readCi() {
  if (process.env.WIRE_HEALTH_CI_STUB) return { ...JSON.parse(process.env.WIRE_HEALTH_CI_STUB), via: "stub" };
  const pick = (j) => { const r = j && j.workflow_runs && j.workflow_runs[0]; return r ? { conclusion: r.conclusion, sha: String(r.head_sha || "").slice(0, 7), at: r.updated_at || r.created_at, url: r.html_url, title: r.display_title || "" } : null; };
  const g = spawnSync("gh", ["api", CI_API], { encoding: "utf8", timeout: 15000 });
  if (g.status === 0) { try { const r = pick(JSON.parse(g.stdout)); if (r) return { ...r, via: "gh" }; } catch { /* fall through */ } }
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  try {
    const res = await fetch(`https://api.github.com/${CI_API}`, { headers: { "user-agent": "wire-health-check", accept: "application/vnd.github+json", ...(token ? { authorization: `Bearer ${token}` } : {}) }, signal: AbortSignal.timeout(10000) });
    if (res.ok) { const r = pick(await res.json()); if (r) return { ...r, via: token ? "token" : "public" }; }
    return { unavailable: `GitHub API ${res.status}` };
  } catch (e) { return { unavailable: e.message }; }
}
if (!process.argv.includes("--no-ci") && process.env.WIRE_HEALTH_NO_CI !== "1") {
  ci = await readCi();
  if (ci && ci.unavailable) issues.push({
    area: "ci:tests", severity: "attention",
    detail: `could not read the automated test result for main (${ci.unavailable})`,
    solution: "Check the latest 'tests' run at https://github.com/sk8905/meridian/actions/workflows/tests.yml — and make sure this environment has the gh CLI or a GITHUB_TOKEN so the health check can read it.",
  });
  else if (ci && ci.conclusion && ci.conclusion !== "success" && ci.conclusion !== "skipped") issues.push({
    area: "ci:tests", severity: "attention",
    detail: `the automated test suite is ${ci.conclusion.toUpperCase()} on main (commit ${ci.sha}, ${ci.at}) — something a recent change or data edit broke is live`,
    solution: `Open ${ci.url}, read which specs failed, fix them and run the full suite (node tests/run.mjs) before pushing. Routines only gate on the data specs, so this is the only place a red suite surfaces.`,
  });
}

// ---- Verdict --------------------------------------------------------------
const fails = issues.filter((i) => i.severity === "fail");
const attention = issues.filter((i) => i.severity === "attention");
const verdict = fails.length ? "FAIL" : attention.length ? "ATTENTION" : "GOOD";
const ok = verdict === "GOOD";

// ---- --write: the committed snapshot the Sources page reads -----------------
if (doWrite) {
  const fs = await import("node:fs");
  let rosters = null;
  try {
    const [C, L] = await Promise.all([import("../credit/js/data.js"), import("../legal/js/data.js")]);
    rosters = { managers: (C.managers || []).length, funds: (C.funds || []).length, lps: (C.lps || []).length, hedgeFunds: (C.HEDGE_FUNDS || []).length, firms: (L.firms || []).length };
  } catch { /* rosters optional */ }
  const pick = (s) => ({ key: s.key, label: s.label, count: s.count, newestDate: s.newestDate, ageDays: s.ageDays, windowDays: s.windowDays, stale: !!s.stale, note: s.note || null, min: s.min || null });
  const HEALTH = {
    generated: new Date().toISOString(),
    verdict,
    issues: [...fails, ...attention].map((i) => ({ area: i.area, severity: i.severity, detail: i.detail, solution: i.solution })),
    surfaces: audit ? audit.surfaces.map(pick) : [],
    briefing: audit && audit.briefing ? audit.briefing : null,
    actions: actionBy,
    lastPublishAt: lastCommitAt,
    newRecords24h: yield24,
    lanes,
    rosters,
  };
  const out = "// =============================================================================\n"
    + "// dashboard/js/health.js — the last health-check snapshot (Menu ▸ Sources).\n"
    + "// AUTO-GENERATED by `node scripts/health-check.mjs --write` on every refresh run —\n"
    + "// do not hand-edit. Tokenless + no-cache (see _headers). The page re-judges these\n"
    + "// stamps against the viewer's clock, so an older snapshot never reads as current.\n"
    + "// =============================================================================\n"
    + "export const HEALTH = " + JSON.stringify(HEALTH, null, 1) + ";\n";
  fs.writeFileSync(path.join(ROOT, "dashboard/js/health.js"), out);
  if (!asJson) console.error("health-check: wrote dashboard/js/health.js");
}

if (asJson) {
  console.log(JSON.stringify({ generated: new Date().toISOString(), verdict, ok, fails, attention, coverage, cadenceHours: lastCommitAgeH, newRecords24h: yield24, backfill, lanes, ci }, null, 2));
} else {
  const date = new Date().toISOString().slice(0, 10);
  console.log(`WIRE HEALTH CHECK — ${date}`);
  console.log(`VERDICT: ${verdict}` + (ok ? " — everything is functioning as intended." : ""));
  console.log("");
  if (fails.length) {
    console.log("FAILURES (need action):");
    for (const i of fails) console.log(`  ✗ [${i.area}] ${i.detail}\n      → ${i.solution}`);
    console.log("");
  }
  if (attention.length) {
    console.log("NEEDS ATTENTION (stale content — the routines should clear these):");
    for (const i of attention) console.log(`  • [${i.area}] ${i.detail}\n      → ${i.solution}`);
    console.log("");
  }
  if (coverage) console.log(`Manager-profile backfill (ongoing, not a failure): ${coverage.reach2020}/${coverage.totalManagers} profiles reach ≤2020, ${coverage.flagged} flagged for depth.`);
  if (lanes) console.log(`Newswire lanes: Managers ${lanes.managers} events (this + last month) · Research ${lanes.research14} (14d) · Newsletters ${lanes.newsletters7} (7d) · Watchlist depth — hedge funds with news ${lanes.hfCovered}/${lanes.hfTotal}, law firms active in 30d ${lanes.firmRecent}/${lanes.firmTotal}.`);
  if (backfill) console.log(`2020 backfill (checklist): ${backfill.present}/${backfill.events} events present = ${backfill.pct}% · ${backfill.built}/${backfill.entities} priority entities researched.`);
  if (yield24) console.log(`New records published in the last 24h: ${yieldTotal} (deals ${yield24.deals} · intel ${yield24.intel} · hedge ${yield24.hedge} · legal ${yield24.legal}).`);
  if (ci && !ci.unavailable && ci.conclusion) console.log(`Automated tests on main: ${ci.conclusion === "success" ? "PASSING" : ci.conclusion.toUpperCase()} (commit ${ci.sha}, ${ci.at}).`);
  if (lastCommitAgeH != null) console.log(`Last publish to this checkout: ${lastCommitAgeH.toFixed(1)}h ago — "${lastCommitSubject}".`);
  if (ok) console.log("\nAll content surfaces fresh, the refresh is publishing on cadence, and every module builds cleanly.");
}

process.exit(ok ? 0 : 1);
