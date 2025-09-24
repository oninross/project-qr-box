// Check if we're on localhost
const isLocalhost =
  self.location.hostname === "localhost" ||
  self.location.hostname === "127.0.0.1" ||
  self.location.hostname.startsWith("192.168.");

if (isLocalhost) {
  console.log("Service Worker: Disabled on localhost");

  // Don't install or activate on localhost
  self.addEventListener("install", (event) => {
    console.log("Service Worker: Install skipped on localhost");
    // Don't call skipWaiting() on localhost
  });

  self.addEventListener("activate", (event) => {
    console.log("Service Worker: Activate skipped on localhost");
    // Don't claim clients on localhost
  });

  self.addEventListener("fetch", (event) => {
    // Just pass through all requests on localhost without caching
    return;
  });
} else {
  // Production behavior
  self.addEventListener("install", () => {
    self.skipWaiting();
  });

  self.addEventListener("activate", () => {
    self.clients.claim();
  });

  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
}
