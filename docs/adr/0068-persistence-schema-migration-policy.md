# 0068 - Persistence Schema And Migration Policy

## Status

Accepted

## Context

The app saved raw vector documents but lacked a complete project-state format.

## Decision

Add a versioned `VectorForgeProjectFile` schema:

- `schemaVersion: 1`
- vector document
- palette
- settings
- exported metadata

IndexedDB keeps storing documents for quick local saves. Project files are the
portable complete state. Future schema changes require a migration function and
tests.

## Consequences

Users can move projects across browsers/devices without a backend.

## Alternatives Considered

- Store everything only in IndexedDB: rejected because it is not portable.
