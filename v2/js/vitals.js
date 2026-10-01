// =============================================================================
// vitals.js — real-user performance beacon (RUM), tiny and dependency-free.
//
// Field-measures load/responsiveness on ACTUAL devices and sends ONE compact
// summary per session to /api/vitals (the Worker structured-logs it — there is no
// analytics binding). This is how a change (e.g. deferring Home's heavy desk-data
// import) is proven to help real iPhones, not just the lab.
//
// What's collected, and where it works:
//   • fcp    — first-contentful-paint        (paint timing; iOS Safari ✓)
//   • ttfb   — navigation responseStart       (nav timing; iOS Safari ✓)
//   • deskMs — Home desk-data load+parse      (User Timing "wire:desk"; iOS ✓) ← the #1 metric
//   • lcp/cls/inp — Core Web Vitals           (Chromium only; null on WebKit)
//   • context — view, nav type, viewport, DPR, connection, PWA display mode
//
// Everything is feature-detected and try/caught: vitals must never throw into the
// app or cost anything the user can feel. The beacon fires once, when the page is
// first hidden/torn down (the point at which the metrics are final).
// =============================================================================
let _sent = false;

export function initVitals() {
  if (typeof performance === "undefined") return;
  let lcp = null, cls = 0, inp = 0;
  let clsCur = 0, clsFirst = 0, clsPrev = 0;   // CLS session-window accumulator

  const obs = (type, cb, extra) => {
    try {
      const o = new PerformanceObserver((list) => list.getEntries().forEach(cb));
      o.observe(Object.assign({ type, buffered: true }, extra || {}));
      return o;
    } catch { return null; }   // unsupported entry type (e.g. LCP/CLS/INP on WebKit)
  };

  // LCP: keep the latest candidate (it only ever grows until input/teardown).
  obs("largest-contentful-paint", (e) => { lcp = e.startTime; });
  // CLS: sum shifts within a session window (≤1s between shifts, ≤5s span); keep the max window.
  obs("layout-shift", (e) => {
    if (e.hadRecentInput) return;
    if (clsCur && (e.startTime - clsPrev > 1000 || e.startTime - clsFirst > 5000)) clsCur = 0;
    if (!clsCur) clsFirst = e.startTime;
    clsPrev = e.startTime;
    clsCur += e.value;
    if (clsCur > cls) cls = clsCur;
  });
  // INP proxy: the worst discrete-interaction latency (fair at this traffic level).
  obs("event", (e) => { if (e.interactionId && e.duration > inp) inp = e.duration; }, { durationThreshold: 40 });

  const send = () => {
    if (_sent) return; _sent = true;
    try {
      const nav = (performance.getEntriesByType("navigation") || [])[0] || {};
      const fcp = (performance.getEntriesByName("first-contentful-paint") || [])[0];
      const desk = (performance.getEntriesByName("wire:desk", "measure") || [])[0];
      const c = navigator.connection || {};
      const payload = {
        fcp: fcp ? fcp.startTime : null,
        ttfb: nav.responseStart || null,
        deskMs: desk ? desk.duration : null,
        lcp, cls, inp: inp || null,
        view: document.documentElement.dataset.v2tab || null,
        nav: nav.type || null,
        vp: innerWidth + "x" + innerHeight,
        dpr: devicePixelRatio || 1,
        conn: c.effectiveType || null,
        pwa: (typeof matchMedia === "function" && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true,
      };
      const body = JSON.stringify(payload);
      if (navigator.sendBeacon) navigator.sendBeacon("/api/vitals", body);
      else fetch("/api/vitals", { method: "POST", body, keepalive: true }).catch(() => {});
    } catch { /* never throw from the beacon */ }
  };

  // visibilitychange(hidden) is the reliable "page is going away" signal on iOS
  // (pagehide/unload fire inconsistently there); pagehide is the desktop backstop.
  addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") send(); }, { capture: true });
  addEventListener("pagehide", send, { capture: true });
}
