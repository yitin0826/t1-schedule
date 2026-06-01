const CACHE_NAME = 't1-schedule-v1';
const ASSETS = [
  '/t1-schedule/',
  '/t1-schedule/index.html',
  '/t1-schedule/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // events.json 和 API 永遠從網路抓最新的
  if (e.request.url.includes('events.json') || e.request.url.includes('esports-api')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
});
