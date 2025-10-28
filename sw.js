self.addEventListener('install', event => {
  console.log('Service Worker instalado');
});

self.addEventListener('fetch', event => {
  // Permite o site funcionar offline futuramente
  event.respondWith(fetch(event.request).catch(() => new Response('Você está offline.')));
});
