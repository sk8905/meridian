// =============================================================================
// Wire service worker — Web Push + app-shell cache.
//
// PUSH: exists so the Home-Screen web app can receive Web Push (iOS 16.4+) and
// focus/open the right page on tap.
//
// APP SHELL: page switches used to pay two serial no-cache round-trips (the
// HTML entry point, then the shared data module) before anything painted — a
// visible blank/jump on every tab change. The fetch handler below serves
// exactly those two classes instantly from cache and revalidates in the
// background (stale-while-revalidate). Everything else is untouched: ?v=
// tokened JS/CSS already sit in the long HTTP cache, and /api/* + /cdn-cgi/*
// must always hit the network (live data, Cloudflare Access).
//
// Freshness contract:
//   • every use revalidates in the background — at worst one navigation stale;
//   • requests made with cache:"reload"/"no-store"/"no-cache" go network-FIRST
//     and update the shell cache (pull-to-refresh prefetches this way, and the
//     deploy check in ptr.js fetches no-store — so its follow-up reload paints
//     the NEW build instantly from the just-updated cache);
//   • a "?__net=1" URL bypasses the cache entirely (no read, no write) — the
//     Access re-auth escape hatch: that navigation must reach the network so
//     Access can redirect through login and back.
// =============================================================================

const CACHE = "wire-shell-v1";
// The no-cache data modules (see _headers). Cached under their bare pathname —
// importers reference them with assorted stale ?v= tokens; the bodies are
// identical, so all variants map to one entry.
const DATA_PATHS = ["/ft.js", "/newsletters.js", "/credit/js/data.js", "/legal/js/data.js", "/macro/js/content.js"];

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(
  Promise.all([self.clients.claim(), caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))])
));

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/cdn-cgi/")) return;
  const isDoc = req.mode === "navigate";
  if (!isDoc && !DATA_PATHS.includes(url.pathname)) return;   // tokened assets: HTTP cache handles them
  if (url.searchParams.has("__net")) return;                  // re-auth escape hatch: pure passthrough

  const key = url.pathname;                                   // query-less cache key (see DATA_PATHS note)
  const cacheable = (res) => res && res.ok && !res.redirected && res.type === "basic";
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const revalidate = () => fetch(req).then((res) => {
      if (cacheable(res)) cache.put(key, res.clone());
      return res;
    });
    if (req.cache === "reload" || req.cache === "no-store" || req.cache === "no-cache") {
      try { return await revalidate(); }
      catch { return (await cache.match(key)) || Response.error(); }
    }
    const cached = await cache.match(key);
    if (cached) { e.waitUntil(revalidate().catch(() => {})); return cached; }
    try { return await revalidate(); }
    catch { return Response.error(); }
  })());
});

// Background refresh, iOS-style: a web app gets NO periodic background time,
// but a push wakes this worker with a work budget — so every incoming alert
// also re-pulls the app shell + data modules into the cache (network-first).
// Tapping the notification (or opening later) then lands on fresh content.
const WARM_PATHS = ["/", "/macro/", "/credit/", "/legal/", "/menu/",
  "/ft.js", "/newsletters.js", "/credit/js/data.js", "/legal/js/data.js", "/macro/js/content.js"];
async function warmShell() {
  try {
    const cache = await caches.open(CACHE);
    const one = async (u) => {
      const res = await fetch(u, { cache: "reload" });
      if (res && res.ok && !res.redirected && res.type === "basic") await cache.put(u, res.clone());
    };
    // Cap the whole warm well inside the push work budget.
    await Promise.race([
      Promise.allSettled(WARM_PATHS.map(one)),
      new Promise((r) => setTimeout(r, 12000)),
    ]);
  } catch { /* offline — the stale cache stays usable */ }
}

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; }
  catch { d = { body: e.data ? e.data.text() : "" }; }
  // An EMPTY title is deliberate (breaking alerts): iOS then leads with its
  // own "from Wire" attribution and the body carries headline + source.
  e.waitUntil(Promise.all([
    self.registration.showNotification(d.title == null ? "Wire" : d.title, {
      body: d.body || "",
      icon: "/apple-touch-icon.png",
      badge: "/apple-touch-icon.png",
      data: { url: d.url || "/" },
    }),
    warmShell(),
  ]));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ws) => {
    for (const w of ws) {
      if ("focus" in w) {
        if (w.navigate && url !== "/") w.navigate(url);
        return w.focus();
      }
    }
    return self.clients.openWindow(url);
  }));
});
