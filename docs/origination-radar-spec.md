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
- **65/35.** Relationships get the meeting; expertise wins the work. The 65/35 is
  encoded *inside* winnability (Access 0.65 / Conversion 0.35).

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

## Part B — Scoring formula

Each signal normalises to [0,1] unless noted. All weights are tunable in the UI;
defaults below.

### Prize P — "how much work is here?"
```
P = 0.45·Wallet + 0.30·Velocity + 0.25·ScaleFit
```
- **Wallet** = (# active product lines) / 5 — breadth of cross-sell.
- **Velocity** = min(1, log1p(events_12m) / log1p(24)) — deal/raise cadence (≈24 = saturated).
- **ScaleFit** = triangular peak in the mid-market: 1.0 at $2–6bn, ~0.4 at $1bn and $10bn,
  →0.2 above $20bn. (You *want* mid-market, not mega.)

### Winnability W — "can I win it?" (the 65/35)
```
W = 0.65·Access + 0.35·Conversion
Conversion = 0.60·Contestability + 0.40·PracticeFit
```
- **Access** (private overlay) = max(relationship, firmCoverage):
  - relationship: none 0 · warm-path 0.5 · named-contact 0.7 · strong 1.0
  - firmCoverage: not-a-client 0 · dormant 0.5 · active-client 0.9
- **Contestability** (from Advisers, per targeted line): white-space 1.0 · single
  mismatched incumbent (e.g. magic-circle on a €2bn fund) 0.7 · entrenched rival 0.3 ·
  your own firm already primary → *excluded* (that's cross-sell — routes into firmCoverage).
- **PracticeFit** = weighted overlap of the fund's active product lines ∩ your declared strengths.

### Base score
```
S0 = 100 · (0.40·P + 0.60·W)          # winnability-tilted; tunable
```

### Timing T — "why now?" (a multiplier, kept visible)
```
T = 1 + Σ( boost · decay · relevance ), capped at +0.60
```
- **boost**: Final Close .50 · New-product first appearance .50 · Portfolio name on Stress
  board .40 · Launch/First Close .35 · Senior personnel move .20
- **decay** = exp(−ageDays / 45) — a 6-week-old trigger has largely faded.
- **relevance** = 1 if the trigger's product line ∈ your strengths, else 0.5.

### Final
```
Score = round( S0 · T )               # 0–~160; flag "hot" when T ≥ 1.25
Tiers: A ≥ 110 · B 80–109 · C < 80    # plus a manual pin override
```

Everything except Access, PracticeFit and the strengths list is **derived from existing
data** and refreshes for free. Only the private inputs are yours.

---

## Part C — Signal → source → computation

| Signal | Source (already in Wire) | Computation |
|---|---|---|
| Wallet / product lines | manager SLS chips (NAV/CONT/SEC/STRIP/CFO/SRT), deal types, fundraising, Stress/Schemes on portfolio | line "active" if the matching chip/deal/stress edge exists in last ~18m |
| Velocity | `deals` + `intel` + `webNews` (transactions) | count last 12m, log-scaled |
| ScaleFit | manager `aumTotal` | triangular mid-market curve |
| Contestability | new `advisers` field (Part F) + Legal-desk firm PC deals | per-line incumbent state |
| Triggers | fundraising status change, first product-chip appearance, Stress board, launches, personnel | event within decay window |
| Access / PracticeFit / strengths | **private overlay (Part G)** | user-set |

---

## Part D — Tab & UI

Contained view, built from existing lego (league-table renderer, feed engine, tui terminal
CSS, chips, KV-sync). Four panes behind chips:

1. **Radar** (default) — target funds ranked by Score desc. Columns: Score · fund/manager ·
   strategy · AUM band · wallet chips · incumbent status · dominant trigger · your tier/warm
   flag. Filters: product line · AUM band · warm-only · has-trigger · contestable-only.
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
  strengths: [ { line: "Fund finance", weight: 1 }, { line: "Structured", weight: 0.8 } ],
  targets: {
    "<managerId>": {
      tier: "A" | "B" | "C" | null,
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

## Open inputs (from you, when ready — defaults hold until then)

1. **Your product-line strengths** (weights) — drives PracticeFit + trigger relevance.
2. **Cross-sell vs conquest lean** — if you're joining a platform that already acts for many
   targets, tilt weights toward Access/firmCoverage; if cold, toward Contestability. You said
   "not sure yet", so the defaults above stay balanced and this is a one-line tune later.
