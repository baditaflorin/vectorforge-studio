# 0003 - Frontend Framework And Build Tooling

## Status

Accepted

## Context

The app needs strict TypeScript, a fast dev loop, hashed production assets, and
GitHub Pages base path support.

## Decision

Use React, TypeScript strict mode, Vite, Tailwind CSS, TanStack Query, zod,
idb, comlink, lucide-react, Vitest, and Playwright.

## Consequences

- Vite builds directly into `docs/` for GitHub Pages.
- React gives predictable state and component boundaries.
- Tailwind keeps app styling local without a separate design system.
- TanStack Query caches public repository metadata.

## Alternatives Considered

- Vanilla TypeScript: rejected because editor state and panel composition will
  grow quickly.
- Next.js/Astro: rejected because v1 does not need SSR or server adapters.
