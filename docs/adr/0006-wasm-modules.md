# 0006 - WASM Modules

## Status

Accepted

## Context

The product direction calls for serious vector tooling using browser-native
compute, including a future lyon-rs WASM path engine, skia-WASM rendering
experiments, libigl-style geometry tools, WebGPU, and ColorThief.

## Decision

For v1, ship a TypeScript vector core with browser SVG APIs and lazy-loaded
ColorThief-compatible palette extraction. Expose an engine adapter boundary so
future WASM path engines can be added behind a user action without changing UI
state. Detect WebGPU capability and surface it in the runtime status panel.

GitHub Pages cannot set COOP/COEP headers, so WASM that requires
`SharedArrayBuffer` is deferred or must use a service-worker compatibility
strategy in a later ADR.

## Consequences

- Initial JS stays small and fast.
- Heavy geometry/rendering code can be introduced later without changing the
  editor feature surface.
- The v1 app is honest about browser capability status.

## Alternatives Considered

- Compile lyon-rs/skia/libigl into v1 immediately: rejected because the static
  app needs a stable editor first and Pages header limits affect some modules.
- Runtime backend for vector operations: rejected by ADR 0001.
