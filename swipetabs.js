// =============================================================================
// Swipe-to-change-chip — a horizontal swipe on any chip-filtered pane moves to
// the adjacent chip (swipe left → next chip, right → previous) as a TRUE slide:
// when the drag locks horizontal, the current pane is snapshotted as a fixed
// ghost overlay (clipped to the viewport), the real pane is switched to the
// target tab and parked one screen-width to the side, and BOTH track the finger
// 1:1 — the incoming pane visibly drags in beside the outgoing one, iOS-pager
// style. Release past ~35% width (or a quick flick) eases the new pane into
// place; otherwise both slide back and the original tab is restored.
//
// Touch events are delivered to the element the touch STARTED on — and the tab
// switch re-renders the pane, detaching that element, after which the rest of
// the gesture never bubbles to document. So at lock the move/end handlers are
// ALSO bound directly to the touched node (detached nodes still receive their
// touch stream); a per-event stamp dedupes the doubled delivery while it is
// still attached.
//
// Vertical scrolling and horizontal-scroll areas (tables, FX matrix) are never
// hijacked. Touch-only; honours prefers-reduced-motion (instant swap, no
// slide). Mounted once per page by nav-actions.js.
// =============================================================================

// Every chip row on the platform and the pane container(s) its tabs swap.
// Containers persist across swaps (handlers toggle/refill them), so they can be
// animated directly.
const SETS = [
  // Dashboard sub-sections FIRST: a touch inside the cockpit belongs to the
  // inner section chips, not the outer Macro tab row (findSet returns the
  // first matching set).
  { chips: "#ck-secnav .tchip", panes: ["#ck-cockpit"] },
  { chips: "#mac-chips .tchip", panes: ["#mac-srcbar", "#mac-wire", "#mac-dash"] },
  { chips: "#lg-chips .tchip", panes: ["#lg-panes"] },
  { chips: "#cr-dash-tabs .tchip", panes: ["#cr-dash-panes"] },
  { chips: "#firm-chips .tchip", panes: ["#firm-wire"] },
  { chips: "#mgr-tabs .tchip", panes: ["#mgr-panes"] },
  { chips: ".g-feed-chips .g-feed-chip[data-desk]", panes: ["#g-feed"] },
];

const EXCLUDE = ".na-panel,.na-scrim,.rowmenu,.rowmenu-scrim,.mcmdk,#cmdk,.g-mkt-panel,[data-no-swipe],.mobile-tabbar,.topbar,.g-top,.wticker,.wbrief";

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
      if (chips.length > 1) return { chips, els, sel: s.chips };
    }
  }
  // Fallback: the swipe works ANYWHERE on the page, not just on the data —
  // touches outside every pane (panel headers, chip rows, empty space) drive
  // the page's primary chip set: the first registered set whose pane and
  // chips are currently visible (inner-most sets are registered first, so on
  // the Macro dashboard this is the sub-section row).
  for (const s of SETS) {
    const els = s.panes.map((p) => document.querySelector(p)).filter(Boolean).filter((el) => el.getClientRects().length);
    if (!els.length) continue;
    const chips = [...document.querySelectorAll(s.chips)].filter((c) => c.offsetParent !== null);
    if (chips.length > 1) return { chips, els, sel: s.chips };
  }
  return null;
}

