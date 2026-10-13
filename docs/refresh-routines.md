# Auto-refresh routine (Claude Routines)

**Wire is one app** — the v2 SPA (bottom tabs **Home · News · Dashboard · Profiles ·
Transactions**), served by the Cloudflare Worker (`src/index.js`) + Cloudflare Assets
and deploying on every push to `main`. Its content is kept current by the scheduled
**~2-hourly full refresh** ("/Wire: full refresh") plus the interleaved **heavy data
sweep** offset routine: together they refresh the Credit, Legal and Macro content that
feeds those surfaces, rewrite the Home briefing + Key Moments, and sweep
research / newsletters / myFT from email. This file is the authoritative procedure;
the live prompts are stored in the Routines UI (see "The live routine prompt" below).

Credit, Legal and Macro are the three **content domains** (the data the refresh edits) —
not separate apps; the pre-v2 standalone pages are retired behind edge redirects. Where
each domain's data lives, and which of the app's surfaces it feeds:

> - **Credit** — private-credit deals, fundraising/mandates, manager & fund profiles →
>   `credit/js/data.js`. Feeds the **Transactions** tab, the **Profiles** tab, the
>   **Dashboard**, and the Home **Managers** lane.
> - **Legal** — English-law alerts, case law, schemes & restructuring plans →
>   `legal/js/data.js`. Feeds the Legal **Profiles** + the Home **LEX** stream.
> - **Macro** — live indicators are fetched server-side by the Worker (`/api/macro`);
>   curated series + all editorial guidance live in `macro/js/content.js`. Feeds the
>   **Dashboard** + the Home macro content. The site deploys from **`main`**.

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
   `{ users, manager:[ids], fund:[ids], lp:[ids], firm:[ids], hf:[ids] }` — the union
   of every user's watchlist (managers, funds, investors, **law firms and hedge
   funds**), never who follows what. The endpoint is read-only. If the secret is
   unset it returns 503 and the routine simply skips the deep-research block.

Until this is configured the routine still runs its normal full refresh; only the
extra deep-research pass on watchlisted names is skipped.

## Home-feed keyword coverage — the full entity roster (CRD / HDG / LEX)

> **Content scope (STRICT) — HOUSE_STYLE R4c.** The newswire carries ONLY: (1)
> macro-economic news for the **G7 + Eurozone + other major (EU/EFTA) European**
> economies (non-European and non-EU/EFTA Europe — Russia, Ukraine, Turkey — are OUT,
> auto-dropped by `FEED_OFFTOPIC_GEO`);
> (2) managers/hedge funds **covered in the app — ALL of them, any AUM**; a NEW one is
> added on the routine's own initiative **only if its AUM is $1–15bn** (outside that
> band needs an explicit request); (3) law firms **covered in the app — all of them**;
> a new firm is added by Big-Law relevance (no AUM band); (4) anything the owner
> explicitly asks for (can override the band). When curating or adding a source/keyword,
> stay inside this universe — **when in doubt, leave it out.**

The Home wire surfaces the three content domains' curated content under the labels **CRD**
(credit managers), **HDG** (hedge funds) and **LEX** (law firms). That content only
appears if the refresh routine has actually *researched* it — so every entity the
apps profile must be a standing search keyword, not just the watchlisted subset the
`/api/research-targets` endpoint returns (that endpoint narrows the **deeper**
budget; it does **not** bound the keyword universe).

On every run, the keyword universe is the **entire roster in the data files** — use
each entity's `name` (and any well-known short/alias form) as a search term:

- **STEP 0 — run the freshness audit FIRST (every run, before anything else).**
  `node scripts/freshness-audit.mjs` (and `--json` for the machine-readable form).
  It is the single deterministic detector: it scans every content surface (credit
  `deals`/`intel`, CLOs, hedge-fund intel, the legal surfaces, the macro feeds +
  calendar + editorial, the dashboard Key Moments and the X-feed sources) and the
  manager-profile depth, prints exactly which are **STALE** and the rotating
  **backfill worklist**, and exits non-zero when anything needs resolving. Each surface
  carries its own cadence window (default 7 days); **credit `deals` and `intel` are held
  to a TIGHTER 3-day window** — the Transactions ledger must never sit a week without a
  new item, so a 3-day gap already flags STALE. **Its output is this run's mandatory
  worklist** — every surface it marks STALE and every worklisted manager is a target you
  must work.
- **CREDIT TRANSACTIONS — sweep for NEW verified deals/intel EVERY run, UNCONDITIONALLY**
  — do NOT skip this just because the audit happens to show `deals` fresh. The audit
  window is a *floor that forces* a sweep, never a licence to stop hunting: every run,
  search the last ~1–2 weeks for new private-credit transactions, fund closes, CLO
  pricings and exits across the roster and append every verified, dated one. The audit
  flagging `deals` only means you are already overdue.
  **A run that ends in a few seconds having appended nothing is a FAILED run, not a
  quiet market:** the audit has already named the gaps, so you either append ≥1
  verified, dated item, or — per stale surface / per worklisted name — record in the
  summary the specific search you ran and why it yielded nothing verifiable. The
  no-fabrication rule OVERRIDES this: an honest "searched X/Y/Z, nothing verifiable
  this run" is always acceptable; inventing or date-bumping to satisfy the worklist is
  never. Re-run the audit at the end to show the before/after.
