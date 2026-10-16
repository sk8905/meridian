// =============================================================================
// update.js — the ONE place the app decides to reload itself.
//
// Before this, four separate checks (new build, new service worker, new briefing,
// a dead pre-v2 token check) each called location.reload() the moment they fired —
// usually right as the reader foregrounded the app, so the screen blanked and
// jumped to the top. Now every "something newer is live" signal just marks an
// update PENDING, and it is applied where the reader can't see it:
//
//   • when the app is next sent to the background (visibilitychange → hidden), as
//     long as nothing is open mid-interaction (reader, menu, panels) — the reload
//     runs while the app is off screen, and the active tab/chips/scroll are saved
//     and restored (ptr.js saveTabs/restoreTabs);
//   • or straight away if the reader taps the small "New version" pill (code
//     updates only — a desktop terminal may never be backgrounded).
//
// Data refreshes don't need a reload to be seen: the briefing swaps in place
// (glance.js) and the live feed polls on its own; the pending "data" mark only
// makes sure the other data modules catch up on the next background.
// =============================================================================

let _pending = null;            // null | "data" | "code"
let _applied = false;
let _pill = null;

// Something open the reader would lose if the page reloaded under them.
function busy() {
  const de = document.documentElement, b = document.body;
  if (de && de.classList.contains("wr-open")) return true;                 // in-app reader
  if (b && b.classList.contains("na-menu-open")) return true;              // menu
  return !!document.querySelector(".na-panel:not([hidden]):not(.na-menu-static)");
}

async function apply() {
  if (_applied) return;
  _applied = true;
  try { const m = await import("/ptr.js"); if (m.saveTabs) m.saveTabs(); } catch { /* */ }
  location.reload();
}

function showPill() {
  if (_pill || !document.body) return;
  _pill = document.createElement("button");
  _pill.type = "button";
  _pill.className = "wire-update-pill";
  _pill.textContent = "New version · Tap to refresh";
  _pill.addEventListener("click", apply);
  document.body.appendChild(_pill);
}

/** Record that something newer is live. kind: "code" (new build / worker) or "data". */
export function markUpdate(kind) {
  if (kind === "code") { _pending = "code"; showPill(); }
  else if (!_pending) _pending = "data";
}

/** For specs / diagnostics. */
export function pendingUpdate() { return _pending; }

let _init = false;
export function initUpdater() {
  if (_init) return; _init = true;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && _pending && !busy()) apply();
  });
  try { window.__wireUpdate = { markUpdate, pendingUpdate }; } catch { /* */ }
}
