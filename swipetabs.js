// =============================================================================
// Swipe-to-change-chip — a horizontal swipe on any chip-filtered pane moves to
// the adjacent chip (swipe left → next chip, right → previous), styled as a
// SMOOTH hand-off: the pane tracks the finger 1:1 (with resistance past 100px
// and at the ends of the row), and on release either slides out → swaps → slides
// in from the opposite side (~280ms total), or springs back. Vertical scrolling
// and horizontal-scroll areas (tables, FX matrix) are never hijacked.
// Touch-only; honours prefers-reduced-motion (instant swap). Mounted once per
// page by nav-actions.js.
// =============================================================================

// Every chip row on the platform and the pane container(s) its tabs swap.
// Containers persist across swaps (handlers toggle/refill them), so they can be
// animated directly.
const SETS = [
  { chips: "#mac-chips .tchip", panes: ["#mac-srcbar", "#mac-wire", "#mac-dash"] },
  { chips: "#lg-chips .tchip", panes: ["#lg-panes"] },
  { chips: "#cr-dash-tabs .tchip", panes: ["#cr-dash-panes"] },
  { chips: "#firm-chips .tchip", panes: ["#firm-wire"] },
  { chips: "#mgr-tabs .tchip", panes: ["#mgr-panes"] },
  { chips: ".g-feed-chips .g-feed-chip[data-desk]", panes: ["#g-feed"] },
];

const EXCLUDE = ".na-panel,.na-scrim,.rowmenu,.rowmenu-scrim,.mcmdk,#cmdk,.g-mkt-panel,[data-no-swipe]";

function inHorizontalScroller(node) {
  let el = node;
  while (el && el !== document.body && el.nodeType === 1) {
    const ox = getComputedStyle(el).overflowX;
    if ((ox === "auto" || ox === "scroll") && el.scrollWidth > el.clientWidth + 1) return true;
    el = el.parentElement;
  }
  return false;
}

function findSet(target) {
  for (const s of SETS) {
    const els = s.panes.map((p) => document.querySelector(p)).filter(Boolean);
    if (els.some((el) => el.contains(target))) {
      const chips = [...document.querySelectorAll(s.chips)].filter((c) => c.offsetParent !== null);
      if (chips.length > 1) return { chips, els };
    }
  }
  return null;
}

let _mounted = false;
export function initSwipeTabs() {
  if (_mounted) return; _mounted = true;
  if (!("ontouchstart" in window) && !(navigator.maxTouchPoints > 0)) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let set = null, sx = 0, sy = 0, locked = false, aborted = false, dx = 0, t0 = 0, animating = false;

  const setT = (els, x, fade, tr) => els.forEach((el) => {
    el.style.transition = tr || "";
    el.style.transform = x ? `translateX(${x}px)` : "";
    el.style.opacity = fade != null ? String(fade) : "";
  });
  const clear = (els) => els.forEach((el) => { el.style.transition = ""; el.style.transform = ""; el.style.opacity = ""; });

  const targetChip = (dir) => {
    if (!set) return null;
    const i = set.chips.findIndex((c) => c.classList.contains("is-on"));
    const j = (i < 0 ? 0 : i) + dir;
    return j >= 0 && j < set.chips.length ? set.chips[j] : null;
  };

  document.addEventListener("touchstart", (e) => {
    set = null; locked = false; aborted = false; dx = 0;
    if (animating || e.touches.length !== 1) return;
    const t = e.target;
    if (t.closest && t.closest(EXCLUDE)) return;
    if (inHorizontalScroller(t)) return;
    const s = findSet(t);
    if (!s) return;
    set = s; sx = e.touches[0].clientX; sy = e.touches[0].clientY; t0 = Date.now();
  }, { passive: true });

  document.addEventListener("touchmove", (e) => {
    if (!set || aborted || animating) return;
    const x = e.touches[0].clientX, y = e.touches[0].clientY;
    dx = x - sx; const dy = y - sy;
    if (!locked) {
      if (Math.abs(dy) > 9 && Math.abs(dy) > Math.abs(dx)) { aborted = true; return; }   // vertical scroll wins
      if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.4) locked = true;
      else return;
    }
    if (e.cancelable) e.preventDefault();
    // 1:1 up to 100px, damped past that; heavier damping when there is no chip
    // in that direction (end of the row) so the edge feels solid.
    const dir = dx < 0 ? 1 : -1;
    const hasTarget = !!targetChip(dir);
    const a = Math.abs(dx);
    let t = a <= 100 ? a : 100 + (a - 100) * 0.3;
    if (!hasTarget) t *= 0.25;
    t = Math.min(t, 150) * (dx < 0 ? -1 : 1);
    setT(set.els, t, 1 - Math.min(Math.abs(t) / 320, 0.3));
  }, { passive: false });

  const finish = () => {
    if (!set || !locked) { set = null; return; }
    const els = set.els;
    const dir = dx < 0 ? 1 : -1;
    const chip = targetChip(dir);
    const vel = Math.abs(dx) / Math.max(Date.now() - t0, 1);
    const commit = chip && (Math.abs(dx) > 70 || (Math.abs(dx) > 30 && vel > 0.45));
    if (!commit) {
      // spring back
      setT(els, 0, 1, "transform .18s ease, opacity .18s ease");
      setTimeout(() => clear(els), 200);
      set = null; locked = false;
      return;
    }
    if (reduced) { clear(els); chip.click(); set = null; locked = false; return; }
    animating = true;
    const out = dx < 0 ? -64 : 64;
    setT(els, out, 0, "transform .13s ease-in, opacity .13s ease-in");
    setTimeout(() => {
      chip.click();                                   // page handler swaps the pane
      setT(els, -out, 0, "none");
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setT(els, 0, 1, "transform .16s ease-out, opacity .16s ease-out");
        setTimeout(() => { clear(els); animating = false; }, 190);
      }));
    }, 135);
    set = null; locked = false;
  };
  document.addEventListener("touchend", finish, { passive: true });
  document.addEventListener("touchcancel", finish, { passive: true });
}
