# Legal data module — English-law legal & case-law alerts

This directory holds the **legal content domain** for Wire: English-law legal
updates and case-law / restructuring alerts across these practice areas:

- **Banking & Finance**
- **Restructuring & Insolvency (R&I)**
- **Corporate / M&A**
- **Funds Regulatory**
- **Fund Tax**

Each alert is curated from the public **insights / know-how / legal-update**
pages of **UK Magic Circle**, **UK Silver Circle** and the **London offices of
US-elite firms**.

> ℹ️ The old standalone `/legal/` page (a separate pre-v2 prototype) is
> **retired behind an edge redirect** — it is no longer a user-facing surface.
> What lives on is **`legal/js/data.js`**, the data module the single v2 SPA
> reads to render legal updates in the unified News feed and on the relevant
> profiles. The alerts summarise **genuine** English-law developments; every
> record carries a real **source URL and date** (verify against the cited source
> — this is not legal advice).

## The data

Everything is in **`legal/js/data.js`** — plain ES-module exports:

```
legal/js/data.js   # items (legal updates), restructurings, firms, areas, case notes
```

- `items` — legal updates / client alerts, each tagged to an `area` and `firm`.
- `restructurings` — restructuring plans, schemes and RPs.
- `firms` / `areas` — the id tables `items` point at.
- case-note commentary keyed by id.

The module is imported by a stable **tokenless** URL and revalidated `no-cache`,
so the ~2-hourly content refresh edits only this file. There are **no `?v=`
cache tokens** — code is content-hashed by Vite, data is tokenless (see the repo
root `CLAUDE.md` and `docs/HOUSE_STYLE.md` T1/T2).

## Curate the feed

Add objects to `items` (or `restructurings`) in `legal/js/data.js`:

1. Give each a unique `id`.
2. Keep `area` / `firm` / `type` pointing at ids defined at the top of the file.
3. Every item needs a real, verified `url` **and** a precise `date` — never
   fabricate; leave unknown fields blank.
4. Bump `LAST_REVIEWED`.
5. Run `node tests/run.mjs` before pushing (a push to `main` deploys live).

See [`../docs/refresh-routines.md`](../docs/refresh-routines.md) for the full
content-refresh invariants (sourcing, ES-module validation, publishing).
