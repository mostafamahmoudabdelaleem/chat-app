const CACHE_NAME = "v1.0.1";
const urlsToCache = [ 
    "index.html", 
    "chat.html", 
    "offline.html", 
    "./static/img/wifi-off.png", 
    "./static/img/logo.png",
    "serviceworker.js"
];

const self = this;

// Install ServiceWorker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache Opened.');
                return cache.addAll(urlsToCache);
            })
    )
});

//Listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request)
                    .catch(() => caches.match('offline.html'))
            })
    )
});

//Activate the ServiceWorker
self.addEventListener('activate', (event) => {
    const cacheWhiteList = [];
    cacheWhiteList.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheNames.includes(cacheName)){
                    return caches.delete(cacheName);
                }
            })
        ))
    )

});
