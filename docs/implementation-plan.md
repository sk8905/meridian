# Wire — Implementation plan (product & data review, Oct 2026)

Source: the holistic product & data review (`docs/product-review-brief.md`, session
"/Wire - Holistic review"). This file is the **shared plan and coordination point**:
sessions and routines read it before starting work in these areas, and tick items off
here when they ship. HOUSE_STYLE stays authoritative for rules; this file is the work
queue.

Status key: ✅ shipped · 🟡 in progress · ⬜ not started · ⛔ blocked (owner action).

## 0. Who owns what (avoid cutting across)

| Area | Owner | Notes |
|---|---|---|
| Profiles / Transactions **UI & click paths** (R35, R36, `v2/js/profiles`, `v2/js/transactions`, `v2/js/credit/*`, `tui.css`) | "/Wire - Profiles & Transactions" session (`docs/ux-review-brief.md`) | This plan does not edit those views. Where a data change needs a UI follow-up it is listed in §6 for that session. |
| ~2-hourly refresh + heavy sweep (`credit/js/data.js`, `legal/js/data.js`, `macro/js/content.js`, briefing, email sweep) | Scheduled routines (`docs/refresh-routines.md`) | Data edits from this plan are made by **re-runnable scripts** so a rebase conflict is resolved by taking `origin/main` and re-running the script — never by hand-merging a routine's records. |
| 2020 backfill (`backfill/checklist.json`) | Backfill routine / "/Wire - Debugging and backfilling" session | This plan changes only the **worklist order** (niche-first) and proposes ADD targets; it never edits checklist events. |
| Data model, niche scoring, source licensing, new collectors, reader compliance | This plan | — |

## 1. Phase A — quick wins (days)

