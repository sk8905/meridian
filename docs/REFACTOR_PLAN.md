# Wire (meridian) — slickness + simplification program

A phased, test-gated program to (1) make the app's interactions feel materially
slicker and (2) shed the scar tissue from iterative feature add/remove — **without a
big-bang rewrite**. The 74-spec suite is the contract: every step ships to `main`
green. This doc is the authoritative tracker; keep it current.

## The two goals, mapped to phases

- **Slickness** = a single layout shell that owns the viewport (kills the recurring
  header/footer/scroll bugs at the root) + a real motion layer. → **Phases 1–2.**
- **Simplification** = componentise pane by pane, factoring shared primitives, which
  is where the duplication and dead code actually get removed. → **Phases 3–4.**

## Guiding principles (non-negotiable)

1. **Incremental, never a big-bang branch.** One pane / one concern at a time.
2. **Test-gated.** Full suite green before every push; add a characterization spec
   for any under-covered user-visible behaviour *before* refactoring it.
3. **Shipped continuously** to `main` (deploys live) — small, reversible commits.
4. **Measured.** Track LOC and bundle size per phase so the simplification is visible.
5. **The specs encode hard-won behaviour** (iOS scroll saga, data-integrity gates,
   dedup, cache discipline). They are assets — preserve them, don't rewrite from zero.

---

## ⚠️ The decision that gates the biggest cleanup: the legacy rollback window

The repo serves **two front-ends**:

- **v2 SPA** (`/v2/…`) — the only surface users see.
- **Legacy multi-page app** (root `index.html`, `credit|legal|macro|menu/index.html`
  + root orchestrators `glance.js`, `nav-actions.js`, `header.js`, `spa.js`,
  `swipetabs.js`, desk `*/js/app.js|charts.js|detail.js`). Every entry route is
  302-redirected to v2 by `_redirects`, but the files are **left in place as a
  one-step rollback** (delete `_redirects` → old app serves again).

Consequence: **~536 KB of legacy JS and large CSS layers are "dead in v2" but
intentionally retained.** The CSS is *shared* by both front-ends, so a selector unused
in `v2/js` may still be live in the legacy app. **Most dead-code/dead-CSS removal is
blocked until the rollback window is closed.**

**OPEN DECISION (owner: product):** close the rollback window? If **yes**, we delete
`_redirects` + the legacy orchestrators + their now-truly-dead CSS (large, safe
reduction). If **no**, we preserve all legacy CSS and clean only v2-specific cruft.
Phases 1–3 proceed either way; Phase 4's size depends on this.

---

## Phase 0 — Audit + safety net ✅ (this doc)

Inventory complete. Spec coverage confirmed broad (74 specs across every surface).
Characterization gaps are filled **per-pane, at migration time** (cheaper and safer
than a big upfront batch). Prioritized findings below.

### 0.1 Dead / retired code (from the dead-code sweep)

- **Legacy orchestrators (~536 KB), retired-by-design** — root `glance.js` (104 KB),
  `nav-actions.js` (73 KB), `swipetabs.js`, `spa.js`, `header.js`; desk
  `credit|legal/js/app.js,charts.js,detail.js`, `macro/js/app.js`. Deletable **only
  when the rollback window closes.** (Do not confuse with the live v2 copies under
  `v2/js/`, or with the desk **data** modules `*/js/data.js|shared.js|content.js`,
  which v2 still imports — keep those.)
- **`functions/api/*.js`** — Cloudflare Pages Functions that duplicate the Worker's
  `/api/*` handlers; never executed under the Worker deploy, yet `postbuild.mjs` copies
  them into `dist/` as **raw served source**. Low-risk quick win: add `functions` to
  the `postbuild.mjs` SKIP set (keep the files for the Pages path; just stop shipping).
- **No dead files, dead functions, or orphaned assets inside `v2/js`** — the live SPA
  is clean. The cruft is the legacy layer + CSS.

### 0.2 Dead / duplicated CSS (from the CSS sweep)

- **Terminal palette duplicated across 4 scopes / 3 files** — the `--t-*` ramp is
  copy-pasted in `feed.css`, `dashboard.css`, `home.css`, plus the `--bg/--surface/…`
  twin in `tui.css`. Any colour tweak needs 4 edits. → **one token layer** (Phase 1).
- **Viewport "magic numbers" scattered & inconsistent** — `--wire-head-h` is never
  defined in CSS and its hardcoded fallbacks disagree (**53 / 54 / 56 / 57 px**);
  `--wire-band-h` (43) and `--wire-bar-h` (34) are two names for one concept; nav
  height is hardcoded `54px`/`5.65rem` in ~8 places; **`100dvh`/`100svh` are never
  used — everything is `100vh`.** → the single app-shell (Phase 1) fixes all of this.
