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
| myFT | `FT` | `#e0708e` (rose; light theme `#990f3d` FT claret) | `--t-ft` |

**Semantic:** up `#3fc08d` · down `#f26d84` · flat `--faint` · unread-badge `#ef4444`.

Rule: the desk chip on ANY row (feed, saved, notifications) uses the desk colour
above and the short code (MAC/CRD/LEX/LETTER/FT). No other desk-colour set is valid
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

Each entry: what differs, where, verdict, action. **RECONCILE** = fix to match
canon. **INTENTIONAL** = correct to differ. **DECIDE** = needs a product call
before it can be resolved.

### A. Link destinations (behavioural — highest priority)

| # | Item | Divergence | Verdict | Action |
|---|---|---|---|---|
| L1 | **Legal cases** | Home feed/Saved/Notif/Search (`glance.js:551,144,1374,1512`) + shared Saved (`saved.js:65`) + dashboard mini-list (`legal/js/app.js:531`) route to the **retired `#/cases?case=`** (dead — dumps on dashboard, no source). Newer modules (`saved.js:99`, `palette.js:65`, legal dashboard `:506,1222`) correctly open the judgment `c.url`. | **RECONCILE (broken)** | Point all stale surfaces to `c.url` (source, new tab). |
| L2 | **Legal schemes/RPs** | Same split: `glance.js:552,145,1375,1513` + `saved.js:66` + `legal/js/app.js:530` route to **retired `#/restructurings?m=`** (dead). Correct elsewhere: table-jump on the legal dashboard, else `judgmentUrl||articleUrl`. | **RECONCILE (broken)** | Off-dashboard surfaces → `judgmentUrl||articleUrl` (source); on the legal dashboard keep the table-jump. |
| L3 | **Credit deals / intel** | Two live behaviours: Home + shared → **focus the dashboard row** (`#/deals?focus=`); Credit app + palette → **source article, else manager page**. The Credit app comments treat `#/deals` as retired. | **DECIDE** | Pick one rule (see Question 2) and align all six surfaces. |
| L4 | **Credit research/commentary** | Home Notif (`glance.js:1367`) sends it in-app to `/credit/#/news`; every other surface opens the publisher `r.url`. | **RECONCILE** | Change to `r.url`, new tab. |
| L5 | Legal alerts (items) | Source-first with a **live** `#/item/` fallback for url-less items; some interpose `firm.insightsUrl`. | **INTENTIONAL** (fallback is benign) | Optional: unify the fallback (small). |
| L6 | Macro news/articles/commentary, newsletters, manager web-news, CLOs, macro guidance | Consistent across all surfaces. | **INTENTIONAL / OK** | none |

### B. Colour / tokens (mostly dead-code dedup — values are mostly right)

| # | Item | Divergence | Verdict | Action |
|---|---|---|---|---|
| C1 | `.na-tag` desk colours | `#6f5cc6/#2f6df0/#2c9a86` ≠ canonical `.nf-code` (`--t-mac/crd/lex`). **Now dead code** (Saved/Notif use `.nf-row`/`.nf-code`). | **RECONCILE** | Delete dead `.na-tag`/`.na-item`/`.na-itxt` CSS. |
| C2 | `premium.css` dark tokens | `--surface #141414`, `--ink #e9eef7`, `--muted #8b97ad` contradict the winning `tui.css` `#0d0d0d`/`#eaf0fb`/`#8592ad`. Overridden (dead) but misleading. | **RECONCILE** | Align premium.css to tui values or delete the dupes. |
| C3 | `.tw-tag.comm` | Defined twice in tui.css (`#6ea8dc` then `#9b83e2`); first is dead. | **RECONCILE** | Remove the dead first declaration. |
| C4 | Home-light up/down | Two emerald/red pairs on one theme: `#059669/#dc2626` vs `#0a7d3c/#c02626`. | **RECONCILE** | Consolidate to one pair (tokenise `--t-up/down`). |
| C5 | Unread badge red | `.notif-badge`/`.na-badge` `#ef4444` vs Home `.g-badge` `#e34948`. | **RECONCILE** | One red (`#ef4444`). |
| C6 | Legacy `.notif-tag` navy set | `#2b4a7c/#4a6b93/#1c3a5e` — unrelated to any desk palette; superseded by `.nf-code`. | **RECONCILE** | Delete (rows now use `.nf-row`). |
| C7 | Stale comments | App `:root` + premium.css comments say accent is "Glance blue"; value is orange `#fb8b1e`. | **RECONCILE** | Fix comments. |
| C8 | Accent orange, border, head, `.nf-code↔--t-*`, up/down dark-brighten | Consistent. | **INTENTIONAL / good** | none |

