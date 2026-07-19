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
  _init = true;

  // Auto-refresh when a new build is deployed. iOS home-screen (standalone) PWAs
  // cache the bundle aggressively and don't reliably revalidate, so edits can
  // sit invisible until a manual refresh. This detects a fresh deploy and reloads
  // once: the HTML entry points are no-cache, so a no-store fetch of this page
  // always returns the live markup — compare its premium.css build token to the
  // one THIS document loaded; if it changed, a newer build is live → reload (which
  // pulls the new tokened CSS/JS). Runs on foreground (when the user returns) and
  // once shortly after load, so a stale open self-heals. No reload loop: after the
  // reload the loaded token equals the live token. Runs on every device.
  setupAutoRefresh();

  // Pull-to-refresh + double-tap-zoom handling are touch-only.
  if (!("ontouchstart" in window) && !(navigator.maxTouchPoints > 0)) return;

  // Kill accidental double-tap-to-zoom. touch-action:manipulation (injected in
  // the style below) is the standard cure, but iOS standalone PWAs sometimes
  // ignore it, so also cancel the SECOND tap of a quick, same-spot double-tap.
  // The location check (<40px) means only a real double-tap-zoom gesture is
  // cancelled — fast taps on different controls, single taps, scrolling and
  // pinch-zoom are all left untouched.
  let lastEnd = 0, lastX = 0, lastY = 0;
  document.addEventListener("touchend", (e) => {
    const t = e.changedTouches && e.changedTouches[0];
    const x = t ? t.clientX : 0, y = t ? t.clientY : 0;
    const now = Date.now();
    if (now - lastEnd <= 300 && Math.abs(x - lastX) < 40 && Math.abs(y - lastY) < 40 && e.cancelable) {
      e.preventDefault();
    }
    lastEnd = now; lastX = x; lastY = y;
  }, { passive: false });

  // Disable double-tap-to-zoom everywhere (keeps single-tap, scroll and pinch).
  // touch-action isn't inherited, so a universal rule is needed to cover every
  // element (e.g. the fixed bottom tab-bar buttons), not just html/body.

  // Match the near-black app ground so the pull-down zone doesn't flash navy.
  const cs = getComputedStyle(document.documentElement);
  const navy = (cs.getPropertyValue("--bg") || cs.getPropertyValue("--t-ground") || "").trim() || "#05080f";
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
  restoreTabs();

  const THRESH = 75, SOFT = 120, MAX = 220;
  let startX = 0, startY = 0, armed = false, pulling = false, dist = 0, busy = false;
  const atTop = () => (window.scrollY || document.documentElement.scrollTop || 0) <= 0;
  // Safari-like tracking: 1:1 with the finger up to SOFT, then increasing resistance.
  const pull = (d) => (d <= SOFT ? d : Math.min(SOFT + (d - SOFT) * 0.35, MAX));

  // Don't hijack the pull when the gesture starts inside a menu/overlay or any
  // vertically-scrollable area (e.g. the notifications panel or command palette)
  // — that content should scroll on its own instead of pulling the page.
  function inOverlayOrScroller(node) {
    if (node && node.closest && node.closest(".na-panel,.na-scrim,.rowmenu,.rowmenu-scrim,.notif-panel,.g-notif-panel,.mcmdk,#cmdk,.rel-dd-panel,[data-no-ptr]")) return true;
    let el = node;
    while (el && el !== document.body && el.nodeType === 1) {
      const oy = getComputedStyle(el).overflowY;
      if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) return true;
      el = el.parentElement;
    }
    return false;
  }

  // NOTHING moves during the pull: the sticky header and the bottom tab bar
  // stay frozen, and the spinner zone slides down from UNDER the header,
  // overlaying the top of the content. Measured at pull start so it always
  // hugs the current header height.
  function anchorZone() {
    const head = document.querySelector(".topbar, .g-top");
    let top = head ? Math.max(0, head.getBoundingClientRect().bottom) : 0;
    // The chip rows stacked directly under the top bar count as header too —
    // the zone opens BELOW them (walk down while another bar abuts the edge).
    for (let i = 0; i < 3; i++) {
      let moved = false;
      for (const b of document.querySelectorAll(".tchips, .g-feed-chips")) {
        const r = b.getBoundingClientRect();
        if (r.height && r.top >= top - 2 && r.top <= top + 40 && r.bottom > top) { top = r.bottom; moved = true; }
      }
      if (!moved) break;
    }
    zone.style.top = Math.round(top) + "px";
    zone.style.zIndex = "1200";      // over content, under panels & tab bar
  }
  function apply(h, animate) {
    zone.style.transition = animate ? "height .22s ease" : "";
    zone.style.height = h + "px";
    const prog = Math.min(dist / THRESH, 1);
    spin.style.opacity = String(prog);
    if (!busy) { spin.style.animation = ""; spin.style.transform = "rotate(" + (prog * 270) + "deg)"; }
  }

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
      if (dy > 0 && dy > Math.abs(dx) * 1.2 && atTop()) { pulling = true; startY = y; dist = 0; anchorZone(); return; }
      else { armed = false; return; }
    }
    dist = y - startY;
    if (dist > 0 && atTop()) {
      if (e.cancelable) e.preventDefault();       // take over the gesture
      apply(pull(dist), false);
    } else { pulling = false; armed = false; apply(0, true); }
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
      saveTabs();
      setTimeout(() => location.reload(), 240);
    } else { apply(0, true); }
    dist = 0;
  }, { passive: true });
}

