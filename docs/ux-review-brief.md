# Wire — UX & Information-Architecture Review Brief: Profiles + Transactions

> Handover for a fresh Claude Code session. Read this whole brief, then `CLAUDE.md` and
> `docs/HOUSE_STYLE.md`, before doing anything. **This is a review-first engagement:
> audit, evidence and proposals come first; change nothing until the owner approves.**

---

## 1. What Wire is, and who it is for

Wire (repo `sk8905/meridian`) is a **private market-monitoring terminal** for one
professional user working across **European private credit, hedge funds, and Big Law /
restructuring**, with a **G7 + Western Europe macro** backdrop. It answers, quickly and
from one place:

- *What happened today* in my markets (Home / News wire, briefing, markets panel)?
- *Who is doing what* — managers, hedge funds, investors (LPs), law firms (**Profiles**)?
- *What deals and credits are moving* — primary issuance, secondaries, the European
  leveraged-loan credit universe, BDCs (**Transactions**)?
- *What's changed on the names I follow* (Watchlist, notifications, "What's new")?

It is **monitoring only** — not a CRM or business-development tool (HOUSE_STYLE **R19**):
no contact management, pipelines, outreach or origination features. Every record is real,
dated and sourced (**R7**); unknown fields are `null`/"n/a", never guessed.

**Surfaces.** The **iPhone PWA is the primary surface** (installed to the home screen —
so there is **no browser chrome / back button**; navigation must be self-sufficient).
Desktop is a **fixed-viewport terminal** (≥761px, R1). Phone ≤760px is a scrolling
document (R2). Bottom tab bar on phone: **Home · News · Dashboard · Profiles ·
Transactions**; Menu is the top-right hamburger (R34).

**The goal of this review:** make Profiles and Transactions a **top-class, effortless
information depository** — a user should be able to find any entity or deal in a few
taps, understand it at a glance, move sideways to everything related, and always get
back to where they were.

---

## 2. Scope

**In scope:** the **Profiles** and **Transactions** sections end-to-end — UX, visual
design, features, functionality, data organisation and presentation — **and every
path into and out of them** (Home wire rows, Watchlist, search/⌘K palette, notifications,
"What's new", Dashboard panels, reading-pane entity links, deep links).

**Out of scope (unless they block a journey):** the data-collection routines, Worker
data APIs, macro dashboard internals, the news engine itself.

---

## 3. Current structure (as built — verify everything yourself)

### Profiles — `/v2/profiles/` (`v2/js/profiles/app.js` + `v2/js/credit/detail.js`, `v2/js/legal/detail.js`)
- **List view** with four chips: **Managers · Hedge Funds · Investors · Law firms**
  (`?tab=managers|hedgefunds|investors|firms`, remembered).
- **Hash routes** (detail renders in place):
  `#/manager/<id>` · `#/hf/<id>` · `#/lp/<id>` · `#/firm/<id>` · `#/clo/<id>/<name>` ·
  `#/item/<id>` (a legal item) · `#/fund/<id>` (retired → redirects to its manager).
  `?focus=<id>|k:<key>` deep-links to and highlights a specific row.
- **Manager profile** tabs: **News · Vehicles · Investments · Business** (R21). Vehicles
  merges funds, CLOs, listed BDC/CEF vehicles; Investments = surfaced deals tagged
  debt/equity + sub-type (curated or auto-derived with `~`).
- **Hedge-fund profile** tabs: **News · Holdings · Filings** — live 13F top-10 holdings
  (`/api/13f`), net AUM chip + **regulatory AUM (SEC Form ADV)** chip, SEC links.
- **Investor (LP)** and **Law-firm** profiles (firm: alerts, insights, pcDeals, cases).
- Identity header on every profile: ☆ **follow** star (feeds the Watchlist), **Peers**
  dropdown (3–5 similar entities, R24), **Sources** dropdown, website / SEC links.

### Transactions — `/v2/transactions/` (`v2/js/transactions/app.js`)
- Four primary modes: **Primary · Secondaries · Credits · BDCs**.
- Primary/Secondaries: transaction-**type** sub-tabs (desktop: nested in the left rail;
  phone: a horizontal chip strip), **sector** sub-category chips, a **group-by-lender**
  toggle, filters **Period** (`#tx-period`: all / 30d / 12m / YTD / since 2020) and
  **Minimum size** (`#tx-min`: $100m / $500m / $1bn).
