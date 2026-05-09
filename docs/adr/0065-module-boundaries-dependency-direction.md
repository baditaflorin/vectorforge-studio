# 0065 - Module Boundaries And Dependency Direction

## Status

Accepted

## Context

The project needs clearer boundaries as completeness paths grow.

## Decision

Dependency direction is:

`editor UI -> application features -> vector/project domain -> shared primitives`

Domain modules must not import React components. Boundary modules may touch
browser APIs. Pure vector/project modules remain testable without the DOM.

## Consequences

Import/export/storage code can be tested without rendering the editor.

## Alternatives Considered

- Enforce with a new lint plugin: deferred; structure and tests are enough for
  this small codebase.
