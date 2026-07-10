// =============================================================================
// Custom pull-to-refresh. iOS gives NO native pull-to-refresh in standalone
// (home-screen) web apps, and even in a Safari tab the native behaviour + its
// overscroll colour are inconsistent — so we roll our own. Pulling down at the
// very top of the page reveals a navy pull zone (matching the nav bar) with a
// spinner; releasing past the threshold reloads the page. Touch devices only;
// a no-op on desktop. Import once and call initPullToRefresh().
// =============================================================================
let _init = false;
export function initPullToRefresh() {
  if (_init || typeof window === "undefined" || typeof document === "undefined") return;
  // Touch devices only — desktop keeps its normal scroll.
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
  let startY = 0, pulling = false, dist = 0, busy = false;
  const atTop = () => (window.scrollY || document.documentElement.scrollTop || 0) <= 0;
  const collapse = () => { zone.style.transition = "height .2s ease"; zone.style.height = "0px"; spin.style.opacity = "0"; };

  window.addEventListener("touchstart", (e) => {
    if (busy || e.touches.length !== 1 || !atTop()) { pulling = false; return; }
    startY = e.touches[0].clientY; pulling = true; dist = 0;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!pulling || busy) return;
    dist = e.touches[0].clientY - startY;
    if (dist > 0 && atTop()) {
      // Take over the gesture so the page (or native bounce) doesn't also move.
      if (e.cancelable) e.preventDefault();
      const h = Math.min(dist * DAMP, MAX);
      zone.style.transition = "";
      zone.style.height = h + "px";
      spin.style.opacity = String(Math.min(h / THRESH, 1));
    } else { pulling = false; collapse(); }
  }, { passive: false });

  window.addEventListener("touchend", () => {
    if (!pulling) return;
    pulling = false;
    if (dist * DAMP >= THRESH && atTop()) {
      busy = true;
      zone.style.transition = "height .15s ease";
      zone.style.height = THRESH + "px";
      spin.style.opacity = "1";
      spin.style.animation = "ptr-spin .6s linear infinite";
      setTimeout(() => location.reload(), 200);
    } else { collapse(); }
    dist = 0;
  }, { passive: true });
}
