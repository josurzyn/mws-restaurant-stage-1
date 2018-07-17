/* Set up initial cache */

var staticCacheName = 'restaurant-reviews-static-v3';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/index.html',
        '/restaurant.html',
        '/css/styles.css',
        '/data/restaurants.json',
        '/img/1.jpg',
        '/img/2.jpg',
        '/img/3.jpg',
        '/img/4.jpg',
        '/img/5.jpg',
        '/img/6.jpg',
        '/img/7.jpg',
        '/img/8.jpg',
        '/img/9.jpg',
        '/img/10.jpg',
        '/js/main.js',
        '/js/dbhelper.js',
        '/js/restaurant_info.js'
      ]);
    })
  );
});

/* Delete old cache and replace on activation of new SW */

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant-reviews-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/* Serve pages from cache if available
 * Ensure restaurant detail page is served regardless of ?id in url
*/

self.addEventListener('fetch', event => {
  let requestURL = event.request.url;

  if (requestURL.origin === location.origin) {
    if (requestURL.pathname.startsWith('restaurant.html')) {
      event.respondWith(caches.match('restaurant.html'));
      return;
      }
    }

  event.respondWith(
    caches.match(event.request).then( response => {
      return response || fetch(event.request);
    })
  );
});

/* Cache maps when visited */
