import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./shared/ErrorBoundary.tsx";
import { registerServiceWorker } from "./serviceWorkerRegistration.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 30,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
