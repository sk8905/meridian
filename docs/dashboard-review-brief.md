# Wire — Dashboard Review Brief

> Handover for a fresh Claude Code session. **Review and recommendation first — change
> nothing until the owner approves.** Read this brief, then `CLAUDE.md` and
> `docs/HOUSE_STYLE.md`. Two other sessions are running in parallel: a UX review of
> Profiles + Transactions (`docs/ux-review-brief.md`) and a holistic product & data
> review (`docs/product-review-brief.md`). Stay on the **Dashboard**; don't duplicate them.

---

## 1. Who it is for and what the Dashboard should do

The owner is a **finance lawyer focused on European credit funds** — especially managers
up to **~US$15bn AUM** with strategies **targeting 15%+ IRR** (opportunistic credit,
special situations, distressed, junior/mezzanine, asset-based, NPL, hybrid capital). They
have **no Bloomberg / With Intelligence / Preqin / PitchBook / Octus / 9fin / Debtwire**;
Wire is their own terminal, built only from **free public sources**. Macro scope is
**G7 + Western Europe** (HOUSE_STYLE R4c). Wire is **monitoring only** (R19).

The Dashboard is the **at-a-glance market state** page: in under a minute the owner
should know where rates, spreads, credit stress, defaults, fundraising, the hedge-fund
picture and the legal/restructuring environment stand — and what changed — with every
number sourced and dated (R7). It must work on the **iPhone PWA (primary)** and the
desktop terminal.

---

## 2. What it is today (verify everything)

`/v2/dashboard/` — `v2/js/dashboard/app.js` (~1,100 lines), static fallback data in
`dashboard/js/data.js` (`DASH_ASOF` is **2026-07-24 — stale**; a rota is meant to refresh
it), macro content from `macro/js/content.js`, live numbers from Worker APIs
(`/api/rates`, `/api/yield`, `/api/govyields`, `/api/eqindices`, `/api/worldindices`,
`/api/13f`, `/api/macro`).

Six sub-tabs (`SUBTABS`):
| Tab | Panels (function names in app.js) |
|---|---|
| **Macro** | regime pills, Fed / BoE panels, rate outlook, yield curve + world yield curves, macro news, cycle indicators, market-sizes matrix (R25) |
| **Equities** | index strip, world-indices heatmap, sector bars, valuation & volatility, IPOs, earnings, sector flows, key moments, tape |
| **Bonds** | government-yields heatmap, yield changes, curve shape, key moments, tape |
| **Credit** | spreads (`CR_SPREADS` — ICE BofA **US** IG/HY/BB… via FRED), stress table, maturity wall, credit news, private-credit stats (`PRIVATE_CREDIT`, e.g. Fitch US private-credit default rate), tape |
| **Hedge Funds** | 13F consensus panel (`HF_13F`, now built from 96 tracked funds' own SEC filings), live per-fund 13F holdings |
| **Legal** | searchable legal database (alerts + cases), legal news |

Observations to test, not assume: much of the Credit tab is **US-centric** for a
**European** credit user; the ECB has only just been added as a wire source; the
fallback snapshot is stale.

---

## 3. What to review

### A. Relevance to the owner (most important)
- For each panel: does it help a European credit-fund lawyer? Keep / change / drop,
  with reasons. What is **noise** (e.g. equity detail) vs **signal** for this user?
- What's **missing** that this user would check daily — think European HY/leveraged-loan
  spreads, Euribor/€STR/SONIA and swap rates, ECB/BoE policy path, European default and
  distress rates, CLO issuance and spreads, private-credit fundraising and fund closes,
  NAV-finance / fund-finance conditions, restructuring and insolvency counts (UK Part
  26A plans, insolvency statistics), key regulatory dates (AIFMD II, ELTIF), deal-volume
  trackers. Propose **free sources** for each (FRED ICE BofA **Euro** series, ECB Data
  Portal, BoE database, Eurostat, UK Insolvency Service statistics, rating-agency free
  releases, central-bank financial-stability reports …), with access method, cadence
  and terms-of-use notes.

### B. Data quality on the page
- Every figure: **source + as-of date** visible (R7)? Live vs fallback clear? Stale
  values flagged? Units/currency consistent (bps vs %, $ vs €)?
- Spot-check 15–20 displayed figures against their cited source; report mismatches.
- What happens when a live API fails (offline, Worker error) — sensible fallbacks?

### C. Information design & visual quality
- Hierarchy: what is above the fold on phone and desktop? Is the most important state
  readable in 5 seconds? Too many panels? Duplication with Home (markets panel,
  briefing) — should the Dashboard own some of it instead?
- Chart/table choices: right form for the data (trend lines vs tiles vs heatmaps),
  axes, labels, colours (HOUSE_STYLE R8–R11 tokens), dark-mode legibility, density.
- Consistency across the six tabs (panel chrome, as-of labels, chips — R14).

### D. Navigation & interaction
- Sub-tab order and naming; is the default tab right for this user?
- Drill-downs: does a panel link to the underlying data (a profile, a deal list, a
  chart, the source)? Back behaviour (PWA has no browser back button).
- Phone layout: no horizontal scroll (T5), touch targets, swipe behaviour, load speed.

### E. Freshness & maintenance
- Which panels depend on the AI refresh routines vs deterministic live APIs? Which
  should move to deterministic collectors (e.g. GitHub Actions, as already done for SEC
  and law-firm data)? Is `DASH_ASOF` maintenance realistic?

---

## 4. How to work
- `npm ci`; read the docs and `v2/js/dashboard/app.js`, `dashboard/js/data.js`,
  the dashboard CSS under `v2/css/`, and the Worker handlers for each API in `src/index.js`.
- Run the app locally via `tests/lib.mjs` (`serve()` with stubbed APIs + Playwright;
  Chromium is pre-installed — never `playwright install`). Screenshot every tab at
  **phone 390×844** and **desktop 1280×900**, light and dark. The live site is behind
  Cloudflare Access, so live API values must be checked against their public sources
  (FRED, ECB, BoE …) via WebSearch.
- Existing specs to read: `tests/dashboard-*.mjs`, `tests/hfm-*.mjs`, `tests/markets-panel.mjs`.

---

## 5. Deliverables
1. **One-page verdict** — is the Dashboard doing its job for this user; top 5 fixes.
2. **Panel-by-panel table** — tab · panel · keep / change / drop · why · data source
   and freshness today · issues found (with screenshot refs).
3. **Missing-panel proposals** — what to add, why it matters to a European credit-fund
   lawyer, the free source, access method, cadence, terms notes, effort (S/M/L).
4. **Data-quality findings** — the spot-check results, stale/unlabelled figures.
5. **Proposed layout** — per tab (phone and desktop), in priority order, as a sketch or
   a simple wireframe description.
6. **Prioritised plan** — quick wins, then larger items, each with acceptance criteria
   and the spec that would guard it.

Owner preferences: **tables, concise prose, links to sources**; plain-English summary
first. If later asked to implement, follow `CLAUDE.md` (commit to `main` after rebasing
on the latest `origin/main`; full suite `node tests/run.mjs` green before every push;
build + `TEST_ROOT=dist` checks for UI changes; a spec for each new behaviour; no `?v=`
tokens; no model identifiers in commits; never fabricate data).
