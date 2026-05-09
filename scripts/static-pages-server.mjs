import { createServer } from "node:http";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "docs");
const portFile = process.env.SMOKE_PORT_FILE;

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
]);

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405);
    response.end("Method not allowed");
    return;
  }

  try {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    const requestedPath = decodeURIComponent(requestUrl.pathname);
    const filePath = await resolveFilePath(requestedPath);
    const body = await readFile(filePath);
    response.writeHead(200, {
      "content-type":
        mimeTypes.get(path.extname(filePath)) ?? "application/octet-stream",
    });
    if (request.method === "GET") {
      response.end(body);
    } else {
      response.end();
    }
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(0, "127.0.0.1", async () => {
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not start static server.");
  }
  if (portFile) {
    await writeFile(portFile, String(address.port));
  }
  console.log(`Accepting connections at http://127.0.0.1:${address.port}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));

async function resolveFilePath(requestedPath) {
  const normalized = path
    .normalize(requestedPath)
    .replace(/^(\.\.(\/|\\|$))+/, "");
  let candidate = path.join(root, normalized);
  const candidateStats = await stat(candidate).catch(() => null);
  if (candidateStats?.isDirectory()) {
    candidate = path.join(candidate, "index.html");
  }
  const resolved = path.resolve(candidate);
  if (!resolved.startsWith(root)) {
    throw new Error("Path escapes root.");
  }
  return resolved;
}
