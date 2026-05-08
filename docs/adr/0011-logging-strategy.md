# 0011 - Logging Strategy

## Status

Accepted

## Context

There is no server. Production browser logging should be quiet unless a user
needs actionable diagnostics.

## Decision

Use a small client logger that suppresses debug output in production and allows
errors to surface through visible toasts or error boundaries.

## Consequences

- No PII is logged.
- The production console stays quiet for expected flows.
- Unexpected errors are visible to users without requiring devtools.

## Alternatives Considered

- Remote logging: rejected because no analytics or server collection is planned
  for v1.
