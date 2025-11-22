var cacheName = 'PersonalWebpage';
var filesToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js'
];

// Install Event
self.addEventListener("install", async (e) => {
  console.log("Service Worker: Installing...");
  const cache = await caches.open(cacheName);
  await cache.addAll(filesToCache);
  self.skipWaiting();
  console.log("Service Worker: Installation Complete.");
});

// Activate Event
self.addEventListener("activate", async (e) => {
  console.log("Service Worker: Activating...");
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map((name) => {
      if (name !== cacheName) {
        console.log(`Service Worker: Deleting Cache: ${name}`);
        return caches.delete(name);
      }
    })
  );
  self.clients.claim();
  console.log("Service Worker: Activation Complete.");
});

// Fetch Event
self.addEventListener("fetch", (e) => {
  const request = e.request;

  // Only handle same-origin requests
  if (request.url.startsWith(self.location.origin)) {
    e.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request).catch(() => {
            if (request.mode === "navigate") {
              return caches.match("/fallback.html");
            }
          })
        );
      })
    );
  }
});