// Wait until the whole page has loaded before running this code
window.onload = () => {
  "use strict"; // Enable strict mode to catch common JavaScript mistakes

  // Check if the browser supports Service Workers
  if ("serviceWorker" in navigator) {

    // Attempt to register the Service Worker
    navigator.serviceWorker
      .register("./service-worker.js") // Path to your service worker file
      .then((registration) => {
        // This runs if registration succeeds
        // registration.scope shows which pages the service worker controls
        console.log(
          "Service Worker registered successfully with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        // This runs if registration fails
        console.error("Service Worker registration failed:", error);
      });

  } else {
    // Browser does not support Service Workers
    console.warn("Service Worker is not supported in this browser.");
  }
};