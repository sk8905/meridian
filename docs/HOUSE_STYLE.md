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
  5-column wire terminal (markets · news wire · manager wire · X wire · macro)
  needs real width for its two flexible middle columns, so it only engages at
  ≥1201px; from 761–1200px (iPad mini/Air/Pro-11 landscape) Home uses the
  single-column chip-swap layout instead** (Chart · News · Managers · X Feed), which
  is what the phone uses — otherwise the two middle wires crush to ~50px and the
  headlines wrap one word per line. The other desks (Macro/Credit/Legal) are
  single-column and keep the ≥761px terminal.
- **R2 — Phone = scrolling document (≤760px).** Content scrolls under pinned
  chrome.
- **R2b — Chrome is anchored and never moves.** The top header strips
  (topbar + ticker + brief) are pinned at the top on every page and breakpoint;
  the footer is pinned to the viewport bottom on desktop; on phone the bottom
  nav/tab bar is `position:fixed` and the signed-in/last-refresh strip sits
  directly above it. None of these scroll with content.
- **R3 — Four-column reading frame on Home** (desktop): markets rail
  (`.g-side`) · aggregated feed (`.g-feed-wrap`) · manager wire (`.g-side3`) ·
  macro rail (`.g-side2`). **Every rail is exactly the viewport height** — pinned
  panels at top/bottom, no dead grey gap under the last panel, and **the rail
  itself never scrolls.** Only the one designated overflow region inside each
  scrolls (left: Top movers `#g-movers`; manager wire: `.g-mw-body`; right:
  Prediction markets `.g-flow-body`), and it *shrinks* to fit rather than pushing
  the column past the screen. A rail that scrolls as a whole is a bug. On phone
  the columns stack (feed → manager wire → markets → macro).
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

- **R5 — One feed engine, one `.g-feed-row` grid** across Home / Macro / Credit
  / Legal / Palette. No bespoke per-section list markup.
- **R6 — Standard day breaks** on every dated list — the main wire *and*
  sub-lists such as Legal Case Law (`.tw-day`): sans-serif, **10.5px / 600**,
  uppercase, `.04em` tracking, grey band (`--t-head`), label `--t-accent`
  (dark) / `#2f6cae` (light). No mono, no per-section variants.
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
  **Every wire row carries a label**; anything not clearly classifiable is `NEWS`
  in the neutral domain. The label engine (`feed.js`) resolves colour from the
  item's `dom` (domain) and text from its `desk` (type) — see its "Desk
  vocabulary" header.

---

## 4. Typography — two families, a fixed scale

