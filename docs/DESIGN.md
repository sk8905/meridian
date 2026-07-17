# Wire — design system & consistency spec

The single source of truth for how the app looks and behaves. Any new UI must
conform to this; any deviation must be listed in the **Divergence ledger** at the
end and marked INTENTIONAL (approved) or RECONCILE (to fix). "Conform" means *use
the tokens and the shared components below — never a hardcoded value that
duplicates one.*

Status: **draft for review.** Values below are the intended canon; the ledger is
populated from the consistency audit and needs sign-off.

---

## 0. Two surfaces (an intentional split)

| Surface | Pages | Character |
|---|---|---|
| **Home / Glance** | `/` | Landing chrome — larger type, card surfaces, the command bar. Uses the `--t-*` token set. |
| **Terminal apps** | `/macro/ /credit/ /legal/` | Dense Bloomberg-style terminal. Uses the `tui.css` `--*` token set + `premium.css`. |

These two are *allowed* to differ in chrome (nav bar, hero, card vs flat rows).
They must NOT differ in the **shared primitives**: desk colours, up/down colours,
the feed-row component, and link-destination rules. Those are identical everywhere.

---

## 1. Colour tokens

Always reference a token; never hardcode a hex that a token already names.

**Terminal apps (`tui.css`, dark):**
`--bg #000` · `--surface #0d0d0d` · `--border #262626` · `--head #0a0a0a` ·
`--ink #eaf0fb` · `--muted #8592ad` · `--faint #5c6a86` · `--accent / --primary #fb8b1e`

**Desk palette (canonical — same on every surface):**

| Desk | Code | Colour | Token |
|---|---|---|---|
| Macro | `MAC` | `#9b83e2` (purple) | `--t-mac` |
| Credit | `CRD` | `#fb8b1e` (orange) | `--t-crd` (== accent) |
| Legal | `LEX` | `#2fbf8a` (green) | `--t-lex` |
| Newsletter | `LETTER` | `#d9a441` (amber) | `--t-amber` |

**Semantic:** up `#3fc08d` · down `#f26d84` · flat `--faint` · unread-badge `#ef4444`.

Rule: the desk chip on ANY row (feed, saved, notifications) uses the desk colour
above and the short code (MAC/CRD/LEX/LETTER). No other desk-colour set is valid
(e.g. the old `.na-tag` blue/teal set is deprecated — RECONCILE).

---

## 2. Typography

- **Mono** (`--t-mono`) for all data: numbers, tickers, dates, source names, the
  desk code chip, table cells, market rows, section sub-labels.
- **Sans** (system stack) for headlines and prose.
- Headlines in list rows are **weight 400** (not bold) — see the feed-row spec.
- Type scale (rows): headline `15px` / meta `12px` / desk code `10px` /
  section header `12px`. Home landing may scale up; terminal stays at these.

---

## 3. The feed-row component (`.nf-row`) — the canonical list row

Used by Saved, Notifications, and anything that lists dated items. Structure:

```
headline (sans, 15px, weight 400, --ink)               ← .nf-title
[CODE] date · source   (mono, 12px, --muted)           ← .nf-meta > .nf-code + .nf-time + .nf-src
```

- Vertical padding `12px 14px`; 1px `--border` divider between rows; hover `--head`.
- The desk code chip is `.nf-code` in the desk colour (§1).
- Meta separator is a mid-dot `·`.

The Home news wire (`.g-feed-row` / `.tui .g-feed-*`) and the app dashboard wire
(`.tw-row`) are the same idea in their own class names; they must match this
row's type scale and row height. Where they don't → ledger.

Market rows (`.na-mrow`) are the exception: they mirror the desktop left rail
(mono label · value · change; Top movers as centre-anchored bars) — that's a
different, intentional component.

---

## 4. Link-destination rules (behavioural canon)

The click target of a **headline** must be identical across every surface it
appears (Home feed, app feed, Notifications, Saved, search/palette):

| Content type | Headline goes to |
|---|---|
| Macro news / articles / commentary | **Source URL**, new tab |
| Newsletters | **Source URL** ("read online"), new tab |
| Credit deals / intel (fundraising) / CLOs | In-app focus route (`/credit/#/…?focus=`) |
| Credit manager web-news | In-app **manager page** |
| Legal alerts (items) | **Source URL** (firm article), new tab — NOT `#/item/` |
| Legal cases | **Source judgment URL**, new tab |
| Legal schemes / RPs | **Jump to the Schemes & RPs table row** (`data-goscheme`) |

Retired detail pages (`#/item`, `#/cases`, `#/restructurings`, standalone
Deals/Fundraising) still exist as dormant code but must never be a click target.
Any surface still linking to one → RECONCILE.

Secondary controls keep their own behaviour: a source-name chip filters by that
source; an entity chip opens the manager page.

---

## 5. Interaction — the command bar (Markets · Saved · Notifications)

- One shared cluster on every page; three square outline buttons (`.na-btn`),
  Home mirrors it (`.g-*`). Bell is the **outline** icon everywhere.
- A **single controller** owns all three: opening one closes the others; tapping
  an open button closes it; tapping another **switches**. No `✕` close button —
  close by re-tapping, tapping another, tapping outside, or Escape.
- On phones each opens **full-screen** below the top bar as `.nf-row` feed pages;
  on desktop they're compact dropdowns. The scrim starts **below** the top bar so
  the buttons are never covered.
- **Markets** & **Saved** are identical on every page (Saved = cross-desk).
  **Notifications** is cross-desk too, tagged by each item's own desk.

---

## 6. Tables

- Column widths fixed (`table-layout: fixed`) with explicit per-column widths.
- Headers sticky within their scroll context.
- On phones: don't squeeze many columns into the viewport — give the table a
  `min-width` and let its wrapper scroll horizontally (see `.lg-sc-tbl`).
- The dashboard chip bar, any search/toggle sub-header, and the table header all
  stay locked while rows scroll (stacked sticky offsets).

---

## 7. Cache-busting discipline

- Entry HTML (`/`, `/*/index.html`) is served `no-cache` (see `_headers`) so a new
  deploy's bumped tokens are always picked up.
- Every referenced JS/CSS carries a `?v=YYYYMMDD-N` token; **bump it whenever the
  file changes**. Shared data modules imported by non-bumping consumers are also
  `no-cache` in `_headers`.
- Inline `<style>`/`<script>` in the no-cache HTML needs no token.

---

## Divergence ledger

Populated from the consistency audit (colour, typography/row-height, link
destinations). Each entry: what differs, where, and INTENTIONAL vs RECONCILE.

_(pending — audit in progress; entries and sign-off to follow.)_
