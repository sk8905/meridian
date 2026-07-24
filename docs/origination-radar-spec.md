# Origination Radar — build spec (on paper, pre-code)

Purpose: turn Wire into an origination engine for a **finance partner returning to
private practice**, targeting **mid-market opportunistic / structured / solutions
credit funds** as *accounts* (not deals), to be serviced across the whole firm
platform — fund finance, secondaries, structured lending, senior/mezz, restructuring.

Design constraints already agreed:
- **Derive, don't duplicate.** The radar is a new lens over data Wire already holds
  and already refreshes; only two small things are new (additive profile fields +
  a private overlay).
- **Contained tab.** New lazy view + scoped CSS; existing surfaces get only additive,
  render-if-present profile sections.
- **Private overlay lives apart.** Warm nodes / firm coverage / tiers / notes go in a
  per-user, Access-gated KV store (the watchlist/bookmarks mechanism) — never in the
  committed data files, never co-mingled with anything privileged. Conflicts-clean.
- **65/35.** Relationships get the meeting; expertise wins the work. Reflected not as a
  weighted score but by showing *both* sides on every row — your warm/firm-coverage flags
  (access) alongside the incumbent/white-space picture (winnability) — for you to judge.

---

## Part A — Target universe (a filter, not a score)

A manager/fund is IN the radar universe when all hold:

- **Strategy ∈ SOLUTIONS_SET** = { opportunistic, special situations, structured credit,
  capital solutions, hybrid/pref, mezzanine/junior, NAV/fund-finance-led, asset-based }.
  Exclude vanilla senior direct lending unless it carries a flexible sleeve.
- **Mid-market scale**: total AUM in **$1–10bn** (the existing focus band) **OR** a
  `flexibleArm: true` override (a solutions sleeve inside a bigger house).
- **Region ∈ Europe** (Credit desk scope), tagged UK / Continental.

Yields the ~40–60 account list — the spine of everything.

---

## Part B — No algorithmic score (by request)

There is **no computed ranking score**. A senior practitioner ranks by judgment, not a
black box. The radar is a **filterable, sortable workspace** over the target universe: the
signals below are surfaced as **facts and flags** on each row (not folded into a number),
and *you* apply tiers and priority yourself.

Signals surfaced per fund (all **derived from existing data**, so they refresh for free):

| Signal | Source (already in Wire) | Shown as |
|---|---|---|
| Wallet / product lines | manager SLS chips (NAV/CONT/SEC/STRIP/CFO/SRT), deal types, fundraising, Stress/Schemes on portfolio | a row of wallet chips (which of your 5 lines are active) |
| Activity | `deals` + `intel` + `webNews` (transactions), last 12m | a count / "active" marker |
| Scale | manager `aumTotal` | AUM band label (mid-market highlighted) |
| Incumbents | new `advisers` field (Part F) + Legal-desk firm PC deals | per-line incumbent chips + a "white space" flag where none |
| Triggers | fundraising status change, first product-chip appearance, Stress board, launches, personnel | a dated "why now" chip (most recent) |
| Your flags | **private overlay (Part G)** | your tier · warm-node · firm-coverage · next action |

Sort and filter, don't score: filters for product line · AUM band · warm-only · has-trigger ·
white-space-only · tier; sortable columns (name, AUM, activity, last trigger date). Your
manual **tier (A/B/C)** and **pin** are the only ranking — set by you, per fund.

---

## Part D — Tab & UI

Contained view, built from existing lego (league-table renderer, feed engine, tui terminal
CSS, chips, KV-sync). Four panes behind chips:

1. **Radar** (default) — the target universe as a sortable, filterable table (no score).
   Columns: your tier · fund/manager · strategy · AUM band · wallet chips · incumbent
   status (+ white-space flag) · most-recent trigger · your warm flag. Sort by any column;
   filter by product line · AUM band · warm-only · has-trigger · white-space-only · tier.
   You set the tiers.
