# 0005 - Client-Side Storage Strategy

## Status

Accepted

## Context

Users need to save and reload work without accounts or a server. Browser
storage must be private, local, and resilient enough for SVG documents.

## Decision

Use IndexedDB through `idb` for documents and lightweight `localStorage` for
UI preferences such as theme, zoom, and last selected tool.

## Consequences

- Documents remain on the user's device.
- The app works offline after the first load.
- Cross-device sync is explicitly not provided in v1.

## Alternatives Considered

- OPFS: useful later for large binary documents, but IndexedDB is simpler for
  JSON SVG documents in v1.
- Server storage: rejected by ADR 0001.
