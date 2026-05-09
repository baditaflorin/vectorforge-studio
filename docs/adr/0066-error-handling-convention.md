# 0066 - Error Handling Convention

## Status

Accepted

## Context

Boundary operations had scattered `try/catch` and generic notices.

## Decision

Use a `Result<T>` shape for import/export/storage boundaries:

- `{ ok: true, value }`
- `{ ok: false, message }`

UI translates failures into visible notices. Pure domain functions may still
throw for programming errors, but external data must return a controlled
failure.

## Consequences

Unexpected browser failures do not crash the editor, and user-facing messages
stay consistent.

## Alternatives Considered

- Throw from all helpers and catch in `EditorApp`: rejected because message
  quality varied.
