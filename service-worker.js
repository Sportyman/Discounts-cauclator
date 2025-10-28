// A unique name for our cache. Changing this will trigger the 'activate' event.
const CACHE_NAME = 'discount-calculator-v2';

// The list of all files and resources the app needs to function offline.
const PRECACHE_ASSETS = [
  './', // Alias for index.html
  './index.html',
  './manifest.json',
  './logo192.png',
  './logo512.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Assistant:wght@400;700;800&family=Patrick+Hand&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
];

// The install event is fired when the service worker is first installed.
self.addEventListener('install', event => {
  console.log('[SW] Install event!');
  // We wait until the assets are cached before finishing installation.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching pre-cache assets');
        // Use addAll to fetch and cache all the assets in the list.
        // Using a new Request with reload option to bypass browser HTTP cache.
        const requests = PRECACHE_ASSETS.map(url => new Request(url, { cache: 'reload' }));
        return cache.addAll(requests);
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
  console.log('[SW] Activate event!');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If a cache's name is not our current cache name, delete it.
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
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
  const { request } = event;

  // We only care about GET requests.
  if (request.method !== 'GET') {
    return;
  }
  
  // Use a "Stale-While-Revalidate" strategy.
  // This strategy will respond with a cached version if available (stale),
  // and then fetch a fresh version from the network in the background to update the cache for the next time.
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(request).then(cachedResponse => {
        // Fetch the resource from the network.
        const fetchPromise = fetch(request).then(networkResponse => {
          // If we get a valid response, we clone it and update the cache.
          // This handles caching for dynamically loaded resources like fonts from Google's CSS.
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        });

        // Return the cached response immediately if it exists,
        // otherwise, wait for the network response.
        // This makes the app feel fast and work offline.
        return cachedResponse || fetchPromise;
      });
    })
  );
});
