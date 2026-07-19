# Headless regression suite

Playwright-driven checks for the behaviours that have actually broken before:
page boot, the shared chrome, swipe/sticky interplay, chip-selection lifecycle,
the notifications bell scope, and the pinned source-filter bars.

```
node tests/run.mjs            # everything
node tests/run.mjs swipe nav  # a subset (prefix match)
```

Requirements: a host Playwright install (default path
`/opt/node22/lib/node_modules/playwright/index.js`, override with
`WIRE_PW=/path/to/playwright/index.js`) and a Chromium it can resolve
(`PLAYWRIGHT_BROWSERS_PATH` is honoured). No npm install in this repo — the
suite, like the app, is zero-build.

Specs serve the repo root on a local port with `/api/*` stubbed in the server
(`lib.mjs`) — NOT via Playwright routes, which disable the HTTP cache and break
service-worker code paths. Touch input goes through CDP
`Input.dispatchTouchEvent` because Playwright's `tap()` does not drive the
swipe-gesture code.

**Run this after any change to** nav-actions.js, swipetabs.js, ptr.js,
glance.js, saved.js, util.js, the app.js files, or the sticky/chrome CSS.
Add a spec (or extend one) when fixing a new class of bug — the suite is the
record of what must keep working.
