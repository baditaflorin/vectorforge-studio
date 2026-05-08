import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { execSync } from "node:child_process";

const appVersion = process.env.npm_package_version ?? "0.1.0";
const gitCommit =
  process.env.VITE_GIT_COMMIT ??
  (() => {
    try {
      return execSync("git rev-parse --short HEAD", {
        stdio: ["ignore", "pipe", "ignore"],
      })
        .toString()
        .trim();
    } catch {
      return "dev";
    }
  })();

// https://vite.dev/config/
export default defineConfig({
  base: "/vectorforge-studio/",
  build: {
    emptyOutDir: false,
    outDir: "docs",
  },
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
    __GIT_COMMIT__: JSON.stringify(gitCommit),
  },
  plugins: [react(), tailwindcss()],
});
