# Wire (meridian) — working agreement

"Wire" is a multi-page ES-module web app (Cloudflare Worker `src/index.js` +
Cloudflare Assets; git-connected `main` auto-deploys). The **v2 SPA under `/v2/`**
is the only live surface — pre-v2 top-level pages are retired behind edge
redirects. iPhone PWA is the primary surface; desktop is a fixed-viewport
terminal.

The v2 SPA is **built by Vite** (`npm run build` → `dist/`). `npm run build` is three
steps: `node scripts/gen-home-data.mjs` (regenerates the tokenless `home-data.js` slice
the News ▸ Profiles lane reads) → `vite build` (bundles + content-hashes the JS and the eleven
`@import`ed stylesheets) → `node scripts/postbuild.mjs` (copies everything else the
Worker serves — data modules, shared root modules, the retired top-level pages,
static files — into `dist/` as-is). `wrangler.jsonc` serves assets from `dist`, and
Cloudflare Workers Builds runs `npm run build` on each deploy — that build setting is the
switch that turns the Vite pipeline on.

## Read these first — they are authoritative

- **`docs/HOUSE_STYLE.md`** — the agreed rulebook for layout, feed/day-break
  conventions, colour tokens, typography, chrome, behaviour, and engineering
  discipline (rules **R1–R51, T1–T22**), plus **§8 the canonical data-resource
  roster**. Every change must conform. When something here and there conflict,
  HOUSE_STYLE wins.
- **`docs/refresh-routines.md`** — invariants for the ~2-hourly content refresh
  (Credit/Legal/Macro + briefing + research/newsletters/myFT email sweep), including
  sourcing, ES-module validation, and publishing.

## Non-negotiables

- **Never fabricate data.** Every feed/commentary/data item keeps a real,
  verified source URL and date; unknown fields are `null`. Verify via WebSearch
  (works regardless of network policy) — WebFetch may be egress-blocked.
- **Test before deploy.** Run the full suite `node tests/run.mjs` (the
  runner is a bounded parallel pool — ~2.5 min, still may exceed the 120s foreground
  limit, so run it in the background and poll; `TEST_CONCURRENCY=N` overrides).
  It must stay green. Iterate on the affected spec alone (`node tests/run.mjs
  <name>`, seconds) and run the full suite once before the push. Any new
  user-visible behaviour gets a spec. To prove the built output serves identically,
  `npm run build` then `TEST_ROOT=dist node tests/run.mjs`.
- **Cache-busting: code is hashed, data is tokenless.** The v2 SPA's JS/CSS is
  content-hashed by Vite (the `/assets/*-[hash]` filename is the buster) — never
  hand-add a `?v=` token to a module import under `v2/js` (enforced by
  `tests/token-lockstep.mjs`). The data modules (`credit/js/data.js`, …) are
  imported by a stable tokenless URL and revalidated `no-cache` via `_headers`, so
  the ~2-hourly refresh routine edits only those data files. There are **no `?v=`
  cache tokens anywhere** — not on code (Vite hashes it) and not on data (no-cache);
  never add one, and ignore any older doc/routine step that says to "bump a token".
  See HOUSE_STYLE T1/T2.
- **Deploy discipline.** Commit directly to `main` and push to `origin/main` —
  see **Branch & deploy policy** below. Pushing to `main` triggers the live
  deploy, so verify before every push.
- **Native feel.** Nothing moves under the reader: no surprise reloads (only
  `v2/js/update.js` may reload, off screen), live repaints hold position, hover is
  fenced to mouse devices, `dvh`/`svh` not bare `vh`, skeletons not spinners —
  HOUSE_STYLE **R46–R49**. Native shell (Capacitor) is a recorded decision, not
  adopted — **T22**.
- **Single source of truth.** One feed engine (`feed.js` → `.g-feed-row`), one
  shared chrome, one router. When a surface is ported to v2, edit the **v2 copy**
  under `v2/js/` — the retired top-level orchestrators are not loaded.

## Branch & deploy policy

- **Publish to `main`.** The deploy is a push to `origin/main`. In an interactive
  session, commit directly to `main` and push. The scheduled routines instead work on
  a short-lived `claude/…` branch and publish by **rebasing onto the latest
  `origin/main` and pushing to `main`** (`git fetch origin main` → `git rebase
  origin/main` → `git push origin HEAD:main`, retrying on a non-fast-forward) — this is
  the only safe way for several writers to land on a moving `main`, and it matches
  HOUSE_STYLE **T6**. Either path is fine; what's forbidden is a **long-lived feature
  branch or a pull request** unless I explicitly ask. An ephemeral working branch that
  is immediately rebased and pushed to `main` is not a "feature branch".
- Always verify changes (build/tests or a quick sanity check) before pushing, since a
  push to `main` deploys immediately. CI is **advisory, not a gate**: a GitHub Action
  (`.github/workflows/tests.yml`) runs `npm run build` + the full suite (source and
  built `dist/`) on every push to `main` and goes red on the commit when something
  breaks — but it **cannot block** the Cloudflare git-connected deploy, which ships
  regardless. So the suite is still yours to run **before** you push; the Action is the
  safety net that makes a bad push visible, not a reason to skip local testing.
- **Commit trailers:** end commit messages with the `Claude-Session:` link and a
  co-author line that carries **no model identifier** (HOUSE_STYLE **T8**) — use
  `Co-Authored-By: Claude Code <noreply@anthropic.com>`, never a `claude-<model>`
  / `Opus`/`Sonnet`/etc. string. Keep model identifiers out of every committed artifact.

## Daily maintenance

A scheduled routine reads `docs/HOUSE_STYLE.md` as its checklist and runs a
consistency + coding-bug pass each morning (fix-and-report). Keep the doc current
— it is what that routine (and every session) enforces.
