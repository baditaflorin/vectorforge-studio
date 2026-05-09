# 0070 - Documentation Reality Alignment Process

## Status

Accepted

## Context

Phase 3 treats docs drift as a product bug.

## Decision

README features must map to tests or documented limitations. When a feature is
cut, README and in-app labels change in the same commit. Phase postmortems must
answer whether a stranger can use the app end-to-end.

## Consequences

No README claim ships without recent verification.

## Alternatives Considered

- Keep aspirational README copy: rejected because it harms first-time users.
