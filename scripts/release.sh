#!/usr/bin/env bash
set -euo pipefail

VERSION=$(node -p "require('./package.json').version")
TAG="v${VERSION}"

make lint
make test
make build
make smoke

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Tag $TAG already exists."
  exit 1
fi

git tag "$TAG"
git push origin main "$TAG"
