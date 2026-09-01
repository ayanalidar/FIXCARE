/**
 * FixCare Service Center — Service Worker
 * Advanced PWA service worker with multi-tier caching strategy.
 *
 * Caching strategies:
 *  - App shell (HTML navigation):   network-first with cache fallback (fresh content, offline-capable)
 *  - Static assets (CSS, JS, fonts): stale-while-revalidate (instant + updates in background)
 *  - Images:                         cache-first (cache forever, fall back to network)
 *  - API GET (pincode):              network-first, 5-min cache fallback
 *  - API POST (bookings):            network-only (never cache)
 *  - External resources (gstatic, maps): network-only
 *
 * Update flow:
 *  - SW change triggers `install` → `activate` with `skipWaiting()` + `clients.claim()`
 *  - User sees update notification (or silent refresh on next navigation)
 */

const CACHE_VERSION = "fixcare-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMG_CACHE = `${CACHE_VERSION}-img`;
const API_CACHE = `${CACHE_VERSION}-api`;
const OFFLINE_URL = "/offline";

// Pre-cache the app shell so the site works offline on first load
const APP_SHELL = [
  "/",
  "/offline",
  "/book-repair",
  "/services",
  "/locations",
  "/about",
  "/contact",
  "/faq",
  "/reviews",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/icons/favicon.ico",
];

// ─── INSTALL ─────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      // Cache shell in parallel; ignore individual failures
      await Promise.allSettled(
        APP_SHELL.map((url) =>
          cache.add(new Request(url, { cache: "reload" }))
        )
      );
      // Force activation immediately so the new SW takes over without waiting
      self.skipWaiting();
    })()
  );
});

// ─── ACTIVATE ────────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      );
      // Take control of all clients immediately
      await self.clients.claim();
      // Tell all open tabs to refresh
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) =>
        client.postMessage({ type: "SW_ACTIVATED", version: CACHE_VERSION })
      );
    })()
  );
});

// ─── FETCH ──────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests; let POST/PUT/etc pass through to network
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip cross-origin requests (gstatic, googleapis, maps, analytics)
  if (url.origin !== self.location.origin) return;

  // Skip Next.js dev internals (HMR, dev-only chunks)
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;

  // Skip API POST — never cache form submissions (handled by method check above)

  // ─── Strategy: API GET requests (pincode checker) ───────────────
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstWithCache(request, API_CACHE, 5 * 60));
    return;
  }

  // ─── Strategy: Images ───────────────────────────────────────────
  if (/\.(png|jpg|jpeg|gif|webp|svg|ico)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request, IMG_CACHE));
    return;
  }

  // ─── Strategy: Static assets (CSS, JS, fonts) ───────────────────
  if (
    url.pathname.startsWith("/_next/static/") ||
    /\.(css|js|woff2?|ttf|eot)$/.test(url.pathname)
  ) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // ─── Strategy: HTML navigation (app shell) ───────────────────────
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // ─── Strategy: Everything else — try cache, fall back to network ──
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).catch(() => cached))
  );
});

// ─── Caching helpers ────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // No cached, no network → return a tiny transparent fallback for images
    return new Response("", { status: 504, statusText: "Offline" });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok && response.type === "basic") {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);
  // Return cached immediately if available, else wait for network
  return cached || networkPromise || new Response("", { status: 504 });
}

async function networkFirstWithCache(request, cacheName, maxAgeSeconds) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) {
      // Check age
      const dateHeader = cached.headers.get("date");
      if (dateHeader) {
        const age = (Date.now() - new Date(dateHeader).getTime()) / 1000;
        if (age > maxAgeSeconds) {
          return new Response(
            JSON.stringify({ served: false, stale: true, message: "Offline — please retry" }),
            { status: 503, headers: { "Content-Type": "application/json" } }
          );
        }
      }
      return cached;
    }
    return new Response(
      JSON.stringify({ served: false, error: "Offline" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function networkFirstWithOfflineFallback(request) {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Try to serve from cache
    const cached = await cache.match(request);
    if (cached) return cached;
    // Try the homepage as a fallback shell
    const home = await cache.match("/");
    if (home) return home;
    // Final fallback: the offline page
    const offline = await cache.match(OFFLINE_URL);
    if (offline) return offline;
    return new Response(
      `<!DOCTYPE html><html><head><title>Offline — FixCare Service Center</title>
       <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
       <style>body{font-family:system-ui;background:#FAFAF7;color:#0F2540;text-align:center;padding:60px 20px;}
       h1{font-size:24px;}p{color:#4a5560;}a{color:#0E7C66;}</style></head>
       <body><h1>You're offline</h1><p>Please check your internet connection and try again.</p>
       <p>Need help? Call us at <a href="tel:+917051587802">+91-70515-87802</a> or WhatsApp <a href="https://wa.me/917051587802">917051587802</a>.</p>
       <p><a href="/">Try again</a></p></body></html>`,
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}

// ─── MESSAGE handler (for skipWaiting + get version) ────────────────────────
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data?.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});
