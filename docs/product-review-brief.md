# Wire — Holistic Product & Data Review Brief

> Handover for a fresh Claude Code session. **Review and recommendation only — change
> no code or data.** Read this brief in full, then `CLAUDE.md`, `docs/HOUSE_STYLE.md`
> and `docs/refresh-routines.md`. (A separate session is reviewing the UX of Profiles and
> Transactions — see `docs/ux-review-brief.md`; don't duplicate that click-path work.)

---

## 1. The owner and the goal

The owner is a **finance lawyer** focused on **European credit funds** — in particular
managers of **up to ~US$15bn AUM** running strategies that **target 15%+ IRR**
(opportunistic credit, special situations, distressed, junior/mezzanine, asset-based
and hybrid capital, NPL/portfolio, rescue and structured solutions — *not* primarily
senior direct lending, though that is context).

They do **not** have Bloomberg, With Intelligence, Preqin, PitchBook, Octus (Reorg),
9fin, Debtwire, Creditflux or Private Debt Investor. **Wire is their own terminal and
database, built entirely from free, publicly available sources.** The question for this
review: *how close is Wire to replacing the parts of those tools that matter to this
user, and what should be built next to close the gap?*

Think about what a finance lawyer in this niche actually needs day to day, e.g.:
- **Market map:** who the managers are, their size, strategies, funds, vintages,
  target sizes / hard caps / closes, domiciles (Lux / Ireland / UK / Cayman), structures
  (ELTIF, RAIF, SCSp, ICAV, evergreen / semi-liquid), target returns.
- **Fundraising pulse:** who is in market, first/final closes, LP demand, who is backing
  whom (pensions, insurers, sovereigns — e.g. UK LGPS pools, Dutch/Nordic pensions).
- **Deal flow:** financings, rescue/special-sits deals, NAV and fund-finance facilities,
  portfolio sales, CLO/ABS issuance — and **which law firms advised**.
- **Distress & restructuring:** UK Part 26/26A plans and schemes, insolvencies, court
  judgments, sponsor/lender disputes, LME transactions.
- **Regulation & law:** AIFMD II (loan-origination rules), ELTIF 2.0, FCA/ESMA/CSSF/CBI
  rule changes, tax, case law affecting fund and finance documents.
- **People:** senior hires/departures at managers and law firms (deal-team moves).
- **Macro/rates context:** base rates, spreads, defaults — G7 + Western Europe.
- **Business development is out of scope by design** (HOUSE_STYLE R19: monitoring only,
  no CRM). Do not recommend BD/outreach tooling.

---

## 2. What Wire is today (verify all of it — don't trust this summary)

**App:** Cloudflare Worker (`src/index.js`) + a Vite-built SPA under `/v2/`. iPhone PWA
is the primary surface; desktop is a fixed terminal. Sections: **Home** (briefing,
markets, newswire with lanes All · Research · Managers · Watchlist · Newsletters, reading
pane), **News**, **Dashboard** (macro, credit, legal, hedge-fund panels), **Profiles**
(managers, hedge funds, investors, law firms), **Transactions** (Primary, Secondaries,
European credits, BDCs), **Menu** (watchlist, what's new, coverage, settings).

**Data (static ES-module files, ~2.6 MB credit + ~2.4 MB legal):**
| Dataset | Size today | Notes |
|---|---|---|
| Credit managers | 219 | only **120 carry an AUM**; **46** sit in the $1–15bn band. Strategy tags: senior DL 96, CLO 63, opportunistic 61, distressed/special sits 52, ABL 50, RE debt 46, mezz 21 … |
| Funds | 357 | fields: strategy, vintage, targetSize, hardCap, raised, status, domicile, geo/sector focus — **no structured target-return field** (≈21 mention IRR in text) |
| Deals / intel | ~957 / ~985 | each tagged to a manager (+ fund), dated and sourced |
| Hedge funds | 151 | news for ~half; 13F holdings and Form ADV regulatory AUM from SEC |
| Investors (LPs) | 23 | thin |
| Law firms | 26 | ~1,600 alerts/insights, cases 222, restructurings 80 |
| EU leveraged-loan credits / BDCs | 118 / 31 | Transactions ▸ Credits / BDCs |

**Collection (all free sources):**
- ~2-hourly AI refresh routines (Claude Code scheduled triggers) do verified
  web-search sourcing, an email sweep (research, newsletters, myFT), and a heavy sweep.
- A **deterministic candidate collector** (`scripts/collect-candidates.mjs`): Google News
  RSS for every tracked entity, plus the **public headlines** of paywalled specialists
  (PDI, Creditflux, 9fin, Debtwire, Octus, FT, Bloomberg, Law360, GRR, IPE) as
  verify-then-record leads.
- **GitHub Actions collectors** (open internet): law firms' own websites
  (`collect-firm-news.mjs`, daily history back to 2020), SEC 13F + Form ADV
  (`collect-sec.mjs`, `collect-adv.mjs`), source trials (`source-trial.mjs`).
- A **2020 backfill** project (`backfill/checklist.json`), a **nightly accuracy
  verifier**, a **profile rota** for slow-changing data, a daily **health email**.
- Integrity guards: `tests/data-integrity.mjs` (no duplicates, real dates/URLs, banned
  outlets), freshness audit, ~100 specs. **Never fabricate** is the cardinal rule.

**Known weaknesses (from a 13 Oct 2026 audit and since):** ~17% defect rate in a 48-record
sample (being measured nightly); many approximate legal dates; thin hedge-fund and LP
coverage; AUM missing for 99 managers; the history checklist covers 8 of 82 priority
entities so far; data held in large static JS files.

---

## 3. What to assess

### A. Fit to the owner's niche
- Does the roster actually cover **European credit managers ≤$15bn targeting 15%+**? Who
  is missing (name them, with evidence)? Is the **$1–15bn auto-coverage band** right?
- Can the user **filter/sort** by AUM band, strategy, target return, domicile, fund
  status, vintage? What fields are missing to make that possible?
- Are fund **terms** captured (target/hard cap/closes/target IRR/structure/domicile)?

### B. What's good (keep and build on)
Be specific: which sections, datasets, pipelines or design choices genuinely work.

### C. What could be better
Accuracy, completeness, freshness, depth (history to 2020), entity linking, how
information is organised and surfaced, noise vs signal on the wire, mobile experience
of *content* (not click paths — the UX session covers those).

### D. What's missing — a capability-gap matrix vs the paid tools
For each paid product the owner lacks, list the capabilities that matter to this user,
whether Wire has them (✅ / ⚠️ partial / ❌), and the **best free route** to close each gap:

| Paid tool | Capabilities to map (examples) |
|---|---|
| Bloomberg Terminal | news, prices/rates/spreads, company and fund data, alerts |
| With Intelligence / Preqin | fund database, fundraising timeline, LP commitments, manager profiles, performance |
| PitchBook | deals, funds, LPs, service providers (law firms) |
| Octus / 9fin / Debtwire | leveraged finance & distressed news, restructuring tracking, documentation intel, CLO data |
| Creditflux / PDI | private credit & CLO news, fund closes, league tables |

### E. Free public sources to exploit (research these properly)
Evaluate each for value, coverage, access method (API / RSS / bulk file / HTML), update
cadence, **terms of use / licensing / robots** (the owner is a lawyer — be precise), and
effort. Start with, and go beyond:
- **Regulatory registers:** FCA Register; ESMA registers (AIFMs, ELTIFs, MMFs, CRAs);
  CSSF (Lux) and Central Bank of Ireland fund registers; AMF; BaFin; SEC EDGAR (Form D,
  ADV — many European managers file), IAPD.
- **Corporate filings:** UK Companies House API (accounts, PSCs, **charges register /
  MR01** — reveals secured financings and lenders), Luxembourg RCS / RBE, Irish CRO,
  OpenCorporates, GLEIF LEI data (entity hierarchies).
- **Listings & debt documents:** Euronext Dublin / LuxSE (CLO and bond prospectuses),
  ESMA FIRDS, ECB data portal, BoE/ECB statistics, EBA risk dashboards.
- **LP disclosures:** UK LGPS pension committee papers and pool reports, Dutch/Nordic/
  Canadian/US public pension board minutes and annual reports (private-debt
  commitments), sovereign wealth fund reports.
- **Listed managers' reports:** ICG, Ares, Partners Group, Tikehau, Eurazeo, Bridgepoint,
  Antin, Brookfield etc. (AUM, fundraising, fund-level disclosures).
- **Courts & insolvency:** BAILII, National Archives Find Case Law, UK Gazette insolvency
  notices, EU court databases, US PACER/RECAP (CourtListener) for cross-border cases.
- **Law & regulation:** EUR-Lex, legislation.gov.uk, FCA/ESMA/EBA consultations and
  Q&As, ECB supervisory publications.
- **Market data:** ECB/BoE/Fed/FRED/Eurostat series, central-bank yield curves,
  publicly available index levels.
- **Rating agencies' free press releases** (Moody's, S&P, Fitch, Scope, KBRA, DBRS).
- **Industry bodies:** AIMA/ACC, ELFA, LMA (public items), Invest Europe, BVCA, PCA.
- **League tables / directories:** Legal 500 and Chambers rankings (free), Bloomberg/
  Refinitiv public league-table press releases.

### F. Data architecture
- Are large static JS data files the right store as this grows to a real database?
  Assess options (Cloudflare D1/KV/R2, a SQLite build artefact, search indexes),
  entity resolution / IDs, schema for funds/terms/LPs/advisers/deals, provenance
  (source + date per field), history/versioning.
- Is the collection approach (AI routines + deterministic collectors) the right split?
  What should be deterministic code, what needs judgement, how to raise accuracy?

### G. Risks and constraints
- Terms of service, copyright and database rights (EU database directive), scraping
  etiquette, personal data (GDPR — people moves), no paywall circumvention.
- Cost: the owner has a Claude subscription (usage capacity, not per-token cost);
  GitHub Actions free tier; Cloudflare plan limits (e.g. Worker subrequests).

---

## 4. How to work
- `npm ci`; read the docs above; read the data modules and scripts directly (you can
  import them in Node to compute statistics). Run `node scripts/freshness-audit.mjs`,
  `node scripts/health-check.mjs`, `node scripts/manager-coverage.mjs --all`,
  `node scripts/backfill-progress.mjs`.
- To see the app, serve it locally via `tests/lib.mjs` (`serve()` + Playwright; Chromium
  is pre-installed). The live site is behind Cloudflare Access.
- Use WebSearch to verify sources and to test coverage (e.g. pick 15 European credit
  managers ≤$15bn with 15%+ targets from public sources and check each against Wire).
  Note: many sites are blocked from this container's network; GitHub Actions has open
  internet if a check needs it (propose it rather than build it).
- Be evidence-led: numbers, named examples, links. No fabrication.

---

## 5. Deliverables (review and recommendation only)
1. **Executive summary** (one page): verdict on how far Wire is from "my own terminal",
   the top 5 strengths, top 5 gaps, top 5 recommendations.
2. **Good / Could be better / Missing** — tables by area, each item with evidence.
3. **Capability-gap matrix** vs Bloomberg, With Intelligence/Preqin, PitchBook,
   Octus/9fin/Debtwire, Creditflux/PDI (§3D).
4. **Free-source catalogue** — source · what it gives · access method · cadence ·
   terms/licence notes · value to this user (H/M/L) · effort (S/M/L).
5. **Roster gap list** — named European credit managers in the owner's niche that Wire
   lacks or covers thinly, with evidence.
6. **Data-architecture recommendation** (§3F) with a migration sketch.
7. **Prioritised roadmap** — quick wins (days), medium (weeks), large (months), each
   with the user value, dependency and how success is measured.
8. **Risks & mitigations** (§3G).

The owner prefers **tables, concise prose and links to sources**. Present a plain-English
summary first, detail after. **Do not change code, data, routines or settings.**
