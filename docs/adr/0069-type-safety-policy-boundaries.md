# 0069 - Type Safety Policy At Boundaries

## Status

Accepted

## Context

External JSON, SVG text, clipboard data, and browser files are untrusted.

## Decision

Validate external structured data with zod before using it. Use `unknown` at
JSON boundaries until narrowed. Avoid `any`, `@ts-ignore`, and broad unsafe
casts. DOM casts are allowed only at local browser API seams with immediate
checks.

## Consequences

Project imports fail with actionable messages instead of corrupting editor
state.

## Alternatives Considered

- Trust project JSON created by the app: rejected because files can be edited or
  stale.
