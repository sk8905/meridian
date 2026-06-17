# Scope — automatic content refresh pipeline

Goal: keep the funds / deals / intelligence data current **without a human running
a research pass each time**, while preserving the project's hard rule — *verifiable,
public-source-only, no subscription aggregators, no fabrication, every item carries
a real source URL*. This is the part that makes full automation non-trivial, and it
shapes the recommendation below.

Everything here runs on the stack you already have (Cloudflare Worker + KV + Access);
the only new external dependency is the Anthropic (Claude) API for the research/
extraction step.

---

## 1. How it works (architecture)

```
Cron Trigger (weekly)                         ← Cloudflare scheduled Worker
   │
   ├─ 1. Build queries from the manager list + "since <last run>" window
   │
   ├─ 2. Claude call(s) with the web_search server tool + structured outputs
   │        → returns candidate intel/deal items as JSON matching our schema,
   │          each with the source URL the search tool actually returned
   │
   ├─ 3. Validate + dedupe (same rules as the manual pipeline):
   │        • drop blocked domains (Preqin/PitchBook/Debtwire/With Intelligence/
   │          Crunchbase/Mergr/GuruFocus/CapEdge/Tracxn/Wikipedia/formds…)
   │        • type ∈ enum, managerId exists, money normalised, dates valid
   │        • dedupe by URL + normalised headline vs existing intel AND deals
   │
   ├─ 4. Write survivors to a KV "review queue" (status: pending)
   │
   └─ 5. Notify you (the run summary)

Review UI (new, Access-gated page in the app)
   │  approve / reject each pending item; edit wording if needed
   ▼
KV "published" layer  ──read──▶  App merges baseline data.js + published items
                                 at load; DATA_UPDATED + "latest item" update live
```

Why a **review queue** rather than fully autonomous publishing: the one thing a
human currently does that an LLM can't fully guarantee is the *admissibility/quality*
judgment (is this source allowed? is the figure really disclosed or inferred? is it
genuinely new vs a reword of something we have?). A weekly approve/reject pass takes
a few minutes and keeps the "verifiable only" promise intact. Phase 2 can auto-publish
the high-confidence subset (e.g. items sourced directly from a manager's own press-
release domain) and only queue the rest.

---

## 2. The AI step (Claude)

- **Model:** `claude-opus-4-8` for extraction/judgment (input $5 / output $25 per 1M
  tokens). Optionally a cheap `claude-haiku-4-5` ($1 / $5) triage pass to discard
  irrelevant hits before the Opus pass.
- **Web search:** the server-side `web_search_20260209` tool (with dynamic filtering)
  — Claude runs the searches on Anthropic's side and returns results **with
  citations**, so we only accept items whose URL came back from a real search (a
  strong anti-fabrication control). Billed per search on top of tokens.
- **Structured outputs:** `output_config.format` with a JSON schema mirroring our
  `intel` / `deal` records, so the Worker gets clean, parseable objects.
- **Batches API** (optional): a scheduled refresh isn't latency-sensitive, so running
  the per-manager calls through the Batches API halves token cost.
- Calls are plain HTTPS `fetch` from the Worker (no SDK needed); the API key is a
  Worker **secret**, never in the repo.

---

## 3. Storage & app change

Two options for where new items live:

| | A. Dynamic KV layer (recommended) | B. Commit to Git + redeploy |
|---|---|---|
| Mechanism | Worker writes published items to KV; app fetches `/api/updates` and merges into the in-memory arrays at load | Worker uses the GitHub API to append to the dataset and push to `main`, triggering a Cloudflare redeploy |
| App change | Small: add a fetch+merge on load (like the watchlist sync already does) | None to the app; but programmatic editing of `data.js` is fragile |
| Freshness | Live — no deploy needed | Each update = a deploy |
| Fit | Matches the Worker+KV you already run | Heavier, more failure modes |

Recommended: **A**. The app already does a KV round-trip for the watchlist; this is
the same pattern for a "published updates" namespace. `DATA_UPDATED` and the
header's "latest item" date then advance automatically as items publish.

---

## 4. Cost (single user, weekly cadence)

All Cloudflare pieces are within the **free tier** (Cron Triggers, Workers, KV).
The only real cost is the Anthropic API:

- Rough order: a weekly run doing a few dozen search-backed Claude calls lands in the
  **low single-digit dollars per run** (≈ **$5–20/month**), depending on how many
  managers/themes you sweep and search depth. Batches + a Haiku triage pass push the
  bottom of that range down.
- Web-search tool fees are charged per search separately from tokens — the main lever
  for cost is **how many searches per run** (cap it).
- You'd add a small prepaid balance / spend cap on the Anthropic account so it can
  never run away.

---

## 5. Phasing

- **Phase 1 (MVP):** Cron Worker → Claude+web-search → validate/dedupe → KV review
  queue → Access-gated review page → publish-on-approve → app merges published items.
  Manual cadence button too ("run refresh now").
- **Phase 2:** auto-publish the high-confidence subset (manager-owned-domain sources);
  queue the rest. Add email/notification of the run summary.
- **Phase 3:** widen scope — deals backfill, performance/IRR updates, more source
  domains; add a "sources health" check.

---

## 6. Risks / honest caveats

- **Quality is the hard part, not the plumbing.** The verifiable-only discipline is
  enforced by: search-tool citations (URL must be real), the domain bl/allow-lists,
  schema validation, dedupe, and — in Phase 1 — your approval. Removing the human
  entirely (Phase 2+) trades a little rigor for convenience; that's your call per
  category.
- **Cost control** is a spend cap + a per-run search budget.
- **Secrets:** Anthropic API key as a Worker secret; the review UI is already behind
  Cloudflare Access (owner-only).
- **Scope creep:** start with intel (news) only; deals/IRR later.

---

## 7. What I'd need from you to build it

1. Go-ahead on **Phase 1** (review-queue model) vs wanting fully autonomous from day 1.
2. An **Anthropic API account** + key (you create it; I never put it in the repo —
   it goes in as a Worker secret), and a spend cap you're comfortable with.
3. Cadence (weekly is the sensible default) and rough **per-run search budget**.
4. Confirmation to add the small **app merge step** (Option A) and a new Access-gated
   **review page**.

Estimated build: Phase 1 is a focused piece of work — a scheduled Worker, the Claude
call with schema + web search, the validation/dedupe (reusing the logic already
written for the manual merges), a KV review namespace, and a simple review page.
