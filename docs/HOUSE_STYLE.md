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
  wire scrolls internally.** (Bloomberg-terminal model.) **Exception — the Home
  5-column wire terminal (markets rail · [2×2 centre] · X wire · macro rail)
  needs real width for its centre, so it only engages at
  ≥1201px; from 761–1200px (iPad mini/Air/Pro-11 landscape) Home uses the
  single-column chip-swap layout instead** (News · Managers · Chart · X Feed), which
  is what the phone uses — otherwise the two middle wires crush to ~50px and the
  headlines wrap one word per line. **From 1201–1500px (iPad Pro 12.9″ landscape,
  small laptops) the five columns still squash the two flexible centre columns to
  ~220px, so the terminal collapses to FOUR columns: the Chart/Reading region and
  the X feed share one column, chosen by a small header toggle (`.g-focus-tog`) that
  defaults to Chart/Reading. All five columns return at ≥1501px, where the toggle is
  hidden.** The other desks (Macro/Credit/Legal) are
  single-column and keep the ≥761px terminal.
- **R2 — Phone = scrolling document (≤760px).** Content scrolls under pinned
  chrome.
- **R2b — Chrome is anchored and never moves.** The top header strips
  (topbar + ticker + brief) are pinned at the top on every page and breakpoint;
  the footer is pinned to the viewport bottom on desktop; on phone the bottom
  nav/tab bar is `position:fixed` and the signed-in/last-refresh strip sits
  directly above it. None of these scroll with content.
- **R2c — On phones (≤760px) search is a header magnifier, not a body row.**
  The full-width "Search everything" band (`.wire-band`) is hidden on phones and
  replaced by a magnifier button in the header action cluster (`#na-search`,
  `data-open-search` → the global command palette), reclaiming a whole row — so
  the wire tabs pin directly under the header (`--wire-band-h` is zeroed on
  phones, collapsing the sticky-stack offsets). Tablet + desktop (>760px) keep
  the body band and carry no magnifier.
- **R3 — Four-column reading frame on Home** (desktop): markets rail
  (`.g-side`) · aggregated feed (`.g-feed-wrap`) · manager wire (`.g-side3`) ·
  macro rail (`.g-side2`). **Every rail is exactly the viewport height** — pinned
  panels at top/bottom, no dead grey gap under the last panel, and **the rail
  itself never scrolls.** Only the one designated overflow region inside each
  scrolls (left: Top movers `#g-movers`; manager wire: `.g-mw-body`; right:
  Prediction markets `.g-flow-body`), and it *shrinks* to fit rather than pushing
  the column past the screen. A rail that scrolls as a whole is a bug. On phone
  the columns stack (feed → manager wire → markets → macro).
- **R3a — Reading pane: auto-open once per load; keyboard-cyclable** (desktop). On a
  fresh view the pane **auto-opens the most-recent openable story** — but only **once
  per page load** (`syncReadDefault` sets a flag). An in-session re-render (the
  background/live refresh, a lane switch) must **never re-jump** the pane off what the
  reader is on; a hard refresh, or a reopen that reloaded for newer content, re-imports
  the module so the flag resets and the latest opens again. The reader also opens a
  story by clicking a row, or by cycling the feed with the **↑/↓ arrow keys** (clamps at
  the ends — no wrap; visible rows only; ignored while typing in a field). Selecting a row sets
  `.is-reading` and renders it in `#g-readpane`. Rows are `<a>` links, so arrow-focus
  must not paint the browser's default outline — the `.is-reading` accent marker is the
  indicator. **Reader loads must never hang or stall:** `/api/read` is fetched through
  `_fetchRead`, which (a) memoises the result per page load in `_readMem` (instant
  re-opens; shares one request with any prefetch in flight) and (b) carries a 25s abort
  timeout so the pane always resolves to the body or the "open the original" fallback —
  it can never stick on "Fetching the full text…". `prefetchTopReads(3)` pre-warms the
  top openable stories (in-memory **and** the edge cache) on each wire render, desktop
  pane only, so the auto-open and the first ↑/↓ clicks are instant. On phone, the in-app
  reader has an **interactive iOS-style left-edge back gesture**: a drag that starts within
  ~30px of the left edge moves the whole reader **with the finger** (`translateX` tracks 1:1);
  released past ~⅓ of the width — or on a quick flick — it slides out and closes, otherwise it
  springs back. It is horizontal-only (a vertical move hands the gesture straight back to the
  body scroll) and resolves even if `transitionend` doesn't fire (a timeout fallback).
- **R3b — Reading-pane images: charts & data only.** The reader (`extractReadable` /
  `proxyBlocks`) includes an image **only when it is a chart / data-visualisation** — a
  known chart-service CDN (`READ_IMG_CHART_HOST`: datawrapper, flourish, infogram,
  quickchart, highcharts, …) or a chart/figure/data word in the image URL or its
  alt/caption (`READ_IMG_CHART_RE`). **Every photo, portrait, stock image, logo, icon
  and social-card (og:image) hero is dropped**, however descriptive its alt — publisher
  "story images" are overwhelmingly decorative and the junk is not worth the rare real
  photo. Erring toward dropping a real chart beats showing one junk photo. **Embedded
  tweets/X posts are unaffected** — they ride the `{tweetId}` path, not the image path.
