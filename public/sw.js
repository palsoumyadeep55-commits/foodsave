// FoodSave Service Worker for Offline Resilience
const CACHE_NAME = "foodsave-v1";
const OFFLINE_URL = "/";

const PRECACHE_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/fonts/SF-Pro-Display-Semibold.otf",
  "/fonts/SF-Pro-Text-Regular.otf",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("Pre-cache asset warning:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Network first for API routes, fallback to cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        return new Response(JSON.stringify({ offline: true, message: "Offline mode active" }), {
          headers: { "Content-Type": "application/json" },
        });
      })
    );
    return;
  }

  // Cache first for static assets, network fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match(OFFLINE_URL);
          }
        });
    })
  );
});
