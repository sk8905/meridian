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
- **R2d — iPhone consistency (owner review 2026-10-14).** **(a) One page gutter:** every
  phone page puts text (or a boxed card's edge) exactly **`--m-gutter` = 12px** from the
  screen edge — feed rows, Profiles lists AND profile pages, the Transactions list and deal
  card, Dashboard cards (card padding is the same 12px). Never a page-specific 14/16px.
  (Audit 2026-10-16: the Menu pages — Sources, Digest, Settings, the row menu — used
  14px, the law-firm glance and filters 16px, the profile identity header 16px on desktop
  and `.dsh-card` 14px on desktop; all 12px now. Markets' cards stay boxed — the one
  named exception, so a Markets list starts inside its card, not at 72px.) **Every line of
  text starts on the gutter** (owner 2026-10-16, a photo of Firm facts): the profile
  mini-lists (`.tmini-row` — Vehicles, Timeline, Firm facts, Commitments) were 14px, the
  adviser role ("FUND FORMATION", `.adv-role`) 0px, Investor ▸ Profile's latest line 0px,
  the borrower facts 24px, Sources' legend 0–15px, the See-all sheet / reading pane /
  X feed / prediction lists 14–16px — all 12px; Fundraising's ranked LP list puts its rank
  in the lead column (name at 72px, as League tables). Inside a Markets card everything
  sits on the card's ONE text line: the news-rail card's edge was 10px (now 12, like every
  card), a card nested in a card (Rates ▸ Reference) is a plain section of it on iPhone,
  and the roster / earnings rows lost their 2–4px private insets. Guard: the line-start
  sweep in `tests/style-consistency.mjs`.
  **(b) Bars fit:** a phone tab/lane bar shows every label on one line inside the screen —
  the Home and Dashboard tabs share the width (the News lanes are the exception — usual
  `0 12px` spacing in a sideways-scrolling row, owner 2026-10-16), and profile sub-tabs
  (`News · Vehicles 32 · Investments 46 · …`) never wrap. **(c) Theme-true colours:** a
  colour token differs between light and dark when the dark tint is unreadable on white
  (`--t-news` is `#8aa0c8` dark / `#4f6690` light). **(d) One money format:** every list /
  profile figure prints through `fmtBn` (`credit/js/shared.js`) — 3 significant figures, no
  padded zeros: `$228bn · $13.4bn · $8.95bn · £2.9bn · $1.13tn · $450m`. Spec: `tests/phone-consistency.mjs`.
- **R3 — Four-column reading frame on Home** (desktop): markets rail
  (`.g-side`) · aggregated feed (`.g-feed-wrap`) · manager wire (`.g-side3`) ·
  macro rail (`.g-side2`). **Every rail is exactly the viewport height** — pinned
  panels at top/bottom, no dead grey gap under the last panel, and **the rail
  itself never scrolls.** Only the one designated overflow region inside each
  scrolls (left: Top movers `#g-movers`; manager wire: `.g-mw-body`; right:
  Prediction markets `.g-flow-body`), and it *shrinks* to fit rather than pushing
  the column past the screen. A rail that scrolls as a whole is a bug. On phone
  the columns stack (feed → manager wire → markets → macro).
- **R3a — Reading pane: auto-open once per load; remembers the last selection; keyboard-cyclable** (desktop). On a
  fresh view the pane **auto-opens a story** — but only **once per page load**
  (`syncReadDefault` sets a flag). It opens the reader's **LAST-SELECTED story** when that
  story is still in the feed (persisted across reloads in `localStorage m_read_last`), so a
  reload/reopen keeps what they were reading; otherwise it **defaults to the first openable
  story** so the pane is never empty on open. An in-session re-render (the
  background/live refresh, a lane switch) must **never re-jump** the pane off what the
  reader is on — and the open story's row **stays shaded** across the repaint
  (`_markReadingRow` re-applies `.is-reading` by the persisted selection key, gated on the
  pane being open so it never pre-empts the first open/restore) whenever that story is still
  in the lane; the opened story also stays shown in the pane. A hard refresh, or a reopen that reloaded
  for newer content, re-imports the module so the flag resets and the last selection (or the
  first story) opens again. The reader also opens a
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
  never truncated. A further pass, **`_stripTrailingRecirc`**, drops a trailing
  **"related / recommended stories"** block — the run of short linked headlines and
  **ellipsis-truncated teasers** ("…continuing to build out…") some publishers (Hedgeweek,
  PE Wire) append below the article. Its signature is the recirculation SHAPE: it fires only
  when the trailing run carries **≥2** strong signals (ellipsis-truncated teasers, nav-label
  or link-only rows) AND a real, **non-truncated** body sentence sits above it (the cut
  point), so a clean article — even one whose last line genuinely trails off with one
  ellipsis — is never cut. Any extraction change
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
  **direct-fetch only** and covers every non-paywalled host, so it spends **zero**
  Jina/Firecrawl proxy quota on a schedule (bot-walled sources stay on the on-demand
  path; on-demand, Jina is the default — Firecrawl is reserved
  for the `READ_FC_HOSTS` allowlist); (3) `handleRead` checks KV on an edge miss
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
  1. **Macro-economic news relating to the G7 + Western Europe** — the G7 (US · UK ·
     Canada · France · Germany · Italy · Japan), the rest of **Western Europe**
     (Ireland, Spain, Portugal, Netherlands, Belgium, Luxembourg, Austria,
     Switzerland, the Nordics — Denmark, Sweden, Norway, Finland, Iceland — Greece,
     Malta, Cyprus), plus the **ECB / Eurozone** aggregate. OUT = all **non-European**
     geographies (Hong Kong, Singapore, China, India, Brazil, Australia, …) AND
     **Central & Eastern Europe** (Poland, Czechia, Hungary, Romania, Bulgaria,
     Slovakia, Slovenia, Croatia, the Baltics, the Balkans, Russia, Ukraine, Belarus,
     Turkey, …). Geopolitics that moves G7/Western markets (e.g. the Russia–Ukraine war,
     Iran) is still covered as it bears on those economies — what's OUT is the CEE
     country's own macro data (its CPI, GDP, rates, currency).
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
  headline), so the ~2-hourly refresh routine and the rosters are the gate. A covered
  entity's news always qualifies; the **$1–15bn band governs only the routine's choice
  of which NEW managers/hedge funds to add on its own initiative** — not what's kept
  for an already-covered name. When an off-universe entity leaks, either it genuinely
  belongs (add the entity) or the source/query is too broad (tighten it). Rule 4 is
  editorial. **When in doubt, leave
  it out** — the wire is a curated universe, not a general feed.
  **Scope gates & audit (2026-10-15).** `feedQualityKeep` also drops, from every source
  except the reader's own curated streams (myFT / Substack / research): first-person and
  personal-finance stories (`FEED_PERSONAL_RE` — "I lost my home … I rent", mortgage /
  401(k) / Social Security / credit-score advice); out-of-scope central banks, EM
  development finance and disaster live blogs named anywhere in a headline
  (`FEED_OFFSCOPE_ANY_RE`); press-release slop on the deal wires (`FEED_PR_SLOP_RE` —
  shareholder-alert ads, awards, anniversaries, dividend notices) and IR boilerplate even on
  the curated wires; legal-profession gossip on the legal trade press
  (`FEED_LEGAL_OFFSCOPE_RE` — jailed solicitors, open threads, apprentices, office tours,
  SRA politics); small-ticket ABF Journal facilities. The Asia-only business desks (SCMP,
  The Straits Times) are switched off. **Audit the live wire any time with
  `node scripts/audit-wire.mjs [--dropped]`** — it runs every live source through the
  Worker's own gates and prints what the wire would carry; a leak is a gap to close with a
  rule here and a headline in `tests/wire-scope.mjs`.
- **R5 — One feed engine, one `.g-feed-row` grid** across Home / Macro / Credit
  / Legal / Palette. No bespoke per-section list markup.
- **R6 — Standard day breaks** on every dated list — the main wire *and*
  sub-lists such as Legal Case Law (`.tw-day`): the micro scale step **10px /
  600**, uppercase, `.04em` tracking, grey band (`--t-head`), label `--t-day` (the
  accent in dark, `#2f6cae` in light — one token, §3). One font (mono, like everything), no per-section
  variants.
- **R7 — Every item is sourced + dated; never fabricated.** Each headline
  carries a real source and link.
- **R7a — No decorative link/arrow glyphs.** Do NOT append arrow symbols (`↗`,
  `→`, `➚`, `»`, or a CSS `::after` external-link arrow) to links or source
  markers anywhere in the app. Link the text itself; for an inline source marker
  use a plain `src` label (see `.dsh-src`). Arrows are visual noise and are not
  used. (The in-app reader's "Open original ↗" / "Open at … ↗" were the last ones —
  removed 2026-10-16; `tests/color-tokens.mjs` now covers `reader-overlay.js`.)
- **R7b — Coverage starts 1 January 2020 (owner rule 2026-10-15).** Nothing dated before
  2020-01-01 is carried as a coverage item: no deal, intel item, LP commitment, manager
  press item (`webNews` / `news`) or legal wire item. Profile FACTS stay (a fund's vintage, a
  firm's `founded` year, a listed vehicle's issue date, case law). A routine that finds an
  older event does not add it; `node scripts/enforce-coverage-start.mjs` removes any that
  slipped in (re-runnable; it also drops the deal's tags, marks its deal-party audit entry
  deleted and turns a checklist event that linked it into "rejected"). Enforced by
  `tests/data-integrity.mjs`.

---

## 3. Colour — only these tokens, used only this way

All colour flows from `--t-*` tokens, defined ONCE, light + dark, on `:root` in the
canonical palette block of `home.css` (v2 bundles every stylesheet, so `:root` reaches
every surface; the old per-surface copies were deleted). **No raw hex in component CSS**
except the notification badge red (`#ef4444`) — the day-break label is the `--t-day`
token (audit 2026-10-16; it was a literal `#2f6cae` in three files).

> **The legacy aliases** (`--ink` / `--muted` / `--faint` / `--border` / `--head`) still
> back older rules. Each must be defined in BOTH themes on `:root` (`v2/css/app.css` light,
> `tui.css` dark): `--faint` was missing in light, so every `var(--faint, #5c6a86)` painted
> the DARK grey on white (audit 2026-10-16). New CSS uses the `--t-*` names.

| Token | Dark | Light | Used for |
|---|---|---|---|
| `--t-ground` | `#141414` | `#e7ebf2` | app background |
| `--t-panel` / `--t-panel2` | `#141414` / `#202020` | `#ffffff` / `#f3f6fb` | panel surface / hover |
| `--t-head` | `#111111` | `#f4f7fb` | header bands, day breaks |
| `--t-grid` / `--t-grid2` | `#212121` / `#2d2d2d` | `#e0e6ef` / `#cdd6e3` | EVERY horizontal divider / outlined boxes only (R44g) |
| `--t-day` | `#fb8b1e` | `#2f6cae` | the day-break heading on every dated list (`.g-feed-dayhdr`, `.tw-day`, `.ew-day`, R6) |
| `--t-ink` | `#eaf0fb` | `#131b2c` | primary text / values |
| `--t-mut` / `--t-faint` | `#8592ad` / `#5c6a86` | `#5e6a84` / `#8b96ac` | supporting facts / dates, sources, counts, labels (R43d — `--t-dim` is retired, folded into `--t-ink`) |
| `--t-accent` | `#fb8b1e` | `#fb8b1e` | active / emphasis only |
| `--t-up` | `#3fc08d` | `#0f9d68` | up numbers + ▲ |
| `--t-down` | `#f26d84` | `#df4763` | down numbers + ▼ |

- **R8 — No colour outside this table.** New shades are added as tokens, not
  inline hex.
- **R9 — Semantic red/green** for all deltas and triangles; **orange = accent
  only** (never body text).
- **R10 — One muted grey** for all secondary labels ("Signed in as",
  "Sign out" → `--t-mut`). No one-off greys, no orange labels.
