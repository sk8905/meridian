// Niche-fit guard (pure logic). The owner's universe is European credit managers of
// ≤$15bn AUM running 15%+ strategies (docs/product-review-brief.md §1); backfill and
// coverage worklists must sweep that niche FIRST (scripts/lib/niche.mjs).
import { managers, funds } from "../credit/js/data.js";
import { nicheIndex, nicheFit } from "../scripts/lib/niche.mjs";
import { worklist, loadChecklist } from "../scripts/backfill-progress.mjs";
import { check, finish } from "./lib.mjs";

const idx = nicheIndex(managers, funds);
const tierOf = (re) => { const m = managers.find((x) => re.test(x.name)); return m ? idx.get(m.id).tier : "missing"; };

for (const re of [/^Attestor/, /^Kartesia/, /^Blantyre/, /^Cheyne/])
  check(tierOf(re) === "core", `niche: ${re.source.slice(1)} is core (got ${tierOf(re)})`);
check(tierOf(/^Apollo/) !== "core", "niche: a >$15bn mega-manager (Apollo) is not core");
check(tierOf(/^Situational Awareness/) === "off", "niche: an equity hedge fund is off-niche (kept, ranked last)");
check(managers.filter((m) => /\bbank\b|barclays|wells fargo/i.test(m.name)).every((m) => idx.get(m.id).tier !== "core"), "niche: bank lending desks are never core");
check(nicheFit({ name: "X", hq: "London, UK", aum: null, strategies: ["Distressed & Special Situations"] }).tier === "adjacent", "niche: unknown AUM is adjacent, never silently core");
check(idx.size === managers.length, "niche: every manager is scored");

const wl = worklist(loadChecklist(), 6).filter((w) => w.action !== "fill");
check(wl.length > 0 && idx.get(wl[0].id)?.tier === "core", `backfill: the first BUILD/ADD target is core-niche (got ${wl[0]?.name})`);
finish();
