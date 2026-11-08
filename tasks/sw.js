/* 任务面板 手机版 Service Worker
   只缓存外壳；数据在 IndexedDB，不经过 SW。更新部署时把 CACHE 版本 +1。 */
const CACHE = 'tp-mobile-v1';
const ASSETS = [
  './',
  './index.html',
  './mobile.css',
  './task-panel.css',
  './dshell.css',
  './task-panel.js',
  './manifest.webmanifest',
  './feishu-calendar.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
const BASE = self.location.href.slice(0, self.location.href.lastIndexOf('/') + 1);
const SHELL = BASE + 'index.html';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match(SHELL).then(function (cached) {
        return cached || fetch(req).catch(function () { return caches.match(SHELL); });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (resp) {
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE).then(function (cache) { cache.put(req, copy); }).catch(function () {});
        }
        return resp;
      }).catch(function () { return caches.match(req); });
    })
  );
});