- **R10a — Feed labels: EIGHT domains, colour + text both name the domain.** The
  wire pill (`.g-feed-code`) is the ONE place a non-delta colour carries meaning.
  Rationalised to **eight domains, each a compact 3-LETTER code** so every pill fits
  the fixed 34px code column neatly — the pill names the item's **domain**, matching the
  colour; it NEVER spells a granular sub-type (DEAL/RAISE/CLO/13F/ALERT/CASE/SCHEME/RP/
  COMM) or a SOURCE brand (BBG/ECON/myFT/Substack/Brew), since the **publication name on
  the row already carries the source**. The **full domain name is the tooltip** (`DESK`).
  Every desk/type key maps UP to its domain in `feed.js` (`DESK`/`DESK_CODE`/`DESK_CLASS`
  collapse to 8 values; `codeKey = o.type || o.desk` still selects the key, now resolving
  to the 3-letter code). The eight (code · full name):

  | Domain | Code | Colour token | Absorbs (keys) |
  |---|---|---|---|
  | News | `NWS` | `--t-news` | `news`, `bbg`, `econ` |
  | Macro | `MAC` | `--t-mac` | `m`, `comm` |
  | Bonds | `BND` | `--t-fi` | `fi` (fixed-income sources, e.g. Bond Vigilantes) |
  | Credit | `CRD` | `--t-crd` | `c`, `deal`, `fund`, `clo` |
  | Legal | `LAW` | `--t-lex` | `l`, `alert`, `case`, `scheme`, `rp` |
  | Hedge funds | `HDG` | `--t-hdg` | `hdg`, `f13` |
  | Research | `RSH` | `--t-rsch` | `rsch` (sell-side / house research, teal) |
  | Letter | `LTR` | `--t-amber` | `n`, `f` (myFT), `s` (Substack), `b` (Brew) |

  `--t-hdg` (`#4aa3f0` dark / `#1f6fd0` light) is a named token. The old per-type and
  per-source classes (`bbg`/`econ`/`ft`/`substack`/`brew`/`deal`/`fund`/`clo`/`comm`/
  `alert`/`case`/`scheme`/`rp`) still carry CSS but no item is assigned them any more —
  every key resolves to one of the eight domain classes above.
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

  | token | base px | `--fs-adj:0.5px` → | used for |
  | --- | --- | --- | --- |
  | `--fs-micro` | 10px | **10.5px** | day breaks · eyebrows · column heads · timestamps · source tags · SRC chips |
  | `--fs-num` | 11px | **11.5px** | numeric DATA — rail/table/FX values, changes, prices, %; one notch under body so tall lining figures don't dominate the text beside them. Text row-labels (names, codes, dates, moods) stay `--fs-body`. |
  | `--fs-body` | 12px | **12.5px** | THE default — prose, feed headlines, list & table row text, reading pane, buttons |
  | `--fs-head` | 14px | **14.5px** | card / panel headings, section sub-heads |
  | `--fs-title` | 16px | **16.5px** | page / article headline (h1) |
  | `--fs-hero` | 26px | **26.5px** | dashboard KPI display figures only |

  `--fs-adj`'s **baseline is `0.5px`** (the scale reads 10.5/11.5/12.5/14.5/16.5/26.5);
  set it to `0px` for the original 10/12/14/16/26, `-0.5px` was the previous baseline.
  Body text is one size on phone AND desktop — identical. The old per-device
  `--fs-bump` is **retired** (kept defined at `0`). **Never hand-write a px
  font-size** — always reference a grid token, so the knob reaches it; this binds
  every NEW surface too (mobile tap-lists, option rows, drill headers, empty
  states). A tappable row is still a **body** list row (padding gives the touch
  target, not font-size). Pin any new body surface in `tests/type-scale.mjs`,
  which reads `--fs-adj` live so it tracks the knob.
- **R11a — The reader can nudge the whole-app size.** Menu → Settings → **Text
  size** is a 1px-step A−/A+ adjuster on the same `--fs-adj` knob (so every surface
  moves together, nothing bespoke). The chosen offset is written inline on `<html>`
  (overriding the `:root` baseline) and persisted to `localStorage.m_fs_adj`; the
  `v2/index.html` boot script re-applies it before first paint, so there is no
  flash and the choice survives reloads/navigation. It clamps to **[-1.5px, 4.5px]**
  (body 10.5 → 16.5), centring on "Default" (0.5px) when unset. The control lives in
  `v2/js/views/menu.js` beside the Theme segmented control; it is covered by
  `tests/v2-menu.mjs` (step/persist/reload/clamp).
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

- **R14a — The selected chip always shows its underline, ONE single-line marker.**
  The active tab/filter chip is marked by a **2px bottom underline** in
  `--chip-ul` — **black in light, white in dark** (`--chip-ul` is set once,
  globally, in `premium.css`) — drawn as ONE inset shadow layer:
  `box-shadow: inset 0 -2px 0 var(--chip-ul)`. **Never a second layer** (owner
  2026-10-15): the old extra `0 1px 0 var(--chip-ul)` line under the element read as a
  DOUBLE underline on every bordered chip ("Europe", Filters, sort / segment chips) and
  is removed app-wide — a selection marker is one line, never two. This exact
  declaration is the ONE selection marker across every tab row app-wide — the Menu chip
  bar, the `.twire-head` tab rows (Profiles, Macro, Transactions, detail section-nav),
  the dashboard nav, the Home wire tabs (`.g-wiretab`) — so no tab row ever reads
  heavier or thinner than another. **Every selectable chip, everywhere (audit
  2026-10-16):** unselected chips are weight **400**, the selected one **600** with this
  one underline and **no fill** — including the DESKTOP left rails (Deals, Profiles,
  Markets — they used an orange 3px side-bar and bolded every item), the profile
  sub-rail (it was blue), the Home desk lanes and chart range (`.g-hero-rg`, blue), the
  header panels' chips (`.na-chip`, every chip was 600), League / Fundraising segments,
  the Filters chips and button (`.tx-fchip` / `.tx-fbtn`, orange tint), the prediction
  filters, the Legal chips, and the $1–15bn / Target / European mid-market toggles
  (`.tfocus-aum`, orange label + fill — R10 "no orange labels"). Guard:
  `tests/style-consistency.mjs`. The base `.tchip.is-on` rule carries it; do NOT
  re-declare a variant per surface. Always give the layer a theme-aware fallback
  (`var(--chip-ul, #000)` in light, `var(--chip-ul, #fff)` under `[data-theme="dark"]`):
  a bare `var(--chip-ul)` with no fallback becomes an invalid declaration the moment the
  token is missing from a scope, and the whole underline silently vanishes
  (`tests/v2-menu.mjs` asserts exactly one layer). The
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

- **R15 — Refreshed every ~2 hours (London).** The full-refresh routine fires every
  ~2 hours through the day; there is NO fixed 05/09/12/17/21 schedule. **Last-refresh
  reflects the actual run** — derive the stamp from the data's real `LAST_CHECKED` /
  the briefing stamp, never synthesise it from a hard-coded clock. The briefing is a
  single edition rewritten on every run (no slots).
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
- **R19 — Monitoring only; no BD tooling.** Wire is a market-monitoring dashboard.
  It holds no personal-contact or relationship data and has no CRM features: no
  contact/LinkedIn imports, target tiers, relationship notes, next-action or
  follow-up reminders, pipeline or outreach drafting. (The Origination Radar
  overlay and the LinkedIn importer were removed 2026-10-13.) Follows/watchlist,
  alerts and search are monitoring and stay.
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
  investment links its source so the label can be checked (R7), and opens in the
  Transactions deal drawer (R36). A fund in *Vehicles* expands in place to its sourced
  facts, named investors (linked to their Investor profile) and sources — there is no
  separate fund page. Ongoing curation of
  `instrument`/`instrumentType` is a daily-refresh task (see refresh-routines).
- **R22 — European credit universe (Dashboard ▸ Credit).** The *European credits* card
  (`credit/js/eu-credits.js` → `EUR_CREDITS`, rendered by `v2/js/credit-roster.js`)
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
- **R23 — BDC roster (Dashboard ▸ Credit).** The *BDCs* card
  (`credit/js/bdcs.js` → `BDCS`, rendered by `v2/js/credit-roster.js`) lists the
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
  live-price wiring are daily-refresh concerns; enforced by `tests/bdcs.mjs` and
  `tests/credit-rosters.mjs`.

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

