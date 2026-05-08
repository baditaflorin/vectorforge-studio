# 0004 - Static Data Contract

## Status

Accepted

## Context

Mode A has no data-generation backend. Static data is limited to app metadata,
PWA metadata, and optional demo documents committed in the repository.

## Decision

Use static JSON and embedded build constants only:

- `manifest.webmanifest` for PWA metadata.
- build constants for app version and build commit fallback.
- public GitHub API fetches for live repo and latest commit metadata.

No committed domain data contract is needed for v1 beyond versioned document
schema objects saved in browser storage.

## Consequences

- The frontend does not depend on a hosted database or artifact release.
- Stored user documents include a `schemaVersion` field.
- Any future breaking document schema change must include migration code.

## Alternatives Considered

- Mode B JSON artifacts: rejected because there is no shared dataset.
- Runtime API contract: rejected by ADR 0001.
