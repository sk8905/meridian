# Wire assistant — "Ask Wire" (B) and "Propose an edit" (C)

Two in-app assistant surfaces, both server-side in the Cloudflare Worker
(`src/index.js`) and both **gated by Cloudflare Access** (every request carries a
verified email via `identity()`), **grounded** (answer/draft ONLY from the
provided Wire context or a **cited** web search — never fabricate, HOUSE_STYLE
R7), and **dormant until their secrets are set** (the routes reply
`{unconfigured:true}` until then, so shipping them costs nothing). Model:
`claude-opus-5`.

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

**To switch it on:** set the API key as a Worker secret —

```
wrangler secret put ANTHROPIC_API_KEY
```

(or add it under the Worker's *Settings → Variables and Secrets* in the
Cloudflare dashboard). No redeploy of the app is required; the route reads
`env.ANTHROPIC_API_KEY` at request time.

## C — Propose an edit → PR (research + draft a manager) — planned

- **UI:** an "add X" box → `/api/propose`.
- **Flow:** Claude researches the entity with `web_search`, drafts a `managers`
  entry matching the `credit/js/data.js` schema (every field sourced or `null`),
  then opens a **GitHub PR against a `claude/…` branch — never `main`, never
  auto-merged** — for human review.
- **Extra secret:** a GitHub token with repo scope, in addition to the API key —

```
wrangler secret put GITHUB_TOKEN
```

C never writes to the live data directly; it only opens a PR you review and
merge, which keeps the never-fabricate + cache-token + test discipline intact.

## Cost & safety notes

- Both endpoints are behind Access, so there is no unauthenticated/public LLM
  endpoint to abuse; the per-user hourly rate limit caps spend further.
- `effort: "low"` on the Q&A keeps latency and cost down; raise it if answers
  need more depth.
- The Worker calls the API with raw `fetch` (no SDK) — the Worker is a single
  hand-written file with no bundler.