- **R3c — Reader text: strip the page furniture, keep the prose.** The reader removes
  publisher chrome from both the direct-HTML (`_readBlocks`) and markdown-proxy
  (`proxyBlocks`) paths: a **leading** recirculation strip (`_stripLeadingJunk` — "most
  read" / headline fragments above the article), **bodyless nav-menu headings**
  (`_dropBodylessHeadings`), per-line boilerplate (`READ_BOILER` — subscribe/CTA/cookie/
  author-bio/photo-credit lines), and a **trailing footer/sponsor strip**
  (`_stripTrailingJunk`). The trailing strip is the mirror of the leading one: it walks
  **back** from the end over a **contiguous run of junk-like blocks** — dangling headings,
  short headline fragments, **footer-signature** lines (`READ_FOOTER` — a
  company-registration blurb, "Registered office / in England No.", a `©`-year line,
  "all rights reserved", a "Website by…" / "…marketing by…" build credit) and
  **newsletter / app-download / follow-us promo** lines (`READ_PROMO` — "sign up", "in
  your inbox", "Get the <brand> app", "Join our channel…", "Week in Review") — and stops
  at the last real (terminally punctuated) body sentence, dropping the whole run. It is
  **doubly guarded**: it fires only when (a) a real body paragraph exists before the run
  **and** (b) the run actually carries a footer/promo signature — so a clean article (or
  one that merely ends on a short heading) is never touched, real prose after a mid-article
  CTA is never cut, and live prose that says "registered in Delaware" or names a year is
  never truncated. Any extraction change
  must bump the `read.internal/vN` edge-cache key so the edge re-extracts.
  **Prose is left-aligned, never justified** — both the reader body (`.g-read-p`) and the
  briefing prose (`.g-hbrief-b`/`.g-hbrief-bt`) use `text-align:left` with `hyphens:none` and
  greedy wrapping (`text-wrap:wrap`), so lines fill the full width (use all available space)
  and break ragged-right — no justified rivers, no `text-wrap:balance`/`pretty` short lines.
- **R3d — Reader bodies are edge-cached, never browser-cached.** `/api/read` stores the
  extraction on the **edge** (`caches.default`, `max-age=3600`) so re-reads are instant, but
  the response returned to the **browser** is `Cache-Control: no-store` on both the cache-hit
  and fresh-render paths, and the client fetches it with `cache:"no-store"`. A
  browser-cached reader body would replay the **pre-deploy** text for up to an hour — and the
  iPhone PWA (the primary surface) has **no hard-refresh** to bust it — so a reader fix would
  never reach the user until the body expired. Keep both halves: edge-cache for speed,
  no-store to the browser for freshness. (This is why bumping `read.internal/vN` alone is not
  enough — the key only governs the edge copy, not the browser's.)
- **R3e — Reader speed: global pre-warm + client prefetch.** First opens must not wait on a
  cold fetch. Three layers: (1) the client memoises per load and **prefetches the top 6
  stories** on every wire render, both surfaces (`prefetchTopReads` — warms the viewer's own
  edge colo); (2) a **15-min cron** (`prewarmReads`) extracts the day's top stories into
  **global KV** so a first open is instant *everywhere*, even a cold colo — and it is
  **direct-fetch only**, so it spends **zero** Firecrawl/Jina proxy quota on a schedule
  (bot-walled sources stay on the on-demand path); (3) `handleRead` checks KV on an edge miss
  and repopulates the local edge. The edge key and the KV key share one version constant
  (`READ_VER`) — **bump it on any extractor change** so both invalidate in lockstep.
- **R4 — Panels stretch, don't float.** Sibling panels in a column share equal
  height; the last panel grows to fill remaining space (no ragged bottoms).

### Rail contents — what goes where

| Section | Left rail (`.g-side`) | Centre (`.g-feed-wrap`) | Manager wire (`.g-side3`) | Right rail (`.g-side2`) |
|---|---|---|---|---|
| Home   | Rates band + Top movers (`#g-movers`), panel fills to bottom | Live wire/feed (a scrolling region) | Watchlist-first manager activity (`.g-mw-body` scrolls) | FX matrix (`.g-fx-card`) + Prediction markets (`.na-pred`), stretched to bottom |
| Macro / Credit / Legal | — (rails removed) | Wire (incl. Case Law list on Legal), full width | — | — (rails removed) |

Rule: **on Home, left rail = movers + context; centre = the one scrolling
wire; right rail = FX / prediction markets.** Both Home rails are pinned and
fill to the feed's full height; on phone both are hidden (the shared Markets
dropdown carries the same numbers). **Macro/Credit/Legal are single-column:**
`.tcol-l`/`.tcol-r` are `display:none` platform-wide (see `tui.css`) and the
central wire owns the full width on every viewport — there are no data rails
to keep pinned/full-height on these three sections.

---

## 2. The wire (feed) — one engine everywhere

- **R4c — Newswire content scope (the inclusion rule — STRICT).** The newswire
  carries ONLY these four kinds of item; anything else is off-universe and must
  not appear:
  1. **Macro-economic news relating to the G7 + the Eurozone + other major European
     economies** — the G7 (US · UK · Canada · France · Germany · Italy · Japan), every
     **euro-area** member (Austria, Ireland, Spain, Netherlands, …) and the rest of
     **developed / EU / EFTA Europe** (Switzerland, the Nordics, Poland, Czechia, …),
     plus the **ECB / Eurozone** aggregate. OUT = all **non-European** geographies
     (Hong Kong, Singapore, China, India, Brazil, Australia, …) AND **non-EU/EFTA
     Europe** (Russia, Ukraine, Belarus, Turkey, Serbia).
  2. **News relating to managers / hedge funds that are covered in the app** —
     ALL of them (the `credit/js/data.js` managers + `HEDGE_FUNDS` rosters),
     **whatever their AUM** (a covered mega-manager's news still qualifies). A
     **NEW** manager/hedge fund is brought into coverage **automatically ONLY when
     its AUM is $1bn–$15bn**; one outside that band is added only on the owner's
     explicit request (rule 4).
  3. **News relating to law firms that are covered in the app** — ALL of them
     (`legal/js/data.js` `firmById`). A **NEW** firm is brought in automatically by
     the Legal desk's Big-Law relevance criterion (firms have no AUM, so the
     $1–15bn band does not apply); otherwise only on explicit request.
  4. **Anything the owner has explicitly asked to be included** (which can override
     the $1–15bn band — e.g. to add a specific sub-$1bn or >$15bn name).

  **Enforcement.** Rule 1 is enforced automatically in the Worker: `feedQualityKeep`
  drops any headline **led by an out-of-scope country** via `FEED_OFFTOPIC_GEO` (the
  economic-print pattern — "Hong Kong retail sales …", "Russia's inflation …"), so it
  fires even on a premium source like Investing.com Economics. An out-of-scope country
  that ever leaks is a missing entry in that denylist — add it. Rules 2–3 are **editorial / roster-driven**: the
  curated feeds are scoped to the right verticals (private credit, PE, Big Law), but
  a headline's subject can't always be auto-judged (a new manager's AUM isn't in its
  headline), so the 5×/day refresh routine and the rosters are the gate. A covered
  entity's news always qualifies; the **$1–15bn band governs only the routine's choice
  of which NEW managers/hedge funds to add on its own initiative** — not what's kept
  for an already-covered name. When an off-universe entity leaks, either it genuinely
  belongs (add the entity) or the source/query is too broad (tighten it). Rule 4 is
  editorial. **When in doubt, leave
  it out** — the wire is a curated universe, not a general feed.
- **R5 — One feed engine, one `.g-feed-row` grid** across Home / Macro / Credit
  / Legal / Palette. No bespoke per-section list markup.
- **R6 — Standard day breaks** on every dated list — the main wire *and*
  sub-lists such as Legal Case Law (`.tw-day`): the micro scale step **10px /
  600**, uppercase, `.04em` tracking, grey band (`--t-head`), label `--t-accent`
  (dark) / `#2f6cae` (light). One font (mono, like everything), no per-section
  variants.
- **R7 — Every item is sourced + dated; never fabricated.** Each headline
  carries a real source and link.
- **R7a — No decorative link/arrow glyphs.** Do NOT append arrow symbols (`↗`,
  `→`, `➚`, `»`, or a CSS `::after` external-link arrow) to links or source
  markers anywhere in the app. Link the text itself; for an inline source marker
  use a plain `src` label (see `.dsh-src`). Arrows are visual noise and are not
  used.

---

## 3. Colour — only these tokens, used only this way

All colour flows from `--t-*` tokens, defined light + dark on the panel roots
(`#glance`, `.na-panel`, `.g-main.tui`, `.g-feed-wrap`, `.dsh`). **No raw hex in
component CSS** except the documented day-break light label (`#2f6cae`) and the
notification badge red (`#ef4444`).

> **Token scope is per-surface, not global.** The `--t-*` tokens are *class-
> scoped* to the roots above — they do **not** cascade from `:root`. Any NEW
> top-level surface (its own view container) must declare its own light+dark
> token block, or every `var(--t-*)` inside it resolves to nothing — invisible
> bars, black-on-black text. The Dashboard (`.dsh`) learned this the hard way;
> mirror `feed.css`'s `.g-feed-wrap` block (and add `--t-up`/`--t-down`, which
> `feed.css` omits) for any future surface.

| Token | Dark | Light | Used for |
|---|---|---|---|
| `--t-ground` | `#141414` | `#e7ebf2` | app background |
| `--t-panel` / `--t-panel2` | `#141414` / `#202020` | `#ffffff` / `#f3f6fb` | panel surface / hover |
| `--t-head` | `#111111` | `#f4f7fb` | header bands, day breaks |
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
- **R10a — Feed labels: colour = domain, text = type.** The wire pill
  (`.g-feed-code`) is the ONE place a non-delta colour carries meaning. Its
  **colour encodes the domain** (which desk the item belongs to) and its **text
  encodes the type** (what kind of item it is). One domain = one token, reused for
  every type within it — a Credit `DEAL` and a Credit `RAISE` are both `--t-crd`;
  a Hedge `DEAL` is `--t-hdg`. **No per-type hex** (this retires the old ad-hoc
  `deal`/`fund`/`case`/`scheme`/`rp` label hexes). Domain colour tokens:

  | Domain | Token | Label types (text) |
  |---|---|---|
  | Newsletters | `--t-amber` | `LTR` · `SUBS` · `BREW` |
  | myFT | `--t-ft` | `myFT` |
  | Macro | `--t-mac` | `NEWS` · `COMM` · `FI` (fixed-income sources, e.g. Bond Vigilantes) (+ `BBG`/`ECON` macro wires) |
  | Credit | `--t-crd` | `NEWS` · `DEAL` · `RAISE` |
  | Hedge funds | `--t-hdg` | `NEWS` · `DEAL` · `RAISE` · `13F` |
  | Legal | `--t-lex` | `NEWS` · `ALERT` · `CASE` |
  | (neutral) | `--t-news` | `NEWS` — item not in any desk above |

  `--t-hdg` (`#4aa3f0` dark / `#1f6fd0` light) is a named token (promoted from
  the old raw hex).
  **Reading-pane entity links.** In the in-app reader body ONLY (never the wire
  feed), a named tracked entity — manager, hedge fund or law firm — is linked to
  its Wire profile (`/v2/profiles/#/manager|hf|firm/<id>`), rendered **bold + the
  blue `--t-link` token** (`#5aa6f2` dark / `#1f63c9` light; `.g-ent`). This is a
  distinct role from the orange accent link (`--t-accent`, used for CTAs / "Open
  original"). The index is built in `glance.js` (`linkEntities`) from the Home
  slice rosters (`managers`, `hedgeFunds`, `firmById`); full names link, plus a
  distinctive de-suffixed alias, with ambiguous terms disabled.
  **Every wire row carries a label**; anything not clearly classifiable is `NEWS`
  in the neutral domain. The label engine (`feed.js`) resolves colour from the
  item's `dom` (domain) and text from its `desk` (type) — see its "Desk
  vocabulary" header.

---

## 4. Typography — ONE family, a fixed 5-step scale

- **One font everywhere** — the whole app renders in a single sans family,
  **Gotham**, self-hosted via **Montserrat** (the openly-licensed geometric
  stand-in; the two woff2 under `/fonts/` are the only swap point for licensed
  Gotham web fonts). It is exposed through the historic **`--t-mono`** token
  (`"Montserrat", "Gotham", "Futura", "Century Gothic", system-ui, sans-serif`) —
  the name predates the switch and is kept only to avoid a repo-wide rename; it no
  longer means monospace. Every piece of text — prose, feed rows, list names,
  headings, buttons, day breaks AND all tabular/numeric data — is this one family.
  The `@font-face` (one variable-weight file per subset: `latin`, `latin-ext`)
  lives at the top of `premium.css`; the base `body` font-family (app.css,
  home.css, and each section's `styles.css`) is `--t-mono`, so everything inherits
  it. Numeric columns keep `font-variant-numeric: tabular-nums` so figures stay
  column-aligned in the proportional face. Vite fingerprints the woff2 into
  `/assets/`; `v2/index.html` preloads the `latin` file so the first paint is
  already in the real face (no swap flash).
- **R11 — Sizes come from ONE flat 5-step scale, driven by a SINGLE knob.** Each
  step is a grid token (`--fs-micro/-body/-head/-title/-hero`, in premium.css)
  equal to its base px **plus one shared offset, `--fs-adj`**. Every element that
  sets a size points at a grid token (or a semantic alias — `--fs-content`,
  `--fs-card-title`, … — which resolve to one), so changing `--fs-adj` alone
  resizes the **whole app**, phone and desktop, with layout untouched.

  | token | base px | `--fs-adj:-0.5px` → | used for |
  | --- | --- | --- | --- |
  | `--fs-micro` | 10px | **9.5px** | day breaks · eyebrows · column heads · timestamps · source tags · SRC chips |
  | `--fs-num` | 11px | **10.5px** | numeric DATA — rail/table/FX values, changes, prices, %; one notch under body so tall lining figures don't dominate the text beside them. Text row-labels (names, codes, dates, moods) stay `--fs-body`. |
  | `--fs-body` | 12px | **11.5px** | THE default — prose, feed headlines, list & table row text, reading pane, buttons |
  | `--fs-head` | 14px | **13.5px** | card / panel headings, section sub-heads |
  | `--fs-title` | 16px | **15.5px** | page / article headline (h1) |
  | `--fs-hero` | 26px | **25.5px** | dashboard KPI display figures only |

  `--fs-adj` is currently **-0.5px** (the scale reads 9.5/11.5/13.5/15.5/25.5); set
  it to `0px` for the original 10/12/14/16/26. Body text is one size on phone AND
  desktop — identical. The old per-device `--fs-bump` is **retired** (kept defined
  at `0`). **Never hand-write a px font-size** — always reference a grid token, so
  the knob reaches it; this binds every NEW surface too (mobile tap-lists, option
  rows, drill headers, empty states). A tappable row is still a **body** list row
  (padding gives the touch target, not font-size). Pin any new body surface in
  `tests/type-scale.mjs`, which reads `--fs-adj` live so it tracks the knob.
- **R11b — No SECOND font family, and only the weights already in use** (400 / 500 /
  600 / 700 / 800; Montserrat ships them all in one variable file). 500 is the
  inactive-chip/label weight, paired with 600 for the active state. Hierarchy comes
  from **size + weight + case + colour**, not from a second font.

---

## 5. Chrome & controls

- **R12 — Header buttons:** black background, white text; active state = orange
  bottom border only (no fill, no tint, no UA border).
- **R13 — Identity placement:** desktop → footer; phone → strip above the tab
  bar. Never duplicated across surfaces.
- **R14 — Chips/tabs share one style AND one height.** Active = `is-on` /
  `is-active`, identical across sections. **Every filter/tab chip is the same
  height, set by the single global token `--chip-h` (34px — slim but comfortable,
  never cramping the label).** All chip rows read it: `.g-feed-chips` /
  `.g-feed-subchips` / `.g-feed-head` (Home & desk feed filters), `.na-chips`
  (header panels), `.twire-head` / `.tchip` (dashboard & detail tabs),
  `.g-pred-fchip` (prediction filters). Never hard-code a chip height — bind to
  `var(--chip-h, 34px)` so a single edit moves them all in lockstep. A chip that
  sets its own height (30px feed chips, padding-sized pred chips) is a bug: it
  reads uneven next to the others on iPhone.

- **R14a — The selected chip always shows its underline, one identical marker.**
  The active tab/filter chip is marked by a **2px bottom underline** in
  `--chip-ul` — **black in light, white in dark** (`--chip-ul` is set once,
  globally, in `premium.css`) — drawn with **two shadow layers so it lands flush
  ON the row's 1px divider** and never floats a pixel above it (the old
  "double-line" look): `box-shadow: inset 0 -2px 0 var(--chip-ul), 0 1px 0
  var(--chip-ul)`. This exact declaration is the ONE selection marker across every
  tab row app-wide — the Menu chip bar, the `.twire-head` tab rows (Profiles,
  Macro, Transactions, detail section-nav), the dashboard nav, the Home wire tabs
  (`.g-wiretab`) — so no tab row ever reads heavier or thinner than another. The
  base `.tchip.is-on` rule carries it; do NOT re-declare a one-layer variant per
  surface. Always give BOTH layers a theme-aware fallback (`var(--chip-ul, #000)`
  in light, `var(--chip-ul, #fff)` under `[data-theme="dark"]`): a bare
  `var(--chip-ul)` with no fallback becomes an invalid declaration the moment the
  token is missing from a scope, and the whole underline silently vanishes. The
  **bottom tab bar's active marker** (`.mtab.is-active::before`, a 2px *top* line
  over the selected nav tab) is the ONE deliberate exception (owner's call): in LIGHT it still reads
  `--chip-ul` (black) like the rest of the family, but in DARK
  the selected tab's **2px top MARKER** is Wire orange (`[data-theme="dark"]
  .mtab.is-active::before` → `var(--accent, #fb8b1e)`) while the **icon AND label stay
  white** (`[data-theme="dark"] .mtab.is-active` → `var(--ink)`). Only the marker is
  orange — do NOT neutralise it back to `--chip-ul`, and do NOT let the orange bleed onto
  the icon or label. Every OTHER tab row stays on `--chip-ul` per the rule above.

---

## 6. Behaviour & data

- **R15 — Five refreshes per day, London time: 05:00, 09:00, 12:00, 17:00,
  21:00.** Last-refresh reflects the actual slot.
- **R16 — Notifications:** badge = genuinely-unseen count; opening the panel
  shows fresh rows (left accent bar) then marks them seen; no "N New
  Notifications" chrome text. **Law-firm "advised" deal announcements are
  suppressed from the bell** (they remain in the legal feeds — a silent
  addition) **unless the headline names a manager / hedge fund the app covers**,
  in which case the notification stays. See `saved.js` `_suppressedAdvised`.
  **Case law is delivered silently too** — it stays in the Legal desk/feeds but
  is kept out of the bell **unless a party to the case is a fund or manager the
  app covers** (same covered-entity relevance). See `saved.js` `_caseInBell`.
- **R17 — Cache-first render:** show last-good from cache immediately, then pull
  a live refresh.
- **R18 — Macro commentary coverage:** at least **10 commentary items per day**
  across US + UK, drawn from a broad roster of macro-strategy houses/economists
  (Yardeni, Absolute Strategy, Gavekal, BCA, Capital Economics, Pantheon,
  Oxford Economics, TS Lombard, Alpine Macro, Variant Perception, ING,
  Bloomberg Opinion, Project Syndicate, El-Erian, Authers, …). Real headline +
  source link only; never fabricate (see R7).
- **R19 — On-device personal data stays on-device.** The LinkedIn-connections
  importer (menu ▸ Network, `v2/js/network/store.js`) parses the user's
  `Connections.csv` **in the browser**, keeps only rows that match a roster
  entity (manager / hedge fund / law firm), and persists them in `localStorage`
  (`wire.li.v1`) — never to the Worker or any third party. There is no fetch in
  that module. Any future personal-data import must follow the same rule:
  client-side parse, minimal on-device persistence, no egress.
- **R20 — No explainer / legend / methodology prose in the UI.** The terminal
  shows data, not instructions about the data. Do **not** add caption blocks that
  (a) define abbreviations or tag codes (a legend like "CONT: continuation fund ·
  SEC: secondary sale …", "PEP = profit per equity partner", "13D = activist"), or
  (b) explain methodology / provenance in prose ("approximate, latest reported",
  "there is an inherent filing lag", "each links its source", "illustrative not
  exhaustive"). Make an abbreviation self-evident, or expose its meaning through a
  native `title=` tooltip on the header/cell/chip — never a paragraph under the
  table. **Kept by exception** (these are not legends): a short *visual key* needed
  to read a chart (the heatmap green/red direction, a solid/dashed line key); a
  genuine *disclaimer / disclosure* (legal "not advice", the AI-generated-summary
  note); and a one-line *interaction affordance* ("Tap a row for detail"). The
  source-citation is separate and stays — every data item still links its source
  (R7), but the citation lives on the row/figure, never as a methodology caption.
  A long entity-level "Sources: …" note collapses into a single **`Sources`**
  disclosure (`.tdet-src-det`, `srcDetails()` in the detail views) that expands to
  the links — the citation is preserved (R7), the prose is off-screen until asked.
- **R21 — Manager profile: tabs + investments.** A manager profile's tabs are
  **News · Vehicles · Investments · Business** (`viewManager`, `v2/js/credit/detail.js`).
  *Vehicles* merges funds, CLOs and listed BDC/CEF vehicles into one tab (labelled
  groups). *Investments* lists the manager's deal activity **drawn only from the
  news we've surfaced** (`INVEST_TYPES` over `deals`), each tagged **debt vs equity
  and a sub-type** (senior / mezz / RCF / acquisition / unitranche / structured;
  pref / ordinary / structured / minority). The tag comes from a **curated**
  override on the deal (`instrument` = "Debt"|"Equity", `instrumentType` = string)
  where verified against the article; otherwise it is **auto-derived** from the
  deal's own type + the wording of the surfaced article, asserting a class only on
  an explicit signal and a sub-type only when named — anything unclear stays
  *Type unspecified* (never guessed). Auto-derived tags carry a `~` marker; every
  investment links its source so the label can be checked (R7). Ongoing curation of
  `instrument`/`instrumentType` is a daily-refresh task (see refresh-routines).
- **R22 — European credit universe (Transactions ▸ Credits).** The Credits sub-tab
  (`credit/js/eu-credits.js` → `EUR_CREDITS`, rendered in `v2/js/transactions/app.js`)
  lists the ~300 European leveraged-loan / CLO obligors **by sector** with their
  current **issuer rating**, its **borrower jurisdiction** and a **12-month rating
  trend** (▲ up / ▼ down / – unchanged), anchored to the Morningstar European
  Leveraged Loan Index (ELLI). The constituent list + ratings are proprietary, so
  the roster is **compiled incrementally from public rating actions** — every row
  real + sourced (R7), one **rating agency kept consistent** across the whole roster
  (`EUR_CREDITS_META.agency`). Never invent a name or a rating: an unknown rating is
  left off (shows "NR"), and the empty roster shows an honest "being compiled"
  state — never fabricated placeholders. `jurisdiction` is the borrower's country of
  domicile; `trend` is the S&P rating's net direction over the trailing 12 months
  and is `"up"`/`"down"` only against a verified rating change in that window,
  `"flat"` otherwise. Growing it is a daily-refresh task.
- **R23 — BDC roster (Transactions ▸ BDCs).** The BDCs sub-tab
  (`credit/js/bdcs.js` → `BDCS`, rendered in `v2/js/transactions/app.js`) lists the
  largest US business development companies, split **listed** vs **interval/private**
  (non-traded, perpetual-life). Every financial figure — total assets / net assets /
  portfolio, NAV per share, non-accruals (at fair value AND cost), and, for
  non-traded funds, the quarterly repurchase cap / requested %% / prorated ("gated")
  flag — is **certifiable only (R7)**: it carries a real dated SEC filing / IR
  source, and an unverified field is `null` and renders "n/a" (never a guess or a
  proxy passed off as the real figure; net assets or portfolio FV shown in place of
  total assets are explicitly labelled). Static identity (name/ticker/exchange/
  manager/CIK/structure) is public fact. The **listed price÷NAV ratio is live**,
  computed client-side from `/api/quotes` (Yahoo last trade) ÷ the reported NAV — it
  is not stored. Refreshing the figures each quarter (new 10-Q/8-K season) and the
  live-price wiring are daily-refresh concerns; enforced by `tests/bdcs.mjs`.

- **R24 — Profile Peers.** Every Profiles detail page (managers, hedge funds,
  investors, law firms) carries a **Peers** dropdown of **3–5 similar entities**
  from the **same roster**, ranked by strategy/practice-area overlap and AUM/size
  proximity (`v2/js/peers.js` → `peersOf` + `peerDetails`; each detail view in
  `v2/js/credit/detail.js` / `v2/js/legal/detail.js` maps its own fields into the
  generic tags·category·size shape). It is a **collapsible `<details>` in the
  identity header**, using the same `.tdet-src-det` chrome as the Sources line and
  sitting **above** the LinkedIn-connections and Sources dropdowns. Peers are
  **computed from real roster data, never hand-curated** — so a peer is always an
  entity that exists and its link opens that entity's own profile
  (`#/manager|hf|lp/<id>`, `#/firm/<enc id>`); no fabricated names, no dead links
  (R7). Each row shows the peer's name + a one-line rationale (a shared strategy /
  its size). Enforced by `tests/profile-peers.mjs`.

- **R25 — Market-sizes matrix (Dashboard ▸ Macro).** The Macro dashboard carries a
  **Market sizes** matrix (`MARKET_SIZES` in `macro/js/content.js`, rendered by
  `marketSizesHTML` in `v2/js/dashboard/app.js`): four asset classes (public
  equities, private equity AUM, public fixed income, private credit/debt) each
  broken into **US · Europe · Asia · Global**, with the latest size and a
  **1Y/5Y/10Y trend arrow** (▲ up · ▼ down · – flat). **Certifiable only (R7):**
  every size carries a real dated source and, where the reported basis matters, a
  scope `note` (tooltip); a size not cleanly published on a comparable basis is
  `null` and renders "—" while its arrows stay (each independently sourced). Sizes
  are the freshest single reported figure per cell; regions are NOT expected to sum
  to Global (different compilers/coverage). Refreshing each figure from its source's
  latest annual/quarterly release is a daily-refresh concern. Enforced by
  `tests/dashboard-heatmaps.mjs`.

- **R26 — X wire (Home).** The Home terminal carries an **X wire** in its **own
  rail, between the manager wire and the macro rail**, topped by a **pinned "X feed"
  header** (`.tui-ph`, matching Chart / Policy rate / the other panes). On **phones** it is the
  **wire chip (News · Managers · Chart · X Feed)** — swapping onto the single-column
  workspace like the Managers wire (it is content, not the markets/rates
  data that phones fold into the shared Markets panel). It is a **single,
  always-current, newest-first** feed mirroring the **/Wire X List** — built from the
  **per-account timelines of the List's live members** (reposts included, replies to
  others filtered out), fetched **server-side by the Worker** (`/api/xfeed` in
  `src/index.js`) and drawn as **our own cards** (`renderXWire` in `v2/js/home/glance.js`).
  Drawing our own cards is deliberate: X **blanks its client-side
  List/timeline widgets for logged-out webviews** (the iPhone PWA), so an in-app
  embed cannot use them — the Worker reads the public feed with no login and no API
  key, which also sidesteps ITP and the List owner's account privacy. The feed is
  **preloaded on Home load** (`initXWire(true)` — booted even while the X pane is
  hidden behind another chip, so the feed is populated the instant its chip is
  opened) and **auto-refreshes every 15 min, only during UK 06:00–midnight** (Europe/
  London, `_xwireInHours`) for as long as the app is foregrounded — on ANY view, not
  just Home (the Home DOM is kept in memory so `#g-xwire` persists); the cards never
  blank during a refresh. It **pauses while the app is backgrounded and overnight**, so
  it never burns paid calls when nothing is watching (opening the pane still fetches once
  at any hour). Every card
  is a **real post** (no tweet text stored or
  invented — R7) linking its permalink, with a persistent **"Open list on X"** link
  and a clear message when X's server read is unavailable. **Membership auto-syncs
  from the X List:** with a key set, the Worker resolves the List's **current
  members** (twitterapi.io Get-List-Members, cached ~15 min) and fetches those — so
  adding/removing an account on the List (`x.com/i/lists/…`) flows into the feed with
  no code change. The List read uses **whichever key is bound** (`XAPI_KEY || XAPIS_KEY`),
  so **one existing twitterapi.io key unlocks live-List sync on either provider** — no
  second secret needed. `X_ACCOUNTS` in `v2/js/home/xposts.js` is the **fallback roster**
  (used only when membership can't be read — a TwitterAPIs.com-only key, a failed call, or
  no key); `X_LIST` holds the List id/link.
  `/api/xfeed` edge-caches a non-empty result ~15 min (`max-age=900`) and never pins an empty one.
  **Data source (provider ladder — cheapest first):** the feed is the **per-account
  timelines of the List's live members**, merged newest-first. The per-account timeline
  (`last_tweets`) is used ON PURPOSE because it **includes an account's reposts**, whereas
  twitterapi.io's *List-tweets* endpoint omits reposts and instead surfaces replies — the
  OPPOSITE of what X's List view shows — so the member timelines mirror the List view far
  better. The ROSTER is resolved from the **live List membership first** (`XAPI_KEY ||
  XAPIS_KEY`; List endpoints are twitterapi.io's), so add/removes on the List auto-sync.
  Provider order: **TwitterAPIs.com** (`XAPIS_KEY`, ~3× cheaper), then **twitterapi.io**
  per-account (`XAPI_KEY`), then the **free syndication** scrape (no key; X caches/degrades
  so dates can lag). Each rung falls through to the next if it returns nothing. **Replies to
  OTHER users are filtered out** (`replyToOther` — noise X's List view hides; a self-thread
  continuation is kept). Cards are **newest-first**; **reposts** render the original with a
  "reposted by …" line, and **quote tweets** keep the quoter's commentary **and nest the
  embedded original** as a bordered sub-card (`xQuotedCard`, `.g-x-quote`) — never dropped.
  **Long posts are clamped** to a few lines (`.g-x-txt--clamp`) with a **"Show more" /
  "Show less"** toggle (`.g-x-more`, expand state in the `_xExpanded` signal) so the wire
  stays scannable; short posts show in full with no toggle.
  **A valid twitterapi.io key (`XAPI_KEY`) is required for live-List membership sync** —
  TwitterAPIs.com has no List API, so with only `XAPIS_KEY` the roster falls back to the
  static `xposts.js` handles (no auto-sync). Diagnostics (key required): `?debug=env`
  (which keys are bound), `?debug=roster` (resolved members), `?debug=listtweets` (raw List
  stream), `?debug=apis` (TwitterAPIs.com raw), `?debug=1` (twitterapi.io raw). Enforced by
  `tests/home-xwire.mjs` (render), `tests/xfeed-parse.mjs` and `tests/xapis-extract.mjs`
  (the Worker normalisers incl. `xApiTweetsFromBody` + reply filtering + the TwitterAPIs.com
  extraction).

- **R27 — Hero chart band (Home).** The Home terminal carries a **price/performance
  chart band** that, on desktop, is the **top-right quadrant of the 2×2 centre**:
  Briefing over News wire on the left, **Chart over Manager wire on the right** (the
  chart sits directly above the manager wire, the briefing above the news wire); the
  left rail and both right rails stay full-height (CSS grid `grid-template-areas`).
  It is topped by a **pinned "Chart" header** (`.tui-ph`, matching the other panes).
  On **phones**
  it is a **wire chip — the tab strip reads News · Managers · Chart · X Feed ·
  Briefing, in that order (Briefing sits LAST); News is the default landing pane**
  and the Chart chip opens the band
  (with **all six tickers plotted** by default). A Home-nav tap resets to News —
  swapping onto the single-column workspace like the other wires. The band plots a fixed basket —
  **S&P 500 · Nasdaq · US 10Y · Oil · Gold · Bitcoin** — from **one unified
  securities row**: every instrument with its window **change indicator**, tapped to
  toggle **on/off the chart** (**multi-select**, one to all six, at least one kept),
  its **colour dot FILLED when plotted and HOLLOW when off**. That single row is
  also the chart legend — there is **no separate chip selector** to duplicate it.
  Below it sits the **1D / 5D / 1M / 6M / 1Y / ALL** range toggle — the
  **Google-Finance style**: the six labels **spread evenly across the full width
  over a hairline track**, the active one **blue with a blue under-bar** on the
  track (`--wb-txt`; `.g-hero-range`/`.g-hero-rg` in `home.css`). **1D/5D read an
  INTRADAY series** — ~5 trading days of 15-min bars, the 10Y's from Yahoo `^TNX`
  since FRED has no intraday — while the longer ranges read the **daily closes
  (~5 years; `ALL` = everything held)**. **1D is the default range on load**
  (`_heroRange` in `glance.js`). **1D is a rolling last-24-hours window;
  5D is the full intraday series (~5 trading days)**, plotted on a **real wall-clock
  X axis**: where the market is closed overnight or over a weekend the line
  **breaks — a gap, never a straight line** across the shut period (any run >45 min
  between bars; 24/7 instruments like Bitcoin stay continuous). Multi-select
  intraday overlays share ONE wall-clock domain so instruments on different trading
  hours line up in real time. The time axis reads HH:MM on 1D, day+month on
  5D/1M/6M, month-'YY on 1Y/ALL. Then the
  chart. Colour follows the instrument (its fixed basket slot), **never its
  selection rank**. It carries **axes, terminal-style**: a **right value axis**
  (round-number ticks; on the single view the current level sits in a colour-coded
  tag on the axis) and a **bottom time axis** (dated ticks — day+month on 5D/1M/6M,
  month-'YY on 1Y/ALL), over a faint grid with **horizontal and vertical** grid
  lines and thin non-scaling lines. Axis **labels are HTML positioned by %** so they
  stay crisp against the stretched (`preserveAspectRatio:none`) SVG. **One selected
  security → the up/down price line + price axis** (the 10Y yield reads a *fall* as
  green/risk-on). **Two or more → an INDEXED overlay:** each series **rebased to %
  from the window start** onto ONE shared % axis (never a dual axis — you cannot put
  S&P and the 10Y on one price scale), drawn in a **categorical colour** (the dataviz
  reference palette's validated dark hues, green/red skipped as they read as up/down
  here) over a 0% baseline; the crosshair drives each plotted ticker's % value.
  **One fetch, all ranges:** the Worker
  (`/api/hero` in `src/index.js`) returns **~5 years of daily closes per instrument**
  (plus the ~5-day intraday series) and the client **slices those** for the range
  toggle — no refetch on range/instrument change. Equities/commodities/Bitcoin come from
  **Yahoo Finance's** keyless chart API (same source as the markets band); the **10Y
  yield from FRED `DGS10`** (validated daily %, no scaling ambiguity). Every point is
  **real + sourced (R7)** — no invented prices. Fetched **lazily** and
  **auto-refreshes every ~5 min while on screen**, seeded from a per-viewer
  localStorage cache so a reload paints the last chart instantly (never a blank).
  `renderHero`/`drawHero` in `v2/js/home/glance.js`; `/api/hero` edge-caches ~10 min
  and never pins a broken partial (needs ≥4 of the basket). **Beneath the chart, a
  RELATED-NEWS list** for the six tickers — **real, sourced** Yahoo Finance
  search headlines (`/api/hero-news`, title · publisher · link · time, R7). Each
  instrument runs **both a spot and a futures query** (e.g. "S&P 500 index" +
  "S&P 500 futures", "crude oil price" + "crude oil futures"), merged under the same
  ticker tag, so the **futures market is covered** too. **Held to the same
  authorised financial-press roster as the rest of the app (§8.3)** — a
  strict publisher allowlist (Bloomberg, FT, WSJ/Dow Jones, Reuters, CNBC, the
  Economist, the Guardian, Axios, NBC News, MarketWatch, Nikkei, SCMP, Straits
  Times, Financial News, DealBook/NYT), so aggregator/SEO shops Yahoo mixes in
  (Zacks, BeInCrypto, Insider Monkey, GuruFocus, Benzinga, …) never appear here —
  drawn in the **news-wire row format** (`.g-feed-row`; time · ticker tag coloured
  per series · headline · source · ticker), newest-first, localStorage-seeded. It shows on the
  **phone/tablet Chart pane** (room beneath the chart); the ≥1201px terminal hides
  it (the full News column already exists, and the hero is a height-boxed band).
  Enforced by
  `tests/home-hero.mjs` (the securities row + filled/hollow dots, range toggle,
  single→indexed-overlay multi-select, axes + vertical grid, Option-C geometry,
  phone Chart chip) and the wire-chip order/default by `tests/home-mobile-wire-tabs.mjs`.

- **R28 — Home briefing card.** The market brief (`BRIEFINGS` — the four market
  desks in the **fixed house order Macro · Fixed income · Equities · Private capital**
  (private equity / private credit fund news)) is surfaced
  **only on Home** — there is **no header button / panel**. On the **desktop terminal** it is the **top-left quadrant
  of the 2×2 centre** (its own cell above the news wire, left of the chart), and
  **defaults OPEN** there (a collapsed bar would leave the cell empty). On **phones**
  it flows **inside the News chip pane, below the "Today" filter row** (which stays
  pinned) and **above the live feed** — the `.g-feed-wrap` is `display:contents`
  there so the briefing sits between the pinned filter and the feed — and **defaults
  collapsed** (a slim bar saves stack height). **No Overview lede:** the card is desk
  sections only — the synthesis lede (and its "Overview" heading) is retired and not
  rendered; the `lede` field is optional/deprecated in the data and need not be
  authored. **One section per desk:** the render
  groups same-desk bullets under a single kicker (see R7/grounding). **Each desk links
  its source(s):** the prose's inline "who reported it" attribution ("…, the FT reports")
  is stripped (`_stripReported`); instead a trailing source line (`.g-hbrief-srcs` →
  `.g-hbrief-src`, middot-joined) links every story the desk compresses to its publisher —
  the source as a **clickable link, not a textual mention** (grounding kept, R7). The desk
  kicker is **entity-decoded before display** (`_deEnt`) so an authored "M&amp;A"/"R&amp;D"
  renders as "M&A"/"R&D", never the double-encoded literal (`_briefDesk`/`_deEnt` in `glance.js`).
  **Fixed desk order — Macro, then Fixed income, then Equities, then Private capital:** the
  renderer (`DESK_RANK`) sorts the sections into this canonical order regardless of bullet order
  in the data; **M&A / deal stories are NOT a separate desk** — file a corporate deal under
  Equities, and a **private-equity / private-credit fund** story under **Private capital** (a
  PE firm's portfolio exit is Private capital, not a standalone "M&A" desk). **Equities is a REQUIRED section —
  every slot carries at least one Equities bullet** (the refresh invariant); the
  renderer round-robins the per-desk bullets under the four-bullet cap so each of
  the three desks keeps its lead bullet and **Equities can never be pushed off the
  card** by a Macro/Fixed-income-heavy slot. **iPhone-only markets snapshot strip:** on the
  phone the briefing opens with a **fitted** strip of five square cards
  (`.g-hbrief-strip` → `.g-hbs-card`, `renderBriefStrip`) — **S&P 500 · VIX · Oil · Gold ·
  US 10Y** — that **all fit the viewport with no horizontal scroll** (`flex:1 1 0`, cards
  share the row width evenly), each with the value on top and a direction-coloured block
  carrying the change below. The **Oil** card is the **Brent** front-month (the markets feed
  labels crude "Brent"/"WTI", not "Oil"); price cards show the **absolute + % change**, and the
  **US 10Y yield** card shows **both the bp move and the relative % change** (two lines, so it
  reads the same size as the price cards). **Every card is the same height** — the coloured
  change block grows to fill the card so its bar always reaches the bottom edge (no short bar
  over dark panel). **Every card shows the LAST CLOSE + its day change** — there is **no
  overnight-futures overlay** (the old futures substitution is retired). A **`*` on the value
  marks a CLOSED market** (`!isMarketOpen`, via `marketState`), with the single, unambiguous
  meaning "this figure is the **last close**, not a live price" (tooltip "Last close — market
  closed") — it never swaps in a futures number. It reads the same last-good markets/rates cache
  as the rail (no extra fetch) and stays empty rather than guessing (R7). **Hidden on the desktop quadrant.** On phone the
  **Market Briefing is the FIRST wire tab**, and **tapping the Home bottom-nav button opens
  the Briefing pane** (`homeReset` → `setWire("brief")`); News/lane is second and remains the
  default pane on a cold load. **Inline security pills (both surfaces):** on a
  recognised security's first mention the name is **REPLACED** by a chip (`.g-hbt-tk`) — the
  label stands in for the name, so the security appears **once** (the pill), never as text AND
  a pill — showing its ticker/benchmark + the day's move + a direction arrow (e.g. "Honeywell
  gains" → "`HON 0.07% ↓` gains"; "the US 10-year Treasury yield" → "`US 10Y 3bp ↑`"). A
  yield/index pill carries its label up front so it reads even before its live value fills; an
  unresolved name keeps its prose text (no pill to replace it). The pills cover **three kinds** of
  instrument — **benchmark yields, indices, and equities (megacaps)** — detected in the
  prose (`_briefSecNames` — capitalised phrases minus a `SEC_STOP` stoplist of
  countries/currencies/central-banks/calendar/common words). **US Treasury benchmark yields**
  (`BRIEF_YIELDS`) come from the rates cache (bp move). **Major indices** (`BRIEF_INDEX` — a
  curated name→symbol map, **S&P 500 · Nasdaq · Dow · Russell · FTSE · DAX · Nikkei · Hang
  Seng · VIX · …**, most-specific first so "Nasdaq 100" beats "Nasdaq") are matched by that
  map — a curated set is accurate where fuzzy name-resolution isn't — and their live % comes
  from **`/api/quotes`** (the only endpoint that accepts `^`-prefixed index symbols).
  **Equities are resolved LIVE** via **`/api/secq`** → `handleSecq`: Yahoo **search** for
  candidates, then a **market-cap tiebreaker** over them (crumb-gated `/v7/quote`, cookie+crumb
  cached in KV) so the biggest listing wins — "Honeywell" → **HON**, not HONA. Resolutions,
  **including negatives**, are KV-cached so a non-security name isn't re-searched (names already
  handled as a yield or index are skipped by `_briefSecNames`). The tradeoff for broad "any-equity" coverage is a **rare wrong pill**
  (an ambiguous name binding the wrong listing); it is bounded by the name-match + market-cap
  floor gate, and a name that doesn't confidently resolve to a live quote gets **no pill**
  (never a fabricated number, R7). **No per-desk data badges:** the inline pills carry the
  live price/value change, so the retired trailing per-desk badge row (one card per desk
  pinning Brent / S&P 500 / US 10Y) is **removed** — the card is prose + source links + pills
  only. **Only the LATEST available version is
  shown — no slot selector**; the card picks the freshest brief by (date·time)
  stamp. Data: `BRIEFINGS` (tokenless / no-cache — regenerated on **each of the ~5
  daily refresh runs**, so a fresh brief appears with no code push), with the
  **orange desk kicker** (`.g-hbrief-bk`) carrying the colour accent and numbers read
  as plain body text, capped to **four bullets** (one screen) drawn from real sourced
  desk items (grounding, R7); the header shows the brief's time · date stamp. It
  On the **desktop quadrant it is permanently open — no collapse control** (its header
  is a static title row, no chevron). On **phones it is collapsible** (`briefOpen` in
  the Home prefs), **default collapsed** (tap to expand), with an **unread dot**
  (`localStorage m_brief_read`) shown only while collapsed. **Header / freshness stamp:** on
  the **desktop quadrant** the header row (`.g-hbrief-head`: title-case "Market briefing" left,
  faint time·date right — like Chart / X feed / Policy rate) is shown. On the **phone** the
  briefing is its own labelled wire tab, so that **header row is hidden** and the freshness
  stamp (`.g-hbrief-stamp`, "Updated <time·date>", CSS-gated under `max-width:1200px`) is a
  **sibling of the scrolling body, pinned to the bottom of the fixed pane** (`flex:0 0 auto`) —
  so it **anchors to the bottom nav bar** for a brief of any length instead of scrolling away
  with the prose; the body fills the gap above it. There is no redundant "Market briefing" row
  above the card. `renderHomeBriefing`/`initHomeBriefing` + `.g-hbrief` in
  `v2/js/home/glance.js` (`#g-hbrief` in `content.js`); enforced by
  `tests/home-briefing.mjs`. The News feed's **day-break marker** (`.g-feed-dayhdr`)
  sticks directly beneath the filter row as the feed scrolls (Home-scoped offset in
  `home.css`).

- **R29 — Adding a roster name (Coverage tab → `/api/propose`).** When a new firm
  is added via the in-app Coverage tab, the drafted entry (`credit/js/data.js`
  `managers` for a manager, `legal/js/data.js` `firms` for a law firm) MUST:
  - carry a **unique** id — `m<N>` = the current max **+ 1**, scanning **both** the
    hand-written `id: "mN"` and the JSON-serialised `"id":"mN"` forms (the draft the
    routine inserts is JSON-serialised, so a scanner that misses that form collides —
    the Situational Awareness / Andromeda `m225` clash). One id per manager, ever;
    a duplicate id makes the profile route to the wrong firm.
  - store **`aum` as a NUMBER IN BILLIONS OF USD** (e.g. `9.28`, not `9278344000`) —
    the whole roster is in `$bn`, and a raw-dollar figure renders as absurd trillions.
    `normAum()` in `src/index.js` folds a stray raw value back to billions; the
    `/api/propose` prompt states the unit. `aumText` is the human string.
  - be marked `_draft:true` + `estimated:true` so the daily routine finds it.
  **Every new `_draft` name must then be researched and filled out** — real, sourced
  AUM/strategies/owners/description and, where verifiable, deals & news (never
  fabricated, R7) — and `_draft` cleared once the profile is solid. New names are
  never left as a bare stub.

- **R30 — Home right-rail data panels.** The Home terminal's right rail carries,
  in this order: **Key rates → Spreads → Volatility → Yield curve → Policy rate →
  Prediction markets** (`content.js` `g-side2`; enforced by
  `tests/home-right-rail.mjs` and `tests/home-rates-spreads.mjs`). These are THREE
  distinct market-gauge panels, one instrument-kind each: **Key rates** is the
  benchmark yields only (EURIBOR/SONIA/SOFR/US 10Y, `#g-rates`); **Spreads** is the
  ICE BofA OAS levels (US IG/HY/CCC, EURO HY) plus the derived **HY−IG** (quality)
  and **CCC−HY** (distress) premia (`#g-spreads`); **Volatility** is VIX, **MOVE**
  (ICE BofAML Treasury-vol index, `^MOVE`) and **CDX HY** (Simplify High Yield ETF
  `CDX`, tracking CDX.NA.HY) only (`#g-vol`) — no credit spread lives in the vol
  panel. Rates/spreads come from the rates feed, VIX/MOVE/CDX from the markets feed. The **left rail** carries a **Strait of Hormuz** tile — the latest daily
  vessel transits vs the trailing 30-day average, live from **IMF PortWatch**'s
  public AIS feed (`/api/hormuz` → chokepoint6; `tests/home-hormuz.mjs`). Every
  figure is real and sourced — a feed that can't be reached shows an "unavailable"
  state, never a fabricated number (R7).

---

## 7. Technical rules

- **T1 — Cache-busting: code carries a token, data does NOT.**
  - **Code** (the v2 SPA's JS/CSS: views, engines, chrome, styles) is bundled and
    **content-hashed by Vite** (`npm run build`) — the hash in each emitted
    `/assets/*-[hash].js|css` filename IS the cache-buster, so a changed module
    ships a new URL automatically. No hand-managed `?v=` token and no `vurl()`: an
    import specifier under `v2/js` must stay **tokenless** (enforced by
    `tests/token-lockstep.mjs`). The single `v2/index.html` entry (revalidated
    `no-cache`, see `_headers`) always points at the current hashed bundle, so a
    fresh deploy is picked up on the next load. Code changes ship on deploy,
    authored by sessions.
  - **Data** (`credit/js/data.js`, `legal/js/data.js`, `macro/js/content.js`,
    `dashboard/js/data.js`, `newsletters.js`, `ft.js`, and the **generated**
    `home-data.js`) is imported with **NO
    `?v=` token** and served `Cache-Control: no-cache` (see `_headers`). Every
    importer therefore uses one tokenless URL → a **single module instance**
    (the old cross-file `?v=` drift that double-instanced a module and blanked a
    page is now structurally impossible), and freshness comes from ETag
    revalidation, not a hand-bumped token. This is deliberate: the 5×/day refresh
    routine edits ONLY these data files and never a token, so routine commits and
    session commits stop colliding. **Never add a `?v=` back to a data-file
    import**, and never hand-bump a data token.
- **T2 — Vite-bundled SPA, one runtime.** `npm run build` bundles the v2 SPA from
  the `v2/index.html` entry (its JS chain + the eleven `@import`ed stylesheets in
  `v2/styles.css`) into hashed `/assets/*`; every stylesheet is declared up front
  there (no per-view CSS lazy-loading). The desk DATA modules and shared root
  modules stay **external** — emitted as-is by `scripts/postbuild.mjs`, tokenless
  and `no-cache` — so a data refresh never re-hashes the app bundle. **`home-data.js`
  is GENERATED, not hand-edited:** `scripts/gen-home-data.mjs` (first step of
  `npm run build`) projects the full credit/legal/macro modules down to the compact
  slice the Home surface imports (fields Home + the manager wire render, heavy
  profile/detail bodies stripped — ~0.47 MB gz vs the ~1.5 MB gz of the three full
  modules). Because it runs on every build it is ALWAYS in sync with the 5×/day data
  refresh; the committed copy is a source-mode/dev convenience (regenerate it with
  `node scripts/gen-home-data.mjs` after editing a desk data module). One runtime
  loads once; switching tabs swaps a keep-alive view in memory (no document
  reload). The app still runs unbundled from source (`node tests/run.mjs` serves
  the repo; `TEST_ROOT=dist node tests/run.mjs` proves the built output serves
  identically).
- **T3 — Full suite green before deploy.** `node tests/run.mjs` (73 specs) must
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
- Yahoo Finance (`finance.yahoo.com`, `uk.finance.yahoo.com`) — equity, ETF & FX quotes;
  also the daily-close **series** behind the markets-band sparkline and the Home
  **hero chart band** (`/api/hero` — S&P 500, Nasdaq, Oil, Gold, Bitcoin; the 10Y
  yield in that basket comes from FRED `DGS10`, §8.2). See **R27**.
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
- OECD (`oecd.org`) — Economic Outlook, growth/inflation projections, Economic Surveys (via Google News newsroom bridge)

### 8.3 News wires & financial press
> **Readable-only policy (2026-10).** The live wire carries only sources that render
> in the reading pane. The hard-paywalled **premium four — Financial Times, Bloomberg,
> The Wall Street Journal, The Economist** — are **switched off** at source (commented
> out in `FEED_SOURCES`, reversibly; the FT desk's static side is gated by `FT_DESK_ON`
> in `v2/js/home/glance.js`). **Nikkei Asia** (hard paywall) and **The Lawyer** are
> dropped. Reuters, AP, CNA and The Straits Times are open-but-bot-shielded and render
> via the Firecrawl browser proxy. The old ≤30% paywalled-share cap was removed.
- Reuters (via aggregation)
- Associated Press (`apnews.com`) — openly-readable global wire (via Google News bridge)
- CNBC (`cnbc.com`)
- MarketWatch
- City AM (`cityam.com`)
- Channel NewsAsia (`channelnewsasia.com`) — open Asia business desk
- South China Morning Post (`scmp.com`)
- The Straits Times (`straitstimes.com`)
- Google News (`news.google.com`) — aggregation
- **Financial News London (`fnlondon.com`)**
- The Guardian (`theguardian.com`) · Axios · NBC News · MT Newswires (via Koyfin)
- _Switched off (readable-only): Bloomberg, Financial Times, Dow Jones/WSJ, The Economist, Nikkei Asia, DealBook (NYT)._

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
- ✅ **ING Think** (`think.ing.com/rss`) — first-party RSS, **live on the wire** (`filter:false` + `FEED_CURATED_SRC`): rates ("Rates Spark"), FX ("FX Daily"), macro/economics, commodities. The one bank/house macro desk with a clean public feed.
- 📧 **Bulge-bracket houses — email-only, pending a relay.** BofA (Institute), Wells Fargo (Economics) and UBS (CIO House View) publish **no public RSS**; their public commentary goes out by **email newsletter** only (and their sites are JS/cookie-walled). To wire them, bridge each via an email-to-RSS relay (e.g. `kill-the-newsletter.com`): make a relay inbox+feed, subscribe it to the bank's newsletter, then add the relay feed URL to `FEED_SOURCES` (`filter:false` + `FEED_CURATED_SRC`). Goldman / Morgan Stanley / JPM have **no article RSS** either — only podcasts (audio-first) or a Google-News `site:` bridge — so they're not wired as readable sources.
- 🔒 Bloomberg Opinion (Authers · Dudley · El-Erian) — Bloomberg paywall (switched off on the Home wire)
- 🔒 Project Syndicate (`project-syndicate.org`) — metered (a short abstract then a register wall); not readable in-pane
- ✅ Mohamed El-Erian (`mohamedelerian.substack.com`) — substack (live)
- ✅ Selected Substacks (`investorama.substack.com`, `debtserious.substack.com`, `butthistime.com`) — live
- _Considered and not worth wiring: Yahoo Finance (open but single-stock clickbait, junk images), TradingView (charting platform, thin aggregated "news"). Investing.com is wired only as the Economics indicator feed._

### 8.5 Credit, private markets & hedge funds
> **Readability (verified 2026-10).** ✅ = openly-readable in-pane and wired to the live
> wire; 📄 = readable but **no usable feed route** (not Google-News-indexed and no RSS),
> so cited as a resource only; 🔒 = subscription/paywalled, opens at the publisher (not
> on the readable Home wire — may still back Dashboard/Profiles/Transactions).
- ✅ Alternative Credit Investor — live (credit desk)
- 🔒 Alternatives Watch (`alternativeswatch.com`) — paywalled ($39/mo; only a lede is public), no RSS. Well-indexed by Google News but not readable.
- GlobalCapital
- ✅ Hedgeweek · ✅ HedgeNordic (`hedgenordic.com`, Nordic hedge desk) · The Hedge Fund Journal · ✅ Hedge Fund Alpha — hedge desk (live)
- ✅ ABF Journal (`abfjournal.com`) — US asset-based lending & middle-market debt (FI desk, live)
- IPE / IPE Real Assets
- Credit Village (`creditvillage.news`) — Italian-language (not wired)
- Crowdfund Insider
- Bloomberg Law
- ✅ Newswires: Business Wire, GlobeNewswire, PR Newswire (deal-scoped, live)
- SEC / EDGAR filings · Company & sponsor press releases
- Hedge Fund Research (HFR) · Hedge Fund Monitor · Aurum
- 🔒 Nishant Kumar (Bloomberg) — switched off (Bloomberg paywall)
- ✅ PE Wire
- Paul Krugman
- ✅ Moody's — free CreditView blog + /insights research, wired via Google News bridge (FI desk)
- 📄 S&P (Global Ratings) — free press releases render (`press.spglobal.com`) but are barely Google-News-indexed, so no clean feed route
- 📄 Preqin (`preqin.com`) — free /insights blogs + press releases render, but no RSS and Google News returns only database "Asset Profile" pages — no feed route
- 🔒 9fin (`9fin.com`) — subscription (leveraged finance); some free deep-dives render inconsistently
- 🔒 Debtwire · 🔒 Octus (Reorg) · 🔒 With Intelligence · 🔒 Dealogic — subscription data/intel platforms, no open web content
- Morningstar
- KBRA (Kroll Bond Rating Agency) — incl. the quarterly "Private Credit: Middle Market Compendium"
- AIMA / Alternative Credit Council (ACC) — private-credit research incl. "Private Credit Performance & Valuation Trends"
- 📄 Fitch Ratings (`fitchratings.com`) — private-credit & leveraged-finance research; JS-rendered SPA, unproven in-pane (not wired)

### 8.6 Legal & courts
- UK courts: High Court (Chancery · Commercial · King's Bench · Administrative;
  Business & Property Courts; Insolvency & Companies List), Court of Appeal,
  UK Supreme Court
- The Lawyer (`thelawyer.com`) — _switched off: subscription-only, opens at publisher (in READ_PAYWALL)_
- Legal Business (`legalbusiness.co.uk`)
- Legal Cheek (`legalcheek.com`) — UK magic/silver-circle & Big-Law news
- Legal Futures (`legalfutures.co.uk`) — UK legal-market regulation & litigation funding
- The Global Legal Post (`globallegalpost.com`) — international legal-market news (via Google News /news bridge; image-chrome suppressed)
- Bloomberg Law
- Law-firm client briefings

### 8.7 Prediction markets
- Polymarket (`polymarket.com`, `gamma-api.polymarket.com`)

### 8.8 X wire (Home)
A merged, live feed of these **public** X accounts, fetched server-side by the
Worker (`/api/xfeed`) from X's public syndication endpoint — see **R26**. The
handles live in `v2/js/home/xposts.js` (`X_ACCOUNTS`); `X_LIST`
(id `2100283810713649423`) is kept only for the "Open list on X" link. Roster:
- `@elerianm` — Mohamed A. El-Erian (economist)
- `@negligible_cap` — Negligible Capital (long/short equity)
- `@LeylaKuni` — Leyla Kunimoto (private markets, LP view)
- `@lcdnews` — LCD News (leveraged loans / private credit · PitchBook)
- `@michaeljburry` — Michael Burry (Scion)
- `@RayDalio` — Ray Dalio (Bridgewater)
- `@sindap` — Sujeet Indap (Wall Street editor · FT)
- `@ArashMassoudi` — Arash Massoudi (finance & markets editor · FT)
- `@nishantkumar07` — Nishant Kumar (hedge funds · Bloomberg)
