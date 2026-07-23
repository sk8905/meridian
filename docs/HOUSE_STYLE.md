# Wire — House Style (v2)

The agreed rules for layout, organisation, style/design, and engineering
discipline across the app. This file is the checklist for:
- **(a)** the one-off consistency sweep, and
- **(b)** the daily routine check (consistency + coding bugs), which runs in
  **Fix + report** mode: auto-fix safe violations and clear bugs, deploy, then
  send a short summary and flag anything risky it left for review.

Scope: the v2 SPA (`/v2/`) is the only live surface. The pre-v2 pages are
retired behind edge redirects and are **not** the source of truth — when a
surface exists under `v2/js/`, that ported copy is authoritative (see T9).

---

## 1. Layout & structure

- **R1 — Desktop = fixed-viewport terminal (≥761px).** The whole app is one
  viewport-height flex column; the page itself never scrolls; **only the centre
  wire scrolls internally.** (Bloomberg-terminal model.)
- **R2 — Phone = scrolling document (≤760px).** Content scrolls under pinned
  chrome.
- **R2b — Chrome is anchored and never moves.** The top header strips
  (topbar + ticker + brief) are pinned at the top on every page and breakpoint;
  the footer is pinned to the viewport bottom on desktop; on phone the bottom
  nav/tab bar is `position:fixed` and the signed-in/last-refresh strip sits
  directly above it. None of these scroll with content.
- **R3 — Three-column reading frame** on desktop; **both rails are exactly the
  viewport height** — pinned data panels at top/bottom, no dead grey gap under
  the last panel, and **the rail itself never scrolls.** Only the one designated
  overflow region inside each rail scrolls (left: Top movers `#g-movers`; right:
  Prediction markets `.g-flow-body`), and it *shrinks* to fit rather than pushing
  the rail past the screen. A rail that scrolls as a whole is a bug.
- **R4 — Panels stretch, don't float.** Sibling panels in a column share equal
  height; the last panel grows to fill remaining space (no ragged bottoms).

### Rail contents — what goes where

| Section | Left rail (`.g-side`) | Centre (`.g-feed-wrap`) | Right rail (`.g-side2`) |
|---|---|---|---|
| Home   | Rates band + Top movers (`#g-movers`), panel fills to bottom | Live wire/feed (only scrolling region) | FX matrix (`.g-fx-card`) + Prediction markets (`.na-pred`), stretched to bottom |
| Macro  | Context indicators / snapshot | Wire | Section widgets, filled to bottom |
| Credit | Movers / context | Wire | Section widgets, filled to bottom |
| Legal  | Context / movers | Wire (incl. Case Law list) | Section widgets, filled to bottom |

Rule: **left rail = movers + context; centre = the one scrolling wire; right
rail = FX / prediction markets / section widgets.** Both rails are pinned and
fill to the feed's full height. On phone both rails are hidden (the shared
Markets dropdown carries the same numbers).

---

## 2. The wire (feed) — one engine everywhere

- **R5 — One feed engine, one `.g-feed-row` grid** across Home / Macro / Credit
  / Legal / Palette. No bespoke per-section list markup.
- **R6 — Standard day breaks** on every dated list — the main wire *and*
  sub-lists such as Legal Case Law (`.tw-day`): sans-serif, **10px / 600**,
  uppercase, `.04em` tracking, grey band (`--t-head`), label `--t-accent`
  (dark) / `#2f6cae` (light). No mono, no per-section variants.
- **R7 — Every item is sourced + dated; never fabricated.** Each headline
  carries a real source and link.

---

## 3. Colour — only these tokens, used only this way

All colour flows from `--t-*` tokens, defined light + dark on the panel roots
(`#glance`, `.na-panel`, `.g-main.tui`, `.g-feed-wrap`). **No raw hex in
component CSS** except the documented day-break light label (`#2f6cae`) and the
notification badge red (`#ef4444`).

| Token | Dark | Light | Used for |
|---|---|---|---|
| `--t-ground` | `#000000` | `#e7ebf2` | app background |
| `--t-panel` / `--t-panel2` | `#0d0d0d` / `#191919` | `#ffffff` / `#f3f6fb` | panel surface / hover |
| `--t-head` | `#0a0a0a` | `#f4f7fb` | header bands, day breaks |
| `--t-ink` | `#eaf0fb` | `#131b2c` | primary text / values |
| `--t-dim` / `--t-mut` / `--t-faint` | `#b7c2da` / `#8592ad` / `#5c6a86` | `#3b475f` / `#5e6a84` / `#8b96ac` | secondary → tertiary labels |
| `--t-accent` | `#fb8b1e` | `#fb8b1e` | active / emphasis only |
| `--t-up` | `#3fc08d` | `#0f9d68` | up numbers + ▲ |
| `--t-down` | `#f26d84` | `#df4763` | down numbers + ▼ |

