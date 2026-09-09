const CACHE="summer-challenger-v6";
const ASSETS=[
  "./","./index.html","./style.css","./app.js","./manifest.webmanifest",
  "./images/cover.png","./images/map.png","./images/q-stage.png",
  "./images/skydeck.png","./images/kirarinko.png","./images/pizzala.png",
  "./images/fujisoba.png","./images/karinto.png","./images/sticker.png",
  "./icons/icon-192.png","./icons/icon-512.png"
];

self.addEventListener("install", e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
));

self.addEventListener("activate", e => e.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  const appFile = /\.(html|css|js|webmanifest)$/.test(url.pathname) || url.pathname.endsWith("/");

  if (appFile) {
    // Online: always prefer the latest version. Offline: fall back to cache.
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
  } else {
    // Images and other static assets: cache first, then network.
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }))
    );
  }
});