2. **Account card** — the enriched profile (Parts E/F) + a BD panel: wallet decomposition
   across the five lines · incumbents per line · trigger timeline · your private notes.
3. **Pipeline** — your tiered targets with notes / next-action / due (private).
4. **Market read** (optional) — the "insight gift" feed, your niche only; doubles as
   thought-leadership fuel.

Placement: the freed 5th bottom-nav slot (Newsletters already moved to the Home banner).

---

## Part E — Profile field: `book` (Book & business)

Additive, manager-level, all optional, render-if-present, each value sourced (unknown = null).
Serves Goal 1 (understand the business) AND feeds the account card.

```js
book: {
  strategyDetail: "Opportunistic capital solutions; pref + structured junior; sponsor & non-sponsor",
  instruments: ["Unitranche", "2nd lien", "PIK/pref", "NAV facilities", "Structured/ABL", "CLO equity"],
  checkSize: { min: 25, max: 150, unit: "€m" },
  sectors: ["Business services", "Healthcare", "Software"],
  originationMix: "≈60% sponsor / 40% non-sponsor",   // optional
  lpBase: ["European pensions", "Insurers", "Asian SWF"],  // or derive from commitments
  aumTrajectory: [{ asOf: "2024-12", aum: 3.2 }, { asOf: "2025-12", aum: 4.1 }],
  note: "Short positioning prose — how they make money, where they sit vs peers.",
  sources: ["https://…"],
}
```
(Fund vintages and listed vehicles are already derivable from `funds` / `VEHICLES`.)

---

## Part F — Profile field: `advisers` (the BD edge)

Structures the existing free-text counsel into a per-product-line adviser graph. Powers
Contestability and the account card's "who advises them now, where's the gap".

```js
advisers: [
  { firm: "kirkland",      role: "Fund formation", scope: "panel",  lastSeen: "2025-06", confidence: "verified", source: "https://…" },
  { firm: "cliffordchance", role: "Fund finance",   scope: "matter", lastSeen: "2026-02", confidence: "inferred", source: "https://…" },
]
```
- `role` ∈ { Fund formation, Fund finance, Financing/deals, Restructuring, Regulatory, Tax }
- `scope` ∈ { panel, matter, mentioned } · `confidence` ∈ { verified, inferred }
- `firm` = a Legal-desk firm id where possible (links to the firm profile), else a free name.
- **Auto-derived edges**: Legal-desk `firm.pcDeals` that name the manager fold in as
  `confidence:"inferred", scope:"mentioned"`, merged with curated entries.

---

## Part G — Private overlay (per-user KV — NOT in data.js)

New endpoint `/api/origination` (mirrors `/api/watchlist`). Access-gated, per verified email,
never committed, never co-mingled with shared/privileged data.

```js
{
  strengths: ["Fund finance", "Structured"],   // optional — used only to highlight fit, not to score
  targets: {
    "<managerId>": {
      tier: "A" | "B" | "C" | null,            // your manual ranking — the only ranking
      pin: false,
      relationship: "none" | "warm-path" | "named-contact" | "strong",
      firmCoverage: "none" | "dormant" | "active",
      notes: "…",
      nextAction: "…",
      nextActionDue: "2026-08-01",
    }
  }
}
```

---

## Part H — Sourcing (no fabrication)

The Credit refresh brief gets a small extension: when re-verifying a manager, capture
`book` detail and `advisers` edges **from public sources only** (firm deal press releases,
manager press, public league-table/deal mentions), each with a real source URL; unknown
fields stay `null`; inferred adviser edges are marked. The routine **never** touches the
private overlay.

---

## Open inputs (from you, when ready — nothing is blocked without them)

1. **Your product-line strengths** (optional) — only used to *highlight* fit on a row; no score.
2. **Cross-sell vs conquest lean** — you said "not sure yet". With no scoring, this needs no
   decision now: the incumbent/white-space and warm/firm-coverage flags are shown side by
   side and you weigh them yourself.
