// Colour + typography token discipline (HOUSE_STYLE R8/R9/R10/R11). Static
// checks pinning a few regressions the daily house-style audit caught: a
// "neutral" wire pill relying on its var() fallback because --t-news was never
// declared as a real token (R8's per-surface token-block architecture), the
// main wire's dark day-break band drifting to --t-ground instead of --t-head
// (R6, out of step with its own .tw-day sibling), a Macro tile's primary
// numeric VALUE painted in the accent orange (R9 — accent is emphasis-only,
// never body/data text), the desktop topbar identity text hardcoding a one-off
// grey instead of --muted (R10), and Credit/Legal/Macro's own `body{}` rules
// reintroducing a hardcoded 16px that silently beat premium.css's
// `body{font-size:var(--fs-content)}` token by CSS source order (R11).
import fs from "node:fs";
import path from "node:path";
import { ROOT, check, finish } from "./lib.mjs";

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");

const feedCss = read("feed.css");
const homeCss = read("home.css");
const macroCss = read("macro/css/styles.css");
const headerCss = read("header.css");
const creditCss = read("credit/css/styles.css");
const legalCss = read("legal/css/styles.css");
const premiumCss = read("premium.css");
const paletteJs = read("palette.js");
const feedJs = read("feed.js");
const dashboardApp = read(path.join("v2", "js", "dashboard", "app.js"));
const statusJs = read(path.join("v2", "js", "status.js"));

