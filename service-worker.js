
const STATIC_CACHE_NAME = 'discount-calculator-static-v8'; // Cache for app shell and critical assets
const DYNAMIC_CACHE_NAME = 'discount-calculator-dynamic-v8'; // Cache for dynamic content like images and fonts

// All the assets that are part of the app shell and are critical for the first load.
const APP_SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo192.png',
  './logo512.png',
  'https://cdn.tailwindcss.com', // Tailwind CSS
  'https://fonts.googleapis.com/css2?family=Assistant:wght@400;700;800&family=Patrick+Hand&display=swap', // Google Fonts CSS
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' // Google Fonts CSS
];

// Install: Open cache and add all shell assets.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Pre-caching App Shell and critical assets.');
        // Use {cache: 'reload'} to bypass browser cache for these critical assets during install.
        const requests = APP_SHELL_ASSETS.map(url => new Request(url, {cache: 'reload'}));
        return cache.addAll(requests);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheKeys => {
      return Promise.all(cacheKeys.map(key => {
        // Delete all caches that are not the current static or dynamic cache
        if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
          console.log('[SW] Removing old cache:', key);
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

// Stale-While-Revalidate strategy function
const staleWhileRevalidate = (request, cacheName = DYNAMIC_CACHE_NAME) => {
    return caches.open(cacheName).then(cache => {
        return cache.match(request).then(cachedResponse => {
            const fetchPromise = fetch(request).then(networkResponse => {
                // If the fetch is successful, clone it and put it in the dynamic cache
                cache.put(request, networkResponse.clone());
                return networkResponse;
            }).catch(err => {
                // If fetch fails and there's no cached response, the request will fail.
                // This is expected for optional assets like images when offline.
                console.warn(`[SW] Fetch failed for ${request.url}:`, err);
            });
            // Return cached response immediately if available, otherwise wait for the network
            return cachedResponse || fetchPromise;
        });
    });
};


// Fetch: Implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;

  // Ignore non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  const url = new URL(request.url);

  // Strategy 1: For pre-cached app shell assets, use Cache-first.
  if (APP_SHELL_ASSETS.some(assetUrl => request.url.endsWith(new URL(assetUrl, self.location.origin).pathname))) {
      event.respondWith(
          caches.match(request, { cacheName: STATIC_CACHE_NAME }).then(response => {
              return response || fetch(request);
          })
      );
      return;
  }

  // Strategy 2: For dynamic assets (fonts, images), use Stale-While-Revalidate.
  if (url.hostname === 'fonts.gstatic.com' || url.hostname === 'images.unsplash.com') {
      event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
      return;
  }
  
  // Strategy 3: For local files not in the app shell (if any), use cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then(networkResponse => {
            return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                cache.put(request, networkResponse.clone());
                return networkResponse;
            });
        });
      })
    );
    return;
  }

  // Default: just fetch from network for any other requests.
  event.respondWith(fetch(request));
});
