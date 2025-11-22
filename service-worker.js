var cacheName = "MyPWA";
var filesToCache = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/main.js",
  "/images/appicon-128x128.png",
  "/images/appicon-256x256.png",
  "/images/appicon-512x512.png",
  "/images/appicon-1024x1024.png",
  "/fallback.html",
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
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle requests from the same origin
  if (request.url.startsWith(self.location.origin)) {

    // Network-first for HTML pages
    if (request.headers.get('accept')?.includes('text/html')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(cacheName).then((cache) => cache.put(request, clone));
            return response;
          })
          .catch(() => caches.match(request).then(r => r || caches.match('/fallback.html')))
      );
      return;
    }

    // Cache-first for CSS, JS, Images
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});