// R8 — --t-news must be a REAL declared custom property (dark + light), not
// just a var(--t-news, #fallback) with nothing ever setting it.
for (const [label, src] of [["feed.css", feedCss], ["home.css", homeCss]]) {
  check(/--t-news\s*:\s*#[0-9a-fA-F]{3,8}/.test(src), `${label} declares a real --t-news custom property (not fallback-only)`);
}

// R6 — the main wire's day-break band uses --t-head (grey band), matching the
// documented spec and its .tw-day sibling in tui.css, not --t-ground.
check(/\.g-feed-dayhdr\s*\{[^}]*background:var\(--t-head\)/.test(feedCss),
  "feed.css .g-feed-dayhdr (dark) bands on --t-head, not --t-ground");

// R9 — Macro tile primary value is plain data text, not accent-coloured.
check(/\.macro-val\s*\{[^}]*color:\s*var\(--ink\)/.test(macroCss),
  "macro/css/styles.css .macro-val uses --ink, not the accent (--macro) orange");

// R10 — desktop topbar identity/status text uses the shared muted token, not a
// one-off hex grey.
check(/\.account-nav\s*\{[^}]*color:\s*var\(--muted/.test(headerCss),
  "header.css .account-nav reads var(--muted), not a hardcoded grey");
check(/\.data-status\s*\{[^}]*color:\s*var\(--muted/.test(headerCss),
  "header.css .data-status reads var(--muted), not a hardcoded grey");

// R11 — body text size comes from the --fs-content token (set once in
// premium.css); Credit/Legal/Macro's own body{} rules must not reinstate a
// hardcoded 16px, which (at equal specificity) wins by load order in
// v2/index.html and silently overrides the token app-wide.
for (const [label, src] of [["credit/css/styles.css", creditCss], ["legal/css/styles.css", legalCss], ["macro/css/styles.css", macroCss]]) {
  const bodyRule = src.match(/body\s*\{[^}]*\}/);
  check(!!bodyRule && !/font-size\s*:\s*16px/.test(bodyRule[0]), `${label} body{} does not hardcode font-size:16px over --fs-content`);
}

// R10 — the phone-footer / menu "Sign out" link uses the shared muted token,
// not a hardcoded #fff that vanishes on an on-surface (non-navy) background.
check(/\.na-menu-acct a\s*\{[^}]*color:\s*var\(--muted/.test(premiumCss),
  "premium.css .na-menu-acct a reads var(--muted), not a hardcoded #fff");
check(/\.acct-foot \.account-nav a\s*\{[^}]*color:\s*var\(--muted\)/.test(premiumCss),
  "premium.css .acct-foot .account-nav a reads var(--muted), not a hardcoded #fff");
check(/\.g-footer \.g-user a\s*\{[^}]*color:var\(--muted\)/.test(homeCss),
  "home.css .g-footer .g-user a reads var(--muted), not a hardcoded #fff");

// R10 — the mobile tab bar's light background reuses the --bg token instead of
// a bespoke one-off grey that drifts from the app's actual light --bg.
check(/\.mobile-tabbar\s*\{[^}]*background:\s*var\(--bg/.test(premiumCss),
  "premium.css .mobile-tabbar background reads var(--bg), not a one-off hex grey");

// R11 — numeric columns in Credit's KPI cards and league tables use
// tabular-nums so digits don't jitter width as values update.
for (const [label, sel] of [[".kpi-value", /\.kpi-value\s*\{[^}]*font-variant-numeric:\s*tabular-nums/],
  [".data-table .rank", /\.data-table \.rank\s*\{[^}]*font-variant-numeric:\s*tabular-nums/],
  [".data-table .num", /\.data-table \.num\s*\{[^}]*font-variant-numeric:\s*tabular-nums/]]) {
  check(sel.test(creditCss), `credit/css/styles.css ${label} uses tabular-nums`);
}

// R14a — the portfolio Daily/Total and prediction-market Up/Down toggles are
// part of the ONE selection-marker family named by R14a ("the prediction and
// markets chips"); their .on state must use the shared underline, not a
// fill/colour-swap.
check(/\.g-pf-tgl\.on,\s*\.tui \.g-pred-dir\.on\{[^}]*box-shadow:inset 0 -2px 0 var\(--chip-ul/.test(homeCss),
  "home.css .g-pf-tgl.on/.g-pred-dir.on use the chip-underline box-shadow, not a background fill");
check(!/\.g-pf-tgl\.on,\s*\.tui \.g-pred-dir\.on\{\s*background:var\(--t-panel2\)/.test(homeCss),
  "home.css .g-pf-tgl.on/.g-pred-dir.on no longer swap background on select");
check(/\.na-pf-tgl\.on,\s*\.na-pred-dir\.on\s*\{[^}]*box-shadow:\s*inset 0 -2px 0 var\(--chip-ul/.test(premiumCss),
  "premium.css .na-pf-tgl.on/.na-pred-dir.on use the chip-underline box-shadow, not a background fill");
check(!/\.na-pf-tgl\.on,\s*\.na-pred-dir\.on\s*\{\s*background:\s*color-mix/.test(premiumCss),
  "premium.css .na-pf-tgl.on/.na-pred-dir.on no longer swap background via color-mix on select");

// R10a — the command palette's Bloomberg/econ-release/newsletter code chips
// must key off the domain tokens (Macro/Newsletters), not invent their own
// per-type hex (BBG/ECON are Macro-domain label types; SUBS/BREW are
// Newsletters-domain label types, matching feed.css's .g-feed-code.*).
check(/\.mcmdk-code\.bbg\{color:var\(--t-mac,/.test(paletteJs), "palette.js .mcmdk-code.bbg keys off --t-mac, not an invented --t-bbg");
check(/\.mcmdk-code\.econ\{color:var\(--t-mac,/.test(paletteJs), "palette.js .mcmdk-code.econ keys off --t-mac, not an invented --t-econ");
check(/\.mcmdk-code\.substack\{color:var\(--t-amber,/.test(paletteJs), "palette.js .mcmdk-code.substack keys off --t-amber, not an invented --t-sub");
check(/\.mcmdk-code\.brew\{color:var\(--t-amber,/.test(paletteJs), "palette.js .mcmdk-code.brew keys off --t-amber, not an invented --t-brew");

// Dashboard date formatter must include the year — the Legal tile's keyword
// search spans case law from multiple years (legal/js/data.js dates back to
// 2020), so a year-less "14 Mar" is ambiguous between a 2021 case and a 2026
// one. Every other date-stamped list in the app (feed.js fmtDay, nav-actions.js
// fmtDate) includes the year; this one silently didn't. Dashboard now reuses
// feed.js's canonical fmtDay (T9 — one day-header formatter) instead of a local
// reimplementation, so both guards below stand in for the old inline check.
check(/import \{ fmtDay as fmtDate \} from "\/feed\.js/.test(dashboardApp),
  "v2/js/dashboard/app.js reuses feed.js's fmtDay (single source of truth), not a local reimplementation");
check(/export const fmtDay = \(iso\) => \{.*\$\{\+m\[3\]\} \$\{MONTHS\[\+m\[2\] - 1\]\} \$\{m\[1\]\}/.test(feedJs),
  "feed.js fmtDay() includes the year in its output");

// R8 — the mobile-tab active underline's light-mode colour reads the shared
// --chip-ul token (like every other selection marker), not a bare hardcoded
// hex that can drift from the token if it's ever retuned.
check(/\.mtab\.is-active::before\s*\{[^}]*background:\s*var\(--chip-ul,\s*#000\)/.test(premiumCss),
  "premium.css .mtab.is-active::before reads var(--chip-ul, #000), not a bare #000");

// R9 — Credit's listed-vehicle ticker is plain data text, not accent-coloured
// (the sibling .veh-nm vehicle name already reads --t-ink; the ticker had
// drifted to the accent orange, the same bug class as .macro-val above).
check(/\.veh-tk\s*\{[^}]*color:\s*var\(--t-ink,/.test(creditCss),
  "credit/css/styles.css .veh-tk uses --t-ink, not the accent (--t-accent) orange");

// R9/R10 — Credit's data-completeness meter (dm-hi/dm-mid/dm-lo) reuses the
// shared semantic tokens, matching its own .dim-yes/.dim-est/.dim-no/.dim-na
// sibling a few lines below, instead of a one-off green/amber/grey hex triad.
check(/\.data-meter\.dm-hi \.dm-fill\s*\{\s*background:\s*var\(--t-up,/.test(creditCss),
  "credit/css/styles.css .data-meter.dm-hi uses --t-up, not a one-off green hex");
check(/\.data-meter\.dm-mid \.dm-fill\s*\{\s*background:\s*var\(--accent\)/.test(creditCss),
  "credit/css/styles.css .data-meter.dm-mid uses --accent, not a one-off amber hex");
check(/\.data-meter\.dm-lo \.dm-fill\s*\{\s*background:\s*var\(--faint,/.test(creditCss),
  "credit/css/styles.css .data-meter.dm-lo uses --faint, not a one-off grey hex");

// T12 — the IPO table's status pill must not throw/blank the Dashboard tile if
// a future EQ_IPO entry omits `status` (every other field in the same row is
// escaped defensively; `status.toLowerCase()` was the one unguarded access).
check(/dsh-tag-\$\{\(x\.status \|\| ""\)\.toLowerCase\(\)\}/.test(dashboardApp),
  "v2/js/dashboard/app.js ipoHTML() guards x.status before .toLowerCase()");

// R15 — the "Last refresh" tooltip must describe the real five-times-daily
// schedule (05:00/09:00/12:00/17:00/21:00 London), not a stale four-times
// description missing 09:00.
check(/five-times-daily/.test(statusJs) && !/four-times-daily/.test(statusJs),
  "v2/js/status.js describes the five-times-daily refresh schedule, not a stale four-times one");
check(/05:00, 09:00, 12:00, 17:00/.test(statusJs),
  "v2/js/status.js refresh tooltip lists all five London refresh times, including 09:00");

// R12 — home.css must not carry an unscoped .ps-btn.is-active rule: it loads
// after header.css (which correctly draws the active platform tab as an
// orange bottom-border, no fill) in v2/index.html, so an unscoped copy here
// wins the cascade for the live v2 #wire-header and repaints the tab as a
// blue-filled pill. header.css alone owns .ps-btn.is-active.
check(!/(^|\n)\s*\.ps-btn\.is-active/.test(homeCss),
  "home.css does not redeclare an unscoped .ps-btn.is-active (header.css R12 owns it)");
check(/\.ps-btn\.is-active,\s*\.ps-btn\.is-active:hover\s*\{[^}]*border-bottom:\s*2px solid var\(--accent,/.test(headerCss),
  "header.css .ps-btn.is-active is border-bottom-only, no fill");

// R10a — the command-bar's Substack/Brewed/Bloomberg/Econ wire pills must key
// off a real, declared domain token (Newsletters -> --t-amber, Macro ->
// --t-mac), not an undeclared --t-sub/--t-brew/--t-bbg/--t-econ that only
// ever resolves to its var() fallback hex (i.e. a hardcoded per-type colour
// in disguise).
for (const cls of ["substack", "brew"]) {
  check(new RegExp(`\\.cmdk-code\\.${cls}\\s*\\{[^}]*color:var\\(--t-amber,`).test(homeCss),
    `home.css .cmdk-code.${cls} uses the declared --t-amber token, not an undeclared --t-${cls === "brew" ? "brew" : "sub"}`);
}
for (const cls of ["bbg", "econ"]) {
  check(new RegExp(`\\.cmdk-code\\.${cls}\\s*\\{[^}]*color:var\\(--t-mac,`).test(homeCss),
    `home.css .cmdk-code.${cls} uses the declared --t-mac token, not an undeclared --t-${cls}`);
}

// R9 — the Macro checklist's per-dimension score (a data value, e.g. "72/100")
// is plain data text, not accent-coloured (same bug class as .macro-val /
// .veh-tk above; its sibling .ck-dim-n label already reads --ink).
check(/\.ck-dim-s\s*\{[^}]*color:\s*var\(--ink\)/.test(macroCss),
  "macro/css/styles.css .ck-dim-s uses --ink, not the accent (--macro) orange");

finish();
