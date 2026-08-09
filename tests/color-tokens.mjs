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

finish();
