// =============================================================================
// Custom pull-to-refresh, tuned to feel like Safari's native gesture: pulling
// down at the very top drags the whole page content down with your finger
// (near 1:1, with rubber-band resistance past a point), revealing a navy zone
// (matching the nav bar) with a spinner that winds up as you pull and spins on
// release; letting go past the threshold reloads, otherwise it springs back.
// The fixed bottom tab bar stays put. iOS gives no native PTR in standalone
// (home-screen) web apps, which is why we roll our own. Touch devices only.
// Also switches off double-tap-to-zoom (touch-action: manipulation) while
// keeping pinch-zoom. Import once and call initPullToRefresh().
// =============================================================================
let _init = false;
export function initPullToRefresh() {
  if (_init || typeof window === "undefined" || typeof document === "undefined") return;
  if (!("ontouchstart" in window) && !(navigator.maxTouchPoints > 0)) return;
  _init = true;

  // Disable double-tap-to-zoom everywhere (keeps single-tap, scroll and pinch).
  // touch-action isn't inherited, so a universal rule is needed to cover every
  // element (e.g. the fixed bottom tab-bar buttons), not just html/body.

  const navy = (getComputedStyle(document.documentElement).getPropertyValue("--navy") || "").trim() || "#0b1f44";
  const zone = document.createElement("div");
  zone.setAttribute("aria-hidden", "true");
  zone.style.cssText =
    "position:fixed;top:0;left:0;right:0;height:0;z-index:9999;overflow:hidden;pointer-events:none;" +
    "display:flex;align-items:flex-end;justify-content:center;background:" + navy + ";";
  const spin = document.createElement("div");
  spin.style.cssText =
    "width:22px;height:22px;margin-bottom:11px;border-radius:50%;opacity:0;" +
    "border:2.5px solid rgba(255,255,255,.35);border-top-color:#fff;";
  zone.appendChild(spin);
  if (!document.getElementById("ptr-kf")) {
    const st = document.createElement("style"); st.id = "ptr-kf";
    st.textContent = "@keyframes ptr-spin{to{transform:rotate(360deg)}}html *{touch-action:manipulation}" +
      // Kill the native iOS rubber-band bounce so ONLY our custom PTR moves the
      // page. Otherwise the bounce shifts the in-flow (translated) content while
      // the position:fixed navy zone detaches during overscroll, opening a gap
      // that flashes the light page background (the "white band" on pull-down).
      "html,body{overscroll-behavior-y:none}";
    document.head.appendChild(st);
  }
  const mount = () => { if (!zone.isConnected && document.body) document.body.appendChild(zone); };
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  const THRESH = 75, SOFT = 120, MAX = 220;
  let startX = 0, startY = 0, armed = false, pulling = false, dist = 0, busy = false, pageEls = [];
  const atTop = () => (window.scrollY || document.documentElement.scrollTop || 0) <= 0;
  // Safari-like tracking: 1:1 with the finger up to SOFT, then increasing resistance.
  const pull = (d) => (d <= SOFT ? d : Math.min(SOFT + (d - SOFT) * 0.35, MAX));

  // Don't hijack the pull when the gesture starts inside a menu/overlay or any
  // vertically-scrollable area (e.g. the notifications panel or command palette)
  // — that content should scroll on its own instead of pulling the page.
  function inOverlayOrScroller(node) {
    if (node && node.closest && node.closest(".notif-panel,.g-notif-panel,.mcmdk,#cmdk,.rel-dd-panel,[data-no-ptr]")) return true;
    let el = node;
    while (el && el !== document.body && el.nodeType === 1) {
      const oy = getComputedStyle(el).overflowY;
      if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) return true;
      el = el.parentElement;
    }
    return false;
  }

  // The "page" = every direct child of <body> that isn't our zone and isn't a
  // fixed element (so the fixed bottom tab bar and any fixed overlays stay put).
  function gatherPage() {
    pageEls = Array.from(document.body.children)
      .filter((el) => el !== zone && getComputedStyle(el).position !== "fixed");
  }
  function apply(h, animate) {
    const zt = animate ? "height .22s ease" : "";
    const pt = animate ? "transform .22s ease" : "";
    zone.style.transition = zt; zone.style.height = h + "px";
    for (const el of pageEls) { el.style.transition = pt; el.style.transform = h ? "translateY(" + h + "px)" : ""; }
    const prog = Math.min(dist / THRESH, 1);
    spin.style.opacity = String(prog);
    if (!busy) { spin.style.animation = ""; spin.style.transform = "rotate(" + (prog * 270) + "deg)"; }
  }
  function clearPage() { for (const el of pageEls) { el.style.transition = ""; el.style.transform = ""; } }

  window.addEventListener("touchstart", (e) => {
    if (busy || e.touches.length !== 1 || !atTop() || inOverlayOrScroller(e.target)) { armed = false; pulling = false; return; }
    startX = e.touches[0].clientX; startY = e.touches[0].clientY; armed = true; pulling = false; dist = 0;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!armed || busy) return;
    const y = e.touches[0].clientY, x = e.touches[0].clientX;
    if (!pulling) {
      const dy = y - startY, dx = x - startX;
      if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return;      // wait past the deadzone
      // Only a clearly-vertical downward drag arms the pull — horizontal swipes
      // (nav-bar tabs) and upward moves fall through to normal scrolling.
      if (dy > 0 && dy > Math.abs(dx) * 1.2 && atTop()) { pulling = true; startY = y; dist = 0; gatherPage(); return; }
      else { armed = false; return; }
    }
    dist = y - startY;
    if (dist > 0 && atTop()) {
      if (e.cancelable) e.preventDefault();       // take over the gesture
      apply(pull(dist), false);
    } else { pulling = false; armed = false; apply(0, true); setTimeout(clearPage, 240); }
  }, { passive: false });

  window.addEventListener("touchend", () => {
    armed = false;
    if (!pulling) return;
    pulling = false;
    if (dist >= THRESH && atTop()) {
      busy = true;
      apply(THRESH, true);
      spin.style.opacity = "1";
      spin.style.transform = "";
      spin.style.animation = "ptr-spin .6s linear infinite";
      setTimeout(() => location.reload(), 240);
    } else { apply(0, true); setTimeout(clearPage, 240); }
    dist = 0;
  }, { passive: true });
}