- **R8 — No colour outside this table.** New shades are added as tokens, not
  inline hex.
- **R9 — Semantic red/green** for all deltas and triangles; **orange = accent
  only** (never body text).
- **R10 — One muted grey** for all secondary labels ("Signed in as",
  "Sign out" → `--t-mut`). No one-off greys, no orange labels.

---

## 4. Typography — two families, a fixed scale

- **Sans** (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
  Arial, sans-serif`): prose, feed rows, day breaks, headings, buttons.
- **Mono** `--t-mono` (`ui-monospace, "SF Mono", SFMono-Regular, Menlo,
  Consolas, "Liberation Mono", monospace`): all tabular/numeric data (tickers,
  price columns, FX, prediction %) and the terminal-chrome dropdown panels
  (Markets / Saved / Notifications).
- **R11 — Sizes come from the scale, not ad-hoc px:** 10px (day breaks /
  eyebrows, uppercase), ~10.5px (mono data rows), 12px (panel headers),
  `--fs-content` (body). Numeric columns use
  `font-variant-numeric: tabular-nums`.
- **R11b — No new font family or weight** beyond the two stacks and the weights
  already in use (400 / 600 / 700 / 800).

---

## 5. Chrome & controls

- **R12 — Header buttons:** black background, white text; active state = orange
  bottom border only (no fill, no tint, no UA border).
- **R13 — Identity placement:** desktop → footer; phone → strip above the tab
  bar. Never duplicated across surfaces.
- **R14 — Chips/tabs share one style** (`.tchip` / feed chips); active =
  `is-on` / `is-active`, identical across sections. **On phone, every chip bar
  is the same height — 34px** (the Menu page's `.na-menu-bar`); the wire
  filter-chip bar (`.twire-head`) matches it, so tap targets read identically on
  every tab.

---

## 6. Behaviour & data

- **R15 — Five refreshes per day, London time: 05:00, 09:00, 12:00, 17:00,
  21:00.** Last-refresh reflects the actual slot.
- **R16 — Notifications:** badge = genuinely-unseen count; opening the panel
  shows fresh rows (left accent bar) then marks them seen; no "N New
  Notifications" chrome text.
- **R17 — Cache-first render:** show last-good from cache immediately, then pull
  a live refresh.
- **R18 — Macro commentary coverage:** at least **10 commentary items per day**
  across US + UK, drawn from a broad roster of macro-strategy houses/economists
  (Yardeni, Absolute Strategy, Gavekal, BCA, Capital Economics, Pantheon,
  Oxford Economics, TS Lombard, Alpine Macro, Variant Perception, ING,
  Bloomberg Opinion, Project Syndicate, El-Erian, Authers, …). Real headline +
  source link only; never fabricate (see R7).

---

## 7. Technical rules

- **T1 — Single build version.** One `V` from `import.meta.url` propagates to
  every asset via `vurl()`; bump the `?v=` token on any changed CSS/JS so
  caches bust together.
- **T2 — ES modules, no bundler.** One runtime loads once; each view
  lazy-loads its own CSS array; switching tabs swaps a keep-alive view in
  memory (no document reload).
- **T3 — Full suite green before deploy.** `node tests/run.mjs` (17 specs) must
  pass; any new user-visible behaviour gets a spec.
- **T4 — Zero console/page errors** on every view (enforced by the page-error
  checks).
- **T5 — No horizontal page scroll;** safe-area insets respected; touch targets
  meet the current minimum.
- **T6 — Deploy discipline:** commit → push branch → rebase onto `origin/main`
  → fast-forward `main`. Never stack on already-merged history.
- **T7 — Graceful degradation:** feature-detect browser APIs (e.g.
  `Notification` guarded) so nothing throws when unavailable.
- **T8 — No secrets or model identifiers** in committed artifacts (commits,
  code, comments, PRs).

### 7b — Engineering disciplines (code health)

- **T9 — Single source of truth.** One implementation per concern (one feed
  engine, one chrome, one router). When a surface is ported to v2, edit the
  **v2 copy** under `v2/js/` — never fork behaviour between old and new files.
- **T10 — DRY via shared modules.** Reuse `util.js` helpers (`esc`, `vurl`,
  `wireDays`, feed chips) and the shared engines; don't re-implement.
- **T11 — Escape all interpolated data** (`esc()`) before it enters
  `innerHTML` — no unescaped source strings.
- **T12 — Defensive rendering.** Guard null/empty with explicit empty-states
  and optional chaining; a missing field must never blank a pane or throw.
- **T13 — Idempotent init.** Init-once guards (`if (_inited) return`) so
  re-entering a keep-alive view never double-binds listeners or leaks.
- **T14 — Every fetch has a `.catch`** and degrades to last-good cache; no
  unhandled promise rejections.
- **T15 — Naming conventions.** New code follows existing prefixes (`.g-*`,
  `.na-*`, `.nf-*`, `.tw-*`, `--t-*`) and matches neighbouring style.
- **T16 — No `!important`, no magic z-index.** Use the established token/layer
  system.
- **T17 — Clean up on leave; throttle/debounce** scroll & resize handlers.
- **T18 — Reproduce-then-fix.** When fixing a bug, add or extend a spec that
  would have caught it; keep commits small and single-concern.
- **T19 — A11y basics.** Semantic elements, `aria-label` on icon-only buttons,
  visible focus states.

---

## 8. Data resources & sources

The resources the app draws on, by section. Live market/rates/news data is
pulled by the Cloudflare Worker (`src/index.js`); macro commentary, credit and
legal items are curated in the content/data files
(`macro/js/content.js`, `credit/js/data.js`, `legal/js/data.js`). Every rendered
item keeps a real outbound source link (R7).

### 8.1 Markets & pricing
- Yahoo Finance (`finance.yahoo.com`, `uk.finance.yahoo.com`) — equity, ETF & FX quotes
- Stooq (`stooq.com`) — index & price series
- CNBC quotes (`quote.cnbc.com`)
- Investing.com / Investing.com UK
- MarketWatch
- TradingEconomics
- TradingView

### 8.2 Rates, macro & official statistics
- FRED — Federal Reserve Bank of St. Louis (`fred.stlouisfed.org`)
- U.S. Treasury (`home.treasury.gov`)
- Federal Reserve Board (`federalreserve.gov`)
- Federal Reserve Bank of New York (`markets.newyorkfed.org`) — SOFR
- Bank of England (`bankofengland.co.uk`)
- European Central Bank (`data.ecb.europa.eu`)
- UK Office for National Statistics (`ons.gov.uk`)
- Eurostat / European Commission (`ec.europa.eu`)
- DBnomics (`api.db.nomics.world`)
- S&P Global PMI (`pmi.spglobal.com`)
- ISM (`ismworld.org`)
- TradingEconomics

### 8.3 News wires & financial press
- Bloomberg (`feeds.bloomberg.com`)
- Financial Times (`ft.com`)
- Dow Jones / The Wall Street Journal (`feeds.content.dowjones.io`)
- **Financial News London (`fnlondon.com`)**
- Reuters (via aggregation)
- CNBC (`cnbc.com`)
- The Economist (`economist.com`)
- The Guardian (`theguardian.com`)
- Axios
- NBC News
- MarketWatch
- Google News (`news.google.com`) — aggregation
- Nikkei Asia (`asia.nikkei.com`)
- South China Morning Post (`scmp.com`)
- The Straits Times (`straitstimes.com`)
- City AM
- DealBook — The New York Times (`nytimes.com/section/business/dealbook`)
- MT Newswires (via Koyfin)

### 8.4 Macro strategy & commentary
(Roster behind R18 — ≥10 items/day, real dated pieces only.)
- Yardeni Research
- Absolute Strategy Research
- Gavekal
- BCA Research
- Capital Economics
- Pantheon Macroeconomics
- Oxford Economics
- TS Lombard
- Alpine Macro
- Variant Perception
- ING (`think.ing.com`)
- Bloomberg Opinion (Authers · Dudley · El-Erian)
- Project Syndicate
- Mohamed El-Erian (`mohamedelerian.substack.com`)
- Selected Substacks (`investorama.substack.com`, `debtserious.substack.com`)

### 8.5 Credit, private markets & hedge funds
- Alternative Credit Investor
- Alternatives Watch
- GlobalCapital
- Hedgeweek
- IPE / IPE Real Assets
- Credit Village
- Crowdfund Insider
- Bloomberg Law
- Newswires: Business Wire, GlobeNewswire, PR Newswire
- SEC / EDGAR filings
- Company & sponsor press releases
- Hedge Fund Research (HFR)
- Hedge Fund Monitor
- Aurum
- Nishant Kumar (Bloomberg)
- PE Wire
- Paul Krugman
- Moody's
- S&P (Global Ratings)
- Morningstar

### 8.6 Legal & courts
- UK courts: High Court (Chancery · Commercial · King's Bench · Administrative;
  Business & Property Courts; Insolvency & Companies List), Court of Appeal,
  UK Supreme Court
- The Lawyer (`thelawyer.com`)
- Legal Business (`legalbusiness.co.uk`)
- Bloomberg Law
- Law-firm client briefings

### 8.7 Prediction markets
- Polymarket (`polymarket.com`, `gamma-api.polymarket.com`)
