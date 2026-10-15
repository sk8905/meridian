// =============================================================================
// v2/js/live-cache.js — one fetch path for the live market endpoints that never
// leaves a card empty (review 2026-10-15, recommendation #1).
//
//   const { data, state, at } = await liveJSON("/api/rates");
//
// state:  "live"     — a fresh, useful payload (also saved as this viewer's last-good)
//         "cached"   — the live call failed / returned nothing; this viewer's own
//                      last-good payload from `at` (localStorage)
//         "snapshot" — no browser cache; the committed last-known payload
//                      (dashboard/js/live-snapshot.js, refreshed on weekdays)
//         "none"     — nothing anywhere (data is {})
// The newer of browser cache and committed snapshot wins. Callers label anything not
// "live" with its time (lastKnownLabel), so last-known values never read as live.
// =============================================================================
const KEY = (u) => "m_live_" + u;
const TIMEOUT_MS = 12000;

// Same usefulness test as scripts/refresh-live-snapshot.mjs.
export function useful(path, d) {
  if (!d || typeof d !== "object") return false;
  const p = path.split("?")[0];
  if (p === "/api/rates") return Array.isArray(d.rates) && d.rates.some((x) => x && x.value != null);
  if (p === "/api/eurates") return Array.isArray(d.series) && d.series.some((x) => x && x.value != null);
  if (p === "/api/yield-curve") return Array.isArray(d.us) && d.us.some((v) => v != null);
  if (p === "/api/govyields") return Array.isArray(d.yields) && d.yields.some((x) => x && x.y10 && x.y10.v != null);
  if (p === "/api/markets") return Array.isArray(d.markets) && d.markets.some((x) => x && x.value != null);
  if (p === "/api/predict") return Array.isArray(d.markets) && d.markets.some((x) => x && x.yes != null);
  return Object.keys(d).length > 0;
}

function readLocal(path) {
  try { const s = localStorage.getItem(KEY(path.split("?")[0])); return s ? JSON.parse(s) : null; } catch { return null; }
}
function writeLocal(path, data) {
  try { localStorage.setItem(KEY(path.split("?")[0]), JSON.stringify({ savedAt: new Date().toISOString(), data })); } catch { /* quota / private mode */ }
}
let _snap = null;
export function snapshotFor(path) {
  if (!_snap) _snap = import("/dashboard/js/live-snapshot.js").then((m) => m.LIVE_SNAPSHOT || { payloads: {} }).catch(() => ({ payloads: {} }));
  return _snap.then((s) => (s.payloads || {})[path.split("?")[0]] || null);
}

// The best last-known payload (browser cache vs committed snapshot, newer wins).
export async function lastKnown(path) {
  const loc = readLocal(path), snap = await snapshotFor(path);
  const ok = (x) => x && useful(path, x.data);
  const a = ok(loc) ? loc : null, b = ok(snap) ? snap : null;
  if (a && (!b || String(a.savedAt) >= String(b.savedAt))) return { data: a.data, state: "cached", at: a.savedAt };
  if (b) return { data: b.data, state: "snapshot", at: b.savedAt };
  return { data: {}, state: "none", at: null };
}

export async function liveJSON(path, { timeout = TIMEOUT_MS } = {}) {
  let d = null;
  try {
    const ac = typeof AbortController === "function" ? new AbortController() : null;
    const t = ac ? setTimeout(() => ac.abort(), timeout) : null;
    const r = await fetch(path, { headers: { accept: "application/json" }, signal: ac ? ac.signal : undefined });
    if (t) clearTimeout(t);
    d = r.ok ? await r.json() : null;
  } catch { d = null; }
  if (useful(path, d)) { writeLocal(path, d); return { data: d, state: "live", at: null }; }
  return lastKnown(path);
}

// "Last-known · 14 Oct 09:15" — the visible label for a non-live payload.
export function lastKnownLabel(at) {
  const t = at ? new Date(at) : null;
  if (!t || Number.isNaN(+t)) return "Last-known values";
  const M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hh = String(t.getHours()).padStart(2, "0"), mm = String(t.getMinutes()).padStart(2, "0");
  return `Last-known · ${t.getDate()} ${M[t.getMonth()]} ${hh}:${mm}`;
}
