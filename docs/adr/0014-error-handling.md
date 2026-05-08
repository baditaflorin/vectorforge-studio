# 0014 - Error Handling Conventions

## Status

Accepted

## Context

Import, export, storage, and browser capability failures need clear user-facing
feedback without crashing the editor.

## Decision

Use typed result objects for expected failures, zod validation for persisted
documents, React error boundaries for unexpected render failures, and a global
toast region for actionable messages.

## Consequences

- Import/storage errors can be tested as data.
- Users receive clear recovery paths.
- Production console noise stays low.

## Alternatives Considered

- Throwing exceptions through React state handlers: rejected because it makes
  recoverable failures feel fatal.
