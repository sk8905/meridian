// =============================================================================
// Custom pull-to-refresh. iOS gives NO native pull-to-refresh in standalone
// (home-screen) web apps, so we roll our own — and make it feel like Safari's:
// pulling down at the very top of the page drags the whole page content down
// with your finger (rubber-band), revealing a navy zone (matching the nav bar)
// with a spinner behind it; releasing past the threshold reloads. The fixed
// bottom tab bar stays put. Touch devices only; a no-op on desktop. Import once
// and call initPullToRefresh().
// =============================================================================
let _init = false;
export function initPullToRefresh() {
  if (_init || typeof window === "undefined" || typeof document === "undefined") return;
  if (!("ontouchstart" in window) && !(navigator.maxTouchPoints > 0)) return;
  _init = true;

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
    st.textContent = "@keyframes ptr-spin{to{transform:rotate(360deg)}}";
    document.head.appendChild(st);
  }
  const mount = () => { if (!zone.isConnected && document.body) document.body.appendChild(zone); };
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  const THRESH = 70, DAMP = 0.5, MAX = 120;
  let startY = 0, pulling = false, dist = 0, busy = false, pageEls = [];
  const atTop = () => (window.scrollY || document.documentElement.scrollTop || 0) <= 0;

  // The "page" = every direct child of <body> that isn't our zone and isn't a
  // fixed element (so the fixed bottom tab bar and any fixed overlays stay put).
  function gatherPage() {
    pageEls = Array.from(document.body.children)
      .filter((el) => el !== zone && getComputedStyle(el).position !== "fixed");
  }
  // Drag the page down by `h` and grow the navy zone to fill the gap it leaves.
  function apply(h, animate) {
    const zt = animate ? "height .22s ease" : "";
    const pt = animate ? "transform .22s ease" : "";
    zone.style.transition = zt; zone.style.height = h + "px";
    for (const el of pageEls) { el.style.transition = pt; el.style.transform = h ? "translateY(" + h + "px)" : ""; }
    spin.style.opacity = String(Math.min(h / THRESH, 1));
  }
  function clearPage() { for (const el of pageEls) { el.style.transition = ""; el.style.transform = ""; } }

  window.addEventListener("touchstart", (e) => {
    if (busy || e.touches.length !== 1 || !atTop()) { pulling = false; return; }
    startY = e.touches[0].clientY; pulling = true; dist = 0; gatherPage();
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!pulling || busy) return;
    dist = e.touches[0].clientY - startY;
    if (dist > 0 && atTop()) {
      if (e.cancelable) e.preventDefault();       // take over the gesture
      apply(Math.min(dist * DAMP, MAX), false);
    } else { pulling = false; apply(0, true); setTimeout(clearPage, 240); }
  }, { passive: false });

  window.addEventListener("touchend", () => {
    if (!pulling) return;
    pulling = false;
    if (dist * DAMP >= THRESH && atTop()) {
      busy = true;
      apply(THRESH, true);
      spin.style.opacity = "1";
      spin.style.animation = "ptr-spin .6s linear infinite";
      setTimeout(() => location.reload(), 220);
    } else { apply(0, true); setTimeout(clearPage, 240); }
    dist = 0;
  }, { passive: true });
}
