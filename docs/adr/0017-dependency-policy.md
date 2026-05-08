# 0017 - Dependency Policy

## Status

Accepted

## Context

The editor should avoid custom implementations where stable browser libraries
already exist, while still keeping the initial payload small.

## Decision

Use production-ready dependencies with clear purpose:

- Vite, React, TypeScript, Tailwind CSS for frontend delivery.
- zod for document validation.
- idb for IndexedDB.
- TanStack Query for public metadata fetching.
- comlink for worker boundaries.
- lucide-react for icons.
- colorthief for lazy palette extraction.
- Vitest and Playwright for tests.

Before adding any new production dependency, document why browser APIs or an
existing dependency are insufficient.

## Consequences

- The dependency graph stays explainable.
- Heavy libraries must be lazy-loaded or justified.
- `npm audit` is part of release verification.

## Alternatives Considered

- Build all geometry and storage utilities by hand: rejected because it
  increases maintenance risk.
