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

## Phase 3 toolchain (how reactive islands work here)

Preact 11 + @preact/signals 2, bundled by Vite into the content-hashed app chunk.
Because the test harness and dev server serve **unbundled source** (where bare
specifiers don't resolve in the browser), an **import map** in `v2/index.html` points
`preact`/`preact/hooks`/`@preact/signals`/`@preact/signals-core` at the served
`node_modules` ESM builds; in the Vite build those specifiers are bundled, so the map
is inert in `dist`/prod. The test harness serves `.mjs` as `text/javascript`
(tests/lib.mjs). Shared runtime: `v2/js/ui.js` re-exports `h`/`render`/`signal`/
`computed`/`effect`/`batch` + a `mount(host, Component)` helper. **Pattern:** replace a
pane's static HTML with a mount point (`data-*-mount`), render a Preact component into
it, and drive state with signals (multiple instances of one signal auto-sync — no
manual DOM updates). No JSX (use `h`), so no transform config.

## Progress log

- **2026-10-01** — Phase 0 complete: audit (3 sweeps) + spec-coverage review; this
  plan written. Baseline: v2 JS ~12,995 lines; CSS ~5,260 lines; 74 specs.
- **2026-10-01** — Quick win: stopped shipping dead `functions/api/*.js` into `dist/`.
- **2026-10-01** — **Rollback window CLOSED** (owner approved). Deleted the legacy app:
  17 files (~536 KB) — root orchestrators `glance.js`/`nav-actions.js`/`header.js`/
  `spa.js`/`swipetabs.js`, desk `credit|legal/js/{app,charts,detail}.js` +
  `macro/js/app.js`, and the 5 entry HTMLs. Kept `_redirects` (now the permanent route
  to v2) and all desk DATA/shared modules v2 imports. Retired 13 obsolete legacy-only
  specs (74→61) whose behaviours are covered on v2 elsewhere; verified full suite green
  (61/61) on source and dist.
  - **Coverage gaps to fill during migration** (behaviours that existed in v2 but whose
    only test was a now-deleted legacy spec): **pull-to-refresh** (`/ptr.js` is wired in
    `v2/js/chrome.js` but has no v2 spec → add one in Phase 2 when PTR is polished) and
    the **live `/api/feed` merge** (manager-merge is covered; the live-wire merge is
    thin → add a characterization spec when the feed pane is componentised in Phase 3).
  - Legacy CSS layers: candidates for **Phase 4**. ⚠️ CORRECTED 2026-10-01 — re-grepped
    the live v2 surface: most of the earlier "dead" list is in fact LIVE
    (`.tinv-*` 15 refs, `.dsh-term` 11, `.dsh-yc` 11, `.dsh-stress` 6, `.dsh-ro` 5). Only
    `.dsh-heat*` (0 refs, isolated block — DELETED) and `.tx-tbl` (0 refs) are genuinely
    dead, and `.tx-tbl` is INTERLEAVED into shared grouped selectors with live
    `.tleague`/`.tx-list`/`.tinv-tbl` (tui.css 245-249, 536-539), so it needs delicate
    per-fragment surgery, not block deletion. Net: the Phase-4 dead-CSS win is much
    smaller than first documented — verify every token against v2 js/html before deleting.
- **2026-10-01** — Phase 1.1: consolidated the `--t-*` palette to ONE declaration on
  `:root` in home.css (the superset: incl. `--t-up/--t-down`, `--t-news`,
  `--t-accent-dim/soft/shadow`). Deleted the redundant per-surface copies in feed.css
  (`.g-feed-wrap`) and dashboard.css (`.dsh`) — a palette change is now one edit, not
  four. Verified every token still resolves on each surface (dashboard `--t-up/down`,
  desk `--t-crd`, etc.) and the UI is pixel-identical; color-tokens spec updated to the
  single-source model. Suite green 61/61. (`--wire-head-h` confirmed still set by
  v2/js/chrome.js, so the legacy deletion didn't affect sticky offsets.)
- **2026-10-01** — Phase 1.2 (part): unified the `--wire-head-h` fallback to a single
  `57px` everywhere (was 53/54/56/57 — the real value is measured at runtime by
  chrome.js; the fallback only shows for the pre-JS flash, now consistent). Switched the
  v2 shell body to dynamic viewport units (`100vh` → `100vh; 100dvh` double-declaration,
  mobile + terminal) so it fills correctly under the iOS URL bar. Suite green 61/61.
  Deferred to Phase 1.3 (built with the shell): merging the `--wire-band-h`(43)/
  `--wire-bar-h`(34) vars — they hold DIFFERENT heights for the home vs desk search
  bands, so they're not a blind rename — and the desktop-only `#glance`/`.tdash`
  `100vh`→`dvh`, handled per-surface as each moves onto the shell.
- **2026-10-01** — Phase 3 bootstrapped: added Preact + Signals, the import-map/MIME
  toolchain, and `v2/js/ui.js`. First island migrated as proof — the Chart⇄X focus
  toggle: two toggle instances now share ONE `focusX` signal (auto-synced; the manual
  sync loop + document click-delegation are gone). Verified in BOTH source (import map
  → node_modules) and bundled dist (Preact in the app chunk). Suite green 61/61; glance
  chunk 91→112 KB (gzip 32→40 KB) for the Preact runtime (one-time cost, amortised
  across every future island). Next islands (per the glance.js map): hero chart, X
  feed, prediction markets, then the right-rail widgets via a shared marketsStore.
- **2026-10-01** — Phase 3 island #2: the prediction-markets pane (right rail) migrated
  to Preact + Signals. `_predList`/`_predFilter`/`_predMoveDir` are now signals; the
  <Predict> component repaints itself on any change — the manual paintPredict innerHTML
  rebuild + per-filter click-handler re-attachment are gone (Preact also escapes text,
  so esc() dropped). Added tests/predictions.mjs as a characterization spec FIRST
  (filled a real coverage gap: chips, default Largest view, row shape, filter switching,
  Top Movers Up/Down) — green on the old code, then on the migrated code, and on dist.
  Suite 62/62.
- **2026-10-01** — Phase 3 island #3: the X feed migrated to Preact + Signals. One
  `_xView` signal ({loading|empty|posts}) drives the <XWire> component; the lazy-boot
  and frugal auto-refresh lifecycle now just set the signal (no innerHTML). Post/quote
  text use dangerouslySetInnerHTML (xLinkify escapes then linkifies); everything else is
  auto-escaped Preact nodes. Cache-seed-on-mount and keep-alive-on-refresh preserved.
  home-xwire (cards, order, reposts, quotes, permalinks, phone reveal, re-entry) green
  on source + dist. Suite 62/62.
- **2026-10-01** — Phase 3 island #4: the HERO CHART BAND brought into the reactive
  model — right-sized, not a full Preact rewrite. The three state atoms (`_heroData`,
  `_heroSel`, `_heroRange`) are now signals; a single `effect(renderHero)` in boot()
  redraws on any change, so the scattered manual `renderHero()` calls (boot, fetchHero,
  each ticker/range click) are gone — mutating a signal IS the redraw. The **range
  toggle** (1D…ALL) is now a Preact island (`HeroRange`, a tablist bound to `_heroRange`);
  its active-state reflection + click wiring left `renderHero`/`wireHeroControls`
  entirely. **Deliberately kept imperative:** the SVG drawing (canvas-like string build
  with its own caching) and the **ticker-row + axes**, because the hover path mutates
  `.g-hero-tk-pct` directly at 60fps — letting Preact own that subtree would fight the
  hover writes for no gain. `heroSelected()` made pure (no signal write) so the effect
  can't self-trigger; the focus-toggle's forced redraw deferred to a microtask so its
  signal reads aren't tracked by the focus effect. home-hero (8-instrument legend,
  curated default overlay, 1D intraday + session verticals, 1W/1Y/ALL axes, end-label
  de-collision, single vs indexed views, 2×2 geometry, phone Chart chip + related news)
  green on source + dist. This is the natural end of the Preact-island sweep for the
  heavy SVG pane — the remaining glance.js work (right-rail market widgets via a shared
  marketsStore) is the cleaner reactive win; the hero's drawing stays imperative by
  design.
- **2026-10-01** — Phase 3 **concluded** (assessment, after reading the right-rail code).
  The planned "right-rail market widgets via a shared marketsStore" island was dropped
  on inspection: `renderRates`/`renderMarketsBand` and the sub-widgets (ticker, movers,
  spreads, vol/risk, yield curve, Hormuz, market-open dots) are ALREADY clean
  `init → fetch → render(el, data) → writeCache` pipelines with instant cache-seed. They
  have none of the problems signals fixed on islands #1–#4 (no scattered manual
  re-renders, no multi-instance sync, no reactive filter state); forcing a signal store
  onto them would ADD complexity to simple code and risk a dense web of live financial
  widgets — the opposite of the "make it simpler" goal. The reactive migration is done
  where it paid off (focus toggle, prediction markets, X feed, hero controls). The feed +
  lanes core stays imperative for now (highest-risk, lowest-reward to churn). Remaining
  Phase-4 CSS cleanup is marginal and delicate (see the corrected note above) — did the
  one safe deletion (`.dsh-heat`); the rest is optional per-fragment surgery.

