# Wire

A market-intelligence web app for **European private credit** — managers,
funds, LP allocators, fundraising news, deal activity and English-law legal /
restructuring alerts, plus a daily markets briefing. iPhone PWA is the primary
surface; desktop is a fixed-viewport terminal.

> ℹ️ **The dataset is real and public-source-only.** Every manager, fund, LP,
> fundraising item, deal, legal update and briefing figure carries its own
> verified **source URL and date** in the app; unknown fields are left blank. It
> is **not affiliated with, and contains no data from, any subscription
> database** (With Intelligence, Preqin, PitchBook, Debtwire, Octus). Each
> record's source links and "as of" date are the authoritative sourcing trail —
> verify against them before relying on any figure.

## One app

Wire is a **single v2 single-page app**, served under `/v2/` and mounted at the
site root. It has five tabs:

| Tab | What you get |
| --- | --- |
| **Home** | The landing glance: the daily markets briefing, live market pills, a price chart and the X (news) feed, drawn from across every content domain. |
| **News** | The unified newswire — one feed engine, filtered by a chip row across the content domains (credit, legal, macro and the rest). |
| **Dashboard** | KPIs and inline-SVG charts: capital raised by strategy, funds by status, capital by geography, fundraising momentum, and the latest intelligence + deal strips. |
| **Profiles** | Managers, funds and LP allocators, fully cross-linked — a manager profile shows its funds, known investors, deals and related intelligence. |
| **Transactions** | The deal-activity feed (investments, financings, exits, refinancings, restructurings, NPL/portfolio, M&A), tagged to managers and funds. |

Everything is interlinked: funds → managers → their other funds → known/interested
LPs → their commitments → matching funds → related intelligence and deals.

The pre-v2 top-level pages (the old standalone `/credit/` and `/legal/`
prototypes) are **retired behind edge redirects** — they are no longer a
user-facing surface. What survives from them are the **data modules** the v2 SPA
reads (see below).

## How it's built

- **Cloudflare Worker** (`src/index.js`) + Cloudflare Assets. A git-connected
  `main` auto-deploys: pushing to `origin/main` ships live.
- The v2 SPA is **built by Vite** (`npm run build` → `dist/`): `gen-home-data.mjs`
  regenerates the tokenless `home-data.js` slice → `vite build` bundles and
  content-hashes the JS and CSS → `postbuild.mjs` copies the data modules, shared
  root modules, retired pages and static files into `dist/` as-is.
- **Data modules** are plain ES-module exports, imported by a stable tokenless
  URL and revalidated `no-cache`, so the ~2-hourly content refresh edits only
  these files:
  - `credit/js/data.js` — managers, funds, LPs, intelligence (fundraising news)
    and deals (the Transactions feed).
  - `legal/js/data.js` — English-law legal updates and restructuring alerts (see
    [`legal/README.md`](legal/README.md)).
  - `macro/js/content.js` — the macro/markets content behind the briefing and
    Home glance.
- **No `?v=` cache tokens anywhere** — code is content-hashed by Vite; data is
  tokenless and `no-cache`.

```
src/index.js          # Worker entry (static assets + /api/* endpoints: reader, SEC EDGAR, feedback, KV)
wrangler.jsonc        # Worker config (serves dist/ as static assets)
vite.config.*         # Vite build config
v2/                   # the live SPA — shell, router, shared chrome, feed engine, per-tab views
credit/js/data.js     # credit data module (managers, funds, LPs, intelligence, deals)
legal/js/data.js      # legal data module (updates, restructurings)
macro/js/content.js   # macro/markets content module
home-data.js          # generated tokenless slice the Managers lane reads
docs/                 # HOUSE_STYLE.md (the rulebook) + refresh-routines.md (the content-refresh invariants)
tests/                # headless Playwright regression suite
```

## Authoritative docs — read these first

- **[`docs/HOUSE_STYLE.md`](docs/HOUSE_STYLE.md)** — the rulebook for layout,
  feed conventions, colour tokens, typography, chrome, behaviour and engineering
  discipline (rules R1–R18, T1–T19), plus §8 the canonical data-resource roster.
  Every change must conform; when it and anything else conflict, HOUSE_STYLE wins.
- **[`docs/refresh-routines.md`](docs/refresh-routines.md)** — the invariants for
  the ~2-hourly content refresh (credit / legal / macro + briefing + the
  research / newsletters / myFT email sweep), including sourcing, ES-module
  validation and publishing.

## Run it

```bash
npm install
npm run build          # Vite pipeline → dist/
npx wrangler dev       # or serve dist/ behind any static server
```

## Tests

A headless Playwright regression suite lives in [`tests/`](tests/README.md) —
page boot on every route, the shared chrome, swipe/sticky interplay, the chip
lifecycle, the notifications bell, the pinned filter bars, the reader, the feed
engine and the content-coverage guards.

```bash
node tests/run.mjs                      # full suite (bounded parallel pool)
node tests/run.mjs <name>               # iterate on one spec
TEST_ROOT=dist node tests/run.mjs       # prove the built output serves identically
```

Run the full suite before every push to `main` (a push deploys immediately). The
GitHub Action in `.github/workflows/tests.yml` re-runs it on each push as an
**advisory** safety net — it cannot block the Cloudflare deploy, so the suite is
yours to run first.