// ---- Keep the reader on the SAME view across reloads ------------------------
// Chip/tab selections aren't in the URL, so a refresh (pull-to-refresh or the
// auto-deploy reload) used to bounce back to each page's default tab. Save the
// active chip of every known row before reloading; restore by clicking them
// once the app has rendered.
const TAB_ROWS = ["#mac-chips", "#ck-secnav", "#lg-chips", "#cr-dash-tabs", "#firm-chips", "#mgr-tabs", ".g-feed-chips"];
function saveTabs() {
  const sel = [];
  for (const row of TAB_ROWS) {
    const on = document.querySelector(row + " .tchip.is-on, " + row + " .g-feed-chip.is-on");
    if (on) sel.push([row, on.dataset.desk || on.dataset.sec || on.textContent.trim()]);
  }
  try { sessionStorage.setItem("wire.ptrTabs", JSON.stringify({ href: location.href, sel, t: Date.now() })); } catch { /* private mode */ }
}
function restoreTabs() {
  let rec = null;
  try {
    rec = JSON.parse(sessionStorage.getItem("wire.ptrTabs") || "null");
    sessionStorage.removeItem("wire.ptrTabs");
  } catch { return; }
  if (!rec || rec.href !== location.href || Date.now() - (rec.t || 0) > 30000 || !Array.isArray(rec.sel)) return;
  const started = Date.now();
  const tick = () => {
    let waiting = false;
    rec.sel = rec.sel.filter(([row, key]) => {
      const chips = document.querySelectorAll(row + " .tchip, " + row + " .g-feed-chip");
      if (!chips.length) { waiting = true; return true; }    // row not rendered yet
      const target = [...chips].find((c) => (c.dataset.desk || c.dataset.sec || c.textContent.trim()) === key);
      if (target && !target.classList.contains("is-on")) target.click();
      return false;
    });
    if (rec.sel.length && waiting && Date.now() - started < 4000) setTimeout(tick, 150);
  };
  setTimeout(tick, 120);
}

// Detect a new deploy and reload once (see the note in initPullToRefresh).
function setupAutoRefresh() {
  const tokenOf = (s) => { const m = String(s || "").match(/premium\.css\?v=([\w.-]+)/); return m ? m[1] : ""; };
  const link = document.querySelector('link[href*="premium.css"]');
  const loaded = tokenOf(link && link.getAttribute("href"));
  if (!loaded) return;                       // can't compare — bail (home/apps all link premium.css)
  let busy = false;
  const check = async () => {
    if (busy || document.hidden || !navigator.onLine) return;
    // Never yank the page out from under an open overlay (menu/panels) — a
    // reload mid-interaction reads as "my tap navigated somewhere".
    if (document.body && (document.body.classList.contains("na-menu-open") || document.querySelector(".na-panel:not([hidden])"))) return;
    busy = true;
    try {
      const res = await fetch(location.pathname, { cache: "no-store" });
      if (res.ok) {
        const live = tokenOf(await res.text());
        if (live && live !== loaded) { saveTabs(); location.reload(); return; }   // new build live
      }
    } catch { /* offline / Access redirect — ignore */ }
    busy = false;
  };
  document.addEventListener("visibilitychange", () => { if (!document.hidden) check(); });
  setTimeout(check, 4000);                   // self-heal a stale first open
}
