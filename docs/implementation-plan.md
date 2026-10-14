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
| A4 | **Terms audit of every wired source** (feeds, reader, APIs, X, proxies) → fixes | 🟡 reader + firm collector fixed; market-data / X items await owner decision (§4) | Every host has a verdict in §4 |
| A5 | **Currency as data**: manager/investor AUM restated to USD with `aumFrom` provenance (done by the UX session, R29); funds carry `ccy` set only where the fund's own sourced text states it (no FX); otherwise absent | ✅ | 0 money figures without a currency OR an explicit `null`; UI follow-up in §6 |
| A6 | **AUM reconciliation**: stale `aumTotal` vs `aum`/`aumText` (e.g. Arini 11 vs ~$18bn, Cheyne 12 vs $15bn) | ⬜ | List = profile = source text |
| A7 | **Controlled vocabularies**: fund `status` (4 values + `evergreen` flag), `strategy` (STRATEGIES), `domicile` (country) + new `structure` field; integrity ratchets | ✅ | Enum spec green; free-text variants → 0 |
| A8 | **Roster gaps**: added LCM Partners, Avenue Capital (Europe), Alchemy, Ironshield, Veld Capital (AnaCap's credit arm since Oct 2022 — AnaCap itself is now PE); funds: LCM COPS 4/5, Avenue Europe V/VI, Alchemy SOF V, Ironshield ICOF, Cross Ocean ESS V, Taconic/Dolomite ECDF III/IV, Arrow ACO III, Chorus V, Alcentra special sits III, SVP V/VI. Corrected i841 (SVP V close) and removed i842 (a 2021 article mis-dated 2026). Not added: Cross Ocean ESS IV (no published size/close) | ✅ | 15-name niche test set: 14/15 (AnaCap → Veld) |
| A9 | Off-niche names are **kept** (owner-added, R4c rule 4) but ranked last by A1 — never deleted | ✅ | — |

## 2. Phase B — medium (weeks)

| # | Item | Status | Depends on | Success measure |
|---|---|---|---|---|
| B1 | **Fund-terms schema**: `targetIRR {low, high, basis, ccy}`, `structure`, `closes[]` (first / interim / final with date + amount), `evergreen` | ⬜ | A5, A7 | Funds with a sourced target return: 10 → 60+ |
| B2 | **Deal ↔ adviser**: parse the law-firm "advises" alerts (already collected, 1,595 items) into `deals[].advisers[{firmId, role, side, sourceUrl}]` | ⬜ | — | % of deals with ≥1 adviser |
| B3 | **GLEIF LEI enrichment** (CC0) as a GitHub Action — managers/funds/SPVs get `lei` + parent chain | 🟡 collector shipped (`collect-gleif.yml` → `backfill/gleif.json`, candidates only); applying confirmed LEIs next | — | Managers with an LEI |
| B4 | **The Gazette corporate notices** (OGL; 24xx corporate codes only, person fields dropped, Crawl-delay 10s) for restructuring companies + UK obligors | 🟡 collector shipped (`collect-gazette.yml` daily → `backfill/gazette.json`, candidates only); routine applies | — | Notices/week matched to a tracked entity |
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
| **In-app reader / proxies** (Jina, Firecrawl) | Several publishers' ToU bar automated retrieval/storage | link-only vs on-demand-only vs allowlist | **Owner decision (2026-10-14): personal, non-commercial use — every non-paywalled newswire source reads in-pane** (proxy + pre-warm for all; SCMP via `READ_OPEN`). Hard paywalls stay link-only; subscriber content comes via newsletters (R38). The earlier link-only/on-demand restrictions were reverted. |
| **Law-firm sites** (`collect-firm-news.mjs`) | Read robots.txt only for sitemaps | — | ✅ Shipped: Disallow/Allow + Crawl-delay honoured, ≥1s per host, honest UA. |
| **X** — free syndication fallback; Google News re-roll variant | X ToS / Google per-query blocks | remove vs keep | **Owner decision (2026-10-14): restored** (personal use) — the X wire keeps its free fallback and stuck Google queries retry a variant. |
| **X** — twitterapi.io / TwitterAPIs.com (paid resellers) | Wire is a customer, but the resellers' collection is not authorised by X | (a) keep; (b) official X API (pay-per-use); (c) drop the X lane | ⛔ **Owner decision.** Recommendation: (b) the official X API for the ~10-account list, if the cost is acceptable; otherwise (c). |
| **Yahoo Finance** (quotes, 5y/intraday chart series, news search, crumb handshake) | Yahoo ToS §2(d)(9) bars automated access "for any purpose"; robots.txt `Disallow: /` on query1/query2 | (a) FRED API (keyed; daily S&P 500, Nasdaq, Brent, gold, BTC, yields — some series third-party © for personal use only) + ECB/BoE for FX/rates; (b) a keyed vendor whose free tier licenses personal use (e.g. Twelve Data, Finnhub, Alpha Vantage — terms to confirm) for intraday + single stocks/BDC prices; (c) drop intraday | ⛔ **Owner decision.** Recommendation: **(a) + (b)** behind one provider interface — daily series from FRED/ECB, intraday and equities from one keyed vendor on a personal licence. Yahoo stays until you choose (switching it off now would blank the markets band, hero chart, briefing pills and BDC price/NAV). |
| **Stooq** (IGWD/EMEE CSV) | robots.txt `Disallow: /` | issuer NAV pages / the vendor above | ⛔ Replace with the vendor in the Yahoo decision. |
| **FRED `fredgraph.csv` fallback** + spoofed browser UA in `fetchHeaders` | FRED FAQ: no scraping; API terms govern keyed use | API only, honest UA | ⬜ Next: API-only, honest UA (needs `FRED_API_KEY` bound — check). |
| **CNBC `restQuote`** (UK gilt yields) | Unpublished internal endpoint | Bank of England yield data (OGL) | ⬜ Next: replace with BoE. |
| **Bing News RSS mirror** | Terms unconfirmed | drop | ⬜ Next: drop unless confirmed. |

## 5. Owner actions (blockers I cannot clear)

| # | Action | Unblocks |
|---|---|---|
| O1 | Apply for the Find Case Law computational-analysis licence (free) | B10 |
| O2 | Register a Companies House API key (and streaming key) → GitHub repo secret `CH_API_KEY` | B5 |
| O3 | (Optional) FCA Register API key → secret `FCA_API_KEY` | regulatory verification |
| O4 | Approve the routine-prompt change when C1/C2 land (Routines UI) | C1–C2 |
| O5 | Confirm the Worker secret `FRED_API_KEY` is bound (free key at fred.stlouisfed.org) — then the `fredgraph.csv` fallback and the spoofed browser headers can be removed | §4 FRED row |
| O6 | Decide the **market-data** replacement for Yahoo/Stooq/CNBC-restQuote and the **X** route (§4) | §4 |
| O7 | Cloudflare Access: add a **Bypass** policy for the single path `/api/nl-ingest` (secret-guarded, write-only) so the routine can store newsletter bodies; and forward/subscribe your Bloomberg, WSJ, Economist and Reuters newsletters to the ingestion mailbox | R38 newsletters in-pane |

### Draft — Find Case Law computational-analysis licence (O1)

> To: caselawlicence@nationalarchives.gov.uk — Subject: Application for a computational
> analysis licence (Find Case Law)
>
> I am a finance lawyer applying for a licence to carry out computational analysis of
> Find Case Law records for a private, non-commercial monitoring tool used only by me.
> **Purpose:** to be alerted to new judgments in the Business and Property Courts
> (Insolvency and Companies List, Commercial Court, Financial List) and the appellate
> courts that concern restructuring plans and schemes (Part 26/26A CA 2006), insolvency,
> fund and finance documents. **Processing:** a scheduled query of the Find Case Law
> Atom feeds/API (a few requests per day, within published rate limits) for new
> judgments matching those courts/terms; for each, storing the neutral citation, court,
> date, parties, a link to the record and a short summary of the issues decided. No
> bulk download of the corpus; no re-publication of judgment text; no training of AI
> models; no profiling of individuals (names of individuals are not extracted or
> indexed beyond the case title). **Safeguards:** access restricted to me (Cloudflare
> Access); records deleted on request; Five Safes / MoJ principles applied. I am happy
> to provide further detail.

## 6. Hand-offs to the Profiles & Transactions session

| Item | Data side (this plan) | UI side (that session) |
|---|---|---|
| Currency | `aumCcy` / fund `ccy` fields (A5) | Read the field first in `aumCcyOf` / `eur()`; fall back to today's text match |
| Fund terms | B1 fields | Show target IRR, structure, domicile, hard cap, raised in Vehicles expansion |
| Niche filter | `nicheFit` tier (A1) | Optional "Niche" chip on the Managers list |
| Restructurings | — | B8 surface |
