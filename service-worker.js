const CACHE="summer-challenger-v3";
const ASSETS=[
  "./","./index.html","./style.css","./app.js","./manifest.webmanifest",
  "./images/cover.png","./images/map.png","./images/q-stage.png",
  "./images/skydeck.png","./images/kirarinko.png","./images/pizzala.png",
  "./images/fujisoba.png","./images/karinto.png","./images/sticker.png",
  "./icons/icon-192.png","./icons/icon-512.png"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>e.respondWith(
  caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    const copy=res.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy));
    return res;
  }))
));