## Performance work (post-refactor)

Grounded in measured dist sizes: the biggest cost on the primary (Home) surface was
that `glance.js` **statically** imported the three heavy desk data modules
(`credit/js/data.js` 686 KB gz, `legal/js/data.js` 639 KB gz, `macro/js/content.js`
169 KB gz = ~1.5 MB gz / ~4.5 MB raw), so opening Home downloaded + parsed all of it
before first paint even though Home renders only slices.

- **2026-10-01 — RUM beacon (#5).** Added `v2/js/vitals.js` (tiny, dependency-free):
  field-measures FCP/TTFB (iOS ✓), LCP/CLS/INP (Chromium only), and `deskMs` (the
  Home desk-data load, via a `wire:desk` User-Timing measure — works on iOS too), plus
  context (view, nav type, viewport, DPR, connection, PWA). One `sendBeacon` per session
  on first hide. Worker route `/api/vitals` (`handleVitals`) structured-logs one line
  per beacon (no analytics binding; read via `wrangler tail | grep VITALS`). Fired
  fire-and-forget from `runtime.js boot()`. Spec: `tests/vitals.mjs`.
- **2026-10-01 — Home deferred desk-data import (#1).** `glance.js` and
  `manager-signals.js` no longer statically import the heavy modules: they hold empty
  defaults and `loadDeskData()` / `loadManagerData()` dynamically import them AFTER Home
  kicks off its shell + live/API panes (wire, chart, markets, rates, briefing), then the
  desk-derived panes (wire desk base, manager wire, macro snapshot, earnings, refresh
  stamp) render. All readers are in-function with guarded empties, so pre-load Home paints
  the live wire + chart and the curated desk items fill in a few hundred ms later.
  Verified: the glance chunk now `import()`s the data modules dynamically (no static
  `from"/credit/js/data.js"`); home specs + full suite 63/63 on source and dist; `deskMs`
  captured end-to-end.
- **2026-10-01 — Compact Home data slice (#2).** `scripts/gen-home-data.mjs` (first step
  of `npm run build`) projects the full credit/legal/macro modules down to the fields
  Home + the manager wire actually render, stripping the heavy profile/detail bodies Home
  never shows (manager `sources`/`book`/`description`/…; deal/intel `summary`; legal
  `summary`/`points`/`tags`; fund `description`/`sources`/…; `firmById` → just names;
  macro kept whole). Home + manager-signals now import the one generated `/home-data.js`
  (tokenless + no-cache, in `_headers`/`sw.js` DATA_PATHS + precache, SW bumped v8→v9)
  instead of the three full modules: **~1.5 MB gz → ~0.47 MB gz on Home (~3.2×, ~1 MB gz
  saved).** Regenerated on every deploy so it stays in sync with the 5×/day refresh
  (documented in HOUSE_STYLE T2 + refresh-routines). Desk views still import the full
  modules (unaffected). Full suite 63/63 on source + dist. **Next perf levers (not done):**
  record-cap the slice to a recent window for a further cut; split the monolithic desk
  data by sub-dataset for the desk views; per-route CSS split (the 336 KB / 57 KB-gz
  bundle is render-blocking); consolidate the ~11 Home `/api/*` calls into a snapshot.