- **Dead CSS blocks, v2-safe to delete now** (self-contained, not legacy-shared):
  `dashboard.css` prototype `.dsh-term-*` (70–110), `.dsh-pane` fallback, `.dsh-ro`
  card grid, `.dsh-heat*`, old `.dsh-yc-*`, `.dsh-sortable/sorted/wkrow/stress*`
  (~120 lines). Verify each against both trees before deleting.
- **Dead CSS gated on rollback close** — `home.css` legacy landing layer (`.g-card*`,
  `.g-ind*`, `.g-cta`, `.g-center`, `.g-authcard`, …), `tui.css` `.tx-tbl`/`.tinv-*`
  old layers, `premium.css` old KPI cards + `theme-toggle`.

### 0.3 Duplication → shared primitives (from the duplication sweep)

Highest-value extractions (feed.js/searchband.js/`credit/detail.js:panel()` already
prove the pattern):

1. **Notifications bell** — ~100 lines duplicated nearly verbatim between
   `credit/app.js` and `legal/app.js` → `notifications.js({apiPath,key,codeLabel})`.
2. **Cloud-sync persistence** (localStorage cache + debounced PUT + union-merge) —
   implemented 3× → `syncStore.js` factory.
3. **Event-delegation primitives** — tab-guard wrapper, `wireRowNav` (click + the iOS
   touch-tap fallback that currently only exists in Profiles), `wireListSearch`,
   `wireAumFocus`. Spreads the iOS tap fix everywhere.
4. **Chip bar + pane switcher** — near-identical in credit/legal/macro/profiles/
   transactions → `chipBarHTML()` + `makePaneSwitcher()` + the `?tab=` seed block.
5. **`multiselect.js`** — `multiFilter` + `ms-pop` plumbing (legal ≡ credit).
6. **League-table primitive** + shared list search header (~8 tables).
7. **Formatting helpers → `/util.js`** — `usdCompact`, AUM-band predicates,
   `quarterOf`, notif-date, `pct1`/`signCls` (several byte-identical). Cheapest, safest.
8. **Secondary row renderers** — `dsh-news-i` list + `nf-row` notification row.

### 0.4 `glance.js` component map (3,097 lines → ~22 seams)

Extraction order (self-contained first, feed/lanes last): **Hero chart band** (≈615–
1135) → **Reading pane** (≈1963–2236) → **X feed** (≈463–614) → **Prediction markets**
→ **right-rail market widgets** (share a small `marketsStore`) → briefing → … →
**news feed + lanes** (most entangled) last.

---

## Phase 1 — App shell (Option 1a)

Build one shell owning the fixed header, the bottom nav, and **a single scroll region**
between them, defined once in modern CSS (`dvh`/`svh` + `env(safe-area)` +
`overscroll-behavior`). Then migrate panes onto it one at a time, deleting their
bespoke scroll/sticky/magic-number code.

- 1.1 **Token layer** — one canonical `--t-*` ramp + surface-lift on `:root`; point
  feed/dashboard/home/tui at it; delete the 4 duplicate copies.
- 1.2 **Viewport tokens** — one `--wire-head-h` (single fallback), unify
  `--wire-band-h`/`--wire-bar-h`, tokenise nav height, switch `100vh`→`dvh/svh`.
- 1.3 **Shell primitive** — header / scroll-region / nav; characterization spec per
  surface, then migrate: briefing (already fixed — fold in), home panes, dashboard,
  desks, profiles, transactions. Delete per-pane viewport math as each moves.
- Exit: the 51 magic-number refs and 13 `getBoundingClientRect` sizings are gone;
  the scroll/header/footer bug class is structurally impossible.

## Phase 2 — Motion (Option 1b)

Additive. View Transitions API for pane/tab changes; skeleton loaders; a shared easing/
duration token set; pull-to-refresh + momentum/overscroll polish; micro-interactions.

## Phase 3 — Reactive components + simplification (Option 2)

Introduce a ~4 KB reactive layer (Preact+Signals or Lit). Migrate pane by pane,
`glance.js` first (per the 0.4 map), extracting the 0.3 shared primitives as we go.
Each migrated pane ships behind its specs. This is where the duplication collapses.

## Phase 4 — CSS consolidation

Retire dead rules (0.2), collapse the duplicated blocks, split the `premium.css`
grab-bag along its seams. Size depends on the rollback-window decision.

---

## Progress log

- **2026-10-01** — Phase 0 complete: audit (3 sweeps) + spec-coverage review; this
  plan written. Baseline: v2 JS ~12,995 lines; CSS ~5,260 lines; 74 specs.
