var cacheName = "store";
var cacheFiles = [
    "index.html",
    "products.js",
    "script.js",
    "store.webmanifest",
    "style.css",
    "package-lock.json",
    "package.json",

    "images/english.png",
    "images/french.png",
    "images/geography.png",
    "images/gymnastics.png",
    "images/it.png",
    "images/italian.png",
    "images/maths.png",
    "images/media studies.png",
    "images/music.png",
    "images/sports.png",

    "store-icon_32.png",
    "store-icon_512.png"
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all the files');
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        // check if the cache has the file
        caches.match(e.request).then((r) => {
            //Download the file if it is not in the cache
            return r || fetch(e.request).then((response) => {
                return caches.open(cacheName).then((cache) => {
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});