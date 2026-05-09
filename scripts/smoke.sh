#!/usr/bin/env bash
set -euo pipefail

mkdir -p tmp
npm run build

rm -rf tmp/pages
mkdir -p tmp/pages
cp -R docs tmp/pages/vectorforge-studio

PORT_FILE=tmp/smoke-port
rm -f "$PORT_FILE"
SMOKE_PORT_FILE="$PORT_FILE" node scripts/static-pages-server.mjs tmp/pages >tmp/smoke-server.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT

for _ in {1..30}; do
  if [[ -s "$PORT_FILE" ]]; then
    break
  fi
  sleep 0.3
done

PORT="$(cat "$PORT_FILE")"
SMOKE_BASE_URL="http://127.0.0.1:${PORT}" npx playwright test --config=playwright.config.ts
