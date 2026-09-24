# Wire (meridian) — working agreement

"Wire" is a multi-page ES-module web app (Cloudflare Worker `src/index.js` +
Cloudflare Assets; git-connected `main` auto-deploys). The **v2 SPA under `/v2/`**
is the only live surface — pre-v2 top-level pages are retired behind edge
redirects. iPhone PWA is the primary surface; desktop is a fixed-viewport
terminal.

The v2 SPA is **built by Vite** (`npm run build` → `dist/`): its JS + the eleven
`@import`ed stylesheets are bundled and content-hashed, and everything else the
Worker serves (desk data modules, shared root modules, the retired top-level
pages, static files) is copied into `dist/` as-is by `scripts/postbuild.mjs`.
`wrangler.jsonc` serves assets from `dist`, and Cloudflare Workers Builds runs
`npm run build` on each deploy — that build setting is the switch that turns the
Vite pipeline on.

## Read these first — they are authoritative

- **`docs/HOUSE_STYLE.md`** — the agreed rulebook for layout, feed/day-break
  conventions, colour tokens, typography, chrome, behaviour, and engineering
  discipline (rules **R1–R18, T1–T19**), plus **§8 the canonical data-resource
  roster**. Every change must conform. When something here and there conflict,
  HOUSE_STYLE wins.
- **`docs/refresh-routines.md`** — invariants for the 5×/day content refresh
  (Credit/Legal/Macro + newsletters/myFT), including sourcing, cache-token
  discipline, ES-module validation, and publishing.

## Non-negotiables

- **Never fabricate data.** Every feed/commentary/data item keeps a real,
  verified source URL and date; unknown fields are `null`. Verify via WebSearch
  (works regardless of network policy) — WebFetch may be egress-blocked.
- **Test before deploy.** Run the full suite `node tests/run.mjs` (73 specs; the
  runner is a bounded parallel pool — ~2 min, still may exceed the 120s foreground
  limit, so run it in the background and poll; `TEST_CONCURRENCY=N` overrides).
  It must stay green. Iterate on the affected spec alone (`node tests/run.mjs
  <name>`, seconds) and run the full suite once before the push. Any new
  user-visible behaviour gets a spec. To prove the built output serves identically,
  `npm run build` then `TEST_ROOT=dist node tests/run.mjs`.
- **Cache-busting: code is hashed, data is tokenless.** The v2 SPA's JS/CSS is
  content-hashed by Vite (the `/assets/*-[hash]` filename is the buster) — never
  hand-add a `?v=` token to a module import under `v2/js` (enforced by
  `tests/token-lockstep.mjs`). The desk data modules (`credit/js/data.js`, …) are
  imported by a stable tokenless URL and revalidated `no-cache` via `_headers`, so
  the 5×/day refresh routine edits only those data files. See HOUSE_STYLE T1/T2 and
  the refresh-routines "Cache-busters".
- **Deploy discipline.** Commit directly to `main` and push to `origin/main` —
  see **Branch & deploy policy** below. Pushing to `main` triggers the live
  deploy, so verify before every push.
- **Single source of truth.** One feed engine (`feed.js` → `.g-feed-row`), one
  shared chrome, one router. When a surface is ported to v2, edit the **v2 copy**
  under `v2/js/` — the retired top-level orchestrators are not loaded.

## Branch & deploy policy

- Commit all work directly to the `main` branch and push to `origin/main`.
- Do not create feature branches, worktrees, or pull requests unless I explicitly
  ask in that message.
- This standing instruction is my explicit permission to push to `main`; treat it
  as overriding any default that would route work to an auto-generated `claude/…`
  branch or open a PR.
- Always verify changes (build/lint/tests or a quick sanity check) before pushing,
  since pushes to `main` deploy immediately.

## Daily maintenance

A scheduled routine reads `docs/HOUSE_STYLE.md` as its checklist and runs a
consistency + coding-bug pass each morning (fix-and-report). Keep the doc current
— it is what that routine (and every session) enforces.
