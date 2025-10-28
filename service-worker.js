const CACHE_NAME = 'discount-calculator-v6-stable';
// Corrected paths to be relative and removed the .tsx file.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo192.png',
  './logo512.png'
];

// Install: Open cache and add all shell assets.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache. Caching app shell.');
        // Use {cache: 'reload'} to bypass browser cache and get latest from network.
        const requests = urlsToCache.map(url => new Request(url, {cache: 'reload'}));
        return cache.addAll(requests);
      })
      .then(() => self.skipWaiting()) // Activate new service worker immediately
  );
});

// Activate: Clean up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all open clients
  );
});

// Fetch: Serve from cache first, then network (Cache-first for app shell).
self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For all requests to our own origin, use a cache-first strategy.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(CACHE_NAME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the cache for future requests.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
