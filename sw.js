const CACHE_NAME = "quiz-biblico-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/imagens/icon-192.png",
  "/imagens/icon-512.png"
];

// Instala o Service Worker e faz cache dos arquivos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Ativa o Service Worker e limpa caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Intercepta requisições e responde com cache (modo offline)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