- **Credits** (R22): the European leveraged-loan / CLO obligor universe (118 compiled so far, target ~300) by sector, issuer
  rating, jurisdiction, 12-month rating trend.
- **BDCs** (R23): listed vs interval/private BDCs, certifiable figures, live price÷NAV.

### Data organisation (what links to what)
| Entity | Count (approx.) | Key relations |
|---|---|---|
| Credit managers (`managers`) | 219 | → funds (357), CLOs, deals (957), intel (985), webNews; peers |
| Hedge funds (`HEDGE_FUNDS`) | 151 | → HEDGE_INTEL news, 13F holdings (SEC), raum (Form ADV); peers |
| Investors (`lps`) | 23 | named in deals/intel; profile fields (AUM, allocation, mandate) |
| Law firms (`legal firms`) | 26 | → legal items (≈1,600 alerts/insights), cases, restructurings, pcDeals |
| Deals / intel | ~1,950 | each `managerId` + `fundId`, type, date, sourceUrl |
| EU credits / BDCs | 118 (target ~300) / 31 | Transactions ▸ Credits / BDCs |

Data lives in `credit/js/data.js`, `legal/js/data.js`, `credit/js/eu-credits.js`,
`credit/js/bdcs.js`; Home reads the generated slice `home-data.js`.

---

## 4. What to review — be exhaustive and evidence-led

### A. Click paths & back paths (top priority)
For **every journey in §5**, record the exact taps, then test **getting back**:
- In-app back affordances (breadcrumbs, header back, tab re-tap) — is there always one?
- **Browser/PWA back**: hash history — does Back return to the previous *state* (list
  tab, filter, scroll position, open tab within a profile) or dump the user elsewhere?
- **iPhone edge-swipe back** in the installed PWA; Android/desktop Back key.
- **Scroll restoration** on returning to a long list; filter/chip state preservation.
- Deep links (`?focus=`, `?tab=`) from search, Watchlist, notifications, What's new.
- Dead ends, loops, links that open externally when they should stay in-app (and vice
  versa), redirects (e.g. the retired fund page), 404/empty routes.

### B. Information architecture & organisation
- Is the Profiles / Transactions split the right one? Are deals findable from both the
  manager (Investments tab) and Transactions — is that duplication helpful or confusing?
- Taxonomy and labels (tab names, deal types, sectors, "Vehicles", "Business"…) — do
  they match how a credit / hedge-fund / legal professional thinks?
- Default sort orders, grouping, density, what is above the fold on phone.
- Cross-linking: deal → manager → fund/CLO → investor; firm → deal it advised;
  hedge fund → holdings → related news; entity names inside text linking to profiles.
- Empty / thin states (many hedge funds have little news; estimated dates show "≈"/"c.").

### C. Features & functionality
- Search & ⌘K palette reach into every entity and deal type?
- Filters: discoverable, combinable, resettable, reflected in the URL (shareable/back-able)?
- Follow ☆ → Watchlist → notifications loop: obvious, consistent on every profile type?
- Peers, Sources, SEC/website links, live 13F/price data: loading, failure, staleness cues.
- Anything a professional would expect and miss (compare/side-by-side, timelines,
  "recent activity" summaries, export) — propose, don't build. Respect R19 (no BD tools)
  and R20 (no explainer/methodology prose in the UI).

### D. Visual design & consistency
- Conformance with HOUSE_STYLE (R8–R14 colour/typography/chip rules, one feed engine).
- Phone vs desktop parity; touch targets ≥44px; no horizontal scroll (T5); contrast.
- Visual hierarchy of the identity header, tabs, tables; consistency between profile types.

### E. Data presentation quality
- Are numbers comparable (currency, units, as-of dates, net vs regulatory AUM)?
- Are stale or estimated figures clearly marked without clutter?
- Spot-check that what a profile shows matches its records (counts, latest item dates).

---

## 5. Journeys to walk (phone 390×844 AND desktop 1280×900)