| # | Item | Status | Success measure |
|---|---|---|---|
| A1 | **Niche-fit scoring** (`scripts/lib/niche.mjs`, `scripts/niche-fit.mjs`): European · ≤$15bn · 15%+ strategy → core / adjacent / context / off | ✅ | 44 core managers identified; `tests/niche-fit.mjs` |
| A2 | **Niche-first worklists**: `manager-coverage.mjs` rotates within the core tier first; `backfill-progress.mjs` builds niche-first and proposes ADD for core managers not on the checklist | ✅ | First BUILD/ADD target is core; core managers' records per manager ≥ 13 (today ~6) |
| A3 | **Reader compliance**: hosts whose ToU bar automated access are link-only (`READ_LINKONLY`; Moody's first) | ✅ | `tests/reader-terms.mjs` |
| A4 | **Terms audit of every wired source** (feeds, reader, APIs, X, proxies) → fixes | 🟡 | Every host has a verdict in §4 |
| A5 | **Currency as data**: manager/investor AUM restated to USD with `aumFrom` provenance (done by the UX session, R29); funds carry `ccy` set only where the fund's own sourced text states it (no FX); otherwise absent | ✅ | 0 money figures without a currency OR an explicit `null`; UI follow-up in §6 |
| A6 | **AUM reconciliation**: stale `aumTotal` vs `aum`/`aumText` (e.g. Arini 11 vs ~$18bn, Cheyne 12 vs $15bn) | ⬜ | List = profile = source text |
| A7 | **Controlled vocabularies**: fund `status` (4 values + `evergreen` flag), `strategy` (STRATEGIES), `domicile` (country) + new `structure` field; integrity ratchets | ✅ | Enum spec green; free-text variants → 0 |
| A8 | **Roster gaps**: add LCM, Avenue (Europe), AnaCap, Alchemy, Ironshield; missing funds (Cross Ocean ESS IV/V, Dolomite/Taconic ECDF III/IV, Arrow ACO III, Chorus V, Alcentra special sits, SVP V/VI) — each re-verified | 🟡 | 15-name niche test set: 15/15 covered |
| A9 | Off-niche names are **kept** (owner-added, R4c rule 4) but ranked last by A1 — never deleted | ✅ | — |

## 2. Phase B — medium (weeks)

| # | Item | Status | Depends on | Success measure |
|---|---|---|---|---|
| B1 | **Fund-terms schema**: `targetIRR {low, high, basis, ccy}`, `structure`, `closes[]` (first / interim / final with date + amount), `evergreen` | ⬜ | A5, A7 | Funds with a sourced target return: 10 → 60+ |
| B2 | **Deal ↔ adviser**: parse the law-firm "advises" alerts (already collected, 1,595 items) into `deals[].advisers[{firmId, role, side, sourceUrl}]` | ⬜ | — | % of deals with ≥1 adviser |
| B3 | **GLEIF LEI enrichment** (CC0) as a GitHub Action — managers/funds/SPVs get `lei` + parent chain | ⬜ | — | Managers with an LEI |
| B4 | **The Gazette corporate notices** (OGL; corporate only — personal-insolvency notices excluded) for tracked obligors (Transactions ▸ Credits) and restructuring names | ⬜ | — | Notices/week matched to a tracked entity |
| B5 | **Companies House** charges (MR01) + streaming for UK borrowers/managers | ⛔ owner: free API key | key as repo secret `CH_API_KEY` | Charges matched to tracked borrowers |
| B6 | **SEC Form D** amount-sold for tracked funds (EDGAR full-text search already proxied at `/api/formd`) → fund `raised` cues | ⬜ | — | Fund closes with a filing-backed amount |
| B7 | **LP commitments** from UK LGPS ModernGov papers + US public-pension board documents (CalPERS, PSERS, WSIB, Oregon) → `commitments` | ⬜ | B1 | commitments 9 → 200+ |
| B8 | **Restructurings & courts** surface + include restructurings and case `counsel` in Dashboard search | ⬜ | UX session (§6) | 80 restructurings reachable in ≤2 taps |
| B9 | **Law-firm roster**: Lux/Irish fund counsel (Arendt, Elvinger, Loyens & Loeff, Matheson, A&L Goodbody, Maples, Walkers) + US restructuring/finance (Dechert, Paul Hastings, Akin, Milbank, Goodwin, Cadwalader) | ⬜ | robots check in collector | 26 → 40 firms |
| B10 | **Find Case Law** automated feed (Atom) | ⛔ owner: computational-analysis licence | licence | — |

## 3. Phase C — large (months)

| # | Item | Status | Success measure |
|---|---|---|---|
| C1 | **Canonical JSONL store** per collection + JSON Schema; `npm run build` generates today's `data.js` modules from it (app unchanged) | ⬜ | Byte-identical render; suite green on `dist` |
| C2 | **One write path** `scripts/upsert.mjs` (schema, dedupe by URL/ID, provenance required) — routines switch to it | ⬜ | Duplicate URLs 31 → 0 |
| C3 | **SQLite → Cloudflare D1** read model + filter endpoints; fund list UI | ⬜ | Filter specs |
| C4 | **Entity IDs**: LEI, Companies House no., CIK, FCA FRN, case citation, ISIN; alias table | ⬜ | Entity-resolution precision |
| C5 | **Fund-event timeline + LP graph**; **net IRR** from US pension reports | ⬜ | Funds with a dated close event; funds with sourced net IRR |
| C6 | **Regulatory tracker** (AIFMD II, ELTIF 2, FCA/ESMA/CSSF/CBI) from official feeds (legislation.gov.uk, EUR-Lex, regulators' RSS) | ⬜ | Items/month |

Migration note (C1–C2): the routines edit `credit/js/data.js` directly today. The switch
to JSONL happens in one coordinated step — the routine prompts (Routines UI) and
`docs/refresh-routines.md` change in the same commit that makes `data.js` generated.
Until then nothing in this plan restructures the data files.

## 4. Licensing & terms — roadblocks and recommendations

Rule for every source: **use it only within its terms.** Where the terms don't allow
automated use, Wire keeps a headline + link (a link is not a reproduction) and the
fact itself is recorded from a source that does allow it.

| Source | Roadblock | Options considered | Recommendation |
|---|---|---|---|
| **Find Case Law** (TNA) | Open Justice Licence excludes "computational analysis" (programmatic bulk search/extract/enrich). Wire holds 162 judgments from it. | (a) apply for the free computational-analysis licence; (b) per-judgment manual curation only; (c) BAILII — bans bulk download/robots, no better | **(a) Apply now** (caselawlicence@nationalarchives.gov.uk). Until granted: no automated Atom ingestion (B10 blocked); individual, search-led citation of a judgment (link + neutral citation + date) continues — that is ordinary reuse, not bulk analysis. |
| **Moody's** | ToU bar automated access, scraping, data mining, AI/NLP use | link-only vs drop | ✅ **Link-only** (shipped, A3). Rating facts are recorded from the issuer's own release or a press report, not Moody's pages. |
| **S&P / Fitch rating pages** (Transactions ▸ Credits ratings) | Fitch ToU: no copying/storage without consent; S&P ToU to confirm (A4) | (a) keep rating letter + date + link as a fact, entered per action; (b) source from issuer releases / bond prospectus notices; (c) drop ratings | **(a)+(b)**: a rating is a fact; store only letter/outlook/date + link, never text; prefer the issuer's own announcement as the cited source. No automated fetching of agency pages. |
| **RNS** (LSE) | 2027 licence bars feeding RNS into an LLM; personal-display only | use the issuer's IR-site copy of the same announcement | **Cite the company's own IR page** for listed managers (ICG, Bridgepoint, Tikehau…); don't route RNS text through routines from 1 Jan 2027. |
| **Companies House** | Needs a free API key (600 req/5 min); OGL but you remain responsible for personal data | — | **Owner: register a key** → repo secret `CH_API_KEY`. Collect company/charge data only; no officer home addresses or DOBs. |
| **The Gazette** | OGL excludes personal data | filter by notice type | **Corporate notices only** (winding-up, administration, CVL, moratorium, plan/scheme meetings); never personal-insolvency notices. |
| **FCA Register** | No Register-specific reuse licence found; FCA copyright | mirror vs verify | **Verify-and-link only** (FRN + status + link), no bulk mirror. Owner: free API key if wanted. |
| **CBI / CSSF / ESMA registers** | CBI: no API, licence unconfirmed; ESMA: reuse with acknowledgement; no complete EU AIFM register | — | Record factual fields (authorised? domicile, structure) with link + acknowledgement; no bulk mirror until each licence is confirmed. |
| **OpenCorporates** | Free access excludes financial institutions; ODbL share-alike | primary registries instead | **Don't use**; go to Companies House / GLEIF / CRO directly. |
| **Legal 500 / Chambers** | Database right + ToU — no scraping | firms' own ranking press releases; Wire's own deal ↔ adviser data | **Build Wire's own adviser league tables** from B2. |
| **Paywalled specialists** (PDI, Creditflux, 9fin, Debtwire, Octus, FT, Bloomberg) | Paywalls | headline-only leads (current) | **Keep current rule**: public headline/standfirst only, verify via a readable primary, never paraphrase body text, never bypass a paywall. |
| **Rating-agency / pension / council PDFs** | Normal copyright | facts + link | Extract facts (commitment, fund, amount, date) and link; no document re-hosting. |
| **People moves (GDPR)** | Personal data | — | Professional role only (name, firm, title, date, source); written legitimate-interests note; no LinkedIn scraping (R19); exclude the Individual Insolvency Register. |
| **In-app reader / proxies** (Jina, Firecrawl) for bot-walled sites | Several publishers' ToU may bar automated retrieval even for personal use | per-host verdict from the A4 audit | Pending A4: hosts whose terms forbid it move to `READ_LINKONLY`. |

## 5. Owner actions (blockers I cannot clear)

| # | Action | Unblocks |
|---|---|---|
| O1 | Apply for the Find Case Law computational-analysis licence (free) | B10 |
| O2 | Register a Companies House API key (and streaming key) → GitHub repo secret `CH_API_KEY` | B5 |
| O3 | (Optional) FCA Register API key → secret `FCA_API_KEY` | regulatory verification |
| O4 | Approve the routine-prompt change when C1/C2 land (Routines UI) | C1–C2 |

## 6. Hand-offs to the Profiles & Transactions session

| Item | Data side (this plan) | UI side (that session) |
|---|---|---|
| Currency | `aumCcy` / fund `ccy` fields (A5) | Read the field first in `aumCcyOf` / `eur()`; fall back to today's text match |
| Fund terms | B1 fields | Show target IRR, structure, domicile, hard cap, raised in Vehicles expansion |
| Niche filter | `nicheFit` tier (A1) | Optional "Niche" chip on the Managers list |
| Restructurings | — | B8 surface |