- **Sans** (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
  Arial, sans-serif`): prose, feed rows, day breaks, headings, buttons.
- **Mono** `--t-mono` (`ui-monospace, "SF Mono", SFMono-Regular, Menlo,
  Consolas, "Liberation Mono", monospace`): all tabular/numeric data (tickers,
  price columns, FX, prediction %) and the terminal-chrome dropdown panels
  (Markets / Saved / Notifications).
- **R11 — Sizes come from the scale, not ad-hoc px:** the whole app is anchored
  to the **Profiles ▸ Managers league** (`.tleague`) — the agreed reference
  density: **11.5px** sans names, mono figures. The scale: 9–10.5px (day breaks /
  eyebrows / column heads, uppercase), ~11px (mono data rows), **11.5px** body /
  content / list & feed item text (`--fs-content` ≈ .72rem; feed headlines a
  hair up at 12px), 12.5px (panel headers), then a restrained heading step
  (`--fs-card-title` .85rem, `--fs-section-title` 1.21rem / .98rem mobile).
  Prose, feed rows and info-page copy all sit at this league density — they do
  **not** run at the retired 13.6px prose scale. Numeric columns use
  `font-variant-numeric: tabular-nums`. Change a size once, in the `--fs-*`
  token block (premium.css), so every surface moves in lockstep. (The whole
  scale was lifted a uniform **+0.5px** from its original 8.5–13.6→9–14px values
  for legibility — hence the half-px steps; keep new sizes on that grid.)
- **R11b — No new font family or weight** beyond the two stacks and the weights
  already in use (400 / 500 / 600 / 700 / 800). 500 is the inactive-chip/label
  weight, paired with 600 for the active state.

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
  token is missing from a scope, and the whole underline silently vanishes.

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
  rail, between the manager wire and the macro rail**. On **phones** it is the
  **wire chip (Chart · News · Managers · X Feed)** — swapping onto the single-column
  workspace like the Managers wire (it is content, not the markets/rates
  data that phones fold into the shared Markets panel). It is a **single,
  always-current, merged & newest-first** feed of the roster's **public** accounts,
  fetched **server-side by the Worker** (`/api/xfeed` in `src/index.js`) from X's
  public **syndication** endpoint and drawn as **our own cards** (`renderXWire` in
  `v2/js/home/glance.js`). This is deliberate: X **blanks its client-side
  List/timeline widgets for logged-out webviews** (the iPhone PWA), so an in-app
  embed cannot use them — the Worker reads the public feed with no login and no API
  key, which also sidesteps ITP and the List owner's account privacy. The feed is
  fetched **lazily** (only when the panel nears view) and **auto-refreshes every ~5
  min while it is on screen** (kept-alive, so the cards never blank — see the
  no-blank persistence below); every card is a **real post** (no tweet text stored or
  invented — R7) linking its permalink, with a persistent **"Open list on X"** link
  and a clear message when X's server read is unavailable. **Membership auto-syncs
  from the X List:** with a key set, the Worker resolves the List's **current
  members** (twitterapi.io Get-List-Members, cached ~15 min) and fetches those — so
  adding/removing an account on the List (`x.com/i/lists/…`) flows into the feed with
  no code change. `X_ACCOUNTS` in `v2/js/home/xposts.js` is the **fallback roster**
  (used when membership can't be read or no key); `X_LIST` holds the List id/link.
  `/api/xfeed` edge-caches a non-empty result ~5 min and never pins an empty one.
  **Data source:** when the `XAPI_KEY` Worker secret is set, `/api/xfeed` pulls each
  member's own timeline live from **twitterapi.io** (Get-User-Last-Tweets, merged —
  this **includes reposts**, which the List-tweets endpoint strips) and orders
  newest-first; **reposts** render the original post with a "reposted by …" line, and
  **quote tweets** keep the quoter's own commentary **and nest the embedded original**
  as a bordered sub-card (author · text · media, linking the quoted post) — the
  original is never dropped (`xQuotedCard` in `src/index.js`, `.g-x-quote`). With
  **no key** it falls back to X's free syndication scrape, which X caches/degrades (so
  dates can lag). Either way the
  app just renders the cards. (`?debug=1` returns the raw upstream JSON for one
  handle — key required — for diagnosing shape changes.) Enforced by `tests/home-xwire.mjs` (render) and `tests/xfeed-parse.mjs`
  (both Worker normalisers — free syndication + twitterapi.io shapes).

- **R27 — Hero chart band (Home).** The Home terminal carries a **price/performance
  chart band** that, on desktop, **spans the two middle columns (news + manager
  wire)** and sits **above** them (both wires start beneath it); the left rail and
  both right rails stay full-height (CSS grid `grid-template-areas`). On **phones**
  it is the **first wire chip — the tab strip reads Chart · News · Managers · X Feed,
  in that order, and Chart is the default landing pane** (with **all six tickers
  plotted** by default), and a Home-nav tap resets to it — swapping onto the
  single-column workspace like the other wires. The band plots a fixed basket —
  **S&P 500 · Nasdaq · US 10Y · Oil · Gold · Bitcoin** — from **one unified
  securities row**: every instrument with its window **change indicator**, tapped to
  toggle **on/off the chart** (**multi-select**, one to all six, at least one kept),
  its **colour dot FILLED when plotted and HOLLOW when off**. That single row is
  also the chart legend — there is **no separate chip selector** to duplicate it.
  Below it sit the **1D / 1W / 1M / 6M / 1Y / YTD** range toggle (**right-aligned**;
  1D/1W read an INTRADAY series — ~5 trading days of 15-min bars, the 10Y's from
  Yahoo `^TNX` since FRED has no intraday — while the longer ranges read the daily
  closes. **1D is a rolling last-24-hours window, 1W a rolling last-week window**
  (not a calendar session), plotted on a **real wall-clock X axis**: where the
  market is closed overnight or over a weekend the line **breaks — a gap, never a
  straight line** across the shut period (any run >45 min between bars; 24/7
  instruments like Bitcoin stay continuous). Multi-select intraday overlays share
  ONE wall-clock domain so instruments on different trading hours line up in real
  time. The time axis reads HH:MM on 1D, day+month on 1W/1M/6M. Then the
  chart. Colour follows the instrument (its fixed basket slot), **never its
  selection rank**. It carries **axes, terminal-style**: a **right value axis**
  (round-number ticks; on the single view the current level sits in a colour-coded
  tag on the axis) and a **bottom time axis** (dated ticks — day+month on 1M/6M,
  month-'YY on 1Y/YTD), over a faint grid with **horizontal and vertical** grid
  lines and thin non-scaling lines. Axis **labels are HTML positioned by %** so they
  stay crisp against the stretched (`preserveAspectRatio:none`) SVG. **One selected
  security → the up/down price line + price axis** (the 10Y yield reads a *fall* as
  green/risk-on). **Two or more → an INDEXED overlay:** each series **rebased to %
  from the window start** onto ONE shared % axis (never a dual axis — you cannot put
  S&P and the 10Y on one price scale), drawn in a **categorical colour** (the dataviz
  reference palette's validated dark hues, green/red skipped as they read as up/down
  here) over a 0% baseline; the crosshair drives each plotted ticker's % value.
  **One fetch, all ranges:** the Worker
  (`/api/hero` in `src/index.js`) returns a **full year of daily closes per
  instrument** and the client **slices that single series** for the range toggle — no
  refetch on range/instrument change. Equities/commodities/Bitcoin come from
  **Yahoo Finance's** keyless chart API (same source as the markets band); the **10Y
  yield from FRED `DGS10`** (validated daily %, no scaling ambiguity). Every point is
  **real + sourced (R7)** — no invented prices. Fetched **lazily** and
  **auto-refreshes every ~5 min while on screen**, seeded from a per-viewer
  localStorage cache so a reload paints the last chart instantly (never a blank).
  `renderHero`/`drawHero` in `v2/js/home/glance.js`; `/api/hero` edge-caches ~10 min
  and never pins a broken partial (needs ≥4 of the basket). **Beneath the chart, a
  RELATED-NEWS list** for the six tickers — **real, sourced** Yahoo Finance
  search headlines (`/api/hero-news`, title · publisher · link · time, R7) **held to
  the same authorised financial-press roster as the rest of the app (§8.3)** — a
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

---

## 7. Technical rules

- **T1 — Cache-busting: code carries a token, data does NOT.**
  - **Code** (CSS/JS: views, engines, chrome, CSS) is fingerprinted with a `?v=`
    token; one build `V` from `import.meta.url` propagates via `vurl()`. Bump the
    token on any changed CSS/JS so caches bust together. Code changes ship on
    deploy, authored by sessions.
  - **Data** (`credit/js/data.js`, `legal/js/data.js`, `macro/js/content.js`,
    `dashboard/js/data.js`, `newsletters.js`, `ft.js`) is imported with **NO
    `?v=` token** and served `Cache-Control: no-cache` (see `_headers`). Every
    importer therefore uses one tokenless URL → a **single module instance**
    (the old cross-file `?v=` drift that double-instanced a module and blanked a
    page is now structurally impossible), and freshness comes from ETag
    revalidation, not a hand-bumped token. This is deliberate: the 5×/day refresh
    routine edits ONLY these data files and never a token, so routine commits and
    session commits stop colliding. **Never add a `?v=` back to a data-file
    import**, and never hand-bump a data token.
- **T2 — ES modules, no bundler.** One runtime loads once; each view
  lazy-loads its own CSS array; switching tabs swaps a keep-alive view in
  memory (no document reload).
- **T3 — Full suite green before deploy.** `node tests/run.mjs` (39 specs) must
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
- The Hedge Fund Journal
- Hedge Fund Alpha
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
