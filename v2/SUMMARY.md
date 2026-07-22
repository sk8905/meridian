# Wire v2 rebuild — status for review

**TL;DR** — The app is rebuilt as a true single-page app at **`/v2/`**. All five
tabs (Home, Macro, Credit, Legal, Menu) are ported with their real content and
switch **instantly** with no blank pages. Your current app is **completely
untouched** and still live at `/`, `/macro/`, etc. — nothing was deleted or
overwritten. When you're happy, flipping the root to v2 is a small, reversible
change.

Test it at **`https://<your-domain>/v2/`**.

---

## What the rebuild fixes

The old app was five separate documents, each re-loading a large JS bundle (and,
for Credit, a **1.36 MB** dataset) on every tab change — that was the lag and the
long blank pages. v2 replaces that with:

- **One document, one runtime**, loaded once. No per-tab document, no bundle
  re-fetch, no re-parse on switch.
- **A real client-side router** with same-document view transitions (the kind
  iOS actually supports) — so no inter-document white blank, ever.
- **Shared chrome built once** (header, ticker, briefing, bottom tab bar, search
  palette, pull-to-refresh) — it never re-renders; only the active marker moves.
- **Keep-alive views** — the first visit to a tab loads it; every visit after is
  an instant display toggle (state and scroll preserved).
- **Lazy, cached data** — Credit's 1.36 MB and Legal's 859 KB datasets load only
  when their tab is first opened, then stay in memory. Revisits are instant.

Measured in the test harness: 10 tab switches leave exactly one header, one tab
bar, one of each view (no leaks), one view visible, correct active marker, back
button working, **zero console errors**.

---

## How it's built (and how to change content later)

```
v2/
  index.html            the single shell (loads one runtime)
  css/app.css           base token palette + SPA layout
  js/
    runtime.js          router · keep-alive lifecycle · data cache · transitions
    chrome.js           header + bottom tab bar + ticker/briefing/palette/PTR
    views/<tab>.js       thin wrapper: which module mounts + which CSS to load
    macro/ credit/ legal/ home/   the ported render code for each desk
```

**A view is just a module** exposing `mount(host, ctx)` that returns
`{ enter, leave }`. That's the whole contract. Because of it:

- **Tweak a desk's content/layout** → edit that desk's code under
  `v2/js/<desk>/`. The data itself (`data.js`, `content.js`) is imported from the
  existing tree unmodified, so editing the data updates both apps — single source
  of truth, no drift.
- **Add a whole new tab/section** → add a `views/<name>.js`, one line in
  `runtime.js` (`ROUTES`), and one entry in `chrome.js` (`TABS`). Nothing else in
  the architecture has to change — that was the goal.

The ports keep each desk's **hash sub-routing unchanged**, so every deep link
still works (`/v2/credit/#/manager/x`, `/v2/legal/#/item/x`, `/v2/macro/#/policy`,
…) and renders correctly on a cold load.

---

## Parity — what's identical

- Home (markets, briefing, live feed, watchlist, predict), Macro (dashboard,
  commentary, policy, cycle, bubble, chart, saved), Credit (funds/managers/LPs/
  CLOs + details), Legal (list/firm/item + details) — all rendered by the **same
  code**, so the visuals match.
- Header ticker + briefing strip, the ⌘K / "/" search palette, pull-to-refresh,
  signed-in identity, per-desk deep links, back/forward, theme (in Menu).

## Outstanding items (honest list — none block testing the navigation)

1. **Header notification bell + "last refresh" show the last-opened desk**, not
   the active tab. Each ported desk fills the shared `#notif` / `#data-status`
   once when it mounts; they aren't refreshed on tab re-entry. No errors, just
   possibly-stale content in those two header spots. Fix: refresh them on
   `enter()` (small).
2. **Push-notification subscribe** — the Menu shows/requests OS permission but
   doesn't complete the server web-push subscription yet.
3. **Header Markets / Saved dropdown panels** (the nav-actions pop-overs) aren't
   wired in the v2 shell. Home keeps its own markets rails; the desks show their
   status line. The palette search + bottom tab bar cover the main paths.
4. **Home signed-out/preview splash** isn't replicated — v2 assumes Cloudflare
   Access has signed you in (it gates the whole site), so it renders Glance
   directly.
5. **Desktop polish** — the account block relocation to the right rail and a
   desktop header theme button aren't ported (the phone/PWA surface — the primary
   one — has theme in Menu).
6. **Pull-to-refresh** is wired via the shared module but its freeze/gap
   mechanics want an **on-device iOS check** to confirm it feels right in the SPA.

## Recommended next steps

1. Test `/v2/` on your phone — confirm the switching finally feels right.
2. If yes, I'll close items 1–3 (the ones with real user impact), then we do the
   **root flip** (serve v2 at `/`, keep the old files for rollback).
3. Items 4–6 are polish we can schedule after the flip.

## Safety / rollback

Everything is at `/v2/`. The current app's files were never edited. If v2 is
wrong, do nothing — you keep using the current app. The Worker only adds a
`/v2/*` route; all existing routing is unchanged.
