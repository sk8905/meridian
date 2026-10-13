// Freshness-audit tool guard (pure logic — no browser / no egress).
//
// scripts/freshness-audit.mjs is the deterministic staleness detector the autonomous
// refresh/backfill routines run FIRST, so they get a concrete worklist instead of
// silently no-op'ing. This spec proves the tool exists, runs, and emits a well-formed
// machine-readable audit whose staleness verdict matches the committed data — so a
// routine can trust its exit code and JSON to decide what to resolve.
import { check, finish, ROOT } from "./lib.mjs";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const tool = path.join(ROOT, "scripts", "freshness-audit.mjs");
check(fs.existsSync(tool), "freshness-audit: scripts/freshness-audit.mjs exists");

// Run it as JSON with a fixed stale window so the assertions are deterministic.
const r = spawnSync(process.execPath, [tool, "--json", "--stale=7"], { encoding: "utf8" });
let j = null; try { j = JSON.parse(r.stdout); } catch { /* */ }
check(!!j, "freshness-audit: --json emits parseable JSON");

if (j) {
  // Shape: surfaces[] each with key/label/count/newestDate/ageDays/stale.
  const keys = new Set((j.surfaces || []).map((s) => s.key));
  // CONTRACT: the audit must cover EVERY dated content surface the app renders. This
  // list is the guard against coverage silently shrinking back to "the main surfaces"
  // — add a key here whenever a new dated surface ships, so the health check sees it.
  const REQUIRED = [
    "deals", "intel", "clos", "credit_research", "hedge_intel",
    "legal_items", "legal_cases", "legal_rx",
    "macro_news", "macro_commentary", "macro_articles", "macro_releases", "macro_editorial",
    "dashboard_eq", "xfeed_myft", "xfeed_newsletters", "research_lane",
  ];
  const missing = REQUIRED.filter((k) => !keys.has(k));
  check(missing.length === 0, `freshness-audit: audits every content surface${missing.length ? ` (MISSING: ${missing.join(", ")})` : ` (${REQUIRED.length} surfaces)`}`);
  const shapeOk = (j.surfaces || []).every((s) => typeof s.key === "string" && typeof s.count === "number" && typeof s.stale === "boolean" && (s.ageDays === null || typeof s.ageDays === "number"));
  check(shapeOk, "freshness-audit: every surface row is well-formed (key / count / ageDays / stale)");

  // The staleness verdict must agree with the data: a surface is stale iff its newest
  // dated item is older than THAT surface's window (or it has none). Re-derive
  // independently, mirroring the script's per-surface cadence windows.
  const DAY = 86400000, now = Date.now();
  const WIN = { clos: 21, dashboard_eq: 21, research_lane: 10, macro_editorial: 45 }; // default 7
  const recompute = async () => {
    const CR = await import("../credit/js/data.js");
    const LG = await import("../legal/js/data.js");
    const MAC = await import("../macro/js/content.js");
    const FT = await import("../ft.js");
    const NL = await import("../newsletters.js");
    const RSCH = await import("../research.js");
    const DASH = await import("../dashboard/js/data.js");
    const msOf = (d) => { const s = /^\d{4}-\d{2}$/.test(d) ? d + "-01" : String(d || "").slice(0, 10); const t = Date.parse(s); return Number.isNaN(t) ? 0 : t; };
    const newest = (rows, f = "date") => (rows || []).reduce((m, x) => Math.max(m, msOf(x && x[f])), 0);
    const stale = (rows, key) => { const ms = newest(rows); return ms === 0 ? true : Math.round((now - ms) / DAY) > (WIN[key] || 7); };
    const cmt = [...(((MAC.COMMENTARY || {}).us) || []), ...(((MAC.COMMENTARY || {}).uk) || [])];
    const out = {
      deals: stale(CR.deals, "deals"), intel: stale(CR.intel, "intel"),
      clos: stale([...(CR.deals || []), ...(CR.intel || [])].filter((x) => x && x.clo), "clos"),
      credit_research: stale(CR.research, "credit_research"),
      hedge_intel: stale(CR.HEDGE_INTEL, "hedge_intel"),
      legal_items: stale(LG.items, "legal_items"), legal_cases: stale(LG.cases, "legal_cases"), legal_rx: stale(LG.restructurings, "legal_rx"),
      macro_news: stale([...(((MAC.NEWS || {}).us) || []), ...(((MAC.NEWS || {}).uk) || [])], "macro_news"),
      macro_articles: stale(((MAC.ARTICLES || {}).items) || [], "macro_articles"),
      dashboard_eq: stale((DASH.EQ_INDICES || []).map((i) => i && i.keyMoment).filter(Boolean), "dashboard_eq"),
      xfeed_myft: stale(FT.FT_ITEMS, "xfeed_myft"), xfeed_newsletters: stale(NL.NEWSLETTERS, "xfeed_newsletters"),
      research_lane: stale(RSCH.RESEARCH, "research_lane"),
    };
    // Macro commentary: stale when thin (<10, R18) OR its newest piece is past the window.
    const cmtMs = newest(cmt);
    out.macro_commentary = cmt.length < 10 || cmtMs === 0 || Math.round((now - cmtMs) / DAY) > 7;
    // Macro editorial: a single UPDATED stamp, judged on a slow 45d window.
    out.macro_editorial = stale([{ date: new Date(Date.parse(MAC.UPDATED || "") || 0).toISOString().slice(0, 10) }], "macro_editorial");
    // Macro releases calendar is FORWARD-looking: stale iff nothing dated today-or-later.
    const startToday = Date.parse(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
    out.macro_releases = !(MAC.RELEASES || []).some((rrow) => msOf(rrow && rrow.date) >= startToday);
    return out;
  };
  const expect = await recompute();
  // Compare only keys we independently recomputed (the full REQUIRED set lives in expect).
  const mismatches = (j.surfaces || []).filter((s) => s.key in expect && s.stale !== expect[s.key]).map((s) => s.key);
  check(mismatches.length === 0, `freshness-audit: the stale verdict matches the committed data${mismatches.length ? ` (mismatch: ${mismatches.join(", ")})` : ""}`);

  // The Home briefing is audited in HOURS (it restamps every ~2h run). Well-formed,
  // and when stale it must raise a "briefing" action so a run can't silently skip it.
  check(j.briefing && j.briefing.key === "briefing" && typeof j.briefing.stale === "boolean" && (j.briefing.ageHours === null || typeof j.briefing.ageHours === "number"),
    "freshness-audit: the Home briefing is audited (hours-based) and well-formed");

  // ok === "no actions", and a stale surface (or coverage deficit) must raise an action.
  check(j.ok === (j.actions.length === 0), "freshness-audit: ok is true exactly when there are no actions");
  const actionSurfaces = new Set(j.actions.map((a) => a.surface));
  const staleSurfaces = (j.surfaces || []).filter((s) => s.stale).map((s) => s.key);
  check(staleSurfaces.every((k) => actionSurfaces.has(k)), "freshness-audit: every stale surface raises a resolve-action");
  if (j.briefing && j.briefing.stale) check(actionSurfaces.has("briefing"), "freshness-audit: a stale briefing raises a resolve-action");

  // When coverage work remains, it carries the rotating backfill worklist for the routine.
  if (actionSurfaces.has("coverage")) check(Array.isArray(j.worklist) && j.worklist.length > 0, "freshness-audit: a coverage action ships the backfill worklist");

  // Exit code: 0 when clean, 1 when action is needed — so a routine/CI can branch on it.
  check(r.status === (j.ok ? 0 : 1), `freshness-audit: exit code reflects the verdict (ok=${j.ok} → exit ${r.status})`);
}

finish();
