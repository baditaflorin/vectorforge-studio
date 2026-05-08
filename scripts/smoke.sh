#!/usr/bin/env bash
set -euo pipefail

mkdir -p tmp
npm run build

rm -rf tmp/pages
mkdir -p tmp/pages
cp -R docs tmp/pages/vectorforge-studio

npx serve tmp/pages --listen 4873 >tmp/smoke-server.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT

for _ in {1..30}; do
  if curl -fsS http://127.0.0.1:4873/vectorforge-studio/ >/dev/null 2>&1; then
    break
  fi
  sleep 0.3
done

SMOKE_BASE_URL=http://127.0.0.1:4873 npx playwright test --config=playwright.config.ts
