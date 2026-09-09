# Wire assistant — "Ask Wire" (B) and "Propose an edit" (C)

Two in-app assistant surfaces, both server-side in the Cloudflare Worker
(`src/index.js`) and both **gated by Cloudflare Access** (every request carries a
verified email via `identity()`), **grounded** (answer/draft ONLY from the
provided Wire context or a **cited** web search — never fabricate, HOUSE_STYLE
R7), and **dormant until their secrets are set** (the routes reply
`{unconfigured:true}` until then, so shipping them costs nothing).

**LLM provider (`src/index.js`, `llmAsk`):** prefers **Mistral** when
`MISTRAL_API_KEY` is set — its free/rate-limited tier works, and the **web_search
connector** (Conversations API, `/v1/conversations`) gives live, cited answers;
model `env.MISTRAL_MODEL || "mistral-medium-latest"`. Falls back to the **Anthropic**
Messages API + `web_search` server tool (`claude-opus-5`) when only
`ANTHROPIC_API_KEY` is set. So `hasLLM(env)` = either key present.

## B — Ask Wire (read-only Q&A) — LIVE (dormant until keyed)

- **UI:** the header "Ask Wire" button (`#na-ask`, chat icon) opens a terminal
  Q&A panel (`v2/js/nav-actions.js` → `renderAsk` / `buildAskContext`; styles
  `.na-ask-*` in `premium.css`).
- **Flow:** the client posts `{question, context}` to `/api/ask`, where `context`
  is a compact roster the client builds from the desk data it already loads
  (credit managers, hedge funds, law firms, recent deals). The Worker calls the
  Messages API with a grounding system prompt and the `web_search` server tool,
  and returns `{answer, sources[]}`. Answers render as plain text (escaped) with
  their sourced links.
- **Guards:** POST only; 401 without a verified email; per-user rate limit of 30
  questions/rolling hour (KV key `ask:<email>`); question capped at 2 000 chars,
  context at 60 KB.

**To switch it on:** set ONE provider key as a Worker secret —

```
wrangler secret put MISTRAL_API_KEY     # preferred (free tier + web_search connector)
# or
wrangler secret put ANTHROPIC_API_KEY   # claude-opus-5 fallback
```

(or add it under the Worker's *Settings → Variables and Secrets* in the
Cloudflare dashboard). No redeploy of the app is required; the route reads the
key at request time. Optional `MISTRAL_MODEL` overrides the default
`mistral-medium-latest` (e.g. `mistral-large-latest` for higher quality).

> **Mistral response-shape note:** Mistral's Conversations API returns the
> answer as a tree of typed output chunks whose field names drift between tiers.
> `mistralParseConversation()` therefore reads the answer text from the assistant
> message chunks and harvests **citations by walking the whole response for any
> node carrying an http(s) `url`** (both web-search references and tool-execution
> results do), so it is robust to naming drift. If sources ever come back empty,
> POST `/api/ask` with `{"question":"…","debug":true}` — the response then
> includes `_debug` (the raw `/v1/conversations` JSON) to inspect the shape.

## C — Propose an edit → PR (research + draft a manager) — LIVE (dormant until keyed)

- **UI:** the same Ask Wire panel — type a firm's name and press **Add** (the
  neutral button beside "Ask"). It shows "Researching & drafting…", then the
  opened PR link (or a "couldn't verify that firm" note — it refuses to invent).
- **Flow (`/api/propose`):** Claude (`claude-opus-5`, `web_search`) researches the
  firm and returns a JSON draft (`found`, `name`, `hq`, `founded`, `aum`,
  `aumText`, `strategies`, `description`, `owners`, `sources`, `note`) — every
  field sourced or `null`; `found:false` if it can't verify a real firm. The
  Worker then, via the GitHub **Git Data API** (blob → tree → commit → ref —
  `credit/js/data.js` is ~2.3 MB, over the Contents API's 1 MB read cap, so it is
  read by blob sha and written as a new tree):
  1. inserts the draft at the **top** of the `managers` array in
     `credit/js/data.js` (a stable anchor; next free `m<N>` id; marked
     `_draft:true`),
  2. commits that tree and creates branch `claude/add-<slug>-<ts>` pointing at it
     (the insert precedes the branch, so a parse failure leaves no orphan branch),
  3. opens a **PR against `main` — never committed to `main`, never auto-merged**,
     with the sources and a "verify every field before merging" warning.
- **Guards:** POST + verified email; 5 proposals/rolling hour (`propose:<email>`);
  firm string capped at 300 chars. It never touches live data — only a review PR.

**To switch it on:** set BOTH the API key (above) and a GitHub token with repo
scope —

```
wrangler secret put GITHUB_TOKEN
```

Optional overrides: `GH_OWNER` / `GH_REPO` / `GH_BASE` (default `sk8905` /
`meridian` / `main`).

## Cost & safety notes

- Both endpoints are behind Access, so there is no unauthenticated/public LLM
  endpoint to abuse; the per-user hourly rate limit caps spend further.
- `effort: "low"` on the Q&A keeps latency and cost down; raise it if answers
  need more depth.
- The Worker calls the API with raw `fetch` (no SDK) — the Worker is a single
  hand-written file with no bundler.