- **R25 — Market-sizes matrix (Dashboard ▸ Rates ▸ Reference).** The Rates dashboard carries a
  **Market sizes** matrix (in the collapsed **Reference** block, beside the Dalio / Marks cycles) (`MARKET_SIZES` in `macro/js/content.js`, rendered by
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
  header** (`.tui-ph`, matching Chart / Policy rate / the other panes). On **phones** it is a
  **home wire tab (Briefing · Markets · Chart · X Feed)** — swapping onto the single-column
  workspace (it is content, not the markets/rates data, which lives in the **Markets
  home tab** / the shared `loadMarkets` panel; the aggregated news wire is the separate
  News bottom tab). It is a **single,
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
  the Chart is a **home wire tab — the home top-nav reads Briefing · Markets · Chart
  · X Feed (Briefing is the default pane)**. The aggregated news wire + its lane
  selector are the **separate News bottom tab** (news mode), NOT a home pane. The
  Chart tab opens the band
  (with **all six tickers plotted** by default) — swapping onto the single-column
  workspace like the other home wires. The band plots a fixed basket —
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
  desks in the **fixed house order Macro · Bonds · Equities · Credit**
  (Bonds = rates / government & corporate bonds; Credit = private equity / private
  credit fund news)) is surfaced
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
  its source(s), and the prose NEVER narrates the reporting.** State the news directly as
  fact; **never** attribute it via the publication's act — no "the FT reports/explains",
  "Bloomberg notes", "according to …", "<byline> says/writes/warns that", and never fold a
  second outlet's claim into a bullet ("… Bloomberg's Markets Daily notes …"). The source is
  the trailing source line (`.g-hbrief-srcs` → `.g-hbrief-src`, middot-joined) — a
  **clickable link, not a textual mention** (grounding kept, R7). This is an **authoring**
  rule (the daily routine must write bullets this way); `_stripReported` only removes a
  simple TRAILING "…, the FT reports/notes/writes/says" as a backstop and cannot unpick a
  woven-in "the FT explains why …", so those must never be authored in the first place. The desk
  kicker is **entity-decoded before display** (`_deEnt`) so an authored "M&amp;A"/"R&amp;D"
  renders as "M&A"/"R&D", never the double-encoded literal (`_briefDesk`/`_deEnt` in `glance.js`).
  **ALL FOUR DESKS ALWAYS SHOW — no exceptions (owner rule).** The renderer
  (`renderHomeBriefing` in `glance.js`) guarantees a Macro · Bonds · Equities · Credit
  section on every card: it NORMALISES each bullet's kicker to a canonical desk (an
  off-house kicker the refresh may write — Oil, Geopolitics, UK, Private markets, Rates… —
  is folded into the desk it belongs to via `DESK_ALIAS`, never shown as its own section or
  dropped), and SYNTHESISES any still-missing desk with a short state line. The synthesised
  **Bonds** line is **bare live yield pills only** — the **US and UK 10-year** (filled from the
  rates cache like any yield pill — `/api/rates` now serves a `UK 10Y` gilt via CNBC), with **no
  "no fresh story" wording** — and Macro / Equities / Credit fallbacks are pill-free (their live
  levels sit in the top snapshot strip). So a reader never sees a category missing,
  whatever the refresh wrote. **The yields-only Bonds fallback is a LAST RESORT, not a target.**
  There is almost always a live rates/government-bond story on a given day — the refresh routine
  must make **full effort to source a real Bonds bullet** (a WSJ, FT, Bloomberg, Economist or
  comparable rates/treasuries/gilts/credit-spread story with a concrete yield level or `bp`
  move) **before** it ever leaves Bonds to the synthesis. Falling back to bare yields means the
  routine failed to look hard enough, not that no story existed. The authoring target below
  still stands — the routine should write real Macro/Bonds/Equities/Credit bullets — but a slip
  can no longer leave a gap, and
  `tests/briefing-empty-bullet.mjs` asserts the four-desk render guarantee (not the raw data's
  exact kickers). **Fixed desk order — Macro, then Bonds, then Equities, then Credit:** the
  renderer (`DESK_RANK` keys `macro`/`bonds`/`equities`/`credit`) sorts the sections into this
  canonical order regardless of bullet order in the data; **M&A / deal stories are NOT a
  separate desk** — file a corporate deal under Equities, and a **private-equity /
  private-credit fund** story under **Credit** (a PE firm's portfolio exit is Credit, not a
  standalone "M&A" desk). The Credit desk **gives preference to managers / hedge funds in the
  $1–15bn AUM band** (see refresh-routines). **Equities is a REQUIRED section —
  every briefing carries at least one Equities bullet** (the refresh invariant); the
  renderer round-robins the per-desk bullets under the four-bullet cap so each of
  the desks keeps its lead bullet and **Equities can never be pushed off the
  card** by a Macro/Bonds-heavy briefing. **EVERY desk carries a BENCHMARK + a one-line
  market SNAPSHOT (all four, owner rule):** a Bonds bullet names a benchmark yield level
  (the US 10-year, Bund or gilt — a `%` or a `bp` move); an Equities bullet names an index
  level / `%` move (S&P 500, Nasdaq, FTSE) or a mega-cap's price or market value; a Macro
  bullet names a macro benchmark (the US 10-year, the dollar/DXY, Brent/WTI/Gold, or the
  S&P 500 as the risk gauge) with the data/policy catalyst; a **Credit** bullet names an
  **actual credit metric** — a high-yield or IG spread / yield (US HY ≈ HYG, IG ≈ LQD, a
  CDX/iTraxx level), a CLO / new-issue spread, or a specific private-credit deal's **size
  and pricing** (e.g. "$1.2bn unitranche at SOFR+525"). **CREDIT IS DEBT, NOT EQUITY:** a
  private-equity buyout, an M&A auction, or "PE puts X up for sale" is an Equities/M&A story
  and must be filed under **Equities**, never the Credit desk — the renderer's Credit
  fallback shows a live HY (HYG) + IG (LQD) proxy when there is genuinely no fresh credit
  story, so there is never a reason to mislabel an equity story as Credit. A bullet with no
  figure is incomplete — enforced on the committed data by `tests/briefing-empty-bullet.mjs`.
  Every figure is real + sourced (the bullet's `src` or Wire's own live market data), never
  invented. The renderer's per-desk fallbacks each carry a live pill (Bonds US+UK 10Y,
  Equities S&P 500+NASDAQ, Credit HYG+LQD, Macro US 10Y) so even a synthesised desk shows a
  benchmark. **HARD INFORMATION, not a
  headline (every desk):** each bullet must deliver specific, quantified fact — the
  level/size and its move (a `%`, a `bp` count, a `$`/`£` amount, a multiple, a date),
  the named parties, and the mechanism/driver — never a bare qualitative
  characterisation. **Banned** unless the concrete number sits in the same breath: "a
  big push into X", "surprisingly manageable", "in the spotlight", "under pressure",
  "a challenging picture", "weighs on", "eyes a deal". A bullet that would work as a
  newspaper headline (a claim with no figure, size or mechanism) is INCOMPLETE — add
  the number or cut it; prefer one fully-informative sentence over two thin ones. The
  test flags a **headline-short body** (under 60 visible chars after the kicker is
  stripped) so a one-clause stub ("Blue Owl is preparing a big push into insurance")
  turns the suite red before it can ship. **KEEP IT TIGHT:** the desktop card lays the
  four desks out as side-by-side columns in a **fixed quadrant**, so an over-long bullet
  overflows/clips it. One or two sentences per desk (~30–45 words) — lead with the fact +
  its number, add the single most important qualifier, stop; drop connective filler. The
  column grid sits directly under the header (no top margin/rule) and each column is
  line-clamped as a safety; the test flags a body over **360 visible chars**.
  **iPhone-only markets snapshot strip:** on the
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
  meaning "this figure is the **last close**, not a live price" — it never swaps in a futures
  number. It reads the same last-good markets/rates cache
  as the rail (no extra fetch) and stays empty rather than guessing (R7). **Hidden on the desktop quadrant.** On phone the
  **Market Briefing is the FIRST home wire tab AND the cold-load Home default**, and
  **tapping the Home bottom-nav button opens the Briefing pane** (`homeReset` →
  `setWire("brief")`). The news wire + lane selector are the **separate News bottom
  tab** (`showNews` → `setWire("news")`, news mode), not a Home pane. **Inline security pills (both surfaces):** on a
  recognised security's first mention **in each desk bullet** (once per desk, not once per
  brief — owner 2026-10-16: Equities' "The S&P 500 is indicated…" lost its pill because Macro
  had already pilled the S&P 500) the name is **REPLACED** by a chip (`.g-hbt-tk`) — the
  label stands in for the name, so the security appears **once** (the pill), never as text AND
  a pill — showing its ticker/benchmark + the day's move + a direction arrow (e.g. "Honeywell
  gains" → "`HON 0.07% ↓` gains"; "the US 10-year Treasury yield" → "`US 10Y 3bp ↑`"). A
  yield/index pill carries its label up front so it reads even before its live value fills; an
  unresolved name keeps its prose text (no pill to replace it). **Each pill shows the LEVEL
  (price / yield / points) AND the move (%/bp) + a direction arrow** — e.g. `US 10Y 5.27% 4bp↓`,
  `S&P 500 7,771 0.62%↓`, `BRENT 101.97 1.38%↑`, `US 30Y 5.52% 2bp↓` (level in the `.g-hbt-v` span,
  move in `.g-hbt-c`). **Prices come from Yahoo Finance** (indices via `/api/quotes`, equities via
  `/api/secq` → `_yhV7` `regularMarketPrice`, commodities via `/api/markets`); yield LEVELS come
  from the Treasury par curve (`/api/rates`, which also carries **US 30Y** — filtered out of the
  Key-rates rail like the 2Y). A level-less pill is a bug; `tests/home-brief-tickers.mjs` asserts
  every filled pill carries both a level and a change. The pills cover **three kinds** of
  instrument — **benchmark yields, indices, and equities (megacaps)** — detected in the
  prose (`_briefSecNames` — capitalised phrases minus a `SEC_STOP` stoplist of
  countries/currencies/central-banks/calendar/common words). **US Treasury benchmark yields**
  (`BRIEF_YIELDS`) come from the rates cache (bp move). **Major indices** (`BRIEF_INDEX` — a
  curated name→symbol map, **S&P 500 · Nasdaq · Dow · Russell · FTSE · DAX · Nikkei · Hang
  Seng · VIX · …**, most-specific first so "Nasdaq 100" beats "Nasdaq") are matched by that
  map — a curated set is accurate where fuzzy name-resolution isn't — and their live % comes
  from **`/api/quotes`** (the only endpoint that accepts `^`-prefixed index symbols).
  **Commodities** (`BRIEF_COMMODITY` — **Brent · WTI · Gold**) pill the same way but fill
  from the **markets cache** (the source the snapshot strip uses), since `/api/quotes` rejects
  the `=F` futures symbols (`BZ=F`/`CL=F`/`GC=F`). Treasury pills cover **US 30Y · 10Y · 2Y**
  (the rates feed carries all three; 2Y/30Y are feed-only, filtered out of the Key-rates rail),
  and the regex matches a bare "30-year"/"10-year" the way a Bonds bullet names it — not
  "10-year high/low". **STRICT per-desk rule: the Macro, Bonds and Equities bullets must EACH
  name a pillable benchmark** (a Treasury yield, a major index, or a commodity like Brent) so
  every brief shows a live ticker pill on all three desks; **Credit carries a pill only when one
  is available** (optional). This is a hard gate on the committed data — `tests/briefing-empty-bullet.mjs`
  turns the suite red (blocking deploy) if the briefing's Macro/Bonds/Equities desk has no pillable
  instrument, and its `pillable` regex is kept in lockstep with glance.js `BRIEF_YIELDS`/`BRIEF_INDEX`/`BRIEF_COMMODITY`.
  **FRESHNESS — briefing news is CURRENT as of the refresh (strict).** Every bullet carries a
  `date` (the cited item's real `"YYYY-MM-DD"`) and it must be within **4 days of the briefing date** —
  the card never surfaces stale news. The **Credit desk goes quiet for days**; when a desk has no
  fresh, verified item this run, **DROP that desk's bullet rather than back-fill a
  stale deal** (Macro/Bonds/Equities stay — their daily market levels are always current; Credit is
  optional). `tests/briefing-empty-bullet.mjs` fails any bullet with no `date` or one more than 4
  days older than the briefing date (so an 11-day-old deal can't reach the card). This ties to the Credit
  desk's "a multi-day gap is a RED FLAG" sweep rule in `docs/refresh-routines.md`.
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
  stamp. Data: `BRIEFINGS` (tokenless / no-cache — **rewritten on every ~2-hourly
  refresh run**, so a fresh brief appears with no code push), with the
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
  - **USD everywhere (restated 2026-10).** Every manager AUM field (`aum`, `aumTotal`,
    `aumCredit`, `groupAum`) and investor `aum` / `typicalTicket` is USD ($bn / $m). Legacy
    €/£-equivalents were restated ONCE at the ECB reference rates in `AUM_FX`
    (`credit/js/data.js`); each restated record carries `aumFrom` (field → original
    currency), shown on the figure's tooltip ("restated from €…"). The reported figure stays
    verbatim in `aumText`. The $1–15bn focus band is therefore a true USD band. The Managers
    list and the profile header show the SAME figures with the same labels: **Group AUM**
    (`aumTotal ?? aum`) · **Credit AUM** (`aumCredit`). Fund sizes stay in their own reported currency (`ccy`, shown with its symbol).
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

- **R31 — Reader feedback (⋯ "Not interested" / "Mute source").** Every reading-pane
  article carries a **⋯ overflow button** top-right (`_readMenuHTML` in
  `_readShell`, desktop pane + mobile overlay) offering **Not interested** (hide this
  story), **Mute source** (hide every story from that outlet) and **Manage muted…** (a
  review/un-mute sheet). Mutes persist in the shared home prefs
  (`wire.home.v1` → `muted:{ srcs, urls, titles }`) and the **one feed engine drops
  muted items across every lane AND the briefing candidate pool** at a single choke
  point (before `byDesk`/`renderBrief`), so a mute hides content instantly and
  everywhere. Each tap also **POSTs `/api/feedback`** (KV `fb:<email>`, keyed on the
  Access identity) so (a) the client merges the reader's own mutes across devices on
  load (`?mine=1`) and (b) the scheduled refresh routine reads the aggregated dislikes
  and bakes **durable source/topic excludes into curation**. Because the per-user POST /
  `?mine=1` paths rely on the Access identity, **`/api/feedback` MUST stay behind
  Access** (a Bypass there would 401 every write); the admin dump is therefore served on
  a **separate path `/api/feedback-export`** (same handler, `RESEARCH_KEY`-guarded like
  `/api/research-targets`), and it is **only that path that gets a Cloudflare Access
  *Bypass*** (`GET /api/feedback-export?key=<RESEARCH_KEY>`). No new KV namespace or secret. Specs: `tests/home-reader-mute.mjs` (menu + mute hides
  across lanes + persistence + un-mute) and `tests/feedback-route.mjs` (write / `?mine=1`
  / secret dump).
- **R32 — Manager profiles are a MATERIAL feature: history to 2020 + current, for
  the WHOLE roster.** Every covered manager profile (`credit/js/data.js` `managers[]`,
  the Managers lane and `/v2/profiles/`) must carry a real event stream — `deals` /
  `intel` (keyed `managerId`) and the manager's `webNews` — reaching back to **2020**
  (or the firm's inception, where it is younger — check `founded`) **and** kept
  current. This is **not** limited to watchlisted names: the refresh routine makes a
  **bounded, rotating, whole-roster historical backfill a PRIMARY deliverable every
  run** (docs/refresh-routines.md → "Manager-profile depth"), targeting the
  thinnest-covered / missing-pre-2021 / stale profiles first. The worklist is
  computed deterministically by **`node scripts/manager-coverage.mjs`** (`--all` for
  the full table, `--json` machine-readable, `--size=N` for the per-run batch), which
  scores every profile's depth and recency and rotates the target slice by day so the
  whole roster is swept over time. Every backfilled item obeys the non-negotiable **no
  fabrication** rule: a real source URL and a real, non-future date (unknown fields
  `null`); coverage must improve or hold each run, never regress. Spec:
  `tests/manager-coverage.mjs` (tool present; profile-feeding records carry real
  date + URL, none future-dated; backfilled reference profiles keep depth).
- **R33 — Lane-coverage invariant: an item reaches EVERY lane its nature implies.**
  The Home wire lanes are **News · Deals · Profiles · Watchlist · Newsletters · Research**
  (owner 2026-10-16; `WIRE_LANES` in `glance.js` — keys `all` = News, the full wire;
  `deals` = the Credit desk's deal flow: deals, fund raises, CLOs; `manager` = **Profiles**,
  the activity of EVERY profiled entity — managers' deals / intel / web news, hedge-fund
  intel, law-firm alerts and deal / intel headlines naming a tracked investor — current +
  previous month, newest first, ★ on followed rows; `profilesEvents()` in `glance.js`,
  spec `tests/profiles-lane.mjs`). On iPhone the six keep the usual heading-row spacing (chips `0 12px`) and the row scrolls sideways (R42b), the selected lane kept in view (owner 2026-10-16). Each of these MUST catch what belongs to it:
  (a) **research** → the **Research** lane (`RSH` desk code / `research[]`);
  (b) a **newsletter** → the **Newsletters** lane (`LTR` / `newsletters.js`);
  (c) anything **about a covered manager / fund / hedge fund** → the **Managers**
  lane (and the All lane) — via a `managerId`-tagged `deals`/`intel`/`webNews`
  record; (d) anything **about a watchlisted name** → the **Watchlist** lane. The
  client routes any correctly-TAGGED item automatically (by desk code, `managerId`,
  or the follow set) — so coverage is a **tagging** duty, not a routing one. A story
  that only appears as a raw newswire row but concerns a covered or watchlisted
  entity is a **tagging miss**: the refresh routine's newswire cross-check
  (docs/refresh-routines.md → Credit) must promote it into a tagged `deals`/`intel`
  record so it surfaces in the Managers/Watchlist lanes, not only the raw wire.
  Personnel/strategy moves count (observed 2026-10: M&G / Duncan Batty sat in the
  newswire but not the Managers lane until tagged to `m105`).
  - **Watchlist = every followed profile, NO date limit.** The **Managers** lane is
    a recency wire (current + previous month). The **Watchlist** lane is the user's
    deliberate follows and has **NO backdate limit** — only NOTIFICATIONS are
    time-boxed (the 7-day bell). It aggregates **every followed profile type**:
    managers → their `deals`/`intel`/`webNews`; hedge funds (`follows.hf`) →
    `HEDGE_INTEL`; law firms (`follows.firm`) → legal alerts (`items`). Every profile
    type is **followable** — the ☆ star (`FOLLOW_TYPES` in `credit/js/shared.js`, now
    incl. `firm`) is on the manager, investor, hedge-fund (`credit/detail.js`) and
    law-firm (`legal/detail.js`) pages. `watchlistEvents()` in `glance.js` merges and
    de-dups them newest-first (a story recorded under two identities of one firm
    collapses to one row). Spec: `tests/home-watchlist-lane.mjs`.
- **R34 — iPhone navigation (the five-tab reorg).** On phones the chrome is:
  **(a) bottom tab bar = `Home · News · Dashboard · Profiles · Transactions`**
  (`TABS` in `chrome.js`; Menu is NOT a bottom tab). **(b) Menu is the top-right
  hamburger** in the header action cluster (`#na-menu`, `data-key="menu"`), so the
  phone cluster is **Search · Notifications · Menu** — the header **chart/markets icon
  (`#na-mkt`) is desktop-only**. **(c) Home top-nav = `Briefing · Markets · Chart ·
  X Feed`** (`.g-wiretabs`); **Briefing is the cold-load default**; **Markets** is the
  full Equities/Macro/Predictions panel, mounted into `#g-mktpane` via the shared
  `nav-actions.loadMarkets({switcher:"swipe"})` (`wire-markets`) — on the phone the
  three views are a **horizontal swipe carousel** (`.na-mktswipe` scroll-snap track +
  a 3-dot `.na-mktdots` strip), **no switcher row**; the reader swipes between
  Equities · Macro · Predictions. The market-snapshot pills stay on
  **Briefing only** (`#g-hbrief-strip`), not duplicated into Markets. **(d) News is its
  own bottom tab** — `/v2/news/` resolves to the **Home view in news mode** (so the
  feed engine is never double-mounted): the runtime flags `data-v2tab="news"` and calls
  `ctrl.showNews()` (`setWire("news")` → `.wire-newsmode`), which shows the aggregated
  feed + the lane selector (`News · Deals · Profiles · Watchlist · Newsletters · Research`) and
  **hides the four home tabs**. The desktop terminal is untouched (all of this is
  `≤1200px` / phone-gated). Specs: `tests/v2-shell.mjs`, `tests/v2-header.mjs`,
  `tests/home-mobile-wire-tabs.mjs`, `tests/markets-panel.mjs`.

  **Home never shows the News page** (owner 2026-10-16). Home and News share ONE kept-alive
  view, so its mode follows the ACTIVE TAB on every path: the runtime calls the view's
  `sync(tab)` (`glance.syncMode`) after each navigation that lands on it — a tap, Back /
  edge-swipe, a return to the kept-alive view from another tab (News → Deals → Home used
  to show the preserved news wire under a lit Home tab), and a mount that finishes after the
  tab changed. Leaving news mode restores the reader's Home pane (Briefing · Markets ·
  Chart · X Feed, else Briefing). Spec: `tests/home-news-mode.mjs`.
- **R35 — Navigation keeps your place (back-stack, tab memory, URL state).** (UX review
  2026-10.) **(a) Drill-downs are history entries on every device:** a link, a search
  result, a notification or a row that opens another section (Transactions → a manager,
  a BDC → its adviser, News → a profile) `pushState`s, so Back / the iPhone edge-swipe
  returns to the exact previous view. Only **bottom-tab taps on touch** replace the entry
  (the R34 rule that the edge-swipe never pages between top-level tabs). **(b) Tab memory:**
  tapping a DIFFERENT bottom tab returns that section to wherever it was left (its URL +
  scroll, `_lastUrl`/`_scrollY` in `runtime.js`); only re-tapping the ACTIVE tab resets it
  to its first part (`home()`, guarded by `tests/nav-reset.mjs`). Home ↔ News share one
  view and keep their own switch behaviour. **(c) In-app links never reload:** any
  same-origin `<a href="/v2/…">` is routed by the runtime's delegated click handler (bubble
  phase, so a view's own handler wins); non-anchor callers (the search palette) use
  `window.__wireNavigate`. **(d) Lists keep their scroll:** Profiles remembers each list's
  scroll when a profile opens and restores it on Back / ‹ / the chip (instant, never the
  smooth `html` scroll). **(e) State lives in the URL:** a profile's sub-tab is a path
  segment (`#/manager/<id>/investments`, `#/hf/<id>/holdings`, `#/firm/<id>/alerts`),
  written with `replaceState` so Back leaves the profile in one step. `?tab=` is honoured
  in the hash or the query. **(f) Back after every internal link (owner rule 2026-10-14):** every in-app
  history entry carries `wdepth` (0 on the entry the app opened on, +1 per push — a runtime
  link or a view's `location.hash =` drill-down; a replace keeps it), mirrored onto `<html
  data-can-back>`. **iPhone:** Back is the iOS left-edge swipe (`history.back`) — no button,
  the phone header stays clean. **Desktop:** a ← arrow (`#nav-back`) at the right end of the
  ticker row (`.wtk-bar`, beside `#wticker` — never inside it, brief.js rewrites it),
  directly under the Menu icon; dimmed and inert at depth 0, live otherwise, and it calls
  `history.back()`. The header's left side (logo,
  platform pills) never changes. Never push a history entry that bypasses the runtime's
  `pushState` wrapper. Specs: `tests/nav-backstack.mjs`, `tests/nav-back-button.mjs`.

- **R36 — Transactions: modes, deals as objects, URL state.** (UX review 2026-10.) The
  modes are **Lending · Structured credit · Secondaries · Manager M&A** (the European
  credits and BDC rosters moved to Dashboard ▸ Credit in 2026-10 — see R39j)
  (Manager M&A and the filters / columns / sorting / grouping: see **R39**) — the deal-flow
  groups (`TX_GROUPS` in `credit/js/tx.js`) named as the market uses them: *Lending* =
  origination (direct lending/unitranche, ABL, NAV/fund finance, rescue, restructuring,
  other); *Structured credit* = CLO, CFO, SRT; *Secondaries* = GP-/LP-led and NPL/loan
  portfolios. (The retired `#/primary` URL canonicalises to `#/lending`.) **Every view is
  in the hash** — `#/<mode>?type=&sec=&reg=&size=&ccy=&sp=&lender=&period=|from=&to=&focus=&q=&sort=&grp=&deal=`,
  (the old `#/credits?q=|open=` and `#/bdc?open=` links redirect to
  `/v2/dashboard/credit?credit=` / `?bdc=`; legacy
  `#/<mode>/<type>`, `?min=` and `focus=1` links canonicalise); a type / mode change, a
  pill removal or an opened deal is a history step (Back undoes it); typing a search and
  toggling chips inside the open Filters sheet replace. **A deal is a
  first-class object:** a row opens its **drawer** (borrower, sponsor, lender → profile,
  fund, type, sector, amount, date, source, and *same borrower / same sponsor / more from
  this lender*); `#/deal/<id>` deep-links to it (search results, What's new, a manager's
  Investments row all open deals here). **Every filter applies to every view** (incl. the
  default All list) and shows as a removable pill with *Clear all*. **Search spans all three groups.** **Phone:**
  deals are two-line cards (borrower · amount / date · lender · type), never a
  sideways-scrolling table; the drawer replaces the list in the page flow. The **borrower**
  column never repeats the lender: `dealCounterparty()` (`v2/js/deal-parse.js`) falls back
  to the sourced headline when the parse only found the lender. Specs:
  `tests/transactions.mjs`, `tests/nav-backstack.mjs`.

- **R37 — Dashboard: Europe-first market state (review 2026-10).** The Dashboard is the
  at-a-glance state for a **European credit-fund** reader. **(a) Sub-tabs, in priority
  order: `Credit · Rates · Legal · Equities · Hedge Funds`** (`SUBTABS` in
  `v2/js/dashboard/app.js`); **Credit is the default** (cold load and the bottom-nav
  re-tap, `home()`). Macro and Bonds are **merged into Rates**; the retired
  `/v2/dashboard/macro|fixed-income` URLs resolve to Rates and are canonicalised in place.
  **(b) Credit** leads with the **ICE BofA OAS stack in basis points** (the rates feed
  reports OAS in %, ×100 client-side) — **Euro HY first**, then US HY / IG / CCC — each
  tile dated with its **1W / 1M move**; then **Europe — defaults & distress** (`EU_DISTRESS`,
  curated + the live Eurostat bankruptcy index) beside **US private credit**
  (`PRIVATE_CREDIT`, labelled US); the **stress list** (Europe first, each debtor drills to
  the European credits roster, `?credit=<name>`); the **maturity wall**; **CLOs & fund
  closes** counted from Wire's own deal records (labelled "tracked by Wire", never a market
  statistic); and, last, the **reference rosters** — European credits and BDCs (R39j). The
  **credit wire** rail is de-duplicated (same date + headline or URL) and capped at 15;
  a deal opens Wire's Transactions drawer (`#/deal/<id>`), intel links its source.
  **(c) Rates**: regime pills (ECB · BoE · Fed · Cycle), the **policy table ECB · BoE ·
  Fed** (rate LIVE from the ECB / BoE databases where loaded, next meeting, stance, as-of),
  the **money-market strip** (€STR · 3M Euribor — the ECB **monthly average**, labelled so,
  as daily fixings are EMMI-licensed · SONIA · SOFR), yield curves (**Euro AAA (ECB)** ·
  gilts · Treasuries), curve shape + **10Y spreads to the Bund**, sovereign levels and
  changes (**G7 + Western Europe only**, R4c), "why it moved", the Fed / BoE paths, and a
  collapsed **Reference** block (cycles, market sizes). **(d) Legal**: restructuring &
  insolvency (the legal desk's `ri` items), the **regulatory calendar** (`REG_CALENDAR`,
  dated + sourced, upcoming first, undated = "TBC"), then the search. **(e) Truth in
  labelling:** a `LIVE` badge renders as **"snapshot"** and flips to "live" only once a live
  payload has actually been applied (`markLive`); **every data card shows a date**;
  curated text is entity-decoded before escaping (`txt()`), so "&amp;" never leaks.
  **(f) Layout:** superseded by **R40** (responsive packing); no card's content may spill or overlap a neighbour
  (wide tables scroll inside `.dsh-scroll`). **(g) Data:** European rates/curve/distress
  come from **`/api/eurates`** (`handleEuRates` in `src/index.js` — keyless ECB Data Portal,
  BoE IADB, Eurostat; deterministic, no AI step; edge-cached 1h); `freshness-audit.mjs`
  watches every curated Dashboard stamp (`dashboard_pc`, `dashboard_eu_distress`,
  `dashboard_regcal`, `dashboard_fedwatch`, `dashboard_matwall`, `dashboard_market_sizes`,
  `dashboard_snapshot`). Specs: `tests/dashboard-europe.mjs`, `tests/eurates-parse.mjs`,
  `tests/dashboard-terminal.mjs` (no spill/overlap at 1024–1600px), `tests/dashboard-credit.mjs`,
  `tests/dashboard-sections.mjs`, `tests/dashboard-tab-labels.mjs`.

- **R37 — One profile layout; compare, timeline, CSV; the bell stays in Wire.** (2026-10.)
  **(a)** Every Profiles page — manager, hedge fund, investor, law firm, CLO — uses the
  same layout: identity header (☆ name, sub-line, coverage line "N tracked · N in 90 days ·
  latest …", chips, Peers / Sources) over a section rail + panes (`.tdet-tabbed`, built
  with `v2/js/profile-tabs.js`), the tab recorded in the URL. Investor = Commitments ·
  Mentioned in · Profile; Law firm = All · Alerts · Matters · PC deals · Office; CLO =
  Activity · Other CLOs. **(b) Timeline** (manager tab): deals per quarter since 2020 — one
  series in a neutral ink token (no legend), a native hover tooltip per column (count,
  disclosed ≈USD volume, group split) on a full-height hit area — then every deal by year,
  each opening its deal panel. **(c) Compare** (`#/compare/<a>/<b>`, from a manager's
  *Compare* dropdown): two managers side by side — identity, Group / Credit AUM, strategies,
  funds, vehicles, tracked items, deal counts (all / 12m / 90d), 12-month mix, median
  disclosed size, top sectors, latest deal, advisers; either side swappable. **(d) CSV**:
  every Profiles list, every Transactions view and both Dashboard rosters (credits, BDCs) export exactly
  what is on screen (filters / search / sort applied) via `v2/js/csv.js`. **(e) The bell**
  (and its Watchlist tab) opens items IN Wire: a deal → its deal panel, a fundraising item →
  the manager profile focused on it, a hedge-fund story → the fund profile focused on it, a
  law-firm alert → its alert page; the panel closes on navigation. Cases / schemes with no
  in-app page keep their judgment link. Spec: `tests/nav-backstack.mjs`.

- **R39 — Transactions + Profiles filters; deal tags; Target.** (Filters review 2026-10.)
  **(a) Deal tags.** `credit/js/deal-tags.js` (`DEAL_TAGS`, tokenless + `no-cache` like
  data.js) holds, per deal id, curated fields read from the deal's OWN sourced text —
  `country` (borrower / asset / target, not the lender — from the deal text, else
  researched from a public source and stored with `cs` = source URL and `cb` = hq |
  incorporated (an operating borrower) | issuer (a CLO / CFO / fund / vehicle's domicile)
  | portfolio (where a traded portfolio's assets are), shown in the drawer and CSV;
  offshore issuer domiciles (Cayman, Jersey, Guernsey, Bermuda) form their own
  "Offshore centres" region, never Europe; `null` only when no source confirms it), `sector`
  (the borrower's industry: `SECTOR_TAGS` in `credit/js/tx.js`), `amountKind`
  (financing · fund · portfolio · ev · aum · other — what the parsed amount measures),
  `event` (CLO issuance only: new · reset · refi) and `managerMA` (an acquisition of / stake
  in an asset manager). `tagsOf()` expands them; an untagged deal falls back to the
  classifier's sector and region "Unspecified" — never a guess shown as a tag. Region =
  `REGIONS` (UK & Ireland · DACH · France & Benelux · Southern Europe · Nordics ·
  Pan-European · Other Europe · North America · Rest of world). **(b) Sizes are deal
  sizes.** Only `financing / fund / portfolio` amounts count in the size facet, totals,
  medians and size sorting (`sizeCounts`); an EV or target-AUM figure shows muted with its
  kind ("EV $2.8bn") and never counts. **(c) Manager M&A** (`managerMA`) is its own mode,
  out of Lending deal flow (columns Target · Acquirer · Country · Value · Date · Source).
  **(d) De-duplication:** the same lender + date + USD size + type from two outlets is ONE
  row; the other source shows as "+n" and "Also reported" in the drawer. **(e) One-row bar + Filters panel** (2026-10 simplification).
  Every Transactions mode and every Profiles list has ONE control row: **search · (Target) ·
  Filters** (a sliders icon with a count) — on iPhone just **search · Filters**: the region
  (Europe / All regions) and Target / $1–15bn buttons live only in the Filters sheet (R44e). Nothing else sits above the list — no type
  sub-labels in the rail, no type strip, no pills: active filters read as ONE quiet summary
  line ("Direct lending, UK & Ireland, Target · Clear"), only when something is active.
  The **Filters panel** holds everything else — desktop: a dropdown over the list under its
  bar (a click outside closes it); phone: it takes the list's place and "Show N" returns.
  Panel order: **Managers** (All · $1–15bn AUM · Target) · Type · Date (ONE menu: presets,
  years, last six quarters, custom range) · Region (with *All Europe*) · Size; **More
  filters ▸** adds Sector · Currency · Sponsor · Lender and Sort & group. Footer: Clear all ·
  Export CSV · Show N. Multi-select chips with live counts (OR within a facet, AND across).
  On phone the stats line is dropped (the panel's "Show N deals" carries the count).
  **(f) Columns per mode**
  (Lending: Borrower · Lender · Sponsor (only when any) · Sector · Country · Amount · Date ·
  Source; Structured: **Vehicle** (the audited CLO / fund name — never the news headline,
  which stays as the cell's tooltip and in the drawer) · Manager · Type · Event · Country ·
  Size · Date · Source;
  Secondaries: Fund / portfolio · Buyer / lead · Type · Country · Size · Date · Source);
  Amount / Date / Lender / name headers sort (blanks always last); **group by** lender ·
  month · sector · region · type with a count + disclosed-volume subtotal per group; a
  **stats strip** (numbers only, R20): N deals · ≈$ disclosed (n/N) · median · top 3
  lenders. **(g) The control bar wraps** and every control stays inside the viewport at
  ≥1024px (spec); the as-of banner shows only when the ledger is stale. **(h) Target.** `credit/js/target.js`
  (`targetFit`; `scripts/lib/niche.mjs` re-exports it) scores each manager: **Target** =
  European HQ / European fund focus + AUM ≤ $15bn + a 15%+ strategy; then Adjacent ·
  Other credit · Non-credit. The **$1–15bn** button on Transactions and Profiles ▸
  Managers is a tri-state: $1–15bn → **Target** → off. Profiles ▸ Managers opens
  **Target-first** (tier, then AUM) with a sortable **Fit** column. **(i) Profiles lists** use the same one-row bar and
  panel: Managers → Managers (All · $1–15bn · Target) · Strategy · Region; More → AUM band ·
  In market · Show & sort (★ Following, sort). Hedge funds → AUM · Strategy · Region ·
  Views (Monitor, Cross-holdings). Investors → Type · Mandate; Law firms → Tier · Practice.
  The bar's button is **Target** on Managers and **$1–15bn** on Hedge funds (desktop; on
  iPhone it lives only in the Filters sheet, R44e). Managers and
  Hedge funds carry a sortable **90d** column (tracked deals + news in 90 days; tooltip =
  latest date). Phone lists are **card rows**; their sort sits in the panel. The card rows
  carry no HQ (R44e) — it stays in the desktop table and on each profile page. **(j) Credits & BDCs live on Dashboard ▸ Credit** (`v2/js/credit-roster.js`, full-width
  cards under *Reference rosters*), not in Transactions. Each card has the SAME anatomy on
  desktop and iPhone — a one-row bar (search · sort menu · CSV), then **two-line rows**
  (name · headline figure / sector-or-manager meta) that **expand in place** (tap again to
  close); never a table, never sideways scroll. Credits: quick chips *All · ▼ Downgraded ·
  ▲ Upgraded*, a 12-row preview + *Show all N*; a row shows rating (with its source) and the
  tracked deals naming the obligor + their lenders. BDCs: *Listed* / *Private (non-traded)*
  sections; the row shows size, adviser (→ profile), NAV, non-accrual and the live Px/NAV
  or GATED; expanding gives the sourced facts, SEC links and the holdings fetch. The open
  row is in the URL (`?credit=<name>` / `?bdc=<ticker>`, replaceState); the palette, the
  stress list and the old Transactions `#/credits` / `#/bdc` links land on it. Desktop caps
  each list at ~560px and scrolls inside. Specs: `tests/transactions.mjs`,
  `tests/credit-rosters.mjs`, `tests/bdcs.mjs`, `tests/nav-backstack.mjs`,
  `tests/profiles-filters.mjs`. **(k) Borrower / issuer column.** Every deal was audited
  (2026-10): `p` in deal-tags is the counterparty verbatim from the deal's own text and
  `r` its role — borrower · issuer (incl. a BDC / manager issuing its own notes, shown
  even though it is the lender, and a CLO vehicle) · target · fund · seller · none. It wins
  over the headline parse (`dealCounterparty` in `v2/js/deal-parse.js`); never a
  descriptor ("AI", "UK", "fintech"). The drawer labels the row by role. A party not named
  in the text but researched carries `ps` (source); `pq: "unconfirmed"` (inferred, e.g. from
  a CLO series' numbering) shows with an **asterisk** ("Margay CLO V*"); `pq: "placeholder"`
  reads "<Manager> vehicle" where no source names the vehicle. Spec:
  `tests/deal-parse.mjs`. **(l) Link convention** (as the newswire reader): underlined links appear only in
  READING content. In the Transactions **deal card** (and the reader body) an EXTERNAL link
  has an **orange** underline (`--accent`); in the deal card and profile info cards (`.tbiz`
  facts, the description) an INTERNAL link (profile / deal / fund) has a **blue** underline
  (`--t-link`). Everywhere else links keep their own style: a source stays the subtle grey
  source name or the boxed SRC tag (briefings, Dashboard, profile news rows, table Source
  columns), and a name in a table or list is plain text (still clickable). The reader's
  "Open original" stays orange, bold, no underline. (The `!important` on these underlines
  only beats premium.css's global `a { text-decoration: none !important }`.) Spec:
  `tests/link-convention.mjs`. The newswire's "Open original" stays
  orange, bold, no underline. (The `!important` on these underlines exists only to beat
  premium.css's global `a { text-decoration: none !important }`.)
  **(m) Deal parties** (2026-10 party audit). A deal carries its parties explicitly:
  `borrower` (exact entity when the source names it, else the group), `sponsor` (+
  `sponsorId` when tracked), `lenders: [{ name, managerId, role: lead | participant |
  arranger | investor, amount, ccy }]` and `managerRole` — the real role of the tracked
  firm the record is filed under (lender · sponsor · borrower · issuer · adviser). **One
  deal = one record**: a club deal is one row whose Lender cell reads "Investec +1";
  the Lender facet, lender grouping, "top lenders", Dashboard "Most active lenders" and
  the CSV count EACH lender. Every party links to its profile (a tracked firm → its
  manager page; any other company → `#/co/<name>`); every lender named in a deal has a
  profile (`managers` with `category` bank | lender, `profileStub` until researched).
  The drawer reads headline → summary → **Borrower / company · Sponsor · Lender(s)
  (role-labelled, own amount) · Arranger** → Type · Sector · Country · Amount · Date ·
  Advisers · Source. The **Source** label is the OUTLET (CoStar, Bloomberg, the firm's
  own press page) — a manager's name only when the URL is that manager's own site
  (`isOwnSite` in util.js). A manager's Investments tab lists every deal it is party to,
  each tagged with its role there (Lender / Sponsor / Borrower / Manager). Data:
  `backfill/deal-parties.json` → `scripts/apply-parties.mjs`. Spec: `tests/deal-parties.mjs`.
  **Confidence (owner rule 2026-10-15):** a party confirmed by a source is shown plain; one
  that is unconfirmed but VERY likely (a CLO vehicle from the series numbering, a lender
  named only in the record's own summary) is shown with an **asterisk** ("Margay CLO V*",
  flags `borrowerUnconfirmed` · `sponsorUnconfirmed` · `lenders[].unconfirmed`); one that
  would be pure speculation is left out and reads **"Unknown"** (never "<Manager> vehicle").
  **Arms stay separate:** a bank's general banking arm and its asset-management arm are
  different profiles ("Investec" ≠ "Investec (Direct Lending)", "HSBC" ≠ "HSBC Asset
  Management", "Goldman Sachs" ≠ "Goldman Sachs Alternatives"), as are an asset manager
  and its capital-markets desk ("KKR Capital Markets" ≠ KKR Credit); a tracked arm is
  linked only when the source names it (`ARM` in apply-parties.mjs).

---

- **R38 — Subscriber newsletters read in full in the reading pane.** The owner's own
  newsletter emails (Bloomberg, WSJ, The Economist, Reuters…) open as the FULL issue in
  the reading pane, not a padlock. The routine POSTs each email's plain-text body to
  `/api/nl-ingest` (RESEARCH_KEY-guarded; the one Access-Bypassed write path) → KV
  (`nlb:<id>`, 60 days); the reader reads `/api/nl-body?id=` (requires an Access identity,
  `no-store`). `newsletters.js` carries only `body: true` — **body text is never committed**
  (the repo is public). In `glance.js`, `_NL_BODY` makes such a row unlocked
  (`_isPaywalled` → false) and routes `_fetchRead` to `/api/nl-body`; a missing body falls
  back to the "open the original" link. `nlBlocks` (src/index.js) turns the email into
  blocks: section titles → headings, URLs / markdown links dropped, everything from the
  footer (unsubscribe / preferences / "you received this" / ©) cut. Spec:
  `tests/newsletter-reader.mjs`.

- **R40 — Dashboard: one anatomy, responsive packing, fill cards.** (Design review
  2026-10; supersedes R37(f).) **(a) One anatomy.** Card header = title (`--fs-body`/600
  ink — the Dashboard's dense terminal scale; weight, not size, carries the hierarchy;
  truncates) · meta on the right (count, LIVE/snapshot badge, date, select), split by
  `tidyHeaders()` into `.dsh-h-t` / `.dsh-h-r`. Table column heads are `--fs-micro`/600 muted (R11);
  numbers are right-aligned, tabular, `--fs-num`; dates are micro/faint in ONE format ("13 Oct 26", `isoDay` → util `fmtD`, R43b). Metric lists use the
  KPI row (`kpiRow`: label · value · period · SRC, grid `minmax(0,1fr) auto 64px 34px`);
  rate / spread / gauge lists use the mini table (`dsh-mini`: name · level · 1W · 1M ·
  As of · SRC; on phone the As-of column drops and the date rides under the name). Empty
  cells read "—". **(b) Responsive packing (desktop ≥901px).** `packMid()` places the
  middle-column cards absolutely in `round(width / 480)` columns (max 6, never more than
  the tab's cards can fill; a tab too short to reach ~80% of the screen height steps down
  to fewer, wider columns, never wider than ~960px); cards keep a natural size — std = 1 column, `dsh-wide` = 2,
  `dsh-span` = all. It hill-climbs over nearby swaps scoring empty space plus a cost per
  place a card moves from its priority order; full-span strips and the Reference block
  are pinned. Slack is absorbed by **fill cards** first and, for a remainder ≤120px with
  no fill card, by stretching the last card's frame (content stays top-aligned).
  A ResizeObserver re-packs on width or content change (`dataset.ph` stops loops). Rail
  width steps 320 / 380 (≥1700) / 420 (≥2300) / 460px (≥3000). **(c) Fill cards**
  (`fillCard`, `.dsh-fill`) are charts (`lineChart`, natural height up to 460px) or long
  lists (start 240px, show more rows or scroll; spare height goes first to the list with
  the most content still hidden). **Every chart is labelled on both axes**: the x axis is
  **time** — five evenly spaced dated ticks (three on phone; "12 Oct" for spans under ~4
  months, "Dec 25" beyond) with the title "Date, daily" / "Date, weekly", every point
  placed at its own observation date (`historyDates` on `/api/rates`) — and the y axis
  carries value ticks with the unit and its title above the tick column. The yield-curve
  chart (a single-date curve) carries "Yield" ticks and "Maturity". **Notes and meta tags**
  (deal type, source, "as of", captions, legend notes) use `--fs-micro`; table cells and
  prose notes stay `--fs-body`. List rows de-duplicate the same story (date + headline).
  **One events row everywhere on the Dashboard** (`newsLi` / `newsUl`, which now render the
  shared R43 events row `evRow` from `feed.js`): the date first, the headline beside it, the
  status tag, the source last; the type / manager / firm on a second line — credit wire, CLOs
  & fund closes, distress deals, research, rates and legal wires, restructuring, case law,
  funds and banking alerts, hedge-fund news and Legal search results all use it
  (superseded the old headline-first row, owner 2026-10-15 — see R43).
  **Lists are never capped at an arbitrary N** — every tracked item is listed and the card
  scrolls. Fill cards built ONLY from data Wire already holds or
  a sourced live series: Credit — spread history 1M, all-in yields & BBB (ICE BofA via
  FRED), most active lenders (90d) and restructuring & distress deals (tracked by Wire),
  CLOs & fund closes; Rates — central-bank calendar (`CB_CALENDAR`, verified dates),
  money-market rates 2M, central-bank balance sheets (Eurosystem ILM weekly · Fed WALCL ·
  BoE Weekly Report reserve balances `RPWB56A` and loan to the APF `RPWZ4TM` — the Report
  publishes no total line, so those two are shown and labelled as what they are),
  FX EUR/USD · GBP/USD (Fed H.10), Euro AAA curve 2M (2Y/10Y/30Y + 2s10s), why it moved;
  Legal — case law, restructuring, funds alerts, banking & finance, most active firms
  (30d / 90d, main area, latest), activity by practice area; Equities — VIX 2M, earnings;
  Hedge Funds — every tracked fund by AUM (strategy, HQ, "est." where estimated), strategy
  families (keyword-grouped from each fund's own label), reported performance, HF news,
  funds in the news (90d), per-fund 13F holdings. A gauge whose feed
  is missing shows "… unavailable — <source link>", never a number. **(d) Data:** the
  gauges ride `/api/eurates` `extra` (`EU_EXTRA_SERIES` in `src/index.js`: FRED via the API
  key when set, else fredgraph CSV; ECB weekly periods dated to the statement Friday).
  **(e) iPhone (≤900px).** Card headers keep the LIVE / SNAPSHOT badge pinned top-right on
  the title line (≤760px: `.dsh-h-r` dissolves; other meta drops to a micro line below; a
  long title wraps beside the badge). No card scrolls inside the page: a long list (fill-card lists,
  tables, Legal search results, the news rails, the Credits / BDC rosters) shows a **10-row
  preview + "See all N ›"**, which opens the
  whole list in a **full-screen sheet** (`openSheet`: mounted on `<body>` above the tab bar,
  its own scroll, a search bar, ✕ / Esc to close; a link inside navigates and closes it). A
  roster's "See all" MOVES the live roster into the sheet (its own search / sort / CSV / rows
  keep working) and puts it back on close. The phone decision is re-checked on every
  re-pack and width change (a home-screen app can mount before its width is final); hidden
  rows also carry an inline `display:none` so no row layout can out-rank them. At ≤760px a wide table marked `dsh-stk-src` re-renders as **stacked rows**
  (`stackTables`: name + key figure + SRC on one line, the other fields on a micro grey line,
  labels from `data-stk-lab`) — nothing scrolls sideways or is clipped; heatmaps tighten so
  every window column fits. **No tap colours:** every Dashboard `:hover` rule sits inside
  `@media (hover:hover)` and changes to ink, never orange; names in tables/lists are plain
  text (no underline); toggles ("Show detail") are muted grey; focus borders grey.
  Specs: `tests/dashboard-layout.mjs` (six widths 1280–3440: no spill, no overlap, no
  vertical gap >14px; gauge values + sources; empty-payload honesty),
  `tests/dashboard-phone.mjs` (390px, both themes: no inner scroll, no sideways scroll, no
  ellipsis, no orange at rest or on tap; See-all sheet), `tests/eurates-parse.mjs`.

- **R41 — Finance-user review (2026-10-15).** The rules a European private-credit lawyer
  graded the app against, and how they are enforced:
  **(a) No empty live card** — a live card that fails or returns nothing shows dated
  last-known values badged LAST-KNOWN (v2/js/live-cache.js + dashboard/js/live-snapshot.js);
  "unavailable" only when nothing was ever captured (`tests/dashboard-europe.mjs`).
  **(b) One event, one record; no false precision** — see refresh-routines "Duplicates, date
  precision…"; dates render through `fmtDateP` / `fmtDate(record)` (`tests/search-quality.mjs`).
  **(c) Europe-first** — the Dashboard credit wire and Funds in market card default to
  European borrowers/funds with a one-tap "All regions"; Deals opens unfiltered since
  2026-10-15 (R44b, `tests/transactions-europe.mjs`).
  **(d) Search** matches record summaries, runs newest-first within a rank and never
  silently caps — "Show all N" (`tests/search-quality.mjs`). **(e) The bell is material
  only** — earnings-call dates, webcasts, awards, podcasts, outlooks, newsletters stay out
  (`tests/notifications-materiality.mjs`). **(f) Who advised / what terms** — the deal drawer
  shows advisers and terms only from the deal's own source or a tracked firm's announcement
  (`v2/js/deal-advisers.js`, `tests/deal-advisers.mjs`). **(g) Borrower pages** at
  `/v2/profiles/#/co/<name>` gather deals, plans, judgments, alerts and the UK registry
  (public Companies House register, no API key — `tests/borrower-page.mjs`,
  `tests/companies-house-parse.mjs`). **(i) Everything opens inside Wire** — every external
  link opens the app-wide reader (`v2/js/reader-overlay.js`); only a source that can't be
  read in the app (paywall, bot-wall, PDF, empty extraction) shows its one external link
  (`tests/in-app-reader.mjs`). Paywall / link-out lists live in `v2/js/read-policy.js`. **(j) Dashboard lists preview 10 rows +
  "See all N" on desktop as well as iPhone** (desktop "See all" is a centred panel);
  Home rails keep fixed widths on every screen (`tests/dashboard-desktop-preview.mjs`). **(h) Rates** show a market-implied path from prediction-
  market odds, labelled as crowd probabilities (`tests/rates-implied.mjs`).
- **R42 — Offering build (owner-approved 2026-10-15).** **(a) Navigation (R13):** **Home · Dashboard · News ·
  Deals · Profiles** on BOTH iPhone and desktop (owner 2026-10-16 — supersedes the
  2026-10-15 "Markets" label and the desktop nav without News; on desktop, News opens the
  news wire view).
  Route keys are unchanged (`dashboard` reads **Dashboard** — page title "Wire Dashboard" —
  `transactions` reads **Deals**).
  Restructuring and Fundraising are folded into Deals: both are chips in the Deals mode bar
  (Fundraising = `#/fundraising`; Restructuring = the hub, which carries the same mode bar
  with Restructuring lit), and Deals stays lit on both (`v2/js/chrome.js` navKeyFor;
  `tests/nav-r13.mjs`). **(b) iPhone heading rows** (Deals modes, the hub's
  sections, Profiles lists, profile tabs, Menu, Markets) are ONE sideways-scrolling row,
  hidden scrollbar, never clipped labels; a tapped chip scrolls into view; the row moves
  ONLY sideways (`overflow-y:hidden` + `touch-action:pan-x` — overflow-x:auto alone let it
  drag vertically). **(c) Header
  cluster:** phone Search · Ask Wire · Notifications · Menu; desktop Ask Wire ·
  Notifications + Menu. **No header ☆ Watchlist** (removed by the owner 2026-10-16 — it
  duplicated other surfaces): the watchlist is Menu ▸ Watchlist (empty → suggested
  European managers + law firms with a one-tap Follow), News ▸ Watchlist, the bell's
  Watchlist tab and Profiles ▸ ★ Following; "New since last visit" is Menu ▸ New
  (whatsnew.js). Ask Wire shows suggested questions only when committed data backs them
  (`tests/header-watchlist.mjs`, `tests/header-ask.mjs`). **(d) Plain labels:** the wire carries NO "?"
  (owner 2026-10-15); what every code means is on Menu ▸ Sources (`feedCodesHTML` — a new
  code must join it);
  live-state badges read live / not live / "as of <d Mon HH:MM>", never SNAPSHOT /
  LAST-KNOWN; the European ≤$15bn tier reads "European mid-market"; the manager tab reads
  "Firm facts" (key `business`) (`tests/feed-legend.mjs`). **(e) Currency honesty (R4):**
  restated AUM / fund sizes read native with USD in brackets — "€53.5bn ($59.9bn)"
  (`aumParts` / `fmtAumDual` / `fundMoney` in credit/js/shared.js); USD only when no native
  currency; lists sort on USD. **(f) Manager "at a glance" (R8)** strip under the name:
  AUM · HQ · strategies · latest fund + status · deals in 90d · top LPs · advisers (incl.
  named on its deals) · key people (only named with a role); empty facts are left out
  (`tests/manager-glance.mjs`). **(g) People (R11)** — a Profiles list of hires / departures
  / promotions built only from the items' own text (`v2/js/profiles/people.js`,
  `tests/profiles-people.mjs`). **(h) Law-firm lens (R10)** — glance strip, Practice +
  Region filters from the item's own areas / tags / jurisdiction, and a Credit deals tab
  with side (lender / borrower / sponsor, else "Side not stated") (`v2/js/legal/firm-lens.js`,
  `tests/lawfirm-lens.mjs`). **(i) Restructuring hub (R6)** `/v2/restructuring/` (part of Deals; no in-page section
  chips; every list row is ONE fixed height — name line + meta line, ellipsis, full text
  as its title — so 10-row previews and See all line up across cards): stress list ·
  Part 26A plans / Part 26 schemes · R&I case law · rx deals · insolvency stats · hearings
  (public HMCTS Court & Tribunal Hearings Rolls Building cause list via `/api/causelist`,
  company matters only — personal bankruptcies never shown) · every company links to its
  borrower page (`tests/restructuring-hub.mjs`, `tests/causelist-parse.mjs`). **(j) Deals
  views:** League tables `#/league` (lenders · sponsors · law firms · financial advisers by
  count and disclosed ≈USD; lenders from `d.lenders[]` else `managerId`; a club deal counts
  once per lender) and Fundraising `#/fundraising` (funds in market — shared
  `v2/js/funds-market.js` · first / final closes · LP commitments · LP ↔ manager)
  (`tests/tx-league.mjs`, `tests/tx-fundraising.mjs`). Deal drawer and borrower page have
  Share (navigator.share, else copy link). **(k) Coverage & sources (R15)** Menu ▸ Sources
  `/v2/menu/sources` is THE "what is failing or stale" view: every surface with what it
  tracks, sources, cadence, count, latest date and GOOD / STALE / FAILING (stale = past its
  freshness-audit window; failing = 3× the window or a failed live `/api` probe), worst
  first under "Needs attention" with reason + fix; stamps from `dashboard/js/health.js`
  (`health-check --write`) re-judged client-side. A new surface joins both
  `freshness-audit.mjs` and the status-page CATALOG (`tests/status-page.mjs`). **(l) Digest
  (R14)** Menu ▸ Digest `/v2/menu/digest[/weekly]`, built only by `scripts/build-digest.mjs`
  from committed data, every item with its source URL + date (`tests/digest.mjs`).

- **R43 — One professional list & table style, everywhere (owner 2026-10-15).** Applies
  to every surface (Home, News, Markets, Deals incl. Restructuring / Fundraising / League
  tables, Profiles, Menu, Digest, Sources, sheets and the reader). **(a) Events = any list
  or table of dated items** (deals, alerts, cases, plans & schemes, hearings, fund closes,
  LP commitments, people moves, news / digest rows). Not dated market data (rates, spreads,
  index levels). **(b) Column order:** an events row/table LEADS with the date and ENDS with
  the source (the SRC chip or outlet name) — except the iPhone Deals card, which drops the
  source column (R44e; the source stays in the deal drawer). Date format "15 Oct 26" everywhere; on the news
  wire, already grouped under day headers, the first column stays the time ("13:46").
  Status tags (SANCTIONED, ADMINISTRATION …) sit next to the item's name, before the source,
  in one muted tag style. **(c) Two lines max per events item, on every screen (iPhone
  included — never wrap further):** line 1 = headline / name, line 2 = meta, each one line
  with an ellipsis; the full text is the row's `title` (hover / long-press) and in full
  when opened. One fixed row height per list so previews align (cf. R42 i; the iPhone News wire and notifications are the one exception — R44j) — and ONE compact height
  app-wide (owner 2026-10-15, "like the Deals page"): every events row, the narrow news
  wire (Home / News) and the iPhone Profiles card rows all sit at `--ev-h` (46px; 56px
  under the Comfortable density) with a 12px gutter and two lines. The leading column is
  ONE style everywhere: a list's date ("15 Oct 26", `.c-date`) and the wire's time ("16:58",
  `.g-feed-time`) both read `--fs-micro`, `--t-faint`, tabular figures, top-aligned with
  line 1. A Profiles list (All · Managers · Hedge Funds · Investors · Law firms), which has
  no date, leads with the entity TYPE — Manager · Hedge fund · Investor · Law firm — in the
  same style, on desktop (inside the first cell, header "Entity") and iPhone (the card
  row's first item, line 2 indented under the name); drawn from `data-lead` by CSS so sort,
  URL state and CSV never see it. People keeps its date. The leading column is also ONE
  WIDTH per form factor: `--c-date-w` = **52px on iPhone** (it fits "28 Sep 26", 50px) and
  64px on desktop, always with an **8px gap** — so on iPhone every list's headline starts
  at the same x, 12 + 52 + 8 = **72px**, on News, Deals, Fundraising, Profiles and People
  (no page-specific lead). Labels shorten to fit on iPhone — **"H Fund"** for Hedge fund
  (Manager · Investor · Law firm fit whole); desktop keeps the full word. **Audit
  2026-10-16:** League table cards lead with their rank in the same column (name at 72px,
  line 2 under the name); the Restructuring hub's sections are full-bleed on iPhone (no
  side borders), so its rows start at 72px like the rest of Deals; on desktop a table's
  date column is the lead column at EVERY width — `--c-date-w` of content, the name
  column takes the slack (Deals' date stretched to 178–543px, People's to 84–215px), and
  the desk wire keeps the one 8px gap (it was 10px). **Every list row carries its full
  text in its `title`** — the wire (`feedRow`, the manager wire) and the profile wires
  (`.tw-row`) had none; build it with `rowTip(...)` (feed.js). **(d) Three
  text tiers only:** primary `--t-ink` (white in dark, near-black in light) for the
  name / headline / key figure; mid grey `--t-mut` for supporting facts (type, amount,
  court, counterparty); subtle `--t-faint` for dates, sources, counts and labels. `--t-dim`
  is retired (fold into ink). **(e) Bold ONLY for headings** (section, card, sheet titles)
  — plus the owner's one exception: the reading pane's "Open original at …" link (and the
  in-app reader's matching "Open at …") in bold orange. No bold body text, names, tags,
  figures or table headers; table header cells are small capitals in `--t-faint`.
  **(f) Even, responsive columns:** one shared table style — date and source columns
  fixed and narrow; numeric columns right-aligned, tabular-nums, sized to content; text
  columns share the remainder with a sensible min / max (`minmax()`), never wrapping a
  single word or leaving one column stretched while another clips. It must look neat at
  laptop (1366), desk monitor (1920) and ultrawide (2560 / 3440) widths and on iPhone.
  **(g) The shared primitives (T9/T10) — use these, never a per-surface copy:** `fmtD`
  (`util.js`) is THE list/table date; `evRow` / `evList` (`feed.js`) is THE events row
  (`.g-ev`: `.c-date` · `.g-ev-t` · `.c-tag` · `.c-src` / `.g-ev-m`, height `--ev-h`); the
  profile wire row (`.tw-row`) and phone-restacked tables (People, Dashboard
  `data-stk-date` tables) take the same grid; `tableCols(root)` (`feed.js`) tags every
  table cell with its column role (`.c-date` `.c-num` `.c-text` `.c-tag` `.c-src`; an
  events table also carries `data-events="1"`, a chart-table opts out with
  `data-cols="off"`); `feed.css` "R43" holds the one table head, the column widths, the
  one muted tag style and `b, strong { font-weight:inherit }`. Day-break headers and chart
  axes keep their own date labels (headings, not list cells). Specs guard every rule
  (`tests/style-r43.mjs` desk widths 1366 / 1920 / 2560 / 3440 + header panels + search
  palette; `tests/style-r43-phone.mjs` iPhone light and dark; shared probe
  `tests/fixtures/r43-probe.mjs`).

- **R44 — Owner follow-ups (2026-10-15).** **(a) "All" first.** Deals and Profiles each
  open on an **All** tab, the first chip in their bar: Deals ▸ All (`#/all`, the default
  route) lists every deal across Lending · Structured · Secondaries · Manager M&A with a
  Type column; Profiles ▸ All (`?tab=all`, the default) is one directory of every
  manager, hedge fund, investor and law firm (`v2/js/profiles/all.js`) with the shared
  search, Type filter, Following, sort and CSV. The Restructuring hub's copy of the Deals
  bar carries All too. **(b) No default filter on Deals.** Every Deals view opens
  unfiltered — the list (`scope` defaults to all regions; Europe is one tap, `scope=eu`
  in the URL), League tables (region "All regions") and Fundraising (funds in market
  "All regions"). This supersedes R41(c)'s Europe-first default *for Deals* (the
  Dashboard cards keep theirs). **(c) Single underline** — see R14a. **(d) Back goes back.**
  Every in-page back control (the Profiles ‹ chevron, the deal drawer ‹) returns to the
  page you were on immediately before — `history.back()` whenever the app holds in-app
  history (`<html data-can-back>`, R35) — and only a cold deep link falls back to the
  list. Specs: `tests/transactions.mjs`, `tests/transactions-europe.mjs`,
  `tests/tx-league.mjs`, `tests/profiles-people.mjs`, `tests/nav-reset.mjs`,
  `tests/v2-menu.mjs`, `tests/back-previous.mjs`. **(e) iPhone trims.** On iPhone the Deals card
  drops its source column (the headline takes the width; the source stays in the deal
  drawer) and the Profiles card rows drop HQ (it stays on the profile page). Desktop keeps
  both. This is a deliberate phone exception to R43(b)'s "end with the source" and is
  not a loss of information. The headline figure — the deal amount, the profile's AUM /
  revenue — sits at the **right end of line 2, at line 2's size and grey** (`--fs-micro`, `--t-mut`), so line 1
  is the headline / name alone (People keep their date lead). The iPhone bars are **search ·
  Filters** only: Deals' region button (All Europe) and European mid-market, and Profiles'
  Target / $1–15bn, are in the Filters sheet. Profiles ▸ People rows carry **no move badge**
  (HIRE / DEPARTURE / PROMOTION) on iPhone: line 2's "to / from / at" carries the move, the
  type rides in the row title, and the Move filter still applies.
  **(f) One iPhone geometry** (owner 2026-10-15, "the spacing doesn't quite look right"):
  every heading row (News lanes, Deals modes, Profiles lists, the hub, Menu, Markets,
  profile sub-tabs) starts at the screen edge with its **first label on the 12px gutter**
  — chips are `0 12px` (the News lanes and profile sub-tabs, which must fit the screen per
  R2d b, keep `0 6px` / `0 4px` inside but pad their first label to the gutter) — and the
  selected tab is weight 600 everywhere (the hub's chips no longer drop it). Every search
  row is the same: **8px above and below on iPhone (43px), none on desktop (28px)** — Deals
  matches Profiles. Lists start their headline at 72px (R43c). Spec:
  `tests/phone-geometry.mjs` (390px light, 430px dark). **Audit 2026-10-16:** a heading
  row's chips keep their natural `0 12px` width and are never stretched (a stretched chip
  centred "Chat" at 15px on a 430px iPhone); the bars that must FIT (Home tabs, Markets,
  News lanes, profile sub-tabs) share the width but pad their FIRST label to the gutter
  (the Home tabs' "Briefing" sat at 23–28px); the header panels' chips are a heading row
  too. **One search-row control height:** on desktop the input and every button in the
  row share the input's 20px (the Filters button was 26px, toggles 19px), 26px on iPhone,
  and the row's gutter is 12px (`.tpanel-h` was 11px); Markets' roster bar (`.crr-bar`)
  follows it. A selected chip in a sideways row is scrolled into view when the row
  renders (`revealSelected`, util.js — the hub landed with "Restructuring" cut off).
  **(g) One divider weight** (owner 2026-10-15, "some line breaks are heavier than
  others"): EVERY horizontal divider — list rows, the line under the header, the tab row,
  the search row, section heads, table rows, cards, the bottom tab bar — is `1px solid
  var(--t-grid)` (#212121 dark / #e0e6ef light). `--border` / `--t-grid2` are for OUTLINED
  boxes only (search fields, buttons, chips), never a divider; and a list never draws a
  top rule under a bar that already has a bottom one (no doubled line). The same holds
  for a strip under a header (the manager glance drew a top rule under the identity
  header's bottom rule), a group row in a table (`.dsh-geo` added a top rule under the
  previous row's), and the desk terminal's last panel in a column, which sits on the
  footer's top rule (audit 2026-10-16).
  **(h) No colour desk codes on the wire** (owner 2026-10-15): News / Home wire rows read
  time · headline, then the source on line 2 — like every events row. The code stays in
  the markup (the row's desk, for filters and search) but is not drawn. Spec: `tests/phone-trim.mjs`.
  The same goes for line 2 elsewhere (audit 2026-10-16): the search palette's code is the
  one muted outlined tag, and a People row's "→" takes line 2's grey. **Notifications (and
  saved stories) ARE the News wire row** (owner 2026-10-16): date · headline, the source
  alone on line 2 — no desk code, no right-hand source column, no tinted / orange-barred
  "new" rows; "New" / "Earlier" are the wire's day-break band (`--t-day`, R6). Built as the
  News wire row itself — `feed.js feedRow` (`.g-feed-row`, with `nf-row` for the panel's click handling; the panel body is a `feedwrap` container) — so ONE set of rules styles News, notifications and saved stories on every surface (owner 2026-10-16: "they should share rules with News"); the desk stays in `data-desk`.
  **(i) Dark only** (owner 2026-10-16: "eliminate light mode from desktop and iPhone — I
  never use it"). The boot script in `v2/index.html` always sets `data-theme="dark"`,
  whatever the OS asks for or an old `m_theme_pref` says; Menu ▸ Settings has no Theme
  control and nothing follows the OS scheme. Rules elsewhere that say "light and dark"
  now mean dark only; the light token values remain in the stylesheets as the base
  layer the dark overrides sit on, but are never shown. Spec: `tests/theme-toggle.mjs`.
  **(j) iPhone: the wire row reads in full** (owner 2026-10-16) — ONE rule on `a.g-feed-row` in feed.css, so it holds wherever the wire row is drawn. In the News section
  (every lane: News · Deals · Profiles · Watchlist · Newsletters · Research) and the
  notifications panel (All and Watchlist tabs), each headline WRAPS to at most **three
  lines** (`-webkit-line-clamp:3`), the row drops its source line and the ★, and rows take
  the height their headline needs (min `--ev-h`). The source and paywall state stay in the
  reading pane ("Open original at …") and the row's title. This is the one exception to
  R43(c)'s two-line, one-height rule; desktop keeps the two-line wire row. Spec:
  `tests/phone-wire-wrap.mjs`.

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
    `dashboard/js/data.js`, `newsletters.js`, `research.js`, `ft.js`, and the **generated**
    `home-data.js`) is imported with **NO
    `?v=` token** and served `Cache-Control: no-cache` (see `_headers`). Every
    importer therefore uses one tokenless URL → a **single module instance**
    (the old cross-file `?v=` drift that double-instanced a module and blanked a
    page is now structurally impossible), and freshness comes from ETag
    revalidation, not a hand-bumped token. This is deliberate: the ~2-hourly refresh
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
  modules). Because it runs on every build it is ALWAYS in sync with the ~2-hourly data
  refresh; the committed copy is a source-mode/dev convenience (regenerate it with
  `node scripts/gen-home-data.mjs` after editing a desk data module). One runtime
  loads once; switching tabs swaps a keep-alive view in memory (no document
  reload). The app still runs unbundled from source (`node tests/run.mjs` serves
  the repo; `TEST_ROOT=dist node tests/run.mjs` proves the built output serves
  identically).
- **T3 — Full suite green before deploy.** `node tests/run.mjs` (the full suite) must
  pass; any new user-visible behaviour gets a spec.
- **T4 — Zero console/page errors** on every view (enforced by the page-error
  checks).
- **T5 — No horizontal page scroll;** safe-area insets respected; touch targets
  meet the current minimum.
- **T6 — Deploy discipline:** publish to `main` by rebasing onto the latest
  `origin/main` and pushing (`git fetch origin main` → `git rebase origin/main` →
  `git push origin HEAD:main`, retrying on non-fast-forward). An interactive session
  may also commit directly to `main`. Any working branch is **ephemeral** — rebased
  and pushed to `main` straight away; **no long-lived feature branch and no PR**
  unless explicitly asked. Never stack on already-merged history. (CLAUDE.md "Branch
  & deploy policy" says the same.)
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
- **T20 — Hygiene ratchets (audit 2026-10-16).** `tests/spec-hygiene.mjs` holds the
  suite's debt to budgets that may only FALL: fixed-time waits in specs
  (`waitForTimeout(n)` / `setTimeout(r, n)` — wait for a condition instead; the style and
  geometry specs carry none) and `!important` in the stylesheets (T16); and no helper in
  `feed.js` / `util.js` calls itself (`tableCols` re-registered itself from its own
  resize handler — now one module-level `_reflowCols`). **Dead CSS goes with its feature:**
  the audit removed ~800 rules (≈85 KB) whose every selector named a class no JS or HTML in
  the repo uses (retired BDC / credit tables, the old Transactions type strip and group-by
  buttons, the Home "Saved" panel, theme toggle, Markets slide-over …). When a feature
  leaves, its CSS leaves in the same commit.

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
- TradingView — symbol search is the reference record for the stressed names' listed
  bonds (`CR_BONDS`), and its free **Mini Symbol Overview** widget is the bond quote on the
  Restructuring hub ("Listed bonds — quotes", Quote sheet) and the borrower page
  (`v2/js/bonds.js`). The widget's own frame is embedded directly (no TradingView script in
  Wire's page) and draws the number itself — Wire never reads, stores or relabels it — and
  every widget is captioned as a delayed exchange quote on the named venue, not a
  composite price, with the TradingView link. Only widget-quotable venues (Tradegate,
  gettex, Frankfurt, Munich, …) are used; see refresh-routines §bonds.

### 8.2 Rates, macro & official statistics
- FRED — Federal Reserve Bank of St. Louis (`fred.stlouisfed.org`)
- U.S. Treasury (`home.treasury.gov`)
- Federal Reserve Board (`federalreserve.gov`)
- Federal Reserve Bank of New York (`markets.newyorkfed.org`) — SOFR
- Bank of England (`bankofengland.co.uk`)
- European Central Bank (`data.ecb.europa.eu`) — deposit rate (FM), €STR (EST), monthly 3M Euribor (FM), euro-area AAA curve (YC), Eurosystem weekly balance sheet (ILM) via `/api/eurates` (R37, R40)
- FRED gauges via `/api/eurates` `extra` (R40) — ICE BofA Euro/US HY effective yield (`BAMLHE00EHYIEY`, `BAMLH0A0HYM2EY`), US BBB OAS (`BAMLC0A4CBBB`), Fed total assets (`WALCL`), VIX (`VIXCLS`), EUR/USD · GBP/USD (`DEXUSEU`, `DEXUSUK`)
- Bank of England database (IADB) — Bank Rate `IUDBEDR`, SONIA `IUDSOIA`, Weekly Report reserve balances `RPWB56A` and loan to the APF `RPWZ4TM` via `/api/eurates`
- Eurostat `sts_rb_q` — EU27 bankruptcy-declarations index via `/api/eurates`
- UK Insolvency Service official statistics (`gov.uk`, OGL) — monthly company insolvencies (curated, `EU_DISTRESS`)
- UK Office for National Statistics (`ons.gov.uk`)
- Eurostat / European Commission (`ec.europa.eu`)
- DBnomics (`api.db.nomics.world`)
- S&P Global PMI (`pmi.spglobal.com`)
- ISM (`ismworld.org`)
- TradingEconomics
- OECD (`oecd.org`) — Economic Outlook, growth/inflation projections, Economic Surveys (via Google News newsroom bridge)

### 8.3 News wires & financial press
> **DISPLAY-ONLY exclusion — never a data/search exclusion.** The readable-only policy
> below governs ONLY what the live **newswire displays**. It does NOT restrict which
> sources may be used anywhere else in the app. Every source — including the paywalled
> premium outlets (Bloomberg, FT, WSJ, The Economist, Reuters) and specialist/paywalled
> data services (Creditflux, Private Debt Investor, Octus/Reorg, Debtwire, With
> Intelligence, Preqin, Hedge Fund Alert, Institutional Investor) — remains **fully in
> scope for DATA COLLECTION and provenance**: deal / intel / manager / hedge-fund /
> legal / macro records should cite whatever reputable source verifies the fact and its
> exact date, paywalled or not. When SEARCHING for verified data, **never exclude or
> down-rank a source for being paywalled or non-reader-openable** — that property only
> decides whether a headline is shown in the live wire, never whether a fact may be
> recorded. (A data item whose `sourceUrl` is a paywalled outlet is correct; its "open
> original" link simply opens externally rather than in the reading pane.)
>
> **Readable-only policy (2026-10).** The live wire carries only sources that render
> in the reading pane. The hard-paywalled **premium four — Financial Times, Bloomberg,
> The Wall Street Journal, The Economist** — are **switched off** at source (commented
> out in `FEED_SOURCES`, reversibly; the FT desk's static side is gated by `FT_DESK_ON`
> in `v2/js/home/glance.js`). **Nikkei Asia** (hard paywall) and **The Lawyer** are
> dropped. **Channel NewsAsia was removed as a wire source (2026-10, owner request).**
> **Reuters was removed as a wire source (2026-10)** — reuters.com is bot-walled
> and never opened in the reading pane, so its headlines were dead-ends. 
>
> **Owner rule — every newswire source reads in-pane (2026-10-14).** Wire is a private,
> single-user, non-commercial tool and the reading pane is a key feature, so every source
> that serves its article publicly is read in-pane — including bot-shielded ones via the
> on-demand browser proxy (**Jina by default; Firecrawl only for the `READ_FC_HOSTS`
> allowlist**, `readProxyAllowed`) and SCMP's metered pages via `READ_OPEN`. The one hard
> line: **`READ_PAYWALL` hosts are never fetched** (no paywall is ever bypassed); the
> owner's own subscriber content reaches the pane through their newsletter emails (R38).
> `READ_LINKONLY` is an empty switch to send a host back to headline + link. Spec:
> `tests/reader-terms.mjs`. The old ≤30% paywalled-share cap was removed.
- Associated Press (`apnews.com`) — openly-readable global wire (via Google News bridge)
- **Added 2026-10 (owner-approved, trialled in-pane by `scripts/source-trial.mjs`):** European Central Bank, Bank of Japan, Bank of Canada (central-bank feeds); Euronews Business; AltAssets (private markets). The Guardian and Above the Law also passed the trial but stay OFF (removed 2026-09; not re-added without the owner's say-so). Law Society Gazette is pending — its feed returned no items in the trial.
- CNBC (`cnbc.com`)
- MarketWatch
- City AM (`cityam.com`)
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
- ✅ **Research lane (RSCH desk).** A dedicated Home wire lane (All · **Research** · Managers · Watchlist · Newsletters) for sell-side / house research, teal `--t-rsch`. **Self-contained** — it is NOT the Views/commentary or Substack streams. **Gmail-sweep ONLY:** the reader's subscribed house-research emails (JPMorgan Eye on the Market, Apollo Daily Spark, Goldman Briefings, Morgan Stanley, PIMCO, BlackRock Investment Institute, Guggenheim…) swept into **`research.js`** by the refresh routine (same mechanism as `newsletters.js`: a `PUBLISHERS` sender map + a regenerated `RESEARCH` array), each with a readable "read online" link. A live Google-News auto-pipe (Apollo / Oaktree / AQR, `research: true` + `gnews`) was tried and **retired** — those house sites block server-side reads, so every item fell back to "open at the publisher" and none read in-pane; the email versions render cleanly. The `research` flag plumbing (`feedParse` → `feedQualityKeep` bypass → `/api/feed` → the client `research` desk in `glance.js`) is kept for any openly-readable research RSS added later. See `docs/refresh-routines.md`.
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
- ✅ Moody's — free CreditView blog + /insights research, wired via Google News bridge (FI desk), read in-pane
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
- HMCTS Court and Tribunal Hearings (`court-tribunal-hearings.service.gov.uk`) — Rolls Building daily cause list (company matters) for the Restructuring hub's hearings card

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