### C. Typography / row height

| # | Item | Divergence | Verdict | Action |
|---|---|---|---|---|
| T1 | List-row height | `.nf-row` `12px 14px` vs terminal wire `.tw-row`/`.tui .g-feed-row` `5px 12px` (~2.4× taller). | **DECIDE** | Row density for Saved/Notif (Question 1). |
| T2 | Wire headline size | `.nf-title` 15px vs `.tw-head`/`.tui .g-feed-title` 13px. | **RECONCILE** (follows T1) | Align to the chosen size. |
| T3 | Desk-code chip size | `.nf-code` 10px vs `.g-feed-code` 9px vs `.tw-tag` 8px. | **RECONCILE** | One size (≈10px); bump `.tw-tag` up. |
| T4 | Data-table density | `.tleague td` `5px 8px` vs `.lg-sc-tbl td` `8px` (desktop drifted; mobile already 8px). | **RECONCILE** | One padding for both. |
| T5 | Legacy sub-app `.notif` rows | weight 600 but no font-size → undefined sizing. Superseded by `.nf-row`. | **RECONCILE (low)** | Remove dead rules. |
| T6 | Headline-sans + meta/code-mono; Home light feed 600 vs terminal 400; market rows fully mono | Consistent / by design. | **INTENTIONAL** | none |

### Decisions (signed off)
- **Q1 — row density → COMPACT** (match the wire): `.nf-row` now 13px headline / `9px 14px`.
- **Q2 — credit deal click → SOURCE first, else manager page** (CLOs keep the CLOs tab).

### Resolution status (this pass)
**Fixed & deployed:**
- L1, L2 — legal cases → judgment `c.url`; schemes → `judgmentUrl||articleUrl` (else dashboard). Fixed in glance.js (feed/Saved/Notif/search + tui-li), saved.js `resolveSaved`, and the legal dashboard mini-lists. Verified 0 retired routes remain.
- L3 — credit deals/intel now source-first everywhere (`creditItemHref` in glance.js + saved.js; palette.js order flipped).
- L4 — credit research in Home Notifications → publisher `r.url`.
- T1, T2 — `.nf-row` compact (13px / 9×14).
- C1 — dead `.na-item`/`.na-tag`/`.na-itxt` CSS deleted.
- C2 — `premium.css` dark `--surface/--ink/--muted` aligned to the canonical tui values.
- C3 — dead `.tw-tag.comm #6ea8dc` removed.
- C5 — unread badge unified to `#ef4444` (Home `.g-badge` was `#e34948`).
- T3 (part) — `.tw-tag` bumped 8px → 9px (legibility).

**Also fixed (final cleanup pass):**
- C4 — Home-light green/red consolidated to `#059669` / `#dc2626` (dropped the `#0a7d3c` / `#c02626` pair).
- C6 — legacy `.notif-tag` navy set deleted from premium.css.
- C7 — "Glance blue" accent comments corrected to Wire orange (app styles + premium.css).
- T3 — desk-code chip unified to 9.5px (`.nf-code`, `.tui .g-feed-code`, `.tw-tag`).
- T4 — both data tables now `6px 8px` cells (`.tleague`, `.lg-sc-tbl`).
- T5 — dead legacy sub-app `.notif-link/.notif-meta/.notif-item.is-new` rules removed.

**Ledger clear** — all audited divergences are either RECONCILEd or recorded as INTENTIONAL. New work conforms to §0–§7 above; the twice-daily refresh routine's typography QC step (`docs/refresh-routines.md`) guards against future drift.
