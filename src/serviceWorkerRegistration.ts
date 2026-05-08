export function registerServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/vectorforge-studio/sw.js", { scope: "/vectorforge-studio/" })
      .catch(() => {
        // The app remains usable if offline caching is unavailable.
      });
  });
}
