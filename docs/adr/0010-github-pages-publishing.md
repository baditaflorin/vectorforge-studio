# 0010 - GitHub Pages Publishing Strategy

## Status

Accepted

## Context

The live GitHub Pages URL is a first-class deliverable from the first commit.
The repo also needs project documentation under `docs/`.

## Decision

Publish GitHub Pages from `main` branch `/docs`.

Vite builds the app into `docs/` with:

- `base: "/vectorforge-studio/"`
- hashed asset filenames
- `emptyOutDir: false` so ADRs and project docs survive frontend builds
- `404.html` copied from `index.html` for SPA fallback

The live URL is:

https://baditaflorin.github.io/vectorforge-studio/

No custom domain is configured in v1.

## Consequences

- `docs/` is intentionally committed and is not gitignored.
- Source docs and built app assets coexist under the Pages directory.
- Rollback is a normal git revert of the publishing commit.

## Alternatives Considered

- `gh-pages` branch: rejected because it makes source docs and built output
  harder to review together.
- Main branch root: rejected because source files would be exposed as the site.