1. Home wire row about a manager → its profile → a deal in Investments → that deal's
   source → back to the Home wire at the same scroll position.
2. Profiles ▸ Managers list → filter/scroll → open a manager → Vehicles → a CLO → back
   ×3 to the exact list position.
3. Search "Ares" (or ⌘K) → the right entity among managers / funds / deals → back.
4. Transactions ▸ Primary → a type sub-tab → sector chip → size ≥$500m → open a deal →
   its manager → back to the same filtered list.
5. Transactions ▸ Credits → find an obligor by sector → rating trend → anything related?
6. Transactions ▸ BDCs → a BDC → its manager profile (if linked) → back.
7. Profiles ▸ Hedge Funds → a fund → Holdings (live 13F) → Filings → Peers → a peer → back.
8. Follow a hedge fund, a law firm, a fund and an investor → Home ▸ Watchlist shows them
   → tap a Watchlist row → lands on the right story/profile → back.
9. Notification bell / Menu ▸ "What's new" → a new item → its profile → back.
10. Profiles ▸ Law firms → a firm → an alert (`#/item/…`) → the deal/entity it mentions.
11. Investor (LP) profile → which managers/deals involve it? Is that discoverable?
12. Deep link pasted from outside (`/v2/profiles/#/manager/m5?focus=…`) on a cold start.
13. Rotate / resize desktop↔phone breakpoints mid-journey; reload mid-journey.

---

## 6. How to work

1. `npm ci` (fresh clones have no node_modules). Read `CLAUDE.md`, `docs/HOUSE_STYLE.md`.
2. Run the app locally: the test harness serves the static app with stubbed APIs —
   reuse `serve()` / `launchChromium()` / `PHONE` / `DESKTOP` from `tests/lib.mjs`
   (Chromium is pre-installed; never run `playwright install`). The live site is behind
   Cloudflare Access and not reachable from a session.
3. Script each journey with Playwright, **screenshot every step** at both viewports,
   capture console/page errors, and record history length / `location.hash` / scroll
   position at each Back. Save evidence under your scratchpad and reference it.
4. Read the code behind what you observe (`v2/js/profiles/app.js`,
   `v2/js/credit/detail.js`, `v2/js/legal/detail.js`, `v2/js/transactions/app.js`,
   `v2/js/chrome.js`, `v2/js/runtime.js`, `v2/js/views/*`, `v2/css/*`) so every finding
   names its cause.

---

## 7. Deliverables (in this order)

1. **Findings report** — a table per area (A–E): ID · severity (Critical / High /
   Medium / Low) · journey + exact click path · what happens vs what should · evidence
   (screenshot) · root cause (file:line) · proposed fix · effort (S/M/L).
2. **Click-path & back-path map** — for each journey: steps, where Back goes today,
   where it should go.
3. **IA proposal** — current vs proposed site map for Profiles + Transactions (tabs,
   labels, defaults, cross-links), with the reasoning.
4. **Prioritised remediation plan** — quick wins (≤1 day), then larger items, each
   with acceptance criteria and the spec that will guard it.
5. A blunt **overall verdict**: how close is this to a "top-class, easy to navigate
   information depository", and the five changes that would matter most.

Present it to the owner as a clear, non-technical summary plus the detailed tables.
The owner prefers **tables, concise prose, and links**.

---

## 8. Rules if/when the owner approves changes

- Follow `CLAUDE.md`: commit directly to `main` (each push deploys), rebase on the latest
  `origin/main` first (scheduled routines push data files concurrently), run the full
  suite `node tests/run.mjs` (background it; ~2.5 min) before every push; build + test
  `dist` for UI changes (`npm run build` → `TEST_ROOT=dist node tests/run.mjs <specs>`).
- Every new behaviour gets a spec; never weaken a test to pass.
- **No `?v=` tokens**, no model identifiers in commits (trailer:
  `Co-Authored-By: Claude Code <noreply@anthropic.com>`), no fabricated data, no BD/CRM
  features, no explainer prose in the UI. Keep HOUSE_STYLE current with any rule change.
- Work in approved batches; report after each batch with before/after screenshots.
