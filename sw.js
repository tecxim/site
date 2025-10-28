const CACHE_NAME = "quiz-biblico-v1";
const FILES_TO_CACHE = [
  "/site/bibliaquiz.html",
  "/site/manifest.json",
  "/site/imagens/bible-icon-192.png",
  "/site/imagens/bible-icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request)
      .then((res) => res || fetch(e.request))
  );
});
