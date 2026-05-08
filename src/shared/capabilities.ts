export type BrowserCapabilities = {
  indexedDb: boolean;
  webGpu: boolean;
  serviceWorker: boolean;
  fileSystemAccess: boolean;
};

export function detectCapabilities(): BrowserCapabilities {
  return {
    indexedDb: typeof indexedDB !== "undefined",
    webGpu: typeof navigator !== "undefined" && "gpu" in navigator,
    serviceWorker:
      typeof navigator !== "undefined" && "serviceWorker" in navigator,
    fileSystemAccess:
      typeof window !== "undefined" && "showSaveFilePicker" in window,
  };
}
