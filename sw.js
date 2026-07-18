// =============================================================================
// Wire service worker — PUSH ONLY. Deliberately no fetch handler and no asset
// caching: freshness is handled by the ?v= token system and _headers, and a
// caching SW would fight both. This file exists so the Home-Screen web app can
// receive Web Push (iOS 16.4+) and focus/open the right page on tap.
// =============================================================================

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; }
  catch { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Wire", {
    body: d.body || "",
    icon: "/apple-touch-icon.png",
    badge: "/apple-touch-icon.png",
    data: { url: d.url || "/" },
  }));
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