let _mounted = false;
export function initSwipeTabs() {
  if (_mounted) return; _mounted = true;
  if (!("ontouchstart" in window) && !(navigator.maxTouchPoints > 0)) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let set = null, sx = 0, sy = 0, locked = false, aborted = false, dx = 0, t0 = 0, animating = false;
  let tgt = null;                                     // node the touch started on
  // Live-slide state (set up once per gesture when the drag locks with a target)
  let live = false, dir = 0, W = 0, ghosts = [], chip = null, origChip = null, scrollY0 = 0;
  let prevXHtml = "", prevXBody = "";
  // Sliding active-chip underline (chips whose on-state is an inset underline):
  // a 2px bar tracks the gesture between the outgoing and incoming chip instead
  // of the underline jumping at the moment of the switch.
  let bar = null, barFrom = null, barTo = null, barChips = null;
  // Scroll freeze for the duration of a live slide: the tab switch re-renders
  // the pane (internal scrollTop resets, document height can shrink and clamp
  // the page scroll) — any vertical drift mid-gesture breaks the alignment
  // between the fixed ghost and the sliding real pane.
  let scrollTops = [], relock = null;
  // The pane layers (fixed ghost z60, transformed real pane = new stacking
  // context painted after earlier siblings) draw OVER Home's sticky chip row
  // (z8) — the chips vanished for every gesture while scrolled. Raise the row
  // above the slide layers for the duration; app chip bars in the fixed
  // chrome (z1290) are already higher and are left alone.
  let rowEl = null, rowZ = "";
  const raiseRow = () => {
    // Suspend in-pane sticky rows for the slide (body.wire-sliding): stuck
    // panel titles/chip bars render at their VIEWPORT offsets inside the ghost
    // clone and the transformed pane — floating headers over jumbled rows.
    document.body.classList.add("wire-sliding");
    rowEl = set && set.chips[0] ? set.chips[0].closest("#g-feed-head, .twire-head, .tbar, .tpanel-h, .ck-secbar") : null;
    if (rowEl) {
      // Mark the ACTIVE chip row: the wire-sliding suspension rules exempt it
      // via :not(.st-hold) so the row the finger is on keeps its sticky lock
      // while every other stuck row in the sliding panes drops to static.
      rowEl.classList.add("st-hold");
      const cz = parseInt(getComputedStyle(rowEl).zIndex, 10);
      rowZ = rowEl.style.zIndex;
      if (!(cz > 70)) rowEl.style.zIndex = "70";
    }
  };
  const restoreRow = () => {
    document.body.classList.remove("wire-sliding");
    if (rowEl) { rowEl.classList.remove("st-hold"); rowEl.style.zIndex = rowZ; rowEl = null; rowZ = ""; }
  };

  const setT = (els, x, tr) => els.forEach((el) => {
    el.style.transition = tr || "";
    el.style.transform = x ? `translateX(${x}px)` : "";
  });

  const targetChip = (d) => {
    if (!set) return null;
    const i = set.chips.findIndex((c) => c.classList.contains("is-on"));
    const j = (i < 0 ? 0 : i) + d;
    return j >= 0 && j < set.chips.length ? set.chips[j] : null;
  };

  // Snapshot the visible pane(s) as fixed, viewport-clipped ghosts, switch the
  // real panes to the target tab and park them one width to the side. Returns
  // false when there is no chip in that direction (end of the row → rubber-band).
  const beginSlide = (d) => {
    chip = targetChip(d);
    if (!chip) return false;
    dir = d;
    origChip = set.chips.find((c) => c.classList.contains("is-on")) || null;
    W = window.innerWidth;
    scrollY0 = window.scrollY;
    const vh = window.innerHeight;
    const bg = getComputedStyle(document.body).backgroundColor;
    ghosts = [];
    for (const el of set.els) {
      if (!el.getClientRects().length) continue;
      const r = el.getBoundingClientRect();
      el.style.minHeight = r.height + "px";          // keep page height stable under the ghost
      // Outer clip = only the on-screen band of the pane (feeds can be tens of
      // thousands of px tall); the full clone sits inside, offset so the same
      // slice shows.
      const clipTop = Math.max(r.top, -8);
      const clipH = Math.min(r.bottom, vh + 8) - clipTop;
      if (clipH <= 0) continue;
      const outer = document.createElement("div");
      Object.assign(outer.style, {
        position: "fixed", top: clipTop + "px", left: r.left + "px",
        width: r.width + "px", height: clipH + "px", margin: "0",
        zIndex: "60", pointerEvents: "none", overflow: "hidden", background: bg,
      });
      const g = el.cloneNode(true);
      Object.assign(g.style, {
        position: "absolute", top: (r.top - clipTop) + "px", left: "0",
        width: r.width + "px", margin: "0", transform: "none", minHeight: "0",
      });
      outer.appendChild(g);
      // Mount the ghost inside the pane's own style scope: Home's feed rules
      // are scoped under .tui, and a body-mounted clone escaped them — the
      // UNscoped desktop card style (16px border-radius, border) took over
      // and drew rounded edges on the slide. position:fixed still positions
      // against the viewport (no transformed ancestors here).
      (el.closest(".tui") || document.body).appendChild(outer);
      ghosts.push(outer);
    }
    // Clip the parked pane's horizontal overflow WITHOUT overflow:hidden —
    // hidden turns html/body into scroll containers, which kills position:
    // sticky descendants (Home's chip row un-stuck and scrolled away for the
    // whole gesture). overflow:clip clips paint only; sticky keeps working.
    prevXHtml = document.documentElement.style.overflowX;
    prevXBody = document.body.style.overflowX;
    document.documentElement.style.overflowX = "clip";
    document.body.style.overflowX = "clip";
    // Underline slider — only for chip rows styled with the inset underline
    // (shade-style rows like the dashboard sub-sections keep the instant swap).
    if (origChip && chip && /inset/.test(getComputedStyle(origChip).boxShadow || "")) {
      barFrom = origChip.getBoundingClientRect();
      barTo = chip.getBoundingClientRect();
      bar = document.createElement("div");
      Object.assign(bar.style, {
        position: "fixed", height: "2px", background: "#fff", zIndex: "1400", pointerEvents: "none",
        left: barFrom.left + "px", top: (barFrom.bottom - 2) + "px", width: barFrom.width + "px",
      });
      document.body.appendChild(bar);
    }
    // The click below re-renders the pane and usually DETACHES the touched
    // node — after which its touch events stop reaching document. Bind the
    // rest of this gesture's handlers to the node itself first.
    if (tgt && tgt.addEventListener) {
      tgt.addEventListener("touchmove", onMove, { passive: false });
      tgt.addEventListener("touchend", finish, { passive: true });
      tgt.addEventListener("touchcancel", finish, { passive: true });
    }
    scrollTops = set.els.map((el) => el.scrollTop || 0);
    chip.click();                                    // real panes now hold the target tab
    set.els.forEach((el, i) => { if (scrollTops[i]) el.scrollTop = scrollTops[i]; });
    // Freeze vertical scroll for the whole gesture — snap back any drift
    // (async re-render scrolling, height clamp, momentum).
    relock = () => { if (window.scrollY !== scrollY0) window.scrollTo(0, scrollY0); };
    window.addEventListener("scroll", relock, { passive: true });
    if (bar) {
      // Suppress the static underline AFTER the switch: some chip rows (Home
      // feed) re-render on click, replacing the nodes — class the fresh set.
      barChips = [...document.querySelectorAll(set.sel)];
      barChips.forEach((c) => c.classList.add("st-nobar"));
    }
    window.scrollTo(0, scrollY0);                    // undo any scroll the handler did
    setT(set.els, dir * W, "none");                  // park incoming content off-screen
    live = true;
    return true;
  };

  const unbindTgt = () => {
    if (tgt && tgt.removeEventListener) {
      tgt.removeEventListener("touchmove", onMove);
      tgt.removeEventListener("touchend", finish);
      tgt.removeEventListener("touchcancel", finish);
    }
    tgt = null;
  };

  const cleanup = (els) => {
    ghosts.forEach((g) => g.remove()); ghosts = [];
    els.forEach((el) => { el.style.transition = ""; el.style.transform = ""; el.style.minHeight = ""; });
    if (bar) { bar.remove(); bar = null; }
    (barChips || []).forEach((c) => c.classList.remove("st-nobar"));
    barChips = null; barFrom = null; barTo = null;
    if (relock) { window.removeEventListener("scroll", relock); relock = null; }
    scrollTops = [];
    restoreRow();
    document.documentElement.style.overflowX = prevXHtml;
    document.body.style.overflowX = prevXBody;
    animating = false; live = false; dir = 0; chip = null; origChip = null;
  };
  // Ease the underline bar to a chip's rect alongside the pane settle.
  const barSettle = (r, ease) => {
    if (!bar) return;
    bar.style.transition = `left ${ease}, width ${ease}, top ${ease}`;
    bar.style.left = r.left + "px"; bar.style.width = r.width + "px"; bar.style.top = r.bottom - 2 + "px";
  };

  document.addEventListener("touchstart", (e) => {
    set = null; locked = false; aborted = false; dx = 0; live = false; tgt = null;
    if (animating || e.touches.length !== 1) return;
    const t = e.target;
    if (t.closest && t.closest(EXCLUDE)) return;
    if (inHorizontalScroller(t)) return;
    const s = findSet(t);
    if (!s) return;
    set = s; tgt = t; sx = e.touches[0].clientX; sy = e.touches[0].clientY; t0 = Date.now();
  }, { passive: true });

  const onMove = (e) => {
    if (e._swipetabs) return; e._swipetabs = true;    // dedupe node + document delivery
    if (!set || aborted || animating) return;
    const x = e.touches[0].clientX, y = e.touches[0].clientY;
    dx = x - sx; const dy = y - sy;
    if (!locked) {
      if (Math.abs(dy) > 9 && Math.abs(dy) > Math.abs(dx)) { aborted = true; return; }   // vertical scroll wins
      if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        locked = true;
        if (!reduced) { raiseRow(); beginSlide(dx < 0 ? 1 : -1); }   // direction fixed at lock
      } else return;
    }
    if (e.cancelable) e.preventDefault();
    if (reduced) return;
    if (live) {
      // 1:1 finger tracking; movement against the locked direction gets heavy
      // damping (slight give, springs back on release).
      const main = dir === 1 ? Math.max(Math.min(dx, 0), -W) : Math.min(Math.max(dx, 0), W);
      const wrong = dir === 1 ? Math.max(dx, 0) : Math.min(dx, 0);
      const shift = main + wrong * 0.15;
      setT(ghosts, shift, "none");
      setT(set.els, dir * W + shift, "none");
      if (bar) {
        const p = Math.min(Math.abs(shift) / W, 1);
        bar.style.transition = "none";
        bar.style.left = barFrom.left + (barTo.left - barFrom.left) * p + "px";
        bar.style.width = barFrom.width + (barTo.width - barFrom.width) * p + "px";
        bar.style.top = barFrom.bottom - 2 + (barTo.bottom - barFrom.bottom) * p + "px";
      }
    } else {
      // end of the chip row: no target — damped rubber-band so the edge feels solid
      const t = Math.min(Math.abs(dx) * 0.25, 60) * (dx < 0 ? -1 : 1);
      setT(set.els, t, "none");
    }
  };
  document.addEventListener("touchmove", onMove, { passive: false });

  const finish = (e) => {
    if (e && e._swipetabs) return; if (e) e._swipetabs = true;
    unbindTgt();
    if (!set || !locked) { set = null; return; }
    const els = set.els;
    if (reduced) {
      const d = dx < 0 ? 1 : -1; const c = targetChip(d);
      if (c && Math.abs(dx) > 70) c.click();
      set = null; locked = false;
      return;
    }
    if (!live) {                                     // rubber-band spring back
      setT(els, 0, "transform .18s ease");
      setTimeout(() => {
        els.forEach((el) => { el.style.transition = ""; el.style.transform = ""; });
        restoreRow();
      }, 200);
      set = null; locked = false;
      return;
    }
    animating = true;
    const vel = Math.abs(dx) / Math.max(Date.now() - t0, 1);
    const progressed = dir === 1 ? -dx : dx;         // px moved toward the commit
    const commit = progressed > W * 0.35 || (progressed > 30 && vel > 0.45);
    const ease = "transform .21s cubic-bezier(.22,.61,.36,1)";
    if (commit) {
      setT(ghosts, -dir * W, ease);                  // outgoing finishes its exit
      setT(els, 0, ease);                            // incoming settles into place
      barSettle(barTo, ".21s cubic-bezier(.22,.61,.36,1)");
      setTimeout(() => cleanup(els), 230);
    } else {
      setT(ghosts, 0, ease);                         // outgoing returns
      setT(els, dir * W, ease);                      // incoming retreats off-screen
      barSettle(barFrom, ".21s cubic-bezier(.22,.61,.36,1)");
      const oc = origChip, y0 = scrollY0, sts = scrollTops.slice();
      setTimeout(() => {
        if (oc) oc.click();                          // restore the original tab's content
        window.scrollTo(0, y0);
        els.forEach((el, i) => { if (sts[i]) el.scrollTop = sts[i]; });
        cleanup(els);
      }, 230);
    }
    set = null; locked = false;
  };
  document.addEventListener("touchend", finish, { passive: true });
  document.addEventListener("touchcancel", finish, { passive: true });
}
