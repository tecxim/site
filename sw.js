const CACHE_NAME = "quiz-biblico-v1";
const FILES_TO_CACHE = [
  "/quiz.html",
  "/manifest.json",
  "/imagens/icon-192.png",
  "/imagens/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
