/**
 * Multi Tube Views — Service Worker
 * Offline static asset cache with explicit exclusion for all dynamic /api/* routes.
 */

const CACHE_NAME = 'mtv-v2.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/ai-prompt.html',
  '/articles.html',
  '/platforms.html',
  '/settings.html',
  '/about.html',
  '/contact.html',
  '/credits.html',
  '/disclaimer.html',
  '/privacy.html',
  '/terms.html',
  '/assets/css/style.css',
  '/assets/css/components.css',
  '/assets/css/responsive.css',
  '/assets/css/growth.css',
  '/assets/js/mtv-ai-sdk.js',
  '/assets/js/app.js',
  '/assets/js/growth-engine.js',
  '/assets/js/platform-engine.js',
  '/assets/js/navigation.js',
  '/assets/js/theme.js',
  '/assets/js/validators.js',
  '/assets/icons/favicon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // CRITICAL: Never cache dynamic API routes
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Stale-while-revalidate for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
