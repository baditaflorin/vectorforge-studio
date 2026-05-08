# 0002 - Architecture Overview

## Status

Accepted

## Context

The editor needs a clean boundary between user interface, vector document
state, persistence, import/export, and optional browser capabilities.

## Decision

Use a static React app with feature-oriented modules:

- `features/editor`: editor shell, toolbar, viewport, inspector, and status UI.
- `features/vector`: immutable vector document model, geometry helpers, SVG IO.
- `features/storage`: IndexedDB/localStorage persistence.
- `features/palette`: lazy palette extraction from imported raster images.
- `features/repository`: public GitHub metadata used by the footer/status bar.
- `shared`: UI primitives, error handling, and browser capability detection.

The vector document model is the source of truth. SVG DOM output is rendered
from that model, not manually mutated as application state.

## Consequences

- Editor behavior is testable without a browser canvas.
- Import/export can evolve independently of React components.
- Heavy or optional capabilities can be lazy-loaded.

## Alternatives Considered

- Canvas-only rendering: rejected because SVG import/export and node editing
  are first-class v1 needs.
- Backend document model: rejected by ADR 0001.
