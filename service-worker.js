
const CACHE_NAME = 'discount-calculator-v1';
const urlsToCache = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './manifest.json',
  // You would add other assets here like your main JS bundle, CSS files, etc.
  // For now, these are the essentials for the current setup.
  // Note: External resources like Google Fonts or TailwindCSS CDN are not cached by this basic setup.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
