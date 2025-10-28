// A unique name for our cache. Changing this will trigger the 'activate' event.
const CACHE_NAME = 'discount-calculator-cache-v3';

// The list of all files and resources the app needs to function offline.
const PRECACHE_ASSETS = [
  './', // This is the alias for index.html, the app shell.
  './index.html', // Explicitly cache index.html.
  './manifest.json',
  './logo192.png',
  './logo512.png',
  // Critical 3rd-party resources needed for the app to render correctly offline.
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Assistant:wght@400;700;800&family=Patrick+Hand&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
];

// The install event is fired when the service worker is first installed.
self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  // We wait until the assets are cached before finishing installation.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching offline page');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker.
        return self.skipWaiting();
      })
  );
});

// The activate event is fired when the service worker becomes active.
// It's a good place to clean up old caches.
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If a cache's name is not in our whitelist, delete it.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        // Tell the active service worker to take control of the page immediately.
        return self.clients.claim();
    })
  );
});

// The fetch event is fired for every network request the page makes.
self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  // Use a "Stale-While-Revalidate" strategy for all requests.
  // This will respond with a cached version if available (stale),
  // and then fetch a fresh version from the network in the background to update the cache for the next time.
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // If we get a valid response, we clone it and update the cache.
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });

        // Return the cached response immediately if it exists,
        // otherwise, wait for the network response.
        // This makes the app feel fast and work offline.
        return response || fetchPromise;
      });
    })
  );
});
