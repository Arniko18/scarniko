/* ============================================================
   SCARNIKO · SERVICE WORKER
   Estrategia:
   - Activos estáticos propios → cache-first (offline-ready)
   - Google Fonts              → stale-while-revalidate
   - /api/* y Supabase         → network-only (nunca cacheados)
   - Peticiones no-GET         → network-only
   ============================================================ */

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `scarniko-static-${CACHE_VERSION}`;
const FONTS_CACHE  = 'scarniko-fonts';

const STATIC_ASSETS = [
  '/',
  '/app',
  '/index.html',
  '/landing.html',
  '/styles.css',
  '/app.js',
  '/data.js',
  '/viz.js',
  '/favicon.svg',
  '/manifest.json',
  '/politica-privacidad.html',
  '/terminos.html',
];

// Orígenes y rutas que nunca se cachean — dinámicos o con auth
const BYPASS_ORIGINS = [
  'https://fklsetwqfdmangromprj.supabase.co',
  'https://cdn.jsdelivr.net',
];
const BYPASS_PATHS = ['/api/'];

// ── Install: pre-cache activos estáticos ─────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: limpiar caches antiguas ────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k.startsWith('scarniko-static-') && k !== STATIC_CACHE)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: intercepción selectiva ─────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Nunca interceptar peticiones no-GET
  if (request.method !== 'GET') return;

  // Nunca interceptar: /api/*, Supabase, jsDelivr
  if (
    BYPASS_PATHS.some(p => url.pathname.startsWith(p)) ||
    BYPASS_ORIGINS.some(o => request.url.startsWith(o))
  ) return;

  // Google Fonts → stale-while-revalidate
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(staleWhileRevalidate(request, FONTS_CACHE));
    return;
  }

  // Solo activos del mismo origen (evitar opaque responses)
  if (url.origin !== self.location.origin) return;

  // Activos propios → cache-first con fallback a red
  event.respondWith(cacheFirst(request));
});

// ── Helpers ───────────────────────────────────────────────────
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    // Solo cachear respuestas same-origin válidas
    if (res.ok && res.type === 'basic') {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    // Sin red y sin caché: devolver index.html (SPA fallback)
    return caches.match('/index.html');
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fresh = fetch(request).then(res => {
    if (res.ok) cache.put(request, res.clone());
    return res;
  }).catch(() => cached);
  return cached || fresh;
}
