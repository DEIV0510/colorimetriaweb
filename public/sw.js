// Service worker mínimo: solo cachea páginas informativas para consulta sin conexión.
// El análisis NO se cachea: requiere el modelo de MediaPipe y debe fallar de forma visible.
const CACHE_NAME = "coloria-static-v1";
const INFO_ROUTES = ["/", "/privacidad", "/terminos", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(INFO_ROUTES)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Nunca servir desde caché los assets del análisis.
  if (url.pathname.startsWith("/models/") || url.pathname.startsWith("/mediapipe/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Sin comprobar response.ok, un 502/503 durante un despliegue quedaría
          // cacheado y se seguiría sirviendo como si fuera la página real.
          if (response.ok && INFO_ROUTES.includes(url.pathname)) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached ?? caches.match("/offline");
        })
    );
  }
});
