const cacheName = 'MyPwa';
const filesToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/images/appicon-1024x1024.png',
  '/fallback.html' // Make sure to create this page
];

// Install Event - precache files
self.addEventListener('install', (e) => {
  console.log('Service Worker: Installing...');
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - clean up old caches
self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activating...');
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== cacheName) {
            console.log(`Service Worker: Deleting old cache ${name}`);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - respond with cache first, then network, with fallback
self.addEventListener('fetch', (e) => {
  const request = e.request;

  // Only handle same-origin requests
  if (request.url.startsWith(self.location.origin)) {
    e.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).catch(() => {
          // If request is navigation, serve fallback page
          if (request.mode === 'navigate') {
            return caches.match('/fallback.html');
          }
        });
      })
    );
  }
});
