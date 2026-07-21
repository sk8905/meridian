# Auto-refresh routine (Claude Routines)

**Five identical routines** keep all three Meridian platforms current — scheduled
at **05:00**, **09:00**, **12:00**, **17:00** and **21:00** (Claude Routines runs a single schedule per
routine, so create five routines that all use the prompt below). Each does a **full
refresh of all three apps** — Credit (deals, fundraising, mandates/launches, manager website
news, **fund-record reconciliation, new managers/funds, rotating manager-profile
re-verification, and deep-research enrichment of watchlisted names**), Legal (legal alerts, case law, **and restructuring schemes &
plans**) and Macro (**refresh the live-indicator cache, update curated recent prints
and central-bank rates, roll the upcoming-releases dropdown forward, rewrite the key
macro news headlines, and review the Commentary/Cycle/Bubble guidance**). Together
they replace the previous separate Credit-daily, Credit-weekly and Legal-daily
routines.

Keep this file in sync with the routine prompt pasted into the Routines UI — it is
the source of truth for the prompt.

> **Repo structure.** The repo is split into a root sign-in landing page +
> **`credit/`** (Meridian Credit) + **`legal/`** (Meridian Legal) + **`macro/`**
> (Meridian Macro). Credit and Legal keep their data in `js/data.js`; Macro's live
> indicators are fetched server-side by the Worker (`src/index.js`, the `/api/macro`
> endpoint), with a few curated series and all editorial guidance in
> `macro/js/content.js`. The site deploys from the **`main`** branch (Cloudflare
> redeploys on every push to `main`).

## Watchlist deep-research — one-time setup

The routine deep-researches the names users **follow** (star on any manager, fund or
investor). Those follows live in per-user Cloudflare KV, so the routine reads the
aggregate set through a small, secret-guarded Worker endpoint. Set this up once:

1. **Secret.** Pick a long random string and store it as the Worker secret
   `RESEARCH_KEY`: `npx wrangler secret put RESEARCH_KEY`. Put the SAME value in each
   of the four Routines' environment (as `RESEARCH_KEY`) so the prompt's
   `X-Research-Key` header matches.
