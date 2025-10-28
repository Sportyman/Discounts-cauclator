// A unique name for our cache. Changing this will trigger the 'activate' event.
const CACHE_NAME = 'discount-calculator-cache-v4';

// The list of all files and resources the app needs to function offline.
// This list is now exhaustive, including all theme images.
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo192.png',
  './logo512.png',
  // Critical 3rd-party resources
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Assistant:wght@400;700;800&family=Patrick+Hand&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  // Theme background images - THIS IS THE CRITICAL FIX
  'https://images.unsplash.com/photo-1587327901383-398579412147?q=80&w=1974&auto=format&fit=crop', // default (Aurora)
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop', // cartoon
  'https://images.unsplash.com/photo-1593435713507-b39675a3594e?q=80&w=1935&auto=format&fit=crop', // pencilSketch
  'https://images.unsplash.com/photo-1472552944129-b035e9ea3744?q=80&w=2070&auto=format&fit=crop', // night
  'https://images.unsplash.com/photo-1617994392138-d6b96f1a8d79?q=80&w=1974&auto=format&fit=crop', // sleek
  'https://images.unsplash.com/photo-1519790933221-399331e973e3?q=80&w=1974&auto=format&fit=crop', // retro
  'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop', // nature
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop', // energetic
  'https://images.unsplash.com/photo-1596722742799-522be58a264a?q=80&w=1964&auto=format&fit=crop', // kids
  'https://images.unsplash.com/photo-1535443274393-9c1d48005a87?q=80&w=2070&auto=format&fit=crop', // underwater
  'https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=2070&auto=format&fit=crop', // water
  'https://images.unsplash.com/photo-1536532184021-da5392b55da1?q=80&w=2070&auto=format&fit=crop', // deepSea
];

// The install event: opens the cache and adds all assets.
self.addEventListener('install', event => {
  console.log('[Service Worker] Install Event - Caching all assets...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell and all assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(error => {
          console.error('[Service Worker] Failed to cache assets during install:', error);
      })
  );
});

// The activate event: cleans up old caches.
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate Event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// The fetch event: uses a "Cache First" strategy.
self.addEventListener('fetch', event => {
  // We only cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For requests to unsplash, googleapis, gstatic, use CacheFirst
  if (event.request.url.includes('unsplash.com') || event.request.url.includes('googleapis.com') || event.request.url.includes('gstatic.com') || event.request.url.includes('cdn.tailwindcss.com')) {
     event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                // If we have a response in cache, serve it.
                if (response) {
                    return response;
                }
                // Otherwise, fetch from network, cache it, and return it.
                return fetch(event.request).then(networkResponse => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
    return;
  }

  // For app's own assets, also use cache first
  event.respondWith(
    caches.match(event.request).then(response => {
      // If we have a response in cache, serve it.
      if (response) {
        return response;
      }
      // Otherwise, fetch from network.
      return fetch(event.request);
    })
  );
});
