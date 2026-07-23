# Wire (meridian) — working agreement

"Wire" is a static multi-page ES-module web app (Cloudflare Worker `src/index.js`
+ Cloudflare Assets; git-connected `main` auto-deploys). The **v2 SPA under
`/v2/`** is the only live surface — pre-v2 top-level pages are retired behind edge
redirects. iPhone PWA is the primary surface; desktop is a fixed-viewport
terminal.

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
- **Test before deploy.** Run the full suite `node tests/run.mjs` (17 specs,
  ~4 min — exceeds the 120s foreground limit, so run it in the background and
  poll). It must stay green. Any new user-visible behaviour gets a spec.
- **Cache tokens move in lockstep.** Bump the `?v=` token on any changed CSS/JS.
  v2 modules load via the runtime token in `v2/index.html`; the shared
  `credit/js/data.js?v=` token must stay identical across
  `v2/js/credit/app.js`, `v2/js/credit/detail.js` and `credit/js/shared.js`
  (same for legal). See HOUSE_STYLE T1 and the refresh-routines "Cache-busters".
- **Deploy discipline.** Develop on the designated dev branch, then integrate to
  `main` by rebasing onto the latest `origin/main` and fast-forwarding (never
  stack on already-merged history). Pushing to `main` triggers the live deploy.
  Do not open a pull request unless explicitly asked.
- **Single source of truth.** One feed engine (`feed.js` → `.g-feed-row`), one
  shared chrome, one router. When a surface is ported to v2, edit the **v2 copy**
  under `v2/js/` — the retired top-level orchestrators are not loaded.

## Daily maintenance

A scheduled routine reads `docs/HOUSE_STYLE.md` as its checklist and runs a
consistency + coding-bug pass each morning (fix-and-report). Keep the doc current
— it is what that routine (and every session) enforces.