2. **Let the routine past Access.** The whole site is behind Cloudflare Access, so a
   headless routine is blocked at the edge unless you either (a) add an Access
   **Bypass** policy scoped to the single path `/api/research-targets` (simplest — the
   endpoint's own `RESEARCH_KEY` check is then the only guard), or (b) issue an Access
   **service token** and send `CF-Access-Client-Id` / `CF-Access-Client-Secret` with
   the request. Option (a) is recommended.
3. **Done.** `GET /api/research-targets` (with the header) returns
   `{ users, manager:[ids], fund:[ids], lp:[ids] }` — the union of every user's
   watchlist, never who follows what. The endpoint is read-only. If the secret is
   unset it returns 503 and the routine simply skips the deep-research block.

Until this is configured the routine still runs its normal full refresh; only the
extra deep-research pass on watchlisted names is skipped.

## Invariants

- **Sync first.** Always start from the latest `main`: `git fetch origin`, then
  `git checkout -B claude/affectionate-einstein-9hhzga origin/main`.
- **Preflight staleness check.** After syncing, read the current `LAST_CHECKED` /
  `LAST_CHECKED_TIME` in both `data.js` files and `META` in `macro/js/content.js`.
  If the previous run looks MISSING —
  the last stamp is roughly a full cadence stale (>~9h given the ~3–8h cadence), or a
  prior same-day run that should exist is absent — call it out at the top of the run
  summary. This turns a silently-dropped earlier run (e.g. one that lost the publish
  race) into something visible instead of letting it hide behind the next run.
- **Window.** Add items published since the last run. The five runs are ~4h
  (05:00→09:00), ~3h (09:00→12:00), ~5h (12:00→17:00), ~4h (17:00→21:00) and ~8h (21:00→05:00) apart,
  so look back ~24 hours to be safe — dedup removes any overlap. Verify each item's EXACT publication date from the
  source; never invent a URL, date, figure or quote. Dedupe every candidate by URL
  and normalised headline/citation against the data already in the file.
- **`time` field (Home feed ranking) — stamp it once, at creation.** For every NEW
  item you ADD that carries a `date` — Credit `deals`/`intel`, Legal
  `items`/`cases`/`restructurings`, Macro `NEWS`/`ARTICLES`/`COMMENTARY` items —
  also set a `time` field, a `"HH:MM"` 24-hour string in **Europe/London**:
  - If the source gives a minute-level **publication time**, use that (converted to
    London), e.g. `time: "14:05"`.
  - Otherwise use **this run's time** — the time of the routine run that FOUND the
    story (i.e. `LAST_CHECKED_TIME` for the run you are performing), e.g. `"17:25"`.
  Either way the value is written ONCE when the item is first added and **must never
  be rewritten on a later run** — an item keeps the time of the run that found it,
  NOT the latest run. Never guess a publish time you can't verify; the run-time
  stamp is the honest fallback. The Home feed leads each row with this per-item
  `time`, groups rows under a per-day date header, and ranks them newest→oldest by
  `date`+`time`. The feed shows this per-item value ONLY — there is no global
  fallback, so a story's time never re-times to a later run. Do NOT rewrite an
  item's `time` on a later run, and do NOT stamp old records with the current run
  time (that would misdate them as "found now"). A recent-item backfill already
  stamped existing July items with the run time of the commit that first added
  them; items with no `time` simply lead with the headline.
- **Historical depth (not just current-year) — always add what you uncover.** The
  ~24h window only governs which *newly surfaced* items a run hunts for — it is
  NOT a floor on an item's own date, and it is NOT a reason to discard a real
  item. **Standing rule: whenever a search surfaces a genuine, source-verifiable
  item that is not already in the dataset, ADD it — even if its date falls
  outside the ~24h window (as far back as 2016 inclusive).** Never drop a verified
  item just because it is "old" or "out of window"; the window bounds the hunting
  effort, not eligibility. Never bump or round an item to a recent date to make it
  fit — always record its real publication/event date, verified from the source,
  and dedupe as usual (an item already tracked is skipped, not re-added).
- **IDs.** For every array, COMPUTE the current maximum id in the file and use the
  next integer — never trust a number quoted here. Applies to all id series:
  Credit `deals` (d…), `intel` (i…), `managers` (m…), `funds` (f…); Legal `items`
  (u…), `cases` (c…), `restructurings` (rx…). (Illustrative only — as at
  2026-07-08: Credit deals → next d519, intel → i388, managers → m127, funds →
  f237; Legal items → u644, cases → c59, restructurings → rx61. Always recompute.)
- **Editing existing records & adding entities.** Only add a manager/fund or edit a
  fund status/`raised` or a manager's AUM/profile when backed by a verifiable
  public source. Never fabricate: set unknown fields to `null`, mark estimates with
  `estimated: true`, and keep each new/edited record's `sources` pointing to real
  URLs. Reuse existing field names exactly (see a neighbouring record as a template).
- **Private-credit scope — exclude equity-only entities.** Meridian Credit tracks
  European **private credit** only. Do NOT add a manager (or its funds) whose
  business is purely **equity** — private-equity/buyout, equity real estate, equity
  infrastructure, or growth/venture equity — even if it turns up in a deal or raise.
  Only add a manager that runs a genuine private-**credit** strategy (senior/direct
  lending, unitranche, mezzanine/junior debt, distressed & special-situations
  *credit*, opportunistic credit, structured credit/CLO, asset-based lending, real
  estate **debt**, infrastructure **debt**, NAV/fund finance, specialty finance); a
  new fund is in-scope only if it is a credit fund. An existing *credit* manager's
  equity-side *group* news may still be recorded as `webNews` (Category B is not
  re-scoped here) — but never create a standalone equity-only manager or fund.
  **Never re-add these equity-only firms** (deliberately removed 2026-07-01): **EQT,
  PAI Partners, TDR Capital, Astorg, BlackRock Private Equity Partners, Amro
  Partners, Equitix, Greycoat Real Estate.** If a candidate deal/raise is attributed
  only to one of these, skip the item rather than re-creating the manager.
- **Sourcing.** Prefer primary/verifiable public sources. Most firm/manager sites
  block automated fetching, so enumerate new article URLs with `site:<domain>` web
  searches and verify dates. Skip data-aggregators (GuruFocus, Tracxn, ZoomInfo,
  Crunchbase, PitchBook, SimplyWall, MarketBeat).
- **Cache-busters.** Each app has `?v=YYYYMMDD-N` tokens that MUST move in
  lockstep or the browser serves a stale `app.js`:
  - Credit: `css/styles.css?v=` & `js/app.js?v=` in `credit/index.html`; the
    `./data.js?v=` & `./charts.js?v=` imports in `credit/js/app.js`. NB `app.js`
    also imports `./shared.js?v=` + `./detail.js?v=`, and BOTH `credit/js/shared.js`
    and `credit/js/detail.js` import `./data.js?v=` too — the `./data.js?v=` token
    MUST stay identical across `app.js`, `shared.js` and `detail.js` (bump all
    three together) or the browser instantiates `data.js` twice.
  - Legal: the same under `legal/` — `js/app.js?v=` + `css/styles.css?v=` in
    `legal/index.html`, and the `./data.js?v=` token identical across
    `legal/js/app.js`, `legal/js/shared.js` and `legal/js/detail.js`.
  - Macro (THREE): `css/styles.css?v=` & `js/app.js?v=` in `macro/index.html`; the
    `./content.js?v=` import in `macro/js/app.js` AND its siblings `macro/js/dashboard.js` + `macro/js/shared.js` — all three MUST carry the SAME content token, or the browser instantiates content.js twice. Macro has no `data.js`/`charts.js`.
  **RULE: whenever you change an app's data (`data.js`, or for Macro its
  `content.js`/`src/index.js` curated series) at all, you MUST advance that app's
  tokens to a value not already present in its files (increment the sequence if it
  already shows today's date, else start the day at -1).** Leaving them unchanged
  ships a data change that never goes live (a real bug seen on 2026-06-23 run 2,
  where a credit webNews was added but credit's tokens stayed at -2). Because the
  refresh stamp changes every run, ALL three apps' tokens move on every run. Before
  committing, `git diff --stat` MUST show `index.html` and `js/app.js` changed for
  every app whose data changed. The three apps keep independent sequence numbers.
  - **Home landing + in-app palette.** The root `glance.js` (Home briefing)
    and `palette.js` (the `/` command palette mounted in every app) ALSO import
    `credit/js/data.js`, `legal/js/data.js` and `macro/js/content.js`. They are
    NOT part of the per-app token bumping above, so to stop them pinning a stale
    copy those three data modules are served `Cache-Control: no-cache` in
    `_headers` (they revalidate → cheap 304, always fresh). So a routine run does
    **not** need to touch `glance.js`/`palette.js` — but if you ever stop
    revalidating a data module in `_headers`, you must instead bump its `?v=`
    import token inside `glance.js` and `palette.js` (and their own cache tokens)
    on every data change, or Home will show out-of-date items.
- **Macro edge cache.** Macro's `/api/macro` endpoint is cached at the edge under a
  key `"/api/macro?v=N"` in `src/index.js`. Bump `N` on every run so the redeploy
  serves a freshly-pulled set of live indicators (and any curated-series edit takes
  effect), rather than the previous cached payload.
  - **The other two live endpoints self-refresh — do NOT bump them per run.**
    `src/index.js` also serves `/api/rates` (the Home/Credit key-rates banner,
    cached ~300s) and `/api/markets` (the Home markets banner — indices, ETFs,
    commodities, Bitcoin — cached ~60s). Both carry their own short-lived cache key
    (`"/api/rates?v=N"` / `"/api/markets?v=N"`) whose only job is edge de-duplication
    within that TTL; they re-pull from source automatically as the TTL lapses, so a
    routine run does **not** need to touch them. Only bump their `?v=N` when you
    actually change that endpoint's *code* (e.g. add a series to `MARKET_SERIES` or
    change the fetch/parse logic), to flush the old cached shape — never as routine
    freshness maintenance.
- **Freshness scalars.**
  - Always set `LAST_CHECKED` in BOTH `credit/js/data.js` and `legal/js/data.js`
    to today on EVERY run — this is the "Last refresh" date shown in each topbar,
    so a run is visible even when nothing new was found.
  - Always set `LAST_CHECKED_TIME` (BOTH apps) to the actual run time on EVERY run,
    as a pre-formatted `"HH:MM TZ"` string with a timezone label (London, e.g.
    `"05:22 BST"` / `"12:01 BST"`; use `GMT` in winter). It is pre-formatted (not a
    parsed Date) so it renders identically regardless of the viewer's browser
    timezone. Because five runs land each day (~05:00, ~09:00, ~12:00, ~17:00 and ~21:00), this is
    what tells which run produced the shown data; it appears in the topbar and the
    notification header next to `LAST_CHECKED`. Keep both apps' value identical
    when a single run touches both.
    - **DERIVE it from the clock — never copy a value.** Read the real time with
      `TZ='Europe/London' date '+%H:%M %Z'` and use that. Do NOT reuse the example
      strings above, the previous run's value, or a "05:00"/"09:00"/"12:00"/"17:00"/"21:00" schedule label:
      a manually-triggered run can fire at any time, and a routine fired at 15:41
      must stamp `"15:41 BST"`, not `"06:01 BST"`. (Real bug on 2026-06-24: a run
      executed ~15:41 wrote `LAST_CHECKED_TIME = "06:01 BST"` and titled its commit
      "06:00 BST refresh", so the live site read as though nothing had run since
      06:00 — it looked like the afternoon routine had failed when it had actually
      succeeded.)
    - **Never move it backwards within the same day.** If the file already shows a
      LATER time for today's `LAST_CHECKED` (e.g. a 12:06 run already ran), the new
      value must be ≥ that — a later run must not regress the displayed time.
    - The commit subject's time label, if you use one, MUST match this same real
      time — do not title a 15:41 run "06:00 BST refresh".
  - Only set `DATA_UPDATED` (credit) / `LAST_REVIEWED` (legal) to today when that
    app's actual data changed (new deal/intel/webNews or alert/case).
  - **Macro** carries the same stamp in `macro/js/content.js` `META`: set
    `META.lastChecked` to today and `META.lastCheckedTime` to the derived London
    `"HH:MM TZ"` on EVERY run (this is Macro's "Last refresh" line and bell header).
    The same "derive from the clock, never regress, never mislabel" rules apply.
- **Validate** before committing — and validate as an **ES module**, because the
  apps load `data.js` via `<script type="module">`. Plain `node --check file.js`
  parses in script mode and can PASS on module-only errors (e.g. a missing comma
  between array objects), shipping a blank page. Use an ESM check instead:
  `for f in credit/js/data.js legal/js/data.js; do cp "$f" /tmp/c.mjs && node --check /tmp/c.mjs || echo "FAIL $f"; done`
  — or import-test it: `node --input-type=module -e "import('./legal/js/data.js').then(m=>console.log(m.items.length))"`.
  (A real bug seen 2026-06-24: a `data.js` rewrite dropped the commas between
  `items`; `node --check *.js` passed but the module failed to parse and Legal
  rendered blank.)
  - **Also check for ARRAY HOLES (double commas).** A *double* comma between
    array objects (`},\n,\n  {` — e.g. when an insert script prepends a comma to
    an array that already ends with a trailing comma) creates a sparse hole.
    `node --check` AND `Array.filter()`/`forEach` all silently skip holes, so they
    pass — but the apps build values with spread+`reduce` (e.g. Credit's
    `LATEST_ITEM = [...intel, ...deals].reduce(...)`), and spread materialises a
    hole as `undefined`, throwing `Cannot read properties of undefined` and
    blanking the page. Validate with a method that SEES holes:
    `node --input-type=module -e "import('./credit/js/data.js').then(m=>{const h=[...m.deals,...m.intel].filter(x=>x===undefined).length; if(h)throw new Error(h+' array holes'); console.log('ok, no holes')})"`.
    (A real bug seen 2026-06-29: an insert left `},\n,\n  {` in `deals` and
    `intel`; `node --check` and `.filter()` passed but the Credit app rendered
    blank — header/footer only.)
- **Publish on every run.** Because `LAST_CHECKED` is bumped each run, every run
  produces a commit (even a "nothing new" run, which just advances `LAST_CHECKED`
  + cache-busters). Commit (message trailers below), then publish to `main` AND the
  development branch — pushing to `main` triggers the live redeploy.
- **Publishing to a MOVING `main` — rebase, don't fast-forward-merge.** `main` has
  more than one writer: these routines AND interactive dev sessions both push to it.
  So by the time a run is ready to publish, `main` may have advanced, and a plain
  fast-forward merge/push is REJECTED (`non-fast-forward` / "fetch first") — which
  is exactly how a run silently fails to go live (**real incident 2026-07-02**: the
  midday run produced no commit at all because dev-session pushes were landing on
  `main` throughout its window). Do NOT treat a rejection as fatal — rebase and
  retry:
  1. `git fetch origin main`.
  2. Rebase this run's commit onto it (from the dev branch): `git rebase origin/main`.
     A refresh only touches `*/js/data.js`, `macro/js/content.js`, `src/index.js`,
     `*/index.html`, `*/js/app.js`, so this is virtually always a clean rebase
     against dev work on other files. If it DOES
     conflict (a dev session also edited a `data.js` or bumped the same cache token),
     resolve by **keeping BOTH data changes and taking the HIGHER cache token**, then
     `git rebase --continue`.
  3. Push: `git push origin HEAD:main` and update the dev branch.
  4. On another `non-fast-forward` rejection (someone landed again mid-rebase), loop
     back to step 1. Retry up to ~5× with short backoff — `main` settles quickly.
     Only if it is still failing after that do you fall back to the API path below.
- **If sources are unreachable this session (network policy) — still publish, and
  SAY SO.** If outbound fetches to the source hosts return `403` / CONNECT denials
  (so publication dates and URLs cannot be verified against live pages), do NOT
  fabricate items. Still advance `LAST_CHECKED` / `LAST_CHECKED_TIME` + cache tokens
  and publish (so the run is visible), and state plainly in the run summary that
  **no items could be verified because egress was blocked** — a stale allowlist is
  an environment fault to fix, not a quiet news day to hide.
- **If the push to `main` fails with a TRANSPORT error (`HTTP 503` / "remote end
  hung up") — API fallback.** This is distinct from the `non-fast-forward` rejection
  handled above (there the transport is fine and `main` is merely ahead; here the
  transport itself is down). The static site only redeploys when `main` advances, so
  a failed `main` push means the run did not go live. Pushes to the dev branch can
  succeed while `main` fails (seen after the repo was renamed mid-session, when a
  session's proxy allowlist went stale). Do NOT retry indefinitely — after ~2
  attempts with backoff, publish to `main` through the **GitHub API** instead (it
  bypasses the git proxy):
  - Push the commit to the dev branch first (that path keeps working).
  - For each file changed this run, call the GitHub MCP `create_or_update_file`
    tool on branch `main` (owner `sk8905`, repo `sk-default-repo` — the API
    follows the rename redirect to `meridian`): supply the file's current blob
    `sha` from `get_file_contents` (ref `refs/heads/main`), the full new content,
    and the same commit message + trailers. A single run usually touches only
    `credit/js/data.js` + `credit/index.html` + `credit/js/app.js` and/or the
    legal equivalents, so this is a handful of calls.
  - Then locally `git fetch origin && git branch -f main origin/main` to resync.
  - Note in the run summary that the API fallback was used (so the stale-allowlist
    session can be flagged/restarted against `sk8905/meridian`).
- **Commit message** ends with:
  ```
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  Claude-Session: <this session's URL>
  ```
- **House typography — one agreed scale, applied consistently everywhere.** Font
  family (system stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  Helvetica, Arial, sans-serif`) and the five-role text scale below are the single
  source of truth; every surface (Credit, Legal, Macro **and** the Glance home)
  must conform. The scale is defined **once**, as CSS design tokens in `premium.css`
  under "CANONICAL TYPE SCALE" (`:root { --fs-* }`), and every rule references a
  token — never a literal `font-size`. Change a size there and it updates
  platform-wide. All sizes are `rem` off the 16px root; the five roles (with the
  Macro reference element that anchors each) are:
  - **Section title** — `--fs-section-title` **1.6rem / 800**, mobile **1.2rem**
    `[h1 "Macro Intelligence"]`
  - **Tagline** (lede / subtitle under a title) — `--fs-tagline` **.85rem** muted
    `[.page-head p "Key US & UK…"]`
  - **Item headline** (feed / list / card item title) — `--fs-item-title` **.9rem / 600**
    `[.compact-head "CNBC Daily Open…"]`
  - **Item headline meta** (date · source · fine print) — `--fs-item-meta` **.76rem**
    muted `[.small "14 Jul 2026 · CNBC"]`
  - **Content** (summaries, descriptions, explanations, narrative) — `--fs-content`
    **.85rem** — this is the platform's **default** body text size (`body {
    font-size: var(--fs-content); }`); every classless `<p>`/`<td>`/`<li>` inherits
    it `[.macro-sum-line "Fed on hold at…"]`
  - Supporting: card / panel heading (h2, h3) — `--fs-card-title` **1.05rem / 800**;
    section sub-header — **.68rem / 800** uppercase `[.g-sub-h]`
  - "Sign out" link — the home-logo blue **#0ea5e9** everywhere

  When a run adds or edits any UI/markup, it must reuse an existing role class or a
  `--fs-*` token — never invent or hard-code a new `font-size`. Content text (any
  summary/description/narrative) must render at the default `--fs-content` (.85rem).

---

## The routine prompt

> Do a full refresh of ALL THREE Meridian platforms — Credit, Legal and Macro —
> and publish the changes live. (This routine runs five times a day, at 05:00, 09:00, 12:00, 17:00 and 21:00.)
> Follow the invariants in `docs/refresh-routines.md`. The repo has `credit/`,
> `legal/` and `macro/` apps and deploys from `main`.
>
> 1. SYNC: `git fetch origin`, then
>    `git checkout -B claude/affectionate-einstein-9hhzga origin/main`. Do all work
>    on this branch. Hunt for items published since the last run (look back ~24h;
>    dedup removes overlap) — but the window bounds the HUNT, not eligibility:
>    whenever a search surfaces a genuine, source-verifiable item that is not already
>    tracked, ADD it even if its own date falls outside that window (as far back as
>    2016). Never drop a verified item as "too old", and never bump an item's date to
>    fit the window — record its real publication date. Verify every date from the
>    source; never invent URLs, dates, figures or quotes; dedupe against what's
>    already in each file. For every array compute the current max id and use the
>    next integer.
>
> 2. CREDIT — `credit/js/data.js` (European private credit):
>    - **Deals** → append to the `deals` array (id `d<next>`): date (YYYY-MM-DD),
>      managerId (must match an existing manager — skip if not in the dataset),
>      fundId if applicable, type (reuse an existing deal type), headline, summary,
>      sourceUrl.
>    - **Fundraising / mandates / launches** → append to the `intel` array (id
>      `i<next>`): date, type (reuse an existing intel type — Fundraising, First
>      Close, Final Close, Launch, Mandate, Personnel, Strategy, Equity / PE),
>      headline, summary, managerId/fundId, sourceUrl. (Mandates & fund launches
>      are intel items of type "Mandate"/"Launch" — they feed the Mandates tab.)
>    - **Manager website news** → for managers with an active news/press page, add
>      new announcements to that manager's `webNews` array ({date, outlet, title,
>      url}), deduped against their existing `news` + `webNews`; prefer the
>      manager's own press-release URL.
>    - **SLS column (`structured` on managers) — PRESERVE and EXTEND.** The
>      managers league table renders an **SLS** column ("Structured Liquidity
>      Solutions") of chips — NAV / SRT / CFO / CONT / OTH — from each manager's
>      `structured: [{type, label, url, outlet, date, note}]` array. NEVER drop
>      or rewrite existing `structured` entries in a refresh; they are curated,
>      dated evidence (same standing as the maturity-wall figures). When new
>      coverage lands on a manager's NAV financing, significant risk transfer,
>      collateralised fund obligation, continuation fund/vehicle or GP-led /
>      secondaries / fund-finance activity, APPEND a new `structured` item —
>      type from that fixed vocab (OTH = other structured liquidity), every
>      claim verbatim from the cited article, `note` attributing the vehicle
>      and the manager's role (fund-level vs manager-level; provider vs user
>      vs investor) — and ALSO add the source article to that manager's
>      `news`/`webNews` (deduped by URL, and mirrored into deals/intel per the
>      rule above when it is a transaction). No source, no chip: a manager with
>      no sourced item renders an em-dash, which is the correct outcome — never
>      stretch weak or asset-level evidence (portfolio-company ABS, CLO
>      issuance, a "CFO" job title) into an SLS chip.
>    - **SRT — running/originating, NOT opportunistic buying.** A `type:"SRT"`
>      chip is for a manager whose franchise *uses* significant/synthetic risk
>      transfer: running dedicated SRT/bank-capital funds or strategies,
>      structuring/originating/leading SRT transactions with banks. A manager
>      merely **buying SRT paper** as one investment among many does NOT earn an
>      SRT chip — "buying SRTs is different to using/selling SRTs, so it should
>      not count towards a label" (per the app owner). Tell them apart from the
>      cited article's framing: "X is buying up SRTs", "X bought SRTs tied to …"
>      → buy-side, no chip (the story can still live in `webNews`); "X raises
>      €Xbn for its SRT strategy", "X leads/closes/structures an SRT", "dedicated
>      SRT manager, N bilateral deals" → franchise, chip stands. When in doubt,
>      classify as buy-side (no chip). If a future refresh only has buy-side
>      evidence for a manager, leave `structured` empty rather than adding an SRT
>      chip.
>    - **CFOs — standing check EVERY run.** Collateralised fund obligations are
>      under-covered. Seeded so far (keep, extend): AlpInvest/Carlyle (two CFOs,
>      $1bn 2024 + $1.25bn 2025), KKR (REIGN I $1.58bn), Ardian ($1bn 2026). On
>      each refresh, actively search each tracked manager for CFO / rated-feeder /
>      rated-note-feeder / fund-securitisation activity and APPEND a `type:"CFO"`
>      structured item wherever a dated, sourced deal exists (sponsor or arranger
>      role stated in the `note`), also adding the source article to the manager's
>      news. RESEARCH VIA THE **WebSearch** TOOL — it runs on Anthropic
>      infrastructure and works regardless of the environment's network policy
>      (Trusted or Full). Do NOT conclude research is blocked because a direct
>      `curl`/`WebFetch` 403s: that only measures the container's own egress
>      (what "Trusted" governs), which the established pattern never used. Quote
>      WebSearch snippets verbatim with their source URLs (the three CFOs above
>      were sourced exactly this way). If one specific page genuinely must be
>      fetched rather than searched, add that fetch to the Worker (production
>      side, unaffected by container egress) — never treat "flip the environment
>      to Full" as a prerequisite for routine research.
>    - **MIRROR webNews into deals/intel (critical).** A `webNews` entry shows ONLY
>      in the notifications bell — it does NOT appear in the Deal Activity or
>      Fundraising Intelligence feeds, the dashboard KPIs, or any tab/list (those
>      render solely from `deals` / `intel`). So whenever a webNews item is itself a
>      transaction (investment, financing, unitranche, acquisition, disposal/exit,
>      refinancing, restructuring, structured credit/CLO, continuation vehicle) or a
>      capital-formation/strategy event (first/final close, fundraise, launch,
>      mandate, partnership/JV/MoU, senior personnel, strategy), you MUST ALSO add a
>      matching item to `deals` (transactions) or `intel` (everything else) — same
>      date, headline and sourceUrl, with the right `managerId` and a `type` from the
>      existing vocab — so the item appears on the dashboard and in its tab, not just
>      the bell. Only pure manager PR (quarterly/annual results, market commentary,
>      thought-leadership, awards, outlooks) stays webNews-only. Audit: every recent
>      webNews URL should also be a `sourceUrl` in deals/intel unless it is one of
>      those PR-only categories.
>    - **Tag CLO items (`clo: true`).** Meridian Credit has a dedicated **CLOs**
>      section (`#/clos`) that renders ONLY `deals`/`intel` items carrying
>      `clo: true`, and the Deals, Fundraising, Mandates and dashboard views
>      EXCLUDE those items. So any collateralised-loan-obligation item — a CLO
>      pricing/closing/reset/new-issue, a CLO fund or CLO-equity fund, a CLO ETF,
>      a CLO platform launch, a CLO-team hire, or a CLO award — MUST be added with
>      `clo: true` (CLO transactions → `deals` type `Structured Credit`; CLO
>      platforms/funds/ETFs/personnel/awards → `intel`). Without the flag a CLO
>      story shows in the bell and in Deals/Fundraising but NOT in the CLOs
>      section. Do NOT flag items where CLO is merely incidental (e.g. an M&A or
>      IPO whose target happens to run a CLO business). Detect the acronym
>      case-sensitively (`CLO`/`CLOs`) so "close"/"closes" don't false-match.
>    - **Reconcile fund records** → when a first/final close (or material fund
>      raise) is found, also update the matching fund in the `funds` array: set
>      `status` (Open → "First Close" → "Final Close"), update `raised` (and
>      `hardCap`/`targetSize` if newly disclosed), and refresh its `asOf`. Match the
>      fund by name + managerId; if it doesn't exist yet, add it (next bullet).
>    - **Add new managers / funds** → if a deal or raise involves a manager or fund
>      not yet tracked, add it (only with a verifiable public source; never
>      fabricate — set unknown fields to `null`, mark estimates with
>      `estimated: true`). **First apply the private-credit scope test (see the
>      "Private-credit scope" invariant): skip any equity-only firm — PE/buyout,
>      equity real estate/infrastructure, growth/venture equity — and NEVER re-add
>      the removed equity-only firms (EQT, PAI Partners, TDR Capital, Astorg,
>      BlackRock Private Equity Partners, Amro Partners, Equitix, Greycoat Real
>      Estate); add a manager only if it runs a private-credit strategy, and a fund
>      only if it is a credit fund.**
>      - New manager → append to `managers` (id `m<next>`): name, hq, founded, aum
>        (€bn number) + aumText, strategies (array), description, asOf, owners,
>        financials, headcount, news: [], sources (≥1 real URL).
>      - New fund → append to `funds` (id `f<next>`): name, managerId, strategy,
>        vintage, targetSize, hardCap, raised, status, domicile, geoFocus,
>        sectorFocus, description, asOf, sources (≥1 real URL).
>    - **Re-verify manager profiles (rotating)** → each run, take the ~3 managers
>      with the OLDEST `asOf`, check their public AUM / headcount / financials /
>      description against a current public source, update any that changed, and set
>      their `asOf` to today (even if unchanged, so the rotation advances). This
>      keeps the slow-moving profile data fresh without re-checking all of them
>      every run.
>    - **Watchlist deep-research (priority names) — DO THIS EVERY RUN.** The names
>      users follow deserve a DEEPER, more complete profile than the normal sweep
>      above. Get the live list first: `GET https://<site>/api/research-targets` with
>      header `X-Research-Key: <the RESEARCH_KEY secret in this routine's env>`. It
>      returns `{ users, manager:[ids], fund:[ids], lp:[ids] }` — the union of every
>      user's watchlist. Resolve those ids to names via `credit/js/data.js`. If the
>      endpoint is unreachable or the secret is unset, SKIP this block and carry on
>      with the rest of the refresh — never fail the run over it. Because the list is
>      fetched live each run, any newly-starred name is picked up automatically next
>      run. Pick the watchlisted entities whose `deepAsOf` is missing or oldest and
>      deep-research **up to ~5–8 of them per run** (the rest roll to the next run so
>      one routine stays bounded). For EACH chosen name go WIDE and go BACK:
>      - **News (historical + new)** → backfill its `webNews` as far back as 2016,
>        not just the last day — add every source-verifiable announcement, press
>        release and article you can confirm that isn't already tracked, and MIRROR
>        each transaction/capital event into `deals`/`intel` (flagging CLO items)
>        exactly as the rules above require.
>      - **New funds / CLOs / vehicles** → find funds, CLOs, CLO-equity vehicles,
>        continuation funds and managed accounts run by that name that aren't yet in
>        `funds`/`deals`, and add them (the private-credit scope test still applies).
>      - **Investors / LPs** → capture disclosed limited partners / cornerstone
>        investors (pension plans, insurers, sovereign funds, fund-of-funds) tied to
>        that name's vehicles, where the platform models them.
>      - **Profile gaps** → fill any missing manager/fund fields (AUM, owners,
>        financials, headcount, filings, strategies) from current public sources.
>      - **Stamp progress** → set `deepAsOf` (YYYY-MM-DD) on every entity you deep-
>        research this run, even if nothing changed, so the rotation advances. A name
>        with a recent `deepAsOf` only needs an incremental top-up (items since), not
>        another full historical dig.
>    - If Credit's data changed (any of the above), set `DATA_UPDATED` to today.
>
> 3. LEGAL — `legal/js/data.js` (English law). Cover the four practice areas only:
>    banking, ri, corporate, funds. (`funds` covers both funds-regulatory and
>    fund-tax topics — the two were merged into one "Funds" area 2026-07-01; do NOT
>    use the old `fundsreg`/`fundtax` ids.)
>    - **Legal alerts** → append to the `items` array (id `u<next>`) from the
>      tracked firms'/chambers' own insights/client-alert pages: title; area (one
>      of the four); areas (array); type (one of case/update/alert/insight/
>      knowhow); firm (MUST be one of: aoshearman, cliffordchance, freshfields,
>      linklaters, slaughtermay, ashurst, hsf, macfarlanes, traverssmith, simmons,
>      latham, kirkland, whitecase, weil, sidley, cleary, ropesgray,
>      simpsonthacher, davispolk, southsquare — skip items not from these);
>      date; jurisdiction; court + citation for case notes; summary; points
>      (array); tags (array); url. **url is REQUIRED** — a verifiable public
>      source is essential. NEVER add an alert without a working source URL;
>      if an existing alert's source page disappears, replace the URL or
>      delete the record.
>    - **Case law** → search BAILII and caselaw.nationalarchives.gov.uk for
>      judgments handed down in-window in the five areas AND one of the tracked
>      courts ONLY (Supreme Court, Court of Appeal, High Court (Ch), High Court
>      (Comm), High Court (KB), High Court (QB)). Append to the `cases` array (id
>      `c<next>`): id, name, citation, court (exactly one tracked label), date,
>      area, url (prefer the BAILII/National Archives URL), summary — AND add a
>      matching 3–4 sentence entry to the `caseSummaries` map keyed by the same id.
>    - **Schemes & restructuring plans** → search for new English-law Part 26A
>      restructuring plans and Part 26 (distressed) schemes of arrangement that
>      reached the court (convening, sanction, refusal or appeal) in-window. Cover
>      matters since 2020. Good sources: BAILII / National Archives for the
>      judgment, plus the tracked firms' restructuring-team analyses found via
>      `site:<firm-domain>` searches (the same firm list as Legal alerts). Append to
>      the `restructurings` array (id `rx<next>`) using a neighbouring entry as the
>      field template: company, type (`"plan"` or `"scheme"`), date (the hearing/
>      judgment date, YYYY-MM-DD — REQUIRED, see below), court, citation,
>      judgmentUrl, sector, debt, creditors (array), features (array), advisers
>      (array — the company's own legal/financial advisers), firm (a tracked firm id
>      whose article you link), articleUrl (that firm's analysis), outcome (reuse an
>      existing string — e.g. `Sanctioned`, `Refused`, `Convened (meetings ordered)`,
>      `Appeal dismissed — plan upheld`), notes. Set unknown fields to `null`/`[]`;
>      never fabricate creditors, debt figures, advisers or URLs — leave them empty
>      if unverified. Dedupe by company + citation against the existing array.
>    - **Counsel capture (firm profile pages).** The Legal firm pages
>      (`/legal/#/firm/<id>`) compile every case/scheme/plan whose record text
>      NAMES a tracked firm. So for every NEW case and scheme/plan you add,
>      check the judgment's counsel/representation listing (BAILII and National
>      Archives judgments open with it) and record which tracked firms or
>      chambers acted:
>      - cases → add a `counsel` array, e.g.
>        `counsel: ["Kirkland & Ellis (appellant)", "South Square (respondent)"]`
>      - restructurings → keep filling the existing `advisers` array the same way
>      Use the firm's full display name exactly as in the `firms` table (e.g.
>      "Freshfields", "A&O Shearman", "South Square") so the profile-page matcher
>      picks it up. Only record what the judgment/coverage verifiably states —
>      never infer who acted; omit the field rather than guess. Untracked firms
>      may be listed too (they're harmless); tracked ones are what light up the
>      profile pages.
>    - **Schemes/RPs auto-surface in notifications** (no mirror step needed). Unlike
>      Credit `webNews`, the `restructurings` array already feeds BOTH the
>      Schemes-and-RPs tab AND the notification bell (kind = Plan/Scheme). The ONE
>      requirement: give every new entry a real `date` — that is what sorts it and
>      drives the "new" badge; an entry with no date will not surface as new.
>    - If Legal's data changed, set `LAST_REVIEWED` to today.
>
> 4. MACRO — Meridian Macro (US & UK indicators + rate outlook, cycle & bubble
>    views). Macro's headline indicators are fetched LIVE by the Worker on each
>    request (FRED / ONS / DBnomics), so they refresh automatically — this step keeps
>    the CURATED series, the editorial guidance and the refresh stamp current:
>    - **Force-refresh the live cache** → bump the edge-cache key `"/api/macro?v=N"`
>      in `src/index.js` (increment `N`) so the redeploy serves a freshly-pulled set
>      of indicators, not the previously cached payload.
>    - **Curated series in `src/index.js` `MACRO_SERIES`** (these have no free live
>      feed) → when a new monthly print or a central-bank decision has landed
>      in-window, append it to the relevant `curated: [...]` array, verified from the
>      source: US ISM Services PMI (`services_pmi`), UK S&P Global/CIPS Services PMI,
>      UK 2-year gilt, UK Bank Rate step function and — if the Fed/BoE changed rates —
>      the US/UK `base_rate`. Keep months in `YYYY-MM` order; never invent a figure.
>    - **Upcoming-releases calendar in `macro/js/content.js` `RELEASES`** → this
>      feeds the **"Upcoming releases" dropdown** pinned to the top-right of the
>      dashboard header (it lists the next six scheduled US/UK releases, soonest
>      first), so the array must always contain the near-term future. Each run:
>      DROP any entry whose date is now in the past, and ADD newly-confirmed
>      scheduled US/UK data releases & central-bank announcements so the list runs
>      ~4 weeks forward. Cover the significant items — FOMC & BoE MPC meetings/
>      decisions/minutes, CPI, PPI, PCE, GDP, retail sales, jobs report / nonfarm
>      payrolls, ONS labour market & CPI, ISM & (where a date is confirmed) S&P
>      Global/CIPS PMIs. Each entry is `{date:"YYYY-MM-DD", country:"US"|"UK",
>      title, url}` — the `url` is the official release-calendar / source page the
>      banner tile links to (e.g. the BLS CPI schedule, the Fed FOMC calendar, the
>      ONS release page, the BoE upcoming-MPC-dates page). VERIFY every date from an
>      official release calendar (BLS/BEA/Census/Fed/ISM, ONS, BoE) or a reliable
>      economic-calendar source; never invent or approximate a date — omit an item
>      you cannot verify. Keep the list sorted by date. (Omit the recurring weekly
>      initial-jobless-claims prints — too noisy for the banner.)
>    - **Earnings wall in `macro/js/content.js` `EARNINGS`** → feeds the
>      Dashboard › **Earnings** sub-section: the coming week's market-moving
>      reporters, FOCUSED on (in priority order): banks & brokers, asset
>      managers, AI-relevant names (hyperscalers, chip companies, AI software),
>      the Mag 7, and any other release likely to move the broad market. Skip
>      minor names outside those groups. Private AI leaders (OpenAI, Anthropic,
>      SpaceX, xAI) have no earnings releases — never add rows for them; their
>      funding news runs in the wire. (The panel renders NO explainer footnote —
>      there is no `foot` field; the sources list renders collapsed.) Each row also carries `held[]` — which of the
>      reader's ETFs hold the name, shown as a small colour-coded label — each
>      entry is `{etf, w}` where `w` is the stock's weight in that ETF/index
>      quoted VERBATIM from a published source (MSCI factsheet top-10 or the
>      iShares holdings page); leave `w` null when no published figure is
>      reachable (the label then renders without a percentage): `IGWD` (iShares
>      MSCI World GBP-hedged — ANY developed large cap qualifies), `WMVG`
>      (iShares Edge MSCI World Min Vol GBP-hedged — tag ONLY names verified in
>      the MSCI World Minimum Volatility factsheet constituents), `EMEE`
>      (iShares EM Equity Enhanced Active — EM names only, verify against the
>      iShares holdings page). `COMM` (iShares Diversified Commodity Swap)
>      holds futures, never equities — never tag it. The block holds TWO
>      weeks (`weeks[]`): a LOOK-BACK week (results + share reaction) and the
>      week AHEAD (consensus). Every row carries `est`/`act` × `Eps`/`Rev`,
>      plus two OPTIONAL rows: `km: {l, est, act}` — the sector's KEY METRIC
>      with its own short label (bank markets/equities revenue or NII, chip
>      gross margin, TSLA deliveries, NOW cRPO, VZ adj EBITDA, BX DE/inflows,
>      KO organic growth…) — and `guide: {est, act}` where `est` is the
>      guidance in force going INTO the print (company's own guide for the
>      quarter, or standing FY guidance) and `act` is the new guidance issued
>      WITH the results. Omit `km`/`guide` when nothing is published. Quote
>      each figure a source publishes; leave the rest null (renders as an
>      em-dash pre-release, N/R after — never derive one).
>      Upkeep each run: (a) on the FIRST run of each Monday, the look-back
>      block becomes the week just ended (rows keep their actuals) and the
>      ahead block is rebuilt with the new week's calendar (`days[].rows[]`
>      with consensus figures quoted VERBATIM from a named source —
>      `srcs[]` must carry working URLs; omit an estimate you cannot verify,
>      leave it null). **Each row MUST sit under its verified report date.**
>      Every `days[].date` is a real calendar day and each row belongs under
>      the day the company actually reports — look the date up from a named
>      source (the company's own "announces timing of Q_ earnings" release,
>      or a calendar page), do NOT lump the whole week under one day. If a
>      confirmed report date falls OUTSIDE the block's window (e.g. a name
>      that slips to the following week), drop that row from the ahead block —
>      it does not belong under any day shown. Set each row's `when`
>      ("Pre-mkt" / "After close" / null) to match that source too.
>      (b) on EVERY run, before anything else, sweep the ahead block: for
>      every row whose report date is today or earlier, the actuals MUST be
>      filled — pull `actEps`/`actRev` and `px` (the source's quoted
>      same/next-day share move, e.g. "+4.1%") from the coverage, NEVER
>      computed or guessed, and add a one-line `note` on the headline result.
>      A reported row still showing `actEps: null` is a routine miss, not an
>      expected state — treat a null actual on a past-dated row as work owed.
>      Keep nulls only where the source genuinely gives no figure (e.g. a
>      bank that reports EPS but not a revenue line). Rows stay for the rest
>      of their week so forecast vs actual reads side by side.
>    - **Maturity-wall charts in `macro/js/content.js` `MATWALL.wall` +
>      `MATWALL.ratedWall`** → feed the two bar charts in Dashboard ›
>      **Credit** (y = $bn, x = year bucket). `wall` is the US leveraged-finance
>      view (LSTA Morningstar-index monthly analysis for loans — the PDF is
>      member-gated, so cite PitchBook's public write-up in `srcs.loansAlt`
>      alongside — and PitchBook/LCD coverage for HY bonds); `ratedWall` is the
>      global rated per-year series quoted VERBATIM from S&P's PUBLIC investor
>      factbook (its own caption: "Data as of January 1, 2025" — fresher
>      per-year global splits sit behind S&P's registration wall). Every
>      plotted value is quoted VERBATIM from a public source; `null` renders
>      as "n/p" — NEVER estimate, interpolate, or back out a missing year.
>      Each sub-block carries a visible `asOf` vintage; NEVER mix two vintages
>      in one series — replace a series wholesale (values, `note`, `asOf`,
>      `srcs` together), and where sources conflict across vintages (e.g.
>      factbook Jan-2025 vs refinancing-study Jul-2025) show both side by
>      side, each with its own attribution. Upkeep is occasional, not per-run:
>      when a newer index analysis, factbook edition or outlook publishes
>      updated figures, swap the whole affected series and keep the as-of
>      dates current. `hyMin: true` marks a ">$Xbn" floor figure.
>    - **Key macro news headlines in `macro/js/content.js` `NEWS`** → REWRITE every
>      run. The dashboard renders these as ONE newest-first feed: it prefers items
>      dated within the last 3 days, but if none are that recent it falls back to
>      whatever headlines are in `NEWS` (so the feed is never empty). Refresh them
>      each run so the dashboard keeps showing genuinely current stories. Run targeted
>      web searches for the most important CURRENT US and UK macro / monetary-policy /
>      markets stories (inflation, central banks, growth, jobs, rates, fiscal) from
>      reputable financial outlets — wires & majors (Reuters, AP, Bloomberg, Financial
>      Times, Wall Street Journal, CNBC, The Economist, TradingEconomics, MarketWatch,
>      Yahoo Finance, Investing.com, Briefing.com); fast US
>      business/policy (Axios, Semafor, Barron's, Politico); UK (The Guardian, BBC,
>      Sky News, CityAM); and — to fill the quiet overnight / early
>      (05:00-run) window when US/UK desks are dark — round-the-clock FX/rates & Asia
>      desks (FXStreet, ForexLive, MNI/Market News, Trading Economics, Nikkei Asia,
>      Reuters/Bloomberg Asia). These named outlets are the PREFERRED set — lead with
>      them — but the list is NOT exhaustive: any other reputable, verifiable source is
>      fine when a genuine story breaks elsewhere. Diversify across this wider set — do
>      not lean on the same two or three outlets every run — then replace the arrays with **exactly five** US and
>      **exactly five** UK headlines, ideally all dated the refresh day. The Macro
>      dashboard's "Key macro headlines" panel shows the newest **ten** merged (a
>      2×5 grid), and the Home landing card shows the newest **three** of each
>      country ("US headlines" / "UK headlines") — so five per country fills the
>      dashboard panel to ten while still surfacing three current items per country
>      on Home. (If fewer than five verifiable same-day stories exist for a country,
>      include the best recent ones rather than padding — never fabricate.) Each
>      item is `{title, source, date, url}` — use the exact published headline, the
>      outlet, the verified `YYYY-MM-DD` publication date and the real article URL;
>      never fabricate a headline, date or link. Diversify outlets within each country
>      and favour genuine macro stories over single-company news. Set `NEWS.updated`
>      to today. If egress is blocked so no headline can be verified this run, leave
>      the existing `NEWS` arrays unchanged (do not invent replacements) and say so in
>      the summary — the pre-existing headlines stay on the dashboard until the next
>      successful run.
>    - **Macro reading list in `macro/js/content.js` `ARTICLES`** → the Commentary
>      tab renders `ARTICLES.items` as a newest-first reading list **grouped into
>      month sections** ("JULY 2026" etc.) and **paginated** (25 per page, with a
>      "Show more" control and a per-item Save button), so it now carries a deeper
>      backlog than before. Each item is `{title, source, date, url, blurb, author?}`
>      (`blurb` a one-line dek). These are the most important GENERAL global
>      macro-economic news & analysis stories — monetary policy, growth, inflation,
>      oil, bonds, geopolitics — from reputable outlets (Financial Times, Bloomberg,
>      Reuters, Wall Street Journal, The Economist, CNBC, TradingEconomics, The
>      Guardian, Axios, Semafor, Barron's, Project Syndicate, Politico, MNI/Market
>      News, and round-the-clock FX/rates & Asia desks such as FXStreet and Nikkei
>      Asia for the overnight window, etc.). Refresh each run: prepend genuinely current
>      stories and keep roughly the **most recent ~30–40** (dropping the oldest beyond
>      that), newest first, so the month sections stay populated a few months back;
>      **make sure the newest three are dated the refresh day** — the Home landing
>      card's "Market headlines" section shows the newest three of `ARTICLES.items`, so
>      those three should be current (same-day). Diversify outlets; use the exact
>      published headline, outlet, verified `YYYY-MM-DD` date and real URL — never
>      fabricate. Set `ARTICLES.updated` to today. If egress is blocked so nothing can
>      be verified, leave `ARTICLES` unchanged and say so in the summary.
>    - **Recent market commentary in `macro/js/content.js` `COMMENTARY`** → the
>      Policy Rate tab renders these as a two-column (US/UK) newest-first feed styled
>      like the dashboard headlines. Unlike `NEWS`, these are ANALYSIS/opinion/research
>      pieces (economist columns, research-house notes, interviews) and stay relevant
>      longer, so there is NO recency cut-off and no need to rewrite every run — but
>      refresh them whenever notably fresher/better commentary appears (e.g. after an
>      FOMC/MPC decision or a prominent economist piece), keeping ~three US and ~three
>      UK, newest first. Cover a MIX of source types: (a) sell-side BANK research /
>      analyst notes and named bank economists (Goldman Sachs, J.P. Morgan, Morgan
>      Stanley, BofA, Citi, Wells Fargo, Deutsche Bank, Barclays, UBS, HSBC, Nomura,
>      ING, etc. — their rate calls/forecasts), (b) research-house reports (Capital
>      Economics, Oxford Economics, Pantheon Macroeconomics, TS Lombard, Absolute
>      Strategy Research, NIESR, Resolution Foundation), and (c) named
>      economist/columnist opinion (FT, Bloomberg Opinion,
>      Reuters Breakingviews, WSJ, The Economist, Project Syndicate, CNBC). A bank
>      item may be either the firm's own insights page OR a reputable article
>      reporting its forecast. Each item is `{title, source, author, date, url}` —
>      put the FIRM (and person where named) in `author` for bank/house pieces
>      (e.g. "BofA — Aditya Bhave", "Goldman Sachs"), a named columnist in `author`
>      for opinion pieces, `null` only when genuinely unattributable; verify every
>      title/date/URL and never fabricate. Skip low-quality aggregators (GuruFocus,
>      etc. — see the Sourcing invariant). Set `COMMENTARY.updated` to today when
>      changed.
>    - **Editorial guidance in `macro/js/content.js`** → review against current
>      sources and update only when materially changed (e.g. after an FOMC/MPC
>      decision, a major data surprise, or a notable market move):
>      `OUTLOOK` (Fed/BoE rate outlook), `CYCLE` (Dalio positions), `BUBBLE`
>      (valuation/credit/breadth readings & composite), the `SUMMARY` one-liners and
>      the `ALERTS` bell items (bump an alert's `id` when its guidance changes so it
>      re-flags). Bump `UPDATED` to today when guidance changed. Keep every claim
>      tied to a real source URL; educational-only framing stays.
>    - **Always** set `META.lastChecked` / `META.lastCheckedTime` in
>      `macro/js/content.js` (Macro's "Last refresh" stamp) and advance Macro's three
>      cache tokens — every run, even when nothing else changed.
>
> 5. NEWSLETTERS & myFT — MANDATORY every run, never skip (a 2026-07-18 manual
>    run omitted it silently). Even when Credit/Legal/Macro found nothing, run
>    both pulls and report their counts (0 is fine) in the summary — a summary
>    without newsletter/myFT counts means the run is incomplete. Follow
>    `docs/newsletter-refresh.md` exactly:
>    - §§1–4: pull newly forwarded newsletters from the connected Gmail
>      (skaidrive2@gmail.com), parse into `newsletters.js` (headline, publication/
>      author, date/time, one-line topic summary, "view in browser" link — never
>      body text), dedupe, keep ~40 newest, bump the `newsletters.js` token in
>      `glance.js`. If the Gmail connector is unavailable in this run, skip the
>      newsletter part and leave `newsletters.js` untouched.
>    - §5: AFTER this run's publish (next step) has succeeded, move each processed
>      email to Gmail Trash (`apply_sensitive_message_label` / thread variant,
>      `TRASH`). Also sweep stragglers already present in the committed
>      `newsletters.js`. Never trash anything whose data isn't committed.
>    - §6: fetch the myFT RSS feed
>      (`https://www.ft.com/myft/following/601965b2-62d0-47e1-88cf-576ebc8a8a2e.rss`),
>      regenerate `FT_ITEMS` in `ft.js` (title, canonical URL, guid id, Europe/London
>      date + HH:MM; dedupe by id, newest first, ~40) and bump the `ft.js` token in
>      `glance.js`. If ft.com is unreachable, skip — never blank `ft.js`.
>
> 6. ALWAYS set `LAST_CHECKED` to today in BOTH `credit/js/data.js` and
>    `legal/js/data.js`, and `META.lastChecked`/`META.lastCheckedTime` in
>    `macro/js/content.js` (these are the "Last refresh" stamps in each topbar — they
>    must advance every run so a run is visible even when nothing was added). Then
>    bump all three apps' cache-buster tokens (Credit/Legal four each, Macro three)
>    to today's date with the next sequence, plus the `/api/macro?v=N` edge key.
>
> 7. VALIDATE as an ES module (plain `node --check` misses module-only errors and
>    array holes — see the "Validate" invariant):
>    `node --input-type=module -e "import('./credit/js/data.js').then(m=>console.log(m.deals.length))"`,
>    the legal equivalent, and Macro:
>    `node --input-type=module -e "import('./macro/js/content.js').then(m=>console.log(m.META.lastChecked, m.BUBBLE.dimensions.length))"`
>    plus `node --check src/index.js`.
>
> 8. HOUSE-STYLE QC — TEXT-SIZE CONFORMANCE (every run, not optional). The five-role
>    type scale (`--fs-*` tokens in `premium.css` → "CANONICAL TYPE SCALE"; see the
>    "House typography" invariant) must hold across all four surfaces. Check it:
>    - If this run added/edited any UI or markup, confirm every piece of text maps to
>      one of the five roles and uses its token / role class — never a literal
>      `font-size`: section title (`--fs-section-title`), tagline (`--fs-tagline`
>      .85rem), item headline (`--fs-item-title` .9rem/600), item meta
>      (`--fs-item-meta` .76rem muted), and **content** (`--fs-content` .85rem — the
>      default; any summary/description/narrative renders at this size). Card/panel
>      headings use `--fs-card-title` (1.05rem); "Sign out" = `#0ea5e9`.
>    - Grep for drift the run (or a prior one) may have introduced:
>      `grep -rnE "font-size:\s*(1[0-9]|[0-9](\.[0-9]+)?rem|[0-9]+px)" credit/css legal/css macro/css`
>      then confirm each hit is either a token (`var(--fs-*)`) or a deliberate
>      non-text size (icons, chart ticks). A raw body-copy `font-size` that is not a
>      `--fs-*` token IS drift — fold it into the right token.
>    - Spot-check the rendered result against the agreed sizes (the Playwright harness
>      in the session scratchpad reports computed `font-size` per role — home,
>      a dashboard, a list and a detail page should all show h1 25.6px / tagline &
>      content 13.6px / item title 14.4px / meta 12.16px).
>    - Fix any drift in the shared `premium.css` (preferred — one place, all apps) by
>      pointing the rule at the correct `--fs-*` token. If a divergence is intentional
>      / out of scope to fix safely, note it in the run summary rather than silently
>      leaving it. Bump the touched files' cache tokens.
>    This step never blocks publishing data — it just keeps the type system from
>    drifting run to run.
>
> 9. PUBLISH (every run, even if nothing new): commit — message ending with the two
>    required trailers — then publish to `main` AND the dev branch. `main` has other
>    writers (dev sessions), so publish by **rebasing onto the latest `main` and
>    retrying**, NOT a bare fast-forward: `git fetch origin main` → `git rebase
>    origin/main` → `git push origin HEAD:main` (+ push the dev branch); on a
>    `non-fast-forward` rejection, refetch/rebase and retry up to ~5× (see the
>    "Publishing to a MOVING `main`" invariant). Pushing to `main` triggers the live
>    redeploy. Only if `main` pushes keep failing with a **transport** error
>    (`HTTP 503` / "remote end hung up") after ~2 tries do you fall back to the
>    **GitHub API** (`create_or_update_file` per changed file — see "API fallback")
>    and say so in the summary.
>
> 10. Reply with a short summary: counts of new Credit deals / intel / webNews,
>    Legal alerts / cases / schemes & plans, Macro curated prints / guidance
>    updates, and newsletters added (+ emails trashed) / myFT items pulled (or "no
>    new items — refresh timestamp updated"). If the preflight staleness check
>    flagged a missing prior run, or egress was blocked so nothing could be
>    verified, say so at the top.

---

### Notes

- New `deals`/`intel` `type` values not in `dealTypeClass`/`intelTypeClass`
  (`credit/js/app.js`) still render with default chip styling — reuse existing
  type strings where possible. Legal `area`/`type`/`firm` values MUST reuse the
  existing ids (records are looked up by them).
- Manager `legal` (general counsel) data and the firm/area/tier reference tables
  change rarely and are not part of the refresh.