- **CRD — every credit manager** in `credit/js/data.js` `managers[]`. New,
  verified, dated news for a manager → its `webNews` (manager press) or a `deals`/
  `intel` record (`managerId` set). Renders on the Home wire as **CRD**.
  - **Work the roster actively every run — a multi-day gap is a RED FLAG, not a
    quiet market.** The Home **Managers** lane (and the Transactions deal flow) is
    built only from `deals`/`intel`/`webNews`, so when the newest such record goes
    several days stale the lane visibly freezes (observed 2026-10: nothing newer
    than 28 Sep for over a week while news/FT/newsletters kept updating — a routine
    miss, since private-credit dealmaking does not stop). Each run, before relying
    on a headline to surface, SWEEP the roster for new CLO pricings, fund closes,
    direct-lending / financing deals, SRTs and restructurings, **AND senior
    personnel / team moves (hires, departures, promotions → `intel` type
    `Personnel`) and strategy / partnership / mandate news** (Creditflux,
    Alternative Credit Investor, Private Equity Wire, Businesswire, the managers'
    own press) and append the verified, dated ones. If a sweep genuinely finds
    nothing, say so explicitly in the run summary rather than leaving the gap
    unremarked. Give preference to the $1–15bn AUM band (the app's core band).
  - **Cross-check the live newswire against the roster (critical — the two feeds
    are SEPARATE).** The Home newswire (NWS/CRD/HDG/LEX) is the live RSS/API feed;
    the Managers lane is built only from committed `deals`/`intel`/`webNews`. A
    story can therefore sit in the newswire yet be ABSENT from the Managers lane
    (observed 2026-10-07: "M&G rehires Duncan Batty as head of real estate finance",
    Alternative Credit Investor — a Personnel event at covered manager M&G
    (`m105`), in-window, never captured). So each run, scan the newswire items that
    name a covered manager/fund/hedge fund and, for any that is a real transaction
    or capital/personnel/strategy event, ADD the matching `deals`/`intel` record
    (same date, headline, sourceUrl, correct `managerId`, `type` from the vocab,
    `clo:true` where apt) so it also surfaces in the Managers lane — not only the
    raw wire.
  - **Manager-profile depth — MANDATORY historical backfill to 2020 (HOUSE_STYLE
    R32).** The manager/profile surface is a material feature: **every** covered
    profile must carry history back to **2020** *and* current activity — not just
    the watchlisted subset. The watchlist deep-research pass (above) narrows the
    *extra* budget; it does **not** bound this. Each run, make a BOUNDED, ROTATING
    whole-roster backfill a **primary deliverable** (not an afterthought that only
    happens if a headline surfaces):
    1. Run **`node scripts/manager-coverage.mjs`** (add `--size=N`, default 10) to
       get this run's worklist — the thinnest-covered / missing-history / stale
       profiles, thinnest-first, rotated by day-of-year so consecutive runs sweep
       different slices and the whole roster is covered over time. `--all` prints
       every profile's coverage; `--json` is machine-readable.
    2. For each manager on the worklist, WebSearch its history — fund launches/
       closes, financings, CLO pricings, restructurings, personnel, AUM milestones —
       from **2020 to present**, and append every **verified, dated** item (real
       source URL + real date; unknown fields `null`; **never fabricate**) to
       `deals` / `intel` (with `managerId`) or the manager's `webNews`.
    3. A firm genuinely younger than 2020 (check `founded`) legitimately has no
       pre-2020 history — add what exists back to inception; it stays flagged only
       until its earliest real event is recorded. If a run cannot source a dated
       item for a worklisted name, say so in the summary and leave it for the
       rotation — do **not** pad or invent.
    The goal is monotonic: coverage (`node scripts/manager-coverage.mjs`, the
    "reach ≤2020" and "flagged" counts) should improve or hold every run, never
    regress. `tests/manager-coverage.mjs` guards the tool and roster integrity, and
    now holds an **AGGREGATE COVERAGE RATCHET**: it fails if fewer than
    `COVERAGE_FLOOR_2020` profiles reach ≤2020, or if more than
    `DEPTH_DEFICIT_CEILING` are still thin / missing-history (both clock-independent).
    When a backfill pass improves these numbers, **tighten the two constants in
    `tests/manager-coverage.mjs` in the same commit** (raise the floor, lower the
    ceiling) — that is how the ratchet drives coverage up. **Never loosen them to make
    a red suite pass:** a regression means a profile lost history/depth, or a new
    profile was added without backfilling it. A stalled backfill no longer hides — the
    ratchet turns red the moment coverage slips, and the surface's live freshness cue
    (below) shows a stale ledger to readers.
- **HDG — every hedge fund** in `credit/js/data.js` `HEDGE_FUNDS[]` (currently 151,
  US/UK/Europe/Asia). New, verified, dated hedge-fund news (performance, launches,
  fundraising, personnel, wind-downs, AUM milestones) → a `HEDGE_INTEL` record with
  `hfId` set to the matching fund (or `null` when the story names no single fund in
  the roster). Renders as **HDG**.
  - **Work the roster actively every run, with a PREFERENCE for the $1–15bn AUM
    band.** HDG has historically lagged CRD/LEX — the fix is to treat the covered
    funds as standing beats, not to wait for a headline to surface. **Give
    preference to managers / hedge funds with $1bn–$15bn AUM** (the app's core
    band — the same band that gates new additions): sweep those names first each
    run, then the larger marquee names (Renaissance, Tiger Global, TCI, Squarepoint,
    GoldenTree, Viking, Element, Farallon, Silver Point, Marathon, Diameter, Sona,
    Arini, Sculptor, Magnetar, Tudor, Pentwater, H2O, CFM, Hudson Bay, Greenwoods, …)
    plus the activists (Trian, Starboard, ValueAct, Cevian, Pershing Square, Third
    Point) by name. When two stories compete for a slot, the $1–15bn name wins.
  - **Source playbook (these reliably carry hedge-fund news):** Bloomberg
    (Nishant Kumar's beat especially), Hedgeweek, Institutional Investor,
    Alternatives Watch, Pensions & Investments; **fund closes/launches** →
    Business Wire / PR Newswire firm releases; **year-end performance & the dollar
    league table** → the LCH Investments / Edmond de Rothschild survey and Forbes'
    hedge-fund coverage (both usually land early-to-mid January). Prefer the
    primary/original outlet over scraper republishers (dnyuz, tradingview wrappers,
    13F aggregators like fintool) — cite those only if no cleaner source exists.
  - **Quiet ≠ missing — never pad.** A large chunk of the roster is deliberately
    secretive and rarely makes public, sourceable news (e.g. Adage, Alyeska,
    Holocene, HBK, AKO, Deerfield, Knighthead). If a run turns up nothing
    verifiable for a fund, leave it uncovered — do NOT invent an item to "fill"
    coverage. Coverage tracks what is genuinely reported.
- **LEX — every law firm** in `legal/js/data.js` `firms[]`. New, verified, dated
  legal news for a firm → a legal `items` record (`firm` set), or a
  `restructurings`/`cases` record where the firm is adviser. Renders as **LEX**.

Rules that still bind: never fabricate — each new item keeps a real, dated, sourced
URL and only lands in the roster entity it genuinely concerns (skip rather than
mis-tag). **All sources are in scope for data collection.** Cite whatever reputable
source verifies the fact + exact date — the paywalled premium outlets (Bloomberg, FT,
WSJ, The Economist, Reuters) and specialist/paywalled services (Creditflux, PDI,
Octus, Debtwire, With Intelligence, Hedge Fund Alert, Institutional Investor) are all
fair game and often the ONLY source (hedge-fund news especially). The newswire
"readable-only" cull is **display-only** (HOUSE_STYLE §8.3) and must never make you
skip or down-rank a source when SEARCHING for or recording verified data. Credit-desk scope (below) still governs which *new managers/funds* may be
created; this keyword pass is about **finding news for entities already in the
roster**, across all three content domains, so the Home wire's CRD/HDG/LEX streams stay live.
Hedge-fund keyword coverage explicitly includes Nishant Kumar's Bloomberg beat — all
of his hedge-fund stories belong in `HEDGE_INTEL` (HDG), fund-linked or not.

## Invariants

- **Data integrity is test-gated (`tests/data-integrity.mjs`).** Before appending any
  record, dedupe on entity + source URL (`managerId`/`hfId`/`firm` + `sourceUrl`/`url`)
  — the same article is ONE record; a second deal from one article needs a different
  entity. Every record carries an exact ISO date you saw on the source (no
  `dateEstimated`, no blank `date`); cite the specific article, never a homepage, and
  prefer the issuer / filing / tier-1 outlet over an aggregator or republisher
  (Yahoo, TradingView, MarketScreener, cbonds, Kalkine, Finviz, pulse2 …). The summary
  states ONLY what the cited source says — no context added from memory. Run
  `node tests/run.mjs data-integrity` with the other gating specs before publishing.
- **Never restamp `asOf` without a change.** `asOf` is the date of the data, not the
  date you looked. A re-verification that changes nothing leaves `asOf` alone.
- **Sync first.** Always start from the latest `main`: `git fetch origin`, then
  `git checkout -B claude/affectionate-einstein-9hhzga origin/main`.
- **Preflight staleness check.** After syncing, read the current `LAST_CHECKED` /
  `LAST_CHECKED_TIME` in both `data.js` files and `META` in `macro/js/content.js`.
  If the previous run looks MISSING —
  the last stamp is roughly a full cadence stale (>~9h given the ~3–8h cadence), or a
  prior same-day run that should exist is absent — call it out at the top of the run
  summary. This turns a silently-dropped earlier run (e.g. one that lost the publish
  race) into something visible instead of letting it hide behind the next run.
- **Window.** Add items published since the last run. The routine fires roughly
  every 2 hours through the London day (and not overnight), so look back ~24 hours
  to be safe — dedup removes any overlap. Verify each item's EXACT publication date
  from the source; never invent a URL, date, figure or quote. Dedupe every candidate
  by URL and normalised headline/citation against the data already in the file.
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
- **Investment instrument (`instrument` + `instrumentType`) — curate opportunistically.**
  The manager profile's **Investments** tab (HOUSE_STYLE R21) tags each surfaced deal
  debt vs equity (+ sub-type). Absent a curated tag it is **auto-derived** from the
  article and marked `~`. When a run adds or re-verifies an investment-type `deals`
  record (`Financing` / `Investment` / `Acquisition` / `Structured Credit` /
  `Refinancing` / `Unitranche` / `NPL / Portfolio` / …) and the article makes the
  instrument explicit, set `instrument: "Debt"|"Equity"` and, where named,
  `instrumentType` (e.g. `"Senior"`, `"Unitranche"`, `"Mezzanine"`, `"RCF"`,
  `"Acquisition financing"`, `"Preferred"`, `"Minority equity"`). Only when the source
  supports it — never guess; leave it off and let the auto-derive stand.
- **European credit universe (`credit/js/eu-credits.js`) — compile incrementally.**
  The Transactions ▸ Credits sub-tab lists the ~300 European leveraged-loan / CLO
  obligors by sector with their current issuer rating, anchored to the Morningstar
  European Leveraged Loan Index (ELLI). The constituent list + ratings are
  proprietary, so build `EUR_CREDITS` from PUBLIC rating actions and coverage — a
  few verified names per run, working toward the full universe. Every row is real
  and sourced (R7): `{ name, sector, rating, agency, asOf, source, jurisdiction, trend }`
  — `sector` one of `CREDIT_SECTORS`, `rating` the issuer/corporate-family rating
  from a SINGLE agency kept consistent across the roster (`EUR_CREDITS_META.agency`,
  currently S&P), `asOf` the date it was verified, `source` a real URL,
  `jurisdiction` the borrower's country of domicile (full name — the UI maps it to
  an ISO code), and `trend` the net direction of the S&P rating over the trailing
  **12 months** (`"up"` | `"down"` | `"flat"`): the current rating vs the rating
  ~12 months prior. Mark `"up"`/`"down"` only against a REAL, verified 12-month
  rating change (an S&P upgrade/downgrade in the window — a distressed exchange or
  default counts as down); use `"flat"` when the rating is unchanged, or when the
  obligor was newly/initially rated with no comparable prior. Never infer a
  direction without evidence. Never guess a rating; omit it (leave the field off →
  shows "NR") rather than invent one. `eu-credits.js` is imported tokenless (like
  `data.js`), so no cache-token bump is needed for a data-only edit.
  - **Where to source (public):** for the *rating* of a given obligor, search the
    agency directly — **S&P** "Find a Rating" / rating-action articles
    (`spglobal.com/ratings`) is the roster's canonical agency; **Fitch**, **Moody's**,
    **Scope** and **Morningstar DBRS** are for cross-checking only (do NOT mix a
    non-S&P rating into the roster — keep `EUR_CREDITS_META.agency` consistent; if
    only a non-S&P rating exists, leave the row "NR"). For *which names* belong in
    the universe, mine the recurring **S&P "Leveraged Finance: European Summary
    Report"** (named obligors, ratings/outlooks, defaults, CLO-exposure and Top-10
    tables) and **Fitch European Leveraged Finance Monitor / Chart Book / Leveraged
    Finance research** (~500 covered borrowers); **AFME** and **GlobalCapital**
    league tables give market/issuance context, not an issuer directory. Cite the
    specific S&P action URL as `source` and set `asOf` to the verification date.
  - **Seeded (2026-09-14):** ~104 verified names are in place, spanning 16 of the 17
    sectors (telecom, media, software, healthcare, chemicals, packaging, consumer,
    food, gaming, business services, autos, transport, financials, industrials,
    energy, building), each with its `jurisdiction` and 12-month `trend`. This is
    still short of the full ~300 ELLI universe — extend from here toward it, a few
    verified names per run, and
    re-verify existing rows on new S&P actions (a new upgrade/downgrade flips
    `trend`; a rating that has held for 12 months settles back to `"flat"`).
    Discipline reminder from this batch: only add a name when a real search result
    states its S&P letter — skip (don't guess) issuers where only Moody's/Fitch
    surfaces, where the post-restructuring level is unconfirmed, or where the domicile
    is non-EMEA. A distressed exchange or default inside the trailing 12 months is
    `trend: "down"` even if the post-event re-rating is nominally higher.
- **Profile facts (`book` + `advisers`) — capture opportunistically.** The manager
  profile's Business tab reads two optional, sourced manager fields.
  When a run surfaces source-verifiable evidence for a manager it is already touching
  (during that manager's rotating re-verification, or when its news is being added),
  fill or extend them — do NOT chase them for every manager on every run.
  - `book: { strategies:[…], structured:bool, geos:[…], … }` — the firm's product/book
    shape, only from firm disclosures, fund launches, or reputable coverage.
  - `advisers: [ { firm:"…", firmId:"<slug, optional>", role:"Fund formation"|
    "Financing/deals"|"Restructuring"|"Regulatory"|"Tax", scope:"matter",
    lastSeen:"YYYY" or "YYYY-MM", confidence:"verified"|"inferred", source:"<url>" } ]`
    — mark a law-firm relationship `"verified"` only from a first-party announcement
    ("advised X" / "acted for X" on the firm's own site or the manager's own release);
    a tie merely inferred from third-party deal coverage is `"inferred"`. Exclude
    counterparty counsel (a firm that advised the other side, or the seller in the deal
    that formed the manager). One entry per firm+role; dedupe on that pair. Unknown →
    omit the field (do not invent).
  Never fabricate an adviser tie or a book attribute; if it isn't in a real source this
  run, leave it for a later run. These fields never gate anything — a manager without
  them renders fine.
- **Private-credit scope — exclude equity-only entities.** The credit domain tracks
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
- **Private-credit research (Credit dashboard pulse — `PRIVATE_CREDIT` in
  `dashboard/js/data.js`).** The pulse's `metrics` and its `reports` list track the
  recurring industry research the desk follows, and **roll to the newest edition each
  cycle** as successor reports publish (Fitch is MONTHLY; KBRA and AIMA/ACC quarterly):
  - **Fitch Ratings — "U.S. Private Credit Default Rate …"** (MONTHLY; fitchratings.com).
    This is the pulse's lead metric set. Each month Fitch publishes the trailing-12-month
    U.S. private-credit default rate (across ~1,300 borrowers) plus the month's default
    count, the amendment/PIK vs missed-payment split, and the most/least-stressed
    sectors. Roll the `metrics` (default rate, TTM defaults + latest month, top-stressed
    sectors, a resilient-sector reading, the amendment-led share) and the `reports` entry
    to each new month's release, linking the direct Fitch URL. **Also watch for follow-on
    Fitch private-credit commentary** (e.g. leveraged-loan/BSL default outlooks, special
    reports) and add it to `reports` when it lands. Current: 6.3% TTM Aug 2026 (2026-09-14).
  - **KBRA — "Private Credit: Q_ 20__ Middle Market Compendium"** (quarterly; public
    on kbra.com). Pull the headline middle-market figures — the KBRA Middle Market
    Default Monitor (KMDM) rate by count/by debt, borrowers & debt assessed, the
    EBITDA-growth trend — into `metrics`, each linking that quarter's release, and
    update the `reports` entry to the new URL/date. Current: Q2 2026 ("EBITDA's
    Fading Tailwinds", 2026-07-28).
  - **AIMA/ACC — "Private Credit Performance & Valuation Trends"** (quarterly). AIMA/
    ACC's quarterly is **members' research** (no public per-issue URL), so the
    `reports` entry links the ACC's public private-credit research; only add a
    numeric `metric` from it when a real, publicly citable figure exists (never
    fabricate a members-only number). If the desk supplies the members' PDF, add its
    figures with that citation.
  Both are already in the canonical roster (HOUSE_STYLE §8). Same grounding rule as
  everywhere: real figure, real source URL, real date, or omit.
- **Sourcing.** Prefer primary/verifiable public sources. Most firm/manager sites
  block automated fetching, so enumerate new article URLs with `site:<domain>` web
  searches and verify dates. Skip data-aggregators (GuruFocus, Tracxn, ZoomInfo,
  Crunchbase, PitchBook, SimplyWall, MarketBeat).
  - **Canonical resource roster → `docs/HOUSE_STYLE.md` §8.** That sectioned list
    is the master set of sources this app draws on; treat it as the roster to pull
    from and keep in step. It now additionally includes, and every run should draw
    on where relevant: **MT Newswires (via Koyfin)**, **DealBook (The New York
    Times)**, **TradingView**, **Financial News London (fnlondon.com)**, and the
    credit/hedge-fund & ratings sources **Hedge Fund Research (HFR)**, **Hedge Fund
    Monitor**, **Aurum**, **Nishant Kumar (Bloomberg)**, **PE Wire**, **Paul
    Krugman**, **Moody's**, **S&P (Global Ratings)** and **Morningstar**. When §8
    gains a source, it is in-scope for the next refresh without editing this file.
- **Cache-busters — SUPERSEDED by HOUSE_STYLE T1, keep reading before acting.**
  As of the `no-cache` rollout recorded in `_headers` and HOUSE_STYLE.md §7 T1,
  `credit/js/data.js`, `legal/js/data.js`, `macro/js/content.js`,
  `dashboard/js/data.js`, `newsletters.js`, `ft.js`, `briefings.js` and
  `allocations.js` are imported with **NO `?v=` token anywhere** and served
  `Cache-Control: no-cache` — freshness comes from ETag revalidation, not a
  hand-bumped token. **A routine that only edits these data files does NOT need
  to touch any `?v=` token** (Credit/Legal/Macro's four-token dance described
  below is now dead weight for a pure data refresh). Still bump a token when you
  edit actual CODE (CSS/JS views, engines, chrome) per T1, and still bump the
  `/api/macro?v=N` edge-cache key in `src/index.js` on every run (that one is a
  server-side cache key, not an import token, and is unaffected by this). The
  detail below is kept for the code-token case; do not apply it to data files.
- **Reaching a RESIDENT client — the reopen refresh.** `no-cache` makes a data
  refresh land on the next page *load*, but an iOS home-screen PWA keeps the page
  in memory and never re-navigates, so a *resumed* app would keep the in-memory
  modules (the old briefing, yesterday's wire) even after a refresh ships. Two
  client-side self-heals close that, both on foreground (`visibilitychange`): the
  Home **news** items plus markets/rates refetch from the edge-assembled `/api/*`
  and re-render IN PLACE (`glance.js` `startLiveRefresh`, on a short ~45 s reopen
  gate `LIVE_RESUME_MS`, so a reopened PWA shows current headlines — not ones up to
  the 5-min poll stale); and — for the module-baked **briefing** — `glance.js`
  `initBriefFreshness()` refetches `briefings.js` after the app has been away >2 min
  and reloads ONCE if a newer (date·time) edition has landed, pulling in every
  refreshed module. (The `nav-actions` build self-heal only
  catches CODE deploys; a data-only refresh keeps the same hashed bundle.) Nothing
  for the routine to do here — it's automatic — but keep the briefing's per-slot
  `date`/`time` stamps monotonic each run, since that stamp is the freshness signal.
- **Home slice (`home-data.js`) — regenerate after a data-module edit.** The Home
  surface no longer imports the full `credit/js/data.js` / `legal/js/data.js` /
  `macro/js/content.js`; it imports the compact **generated** `home-data.js`
  (`scripts/gen-home-data.mjs`, a projection to the fields Home renders — see
  HOUSE_STYLE T2). The deploy build regenerates it automatically, so **production is
  always in sync**. But if your refresh commits an edit to any of those three data
  modules, run `node scripts/gen-home-data.mjs` and commit the updated
  `home-data.js` alongside it, so the committed copy (used by source-mode
  `node tests/run.mjs` and dev) does not lag the data. It is tokenless + `no-cache`
  like the rest of the roster; never hand-edit it.
- **Cache-busters (CODE files) — SUPERSEDED by Vite content-hashing.** The v2 SPA
  is now bundled by `npm run build`: every JS/CSS module is content-hashed
  (`/assets/*-[hash]`), so **there is no `?v=` code token to bump anywhere under
  `v2/js` any more** (imports are tokenless; `tests/token-lockstep.mjs` enforces
  it). A code change busts its own cache automatically via the new hash, and the
  `no-cache` `v2/index.html` entry points at the current hashed bundle. You still
  bump the `/api/macro?v=N` **edge-cache key** in `src/index.js` each run (a
  server-side key, not an import token). The pre-Vite per-file `?v=` token dance (and
  the old `glance.js`/`palette.js` token note) is REMOVED — do NOT re-add `?v=` tokens to
  v2 imports; `_headers` `no-cache` keeps the tokenless data modules fresh on its own, and
  `tests/token-lockstep.mjs` fails any `?v=` that creeps back under `v2/js`.
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
    timezone. Because a run lands roughly every 2 hours through the day, this is
    what tells which run produced the shown data; it appears in the topbar and the
    notification header next to `LAST_CHECKED`. Keep both apps' value identical
    when a single run touches both.
    - **DERIVE it from the clock — never copy a value.** Read the real time with
      `TZ='Europe/London' date '+%H:%M %Z'` and use that. Do NOT reuse the example
      strings above, the previous run's value, or any hard-coded schedule label:
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
- **Transactions ↔ Profiles cross-check (run every day).** Every transaction in the
  Transactions tab is attributed to a counterparty **by id**, and the Profiles tab
  renders that entity (Managers / Hedge Funds / Investors / Law firms). The two must
  never drift apart: every id a `deal` (or `intel` / `HEDGE_INTEL` / `commitments` /
  `funds`) points at MUST resolve to a real profile, so no transaction dangles
  without the profile it links to. So when a run ADDS a deal, intel item or
  hedge-fund story for an entity, first confirm that entity already exists in the
  roster (`managers` / `HEDGE_FUNDS` / `lps`) — and if it doesn't, ADD the profile
  in the same run (see §8's canonical roster). Never rename or delete an entity out
  from under records that still reference its id. This is enforced by
  **`tests/tx-profiles-coverage.mjs`**, which runs as part of the full suite
  (`node tests/run.mjs`) — the daily consistency pass MUST run the suite and keep it
  green, so an orphaned reference fails loudly instead of shipping a dead link. (The
  reverse — a profile with no transaction yet — is fine: the roster is a directory,
  and an entity may be listed before its first recorded deal.)
- **Borrower / company column shows the BORROWER, not the lender.** The Transactions
  "Borrower / company" column and the manager Investments table both lead with the
  OTHER named party in a deal — the borrower / portfolio company / target — via
  `v2/js/deal-parse.js` (`dealSubject`), never the lender that opens the headline. It
  parses the headline (connective verbs + a descriptor-skip), guarded so it never
  surfaces a money figure, a geo adjective, or an instrument acronym (ABS/CLO/NPL…).
  When a new deal's headline LEADS with the lender (often the manager or an affiliate,
  e.g. "H.I.G. Bayside … refinances packaging maker Amerplast Group") and the parse
  can't recover the borrower, set an explicit **`company`** field on that `deal`
  (a real party from its own sourced headline/summary — never invented); it wins over
  the parse. Audited back-corrections live in the `COMPANY_OVERRIDES` map in
  `deal-parse.js`. Enforced by **`tests/deal-parse.mjs`** (part of the full suite).
- **Borrower vs Sponsor vs Lender.** A sponsor-backed deal names three parties: the
  BORROWER / target company ("Borrower / company"), the SPONSOR / PE backer
  (`dealSponsor` → the Transactions "Sponsor" column), and the LENDER that provides
  the financing (`managerId` → "Lender / investor"). The borrower is the acquisition
  TARGET, never the sponsor whose name leads the possessive ("backs Bridgepoint's
  acquisition financing for GBA Group" → borrower GBA Group, sponsor Bridgepoint).
  When a new deal's sponsor can't be parsed, set an explicit `sponsor` field on the
  `deal` (a real party from its sourced text; `""` suppresses a false positive),
  mirrored by `SPONSOR_OVERRIDES` in `deal-parse.js`. The Transactions deal list also
  carries a **Sector** column (`sectorOf` in `credit/js/tx.js` — Real estate /
  Consumer / Infrastructure & energy / …) and a **Group by lender** toggle; the
  manager profile **Investments** table shares the same extraction and expands each
  row to the deal's short sourced narrative + sponsor.
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
    and the same commit message + trailers. A single run usually touches only the
    data modules (`credit/js/data.js`, `legal/js/data.js`, `macro/js/content.js`),
    `briefings.js` / `research.js` / `newsletters.js` / `ft.js`, and the regenerated
    `home-data.js` — a handful of calls. (The old per-app `credit/index.html` /
    `credit/js/app.js` no longer exist post-v2; do not PUT them.)
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

## Deterministic candidate collector (`scripts/collect-candidates.mjs`) — run it FIRST

The routines' hunt used to be free-form web search, and it under-collected badly (in
the week to 13 Oct 2026 ~80 routine runs added ~27 records; legal alerts fell from
~320/month to single digits). The collector makes the hunt deterministic: it pulls the
Google News RSS search feed for **every tracked entity** — all credit managers, hedge
funds and law firms in the data files — and prints the recent stories (outlets grouped
into one event) that Wire does **not** already hold (by URL or headline). A full
roster pass is ~400 feeds in under a minute.

```
node scripts/collect-candidates.mjs --size=400 --days=7          # human list
node scripts/collect-candidates.mjs --size=400 --days=7 --json   # machine-readable
node scripts/collect-candidates.mjs --kind=firm --size=40        # law firms only
```

Each candidate is a **cue, never a record**. For each one: open/verify it (WebSearch
the headline), find the primary (the firm's own release, the filing, or the tier-1
outlet in its `outlets` list — never cite an aggregator), take the exact date from the
source, apply the scope rules (credit, not equity; tracked firm; tracked court), and
only then append it (deals / intel / HEDGE_INTEL / legal items). Reject noise silently
(earnings commentary, an unrelated entity with a similar name). Exit code 2 means no
feed was reachable — say so and fall back to search; never treat that as "no news".

## Deterministic deal sources — SEC EDGAR (`/api/formd`, `/api/bdc`)

WebSearch alone is an effort-dependent source for the **Transactions deal ledger**
(`credit/js/data.js` `deals`) — it is why the ledger can quietly go days without a
new transaction. Two Worker endpoints give the sweep a DETERMINISTIC cue, fetched on
Cloudflare's egress (so a routine reaches them via the live site even when its own
environment blocks direct SEC fetches). Both return VERIFIED filing facts or a link —
**never a fabricated figure**; the routine opens the filing to confirm before recording.

- **`/api/bdc?cik=<CIK>` — BDC Schedule of Investments (borrower-level deal flow).**
  Each US BDC files its Consolidated Schedule of Investments in its latest 10-Q/10-K;
  this parses it to the top portfolio positions `{name, value, weight}` plus `asOf`,
  `filedAt`, `form` and the filing `source` URL. A position that is **new this quarter**
  (not already in `deals` for that manager) is a real financing to that borrower —
  append it as a `deals` item (type `Financing`/`Unitranche`/…), `managerId` the BDC's
  manager, `sourceUrl` the filing. The BDC→CIK map is the `type:"bdc"` entries in
  `credit/js/data.js` (e.g. ARCC `0001287750`, OBDC `0001655888`, BXSL `0001736035`,
  HLEND `0001838126`, GBDC `0001476765`, …). Each call parses a multi-MB 10-Q, so the
  sweep rotates a few BDC CIKs per run rather than all at once. Only act when `filedAt`
  is recent (a fresh quarter); an unchanged filing adds nothing.

- **`/api/formd?q=<name>&days=<N>` — Form D exempt-offering notices (US fund raises).**
  Proxies SEC EDGAR full-text search for Form D / D/A filings matching a manager/fund
  name in the last `N` days (≤120), returning `{issuer, cik, date, form, accession, url}`
  CANDIDATES — metadata only. A name query matches ANY issuer carrying that name, so
  each hit MUST be confirmed as the tracked manager's own vehicle (not a coincidence),
  and its offering amount read from the filing's `primary_doc.xml`, before it is
  recorded (a verified fund raise → `intel` type `Fundraising`/`First Close`/…). Query
  the US credit managers by name (Apollo, Ares, Blackstone, KKR, HPS, Blue Owl, Monroe,
  Golub, Barings, Sixth Street, …); European-only managers rarely file Form D.

These are CUES, not auto-ingest: the no-fabrication rule stands — verify every item
against its filing, dedupe against what is already in `deals`/`intel`, record the real
date and source URL, and skip anything you cannot confirm.

---

## X wire (Home) — a live server-fetched feed, roster in code

The Home **X wire** is a live, merged feed fetched **server-side** by the Worker
(`/api/xfeed`) from X's public syndication endpoint and drawn as our own cards
(see HOUSE_STYLE **R26**). It is **always current with no refresh work** — nothing
is topped up in code.

- To add/remove an account, edit the roster **`X_ACCOUNTS`** in
  `v2/js/home/xposts.js` (and mirror HOUSE_STYLE §8.8). The client passes those
  handles to `/api/xfeed`, so the roster in code is the source of truth for who
  appears — not the X List (the List/`X_LIST` is kept only for the "Open list on X"
  link).
- No tweet text or permalinks are stored — the Worker reads them live. `/api/xfeed`
  edge-caches a non-empty result briefly; a `&v=` bump on the cache key is only
  needed if the Worker's **parsing** changes.
- **Data source & membership (provider ladder).** `/api/xfeed` prefers, in order:
  1. **TwitterAPIs.com** (`XAPIS_KEY` secret) — the cheapest paid provider (~$0.04/1k
     tweets, ~3× cheaper than twitterapi.io). One call per handle for that account's
     recent tweets (incl. reposts), `Authorization: Bearer <key>`. The user-tweets path
     isn't pinned in our offline docs, so the Worker tries `/twitter/user/last_tweets`,
     `/twitter/user/tweets`, then `/twitter/user/tweets/complete` and uses the first that
     answers; `xApisTweetsFrom` + the shared `xNormalizeApiTweet` are field-defensive.
     **Roster is resolved from the live X List** (see below) when a List-capable key is
     bound, using `XAPI_KEY || XAPIS_KEY` — so even on this cheaper provider, **membership
     is managed on X, not in code**. `X_ACCOUNTS` in `xposts.js` is only the fallback
     (used when the List can't be read).
  2. **twitterapi.io** (`XAPI_KEY` secret, or `XAPIS_KEY` if it holds a twitterapi.io key)
     — resolves the **X List's current members** (Get-List-Members, cached ~15 min) and
     fetches each member's timeline (Get-User-Last-Tweets, merged). **Membership is managed
     on X** (`x.com/i/lists/2100283810713649423`) and auto-syncs within ~15 min — no code
     change. The List read runs on **whichever key is bound** (`XAPI_KEY || XAPIS_KEY`), so
     a single existing twitterapi.io key is enough; a second secret is not required.
  3. **Free X syndication** per handle (no key) — logged-out-safe but can serve stale
     timelines to datacenter IPs; the last resort.
  Each rung **falls through to the next if it returns nothing**, so a provider swap can
  never leave the wire worse than before.
  Keys are Cloudflare **secrets** (dashboard → the Worker → Settings → Variables and
  Secrets → add `XAPIS_KEY` and/or `XAPI_KEY`), never committed. Diagnostics on
  `/api/xfeed` (a key required): `?debug=apis` (raw TwitterAPIs.com response + which path
  answered), `?debug=1` (raw twitterapi.io last_tweets), `?debug=members`/`?debug=roster`
  (twitterapi.io List resolution); `?debug=env` (presence-only booleans for the keys).
- **Refresh cadence & cost.** The client (`startXWireAuto`) refreshes the wire **every 15
  minutes**, and **only during UK 06:00–midnight** (Europe/London, `_xwireInHours`) — so
  it never burns paid calls overnight; it also pauses while the app is backgrounded.
  Opening the X pane still fetches once at any hour (a deliberate user action). The Worker
  edge-caches a non-empty result **~15 min** (`max-age=900`), so manual taps / multiple
  viewers inside a cycle share one upstream fetch. Each refresh still fans out one
  `last_tweets` call per handle, so if cost bites further, the levers are the roster size,
  the interval, and the cache TTL — not the provider.
- If the wire shows "Live posts are unavailable", the source (paid or free) returned
  nothing — an upstream condition, not a data gap to fill in code. Enforced by
  `tests/home-xwire.mjs` + `tests/xfeed-parse.mjs`.

## Briefings & Key Moments (regenerate each run)

Two AI-generated surfaces are written **by this routine**, from the desks' own
already-sourced items — never at runtime, never from thin air. Both obey the
non-negotiable: **every line is a compression of an item Wire already holds, and
carries that item's real source URL.** No invented figures, no uncited claims; a
quiet slot gets a short output, not padding.

- **Market briefing — `briefings.js` (root; served no-cache, tokenless).**
  There is **ONE briefing — no morning/afternoon/evening slots, no selector.** The
  data model is a single object: `export const BRIEFINGS = { tz, date, time, lede,
  bullets:[…] }`. **REWRITE THE WHOLE briefing on EVERY run** — the full-refresh cron
  fires every ~2 hours — setting a new `date`+`time` stamp (London) and fresh `lede`
  and `bullets`. So the "Updated …" stamp advances roughly every two hours and the
  briefing is never more than one run (~2h) stale. **Never skip the briefing on a run**
  — even when little else changed, restamp it so the reader always sees a current
  edition. (History: the old three-slot, fixed-hour model left the morning slot frozen
  at 05:15 through the 08:00 and 10:00 runs on 2026-10-12, because those hours matched
  none of the hard-coded slot times; the single-briefing-every-run model removes that
  failure mode entirely.) The renderer still tolerates a legacy `{ slots, order }`
  object (collapsing to its freshest slot) for safety, but **author the single-object
  model** — that is canonical. Each slot is
  **4–6 `bullets`** (ideally one per desk — Macro · Bonds · Equities · Credit),
  each `{ html, src, srcName }` where `html` is authored markup
  (e.g. `<strong>…</strong>`) and `src` links the wire/desk item it summarises.
  **State the news, never narrate the reporting (HOUSE_STYLE R28).** The bullet prose
  states the fact directly; the outlet is the `srcName` link only. NEVER write "the FT
  reports/explains", "Bloomberg notes", "according to …", "<byline> says/writes/warns
  that", and never fold a second outlet's claim into a bullet ("… Bloomberg's Markets
  Daily notes …") — a bullet carries ONE `src`, so keep only what that source supports
  or drop the clause. (`_stripReported` removes a simple trailing "…, the FT reports" as a
  backstop but cannot unpick a woven-in "the FT explains why …" — so don't author one.)
  **EVERY desk carries a benchmark + a one-line market snapshot (all four — R28):** a Bonds
  bullet names a benchmark yield level (the US 10-year / Bund / gilt — a `%` or a `bp` move);
  an Equities bullet names an index level / `%` move (S&P 500, Nasdaq, FTSE) or a mega-cap
  price / market value; a Macro bullet names a macro benchmark (the US 10-year, the
  dollar/DXY, Brent/WTI/Gold, or the S&P 500 as the risk gauge) with the catalyst; a **Credit**
  bullet names an **actual credit metric** — a high-yield or IG spread / yield (US HY ≈ HYG,
  IG ≈ LQD, a CDX/iTraxx level), a CLO / new-issue spread, or a specific private-credit deal's
  **size and pricing** (e.g. "$1.2bn unitranche at SOFR+525"). **CREDIT IS DEBT, NOT EQUITY —
  a private-equity buyout / M&A auction / "PE puts X up for sale" is an Equities story; file it
  under Equities, never the Credit desk.** Pull the figure from the bullet's `src` or Wire's
  own live market data (the `/api/markets` levels the briefing strip shows) — never invent one;
  where a level isn't verifiable, quote the move or "record high" with the benchmark named. A
  bullet with no figure fails `tests/briefing-empty-bullet.mjs`. (If a desk genuinely has no
  fresh story the renderer shows a live benchmark fallback — Bonds US+UK 10Y, Equities
  S&P+NASDAQ, Credit HYG+LQD, Macro US 10Y — so never mislabel an equity story as Credit to
  fill the desk.)
  **HARD INFORMATION, not a headline (R28).** Every bullet — not just Bonds/Equities —
  must give specific, quantified fact: the level/size and its move (a `%`, a `bp`, a
  `$`/`£` amount, a multiple, a date), the named parties and the mechanism behind it,
  never a vague characterisation. Do NOT ship empty headline phrases ("a big push into
  X", "surprisingly manageable", "in the spotlight", "under pressure", "a challenging
  picture") unless the concrete number is in the same clause. A bullet that reads like a
  one-line newspaper headline is incomplete — add the figure or drop it, and prefer one
  fully-informative sentence to two thin ones. The test rejects a **headline-short body**
  (under 60 visible chars after the kicker is stripped), so verify each figure (WebSearch
  — paywalled FT/Bloomberg bodies may be egress-blocked) and write the number in.
  **No Overview lede:** the synthesis `lede` is RETIRED — it is not rendered, so do
  NOT author one (the field is optional/deprecated and may be omitted entirely).
  Update the slot's `date`/`time` to the run stamp.
  **FRESHNESS — every bullet is CURRENT as of the refresh (strict).** Give each bullet a
  `date` field = the cited item's REAL publication date (`"YYYY-MM-DD"`), and only include
  items within **4 days** of the slot date. Never reach back for a stale deal to fill a
  desk: the **Credit desk goes quiet for days** (see the "multi-day gap is a RED FLAG" sweep
  rule above) — when a sweep finds NO fresh, verified Credit item this run, DROP the Credit
  bullet for the slot rather than re-running an 11-day-old deal. Macro/Bonds/Equities are
  always current (daily market levels), so they stay; Credit is optional. Enforced by
  `tests/briefing-empty-bullet.mjs` — a bullet with no `date`, or one >4 days older than its
  slot, fails the suite and blocks the deploy.
  **Never ship a kicker with no body.** Every bullet's `html` must carry a real
  body sentence AFTER its `<strong>Desk &mdash;` kicker — a bullet that is only a
  kicker (headline written before its sentence) rendered as a bare desk heading
  over an empty void. This is enforced by `tests/briefing-empty-bullet.mjs`, which
  validates the committed `briefings.js` (every slot: `date`/`time`, and every
  bullet a body + `src` URL + `srcName`) — so a half-written brief turns
  the suite red before it can deploy, and the renderer additionally drops any such
  section as a fallback. Run the full suite before pushing a briefing refresh.
  **Desk focus — the FOUR market desks: Macro, Bonds, Equities, Credit.** Every
  slot covers these and only these (no Legal bullets — they have their own surface;
  the briefing "Credit" desk is the private-markets line below, distinct from the
  wire's CRD stream). Tag each bullet's `<strong>` lead with its desk (`Macro — …`,
  `Bonds — …`, `Equities — …`, `Credit — …`). **There is NO "M&A" or "Fixed income"
  desk** — the rates/government-and-corporate-bond desk is now **Bonds**; file a
  corporate deal under **Equities**, and a **private-equity / private-credit fund**
  story (a PE firm's portfolio exit, a fund raise, a private-credit deal) under
  **Credit**. The **Credit desk gives PREFERENCE to managers / hedge funds in the
  $1–15bn AUM band** — lead with an in-band name's story where there's a choice
  (a mega-fund item is fine when it's the day's clear private-markets headline, but
  prefer the $1–15bn names the app covers). **ALWAYS include at
  least one Equities bullet in every slot — it is a required section, never
  optional** (an equities-light session still gets an index-level read: the day's
  S&P 500 / major-index move and its driver). **Bonds & Equities bullets LEAD WITH
  THE MOVE AND ITS DRIVER** — a concrete yield/level and the catalyst behind it (e.g.
  "the US 10-year yield eased ~3bp to 5.28% as oil slid"), **NOT** a vague framing like
  "the FT asks why yields are so high": name the number and what moved it. **A real Bonds
  bullet is effectively mandatory — there is almost always a rates/government-bond story.**
  Make full effort to source one every slot from WSJ, FT, Bloomberg, the Economist or a
  comparable outlet (treasuries, gilts, Bunds, auctions, central-bank/rate-path moves,
  credit spreads — anything with a concrete yield level or `bp` move). The renderer's
  **yields-only Bonds fallback** (bare live US + UK 10-year pills, no "no story" wording) is
  a **LAST RESORT that means you did not look hard enough**, not an acceptable default — do
  not rely on it to fill the desk. **Credit is included when
  there is a private-markets story that day** (most days there is one worth a line);
  if there genuinely is none, the slot shows three desks — that is fine. **Section
  order is fixed: Macro, then Bonds, then Equities, then Credit.**
  The renderer enforces this canonical order (`DESK_RANK` keys
  `macro`/`bonds`/`equities`/`credit`) and round-robins the
  per-desk bullets under the `HB_MAX_BULLETS` cap so **each present desk always keeps
  its lead bullet**. **A NON-CANONICAL desk kicker is a hard error.** A bullet whose
  `<strong>` lead is anything other than `Macro`/`Bonds`/`Equities`/`Credit` (a stray
  `Banks —`, `Energy —`, `M&A —`, `UK —` from a malformed draft) is rejected two ways:
  `tests/briefing-empty-bullet.mjs` flags it at the data gate (suite red, deploy
  blocked), and `glance.js renderHomeBriefing` filters it out live (`DESK_RANK` lookup),
  so even if bad data slipped through, the card shows FEWER desks rather than an
  off-house one. Author only the four — do not invent a fifth desk — author **one strong bullet per desk** (≈4), since the cap shows
  one per desk; a 2nd same-desk bullet is dropped before another desk's lead.
  Author the desk name plainly (`Bonds`, `Credit`); a kicker entity like
  `<strong>R&amp;D …` is decoded for display, but these desk names need none. **One section per desk:** the card groups
  same-desk bullets under a SINGLE kicker, so a desk with two stories (e.g. two
  `Macro —` items) shows one "Macro" section with both items beneath — never a
  repeated kicker. Keep same-desk items adjacent so they group cleanly; each keeps
  its own `src`. Draw material from the macro `SUMMARY`/
  `COMMENTARY`/`IND_KEYMOMENTS`/`FX_KEYMOMENT`, the `EQ_INDICES` key moments and
  earnings calendar, and public rates/gilt/Treasury items — all already sourced.
  The Home briefing card shows an **accent unread dot** (while collapsed) whenever
  the latest slot's `(date · time)` stamp differs from the one the reader last saw,
  so bumping a slot's `time` on regenerate is what re-lights the dot — always stamp
  the run.
- **Key Moments — three grounded maps, each `{ text, src, srcName, date }`, all
  no-cache/tokenless (no `?v=` bump):**
  - **Equity indices** — `keyMoment` on `dashboard/js/data.js` `EQ_INDICES` (per
    index). Surfaces on the Dashboard ▸ Equities "Key moments" card.
  - **Rates** — `IND_KEYMOMENTS` in `macro/js/content.js`, keyed by
    `COUNTRY:indicatorKey` (e.g. `US:two_year`, `UK:two_year`). Surfaces as the
    "Key moments" mini-section under the Macro indicators rail for that country.
  - **FX** — `FX_KEYMOMENT` in `macro/js/content.js` (a single line for the
    USD/GBP/EUR/JPY board). Surfaces under the Markets ▸ FX matrix.

  In every case `text` compresses a real wire item — never a new claim — and an
  entry with no sourced reason is omitted / left `null`.

- **ETF flows heatmap — `allocations.js` (root; no-cache/tokenless).**
  `SECTOR_FLOWS.sectors` holds net ETF fund flows ($M, + inflow / − outflow) for
  the **same cross-asset ETF set as the home Top Movers board** (`MOVERS_ETF` in
  `src/index.js`) and **in the same order**: SPY/QQQ/IWM, XLK/SMH/XLF/XLV/XLE/XLI/
  XLP/XLY/XLU/XLRE, TLT/HYG, GLD/USO, IBIT. Keep the two lists aligned — if a
  ticker is added to / removed from `MOVERS_ETF`, mirror it here (same `t`, `name`
  and order). Each row's windows are `w1` (5-day), `m1`, `m3`, `m6`, `y1`, sourced
  from that fund's ETF Database (`etfdb.com/etf/<TKR>/`) flows page; re-source
  **all rows to one snapshot** each run and set `asOf` to that date.
  (There is **no 1-day column**: no free, reachable source gives a same-date
  1-day net flow for every instrument at once — etfdb/etf.com are Cloudflare-gated
  and WebSearch only returns scattered single-fund figures on mixed dates — so 1D
  was dropped rather than left blank or date-mixed. Do not re-add a `d1` window.)
  Surfaces on the Dashboard ▸ **Equities** "ETF flows" card.

Because these files are served no-cache and imported tokenless, editing them needs
**no `?v=` bump** — same discipline as `content.js`/`data.js`. Only bump a token if
you touch the *rendering code* (`nav-actions.js`, `dashboard/app.js`) or its CSS.

---

## The live routine prompt

The operational prompt is stored in the **"/Wire: full refresh"** Routine in the
Claude Code Routines UI and is edited there — it is the executable copy. This
document is the **authoritative reference** for what that run must do: the
**Invariants**, **Briefings & Key Moments**, and **Email sweep** sections are the
contract; the Routine prompt orchestrates them (sync → freshness audit → the desk
refreshes → briefing → stamps → email sweep → publish) and should defer here for
the detail rather than restating it. Current live behaviour: fires **every ~2
hours** through the London day, writes a **single** briefing every run, runs the
**freshness audit first**, and sweeps **research + newsletters + myFT** every run.
There are **no `?v=` cache tokens to bump** (code is Vite-hashed, data is no-cache).

---

## Email sweep — research · newsletters · myFT

Run every refresh, after the desk data. It folds the reader's forwarded email and
the Financial Times followed-topics feed into Wire. **Prerequisite:** the run needs
the **Gmail connector** pointed at `skaidrive2@gmail.com` (the ingestion mailbox).
If the Gmail tools aren't available this run, **skip the research + newsletter steps
and leave `research.js` / `newsletters.js` unchanged** — never blank them out. The
**myFT** step is independent of Gmail and runs regardless.

Research houses and newsletters are **disjoint**: a sell-side bank, asset manager,
rating agency or markets-intelligence house (Apollo, Goldman, JPM, Fitch, Guggenheim,
Moody's, S&P, UBS, With Intelligence, M&G Bond Vigilantes, PIMCO, …) goes to
**Research → `research.js`**; everything else the reader forwards goes to
**Newsletters → `newsletters.js`**. A sender belongs to ONE map, never both.
(Belt-and-braces: `glance.js` reclassifies any research-house note that lands in
`newsletters.js` into the Research lane via `isResearchPublication`, but keep the two
`PUBLISHERS` maps disjoint so it never has to.)

### 1. Research → `research.js` (the SOLE source of the Research lane)

Search Gmail for research-house emails received in the last ~2 days from the senders
in `research.js`'s `PUBLISHERS` map. Parse each real note into the `RESEARCH` array:
`{ id, publication, author, series, title, date "YYYY-MM-DD", time "HH:MM" (London),
summary, url }` — a one-line topic summary in **plain text with real Unicode
punctuation** (never HTML entities, never article body text), and the note's own
"read online" / canonical link as `url`. SKIP account-activation / verify /
preference-centre emails (no content). If a research house signs up that isn't in
`PUBLISHERS` yet, ADD its content-sender domain to the map (confirm the real sender on
the first delivery). Dedupe against existing entries (same `url`, or same `title` +
`publication`), keep ~40 newest. `research.js` is TOKENLESS and served
`Cache-Control: no-cache` — do NOT add any import token for it. Validate as an ES
module: `node --input-type=module -e "import('./research.js').then(m=>console.log(m.RESEARCH.length))"`.

### 2. Newsletters → `newsletters.js`

Newsletters reach the mailbox two ways, and BOTH searches must run every time —
auto-forwarding preserves the ORIGINAL sender, so a `from:stevedkennedy` search alone
misses every auto-forwarded newsletter:

1. **Manual forwards** (sender = stevedkennedy; original sender in the body's `From:`):
   `in:anywhere from:stevedkennedy@gmail.com newer_than:2d`
2. **Auto-forwarded copies** (sender = the publisher; `To:` still shows stevedkennedy).
   Build the from-list from the `PUBLISHERS` map in `newsletters.js`, e.g.
   `in:anywhere {from:news.bloomberg.com from:e.economist.com from:legalbusiness.co.uk …} newer_than:2d`
3. **Catch-all sweep** for NEW senders (self-healing):
   `in:anywhere deliveredto:skaidrive2@gmail.com newer_than:2d` — ignore system/admin
   mail (google.com / workspace, forwarding confirmations). Anything that reads as a
   newsletter from a sender NOT yet in `PUBLISHERS` is a newly-added subscription: ADD
   its sender domain → publication name to the map (unless it is a research house —
   that goes to §1), then parse it like any other.

Parse each: **publication/author** from the forwarded `From:` line (map domain →
publication via `PUBLISHERS`; set `series` for Bloomberg "Money Stuff" etc.); **title**
= subject with leading `Fwd:`/`Re:` stripped; **date/time** from the forwarded `Date:`
header (`YYYY-MM-DD` + `HH:MM`, 24h); **url** = the newsletter's own "View in browser"
link; **summary** = ONE short line (the newsletter's own subhead / lead sentence — a
phrase, never body paragraphs). If the links are all click-tracking redirects, use the
newsletter's canonical web page. Prepend to `NEWSLETTERS` with schema
`{ id, publication, author, series, title, date, time, summary, url }`; `id` = stable
slug `nl-<pub>-<slug>-<YYYYMMDD>`. Dedupe on `id` and `url`; keep the ~40 newest. Store
only headline + one-line summary + link — no article body text. `newsletters.js` is
TOKENLESS + `no-cache`; no import token to bump. `glance.js` renders `NEWSLETTERS` into
the feed under the `LETTER` label.

### 3. myFT → `ft.js` (independent of Gmail — run every time)

**Prerequisite:** the environment's network policy must allow `www.ft.com`. If the
fetch fails (403 / blocked / timeout), skip and leave `ft.js` unchanged — never blank
it on a failed fetch.

1. Fetch the reader's myFT RSS:
   `curl -sSL "https://www.ft.com/myft/following/601965b2-62d0-47e1-88cf-576ebc8a8a2e.rss"`
2. Parse each `<item>`: `title` (decode XML entities), `url` (the `<link>`, tracking
   params stripped — keep the canonical `https://www.ft.com/content/<uuid>` form),
   `id` (the `<guid>`, else the cleaned URL), `date`/`time` from `<pubDate>` → Europe/London.
3. **Lifestyle screen (required):** KEEP every news/business/politics/geopolitics/sport
   story EXCEPT lifestyle (arts, culture, film/TV/music, travel, dining, fashion,
   obituaries, general-interest features). Mirror the live feed's soft screen in
   `src/index.js` (`FEED_LIFESTYLE_RE` rejects; a headline also matching
   `FEED_MACRO_RE`/`FEED_MEGACAP_RE` is rescued).
4. Regenerate `FT_ITEMS` in `ft.js` — dedupe by `id`, newest first, keep the most
   recent ~40 that pass the screen. Headline, date, time and URL only — never body
   text (paywalled). `ft.js` is TOKENLESS + `no-cache`; no token to bump. `glance.js`
   renders `FT_ITEMS` under the `FT` label.

### 4. Publish, then clean the inbox

Commit `research.js` / `newsletters.js` / `ft.js` with the rest of the refresh (one
commit, published to `main` by the rebase-and-retry flow). **Only after the commit has
pushed successfully**, move each processed research/newsletter email to Gmail **Trash**
(`apply_sensitive_message_label(messageId, "TRASH")`, or the thread variant) — this
auto-purges after ~30 days and gives a recovery window. Never trash an email whose data
wasn't committed; if a message dedupes as already-present (a prior run parsed it but
couldn't trash it), trash it now so the ingestion inbox never lingers. These are
disposable forwarded copies; the originals stay in the source mailbox.

---

## Notes

- New `deals`/`intel` `type` values that aren't already in the transaction-type
  vocabulary (`credit/js/tx.js` `TX_TYPES` + the v2 credit views) render with default
  chip styling — reuse existing type strings where possible. Legal `area`/`type`/`firm`
  values MUST reuse the existing ids (records are looked up by them).
- Manager `legal` (general counsel) data and the firm/area/tier reference tables
  change rarely and are not part of the refresh.
