// =============================================================================
// v2/js/peers.js — "Peers" for a profile: the 3–5 most similar entities from the
// SAME roster, ranked by STRATEGY similarity and AUM/SIZE proximity. Pure and
// fully data-driven — a peer is always a real roster entry that links to its own
// profile, so nothing here is fabricated (HOUSE_STYLE R7). Shared by every
// Profiles detail view (managers, hedge funds, investors, law firms); each caller
// maps its own fields into the generic (tags · category · size) shape.
//
// Scoring per candidate e (vs target t), all terms 0..1:
//   • tags   — Jaccard overlap of the strategy/practice-area tag sets (dominant)
//   • cat    — 1 when a single categorical field matches (LP type, HF strategy
//              class, firm tier), else 0
//   • size   — log-distance proximity of AUM / headcount (within ~10× → >0)
// score = tags*0.55 + cat*0.28 + size*0.17. Candidates with real kinship
// (tag overlap OR same category) always rank ahead of pure size-only matches, so
// a niche strategy never gets padded out with unrelated giants.
// =============================================================================

const norm = (s) => String(s == null ? "" : s).toLowerCase().trim();
const SIZE_SPAN = Math.log(10);   // a 10× size gap → proximity 0

// target: the roster entry to find peers for. roster: its full array. cfg:
//   { tags?(e)->string[], cat?(e)->string|null, size?(e)->number|null, n?=5 }
// Returns [{ e, score, shared:[tags], catMatch:0|1 }] best-first, length ≤ n.
export function peersOf(target, roster, cfg) {
  if (!target || !Array.isArray(roster)) return [];
  const n = cfg.n || 5;
  const tTags = new Set((cfg.tags ? cfg.tags(target) : []).map(norm).filter(Boolean));
  const tCat = cfg.cat ? norm(cfg.cat(target)) : "";
  const tSize = cfg.size ? cfg.size(target) : null;
  const scored = [];
  for (const e of roster) {
    if (!e || e.id === target.id) continue;
    const eTagsArr = (cfg.tags ? cfg.tags(e) : []).map(norm).filter(Boolean);
    const eTags = new Set(eTagsArr);
    let inter = 0; for (const x of tTags) if (eTags.has(x)) inter++;
    const uni = new Set([...tTags, ...eTags]).size || 1;
    const jac = inter / uni;
    const catMatch = (tCat && cfg.cat && norm(cfg.cat(e)) === tCat) ? 1 : 0;
    let sizeProx = 0;
    const es = cfg.size ? cfg.size(e) : null;
    if (tSize > 0 && es > 0) sizeProx = Math.max(0, 1 - Math.abs(Math.log(es) - Math.log(tSize)) / SIZE_SPAN);
    const score = jac * 0.55 + catMatch * 0.28 + sizeProx * 0.17;
    if (score <= 0) continue;
    // shared tags kept in the TARGET's original casing for display
    const shared = (cfg.tags ? cfg.tags(target) : []).filter((x) => eTags.has(norm(x)));
    scored.push({ e, score, jac, catMatch, sizeProx, shared });
  }
  scored.sort((a, b) => b.score - a.score
    || (tSize > 0 ? Math.abs((cfg.size(a.e) || 0) - tSize) - Math.abs((cfg.size(b.e) || 0) - tSize) : 0)
    || String(a.e.name).localeCompare(String(b.e.name)));
  // Real kinship (shared strategy/practice OR same category) leads; pure size-only
  // matches only fill the tail if there aren't enough kin peers.
  const kin = scored.filter((s) => s.jac > 0 || s.catMatch);
  const rest = scored.filter((s) => !(s.jac > 0 || s.catMatch));
  return [...kin, ...rest].slice(0, n);
}

// Render peers as a COLLAPSIBLE header dropdown that matches the profile's
// "Sources" line (same .tdet-src-det chrome — a "Peers (n)" summary that expands
// to the list). hrefOf(e) → the peer's profile route (an anchor, so the router's
// a[href^="#/"] handler navigates); subOf(peer) → the muted rationale after the
// name. esc is passed in so this module needs no DOM/util import (or ?v= lockstep).
export function peerDetails(peers, hrefOf, subOf, esc) {
  if (!peers || !peers.length) return "";
  const n = peers.length;
  const body = peers.map((p) => {
    const sub = subOf ? subOf(p) : "";
    return `<a class="tdet-peer" href="${hrefOf(p.e)}">${esc(p.e.name)}</a>`
      + (sub ? `<span class="tdet-peer-sub">${esc(sub)}</span>` : "");
  }).join("");
  return `<details class="tdet-src-det tdet-peers"><summary>Peers${n > 1 ? ` (${n})` : ""}</summary>`
    + `<div class="tdet-src-body tdet-peers-body">${body}</div></details>`;
}
